# Lesson 49-52 黄金册页 · 地标视觉重量校正 V2

## 本轮目标

本轮只修正 `map-composition-review-v1.png` 中四个地标的视觉重量，不改变路线页结构或美术方向。

- Lesson 49 肉铺作为基准尺度；
- Lesson 50 城堡整体缩小；
- Lesson 51 希腊庭院适度放大，并继续只用金色光晕与路线信标表达当前任务；
- Lesson 52 旅行车站整体缩小；
- 四张空白铭牌统一宽度、间距和阅读节奏。

校正稿为 `map-composition-review-v2-balanced.png`。它仍是美术构图审查稿，不是可以直接上线的生产资产。正式制作时，每个地标应放入等大的隐形锚点框，依据非透明轮廓面积校准视觉重量，而不是依据 PNG 画布尺寸缩放；同页四个地标的感知面积差建议控制在约 10% 内。

## 生成方式

使用内置 ImageGen 的精确图片编辑模式，以 V1 地图为唯一编辑目标，并以 Lesson 49-52 的完成态地标为身份参考。没有覆盖 V1，也没有使用 CLI 或透明背景降级路径。

## 完整提示词

```text
Use case: precise-object-edit
Asset type: revised high-fidelity portrait mobile adventure-map composition review.

Input roles:
- Image 1 is the ONLY edit target and must remain the same overall map.
- Image 2 is the exact Lesson 49 butcher-shop landmark identity reference.
- Image 3 is the exact Lesson 50 food-castle landmark identity reference.
- Image 4 is the exact Lesson 51 Greek four-seasons garden landmark identity reference.
- Image 5 is the exact Lesson 52 world-travel station landmark identity reference.

Primary edit: change ONLY the four landmark scales, their immediate breathing room, and the corresponding plaque placement so all four landmarks have equal perceived visual weight.

Required scale corrections relative to Image 1:
- Lesson 49 upper-left butcher shop: keep near its current size; this is the target visual weight.
- Lesson 50 upper-right castle: shrink the entire landmark group by about 15%.
- Lesson 51 lower-left Greek garden: enlarge the entire landmark group by about 10%.
- Lesson 52 lower-right travel station: shrink the entire landmark group by about 15–20%.
- Treat each landmark as occupying an equal invisible anchor box. Normalize by visible silhouette/visual area, not by source-image pixel dimensions. The four perceived areas should differ by no more than roughly 10%.
- All four blank plaques should have the same apparent width, height, and vertical gap below their landmarks.
- Lesson 51 stays the current quest and is indicated ONLY by the existing warm golden halo and route beacon. Do not make it larger merely because it is current.

Preserve unchanged:
- exact portrait dimensions and aspect ratio;
- leather-and-parchment frame, parchment terrain, coastline, vegetation and map texture;
- the purple route's exact overall shape, continuity and top-to-bottom direction;
- the four locations' order and left/right anchor positions;
- each building's identity, architecture, colors and signature props;
- the blank decorative plaques and five empty circular progress marks;
- the quiet premium hand-painted watercolor/isometric children's atlas style;
- warm evening lighting and the existing current-quest golden glow around Lesson 51;
- no text, letters, numbers, logos or watermark anywhere.

When a landmark is reduced, repaint the newly exposed background as seamless parchment terrain and vegetation. Keep every landmark fully visible, comfortably separated from its plaque and map frame, with no overlap or crop.

Avoid:
- redesigning or re-generating the buildings into different architecture;
- moving landmarks to new quadrants;
- changing or disconnecting the route;
- adding, duplicating, removing, stretching or cropping any landmark;
- making any non-current landmark glow;
- changing the map composition beyond the stated scale/spacing correction;
- writing any text or symbols.
```
