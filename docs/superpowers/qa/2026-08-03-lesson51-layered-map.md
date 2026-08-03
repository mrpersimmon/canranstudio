# Lesson 51 分层地图发布 QA

## 发布范围

Lesson 51「希腊四季之旅」成为“暖灯集市”的第二个正式学习地点。Lesson 49 保留完整累计快照模式；Lesson 51 使用固定底图和五张独立成长图层，两种模式由共享课程目录显式声明，页面不再根据文件名或课程编号猜测。

## 状态合同

- 0/5：只渲染 `landmark-base.png`；
- 1/5–4/5：固定底图，并按真实完成阶段叠加对应图层；
- 5/5：底图加五层完整花园，另行显示“四季导游罗盘”；
- 稀疏阶段：只显示 `completedStages.lesson51` 中真实存在的阶段；
- Lesson 49：每个状态仍只渲染一张完整快照，未迁移成图层模式。

所有 Lesson 51 正式图像均为 `1024 × 1024` PNG 固定画布并带透明通道。移动预览是底图与五层的发布衍生图，不参与成长状态；纪念物没有烘焙进第五层。

## 自动化证据

候选工作区验证：

```text
63 unit tests passed
221 Playwright tests passed
68 deploy tests passed on a clean committed snapshot
static artifact built successfully
```

新增或扩展的门禁包括：

- 课程目录拒绝未知地标渲染模式；
- Lesson 51 从 0/5 到 5/5 始终保留一张底图，并累计显示零至五张独立图层；
- 每张页面图像的自然尺寸为 `1024 × 1024`，地点框尺寸不随状态变化；
- 390×844、768×1024、1024×768 均无页面横向溢出；
- 完成 Lesson 49 后，推荐自然推进到 Lesson 51；
- 发布合同校验 Lesson 49 与 Lesson 51 的底图、成长图、纪念物和移动预览尺寸与透明通道。

## 浏览器证据

应用内浏览器在 752px 平板视口读取已有 Lesson 51 2/5 进度，页面实际渲染：

1. `landmark-base.png`；
2. `growth-01-weather.png`；
3. `growth-02-theatre.png`。

页面宽度等于视口宽度，控制台没有错误。真实微信、iPhone Safari 与 Android Chromium 仍须执行 `docs/mobile-release-smoke-checklist.md`，不得由桌面模拟替代。
