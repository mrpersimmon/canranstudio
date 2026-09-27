# Duolingo 语言学习题型与界面设计研究

研究日期：2026-09-27 ｜ 范围：语言学习，免费、Super、Max ｜ 证据版 v1.0

这份报告把 Duolingo 拆成可观察的学习任务：用户看见或听见什么、必须做什么、系统给什么反馈、下一次怎样减少帮助。题型分析的单位是“学习目标 × 输入材料 × 作答方式”。换角色、颜色、语言或倒计时，不一定创造一个新题型；相同词块控件用于翻译、听写、故事续句时，学习任务却不同。

核心判断是：Duolingo 的题目设计通过逐步减少提示，把学习者从“认出答案”引向“提取答案”和“在语境中表达”。统一的题页结构降低操作负担；词块、图片、音频和角色提供不同支架；Stories、Radio、Adventures 与 Max 对话把孤立语言材料放进更长的情境。这个判断是本报告根据题面与操作作出的分析，并不等于 Duolingo 每种题型都已经被独立实验证明有效。

## 1. 范围、证据和阅读方式

- 覆盖普通语言课、词汇与语法、阅读与听力、口语、发音专项、非拉丁文字系统、Stories、Radio、Adventures、Flashcards、Max 对话，以及练习、反馈、限时挑战等相关模式。
- 不包括数学、音乐、国际象棋、独立 Duolingo ABC 和 Duolingo English Test。它们的题目不能混入主应用语言课清单。
- “完整界面”指保留该来源所展示的题目视口和关键操作区，不等于截取了一整篇可滚动故事，也不等于含有全部作答状态。多屏官方排版、原始动图静帧、历史截图会分别标注。
- 本轮浏览器控制持续超时，未完成真实账号登录和逐题实机操作；没有把页面打开尝试算作体验验收。操作说明依据官方描述、已核验截图和少量明确标注的作者实测记录。
- 本报告没有 Duolingo 内部代码、评分服务或实验配置。对识别容差、笔顺判定、随机出题、动效毫秒数等未公开细节，不作代码事实断言。
- 官方文章的修改日期不是截图拍摄日期。图片路径中的年月仅用于标识媒体年代线索，不能证明当时或今天全量上线。历史题页可证明设计曾存在，不能证明当前所有账号可见。

每个题型条目均列出“训练什么、如何操作、界面关键点、设计解读、可用性边界”，并附原图与来源。设计解读是研究推论；截图可见事实与官方功能声明分开呈现。未取得完整图或未证实当前存在的项目集中列入补证表，不以入口页冒充答题页。

## 2. 从第一性原理理解题型体系

语言任务的最终目标，是让学习者在新情境里理解和表达意思。屏幕上的正确答案只是证据之一。要判断一道题的价值，应先问四件事：它让用户提取了什么知识；提供了哪些可以绕过提取的线索；错误能否指向具体困难；离开提示后还能否完成。

| 需要建立的能力 | 合适的任务 | 支架怎样撤除 | 答对仍不能证明什么 |
| --- | --- | --- | --- |
| 声音、字形与意义建立联系 | 看图选词、字音配对、读音辨认 | 图文共同提示→只保留声音或文字 | 能独立拼写、自由交流 |
| 从记忆中提取词语 | 单词翻译、听写、Flashcards | 候选词→局部空缺→自由输入 | 能在新话题中自然使用 |
| 组合句法与形态规则 | 词块组句、词尾、双空、表格 | 范式对照→局部生成→整句生成 | 已理解整段语篇或交际意图 |
| 理解连续信息 | 阅读理解、听后选答、Stories、Radio | 逐句重播/文本→更长音频与较少文字 | 能自主表达相同内容 |
| 生成可懂的语音 | 跟读、口说回应、语音翻译 | 给定全文→候选回应→自行组织 | 语音识别通过就等于发音自然 |
| 实现真实沟通目的 | Adventures、Roleplay、Video Call | 选项与任务提示→开放多轮对话 | 已能应对所有真人交流情境 |

### 2.1 题目难度至少有五个独立维度

1. **材料复杂度**：单词、短句、段落、持续对话。
2. **输出自由度**：二选一、多选、配对、词块、局部输入、自由输入或口语。
3. **可用支架**：图片、译文、词库、慢速、字幕、提示词、已给出的句型。
4. **时间与记忆压力**：材料是否一直可见，能否重播，是否限时。
5. **情境迁移距离**：重复原句、换人称或名词、换场景、完成新沟通目标。

因此，把候选项从三个改为四个，未必比去掉翻译提示更能提高学习要求；加倒计时也可能主要增加视觉搜索与点击压力。设计时应先选择要训练的困难，再调整控件。官方介绍过按学习进度安排不同挑战和减少支架，但本报告没有验证每名用户的实际调度算法。[难度设计](https://blog.duolingo.com/right-level-of-difficulty/)、[沉浸题型](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/)

### 2.2 同一材料可以生成不同任务

例如同一句目标语，可用于带译文填空、词块翻译、缺词听辨、整句听写和朗读。复用材料让知识点保持稳定，改变任务让提取途径变化。必须保留不同题型的判分边界：听写要求还原声音，翻译要容纳合理表达，对话要判断是否达成交际目的。官方内容生产说明确实展示了同一材料的多题型使用；不能由此推导出其私有数据结构或全部判分规则。[官方内容生产说明](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/)

### 2.3 反馈是学习内容的一部分

一个可用的题目循环应至少能表达：尚未作答→已作答→提交→正确或需修正→继续。即时配对、描写和实时语音可以有不同节奏。普通题的绿色反馈、改错提示与继续按钮帮助关闭当前任务；Explain My Answer 增加解释层；Roleplay 的复盘把沟通流与纠错流分开。奖励和连胜帮助用户继续练习，但 XP、速度和学习迁移是不同指标。[答案解释](https://blog.duolingo.com/explain-my-answer-now-free/)、[学习时间指标](https://blog.duolingo.com/time-spent-learning-well/)

## 3. 免费、Super、Max 的实际边界

套餐决定部分功能或使用条件，不能代替题型分类。下表是截至研究日检索到的官方声明，不是逐账号验收结果。

| 功能 | 已确认的公开定位 | 必须保留的限制 |
| --- | --- | --- |
| 普通读写听说、语言路径 | 基础学习内容 | 不保证所有语言方向出现所有题型 |
| Practice tab：词汇、听说、错题等 | 2026-02-18 官方宣布 iOS/Android 全语言课程练习免费 | 具体合集仍取决于该课程已有内容；旧 Super 图标不能证明今天收费 |
| Explain My Answer / Explain My Mistake | 2026-01 官方宣布向多数指定语种学习者免费提供 | 不是所有语言、地区和账号的无条件覆盖 |
| Super | 订阅体验与练习权益；官方家庭套餐资料仍介绍无限 Legendary 等 | 不把旧 Practice Hub 资料写成当前独占题库；不在本报告报价 |
| Roleplay、Lily Video Call | Max 对话功能 | 语言方向、平台和分批开放条件不同；不能由手机图推出 Web 可用 |
| Falstaff Video Call | 面向初学者的 Max 引导口语 | 公告明确 iOS；分阶段扩展目标不等于已经全量开放 |
| Stories、Radio | 课程内情境理解活动 | 深度和入口随课程、进度变化；官方各年代的覆盖数字不可混用 |
| Adventures | 路径中的场景任务 | 公告只明确部分课程方向；未取得研究日全量课程和套餐矩阵 |
| 限时挑战、Legendary | 给既有题型加时限、关卡或提示限制的模式 | 当前次数、宝石费用、活动排期未逐账号核实 |

本表依据：[免费 Practice](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)、[免费答案解释](https://blog.duolingo.com/explain-my-answer-now-free/)、[Max](https://blog.duolingo.com/duolingo-max/)、[Falstaff](https://blog.duolingo.com/beginner-video-call-with-falstaff/)、[Super 家庭套餐](https://blog.duolingo.com/plus-family-plan/)、[年度功能回顾](https://blog.duolingo.com/product-highlights/)。

## 4. 怎样阅读后面的题型图谱

“原子任务”关注用户实际完成的一次语言操作；“变体”表示输入方式、情境或呈现结构的变化；“容器”组织多种任务。C 系列为普通课与声音练习，W 系列为文字系统，S/R/A 系列为故事、电台和场景任务，M 系列为 Max，P 系列为练习和反馈模式，H 系列为历史补充。编号只为这份报告检索使用，不是 Duolingo 内部题型代码。



## 题型索引

| 编号 | 题型/变体 | 分类 | 图片数量 |
| --- | --- | --- | --- |
| C01 | 图片词汇单选 | 原子任务 | 1 |
| C02 | 语境词义辨认 | 原子任务 | 1 |
| C03 | 双语词语配对 | 原子任务 | 1 |
| C04 | 图片/词义提示的单词翻译 | 原子任务 | 1 |
| C05 | 带冠词选择的单词翻译 | 组合变体 | 1 |
| C06 | 词块组句翻译 | 原子任务 | 2 |
| C07 | 整句自由翻译 | 原子任务 | 2 |
| C08 | 补全部分翻译 | 原子任务 | 2 |
| C09 | 单语语境选词填空 | 原子任务 | 2 |
| C10 | 场景图片辅助的单语填空 | 情境变体 | 1 |
| C11 | 对比双空填词 | 结构变体 | 1 |
| C12 | 点选词尾 | 原子任务 | 1 |
| C13 | 键入词尾 | 输入方式变体 | 1 |
| C14 | 语法范式表格补全 | 原子任务 | 1 |
| C15 | 词块听写/听后重组 | 原子任务 | 1 |
| C16 | 整句自由听写 | 原子任务 | 1 |
| C17 | 局部听写：键入缺词 | 原子任务 | 1 |
| C18 | 听句中缺词，选择声音答案 | 原子任务 | 1 |
| C19 | 声音与词语配对 | 原子任务 | 1 |
| C21 | 听后理解并选答 | 原子任务 | 1 |
| C20 | 段落阅读理解 | 原子任务 | 1 |
| C22 | 选择下一句对话 | 原子任务 | 1 |
| C23 | 选择合适回应并说出来 | 原子任务 | 1 |
| C24 | 给定句子朗读/跟读 | 原子任务 | 2 |
| C25 | 复述已给定的对话回应 | 情境变体 | 1 |
| C26 | 以语音输入完成翻译 | 输入方式变体 | 1 |
| C27 | Flashcards 主动回忆卡组 | 微练习循环 | 1 |
| C28 | 最小对立/近音词辨认 | 原子任务 | 1 |
| C29 | 两段声音相同/不同判断 | 原子任务 | 1 |
| C30 | 近音词声音—文字配对 | 内容变体 | 1 |
| W01 | 假名按路径描写 | 文字学习任务/语言变体 | 1 |
| W02 | 根据转写选择假名组合 | 文字学习任务/语言变体 | 1 |
| W03 | 看假名选择读音 | 文字学习任务/语言变体 | 1 |
| W04 | 补全假名缺失笔画 | 文字学习任务/语言变体 | 1 |
| W05 | 汉字描写与局部补写 | 文字学习任务/语言变体 | 2 |
| W06 | 日语汉字部件拼合 | 文字学习任务/语言变体 | 2 |
| W07 | 看汉字选择拼音 | 文字学习任务/语言变体 | 1 |
| W08 | 汉字与拼音配对 | 文字学习任务/语言变体 | 1 |
| W09 | 韩文音节块组装 | 文字学习任务/语言变体 | 1 |
| W10 | 阿拉伯字母描写 | 文字学习任务/语言变体 | 1 |
| W11 | 按转写选择天城文字母 | 文字学习任务/语言变体 | 1 |
| W12 | 韩语听音选词 | 声音任务的语言/单位变体 | 1 |
| W13 | 听音用韩文字块重组 | 声音任务的语言/单位变体 | 2 |
| S01 | 故事理解单选 | 情境交互 | 1 |
| S02 | 故事听音词块补句/组句 | 情境交互 | 2 |
| S03 | 故事语境选词填空 | 情境交互 | 1 |
| S04 | 故事开放写作 | 情境交互 | 1 |
| S05 | 故事补选缺失短语 | 历史题面补充/情境变体 | 1 |
| S06 | 故事句中点选指定词义 | 历史题面补充/情境变体 | 1 |
| S07 | 故事选择接下来的内容 | 历史题面补充/情境变体 | 1 |
| S08 | 故事结尾词语配对 | 历史题面补充/情境变体 | 1 |
| R01 | Radio听音选指定数量的词 | 情境交互 | 2 |
| R02 | Radio音频—释义配对 | 情境交互 | 1 |
| R03 | Radio听力判断正误 | 情境交互 | 1 |
| R04 | Radio听音选择相关图片 | 情境交互 | 1 |
| A01 | 场景点物/读标牌/探索 | 情境交互 | 1 |
| A02 | 任务情境选择回应 | 情境交互 | 1 |
| M01 | Roleplay多轮情景聊天 | 开放对话体验 | 1 |
| M02 | Video Call with Lily自由口语对话 | 开放对话体验 | 1 |
| M03 | Video Call with Falstaff引导口语 | 开放对话体验 | 1 |

## 词汇与翻译


### C01 · 图片词汇单选

分类：原子任务。
训练目标：将词义和图像建立对应。
输入 → 输出：母语词提示；若干带目标语标签的图片。 → 一个图片选项。

**用户操作**

1. 读提示。
2. 点选符合词义的图片卡。
3. 提交。

**界面关键点：** 词与播放控件位于图卡上方；2×2 图片网格兼有文字标签；顶部进度、底部继续清楚。标签本身也会提供答案线索。
**设计解读：** 图与标签同时提供支持；应与看图自由命名分开。
**推断边界：** 只证明在给定选项中辨认；还需要无选项提取验证。
**平台/课程：** 2021 官方论文 Figure 2 为历史证据；未据此断言所有当前课程仍出现同版。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://research.duolingo.com/papers/portnoff.edm21.pdf) · [来源2](https://www.apple.com/ca/newsroom/2023/06/apple-announces-winners-of-the-2023-apple-design-awards/)

![Apple 2023 发布的 Duolingo 词义选图界面](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/apple-2023-picture-selection.jpg)

图证：官方设备框内完整题页；2023-06-05；1306×1828。此例给西班牙语词，图片下用英语标签；与母语提示方向属于同一识别任务的方向变体。
[来源页面](https://www.apple.com/ca/newsroom/2023/06/apple-announces-winners-of-the-2023-apple-design-awards/) · [原始媒体](https://www.apple.com/newsroom/images/live-action/wwdc-2023/standard/ada/Apple-WWDC23-Design-Awards-Duolingo-230605_inline.jpg.large_2x.jpg)

### C02 · 语境词义辨认

分类：原子任务。
训练目标：在句子中理解新词。
输入 → 输出：目标语例句；突出标记的词；母语释义选项。 → 一个释义选项。

**用户操作**

1. 阅读例句，可播放音频。
2. 选出指定词在该语境中的意思。
3. 继续。

**界面关键点：** 目标词保留在句子语境中，下面排列文字候选；答题区与情境材料分开，能把注意力集中到词义。
**设计解读：** 同样是单选，但主要测语义理解，不是拼写或自由产出。
**推断边界：** 只证明在给定选项中辨认；还需要无选项提取验证。
**平台/课程：** 2024 官方题屏，文章 2026 仍可读取；例图英语学习者学法语。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/right-level-of-difficulty/)

![语境中的词义三选一。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/22ba00ee86-table1_image1.PNG)

图证：完整题目视口；媒体路径 2024-03；1170×2532。
[来源页面](https://blog.duolingo.com/right-level-of-difficulty/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2024/03/table1_image1.PNG)

### C03 · 双语词语配对

分类：原子任务。
训练目标：快速辨认两种语言的词义对应。
输入 → 输出：两列书面词语。 → 多组一一配对。

**用户操作**

1. 点一侧词语。
2. 点另一侧对应词。
3. 重复直到配完。

**界面关键点：** 两列词块并列，等高的按钮和统一描边让用户寻找跨列关系；选中与匹配结果应易于区分。
**设计解读：** 同一匹配机制可装入 Words 或 Match Madness；限时不是另一题型。
**推断边界：** 配对可能依赖排除法；可用新顺序、延迟复习或单项提取验证。
**平台/课程：** 2025 阅读总览展示英文/西文；2026 免费 Practice 公告仍展示词汇配对。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) · [来源2](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)

![双语词语两列配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/c013b16b02-image-2.png)

图证：完整题目视口；2025-02-10T13:00:00.000Z；752×1624。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) · [原始媒体](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+2.png)

### C04 · 图片/词义提示的单词翻译

分类：原子任务。
训练目标：从意思主动提取词汇及拼写。
输入 → 输出：物体图和母语词。 → 一个词或短语。

**用户操作**

1. 辨认提示含义。
2. 键入目标语词。
3. 提交。

**界面关键点：** 图片与母语词给出语义目标；输入区只有待写词，没有整句键入负担；按钮在底部。
**设计解读：** 这里不需要从图片选项辨认；图片与母语词共同提供语义提示。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2026 写作总览：英语提示、法语输出的完整例图。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)

![图片和母语词提示，键入目标语词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/5103296877-Writing-practice_type-vocabulary.png)

图证：完整题目视口；媒体路径 2026-06；2160×4342。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-vocabulary.png)

### C05 · 带冠词选择的单词翻译

分类：组合变体。
训练目标：把名词与语法性别/冠词一起回忆。
输入 → 输出：图片与母语名词；冠词按钮；词汇输入框。 → 离散冠词选择 + 名词文本。

**用户操作**

1. 选择目标语冠词。
2. 键入名词。
3. 提交组合答案。

**界面关键点：** 冠词是独立按钮，名词进入文本框；同一个词的两种成分以不同控件表达，便于定位错误。
**设计解读：** 属于 C04 的语法组合变体，不能据此将所有单词翻译都描述成带性别题。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2024 Duolingo 101 官方图：英文提示、西文输出；当前各课程覆盖未逐个验证。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)

![图片词汇翻译，同时选择冠词并填写名词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/official-101-04.png)

图证：完整题目视口；2024-12-02；750×1624。
[来源页面](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) · [原始媒体](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/6-exerciseTypes.png)

### C06 · 词块组句翻译

分类：原子任务。
训练目标：结合词义、语序与句法完成受支持的产出。
输入 → 输出：母语或目标语原句；乱序词块。 → 有序词块序列。

**用户操作**

1. 读原句。
2. 依次点选词块组成译文。
3. 必要时调整，再提交。

**界面关键点：** 角色气泡呈现原句，横线区域承接答案，候选词块在下方；已使用词块留下位置占位，便于撤回和查找。
**设计解读：** 翻译方向是训练参数；两个方向不是两个新控件。词库干扰词会改变难度。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2021 论文与 2022/2026 官方例图均有；键盘切换因题目和版本而异。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://research.duolingo.com/papers/portnoff.edm21.pdf) · [来源2](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/) · [来源3](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)

![整句翻译的词块输入模式。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/077e078943-Writing-practice_word-bank.png)

图证：完整题目视口；媒体路径 2026-06；2160×4342。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_word-bank.png)

![用户此前提供的真实深色界面](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-translation-word-bank.jpg)

图证：用户历史截图；完整设备视口；拍摄日期未确认；1260×2720。2026-09-06 前后保存；实际拍摄日期、设备和应用版本未确认。

### C07 · 整句自由翻译

分类：原子任务。
训练目标：独立组织译文并检索拼写。
输入 → 输出：另一种语言的句子；空白输入框。 → 完整自由文本译文。

**用户操作**

1. 读原句。
2. 自行输入整句译文。
3. 检查后提交。

**界面关键点：** 大文本框给整句生成留空间；键入与语音输入入口分开。自由输入要保留修改位置，避免反馈时丢失原答案。
**设计解读：** 比词块方式少了识别支架；合理译法可不止一种，词块仅显示一种组合不代表唯一译法。
**推断边界：** 需区分语言错误、可接受译法和输入失误。
**平台/课程：** 2020 输入切换说明、2021 论文、2026 题屏均确认；旧文中等级 2 以上不是当前全平台保证。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) · [来源2](https://blog.duolingo.com/is-google-translate-wrong/) · [来源3](https://research.duolingo.com/papers/portnoff.edm21.pdf) · [来源4](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)

![同句翻译的自由输入模式，兼有语音输入按钮。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/05c28e5122-Writing-practice_type-answer.png)

图证：完整题目视口；媒体路径 2026-06；2160×4342。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-answer.png)

![用户此前提供的真实深色界面](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-translation-free-input.jpg)

图证：用户历史截图；完整设备视口；拍摄日期未确认；1260×2720。2026-09-06 前后保存；实际拍摄日期、设备和应用版本未确认。

### C08 · 补全部分翻译

分类：原子任务。
训练目标：把注意力集中在特定词或句法成分。
输入 → 输出：母语原句；已填写一部分的目标语译文。 → 单词或短语文本。

**用户操作**

1. 对照原句与译文。
2. 在空白处补所缺成分。
3. 提交。

**界面关键点：** 原文和部分译文同时可见；已给文本固定，待填位置明确，让用户只处理缺失部分。
**设计解读：** 原文提供翻译约束，不能与只凭单语语境填空合并描述。
**推断边界：** 需区分语言错误、可接受译法和输入失误。
**平台/课程：** 2022 官方三屏示例与 2026 葡语例图。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/) · [来源2](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)

![母语整句加目标语部分译文，补缺词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/226ce01251-Writing-practice_fill-in-the-blank.png)

图证：完整题目视口；媒体路径 2026-06；2160×4342。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_fill-in-the-blank.png)

![用户此前提供的真实深色界面](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-supported-translation.jpg)

图证：用户历史截图；完整设备视口；拍摄日期未确认；1260×2720。2026-09-06 前后保存；实际拍摄日期、设备和应用版本未确认。

## 语法与句子构建


### C09 · 单语语境选词填空

分类：原子任务。
训练目标：依据句意及语法选出合适词。
输入 → 输出：目标语有缺词句子；若干书面候选词。 → 一个选项填入空白。

**用户操作**

1. 读句子。
2. 选择能使句子成立的词。
3. 继续/提交。

**界面关键点：** 句子里的空位与独立候选对应；正确反馈保留完整句义，帮助确认所选词在句中的作用。
**设计解读：** 排除项应围绕词义或语法目标；不能仅凭图片外观猜答案。
**推断边界：** 局部答对不能证明整句可独立生成；提示撤除后应再验收。
**平台/课程：** 2025 阅读总览的法语完整例图；文章于 2026 更新。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/)

![全目标语句子语境选缺词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/46a924a446-image-1.png)

图证：完整题目视口；2025-02-10T13:00:00.000Z；750×1624。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) · [原始媒体](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+1.png)

![用户此前提供的真实深色界面](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-cloze-correct-feedback.jpg)

图证：用户历史截图；完整设备视口；拍摄日期未确认；1260×2720。2026-09-06 前后保存；实际拍摄日期、设备和应用版本未确认。

### C10 · 场景图片辅助的单语填空

分类：情境变体。
训练目标：把场景意义直接连接到目标语。
输入 → 输出：人物/物品情境图；目标语缺词句；词块。 → 补完目标语句子。

**用户操作**

1. 观察情境。
2. 结合句子选择适当词块。
3. 提交。

**界面关键点：** 场景图位于句子上方；必须从动作或关系理解图意。下面仍用填空和词块，降低新增操作成本。
**设计解读：** 图片是理解线索，不是装饰；交互沿用填空。
**推断边界：** 局部答对不能证明整句可独立生成；提示撤除后应再验收。
**平台/课程：** 2021 沉浸式发布文说明当时覆盖英文学西/法，以及西/葡文学英语的 iOS、Android、web；该矩阵只适用于当时。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/)

![图像场景辅助单语句子填空；已选答案状态。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/af6666e8dd-Blog_Monolingual-Challenges_1.png)

图证：完整题目视口；媒体路径 2021-04；375×667。
[来源页面](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/04/Blog_Monolingual-Challenges_1.png)

### C11 · 对比双空填词

分类：结构变体。
训练目标：区分近义词用法或成对语法概念。
输入 → 输出：相邻两句/两个空；候选词。 → 两个位置的选词结果。

**用户操作**

1. 读两个语境。
2. 把相应选项分别填入两处。
3. 提交。

**界面关键点：** 两个空位放在相邻句中，用户可并置比较；候选词集中在下方，减少来回翻页。
**设计解读：** 多空让对比关系可见；不应把空的数量单独算作新题型。
**推断边界：** 局部答对不能证明整句可独立生成；提示撤除后应再验收。
**平台/课程：** 2020 法语 Grammar Lessons 完整历史例图。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/)

![两个相邻语境的对比双空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/ec0d9bab34-GS-Blog-5.png)

图证：完整题目视口；媒体路径 2020-10；375×667。
[来源页面](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-5.png)

### C12 · 点选词尾

分类：原子任务。
训练目标：辨别词干与正确变位结尾。
输入 → 输出：句子中的固定词干；候选词尾。 → 词尾选项。

**用户操作**

1. 识别人称/语境。
2. 点选适用词尾接在词干后。
3. 提交。

**界面关键点：** 已给词干与可拼接词尾分开；控件在视觉上暗示组合关系，练习粒度精确到词素。
**设计解读：** 把练习粒度缩至词素，区别于整词填空；拼接造型提示组合关系。
**推断边界：** 局部答对不能证明整句可独立生成；提示撤除后应再验收。
**平台/课程：** 2020 法语语法专课，2022 西语 gustar 官方示例也确认同机制。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) · [来源2](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/)

![词干已给，点选正确词尾。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/1883621fd9-GS-Blog-7.png)

图证：完整题目视口；媒体路径 2020-10；375×667。
[来源页面](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-7.png)

### C13 · 键入词尾

分类：输入方式变体。
训练目标：主动回忆变位词尾。
输入 → 输出：固定词干与词尾空位，无候选列表。 → 词尾文本。

**用户操作**

1. 读语境。
2. 输入缺少的词尾。
3. 提交。

**界面关键点：** 文字输入只对准词尾，保留其余句子；撤去候选支持，但没有增加整句打字负担。
**设计解读：** 与 C12 的知识目标相同，但去掉候选支持。
**推断边界：** 局部答对不能证明整句可独立生成；提示撤除后应再验收。
**平台/课程：** 2020 法语语法专课历史例图；现行课程分布未确认。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/)

![词干已给，键入词尾。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/d3b15da310-GS-Blog-8.png)

图证：完整题目视口；媒体路径 2020-10；375×667。
[来源页面](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-8.png)

### C14 · 语法范式表格补全

分类：原子任务。
训练目标：对比同一语法规则的不同形式。
输入 → 输出：带行列标题的代词/动词表、示例形式与空格。 → 多个表格单元的词形。

**用户操作**

1. 读表中已有形式。
2. 把对应词尾填入尚空的位置。
3. 检查各行后提交。

**界面关键点：** 代词与变化形式以表格对应；空格位置表达待补关系，规则不必全靠长段文字解释。
**设计解读：** 表格把形式间的规律并置；当前证据只确认图中点选补表，不能延伸为所有版本都可键入整表。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2020 法语语法专课历史图；2021 西语指南也展示表格练习。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) · [来源2](https://blog.duolingo.com/tips-for-learning-spanish-on-duolingo/)

![代词和动词词尾表格补全。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/6c435f85e6-GS-Blog-4.png)

图证：完整题目视口；媒体路径 2020-10；375×667。
[来源页面](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-4.png)

## 听力与听写


### C15 · 词块听写/听后重组

分类：原子任务。
训练目标：识别语流中的词和顺序。
输入 → 输出：句子音频；正常/慢速播放；书面词块。 → 与音频对应的词块序列。

**用户操作**

1. 听音频，可重播或慢放。
2. 按听到顺序点选词块。
3. 提交。

**界面关键点：** 普通速度与慢速两个音频入口；答案横线与候选词分区；没有把完整听力文本直接给出。
**设计解读：** 要求还原原句；不是翻译，也不是听后概括意义。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2026 官方听力总览有 Android 完整界面。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) · [来源2](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)

![听句子后按顺序点词块，含正常/慢速播放。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/52a53553f1-Practice-tab-3.jpg)

图证：完整题目视口；媒体路径 2026-04；1080×2400。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Practice-tab-3.jpg)

### C16 · 整句自由听写

分类：原子任务。
训练目标：把听到的语流转为完整书面形式。
输入 → 输出：句子音频；文本输入。 → 整句转写文本。

**用户操作**

1. 听句子。
2. 自由输入听到的全部句子。
3. 提交。

**界面关键点：** 音频控件和大文本框构成主体；无词库，保留慢速及无法听音入口；完整顶部和底部操作均可见。
**设计解读：** 没有词库提示；与只补一个缺词的 C17 不同。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2018 官方 placement 与 2026 写作总览文字确认；补充 2020 官方历史完整听写题图。该旧图不能证明2026所有课程仍用同一界面。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/partial-credit-improvements-to-duolingos-placement-test/) · [来源2](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)

![整句自由听写；大文本框、双速音频、无法听音入口、Check。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/official-2020-listening-free-type.png)

图证：完整题目视口；媒体路径 2020-10；750×1334。2020 历史界面；不要宣称为2026现行截图。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/Listening_2_No-text.png)

### C17 · 局部听写：键入缺词

分类：原子任务。
训练目标：聚焦音形对应及目标词拼写。
输入 → 输出：音频 + 已给部分句子 + 一个空。 → 一个词或指定片段。

**用户操作**

1. 听句子。
2. 在空格里输入听到的缺词。
3. 提交。

**界面关键点：** 播放控件旁保留已有句子，只空出目标词；常速/慢速可用，降低对整句短时记忆的要求。
**设计解读：** 保留上下文降低工作记忆负担；正常/慢速播放是支架参数。
**推断边界：** 局部答对不能证明整句可独立生成；提示撤除后应再验收。
**平台/课程：** 2026 官方德语题屏，另有葡语例图。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) · [来源2](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)

![音频和部分句子提示，键入缺词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/8d818c0555-Listening-exercise-3.jpg)

图证：完整题目视口；媒体路径 2026-04；1080×2400。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-3.jpg)

### C18 · 听句中缺词，选择声音答案

分类：原子任务。
训练目标：区分相近音并识别目标词。
输入 → 输出：可播放句子、句中空位、两个声音选项。 → 一个音频选项。

**用户操作**

1. 听句子。
2. 试听候选音频。
3. 选出缺词对应的声音，再提交。

**界面关键点：** 候选项用音频控件表达，学习者必须比较声音；截图里不是两个可直接读出的文字答案。
**设计解读：** 候选项不直接展示词形；与书面候选的听词辨认分开。
**推断边界：** 局部答对不能证明整句可独立生成；提示撤除后应再验收。
**平台/课程：** 2022 内容制作说明及 2026 听力总览均确认。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/) · [来源2](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/)

![两个声音选项，选出句中缺词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/88bcb53eec-Listening-exercise-2.jpg)

图证：完整题目视口；媒体路径 2026-04；1080×2400。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-2.jpg)

### C19 · 声音与词语配对

分类：原子任务。
训练目标：建立听觉形式与书面词/意义的联系。
输入 → 输出：一列音频按钮，一列书面词语。 → 多组声音—书面词对应。

**用户操作**

1. 点音频试听。
2. 选择对应词语。
3. 完成其余配对。

**界面关键点：** 左列是音频波形，右列是书面词；每行面积相近，提示建立一一对应关系。
**设计解读：** 界面相似并不表示所有课程都在做翻译；需按音频语言与书面列判断是音形匹配还是跨语言匹配。
**推断边界：** 配对可能依赖排除法；可用新顺序、延迟复习或单项提取验证。
**平台/课程：** 2026 官方听力总览完整题屏；音频内容未在本次播放核听，故不推断其语言。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/)

![声音按钮与书面词语配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/a202bd8b53-Listening-exercise-1.jpg)

图证：完整题目视口；媒体路径 2026-04；1080×2400。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-1.jpg)

### C21 · 听后理解并选答

分类：原子任务。
训练目标：理解语段意义而非逐字复写。
输入 → 输出：音频问题/语段；提示短语；声音或文字候选。 → 一个理解答案。

**用户操作**

1. 听主要语段。
2. 试听或阅读答案选项。
3. 选出符合意义的一项。

**界面关键点：** 材料和答项都有播放入口；此例把答案阅读提示也撤去，区别于“听完选文字”。
**设计解读：** 2026 官方完整图的选项也使用音频，不宜统一画成文字单选。
**推断边界：** 要区分听辨、短时记忆和拼写负担；记录是否用过慢速和重播。
**平台/课程：** 2019/2022 官方已有听段落回答问题；2026 Practice 公告给出实际完整图。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/how-weve-improved-the-duolingo-learning-experience-this-year-and-a-sneak-peek-toward-2020/) · [来源2](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/) · [来源3](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)

![听后理解题；本图的两个答案选项也是音频。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/ad9d29a63c-listening.png)

图证：完整题目视口；媒体路径 2026-02；758×1632。
[来源页面](https://blog.duolingo.com/guide-to-duolingo-practice-hub/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/listening.png)

## 阅读、对话与口语


### C20 · 段落阅读理解

分类：原子任务。
训练目标：提取段落事实、关系或合理推断。
输入 → 输出：目标语短文；问题/待补完的陈述；候选答案。 → 意义层面的答案选择。

**用户操作**

1. 阅读段落。
2. 判断哪项回答与文章一致。
3. 选择并继续。

**界面关键点：** 段落保持可读，理解问题与选项排列在其下；用户需要提取意思，不必逐字翻译。
**设计解读：** 不要求逐字翻译；问题可以通过句子补完表现。
**推断边界：** 选项识别与开放复述要求不同；需避免靠单个关键词完成。
**平台/课程：** 2019 试点、2021 沉浸式课与 2025 阅读总览均记录；具体课程覆盖依时代不同。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/how-weve-improved-the-duolingo-learning-experience-this-year-and-a-sneak-peek-toward-2020/) · [来源2](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/) · [来源3](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/)

![阅读目标语段落并选择符合意义的答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/af09f6cf89-image-3.png)

图证：完整题目视口；2025-02-10T13:00:00.000Z；750×1624。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) · [原始媒体](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+3.png)

### C22 · 选择下一句对话

分类：原子任务。
训练目标：理解上下文并选择合适的交际回应。
输入 → 输出：前一句对话；空白回应气泡；候选文本。 → 一个书面回应选项。

**用户操作**

1. 阅读/听前句。
2. 判断合适的下一句。
3. 点选并提交。

**界面关键点：** 两个说话者和气泡明确轮次；两项回应放在下方，交互只需点选，重点是对话连贯。
**设计解读：** 考语用和对话连贯性；不能只看关键词相同。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2023 官方英语学习文章给出葡语界面、英语内容的完整图。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/why-learn-english/)

![对话下一句二选一；葡语界面、英语内容。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/c1866eb0b7-EN-PT_2.png)

图证：完整题目视口；媒体路径 2022-12；1080×2400。
[来源页面](https://blog.duolingo.com/why-learn-english/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/12/EN-PT_2.png)

### C23 · 选择合适回应并说出来

分类：原子任务。
训练目标：结合理解与受约束口语产出。
输入 → 输出：问题气泡；若干完整回应及麦克风。 → 给定候选中的口头句子。

**用户操作**

1. 理解问题。
2. 选定适合的回应。
3. 对麦克风说出该回应。

**界面关键点：** 问题气泡下列三个带麦克风的回应；选义与发声结合；保留无法说话入口和检查区。
**设计解读：** 既要判断意义，也要说出来；仍是有答案范围的对话，不能称开放 AI 会话。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2021 沉浸式例图、2026 speaking 总览法语例图均确认。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/) · [来源2](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/)

![理解问题后，说出三个候选回答中的正确一句。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/d00d56c773-speaking_image2.png)

图证：完整题目视口；媒体路径 2026-02；750×1624。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image2.png)

### C24 · 给定句子朗读/跟读

分类：原子任务。
训练目标：练习发音、节奏与完整句表达。
输入 → 输出：给定句子文字及可播放示范；麦克风。 → 录音/语音识别结果。

**用户操作**

1. 听示范或读句子。
2. 点击麦克风。
3. 按给定内容说出句子。

**界面关键点：** 目标句与麦克风同屏；内容已给定，学习者集中练习发声。不同角色位置不改变核心任务。
**设计解读：** 产出内容已给出；不应把答对等同于自发说话能力。角色居中版仍是此任务。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2026 speaking 总览及免费 Practice 专项公告展示两种版式。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/) · [来源2](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)

![照给定句子开口朗读。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/26b3869c64-speaking_image1.png)

图证：完整题目视口；媒体路径 2026-02；752×1624。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image1.png)

![角色居中版本的跟读界面。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/194b975af3-speaking.png)

图证：完整题目视口；媒体路径 2026-02；758×1632。
[来源页面](https://blog.duolingo.com/guide-to-duolingo-practice-hub/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking.png)

### C25 · 复述已给定的对话回应

分类：情境变体。
训练目标：在对话脉络里练习一句回应的发音。
输入 → 输出：角色问题 + 已提供的回答文本/音频。 → 给定回应的口头复述。

**用户操作**

1. 理解问题和范例回答。
2. 开启麦克风。
3. 复述指定回答。

**界面关键点：** 两个角色已给出问答；下方麦克风引导复述回应，免去从多种回答中做语义选择。
**设计解读：** 与 C23 区别是不用在多个答案中选择；与 C24 相同的跟读核心操作。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2026 speaking 总览的法语完整例图。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/)

![两个角色的对话，复述已给定的回应。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/f4af9add6f-speaking_image3.png)

图证：完整题目视口；媒体路径 2026-02；750×1624。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image3.png)

### C26 · 以语音输入完成翻译

分类：输入方式变体。
训练目标：在翻译任务中增加口头检索。
输入 → 输出：原句、译文输入框和语音输入按钮。 → 由语音转写的译文文本。

**用户操作**

1. 点语音输入。
2. 口头说出译文。
3. 查看转写，必要时编辑后提交。

**界面关键点：** 翻译文本框内或旁边的麦克风把语音转成可编辑文本；仍应核对识别结果，再提交翻译答案。
**设计解读：** 这是输入方式变体；与照给定答案朗读的评分任务不同。
**推断边界：** 需区分语言错误、可接受译法和输入失误。
**平台/课程：** 2023 专项文章说明可编辑转写；2026 翻译题屏仍展示语音输入入口。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/sneaky-pronunciation-practice/) · [来源2](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/) · [来源3](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)

![同句翻译的自由输入模式，兼有语音输入按钮。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/05c28e5122-Writing-practice_type-answer.png)

图证：完整题目视口；媒体路径 2026-06；2160×4342。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-answer.png)

## 主动回忆与声音专项


### C27 · Flashcards 主动回忆卡组

分类：微练习循环。
训练目标：不看候选项，从记忆中提取目标词。
输入 → 输出：母语词卡；默认麦克风，允许文字替代。 → 逐卡的口头/文字译词与一组反馈。

**用户操作**

1. 看词卡后说出译词，或切换键入。
2. 对词通过；错误时看/听答案。
3. 错卡回到卡组后方再次练习。

**界面关键点：** 堆叠卡片突出当前词；底部麦克风、跳过、无法说话入口减少切换；卡组完成后的回顾独立呈现。
**设计解读：** 原子任务是短词翻译；卡组、翻面纠正和重试构成独特练习循环。2025 公告为5张卡、答对3张可过。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2025-11 发布；2025 年度回顾说已覆盖前8种学习语言；未列出所有源语言/设备组合。
**套餐：** 官方说明出现在普通 lessons 中；未声明 Super/Max 独占。
[来源1](https://blog.duolingo.com/duolingo-flashcards/) · [来源2](https://blog.duolingo.com/product-highlights/)

![单词卡片主动回忆；底部是麦克风、跳过和无法说话入口。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/1184b25055-Writing-practice_flashcards.png)

图证：完整题目视口；媒体路径 2026-06；2160×4342。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_flashcards.png)

### C28 · 最小对立/近音词辨认

分类：原子任务。
训练目标：听出具有辨义作用的细微语音差异。
输入 → 输出：一个音频；两个相近拼写的词。 → 一个词选项。

**用户操作**

1. 听词。
2. 选出对应书面词。
3. 提交。

**界面关键点：** 大音频按钮与两个近音词相邻；候选少，视觉很简单，难点被集中在声音差异上。
**设计解读：** 是纯辨音，不需要语篇理解；可与 C18 的句中缺词声音候选区别。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2024 英语 Sounds 专项官方图，iOS 题屏；不能由图推断当前 web/所有源语言覆盖。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/duolingo-english-sounds-tab/)

![声音近似词二选一，已选答案状态。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/f6eed61af4-IMG_3253.PNG)

图证：完整题目视口；2024-11-20T13:00:06.000Z；1170×2532。
[来源页面](https://blog.duolingo.com/duolingo-english-sounds-tab/) · [原始媒体](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3253.PNG)

### C29 · 两段声音相同/不同判断

分类：原子任务。
训练目标：脱离具体字形，判断两段音是否同一词。
输入 → 输出：两个音频；相同/不同两个判断选项。 → 二元声音关系判断。

**用户操作**

1. 分别听两段声音。
2. 判断同词还是不同词。
3. 选择并继续。

**界面关键点：** 两段音频上下并列，下方只有“同词/不同词”两种关系；不要求先拼出所听单词。
**设计解读：** 比较两刺激的关系，和为一个刺激命名不是同一认知任务。
**推断边界：** 单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**平台/课程：** 2024 英语 Sounds 专项官方完整图。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/duolingo-english-sounds-tab/)

![两段声音判断同一词/不同词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/6023c5837b-IMG_3254.PNG)

图证：完整题目视口；2024-11-20T13:00:06.000Z；1170×2532。
[来源页面](https://blog.duolingo.com/duolingo-english-sounds-tab/) · [原始媒体](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3254.PNG)

### C30 · 近音词声音—文字配对

分类：内容变体。
训练目标：把一组相近词的音形关系反复对照。
输入 → 输出：多段音频与多条近音词。 → 声音—词语配对组。

**用户操作**

1. 试听音频。
2. 匹配对应词形。
3. 配完该组。

**界面关键点：** 四段音频与四个近音词配对；补充韩文界面的官方全屏图，能看到顶部进度和底部继续。
**设计解读：** 原子交互与 C19 相同；特殊之处是选词围绕近音对比。
**推断边界：** 配对可能依赖排除法；可用新顺序、延迟复习或单项提取验证。
**平台/课程：** 2024 英语 Sounds 官方完整图展示四组。
**套餐：** 常规语言学习课内容；本条无付费独占证据。订阅不保证每课程每平台都有该题。
[来源1](https://blog.duolingo.com/duolingo-english-sounds-tab/) · [来源2](https://blog.duolingo.com/ko/practice-english-sounds/)

![韩文界面的英语近音词配对；上下操作区完整](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/official-sounds-match-ko.png)

图证：完整题目视口；媒体路径 2025-04；1170×2532。
[来源页面](https://blog.duolingo.com/ko/practice-english-sounds/) · [原始媒体](https://blog.duolingo.com/content/images/2025/04/ko-img5.PNG)

## 文字系统与识读


### W01 · 假名按路径描写

分类：文字学习任务/语言变体。
训练目标：建立字形及笔画动作的联系。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 观察淡色轮廓与起笔点。
2. 沿蓝色路径描写。
3. 完成后按底部继续。

**界面关键点：** 大书写区、十字参考线、起笔圆点和箭头协同提示方向。
**设计解读：** 把复杂字形拆成当前一笔，减少初学者同时处理的内容。
**推断边界：** 只证明有引导的描写，不能等同无提示默写。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/learning-to-read-japanese-characters/)

![平假名描写：す](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/b90f15e140-hiragana_tracing.PNG)

图证：完整题目视口；媒体路径 2023-09；750×1334。字形浅灰；蓝色起笔点、虚线与箭头；十字定位线。
[来源页面](https://blog.duolingo.com/learning-to-read-japanese-characters/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/hiragana_tracing.PNG)

### W02 · 根据转写选择假名组合

分类：文字学习任务/语言变体。
训练目标：把罗马音提示映射到假名字形。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 阅读转写提示。
2. 比较四个假名组合。
3. 点选后检查并继续。

**界面关键点：** 转写在题干中，四组字符独立成卡；题干实际要求按 shisu 选字。
**设计解读：** 相近字符成为比较对象，操作者只需选择，难点留给字形辨认。
**推断边界：** 不能把本图误写成“听音选字”；是否播放需看具体题面。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/learning-to-read-japanese-characters/)

![按 shisu 选择假名组合](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/9a0ac120ee-hiragana_sound.PNG)

图证：完整题目视口；媒体路径 2023-09；750×1334。文件名带 sound，但题面是罗马字提示、四张双假名卡，不能标成看字选读音。
[来源页面](https://blog.duolingo.com/learning-to-read-japanese-characters/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/hiragana_sound.PNG)

### W03 · 看假名选择读音

分类：文字学习任务/语言变体。
训练目标：从文字提取读音。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 看目标假名。
2. 需要时点音频。
3. 选择读音选项并继续。

**界面关键点：** 大假名音频卡是视觉锚点，三个罗马音选项在下方。
**设计解读：** 与 W02 的方向相反；检查从字到音的映射。
**推断边界：** 有音频提示时，答案不能单独证明无提示识读。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)

![平假名あ：选择读音](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/official-101-10.png)

图证：完整题目视口；2024-12-02；752×1624。大蓝字音卡；三条纵排读音选项。
[来源页面](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) · [原始媒体](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/12-characterBingo2.png)

### W04 · 补全假名缺失笔画

分类：文字学习任务/语言变体。
训练目标：识别字形中缺少的部分并补写。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 观察已有字形和缺口。
2. 沿当前笔画指引绘制。
3. 完成后继续。

**界面关键点：** 保留字形背景，缺笔画的方向用虚线和箭头标记。
**设计解读：** 缩小生成范围，连接识别与运动产出。
**推断边界：** 本图是平假名あ，不是汉字题，也不是笔顺排序题。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)

![平假名あ：补缺笔画](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/official-101-12.png)

图证：完整题目视口；2024-12-02；750×1624。图中对象是平假名あ；不能标汉字补笔画。
[来源页面](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) · [原始媒体](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/14-characterBingo.png)

### W05 · 汉字描写与局部补写

分类：文字学习任务/语言变体。
训练目标：通过逐步减少字形支架练习书写。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 阅读词语和目标汉字。
2. 按当前提示描写或补足缺失部件。
3. 观察结果后继续下一题。

**界面关键点：** 字形占据主体；词语中的目标字被突出，描写区有定位线、指引和底部反馈。
**设计解读：** 保留完整词语使汉字与词义相连；支架量改变所需提取程度。
**推断边界：** 所附静帧证明引导描写和局部补写；未取得独立“完全无引导整字默写”题屏。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/learning-to-read-japanese-characters/)

![官方动图第430帧：描写任务](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/frame-kanji-430.png)

图证：官方原始动图静帧；完整题目视口；2023-09 官方动图；375×667。未裁剪、未重绘；源动图另存。
[来源页面](https://blog.duolingo.com/learning-to-read-japanese-characters/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/scaffolded_trace_small.gif)

![官方动图第523帧：局部补写](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/frame-30b2a7e5fa-scaffolded_trace_small-523.png)

图证：官方原始动图静帧；完整题目视口；2023-09 官方动图；375×667。2023 官方日语字符文章中的原动图。
[来源页面](https://blog.duolingo.com/learning-to-read-japanese-characters/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/scaffolded_trace_small.gif)

### W06 · 日语汉字部件拼合

分类：文字学习任务/语言变体。
训练目标：理解汉字部件及空间结构。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 看目标词和空槽。
2. 选择对应部件，按槽位组合。
3. 完成后继续。

**界面关键点：** 大轮廓槽与部件卡一一对应；蓝色当前槽提示本次放置位置。
**设计解读：** 把字形分解成可组合单元，避免从整张复杂图中盲目辨认。
**推断边界：** 图示为日语汉字“画”，不能当作中文或韩文课程证据。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) · [来源2](https://blog.duolingo.com/learning-to-read-japanese-characters/)

![日语汉字部件拼合：画](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/official-101-11.png)

图证：完整题目视口；2024-12-02；750×1624。提示关联 painter；目标轮廓与两块部件。是日语汉字，不能因另一篇 alt 错写 Hangeul 而标成韩文。
[来源页面](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) · [原始媒体](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/13-characterBingo.png)

![官方动图第75帧：汉字的部件槽位](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/frame-ff1a8234c0-puzzle_output-1-75.png)

图证：官方原始动图静帧；完整题目视口；2023-09 官方动图；750×1334。
[来源页面](https://blog.duolingo.com/learning-to-read-japanese-characters/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/puzzle_output-1.gif)

### W07 · 看汉字选择拼音

分类：文字学习任务/语言变体。
训练目标：建立汉字与音节读法的对应。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 看汉字。
2. 比较拼音选项。
3. 选择读音并检查。

**界面关键点：** 字符被放大，转写选项集中；选项和目标字不混在一段长句里。
**设计解读：** 将识读任务与句义理解分开，先建立基本映射。
**推断边界：** 2020 历史界面；不证明当前所有中文课程保留同版。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/)

![汉字选择拼音：功](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/ff7c59ad81-char_intro.jpg)

图证：完整题目视口；媒体路径 2020-02；1080×1851。蓝色功字音频卡，底部三张带声调拼音选项。2020 年界面。
[来源页面](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/02/char_intro.jpg)

### W08 · 汉字与拼音配对

分类：文字学习任务/语言变体。
训练目标：把多个字与各自读音关联。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 阅读字符和拼音块。
2. 依次点选对应关系。
3. 配完全部后继续。

**界面关键点：** 字符和拼音混排为短按钮，匹配双方并非严格左右两列。
**设计解读：** 通过多项对应重复提取；随机位置避免仅记住按钮坐标。
**推断边界：** 随机化是设计建议，本轮未验证后台排序逻辑。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/)

![汉字与拼音配对](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/795780a2b3-character_match.jpg)

图证：完整题目视口；媒体路径 2020-02；1080×1855。汉字/词与拼音混排成两行小卡，不是左右双列布局。2020 年界面。
[来源页面](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/02/character_match.jpg)

### W09 · 韩文音节块组装

分类：文字学习任务/语言变体。
训练目标：理解音节由字母部件构成。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 观察目标音节及槽位。
2. 选取字母部件组装。
3. 完成后继续。

**界面关键点：** 大音节结构框与小字母候选分离；空间组合本身承载教学信息。
**设计解读：** 同是拼合，学习对象是韩文音节结构，不能沿用汉字教学解释。
**推断边界：** 只证明该示例构字操作，未核实所有韩文组合规则的覆盖。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/learning-other-writing-systems/)

![韩文音节拼合：한](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/b7ea2c2fb6-Korean-3-1.png)

图证：完整题目视口；媒体路径 2021-07；562×1001。han 音频；ㅎ、ㅏ 已在上方，ㄴ 待放入底部蓝色目标；音节块布局。
[来源页面](https://blog.duolingo.com/learning-other-writing-systems/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Korean-3-1.png)

### W10 · 阿拉伯字母描写

分类：文字学习任务/语言变体。
训练目标：练习字母形状及书写动作。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 看目标字母与位置形式。
2. 沿引导路径描写。
3. 完成后继续。

**界面关键点：** 大描写区保留起点与方向；字形细节是学习材料，不能任意美术化。
**设计解读：** 隔离字形学习困难，再将字母放回词中理解。
**推断边界：** 未实测笔顺、轨迹容差和位置字形判分规则。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/learning-other-writing-systems/)

![阿拉伯字母描写：ت](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/2cab7c8d52-Arabic-2-1.png)

图证：完整题目视口；媒体路径 2021-07；562×1001。字音按钮、灰色字形与十字线；蓝色路径由右向左弯行。
[来源页面](https://blog.duolingo.com/learning-other-writing-systems/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Arabic-2-1.png)

### W11 · 按转写选择天城文字母

分类：文字学习任务/语言变体。
训练目标：将转写与天城文字形对应。
输入 → 输出：字形、读音或转写及必要的结构提示。 → 选择、配对、部件组装或手写轨迹。

**用户操作**

1. 阅读 ka 等提示。
2. 比较四个字符。
3. 点选并检查。

**界面关键点：** 真实题面是2×2共四个选项；不能把文章替代文字误读成4×4。
**设计解读：** 候选数量少，保留足够字形尺度来比较关键笔画。
**推断边界：** 此图是印地语实例，不代表所有天城文字母练习。
**平台/课程：** 官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。
**套餐：** 来源未标为 Super/Max 独占；不能由此保证全部账号均可见。
[来源1](https://blog.duolingo.com/learning-other-writing-systems/)

![印地语按 ka 选字符](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/6991adc1ae-image--2-.png)

图证：完整题目视口；媒体路径 2022-04；562×1116。2×2 四张大字形卡；官方 alt 把四选项误写成 4×4，按像素采用 2×2。
[来源页面](https://blog.duolingo.com/learning-other-writing-systems/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/04/image--2-.png)

### W12 · 韩语听音选词

分类：声音任务的语言/单位变体。
训练目标：把听到的韩语词与书面形式对应。
输入 → 输出：音频与候选韩语词或音节块。 → 一个词，或一串按顺序排列的音节块。

**用户操作**

1. 播放音频。
2. 选词题点选听到的词；重组题按顺序点选音节块。
3. 检查答案，查看结果后继续。

**界面关键点：** 大播放按钮下四个韩语词；每个词含音节块，不能误写成四个单字母。
**设计解读：** 选词任务连接整词的声音与字形；重组任务将书面输出拆成音节块，改变用户需要处理的单位。
**推断边界：** 与听辨和 C15 听写的核心操作相通；这里单列语言/单位变体，不计作新的独立机制。
**平台/课程：** 2026 官方听力文章截图，未验证全账号当前覆盖。
**套餐：** 课程内文字与听力练习。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/)

![韩语听音选词：官方韩语示例](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/12feca5e9d-Character-Bingo-1.jpg)

图证：完整题目视口；媒体路径 2026-04；1080×2400。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Character-Bingo-1.jpg)

### W13 · 听音用韩文字块重组

分类：声音任务的语言/单位变体。
训练目标：将听到的音串重建为文字序列。
输入 → 输出：音频与候选韩语词或音节块。 → 一个词，或一串按顺序排列的音节块。

**用户操作**

1. 播放音频。
2. 选词题点选听到的词；重组题按顺序点选音节块。
3. 检查答案，查看结果后继续。

**界面关键点：** 常速/慢速播放，答案位置与韩文字块分区；第三张展示正确反馈。
**设计解读：** 选词任务连接整词的声音与字形；重组任务将书面输出拆成音节块，改变用户需要处理的单位。
**推断边界：** 与听辨和 C15 听写的核心操作相通；这里单列语言/单位变体，不计作新的独立机制。
**平台/课程：** 2026 官方听力文章截图，未验证全账号当前覆盖。
**套餐：** 课程内文字与听力练习。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/)

![听音用韩文字块重组：官方韩语示例](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/730004abb2-Character-Bingo-2.jpg)

图证：完整题目视口；媒体路径 2026-04；1080×2400。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Character-Bingo-2.jpg)

![重组完成后的反馈状态](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/b0d5231807-Character-Bingo-3.jpg)

图证：完整题目视口；媒体路径 2026-04；1080×2400。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Character-Bingo-3.jpg)

## Stories 故事


### S01 · 故事理解单选

分类：情境交互。
训练目标：核验信息理解。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 阅读或听完当前故事段落。
2. 点选符合前文的答案。
3. 查看反馈，按继续进入下一段。

**界面关键点：** 退出、进度、心；三项答案；底部绿色反馈和继续。
**设计解读：** 前文成为理解条件，答案需要与故事信息相符；选择题为叙事插入短检查。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** 历史资料确认Stories覆盖Web/iOS/Android；没有截至检索日逐课程×平台矩阵。 2025年总结称Stories增至100+课程的Score30–59；Radio新增内容覆盖top9学习语种，220+课程首次加入初级Radio。2026听力综述另列西/法/德/意/日/中/韩/葡，未完整枚举语言方向。
**套餐：** 免费课程内容；具体故事和Radio受课程与进度限制。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/)

![根据故事三选一理解，已显示正确结果。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/2b6cb1232d-IMG_3465.PNG)

图证：完整题目视口；媒体路径 2020-10；1242×2208。退出、进度、心；三项答案；底部绿色反馈和继续。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/IMG_3465.PNG)

### S02 · 故事听音词块补句/组句

分类：情境交互。
训练目标：连接连续语流与词序。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 播放当前角色的音频。
2. 按听到的顺序点选词块，补成当前句子。
3. 检查可见答案，并按继续推进故事。

**界面关键点：** 退出、进度、能量；音频；三个词块；底部继续。 退出、进度、心；故事音频；四个词块；底部继续。
**设计解读：** 把声音还原嵌入故事轮次，使听音与角色说话情境相连。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** 历史资料确认Stories覆盖Web/iOS/Android；没有截至检索日逐课程×平台矩阵。 2025年总结称Stories增至100+课程的Score30–59；Radio新增内容覆盖top9学习语种，220+课程首次加入初级Radio。2026听力综述另列西/法/德/意/日/中/韩/葡，未完整枚举语言方向。
**套餐：** 免费课程内容；具体故事和Radio受课程与进度限制。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [来源2](https://blog.duolingo.com/duolingo-stories-the-journey-to-android/)

![听故事中缺失的话，再依次选词补全。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/0d8d7d604e-Writing-practice_Story-1.png)

图证：完整题目视口；媒体路径 2026-06；2160×4342。退出、进度、能量；音频；三个词块；底部继续。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_Story-1.png)

![旧版故事听音词块组句。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/aa898e5320-stories-android-maria-2-2.png)

图证：完整题目视口；媒体路径 2020-02；1440×2616。退出、进度、心；故事音频；四个词块；底部继续。
[来源页面](https://blog.duolingo.com/duolingo-stories-the-journey-to-android/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/02/stories-android-maria-2-2.png)

### S03 · 故事语境选词填空

分类：情境交互。
训练目标：用上下文选择合理表达。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 阅读前后文及带空位的句子。
2. 把候选词填入对应空位。
3. 完成后按页面提示继续故事。

**界面关键点：** 退出、进度、能量；六个词块；底部继续。
**设计解读：** 保留前后文，要求在语篇约束下补充词语；与普通孤立填空相比，信息跨度更长。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** 历史资料确认Stories覆盖Web/iOS/Android；没有截至检索日逐课程×平台矩阵。 2025年总结称Stories增至100+课程的Score30–59；Radio新增内容覆盖top9学习语种，220+课程首次加入初级Radio。2026听力综述另列西/法/德/意/日/中/韩/葡，未完整枚举语言方向。
**套餐：** 免费课程内容；具体故事和Radio受课程与进度限制。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)

![结合上句语境为相邻两句各补一个词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/037f650712-Writing-practice_Story-2.png)

图证：完整题目视口；媒体路径 2026-06；2160×4342。退出、进度、能量；六个词块；底部继续。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_Story-2.png)

### S04 · 故事开放写作

分类：情境交互。
训练目标：从理解过渡到自由生成。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 阅读故事后的开放问题。
2. 点输入框，用目标语自行回答；示例提示10–60词。
3. 点检查提交，或使用画面提供的跳过入口。

**界面关键点：** 顶部退出、进度与能量；自由输入框；示例显示10–60词提示，以及跳过、检查。旧局部图不作本条完整图证据。
**设计解读：** 撤去有限候选，让学习者自行组织语言；字数提示把任务规模控制在可完成范围。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** 历史资料确认Stories覆盖Web/iOS/Android；没有截至检索日逐课程×平台矩阵。 2025年总结称Stories增至100+课程的Score30–59；Radio新增内容覆盖top9学习语种，220+课程首次加入初级Radio。2026听力综述另列西/法/德/意/日/中/韩/葡，未完整枚举语言方向。
**套餐：** 免费课程内容；具体故事和Radio受课程与进度限制。
[来源1](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [来源2](https://blog.duolingo.com/tips-to-improve-writing-skills/)

![回答故事问题的开放写作，示例含起始词、字数提示和奖励。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/6c5a0f8745-Writing-practice_Story-3.png)

图证：完整题目视口；媒体路径 2026-06；2160×4342。退出、进度、能量；输入框；10–60词提示；底部跳过和检查。
[来源页面](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_Story-3.png)

### S05 · 故事补选缺失短语

分类：历史题面补充/情境变体。
训练目标：在故事语境内检索和理解语言。
输入 → 输出：前文及当前句子。 → 短语、词块或配对。

**用户操作**

1. 读上下文，选能补进对话的短语。

**界面关键点：** 长条候选承载短语，空缺位保留在角色气泡中。
**设计解读：** 通过上下文限制选项，减少孤立猜词。
**推断边界：** 证明历史作答形式；当前保留情况未逐账号确认。
**平台/课程：** 作者历史实测，2021媒体；2024-03-03文章更新。
**套餐：** 当前套餐边界不由此图推断。
[来源1](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/)

![作者公开的历史实测图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/thirdparty-story-missing.png)

图证：第三方历史完整截图；媒体路径 2021-05；473×1024。2021 媒体；文章2024更新。未将其范围与付费说明当作现行规则。
[来源页面](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/) · [原始媒体](https://duoplanet.com/wp-content/uploads/2021/05/IMG_1184-473x1024.png)

### S06 · 故事句中点选指定词义

分类：历史题面补充/情境变体。
训练目标：在故事语境内检索和理解语言。
输入 → 输出：前文及当前句子。 → 短语、词块或配对。

**用户操作**

1. 读给定释义，在句中点选对应词块。

**界面关键点：** 候选嵌在完整句子里；保留语境。
**设计解读：** 把词义检索与实际语境连接。
**推断边界：** 证明历史作答形式；当前保留情况未逐账号确认。
**平台/课程：** 作者历史实测，2021媒体；2024-03-03文章更新。
**套餐：** 当前套餐边界不由此图推断。
[来源1](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/)

![作者公开的历史实测图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/thirdparty-story-meaning.png)

图证：第三方历史完整截图；媒体路径 2021-05；473×1024。2021 媒体；文章2024更新。未将其范围与付费说明当作现行规则。
[来源页面](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/) · [原始媒体](https://duoplanet.com/wp-content/uploads/2021/05/IMG_1188-473x1024.png)

### S07 · 故事选择接下来的内容

分类：历史题面补充/情境变体。
训练目标：在故事语境内检索和理解语言。
输入 → 输出：前文及当前句子。 → 短语、词块或配对。

**用户操作**

1. 结合前文选择接续内容，查看反馈后继续。

**界面关键点：** 所附是正确反馈态；不据此推定答前已经展示全文。
**设计解读：** 需要处理语篇连贯，而不仅是孤立词义。
**推断边界：** 证明历史作答形式；当前保留情况未逐账号确认。
**平台/课程：** 作者历史实测，2021媒体；2024-03-03文章更新。
**套餐：** 当前套餐边界不由此图推断。
[来源1](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/)

![作者公开的历史实测图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/thirdparty-story-next.png)

图证：第三方历史完整截图；媒体路径 2021-05；473×1024。2021 媒体；文章2024更新。未将其范围与付费说明当作现行规则。
[来源页面](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/) · [原始媒体](https://duoplanet.com/wp-content/uploads/2021/05/IMG_1191-473x1024.png)

### S08 · 故事结尾词语配对

分类：历史题面补充/情境变体。
训练目标：在故事语境内检索和理解语言。
输入 → 输出：前文及当前句子。 → 短语、词块或配对。

**用户操作**

1. 成对点选对应词语，配完后继续。

**界面关键点：** 短词块混排，复习本故事词汇。
**设计解读：** 用同一配对操作收束语境中的重点词。
**推断边界：** 证明历史作答形式；当前保留情况未逐账号确认。
**平台/课程：** 作者历史实测，2021媒体；2024-03-03文章更新。
**套餐：** 当前套餐边界不由此图推断。
[来源1](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/)

![作者公开的历史实测图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/thirdparty-story-pairs.png)

图证：第三方历史完整截图；媒体路径 2021-05；473×1024。2021 媒体；文章2024更新。未将其范围与付费说明当作现行规则。
[来源页面](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/) · [原始媒体](https://duoplanet.com/wp-content/uploads/2021/05/IMG_1194-473x1024.png)

## Radio 电台


### R01 · Radio听音选指定数量的词

分类：情境交互。
训练目标：辨认连续音频里的词。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 听当前电台片段，需要时点播放控件。
2. 从词块中选出题目指定数量。
3. 观察反馈并按后续提示推进；本轮未实测自动提交时序。

**界面关键点：** 状态栏、退出、进度、心；音频；词块选中态；底部系统条。 状态栏、退出、进度、心；五个选词；底部系统条。
**设计解读：** 从连续音频检索指定词，重点是听觉分段与词形辨认。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** 历史资料确认Stories覆盖Web/iOS/Android；没有截至检索日逐课程×平台矩阵。 2025年总结称Stories增至100+课程的Score30–59；Radio新增内容覆盖top9学习语种，220+课程首次加入初级Radio。2026听力综述另列西/法/德/意/日/中/韩/葡，未完整枚举语言方向。
**套餐：** 免费课程内容；具体故事和Radio受课程与进度限制。
[来源1](https://blog.duolingo.com/duoradio-listening-practice/) · [来源2](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/)

![Radio听音多选，五个词中选三个。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/238bedac29-image3_Audio-segment.png)

图证：完整题目视口；媒体路径 2023-10；1125×2436。状态栏、退出、进度、心；音频；词块选中态；底部系统条。
[来源页面](https://blog.duolingo.com/duoradio-listening-practice/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/10/image3_Audio-segment.png)

![Lucy节目中的听音多选。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/4f28d5e732-image6_IMG_1508.PNG)

图证：完整题目视口；媒体路径 2023-10；1170×2532。状态栏、退出、进度、心；五个选词；底部系统条。
[来源页面](https://blog.duolingo.com/duoradio-listening-practice/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/10/image6_IMG_1508.PNG)

### R02 · Radio音频—释义配对

分类：情境交互。
训练目标：建立语音与意义联系。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 点一个音频选项听声音。
2. 点对应的文字释义，重复配完各组。
3. 根据反馈继续后面的电台内容。

**界面关键点：** 状态栏、退出、进度、心；完整四行两列；底部系统条。
**设计解读：** 音频与释义建立直接联系，配对使短时理解能立即接受检验。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** 历史资料确认Stories覆盖Web/iOS/Android；没有截至检索日逐课程×平台矩阵。 2025年总结称Stories增至100+课程的Score30–59；Radio新增内容覆盖top9学习语种，220+课程首次加入初级Radio。2026听力综述另列西/法/德/意/日/中/韩/葡，未完整枚举语言方向。
**套餐：** 免费课程内容；具体故事和Radio受课程与进度限制。
[来源1](https://blog.duolingo.com/duoradio-listening-practice/)

![Radio四组音频和释义配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/084364b2a6-image4_Screen-Shot-2023-10-27-at-4.25.15-PM.png)

图证：完整题目视口；媒体路径 2023-10；570×1258。状态栏、退出、进度、心；完整四行两列；底部系统条。
[来源页面](https://blog.duolingo.com/duoradio-listening-practice/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/10/image4_Screen-Shot-2023-10-27-at-4.25.15-PM.png)

### R03 · Radio听力判断正误

分类：情境交互。
训练目标：核验听力语义理解。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 听节目并阅读当前判断句。
2. 选择勾或叉表达正确/错误。
3. 查看结果并继续节目。

**界面关键点：** 状态栏、退出、进度、心；勾/叉；重播/暂停控件；底部系统条。
**设计解读：** 将连续信息压缩为一个真假判断，操作轻，但猜测概率较高。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** 历史资料确认Stories覆盖Web/iOS/Android；没有截至检索日逐课程×平台矩阵。 2025年总结称Stories增至100+课程的Score30–59；Radio新增内容覆盖top9学习语种，220+课程首次加入初级Radio。2026听力综述另列西/法/德/意/日/中/韩/葡，未完整枚举语言方向。
**套餐：** 免费课程内容；具体故事和Radio受课程与进度限制。
[来源1](https://blog.duolingo.com/duoradio-listening-practice/)

![Radio根据听力判断陈述是否正确。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/4106f3bcb3-image5_IMG_1503.PNG)

图证：完整题目视口；媒体路径 2023-10；1170×2532。状态栏、退出、进度、心；勾/叉；重播/暂停控件；底部系统条。
[来源页面](https://blog.duolingo.com/duoradio-listening-practice/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/10/image5_IMG_1503.PNG)

### R04 · Radio听音选择相关图片

分类：情境交互。
训练目标：用非文字选项检查理解。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 听节目或当前音频。
2. 点选与内容相关的图片。
3. 依据后续反馈继续；原图没有独立检查按钮。

**界面关键点：** 主持人场景位于上方；下方有音频波形与两张相关图片候选。原图未显示单独检查按钮，具体自动判定时序未实测。
**设计解读：** 用图像作答减少拼写负担，让听到的意义映射到场景对象。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** 历史资料确认Stories覆盖Web/iOS/Android；没有截至检索日逐课程×平台矩阵。 2025年总结称Stories增至100+课程的Score30–59；Radio新增内容覆盖top9学习语种，220+课程首次加入初级Radio。2026听力综述另列西/法/德/意/日/中/韩/葡，未完整枚举语言方向。
**套餐：** 免费课程内容；具体故事和Radio受课程与进度限制。
[来源1](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)

![Radio听音选择相关图片。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/official-101-09.png)

图证：完整题目视口；2024-12-02；1170×2532。父任务已核验全高截图；本文件作者仅核对官方来源。
[来源页面](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) · [原始媒体](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/11-pathRadio.PNG)

## Adventures 场景任务


### A01 · 场景点物/读标牌/探索

分类：情境交互。
训练目标：借环境线索理解未知词。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 从路径进入场景任务，了解当前目标。
2. 在场景中点选可交互的人物或物件，读取对话及线索。
3. 根据任务目标继续探索。

**界面关键点：** 三部手机画面边界完整；探索页有退出；对话页完整显示两项回应和底部系统条。 不是完整竖屏，不计作完整UI。
**设计解读：** 语言信息分布在场景里，探索动作给阅读和理解一个需要完成的目的。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** iOS和Android。 2024-09公告（12-02更新）只明确英语母语学法语、西语母语学英语；未找到更晚的完整清单。
**套餐：** 在路径中的课程活动；专项公告未给付费门槛，不能据此宣布全账户免费。
[来源1](https://blog.duolingo.com/adventures/)

![官方排版的入口、场景探索、双项对话回应。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/480cbc8540-EN_Adventures_UIscreens.png)

图证：官方多屏排版；各手机视口完整；媒体路径 2024-08；1400×800。三部手机画面边界完整；探索页有退出；对话页完整显示两项回应和底部系统条。
[来源页面](https://blog.duolingo.com/adventures/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2024/08/EN_Adventures_UIscreens.png)

### A02 · 任务情境选择回应

分类：情境交互。
训练目标：练习沟通目的与语境，而非孤立翻译。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 进入角色对话，阅读或播放其发言。
2. 从底部选项中选择适合当前任务的回应。
3. 观察角色反应并继续行动。

**界面关键点：** 三部手机画面边界完整；探索页有退出；对话页完整显示两项回应和底部系统条。
**设计解读：** 回应是否合适要联系人物和任务目标；界面用场景反馈维持行动的连续性。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** iOS和Android。 2024-09公告（12-02更新）只明确英语母语学法语、西语母语学英语；未找到更晚的完整清单。
**套餐：** 在路径中的课程活动；专项公告未给付费门槛，不能据此宣布全账户免费。
[来源1](https://blog.duolingo.com/adventures/)

![官方排版的入口、场景探索、双项对话回应。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/480cbc8540-EN_Adventures_UIscreens.png)

图证：官方多屏排版；各手机视口完整；媒体路径 2024-08；1400×800。三部手机画面边界完整；探索页有退出；对话页完整显示两项回应和底部系统条。
[来源页面](https://blog.duolingo.com/adventures/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2024/08/EN_Adventures_UIscreens.png)

## Max 开放对话


### M01 · Roleplay多轮情景聊天

分类：开放对话体验。
训练目标：按水平练习有目的的沟通。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 进入 Roleplay，阅读情境和沟通目标。
2. 在输入区键入回复，或使用图中麦克风输入，再提交。
3. 与角色交替回复。
4. 结束后阅读对话反馈与修改建议。

**界面关键点：** 三个手机边界完整；聊天有输入/麦克风/键盘；后两屏有继续；不是本次现场操作。
**设计解读：** 情境目标为开放回复设定边界；聊天与事后复盘承担不同职责。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** Max页面称iOS/Android、188国；未证实Web。 页面2026-03更新明确英语母语学西/法/德/意/葡可用两项，学日/韩/中可用Video Call；2025总结确认Lily Android含英语、西法德意葡日韩。两文范围不完全一致，不能合并成完整语言方向矩阵。
**套餐：** Duolingo Max；Max包含Super权益。
[来源1](https://blog.duolingo.com/duolingo-max/) · [来源2](https://blog.duolingo.com/chatbot-language-practice/) · [来源3](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/)

![官方排版展示文本聊天、逐条复盘和结算。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/15224bba8c-Roleplay.png)

图证：官方多屏排版；各手机视口完整；媒体路径 2024-04；2000×1076。三个手机边界完整；聊天有输入/麦克风/键盘；后两屏有继续；不是本次现场操作。
[来源页面](https://blog.duolingo.com/duolingo-max/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2024/04/Roleplay.png)

### M02 · Video Call with Lily自由口语对话

分类：开放对话体验。
训练目标：低压力练习即时自发表达。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 点视频节点与呼叫按钮，等待接通。
2. 听 Lily 的问题，在出现的说话控件上启动回答。
3. 根据对话继续回应，可用语言请求重复或放慢。
4. 用通话结束/退出控件结束，再查看后续结果。

**界面关键点：** 入口操作完整；呼叫屏有挂断；通话屏有退出、目标进度、麦克风、字幕和系统底条。
**设计解读：** 通话隐喻把重心转向轮流听说；缺少固定答案，要求在线组织内容。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** Max页面称iOS/Android、188国；未证实Web。 页面2026-03更新明确英语母语学西/法/德/意/葡可用两项，学日/韩/中可用Video Call；2025总结确认Lily Android含英语、西法德意葡日韩。两文范围不完全一致，不能合并成完整语言方向矩阵。
**套餐：** Duolingo Max；Max包含Super权益。
[来源1](https://blog.duolingo.com/video-call/) · [来源2](https://blog.duolingo.com/duolingo-max/) · [来源3](https://blog.duolingo.com/product-highlights/)

![官方排版展示入口、呼叫、带按键发言的通话。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/1f3f77d648-EN-DuolingoProductYIR-Video-Call-1.png)

图证：官方多屏排版；各手机视口完整；媒体路径 2025-12；1400×800。入口操作完整；呼叫屏有挂断；通话屏有退出、目标进度、麦克风、字幕和系统底条。
[来源页面](https://blog.duolingo.com/product-highlights/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2025/12/EN-DuolingoProductYIR-Video-Call-1.png)

### M03 · Video Call with Falstaff引导口语

分类：开放对话体验。
训练目标：为初学者提供可完成的口语支架。
输入 → 输出：当前情境、文字/音频或对话轮次。 → 与当前任务相符的选择或自主表达。

**用户操作**

1. 进入 Falstaff 引导通话。
2. 听问题，必要时使用字幕；按提示组织短回答。
3. 利用提供的语言帮助继续对话。
4. 结束时使用底部挂断控件。

**界面关键点：** 状态栏；字幕；完整底部挂断/字幕控制栏。分辨率较低。
**设计解读：** 给初学者更明确的提示、翻译与反馈，使开放口语要求保持可完成。
**推断边界：** 流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。
**平台/课程：** 2026-01公告明确iOS；未据愿景推断Android已上。 英语、西语、葡语、法语、日语、德语、意语、韩语、中文；公告说向所有Score分阶段扩展，年底目标不能当完成证明。
**套餐：** Duolingo Max。
[来源1](https://blog.duolingo.com/beginner-video-call-with-falstaff/) · [来源2](https://blog.duolingo.com/falstaff-calls-research/)

![Falstaff辅导通话与德语字幕。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/9ce2123777-guided-call-with-falstaff_german-lesson-4.png)

图证：完整题目视口；媒体路径 2025-12；286×619。状态栏；字幕；完整底部挂断/字幕控制栏。分辨率较低。
[来源页面](https://blog.duolingo.com/beginner-video-call-with-falstaff/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2025/12/guided-call-with-falstaff_german-lesson-4.png)

## 5. 容器、模式与反馈层


### P01 · Practice tab/旧Practice Hub

按需集中复习特定技能。
操作：点哑铃，若未显示先打开更多菜单；选说、听、词汇或错题等。
界面：状态栏、标题；完整可见入口列表；底部导航与系统条。
边界：该条是容器或反馈层，不计作新的语言原子题型。

![专项练习与Stories、Radio等入口。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/ccd59b1fcd-practice-tab.png)

图证：完整题目视口；媒体路径 2026-02；758×1632。状态栏、标题；完整可见入口列表；底部导航与系统条。
[来源页面](https://blog.duolingo.com/guide-to-duolingo-practice-hub/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/practice-tab.png)

### P02 · Explain My Answer/Explain My Mistake

及时理解具体答案中的规则。
操作：先提交普通题，再主动打开解释，读提示后返回课程。
界面：顶部状态/退出/进度/能量；题目及词块；绿色解释/继续；系统底条。 状态栏、返回、解释、赞/踩、返回课程按钮、系统底条。 顶部控件；答案框；红色结果、正确答案、解释错误/继续；系统底条。 状态栏、返回、解释、赞/踩、分页、返回课程按钮、系统底条。
边界：该条是容器或反馈层，不计作新的语言原子题型。

![正确答题结果上的主动解释入口。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/0fd2b0d7ef-EN_Reverse-Tap.png)

图证：完整题目视口；媒体路径 2025-12；379×816。顶部状态/退出/进度/能量；题目及词块；绿色解释/继续；系统底条。
[来源页面](https://blog.duolingo.com/explain-my-answer-now-free/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2025/12/EN_Reverse-Tap.png)

![正确答案的语法解释页。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/928f317c2b-EN_Reverse-Tap-EMA.png)

图证：完整题目视口；媒体路径 2025-12；379×816。状态栏、返回、解释、赞/踩、返回课程按钮、系统底条。
[来源页面](https://blog.duolingo.com/explain-my-answer-now-free/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2025/12/EN_Reverse-Tap-EMA.png)

![错误答案页上的解释错误入口。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/f5c481dc34-EN_Reverse-Translate.png)

图证：完整题目视口；媒体路径 2025-12；379×816。顶部控件；答案框；红色结果、正确答案、解释错误/继续；系统底条。
[来源页面](https://blog.duolingo.com/explain-my-answer-now-free/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2025/12/EN_Reverse-Translate.png)

![对照错误与正确表达的反馈页。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/575ade5a07-EN_Reverse-Translate-EMA.png)

图证：完整题目视口；媒体路径 2025-12；379×816。状态栏、返回、解释、赞/踩、分页、返回课程按钮、系统底条。
[来源页面](https://blog.duolingo.com/explain-my-answer-now-free/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2025/12/EN_Reverse-Translate-EMA.png)

### P03 · Match Madness限时配对

在熟悉词汇上练快速提取；机制属于配对。
操作：在排行榜可见时进入，在倒计时内快速匹配母语词与目标语词。
界面：状态栏、退出、标题、活动余时、阶段、连击记录、开始、系统条；无配对过程。
边界：该条是容器或反馈层，不计作新的语言原子题型。

![Match Madness进入页及限时活动信息。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/964a9f03a1-6-screenshot_match-madness-lesson.PNG)

图证：完整入口页；不是答题页；媒体路径 2025-12；1170×2532。状态栏、退出、标题、活动余时、阶段、连击记录、开始、系统条；无配对过程。
[来源页面](https://blog.duolingo.com/ways-to-practice-in-duolingo/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2025/12/6-screenshot_match-madness-lesson.PNG)

![作者历史实测补图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/thirdparty-match-madness.png)

图证：历史完整题目视口；媒体路径 2024-05；593×1024。仅作历史操作结构证据。
[来源页面](https://duoplanet.com/duolingo-timed-challenges/) · [原始媒体](https://duoplanet.com/wp-content/uploads/2024/05/Duolingo-match-madness-3-593x1024.png)

### P04 · Rapid Review/路径Side Quest限时复习

复习并增加挑战感；不是独立题型。
操作：点路径角色的星级入口，开始限时复习，争取一颗星。
界面：状态栏、退出、标题、等级、奖励、底部开始和系统条；无答题过程。
边界：该条是容器或反馈层，不计作新的语言原子题型。

![Rapid Review进入页，显示三星与第1/3级。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/d0122519c6-5-screenshot_side-quest-lesson_preview.jpeg)

图证：完整入口页；不是答题页；媒体路径 2025-12；1170×2532。状态栏、退出、标题、等级、奖励、底部开始和系统条；无答题过程。
[来源页面](https://blog.duolingo.com/ways-to-practice-in-duolingo/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2025/12/5-screenshot_side-quest-lesson_preview.jpeg)

![作者历史实测补图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/thirdparty-rapid-review.jpeg)

图证：历史完整题目视口；媒体路径 2024-05；530×1024。仅作历史操作结构证据。
[来源页面](https://duoplanet.com/duolingo-timed-challenges/) · [原始媒体](https://duoplanet.com/wp-content/uploads/2024/05/image-1-530x1024.jpeg)

### P05 · Legendary难度挑战

更少支架下检验掌握。
操作：点完成的节点，再选Legendary，完成更难且无提示的练习。
界面：完整主页与节点菜单；只证实入口，不是挑战答题屏。
边界：该条是容器或反馈层，不计作新的语言原子题型。只有入口图，缺当前完整答题过程图。

![已完成节点可选择复习或Legendary。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/c33f21af25-2-screenshot_complete-review-lesson.PNG)

图证：完整入口页；不是答题页；媒体路径 2025-12；1170×2532。完整主页与节点菜单；只证实入口，不是挑战答题屏。
[来源页面](https://blog.duolingo.com/ways-to-practice-in-duolingo/) · [原始媒体](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2025/12/2-screenshot_complete-review-lesson.PNG)

### P06 · Ramp Up

官方学习指标文章确认其为路径外活动，未提供可核对的细则。
操作：
界面：
边界：该条是容器或反馈层，不计作新的语言原子题型。只有入口图，缺当前完整答题过程图。

![作者历史实测补图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/thirdparty-ramp-up.jpg)

图证：历史完整入口页；媒体路径 2022-07；533×1024。仅作历史操作结构证据。
[来源页面](https://duoplanet.com/duolingo-timed-challenges/) · [原始媒体](https://duoplanet.com/wp-content/uploads/2022/07/Duolingo-xp-ramp-up-533x1024.jpg)

### 历史模式补充


旧故事角色跟读：在角色轮次中点麦克风复述；当前保留情况未确认。

![旧故事角色跟读](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/thirdparty-story-speaking-old.png)

图证：第三方历史完整截图；媒体路径 2021-05；473×1024。2021媒体，仅用于历史设计比较。
[来源页面](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/) · [原始媒体](https://duoplanet.com/wp-content/uploads/2021/05/IMG_1203-1-473x1024.png)

旧故事隐藏文本听读：先听隐藏文本，必要时点揭示；属于减少文字提示的模式。

![旧故事隐藏文本听读](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/thirdparty-story-listening-old.png)

图证：第三方历史完整截图；媒体路径 2021-05；473×1024。2021媒体，仅用于历史设计比较。
[来源页面](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/) · [原始媒体](https://duoplanet.com/wp-content/uploads/2021/05/IMG_1201-473x1024.png)

## 6. 画面 UI 的共同设计逻辑

### 6.1 一屏一个主要任务

多数普通题可以分成四层：顶部退出与进度；题型指令；材料与作答区；底部主操作或反馈区。标题告诉用户做什么，蓝色音频按钮告诉用户从哪里获取声音，带下沿厚度的卡片提示可点击，底部宽按钮收束操作。不同题型复用这个结构，有助于把注意力留给语言内容。

但 Stories 的内容需要滚动，Radio 把作答区叠在主持场景下，Adventures 以地图作为主画面，Video Call 又使用通话隐喻。应复用操作规律，而不是要求所有任务都拥有同一张白色答题卡。

### 6.2 颜色表达状态，形状表达操作

已核验浅色图常见白底、深灰字、浅灰描边、蓝色音频与选中态、绿色通过/继续；用户提供的深色图保留高亮按钮和明确的选中轮廓。进度、心和能量在不同年代的图片中出现不同版本，不能据此推定统一的现行扣费或扣能量规则。

关键不是复制一个绿色色号，而是保证默认、选中、禁用、正确、需修正各状态可辨；错误状态还需要文字或图标，不能只改颜色。本报告没有验证现行全平台色值、字体文件、WCAG 等级和读屏实现，因此没有给出伪精确的设计 token。

### 6.3 留白与布局减少视觉搜索

两列配对让关系并置；填空让错误位置收窄；表格展示规则的对应关系；拼字槽位直接呈现结构；大描写区为手指运动让出空间。大留白只有服务于当前任务才有价值。若把词块放得过散，或让反馈挡住关键材料，视觉搜索和记忆负担仍会增加。

2026 官方页签改版说明提到标题层级、固定标题位置和减少样式种类；这可以解释整体秩序，但不能把导航改版的规则直接当成所有题页的精确规格。[官方页签设计说明](https://blog.duolingo.com/core-tabs-redesign/)

### 6.4 插画承担语义或情境工作

词汇图需要轮廓清楚、候选间区别明确；句子场景图需要呈现动作和关系；角色则提供说话者身份、情绪和故事连续性。把这些职责混在一起，会使装饰图变成错误线索。Duolingo 官方美术说明强调简化形状与可辨认性；角色设计访谈解释了持续出现的角色如何形成统一世界。[美术语言](https://blog.duolingo.com/shape-language-duolingos-art-style/)、[Apple 设计访谈](https://developer.apple.com/news/?id=jhkvppla)

### 6.5 语音控件必须让用户知道“现在在做什么”

播放、慢速、录音、识别中和识别失败是不同状态。静态麦克风不能证明录音已开始；朗读通过也不能证明自由口语能力。正常/慢速播放和“现在不能听/说”降低环境限制；字幕与文本支持还会改变任务难度，应该记入结果条件。[官方听力可达性说明](https://blog.duolingo.com/learning-with-hearing-aids/)

### 6.6 动效与纠错各有节奏

答对反馈可以简短而明确，持续对话的纠错需要保护说话连贯性，错误解释需要足够停留时间。官方公开过角色动画与口型实现，但本轮未测量触觉、音效、动画时长或按下位移。不能把观看静态图写成完整动效验收。[角色动画](https://blog.duolingo.com/building-character/)、[口型同步](https://blog.duolingo.com/world-character-visemes/)

## 7. 可迁移的设计结论

下面是本报告的设计建议，适用于后续课程产品设计；不是对本项目已实施功能的描述。

1. **先定义一道题到底要证明什么。** 同一个“英语句子”不应该用一套通用判分方式同时处理听写、翻译、朗读和交流。题目数据至少要能表达目标能力、输入通道、允许的支架、答案形式与反馈依据。
2. **围绕同一目标构建递进任务。** 可以从看图识别进入局部填空，再进入自由提取，最后放进新情境。不要为了丰富画面，在没有能力递进的情况下重复换控件。
3. **候选项应该揭示误解。** 近音词用于听辨，人称/词尾用于形态规则，语义相近选项用于语境理解。混入完全无关的答案，容易让用户靠排除完成，却未处理目标知识。
4. **把操作失误与知识错误分开。** 小孩点错、键盘拼写失误、语音识别失败和真正的语言错误需要不同恢复路径。对儿童课程，取消、重播、重试、查看解释尤其重要。
5. **反馈先解决当前误解。** 先指出需要修正的位置与理由，再给下一步；连胜、星星、积分可以辅助，但不能替代纠错内容。答案解释还需要核实是否贴合这道题及儿童可理解的语言。
6. **保留操作状态，而不只记录最终对错。** 使用过慢速、看过提示、看过答案后重试，与首次独立完成代表不同学习证据。学习记录应保留这些差别。
7. **限制计时的教学用途。** 熟练度训练可以限时，新概念学习和困难听辨不应只追求速度。完成时间里包含阅读、点击和系统延迟，应避免把它直接等同于掌握程度。
8. **先完成稳定的基础题页，再引入更长情境。** 普通题需要可靠音频、清楚选中态、可恢复输入和明确反馈；故事、电台和对话依赖这些基础能力。
9. **开放表达需要独立验收。** 对话反馈应围绕沟通目标、可理解性和关键错误；验证多种合理回答、环境噪声、口音、年龄差异以及中途退出恢复。不能用“AI 返回了文字”代替教学质量验收。
10. **用延迟和迁移测量学习。** 复习间隔后的提取、新材料中的正确使用、减少提示后的表现，比连续刷同一题得到的 XP 更能帮助判断设计是否达到目标。

## 8. 仍需补证的范围

本报告能建立较广的公开证据图谱，不能证明覆盖 Duolingo 所有服务器实验、所有课程方向和全部历史题型。以下项目没有冒充为“已取得完整题页”。

| 项目 | 本轮缺少什么 | 要怎样补证 |
| --- | --- | --- |
| 当前版本逐端覆盖 | 未完成免费/Super/Max账号实机遍历；Web、iOS、Android并非同一功能集 | 记录设备、版本、界面语言、课程方向、进度、套餐后实机走查 |
| 片假名、俄语、乌克兰语、希腊语、希伯来语、意第绪语的独立题页 | 部分只有文字目录，不能证明每一种具体题目 | 进入字符练习，分别取得完整题页和作答后状态 |
| 日语无引导整字手写、形近汉字辨别 | 官方文字说明/曾公布的计划不能替代相应独立题屏 | 查证当前版本是否存在，再录完整操作 |
| 中文专用描写、补笔画、部件拼合、笔顺排序 | 没有足够证据证明主语言应用当前提供这些独立任务 | 不移用日语汉字截图；需中文课程真实题屏 |
| 历史 Checkpoint 自主写作 | 有历史文字证据，缺完整界面；当前是否保留未知 | 补原始官方档案或明确版本的真实截图 |
| Ramp Up、Lightning Round 等历史活动 | 入口/名称或第三方历史证据不能证明当前独立题型和全流程 | 记录当前入口、活动规则、作答和结束状态；不猜排期或费用 |
| 全部错误、重试、录音拒绝与网络异常状态 | 当前图谱以主任务及部分反馈态为主 | 对同一道题采集未答、选中、正确、错误、重试、异常恢复 |
| 完整动效与可达性 | 未实测键盘、读屏、色觉差异、低龄操作及全部动画 | 单独建立可达性与课堂操作验收 |

这些缺口意味着：可以据本报告讨论和设计已列出的题型，但不能宣称“所有现行课程的每个题型及全部状态已100%实测”。

## 9. 本次交付与验证边界

- 新增：综合报告、按题型组织的真实截图图谱、操作步骤与设计分析、会员边界、覆盖清单和来源/文件校验记录。
- 核对并纠正：Practice 与答案解释的旧会员分类；日语汉字与韩文的误分类；假名补笔画与汉字补笔画的混用；语音输入、跟读和开放对话的混用；入口图、局部图与完整题页的混用。
- 实际验证：来源追溯、已采用图片目视检查、下载文件校验、报告图片和内部链接存在性、题型记录完整性。未声称实时账号操作或逐端验收通过。
- 业务代码：未改动。提交：未执行。推送：未执行。官网发布：未执行。本次授权为研究报告。



## 10. 来源目录

- [Duolingo 101: How to learn a language on Duolingo](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)
- [How Duolingo teaches writing skills](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)
- [How Duolingo teaches reading skills](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/)
- [Listening Practice in Another Language: Tips from Duolingo](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/)
- [How Duolingo teaches speaking skills](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/)
- [New immersion exercises maximize your language learning](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/)
- [Language rules: Learning grammar on Duolingo](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/)
- [At Duolingo, humans and AI work together to create a high-quality learning experience](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/)
- [How to practice English pronunciation on Duolingo](https://blog.duolingo.com/duolingo-english-sounds-tab/)
- [Strengthen your memory with new Duolingo Flashcards](https://blog.duolingo.com/duolingo-flashcards/)
- [Practice any skill, any time in the Practice tab](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)
- [Dear Duolingo: What’s the right level of difficulty?](https://blog.duolingo.com/right-level-of-difficulty/)
- [Improving how Duolingo teaches Chinese—and other languages!](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/)
- [The sneaky speaking practice you’re probably not doing](https://blog.duolingo.com/sneaky-pronunciation-practice/)
- [How To Learn Spanish on Duolingo](https://blog.duolingo.com/tips-for-learning-spanish-on-duolingo/)
- [How to get started learning English](https://blog.duolingo.com/why-learn-english/)
- [Partial credit: improvements to Duolingo’s placement test](https://blog.duolingo.com/partial-credit-improvements-to-duolingos-placement-test/)
- [2025 Duolingo Highlights: our biggest leaps in learning, play, and connection](https://blog.duolingo.com/product-highlights/)
- [How lesson transparency helps learners reach their goals](https://blog.duolingo.com/duolingo-difficult-exercises/)
- [Is Google Translate Wrong? 8 Things You Need to Know](https://blog.duolingo.com/is-google-translate-wrong/)
- [All of the ways Duolingo improved its grammar skills this year](https://blog.duolingo.com/duolingo-grammar-skills-improvements-2021/)
- [How do I practice all of the grammar rules in my new language?](https://blog.duolingo.com/grammar-practice-tips/)
- [Introducing the new Duolingo learning path](https://blog.duolingo.com/new-duolingo-home-screen-design/)
- [7 ways you can switch up your practice in the app right now](https://blog.duolingo.com/ways-to-practice-in-duolingo/)
- [How we’ve improved the Duolingo learning experience this year (and a sneak peek toward 2020!)](https://blog.duolingo.com/how-weve-improved-the-duolingo-learning-experience-this-year-and-a-sneak-peek-toward-2020/)
- [Methods for Language Learning Assessment at Scale: Duolingo Case Study](https://research.duolingo.com/papers/portnoff.edm21.pdf)
- [Strengthen your listening skills with DuoRadio!](https://blog.duolingo.com/duoradio-listening-practice/)
- [Introducing Adventures, a brand-new gamified learning experience](https://blog.duolingo.com/adventures/)
- [Video Call lets you have real life conversations with Lily](https://blog.duolingo.com/video-call/)
- [Our new Video Call with Falstaff is here to help you speak with confidence](https://blog.duolingo.com/beginner-video-call-with-falstaff/)
- [Research report: Video Call with Falstaff improves beginners’ conversation skills](https://blog.duolingo.com/falstaff-calls-research/)
- [Introducing Duolingo Max, a learning experience powered by GPT-4](https://blog.duolingo.com/duolingo-max/)
- [Explain My Answer is now free for all learners!](https://blog.duolingo.com/explain-my-answer-now-free/)
- [Coming soon: new Stories for advanced learners!](https://blog.duolingo.com/duolingo-advanced-stories/)
- [Duolingo Stories: The journey to Android](https://blog.duolingo.com/duolingo-stories-the-journey-to-android/)
- [Can I use ChatGPT to practice a new language?](https://blog.duolingo.com/chatbot-language-practice/)
- [Dear Duolingo: How do I get comfortable writing in a new language?](https://blog.duolingo.com/tips-to-improve-writing-skills/)
- [Behind the metric: how we developed “Time Spent Learning Well”](https://blog.duolingo.com/time-spent-learning-well/)
- [Learn together with the new Duolingo Family Plan](https://blog.duolingo.com/plus-family-plan/)
- ["Can Duolingo make me fluent?" and other common questions from learners](https://blog.duolingo.com/can-duolingo-make-me-fluent/)
- [A new tool for learning to read Japanese on Duolingo](https://blog.duolingo.com/learning-to-read-japanese-characters/)
- [Tools for learning to read other writing systems](https://blog.duolingo.com/learning-other-writing-systems/)
- [Dear Duolingo: What kind of Chinese does Duolingo teach?](https://blog.duolingo.com/chinese-languages/)
- [Dear Duolingo: Why does Japanese have three writing systems?](https://blog.duolingo.com/japanese-writing-systems/)
- [Elevating craft: How we refreshed our core tabs](https://blog.duolingo.com/core-tabs-redesign/)
- [Shape language: Duolingo’s art style](https://blog.duolingo.com/shape-language-duolingos-art-style/)
- [Building character: How a cast of characters can help you learn a language](https://blog.duolingo.com/building-character/)
- [Dear Duolingo: How can I learn a language as a hearing aid user?](https://blog.duolingo.com/learning-with-hearing-aids/)
- [The Duolingo Method: 5 key principles that make learning fun and effective](https://blog.duolingo.com/duolingo-teaching-method/)
- [Lip syncing lessons: the next step in bringing our characters to life](https://blog.duolingo.com/world-character-visemes/)
- [Typography — Duolingo Brand Guidelines](https://design.duolingo.com/identity/typography)
- [Color — Duolingo Brand Guidelines](https://design.duolingo.com/identity/color)
- [截图补充来源](https://www.apple.com/ca/newsroom/2023/06/apple-announces-winners-of-the-2023-apple-design-awards/)
- [截图补充来源](https://blog.duolingo.com/ko/practice-english-sounds/)
- [截图补充来源](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/)
- [截图补充来源](https://duoplanet.com/duolingo-timed-challenges/)
