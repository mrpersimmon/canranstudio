# Naoko v1 image-generation prompt

Built-in ImageGen was used with `keeper.webp` and `customer.webp` as style,
proportion, linework, rendering, and composition references only.

## Generation prompt

```text
Use case: illustration-story
Asset type: full-body character art for a children's English-learning web lesson, displayed at about 110–160 × 180–230 px
Input images: Image 1 and Image 2 are style, proportions, linework, rendering, and composition references only; do not copy either character's identity or pose
Primary request: Create Naoko, a single young, friendly anthropomorphic black-and-white tuxedo cat. She wears a simple light lavender hoodie and cream-colored trousers. Her expression is warm, attentive, and gently confident. Pose her standing naturally with one hand resting lightly over her chest and the other giving a small friendly wave.
Style/medium: polished Disney-inspired 2D feature-animation character illustration; clean soft outlines, expressive face and eyes, simplified child-friendly shapes, subtle hand-painted texture and gentle cel shading; clearly 2D, never 3D
Composition/framing: vertical 2:3 portrait, centered single character, front three-quarter view, complete full body visible from both ear tips through both feet, entire tail visible, both hands visible, comfortable clear margin around every edge; strong readable silhouette when reduced to a small UI slot
Lighting/mood: soft even studio light, warm and approachable
Color palette: black-and-white tuxedo fur, soft lavender hoodie, warm cream trousers, restrained harmonious colors matching the reference images
Scene/backdrop: genuinely transparent background if supported
Constraints: exactly one character; preserve complete ears, whiskers, hands, feet, legs, clothing, and tail; no cropping or edge contact; no floor props; no cast shadow extending outside the character; no text, letters, labels, flags, emblems, logos, watermarks, badges, country motifs, stereotypical national clothing, extra characters, bags, or classroom objects
Avoid: 3D render, photorealism, chibi proportions, oversized head, busy detail, harsh outlines, neon colors, incomplete anatomy, hidden feet, clipped tail
```

The first result rendered the transparency request as a visible checkerboard, so
the following targeted edit replaced only that pattern with the same clean white
background used by the existing character references.

## Background correction prompt

```text
Use case: precise-object-edit
Asset type: full-body character art for a children's English-learning web lesson
Input images: Image 1 is the edit target
Primary request: Change only the checkerboard background to a perfectly clean, uniform pure white background.
Constraints: Preserve the Naoko cat character exactly: same black-and-white tuxedo fur pattern, face, expression, light lavender hoodie, cream trousers, pose with one hand over chest and one hand waving, proportions, 2D feature-animation linework, subtle shading, framing, full visible ears, both feet, both hands, and complete tail. Keep the full character centered with clear margin on every edge. No changes to the character, no crop, no added shadow, no added objects.
Avoid: checkerboard pattern, transparency grid, gray tiles, gradients, texture, text, flags, logos, watermarks, extra characters, 3D rendering.
```

Final production file: `naoko-v1.png`, 640 × 960, solid white background.
