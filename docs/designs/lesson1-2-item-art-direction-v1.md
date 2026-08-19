# Lesson 1–2 课程物品插画生产规范 V1

## 生产方式

- 工具：Codex 内置 ImageGen；每个不同物品单独生成一次。
- 风格参照：`starlight-station-stage-bg-v1.png` 只提供胡桃木、黄铜、深夜蓝与暖光环境；`handbag-prop-v1.png` 只提供材质细节与完成度；首张 `pen` 输出成为其余物品的视觉系统锚点。
- 交付：十张 1254×1254 真透明 PNG 母版；每张生成 640×640 AVIF/WebP。既有 `handbag` 不重制。

## 共享最终提示

```text
Use case: stylized-concept
Asset type: children's learning game object cutout
Primary request: one <OBJECT> as a standalone game object
Style/medium: refined hand-painted 2.5D children's adventure-game illustration, tactile materials, crisp child-readable silhouette, matching the accepted handbag prop
Composition/framing: one centered object, gentle three-quarter view, fills roughly 72–78 percent of a square canvas, generous transparent margin
Lighting/mood: warm amber rim light, soft navy fill, subtle contact shadow contained in alpha
Color palette: midnight navy, deep teal, walnut brown, antique brass, cream highlights
Constraints: genuinely transparent background; exactly one object; no people, hands, readable text, logo, border, frame, scene, watermark, emoji, or flat clip-art look
Avoid: photorealistic product photography, plastic toy look, black outline, excessive glow, thin unreadable silhouette
```

## 物品差异化约束

| 资产 | 必须清楚表达 |
|---|---|
| `item-pen-v1` | 深蓝漆面钢笔、黄铜笔尖与笔夹 |
| `item-pencil-v1` | 粗一些的赭黄木铅笔、木质削尖、青绿色橡皮 |
| `item-book-v1` | 闭合深蓝布面书、奶油纸边、黄铜护角，无书名 |
| `item-watch-v1` | 棕色皮带、黄铜圆形表壳、奶油表盘 |
| `item-coat-v1` | 及膝深青羊毛外套、长袖、领口和黄铜纽扣 |
| `item-dress-v1` | 酒红一件式连衣裙、奶油领、深青腰带 |
| `item-skirt-v1` | 仅一条及膝 A 字短裙；不得出现鞋、腿或上衣 |
| `item-shirt-v1` | 奶油长袖翻领衬衫、深蓝滚边；不得变成 T 恤 |
| `item-car-key-v1` | 黄铜钥匙与深蓝皮革挂牌；挂牌是清楚汽车浮雕 |
| `item-house-key-v1` | 黄铜钥匙与房屋形深青挂牌；门窗清楚、无文字 |

## 验收证据

- 桌面：`docs/designs/lesson1-2-design-qa/item-art-stage8-desktop-20260820.png`
- 手机：`docs/designs/lesson1-2-design-qa/item-art-stage8-mobile-20260820.png`
- 自动合同：十张 PNG 均为 1254×1254 且 alpha 覆盖 0–255；二十张浏览器衍生图均为 640×640 真透明资产；儿童 DOM 不出现物品 emoji 回退。
