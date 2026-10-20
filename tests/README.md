## 2026-10-20提交前收集与环境补验

Lesson1–2和3–4的v1.54账号专项与原账号专项分别由Playwright收集，不能在一个`.spec.js`中导入另一个`.spec.js`。单独复验这两课时，同时指定`unit1-2-v154-account.spec.js`、`unit1-2-award.spec.js`、`unit3-4-v154-account.spec.js`和`unit3-4-grammar.spec.js`；原身份、统计、日期、同步和导出断言全部保留，完整登录套件自动包含四个入口。既有历史批次数字仍按当时执行方式解读。

Lesson5–6当前使用插画结算页，共用结算检查应按现有插画模式滚动到操作区，再验证三项统计与两个按钮全部可见；不能继续套用旧无插画页的起始视口。几何、次数与刷新断言不放宽。

Windows单元检查中的POSIX权限／符号链接与SQLite临时目录清理分支，在Ubuntu与同版本Node下补验；保留Windows原始失败，不能把它写成Windows全通过。原始trace及解包请求记录仅留本机，不进提交；截图、PDF和审定摘要保留。归档的失败上下文与冻结源码按原字节保存，正常课程源码继续检查空白格式，PDF明确作为二进制。

## 剩余82项修复与验收（2026-10-20）

[修复记录](../docs/butcher-version/2026-10-20-0134-v1.0-Lesson1-144剩余问题修复与验收.md)及[证据](../docs/butcher-version/evidence/2026-10-20-0134-remaining-fixes/README.md)覆盖44课284题答前原文、29课练习纸、两处短示范、一处题意、五课题型登记和用户确认的目录共用字体准备。原128项明确问题累计关闭；人工／设备／全课弱网／发布及原Node环境问题继续单列。

新增静态专项为 `reading-materials-acceptance.spec.js`、`worksheet-acceptance.spec.js`、`lesson-wording-repairs.spec.js`；分别使用 `MATERIAL_REVIEW_BROWSER`、`PAPER_REVIEW_BROWSER`、`WORDING_REVIEW_BROWSER` 切换引擎。账号目录使用 `tests/login/directory-font-preparation.spec.js`、`DIRECTORY_REVIEW_BROWSER` 与 `AWARD_TEST_BASE=/` 或 `/lesson/`。端口沿用 `COURSE_TEST_PORT`／`LOGIN_TEST_PORT`。独立答案与原文映射在 `tests/support/reading-materials-acceptance.json`，不从程序答案生成预期。

材料两引擎各44项；纸页两引擎各29项，实际PDF只由Chromium生成；示范／题意各3项。真实未答材料、刷新、错答和未提交选择需保留原断言。打印几何先在打印媒体捕获，再生成会触发afterprint的PDF；DOM题数不能代替纸面。最终29份68页均已目视，相关空间数量不作为新课统一配额。

共用字体课包检查为 `node --test tests/unit/directory-font-package.test.js`，工作流检查为 `node --test tests/workflow/check-workflow.test.js`。检查选择器按实际受影响课号选材料／纸页／措辞，不要求每次新课重跑全部旧课。`npm run check:plan`只说明范围；本轮未执行 `check:commit`，不能声称仓库全绿。

缓存性能沿用 `course-cache-cold.spec.js` 与 `course-cache-performance.spec.js` 的5秒、P95 1.5秒原断言。目录共用字体预备是生产页面行为，从空资料真实进入目录；目录准备与点课耗时分列，不偷偷测试预热。并发任务结束后串行测量，保留两次首课4.2943／4.2274秒、目录首访26.9573秒、20次缓存复访P95 0.8272秒及稳定性资料；不推广为全课、直链或真机性能通过。

`course-loading-recovery.spec.js`两项状态恢复在冻结前版同样早于页面就绪失败，按真实course-ready边界再执行原词卡／姓名／五星／日期断言，记录5.52–5.63秒。它不改变独立性能门槛。HTTP503须确认实际命中；Windows临时目录清理先核对同一真实路径与范围。首错、准备修正和产品修复分开留存。

## 剧情、图内字体与历史成果修复（2026-10-19）

[修复记录](../docs/butcher-version/2026-10-19-1222-v1.0-剧情提示图内字体与历史成果修复.md)及[证据](../docs/butcher-version/evidence/2026-10-19-1222-design-fixes/README.md)记录17课默认剧情摘要、26课179幅图字体、Lesson3–4卡面进度，以及Lesson49–50旧证查看／PNG／打印／日期的修复。本轮127个浏览器用例、11个工作流用例通过；最后12项布局复验属于原覆盖，不重复累计。当轮全量验收46项标已修复、剩余82项待处理；后续状态以本文顶部2026-10-20记录为准。

新增专项为 `tests/e2e/story-reading-boundary.spec.js`、`unit3-4-card-progress.spec.js`、`tests/login/unit49-50-legacy-certificate.spec.js`。静态检查用 `npx playwright test --config playwright.config.js tests/e2e/story-reading-boundary.spec.js tests/e2e/unit3-4-card-progress.spec.js`；账号旧证用 `npx playwright test --config playwright.login.config.js tests/login/unit49-50-legacy-certificate.spec.js`。分别用 `DESIGN_REVIEW_BROWSER`、`UNIT34_REVIEW_BROWSER`、`UNIT49_BROWSER` 切换 Chromium／WebKit，端口沿用 `COURSE_TEST_PORT`／`LOGIN_TEST_PORT`，路径沿用 `AWARD_TEST_BASE`。受影响场景四宽专项和当前卡／历史升级用例按修复记录复用。`node --test tests/workflow/check-workflow.test.js`检查选择规则；`npm run check:plan`只说明选择，不代表全部已执行。

先保留原问题失败，再验证初始／推进／刷新续读／完成回看；删除的摘要节点不得成为新断言的教学前提，原文、人物、道具归属、安全提示及场景布局继续验收。卡面必须在真实错答完成后显示同一轮状态，再实际点击重练，不能只检查按钮存在。

旧证用真实旧站完成领取后同库升级，核对原名、ISO、全部历史字段、新版获星后旧快照不变。PNG逐像素比较；Chromium前后实际PDF另核对原字体／字号／字重／行高、正文和渲染像素；WebKit仅对打印调用与结束恢复作声明。Windows夹具按独立文件复制、目录联接构建，清理前校验临时目录范围；不改变生产权限。首错、测试准备调整和产品修复分别留存，不放宽判分、日期、像素或布局断言。

图内字体另核对688个标签值、非文字图形、viewBox和26课真实引用；179图全部总览经目视检查。旧证必要资产及原字体不参与转换。原预览14条学习记录、14条奖励与72课定义摘要不变；实体设备、课堂、打印机与全课弱网不冒记通过。

## Lesson5–6统一标准重构（2026-10-18）

[现行设计](../docs/butcher-version/2026-10-18-1134-v3.0-Lesson5-6语法重构与历史成果保护.md)及[证据](../docs/butcher-version/evidence/2026-10-18-1134-unit5-6/README.md)记录五区36题（4／3／11／4／14）和v1.54范围。专项为`tests/e2e/unit5-6-v154.spec.js`、`unit5-6-v154-history.spec.js`、`tests/login/unit5-6-v154-account.spec.js`及`unit5-6-v154-upgrade.spec.js`；独立答案在`tests/support/unit56-answers.js`。`UNIT56_REVIEW_BROWSER=webkit`切换引擎，账号用`AWARD_TEST_BASE=/`及`/lesson/`，端口用既有变量隔离。

实际前版26题，21道未改题按精确前驱承接；三道理解补材料、两道三处填空重组、特殊疑问句和选择事实边界新增，未答不得代填。验证本机原错答／草稿／词卡位置、原五星及首次时间、旧26题课堂版／27题配音版纸证原内容和PNG／打印、同库及另一设备的26条有效历史。更早短综合版本继续用原专项检查。旧GIF全60帧比对；新账号实际完成36题，检查2／4／2三卡、卡面重练、1星及5星GIF、跨设备、身份隔离、已打开页面离线作答及真实进入核验503恢复。

四宽、短屏与字体就绪后实图分别核对。首页必须检查整个单元图片，嵌套容器可能留下.featured-art外的旧人物。正文明确注册Nunito；9字补充和14幅图内标签均有源字体及许可依据。Written A4／B10、完整原例、30条32px线、三页PDF及两张单页旧证逐页目视；不能以DOM数量代替纸面。新目录、标签和字库脚本纳入本课检查选择，不重画旧资产或强制所有课程采用同样结构。

首轮缺slots、pointer-events继承、短屏越界、字体回退和入口残留分别修产品；浮层／正文卡重复定位、缺speechSynthesis的测试初始化及旧打印行数预期分别修测试。原断言、第一次失败和受影响复验留存，不放宽内容、判分、像素或尺寸门槛。旧文档下方的26／30题和一页纸是历史记录，以本节与现行单元文档为准；真机、教师、儿童和实体打印待验。

## Lesson3–4统一标准重构（2026-10-18）

[本课设计](../docs/butcher-version/2026-10-18-1017-v3.1-Lesson3-4原文依据与历史成果保护.md)与[证据](../docs/butcher-version/evidence/2026-10-18-1017-unit3-4/README.md)记录v1.54实际范围。专项为`tests/e2e/unit3-4-v154.spec.js`、`unit3-4-v154-history.spec.js`及`tests/login/unit3-4-v154-account.spec.js`、`unit3-4-v154-upgrade.spec.js`；`UNIT34_REVIEW_BROWSER=webkit`切换引擎，账号用`AWARD_TEST_BASE=/`和`/lesson/`。账号入口专项复用原语法完整流程，不重复计算覆盖。

33题中R1／R2补原文并更新题号与理解会话，其余31题不变。验证原有效轮次、五星卡、首次日期、旧25题课堂版／27题配音版纸证，以及本机错答和未提交选择、服务器已验证历史。旧PNG同引擎逐像素比较，GIF比较全部60帧。两页练习纸及各一页旧证逐页目视，页数通过不代替纸面核对。

字体loaded不代表旧证首次canvas基线一致；导出显式准备实际原字体后，用无诊断预热的冷页面复验。刷新按真实课页就绪边界断言，离线答题与导航失败单列。旧站冻结原首页和原课程，不能混入新素材契约。保留原失败、隔离及修复范围，不放宽判分、PNG或布局断言。新人物独立入包，另外71课依清单不变证据复用；不要求新课程套用本课的历史版本数量、33题或旧证能力。

## Lesson1–2统一标准重构（2026-10-18）

[单元记录](../docs/butcher-version/2026-10-18-0912-v3.0-Lesson1-2视觉重构与历史成果保护.md)与[证据](../docs/butcher-version/evidence/2026-10-18-0912-unit1-2/README.md)按v1.54记录实际范围。专项为`tests/e2e/unit1-2-v154.spec.js`、`unit1-2-v154-history.spec.js`及`tests/login/unit1-2-v154-account.spec.js`、`unit1-2-v154-upgrade.spec.js`。用`UNIT12_REVIEW_BROWSER=webkit`切换专项引擎；账号分别设置`AWARD_TEST_BASE=/`与`/lesson/`，端口用现有变量隔离。账号专项复用已有1–2完整奖励流程，不重复计为新覆盖。

本课沿用37题及奖励版；验证原有效轮次不变、真实旧25／37题页的证书原文与PNG、同库原五星卡的60帧和精确日期、跨设备历史及示范只记录新提交。未改变的题稿／前驱、共享组件、字体和原素材有摘要保留依据；不要求新课套用本课版本数量、37题或旧证能力。WebKit短屏失败先原版隔离，再限定本课修复。Worker关闭时图片可能是blob URL，比较已解码像素；不要为测试fetch(blob)失败放宽站点CSP。

## Lesson17–30首页横幅同步（2026-10-18）

[专项记录](../docs/butcher-version/2026-10-18-0843-v1.0-Lesson17-30首页横幅同步与标准补强.md)落实统一标准v1.54新增的独立首页横幅验收项。静态入口用`tests/e2e/home-banners-1730.spec.js`，真实账号用`tests/login/home-banners-1730.spec.js`；后者分别设置`AWARD_TEST_BASE=/`与`/lesson/`，两类均可用`BANNER_REVIEW_BROWSER=webkit`切换引擎。

本次七课复用现行插画，独立预期在`tests/support/home-banners-1730.js`。检查320／390／768／1280实际布局、人物图不裁切／拉伸／遮挡、入口与课内封面及当前纪念卡的实际加载内容、刷新与授权；另验证真实图片加载失败及重试。测试中的同文件要求仅适用于这七课本次明确的复用方案，通用标准允许合适的不同构图，不能把固定文件名、格式或七课集合强加给新单元。

新建或改造单元应补齐自身首页视觉证据，功能入口检查或图片解码成功不能代替对照。共享目录变更按实际调用方选择回归；本专项不是每次新课开发前重跑所有旧课的要求。原课程、资产、证书及存储实现未变时，按O16记录保留核对和相关展示验收，未受影响的课程／迁移／旧证导出证据可说明依据后复用。

## Lesson45–46统一标准重构（2026-10-17）

[设计与来源](../docs/butcher-version/2026-10-17-2145-v2.0-Lesson45-46统一标准重构与验收.md)。现行54题用`tests/e2e/unit45-46-v153*.spec.js`，独立答案在`tests/support/unit4546-v153.js`；`UNIT4546_BROWSER=webkit`切换引擎，PDF只用Chromium。旧两个页面文件共18项保持原断言，由七个冻结文件及同源HTTP／Worker课包运行；辅助服务端口为COURSE_TEST_PORT＋30。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit45-46.spec.js tests/login/unit45-46-v153-upgrade.spec.js`；两引擎分别设`AWARD_TEST_BASE=/`及`/lesson/`。实际旧账号49题五星同库升级，全部GIF帧、姓名／日期／账本及另一设备的49条历史分别核对；当前题完成后仍留旧成果。原卡已用Gothic／Nunito，不复制前课原字体例外。

真实旧页空白、仅选、错答和两空草稿、第四页词卡、第8句阅读、已完成五区分别验证。旧完整后理解1／5、语法4／16、应用1／5、综合13／21未答，listen原轮次不重开。本机未完成信息不当作已同步完整成果。

人物、纸张和手部前景用独立类定位；同一张信只在正确检查后移动，镜像仅影响人物。原文按教材图到第7句才由Bob持信，第10句才由Pamela持信。截图、实际轮廓和节点身份分别核对，不能只数一张图。词卡另验320宽handwriting不拆行、不越卡边，数字图用本地Nunito轮廓。

A7／B8保留全部原题、两个A原例、两个四句B原例；31条32px线，实际两页PDF逐页目视并提取正文。B明确指定肯定假设，不从问句猜有能力。教师、儿童、实体微信和实体打印仍待验；原卡无打印能力，旧证打印项不适用。

## Lesson43–44统一标准重构（2026-10-17）

[设计与来源](../docs/butcher-version/2026-10-17-2050-v2.0-Lesson43-44统一标准重构与验收.md)。现行46题运行`npx playwright test tests/e2e/unit43-44-v153`；`UNIT4344_BROWSER=webkit`选择WebKit，PDF只用Chromium。独立题稿在`tests/support/unit4344-v153.js`，保留全部46题未答材料与实际源图／纸面目视。

六个实际前版文件冻结在`tests/fixtures/unit43-44-before-v153/`，原静态11项由历史HTTP服务运行，辅助端口为COURSE_TEST_PORT＋30。旧课是44题五星，没有15星纸证。空白／仅选／错答和双空草稿、词卡第三页、第8句阅读、已完成五区分别验证；原listen／apply轮次不重开，修订后roles第4／5、grammar第6／13、exam第16／16未答。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit43-44.spec.js tests/login/unit43-44-v153-upgrade.spec.js`；两个引擎分别用`AWARD_TEST_BASE=/`和`/lesson/`。实际旧页完成后同库升级，另一设备回读44条历史；原GIF全部60帧、原姓名／日期和账本分别核对，不能用新字体断言修改原卡。未完成本机草稿与已同步完整成果分开。

页面断言在公开加载就绪之后执行，记录准备耗时；不在加载层尚显示时把缺少DOM当成成果丢失。动态图片等待实际解码，记录pending路径；不降低完好图片的判断。缺图针对本课独立Penny素材，确认实际404，再验重试、刷新和目录复访；取消和失败导出保持原规则。初始失败与范围复验单列，不能只留下最后通过。

纸笔A7／B10、完整改写与问答原例、27条32px书写线，实际两页PDF逐页核对正文和编号。原卡无打印能力，本课旧证打印项不适用，实体新练习纸打印仍待验。教师、儿童及真机微信待验；普通开发不等于提交或发布验收。

## Lesson41–42统一标准重构（2026-10-17）

[设计与来源](../docs/butcher-version/2026-10-17-1900-v2.0-Lesson41-42统一标准重构与验收.md)。现行47题使用`tests/e2e/unit41-42-v153.spec.js`、`unit41-42-v153-upgrade.spec.js`、`unit41-42-v153-interactions.spec.js`、`unit41-42-v153-reading.spec.js`、`unit41-42-v153-materials.spec.js`、`unit41-42-v153-print.spec.js`。设`UNIT4142_BROWSER=webkit`切换引擎，PDF只用Chromium。独立预期在`tests/support/unit4142-v153.js`。

原43题七文件冻结于`tests/fixtures/unit41-42-before-v153/`，原静态17项继续在冻结页运行；其中含更早polish前到43题的旧检查。当前新增检查直接从更早真实原页升级，另验空白、仅选、错答／草稿、词卡四页、16句阅读、旧五星与未改apply轮次。原语法继续第7／14题、综合第4／16题，修订题未答，旧星不扣。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit41-42.spec.js tests/login/unit41-42-v153-upgrade.spec.js`；两引擎分别设`AWARD_TEST_BASE=/`和`/lesson/`。真实旧页完成五星、导出GIF后同库升级，所有GIF帧、姓名、原日期、奖励账本及43条已同步原记录分别核对；完成新版修订题后再从另一设备读回历史。原卡Round／Book 400是历史保护，不套其他新卡Gothic 500断言。更早原始完整记录的服务端归一化使用真实浏览器生成的载荷验证。

原卡无15星纸质证书和打印按钮，不虚构这些历史；本课新练习纸保留A6／B10、四个A原例、两个B原例和26条32px线，最终实际两页。PDF应逐页查看正文、原例、题号和完整问答，检查visibility级联，不以线条可见代替文字可见。人物、位置图、分数标签和长问答材料目视与功能检查分别记录，失败、修复及影响范围见单元证据；人工四项待验。

## Lesson39–40五星重构（2026-10-17）

[设计与来源](../docs/butcher-version/2026-10-17-1750-v3.0-Lesson39-40五星重构与验收.md)。46题现行检查：`npx playwright test tests/e2e/unit39-40-fivezones.spec.js tests/e2e/unit39-40-fivezones-interactions.spec.js tests/e2e/unit39-40-fivezones-upgrade.spec.js tests/e2e/unit39-40-materials.spec.js tests/e2e/unit39-40-reading-controls.spec.js tests/e2e/unit39-40-print.spec.js`。`UNIT3940_BROWSER=webkit`切换引擎，PDF只用Chromium。独立题稿在`tests/support/unit3940-fivezones.js`。

真实旧33题、13句、六个v1会话冻结于`tests/fixtures/unit39-40-before-fivezones/`。空白／仅选／错答／词卡／阅读／参考册／领证后升级分别核对；旧综合16题接新版第17／21题，新题未答。旧名“小禾”和账号名“新课姓名”分开，旧PNG逐像素、390／1280姓名样式、42px打印姓名及原日期独立验。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit39-40-fivezones.spec.js tests/login/unit39-40-fivezones-upgrade.spec.js`，在两个浏览器分别设置`AWARD_TEST_BASE=/`和`/lesson/`。原`tests/login/unit39-40.spec.js`固定子路径服务批次，第二项自建根服务。真实1／5星GIF、C浮层、A册、跨设备、权限、缺图404、离线和取消下载均保留。

交接人物呈现按新素材朝向重排，旧问题对象与人物ID不变；花瓶竖直落掌，不继承锤子旋转。动态图片按实际解码检查；原参考是每页两独立图、六页，编号13–20／30／40／50／60，不套前课成对对象。A5、B10和两个原例，15条32px线，实际2页A4逐页目视。

72门现行课均为五星后，管理端旧15星契约使用显式冻结39–40前版，HTTP样本也使用相匹配的隔离旧站；现行72课目录另验，不恢复产品旧授星。临时站目录与文件按真实类型处理，历史服务端口仍计主端口＋30。原历史页邻课隔离检查指向37–38现行apply入口。失败、修复与范围复验详见本课记录；四项人工验收仍待验。

## Lesson37–38五星重构（2026-10-17）

[设计与来源](../docs/butcher-version/2026-10-17-1300-v3.0-Lesson37-38五星重构与验收.md)。54题现行检查：`npx playwright test tests/e2e/unit37-38-fivezones.spec.js tests/e2e/unit37-38-fivezones-interactions.spec.js tests/e2e/unit37-38-fivezones-upgrade.spec.js tests/e2e/unit37-38-materials.spec.js tests/e2e/unit37-38-reading-controls.spec.js tests/e2e/unit37-38-print.spec.js`。`UNIT3738_BROWSER=webkit`切换引擎，PDF只用Chromium。独立预期在`tests/support/unit3738-fivezones.js`。

实际33题v1六会话冻结于`tests/fixtures/unit37-38-before-fivezones/`。真实空白、仅选择、错答、词卡2页、18句阅读、动作册6页、15星领证后升级；旧综合16题接到新版第17／24题，新增题未答。旧姓名日期、PNG像素、390／1280姓名样式和42px打印姓名分别验，不用旧答案拼出新版零错。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit37-38-fivezones.spec.js tests/login/unit37-38-fivezones-upgrade.spec.js`，在两个浏览器分别设`AWARD_TEST_BASE=/`和`/lesson/`。`tests/login/unit37-38.spec.js`固定子路径服务批次运行，第二项自建根服务。旧证名与当前账号名不同，验证跨设备、C浮层、A册、1／5星实际GIF、缺图404、离线、权限、账号隔离和取消下载。

交接要验物品和接收者两条件，未提交／错答／刷新不移动，答对只移动原节点。换人物后需按实际手掌重定位和目视，不能只验到达数量。书架全程木色，粉色在计划阶段仅出现在漆罐。六组十二图、one至twelve及our／my差异保留；A4／B5四句问答，共24条32px书写线和两页A4。

管理端15星样本用39–40；跨课程排序混合其完成星与37–38独立五星账本，不能继续寻找两门未迁移课或把新版完成当授星。并发跑历史页检查时计入主端口＋30，避免4310／4340与登录4340冲突；本轮隔离复验用4508／4538。教师、儿童、真机微信、实体打印仍待验；最终证据与复用范围见单元记录。

## Lesson35–36五星重构（2026-10-17）

[设计与来源](../docs/butcher-version/2026-10-17-1000-v3.0-Lesson35-36五星重构与验收.md)。43题现行检查：`npx playwright test tests/e2e/unit35-36-fivezones.spec.js tests/e2e/unit35-36-fivezones-interactions.spec.js tests/e2e/unit35-36-fivezones-upgrade.spec.js tests/e2e/unit35-36-materials.spec.js tests/e2e/unit35-36-reading-controls.spec.js tests/e2e/unit35-36-print.spec.js`。`UNIT3536_BROWSER=webkit`切换引擎，PDF只用Chromium。独立预期在`tests/support/unit3536-fivezones.js`。

真实旧35题v1六会话冻结于`tests/fixtures/unit35-36-before-fivezones/`。迁移从旧程序实际产生空白、仅选择、错答、词卡、15句叙述、路线册与15星领证后升级。原路线按钮是“下一页路线”，分页每页3图共4页；词卡3页。旧综合16题接到新版第17／18题，新增未答。旧PNG逐像素、390／1280姓名样式、42px打印姓名、原日期及原徽章独立核对。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit35-36-fivezones.spec.js tests/login/unit35-36-fivezones-upgrade.spec.js`，两个浏览器分别设`AWARD_TEST_BASE=/`和`/lesson/`。`tests/login/unit35-36.spec.js`固定子路径入口、自建根目录两项，需在默认子路径服务批次执行。账号名与旧证名使用不同值，核对另一设备、1／5星实际GIF、C浮层、A卡册、缺图真实404、离线、权限、隔离和取消导出。

所有43张未答材料逐题目视；上下对比图解除共用120px高度上限，另验320／1280下的原比例和真实尺寸，不以图已解码代替可读性。练习纸A3／B12、B两组原例、27条32px线，实际2页A4逐页检查。管理15星主样本37–38、次样本39–40；本课五星另验。教师、儿童、真机微信、实体打印仍待验，详细结果见本课证据，不代表全仓提交检查。

## Lesson33–34五星重构（2026-10-17）

[设计与来源](../docs/butcher-version/2026-10-17-0900-v3.0-Lesson33-34五星重构与验收.md)。现行47题运行 `npx playwright test tests/e2e/unit33-34-fivezones.spec.js tests/e2e/unit33-34-fivezones-interactions.spec.js tests/e2e/unit33-34-fivezones-upgrade.spec.js tests/e2e/unit33-34-reading-controls.spec.js tests/e2e/unit33-34-print.spec.js`。`UNIT3334_BROWSER=webkit`切换引擎，PDF仅Chromium。独立预期见`tests/support/unit3334-fivezones.js`。

实际33题v1前版冻结于`tests/fixtures/unit33-34-before-fivezones/`，旧12项静态页面断言继续核对原15星。新迁移检查空白、仅选择、错答、词卡四页、10句阅读、动作册四页，以及13题旧综合接到新版第14／19题；新增题未答。动作序号从原数组顺序计算，不能假定旧对象含number字段。

账号运行 `npx playwright test -c playwright.login.config.js tests/login/unit33-34-fivezones.spec.js tests/login/unit33-34-fivezones-upgrade.spec.js`，两个浏览器分别设`AWARD_TEST_BASE=/`与`/lesson/`。旧证名“小禾”与账号名“新课姓名”分开验证。`tests/login/unit33-34.spec.js`保留固定`/lesson/`入口和自建根目录服务两项，需在默认子路径服务下运行，不与根挂载参数混用。

复验旧PNG逐像素、390／1280姓名样式、42px打印姓名、新卡与1／3／5课样板同名同星、真实1／5星GIF、缺图触达、离线、跨设备和取消导出。找船重试保留选择，重复配对可撤销；按真实控件行为检验，不把所有题型都当成清空重选。A5／B12共29条32px线，2页PDF逐页目视。管理端旧15星主样本37–38，次样本35–36，本课五星另验。人工四项仍待验。

## Lesson31–32五星重构（2026-10-17）

[设计与来源](../docs/butcher-version/2026-10-17-0810-v3.0-Lesson31-32五星重构与验收.md)。现行51题运行 `npx playwright test tests/e2e/unit31-32-fivezones.spec.js tests/e2e/unit31-32-fivezones-interactions.spec.js tests/e2e/unit31-32-fivezones-upgrade.spec.js tests/e2e/unit31-32-reading-controls.spec.js tests/e2e/unit31-32-print.spec.js`；设`UNIT3132_BROWSER=webkit`切换引擎，PDF仅Chromium。独立答案见`tests/support/unit3132-fivezones.js`。

原33题v1六会话冻结于`tests/fixtures/unit31-32-before-fivezones/`，旧11项页面检查继续指向真实前版。分别验证空白、仅选、错答和15星领证，再核对原词卡四页、14句阅读、动作册每页3图共6页。旧综合12题承接到新版第13／19题；新增未答，不拼出新零错奖励。未发现有依据的更早前驱链，本课不套用其他课程的历史版本。

账号运行 `npx playwright test -c playwright.login.config.js tests/login/unit31-32-fivezones.spec.js tests/login/unit31-32-fivezones-upgrade.spec.js`，在Chromium／WebKit分别设`AWARD_TEST_BASE=/`与`/lesson/`。实际旧账号完成领证后同库升级，再由第二设备读回原姓名日期；并验证1／5星GIF、权限、缺图实际404、离线恢复、账号隔离、关课重开和导出取消。当前横幅流程由`tests/login/course-banners.spec.js`验证，不沿用旧15星与领取输入框断言。

旧证PNG比对、桌面／手机姓名计算样式、42px打印姓名与真实PDF分别检查，防止“画布图正确但页面ID改名后样式漏接”。练习纸A5、B10及45条32px线，按实际打印页核对完整题组。管理端旧15星样本为33–34与35–36，本课五星上限另验。教师、儿童、真机微信及实体打印仍须单列。

## Lesson29–30原文顺序与教学支持复核（2026-10-18）

[现行v3.1记录](../docs/butcher-version/2026-10-18-0548-v3.1-Lesson29-30原文顺序与教学支持重构.md)承接下列范围。新增`tests/e2e/unit29-30-v153-content.spec.js`、`unit29-30-v153-upgrade.spec.js`：R2／E4未答原文、G9／G11模型与实际支持、G10撤支持、原50题草稿／错答／分页／完成轮次。仅两题未答，三个未改区保留runId和状态，不给旧答案追记示范。

`tests/login/unit29-30-v153-upgrade.spec.js`默认真实原50题五星版→当前；`UNIT2930_CHAIN_LEGACY=1`验证实际33题15星→50题五星→当前，同库和跨设备分别比较原50条及旧33条，不套用邻课的额外旧行计数。前版11个文件冻结在`tests/fixtures/unit29-30-before-v153/`。新学生不建立空旧档案。`UNIT2930_BROWSER=webkit`同时应用到另开的学生窗口；根路径和`/lesson/`分别测试。

## Lesson29–30原五星版检查范围（2026-10-17）

[设计与验收](../docs/butcher-version/2026-10-17-0710-v3.0-Lesson29-30五星重构与验收.md)。现行50题运行 `npx playwright test tests/e2e/unit29-30-fivezones.spec.js tests/e2e/unit29-30-fivezones-interactions.spec.js tests/e2e/unit29-30-fivezones-upgrade.spec.js tests/e2e/unit29-30-reading-controls.spec.js tests/e2e/unit29-30-print.spec.js`。独立预期在 `tests/support/unit2930-fivezones.js`。`UNIT2930_BROWSER=webkit`切换引擎，PDF仅Chromium。

实际旧33题冻结于 `tests/fixtures/unit29-30-before-fivezones/`；核对空白、仅选、中途错答、15星领证四类迁移，原词卡页、9句阅读与9组动作分页保留。旧综合采用v2，不能把未显式登记的会话都当v1。本轮E4补材料后先验证E4未答，作答后逐项核对其余旧题再接E13／20，不能跳过新题维持旧预期。原Jones／Amy、证书标题、配色、姓名、日期、PNG及打印分别对照。

账号运行 `npx playwright test -c playwright.login.config.js tests/login/unit29-30-fivezones.spec.js tests/login/unit29-30-fivezones-upgrade.spec.js`，分别设 `AWARD_TEST_BASE=/` 与 `/lesson/`。两个浏览器都验证全课、同步、换设备、卡册与真实1／5星GIF、授权、实际404及恢复、隔离、关课重开、导出失败和取消。手机模拟不等于真机微信。

更早classroom→实际33题→五星由 `tests/login/units17-30-upgrade.spec.js --grep '29-30'` 覆盖；tasks版的同库三设备链由 `tests/login/unit29-30-tasks-upgrade.spec.js` 承接并追加五星步骤。当时管理端曾采用33–34、31–32的15星样本，属历史记录，不表示当前这两课仍为15星；现行按实际冻结定义与72课目录核对，不回退课程以满足旧预期。

词块原位空位不等于候选被删除，测试同时看完整节点顺序、已选区和实际撤回。练习纸14条32px书写线、A三题、B十一句与两个原例完整保留；真实PDF逐页核对孤行和空页，不能只用DOM计数验收。实际结果和复用范围以单元证据为准。

## Lesson27–28原文依据与分步教学复核（2026-10-18）

[现行v3.1记录](../docs/butcher-version/2026-10-18-0515-v3.1-Lesson27-28原文依据与分步教学重构.md)承接下列原五星版检查。新增`tests/e2e/unit27-28-v153-content.spec.js`和`unit27-28-v153-upgrade.spec.js`：未答材料、G2／G11短示范及真实帮助记录、G10／G12撤支持，原43题空白／草稿／错答／整轮迁移；仅R2／E3未答，三个未改区保留原runId和状态。历史资料在`tests/fixtures/unit27-28-before-v153/`，服务器使用实际冻结原定义，不编造已完成JSON。

账号新增`tests/login/unit27-28-v153-upgrade.spec.js`，默认真实43题五星版→当前；`UNIT2728_CHAIN_LEGACY=1`检查真实27题15星→43题五星→当前，同库、跨设备、两代档案、原日期及全部GIF帧。原本机可有44条，原五星43条和旧27条按来源比较，不以JSON对象成员顺序判断记录改变。`UNIT2728_BROWSER=webkit`的另开学生设备也应用iPhone配置。已有materials检查先完成新增E3再核验先前修订E5，不能继续假设更新后首个未答题仍为E5。

## Lesson27–28原五星版检查范围（2026-10-17）

[设计与验收](../docs/butcher-version/2026-10-17-0625-v3.0-Lesson27-28五星重构与验收.md)。现行43题运行 `npx playwright test tests/e2e/unit27-28-fivezones.spec.js tests/e2e/unit27-28-fivezones-interactions.spec.js tests/e2e/unit27-28-fivezones-upgrade.spec.js tests/e2e/unit27-28-materials.spec.js tests/e2e/unit27-28-reading-controls.spec.js tests/e2e/unit27-28-print.spec.js`。`UNIT2728_BROWSER=webkit`切换引擎，PDF仅Chromium。独立答案在 `tests/support/unit2728-fivezones.js`；原27题五文件冻结于 `tests/fixtures/unit27-28-before-fivezones/`。

账号执行 `npx playwright test -c playwright.login.config.js tests/login/unit27-28-fivezones.spec.js tests/login/unit27-28-fivezones-upgrade.spec.js`，分别设置 `AWARD_TEST_BASE=/` 和 `/lesson/`。旧账号实际领证后同库升级，另一设备核对原姓名、日期及15星历史；新版首星独立入册，1／5星GIF实际解码，权限、缺图404、恢复、隔离、关课、取消和失败重试分别验。浏览器手机模拟不等于真机微信。

更早classroom版本由 `tests/login/units17-30-upgrade.spec.js --grep '27-28'` 验证先过真实前版再升五星；任务改造版由 `tests/login/unit27-28-tasks-upgrade.spec.js` 保留三设备原契约并追加五星步骤。旧题、旧错答、草稿、词卡、13句阅读及10图／10问答两个参考分页分别保留。旧证原SVG、shop-icon尺寸、颜色、1440×1100 PNG和打印均对照实际前版。

当时共用管理测试曾使用29–30、31–32的15星样本；这是历史记录，不代表当前这两课仍为15星。现行按实际冻结定义及当前72课目录检查，不为旧预期退回课程。综合E5的首次修订与本轮E3分别留档；选图按真实可见尺寸检查，不能仅验文件存在。初始失败、隔离、修复与复用范围详见单元证据。

## Lesson21–22五星重构与教学支持复核（2026-10-18）

[现行v3.1记录](../docs/butcher-version/2026-10-18-0313-v3.1-Lesson21-22教学支持与有效轮次复核.md)承接下列v3.0范围。45题、五区会话与奖励版不变；本轮新增`tests/e2e/unit21-22-teaching-review.spec.js`，核对G9／G10短示范、新提交的实际帮助记录、当前版未提交草稿、错答、阅读与两种分页，以及完整旧轮次不被重开或追记示范。实际前版三个展示文件和独立答案分别冻结在`tests/fixtures/unit21-22-before-teaching-review/`与`tests/support/unit2122-before-teaching-review.js`，不以重写旧定义构造迁移。

账号新增`tests/login/unit21-22-teaching-review.spec.js`，默认45题前版→本轮显示；`UNIT2122_CHAIN_LEGACY=1`另跑真实30题15星→45题五星→本轮的同库链。当前会话与旧会话含相同题时，必须核对五个runId、states、45条records及另一设备三卡，不能只验总星数。原15星与当前五星日期分别保留；当前卡全部60帧、原账本与姓名也需保持。根目录／子目录和两引擎按影响范围运行，实际结果见本轮记录；声音故障注入须计数真实play拒绝。

[设计与验收](../docs/butcher-version/2026-10-17-0357-v3.0-Lesson21-22五星重构与验收.md)。现行45题：`npx playwright test tests/e2e/unit21-22-fivezones.spec.js tests/e2e/unit21-22-fivezones-upgrade.spec.js tests/e2e/unit21-22-fivezones-interactions.spec.js tests/e2e/unit21-22-reading-controls.spec.js tests/e2e/unit21-22-teaching-review.spec.js tests/e2e/unit21-22-print.spec.js`；独立答案`tests/support/unit2122-fivezones.js`。`UNIT2122_BROWSER=webkit`切换引擎；PDF只用Chromium。旧空白／仅选／错答中途／30题完成领证分别升级，姓名、日期、两个参考分页、实际PNG／PDF保留。

账号使用`tests/login/unit21-22-fivezones.spec.js`、`unit21-22-fivezones-upgrade.spec.js`与`unit21-22-teaching-review.spec.js`；`AWARD_TEST_BASE=/`和`/lesson/`分别核对。更早26→30→45链在`tests/login/units17-30-upgrade.spec.js --grep '21-22'`；34→30→45链在`tests/login/unit21-22-tasks-upgrade.spec.js`。Windows目录用junction，文件复制，清理只限已校验临时根；不得为测试改真实预览账号。

旧五份unit21–22页面检查及多课21–22条目冻结30题原始URL、Worker课包和直接磁盘读取。当前handoff显示人物通过适配层换图，独立断言实际新图片及一件物品交接，旧题签名不变。`tests/unit/award-handoff.test.js`覆盖物品／接收者、完整本轮、缺项／错配／旧版本／未知类型；操作能完成不等于奖励校验已支持。当前共用规则变更直接重验实际五星账号链，21–22最大星数另验5。27–28曾作为15星排序样本是v3.0当时状态；现行72课均已五星，旧完成制管理检查使用真实冻结定义，不恢复旧奖励规则。

## Lesson19–20五星重构与双空任务复核（2026-10-18）

[现行v3.1记录](../docs/butcher-version/2026-10-18-0225-v3.1-Lesson19-20双空任务与历史成果重构.md)承接[原v3.0](../docs/butcher-version/2026-10-17-0258-v3.0-Lesson19-20五星重构与验收.md)。现行66题运行`npx playwright test tests/e2e/unit19-20-fivezones.spec.js tests/e2e/unit19-20-fivezones-upgrade.spec.js tests/e2e/unit19-20-reading-controls.spec.js tests/e2e/unit19-20-v153.spec.js tests/e2e/unit19-20-v153-upgrade.spec.js tests/e2e/unit19-20-print.spec.js`；独立预期位于`tests/support/unit1920-fivezones.js`。`UNIT1920_BROWSER=webkit`切换引擎；PDF只用Chromium。真实旧36题产生空白、仅选、中途错答、原15星证书再升级，核对原姓名／日期、实际PNG与打印。对比图旧分页每页两幅，必须保留页内对象；不要仅凭相同整数判断位置已保留。

65题前版另冻结11个运行文件及独立旧作答单；新专项检查综合每题最多两空、语法短示范、四个未改轮次、草稿及仅四道修订／新增综合题未答。服务器需要区分相同题目的不同完成轮次，不能凭题目签名首先命中的旧组替代更近的有效会话。

账号命令`npx playwright test -c playwright.login.config.js tests/login/unit19-20-fivezones.spec.js tests/login/unit19-20-fivezones-upgrade.spec.js tests/login/unit19-20-v153-upgrade.spec.js`；`AWARD_TEST_BASE=/`与`/lesson/`分别核对。新专项加`UNIT1920_CHAIN_LEGACY=1`时执行真实36题15星→65题五星→66题的同库链，原证书和当前卡的日期分别检查；默认覆盖65→66。新设备可能直接使用已同步Progress，无须伪造本机Snapshot。当前全新账号必须没有虚构历史；原卡GIF核对全部60帧。其余C浮层、A册、1／5星GIF、权限、离线、真实缺图、重试和取消保持原断言，手机模拟不等于真机微信。

原19–20三个历史文件与多课历史检查冻结真实36题HTTP资源和Worker课包；`tests/login/units17-30-upgrade.spec.js --grep '19-20'`验证28→36→五星链。19–20改为五星后，学习管理旧15星排序样本改为仍用该契约的21–22，现行19–20五星另验。测试步骤先定位目标题型，错误次数、前进次数分别核对，不用全局改循环上限；保留失败和同版本隔离记录。

## Lesson17–18五星重构与教学支持复核（2026-10-18）

[本轮v3.1复核](../docs/butcher-version/2026-10-18-0151-v3.1-Lesson17-18教学支持复核与验收.md)只改展示支持、示范使用记录和结算文案，62题定义／会话／奖励完全不变。新增`tests/e2e/unit17-18-teaching-review.spec.js`验证示范与当前题错开、G5就近词义、真实前版草稿及完成轮次保持、既有记录不追记示范。三个前版展示文件在`tests/fixtures/unit17-18-before-teaching-review/`，不重新制造15星迁移。

`tests/login/unit17-18-teaching-review.spec.js`验证真实62题五星账号同库更新，另一设备回读62条记录与全部有效轮次，原姓名日期、账本及GIF全部帧相等。两个引擎分别用根路径和`/lesson/`；账号读取采用访问客户端的规范学习键，匿名页键不能代替它。只读证据不从程序答案生成。原15星升级检查和当前新版完整账号流程按影响重验，其他复用范围见本轮记录。

[设计与验收](../docs/butcher-version/2026-10-17-0136-v3.0-Lesson17-18五星重构与验收.md)。现行62题运行`npx playwright test tests/e2e/unit17-18-fivezones.spec.js tests/e2e/unit17-18-fivezones-upgrade.spec.js tests/e2e/unit17-18-reading-controls.spec.js tests/e2e/unit17-18-print.spec.js`；独立预期在`tests/support/unit1718-fivezones.js`。空白、仅选、中途错答和旧15星领证分别从真实29题旧页升级，两个参考分页、词卡、阅读、原姓名日期及实际PNG／打印保留。`UNIT1718_BROWSER=webkit`选择另一引擎；PDF输出使用Chromium。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit17-18-fivezones.spec.js tests/login/unit17-18-fivezones-upgrade.spec.js`；`AWARD_TEST_BASE=/`检查根路径，默认`/lesson/`检查子路径。覆盖新五星、旧账号同库升级、另一设备、权限、缺图真实404、卡册／GIF、长姓名及导出取消／失败。设备模拟不代表真机微信。

原`unit17-18`三个文件及`units17-30`中的17–18条目通过独立HTTP服务冻结29题的原始URL与Worker课包，保留15星时代的原断言；现行62题单独验证。`tests/login/units17-30-upgrade.spec.js --grep '17-18'`继续从更早22题经29题再升五星，原两题、姓名日期及15星中间状态均核对。学习管理的15星排序样本改为仍符合旧契约的19–20，当前17–18最大星数另验5。复制脚本时同时核对裸课程编号、旧分页按钮及证书导出固定配色，不能扩大授权或改产品来满足旧测试预期。

## Lesson15–16五星重构（2026-10-16）

[设计与验收](../docs/butcher-version/2026-10-16-2158-v3.0-Lesson15-16五星重构与验收.md)。现行55题运行`npx playwright test tests/e2e/unit15-16-fivezones.spec.js tests/e2e/unit15-16-fivezones-upgrade.spec.js tests/e2e/unit15-16-print.spec.js tests/e2e/unit15-16-reading-controls.spec.js tests/e2e/unit15-16-reference.spec.js`，独立作答单`tests/support/unit1516-fivezones.js`。真实前版31题冻结在`tests/fixtures/unit15-16-before-fivezones/`，旧空白、仅选、中途错答、15星领证分别升级；两个参考分页、词卡、阅读、姓名、原日期、实际PNG及打印保留。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit15-16-fivezones.spec.js tests/login/unit15-16-fivezones-upgrade.spec.js`；`UNIT1516_BROWSER=webkit`切换引擎，`AWARD_TEST_BASE=/`检查根路径，默认`/lesson/`检查子路径。旧账号的显式会话也应用iPhone 13配置；真实完成、同步、跨设备、授权、缺图实际404、卡册／GIF、失败与取消导出分别核对，不代表真机微信验收。

历史六个unit15–16文件通过独立HTTP服务同时冻结URL、Worker课包与定向变题的磁盘来源。更早25题先过原31题检查再升五星，不删除旧断言。共享学习排序的第二个15星样本改用17–18，当前15–16五星规则仍单独检查。材料可能在题干，也可能在独立材料区，断言须核对实际可见信息，不强制两处重复。人物需核对最终显示尺寸、持物接触及源图留白；盒子未溢出不能替代目视。

## Lesson13–14五星重构（2026-10-16）

[设计与验收](../docs/butcher-version/2026-10-16-2018-v3.0-Lesson13-14五星重构与验收.md)。现行53题运行`npx playwright test tests/e2e/unit13-14-fivezones.spec.js tests/e2e/unit13-14-fivezones-upgrade.spec.js tests/e2e/unit13-14-print.spec.js`，独立题稿`tests/support/unit1314-fivezones.js`。真实前版32题冻结于`tests/fixtures/unit13-14-before-fivezones/`，分别验证空白、仅选、错答中途、15星领证升级，保留两个参考分页、阅读、词卡及旧证书；PNG实际对比原尺寸与背景色。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit13-14-fivezones.spec.js tests/login/unit13-14-fivezones-upgrade.spec.js`；`UNIT1314_BROWSER=webkit`选择WebKit，`AWARD_TEST_BASE=/`验证根路径。显式创建的旧账号两个会话也应用iPhone 13参数，测试不代表实体手机。覆盖真实五区、卡册／GIF、跨设备、缺图404和恢复、授权、关课、失败与取消导出。

旧13–14脚本在独立历史HTTP站点冻结自身及所需相邻旧课的原始URL和Worker课包。定向修改内容的测试须读取同一个冻结文件，不能直接读现行53题覆盖旧页。更早26题账号先通过原32题版本再升五星，原姓名和日期保留。共享学习记录测试以23–24的两题独立活动继续验证15星契约，并另验当前13–14五星；原隐私、顺序、去重及首次日期断言不变。

## Lesson11–12五星重构（2026-10-16）

[设计与验收](../docs/butcher-version/2026-10-16-1905-v3.0-Lesson11-12五星重构与验收.md)。现行52题运行`npx playwright test tests/e2e/unit11-12-fivezones.spec.js tests/e2e/unit11-12-fivezones-upgrade.spec.js tests/e2e/unit11-12-print.spec.js`。独立答案`tests/support/unit1112-fivezones.js`，真实前版27题冻结于`tests/fixtures/unit11-12-before-fivezones/`。空白、仅选、错答中途、已领证分别升级；保留词卡、阅读、档案页、原姓名日期及PNG／打印。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit11-12-fivezones.spec.js tests/login/unit11-12-fivezones-upgrade.spec.js`；`UNIT1112_BROWSER=webkit`切换引擎，`AWARD_TEST_BASE=/`验证根路径。使用临时真实账号完成五区、旧站同库升级、跨设备、卡册／GIF、授权、缺图404与恢复、关课、取消和失败重试。不注入学习或授星记录。

原11–12课程脚本及`units9-12-classroom.spec.js`通过独立历史HTTP站点同时冻结9–10、11–12的原始URL和Worker包，保留15星时代断言；现行题稿由上述专项覆盖。更早账号升级检查根据本次保护历史的明确要求重新启用，先通过原27题版本再升五星，保留UTF-8分段上传等原断言。下方v2.1文档是历史记录，不代替本轮52题验收。

## Lesson9–10五星重构（2026-10-16）

[设计与验收](../docs/butcher-version/2026-10-16-1706-v3.0-Lesson9-10五星重构与验收.md)。现行54题使用`npx playwright test tests/e2e/unit9-10-fivezones.spec.js tests/e2e/unit9-10-fivezones-upgrade.spec.js tests/e2e/unit9-10-print.spec.js`。独立题稿为`tests/support/unit910-fivezones.js`；真实前版33题冻结到`tests/fixtures/unit9-10-before-fivezones/`。空白／仅选择／中途错答／已领旧证逐项升级，检查词卡、阅读、观察主题、证书PNG／打印及原日期；不注入学习记录或授星。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit9-10-fivezones.spec.js tests/login/unit9-10-fivezones-upgrade.spec.js`，覆盖同库升级、另一设备、新五星与卡册／GIF、权限、恢复和导出失败／取消。`UNIT910_BROWSER=webkit`切换引擎，`AWARD_TEST_BASE=/`切换根路径；PowerShell用`$env:变量名='值'`。WebKit需在旧流程中段刷新后等待真实准备，再执行原正确状态断言。下方v2.1记录为历史，不能代替54题验收。

旧版课程脚本及`units9-12-classroom.spec.js`通过独立HTTP历史站点冻结9–10原始URL和Worker课包，保留15星时代的断言；同站11–12仍使用自身当前版本。新版三卡继续要求统计与两个按钮在短屏同屏，人物成果允许滚动。实际首轮、复验、版本范围及人工待验见v3.0。

## Lesson7–8五星重构（2026-10-16）

[设计与验收](../docs/butcher-version/2026-10-16-1551-v3.0-Lesson7-8五星重构与验收.md)。现行检查为`tests/e2e/unit7-8-fivezones*.spec.js`与`unit7-8-print.spec.js`，独立答案`tests/support/unit78-fivezones.js`。冻结迁移前31题页面，真实操作空白／仅选择／中途／15星领证再升级，检查草稿、旧证书PNG／打印、原日期和新增题；不注入学习或授星。

账号检查`tests/login/unit7-8-fivezones*.spec.js`覆盖同一数据库升级、另一设备、真实五星、卡册／GIF、权限和恢复。`UNIT78_BROWSER=webkit`切换引擎，`AWARD_TEST_BASE=/`验证根路径；旧站首次准备和作答等待分别记录。原15星脚本通过独立历史HTTP服务读取冻结原始文件与课包，保留原断言；普通旧页路由不代替Worker课包冻结。不能把历史版本通过冒充现行50题验收。实际通过和待验见单元记录。

## Lesson 77–78 专项

[设计与验收](../docs/butcher-version/2026-10-14-0130-v1.0-Lesson77-78设计与验收.md)。独立题稿答案`tests/support/unit7778.js`；66题、24词卡、12轮完整原文与五区五星。`tests/e2e/unit77-78*.spec.js`检查材料可见、事实回应、错答与部分填空、四宽短屏、相向人物及完整参考；`tests/login/unit77-78.spec.js`检查权限、卡册／实际GIF、动画、字体、跨设备与缓存。`UNIT77_BROWSER=webkit`切换引擎；账号`AWARD_TEST_BASE=/`验根路径，默认测试`/lesson/`。实际结果与边界只记在单元文档，用例存在不代表已通过。

## Lesson 75–76 专项

[设计与验收](../docs/butcher-version/2026-10-14-0047-v1.0-Lesson75-76设计与验收.md)。独立答案`tests/support/unit7576.js`；60题、30词卡、15轮原文、固定参照的时间任务、五区五星。`tests/e2e/unit75-76*.spec.js`检查真实页面与四宽，含题目资料真实可见；`tests/login/unit75-76.spec.js`检查权限、卡册／GIF、字体、动画、隔离、缓存和跨设备。`UNIT75_BROWSER=webkit`切换引擎；账号`AWARD_TEST_BASE=/`验根路径，默认测试`/lesson/`。实际通过项在单元记录，不以用例存在代替通过。

# Lesson 73–74（2026-10-14）

[设计与验收](../docs/butcher-version/2026-10-13-2345-v1.0-Lesson73-74设计与验收.md)。独立题稿 `tests/support/unit7374.js`；72题、42词卡、五区五星、14段完整原文、旁白／思想／原话分层、手册三姿态、固定三卡与四宽短屏。`unit73-74.spec.js` 和 `unit73-74-story-layout.spec.js` 检查真实页面；`tests/login/unit73-74.spec.js` 验证权限、真实获星、卡册／GIF、隔离、跨设备、缺图重试与复访。账号根路径用 `AWARD_TEST_BASE=/`，`UNIT73_BROWSER=webkit` 验WebKit；实际通过范围写在单元文档，不能以用例存在代替通过。

# Lesson 61–62（2026-10-13）

纪念卡白大褂修补：`unit61-62-keepsake-art.spec.js`读取页面实际显示图片的左上臂轮廓，旧图为0、新图须有连续棕色描边，并检查320／1280卡面不裁图；透明外边距不能替代内部人物完整性。卡册与GIF仍走真实账号页面用例。

[设计与验收](../docs/butcher-version/2026-10-13-1558-v1.0-Lesson61-62设计与验收.md)。页面检查63题、26张音标词卡、五区五星、疾病冠词变体、错答与草稿、场景检查后变化、四宽／短屏。`unit61-62-story-layout.spec.js`逐句检查15轮原文、四个人物切换和相向、完整床与手脚、中文内部滚动。独立答案：`tests/support/unit6162.js`。账号用例：`tests/login/unit61-62.spec.js`；`AWARD_TEST_BASE=/`验根路径，`UNIT61_BROWSER=webkit`验WebKit。含真实奖励、卡册、GIF、跨设备／账号、权限、缺图与复访。实际结果以单元记录为准。

# Lesson 59–60（2026-10-13）

[设计与验收](../docs/butcher-version/2026-10-13-1413-v1.0-Lesson59-60设计与验收.md)。`unit59-60.spec.js`核对60题、34张音标词卡、五区五星、错答订正、部分填空、撤回／刷新、完整参考和四宽短屏；`unit59-60-story-layout.spec.js`逐句检查16轮对白、道具归属、人物实际大小、姓名与提示不重叠、中文内部滚动。独立答案在`tests/support/unit5960.js`。账号用例为`tests/login/unit59-60.spec.js`，`AWARD_TEST_BASE=/`验根目录，`UNIT59_BROWSER=webkit`验WebKit手机模拟；覆盖权限、五次获星、卡册／真实GIF、跨设备、隔离、缺图恢复及复访。实际通过范围记录在单元文档，手机微信另验。

# Lesson 57–58（2026-10-13）

[设计与验收](../docs/butcher-version/2026-10-13-1334-v1.0-Lesson57-58设计与验收.md)。`unit57-58.spec.js`检查58题、18张音标词卡、五区五星、订正计次、撤回／刷新／重练、完整参考材料及四宽短屏；`unit57-58-story-layout.spec.js`逐段核对5段原文、时钟与场景、中文内部滚动及完整人物。独立答案在`tests/support/unit5758.js`。账号运行`npx playwright test -c playwright.login.config.js tests/login/unit57-58.spec.js`；`AWARD_TEST_BASE=/`验根路径，`UNIT57_BROWSER=webkit`验WebKit手机模拟，覆盖授权、卡册、真实GIF、获星动画、跨设备、缺图与复访。实际结果写在单元记录，不以用例存在代替通过。

# Lesson 55–56（2026-10-13）

[设计与验收](../docs/butcher-version/2026-10-13-1255-v1.0-Lesson55-56设计与验收.md)。`unit55-56.spec.js`检查62题、24张音标词卡、五区五星、订正计次、刷新重练、完整参考材料及四宽短屏；`unit55-56-story-layout.spec.js`检查8段旁白、中文内部滚动、全身人物及日程切换。独立答案在`tests/support/unit5556.js`。账号运行`npx playwright test -c playwright.login.config.js tests/login/unit55-56.spec.js`，`AWARD_TEST_BASE=/`切换根目录，`UNIT55_BROWSER=webkit`启用WebKit手机模拟；覆盖授权、卡册、真实GIF、五次奖励动画、跨设备、资源缺失与复访。手机微信和教学效果由人工另验。

# 新单元验收（2026-10-13）

Lesson53–54：[设计与验收](../docs/butcher-version/2026-10-13-1208-v1.0-Lesson53-54设计与验收.md)。`unit53-54.spec.js`核对69题、42词卡、五区五星、错误订正与续做；`unit53-54-story-layout.spec.js`核对8轮原文、四宽、长句中文和人物。`tests/login/unit53-54.spec.js`检查真实授权、缓存、五星／动图／纪念册、换设备和隔离。`AWARD_TEST_BASE=/`验根路径，`UNIT53_BROWSER=webkit`验WebKit。独立题稿答案见`tests/support/unit5354.js`。

Lesson51–52：[设计与验收](../docs/butcher-version/2026-10-13-1127-v1.0-Lesson51-52设计与验收.md)。`tests/e2e/unit51-52.spec.js`核对56题、42词卡、五区五星、错误订正、续做、四宽短屏；`unit51-52-story-layout.spec.js`逐句核对12轮原文与中文、场景内滚动、相向人物及相册变化。`tests/login/unit51-52.spec.js`检查授权、缺图重试、五星／动图／纪念册、跨设备与隔离账号；根路径用`AWARD_TEST_BASE=/`，WebKit用`UNIT51_BROWSER=webkit`。独立答案见`tests/support/unit5152.js`。真实微信、教师和儿童验收另列。

Lesson 49–50：[设计与验收](../docs/butcher-version/2026-10-13-0130-v2.0-Lesson49-50设计与验收.md)。`tests/e2e/unit49-50-current.spec.js`检查60题、30张IPA词卡、五区五星、订正与续做、四宽短屏及无配音；`unit49-50-story-layout.spec.js`逐句检查11段对白、中文、相向完整人物和肉块交接；`unit49-50-upgrade.spec.js`通过冻结旧页面实际操作空白／仅选择／中途／15星完成后升级。独立答案见`tests/support/unit4950.js`。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit49-50.spec.js tests/login/unit49-50-upgrade.spec.js`；根路径另加`AWARD_TEST_BASE=/`，WebKit加`UNIT49_BROWSER=webkit`。覆盖五颗新星、三卡统计与奖励先后、卡册／真实GIF、跨设备、缺图与复访；旧账号专项启动真实旧站与数据库完成15星，再升级同一数据，检查旧姓名／日期与15星历史独立保留、新题空白、新星可同步。历史音频及15星回归通过`tests/support/unit4950-legacy.js`显式加载冻结版本，不把旧版通过当作新版验收。自动化浏览器与手机尺寸模拟不代替微信真机验收。

Lesson 47–48：[设计与验收](../docs/butcher-version/2026-10-13-0048-v1.0-Lesson47-48设计与验收.md)。`tests/e2e/unit47-48.spec.js`检查53题、26张IPA词卡、五区五星、错答重试／续做、四宽短屏与无配音；`tests/e2e/unit47-48-story-layout.spec.js`逐句检查12段对白、中文和完整相向的人物；`tests/login/unit47-48.spec.js`验证班级授权、卡册／GIF、跨设备、姓名隔离和缺图恢复。账号根路径及`/lesson/`测试路径分别验证，追加`--browser=webkit`运行WebKit；`UNIT47_BROWSER=webkit`另启用iPhone尺寸模拟。独立答案见`tests/support/unit4748.js`，真实手机验收另列。

Lesson 45–46：[设计与验收](../docs/butcher-version/2026-10-12-1627-v1.0-Lesson45-46设计与验收.md)。`tests/e2e/unit45-46.spec.js` 检查49题、14段故事、24张音标词卡、五区五星、本轮计次、错答不泄题、撤回续做、信件归属和四宽短屏；`tests/login/unit45-46.spec.js` 覆盖授权、跨设备、纪念册、GIF、隔离与缺图恢复。账号分别运行根目录和测试子路径；`UNIT45_BROWSER=webkit` 运行 WebKit。独立答案见 `tests/support/unit4546.js`。具体已验范围与未验边界写在单元记录，不以测试存在代替通过。

小剧场字体／人物裁切专项：`npx playwright test tests/e2e/unit45-46-story-layout.spec.js`，追加 `--browser=webkit` 复查 WebKit。从真实第6句检查老板手部边缘，并遍历14句的全部可见姿态，检查四宽下对白在场景内且不遮人／打字机、中文展开稳定和刷新续读；Bob 在两间办公室都面向对方，姓名不镜像。现行布局见[场景内对白设计](../docs/butcher-version/2026-10-12-2058-v1.3-Lesson45-46场景内对白布局.md)，字体与断手定位见[历史修复记录](../docs/butcher-version/2026-10-12-1940-v1.2-Lesson45-46小剧场修复.md)。

# Lesson 41–42（2026-10-12）

Lesson 43–44：[设计与验收](../docs/butcher-version/2026-10-12-1542-v1.0-Lesson43-44设计与验收.md)。`tests/e2e/unit43-44.spec.js` 检查44题、15段故事、五区五星、3／5／2统计、重试续做、物品守恒和四宽短屏；`tests/login/unit43-44.spec.js` 验证真实账号、班级权限、纪念册、跨设备、GIF与缓存失败恢复，根路径和 `/lesson/` 测试子路径分别运行。答案来自独立题稿，不读程序答案字段。


[现行教学与纪念卡设计](../docs/butcher-version/2026-10-12-1342-v1.3-Lesson41-42教学与纪念卡优化.md)。`tests/e2e/unit41-42.spec.js` 从真实页面检查43题、16句课文、五区五星、本轮三卡、错答重试、撤回与提示、刷新、场景交接、参考材料和四种宽度；新增物品守恒、指令先于场景、旧空白／中途／已获星升级与对白切换尺寸恢复。`tests/login/unit41-42.spec.js` 用隔离班级学生检查授权、五区奖励动画顺序、跨设备、纪念册、60帧 GIF、离线恢复、缺图重试和复访，并与 Lesson 1–2／3–4 同姓名同星数对照。账号用例分别运行根目录（`AWARD_TEST_BASE=/`）和默认测试子路径。答案为独立审定文字，不读程序答案字段，不注入获星状态。

# Lesson 3–4 语法小工坊（2026-10-11）

现行仍为五区33题：5／3／10／4／11。本节为v3.0原语法实现，最新材料与历史保护见顶部v3.1专项。原依据、题号和当时证据见[语法小工坊 v3.0](../docs/butcher-version/2026-10-11-1321-v3.0-Lesson3-4语法小工坊与验收.md)。`unit3-4-grammar.spec.js` 验证短示范与撤除、错答不泄题、提示／刷新、词块与配对、固定三卡、四种宽度、旧空草稿获星和旧题不代答新题。`tests/login/unit3-4-grammar.spec.js` 用隔离学生验证五区同步、另一设备、纪念册、课内断网续练与重新进入时的联网核验。原衣帽间分镜与交接、完整课文、无配音、词卡和迁移检查继续适用。

# 现行验收入口

按[统一设计标准 v1.54](../docs/butcher-version/publish/2026-10-18-0843-v1.54-教学单元设计标准与验收清单.md)选择本次范围；第 4、6、8 节覆盖统一字体、交谈朝向、人物画风、场景内对白、逐姿态防裁切、真实账号、持续动效、GIF 和恢复复访。规则生效不代表已有脚本全部符合新口径；只改文档执行文档与引用检查，不冒记重新通过页面测试。

现行标准承接的材料、图形语义和题型核对先检查未作答画面，再运行判分流程；图形预期取自教材或独立审定材料，不复制生成器数据。新课同时验证首页／授权／课包／字体／纪念卡／册／导出，具体登记见[课程编写指南](../docs/course-authoring.md#新建教学单元)。本课不涉及的语言边界写明不适用，不新增凑数测试；环境失败与人工待验保留原状态。

# 旧课升级与历史成果验收（O16）

范围先按[统一标准第8节](../docs/butcher-version/publish/2026-10-18-0843-v1.54-教学单元设计标准与验收清单.md#8-交付前只核对这张表)确定，实施映射见[编写指南](../docs/course-authoring.md#旧课升级与历史成果保护)。旧课内容、评分、奖励或存储改动覆盖受影响历史；纯展示修改检查记录不变及受影响显示／导出，可有依据地复用未变迁移结果。全新且无历史记录的课程注明不适用，正常学习、同步、奖励及导出验收仍完整执行；共享代码改动依据调用方与格式差异确定回归范围，不以固定课程数抽样替代影响分析。

- **真实前版与真实记录。** 以实际旧页面、内容定义和必要历史资源建立基线，在隔离临时账号与测试数据库中通过页面操作产生空白、仅选择、错答中途、完成及已领取等适用状态；不注入答案、完成JSON或授星。原文档与程序不同须记录差异；涉及已支持的更早迁移链时一并核对，未覆盖版本明确列出。
- **升级与续做。** 同一测试数据库升级后，在原设备检查旧作答、错答、草稿、词卡／阅读位置、参考分页、旧入口及新增题未答。重练不重新导入旧答案；旧15星、新五星与待同步状态分别验证，保留未完成、失败和损坏记录的既有断言。旧页准备完成后再读可见状态，不把加载中的初始星数当结果。
- **证书实际可用。** 在真实旧页领取并保留前版对照，再于升级后的页面查看、实际保存原支持的格式（如PNG）、输出打印预览或PDF；核对姓名、原始领取时间、称号、人物、徽章、原有摘录、主要版式、配色、字体可读性及导出尺寸。下载文件须打开核对，打印输出逐页核对；按钮存在、字段尚在或只比较尺寸都不足以证明原件保留。实体打印另记待验或实测。
- **历史事实不变。** 查看／保存／打印旧证、刷新、重复操作、新版错答、重练与新获星后复查旧姓名、日期和成果。没有有效旧领取依据时不补造证书，原本没有的成果摘录不从模板新增。允许有记录的技术修复与细微浏览器渲染差异，不要求逐像素一致；缺字、裁切、变形或不可读仍须修复。
- **同步边界。** 真实旧账号先同步成果，再升级并用同账号另一浏览器会话模拟新设备回读；另验原设备保留的本机草稿，不要求新设备恢复从未上传的数据。等待实际同步确认，不能把本机成功当作服务器已保存；换学生、待同步及失败恢复按受影响范围保留验证。
- **历史环境一致。** 历史HTTP原始URL、Worker课包及测试直接读取的文件须指向同一冻结版本，核对必要素材没有被新版替换；不能只拦页面而让Worker取得现行代码。保持测试服务器文件访问边界，不把历史整站放入发布包；运行时仍需使用的历史证书资产按正常课包登记。显式新建浏览器会话须带上所声明的设备参数，模拟会话不等于真机。
- **证据分开记录。** 记录旧／新应用与测试版本、实际范围、浏览器／设备设置、挂载路径、原始失败、复验、复用依据及未覆盖项；不要求重复制作已有日志能表达的报告。课程局部通过、共用规范实施和正式发布分别报告，按影响选择现有专项，不新增固定测试数量或一律串行要求。

可参考[Lesson15–16升级页面检查](e2e/unit15-16-fivezones-upgrade.spec.js)、[旧账号升级检查](login/unit15-16-fivezones-upgrade.spec.js)和[既有实施记录](../docs/butcher-version/2026-10-16-2158-v3.0-Lesson15-16五星重构与验收.md)的方法；题稿、旧版本、证书尺寸和测试条件仍按目标课程核对。本次O16文档实施未重新运行这些课程检查，不能把既有结果计成本次通过。

# 可信的故障与复验记录

本节落实统一标准O13–O15，按实际影响选用现有课程、账号、加载恢复和导出检查；不要求新课复制固定数量的测试。规范已实施，不表示所有旧脚本或全局调度已完成改造。

- 故障先命中：对照构建课包、去重／别名和实际请求选择目标。确认测试服务器返回了预期404、超时、拒写等，或记录对应的直接证据，再验证加载拦截和恢复。`page.route()`未命中Worker请求不能算应用恢复正常；现有HTTP故障边界说明见下节。
- 版本先对齐：源文件已改、构建成功、服务重启均不足以证明浏览器正在使用新课包。沿正常更新链路核对实际可见内容及适用的资源／课包标识；不通过清学习记录、注入答案或强制授星制造结果。
- 失败先保留：保存失败时应用和测试版本、浏览器、挂载路径、视口／设备配置、并发与workers、失败阶段和耗时。日志能表达这些信息即可，不要求再复制一份同内容报告。
- 隔离再归因：动画逐帧采样、稳定性等待和完整账号流程出现异常时，先按同版本原断言隔离复现。若有版本修改，列明差异及复验范围。不能直接force点击、取消覆盖、降阈值、只延长等待或改慢产品动画掩盖问题；隔离通过不证明唯一底层原因，也不保证任意负载都正常。
- 测试也须核对：断言以教材、独立题稿和真实交互契约为依据；预期文字、资源地址或题型状态弄错时修测试，保留原失败及依据，不把正确产品改成错误预期。独立答案不得读取程序答案字段生成。
- 复验按影响：新课仍完成本课适用的全部检查；修复后覆盖原问题及受影响路径，共用逻辑改动检查调用方。未受影响的既有结果注明版本和范围后复用；重复执行与独立覆盖分开计数。文档变动做规则、状态、链接和历史保留核对，不冒记产品测试通过。

按资源依赖和实际负载安排并发；保持性能计时等既有独立运行要求，不新增所有课程一律串行、统一时限或重跑全部旧课的配额。环境失败、初轮失败、修复／复验结果和教师、儿童、真机、实体打印待验分别记录。

# 课程加载失败恢复（2026-10-11）

规则见[网页加载缓存设计第 11 节](../docs/butcher-version/publish/2026-09-24-2031-v1.0-网页加载缓存设计.md#11-加载失败后的恢复2026-10-11)。`tests/login/course-loading-recovery.spec.js` 的 15 项检查使用隔离的临时账号：禁用较新取消接口后正常进入与超时恢复，以及查看／放大已获纪念卡；旧包缺图后发布新地址再重试；区分 L01–L06；手机返回课程；启动中断后重新进入。旧包恢复分别覆盖正常 Worker、Worker 不可用且资源被回收、浏览器拒绝写入缓存；重试成功后还必须刷新、从课程列表再次进入并继续真实答题。已有星星、半途题目、本轮错答、姓名和首次满星日期保持不变，纪念册仍可打开。不得通过重写学习记录制造测试状态。

Chromium：`LOGIN_TEST_PORT=空闲端口 npm run test:login -- tests/login/course-loading-recovery.spec.js`。WebKit：先运行 `npx playwright install webkit`，再运行 `LOGIN_TEST_PORT=空闲端口 npm run test:recovery:webkit`；两者另加 `AWARD_TEST_BASE=/` 验证根目录。WebKit 使用 iPhone 13 的视口和触摸设置，不等同于真机或旧 iOS 内核。`browser-login` 与 `browser-recovery-webkit` 会进入相关提交检查；CI 对两个入口分别执行 WebKit 恢复测试，并纳入最终必需检查。

文件失效、错误清单和新课包由 `tests/support/course-response-faults.js` 在临时测试服务器的 HTTP 边界提供，保证正式 Worker 的请求也遇到实际故障；不能依赖 `page.route()` 拦截 Worker 请求。引导脚本故障单独禁用 Worker，防止已有引导脚本缓存掩盖故障。资源回收只删除测试浏览器的课件资源字节；拒绝写入通过浏览器 Cache API 边界模拟，不触碰学习数据。生产服务器不加载测试故障入口。

共用加载器变动还须验证 `course-loading`、`course-cache-updates`、`course-image-transitions`、加载失败的多尺寸／键盘操作，以及带账号的获星防闪页面。性能计时单独运行，避免并行浏览器影响结果。测试覆盖不等同于用户的手机真机验收或已经发布。

# 新版纪念卡持续动效与 GIF（2026-10-11）

- `tests/login/award-card-readability.spec.js`：真实账号验证标题／长姓名与插画留白、常规字体、六种新版卡面、320–1280 宽度、悬浮卡／书页／放大卡及两端真实 GIF 一致。原问题先失败，修复后通过；`AWARD_CARD_BROWSER=webkit` 可检查另一浏览器，不能替代手机真机验收。对应[字体与排版修复记录](../docs/butcher-version/2026-10-12-2140-v1.4-Lesson45-46纪念卡字体与排版修复.md)。历史题稿的 HTML 同步声明当前共用卡片的依赖，旧题目、控制器和学习记录规则不变。

以[持续星光与动图保存 v0.29](../docs/award-version/2026-10-11-0925-v0.29-纪念卡持续星光与动图保存.md)为准，Lesson 1–2、3–4、5–6 及其账号纪念册的保存方式改为 GIF。其他课程和下方历史记录的 PNG 不受影响。

- `tests/login/award-card-motion.spec.js`：真实获星后检查课程底部、书页与放大卡片的持续星光，五星金边随时间变化；关闭翻页动画不关闭卡片动效。实际下载并解码 60 帧 GIF，检查循环、尺寸、体积、星光／满星边框变化、文字静止、离线保存、取消生成、刷新后星数与首次日期不变，以及 320／390／1280 宽度。
- `tests/login/unit1-2-award.spec.js` 与 `tests/login/award-book.spec.js`：继续验证三个单元、姓名、跨设备和账号隔离、失败重试、翻页与真实 GIF 导出；不能只改扩展名或模拟下载事件。
- 悬浮奖励的落星、统计衔接、防整页闪回由 `tests/login/award-reveal.spec.js` 继续保护。默认 `/lesson/` 与 `AWARD_TEST_BASE=/` 都要验证共享路径。

# 本轮提交统计与结算动画（2026-10-12）

现行结算要求见[统一标准第 5 节](../docs/butcher-version/publish/2026-10-18-0843-v1.54-教学单元设计标准与验收清单.md#5-怎样结算固定三卡只统计本轮实际提交)：固定「连续答对／本次答对／本次答错」，单位「次」，按本轮实际提交计数。订正计答对、重复错答逐次计；每题首次证据仍用于独立获星判断。已先复现旧口径偏差再修复，实际范围与结果见[统计对齐验收 v0.30](../docs/award-version/2026-10-12-0111-v0.30-本轮提交统计对齐与记录保留验收.md)，不沿用旧首次分类断言宣称新统计通过。

- `tests/e2e/unit1-2-completion.spec.js`：五题第三题错两次后改对为 3／5／2，每题错两次再订正为 1／5／10；刷新不丢次数，重练回到本轮零计数。保留五区、四种宽度及短屏、三卡中间帧与跳数检查。相关文案、五区、语法、挑战与历史升级测试同步更正统计预期，首次结果和既有获星断言保留。
- `tests/e2e/submission-statistics.spec.js`：逐一完成其他 19 个无配音配对单元词汇区，另验 Lesson 49–50 分拣的真实错答顺序；手机三卡和图片完整、刷新一致。配对／多空整组只算一次，选改、提示和重复按已禁用按钮不计次数。教学区没有作答统计。
- `tests/login/submission-statistics.spec.js`：隔离账号经真实旧包先获得五星，再带中途两次错答升级续做，另一会话显示相同统计、旧星与首次日期；故意丢失同步回复后重发不重复计数。使用冻结旧运行器构建完整课包，不写入虚构分数。
- `tests/e2e/unit1-2-five-zones.spec.js` 与 `unit1-2-award-grammar-upgrade.spec.js`：活动合并导致不可核验的轮次显示“—”，保留学习证据，重新完整挑战后显示数字。
- `npm run test:statistics` 通过 `playwright.statistics.config.js` 运行 Chromium 与 WebKit 两组账号检查；另加 `AWARD_TEST_BASE=/` 验证根路径。显式创建的两个账号会话同样应用手机项目的视口与触摸设置。CI 在两个路径追加 WebKit 统计检查；相关改动会选择 `browser-statistics-webkit`，仍需按实际变更运行其他有关页面检查。WebKit 自动化不代表原用户实体 iPhone 验收。
- `tests/login/award-reveal.spec.js`：悬浮纪念卡在前景时统计卡须等待；关闭后才播放入场与跳数。新获星保留飞入和闪光；已经获星的环节整轮首次全对也展示已有卡面与星光，但不能新增飞星、增加星数或修改首次满星日期。使用真实隔离账号，同时覆盖 `/lesson/` 与根目录入口。
- `tests/e2e/award-reveal.spec.js`：重练全对展示、错后订正不触发本次奖励、刷新不重播；原来的「已获星重练不展示」断言已过时，永久收藏与计星断言保留。

## 共用结算短屏与检查范围（PR #19 后续修复）

新增统计后，不能继续用旧的「整个区块小于 440px」作为版式要求，也不能只检查宽度：普通共用结束页须在 320×568 短屏完整展示三项统计和两个操作，标签／数字不裁切，按钮至少 44px 高；较长的人物成果页保持原插画并允许正常纵向滚动。新增内容不应挤掉推进操作，刷新／重进须同样验证，不能仅用刚关闭获星弹窗后的滚动位置证明可用。

- `l49-v14.spec.js` 保留旧记录合并、未选不代答和星数保留，改以 320×568、768×1024、1280×900 的实际内容、位置和操作验收；两按钮相邻居中、次左主右。点击下一站、返回刷新、再练均检查，取消过时高度断言而不删行为要求。
- `submission-statistics.spec.js` 将其他 19 个配对单元词汇区的结算改在 320×568 验证，包括刷新后的统计与操作；Lesson 1–2 的人物成果、动画和其他短屏由 `unit1-2-completion.spec.js` 保留验证。
- 账号版 `submission-statistics.spec.js` 增加真实 Lesson 3–4 获星后关闭弹卡、点击下一站、返回刷新、重练的短屏检查；账号栏占用高度也计入。配合原有旧包五星、首次日期与跨设备同步场景，Chromium／WebKit 和 `/`、`/lesson/` 都要通过。
- 共用运行器、分拣、页面编排、样式或结算组件变动自动选择 `browser-completion` 与 `browser-statistics-webkit`。前者包含上述三份课程页面测试，后者验证账号与成果保留。`tests/workflow/check-workflow.test.js` 对这些文件逐一模拟变更并检查实际测试命令，避免只靠记忆选范围。

修复依据与复测入口见[短屏结算与检查范围 v0.31](../docs/award-version/2026-10-12-0923-v0.31-短屏结算与检查范围修复.md)。检查组通过不等于完整 CI 通过，PR 必须以最新提交的全部必需检查终态为准。

# Lesson 1–2 与纪念册文案精简（2026-10-11）

其他文案及验收见[文案精简实施 v0.27](../docs/award-version/2026-10-11-0205-v0.27-Lesson1-2与纪念册文案精简实施.md)。其中「首次答对 n/N」替代三项统计卡的方案，已按用户后续要求由上方 v0.28 恢复。题干精简、学习记录折叠、纪念册文案与同步状态保持。

- `tests/e2e/unit1-2-copy.spec.js`：星星进度对应真实开始、继续、重练与查看；短题干仍保留判断条件；三句摘录可展开七句原文；错答订正、记录折叠与重练；冻结改文案前的内容，真实答到第三题后升级，原位继续并正常获星。
- `tests/login/copy-polish.spec.js`：临时账号从空纪念册到获星入册；目录、动画开关、点击放大、GIF 与焦点返回；本机草稿、在线等待、请求失败和恢复同步的文案。分别用默认 `/lesson/` 与 `AWARD_TEST_BASE=/` 验证，不能把跨脚本的同步事件放进会被存储命名空间改写的前缀。
- 共用卡片和文案修改继续运行已有五区、三单元奖励、历史升级、开书、翻页、账号隔离、首次满星日期、重开练习与窄屏检查。只替换已批准修改的文字预期，保留原先的业务断言。

# 悬浮纪念卡结算（2026-10-10）

`tests/e2e/award-reveal.spec.js` 从三个单元真实答题验证新星、五星流动金边、首次日期、旧版续做与原题重练、错误原因、无按钮和任意位置退出、动画中断及窄屏。奖励浮层默认播放动效：系统减少动态开启／关闭时都检查实际落星、星光变化与金边角度变化，不只检查动画名称。`tests/login/award-reveal.spec.js` 使用临时账号，验证服务器确认、离线与补传、真实姓名、跨设备、账号隔离与身份失效。根目录可用 `AWARD_TEST_BASE=/` 运行同一套账号检查。

获星动画的防闪烁检查必须走带账号和课程加载保护的完整页面。页面测试在动画期间同时观察每帧与短暂 DOM 变化，要求课程加载页不重新遮挡纪念卡；覆盖三单元、桌面／手机、离线补传及连续五次获星，并验证飞行星星实际移动、落位后继续闪亮。不能只检查结算最终截图。飞行星星及空星／亮星切换均须使用已准备好的实际图片节点；仅预加载相同网址，不能保证新建或改换图片的节点立即可显示。

共用卡面变动继续检查原三单元奖励、Lesson 1–2 完成页、缓存断网旅程、纪念册及 GIF。历史脚本须按新页面点击关闭结算；不能删除原先的获星、学习记录和导出断言。完整代码与实际结果见[悬浮卡正式接入](../docs/award-version/2026-10-10-1646-v0.22-悬浮纪念卡正式接入与验收.md)。

# 翻页纪念册正式接入（2026-10-09）

Lesson 1–2、3–4、5–6 现行规则为每单元五个答题区、整轮首次提交全部正确才获星，题量分别为 37／25／26。Lesson 1–2 已衔接下方语法五区方案。下方历史验收中的 15 星、填写姓名和领取弹窗不适用于这三门课；阅读完成与获星须分开验证。Lesson 5–6 的指代／冠词合为“介绍小工坊”，品牌／拼句合为“汽车小问答”，保留原题与旧链接兼容。

- `tests/login/award-book.spec.js`：临时真实学生的首星入册、三张卡、跨设备、课程关闭后的收藏、切换账号、未登录拒绝、失败重试、待同步上传、长姓名、四种宽度、真实翻页和 GIF。翻页／放大／导出不新增个人接口请求；同一套可用 `AWARD_TEST_BASE=/` 验证根目录部署。
- `tests/login/award-book-opening.spec.js`：正式 A 侧翻开场逐帧检查封面不透明、真实卡片随封底落位、图片就绪及末帧衔接；手机自动展开／点击跳过、键盘和焦点、旧样板链接不显示比较条。与上项同跑以保护真实翻页、持续星光和五星流动金边，不能只检查最终截图。
- `tests/e2e/three-unit-awards.spec.js`：错答订正不补星、刷新不重置本轮失误、完整重练获星、已获星不撤回；冻结发卡前 HTML／内容／控制器，真实完成后升级，旧题记录和旧证书仍在，新版不自动获星。
- 三单元已有课程、账号、旧内容升级检查一起执行。旧录音 A04 检查改用冻结配音页面，继续检查实际播放结束、文件指纹和失败重试；现行无配音页面单独检查无英语请求。撤下的暂停按钮改为刷新后验证未提交选择，不跳过原目标。
- `tests/unit/award-collection.test.js`：服务器规则、分版本留存、学生隔离、重置保留和首次满星日期。

并行工作树可用 `LOGIN_TEST_PORT=4374 npm run check:commit`；账号检查的备份、迁址和旧版升级辅助服务会按相同偏移使用独立端口，来源校验也随之更新。该配置纳入检查结果缓存标识，不能复用另一测试地址的成功结果。课程测试仍按下方端口限制执行。

实施范围和未验边界见[纪念册正式接入与验收](../docs/award-version/2026-10-09-1322-v0.20-纪念册正式接入与验收.md)。浏览器自动检查不代替真实安卓微信保存图片、线上并发和正式发布验收。

缓存复访计时独立在 `tests/e2e/course-cache-performance.spec.js`：完成一次正常准备后，保持同一浏览器与持久缓存，20 次重新打开导航页、真实点课，恢复交替保存的第 2／3 页词卡；P95 仍小于 1500 ms，图片、字体和脚本不重新下载。以浏览器内的实际点击时刻到图片、字体与真实按钮全部就绪的画面计时，不把测试工具轮询算入加载时间，工具侧耗时另列。不录制追踪、不强制垃圾回收、不额外预热其他课程。成功或失败都保留部分样本、失败步骤和浏览器错误。

`course-cache-cold.spec.js` 中的 10 Mbps／150 ms 冷加载采用相同边界：从导航中的真实点击事件计时，直至加载层消失、字体和图片就绪、词卡可操作且进入已渲染画面；仍须小于 5 秒。不把点击前的自动滚动、按钮等待或断言轮询计为用户等待。报告同时保留 `elapsedMs`（页面实际耗时）与 `driverElapsedMs`（原工具耗时），无论通过或失败均输出到 CI 日志及附件；计时场景不启用追踪，其余故障行为检查保留追踪。

同一标签连续刷新 20 次另验位置、完整素材、可操作按钮和零重下载，保留压力场景的实际耗时，不把它替代缓存标准 C03 的“从点课到恢复位置”。CI 使用 `@cache-performance` 标签把冷加载与复访计时放到独立任务，并以两个命令分别启动浏览器；四组课程检查运行其余全部用例，汇总 `test` 同时要求性能任务成功，不能静默跳过。本地计划相应使用 `browser-cache-cold`、`browser-cache-revisit` 和不含这两项计时的 `browser-course-cache`；5 秒冷加载与 P95 1.5 秒复访门槛保持不变。PR #15 合入时合计 1385 项页面检查（1384 项课程行为＋1 项复访计时）。共享缓存代码变化仍同时验证冷加载、复访和连续刷新。`course-loading.spec.js` 还验证课程不预载其他单元场景，以及 Lesson 1–2、3–4、49–50 各自背景实际显示。

# 老师体系（2026-10-09）

`node --test tests/unit/teachers.test.js` 验证老师 `字母＋1＋七位流水` 与学生 `字母＋0＋七位流水` 的独立编号、用户给定的三位老师示例、不可变工号及上限、拼音＋三位随机数（含前导零）、首次改密、初始密码失效／到期／重启／备份、启禁用、多对多关联与版本冲突、按当前班级授权、打印／单人／混合批量／转班／学习详情／课程预览及固定资源、异步批量期间撤权／转班／禁用的整批回滚、双身份资源访问及老师限流。

老师页面验证使用本地虚构账号：创建／编辑、拼音核对、多班分配、姓名／工号搜索、启禁用和密码重置、首次改密、无班级空状态、班级多老师、学习页、预览、保存失败保留草稿、同项并发冲突和独立字段保存；检查 320／390／1280 宽度、Esc 和焦点恢复，截图不含密码。共用入口和权限变化仍运行现有 `npm run test:login`；发布、手机真机、教师试用分别验收。设计和实际结果见 [管理系统／老师体系设计与验收](../docs/管理系统/老师体系设计与验收.md)。

# 学习进度管理（2026-10-08）

`node --test tests/unit/admin-learning.test.js` 验证现行 21 门课、未开始／学习中／已完成三态、零星作答、独立星星规则、必做阅读、未提交隔离、重复／乱序同步、旧内容和重开隔离、课程关闭与转班、多状态并集筛选、星星升降序、同星按学号排序、先排序后分页、最近有效学习时间及 HTTP 权限；原跟进接口已撤下。浏览器检查四列名单、表头姓名／学号搜索、多状态筛选弹层、表头星星排序、跨页顺序、条件标签清除、键盘／Esc／点击空白关闭、学习时间、详情／返回／刷新、旧链接、错误重试及桌面／窄屏布局。时间单元检查覆盖访问／重复同步不计时、零星重试计时、课程范围、关闭与重开隔离及旧成果时间未知；实际浏览器和历史零星真实作答验证见实现记录。[实现与验收说明](../docs/butcher-version/2026-10-08-学习进度管理实现与验收.md)。共享账号、同步与样式修改仍按 `check:plan` 的相关范围验证。
# Lesson 1–2 五区整合（2026-10-09）

与 PR #15 衔接后的纪念卡、获星和旧版升级边界见[衔接 v1.6](../docs/butcher-version/2026-10-09-2305-v1.6-语法与纪念册合入衔接.md)。`unit1-2-award-grammar-upgrade.spec.js` 从已发布的旧五区页面真实完成后升级；账号和纪念册检查继续验证永久收藏、零错新星、离线补传、首次日期和不同学生隔离。旧证书元数据保留，但新版卡片姓名只来自账号，满星日期只来自新版获星记录。

现行方案见[五区整合 v1.5](../docs/butcher-version/2026-10-09-1134-v1.5-Lesson1-2五区整合与验收.md)：5／5／12／5／10 共 37 题，五颗零错星与学习完成分开。以下六区、15 星等旧记录只说明对应历史版本。

- `unit1-2-five-zones.spec.js`：五区、旧入口、迁入题、工坊配对、零错星与重练、冻结六区页面升级；不注入学习状态。
- `unit1-2-completion.spec.js`：五个新版结算页、三张 imagegen 图标、四种宽度、390×500 短屏与重练统计。
- 工坊、布局、历史语法版本、综合挑战与 `unit-thirteen-types.spec.js`：37 题完整流程及 Lesson 25–26 共用题型回归。
- 登录配置下的 `unit1-2-five-zones.spec.js`、`thirteen-types.spec.js`：临时账号实际学习、首页五颗星、错答后完成不发星、另一设备恢复、已获星与新一轮草稿独立保存。

本轮实际运行结果见 v1.5 文档；不等于线上发布或真实手机验收。

# Lesson 1–2 结算页恢复（2026-10-09）

[修复与验收 v1.4](../docs/butcher-version/2026-10-09-0121-v1.4-Lesson1-2结算页恢复与验收.md)：六个答题环节统一人物成果画面和三张固定统计卡，使用已认可的 imagegen PNG。`unit1-2-completion.spec.js` 从实际作答核对六个结束页、正确素材及加载、普通／缓存路径、四种宽度、零值与两位数、刷新和重练。现有工坊、布局和综合挑战检查继续核对统计与学习记录；不得再以旧SVG作为正确预期。

本次四个文件共12项页面检查通过，详情见上方文档。不代表其他单元、真实手机或线上发布已验收。

# Lesson 1–2 语法小工坊（2026-10-09）

当前设计见[v1.3与验收](../docs/butcher-version/2026-10-09-0018-v1.3-Lesson1-2语法小工坊设计与验收.md)：全课37题，工坊12题、综合10题。只通过页面行为验收。

- `unit1-2-grammar-workshop.spec.js`：连续练习、短示范、错答重试、人称变化、灯泡记录、三张统计卡、重练清零。
- `unit1-2-grammar-guide.spec.js`：四种宽度、动作区稳定、顶栏不遮题、原参考材料、键盘和未提交草稿。
- `unit1-2-grammar-v2.spec.js / v3.spec.js`：三个真实历史版本正常作答后升级，新增题空白、未改成绩和证书信息保留。旧独立示范已被新流程替代，不再要求三页动画控件存在。
- `unit1-2-exam.spec.js` 与 `unit-thirteen-types.spec.js`：十题综合、完整通关、子路径缓存加载、证书、Lesson 25–26 同题型回归。旧样本仅供路由测试，不公开暴露。

可用独立端口运行上述6个文件：`COURSE_TEST_PORT=4268 ./node_modules/.bin/playwright test <文件…>`。实际结果只见本次设计文档和证据，不沿用历史21项结果。

# 新版纪念卡迁移（2026-10-08）

Lesson 1–2 在本段所述历史版本为25题无配音课堂版，原找物与拼句合并后共五个答题区，按整轮零错计星。`unit1-2-award.spec.js`、`unit1-2-certificate.spec.js`、`unit1-2-award-migration.spec.js` 验证错误／重练、旧进度、五星日期、卡片及独立练习纸；`tests/login/unit1-2-award.spec.js` 用临时账号验证姓名、离线同步、不同学生、换设备、重开、真实 GIF、长姓名与导出失败重试。通过 `LOGIN_TEST_PORT` 独立选端口，`AWARD_TEST_BASE=/` 可追加网站根目录验收。

共用题目行为回归使用 `unit-thirteen-types.spec.js`、`common-interactions.spec.js`、`retry-feedback.spec.js` 和导航／综合挑战检查。Lesson 1–2 的旧15星验收不再代表当前奖励规则；其余课程仍沿用原实现。实际结果见 [奖励设计与迁移](../docs/award-version/README.md)，提交、推送、发布与真实手机验收另列。

# 共性交互修复（2026-10-06）

现行规则见 [统一标准 v1.54](../docs/butcher-version/publish/2026-10-18-0843-v1.54-教学单元设计标准与验收清单.md)。当前声音模式以现行标准第7节及各单元记录为准，以下旧测试范围不代表今天的课程模式。

- `common-interactions.spec.js` 验证 20 个无配音单元的手机／桌面课文三态按钮、精简进度、全页无玩法／暂停／键入题；从真实旧暂停和原输入版通关记录验证直接续做、改题重答与证书纪念保留。
- `unit-thirteen-types.spec.js` 文件名沿用最初试排；当前验证点击版；Lesson 1–2为37题，Lesson 25–26为27题。E07 已撤下，测试不再要求英文输入框。
- 旧玩法弹窗检查改为教学例句或学习手记；旧暂停测试继续核对刷新后的未提交选择、错误和进度，不能删除学习状态断言。冻结前版仅在测试路由内使用。
- 共用控件还需回归 `retry-feedback.spec.js`、`l49-focus.spec.js`、受影响单元布局与登录成果；运行结果见本次修复记录。以下早期记录保留为历史，不作为当前题数和声音模式的判据。

# 怎样检查修改

历史范围（2026-10-07，不作为当前豁免）：当时按上线前无正式学生的前提，五项历史课程升级用例不纳入当前验收：`units1-6-exam-upgrade.spec.js` 的 Lesson 1–2、3–4，`unit11-12-upgrade.spec.js` 的 classroom、short-exam 两项，以及 `units17-30-upgrade.spec.js` 的 Lesson 25–26。这些现存历史跳过项明确标为 skipped，不计为通过；测试内容和运行时迁移逻辑保留。现已存在学生记录，后续涉及其格式或行为的修改必须重新评估范围，不能沿用当时前提跳过保留记录与升级验证；不能仅改文档或删断言把它们记为通过。新学生创建、首次改密、正常学习、刷新与跨设备同步、密码重置及备份恢复仍照常验收。

班级访问分支另运行 `npm run test:login`（4181 端口，备份恢复 4194、公开缓存迁移 4195、学习卡升级 4196）。现行测试覆盖真实学号登录、首次强制改密、老师查找/重置、主动改密、多音字校正、同名不同号、旧码停用与成绩迁移，以及原管理、权限、缓存与成果同步。此前 21 个不同页面行为用例的两轮结果见[账号验收](../docs/butcher-version/2026-09-25-1151-v1.1-学号密码实施与验收.md)。本次新增 3 个设置弹窗用例：`npm run test:login -- tests/login/settings.spec.js` 覆盖全部十六个单元的桌面／手机居中、文字对比度、窄屏确认、关闭保留操作及切换／退出，详情见[弹窗修复记录](../docs/butcher-version/2026-09-25-1643-v1.0-学习设置弹窗修复与验收.md)。`npm run build:login` 核对当前三十个受保护单元（新增课程仍须逐班授权）；本分支的 `build:static` 拒绝发布。以下无身份旧课件测试只用于内部教学／缓存回归，不能当作生产权限验收。完整发布还需真实手机与线上检查。

账号安全回归：`npm run test:login -- tests/login/security.spec.js tests/login/student-accounts.spec.js tests/login/recovery.spec.js`。覆盖拼音加三位随机数字的初始／重置密码（含前导零、同拼音新账号不重复）、并发重放、到期／重启不续期、旧库迁移、待领取凭据的备份恢复、真实页面打印和找回流程，以及代理来源分桶、伪造头与等价地址防绕过。使用临时虚构账号，不读取或改动真实学生数据；实际 Nginx 和手机微信验收另列。

班级设置专项：`npm run test:login -- tests/login/class-settings.spec.js`，验证班级独立改名及即时刷新、课程全选／取消全选与计数、保存成功弹窗、键盘关闭和焦点返回、320／390／1280 宽度、保存期间防重复提交、失败保留输入与重试，以及部分更新不覆盖另一项设置。后台接口和课程权限同时回归 `access.spec.js`、`security.spec.js`；原有页面用例明确关闭成功弹窗后继续操作。

打印窗口另外验证：在普通 Chrome 中点“打印账号”，确认实际打印预览打开，随后取消；A4 PDF 导出不能替代这个检查。`student-accounts.spec.js` 还模拟内置浏览器的 `window.print()` 静默返回，确保页面显示改用 Chrome／Safari 的提示，按钮可重试。

账号批量操作：`node --test tests/unit/admin-accounts.test.js tests/unit/server-security.test.js`，核对新建／重置密码为拼音加三位数字（含前导零）、同拼音新账号不重复、单人／批量重置的会话撤销、未选学生与成果保留、失败整批回滚、并发改密和管理员指定密码的标准输入路径。页面另检查“所有学生”／班级／搜索的全选、半选、取消、确认、手机宽度，以及重置后的旧密码拒绝和首次改密。A4 导出实际 PDF：普通账号每页 10 张，长字段每页 6／4 张，不缺人、不重复、不跨页裁切；账号页验证本地 Maple Mono NL 字体成功加载，目视检查大小写及 `I/l/L/1`、`O/0` 字形。相关课程选项数量只统计 `#courses`，不把学生选择框计入开放课程。

security-version 另有 `node --test tests/unit/server-security.test.js tests/unit/preview-security.test.js`，验证授权记录有界、旧 token 保留、持久登录冷却、限流记录容量、私有文件权限和预览路径隔离。账号专项增加跨来源/重启冷却、老师恢复和真实浏览器 CSP；预览修改连同 `course-loading.spec.js`、`lesson-deployment.spec.js`、`landmark-review.spec.js` 检查正常路由。真实 Nginx 模板检查为 `NGINX_BIN=/实际路径/nginx OPENSSL_BIN=/实际路径/openssl node --test tests/deploy/login-nginx.test.js`，未配置二进制时明确跳过。详见[安全加固方案](../docs/security-version/2026-09-28-安全加固方案与验证.md)。

`test:deploy` 中旧 `buildStatic` 使用独立的公开课程测试目录，验证输出白名单、文件摘要和干净的 Git 版本；不能再把当前账号版仓库作为匿名公开站点来构建。另有真实命令检查，确认当前仓库拒绝 `build:static`；账号版发布清单使用 `build:login`，实际登录与资源权限由账号页面和正式服务验收。

多个工作目录同时验收时，课程检查可通过 `COURSE_TEST_PORT=空闲端口 npx playwright test ...` 选择独立端口，现行缓存、导航、跨窗口和公开边界检查均跟随该配置。账号检查另设 `LOGIN_TEST_PORT`，辅助服务随之偏移。不要结束其他会话占用端口的进程。

本段记录Lesson3–4历史25题无配音课堂版，现行33题见顶部v3.1专项；当时前置场景见[无配音优化与验收](../docs/butcher-version/2026-09-25-0148-v2.0-Lesson3-4无配音优化与验收.md)。`npx playwright test tests/e2e/unit3-4` 检查全声音失败通关、零英语请求、25 张音标词卡、完整原文、柜台正确确认后才交接、旧真实记录迁移、窄屏、缓存与 PNG／A4。`unit3-4-umbrella.spec.js` 另按[已确认分镜](../docs/butcher-version/2026-09-25-1607-v2.2-Lesson3-4雨伞叙事与验收.md)验证三把伞的出现时机、身份不变的交接、快速点击与重演、减少动态效果和缺图／断网恢复；正常动画与减少动态效果分别在实际浏览器检查。历史配音检查已收至 `tests/fixtures/unit3-4-voiced-before/`。共享题目草稿迁移仅接受明确前一版内容，不从历史成绩填答案；需连同 `unit-dedup.spec.js` 和 `l49-v110-defenses.spec.js` 回归。

Lesson 1–2 当前场景样板见[设计与验收](../docs/butcher-version/2026-09-24-0121-v2.0-Lesson1-2场景样板与验收.md)，共 29 道练习。`npx playwright test tests/e2e/unit1-2` 覆盖原有流程与新增 `unit1-2-scene.spec.js`：归还前后的场景状态、未提交不交包、错答不推进、刷新与重练、对白不遮住手机上的人物按钮、旧记录升级及 `/lesson/` 资源路径。`tests/fixtures/unit1-2-scene-before/` 保留真实旧内容与页面行为，只用于升级验证。

[对白与道具优化 v2.1](../docs/butcher-version/2026-09-24-1312-v2.1-Lesson1-2对白与道具优化.md)的布局回归连同 `unit-themes.spec.js` 执行：检查短句、长句、历史翻译、内部重听、人物与手提包的间距及已归还比例。最终落位在反馈动画结束后测量；页面截图仍需目视复看。`assets/unit1-2/handbag.svg` 也用于 Lesson 11–12 的认领小画册，修改图标须复看该处。

[人物与场景优化 v2.1](../docs/butcher-version/2026-09-25-1136-v2.1-Lesson3-4人物与场景优化.md)增加 `unit3-4-scene.spec.js`：检查人物不再过小／悬空、雨伞实际交到客人手边、错答及未提交不交接、刷新与重练、中文展开不裁掉当前句；带加载页的入口还会模拟较慢图片解码，确认刷新后当前句与保留进度一致。截图在 `output/playwright/unit3-4-scene/`；仍须实际目视复核，不能只凭尺寸断言判定美观。

统一标准 v1.54 将功能与视觉验收分开：除题目去重，还要对照相邻单元的场景与任务，复看角色、道具、短／长对白、作答前后和每个结束页。新单元依据自己的教学内容建立页面预期；样板用例通过不代表其他单元已通过。

网页加载与缓存的行为清单单独见[缓存方案 C01–C15](../docs/butcher-version/publish/2026-09-24-2031-v1.0-网页加载缓存设计.md#7-页面行为验收清单)。实现覆盖首访完整图片、重启复访、弱网失败、缓存缺失、更新与旧页并存、子目录隔离及实际证书。缓存专项运行 `npx playwright test tests/e2e/course-loading.spec.js tests/e2e/course-cache-cold.spec.js tests/e2e/course-cache-updates.spec.js tests/e2e/course-cache-performance.spec.js tests/e2e/course-cache-journeys.spec.js tests/e2e/lesson-deployment.spec.js`；最后一次真实结果见缓存文档，不把单元旧测试当作缓存证明。

先按[统一标准的模式对照](../docs/butcher-version/publish/2026-10-18-0843-v1.54-教学单元设计标准与验收清单.md#7-声音加载与访问)确定本次范围：两种模式都验证第8节共用清单；依据第7节追加配音听审与播放门槛、或无配音全流程检查；切换模式或内容升级另验记录迁移。无配音版须验证全部声音失败仍可完成、零英语配音请求与零系统朗读，反馈音另在正常环境验证。停用录音的播放项记不适用，历史待听审状态保留，不算通过。

错答反馈统一按[现行设计标准](../docs/butcher-version/publish/2026-10-18-0843-v1.54-教学单元设计标准与验收清单.md)验收。运行 `npx playwright test tests/e2e/retry-feedback.spec.js tests/e2e/l49-focus.spec.js`，覆盖 23 个现行课程入口的短反馈、原题重试、不高亮／朗读答案、灯泡不以解析兜底、真实空格及旧记录衔接，也覆盖 Lesson 49 和 49–50 分拣题从错答到原题重试的手机滚动位置。课程和共享练习改动会自动加入包含两份测试的 `browser-retry-feedback` 检查计划。历史测试中“答错显示正确答案”或“答错直接继续”的预期已经失效；不能为了保留旧断言恢复泄题或跳题。

需要 Node.js 24 或更新版本。首次检查前，在项目根目录运行：

```bash
npm ci
npx playwright install chromium
```

浏览器测试会自己启动本地网站。4173 被其他会话占用时，使用上面的独立端口，不停止其他会话的服务。

## Lesson 1–30 现行题目改版检查

现行题量与逐题依据以 [v4.0 题稿和验收记录](../docs/butcher-version/2026-09-27-2116-v4.0-Lesson1-30题目优化与验收.md) 为准：14个单元新增／改写41道任务，21–22保留已确认样板，15个单元合计449道必做任务。下方各单元的早期记录保留历史背景，不能以旧题数判断当前页面失败。

- 新控件和新题：`npx playwright test tests/e2e/units1-30-tasks.spec.js tests/e2e/units1-30-revision.spec.js tests/e2e/units-room-tasks.spec.js tests/e2e/units1-30-scene-cues.spec.js`。覆盖配对、原文定位、逐空填答、整句排序与房间找物的错误、提示、重试、刷新、场景映射；期望答案从独立题稿转录，不从运行页面获取。
- 逐课验收：`npx playwright test tests/e2e/units1-30-acceptance.spec.js`。15单元全流程、14单元真实旧轮次升级、每道新题四种宽度与状态、14单元同环节改前截图。截图还需目视复核，画廊在上述记录中。
- 自动检查的新截图写入 `output/test-units1-30-tasks/` 和 `output/test-unit21-22-tasks/`；审阅后才手动归档到文档证据目录。复跑不能直接覆盖已发布证据或修改检查输入。
- 账号成果：`npx playwright test -c playwright.login.config.js tests/login/units1-30-tasks-upgrade.spec.js`。使用4223的临时服务器与临时账号，先完成旧版、第二个浏览器补新版、第三个浏览器核对同步；不读写真实学生数据。
- 共用错误反馈：`npx playwright test tests/e2e/retry-feedback.spec.js tests/e2e/l49-focus.spec.js`。旧课程受影响的回归继续按下方命令选择。

Lesson 1–2仍有英语声音。用于题目迁移的播放结束替身只验证页面流程，不代表录音质量已听审；Lesson 3–30须阻断声音仍可完成、零英语声音请求与零系统朗读。真实微信、触控设备和课堂验收另列。

## 选哪项检查

| 改了什么 | 运行命令 | 检查内容 |
| --- | --- | --- |
| 共享计算或存储 | `npm run test:unit` | 评分、进度、数据异常 |
| 课程进度和刷新恢复 | `npm run test:state` | 首页、Lesson 49–54、音标课 |
| Lesson 49 活动 | `npm run test:l49:behavior` | 题目、提示、重试、重练、旧记录 |
| 页面交互 | `npm run test:e2e -- <测试文件>` | 受影响的浏览器操作 |
| 路由、文档、发布规则 | `npm run test:deploy` | 发布文件、目录配置、跳转 |
| 日常开发和提交 | `npm run check:commit` | 按改动选择逻辑和浏览器专项 |
| 只运行快速逻辑检查 | `npm run test:quick` | 单元检查和检查流程回归 |
| 完整回归 | `npm run test:full` | 单元检查和完整浏览器检查 |
| 准备正式发布 | `npm run verify:v1:release` | 上述检查及静态发布包 |

最后一项要求公开文件已经提交、工作区满足构建要求。它只检查和构建，不会自动提交、推送或上线。

## 提交和推送的完成条件

先用 `npm run check:plan` 查看本次范围。`check:commit` 默认比较工作区与 HEAD，包含已暂存、未暂存、新增和删除文件；检查已提交的一组修改时加 `-- --base <起始提交>`。

纯文档检查差异和本地链接；代码修改检查逻辑，并按音频、进度、布局和改动的测试文件增加浏览器专项。自动选取的是提交前基础检查，功能修复仍需覆盖原问题和受影响的真实页面。

提交前核对暂存内容与已测工作区一致；部分暂存与已测内容不一致时，先对齐待提交版本并检查。相关检查通过后完成已授权的提交、推送。目标远端提交号一致即推送完成，CI 状态单列；完整发布验收在正式发布阶段执行。

## 复用检查结果

检查入口把耗时、日志和成功记录保存在 `.cache/check-workflow/`，24 小时内可复用同一输入。源码、测试、命令、依赖版本、Node、系统或浏览器变化，失败、缺少所需产物、执行期间输入变化，均不能复用。加 `--force` 可强制复查，例如 `npm run test:quick -- --force`。

`npm run test:e2e:cached` 执行或复用完整浏览器检查；`npm test` 和发布命令继续保留完整覆盖。缓存命中只说明对应范围通过，不等于发布完成。检查锁残留时，先确认原进程已结束，再只删除提示的该项锁目录。

CI 按下方触发范围执行，同分支的新版本会取消过时检查。正式发布只接受目标版本自己的完整有效结果，并完成下列实际页面和线上检查。

## CI：少重复，覆盖不减

- 普通分支推送：`quick` 只跑检查流程、单元与发布契约测试。它不能代替合并检查。
- 所有 PR、`main`／`codex/release-canranstudio` 推送及手动运行：`verify` 完整执行；必需状态仍叫 `test`，任何必需组失败、取消、跳过或缺失都不能通过。一个功能分支提交不再同时触发两套完整浏览器检查。
- 课程按历史耗时分成 8 组，账号分成 3 组；文件内部仍串行，每组独立服务。缓存性能保持单独运行，WebKit 保留根目录和 `/lesson/` 两种路径。
- 每次从 Playwright 实际发现用例，再分配完整文件。历史数据只估算耗时，不是用例白名单；新增测试自动加入。`node scripts/ci/browser-suite.js verify` 核对各组实际选择的用例，确保总清单无遗漏、无重复，保留既有跳过用例。
- CI 保存 7 天的分组清单、JSON 报告和已有失败追踪／截图；不上传账号数据库。下载对应任务的附件定位问题，不能把失败后重跑的成功结果算作首次成功。

查看分组：`node scripts/ci/browser-suite.js plan courses`（或 `accounts`）。复查某组：`node scripts/ci/browser-suite.js run courses 1`；仍可用原 Playwright 命令复查单文件。

耗时基线在 [timings.json](../scripts/ci/timings.json)，来源为 [PR #20 最终成功检查](https://github.com/mrpersimmon/canranstudio/actions/runs/38544207131)。按当时数据，课程组由最慢约 48 分钟测试时间均衡到约 21.5 分钟／组，账号约 20 分钟／组；**这不是新工作流的实测承诺**，安装、排队、机器差异另计。后续按成功运行的 JSON 报告逐文件更新耗时，保留来源；不要为加速删题、放宽断言、拆散串行文件或只复跑失败项作为最终门槛。

## 针对某个问题复查

在 `npm run test:e2e --` 后加测试文件路径，例如：

```bash
npm run test:e2e -- tests/e2e/audio-lifecycle.spec.js
```

常用文件：音频 `audio-lifecycle.spec.js`、证书 `certificate-export.spec.js`、键盘与读屏 `accessibility.spec.js`、字体 `local-fonts.spec.js`、移动布局 `mobile-release.spec.js`，都在 `tests/e2e/`。

当前分支的课程导航检查用 `butcher-navigation.spec.js`，覆盖组合单元入口、继续学习、旧地址、触屏、键盘与进度隔离；组合单元完整流程用 `unit49-50.spec.js`。旧城区地图的界面专属检查已随设计替换归档在 `tests/archive/atlas-2026-09-19/`，现行路由、进度与设备检查仍保留运行。

Lesson 1–2 与 Lesson 25–26 当前采用[共性交互修复后的点击版](../docs/butcher-version/question/2026-10-06-1649-共性问题修复与验收.md)。运行 `npx playwright test tests/e2e/common-interactions.spec.js tests/e2e/unit-thirteen-types.spec.js tests/e2e/unit1-2 tests/e2e/unit25-26`：两课均为无配音，分别 25／27 题，按实际任务覆盖 10／12 类。专项核对中文词块、点击补词、连续阅读、正确后才推进的场景、未提交草稿与排序恢复、真实旧轮次升级、根路径与 `/lesson/` 全流程、四种宽度和实际证书 PNG。教材原文、词卡、书面材料和单页 A4 仍单列检查。教师、儿童与实体手机体验仍需人工验收；当前无必做英文键入题。

首轮试排使用 `types-v1`；本次改写的补词题和礼貌题使用 `clicks-v1`。相同题才承接旧记录，证书姓名和原日期保留。两轮改版前的真实内容分别冻结在 `tests/fixtures/unit1-2-types-before/`、`tests/fixtures/unit25-26-types-before/` 和 `tests/fixtures/common-interaction-before/`，仅通过测试拦截提供，不扩大本地服务器公开范围，也不进入发布包。Lesson 1–2 的历史配音、旧题序与旧分镜检查随页面归档，现行页面零英语音频请求由 `course-loading.spec.js` 验证；共享提示、重试与末题防护继续由 `l49-v18.spec.js`、`retry-feedback.spec.js` 覆盖。词块固定行高由 `unit25-26-layout.spec.js` 检查，缓存后的两课完整离线作答由 `course-cache-journeys.spec.js` 检查。

账号入口用 `npx playwright test -c playwright.login.config.js tests/login/thirteen-types.spec.js tests/login/units1-30-tasks-upgrade.spec.js --grep '1-2|25-26'`：虚构临时新账号完整通关、换设备恢复 15 星与证书，以及真实旧服务器升级后新题空白、亲自补答、第三设备同步和原日期保留。两类结果分别报告，不以匿名页面通过代替账号同步验收。证书共享修改时，连同 `unit49-50-certificate.spec.js` 回归；导航与子目录修改时，连同 `butcher-navigation.spec.js` 和 `lesson-deployment.spec.js` 回归。

Lesson 5–6 的检查用 `npx playwright test tests/e2e/unit5-6`：按[无配音优化 v2.0](../docs/butcher-version/2026-09-25-1643-v2.0-Lesson5-6无配音优化与验收.md)独立验证 20 句、30 题、24 张音标国旗词卡、全声音失败通关、正误反馈音、Sophie 留场及逐句人物切换、错答/提示记录、四种宽度、键盘、证书 PNG 与单页 A4、首页继续和 `/lesson/` 缓存离线恢复。`unit5-6-upgrade.spec.js` 通过冻结旧页面实际产生旧记录，再检查中断续读、历史配音版旧 15 星转为 9 星、新词义与综合题空白、姓名与未改题保留及重练优先。换组闪烁另运行 `tests/e2e/course-image-transitions.spec.js`，逐帧和 DOM 变化时记录全页可见性、加载层及缺图，覆盖配音／无配音、首访／复访、离线与会话降级；已加入共用缓存检查计划。历史 80 段录音检查保存在 `tests/fixtures/unit5-6-voiced-before/audio-checks.js`，不再要求现行页面播放；教师与儿童试用另验收。

Lesson 7–8 当前是[综合挑战无配音版 v2.1](../docs/butcher-version/2026-09-26-1521-v2.1-Lesson7-8综合挑战与验收.md)，用 `npx playwright test tests/e2e/unit7-8`：37 项页面检查覆盖 16 句、32 题（挑战 10 题）、22 张音标词卡、档案填写、参考答案延后开放、零英语配音请求、全声音失败通关、末题刷新不代答、稳定按钮、词块撤回、四种宽度、证书 PNG／单页 A4 和练习纸。新挑战单独有 8 项，按独立题稿逐题作答，核对首次／提示／修正记录、六词块完整显示、暂停续做、旧三题迁移和离线恢复；不能从程序答案字段生成预期。

升级验证从历史页面实际操作产生旧记录，再加载现行页面。历史配音版、27 题课堂版、25 题且挑战仅三题的版本分别在 `tests/fixtures/unit7-8-voiced-before/`、`tests/fixtures/unit7-8-classroom-before/`、`tests/fixtures/unit7-8-exam3-before/`，均不发布。只导入内容一致的有效作答，新增 her 题及七道综合题保持未答，重练不能再导入旧答案。`browser-unit78` 随源码、素材、历史样例及两个流程辅助变化加入检查计划。

账号入口另运行 `npx playwright test -c playwright.login.config.js tests/login/course-integration.spec.js tests/login/unit7-8-exam-upgrade.spec.js --grep '7–8'`：新账号无配音通关、更早 27 题版本升级后 9→15 星、旧三题版本升级后 12→15 星；名字、证书日期及成绩在新设备恢复。旧服务器样例用 4199、虚构临时账号，不读写真实学生数据库。共享成果规则改动时同时运行 9–10／11–12 的旧服务器升级检查。

`tests/login/portal-worker.spec.js` 延迟真实缓存脚本，先在页面输入，再释放安装：根目录与 `/lesson/` 的首页／课程直链不得刷新清空输入。缓存接管同时连同 `root-mount.spec.js`、`recovery.spec.js` 的旧公开页面迁移验收，不能只保住输入却放宽访问边界。页面检查可用 `COURSE_TEST_PORT=4192` 隔离端口，账号检查使用另一输出目录，避免覆盖证据。教师、儿童及真实手机验收单列。

I 词卡可单独运行 `npx playwright test tests/e2e/unit7-8-audio.spec.js -g 'I 词卡'`：现行预期是保留 /aɪ/ 和释义，翻面、刷新和相邻 am／are 不请求英语配音；两种路径都检查。原 65 段播放和 I 文件指纹检查随历史页面保留在上述样例目录的 `audio.spec.js`，不再作为现行页面交互预期。恢复配音前须重新听审，不能为了通过测试而更换指纹；历史证据见[I 修复记录](../docs/butcher-version/2026-09-21-2112-v1.1-Lesson7-8词音修复与防护.md)。

Lesson 9–10 以下为历史[综合挑战无配音版 v2.1](../docs/butcher-version/2026-09-26-1732-v2.1-Lesson9-10综合挑战与验收.md)。运行 `npx playwright test tests/e2e/unit9-10 tests/e2e/units9-12-classroom.spec.js --grep-invert 'Lesson 11'`，本课共 44 项：14 句、33 题（挑战 10 题）、22 张音标词卡、问候分镜、六组观察示范、无声通关、重试不泄题、末题不代答、四种宽度、中文展开不裁切、正确回应不推移按钮、旧链接、真实 PNG 及 A4。挑战的新增 8 项按独立教材题稿逐题作答，核对首次／提示／修正、长选项与五词块、暂停、旧三题升级和离线草稿。打印保留 A 六题／B 十二题；页数检查不能代替目视验收。

`unit9-10-upgrade.spec.js` 使用历史页面真实作答检查题目重新分组后的正确记录、未提交草稿、重练隔离、离线图片与翻卡稳定。课堂分组前旧页保存在 `tests/fixtures/unit9-10-classroom-before/`，本轮扩题前旧页在 `tests/fixtures/unit9-10-short-exam-before/`，更早配音页在 `tests/fixtures/unit9-10-voiced-before/`，均不发布。账号检查另行运行 `npx playwright test -c playwright.login.config.js tests/login/course-integration.spec.js tests/login/unit9-10-upgrade.spec.js --grep '9–10'`，共 3 项：新学生完整通关，以及两种 26 题旧服务器升级换设备后，保留原三题、先显示 12 星，新增七题亲自完成后同步 15 星、姓名和原证书日期。全部使用虚构临时账号，不读写真实学生数据库。更早配音版 9→15 星的路径继续由课程检查覆盖。

Lesson 11–12 当前为[认领分镜与综合挑战 v2.1](../docs/butcher-version/2026-09-26-2113-v2.1-Lesson11-12审视优化与综合验收.md)。运行 `npx playwright test tests/e2e/unit11-12 tests/e2e/units9-12-classroom.spec.js --grep-invert 'Lesson 9'`：16 句、30 题（挑战十题）、18 张音标词卡、12 份档案，四种宽度与短屏、无声通关、中文内部滚动、最后一题、PNG／A4；道具不能早于原文出现或确认，Perhaps 题的正确结果只能是请本人确认。

`unit11-12-exam.spec.js` 用独立题稿验证十题覆盖、重试不泄题、灯泡与独立成绩、末题刷新、四选项两行两列和长对白／词块在四种宽度完整；`unit11-12-exam-upgrade.spec.js` 从冻结的旧三题页面实际作答，验证 12→15 星、新七题空白、旧草稿不代答、暂停和断网续答。`unit11-12-scene.spec.js` 检查道具时序、错误和未提交不生成结果、档案完整翻页；`unit11-12-upgrade.spec.js` 从 `tests/fixtures/unit11-12-classroom-before/` 的旧页面真实学习后升级，验证完成记录、草稿、姓名和证书日期保留，以及整课加载、断网续读和翻词卡。`playwright.login.config.js` 下的 `unit11-12-upgrade.spec.js` 与 `course-integration.spec.js --grep '11–12'` 使用临时服务器和账号检查两种旧课堂版本升级、补题后跨设备成果和姓名／证书日期，不读取或修改线上学生。其中 short-exam 场景保留浏览器产生的真实数据，把当前完成签名中的一个汉字分成两段 HTTP 写入，再检查新设备的十题和 15 星；防止请求分段解码损坏中文成绩。

Lesson 13–14 从第一版为课堂配套版，使用 `npx playwright test tests/e2e/unit13-14`：独立题稿的 13 句、34 题（挑战十题）、21 张音标词卡，十幅配色图和 A 五组／B 十二组完整材料；全部声音失败仍通关、反馈音真实结束、末三题刷新不代答、提示和错答分别记录、词块撤回、内容更新保留未改活动、四种宽度与短屏、证书 PNG 和单页打印。图卡正面显示英文和音标，翻面显示中文；不能把翻面隐藏正面内容当作音标丢失。`unit13-14-scene.spec.js` 覆盖分镜道具时序、对白与人物不重叠、内部中文不裁切、固定操作区和翻页画册；`unit13-14-exam.spec.js` 使用独立题稿检查十题与长选项、五词块；`unit13-14-upgrade.spec.js` 通过冻结的 `tests/fixtures/unit13-14-classroom-before/` 旧页面真实学习，检查两题承接、新八题空白、草稿不代答、旧姓名／日期保留、暂停刷新及断网继续。`browser-unit1314` 随源码、插图、冻结样例和流程辅助变化加入检查计划；导航改动回归同上三个文件。导出的实际图片、A4 和颜色图仍须目视检查，教师与儿童验收单列。

本课登录验收使用 `npx playwright test -c playwright.login.config.js tests/login/unit13-14-upgrade.spec.js tests/login/course-integration.spec.js --grep '13–14'`：新账号全程及旧服务器升级后换设备、补齐新题后恢复 15 星与原证书日期。账号与数据均在测试临时环境，不访问线上学生。本次 36 项课程页面、2 项本课登录升级及 2 项共享账号回归的实际命令、截图和限制见[本轮证据](../docs/butcher-version/evidence/2026-09-26-2154-unit13-14-review/README.md)。

Lesson 15–16 当前为[海关分镜与综合挑战 v2.0](../docs/butcher-version/2026-09-27-0013-v2.0-Lesson15-16场景与综合练习优化.md)，采用无配音课堂配套版，使用 `npx playwright test tests/e2e/unit15-16`：完整 18 句、34 题（挑战十一题）、25 张音标词卡、四张国籍卡和十五幅复数物品图；Written A 六题、B 十二组材料与单页练习纸。覆盖正常反馈音、阻断全部声音后全程通关、两种路径隔离、旧记录内容升版、末题不代答、四种宽度和短屏、实际证书 PNG 与打印。`unit15-16-scene.spec.js` 检查护照递交、两对不同箱子的出现及归属顺序、手机对白与人物分区、桌面短屏同屏操作，以及错误和未提交不产生结果；`unit15-16-exam.spec.js` 按独立题稿作答十一题；`unit15-16-upgrade.spec.js` 从冻结的旧页面真实学习，检查有效两题承接、新九题空白、草稿不代答、旧姓名／日期保留及缓存断网续学。`browser-unit1516` 随源码、插图、冻结样例和流程辅助变化加入检查计划。页面截图需核对物品数量和颜色，教师与儿童验收单列。

本课账号入口运行 `npx playwright test -c playwright.login.config.js tests/login/unit15-16-upgrade.spec.js tests/login/course-integration.spec.js --grep '15–16'`：临时新账号无配音通关、旧服务器升级后换设备，补题前 12 星、补齐后 15 星，保留原证书日期和名字；不访问线上学生。实际结果见[本轮证据](../docs/butcher-version/evidence/2026-09-27-0013-unit15-16-review/README.md)。

Lesson 17–18 使用 `npx playwright test tests/e2e/unit17-18`：独立教材题稿对应 22 题、16 句原文、30 张音标词卡、15 组职业图、Written A 六题与 B 十组；检查无配音完整通关、正常反馈音、错答不泄题、末题刷新、四种宽度、打印导出、保存与隔离。`browser-unit1718` 随新单元、素材、流程辅助变化加入计划。内容审查须区分 not very busy 与 lazy，代词有课文身份依据，复数规则不过度推广。

Lesson 19–20 使用 `npx playwright test tests/e2e/unit19-20`：独立题稿对应 28 题、13 段完整对白、34 张音标词卡、20 幅对比图、Written A 六题与 B 十组。验证合说人物、两个相同词块独立选取、原题重试、末三题刷新、全音频阻断通关、反馈音、四种宽度、保存与内容更新、两种路径隔离和实际 PNG／A4 导出。`browser-unit1920` 随本单元、素材和流程辅助变化加入检查计划。目视审查成对插图尺度、轻重证据与同词不同语境；不把否定扩大为未说的相反状态。

Lesson 21–22 使用 `npx playwright test tests/e2e/unit21-22`：现行 30 个评分任务（含两组三对配对、两道原文定位、两道双条件交接）、8 段原文、36 张音标词卡、16 幅物品图、Written A 六题与 B 八组。验证全部声音失败仍通关、反馈音、连续错答不泄题、末三题刷新、重复 one? 词块独立撤回、四种宽度与短屏、保存和内容更新、根路径与 `/lesson/` 隔离、PNG 和 A4 实际导出。`browser-unit2122` 随本单元、素材和流程辅助变化进入计划。目视核对空满、大小与刀刃图；内容核对 one 的语境、接收者与所属、your 的说话人数及信息不足时再确认。

Lesson 23–24 使用 `npx playwright test tests/e2e/unit23-24`：现行 30 个评分任务（含两组三对配对、两道原文定位、两道双条件交接）、8 段原文、30 张音标词卡、十幅房间位置图、Written A 六题与 B 十组。验证全部声音失败仍通关、反馈音、连续错答不泄题、末三题刷新、图片选项的同等文字描述和显示尺度、词块撤回、四种宽度与短屏、保存与内容更新、两种路径隔离、实际证书 PNG 与 A4 导出。`browser-unit2324` 随本单元、素材与流程辅助变化进入计划。目视核对 on 的实际接触、近远参照与图中位置；不把 some 固定为两件，也不把 ones 固定为杯子。教师内容验收和儿童试用单列。

Lesson 25–26 当前检查用上方两课专项及 `npx playwright test tests/e2e/unit25-26`：独立教材题稿的 27 题、12 句叙述原文、36 张音标词卡、8 组位置与状态图、Written A 四题八空和 B 七组双句。验证无配音完整通关、重试不泄题、刷新末题、原文逐句完成、长词拼句、图选的同等文字描述、声音全失败、星星与保存隔离、证书真实 PNG 与一张 A4 练习纸。`browser-unit2526` 随新单元、素材和流程辅助变化加入计划。位置图须目视核对内部、表面接触、物品状态；冠词不能简化为字母判断或计出现次数。教师与儿童验收另行记录。若本机设置了代理，运行前为 `127.0.0.1,localhost` 配置 `NO_PROXY`，避免本地验收请求绕行代理。

Lesson 27–28 使用 `npx playwright test tests/e2e/unit27-28`：独立教材题稿的 19 题、13 句叙述原文、30 张音标词卡、10 组位置图、Written A 五题与 B 十组五句问答。覆盖全部声音失败仍通关、正常反馈音、原题重试不泄题、末题刷新、长词块完整显示与撤回、提示和修正分别记录、四种宽度、保存隔离、证书真实 PNG 与单页 A4。打印页保留 A 五题与 B 十组提示，B 任选一组书写五句；目视核对充足的整行空间。`browser-unit2728` 随单元、素材与流程辅助变化进入计划。内容审查特别核对 trousers 复数形式、some/any 使用范围及书面练习与原文场景的区别。教师内容验收与儿童试用单列。

Lesson 29–30 使用 `npx playwright test tests/e2e/unit29-30`：独立教材题稿的 23 题、9 句双人原文、30 张音标卡、35 个编号图项（含成对动作共 50 句）、Written A 三题与 B 完整词库和十一句书写。验证无配音全程、全部声音失败、正常反馈音、重试不泄题、刷新不代答、重复词块、四种宽度、记录隔离、真实 PNG 和单页 A4。`browser-unit2930` 随单元、素材和流程辅助变化进入计划。逐图核对动作对象，尤其可开启桌盖的 desk；核对 air / dust / empty 的本课词性、read 原形音标和自由搭配不设唯一答案。教师验收与儿童试用另行记录。


两个单元交付时同时运行 `npx playwright test tests/e2e/unit9-10 tests/e2e/unit11-12 tests/e2e/units9-12-classroom.spec.js`：增加完整原文、语境词义与图片题、正误反馈音、全部声音失败仍可领证、旧录音中断续读、旧 15 星迁移为 9 星后完成新题、稳定按钮与长选项检查。旧记录从两份 `tests/fixtures/unit*-voiced-before/` 历史页面实际产生，57／55 段旧音频的原测试保留在其中，不再要求现行页面播放。`browser-units9-12` 已加入相关源码、样例与流程辅助变化时的检查计划。首页、继续学习、重开和 `/lesson/` 隔离继续检查，导航变化回归前述三个文件；教师与儿童验收另记。

重复题整改用 `npx playwright test tests/e2e/unit-dedup.spec.js`：覆盖三单元新题、基础拼句到完整接力的顺序、综合挑战、分拣错题原题重试，以及真实旧题稿升级后不代答、未改活动保留。历史题稿放在 `tests/fixtures/unit-dedup-before/`，只用于隔离的浏览器升级检查；课件从当前内容加载。完整流程当前分别验证 28、27、73 题，并回归 `l49-v110.spec.js`、`l49-v110-defenses.spec.js`，确保 Lesson 49 单课的十二题、原题重试和旧回练记录衔接不被组合单元修改。题目必要性仍需按统一标准人工审稿，不能靠程序数题代替。

其中 `unit1-2-navigation.spec.js` 检查新学习先图鉴、旧章节地址与独立继续；`unit1-2-vocabulary-standard.spec.js` 逐卡检查 21 条按词典核对的音标、翻面与窄屏，`unit1-2.spec.js` 验证听辨后进入课文、理解和后续练习以及证书徽章顺序。词典标注检查不等于人工发音听审。

修改封面继续、章节定位或路由时，另运行 `npx playwright test tests/e2e/unit-resume-scroll.spec.js`：覆盖两单元在根路径和 `/lesson/` 的桌面、手机、手动滚回封面、连续继续、键盘、浏览器返回和未提交选择恢复，并对照 Lesson 49。必须检查目标标题进入可视区域，不能仅以地址正确判断跳转成功。

两单元的主题或容器修改，另运行 `npx playwright test tests/e2e/unit-themes.spec.js`：检查冷暖区分、选项平等、文字对比、旧作答恢复，以及 320 / 1100 像素下的人物位置、对白和翻页操作。保存图片的主题还由两单元证书流程与页面配色交叉核对。运行通过后，仍需对照设计稿目视检查真实页面和下载图片。

组合单元的领奖、长名字、手机布局、真实图片下载、图片失败重试与 A4 单页打印用 `unit49-50-certificate.spec.js`，和 `unit49-50.spec.js` 一起运行。准备记录来自完整页面作答，不伪造通关状态。

`/lesson/` 发布路径用 `lesson-deployment.spec.js`：检查导航与资源路径、原课程进度隔离、完整单元、证书、旧官网缓存下的录音，以及手机布局。

题目进度检查用 `l49-v115-progress.spec.js`：覆盖 Lesson 49 和合并单元的答对即时填绿、末题、错答、回练、重练、刷新、暂停和 320 像素窄屏。去重改变题量或分段时也必须运行：单课仍为十二题分拣、十题分段挑战；组合单元是十一题分拣、五题连续挑战，不能共用旧题量。分拣现按原题重试检查，错答和重试不填绿，真正改对后只补一格，末题和刷新同样适用。它也会随 `test:l49:behavior` 执行。

## 怎样判断完成

### 发音素材排查

发音要求统一看[设计标准第 7 节](../docs/butcher-version/publish/2026-10-18-0843-v1.54-教学单元设计标准与验收清单.md#7-声音加载与访问)。素材排查是只读诊断，不替代课程的页面行为测试或人工听审，也不自动改录音、提交或发布。

在项目根目录清点当前课程文件：

```bash
mkdir -p tmp/audio-audit
node scripts/media/course-audio-inventory.cjs > tmp/audio-audit/inventory.json
```

初筛另需 FFmpeg、Python 的 `numpy` 与 `faster-whisper`，以及本地已有的模型缓存；脚本不下载模型。本次使用 `faster-whisper 1.2.1`、`ctranslate2 4.8.2`、`numpy 2.5.3`。配置好相应 Python 环境后运行：

```bash
python scripts/media/audit-course-audio.py tmp/audio-audit/inventory.json \
  --output tmp/audio-audit --model base.en --model-cache <已有模型缓存目录>
```

生成的 JSONL 按文件指纹、模型名与参数缓存。复用前仍核对当前文件；更新模型内容时使用新的输出目录，避免把同名不同版本视为同一模型。要复核指定文件，可再加 `--model tiny.en --only-paths <文件路径数组.json>`。期望文字不会作为识别提示；转写不同只进入待复核队列，不能自动判错。

旧课程动态标签可以通过真实浏览器观察后传给清点工具的 `--dom-bindings <观察记录.json>`；本轮记录与全量清单见[2026-09-21 发音排查](../docs/butcher-version/2026-09-21-2143-v1.0-全课程发音排查.md)。只从文件名推断的条目必须继续补查文字真源。页内音频验证继续走各单元的实际控件，确认新文件和两种访问路径；人工结论记录审核人、日期和文件指纹。

### 发音修复防回退

五处发音修复与 I 词卡现行行为的相关页面检查：

```bash
npx playwright test tests/e2e/pronunciation-repairs.spec.js tests/e2e/unit7-8-audio.spec.js \
  --grep '修订录音|loose|新录音|只更换录音|I 词卡' --reporter=line
```

五处修复覆盖真实控件收到的文件与指纹、原速原生结束、重听、刷新、失败重试、根路径与 `/lesson/`。A01、A02 的 Lesson 5–6 与 A03 的 Lesson 11–12 已改为无配音，相关录音检查通过冻结的历史配音页验证，标题明确标为“历史”；现行页面停用录音的行为另由课堂配套检查覆盖。I 词卡同样检查英语配音保持停用。旧进度验证先在旧页面实际学习，再升级，不直接写入本地记录。`browser-pronunciation` 已加入相关课程、播放器、生成工具和原问题样例变化时的检查计划；手动运行上面的命令也可复验。

修订预期保存在 `tests/fixtures/pronunciation-repairs.json`，原问题样例放在 `tests/fixtures/pronunciation-before/`，不从待测课程清单生成预期。更换录音必须复核读音、留存新证据，再更新预期，不能只为通过指纹检查而改值。

生成配方位于 `scripts/media/lexemes/`。配置清单所记录的 Kokoro／Misaki／FFmpeg 环境后，可用 `python scripts/media/render-lexeme.py <配方.json> --output <新候选.mp3>` 复现；例外必须命中完整词及指定次数，实际音素与目标边界不符时停止。工具只生成待听审候选，不覆盖现用文件，也不自动取得人工通过。实际环境与拒绝诊断见[本次修复记录](../docs/butcher-version/2026-09-22-0018-v1.0-五处发音问题修复与验收.md)。

### 交付状态

共用拼句区域调整后，需运行 `tests/e2e/unit23-24-layout.spec.js` 中的“四种宽度全部拼句”检查。它同时覆盖正常字体和字体文件不可用：三个词块也可能换行，选取与撤回不能裁切词块或推动检查按钮。其他课程的正常布局检查继续保留，不能只凭字体加载成功时的截图验收。

命令结束且没有失败项，只说明对应自动检查通过。还需在真实页面检查题目意思、反馈、重听、重练、刷新恢复和小屏布局；真机结果填入[真机检查表](../docs/mobile-release-smoke-checklist.md)。

发布后用同一发布包运行 `npm run verify:live`，确认线上文件一致，详见[发布指南](../deploy/README.md)。

旧数据规则：Lesson 49、50 保留并限制有效星级；音标旧版只存总分，无法还原各关成绩，首次迁移到 v2 时归零。任何迁移都不能伪造新题的作答记录。

### 整课缓存下的旧页面检查

`/lesson/` 的 HTML 到达后仍可能在准备资源，跨课续学检查须等实际活动可见再离开，不能把文档响应成功当作学习页面已进入。关闭脚本时使用文字导航；课程入口应明确说明如何恢复，不能无限停在加载页。

资源地址可能是原路径、带校验值的固定路径或浏览器会话中的 `blob:` 地址。路径隔离只统计实际 HTTP 请求；无配音检查用 `tests/support/course-resource-urls.js` 区分三个已知反馈音与英语录音，不能因为路径改变把反馈音判成配音。修改该辅助文件时须复查引用它的页面检查。

原生播放是否结束与是否发起网络请求是两件事。复听已缓存录音可以没有新请求，应观察真实播放器结束，并核对其实际地址返回文件的独立校验值。模拟“未缓存录音网络失败”的检查使用无 Worker 的真实浏览器回退路径；有缓存时网络断开仍能播放，则由缓存专项检查覆盖。不能以删除失败断言代替这两种场景。

Lesson 1–6 的综合挑战按[覆盖表](../docs/butcher-version/2026-09-26-1655-v1.0-Lesson1-6综合挑战与验收.md)分别扩充为 8／9／10 题，整课 28／27／30 题。专项用 `COURSE_TEST_PORT=4192 npx playwright test tests/e2e/unit1-2-exam.spec.js tests/e2e/unit3-4-exam.spec.js tests/e2e/unit5-6-exam.spec.js tests/e2e/units1-6-exam-layout.spec.js tests/e2e/units1-6-exam-upgrade.spec.js`；覆盖末题刷新、错答／线索记录、四种宽度的长词块与操作稳定、缓存断网和真实旧页面升级。前置活动不变，仍连同各单元完整页面检查与 `unit-dedup.spec.js` 验证。

旧短挑战页面在 `tests/fixtures/unit{1-2,3-4,5-6}-short-exam-before/`，只用于验收，不发布。账号升级用 `npx playwright test -c playwright.login.config.js tests/login/units1-6-exam-upgrade.spec.js`，在临时旧服务器真实完成课程，重启为新版本后用新浏览器登录；必须先显示 12 星、旧题有效、新题空白，再补题同步 15 星及姓名／原证书日期。全部测试账号虚构，不改真实学生数据。

## Lesson 17–30 七单元场景与综合挑战

[内容与题稿记录](../docs/butcher-version/2026-09-27-0059-v2.0-Lesson17-30场景与综合练习优化.md)依据同一教材审视七课综合目标；[舞台整改与逐课视觉记录 v2.1](../docs/butcher-version/2026-09-27-1202-v2.1-Lesson17-30逐课舞台整改与验收.md)记录舞台；[人物身份与情境姿态 v2.2](../docs/butcher-version/2026-09-27-1346-v2.2-Lesson19-28人物身份与情境姿态优化.md)补充跨课人物取舍与并排验收。所有运行检查通过页面操作，答案预期来自独立审过的题稿。

- `npx playwright test tests/e2e/unit17-18 tests/e2e/unit19-20 tests/e2e/unit21-22 tests/e2e/unit23-24 tests/e2e/unit25-26 tests/e2e/unit27-28 tests/e2e/unit29-30 tests/e2e/units17-30`：完整教材/词卡/图册/配套写作、全声音失败、七套综合题、四种宽度、分镜与道具交接、按钮稳定、错误不泄题、断网复访与旧页面升级。
- `npx playwright test -c playwright.login.config.js tests/login/units17-30-upgrade.spec.js`：七个真实旧服务器分别产生两题旧完成记录，升级后在新设备保留12星；独立补完后同步15星、名字和原证书日期。测试用4199及临时虚构账户，不读写线上学生数据。
- 图册变为分页后，旧的“同时存在全部图卡”断言改为逐页核对全部内容，不能用分页为由减少教材覆盖。`tests/fixtures/unit*-classroom-before` 是当前批次冻结的旧内容/行为样例，原素材从现行仓库提供，不用于历史视觉还原。
- `core/classroom-scene.*` 只由这七个单元显式加载；共享的场景绘制不改变成绩，只有既有题目控制器能判分。该模块、七课内容/素材、冻结样例和独立题稿变化时，检查计划加入 `browser-units17-30-review`。
- `tests/e2e/units17-30-theatre.spec.js`：七课分别在 320、390、768、1280 宽度逐句推进，检查中文展开、历史恢复、人物与对白分层、操作位置稳定及完成后的操作；保存转折、末句与结束画面。19/21/23 额外保存坐下、拿起、否认与接收时刻。截图必须逐课目视复核，并将相邻易混人物的词卡／纪念图并排对照；尺寸断言通过不能单独判定画面合格。
- 场景重绘入口是 `python3 scripts/art/redraw-classroom-stages.py 17-18`（一次明确指定一个单元）。图形源、手机构图及道具时序一起维护；不能仅改生成文件或用通用人物模板重新覆盖整批。
- 当前验收数字、截图与实际未验范围以方案文档末尾为准；真实手机/教师/儿童与上线验收单列。

Lesson 21–22 新题型专项：`npx playwright test tests/e2e/unit21-22-tasks.spec.js tests/e2e/unit21-22-tasks-upgrade.spec.js`；真实旧 34 题页面升级与原题记录衔接，错答／重试／未提交草稿／暂停／单物品交接、四种宽度和图片证据。登录换设备升级另用 `npx playwright test -c playwright.login.config.js tests/login/unit21-22-tasks-upgrade.spec.js`，通过临时班级与真实页面完成记录验证，不注入学习成绩。

## Lesson 31–32 与账号横幅

`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit31-32.spec.js tests/e2e/butcher-navigation.spec.js`：无配音完整通关、逐题错误／修正／续做、原文、音标图鉴、动作画册、手机、缓存与证书。题稿见[本地设计与验收](../docs/butcher-version/2026-09-28-2212-v1.0-Lesson31-32设计与验收.md)。

`npx playwright test -c playwright.login.config.js tests/login/course-banners.spec.js tests/login/access.spec.js tests/login/root-mount.spec.js`：真实登录后的单列横幅、图片失败与重试、当前20课开课选择、新课默认关闭、成果同步和根目录权限。本地临时账号与生产学生数据分开。共享导航样式更新须同时检查静态首页与登录首页，不能以其中一个替代另一个。


## Lesson 33–34 河畔发现

`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit33-34.spec.js`：独立教材题稿验证33道任务、10句原文、22张音标词卡、12组动作与A5/B12；13题挑战逐题答错、原题修正、部分选择、撤回词块、暂停刷新、末题确认、正常反馈音／全声音失败、四种宽度、场景点击、缓存与真实PNG/A4。答案只从审定题稿转录，不能读取程序答案对象。

`npx playwright test -c playwright.login.config.js tests/login/unit33-34.spec.js tests/login/course-banners.spec.js tests/login/access.spec.js`：当前二十个课程开课选项、33–34默认关闭、跨班直链拒绝、登录完整通关与跨设备同步、根目录与子目录。33–34根目录用例另占4234端口，仅使用临时虚构账号。导航及资源登记修改时回归31–32。详见[教材覆盖、实际验证与未完成项](../docs/butcher-version/2026-09-29-1004-v1.0-Lesson33-34设计与验收.md)。


## Lesson 35–36 村庄相册

`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit35-36.spec.js`：独立教材题稿验证35道任务、15句叙述、16张音标词卡、12组位置路线、A3/B12；16题综合挑战逐题答错重试、暂存刷新、撤回词块和末题确认；三张照片、方向对照图、四种宽度、声音失败全通关、反馈音、缓存首次准备／离线复访／单张缺图恢复，以及真实PNG／A4。预期只从教材与独立设计题稿转录。

`npx playwright test -c playwright.login.config.js tests/login/unit35-36.spec.js tests/login/course-banners.spec.js tests/login/access.spec.js`：二十个可选单元，新课默认关闭；授权学生通关与跨设备同步，跨班直链拒绝，根目录／子目录。35–36根目录用例使用4238端口，仅创建临时虚构账号。详见[设计、教材依据与验收](../docs/butcher-version/2026-09-29-1344-v1.0-Lesson35-36设计与验收.md)。

证书共用导出改动追加 `tests/e2e/unit49-50-certificate.spec.js` 与 `tests/e2e/unit35-36.spec.js` 的证书相关场景，已登记 `browser-certificates`。用真实页面通关检查普通图片地址与缓存降级后的内存图片地址；导出人物和徽章不依赖资源文件名。35–36的降级用例先复现“图片暂时没有生成”，修复后实际下载PNG并目视检查，不用模拟发出下载事件替代。


## Lesson 37–38 书架制作小工坊

`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit37-38.spec.js`：独立教材题稿验证33道任务、18句原文、11张音标词卡、六组12句计划／正在对照、A4/B5；16题挑战逐题错答后原题修正、未选禁用、末题确认、暂存刷新及词块撤回。覆盖两把锤子的初始／拿起／否认／确认／交接，以及粉色只作计划色样；四种宽度与1280×720短屏、全声音失败通关／零英语语音与正常反馈音、键盘、缓存首访／离线／缺图重试／会话降级、实际证书PNG和A4及三页练习纸。答案从独立题稿转录，不从程序答案对象生成。

`npx playwright test -c playwright.login.config.js tests/login/unit37-38.spec.js tests/login/course-banners.spec.js tests/login/access.spec.js`：二十个可选单元，新课默认关闭；本课授权学生通关、成果跨设备同步、跨班直链拒绝、根目录／子目录及旧入口下架。37–38根目录用例另用4243端口，仅使用临时虚构账号。参见[设计与实际验证](../docs/butcher-version/2026-09-29-1507-v1.0-Lesson37-38设计与验收.md)。


## Lesson 39–40 无配音课堂配套版

依据[设计与验收](../docs/butcher-version/2026-10-01-0036-v1.0-Lesson39-40设计与验收.md)。`COURSE_TEST_PORT=4246 npx playwright test tests/e2e/unit39-40.spec.js` 覆盖33题、13句、9张音标词卡、12幅画册，花瓶每句只有一份且按交接／安放时机显示；包括全声音失败通关、真实正误与完成音、16题错答修正、词块撤回、两空未齐、四宽与短屏、逐帧词卡无闪、缓存离线与缺图重试、PNG与单页A4实物、相邻课记录隔离。期望由教材和独立题稿转录，截图需目视复核。

账号：`npx playwright test -c playwright.login.config.js tests/login/unit39-40.spec.js tests/login/course-banners.spec.js tests/login/access.spec.js`。仅临时虚构账号；验证新增课默认关闭、管理员预览、实际学生完整通关同步与另一设备恢复、跨班直链、根目录和内部前缀，生产旧 `/lesson/` 不恢复。根目录专项占用4248，先确认空闲。完整线上发布、真机微信、教师和儿童验收另列。

## Lesson 63–64：禁令与时长

独立题稿在 `tests/support/unit6364.js`，不读取运行时答案：`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit63-64.spec.js tests/e2e/unit63-64-story-layout.spec.js` 覆盖57题、22张音标词卡、12轮完整对白、四宽与短屏、连续错答／刷新／撤回／线索、场景检查后挂牌、三卡及无英语音频。场景另用 `--browser=webkit` 复查。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit63-64.spec.js`；用 `/lesson/` 复查子路径、`UNIT63_BROWSER=webkit` 复查移动WebKit。真实作答发五颗星，检查身份／班级隔离、悬浮卡与普通结算不抢播、纪念册、同名同星基准、60帧GIF、跨设备日期与离线重进、独立场景缺图拦截及复访缓存。详见[设计与实际结果](../docs/butcher-version/2026-10-13-1709-v1.0-Lesson63-64设计与验收.md)。

## Lesson 65–66：反身词与时间约定

`tests/support/unit6566.js`保存独立答案，不读取课程答案字段。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit65-66.spec.js tests/e2e/unit65-66-story-layout.spec.js` 检查69题、30词卡、13轮完整课文、连续错答与刷新、配对撤回、两空及词块门槛、检查后交钥匙、五区三卡、四宽和短屏。小剧场另加`--browser=webkit`。

`LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit65-66.spec.js`检查完整账号、跨设备五星日期、真实纪念册／60帧GIF、同姓名同星数样板对照、班级隔离、独立资源故障和复访；`AWARD_TEST_BASE=/lesson/`与`UNIT65_BROWSER=webkit`分别覆盖子路径和移动WebKit。生产旧/lesson/仍下线。实际证据及未完成边界见[本单元记录](../docs/butcher-version/2026-10-13-1822-v1.0-Lesson65-66设计与验收.md)。

## Lesson 67–68：过去的地点、状态与日记

`tests/support/unit6768.js`保存独立答案，依据教材纸页134–137、同步导学Grammar纸页122。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit67-68.spec.js tests/e2e/unit67-68-story-layout.spec.js`覆盖62题、30词卡、8轮原文、连续错答／续做／撤回、正确检查后盖章、四宽短屏、五区五星与三卡。小剧场另用`--browser=webkit`。

`LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit67-68.spec.js`检查完整账号、实际五星同步、纪念册和60帧GIF、认可卡对照、权限隔离、独立街景丢失的拦截恢复与素材复访。`AWARD_TEST_BASE=/lesson/`和`UNIT67_BROWSER=webkit`覆盖子路径及移动WebKit。真实结果与待验边界见[单元记录](../docs/butcher-version/2026-10-13-1927-v1.0-Lesson67-68设计与验收.md)。

## Lesson 69–70：赛车相册、时间介词与日期

`tests/support/unit6970.js`保存依据教材138–141、导学Grammar125独立编写的答案；`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit69-70.spec.js tests/e2e/unit69-70-story-layout.spec.js`覆盖72题、42词卡、5段全文、连续错答与订正、撤回与刷新、正确检查后盖章、四宽短屏、五区五星。小剧场另用`--browser=webkit`。

`LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit69-70.spec.js`覆盖账号授权、五颗星同步、卡册与GIF、认可卡对照、独立赛场缺图拦截恢复与快速复访；另以`AWARD_TEST_BASE=/lesson/`、`UNIT69_BROWSER=webkit`核对子路径与移动WebKit。实测结果及未验边界只维护在[单元记录](../docs/butcher-version/2026-10-13-2003-v1.0-Lesson69-70设计与验收.md)。

### Lesson 71–72 新单元页面验收

独立答案与原文分别位于 `tests/support/unit7172.js`、`tests/e2e/unit71-72-story-layout.spec.js`。`unit71-72.spec.js` 覆盖68题、34张词卡、过去式对比、配对／两空／词块、重复错答与统计、参考材料及四宽短屏；故事用例逐句核对12句原文、真正说话人与完整人物。登录用例覆盖新课授权、五区同步、纪念册、真实GIF、长姓名与账号隔离、独立缺图恢复与缓存复访。`UNIT71_BROWSER=webkit` 可切换本课页面／账号用例的引擎；根目录和 `/lesson/` 测试子路径分别运行，不代表线上仍有该旧路径。执行结果与证据仅记入单元验收文档。

### Lesson 79–80：购物清单与must／need

独立题稿位于 `tests/support/unit7980.js`；真实页面用 `COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit79-80.spec.js tests/e2e/unit79-80-story-layout.spec.js` 检查62题、36张词卡、13轮原文、六类商店26种物品及A5/B7参考。覆盖mustn’t／needn’t区别、需要物品／需要做事、零库存与数量不足、连续错答与刷新、未提交不更新清单、四宽和短屏、三卡与五区五星。`UNIT79_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit79-80.spec.js`；`AWARD_TEST_BASE=/lesson/`为内部子路径验收，生产旧入口不恢复。真实作答验证跨设备同步、权限、纪念册、同名同星样板对照、60帧GIF、长姓名、缺图拦截与缓存复访；移动WebKit使用同一`UNIT79_BROWSER`开关。实际结果与未验边界记入[本单元设计与验收](../docs/butcher-version/2026-10-14-0954-v1.0-Lesson79-80设计与验收.md)。

### Lesson 81–82：晚餐故事与have表示活动

独立答案与18轮原文位于 `tests/support/unit8182.js`、`tests/e2e/unit81-82-story-layout.spec.js`。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit81-82.spec.js tests/e2e/unit81-82-story-layout.spec.js` 覆盖66题、30张词卡、82课12项活动和A6/B12参考，包含have活动义、各时态问答、未发生的安排、错误重试与续做、两空／配对／词块、五区三卡及四宽短屏。逐场核对Tom从楼上回应时不提前出现在楼下、真实说话人及人物完整；`UNIT81_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit81-82.spec.js`，并分别以`AWARD_TEST_BASE=/lesson/`和`UNIT81_BROWSER=webkit`核对内部子路径、移动WebKit。包括班级授权、真实66题获星与同步、纪念册、同名同星样板对照、实际1／5星GIF解码、长姓名、缺图拦截恢复、复访素材复用及离线重连保留作答。引擎限制与实际结果仅记入[单元验收](../docs/butcher-version/2026-10-14-1035-v1.0-Lesson81-82设计与验收.md)；本地测试不代表生产部署或手机微信验收。

### Lesson 83–84：行李箱故事与现在完成时

独立答案与12轮原文位于 `tests/support/unit8384.js`、`tests/e2e/unit83-84-story-layout.spec.js`。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit83-84.spec.js tests/e2e/unit83-84-story-layout.spec.js` 覆盖73题、36张词卡、84课20项数字材料和A7/B10参考；检查两种完成时含义、助动词与过去分词、肯否问答、副词与some／one、错误重试／续做、未提交不更新行前记录、四宽短屏和五区三卡。`UNIT83_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit83-84.spec.js`，分别以内部`AWARD_TEST_BASE=/lesson/`和`UNIT83_BROWSER=webkit`检查子路径及移动WebKit，包括授权、真实获星同步、纪念册、同名同星认可卡对照、1／5星60帧GIF、长姓名、缺图拦截／恢复、快速复访和离线重连续做。实际结果与未验边界记入[单元验收](../docs/butcher-version/2026-10-14-1111-v1.0-Lesson83-84设计与验收.md)，不代表部署或微信真机验收。

### Lesson 85–86：电影院外的旅行经历

独立答案与13轮原文位于 `tests/support/unit8586.js`、`tests/e2e/unit85-86-story-layout.spec.js`。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit85-86.spec.js tests/e2e/unit85-86-story-layout.spec.js` 覆盖65题、30词卡、86课15动作／序数和A7/B12；检查三种去向、过去时间与不规则分词、错答续做、场景检查正确后更新、四宽短屏和五区三卡。`UNIT85_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit85-86.spec.js`，再用 `AWARD_TEST_BASE=/lesson/` 和 `UNIT85_BROWSER=webkit` 验两种挂载及移动WebKit。覆盖权限、真实获星、纪念册、1／5星实际GIF、同名同星认可卡对照、长姓名、缺图恢复和复访续做；结果及真机边界记入[单元验收](../docs/butcher-version/2026-10-14-1159-v1.0-Lesson85-86设计与验收.md)。

### Lesson 87–88：修理厂里的进度单

独立答案与13轮原文位于 `tests/support/unit8788.js`、`tests/e2e/unit87-88-story-layout.spec.js`。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit87-88.spec.js tests/e2e/unit87-88-story-layout.spec.js` 检查66题、26词卡、4组问答／12组动词与A6／B10原题；完成与过去时间、持续／已结束对比、开始不等于完成、错答续做、四宽短屏与车库转场。`UNIT87_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit87-88.spec.js`，再用`AWARD_TEST_BASE=/lesson/`及`UNIT87_BROWSER=webkit`验两种挂载与移动WebKit。包含五区获星、卡册、真实1／5星GIF、长姓名、隔离与缺图复访；实际结果和未验边界写入[单元验收](../docs/butcher-version/2026-10-14-1241-v1.0-Lesson87-88设计与验收.md)，用例存在不代表通过。

### Lesson 89–90：看房时的时间线索

独立答案与16轮原文位于 `tests/support/unit8990.js`、`tests/e2e/unit89-90-story-layout.spec.js`。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit89-90.spec.js tests/e2e/unit89-90-story-layout.spec.js` 检查65题、24词卡、4组问答／15组动词与A6／B6原题；for／since、持续证据、同形异音、错答续做、四宽短屏与门前／客厅转场。`UNIT89_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit89-90.spec.js`，再用`AWARD_TEST_BASE=/lesson/`及`UNIT89_BROWSER=webkit`验两种挂载与移动WebKit。包含五区获星、卡册、真实1／5星GIF、长姓名、身份隔离与缺图复访；实际结果和未验边界写入[单元验收](../docs/butcher-version/2026-10-14-1310-v1.0-Lesson89-90设计与验收.md)，用例存在不代表通过。

### Lesson 91–92：邻居们的明日约定

[设计与验收](../docs/butcher-version/2026-10-14-2140-v1.0-Lesson91-92设计与验收.md)。独立题稿答案 `tests/support/unit9192.js`；`tests/e2e/unit91-92*.spec.js` 检查66题、14轮三人对白、30张词卡、92课时间表／16动作／A4与B8、错答与续做、四宽短屏、固定三卡和五区五星。`UNIT91_BROWSER=webkit`切换引擎。账号 `tests/login/unit91-92.spec.js` 检查授权、五次真实获星、动画、跨设备、卡册、1／5星实际GIF、长姓名、身份隔离及课包重试；`AWARD_TEST_BASE=/`与`/lesson/`分别核对。实际通过与环境限制只记录在单元文档，不以用例存在替代通过。

Lesson 91–92的小剧场提示修正按v1.50第3、8节检查：`unit91-92-story-layout.spec.js`逐句确认无自动剧情摘要／语法解析、中文默认收起并可主动展开／收起、原文与人物切换完整、刷新续读保留；Chromium与WebKit均检查320／390／768／1280宽。只修改展示，不改变题稿或奖励版本。

### Lesson 93–94：新邻居的飞行手记

[设计与验收](../docs/butcher-version/2026-10-15-0002-v1.0-Lesson93-94设计与验收.md)。独立题稿答案`tests/support/unit9394.js`；`tests/e2e/unit93-94*.spec.js`检查72题、八段完整旁白、无自动结论、36词卡、15城市、Grammar状态参考、A5／B5打印、错答／续做／重练、四宽短屏和声音故障。`UNIT93_BROWSER=webkit`切换引擎。账号`tests/login/unit93-94.spec.js`检查真实获星、卡册、1／5星GIF、身份隔离、跨设备和课包恢复；`AWARD_TEST_BASE=/`及`/lesson/`分别验证。实际结果及Windows环境边界只在单元记录维护。


# Lesson95–96：材料先可作答与完整账号

`npx playwright test tests/e2e/unit95-96.spec.js tests/e2e/unit95-96-story-layout.spec.js`覆盖独立答案通关、未答材料、17轮完整对白、按需中文、人物／钟面／转场、四宽与短屏、续做／错答／重练及打印。`UNIT95_BROWSER=webkit`执行同套WebKit范围；环境变量按当前Shell设置。

`npx playwright test -c playwright.login.config.js tests/login/unit95-96.spec.js`分别在`AWARD_TEST_BASE=/`与`/lesson/`检查授权、完整账号、五星日期、跨设备、身份隔离、缺图恢复、复访和实际GIF。故障注入使用实际课包请求的独立`ticket-scene.svg`，先确认404确实发生；内容相同的背景可能被哈希去重，不能只凭源文件名推定请求地址。原文／答案独立维护，不能读取运行时答案或注入学习成果；结果与未覆盖项以单元验收记录为准。


# Lesson97–98：归属关系、视角与标签时序

`npx playwright test tests/e2e/unit97-98.spec.js tests/e2e/unit97-98-story-layout.spec.js`检查独立题稿、未答材料、16轮原文、标签与箱子时序、32词卡、归属参考、A6／B9、四宽与短屏、帮助／错答／续做及打印。`UNIT97_BROWSER=webkit`使用同套WebKit范围，环境变量按当前Shell设置。

`npx playwright test -c playwright.login.config.js tests/login/unit97-98.spec.js`分别设置`AWARD_TEST_BASE=/`或`/lesson/`，覆盖班级授权、五区五星、身份日期、跨设备、卡册／实际GIF及缺图恢复。独立背景为`lost-property.svg`，先核对实际404发生，再检查拦截与恢复。故障、未验范围与人工边界在单元记录中说明。

# Lesson99–100：转述、人称与时态边界

`npx playwright test tests/e2e/unit99-100.spec.js tests/e2e/unit99-100-story-layout.spec.js`检查65题的未答材料、9轮完整原文、电话时序、35词卡、16组替换、A5／B10、帮助记录、错答／续做、四宽短屏和打印。独立答案在`tests/support/unit99100.js`，不读取运行时答案；`UNIT99_BROWSER=webkit`复查同一范围。

`npx playwright test -c playwright.login.config.js tests/login/unit99-100.spec.js`分别设置`AWARD_TEST_BASE=/`或`/lesson/`，覆盖授权、五区五星、跨设备、日期、卡册、实际GIF及缺图恢复。缺图资源使用本课独立`home-stairs.svg`并检查真实404；`LOGIN_TEST_PORT`和`COURSE_TEST_PORT`使用空闲端口。结果、Windows环境失败及人工待验在单元记录维护。

# Lesson101–102：原作者、收信人和反意疑问句

`npx playwright test tests/e2e/unit101-102.spec.js tests/e2e/unit101-102-story-layout.spec.js`检查72题未答材料、12轮完整原文、28词卡、16组替换、A5／B9及完整B表格、四宽短屏、三卡、帮助记录、错答重试与打印。`UNIT101_BROWSER=webkit`复查另一引擎；独立答案在`tests/support/unit101102.js`。单选重试须重新选答，不沿用填空保留草稿的假设。

`npx playwright test -c playwright.login.config.js tests/login/unit101-102.spec.js`分别设置`AWARD_TEST_BASE=/`与`/lesson/`，检查授权、五星、同步、跨设备、卡册／实际GIF、长姓名与隔离。缺图测试先观察独立`postcard-room.svg`实际404。端口用`COURSE_TEST_PORT`／`LOGIN_TEST_PORT`指定空闲端口；全部结果和未验边界在单元记录维护。

# Lesson103–104：程度、过去能力与当前请求

`npx playwright test tests/e2e/unit103-104.spec.js tests/e2e/unit103-104-story-layout.spec.js`覆盖68题、未答材料、9轮原文、36词卡、16组替换、A6／B12、四宽短屏、帮助记录、错答／续做及打印。独立答案在`tests/support/unit103104.js`；`UNIT103_BROWSER=webkit`复查另一引擎。尺寸题先检查书宽、盒内宽和其余维度条件，不能只验选项判分。

`npx playwright test -c playwright.login.config.js tests/login/unit103-104.spec.js`分别设`AWARD_TEST_BASE=/`和`/lesson/`，检查授权、五星同步、跨设备日期、卡册／实际GIF、缺图复访、长姓名及隔离。独立故障资源`exam-corridor.svg`须先观察真实404。端口用`COURSE_TEST_PORT`／`LOGIN_TEST_PORT`指定；结果与人工待验在单元记录维护。

# Lesson105–106：不定式、行动人与否定范围

课程专项：npx playwright test tests/e2e/unit105-106.spec.js tests/e2e/unit105-106-story-layout.spec.js 。覆盖64题未答材料、11轮原文、28词卡、K–Z替换、A6／B8／C6／D6、人物切换与礼物时机、四宽短屏、帮助记录、错答／续做和打印。独立答案在tests/support/unit105106.js；UNIT105_BROWSER=webkit复核另一引擎。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit105-106.spec.js 。分别设AWARD_TEST_BASE=/和/lesson/，检查逐班授权、五星同步、跨设备日期、卡册与实际GIF、缺图复访、长姓名与身份隔离。独立背景office-room.svg须观察实际404后再验恢复。端口由COURSE_TEST_PORT／LOGIN_TEST_PORT指定；结果与人工待验见单元设计记录。

# Lesson107–108：比较级、最高级与完整范围

课程专项：npx playwright test tests/e2e/unit107-108.spec.js tests/e2e/unit107-108-story-layout.spec.js 。覆盖68题的未答材料、8轮原文、29词卡、A–L及A5／B8／C6，四种人物持物姿态、四宽短屏、帮助记录、连续错答／续做和打印。独立答案在tests/support/unit107108.js；UNIT107_BROWSER=webkit复核另一引擎。重量图需先核对三只箱子与独立题稿的4／6／9 kg对应，不只验可加载。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit107-108.spec.js 。分别设AWARD_TEST_BASE=/和/lesson/检查授权、五星同步、跨设备日期、卡册与实际GIF、缺图复访、长姓名和身份隔离。目录旧脚本固定访问/lesson/，运行目录专项时必须采用该测试挂载。COURSE_TEST_PORT／LOGIN_TEST_PORT指定独立端口，结果及人工待验见单元记录。

# Lesson109–110：数量词与不规则比较

课程专项：npx playwright test tests/e2e/unit109-110.spec.js tests/e2e/unit109-110-story-layout.spec.js 。覆盖72题未答材料、16轮原文、35词卡、I–Z和A4／B6／C6／D6，人物持物时序、四宽短屏、帮助、错答／续做和打印。独立答案在tests/support/unit109110.js；UNIT109_BROWSER=webkit复核另一引擎。量图需独立核对满匙／半匙及相同量杯100／200／300 ml，不只验可加载；far两组词形保持可读。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit109-110.spec.js 。分别设置AWARD_TEST_BASE=/和/lesson/，检查授权、五星同步、跨设备日期、卡册与实际GIF、缺图复访、长姓名和身份隔离。目录旧脚本固定访问/lesson/，目录专项采用该测试挂载。COURSE_TEST_PORT／LOGIN_TEST_PORT指定独立端口；实际结果与人工待验见单元记录。

# Lesson111–112：相同比较、否定方向与付款单位

课程专项：npx playwright test tests/e2e/unit111-112.spec.js tests/e2e/unit111-112-story-layout.spec.js tests/e2e/unit111-112-word-layout.spec.js 。覆盖68题未答材料、10轮原文、33词卡、a–r和A4／B6／C4，三人朝向、四宽短屏、帮助、错答／续做和打印。独立答案为tests/support/unit111112.js；UNIT111_BROWSER=webkit复核另一引擎。完整词形必须在英文正面检查，翻到中文背面后隐藏英文属于正常行为。B／C每题三句留三行；价格和同形箱子的重量均按独立题稿核对。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit111-112.spec.js 。分别设置AWARD_TEST_BASE=/和/lesson/，检查授权、五星同步、跨设备日期、卡册／实际GIF、缺图复访、长姓名与身份隔离。目录旧脚本固定访问/lesson/，目录专项采用该测试挂载。COURSE_TEST_PORT／LOGIN_TEST_PORT指定独立端口；失败复现、修复证据及人工待验见单元记录。

# Lesson113–114：按事实回应与完整八人课文

课程专项：npx playwright test tests/e2e/unit113-114.spec.js tests/e2e/unit113-114-story-layout.spec.js tests/e2e/unit113-114-word-layout.spec.js 。覆盖76题未答材料、八个人物15轮、共同台词双人高亮、纸币唯一性、零钱时序、28词卡、o–z和A4／B4／C6／D6，四宽短屏、错误／续做和40行书写。独立答案在tests/support/unit113114.js；UNIT113_BROWSER=webkit复核另一引擎。开场图要实际解码，人物标签须互不遮挡；词卡在英文正面检查完整词形。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit113-114.spec.js 。分别设置AWARD_TEST_BASE=/和/lesson/，检查权限、五星同步、跨设备日期、卡册／实际GIF、背景真实404、复访、长姓名和身份隔离。目录旧脚本固定访问/lesson/，目录专项采用该测试挂载。COURSE_TEST_PORT／LOGIN_TEST_PORT指定独立端口。初始L05与标签失败、修复后证据及人工待验见单元记录。

# Lesson115–116：人事物地点与花园故事

课程专项：npx playwright test tests/e2e/unit115-116.spec.js tests/e2e/unit115-116-story-layout.spec.js tests/e2e/unit115-116-word-layout.spec.js 。覆盖74题未答资料、四人14轮原文与姿态／朝向、31词卡、116词表和a–l、A4／B6／C4／D4共32行书写；四宽短屏、错答／续做／帮助记录。独立答案在tests/support/unit115116.js，不读取程序答案生成；UNIT115_BROWSER=webkit复核另一引擎。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit115-116.spec.js 。AWARD_TEST_BASE分别为/与/lesson/；检查新课权限、五星同步、跨设备日期、卡册与实际GIF、背景实际404、复访、长姓名及身份隔离。目录专项仍用/lesson/测试挂载。COURSE_TEST_PORT／LOGIN_TEST_PORT指定独立端口。原始失败、目视修复和人工待验见[单元记录](../docs/butcher-version/2026-10-15-1146-v1.0-Lesson115-116设计与验收.md)。

# Lesson117–118：过去动作、叙述与时间图

课程专项：npx playwright test tests/e2e/unit117-118.spec.js tests/e2e/unit117-118-story-layout.spec.js tests/e2e/unit117-118-word-layout.spec.js 。覆盖74题未答材料、六段完整叙述及三人身份／电话两端、28词卡、ring三种词形与音标、m–r和A6／B8／C8的44行书写；四宽短屏、错答／提示／续做。独立答案在tests/support/unit117118.js，不从运行时答案生成。UNIT117_BROWSER=webkit复核另一引擎。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit117-118.spec.js 。AWARD_TEST_BASE分别为/和/lesson/；检查新课权限、五星、跨设备日期、真实GIF、独立背景实际404、复访、身份隔离，以及两张时间图的未答可见性与错答／两空刷新。目录专项仍使用/lesson/测试挂载。时间图须另核对实际绘制大小，不以加载和无横向溢出代替可读性。全部结果及人工待验见[单元记录](../docs/butcher-version/2026-10-15-1245-v1.0-Lesson117-118设计与验收.md)。

# Lesson119–120：过去之前与完整故事

课程专项：npx playwright test tests/e2e/unit119-120.spec.js tests/e2e/unit119-120-story-layout.spec.js tests/e2e/unit119-120-word-layout.spec.js 。覆盖71题未答材料、7段原文、23词卡、thief单复数与音标、s–x、24题48行书写，四宽短屏、错答、帮助及续做。独立答案在tests/support/unit119120.js，不从运行时生成。UNIT119_BROWSER=webkit复核另一引擎。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit119-120.spec.js 。AWARD_TEST_BASE分别为/和/lesson/；权限、五星、跨设备日期、实际GIF、独立背景真实404、复访、身份隔离和两图材料逐一检查。目录专项用/lesson/测试挂载。运行证据与人工待验见[单元记录](../docs/butcher-version/2026-10-15-1435-v1.0-Lesson119-120设计与验收.md)。

# Lesson121–122：对象描述与动作方向

课程专项：npx playwright test tests/e2e/unit121-122.spec.js tests/e2e/unit121-122-story-layout.spec.js tests/e2e/unit121-122-word-layout.spec.js 。覆盖70题未答材料、13轮原文、23词卡、forget三词形与音标、122课1–9、24题64行书写、四宽短屏、错答、帮助及续做。答案在tests/support/unit121122.js独立维护。UNIT121_BROWSER=webkit复核另一引擎。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit121-122.spec.js 。AWARD_TEST_BASE分别为/和/lesson/；检查权限、五星、跨设备日期、真实GIF、背景实际404、复访、身份隔离和两图的未答／错答／两空续做。动画采样与长流程超时若在高负载并行运行中失败，先保留日志、隔离复现，不能直接放宽断言。实际结果见[单元记录](../docs/butcher-version/2026-10-15-1635-v1.0-Lesson121-122设计与验收.md)。

# Lesson123–124：结构省略与感叹

课程专项：npx playwright test tests/e2e/unit123-124.spec.js tests/e2e/unit123-124-story-layout.spec.js tests/e2e/unit123-124-word-layout.spec.js 。覆盖73题未答材料、17轮原文、24词卡、grow三词形与音标、124课1–9、18题42行书写、四宽短屏、错答、帮助及续做。答案在tests/support/unit123124.js独立维护。UNIT123_BROWSER=webkit复核另一引擎。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit123-124.spec.js 。AWARD_TEST_BASE分别为/和/lesson/；检查权限、五星、跨设备日期、真实GIF、独立背景实际404、复访、身份隔离和两图未答／错答／两空续做。动画敏感流程与运行并发、耗时一并记录，失败保留原断言隔离核对。实际结果见[单元记录](../docs/butcher-version/2026-10-15-1735-v1.0-Lesson123-124设计与验收.md)。

# Lesson125–126：必须、不必与条件变化

课程专项：npx playwright test tests/e2e/unit125-126.spec.js tests/e2e/unit125-126-story-layout.spec.js tests/e2e/unit125-126-word-layout.spec.js 。独立答案在tests/support/unit125126.js；覆盖73题、11轮原文、24词卡、126课6例及12题16行书写、四宽短屏、重试和帮助记录。UNIT125_BROWSER=webkit复核另一引擎。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit125-126.spec.js 。AWARD_TEST_BASE分别为/和/lesson/，验证空记录五星、同步、真实GIF、缺图实际404、目录复访、身份边界和两图续做。保留初轮失败及受影响范围复验，不能通过放宽触控、打印或动画断言规避问题。实际结果见[单元记录](../docs/butcher-version/2026-10-15-1925-v1.0-Lesson125-126设计与验收.md)。

# Lesson127–128：现在推测与事实边界

课程专项：npx playwright test tests/e2e/unit127-128.spec.js tests/e2e/unit127-128-story-layout.spec.js tests/e2e/unit127-128-word-layout.spec.js；独立作答单tests/support/unit127128.js。65题、12轮原文、18词卡、8组原例、27题67行打印、四宽和短屏、错答／提示／刷新／重练；UNIT127_BROWSER=webkit切换引擎。

账号专项：npx playwright test -c playwright.login.config.js tests/login/unit127-128.spec.js；AWARD_TEST_BASE分别为/与/lesson/。故障目标为独立cafe-room.svg，先断言真实404。保存初稿失败、同版本隔离和修订复验，结果见[单元记录](../docs/butcher-version/2026-10-16-0139-v1.0-Lesson127-128设计与验收.md)。

# Lesson129–130：过去推测与建议

课程：npx playwright test tests/e2e/unit129-130.spec.js tests/e2e/unit129-130-story-layout.spec.js tests/e2e/unit129-130-word-layout.spec.js；独立作答单tests/support/unit129130.js。66题、14轮、18词卡、130原例8组、26题66行打印、四宽短屏和重试续做。UNIT129_BROWSER=webkit。

账号：npx playwright test -c playwright.login.config.js tests/login/unit129-130.spec.js；AWARD_TEST_BASE=/与/lesson/。缺图目标roadside.svg必须真实404后才验恢复；初始失败、隔离与修订复验分别保存，结果见[单元记录](../docs/butcher-version/2026-10-16-0235-v1.0-Lesson129-130设计与验收.md)。

# Lesson131–132：可能性与未定计划

课程：npx playwright test tests/e2e/unit131-132.spec.js tests/e2e/unit131-132-story-layout.spec.js tests/e2e/unit131-132-word-layout.spec.js；独立答案tests/support/unit131132.js。65题、16阅读步骤保留原8轮全文、18词卡、6组原例、27题48行逐题书写与真实PDF。UNIT131_BROWSER=webkit。

账号：npx playwright test -c playwright.login.config.js tests/login/unit131-132.spec.js；AWARD_TEST_BASE=/与/lesson/。缺图living-room.svg必须真实404，验证完整同步／卡册／实际GIF／身份和恢复。768px长导航与PDF多位题号修复按影响复验，初始失败不抹去。[实际结果](../docs/butcher-version/2026-10-16-0345-v1.0-Lesson131-132设计与验收.md)。

### Lesson133–134

独立审定答案在[作答单](support/unit133134.js)。课程检查：unit133-134.spec.js、unit133-134-story-layout.spec.js、unit133-134-word-layout.spec.js；账号检查：login/unit133-134.spec.js，使用UNIT133_BROWSER=webkit切换引擎，AWARD_TEST_BASE覆盖/和/lesson/。真实学生完成、关课重开、实际GIF、失败重试与离开取消均走界面；缺图在HTTP故障助手命中airport.svg后断言恢复，不注入学习或奖励数据。命令、版本、初始问题及实际结果见[验收记录](../docs/butcher-version/2026-10-16-0448-v1.0-Lesson133-134设计与验收.md)；不将重复复验累加为新的独立覆盖。

### Lesson135–136

独立题稿答案在[作答单](support/unit135136.js)。课内检查为unit135-136.spec.js、unit135-136-story-layout.spec.js、unit135-136-word-layout.spec.js；完整账号为login/unit135-136.spec.js，UNIT135_BROWSER=webkit切换引擎，AWARD_TEST_BASE分别/和/lesson/。故障助手先命中hotel-room.svg真实404，再验恢复；学习与奖励全走真实界面，不注入答案或星。运行条件、失败和复验见[设计记录](../docs/butcher-version/2026-10-16-0602-v1.0-Lesson135-136设计与验收.md)，重复执行不累加独立覆盖。

### Lesson137–138

独立答案见[作答单](support/unit137138.js)。课内unit137-138.spec.js、story-layout与word-layout检查；完整账号login/unit137-138.spec.js。UNIT137_BROWSER=webkit切换引擎，AWARD_TEST_BASE分别/和/lesson/。缺图先命中living-room.svg真实hash请求，再检查恢复；不注入学习／奖励结果。版本、运行条件和失败复验见[设计记录](../docs/butcher-version/2026-10-16-0730-v1.0-Lesson137-138设计与验收.md)，重复执行不累计独立覆盖。

### Lesson139–140

[独立答案](support/unit139140.js)与运行时题稿分开。课内unit139-140.spec.js、story-layout及word-layout，完整账号login/unit139-140.spec.js；UNIT139_BROWSER=webkit切换引擎，AWARD_TEST_BASE分别/和/lesson/。先命中phone-world.svg实际hash的404，再验恢复；不注入学习／奖励。失败、同版隔离与按影响复验见[设计记录](../docs/butcher-version/2026-10-16-0823-v1.0-Lesson139-140设计与验收.md)，重复运行不累计独立覆盖。

### Lesson141–142

[独立答案](support/unit141142.js)与运行时题稿分开。课内unit141-142.spec.js、story-layout、word-layout；账号login/unit141-142.spec.js。UNIT141_BROWSER=webkit，AWARD_TEST_BASE分别/与/lesson/。61题、17阅读步、18词卡、8组原例、28书写题51行。先命中train-carriage.svg的实际hash 404再验恢复，不注入学习或奖励数据；分页修改及全部验收条件见[设计记录](../docs/butcher-version/2026-10-16-0938-v1.0-Lesson141-142设计与验收.md)。

### Lesson143–144

[独立答案](support/unit143144.js)不取运行时题目答案。课内unit143-144.spec.js、story-layout、word-layout，账号login/unit143-144.spec.js；UNIT143_BROWSER=webkit，AWARD_TEST_BASE分别/和/lesson/。65题、13阅读步、24词卡、课题及8原例、28题50行打印；双空重试保留草稿，先命中woods-world.svg实际hash的404再验恢复。版本和复验范围见[单元记录](../docs/butcher-version/2026-10-16-1052-v1.0-Lesson143-144设计与验收.md)。

### Lesson23–24五星重构与材料、交接时序复核

[现行v3.1记录](../docs/butcher-version/2026-10-18-0349-v3.1-Lesson23-24材料与交接时序重构.md)承接v3.0。当前仍45题，R2／E8两道材料修订采用新身份，理解／综合会话为v153；词汇／语法／应用三组和奖励版不变。新增`e2e/unit23-24-v153.spec.js`核对短示范、原文回指、明确接收意图和简先拿候选杯组再换目标杯组；`e2e/unit23-24-v153-upgrade.spec.js`核对实际45题前版的空白、仅选、草稿、错答、分页、有效轮次与两道修订题未答。原文件冻结在`fixtures/unit23-24-before-v153/`，前版独立答案在`support/unit2324-before-v153.js`。

账号新增`login/unit23-24-v153-upgrade.spec.js`，默认45题前版→本轮；`UNIT2324_CHAIN_LEGACY=1`跑真实32题15星→45题五星→本轮同库链。原始本机记录可能是46条（含一条更早替换题），应按45题档案和32题档案分别核对，不能硬删至45条。服务器已同步档案不能替代本机原始快照；同ID新练习不改写旧档案。同账号另一设备核对三个未改runId／states、原姓名和两个原领取时间，原卡全部60帧及账本保持。实际复验与复用范围见本轮记录，不能把旧测试标题当作现行题量。

按[原v3.0记录](../docs/butcher-version/2026-10-17-0451-v3.0-Lesson23-24五星重构与验收.md)及上述本轮变更检查五区45题、30词卡、8段原文、10图／10问答、A6／B10、五十条32px书写线。独立答案在[support/unit2324-fivezones.js](support/unit2324-fivezones.js)，不读取运行时答案。课内文件为unit23-24-fivezones、fivezones-interactions、fivezones-upgrade、reading-controls、v153、v153-upgrade与print；UNIT2324_BROWSER=webkit覆盖另一引擎，PDF仅Chromium。声音故障同时计数实际play拒绝。

账号文件为login/unit23-24-fivezones、fivezones-upgrade，AWARD_TEST_BASE分别/和/lesson/；检查权限、五星、原日期、同账号换设备、纪念册、实际GIF、独立cast-jane-tray-v1.webp真实404及恢复。26题历史链在login/units17-30-upgrade的23–24项，34题历史链在login/unit23-24-tasks-upgrade；均经真实32题服务器再升级新五星。通用units1-30-tasks-upgrade的本课用上述三阶段专项承接原三设备契约，避免将新五区页面当旧15星断言。

原unit23-24、state、layout及units17-30历史套件使用冻结32题HTTP服务；直接改题测试也读冻结定义。未完成本机草稿与已同步成果分别验证，保留初始失败与对应复验日志。25–26曾作为15星管理样本是v3.0当时状态；现行72课均已五星，旧完成制管理检查使用真实冻结定义，不恢复旧奖励规则。23–24五星上限断言保留。

### Lesson25–26五星重构与原文依据、教学支持复核

[现行v3.1记录](../docs/butcher-version/2026-10-18-0429-v3.1-Lesson25-26原文依据与教学支持重构.md)承接原45题版。新增`e2e/unit25-26-v153.spec.js`检查R3／E3／E4未答原文、G11–G13短示范和真实帮助记录，以及五轮故事的手记显示；`e2e/unit25-26-v153-upgrade.spec.js`核对真实45题前版的空白、仅选、草稿、错答、词卡／叙述／两个分页、三个有效轮次及仅三题未答。冻结11个真实文件和独立前版答案，不能用27题文档代替本轮实际前版。

新账号文件`login/unit25-26-v153-upgrade.spec.js`默认45题前版→本轮；`UNIT2526_CHAIN_LEGACY=1`执行真实27题点击版→45题五星→本轮。分别比较本机46条（含被替换的旧六轮故事）、45题档案、27题档案、三个runId／states、原姓名及两代日期；原五星GIF全部60帧保持。新生换设备后不得出现虚构历史。普通手记的可选`copy.recordTargets`只改显示，未配置时原样显示，原record.target和题目／轮次签名必须不变；紧凑手记不在此次改动范围内。

[原v3.0设计与验收](../docs/butcher-version/2026-10-17-0545-v3.0-Lesson25-26五星重构与验收.md)记录45题、36词卡、12句叙述、8图／7双句、A4八空与B7十四行。独立答案在[support/unit2526-fivezones.js](support/unit2526-fivezones.js)。课内fivezones、fivezones-interactions、fivezones-upgrade、reading-controls、v153、v153-upgrade与print；UNIT2526_BROWSER=webkit，实际PDF仅Chromium。完整未答材料先核对，不能只跑正确答案；声音故障须计数真实play拒绝。

账号fivezones与fivezones-upgrade分别在AWARD_TEST_BASE=/、/lesson/运行；独立kitchen-room-v1.webp须真实返回404后再验恢复。四个更早版本（23题、30题、28题、键盘27题）在login/unit25-26-older-editions.spec.js经过真实27题点击版再升五星，承接通用旧测试的三设备契约，撤销此前“无正式学生”的本课历史豁免，不注入完成数据。

原unit25-26、state、layout、十三题型及共同交互旧版检查由冻结27题HTTP服务承载；新的五星题与旧15星断言分别验证。旧证书须核对原文字／日期／图像资源，以及原尺寸与object-fit等呈现结果；本课遗漏尺寸样式曾只在WebKit的PNG边缘表现为差异，隔离复现后修复并保留日志，未放宽像素断言。27–28／29–30曾作为15星管理样本是v3.0当时状态；现行72课均已五星，旧完成制检查使用真实冻结定义，25–26五星上限断言保留。
