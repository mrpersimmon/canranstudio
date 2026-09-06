# Suit vocabulary cutout

## Generation source

- Tool: built-in `imagegen`
- Use case: `stylized-concept`
- Style reference only: `../../story-v2/attendant-right.webp`
- Built-in source output: `/Users/permission/.codex/generated_images/01a0768a-71ab-7d40-b3ca-6b2f6b158a9e/exec-9c98f17f-ed91-40d2-ab67-b402895550ec.png`
- Preserved repository source: `suit-imagegen-original.png`
- Preserved source SHA-256: `ff97d4771a74500e51db2325797afe9f03aadc3669fa187333546ea466e8e3ea`

The reference was used only for its hand-drawn outline, matte color, warm cream highlight, and restrained cel-shadow language. The cat was not included in the generated asset.

## Final prompt

```text
Use case: stylized-concept
Asset type: English-learning vocabulary cutout for the word “suit,” designed to remain instantly recognizable at 96 px
Input images: Image 1 is a STYLE REFERENCE ONLY. Match its charming classic Disney-inspired 2D hand-drawn cel-painting language: expressive gently curved ink outlines, matte color, warm cream highlight accents, and simple restrained painted shadows. Do not copy or include its cat, pose, clothing, or character.
Scene/backdrop: genuinely transparent background with clean alpha; no floor, scenery, backdrop, border, shadow plate, checkerboard, or colored rectangle
Subject: exactly one complete matching navy suit outfit, clearly consisting of a tailored suit jacket AND matching full-length trousers. Show the jacket above and the trousers directly below as one coordinated clothing set, laid out as an attractive standalone garment cutout. The jacket has broad simplified lapels, a small visible cream shirt collar, one simple warm coral-red tie, two buttons, and subtle pockets. The trousers must be unmistakable, fully visible from waistband to both hems, matching the jacket in navy color and visual weight.
Style/medium: polished classic family-animation 2D cel illustration, hand-drawn and cel-painted, soft organic line variation, broad simplified shapes, appealing educational picture-card clarity
Composition/framing: square 1024 × 1024; front three-quarter garment view; the complete outfit fills about 80% of the canvas with at least 10% clear transparent margin on every edge; centered and balanced; no cropped edges
Lighting/mood: friendly, warm, clean, charming, readable; restrained cel shadows only
Color palette: deep matte navy blue suit, cream collar, small warm coral-red tie; thin dark blue-brown outlines; limited soft highlights
Materials/textures: simplified painted cloth with minimal folds; no realistic weave, no glossy fabric
Text: none
Constraints: one coordinated suit outfit only; jacket and trousers both prominent and complete; strong silhouette at 96 px; preserve genuine transparency; clean antialiased edges
Avoid: any cat or animal; any person, headless human, mannequin, torso, hands, skin, face, neck, shoes, hat, hanger, dress form; coat-only silhouette; tuxedo tails; military uniform; school uniform; dress; gold trim, gold filigree, ornate decoration; product photography; photoreal textile texture; shiny 3D render; hard plastic look; background color; cast shadow; text; logo; watermark; cropping
```

## Transparency and export record

The built-in result was a 1254 × 1254 RGB PNG with a pale checkerboard baked into the pixels, so it was not used directly. The raw result above is retained byte-for-byte.

The authorized technical cleanup removed 1,091,026 edge-connected near-white neutral background pixels and converted them to real alpha. It preserved 470,041 interior artwork pixels exactly; 11,449 antialiased boundary pixels received alpha extraction and matte-edge decontamination only. No garment shape, line, color region, or detail was repainted.

After extraction, the nontransparent source bounds were `(311, 34, 944, 1212)`. The unchanged cutout was proportionally resized to `440 × 819` and centered at `(292, 102)` on a 1024 × 1024 transparent canvas, giving at least 10% margin on every edge.

- Initial master before the brightness correction: 1024 × 1024 RGBA, alpha range 0–255, SHA-256 `2c7acc7258b4e62081eb7080a5fbfd871c47b5705c895a4ae1061ad8b88c5a90`
- Initial runtime before the brightness correction: 420 × 420 with alpha, alpha range 0–255, SHA-256 `1d0fac75e7e5164174c4fdad2fc7a2c4be303484886f7a995c3402771691b38d`

## Initial visual check

The initial master was reduced to a 96 × 96 display image and composited on both `#141f23` and a warm light background. The navy jacket, matching trousers, cream collar, and coral-red tie remained recognizable in isolation; all edges stayed inside the frame and no checkerboard or pale halo was visible. The later live-page captures above showed that its trousers still needed more separation from the actual course background.

## Dark-background brightness correction

The first live-page comparison in `docs/designs/completion-return-and-vocabulary-art/qa/native-vocabulary-heard-intermediate.png` and `docs/designs/completion-return-and-vocabulary-art/qa/vocabulary-art-contact-intermediate.png` showed that the original navy trousers merged into the `#141f23` course background at 96 px. The drawing was therefore edited once with built-in `imagegen`; no local code was used to recolor or redraw it.

- Exact edit target: the initial `../suit.png` identified above
- New built-in source output: `/Users/permission/.codex/generated_images/01a0768a-71ab-7d40-b3ca-6b2f6b158a9e/exec-a32eced3-90fc-424d-83cb-a762b7235bb2.png`
- Preserved repository source: `suit-brighter-imagegen-original.png`
- New source SHA-256: `ba30a03918a274852e051308032c2339a65f44d3111e28dd43be1d842c94d993`
- Original source retained unchanged: `suit-imagegen-original.png`, SHA-256 `ff97d4771a74500e51db2325797afe9f03aadc3669fa187333546ea466e8e3ea`

### Brightness-correction prompt

```text
Use case: precise-object-edit
Asset type: corrected English-learning vocabulary cutout for the word “suit,” displayed at 96 px on a #141f23 dark course background
Input images: Image 1 is the exact edit target and approved suit drawing.
Primary request: Change ONLY the color and cel-lighting of the jacket and matching trousers. Replace the current very dark navy with a clearly brighter medium-value cobalt blue / soft royal blue that stays immediately legible against #141f23 at 96 px. Use a harmonious range of medium cobalt-blue base color, slightly deeper blue cel shadows, and brighter natural blue edge planes.
Preserve exactly: the complete jacket-and-trousers silhouette; every outer edge and garment proportion; the jacket lapels, sleeves, pockets, buttons, trouser waistband, both full legs and cuffs; the cream shirt collar; the warm coral-red tie; the centered 1024 × 1024 composition; the approximately 80% subject height; all transparent margins; the same charming classic Disney-inspired 2D hand-drawn cel-painted line language.
Color and shading: medium-bright cobalt or softened royal blue, clearly lighter than the dark background; simple broad cel-painted value shapes; restrained natural blue highlights along shoulders, sleeves, lapels, jacket hem, outer trouser legs, and cuffs so the full silhouette reads at thumbnail scale.
Background: preserve genuine transparent alpha outside the suit. No backdrop, checkerboard, floor, or cast shadow.
Constraints: color correction only; keep exactly one complete suit; keep the collar and tie colors unchanged; preserve clean antialiased edges and full uncropped outfit; no added garment details or objects.
Avoid: dark near-black navy; trousers blending into #141f23; neon blue; cyan; electric glow; aura; bloom; rim-light glow; white outline; pale border; gold trim; filigree; glossy 3D rendering; photoreal fabric; gradients; new texture; mannequin; human; skin; hands; head; shoes; hanger; text; logo; watermark; background pixels; altered crop or silhouette.
```

### Corrected transparency and export record

The color-edited imagegen result was again a 1254 × 1254 RGB PNG with a pale checkerboard baked into its pixels. Technical alpha extraction removed 1,204,510 edge-connected neutral background pixels. It preserved 357,934 interior imagegen pixels exactly; 10,072 boundary pixels received only alpha extraction and matte-edge decontamination. The extracted bounds were `(352, 104, 906, 1137)`. The cutout was proportionally placed at `439 × 819` from `(292, 102)` on the transparent 1024 × 1024 canvas.

- Current master: `../suit.png`, 1024 × 1024 RGBA, alpha range 0–255, SHA-256 `b8cae5b90614743470ef31ceb97a05dbcc62e6cc854b2a62816993508007b4c6`
- Current runtime: `../suit.webp`, 420 × 420 with alpha, alpha range 0–255, SHA-256 `a21ef7dc51d1523a3372810444dfe043a3a17a37595d819b02a4eb62688ebe67`

### Corrected 96 px check

The initial and corrected masters were each reduced to 96 × 96 and compared on `#141f23`; the corrected master was also checked on a warm light background. The brighter cobalt-blue jacket and both trouser legs now retain a clear silhouette on the dark background. The edit adds no glow, neon treatment, white outline, or new object, and all edges remain inside the canvas. For blue-dominant opaque pixels, median luminance contrast against `#141f23` increased from approximately 1.37:1 to 3.55:1; the darker tenth percentile increased from approximately 1.10:1 to 2.22:1. The cream collar and coral tie remain visibly distinct.
