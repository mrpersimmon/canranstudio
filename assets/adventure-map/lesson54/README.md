# Lesson 54 landmark assets

Lesson 54 使用固定 `1024 × 1024` 透明画布的海岸旅行亭成长组。

渲染顺序为 `landmark-base.png`、`growth-01-globe.png`、`growth-02-boat.png`、`growth-03-passport-stamps.png`、`growth-04-supplies.png`、`growth-05-celebration.png`。永久纪念物是 `compass-wave-crest.png`；`mobile-preview.png` 只用于完整状态预览。

原始 ImageGen 资产表保存在 `docs/designs/adventure-map/generated-sheets/lesson54-magenta-sheet.png`。视觉方向为儿童绘本水彩海岸亭、青绿海水与金色旅行装饰；禁止文字、人物、UI、水印和无关阶段元素。

资产由 `scripts/split-adventure-asset-sheet.py` 去除统一洋红背景并置入共同锚点。发布检查确认全部运行时 PNG 为 RGBA、四角透明、无可见洋红残留，纪念物与第五层保持独立。
