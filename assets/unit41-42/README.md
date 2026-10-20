# Lesson41–42现行课堂素材（2026-10-17）

本轮新增三张透明全身人物`cast-sam-v153.webp`、`cast-penny-v153.webp`、`cast-penny-bag-v153.webp`，使用内置imagegen；[完整提示词、参考图与原稿](../../scripts/art/unit41-42-v153-prompts.json)保留。原纪念卡v4及所有旧图片不覆盖。

`bag-v153.svg`、`chair-v153.svg`、`table-v153.svg`是课堂分层道具；16个`reference-编号-v153.svg`恢复原图位置关系。`pound-v153.svg`、`half-v153.svg`、`quarter-v153.svg`仅把原标签转为本地Nunito轮廓，[生成脚本](../../scripts/art/unit41-42-quantity-labels.py)保留原比例与1／2、1／4含义。

前五句按课本首图保持手提袋，进入物品展示后袋子放在椅上。整理任务中两瓶奶总数不变，同一次正确检查只移动原节点；重试或刷新后按实际记录恢复。所有人物头手脚完整，物品和支撑面按可见轮廓对齐。

原卡及其Round／Book字体按用户旧证保护要求保持，不将其重新宣布为新课通用字体。详见[重构与验收](../../docs/butcher-version/2026-10-17-1900-v2.0-Lesson41-42统一标准重构与验收.md)。

---

以下保留此前素材说明：

# Lesson 41–42 图形素材

原生SVG，沿用深棕描边、圆角和抽象人物画风。Sam、Penny延续相邻教材中的身份，重新安排指椅子／提购物袋的姿态；储物间、购物袋、椅子与本课物品单独绘制。

- `cover-scene.svg`：完整封面，可独立显示。
- `sam.svg`、`penny.svg`、`room.svg`、`chair.svg`、`table.svg`、`bag.svg`：课文与整理任务的分层素材。
- 物品与量词SVG：图鉴、选项及数量检查共用；tobacco只有无品牌封闭罐子，不含吸烟动作。
- `sam-point.svg`、`sam-look.svg`、`penny-place.svg`、`penny-show.svg`：同一人物的指向、查看、放袋和展示姿态。
- `completion-scene.svg`：两人、椅子与装好物品的购物袋；`cup.svg`、`two-loaves.svg`：语法短示范。
- `keepsake-story-v4.webp`：当前纪念卡候选稿，内置 imagegen 参照 Lesson 1–2／3–4 认可插画生成。Sam 扶袋、Penny 举起乳酪，袋子落在椅面，面包和牛奶可见；人物衣着、提手和方扣与舞台统一。课程、悬浮卡、账号纪念册和 GIF 共用；奖励版号不变。原始 PNG、完整提示词与来源见[本轮素材记录](../../docs/butcher-version/evidence/2026-10-12-1342-unit41-42/manifest.json)。待用户目视确认，不作为新的共用样板。
- `keepsake.svg`、`keepsake.webp`、`keepsake-closeup.webp`、`keepsake-story-v3.webp` 保留为历史稿，不用于当前卡面。

纪念卡采用本课人物、道具的半身互动近景，不直接拼入舞台缩略图。对照认可卡面检查表情、手与道具的接触、纸面融合及缩小后的辨识度，再检查手机、悬浮卡、纪念册和导出；功能检查通过不能替代这些目视判断。

三张统计卡仍使用 `assets/unit1-2/completion/` 中用户认可的 imagegen 星／勾／叉，不在本目录再绘制一套。
