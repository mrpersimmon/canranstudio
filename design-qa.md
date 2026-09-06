# 当前版本的验收记录 · 2026-09-06

final result: passed

适用分支 `codex/duolingo-version`，范围为 Lesson 1–6 的地图、课内、课本、复习及异常恢复。本次修复了深色加载样式泄漏引起的浅底白字和图片变黑，并补上可读性与遮挡检查。

**更正：上一份地图验收漏检了进入课程后的可读性，其 passed 不足以代表整套课程通过。** 本次先在旧版重现失败，再修复并完成实际浏览器检查。

## 视觉依据与同状态比较

[用户问题图](docs/designs/readability-guard/qa/user-report.png) 为 905×799，完整浏览器视口未知。[既有浅色课内参考](docs/designs/lesson1-6-path-v4/qa/reference-story.png) 用于主题和人物完整性参考。

修复前后在同一故事进度、906×801 CSS px、deviceScaleFactor 1 截取原生 PNG：两句均为 “Excuse me!” 和 “Yes?”。按照截图 ICC 转换至 sRGB 后制作并排图，保留原图，不缩放内容。

- [完整页面前后对比](docs/designs/readability-guard/qa/comparison-full.png)
- [猫猫和对话重点对比](docs/designs/readability-guard/qa/comparison-detail.png)
- [手机对话](docs/designs/readability-guard/qa/story-420.png)、[420 像素交接选择](docs/designs/readability-guard/qa/handoff-420.jpg)、[320 像素交接选择](docs/designs/readability-guard/qa/handoff-320.jpg)、[手机课本](docs/designs/readability-guard/qa/reference-320.jpg)
- [已完成 5 关的窄屏地图](docs/designs/readability-guard/qa/map-progress-5-320.png)、[词句题人物边界](docs/designs/readability-guard/qa/scene-fixed-420.png)、[异常恢复页](docs/designs/readability-guard/qa/blocked-906.png)

## 五项必查表面

| 表面 | 结果 |
| --- | --- |
| 字体 | 原有字体已加载，普通和当前气泡、角色名、操作文字均可辨认。 |
| 布局 | 同状态前后布局核对；另外修复地图猫猫遮挡开始按钮、插画撑出场景压住角色名。窄屏历史对话可滚动，主要操作可触达。 |
| 色彩 | 地图保持深色；课内及异常页面明确浅底深字。原问题第一句对比度从 1.055:1 提升至 9.717:1，两处不达标的小字已调深。 |
| 图像 | 完整猫猫与物品正常加载，教学图片没有被深色背景压黑，人物未通过裁切方式修复。 |
| 文案 | 课程内容、答案和儿童操作文案保持原样。 |

## 验证与交付边界

内置浏览器覆盖 320×568、420×856、906×801、1440×900，各 242 个状态，包含全部 52 个活动、11 个节点，共 968 个状态。选择、提示、错误、正确、完成、课本、复习、保存失败和异常恢复均包含在内。

浅底白字、深底混合和图片缺失三种故障注入均被拦截。浏览器记录必须与当前代码、样式、素材及检查代码的指纹一致，缺失、失败或过期记录将阻止生成发布包。57 项程序检查通过；这些程序检查不代替实际页面验收。

真实首页另验证了已有进度恢复、真实音频播放期间禁止继续、手动推进、选择反馈、交接猫猫、返回地图和课本；浏览器 warning/error 为空。测试页模拟音频完成事件，不构成音质验收。

[完整原因、修复和证据记录](docs/designs/readability-guard/design-qa.md) · [防护网运行说明](docs/designs/readability-guard/README.md)

全部发现的 P0/P1/P2 已修复，并完成同状态截图及两轮浏览器矩阵复核。当前结论是本地可读性验收通过；CI 配置已加入，未触发远端 CI，未部署线上网站。

## 历史记录

- [深色闯关地图验收，已补充漏检更正](docs/designs/learning-path-dark/design-qa.md)
- [原始 V4 课程验收](docs/designs/lesson1-6-path-v4/design-qa.md)
- [独立分支验证](docs/designs/lesson1-6-path-v4/branch-isolation.md)
- [既有正式发布验收](docs/designs/lesson1-6-path-v4/publication.md)
