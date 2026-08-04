# Lesson 49 landmark assets

Lesson 49「肉店大冒险」运行时只使用 `states/state-0.png` 至 `state-5.png` 六张完整累计状态图。六张图固定在同一 `1024 × 1024` RGBA 母版上，建筑、透视、外轮廓与镜头不动；每关只增加与食物、店铺经营和配送有关的内容。

`states/manifest.json` 同时登记 512/768/1024 三档 AVIF、WebP 与 PNG 回退。地图只加载当前进度的一张，成长揭晓只切换相邻两张完整状态图。`food-basket.png` 是独立永久纪念物，不得烘焙进 `state-5`。

`landmark-base.png`、`growth-*.png`、`base.png`、旧累计图及 `mobile-preview.png` 只保留作历史美术参考，运行时和课程目录不得引用。联系表为 `docs/designs/adventure-map/lesson49-state-snapshots-contact-sheet.png`。
