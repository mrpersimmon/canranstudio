#!/usr/bin/env python3
"""Turn a six-cell transparent ImageGen sheet into stable atlas layers."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CANVAS = 1024


def opaque_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise ValueError("asset cell contains no visible pixels")
    return bbox


def trim(image: Image.Image) -> Image.Image:
    return image.crop(opaque_bbox(image))


def place(
    image: Image.Image,
    *,
    center: tuple[int, int],
    max_size: tuple[int, int],
) -> Image.Image:
    image = trim(image)
    ratio = min(max_size[0] / image.width, max_size[1] / image.height)
    width = max(1, round(image.width * ratio))
    height = max(1, round(image.height * ratio))
    resized = image.resize((width, height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    left = round(center[0] - width / 2)
    top = round(center[1] - height / 2)
    canvas.alpha_composite(resized, (left, top))
    return canvas


def cell(sheet: Image.Image, column: int, row: int) -> Image.Image:
    width = sheet.width // 3
    height = sheet.height // 2
    return sheet.crop((column * width, row * height, (column + 1) * width, (row + 1) * height))


def split_final(cell_image: Image.Image) -> tuple[Image.Image, Image.Image]:
    # ImageGen consistently places bunting/lanterns above and the crest below.
    split = round(cell_image.height * 0.52)
    overlap = round(cell_image.height * 0.08)
    celebration = cell_image.crop((0, 0, cell_image.width, split + overlap))
    souvenir = cell_image.crop((0, split - overlap, cell_image.width, cell_image.height))
    return celebration, souvenir


def save(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sheet", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--stage-count", type=int, choices=(4, 5), required=True)
    parser.add_argument("--stage-names", nargs="+", required=True)
    parser.add_argument("--souvenir-name", required=True)
    args = parser.parse_args()

    if len(args.stage_names) != args.stage_count:
        raise SystemExit("--stage-names must match --stage-count")

    sheet_path = Path(args.sheet)
    out_dir = Path(args.out_dir)
    with Image.open(sheet_path) as opened:
        sheet = opened.convert("RGBA")

    base = place(cell(sheet, 0, 0), center=(512, 520), max_size=(900, 900))
    raw_stages = [
        cell(sheet, 1, 0),
        cell(sheet, 2, 0),
        cell(sheet, 0, 1),
        cell(sheet, 1, 1),
    ]
    placements = [
        ((310, 690), (410, 350)),
        ((710, 700), (430, 350)),
        ((520, 235), (390, 320)),
        ((765, 650), (370, 360)),
    ]

    final_cell = cell(sheet, 2, 1)
    if args.stage_count == 5:
        celebration, souvenir_raw = split_final(final_cell)
        raw_stages.append(celebration)
        placements.append(((512, 205), (780, 300)))
    else:
        souvenir_raw = final_cell

    stage_layers = [
        place(raw, center=center, max_size=max_size)
        for raw, (center, max_size) in zip(raw_stages, placements, strict=True)
    ]
    souvenir = place(souvenir_raw, center=(512, 512), max_size=(620, 620))

    save(base, out_dir / "landmark-base.png")
    for index, (name, layer) in enumerate(zip(args.stage_names, stage_layers, strict=True), start=1):
        save(layer, out_dir / f"growth-{index:02d}-{name}.png")
    save(souvenir, out_dir / f"{args.souvenir_name}.png")

    preview = base.copy()
    for layer in stage_layers:
        preview.alpha_composite(layer)
    preview.thumbnail((640, 640), Image.Resampling.LANCZOS)
    save(preview, out_dir / "mobile-preview.png")


if __name__ == "__main__":
    main()
