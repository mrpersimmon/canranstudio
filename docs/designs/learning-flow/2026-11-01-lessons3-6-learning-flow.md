# Lesson3–6 共用学习界面接入与验收

2026-11-01 · `codex/book-version` · 本地开发，未提交、推送或发布。

现行规则只维护在[教学单元统一设计标准](../../butcher-version/publish/2026-10-24-2200-v1.55-教学单元设计标准与验收清单.md)第3、5节；本文记录此次实施和证据。此前已修的闪烁、纸面跳位、姓名错行、灯泡位置、结算题数和恢复态边界已汇入该标准，不另立一套规则。

## 实施范围

- Lesson3–4、5–6接入与1–2相同的48＋44px导航、五阶段链接、稳定纸面与操作栏、上一题只读回看、原题订正、按关卡分组的学习记录、独立参考面板和按题数结算。
- 共用呈现由`core/learning-flow.js/css`维护。Lesson1–2仅保留街角人物／归还手提包特化，3–4保留衣帽间及雨伞／寄存牌／外套交接，5–6保留教室、七位原角色和绘本词图；未重生成素材。
- 词卡每组六词，分页常驻；展开对照英文、音标、释义和原例句。5–6班级合影与两组表达参考移入更多中的独立面板，合影不是新的教学关卡。
- 读完末句用“去练习”直接进入理解题。结束后计数和状态合成一行，按钮齐平，目的地在按钮外；综合挑战终点仍为“查看纪念卡”。
- F06只显示“答错了，再试试。”；有原讲解的题使用中间灯泡，无原讲解的题不新编解释。结算为连对次数、首答正确题数、订正完成题数；实际提交与帮助记录继续保留。

## 数据边界

3–4仍为33题／12句课文，5–6仍为36题／20句课文。三课`content.js`的Git对象与本轮前及HEAD一致：

| 文件 | Git对象 |
| --- | --- |
| `unit1-2/content.js` | `8990442d0779bec92f41b002d5ed6e0ca5edb7f8` |
| `unit3-4/content.js` | `b26c60e64b115099f9d5d37f83018accbc4e65bb` |
| `unit5-6/content.js` | `1ce92fe91298226f0e01c9c1d0aa3e810fc3fdec` |

未改题目ID、答案、活动版本、签名、学习存储键、奖励资格、首次日期或历史证书。新显示文案通过呈现配置传入；正常重练不倒退已学，旧五星不补造新版完成。原演示数据库与card-key继续使用，未重置账号或学习数据。

## 首错与根因

1. 新专项在原代码先复现两课缺少共用导航；见`output/test-learning-expansion-before`。
2. 3–4对白继承旧grid的`align-self:start`，绝对定位后仍按内容撑到约1500px，最后一句不在场景内。显式清除grid对齐／区域约束后，末句和中文展开均可见；首错与几何在`test-learning-expansion-first`、`test-learning-expansion-story-diagnostic`。
3. 长词块／多处填空的原留白预算不适合新导航：3–4第7道语法题曾溢出6／23px；5–6长题最大溢出34px。收紧装饰间距，长句选项仅在确实节省空间时等宽排布；320×568的长示范保留可聚焦局部滚动，不删材料、不缩小44px触控目标。首错在`test-learning-expansion-all-questions`，第一次收紧后的7／10px残余在`test-learning-expansion-fit`，最终全题严格断言通过，未放宽阈值。
4. 真实已有记录预览暴露启动顺序问题：完成课文会提前恢复练习，此时词卡DOM尚未生成，共用呈现访问空节点导致L06。现在等待本课正常挂载后再承载。最初只切hash的测试未复现；加整页reload后两课都红，修复后再验全部必测手机。证据保留在`test-learning-expansion-restored-words-before`、`test-learning-expansion-restored-reload-before`和`test-learning-expansion-restored-final`，不把前者误写成成功拦截。
5. 一个新增桌面测试误写了下一站名称和合影人数，已按实际“故事小侦探／七位角色”修正测试；未修改产品内容来迎合错误断言。首错在`test-learning-expansion-final`，独立复验在`test-learning-expansion-guard-final`。

## 实际验证

必测尺寸：Chrome iPhone SE375×667、iPhone14/15 Pro Max430×932、iPhone16 Pro Max440×956；另保留320×568压力、390×844、768×1024、1366×768、1435×1244及667×375短横屏相关场景。预设来自仓库唯一清单。

- Chromium：按去重文件／用例共29项。三课106题、893个答前／答后布局观测全部通过；3–4和5–6共69题的582个观测另补顶层加载遮罩监测，未出现课中重新遮罩。测试覆盖完整阅读／译文、词库、回看、订正、统计、重练、资料、保存记录及已完成阅读后整页恢复。共享层抽取后，1–2的37题、原剧情、奖励与减少动态也实际回归。
- 最后恢复态修正后，Chromium重新运行六个必测手机扩展流程及两个1–2相关流程，共8项通过；此前未改路径复用本轮结果，不重复累加用例数。
- WebKit：对应扩展、两课69题全布局、词卡与1–2相关流程共15项通过；随后最终恢复态修正独立复验六个必测手机流程，6项通过。两课全题监测均未出现课中加载遮罩，最后的挂载等待只影响启动恢复，未改变此前通过的题目排版。
- Node设备／检查流程27项通过；72个受保护单元构建通过。新增`browser-learning-expansion`及WebKit任务，共用层与两课文件改动纳入影响映射。
- `check:plan`已运行；工作树还包含前轮未提交改动，完整计划覆盖275个路径，本轮只运行上述影响性检查，没有执行全量`check:commit`或全量CI。

本轮没有重跑完整旧证迁移、全部GIF导出和全72课；未做实体手机、微信／夸克、软键盘或安全区验收。题稿／数据协议未改变不等于上述链路已重新验收。

## 实页与预览

最终本地服务使用原演示库，地址为[Lesson3–4](http://127.0.0.1:4202/unit3-4/#learn/words)、[Lesson5–6](http://127.0.0.1:4202/unit5-6/#learn/introduce)。原生应用内浏览器对原账号重新打开／刷新两课，均正常加载；未操作真实作答、未清学习记录。

| 画面 | 证据 |
| --- | --- |
| SE原账号真实预览 | [3–4课文](evidence/lessons3-6/unit34-preview-se.jpg)、[5–6题目](evidence/lessons3-6/unit56-preview-se.jpg) |
| SE完整课文末句及译文 | [3–4](evidence/lessons3-6/unit34-story-se.png)、[5–6](evidence/lessons3-6/unit56-story-se.png) |
| 首题订正后的真实题数结算 | [3–4](evidence/lessons3-6/unit34-result-se.png)、[5–6](evidence/lessons3-6/unit56-result-se.png) |
| 桌面课文／独立合影 | [3–4桌面](evidence/lessons3-6/unit34-story-desktop.png)、[5–6桌面](evidence/lessons3-6/unit56-story-desktop.png)、[合影面板](evidence/lessons3-6/unit56-class-photo.png) |
