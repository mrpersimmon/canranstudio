# School vocabulary cutout

## Source

- Date: 2026-09-06
- Generator: Codex built-in `imagegen`
- Use case: `illustration-story`
- Style reference: `../../story-v2/attendant-right.webp`
- Style-reference SHA-256: `263d9d77771a62dfbc77e67ae1f4d163879cfc7ed19fbaede2a3a31916722ac3`
- Built-in output: `/Users/permission/.codex/generated_images/01a0768a-b269-7f12-a710-7c70eceb14db/exec-15e791b6-8a10-4fb0-be0d-e91e1d6f6260.png`
- Preserved raw output: `school-imagegen-original.png`
- Raw-output SHA-256: `5c173460f8848ee8ce72d90ba732902fc9ca5a2f1319f29b99d2cac308f61a2f`
- Transparent master: `../school.png`
- Master SHA-256: `6142b0d979c483cc62bcb58499ddb4bb8fb4ef5c5ec5bedde04419a3f044e6a0`
- Runtime asset: `../school.webp`
- Runtime SHA-256: `03784674058ce466130ab97dce3d3a729c143c7b855530f042c8dd6b06d073ff`

Image 1 was used only as a line, palette, and rendering-style reference. The cat was not included in the generated asset.

## Exact generation prompt

```text
Use case: illustration-story
Asset type: square vocabulary-learning cutout for a children's English course
Primary request: Create one unmistakably friendly small SCHOOL building, as if from a classic Disney 2D hand-drawn animated feature. This is a simple vocabulary object asset, not a full scene.
Input image: Image 1 is a style and palette reference only. Match its warm muted colors, rounded confident hand-drawn outlines, restrained two-tone cel shadows, clean readable forms, and gentle painted texture. Do not include, copy, or imply the cat character.
Scene/backdrop: actual genuinely transparent background with a clean alpha channel; no ground plane, scenery, sky, border, glow, checkerboard, colored matte, or cast shadow extending beyond the building.
Subject: a broad, modest, welcoming one- to two-story neighborhood school. Warm muted brick facade, low simple red roof, several large classroom windows, one clearly visible school bell, and a simple open-book emblem centered over the front doorway. No written words or letters.
Composition/framing: slight three-quarter view, centered. Entire building and every roof edge fully inside the square canvas with about 10% transparent margin on all sides. Strong compact silhouette that remains clearly recognizable as a school at 96px.
Style/medium: classic Disney 2D hand-drawn animation background-object cutout; rounded confident outlines; simplified shapes; restrained two-tone cel shading; subtle organic brush texture; flat, readable depth rather than 3D rendering.
Color palette: warm muted terracotta brick, soft low-saturation red roof, warm cream trim, calm blue classroom windows; coordinate with the supplied reference.
Constraints: exactly one building; one obvious bell; one open-book emblem; no people, animals, characters, vehicles, signs, flags, text, letters, watermark, or logo. Preserve clean transparent edges without white or gray halos.
Avoid: castle, turrets, towers, steeple, church, clock tower, cupola, luxury mansion, university palace, miniature diorama, toy model, isometric game asset, photorealism, 3D render, glossy plastic, cinematic realism, tiny ornate detail, metallic filigree, excessive brick-by-brick texture, dramatic perspective, cropped building.
```

## Technical transparency extraction

The built-in generator returned a 1254 × 1254 RGB PNG with a pale checkerboard baked into the pixels and no alpha channel. The raw file above is preserved unchanged. Under the user's existing authorization for technical background removal, the final asset removes only the background and its edge matte; the building was not repainted.

The extraction selected low-chroma light pixels (`minimum RGB >= 230`, channel spread `<= 18`) connected to the canvas boundary, plus the two enclosed checkerboard regions visibly behind the school bell. It retained the single connected building component, derived anti-aliased alpha from the nearest source-background and opaque-interior colors, removed the matte from those boundary pixels, and discarded disconnected checkerboard noise. The extracted building bounds in the raw image were `(25, 187, 1213, 1052)`.

The complete cutout was resized proportionally to 820 × 597 and centered at `(102, 213)` on a 1024 × 1024 transparent canvas. The runtime WebP is a proportional 420 × 420 export at quality 92 with the resized alpha preserved exactly.

## Inspection

- `school.png`: 1024 × 1024 RGBA; alpha range 0–255; nontransparent bounds `(102, 213, 922, 810)`; every canvas edge is transparent.
- `school.webp`: 420 × 420 RGBA; alpha range 0–255; nontransparent bounds `(39, 85, 381, 335)`; every canvas edge is transparent.
- At 96 × 96 on both `#141f23` and warm light backgrounds, the broad school silhouette, red roof, blue windows, central doorway, bell, and open-book emblem remain distinguishable. No checkerboard or pale matte remains around the cutout or inside the bell opening.
- Visual review found no castle, tower, steeple, luxury-mansion, diorama, 3D-render, photoreal, ornate-metal, text, person, animal, or cropped-building treatment.

