---
status: implemented-local-candidate
version: v1
date: 2026-08-31
unit_id: NCE-U04
lessons: [7, 8]
source_scope: PDF 47-50 / textbook 14-17
catalog_status: candidate-local-poc
audio_status: candidate-generated-awaiting-human-review
publication_allowed: false
---

# Lesson 7–8 教学单元启动包 V1

本文件冻结 `NCE-U04` 的教材事实、Source、Target、覆盖关系和实现边界。产品负责人授权按 Lesson 1–2 的完成度和 Lesson 3–4 的生产流程直接实现；本地候选完成不替代人工试听、浏览器验收或发布许可。

## 1. 受控来源与分层

| 项 | 冻结值 |
|---|---|
| 教材 | 外研社《新概念英语智慧版 1：英语初阶 First Things First》 |
| 版本 | 2022 年 7 月第 1 版第 1 次印刷，ISBN `978-7-5213-3670-2` |
| 教材快照 | SHA-256 `a54740bdce7423b98ea30334dca9043603ef5533f85e64f86f5af6d31d93be9f` |
| Lesson 7 | PDF p.47–48／教材 p.14–15 |
| Lesson 8 | PDF p.49–50／教材 p.16–17 |
| Source 真源 | `core/curriculum-catalog.js` 中 `LESSON7_CONTENT`、`LESSON8_CONTENT` |
| 课程设计真源 | catalog 中 `NCE_U04_TARGETS`、覆盖矩阵、证据计划与体验 |

## 2. 教材事实摘要

- Lesson 7 `Are you a teacher?`：Robert 与 Sophie 交换姓名、国籍和职业；教材包含 16 句对话、11 个词项、4 条 Notes，以及理解问题 `What is Robert's job?`。
- Lesson 8 `What's your job?`：以十种职业操练职业问答、`a/an` 和第三人称关系；包含 10 个替换提示、10 个职业词项和两项书面练习机制。
- 教材派生解释：本单元首次集中建立 `I / am`、`you / are`、第二人称问句与第一人称正负短答，并把姓名、国籍、职业串成一次完整初见交流。
- 边界：职业图片和语音必须可辨认，但问题、标题和初始高亮不得提前显示正确职业；十个职业全部接触，不等于十道连续词卡。

## 3. Source 登记

| Source 组 | 数量 | 内容与用途 | 证据边界 |
|---|---:|---|---|
| `L07-I01,Q01` | 2 | 教材指令与 Robert 职业总问题 | 完整对话后只答一次 |
| `L07-D01..D16` | 16 | 姓名、国籍、职业完整对话 | 不逐句设题 |
| `L07-W01..W11` | 11 | 姓名、国籍、职业问答支撑词 | 留在人物关系中 |
| `L07-N01..N04` | 4 | 缩写、国籍和职业 Notes | 不做术语背诵 |
| `L07-Z01..Z16` | 16 | 参考译文 | `context/optional`，不取证 |
| `L08-I01` | 1 | 看图、听音与跟读指令 | 不形成独立结果 |
| `L08-P01..P10` | 10 | 十种职业替换提示 | 完整接触、抽样取证 |
| `L08-W01..W10` | 10 | 十种职业词项 | 与清楚人物图绑定 |
| `L08-E01,E02` | 2 | `am/is` 与 `his/her` 书写机制 | 可选、非阻塞 |

## 4. 六个 Target

| Target | 层级 | 可观察能力 | 主要结构 |
|---|---|---|---|
| `NCE-U04-T01` | 核心 | 听懂 Robert 与 Sophie 的完整对话并回答教材总问题 | — |
| `NCE-U04-T02` | 核心 | 用 `I am ... / My name is ...` 介绍自己 | `GS-I-AM`、`GS-MY-NAME-IS` |
| `NCE-U04-T03` | 核心 | 询问和回答国籍，区分肯定与否定短答 | `GS-BE-QUESTION-YOU`、`GS-BE-SHORT-ANSWER-I` |
| `NCE-U04-T04` | 核心 | 用 `What's your job?` 询问，并用 `I'm a/an ...` 回答 | `GS-WHATS-YOUR-JOB`、`GS-I-AM-A-JOB` |
| `NCE-U04-T05` | 核心 | 按人物关系使用 `he / she / his / her` | `GS-SUBJECT-PRONOUN-SG`、`GS-POSSESSIVE-DETERMINER` |
| `NCE-U04-T06` | 词汇抽样 | 将十种职业词连接到清楚人物图像 | — |

## 5. 覆盖与首课证据原则

1. D01–D16 完整覆盖 T01，姓名、国籍、职业三个话轮组分别支撑 T02–T04。
2. P01–P10 与 W01–W10 全部接触，但只抽三项听辨和四项关系迁移形成当天证据。
3. T03 必须同时观察一次肯定和一次否定；不能用单一 `Yes` 冒充掌握。
4. T04 必须留在职业问答或人物场景中；不得变成脱离人物的十连词卡。
5. `L08-E01,E02` 只作为纸笔或平板手写拓展，不阻断网站完成。

## 6. 音频与发布门禁

- 候选包：`nce-u04-kokoro-candidate-v1`，共 47 个 MP3。
- 继承 Lesson 1–2 声色：Robert 使用 `am_michael`，Sophie 与独立词音使用 `af_heart`；自然话轮速度 `0.9`，词音速度 `1.0`。
- 技术门槛：`-18 LUFS`，起音不超过 150 ms；当前最大实测起音 70 ms。
- 状态为 `local-poc-candidate-unreviewed`，不等于官方或已验收音频。
- 人工试听必须核对 47 文件的文字一致性、角色、重音、`a/an` 连读、职业清晰度和音量，再单独决定发布。

## 7. 实现与发布边界

本单元登记为 `candidate / local-poc / story-stage-v1`，修订号 `lesson7-8-v1`。页面仅从 catalog 取题面、选项、答案、角色和音频；当前不进入首页、不提交、不推送、不发布。
