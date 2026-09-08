# 实际页面核验

2026-09-08，在本地正式首页 `http://127.0.0.1:42860/` 使用原生 Chrome、真实存储和真实音频检查。独立验收浏览器中的前置进度由正式运行时产生，再导入该隔离配置；不修改用户官网上的学习记录。截图均已打开目视核对，指纹见 [screenshots.json](screenshots.json)。

| 页面 | 核验结果 |
| --- | --- |
| [完整课程首页](book1-map-final.png) | 显示 Lesson 1–144、354 关与课程目录；验收结束后隔离浏览器恢复为零进度 |
| [前 50 课继续到 Lesson 51](book1-upgrade50-next51.png) | 仍为 129/354，下一关可开始，后续关卡未提前解锁 |
| [Lesson 121 故事](book1-lesson121-story.png) | 长句、完整猫猫场景、自然语音与手动继续；实际听完 13 段并完成两次理解检查 |
| [故事选择](book1-lesson121-selected.png) | 短屏滚动后所有选项可点，选中状态明确，底部检查操作可见 |
| [本次完成](book1-lesson121-complete.png) / [回到路线](book1-lesson121-map.png) | 顶部仅本次 100%；点击底部回到路线，进度由 301 增至 302，停在地图 |
| [Lesson 143 故事](book1-lesson143-story.png) | 420×856，长叙述句可读，场景完整；实际检查首句播放，后续完整流程由逐题矩阵覆盖 |
| [Lesson 144 课本](book1-lesson144-reference-final.png) | 六个改编例句可查看并重听，返回路线操作清楚；有 15px 滚动条时无横向溢出 |
| [最后一组挑战完成](book1-challenge144-completed.png) | 320×568，6/8 独立完成、2 题借助提示；完整句与填词、错误后修改、缩写答案、完成按钮均走通 |
| [Lesson 61 两行标题](book1-lesson61-title-native.png) | 原生 320×568，完整文字可见；对比度 6.138:1，已区分检测工具的背景误判与真实遮挡 |
| [最终学生笔记](book1-lesson61-notes-final.png) | 重新载入最终课程包后，在原生 320×568 中确认语言说明可读，无作者编排指令；内容区与实际滚动宽度均为 305px |
| [错误缩写](book1-challenge-invalid-contraction.png) / [正确表达](book1-challenge-valid-contraction.png) | 最终课程包中实测 Lesson 61 挑战：错误写法被拒绝，进度保持 5/8；修改为合法的 have got 表达后答对，继续到 6/8，见 [实际判分记录](answer-review-native.json) |

最后一组挑战的实际重置记录：重置前 8 个答案（6 个独立完成），重置并刷新后为 0，撤销后恢复 8 个。全过程的已完成主线活动数始终为 1,567。程序检查另外覆盖单组、全部挑战、全课程重置与保存失败。

## 窄屏修复前后

[修复前](book1-challenge144-retry.png)：320×568 的反馈页，`innerWidth=320`、`clientWidth=305`、`scrollWidth=320`，出现横向滚动条。

[修复后](book1-challenge144-retry-fixed.png)：同样 320×568 的输入挑战反馈页，`innerWidth=320`、`clientWidth=305`、`scrollWidth=305`，无横向滚动。前后是同类反馈状态，题干不同；不将它们描述为完全同题的像素对照。

修复前已通过的 40,656 状态不能作为修复后的证明；增加真实滚动条占位和故障注入后，完整矩阵重新运行，最终结果统一记录在 [当前验收](../../../../design-qa.md)。

这些截图及原生播放抽样不代表逐句人工试听全部 2,823 条录音，也不代表已在所有真实手机型号上体验。官网发布另行记录。
