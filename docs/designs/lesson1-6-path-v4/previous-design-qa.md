# Lesson 1–2 V3.6：选项可操作性验收

final result: passed

日期：2026-09-06。范围：本地联网预览的操作辨识、布局和交互状态。依据是用户报告的迟疑、两张实际截图和本轮真实浏览器走查。本结论表示下列可修复问题已完成修复与复验，不表示已经测得儿童发现按钮的耗时或学习效果。

## 发现、修改与复验

| 发现 | 修改 | 复验结果 |
| --- | --- | --- |
| P1：对话气泡与答案卡都像浅色白卡，难以区分可选内容。 | 气泡改为平面；答案统一淡蓝底、明确边界及厚底边。选择前空心标记、选择后实心标记，正确后才出现对勾与绿色。移除没有键盘功能的数字标记。 | 默认选项、键盘选择、检查前后和错答状态已实际触发；未选时检查禁用，选择后可检查，选中不提前判对。 |
| P1：猫猫由插画变成答案时缺少动作含义，且答案在对话之前。 | 交还题变为“对话→双猫答案→检查”。整张猫卡可点，动作条显示“选这只猫／已选择／已确认”。 | 两只猫完整、选中可换选；点店员后得到具体重试反馈，改选顾客并检查后手提包移向她。 |
| P2：不同题型缺少一致的可操作状态。 | 听词、配对、图片选择、文字选择和词块使用同一操作色及轮廓。词卡标明播放/重听，词块加号表示加入、叉号表示撤回。 | 三关全部重练，4+4+2 词卡手动点播、两组配对、听句图片题、拼句撤回、填空和最终对话题均已走查。 |
| P2：第一轮 320×568 中最后一个答案底边被底栏压住约 12px。 | 收紧短屏检查点的装饰猫高度和历史区域；缩放后将故事历史定位到最新上下文。 | 第二轮 320×568 默认两个答案与底部检查同时可见；最后答案在底栏上方。长历史继续允许滚动。 |

先前修复的反馈自动移入视口、反馈焦点保持及吸附底栏均保留。没有剩余的可操作 P0/P1/P2 发现；不把历史记录的滚动区域当成正文丢失。

## 视觉来源、视口与比较

源视觉事实是用户提供的 [选项截图](docs/designs/lesson1-2-v3/review-20260906-affordance/user-before-story-options.png)（865×874）和 [交还对象截图](docs/designs/lesson1-2-v3/review-20260906-affordance/user-before-cat-choice.png)（697×639），目标是按用户反馈补强可操作性，保留灰绿背景、完整猫猫与简洁信息层级。原图属于局部截图，完整视口及密度未知，不做逐像素复刻结论。

实施规则见 [审查与方案](docs/designs/lesson1-2-v3/review-20260906-affordance/可操作性审查与实施方案.md)。新资料和补充来源位于 [参考目录](docs/references/duolingo/2026-09-05/README.md)。

为了比较同一状态，先在修改前真实重现两个题目，再与修改后截图放在同一次图像输入中查看。完整页面均为 **865×950 CSS px、截图 865×950 px、密度 1**，无需缩放：

- 文字选项：[修改前](docs/designs/lesson1-2-v3/review-20260906-affordance/01-before-story-865.png) → [修改后默认](docs/designs/lesson1-2-v3/review-20260906-affordance/03-after-story-default-865.png) → [键盘选择后](docs/designs/lesson1-2-v3/review-20260906-affordance/04-after-story-selected-865.png)。默认文字及选项次序相同；猫猫缩小、历史区域缩短和答案提前出现是本次有意调整。
- 猫猫选择：[修改前](docs/designs/lesson1-2-v3/review-20260906-affordance/02-before-cat-865.png) → [修改后](docs/designs/lesson1-2-v3/review-20260906-affordance/07-after-cat-default-865.png)。相同交还题、未作答状态；角色答案移到上下文之后，动作标签可见。
- 短屏第二次迭代：[第一轮选中状态](docs/designs/lesson1-2-v3/review-20260906-affordance/05-story-selected-320.png) → [最终默认状态](docs/designs/lesson1-2-v3/review-20260906-affordance/08-story-default-320-final.png)。均为 320×568；选择状态不同，因此只比较最后答案与底栏的位置，不比较选中颜色。还有 [双猫默认](docs/designs/lesson1-2-v3/review-20260906-affordance/09-cat-default-320-final.png)。

完整 1:1 截图已能直接读清文字、选择标记和动作条，关键控件又在 320px/390px 实际视口单独检查；未制作放大裁切或用图像编辑生成实现效果。图像尺寸清单见 [screenshots.json](docs/designs/lesson1-2-v3/review-20260906-affordance/screenshots.json)。

## 五个必查视觉面

| 项目 | 结果 |
| --- | --- |
| 字体与排版 | 延续已有 Fredoka 英文学习内容和中文系统字体；题目保持最大文字层级，答案加强字重。最窄屏动作条不换行；长英文在气泡内正常换行。 |
| 间距与布局 | 文字答案与角色答案都在上下文之后；320×568、390×844、865×950 下无横向溢出。反馈与底栏不重叠。完整历史在自身区域滚动，保留原句重听。 |
| 颜色与状态 | 原灰绿背景不变；淡蓝供作答，实心标记表示已选，绿色确认正确/推进，暖黄指示重试，灰色表示禁用。触屏默认状态不依赖悬停才能发现操作。 |
| 图片与图标 | 原始猫猫和物品素材保留，完整身体与尾部没有新增裁切；图片保持 contain。新增圆形选择、实心选择和加号来自现有 Bootstrap Icons，已进入课程包。 |
| 文案与内容 | 新增文字局限于必要动作/状态：选这只猫、已选择、已确认、未选择、播放中、重听、撤回。没有恢复题下说明段落、慢速听或独立角色扮演关卡。原课文、题目和答案契约不变。 |

## 真实交互证据

测试使用同一工作树的独立 42814 服务，重练三关。没有注入答案或模拟音频 ended，没有改写用户的学习存储来制造完成状态。

- **故事与交还对象**：[手机已选](docs/designs/lesson1-2-v3/review-20260906-affordance/10-cat-selected-390.png)、[错误与重试](docs/designs/lesson1-2-v3/review-20260906-affordance/11-cat-retry-390.png)、[归还确认](docs/designs/lesson1-2-v3/review-20260906-affordance/12-cat-confirmed-390.png)。错误后可换选；确认前物品不移动。确认后 Tab 从反馈到“继续”。
- **词卡**：[默认播放](docs/designs/lesson1-2-v3/review-20260906-affordance/13-word-cards-390.png)、[听完后可重听](docs/designs/lesson1-2-v3/review-20260906-affordance/14-words-heard-390.png)、[汽车和房子](docs/designs/lesson1-2-v3/review-20260906-affordance/19-home-words-390.png)。逐个点击并等待真实播放结束，计数按 4/4、4/4、2/2 解锁；配好的单词也实际触发过重听。
- **配对与图片答案**：[配对已选](docs/designs/lesson1-2-v3/review-20260906-affordance/15-match-selected-390.png)、[听力图片题](docs/designs/lesson1-2-v3/review-20260906-affordance/16-picture-answers-390.png)。故意错配后状态回到可选，完成两组；听力播放期间答案禁用，结束后恢复可选，英文答案不提前泄露。
- **拼句与填空**：[加入/撤回](docs/designs/lesson1-2-v3/review-20260906-affordance/17-word-bank-undo-390.png)、[填空默认](docs/designs/lesson1-2-v3/review-20260906-affordance/18-cloze-390.png)。撤回 this 后重新拼句，正确检查播放原句后继续；填空及最后听懂对话题完成。
- **进度与刷新**：[三关重练后路线](docs/designs/lesson1-2-v3/review-20260906-affordance/20-route-after-replay-390.png)。原预览升级前后状态另存 original-before.txt、original-after.txt 与 original-preview-proof.json；原有三关完成状态保留；最后把原预览停在重练中的[双猫选择题](docs/designs/lesson1-2-v3/review-20260906-affordance/21-original-preview-handoff.png)，方便直接体验。
- **布局数据**：[短屏答案](docs/designs/lesson1-2-v3/review-20260906-affordance/story-320-proof.json)、[手机确认与焦点](docs/designs/lesson1-2-v3/review-20260906-affordance/cat-confirmed-proof.json)。句子重听控件为 44×44；词块撤回控件至少 44px 高。未宣称所有系统级辅助技术已验收。
- **控制台**：[独立预览](docs/designs/lesson1-2-v3/review-20260906-affordance/console.json) warn/error 为空；原预览另存 original-console.json。

最后一道题的检查后录音较长，一次工具点击等待超过其内部期限；读取实际页面确认“继续”已解锁后正常完成。没有绕过播放门槛，没有剩余页面错误。

## 程序验证与交付范围

- [420 / 420 单元检查通过](docs/designs/lesson1-2-v3/review-20260906-affordance/unit-tests.log)，包含更新后的角色选择契约：先读上下文、动作命名、选择不等于归还。git diff --check 通过。
- 课程包：85 项、991008 字节，清单 SHA-256 `7927b512765d88623fe57e08e6182e5b72b5ec7e8be624a2b4d85b78b3962d3c`。资源版本 `path-v36-affordance-20260906`，课程进度修订仍为 lesson1-2-v3.6 / schema 4。
- 题型参考原文的 SHA-256 仍为 `7ceefda38f56230cebc4530abf91e51725e38e99aabfd591a0d7d8da04bf7e70`；新增 HCI 全文和来源核对同目录保存。
- 当前是本地候选；未提交、推送或部署。原始 codex/learning-runtime-v2 检出保持干净。未扩展离线入口、音质或儿童学习效果验收。
- 浏览器受保护访问本轮正常；没有取消浏览器安全策略。

## 实施检查表

- [x] 原文归档与官方资料核对。
- [x] 文字、图片、角色、词卡、配对与词块的操作状态统一。
- [x] 同题前后图像比较，短屏问题第二轮修正。
- [x] 三关真实重练、错误恢复、播放结束和撤回验证。
- [x] 检查课程包、程序回归与原预览进度。

前次的浏览器恢复验收保存在 [previous-design-qa.md](docs/designs/lesson1-2-v3/review-20260906-affordance/previous-design-qa.md)；它没有覆盖本次用户新报告的迟疑问题，不能作为本轮可操作性通过的依据。
