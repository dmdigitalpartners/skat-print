#!/usr/bin/env python3
"""Automated proxy for the 'white product on light backdrop' failure mode:
finds background-classified regions that DON'T touch the image border, i.e.
holes punched into the interior of the product silhouette. A few small holes
are normal (real cutout windows, dark interior compartments); a large or
widely-scattered hole area means the mask likely ate part of the product.

Usage: python3 scripts/qc-interior-holes.py
"""

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib import masking  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent
CALIBRATION_PATH = REPO_ROOT / "scripts" / "output" / "backdrop-calibration.json"

INTERIOR_HOLE_PCT_THRESHOLD = 3.0  # % of product bbox area
SPECKLE_COMPONENT_COUNT_THRESHOLD = 40  # many small holes = noisy/speckled mask


def analyze(rel_path: str, entry: dict) -> dict:
    src = REPO_ROOT / "scripts" / "output" / "portfolio-originals" / rel_path.split("public/assets/portfolio/", 1)[1]
    im = Image.open(src).convert("RGB")
    alpha, _debug = masking.compute_alpha_mask(im, tuple(entry["backdrop_rgb"]), entry["backdrop_stdev"])
    fg_mask = alpha > 0.5

    ys, xs = np.where(fg_mask)
    if len(xs) == 0:
        return {"rel_path": rel_path, "error": "empty mask"}
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    bbox_area = (x1 - x0 + 1) * (y1 - y0 + 1)

    bg_mask = ~fg_mask
    labeled, n = ndimage.label(bg_mask)
    border_labels = (
        set(np.unique(labeled[0, :]))
        | set(np.unique(labeled[-1, :]))
        | set(np.unique(labeled[:, 0]))
        | set(np.unique(labeled[:, -1]))
    )
    border_labels.discard(0)

    interior_hole_area = 0
    interior_component_count = 0
    if n > 0:
        for label_id in range(1, n + 1):
            if label_id in border_labels:
                continue
            area = int(np.sum(labeled == label_id))
            if area < 4:  # ignore single-pixel noise
                continue
            interior_hole_area += area
            interior_component_count += 1

    interior_hole_pct = 100.0 * interior_hole_area / max(bbox_area, 1)

    return {
        "rel_path": rel_path,
        "category": entry["category"],
        "interior_hole_pct": round(interior_hole_pct, 2),
        "interior_component_count": interior_component_count,
        "flag": interior_hole_pct > INTERIOR_HOLE_PCT_THRESHOLD
        or interior_component_count > SPECKLE_COMPONENT_COUNT_THRESHOLD,
    }


def main() -> None:
    calibration = json.loads(CALIBRATION_PATH.read_text())
    results = []
    for rel, entry in calibration.items():
        if entry["outlier"]:
            continue
        results.append(analyze(rel, entry))

    flagged = [r for r in results if r.get("flag")]
    flagged.sort(key=lambda r: -r["interior_hole_pct"])

    print(f"Scanned {len(results)} images, {len(flagged)} flagged for interior mask holes:\n")
    for r in flagged:
        print(f"  {r['rel_path']}  holes={r['interior_hole_pct']}%  components={r['interior_component_count']}")


if __name__ == "__main__":
    main()
