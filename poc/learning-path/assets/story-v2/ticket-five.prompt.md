# 5 号衣帽间领取牌

## 用途

雨伞故事中的 5 号衣帽间领取牌。目标是在 64–96px 下仍能立即认出数字和物品类别。

## 生成来源

- 工具：Codex 内置 `imagegen`
- 编辑对象：`../../../lesson3-4-experience/assets/item-ticket-five-v1.png`
- 编辑对象 SHA-256：`4e785b929066111db082a15cab5cd302bf745b0ca2d3090ff8fd62c8371600b0`
- 风格参考：`visitor-left.png`
- 风格参考 SHA-256：`dfec6d6f5b48c2550f82c1722816389e3364d016049e9dbf236c7906226860e4`
- imagegen 输出：`/Users/permission/.codex/generated_images/01a07648-5fe1-7bd1-b101-f1b9439ae247/exec-4d6efe8e-6b1f-4e11-8885-4feb60d6b5d9.png`
- 仓库内原始生成稿：`source/ticket-five-imagegen-rgb.png`
- 原始生成稿 SHA-256：`36a0070bbe074581bb108835c184b37a1adc3124aa282116272f69ac4d7343ef`
- 最终透明 PNG SHA-256：`2627963b1181de34d1bbbbac2a3b3ffcb5276b06f1c935b7aa4ab2213fed845d`
- 420×420 WebP SHA-256：`3497518118f7bd55904fe161ad2c9ca8259c2984b98e3c64de2e5bba353b0452`

内置 imagegen 返回 1254×1254 RGB PNG，并把浅色棋盘格画进图片，没有真实 alpha。按照项目已获授权的生成后背景整理流程，使用与边缘连通的低色差浅色区域识别背景，并单独清除布环和牌孔内的背景；奶油色牌面因为具有明显的暖黄颜色差且不与外部背景连通而得到保留。整理只处理透明度与画布规格，没有重绘牌子。

## 提示词

```text
Use case: precise-object-edit
Asset type: small educational story prop and UI illustration
Input images: Image 1 is the cloakroom number-ticket edit target; Image 2 is the approved character art-direction reference.
Primary request: Redraw the number 5 cloakroom claim ticket as a simple, ordinary, child-friendly collection token. Keep only the useful identity of a hanging cloakroom ticket and the centered number 5; replace the ornate metallic luxury treatment with a warm yellow and creamy painted design.
Subject: A softly rounded rectangular cloakroom claim tag with one small, simple fabric loop or plain round loop at the top. The face is warm butter yellow/cream with a modest ochre outline and subtle hand-painted cel shading. A single large dark-brown digit "5" is perfectly clear and centered.
Style/medium: classic Disney-inspired two-dimensional hand-drawn animation prop art, expressive clean outline, soft painted texture and restrained cel shading, matching the warm polished children's-app illustration language of Image 2.
Composition/framing: square 1024 canvas, front-facing or only very slightly angled, complete silhouette fully visible, centered, about 84% of canvas width/height at most, at least 8% transparent breathing room on every side. The number must remain immediately legible at 64–96 pixels.
Scene/backdrop: genuinely transparent background with clean alpha.
Text (verbatim): "5"
Constraints: one tag, one loop, one centered number only; simple and ordinary; clean anti-aliased edges; transparent RGBA PNG.
Avoid: stars, starbursts, sparkles, complex patterns, decorative engraving, multiple borders, metal carving, gold bullion look, jewelry or gem appearance, high gloss, harsh specular highlights, photorealism, drop shadow, floor, hand, cat, extra props, extra digits or letters, text other than 5, white background, checkerboard pattern, watermark, cropped outline.
```

## 验收

- PNG：1024×1024 RGBA；WebP：420×420 RGBA；两者 alpha 范围均为 0–255。
- 非透明主体包围盒为 `(282, 82, 741, 942)`；上下各保留 8% 透明空间，四边均无非透明像素。
- 布环内部和牌孔内部均为透明；奶油色牌面与深棕数字保持不透明。
- 深色 `#141f23` 与浅色背景合成目检均无棋盘格残留或白边。
- 已按真实 64px 和 96px 尺寸缩小后目检，数字“5”仍清楚可辨。
- 只保留普通圆角牌、单一布环和数字“5”；没有星芒、复杂花纹、金属雕刻、高反光或珠宝质感。
