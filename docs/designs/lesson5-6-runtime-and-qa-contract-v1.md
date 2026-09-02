# Lesson 5–6 运行时与 QA 契约 V1

状态：本地候选实现契约
适用修订：`lesson5-6-v1`

## 1. 深模块边界

- `core/curriculum-catalog.js`：唯一课程真源，拥有 Source、Target、儿童文案、阶段、实体、答案、角色和音频映射。
- `core/story-stage-runtime.js`：跨 Lesson 3–8 共用的纯状态机；不读取 DOM、不按单元 ID猜答案。
- `core/story-stage-scene.js`：稳定舞台、图片预解码、音频生命周期、事件转发和进度保存。
- `core/story-stage-boot.js`：只读取页面的 `data-unit-id="NCE-U03"` 与修订号并装载。
- `poc/lesson5-6-experience/index.html`：无课程事实副本，仅声明入口、主题和脚本。
- `poc/story-stage-experience.css`：三个单元共用的响应式视觉规则，以 `data-unit-id` 令牌区分主题。

这个接口把“单元内容变化”限制在 catalog，把“连续舞台如何工作”收进一个深模块；新增同类单元不得复制运行时或页面脚本。

## 2. 状态与音频门禁

```text
boot → stage-ready
stage-ready → required-audio-playing → awaiting-response / internal-next
awaiting-response → wrong-support-1 → wrong-support-2
awaiting-response → correct-audio-playing → internal-next / stage-complete
stage-complete → next-stage / unit-complete
audio-error → explicit-retry (never auto-complete)
```

每次播放持有单调递增 `requestId`。只有当前请求的真实 `ended` 可以推进；旧音频、`pause`、失败、固定计时和快速重复点击均不能推进。重播只重放，不改完成状态。

## 3. 持久化

键：`poc:learning-experience:NCE-U03:lesson5-6-v1`

保存 `revision`、`currentStageId`、`completedStageIds`、角色覆盖、已接触 Source、证据记录和更新时间；不保存正在播放的音频、动画帧或临时错误。修订号变化时拒绝读取旧状态；完成后刷新仍进入完成面。

## 4. 失败策略

- 音频失败：保持当前英文和选择，显示明确重试；绝不静默跳过。
- 图片失败：使用同尺寸可读占位，不让布局塌陷。
- 保存失败：保留内存答案与当前阶段，允许重试保存，不要求重答。
- 启动失败：显示可重新加载的错误面；不得留透明遮罩阻断点击。

## 5. 防闪烁必检项

1. 初始 HTML 在脚本运行前已有深色场景底和可见启动内容。
2. shell、背景 `<picture>` 和两名人物在阶段切换中节点替换数为 0。
3. 播放与重播不改变背景 URL、人物 `src` 或页面主题类。
4. 任务面板只在当前关键图片 `decode()` 后更新；下一阶段后台预热。
5. CSS 禁止全屏闪白、阶段性 `opacity: 0`、背景切换和循环呼吸。
6. 一轮真实操作中背景额外网络请求为 0、未处理异常为 0、整页白帧为 0。

## 6. 自动化门槛

| 层 | 必检内容 |
|---|---|
| Catalog | 10 阶段、Source 存在、覆盖完整、答案规则合法、问题不泄露接受标签 |
| Runtime | S01 音频后解锁、album 全量、角色互补、恢复隔离、完成页恢复 |
| Audio | 50 文件、清单指纹、声色映射、-18 LUFS、起音 ≤150ms、真实 ended |
| Art | 每实体 900 PNG + 640 WebP/AVIF；透明 alpha；双画幅 1920×1200 / 900×1600 |
| Static | noindex、页面无答案、共享脚本路径、无外部运行依赖或认证字段 |
| Desktop | 1600×1000；大字；人物高于桌面；车辆可辨；无卡片内滚动 |
| Mobile | 390×844；人物缩小；主操作可见；无横向溢出 |
| Short | 1280×720；允许页面级滚动；任务与继续按钮可达 |

## 7. 人工验收模板

```text
版本 / 地址：
视口：desktop / mobile / short
S01–S10 是否全部完成：
两个角色是否都演过：
50 个候选音频逐文件试听：通过 / 未通过 / 未执行
专名与汽车品牌是否准确：
是否泄露答案、出现重复选项层或冗余过场：
是否闪烁、白帧、人物或车辆跳位：
控制台错误 / 警告：
结论：通过 / 不通过 / 待修改
```

自动门禁通过不等于人工试听或发布通过。
