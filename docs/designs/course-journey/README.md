# 灿然课程首页 · 设计入口

2026-10-30：[课程与纪念册柔和过渡](../student-shell/2026-10-30-课程与纪念册柔和过渡.md)，新增J53–J56：共享页面框架、导航不动、240ms交叠、先定位再动画、慢网保留与返回恢复。本地完成，未发布。

2026-10-30：[登录导航与共享我的修复](../student-shell/2026-10-30-登录导航与共享我的修复.md)，补充J48–J52：中性身份等待、共用账号面板、移除重复范围下拉、目录单滚动区与尺寸统计状态。已完成本地影响范围检查，未提交／推送／发布。

首页交互增补：[2026-10-28 原生触摸修复与手机预览](2026-10-28-原生触摸回归与手机预览.md)，统一标准新增J45–J47；正常轻点、取消恢复、系统高亮和上线前真机验收分别检查。

合入发布分支的兼容要求见[合入准备记录](2026-10-26-旅程首页合入准备与发布分支兼容.md)：课程入口先可用，字体后台准备；登录冷却和原证书归档沿用最新发布分支。此说明不改写下方历史验证结果。

最新整体复查：[全部72入口手机优先复查与修复](2026-10-26-全72单元手机优先整体复查与修复.md)。局部修正六章背景、缩略图串课、首课中轴及选中初帧可读性；新增J42–J44。[实际提示词与修订素材](production/modules-v8/README.md)单独固定，技术、视觉、过程及真机范围分别报告。

**唯一现行规范：[首页入口统一设计标准与验收清单 v2.0](2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md)。**

适用于 `codex/fronted-opt-version` 的学生首页、共用导航、账号入口、地图、目录与搜索，以及纪念册入口的一致性。当前目录覆盖72个配对单元，地图共24段；全部1–144采用每章一张连续近景与局部原人物绑定，学生实际可见范围由授权决定。课程教学和成果口径继续遵循[统一教学标准 v1.55](../../butcher-version/publish/2026-10-24-2200-v1.55-教学单元设计标准与验收清单.md)。本地开发状态不代表发布。

v2.0汇总现行规则、修正所得的J01–J56标准、扩展流程和验收矩阵。后续修改先更新该规范；不要再从多个历史版本拼接当前要求。

最新实施：[Lesson49–144全量连续入口](2026-10-26-Lesson49-144全量连续入口实施记录.md)完成剩余48入口、16章，当前全部72入口采用连续近景。人物与关键道具保留原稿，章节地点各有身份；16张环境、29次实际请求和123文件只读冻结见[modules-v7](production/modules-v7/README.md)。本轮J41按真实原生尺寸对齐区段，补充车厢语义、家具／屋檐避让和完整Lesson换行。

此前[Lesson25–48连续入口](2026-10-26-Lesson25-48连续入口实施记录.md)及[modules-v6](production/modules-v6/README.md)保留四张采用环境、36文件固定凭据和J38–J40的原验收范围。

此前[Lesson13–24连续入口](2026-10-25-Lesson13-24连续入口实施记录.md)的探访长廊与阳光家园庭院保留，原两张环境和16文件固定凭据见[modules-v5](production/modules-v5/README.md)。

前一轮：[章节切换闪烁修复](2026-10-25-章节切换闪烁修复.md)，新增J37：前两章切换保留已解码画面，目标实际准备好后整体替换；共用远景保持，取消／授权变化不留失效内容，首次庆祝和搜索定位等待真实展示。普通／减少动态24场景、1440帧结果及异常样本单列，不能用终态截图证明没有闪烁。

前一轮：[页面边界间距与修复经验汇总](2026-10-25-页面边界间距与修复经验汇总.md)，新增J35–J36：手机标题上方16px，吸顶工具栏上下8px，滚动避让与底部实际占位分开；页尾不再露出纸色横带。612×913加入固定矩阵，并将历次修复归纳为[六类共同原则](2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md#shared-lessons)。

前一轮：[两段旅程主题差异化](2026-10-25-两段旅程主题差异化.md)，新增J34：保留1–6初见花园，7–12改为有门廊、街角和校园入口的邻里小镇；画风统一不等于复制构图。新第二段素材与实际提示词见[modules-v4](production/modules-v4/README.md)。

前一轮[星章课号贴近人物](2026-10-25-星章课号贴近人物.md)新增J33：1–12成果行距人物／道具可见底缘目标14px（12–16px），课号仍在成果行下8px；留白放在课号之后，不再随电脑画布扩大距离。该规则继续保留。

前一轮[人物与环境融合复核及修正](2026-10-24-人物与环境融合复核及修正.md)新增J32并撤回J31阶段的“融合完成”判断。当前采用每章目标1:3近景，按J41登记真实原生尺寸，原人物在1:1 artboard内与同源脚下补片共同轻回弹；不再叠独立平台和强拉伸桥。星章与Lesson保持普通流，距离以J33为准；手机自然滚动，宽屏明确为描边地图画布与外围远景。技术和视觉门槛分别记录，不能以尺寸通过代替融合观察。此前[单列大图与接地](2026-10-23-单列入口与地面锚点优化.md)作为历史保留，不能混用成果几何基准。

[接地记录](2026-10-23-人物接地校准记录.md)与[侧排审查](2026-10-23-中间地标串位审查与手机优先修复.md)保留历史证据与后来纠正关系；旧大图的通过结论不能代替新模块实测。

全量实施：[Lesson 31–144 全量入口与星章统一](2026-10-23-Lesson31-144全量入口与星章统一.md)；新57课素材和完整提示词见[complete-journey-v1](production/complete-journey-v1/README.md)。1–6原近景及共用远景保留[modules-v3](production/modules-v3/README.md)，7–12邻里小镇使用[modules-v4](production/modules-v4/README.md)，13–24使用[modules-v5](production/modules-v5/README.md)，25–48使用[modules-v6](production/modules-v6/README.md)，49–144原采用图保留[modules-v7](production/modules-v7/README.md)；六章最新局部修订使用[modules-v8](production/modules-v8/README.md)，实际选择以运行模型为准；[modules-v2](production/modules-v2/README.md)与[modules-v1](production/modules-v1/README.md)保留历史原稿和冻结凭据，不替换其余课程。

上一轮 [Lesson 19–30](2026-10-23-0200-Lesson19-30入口与星章归属统一.md)和 [daily-life-v1](production/daily-life-v1/README.md)保留原验证与素材凭据。

## 当前查阅顺序

| 要做什么 | 入口 |
| --- | --- |
| 查看最新49–144全量连续入口 | [实施记录](2026-10-26-Lesson49-144全量连续入口实施记录.md)、[16章环境与固定提示词](production/modules-v7/README.md)；60尺寸／2880组、新增J41。 |
| 查25–48入口扩展 | [前批记录](2026-10-26-Lesson25-48连续入口实施记录.md)、[四章素材](production/modules-v6/README.md)，保留J38–J40来源。 |
| 设计、实现或验收首页入口 | [统一规范 v2.0](2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md) |
| 查13–24本轮入口 | [实施与证据](2026-10-25-Lesson13-24连续入口实施记录.md)、[固定提示词与素材](production/modules-v5/README.md)、[扩展合同](2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md#expansion-13-24) |
| 查已修问题和防回归要求 | [J01–J47](2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md#regressions) |
| 查章节之间的主题差异 | [J34规则](2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md#chapter-identity)、[两段旅程主题差异化](2026-10-25-两段旅程主题差异化.md) |
| 查星章／课号与人物的实际距离 | [J33规则](2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md#reward-spacing)、[修改前后距离与本轮复验](2026-10-25-星章课号贴近人物.md) |
| 查1–12融合演进与当前共用机制 | [旧结论纠偏、单一近景实现与当轮证据](2026-10-24-人物与环境融合复核及修正.md)、[modules-v3实际美术与提示词](production/modules-v3/README.md)、[J32标准](2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md#fusion)、[PanoramaJourney](../../../course-journey/PanoramaJourney.jsx)、[样式](../../../course-journey/panorama.css) |
| 查1–12上一轮连续旅程尝试 | [历史实现与技术记录](2026-10-24-Lesson1-12连续旅程恢复.md)、[modules-v2实际美术与提示词](production/modules-v2/README.md)；其视觉完成结论已由J32撤回 |
| 查1–12独立模块试点 | [实现与证据](2026-10-23-Lesson1-12独立场景样板.md)、[模型](../../../course-journey/module-scenes.js)、[ModuleJourney](../../../course-journey/ModuleJourney.jsx)、[样式](../../../course-journey/modules.css)、[真实页面检查](../../../tests/login/journey-modules.spec.js) |
| 查实际截图、已执行检查与剩余限制 | [视觉和交互验收](../../../design-qa.md) |
| 查固定验证尺寸和 95% 目标 | [原63尺寸矩阵与覆盖目标](2026-10-22-1620-验证尺寸矩阵与覆盖目标.md)、[唯一机器清单](../../../tests/support/journey-viewports.json)。现行清单已增612×913，共64组合（地图60／紧凑目录4）；实际访问覆盖率待统计。 |
| 查设备／窗口尺寸采集 | [同站点聚合采集方案](2026-10-22-1620-网站访问尺寸采集方案.md)、[实施与验收记录](2026-10-22-1930-尺寸采集与第三段入口实施记录.md)，本地已实现，生产尚未启用。 |
| 查前三课的审视与问题关闭 | [入口审视](2026-10-22-1428-前三单元入口设计审视.md) → [修复与标准优化](2026-10-22-1505-首段入口修复与标准优化记录.md)；3–4 金章遮挡与信息归属已修复，验证边界单列。 |
| 查当前人物和信息位置 | 全部1–144见[连续近景模型](../../../course-journey/route-worlds.js)与[剩余16章配置](../../../course-journey/remaining-route-worlds.json)；原人物、各阶段生成记录与位置快照保持历史，当前原生区段和补片按J41计算。 |
| 查教学、五星、首次日期和历史成果保护 | [统一教学标准 v1.55](../../butcher-version/publish/2026-10-24-2200-v1.55-教学单元设计标准与验收清单.md) |

## 视觉与生成固定包

用户于 2026-10-20 认可第三套旅程地图的人物与环境。[原始手机认可图](references/approved-mobile-v1.png)仍是视觉依据，补充图不自动替代它。运行时课程范围与尺寸参数以 v2.0 为准；原生成包中的 45 单元等数字是历史示例。

| 包 | 内容 |
| --- | --- |
| [49–144全量连续环境](production/modules-v7/README.md) | 16张采用环境、29次实际请求、48组原人物、306个新增独立支撑点；123文件只读冻结，保存未采用稿和取舍理由。 |
| [原始视觉包](manifest.json) | [原次生成提示词](provenance/original-request.txt)、[追溯说明](provenance/README.md)、[固定风格](prompts/style-lock.txt)、[排除项](prompts/negative.txt)、[历史参数](tokens.json)、[生成记录](generated/README.md)。 |
| [首段人物与环境](production/story-nodes-v1/README.md) | 3–4／5–6 人物、手机／桌面环境，七份实际请求及原稿、修正稿。 |
| [星花金章](production/game-feedback-v1/README.md) | 金章真实透明素材、完整提示词、引用与成品校验。 |
| [第二段人物与环境](production/next-three-v1/README.md) | 7–8／9–10／11–12、横／竖环境，七份实际请求和固定输入。 |
| [第三段人物与环境](production/visits-v1/README.md) | 13–14／15–16／17–18、横／竖环境，九份实际请求，含人物透明边缘与中景铺地修订。 |
| [1–12独立模块环境](production/modules-v1/README.md) | 六块透明平台与一张装饰海水背景，10次实际调用、3个保留首稿；复用原人物。42文件[只读Manifest](production/modules-v1/verify-manifest.cjs)不冻结运行坐标。 |
| [1–12连续旅程环境](production/modules-v2/README.md) | 9个采用资产、9次实际生成：开敞庭院、连续花园底图和透明石桥；保持局部人地同步。24文件[只读Manifest](production/modules-v2/verify-manifest.cjs)保留图像与请求收据，不锁运行坐标；环境恢复与页面完成状态见[本轮记录](2026-10-24-Lesson1-12连续旅程恢复.md)。 |
| [1–12单一近景与远景](production/modules-v3/README.md) | 3次实际内置生成、3采用资产：两章724×2172连续近景与1536×1024远景；原人物复用，同源脚下补片不另画地面。11文件[只读Manifest](production/modules-v3/verify-manifest.cjs)固定6图像＋5实际请求／收据，技术与视觉状态分别见[J32记录](2026-10-24-人物与环境融合复核及修正.md)。 |

在仓库根目录运行以下命令校验；重建脚本只输出请求，不调用生成服务。

```powershell
node docs/designs/course-journey/build-prompt.cjs --verify
node docs/designs/course-journey/production/story-nodes-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/game-feedback-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/next-three-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/visits-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/daily-life-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/modules-v1/verify-manifest.cjs
node docs/designs/course-journey/production/modules-v2/verify-manifest.cjs
node docs/designs/course-journey/production/modules-v3/verify-manifest.cjs
node docs/designs/course-journey/production/modules-v4/verify-manifest.cjs
node docs/designs/course-journey/production/modules-v5/verify-manifest.cjs
node docs/designs/course-journey/production/modules-v6/verify-manifest.cjs
node docs/designs/course-journey/production/modules-v7/verify-manifest.cjs
```

完整提示词与字节级来源保留在固定包中，已有成品优先复用；固定输入不保证随机生成逐像素一致。新的站位修正另存版本快照，不覆盖历史生成凭据。

## 历史方案与实现证据

以下用于追溯，不是并列的现行标准；原检查次数按当时范围解读。

| 阶段 | 历史文档与重点 |
| --- | --- |
| v1.0 | [方案与生成规范](2026-10-20-0016-v1.0-旅程地图方案与生成规范.md)、[开发基础评估](2026-10-21-0030-v1.0-新版首页开发基础评估.md)。 |
| v1.1 | [首段地图与 72 单元目录](2026-10-21-0207-v1.1-旅程地图首页实现与验收.md)。 |
| v1.2 | [原问题汇总 J01–J13](2026-10-21-1908-v1.2-旅程首页与纪念册问题修复及设计约束.md)，编号和要求已迁入 v2.0。 |
| v1.3 | [前三课人物场景](2026-10-21-1943-v1.3-前三单元人物场景实现与提示词固化.md)。 |
| v1.4 | [图钉、选中与获星光效](2026-10-21-2141-v1.4-课程选中提示与获星光效.md)，持续地标呼吸光圈已被替代。 |
| v1.5 | [点击回弹与一次满星纪念](2026-10-22-0114-v1.5-地标点击与满星纪念反馈.md)。 |
| v1.6 | [金章星光与第二段地图](2026-10-22-0735-v1.6-金章星光与第二段旅程地图.md)。 |
| v1.7 | [9–12 信息分组](2026-10-22-0827-v1.7-九至十二课信息位置修正.md)。 |
| v1.8 | [9–12 人物比例、平台与内部滚动](2026-10-22-1033-v1.8-九至十二课人物比例与平台站位.md)。 |
