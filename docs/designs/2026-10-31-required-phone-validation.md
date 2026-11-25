# 固定手机验证：Chrome iPhone SE 与 Pro Max

用户要求：今后每次界面验证都包含 Chrome 设备模式提供的 iPhone SE 与 iPhone Pro Max 尺寸。范围是当次受影响的真实页面和操作，不扩大为每次全站回归。

## 必测预设

按2026-10-31核对的[Chrome DevTools官方设备定义](https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/models/emulation/EmulatedDevices.ts)固化，单位为CSS px：

| Chrome设备名称 | 竖屏宽×高 | DPR |
| --- | --- | --- |
| iPhone SE | 375×667 | 2 |
| iPhone 14 Pro Max（15 Pro Max同尺寸） | 430×932 | 3 |
| iPhone 16 Pro Max | 440×956 | 3 |

Pro Max未指定代际，因此同时保留两个尺寸。原320×568继续作为小屏压力检查，不能标记为Chrome的iPhone SE；本地测试库同名SE预设是320×568，Pro Max默认viewport也可能扣除了浏览器栏，不直接按设备名称套用。

唯一设备清单：[required-phone-devices.json](../../tests/support/required-phone-devices.json)；自动测试复用[helper](../../tests/support/required-phone-devices.js)，显式设置布局宽高、screen、DPR、移动模式、触摸与UA。硬件刘海、安全区、实体状态栏、地址栏、软键盘和iOS内核不由这些设置证明。

## 执行规则

1. 每次修改学生界面，先列出受影响页面及状态，在三个必测预设分别做真实操作和目视检查。首页检查人物／星章归属及目录；纪念册检查主卡／缩略图、搜索与保存弹层；课程检查题干、选项、反馈、上下题和讲解／结算。
2. 检查文字、人物与按钮完整性，水平溢出、滚动、弹层居中和关键操作可达性；不以“截图能生成”代替验收。手机端失败优先处理，不能用大屏通过覆盖SE失败。
3. 现有断点、320×568、横屏和平板／电脑专项继续按影响范围保留；只读文档或不影响界面的变更不强制跑手机浏览器。
4. 报告写明设备全名、CSS尺寸、实际交互与结果。Chromium模拟、WebKit模拟和实体手机分别报告，未测的微信／夸克／键盘保持待验；不把固定样本数量折算为95%真实流量覆盖。
5. 以后Chrome新增或更名设备时核对官方定义再更新版本，保留旧问题尺寸，不静默改变已固定设备的含义。

## 已接入的验证

- 根目录[AGENTS.md](../../AGENTS.md)规定每次受影响界面必测这三项，后续会话继续遵守。
- [首页矩阵](../../tests/support/journey-viewports.json)版本2026-10-31.1：完整组合仍64个，地图60个、紧凑目录4个；日常档从13扩为15项，增加375×667和430×932，原440×956已存在；触摸交互档同样保留三项。
- `practice-screen.spec.js`的Lesson1–6全题布局循环读取三项并保留320×568，题区入口继续补平板／电脑。
- 新`required-phone-devices.spec.js`为每项创建独立移动上下文，实际断言宽高、DPR、触摸，使用隔离学生完成语法题，再检查情境、回看只读、草稿不变、讲解弹层和操作位置。当前该专项覆盖Lesson1–2，不代替未来其他受影响页面的检查。
- 新`browser-required-phones`检查任务、设备定义与日常档防遗漏检查已接入；其他页面后续相关用例也必须复用统一预设。

## 本轮实际验证

Chromium四项通过：Lesson1–2全部37题在三个必测尺寸及320×568的答前／答后布局，加各题区390×844、768×1024、1366×768入口，共311个布局观测；另三个独立设备上下文分别验证前9道语法题、情境、回看、讲解、反馈不跳动和记录保持。实测`innerWidth/innerHeight`、DPR和触摸能力与清单一致。设备清单与工作流21项检查通过，文档链接检查通过。

截图已目视复核：SE题干、配对、按钮完整；两档Pro Max保留居中卡面与固定操作区，讲解在视口内居中。原始报告位于`output/test-required-phone-devices-20261031/`，截图归档于[设备证据](learning-flow/evidence/2026-10-31-required-phones/)；[SE题面](learning-flow/evidence/2026-10-31-required-phones/chrome-iphone-se-question.png)、[14 Pro Max题面](learning-flow/evidence/2026-10-31-required-phones/chrome-iphone-14-pro-max-question.png)、[16 Pro Max讲解](learning-flow/evidence/2026-10-31-required-phones/chrome-iphone-16-pro-max-explanation.png)。

本轮未重新执行纪念册、首页、Lesson3–6全部题目、WebKit或实体设备；这些页面的后续相关验证已经纳入同一规则，不能写成本次已验。未跑全量CI。未修改产品运行时代码、题目或用户数据；未提交、推送或发布。
