# 星星雨伞生成记录

- 生成方式：Codex 内置 `image_gen`，2026-09-06。
- 用途：`learning-path` 雨伞故事物品，在页面中约 96 px 展示。
- 最终 PNG：`umbrella-star.png`（1024 × 1024，真实透明背景）。
- 运行时副本：`umbrella-star.webp`（420 × 420，保留 alpha）。
- 原始生成结果：`/Users/permission/.codex/generated_images/01a07648-9da2-7890-b2d7-8a5414ce2df5/exec-8d6c8f1b-63e6-4e62-84e4-f824dd4dfb28.png`。
- 原始生成结果 SHA-256：`f8c51255f3ec3f9cda911ca8540a99fa63e87518871627b92a05a37ce54cd978`。
- 最终 PNG SHA-256：`2fec951a9855453786e90bf9f8f3b4902450516a8e5c19e8b32bf359ebccd9ea`。
- 运行时 WebP SHA-256：`ac90977c6e170109c6c6f22e18b7094ae382cc06ea544fe61cef7a6e2f0a8fb0`。

## 参考图及其角色

1. `poc/lesson3-4-experience/assets/item-umbrella-star-v1.png`：旧雨伞，仅作为物品类别和关键特征参考；不沿用金属、宝石和游戏装备质感。
2. `poc/learning-path/assets/dark/keeper-cutout.png`：二维手绘动画画风参考。
3. `poc/learning-path/assets/dark/hans-v2-cutout.png`：二维手绘动画画风参考。

## 首次生成提示词

```text
Use case: illustration-story
Asset type: small learning-app story prop, displayed at about 96 px
Primary request: Redraw a single ordinary children's umbrella as a clean transparent cutout. The result must be a complete, closed blue umbrella with 4 large, simple pale-yellow five-point stars and a rounded brown curved wooden hook handle.
Input images: Image 1 is the previous umbrella and is subject/category reference only; do not copy its shiny metal fantasy styling. Images 2 and 3 are the required visual style references: match their warm classic Disney-like 2D hand-drawn feature-animation look, clean expressive contours, soft color blocks, subtle painted shading, and child-friendly finish.
Scene/backdrop: genuinely transparent background, alpha outside the umbrella; no floor, no shadow plate, no checkerboard, no colored rectangle.
Subject: one complete ordinary closed umbrella, visibly including hook handle, canopy tip, wrap band and folded canopy; blue fabric; exactly 4 large readable pale-yellow stars distributed on the canopy.
Style/medium: polished classic Disney-style 2D hand-drawn animation prop illustration, harmonious with the supplied cat characters; rounded simplified shapes; minimal soft hand-painted highlights.
Composition/framing: square 1024 x 1024 asset; umbrella runs gently from upper-left to lower-right; centered; entire silhouette visible; at least 8% transparent breathing room on every side; strong silhouette that remains unmistakable at 96 px.
Color palette: medium royal/sky blue fabric, warm pale-yellow stars, warm natural brown wood handle; avoid dark navy-black collapse.
Constraints: no text, no numbers, no characters, no hands, no scene; authentic transparent alpha; no clipping; no hidden parts; ordinary children's umbrella.
Avoid: magic wand, crown, jewel, medallion, ornate buckle, gold metal edging, metallic trim, weapon-like tip, fantasy equipment, sharp glare, photorealism, 3D game icon, glossy plastic, intricate decoration, tiny stars, excessive folds, dramatic rim light, drop shadow, watermark.
```

## 单点修正提示词

```text
Use case: precise-object-edit
Asset type: small learning-app story prop, displayed at about 96 px
Primary request: Change only the umbrella's wrap band: remove the circular medallion/button entirely and replace it with a plain blue fabric tie strap, with no ornament and no metal. Keep the same complete umbrella, orientation, warm hand-drawn 2D animation style, four large pale-yellow stars, blue fabric, brown wooden hook handle, strong silhouette, and 8% outer breathing room.
Background: genuinely transparent alpha outside the umbrella. Do not draw or bake a checkerboard or white background.
Constraints: keep exactly one ordinary closed children's umbrella; exactly four stars; no text, no number, no character, no scene, no shadow plate, no clipping.
Avoid: medallion, jewel, badge, buckle, gold/metal edging, magical/fantasy decoration, 3D game icon, sharp specular glare, photorealism, watermark.
```

## 透明整理

内置生成结果带有绘制出来的浅色棋盘格，不能直接作为透明素材。依据用户已授权的本地去背景方式，移除与外边界相连的浅色背景、纯中性棋盘格残留及其独立碎屑，只保留完整雨伞主体，再以等比例缩放居中到 1024 方形画布；PNG 四边最小透明留白为 92 px（8.98%），420 px WebP 四边最小透明留白为 35 px（8.33%）。最终 PNG 和 WebP 的 alpha 范围均为 0–255。
