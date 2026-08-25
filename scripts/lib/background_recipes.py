"""Procedural background recipes — gradients/glow/grain built only from the
site's own design tokens (src/styles/tokens.css) and existing signature motifs
(CTABanner/TrustedBy's 135° navy gradient, its cyan glow blob, the Hero's
grain texture, CTABanner's diagonal hairline pattern). No invented colors.

Each category gets a distinct but related recipe so the catalogue reads as
one visual family, not one background pasted behind every product.
"""

from __future__ import annotations

import hashlib
import math
from dataclasses import dataclass

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

# --- tokens.css values (hardcoded here; keep in sync with src/styles/tokens.css) ---
PRIMARY = (26, 43, 74)  # #1A2B4A
PRIMARY_DARK = (15, 28, 51)  # #0F1C33
PRIMARY_LIGHT = (36, 53, 99)  # #243563
ACCENT = (0, 152, 212)  # #0098D4
BG = (250, 250, 248)  # #FAFAF8
BG_SURFACE = (244, 242, 237)  # #F4F2ED
BG_ELEVATED = (237, 234, 227)  # #EDEAE3


def _seed_for(key: str) -> np.random.Generator:
    h = hashlib.sha256(key.encode()).digest()
    return np.random.default_rng(int.from_bytes(h[:8], "big"))


def _linear_gradient(size: tuple[int, int], colors: list[tuple[int, int, int]], angle_deg: float = 135.0) -> Image.Image:
    w, h = size
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    theta = math.radians(angle_deg)
    dx, dy = math.cos(theta), math.sin(theta)
    proj = xs * dx + ys * dy
    proj = (proj - proj.min()) / max(proj.max() - proj.min(), 1e-6)

    n = len(colors)
    stops = np.linspace(0.0, 1.0, n)
    out = np.zeros((h, w, 3), dtype=np.float32)
    for ch in range(3):
        out[..., ch] = np.interp(proj, stops, [c[ch] for c in colors])
    return Image.fromarray(out.astype(np.uint8), mode="RGB")


def _radial_glow(size: tuple[int, int], center: tuple[float, float], radius: float, color: tuple[int, int, int], peak_alpha: float) -> Image.Image:
    w, h = size
    layer = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(layer)
    cx, cy = center
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=255)
    layer = layer.filter(ImageFilter.GaussianBlur(radius * 0.65))
    alpha = (np.asarray(layer, dtype=np.float32) / 255.0) * peak_alpha
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., 0] = color[0]
    rgba[..., 1] = color[1]
    rgba[..., 2] = color[2]
    rgba[..., 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(rgba, mode="RGBA")


def _add_hairlines(base_rgba: Image.Image, opacity: float, rng: np.random.Generator, spacing: int = 40, line_width: int = 1, color=(255, 255, 255)) -> Image.Image:
    w, h = base_rgba.size
    diag = int(math.hypot(w, h))
    tile = Image.new("L", (diag, diag), 0)
    draw = ImageDraw.Draw(tile)
    for x in range(0, diag, spacing):
        draw.line([(x, 0), (x, diag)], fill=255, width=line_width)
    tile = tile.rotate(45, expand=False)
    tile = tile.crop((0, 0, w, h)) if tile.size[0] >= w and tile.size[1] >= h else tile.resize((w, h))
    alpha = (np.asarray(tile, dtype=np.float32) / 255.0) * opacity
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = color
    rgba[..., 3] = (alpha * 255).astype(np.uint8)
    layer = Image.fromarray(rgba, mode="RGBA")
    out = base_rgba.copy()
    out.alpha_composite(layer)
    return out


def _add_grain(base_rgb: Image.Image, opacity: float, rng: np.random.Generator) -> Image.Image:
    w, h = base_rgb.size
    noise = rng.normal(loc=0.0, scale=1.0, size=(h, w)).astype(np.float32)
    noise = (noise - noise.min()) / max(noise.max() - noise.min(), 1e-6)
    gray = (noise * 255).astype(np.uint8)
    grain_rgb = Image.fromarray(gray, mode="L").convert("RGB")
    return Image.blend(base_rgb, grain_rgb, opacity)


@dataclass
class BackgroundResult:
    canvas_rgb: Image.Image  # final composited background, no product yet
    dark_bg: bool  # whether the base is a dark navy (affects shadow synthesis)


def _base_canvas(size, gradient_colors, dark_bg, glow_color, glow_corner, glow_alpha, hairline, rng):
    w, h = size
    canvas = _linear_gradient(size, gradient_colors, angle_deg=135.0).convert("RGBA")

    corners = {
        "top-left": (w * 0.12, h * 0.1),
        "top-right": (w * 0.88, h * 0.1),
        "bottom-left": (w * 0.12, h * 0.9),
        "bottom-right": (w * 0.88, h * 0.9),
    }
    cx, cy = corners[glow_corner]
    radius = min(w, h) * 0.55
    glow = _radial_glow(size, (cx, cy), radius, glow_color, glow_alpha)
    canvas.alpha_composite(glow)

    if hairline:
        canvas = _add_hairlines(canvas, opacity=0.035, rng=rng)

    canvas = _add_vignette(canvas, strength=0.16 if not dark_bg else 0.22)

    canvas_rgb = canvas.convert("RGB")
    canvas_rgb = _add_grain(canvas_rgb, opacity=0.03, rng=rng)
    return canvas_rgb


def _add_vignette(base_rgba: Image.Image, strength: float) -> Image.Image:
    """Soft edge darkening so every card reads as a bounded, art-directed
    surface — without this, a light recipe (cosmetics/food) sits at nearly
    the same tone as the site's own light page background and the product
    card loses definition entirely."""
    w, h = base_rgba.size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx, cy = w / 2.0, h / 2.0
    dist = np.sqrt(((xx - cx) / (w / 2.0)) ** 2 + ((yy - cy) / (h / 2.0)) ** 2)
    falloff = np.clip((dist - 0.55) / 0.6, 0.0, 1.0) ** 1.6 * strength

    arr = np.asarray(base_rgba.convert("RGB"), dtype=np.float32)
    arr = arr * (1.0 - falloff[..., None])
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), mode="RGB").convert("RGBA")


def build_background(category: str, size: tuple[int, int], image_key: str) -> BackgroundResult:
    rng = _seed_for(image_key)
    w, h = size

    if category == "pos-displays":
        canvas = _base_canvas(
            size, [PRIMARY_DARK, PRIMARY, PRIMARY_LIGHT], dark_bg=True,
            glow_color=ACCENT, glow_corner="bottom-right", glow_alpha=0.16,
            hairline=bool(rng.random() < 0.3), rng=rng,
        )
        return BackgroundResult(canvas, dark_bg=True)

    if category == "food-packaging":
        canvas = _base_canvas(
            size, [BG_SURFACE, BG, BG_ELEVATED], dark_bg=False,
            glow_color=ACCENT, glow_corner="top-left", glow_alpha=0.10,
            hairline=False, rng=rng,
        )
        return BackgroundResult(canvas, dark_bg=False)

    if category == "alcohol-packaging":
        canvas = _base_canvas(
            size, [PRIMARY_DARK, PRIMARY, PRIMARY], dark_bg=True,
            glow_color=ACCENT, glow_corner="top-right", glow_alpha=0.18,
            hairline=True, rng=rng,
        )
        return BackgroundResult(canvas, dark_bg=True)

    if category == "cosmetics-packaging":
        canvas = _base_canvas(
            size, [BG_ELEVATED, BG_SURFACE, BG], dark_bg=False,
            glow_color=ACCENT, glow_corner="top-left", glow_alpha=0.08,
            hairline=False, rng=rng,
        )
        return BackgroundResult(canvas, dark_bg=False)

    if category == "custom-packaging":
        use_dark = bool(rng.random() < 0.5)
        if use_dark:
            canvas = _base_canvas(
                size, [PRIMARY_DARK, PRIMARY, PRIMARY_LIGHT], dark_bg=True,
                glow_color=ACCENT, glow_corner="bottom-right", glow_alpha=0.15,
                hairline=bool(rng.random() < 0.3), rng=rng,
            )
        else:
            canvas = _base_canvas(
                size, [BG_SURFACE, BG, BG_ELEVATED], dark_bg=False,
                glow_color=ACCENT, glow_corner="top-left", glow_alpha=0.10,
                hairline=False, rng=rng,
            )
        return BackgroundResult(canvas, dark_bg=use_dark)

    raise ValueError(f"Unknown category: {category}")
