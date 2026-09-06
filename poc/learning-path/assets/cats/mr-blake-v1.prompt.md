# Mr. Blake cat teacher — generation record

- Built-in image generation mode
- Use case: `illustration-story`, followed by two focused edit passes
- Final workspace asset: `mr-blake-v1.png`
- Final dimensions: 1024 × 1536 pixels (2:3)
- Final background: opaque white; transparency was requested in the first two passes but was not produced reliably, so the final pass intentionally uses a clean white background
- Final SHA-256: `13749dc2fdf3a983ebfa2f38fc54c8d1a02eacc502eb812e2aedc77e5331df0f`

## Style references inspected

- `poc/lesson1-2-experience/assets/v3/keeper.webp`
- `poc/lesson1-2-experience/assets/v3/customer.webp`

The references were used for visual analysis only. The new character was generated as an original asset.

## Generation pass

```text
Use case: illustration-story
Asset type: full-body character asset for a children's English-learning web app, displayed around 110–160 px wide and 180–230 px tall
Primary request: Create one original adult silver-gray tabby cat teacher named Mr. Blake, in the same polished family-friendly 2D fairy-tale animation direction as the existing orange and cream cat characters: expressive rounded eyes, clean soft dark-brown outlines, gently modeled color, simple readable clothing shapes, warm classic feature-animation appeal. This is a new character, not an existing franchise character.
Scene/backdrop: genuinely transparent background, no ground plane, no cast shadow beyond a very subtle contact shadow if essential
Subject: anthropomorphic adult silver-gray tabby cat teacher; warm steady expression; small round eyeglasses; soft sage-green cardigan over a light cream shirt; beige trousers; simple brown shoes; one hand raised in a natural welcoming introduction gesture, the other relaxed; tail fully visible
Style/medium: polished hand-painted 2D children's feature-animation character illustration, soft contours, lightweight shading, highly readable silhouette at small UI size
Composition/framing: a single character, three-quarter front view, vertical 2:3 composition, centered; full body from both ear tips through shoes and entire tail visible; generous safe whitespace on every side; no part touches the canvas edge
Lighting/mood: soft neutral studio illumination, friendly, calm, dependable
Color palette: silver-gray fur with subtle darker tabby markings; sage green, cream, beige, warm brown; moderate saturation, no neon colors
Constraints: exactly one character; adult proportions matching a friendly teacher; hands/paws anatomically clear; eyeglasses symmetrical; clean silhouette; true alpha transparency preferred; no text; no logo; no watermark
Avoid: cropped ears, cropped paws, cropped shoes, cropped tail, missing body parts, extra limbs, extra fingers, extra characters, classroom scenery, props, flags, badges, emblems, magical glow, sparkles, dramatic lighting, photorealism, 3D render
```

Generated original:
`/Users/permission/.codex/generated_images/01a072dc-2d13-7273-8042-bccb8ba3512b/exec-85c6f856-f273-4734-b83b-f3ccef05ae96.png`

## Style correction pass

```text
Use case: style-transfer
Asset type: transparent full-body character cutout for a children's English-learning web app
Input image: Image 1 is the edit target
Primary request: Convert this exact silver-gray tabby cat teacher into a clean, warm 2D children's feature-animation illustration that visually matches a simple hand-drawn storybook character set. Change only the rendering treatment and background.
Preserve exactly: one adult silver-gray tabby cat teacher; same friendly calm identity; same small round eyeglasses; same sage-green cardigan, cream shirt, beige trousers and brown shoes; same three-quarter front pose; same welcoming open-hand gesture; same complete body and entire tail; same centered 2:3 composition and generous safe whitespace.
Style/medium: crisp soft dark-brown linework; smooth flat-to-gently-shaded color shapes; simplified fur masses; minimal texture; expressive rounded eyes; light watercolor warmth; unmistakably hand-drawn 2D animation art rather than 3D or rendered realism.
Scene/backdrop: genuinely transparent alpha background, completely empty.
Constraints: full ear tips, both hands, both shoes and entire tail remain visible with whitespace; clean silhouette at 120px display width; no text, logo, watermark, props, flags, badge, emblem or extra character.
Avoid: dark gradient, colored backdrop, vignette, glow, photorealistic fur, detailed fabric grain, cinematic lighting, 3D render, cropped body parts, extra limbs or fingers.
```

Generated original:
`/Users/permission/.codex/generated_images/01a072dc-2d13-7273-8042-bccb8ba3512b/exec-0dc006ec-df70-4ab0-8f00-f4c5d002cfec.png`

## Canvas cleanup pass (final)

```text
Use case: precise-object-edit
Asset type: full-body character cutout for a children's English-learning web app
Input image: Image 1 is the edit target.
Primary request: Change only the canvas treatment: replace the visible checkerboard pattern with one completely uniform pure white background (#FFFFFF), and scale the unchanged character down slightly so there is generous white safe margin around both ear tips, the presenting hand, both shoes, and the whole tail.
Preserve exactly: the same single silver-gray tabby teacher; identical face, round eyeglasses, tabby markings, expression, pose, hand gesture, cardigan, shirt, trousers, shoes, tail, clean 2D linework, colors and proportions.
Composition: centered vertical 2:3 canvas; character occupies about 82–85% of canvas height; full body and tail visible; at least 7% empty margin on every side.
Constraints: exactly one character; flat pure white background with no pattern, gradient, shadow, vignette, glow or texture; no text, logo, watermark, props, flags, badges, emblems or extra characters; no cropped parts; no anatomy changes.
```

Generated original copied into the workspace:
`/Users/permission/.codex/generated_images/01a072dc-2d13-7273-8042-bccb8ba3512b/exec-f2d622b8-d7cd-4df8-9458-1bdbdabf6b3c.png`
