# Lesson 17–30 场景素材

后续开发的共用依据为[统一标准v1.54](../../docs/butcher-version/publish/2026-10-18-0843-v1.54-教学单元设计标准与验收清单.md)；本页保留旧素材工具的使用范围，不把历史画风当作新课样板。已有实现见[逐课舞台整改](../../docs/butcher-version/2026-09-27-1202-v2.1-Lesson17-30逐课舞台整改与验收.md)。

## 现行图内字体（2026-10-19）

[本轮修复](../../docs/butcher-version/2026-10-19-1222-v1.0-剧情提示图内字体与历史成果修复.md)统一26个单元179幅当前SVG的688个标签。清单为 [course-diagram-fonts.json](course-diagram-fonts.json)，处理脚本为 [normalize-course-diagram-fonts.py](normalize-course-diagram-fonts.py)。外链SVG不会继承页面字库；脚本将文字转成本地已许可寒蝉圆黑400／500、Nunito400／600轮廓，保留原路径、图值、锚点、viewBox和非文字图形。旧证必要素材不在清单内。

Python需要 `lxml`、`fonttools[woff]`（本轮使用4.66.1）；运行 `python scripts/art/normalize-course-diagram-fonts.py --report output/diagram-fonts-review.json` 可预检，加 `--apply` 才写文件。源字体为仓库 `assets/awards/fonts/` 下的 `award-nunito.woff2`、`lesson-gothic-body-400.woff2`、`award-gothic-500.woff2`，许可沿用该字体目录记录。脚本不联网下载字体，也不从输出缓存取字库。

若旧绘图工具重新生成清单内SVG，随后再次执行字体处理并目视当前课页。已转轮廓的文件重复执行不改变；修改标签应先改相应绘图源再生成，不能靠重复转换改变现有轮廓。4个长标签在 `WIDTH_LIMITS` 中限制宽度，以原锚点等比缩字保留框内边距；这是本次图框的局部适配，不是新课统一字号或题量配额。标签、数字与图形核对后仍需检查实际显示尺寸、裁切与资源体积；转换成功不能替代验收。

## 历史及逐课绘图工具

`redraw-classroom-stages.py` 是七课矢量素材的绘图源。每次显式指定一课，例如 `python3 scripts/art/redraw-classroom-stages.py 19-20`。它更新该课人物 SVG、封面、场景、纪念图和 `scene.js`；不修改题稿、答案或学习记录。旧入口 `build-units17-30-scenes.py` 仅转交同一入口，没有默认整批覆盖。

共用线条、颜色和绘图原语。同一身份可复用稳定头部，身体、手势和重心按情境处理；不同人物须重新审视头部和衣装轮廓，不能只换色。19–20 的妈妈、21／23 的单手拿书与双手托杯、25／27 的 Mrs. Smith 房间形象取舍见[人物身份与姿态 v2.2](../../docs/butcher-version/2026-09-27-1346-v2.2-Lesson19-28人物身份与情境姿态优化.md)。未命名男士的跨课延续属于视觉改编假设。`mobileSvg` 是手机的单独构图，不是桌面宽图缩小。`frames`、角色与事件时序从现行场景定义保留；交接和任务完成的时机由页面原有状态控制。Lesson 29–30 的课文场景保持待整理，独立的 `completed-scene.svg` 用于完成后纪念画面。

修改后运行对应单元的真实页面检查并逐张看图，至少包括开场、长句与中文、转折、最后一句、完成和手机尺寸。重绘成功只证明生成完毕；不证明人物、空间、教学事实或画面已验收。

Lesson 99–100的词汇符号、消息记录与室内背景由`node scripts/art/build-unit99100-assets.js`生成；人物、纪念卡及完整imagegen提示词见[素材记录](../../assets/unit99-100/README.md)。

Lesson101–102的词义符号、消息记录和室内背景由`node scripts/art/build-unit101102-assets.js`生成；角色、纪念卡及完整提示词见[素材说明](../../assets/unit101-102/README.md)。

Lesson103–104的词义符号、候选箱与走廊由`node scripts/art/build-unit103104-assets.js`生成；人物、纪念卡与完整提示词见[素材说明](../../assets/unit103-104/README.md)。

Lesson105–106原生词义图标与办公室背景由 python scripts/art/build-unit105106-assets.py 维护；人物、纪念卡与完整提示词见[素材说明](../../assets/unit105-106/README.md)。

Lesson107–108原生词义符号、参考示意、4／6／9 kg箱子和服装店背景由 python scripts/art/build-unit107108-assets.py 维护；主要人物及纪念卡见[素材与完整提示词](../../assets/unit107-108/README.md)。

Lesson109–110原生词义图标、精确一匙半／同尺度量杯和咖啡房间由 python scripts/art/build-unit109110-assets.py 维护；主要人物及纪念卡见[素材与完整提示词](../../assets/unit109-110/README.md)。

Lesson111–112原生词义符号、独立价签／重量候选与电视机店背景由 python scripts/art/build-unit111112-assets.py 维护；主要人物及纪念卡见[素材与完整提示词](../../assets/unit111-112/README.md)。

Lesson113–114原生词义符号、可计数硬币／每枚£2兑换图和车内背景由 python scripts/art/build-unit113114-assets.py 维护；主要人物及纪念卡见[素材与完整提示词](../../assets/unit113-114/README.md)。

Lesson115–116词义图标、开盒候选、三点查找图和门口／窗边／花园背景由 python scripts/art/build-unit115116-assets.py 维护；人物和纪念卡见[素材与完整提示词](../../assets/unit115-116/README.md)。开放SVG路径显式声明fill，避免黑色隐式闭合填充。

Lesson117–118原生词义图标、精确时段图和饭厅／电话两端背景由 python scripts/art/build-unit117118-assets.py 维护；人物与纪念卡见[素材和完整提示词](../../assets/unit117-118/README.md)。时间图矩形端点与刻度对齐，参考线避开文字，实际显示不受图标max-height约束。

Lesson119–120原生物品符号、两张精确事件图及夜间／开灯／卧室背景由 python scripts/art/build-unit119120-assets.py 维护；人物与纪念卡见[完整素材提示词](../../assets/unit119-120/README.md)。图内英文与数字为本地Nunito400轮廓，时间点不冒充持续条。

Lesson121–122由 python scripts/art/build-unit121122-assets.py 生成物品图、同坐标柜台／词典、书本位置图及服务方向图；内置imagegen人物和主卡见[完整素材提示词](../../assets/unit121-122/README.md)。判断图360×270，英文数字为本地Nunito400轮廓；物品接触关系不能只按图片外框定位。

Lesson123–124由 python scripts/art/build-unit123124-assets.py 生成物品图、独立房间背景、照片资料和两船判断图；内置imagegen主卡、人物及照片见[完整素材提示词](../../assets/unit123-124/README.md)。判断图360×270，英文数字为本地Nunito400轮廓；透明人物与不透明照片分别检查边缘和画面。

Lesson125–126由 python scripts/art/build-unit125126-assets.py 生成花园／房间背景、独立保比例门和花圃、雨窗、词语符号及360×270花圃／等候判断图；内置imagegen人物与主卡见[完整提示词](../../assets/unit125-126/README.md)。背景伸展与关键物件保比例分别核对，图内英文数字为本地Nunito400轮廓。

Lesson127–128原生图由python scripts/art/build-unit127128-assets.py生成：背景、独立茶桌、词义图标及360×270帽子／杯子判断记录；人物和主卡来自内置imagegen，[完整提示词](../../assets/unit127-128/README.md)。图内文字采用本地Nunito400轮廓，人物全身留边并与对白分区。

Lesson129–130由python scripts/art/build-unit129130-assets.py生成道路背景、独立保比例车辆、词图、360×270连续步行／日期图；5张最终imagegen主卡和全身组图见[提示词档案](../../assets/unit129-130/README.md)。三人同幅保持尺度，驾照只有一张，数字图按真实图值核对。

Lesson131–132原生图由python scripts/art/build-unit131132-assets.py维护：客厅背景、词图、360×270虚构行程比较／照看状态记录。4张最终imagegen主卡与全身同场姿态见[完整提示词](../../assets/unit131-132/README.md)。三份资料不标确定行程，字母数字使用Nunito400轮廓。

Lesson133–134由python scripts/art/build-unit133134-assets.py生成机场／报摊背景、词义符号、360×270作者关系与日期图；5张内置imagegen图见[完整提示词](../../assets/unit133-134/README.md)。图内英文数字使用Nunito400轮廓，人物和同一份报纸不随背景拉伸。

Lesson135–136的词图、饭店／报摊背景、360×270周范围与介绍关系图由python scripts/art/build-unit135136-assets.py维护；6张内置imagegen最终图及修订前原稿见[素材记录](../../assets/unit135-136/README.md)。正方形组图适配两人／三人，关键文字为Nunito400轮廓。

Lesson137–138的词义图标、客厅背景和两张360×270条件资料图由python scripts/art/build-unit137138-assets.py维护；4张内置imagegen最终图和完整提示词见[素材记录](../../assets/unit137-138/README.md)。两人坐姿保留全身、座椅及同一纸笔；资料图文字为Nunito400轮廓。

Lesson139–140词图、电话两端背景、同名身份和结束时间资料图由python scripts/art/build-unit139140-assets.py维护；4张内置imagegen最终图与工具箱修订见[素材与提示词](../../assets/unit139-140/README.md)。两图360×270，文字为Nunito400轮廓。

Lesson141–142词图、车厢背景、工作记录及邀请方向图由python scripts/art/build-unit141142-assets.py维护；6张内置imagegen图及留白修订见[素材与提示词](../../assets/unit141-142/README.md)。工作图360×300、邀请图360×270，字体Nunito400轮廓。

Lesson143–144词图、树林背景、七车三冰箱计数图、原文告示及两份时间记录由python scripts/art/build-unit143144-assets.py维护；4张内置imagegen图见[素材与提示词](../../assets/unit143-144/README.md)。原生图英文字体Nunito400轮廓，精确计数与气氛插画分工明确。


Lesson7–8五星重构的三张透明图由内置ImageGen生成；[最终提示词](unit7-8-prompts.json)及[本轮验收](../../docs/butcher-version/2026-10-16-1551-v3.0-Lesson7-8五星重构与验收.md)记录来源和实际画面。旧Robert／Sophie矢量图继续供历史证书使用。

Lesson9–10五星重构的四张透明图由内置ImageGen生成；[最终提示词与原稿](unit9-10-prompts.json)及[本轮验收](../../docs/butcher-version/2026-10-16-1706-v3.0-Lesson9-10五星重构与验收.md)记录主卡、交谈、挥手与hot示范。hot.svg保留原资源URL，避免换图改变旧题签名；原Steven／Helen矢量图保留给历史证书。

Lesson11–12五星重构的主纪念卡与四种三人舞台由内置ImageGen生成，见[提示词与原稿](unit11-12-prompts.json)和[验收记录](../../docs/butcher-version/2026-10-16-1905-v3.0-Lesson11-12五星重构与验收.md)。旧Dave／Tim SVG保留给历史证书，白衬衫交接与蓝衬衫出现按课文时序。

Lesson13–14的主纪念卡与四种双人舞台使用内置ImageGen生成；[提示词与原稿](unit13-14-prompts.json)记录帽子触边修稿及五张选定素材。旧Louise／Anna SVG保留给历史证书，原图数字与双色物品继续使用可核对的原生教学图。见[本轮验收](../../docs/butcher-version/2026-10-16-2018-v3.0-Lesson13-14五星重构与验收.md)。

- Lesson15–16：[提示词、原稿和采用记录](unit15-16-prompts.json)，内置ImageGen生成并保存到`assets/unit15-16/`；纪念卡与课内人物一致，原SVG继续用于旧证书。实际画面与验收见[单元记录](../../docs/butcher-version/2026-10-16-2158-v3.0-Lesson15-16五星重构与验收.md)。

- Lesson19–20：[提示词及采用原稿](unit19-20-prompts.json)，六张透明WebP由内置ImageGen生成；课文四种家庭分镜、摊主及近景卡面分别使用，旧63张SVG不覆盖。[设计与验收](../../docs/butcher-version/2026-10-17-0258-v3.0-Lesson19-20五星重构与验收.md)。

- Lesson21–22：[提示词与原稿](unit21-22-prompts.json)，内置ImageGen生成七张透明WebP；红书始终一份，人物显示映射不改原题签名，原62张SVG继续用于教材与旧证书。[验收](../../docs/butcher-version/2026-10-17-0357-v3.0-Lesson21-22五星重构与验收.md)。

- Lesson27–28：[完整提示词、原稿和选用记录](unit27-28-prompts.json)，内置ImageGen制作客厅横图、手机方图和纪念卡，沿用25–26史密斯太太身份；52张旧SVG保留。[设计与验收](../../docs/butcher-version/2026-10-17-0625-v3.0-Lesson27-28五星重构与验收.md)。

- Lesson29–30：[完整提示词、原稿和选用记录](unit29-30-prompts.json)，内置ImageGen制作四个角色姿态和一张中近景纪念卡；两张原生SVG卧室图提供明确物件位置，旧65张SVG保留。[设计与验收](../../docs/butcher-version/2026-10-17-0710-v3.0-Lesson29-30五星重构与验收.md)。

- Lesson31–32：[完整提示词、原稿和选用记录](unit31-32-prompts.json)，内置ImageGen制作相向的Jean／Jack全身图、花园动作场景及中近景纪念卡，共4张WebP。原60张SVG保持不变；猫狗追赶方向、树下坐姿与抓树动作逐图核对。[设计与验收](../../docs/butcher-version/2026-10-17-0810-v3.0-Lesson31-32五星重构与验收.md)。

- Lesson33–34：[完整提示词、原稿与选用记录](unit33-34-prompts.json)，内置ImageGen生成横／纵河畔场景与透明近景卡，共3张采用图、2张弃稿。原50张SVG保留；人物桥面站位、桥下大船和河上空飞机分别核对。[设计与验收](../../docs/butcher-version/2026-10-17-0900-v3.0-Lesson33-34五星重构与验收.md)。

Lesson43–44重构使用内置imagegen补绘两张厨房人物，保留原纪念卡；[提示词及原稿](unit43-44-v153-prompts.json)。`node scripts/art/build-unit4344-v153.cjs`生成12幅完整关系图和柜台；[本轮记录](../../docs/butcher-version/2026-10-17-2050-v2.0-Lesson43-44统一标准重构与验收.md)核对behind的遮挡、桌面接触和指示手完整性。

Lesson45–46本轮保留已认可人物及原卡；`node scripts/art/build-unit4546-v153.cjs`生成双侧能力图与戴帽子方向图，`python scripts/art/unit45-46-number-labels.py`生成Nunito400数字轮廓。见[素材说明](../../assets/unit45-46/README.md)。
