# 结算指标图标生成提示词

## 2026-09-11 追加：剩余机会

用户允许跳级第三卡使用剩余机会，并要求与已有图标保持一致。先目视核对蓝色靶心、绿色秒表及已归档的 Duolingo 结算截图。两次带图参考生成结果含烘焙棋盘背景，alpha 检查失败，未用于项目。第三次独立生成得到真实 alpha，保留原图并仅等比缩小、编码为 256×256 WebP；没有代码去底或重绘。

```text
A single isolated glossy mint turquoise heart game UI icon. Disney-like painted animation illustration, softly sculpted plump rounded heart, broad pale mint painted upper-left highlight and darker teal thick lower-right bevel, front-facing with a small three-quarter tilt. One heart ONLY, no other objects, no writing, no outlines, no shadows on ground, no patterns. Square canvas with transparent background and ample 8% margins. It is a UI asset that MUST HAVE AN ALPHA CHANNEL, fully transparent outside the heart. Do not show a background or any texture or checkerboard. This must be a transparent PNG cutout. Preserve simple strong recognizable silhouette at 24 pixels, rich turquoise #13d6aa with mint high points and deep teal depth. Match a family of softly painted glossy gold completion badge and cyan bullseye icons. Output transparent alpha PNG.
```

选用原图、透明度、文件指纹见 assets.json 的 chances-heart。页面素材为 `poc/learning-path/assets/settlement/chances-heart.webp`，9,020 字节。生成源的透明像素保持透明，主体 alpha 接近不透明（缩小后最大 254）；没有人为更改生成 alpha。

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
