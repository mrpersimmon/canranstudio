---
status: accepted
partially_superseded_by: ADR-0102
---

# 教材物品使用 catalog 管理的统一透明插画资产

> 2026-08-23 现行补充：透明插画合同继续适用于 handbag 与八件独立物品；car/house 由 ADR-0102 改为 catalog 管理的完整小镇场景资产，不再使用 car-key/house-key 透明物品图。

Lesson 1–2 的 emoji 物品与胡桃木、黄铜、深夜蓝的 2.5D 失物招领站画风不一致，也无法保证跨平台形状、色彩与精细度。`handbag` 继续使用已接受的手提包道具；`pen`、`pencil`、`book`、`watch`、`coat`、`dress`、`skirt`、`shirt` 使用内置 ImageGen 分别生成的透明手绘 2.5D 资产，每件保留 1254×1254 透明 PNG 母版并生成 640×640 AVIF 与 WebP。`car`、`house` 依据 ADR-0102 使用成对的完整小镇场景资产，不要求透明通道，也不再存在钥匙代称。Catalog 实体拥有全部响应式地址，通用运行时只渲染资产，不保存课程配图副本；儿童选择中不允许 emoji 回退，全部资产必须清楚、无文字、无水印，并在桌面与 390×844 手机视口中验收。
