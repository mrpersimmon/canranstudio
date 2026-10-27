# modules-v3：单一近景与远景分工

本包用于 Lesson 1–12 的 J32 视觉融合修正。上版把完整近景背景、独立庭院和连接桥分别叠放、缩放，导致路网重叠及桥体变形。本版以每章**一张连续近景图**统一庭院、道路、台阶与建筑尺度；另有一张不承载人物落脚位置的低对比远景。

当前使用状态：J34之后，第一段与共用远景继续使用本包；第二段运行资源改为[modules-v4邻里小镇](../modules-v4/README.md)。本包原第二段图与当时请求完整保留，不改写下方历史生成数据。

本包记录实际生成与文件来源，不代表运行页面已经通过验收。当前实施、视觉判断及验证边界见[人物与环境融合复核及修正](../../2026-10-24-人物与环境融合复核及修正.md)；现行约束见[统一设计标准 J32](../../2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md)。

## 1. 采用资产与实际尺寸

本轮共 **3 次内置 image_gen 调用，采用3个资产**。没有 CLI/API 替代生成。采用文件为6个 PNG／WebP：

| 用途 | 原生尺寸 | PNG／WebP | WebP字节 |
| --- | --- | --- | ---: |
| Lesson 1–6 连续近景 | 724×2172，1:3，不透明RGB | [PNG](../../../../../assets/course-journey/modules-v3/opening-world-v1.png)／[WebP](../../../../../assets/course-journey/modules-v3/opening-world-v1.webp) | 348220 |
| Lesson 7–12 连续近景 | 724×2172，1:3，不透明RGB | [PNG](../../../../../assets/course-journey/modules-v3/neighborhood-world-v1.png)／[WebP](../../../../../assets/course-journey/modules-v3/neighborhood-world-v1.webp) | 370828 |
| 桌面远景氛围 | 1536×1024，3:2，不透明RGB | [PNG](../../../../../assets/course-journey/modules-v3/distant-garden-v1.png)／[WebP](../../../../../assets/course-journey/modules-v3/distant-garden-v1.webp) | 102448 |

首段请求给出的理想尺寸是1024×3072，工具实际原生返回724×2172，保持了1:3比例；本包未放大或伪报理想尺寸。第二段按首段连续构图编辑，原生同为724×2172。远景原生1536×1024，与请求一致。

PNG按生成工具返回的原始字节复制保留。WebP仅作quality90格式编码，没有裁切、缩放、重新绘制像素、去背或把人物烧入地形。不存在三个物理裁切后的section图文件。

## 2. 近景、人物与远景的职责

- **近景每章只有一个来源。** 同一张完整图片包含三个相连庭院、道路、台阶与承重墙体。HTML／CSS按原生比例显示整段图，不能把宽、高分别强拉到布局端点。
- **section是布局区段，不是重新生成的庭院。** 前端用等比图上的连续区段对应课程；不能把各区段独立拉伸、留缝后再用另一张桥强行连接。
- **人物使用已有原资源。** 本轮环境生成没有改写原人物与原道具文件，未把人物复制进背景。人物大小、脚底位置和透视仍需与实际近景组合检查，素材来源一致不能代替这一检查。
- **脚下动效补片引用同源像素。** 如运行实现使用小范围地面补片与人物共同回弹，其内容来自同一近景图、同一位置、同一比例的HTML／CSS显示区域；它不是另生成的平台。补片范围与动效边缘需要实页检查，禁止借补片重新叠加一套路网。
- **远景只提供氛围。** distant-garden-v1为柔焦绿丘、远处小建筑、树冠与中央浅色薄雾。生成后目视未见近景路面、庭院、台阶、桥或可站人的平台；它不能提供人物脚点，也不能替代前景的连续道路。
- 生成阶段与运行阶段职责分开。资产交付不等于落脚位置、文字归属、触控目标、授权范围、加载恢复或动画已经通过。

## 3. 实际提示词、参考与收据

以下JSON保留发送给内置工具的完整实际提示词、参考图角色、工具返回位置、原生元数据、引用及采用文件SHA。绝对返回路径只是历史溯源信息，不作为项目运行或校验依赖。

| 调用 | 实际请求／收据 | 参考图用途 |
| --- | --- | --- |
| 1：首段连续近景 | [opening-request.json](opening-request.json)／[opening-world-v1-receipt.json](opening-world-v1-receipt.json) | [原认可首段环境](../../../../../assets/course-journey/opening-mobile-v2.webp)为画风参考；[原手包人物](../../../../../assets/course-journey/handbag-couple.webp)与[原雨伞柜台人物](../../../../../assets/course-journey/umbrella-counter-v1.webp)仅供比例、配色和视角参照，要求不生成他们 |
| 2：第二段连续近景 | [neighborhood-request.json](neighborhood-request.json)／[neighborhood-world-v1-receipt.json](neighborhood-world-v1-receipt.json) | [新首段近景](../../../../../assets/course-journey/modules-v3/opening-world-v1.png)为编辑目标；[原认可第二段环境](../../../../../assets/course-journey/neighborhood-mobile-v1.webp)为主题与画风参考，仅替换花拱／街角门廊／校舍主题 |
| 3：远景 | [distant-receipt.json](distant-receipt.json)，实际请求与输出记录合存一份 | [原桌面环境](../../../../../assets/course-journey/opening-desktop-v2.webp)与[新首段近景](../../../../../assets/course-journey/modules-v3/opening-world-v1.png)仅为色彩／画风参考，不复制近处路网 |

不能从提示词中的“必须”推断生成结果一定满足约束。真实人物接地、空间透视、路宽、遮挡、相邻完整构图与手机辨识度仍由当轮页面截图和独立视觉复核确定。

## 4. 冻结范围与只读校验

[verify-manifest.cjs](verify-manifest.cjs)内嵌首次核对的SHA-256和字节数，固定 **11个文件**：

- 6个采用PNG／WebP；
- 5个实际请求／收据JSON：opening-request、opening-world-v1-receipt、neighborhood-request、neighborhood-world-v1-receipt、distant-receipt。

运行以下命令只读取项目内文件并比较固定校验值，不写回或重建基线，也不依赖历史机器的generated_images目录：

```text
node docs/designs/course-journey/production/modules-v3/verify-manifest.cjs
```

运行模型、布局坐标、组件、样式、验收截图、本文和其他可更新文档不在冻结范围。脚本不提供更新参数；资产需要再次编辑时另建版本并保留本包，不用更新旧基线掩盖改动。

素材校验通过仅表示本包11个文件与冻结内容一致。旧版素材及其历史验收记录保留，不以本版标准改写既往凭据。

