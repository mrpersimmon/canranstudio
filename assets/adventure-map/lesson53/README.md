# Lesson 53 landmark assets

Lesson 53 使用固定 `1024 × 1024` 透明画布的天气播报小屋成长组。

渲染顺序为 `landmark-base.png`、`growth-01-weather-vane.png`、`growth-02-broadcast.png`、`growth-03-weather-jars.png`、`growth-04-rain-gauge.png`、`growth-05-celebration.png`。永久纪念物是 `weather-broadcaster-crest.png`；`mobile-preview.png` 只用于完整状态预览。

原始 ImageGen 资产表保存在 `docs/designs/adventure-map/generated-sheets/lesson53-magenta-sheet.png`。视觉方向为儿童绘本水彩气象小屋、海蓝和暖红配色、清楚可辨的气象器具；禁止文字、人物、UI、水印和无关阶段元素。

资产由 `scripts/split-adventure-asset-sheet.py` 去除统一洋红背景并置入共同锚点。发布检查确认全部运行时 PNG 为 RGBA、四角透明、无可见洋红残留，纪念物没有提前出现在成长层。
