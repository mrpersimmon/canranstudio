# 首段单元人物与场景固定包

本包保存 Lesson 3–4、5–6 的内置 imagegen 实际请求、定向修正、原生图片凭据，以及手机／桌面环境的扩展。原始 v1.0 风格包继续保持原样。当前共用要求见[生成规则](rules.md)，已验收图片在仓库的 `assets/course-journey/`。

| 工作 | 初次请求 | 定向修正 | 结果与测量 |
| --- | --- | --- | --- |
| 雨伞认领人物与柜台 | [完整提示词与参考](unit3-4-request.json) | [留白修正](unit3-4-margin-request.json) | [原生图、alpha 与身份](unit3-4-receipt.json) |
| 学堂见面三人组 | [完整提示词与参考](unit5-6-request.json) | [比例与留白修正](unit5-6-refinement-request.json) | [原生图、alpha 与身份](unit5-6-receipt.json) |
| 手机环境 | [初次扩展](mobile-environment-request.json) | [纵向空间修正](mobile-environment-revision-02-request.json) | [实际平台坐标](mobile-environment-receipt.json) |
| 桌面环境 | [清空柜台位置与扩展前庭](desktop-environment-request.json) | 无 | [实际平台坐标](desktop-environment-receipt.json) |

[网页编码记录](web-assets.json)仅记录 PNG 到 WebP 的编码，原生 PNG 和透明通道保留。人物在地图、前三课快捷入口、当前课程区和搜索结果使用同一套素材；纪念卡原图没有被替换。

## 校验与重建请求

在仓库根目录运行：

```powershell
node docs/designs/course-journey/production/story-nodes-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/story-nodes-v1/replay-prompt.cjs unit3-4
node docs/designs/course-journey/production/story-nodes-v1/replay-prompt.cjs unit5-6
```

可选工作还包括 `unit3-4-margin`、`unit5-6-refinement`、`mobile-environment`、`mobile-environment-refinement` 和 `desktop-environment`。脚本验证[锁定清单](manifest.json)，将历史绝对引用替换为当前工作树中的同哈希文件，输出到 `output/fronted-opt/story-node-prompts/`。它只生成可审阅请求，不调用图像服务。历史请求保持实际调用时的原文和路径，修正所需的中间图片也已归档。

尺寸、透明开关和参考顺序属于具体工作，不从其他任务猜测。需要生成时使用内置图像工具，检查输出后再接入页面；校验成功不代表新生成结果已经通过视觉或手机验收。
