# Lesson 49–52 黄金册页 · 生产资产 V1

## 状态与原则

- 构图真值：`map-composition-review-v4-balanced-top.png`
- 生产接入日期：2026-08-06
- 底图只保留皮革边框、羊皮纸地形、海岸、植被和连续紫色路线，不烘焙课程建筑、铭牌或角色。
- 四个课程地标继续使用各课已有的完整成长状态图；中文标题和五阶段进度由网页清晰渲染。
- 当前路线使用独立的小猫与金色脚底标记；加载动画使用四张独立完整姿态帧，没有裁切联系表，也没有拆分身体零件。

## 生产文件

| 资产 | 无损母版 | 网站输出 |
|---|---|---|
| V4 空底图 | `assets/adventure-map/route-pages/district5-page1/background-master.png`（940×1672） | 512、768、940 宽 AVIF/WebP |
| 路线小猫 | `assets/adventure-map/mascot/explorer-cat-walking.png`（1254×1254，透明） | 128、192、256 宽 AVIF/WebP |
| 脚底标记 | `assets/adventure-map/mascot/current-route-marker.png`（1448×1086，透明） | 64、96、128 宽 AVIF/WebP |
| A+ 加载姿态 | `assets/adventure-map/mascot/loader/frame-1.png` 至 `frame-4.png`（1254×1254，透明） | 每帧 128、192、256 宽 AVIF/WebP |

所有网站输出由 `npm run art:build-route-page` 从无损母版重新生成。

## V4 空底图提示词

```text
Use case: precise-object-edit.
Image 1 is the ONLY edit target and is the approved V4 Lesson 49–52 portrait adventure-map composition. Image 2 is supporting reference for the underlying empty parchment terrain language only.

Create the production route-page background by removing all four course landmark groups, all four plaques, every progress circle, the explorer cat, its foot glow, and every course-specific prop from Image 1. Repaint every vacated area as seamless authored terrain in the same watercolor/gouache storybook style. Preserve the exact portrait canvas, leather-bound frame, warm parchment palette, coastline at the lower left, rocks, shrubs, flowers, terrain texture, and the continuous central purple stone route from top entrance to bottom exit. The route must remain naturally connected through all four original landmark stops with no dead end, kink, floating segment, duplicated branch, or abrupt width change. Keep the four placement areas visually usable but express them only as natural clearings, gardens, shrubs, or rocks. No buildings, platforms, plaques, cards, badges, circles, cat, people, animals, text, letters, numbers, logos, watermark, locks, signs, UI, or placeholders. Preserve 940×1672 composition and high-resolution painterly detail. Do not stretch, crop, or redesign the frame and coastline.
```

## 路线小猫提示词

```text
Use case: background-extraction and production character asset.
Create exactly the same orange tabby explorer cat identity and watercolor/gouache storybook rendering as the approved reference: cream die-cut outline, purple cape, blue-and-gold scarf, brown backpack, warm lighting and child-friendly proportions. Show one complete rear three-quarter walking pose facing toward the upper left, ready to continue along the route, with one paw stepping forward. Preserve ears, tail, cape, backpack and all paws; no cropping and no separate body pieces. Center the cat on a square canvas with generous safe padding and no cast shadow, glow, scenery, ground, props, text, border or watermark. Use a perfectly flat solid chroma green #00ff00 background edge-to-edge and keep green out of the character. Crisp high-resolution edge suitable for clean chroma removal.
```

## 脚底标记提示词

```text
Use case: background-extraction and production UI illustration.
Using the approved V4 watercolor map as the sole style reference, create exactly one small horizontal oval route medallion for the explorer cat's feet. It has a softly painted warm amber center, two restrained golden rings and one cream die-cut outer edge. The asset contains no cat, icon, text, letters, numbers, route line, scenery, ground, extra object, cast shadow, glow outside the medallion, border frame or watermark. Center it with generous padding on a perfectly flat solid chroma green #00ff00 background edge-to-edge. Crisp high-resolution watercolor edge suitable for clean chroma removal.
```

## A+ 加载姿态提示词

四帧都从前一张生产帧定向编辑，锁定相同角色、画布、比例、光源和脚底锚点。

### Frame 1 · 展开前

```text
Use case: precise-object-edit and production animation frame. Create production frame 1 of 4 for the approved A+ map-loading animation. Use the orange tabby explorer cat identity, watercolor/gouache storybook rendering, cream die-cut outline, purple cape, blue-and-gold scarf, brown backpack, warm lantern-like lighting, and proportions from the references. Show one complete front three-quarter whole-pose cat standing upright and calmly holding a rolled parchment map vertically with both paws, looking down at it with focused curiosity. Preserve a single coherent body; no separate body parts, no cropped paws, ears, tail, backpack, or map. Lock the foot anchor at exactly the horizontal center and 88% down the square canvas. Cat plus prop should occupy about 72% of canvas height and remain centered with generous safe padding. Use a perfectly flat solid chroma green #00ff00 background edge-to-edge, with no paper texture, no ground, no cast shadow, no scenery, no lantern, no compass, no plants, no text, no letters, no symbols, no border, no watermark. The green must not appear inside the character or props. Square production asset, crisp high-resolution edges suitable for clean chroma removal.
```

### Frame 2 · 打开地图

```text
Use case: precise-object-edit. Image 1 is the ONLY production frame to edit; Image 2 is motion-storyboard guidance. Create production frame 2 of the same 4-frame A+ map-loading animation. Preserve EXACTLY the same orange tabby explorer cat identity, head and body proportions, watercolor/gouache storybook texture, cream die-cut outline, purple cape, blue-and-gold scarf, brown backpack, color, lighting, canvas size, overall scale, and foot anchor from Image 1. Keep both feet fixed at the same coordinates, with the horizontal center between them and soles anchored at 88% down the square canvas. Change only the pose and map: the cat has just unrolled the same parchment into a medium-width open map held across the lower chest with both paws, eyes scanning the route with a small focused smile. Keep the body as one complete coherent whole-pose drawing; do not crop ears, paws, feet, cape, tail, backpack, or map. Do not add a table, compass, lantern, ground, scenery, text, map letters, labels, icons, symbols, border, shadow, or watermark. Preserve the perfectly flat solid chroma green #00ff00 background edge-to-edge, with no texture and no green inside the character or prop. Crisp high-resolution production edge suitable for chroma removal; no character drift and no scale drift.
```

### Frame 3 · 核对罗盘

```text
Use case: precise-object-edit. Image 1 is the ONLY production frame to edit; Image 2 is motion-storyboard guidance. Create production frame 3 of the same 4-frame A+ map-loading animation. Preserve EXACTLY the same orange tabby explorer cat identity, facial construction, head and body proportions, watercolor/gouache texture, cream die-cut outline, purple cape, blue-and-gold scarf, brown backpack, color, lighting, square canvas, overall scale, and fixed feet from Image 1. Keep both feet at the identical coordinates and soles anchored at 88% down the canvas. The open parchment remains across the lower chest but is lowered slightly. Change only the arms, gaze, and prop action: the cat holds a small round blue-and-gold explorer compass in its right paw above the map while the left paw supports the map, eyes looking carefully at the compass with focused delight. One coherent complete whole-pose drawing; no separate body pieces and no cropped ears, paws, feet, cape, tail, backpack, map, or compass. No table, lantern, ground, scenery, text, letters, map labels, extra icons, border, cast shadow, or watermark. Preserve the perfectly flat solid chroma green #00ff00 background edge-to-edge with no texture and no green inside the character or props. Crisp high-resolution production edge for chroma removal; absolutely no anchor, identity, or scale drift.
```

### Frame 4 · 确认路线

```text
Use case: precise-object-edit. Image 1 is the ONLY production frame to edit; Image 2 locks the prior open-map pose. Create production frame 4 of the same 4-frame A+ map-loading animation. Preserve EXACTLY the same orange tabby explorer cat identity, face, head and body proportions, watercolor/gouache storybook rendering, cream die-cut outline, purple cape, blue-and-gold scarf, brown backpack, color, lighting, square canvas, overall scale, and foot coordinates. Both feet must remain fixed exactly where they are, with soles at 88% down the square canvas. Keep the same open parchment map across the lower chest. Change only the small finishing gesture: lower the compass close to the map in the left paw, use the right forepaw to point confidently at one route spot on the map, lift the eyes slightly with a proud ready-to-go smile. Keep one coherent complete whole-pose character; no separate body pieces and no cropped ears, paws, feet, cape, tail, backpack, map, or compass. No glow, table, lantern, ground, scenery, text, letters, labels, map icons, symbols, border, cast shadow, or watermark. Preserve the perfectly flat solid chroma green #00ff00 background edge-to-edge, with no texture and no green inside the character or props. Crisp high-resolution production edge for clean chroma removal; absolutely no anchor, identity, or scale drift.
```
