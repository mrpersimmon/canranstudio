# Lesson 1–4 平台资产记录

本记录只覆盖独立地面模块，不是最终人物成品。人物继续使用已有原图，在页面同一局部场景内定位，不重画人物。

- 生成日期：2026-10-23。
- 工具：内置 image_gen.imagegen，3 次实际调用；1–2 初版的前缘太高，进行一次地面深度修订；3–4 一次生成。
- 每次请求均为 transparent_background: true。完整原始请求在同目录 unit1-2-request.json、unit1-2-request-v2.json、unit3-4-request.json。
- 原生画布均为 1536 × 1024，RGBA。原 PNG 原样复制；WebP 为 lossless 格式编码，无裁切、抠图、缩放、重绘或合成。
- 人物参考只用于身份、色彩与叠放预留面积；输出中没有人物、柜台、雨伞、文字或星章。

| 地面 | 原 PNG / 运行 WebP | 建议脚底（画布归一化） | 无障碍地面安全矩形 |
| --- | --- | --- | --- |
| Lesson 1–2 | assets/course-journey/modules-v1/unit1-2-ground.png / .webp | (0.50, 0.71) | [0.23, 0.57, 0.77, 0.74] |
| Lesson 3–4 | assets/course-journey/modules-v1/unit3-4-ground.png / .webp | (0.50, 0.71) | [0.23, 0.56, 0.77, 0.75] |

安全矩形顺序为左、上、右、下。人物鞋底和柜台底部仍须在真实合成页面中分别校准，不应直接拿人物整图最下缘当鞋底。

透明度实测均为 0..254。平台轮廓完整，没有白色矩形底。生成图没有严格达到请求的四侧 8% 留白，实际 alpha>16 的包围盒已写入各自 receipt；容器应保留额外安全边距，不用裁切方式修补。柔和边缘由生成器原样保留。

两份 receipt 包含原始返回文件路径、PNG/WebP 字节数与 SHA-256、参考图角色与 SHA-256、实际尺寸和 alpha 范围。未采纳的 1–2 首版保留为 unit1-2-ground-first-generation.png，旧冻结资产包未改动。

