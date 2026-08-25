#!/usr/bin/env python3
"""Main pipeline: mask -> recomposite onto procedural background -> synthetic
shadow -> final JPEG encode. Reads scripts/output/backdrop-calibration.json
(run calibrate-backdrop-colors.py first).

Usage:
  python3 scripts/generate-catalogue-backgrounds.py --sample     # Phase 1: ~8 test images
  python3 scripts/generate-catalogue-backgrounds.py --all        # Phase 4: full batch
  python3 scripts/generate-catalogue-backgrounds.py --only <relative/path.jpg> [...]

Always writes to scripts/output/portfolio-staged/<category>/ (staging — never
touches public/assets directly) plus a 3-panel QC image per file under
scripts/output/qc/.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib import background_recipes as recipes  # noqa: E402
from lib import masking  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent
CALIBRATION_PATH = REPO_ROOT / "scripts" / "output" / "backdrop-calibration.json"
STAGED_ROOT = REPO_ROOT / "scripts" / "output" / "portfolio-staged"
QC_ROOT = REPO_ROOT / "scripts" / "output" / "qc"

JPEG_QUALITY = 80

# Representative sample spanning all 5 categories + the higher-variance shots
# flagged during calibration — see the approved plan for why these were picked.
SAMPLE_SET = [
    "public/assets/portfolio/pos-displays/pos-displays-01.jpg",
    "public/assets/portfolio/pos-displays/pos-displays-08.jpg",
    "public/assets/portfolio/pos-displays/pos-displays-15.jpg",
    "public/assets/portfolio/food-packaging/food-packaging-01.jpg",
    "public/assets/portfolio/food-packaging/food-packaging-12.jpg",
    "public/assets/portfolio/alcohol-packaging/alcohol-packaging-hero.jpg",
    "public/assets/portfolio/cosmetics-packaging/cosmetics-packaging-01.jpg",
    "public/assets/portfolio/custom-packaging/custom-packaging-02.jpg",
    "public/assets/portfolio/alcohol-packaging/alcohol-packaging-01.jpg",
]


def load_calibration() -> dict:
    if not CALIBRATION_PATH.exists():
        raise SystemExit("Run scripts/calibrate-backdrop-colors.py first.")
    return json.loads(CALIBRATION_PATH.read_text())


def process_one(rel_path: str, entry: dict, save_qc: bool) -> dict:
    src = REPO_ROOT / rel_path
    im = Image.open(src).convert("RGB")
    backdrop_rgb = tuple(entry["backdrop_rgb"])
    backdrop_stdev = entry["backdrop_stdev"]

    rgba_cutout, alpha, debug = masking.extract_foreground(im, backdrop_rgb, backdrop_stdev)
    footprint = masking.product_footprint(alpha)
    if footprint is None:
        raise RuntimeError(f"No foreground detected for {rel_path} — mask failed entirely.")

    category = entry["category"]
    bg_result = recipes.build_background(category, im.size, image_key=rel_path)
    shadow_l = masking.synthesize_shadow(im.size, footprint, dark_bg=bg_result.dark_bg)

    canvas = np.asarray(bg_result.canvas_rgb, dtype=np.float32)
    s = np.asarray(shadow_l, dtype=np.float32)[..., None] / 255.0
    if bg_result.dark_bg:
        target = np.array(recipes.ACCENT, dtype=np.float32)
        canvas = canvas + s * (target - canvas) * 0.6
    else:
        canvas = canvas * (1.0 - s)
    canvas_img = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8), mode="RGB").convert("RGBA")
    canvas_img.alpha_composite(rgba_cutout)
    final_rgb = canvas_img.convert("RGB")

    dest = STAGED_ROOT / rel_path.split("public/assets/portfolio/", 1)[1]
    dest.parent.mkdir(parents=True, exist_ok=True)
    final_rgb.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True)

    result = {
        "rel_path": rel_path,
        "dest": str(dest.relative_to(REPO_ROOT)),
        "foreground_pct": debug["foreground_pct"],
        "mask_leak": debug["mask_leak"],
        "dark_bg": bg_result.dark_bg,
    }

    if save_qc:
        QC_ROOT.mkdir(parents=True, exist_ok=True)
        mask_vis = Image.fromarray((alpha * 255).astype(np.uint8), mode="L").convert("RGB")
        panels = [im, mask_vis, final_rgb]
        pw, ph = 360, int(360 * im.height / im.width)
        thumbs = [p.resize((pw, ph)) for p in panels]
        sheet = Image.new("RGB", (pw * 3 + 20, ph), (30, 30, 30))
        for i, t in enumerate(thumbs):
            sheet.paste(t, (i * (pw + 10), 0))
        qc_name = rel_path.replace("public/assets/portfolio/", "").replace("/", "__")
        sheet.save(QC_ROOT / f"{qc_name}.jpg", "JPEG", quality=85)

    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--sample", action="store_true", help="Run the fixed representative sample set")
    group.add_argument("--all", action="store_true", help="Run every non-outlier calibrated image")
    group.add_argument("--only", nargs="+", help="Run only these relative paths")
    args = parser.parse_args()

    calibration = load_calibration()

    if args.sample:
        targets = SAMPLE_SET
    elif args.only:
        targets = args.only
    else:
        targets = [rel for rel, e in calibration.items() if not e["outlier"]]

    results = []
    errors = []
    for rel in targets:
        entry = calibration.get(rel)
        if entry is None:
            errors.append((rel, "not found in calibration manifest"))
            continue
        try:
            results.append(process_one(rel, entry, save_qc=True))
        except Exception as exc:  # noqa: BLE001 — report and continue batch
            errors.append((rel, str(exc)))

    print(f"Processed {len(results)}/{len(targets)} images -> {STAGED_ROOT.relative_to(REPO_ROOT)}")
    flagged = [r for r in results if r["mask_leak"] or r["foreground_pct"] < 5 or r["foreground_pct"] > 95]
    if flagged:
        print(f"\n{len(flagged)} image(s) need a closer look (mask_leak or implausible foreground%):")
        for r in flagged:
            print(f"  {r['rel_path']}  fg%={r['foreground_pct']:.1f}  mask_leak={r['mask_leak']}")
    if errors:
        print(f"\n{len(errors)} error(s):")
        for rel, msg in errors:
            print(f"  {rel}: {msg}")
    print(f"\nQC contact sheets -> {QC_ROOT.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
