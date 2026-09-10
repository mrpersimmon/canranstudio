# 无键盘输入题型：Duolingo 官方核对与儿童适配方案

查阅日期：2026-09-10。范围：Duolingo 官方博客公开资料；“公开展示”只证明该机制曾被官方说明或截图展示，不代表所有账号、语言课程、等级、平台同时具备。

## 核对结论

可以把线上主线改为全程点按：删除要求学习者键入文字的题型，以及“请输入／拼写／切换键盘／输入框占位／输入错误”等专属提示；原语言内容中的辨认、理解和受支持组织目标由配对、固定选项、词块和理解题承接。自主拼写、完整写作和无选项口头表达由线下承担，新旧成绩不等同。口语跟读可由线下教师组织，但口语评分和 AI 对话不列为上线前置条件。

## 官方已经公开展示的机制

- **图词／音文配对**：[Review Exercises](https://blog.duolingo.com/review-exercises-help-measure-learner-recall/) 以“把新词与图片匹配”为初级练习示例；[Listening Practice](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) 展示音频按钮与书面词语配对。可确认机制存在，不能据此推断每门课当前都有。
- **近音辨析**：[Human expertise and AI](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/) 公开举例：从两段相近录音中选出句内听到的词（如 *gusta/cuesta*）。这是官方示例，不是通用题库承诺。
- **Tap what you hear**：[Listening Practice](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/) 展示播放／慢速重播后点选文字块组成所听内容，并说明听力练习会由配有文字逐步过渡到不配文字。
- **词库组句**：[Human expertise and AI](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/) 说明用词库拼成目标句，干扰项可取自已教但易混词；这直接支持无键盘组句。
- **选词填空**：[Immersion exercises](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/) 展示从词库选择词补全情境句；[2025 product highlights](https://blog.duolingo.com/product-highlights/) 也展示图片情境、句中空缺和四个选项。
- **对话接续**：[Immersion exercises](https://blog.duolingo.com/new-immersion-exercises-maximize-your-language-learning/) 展示角色说一句、学习者从两个回应气泡中选择；[Adventures](https://blog.duolingo.com/adventures/) 也公开了情境中的二选一回应。
- **阅读／听力理解**：[Human expertise and AI](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/) 说明段落读／听后的问题由内容专家围绕学习目标编写；[Stories](https://blog.duolingo.com/duolingo-stories-the-journey-to-android/) 是可读可听、穿插理解题且长于常规课文的短故事；[DuoRadio](https://blog.duolingo.com/duoradio-listening-practice/) 是嵌入路径的短音频节目，公开展示音文配对、理解判断和“选出听到的词”。

## 本项目儿童适配建议（推断，不是 Duolingo 官方年级规范）

- **1–2 年级**：以图词、音图／音文配对为主；近音辨析只在对应词汇和声音已教后引入。每屏一个动作，图片先于抽象文字，音频可重播。线下用指物、动作模仿、实物卡和全班跟读完成输出。所有年级建议均以实际语言基础和操作能力为先。
- **3–4 年级**：加入 Tap what you hear、3–7 个词块组句、选词填空和两到三个回应的对话接续；线下用词卡重排、同伴轮读和替换关键词复演。
- **5–6 年级**：提高句长与干扰项质量，加入短段阅读／听力理解；线下做信息差问答、口头复述和小组情境表演，线上仍只点选，不依赖自动口语评分。

建议以同一单元语言目标串联：核心题型先教词句 → **Stories** 用人物叙事检查读听理解 → **DuoRadio** 用同一词句做纯听迁移 → **Adventures** 用点物、读标牌、选择回应完成情境任务。最后一段是本项目组合方案；官方分别说明了三种产品，没有公开规定它们必须按此顺序组合。线下课复用同一图片、音频、角色与目标句，承担开放表达，避免线上无键盘方案退化为只认不说。

## 落地与来源不足项

落地时应以 catalog 为唯一真源，先盘点全部输入型 stage 及其提示，再逐项映射到上述固定交互；页面只呈现并转发动作。验收应检查 catalog 不再产出输入型 stage、运行页不存在可编辑控件或键盘提示，并实际验证触控、重播、慢速音频、选项公平性和窄屏。

官方资料没有给出小学 1–6 年级的选项数量、句长阈值、线下课堂分工，也没有证明“三种沉浸模块组合”优于其他顺序；这些都需通过本项目课堂观察校准。2025 官方回顾只称 Stories 已扩到 100+ 课程、DuoRadio 进入 220+ 课程；Adventures 公告发布时只明确 iOS／Android 上“英语母语学法语”和“西语母语学英语”两个方向。因此不得写成全账号、全课程能力，实施前也应以本项目目标平台实测为准。
