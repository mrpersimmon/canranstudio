# Lesson 19–30 人物与环境固定包

2026-10-22 至 2026-10-23，内置 `image_gen.imagegen` 生成。当前界面规范继续使用[首页统一标准 v2.0](../../2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md)，本包保存素材来源和实际生成过程。

| 单元／地图段 | 最终资产名 | 故事标识 |
| --- | --- | --- |
| 19–20 冰淇淋休息站 | `icecream-family-v1` | 妈妈与两个孩子，两份粉色冰淇淋；花园休息区与推车。 |
| 21–22 寻物交接站 | `red-book-pair-v1` | 灰发胡须男士已经接过红书，Jane 双手空着。 |
| 23–24 房间寻物队 | `shelf-glasses-pair-v1` | 同一对成人；男士双手托着三只玻璃杯，Jane 已递交。 |
| 25–26 厨房探访记 | `kitchen-host-v1` | Mrs. Smith、桌上的空瓶和干净杯子；蓝电炉在左、白冰箱在右。 |
| 27–28 客厅发现之旅 | `living-room-host-v1` | 同一位 Mrs. Smith 与紫色扶手椅；客厅的电视、窗户、桌子、音响和门。 |
| 29–30 房间整理行动 | `tidy-room-pair-v1` | 灰发盘髻的 Mrs. Jones 与持扫帚的 Amy，保留蓝裙、围裙与紫裙身份。 |
| Lesson 19–24 | `kindness-mobile-v1`／`kindness-desktop-v1` | 冰淇淋花园、阅读角、搁板小屋，竖横分别生成。 |
| Lesson 25–30 | `home-mobile-v1`／`home-desktop-v1` | 三处开放式房间与相连的奶油石路，竖横分别生成。 |

生产 PNG／WebP 位于 `assets/course-journey/`。原生 PNG 逐字节保留；WebP 仅编码，没有缩放、裁切、改色、抠图或重新绘制。素材使用实际 alpha，几何按 alpha > 16 测量，> 0 和 > 128 的范围也分别保存。原输出留在工具生成目录，项目不依赖该目录运行。

共 **11 次实际调用**：六个人物初稿／关联变体、一份扫帚角度修订、四份环境。21–22 的已采用人物作为 23–24 编辑目标，25–26 的已采用人物作为 27–28 编辑目标，锁定同一角色身份；29–30 初稿的扫帚遮住内侧鞋，修订后四只鞋完整可见。初稿保存在 `drafts/`，没有用最终请求冒充初次生成。

完整请求在 [requests/](requests/)；每个 job 的 receipt 写明引用顺序、透明开关、工具原输出路径、原生文件时间、实际尺寸和 SHA。`createdDate` 按原生文件修改时间转换到上海日期，制作过程跨越午夜。[rules.md](rules.md)记录故事事实和排除项；[placement.json](placement.json)记录此次交付落点。星章、课名、当前标记与动效均由网页绘制，图片没有烘焙成绩。

在仓库根目录运行：

```powershell
node docs/designs/course-journey/production/daily-life-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/daily-life-v1/replay-prompt.cjs unit23-24
```

脚本校验 [manifest.json](manifest.json) 的锁定文件，并仅输出可重建的请求；不调用生成服务。引用路径会映射到当前工作树中的同哈希文件，提示词原文和引用顺序保留。固定输入有助于画风一致，不能承诺随机重生成逐像素相同；已有验收成品优先复用。
