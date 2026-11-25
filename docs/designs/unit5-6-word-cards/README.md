# Lesson 5–6 绘本词卡与短推进按钮

**2026-11-09现行要求：** 词卡必须与本课剧场、原纪念卡保持同一画风，按[教学单元统一标准第4.1节](../../butcher-version/publish/2026-10-24-2200-v1.55-教学单元设计标准与验收清单.md#41-词卡剧场与纪念卡的视觉一致性2026-11-09)逐张并排验收。人物、道具、纸感、线条、配色与光照一起核对；仅调整卡框或通过布局回归不算完成美术统一。原纪念卡保留，新增素材优先复用同课采用图，并记录参考图与完整提示词。

下文保留2026-10-30的实施与生成历史。248–254px固定卡高及当时展开方式不作为当前手机规范；现行布局依统一标准第3.1节和[完整页面复查](../learning-flow/2026-11-08-lessons1-6-complete-audit.md)。本次补充规则，不据此把历史词卡标记为已通过新的画风验收。

2026-10-30 · `codex/book-version` · 本地开发结果，尚未提交、推送或发布。

## 问题与范围

用户在387×741手机页面发现：完成页“下一站”与“教室小剧场”分别挤成多行；Volvo等词卡还是早期小SVG汽车，厚棕边框、大留白，与已认可剧场及纪念卡不一致。

根因是共用结算组件把完整目的地拆成两个可见span，以及旧词卡图容器过小、样式继续继承通用选择按钮。修正范围为全部72个配对单元及兼容Lesson49的同类推进按钮，以及Lesson 5–6的24张词卡。其他课程词卡不在本次美术更新范围。

## 实现规则

- 可见推进文案只用“下一站”；`aria-label`仍说明完整目的地，原点击路由不变。最后的“查看纪念卡”保留。
- Lesson 5–6沿用寒蝉圆黑／Nunito和IPA Arial。卡面用原纪念卡纸纹，底色`#fffcf5`、1.5px柔棕边、17px圆角与轻阴影；展开用绿色提示，键盘焦点独立可见。
- 手机两列、宽屏三列；卡高约248–254px。插图使用contain，完整保留车轮、后视镜、人物头脚和约8%素材安全边距。英文20px（窄屏18px）、音标14px（窄屏13px），不靠切字适配。
- 点击整卡展开中文与已有例句，英文、音标继续可见；插图在卡内缩小，卡片外框和邻卡不移位。可再次收起，支持键盘与触摸；不把翻卡计为答题或授星。
- 六辆汽车和morning／good的太阳是新生成插画；student、Mr.、Miss、new复用现有剧场人物；nice／meet复用纪念卡插图；too用鲁明和晓惠；make用两辆汽车组合。八张国别词保留准确的现有国旗。
- `wordArtwork()`只服务词卡，原`image()`继续服务题目与参考材料。原内容、音标、音频、答案、国别、内容版本及历史纪念卡未改。

## 参考与生成记录

画风基准为[认可纪念卡插图](../../../assets/awards/unit5-6-friends.webp)与[Mr. Blake剧场人物](../../../assets/unit5-6-current/blake-v154.webp)。旧汽车SVG先确定性栅格化作造型参考，保留原色和基本轮廓，不把品牌教学改为真实车型识别。

| 词卡素材 | 固定身份 | 真实调用、历次取舍与来源 |
| --- | --- | --- |
| Volvo | 灰青色方正旅行车 | [volvo.json](production/volvo.json) |
| Peugeot | 蜂蜜黄色圆顶紧凑车 | [peugeot.json](production/peugeot.json) |
| Mercedes | 浅紫灰长三厢车 | [mercedes.json](production/mercedes.json) |
| Toyota | 陶土珊瑚色紧凑三厢车 | [toyota.json](production/toyota.json) |
| Ford | 灰蓝色方正汽车 | [ford.json](production/ford.json) |
| Mini | 鼠尾草绿短圆双门车 | [mini.json](production/mini.json) |
| morning | 奶油云、低位金太阳与淡青远景 | [morning.json](production/morning.json) |

每个独立素材通过内置imagegen单独生成，透明背景开启；实际发送的完整提示词以对应JSON为准。下列模板用于后续延展，不替代实际生成记录：

```text
Use case: style-transfer. Make one transparent vocabulary-card illustration.
Image 1 is the original object reference; the approved keepsake and theatre
portraits are style references only. Preserve the subject's identity and color.
Use warm dark-brown hand-drawn outlines, soft matte paper-textured fills,
restrained highlights and gentle volume, like the same children's picture book.
Show the complete object facing right. Keep about 8% safe margins and a small
local grounding shadow. True transparent RGBA background; no white sticker edge,
halo, scene, text, brand badge, watermark, people or extra objects.
Keep the silhouette readable at mobile vocabulary-card size.
```

三分之四视角允许自然遮挡的远侧轮胎局部，不为追求机械的“两轮像素计数”反复重画；禁止多余、悬空或重复车轮。Mercedes第三稿偏写实，复核后追加第四稿，简化灯具、轮毂与反光；旧来源及哈希留在记录中。

选用源图在`assets/unit5-6-word-cards/raw/`。运行WEBP等比缩到640×440以内，quality88、alphaQuality100、effort6；7图共约219KiB。各文件尺寸、字节和SHA见[web-assets.json](production/web-assets.json)。课程包登记7张采用图，原PNG和生成记录不作为课程资源公开。

## 验证与限制

实施检查和失败记录见[design-qa.md](design-qa.md)。本轮仅做相关功能检查，没有执行全量CI、全部72课完整作答链或真实安卓微信／夸克测试；浏览器模拟尺寸不能视为真机通过。

本地预览：`http://127.0.0.1:4198/unit5-6/#learn/words`。使用独立演示账号，不修改官网学生成绩。
