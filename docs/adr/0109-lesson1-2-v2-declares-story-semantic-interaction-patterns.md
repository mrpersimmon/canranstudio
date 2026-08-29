---
status: accepted
date: 2026-08-24
scope: Lesson 1–2 V2
---

# Lesson 1–2 V2 声明故事语义互动模式

## Context

Lesson 1–2 V2 已经冻结十六个恢复微任务、二十九份正式结果、手机主场景构型与场景呈现段，但这些合同仍可能让页面把所有正式挑战实现成“点一张卡，系统自动移动”，再仅靠背景、美术或拖动手势宣称玩法不同。产品负责人在 `L49B-01` 选择：本单元使用五种真正不同的故事语义互动模式，同一模式最多连续承载两个正式挑战。

这项选择跨越 catalog、校验器、运行时快照、通用渲染器与验收测试。它不是单页布局偏好，也不应由页面根据 Microtask ID、文案或当前 DOM 猜测，因此需要稳定的深模块接口。

本决定补充 ADR-0106、ADR-0107 与 ADR-0108 的空间、触控和呈现段合同，不取代它们。

## Decision

- Lesson 1–2 V2 的每个正式 `challengeRef` 必须恰好声明一个 `interactionPattern`，稳定值只允许 `scene-identify`、`object-place`、`label-connect`、`utterance-select`、`relation-reconstruct`。
- `interactionPattern` 描述“孩子为了当前语言目的如何作用于世界、世界怎样回应”。它与证据通道、`presentation.sceneMode`、`presentation.moments[]`、输入设备和视觉皮肤正交；从点按换成拖动、换背景或让同一自动移动发生在另一张卡上，都不构成模式变化。
- Catalog 拥有模式与模式所需的语义来源／目标关系；校验器验证全部二十九项及冻结顺序。运行时只把当前声明式模式与语义关系暴露给页面，页面不得按课程 ID、Microtask ID、步骤前缀或课程文案推导。
- `scene-identify` 在真实场景中指认目标；`object-place` 让孩子把目标实体放到有故事意义的承接面；`label-connect` 建立英文标签与实体／线索的关系；`utterance-select` 按交际意图选择完整表达；`relation-reconstruct` 组织句块、指代或路线位置并形成完整关系。
- Lesson 1–2 的二十九项顺序与每项可见后果由完整蓝图冻结，跨微任务连续计算时同一模式最多出现两次。实现不能只满足字符串计数；相邻阶段的手部动作、语义关系与故事后果必须由人工走查确认确有差异。
- 模式不改变既有 `resultId`、答案身份、证据通道、Source ID 覆盖、冒险心、纠错、恢复微任务或地标条件。拖动可以作为直接操控方式，但必须提供等价点按操作，且不能增加一次无意义确认。

## Consequences

- 新增 `interactionPattern` 前必须先建立 catalog、校验、运行时快照与通用渲染器的失败合同，再按 TDD 接入；当前文档同步不构成实现证据。
- `L02-M11` 与 `L02-M16` 的 `object-place` 必须让孩子完成“选中实体并放到真实工作面”的动作；不能点卡后由系统自动归位。`L02-M20` 的 `relation-reconstruct` 必须让孩子把正确街景线索安放到路线起点／终点关系位；不能只听词点街景后自动成钉。
- ADR-0111 调整了 Lesson 1 的局部顺序：`L01-M09` 只保留 `utterance-select`，`L01-M11` 改为 `label-connect → utterance-select`。前者造成人物停下并回应，后者把英文归还牌连到已确认的真实手提包，两者不得再渲染成连续两次“找到 handbag”。
- 五值与连续上限只冻结 Lesson 1–2。后续教学单元可以复用这些模式，也可以按教材声明其他模式与上限；课程纲领只要求避免机械重复，不把本 ADR 自动提升为全课程固定小游戏模板。
- 本决定不授权修改运行时代码、合并 `main`、推送发布分支或发布网站。
