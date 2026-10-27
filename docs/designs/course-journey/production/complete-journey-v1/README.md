# Lesson 31–144 人物、环境与固定提示词

2026-10-23 · 内置 `image_gen.imagegen` 生成。此包扩展 57 个配对单元、19 段横竖地图；现行界面要求以[首页统一标准 v2.0](../../2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md)为准。

共 105 次实际调用，采用 95 张运行图片，10 份改稿前版本保留凭据。

每课以当前可执行课文定义及已确认纪念卡核对人物和故事时刻，详见[故事依据](story-briefs.json)。不把提及人物自动画成在场人物，不把讨论、假设或尚未决定的事画成已完成。表内初次请求与实际修订请求均保留；[成品选择表](selected-variants.json)明确采用哪个修订。

| 单元 | 不能混淆的故事依据 | 初次请求 |
| --- | --- | --- |
| 31–32 花园观察小队 | 琼与杰克谈论花园里的萨莉和蒂姆 | [请求](requests/unit31-32.json) |
| 33–34 晴天河畔发现之旅 | 琼斯一家在桥上看小船、轮船和飞机 | [请求](requests/unit33-34.json) |
| 35–36 村庄相册探险 | 夫妻翻看村庄、河岸和学校的三张照片 | [请求](requests/unit35-36.json) |
| 37–38 书架制作小工坊 | George接到大锤，Dan在旁边，木色书架旁备有粉色油漆 | [请求](requests/unit37-38.json) |
| 39–40 花瓶安放小帮手 | Sam和Penny欣赏架上的花瓶与鲜花 | [请求](requests/unit39-40.json) |
| 41–42 购物袋里的发现 | Sam 扶着椅子上的陶橙购物袋，Penny 拿出乳酪，两人看向乳酪，袋里露出面包和牛奶 | [请求](requests/unit41-42.json) |
| 43–44 茶具躲猫猫 | Penny 指出圆茶壶后面的茶叶，Sam 露出发现的笑容，旁边是水壶和两只杯子 | [请求](requests/unit43-44.json) |
| 45–46 一封难读的信 | Pamela举着字迹潦草的信，Bob靠近一起辨认，旁边放着紫色打字机 | [请求](requests/unit45-46.json) |
| 47–48 一杯咖啡的心意 | Christine递出一块饼干，Ann端着清咖啡微笑接过，奶壶留在桌上 | [请求](requests/unit47-48.json) |
| 49–50 晚餐采购大冒险 | 老板把纸包交给Mrs. Bird，她提着采购篮微笑接过 | [请求](requests/unit49-50.json) |
| 51–52 希腊四季明信片 | Dimitri翻开四季相册，Hans指着春天的照片，两人一起交流 | [请求](requests/unit51-52.json) |
| 53–54 天气观察站 | Hans和Jim在花园天气观察站里指着方位天气板交流 | [请求](requests/unit53-54.json) |
| 55–56 索耶家的一天 | 索耶一家在温暖的夜晚读报、陪伴和做家庭作业 | [请求](requests/unit55-56.json) |
| 57–58 今天不一样 | 索耶先生今晚正读着一本有趣的书，平时看的报纸合好放在一旁 | [请求](requests/unit57-58.json) |
| 59–60 别忘了找零 | 文具店售货员把零钱递给女士，柜台上有信封、信笺簿和胶水 | [请求](requests/unit59-60.json) |
| 61–62 给 Jimmy 请医生 | 医生在家中检查Jimmy的嘴，妈妈陪在床边 | [请求](requests/unit61-62.json) |
| 63–64 Jimmy 好些了 | 医生举起两根手指提醒再休息两天，Jimmy微笑，妈妈在旁倾听 | [请求](requests/unit63-64.json) |
| 65–66 Jill 的晚间约定 | 爸爸把一枚前门钥匙递给Jill，妈妈在旁微笑，三人相向交谈 | [请求](requests/unit65-66.json) |
| 67–68 街角的周末消息 | Johnson夫人与Williams夫人在商店街相向交谈 | [请求](requests/unit67-68.json) |
| 69–70 赛车日的时光相册 | 叙述者与妻子在观众席回忆赛车日，远处是15号赛车 | [请求](requests/unit69-70.json) |
| 71–72 电话里的昨天 | Jane倾听Pauline讲述昨天的电话，桌上放着薄荷色电话与记录本 | [请求](requests/unit71-72.json) |
| 73–74 街角的短语手册 | Mills夫人与游客在车站旁翻看短语手册 | [请求](requests/unit73-74.json) |
| 75–76 鞋店里的时间线索 | 女士拿着自己的黑色样鞋，比较售货员展示的紫色鞋 | [请求](requests/unit75-76.json) |
| 77–78 诊所里的预约时间 | 克罗夫特先生扶着面颊，与拿着预约本的护士交谈 | [请求](requests/unit77-78.json) |
| 79–80 一起写购物清单 | Carol拿着笔和清单，与Tom讨论家里需要什么 | [请求](requests/unit79-80.json) |
| 81–82 晚餐前的小意外 | Carol端着烤牛肉和土豆，Tom与来访的Sam聊起午餐 | [请求](requests/unit81-82.json) |
| 83–84 出发前的行李箱 | Carol把蓝衬衫放进行李箱，Tom和来访的Sam聊假期 | [请求](requests/unit83-84.json) |
| 85–86 电影院外聊巴黎 | 电影院外，戴圆眼镜的George与拿票根的Ken聊起巴黎 | [请求](requests/unit85-86.json) |
| 87–88 修理厂里的进度单 | Wood与接待员查看仍有凹痕的汽车和维修进度单 | [请求](requests/unit87-88.json) |
| 89–90 看房时的时间线索 | Nigel拿着看房笔记，与Ian讨论待售房屋，尚未决定购买 | [请求](requests/unit89-90.json) |
| 91–92 邻居们的明日约定 | Catherine、Jenny和Linda在屋外谈论Ian明天的搬家安排与问候 | [请求](requests/unit91-92.json) |
| 93–94 新邻居的飞行手记 | 飞行员Nigel在机场窗边查看旅行手记，旁边放着地球仪与行李 | [请求](requests/unit93-94.json) |
| 95–96 车站里的时间谜题 | George拿着两张车票，与Ken一起听车站乘务员解释 | [请求](requests/unit95-96.json) |
| 97–98 蓝色箱子的归属 | Mr. Hall与服务员一起核对蓝色箱子把手上的标签 | [请求](requests/unit97-98.json) |
| 99–100 把话传清楚 | Andy坐在楼梯旁，Lucy用电话联系医生 | [请求](requests/unit99-100.json) |
| 101–102 来自Jimmy的明信片 | Penny为Grandmother读Jimmy的明信片 | [请求](requests/unit101-102.json) |
| 103–104 考场外的对话 | Gary和Richard在考场外交流 | [请求](requests/unit103-104.json) |
| 105–106 办公室的小礼物 | 老板把词典递给Sandra | [请求](requests/unit105-106.json) |
| 107–108 服装店里的比较 | 店员与女士比较蓝裙和绿裙 | [请求](requests/unit107-108.json) |
| 109–110 咖啡桌上的数量 | Charlotte给Jane递上饼干 | [请求](requests/unit109-110.json) |
| 111–112 电视机店里的比较 | Frith夫妇与店员讨论电视机 | [请求](requests/unit111-112.json) |
| 113–114 公共汽车上的零钱 | 两位流浪汉告诉售票员自己有零钱 | [请求](requests/unit113-114.json) |
| 115–116 敲门后的花园聚会 | Tom在花园里向Jim提供啤酒，Carol微笑 | [请求](requests/unit115-116.json) |
| 117–118 早餐时的意外 | 父亲不小心掉落硬币，母亲和Tommy注意到地上的动静 | [请求](requests/unit117-118.json) |
| 119–120 夜里的声音 | George微笑着看向仍在栖架上的鹦鹉Henry | [请求](requests/unit119-120.json) |
| 121–122 书店里的帽子 | 顾客戴上帽子，Caroline认出了他，经理在旁核对 | [请求](requests/unit121-122.json) |
| 123–124 旅行照片里的故事 | Mike与Scott一起看旅行照片，照片中的Mike留着络腮胡子 | [请求](requests/unit123-124.json) |
| 125–126 雨中的双人茶时光 | Peter与Susan在窗边一起喝茶，窗外正下着雨 | [请求](requests/unit125-126.json) |
| 127–128 咖啡馆里的辨认 | Kate与Liz在咖啡馆交谈，望向邻桌的两位客人 | [请求](requests/unit127-128.json) |
| 129–130 路边的一次提醒 | Gary向警察出示一张驾照，Ann在旁听他们交谈 | [请求](requests/unit129-130.json) |
| 131–132 客厅里的假期计划 | Martin与Gary在客厅看旅行资料，商量尚未确定的假期 | [请求](requests/unit131-132.json) |
| 133–134 机场采访与一份报纸 | Kate与Liz一起读报，报纸刊载Karen Marsh的机场采访 | [请求](requests/unit133-134.json) |
| 135–136 饭店里的最新消息 | Karen在饭店向记者介绍Carlos，记者用笔记本记录 | [请求](requests/unit135-136.json) |
| 137–138 美好梦想里的如果 | Brian与Julie坐在客厅交谈，桌上保留一张表格和一支铅笔 | [请求](requests/unit137-138.json) |
| 139–140 电话那头的问话 | Graham Turner在办公室用电话交谈，John Smith在户外线路旁接听 | [请求](requests/unit139-140.json) |
| 141–142 Sally的火车初体验 | Sally和妈妈坐在火车一侧，蓝外套女士在对面拿着粉盒化妆 | [请求](requests/unit141-142.json) |
| 143–144 树林里的告示牌 | 树林局部：作者、告示牌背面、空废物筐和地面杂物 | [请求](requests/unit143-144.json) |

19 个环境主题及课程范围见故事依据中的 themes。横竖分别生成，以已验收 visits 环境为构图参照，保留相连奶油石路、珊瑚拱墙、青绿水面和三处站立区。人物、人物携带的道具、真实成绩、课名分别处理；背景不烘焙星星、金章、Lesson 编号或交互标记。

原生 PNG 与生产 WebP 保存在 `assets/course-journey/`，文件名由每份 receipt 指向。PNG 逐字节保留；WebP 仅编码，没有缩放、裁切、改色或程序抠图。alpha > 0／16／128 的实际边界均记录，运行位置采用 > 16；提示词中的透明边距是生成目标，实际位置必须重新测量，不能把目标当成测量结果。

生成请求在 [requests](requests/)，每份 receipt 保存引用顺序、透明开关、原输出路径、原生文件时间、尺寸、SHA 和 alpha。采用前检查角色身份、关键道具、全身轮廓及页面摆放；修订未覆盖初稿。

运行：

```powershell
node docs/designs/course-journey/production/complete-journey-v1/replay-prompt.cjs --verify
node docs/designs/course-journey/production/complete-journey-v1/replay-prompt.cjs unit141-142-cutout
```

重放脚本只校验并输出请求，不调用生成服务。[manifest](manifest.json)锁定输入、每次请求、原图、生产图及布局快照；已有成品优先复用，固定输入不能保证随机生成逐像素一致。[规则](rules.md)记录本轮具体要求，[布局快照](placement.json)记录实际落点。
