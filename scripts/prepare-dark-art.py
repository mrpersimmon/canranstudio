"""Export existing imagegen artwork as dark-theme cutouts.

The user authorized local background removal on 2026-09-06. This only removes
edge-connected white matte and reviewed empty gaps, then decontaminates its two-pixel edge. Original
masters, interior RGB pixels, canvas dimensions and character poses stay intact.
Requires Pillow and numpy; this is an authoring tool, not a product dependency.
"""
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'poc/learning-path/assets/dark'
SOURCES = [
    ('poc/lesson1-2-experience/assets/v3/' + name + '.png', name)
    for name in ('keeper', 'customer', 'cat', 'car')
] + [
    ('poc/learning-path/assets/cats/' + name + '.png', name)
    for name in ('mr-blake-v1', 'hans-v2', 'naoko-v1', 'changwoo-v1', 'luming-v1', 'xiaohui-v1')
] + [('poc/learning-path/assets/props/cloakroom-v1.png', 'cloakroom-v1')]
# Manually inspected empty spaces: between coats, below coats and between the
# counter and umbrella stand. No seeds are placed on white clothing, fur or eyes.
EMPTY_GAPS = {'cloakroom-v1': [(399, 232), (515, 232), (664, 260), (829, 240),
                             (438, 623), (708, 617), (937, 756)]}


def cutout(original, name):
    rgb = np.asarray(original.convert('RGB')).copy()
    h, w = rgb.shape[:2]
    # Keep interior white fur and eye highlights. Only white connected to the
    # outside of the image is eligible for removal.
    floor, spread = (225, 28) if name == 'cloakroom-v1' else (240, 16)
    white = (rgb.min(axis=2) >= floor) & (np.ptp(rgb.astype(np.int16), axis=2) <= spread)
    # Copy: fromarray can expose a read-only shared buffer; floodfill otherwise
    # silently returns when its first pixel assignment fails.
    mask = Image.fromarray((white * 255).astype('uint8')).copy()
    for point in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), *EMPTY_GAPS.get(name, [])]:
        if mask.getpixel(point) == 255:
            ImageDraw.floodfill(mask, point, 128)
    background = np.asarray(mask) == 128
    assert background.any(), 'No connected white background was removed'
    foreground = ~background
    core = np.asarray(Image.fromarray((foreground * 255).astype('uint8')).filter(ImageFilter.MinFilter(5))) > 0
    edge = foreground & ~core
    alpha = foreground.astype('float32')
    corrected = rgb.astype('float32')
    unresolved = edge.copy()
    # Estimate the unmatted edge color from the closest opaque interior pixel.
    offsets = sorted(((x, y) for y in range(-3, 4) for x in range(-3, 4) if x or y), key=lambda p: p[0] ** 2 + p[1] ** 2)
    color = rgb.astype('float32')
    for dx, dy in offsets:
        sy, sx = slice(max(0, -dy), min(h, h - dy)), slice(max(0, -dx), min(w, w - dx))
        ty, tx = slice(max(0, dy), min(h, h + dy)), slice(max(0, dx), min(w, w + dx))
        use = unresolved[ty, tx] & core[sy, sx]
        if not use.any():
            continue
        observed, interior = color[ty, tx][use], color[sy, sx][use]
        distance, model = 255 - observed, 255 - interior
        denom = (model * model).sum(axis=1)
        ratio = np.divide((distance * model).sum(axis=1), denom, out=np.ones_like(denom), where=denom > 4)
        ratio = np.clip(ratio, .04, 1)
        clean = np.clip((observed - 255 * (1 - ratio[:, None])) / ratio[:, None], 0, 255)
        alpha[ty, tx][use] = ratio
        corrected[ty, tx][use] = clean
        unresolved[ty, tx][use] = False
    rgba = np.dstack((corrected.clip(0, 255).astype('uint8'), np.rint(alpha * 255).astype('uint8')))
    rgba[background, :3] = 0
    assert np.array_equal(rgba[core, :3], rgb[core]), 'Interior artwork must be unchanged'
    return Image.fromarray(rgba), {'removedBackgroundPixels': int(background.sum()), 'preservedInteriorPixels': int(core.sum()), 'edgePixels': int(edge.sum())}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for source, name in SOURCES:
        path = ROOT / source
        original = Image.open(path)
        result, stats = cutout(original, name)
        master = OUT / (name + '-cutout.png')
        result.save(master, optimize=True)
        runtime = result.copy()
        target = (420, 420) if name in ('car', 'cloakroom-v1') else (640, 960) if result.height > result.width else (640, 640)
        runtime.thumbnail(target, Image.Resampling.LANCZOS)
        runtime_path = OUT / (name + '-cutout.webp')
        # Keep the full-resolution PNG as the lossless master. Browser assets
        # use high-quality WebP color with a lossless alpha channel to retain the
        # existing 4 MiB course-package budget.
        runtime.save(runtime_path, 'WEBP', quality=92, method=6)
        alpha = np.asarray(runtime.getchannel('A'))
        assert alpha.min() == 0 and alpha.max() == 255
        assert np.array_equal(alpha, np.asarray(Image.open(runtime_path).getchannel('A')))
        record = {'source': source, 'sourceSha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'master': str(master.relative_to(ROOT)), 'runtime': str(runtime_path.relative_to(ROOT)), 'runtimeSha256': hashlib.sha256(runtime_path.read_bytes()).hexdigest(), 'sourceSize': list(original.size), 'runtimeSize': list(runtime.size), 'alphaRange': [int(alpha.min()), int(alpha.max())], **stats}
        manifest.append(record)
        print(name, runtime.size, stats, flush=True)
    (OUT / 'export-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

if __name__ == '__main__':
    main()
