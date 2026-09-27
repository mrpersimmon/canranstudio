# Duolingo 英语学习：题型、操作与界面设计分析

研究日期：2026-09-27 ｜ 范围：以英语为目标语言，兼顾免费、Super、Max ｜ 公开证据版

Duolingo 的英语学习体验，核心是让学习者在可承受的帮助下反复建立“声音—文字—意义”的联系，再逐步独立理解、提取和表达。统一的操作框架承担熟悉感；词块、图像、慢速与提示控制难度；故事、电台、场景任务和对话把句子放入更长的沟通情境。这是根据题面和操作作出的设计分析，不是对每一种题型学习效果的实验结论。

## 1. 本报告的范围与证据标准

只研究 **学习英语**：中文等母语进入英语课程，以及进阶英语中以英语理解英语的内容。法语、葡语、西语、韩语界面的英语题目仍在范围内；“界面是英文但实际学习法语或西语”的截图不在主体。不同母语学习英语的教学目标相同，却不保证题库、功能或上线时间相同。

不纳入数学、音乐、国际象棋、非英语文字描写、独立 Duolingo ABC 或 Duolingo English Test。英语发音辨别与普通录音题保留，但不会把考试产品的评分功能写成学习 App 已有功能。

**截图证据分级：**

- **完整任务视口**：原图保留退出/进度、题干、材料、当前答案区和主要操作；若来源没有系统状态栏，会单独说明。
- **官方多屏图**：保留官方整张排版，各手机画面完整；点击可看原尺寸。它不是本次登录后的连续录屏。
- **局部 / 边界存疑**：可用于分析可见控件，不计入完整截图覆盖。
- **入口 / 目录 / 反馈**：单列说明，不冒充答题页。
- **待补证**：功能已有文字证据但缺英语完整题图，或尚不能证明英语课程有此独立题型。

本轮使用官方原始图片、四张已有中文学英语截图和官方说明。浏览器控制多次超时，未完成本轮账号实机走查。因此不声称已遍历全部现行英语课程、服务器实验或每题全部状态。没有 Duolingo 内部代码、评分服务与实验配置；UI 截图也不能揭示语音识别容差、随机出题规则或实际动画时长。

每个条目都提供学习目标、输入与输出、操作步骤、可见 UI、设计解读、证据边界和原图。主体计数是本报告的分析条目数量，不是 Duolingo 官方题型总数。已获全图、局部图、待补图在索引中直接区分。

## 2. 从第一性原理理解英语题型

一道题首先应回答“正确作答能证明什么”。点击正确词块能说明识别或组合有所进展；它不能直接证明能独立拼写。照着句子读出来与听完问题自己组织回答，也不是同一种能力。

| 能力目标 | 主要任务 | 支架如何减少 | 不能混同的结果 |
| --- | --- | --- | --- |
| 把英语声音与词形联系起来 | Sounds 听辨、听音配对、词块听写 | 二选一→多个候选→去掉候选 | 能选出词不等于能独立拼写 |
| 提取英语词义 | 双语配对、语境定义、Flashcards | 看候选→看母语提示→主动说/写英语 | 熟悉词形不等于能在新句中使用 |
| 组织英语句子 | 词块翻译、局部翻译、自由翻译 | 给完整词库→保留部分句式→整句生成 | 词序正确不等于理解整段话 |
| 理解连续信息 | 阅读理解、听后选答、Stories、Radio | 可见文本/慢速/重播→更少辅助 | 理解别人不等于能自主表达 |
| 产出可懂的英语语音 | 跟读、口说选答、Falstaff/Lily | 给原句→给选项→给情境→开放回应 | 识别通过不等于口音完美或自由流利 |
| 为沟通目的使用英语 | Adventures、Roleplay、Video Call | 有限回应→自由文字→即时口语 | 一次任务通过不等于掌握所有真实情境 |

### 2.1 难度是五个变量，不只是选项数量

材料长度、输出自由度、可用提示、时间/记忆压力、情境陌生程度都能改变难度。例如学习英语第三人称单数时，可以只选择动词，也可以完成整句；后者增加的困难可能同时来自词汇提取、键盘和拼写，不能把全部错误都解释为语法不会。

英语中级内容明确使用英语语境、英语释义与对话，仍允许母语词义提示。这说明“以英语思考”和“必要时提供帮助”可以同时成立。2024 公告描述 B1/B2 内容；课程单元结构后来仍在调整，报告不把当年的固定单元数当作今天的规格。[英语内容设计](https://blog.duolingo.com/how-duolingo-teaches-english/)、[中级单元调整](https://blog.duolingo.com/intermediate-mini-units/)

### 2.2 同一控件不等于同一学习任务

词块用于英译母语时，侧重理解；用于母语译英语时，侧重词汇和句法组合；用于英语听写时，侧重声音分段与词形识别。报告分开讨论这些方向，但明确它们复用了相同交互机制。角色、深浅色主题或倒计时本身不新增语言题型。

### 2.3 反馈应解释“哪里需要改变”

英语自由输入会产生多种合理表达，翻译不能按唯一字面串判分；听写需要更贴近所听内容；开放对话则应围绕沟通是否成立。这里是设计要求，不是对 Duolingo 私有判分算法的推断。官方英语示例已展示保留学习者原句、标出修正片段和解释语法的反馈层。[英语答案解释示例](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)

## 3. 免费、Super、Max：英语课程的已确认边界

| 范围 | 本轮确认 | 不能扩大解释为 |
| --- | --- | --- |
| 普通英语课 | 翻译、填空、理解、听写、录音等属于基础课程任务 | 任一母语和任一进度都有全部变体 |
| Practice 练习 | 官方2026宣布 iOS/Android 所有语言课程免费使用练习；葡语英语版有词汇、听说和错题图 | 旧图出现 Super 或无限图标就代表该题必须付费 |
| Explain My Answer / Mistake | 葡语官方明确免费支持葡语用户学英语，并展示正确/错误两类解释 | 中文用户学英语或所有地区已同时开放 |
| Super | 主要改变广告、使用条件及部分练习权益；本轮未发现需要另设一套“Super独有英语原子题型”的依据 | Super 是英语题型分类或拥有一套完全不同的题库 |
| Roleplay / Bate-Papo | 葡语和日语官方 Max 说明均明确支持该母语用户学英语 | 已获得英语聊天完整题屏，或所有英语课程/网页端可用 |
| Lily Video Call | 有葡语→英语课程入口与完整通话 UI；官方列为 Max 功能 | 通话画面语言中性就能单独判定学习方向 |
| Falstaff 引导通话 | 官方明确包含英语，定位初学者；已找到英语字幕的完整通话图 | 图里出现 Falstaff 的普通跟读题也是 Max 通话 |
| Flashcards | 葡语→英语官方示例明确要求主动说出英语词，可切换键入 | 所有英语学习方向、平台或账号都已覆盖 |
| Stories / Radio / Adventures | 有英语课程的完整任务或场景图 | 所有入口、题型、套餐与平台矩阵已被实机核实 |

依据：[免费 Practice](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)、[葡语英语版 Practice](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/)、[免费英语答案解释](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)、[葡语 Max](https://blog.duolingo.com/pt/duolingo-max-gpt-4/)、[日语 Max](https://blog.duolingo.com/ja/max-subscription/)、[Falstaff](https://blog.duolingo.com/beginner-video-call-with-falstaff/)、[英语 Flashcards](https://blog.duolingo.com/pt/flashcards-do-duolingo/)。具体权益应以实际账号所在地区与版本为准，本报告不报价。

## 4. 题型图谱的阅读方式

E 系列为词汇、翻译、语法、听说读与发音；S 为 Stories 里的语言任务；R 为 Radio；A 为 Adventures；M 为 Max；P 为入口和反馈模式。编号只用于报告检索，不是官方内部类型代码。所有设计解读均由观察推导；操作时序未实测的部分会单独说明。

逐题内容按作答方式分为三个部分：**不含口语和听力的题目**集中在第 4.1 节，听力与口语相关题目在第 4.2 节，场景探索辅助交互在第 4.3 节。原编号保持不变，目录同时列出题型类别和听说分类，便于按教学目标或作答方式查找。


本报告包含 31 个英语题型、交互与变体分析条目，29 项已有完整英语任务/通话视口；另有 2 项缺英语题图。另列 5 类入口与反馈。48 份独立图像文件不等于同数量题型；重复使用的原图仅计一次。仍待确认是否适用于英语的候选题型，见第8节。

## 题型索引

| 编号 | 题型/交互/变体 | 类别 | 听说分类 | 图证状态 |
| --- | --- | --- | --- | --- |
| [E01](#E01) | 双语词语配对 | 词汇与翻译 | 不含口语和听力 | 有完整英语题图 |
| [E02](#E02) | 英语语境词义—英文定义选择 | 词汇与翻译 | 不含口语和听力 | 有完整英语题图 |
| [E03](#E03) | Flashcards：主动说出英语词 | 词汇与翻译 | 听力与口语相关 | 有完整英语题图 |
| [E04](#E04) | 词块翻译：理解英语并译成母语 | 词汇与翻译 | 不含口语和听力 | 有完整英语题图 |
| [E05](#E05) | 词块翻译：把母语组织成英语 | 词汇与翻译 | 不含口语和听力 | 有完整英语题图 |
| [E06](#E06) | 整句自由翻译 | 词汇与翻译 | 不含口语和听力 | 有完整英语题图 |
| [E07](#E07) | 补全部分翻译 | 词汇与翻译 | 不含口语和听力 | 有完整英语题图 |
| [E08](#E08) | 英语翻译的语音输入变体 | 词汇与翻译 | 听力与口语相关 | 有完整英语题图 |
| [E09](#E09) | 英语语境选词填空 | 句子与阅读 | 不含口语和听力 | 有完整英语题图 |
| [E10](#E10) | 英语图境辅助选词填空 | 句子与阅读 | 不含口语和听力 | 有完整英语题图 |
| [E11](#E11) | 英语段落阅读理解选择 | 句子与阅读 | 不含口语和听力 | 有完整英语题图 |
| [E12](#E12) | 英语对话下一句选择 | 句子与阅读 | 不含口语和听力 | 有完整英语题图 |
| [E13](#E13) | 词块听写/听后重组 | 听力与口语 | 听力与口语相关 | 有完整英语题图 |
| [E14](#E14) | 听后理解并选答 | 听力与口语 | 听力与口语相关 | 有完整英语题图 |
| [E15](#E15) | 英语整句跟读与朗读 | 听力与口语 | 听力与口语相关 | 有完整英语题图 |
| [E16](#E16) | 理解英语问题并说出正确回应 | 听力与口语 | 听力与口语相关 | 有完整英语题图 |
| [E17](#E17) | 英语近音词听辨二选一 | 英语声音专项 | 听力与口语相关 | 有完整英语题图 |
| [E18](#E18) | 英语两段声音同异判断 | 英语声音专项 | 听力与口语相关 | 有完整英语题图 |
| [E19](#E19) | 英语声音—书面词语配对 | 英语声音专项 | 听力与口语相关 | 有完整英语题图 |
| [S01](#S01) | 故事内容理解单选 | Stories 故事 | 不含口语和听力 | 有完整英语题图 |
| [S02](#S02) | 故事里按释义找到英语词或词组 | Stories 故事 | 不含口语和听力 | 有完整英语题图 |
| [S03](#S03) | 故事末尾开放写作 | Stories 故事 | 不含口语和听力 | 官方确认英语功能；完整题图待补 |
| [R01](#R01) | Radio 听音选指定数量的词 | Radio 电台 | 听力与口语相关 | 有完整英语题图 |
| [R02](#R02) | Radio 音频与母语释义配对 | Radio 电台 | 听力与口语相关 | 有完整英语题图 |
| [R03](#R03) | Radio 判断理解正误 | Radio 电台 | 听力与口语相关 | 有完整英语题图 |
| [R04](#R04) | Radio 听音选择图片 | Radio 电台 | 听力与口语相关 | 有完整英语题图 |
| [A01](#A01) | Adventures 场景探索/点物/读标牌 | Adventures 场景任务 | 场景辅助交互 | 有完整英语题图 |
| [A02](#A02) | Adventures 英语回应选择 | Adventures 场景任务 | 不含口语和听力 | 有完整英语题图 |
| [M01](#M01) | Roleplay / Bate-Papo 英语多轮情境聊天 | Max 英语对话 | 不含口语和听力 | 官方确认英语功能；完整聊天题图待补 |
| [M02](#M02) | Video Call with Lily 英语自由对话 | Max 英语对话 | 听力与口语相关 | 有完整英语题图 |
| [M03](#M03) | Video Call with Falstaff 英语引导对话 | Max 英语对话 | 听力与口语相关 | 有完整英语题图 |

<a id="non-audio"></a>
## 4.1 不含口语和听力的题目

以完成当前题目是否必须听音或开口为准：本节的材料可从文字或图片获得，答案通过点选、配对或键入完成。可选播放、角色配音或语音输入入口不改变这里所整理的阅读与书面作答分支。

共 **15 项**：词汇与翻译 6 项、句子与阅读 4 项、Stories 3 项、Adventures 回应选择 1 项、Max 文字聊天 1 项。其中 **13 项有完整英语任务画面**；S03 故事开放写作与 M01 Roleplay 的英语完整题图仍待补。

分类限定当前题目或文字分支，不代表整节 Stories、Adventures 或账号流程完全无声；本轮未完成静音实测。E03 Flashcards 的现有完整配图是口说形式，键入分支缺完整图，暂留在听说相关部分。A01 场景探索另列为辅助交互。

| 编号 | 题目 | 无需听说时如何完成 |
| --- | --- | --- |
| [E01](#E01) | 双语词语配对 | 阅读两列词语并点选配对，作答不依赖声音。 |
| [E02](#E02) | 英语语境词义—英文定义选择 | 阅读英语语境与定义，点选符合词义的一项。 |
| [E04](#E04) | 词块翻译：理解英语并译成母语 | 阅读英语原句，用母语词块组成译文；朗读是可选辅助。 |
| [E05](#E05) | 词块翻译：把母语组织成英语 | 阅读母语原句，用英语词块组成译文。 |
| [E06](#E06) | 整句自由翻译 | 本节采用键盘输入整句译文的分支；语音输入另见 E08。 |
| [E07](#E07) | 补全部分翻译 | 阅读中文与已有英语译文，键入缺失部分。 |
| [E09](#E09) | 英语语境选词填空 | 阅读句子并选词补空，不需要根据音频判断。 |
| [E10](#E10) | 英语图境辅助选词填空 | 根据插图和英语文本选择缺词。 |
| [E11](#E11) | 英语段落阅读理解选择 | 从英语段落中找到证据，再选择答案。 |
| [E12](#E12) | 英语对话下一句选择 | 阅读已显示的英语对话，选择下一句；播放语音是可选辅助。 |
| [S01](#S01) | 故事内容理解单选 | 本节按阅读故事文本后回答理解问题的分支整理；故事本身可能伴随配音。 |
| [S02](#S02) | 故事里按释义找到英语词或词组 | 阅读故事语境及释义，在句子中点选对应英语词或词组。 |
| [S03](#S03) | 故事末尾开放写作 | 按阅读故事后键入英语回应归类；英语完整写作题图仍待补。 |
| [A02](#A02) | Adventures 英语回应选择 | 图中问题与两个回应均有英语文字，可通过阅读和点选完成；本轮未实测静音流程。 |
| [M01](#M01) | Roleplay / Bate-Papo 英语多轮情境聊天 | 依据官方文字聊天说明归类，输入为英语文字回复；完整英语聊天题图仍待补。 |

<a id="E01"></a>
### E01 · 双语词语配对

**作答方式：**阅读两列词语并点选配对，作答不依赖声音。
**图证状态：**有完整英语题图
**训练目标：**快速辨认两种语言的词义对应。
**输入 → 输出：**两列书面词语。 → 多组一一配对。

**用户操作**

1. 读两列词或短语。
2. 点一个母语词，再点对应英语词；重复完成各组。
3. 按界面反馈推进；本轮未验证错误配对的具体复位时序。

**界面关键点：**两列五组葡语/英语词块，等高按钮与浅灰下沿提示可点；顶部进度和能量，底部无独立检查按钮。
**设计解读：**同一匹配机制可装入 Words 或 Match Madness；限时不是另一题型。
**证据边界：**截图证明英葡语义配对，不能单凭最终配完推断用户会自由拼写或造句。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/)

![完整英语-葡语双语配对题](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-practice-5.png)

图证：完整任务视口；1080×2292；葡语→英语；界面：葡语。完整英语-葡语双语配对题，无独立提交，Home可见；当前图顶部为能量非HP。
[来源文章](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/)

<a id="E02"></a>
### E02 · 英语语境词义—英文定义选择

**作答方式：**阅读英语语境与定义，点选符合词义的一项。
**图证状态：**有完整英语题图
**训练目标：**用英语上下文理解新词，再识别对应英文释义。
**输入 → 输出：**包含突出词语的英语短段落；三个英文定义。 → 一个英文定义选项。

**用户操作**

1. 阅读英语段落并定位突出词语。
2. 比较英文释义并点选一个。
3. 点底部验证。

**界面关键点：**把待解释词语视觉突出，减少寻找成本。 释义与正文均用英语，操作指令可保留母语。
**设计解读：**从上下文到英文释义的匹配可把注意力放在意义，而不只依赖母语对译；单选本身不检验主动造句。
**证据边界：**静态图只能证明此题与所示状态，不能代替全部判分和交互状态实测。
**课程/平台：**官方 B1/B2 英语内容，图片具体为法语→英语；不是所有课程均有的保证。
**套餐：**基础英语课程任务；具体开放方向见第三节，不归入 Sounds 专项。
[来源1](https://blog.duolingo.com/how-duolingo-teaches-english/)

![英文段落中的新词对应三个英文释义；题目元指令法语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-14be41d354c0.png)

图证：完整任务视口；1290×2796；French→English；界面：French。官方公开产品截图；不是本研究者登录后的现场截图。
[来源文章](https://blog.duolingo.com/how-duolingo-teaches-english/)

<a id="E04"></a>
### E04 · 词块翻译：理解英语并译成母语

**作答方式：**阅读英语原句，用母语词块组成译文；朗读是可选辅助。
**图证状态：**有完整英语题图
**训练目标：**把英语词或短句与母语意义联系起来。
**输入 → 输出：**英语原句及母语候选词块。 → 母语译文。

**用户操作**

1. 读原句。
2. 依次点选词块组成译文。
3. 必要时调整，再提交。

**界面关键点：**角色气泡呈现原句，横线区域承接答案，候选词块在下方；已使用词块留下位置占位，便于撤回和查找。
**设计解读：**翻译方向是训练参数；两个方向不是两个新控件。词库干扰词会改变难度。
**证据边界：**此方向主要检查英语理解；母语词块正确不证明能主动组织英语。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)

![用户此前提供的真实深色界面](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-translation-word-bank.jpg)

图证：完整中文界面英语题目视口；1260×2720；中文→英语课程；界面：中文。2026-09-06 前后保存；实际拍摄日期、设备和应用版本未确认。

![完整题目视口](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-intro-4.png)

图证：完整任务视口；936×2025；葡语→英语；界面：葡语。完整题目视口，英语Yes词块翻译成葡语，顶退出进度HP，底检查Home俱全。
[来源文章](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)

<a id="E05"></a>
### E05 · 词块翻译：把母语组织成英语

**作答方式：**阅读母语原句，用英语词块组成译文。
**图证状态：**有完整英语题图
**训练目标：**提取英语词义并在候选范围内组合英语词序。
**输入 → 输出：**母语句子及英语词块。 → 英语译文。

**用户操作**

1. 读原句。
2. 依次点选词块组成译文。
3. 必要时调整，再提交。

**界面关键点：**原文气泡、答案行与词库分区；所选词保留在答案行；绿色结果区同时提供答案解释和继续。
**设计解读：**翻译方向是训练参数；两个方向不是两个新控件。词库干扰词会改变难度。
**证据边界：**本图是正确反馈态。候选已给出拼写，不能等同不带词库的整句写作。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)

![葡语→英语词块翻译：答对后的完整反馈](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-explain-1.png)

图证：完整任务视口；379×816；葡语→英语；界面：葡语。完整官方手机界面含状态栏、退出/返回、全部该状态主要控件和底部Home；葡语UI学习英语。
[来源文章](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)

<a id="E06"></a>
### E06 · 整句自由翻译

**作答方式：**本节采用键盘输入整句译文的分支；语音输入另见 E08。
**图证状态：**有完整英语题图
**训练目标：**独立组织译文并检索拼写。
**输入 → 输出：**母语原句与空白英语输入框。 → 学习者自行输入的完整英语译文。

**用户操作**

1. 读原句。
2. 自行输入整句译文。
3. 检查后提交。

**界面关键点：**大文本框给整句生成留空间；键入与语音输入入口分开。自由输入要保留修改位置，避免反馈时丢失原答案。
**设计解读：**比词块方式少了识别支架；合理译法可不止一种，词块仅显示一种组合不代表唯一译法。
**证据边界：**中文题图证明自由译成英语的编辑态；葡语图证明错误反馈态，两者不是同一题的连续截图。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)

![用户此前提供的真实深色界面](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-translation-free-input.jpg)

图证：完整中文界面英语题目视口；1260×2720；中文→英语课程；界面：中文。2026-09-06 前后保存；实际拍摄日期、设备和应用版本未确认。

![英语自由翻译：错误答案与修正同时保留](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-explain-3.png)

图证：完整任务视口；379×816；葡语→英语；界面：葡语。完整官方手机界面含状态栏、退出/返回、全部该状态主要控件和底部Home；葡语UI学习英语。
[来源文章](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)

<a id="E07"></a>
### E07 · 补全部分翻译

**作答方式：**阅读中文与已有英语译文，键入缺失部分。
**图证状态：**有完整英语题图
**训练目标：**把注意力集中在特定词或句法成分。
**输入 → 输出：**中文原句与已写好一部分的英语译文。 → 补全缺失部分的英语单词或短语。

**用户操作**

1. 对照原句与译文。
2. 在空白处补所缺成分。
3. 提交。

**界面关键点：**原文和部分译文同时可见；已给文本固定，待填位置明确，让用户只处理缺失部分。
**设计解读：**原文提供翻译约束，不能与只凭单语语境填空合并描述。
**证据边界：**需区分语言错误、可接受译法和输入失误。
**课程/平台：**已有中文→英语历史完整题图，具体当前平台和版本未知。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。


![用户此前提供的真实深色界面](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-supported-translation.jpg)

图证：完整中文界面英语题目视口；1260×2720；中文→英语课程；界面：中文。2026-09-06 前后保存；实际拍摄日期、设备和应用版本未确认。

<a id="E09"></a>
### E09 · 英语语境选词填空

**作答方式：**阅读句子并选词补空，不需要根据音频判断。
**图证状态：**有完整英语题图
**训练目标：**根据一句英语的意义选出合适缺词。
**输入 → 输出：**一个缺词的英语句子；三个英文词。 → 一个填入句子的英文词。

**用户操作**

1. 读整句与缺口。
2. 选择一个合适词。
3. 提交检验。

**界面关键点：**将缺口直接置于句子内。 少量并列词项便于比较；反馈应回到完整句义。
**设计解读：**固定句框把注意力集中到词的适用语境；选对不能单独证明学习者能自由拼写该词。
**证据边界：**静态图只能证明此题与所示状态，不能代替全部判分和交互状态实测。
**课程/平台：**图证为葡语→英语；这张展示词汇语义选择，不能拿来证明英语词尾、时态表格等独立语法交互。
**套餐：**基础英语课程任务；具体开放方向见第三节，不归入 Sounds 专项。
[来源1](https://blog.duolingo.com/why-learn-english/)

![英语问句的一个空与三个英文词选项。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-097780145a4b.png)

图证：完整任务视口；1080×2400；Portuguese→English；界面：Portuguese。官方公开产品截图；不是本研究者登录后的现场截图。
[来源文章](https://blog.duolingo.com/why-learn-english/)

![用户此前提供的真实深色界面](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-cloze-correct-feedback.jpg)

图证：完整中文界面英语题目视口；1260×2720；中文→英语课程；界面：中文。2026-09-06 前后保存；实际拍摄日期、设备和应用版本未确认。

<a id="E10"></a>
### E10 · 英语图境辅助选词填空

**作答方式：**根据插图和英语文本选择缺词。
**图证状态：**有完整英语题图
**训练目标：**整合人物情境、图片和英文短文，选择缺词。
**输入 → 输出：**情境插图、含空缺的英语句子或短文、英语候选词。 → 一个填入空位的英语词；需要时展开母语提示。

**用户操作**

1. 查看图和英文语境。
2. 需要时点击词语查看母语提示。
3. 选词补空并继续。

**界面关键点：**图片需服务缺词所需意义。 提示弹层应可关闭，不能替代完整题干。
**设计解读：**图像与短文为词义提供多重线索；提示是支持状态，不应另算一道题型。
**证据边界：**基础图境与中级图文使用相同填空机制；母语提示是可展开状态，不另算一道题。
**课程/平台：**法语→英语 B1/B2 与葡语→英语都有图证；葡语图提供无遮挡完整题干，可与提示展开图相互补充。此操作仍不等同词尾或语法范式表。
**套餐：**基础英语课程任务；具体开放方向见第三节，不归入 Sounds 专项。
[来源1](https://blog.duolingo.com/pt/querido-duolingo-o-duolingo-ensina-gramatica/) · [来源2](https://blog.duolingo.com/how-duolingo-teaches-english/)

![图境辅助英语填空：基础词汇例](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-grammar-4.png)

图证：完整应用题面；官方图未含系统栏；750×1334；葡语→英语；界面：葡语。完整应用题面含退出/进度/题干/图/选项/检查，源图无系统状态栏和Home，非本轮裁剪。目标英语Your dog is funny。
[来源文章](https://blog.duolingo.com/pt/querido-duolingo-o-duolingo-ensina-gramatica/)

![图片+英语语境+一个空+四个英语词块；法语词义提示已展开。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-f5e751b0695a.png)

图证：完整任务视口；1290×2796；French→English；界面：French。整页顶部与底部完整；展开的母语提示遮挡局部句子，属于提示展开状态，不能作为无遮挡题干版本。
[来源文章](https://blog.duolingo.com/how-duolingo-teaches-english/)

<a id="E11"></a>
### E11 · 英语段落阅读理解选择

**作答方式：**从英语段落中找到证据，再选择答案。
**图证状态：**有完整英语题图
**训练目标：**理解一段英语并据此判断人物或信息。
**输入 → 输出：**英语段落、英语理解问题、三个英语答案。 → 一个理解答案。

**用户操作**

1. 阅读段落。
2. 把问题和选项与原文证据对照。
3. 选择答案并提交。

**界面关键点：**正文、提问、选项保持清楚层级。 人物判断可以由多句线索支持，避免图像直接泄露答案。
**设计解读：**需要整合句意和语境，区别于只对译某个单词；能否推理取决于具体题干。
**证据边界：**静态图只能证明此题与所示状态，不能代替全部判分和交互状态实测。
**课程/平台：**西语→英语官方完整题页；不能由这张图推断所有高级英语单元的难度。
**套餐：**基础英语课程任务；具体开放方向见第三节，不归入 Sounds 专项。
[来源1](https://blog.duolingo.com/why-learn-english/)

![英语短段落、英文理解问题与三个英文选项。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-f41406e1d811.png)

图证：完整任务视口；1080×2400；Spanish→English；界面：Spanish。官方公开产品截图；不是本研究者登录后的现场截图。
[来源文章](https://blog.duolingo.com/why-learn-english/)

<a id="E12"></a>
### E12 · 英语对话下一句选择

**作答方式：**阅读已显示的英语对话，选择下一句；播放语音是可选辅助。
**图证状态：**有完整英语题图
**训练目标：**根据英语前一句，选择语义和交际目的合适的回应。
**输入 → 输出：**英语对话开场、空回应气泡、两个英语候选回复。 → 一个完整英语回应。

**用户操作**

1. 理解说话者前一句。
2. 比较候选回应。
3. 选择一项并验证。

**界面关键点：**用左右气泡标明说话轮次。 误选应来自意义或语境差别，避免只靠长度判断。
**设计解读：**考察会话连贯与语用匹配；点选回复和自主说出回复属于不同输出要求。
**证据边界：**静态图只能证明此题与所示状态，不能代替全部判分和交互状态实测。
**课程/平台：**同时有法语→英语、葡语→英语证据；本项没有麦克风，不应写成口语生成题。
**套餐：**基础英语课程任务；具体开放方向见第三节，不归入 Sounds 专项。
[来源1](https://blog.duolingo.com/how-duolingo-teaches-english/) · [来源2](https://blog.duolingo.com/why-learn-english/)

![根据英语对话开场，从两个英语候选句选回应。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-e311f444d8ac.png)

图证：完整任务视口；1290×2796；French→English；界面：French。官方公开产品截图；不是本研究者登录后的现场截图。
[来源文章](https://blog.duolingo.com/how-duolingo-teaches-english/)

![英语对话开场与两个英语回应选项。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/c1866eb0b7-EN-PT_2.png)

图证：完整任务视口；1080×2400；Portuguese→English；界面：Portuguese。官方公开产品截图；不是本研究者登录后的现场截图。
[来源文章](https://blog.duolingo.com/why-learn-english/)

<a id="S01"></a>
### S01 · 故事内容理解单选

**作答方式：**本节按阅读故事文本后回答理解问题的分支整理；故事本身可能伴随配音。
**图证状态：**有完整英语题图
**训练目标：**检验对话意图和事实理解，而非只认单词。
**输入 → 输出：**英语故事上下文、葡语理解问题与三个葡语选项。 → 一个与故事内容相符的选项。

**用户操作**

1. 阅读故事画面中已显示的英语上下文。
2. 从三个理解选项中选择与文本相符的一项。
3. 查看选择标记与反馈，继续故事；本节不要求通过听音取得答案。

**界面关键点：**英语角色对话在上，葡语理解问题和三个选项在下；正确选项以绿色方形勾选标记保留，底部绿色反馈与继续。
**设计解读：**前文成为理解条件，答案需要与故事信息相符；选择题为叙事插入短检查。
**证据边界：**故事内容视口完整，但不是整篇故事长截图；母语提问降低题干本身的英语阅读负担。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/como-o-duolingo-ensina-a-ler-em-outros-idiomas/) · [来源2](https://blog.duolingo.com/de/so-verbessert-duolingo-das-leseverstehen/)

![英语Junior/Eddy对话；葡语内容理解单选，选中正确项。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-fe43138dd7ec.jpg)

图证：完整任务/通话视口；1170×2532；Portuguese→英语；界面：Portuguese。状态栏、退出X、进度、无限资源图标完整。 三个选项、绿色正确反馈、CONTINUAR、Home完整。 角色对话为英语，问题/选择/反馈为葡语。
[来源文章](https://blog.duolingo.com/pt/como-o-duolingo-ensina-a-ler-em-outros-idiomas/)

<a id="S02"></a>
### S02 · 故事里按释义找到英语词或词组

**作答方式：**阅读故事语境及释义，在句子中点选对应英语词或词组。
**图证状态：**有完整英语题图
**训练目标：**结合上下文，将释义对应到故事中的英语表达。
**输入 → 输出：**已读的故事段落，母语或英语释义提示，可点击的英语句子词块。 → 一个对应的英语词或词组。

**用户操作**

1. 读故事上下文与释义提示。
2. 在新句子中点击带边框的对应词或词组。
3. 继续。

**界面关键点：**词块直接嵌在故事句子中；既保留位置和语境，也提供明确点击边界。英语同义提示与母语提示采用相近布局。
**设计解读：**将新词理解检查放在刚遇到它的语境中，减少在词典和正文间跳转；已有上下文帮助推断，词块选择限制产出负担。
**证据边界：**按释义定位词与独立默写不同；两个语言方向的配图不代表一个账号同时拥有全部版本。
**课程/平台：**葡语→英语及韩语导航的英语故事官方示例。
**套餐：**英语 Stories 课程活动；具体内容依课程进度。
[来源1](https://blog.duolingo.com/pt/nivel-certo-de-dificuldade/) · [来源2](https://blog.duolingo.com/ko/zone-of-proximal-development/)

![在英文句子里点击对应葡语cansada的词块tired。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-9e1d9b986229.png)

图证：完整应用题面；官方图未含系统栏；750×1334；Portuguese→英语；界面：Portuguese。退出X、进度/连续正确、能量完整；无系统状态栏。 整句词块和灰色CONTINUAR可见；无系统Home条，不能称完整设备截图。 葡语意思提示→英语词块。
[来源文章](https://blog.duolingo.com/pt/nivel-certo-de-dificuldade/)

![英语任务Choose the option that means seat；句中选bench。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-2892ccef2096.jpg)

图证：完整任务/通话视口；1080×2340；Korean→英语；界面：Korean_navigation; English_task_and_content。Android状态栏、退出X、进度、无限能量齐全；故事上方滚出内容是正常滚动，不是文件裁切。 全部可选词块、韩语继续按钮和Android三键导航完整。 英语故事/任务/词块，韩语继续按钮；源文明确英语Stories。
[来源文章](https://blog.duolingo.com/ko/zone-of-proximal-development/)

![英语任务以usual解释normal；在句中定位同义词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-7c8019ee58d2.jpg)

图证：完整任务/通话视口；1080×2340；Korean→英语；界面：Korean_navigation; English_task_and_content。Android状态栏、退出X、进度、无限能量齐全；顶部故事内容自然滚出。 全部可选词块、韩语继续按钮和Android三键导航完整。 英语故事/任务/词块，韩语继续按钮；不是韩语翻译题。
[来源文章](https://blog.duolingo.com/ko/zone-of-proximal-development/)

<a id="S03"></a>
### S03 · 故事末尾开放写作

**作答方式：**按阅读故事后键入英语回应归类；英语完整写作题图仍待补。
**图证状态：**官方确认英语功能；完整题图待补
**训练目标：**由学习者自行选择表达长度和语法，练习生成内容。
**输入 → 输出：**故事后的开放问题；具体英语题面待补。 → 学习者自行组织的英语回答。

**用户操作**

1. 完成故事。
2. 若该故事提供开放写作，在结尾用英语自由组织回应；本轮未获得英语题屏，具体字数/按钮/反馈不推断。

**界面关键点：**本轮未取得英语开放写作题屏，输入框、字数要求、提交按钮与反馈布局不作视觉断言。
**设计解读：**撤去有限候选，让学习者用英语重新组织故事信息；与识别正确选项相比，增加了词汇提取、句法生成和内容组织的要求。具体长度约束未获英语题图确认。
**证据边界：**原跨语种研究中的法语写作图已移出。不能将10–60词等非英语截图要求推广到英语。
**课程/平台：**葡语官方说明部分英语 Stories 有开放写作；韩语文章仍将该方向描述为未来扩展。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/nivel-certo-de-dificuldade/) · [来源2](https://blog.duolingo.com/ko/zone-of-proximal-development/)

完整英语题图待补；未使用其他目标语言或生成图代替。

<a id="A02"></a>
### A02 · Adventures 英语回应选择

**作答方式：**图中问题与两个回应均有英语文字，可通过阅读和点选完成；本轮未实测静音流程。
**图证状态：**有完整英语题图
**训练目标：**在交际目标中选择有用表达；错误可由人物反应进行引导。
**输入 → 输出：**英语角色问题、任务情境与两个英语候选回应。 → 一句符合交际目的的英语回应选项。

**用户操作**

1. 进入角色对话。
2. 阅读画面中的英语问题与两个候选回应。
3. 点击符合任务与语境的一句英语回应。

**界面关键点：**英语角色提问叠在场景上，两条英语回应在底部；本图没有传统检查按钮。
**设计解读：**回应是否合适要联系人物和任务目标；界面用场景反馈维持行动的连续性。
**证据边界：**复用同一官方多屏图，新增的是任务目标分析，不把同图重复计成新的独立截图。
**课程/平台：**西语→英语场景示例；点击回应后的正确/错误分支待实测。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/es/aventuras-duolingo/)

![左：美国旗英语路径；中：Óscar城市场景；右：Zari英语提问与两个英语回应。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-a59a1693ee21.png)

图证：官方多屏排版；各手机视口完整；1400×800；Spanish→英语；界面：Spanish。左有课程旗/资源栏；中右有退出X；手机顶部边界齐全。 路径底部导航/Home；场景Home；对话两选项和Home均可见，无独立Check。 西语界面入口美国旗，右屏问答为英语；原文明确西语母语学英语。
[来源文章](https://blog.duolingo.com/es/aventuras-duolingo/)

<a id="M01"></a>
### M01 · Roleplay / Bate-Papo 英语多轮情境聊天

**作答方式：**依据官方文字聊天说明归类，输入为英语文字回复；完整英语聊天题图仍待补。
**图证状态：**官方确认英语功能；完整聊天题图待补
**训练目标：**把课程语言用于有目的的开放交流。
**输入 → 输出：**沟通情境、任务目标与角色发来的多轮消息；依据官方文字说明。 → 学习者自行组织的英语文字回复及任务后的表达反馈。

**用户操作**

1. 从已开放此功能的 Max 英语课程进入情境任务。
2. 按任务目标用英语回复角色，进行多轮交流。
3. 完成后阅读关于表达的反馈；英语版具体输入控件与反馈版式待补图。

**界面关键点：**官方说明采用多轮聊天与完成后反馈，但本轮没有可用的英语完整聊天原图。目录入口不计为题图。
**设计解读：**情境目标为开放回复设定边界；聊天与事后复盘承担不同职责。
**证据边界：**已排除复用法语聊天截图。现有证据足以说明功能和大致流程，不足以逐控件评价英语版聊天画面。
**课程/平台：**葡语/日语 Max 官方页2026-01更新支持英语；iOS/Android说明不代表全账号同时上线。
**套餐：**Max；已确认葡语→英语与日语→英语。
[来源1](https://blog.duolingo.com/pt/duolingo-max-gpt-4/) · [来源2](https://blog.duolingo.com/ja/max-subscription/) · [来源3](https://blog.duolingo.com/pt/como-o-duolingo-ensina-a-ler-em-outros-idiomas/)

完整英语题图待补；未使用其他目标语言或生成图代替。

<a id="listening-speaking"></a>
## 4.2 听力与口语相关题目

以下按当前展示的听音或口头作答形式集中整理，包含听写、听辨、朗读、语音输入、Radio 与口语通话。

<a id="E03"></a>
### E03 · Flashcards：主动说出英语词

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**从母语词义提示主动提取英语词。
**输入 → 输出：**一张母语词语卡及录音入口。 → 口头英语词；官方也说明可改为键入。

**用户操作**

1. 阅读当前卡面的母语词；官方示例一组五张。
2. 用英语说出对应词；不方便说话可切换键入。
3. 根据官方说明：正确卡变绿并移开；错误卡展示并朗读答案，回到队尾再练。
4. 结束查看词卡总结；该公告以至少三项正确作为通过条件，未实测当前账号阈值。

**界面关键点：**中央单张卡占据视觉重心；录音按钮在下方，另有不能说话入口；结果页保留词卡，并用状态、词语和反馈提示完成情况。
**设计解读：**撤去答案候选以增加主动提取；把一次任务缩小到一个词，减少句法生成的额外难度。结果列表便于识别哪些词需要再提取。
**证据边界：**图证包含口述状态和结果三屏；没有键入状态全图。官方说明容许部分拼写/发音近似，但判定阈值与算法未公开。
**课程/平台：**葡语官方明确葡语→英语词汇卡；不由此推出全部英语课程已开放。
**套餐：**普通课程词汇提取题；公告未给出完整套餐/逐平台矩阵，无 Super/Max 独占依据。
[来源1](https://blog.duolingo.com/pt/flashcards-do-duolingo/)

![葡语→英语口述词汇卡](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/literacy-english-flashcards-question.png)

图证：完整任务视口；375×812；葡语→英语；界面：pt。卡面 menino；需产出英语 boy。截图为录音交互状态。
[来源文章](https://blog.duolingo.com/pt/flashcards-do-duolingo/)

![英语词汇卡总结的三个结果状态](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/literacy-english-flashcards-results.png)

图证：官方三屏排版；各手机结果页完整；1157×812；葡语→英语；界面：pt。官方拼图，不是单屏；英语词 boy/dog/apple/cat/book。不同状态显示绿色、灰色或红色结果卡。
[来源文章](https://blog.duolingo.com/pt/flashcards-do-duolingo/)

<a id="E08"></a>
### E08 · 英语翻译的语音输入变体

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**在翻译任务中增加口头检索。
**输入 → 输出：**原句、译文输入框和语音输入按钮。 → 由语音转写的译文文本。

**用户操作**

1. 点语音输入。
2. 口头说出译文。
3. 查看转写，必要时编辑后提交。

**界面关键点：**完整中文题图的文本框下方有独立录音横条，位于检查按钮上方，图示状态为灰色；官方葡语局部图展示独立的触摸说话入口及键盘。
**设计解读：**这是输入方式变体；与照给定答案朗读的评分任务不同。
**证据边界：**已取得完整翻译题面及语音入口，但录音中、转写失败、确认转写等状态仍待实测；不是自由对话或专用音素评分。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/melhor-jeito-de-aprender-com-o-duolingo/)

![用户此前提供的真实深色界面](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-translation-free-input.jpg)

图证：完整中文界面英语题目视口；1260×2720；中文→英语课程；界面：中文。2026-09-06 前后保存；实际拍摄日期、设备和应用版本未确认。

![触摸说话与键盘替代输入](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-ways-4.png)

图证：官方局部图；顶部题干与进度被裁去；750×1334；葡语→英语；界面：葡语。这是来源自带的局部图，本报告未补画或扩图。
[来源文章](https://blog.duolingo.com/pt/melhor-jeito-de-aprender-com-o-duolingo/)

<a id="E13"></a>
### E13 · 词块听写/听后重组

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**识别语流中的词和顺序。
**输入 → 输出：**英语句子音频、正常/慢速播放按钮与英语词块。 → 按所听内容排列的英语词块序列。

**用户操作**

1. 听音频，可重播或慢放。
2. 按听到顺序点选词块。
3. 提交。

**界面关键点：**正常和慢速播放在同一气泡内并列；答案横线在上、英语候选块在下；底部按钮处于未作答禁用态。
**设计解读：**要求还原原句；不是翻译，也不是听后概括意义。
**证据边界：**单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)

![完整题目视口](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-intro-5.png)

图证：完整任务视口；1170×2532；葡语→英语；界面：葡语。完整题目视口，英语音频词块听写，正常/慢速，底部CONTINUAR及Home。
[来源文章](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)

<a id="E14"></a>
### E14 · 听后理解并选答

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**理解语段意义而非逐字复写。
**输入 → 输出：**英语音频、英语理解问题与三个英语文字选项。 → 一个理解答案。

**用户操作**

1. 播放英语材料，需要时重播或慢速播放。
2. 阅读理解问题及三个文字选项，选择符合音频含义的答案。
3. 提交查看反馈并继续。

**界面关键点：**英语音频可正常/慢速播放；英语理解问题在材料下，三项英语答案纵排；另有现在不能听与检查。
**设计解读：**2026 官方完整图的选项也使用音频，不宜统一画成文字单选。
**证据边界：**本图不是听写，也没有完整听力文本。无法从静态图确认实际音频或自动播放节奏。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/)

![完整英语听后选答 What time of day is it? 三选一、慢速、无法听音、检查、Home可见。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-practice-7.png)

图证：完整任务视口；1080×2292；葡语→英语；界面：葡语。完整英语听后选答 What time of day is it? 三选一、慢速、无法听音、检查、Home可见。
[来源文章](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/)

<a id="E15"></a>
### E15 · 英语整句跟读与朗读

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**练习发音、节奏与完整句表达。
**输入 → 输出：**给定英语句子、可播放示范与录音入口。 → 按给定文字朗读的英语语音；识别反馈由应用呈现。

**用户操作**

1. 听示范或读句子。
2. 点击麦克风。
3. 按给定内容说出句子。

**界面关键点：**目标英语句置于说话气泡，音频可重播；大麦克风是主要动作，底部不能说话提供退出当前录音要求的入口。
**设计解读：**给定原句减少内容组织负担，把注意力集中于声音产出；同一交互可承载短语或较长句子。
**证据边界：**Falstaff 或 Lily 出现不代表 Video Call；这些是普通跟读题。语音识别通过不能证明自由交流或音素逐项评分。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/) · [来源2](https://blog.duolingo.com/pt/melhor-jeito-de-aprender-com-o-duolingo/)

![完整普通课英语跟读Coffee, please.](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-practice-6.png)

图证：完整任务视口；1080×2292；葡语→英语；界面：葡语。完整普通课英语跟读Coffee, please.，Falstaff造型；不是Max Video Call，麦克风、无法说话、Home可见。
[来源文章](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/)

![完整英语跟读句子](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-ways-3.png)

图证：完整任务视口；1080×2300；葡语→英语；界面：葡语。完整英语跟读句子，Lily造型；不是Video Call，麦克风/无法说话/Home可见。
[来源文章](https://blog.duolingo.com/pt/melhor-jeito-de-aprender-com-o-duolingo/)

<a id="E16"></a>
### E16 · 理解英语问题并说出正确回应

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**结合理解与受约束口语产出。
**输入 → 输出：**可播放的英语问句、两个英语完整回应与各自麦克风。 → 给定候选中符合语境的一句英语口头回应。

**用户操作**

1. 理解问题。
2. 选定适合的回应。
3. 对麦克风说出该回应。

**界面关键点：**上方英语问句可重播；两条英语回复各自带麦克风。底部有现在不能说话和灰色 CONTINUAR，原图保留完整 Home 条。
**设计解读：**既要判断意义，也要说出来；仍是有答案范围的对话，不能称开放 AI 会话。
**证据边界：**完整图确认了作答入口；录音与选项的具体点击时序、识别结果及失败恢复未实测。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)

![完整英语口说选答视口；顶部退出、进度与爱心](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-intro-6.png)

图证：完整英语口说选答视口；包括 CONTINUAR 与 Home 条；1170×2532；葡语→英语；界面：葡语。完整英语口说选答视口；顶部退出、进度与爱心，两麦克风答案，底部不能说话、CONTINUAR 与 Home 条均可见。
[来源文章](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)

<a id="E17"></a>
### E17 · 英语近音词听辨二选一

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**区分两种相近英语语音并辨认听到的词。
**输入 → 输出：**一段单词音频与两个近音英文词。 → 两个词中的一个。

**用户操作**

1. 播放或重听单词。
2. 选听到的英文词。
3. 点 CHECK。

**界面关键点：**重听入口突出。 两个选项只需承担当前声音对比。
**设计解读：**让注意力集中在对立音的听觉差别；书面词参与，仍可能受拼写熟悉度影响。
**证据边界：**静态图只能证明此题与所示状态，不能代替全部判分和交互状态实测。
**课程/平台：**英语 Sounds 专项；源语言未公开，图中 UI 为英文。
**套餐：**英语 Sounds 专项；具体课程方向与平台开放范围见来源说明。
[来源1](https://blog.duolingo.com/duolingo-english-sounds-tab/)

![听一个单词，从两个近音英文词中选一个。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/f6eed61af4-IMG_3253.PNG)

图证：完整任务视口；1170×2532；未公布源语言→English；界面：English。官方公开产品截图；不是本研究者登录后的现场截图。
[来源文章](https://blog.duolingo.com/duolingo-english-sounds-tab/)

<a id="E18"></a>
### E18 · 英语两段声音同异判断

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**不先读单词，比较两段语音是否相同。
**输入 → 输出：**两个可独立播放的声音；同词/不同词判断。 → 同一词或不同词的二分判断。

**用户操作**

1. 分别播放两段声音。
2. 比较并选择同或异。
3. 继续下一题。

**界面关键点：**两段音频位置和播放状态要可辨。 不要把这一操作混称为朗读或拼写题。
**设计解读：**比拼写选择更直接聚焦声音差异；答对仍不等于能准确发音。
**证据边界：**静态图只能证明此题与所示状态，不能代替全部判分和交互状态实测。
**课程/平台：**英语 Sounds 专项；独立原子操作，不与 E17 合并为同一界面。
**套餐：**英语 Sounds 专项；具体课程方向与平台开放范围见来源说明。
[来源1](https://blog.duolingo.com/duolingo-english-sounds-tab/)

![播放两段声音，判断同词还是不同词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/6023c5837b-IMG_3254.PNG)

图证：完整任务视口；1170×2532；未公布源语言→English；界面：English。官方公开产品截图；不是本研究者登录后的现场截图。
[来源文章](https://blog.duolingo.com/duolingo-english-sounds-tab/)

<a id="E19"></a>
### E19 · 英语声音—书面词语配对

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**把英语语音与对应拼写建立联系。
**输入 → 输出：**一列音频按钮与一列英语词；本图为四对近音词。 → 一组声音与英文词的对应关系。

**用户操作**

1. 播放一个声音。
2. 点选对应英语词组成一对。
3. 逐对配完并继续。

**界面关键点：**四个声音按钮与四个英语词并排；选中颜色与描边反馈关系，底部继续按钮及 Home 边界完整。
**设计解读：**可重复比较音形关系；Sounds 中的近音限制是材料变体，不是第二种配对原子操作。
**证据边界：**静态图只能证明此题与所示状态，不能代替全部判分和交互状态实测。
**课程/平台：**采用官方韩语版英语 Sounds 全图；英文旧配对图因页尾缺失没有计入完整覆盖。
**套餐：**英语 Sounds 专项；具体课程方向与平台开放范围见来源说明。
[来源1](https://blog.duolingo.com/ko/practice-english-sounds/)

![韩语界面、英语音频词汇配对](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-a5ab15e73d80.png)

图证：完整英语配对题目视口；1170×2532；韩语界面→英语 Sounds；界面：ko。指令是韩语；配对对象是英语，不应因界面语言排除。原图 URL 从官方文章 HTML 取出。
[来源文章](https://blog.duolingo.com/ko/practice-english-sounds/)

<a id="R01"></a>
### R01 · Radio 听音选指定数量的词

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**把连续语流对应到词形。
**输入 → 输出：**Radio 英语音频、五个英语词与选出三个的指令。 → 三个被选中的英语词。

**用户操作**

1. 听音频，可按扬声器重听。
2. 在5个英语词中选听到的3个。
3. 查看即时选中/正误状态。

**界面关键点：**主持人场景在上，播放按钮与五个英语词在下；题干明确选三个。两图分别为未选和三词已变绿，但不是同一题的连续状态。
**设计解读：**从连续音频检索指定词，重点是听觉分段与词形辨认。
**证据边界：**没有独立提交按钮；达到数量后是否立即推进、误选怎样回退未实测。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/melhorar-o-listening-com-a-duoradio/)

![Junior电台；同类听音选3词，尚未选答。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-39ad2c784008.png)

图证：完整任务/通话视口；375×812；Portuguese→英语；界面：Portuguese。状态栏、退出X、进度、心完整。 五个英语词与Home完整，无独立提交键。 葡语指令、英语候选词，加英语课程正文。
[来源文章](https://blog.duolingo.com/pt/melhorar-o-listening-com-a-duoradio/)

![Lucy电台；从5个英语词选听到的3个，当前3词绿色。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-7b0fb630c899.png)

图证：完整任务/通话视口；375×812；Portuguese→英语；界面：Portuguese。状态栏、退出X、进度、5颗心数值完整。 全部词选项与Home完整，无独立提交键。 葡语指令加英语候选词；原文明确葡语母语学英语。
[来源文章](https://blog.duolingo.com/pt/melhorar-o-listening-com-a-duoradio/)

<a id="R02"></a>
### R02 · Radio 音频与母语释义配对

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**直接从声音提取词义。
**输入 → 输出：**四个音频按钮与四个葡语释义；英语音频方向由课程来源确认。 → 四组英语声音与母语意义的配对。

**用户操作**

1. 点左列音频。
2. 点右列对应葡语释义。
3. 逐对完成四组。

**界面关键点：**电台场景保持稳定，下面四行分别放声音按钮与葡语释义；底部Home边界完整。
**设计解读：**音频与释义建立直接联系，配对使短时理解能立即接受检验。
**证据边界：**图上看不到声音内容；音频为英语的依据是官方英语课程上下文，本轮没有播放核验。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/melhorar-o-listening-com-a-duoradio/)

![Lucy电台；4个音频按钮和4个葡语释义配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-8dec6cd5789a.png)

图证：完整任务/通话视口；375×812；Portuguese→英语；界面：Portuguese。状态栏、退出X、进度、心完整。 四行配对与Home完整，无独立提交键。 静态图仅显示葡语释义；英语音频方向由该英语课程官方文章上下文支持，本次未播放音频。
[来源文章](https://blog.duolingo.com/pt/melhorar-o-listening-com-a-duoradio/)

<a id="R03"></a>
### R03 · Radio 判断理解正误

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**检查叙事意义而非逐字转写。
**输入 → 输出：**Radio 英语音频、一个英语陈述和真/假按钮。 → 对陈述是否符合所听内容的判断。

**用户操作**

1. 听情节。
2. 读英语陈述，选✓或×。
3. 需要时用底部音频播放/跳转控件回顾。

**界面关键点：**陈述实际为英语，下方是✓/×两大按钮；底部有后退5秒、暂停、前进5秒。
**设计解读：**将连续信息压缩为一个真假判断，操作轻，但猜测概率较高。
**证据边界：**网页替代文字将该句写成葡语，已按原图纠正。二选判断有猜测空间，应结合多题表现解释结果。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/melhorar-o-listening-com-a-duoradio/)

![Zari电台，英语陈述下方✓/×判断。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-b84e85759823.png)

图证：完整任务/通话视口；375×812；Portuguese_from_article_context→英语；界面：English_prompt_with_icon_controls。状态栏、退出X、进度、心完整。 ✓/×、后退5秒/暂停/前进5秒与Home完整。 陈述“She doesn’t care about her date.”实际为英语；原文说明葡语→英语。网页alt误称此句葡语，已按图纠正。
[来源文章](https://blog.duolingo.com/pt/melhorar-o-listening-com-a-duoradio/)

<a id="R04"></a>
### R04 · Radio 听音选择图片

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**建立音义与视觉指代的联系。
**输入 → 输出：**英语 Radio 情节音频与两张对象图片。 → 一张符合所听内容的图片。

**用户操作**

1. 听电台上下文。
2. 从两张图片选择相符的一张。

**界面关键点：**主持人、来电者与录音设备建立节目语境；底部播放波形和两张图卡承担作答，没有英语拼写输入负担。
**设计解读：**用图像作答减少拼写负担，让听到的意义映射到场景对象。
**证据边界：**音频英语方向由课程文章确定，静态图不能验证具体音频；选图不等于普通词汇图片单选已补齐。
**课程/平台：**已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)

![完整英语课程Radio听音选图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-intro-9.png)

图证：完整任务视口；1170×2532；葡语→英语；界面：葡语。完整英语课程Radio听音选图，葡语题干，糖/肉图选，无独立检查，底部Home可见。
[来源文章](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)

<a id="M02"></a>
### M02 · Video Call with Lily 英语自由对话

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**降低实时口语练习的门槛，练习即时组织语言。
**输入 → 输出：**Lily 在通话中的英语话语与后续提问。 → 学习者即时组织的英语口头回应。

**用户操作**

1. 从英语课程的视频节点拨打Lily。
2. 听Lily并用英语自由回应，围绕提示或自选话题继续。
3. 按挂断结束；当前Max公告说明可查看转录。

**界面关键点：**官方旧三屏提供英语入口、呼叫、通话；较新屏以Lily和背景场景为中心，底部红色挂断突出。
**设计解读：**通话隐喻把重心转向轮流听说；缺少固定答案，要求在线组织内容。
**证据边界：**通话画面本身无英语台词，目标英语由入口和官方上下文关联；未声称本轮进行了口语通话、转录或结果验收。
**课程/平台：**葡语→英语入口与 Max 文档；日语→英语也有官方可用性说明。
**套餐：**Max。
[来源1](https://blog.duolingo.com/pt/videochamada/) · [来源2](https://blog.duolingo.com/pt/melhor-jeito-de-aprender-com-o-duolingo/) · [来源3](https://blog.duolingo.com/pt/duolingo-max-gpt-4/) · [来源4](https://blog.duolingo.com/ja/max-subscription/) · [来源5](https://blog.duolingo.com/video-call-research-report/)

![英语课程入口→呼叫Lily→中性Lily通话画面。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-816d9a18e787.png)

图证：官方多屏排版；各手机视口完整；1400×800；Portuguese→英语；界面：Portuguese_in_first_two_panels; icon_only_in_call。左美国旗与葡语Seção 5 unidade 1；三屏完整机框顶部。 左拨打/跳过及导航，右红挂断，三屏Home均可见。 英语目标由左屏美国旗和文章/alt的English course说明关联；右侧通话本身无英语台词。
[来源文章](https://blog.duolingo.com/pt/videochamada/)

![完整Lily视频通话页面含场景、挂断、Home；画面语言中性](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-ways-5.png)

图证：完整通话视口；英语方向由官方课程上下文确定；1080×2300；葡语→英语；界面：葡语。完整Lily视频通话页面含场景、挂断、Home；画面语言中性，英语方向来自葡语官方文章说明。
[来源文章](https://blog.duolingo.com/pt/melhor-jeito-de-aprender-com-o-duolingo/)

<a id="M03"></a>
### M03 · Video Call with Falstaff 英语引导对话

**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**图证状态：**有完整英语题图
**训练目标：**以提示、翻译、母语实时反馈支持不够自信的学习者。
**输入 → 输出：**Falstaff 面向初学者的英语问题、引导与可选字幕。 → 在引导下组织的英语口头回应。

**用户操作**

1. 在可用Max课程进入Falstaff引导通话。
2. 听按水平设置的问题并口头回应。
3. 需要时使用字幕及提示；按挂断结束。

**界面关键点：**Falstaff正面对话，英语字幕位于下方，红色挂断与蓝色CC控件分开；原图保留完整通话边界。
**设计解读：**给初学者更明确的提示、翻译与反馈，使开放口语要求保持可完成。
**证据边界：**截图无母语文字，不因来源文章为葡语就把界面写成葡语。普通Falstaff跟读归E15，与通话分开。
**课程/平台：**2026葡语官方公告包含英语目标、明确iOS；全面扩大到更多水平是目标，未当作既成事实。
**套餐：**Max 初学者引导通话。
[来源1](https://blog.duolingo.com/pt/videochamada-com-falstaff-conversacao/)

![Falstaff正面对话，英文字幕What would you like?。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-7ebc190c21be.png)

图证：完整任务/通话视口；750×1624；not_visible→英语；界面：icon_only_except_English_caption。完整时间/信号/WiFi/电池状态栏。 红色挂断、蓝色CC、屏幕下边缘完整；未显示系统Home横条。 英文字幕直接证明目标英语；截图没有母语文字，不能因文章葡语就称葡语UI。
[来源文章](https://blog.duolingo.com/pt/videochamada-com-falstaff-conversacao/)

<a id="supporting-interaction"></a>
## 4.3 场景探索：辅助交互

场景探索可依靠画面与文字线索操作，承担进入情境和触发任务的作用；本报告将其与独立语言判分题分开。

<a id="A01"></a>
### A01 · Adventures 场景探索/点物/读标牌

**作答方式：**场景探索本身不是独立语言判分题。
**图证状态：**有完整英语题图
**训练目标：**借环境线索推断意义，形成任务目的。
**输入 → 输出：**场景目标、地图、角色及可交互对象。 → 探索与触发情境的操作；这些动作本身不等同于英语能力判分。

**用户操作**

1. 观察场景和目标。
2. 移动角色并点人物/物体，读取出现的信息。
3. 用环境线索完成情境动作。

**界面关键点：**官方三屏依次展示英语入口、完整城市地图和英语对话；退出入口在场景左上，人物与物件保留空间关系。
**设计解读：**语言信息分布在场景里，探索动作给阅读和理解一个需要完成的目的。
**证据边界：**截图证明场景与控件布置；具体移动手势、碰撞和所有可交互物体未实测。
**课程/平台：**2024公告明确西语→英语、iOS/Android；未证实中文英语方向当前覆盖。
**套餐：**基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。
[来源1](https://blog.duolingo.com/es/aventuras-duolingo/)

![左：美国旗英语路径；中：Óscar城市场景；右：Zari英语提问与两个英语回应。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/english-a59a1693ee21.png)

图证：官方多屏排版；各手机视口完整；1400×800；Spanish→英语；界面：Spanish。左有课程旗/资源栏；中右有退出X；手机顶部边界齐全。 路径底部导航/Home；场景Home；对话两选项和Home均可见，无独立Check。 西语界面入口美国旗，右屏问答为英语；原文明确西语母语学英语。
[来源文章](https://blog.duolingo.com/es/aventuras-duolingo/)

## 5. 入口、课程容器与反馈层


### P01 · 英语练习目录、词汇表与错题集

按薄弱技能和历史错误组织复习；复用已列出的语言任务。
操作：进入 Practice，选择听、说、词汇或错题。 在对应合集点击开始；词汇表可点扬声器听词。 完成选出的练习。
界面：技能入口采用图标+名称的大块条目；词汇与错题列表展示待复习内容；Max对话另有标识。
边界：目录和列表都是完整视口，但不算答题截图；2026英语课程基础练习已宣布免费。

![完整葡语练习目录视口](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-practice-1.png)

图证：完整练习目录；不是题页；1080×2292；葡语→英语；界面：葡语。完整葡语练习目录视口，视频/Bate-Papo列于MAX区域；非题页。
[来源文章](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/)

![完整英语词汇列表入口及音频词典](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-practice-4.png)

图证：完整英语词汇列表视口；不是题页；1080×2292；葡语→英语；界面：葡语。完整英语词汇列表入口及音频词典，明确em inglês；非题页。
[来源文章](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/)

![完整英语错题入口及列表视口](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-practice-2.png)

图证：完整错题列表视口；不是题页；1080×2292；葡语→英语；界面：葡语。完整英语错题入口及列表视口，列表可滚动；非题页。底部列表含Escreva o que escutar，提供英语键入听写存在的间接证据。
[来源文章](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/)

### P02 · Sounds：英语音素目录

用音素格、例词与声音帮助用户定位发音差别，再进入E17–E19的任务。
操作：选择元音或辅音区。 点格子听声音。 点开始进入成对声音练习。
界面：目录中音素符号、例词和播放入口相邻；辅音截图为滚动状态。
边界：目录格不是独立题型；本轮未找到学习App逐音素录音评分的完整证据。

![英语元音目录](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/2da0aef654-IMG_3251.PNG)

图证：完整发音目录视口；不是题页；1170×2532；英语专项；母语方向按来源说明；界面：en。三列音素、例词、进度；目录入口，不算一道题。
[来源文章](https://blog.duolingo.com/duolingo-english-sounds-tab/)

![英语辅音目录（已滚动）](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/88645bfa40-IMG_3252.PNG)

图证：完整目录滚动视口；不是题页；1170×2532；英语专项；母语方向按来源说明；界面：en。滚动状态不是图片裁切。
[来源文章](https://blog.duolingo.com/duolingo-english-sounds-tab/)

### P03 · Stories：逐句读听与推进

在人物关系和连续事件中组织英语输入，穿插S系列任务。
操作：阅读当前句子或角色对话。 需要时点击该句扬声器重听。 点继续进入下一段或理解问题。
界面：角色头像区分说话者；每句有声音入口；内容可滚动，底部继续保持明确。
边界：这是完整故事阅读视口，不是整个故事的长截图，也不代表答题状态。

![完整英语Stories朗读推进页A Date](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-intro-8.png)

图证：完整英语故事阅读视口；1170×2532；葡语→英语；界面：葡语。完整英语Stories朗读推进页A Date，音频气泡和底部继续Home可见；非理解测验。
[来源文章](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)

### P04 · 正确、错误与英语答案解释

让学习者在作答后看见结果、修正和原因。
操作：完成一道英语翻译题并提交。 在正确或错误反馈中点击解释。 查看原答案、正确表达与母语说明，再继续课程。
界面：正确反馈使用绿色，错误使用红色，并都有图标/文字；解释页把当前语言片段用蓝色突出，底部继续课程。
边界：本轮有完整英语课程例图。葡语→英语免费已确认；并未推定所有母语方向均免费开放。

![完整官方手机界面含状态栏、退出/返回、全部该状态主要控件和底部Home；葡语UI学习英语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-explain-1.png)

图证：完整正确反馈视口；379×816；葡语→英语；界面：葡语。完整官方手机界面含状态栏、退出/返回、全部该状态主要控件和底部Home；葡语UI学习英语。
[来源文章](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)

![完整官方手机界面含状态栏、退出/返回、全部该状态主要控件和底部Home；葡语UI学习英语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-explain-2.png)

图证：完整正确答案解释页；379×816；葡语→英语；界面：葡语。完整官方手机界面含状态栏、退出/返回、全部该状态主要控件和底部Home；葡语UI学习英语。
[来源文章](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)

![完整官方手机界面含状态栏、退出/返回、全部该状态主要控件和底部Home；葡语UI学习英语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-explain-3.png)

图证：完整错误反馈视口；379×816；葡语→英语；界面：葡语。完整官方手机界面含状态栏、退出/返回、全部该状态主要控件和底部Home；葡语UI学习英语。
[来源文章](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)

![完整官方手机界面含状态栏、退出/返回、全部该状态主要控件和底部Home；葡语UI学习英语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-explain-4.png)

图证：完整错误原因解释页；379×816；葡语→英语；界面：葡语。完整官方手机界面含状态栏、退出/返回、全部该状态主要控件和底部Home；葡语UI学习英语。
[来源文章](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)

### P05 · 英语路径与课程编排

把知识点练习、故事、电台、听说和对话按课程目标组织。
操作：查看当前单元目标。 点路径上可用节点。 进入该节点承载的练习或情境。
界面：旗帜标识目标英语；单元目标在顶部，节点用耳机、书本、话筒等图标区分活动。
边界：所示为历史公开英语路径。节点数量、分数和XP不能当作当前每个课程固定配置。

![完整英语路径入口页](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/root-pt-intro-7.png)

图证：完整英语路径入口；不是题页；1170×2532；葡语→英语；界面：葡语。完整英语路径入口页，US旗，葡语界面，非题页。
[来源文章](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)

## 6. 英语题目的画面 UI 设计规律

### 6.1 稳定的视觉层级让注意力留给语言

普通题页大致分为进度、指令、学习材料、答案区、主操作五层。进度告诉用户还要做多少；指令说明本题动作；播放/录音按钮承担输入通道；答案区有明确空位或选中状态；底部按钮收束操作。配对和实时通话没有必要强行保留同样的检查按钮。

E04/E06/E07/E09 的中文深色图与大量官方浅色图体现了相近的任务结构。主题颜色可以变化，题干、可操作控件、反馈和下一步仍需容易识别。截图没有给出可验证的字体文件、字号系统或统一色值，报告不把截图取色当成官方设计规范。

### 6.2 控件与英语学习的困难一一对应

| 控件 | 承担什么工作 | 设计时要检查什么 |
| --- | --- | --- |
| 两列词卡 | 比较跨语言或音文关系 | 两列是否对齐，选中、正确与已完成是否清楚 |
| 词块与答案行 | 支持词序组合、减少拼写负担 | 能否理解撤回/修改，长句是否造成过多换行 |
| 文本框与局部空缺 | 控制自主生成范围 | 输入后原文是否仍可见，键盘是否遮住修改位置 |
| 正常/慢速播放 | 让听力困难可调 | 重播是否可发现，播放状态是否与录音状态区分 |
| 大麦克风 | 启动语音产出 | 用户能否知道在录音、识别还是等待；静态图不能证明这些状态已实现 |
| 角色对话气泡 | 说明谁在说话及轮次 | 角色不能遮挡文字，正确回应应依赖语义与目的 |
| 语境插图 | 说明对象、动作或情绪 | 图意是否准确，是否无意替用户透露了全部答案 |
| 反馈区与解释页 | 关闭当前任务并帮助修正 | 保留原答案、正确表达与原因，下一步入口稳定 |

### 6.3 颜色与文字共同表示状态

已核验浅色题页常见深灰正文、浅灰边框、蓝色音频/选中态和绿色继续/通过。英语错误解释图使用红色，但也保留“错误”文本、图标与正确表达。不能只靠红绿判断。未作答时灰色按钮提示不能提交；选中与“已答对”是两个不同状态。

早期图的心、2026图的能量和订阅无限图标属于版本差异。本轮没有逐账号核实扣减规则，不把这些图标当作统一现行商业规则。

### 6.4 角色和场景的价值在于让语言有对象

普通题角色可承担说话者身份；故事角色维持人物关系；Radio 主持桌与来电头像解释当前正在听谁；Adventures 地图把语言放进购买、询问等目的；Video Call 让用户围绕轮流说话作出回应。它们需要的画面结构不同，不应只套一张通用答题卡。

英语词汇图应清楚表达对象，句子插图应清楚表达关系，装饰性角色不应替代题目所需信息。简化形状和角色一致性是官方美术语言的公开方向；具体画面在本报告中只按可见证据分析。[官方美术语言](https://blog.duolingo.com/shape-language-duolingos-art-style/)

### 6.5 反馈时机应服从任务目标

普通填空可以提交后立刻纠错；英语开放对话需要保留表达的连贯性；答案解释适合让用户自主停留。系统若把每次语音识别失败都归类成英语错误，会混淆设备状态与学习结果。本报告据此提出设计要求，未声称测量了 Duolingo 的实际延迟、触觉或全部动效。

## 7. 可用于后续英语课程设计的结论

以下是分析建议，不是本项目已经开发的功能。

1. **先写能力目标再选控件。** 让一道题明确训练英语词义、听辨、词序、语法、拼写或交际目的。相同画面结构可以服务不同目标，但反馈必须对应目标。
2. **在同一知识点上逐步减少帮助。** 从辨认进入提取，再到句子和情境。不是把所有题都做得更难，而是知道当前提供了哪一层支架。
3. **把翻译方向写进题目规范。** 英译中文与中译英语都可属于英语课程；它们对理解和产出的要求不同，不能用同一种通过率解释学习效果。
4. **英语语法不等于单列“语法题”。** 主谓搭配、词序和时态可以体现在填空、翻译和对话选择里。是否需要词尾拼合或表格交互，应以英语教学对象与实际题证决定，不能照搬其他语言。
5. **允许合理表达，区分错误来源。** 翻译中的多个自然答案、听写中的声音还原、口语中的可理解性分别建规则；误触、键盘错误、语音设备失败应有恢复路径。
6. **候选项要对应真实误解。** 听辨比较近音，语境比较词义，语法比较形式；若只靠荒谬干扰项排除，答对的教学证据会很弱。
7. **反馈保留当前材料。** 让用户能同时看见原题、自己的答案、需要改的片段和原因。绿色奖励不能代替解释，长解释也不能挤掉下一步。
8. **记录提示使用条件。** 慢速、译文、词库、字幕和看过答案后重试，会改变“完成”的含义。后续记录应能区分首次独立完成与辅助完成。
9. **新情境需要单独验证。** 看过同一句、换名词、换场景和自由沟通是不同迁移距离。可用延迟提取、减少帮助与新材料表现检验设计是否有效。
10. **儿童英语还需内容与操作验收。** 干扰项、语法说明、录音失败文案都应适龄、准确、不误导。成人场景或角色幽默不能未经审查直接当作儿童题库。

## 8. 尚未补齐的英语题屏与边界

本报告没有把“找到很多图”解释为“英语每一种题型全图已经齐全”。主图谱的缺口，以及跨语言总清单复核后的候选缺口，都列在下面。

| 项目 | 已有证据 / 缺什么 | 补证后的用途 |
| --- | --- | --- |
| E16 口说正确回应的动态状态 | 原尺寸全图包含底部 CONTINUAR 与 Home 条；未实测录音识别 | 补录音中、判分和失败恢复状态，核对具体操作时序 |
| E08 语音翻译录音状态 | 中文完整翻译页有麦克风；官方专门语音输入图裁顶 | 补录音中、转写及失败恢复，不把入口当完成态 |
| S03 英语故事开放写作 | 官方确认部分英语故事提供；没有英语完整写作页 | 明确题干、输入、字数/提交和反馈，不能套用法语示例 |
| M01 英语 Roleplay | 葡语/日语 Max 官方确认英语功能；缺英语聊天完整页 | 记录情境目标、多轮输入与复盘界面 |
| 普通图片词汇单选、图示单词自由输入 | 在全语言资料中有例；本轮尚未找到足够目标英语全图 | 必须由目标英语课程证明，不能用“界面/选项英文”代替 |
| 英语整句键入听写 | 葡语英语错题目录有听写标签，只有间接证据 | 补实际音频、输入框、提交和反馈整页 |
| 英语缺词听写、按音频补空 | 本轮未取得足够英语独立题图 | 区分听觉提取、语法补空与普通听写 |
| 双空对照、选/写词尾、语法表格 | 原跨语言证据多为法语/西语；不能据此确认英语版本 | 若英语实际存在再单列，不因“所有”要求硬凑 |
| Stories 其他操作 | 词块听写、填空、结尾配对等尚未拿到相应英语全图 | 按英语课程实际出现情况补，不用旧法语故事替代 |
| Match Madness、Rapid Review、Legendary等模式 | 本轮没有当前英语方向的完整入口—作答—结算证据 | 核实它们复用哪些题型、是否限时/少提示；不把模式名称重复计成原子题 |
| 当前版本的全部平台、套餐和状态 | 研究阶段连接失败，免费/Super/Max账号实机遍历尚未完成 | 记录母语、英语进度、版本、设备，再取未答/选中/正确/错误/恢复各状态 |

**因此，这是一份英语专题公开证据报告，不是“所有现行英语题型和全部状态已100%截图”的完成声明。** 公开资料能支持学习任务与 UI 的逐项分析；仍缺完整英语图的条目应保持待补，不能用生成图、重绘或其他目标语言占位。

## 9. 本次整理与实际验证

- 新增：英语专题综合报告；逐题目标、操作、UI与设计分析；英语方向与会员矩阵；可查看原尺寸的截图图谱；覆盖清单与来源校验记录。
- 本次分类整理：将 15 项不要求听音或开口的题目集中到第 4.1 节；另列 15 项听说相关题目和 1 项场景辅助交互。为各题增加作答方式说明，同步网页目录、Markdown、覆盖清单与离线包。
- 核对并纠正：目标语言与界面语言的混淆；把其他语言题型推到英语；旧 Practice/答案解释会员边界；普通跟读与 Max 通话混用；局部图、入口图与完整题图混用。
- 实际验证：主报告采用图片的目视核对及原图来源追溯、文件哈希、图片文件与内部链接存在性、结构化记录完整性。本次在本地报告页面验证了新章节画面、导航和目录筛选：筛选“不含口语和听力”显示 15 项，清空后恢复 31 项。Duolingo 实时账号操作与动态体验未完成。
- 业务代码未修改。提交、推送、官网发布均未执行，本次为本地研究报告。


## 10. 来源目录

- [Our new Video Call with Falstaff is here to help you speak with confidence](https://blog.duolingo.com/beginner-video-call-with-falstaff/)
- [Wie Duolingo dir Lesen in einer neuen Sprache beibringt](https://blog.duolingo.com/de/so-verbessert-duolingo-das-leseverstehen/)
- [Where to Find English Pronunciation Lessons on Duolingo](https://blog.duolingo.com/duolingo-english-sounds-tab/)
- [Conoce Aventuras, una nueva experiencia para jugar y aprender Duolingo](https://blog.duolingo.com/es/aventuras-duolingo/)
- [Practice any skill, any time in the Practice tab](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)
- [Duolingo’s New English Content Teaches Without Translations](https://blog.duolingo.com/how-duolingo-teaches-english/)
- [intermediate-mini-units](https://blog.duolingo.com/intermediate-mini-units/)
- [OpenAI社のGPT-4を活用した「Duolingo Max」の全容を解説！](https://blog.duolingo.com/ja/max-subscription/)
- [듀오링고에서 영어 소리를 발음하는 법을 배워보세요!](https://blog.duolingo.com/ko/practice-english-sounds/)
- [듀오링고에 물어보세요: 적절한 난이도란 무엇인가요?](https://blog.duolingo.com/ko/zone-of-proximal-development/)
- [Como o Duolingo ensina a ler em outros idiomas](https://blog.duolingo.com/pt/como-o-duolingo-ensina-a-ler-em-outros-idiomas/)
- [Duolingo Max: conheça o aprendizado com o GPT-4](https://blog.duolingo.com/pt/duolingo-max-gpt-4/)
- [Agora o Explique Minha Resposta é grátis para todo mundo!](https://blog.duolingo.com/pt/explique-minha-resposta-agora-e-gratis/)
- [Treine a memória com os novos flashcards do Duolingo](https://blog.duolingo.com/pt/flashcards-do-duolingo/)
- [Qual é o melhor jeito de aprender com o Duolingo?](https://blog.duolingo.com/pt/melhor-jeito-de-aprender-com-o-duolingo/)
- [Listening: melhore a escuta com a DuoRádio!](https://blog.duolingo.com/pt/melhorar-o-listening-com-a-duoradio/)
- [Querido Duolingo: Qual é o nível certo de dificuldade?](https://blog.duolingo.com/pt/nivel-certo-de-dificuldade/)
- [Primeiros passos: Como aprender um idioma no Duolingo](https://blog.duolingo.com/pt/primeiros-passos-como-aprender-idiomas-no-duolingo/)
- [Querido Duolingo: o Duolingo ensina gramática?](https://blog.duolingo.com/pt/querido-duolingo-o-duolingo-ensina-gramatica/)
- [Pratique qualquer habilidade a qualquer hora na aba de Prática](https://blog.duolingo.com/pt/recurso-incrivel-do-super-conheca-a-nova-central-da-pratica/)
- [A nova Videochamada com o Falstaff vai ajudar você a falar com confiança](https://blog.duolingo.com/pt/videochamada-com-falstaff-conversacao/)
- [Videochamada: tenha conversas realistas com a Lily](https://blog.duolingo.com/pt/videochamada/)
- [Shape language: Duolingo’s art style](https://blog.duolingo.com/shape-language-duolingos-art-style/)
- [Research report: Our Video Call feature boosts learners’ speaking skills](https://blog.duolingo.com/video-call-research-report/)
- [Why Do People Around the World Learn English?](https://blog.duolingo.com/why-learn-english/)
