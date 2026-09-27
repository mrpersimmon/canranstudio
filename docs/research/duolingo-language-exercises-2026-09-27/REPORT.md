# 中文用户学英语：Duolingo 题型、操作与 UI 分析

研究日期：2026-09-27 ｜ 用户视角：中文母语者学习英语 ｜ 中文界面实证与设计分析

分析的出发点是：**一个读中文说明、用中文理解任务的学习者，怎样逐步读懂、组织并使用英语。** 中文指令负责说明操作，英语承担学习材料；中文解释帮助核对意义，词块和部分答案控制产出难度。评价一道题时，要区分学习者是在认出意思、选择答案、补一个词，还是独立组织整句英语。

## 1. 范围与截图标准

主报告采用中文界面、英语学习方向明确的真实图像：累计独立浏览器实测336张操作原图（此前免费访客150张，此次登录Super后新增186张），另保留已有用户参考截图和官方渠道公开的产品图片。原图保留原语言与画面，没有把葡语、法语或韩语界面翻译后冒充中文截图。

**中文页面、中文课程和中文用户是三个需要分别核对的条件。** 文章正文使用中文，不代表配图就是中文课程；功能公告说“支持中文”，也可能指“学习中文”。同样，英语题目若只存在于其他母语课程，只能帮助理解通用设计，不能证明中文学英语的账号有该功能。

每条证据分别标注：完整中文题面、中文局部图、仅见输入入口、中文课程文字证据，或中文课程待核实。已完成中文→英语免费访客入门课、发音专项，以及登录Super后的Taxi Ride故事重读、第21部分单元复习和学习法国文化电台复习；尚未遍历当前中文课程。原始公开图与用户历史图只能说明各自所示版本、题型和状态。手机系统栏是否保留、题面是否被遮挡、来源是否为多屏宣传排版，也会单独注明。

主报告的截图证据来自中文界面。其他母语学英语的图放在[跨语言参考附录](reference-other-native-languages.html)，供比较通用交互。**附录的图数与覆盖率不计入中文题图覆盖。**

## 2. 从中文用户的任务出发理解题型

### 2.1 先判断“答对”说明了哪一种能力

| 学习者要完成的事 | 中文截图中的例子 | 可以观察到什么 | 还不能据此判断什么 |
| --- | --- | --- | --- |
| 识别英语意义 | my mother → 我 / 的 / 母亲 | 在给定候选中理解英语短语 | 能否不看词库写出 my mother |
| 补出局部英语 | 他们喜欢你。→ ___ like you. | 在句式支架下补出 They | 能否独立写出整句或换一种人称 |
| 独立组织英语 | 你是我的数学老师吗？→ Are you my math teacher? | 生成词汇、词序和书写形式 | 相同意思换个情境后能否迁移 |
| 理解词义与搭配 | He is my ___ friend. → good | 从候选中选择合适的英语词 | 能否主动想出 good，或在新句中使用 |
| 把声音连到意义 | 英语音频与中文释义配对 | 听到英语后辨认中文意义 | 能否拼写所听英语，或自主说出来 |

这些是从当前任务推导的能力边界，不是关于所有中文学习者的结论，也不是学习效果实验。下文的“设计解读”和“反馈建议”是研究分析；只有明确标为截图事实的内容才属于已观察到的产品表现。

### 2.2 中文解释应帮助理解，英语任务仍要由学习者完成

“my mother”在图中对应“我 / 的 / 母亲”三个中文词块，说明中英表达并不总是一块对一词。更有用的反馈是把短语意义说明白，而不是让学习者记住固定的点击顺序。填空题在提交后展示“他是我的好朋友”，则把英语表达重新连回熟悉的中文意义。

中文解释适合出现在指令、必要提示与作答反馈中；什么时候出现，会改变题目难度。如果作答前已经展示完整中文解释，所测的理解要求就会不同。本轮实测在 Tea, please. 题中悬停 please，会显示中文词义；课末对话题正确反馈也给中文意思。各题的提示时机仍应分别核对，不能由一处推定所有题。

### 2.3 从词块到键入，增加的不只是英语难度

词块已经给出拼写，学习者主要比较意义和组合顺序；自由输入还要提取单词、处理空格、大小写与标点。对“你是我的数学老师吗？”这道题，核心语言要求包括把中文问句组织为 “Are you…?”。输入法切换或误触造成的问题，应与不理解英语结构区分。

此次E07实测“加大难度”会从补so切换成写整句，减少难度又回到空位，两种模式各保留草稿。这证明该实例允许主动撤去句式帮助；仍不能推定所有课程都按“补词→整句→自由表达”的固定顺序出题。

## 3. 免费、Super、Max：按中文学英语重新核对

| 范围 | 中文用户证据 | 报告采用的判断 |
| --- | --- | --- |
| 中文→英语基础课程 | 免费访客A/B实测11类；加上Super会话C/D/E，累计23个题型/情境/输入变体有连续证据 | 访客与登录账号分别编号，不能把一个平台、单元和账号推广到全部课程 |
| 免费练习中心 / Practice | 2026 年官方专项公告说明，iOS 与 Android 的所有语言课程均提供免费的技能练习 | 按该全称范围，课程层面包括中文→英语；这是公告范围推论，国区版本与具体账号尚未实测。不能继续把整个练习中心视为 Super 专享 |
| Super | 用户自行登录后，会员页确认有效Super；实际进入练习基地、故事、单元复习和电台 | 会员页可见量身定制练习、无限红心、免广告、免费挑战传奇等级；只记录当前账号界面，没有购买或升级。题型在Super出现不等于Super独占 |
| Stories | 当前中文→英语Super账号完整重读Taxi Ride；理解、词义、补短语、听音重组、结尾词汇配对均有原图 | 已到结算与书架；这篇重读没有开放写作，其他篇目与等级仍待核 |
| Radio | 从当前中文学习路径进入学习法国文化电台，完成配对、判断、找两个词、中文内容选择及文本回顾 | 当前账号实际可用；该课用英语谈法国文化，仍是学英语。图像选择R04未遇到，不能用别的题替代 |
| Adventures | 本次可见入口及三条Super流程未采得冒险实机题页 | 仍待核，未遇到不等于中文课程没有该功能 |
| Max 文字聊天、Lily/Falstaff 通话 | 本次账号是Super，未取得可用Max体验 | Super不等于Max；没有购买升级，也不把Radio中的莉莉角色当作Lily实时通话证据 |

官方中国区材料可见[中英配对与课程选择](https://apps.apple.com/cn/iphone/story/id1605587215)、[英语课程翻译与听音配对](https://apps.apple.com/cn/iphone/story/id1399754989)。图片年代和实际版本未能全部确定；本报告不据此给出当前套餐价格或全平台承诺。

[Practice 官方专项公告](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)还说明，故事、电台和冒险的复习入口以该课程原本提供这些内容为前提。[Stories 历史官方说明](https://blog.duolingo.com/duolingo-stories-the-journey-to-android/)明确提到中文使用者学习英语，但所述为早期移动端上线背景。[Max 官方范围说明](https://blog.duolingo.com/duolingo-max/)中的英语使用者学习中文属于相反方向，不能据此确认中文用户的英语 Max 覆盖。

## 4. 题型目录的阅读方式

**不含口语和听力的题目仍集中在一个独立部分。** 判断标准是完成当前任务是否必须听音或开口：可从文字/图片得到材料、通过点选或键入作答的分支归入该部分。可选的朗读按钮并不意味着必须听音；语音输入分支则另外讨论。

有中文图的题目提供完整分析卡片；尚无中文图的题型集中列入待核实清单，并给出中文用户视角的设计分析。它们不计入“已确认中文课程题型”。编号用于检索，保留原研究编号；普通听音—中文释义配对保留为 E20，看图选英语词为 E21，键入英语听写为 E22；此前新增纯文字“中文词义→英语词”E23；此次再增加S04故事短语补全、S05逐片段听音重组、R05电台内容选择，以免把不同交互强行放进旧流程。38为研究检索条目数，不是官方题型总数。E21、E22 本轮已取得完整桌面视口原图，其中 E22 的正确分支仍未采到。

累计 336 张原始操作截图，35 组流程，23 类有连续实测，17 类完成同题错误→恢复→正确→继续（含自动推进）的核心闭环。全条件分支穷举仍未完成。主体以中文母语学习英语为准：26 个条目有中文图证，其中 25 项有完整题页、0 项为宣传局部图、1 项仅见输入入口。另有 12 项待核实中文课程或题图。38 是研究条目数，含情境与输入变体，不是已确认的现行题型总数。所有截图拍摄版本与当前账号体验分开判断。

## 题型与中文图证索引

| 编号 | 题型 / 交互 | 听说分类 | 中文图证状态 |
| --- | --- | --- | --- |
| [E01](#E01) | 中英词语配对 | 不含口语和听力 | 完整中文题页 · 本轮实测 |
| [E02](#E02) | 英语语境词义—英文定义选择 | 不含口语和听力 | 中文课程 / 题图待核实 |
| [E03](#E03) | Flashcards：主动说出英语词 | 听力与口语相关 | 中文课程 / 题图待核实 |
| [E04](#E04) | 英译中：用中文词块表达英语意义 | 不含口语和听力 | 完整中文题页 · 本轮实测 |
| [E05](#E05) | 中译英：用英语词块组织译文 | 不含口语和听力 | 完整中文题页 · Super账号实测 |
| [E06](#E06) | 中译英：键入完整英语句子 | 不含口语和听力 | 完整中文题页 · Super账号实测 |
| [E07](#E07) | 完成翻译：缺词与整句难度切换 | 不含口语和听力 | 完整中文题页 · Super账号实测 |
| [E08](#E08) | 翻译题中的英语语音输入入口 | 听力与口语相关 | 仅见中文输入入口 |
| [E09](#E09) | 英语选词填空与中文意义反馈 | 不含口语和听力 | 完整中文题页 |
| [E10](#E10) | 英语图境辅助选词填空 | 不含口语和听力 | 中文课程 / 题图待核实 |
| [E11](#E11) | 英语段落阅读理解选择 | 不含口语和听力 | 中文课程 / 题图待核实 |
| [E12](#E12) | 阅读英语对话，选择合适的下一句 | 不含口语和听力 | 完整中文题页 · 本轮实测 |
| [E13](#E13) | 听英语，用英语词块拼出内容 | 听力与口语相关 | 完整中文题页 · 本轮实测 |
| [E14](#E14) | 听英语内容，选择对应中文解释 | 听力与口语相关 | 完整中文题页 · Super账号实测 |
| [E15](#E15) | 英语朗读：录音、未通过提示与跳过 | 听力与口语相关 | 完整中文题页 · 本轮实测 |
| [E16](#E16) | 理解英语问题并说出正确回应 | 听力与口语相关 | 中文课程 / 题图待核实 |
| [E17](#E17) | 英语近音词二选一听辨 | 听力与口语相关 | 完整中文题页 · 本轮实测 |
| [E18](#E18) | 听两个英语声音，判断词语相同或不同 | 听力与口语相关 | 完整中文题页 · 本轮实测 |
| [E19](#E19) | 听英语声音，配对英语书面词 | 听力与口语相关 | 完整中文题页 · 本轮实测 |
| [E20](#E20) | 听英语，配对中文词义 | 听力与口语相关 | 完整中文题页 |
| [E21](#E21) | 按中文意义，看图选择英语词 | 不含口语和听力 | 完整中文题页 · 本轮实测 |
| [E22](#E22) | 听英语，键入英语词句 | 听力与口语相关 | 完整中文题页 · 本轮实测 |
| [E23](#E23) | 按中文词义，选择对应英语词 | 不含口语和听力 | 完整中文题页 · 本轮实测 |
| [S01](#S01) | 故事阅读理解：字面意义、意图与总结 | 不含口语和听力 | 完整中文题页 · Super账号实测 |
| [S02](#S02) | 故事词义定位：按中文意义点英语片段 | 不含口语和听力 | 完整中文题页 · Super账号实测 |
| [S03](#S03) | 故事末尾开放写作 | 不含口语和听力 | 中文课程 / 题图待核实 |
| [S04](#S04) | 故事短语补全：带回放的缺句选择 | 听力与口语相关 | 完整中文题页 · Super账号实测 |
| [S05](#S05) | 故事听音重组：逐片段接受正确前缀 | 听力与口语相关 | 完整中文题页 · Super账号实测 |
| [R01](#R01) | Radio：找出听到的两个英语单词 | 听力与口语相关 | 完整中文题页 · Super账号实测 |
| [R02](#R02) | Radio：英语声音配中文释义 | 听力与口语相关 | 完整中文题页 · Super账号实测 |
| [R03](#R03) | Radio：判断中文陈述与英语内容是否一致 | 听力与口语相关 | 完整中文题页 · Super账号实测 |
| [R04](#R04) | Radio 听音选择图片 | 听力与口语相关 | 中文课程 / 题图待核实 |
| [R05](#R05) | Radio：中文选项核对节目内容 | 听力与口语相关 | 完整中文题页 · Super账号实测 |
| [A01](#A01) | Adventures 场景探索/点物/读标牌 | 场景辅助交互 | 中文课程 / 题图待核实 |
| [A02](#A02) | Adventures 英语回应选择 | 不含口语和听力 | 中文课程 / 题图待核实 |
| [M01](#M01) | Roleplay 英语多轮文字情境聊天（中文覆盖待核） | 不含口语和听力 | 中文课程 / 题图待核实 |
| [M02](#M02) | Video Call with Lily 英语自由对话 | 听力与口语相关 | 中文课程 / 题图待核实 |
| [M03](#M03) | Video Call with Falstaff 英语引导对话 | 听力与口语相关 | 中文课程 / 题图待核实 |

## 4.0 逐步操作截图：从作答到错题重练

**累计 336 张原始操作截图，整理为 35 组流程，涉及 23 个题型/输入变体；其中 17 类跑通“错误→恢复→正确→继续”的核心闭环（包含自动推进）。所有条件分支均穷举的题型仍为 0，不能把核心闭环称为全覆盖。**

实测范围：2026-09-27，桌面Chrome，中文→英语。A为免费访客基础入门课，B为访客发音专项；C为用户自行登录Super后的Taxi Ride故事重读，D为第21部分单元复习，E为学习法国文化电台复习。视口1200×1189，具体产品构建号未取得。登录后的三条流程都已完成并返回入口；没有升级或购买Max。

**直接看此次Super新增：**[故事阅读与各插题 F17–F22](#live-F17) · [中译英词块全过程 F26](#live-F26) · [键入错误与容错 F27/F29](#live-F27) · [缺词/整句切换 F28](#live-F28) · [电台四种任务 F31–F35](#live-F31)。新增186张原图、19组流程；已有访客流程继续保留。

按图序阅读每一步的**操作 → 实际结果 → 原图**。原图保留完整视口，点击可放大；红心弹层、重练过场、结算与可滚动回顾页分别注明。步骤编号是当前流程内的顺序；原图编号是整场采集索引，所以不必连续。跨到课末重练前确实完成了其他题，不能理解成答错后立即回原题。

**按实际判分单位分开阅读**：普通翻译草稿提交后锁定，后段原题重现；配对错误闪红后原位恢复；故事/电台选择常把错误候选禁用，允许当场选另一项；故事重组则逐片段接受正确前缀。电台完成任务后自动继续节目。它们不能共用一张“答错后重试”的示意图。

故事阅读的S01/S02可用可见文字完成，单列在无需听说组；整个故事仍有S05听音重组，S04短语补全的声音依赖待核。听力入口、录音界面与跳过已有操作图，但没有保存音轨、听验质量或验证成功朗读。Max、移动端、未出现题型与异常分支仍留缺口。

[逐步骤覆盖表](flow-coverage.csv) · [结构化流程证据](live-flow-evidence.json) · [全部分支核对表](flow-data.json)

以下先分开展示无需听说、听力和共用回顾，再列出每一种研究条目的未完成操作。


<a id="live-F01"></a>
### F01 · 看图选词：同题答错到课末答对

**题干：**哪个是“茶”呢？
蓝色只表示选择；提交才判分。答错后选项锁定，继续进入下一题；本课后段同题以错题重练重现，答对后再推进。

**连续性与缺口：**17与120之间实际完成了其他题，明确作为课内间隔，不伪装成紧接下一步。未穷举所有错误选项、快捷键和外部异常。

**1. 进入“哪个是茶”** — 三张图卡尚未选中；检查为灰色，红心为5。

![F01 步骤1：三张图卡尚未选中；检查为灰色，红心为5。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/010.png)

**2. 点击 coffee** — coffee 变蓝；检查变绿；尚未判定正确与否。

![F01 步骤2：coffee 变蓝；检查变绿；尚未判定正确与否。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/011.png)

**3. 改点 tea** — tea 变蓝，coffee 恢复；维持单选。

![F01 步骤3：tea 变蓝，coffee 恢复；维持单选。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/012.png)

**4. 再次点击已选 tea** — tea 仍选中；重复点击未回到空答案。

![F01 步骤4：tea 仍选中；重复点击未回到空答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/013.png)

**5. 改点 sugar，准备提交** — sugar 变蓝；这是错误草稿，还没有判错。

![F01 步骤5：sugar 变蓝；这是错误草稿，还没有判错。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/014.png)

**6. 点击检查** — 红心5变4；首次错误说明弹层遮住题目，底部已出现红色答案反馈。

![F01 步骤6：红心5变4；首次错误说明弹层遮住题目，底部已出现红色答案反馈。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/015.png)

**7. 关闭红心说明中的继续** — 显示“正确答案：tea”；选项已锁定，底部红色继续。

![F01 步骤7：显示“正确答案：tea”；选项已锁定，底部红色继续。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/016.png)

**8. 点击错误反馈的继续** — 进入下一道文字选词题“茶”；不是在原看图题内编辑。

![F01 步骤8：进入下一道文字选词题“茶”；不是在原看图题内编辑。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/017.png)

**9. 完成中间题目后继续** — 出现“复习一下之前你不太熟练的部分”过场；不是一道新题。

![F01 步骤9：出现“复习一下之前你不太熟练的部分”过场；不是一道新题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/120.png)

**10. 点击复习过场的继续** — 同一“哪个是茶”与原三个选项重现，带错题重练标签。

![F01 步骤10：同一“哪个是茶”与原三个选项重现，带错题重练标签。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/121.png)

**11. 在重练题中点击 tea** — 重新选择，未沿用第一次的错误答案。

![F01 步骤11：重新选择，未沿用第一次的错误答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/122.png)

**12. 点击检查** — 同题答对，tea变绿，显示绿色继续。

![F01 步骤12：同题答对，tea变绿，显示绿色继续。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/123.png)

**13. 点击继续** — 原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。

![F01 步骤13：原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/124.png)


<a id="live-F02"></a>
### F02 · 中文词义选英文：改选、错误与重练

**题干：**茶 → coffee / hot / tea
没有图片可供直接匹配；需要把中文词义连到英语词形。错误反馈给出tea，之后在课末重练同题。

**连续性与缺口：**24到124之间是其他题目。E23是本轮新发现的中文词义选英文，不冒充E02英文定义选择。

**1. 点击错误反馈的继续** — 进入下一道文字选词题“茶”；不是在原看图题内编辑。

![F02 步骤1：进入下一道文字选词题“茶”；不是在原看图题内编辑。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/017.png)

**2. 文字选词题中点击 coffee** — coffee 变蓝；检查可用。

![F02 步骤2：coffee 变蓝；检查可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/020.png)

**3. 改选 tea** — 选中状态从 coffee 转移到 tea。

![F02 步骤3：选中状态从 coffee 转移到 tea。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/021.png)

**4. 改选 hot，准备提交** — hot 为当前蓝色选项；尚未判错。

![F02 步骤4：hot 为当前蓝色选项；尚未判错。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/022.png)

**5. 点击检查** — 显示正确答案 tea，原选项锁定；红心4变3。

![F02 步骤5：显示正确答案 tea，原选项锁定；红心4变3。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/023.png)

**6. 点击继续** — 切换到新的看图题“哪个是咖啡”。

![F02 步骤6：切换到新的看图题“哪个是咖啡”。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/024.png)

**7. 点击继续** — 原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。

![F02 步骤7：原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/124.png)

**8. 点击 tea** — 重练题的正确选项变蓝，等待提交。

![F02 步骤8：重练题的正确选项变蓝，等待提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/125.png)

**9. 点击检查** — 同题绿色反馈，标记连对3题。

![F02 步骤9：同题绿色反馈，标记连对3题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/126.png)

**10. 点击继续** — 显示鼓励过场“你的辛勤付出得到了回报！”；本帧不是welcome题。

![F02 步骤10：显示鼓励过场“你的辛勤付出得到了回报！”；本帧不是welcome题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/127.png)


<a id="live-F03"></a>
### F03 · 英译中词块：撤回、清空、答错与重练

**题干：**welcome → 热茶 / 欢迎
答案区词块可撤回；清空后检查禁用；提交后锁定。课末重练改变了词库位置，原题正确重答。

**连续性与缺口：**首次悬停截图只显示操作引导；真实词义浮层见F04。重练前经过其他题。

**1. 点击继续** — 进入英译中词块题 welcome；首次提示可悬停查看词义。

![F03 步骤1：进入英译中词块题 welcome；首次提示可悬停查看词义。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/038.png)

**2. 悬停 welcome** — 本帧仍显示首次操作引导；不能把它当成词典释义已展开。

![F03 步骤2：本帧仍显示首次操作引导；不能把它当成词典释义已展开。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/040.png)

**3. 点击热茶** — 热茶进入答案区；词库原位变灰；检查启用。

![F03 步骤3：热茶进入答案区；词库原位变灰；检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/041.png)

**4. 点击答案区的热茶** — 词块撤回；答案清空，检查重新变灰。

![F03 步骤4：词块撤回；答案清空，检查重新变灰。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/042.png)

**5. 点击欢迎** — 欢迎进入答案区，热茶仍可选；尚未提交。

![F03 步骤5：欢迎进入答案区，热茶仍可选；尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/043.png)

**6. 撤回欢迎，再点热茶** — 再次形成错误草稿；实际提交前的答案为热茶。

![F03 步骤6：再次形成错误草稿；实际提交前的答案为热茶。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/044.png)

**7. 点击检查** — 红色反馈给出欢迎；词块均锁定；红心3变2。

![F03 步骤7：红色反馈给出欢迎；词块均锁定；红心3变2。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/045.png)

**8. 点击继续** — 进入新的文字选择题“欢迎”；不是在原词块题内重答。

![F03 步骤8：进入新的文字选择题“欢迎”；不是在原词块题内重答。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/046.png)

**9. 再点击继续** — welcome 英译中题重现；词库顺序与首次不同，带错题重练标签。

![F03 步骤9：welcome 英译中题重现；词库顺序与首次不同，带错题重练标签。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/128.png)

**10. 点击欢迎** — 正确词块进入答案区。

![F03 步骤10：正确词块进入答案区。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/129.png)

**11. 点击检查** — 同题出现绿色正确反馈，连对4题。

![F03 步骤11：同题出现绿色正确反馈，连对4题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/130.png)

**12. 点击继续** — 原对话 Coffee or tea? 及两项原选项重现，带错题重练。

![F03 步骤12：原对话 Coffee or tea? 及两项原选项重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/131.png)


<a id="live-F04"></a>
### F04 · 多词词块：部分答案、查词与改顺序

**题干：**Tea, please. → 茶 / 谢谢
部分答案就能提交。撤回前面的词，再从词库点回，可改变排列顺序。词义提示在题面内出现。

**连续性与缺口：**“谢谢 茶”只保存为未提交草稿；没有实测该词序的判分，不能称为已被系统判错。

**1. 进入 Tea, please. 翻译题** — 词库为谢谢、牛奶、茶；答案为空。

![F04 步骤1：词库为谢谢、牛奶、茶；答案为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/050.png)

**2. 悬停 please** — 实际展开词义提示：谢谢、感谢、多谢。

![F04 步骤2：实际展开词义提示：谢谢、感谢、多谢。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/051.png)

**3. 先点击谢谢** — 只有一个词块也能启用检查；非完整答案仍可提交。

![F04 步骤3：只有一个词块也能启用检查；非完整答案仍可提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/052.png)

**4. 再点击茶** — 形成“谢谢 茶”的未提交草稿；未验证这个词序会被怎样判分。

![F04 步骤4：形成“谢谢 茶”的未提交草稿；未验证这个词序会被怎样判分。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/053.png)

**5. 点击答案区的谢谢** — 前面的词块撤回，茶留在答案区并前移。

![F04 步骤5：前面的词块撤回，茶留在答案区并前移。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/054.png)

**6. 再次点击词库谢谢** — 它追加到答案末尾，组成“茶 谢谢”。

![F04 步骤6：它追加到答案末尾，组成“茶 谢谢”。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/055.png)

**7. 点击检查** — 绿色正确反馈出现；全部词块锁定。

![F04 步骤7：绿色正确反馈出现；全部词块锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/056.png)

**8. 点击继续** — 进入新题 I'd like coffee.。

![F04 步骤8：进入新题 I'd like coffee.。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/057.png)


<a id="live-F05"></a>
### F05 · 完成对话：错误意思反馈与同题重练

**题干：**Coffee or tea? → Coffee, please. / Welcome.
选择符合话轮的回应，系统错误与正确反馈均给中文意思；看见会话角色不等于自由对话生成。

**连续性与缺口：**65到131之间经过其他题。字幕材料完整可读，播放为可选辅助；本分支归无必需听说。

**1. 进入完成对话 Coffee or tea?** — 两个选项 Coffee, please. 和 Welcome.；检查禁用。

![F05 步骤1：两个选项 Coffee, please. 和 Welcome.；检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/060.png)

**2. 点击 Welcome.** — 蓝色选中；检查启用；角色空白气泡未直接填入答案。

![F05 步骤2：蓝色选中；检查启用；角色空白气泡未直接填入答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/061.png)

**3. 改选 Coffee, please.** — 蓝色选择转移，尚未判分。

![F05 步骤3：蓝色选择转移，尚未判分。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/062.png)

**4. 改回 Welcome.** — 保留错误回答作为提交前证据。

![F05 步骤4：保留错误回答作为提交前证据。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/063.png)

**5. 点击检查** — 红心2变1；同时显示正确英文 Coffee, please. 与中文“咖啡，谢谢。”。

![F05 步骤5：红心2变1；同时显示正确英文 Coffee, please. 与中文“咖啡，谢谢。”。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/064.png)

**6. 点击继续** — 进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。

![F05 步骤6：进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/065.png)

**7. 点击继续** — 原对话 Coffee or tea? 及两项原选项重现，带错题重练。

![F05 步骤7：原对话 Coffee or tea? 及两项原选项重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/131.png)

**8. 点击 Coffee, please.** — 正确回答变蓝，等待提交。

![F05 步骤8：正确回答变蓝，等待提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/132.png)

**9. 点击检查** — 绿色反馈，同时给中文意思，连对5题。

![F05 步骤9：绿色反馈，同时给中文意思，连对5题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/133.png)

**10. 点击继续** — 之前被普通跳过的 coffee 翻译题重现，带错题重练。

![F05 步骤10：之前被普通跳过的 coffee 翻译题重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/134.png)


<a id="live-F06"></a>
### F06 · 听力词块与键盘：两份草稿、清空、错误与补心

**题干：**音频目标由错误反馈确认是 tea
两种输入方式各保留草稿。提交Tea, please.被判错，正确答案为tea；用满全部候选词块并不等于正确。红心归零时本次入门课提供一次免费补心。

**连续性与缺口：**本轮没有保存原音轨，播放按钮点击不证明听验完成。未取得此题答对及同题重练；随后临时跳过听力使本课未重现该听写。不能外推所有账号都有免费补心。

**1. 点击继续** — 进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。

![F06 步骤1：进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/065.png)

**2. 点击普通播放** — 保留点击后的播放控件画面；没有保存音轨，不能证明声音正常或播放持续时间。

![F06 步骤2：保留点击后的播放控件画面；没有保存音轨，不能证明声音正常或播放持续时间。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/070.png)

**3. 点击乌龟慢速播放** — 保留慢速入口点击后的画面；音频速度与声音质量未另行听验。

![F06 步骤3：保留慢速入口点击后的画面；音频速度与声音质量未另行听验。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/071.png)

**4. 点击词块 please** — please 进入答案区，检查启用。

![F06 步骤4：please 进入答案区，检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/072.png)

**5. 点击使用键盘** — 标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。

![F06 步骤5：标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/073.png)

**6. 键入 coffee** — 输入框出现草稿；检查启用。

![F06 步骤6：输入框出现草稿；检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/074.png)

**7. 清空输入框** — 显示占位文字，检查再次禁用。

![F06 步骤7：显示占位文字，检查再次禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/075.png)

**8. 键入 Tea, please.** — 形成新的未提交草稿；此时尚无正确判断。

![F06 步骤8：形成新的未提交草稿；此时尚无正确判断。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/076.png)

**9. 切回使用词库** — 先前的 please 词块草稿恢复；两个输入模式各有草稿。

![F06 步骤9：先前的 please 词块草稿恢复；两个输入模式各有草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/077.png)

**10. 撤回 please** — 词块答案清空，检查禁用。

![F06 步骤10：词块答案清空，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/078.png)

**11. 按顺序点 tea、please** — 两个词块进入答案区；不代表必须使用全部词块。

![F06 步骤11：两个词块进入答案区；不代表必须使用全部词块。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/079.png)

**12. 切回键盘** — Tea, please. 文本草稿仍保留。

![F06 步骤12：Tea, please. 文本草稿仍保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/080.png)

**13. 提交 Tea, please.** — 实际判错，正确答案为 tea；红心归零，弹出本次入门课的免费补心提示。

![F06 步骤13：实际判错，正确答案为 tea；红心归零，弹出本次入门课的免费补心提示。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/081.png)

**14. 点击免费重新注入** — 红心恢复为5；仍停在错误反馈页，原文本锁定，显示英文 tea 与中文茶。

![F06 步骤14：红心恢复为5；仍停在错误反馈页，原文本锁定，显示英文 tea 与中文茶。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/082.png)

**15. 点击继续** — 进入新的对话 Tea or coffee?；听写不能原位编辑。

![F06 步骤15：进入新的对话 Tea or coffee?；听写不能原位编辑。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/083.png)


<a id="live-F07"></a>
### F07 · 中英配对：瞬时错误、原位重试与全部完成

**题干：**茶/欢迎/咖啡/热 ↔ tea/welcome/coffee/hot
第二侧点击立即判定；错配短暂变红且扣心，恢复后可留在本题重试；配对正确后词条禁用，全部完成自动给绿色继续。

**连续性与缺口：**已验证左右两侧都能先选；未逐项穷举所有排列、重复点击和退出恢复。错误/正确瞬间与稳定状态是不同原始截图。

**1. 进入中英配对** — 左列茶、欢迎、咖啡、热；右列 hot、coffee、tea、welcome；检查禁用。

![F07 步骤1：左列茶、欢迎、咖啡、热；右列 hot、coffee、tea、welcome；检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/090.png)

**2. 先点击左列茶** — 单边蓝色选中，尚未判分。

![F07 步骤2：单边蓝色选中，尚未判分。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/091.png)

**3. 改点同列欢迎** — 选中项从茶转到欢迎；同列操作不会组成一对。

![F07 步骤3：选中项从茶转到欢迎；同列操作不会组成一对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/092.png)

**4. 点击不匹配的右列 tea，立即截图** — 欢迎与tea瞬间变红；红心5变4；无底部整题错误栏。

![F07 步骤4：欢迎与tea瞬间变红；红心5变4；无底部整题错误栏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/093.png)

**5. 等错误高亮自然结束** — 两项恢复白色，仍留在本题，可重新选择；检查依旧禁用。

![F07 步骤5：两项恢复白色，仍留在本题，可重新选择；检查依旧禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/094.png)

**6. 重新点欢迎，再点 welcome，立即截图** — 正确的两项瞬间变绿。

![F07 步骤6：正确的两项瞬间变绿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/095.png)

**7. 等正确高亮自然结束** — 已配对的欢迎与welcome变浅并禁用；其他项保持可操作。

![F07 步骤7：已配对的欢迎与welcome变浅并禁用；其他项保持可操作。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/096.png)

**8. 从右列 tea 开始下一对** — 右列也可先选，显示蓝色选中态。

![F07 步骤8：右列也可先选，显示蓝色选中态。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/097.png)

**9. 再点左列茶** — 第二对变浅并锁定。

![F07 步骤9：第二对变浅并锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/098.png)

**10. 点击咖啡与 coffee** — 第三对完成，仅热与hot尚未配对。

![F07 步骤10：第三对完成，仅热与hot尚未配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/099.png)

**11. 点击热与 hot** — 全部完成后自动给出绿色反馈与继续；没有按检查。

![F07 步骤11：全部完成后自动给出绿色反馈与继续；没有按检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/100.png)

**12. 点击继续** — 进入另一道键入听力题；这是后继题，不是刚才的配对重试。

![F07 步骤12：进入另一道键入听力题；这是后继题，不是刚才的配对重试。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/101.png)


<a id="live-F08"></a>
### F08 · 看图选择的直接正确路径

**题干：**哪个是“咖啡”呢？
初始、选中、提交成功和实际下一题均已拍到。

**连续性与缺口：**这是一道独立的咖啡题，不与茶题拼成同一条连续流程。

**1. 点击继续** — 切换到新的看图题“哪个是咖啡”。

![F08 步骤1：切换到新的看图题“哪个是咖啡”。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/024.png)

**2. 咖啡看图题点击 coffee** — coffee 蓝色选中，检查可用。

![F08 步骤2：coffee 蓝色选中，检查可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/030.png)

**3. 点击检查** — coffee 变绿，底部显示“棒棒哒！”；红心仍为3。

![F08 步骤3：coffee 变绿，底部显示“棒棒哒！”；红心仍为3。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/031.png)

**4. 点击继续** — 进入中文“咖啡”的文字选词题；不是词块题。

![F08 步骤4：进入中文“咖啡”的文字选词题；不是词块题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/032.png)


<a id="live-F09"></a>
### F09 · 保留选择的退出取消路径

**题干：**咖啡 → welcome / hot / coffee
退出入口先确认；点继续努力返回后，原选项保留。

**连续性与缺口：**只实测取消退出；最终退出并重进的恢复规则尚未验证。

**1. 点击继续** — 进入中文“咖啡”的文字选词题；不是词块题。

![F09 步骤1：进入中文“咖啡”的文字选词题；不是词块题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/032.png)

**2. 文字选词题点击 coffee** — 蓝色选中 coffee，尚未提交。

![F09 步骤2：蓝色选中 coffee，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/034.png)

**3. 点击左上角退出** — 弹出“现在离开的话，你的进度就没了”；提供继续努力与退出。

![F09 步骤3：弹出“现在离开的话，你的进度就没了”；提供继续努力与退出。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/035.png)

**4. 点击继续努力** — 返回原题，coffee 的选择仍保留。

![F09 步骤4：返回原题，coffee 的选择仍保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/036.png)

**5. 点击检查** — coffee 变绿，显示你太棒了和连对2题。

![F09 步骤5：coffee 变绿，显示你太棒了和连对2题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/037.png)

**6. 点击继续** — 进入英译中词块题 welcome；首次提示可悬停查看词义。

![F09 步骤6：进入英译中词块题 welcome；首次提示可悬停查看词义。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/038.png)


<a id="live-F10"></a>
### F10 · 临时不做听力

**题干：**第二道听写；音频内容未转录
黄色状态告知听力跳过且15分钟后恢复；本次红心不变，继续转到文字题。

**连续性与缺口：**这是另一道题。15分钟是屏幕提示，不代表已经等待并验证自动恢复。

**1. 点击继续** — 进入另一道键入听力题；这是后继题，不是刚才的配对重试。

![F10 步骤1：进入另一道键入听力题；这是后继题，不是刚才的配对重试。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/101.png)

**2. 点击现在不做听力题** — 黄色反馈“听力题已跳过，将在15分钟后恢复”；红心保持4。

![F10 步骤2：黄色反馈“听力题已跳过，将在15分钟后恢复”；红心保持4。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/110.png)

**3. 点击继续** — 进入文本翻译 coffee，答案为空。

![F10 步骤3：进入文本翻译 coffee，答案为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/111.png)


<a id="live-F11"></a>
### F11 · 普通跳过与课末重练

**题干：**coffee → 的 / 咖啡
普通跳过直接展示正确答案，本次不扣心；仍在课末标为错题重练，答对后进入结算。

**连续性与缺口：**这是独立的coffee题；本次事实不能概括所有课程的跳过计分规则。

**1. 点击继续** — 进入文本翻译 coffee，答案为空。

![F11 步骤1：进入文本翻译 coffee，答案为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/111.png)

**2. 点击普通翻译题的跳过** — 红色区域给出正确答案咖啡；本次红心仍为4。

![F11 步骤2：红色区域给出正确答案咖啡；本次红心仍为4。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/112.png)

**3. 点击继续** — 进入新的完成对话题。

![F11 步骤3：进入新的完成对话题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/113.png)

**4. 点击继续** — 之前被普通跳过的 coffee 翻译题重现，带错题重练。

![F11 步骤4：之前被普通跳过的 coffee 翻译题重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/134.png)

**5. 点击咖啡** — 形成重练答案。

![F11 步骤5：形成重练答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/135.png)

**6. 点击检查** — 绿色正确反馈，进度条到末尾。

![F11 步骤6：绿色正确反馈，进度条到末尾。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/136.png)

**7. 点击继续** — 实际进入单元结算：12经验、74%；这是本次人为测试，不代表真实学习水平。

![F11 步骤7：实际进入单元结算：12经验、74%；这是本次人为测试，不代表真实学习水平。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/137.png)


<a id="live-F12"></a>
### F12 · 结算与答案回顾

**题干：**同一节课首次错误和重练分开保留
结算与回顾是学习记录层，不新增为语言题型；首次sugar错误与之后tea正确记录并存。

**连续性与缺口：**这是人为答错和跳过的研究采集。74%不能当作学习成效或正常用户水平；回顾弹层图是当前视口。

**1. 点击继续** — 实际进入单元结算：12经验、74%；这是本次人为测试，不代表真实学习水平。

![F12 步骤1：实际进入单元结算：12经验、74%；这是本次人为测试，不代表真实学习水平。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/137.png)

**2. 点击回顾本单元** — 打开成绩单弹层，以红绿小卡分别保留首次与重练记录；这是当前视口，底部可滚动。

![F12 步骤2：打开成绩单弹层，以红绿小卡分别保留首次与重练记录；这是当前视口，底部可滚动。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/138.png)

**3. 点击第一次“哪个是茶”的红色记录** — 显示你的答案sugar、正确答案tea；没有被重练后的正确记录覆盖。

![F12 步骤3：显示你的答案sugar、正确答案tea；没有被重练后的正确记录覆盖。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/139.png)


<a id="live-F13"></a>
### F13 · 近音听辨：改选、正确、错误与后续呈现

**题干：**你听到了什么？dock/deck 与 got/get
保持第一段实际课序，列出多个音频实例。错误时选项仍为蓝色草稿样式，底部红色建议多听，并未直给正确词；后续同组选项再次出现。

**连续性与缺口：**不是把所有 got/get 画面当成同一道题：音轨未保存，相同选项可能对应不同声音。218到251之间完成了声音同异、朗读和配对，因此不计严格同音同题核心闭环。难度评价与报错入口未提交。

**1. 打开中文发音页** — 免费访客可见英语发音入口、元音/辅音词卡；这里只截当前视口，不是完整发音表。

![F13 步骤1：免费访客可见英语发音入口、元音/辅音词卡；这里只截当前视口，不是完整发音表。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/200.png)

**2. 点击开始进入专项** — 出现你听到了什么、dock/deck 两选项、大播放按钮；检查禁用，题页顶部没有红心显示。

![F13 步骤2：出现你听到了什么、dock/deck 两选项、大播放按钮；检查禁用，题页顶部没有红心显示。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/201.png)

**3. 点击 dock** — dock 变蓝；这张即时帧的检查仍灰色，不能拿它证明已完成按钮过渡。

![F13 步骤3：dock 变蓝；这张即时帧的检查仍灰色，不能拿它证明已完成按钮过渡。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/202.png)

**4. 改点 deck** — 选择转移到 deck；此时检查为绿色。

![F13 步骤4：选择转移到 deck；此时检查为绿色。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/203.png)

**5. 改回 dock，点击检查** — 本题实际正确，dock 与底部反馈变绿；提供太简单、太难、报错。

![F13 步骤5：本题实际正确，dock 与底部反馈变绿；提供太简单、太难、报错。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/204.png)

**6. 点击继续** — 新题选项为 got/get；不能把相同标题当成同一条音频。

![F13 步骤6：新题选项为 got/get；不能把相同标题当成同一条音频。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/205.png)

**7. 点击 got** — got 蓝色选中，检查可用。

![F13 步骤7：got 蓝色选中，检查可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/206.png)

**8. 点击检查** — 本题实际正确，绿色反馈及连对2题。

![F13 步骤8：本题实际正确，绿色反馈及连对2题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/207.png)

**9. 点击继续** — 另一题为 deck/dock，选项顺序改变；答案尚空。

![F13 步骤9：另一题为 deck/dock，选项顺序改变；答案尚空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/208.png)

**10. 点击 dock** — 右侧 dock 变蓝。

![F13 步骤10：右侧 dock 变蓝。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/209.png)

**11. 点击检查** — 本题实际正确；不能因选项排列变化推断音频相同。

![F13 步骤11：本题实际正确；不能因选项排列变化推断音频相同。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/210.png)

**12. 点击继续** — 又出现 got/get 选项，属于课序中的另一次呈现。

![F13 步骤12：又出现 got/get 选项，属于课序中的另一次呈现。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/211.png)

**13. 点击 get** — 右侧 get 变蓝，尚未提交。

![F13 步骤13：右侧 get 变蓝，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/212.png)

**14. 点击检查** — 此题 get 被判正确，绿色反馈。

![F13 步骤14：此题 get 被判正确，绿色反馈。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/213.png)

**15. 点击继续** — 下一道仍为 got/get；只凭文字不能知道其音频与上一题是否相同。

![F13 步骤15：下一道仍为 got/get；只凭文字不能知道其音频与上一题是否相同。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/214.png)

**16. 点击 get** — get 变蓝，等待提交。

![F13 步骤16：get 变蓝，等待提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/215.png)

**17. 点击检查** — 此次 get 被判错，红色提示还不太准确，再多听几次吧；选项锁定，未列出正确词。

![F13 步骤17：此次 get 被判错，红色提示还不太准确，再多听几次吧；选项锁定，未列出正确词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/216.png)

**18. 在错误反馈页点击播放** — 仍显示错误反馈，播放入口可点击；原音轨与播放质量没有保存验证。

![F13 步骤18：仍显示错误反馈，播放入口可点击；原音轨与播放质量没有保存验证。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/217.png)

**19. 点击继续** — 进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。

![F13 步骤19：进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/218.png)

**20. 点击继续** — 回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。

![F13 步骤20：回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/251.png)

**21. 选择 got** — 此轮 got 为提交草稿。

![F13 步骤21：此轮 got 为提交草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/252.png)

**22. 点击检查** — got 实际被判正确；只确认此次结果，不凭文字相同断言是原音轨重练。

![F13 步骤22：got 实际被判正确；只确认此次结果，不凭文字相同断言是原音轨重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/253.png)

**23. 点击继续** — 再次进入声音同异题；作答前英语词形隐藏。

![F13 步骤23：再次进入声音同异题；作答前英语词形隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/254.png)


<a id="live-F14"></a>
### F14 · 声音同异：隐藏词形、揭晓、错误、跳过与后续呈现

**题干：**同一个词 / 两个不同的词
作答前只有两个音频入口，提交后才出现英语词形与音标。错误为红色；跳过为黄色，即使出现鼓励文案也不能记作正确回答。

**连续性与缺口：**此组包含 deck/dock、get/get、deck/deck、got/get 等明确分开的实例；235到254之间有其他题。后段再现 got/get，但音轨身份未核实，未计同音同题核心闭环。

**1. 点击继续** — 进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。

![F14 步骤1：进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/218.png)

**2. 选择同一个词** — 第一项蓝色选中，检查启用。

![F14 步骤2：第一项蓝色选中，检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/219.png)

**3. 改选两个不同的词** — 蓝色选择转移，单词仍隐藏。

![F14 步骤3：蓝色选择转移，单词仍隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/220.png)

**4. 点击检查** — 实际正确；播放位置显示 deck 与 dock，底部补出单词及音标。

![F14 步骤4：实际正确；播放位置显示 deck 与 dock，底部补出单词及音标。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/221.png)

**5. 点击继续** — 进入下一道声音同异题，两词再次隐藏。

![F14 步骤5：进入下一道声音同异题，两词再次隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/222.png)

**6. 点击上方音频入口** — 保留点击后按钮画面；没有据此宣称声音正常。

![F14 步骤6：保留点击后按钮画面；没有据此宣称声音正常。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/223.png)

**7. 点击下方音频入口** — 两个声音可以分别触发；这不是语音输入。

![F14 步骤7：两个声音可以分别触发；这不是语音输入。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/224.png)

**8. 选择同一个词** — 形成未提交选择。

![F14 步骤8：形成未提交选择。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/225.png)

**9. 点击检查** — 实际正确；两个位置显示 get，底部为 get 及音标。

![F14 步骤9：实际正确；两个位置显示 get，底部为 get 及音标。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/226.png)

**10. 点击继续** — 下一道声音同异题初始态。

![F14 步骤10：下一道声音同异题初始态。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/227.png)

**11. 选择同一个词** — 选择变蓝，尚未揭晓词形。

![F14 步骤11：选择变蓝，尚未揭晓词形。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/228.png)

**12. 点击检查** — 实际正确；两个位置都是 deck，底部出现对应音标。

![F14 步骤12：实际正确；两个位置都是 deck，底部出现对应音标。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/229.png)

**13. 点击继续** — 再一道声音同异题初始态。

![F14 步骤13：再一道声音同异题初始态。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/230.png)

**14. 选择同一个词** — 作答草稿为同一个词。

![F14 步骤14：作答草稿为同一个词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/231.png)

**15. 点击检查** — 实际判错；揭晓 got 与 get 及两者音标，红色反馈；选项锁定。

![F14 步骤15：实际判错；揭晓 got 与 get 及两者音标，红色反馈；选项锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/232.png)

**16. 点击继续** — 转到另一道声音同异题，不是在原题原位修改。

![F14 步骤16：转到另一道声音同异题，不是在原题原位修改。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/233.png)

**17. 未选答案，点击跳过** — 底部是黄色反馈和继续，显示 get/get 及音标；尽管文案为看，多练几次真的有用吧，不能把跳过算正确作答。

![F14 步骤17：底部是黄色反馈和继续，显示 get/get 及音标；尽管文案为看，多练几次真的有用吧，不能把跳过算正确作答。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/234.png)

**18. 点击继续** — 进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。

![F14 步骤18：进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/235.png)

**19. 点击继续** — 再次进入声音同异题；作答前英语词形隐藏。

![F14 步骤19：再次进入声音同异题；作答前英语词形隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/254.png)

**20. 选择两个不同的词** — 保留作答草稿，准备检查。

![F14 步骤20：保留作答草稿，准备检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/255.png)

**21. 点击检查** — 实际正确，显示 got/get 与音标；对应词对与之前错误实例一致，但没有核对原音轨一致性。

![F14 步骤21：实际正确，显示 got/get 与音标；对应词对与之前错误实例一致，但没有核对原音轨一致性。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/256.png)

**22. 点击继续** — 发音专项实际进入单元完成页；本次研究采集显示11经验、83%，不代表听说能力或正常学习成效。

![F14 步骤22：发音专项实际进入单元完成页；本次研究采集显示11经验、83%，不代表听说能力或正常学习成效。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/257.png)


<a id="live-F15"></a>
### F15 · 朗读：启动、未通过提示与不做口语

**题干：**朗读下面的句子：got
记录完整题页、开始后的波形、停止后瞬时黄色未通过提示及跳过到配对题。跳过出现发音好棒哦的文字，但它不证明成功朗读。

**连续性与缺口：**没有可核对的口述音轨；本轮没有说出英语并验证识别正确。未通过原因不明，不能定性为发音错误；浏览器原生授权流程、重录成功等仍缺证据。

**1. 点击继续** — 进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。

![F15 步骤1：进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/235.png)

**2. 点击并开始录音** — 录音条变为波形界面，示范播放禁用；未提供可核对的口述音轨，波形不证明录音或识别质量。

![F15 步骤2：录音条变为波形界面，示范播放禁用；未提供可核对的口述音轨，波形不证明录音或识别质量。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/236.png)

**3. 等待后点击录音条停止** — 捕获黄色瞬时提示：呃～听起来不太对哦，再试一次吧；随后重新出现录音入口。未判断原因是无声、设备还是发音。

![F15 步骤3：捕获黄色瞬时提示：呃～听起来不太对哦，再试一次吧；随后重新出现录音入口。未判断原因是无声、设备还是发音。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/237.png)

**4. 点击现在不做口语题** — 出现黄色跳过状态，录音入口禁用，文案却是发音好棒哦；此操作没有成功朗读，不能解释成识别正确。

![F15 步骤4：出现黄色跳过状态，录音入口禁用，文案却是发音好棒哦；此操作没有成功朗读，不能解释成识别正确。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/238.png)

**5. 点击继续** — 进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。

![F15 步骤5：进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/239.png)


<a id="live-F16"></a>
### F16 · 声音配对书面词：错误恢复、左右先选与全部完成

**题干：**四个英语声音 ↔ deck / got / dock / get
错误对瞬时变红、原位恢复；成功对变浅锁定。右列也能先选，全部配完自动出现绿色继续；点击继续后的新题已拍到。

**连续性与缺口：**本次实测同一配对题的错误到全部正确；声音质量没有听验，首次选择借助试错完成，不算英语听力表现。尚未测全部排列、快捷键和退出。

**1. 点击继续** — 进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。

![F16 步骤1：进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/239.png)

**2. 点击第1个声音** — 音频卡出现蓝色高亮，还未形成配对。

![F16 步骤2：音频卡出现蓝色高亮，还未形成配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/240.png)

**3. 点击 deck，立即截图** — 第1声音与 deck 短暂标红；错误局限于当前一对，题页未显示红心。

![F16 步骤3：第1声音与 deck 短暂标红；错误局限于当前一对，题页未显示红心。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/241.png)

**4. 等错误反馈自然结束** — 仍在原题；错误对恢复可选，可以重新配对。

![F16 步骤4：仍在原题；错误对恢复可选，可以重新配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/242.png)

**5. 重选第1声音与 got** — 这对短暂变绿，实际配对正确。

![F16 步骤5：这对短暂变绿，实际配对正确。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/243.png)

**6. 等正确反馈自然结束** — 第1声音和 got 变浅并禁用，其他项目仍可操作。

![F16 步骤6：第1声音和 got 变浅并禁用，其他项目仍可操作。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/244.png)

**7. 从右列 deck 开始** — 右列也能先选，文字出现蓝色高亮。

![F16 步骤7：右列也能先选，文字出现蓝色高亮。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/245.png)

**8. 再点第2声音** — 当前这一对标红；已完成的 got 对仍保留。

![F16 步骤8：当前这一对标红；已完成的 got 对仍保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/246.png)

**9. 重新选第2声音，再点 dock** — 这一对变绿，后续锁定。

![F16 步骤9：这一对变绿，后续锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/247.png)

**10. 点第3声音，再点 deck** — 第三声音与 deck 不匹配，再次短暂标红。

![F16 步骤10：第三声音与 deck 不匹配，再次短暂标红。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/248.png)

**11. 重选第3声音，再点 get** — 该对变绿，前三对已完成。

![F16 步骤11：该对变绿，前三对已完成。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/249.png)

**12. 点第4声音，再点 deck** — 所有项目禁用，自动出现绿色正确与继续；没有点击检查。

![F16 步骤12：所有项目禁用，自动出现绿色正确与继续；没有点击检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/250.png)

**13. 点击继续** — 回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。

![F16 步骤13：回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/251.png)


<a id="live-F17"></a>
### F17 · 故事的完整阅读路径与结算

**题干：**Taxi Ride / 乘坐出租车
按实际阅读次序保留封面、每段新台词、悬停中文提示和结算。中间四种题目与结尾配对分别展开于F18–F22；这里的图号间隔是实际插题。

**连续性与缺口：**整篇重读含“重组听到的句子”，不能把整节故事当作无听力课。结算前没有开放写作；这仅适用于本次Taxi Ride重读。音轨未保存或听验。

**1. 打开练习基地** — 中文英语账号的练习基地出现单元复习、口语、听力、错题本、单词和小故事入口；页面为当前视口。

![F17 步骤1：中文英语账号的练习基地出现单元复习、口语、听力、错题本、单词和小故事入口；页面为当前视口。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/300.png)

**2. 打开小故事** — 书架与推荐故事乘坐出租车出现；本次选择这篇重读，不代表全部故事目录。

![F17 步骤2：书架与推荐故事乘坐出租车出现；本次选择这篇重读，不代表全部故事目录。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/301.png)

**3. 进入乘坐出租车** — Taxi Ride 封面与继续按钮；顶部为无限红心标志。

![F17 步骤3：Taxi Ride 封面与继续按钮；顶部为无限红心标志。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/302.png)

**4. 点击继续** — 出现 Bea 坐出租车、看手机地图的英文叙述；每段旁有播放入口。

![F17 步骤4：出现 Bea 坐出租车、看手机地图的英文叙述；每段旁有播放入口。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/303.png)

**5. 悬停 the map** — 题面原位出现中文提示“地图”，保留英文上下文。

![F17 步骤5：题面原位出现中文提示“地图”，保留英文上下文。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/304.png)

**6. 点击继续** — 新增 Bea 的指路：Turn left at the end of the street, please.

![F17 步骤6：新增 Bea 的指路：Turn left at the end of the street, please.](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/305.png)

**7. 点击继续** — 司机回答 I don't need to turn for three more miles.

![F17 步骤7：司机回答 I don't need to turn for three more miles.](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/306.png)

**8. 点击继续** — 出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。

![F17 步骤8：出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/307.png)

**9. 点击继续** — 原题收起，新增 The directions on my phone say that road is faster…；已实际推进。

![F17 步骤9：原题收起，新增 The directions on my phone say that road is faster…；已实际推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/312.png)

**10. 点击继续** — 新增司机说他认识本城所有道路的英文台词。

![F17 步骤10：新增司机说他认识本城所有道路的英文台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/319.png)

**11. 点击继续** — 新增 Bea 说手机认识每个城市所有道路的台词。

![F17 步骤11：新增 Bea 说手机认识每个城市所有道路的台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/320.png)

**12. 点击继续** — 司机强调是自己在开车，手机没有开车。

![F17 步骤12：司机强调是自己在开车，手机没有开车。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/321.png)

**13. 点击继续** — Bea 回应 But I'm paying for the ride, right?

![F17 步骤13：Bea 回应 But I'm paying for the ride, right?](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/322.png)

**14. 点击继续** — 司机答应 OK, OK.；上道题已经推进。

![F17 步骤14：司机答应 OK, OK.；上道题已经推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/325.png)

**15. 点击继续** — 叙述司机左转并停车。

![F17 步骤15：叙述司机左转并停车。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/326.png)

**16. 点击继续** — 司机询问 Are you going swimming?，为后续选择提供情境。

![F17 步骤16：司机询问 Are you going swimming?，为后续选择提供情境。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/327.png)

**17. 点击继续** — 司机说道路止于河边，已推进到后文。

![F17 步骤17：司机说道路止于河边，已推进到后文。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/332.png)

**18. 点击继续** — 新增 Oops.。

![F17 步骤18：新增 Oops.。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/333.png)

**19. 点击继续** — 新增 I'm so sorry.，重组题已推进。

![F17 步骤19：新增 I'm so sorry.，重组题已推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/341.png)

**20. 点击继续** — 司机问 Do you want to use my directions?

![F17 步骤20：司机问 Do you want to use my directions?](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/342.png)

**21. 点击继续** — Bea 答 Yes, please.，情节结束。

![F17 步骤21：Bea 答 Yes, please.，情节结束。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/343.png)

**22. 点击继续** — 实际进入“小故事练习完成啦！”结算，20经验、29%；这是有意试错的采集结果，不代表学习能力。

![F17 步骤22：实际进入“小故事练习完成啦！”结算，20经验、29%；这是有意试错的采集结果，不代表学习能力。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/357.png)

**23. 点击继续** — 返回故事书架；本次完整重读未出现开放写作，不据此推断其他故事或等级没有写作。

![F17 步骤23：返回故事书架；本次完整重读未出现开放写作，不据此推断其他故事或等级没有写作。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/358.png)


<a id="live-F18"></a>
### F18 · 故事理解：两个错误选项、原位答对与继续

**题干：**司机刚说的是……；另列Bea意图及结尾总结
中文问题和选项核对英语上下文；点击即判分，错误项先红后灰，仍能选其余项。第一道题两次答错后原位答对并继续；后两题明确为独立实例。

**连续性与缺口：**本轮三道题分别检查字面意义、话语意图和情节总结。未测试同题重新进入、快捷键、所有故事或开放写作。

**1. 点击继续** — 出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。

![F18 步骤1：出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/307.png)

**2. 选择他想先跑步至少三英里** — 立即标红并出现叉号，无需点击检查。

![F18 步骤2：立即标红并出现叉号，无需点击检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/308.png)

**3. 等错误反馈稳定** — 错误项变灰并禁用，另外两项仍可选；继续仍禁用。

![F18 步骤3：错误项变灰并禁用，另外两项仍可选；继续仍禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/309.png)

**4. 选择他现在时速三英里** — 第二个错误项立即标红，第一项保持灰色。

![F18 步骤4：第二个错误项立即标红，第一项保持灰色。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/310.png)

**5. 选择他在三英里后才需要转弯** — 正确项变绿，继续启用；此帧是即时结果，底部反馈动画尚未完整出现。

![F18 步骤5：正确项变绿，继续启用；此帧是即时结果，底部反馈动画尚未完整出现。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/311.png)

**6. 点击继续** — 原题收起，新增 The directions on my phone say that road is faster…；已实际推进。

![F18 步骤6：原题收起，新增 The directions on my phone say that road is faster…；已实际推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/312.png)

**7. 点击继续** — 另一道题问“Bea的话是什么意思？”，候选为退钱、按她说的路线、做兼职司机。

![F18 步骤7：另一道题问“Bea的话是什么意思？”，候选为退钱、按她说的路线、做兼职司机。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/323.png)

**8. 选择希望司机按她说的路线走** — 立即绿色正确反馈；这是语用理解的独立题，不与第307图拼成同一题。

![F18 步骤8：立即绿色正确反馈；这是语用理解的独立题，不与第307图拼成同一题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/324.png)

**9. 点击继续** — 司机答应 OK, OK.；上道题已经推进。

![F18 步骤9：司机答应 OK, OK.；上道题已经推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/325.png)

**10. 点击继续** — 结尾理解题“糟了！Bea发现原来……”；三个中文选项。

![F18 步骤10：结尾理解题“糟了！Bea发现原来……”；三个中文选项。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/344.png)

**11. 选择她的手机导航不可靠** — 立即绿色正确；这是结尾总结题的独立实例。

![F18 步骤11：立即绿色正确；这是结尾总结题的独立实例。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/345.png)

**12. 点击继续** — 出现五组中英词语配对；保留上文，继续禁用。

![F18 步骤12：出现五组中英词语配对；保留上文，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/346.png)


<a id="live-F19"></a>
### F19 · 故事词义：点选英语片段、错误禁用与退出取消

**题干：**导航指示 → The directions
中文意义对应原句中的英语片段。road错误后变灰，The directions正确后可继续；取消退出保留已答对状态。

**连续性与缺口：**错误候选不可原位再选，但正确路径仍在同一题页。只取消退出，没有确认丢弃，也未验证重进。

**1. 点击继续** — 出现“哪一个选项的意思是导航指示？”；原句被拆成可选英语片段，继续禁用。

![F19 步骤1：出现“哪一个选项的意思是导航指示？”；原句被拆成可选英语片段，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/313.png)

**2. 点击 road** — 该片段立即标红，未获得继续资格。

![F19 步骤2：该片段立即标红，未获得继续资格。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/314.png)

**3. 等错误反馈稳定** — road 变灰禁用，其余片段可选；没有重新打开整道题。

![F19 步骤3：road 变灰禁用，其余片段可选；没有重新打开整道题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/315.png)

**4. 点击 The directions** — 正确片段变绿，所有片段锁定，继续可用。

![F19 步骤4：正确片段变绿，所有片段锁定，继续可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/316.png)

**5. 点击左上角退出** — 出现“现在离开的话，你的进度就没了”，提供继续努力与退出。

![F19 步骤5：出现“现在离开的话，你的进度就没了”，提供继续努力与退出。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/317.png)

**6. 点击继续努力** — 弹层关闭，原正确片段仍保留，未清空答案。

![F19 步骤6：弹层关闭，原正确片段仍保留，未清空答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/318.png)

**7. 点击继续** — 新增司机说他认识本城所有道路的英文台词。

![F19 步骤7：新增司机说他认识本城所有道路的英文台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/319.png)


<a id="live-F20"></a>
### F20 · 故事补全短语：错误候选排除与整句揭晓

**题干：**No, ____ . Why?
选择错误短语时只标红该项，稳定后禁用；正确选择把缺失片段补入对话，继续后出现河边情节。

**连续性与缺口：**本题有回放且作答前缺失片段隐藏；没有保存音轨，无法完全确定文本推理与听音的各自贡献，单独置于听说相关/依赖待核，不算严格无听力。

**1. 点击继续** — “选择短语”：No, ____ . Why?，旁有回放，三个英语短语候选；作答前缺失片段不可见。

![F20 步骤1：“选择短语”：No, ____ . Why?，旁有回放，三个英语短语候选；作答前缺失片段不可见。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/328.png)

**2. 选择 I'm good at stopping** — 片段立即标红；不需要检查按钮。

![F20 步骤2：片段立即标红；不需要检查按钮。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/329.png)

**3. 等错误反馈稳定** — 错误候选变灰，空位仍在，其他候选可选。

![F20 步骤3：错误候选变灰，空位仍在，其他候选可选。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/330.png)

**4. 选择 I'm going shopping** — 候选变绿，整句补全 No, I'm going shopping. Why?；继续启用。

![F20 步骤4：候选变绿，整句补全 No, I'm going shopping. Why?；继续启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/331.png)

**5. 点击继续** — 司机说道路止于河边，已推进到后文。

![F20 步骤5：司机说道路止于河边，已推进到后文。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/332.png)


<a id="live-F21"></a>
### F21 · 故事听音重组：逐片段判定、保留前缀、自动完成

**题干：**I think my directions are wrong.
第一个位置错点are wrong，不插入答案；正确前缀出现后再次错点，前缀保留。依次补齐后自动给绿色继续。

**连续性与缺口：**与整句词块提交不同：没有检查按钮，每次点击都即时验证当前位置；未采集声音或验证重播，试错结果不是听力表现。

**1. 点击继续** — “重组听到的句子”：气泡文字隐藏，三个片段 are wrong / directions / I think my；继续禁用。

![F21 步骤1：“重组听到的句子”：气泡文字隐藏，三个片段 are wrong / directions / I think my；继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/334.png)

**2. 先点 are wrong** — 错误片段标红，但没有插入答案区。

![F21 步骤2：错误片段标红，但没有插入答案区。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/335.png)

**3. 等错误反馈结束** — are wrong 恢复可选；与故事词义选择的错误项永久变灰不同。

![F21 步骤3：are wrong 恢复可选；与故事词义选择的错误项永久变灰不同。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/336.png)

**4. 点 I think my** — 接受正确前缀并在气泡中显示，对应按钮禁用；其余片段仍可选。

![F21 步骤4：接受正确前缀并在气泡中显示，对应按钮禁用；其余片段仍可选。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/337.png)

**5. 第二个位置再点 are wrong** — 当前片段标红，已经接受的 I think my 保留。

![F21 步骤5：当前片段标红，已经接受的 I think my 保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/338.png)

**6. 点 directions** — 气泡增加 directions，已用片段禁用，只剩 are wrong 可用。

![F21 步骤6：气泡增加 directions，已用片段禁用，只剩 are wrong 可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/339.png)

**7. 点 are wrong** — 整句 I think my directions are wrong. 出现，自动绿色反馈与继续；每个片段即时判定。

![F21 步骤7：整句 I think my directions are wrong. 出现，自动绿色反馈与继续；每个片段即时判定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/340.png)

**8. 点击继续** — 新增 I'm so sorry.，重组题已推进。

![F21 步骤8：新增 I'm so sorry.，重组题已推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/341.png)


<a id="live-F22"></a>
### F22 · 故事末尾词汇配对：错配恢复到返回书架

**题干：**五对中英词语与短语
错误对原位恢复；成功对变浅锁定；右列也可先选，五对完成自动出现继续，再到故事结算和书架。

**连续性与缺口：**这是E01在故事中的五对变体；不新增“故事配对”题型。本页无限红心，与访客扣心分开记录。

**1. 点击继续** — 出现五组中英词语配对；保留上文，继续禁用。

![F22 步骤1：出现五组中英词语配对；保留上文，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/346.png)

**2. 先点中文我** — 单侧蓝色高亮，还未形成一对。

![F22 步骤2：单侧蓝色高亮，还未形成一对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/347.png)

**3. 再点 She** — 我与 She 短暂标红；本页无限红心标志不变。

![F22 步骤3：我与 She 短暂标红；本页无限红心标志不变。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/348.png)

**4. 等错配反馈结束** — 错配恢复可选，正确任务仍在同一页。

![F22 步骤4：错配恢复可选，正确任务仍在同一页。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/349.png)

**5. 重选我和 I** — 这对变绿。

![F22 步骤5：这对变绿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/350.png)

**6. 等正确反馈结束** — 正确项变浅禁用，剩余四对仍可操作。

![F22 步骤6：正确项变浅禁用，剩余四对仍可操作。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/351.png)

**7. 从右侧 on her phone 开始** — 右列也能先选，蓝色高亮。

![F22 步骤7：右列也能先选，蓝色高亮。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/352.png)

**8. 再点在她手机上** — 第二对变绿。

![F22 步骤8：第二对变绿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/353.png)

**9. 配对你打算去…吗与 Are you going** — 第三对正确；截图仍含上一对颜色过渡。

![F22 步骤9：第三对正确；截图仍含上一对颜色过渡。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/354.png)

**10. 配对她与 She** — 第四对正确；已完成项保留。

![F22 步骤10：第四对正确；已完成项保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/355.png)

**11. 配对所有的路与 all the roads** — 全部变浅禁用，自动绿色反馈与继续，没有点击检查。

![F22 步骤11：全部变浅禁用，自动绿色反馈与继续，没有点击检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/356.png)

**12. 点击继续** — 实际进入“小故事练习完成啦！”结算，20经验、29%；这是有意试错的采集结果，不代表学习能力。

![F22 步骤12：实际进入“小故事练习完成啦！”结算，20经验、29%；这是有意试错的采集结果，不代表学习能力。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/357.png)

**13. 点击继续** — 返回故事书架；本次完整重读未出现开放写作，不据此推断其他故事或等级没有写作。

![F22 步骤13：返回故事书架；本次完整重读未出现开放写作，不据此推断其他故事或等级没有写作。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/358.png)


<a id="live-F23"></a>
### F23 · Super复习听写：词块错误提交与另一题跳过

**题干：**in the same place；另一音频未转录
本轮补到词库模式实际提交错误，反馈给出英语及中文意义。后续另一道听写选择暂不做听力，出现15分钟说明。

**连续性与缺口：**两道不同音频明确分开；跳过后最初听写没有重现，故无原音轨正确重练闭环。音质未听验，不能推断定时恢复已验证。

**1. 进入第21部分复习** — 说明这10道练习好久没见，邀请重练；Super 角色画面，属于单元引导。

![F23 步骤1：说明这10道练习好久没见，邀请重练；Super 角色画面，属于单元引导。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/400.png)

**2. 开始复习** — 选择听到的内容；普通/慢速播放、英语词块、使用键盘与现在不做听力题；检查禁用。

![F23 步骤2：选择听到的内容；普通/慢速播放、英语词块、使用键盘与现在不做听力题；检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/401.png)

**3. 选择 how are you** — 形成词块草稿、检查可用；即时帧含词块移动动画，不作为稳定排列图。

![F23 步骤3：形成词块草稿、检查可用；即时帧含词块移动动画，不作为稳定排列图。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/402.png)

**4. 点击检查** — 红色纠错给出 in the same place 及中文在同样的地方；词块草稿保留并锁定。音轨未听验。

![F23 步骤4：红色纠错给出 in the same place 及中文在同样的地方；词块草稿保留并锁定。音轨未听验。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/403.png)

**5. 点击继续** — 英译中 She has worked as a server for five years.，空答案及中文词库。

![F23 步骤5：英译中 She has worked as a server for five years.，空答案及中文词库。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/404.png)

**6. 点击继续** — 进入另一道词块听写；不是第401图的同一音频题。

![F23 步骤6：进入另一道词块听写；不是第401图的同一音频题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/415.png)

**7. 点击现在不做听力题** — 黄色提示“听力题已跳过，将在15分钟后恢复”；没有实际等待验证定时恢复。

![F23 步骤7：黄色提示“听力题已跳过，将在15分钟后恢复”；没有实际等待验证定时恢复。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/416.png)

**8. 点击继续** — 中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。

![F23 步骤8：中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/417.png)


<a id="live-F24"></a>
### F24 · 较长英译中：逐词构造、判分与下一题

**题干：**She has worked…；I have loved…
中文词块组织英语现在完成时句意；两题都走到绿色正确及实际下一题。

**连续性与缺口：**两句为独立实例。405–409是词块移动中的即时帧，410是稳定结果；不把动画中途位置作为排版缺陷。没有对这两句提交错误。

**1. 点击继续** — 英译中 She has worked as a server for five years.，空答案及中文词库。

![F24 步骤1：英译中 She has worked as a server for five years.，空答案及中文词库。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/404.png)

**2. 选择她** — 即时动画帧，词块正在移动；后续第410图保留稳定完整答案。

![F24 步骤2：即时动画帧，词块正在移动；后续第410图保留稳定完整答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/405.png)

**3. 继续选择当** — 增加中文词块，仍为移动中的即时画面。

![F24 步骤3：增加中文词块，仍为移动中的即时画面。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/406.png)

**4. 继续选择服务员** — 草稿继续增加；不把动画中途的词块位置当作最终布局。

![F24 步骤4：草稿继续增加；不把动画中途的词块位置当作最终布局。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/407.png)

**5. 继续选择五年** — 继续构造中文译文，尚未判分。

![F24 步骤5：继续构造中文译文，尚未判分。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/408.png)

**6. 继续选择了** — 全部中文词块已点击，截图仍含动画过渡。

![F24 步骤6：全部中文词块已点击，截图仍含动画过渡。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/409.png)

**7. 点击检查** — 她 当 服务员 五年 了 被接受，绿色反馈，答案稳定保留。

![F24 步骤7：她 当 服务员 五年 了 被接受，绿色反馈，答案稳定保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/410.png)

**8. 点击继续** — 先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。

![F24 步骤8：先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/411.png)

**9. 点击继续** — 先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。

![F24 步骤9：先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/438.png)

**10. 选择我爱你** — 答案区出现第一个中文短语块。

![F24 步骤10：答案区出现第一个中文短语块。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/439.png)

**11. 选择很长** — 增加时长修饰语。

![F24 步骤11：增加时长修饰语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/440.png)

**12. 选择时间** — 继续组合中文意义。

![F24 步骤12：继续组合中文意义。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/441.png)

**13. 选择了** — 得到 我爱你 很长 时间 了。

![F24 步骤13：得到 我爱你 很长 时间 了。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/442.png)

**14. 点击检查** — 中文译文被接受，绿色反馈。

![F24 步骤14：中文译文被接受，绿色反馈。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/443.png)

**15. 点击继续** — 中译英“他们在英国待了三年了。”，本次先显示词库。

![F24 步骤15：中译英“他们在英国待了三年了。”，本次先显示词库。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/444.png)


<a id="live-F25"></a>
### F25 · 先听后答：选择、改选、正确与推进

**题干：**他们在… → 看John的护照
中文解释作为候选，蓝色草稿可改选；检查后第二项被接受，继续进入下一道听写。

**连续性与缺口：**只取得正确分支；第一次选项没有提交，不能称为已答错。未听验音轨，也未测试慢速、原题重练或退出。

**1. 点击继续** — 先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。

![F25 步骤1：先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/411.png)

**2. 选择帮John找工作** — 第一项蓝色选中，检查启用。

![F25 步骤2：第一项蓝色选中，检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/412.png)

**3. 改选看John的护照** — 蓝色选择转移，旧项解除，尚未提交。

![F25 步骤3：蓝色选择转移，旧项解除，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/413.png)

**4. 点击检查** — 第二项被判正确，绿色反馈；本题没有采到错误分支，未听验原音轨。

![F25 步骤4：第二项被判正确，绿色反馈；本题没有采到错误分支，未听验原音轨。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/414.png)

**5. 点击继续** — 进入另一道词块听写；不是第401图的同一音频题。

![F25 步骤5：进入另一道词块听写；不是第401图的同一音频题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/415.png)


<a id="live-F26"></a>
### F26 · 中译英词块：查词、两种草稿、撤回、漏词与同题重练

**题干：**她跟她的男朋友一起去过巴黎。
先验证词库与键盘分别保留草稿，再撤回中间词和清空；漏to提交后突出正确介词。隔着其他题，原中文题干重现，补to后正确并推进。

**连续性与缺口：**438到465之间实际做了其他题；未看见额外错题过场。键盘模式只编辑未判分，不把此题当作E06的正确键入证据；未逐个穷举干扰项和所有词序。

**1. 点击继续** — 中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。

![F26 步骤1：中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/417.png)

**2. 悬停去过** — 出现 has been to / been / have been to 的英语提示。

![F26 步骤2：出现 has been to / been / have been to 的英语提示。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/418.png)

**3. 选择 She** — 第一个词块进入答案区，词库留下灰色占位，检查启用。

![F26 步骤3：第一个词块进入答案区，词库留下灰色占位，检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/419.png)

**4. 选择 has** — 形成 She has；已等词块移动结束。

![F26 步骤4：形成 She has；已等词块移动结束。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/420.png)

**5. 选择 been** — 形成 She has been 的部分答案。

![F26 步骤5：形成 She has been 的部分答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/421.png)

**6. 切换使用键盘** — 输入框首次为空，词块草稿没有自动转换为文本。

![F26 步骤6：输入框首次为空，词块草稿没有自动转换为文本。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/422.png)

**7. 键入 She have** — 形成文字草稿，检查可用。

![F26 步骤7：形成文字草稿，检查可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/423.png)

**8. 删除末尾字符并改为 She has** — 键盘草稿可编辑；这里只改末尾，没有验证中间字符选区。

![F26 步骤8：键盘草稿可编辑；这里只改末尾，没有验证中间字符选区。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/424.png)

**9. 清空输入框** — 检查重新禁用。

![F26 步骤9：检查重新禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/425.png)

**10. 切回使用词库** — 原 She has been 草稿保留，词库候选位置改变；两种模式各保留自己的草稿。

![F26 步骤10：原 She has been 草稿保留，词库候选位置改变；两种模式各保留自己的草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/426.png)

**11. 撤回中间的 has** — 答案剩 She been，后面的 been 前移。

![F26 步骤11：答案剩 She been，后面的 been 前移。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/427.png)

**12. 撤回 She** — 答案剩 been。

![F26 步骤12：答案剩 been。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/428.png)

**13. 撤回 been** — 答案清空，检查禁用。

![F26 步骤13：答案清空，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/429.png)

**14. 重新选择 She** — 开始构造漏词错误答案。

![F26 步骤14：开始构造漏词错误答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/430.png)

**15. 选择 has** — 部分答案 She has。

![F26 步骤15：部分答案 She has。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/431.png)

**16. 选择 been** — 部分答案 She has been。

![F26 步骤16：部分答案 She has been。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/432.png)

**17. 直接选择 Paris** — 刻意漏掉介词 to；仍可继续编辑。

![F26 步骤17：刻意漏掉介词 to；仍可继续编辑。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/433.png)

**18. 选择 with** — 增加后续片段，尚未提交。

![F26 步骤18：增加后续片段，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/434.png)

**19. 选择 her** — 继续构造错误草稿。

![F26 步骤19：继续构造错误草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/435.png)

**20. 选择 boyfriend** — 完整草稿 She has been Paris with her boyfriend，缺少 to。

![F26 步骤20：完整草稿 She has been Paris with her boyfriend，缺少 to。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/436.png)

**21. 点击检查** — 红色纠错给出 She has been to Paris with her boyfriend.，to 被突出；原漏词答案保留并锁定。

![F26 步骤21：红色纠错给出 She has been to Paris with her boyfriend.，to 被突出；原漏词答案保留并锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/437.png)

**22. 点击继续** — 先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。

![F26 步骤22：先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/438.png)

**23. 点击继续** — 巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。

![F26 步骤23：巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/465.png)

**24. 切换使用词库** — 重练的词库为空、候选位置改变，先前错误草稿未沿用。

![F26 步骤24：重练的词库为空、候选位置改变，先前错误草稿未沿用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/466.png)

**25. 选择 She** — 开始正确重答。

![F26 步骤25：开始正确重答。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/467.png)

**26. 选择 has** — 正确草稿 She has。

![F26 步骤26：正确草稿 She has。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/468.png)

**27. 选择 been** — 正确草稿 She has been。

![F26 步骤27：正确草稿 She has been。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/469.png)

**28. 选择 to** — 补上首次漏掉的介词。

![F26 步骤28：补上首次漏掉的介词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/470.png)

**29. 选择 Paris** — 形成 She has been to Paris。

![F26 步骤29：形成 She has been to Paris。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/471.png)

**30. 选择 with** — 增加后续片段。

![F26 步骤30：增加后续片段。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/472.png)

**31. 选择 her** — 继续补全译文。

![F26 步骤31：继续补全译文。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/473.png)

**32. 选择 boyfriend** — 正确译文完整，尚未提交。

![F26 步骤32：正确译文完整，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/474.png)

**33. 点击检查** — 绿色正确反馈；同一道巴黎题完成从漏词到正确的重练。

![F26 步骤33：绿色正确反馈；同一道巴黎题完成从漏词到正确的重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/475.png)

**34. 点击继续** — 英国三年原题再次出现，词库空白。

![F26 步骤34：英国三年原题再次出现，词库空白。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/476.png)


<a id="live-F27"></a>
### F27 · 整句键入：数字意义错误、退出取消与同题修正

**题干：**他们在英国待了三年了。
十年误写被拒绝，three突出；取消退出后原错误草稿保留。后段原题重现，键入three years后正确并继续。

**连续性与缺口：**449为弹层淡出帧，450才显示稳定提交结果。只测试取消退出；未验证中间选区、所有可接受译法或移动端键盘。

**1. 点击继续** — 中译英“他们在英国待了三年了。”，本次先显示词库。

![F27 步骤1：中译英“他们在英国待了三年了。”，本次先显示词库。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/444.png)

**2. 切换使用键盘** — 空英语输入框，检查禁用。

![F27 步骤2：空英语输入框，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/445.png)

**3. 输入 They have stayed** — 部分文字即可启用检查。

![F27 步骤3：部分文字即可启用检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/446.png)

**4. 输入 They have stayed in the UK for ten years.** — 故意把三年写为 ten years；未提交。

![F27 步骤4：故意把三年写为 ten years；未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/447.png)

**5. 点击退出入口** — 出现进度丢失确认，提供继续努力与退出。

![F27 步骤5：出现进度丢失确认，提供继续努力与退出。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/448.png)

**6. 点击继续努力** — 捕获弹层淡出中的一帧；不能据本帧宣称弹层已经完全消失。后续提交保留同一草稿。

![F27 步骤6：捕获弹层淡出中的一帧；不能据本帧宣称弹层已经完全消失。后续提交保留同一草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/449.png)

**7. 点击检查** — 红色正确答案使用 three years，three 被突出；原 ten years 草稿保留，确认取消退出未丢失输入。

![F27 步骤7：红色正确答案使用 three years，three 被突出；原 ten years 草稿保留，确认取消退出未丢失输入。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/450.png)

**8. 点击继续** — 输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。

![F27 步骤8：输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/451.png)

**9. 点击继续** — 英国三年原题再次出现，词库空白。

![F27 步骤9：英国三年原题再次出现，词库空白。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/476.png)

**10. 切换使用键盘** — 重练输入框为空。

![F27 步骤10：重练输入框为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/477.png)

**11. 输入 They have stayed in the UK for three years.** — 将首次 ten 改为符合中文意义的 three。

![F27 步骤11：将首次 ten 改为符合中文意义的 three。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/478.png)

**12. 点击检查** — 绿色正确，原题纠错完成。

![F27 步骤12：绿色正确，原题纠错完成。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/479.png)

**13. 点击继续** — 妈妈题再次出现，缺词空位为空。

![F27 步骤13：妈妈题再次出现，缺词空位为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/480.png)


<a id="live-F28"></a>
### F28 · 缺词与整句难度切换：独立草稿、错误与原题重练

**题干：**Mom has always been ____ beautiful.
加大难度切换成整句译文，减少难度回到空位，两种输入分别保留草稿。cold被判错，后段同题补so被接受并实际进入结算。

**连续性与缺口：**整句模式仅输入部分草稿，没有提交；不能称为整句译文通过。每字母阈值只检查s，未穷举所有长度、输入法和替代词。

**1. 点击继续** — 输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。

![F28 步骤1：输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/451.png)

**2. 点击加大难度** — 变为用英语写出这句话，整句输入框为空；出现减少难度。

![F28 步骤2：变为用英语写出这句话，整句输入框为空；出现减少难度。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/452.png)

**3. 输入 Mom has always** — 形成整句模式的部分草稿。

![F28 步骤3：形成整句模式的部分草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/453.png)

**4. 点击减少难度** — 回到缺词模式，空位仍空；整句草稿没有复制入空位。

![F28 步骤4：回到缺词模式，空位仍空；整句草稿没有复制入空位。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/454.png)

**5. 输入 s** — 单个字母即可启用检查。

![F28 步骤5：单个字母即可启用检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/455.png)

**6. 继续输入 o** — 空位内容变成 so，尚未提交。

![F28 步骤6：空位内容变成 so，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/456.png)

**7. 清空空位** — 检查禁用。

![F28 步骤7：检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/457.png)

**8. 再次加大难度** — 原整句草稿 Mom has always 保留。

![F28 步骤8：原整句草稿 Mom has always 保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/458.png)

**9. 再次减少难度** — 空位仍保持先前清空后的状态；两种难度分别保留草稿。

![F28 步骤9：空位仍保持先前清空后的状态；两种难度分别保留草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/459.png)

**10. 在空位输入 cold** — 准备故意错误答案。

![F28 步骤10：准备故意错误答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/460.png)

**11. 点击检查** — 红色反馈给出 Mom has always been so beautiful.；错误 cold 保留并锁定。

![F28 步骤11：红色反馈给出 Mom has always been so beautiful.；错误 cold 保留并锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/461.png)

**12. 点击继续** — 另一题“他一直都想要做一个医生。”；显示键盘输入模式。

![F28 步骤12：另一题“他一直都想要做一个医生。”；显示键盘输入模式。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/462.png)

**13. 点击继续** — 妈妈题再次出现，缺词空位为空。

![F28 步骤13：妈妈题再次出现，缺词空位为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/480.png)

**14. 输入 so** — 形成正确缺词草稿。

![F28 步骤14：形成正确缺词草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/481.png)

**15. 点击检查** — 绿色正确；空位锁定，继续可用。

![F28 步骤15：绿色正确；空位锁定，继续可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/482.png)

**16. 点击继续** — 进入单元结算，20经验、64%；时长提示含拍摄等待，不代表正常用时或学习效果。

![F28 步骤16：进入单元结算，20经验、64%；时长提示含拍摄等待，不代表正常用时或学习效果。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/483.png)


<a id="live-F29"></a>
### F29 · 整句翻译的拼写容错实例

**题干：**he has always wanted to be a docter
绿色反馈仍显示“有错别字哦”，并给doctor正确写法；说明这个实例区分语义通过和拼写提醒。

**连续性与缺口：**大小写、句末标点、docter拼写差异同时存在，只证明该组合被接受，不能分离推断每个规则或全局容错阈值。

**1. 点击继续** — 另一题“他一直都想要做一个医生。”；显示键盘输入模式。

![F29 步骤1：另一题“他一直都想要做一个医生。”；显示键盘输入模式。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/462.png)

**2. 输入 he has always wanted to be a docter** — 故意保留 docter 拼写差异、小写开头且不加句号。

![F29 步骤2：故意保留 docter 拼写差异、小写开头且不加句号。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/463.png)

**3. 点击检查** — 绿色通过并提示“有错别字哦！”；显示 doctor 的正确写法。只证明本句组合条件被接受，不能推断所有拼写/大小写/标点均容错。

![F29 步骤3：绿色通过并提示“有错别字哦！”；显示 doctor 的正确写法。只证明本句组合条件被接受，不能推断所有拼写/大小写/标点均容错。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/464.png)

**4. 点击继续** — 巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。

![F29 步骤4：巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/465.png)


<a id="live-F30"></a>
### F30 · Super复习结算：首次错误与重做记录同时保留

**题干：**20经验、64%，以及巴黎题的两次答案
成绩单按发生顺序同时保存原红色错误卡与后续绿色正确卡，点击分别显示答案；关闭后继续回练习基地。

**连续性与缺口：**有意错答、跳过和截图等待影响分数与时长。绿色卡也出现于跳过的听力，不能据卡片颜色推断完成听写。

**1. 点击继续** — 进入单元结算，20经验、64%；时长提示含拍摄等待，不代表正常用时或学习效果。

![F30 步骤1：进入单元结算，20经验、64%；时长提示含拍摄等待，不代表正常用时或学习效果。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/483.png)

**2. 打开回顾本单元** — 成绩单同时保留原错答与重做正确；跳过的听力卡也呈绿勾，不能把该标记解释为成功听写。

![F30 步骤2：成绩单同时保留原错答与重做正确；跳过的听力卡也呈绿勾，不能把该标记解释为成功听写。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/484.png)

**3. 点击首次巴黎题红色卡片** — 弹层分别给出你的漏词答案和含 to 的正确答案。

![F30 步骤3：弹层分别给出你的漏词答案和含 to 的正确答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/485.png)

**4. 点击重做巴黎题绿色卡片** — 展示重做后的答案；首次红色记录仍在，没有被覆盖。

![F30 步骤4：展示重做后的答案；首次红色记录仍在，没有被覆盖。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/486.png)

**5. 关闭成绩单** — 返回结算页面，继续可用。

![F30 步骤5：返回结算页面，继续可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/487.png)

**6. 点击继续** — 实际回到练习基地，已完成单元复习。

![F30 步骤6：实际回到练习基地，已完成单元复习。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/488.png)


<a id="live-F31"></a>
### F31 · 电台听音配中文：错误恢复、揭晓拼写与自动播放

**题干：**四个声音 ↔ 年 / 学校 / 图片 / 法语
演播室画面保持，问题固定在底部。正确配对后才揭晓英文拼写；错误只闪红当前对，恢复后可再配。四对完成自动继续节目。

**连续性与缺口：**以试错采集交互，没有音轨听验。无限红心只证实当前Super会话；不是R02只对Super开放的证明。未测试重复同卡、退出和键盘数字快捷键。

**1. 在学习路径找到电台节点** — 耳机图标位于已解锁路径；本帧尚无节点弹层，不当作题面。

![F31 步骤1：耳机图标位于已解锁路径；本帧尚无节点弹层，不当作题面。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/500.png)

**2. 点击电台节点** — “学习法国文化”弹层显示开始复习+15经验；通过真实入口进入。

![F31 步骤2：“学习法国文化”弹层显示开始复习+15经验；通过真实入口进入。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/501.png)

**3. 进入并等待首个任务** — 莉莉演播室上方为进度和无限红心；下方选择配对，四个声音与年、学校、图片、法语。

![F31 步骤3：莉莉演播室上方为进度和无限红心；下方选择配对，四个声音与年、学校、图片、法语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/502.png)

**4. 点第1个声音** — 左侧音频蓝色选中，尚未配对。

![F31 步骤4：左侧音频蓝色选中，尚未配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/503.png)

**5. 点击年** — 配对正确变绿，声音卡揭示英语拼写 year。

![F31 步骤5：配对正确变绿，声音卡揭示英语拼写 year。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/504.png)

**6. 等正确反馈稳定** — year/年变浅禁用，其他三对仍可选。

![F31 步骤6：year/年变浅禁用，其他三对仍可选。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/505.png)

**7. 点第2个声音** — 蓝色选中，本次没有听验原音轨。

![F31 步骤7：蓝色选中，本次没有听验原音轨。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/506.png)

**8. 点击图片** — 错误对立即红色，已完成 year 保留。

![F31 步骤8：错误对立即红色，已完成 year 保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/507.png)

**9. 等错误反馈稳定** — 错误对恢复可选；仍在同一题，不用重新进入。

![F31 步骤9：错误对恢复可选；仍在同一题，不用重新进入。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/508.png)

**10. 从右侧学校开始** — 中文选项蓝色高亮，证实可从右列开始。

![F31 步骤10：中文选项蓝色高亮，证实可从右列开始。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/509.png)

**11. 再点第2个声音** — 该配对也错误，学校与声音2标红。

![F31 步骤11：该配对也错误，学校与声音2标红。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/510.png)

**12. 重选第2个声音与法语** — 绿色正确，并揭示 French。

![F31 步骤12：绿色正确，并揭示 French。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/511.png)

**13. 等正确反馈稳定** — 两对变浅锁定，仍有两对未完成。

![F31 步骤13：两对变浅锁定，仍有两对未完成。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/512.png)

**14. 配对声音3与学校** — 第三次错配，仍只影响当前一对。

![F31 步骤14：第三次错配，仍只影响当前一对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/513.png)

**15. 重选声音3与图片** — 正确并揭示 pictures。

![F31 步骤15：正确并揭示 pictures。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/514.png)

**16. 点剩余声音4** — 单边蓝色高亮，之前配对保留。

![F31 步骤16：单边蓝色高亮，之前配对保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/515.png)

**17. 再点学校** — 最后一对正确并揭示 school，进度开始推进；没有检查或继续按钮。

![F31 步骤17：最后一对正确并揭示 school，进度开始推进；没有检查或继续按钮。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/516.png)

**18. 等待自动推进** — 配对区域消失，恢复角色对话播放，底部回退5秒/暂停/前进控件；本帧前进为灰色。

![F31 步骤18：配对区域消失，恢复角色对话播放，底部回退5秒/暂停/前进控件；本帧前进为灰色。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/517.png)


<a id="live-F32"></a>
### F32 · 电台判断：错误揭晓英文、原位纠正与自动推进

**题干：**她去年在学校学习了西班牙语。
先只有中文陈述与音频；选勾错误后揭晓英语，错误项禁用。改点叉正确后自动继续播放。

**连续性与缺口：**一个判断题包含完整错误到正确分支；未保存声音。正确的叉号与表示错误的红色反馈不是同一含义。

**1. 等待下一问题出现** — “她去年在学校学习了西班牙语。”；音频波形与勾/叉二选一，作答前英文句子隐藏。

![F32 步骤1：“她去年在学校学习了西班牙语。”；音频波形与勾/叉二选一，作答前英文句子隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/518.png)

**2. 点勾表示正确** — 立即标红，揭示 I learned French at school last year.，帮助比对 French 与西班牙语。

![F32 步骤2：立即标红，揭示 I learned French at school last year.，帮助比对 French 与西班牙语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/519.png)

**3. 等错误反馈稳定** — 勾选项变灰禁用；叉仍可点，英文句子保留。

![F32 步骤3：勾选项变灰禁用；叉仍可点，英文句子保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/520.png)

**4. 点叉表示不正确** — 绿色正确，进度推进；不需要再点检查。

![F32 步骤4：绿色正确，进度推进；不需要再点检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/521.png)

**5. 等待自动推进** — 问题收起，恢复角色对话与播放控件。

![F32 步骤5：问题收起，恢复角色对话与播放控件。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/522.png)

**6. 下一道题已出现** — 选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。

![F32 步骤6：选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/523.png)


<a id="live-F33"></a>
### F33 · 电台选两个词：每词即时判定、少一个与全部完成

**题干：**class / favorite / boring
boring点后即错并禁用，class点后即对但仍停留；favorite正确后才自动推进。这里是累计找对两个词，不是提交一个两项选择集合。

**连续性与缺口：**错误候选被禁用、达到两词后自动推进，本实例没有第三项可再加选；未验证别的候选数量、重播音轨和退出。

**1. 下一道题已出现** — 选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。

![F33 步骤1：选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/523.png)

**2. 点 boring** — 该词立即变红；不是先选满两项再统一判分。

![F33 步骤2：该词立即变红；不是先选满两项再统一判分。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/524.png)

**3. 等错误反馈稳定** — boring 变灰禁用，其余两个词仍可点。

![F33 步骤3：boring 变灰禁用，其余两个词仍可点。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/525.png)

**4. 点 class** — 第一个正确词即时变绿，尚未完成两词要求。

![F33 步骤4：第一个正确词即时变绿，尚未完成两词要求。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/526.png)

**5. 保持一个正确词状态** — class 保持绿色锁定，favorite 仍可点，未自动进入下一段。

![F33 步骤5：class 保持绿色锁定，favorite 仍可点，未自动进入下一段。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/527.png)

**6. 点 favorite** — 两词都绿，任务达到要求数量后自动推进。

![F33 步骤6：两词都绿，任务达到要求数量后自动推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/528.png)

**7. 等待下一问题** — “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。

![F33 步骤7：“她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/529.png)


<a id="live-F34"></a>
### F34 · 电台中文内容理解：错误候选禁用与原位答对

**题干：**她喜欢学习 → 关于新地方 / 关于旧地方
以中文候选核对节目内容；选择即判分，错项变灰，正确后自动进入收尾并结算。与普通先听后答的检查按钮不同。

**连续性与缺口：**这是电台中的内容选择变体，并非图像选择R04；本屏没有完整台词，不能因为候选是中文就归无听力题。

**1. 等待下一问题** — “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。

![F34 步骤1：“她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/529.png)

**2. 点关于旧地方** — 即时标红。

![F34 步骤2：即时标红。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/530.png)

**3. 等错误反馈稳定** — 错误候选变灰禁用，另一选项可点。

![F34 步骤3：错误候选变灰禁用，另一选项可点。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/531.png)

**4. 点关于新地方** — 绿色正确，进度推进。

![F34 步骤4：绿色正确，进度推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/532.png)

**5. 等待自动推进** — 问题收起并继续播放，进度到末端；尚非结算画面。

![F34 步骤5：问题收起并继续播放，进度到末端；尚非结算画面。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/533.png)

**6. 等待电台结束** — 实际结算显示30经验、0%，并提供查看文本；本次每类任务都有试错，数值不能当作学习成效。

![F34 步骤6：实际结算显示30经验、0%，并提供查看文本；本次每类任务都有试错，数值不能当作学习成效。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/534.png)


<a id="live-F35"></a>
### F35 · 电台结算与中英全文回顾

**题干：**学习法国文化；莉莉遇见陌生人
电台完成后提供查看文本，按角色保留中文串场与英文来宾台词；关闭后继续返回路径。

**连续性与缺口：**回顾文本是完成后才打开的证据。没有拍到成功暂停/回退，不能把播放控件可见写成操作已完成。30经验与0%只属于这次试错采集。

**1. 等待电台结束** — 实际结算显示30经验、0%，并提供查看文本；本次每类任务都有试错，数值不能当作学习成效。

![F35 步骤1：实际结算显示30经验、0%，并提供查看文本；本次每类任务都有试错，数值不能当作学习成效。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/534.png)

**2. 点击查看文本** — 整段复习文本可见；莉莉串场为中文，来宾台词为英文。属于课后全文回顾，不应倒推作答前已有全文。

![F35 步骤2：整段复习文本可见；莉莉串场为中文，来宾台词为英文。属于课后全文回顾，不应倒推作答前已有全文。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/535.png)

**3. 关闭文本弹层** — 返回结算，继续可用。

![F35 步骤3：返回结算，继续可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/536.png)

**4. 点击继续** — 返回中文英语学习路径，电台复习完成。

![F35 步骤4：返回中文英语学习路径，电台复习完成。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/537.png)

## 各题型操作分支覆盖表


<a id="flow-E01"></a>
### E01 · 中英词语配对

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #090 左列茶、欢迎、咖啡、热；右列 hot、coffee、tea、welcome；检查禁用。；#346 出现五组中英词语配对；保留上文，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #090 左列茶、欢迎、咖啡、热；右列 hot、coffee、tea、welcome；检查禁用。；#346 出现五组中英词语配对；保留上文，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点左侧或右侧的一张卡 | 已采集本次实例 | #091 单边蓝色选中，尚未判分。；#097 右列也可先选，显示蓝色选中态。；#347 单侧蓝色高亮，还未形成一对。；#352 右列也能先选，蓝色高亮。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点同一卡或同列另一卡 | 部分已采集 | #091 单边蓝色选中，尚未判分。；#092 选中项从茶转到欢迎；同列操作不会组成一对。 只验证同列换选；再次点击同一卡未测试。 |
| 5 | 选一个不匹配的另一侧项目 | 已采集本次实例 | #093 欢迎与tea瞬间变红；红心5变4；无底部整题错误栏。；#094 两项恢复白色，仍留在本题，可重新选择；检查依旧禁用。；#348 我与 She 短暂标红；本页无限红心标志不变。；#349 错配恢复可选，正确任务仍在同一页。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 错误后再选一对正确项目 | 已采集本次实例 | #094 两项恢复白色，仍留在本题，可重新选择；检查依旧禁用。；#095 正确的两项瞬间变绿。；#349 错配恢复可选，正确任务仍在同一页。；#350 这对变绿。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 配对正确，但不完成全部 | 已采集本次实例 | #095 正确的两项瞬间变绿。；#096 已配对的欢迎与welcome变浅并禁用；其他项保持可操作。；#350 这对变绿。；#351 正确项变浅禁用，剩余四对仍可操作。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 完成所有剩余配对 | 已采集本次实例 | #099 第三对完成，仅热与hot尚未配对。；#100 全部完成后自动给出绿色反馈与继续；没有按检查。；#356 全部变浅禁用，自动绿色反馈与继续，没有点击检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 点击推进入口 | 已采集本次实例 | #101 进入另一道键入听力题；这是后继题，不是刚才的配对重试。；#357 实际进入“小故事练习完成啦！”结算，20经验、29%；这是有意试错的采集结果，不代表学习能力。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 已配对状态是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-E02"></a>
### E02 · 英语语境词义—英文定义选择

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 选择一项但暂不提交 | 待实测；适用性也待核 | 选择前后边框、颜色、指示符和主按钮变化。 尚无对应中文连续操作证据。 |
| 4 | 换选另一项，再尝试取消当前选择 | 待实测；适用性也待核 | 旧选择是否解除、是否能回到空答案。 尚无对应中文连续操作证据。 |
| 5 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 7 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E03"></a>
### E03 · Flashcards：主动说出英语词

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 开始录音 | 待实测；适用性也待核 | 入口、权限提示、录音中反馈；没有授权时在提示处停止。 尚无对应中文连续操作证据。 |
| 4 | 测试未收到声音的结果（获得许可后） | 待实测；适用性也待核 | 是否有超时、无声音提示和恢复入口；与答错区分。 尚无对应中文连续操作证据。 |
| 5 | 说出给定或自行组织的英语 | 待实测；适用性也待核 | 录音中、处理等待、识别完成状态；需要音频证据核对识别内容。 尚无对应中文连续操作证据。 |
| 6 | 说错或识别不成功后恢复 | 待实测；适用性也待核 | 错误/识别失败文案、重录、转键入或跳过的实际入口。 尚无对应中文连续操作证据。 |
| 7 | 通过提供的入口重试 | 待实测；适用性也待核 | 重录是否覆盖旧答案；再次识别后的结果。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E04"></a>
### E04 · 英译中：用中文词块表达英语意义

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #038 进入英译中词块题 welcome；首次提示可悬停查看词义。；#050 词库为谢谢、牛奶、茶；答案为空。；#404 英译中 She has worked as a server for five years.，空答案及中文词库。；#438 先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #042 词块撤回；答案清空，检查重新变灰。；#050 词库为谢谢、牛奶、茶；答案为空。；#404 英译中 She has worked as a server for five years.，空答案及中文词库。；#438 先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 选择第一个词块 | 已采集本次实例 | #041 热茶进入答案区；词库原位变灰；检查启用。；#052 只有一个词块也能启用检查；非完整答案仍可提交。；#439 答案区出现第一个中文短语块。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 继续选词，形成部分答案 | 已采集本次实例 | #053 形成“谢谢 茶”的未提交草稿；未验证这个词序会被怎样判分。；#440 增加时长修饰语。；#441 继续组合中文意义。；#442 得到 我爱你 很长 时间 了。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 移除中间或最后一个已选词，再选回来 | 已采集本次实例 | #054 前面的词块撤回，茶留在答案区并前移。；#055 它追加到答案末尾，组成“茶 谢谢”。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 撤回所有词块 | 已采集本次实例 | #041 热茶进入答案区；词库原位变灰；检查启用。；#042 词块撤回；答案清空，检查重新变灰。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 构造错误词序，并在提交前修改 | 已采集本次实例 | #053 形成“谢谢 茶”的未提交草稿；未验证这个词序会被怎样判分。；#054 前面的词块撤回，茶留在答案区并前移。；#055 它追加到答案末尾，组成“茶 谢谢”。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 有意给出错误答案并提交 | 已采集本次实例 | #044 再次形成错误草稿；实际提交前的答案为热茶。；#045 红色反馈给出欢迎；词块均锁定；红心3变2。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #045 红色反馈给出欢迎；词块均锁定；红心3变2。；#046 进入新的文字选择题“欢迎”；不是在原词块题内重答。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #128 welcome 英译中题重现；词库顺序与首次不同，带错题重练标签。；#129 正确词块进入答案区。；#130 同题出现绿色正确反馈，连对4题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #056 绿色正确反馈出现；全部词块锁定。；#130 同题出现绿色正确反馈，连对4题。；#410 她 当 服务员 五年 了 被接受，绿色反馈，答案稳定保留。；#443 中文译文被接受，绿色反馈。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 点击正确反馈后的推进入口 | 已采集本次实例 | #057 进入新题 I'd like coffee.。；#131 原对话 Coffee or tea? 及两项原选项重现，带错题重练。；#411 先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。；#444 中译英“他们在英国待了三年了。”，本次先显示词库。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 13 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |
| 14 | 检查键盘或可选播放入口（若存在） | 部分已采集 | #051 实际展开词义提示：谢谢、感谢、多谢。 只验证 please 的悬停提示；本题键盘切换和播放未测试。 |

<a id="flow-E05"></a>
### E05 · 中译英：用英语词块组织译文

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #417 中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #417 中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。；#429 答案清空，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 悬停中文词查看英语提示 | 已采集本次实例 | #418 出现 has been to / been / have been to 的英语提示。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 选择第一个词块 | 已采集本次实例 | #419 第一个词块进入答案区，词库留下灰色占位，检查启用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 继续选词，形成部分答案 | 已采集本次实例 | #420 形成 She has；已等词块移动结束。；#421 形成 She has been 的部分答案。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 移除中间或最后一个已选词，再选回来 | 已采集本次实例 | #426 原 She has been 草稿保留，词库候选位置改变；两种模式各保留自己的草稿。；#427 答案剩 She been，后面的 been 前移。；#428 答案剩 been。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 撤回所有词块 | 已采集本次实例 | #429 答案清空，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 构造错误词序，并在提交前修改 | 部分已采集 | #426 原 She has been 草稿保留，词库候选位置改变；两种模式各保留自己的草稿。；#427 答案剩 She been，后面的 been 前移。；#428 答案剩 been。；#429 答案清空，检查禁用。；#430 开始构造漏词错误答案。；#431 部分答案 She has。；#432 部分答案 She has been。 已移除中间词、清空后重新排列；没有拖拽交换或全部排列测试。 |
| 9 | 有意给出错误答案并提交 | 已采集本次实例 | #436 完整草稿 She has been Paris with her boyfriend，缺少 to。；#437 红色纠错给出 She has been to Paris with her boyfriend.，to 被突出；原漏词答案保留并锁定。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #437 红色纠错给出 She has been to Paris with her boyfriend.，to 被突出；原漏词答案保留并锁定。；#438 先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #465 巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。；#466 重练的词库为空、候选位置改变，先前错误草稿未沿用。；#467 开始正确重答。；#474 正确译文完整，尚未提交。；#475 绿色正确反馈；同一道巴黎题完成从漏词到正确的重练。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #475 绿色正确反馈；同一道巴黎题完成从漏词到正确的重练。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 13 | 点击正确反馈后的推进入口 | 已采集本次实例 | #476 英国三年原题再次出现，词库空白。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 14 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |
| 15 | 检查键盘或可选播放入口（若存在） | 部分已采集 | #422 输入框首次为空，词块草稿没有自动转换为文本。；#423 形成文字草稿，检查可用。；#424 键盘草稿可编辑；这里只改末尾，没有验证中间字符选区。；#425 检查重新禁用。；#426 原 She has been 草稿保留，词库候选位置改变；两种模式各保留自己的草稿。 已测词库和键盘独立草稿；没有在本题键盘模式提交答案。 |

<a id="flow-E06"></a>
### E06 · 中译英：键入完整英语句子

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #445 空英语输入框，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #445 空英语输入框，检查禁用。；#477 重练输入框为空。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击输入框 | 部分已采集 | #445 空英语输入框，检查禁用。；#446 部分文字即可启用检查。 桌面文本框可输入；移动端软键盘未采集。 |
| 4 | 输入部分答案 | 已采集本次实例 | #446 部分文字即可启用检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 定位中间字符并修改，再清空 | 部分已采集 | #446 部分文字即可启用检查。；#447 故意把三年写为 ten years；未提交。 本题从部分文本改写整句；中间字符选区与清空见另一巴黎实例，未在本题完整重测。 |
| 6 | 输入拼写/空格/大小写差异并按需提交 | 部分已采集 | #463 故意保留 docter 拼写差异、小写开头且不加句号。；#464 绿色通过并提示“有错别字哦！”；显示 doctor 的正确写法。只证明本句组合条件被接受，不能推断所有拼写/大小写/标点均容错。 只核实docter、小写开头、无句号这一组合被接受；未分别穷举规则。 |
| 7 | 有意给出错误答案并提交 | 已采集本次实例 | #447 故意把三年写为 ten years；未提交。；#450 红色正确答案使用 three years，three 被突出；原 ten years 草稿保留，确认取消退出未丢失输入。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #450 红色正确答案使用 three years，three 被突出；原 ten years 草稿保留，确认取消退出未丢失输入。；#451 输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #476 英国三年原题再次出现，词库空白。；#477 重练输入框为空。；#478 将首次 ten 改为符合中文意义的 three。；#479 绿色正确，原题纠错完成。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #479 绿色正确，原题纠错完成。；#464 绿色通过并提示“有错别字哦！”；显示 doctor 的正确写法。只证明本句组合条件被接受，不能推断所有拼写/大小写/标点均容错。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 点击正确反馈后的推进入口 | 已采集本次实例 | #480 妈妈题再次出现，缺词空位为空。；#465 巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 打开退出入口，再取消退出 | 部分已采集 | #447 故意把三年写为 ten years；未提交。；#448 出现进度丢失确认，提供继续努力与退出。；#449 捕获弹层淡出中的一帧；不能据本帧宣称弹层已经完全消失。后续提交保留同一草稿。；#450 红色正确答案使用 three years，three 被突出；原 ten years 草稿保留，确认取消退出未丢失输入。 取消后可提交原草稿；449为淡出动画帧，未确认退出重进。 |

<a id="flow-E07"></a>
### E07 · 完成翻译：缺词与整句难度切换

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #451 输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #451 输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。；#457 检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击输入框 | 部分已采集 | #455 单个字母即可启用检查。 桌面短空位可输入；移动端软键盘未采集。 |
| 4 | 加大难度、减少难度，分别输入再切回 | 已采集本次实例 | #452 变为用英语写出这句话，整句输入框为空；出现减少难度。；#453 形成整句模式的部分草稿。；#454 回到缺词模式，空位仍空；整句草稿没有复制入空位。；#458 原整句草稿 Mom has always 保留。；#459 空位仍保持先前清空后的状态；两种难度分别保留草稿。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 输入部分答案 | 已采集本次实例 | #455 单个字母即可启用检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 定位中间字符并修改，再清空 | 部分已采集 | #455 单个字母即可启用检查。；#456 空位内容变成 so，尚未提交。；#457 检查禁用。 已追加末尾字符并清空；中间字符选区未测。 |
| 7 | 输入拼写/空格/大小写差异并按需提交 | 待实测；适用性也待核 | 分别记录被接受、容错提示或判错；不能从一个例子概括全部容错。 尚无对应中文连续操作证据。 |
| 8 | 有意给出错误答案并提交 | 已采集本次实例 | #460 准备故意错误答案。；#461 红色反馈给出 Mom has always been so beautiful.；错误 cold 保留并锁定。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #461 红色反馈给出 Mom has always been so beautiful.；错误 cold 保留并锁定。；#462 另一题“他一直都想要做一个医生。”；显示键盘输入模式。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #480 妈妈题再次出现，缺词空位为空。；#481 形成正确缺词草稿。；#482 绿色正确；空位锁定，继续可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #482 绿色正确；空位锁定，继续可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 点击正确反馈后的推进入口 | 已采集本次实例 | #483 进入单元结算，20经验、64%；时长提示含拍摄等待，不代表正常用时或学习效果。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 13 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E08"></a>
### E08 · 翻译题中的英语语音输入入口

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 开始录音 | 待实测；适用性也待核 | 入口、权限提示、录音中反馈；没有授权时在提示处停止。 尚无对应中文连续操作证据。 |
| 4 | 测试未收到声音的结果（获得许可后） | 待实测；适用性也待核 | 是否有超时、无声音提示和恢复入口；与答错区分。 尚无对应中文连续操作证据。 |
| 5 | 说出给定或自行组织的英语 | 待实测；适用性也待核 | 录音中、处理等待、识别完成状态；需要音频证据核对识别内容。 尚无对应中文连续操作证据。 |
| 6 | 说错或识别不成功后恢复 | 待实测；适用性也待核 | 错误/识别失败文案、重录、转键入或跳过的实际入口。 尚无对应中文连续操作证据。 |
| 7 | 通过提供的入口重试 | 待实测；适用性也待核 | 重录是否覆盖旧答案；再次识别后的结果。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E09"></a>
### E09 · 英语选词填空与中文意义反馈

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 选择一项但暂不提交 | 待实测；适用性也待核 | 选择前后边框、颜色、指示符和主按钮变化。 尚无对应中文连续操作证据。 |
| 4 | 换选另一项，再尝试取消当前选择 | 待实测；适用性也待核 | 旧选择是否解除、是否能回到空答案。 尚无对应中文连续操作证据。 |
| 5 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 7 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E10"></a>
### E10 · 英语图境辅助选词填空

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 选择一项但暂不提交 | 待实测；适用性也待核 | 选择前后边框、颜色、指示符和主按钮变化。 尚无对应中文连续操作证据。 |
| 4 | 换选另一项，再尝试取消当前选择 | 待实测；适用性也待核 | 旧选择是否解除、是否能回到空答案。 尚无对应中文连续操作证据。 |
| 5 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 7 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E11"></a>
### E11 · 英语段落阅读理解选择

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 选择一项但暂不提交 | 待实测；适用性也待核 | 选择前后边框、颜色、指示符和主按钮变化。 尚无对应中文连续操作证据。 |
| 4 | 换选另一项，再尝试取消当前选择 | 待实测；适用性也待核 | 旧选择是否解除、是否能回到空答案。 尚无对应中文连续操作证据。 |
| 5 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 7 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E12"></a>
### E12 · 阅读英语对话，选择合适的下一句

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #060 两个选项 Coffee, please. 和 Welcome.；检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #060 两个选项 Coffee, please. 和 Welcome.；检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 选择一项但暂不提交 | 已采集本次实例 | #061 蓝色选中；检查启用；角色空白气泡未直接填入答案。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 换选另一项，再尝试取消当前选择 | 部分已采集 | #062 蓝色选择转移，尚未判分。；#063 保留错误回答作为提交前证据。 已验证改选；未验证取消同一选项。 |
| 5 | 有意给出错误答案并提交 | 已采集本次实例 | #063 保留错误回答作为提交前证据。；#064 红心2变1；同时显示正确英文 Coffee, please. 与中文“咖啡，谢谢。”。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #064 红心2变1；同时显示正确英文 Coffee, please. 与中文“咖啡，谢谢。”。；#065 进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #131 原对话 Coffee or tea? 及两项原选项重现，带错题重练。；#132 正确回答变蓝，等待提交。；#133 绿色反馈，同时给中文意思，连对5题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #133 绿色反馈，同时给中文意思，连对5题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 点击正确反馈后的推进入口 | 已采集本次实例 | #134 之前被普通跳过的 coffee 翻译题重现，带错题重练。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E13"></a>
### E13 · 听英语，用英语词块拼出内容

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #065 进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 播放、重播与慢速播放（按实际入口） | 部分已采集 | #070 保留点击后的播放控件画面；没有保存音轨，不能证明声音正常或播放持续时间。；#071 保留慢速入口点击后的画面；音频速度与声音质量未另行听验。 只记录按钮操作；没有音轨证据，未听验声音质量与速度。 |
| 3 | 保持空答案，检查提交入口 | 已采集本次实例 | #065 进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。；#078 词块答案清空，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 选择第一个词块 | 已采集本次实例 | #072 please 进入答案区，检查启用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 继续选词，形成部分答案 | 已采集本次实例 | #079 两个词块进入答案区；不代表必须使用全部词块。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 移除中间或最后一个已选词，再选回来 | 部分已采集 | #077 先前的 please 词块草稿恢复；两个输入模式各有草稿。；#078 词块答案清空，检查禁用。 验证撤回一个词；多词中间位置移除待补。 |
| 7 | 撤回所有词块 | 已采集本次实例 | #078 词块答案清空，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 构造错误词序，并在提交前修改 | 待实测；适用性也待核 | 是否只能逐个撤回、能否直接换位置；只记录实际支持的方式。 尚无对应中文连续操作证据。 |
| 9 | 有意给出错误答案并提交 | 已采集本次实例 | #402 形成词块草稿、检查可用；即时帧含词块移动动画，不作为稳定排列图。；#403 红色纠错给出 in the same place 及中文在同样的地方；词块草稿保留并锁定。音轨未听验。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #403 红色纠错给出 in the same place 及中文在同样的地方；词块草稿保留并锁定。音轨未听验。；#404 英译中 She has worked as a server for five years.，空答案及中文词库。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 12 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 13 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 14 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |
| 15 | 检查键盘或可选播放入口（若存在） | 已采集本次实例 | #072 please 进入答案区，检查启用。；#073 标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。；#077 先前的 please 词块草稿恢复；两个输入模式各有草稿。；#080 Tea, please. 文本草稿仍保留。 仅支持本次实例，其他条件仍受整体边界限制。 |

<a id="flow-E14"></a>
### E14 · 听英语内容，选择对应中文解释

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #411 先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #411 先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 首次播放音频，再重播 | 待实测；适用性也待核 | 播放中和停止后的按钮状态；声音另行听验，截图不能证明声音正常。 尚无对应中文连续操作证据。 |
| 4 | 操作慢速播放（若存在） | 待实测；适用性也待核 | 切换控件与播放状态；无入口则标不适用。 尚无对应中文连续操作证据。 |
| 5 | 选择答案，再改选 | 已采集本次实例 | #412 第一项蓝色选中，检查启用。；#413 蓝色选择转移，旧项解除，尚未提交。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 打开不做听力/跳过入口（若存在） | 待实测；适用性也待核 | 真实提示、替代题或跳题结果，是否影响本课后续听力。 尚无对应中文连续操作证据。 |
| 7 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 8 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 9 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 10 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #414 第二项被判正确，绿色反馈；本题没有采到错误分支，未听验原音轨。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 点击正确反馈后的推进入口 | 已采集本次实例 | #415 进入另一道词块听写；不是第401图的同一音频题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E15"></a>
### E15 · 英语朗读：录音、未通过提示与跳过

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #235 进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #235 进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 开始录音 | 部分已采集 | #236 录音条变为波形界面，示范播放禁用；未提供可核对的口述音轨，波形不证明录音或识别质量。 仅见波形界面；原生授权与实际收音情况未核。 |
| 4 | 测试未收到声音的结果（获得许可后） | 部分已采集 | #237 捕获黄色瞬时提示：呃～听起来不太对哦，再试一次吧；随后重新出现录音入口。未判断原因是无声、设备还是发音。 停止后出现未通过提示；没有音轨，不能判定原因是无声还是发音。 |
| 5 | 说出给定或自行组织的英语 | 待实测；适用性也待核 | 录音中、处理等待、识别完成状态；需要音频证据核对识别内容。 尚无对应中文连续操作证据。 |
| 6 | 说错或识别不成功后恢复 | 部分已采集 | #237 捕获黄色瞬时提示：呃～听起来不太对哦，再试一次吧；随后重新出现录音入口。未判断原因是无声、设备还是发音。；#238 出现黄色跳过状态，录音入口禁用，文案却是发音好棒哦；此操作没有成功朗读，不能解释成识别正确。 未通过提示与跳过已实测；没有重录成功。 |
| 7 | 通过提供的入口重试 | 待实测；适用性也待核 | 重录是否覆盖旧答案；再次识别后的结果。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E16"></a>
### E16 · 理解英语问题并说出正确回应

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 开始录音 | 待实测；适用性也待核 | 入口、权限提示、录音中反馈；没有授权时在提示处停止。 尚无对应中文连续操作证据。 |
| 4 | 测试未收到声音的结果（获得许可后） | 待实测；适用性也待核 | 是否有超时、无声音提示和恢复入口；与答错区分。 尚无对应中文连续操作证据。 |
| 5 | 说出给定或自行组织的英语 | 待实测；适用性也待核 | 录音中、处理等待、识别完成状态；需要音频证据核对识别内容。 尚无对应中文连续操作证据。 |
| 6 | 说错或识别不成功后恢复 | 待实测；适用性也待核 | 错误/识别失败文案、重录、转键入或跳过的实际入口。 尚无对应中文连续操作证据。 |
| 7 | 通过提供的入口重试 | 待实测；适用性也待核 | 重录是否覆盖旧答案；再次识别后的结果。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E17"></a>
### E17 · 英语近音词二选一听辨

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #201 出现你听到了什么、dock/deck 两选项、大播放按钮；检查禁用，题页顶部没有红心显示。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #201 出现你听到了什么、dock/deck 两选项、大播放按钮；检查禁用，题页顶部没有红心显示。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 首次播放音频，再重播 | 部分已采集 | #217 仍显示错误反馈，播放入口可点击；原音轨与播放质量没有保存验证。 只验证错误反馈页仍可点播放；未听验。 |
| 4 | 操作慢速播放（若存在） | 待实测；适用性也待核 | 切换控件与播放状态；无入口则标不适用。 尚无对应中文连续操作证据。 |
| 5 | 选择答案，再改选 | 已采集本次实例 | #202 dock 变蓝；这张即时帧的检查仍灰色，不能拿它证明已完成按钮过渡。；#203 选择转移到 deck；此时检查为绿色。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 打开不做听力/跳过入口（若存在） | 待实测；适用性也待核 | 真实提示、替代题或跳题结果，是否影响本课后续听力。 尚无对应中文连续操作证据。 |
| 7 | 有意给出错误答案并提交 | 已采集本次实例 | #215 get 变蓝，等待提交。；#216 此次 get 被判错，红色提示还不太准确，再多听几次吧；选项锁定，未列出正确词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #217 仍显示错误反馈，播放入口可点击；原音轨与播放质量没有保存验证。；#218 进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 继续本课，检查原题何时再次出现 | 部分已采集 | #251 回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。；#252 此轮 got 为提交草稿。；#253 got 实际被判正确；只确认此次结果，不凭文字相同断言是原音轨重练。 课末同组选项再现；没有音轨身份核验，不证明同音同题重练。 |
| 10 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #204 本题实际正确，dock 与底部反馈变绿；提供太简单、太难、报错。；#253 got 实际被判正确；只确认此次结果，不凭文字相同断言是原音轨重练。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 点击正确反馈后的推进入口 | 已采集本次实例 | #205 新题选项为 got/get；不能把相同标题当成同一条音频。；#254 再次进入声音同异题；作答前英语词形隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E18"></a>
### E18 · 听两个英语声音，判断词语相同或不同

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #218 进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #218 进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 首次播放音频，再重播 | 部分已采集 | #223 保留点击后按钮画面；没有据此宣称声音正常。；#224 两个声音可以分别触发；这不是语音输入。 两入口均可点击；音轨质量未核。 |
| 4 | 操作慢速播放（若存在） | 待实测；适用性也待核 | 切换控件与播放状态；无入口则标不适用。 尚无对应中文连续操作证据。 |
| 5 | 选择答案，再改选 | 已采集本次实例 | #219 第一项蓝色选中，检查启用。；#220 蓝色选择转移，单词仍隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 打开不做听力/跳过入口（若存在） | 已采集本次实例 | #233 转到另一道声音同异题，不是在原题原位修改。；#234 底部是黄色反馈和继续，显示 get/get 及音标；尽管文案为看，多练几次真的有用吧，不能把跳过算正确作答。；#235 进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 有意给出错误答案并提交 | 已采集本次实例 | #231 作答草稿为同一个词。；#232 实际判错；揭晓 got 与 get 及两者音标，红色反馈；选项锁定。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #232 实际判错；揭晓 got 与 get 及两者音标，红色反馈；选项锁定。；#233 转到另一道声音同异题，不是在原题原位修改。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 继续本课，检查原题何时再次出现 | 部分已采集 | #254 再次进入声音同异题；作答前英语词形隐藏。；#255 保留作答草稿，准备检查。；#256 实际正确，显示 got/get 与音标；对应词对与之前错误实例一致，但没有核对原音轨一致性。 同一词对再现；没有音轨身份核验，不证明同音同题重练。 |
| 10 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #221 实际正确；播放位置显示 deck 与 dock，底部补出单词及音标。；#226 实际正确；两个位置显示 get，底部为 get 及音标。；#256 实际正确，显示 got/get 与音标；对应词对与之前错误实例一致，但没有核对原音轨一致性。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 点击正确反馈后的推进入口 | 已采集本次实例 | #222 进入下一道声音同异题，两词再次隐藏。；#257 发音专项实际进入单元完成页；本次研究采集显示11经验、83%，不代表听说能力或正常学习成效。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E19"></a>
### E19 · 听英语声音，配对英语书面词

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #239 进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 播放、重播与慢速播放（按实际入口） | 部分已采集 | #240 音频卡出现蓝色高亮，还未形成配对。 实际点击播放；无音轨听验，未见慢速入口但未据此排除其他版本。 |
| 3 | 保持空答案，检查提交入口 | 已采集本次实例 | #239 进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点左侧或右侧的一张卡 | 已采集本次实例 | #240 音频卡出现蓝色高亮，还未形成配对。；#245 右列也能先选，文字出现蓝色高亮。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 点同一卡或同列另一卡 | 待实测；适用性也待核 | 取消/换选规则，以及高亮如何改变。 尚无对应中文连续操作证据。 |
| 6 | 选一个不匹配的另一侧项目 | 已采集本次实例 | #241 第1声音与 deck 短暂标红；错误局限于当前一对，题页未显示红心。；#242 仍在原题；错误对恢复可选，可以重新配对。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 错误后再选一对正确项目 | 已采集本次实例 | #242 仍在原题；错误对恢复可选，可以重新配对。；#243 这对短暂变绿，实际配对正确。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 配对正确，但不完成全部 | 已采集本次实例 | #243 这对短暂变绿，实际配对正确。；#244 第1声音和 got 变浅并禁用，其他项目仍可操作。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 完成所有剩余配对 | 已采集本次实例 | #249 该对变绿，前三对已完成。；#250 所有项目禁用，自动出现绿色正确与继续；没有点击检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 点击推进入口 | 已采集本次实例 | #251 回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 已配对状态是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-E20"></a>
### E20 · 听英语，配对中文词义

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 播放、重播与慢速播放（按实际入口） | 待实测；适用性也待核 | 控件操作截图与声音证据分开记录，截图不能证明声音正常。 尚无对应中文连续操作证据。 |
| 3 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 4 | 点左侧或右侧的一张卡 | 待实测；适用性也待核 | 单边选中态；是否允许两种起始方向。 尚无对应中文连续操作证据。 |
| 5 | 点同一卡或同列另一卡 | 待实测；适用性也待核 | 取消/换选规则，以及高亮如何改变。 尚无对应中文连续操作证据。 |
| 6 | 选一个不匹配的另一侧项目 | 待实测；适用性也待核 | 错误刚出现的反馈、反馈稳定后状态；是否扣资源、是否自动解除选择。 尚无对应中文连续操作证据。 |
| 7 | 错误后再选一对正确项目 | 待实测；适用性也待核 | 哪些项目仍可操作，是否保留上次选择。 尚无对应中文连续操作证据。 |
| 8 | 配对正确，但不完成全部 | 待实测；适用性也待核 | 正确颜色、禁用/消失、后续可选项目。 尚无对应中文连续操作证据。 |
| 9 | 完成所有剩余配对 | 待实测；适用性也待核 | 是否自动判分、是否还有检查按钮、完成反馈与推进入口。 尚无对应中文连续操作证据。 |
| 10 | 点击推进入口 | 待实测；适用性也待核 | 实际下一题或结算画面。 尚无对应中文连续操作证据。 |
| 11 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 已配对状态是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-E21"></a>
### E21 · 按中文意义，看图选择英语词

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #010 三张图卡尚未选中；检查为灰色，红心为5。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #010 三张图卡尚未选中；检查为灰色，红心为5。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 选择一项但暂不提交 | 已采集本次实例 | #011 coffee 变蓝；检查变绿；尚未判定正确与否。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 换选另一项，再尝试取消当前选择 | 已采集本次实例 | #012 tea 变蓝，coffee 恢复；维持单选。；#013 tea 仍选中；重复点击未回到空答案。；#014 sugar 变蓝；这是错误草稿，还没有判错。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 有意给出错误答案并提交 | 已采集本次实例 | #014 sugar 变蓝；这是错误草稿，还没有判错。；#015 红心5变4；首次错误说明弹层遮住题目，底部已出现红色答案反馈。；#016 显示“正确答案：tea”；选项已锁定，底部红色继续。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #016 显示“正确答案：tea”；选项已锁定，底部红色继续。；#017 进入下一道文字选词题“茶”；不是在原看图题内编辑。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #120 出现“复习一下之前你不太熟练的部分”过场；不是一道新题。；#121 同一“哪个是茶”与原三个选项重现，带错题重练标签。；#122 重新选择，未沿用第一次的错误答案。；#123 同题答对，tea变绿，显示绿色继续。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #123 同题答对，tea变绿，显示绿色继续。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 点击正确反馈后的推进入口 | 已采集本次实例 | #124 原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E22"></a>
### E22 · 听英语，键入英语词句

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #073 标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 播放、重播与慢速播放（按实际入口） | 部分已采集 | #070 保留点击后的播放控件画面；没有保存音轨，不能证明声音正常或播放持续时间。；#071 保留慢速入口点击后的画面；音频速度与声音质量未另行听验。 与词库同题的播放按钮已点击；没有音轨证据。 |
| 3 | 保持空答案，检查提交入口 | 已采集本次实例 | #073 标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。；#075 显示占位文字，检查再次禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击输入框 | 部分已采集 | #073 标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。；#074 输入框出现草稿；检查启用。 桌面输入可用；未采移动端软键盘、光标特写。 |
| 5 | 输入部分答案 | 部分已采集 | #074 输入框出现草稿；检查启用。 输入 coffee 后检查可用；逐字符阈值未穷举。 |
| 6 | 定位中间字符并修改，再清空 | 部分已采集 | #074 输入框出现草稿；检查启用。；#075 显示占位文字，检查再次禁用。；#076 形成新的未提交草稿；此时尚无正确判断。 已验证整框清空和重填；中间字符选区修改未测试。 |
| 7 | 输入拼写/空格/大小写差异并按需提交 | 待实测；适用性也待核 | 分别记录被接受、容错提示或判错；不能从一个例子概括全部容错。 尚无对应中文连续操作证据。 |
| 8 | 有意给出错误答案并提交 | 已采集本次实例 | #080 Tea, please. 文本草稿仍保留。；#081 实际判错，正确答案为 tea；红心归零，弹出本次入门课的免费补心提示。；#082 红心恢复为5；仍停在错误反馈页，原文本锁定，显示英文 tea 与中文茶。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #082 红心恢复为5；仍停在错误反馈页，原文本锁定，显示英文 tea 与中文茶。；#083 进入新的对话 Tea or coffee?；听写不能原位编辑。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 11 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 12 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 13 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E23"></a>
### E23 · 按中文词义，选择对应英语词

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #017 进入下一道文字选词题“茶”；不是在原看图题内编辑。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #017 进入下一道文字选词题“茶”；不是在原看图题内编辑。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 选择一项但暂不提交 | 已采集本次实例 | #020 coffee 变蓝；检查可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 换选另一项，再尝试取消当前选择 | 部分已采集 | #021 选中状态从 coffee 转移到 tea。；#022 hot 为当前蓝色选项；尚未判错。 已验证改选；未验证再次点击同一文字选项能否取消。 |
| 5 | 有意给出错误答案并提交 | 已采集本次实例 | #022 hot 为当前蓝色选项；尚未判错。；#023 显示正确答案 tea，原选项锁定；红心4变3。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #023 显示正确答案 tea，原选项锁定；红心4变3。；#024 切换到新的看图题“哪个是咖啡”。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #124 原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。；#125 重练题的正确选项变蓝，等待提交。；#126 同题绿色反馈，标记连对3题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #126 同题绿色反馈，标记连对3题。；#037 coffee 变绿，显示你太棒了和连对2题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 点击正确反馈后的推进入口 | 已采集本次实例 | #127 显示鼓励过场“你的辛勤付出得到了回报！”；本帧不是welcome题。；#038 进入英译中词块题 welcome；首次提示可悬停查看词义。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 打开退出入口，再取消退出 | 已采集本次实例 | #034 蓝色选中 coffee，尚未提交。；#035 弹出“现在离开的话，你的进度就没了”；提供继续努力与退出。；#036 返回原题，coffee 的选择仍保留。 仅支持本次实例，其他条件仍受整体边界限制。 |

<a id="flow-S01"></a>
### S01 · 故事阅读理解：字面意义、意图与总结

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #307 出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #307 出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击一个候选，观察是否立即判分 | 已采集本次实例 | #308 立即标红并出现叉号，无需点击检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击错误候选 | 已采集本次实例 | #308 立即标红并出现叉号，无需点击检查。；#310 第二个错误项立即标红，第一项保持灰色。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 等待错误反馈稳定 | 已采集本次实例 | #309 错误项变灰并禁用，另外两项仍可选；继续仍禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在同题选择另一个候选 | 已采集本次实例 | #310 第二个错误项立即标红，第一项保持灰色。；#311 正确项变绿，继续启用；此帧是即时结果，底部反馈动画尚未完整出现。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选择正确项 | 已采集本次实例 | #311 正确项变绿，继续启用；此帧是即时结果，底部反馈动画尚未完整出现。；#324 立即绿色正确反馈；这是语用理解的独立题，不与第307图拼成同一题。；#345 立即绿色正确；这是结尾总结题的独立实例。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 按实际方式推进 | 已采集本次实例 | #312 原题收起，新增 The directions on my phone say that road is faster…；已实际推进。；#325 司机答应 OK, OK.；上道题已经推进。；#346 出现五组中英词语配对；保留上文，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 打开退出并取消 | 待实测；适用性也待核 | 确认信息、恢复后当前选择是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-S02"></a>
### S02 · 故事词义定位：按中文意义点英语片段

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #313 出现“哪一个选项的意思是导航指示？”；原句被拆成可选英语片段，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #313 出现“哪一个选项的意思是导航指示？”；原句被拆成可选英语片段，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击一个候选，观察是否立即判分 | 已采集本次实例 | #314 该片段立即标红，未获得继续资格。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击错误候选 | 已采集本次实例 | #314 该片段立即标红，未获得继续资格。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 等待错误反馈稳定 | 已采集本次实例 | #315 road 变灰禁用，其余片段可选；没有重新打开整道题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在同题选择另一个候选 | 已采集本次实例 | #316 正确片段变绿，所有片段锁定，继续可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选择正确项 | 已采集本次实例 | #316 正确片段变绿，所有片段锁定，继续可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 按实际方式推进 | 已采集本次实例 | #319 新增司机说他认识本城所有道路的英文台词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 打开退出并取消 | 已采集本次实例 | #317 出现“现在离开的话，你的进度就没了”，提供继续努力与退出。；#318 弹层关闭，原正确片段仍保留，未清空答案。 仅支持本次实例，其他条件仍受整体边界限制。 |

<a id="flow-S03"></a>
### S03 · 故事末尾开放写作

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 阅读情境与问题，查看提示（若存在） | 待实测；适用性也待核 | 完整上下文、作答限制和提示开启/关闭状态。 尚无对应中文连续操作证据。 |
| 4 | 输入部分回答，修改后提交 | 待实测；适用性也待核 | 文本编辑、长度要求、发送/检查按钮的变化。 尚无对应中文连续操作证据。 |
| 5 | 提交不满足任务的回答（若允许） | 待实测；适用性也待核 | 是否给语义建议、要求补写、拒收或判错；不强套单选题红绿反馈。 尚无对应中文连续操作证据。 |
| 6 | 根据反馈修改并再次提交（若提供） | 待实测；适用性也待核 | 反馈与原文如何对应、是否保留旧答案、修改后的结果。 尚无对应中文连续操作证据。 |
| 7 | 完成任务并继续 | 待实测；适用性也待核 | 评价或总结、是否能回看、实际下一页。 尚无对应中文连续操作证据。 |
| 8 | 退出并重进（若可安全恢复） | 待实测；适用性也待核 | 草稿与对话是否保留、丢弃确认。 尚无对应中文连续操作证据。 |

<a id="flow-S04"></a>
### S04 · 故事短语补全：带回放的缺句选择

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #328 “选择短语”：No, ____ . Why?，旁有回放，三个英语短语候选；作答前缺失片段不可见。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #328 “选择短语”：No, ____ . Why?，旁有回放，三个英语短语候选；作答前缺失片段不可见。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击一个候选，观察是否立即判分 | 已采集本次实例 | #329 片段立即标红；不需要检查按钮。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击错误候选 | 已采集本次实例 | #329 片段立即标红；不需要检查按钮。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 等待错误反馈稳定 | 已采集本次实例 | #330 错误候选变灰，空位仍在，其他候选可选。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在同题选择另一个候选 | 已采集本次实例 | #331 候选变绿，整句补全 No, I'm going shopping. Why?；继续启用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选择正确项 | 已采集本次实例 | #331 候选变绿，整句补全 No, I'm going shopping. Why?；继续启用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 按实际方式推进 | 已采集本次实例 | #332 司机说道路止于河边，已推进到后文。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 打开退出并取消 | 待实测；适用性也待核 | 确认信息、恢复后当前选择是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-S05"></a>
### S05 · 故事听音重组：逐片段接受正确前缀

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #334 “重组听到的句子”：气泡文字隐藏，三个片段 are wrong / directions / I think my；继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #334 “重组听到的句子”：气泡文字隐藏，三个片段 are wrong / directions / I think my；继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点错误位置的片段 | 已采集本次实例 | #335 错误片段标红，但没有插入答案区。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 等待错误反馈结束 | 已采集本次实例 | #336 are wrong 恢复可选；与故事词义选择的错误项永久变灰不同。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 选择正确前缀 | 已采集本次实例 | #337 接受正确前缀并在气泡中显示，对应按钮禁用；其余片段仍可选。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 已有前缀后选择错误片段 | 已采集本次实例 | #338 当前片段标红，已经接受的 I think my 保留。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 继续选正确片段 | 已采集本次实例 | #339 气泡增加 directions，已用片段禁用，只剩 are wrong 可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 补全最后片段 | 已采集本次实例 | #340 整句 I think my directions are wrong. 出现，自动绿色反馈与继续；每个片段即时判定。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 点击继续 | 已采集本次实例 | #341 新增 I'm so sorry.，重组题已推进。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 重播音频 | 待实测；适用性也待核 | 画面与声音质量分开核对。 尚无对应中文连续操作证据。 |
| 11 | 打开退出并取消 | 待实测；适用性也待核 | 正确前缀是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-R01"></a>
### R01 · Radio：找出听到的两个英语单词

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #523 选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #523 选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击错误词 | 已采集本次实例 | #524 该词立即变红；不是先选满两项再统一判分。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 等待错误状态稳定 | 已采集本次实例 | #525 boring 变灰禁用，其余两个词仍可点。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 找到一个正确词 | 已采集本次实例 | #526 第一个正确词即时变绿，尚未完成两词要求。；#527 class 保持绿色锁定，favorite 仍可点，未自动进入下一段。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 完成要求的两个词 | 已采集本次实例 | #527 class 保持绿色锁定，favorite 仍可点，未自动进入下一段。；#528 两词都绿，任务达到要求数量后自动推进。；#529 “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选齐目标词 | 已采集本次实例 | #528 两词都绿，任务达到要求数量后自动推进。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 等待实际下一段 | 已采集本次实例 | #529 “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 重播问题音频 | 待实测；适用性也待核 | 按钮变化与听验分别记录。 尚无对应中文连续操作证据。 |
| 10 | 退出后取消 | 待实测；适用性也待核 | 已完成词是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-R02"></a>
### R02 · Radio：英语声音配中文释义

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #502 莉莉演播室上方为进度和无限红心；下方选择配对，四个声音与年、学校、图片、法语。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 播放、重播与慢速播放（按实际入口） | 部分已采集 | #503 左侧音频蓝色选中，尚未配对。 只操作声音按钮，未保存音轨或听验；没有慢速操作证据。 |
| 3 | 保持空答案，检查提交入口 | 已采集本次实例 | #502 莉莉演播室上方为进度和无限红心；下方选择配对，四个声音与年、学校、图片、法语。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点左侧或右侧的一张卡 | 已采集本次实例 | #503 左侧音频蓝色选中，尚未配对。；#509 中文选项蓝色高亮，证实可从右列开始。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 点同一卡或同列另一卡 | 待实测；适用性也待核 | 取消/换选规则，以及高亮如何改变。 尚无对应中文连续操作证据。 |
| 6 | 选一个不匹配的另一侧项目 | 已采集本次实例 | #507 错误对立即红色，已完成 year 保留。；#508 错误对恢复可选；仍在同一题，不用重新进入。；#510 该配对也错误，学校与声音2标红。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 错误后再选一对正确项目 | 已采集本次实例 | #508 错误对恢复可选；仍在同一题，不用重新进入。；#511 绿色正确，并揭示 French。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 配对正确，但不完成全部 | 已采集本次实例 | #504 配对正确变绿，声音卡揭示英语拼写 year。；#505 year/年变浅禁用，其他三对仍可选。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 完成所有剩余配对 | 已采集本次实例 | #514 正确并揭示 pictures。；#515 单边蓝色高亮，之前配对保留。；#516 最后一对正确并揭示 school，进度开始推进；没有检查或继续按钮。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 点击推进入口 | 已采集本次实例 | #517 配对区域消失，恢复角色对话播放，底部回退5秒/暂停/前进控件；本帧前进为灰色。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 已配对状态是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-R03"></a>
### R03 · Radio：判断中文陈述与英语内容是否一致

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #518 “她去年在学校学习了西班牙语。”；音频波形与勾/叉二选一，作答前英文句子隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #518 “她去年在学校学习了西班牙语。”；音频波形与勾/叉二选一，作答前英文句子隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击一个候选，观察是否立即判分 | 已采集本次实例 | #519 立即标红，揭示 I learned French at school last year.，帮助比对 French 与西班牙语。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击错误候选 | 已采集本次实例 | #519 立即标红，揭示 I learned French at school last year.，帮助比对 French 与西班牙语。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 等待错误反馈稳定 | 已采集本次实例 | #520 勾选项变灰禁用；叉仍可点，英文句子保留。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在同题选择另一个候选 | 已采集本次实例 | #521 绿色正确，进度推进；不需要再点检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选择正确项 | 已采集本次实例 | #521 绿色正确，进度推进；不需要再点检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 按实际方式推进 | 已采集本次实例 | #522 问题收起，恢复角色对话与播放控件。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 打开退出并取消 | 待实测；适用性也待核 | 确认信息、恢复后当前选择是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-R04"></a>
### R04 · Radio 听音选择图片

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 首次播放音频，再重播 | 待实测；适用性也待核 | 播放中和停止后的按钮状态；声音另行听验，截图不能证明声音正常。 尚无对应中文连续操作证据。 |
| 4 | 操作慢速播放（若存在） | 待实测；适用性也待核 | 切换控件与播放状态；无入口则标不适用。 尚无对应中文连续操作证据。 |
| 5 | 选择答案，再改选 | 待实测；适用性也待核 | 单选/多选规则、要求数量与主按钮是否可用。 尚无对应中文连续操作证据。 |
| 6 | 打开不做听力/跳过入口（若存在） | 待实测；适用性也待核 | 真实提示、替代题或跳题结果，是否影响本课后续听力。 尚无对应中文连续操作证据。 |
| 7 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 8 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 9 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 10 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 11 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 12 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-R05"></a>
### R05 · Radio：中文选项核对节目内容

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #529 “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #529 “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击一个候选，观察是否立即判分 | 已采集本次实例 | #530 即时标红。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击错误候选 | 已采集本次实例 | #530 即时标红。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 等待错误反馈稳定 | 已采集本次实例 | #531 错误候选变灰禁用，另一选项可点。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在同题选择另一个候选 | 已采集本次实例 | #532 绿色正确，进度推进。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选择正确项 | 已采集本次实例 | #532 绿色正确，进度推进。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 按实际方式推进 | 已采集本次实例 | #533 问题收起并继续播放，进度到末端；尚非结算画面。；#534 实际结算显示30经验、0%，并提供查看文本；本次每类任务都有试错，数值不能当作学习成效。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 打开退出并取消 | 待实测；适用性也待核 | 确认信息、恢复后当前选择是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-A01"></a>
### A01 · Adventures 场景探索/点物/读标牌

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 点击可走区域，再点不可交互区域 | 待实测；适用性也待核 | 移动/无反应反馈与边界；不能把无语言判分的走动算答对。 尚无对应中文连续操作证据。 |
| 3 | 点击物体或标牌 | 待实测；适用性也待核 | 高亮、文字提示、关闭与重开。 尚无对应中文连续操作证据。 |
| 4 | 触发角色对话，再返回场景 | 待实测；适用性也待核 | 场景与对话切换、目标是否更新；回应判分另见 A02。 尚无对应中文连续操作证据。 |
| 5 | 退出并返回场景（若提供） | 待实测；适用性也待核 | 位置、目标与已触发事件是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-A02"></a>
### A02 · Adventures 英语回应选择

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 选择一项但暂不提交 | 待实测；适用性也待核 | 选择前后边框、颜色、指示符和主按钮变化。 尚无对应中文连续操作证据。 |
| 4 | 换选另一项，再尝试取消当前选择 | 待实测；适用性也待核 | 旧选择是否解除、是否能回到空答案。 尚无对应中文连续操作证据。 |
| 5 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 7 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-M01"></a>
### M01 · Roleplay 英语多轮文字情境聊天（中文覆盖待核）

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 阅读情境与问题，查看提示（若存在） | 待实测；适用性也待核 | 完整上下文、作答限制和提示开启/关闭状态。 尚无对应中文连续操作证据。 |
| 4 | 输入部分回答，修改后提交 | 待实测；适用性也待核 | 文本编辑、长度要求、发送/检查按钮的变化。 尚无对应中文连续操作证据。 |
| 5 | 提交不满足任务的回答（若允许） | 待实测；适用性也待核 | 是否给语义建议、要求补写、拒收或判错；不强套单选题红绿反馈。 尚无对应中文连续操作证据。 |
| 6 | 根据反馈修改并再次提交（若提供） | 待实测；适用性也待核 | 反馈与原文如何对应、是否保留旧答案、修改后的结果。 尚无对应中文连续操作证据。 |
| 7 | 完成任务并继续 | 待实测；适用性也待核 | 评价或总结、是否能回看、实际下一页。 尚无对应中文连续操作证据。 |
| 8 | 退出并重进（若可安全恢复） | 待实测；适用性也待核 | 草稿与对话是否保留、丢弃确认。 尚无对应中文连续操作证据。 |

<a id="flow-M02"></a>
### M02 · Video Call with Lily 英语自由对话

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 进入通话前说明，再启动 | 待实测；适用性也待核 | 情境、目标、权限、连接中与接通画面。 尚无对应中文连续操作证据。 |
| 3 | 完成一轮听与说 | 待实测；适用性也待核 | 角色发言、用户轮次、字幕/提示、等待识别状态。 尚无对应中文连续操作证据。 |
| 4 | 请求重复或未能回答时继续 | 待实测；适用性也待核 | 如何澄清、提示或追问；不假定存在固定判错。 尚无对应中文连续操作证据。 |
| 5 | 处理中断或未识别情况 | 待实测；适用性也待核 | 重连/重录/退出的实际入口；真实故障无法安全复现时记录缺口。 尚无对应中文连续操作证据。 |
| 6 | 结束通话并查看结果 | 待实测；适用性也待核 | 总结、转录、建议、下一步及回看入口。 尚无对应中文连续操作证据。 |

<a id="flow-M03"></a>
### M03 · Video Call with Falstaff 英语引导对话

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 进入通话前说明，再启动 | 待实测；适用性也待核 | 情境、目标、权限、连接中与接通画面。 尚无对应中文连续操作证据。 |
| 3 | 完成一轮听与说 | 待实测；适用性也待核 | 角色发言、用户轮次、字幕/提示、等待识别状态。 尚无对应中文连续操作证据。 |
| 4 | 请求重复或未能回答时继续 | 待实测；适用性也待核 | 如何澄清、提示或追问；不假定存在固定判错。 尚无对应中文连续操作证据。 |
| 5 | 处理中断或未识别情况 | 待实测；适用性也待核 | 重连/重录/退出的实际入口；真实故障无法安全复现时记录缺口。 尚无对应中文连续操作证据。 |
| 6 | 结束通话并查看结果 | 待实测；适用性也待核 | 总结、转录、建议、下一步及回看入口。 尚无对应中文连续操作证据。 |


<a id="non-audio"></a>
## 4.1 不含口语和听力的题目

本组 17 个研究条目：11 项有中文图像证据，其中 11 项有完整题页；另 6 项仍待核实中文课程与具体题图。条目含情境和输入变体，不是官方题型总数。

按当前文字/图片分支能否独立完成归类：通过点选、配对或键入作答；可选播放按钮不使其成为必做听力题。Stories 的 S01/S02 本轮已实测可见文字分支；整篇故事仍含听音任务。Adventures 与 Roleplay 文字分支继续待核，不承诺整节课完全无声。

<a id="E01"></a>
### E01 · 中英词语配对

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**阅读两列词语并点选配对，作答不依赖声音。
**能力目标：**识别英语词形，把它与已知中文意义配对。
**输入与输出（待核项目为分析示例）：**中文茶、欢迎、咖啡、热与英语 hot、coffee、tea、welcome。 → 逐对连接意义相同的词。

**用户操作（待核项目为条件分析）**

1. 从左列或右列任选一个词；此时仅蓝色选中。
2. 选择另一列的对应词；系统立即判定这一对，无需检查。
3. 错配短暂变红后恢复可选；重新配对。正确项短暂变绿，再变浅并锁定。
4. 完成全部配对，系统自动显示绿色反馈；点击继续进入下一道听写题。

**本轮中文网页实测事实：**访客F07的四对实例：本轮桌面题有左右两列、每列四词。错配欢迎与 tea 的红色只短暂出现，底部没有整题错误栏；红心5变4。正确项随后变浅禁用，其余词仍可操作。 Super故事F22为五对词语/短语，并显示无限红心。
**中文用户的任务负担：**找位置和判断词义并行。若只截最终变浅的画面，会漏掉最关键的瞬时红色错误反馈。
**设计解读：**两列候选把回忆变成识别；逐对即时反馈缩短了行为与结果的间隔。完成一对就锁定能减少剩余搜索量，也可能让最后一对通过排除得到。
**反馈建议（分析）：**课程设计可以保留已配对项，并在错误后提供可重复查看的词义提示；本轮错配主要靠颜色及红心反馈。
**证据与能力边界：**F07 实测同题错误、原位恢复、正确与全部完成。重复点击同一卡是否取消、退出后恢复和移动端尚未测试。此前官方手机图只作另一版本参考。 新增F22：Super故事末尾有五对中英短语，错误原位恢复、正确后锁定，全部配完自动继续；本页无限红心，不沿用访客扣心结论。
**课程与套餐：**2026-09-27 中文→英语桌面网页版访客入门课实际出现。当前结论限于所记录题干、平台和会话。 此次另有登录Super的会话C/D补充，详情见对应连续流程。 同时有A/B免费访客与C/D登录Super的实例，分别记录；均不推定Max或移动端规则。

![进入中英配对；左列茶、欢迎、咖啡、热；右列 hot、coffee、tea、welcome；检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/090.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/lesson)

![点击继续；出现五组中英词语配对；保留上文，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/346.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/stories/en-zh-taxi-ride?mode=read&practiceHubStory=featured)

![中英词语配对 · 全部配对后的反馈](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/cn-apple-word-matching.webp)

图证：完整中文题页 · 正确反馈状态；界面：中文；学习方向：中文母语→英语。完整应用题目区域：顶部关闭、进度、连对数字与心形；五组词语；正确反馈“不错哦!”；底部完整“继续”和 Home 条。未含系统时间栏不影响题目区域完整性。画面为全部配对完成后的正确反馈状态，不证明未作答或错误状态。
[来源页面](https://apps.apple.com/cn/iphone/story/id1605587215)

<a id="E04"></a>
### E04 · 英译中：用中文词块表达英语意义

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**阅读英语原句，用中文词块作答；播放是可选辅助。
**能力目标：**理解英语词句，按中文表达顺序组织给定词块。
**输入与输出（待核项目为分析示例）：**welcome；另一实例为 Tea, please. 与谢谢、牛奶、茶。 → 欢迎；另一实例为茶 / 谢谢。

**用户操作（待核项目为条件分析）**

1. 阅读英语题干，点词库中的中文词块；词块移入答案区，原位置变灰。
2. 点击答案区词块可撤回；清空后检查禁用。移除前词会让后词前移，重新点选会追加在末尾。
3. 需要时悬停英语词查看提示。本轮 please 的提示实际为谢谢、感谢、多谢。
4. 点击检查提交。错误时词块锁定并显示正确答案；继续先进入下一题。
5. 课末 welcome 与被跳过的 coffee 题以错题重练再次出现；重新作答后可继续。

**本轮中文网页实测事实：**一个词块就可启用检查，并不保证句子完整；例如 Tea, please. 只选谢谢也能点检查。蓝色/白色词块草稿与底部红绿判分属于不同状态。
**中文用户的任务负担：**同时要读英语、找中文和组织中文顺序。please 在点单语境中的中文表达需要结合整句看，不能据这一个提示归纳它的所有译法。
**设计解读：**给出中文候选降低了表达负担，主要检查英语理解。撤回与追加是修改词序的实际手段；判分后锁定则把编辑与结果阅读分成两个阶段。
**反馈建议（分析）：**保留错答顺序和正确句子；重练时改变候选排列，可减少只记点击位置的可能。此处 welcome 重练确实出现了词库顺序变化。
**证据与能力边界：**F03 是 welcome 同题错答闭环；F04 是另一题 Tea, please. 的修改及正确分支；F11 是 coffee 的跳过及重练，三者不冒充同一道题。错误词序草稿未提交，未验证其判分。 新增F24为Super单元复习的两句较长英译中正确路径，明确分别记录，不与访客原题混接。
**课程与套餐：**2026-09-27 中文→英语桌面网页版访客入门课实际出现。当前结论限于所记录题干、平台和会话。 此次另有登录Super的会话C/D补充，详情见对应连续流程。 同时有A/B免费访客与C/D登录Super的实例，分别记录；均不推定Max或移动端规则。

![进入 Tea, please. 翻译题；词库为谢谢、牛奶、茶；答案为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/050.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/lesson)

![点击继续；英译中 She has worked as a server for five years.，空答案及中文词库。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/404.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/practice-hub/unit-rewind)

![用户历史参考 · 中文界面学习英语](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-translation-word-bank.jpg)

图证：完整中文题页 · 原始历史截图；界面：中文；学习方向：中文母语→英语。用户此前提供的真实题页；实际拍摄日期、应用版本和当时套餐未确认。

<a id="E05"></a>
### E05 · 中译英：用英语词块组织译文

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**阅读中文原句，用英语词块作答。
**能力目标：**把中文意义转成英语语序，并选择必要的功能词。
**输入与输出（待核项目为分析示例）：**她跟她的男朋友一起去过巴黎。与英语词库。 → She has been to Paris with her boyfriend.

**用户操作（待核项目为条件分析）**

1. 读中文，按需悬停去过查看英语提示；点击词块逐个构句。
2. 已选词可撤回；移除中间的has后剩余词前移，清空后检查禁用。
3. 切到键盘可独立编辑文字；切回词库保留原词块草稿，候选位置可能变化。
4. 漏to的答案提交后被拒绝，纠错突出to，原草稿锁定；继续到下一题。
5. 后段原题重现，词库清空并重新排列；逐词补全正确译文，提交通过后继续。

**本轮中文网页实测事实：**中文在角色气泡中，英语答案与词库分区，底部切换输入和检查。部分答案就可提交；错误反馈把缺失的to突出，而不是重排学习者原答案。
**中文用户的任务负担：**中文词汇顺序不能机械映射英语；撤回、切换输入与候选重新排列也带来操作负担。两份草稿独立保存，用户必须确认当前模式的内容。
**设计解读：**给出单词解决了拼写提取，把主要难点留给英语结构。在中文“去过巴黎”到英语been to Paris的转换中，功能词to是值得单独检验的知识，不只是点击完整度。
**反馈建议（分析）：**保留原漏词答案，同时标清补在哪；如用于儿童课程，可增加短句中文解释been to与去过的对应，再用新地点检验迁移。
**证据与能力边界：**F26取得同题错误到正确闭环。不同模式的草稿保持、撤回中间词和清空都已拍到；键盘模式没有提交本题，不能混作键入正确证据。旧宣传图仅为其他版本参考。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；第21部分单元复习中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![点击继续；中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/417.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/practice-hub/unit-rewind)

![中文原句 → 英语词块 · 宣传局部图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/cn-appstore-wordbank-ipad.png)

图证：官方宣传局部图 · 不计为完整题页；界面：中文；学习方向：中文母语→英语。iPad 宣传合成图，题干、英语答案、词库与检查按钮可见；设备/应用底部未完整呈现，不能冒充完整独立题页。保存官方 API 公开返回的 576×768 PNG 原文件字节。
[来源页面](https://apps.apple.com/cn/app/id570060128?platform=ipad)

<a id="E06"></a>
### E06 · 中译英：键入完整英语句子

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**本节采用键盘输入整句译文的分支；语音输入另见 E08。
**能力目标：**从中文意义自主提取词汇、组织英语结构并写出句子。
**输入与输出（待核项目为分析示例）：**他们在英国待了三年了。；另例：他一直都想要做一个医生。 → They have stayed in the UK for three years.；另一题含doctor。

**用户操作（待核项目为条件分析）**

1. 切换键盘后键入英语，部分文字即可启用检查。
2. 可清空、改写草稿；取消退出后同一草稿仍能提交。
3. 把三年误写为ten years会被判错；正确答案突出three，原答案仍可对照。
4. 后段同题再次出现，输入three years的译文被接受，继续到下一题。
5. 另一独立题提交docter拼写差异，界面绿色通过，同时提示有错别字并给出doctor。

**本轮中文网页实测事实：**大输入框承担自由书写，中文原句始终位于上方。绿色结果不总等于完全无错误：拼写容错例同样绿色，但附纠错文字。
**中文用户的任务负担：**输入法、光标、拼写和句法共同影响结果。docter例同时含小写开头及无句号，不能分别证明所有大小写、标点规则。
**设计解读：**正确性至少包含意义和书写形式两层：ten→three改变中文所表达的量，docter→doctor是本例被容忍的字形偏差。这两个真实实例支持分层解释，但不足以推断后台评分算法。
**反馈建议（分析）：**把改变句意的错误与允许通过的轻微书写差异区别展示；保存原句、原答、修正片段。自然替代表达需要专门答案验证，不能只按唯一字符串匹配。
**证据与能力边界：**F27是英国三年题同题闭环，F29是独立的拼写容错例。未验证移动端键盘、中间选区、全部替代译文或拼写容错阈值。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；第21部分单元复习中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![切换使用键盘；空英语输入框，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/445.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/practice-hub/unit-rewind)

![用户历史参考 · 中文界面学习英语](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-translation-free-input.jpg)

图证：完整中文题页 · 原始历史截图；界面：中文；学习方向：中文母语→英语。用户此前提供的真实题页；实际拍摄日期、应用版本和当时套餐未确认。

<a id="E07"></a>
### E07 · 完成翻译：缺词与整句难度切换

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**阅读中文与已有英语译文，键入缺失部分。
**能力目标：**在给定句式中提取缺失英语成分，并允许主动撤去句式帮助。
**输入与输出（待核项目为分析示例）：**妈妈一直都这么漂亮。；Mom has always been ____ beautiful. → 空位填so；加大难度时可写整句。

**用户操作（待核项目为条件分析）**

1. 点空位输入，s一个字母已能启用检查；可继续输入o或清空。
2. 加大难度切为完整英语翻译，减少难度回到短空位。
3. 整句模式的Mom has always与空位模式分别保留草稿，切换不会自动转换。
4. cold提交被拒绝，反馈给出含so的完整句子。
5. 后段原题出现，填so被接受，继续进入结算。

**本轮中文网页实测事实：**相同中文气泡下，局部可编辑空位与整框输入交替出现；底部加大难度/减少难度对应变化。判错后仍保留cold，使固定句式与错误填入内容可对照。
**中文用户的任务负担：**学习者要识别可编辑范围；切换到另一模式后见到旧草稿也可能误以为答案丢失或被替换。
**设计解读：**难度调整直接改变学习者必须提取的信息量：补一个词与自行生成整句是不同任务。操作位置近似但能力要求增加，不能把两个完成率直接等同。
**反馈建议（分析）：**明确说明整句模式撤去了哪些提示，继续保留原来的局部练习；学习记录同时保存难度模式和所用帮助。
**证据与能力边界：**F28完成缺词同题闭环及两种难度的草稿切换。整句模式只写到部分草稿，没有提交，不算完整英语生成成功。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；第21部分单元复习中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![点击继续；输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/451.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/practice-hub/unit-rewind)

![用户历史参考 · 中文界面学习英语](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-supported-translation.jpg)

图证：完整中文题页 · 原始历史截图；界面：中文；学习方向：中文母语→英语。用户此前提供的真实题页；实际拍摄日期、应用版本和当时套餐未确认。

<a id="E09"></a>
### E09 · 英语选词填空与中文意义反馈

**中文图证：**完整中文题页
**作答方式：**阅读句子并选词补空，不需要根据音频判断。
**能力目标：**根据英语句子与词义，从候选词中选出合适的修饰语。
**输入与输出（待核项目为分析示例）：**He is my ___ friend. 与 long / red / good。 → 选择 good。

**用户操作（待核项目为条件分析）**

1. 阅读句子和三个候选词。
2. 选择符合语义的 good，完成提交。
3. 图示反馈给出中文意义“他是我的好朋友”，核对后点“继续”。

**截图事实：**题干、已选绿色词卡、勾选反馈与中文解释同时保留。“继续”位于反馈下方；这是作答后的正确状态。
**中文用户的任务负担：**既要知道候选词意思，也要理解该词在句中能否成立；选项排除策略会影响结果。
**设计解读：**绿色标记告诉用户选中了哪项，中文意义帮助把整个英语句子连回熟悉的表达。候选中有容易按常识排除的词，不能由这一题的成功推断复杂搭配能力。
**反馈建议（分析）：**干扰项应围绕当前教学目标设计；后续可换语境验证 good 的理解，而不只复现同一组候选。
**证据与能力边界：**完整正确反馈图不包含错选时的提示与重试流程，也不证明无词库时能主动产出。
**课程与套餐：**已见中文界面与英语学习方向；证据仅适用于所示版本和状态，当前账号、地区与客户端未逐项实测。 普通课程任务。图片中的心形、能量或无限心不能单独证明此题是某套餐专属；本轮未核验账号权益。

![用户历史参考 · 中文界面学习英语](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-cloze-correct-feedback.jpg)

图证：完整中文题页 · 原始历史截图；界面：中文；学习方向：中文母语→英语。用户此前提供的真实题页；实际拍摄日期、应用版本和当时套餐未确认。

<a id="E12"></a>
### E12 · 阅读英语对话，选择合适的下一句

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**阅读已显示的英语对话，选择下一句；播放语音是可选辅助。
**能力目标：**理解对方的英语意图，选出符合对话情境的回答。
**输入与输出（待核项目为分析示例）：**Coffee or tea?；选项 Coffee, please. / Welcome.。 → 选择 Coffee, please.。

**用户操作（待核项目为条件分析）**

1. 阅读问题和两项回答；不必播放声音。
2. 点击一项会变蓝，检查启用；提交前可改选。
3. 本轮提交 Welcome. 后出现红色正确答案 Coffee, please. 及中文咖啡，谢谢。
4. 点击继续进入听力题；课末同题以错题重练出现。
5. 选 Coffee, please. 并检查，显示绿色反馈与中文意思，再继续。

**本轮中文网页实测事实：**角色提问气泡、空白回应气泡与两项文字回答分区摆放；点击选项后回应气泡没有立即填入文字。错误反馈同时保留正确英语及中文意义。
**中文用户的任务负担：**需要理解提问要求，而非只认出熟悉词；两项明显不同的回答降低了自由表达负担。
**设计解读：**语句形式都可能是已学表达，但只有一项回应当前的选择问句，要求识别言语意图。候选仍限制了输出，不能代表自主对话能力。
**反馈建议（分析）：**可补一句为什么这个回答适合当前问题。当前截图证实答案与译义，未出现详细解释语用原因。
**证据与能力边界：**F05 记录同题错答、课末重练、答对和继续；未验证多选、退出恢复或移动端。此前跨语言对话图不再用作本条中文界面证据。
**课程与套餐：**2026-09-27 中文→英语桌面网页版访客入门课实际出现。当前结论限于所记录题干、平台和会话。 本轮为免费访客；没有登录、开通试用或购买 Super/Max。付费套餐、其他设备与账号不由此推定。

![进入完成对话 Coffee or tea?；两个选项 Coffee, please. 和 Welcome.；检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/060.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/lesson)

<a id="E21"></a>
### E21 · 按中文意义，看图选择英语词

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**阅读中文提示、图片与英语词，通过点选作答，不要求听音或开口。
**能力目标：**根据中文意义，在插图和英语词标签中识别目标词。
**输入与输出（待核项目为分析示例）：**哪个是茶呢？；coffee、tea、sugar 三张图卡。 → 选择 tea。

**用户操作（待核项目为条件分析）**

1. 进入题目时没有选择，检查为灰色。
2. 点选图卡变蓝；改点另一项转移选择；再次点已选 tea，本轮仍保持选中。
3. 选 sugar 再点检查，首次错误触发红心说明；关闭后可见正确答案 tea。
4. 错误后选项锁定，继续进入下一道文字题；课末同题以错题重练重现。
5. 重练选择 tea、检查，获得绿色反馈，再点继续进入后继题。

**本轮中文网页实测事实：**本轮是横向三张大图卡，英语标签在图片下，数字提示在角落；提交前的蓝色与提交后的红绿反馈不同。顶部进度与红心、底部检查/继续位置稳定。
**中文用户的任务负担：**图形辨认与英语词形辨认同时参与。需通过去图任务判断词形是否被记住。
**设计解读：**图片减少了初学者建立意义的成本，但用户也可能只靠中文与图片完成任务。紧随其后的无图文字选词降低了图像帮助；这是本次课序观察，不是所有课程的固定规则。
**反馈建议（分析）：**错误后应让正确词和中文意义可核对，并在后续撤去图片再检验；F01 记录了当前产品的答案反馈与课末重练。
**证据与能力边界：**F01 是茶题的同题闭环；F08 是另一道咖啡题的直接正确路径。官方玻璃杯四宫格图属于另一版本，不能与本轮三卡图拼接为同题流程。未穷举所有快捷键、退出与异常。
**课程与套餐：**2026-09-27 中文→英语桌面网页版访客入门课实际出现。当前结论限于所记录题干、平台和会话。 本轮为免费访客；没有登录、开通试用或购买 Super/Max。付费套餐、其他设备与账号不由此推定。

![进入“哪个是茶”；三张图卡尚未选中；检查为灰色，红心为5。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/010.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/lesson)

![中文提示“玻璃杯” · 看图选词宣传局部图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/cn-googleplay-picture-choice.png)

图证：官方宣传局部图 · 不计为完整题页；界面：中文；学习方向：中文母语→英语。中文题干“哪一个是‘玻璃杯’呢？”，四宫格图卡已选 glass；下排两张图的词标签被绿色反馈条覆盖，因此不能标为全部作答内容与控件可见。顶部关闭、进度、心形与底部正确反馈、完整继续按钮可见；宣传构图的应用底边裁断，不计完整界面。
[来源页面](https://play.google.com/store/apps/details?hl=zh_CN&id=com.duolingo)

<a id="E23"></a>
### E23 · 按中文词义，选择对应英语词

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**阅读中文与英语文字，点选即可；无需听音或开口。
**能力目标：**移去图片后，检查中文意义与英语词形的对应。
**输入与输出（待核项目为分析示例）：**茶；选项 coffee / hot / tea。另一个实例为咖啡。 → 选择 tea；另一实例选择 coffee。

**用户操作（待核项目为条件分析）**

1. 读中文词与三个纯文字选项，检查初始禁用。
2. 点击 coffee、改点 tea，再改 hot；每次只有一项蓝色选中。
3. 提交 hot 后显示正确答案 tea，红心4变3；点击继续进入新题。
4. 课末茶题重现，选择 tea、检查得到绿色反馈，再继续。
5. 另一道咖啡题测试了退出弹层和取消：选择 coffee 后取消退出，原选择保持；再提交正确。

**本轮中文网页实测事实：**中文词出现在角色气泡里，英语选项竖向排列，取消退出后选择保留。与看图题相比，没有图片可供直接匹配。
**中文用户的任务负担：**只需理解一个中文词，但要区分英语候选；选项数量、熟悉程度和词性差异影响猜测机会。
**设计解读：**相同意义从图卡转为文字选项，减少视觉提示，更集中检查词义识别；仍属于有候选的识别，不等于能够独立拼写。
**反馈建议（分析）：**词义错误与退出取消属于不同分支；报告分别记录茶题的错误重练与咖啡题的取消退出，避免拼成虚假的同题全过程。
**证据与能力边界：**F02 是茶题核心闭环，F09 是咖啡题退出取消及正确路径。不是 E02 的英文定义选择。未确认真正退出后的进度恢复、键盘快捷键及更多干扰项。
**课程与套餐：**2026-09-27 中文→英语桌面网页版访客入门课实际出现。当前结论限于所记录题干、平台和会话。 本轮为免费访客；没有登录、开通试用或购买 Super/Max。付费套餐、其他设备与账号不由此推定。

![点击错误反馈的继续；进入下一道文字选词题“茶”；不是在原看图题内编辑。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/017.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/lesson)

<a id="S01"></a>
### S01 · 故事阅读理解：字面意义、意图与总结

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**本题英语上下文与中文问题均可见，通过阅读点选可完成；不代表整篇故事没有听力。
**能力目标：**理解连续英语情节，用中文判断人物说了什么、想表达什么及发生了什么。
**输入与输出（待核项目为分析示例）：**Taxi Ride的英文叙述和对话；三道中文理解题。 → 选择与上下文一致的中文解释。

**用户操作（待核项目为条件分析）**

1. 逐段点继续阅读英语，可悬停词语查看中文意义。
2. 题目插入当前故事页，点击中文候选即判定，无检查按钮。
3. 错项短暂红色后变灰禁用，继续仍禁用，可直接选另一项。
4. 正确项变绿后点继续，题目收起，新增后续台词。

**本轮中文网页实测事实：**英语叙述与角色气泡沿纵向保留；中文问题紧接上下文，三项中文候选与底部继续分开。首题两次错误后原位正确；另两题分别检查付钱那句话的意图和手机导航结局。
**中文用户的任务负担：**要跨句保持人物、指代和因果。重复排除到最后一项可以完成任务，因此最后答对不能证明第一次就理解。
**设计解读：**中文减少答题表达成本，英语理解仍承担学习目标。字面复述、话语意图和情节总结是不同层次，不能用“故事选择题”一个名称抹平。
**反馈建议（分析）：**保留相关上下文，为错项指出不一致的线索；按字面、推断、总结分别记录表现，避免只计故事完成。
**证据与能力边界：**F18首题为完整同题错答闭环，另两题分别列明。该阅读题可用可见文字完成，归无需听说；但整篇故事还穿插听音任务，不能把整节故事归无听力。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；乘坐出租车故事重读中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![点击继续；出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/307.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/stories/en-zh-taxi-ride?mode=read&practiceHubStory=featured)

<a id="S02"></a>
### S02 · 故事词义定位：按中文意义点英语片段

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**本题英语上下文与中文问题均可见，通过阅读点选可完成；不代表整篇故事没有听力。
**能力目标：**把中文意义定位到当前英语句子的具体词组。
**输入与输出（待核项目为分析示例）：**导航指示；The directions on my phone say that road is faster… → 选择The directions。

**用户操作（待核项目为条件分析）**

1. 读中文意义，比较原句中几个可点击的英语片段。
2. 点road立即错误，稳定后该片段禁用；继续不可用。
3. 改点The directions正确，所有片段锁定。
4. 可打开退出再取消，原正确选择保留；继续后进入下一句。

**本轮中文网页实测事实：**答案就在原句里，按钮化片段保留语境；不可点击的连接文字与候选分布在同一行。
**中文用户的任务负担：**要同时辨认片段边界和词义；能选中词组不等于能主动写出或口说它。
**设计解读：**比脱离语境的双列表配对更强调在句中定位含义；词组粒度提醒中文意义未必对应单个英语词。
**反馈建议（分析）：**让词组边界清楚，把错误词的实际意义作为可查看提示；退出取消应保留已完成状态。
**证据与能力边界：**F19同题错误、正确、退出取消及继续都有原图；未验证确认退出后重进、重复点击或所有候选。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；乘坐出租车故事重读中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![点击继续；出现“哪一个选项的意思是导航指示？”；原句被拆成可选英语片段，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/313.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/stories/en-zh-taxi-ride?mode=read&practiceHubStory=featured)

<a id="E02"></a>
### E02 · 英语语境词义—英文定义选择

**中文图证：**中文课程 / 题图待核实
**作答方式：**阅读英语语境与定义，点选符合词义的一项。
**能力目标：**用已知英语解释新词，在英语语境中建立意义联系。
**输入与输出（待核项目为分析示例）：**一个可以在房屋外坐着休息的地方 → a place outside a house where people can sit

**用户操作（待核项目为条件分析）**

1. 读目标词所在句，比较英文释义与上下文，再选一项。

**中文适配分析，非已观察的中文界面：**需要核对：中文课程是否有此进阶题；中文提示开合与反馈位置。
**中文用户的任务负担：**必须同时理解正文、问题和英文释义；选错可能来自释义措辞不懂，不一定是目标词完全不懂。
**设计解读：**用于检查理解、解释误选原因；逐步减少全文对译依赖。
**反馈建议（分析）：**保留目标词高亮；答后用一句中文解释关键语义和原文线索，避免一开始用中文直接泄露答案。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 英文释义选择比中英词配对增加阅读负担，但仍是识别而非主动定义。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#E02)

<a id="E10"></a>
### E10 · 英语图境辅助选词填空

**中文图证：**中文课程 / 题图待核实
**作答方式：**根据插图和英语文本选择缺词。
**能力目标：**结合图片和英语语境选择缺词，而不是仅按图认物。
**输入与输出（待核项目为分析示例）：**她想念家人。 → She misses her family.

**用户操作（待核项目为条件分析）**

1. 先读句子与情境，再用图片核对；需要时查看提示，最后选词补空。

**中文适配分析，非已观察的中文界面：**需要核对：中文方向是否开放；中文提示内容和遮挡情况。
**中文用户的任务负担：**图中人物、英文文本和候选词要整合；例如 family 在思念家人的语境里应理解为‘家人’，不机械套成‘家庭’。
**设计解读：**辅助解除关键理解障碍，不替代对英语上下文的判断。
**反馈建议（分析）：**中文提示应解释本句中的意思；展开提示应不遮住缺口和主要语境。记录用了提示与独立作答的区别。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 凭明显图片选中不能直接等同读懂英语段落。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#E10)

<a id="E11"></a>
### E11 · 英语段落阅读理解选择

**中文图证：**中文课程 / 题图待核实
**作答方式：**从英语段落中找到证据，再选择答案。
**能力目标：**从英语段落中找证据，理解因果、人物和事件关系。
**输入与输出（待核项目为分析示例）：**汤姆没赶上公交，所以走路去了。 → Tom missed the bus, so he walked.

**用户操作（待核项目为条件分析）**

1. 读段落，再把问题和每个选项与原文证据对照后作答。

**中文适配分析，非已观察的中文界面：**需要核对：中文课程入口与级别；中文释义是否可选及反馈依据。
**中文用户的任务负担：**还要读懂英文问题与选项；例如看到 bus 便选‘坐公交’会忽略 missed 和 so walked 的含义。
**设计解读：**说明推理链或关键连接词，帮助识别是单词没懂还是关系读反。
**反馈建议（分析）：**答后定位决定答案的英文句，并用中文简释‘没赶上，所以步行’；避免只显示答案字母。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 单题不能覆盖全部阅读水平；中文解释只是学习支持。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#E11)

<a id="S03"></a>
### S03 · 故事末尾开放写作

**中文图证：**中文课程 / 题图待核实
**作答方式：**按阅读故事后键入英语回应归类；英语完整写作题图仍待补。
**能力目标：**用自己的英语组织故事回应，说明原因或复述要点。
**输入与输出（待核项目为分析示例）：**她为什么回去了？—她忘了钥匙。 → She forgot her keys.

**用户操作（待核项目为条件分析）**

1. 理解开放问题，确定一两个要点，再用英语写出连贯回应并检查。

**中文适配分析，非已观察的中文界面：**需要核对：中文英语故事写作是否存在；题面、字数、输入和反馈规则。
**中文用户的任务负担：**同时检索内容、词汇、时态和句子结构；例如‘她忘了钥匙’需要自己写出 She forgot her keys，而非选择现成句。
**设计解读：**可用于说明评价依据和修改方向，不直接替用户写完整答案。
**反馈建议（分析）：**中文说明回答目标，反馈先看是否表达清楚，再挑关键语言问题；不要强制与单一范文逐字一致。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 现有目录尚无该英语完整题面，更未建立中文开放状态；字数和评分不可沿用其他课程。 本次Taxi Ride重读已走到结算，但没有出现开放写作；不能从这一篇推断所有故事或等级。
**课程与套餐：**官方历史文章确认中文使用者学习英语的 Stories；当前具体交互、账号入口和完整中文题页仍待核实。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#S03)

<a id="A02"></a>
### A02 · Adventures 英语回应选择

**中文图证：**中文课程 / 题图待核实
**作答方式：**图中问题与两个回应均有英语文字，可通过阅读和点选完成；本轮未实测静音流程。
**能力目标：**在明确场景目标下理解英语对话，选出能推进任务的回应。
**输入与输出（待核项目为分析示例）：**想买一张车票 → One ticket, please.

**用户操作（待核项目为条件分析）**

1. 理解当前任务及英语角色提问，比较候选能否实现目的，再选择。

**中文适配分析，非已观察的中文界面：**需要核对：中文任务入口；候选回应及错误情节分支。
**中文用户的任务负担：**要结合角色问题、场景和目标，不能只选语法正确或重复词最多的句子。
**设计解读：**说明交际目的及误选原因，避免每句先给完整翻译。
**反馈建议（分析）：**必要时提供简短中文目标回顾；若回应无助于任务，用角色反应与中文解释指出原因。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 给定回应选择不测试自主造句；中文开放状态未知。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#A02)

<a id="M01"></a>
### M01 · Roleplay 英语多轮文字情境聊天（中文覆盖待核）

**中文图证：**中文课程 / 题图待核实
**作答方式：**依据官方文字聊天说明归类，输入为英语文字回复；完整英语聊天题图仍待补。
**能力目标：**围绕沟通目标连续组织英语文字，而不是每轮选择标准答案。
**输入与输出（待核项目为分析示例）：**我想要一些水。 → I'd like some water.

**用户操作（待核项目为条件分析）**

1. 看清情境目标，阅读角色英语消息，自行回复并根据后续消息调整，结束后回看反馈。

**中文适配分析，非已观察的中文界面：**需要核对：中文英语 Max Roleplay 可用性；输入、任务结束、中文反馈和合理表达接受范围。
**中文用户的任务负担：**需跟踪聊天上下文、决定说什么并检索表达；‘想要水’可有多个自然说法，不能只套一个中文直译模板。
**设计解读：**解释意义、语气和改进方式，不能把所有与范文不同的说法都判错。
**反馈建议（分析）：**中文可讲清任务和反馈依据；先看沟通是否完成，再解释一个重要语言问题，并保留原回答供比较。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 尚无中文完整聊天题图；其他母语 Max 开放说明不证明中文账号可用。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#M01)

<a id="listening-speaking"></a>
## 4.2 听力与口语相关题目

本组 20 个研究条目：15 项有中文图像证据，其中 14 项有完整题页；另 5 项仍待核实中文课程与具体题图。条目含情境和输入变体，不是官方题型总数。

听音输入与口头输出分别说明。语音输入入口、朗读给定答案、自己组织英语回应不是同一种能力要求。

<a id="E08"></a>
### E08 · 翻译题中的英语语音输入入口

**中文图证：**仅见中文输入入口
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**如果该入口可用，通过口头组织英语完成翻译输入；具体判分方式尚未确认。
**输入与输出（待核项目为分析示例）：**中文原句与录音入口。 → 预期为口述英语或转写结果，具体流程待核。

**用户操作（待核项目为条件分析）**

1. 在中文翻译页找到输入框下方的录音入口。
2. 录音权限、开始/停止、识别结果确认与提交步骤本轮均未验证。

**截图事实：**当前只见独立的麦克风/录音栏；复用 E06 原图标记这个入口，没有录音中、转写后或发音评分的截图。
**中文用户的任务负担：**英语表达、系统识别失败、环境噪声和授权失败应分开处理。
**设计解读：**改变输入方式可以减少键盘负担，却可能增加语音识别和设备环境的影响；语音输入不自动等于独立的发音训练题。
**反馈建议（分析）：**建议先让用户确认识别文本，并提供键入恢复入口；这只是设计建议，不是对当前功能的确认。
**证据与能力边界：**仅有入口证据，不计为完整语音任务；与 E06 复用同一个图像文件，不重复计图。
**课程与套餐：**已见中文界面与英语学习方向；证据仅适用于所示版本和状态，当前账号、地区与客户端未逐项实测。 普通课程任务。图片中的心形、能量或无限心不能单独证明此题是某套餐专属；本轮未核验账号权益。

![E06 原图复用 · 这里只证明录音入口](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/duolingo-dark-translation-free-input.jpg)

图证：完整翻译题页中的语音入口 · 不是完整语音流程；界面：中文；学习方向：中文母语→英语。用户此前提供的真实题页；实际拍摄日期、应用版本和当时套餐未确认。

<a id="E13"></a>
### E13 · 听英语，用英语词块拼出内容

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**把听到的英语映射到给定书面词块。
**输入与输出（待核项目为分析示例）：**普通与慢速播放入口；词库 tea、please。 → 从词库选择所听内容；后续键盘提交的反馈表明此题目标为 tea。

**用户操作（待核项目为条件分析）**

1. 使用普通或乌龟慢速播放按钮。此次只验证控件可操作，未保存和听验音轨。
2. 点击 please 形成草稿；检查启用。点击答案词块可撤回，清空后检查禁用。
3. 切换使用键盘后，本轮首次文本草稿为空；切回使用词库，原 please 草稿恢复。
4. 组成 tea / please 后再切键盘，原文字草稿仍保留。最终在键盘模式提交并判错，见 E22。
5. 补充Super的F23：选择how are you并在词库模式检查，实际红色纠错为in the same place；继续进入英译中。

**本轮中文网页实测事实：**大扬声器与乌龟图标区别两种播放入口；底部有使用键盘及现在不做听力题。两个输入方式各保留自己的草稿，切换并不把词块自动转换成相同文本。 Super复习F23另有词块实际提交错误，原词块锁定，底部给正确英语与中文意义。
**中文用户的任务负担：**需注意音频识别、词库干扰项与输入模式三件事。词库有两个词并不表示答案必须包含两个词。
**设计解读：**词库提供拼写和候选范围，降低听写产出的难度。独立草稿可保留切换前工作，也可能让用户误以为当前会提交另一种模式的内容。
**反馈建议（分析）：**切换方式时应让当前待提交内容清楚可见；不要凭候选数量暗示答案长度。
**证据与能力边界：**F06 实测输入、撤回、模式切换与草稿保持；实际错误发生在 E22 键盘模式。没有把键盘判错当成词块提交实测，也未采到此题词块正确提交或课末重练。 新增F23：Super复习已实际提交词库错误，纠错目标为in the same place；没有同音同题正确重练。此前“未提交词库”只限F06访客题。
**课程与套餐：**2026-09-27 中文→英语桌面网页版访客入门课实际出现。当前结论限于所记录题干、平台和会话。 此次另有登录Super的会话C/D补充，详情见对应连续流程。 同时有A/B免费访客与C/D登录Super的实例，分别记录；均不推定Max或移动端规则。

![点击继续；进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/065.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/lesson)

![开始复习；选择听到的内容；普通/慢速播放、英语词块、使用键盘与现在不做听力题；检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/401.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/practice-hub/unit-rewind)

<a id="E14"></a>
### E14 · 听英语内容，选择对应中文解释

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**理解英语声音所表达的情境，而不是逐字拼写。
**输入与输出（待核项目为分析示例）：**先听后答；他们在…；三项关于John的中文解释。 → 本题看John的护照被判正确。

**用户操作（待核项目为条件分析）**

1. 按题意听材料，普通/慢速按钮可见；本轮未听验音轨。
2. 选帮John找工作形成草稿，再改选看John的护照。
3. 点击检查，第二项显示绿色正确；继续进入另一道听写。

**本轮中文网页实测事实：**声音入口与中文句干、竖排中文选项分区；选择为蓝色，判分为绿色，正确后的继续与提交前检查占据同一主操作位置。
**中文用户的任务负担：**还需要中文阅读与对候选的比较。仅凭猜选后正确，不能当作已验证听力能力。
**设计解读：**用中文候选降低英语输出负担，把测量重点放到声音理解。能够选出意义不等于能复述或写出所听英语。
**反馈建议（分析）：**围绕具体误解设置干扰项；解释听到的证据，而不只给绿色勾。若允许课后回看，可将英语原句与中文解释联系起来。
**证据与能力边界：**F25有初始、选择、改选、正确及下一题；第一项未提交，不能称为错误分支已实测。原题重练、音质和慢速效果未验证。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；第21部分单元复习中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![点击继续；先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/411.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/practice-hub/unit-rewind)

<a id="E15"></a>
### E15 · 英语朗读：录音、未通过提示与跳过

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**把给定英语词句读出来；本轮实际材料为 got，尽管标题写句子。
**输入与输出（待核项目为分析示例）：**中文朗读指令、角色气泡中的 got 与示范播放入口。 → 预期朗读 got；本轮没有可核对的口述音轨。

**用户操作（待核项目为条件分析）**

1. 点击并开始录音，条形入口变成蓝色波形，示范播放禁用。
2. 等待后再次点录音条停止；捕获黄色听起来不太对、再试一次提示，随后录音入口恢复。
3. 点击现在不做口语题，出现黄色跳过反馈；点击继续进入声音配对。

**本轮中文网页实测事实：**录音是横向大触控条，状态变化发生在同一个位置。停止后有瞬时黄色未通过提示；跳过后同样黄色，但文案显示发音好棒哦，不能按文案判断识别成功。
**中文用户的任务负担：**设备收音、识别服务、环境与英语发音都会影响体验。本轮没有足够声音证据定位未通过原因。
**设计解读：**给定文字降低组织内容的负担，主要要求读出声音。录音、识别和学习表现是三件事；波形只证明界面进入录音状态，鼓励文案也不等于评分证据。
**反馈建议（分析）：**跳过时应清楚表达跳过，不用发音成功的文案；未收到有效输入与发音需改进也应分别说明。这是针对所见界面的分析建议。
**证据与能力边界：**F15 有启动、波形、停止后提示和跳过连续截图；没有成功朗读、重录成功、原生授权弹窗或发音精度证据，不计正确分支闭环。
**课程与套餐：**2026-09-27 中文→英语桌面网页版发音专项，免费访客实际出现；与基础入门课分开编号。 本轮为免费访客；没有登录、开通试用或购买 Super/Max。付费套餐、其他设备与账号不由此推定。

![点击继续；进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/235.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/alphabets/en/pronunciation)

![中文朗读指令 · 官方宣传局部图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/cn-googleplay-read-aloud-hello.png)

图证：官方宣传局部图 · 不计为完整题页；界面：中文；学习方向：中文母语→英语。中文朗读指令，英语 Hello!，带音频与录音按钮；顶部关闭、进度、心形及底部正确反馈、中文释义、完整继续按钮均可见。宣传卡片下边界截断，不能算整幅完整界面。
[来源页面](https://play.google.com/store/apps/details?hl=zh_CN&id=com.duolingo)

<a id="E17"></a>
### E17 · 英语近音词二选一听辨

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**从两个近音英语词中辨认所听词的书面形式。
**输入与输出（待核项目为分析示例）：**一个音频入口；dock/deck 或 got/get。 → 选择与声音对应的词。

**用户操作（待核项目为条件分析）**

1. 按需播放，再选择一项；可改选，点击检查才判分。
2. 正确时选项和底部变绿，点击继续到下一条音频题。
3. 错误时选项锁定，底部红色提示再多听几次；可再点击播放，但没有直接列出正确词。
4. 继续后先进入声音同异题；后段同组选项再现，这一轮选择 got 被判正确。

**本轮中文网页实测事实：**两个文字选项横向并列，题干是中文；大播放按钮位于中心。底部另有太简单、太难和报错入口；本轮未向产品提交评价或报错。
**中文用户的任务负担：**音频可能不同而文字选项完全相同：连续 got/get 曾分别接受 got、接受 get、拒绝 get；不能把多帧按文字拼成同一道题。
**设计解读：**仅改变少量声音差异可让学习者集中注意听辨，书面词仍作为候选支架。相比基础词义题，错误反馈鼓励重听，没有直接给标准词。
**反馈建议（分析）：**听辨训练应保留重听，并让学习者知道下一步怎么比较；不应把选项颜色误读为即时判分。
**证据与能力边界：**F13 记录多个实例的正确、错误、改选和继续。没有保存音轨，后段同组选项是否原音轨重练未核，所以不计严格同题核心闭环，也未测声音质量。
**课程与套餐：**2026-09-27 中文→英语桌面网页版发音专项，免费访客实际出现；与基础入门课分开编号。 本轮为免费访客；没有登录、开通试用或购买 Super/Max。付费套餐、其他设备与账号不由此推定。

![点击开始进入专项；出现你听到了什么、dock/deck 两选项、大播放按钮；检查禁用，题页顶部没有红心显示。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/201.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/alphabets/en/pronunciation)

<a id="E18"></a>
### E18 · 听两个英语声音，判断词语相同或不同

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**暂时去掉英语拼写提示，判断两个声音是否代表同一个词。
**输入与输出（待核项目为分析示例）：**两个独立音频入口；作答前隐藏英语词形。 → 同一个词 / 两个不同的词。

**用户操作（待核项目为条件分析）**

1. 分别点击两个音频入口，选择同一个词或两个不同的词，提交前可改选。
2. 点击检查后揭晓英语词形与音标；正确为绿色，错误为红色。
3. 错误后继续进入另一题；未作答直接跳过会出现黄色反馈。
4. 课后段又出现 got/get 词对，选择不同被判正确；继续实际进入专项结算。

**本轮中文网页实测事实：**两个音频位置上下叠放，下方是中文判断选项；单词与音标在判分后补出。错答没有把所选项改成正确选项，而是保留草稿供对照。
**中文用户的任务负担：**需要短时保留第一个声音，再与第二个比较。是否听到声音、是否记住以及如何判断相同，是不同失败来源。
**设计解读：**先隐藏拼写，迫使任务材料来自声音；判分后揭晓，再连接到英语文字和音标。它检查辨别差异，不要求翻译、拼写或自己说英语。
**反馈建议（分析）：**同异关系揭晓后保留清晰比较；跳过要采用准确文案。实测黄色跳过仍带鼓励语，不能据它判定答对。
**证据与能力边界：**F14 含明确分开的 deck/dock、get/get、deck/deck、got/get 实例；后段重现词对但未核对音轨身份。正确和错误截图齐备，不宣称所有实例是同一道题。
**课程与套餐：**2026-09-27 中文→英语桌面网页版发音专项，免费访客实际出现；与基础入门课分开编号。 本轮为免费访客；没有登录、开通试用或购买 Super/Max。付费套餐、其他设备与账号不由此推定。

![点击继续；进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/218.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/alphabets/en/pronunciation)

<a id="E19"></a>
### E19 · 听英语声音，配对英语书面词

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**将英语声音与对应英语拼写联系起来，重点区分近音词。
**输入与输出（待核项目为分析示例）：**四个音频按钮，与 deck、got、dock、get 四个文字选项。 → 逐对完成声音与书面词匹配。

**用户操作（待核项目为条件分析）**

1. 点声音再点书面词；也可以先点右侧书面词，再点声音。
2. 错配立即短暂变红，随后恢复可选；可留在同一道题中重新配对。
3. 正确对变绿后变浅锁定，继续配其他项；已经正确的项不因后续错误而撤销。
4. 全部配完自动显示绿色正确；点击继续进入 got/get 听辨题。

**本轮中文网页实测事实：**音频与英语词分列，波形图标代替左侧可见拼写。瞬时红/绿反馈与之后禁用状态都有截图；此专项题页未显示红心。
**中文用户的任务负担：**需要记忆刚听的声音并在近音词之间定位。本轮通过试错验证交互，不作为听觉准确率证据。
**设计解读：**声音先于拼写出现，避免两列直接做文字匹配；即时逐对反馈降低错误恢复成本。逐步排除会降低后续配对难度，因此不能用最终全配对推定独立听写能力。
**反馈建议（分析）：**错配后的稳定页面应仍可重听；已完成状态要保留。对音近错误，可用声音和音标对比帮助学习者定位差异。
**证据与能力边界：**F16 记录同一道配对题的错误、恢复、正确、全部完成与继续，计入核心闭环；音质、全部排列、键盘和退出分支未测。它不是 E20 声音配中文意义。
**课程与套餐：**2026-09-27 中文→英语桌面网页版发音专项，免费访客实际出现；与基础入门课分开编号。 本轮为免费访客；没有登录、开通试用或购买 Super/Max。付费套餐、其他设备与账号不由此推定。

![点击继续；进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/239.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/alphabets/en/pronunciation)

<a id="E20"></a>
### E20 · 听英语，配对中文词义

**中文图证：**完整中文题页
**作答方式：**必须听英语声音，通过点击中文词义作答。
**能力目标：**把英语声音与中文意义联系起来，检查听觉词义识别。
**输入与输出（待核项目为分析示例）：**左侧音频按钮与右侧中文词义。 → 例如将英语 phone 的声音与“手机”配对。

**用户操作（待核项目为条件分析）**

1. 点击一个音频按钮听英语。
2. 在中文选项中点对应词义，逐组完成配对。
3. 图中 phone 与“手机”已匹配；底部仍有灰色“检查”和“现在不做听力题”。完成全部配对后的转换尚未实测。

**截图事实：**音频与中文词义分成两列，已配对项目用绿色强调。原图是官方双手机合成图，前景题页完整，背景翻译题被遮挡。
**中文用户的任务负担：**需要分辨英语声音并记住刚听的内容；不能依靠中文选项来判断是否会拼写英语。
**设计解读：**中文选项把输出限制在意义选择，因此不用键入英语也能检验声音理解。与 E01 相比，输入由可见英语词形变成英语声音。
**反馈建议（分析）：**建议让重听与已完成配对状态保持清楚；错误时重新连接声音和意义，而不只要求再点一次。
**证据与能力边界：**这是普通课程的听力词义配对证据，不能把它当作 Sounds 专项、Radio 题页或无限心套餐的独占证据。
**课程与套餐：**已见中文界面与英语学习方向；证据仅适用于所示版本和状态，当前账号、地区与客户端未逐项实测。 普通课程任务。图片中的心形、能量或无限心不能单独证明此题是某套餐专属；本轮未核验账号权益。

![英语听音 → 中文词义 · 前景完整题页](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/cn-apple-audio-matching-composite.webp)

图证：官方双屏合成原图 · 仅前景题页完整；界面：中文；学习方向：中文母语→英语。官方双手机合成原图。前景题页从顶部关闭、进度和无限心到四组音频/中文词义、底部“现在不做听力题”、完整“检查”和 Home 条均可见。背景的中文→英语词块翻译被前景手机遮挡，不能计作完整翻译题。此题是普通听力词义配对，不是 Sounds 音素辨别或 Radio。
[来源页面](https://apps.apple.com/cn/iphone/story/id1399754989)

<a id="E22"></a>
### E22 · 听英语，键入英语词句

**中文图证：**完整中文题页 · 本轮实测
**作答方式：**必须听音，使用键盘输入英语；不要求口说。
**能力目标：**在不提供可点击词库时，把听到的英语写出来。
**输入与输出（待核项目为分析示例）：**英语音频；本轮实际反馈目标为单词 tea，旧官方图为句子 I need to pay.。 → 键入所听英语；本轮故意提交 Tea, please.，实际被判错。

**用户操作（待核项目为条件分析）**

1. 在听力词块题点击使用键盘；文本框与键入指令出现。
2. 输入 coffee，清空，再输入 Tea, please.；清空时检查重新禁用。
3. 切换词库再回键盘，文本草稿 Tea, please. 保留。
4. 提交后实际判错，正确答案 tea、中文茶；本次访客入门课在零红心时提供一次免费补心。
5. 补心后仍在锁定的错误反馈页，点击继续进入下一道对话题。另一道听写的现在不做听力题会显示暂停15分钟的提示。

**本轮中文网页实测事实：**输入框在播放控件下，主操作固定在底部。错误时输入文本仍保留，反馈给出正确英语与中文意义；补心弹层与作答反馈是两个状态。
**中文用户的任务负担：**所听内容、拼写和输入法一起影响结果；本例多写 please 被判错，不能据此推定大小写或标点是否容错。
**设计解读：**从词库切到键盘去掉候选帮助，增加提取与拼写要求。能查看正确英语及中文意义有助于区分表达形式和意义，但不能凭文本判断错在听辨还是手误。
**反馈建议（分析）：**将任务错误、听音环境和资源不足分开处理；跳过听力的时间说明应明确，恢复是否发生需要另外验证。
**证据与能力边界：**F06 和 F10 分属两道听力题；未采到本轮正确听写、原题重练、声音质量、拼写容错或15分钟后恢复。免费补心只证实本次访客入门课，不代表所有账号权益。
**课程与套餐：**2026-09-27 中文→英语桌面网页版访客入门课实际出现。当前结论限于所记录题干、平台和会话。 本轮为免费访客；没有登录、开通试用或购买 Super/Max。付费套餐、其他设备与账号不由此推定。

![键入 coffee；输入框出现草稿；检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/074.png)

图证：完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明；界面：中文；学习方向：中文母语→英语。2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。
[来源页面](https://zh-cn.duolingo.com/lesson)

![中文听写指令 · 英语键入与中文反馈局部图](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/cn-googleplay-typed-dictation.png)

图证：官方宣传局部图 · 不计为完整题页；界面：中文；学习方向：中文母语→英语。中文键入听到内容的指令；常速、慢速两个音频入口，大文本框内 I need to pay.；底部正确反馈含中文释义，完整继续按钮可见。宣传卡片下边界截断，不能算整幅完整界面。
[来源页面](https://play.google.com/store/apps/details?hl=zh_CN&id=com.duolingo)

<a id="S04"></a>
### S04 · 故事短语补全：带回放的缺句选择

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**有音频回放、作答前缺句隐藏；未验证脱离声音能否独立完成，暂不计严格无需听力。
**能力目标：**在情境与声音线索下补全对话中的缺失片段；两种线索的贡献待核。
**输入与输出（待核项目为分析示例）：**No, ____ . Why?；三项英语短语，旁有回放。 → I'm going shopping。

**用户操作（待核项目为条件分析）**

1. 读情境与不完整句子，按需回放。
2. 点I'm good at stopping立即错误，随后候选变灰。
3. 点I'm going shopping正确，缺口补成完整句子，继续启用。
4. 点继续实际进入司机解释河边情节。

**本轮中文网页实测事实：**隐藏片段与三个英语候选同屏；正确后完整台词才显示，候选依判定变红/灰/绿。
**中文用户的任务负担：**学习者需明确是找听到的内容还是仅找情境合理回答；中文指令“选择短语”本身未完全说明线索权重。
**设计解读：**给定短语减少自行生成要求；选项既含意义差异，也含发音相近的词组，可能同时考查声音和情境。这里只能从画面分析这两类可能，不把未听音的判断写成事实。
**反馈建议（分析）：**题意应明确声音与情境的使用要求，错误后给出可对照的目标片段与整句。
**证据与能力边界：**F20有同题错答核心闭环；没有音轨，严格的无听力独立完成能力未验证，因此本条置于听说相关，不混入无需听说组。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；乘坐出租车故事重读中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![点击继续；“选择短语”：No, ____ . Why?，旁有回放，三个英语短语候选；作答前缺失片段不可见。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/328.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/stories/en-zh-taxi-ride?mode=read&practiceHubStory=featured)

<a id="S05"></a>
### S05 · 故事听音重组：逐片段接受正确前缀

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**中文明确要求重组听到的句子；用点击作答，不要求口说。
**能力目标：**把所听句子按正确顺序重组为英语片段序列。
**输入与输出（待核项目为分析示例）：**隐藏文字的对话气泡与are wrong / directions / I think my。 → I think my directions are wrong.

**用户操作（待核项目为条件分析）**

1. 点击一个片段，它立即接受或拒绝，无检查按钮。
2. 首位误点are wrong短暂红色，不插入答案，随后恢复可选。
3. 选择I think my后气泡揭晓正确前缀；再错点are wrong时前缀仍保留。
4. 继续选择directions和are wrong，整句完成自动绿色反馈，再点继续读后文。

**本轮中文网页实测事实：**已接受前缀逐步出现，已用按钮禁用；错选不破坏已完成部分。错误片段恢复可选，因为它可能适合句子后面的正确位置。
**中文用户的任务负担：**要保留声音的顺序并定位片段。每步试错也能完成，不能用最终拼齐判断完整听辨能力。
**设计解读：**校验单位是当前位置的一块，形成逐步帮助；普通听写词库则先允许构句再判整句。这种帮助能减少挫败，但也降低了独立复述整个句子的要求。
**反馈建议（分析）：**学习记录应保留各位置错误和已接受前缀；若要测独立能力，后续应撤去逐片段即时反馈。
**证据与能力边界：**F21同题从两次错误到正确和继续已拍到；没有验证原音轨、播放质量或退出恢复。与E13不混用操作规则。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；乘坐出租车故事重读中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![点击继续；“重组听到的句子”：气泡文字隐藏，三个片段 are wrong / directions / I think my；继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/334.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/stories/en-zh-taxi-ride?mode=read&practiceHubStory=featured)

<a id="R01"></a>
### R01 · Radio：找出听到的两个英语单词

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**在英语话语中识别目标词形，不要求拼写整句。
**输入与输出（待核项目为分析示例）：**选择你听到的2个单词；class / favorite / boring。 → 逐次找出class与favorite。

**用户操作（待核项目为条件分析）**

1. 点击一个词即判定；boring错误后变灰禁用。
2. 点击class立即绿色正确，但一个词不足以完成任务。
3. 点击favorite正确后，问题自动收起并继续节目。

**本轮中文网页实测事实：**短语指令明确数量；三个英语词按钮横向排布。已对项保持绿色，错误项变灰；没有统一检查或继续按钮。
**中文用户的任务负担：**需要记住声音中的词，随后比较拼写；错误候选一旦排除，剩余答案容易推出。
**设计解读：**把长话语里的局部词形提出来，降低整段理解和输出压力。这里不是先多选后提交，而是逐词获得反馈并累积满足数量。
**反馈建议（分析）：**把首次识别与试错完成分开；给后续整句上下文，防止只抓单词忽略意义。
**证据与能力边界：**F33同题错误、一个正确、两个正确及自动推进已拍到。未听验音轨；没有可提交第三项的稳定界面，不能编造多选上限提示。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；学习法国文化电台复习中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![下一道题已出现；选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/523.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/lesson/unit/55/level/3)

<a id="R02"></a>
### R02 · Radio：英语声音配中文释义

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**把英语声音连到中文意义，随后核对英语拼写。
**输入与输出（待核项目为分析示例）：**四个声音与年、学校、图片、法语。 → year / French / pictures / school分别配到中文。

**用户操作（待核项目为条件分析）**

1. 可先点声音也可先点中文，再点另一侧。
2. 错配短暂标红后恢复，已经配对的项目保留。
3. 正确时变绿并揭晓英文拼写，然后变浅禁用。
4. 四对完成后自动恢复节目播放，无需检查或继续。

**本轮中文网页实测事实：**主画面是莉莉演播室；配对位于底部两列，每列四项。英语拼写作答前隐藏、正确后才出现。
**中文用户的任务负担：**声音与候选位置需要短时记忆；完成项逐渐减少也增加排除策略的帮助。
**设计解读：**先声音、再意义、后拼写构成分阶段关联；若只看正确截图，会误以为作答前就给了英文词形。自动恢复播放把词汇任务嵌回节目时间线。
**反馈建议（分析）：**保留错误后重听入口；课后结合整段台词回看声音、意义与拼写之间的关系。
**证据与能力边界：**F31完成同题错误恢复到全部正确并自动播放。通过试错采集，不代表听力表现；无限红心仅属于本次Super会话。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；学习法国文化电台复习中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![进入并等待首个任务；莉莉演播室上方为进度和无限红心；下方选择配对，四个声音与年、学校、图片、法语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/502.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/lesson/unit/55/level/3)

<a id="R03"></a>
### R03 · Radio：判断中文陈述与英语内容是否一致

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**比较听到的英语内容和中文陈述，判断语义一致性。
**输入与输出（待核项目为分析示例）：**她去年在学校学习了西班牙语。与一段英语声音。 → 点叉，表示该陈述不符合声音内容。

**用户操作（待核项目为条件分析）**

1. 看到中文陈述，英语句子暂时隐藏；勾/叉两项可选。
2. 点勾立即判错，揭示I learned French at school last year.。
3. 错误项禁用，点叉变绿，随后自动继续节目。

**本轮中文网页实测事实：**勾和叉表示回答“对/不对”，红绿表示回答是否正确；绿色的叉是正确答案，不是系统错误。
**中文用户的任务负担：**要区分题目真伪与回答正确性；二选一经过排除即可通过，最终完成不能证明首次理解。
**设计解读：**语义判断减少自由输出，中文陈述使错在French/西班牙语这一细节更容易核对。揭晓英语在答错之后发生，属于纠错帮助。
**反馈建议（分析）：**图标配合明确文字说明，避免儿童把叉等同于自己答错；纠错应把冲突的信息对应展示。
**证据与能力边界：**F32同题错误、揭晓、正确、自动推进已记录。原音轨未保存，不做声音质量或学习能力判断。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；学习法国文化电台复习中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![等待下一问题出现；“她去年在学校学习了西班牙语。”；音频波形与勾/叉二选一，作答前英文句子隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/518.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/lesson/unit/55/level/3)

<a id="R05"></a>
### R05 · Radio：中文选项核对节目内容

**中文图证：**完整中文题页 · Super账号实测
**作答方式：**根据此前节目声音选择中文含义；不是纯文字阅读题，不要求开口。
**能力目标：**理解节目中的意思，再选与其一致的中文概括。
**输入与输出（待核项目为分析示例）：**她喜欢学习；关于新地方 / 关于旧地方。 → 关于新地方。

**用户操作（待核项目为条件分析）**

1. 回忆前文声音，点击中文候选即时判定。
2. 关于旧地方变红后变灰禁用。
3. 关于新地方绿色正确，自动进入节目收尾及结算。

**本轮中文网页实测事实：**节目主画面保持；下方中文短题干和竖向两个候选。这个题屏没有全文英语，也没有检查按钮。
**中文用户的任务负担：**要记住刚才的节目并理解中文概括，文字候选本身不能替代英语输入。
**设计解读：**相比R01抓词，本题要求理解new places所指的意义；中文输出减少英语产出负担，仍依赖此前声音材料。
**反馈建议（分析）：**将课后文本作为回顾工具，标注答案对应哪句英语；不要因为答案用中文就把它记成纯阅读任务。
**证据与能力边界：**F34记录本题完整错误到正确并自动收尾。它是内容选择变体，不是仍未遇到的R04图像选择；单独编号仅用于研究检索。
**课程与套餐：**2026-09-27 中文→英语桌面网页版；中文→英语；已登录 Super 账号；学习法国文化电台复习中实际出现。 本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。

![等待下一问题；“她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/529.png)

图证：完整桌面视口 · 实际操作状态；界面：中文；学习方向：中文母语→英语。本次独立浏览器中文→英语实测，Super 账号；完整未修改视口原图。步骤事实与推论、未采集条件分别记录。
[来源页面](https://www.duolingo.com/lesson/unit/55/level/3)

<a id="E03"></a>
### E03 · Flashcards：主动说出英语词

**中文图证：**中文课程 / 题图待核实
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**从中文意义主动提取英语词，而不是看到英语后认出中文。
**输入与输出（待核项目为分析示例）：**苹果 → apple

**用户操作（待核项目为条件分析）**

1. 若有口述分支，读中文提示后说英语词；识别未成功时先核对录音状态，再重试。

**中文适配分析，非已观察的中文界面：**需要核对：中文→英语 Flashcards 是否开放；中文卡面、键入分支及评分反馈。
**中文用户的任务负担：**口述同时要求词汇提取和发音；键入则增加字母顺序负担，例如看到‘苹果’需自己想出 apple。
**设计解读：**确认中文提示具体指哪个义项；不把任何不同说法都当错。
**反馈建议（分析）：**分清‘未录到声音／识别有疑问’与‘词义回答不符’；答错可给中文义项、正确英语及重试机会。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 葡语版的五卡、三项通过和回队规则不能视为已证实的中文规则。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#E03)

<a id="E16"></a>
### E16 · 理解英语问题并说出正确回应

**中文图证：**中文课程 / 题图待核实
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**先判断英语问题需要什么回应，再说出符合语境的给定句。
**输入与输出（待核项目为分析示例）：**几点了？—五点。 → What time is it? — It's five.

**用户操作（待核项目为条件分析）**

1. 理解问题并先确定合适的候选回应。
2. 对相应录音入口说出所选回应；具体如何选择与提交须按中文实机核验。

**中文适配分析，非已观察的中文界面：**需要核对：中文课程是否开放；先选后说或直接对麦克风说的具体流程。
**中文用户的任务负担：**同时有理解、候选比较和朗读要求；读对了不等于选得合适，选对了也不等于朗读已被可靠识别。
**设计解读：**说明问答关系及操作，避免把候选朗读当成自由对话。
**反馈建议（分析）：**理解选择与语音结果分别给清楚反馈；中文提示应说明本次究竟要选、要说，还是两者都要。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 回应已经提供，不能与自行组织答案同等解释。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#E16)

<a id="R04"></a>
### R04 · Radio 听音选择图片

**中文图证：**中文课程 / 题图待核实
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**把英语声音理解为对象或事件，并用图像选择回应。
**输入与输出（待核项目为分析示例）：**糖 → sugar

**用户操作（待核项目为条件分析）**

1. 听英语对象或情境，从图中选对应一项。

**中文适配分析，非已观察的中文界面：**需要核对：中文 Radio 选图题；实际音频与图像对应。
**中文用户的任务负担：**虽然无拼写输入，仍有图片辨识负担；若两图分别表示糖和盐但画得近似，错误可能是图像歧义。
**设计解读：**答后澄清词义和图像指代，尤其在图片不熟悉时。
**反馈建议（分析）：**图片需靠形状或情境清楚区分；答后可用英语词加中文意义核对，不在首次听前用标签直接揭示。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 听音选图不验证拼写，也不自动等同所有普通看图选词题。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#R04)

<a id="M02"></a>
### M02 · Video Call with Lily 英语自由对话

**中文图证：**中文课程 / 题图待核实
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**听懂英语问题并即时组织口头回应，在交流中澄清和续接话题。
**输入与输出（待核项目为分析示例）：**今天做了什么？／请再说一遍。 → What did you do today? / Could you repeat that?

**用户操作（待核项目为条件分析）**

1. 在已开放的假设下，听问题并回应，不清楚时请求重复；结束后核对自己表达的意思。

**中文适配分析，非已观察的中文界面：**需要核对：中文英语 Max 视频通话可用性；中文引导、澄清、结束和转录。
**中文用户的任务负担：**要同时听懂、检索内容和开口，不能像文字任务反复读；回应慢可能来自思考内容，不一定来自词汇不足。
**设计解读：**用于入口说明及事后反思，避免每轮自动代替英语听说。
**反馈建议（分析）：**中文说明通话状态和结束动作；反馈区分听不懂、表达待改与识别未成功，允许学习者有思考时间。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 画面中的 Lily 不足以证明中文英语课程开放；未实测通话或转录。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#M02)

<a id="M03"></a>
### M03 · Video Call with Falstaff 英语引导对话

**中文图证：**中文课程 / 题图待核实
**作答方式：**按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。
**能力目标：**在可选提示支撑下完成英语口头回应，逐步增加独立表达。
**输入与输出（待核项目为分析示例）：**对方问你想要什么。—请给我茶。 → What would you like? — Tea, please.

**用户操作（待核项目为条件分析）**

1. 听问题，先尝试回应，卡住时再用提示，最后说出自己的完整意思。

**中文适配分析，非已观察的中文界面：**需要核对：中文英语 Falstaff 通话是否开放；字幕、提示和母语反馈内容。
**中文用户的任务负担：**需管理听问题、看字幕或提示及说话三种注意来源；照读提示成功与独立组织成功应分开理解。
**设计解读：**解除具体障碍，帮助理解下一步；不能据葡语文章推出中文实时反馈已经上线。
**反馈建议（分析）：**中文提示宜逐层提供问题意思、关键词或句框；记录提示依赖程度，不把照读全部答案记作独立产出。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 Falstaff 普通跟读与引导视频通话要分开；中文可用性和提示语言未证实。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#M03)

<a id="supporting-interaction"></a>
## 4.3 场景辅助交互

本组 1 个研究条目：0 项有中文图像证据，其中 0 项有完整题页；另 1 项仍待核实中文课程与具体题图。条目含情境和输入变体，不是官方题型总数。

走动、点物和触发对话属于情境组织，不单独当作英语能力判分题。

<a id="A01"></a>
### A01 · Adventures 场景探索/点物/读标牌

**中文图证：**中文课程 / 题图待核实
**作答方式：**场景探索本身不是独立语言判分题。
**能力目标：**在场景中读英语标牌或任务线索，完成明确目标。
**输入与输出（待核项目为分析示例）：**找到出口 → EXIT

**用户操作（待核项目为条件分析）**

1. 先理解中文任务说明，再读英语环境线索，完成相应探索动作。

**中文适配分析，非已观察的中文界面：**需要核对：中文→英语 Adventures 是否开放；操作提示和任务判定。
**中文用户的任务负担：**导航、找热点和阅读英语叠加；找不到可点击区域不能直接解释为英语能力不足。
**设计解读：**降低无关导航成本，同时保留目标英语阅读。
**反馈建议（分析）：**中文解释基本操作和当前目标，英语承担需要学习的标牌信息；可交互区域应可辨。
**证据与能力边界：**若中文→英语课程提供此题型时的设计分析；本轮未见中文题图，未核验中文课程已开放。 走到地点或点中物体不等于语言题答对。
**课程与套餐：**中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。 中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。

[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#A01)

## 5. 中文课程入口与反馈层

先确认课程的学习基础语言与目标语言，再讨论中文指令和英语题目。
课程分组标题、国旗与语言名称明确显示学习方向；底部保留继续按钮。
该图是官方历史公开入口，不是本轮账号操作记录，也不证明之后所有功能均可用。

![通过中文学习 → 英语 · 课程入口](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/cn-apple-course-selection.webp)

图证：完整课程选择入口 · 不计为题型；界面：中文；学习方向：中文母语→英语。上下完整的课程选择入口，可辅助说明中文学习英语的课程方向；不是题型，不计入完整题页数量。该页同时包含粤语、日语等课程及“通过英文学习”分组，不将这些条目混入英语题型。
[来源页面](https://apps.apple.com/cn/iphone/story/id1605587215)

## 6. 中文用户的 UI 设计关键点

### 6.0 从真实操作重新理解一道题

从第一性原理看，一道题至少有四项责任：让学习者理解任务、表达当前答案、知道判断结果、完成下一步学习。若截图只展示题面，后三项都没有得到验证。本轮记录表明，这些责任需要用不同状态实现。

| 操作阶段 | 本轮实际观察 | 设计含义与边界 |
| --- | --- | --- |
| 未答 → 草稿 | 空答案时检查灰色，选择后变绿；蓝色仅表示已选 | 可操作不等于答案完整或正确。Tea, please. 只选谢谢也能提交 |
| 修改草稿 | 单选改点另一项；词块点击撤回后重新追加；键盘可清空 | 编辑应可逆，降低试探成本；三种输入方式不能混为一种撤销规则 |
| 提交错误 | 普通课的选择/词块/键入题锁定，底部红色纠错；对话还给中文意思 | 这是检查按钮提交的路径，不能推广到故事/电台即时判分 |
| 配对错误 | 一对瞬间变红，稍后恢复白色，原位继续 | 自动判定的粒度是一对词；瞬时状态必须单独截图才不会漏证据 |
| 后续重练 | 访客课末有错题重练标签；Super复习也复现原题，但本次未见额外过场 | 把纠错安排进后续课序；不要编造各播放器共有的过场 |
| 模式切换 | 词库的 please 与键盘的 Tea, please. 分别保留 | 支持切换尝试，也要求用户确认当前实际提交的是哪份答案 |
| 跳过 | 听力跳过提示15分钟后恢复；普通翻译跳过进课末重练 | 两个入口的含义不同；不能共用一句“跳过就是答错” |
| 课末回顾 | 首次错误 sugar 与正确 tea 可查看，重练正确记录另列 | 学习记录应保留过程，不能用最终成功覆盖初次错误 |
| 故事/电台选择错误 | 选择立即判定，错误候选红色后禁用，可在原题改选 | 判断单位是一项；“选择”已经是提交，没有未判分草稿阶段 |
| 故事重组 | 错片段不插入，正确前缀保留，按位置即时判定 | 属于有较强支架的序列构造，不等于无帮助的整句听写 |
| 电台推进 | 配对齐、两个词找齐或答对选择后自动继续播放 | 需要拍自动进入后续节目，不能只找并不存在的继续按钮 |
| 难度切换 | 缺词与整句翻译互换、分别保留草稿 | 改变的是提取信息量与能力要求，不只是输入框外观 |
| 拼写提醒 | docter例绿色通过，仍显示有错别字 | 应把语义通过与书写无误分开，容错范围不能由单例外推 |

以上来自F01–F35的实测原图。累计17类核心闭环，所有条件分支穷举仍为0。设计含义是据此推导的分析，不是Duolingo官方设计团队的动机声明。

### 6.1 把“看懂操作”和“学会英语”分开

“翻译这句话”“完成翻译”“填空”“检查”“继续”用中文表达，能让界面的操作要求保持明确；英语放在角色气泡、句子与答案区。指令是否易懂、按钮是否可发现，与英语题目本身的难度是两项不同检查。

### 6.2 中英混排需要为修改答案留出空间

中文提示可以自然换行，英语输入则需要保留单词边界和句子结构。已见截图把中文原句放在气泡，把英文输入放在较大的独立框中；部分翻译题在原位置提供短空位。对手机实际体验，还需核对键盘展开后原文是否可见、光标能否定位、长英文是否被遮挡。本轮桌面端已记录清空、词块撤回与模式切换；移动端软键盘及长答案布局仍没有证据。

### 6.3 反馈要让学习者知道英语哪里发生了变化

中文填空图同时保留题干、绿色选项、勾选标记、中文意义和“继续”，便于学习者核对结果。对中译英任务，后续设计可用中文解释英语变化的原因，例如说明 “Are you…?” 的问句顺序，同时保留学习者自己的句子。这里的解释建议不是对 Duolingo 当前中文纠错服务的功能确认。

### 6.4 “识别正确”与“主动产出”需要不同结论

中英配对、英译中词块和三选一填空都有候选项；整句键入需要独立提取和组织。学习记录可以保留词库、提示和重试条件，避免把不同帮助程度下的完成结果解释成同一种能力。

### 6.5 可迁移的是任务结构，不是替换文字后的外语截图

其他母语课程可以帮助理解配对、对话、故事、电台等交互思路。落到中文用户时，还要重新核对中文题干是否自然、中文解释是否准确、英文输入是否顺手、中文课程是否确实开放该功能。不能把外语界面的图文替换一下，就当作已经验证的中文产品界面。

### 6.6 发音专项的三个容易误读之处

1. **相同选项不是相同音频。** 连续 got/get 选项曾接受 got、接受 get，也曾拒绝 get。没有音轨身份核对，不能把文字相同的截图拼成“同一道听力题重试”。F13 保留实际课序，明确区分实例。
2. **反馈中的单词出现时机决定题目要求。** E18 作答前隐藏词形，提交后才显示 got/get 及音标；若只看反馈截图，会误以为用户作答时已得到文字提示。
3. **鼓励文案不是学习成效。** 本次跳过声音同异题出现黄色反馈和鼓励语；跳过朗读也显示“发音好棒哦”。两者都没有成功作答，不能用文案或勾号替代真实动作判断。

### 6.7 故事与电台：同一个容器里有不同学习任务

Taxi Ride先让学习者阅读情境，再把理解题、词组意义、缺句选择、听音重组和词汇配对插入情节。S01中的“三英里后才转弯”检查字面意义；“我在付车费”对应按自己的路线走，检查言外之意；结尾导航不可靠则要求总结。这是本篇真实题序，不是所有故事的固定模板。

电台把较大的角色演播室留在屏幕中心，答题区出现于底部；配对前看不见英语拼写，答对才出现year等词。判断题作答前是波形，答错后才揭晓包含French的英语句子。**只保存反馈图会高估用户作答时拥有的信息。** 课后“查看文本”才展示中英全文，也不能倒推为作答前字幕。

从第一性原理看，容器决定上下文与节奏，题目决定学习者必须完成的认知操作。故事的S01/S02可用阅读独立作答，所以放在无需听说章节；S05明确要求听音，整篇故事不能归成无听力。电台R05虽然答案是中文，输入仍来自前文声音，也不属于纯阅读。

### 6.8 可以直接用于课程规范的交互对照

| 实测交互 | 作答与判定单位 | 错误后怎样恢复 | 记录中应保留什么 |
| --- | --- | --- | --- |
| 普通翻译 | 整句草稿，点检查才判分 | 锁定结果，后段同题重答 | 首次原答、修正片段、重答记录、输入模式 |
| 普通/故事/电台配对 | 每次连接的一对 | 闪红后原位重选，已对项保留 | 每对错误次数与答案揭晓时机 |
| 故事/电台内容选择 | 每次点选的一项 | 错误候选禁用，剩余项继续选 | 首次选择与排除后完成不能合并 |
| 故事重组 | 下一个位置的片段 | 错片段恢复可用，已对前缀保留 | 各位置试错、完整前缀以及帮助程度 |
| 电台找两个词 | 每一个目标词 | 错词禁用，找齐两个后自动推进 | 找对数量、逐项反馈、自动推进去向 |

这些是可实施的状态划分建议，不是要求复制角色美术。中文儿童课程还应评估按键大小、中文阅读量、候选误导与故事内容；例如电台中文串场带调侃语气，不能不做适龄审查就照搬到课堂。

## 7. 可用于中文英语课程设计的建议

1. **把翻译方向写进题目规范。** 英译中侧重理解，中译英更直接要求英语产出；两者的正确率不能作相同解释。
2. **逐步减少帮助，并记录帮助程度。** 词块、部分译文、中文提示和完整输入分别承担不同作用。换一种支架后，应重新确认难度。
3. **用具体句子说明结构。** 例如中文“你是……吗？”与英语 “Are you…?” 的对应，比只显示“语法错误”更容易帮助当前学习者修改。
4. **区分内容错误与操作错误。** 单词不会、词序不对、漏空格、输入法失误、误点词块和设备录音失败，需要不同恢复方式。
5. **让干扰项对应值得检查的理解。** 若候选词只靠常识就能排除，单次答对对英语能力的证明有限。增加难度时要围绕教学目标，而不是随意增加陌生词。
6. **容纳自然的英语表达。** 整句翻译可能存在多种合理说法；判分应围绕课程目标与语义。具体可接受答案需另行验证，不能由一张正确题图推定。
7. **中文解释与英文材料保持对应。** 原句、学习者答案、修正片段和中文说明应能互相对照，避免只给奖励动画却不知道哪里学会了。
8. **儿童场景需再做适龄检查。** 中文阅读量、英文键入量、操作精度和故事主题都应匹配具体年龄；成人产品的题型不能不经验证直接成为儿童教学方案。

## 8. 中文题图与实测的剩余缺口

主报告已把外语界面移到参考附录。这个调整使中文证据的边界更清楚，也意味着不能沿用上一版“29 项完整英语任务画面”作为中文界面的覆盖数。

尚未取得完整中文题图的条目在目录中直接标出。官方多屏图的遮挡、宣传图的裁切、翻译页只见麦克风入口，都不算对应交互的完整实证。E05此前仅有宣传局部，此次已补为完整实测；故事与电台已取得的条目也不再列作未实测。

累计完成两条访客流程和三条Super流程，336张原始截图、35组流程，涉及23个题型/情境/输入变体；17类有同题错误到正确并继续的核心闭环。此次登录后新增186张原图、19组流程。38个研究条目中25项有完整中文题页，1项只有输入入口，12项没有中文题图。

以下缺口仍然存在：

1. **题型覆盖：**仍无中文题图的是E02英文定义选择、E03词卡口答、E10看图填空、E11段落阅读、E16听后口答、S03故事开放写作、R04电台图像选择、A01/A02冒险、M01/M02/M03 Max体验；E08只有历史录音入口。E09选词填空、E20普通听音配中文虽有历史完整图，尚未补到连续实测。
2. **同题分支：**E13词块听写已补到错误提交，但没有同音同题正确重练；E14先听后答只采到正确分支；E22键入听写未采到正确结果或原题重练。多数题未验证确认退出后重进、快捷键、其他错误类别和异常恢复。17个核心闭环仍不等于分支穷举。
3. **声音与设备：**普通/慢速播放按钮已点击，未保存音轨并听验；录音界面与未通过提示已有截图，但没有成功朗读的音轨与识别精度证据；移动端软键盘和实际移动设备未验证。报告的窄屏排版检查不属于 Duolingo 移动端实测。
4. **账号与套餐：**Super已核验并实测，故事与电台也已有当前中文账号证据；Max和Adventures仍未实测。当前桌面账号能进入不等于所有地区、移动端、免费账号都同样开放，也不证明这些题型属于会员独占。
5. **条件事件：**免费补心仅在本次入门会话遇到；听力“15分钟后恢复”是界面提示，尚未跟到恢复时刻。没有模拟断网或其他未观察事件。

**“每一种现行中文学英语题型的所有操作都有截图”仍未全部满足。** 未拍到的状态在逐题分支表中保留为待实测，没有使用重绘界面、外语图片或推测反馈补齐。

## 9. 本次整理与实际验证

- **新增：**本次Super账号采集186张原始截图、19组流程；累计336张、35组。每一步都有动作、真实结果、题干、会话、时间与原图编号。
- **新增：**中文故事三层理解、词义定位、短语补全、逐片段听音重组、故事末尾五对配对；S04/S05单列，避免与整句词库操作混用。
- **新增：**中译英词块和键入同题纠错、撤回中间词、清空、独立草稿、退出取消、缺词/整句难度切换、docter拼写提醒、首次错误与重做成绩单。
- **新增：**Radio四种真实交互与自动推进、课后中英全文回顾；R05单列内容选择。累计17类完成同题错误到正确的核心闭环。
- **修正：**把静态完整题页误当完整操作的表述；把立即原位重答套到所有题型的假设；把多道题、不同版本或不同输入模式的反馈混用的问题。
- **修正：**Super、故事、电台从待核转为具体账号实证；E05从局部宣传图转为完整实测。E13新补词库错误提交，但仍不把它当作正确听写闭环。各会话和输入方式分别标注。
- **保留：**无需口语和听力的独立章节、中文母语视角、旧中文参考图与跨语言附录。国外母语界面的图片仍不计中文覆盖。
- **实际验证：**访客基础课、发音专项和Super三条流程均已走到结算；故事与电台已返回入口，单元复习已回顾两次答案。截图逐张检查、原图尺寸及内容哈希核对。网页显示、链接、窄屏排版与离线包的实际结果另见verification.json。
- **未完成：**上述题型、同题条件分支、音轨、移动端和付费功能缺口。未拍到不等于产品不支持。
- **提交：未执行。推送：未执行。官网发布：未执行。** 本轮只更新本地研究报告，没有改动业务功能。


## 10. 中文证据来源

- []()
- [多邻国 Duolingo（中国 App Store 开发者展示图）](https://apps.apple.com/cn/app/id570060128?platform=ipad)
- [玩着游戏，就能学外语？](https://apps.apple.com/cn/iphone/story/id1399754989)
- [闯关升级学外语](https://apps.apple.com/cn/iphone/story/id1605587215)
- [Duolingo 官方：Max 功能与课程方向](https://blog.duolingo.com/duolingo-max/)
- [Duolingo 官方历史说明：Stories 上线 Android 与课程范围](https://blog.duolingo.com/duolingo-stories-the-journey-to-android/)
- [Duolingo 官方：免费的 Practice 技能练习](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)
- [Duolingo Google Play 中文商店页](https://play.google.com/store/apps/details?hl=zh_CN&id=com.duolingo)
- [3](https://www.duolingo.com/lesson/unit/55/level/3)
- [unit-rewind](https://www.duolingo.com/practice-hub/unit-rewind)
- [en-zh-taxi-ride?mode=read&practiceHubStory=featured](https://www.duolingo.com/stories/en-zh-taxi-ride?mode=read&practiceHubStory=featured)
- [pronunciation](https://zh-cn.duolingo.com/alphabets/en/pronunciation)
- [lesson](https://zh-cn.duolingo.com/lesson)
