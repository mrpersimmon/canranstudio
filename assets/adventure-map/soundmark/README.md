# Soundmark landmark assets

「音标魔法乐园」是暖灯集市中的四关专项支线，使用固定 `1024 × 1024` 透明画布。

渲染顺序为 `landmark-base.png`、`growth-01-vowel-crystals.png`、`growth-02-magic-book.png`、`growth-03-listening-horns.png`、`growth-04-star-balcony.png`。四关完成后独立展示永久纪念物 `vowel-star-badge.png`；`mobile-preview.png` 只用于完整状态预览。

原始 ImageGen 资产表保存在 `docs/designs/adventure-map/generated-sheets/soundmark-magenta-sheet.png`。视觉方向为儿童绘本水彩音标塔、紫蓝和金色魔法光效；禁止文字、字符、人物、UI、水印以及无关阶段元素。

资产由 `scripts/split-adventure-asset-sheet.py` 去除统一洋红背景并置入共同锚点。发布检查确认全部运行时 PNG 为 RGBA、四角透明、无可见洋红残留，纪念物没有烘焙进最后一层。
