# Map cat wave mascot

## Provenance

- Generated on 2026-09-06 with the built-in `image_gen` tool.
- Identity reference: `poc/lesson1-2-experience/assets/v3/keeper.png`.
- Layout and small-screen legibility reference: `/Users/permission/Downloads/duolingo-2.jpg`.
- The Duolingo screenshot was used only for visual density and small-screen legibility. No Duolingo character, costume, icon, or proprietary shape was copied.
- The final PNG is the result of the generation prompt followed by the background-extraction prompt below.
- Final alpha sanitation clears both RGB and alpha where the extracted alpha value is below 32/255. Pixels at or above that threshold keep their generated RGBA values. This removes hidden orange/teal residue and low-opacity haze while retaining the narrow anti-aliased character edge.

## Generation prompt

```text
Use case: illustration-story
Asset type: transparent mascot cutout for a mobile learning-path screen, displayed at roughly 140 x 180 CSS pixels on phones and 185 x 230 CSS pixels on desktop.

Input images:
- Image 1 (Duolingo screen): layout and visual-density reference only. Use its simple, chunky, highly legible small-screen character treatment and playful learning-app energy. Do not copy any Duolingo character, costume, pose, icon, or proprietary shape.
- Image 2 (keeper.png): identity reference for our established mascot. Preserve the same orange tabby cat identity: bright orange fur, darker forehead and cheek stripes, large friendly dark eyes, cream muzzle, teal short-sleeve polo, navy trousers, rounded orange striped tail.

Primary request: Create one new original full-body orange tabby mascot in a confident welcoming standing pose, viewed in gentle three-quarter view. The cat waves with one raised paw while the other arm rests naturally. Friendly wide smile, warm direct eye contact, energetic but calm, suitable for guiding children through a winding course map.

Style/medium: polished feature-animation-inspired cartoon illustration with Disney-like expressive appeal, simplified into clean rounded shapes and strong silhouette for a Duolingo-like dark learning UI. Soft dimensional cel shading, subtle highlights, smooth confident outline, no photorealism.

Composition/framing: centered isolated full body, head comfortably below the top edge, both ears fully visible, raised paw and all fingers fully visible, both feet fully visible, entire rounded tail fully visible. Compact vertical silhouette with comfortable transparent padding. The character must remain immediately readable when reduced to 140 x 180 pixels.

Color palette: vivid warm orange fur, deep burnt-orange stripes, rich teal shirt, dark navy trousers; high contrast against a very dark blue-green interface background.

Scene/backdrop: none. Genuine transparent background with clean alpha edges.

Constraints: one character only; preserve the keeper cat identity and clothing; no badge text; no floor plane; no cast floor shadow; no scenery; no props; no sparkles; no speech bubble; no letters or numbers; no watermark. Do not crop any ear, paw, foot, or tail. Keep facial and clothing details broad and simple; avoid tiny details that disappear at small size. Output a PNG with true transparency.
```

## Background-extraction prompt

```text
Use case: background-extraction
Asset type: transparent mascot cutout for a mobile learning-path UI.

Input image: edit target. Keep the orange tabby mascot itself, including its identity, pose, facial expression, teal polo, navy trousers, striped tail, proportions, colors, shading, and clean outlines.

Primary request: Remove the entire dark orange/black background and every surrounding glow. Return the mascot alone on a genuinely transparent background with an actual alpha channel.

Composition: preserve the full body with comfortable transparent padding. Both ears, every raised-paw fingertip, both feet, and the complete tail must remain intact.

Constraints: change only the background extraction; one character only; no floor, no cast shadow, no halo, no colored aura, no scenery, no props, no checkerboard baked into pixels, no white background, no letters, no watermark. Clean anti-aliased alpha edges. PNG with true transparency.
```
