# 《新概念英语智慧版 1》语法主干地图 V1

> 状态：accepted
>
> 接受记录：2026-08-30，产品负责人通过 `NCE-U02 / PA-02-A` 接受本文作为课程审计索引。
>
> 用途：在同一份语法主干地图中，为 Lesson 1–144 建立粗粒度索引，并为 Lesson 1–12 提供详细结构视图。本文被接受的是可追溯索引身份，不是把远期风险行接受为学习 Target，也不是课程脚本、实现合同或发布依据。

## 1. 受控来源与身份

### 1.1 受控 PDF

| 字段 | 值 |
|---|---|
| 书名 | 《新概念英语智慧版 1 / First Things First / 英语初阶》 |
| 版本 | 2022 年 7 月第 1 版，第 1 次印刷 |
| ISBN | `978-7-5213-3670-2` |
| 当前本地 locator | `/Users/permission/Downloads/外研社新概念英语智慧版1.pdf`（不作为跨环境身份） |
| 文件大小 | 435,616,959 bytes |
| PDF 物理页数 | 330 |
| SHA-256 | `a54740bdce7423b98ea30334dca9043603ef5533f85e64f86f5af6d31d93be9f` |
| 核对日期 | 2026-08-30 |

本文件只把上述哈希对应的学生用书 PDF 视为教材事实基准。逐页文字提取和页面渲染只在本轮作为临时定位、视觉核对工具，不是需要长期保留的来源项。若 PDF 哈希变化，本文的标题、页码和结构判断必须重新核对，不能沿用旧结论。

### 1.2 页码口径与映射

- `PDF p.` 一律指 PDF 文件的物理页序，不是纸书右下角的印刷页码。
- 一个奇偶教学单元通常占连续四个 PDF 物理页：奇数情境课正文与 Notes 各一页，偶数操练课与 Notes／Written exercises 各一页。
- 下方 72 单元粗表中的两个页码是两课的 **Notes／练习证据锚点页**，不是整单元页码范围。例如 L1–2 的 `PDF p.36, 38` 对应两课证据锚点；完整单元范围是 PDF p.35–38。
- L1–72 的课程页连续至 PDF p.178；PDF p.179–182 是阶段性测试／非正课插页；L73 从 PDF p.183 开始，之后课程页连续至 L144 的 PDF p.326。

Lesson 1–12 的完整映射如下：

| 教学单元 | PDF 物理页范围 | 纸书印刷页范围 | 粗表证据锚点 |
|---|---:|---:|---|
| L1–2 | 35–38 | 2–5 | PDF p.36, 38 |
| L3–4 | 39–42 | 6–9 | PDF p.40, 42 |
| L5–6 | 43–46 | 10–13 | PDF p.44, 46 |
| L7–8 | 47–50 | 14–17 | PDF p.48, 50 |
| L9–10 | 51–54 | 18–21 | PDF p.52, 54 |
| L11–12 | 55–58 | 22–25 | PDF p.56, 58 |

## 2. 证据等级与边界

### 2.1 T/N/E/I 证据等级

| 代码 | 含义 | 可支持的结论 | 不可单独支持的结论 |
|---|---|---|---|
| T | Textbook title：目录或课题明示 | 教材标题、奇偶课配对、标题中的结构 | 完整语法目标或教学优先级 |
| N | Notes on the text | 教材显式解释的形式、用法、缩写或语用 | Notes 未提及的结构不存在 |
| E | Written exercises／操练页 | 结构被要求辨别、转换或产出 | 每道练习都应成为产品必修任务 |
| I | Editorial inference：基于正文、Notes、练习和全册顺序形成的教材派生解释 | 粗粒度核心结构、首次／扩展／巩固判断；必须同时保留证据锚点与置信度 | 教材原页明示事实、已接受产品决定 |

证据强度按具体结论判断，不把 `T+N+E` 机械等同于“已冻结学习目标”。`I` 是教材事实层内部的**教材派生解释**：它解释受控教材的编排，但不是第三层，也不是课程设计层，更不是已接受的产品决定。表中的“核心结构”和“首次／扩展／巩固”均属于 `I`；它们只有在保留原页证据、置信度和待复核边界时才可使用。

### 2.2 事实层与设计层

| 层级 | 本文记录什么 | 当前状态 |
|---|---|---|
| 教材事实层 | 受控 PDF 身份、课次、教材标题、正文结构、Notes、操练／Written exercises、页码，以及标为 `I`、带证据与置信度的教材派生解释 | 可追溯，但仍受学生用书局限；`I` 不得伪装成原页明示事实 |
| 课程设计层（本文只引用已接受的 U02 Target） | 产品选择的学习 Target、意义建立、显性命名、变化练习、对比整合、跨日回访和记录省略 | 只引用稳定 `structureId`；U02 引用已由 `PA-02-A` 接受，其他单元仍须独立验收 |

故事、人物、场景、UI、交互、任务数量、题型、提示和首课取证配额仍属于课程设计层，但不在本文字段范围；它们必须另行验收，不得从本地图自动生成。这里不存在第三层。

### 2.3 强制判读规则

1. 教材理解问题只证明“教材要求理解这一问题”，不自动证明其中语法已经被教授。例如 L1 的 `Whose handbag is it?` 不把 `whose` 提前为 L1–2 语法目标；`whose` 的显性教学证据在 L11–12。L3 的 `Does the man get his umbrella back?` 也不把一般现在时助动词 `does` 提前为 L3–4 语法目标。
2. 不把情节理解、人物关系、物品识别或词义问题误写成语法目标；只有当正文、Notes 或操练对结构形成可追溯证据时，才进入语法主干。
3. `首次` 仅表示“在本受控学生用书和当前证据粒度中首次作为核心出现”，不是语言学或通用教学法上的绝对首次。
4. 本文不设计故事或 UI，不决定某个结构应做成点击、拖拽、跟读、书写或其他交互。
5. `mapNodeId` 只标识全册粗索引节点；`structureId` 才标识可被教材事实与课程设计稳定引用的详细结构。两者不得混用。

### 2.4 稳定身份与细化规则

1. 72 个粗索引节点使用连续且不可复用的 `mapNodeId`：`GSM-U01` 至 `GSM-U72`。它们只回答“全册哪一个奇偶单元节点”，不冒充语法结构身份。
2. 一个粗节点进入详细视图时，必须为其中每个结构生成或复用稳定 `structureId`，并从结构注册表回链所属 `mapNodeId`。同一结构跨单元复现时复用原 `structureId`，不得按单元另造近义 ID。
3. Lesson 1–12 已细化结构登记在 3.1；远期粗节点尚未拆出 `structureId` 是本文明确记录的粒度边界。它们在细化、回链和审核前不得被 catalog、页面、测试或任务生成器直接当作产品 Target。
4. `structureId` 关联的是结构身份，不等于学习 Target、Source、页面或题型；课程设计只能在独立字段中引用它。

## 3. Lesson 1–12 详细视图

### 3.1 稳定结构注册表

“源事实锚点”属于教材事实层；“教材派生解释”属于带证据与置信度的 `I`；“课程设计引用”属于独立课程设计层，仅引用 Lesson 3–4 启动包中已接受的 Target，不把课程决定写回教材事实。

| structureId | mapNodeId 回链 | 源事实锚点 | 教材派生解释（I） | 课程设计引用（已接受 U02 Target） |
|---|---|---|---|---|
| `GS-OWNERSHIP-QUESTION-SG` | `GSM-U01`、`GSM-U02` | L1–2 `Is this your ...?`，PDF p.35–38；L3–4 复现，PDF p.39–42 | 单数物品归属核验问句；U01 首次作为核心、U02 变化巩固（高） | `NCE-U02-T02` |
| `GS-BE-SHORT-ANSWER-SG` | `GSM-U01`、`GSM-U02` | L1 `Yes, it is.`，PDF p.35–36；L3 `No, it isn't.`，PDF p.39–40 | 单数 `be` 问句的肯定／否定短答形成正负对照（高） | `NCE-U02-T02` |
| `GS-BE-NEGATIVE-SG` | `GSM-U02` | L3 `This is not ...`、`No, it isn't.`；L4 练习，PDF p.39–42 | 单数 `be` 否定从纠正错误归属进入结构操练（高） | `NCE-U02-T03` |
| `GS-POSSESSIVE-DETERMINER` | `GSM-U01`、`GSM-U02`、`GSM-U03`、`GSM-U04`、`GSM-U06` | L1–12 的 `your/my/his/her` 正文与练习，PDF p.35–58 | 物主限定词随说话视角和所有者范围逐步扩展（高） | `NCE-U02-T03` |
| `GS-PRONOUN-IT-REFERENCE` | `GSM-U01`、`GSM-U02` | L1 `Yes, it is.`；L3 `Is this it?` 与 Notes，PDF p.35–40 | `it` 从短答代词扩展为篇章中对已提及物品的回指（高） | `NCE-U02-T05` |
| `GS-HERE-PRESENTATION` | `GSM-U02`、`GSM-U06` | L3 `Here is/Here's ...` 与 Notes，PDF p.39–40；L11 Notes，PDF p.56 | 呈递表达在 U02 首次集中出现，U06 与 `Here you are/Here it is` 对比（高） | `NCE-U02-T04` |
| `GS-POLITE-REPAIR` | `GSM-U01`、`GSM-U02` | L1 `Excuse me/Pardon/Thank you`，PDF p.35–36；L3 `Sorry, sir/Thank you`，PDF p.39–40 | 礼貌链从搭话与请求重复扩展到出错后的道歉、称谓和修复（高） | `NCE-U02-T06` |
| `GS-REQUEST-HANDOVER` | `GSM-U02` | L3 取物请求、递票、报号与交还对话，PDF p.39–40 | 多句请求—递交—交还构成交际功能链，不等于单一语法句型（高） | `NCE-U02-T04` |
| `GS-DEMONSTRATIVE-SG` | `GSM-U01`、`GSM-U02`、`GSM-U05`、`GSM-U06` | L1–2 `this`，PDF p.35–38；L9–12 `that/this`，PDF p.51–58 | 单数指示从近指输入扩展为 `this/that` 对比（高） | —（U02 仅随完整归属问句接触，不建立独立 Target 关系） |
| `GS-BE-PERSON-THING-SG` | `GSM-U03` | L5–6 `He/She/It is (not) ...`，PDF p.43–46 | `is/isn't` 从物品归属迁移到人物、国籍和物品品牌（高） | — |
| `GS-INDEFINITE-ARTICLE` | `GSM-U03`、`GSM-U04` | L5–8 `a/an` 正文、Notes 与练习，PDF p.43–50 | 不定冠词先随国籍／品牌进入，再扩展到职业（高） | — |
| `GS-WHAT-IDENTITY-QUESTION` | `GSM-U03` | L6 `What make is it?`，PDF p.45–46 | `What ...?` 首次作为身份／品牌信息问句核心出现（高） | — |
| `GS-BE-I-YOU` | `GSM-U04` | L7–8 `I am/You are/Are you ...?`，PDF p.47–50 | `be` 人称系统扩展到第一、第二人称及相应短答（高） | — |
| `GS-JOB-NATIONALITY-QUESTION` | `GSM-U04` | L7–8 国籍与职业问答，PDF p.47–50 | 两类 `What ...?` 问句用于交换人物身份信息（高） | — |
| `GS-HOW-BE-STATE-QUESTION` | `GSM-U05` | L9–10 `How are you?/How is ...?`，PDF p.51–54 | `How + be + subject` 进入状态问答（高） | — |
| `GS-BE-ADJECTIVE-PREDICATE` | `GSM-U05` | L9–10 人物与状态／外观形容词操练，PDF p.51–54 | `be + adjective` 成为本单元主要述谓变化之一（中） | — |
| `GS-IMPERATIVE-LOOK` | `GSM-U05` | L10 `Look at ...` 及操练，PDF p.53–54 | 祈使句用于引导注意并触发人物描述（中） | — |
| `GS-WHOSE-QUESTION` | `GSM-U06` | L11–12 `Whose ...?` 正文、Notes 与练习，PDF p.55–58 | `whose` 在 U06 才进入显性归属询问主干；L1 理解题不是提前教学（高） | — |
| `GS-NOUN-POSSESSIVE` | `GSM-U06` | L11–12 `Tim's` 等所有格及 Notes，PDF p.55–58 | 名词所有格与 `be` 缩写中的 `'s` 需要区分（高） | — |
| `GS-POSSESSOR-NOUN-ELLIPSIS` | `GSM-U06` | L12 `Whose is this/that ...?` 与操练，PDF p.57–58 | 已知名词可在所有者问答中省略（高） | — |

### 3.2 六单元详细摘要

### U01｜Lesson 1–2

- **身份**：粗节点 `GSM-U01`；详细结构 `GS-OWNERSHIP-QUESTION-SG`、`GS-BE-SHORT-ANSWER-SG`、`GS-POSSESSIVE-DETERMINER`、`GS-PRONOUN-IT-REFERENCE`、`GS-DEMONSTRATIVE-SG`、`GS-POLITE-REPAIR`。
- **标题与页码**：Lesson 1 `Excuse me!`；Lesson 2 `Is this your ...?`；PDF p.35–38。
- **教材情境**：一名男子询问手提包是否属于一名女子；女子请求重复、确认并致谢。偶数课用十个物品替换 `handbag`。
- **核心输入／操练**：`Excuse me!`、`Pardon?`、`Is this your ...?`、`Yes, it is.`；替换词为 `pen, pencil, book, watch, coat, dress, skirt, shirt, car, house`。
- **结构位置**：首次建立单数 `be` 问句、`this / it / your`、肯定短答；Lesson 2 是词项扩展与结构巩固，没有引入否定回答。
- **Notes／练习证据**：Notes 解释礼貌搭话与请求重复；Written exercises 要求抄写七句对话。
- **边界**：理解问题中的 `whose` 只用于理解手提包归属，不是本单元语法目标。

### U02｜Lesson 3–4

- **身份**：粗节点 `GSM-U02`；进入已接受 Target 的八个详细结构为 `GS-BE-NEGATIVE-SG`、`GS-HERE-PRESENTATION`、`GS-REQUEST-HANDOVER`、`GS-OWNERSHIP-QUESTION-SG`、`GS-BE-SHORT-ANSWER-SG`、`GS-POSSESSIVE-DETERMINER`、`GS-PRONOUN-IT-REFERENCE`、`GS-POLITE-REPAIR`。`GS-DEMONSTRATIVE-SG` 只随完整归属问句背景复现，不建立独立 Target 关系。
- **标题与页码**：Lesson 3 `Sorry, sir.`；Lesson 4 `Is this your ...?`；PDF p.39–42。
- **教材情境**：顾客凭票取回大衣和雨伞，服务人员先拿错雨伞，双方经否认、道歉和再次核对后找回正确物品。
- **核心输入／操练**：`This is not my umbrella.`、`Is this your umbrella?`、`No, it isn't.`、`Is this it?`、`Here's ...`；Lesson 4 用十五个名词继续替换操练。
- **结构位置**：首次引入 `my`、单数 `be` 否定、否定短答和 `Here is/Here's`；扩展 `it` 的篇章回指；整合 `my/your` 与肯定／否定归属。
- **Notes／练习证据**：Notes 明示 `Here's = Here is`、`Sorry = I'm sorry`、`sir` 的语用和 `it` 的回指；练习对比 `No. It isn't my ... It's your ...`。
- **边界**：理解问题里的 `does` 不构成本单元语法目标；十五个替换提示也不等于十五个产品必修题。

### U03｜Lesson 5–6

- **身份**：粗节点 `GSM-U03`；详细结构 `GS-BE-PERSON-THING-SG`、`GS-INDEFINITE-ARTICLE`、`GS-WHAT-IDENTITY-QUESTION`，并复用 `GS-BE-NEGATIVE-SG`、`GS-POSSESSIVE-DETERMINER`。
- **标题与页码**：Lesson 5 `Nice to meet you.`；Lesson 6 `What make is it?`；PDF p.43–46。
- **教材情境**：教师介绍新同学和国籍；偶数课把人物国籍扩展到汽车品牌与产地。
- **核心输入／操练**：`This is ...`、`He/She/It is ...`、`He/She/It isn't ...`、`What make is it?`、`a/an` 与 `or` 选择问句。
- **结构位置**：首次系统出现 `he/she`、`a/an`、人物／物体代词区分与国籍选择问句；把 U02 的 `is/isn't` 迁移到身份、国籍和物品品牌。
- **Notes／练习证据**：Notes 解释初次见面的问候和称谓；练习要求代词选择、国籍二选一及否定 + 肯定对照。
- **边界**：品牌、国籍和人物识别是结构载体，不能自动拆成独立语法目标。

### U04｜Lesson 7–8

- **身份**：粗节点 `GSM-U04`；详细结构 `GS-BE-I-YOU`、`GS-JOB-NATIONALITY-QUESTION`，并复用 `GS-INDEFINITE-ARTICLE`、`GS-POSSESSIVE-DETERMINER`。
- **标题与页码**：Lesson 7 `Are you a teacher?`；Lesson 8 `What's your job?`；PDF p.47–50。
- **教材情境**：两名初次见面的人交换姓名、国籍和职业；偶数课用十种职业替换操练。
- **核心输入／操练**：`I am ...`、`You are ...`、`Are you ...?`、`Yes, I am./No, I am not.`、`What nationality are you?`、`What's your job?`。
- **结构位置**：首次建立 `I/am`、`you/are` 与第二人称一般疑问／第一人称短答；把 `a/an` 扩展到职业。
- **Notes／练习证据**：Notes 解释 `I'm / What's / My name's` 等缩写和职业、国籍问法；练习整合 `am/is`、`his/her` 和职业名词。
- **边界**：职业词表是替换材料；其数量不决定产品题量。

### U05｜Lesson 9–10

- **身份**：粗节点 `GSM-U05`；详细结构 `GS-HOW-BE-STATE-QUESTION`、`GS-BE-ADJECTIVE-PREDICATE`、`GS-IMPERATIVE-LOOK`，并复用 `GS-DEMONSTRATIVE-SG`。
- **标题与页码**：Lesson 9 `How are you today?`；Lesson 10 `Look at ...`；PDF p.51–54。
- **教材情境**：熟人互问近况并告别；偶数课用人物和十二个状态／外观形容词进行描述。
- **核心输入／操练**：`How are you?`、`How is ...?`、`I'm/He's/She's ...`、`And you?`、`Look at ...`、`be + adjective`。
- **结构位置**：首次出现 `How + be + subject?`、`Look at ...`、`that` 和形容词表语；继续巩固 `am/is/are` 人称匹配。
- **Notes／练习证据**：Notes 区分初见 `meet` 与再次见面 `see`，解释 `And you?` 的省略；练习要求人物 + 形容词描述。
- **边界**：本单元标题以交际功能为主，“形容词述谓”是 Notes／练习归纳，因此全册粗表标为中置信度。

### U06｜Lesson 11–12

- **身份**：粗节点 `GSM-U06`；详细结构 `GS-WHOSE-QUESTION`、`GS-NOUN-POSSESSIVE`、`GS-POSSESSOR-NOUN-ELLIPSIS`，并复用 `GS-DEMONSTRATIVE-SG`、`GS-POSSESSIVE-DETERMINER`、`GS-HERE-PRESENTATION`。
- **标题与页码**：Lesson 11 `Is this your shirt?`；Lesson 12 `Whose is this/that ...?`；PDF p.55–58。
- **教材情境**：教师确认一件白衬衫的主人；偶数课用衣物、物品、亲属与姓名扩展所有者表达。
- **核心输入／操练**：`Whose shirt is that?`、`Whose is this/that ...?`、`It's Tim's.`、`It's his/her ...`、`this/that`、`my/your/his/her`。
- **结构位置**：首次显性教学 `whose`、名词所有格 `'s`、已知名词省略和 `this/that` 对比；整合此前分散出现的物主限定词。
- **Notes／练习证据**：Notes 区分 `Tim's` 所有格与 `he's/it's` 缩写，并区分 `Here you are.` 与 `Here it is.`；练习整合所有格与指示词。
- **边界**：这里才把 `whose` 纳入显性语法主干；不能反推 L1 的理解问题已完成该目标。

## 4. Lesson 1–12 详细视图：跨单元结构表

本表中的 `F/E/R/C` 仅用于六单元细读：`F` 首次、`E` 扩展、`R` 巩固、`C` 对比／整合。

| structureId | U01 `GSM-U01` | U02 `GSM-U02` | U03 `GSM-U03` | U04 `GSM-U04` | U05 `GSM-U05` | U06 `GSM-U06` |
|---|---|---|---|---|---|---|
| `GS-OWNERSHIP-QUESTION-SG` / `GS-BE-SHORT-ANSWER-SG` | F 问句与肯定短答 | C 否定短答 | — | — | — | R 归属核验 |
| `GS-BE-NEGATIVE-SG` / `GS-BE-PERSON-THING-SG` / `GS-BE-I-YOU` | — | F 单数否定 | E he/she/it + is/isn't | E I/am、you/are | R 多种人称／补语 | R 否定归属 |
| `GS-POSSESSIVE-DETERMINER` / `GS-WHOSE-QUESTION` / `GS-NOUN-POSSESSIVE` | F `your` | C `my/your` | E `his/her` 初现于练习 | E my/your/his/her | R 少量复现 | C `whose` + `'s` + my/your/his/her |
| `GS-DEMONSTRATIVE-SG` / `GS-PRONOUN-IT-REFERENCE` / `GS-POSSESSOR-NOUN-ELLIPSIS` | F this/it | E `it` 篇章回指 | E he/she/it，this 引见人物 | E I/you | E that；人称代词巩固 | C this/that；所有者链与名词省略 |
| `GS-WHAT-IDENTITY-QUESTION` / `GS-JOB-NATIONALITY-QUESTION` / `GS-HOW-BE-STATE-QUESTION` / `GS-WHOSE-QUESTION` | 理解题 `whose`，非目标 | 理解题 `does`，非目标 | F `What make ...?` | F `What nationality/job ...?` | F `How are/is ...?` | F 核心 `Whose ...?` |
| `GS-INDEFINITE-ARTICLE` | — | — | F a/an | E a/an + job | R | R |
| `GS-BE-ADJECTIVE-PREDICATE` | — | — | — | — | F 健康／外观形容词 | E 颜色形容词 |
| `GS-IMPERATIVE-LOOK` | — | — | — | — | F `Look at ...` | — |
| `GS-HERE-PRESENTATION` | — | F `Here is/Here's ...` | — | — | — | C `Here you are/Here it is` |
| `GS-POLITE-REPAIR` / `GS-REQUEST-HANDOVER` | 搭话→重复→确认→感谢 | 请求→取错→否认→道歉→纠正 | 问候→介绍→初见 | 互报姓名／国籍／职业 | 询问近况→再见 | 询问所有者→推测→交还 |

## 5. Lesson 1–144 粗粒度索引

> 本节完整保留同一语法主干地图的 72 个奇偶教学单元粗节点。标题属于教材明示事实；核心结构和“首次／扩展／巩固”是带证据与置信度的教材派生解释 `I`，不是课程设计层或已接受课程目标。粗节点只使用 `mapNodeId`，不得冒充 `structureId`。

| mapNodeId | 单元 | 情境课标题 | 操练课标题 | 核心结构 | 首次／扩展／巩固（教材派生解释 I） | 依据层级 | PDF页证据 | 置信度／未确认 |
|---|---|---|---|---|---|---|---|---|
| `GSM-U01` | L1-2 | Excuse me! | Is this your ...? | `Is this your ...?`；`Yes, it is.`；`this / it / your` 与基本 `be` 问答 | 首次 | T+N+E | PDF p.36, 38 | 高 |
| `GSM-U02` | L3-4 | Sorry, sir. | Is this your ...? | `This is not ... / It isn't ... / It's ...`；`my / your`；单数 `be` 否定与回答 | 扩展 | T+N+E | PDF p.40, 42 | 高 |
| `GSM-U03` | L5-6 | Nice to meet you. | What make is it? | `This is ...`；`He / She / It is (not) ...`；人物、国籍与物品品牌问答 | 扩展 | T+E+I | PDF p.44, 46 | 高 |
| `GSM-U04` | L7-8 | Are you a teacher? | What's your job? | `I am / You are`；`Are you ...?`；`What is your job / nationality?`；`a / an` | 首次 | T+N+E | PDF p.48, 50 | 高 |
| `GSM-U05` | L9-10 | How are you today? | Look at ... | 问候 `How are you?`；`He / She / It is + adjective`；祈使句 `Look at ...` | 扩展 | T+N+E+I | PDF p.52, 54 | 中（核心包含交际功能与形容词述谓） |
| `GSM-U06` | L11-12 | Is this your shirt? | Whose is this ...? This is my/your/his/her ... | `Whose ...?`；名词所有格 `'s`；`my / your / his / her` | 首次 | T+N+E | PDF p.56, 58 | 高 |
| `GSM-U07` | L13-14 | A new dress | What colour is your ...? | `What colour is ...?`；颜色形容词；所有格与 `his / her` 回指 | 扩展 | T+N+E | PDF p.60, 62 | 高 |
| `GSM-U08` | L15-16 | Your passports, please. | Are you ...? | 复数 `these / are`；国籍问答；规则名词复数 `-s / -es` | 首次 | T+N+E | PDF p.64, 66 | 高 |
| `GSM-U09` | L17-18 | How do you do? | What are their jobs? | `We / They are`；`our / their`；职业复数与不规则复数 `men / women` | 扩展 | T+N+E | PDF p.68, 70 | 高 |
| `GSM-U10` | L19-20 | Tired and thirsty | Look at them! | `am / is / are + adjective`；宾格 `them`；祈使句看人／物并描述 | 扩展 | T+N+E+I | PDF p.72, 74 | 中（标题未单独命名语法） |
| `GSM-U11` | L21-22 | Which book? | Give me/him/her/us/them a ... Which one? | `Which one?`；`Give + 间接宾语 + a ...`；宾格 `me / him / her / us / them` | 首次 | T+N+E | PDF p.76, 78 | 高 |
| `GSM-U12` | L23-24 | Which glasses? | Give me/him/her/us/them some ... Which ones? | `Which ones?`；复数／不可数 `some`；复数替代词 `ones` | 扩展 | T+N+E | PDF p.80, 82 | 高 |
| `GSM-U13` | L25-26 | Mrs. Smith's kitchen | Where is it? | `There is ...`；`Where is ...?`；`in / on / left / right / middle of`；`a / the` | 首次 | T+N+E | PDF p.84, 86 | 高 |
| `GSM-U14` | L27-28 | Mrs. Smith's living room | Where are they? | `There are ...`；复数 `Where are ...?`；`some + plural noun` 与位置介词 | 扩展 | T+N+E | PDF p.88, 90 | 高 |
| `GSM-U15` | L29-30 | Come in, Amy. | What must I do? | 祈使句；情态动词 `must + verb` 表义务；动作指令与宾语代词 | 首次 | T+N+E | PDF p.92, 94 | 高 |
| `GSM-U16` | L31-32 | Where's Sally? | What's he/she/it doing? | 现在进行时单数 `is + V-ing`；`What is ... doing?`；位置与动作 | 首次 | T+N+E | PDF p.96, 98 | 高 |
| `GSM-U17` | L33-34 | A fine day | What are they doing? | 现在进行时复数 `are + V-ing`；`What are they doing?`；`-ing` 拼写 | 扩展 | T+N+E | PDF p.100, 102 | 高 |
| `GSM-U18` | L35-36 | Our village | Where ...? | 现在进行时与方向／位置介词 `across / along / into / beside / out of` | 扩展 | T+N+E | PDF p.104, 106 | 高 |
| `GSM-U19` | L37-38 | Making a bookcase | What are you going to do? What are you doing now? | `be going to + verb` 表计划；与现在进行时“正在做”对比 | 首次 | T+N+E | PDF p.108, 110 | 高 |
| `GSM-U20` | L39-40 | Don't drop it! | What are you going to do? I'm going to ... | 否定祈使；`give/show/send/take + 人 + 物` 与 `... + 物 + to + 人`；代词在短语动词中的位置；继续操练 `going to` | 扩展 | T+N+E+I | PDF p.112, 114 | 中（同一单元承载多组结构） |
| `GSM-U21` | L41-42 | Penny's bag | Is there a ... in/on that ...? Is there any ...? | `There is` 问句／否定；可数 `a` 与不可数／复数 `some / any` | 首次 | T+N+E | PDF p.116, 118 | 高 |
| `GSM-U22` | L43-44 | Hurry up! | Are there any ...? Is there any ...? | `There are / is ... any ...?`；`some / any` 在肯定、疑问、否定中的分布 | 扩展 | T+N+E | PDF p.120, 122 | 高 |
| `GSM-U23` | L45-46 | The boss's letter | Can you ...? | 情态动词 `can + verb` 表能力；`Can ...? / can't` 与简短回答 | 首次 | T+N+E | PDF p.124, 126 | 高 |
| `GSM-U24` | L47-48 | A cup of coffee | Do you like ...? Do you want ...? | 一般现在时 `do` 问句；`like / want`；`Yes, I do / No, I don't` | 首次 | T+N+E | PDF p.128, 130 | 高 |
| `GSM-U25` | L49-50 | At the butcher's | He likes ... But he doesn't like ... | 一般现在时第三人称单数；`likes / doesn't like`；选择 `or / either` | 扩展 | T+N+E | PDF p.132, 134 | 高 |
| `GSM-U26` | L51-52 | A pleasant climate | What nationality are they? Where do they come from? | `Where do ... come from?`；`What nationality are ...?`；`What's ... like?` | 扩展 | T+N+E | PDF p.136, 138 | 高 |
| `GSM-U27` | L53-54 | An interesting climate | What nationality are they? Where do they come from? | 一般现在时描述自然规律／气候；第三人称单数；国家与国籍问答 | 巩固 | T+N+E+I | PDF p.140, 142 | 中（目录标题偏国籍，情境课同时突出自然事实） |
| `GSM-U28` | L55-56 | The Sawyer family | What do they usually do? | 一般现在时日常习惯；频率副词；第三人称 `-s / -es`；`do / does` 问答 | 扩展 | T+N+E | PDF p.144, 146 | 高 |
| `GSM-U29` | L57-58 | An unusual day | What's the time? | 一般现在时习惯与现在进行时当前动作对比；钟点／`at the moment` | 扩展 | T+N+E | PDF p.148, 150 | 高 |
| `GSM-U30` | L59-60 | Is that all? | What's the time? | `have / have got`；`some / any`；`much / many / a lot of`；需要与购物数量 | 扩展 | T+N+E+I | PDF p.152, 154 | 中（操练课标题与主要练习结构不完全同名） |
| `GSM-U31` | L61-62 | A bad cold | What's the matter with them? What must they do? | 疾病表达 `have + ache / cold / temperature`；`must + verb` 给建议 | 扩展 | T+N+E | PDF p.156, 158 | 高 |
| `GSM-U32` | L63-64 | Thank you, doctor. | Don't ...! You mustn't ...! | 禁止：`mustn't + verb` 与否定祈使 `Don't + verb` | 扩展 | T+N+E | PDF p.160, 162 | 高 |
| `GSM-U33` | L65-66 | Not a baby | What's the time? | 反身代词 `myself / yourself / himself ...`；时间表达与 `in / at / from` | 首次 | T+N+E+I | PDF p.164, 166 | 中（反身代词和时间介词并列） |
| `GSM-U34` | L67-68 | The weekend | What's the time? | `was / were`；过去时间／地点问答；`at / on / in` | 首次 | T+N+E | PDF p.168, 170 | 高 |
| `GSM-U35` | L69-70 | The car race | When were they there? | `was / were / there were`；过去时的 `when / where` 与时间介词 | 扩展 | T+N+E+I | PDF p.172, 174 | 中（`there were` 由情境文本归纳） |
| `GSM-U36` | L71-72 | He's awful! | When did you ...? | 一般过去时规则动词 `-ed`；助动词 `did` 问句；`yesterday / last ...` | 首次 | T+N+E | PDF p.176, 178 | 高 |
| `GSM-U37` | L73-74 | The way to King Street | What did they do? | 一般过去时不规则动词；方式副词 `pleasantly / hurriedly / slowly ...` | 扩展 | T+N+E | PDF p.184, 186 | 高 |
| `GSM-U38` | L75-76 | Uncomfortable shoes | When did you ...? | 一般过去时不规则变化；`ago / last ...`；`When did ...?` | 扩展 | T+N+E | PDF p.188, 190 | 高 |
| `GSM-U39` | L77-78 | Terrible toothache | When did you ...? | 一般过去时问答与时间倒推；规则／不规则过去式综合 | 巩固 | T+N+E | PDF p.192, 194 | 高 |
| `GSM-U40` | L79-80 | Carol's shopping list | I must go to the ... | `have got / haven't got`；可数／不可数数量 `many / much / a lot of`；`need` | 首次 | T+N+E | PDF p.196, 198 | 高 |
| `GSM-U41` | L81-82 | Roast beef and potatoes | I had ... | `have` 的多种搭配；过去式 `had`；`going to have / having / must have / had` | 扩展 | T+N+E+I | PDF p.200, 202 | 中（`have` 的词汇搭配与时态形式并重） |
| `GSM-U42` | L83-84 | Going on holiday | Have you had ...? | 现在完成时 `have/has + past participle`；`already / just`；`some / one / any` | 首次 | T+N+E | PDF p.204, 206 | 高 |
| `GSM-U43` | L85-86 | Paris in the spring | What have you done? | 现在完成时经历 `ever / never / been to`；与明确过去时间的一般过去时对比 | 扩展 | T+N+E | PDF p.208, 210 | 高 |
| `GSM-U44` | L87-88 | A car crash | Have you ... yet? | 现在完成时 `yet / already`；`Have ...?` 与 `When did ...?` 联动 | 扩展 | T+N+E | PDF p.212, 214 | 高 |
| `GSM-U45` | L89-90 | For sale | Have you ... yet? | 现在完成时持续用法：`for / since / how long`；与一般过去时对照 | 扩展 | T+N+E | PDF p.216, 218 | 高 |
| `GSM-U46` | L91-92 | Poor Ian! | When will ...? | 一般将来时 `will + verb`；`When will ...?`；`will not / won't` | 首次 | T+N+E | PDF p.220, 222 | 高 |
| `GSM-U47` | L93-94 | Our new neighbour | When did you/will you go to ...? | 过去与将来出行时间对比；不规则过去式与 `will` | 扩展 | T+N+E | PDF p.224, 226 | 高 |
| `GSM-U48` | L95-96 | Tickets, please. | What's the exact time? | `had better + verb`；`in ... time` 与将来时间；精确钟点表达 | 首次 | T+N+E+I | PDF p.228, 230 | 中（建议结构与时间表达并列） |
| `GSM-U49` | L97-98 | A small blue case | Whose is it? Whose are they? | 名词性物主代词 `mine / yours / his / hers / ours / theirs`；`belong to` | 首次 | T+N+E | PDF p.232, 234 | 高 |
| `GSM-U50` | L99-100 | Ow! | He says that ... She says that ... They say that ... | 间接引语初步：现在时报告动词 `says / say (that) + clause` | 首次 | T+N+E | PDF p.236, 238 | 高 |
| `GSM-U51` | L101-102 | A card from Jimmy | He says he ... She says she ... They say they ... | 间接引语扩展：省略 `that`；人称转换；报告现在完成时、将来时和情态内容 | 扩展 | T+N+E | PDF p.240, 242 | 高 |
| `GSM-U52` | L103-104 | The French test | Too, very, enough | 程度：`too / very / adjective + enough`；`enough for ... / to ...` | 首次 | T+N+E | PDF p.244, 246 | 高 |
| `GSM-U53` | L105-106 | Full of mistakes | I want you/him/her/them to ... Tell him/her/them to ... | `want / tell / ask + object + to-infinitive`；否定指令扩展 | 首次 | T+N+E | PDF p.248, 250 | 高 |
| `GSM-U54` | L107-108 | It's too small. | How do they compare? | 形容词比较级／最高级 `-er / -est`；`than`；拼写变化 | 首次 | T+N+E | PDF p.252, 254 | 高 |
| `GSM-U55` | L109-110 | A good idea | How do they compare? | 数量比较：`a few / a little`；`fewer / less / more / most / least`；不规则 `best / worst` | 扩展 | T+N+E | PDF p.256, 258 | 高 |
| `GSM-U56` | L111-112 | The most expensive model | How do they compare? | 多音节形容词 `more / most / less / least`；`as ... as / not as ... as` | 扩展 | T+N+E | PDF p.260, 262 | 高 |
| `GSM-U57` | L113-114 | Small change | I've got none. | `no / none / any`；`Neither + auxiliary + subject` 与 `So + auxiliary + subject` | 首次 | T+N+E | PDF p.264, 266 | 高 |
| `GSM-U58` | L115-116 | Knock, knock! | Every, no, any and some | 不定代词：`someone / anyone / no one / everyone`、`something / anything / nothing / everything` 等 | 首次 | T+N+E | PDF p.268, 270 | 高 |
| `GSM-U59` | L117-118 | Tommy's breakfast | What were you doing? | 过去进行时 `was/were + V-ing`；`when / while` 连接背景动作与插入事件 | 首次 | T+N+E | PDF p.272, 274 | 高 |
| `GSM-U60` | L119-120 | A true story | It had already happened. | 过去完成时 `had + past participle`；`already / never / before`；过去事件先后 | 首次 | T+N+E | PDF p.276, 278 | 高 |
| `GSM-U61` | L121-122 | The man in a hat | Who (whom), which and that | 限定性关系从句；`who / whom / which / that` 作主语或宾语 | 首次 | T+N+E | PDF p.280, 282 | 高 |
| `GSM-U62` | L123-124 | A trip to Australia | (Who) / (whom), (which) and (that) | 宾语关系代词省略；接触式关系从句；介词保留在句末 | 扩展 | T+N+E | PDF p.284, 286 | 高 |
| `GSM-U63` | L125-126 | Tea for two | Have to and do not need to | `have to / has to`；`do not have to` 与 `needn't`；和 `must` 的义务／必要性对比 | 首次 | T+N+E | PDF p.288, 290 | 高 |
| `GSM-U64` | L127-128 | A famous actress | He can't be ... He must be ... | 对现在的情态推断：`must be / can't be`；肯定／否定把握 | 首次 | T+N+E | PDF p.292, 294 | 高 |
| `GSM-U65` | L129-130 | Seventy miles an hour | He can't have been ... He must have been ... | 对过去的情态推断：`must / can't have been`；与过去义务 `had to` 区分 | 扩展 | T+N+E | PDF p.296, 298 | 高 |
| `GSM-U66` | L131-132 | Don't be so sure! | He may be ... He may have been ... I'm not sure. | 可能性推断：`may / might be`；`may / might have been` | 扩展 | T+N+E | PDF p.300, 302 | 高 |
| `GSM-U67` | L133-134 | Sensational news! | He said (that) he ... He told me (that) he ... | 过去时报告动词的间接引语；`say / tell`；现在／进行时回移 | 首次 | T+N+E | PDF p.304, 306 | 高 |
| `GSM-U68` | L135-136 | The latest report | He said (that) he ... He told me (that) he ... | 间接引语时态／情态扩展：`will -> would`、`can -> could`、`may -> might`、`going to -> would` | 扩展 | T+N+E | PDF p.308, 310 | 高 |
| `GSM-U69` | L137-138 | A pleasant dream | If ... | 第一条件句：`if + present simple, will + verb`；真实可能条件与结果 | 首次 | T+N+E | PDF p.312, 314 | 高 |
| `GSM-U70` | L139-140 | Is that you, John? | He wants to know if/why/what/when | 间接疑问句：`if / whether` 与 `why / what / when`；陈述语序 | 首次 | T+N+E | PDF p.316, 318 | 高 |
| `GSM-U71` | L141-142 | Sally's first train ride | Someone invited Sally to a party. Sally was invited to a party. | 一般现在时／一般过去时被动：`be + past participle`；主动转被动 | 首次 | T+N+E | PDF p.320, 322 | 高 |
| `GSM-U72` | L143-144 | A walk through the woods | He hasn't been served yet. He will be served soon. | 现在完成时被动 `has/have been + past participle`；一般将来时被动 `will be + past participle` | 扩展 | T+N+E | PDF p.324, 326 | 高 |

## 6. 粗粒度索引的阶段性观察

- `GSM-U01..GSM-U15`（L1–30）：以 `be`、代词／所有格、名词单复数、`there be`、祈使句和 `must` 建立句子基本骨架。
- `GSM-U16..GSM-U35`（L31–70）：从现在进行时进入 `going to`、一般现在时、数量表达，再到过去 `be`。
- `GSM-U36..GSM-U49`（L71–98）：集中建立一般过去时、现在完成时、一般将来时、建议结构和名词性物主代词。
- `GSM-U50..GSM-U63`（L99–126）：进入间接引语、程度与比较、复合不定代词、过去进行时／过去完成时、关系从句和必要性表达。
- `GSM-U64..GSM-U72`（L127–144）：集中处理情态推断、间接引语回移、第一条件句、间接疑问句和多时态被动语态。

这些阶段名称是为了阅读全册结构而作的编辑性归纳，不是教材官方分区，也不能直接变成产品城区、章节标题或故事主题。

## 7. 高风险待复核行

| mapNodeId／单元 | 风险 | 当前结论 | 复核责任 | 最晚复核时点与动作 |
|---|---|---|---|---|
| `GSM-U05`／L9–10 | 标题偏交际功能，核心同时包含问候、形容词表语和祈使句 | 中置信度 I；风险已登记、未关闭 | 对应单元课程负责人 | 在 U05 教学单元启动包进入产品验收前，回看完整正文、Notes 与练习，确定主结构和复现结构 |
| `GSM-U10`／L19–20 | 标题未命名语法，宾格 `them` 与形容词述谓并列 | 中置信度 I；风险已登记、未关闭 | 对应单元课程负责人 | 在 U10 教学单元启动包进入产品验收前，核对哪个结构承担变化练习 |
| `GSM-U20`／L39–40 | `going to`、否定祈使、双宾语与短语动词代词位置同单元出现 | 中置信度 I；保留多结构，风险未关闭 | 对应单元课程负责人 | 在 U20 教学单元启动包进入产品验收前逐练习标注首次／复现，不得压成单一目标 |
| `GSM-U27`／L53–54 | 操练课标题仍指国籍／来源，情境课突出气候的一般现在时 | 中置信度 I；暂列巩固，风险未关闭 | 对应单元课程负责人 | 在 U27 教学单元启动包进入产品验收前，区分标题操练与情境课语法贡献 |
| `GSM-U30`／L59–60 | 操练课标题与数量／`have got` 练习不完全同名 | 中置信度 I；风险已登记、未关闭 | 对应单元课程负责人 | 在 U30 教学单元启动包进入产品验收前，完整核对双页练习后确定主次 |
| `GSM-U33`／L65–66 | 反身代词与时间介词并列 | 中置信度 I；风险已登记、未关闭 | 对应单元课程负责人 | 在 U33 教学单元启动包进入产品验收前，分开记录结构群，避免合并成一个目标 |
| `GSM-U35`／L69–70 | `there were` 来自情境文本归纳 | 中置信度 I；风险已登记、未关闭 | 对应单元课程负责人 | 在 U35 教学单元启动包进入产品验收前，核对 Notes／练习是否要求显性产出 |
| `GSM-U41`／L81–82 | `have` 的词汇搭配与时态形式并重 | 中置信度 I；风险已登记、未关闭 | 对应单元课程负责人 | 在 U41 教学单元启动包进入产品验收前，区分搭配复现、时态变化和真正新结构 |
| `GSM-U48`／L95–96 | `had better`、将来时间和精确钟点并列 | 中置信度 I；风险已登记、未关闭 | 对应单元课程负责人 | 在 U48 教学单元启动包进入产品验收前，核对建议结构是否为主要变化练习 |
| `GSM-U68`／L135–136 | Notes 原页列出 `going to -> would` 等报告变化，粗写易误解具体句型 | 高来源置信度；解释风险已登记、未关闭 | 对应单元课程负责人 | 在 U68 教学单元启动包进入产品验收前逐句核对正文／练习；正式目标不得只复制箭头摘要 |

以上风险行可以随全册粗地图一起被接受为**带风险的课程审计索引**；这不接受其为学习 Target。每一行必须在对应教学单元启动包进入产品验收前由表中责任角色关闭并记录结论；复核前不得被课程系统当作唯一学习目标，也不得据此自动生成题目。

## 8. 学生用书证据的局限

1. **不是教师用书**：当前没有教师用书的教学意图、重难点、课时建议或答案解释，不能声称表中的主次就是官方教学目标。
2. **没有音频证据**：本文没有使用官方音频、说话人切分或时间轴，不能据此决定跟读句段、语音目标或交互时长。
3. **OCR 仅为索引**：逐页文本存在乱码、断行和字符识别错误；标题、Notes 和关键结构以 PDF 原页视觉核对为准。
4. **Notes 不穷尽正文**：某结构未出现在 Notes 中，不代表正文没有使用；正文中偶然出现也不代表已经显性教学。
5. **练习可能多目标**：一个 Written exercises 页面可能同时复现词汇、句法、语用和书写机制；不得强行压成一个语法标签。
6. **标题不等于目标**：情境课标题可能是故事话语，操练课标题可能只覆盖部分结构；标题只能作为 T 证据。
7. **理解题不等于语法目标**：题干里的 `whose`、`does` 等结构只证明理解任务存在，不能越级进入本单元的语法目标。
8. **粗分类仍需教材复核与课程另行决策**：首次／扩展／巩固与阶段性观察属于教材事实层的 `I`，不是课程设计；产品使用前仍需在具体单元回到原页核验，再由课程设计层独立作出教学选择。

## 9. 产品接受依据（已满足）

产品负责人于 2026-08-30 接受本文时，只同意把它作为后续课程审计的语法索引，不表示接受任何故事、UI 或任务设计。本次接受依据如下：

- 受控 PDF 哈希、页码口径和 72 单元配对无误；
- `GSM-U01..GSM-U72` 连续、唯一并与 72 个奇偶单元一一对应；删除、插入或重排节点不得静默复用旧 ID；
- Lesson 1–12 六单元摘要没有把理解题结构误写成语法目标；
- Lesson 1–12 注册表中的每个 `structureId` 都有 `mapNodeId` 回链、原页事实锚点、标明置信度的教材派生解释，以及与教材事实分栏的课程设计引用；启动包引用的八个 `structureId` 必须逐字一致；
- 任何粗节点进入详细视图时均生成或复用 `structureId` 并回链 `mapNodeId`；尚未细化的 `GSM-U07..GSM-U72` 不得被 catalog、页面、测试或任务生成器直接当作产品 Target；
- 九个中置信度单元及 L135–136 已登记当前未关闭结论、复核责任和最晚复核时点；接受粗地图只接受其风险可见的索引地位，不接受它们为 Target；
- `I` 始终作为教材事实层的派生解释记录证据与置信度，不出现第三层或“I 已被产品接受”的暗示；课程设计层只保存产品教学选择；
- 后续单元设计继续把教材事实层与课程设计层分开记录；本文未覆盖的下游课程决定另行验收，不允许页面或代码直接依赖本文的 `I` 标签；
- 若引入教师用书、音频或新版 PDF，应更新受控来源并重新发布版本，而不是静默覆盖本文件。
