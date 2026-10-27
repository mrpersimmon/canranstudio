# 旅程第二段素材固定包

2026-10-22 · Lesson 7–8、9–10、11–12。

三组人物、手机环境、桌面环境共五个成品，均由内置 `image_gen.imagegen` 生成。原生 PNG 和无裁剪 WebP 保存于 [assets/course-journey](../../../../../assets/course-journey/)。人物与环境规则见 [rules.md](rules.md)，原生尺寸、alpha 和 SHA 见各 `*-receipt.json`。金章复用 [game-feedback-v1](../game-feedback-v1/README.md)，新增光效由页面实现。

| 成品 | PNG／WebP 文件名 | 原生尺寸 |
| --- | --- | --- |
| Robert 与 Sophie | `interview-couple-v1` | 1254×1254 |
| Steven 与 Helen | `greeting-neighbors-v1` | 1254×1254 |
| 老师、Dave 与 Tim | `shirt-return-v1` | 1536×1024 |
| 第二段手机环境 | `neighborhood-mobile-v1` | 1024×1536 |
| 第二段桌面环境 | `neighborhood-desktop-v1` | 1374×1145 |

`unit7-8-request.json`、`unit9-10-request.json`、`unit11-12-request.json` 和两个 `environment-*-request.json` 保存实际完整提示词与有序引用。9–10 另增加透明边距；11–12 另修正鞋下留白与毛衣第二横条，两次调用均保留。未丢弃原请求来冒充一次成功。

```powershell
node docs/designs/course-journey/production/next-three-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/next-three-v1/replay-prompt.cjs unit9-10-margin
```

可选配方为 `unit7-8`、`unit9-10`、`unit9-10-margin`、`unit11-12`、`unit11-12-margin`、`environment-mobile`、`environment-desktop`。脚本只校验输入并重建当前工作树路径，写出 JSON；不调用生成服务。`placement.json` 保存本版验收坐标，原首段固定包保持不变。后续调整建立新版本，并保留当时证据。
