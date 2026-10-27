# 旅程地标反馈素材固定包 v1

2026-10-22。人物和环境沿用已确认的原生素材，本包只新增满星星花金章。

- [medal-request.json](medal-request.json)：实际提交给内置 `image_gen.imagegen` 的完整提示词、参考顺序和透明开关，保留当时路径。
- [medal-receipt.json](medal-receipt.json)：实际输出位置、原生尺寸、透明度、PNG／WebP 哈希及检查记录。
- [manifest.json](manifest.json)：参考、请求、回执和成品的固定 SHA-256。

参考顺序固定为品牌星花、Lesson 1–2 人物、认可手机地图。正面圆形暖金珐琅章；中心浮雕是一朵星花和两片叶子。保留暖棕、奶油高光、蜂蜜金凹面，不增加文字、星数、皇冠、丝带、外部光晕和背景。星数与课程状态由运行时显示，不烘焙进金章。

提示词请求约 768px；生成器实际返回 1254×1254，保留原生 PNG 和真实 alpha，未抠图、裁剪或拉伸。WebP 以原尺寸编码，质量 92、alpha 质量 100，约 150KiB。已有成品优先复用；固定输入不能保证随机生成逐像素相同。

在仓库根目录执行：

```powershell
node docs/designs/course-journey/production/game-feedback-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/game-feedback-v1/replay-prompt.cjs completion-medal
```

后一个命令只按当前工作树重建参考绝对路径，并写出请求 JSON；不会调用生成服务。原 v1.0 和 `story-nodes-v1` 包保持冻结。动效与数据边界见[地标反馈 v1.5](../../2026-10-22-0114-v1.5-地标点击与满星纪念反馈.md)。
