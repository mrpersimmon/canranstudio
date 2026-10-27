# 旅程地图首页设计验收

现行要求统一在[首页入口统一设计标准 v2.0](docs/designs/course-journey/2026-10-22-1332-v2.0-首页入口统一设计标准与验收清单.md)维护。本页保存各阶段真实画面、检查及限制；各段通过结论仅适用于所记范围，不能代替全站或发布验收。

最新日期：2026-10-26。分支：codex/fronted-opt-version。

## 2026-10-26 全72入口手机优先整体复查

本轮重新查看72课390像素组合与24个中间地标320像素画面，六章局部改图后追加18个手机组合和6个电脑中段。修复背景信息区冲突、缩略图旧画面串课、首课中轴及正常动效下课号短暂发白，新增J42–J44。

60尺寸／4320次布局、混合星数144次、正常动效216次选择首帧、96个相邻双向切换场景／2181张实际帧、4个真实图片延迟或快速改选场景、24个中间地标反馈通过。最后仅移除底色渐变后又做四尺寸288次布局；各阶段签名保留，未冒称所有旧记录在最后一行CSS修改后重跑。相关15项Node、72课构建、49文件美术固定包通过。

[完整记录与限制](docs/designs/course-journey/2026-10-26-全72单元手机优先整体复查与修复.md)区分实际画面、取样带、期望加载提示与采集尺寸失败记录。未运行Playwright CLI／WebKit／实体设备／新作答授星／发布验收；95%真实访问覆盖未确认。未提交、未推送、未发布。

## 2026-10-26 Lesson49–144全量连续入口（前批记录）

完成剩余48入口与16章，当前全部Lesson1–144的72入口采用连续近景；原人物及历史成果口径不变。实际29次内置生成、16张采用环境、123文件只读固定包；J41明确原生尺寸与区段对齐，补充组合语义与完整Lesson换行。

最终60尺寸×48课＝2880组实际Chromium布局通过。另有0／2／5星288组独立App样本、已有1–48的96组共用布局回归、192个相邻章节双向切换场景（每场30次定时DOM采样）、16组正常动效、图片403与重试、稀疏／空输入、48课实际搜索进入返回及72课目录检查。15项相关Node、72课构建、当前与此前美术冻结核对通过；来源、重跑范围及失败样本见[实施记录](docs/designs/course-journey/2026-10-26-Lesson49-144全量连续入口实施记录.md)。

这不是视频逐帧或全部任意章节对的弱网测试。未运行Playwright CLI、WebKit、真实iOS／Android／微信、软键盘、新作答授星及发布验收；IAB不支持触控事件注入，该项记未运行。95%真实访问覆盖仍待本站数据核实。未提交、未推送、未发布。

## 2026-10-26 Lesson25–48连续入口与边界纠偏（历史批次）

该批新增居室、河谷、手作小院、会客馆四章，当时1–48共八章连续近景、49–144保留大图。原12组人物不变，8次内置生成得到4张采用环境，提示词与全部取舍进入36文件固定包。J38–J40固化前景不穿信息区、小数CSS断点互补、长课名改变固定栏高度时同步更新留位。

最终60尺寸×12课＝720组实际Chromium布局通过，0／2／5星72组独立App样本通过；48个代表性缓存切换场景各30次定时DOM采样、8组正常动效、图片403与重试、稀疏／空输入、十二课搜索进入返回和72课目录通过。14项相关Node、72课构建、36文件美术校验通过。CLI用例已扩展并只做语法检查，未运行Playwright CLI；不是8章所有方向的视频逐帧或弱网验收。真实设备、WebKit和新作答授星未测，95%仍为待核实目标。完整范围与失败证据见[实施记录](docs/designs/course-journey/2026-10-26-Lesson25-48连续入口实施记录.md)。

## 2026-10-25 Lesson13–24连续入口

13–18采用探访长廊，19–24采用阳光家园庭院，两张原生1:3近景均由内置生成后在真实页面组合复核；原六课人物不变。已逐课看390手机组合和两章1440电脑首屏，接地点与柱脚、门阶、草坪分开核对；没有把两个新章节只做成旧街道换色。

60尺寸／360组实际页面、36个星数样本、48组切换DOM帧观察、六课实际进入返回、故障重试与授权样本通过。14项Node、72课构建、16文件固定校验通过；技术与视觉结论保持各自范围。[完整实施与截图](docs/designs/course-journey/2026-10-25-Lesson13-24连续入口实施记录.md)、[实际提示词](docs/designs/course-journey/production/modules-v5/README.md)可追溯。真机／WebKit／弱网及完整作答授星未测，未提交、未推送、未发布。

## 2026-10-25 章节切换不清空画面（J37）

修复前1–6→7–12实际连续6个采样帧地形隐藏、人物loading，页头和根节点未刷新。现在保留已解码的旧图，目标实际准备好后整体替换，共用远景保持。六尺寸、双向、普通／减少动态24场景1440帧最终无空白或叠显，地图高度与滚动稳定。

慢请求、取消、地形失败重试、延迟decode的目录定位、12个星数样本、首次庆祝可见性与授权变化分别有实页证据。正常准备层不参与布局占位或交互；错误有明确降级。完整[根因与证据](docs/designs/course-journey/2026-10-25-章节切换闪烁修复.md)保留验证边界，不以静态截图代替时间过程，不宣称旧22段采用同样切换机制。未提交、未推送、未发布。

## 2026-10-25 页面上下边界（J35–J36）

已复现612×913顶部0间距与页尾16px纸色横带；修正为标题上方16px、吸顶工具栏上下8px，滚动避让与页面占位分开，地图末端可进入圆角卡后方。既有素材、人物接地、星章距离和章节差异保留。

实际60尺寸×四段240组最终通过，首次1px取整失败与修正后的重跑分别保留；24个0／2／5星样本通过。已看手机首尾、平板、桌面与320长课名；旧大图本身的底色尾部不等于本次地图外纸色横带，也未在本轮重做美术。[根因、证据、共同原则与限制](docs/designs/course-journey/2026-10-25-页面边界间距与修复经验汇总.md)统一收录，未将DOM边界检查称作全72课视觉验收。未提交、未推送、未发布。

## 2026-10-25 两段旅程主题差异化（J34）

保留1–6的水岸花园，7–12改为一条连续邻里街道，住宅门廊、街角雨棚和校园入口分布在道路两侧。两段继续统一奶油石材、珊瑚墙、暖光和原人物，差异来自空间组织和环境主体，不靠只换人物或门窗颜色。首稿的横向断口在接入前被拒绝；3次内置生成采用1图，两张未采用稿与完整实际提示词保留。

同尺寸[花园页](docs/designs/course-journey/evidence/2026-10-25-chapter-identity/04-garden-control-phone.png)与[街区页](docs/designs/course-journey/evidence/2026-10-25-chapter-identity/05-town-comparison-phone.png)已对照，7／9／11三组人物的接地、连续滚动、星章归属及电脑／320手机实页已查看。新街区没有原稿的横向拼接断口，人物未跨门阶或贴到墙上。动效补片收窄为29%×7%，给路边建筑留出范围；本次采样未见明显建筑随补片移动，不代表全帧检查。

第二段59尺寸×3次选中＝177次实际DOM观测通过，星章行距人物底缘约14px；0／2／5星在两尺寸共18个隔离真实App样本通过。相关13项Node、72课构建、新包6文件与旧v3包11文件哈希校验通过；这些数字不代替构图区别的目视。详情与未验证范围见[实施记录](docs/designs/course-journey/2026-10-25-两段旅程主题差异化.md)，实际提示词见[modules-v4](docs/designs/course-journey/production/modules-v4/README.md)。未改真实成绩，未提交、未推送、未发布。

最新局部验收：见下节。历史通过不豁免后来发现的问题。

## 2026-10-25 星章与课号贴近人物（J33）

本轮发现J32的方形article虽然保持了地形、人像与状态的结构归属，但stage使用flex占满剩余空间，把星章和课号推得过远。560px电脑画布实测星章行距人物可见底缘约130.406px、Lesson约186.406px；“同article”和“不重叠”不能证明视觉接近。

已将stage改为按完整人物／道具可见底缘的宽度比例加8px安全区，保留星章原有6px外边距，实际目标为14px；Lesson仍位于星章行下8px。因此手机44px星章行对应课号距底缘66px，桌面48px行对应70px。原人物、方形artboard、静态地形与同源补片坐标未改变，空白留在课号之后；13–144不改。本轮没有新素材或生成调用。

近景模型与ready纯检查12／12、72课构建通过；真实Chromium59尺寸×六课选中＝354次观测通过，可见底缘到成果行范围13.999946–14.000073px，人物与地形／补片坐标保持。320×568和1440×900的0／2／5星共36个隔离真实App样本通过，真实成绩未改。focus-visible、-4px内缩与金章重看后的所属课选中及扫光已实际检查；这些技术结果不替代目视。

已目视02号电脑清晰稳态、03号390手机、04号320手机和05号第二段电脑：星章与课号贴近本课人物，未压住人物／道具，也没有更靠近下一课。320图在motion均为none时捕获，完整课号及选中外圈可见；第二段9–10的成果与下方11–12人物保持明确分隔。该判断只覆盖这些实拍，不扩大为所有设备、内核或动态帧。

修改前后与最终证据集中在[本轮距离修正记录](docs/designs/course-journey/2026-10-25-星章课号贴近人物.md)，不覆盖旧截图或把旧验证次数算入本轮。[最终电脑](docs/designs/course-journey/evidence/2026-10-25-reward-spacing/02-desktop-after.png)、[390手机](docs/designs/course-journey/evidence/2026-10-25-reward-spacing/03-phone-390.png)、[320手机](docs/designs/course-journey/evidence/2026-10-25-reward-spacing/04-phone-320.png)、[第二段电脑](docs/designs/course-journey/evidence/2026-10-25-reward-spacing/05-neighborhood-desktop.png)分别保存实际范围。预览最终为1440×900电脑模式、1–2选中及正常动效，最新error日志为空。未跑CLI／WebKit或真机；未提交、未推送、未发布。

## 2026-10-24 人物与环境融合复核（J32）

**撤回下方modules-v2／J31阶段“已融合、连续衔接已完成”的视觉判断。** 上轮确实做了截图目视，但将可见的拼贴、尺度与道路空间问题错误放行；33项测试和354次几何观察只能保留其原技术范围，不能作为美术兼容性的通过证明。该旧版不通过结论不因本轮新实现而改写。

本次实页复核显示：完整背景已经含近景路网，其上再叠独立庭院和连接桥；背景cover与局部庭院分别缩放，缺少统一近景尺度。桥图宽高独立计算，原生比例1.5在1440×900实页两处分别变成约0.81／1.89。人物相对自己地面稳定，并不能阻止整组像贴在另一套地图上。

旧版复核证据：[手机首屏](docs/designs/course-journey/evidence/2026-10-24-compatibility-audit/01-phone.png)、[中间地标](docs/designs/course-journey/evidence/2026-10-24-compatibility-audit/02-middle.png)、[桌面](docs/designs/course-journey/evidence/2026-10-24-compatibility-audit/03-desktop.png)、[实际尺寸](docs/designs/course-journey/evidence/2026-10-24-compatibility-audit/metrics.json)。统一标准4.8／J32先于新生成和运行修改更新。

新modules-v3已经改为每章一张724×2172、1:3等比连续近景，原人物在1:1 artboard内与同源脚下柔边补片共同轻回弹，整段地形静止。普通流星章／Lesson保留；不再叠独立平台和桥图。手机满可用宽度且默认列上限480px，从768px起采用最大560px、圆角奶油描边的明确地图画布，外侧为无近景路面的远景。08号18px羽化试验未采用，09号明确画布为最终方向，不能宣称全屏近远景无缝。

本轮当前／共享Node29／29、历史v2单列另12／12通过，72课构建通过；v3美术11／11、旧v2=24／24、旧v1=42／42匹配。独立29接点×6宽=174纯投影仅捕捉偏移，不是视觉合格。真实Chromium59尺寸×六选中=354次DOM观察通过；授权逻辑修复后另390／1440两尺寸×六课=12次定向复验通过，两批分别记录。0／2／5共18个隔离真实App样本验证尺寸、星章及人物相对artboard位置，不写真实DB。

实际还覆盖同挂载稀疏授权（1＋5、单9、空集合）、有效group或query分别保持／无效group回全部、共享地形与单个人物故障恢复、首次满星等ready、正常轻回弹和12／144跨新旧段搜索。目录测试保持桌面面板展开，并分别检查互斥的query和group，不把关闭目录清筛选的旧行为混入授权结论。完整结果、实页与限制见[融合复核及修正记录](docs/designs/course-journey/2026-10-24-人物与环境融合复核及修正.md)。

新方案经过先两课相邻组合、再六课手机及电脑明确画布的独立目视，在本轮提供的截图与操作范围内未发现视觉阻断。最终14号320稳态图与16号390图中五官、衣着、鞋底清晰完整，星章课号无遮挡；人物／庭院／道路归属明确，没有额外圆台叠放或明显补片轮廓接缝。09号电脑画布边界与远景分工成立，12号底部完整可达；10→11号单次点击样本未见地砖重影或围墙扭动。该结论不扩大为全帧动画、全部输入方式、所有内核或实体设备。

![J32最终手机预览390×844](docs/designs/course-journey/evidence/2026-10-24-fusion/16-phone-final.png)

[320稳态](docs/designs/course-journey/evidence/2026-10-24-fusion/14-phone-320.png)、[3–4稳态](docs/designs/course-journey/evidence/2026-10-24-fusion/11-counter-final.png)、[5–6](docs/designs/course-journey/evidence/2026-10-24-fusion/13-friends-phone-final.png)、[电脑画布](docs/designs/course-journey/evidence/2026-10-24-fusion/09-desktop-canvas.png)、[电脑底部](docs/designs/course-journey/evidence/2026-10-24-fusion/12-desktop-bottom.png)。早期pilot／未采用羽化与动效帧按完整记录分别标明，不冒充最终稳态。

最终预览保留390×844正常动效，最新error日志为空；隔离4193页和服务已停止。未跑CLI／WebKit、真机／微信、弱网、真实授星全链或完整发布验收；95%仍待实际访问数据。未提交、未推送、未发布。以下历史材料保留原范围。

## 2026-10-24 Lesson 1–12 连续旅程恢复（J31）

本轮按用户确认方向，将海水与孤岛构图改为开敞庭院、奶油石路、珊瑚拱桥和绿植连接的花园旅程。环境以原认可图为参考重新适配，并非旧背景原图原样恢复；六课原人物字节不变，仍与本课地面共享3:2局部stage／motion，星章与Lesson保持普通流。13–144保留原大图，目录与搜索仍为全部72课。连续构图不能只靠相同配色验收，真实接地也不能以矩形不碰撞代替。

本次素材共9次内置生成、9个采用资产，18个PNG／WebP；原PNG完整保留，WebP只作quality 88编码。竖背景原生724×2172、宽背景1254×1254，与请求理想尺寸不同，未人工放大。v2美术Manifest24／24匹配；[实际来源与偏差](docs/designs/course-journey/production/modules-v2/README.md)保留原文、参考、SHA与道路端口不精确的事实。

相关8个Node文件共33／33通过，72个受保护教学单元构建通过。应用内Chromium完整59尺寸×六课选中＝354次观察无错误：人地局部关系不漂、星章普通流与44px操作成立、每对相邻实课装饰桥端点误差<.6px，背景按picture切换。该批采用既有演示五星与减少动态；[矩阵摘要](docs/designs/course-journey/evidence/2026-10-24-continuous/matrix-summary.json)和[实际DOM](docs/designs/course-journey/evidence/2026-10-24-continuous/matrix-dom.json)不能代替所有视觉接缝及真机结果。另有0／2／5星×两段×三课＝18个真实App隔离样本，核对星数、金章、尺寸、相对接地及6px／8px间距，不写真实DB；见[星数摘要](docs/designs/course-journey/evidence/2026-10-24-continuous/star-summary.json)。

正常点击3–4时回弹matrix=.995142，人物相对地面的x／y／w／h与复位差<2e-7。搜索12定位11–12；搜索144进入旧woodland段143–144且modules=0，新旧段往返成功，见[交互采样](docs/designs/course-journey/evidence/2026-10-24-continuous/interaction.json)。新庭院下1–2／3–4 feet y=.67，7–8=.69，其余=.72；路口端点与人物落脚点分别维护。

底图与石桥同时失败时隐藏缺图，三课仍ready且可选3–4。解除屏蔽并切换到桌面背景后发现picture保留hidden，补充成功onLoad恢复visible，并按该路径复验；这是矩阵之后的非几何恢复修复，未将此前354次说成最后修复后全量重跑。[故障记录](docs/designs/course-journey/evidence/2026-10-24-continuous/decoration-failure.json)与[故障实拍](docs/designs/course-journey/evidence/2026-10-24-continuous/01-decoration-failure.png)单列。原人物／地面逐课失败及首次满星等待逻辑保留，不能把前轮故障实拍当作本轮全套重跑。

![当前连续旅程手机预览 390×844](docs/designs/course-journey/evidence/2026-10-24-continuous/11-phone-390-final.png)

六课实拍：[1–2](docs/designs/course-journey/evidence/2026-10-24-continuous/02-opening-phone.png)、[3–4](docs/designs/course-journey/evidence/2026-10-24-continuous/03-counter-phone.png)、[5–6](docs/designs/course-journey/evidence/2026-10-24-continuous/04-friends-phone.png)、[7–8](docs/designs/course-journey/evidence/2026-10-24-continuous/05-interview-phone.png)、[9–10](docs/designs/course-journey/evidence/2026-10-24-continuous/06-greeting-phone.png)、[11–12](docs/designs/course-journey/evidence/2026-10-24-continuous/07-return-phone.png)；另有[宽屏](docs/designs/course-journey/evidence/2026-10-24-continuous/08-desktop.png)、[320px](docs/designs/course-journey/evidence/2026-10-24-continuous/09-phone-320.png)与[430px](docs/designs/course-journey/evidence/2026-10-24-continuous/10-phone-430.png)。这些是实际页面，生成原图仅作素材证据。

本轮本地样板在所列范围内通过，剩余边界见[完整恢复记录](docs/designs/course-journey/2026-10-24-Lesson1-12连续旅程恢复.md)。[本地预览](http://127.0.0.1:4187/)最终保留390×844手机首屏与正常动效；浏览器最新error日志为空，隔离页与辅助服务已关闭。最终构建72课通过，v2 Manifest24／24、v1历史42／42均通过。未运行Playwright CLI、WebKit、真机、微信、真实软键盘、真实授星全链、弱网或完整发布验收；95%实际访问覆盖仍待数据核实。未提交、未推送、未发布。以下历史记录保持原范围，不累加旧数字。

## 2026-10-23 Lesson 1–12 独立场景样板（J30）

本地已实现前六课的独立小场景：复用原人物，分别叠在专属透明平台上，两图在同一个3:2局部stage内整体缩放并共用motion。星章位于完整stage下6px，Lesson再下8px；手机增加页面长度，避免为了三课同屏把人物缩小。中文仍在当前卡、目录与搜索。13–144保留现有单列大图，完整目录仍为72课；新模块的星章不能用旧人物bbox＋6px验收。

本轮修复了7个新WebP未注册导致的401、跨章节读取缺失overlays、手机满星行宽不足、选中底牌瞬态对比以及图片未就绪提前消费首次满星庆祝的问题。手机成果行现为148×44px；每课人物／平台故障分别可重试，装饰底图失败不显示broken icon。首次满星故障阶段扫光为0，重试ready后实际opacity约0.297–0.350，见[隔离UI恢复采样](docs/designs/course-journey/evidence/2026-10-23-modules/isolated-retry-celebration.json)。

实际完成26项相关Node测试（含4项readiness、5项module-scenes及1项真实HTTP）、72课构建、42文件美术Manifest校验。原人物资源引用和SHA未改变；29个鞋底／柜台接触点在6个stage宽度下的174次纯投影通过。纯投影用于固定局部关系，不冒充实际设备接地观察。

应用内Chromium完整59尺寸×六课选中＝354次观察，错误为空，使用已有演示五星和减少动态。最后readiness修复之后几何未改，另完成320×568、360×800、390×844、430×932、768×1024、1024×768、1440×900、2560×1440的48次观察，错误为空；两批数字分别记录，不累加包装为新的完整矩阵。0／2／5星×两章节×三课＝18个隔离真实UI样本通过；样本仅影响隔离组件输入，不写真实成绩。见[矩阵摘要](docs/designs/course-journey/evidence/2026-10-23-modules/matrix-summary.json)、[修复后DOM](docs/designs/course-journey/evidence/2026-10-23-modules/post-readiness-dom.json)与[星数样本](docs/designs/course-journey/evidence/2026-10-23-modules/isolated-star-samples.json)。

本轮7个新资产来自10次内置生成，原PNG、WebP、3个首稿、请求与参考均保留。生成要求的8%–10%透明边距未全部达到，采用完整平台加页面外围留白，不篡改原图或凭据。新生成图片只是素材，下面是实际页面截图。

![独立模块最终手机预览 390×844](docs/designs/course-journey/evidence/2026-10-23-modules/09-opening-phone-final.png)

六课手机图：[1–2](docs/designs/course-journey/evidence/2026-10-23-modules/09-opening-phone-final.png)、[3–4](docs/designs/course-journey/evidence/2026-10-23-modules/10-counter-phone-final.png)、[5–6](docs/designs/course-journey/evidence/2026-10-23-modules/14-friends-phone-final.png)、[7–8](docs/designs/course-journey/evidence/2026-10-23-modules/12-interview-phone-final.png)、[9–10](docs/designs/course-journey/evidence/2026-10-23-modules/13-greeting-phone-final.png)、[11–12](docs/designs/course-journey/evidence/2026-10-23-modules/11-school-return-phone-final.png)；另有[桌面](docs/designs/course-journey/evidence/2026-10-23-modules/15-desktop-final.png)、[窄手机](docs/designs/course-journey/evidence/2026-10-23-modules/16-small-phone-final.png)及[滚动后](docs/designs/course-journey/evidence/2026-10-23-modules/17-small-phone-scrolled-final.png)。

最终正常点击3–4时实测matrix=.997441，人物相对平台的x／y／w／h与复位差均小于2e-8，见[动态证据](docs/designs/course-journey/evidence/2026-10-23-modules/normal-motion.json)。搜索12唯一定位11–12，搜索144唯一进入143–144旧地图且可返回；当前1–2继续学习已真实加载课包和内容，再经“我的课程”回首页，没有答题或授星。16:21旧items异常日志保留，最终新旧切换未复发。

[实现记录及完整边界](docs/designs/course-journey/2026-10-23-Lesson1-12独立场景样板.md)。预览位于[本机4187](http://127.0.0.1:4187/)，最终已保留390×844首屏。未执行Playwright CLI、WebKit、真机、微信、真实软键盘、完整授星链、弱网或完整发布验收；95%覆盖仍待真实访问统计。未提交、未推送、未发布。以下历史记录保留当时范围。

## 2026-10-23 单列入口与真实接地

地图全部72课改为“人物→星章→Lesson”，不再侧排中文。首段3–4踩灯问题按实际鞋底与柜台接地点修正，24段中景移入中央铺地。最窄手机保留完整操作区，较宽手机在真实地面安全上限内恢复人物比例；选课改变底部中文卡高度不再带动相机。

本轮16项相关单元检查（含24段×59尺寸纯布局与独立接地点）、72课构建通过；应用内Chromium的8尺寸336次实际页面测量通过，三样板238个实际接地点检查通过，选课不改相机。数字144搜索、中文目录、地图定位、正常点击回弹与复位已实际操作。几何批次为现有五星演示数据、减少动态；本轮未重跑0／2星样本、完整Playwright／WebKit、真实授星、实体设备或微信。

[实现、实拍与验证边界](docs/designs/course-journey/2026-10-23-单列入口与地面锚点优化.md)；[三样板数值与24段源素材目视记录](docs/designs/course-journey/2026-10-23-人物接地校准记录.md)。上一节历史“已修正”不能作为全部人物接地正确的依据。未提交、未推送、未发布。

## 2026-10-23 中间地标串位专项

发现并修正：旧排版虽然不重叠，课名却逐层下移，更接近下一课人物。竖构图改为三层课名分别贴近所属人物，星章仍在脚下，手机范围选择移到标题区。320px 两位数课号的选中换行空间和长课名间的 12px 留白已补齐。人物／环境素材与脚底锚点、成绩和历史日期未改。

本轮在应用内 Chromium 目视全部 24 段的中景；8 个实际尺寸共 336 次真实页面测量及选中检查通过，其中 320／361／375px 各逐一选中全部 72 课。另有固定 59 尺寸×24 段的纯布局回归、11 项相关单元检查和 72 单元构建通过。浏览器几何采样使用“减少动态”，正常动效画面另行抽查。

[完整审查记录、修复前后截图和限制](docs/designs/course-journey/2026-10-23-中间地标串位审查与手机优先修复.md)。本轮没有重新执行 WebKit、0／2 星隔离样本、真实授星、微信或实体设备验证；95% 仍为待真实数据核实的目标。未提交、未推送、未发布。

## 2026-10-23 Lesson 31–144 全量入口

新增 57 个入口和 19 段横竖环境，全部 72 课使用脚下星章。多行标题、361px 边界和动态底栏留白已修正，宽屏避免不必要地退回竖版。[完整实施与验证记录](docs/designs/course-journey/2026-10-23-Lesson31-144全量入口与星章统一.md)分别列出已完成检查、两内核完整矩阵结果及真机／覆盖率边界；下方历史结论保留当时范围。

![最终桌面效果](docs/designs/course-journey/evidence/2026-10-23-complete/03-woodland-desktop-final.png)

## 2026-10-23 Lesson 19–30 与脚下星章

局部通过：新增六课、两段横竖地图，并按用户追加要求，把全部五段十五个入口的星星／金章统一锚在本课可见地标底部下方。课名保持完整并独立避让，手机前景可以在侧边；不再以星章和右侧课名同列作为归属证据。现行规范已同步更新，详细来源、修正与边界见[本轮记录](docs/designs/course-journey/2026-10-23-0200-Lesson19-30入口与星章归属统一.md)。

人物维持认可的暖棕轮廓、圆润比例与上左暖光；21／23 的男士和 Jane、25／27 的 Mrs. Smith 分别使用连续编辑锁定身份。四张环境保留奶油石路、珊瑚拱桥、青绿水面及可站立地面。扫帚遮鞋初稿已按单一目标修订。11 次内置生成请求及原生 PNG／WebP、alpha 边界、引用与 SHA 固化于 [daily-life-v1](docs/designs/course-journey/production/daily-life-v1/README.md)。

最终实页：[19–24 手机](docs/designs/course-journey/evidence/2026-10-23-daily-life/11-kindness-mobile-under.png)、[25–30 手机](docs/designs/course-journey/evidence/2026-10-23-daily-life/12-home-mobile-under.png)、[19–24 桌面](docs/designs/course-journey/evidence/2026-10-23-daily-life/13-kindness-desktop-under.png)、[25–30 桌面](docs/designs/course-journey/evidence/2026-10-23-daily-life/14-home-desktop-under.png)、[320px 首屏](docs/designs/course-journey/evidence/2026-10-23-daily-life/15-mobile-320-under.png)及[滚动后](docs/designs/course-journey/evidence/2026-10-23-daily-life/16-mobile-320-scrolled.png)。检查完整角色、道具、落地、当前标记、归属与可达性；短屏通过整页滚动，不压缩所有入口塞满首屏。

Chromium 根路径和 WebKit 子路径各 11 项完整布局场景通过；五段均测 59 个地图尺寸及 0／2／5 星。额外 7 项 Chromium 功能、WebKit 新六课动效定向 1 项、8 项模型／完成提示、20 项检查流程以及 72 单元账号构建通过。WebKit 高度采样曾读到前一帧，逐帧证据确认后改为等布局完成再测，保留原缩放断言。第二段标题交叠与鞋底越界均复验关闭，没有放宽铺地边界。

本地演示号补齐六课当前五星卡，36 条旧收藏及日期保留，学习进度不改。实体设备／微信／真实软键盘和真实 95% 覆盖仍待相应数据与实机验证；尺寸统计默认关闭，未提交、未推送、未发布。

## 2026-10-22 Lesson 13–18 与尺寸采集

局部通过：第三段三课的人物／场景、真实目录入口、跨段搜索、授权、刷新、图片恢复及适配。范围和修复记录见[实施记录](docs/designs/course-journey/2026-10-22-1930-尺寸采集与第三段入口实施记录.md)，规范仍集中在 v2.0。

第三段沿用认可地图的圆润人物、暖棕轮廓、奶油石路、珊瑚拱墙、青绿水面与左上暖光；身份取自本课教材及纪念卡。13–14 是 Anna 家看新衣，15–16 保留两本护照／两只行李，17–18 是三位成人介绍办公室助理。未改原纪念卡，未把文字、星星或金章烘焙入图。九份实际生成请求及透明边界保存在[第三段固定包](docs/designs/course-journey/production/visits-v1/README.md)，五套新旧包哈希校验通过。

实际画面：[390×844](docs/designs/course-journey/evidence/2026-10-22-visits/01-mobile-390.png)、[320×568 首屏](docs/designs/course-journey/evidence/2026-10-22-visits/02-mobile-320-selected17.png)、[320×568 自然滚动后](docs/designs/course-journey/evidence/2026-10-22-visits/03-mobile-320-scrolled13.png)、[1440×1024](docs/designs/course-journey/evidence/2026-10-22-visits/04-desktop-1440.png)。检查完整帽、手、脚、衣裙和行李；真实铺地、信息归属、当前标记、金章亮光及固定学习区。小屏允许整页滚动，没有要求三课同时挤进短屏首屏。新增更严格的成果行检查还发现横屏自身行李范围相交，已将 15–16 信息整体右移；最终坐标和追加复验见实施记录。

完整矩阵三段在 Chromium 根路径／WebKit 子路径各 9 项布局通过，第三段采用 0／2／5 星隔离读取样本，不写成绩。扩大 WebKit 回归初次 18／19，通过补上真实课包加载边界关闭唯一旧检查失败；保留五星、姓名和权限原断言。20 项相关模型／权限及 20 项检查流程用例、72 单元账号构建通过；完整发布验收未执行。

尺寸统计 Chromium／WebKit 各 2 项实际页面检查通过，管理员汇总的[截图](docs/designs/course-journey/evidence/2026-10-22-visits/05-viewport-admin.png)来自隔离测试库。常规预览及生产保持默认关闭，不把本机样本、63 尺寸通过或浏览器模拟推成真实 95%。生产观察、实体 iOS／Android／微信、真实软键盘与负载仍待验。

本地演示号只新增三课当前五星收藏，已有 33 张记录与日期保留，学习进度未改；截图是演示收藏，不是本次实际通关证明。未提交、未推送、未发布。

## 2026-10-22 统一尺寸矩阵与覆盖目标

[唯一清单](tests/support/journey-viewports.json)固化 63 个组合，其中 59 个地图几何尺寸和 4 个紧凑目录高度，另设 13 个日常几何代表尺寸。完整档 Chromium 根路径、WebKit 子路径各 8 项相关场景通过，8 项模型／完成提示检查和 11 项流程检查通过。具体尺寸、场景分工、初次失败及修复见[矩阵记录](docs/designs/course-journey/2026-10-22-1620-验证尺寸矩阵与覆盖目标.md)。

扩大矩阵发现并修复 390×520 短搜索结果区域过薄、1024×768 横构图 9–10 信息侵入前景人物保守边界；另修正测试结束视口假设和微小浮点噪声。人物、素材、成绩服务未修改。尺寸通过率与真实访问覆盖率分别报告：用户确认暂无本站数据，95% 保留为目标；[采集方案](docs/designs/course-journey/2026-10-22-1620-网站访问尺寸采集方案.md)已完成文档，采集尚未实施。真机／微信、DPR／页面缩放及完整发布仍未在本轮验证。未提交、未推送、未发布。

## 2026-10-22 首段入口修复与标准优化

[审视](docs/designs/course-journey/2026-10-22-1428-前三单元入口设计审视.md)发现 A01（3–4 金章压住 1–2 帽子）和 A02（成果与课名分散）。现在 3–4 的金章、星数与课名成组，随脚底定位，并兼容避让 5–6 的独立课名；三课美术和人物站位保持。最后小屏复查补足选中外圈余量。两项审视问题与该首段细节均已修复，详见[关闭记录与规范优化](docs/designs/course-journey/2026-10-22-1505-首段入口修复与标准优化记录.md)。

[390px 手机](docs/designs/course-journey/evidence/2026-10-22-opening-fix/01-mobile-390x844.png)、[495px 长屏](docs/designs/course-journey/evidence/2026-10-22-opening-fix/02-long-mobile-495x1188.png)、[1440px 桌面](docs/designs/course-journey/evidence/2026-10-22-opening-fix/03-desktop-1440x1024.png)、[320px 滚动后](docs/designs/course-journey/evidence/2026-10-22-opening-fix/04-small-mobile-scrolled.png)已实际目视。当前修复范围内未发现剩余遮挡、信息归属或首段选中外圈问题。

Chromium 根路径 7 项、WebKit 子路径 6 项相关检查及 8 项单元检查通过；最后余量调整后，两引擎各复验 2 项受影响检查，重复不另计。新增 0／2／5 星七尺寸样本只验几何，未写成绩；实际预览另采样回弹无邻课交叠。完整范围、旧布局失败、工具准备错误和未验边界均在关闭记录中保存。真实获星业务、真机微信、弱网和完整发布未在本轮重跑。未提交、未推送、未发布。

## 2026-10-22 人物比例、平台站位与裁切层

按用户确认的两个方向，保留信息分组，并调整 9–10、11–12 的人物大小和站位。9–10 缩小并收进中间平台，11–12 缩小后露出更多学堂与庭院；桌面 9–10 信息移至人物正下方。当前规范见[v1.8](docs/designs/course-journey/2026-10-22-1033-v1.8-九至十二课人物比例与平台站位.md)。

同为 495×1188、DPR 1、选中 Lesson 9–10 的[当前画面调整前](docs/designs/course-journey/evidence/2026-10-22-character-staging/01-current-before.png)与[调整后](docs/designs/course-journey/evidence/2026-10-22-character-staging/07-current-after.png)已同次输入比较。中景不再比前景高大，鞋底落到铺地内，后景屋顶与门口重新可见。另检查[1440px 桌面](docs/designs/course-journey/evidence/2026-10-22-character-staging/03-desktop-after.png)和[320px 小屏](docs/designs/course-journey/evidence/2026-10-22-character-staging/06-small-after.png)。

- P2 已修复：原人物用整幅画布宽度定大小，中景显得比前景更大，后景挡住学堂。按 alpha 可见高度和鞋底范围重新定位，完整原图和画风保留。
- P2 已修复：初次向内移动后，小屏 9–10 轮廓与课名字框相交。信息组改为 140px 并略右移，原零交叠断言通过，名称和 44px 金章点击区完整。
- P2 已修复：小屏定位会滚动 `overflow:hidden` 的地图内部，实图曾出现 38px 内部位移和上方人物被裁。[发现时画面](docs/designs/course-journey/evidence/2026-10-22-character-staging/05-small-selected11.png)保留。改用不建立滚动容器的裁切后，同一操作的内部滚动为零，上方人物恢复完整；页面仍自然滚动。

字体、完整课名、色彩和原生素材未更换；人物适当缩小但保留表情、唯一白衬衫和蓝衬衫等关键情节；信息继续跟随脚底，金章光效、真实星数与进入路径保持原含义。五种尺寸的身高、鞋底、文字边界和操作均检查。

最终两引擎各 8 项布局、点击与滚动复验通过，共 16 项；实际进课／授权复用本轮先前通过项，8 项单元检查、首页构建与素材固定包校验通过。无剩余重要人物落点、信息关联或裁切问题；实体手机、微信仍待验。未新增奖励、未提交、未推送、未发布。以下保留历史版本。

## 2026-10-22 Lesson 9–12 信息位置修正

当前修正范围是两课人物与成果／课名的关联。原信息独立使用百分比坐标，课名落到下一层台阶，长屏进一步拉大间距。现在两课信息成组，内部固定 6px 间隔，整体跟随本课脚底；9–10 还按上方信息组的完整高度避让。当前规则见[v1.7](docs/designs/course-journey/2026-10-22-0827-v1.7-九至十二课信息位置修正.md)。

本次重新捕获的 390×844、DPR 1、选中 Lesson 7–8 的[原页面](docs/designs/course-journey/evidence/2026-10-22-landmark-placement/02-mobile-before.png)与[调整后](docs/designs/course-journey/evidence/2026-10-22-landmark-placement/05-mobile-after.png)已同次输入比较。另记录[用户当时 495×1188 画面](docs/designs/course-journey/evidence/2026-10-22-landmark-placement/01-current-before.png)与[调整后](docs/designs/course-journey/evidence/2026-10-22-landmark-placement/06-current-after.png)，以及[1440px 桌面](docs/designs/course-journey/evidence/2026-10-22-landmark-placement/04-desktop-after.png)和[320px 当前 11–12](docs/designs/course-journey/evidence/2026-10-22-landmark-placement/07-small-selected11.png)。495px 原图范围选择器处于焦点状态，前后判断以地图信息区域为准。

P2 已修复：成果和入口在视觉上分离，同课归属不清。495px 长屏上 11–12 课名上移约 25px、9–10 上移约 33px，星数与课名对齐；320px 下按整组高度避让，没有把两个信息组叠放。人物与平台站位本次保持原值。

字体和完整课名保持原层级；手机成果行做紧凑排列，金章点击区仍为 44px，桌面为 48px；颜色、星光、人物素材和课文内容延续现有版本。布局检查同时覆盖完整人物边界、标题、组间距和脚底关联，未因“没有遮挡”而忽略归属。没有新增图片或改写旧素材固定包。

新回归在原版先失败，修正后两引擎各四项第二段场景通过，Chromium 另四项点击／真实获星回归通过，共 12 个浏览器场景；8 项单元检查、首页构建及 41 文件素材包校验通过。无剩余重要信息分组或核心操作问题。实体手机、微信和完整发布验收未执行；未提交、未推送、未发布。下方保留先前版本的设计与验证历史。

## 2026-10-22 金章星光与第二段旅程

金章现在和已获星共用暖金柔光、4.8 秒扫光及错峰小闪光，减少动态时保留静态亮度。新增 7–8、9–10、11–12 的三组人物及横／竖环境，地图范围可切换两段，目录与精确 Lesson 搜索继续覆盖全部授权课程。现行规则见[v1.6](docs/designs/course-journey/2026-10-22-0735-v1.6-金章星光与第二段旅程地图.md)，五个成品和七次实际生成请求保存在[固定包](docs/designs/course-journey/production/next-three-v1/README.md)。

同为 390×844、DPR 1、选中 Lesson 1–2 的[原金章](docs/designs/course-journey/evidence/2026-10-22-game-feedback/mobile-390-final.png)与[本轮金章](docs/designs/course-journey/evidence/2026-10-22-next-three/opening-medal-glow.png)已放在同次视觉输入中比较。原人物与位置保留，金章亮度和星星一致，下拉范围入口占用原地图按钮位置。新段是用户授权扩展，不把课程及人物变化当作对原截图的逐像素复刻。

新增三组原生人物逐张目视，对照本课纪念卡确认身份和道具；环境沿用首段的珊瑚、奶油、青绿、左上光和三平台结构。最终检查[390×844](docs/designs/course-journey/evidence/2026-10-22-next-three/mobile-390-final.png)、[1440×1024](docs/designs/course-journey/evidence/2026-10-22-next-three/desktop-1440-final.png)与[320×568 选中 11–12](docs/designs/course-journey/evidence/2026-10-22-next-three/mobile-320-selected11.png)。短屏可滚动，未宣称六个地标或每段三个地标同时全在短屏首屏。

| 程度 | 发现 | 修正及验证 |
| --- | --- | --- |
| P2 | 满星后手机 11–12 金章靠近下方 Helen 头部，见[首轮满星图](docs/designs/course-journey/evidence/2026-10-22-next-three/mobile-before-medal-clearance.png)。零星实图没有暴露此问题。 | 金章移到星数右侧，星数略左调，标签下移留出间距；最终 390／320 图金章、人物和完整课名互不遮挡。 |
| P2 | 桌面 9–10 金章靠近下方 Sophie 头发，见[桌面调整前](docs/designs/course-journey/evidence/2026-10-22-next-three/desktop-before-medal-clearance.png)。 | 只在横构图右置该金章并增加标签上方间距；最终桌面图已目视，最后布局在两引擎复验通过。 |

五项复查：字体与字号沿用 Nunito／寒蝉圆黑，不缩小长课名；地图等比及脚底落点按实际 alpha 测量，金章点击区 44／48px；配色和光照延续原画风；Robert／Sophie、Steven／Helen、老师／Dave／Tim 的身份和衣服完整，白衬衫只有一件；所有 Lesson、标题、星数和学习入口来自账号数据。固定源包的原生成参考没有覆盖。完整画面中表情与道具可辨，另已查看原生素材，未用生成 UI 图代替浏览器证据。

本轮 Chromium 根路径 14 项、WebKit `/lesson/` 4 项不同场景通过；两次金章间距调整后分别复验两引擎布局专项，重复项不另计。覆盖新三课真实进入、跨段搜索定位、刷新、稀疏授权、五种尺寸及缺图隔离。真实零星→一星→五星专项验证金章持续扫光、手动重看和减少动态，收藏及首次日期保持。8 项单元检查、首页构建、原三个固定包与新 41 文件／7 请求固定包校验通过。应用内浏览器最终控制台错误／警告为空。

演示号新增三课当前版满星，仅用于用户此前要求的全收集预览；操作前有数据库备份，原 30 条纪念卡及日期和学习进度保持不变。实际获星验证使用独立账号，不把演示状态当成学习过程证据。无剩余阻断或重要视觉／操作问题；实体手机、微信和完整发布验收仍待完成。未提交、未推送、未发布。以下为历史版本结果。

## 2026-10-22 地标点击与满星纪念样板

完成 Lesson 1–2、3–4、5–6 三组场景的按压与回弹，并用固定星花金章替代持续地标呼吸光圈。人物、道具和环境保留原生素材；只有新集齐满星或主动点击金章才播放约一秒的轮廓扫光、末星轻抬和金章弹入。当前规范及素材提示词见[v1.5](docs/designs/course-journey/2026-10-22-0114-v1.5-地标点击与满星纪念反馈.md)。

同为 390×844、DPR 1、选中 Lesson 1–2 的[原状态](docs/designs/course-journey/evidence/2026-10-21-map-feedback/first-390x844.png)与[最终状态](docs/designs/course-journey/evidence/2026-10-22-game-feedback/mobile-390-final.png)已放在同次视觉输入中比较。金章位于星数左侧，文字和当前提示完整，原呼吸光圈已消失。另检查[1440×1024 桌面](docs/designs/course-journey/evidence/2026-10-22-game-feedback/desktop-1440-final.png)与[320×568 小屏选中 Lesson 5–6](docs/designs/course-journey/evidence/2026-10-22-game-feedback/mobile-320-selected5.png)；短屏保留滚动，不能声称三个场景同时全在首屏。

- P2 已修复：人物点击没有响应。三组完整人物按钮均可选课；按下压到 97%，松开以脚底为支点回弹，标签和学习入口保持稳定。
- P2 已修复：连续点击时 CSS 过渡与回弹并存。首轮 Chromium 修正后 WebKit 仍复现；最终按压和回弹共用可取消动画引用，两引擎保留原“不叠加”断言并通过。
- 成果表达调整：原有历史满星安静显示金章；新满星庆祝一次，重看只播放动画。真实一星、五星、纪念卡和首次满星日期通过实际作答核对，点击及刷新不改成绩。

五项复查：字体、完整中文课名和课号保持原规则；人物等比和脚底锚点没有改变，手机金章点击区至少 44px；深绿表示当前、暖金表示成果；新金章采用现有星花、人物和认可图为生成参考，alpha 原生保留；页面仍准确显示 72 单元目录、真实星数和当前学习入口。人物仅整组运动，未宣称独立挥手／摇伞。减少动态及装饰失败降级规则已固化。

验证共覆盖 Chromium 根路径 11 个不同场景、WebKit `/lesson/` 7 个不同场景；修正动画后额外复验两引擎各两项点击／滚动，重复执行不累计为新覆盖。真实获星专项包含一次自动庆祝、主动重看、刷新不重播及收藏日期不变。Chromium 还通过原生触摸拖动验证页面实际滚动；WebKit 检查指针取消与短屏操作。7 项相关单元检查、首页打包及三个素材固定包校验通过。应用内浏览器最终控制台错误／警告为空。

无剩余阻断或重要视觉／核心操作问题；实体手机、微信及完整发布验收仍待完成。未提交、未推送、未发布。下方 v1.4 呼吸光圈仅为历史方案及当时结果，现行效果以本节及 v1.5 为准。

## 2026-10-21 图钉选中与获星光效

按用户反馈调整三个状态：图钉参加课号行布局，当前课程使用深绿标签和“当前”文字，已获星及满星地标分别保持亮光。复用纪念卡原生星图与光效参数，人物、环境和位置基准未变。[v1.4 规则与验证](docs/designs/course-journey/2026-10-21-2141-v1.4-课程选中提示与获星光效.md)记录持续要求。

同为 390×844、DPR 1、选中 Lesson 1–2 的[修复前](docs/designs/course-journey/evidence/2026-10-21-map-feedback/before-390x844.png)与[修复后](docs/designs/course-journey/evidence/2026-10-21-map-feedback/first-390x844.png)已放在同次视觉输入中比较；1440×1024 桌面另检查[首课选中](docs/designs/course-journey/evidence/2026-10-21-map-feedback/first-1440x1024.png)和[雨伞课选中](docs/designs/course-journey/evidence/2026-10-21-map-feedback/selected-unit3-desktop.png)。320px 学堂选中标签右边约 315px，没有超出屏幕。

- P2 已修复：原图钉绝对定位侵入文字，手机三个节点和桌面首课均复现。行内图钉与“当前”标记有独立空间，四宽回归交叠面积为零。
- P2 已修复：原选中状态仅有轻微描边。深绿实底、白字和“当前”文字不依赖金光表达，切换后唯一当前标签与操作区同步。
- 新增成果表现：纪念卡星图、柔光与 4.8 秒扫光用于已获星；满星地标有 5.8 秒金色光场和地面光环，人物原色保留。零星、一星与满星分别用真实作答验证，不借用演示数据替代规则检查。

五项复查：中文及英文字体沿用已确认字库，字号和完整课名可读；人物与标签空间未改变，图钉退出悬浮位置，文字无交叠；选中使用深绿／白色，成果使用纪念卡金色；星图复用原生 WebP，人物与环境没有重画；当前课程、Lesson 名称、星数及首次日期保持真实含义。既有参考画风继续成立，本轮颜色和状态变化为用户明确要求。

两引擎 14 项专项与 7 项单元检查通过；实际浏览器减少动态时所有光效循环和星星伪元素扫光停止，15 个已获星位与三个满星光场仍保留。控制台错误／警告为空。无剩余 P0／P1／P2；实体设备与微信仍待验，未提交、未推送、未发布。下方保留此前人物场景和布局验收历史。

## 2026-10-21 三组人物场景补齐

本轮按用户确认的扩展方向，为 Lesson 3–4 增加顾客、工作人员和雨伞柜台，为 Lesson 5–6 增加学堂前的三人组。保持原认可人物画法和环境；新增人物、空地及手机纵向留白属于本轮授权变化。完整规则与提示词见[v1.3](docs/designs/course-journey/2026-10-21-1943-v1.3-前三单元人物场景实现与提示词固化.md)。

视觉真值仍为原认可手机图及桌面补充稿；手机源图 853×1844、桌面源图 1487×1058，分别使用已归档的 390×844 和 1440×1024 归一化副本。相同 CSS 视口、DPR 1、根目录、选中 Lesson 1–2 的最终截图与对应参考在同一次视觉输入中比较：[手机](docs/designs/course-journey/evidence/2026-10-21-story-nodes/mobile-390-final.png)、[桌面](docs/designs/course-journey/evidence/2026-10-21-story-nodes/desktop-1440-final.png)。另核对 [390×932](docs/designs/course-journey/evidence/2026-10-21-story-nodes/final-390x932.png)、[768×1024](docs/designs/course-journey/evidence/2026-10-21-story-nodes/final-768x1024.png)和[查询 6](docs/designs/course-journey/evidence/2026-10-21-story-nodes/search-6-final.png)。

| 严重程度 | 本轮发现 | 修正与最终证据 |
| --- | --- | --- |
| P2 | [第一轮](docs/designs/course-journey/evidence/2026-10-21-story-nodes/initial-390x844.png)手机首课标签落在固定底栏之后；增加人物后，原先统一放在下方的标签占用过多纵向空间。 | 手机首课标签移到人物右侧，390×844 最终首屏三个课程入口均可见；320×568 保留滚动。三课人物可见边界与标签无交叠的两引擎专项通过。 |
| P2 | 桌面学堂前的星数与花草混在一起，辨识度不如首课。 | 三课星数共用浅纸色衬底，最终桌面图的五颗星均可辨认，未改动实际星数。 |
| P2 | 320px 宽时首课标签曾超出地图底边约 3px。 | 调整标签位置与地图下限，原完整边界断言保留并通过；没有隐藏标签或降低点击尺寸。 |

五项核对：中文寒蝉圆黑体和英文 Nunito 保持原字体准备；文字／按钮维持可读尺寸，手机标签右置避让人物，桌面左栏不变；奶油、珊瑚、青绿与暖棕配色延续；两组新素材实际透明合成无可见背景块，人物身份、单把伞和三人互动与各课纪念卡一致；课号、名称、72 单元数量、五星和续学地址继续来自真实账号数据。

本轮已单独放大查看三个原生人物素材，完整桌面截图中各组人物与道具也足够清楚；相邻标签和人物可见边界另有自动几何验证，因此没有另造合成局部图代替浏览器证据。初始手机图、带星数衬底但标签尚未移位的[中间图](docs/designs/course-journey/evidence/2026-10-21-story-nodes/mobile-390-before-label.png)与最终图均保留。

Chromium 根路径 7 项、WebKit 子路径 5 项不同场景通过，最后布局调整后针对三项相关检查复验，两引擎均通过；19 项目录／字体／检查选择验证和构建通过。实际预览验证搜索 6、目录关闭与地图操作，控制台错误／警告为空。无剩余 P0／P1／P2；实体设备、微信、真实软键盘与弱网验收仍待完成。未提交、未推送、未发布。

下文为前几轮修复与历史视觉对照，保留当时范围。

后续修改的持续要求统一在[界面设计约束 v1.2](docs/designs/course-journey/2026-10-21-1908-v1.2-旅程首页与纪念册问题修复及设计约束.md)维护；本页保留真实画面对照、修复过程及验收范围。

2026-10-21 响应式修正：原实现只按宽度设置固定比例，平板另有 660px 上限；同宽手机的地图高度不随可用高度变化，平板留边且首课落在固定操作区之后。[修正前平板](docs/designs/course-journey/evidence/2026-10-21/responsive-before-768x1024.png)。现在按地图实际宽度、窗口高度及导航／课程栏占用空间计算画面；构图选择与桌面导航断点分离，环境、人物、星数和节点共用等比画布，只裁装饰性边缘，极短屏保留滚动。

- 同为 390px 宽：[844px 高](docs/designs/course-journey/evidence/2026-10-21/responsive-after-390x844.png)地图可视高度约 491px；[932px 高](docs/designs/course-journey/evidence/2026-10-21/responsive-after-390x932.png)约 579px，画布也由 390px 宽等比放大到 434px，三个节点保持完整。
- [768×1024 平板](docs/designs/course-journey/evidence/2026-10-21/responsive-after-768x1024.png)改用横向构图并占满内容宽度，首课入口在底部操作区之上。[320×568 滚动状态](docs/designs/course-journey/evidence/2026-10-21/responsive-after-320x568-scrolled.png)三个完整入口均可到达，搜索和底部操作保留。
- [1440×1024 桌面](docs/designs/course-journey/evidence/2026-10-21/responsive-after-1440x1024.png)与新 390×844 实图分别与同尺寸认可参考在同组输入中核对；人物、环境风格、地标关系和文字均保留。
- 本轮 Chromium 根路径与 WebKit `/lesson/` 各 4 项专项通过，共 8 项；另 7 项目录／模型检查与构建通过。新增检查覆盖同宽变高、平板旋转、等比与脚底锚点、完整按钮边界和短屏访问。WebKit 首轮读到了旋转后尚未更新的上一帧尺寸；追踪确认后改为等待实际布局满足原几何断言，未修改产品尺寸或放宽边界，复验通过。真机与微信仍待验。

2026-10-21 入口整理：本机旧记录已从首页移到“我的”中默认折叠的次级入口，首页不再出现该区域；桌面菜单可直接进入查看。手机与桌面实际操作均通过，旧匿名成果恢复专项通过，数据读取与保存规则不变。[新的入口截图](docs/designs/course-journey/evidence/2026-10-21/legacy-in-my.png)。下文保留旅程地图初版的视觉对照过程。

本次结论适用于前三个单元的地图、72 单元授权目录与搜索，以及下列浏览器视口。无剩余 P0／P1／P2 视觉或核心操作问题；实体手机、微信和真实软键盘尚未验收。

## 对照来源与状态

- 手机唯一视觉基准：[认可稿](docs/designs/course-journey/references/approved-mobile-v1.png)，853×1844 像素，按 390×844 CSS 目标归一化；只在 QA 副本处理不足 1 像素的比例舍入，原图不变。
- 桌面布局参考：[补充稿](docs/designs/course-journey/generated/desktop-home-v1.png)，1487×1058 像素，按 1440×1024 归一化。
- 最终手机截图：[390×844](docs/designs/course-journey/evidence/2026-10-21/mobile-390-final.png)。Chrome 移动设备模拟，deviceScaleFactor=1，实际内容宽 390；当前选中 Lesson 1–2，显示预览学生的真实五星。
- 最终桌面截图：[1440×1024](docs/designs/course-journey/evidence/2026-10-21/desktop-1440-final.png)。应用内浏览器捕获；桌面左栏按细化规范采用 340px。
- [320×568 滚动状态](docs/designs/course-journey/evidence/2026-10-21/mobile-320-scrolled.png)、[Lesson 50 搜索](docs/designs/course-journey/evidence/2026-10-21/search-50-v2.png)、[可用高度 500px 的最终搜索](docs/designs/course-journey/evidence/2026-10-21/compact-search-final.png)。另以 Chromium／WebKit 检查 768px 布局。

归一化后的来源与实现曾放在同一组视觉输入中，分别比较手机和桌面全图。人物、手提包、星数与首课标签另作同区域对照：[来源局部](docs/designs/course-journey/evidence/2026-10-21/reference-mobile-focus.png)、[实现局部](docs/designs/course-journey/evidence/2026-10-21/mobile-focus-final.png)。以上均为真实浏览器截图，没有用生成图代替运行画面。

## 首轮发现与修正

| 严重程度 | 问题与证据 | 修正及复查 |
| --- | --- | --- |
| P2 | [桌面第一轮](docs/designs/course-journey/evidence/2026-10-21/desktop-1440-v1.png)人物相对场景偏大，圆平台缺少认可稿中的草坪。 | 透明人物从场景宽度 32% 调整为 25%；用内置 imagegen 只修正环境平台草坪，保留原生图和请求。最终桌面图已与参考同输入对照。 |
| P2 | 地图标签在大屏偏小。 | 桌面课号 18px、标题 22px，保留手机 14px／16px；最终图中三个标签均可读，身份和地标对应明确。 |
| P2 | [手机第一轮](docs/designs/course-journey/evidence/2026-10-21/mobile-390-v1.png)首课标记挤到星星，标签离固定操作区过近。 | 手机标记移至标签左侧，压缩标题区冗余间距；390 宽最终标签底部约 661px，操作区从 672px 开始，星数和标签完整可见。 |
| P2 | 搜索只有一个结果时，目录面板留白过大。 | 少量结果采用 60dvh 高度，结果补充对应课程缩略图；查询 50 精确显示 Lesson 49–50。 |
| P1 | [可用高度 500px 的第一轮](docs/designs/course-journey/evidence/2026-10-21/compact-search-v1.png)结果区仅约 29px，进入按钮超出可见区。 | 按 visualViewport 高度展开面板，并收起次要说明和范围筛选；最终面板 488px 高、结果区 125px，44px 进入按钮完整可见。两引擎新增几何断言并通过。 |
| P2 | 短屏键盘／自动定位可能把节点放到固定操作区后面。 | 节点增加滚动安全边距，移动搜索随页面滚动固定在上方。320 宽实际滚动 286px 后搜索仍位于可见顶部，没有横向溢出。点击是否跳页从真实指针事件前采样，区分工具预滚动。 |

修正后再次捕获并对照最终手机、桌面和紧凑搜索画面。字体、布局、颜色、素材和文案均已检查；没有用构建成功代替视觉比较。

## 五项视觉核对

- 字体：首页中文使用现行标准的寒蝉圆黑体，英文／数字使用 Nunito，标题和正文分层；共用品牌导航保持现有纪念册风格。完整字库和姓名覆盖沿用课程字体准备，未为匹配效果图另引入一套手写字体。
- 布局：桌面 340px 左栏配宽幅环境；手机自然纵向滚动、固定搜索和底部课程操作区。320／390／768／1440 宽度无横向溢出，节点和核心按钮达到 44px 操作尺寸；短屏不压缩整张地图。
- 颜色：奶油纸色、深绿操作、珊瑚拱墙、青绿水面和暖棕描边与基准一致；选择状态和真实星数由组件绘制，不烘焙进图片。
- 素材：首课男士的圆眼镜、蓝绿外套、黄领带，女士帽子、珊瑚外套和黄围巾，以及单个红手提包均保留。环境和人物为真实生成的独立栅格资产，保留 alpha；UI 图标来自 Phosphor，没有用 CSS／SVG 手工画人物或环境。
- 文案：真实目录更新为 72 单元、Lesson 1–144；地图仅标注已实现的 Lesson 1–6。课程名称、星数和续学地址来自授权接口。其他单元没有虚构“地图定位”入口。

## 功能和无障碍

在应用内浏览器完成节点选择、Lesson 50／144 搜索、目录关闭、短屏滚动、可用高度缩小，以及实际进入 Lesson 3–4。该课加载完成后，原五星和 2026.10.16 日期保持可见。控制台错误／警告检查为空。

自动化覆盖两引擎的搜索、焦点、地图定位、减少动态、图片失败重试、目录可用性、真实学习和账号隔离。目录采用原生 dialog、关闭后恢复焦点；回车只聚焦当前可见结果，手机只渲染一份搜索输入。未把模拟视口称为实体键盘或微信验收。

## 可选精修

P3：手机底部人物缩略图比概念稿略小，以容纳真实长课程名及完整进入按钮；可以根据实际课堂使用继续微调。桌面沿用已确认的共用文字导航，没有改成补充概念稿中的大图标导航。

## 交付状态

设计与本地功能验收通过。完整结果见[实现与验收](docs/designs/course-journey/2026-10-21-0207-v1.1-旅程地图首页实现与验收.md)。未提交、未推送、未发布。

此前课程书 QA 原件保存在本机 `.data/fronted-preview/design-qa-course-book-before-journey.md`，避免覆盖历史检查结论。
