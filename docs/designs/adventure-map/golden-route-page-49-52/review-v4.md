# Lesson 49-52 黄金册页 · 顶部平衡校正 V4

## 审批结论

2026-08-06，用户明确确认“V4 满足我的诉求，请继续”。V4 自此成为 Lesson 49–52 黄金册页的正式构图真值，可以进入生产实现；后续代码与响应式校正都以本图为视觉目标，不再回退到 V1–V3。

## 本轮目标

`map-composition-review-v4-balanced-top.png` 针对 V3 的两个剩余问题做窄范围校正：

- 将 Lesson 49 肉铺完整地标环境统一放大约 10%–12%，但保持其铭牌尺寸与位置；
- 将 Lesson 50 城堡及其铭牌整体下移，降低顶部两座地标的拥挤感。

Lesson 51、探险小猫、Lesson 52 及其铭牌保持原有位置和尺度。紫色路线只在 Lesson 49 与 Lesson 50 周围重新衔接。本图仍是构图审查稿，不是直接上线资产。

## 生成方式

使用内置 ImageGen 的精确图片编辑模式，以 V3 为唯一编辑目标，并以 Lesson 49、50 完成态地标锁定建筑身份；没有覆盖既有版本，也没有使用 CLI。

## 完整提示词

```text
Use case: precise-object-edit
Asset type: V4 high-fidelity portrait mobile adventure-map composition correction.

Input roles:
- Image 1 is the ONLY edit target.
- Image 2 locks the exact Lesson 49 butcher-shop landmark identity and fine details.
- Image 3 locks the exact Lesson 50 food-castle landmark identity and fine details.

Primary request:
Make exactly two composition corrections to Image 1:
1. Enlarge ONLY the complete Lesson 49 butcher-shop landmark group, excluding its plaque, by approximately 10–12% around its current center so it has the same perceived visual weight as the other three landmarks.
2. Move the complete Lesson 50 castle group AND its matching purple-bordered blank plaque downward by approximately 6–7% of the full canvas height, preserving their current internal spacing and right-side alignment.

Lesson 49 correction:
- Preserve the butcher shop's exact architecture, red tile roof, striped awning, meat tables, motorcycle cart, trees, lamps, courtyard and die-cut outline.
- Scale the entire landmark environment uniformly; do not stretch individual parts.
- Keep the red-bordered blank plaque exactly its current size and position.
- If enlargement approaches the left or top frame, shift the enlarged landmark only slightly inward so it stays fully visible with comfortable padding.
- Do not create additional meat signs, floating meat, crowns or decorations.

Lesson 50 correction:
- Move the castle, its vegetable garden, dining table, cart, trees, courtyard and die-cut outline together as one rigid visual group.
- Move its purple-bordered blank plaque downward by the same amount, retaining the same gap below the castle.
- Do not resize or redesign the castle.
- Repaint the vacated terrain above it seamlessly.
- Locally reroute the purple stone path so it continues naturally from Lesson 49 to the castle entrance and then toward Lesson 51, without changing lesson order or creating a dead end.

Absolute invariants:
- Keep Lesson 51 Greek garden, its plaque, the explorer cat, the cat's foot glow, Lesson 52 station and its plaque exactly unchanged in position, scale, identity and lighting.
- Keep exactly one cat, standing before Lesson 51 and facing the garden.
- Keep the coastline, parchment terrain, vegetation vocabulary, leather frame, color palette, watercolor/gouache medium and warm lighting unchanged.
- Keep four landmarks, four blank plaques and five empty circles per plaque.
- No text, letters, lesson numbers, logos or watermark.
- Preserve portrait canvas and overall top-to-bottom alternating route structure.

Avoid:
- top crowding;
- a butcher shop still visibly smaller than the castle, Greek garden or station;
- moving Lesson 50 sideways or leaving its plaque behind;
- overlapping the castle or plaque with Lesson 51;
- resizing any other landmark;
- changing the cat;
- duplicated or missing props;
- disconnected route;
- new UI, labels, locks, people, animals or markers.
```
