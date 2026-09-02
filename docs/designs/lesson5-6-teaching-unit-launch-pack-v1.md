---
status: implemented-local-candidate
version: v1
date: 2026-08-31
unit_id: NCE-U03
lessons: [5, 6]
source_scope: PDF 43-46 / textbook 10-13
catalog_status: candidate-local-poc
audio_status: candidate-generated-awaiting-human-review
publication_allowed: false
---

# Lesson 5–6 教学单元启动包 V1

本文件冻结 `NCE-U03` 的教材事实、Source、Target、覆盖关系和实现边界。产品负责人授权在完成 Lesson 3–4 后按同一生产流程直接完成 Lesson 5–6；该授权允许形成本地候选网站，不等于音频验收、发布验收或上线许可。

## 1. 受控来源与分层

| 项 | 冻结值 |
|---|---|
| 教材 | 外研社《新概念英语智慧版 1：英语初阶 First Things First》 |
| 版本 | 2022 年 7 月第 1 版第 1 次印刷，ISBN `978-7-5213-3670-2` |
| 教材快照 | SHA-256 `a54740bdce7423b98ea30334dca9043603ef5533f85e64f86f5af6d31d93be9f` |
| Lesson 5 | PDF p.43–44／教材 p.10–11 |
| Lesson 6 | PDF p.45–46／教材 p.12–13 |
| Source 真源 | `core/curriculum-catalog.js` 中 `LESSON5_CONTENT`、`LESSON6_CONTENT` |
| 课程设计真源 | catalog 中 `NCE_U03_TARGETS`、覆盖矩阵、证据计划与体验 |

教材文字、课程设计、候选音频、生成美术、页面实现和发布状态始终分开。参考译文只按需提供，不能充当英语理解证据；书写练习保留来源，但为非阻塞拓展。

## 2. 教材事实摘要

- Lesson 5 `Nice to meet you.`：布莱克先生向 Sophie 依次介绍 Hans、Naoko、Chang-woo、Luming、Xiaohui；教材包含 20 句对话、14 个词项、3 条 Notes，以及理解问题 `Is Chang-woo Chinese?`。
- Lesson 6 `What make is it?`：以六辆汽车操练 `What make is it?`、国家属性以及 `He / She / It` 的选择；包含 6 个替换提示、10 个词项和两项书面练习机制。
- 教材派生解释：本单元把 U02 的 `is / isn't` 从物品归属迁移到人物、国籍、汽车品牌与国家属性，并首次集中建立人物／物品的主语代词区别。
- 边界：理解问题不得在标题、指令或初始选项状态中泄露；品牌和国籍是结构载体，不自动拆成独立章节或连续词卡。

## 3. Source 登记

| Source 组 | 数量 | 内容与用途 | 证据边界 |
|---|---:|---|---|
| `L05-I01,Q01` | 2 | 教材指令与总理解问题 | 只形成一次整段理解机会 |
| `L05-D01..D20` | 20 | 原顺序完整迎新对话 | 不拆成 20 道题 |
| `L05-W01..W14` | 14 | 初见、国籍、人物相关词项 | 随人物与完整句接触 |
| `L05-N01..N03` | 3 | 初见问候与称谓 Notes | 不转成术语考试 |
| `L05-Z01..Z20` | 20 | 参考译文 | `context/optional`，不取证 |
| `L06-I01` | 1 | 看图、听音与跟读指令 | 不形成独立结果 |
| `L06-P01..P06` | 6 | 六辆车的替换提示 | 完整接触，抽样取证 |
| `L06-W01..W10` | 10 | 品牌、国家与形容词词项 | 随车辆和完整句接触 |
| `L06-E01,E02` | 2 | 代词与国籍对照书写机制 | 可选、非阻塞 |

## 4. 六个 Target

| Target | 层级 | 可观察能力 | 主要结构 |
|---|---|---|---|
| `NCE-U03-T01` | 核心 | 听懂迎新顺序、人物与国籍，并回答教材总问题 | — |
| `NCE-U03-T02` | 核心 | 用 `This is ...` 引见他人，并用 `Nice to meet you.` 完成初见 | `GS-THIS-IS-INTRODUCTION` |
| `NCE-U03-T03` | 核心 | 按人物或物品选择 `He / She / It`，并保持 `be` 一致 | `GS-SUBJECT-PRONOUN-SG`、`GS-BE-AFFIRMATIVE-SG` |
| `NCE-U03-T04` | 核心 | 连接人物、国籍、汽车牌子与国家属性 | `GS-BE-AFFIRMATIVE-SG` |
| `NCE-U03-T05` | 核心 | 把肯定陈述迁移到人物与汽车，区分人称和物称 | `GS-SUBJECT-PRONOUN-SG` |
| `NCE-U03-T06` | 词汇抽样 | 将迎新词、国籍词和汽车牌子连接到人物或图像 | — |

## 5. 覆盖与首课证据原则

1. D01–D20 对 T01 提供完整输入；其中引见、国籍与问候话轮支持 T02–T04。
2. P01–P06 承担 T03–T05 的汽车迁移；不得把 6 辆车扩成 6 个页面。
3. 所有必需 Source 都必须接触，但首课只抽人物与汽车各三个代表关系形成证据。
4. T01 仅有一次整段理解结果；角色回演是接触和调用，不伪造长期掌握。
5. `L06-E01,E02` 不进入网站完成门槛。

## 6. 音频与发布门禁

- 候选包：`nce-u03-kokoro-candidate-v1`，共 50 个 MP3。
- 继承 Lesson 1–2 的声色：男性角色 `am_michael`，女性角色及独立词音 `af_heart`；自然话轮速度 `0.9`，词音速度 `1.0`。
- 技术门槛：`-18 LUFS`，解码后起音不超过 150 ms；当前最大实测起音 70 ms。
- 专名和品牌仅在生成层使用音素覆盖；catalog 教材文字不改写。
- 状态为 `local-poc-candidate-unreviewed`。逐文件语言、人名、品牌、重音、角色和音量人工试听完成前，禁止把它称为通过或官方教材音频。

## 7. 实现与发布边界

本单元已经登记为 `candidate / local-poc / story-stage-v1`，修订号 `lesson5-6-v1`。页面只渲染和转发 catalog 行为，不保存答案副本。当前实现不自动进入课程首页、不提交、不推送、不发布；后续每一步仍需独立授权和读回证据。
