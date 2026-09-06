# 当前版本验收 · 统一深色主题

2026-09-06 · `codex/duolingo-version`

final result: passed

地图、课内、课本、复习、反馈与异常恢复共用 #141f23。11 张既有 imagegen 素材完成用户授权的去白底，原图保留。图像采用迪士尼绘画风格、使用 imagegen 生成，已加入[项目设计原则](docs/design-principles.md)及长期记忆。

## 来源与实现

来源：[Duolingo 手机词块翻译](docs/references/duolingo/2026-09-06/lesson-dark/duolingo-dark-translation-word-bank.jpg)、[填空正确反馈](docs/references/duolingo/2026-09-06/lesson-dark/duolingo-dark-cloze-correct-feedback.jpg)、[深色地图](docs/references/duolingo/2026-09-06/path-dark/)。

参考原图 1260×2720，移除顶部系统区 112 像素与底部空白区 40 像素，按 3:1 归一为 420×856。对应实际页面为 420×856 CSS px、devicePixelRatio 1，从真实 iframe 截图等尺寸裁取。教材和角色不同，词块实现侧展开了提示；仅比较同类任务的主题、层级、控件和状态，不作相同内容的逐像素判断。

- [词块完整对照](docs/designs/unified-dark/qa/word-bank-comparison.png)、[词块细节](docs/designs/unified-dark/qa/word-bank-detail.png)
- [填空反馈完整对照](docs/designs/unified-dark/qa/cloze-comparison.png)、[主要按钮细节](docs/designs/unified-dark/qa/cta-detail.png)
- [同一故事位置的前后对照](docs/designs/unified-dark/qa/story-before-after.png)、[猫猫与气泡细节](docs/designs/unified-dark/qa/story-detail.png)：两侧均 906×801，Excuse me! / Yes?。
- [交接选择](docs/designs/unified-dark/qa/handoff-420.png)、[窄屏地图](docs/designs/unified-dark/qa/map-320.png)、[异常恢复](docs/designs/unified-dark/qa/blocked-906.png)
- [原本地网址实际故事](docs/designs/unified-dark/qa/user-story-906.png)、[320×568 故事](docs/designs/unified-dark/qa/user-story-320.png)、[320×568 课本](docs/designs/unified-dark/qa/user-reference-320.png)

## 五项必查表面

| 表面 | 结论 |
| --- | --- |
| 字体 | 既有中文系统字体与 Fredoka 英文保持层级、清晰字重与可读换行；并非 Duolingo 原品牌字体。 |
| 布局 | 保留教材交际场景与双方角色，清楚区分内容、候选和底部操作。不同题型的布局差异已注明；窄屏可滚动、无横向溢出。 |
| 色彩 | 统一深色背景、明亮正文、灰色边界、蓝色当前/选择、绿色主要操作与正确状态。全矩阵实测文字对比度与主题一致性。 |
| 图像 | 原图完整保留；角色无裁切、无矩形白底，不通过混合模式压暗，透明通道已验证。全部 11 张素材在深底及实际页面目视检查。 |
| 文案 | 教材、答案、顺序、音频和存储版本不变；交接题仍写“选这只猫”，没有加入冗余说明或慢速听。 |

## 问题与复验

- P1 内外色差：使用统一背景及配套前景/状态颜色；同一故事位置前后截图复验通过。
- P1 不透明旧素材：[初版失败报告](docs/designs/unified-dark/qa/opaque-art-failure.json)实测店员和顾客采样全部不透明。用户授权后另行导出透明版本，完整浏览器矩阵与[深色素材总览](docs/designs/unified-dark/qa/cutouts-contact.jpg)复验通过。
- 原有 4 MiB 资源检查曾拦截过大的无损网页导出。保留无损母版并压缩网页版本，最终资源为 3,495,854 字节，未放宽上限。
- 未采用尺寸误标或底部重复的截图；真实页面尺寸重新核对。取证校正细节见完整报告。

当前没有待修复的 P0/P1/P2 主题、透明素材或可读性问题。

## 验证与边界

57 项程序检查、984 个实际浏览器渲染状态通过。四种屏幕分别为 320×568、420×856、906×801、1440×900，覆盖 52 个活动和 11 个节点。五类故障注入均被拦截；缺失、失败、不完整或指纹过期的证明会阻止构建。

真实首页另验证加载、角色选择、反馈、原始语音播放时禁止提前完成、ended 后仍等待手动操作、完成/地图/课本及刷新保留进度。原本地网址已更新，保留用户原来的 0/11 和两句故事位置。控制台 warning/error 为空。

本次没有修改音频，不把程序模拟和播放状态核对当成主观音质试听。当前结论为本地实现与验收通过；未推送、未部署线上。

[完整本次报告](docs/designs/unified-dark/design-qa.md) · [浏览器证明](docs/designs/unified-dark/qa/browser-proof.json) · [防护网说明](docs/designs/readability-guard/README.md)

历史记录：[首次可读性修复](docs/designs/readability-guard/design-qa.md)、[深色地图](docs/designs/learning-path-dark/design-qa.md)、[原 V4 课程](docs/designs/lesson1-6-path-v4/design-qa.md)。历史浅色课内通过记录不用于本次主题验收。
