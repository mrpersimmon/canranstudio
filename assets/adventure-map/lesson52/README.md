# Lesson 52 landmark assets

Lesson 52「环球护照之旅 I」运行时只使用 `states/state-0.png` 至 `state-5.png` 六张完整累计状态图。旅行驿站的主体、透视和镜头固定，每关只增加与出发、交通、护照和行李有关的内容。

`states/manifest.json` 登记 512/768/1024 三档 AVIF、WebP 与 PNG 回退；地图只加载当前状态，成长揭晓只显示相邻两张完整图。`globe-compass.png` 是独立永久纪念物，不得烘焙进 `state-5`。

原始 ImageGen 资产表保存在 `docs/designs/adventure-map/generated-sheets/lesson52-magenta-sheet.png`。视觉方向为儿童绘本水彩旅行站、青蓝与暖黄配色、木质行李设施；禁止文字、人物、UI、水印和无关阶段元素。

`landmark-base.png`、`growth-*.png`、`mobile-preview.png` 与原始洋红素材表只保留为历史美术过程文件，运行时不得引用。联系表为 `docs/designs/adventure-map/lesson52-state-snapshots-contact-sheet.png`。
