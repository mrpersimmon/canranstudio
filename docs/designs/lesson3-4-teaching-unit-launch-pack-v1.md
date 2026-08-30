---
status: accepted
version: v1
date: 2026-08-30
accepted_on: 2026-08-30
accepted_by: product-owner
catalog_registered_on: 2026-08-30
catalog_status: curriculum-accepted
accepted_decisions:
  PA-01: A
  PA-02: A
  PA-03: A
  PA-04: A
unit_id: NCE-U02
lessons:
  - 3
  - 4
source_scope: PDF 39-42 / textbook 6-9
---

# Lesson 3–4 教学单元启动包 V1

> 本文件是 ADR-0115 所要求的 Lesson 3–4 首个产品验收点。产品负责人已于 2026-08-30 接受受控教材来源、教材事实、Source ID、Target、覆盖关系和教学边界；本文不设计故事、人物、美术、页面、交互、运行时或发布方案。

本文件中的 `NCE-U02`、`L03-*`、`L04-*` 和 `NCE-U02-T*` 已获产品接受，并于 2026-08-30 以 `curriculum-accepted / catalog-only / not-authored` 状态登记进 catalog。catalog 明确记录教材 Source、七个 Target、分级和 Source → Target 覆盖，同时主动禁止剧情、角色、页面、运行时与音频映射混入该状态。完成登记仍不等于已经设计或实施课程，也不授权提交、合并或发布。

## 1. 首个验收点的边界

本轮产品已验收以下五类内容：

1. 受控教材版本、页码和证据优先级；
2. Lesson 3–4 的教材事实及与 Lesson 1–2 的语法承接关系；
3. `L03-*`、`L04-*` Source ID 的切分与复用规则；
4. 七个 Target 及 Source → Target 覆盖是否完整、不过度；
5. 首课抽样、书写可选和音频待审计等课程边界。

本轮明确不验收任何故事、美术、页面实现或任务数量。任何“角色叫什么、在哪里冒险、画什么、怎么点、怎么拖、分几阶段”的回答都属于下一验收点，不能反向改写教材事实层。

## 2. 受控来源清单

### 2.1 权威来源与版本

| Source register ID | 文件／版本 | 页码与用途 | 权威级别 | 快照校验 |
|---|---|---|---|---|
| `BOOK1-2022-07` | 当前本地 locator：`/Users/permission/Downloads/外研社新概念英语智慧版1.pdf`；稳定身份：外研社《新概念英语智慧版 1：英语初阶 First Things First》、2022 年 7 月第 1 版第 1 次印刷、ISBN `978-7-5213-3670-2` 与右侧文件哈希 | 全书 330 个 PDF 页；Lesson 3 为 PDF 39–40／教材 6–7，Lesson 4 为 PDF 41–42／教材 8–9 | 当前受控教材事实基准；本机路径不是跨环境身份，也不取代 catalog 的产品课程内容所有权 | SHA-256 `a54740bdce7423b98ea30334dca9043603ef5533f85e64f86f5af6d31d93be9f` |

正文有效范围采用固定映射：`PDF 页 = 教材页 + 33`。本轮使用的逐页文字提取、页面渲染和审计草稿都是临时核对工具，不进入长期 Source register；文字提取与页面视觉冲突时，以校验值对应的主 PDF 原页为准。

本启动包依赖同轮形成、已由 `PA-02-A` 接受为课程审计索引的 [`《新概念英语智慧版 1》语法主干 V1`](./new-concept-english-book1-grammar-spine-v1.md)。该文件是课程解释与编排材料，不是第二份教材事实基准，也不把远期风险行变成已接受 Target。

### 2.2 版权与使用边界

教材文字和图片属于受版权保护内容。本启动包只记录必要的页码、结构、短语锚点和教学事实，不大段复刻课文或教材图片。后续产品内容须继续区分教材 Source 与原创 Content，并另行确认音频、图片和其他数字资源的使用授权。

## 3. 教材事实摘要

### 3.1 Lesson 3｜情境课

- 教材标题为 `Sorry, sir.`，活动类型为听后回答整段理解问题。
- 场景是衣帽存放处：取物、交票、报号、拿错、否认、道歉、重新核对、找回并感谢。
- 教材用 7 幅编号插图呈现 12 个按标点切分的句子；页面没有印人物姓名或 speaker label。任何“顾客／工作人员”归属都是根据图像和语义形成的派生解释，不是逐字教材事实。
- 理解问题询问男士最后是否取回雨伞；“取回了”是由结尾推得的情节答案，不是页面另印的答案句。
- 生词和短语共 10 项：`umbrella, please, here, my, ticket, number, five, sorry, sir, cloakroom`。
- Notes 共 4 项：`Here's` 与 `Here is`、`Sorry` 与 `I'm sorry`、`sir` 的称谓用途、`it` 对前文物品的回指。

### 3.2 Lesson 4｜操练课

- 教材标题为 `Is this your ...?`，活动类型为看图、听音和跟读；没有独立理解问题，也没有 Notes。
- 页面有 15 个同结构替换提示。前 10 个复现 Lesson 2 的词：`pen, pencil, book, watch, coat, dress, skirt, shirt, car, house`；后 5 个是本课新增词：`suit, school, teacher, son, daughter`。
- 书面练习 A 抄写 Lesson 3 中的否定归属、道歉、归属问句和否定短答；练习 B 把前述 10 个复现词迁移到“不是我的／是你的”对照回答中。
- **教材派生解释（I，高置信度）**：基于同结构的 15 个替换提示与两组书面练习，Lesson 4 承担把 Lesson 3 归属问答迁移到更多名词与人物关系的操练作用，而不是另起一个情境故事；证据锚点为 PDF p.41–42。该判断不是教材原页明示的课程目标。

## 4. 已接受课程设计：本单元语法主干切片

本节引用教材事实，但其“首次／扩展／整合／巩固”位置和 Target 关系属于**已接受的课程设计层**，不是教材原页明示事实。`structureId` 与语法主干地图 V1 的详细视图一致；任何改名都必须同时更新地图和本启动包，不能以自然语言近义词另建一套身份。

| 课程位置 | structureId | 本单元承担的结构／功能 | 与 U01／后续关系 | Target |
|---|---|---|---|---|
| 首次建立 | `GS-BE-NEGATIVE-SG`、`GS-HERE-PRESENTATION`、`GS-REQUEST-HANDOVER` | `This is not ...`、`isn't`、`Here is/Here's ...`，以及完整请求—递交—交还功能链 | 在“拿错物品”的语义需要中首次集中建立否定与递交；位置已由 `PA-02-A` 接受 | T03、T04 |
| 实质扩展 | `GS-POSSESSIVE-DETERMINER`、`GS-BE-SHORT-ANSWER-SG`、`GS-PRONOUN-IT-REFERENCE`、`GS-POLITE-REPAIR` | `your` 扩到 `my/your`，肯定短答扩到否定短答，`it` 扩到篇章回指，礼貌链扩到道歉和称谓 | 承接 U01 已出现的结构，从单句问答扩到连贯纠错与修复 | T02、T03、T05、T06 |
| 对比整合 | `GS-POSSESSIVE-DETERMINER`、`GS-BE-SHORT-ANSWER-SG`、`GS-BE-NEGATIVE-SG` | `my/your`；肯定／否定短答；正确／错误归属 | 承接 U01 的 `your` 和肯定短答，形成正负对照 | T02、T03 |
| 变化巩固 | `GS-OWNERSHIP-QUESTION-SG` | 归属问句跨 15 个名词／人物关系继续使用 | 前 10 项复现 U01 词汇，后 5 项引入新词 | T02、T07 |
| 不进入本单元结构注册表 | — | 理解问题中的 `does` | 只承担整段理解语境；不能据题干声称本单元教授一般现在时助动词 | T01（理解） |

## 5. 已接受 Source ID

### 5.1 切分与角色规则

- 沿用 `Lxx-I/Q/D/W/N/Z/E`：instruction、question、dialogue、vocabulary、note、reference translation、exercise mechanism。
- Lesson 4 新增 `P`（practice prompt），用于区分“本页一个真实替换提示”和“一个新的词汇来源”。
- Lesson 3 的 12 个句子各有一个 `D`，同时保留教材 7 幅图对应的 `figureGroup`。后续可增加 `turnGroup`，但不得把推断角色或推断话轮冒充教材印刷事实。
- 参考译文使用独立 `Z`，默认 `context/optional`，不能形成英语能力证据。
- 书面练习用 `E` 记录机制并引用既有来源，不为被抄写或转换的同一句话再建重复 Source ID。

### 5.2 Lesson 3

#### 指令与理解问题

| Source ID | kind | 内容摘要 | policy | Target |
|---|---|---|---|---|
| `L03-I01` | textbook-instruction | 听后回答问题的教材指令 | `context/exposure` | T01 |
| `L03-Q01` | textbook-question | 是否最终取回雨伞 | `context/exposure` | T01；不覆盖 `does` 产出 |

#### 12 个原子对话来源

| figureGroup | Source ID | 功能与关键锚点 | policy | Target |
|---:|---|---|---|---|
| 1 | `L03-D01` | 提出取回大衣和雨伞的请求；`please` | `target/evidence` | T04 |
| 2 | `L03-D02` | 递交寄存票；`Here is ...` | `target/evidence` | T04 |
| 3 | `L03-D03..D04` | 礼貌回应与 5 号信息 | `support/exposure` | T01、T06、T07 |
| 4 | `L03-D05` | 递交雨伞和大衣；`Here's ...` | `target/exposure` | T01、T04 |
| 5 | `L03-D06..D07` | 指出“不是我的”并道歉 | `target/evidence` | T01、T03、T06 |
| 6 | `L03-D08..D09` | 再问归属并作否定短答 | `target/evidence` | T02、T03 |
| 7 | `L03-D10..D12` | 用 `it` 再问、肯定短答并感谢 | `target/evidence` | T01、T02、T05、T06 |

`D01..D12` 的顺序由教材标点和插图冻结；speaker、音频段和 `turnGroup` 尚未冻结。特别是连续句的说话人不能从旧草案直接写入 catalog，必须在音频审计后与页面共同判定。

#### 词汇、Notes 与参考译文

| Source ID | kind | 有序内容 | policy | Target |
|---|---|---|---|---|
| `L03-W01..W10` | vocabulary | `umbrella, please, here, my, ticket, number, five, sorry, sir, cloakroom` | `support/exposure`；`cloakroom` 可为 `context/exposure` | T01、T03、T04、T06、T07，按单项锚定 |
| `L03-N01..N04` | textbook-note | `Here's = Here is`；`Sorry = I'm sorry`；`sir` 称谓；`it` 回指 | `support/exposure` | T04、T06、T05 |
| `L03-Z01..Z12` | reference-translation | 与 `L03-D01..D12` 一一对应的参考译文 | `context/optional` | 无英语能力证据 |

结构词 `please, here, my, sorry, sir` 必须在完整表达或关系中处理，不得改造成实体图片词义题。

### 5.3 Lesson 4

| Source ID | kind | 有序内容／复用关系 | policy | Target |
|---|---|---|---|---|
| `L04-I01` | textbook-instruction | 看图、听音、跟读 | `context/exposure` | — |
| `L04-P01..P10` | substitution-prompt | 依次使用 `pen, pencil, book, watch, coat, dress, skirt, shirt, car, house`；词汇来源分别复用 `L02-W01..W10` | `support/exposure`，仅被选中的代表项可提升为 `target/evidence` | T02、T03、T07 |
| `L04-P11..P15` | substitution-prompt | 依次使用 `suit, school, teacher, son, daughter`；词汇来源分别为 `L04-W01..W05` | `support/exposure`，仅被选中的代表项可提升为 `target/evidence` | T02、T03、T07 |
| `L04-W01..W05` | vocabulary | `suit, school, teacher, son, daughter` | `support/exposure` | T07 |
| `L04-E01` | exercise-mechanism | 抄写机制；复用 `L03-D06..D09` | `context/optional` | T02、T03、T06 的可选书写拓展 |
| `L04-E02` | exercise-mechanism | 回答转换机制；提示来自 `L04-P01..P10` | `context/optional` | T02、T03 的可选书写拓展 |

前 10 个词的出现是新的操练 Source，不是新的词汇 Source；因此保留 `L04-P01..P10`，但不得重复创建 `L04-W`。15 个提示全部需要真实接触，不等于必须生成 15 道正式题，更不等于复制成 30 个双通道结果。

## 6. 七个已接受 Target

| Target ID | 层级 | 可观察能力 | structureRefs | 主要 Source 锚点 | evidence mode | 首课边界 |
|---|---|---|---|---|---|---|
| `NCE-U02-T01` | 核心 | 听懂衣帽间取物从请求、交票、报号、拿错到找回的因果与顺序，并判断最终结果 | — | `L03-Q01,D01..D12,W05..W07,W10` | `dialogue-sequence-comprehension` | 一次整段理解证据，不把 12 句拆成 12 道题 |
| `NCE-U02-T02` | 核心 | 用归属问句询问，并按真实关系作肯定或否定短答 | `GS-OWNERSHIP-QUESTION-SG`、`GS-BE-SHORT-ANSWER-SG` | `L03-D08,D09,D11`；`L04-P01..P15` | `ownership-polarity-exchange` | 少量代表变体形成证据，其余完整接触或回访 |
| `NCE-U02-T03` | 核心 | 用 `my/your` 和肯定／否定陈述表达归属对比 | `GS-POSSESSIVE-DETERMINER`、`GS-BE-NEGATIVE-SG` | `L03-D06,D09,W04`；`L04-E01,E02` | `possessor-relation-contrast` | 功能词在完整关系中取证，不做孤立词义卡 |
| `NCE-U02-T04` | 支撑交际 | 在取物和交还时使用礼貌请求及 `Here is/Here's ...` 完成递交 | `GS-REQUEST-HANDOVER`、`GS-HERE-PRESENTATION` | `L03-D01,D02,D05,W02,W03,N01` | `request-and-handover-use` | 以完整表达和动作关系取证，不单独扩成训练章节 |
| `NCE-U02-T05` | 核心 | 判断 `it` 回指当前已提及物品，并在省略名词后继续理解问答 | `GS-PRONOUN-IT-REFERENCE` | `L03-D10,D11,N04`；复用 `L01-W09` | `anaphora-resolution` | 至少一个变化物品的关系证据；不考术语 |
| `NCE-U02-T06` | 支撑交际 | 在拿错物品时恰当使用道歉、称谓和感谢 | `GS-POLITE-REPAIR` | `L03-D03,D07,D12,W08,W09,N02,N03` | `social-repair-and-thanks` | 在交际用途里取证，不做 `sorry/sir` 图片题或独立章节 |
| `NCE-U02-T07` | 词汇抽样 | 将本单元新增用品、场所、号码和人物关系词连接到意义，并辨别复现词 | — | `L03-W01,W05..W07,W10`；`L04-W01..W05,P01..P15` | `lexical-form-meaning-association` | 首课抽样；具体词和通道配额待下一层冻结 |

上述七项是已接受的覆盖集合，不是七个页面、七种交互或七个掌握声明。T04、T06 依附完整交际链，T07 使用抽样证据；它们不得与四个核心 Target 等量扩成章节。形成性证据、跨日证据和最终掌握必须继续分层。

## 7. Source → Target 覆盖矩阵

图例：`E` = 可承担形成性证据；`S` = 支撑／接触；`O` = 仅可选拓展；`—` = 不覆盖。`E` 只表示资格，不表示首课必须全部考察。

| Source 组 | T01 | T02 | T03 | T04 | T05 | T06 | T07 | 不得据此声称 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| `L03-I01,Q01` | E | — | — | — | — | — | — | 已教授 `does` |
| `L03-D01..D02` | S | — | — | E | — | — | — | 每句话都必须单独做题 |
| `L03-D03..D05` | E | — | — | E | — | S | S | 记住 5 号即理解完整情节 |
| `L03-D06..D07` | E | — | E | — | — | E | — | 一次否认即掌握所有否定 |
| `L03-D08..D09` | S | E | E | — | — | — | — | 点击 `No` 即掌握归属对比 |
| `L03-D10..D12` | E | E | — | — | E | E | — | 背诵 `it` 术语即理解指代 |
| `L03-W01..W10` | S | — | S | S | — | S | E | 10 词都要当天双通道正式考察 |
| `L03-N01..N04` | — | — | — | S | S | S | — | Notes 本身成为术语考试 |
| `L03-Z01..Z12` | — | — | — | — | — | — | — | 查看中文等于听懂英语 |
| `L04-P01..P10` | — | E | E | — | — | — | E | 复现词自动获得新的词汇 Source ID |
| `L04-P11..P15,W01..W05` | — | E | S | — | — | — | E | 5 个新词必须复制 U01 全量双通道 |
| `L04-E01,E02` | — | O | O | — | — | O | — | 已完成书写、拼写或手机输入能力 |

## 8. 继承与不继承边界

| 可以继承的全局合同 | 不得自动继承的 U01 专属实现 |
|---|---|
| 奇数情境课与紧随的偶数操练课组成一个教学单元、一个地标 | 17 个阶段、29 个结果、当前 microtask ID 或固定任务顺序 |
| catalog 是教材文字、Source／Content ID、目标、答案、角色和音频映射的唯一课程真源 | “星灯失物招领站”故事、人物、场景、道具、物品批次和美术皮肤 |
| Source ID 与原创 Content ID 分离；接触、形成性证据、跨日掌握分层 | `first-session-full-dual-channel`、11 词全量双通道和 U01 的正答比例／选项数 |
| 6–8 岁边界、目标匹配纠错、稳定恢复、适龄触控、可访问性和真实音频 `ended` 原则 | U01 页面布局、点击／拖拽方式、提示文案、固定三步语法实验室或音频文件 |
| 首课完整接触目标来源，但只做少量代表性形成性检索；其余进入后续回访 | 只覆盖肯定短答的旧边界；U02 必须重新建模肯定／否定和 `my/your` 对比 |
| 教材书写活动始终可审计；未声明书写目标时不阻塞儿童主线 | 把 `please, here, my, sorry, sir` 等功能词当作可指认实体 |

继承的是领域不变量和已接受的课程治理，不是 U01 的人物、故事、视觉、题量或交互模板。

## 9. 书写与音频状态

### 9.1 书写：保留来源，默认可选

依据 ADR-0098，`L04-E01`、`L04-E02` 必须保留为教材来源并可追溯，但当前没有书写学习目标。因此推荐默认：

- 作为非阻塞的纸笔或平板手写拓展；
- 不进入必做儿童主线，不影响单元完成、地标或核心目标证据；
- 不用手机键盘任务替代；
- 若未来要提升为核心目标，必须另增书写／拼写证据、纠错和可访问性合同。

### 9.2 音频：尚未审计

教材页面的音频图标只证明出版社声明存在配套录音。本轮没有审计官方音频文件、数字资源入口、授权范围、文件哈希、speaker、声线、12 句／7 图／角色回合切分、时间边界或播放顺序。

在音频审计完成前：

- 不得冻结 speaker 或把推断人物写成源事实；
- 不得沿用 U01 音频、声音性别、分段或文件名；
- 不得声称已经具备真实 `ended` 推进、逐句播放或音频验收证据；
- 可以接受本启动包的教材与目标边界，但不能据此进入音频生产验收。

## 10. 明确排除项

本启动包**不包含，也不授权**：

- 故事主题、角色命名、角色设定、世界观或地标叙事；
- 美术风格、背景、人物图、物品图、动画、音效或其他素材生成；
- 页面信息架构、布局、字体、按钮、交互、拖拽／点击方案或响应式画幅；
- Content ID、阶段数、任务数、题量、选项、提示、奖励或支架文案；
- 运行时状态机、存储、恢复、测试、构建、部署或发布；
- 把全册粗索引中的远期风险行当作已接受 Target，或据此自动生成任务的声明。

本启动包与语法主干依赖现已接受，catalog 登记也已完成；故事、美术和页面体验仍须取得新的明确授权，才能进入独立的下一验收点。官方音频审计可以并行，但任何依赖 speaker、句段或声线的故事演出与音频生产不得在审计前冻结。

## 11. 已接受的产品决策

| 决策 ID | 决策范围 | 当时的可选方向 | 已接受选择 | 接受效果 |
|---|---|---|---|---|
| `PA-01` | 受控来源、教材事实与 Source 切分边界 | A. 接受 `BOOK1-2022-07`、§3 事实摘要，以及 12 个原子 `D` + 7 个 `figureGroup`，speaker 保持未冻结；B. 指出需修订的来源、事实或切分 | **A（已接受）** | 同时关闭来源身份、事实边界和 Source 切分歧义，保留播放粒度与教材画面关系，不把推断角色固化成教材事实 |
| `PA-02` | 语法主干与七个 Target 是否作为 U02 覆盖进入下一轮 | A. 接受所链接语法主干作为课程审计索引，并接受 T01–T07 及当前分级；B. 指出需修订的地图、结构位置、Target 或覆盖关系 | **A（已接受）**：T01–T03、T05 为核心，T04/T06 为支撑交际，T07 为词汇抽样；仍分接触、形成性证据、跨日掌握 | 同时关闭语法切片与 Target 依赖，不漏掉整段理解、正负归属、递交、指代、语用和词汇，也不把七项等量扩成七页 |
| `PA-03` | 首课证据配额原则 | A. 所有非 `context/optional` 来源真实接触 + 少量代表性检索；B. 15 个提示和新词全部当天全通道考察 | **A（已接受）** | `context/optional` 的参考译文和书写不进入必接触配额；`L04-P01..P15` 先保持 `support/exposure`，下一轮只提升能代表旧词、新物品词和人物关系词的少量项 |
| `PA-04` | Lesson 4 书写地位 | A. 可审计、非阻塞可选拓展；B. 核心必做目标 | **A（已接受）** | 保留教材完整性，但不引入手机键盘、拼写证据或主线完成门槛 |

产品负责人已于 2026-08-30 明确接受 `PA-01-A` 至 `PA-04-A`，本启动包状态因此变为 `accepted`；其中 `PA-02-A` 同时接受所链接语法主干的课程审计索引身份。随后完成的 catalog 登记只建立课程事实合同，仍不授权故事、美术、页面、运行时实现或发布。

## 12. 下一验收点前的门禁

1. **已完成**：记录 `PA-01-A` 至 `PA-04-A`，并由 `PA-02-A` 接受已链接的 Lesson 1–144 全册语法主干 V1 为课程审计索引。
2. 完成 Lesson 3–4 官方音频来源和切分审计，再冻结 speaker、segment 与文件映射。
3. 按 `PA-03` 冻结哪些 `L04-P` 和词汇来源升级为首课 `target/evidence`，哪些进入回访。
4. **已完成**：以 `curriculum-accepted / catalog-only / not-authored` 状态将 Source、Target 和覆盖写入 catalog；页面不得保存课程专属副本。
5. 依据 ADR-0115，Lesson 1–2 儿童观察可以与本轮课程整理并行；关闭门禁需要三至五名儿童的规定样本齐全，手机独立与电脑／投影两种场景各有一次当前候选版本从 1/17 到 17/17 的完成记录，重复问题已分类，课程生产母版（全局基线）修订候选已修复并在受影响模式中复验，Lesson 1–2 单元专属问题则已记录不适用于本单元的理由。完成前不得冻结 Lesson 3–4 课程设计或公开发布。
6. 取得新的明确授权后，才开始故事、美术和页面体验设计。
