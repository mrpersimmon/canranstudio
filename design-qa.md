# 当前版本验收 · 完成页返回路线与词汇图片

2026-09-06 · `codex/duolingo-version`

final result: passed

本地预览：http://127.0.0.1:42817/ 。两张词汇图片已替换；每关完成后通过“回到路线”结束，再由学习者主动选关。用户记录仍为 6/11，原预览保留在路线页。本轮未推送、未部署。

## 修复结果

- 原西装偏写实、学校偏繁复建筑渲染；使用 imagegen 按迪士尼二维手绘方向重绘。西装初稿在深色页面偏暗，被实际目检拦下后再次通过 imagegen 调整。新图、原稿、提示词和审核指纹全部保留。
- 移除完成页直接启动下一关的入口。所有 11 关、已完成关卡重练和今日复习都统一返回路线。运行时要求从地图选择关卡，防止旧跨关事件继续生效。
- 旧浏览器检查点击了顶部退出，避开底部“下一关”，因此漏检。现在逐关操作真正的底部主按钮，检查停在地图、没有新活动/音频、没有额外进度写入；完成按钮必须在短屏中可见。

## 当前证据

66 项程序与契约检查通过。四种视口、全部 52 个活动，共 1,233 个实际浏览器渲染状态通过。11 关在四种视口中均执行底部返回，共 44 次；另覆盖重练和今日复习。八类故障注入全部被拦截，含新增的错误跨关按钮与完成按钮移出屏幕。

原地址使用真实音频和用户记录完成第五关重练，点击“回到路线”后停在地图，仍为 6/11。最终词卡原始音频自然结束并显示 3/3，原地址浏览器警告/错误列表为空。自动音频适配器不构成主观音质试听。

- [完整验收与五项表面复核](docs/designs/completion-return-and-vocabulary-art/design-qa.md)
- [原因、漏检与防护记录](docs/designs/completion-return-and-vocabulary-art/README.md)
- [最终词卡、完成页与返回地图](docs/designs/completion-return-and-vocabulary-art/qa/final-ui-contact.png)
- [原地址新词卡](docs/designs/completion-return-and-vocabulary-art/qa/native-vocabulary-heard.png)
- [原地址完成按钮](docs/designs/completion-return-and-vocabulary-art/qa/native-completion-after.png)、[返回后的记录](docs/designs/completion-return-and-vocabulary-art/qa/native-final-state.json)
- [浏览器证明](docs/designs/completion-return-and-vocabulary-art/qa/browser-proof.json)、[取证范围](docs/designs/completion-return-and-vocabulary-art/qa/capture-notes.md)

本轮范围没有待处理的 P0/P1/P2 项。两张图片的验收不代表所有历史插画均已重绘；用户体验验收独立于开发检查。缺失、失败、覆盖不足或指纹过期的浏览器证明仍会阻止构建。

历史：[Lesson 分区与交互修复](docs/designs/lesson-sections-and-interaction-fixes/design-qa.md)、[统一深色](docs/designs/unified-dark/design-qa.md)、[首次可读性修复](docs/designs/readability-guard/design-qa.md)。
