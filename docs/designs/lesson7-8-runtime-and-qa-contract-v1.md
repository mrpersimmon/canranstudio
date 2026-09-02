# Lesson 7–8 运行时与 QA 契约 V1

状态：本地候选实现契约
适用修订：`lesson7-8-v1`

## 1. 深模块边界

- catalog 是 Source、Target、阶段、职业实体、答案、角色和音频的唯一真源。
- `core/story-stage-runtime.js` 只处理可验证状态迁移，不认识 Robert、Sophie 或任何正确职业。
- `core/story-stage-scene.js` 维持背景和人物节点、预解码职业图、管理音频 `requestId` 与存储。
- `core/story-stage-boot.js` 从 `data-unit-id="NCE-U04"` 装载。
- `poc/lesson7-8-experience/index.html` 只提供无索引入口；`poc/story-stage-experience.css` 提供共享响应式舞台。

新增内容必须进入 catalog；页面不得硬贴问题、职业标签或答案，也不得复制一套 Lesson 7–8 专属运行时。

## 2. 状态与音频门禁

`stage-ready → required-audio-playing → awaiting-response → correct-audio-playing → internal-next / stage-complete`。错误留在原题并升级两级支持；音频失败进入明确重试。只有当前 `requestId` 的真实 `ended` 可以开放或推进，重播不写结果，旧事件无效。

S03、S07–S10 是单阶段内部多轮；内部轮次不写顶部阶段、不跳新页面。S06 角色演练按 catalog 角色表驱动，不以固定 visitor/attendant 名称判断。

## 3. 持久化

键：`poc:learning-experience:NCE-U04:lesson7-8-v1`

保存修订号、当前稳定阶段、已完成阶段、角色覆盖、Source 接触和形成性证据。不保存播放进度或动画中间态；旧修订状态不能污染新体验，完成状态刷新后仍可恢复完成页。

## 4. 失败策略

- 音频失败保留英文和职业图，显示“再听一次”；不自动判对或跳过。
- 图片失败保留等尺寸占位和隐藏式无障碍名称，不暴露正确答案。
- 保存失败不清除当前答案；启动失败显示可恢复面，不留下透明点击层。

## 5. 防闪烁必检项

1. 首屏有同步可见底色和启动内容，不等 JavaScript 后才出现页面。
2. 背景、Robert、Sophie 与 shell 跨十阶段保持同一节点实例。
3. 音频按钮只改变局部播放状态，不替换人物、背景或整张任务面。
4. 当前职业图解码完成后再显示；下一阶段素材后台预热，旧帧保留到新帧可用。
5. 禁止阶段触发的全屏透明、白色占位、背景 URL 变更和页面根节点重建。
6. 真实流程中固定节点替换、背景重复请求、白帧和未处理异常均为 0。

## 6. 自动化门槛

| 层 | 必检内容 |
|---|---|
| Catalog | 10 阶段、所有 Source 可达、Target 覆盖、答案公平、职业标签答前隐藏 |
| Runtime | 整段后解锁、正负双轮、album 全量、两角色、恢复与完成安全 |
| Audio | 47 文件、清单指纹、角色声色、-18 LUFS、起音 ≤150ms、真实 ended |
| Art | 900 PNG、640 WebP/AVIF、透明 alpha、双背景画幅、职业主体可辨 |
| Static | noindex、页面无答案、副本或外部服务；仅共享运行时 |
| Desktop | 1600×1000；字体与职业图满足授课距离；人物不缩成角落贴纸 |
| Mobile | 390×844；人物缩小；主问题和候选无需横向滚动 |
| Short | 1280×720；页面级滚动可达全部操作，无任务卡内滚动 |

## 7. 人工验收模板

```text
版本 / 地址：
视口：desktop / mobile / short
S01–S10 是否全部完成：
Robert 与 Sophie 是否都演过：
47 个候选音频逐文件试听：通过 / 未通过 / 未执行
十种职业图是否一眼可辨、无标签依赖：
是否泄露 Robert 职业或当前正确职业：
是否出现双页面、重复候选、旧 UI：
是否闪烁、白帧、人物或职业图跳位：
控制台错误 / 警告：
结论：通过 / 不通过 / 待修改
```

自动化通过仅说明结构与技术门禁通过，不代表用户已试听、已验收或可发布。
