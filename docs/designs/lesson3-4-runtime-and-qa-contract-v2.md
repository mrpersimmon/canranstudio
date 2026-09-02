# Lesson 3–4 运行时与 QA 契约 V2

状态：当前本地实现合同
适用修订：`lesson3-4-v2`

## 1. 责任边界

- `core/curriculum-catalog.js`：教材来源、题目、选项、答案、实体、音频、儿童文案、阶段、复习题和验收策略的唯一真源。
- `core/story-stage-runtime.js`：主线纯状态机；不访问 DOM，不硬编码题目或答案。
- `core/story-stage-scene.js`：稳定场景 DOM、渲染、动作转发、音频请求和主线持久化。
- `core/story-review-runtime.js`：独立复习状态机、跨日本地日期门禁、独立三心池和长期结果序列化。
- `poc/lesson3-4-experience/*` 与 `poc/lesson3-4-review/*`：入口、样式和薄客户端；不得另存一份课程内容。

## 2. 主线状态

```text
stage-ready / role-ready
  ├─ PLAY → audio-playing ─ current ENDED → awaiting-response / next stage
  ├─ ANSWER(correct) → feedback audio ─ current ENDED → next internal step / next stage
  ├─ ANSWER(wrong) → same task + heart/support update
  ├─ heart = 0 → rescue-ready → changed-example audio → restart current task
  └─ role SKIP → skipped stage → next unresolved stage

completed stage ─ NAVIGATE → isolated replay ─ EXIT → exact origin state
skipped role stage ─ NAVIGATE → formal makeup ─ EXIT → origin position + updated durable facts
all stages resolved → unit-complete
```

所有音频事件携带单调递增 `requestId`。只有当前请求的真实 `ended` 推进；旧请求、失败、暂停、页面隐藏和按钮重复点击均不能推进。

## 3. 持久化

主线键：`poc:learning-experience:NCE-U02:lesson3-4-v2`

保存字段：

- `revision`, `currentStageId`
- `completedStageIds`, `skippedStageIds`
- `firstRoleId`, `completedRoleIds`, `roleStageDispositions`
- `contactedSourceRefs`, `evidenceRecords`
- `adventureHeartsRemaining`
- `journey.status`, `journey.completedStageIds`, `journey.skippedStageIds`, `journey.completedAt`
- `firstSession`, `longTermMastery`, `updatedAt`

不保存 `pendingAudio`、失败请求、面板 DOM、动画、临时提示或半段角色回合。隔离回演期间序列化原主线；正式补做只有完成后才合并真实的完成、角色、来源与证据事实。

独立复习键：`poc:learning-review:NCE-U02:lesson3-4-v2`。复习页面只读主线完成时间用于门禁，绝不写主线键。显式 `?preview=1` 仅用于视觉 QA，不得作为学习证据。

## 4. 闪烁防线

必须同时满足：

1. 背景 `<picture>`、来客、服务员和所有候选道具节点只创建一次。
2. 阶段切换只更新任务面板、文字、属性和现有道具的可见性，不替换背景、人物或道具层。
3. 任务面板不是 `aria-live`；独立状态节点只播报必要变化，避免每次更新触发整块重新朗读。
4. 当前关键图片完成 `decode()` 后才开放交互；候选格式顺序与实际 `<picture>` 一致。
5. 播放音频不改图片 URL、固定场景类、背景或人物节点。
6. CSS 不用全屏 `opacity: 0`、闪烁动画或白色空占位过渡。
7. `prefers-reduced-motion: reduce` 下禁用位移和过渡。
8. 真实浏览器完整操作要观测 `blankFrames = 0`，且背景、人物、道具节点身份保持稳定。

无闪烁是必检项，不能由单元测试、静态扫描或人工“没注意到”替代。

## 5. 失败闭锁

- 音频失败：保持原题，显示 catalog 中的失败文案和“再听一次”；不能开放未听过的答案或推进。
- 图片失败：保留固定尺寸与中性描述，不能让布局塌陷或答案变得显眼。
- 保存失败：保留内存状态并允许重试；不能乐观显示已保存。
- 依赖失败：显示可恢复启动面；不能残留覆盖全页且拦截点击的透明层。
- 复习门禁数据无效、版本不符或完成时间缺失：保持未开放。

## 6. 自动化矩阵

| 层 | 必检 |
|---|---|
| Catalog | 十阶段、标题、Source、答案规则、S07 三组与三检索、角色可跳过、复习合同 |
| Main runtime | 自然推进、音频闭锁、三心救援、assisted 证据、跳过/补做、互补角色、隔离回演、三层账本 |
| Review runtime | 次日本地日期门禁、独立心池、归零重启整次、独立长期结果、音频闭锁 |
| Fairness | 题面/标题/提示不泄露答案；匿名候选的可见与可访问名称都不泄露 |
| Static | noindex、页面无 authored answers、稳定场景节点、无根节点循环重建 |
| Audio | 文件、哈希、角色音色、起音、真实 ended；人工逐条语言听审仍独立 |
| Browser desktop | 大字授课、人物高于柜台、阶段地图、角色补做、无横向滚动、无闪烁 |
| Browser phone | 独立竖屏构图、人物缩小、主操作可见、地图可滚动、无闪烁 |
| Browser short | 任务、主要动作与退出路径不被裁切 |
| Release | 静态构建、发布边界、实际部署地址回读；需单独授权 |

## 7. 交付事实等级

以下状态必须分开写：

1. 设计决定已接受。
2. 本地代码已实现。
3. 自动化通过。
4. 真实浏览器路径通过。
5. 音频逐条人工听审通过。
6. 儿童桌面授课与手机独立使用观察通过。
7. 提交与推送完成。
8. 生产部署与地址回读通过。
9. 产品负责人最终接受。

只有第 9 项可以称为最终验收；本地技术候选不得写成“已发布”。
