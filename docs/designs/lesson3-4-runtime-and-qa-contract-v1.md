# Lesson 3–4 运行时与 QA 契约 v1

状态：实现契约
适用修订：`lesson3-4-v1`

## 1. 边界

- `core/curriculum-catalog.js`：保存教材来源、儿童文案、阶段、实体、音频和答案规则。
- `core/story-stage-runtime.js`：三个连续单元共用的纯状态机；不读取 DOM，不硬编码答案或文案。
- `core/story-stage-scene.js`：三个连续单元共用的稳定场景 DOM、事件转发、音频生命周期、持久化。
- `poc/lesson3-4-experience/*`：入口和视觉；不能再声明题目或答案。
- 本地体验状态是 `local-poc`，不是发布证据。

## 2. 状态机

```text
loading
  └─ READY → stage-ready
stage-ready
  ├─ PLAY → audio-playing ─ ENDED(current request) → awaiting-response / stage-complete
  ├─ ANSWER(wrong) → support-1 → support-2
  ├─ ANSWER(correct) → feedback-audio ─ ENDED → next internal step / stage-complete
  └─ REPLAY → audio-playing (never advances)
stage-complete
  └─ CONTINUE → next stage-ready / unit-complete
audio-playing
  └─ ERROR → audio-failed ─ RETRY → audio-playing
unit-complete
  ├─ RESTART → stage S01
  └─ LEAVE → course entry
```

音频事件必须携带单调递增 `requestId`。只有当前请求、当前片段的真实 `ended` 可以推进；`pause`、旧请求 `ended`、页面可见性变化、播放失败都不能伪造完成。

## 3. 进度记录

存储键：`poc:learning-experience:NCE-U02:lesson3-4-v1`

持久化字段：

- `revision`
- `currentStageId`
- `completedStageIds`
- `firstRoleId`
- `completedRoleIds`
- `contactedSourceRefs`
- `evidenceRecords`
- `updatedAt`

不保存动画中间态、正在播放的音频或错误提示。刷新后回到当前阶段安全起点；已经完成的阶段可从顶部冲压轨迹回看，未到达阶段不可跳入。

## 4. 失败策略

音频失败：英文文本留在原位，显示“声音没有播放成功 / 再听一次”；不自动跳过。
保存失败：当前答案留在内存，显示“进度还没有保存好 / 重新保存”；不要求重答。
图片失败：保留等尺寸带中文描述的占位，不导致布局塌陷。
依赖失败：显示可重新加载的启动失败面，不出现黑屏或不可点击的透明遮罩。

## 5. 防闪烁必检项

每次实现、修复和发布前都必须检查：

1. 首屏启动面在脚本执行前已经有背景色和可见内容。
2. 背景与人物节点在十阶段中引用相同节点实例。
3. 点击播放不修改 `<body>`、场景 `<picture>` 或人物 `src`。
4. 阶段切换不使用 `root.innerHTML = ...` 重建全页。
5. 关键图片在开放交互前 `decode()` 完成；加载期间保留旧帧。
6. CSS 不使用阶段变化触发的全屏 `opacity: 0`、背景图切换或白色占位。
7. 连续快速点击只产生一个有效动作；音频按钮播放期间禁用。
8. 浏览器巡检同时观察 DOM 断点、图片请求、布局偏移和可见白帧。

实现约束：预加载顺序必须与 `<picture>` 一致，按 `AVIF → WebP → PNG` 逐级回退；当前阶段素材必须完成 `decode()` 后才替换任务面板，下一阶段只做后台预热。不能只预载备用格式，否则高速切题仍会出现短暂空卡。

回归门槛：一轮 10 阶段操作中，固定场景节点替换数必须为 0；背景重新请求数必须为 0；无未处理异常；无整页白帧。

## 6. 可访问性与授课模式

- 所有按钮使用原生 `<button>`；可见焦点不依赖颜色。
- 图像卡包含可读 `aria-label`，但在答案尚未揭晓时不能把正确英文暴露给视觉题的可见标签。
- 最小触摸目标 48×48px。
- 电脑端按照远距离授课放大文字和选项；手机端不靠缩放整个画布适配。
- `aria-live="polite"` 只播报阶段变化与错误支持，不逐字重复所有装饰信息。
- 支持键盘、触控与鼠标；不要求悬停。

## 7. 自动化矩阵

| 层 | 必检内容 |
|---|---|
| Catalog | 10 阶段 ID 唯一、Source 存在、答案规则合法、必需来源可覆盖 |
| Runtime unit | 正确推进、错误分级、旧音频不推进、角色互补、刷新恢复、受限回看 |
| Fairness | 题面/标题/提示不包含接受选项标签；正确项无独占初始视觉类 |
| Static contract | 页面 noindex、内容来自 catalog、固定背景/人物 DOM、启动失败面 |
| Audio | 42 文件、manifest 指纹、固定声音映射、真实 ended 门槛 |
| Browser desktop | 1600×1000；人物高于柜台；大字；10 阶段可完成；无闪烁 |
| Browser phone | 390×844；人物缩小；主操作可见；无横向滚动 |
| Browser short | 1280×720 / 844×390；面板和主按钮不被裁掉 |
| Generated art | `contain` 补边必须显式透明；窄素材的近黑不透明像素占比不得形成整块 letterbox |

## 8. 人工验收记录模板

```text
版本：
地址：
视口：desktop / phone / short
S01–S10 是否全部完成：
两个角色是否都演过：
42 个声音抽听/全听结果：
是否出现答案泄露：
是否出现旧 UI 或额外结果页：
是否出现闪烁、白帧、人物/道具跳位：
控制台错误 / 警告：
验收人结论：通过 / 不通过 / 待修改
```
