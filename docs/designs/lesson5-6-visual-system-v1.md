# Lesson 5–6 视觉系统与素材登记 V1

状态：本地候选实现契约
单元：`NCE-U03`
体验修订：`lesson5-6-v1`

## 1. 视觉命题

- 主题：夜晚的星光迎新厅，教师与新生站在一张星图桌前，后方连着汽车品牌展台。
- 风格：温暖舞台式儿童故事书；深蓝玻璃、胡桃木、黄铜和青绿色织物，与 Lesson 1–4 同属一个世界但不复刻失物招领站。
- 信息层级：故事人物和当前英文优先，任务纸面只承载一次主要操作；不显示爱心、奖励条、知识卡或通用后台组件。
- 授课模式：电脑端人物和字体明显大于手机端；人物在同一设备档与连续场景中比例不跳变。

## 2. 色彩与排版

| 令牌 | 值 | 用途 |
|---|---|---|
| `--unit-accent` | `#65d3c2` | 主按钮、说话状态、进度 |
| `--unit-accent-deep` | `#1c7774` | 描边、焦点 |
| `--unit-gold` | `#efbd59` | 舞台黄铜、当前阶段 |
| `--unit-paper` | `#fff4d5` | 可读任务面 |
| `--unit-ink` | `#3a241d` | 主文字 |

中文展示使用 `ZCOOL KuaiLe`，英文与按钮使用 `Fredoka / Baloo 2`。桌面主问题不小于 30px、选项不小于 20px；手机主问题不小于 24px、触控文字不小于 17px；触控目标至少 48×48px。

## 3. 双画幅与场景锚点

- 宽版背景：`scene-welcome-hall-v1-wide.*`，1920×1200。
- 竖版背景：`scene-welcome-hall-v1-portrait.*`，900×1600。
- 宽版人物高度约 `48–60vh`，脚底与舞台桌面基线一致；手机人物约 `24–34vh`，为任务面板留出空间。
- 物品接触面由 catalog 的 `contactSurfaceY.wide = 75`、`portrait = 73` 声明；页面不得为某个阶段写像素坐标补丁。
- 短屏允许整页自然纵向滚动，不在任务卡内部制造滚动条，也不隐藏人物或主要操作。

## 4. 成品素材登记

背景：

- `poc/lesson5-6-experience/assets/scene-welcome-hall-v1-wide.{png,webp,avif}`
- `poc/lesson5-6-experience/assets/scene-welcome-hall-v1-portrait.{png,webp,avif}`

人物：`character-mr-blake`、`character-sophie`、`character-hans`、`character-naoko`、`character-changwoo`、`character-luming`、`character-xiaohui`，每项均有 900×900 透明 PNG 及 640×640 WebP/AVIF。

车辆：`vehicle-volvo`、`vehicle-peugeot`、`vehicle-mercedes`、`vehicle-toyota`、`vehicle-mini`、`vehicle-ford`，同样提供 PNG/WebP/AVIF 三格式。车辆仅表现不同造型与色彩，不使用真实商标图形。

原始生成文件保存在 `poc/lesson5-6-experience/assets/generated-source/`：

- `welcome-hall-background-v1.png`
- `welcome-characters-atlas-v1.png`
- `welcome-cars-atlas-v1.png`

唯一派生流程：`scripts/extract-lesson5-8-generated-assets.mjs`。脚本先移除与外部连通的中性背景，再缩入 828×828 内容区并加 36px 透明安全边，最终画布严格为 900×900；测试同时检查 alpha 最小值 0、最大值 255。

## 5. ImageGen 生成记录

背景提示摘要：

> 儿童故事书式星光迎新画廊，夜晚、深蓝玻璃、胡桃木和黄铜，一张中央青绿色星图桌，留出人物与任务面板安全区；无人物、无文字、无标志、无水印。

人物图集提示摘要：

> 4×2 全身人物图集，依次为友善男教师、Sophie、Hans、Naoko、Chang-woo、Luming、Xiaohui、空格；暖色舞台光、清楚轮廓、角色互不接触、无文字标签。

车辆图集提示摘要：

> 3×2 六辆造型与色彩明显不同的复古小汽车，适合儿童辨认，三分之四视角，彼此不重叠，无人物、无品牌标志、无文字。

生成使用内置 ImageGen；任何原始图都不能直接当正式切图，必须经过派生脚本和透明背景测试。

## 6. 防闪烁与可辨认约束

1. 背景 `<picture>`、两名舞台人物和外层 shell 首次挂载后保持节点实例不变。
2. 阶段变化只替换任务面板与当前候选容器；音频播放不改图片 URL。
3. 当前素材完成 `decode()` 后再开放交互，下一阶段在后台预热；顺序为 AVIF → WebP → PNG。
4. 禁止全屏 `opacity: 0`、循环呼吸和阶段切换背景；降低动效模式下去掉位移。
5. 人物、汽车卡初始等亮、等尺寸、等描边；正确项答前不得独占发光。
