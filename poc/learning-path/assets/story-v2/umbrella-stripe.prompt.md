# 条纹雨伞生成记录

- 生成方式：Codex 内置 `image_gen`，2026-09-06。
- 用途：`learning-path` 雨伞故事物品，在页面中约 96 px 展示。
- 最终 PNG：`umbrella-stripe.png`（1024 × 1024，真实透明背景）。
- 运行时副本：`umbrella-stripe.webp`（420 × 420，保留 alpha）。
- 原始生成结果：`/Users/permission/.codex/generated_images/01a07648-9da2-7890-b2d7-8a5414ce2df5/exec-38578379-4781-4cb5-95d4-3a3c3be7a99d.png`。
- 原始生成结果 SHA-256：`f93a33aa44769a562ee0c52c91f3bb019f40f27d92f56027456721efd7aedf13`。
- 最终 PNG SHA-256：`0fa1fe135c2d8eae63e66c8332ab7929c4bd29721222d5788764ca6baeb6d97d`。
- 运行时 WebP SHA-256：`5d63ea8a8fd3c2a9fdc7c8a1db47a6484363fa6b0311be49eabfed87d6f933c6`。

## 参考图及其角色

1. `poc/lesson3-4-experience/assets/item-umbrella-stripe-v1.png`：旧条纹雨伞，仅作为红色、奶油色和条纹身份参考；不沿用金属、徽章和游戏装备质感。
2. `poc/learning-path/assets/story-v2/umbrella-star.png`：已确认的同系列母版，提供木柄、布带、大小、轮廓、朝向和二维笔触参考。

## 生成提示词

```text
Use case: illustration-story
Asset type: small learning-app story prop, displayed at about 96 px
Primary request: Create one ordinary closed children's umbrella in the same visual family, silhouette, scale, orientation, wooden hook handle, plain fabric wrap band, and soft 2D hand-painted treatment as Image 2, but replace the blue star design with a clearly different warm red-and-cream stripe design.
Input images: Image 1 is the old striped umbrella and provides only the red/cream palette and striped identity; do not copy its metallic fantasy styling. Image 2 is the approved star umbrella and is the required shape, proportion, line quality, material simplicity, and classic Disney-like 2D animation style reference.
Scene/backdrop: genuinely transparent background with alpha outside the umbrella; no floor, no shadow plate, no checkerboard, no colored rectangle.
Subject: one complete ordinary closed umbrella, with a rounded brown curved wooden hook handle, warm red fabric canopy, exactly 3 broad cream-colored diagonal bands that remain clear at 96 px, and a plain red fabric tie strap.
Style/medium: polished classic Disney-style 2D hand-drawn animation prop illustration; clean rounded silhouette, gentle painted color blocks, subtle shading, child-friendly and harmonious with the approved cat characters and star umbrella.
Composition/framing: square 1024 x 1024 asset; umbrella runs gently from upper-left to lower-right, matching Image 2; centered; entire silhouette visible; at least 8% transparent breathing room on every side.
Constraints: exactly three broad cream stripes; no stars; no text; no numbers; no characters; no hands; no clipping; ordinary umbrella.
Avoid: metal edging, gold trim, jewel, medallion, badge, decorative buckle, magic or fantasy cues, weapon-like tip, sharp specular glare, photorealism, 3D game icon, glossy plastic, tiny pinstripes, ornate decoration, drop shadow, watermark.
```

## 透明整理

内置生成结果带有绘制出来的浅色棋盘格，不能直接作为透明素材。依据用户已授权的本地去背景方式，移除与外边界相连的浅色背景和纯中性棋盘格残留，只保留最大连通的完整雨伞主体，从而避免误删主体内部的奶油色条纹；再以等比例缩放居中到 1024 方形画布。PNG 四边最小透明留白为 92 px（8.98%），420 px WebP 四边最小透明留白为 35 px（8.33%）。最终 PNG 和 WebP 的 alpha 范围均为 0–255。
