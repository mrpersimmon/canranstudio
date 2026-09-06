# 当前版本验收 · 本次进度与可选输入挑战

2026-09-06 · `codex/duolingo-version`

final result: passed

本地实现和验收完成，预览：http://127.0.0.1:42817/ 。业务代码已提交并推送为 101fcb6；首次远端检查发现测试动作等待竞态，修复后本地完整 1,757 个状态重新通过。官网发布状态以本次发布记录为准。

- 顶部条只统计本次闯关，完成页保持 100%；路线总数只在路线/记录页出现。定位箭头的实际横纵中心偏差均为 0。
- 增加四组可选输入挑战，共 24 题，包含中文到英文整句输入和句内填词；草稿可恢复，提示/错后修改证据独立记录，不改变主线进度。
- “记录 → 重新开始”可只重置输入挑战或全部从零开始；也能单独重置某组。确认、取消、失败重试、刷新与撤销均已验证。

76 项程序检查、四种视口的 1,757 个浏览器渲染状态及十类故障注入通过。独立正式预览使用真实存储与原始音频走完第一关，并完成输入、刷新恢复、重置与撤销；控制台无错误和警告。

- [原因、漏检与防护记录](docs/designs/session-progress-and-challenges/README.md)
- [完整验收、证据及范围](docs/designs/session-progress-and-challenges/design-qa.md)
- [输入界面](docs/designs/session-progress-and-challenges/qa/native-translation-desktop.png)
- [完成页 100%](docs/designs/session-progress-and-challenges/qa/native-complete-100.png)
- [Duolingo 参考与本课程决策](docs/references/duolingo/2026-09-06/optional-input-challenges.md)

历史验收：[完成页返回与词汇美术](docs/designs/completion-return-and-vocabulary-art/design-qa.md)、[Lesson 分区与交互修复](docs/designs/lesson-sections-and-interaction-fixes/design-qa.md)、[统一深色](docs/designs/unified-dark/design-qa.md)。用户体验验收和部署状态独立记录。
