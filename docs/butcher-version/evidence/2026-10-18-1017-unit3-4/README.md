# Lesson3–4 · v1.54重构证据

对应[本课设计](../../2026-10-18-1017-v3.1-Lesson3-4原文依据与历史成果保护.md)。本轮基线在工作目录`output/unit34-review-20261018/baseline.json`，区分此前累计未提交修改。用户未要求提交、推送或发布，本轮没有执行这些操作。

最终按条件去重：**71项浏览器条件通过、40项Node检查通过、26项源码／素材／文档核对通过**。这些数字只覆盖下述范围；首轮失败、WebKit离线页面未验证及一次重启异常仍保留，不用最终通过数字掩盖边界。

## 范围与复验入口

- 静态课程：`tests/e2e/unit3-4-v154.spec.js`与`unit3-4-v154-history.spec.js`，Chromium和WebKit；四宽320／390／768／1280、两短屏320×568／390×500、全部33题、两种纸证和打印。
- 保留原语法、分镜、三伞与升级检查：`unit3-4-grammar.spec.js`、`unit3-4-scene.spec.js`、`unit3-4-umbrella.spec.js`、`unit3-4-upgrade.spec.js`。只修改受当前表现层或真实就绪边界影响的预期，不删除交接／判分／原日期断言。
- 账号：`tests/login/unit3-4-v154-account.spec.js`及`unit3-4-v154-upgrade.spec.js`；前者同时加载原`unit3-4-grammar.spec.js`两个完整账号流程。两引擎分别运行根目录和测试子路径，隔离临时班级／学生／数据库。
- 服务器与共用契约：progress、award-collection、award-handoff、course-catalog、home-catalog及admin-learning共40项Node检查。
- 构建：`LESSON_BASE_PATH=/`与`/lesson/`下各72课包；与上一轮1–2构建对照，本课以外71份课程清单保持不变。构建是本地核对，不是发布。

PowerShell复验设置`COURSE_TEST_PORT`／`LOGIN_TEST_PORT`避免占用4295预览；专项引擎用`UNIT34_REVIEW_BROWSER=chromium`或`webkit`，账号路径用`AWARD_TEST_BASE=/`或`/lesson/`。运行命令如下，具体本轮分组及首次失败日志保存在`reports/`。

```powershell
npx playwright test tests/e2e/unit3-4-v154.spec.js tests/e2e/unit3-4-v154-history.spec.js
npx playwright test tests/e2e/unit3-4-grammar.spec.js tests/e2e/unit3-4-scene.spec.js tests/e2e/unit3-4-umbrella.spec.js tests/e2e/unit3-4-upgrade.spec.js
npx playwright test -c playwright.login.config.js tests/login/unit3-4-v154-account.spec.js tests/login/unit3-4-v154-upgrade.spec.js
npm run build:login
```

[validation.json](validation.json)按引擎、挂载、文件与标题去重，记录每个条件最后一次结果、原报告及耗时；诊断脚本不计作正式课程覆盖。[source-checks.json](source-checks.json)核对31道未改题、两道新身份、真实前驱、奖励、素材、字库、共享组件和文档链接。[font-check.json](font-check.json)记录433份文字输入、1931个已有字形、0缺字；字体及许可证字节未改。

## 原失败与处理

| 首次现象 | 定位及处理 | 证据边界 |
| --- | --- | --- |
| 首页仍为五张旧图，理解未答缺原文，可见短示范未记帮助 | 新版入口复用确认卡图；两题加材料和新身份；按真实可见示范记新提交 | `initial-red`→`first-green`→最终静态两引擎。原历史不追写。 |
| 手机新工作人员显小，取回伞面靠脸、外套裁切 | 源图透明留白与旧道具坐标不匹配；按真实轮廓限定本课CSS | 四宽最终截图逐一核对；没有修改共享角色组件或原奖励图。 |
| 参考区11张回应网格断言失败 | 实际是网格10张加礼貌表达1个雨伞原例；同时核对15个问句选择器 | 修改测试定位，不为计数重复新增例句。A4／B10原题、问答原例和两页PDF独立检查。 |
| WebKit旧证PNG有字形基线差异 | fonts.ready/check通过仍出现首次canvas度量不同；显式准备原证实际中英字体后导出 | `legacy-png-isolated`及字体诊断留存；最终`layout-history-final-webkit`无诊断预热，两版PNG原像素通过。 |
| 同库旧纸证站首页缺图 | 原课程包搭配了新版首页素材引用；冻结真实旧首页片段 | `upgrade-isolated-chromium`复现，`upgrade-final-chromium-root`通过。修测试旧站契约，不改变产品资源权限。 |
| WebKit刷新后5秒找不到题目 | 错误快照仍是课程准备层，尚未挂载内容 | 明确等真实课页就绪，再检查原选择、错答、次数；保持一般内容断言原时限。 |
| WebKit断网reload报internal error | Worker已activated且controlled，但导航失败后保留原文档，未进入Worker离线页；独立小流程复现且联网后第2题恢复 | 保留精确平台错误分支，另用实际阻断enter接口验证门禁、重试及原草稿恢复。Chromium仍执行原离线页面断言；不能称WebKit的Worker离线页面已通过。 |
| Chromium子路径原卡同库重启一次“联网后再进入” | 首轮失败保留，原断言单独重跑通过，未修改产品存储、权限或等待阈值 | `account-chromium-sub`与`card-sub-isolated`；底层原因未确认，不代表任意并发稳定性验收。 |

WebKit断网诊断保存旧文档并不等于重新进入获授权课程。正式测试在遇到该精确浏览器导航错误时，确认仍在原第2题；联网后另令进入核验请求真实失败，确认课内节点没有挂载，解除故障并重试才恢复记录。此结果与Chromium的Worker离线提示页分开报告。

进入核验故障首轮使用page.route未触达Worker拥有的请求，准备页因此不能当作门禁失败。改用既有测试服务器HTTP故障注入，记录enter真实503后再检查界面；根路径和子路径均已通过。诊断配置最初的目录定位、临时定位器重复及端口占用保留在工作目录日志中，不计为课程功能失败或正式通过条件。

## 目视与真实成果

[截图汇总](index.html)保存首页、封面、词卡、关键对白、柜台、卡面、短屏及真实预览。图片成功解码、文件摘要和DOM尺寸不是美观结论；本轮查看关键画面及全部四张PDF页面。课文开场为原英文问题与中文提问，默认无剧情结论；对白与人物同场，回收的伞及外套不遮脸、不越边。

`sources/`保存课本PDF39–42、同步导学21–22、语法册19–23实际渲染页。材料正文和每道题未答内容另存`unanswered-materials.json`。完整提示词及原图来源在[新人物素材记录](../../../../assets/unit3-4-current/README.md)。

旧25／27题纸证均通过真实冻结旧页作答、填写测试名并领取，再升级；旧33题五星卡及旧25题纸证另做同库账号与跨设备。没有写入假五星或伪造原领取时间。PNG比较同引擎前后所有像素，五星GIF比较60帧，日期比较原ISO精度。页面样例中的“小伞”是临时验收学生，不是用户真实旧证。

实际PDF位于项目`output/pdf/lesson3-4-writing.pdf`、`lesson3-4-classroom25-certificate.pdf`、`lesson3-4-voiced27-certificate.pdf`。两页练习纸、各一页旧证均已渲染目视；原证内容、姓名、日期不改。实体打印尚未完成。

原预览服务复用`output/login/unit91-92-preview-data`，更新前备份SQLite及card-key；[升级后核对](preview-data-check.json)比较原12条学习记录、12条奖励及密钥，不重新创建用户、不清记录、不替实际预览学生答题。

实际预览首次命中原缓存，使用已有`course-retry=1`入口更新包后，核对新版封面及原英文开场问题，保存截图并保持课程打开。没有清空缓存来代替升级验证，也没有改变原数据库行；本轮更新后的原12条学习、12条奖励和密钥摘要全部一致，SQLite完整性正常。

## 未覆盖与状态

教师审阅、儿童试用、真机微信、实体打印、完整发布验收及专门的性能压测未做。WebKit的Worker离线提示页受上述本机运行时导航行为影响，未验证；进入核验失败及联网恢复已分别核对。一次临时重启访问失败的根因仍未确认。

未改变的共享运行时、原字库和其他71课包采用摘要对照及相应局部回归，不宣称全站重新验收。`check:plan`针对工作树已有七千余修改给出累计范围；本轮实际检查按本次基线选取，未执行普通提交或正式发布。提交：未执行；推送：未执行；发布：未执行。
