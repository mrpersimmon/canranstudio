# Chang-woo v1 generation prompts

Built-in Image Gen; the generation references were `poc/lesson1-2-experience/assets/v3/keeper.webp` and `customer.webp`.

## Character generation

```text
Use case: illustration-story
Asset type: full-body character cutout for a children's English-learning interactive story; displayed around 110–160 × 180–230 px.
Input images: Image 1 and Image 2 are style, finish, framing, scale, and character-proportion references only. Create a new distinct character; do not edit or combine the existing characters.
Scene/backdrop: genuinely transparent background with clean alpha; no scenery, floor, vignette, glow, shadow panel, border, or checkerboard pattern.
Subject: Chang-woo, one young friendly anthropomorphic silver-gray short-haired cat. Clear cool silver-gray fur with subtle darker forehead and tail markings, expressive bright eyes, youthful approachable face. He wears a simple deep navy casual jacket over a plain light shirt and light gray trousers. One open paw makes a friendly introducing gesture; the other arm hangs naturally and the paw is empty. Relaxed upright pose.
Style/medium: polished Disney-inspired family 2D animation character illustration matching the reference images: soft clean outlines, rounded shapes, gentle cel shading, light dimensional highlights, clear silhouette, not 3D and not photorealistic. Make Chang-woo visibly distinct from Hans and the two reference cats.
Composition/framing: portrait 2:3; one centered character only. Entire tips of both ears, both feet, both paws, and full tail must be visible. Keep generous clear space on every side, especially above ears and below feet. Front three-quarter view. Make the silhouette readable at small UI size.
Color palette: cool silver-gray fur, deep navy jacket, light gray trousers, restrained saturated accents consistent with the references.
Constraints: single character; accurate two arms, two legs, two paws/hands, one tail; complete uncropped anatomy; empty paws; no text, logos, letters, badges, labels, flags, national symbols, country-coded colors, stereotyped national costume, extra props, extra characters, watermark, or signature. True transparent background is required; if transparency cannot be produced, use a completely uniform pure white background with no shadow or gradient.
```

## Background correction

The first generation rendered a checkerboard into the image, so the final asset uses this targeted edit:

```text
Use case: precise-object-edit
Asset type: full-body character image for a children's English-learning interactive story.
Input image: Image 1 is the edit target.
Primary request: replace only the baked checkerboard background with one completely uniform pure white (#FFFFFF) background.
Constraints: preserve Chang-woo's identity, silver-gray fur, face, expression, navy jacket, light shirt, light gray trousers, introducing hand gesture, resting arm, pose, proportions, exact full-body framing, complete ears, feet, paws, and tail. Keep the same 2:3 portrait composition and surrounding whitespace. Do not alter, redraw, crop, enlarge, add, or remove any part of the character.
Avoid: checkerboard, texture, vignette, gradient, glow, scenery, floor, cast shadow, text, watermark, extra object, extra character.
```
