# Duolingo 文字系统、音素练习与视觉设计一手证据

核对日期：2026-09-27。仅研究主应用语言课程；排除独立 ABC、Math、Music、Chess 和 English Test。没有登录真实账户走题，也没有改业务代码或执行 Git。

日期采用官方页面 `datePublished`，另记录 `dateModified`。修改元数据不代表功能或旧截图在该日更新。以下“存在”指官方已公开展示，不代表每个母语课程、设备、实验组或套餐都可见。

## 可复用的结论与边界

官方已直接展示：假名描写、按罗马音选假名、看假名选读音、假名补缺笔画、日语汉字部件拼合、中文汉字选拼音/拼音配对、韩文音节拼合、阿拉伯描写、印地语选字，以及英语音素对比的三类练习。各对象保留独立行，不能把所有选择/拼合合并成一张通用题型图。

中文专用汉字手写/笔顺等尚缺本次一手证据。日语旧文的“将推出形近字对比”不计作已实现。2023 与 2026 日语章节描述不同，章节编号只能作为对应日期的例子。[S01](https://blog.duolingo.com/learning-to-read-japanese-characters/)、[S04](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/)、[S07](https://blog.duolingo.com/japanese-writing-systems/)

## 文字与音素交互清单

| ID | 语言/对象 | 实际操作 | 截图 | 证据与范围 |
|---|---|---|---|---|
| L01 | 日语／平假名：描写 | 按提示路径描写字形。 | [A01 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/hiragana_tracing.PNG) | 2023 官方实例；2026 文章继续说明可在屏幕书写。 2023 明示英→日 iOS/Android；中文用户有假名页。 [S01](https://blog.duolingo.com/learning-to-read-japanese-characters/) |
| L02 | 日语／片假名：描写/字音训练 | 进入片假名专页学习；官方确认描写、拼写与阅读。 | [A09 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/07/katakana-practice-tab.png) | 交互有文字证据；没有独立片假名题面。 2023 明示英→日 iOS/Android；中文用户有假名页。 [S01](https://blog.duolingo.com/learning-to-read-japanese-characters/)、[S07](https://blog.duolingo.com/japanese-writing-systems/) |
| L03 | 日语／平假名组合：按罗马音选字符 | 阅读 shisu，从四张组合卡中选择。 | [A02 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/hiragana_sound.PNG) | 官方完整应用界面，2023。 同 L01。 [S01](https://blog.duolingo.com/learning-to-read-japanese-characters/) |
| L04 | 日语／平假名：看字符选读音 | 可点击字音卡，选择一个罗马音答案。 | [A03 原图](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/12-characterBingo2.png) | 2025 文章，2026 修改；图像直接证实。 截图呈 iOS；文章未完整列跨端覆盖。 [S06](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) |
| L05 | 日语／平假名：补缺笔画 | 在指定位置画出缺少的一笔。 | [A05 原图](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/14-characterBingo.png) | 官方完整设备界面；对象是あ。 截图呈 iOS；其余端未确定。 [S06](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) |
| L06 | 日语／假名：配对/拼写 | 完成字音配对、拼写练习。 | 未找到独立完整图 | 官方文字确认；未找到对应完整题面，不推断输入控件。 沿用来源的日语课程范围。 [S01](https://blog.duolingo.com/learning-to-read-japanese-characters/) |
| L07 | 日语／汉字：描写与无引导手写 | 描写或徒手书写汉字；范字是否隐藏未核验。 | [A06 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/scaffolded_trace_small.gif) | 官方文字确认 tracing/freehand；动图边界未核验。 2023 英→日 iOS/Android；当时 Web 尚称未来。 [S01](https://blog.duolingo.com/learning-to-read-japanese-characters/) |
| L08 | 日语／汉字部件：构字拼合 | 把部件放入目标布局，组成词中汉字。 | [A04 原图](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/13-characterBingo.png)、[A07 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/puzzle_output-1.gif) | 画字完整设备图已核验；GIF 未核验。 完整图呈 iOS；不据此推断所有平台。 [S06](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/)、[S01](https://blog.duolingo.com/learning-to-read-japanese-characters/) |
| L09 | 日语／三种文字：文字目录与进度（非题型） | 选择文字页、学习字符；汉字按课程单元组织。 | [A08 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/07/hiragana-practice-tab.png)、[A09 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/07/katakana-practice-tab.png)、[A10 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/07/kanji-practice-tab.png) | 2026 官方文章；章节位置只视为该图实例。 本文未给完整端和母语课矩阵。 [S07](https://blog.duolingo.com/japanese-writing-systems/) |
| L10 | 中文／汉字/拼音：看字选择拼音 | 点击字音，选择带声调的拼音。 | [A11 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/02/char_intro.jpg) | 2020 Android 工程文章的历史实例。 Android 文脉；当前平台/账户未实测。 [S04](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) |
| L11 | 中文／汉字/拼音：字音配对 | 在混排小卡中配对汉字/词与拼音。 | [A12 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/02/character_match.jpg) | 2020 历史界面，不等于 2026 固定布局。 Android 文脉；当前平台/账户未实测。 [S04](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) |
| L12 | 中文／简体汉字：拼音辅助阅读（支架） | 读取汉字上方拼音，再用词块作答。 | [A13 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2024/08/img1_ZH_EN-1.jpg)、[A14 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/02/pinyin_grading_ribbon.jpg) | 2024 全屏图；判题区拼音另有2020证据。 A13 为 iOS 风格；截图有无限心，非订阅专属证明。 [S05](https://blog.duolingo.com/chinese-languages/)、[S04](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) |
| L13 | 韩语／韩文音节块：拼合音节 | 按 han 的声音，把字母放进音节块。 | [A15 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Korean-3-1.png) | 2021 官方实例；现代文章仍引用文字学习工具。 英语界面移动端；未给完整课程/端矩阵。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| L14 | 阿拉伯语／字母及位置字形：描写 | 从蓝色起点沿路径描写字形。 | [A16 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Arabic-2-1.png) | 2021 官方图；文本还确认不同位置字形教学。 英语界面移动端；未给完整课程/端矩阵。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| L15 | 印地语／天城文：按转写选字符 | 按 ka 提示在四张字形卡中选择。 | [A17 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/04/image--2-.png) | 文章2021，图片路径2022；实际图为2×2。 英语界面移动端；未给完整课程/端矩阵。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| L16 | 俄语／西里尔字母：字母/发音目录 | 学习字母与读音。 | [A18 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Russian--1-.png) | 仅目录和文字证据；未证实具体题面。 母语课程与平台未完整列出。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| L17 | 乌克兰语／西里尔字母：字母/发音目录 | 学习字母与读音。 | [A19 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Ukrainian--1-.png) | 仅目录和文字证据。 母语课程与平台未完整列出。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| L18 | 希腊语／希腊字母：字母/发音目录 | 学习字母与读音。 | [A20 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Greek-1.png) | 仅目录和文字证据。 母语课程与平台未完整列出。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| L19 | 希伯来语／希伯来文字：字符学习目录 | 进入字符学习。 | [A23 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/10/image--13-.png) | 仅目录和文字证据，不自动推定描写。 母语课程与平台未完整列出。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| L20 | 意第绪语／希伯来文字变体：字符学习目录 | 进入字符学习。 | [A24 原图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/10/image--14-.png) | 仅目录和文字证据，不自动推定描写。 母语课程与平台未完整列出。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| L21 | 英语／音素：发音图表（非题型） | 点音素卡试听，再进入成对音素练习。 | [A25 原图](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3251.PNG)、[A26 原图](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3252.PNG) | 2024 文章，2026 修改。 截图呈 iOS；未完整列出母语课程/Android/Web。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| L22 | 英语／音素对比：听音辨词 | 播放声音，在 dock/deck 两词中选择。 | [A27 原图](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3253.PNG) | 完整设备截图直接证实。 同 L21。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| L23 | 英语／音素对比：同音/异音判断 | 听两段音频，判断是否同一个词。 | [A28 原图](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3254.PNG) | 题面完整；底部设备边界未确认。 同 L21。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| L24 | 英语／音素对比：听音配词 | 配对音频卡与文字卡。 | [A29 原图](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3256.PNG) | 四行双列；截图未显示底部操作区。 同 L21。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) |

套餐：这些来源没有把文字课/Sounds标为 Super 或 Max 专属；没有实测套餐覆盖，不能据此写“所有套餐所有课程都有”。A13 的无限心图标仅说明截图状态。

## 图片完整性与实际可见 UI

“完整应用视图”要求应用顶部与底部按钮/导航都可见；“完整设备屏幕”还包括系统栏。目录仅证明入口和信息结构，不能代替某道题的截图。官方合成图、动图、局部图单列。

| 图号与原始文件 | 视觉核对 | 边界 | 顶部 | 底部 | 关键区别 |
|---|---|---|---|---|---|
| [A01 平假名描写：す](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/hiragana_tracing.PNG) | 已看静态像素 | full_app_view_no_system_chrome | 退出、进度 | 继续按钮 | 字形浅灰；蓝色起笔点、虚线与箭头；十字定位线。 [S01](https://blog.duolingo.com/learning-to-read-japanese-characters/) |
| [A02 按 shisu 选择假名组合](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/hiragana_sound.PNG) | 已看静态像素 | full_app_view_no_system_chrome | 退出、进度 | 继续按钮 | 文件名带 sound，但题面是罗马字提示、四张双假名卡，不能标成看字选读音。 [S01](https://blog.duolingo.com/learning-to-read-japanese-characters/) |
| [A03 平假名あ：选择读音](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/12-characterBingo2.png) | 已看静态像素 | full_device_screen | 系统栏、退出、进度、心 | 暂时无法听音、继续、Home 条 | 大蓝字音卡；三条纵排读音选项。 [S06](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) |
| [A04 日语汉字部件拼合：画](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/13-characterBingo.png) | 已看静态像素 | full_device_screen | 系统栏、退出、进度、心 | 继续、Home 条 | 提示关联 painter；目标轮廓与两块部件。是日语汉字，不能因另一篇 alt 错写 Hangeul 而标成韩文。 [S06](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) |
| [A05 平假名あ：补缺笔画](https://s3.us-east-1.amazonaws.com/content.duolingo.com/Duolingo+101%3A+How+to+learn+a+language+on+Duolingo/14-characterBingo.png) | 已看静态像素 | full_device_screen | 系统栏、退出、进度、心 | 继续、Home 条 | 图中对象是平假名あ；不能标汉字补笔画。 [S06](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) |
| [A06 日语汉字渐进描写动图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/scaffolded_trace_small.gif) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 官方文章直接嵌入；本次动图读取超时，不能算完整 UI 或已观看演示。 [S01](https://blog.duolingo.com/learning-to-read-japanese-characters/) |
| [A07 日语汉字部件拼合动图](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/09/puzzle_output-1.gif) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 官方文章直接嵌入；HEAD 200，约 991 KB；未完成帧检查。 [S01](https://blog.duolingo.com/learning-to-read-japanese-characters/) |
| [A08 2026 平假名页](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/07/hiragana-practice-tab.png) | 已看静态像素 | full_app_view_no_system_chrome | 三文字页签 | 底部导航 | 五列字符格，灰色进度槽局部黄色，蓝色学习按钮；内容可滚动。 [S07](https://blog.duolingo.com/japanese-writing-systems/) |
| [A09 2026 片假名页](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/07/katakana-practice-tab.png) | 未完成像素/帧核验 | unverified | 官方 alt 描述页签 | 未核验 | 已核验文章内原始 URL；尚未逐像素检查边界。 [S07](https://blog.duolingo.com/japanese-writing-systems/) |
| [A10 2026 汉字页](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/07/kanji-practice-tab.png) | 已看静态像素 | full_app_view_no_system_chrome | 三文字页签 | 底部导航 | 按 Section/Unit 分组，带字格进度；图示私/日/本在 Section 2 Unit 1。 [S07](https://blog.duolingo.com/japanese-writing-systems/) |
| [A11 汉字选择拼音：功](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/02/char_intro.jpg) | 已看静态像素 | full_app_view_no_system_chrome | 退出、进度 | 检查按钮 | 蓝色功字音频卡，底部三张带声调拼音选项。2020 年界面。 [S04](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) |
| [A12 汉字与拼音配对](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/02/character_match.jpg) | 已看静态像素 | full_app_view_no_system_chrome | 退出、进度 | 检查按钮 | 汉字/词与拼音混排成两行小卡，不是左右双列布局。2020 年界面。 [S04](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) |
| [A13 中文句子带拼音支架](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2024/08/img1_ZH_EN-1.jpg) | 已看静态像素 | full_device_screen | 系统栏、设置、进度、无限心 | 检查、Home 条 | 简体中文句子上方灰色拼音；下方英文词块翻译；截图显示订阅风格，不能用以证明此题型仅订阅可用。 [S05](https://blog.duolingo.com/chinese-languages/) |
| [A14 中文判题区中的拼音](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2020/02/pinyin_grading_ribbon.jpg) | 未完成像素/帧核验 | unverified | 未核验 | 官方 alt 指判题反馈条 | 官方原始链接已提取；像素读取失败。 [S04](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) |
| [A15 韩文音节拼合：한](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Korean-3-1.png) | 已看静态像素 | full_app_view_no_system_chrome | 退出、进度 | 检查按钮 | han 音频；ㅎ、ㅏ 已在上方，ㄴ 待放入底部蓝色目标；音节块布局。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| [A16 阿拉伯字母描写：ت](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Arabic-2-1.png) | 已看静态像素 | full_app_view_no_system_chrome | 退出、进度 | 检查按钮 | 字音按钮、灰色字形与十字线；蓝色路径由右向左弯行。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| [A17 印地语按 ka 选字符](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/04/image--2-.png) | 已看静态像素 | full_app_view_no_system_chrome | 退出、进度 | 检查按钮 | 2×2 四张大字形卡；官方 alt 把四选项误写成 4×4，按像素采用 2×2。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| [A18 俄语字母表](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Russian--1-.png) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 文章确有此图；未把目录图当作具体练习题截图。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| [A19 乌克兰语字母表](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Ukrainian--1-.png) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 文章确有此图；未把目录图当作具体练习题截图。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| [A20 希腊语字母表](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Greek-1.png) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 文章确有此图；未把目录图当作具体练习题截图。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| [A21 韩文字母表](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Korean.png) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 文章确有此图；未把目录图当作具体练习题截图。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| [A22 阿拉伯字母表](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/07/Arabic.png) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 文章确有此图；未把目录图当作具体练习题截图。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| [A23 希伯来文字母表](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/10/image--13-.png) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 文章确有此图；未把目录图当作具体练习题截图。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| [A24 意第绪文字母表](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2021/10/image--14-.png) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 文章确有此图；未把目录图当作具体练习题截图。 [S02](https://blog.duolingo.com/learning-other-writing-systems/) |
| [A25 英文元音总览](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3251.PNG) | 已看静态像素 | full_device_screen | 系统栏、标题与开始按钮 | 底部导航、Home 条 | 三列音素卡，每卡有音标、例词与进度槽；入口是嘴形图标。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| [A26 英文辅音总览（滚动后）](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3252.PNG) | 已看静态像素 | full_device_screen_scrolled | 系统栏与开始按钮，主标题已滚走 | 底部导航、Home 条 | 延续三列音素卡；不能因滚动隐藏标题而称文件裁切。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| [A27 听音选词：dock/deck](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3253.PNG) | 已看静态像素 | full_device_screen | 系统栏、退出、进度 | 检查、Home 条 | 已选 dock 为浅蓝底蓝边；检查按钮为绿色。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| [A28 判断两个词相同或不同](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3254.PNG) | 已看静态像素 | portrait_capture_footer_boundary_uncertain | 系统栏、退出、进度 | 继续按钮可见；未见 Home 条 | 两个独立音频按钮，上下排列；二选一答案。保守不计入完整设备屏幕。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| [A29 音频与英语词配对](https://s3.us-east-1.amazonaws.com/content.duolingo.com/How+to+practice+English+pronunciation+on+Duolingo/IMG_3256.PNG) | 已看静态像素 | portrait_capture_without_footer | 系统栏、退出、进度 | 未见底部操作或 Home 条 | 四行两列；左侧波形音频，右侧 dock/got/deck/get。不假定缺少按钮就是原产品规则。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) |
| [A30 2026 核心页签刷新总览](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/01/1.-Caption.-Refreshed-bottom-tabs.png) | 未完成像素/帧核验 | official_ui_montage_unverified_bounds | 官方 alt 说明六个界面 | 官方 alt 说明底部导航 | 原图 HEAD 200、2000×2673（HTML）；是官方组合图，非单张设备截图；像素读取失败。 [S08](https://blog.duolingo.com/core-tabs-redesign/) |
| [A31 2026 设置中的反馈和听力开关](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2026/01/Screenshot-listening-exercises-toggle-on.png) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 官方 alt 可证声效、触觉、动画、激励文案、听力等开关；HTML 显示 275×275 尺寸不足以判断原图裁切。 [S11](https://blog.duolingo.com/learning-with-hearing-aids/) |
| [A32 角色答对反馈演示](https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2022/02/junior_correct_vidmock2.gif) | 未完成像素/帧核验 | unverified | 未核验 | 未核验 | 官方文章中的 Junior 答对庆祝 GIF；未逐帧检查。 [S10](https://blog.duolingo.com/building-character/) |
| [A33 日语文字教学官方嵌入视频](https://www.youtube.com/watch?v=jZQ2zK2aROo) | 未完成像素/帧核验 | video_not_watched | 未核验 | 未核验 | 官方文章嵌入的 YouTube 链接；视频抓取受限，未核验上传日期或时间戳，不充当逐题截图。 [S01](https://blog.duolingo.com/learning-to-read-japanese-characters/) |
| [A34 Duocon 角色动画演讲官方嵌入视频](https://www.youtube.com/watch?v=fgOqvyPif3g) | 未完成像素/帧核验 | video_not_watched | 未核验 | 未核验 | 来源文章称为 2023 Duocon talk；未观看和定位时间戳。 [S14](https://blog.duolingo.com/world-character-visemes/) |

## 视觉设计：官方原则与从实图观察到的规则

| 主题 | 结论 | 证据性质 |
|---|---|---|
| 颜色与按钮 | 实图显示白底深灰文字、蓝色音频/选中态、绿色检查/进度、灰色未就绪按钮；圆角与下沿厚度使卡片可操作性清楚。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/)、[S06](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) | visual_observation_not_token_spec |
| 新版信息层级 | 2026 刷新采用按用途分级的页头、固定标题位置、较少字号样式、以留白分组；文章发布时 iOS 已上线、Android 尚待推出。 [S08](https://blog.duolingo.com/core-tabs-redesign/) | official_statement |
| 字体边界 | 旧官方索引把 Feather Bold 用于短标题、DIN Next Rounded 用于正文，并提供 Nunito 替代；实时规范页已重定向，不能证明2026全端字体或中文字体。 [S15](https://design.duolingo.com/identity/typography) | historical_official_index |
| 插图可读性 | 官方强调简化形状、清晰轮廓与留白，控制细节以免视觉误导答题；2020 文章描述2018形成的圆润明亮风格。 [S09](https://blog.duolingo.com/shape-language-duolingos-art-style/) | official_design_rationale_historical |
| 角色与反馈 | 角色在练习中说句子、随答题结果反应；官方记录答对动画和连对激励。口型与音频同步，结束作答时停止说话。 [S10](https://blog.duolingo.com/building-character/)、[S14](https://blog.duolingo.com/world-character-visemes/) | official_implementation_description |
| 可达性与控制 | 2026 官方支持重播、慢速、暂时跳过听力、显示听说题文本、关闭听力；设置图还列声效、触觉及动画开关。不能据此声称全面符合WCAG。 [S11](https://blog.duolingo.com/learning-with-hearing-aids/) | official_accessibility_features |
| 学习科学 | 官方方法包含互动练习、难度个性化、重要内容、持续动机与趣味；路径把复习和新内容编入进程。识字/音素课隔离单一难点，是降低同时处理负担的设计启示。 [S13](https://blog.duolingo.com/duolingo-teaching-method/)、[S12](https://blog.duolingo.com/new-duolingo-home-screen-design/)、[S01](https://blog.duolingo.com/learning-to-read-japanese-characters/)、[S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) | official_rationale_plus_labeled_inference |
| 动效边界 | 蓝色选中态、灰色未就绪态是已见静态证据；按下位移、触觉时序、过渡时长和错误反馈不能由这些截图推定。 [S03](https://blog.duolingo.com/duolingo-english-sounds-tab/) | research_limit |

迁移到其他课程时的推断：优先保留一次一项清晰操作、稳定的题目/作答/确认区域、可重复的声音入口、可见但不喧宾夺主的进度。字体、绿色品牌、角色造型和每项奖励不应被当成教学有效性的独立证明。此段是研究者推断，不是 Duolingo 官方实施要求。

## 未补齐的证据

- 未找到足以确认中文课程当前专用汉字描写、补笔画、笔顺排序或部件拼字的一手界面；不把日语汉字证据移植为中文事实。
- 日语2023文章把“对比形近汉字”称为将推出；本次没有找到后续明确落地证据。
- 日语2023文章称Web稍后上线；2026文章没有补齐Web/Android/iOS及各母语课完整矩阵。
- 片假名独立练习题面、假名拼写/配对具体控件、俄/乌/希/希伯来/意第绪的具体练习全屏仍缺。
- 带路径描写和补一笔不等于独立笔顺排序测试；未查证判分算法、容差、笔顺强制或错误重试。
- 主应用的英语Sounds是音素区分训练；本次没有主应用26字母逐笔描写或ABC式自然拼读全流程证据。
- 字体旧页与色板页实时重定向；未核验现行完整设计token、WCAG等级、键盘/读屏覆盖、暗色模式和减少动态效果的全端实现。
- 没有登录真实免费/Super/Max账户走题；官方图片可能早于文章修改时间，不能声称是2026-09-27全部用户界面。
- GIF与视频提供原始官方引用，但未完成帧/时间戳核验。只有visually_verified=true的静态图经过本次像素检查。
- 中文/日语 article 中对语言结构的概括没有作为教学事实复述；本研究仅据它们证明产品交互。

- 英语发音文章提及大声说，但本次三个具体题面都是听辨操作；未证实专用音素录音打分界面，不能把听辨题标成口语发音评分。

## 一手来源及日期

| 来源 | 首次发表 | 页面修改元数据 | 本次访问状态 |
|---|---|---|---|
| [S01 A new tool for learning to read Japanese on Duolingo](https://blog.duolingo.com/learning-to-read-japanese-characters/) | 2023-09-06 | 2025-01-12 | live_official_article |
| [S02 Tools for learning to read other writing systems](https://blog.duolingo.com/learning-other-writing-systems/) | 2021-07-22 | 2026-04-14 | live_official_article |
| [S03 How to practice English pronunciation on Duolingo](https://blog.duolingo.com/duolingo-english-sounds-tab/) | 2024-11-20 | 2026-03-25 | live_official_article |
| [S04 Improving how Duolingo teaches Chinese—and other languages!](https://blog.duolingo.com/improving-how-duolingo-teaches-chinese-and-other-languages/) | 2020-02-03 | 2026-09-18 | live_official_article |
| [S05 Dear Duolingo: What kind of Chinese does Duolingo teach?](https://blog.duolingo.com/chinese-languages/) | 2024-08-06 | 2026-06-23 | live_official_article |
| [S06 How Duolingo teaches reading skills](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/) | 2025-02-10 | 2026-07-03 | live_official_article |
| [S07 Dear Duolingo: Why does Japanese have three writing systems?](https://blog.duolingo.com/japanese-writing-systems/) | 2026-07-21 | 2026-08-19 | live_official_article |
| [S08 Elevating craft: How we refreshed our core tabs](https://blog.duolingo.com/core-tabs-redesign/) | 2026-02-04 | 2026-02-04 | live_official_article |
| [S09 Shape language: Duolingo’s art style](https://blog.duolingo.com/shape-language-duolingos-art-style/) | 2020-07-02 | 2026-05-19 | live_official_article |
| [S10 Building character: How a cast of characters can help you learn a language](https://blog.duolingo.com/building-character/) | 2020-11-10 | 2026-05-19 | live_official_article |
| [S11 Dear Duolingo: How can I learn a language as a hearing aid user?](https://blog.duolingo.com/learning-with-hearing-aids/) | 2026-01-20 | 2026-01-20 | live_official_article |
| [S12 Introducing the new Duolingo learning path](https://blog.duolingo.com/new-duolingo-home-screen-design/) | 2022-05-06 | 2025-06-13 | live_official_article |
| [S13 The Duolingo Method: 5 key principles that make learning fun and effective](https://blog.duolingo.com/duolingo-teaching-method/) | 2023-02-02 | 2026-04-01 | live_official_article |
| [S14 Lip syncing lessons: the next step in bringing our characters to life](https://blog.duolingo.com/world-character-visemes/) | 2022-11-10 | 2025-01-16 | live_official_article |
| [S15 Typography — Duolingo Brand Guidelines](https://design.duolingo.com/identity/typography) | 未注明 | 未注明 | historical_official_search_index_only；实时跳到 [官方设计博客](https://blog.duolingo.com/hub/design/) |
| [S16 Color — Duolingo Brand Guidelines](https://design.duolingo.com/identity/color) | 未注明 | 未注明 | redirect_no_palette_verified；实时跳到 [官方设计博客](https://blog.duolingo.com/hub/design/) |

## 实际验证与工作状态

- 新增：本研究 Markdown 与结构化 JSON；包含 24 条语言/文字对象交互记录、34 个官方图片/动图/视频索引。
- 已修复：仅研究归类纠错——shisu 图是选假名组合；painter 构字是日语汉字；补缺笔画图是平假名あ；印地语截图为 2×2。没有业务修复。
- 实际验证：官方页面、日期元数据和原始资源 URL；部分静态图片逐张目视；设计规范重定向已实时确认。
- 未完成：真实账户端到端验证、所有套餐/课程/平台矩阵、未标记图片与动图/视频完整性。
- 提交：未执行。推送：未执行。发布：未执行。
