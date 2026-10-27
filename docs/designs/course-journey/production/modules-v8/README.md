# 全72入口复查后的局部背景修订

2026-10-26，内置`image_gen.imagegen`实际编辑7次，采用6张背景，覆盖1–6、19–24、37–42、55–60、61–66、67–72。人物与原道具文件不变。其余章节沿用原采用图；旧v3／v5／v6／v7固定包不改写。

本包来自[全72入口手机优先复查](../../2026-10-26-全72单元手机优先整体复查与修复.md)。规则统一进入[现行标准J42–J44](../../2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md#full72-mobile-audit)，运行时选择见[修订映射](../../../../../course-journey/mobile-audit-worlds.json)。

| 章节 | 采用文件 | 局部修正 |
| --- | --- | --- |
| 1–6 初见花园 | [opening v2](../../../../../assets/course-journey/modules-v8/opening-mobile-clearance-v2.png) | 延长平台铺地，将中央前缘、植物与连接路移开课号区域，保留珊瑚桥、青绿水面、紫亭与学堂。 |
| 19–24 家庭庭院 | [kindness v1](../../../../../assets/course-journey/modules-v8/kindness-mobile-clearance-v1.png) | 中间入口下方右侧屋檐收回，保留树木、家门及门廊。 |
| 37–42 手作小院 | [making v1](../../../../../assets/course-journey/modules-v8/making-mobile-clearance-v1.png) | 中间入口下方右侧屋顶外沿收回。 |
| 55–60 灯火邻里 | [everyday v1](../../../../../assets/course-journey/modules-v8/everyday-mobile-clearance-v1.png) | 中间阅读场景下方文具店的屋檐退至左侧。 |
| 61–66 安心花园 | [caring v1](../../../../../assets/course-journey/modules-v8/caring-mobile-clearance-v1.png) | 前两站下方的门廊屋檐收回右侧。 |
| 67–72 街角时光廊 | [memories v1](../../../../../assets/course-journey/modules-v8/memories-mobile-clearance-v1.png) | 前两站下方的左侧店铺檐口收回，保留照片橱窗、条纹遮阳篷及家门。 |

PNG逐字节复制工具原始输出，WebP只用quality90编码，没有裁切、拉伸、调色或人工补像素。opening v2和kindness v1原生为724×2171，其他四张为724×2172，按J41登记真实尺寸和H/3区段。

## 实际提示词与取舍

- [executed-requests.json](executed-requests.json)为7次实际工具调用参数的完整入口，保留参考顺序和采用标记。
- [requests.json](requests.json)为首批6个局部编辑请求；[opening-second-request.json](opening-second-request.json)为首章的第二次修正，明确三个源像素区域，并引用实际手机失败截图。
- [generation-receipts.json](generation-receipts.json)保存7个原稿、WebP、原输出位置、尺寸、SHA和取舍原因。
- [reference-inputs.json](reference-inputs.json)记录9个不同参考输入。参考图中的UI仅说明问题位置，不能被重新画进背景。
- [placement.json](placement.json)保存6章实际源尺寸、原人物和当前局部位置；[review.json](review.json)记录采用范围。

首章v1修正后，真实320像素组合中仍有桥沿和植物进入课号区域，因此未采用；v2在实际手机组合复核后采用。所有18个受影响入口重新查看320像素组合，6个中间地标另外查看1440像素电脑画面。数学接地检查不代替这一步。

已有成品优先复用；固定提示词与参考图不能保证随机再生成逐像素一致。需要再改时新增版本，不能覆盖本包或早期包的固定凭据。

## 只读来源检查

```powershell
node docs/designs/course-journey/production/modules-v8/verify-manifest.cjs
```

固定49文件，包含全部7张原稿及7个编码文件、原参考图和两张诊断截图、18组原人物，以及实际请求、收据与位置快照。脚本不接受参数、不更新基线、不调用生成服务。README、运行代码与一般测试截图不属于美术冻结清单。

未提交、未推送、未发布。浏览器复查范围与真机限制以本轮复查记录为准。
