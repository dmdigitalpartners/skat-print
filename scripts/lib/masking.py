"""Border-seeded, chroma-aware background matting for catalogue product photos.

Why chroma (Lab a/b), not raw RGB/Lab distance from the backdrop color:
the product's own cast shadow is a DARKER version of the same neutral backdrop
(lower L, same near-zero a/b), so a plain "distance from backdrop RGB" metric
would score the shadow as far from the backdrop and wrongly keep it as
semi-opaque foreground. Scoring only hue/chroma distance lets the shadow keep
reading as "backdrop family" regardless of how dark it gets, while an actual
achromatic product surface (white/black/gray packaging) still survives because
it isn't connected to the image border through a continuous run of near-neutral
pixels (see border-seeded region growth below).
"""

from __future__ import annotations

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage


def _to_lab_array(im: Image.Image) -> np.ndarray:
    """HxWx3 float32 array in Pillow's 8-bit LAB encoding (L, a, b all 0-255)."""
    return np.asarray(im.convert("RGB").convert("LAB"), dtype=np.float32)


def _rgb_to_lab_point(rgb: tuple[float, float, float]) -> np.ndarray:
    swatch = Image.new("RGB", (1, 1), tuple(int(round(c)) for c in rgb))
    return np.asarray(swatch.convert("LAB"), dtype=np.float32)[0, 0]


def _smoothstep(edge0: float, edge1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - edge0) / max(edge1 - edge0, 1e-6), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def compute_alpha_mask(
    im: Image.Image,
    backdrop_rgb: tuple[float, float, float],
    backdrop_stdev: float,
) -> tuple[np.ndarray, dict]:
    """Return (alpha, debug). alpha: float32 HxW in [0,1], 1=product, 0=backdrop/shadow."""
    lab = _to_lab_array(im)
    L_ch, a_ch, b_ch = lab[..., 0], lab[..., 1], lab[..., 2]
    bL, ba, bb = _rgb_to_lab_point(backdrop_rgb)

    chroma_dist = np.sqrt((a_ch - ba) ** 2 + (b_ch - bb) ** 2)
    # Light pre-smoothing: raw per-pixel chroma distance is noisy enough
    # (JPEG blocking, sensor noise) that individual pixels right at the
    # product/backdrop boundary randomly flip across the threshold, producing
    # a speckled boundary that survives 1px erosion. Smoothing the distance
    # field first — not the final mask — keeps the boundary itself sharp
    # while removing that pixel-level jitter.
    chroma_dist = ndimage.gaussian_filter(chroma_dist, sigma=1.0)

    # Adaptive thresholds seeded from this image's own measured border noise.
    low = max(3.0 * backdrop_stdev * 0.35 + 3.0, 4.0)
    high = low + 14.0

    achromatic_score = 1.0 - _smoothstep(low, high, chroma_dist)  # 1 = backdrop-hue family

    # Lightness guard: pure black and pure gray are BOTH "achromatic" in chroma
    # terms, so without this a black product surface reads as indistinguishable
    # from the gray backdrop. A real cast shadow on a diffuse-lit studio floor
    # rarely darkens past ~half the backdrop's own brightness; anything darker
    # is real (dark) product material, not shadow, regardless of hue match.
    lightness_ratio = L_ch / max(float(bL), 1.0)
    shadow_plausible = _smoothstep(0.45, 0.65, lightness_ratio)
    achromatic_score = achromatic_score * shadow_plausible

    # Border-seeded region growth: only trust the achromatic reading where it
    # forms a component that touches the image edge, so an interior white/gray
    # product face never gets treated as background.
    binary_seed = achromatic_score > 0.5
    labeled, n = ndimage.label(binary_seed)
    if n > 0:
        border_labels = (
            set(np.unique(labeled[0, :]))
            | set(np.unique(labeled[-1, :]))
            | set(np.unique(labeled[:, 0]))
            | set(np.unique(labeled[:, -1]))
        )
        border_labels.discard(0)
        connected = np.isin(labeled, list(border_labels))
    else:
        connected = np.zeros_like(binary_seed)

    # Binarize the foreground decisively, THEN erode it by ~1px before
    # re-softening the edge. The wide chroma smoothstep above leaves a several-
    # pixel-wide "confused middle" band where the pixel is a blend of true
    # product-edge color and backdrop; despill can't perfectly invert that
    # blend, so compositing it straight onto a new (very different-toned)
    # background leaves a visible halo of the OLD backdrop color right at the
    # edge. Eroding first discards that contaminated ring outright — anything
    # within ~1px of the boundary becomes fully background and gets fully
    # replaced — then a small blur reintroduces smooth (not jagged) anti-
    # aliasing from a clean binary edge, with a much narrower, less-contaminated
    # transition band for despill to work on.
    foreground_binary = ~connected
    # A full 3x3 (8-connected) structuring element erodes/opens diagonal
    # edges evenly — the default cross-shaped element eats diagonals
    # unevenly, leaving a visible zigzag/sawtooth rather than a clean line.
    struct8 = np.ones((3, 3), dtype=bool)
    # Opening (erode then dilate) first drops isolated speckle flecks near the
    # boundary that a plain erosion of the final mask wouldn't clean up;
    # the extra erosion pass after that eats the contaminated edge ring itself.
    foreground_opened = ndimage.binary_opening(foreground_binary, structure=struct8, iterations=1, border_value=0)
    foreground_eroded = ndimage.binary_erosion(foreground_opened, structure=struct8, iterations=2, border_value=0)
    edge_alpha = ndimage.gaussian_filter(foreground_eroded.astype(np.float32), sigma=1.8)
    alpha = np.clip(edge_alpha, 0.0, 1.0)

    h, w = alpha.shape
    debug = {
        "foreground_pct": float(np.mean(alpha > 0.5) * 100),
        "mask_leak": bool(
            np.mean(alpha[0, :] > 0.9) > 0.3
            or np.mean(alpha[-1, :] > 0.9) > 0.3
            or np.mean(alpha[:, 0] > 0.9) > 0.3
            or np.mean(alpha[:, -1] > 0.9) > 0.3
        ),
        "threshold_low": low,
        "threshold_high": high,
    }
    return alpha, debug


def despill(im: Image.Image, alpha: np.ndarray, backdrop_rgb: tuple[float, float, float]) -> np.ndarray:
    """Unpremultiply partial-alpha edge pixels to remove backdrop-color fringing."""
    rgb = np.asarray(im.convert("RGB"), dtype=np.float32)
    bg = np.array(backdrop_rgb, dtype=np.float32)
    a = alpha[..., None]
    a_safe = np.clip(a, 0.12, 1.0)  # floor avoids blow-up near-fully-transparent pixels
    fg = (rgb - (1.0 - a) * bg) / a_safe
    return np.clip(fg, 0, 255).astype(np.uint8)


def extract_foreground(
    im: Image.Image,
    backdrop_rgb: tuple[float, float, float],
    backdrop_stdev: float,
) -> tuple[Image.Image, np.ndarray, dict]:
    """Returns (rgba_cutout, alpha_float, debug)."""
    alpha, debug = compute_alpha_mask(im, backdrop_rgb, backdrop_stdev)
    fg_rgb = despill(im, alpha, backdrop_rgb)
    rgba = np.dstack([fg_rgb, (alpha * 255).astype(np.uint8)])
    return Image.fromarray(rgba, mode="RGBA"), alpha, debug


def product_footprint(alpha: np.ndarray, threshold: float = 0.5) -> dict | None:
    """Bounding box + the horizontal extent of the product's base, for shadow placement."""
    mask = alpha > threshold
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return None
    x0, x1, y0, y1 = int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())
    band_h = max(1, int((y1 - y0) * 0.08))
    bottom_band = mask[max(y0, y1 - band_h) : y1 + 1, :]
    bxs = np.where(bottom_band.any(axis=0))[0]
    if len(bxs) == 0:
        bxs = xs
    return {
        "bbox": (x0, y0, x1, y1),
        "bottom_x_range": (int(bxs.min()), int(bxs.max())),
        "bottom_y": y1,
    }


def synthesize_shadow(canvas_size: tuple[int, int], footprint: dict, dark_bg: bool) -> Image.Image:
    """A soft blurred ellipse under the product's real footprint.

    On light backgrounds: a conventional dark contact shadow.
    On dark/navy backgrounds: a faint *lighter* ambient patch instead — a gray
    shadow reads as a visible smudge on navy, so we brighten slightly there.
    """
    w, h = canvas_size
    x0, x1 = footprint["bottom_x_range"]
    y = footprint["bottom_y"]
    cx = (x0 + x1) / 2.0
    ew = max(60.0, (x1 - x0) * 1.18)
    eh = max(16.0, ew * 0.16)

    layer = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(layer)
    draw.ellipse([cx - ew / 2, y - eh / 2, cx + ew / 2, y + eh / 2], fill=255)
    layer = layer.filter(ImageFilter.GaussianBlur(max(10.0, ew * 0.14)))

    peak = 46 if not dark_bg else 26  # 0-255; conservative — QC will tune this
    arr = (np.asarray(layer, dtype=np.float32) / 255.0 * peak).astype(np.uint8)
    return Image.fromarray(arr, mode="L")
