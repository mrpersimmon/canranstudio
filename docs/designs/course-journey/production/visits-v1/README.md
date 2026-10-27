# 第三段人物与环境固定包

2026-10-22，Lesson 13–18。当前首页规范仍是[统一标准 v2.0](../../2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md)。本包固定生成输入、原生输出及当次落点，不另建一份界面标准。

| 单元 | 人物与环境 | 生产素材 |
| --- | --- | --- |
| 13–14 新衣配色屋 | Louise 到 Anna 家看新衣；同一件绿裙与配套绿花帽 | `dress-friends-v1` |
| 15–16 护照小检查站 | 海关工作人员与两位丹麦旅客；两本绿护照、两只棕色箱子 | `passport-travelers-v1` |
| 17–18 办公室探访记 | Jackson 向 Richards 介绍办公室助理 Jim | `office-introduction-v1` |
| 竖环境 | 新衣小屋、检查亭、办公室庭院；拓宽中景实际铺地 | `visits-mobile-v2`，保留 v1 原稿 |
| 横环境 | 相同三处目的地与左上暖光；按横画布独立安排空间 | `visits-desktop-v1` |

[rules.md](rules.md)记录各参考图的作用、角色身份、道具和排除项；完整提示词只使用本目录的九份 `*-request.json` 原文。共九次实际内置生成：三份人物初稿、三份人物透明边缘／留白修订、横竖环境各一份及竖环境铺地修订。每次都有对应 `*-receipt.json`，不是把最终提示词反写成初次请求。

PNG 与工具原生输出逐字节相同；WebP 只编码，未重采样、裁切、拉伸、重着色或程序抠图。人物按 alpha > 16 测可见几何，alpha > 0 的全部支持范围另存凭据。细小低 alpha 残点没有被删除。17–18 实际鞋底留白小于提示词期望，凭据如实记录；网页以实际完整鞋底定位。

[placement.json](placement.json)为交付坐标快照。三个手机信息组按 17→15→13 递归避让，避免只依据上方原始坐标计算；之后若调整位置另留版本，不修改本次生成历史。已验收成品优先复用，固定提示词与引用顺序不能承诺重新生成逐像素相同。

在仓库根目录运行：

```powershell
node docs/designs/course-journey/production/visits-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/visits-v1/replay-prompt.cjs unit15-16
```

第一条校验全部锁定文件；第二条仅在 `output/fronted-opt/visits-prompts/` 重建对应请求，将历史绝对路径替换为当前工作树中同哈希文件的路径。脚本不调用生成服务、不产生付费任务。可选任务名见 [manifest.json](manifest.json)。
