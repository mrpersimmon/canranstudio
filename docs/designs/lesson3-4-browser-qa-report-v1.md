# Lesson 3–4 浏览器验收记录 V1

日期：2026-08-31
候选版本：`lesson3-4-v1`
本地入口：`/poc/lesson3-4-experience/`
状态：本地 POC 技术验收通过；未提交、未发布；42 条候选音频仍需逐条人工听审。

## 1. 验收范围与结论

| 检查面 | 结果 | 证据 |
|---|---|---|
| 十段主线 | 通过 | S01–S10 由真实页面完成，最终 `completedStageIds = 10` |
| 固定场景 | 通过 | 全流程背景节点与两个人物节点实例均保持不变 |
| 图片完整性 | 通过 | 桌面、手机、短屏的可见图片 `naturalWidth > 0`，空图为 0 |
| 答案公平 | 通过 | S09 三个人物在作答前均只显示 `？`；题面不重复接受答案 |
| 真实音频门槛 | 通过 | 未模拟播放时，S01 与 S02 依次请求 13 个 MP3；S02 在 D01–D12 全部 `ended` 后才开放答案 |
| 控制台 | 通过 | 全新会话加载后 0 error、0 warning |
| 桌面 | 通过 | 1600×1000，无横向滚动；人物高于柜台；文字适合授课 |
| 手机 | 通过 | 390×844，无横向滚动；人物缩小；主按钮与选项可见 |
| 短屏 | 通过 | 1280×720，任务卡、五个物品和完成按钮均未裁切 |

## 2. 本轮发现并封堵的根因

1. **窄图黑块**：`sharp resize(..., fit: contain)` 未指定背景，透明区域被补为不透明黑色。现在所有尺寸显式使用透明补边，并由“不透明近黑占比”回归测试阻止复发。
2. **高速切题空卡**：页面选择 AVIF，但旧预加载器只加载 WebP。现在按 `AVIF → WebP → PNG` 的真实选择顺序预解码，当前阶段完成解码后才切换，下一阶段后台预热。
3. **道具尺寸失控**：`<picture>` 有高度而内部固有 640px 图片没有受约束。现在外层和图片共用确定方框，图片绝对定位在方框内。
4. **道具悬空/落到柜台前板**：锚点以视口底部而非台面接触线计算。现在桌面与手机分别固定到青绿色台面接触基线。
5. **完成页沿用旧标题**：完成后回看旧阶段再刷新，会以旧阶段索引渲染完成态。现在完成态强制恢复最后阶段，并由 catalog 提供独立完成标题和说明。
6. **无效预载警告**：HTML 预载 WebP、实际渲染 AVIF。现在首屏预载与可见格式一致，全新会话控制台为 0 warning。

## 3. 自动化结果

- Unit：`317 / 317` 通过。
- Deploy contracts：`95 / 96` 通过。
- 唯一未通过项是静态发布器的预期保护：工作区公共输入尚未提交到 HEAD，因此拒绝生成带 HEAD 指纹的发布包。这不是页面故障；在获得提交/发布授权后才应解除该条件。
- Lesson 3–4 专项覆盖：catalog、答案公平、透明素材、多格式衍生物、防闪烁 DOM、真实 `ended`、角色互换、刷新恢复、音频失败重试。

## 4. 视觉证据

- [桌面 S01](evidence/lesson3-4/desktop-s01.webp)
- [桌面 S03：5 号牌位于柜台台面](evidence/lesson3-4/desktop-s03-ticket.webp)
- [桌面 S07：五项练习册](evidence/lesson3-4/desktop-s07-album.webp)
- [桌面 S09：人物标签未泄露](evidence/lesson3-4/desktop-s09-hidden-labels.webp)
- [桌面完成页](evidence/lesson3-4/desktop-complete.webp)
- [手机 S01](evidence/lesson3-4/mobile-s01.webp)
- [手机 S07](evidence/lesson3-4/mobile-s07.webp)
- [手机 S09](evidence/lesson3-4/mobile-s09.webp)
- [手机完成页](evidence/lesson3-4/mobile-complete.webp)
- [短屏 S07](evidence/lesson3-4/short-s07.webp)
- [短屏完成页](evidence/lesson3-4/short-complete.webp)

## 5. 尚未跨越的边界

1. 42 个音频文件的引擎、音色映射、时长、起音、哈希和真实播放链路均已通过技术检查，但 `manifest.status` 仍为 `local-poc-candidate-unreviewed`。代表性试听不能替代全量逐条语言听审。
2. `NCE-U02` 仍是 `candidate / local-poc / publicationAllowed: false`。本记录不等同于发布验收。
3. 本轮没有执行 commit、push、部署或把课程入口加入公开地图。
