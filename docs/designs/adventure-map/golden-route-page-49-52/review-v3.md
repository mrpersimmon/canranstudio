# Lesson 49-52 黄金册页 · 四段节奏与探险小猫 V3

## 本轮目标

`map-composition-review-v3-explorer-cat.png` 同时验证两项设计：

- 把四个“地标 + 铭牌”重新排成四段纵向旅程，缓解顶部拥挤和底部空置；
- 把既有橘猫设定加入地图，作为孩子在路线中的当前位置化身。

小猫位于通往 Lesson 51 希腊庭院的路径末端，面朝当前地标。脚下的小型金色光圈替代此前的独立金色光柱；地图中不再增加第二套当前位置提示。小猫不是第五个地标，也不能被用于填补不合理留白。

本图仍是美术构图审查稿，不是直接上线的生产资产。生产实现需要继续使用固定锚点、同一角色母版和确定性的响应式布局。

## 生成方式

使用内置 ImageGen 的精确图片编辑模式。最终选稿以第一次加入小猫后的地图为编辑目标，再执行一次只针对纵向锚点和路线节奏的校正；没有覆盖 V1 或 V2，也没有使用 CLI。

## 最终选稿提示词

```text
Use case: precise-object-edit
Asset type: final V3 composition correction for a portrait mobile adventure-map art review.

Input roles:
- Image 1 is the ONLY edit target.
- Image 2 locks the exact explorer-cat identity.
- Images 3, 4 and 5 reinforce landmark identities only.

Primary request:
Change ONLY the vertical positions of the four complete landmark-plus-plaque groups, the connecting route between them, and the cat's corresponding path position. Preserve all visual identities, scale relationships, props, frame, colors and art style from Image 1. The current map is still top-heavy. Reflow it into four truly non-overlapping, nearly equal-height journey bands that use the full parchment height.

Strict safe-zone layout, measured from the top edge of the complete image:
- Lesson 49 complete landmark must stay within y = 5% to 22%; its plaque within y = 23% to 29%.
- Lesson 50 complete landmark must stay within y = 29% to 46%; its plaque within y = 47% to 53%.
- Lesson 51 complete landmark must stay within y = 53% to 70%; its plaque within y = 71% to 77%.
- Lesson 52 complete landmark must stay within y = 77% to 91%; its plaque within y = 92% to 97%.
- Each landmark remains on its existing alternating side: 49 left, 50 right, 51 left, 52 right.
- No landmark, landscaping, plaque, cat or glow from one band may intrude into another band's landmark/plaque area.
- Keep all four landmarks at the same current perceived visual weight and keep all four plaques identical in apparent size.
- The bottommost plaque must sit near the bottom frame, leaving only a modest exit margin; eliminate the current large unused lower area.

Route:
- Repaint the same purple stone path as one evenly paced continuous S-curve touching all four entrances in order.
- Give each of the four route legs comparable vertical length.
- The route enters naturally near the top and exits below Lesson 52 near the bottom frame.
- Repaint exposed terrain seamlessly with the same parchment, coast, rocks and vegetation.

Explorer cat:
- Preserve exactly one same orange-tabby explorer cat with the same face, purple cape, blue-and-gold scarf and backpack.
- Move it with the route so it stands just before the Lesson 51 entrance, in Band 3 only, facing the Greek garden.
- Keep the cat at 20–25% of the Greek landmark height.
- Preserve its small warm circular foot glow as the ONLY current-position signal.
- Do not add a vertical beacon or any other marker.

Absolute invariants:
- exact 941 x 1672 portrait canvas and leather frame;
- exact landmark architecture, signature objects, colors and watercolor detail;
- exactly four landmarks, four blank plaques and five empty circles per plaque;
- exactly one cat;
- no text, letters, numbers, logos, watermark, extra animals, people, locks or UI.

Avoid:
top crowding; bottom emptiness; overlapping vertical bounds; side-by-side bands; shrinking everything into the top; moving plaques away from their landmark; changing cat identity; redesigning buildings; changing route order; extra glow; disconnected path.
```

> ImageGen 最终输出为 941 × 1671 像素，比提示词目标少 1 个纵向像素；这是审查图，不作为生产画布尺寸依据。
