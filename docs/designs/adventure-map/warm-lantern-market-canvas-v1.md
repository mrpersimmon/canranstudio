# 暖灯集市地图画布 V1

## 目的

把暖灯集市从卡片网格改成移动优先的连续冒险地图，同时继续服从真实发布状态：当前只有 Lesson 49 和 Lesson 51 是彩色、可进入的地图地点；Lesson 50 与 Lesson 52–60 仍是不可操作的铅笔远景。

## 底图资产

- 文件：`assets/adventure-map/atlas/warm-lantern-parchment.jpg`
- 尺寸：`914 × 1721`
- 体积：约 `692 KB`
- 生成方式：内置 ImageGen 编辑模式；用户提供的竖向地图概念图只作为构图、纸张、装订、路线与水彩质感参考。
- 输出职责：只提供书页、皮革封面、纸张纹理、地形、植物、海岸、罗盘和弯曲路线；课程标题、状态、按钮和真实地标均由页面运行时叠放。

## 最终生成提示

```text
Use case: precise-object-edit
Asset type: mobile-first website adventure-map background, portrait 9:16
Input image: Image 1 is the composition, paper texture, binding, watercolor linework, and warm storybook style reference.
Primary request: Transform the reference into a reusable EMPTY adventure-atlas background. Preserve the tall bound parchment-book composition, layered torn paper edges, warm aged vellum texture, hand-painted watercolor terrain, faint pencil mountains/trees/coastline, and one clear winding route that travels from the upper left through the center to the lower right.
Composition: keep large calm blank zones for interactive HTML landmarks: upper-left, center, lower-right, and lower-left. Keep the route visible between those zones, with subtle stitched/dotted segments and a faint violet glow only along the route.
Style/medium: premium children's picture-book watercolor, tactile paper collage, hand-inked cartography, warm lamp-lit market mood; match the reference's density and craftsmanship.
Color palette: parchment cream, tea brown, faded moss green, dusty violet, muted Mediterranean blue.
Constraints: remove every existing title plaque, course label, number, badge, stamp, button, tab, signpost, pin note, character, cat, castle, butcher shop, Greek temple, eco station, side-quest tower, souvenir, lock, and all other foreground interactive objects. No readable text anywhere. No numbers. No letters. No icons. No logos. No watermark. Do not invent any Lesson 52 artwork or any recognizable lesson building. The result must be a clean, reusable background layer with only page, binding, terrain, vegetation, coastline, compass-style cartographic marks, and route.
Preserve: portrait orientation, centered book page on a dark brown cover, substantial paper margins, curled/torn edges, and realistic room for UI overlays.
```

## 运行时边界

- 地图仍由共享课程目录和设备学习档案决定内容，不在 CSS 中猜课程状态。
- Lesson 49 继续使用累计快照；Lesson 51 继续使用固定底图加独立成长图层。
- 推荐地标使用当前真实成长状态，不使用写死的完成预览。
- 首次世界总览仍延迟加载全部 `assets/adventure-map/` 文件；进入暖灯集市后才请求底图与当前地点图层。
- 不新增 Lesson 52 美术、课程路由、账号、授权码或服务端状态。
