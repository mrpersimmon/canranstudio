# Lesson 50 landmark assets

Lesson 50「挑食小王子」使用固定 `1024 × 1024` 透明画布的城堡成长组。

渲染顺序为 `landmark-base.png`、`growth-01-garden.png`、`growth-02-banquet.png`、`growth-03-weather-vane.png`、`growth-04-delivery.png`、`growth-05-celebration.png`。第五关完成后独立展示永久纪念物 `royal-vegetable-crest.png`；`mobile-preview.png` 仅为完整状态预览。

原始 ImageGen 资产表保存在 `docs/designs/adventure-map/generated-sheets/lesson50-magenta-sheet.png`。目标风格为儿童绘本水彩与水粉、暖色石砌小城堡、红紫色屋顶和金色点缀；禁止文字、人物、UI、水印以及与本阶段无关的装饰。

`scripts/split-adventure-asset-sheet.py` 对统一洋红背景做软边去色、分离部件、等比定位并输出相同画布。发布检查确认所有运行时 PNG 均为 RGBA、四角透明、无可见洋红残留，纪念物没有烘焙进成长层。
