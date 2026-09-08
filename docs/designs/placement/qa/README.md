# 跳级页面实际验收

2026-09-08 · 本地候选版本 · 独立 Chromium 配置

## 当前真实浏览器证据

通过产品的正常按钮与输入框完成一次 20 题测试，其中 19 题答对、1 题答错；刷新后题序、已判结果与草稿保持一致。通过后仅解锁路线，真实完成与听读记录没有被伪造。回到跳过的单词关，播放第一张词卡，收到真实音频结束后计数增加。

另一次测试连续答错 5 题，立即结束且不开放目的地；重试说明恢复五颗心。手机、窄屏与桌面关键状态已逐张查看，控制台未见错误。完整交互记录见 [native-browser-proof.json](native-browser-proof.json)。

| 画面 | 核对重点 |
| --- | --- |
| [目录到跳级入口](placement-jump-entry-420.png) | 气泡与按钮完整显示，行距不变，双箭头居中 |
| [开始说明](placement-intro-420.png) | 目标 Lesson、20 题、5 错失败、开始与下次再说 |
| [整句输入](placement-watch-sentence-420.png) | 手表问句明确显示“翻译这句话”，输入区可读 |
| [错误反馈](placement-wrong-420.png) | 扣一颗心、参考答案、手动继续 |
| [成功](placement-passed-420.png) | 20 题完成后解锁目的地，返回路线 |
| [跳过节点再学习](placement-skipped-preview-420.png) | 状态标记不被介绍弹层遮挡，仍可完整学习 |
| [第 5 错失败](placement-failed-420.png) | 零颗心、进度不变、重试与回路线 |
| [重试说明](placement-retry-intro-420.png) | 新一轮显示五颗心 |
| [最远分区](placement-wide-intro-906.png) | Lesson 143 & 144，范围只到 Lesson 142 |
| [320px 窄屏](placement-wide-question-320.png) | 输入与底部按钮完整可见 |

## 范围说明

以上是实际页面及交互验收，不是每一道题的人工教育评审，也不声称逐一试听了原有全部音频。全课程自动矩阵与发布门禁的最终计数另见 [verification.json](verification.json) 和 [根验收记录](../../../../design-qa.md)。此目录保留发布前验收快照；正式发布及线上复核另行记录。
