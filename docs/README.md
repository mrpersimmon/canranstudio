# Duolingo 重构版文档

本目录只保留猫猫课程重构所需的资料与证据。

- [首要设计原则：以 Duolingo 为基准](design-principles.md)：所有题型、UI、交互和动效设计的必读入口；拿不准时先核对实际产品。

- [页面可读性防护网与回归规则](designs/readability-guard/README.md)：主题切换、文字和图片、按钮遮挡、发布拦截。
- [2026-09-09 评审修复与验证](designs/review-repair-20260909/README.md)：历史契约、记录恢复、公平判题、语法试点、输入与地图性能、离线重开，以及全册待补齐范围。
- [前 50 课实施与验收](designs/lesson1-50/README.md)：25 个教材分区、129 关、课程覆盖、美术与音频出处、扩课修复记录。
- [完整第一册 Lesson 1–144](designs/lesson1-144/README.md)：72 个分区、354 关、完整课文、正常语速录音、选做挑战、历史记录兼容与加载扩容。
- [前六课基线设计与实现边界](designs/lesson1-6-path-v4/implementation.md)：前六课的 11 个节点、题目公平性、手动语音、进度与复习规则。
- [用户提供的题型及学习活动材料](references/duolingo/2026-09-05/用户提供-题型与学习活动汇总.txt)与[人机交互及 UI 材料](references/duolingo/2026-09-05/用户提供-人机交互与UI设计理念.md)：保留原内容，作为参考材料。
- [来源核对与落地规则](references/duolingo/2026-09-05/人机交互与UI-来源核对及落地规则.md)：区分官方来源、分析归纳与本课程决定。
- [V4 页面验收](designs/lesson1-6-path-v4/design-qa.md)：原实现完整通关与不同屏幕下的浏览器记录，截图保存在相邻 `qa/` 目录。历史通过数量和当时状态不代表本分支的新检查。
- [V4 单首页发布记录](designs/lesson1-6-path-v4/publication.md)：2026-09-06 的线上切换及证据。
- [本次独立分支整理](designs/lesson1-6-path-v4/branch-isolation.md)：当前目录范围、独立构建、内容一致性和检查结果。

旧网站、V2 课程、无关设计体系和过期操作手册不在此工作树中。它们仍可从原分支与 Git 历史查阅。
