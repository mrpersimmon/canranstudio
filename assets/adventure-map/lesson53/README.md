# Lesson 53 landmark assets

Lesson 53「英伦气候小主播」运行时只使用 `states/state-0.png` 至 `state-5.png` 六张完整累计状态图。气象小屋的主体、透视和镜头固定，每关只增加与天气观测、播报和测量有关的内容。

`states/manifest.json` 登记 512/768/1024 三档 AVIF、WebP 与 PNG 回退；地图只加载当前状态，成长揭晓只显示相邻两张完整图。`weather-broadcaster-crest.png` 是独立永久纪念物，不得烘焙进 `state-5`。

原始 ImageGen 资产表保存在 `docs/designs/adventure-map/generated-sheets/lesson53-magenta-sheet.png`。视觉方向为儿童绘本水彩气象小屋、海蓝和暖红配色、清楚可辨的气象器具；禁止文字、人物、UI、水印和无关阶段元素。

`landmark-base.png`、`growth-*.png`、`mobile-preview.png` 与原始洋红素材表只保留为历史美术过程文件，运行时不得引用。联系表为 `docs/designs/adventure-map/lesson53-state-snapshots-contact-sheet.png`。
