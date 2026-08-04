# Soundmark landmark assets

「音标魔法乐园」是暖灯集市中的四关专项支线，运行时只使用 `states/state-0.png` 至 `state-4.png` 五张完整累计状态图。魔法塔的主体、透视和镜头固定，每关只增加与元音、发音、听辨和魔法学习有关的内容。

`states/manifest.json` 登记 512/768/1024 三档 AVIF、WebP 与 PNG 回退；地图只加载当前状态，成长揭晓只显示相邻两张完整图。`vowel-star-badge.png` 是独立永久纪念物，不得烘焙进 `state-4`。

原始 ImageGen 资产表保存在 `docs/designs/adventure-map/generated-sheets/soundmark-magenta-sheet.png`。视觉方向为儿童绘本水彩音标塔、紫蓝和金色魔法光效；禁止文字、字符、人物、UI、水印以及无关阶段元素。

`landmark-base.png`、`growth-*.png`、`mobile-preview.png` 与原始洋红素材表只保留为历史美术过程文件，运行时不得引用。联系表为 `docs/designs/adventure-map/soundmark-state-snapshots-contact-sheet.png`。
