# Lesson13–24 连续环境与固定提示词

2026-10-25，使用内置 `image_gen.imagegen`，共2次实际调用、2张采用环境。原人物复用，未重新生成角色。当前规则见[统一标准4.11](../../2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md#expansion-13-24)。

| 章节 | 最终素材 | 环境与用途 |
| --- | --- | --- |
| 13–18 探访长廊 | [原生PNG](../../../../../assets/course-journey/modules-v5/visits-gallery-v1.png)、[网页WebP](../../../../../assets/course-journey/modules-v5/visits-gallery-v1.webp) | 左侧家门／旅行接待／办公室柱廊，右侧栏杆庭院，同层连续铺地；WebP 393,810字节。 |
| 19–24 阳光家园庭院 | [原生PNG](../../../../../assets/course-journey/modules-v5/kindness-courtyard-v1.png)、[网页WebP](../../../../../assets/course-journey/modules-v5/kindness-courtyard-v1.webp) | 右侧住宅与露台，左侧草坪、果树和休息长椅，形成连续家庭庭院；WebP 476,294字节。 |

两张均为原生724×2172、1:3不透明图。PNG逐字节复制工具输出；WebP仅作quality90编码，没有缩放、裁切、调色、程序抠图或拼接。两次首稿均在查看完整长图及六课手机／电脑组合后采用，没有用占位图交付。

## 实际提示词与引用

完整原文见[requests.json](requests.json)，原生输出路径、尺寸、SHA与参考输入SHA见[receipt.json](receipt.json)。两次调用使用同样的有序参考：

1. `modules-v4/neighborhood-town-v1.png`：编辑派生的画风、材质与投影基准；替换建筑组织，不能照抄地理布局。
2. `modules-v3/opening-world-v1.png`：补充奶油石材、珊瑚墙、青绿点缀、左上暖光；不能继承水道、独立圆台或桥路。

固定约束包括：一幅连贯场景而非三张拼图；同层连续铺地；三个角色支撑区域与脚下信息区保持平坦清楚；人物、课号、星章、衣裙、护照、箱子、红书、冰淇淋和杯子不再由环境重复生成。主题通过建筑位置、道路组织和环境占比区分。每次重建保留原提示词与参考顺序，只替换为同SHA的本地参考路径；不能承诺随机生成逐像素一致，已有采用资产优先复用。

## 人物与接地点

13–18继续使用[dress-friends](../../../../../assets/course-journey/dress-friends-v1.webp)、[passport-travelers](../../../../../assets/course-journey/passport-travelers-v1.webp)、[office-introduction](../../../../../assets/course-journey/office-introduction-v1.webp)；19–24继续使用[icecream-family](../../../../../assets/course-journey/icecream-family-v1.webp)、[red-book-pair](../../../../../assets/course-journey/red-book-pair-v1.webp)、[shelf-glasses-pair](../../../../../assets/course-journey/shelf-glasses-pair-v1.webp)。人物身份、服装、道具和原始字节未改。

[contact-calibration.json](contact-calibration.json)保存新增34个鞋底／行李轮源像素点、目视选择的横向范围、alpha阈值和原人物SHA；它不从运行时feet反推“正确接地”。实际站位、完整原人物边界、补片范围与可见中心修正在[placement.json](placement.json)保存。两者配合真实组合页目视，不能只凭矩形或数学投影认定融合合格。

## 只读校验

```powershell
node docs/designs/course-journey/production/modules-v5/verify-manifest.cjs
```

固定16个文件：4个PNG／WebP、实际请求与收据、位置快照、接点记录、6个原人物、2个参考环境。脚本只比较固定SHA和长度，不接受参数，不更新基线，不调用生成服务；运行代码、README和截图不在此清单中。

实际页面结果与未测项见[实施记录](../../2026-10-25-Lesson13-24连续入口实施记录.md)。本地实现不代表提交、推送或发布。
