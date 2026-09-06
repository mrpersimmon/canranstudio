# 当前版本验收 · Lesson 分区与交互修复

2026-09-06 · `codex/duolingo-version`

final result: passed

本地预览：http://127.0.0.1:42817/ 。本轮五项诉求的本地实现、自动检查及实际页面验收完成，原有主线进度保持 3/11。未推送、未部署线上。

## 结果与来源

- 教材章节显示 Lesson 1 & 2、Lesson 3 & 4、Lesson 5 & 6，关卡介绍说明具体 Lesson，复习继续串联在路线中。节点 ID、顺序、存储格式和既有记录兼容。
- 快速点选词卡进入显式播放队列，当前和待播放项去重；原速音频真实结束后才计数。播放期间不能提前完成；保存失败先恢复保存，再继续队列。
- imagegen 重绘相向的两只猫、三把不同花纹的雨伞和大号 5 号码牌，按迪士尼二维绘画方向执行。母版与提示词保留；技术透明处理有记录。
- 同章节点在当前、锁定、完成和展开状态共用 162px 节距；猫不撑高路径，章节最后一关的介绍向上展开。

依据用户提供的 [Duolingo 地图](docs/references/duolingo/2026-09-06/path-dark/duolingo-2.jpg)、[课内参考](docs/references/duolingo/2026-09-06/lesson-dark/README.md)与[外研社教材说明](https://www.fltrp.com/c/2022-10-20/514394.shtml)。单数课对话/短文、双数课图片是教材结构；配对成应用章节是本产品的设计决定。

## 五项表面复核

| 表面 | 结果与证据 |
| --- | --- |
| 字体 | 保持既有中文系统字体和 Fredoka 英文层级；Lesson 标记直接可见。长章节名缩短后，320px 实际内容检查通过。 |
| 布局 | 11 关地图/介绍/返回状态实测同章节距全部为 162px，角色与节点不重叠；手机页的候选项、播放状态和底部操作可见可点。 |
| 色彩 | 地图、课内、课本、反馈、异常页及浏览器主题色共用 #141f23；配套文字对比度与状态色检查通过。 |
| 图像 | 新六张素材在深浅背景、96px 缩图、420px 手机故事和原地址场景中目检；全身、手势、目光相向，号码与花纹可辨。元数据与哈希不能代替目检。 |
| 文案 | 教材来源更明显；仅增加“待播放”状态，保留短任务说明、手动继续与重听；没有恢复慢速听。 |

## 原因与防护

漏计数来自新点击取消旧音频，旧音频的结束事件不再发生；旧测试还把这种取消当成正确行为。间距异常来自猫所在行和当前节点拥有额外高度/外边距。背向角色和道具风格问题来自复用不合场景的图片，而资源加载检查未覆盖视线、手势与画风。

[完整修复记录](docs/designs/lesson-sections-and-interaction-fixes/README.md)逐项记录原始现象、直接原因、漏检原因、修复与持续防护，也包含本轮检查拦截的末节点浮层、窄屏长标题和浏览器主题元数据问题。该要求已加入[项目设计原则](docs/design-principles.md)和用户长期偏好。

## 当前证据

63 项逻辑与契约检查通过。四种屏幕 320×568、420×856、906×801、1440×900，共 1,072 个实际浏览器渲染状态通过，覆盖全部 52 个活动和 11 个节点。所有词卡组均检查快速连点、逐项结束后的显示/保存计数。六类故障注入均被检出，包含主动恢复旧 264px 行高的间距错误。

原地址另用真实音频重练第三关：约一秒内连点四卡，先见 1/4 与待播放项，自然播放结束后变为 4/4；返回地图仍为 3/11。新雨伞故事在用户原位置实查通过。未把模拟音频结束事件当成主观音质试听。

- [本轮浏览器证明](docs/designs/lesson-sections-and-interaction-fixes/qa/browser-proof.json)
- [地图与 Duolingo 对照](docs/designs/lesson-sections-and-interaction-fixes/qa/map-comparison.png)
- [地图、介绍、新故事和快速点选](docs/designs/lesson-sections-and-interaction-fixes/qa/fixes-browser-contact.png)
- [六项新素材](docs/designs/lesson-sections-and-interaction-fixes/qa/story-art-contact.png)
- [故事/拼句/填空复验](docs/designs/lesson-sections-and-interaction-fixes/qa/lesson-regression-contact.png)、[角色交接](docs/designs/lesson-sections-and-interaction-fixes/qa/owner-420.png)、[异常恢复](docs/designs/lesson-sections-and-interaction-fixes/qa/blocked-906.png)
- [真实快速点击记录](docs/designs/lesson-sections-and-interaction-fixes/qa/native-rapid-taps.json)、[原地址新故事](docs/designs/lesson-sections-and-interaction-fixes/qa/native-umbrella-story.png)
- [截图尺寸与取证范围](docs/designs/lesson-sections-and-interaction-fixes/qa/capture-notes.md)

当前没有本轮范围内待修复的 P0/P1/P2 项。新素材替换不代表全部既有教材插图都已重绘；本轮不评价未修改音频的主观听感。缺失、失败、不完整或输入过期的浏览器证明继续阻止构建，不能沿用历史通过记录。

历史：[统一深色](docs/designs/unified-dark/design-qa.md)、[首次可读性修复](docs/designs/readability-guard/design-qa.md)。
