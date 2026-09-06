# Hans v2 background correction

- Tool: built-in Image Gen
- Edit target: `hans-v1.png`
- Purpose: remove the colored halo while preserving the generated character
- Final background: visually uniform pure white
- Canvas: 1024 × 1536 (2:3)

```text
Use case: precise-object-edit
Asset type: full-body character image for a children's English-learning interactive story.
Input image: Image 1 is the edit target.
Primary request: replace only the entire background with one completely uniform pure white (#FFFFFF) background. Remove every brown or blue glow, halo, fog ring, vignette, gradient, shadow panel, and background color.
Constraints: preserve exactly the same Hans character identity and design: the same face, expression, brown tabby markings, body proportions, blue hoodie, navy trousers, backpack and straps, friendly waving paw, resting paw, stance, complete ears, complete feet, and complete tail. Preserve the same centered 2:3 full-body composition and generous whitespace. Do not alter, redraw, crop, enlarge, add, or remove any part of the character.
Avoid: transparent checkerboard, texture, gradient, glow, aura, mist, scenery, floor, cast shadow, text, watermark, extra object, extra character. The whole background must be visually clean and uniformly pure white.
```
