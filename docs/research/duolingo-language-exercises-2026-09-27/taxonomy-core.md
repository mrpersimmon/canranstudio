# Duolingo 语言题型研究：普通课与语法、读听说写核心分册

研究日期：2026-09-27。仅研究；未开发、提交、推送或发布。

## 结论与口径

本分册建立 31 条可追溯记录：22 个教学任务、7 个明确标注的变体、1 个 Flashcards 微练习、1 个历史测验任务。**这不是“Duolingo 恰好有 31 种题型”的官方结论。** 当前 30 条有官方完整题屏或论文中的完整题屏；历史 Checkpoint 自主写作仅有文字证据。原始媒体共 31 个记录，其中部分被多个变体复用。

- 本文件是普通语言课、语法、基础读听说写的核心分册；书写系统、Stories、DuoRadio、Adventures、Max开放对话等需与其他研究分册合并。
- 基于一手可验证的教学任务清单，不是Duolingo私有后端challengeType字段的穷尽枚举；产品试验可能产生未公开变体。
- 22条atomic_task是本研究的教学任务划分，不是官方公布的数量；相同单选控件也可能对应不同学习任务。
- 31条条目明确区分22个任务、7个变体、1个Flashcards微练习、1个历史测验任务；不能简单宣称Duolingo有31种题型。
- 截图完整指顶部退出/进度、完整题干/响应区和该模式底部操作均在图内；不要求操作系统状态栏，也不把没有Check但有麦克风的题误判为裁切。
- 官方图片只证明该界面被官方展示过。没有逐课程、逐地区、逐账户登录验证，也没有把文档modified_at当成功能上线时间。
- 英文Sounds文章页头带DET推广，但本研究引用的是主App英语课程发音页签，不包含DET考题。
- 本次仅读取公开网页与官方媒体，图片在内存缩小用于视觉核验；除本文件和对应JSON外，本子任务未创建媒体或修改业务文件。

**订阅时效更正：** 2026-02-18 的专项公告已把基础技能 Practice 开放给所有学习者，并明确 iOS/Android 全部语言课程；因此旧 Duolingo 101 和旧练习总览里“Speak/Listen/Words/Mistakes 属于 Super”的描述不可直接用于当前矩阵。这不会自动证明每个原子题在每门课程中都出现。[CS11 · 2026-02-18](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)、[CS01 · 2024-12-02](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)

## 一览表

| ID | 教学任务/变体 | 分类 | 主要输入 → 输出 | 完整界面 |
|---|---|---|---|---|
| C01 | 图片词汇单选 | 教学任务 | 母语词提示；若干带目标语标签的图片。 → 一个图片选项。 | [CM01 原始完整题屏](https://research.duolingo.com/papers/portnoff.edm21.pdf#page=2) |
| C02 | 语境词义辨认 | 教学任务 | 目标语例句；突出标记的词；母语释义选项。 → 一个释义选项。 | [CM02 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2024/03/table1_image1.PNG) |
| C03 | 双语词语配对 | 教学任务 | 两列书面词语。 → 多组一一配对。 | [CM03 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+2.png) |
| C04 | 图片/词义提示的单词翻译 | 教学任务 | 物体图和母语词。 → 一个词或短语。 | [CM04 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-vocabulary.png) |
| C05 | 带冠词选择的单词翻译 | 组合变体（C04） | 图片与母语名词；冠词按钮；词汇输入框。 → 离散冠词选择 + 名词文本。 | [CM05 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/6-exerciseTypes.png) |
| C06 | 词块组句翻译 | 教学任务 | 母语或目标语原句；乱序词块。 → 有序词块序列。 | [CM06 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_word-bank.png) |
| C07 | 整句自由翻译 | 教学任务 | 另一种语言的句子；空白输入框。 → 完整自由文本译文。 | [CM07 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-answer.png) |
| C08 | 补全部分翻译 | 教学任务 | 母语原句；已填写一部分的目标语译文。 → 单词或短语文本。 | [CM08 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_fill-in-the-blank.png) |
| C09 | 单语语境选词填空 | 教学任务 | 目标语有缺词句子；若干书面候选词。 → 一个选项填入空白。 | [CM09 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+1.png) |
| C10 | 场景图片辅助的单语填空 | 场景变体（C09） | 人物/物品情境图；目标语缺词句；词块。 → 补完目标语句子。 | [CM10 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/04/Blog_Monolingual-Challenges_1.png) |
| C11 | 对比双空填词 | 结构变体（C09） | 相邻两句/两个空；候选词。 → 两个位置的选词结果。 | [CM11 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-5.png) |
| C12 | 点选词尾 | 教学任务 | 句子中的固定词干；候选词尾。 → 词尾选项。 | [CM12 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-7.png) |
| C13 | 键入词尾 | 输入方式变体（C12） | 固定词干与词尾空位，无候选列表。 → 词尾文本。 | [CM13 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-8.png) |
| C14 | 语法范式表格补全 | 教学任务 | 带行列标题的代词/动词表、示例形式与空格。 → 多个表格单元的词形。 | [CM14 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-4.png) |
| C15 | 词块听写/听后重组 | 教学任务 | 句子音频；正常/慢速播放；书面词块。 → 与音频对应的词块序列。 | [CM15 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Practice-tab-3.jpg) |
| C16 | 整句自由听写 | 教学任务 | 句子音频；文本输入。 → 整句转写文本。 | [CM16 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/Listening_2_No-text.png) |
| C17 | 局部听写：键入缺词 | 教学任务 | 音频 + 已给部分句子 + 一个空。 → 一个词或指定片段。 | [CM17 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-3.jpg) |
| C18 | 听句中缺词，选择声音答案 | 教学任务 | 可播放句子、句中空位、两个声音选项。 → 一个音频选项。 | [CM18 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-2.jpg) |
| C19 | 声音与词语配对 | 教学任务 | 一列音频按钮，一列书面词语。 → 多组声音—书面词对应。 | [CM19 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-1.jpg) |
| C20 | 段落阅读理解 | 教学任务 | 目标语短文；问题/待补完的陈述；候选答案。 → 意义层面的答案选择。 | [CM20 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+3.png) |
| C21 | 听后理解并选答 | 教学任务 | 音频问题/语段；提示短语；声音或文字候选。 → 一个理解答案。 | [CM21 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/listening.png) |
| C22 | 选择下一句对话 | 教学任务 | 前一句对话；空白回应气泡；候选文本。 → 一个书面回应选项。 | [CM22 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/12/EN-PT_2.png) |
| C23 | 选择合适回应并说出来 | 教学任务 | 问题气泡；若干完整回应及麦克风。 → 给定候选中的口头句子。 | [CM23 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image2.png) |
| C24 | 给定句子朗读/跟读 | 教学任务 | 给定句子文字及可播放示范；麦克风。 → 录音/语音识别结果。 | [CM24 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image1.png) |
| C25 | 复述已给定的对话回应 | 场景变体（C24） | 角色问题 + 已提供的回答文本/音频。 → 给定回应的口头复述。 | [CM25 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image3.png) |
| C26 | 以语音输入完成翻译 | 输入方式变体（C07） | 原句、译文输入框和语音输入按钮。 → 由语音转写的译文文本。 | [CM07 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-answer.png) |
| C27 | Flashcards 主动回忆卡组 | 微练习容器 | 母语词卡；默认麦克风，允许文字替代。 → 逐卡的口头/文字译词与一组反馈。 | [CM27 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_flashcards.png) |
| C28 | 最小对立/近音词辨认 | 教学任务 | 一个音频；两个相近拼写的词。 → 一个词选项。 | [CM28 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3253.PNG) |
| C29 | 两段声音相同/不同判断 | 教学任务 | 两个音频；相同/不同两个判断选项。 → 二元声音关系判断。 | [CM29 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3254.PNG) |
| C30 | 近音词声音—文字配对 | 内容变体（C19） | 多段音频与多条近音词。 → 声音—词语配对组。 | [CM30 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3256.PNG) |
| C31 | 历史 Checkpoint 自主写作 | 历史测验任务 | 写作题提示；具体 UI 未获得。 → 开放书面回答。 | 未找到 |

## 每题的操作、目标与边界

以下“设计要点”为研究者根据界面作的分析，**不作为已经实验验证的学习效果主张**。可用性仅按所列官方证据的时代与范围描述。

### C01 · 图片词汇单选

- 分类：教学任务。
- 学习目标：将词义和图像建立对应。
- 输入 → 操作 → 输出：母语词提示；若干带目标语标签的图片。 1. 读提示。 2. 点选符合词义的图片卡。 3. 提交。 最终提交一个图片选项。
- 设计要点：图与标签同时提供支持；应与看图自由命名分开。
- 课程/时代边界：2021 官方论文 Figure 2 为历史证据；未据此断言所有当前课程仍出现同版。
- 证据：[CS26 · 2021](https://research.duolingo.com/papers/portnoff.edm21.pdf)。
- 界面：[CM01 原始完整题屏](https://research.duolingo.com/papers/portnoff.edm21.pdf#page=2)。

### C02 · 语境词义辨认

- 分类：教学任务。
- 学习目标：在句子中理解新词。
- 输入 → 操作 → 输出：目标语例句；突出标记的词；母语释义选项。 1. 阅读例句，可播放音频。 2. 选出指定词在该语境中的意思。 3. 继续。 最终提交一个释义选项。
- 设计要点：同样是单选，但主要测语义理解，不是拼写或自由产出。
- 课程/时代边界：2024 官方题屏，文章 2026 仍可读取；例图英语学习者学法语。
- 证据：[CS12 · 2024-04-02](https://blog.duolingo.com/right-level-of-difficulty/)。
- 界面：[CM02 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2024/03/table1_image1.PNG)。

### C03 · 双语词语配对

- 分类：教学任务。
- 学习目标：快速辨认两种语言的词义对应。
- 输入 → 操作 → 输出：两列书面词语。 1. 点一侧词语。 2. 点另一侧对应词。 3. 重复直到配完。 最终提交多组一一配对。
- 设计要点：同一匹配机制可装入 Words 或 Match Madness；限时不是另一题型。
- 课程/时代边界：2025 阅读总览展示英文/西文；2026 免费 Practice 公告仍展示词汇配对。
- 证据：[CS03 · 2025-02-10](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/)、[CS11 · 2026-02-18](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)。
- 界面：[CM03 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+2.png)。

### C04 · 图片/词义提示的单词翻译

- 分类：教学任务。
- 学习目标：从意思主动提取词汇及拼写。
- 输入 → 操作 → 输出：物体图和母语词。 1. 辨认提示含义。 2. 键入目标语词。 3. 提交。 最终提交一个词或短语。
- 设计要点：这里不需要从图片选项辨认；图片与母语词共同提供语义提示。
- 课程/时代边界：2026 写作总览：英语提示、法语输出的完整例图。
- 证据：[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)。
- 界面：[CM04 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-vocabulary.png)。

### C05 · 带冠词选择的单词翻译

- 分类：组合变体；继承 C04。
- 学习目标：把名词与语法性别/冠词一起回忆。
- 输入 → 操作 → 输出：图片与母语名词；冠词按钮；词汇输入框。 1. 选择目标语冠词。 2. 键入名词。 3. 提交组合答案。 最终提交离散冠词选择 + 名词文本。
- 设计要点：属于 C04 的语法组合变体，不能据此将所有单词翻译都描述成带性别题。
- 课程/时代边界：2024 Duolingo 101 官方图：英文提示、西文输出；当前各课程覆盖未逐个验证。
- 证据：[CS01 · 2024-12-02](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)。
- 界面：[CM05 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/6-exerciseTypes.png)。

### C06 · 词块组句翻译

- 分类：教学任务。
- 学习目标：结合词义、语序与句法完成受支持的产出。
- 输入 → 操作 → 输出：母语或目标语原句；乱序词块。 1. 读原句。 2. 依次点选词块组成译文。 3. 必要时调整，再提交。 最终提交有序词块序列。
- 设计要点：翻译方向是训练参数；两个方向不是两个新控件。词库干扰词会改变难度。
- 课程/时代边界：2021 论文与 2022/2026 官方例图均有；键盘切换因题目和版本而异。
- 证据：[CS26 · 2021](https://research.duolingo.com/papers/portnoff.edm21.pdf)、[CS08 · 2022-09-14](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/)、[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)。
- 界面：[CM06 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_word-bank.png)；[CM01 原始完整题屏](https://research.duolingo.com/papers/portnoff.edm21.pdf#page=2)；[CM32 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/09/3-Exercises--1-.png)。

### C07 · 整句自由翻译

- 分类：教学任务。
- 学习目标：独立组织译文并检索拼写。
- 输入 → 操作 → 输出：另一种语言的句子；空白输入框。 1. 读原句。 2. 自行输入整句译文。 3. 检查后提交。 最终提交完整自由文本译文。
- 设计要点：比词块方式少了识别支架；合理译法可不止一种，词块仅显示一种组合不代表唯一译法。
- 课程/时代边界：2020 输入切换说明、2021 论文、2026 题屏均确认；旧文中等级 2 以上不是当前全平台保证。
- 证据：[CS13 · 2020-02-03](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/)、[CS20 · 2025-08-19](https://blog.duolingo.com/is-google-translate-wrong/)、[CS26 · 2021](https://research.duolingo.com/papers/portnoff.edm21.pdf)、[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)。
- 界面：[CM07 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-answer.png)。

### C08 · 补全部分翻译

- 分类：教学任务。
- 学习目标：把注意力集中在特定词或句法成分。
- 输入 → 操作 → 输出：母语原句；已填写一部分的目标语译文。 1. 对照原句与译文。 2. 在空白处补所缺成分。 3. 提交。 最终提交单词或短语文本。
- 设计要点：原文提供翻译约束，不能与只凭单语语境填空合并描述。
- 课程/时代边界：2022 官方三屏示例与 2026 葡语例图。
- 证据：[CS08 · 2022-09-14](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/)、[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)。
- 界面：[CM08 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_fill-in-the-blank.png)；[CM32 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/09/3-Exercises--1-.png)。

### C09 · 单语语境选词填空

- 分类：教学任务。
- 学习目标：依据句意及语法选出合适词。
- 输入 → 操作 → 输出：目标语有缺词句子；若干书面候选词。 1. 读句子。 2. 选择能使句子成立的词。 3. 继续/提交。 最终提交一个选项填入空白。
- 设计要点：排除项应围绕词义或语法目标；不能仅凭图片外观猜答案。
- 课程/时代边界：2025 阅读总览的法语完整例图；文章于 2026 更新。
- 证据：[CS03 · 2025-02-10](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/)。
- 界面：[CM09 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+1.png)。

### C10 · 场景图片辅助的单语填空

- 分类：场景变体；继承 C09。
- 学习目标：把场景意义直接连接到目标语。
- 输入 → 操作 → 输出：人物/物品情境图；目标语缺词句；词块。 1. 观察情境。 2. 结合句子选择适当词块。 3. 提交。 最终提交补完目标语句子。
- 设计要点：图片是理解线索，不是装饰；交互沿用填空。
- 课程/时代边界：2021 沉浸式发布文说明当时覆盖英文学西/法，以及西/葡文学英语的 iOS、Android、web；该矩阵只适用于当时。
- 证据：[CS06 · 2021-04-27](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/)。
- 界面：[CM10 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/04/Blog_Monolingual-Challenges_1.png)。

### C11 · 对比双空填词

- 分类：结构变体；继承 C09。
- 学习目标：区分近义词用法或成对语法概念。
- 输入 → 操作 → 输出：相邻两句/两个空；候选词。 1. 读两个语境。 2. 把相应选项分别填入两处。 3. 提交。 最终提交两个位置的选词结果。
- 设计要点：多空让对比关系可见；不应把空的数量单独算作新题型。
- 课程/时代边界：2020 法语 Grammar Lessons 完整历史例图。
- 证据：[CS07 · 2020-10-02](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/)。
- 界面：[CM11 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-5.png)。

### C12 · 点选词尾

- 分类：教学任务。
- 学习目标：辨别词干与正确变位结尾。
- 输入 → 操作 → 输出：句子中的固定词干；候选词尾。 1. 识别人称/语境。 2. 点选适用词尾接在词干后。 3. 提交。 最终提交词尾选项。
- 设计要点：把练习粒度缩至词素，区别于整词填空；拼接造型提示组合关系。
- 课程/时代边界：2020 法语语法专课，2022 西语 gustar 官方示例也确认同机制。
- 证据：[CS07 · 2020-10-02](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/)、[CS08 · 2022-09-14](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/)。
- 界面：[CM12 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-7.png)。

### C13 · 键入词尾

- 分类：输入方式变体；继承 C12。
- 学习目标：主动回忆变位词尾。
- 输入 → 操作 → 输出：固定词干与词尾空位，无候选列表。 1. 读语境。 2. 输入缺少的词尾。 3. 提交。 最终提交词尾文本。
- 设计要点：与 C12 的知识目标相同，但去掉候选支持。
- 课程/时代边界：2020 法语语法专课历史例图；现行课程分布未确认。
- 证据：[CS07 · 2020-10-02](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/)。
- 界面：[CM13 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-8.png)。

### C14 · 语法范式表格补全

- 分类：教学任务。
- 学习目标：对比同一语法规则的不同形式。
- 输入 → 操作 → 输出：带行列标题的代词/动词表、示例形式与空格。 1. 读表中已有形式。 2. 把对应词尾填入尚空的位置。 3. 检查各行后提交。 最终提交多个表格单元的词形。
- 设计要点：表格把形式间的规律并置；当前证据只确认图中点选补表，不能延伸为所有版本都可键入整表。
- 课程/时代边界：2020 法语语法专课历史图；2021 西语指南也展示表格练习。
- 证据：[CS07 · 2020-10-02](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/)、[CS15 · 2021-01-29](https://blog.duolingo.com/tips-for-learning-spanish-on-duolingo/)。
- 界面：[CM14 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-4.png)。

### C15 · 词块听写/听后重组

- 分类：教学任务。
- 学习目标：识别语流中的词和顺序。
- 输入 → 操作 → 输出：句子音频；正常/慢速播放；书面词块。 1. 听音频，可重播或慢放。 2. 按听到顺序点选词块。 3. 提交。 最终提交与音频对应的词块序列。
- 设计要点：要求还原原句；不是翻译，也不是听后概括意义。
- 课程/时代边界：2026 官方听力总览有 Android 完整界面。
- 证据：[CS04 · 2026-05-05](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/)、[CS01 · 2024-12-02](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)。
- 界面：[CM15 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Practice-tab-3.jpg)。

### C16 · 整句自由听写

- 分类：教学任务。
- 学习目标：把听到的语流转为完整书面形式。
- 输入 → 操作 → 输出：句子音频；文本输入。 1. 听句子。 2. 自由输入听到的全部句子。 3. 提交。 最终提交整句转写文本。
- 设计要点：没有词库提示；与只补一个缺词的 C17 不同。
- 课程/时代边界：2018 官方 placement 与 2026 写作总览文字确认；补充 2020 官方历史完整听写题图。该旧图不能证明2026所有课程仍用同一界面。
- 证据：[CS17 · 2018-09-14](https://blog.duolingo.com/partial-credit-improvements-to-duolingos-placement-test/)、[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)。
- 界面：[CM16 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/Listening_2_No-text.png)。

### C17 · 局部听写：键入缺词

- 分类：教学任务。
- 学习目标：聚焦音形对应及目标词拼写。
- 输入 → 操作 → 输出：音频 + 已给部分句子 + 一个空。 1. 听句子。 2. 在空格里输入听到的缺词。 3. 提交。 最终提交一个词或指定片段。
- 设计要点：保留上下文降低工作记忆负担；正常/慢速播放是支架参数。
- 课程/时代边界：2026 官方德语题屏，另有葡语例图。
- 证据：[CS04 · 2026-05-05](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/)、[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)。
- 界面：[CM17 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-3.jpg)。

### C18 · 听句中缺词，选择声音答案

- 分类：教学任务。
- 学习目标：区分相近音并识别目标词。
- 输入 → 操作 → 输出：可播放句子、句中空位、两个声音选项。 1. 听句子。 2. 试听候选音频。 3. 选出缺词对应的声音，再提交。 最终提交一个音频选项。
- 设计要点：候选项不直接展示词形；与书面候选的听词辨认分开。
- 课程/时代边界：2022 内容制作说明及 2026 听力总览均确认。
- 证据：[CS08 · 2022-09-14](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/)、[CS04 · 2026-05-05](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/)。
- 界面：[CM18 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-2.jpg)；[CM32 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/09/3-Exercises--1-.png)。

### C19 · 声音与词语配对

- 分类：教学任务。
- 学习目标：建立听觉形式与书面词/意义的联系。
- 输入 → 操作 → 输出：一列音频按钮，一列书面词语。 1. 点音频试听。 2. 选择对应词语。 3. 完成其余配对。 最终提交多组声音—书面词对应。
- 设计要点：界面相似并不表示所有课程都在做翻译；需按音频语言与书面列判断是音形匹配还是跨语言匹配。
- 课程/时代边界：2026 官方听力总览完整题屏；音频内容未在本次播放核听，故不推断其语言。
- 证据：[CS04 · 2026-05-05](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/)。
- 界面：[CM19 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-1.jpg)。

### C20 · 段落阅读理解

- 分类：教学任务。
- 学习目标：提取段落事实、关系或合理推断。
- 输入 → 操作 → 输出：目标语短文；问题/待补完的陈述；候选答案。 1. 阅读段落。 2. 判断哪项回答与文章一致。 3. 选择并继续。 最终提交意义层面的答案选择。
- 设计要点：不要求逐字翻译；问题可以通过句子补完表现。
- 课程/时代边界：2019 试点、2021 沉浸式课与 2025 阅读总览均记录；具体课程覆盖依时代不同。
- 证据：[CS25 · 2019-12-11](https://blog.duolingo.com/how-weve-improved-the-duolingo-learning-experience-this-year-and-a-sneak-peek-toward-2020/)、[CS06 · 2021-04-27](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/)、[CS03 · 2025-02-10](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/)。
- 界面：[CM20 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+3.png)。

### C21 · 听后理解并选答

- 分类：教学任务。
- 学习目标：理解语段意义而非逐字复写。
- 输入 → 操作 → 输出：音频问题/语段；提示短语；声音或文字候选。 1. 听主要语段。 2. 试听或阅读答案选项。 3. 选出符合意义的一项。 最终提交一个理解答案。
- 设计要点：2026 官方完整图的选项也使用音频，不宜统一画成文字单选。
- 课程/时代边界：2019/2022 官方已有听段落回答问题；2026 Practice 公告给出实际完整图。
- 证据：[CS25 · 2019-12-11](https://blog.duolingo.com/how-weve-improved-the-duolingo-learning-experience-this-year-and-a-sneak-peek-toward-2020/)、[CS08 · 2022-09-14](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/)、[CS11 · 2026-02-18](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)。
- 界面：[CM21 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/listening.png)。

### C22 · 选择下一句对话

- 分类：教学任务。
- 学习目标：理解上下文并选择合适的交际回应。
- 输入 → 操作 → 输出：前一句对话；空白回应气泡；候选文本。 1. 阅读/听前句。 2. 判断合适的下一句。 3. 点选并提交。 最终提交一个书面回应选项。
- 设计要点：考语用和对话连贯性；不能只看关键词相同。
- 课程/时代边界：2023 官方英语学习文章给出葡语界面、英语内容的完整图。
- 证据：[CS16 · 2023-01-02](https://blog.duolingo.com/why-learn-english/)。
- 界面：[CM22 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/12/EN-PT_2.png)。

### C23 · 选择合适回应并说出来

- 分类：教学任务。
- 学习目标：结合理解与受约束口语产出。
- 输入 → 操作 → 输出：问题气泡；若干完整回应及麦克风。 1. 理解问题。 2. 选定适合的回应。 3. 对麦克风说出该回应。 最终提交给定候选中的口头句子。
- 设计要点：既要判断意义，也要说出来；仍是有答案范围的对话，不能称开放 AI 会话。
- 课程/时代边界：2021 沉浸式例图、2026 speaking 总览法语例图均确认。
- 证据：[CS06 · 2021-04-27](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/)、[CS05 · 2026-02-09](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/)。
- 界面：[CM23 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image2.png)。

### C24 · 给定句子朗读/跟读

- 分类：教学任务。
- 学习目标：练习发音、节奏与完整句表达。
- 输入 → 操作 → 输出：给定句子文字及可播放示范；麦克风。 1. 听示范或读句子。 2. 点击麦克风。 3. 按给定内容说出句子。 最终提交录音/语音识别结果。
- 设计要点：产出内容已给出；不应把答对等同于自发说话能力。角色居中版仍是此任务。
- 课程/时代边界：2026 speaking 总览及免费 Practice 专项公告展示两种版式。
- 证据：[CS05 · 2026-02-09](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/)、[CS11 · 2026-02-18](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)。
- 界面：[CM24 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image1.png)；[CM31 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking.png)。

### C25 · 复述已给定的对话回应

- 分类：场景变体；继承 C24。
- 学习目标：在对话脉络里练习一句回应的发音。
- 输入 → 操作 → 输出：角色问题 + 已提供的回答文本/音频。 1. 理解问题和范例回答。 2. 开启麦克风。 3. 复述指定回答。 最终提交给定回应的口头复述。
- 设计要点：与 C23 区别是不用在多个答案中选择；与 C24 相同的跟读核心操作。
- 课程/时代边界：2026 speaking 总览的法语完整例图。
- 证据：[CS05 · 2026-02-09](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/)。
- 界面：[CM25 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image3.png)。

### C26 · 以语音输入完成翻译

- 分类：输入方式变体；继承 C07。
- 学习目标：在翻译任务中增加口头检索。
- 输入 → 操作 → 输出：原句、译文输入框和语音输入按钮。 1. 点语音输入。 2. 口头说出译文。 3. 查看转写，必要时编辑后提交。 最终提交由语音转写的译文文本。
- 设计要点：这是输入方式变体；与照给定答案朗读的评分任务不同。
- 课程/时代边界：2023 专项文章说明可编辑转写；2026 翻译题屏仍展示语音输入入口。
- 证据：[CS14 · 2023-06-28](https://blog.duolingo.com/sneaky-pronunciation-practice/)、[CS05 · 2026-02-09](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/)、[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)。
- 界面：[CM07 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-answer.png)。

### C27 · Flashcards 主动回忆卡组

- 分类：微练习容器。
- 学习目标：不看候选项，从记忆中提取目标词。
- 输入 → 操作 → 输出：母语词卡；默认麦克风，允许文字替代。 1. 看词卡后说出译词，或切换键入。 2. 对词通过；错误时看/听答案。 3. 错卡回到卡组后方再次练习。 最终提交逐卡的口头/文字译词与一组反馈。
- 设计要点：原子任务是短词翻译；卡组、翻面纠正和重试构成独特练习循环。2025 公告为5张卡、答对3张可过。
- 课程/时代边界：2025-11 发布；2025 年度回顾说已覆盖前8种学习语言；未列出所有源语言/设备组合。
- 证据：[CS10 · 2025-11-18](https://blog.duolingo.com/duolingo-flashcards/)、[CS18 · 2025-12-10](https://blog.duolingo.com/product-highlights/)。
- 界面：[CM27 原始完整题屏](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_flashcards.png)。

### C28 · 最小对立/近音词辨认

- 分类：教学任务。
- 学习目标：听出具有辨义作用的细微语音差异。
- 输入 → 操作 → 输出：一个音频；两个相近拼写的词。 1. 听词。 2. 选出对应书面词。 3. 提交。 最终提交一个词选项。
- 设计要点：是纯辨音，不需要语篇理解；可与 C18 的句中缺词声音候选区别。
- 课程/时代边界：2024 英语 Sounds 专项官方图，iOS 题屏；不能由图推断当前 web/所有源语言覆盖。
- 证据：[CS09 · 2024-11-20](https://blog.duolingo.com/duolingo-english-sounds-tab/)。
- 界面：[CM28 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3253.PNG)。

### C29 · 两段声音相同/不同判断

- 分类：教学任务。
- 学习目标：脱离具体字形，判断两段音是否同一词。
- 输入 → 操作 → 输出：两个音频；相同/不同两个判断选项。 1. 分别听两段声音。 2. 判断同词还是不同词。 3. 选择并继续。 最终提交二元声音关系判断。
- 设计要点：比较两刺激的关系，和为一个刺激命名不是同一认知任务。
- 课程/时代边界：2024 英语 Sounds 专项官方完整图。
- 证据：[CS09 · 2024-11-20](https://blog.duolingo.com/duolingo-english-sounds-tab/)。
- 界面：[CM29 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3254.PNG)。

### C30 · 近音词声音—文字配对

- 分类：内容变体；继承 C19。
- 学习目标：把一组相近词的音形关系反复对照。
- 输入 → 操作 → 输出：多段音频与多条近音词。 1. 试听音频。 2. 匹配对应词形。 3. 配完该组。 最终提交声音—词语配对组。
- 设计要点：原子交互与 C19 相同；特殊之处是选词围绕近音对比。
- 课程/时代边界：2024 英语 Sounds 官方完整图展示四组。
- 证据：[CS09 · 2024-11-20](https://blog.duolingo.com/duolingo-english-sounds-tab/)。
- 界面：[CM30 原始完整题屏](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3256.PNG)。

### C31 · 历史 Checkpoint 自主写作

- 分类：历史测验任务。
- 学习目标：在测验中自主写出目标语内容。
- 输入 → 操作 → 输出：写作题提示；具体 UI 未获得。 1. 阅读写作提示。 2. 自行组织并提交文字回答。 最终提交开放书面回答。
- 设计要点：这是历史测验的一部分，不能据论文当成今天每单元固定题。
- 课程/时代边界：2021 官方论文 §3.2 确认每份 Checkpoint 含1项自由写作；本轮未找到完整界面或当前保留证据。
- 证据：[CS26 · 2021](https://research.duolingo.com/papers/portnoff.edm21.pdf)。
- 界面：缺完整 UI；现行保留情况未验证。。

## 不应重复计数的容器与状态

| 名称 | 定位 | 区分依据与证据 |
|---|---|---|
| 普通 lesson / unit / 学习路径 | curriculum_container | 按目标组合多个题型与复习内容；不能把一节课计成一种原子题。 [CS01 · 2024-12-02](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)、[CS23 · 2022-05-06](https://blog.duolingo.com/new-duolingo-home-screen-design/) |
| Grammar Lessons / Grammar Skills | targeted_lesson_container | 聚焦语法并减少新词负担；内部有选词、词尾、表格等任务。2020/2021的名称与入口是历史形态。 [CS07 · 2020-10-02](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/)、[CS21 · 2021-10-15](https://blog.duolingo.com/duolingo-grammar-skills-improvements-2021/) |
| Immersion exercises | pedagogical_group | 指以目标语和语境线索处理意义的一组题，包括单语填空、对话、理解题；并非一个控件。 [CS06 · 2021-04-27](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/) |
| Practice tab / Words / Speak / Listen / Mistakes | practice_container_and_filters | 选择练习目标/题池。2026-02-18专项公告声明基础技能练习对全部语言课程的iOS/Android用户免费；旧总览中的Super归属已过时。 [CS11 · 2026-02-18](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)、[CS01 · 2024-12-02](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) |
| Legendary / hard exercise / Eddy bonus | difficulty_and_reward_variants | 难度、提示支持或奖励改变不自动产生新原子题型；2025官方仍以更有挑战、无提示描述Legendary。 [CS24 · 2025-12-16](https://blog.duolingo.com/ways-to-practice-in-duolingo/)、[CS18 · 2025-12-10](https://blog.duolingo.com/product-highlights/)、[CS19 · 2021-09-24](https://blog.duolingo.com/duolingo-difficult-exercises/) |
| Match Madness / Side Quest | timed_activity_containers | 在匹配或常规题上加计时与挑战规则；Match Madness原子操作仍为词语配对。 [CS24 · 2025-12-16](https://blog.duolingo.com/ways-to-practice-in-duolingo/) |
| Placement / test out / 历史 Checkpoint | assessment_container | 入门定位、跳级、单元测验的用途不同；历史Checkpoint还有开放写作。 [CS17 · 2018-09-14](https://blog.duolingo.com/partial-credit-improvements-to-duolingos-placement-test/)、[CS26 · 2021](https://research.duolingo.com/papers/portnoff.edm21.pdf) |
| Guidebook / Smart Tips / Explain My Answer | instruction_and_feedback_support | 解释与提示不是独立答题形式；若解释后带练习，练习按实际输入/输出另归类。 [CS15 · 2021-01-29](https://blog.duolingo.com/tips-for-learning-spanish-on-duolingo/)、[CS21 · 2021-10-15](https://blog.duolingo.com/duolingo-grammar-skills-improvements-2021/)、[CS11 · 2026-02-18](https://blog.duolingo.com/guide-to-duolingo-practice-hub/) |
| 角色、心/能量、进度、XP、连胜、结算 | presentation_progress_feedback | 外观、限制、奖励与反馈状态，不计为语言题型。 [CS01 · 2024-12-02](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)、[CS18 · 2025-12-10](https://blog.duolingo.com/product-highlights/) |

## 图片核验台账

`完整`表示已目视确认顶部进度与底部操作区，包含未作答/已选择等正常界面状态；它不是“该账号今天实机可用”的断言。所有图片均来自官方网页嵌图，未生成或重画 Duolingo UI。论文图来自官方研究站点。

| 媒体 | 内容 | 分辨率 | 核验结果 | 原图 / 原页 |
|---|---|---|---|---|
| CM01 | 论文第2页 Figure 2；左上图片单选、右上键入翻译、下方双向词块翻译。 | 见源文件 | 完整；论文拼图低分辨率；论文拼图，题屏完整但显示尺寸小；不是独立原图下载地址。 | [原图/论文](https://research.duolingo.com/papers/portnoff.edm21.pdf#page=2)；[CS26 · 2021](https://research.duolingo.com/papers/portnoff.edm21.pdf) |
| CM02 | 语境中的词义三选一。 | 1170 × 2532 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2024/03/table1_image1.PNG)；[CS12 · 2024-04-02](https://blog.duolingo.com/right-level-of-difficulty/) |
| CM03 | 双语词语两列配对。 | 752 × 1624 | 完整 | [原图/论文](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+2.png)；[CS03 · 2025-02-10](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) |
| CM04 | 图片和母语词提示，键入目标语词。 | 2160 × 4342 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-vocabulary.png)；[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) |
| CM05 | 图片词汇翻译，同时选择冠词并填写名词。 | 750 × 1624 | 完整 | [原图/论文](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/6-exerciseTypes.png)；[CS01 · 2024-12-02](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) |
| CM06 | 整句翻译的词块输入模式。 | 2160 × 4342 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_word-bank.png)；[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) |
| CM07 | 同句翻译的自由输入模式，兼有语音输入按钮。 | 2160 × 4342 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_type-answer.png)；[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) |
| CM08 | 母语整句加目标语部分译文，补缺词。 | 2160 × 4342 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_fill-in-the-blank.png)；[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) |
| CM09 | 全目标语句子语境选缺词。 | 750 × 1624 | 完整 | [原图/论文](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+1.png)；[CS03 · 2025-02-10](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) |
| CM10 | 图像场景辅助单语句子填空；已选答案状态。 | 375 × 667 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/04/Blog_Monolingual-Challenges_1.png)；[CS06 · 2021-04-27](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/) |
| CM11 | 两个相邻语境的对比双空。 | 375 × 667 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-5.png)；[CS07 · 2020-10-02](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) |
| CM12 | 词干已给，点选正确词尾。 | 375 × 667 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-7.png)；[CS07 · 2020-10-02](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) |
| CM13 | 词干已给，键入词尾。 | 375 × 667 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-8.png)；[CS07 · 2020-10-02](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) |
| CM14 | 代词和动词词尾表格补全。 | 375 × 667 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/GS-Blog-4.png)；[CS07 · 2020-10-02](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) |
| CM15 | 听句子后按顺序点词块，含正常/慢速播放。 | 1080 × 2400 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Practice-tab-3.jpg)；[CS04 · 2026-05-05](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) |
| CM17 | 音频和部分句子提示，键入缺词。 | 1080 × 2400 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-3.jpg)；[CS04 · 2026-05-05](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) |
| CM18 | 两个声音选项，选出句中缺词。 | 1080 × 2400 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-2.jpg)；[CS04 · 2026-05-05](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) |
| CM19 | 声音按钮与书面词语配对。 | 1080 × 2400 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/04/Listening-exercise-1.jpg)；[CS04 · 2026-05-05](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) |
| CM20 | 阅读目标语段落并选择符合意义的答案。 | 750 × 1624 | 完整 | [原图/论文](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+Duolingo+teaches+reading+skills/image+3.png)；[CS03 · 2025-02-10](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) |
| CM21 | 听后理解题；本图的两个答案选项也是音频。 | 758 × 1632 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/listening.png)；[CS11 · 2026-02-18](https://blog.duolingo.com/guide-to-duolingo-practice-hub/) |
| CM22 | 对话下一句二选一；葡语界面、英语内容。 | 1080 × 2400 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/12/EN-PT_2.png)；[CS16 · 2023-01-02](https://blog.duolingo.com/why-learn-english/) |
| CM23 | 理解问题后，说出三个候选回答中的正确一句。 | 750 × 1624 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image2.png)；[CS05 · 2026-02-09](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/) |
| CM24 | 照给定句子开口朗读。 | 752 × 1624 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image1.png)；[CS05 · 2026-02-09](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/) |
| CM25 | 两个角色的对话，复述已给定的回应。 | 750 × 1624 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking_image3.png)；[CS05 · 2026-02-09](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/) |
| CM27 | 单词卡片主动回忆；底部是麦克风、跳过和无法说话入口。 | 2160 × 4342 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/06/Writing-practice_flashcards.png)；[CS02 · 2026-07-02](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/)、[CS10 · 2025-11-18](https://blog.duolingo.com/duolingo-flashcards/) |
| CM28 | 声音近似词二选一，已选答案状态。 | 1170 × 2532 | 完整 | [原图/论文](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3253.PNG)；[CS09 · 2024-11-20](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| CM29 | 两段声音判断同一词/不同词。 | 1170 × 2532 | 完整 | [原图/论文](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3254.PNG)；[CS09 · 2024-11-20](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| CM30 | 四个音频与四个近音词配对。 | 1170 × 2532 | 完整 | [原图/论文](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3256.PNG)；[CS09 · 2024-11-20](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| CM31 | 角色居中版本的跟读界面。 | 758 × 1632 | 完整 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/02/speaking.png)；[CS11 · 2026-02-18](https://blog.duolingo.com/guide-to-duolingo-practice-hub/) |
| CM32 | 同一语句生成部分翻译、词块组句与缺词选音的三屏拼图。 | 919 × 544 | 完整；三屏均含顶部和底部，单屏显示尺寸较小。 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/09/3-Exercises--1-.png)；[CS08 · 2022-09-14](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/) |
| CM16 | 整句自由听写；大文本框、双速音频、无法听音入口、Check。 | 见源文件 | 完整；由主代理核验；2020 历史界面；不要宣称为2026现行截图。 | [原图/论文](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/10/Listening_2_No-text.png)；[CS04 · 2026-05-05](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) |

S3 原图 URL 中的 `+` 按官方 HTML 原样保留。本轮观察到，部分链接经 web 工具转成 `%2B` 后返回 403，而原始 `+` URL 可正常读取。不要把编码变化造成的失败误报为原图不存在。

## 尚未证实与交接

- C31历史Checkpoint开放写作没有完整官方UI，当前保留情况未确认。
- 本分册未验证未公开A/B测试、所有课程语对、地区和平台的实时可用矩阵。
- 老式多选正确译文、独立同义词选择、纯纠错等社区称呼未找到足够一手证据，本分册不把它们冒充已确认当前题。
- C16 整句听写已由主代理补齐 2020 官方完整历史图；记录在主报告的 assets-extra.json。本分册保留历史标签，未声称为 2026 新界面。
- Story 内的点词释义、排序、真假判断、简答/总结；DuoRadio 的听词多选、图像理解；Adventures 场景操作；Max Roleplay/Video Call；字符描写/拼装等，由对应分册汇总，以免漏项或重复计数。

## 来源登记

日期取公开 HTML 的 `datePublished`/`article:published_time`；修改日期不解释为功能发布日期。旧文即使 2026 修改，涉及当年发布的正文仍按历史证据处理。

| 来源 | 标题 | 发表日期 | 最后修改元数据 | 类型 |
|---|---|---|---|---|
| CS01 | [Duolingo 101: How to learn a language on Duolingo](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) | 2024-12-02 | 2026-02-11 | official_blog |
| CS02 | [How Duolingo teaches writing skills](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/) | 2026-07-02 | 2026-07-02 | official_blog |
| CS03 | [How Duolingo teaches reading skills](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) | 2025-02-10 | 2026-07-03 | official_blog |
| CS04 | [Listening Practice in Another Language: Tips from Duolingo](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) | 2026-05-05 | 2026-05-05 | official_blog |
| CS05 | [How Duolingo teaches speaking skills](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/) | 2026-02-09 | 2026-09-09 | official_blog |
| CS06 | [New immersion exercises maximize your language learning](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/) | 2021-04-27 | 2026-03-26 | official_blog |
| CS07 | [Language rules: Learning grammar on Duolingo](https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/) | 2020-10-02 | 2026-01-01 | official_blog |
| CS08 | [At Duolingo, humans and AI work together to create a high-quality learning experience](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/) | 2022-09-14 | 2024-12-04 | official_blog |
| CS09 | [How to practice English pronunciation on Duolingo](https://blog.duolingo.com/duolingo-english-sounds-tab/) | 2024-11-20 | 2026-03-25 | official_blog |
| CS10 | [Strengthen your memory with new Duolingo Flashcards](https://blog.duolingo.com/duolingo-flashcards/) | 2025-11-18 | 2026-01-21 | official_blog |
| CS11 | [Practice any skill, any time in the Practice tab](https://blog.duolingo.com/guide-to-duolingo-practice-hub/) | 2026-02-18 | 2026-04-17 | official_blog |
| CS12 | [Dear Duolingo: What’s the right level of difficulty?](https://blog.duolingo.com/right-level-of-difficulty/) | 2024-04-02 | 2026-08-07 | official_blog |
| CS13 | [Improving how Duolingo teaches Chinese—and other languages!](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) | 2020-02-03 | 2026-09-18 | official_blog |
| CS14 | [The sneaky speaking practice you’re probably not doing](https://blog.duolingo.com/sneaky-pronunciation-practice/) | 2023-06-28 | 2026-05-04 | official_blog |
| CS15 | [How To Learn Spanish on Duolingo](https://blog.duolingo.com/tips-for-learning-spanish-on-duolingo/) | 2021-01-29 | 2026-08-10 | official_blog |
| CS16 | [How to get started learning English](https://blog.duolingo.com/why-learn-english/) | 2023-01-02 | 2026-05-18 | official_blog |
| CS17 | [Partial credit: improvements to Duolingo’s placement test](https://blog.duolingo.com/partial-credit-improvements-to-duolingos-placement-test/) | 2018-09-14 | 2026-05-20 | official_blog |
| CS18 | [2025 Duolingo Highlights: our biggest leaps in learning, play, and connection](https://blog.duolingo.com/product-highlights/) | 2025-12-10 | 2026-04-22 | official_blog |
| CS19 | [How lesson transparency helps learners reach their goals](https://blog.duolingo.com/duolingo-difficult-exercises/) | 2021-09-24 | 2026-03-30 | official_blog |
| CS20 | [Is Google Translate Wrong? 8 Things You Need to Know](https://blog.duolingo.com/is-google-translate-wrong/) | 2025-08-19 | 2025-08-24 | official_blog |
| CS21 | [All of the ways Duolingo improved its grammar skills this year](https://blog.duolingo.com/duolingo-grammar-skills-improvements-2021/) | 2021-10-15 | 2026-09-22 | official_blog |
| CS22 | [How do I practice all of the grammar rules in my new language?](https://blog.duolingo.com/grammar-practice-tips/) | 2022-05-17 | 2026-09-22 | official_blog |
| CS23 | [Introducing the new Duolingo learning path](https://blog.duolingo.com/new-duolingo-home-screen-design/) | 2022-05-06 | 2025-06-13 | official_blog |
| CS24 | [7 ways you can switch up your practice in the app right now](https://blog.duolingo.com/ways-to-practice-in-duolingo/) | 2025-12-16 | 2026-09-23 | official_blog |
| CS25 | [How we’ve improved the Duolingo learning experience this year (and a sneak peek toward 2020!)](https://blog.duolingo.com/how-weve-improved-the-duolingo-learning-experience-this-year-and-a-sneak-peek-toward-2020/) | 2019-12-11 | 2024-12-20 | official_blog |
| CS26 | [Methods for Language Learning Assessment at Scale: Duolingo Case Study](https://research.duolingo.com/papers/portnoff.edm21.pdf) | 2021 | 未核得 | official_research_paper |
