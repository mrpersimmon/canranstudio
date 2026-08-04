# Lesson 50 landmark assets

Lesson 50「挑食小王子」运行时只使用 `states/state-0.png` 至 `state-5.png` 六张完整累计状态图。城堡、菜园基线、透视和镜头固定，每关只增加与挑食、蔬菜、宴会和王子故事有关的内容。

`states/manifest.json` 登记 512/768/1024 三档 AVIF、WebP 与 PNG 回退；地图只加载当前状态，成长揭晓只显示相邻两张完整图。`royal-vegetable-crest.png` 是独立永久纪念物，不得烘焙进 `state-5`。

原始 ImageGen 资产表保存在 `docs/designs/adventure-map/generated-sheets/lesson50-magenta-sheet.png`。目标风格为儿童绘本水彩与水粉、暖色石砌小城堡、红紫色屋顶和金色点缀；禁止文字、人物、UI、水印以及与本阶段无关的装饰。

`landmark-base.png`、`growth-*.png`、`mobile-preview.png` 与原始洋红素材表只保留为历史美术过程文件，运行时不得引用。联系表为 `docs/designs/adventure-map/lesson50-state-snapshots-contact-sheet.png`。
