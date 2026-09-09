# 结算指标图标生成提示词

工具：Codex 内置 `image_gen.imagegen`，分别生成三枚透明图标。未使用 CLI 或手绘替代。

用途：金色勾选用于“完成题目”，蓝色靶心用于“最佳连对”，绿色秒表用于“本次用时”。用户上传的 Duolingo 结算图是形状、精致程度和语义参考，沿用项目已指定的迪士尼绘画风格。

## 金色完成徽章

```text
Use case: stylized-concept
Asset type: a single premium small UI reward icon for the "completed questions" metric of a children's English app, displayed at 26px on #141f23.
Primary request: Draw a beautifully polished GOLD circular completion badge with one bold readable raised CHECK MARK in its center. Match a family of glossy painted cyan bullseye and mint stopwatch UI icons: near-front view, softly sculpted thick rim, broad gentle highlights, subtle darker side face, rounded cheerful toy-like craftsmanship. Use a Disney-like painted animation illustration finish and the compact readability of Duolingo reward icons.
Scene/backdrop: genuinely transparent alpha background. One isolated badge only. No surrounding card, base, floor, glow field, solid backdrop, checkerboard, cast ground shadow, text or numbers.
Composition/framing: compact round medallion, nearly front-facing with a slight three-quarter tilt to expose the lower-right rim; one thick rounded check mark fills the central 60% of the face. Center the complete badge in a square 1024x1024 canvas with transparent margins about 8%; nothing cropped.
Lighting/material: warm golden-yellow painted enamel, broad light patch at upper left, modest amber side shading at lower right; shallow sculpted bevel, tactile yet simple, no photoreal metal, no busy engraving. The pale lemon check is raised clearly against a rich gold face with a small warm amber under-edge; strong silhouette legible when reduced to 24px.
Colors: vivid gold #ffd000, rich amber rim #d99000, soft lemon #fff3a1 check and highlight. No blue or green.
Avoid: letters, numbers, labels, logos, caption, extra symbols, ribbons, stars, confetti, decorative rays, black outlines, tiny details, background patterns, watermark. Output MUST contain real transparent alpha; never render checkerboard pixels.
```

## 蓝色靶心

```text
Use case: stylized-concept
Asset type: a single premium small UI reward icon for the "best answer streak" metric of a children's English app, displayed at 36px on #141f23.
Primary request: Draw a beautifully polished cyan-blue bullseye with ONE blue dart lodged exactly in its center, the dart extending toward the upper right. Take the friendly sculpted simplicity, readable silhouette and layered color craftsmanship of Duolingo's reward icons as the reference, with a Disney-like painted animation illustration finish matching our cat characters.
Scene/backdrop: genuinely transparent alpha background, no surrounding card, floor, glow field, solid fill or checkerboard. One isolated object only.
Composition/framing: near front-facing round target, very slight three-quarter tilt to show a modest thick rim; three broad concentric alternating turquoise and light-cyan rings with clear bullseye center. The dart shaft and two broad tail fins must remain legible when the icon is shrunk to 36px. Compact centered silhouette fills about 84% of a square 1024x1024 canvas with transparent margin; nothing cropped.
Lighting/material: rounded beveled edges, a few broad painted highlights at upper left, darker saturated blue side shading at lower right, soft smooth paint; charming toy-like craft, no photoreal metal or excessive detail.
Colors: vivid cyan #31d8ee and sky blue #43bff4, pale aqua highlights, rich blue depth. Enough light/dark contrast on a dark page.
Text: none.
Avoid: letters, numbers, logos, labels, caption, extra darts, stars, confetti, background pattern, watermark, black outlines, tiny decorative parts. Output MUST have true transparent alpha, never draw a checkerboard.
```

## 绿色秒表

```text
Use case: stylized-concept
Asset type: a single premium small UI reward icon for the "time spent" metric of a children's English app, displayed at 36px on #141f23.
Primary request: Draw a beautifully polished mint-turquoise stopwatch icon. Take the friendly sculpted simplicity, readable silhouette and layered color craftsmanship of Duolingo's reward icons as the reference, with a Disney-like painted animation illustration finish matching our cat characters.
Scene/backdrop: genuinely transparent alpha background, no surrounding card, floor, glow field, solid fill or checkerboard. One isolated object only.
Composition/framing: near front-facing compact round stopwatch with a small centered top push button and one small right shoulder button, very slight three-quarter tilt to show a modest thick rounded rim. Bright mint dial, turquoise housing, a clearly visible thick dark-teal short clock hand pointing upper right and a small circular center pivot. No numbers or tiny ticks. Compact centered silhouette fills about 84% of a square 1024x1024 canvas with transparent margin; nothing cropped.
Lighting/material: rounded beveled edges, a few broad painted highlights at upper left, deeper emerald-turquoise side shading at lower right, soft smooth paint; charming toy-like craft, no photoreal metal or excessive detail.
Colors: lively turquoise #13d6aa, light mint dial, pale mint highlights, deeper teal for hands and rim shadow. Enough contrast on a dark page.
Text: none.
Avoid: letters, numbers, logos, labels, caption, visible glass glare hiding the hand, extra clocks, stars, confetti, background pattern, watermark, black outlines, tiny decorative parts. Output MUST have true transparent alpha, never draw a checkerboard.
```
