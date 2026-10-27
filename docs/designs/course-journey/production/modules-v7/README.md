# Lesson49–144 全量连续环境与固定提示词

2026-10-26，使用内置image_gen.imagegen实际29次调用，采用16张环境，复用48组原人物与道具。结合此前1–48，当前全部72个配对入口统一采用连续近景。[现行标准4.13](../../2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md#expansion-49-144)及[实施记录](../../2026-10-26-Lesson49-144全量连续入口实施记录.md)分别说明规则与实际验收边界。

## 采用清单

| 章节 | 采用版本 | 原生尺寸 | WebP字节 | 文件与请求 |
| --- | --- | --- | --- | --- |
| Lesson 49–54 四季市集 | seasons-market-v2 | 724×2172 | 501,112 | [PNG](../../../../../assets/course-journey/modules-v7/seasons-market-v2.png) · [WebP](../../../../../assets/course-journey/modules-v7/seasons-market-v2.webp) · [采用请求](revisions-round1.json) |
| Lesson 55–60 灯火邻里 | everyday-evening-v2 | 724×2172 | 479,278 | [PNG](../../../../../assets/course-journey/modules-v7/everyday-evening-v2.png) · [WebP](../../../../../assets/course-journey/modules-v7/everyday-evening-v2.webp) · [采用请求](composite-review-revisions.json) |
| Lesson 61–66 安心花园 | caring-veranda-v2 | 724×2172 | 533,628 | [PNG](../../../../../assets/course-journey/modules-v7/caring-veranda-v2.png) · [WebP](../../../../../assets/course-journey/modules-v7/caring-veranda-v2.webp) · [采用请求](revisions-round1.json) |
| Lesson 67–72 街角时光廊 | memories-arcade-v1 | 724×2172 | 501,150 | [PNG](../../../../../assets/course-journey/modules-v7/memories-arcade-v1.png) · [WebP](../../../../../assets/course-journey/modules-v7/memories-arcade-v1.webp) · [采用请求](requests.json) |
| Lesson 73–78 车站服务街 | appointments-street-v2 | 724×2172 | 495,808 | [PNG](../../../../../assets/course-journey/modules-v7/appointments-street-v2.png) · [WebP](../../../../../assets/course-journey/modules-v7/appointments-street-v2.webp) · [采用请求](revisions-round1.json) |
| Lesson 79–84 出发前的家 | preparations-home-v3 | 724×2171 | 355,918 | [PNG](../../../../../assets/course-journey/modules-v7/preparations-home-v3.png) · [WebP](../../../../../assets/course-journey/modules-v7/preparations-home-v3.webp) · [采用请求](composite-review-revisions.json) |
| Lesson 85–90 城市工坊街 | decisions-block-v1 | 724×2172 | 525,498 | [PNG](../../../../../assets/course-journey/modules-v7/decisions-block-v1.png) · [WebP](../../../../../assets/course-journey/modules-v7/decisions-block-v1.webp) · [采用请求](requests.json) |
| Lesson 91–96 启程长廊 | departures-promenade-v2 | 724×2171 | 463,632 | [PNG](../../../../../assets/course-journey/modules-v7/departures-promenade-v2.png) · [WebP](../../../../../assets/course-journey/modules-v7/departures-promenade-v2.webp) · [采用请求](revisions-round1.json) |
| Lesson 97–102 书信问候庭 | messages-courtyard-v1 | 724×2172 | 519,450 | [PNG](../../../../../assets/course-journey/modules-v7/messages-courtyard-v1.png) · [WebP](../../../../../assets/course-journey/modules-v7/messages-courtyard-v1.webp) · [采用请求](requests.json) |
| Lesson 103–108 学堂与书香街 | learning-atrium-v1 | 724×2172 | 512,104 | [PNG](../../../../../assets/course-journey/modules-v7/learning-atrium-v1.png) · [WebP](../../../../../assets/course-journey/modules-v7/learning-atrium-v1.webp) · [采用请求](requests.json) |
| Lesson 109–114 咖啡与出行街 | choices-transit-v3 | 724×2172 | 455,230 | [PNG](../../../../../assets/course-journey/modules-v7/choices-transit-v3.png) · [WebP](../../../../../assets/course-journey/modules-v7/choices-transit-v3.webp) · [采用请求](revisions-round2.json) |
| Lesson 115–120 家园小故事 | surprises-house-v2 | 724×2172 | 512,410 | [PNG](../../../../../assets/course-journey/modules-v7/surprises-house-v2.png) · [WebP](../../../../../assets/course-journey/modules-v7/surprises-house-v2.webp) · [采用请求](revisions-round1.json) |
| Lesson 121–126 雨窗旧书廊 | stories-rain-gallery-v1 | 724×2172 | 447,820 | [PNG](../../../../../assets/course-journey/modules-v7/stories-rain-gallery-v1.png) · [WebP](../../../../../assets/course-journey/modules-v7/stories-rain-gallery-v1.webp) · [采用请求](requests-final-four.json) |
| Lesson 127–132 梧桐漫想街 | possibilities-plane-trees-v1 | 724×2172 | 546,622 | [PNG](../../../../../assets/course-journey/modules-v7/possibilities-plane-trees-v1.png) · [WebP](../../../../../assets/course-journey/modules-v7/possibilities-plane-trees-v1.webp) · [采用请求](requests-final-four.json) |
| Lesson 133–138 城市会客露台 | news-terraces-v1 | 724×2172 | 484,392 | [PNG](../../../../../assets/course-journey/modules-v7/news-terraces-v1.png) · [WebP](../../../../../assets/course-journey/modules-v7/news-terraces-v1.webp) · [采用请求](requests-final-four.json) |
| Lesson 139–144 林间车站 | woodland-station-v2 | 724×2172 | 451,832 | [PNG](../../../../../assets/course-journey/modules-v7/woodland-station-v2.png) · [WebP](../../../../../assets/course-journey/modules-v7/woodland-station-v2.webp) · [采用请求](woodland-interior-revision.json) |

PNG逐字节复制工具输出，WebP只作quality90编码；接入环节没有裁切、缩放、调色、拼图、人工补像素或重新生成原人物。14张采用图为724×2172，启程长廊与出发前居室为724×2171。

## 原生尺寸与一次像素取整差

目标比例1:3，最终采用源文件的真实尺寸。启程长廊的连续地面已修好，但多次尺寸编辑仍返回724×2171；没有登记成虚假的2172，也没有换回存在断层的旧稿。按统一标准J41，整图最多容许一个原生像素取整差，原图区段高度按H/3计算，人物artboard仍为1:1，同源补片按原始区段偏移。

旧的每段等于原图宽度算法会在中段、末段累积偏移；本轮加入了实际原生尺寸、完整区段比例和补片逐边对齐检查。超过一个像素的比例差仍需重新制作，不能扩宽容差。收据中的initialExactRatioPassed保留初始严格1:3检查结果，nativeGeometrySupported说明现行原生几何合同，adopted才是是否采用；三个含义不能混淆。

## 唯一实际请求入口

[executed-requests.json](executed-requests.json)集中保存29次实际工具参数、参考顺序、版本和采用标记。它是重查实际提示词的首选入口。

- [requests.json](requests.json)保存初始计划；其中最后四章尚未执行时被强化约束替换，实际版本在[requests-final-four.json](requests-final-four.json)，不能把这四个未执行计划多算为调用。
- [revisions-round1.json](revisions-round1.json)、[revisions-round2.json](revisions-round2.json)和[画布复核请求](departures-canvas-revision.json)记录尺寸、连续地面和公交识别线索的修正。
- [车厢修正请求](woodland-interior-revision.json)和[组合页修正请求](composite-review-revisions.json)记录真实页面中发现的语义与遮挡问题。
- [generation-receipts.json](generation-receipts.json)保存全部29份原生输出、SHA、尺寸、原输出位置及采用／未采用理由。
- [reference-inputs.json](reference-inputs.json)保存15个不同参考输入的原路径、仓库位置与SHA；文件修改时间仅作为来源线索，不冒充生成时间。

最初环境请求统一引用已认可的手作小院与茶香会客馆两张v6原图。各修订只针对自己的明确问题，继续保持画风、人物空区和信息空区。已采用图优先复用；相同提示词不能承诺随机再生成逐像素一致。以后需要重生成时，使用对应实际请求和相同SHA、有序参考，只替换本机路径；新结果仍须逐课组合复核，不能批量覆盖已有采用文件。

## 真实组合中纠正的问题

| 问题 | 采用处理 |
| --- | --- |
| 家庭花园入口台阶靠近医生和家人的站位 | caring-v2移除上方站位台阶，保留家园身份和外围家具。 |
| 启程长廊、公交街和家庭故事被画成上下叠层 | 移除跨中心道路的楼板／屋顶边界，让同层铺地连续；不通过重新移动人物掩盖背景问题。 |
| 公交识别线索被地面修正削弱 | choices-v3在外侧保留青绿车身窗口和黄色扶手，不重新横断中心路面。 |
| 火车座椅看起来摆在室外站台 | woodland-v2把中段改成可辨认的车厢内景和木地板；原红座椅、母女与对面乘客不变。 |
| 家庭夜景的背景茶几接近父亲脚下 | everyday-v2移除该背景茶几，保留原人物层的家庭作业桌。 |
| 出发前居室的门廊边缘贴近中段Lesson | preparations-v3把入口缩回左边缘，释放成果和课号下方的平地。 |

对应失败截图与最终画面见实施记录。近景空间、鞋底、轮子、桌椅、信息区和场景语义必须一起看；仅有“没有矩形碰撞”不足以接受组合。

## 人物与支撑标定

[story-plan.json](story-plan.json)按48课保留人物、关键道具、故事时刻及原始依据；人物文件来自[既有全量包](../complete-journey-v1/README.md)，本轮字节未改。没有把不在场的人物添加到地图，也没有把尚未决定或仅是假设的事情画成已经发生。

[support-rois.json](support-rois.json)是逐个查看原人物图后选择的支撑区域；[contact-calibration.json](contact-calibration.json)保存306个源像素支撑点、原文件SHA和独立铺地范围。141–142复用此前6个已明确的成人鞋底与座椅底座，[来源快照](prior-support-reference.json)单独保留。悬空的孩子鞋、翘起的交叉腿和被遮住的支点不被编造成接地点。

[placement.json](placement.json)单独保存当前16章的真实W/H、原始段高、局部位置与遮罩参数。像素边界按右／下排他的外沿记录，历史人物锚点保持原约定；不为凑整数修改原图。真实星章距离按12–16 CSS px验收。

## 只读冻结校验

在本工作树根目录执行：

```powershell
node docs/designs/course-journey/production/modules-v7/verify-manifest.cjs
```

固定123个文件，包括29张原稿、21个已有WebP编码文件、48组原人物、2张v6参考原图、实际请求／收据、故事依据、参考哈希、接地与位置快照。脚本不接收参数，不更新基线，不调用生成服务；运行代码、README和截图不在美术冻结清单内。未采用版本保留用于追溯，不登记为当前网页背景。

本包完成不代表真机、弱网、完整教学业务或生产发布验收通过；实际测试范围见实施记录。未提交、未推送、未发布。
