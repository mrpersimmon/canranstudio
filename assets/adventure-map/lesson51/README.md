# Lesson 51 landmark assets

Lesson 51「希腊四季之旅」是冒险地图的正式美术品质母版。运行时只使用 `states/` 中的完整累计快照，不再把 `landmark-base.png` 与 `growth-*.png` 叠加。

## 正式状态

所有正式状态均为固定 `1024 × 1024` RGBA 画布：

1. `states/state-0.png`：初始希腊花园；
2. `states/state-1.png`：蓝顶观测亭安装天气仪；
3. `states/state-2.png`：花园右侧建成蓝白露天剧场；
4. `states/state-3.png`：四季花园开花；
5. `states/state-4.png`：中央石路嵌入月份日晷；
6. `states/state-5.png`：喷泉、暖灯与蓝白庆典布置完成。

每张都是可单独加载的完整成图，但六张绝不是分别生成：它们来自同一张锁定母版的连续局部编辑。建筑、道路、围墙、镜头、比例与画布不依赖 CSS 或 JavaScript 合成。地图只加载当前一张；成就提示只在相邻两张完整状态之间切换。

`states/manifest.json` 记录无损 PNG 与 512/768/1024 三档 AVIF、WebP 派生图。运行 `npm run art:build-states -- --course lesson51` 只验证现有完整母图并生成派生格式，禁止重新组合旧图层。

## 美术来源与弃用资产

- 正式视觉锚点：`docs/designs/adventure-map/lesson51-dual-state-anchor.png`；
- 正式审查表：`docs/designs/adventure-map/lesson51-state-snapshots-contact-sheet.png`；
- 历史路径 `docs/designs/adventure-map/lesson51-growth-contact-sheet.png` 现在由同一构建步骤同步为正式审查表，旧错位拼图不得回流；
- 永久纪念：`four-seasons-guide-compass.png`，始终独立于地标状态；
- `landmark-base.png`、`growth-*.png` 与旧 `mobile-preview.png` 仅保留为历史美术过程文件，不得由地图或成就提示加载。

## 验收门

- 六张图的神庙、蓝顶、入口台阶与外围石墙锚点稳定；
- 天气仪必须从 `state-1` 起与蓝顶物理连接，不得悬浮；
- 每一步只出现本阶段内容，不能误删剧场蓝色坐席等既有结构；
- 四角透明、无可见色键残留、无裁切；
- 手机优先加载 AVIF/WebP，PNG 只作兼容回退；
- `tests/unit/landmark-state-assets.test.js` 必须通过几何锚点与资源契约检查。
