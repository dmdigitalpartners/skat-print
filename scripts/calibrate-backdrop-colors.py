#!/usr/bin/env python3
"""Phase 0: measure each catalogue image's studio-backdrop color/uniformity.

Samples the 2%-margin border ring of every public/assets/portfolio/**/*.jpg,
computes the mean RGB and per-channel stdev of that ring, and writes a JSON
manifest used by generate-catalogue-backgrounds.py to set adaptive masking
thresholds per image. Images whose border stdev exceeds OUTLIER_STDEV are
flagged for manual handling instead of the automated border-seeded mask.

Usage: python3 scripts/calibrate-backdrop-colors.py
"""

import json
import statistics as st
from pathlib import Path

from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent
PORTFOLIO_ROOT = REPO_ROOT / "public" / "assets" / "portfolio"
OUTPUT_PATH = REPO_ROOT / "scripts" / "output" / "backdrop-calibration.json"

OUTLIER_STDEV = 20.0  # border R-channel stdev above this -> not a uniform seamless backdrop


def sample_border_ring(im: Image.Image) -> list[tuple[int, int, int]]:
    """Sample pixels along a 2%-margin ring just inside the image border."""
    w, h = im.size
    px = im.load()
    margin = max(2, int(min(w, h) * 0.02))
    samples = []
    step_x = max(1, w // 40)
    step_y = max(1, h // 40)
    for x in range(0, w, step_x):
        samples.append(px[x, margin])
        samples.append(px[x, h - 1 - margin])
    for y in range(0, h, step_y):
        samples.append(px[margin, y])
        samples.append(px[w - 1 - margin, y])
    return samples


def main() -> None:
    files = sorted(PORTFOLIO_ROOT.glob("*/*.jpg"))
    if not files:
        raise SystemExit(f"No portfolio images found under {PORTFOLIO_ROOT}")

    manifest = {}
    uniform_count = 0
    outlier_count = 0

    for path in files:
        rel = path.relative_to(REPO_ROOT).as_posix()
        im = Image.open(path).convert("RGB")
        samples = sample_border_ring(im)
        rs = [s[0] for s in samples]
        gs = [s[1] for s in samples]
        bs = [s[2] for s in samples]
        mean_rgb = (round(st.mean(rs), 1), round(st.mean(gs), 1), round(st.mean(bs), 1))
        stdev = round(st.pstdev(rs), 2)
        is_outlier = stdev > OUTLIER_STDEV
        category = path.parent.name

        manifest[rel] = {
            "category": category,
            "width": im.width,
            "height": im.height,
            "backdrop_rgb": mean_rgb,
            "backdrop_stdev": stdev,
            "outlier": is_outlier,
        }
        if is_outlier:
            outlier_count += 1
        else:
            uniform_count += 1

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(manifest, indent=2, sort_keys=True))

    print(f"Calibrated {len(files)} images -> {OUTPUT_PATH.relative_to(REPO_ROOT)}")
    print(f"  uniform backdrop (automated pipeline): {uniform_count}")
    print(f"  outlier (manual matte required):       {outlier_count}")
    if outlier_count:
        print("\nOutliers:")
        for rel, entry in manifest.items():
            if entry["outlier"]:
                print(f"  {rel}  stdev={entry['backdrop_stdev']}")


if __name__ == "__main__":
    main()
