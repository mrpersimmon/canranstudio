# Lesson5–6 · v1.54重构证据

对应[现行设计](../../2026-10-18-1134-v3.0-Lesson5-6语法重构与历史成果保护.md)。工作目录`output/unit56-review-20261018`保存基线及首轮日志，区分此前累计修改。本地开发完成不等于提交或发布。

最终按条件去重：**77项浏览器条件、40项服务器／目录／奖励检查、11项检查计划测试、32项源码／字体／素材核对通过**。首次失败和版本差异仍保留，人工待验项目不计为通过。

## 实际范围与复验

- 静态专项：`unit5-6-v154.spec.js`、`unit5-6-v154-history.spec.js`，Chromium／WebKit；四宽320／390／768／1280、短屏320×568／390×500、36题、24词、20句、七人出场、字体、原编号、纸笔和两种旧证。
- 原本课检查：`unit5-6.spec.js`、`unit5-6-layout.spec.js`、`unit5-6-classroom.spec.js`、`unit5-6-exam.spec.js`、`unit5-6-upgrade.spec.js`，Chromium；真实反馈音、旧配音中断、旧空回合、键盘、撤回、重试、路由别名、静态缓存断网及记录隔离。两条检查7–10共用旧人物的未改课程用例未重跑，原素材摘要不变，不计本轮通过数。
- 完整账号：`tests/login/unit5-6-v154-account.spec.js`及`unit5-6-v154-upgrade.spec.js`，两引擎分别在`/`和`/lesson/`；真实503、无Worker恢复、目录复访、2／4／2三卡、卡面重练、36题五星、1星及5星GIF、跨设备、身份隔离、开放页离线作答与进入核验失败恢复。
- 更早短综合：原`units1-6-exam-upgrade.spec.js`中5–6的两项静态升级和一项同库账号升级；1–2／3–4未纳入该次选择，不冒记通过。
- 服务器／目录／奖励契约40项Node检查，检查计划11项Node检查；两个挂载各构建72课包，另外71份课程清单不变。

设置`UNIT56_REVIEW_BROWSER=webkit`选择专项引擎，账号设置`AWARD_TEST_BASE=/`或`/lesson/`，用`COURSE_TEST_PORT`／`LOGIN_TEST_PORT`隔离服务。复验命令：

```powershell
npx playwright test tests/e2e/unit5-6-v154.spec.js tests/e2e/unit5-6-v154-history.spec.js
npx playwright test -c playwright.login.config.js tests/login/unit5-6-v154-account.spec.js tests/login/unit5-6-v154-upgrade.spec.js
npx playwright test tests/e2e/unit5-6.spec.js tests/e2e/unit5-6-layout.spec.js tests/e2e/unit5-6-classroom.spec.js tests/e2e/unit5-6-exam.spec.js tests/e2e/unit5-6-upgrade.spec.js --grep-invert '共用人物与汽车'
npx playwright test tests/e2e/units1-6-exam-upgrade.spec.js --grep '5-6 旧'
npx playwright test -c playwright.login.config.js tests/login/units1-6-exam-upgrade.spec.js --grep '5-6 旧'
npm run build:login
```

[validation.json](validation.json)按引擎、挂载、文件和标题去重保存最后结果、耗时及原报告，重复运行不累计覆盖；[源码核对](source-checks.json)及[现存文件改动](changed-existing-files.json)对照本轮基线。`reports/`保留首轮失败和复验。计划针对累计工作树，实际检查按本轮影响选取，未执行提交或正式发布验收。

## 首轮失败与处理

| 现象 | 定位、修复及边界 |
| --- | --- |
| 旧入口、缺特殊疑问句示范、理解无原文 | initial-red三项复现，实施后first-green通过。以真实26题为基线，不照旧README的30题。 |
| 中文按钮不可点；桌面人物与对白图框重叠 | 父级pointer-events:none及场景高度不足，限定本课修复，四宽原边界复验。 |
| 新词块填满仍不能检查 | 共用wordbank消费slots，三道新题补实际空位数，不改判分组件。 |
| 390×500按钮越界约17px | 压缩装饰高度，保持三卡与44px按钮，原尺寸断言通过。 |
| 截图定位到两个纪念卡 | 正文和浮层卡均合法，改用正文卡语义定位，不删产品节点。 |
| 账号入口多一张旧Sophie图 | 替换嵌套div残留旧图，服务端读取整个section。去除旧图及错误闭合，静态整个入口和账号实际图片复验。 |
| WebKit无声测试出现speechSynthesis不存在 | 36题已完成，异常来自测试初始化；先检测接口，仍要求play拒绝触达、零英语请求及全课完成。 |
| PDF英文弯引号间距异常 | 字体栈有Nunito但未注册，实际回退为Gothic；补font-face、实际加载检查及PDF目视，没有替换原文绕过。 |
| 图内标签仍是系统字体 | 十四幅SVG保留图形，另存Gothic500／Nunito600轮廓，页面和课包复验。 |
| 打印10号裁切、末页孤立一题 | 增加编号内缩，A和原例一页，B每页五题，30条32px线不减；旧测试两行预期更新为三行。 |
| Windows旧短综合账号无法创建文件符号链接 | 用文件复制、目录junction和真实单元目录；冻结匹配首页，清理前检查绝对临时根，原升级断言通过。 |

PNG同引擎前后逐像素比较，GIF比较全60帧，不要求跨浏览器字节相同。旧26题课堂版与27题配音版由真实冻结旧页作答、填测试名、领取后升级，不写入假完成数据。原26题五星卡另验同库、另一设备、当前新增内容完成后的原档案及精确ISO日期。

最后的实际预览复核将G1从复述示范问题的含义改为根据Toyota／Japanese资料回答，Mini示范保持。36题、21道旧题、判分组件和历史原件没有再改；`teaching-final-chromium`复验材料、真实作答、提示、旧26题保护及入口续做，完整账号在Chromium根路径和WebKit子路径再次直接覆盖新版G1。其余路径的已通过身份／旧证／升级检查按上述不变范围复用，不将前后版本混称同版隔离。

## 材料、字体与目视

`sources/`保存课本43–46、导学25–26、语法册24–29页图。`unanswered-materials.json`及36张未答画面核对必要材料；答案来自独立审定稿，不读应用答案字段。

[画面汇总](index.html)包括入口、封面、词卡、关键介绍、七人合影、应用、卡面、短屏、打印及真实预览。已目视手机／桌面代表画面及全部5页PDF；最终英文Nunito、引号及10号完整，人物无意外裁切。图像解码和页数不代替目视。

共享1931字子集保持原字节，本课补9字，0缺字；输入、源摘要与许可见[字库来源](../../../../assets/unit5-6-current/font-source.json)。十四幅[标签来源](../../../../assets/unit5-6-current/label-sources.json)与七名人物的内置imagegen[完整提示词](../../../../assets/unit5-6-current/README.md)分别留存。原卡、旧纸证、原SVG及共享语法／结算组件未覆盖。

最终PDF在项目`output/pdf/lesson5-6-writing.pdf`、`lesson5-6-classroom26-certificate.pdf`、`lesson5-6-voiced27-certificate.pdf`：三页练习纸、各一页旧证。旧证“小伙伴”为验收样例，不是用户真实证书。

## 预览及边界

完整账号预览`http://127.0.0.1:4295/`复用原`output/login/unit91-92-preview-data`，更新前备份SQLite及card-key。原13条学习、13条奖励与密钥对照见[预览数据核对](preview-data-check.json)。不重新建用户、不清记录、不替真实学生作答或领奖；通过正常更新／重试确认新课包。

实际预览首次仍命中六题工坊旧包，使用已有course-retry入口后确认十一题工坊与最终Toyota任务，保存首页、语法和封面截图。原会话过期时用原体验账号重新登录，没有重置密码或数据库；最后停在封面，继续入口仍回词汇起点。最终原13条学习、13条奖励及密钥摘要全部一致，SQLite完整性正常。

教师、儿童、真实手机微信保存、实体打印、完整发布验收及专门性能压测未做。共享缓存和另外71课包的不变部分按证据复用；前轮Windows WebKit断网整页导航限制未宣称修复，本轮直接验证开放页离线作答及真实进入核验失败恢复。

提交：未执行。推送：未执行。发布：未执行。
