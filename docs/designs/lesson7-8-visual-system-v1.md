# Lesson 7–8 视觉系统与素材登记 V1

状态：本地候选实现契约
单元：`NCE-U04`
体验修订：`lesson7-8-v1`

## 1. 视觉命题

- 主题：午夜职业茶会。Robert 与 Sophie 在温暖圆桌边交换姓名、国籍和职业，职业徽章墙依次亮起。
- 风格：同属星灯世界的胡桃木与深蓝舞台，但加入酒红、墨绿和黄铜圆章，区别于迎新厅与失物招领站。
- 职业图优先清楚表达服装、工具和姿态，不靠文字或现实机构标志辨认。
- 页面保持故事舞台感；职业图片直接成为候选，不在任务面板复制第二套缩略图。

## 2. 色彩与排版

| 令牌 | 值 | 用途 |
|---|---|---|
| `--unit-accent` | `#d97872` | 主按钮、说话状态 |
| `--unit-accent-deep` | `#7f3544` | 描边、错误支持 |
| `--unit-gold` | `#e9b94e` | 职业徽章与进度 |
| `--unit-paper` | `#fff1d0` | 任务纸面 |
| `--unit-ink` | `#3b231d` | 主文字 |

字体与触控基线沿用共享故事舞台：电脑端远距离可读、手机端不缩放整页；中文主问题桌面不小于 30px，手机不小于 24px，按钮至少 48×48px。

## 3. 双画幅与场景锚点

- 宽版背景：`scene-career-salon-v1-wide.*`，1920×1200。
- 竖版背景：`scene-career-salon-v1-portrait.*`，900×1600。
- Robert 左、Sophie 右；宽屏人物约 `48–60vh`，手机约 `24–34vh`，脚底基线在整个连续单元中稳定。
- catalog 接触面：`wide = 71`、`portrait = 69`；职业图按相对锚点落在圆桌或徽章墙，不悬浮、不临时生成白色底座。
- 1280×720 等矮屏使用页面级纵向重排，不制造卡片内滚动，也不裁掉主要操作。

## 4. 成品素材登记

背景：

- `poc/lesson7-8-experience/assets/scene-career-salon-v1-wide.{png,webp,avif}`
- `poc/lesson7-8-experience/assets/scene-career-salon-v1-portrait.{png,webp,avif}`

人物：`character-robert-v1.*` 与复用的 Sophie。Robert 提供 900×900 透明 PNG 及 640×640 WebP/AVIF。

职业：`job-policeman`、`job-policewoman`、`job-taxi-driver`、`job-air-hostess`、`job-postman`、`job-nurse`、`job-mechanic`、`job-hairdresser`、`job-housewife`、`job-milkman`，每项均有透明 PNG/WebP/AVIF 三格式。

原始生成文件：

- `poc/lesson7-8-experience/assets/generated-source/career-salon-background-v1.png`
- `poc/lesson7-8-experience/assets/generated-source/character-robert-source-v1.png`
- `poc/lesson7-8-experience/assets/generated-source/jobs-atlas-v1.png`

派生脚本为 `scripts/extract-lesson5-8-generated-assets.mjs`，成品画布、透明安全边和 alpha 测试与 U03 完全一致。

## 5. ImageGen 生成记录

背景提示摘要：

> 儿童故事书式午夜职业沙龙，深蓝夜色、胡桃木墙、黄铜职业徽章和中央温暖圆桌，预留左右人物与中部任务安全区；无人物、无文字、无现实标志。

Robert 提示摘要：

> 友善年轻男性 Robert 的全身儿童故事书人物立绘，适合正式但轻松的午夜职业茶会，暖色舞台光，清楚轮廓，独立浅色背景，无文字和水印。

职业图集提示摘要：

> 5×2 十种全身职业人物图集，严格按 policeman、policewoman、taxi driver、air hostess、postman、nurse、mechanic、hairdresser、housewife、milkman 排列；服装和工具清楚、互不重叠、无标签和现实品牌。

生成使用内置 ImageGen。`air hostess` 等历史教材称谓只作为受控教材 Source 保留；美术以尊重、非讽刺、适龄方式呈现。

## 6. 防闪烁与可辨认约束

1. 背景、Robert、Sophie 和 shell 节点跨十阶段保持同一实例。
2. 职业图在交互开放前预解码；当前格式失败才回退，不让白色占位帧露出。
3. 选择反馈只影响被点击实体，不重建整页，不切换背景。
4. 桌面职业图的可见短边必须足以远距离辨认；手机至少保留 72px 有效主体，不能只靠英文标签。
5. 答前全部职业图等尺寸、等明度、等边框，禁止正确项默认高亮。
