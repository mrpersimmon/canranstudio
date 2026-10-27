# Lesson25–48 连续环境与固定提示词

2026-10-25开始，2026-10-26完成。使用内置 `image_gen.imagegen`，实际8次调用，最终采用4张环境；12组人物与道具直接复用原文件。当前规则见[统一标准4.12](../../2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md#expansion-25-48)，实际页面验证见[实施记录](../../2026-10-26-Lesson25-48连续入口实施记录.md)。

| 章节 | 最终文件 | 构图与体积 |
| --- | --- | --- |
| 25–30 温暖居室 | [原生PNG](../../../../../assets/course-journey/modules-v6/home-interior-v3.png)、[网页WebP](../../../../../assets/course-journey/modules-v6/home-interior-v3.webp) | 厨房、客厅、卧室共用连续浅色瓷砖地面；276,052字节WebP。 |
| 31–36 河谷绿道 | [原生PNG](../../../../../assets/course-journey/modules-v6/outdoors-riverwalk-v1.png)、[网页WebP](../../../../../assets/course-journey/modules-v6/outdoors-riverwalk-v1.webp) | 花园小路、河上桥面、村庄观景路连通；526,300字节WebP。 |
| 37–42 手作小院 | [原生PNG](../../../../../assets/course-journey/modules-v6/making-workshop-v2.png)、[网页WebP](../../../../../assets/course-journey/modules-v6/making-workshop-v2.webp) | 木工棚、花艺露台、整理角通过暖色砖路相连；441,844字节WebP。 |
| 43–48 茶香会客馆 | [原生PNG](../../../../../assets/course-journey/modules-v6/hospitality-sunroom-v2.png)、[网页WebP](../../../../../assets/course-journey/modules-v6/hospitality-sunroom-v2.webp) | 茶具、书信与咖啡场景位于连续木地板的玻璃花房；422,980字节WebP。 |

采用图全部为原生724×2172、1:3不透明RGB图。PNG逐字节复制生成结果；WebP仅quality90编码，没有裁切、缩放、调色、拼接或程序抠图。原人物保留原始SHA，不为融合重新生成角色。

## 完整请求与版本取舍

- [requests.json](requests.json)：最初4次完整请求，参考顺序均为 `modules-v5/visits-gallery-v1.png`、`modules-v5/kindness-courtyard-v1.png`。
- [revisions.json](revisions.json)：居室第2稿、会客馆第2稿的精确编辑请求。
- [making-revision.json](making-revision.json)：去掉手作小院第三站前景横墙，保持砖路和星章／Lesson信息区通畅。
- [home-relations-revision.json](home-relations-revision.json)：杂志放在电视机上、书放在收音机上，保留窗边电视和门边收音机的空间关系。
- [receipt.json](receipt.json)：8次实际输出、采用／未采用原因、原生尺寸与输出SHA。
- [reference-inputs.json](reference-inputs.json)：6个不同输入图的原路径、仓库内同字节副本、SHA及文件时间。文件mtime只作来源证据，不冒充生成时间。

居室第1稿的地毯侵入站位附近，冰箱还带有小标记，因此未采用；第2稿修正后又发现电视／收音机上的物品关系不准确，第3稿最终采用。手作第1稿在完整手机组合中发现前景墙与绿篱穿过星章／Lesson区域，第2稿移除。会客馆第1稿实际为724×2171，不满足精确1:3，保留原稿并重新编辑生成724×2172。河谷第1稿直接采用。

手作最终环境仍有一个位于支撑区域外的空工作台，与提示词的严禁额外前景家具有所偏离；组合页中它不遮挡人物，也不重复主角书架／工具，按实际结果接受并在收据保留偏差。没有把提示词视为生成结果已经合规的证明。

重新生成时使用对应完整请求、有序参考及相同SHA的输入。优先复用已采用文件；相同提示词不能保证随机生成逐像素一致。任何新输出仍须独立核对尺寸、故事关系、接地、前景遮挡和真实页面。

## 原人物、接地与成果归属

[contact-calibration.json](contact-calibration.json)保存12组原人物SHA、可见轮廓及67个实际可见鞋底、桌椅腿、书架支点、扫帚末端、推车轮、打字机支架脚等源像素接点。被遮住的鞋子不补造接点；39–40沿用此前独立标定的支撑点。河谷三个站位分别标定铺地范围，不能以整章宽矩形把水面也算成安全地面。

[placement.json](placement.json)单独保存运行时位置和同源补片参数。新标定轮廓右／下边使用像素外沿，历史运行时边界使用末像素下标，两者相差一个源像素。真实星章距离按12–16 CSS px验收，不能因边界约定不同声称精确等于14px，或改动原图来凑整数。

31–32不额外画未出场儿童与宠物；33–34原人物层已有飞机，环境不再重复；35–36原相册小照片保留。37–42的书架、花瓶、购物袋与椅子来自原人物层；43–48的茶车、打字机与咖啡饼干也不在背景重复生成。

## 只读冻结校验

```powershell
node docs/designs/course-journey/production/modules-v6/verify-manifest.cjs
```

固定36个文件：全部采用与未采用原稿、已有编码文件、4份请求文件、收据、参考记录、接地标定、位置快照、12组原人物和2张v5参考图。脚本只读比较固定SHA与长度，不接收参数、不改基线、不调用生成服务。README、运行代码、测试和截图不在这份美术冻结清单中。旧生产包保持原字节。
