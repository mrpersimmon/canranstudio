# 暖灯集市地图画布 V1

## 目的

把暖灯集市从卡片网格改成移动优先的连续冒险地图，同时继续服从真实发布状态：Lesson 49–54 与音标乐园使用完整彩色地标，尚未绘制的 Lesson 55–60 不进入地图 DOM。

## 底图资产

- 文件：`assets/adventure-map/atlas/warm-lantern-parchment.jpg`
- 尺寸：`914 × 1721`
- 体积：约 `692 KB`
- 网页派生：`warm-lantern-parchment-atlas-20260804-01-{512,914}.{avif,webp}`；运行 `npm run art:build-atlas-background` 从原始 JPG 重建。
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
- Lesson 49–54 与音标乐园都只使用 `states/` 中的完整累计快照；运行时禁止重新组合旧 `landmark-base`/`growth-*` 图层。
- 推荐地标使用当前真实成长状态，不使用写死的完成预览。
- 世界总览只请求一张响应式城区入口预览；进入暖灯集市后才请求响应式底图与每个已发布地点当前进度的一张状态图。直接打开城区 URL 不得下载隐藏的世界入口图。
- 本轮不新增 Lesson 55–60、账号、授权码或服务端状态。
