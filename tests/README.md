# 翻页纪念册正式接入（2026-10-09）

Lesson 1–2、3–4、5–6 现行规则为每单元五个答题区、整轮首次提交全部正确才获星，题量分别为 25／25／26。下方历史验收中的 15 星、填写姓名和领取弹窗不适用于这三门课；阅读完成与获星须分开验证。Lesson 5–6 的指代／冠词合为“介绍小工坊”，品牌／拼句合为“汽车小问答”，保留原题与旧链接兼容。

- `tests/login/award-book.spec.js`：临时真实学生的首星入册、三张卡、跨设备、课程关闭后的收藏、切换账号、未登录拒绝、失败重试、待同步上传、长姓名、四种宽度、真实翻页和 PNG。翻页／放大／导出不新增个人接口请求；同一套可用 `AWARD_TEST_BASE=/` 验证根目录部署。
- `tests/e2e/three-unit-awards.spec.js`：错答订正不补星、刷新不重置本轮失误、完整重练获星、已获星不撤回；冻结发卡前 HTML／内容／控制器，真实完成后升级，旧题记录和旧证书仍在，新版不自动获星。
- 三单元已有课程、账号、旧内容升级检查一起执行。旧录音 A04 检查改用冻结配音页面，继续检查实际播放结束、文件指纹和失败重试；现行无配音页面单独检查无英语请求。撤下的暂停按钮改为刷新后验证未提交选择，不跳过原目标。
- `tests/unit/award-collection.test.js`：服务器规则、分版本留存、学生隔离、重置保留和首次满星日期。

并行工作树可用 `LOGIN_TEST_PORT=4374 npm run check:commit`；账号检查的备份、迁址和旧版升级辅助服务会按相同偏移使用独立端口，来源校验也随之更新。该配置纳入检查结果缓存标识，不能复用另一测试地址的成功结果。课程测试仍按下方端口限制执行。

实施范围和未验边界见[纪念册正式接入与验收](../docs/award-version/2026-10-09-1322-v0.20-纪念册正式接入与验收.md)。浏览器自动检查不代替真实安卓微信保存图片、线上并发和正式发布验收。

# 老师体系（2026-10-09）

`node --test tests/unit/teachers.test.js` 验证老师 `字母＋1＋七位流水` 与学生 `字母＋0＋七位流水` 的独立编号、用户给定的三位老师示例、不可变工号及上限、拼音＋三位随机数（含前导零）、首次改密、初始密码失效／到期／重启／备份、启禁用、多对多关联与版本冲突、按当前班级授权、打印／单人／混合批量／转班／学习详情／课程预览及固定资源、异步批量期间撤权／转班／禁用的整批回滚、双身份资源访问及老师限流。

老师页面验证使用本地虚构账号：创建／编辑、拼音核对、多班分配、姓名／工号搜索、启禁用和密码重置、首次改密、无班级空状态、班级多老师、学习页、预览、保存失败保留草稿、同项并发冲突和独立字段保存；检查 320／390／1280 宽度、Esc 和焦点恢复，截图不含密码。共用入口和权限变化仍运行现有 `npm run test:login`；发布、手机真机、教师试用分别验收。设计和实际结果见 [管理系统／老师体系设计与验收](../docs/管理系统/老师体系设计与验收.md)。

# 学习进度管理（2026-10-08）

`node --test tests/unit/admin-learning.test.js` 验证现行 21 门课、未开始／学习中／已完成三态、零星作答、独立星星规则、必做阅读、未提交隔离、重复／乱序同步、旧内容和重开隔离、课程关闭与转班、多状态并集筛选、星星升降序、同星按学号排序、先排序后分页、最近有效学习时间及 HTTP 权限；原跟进接口已撤下。浏览器检查四列名单、表头姓名／学号搜索、多状态筛选弹层、表头星星排序、跨页顺序、条件标签清除、键盘／Esc／点击空白关闭、学习时间、详情／返回／刷新、旧链接、错误重试及桌面／窄屏布局。时间单元检查覆盖访问／重复同步不计时、零星重试计时、课程范围、关闭与重开隔离及旧成果时间未知；实际浏览器和历史零星真实作答验证见实现记录。[实现与验收说明](../docs/butcher-version/2026-10-08-学习进度管理实现与验收.md)。共享账号、同步与样式修改仍按 `check:plan` 的相关范围验证。

# 新版纪念卡迁移（2026-10-08）

Lesson 1–2 当前仍为25题无配音课堂版，原找物与拼句合并后共五个答题区，按整轮零错计星。`unit1-2-award.spec.js`、`unit1-2-certificate.spec.js`、`unit1-2-award-migration.spec.js` 验证错误／重练、旧进度、五星日期、卡片及独立练习纸；`tests/login/unit1-2-award.spec.js` 用临时账号验证姓名、离线同步、不同学生、换设备、重开、真实PNG、长姓名与导出失败重试。通过 `LOGIN_TEST_PORT` 独立选端口，`AWARD_TEST_BASE=/` 可追加网站根目录验收。

共用题目行为回归使用 `unit-thirteen-types.spec.js`、`common-interactions.spec.js`、`retry-feedback.spec.js` 和导航／综合挑战检查。Lesson 1–2 的旧15星验收不再代表当前奖励规则；其余课程仍沿用原实现。实际结果见 [奖励设计与迁移](../docs/award-version/README.md)，提交、推送、发布与真实手机验收另列。

# 共性交互修复（2026-10-06）

现行规则见 [统一标准 v1.29](../docs/butcher-version/publish/2026-10-08-1341-v1.29-教学单元设计标准与验收清单.md)。Lesson 1–40 的 20 个单元均为无配音版，Lesson 49–50 及 Lesson 49 保留原配音模式。

- `common-interactions.spec.js` 验证 20 个无配音单元的手机／桌面课文三态按钮、精简进度、全页无玩法／暂停／键入题；从真实旧暂停和原输入版通关记录验证直接续做、改题重答与证书纪念保留。
- `unit-thirteen-types.spec.js` 文件名沿用最初试排；当前验证点击版，两课仍为 25／27 道题、实际覆盖 10／12 项。E07 已撤下，测试不再要求英文输入框。
- 旧玩法弹窗检查改为教学例句或学习手记；旧暂停测试继续核对刷新后的未提交选择、错误和进度，不能删除学习状态断言。冻结前版仅在测试路由内使用。
- 共用控件还需回归 `retry-feedback.spec.js`、`l49-focus.spec.js`、受影响单元布局与登录成果；运行结果见本次修复记录。以下早期记录保留为历史，不作为当前题数和声音模式的判据。

# 怎样检查修改

2026-10-07 上线前验收范围：用户确认当前尚无正式学生，五项历史课程升级用例不纳入当前验收：`units1-6-exam-upgrade.spec.js` 的 Lesson 1–2、3–4，`unit11-12-upgrade.spec.js` 的 classroom、short-exam 两项，以及 `units17-30-upgrade.spec.js` 的 Lesson 25–26。它们明确标为跳过（skipped），不计为通过；测试内容和运行时迁移逻辑保留。新学生创建、首次改密、正常学习、刷新与跨设备同步、密码重置及备份恢复仍照常验收。

班级访问分支另运行 `npm run test:login`（4181 端口，备份恢复 4194、公开缓存迁移 4195、学习卡升级 4196）。现行测试覆盖真实学号登录、首次强制改密、老师查找/重置、主动改密、多音字校正、同名不同号、旧码停用与成绩迁移，以及原管理、权限、缓存与成果同步。此前 21 个不同页面行为用例的两轮结果见[账号验收](../docs/butcher-version/2026-09-25-1151-v1.1-学号密码实施与验收.md)。本次新增 3 个设置弹窗用例：`npm run test:login -- tests/login/settings.spec.js` 覆盖全部十六个单元的桌面／手机居中、文字对比度、窄屏确认、关闭保留操作及切换／退出，详情见[弹窗修复记录](../docs/butcher-version/2026-09-25-1643-v1.0-学习设置弹窗修复与验收.md)。`npm run build:login` 核对当前二十一个受保护单元；本分支的 `build:static` 拒绝发布。以下无身份旧课件测试只用于内部教学／缓存回归，不能当作生产权限验收。完整发布还需真实手机与线上检查。

账号安全回归：`npm run test:login -- tests/login/security.spec.js tests/login/student-accounts.spec.js tests/login/recovery.spec.js`。覆盖拼音加三位随机数字的初始／重置密码（含前导零、同拼音新账号不重复）、并发重放、到期／重启不续期、旧库迁移、待领取凭据的备份恢复、真实页面打印和找回流程，以及代理来源分桶、伪造头与等价地址防绕过。使用临时虚构账号，不读取或改动真实学生数据；实际 Nginx 和手机微信验收另列。

班级设置专项：`npm run test:login -- tests/login/class-settings.spec.js`，验证班级独立改名及即时刷新、课程全选／取消全选与计数、保存成功弹窗、键盘关闭和焦点返回、320／390／1280 宽度、保存期间防重复提交、失败保留输入与重试，以及部分更新不覆盖另一项设置。后台接口和课程权限同时回归 `access.spec.js`、`security.spec.js`；原有页面用例明确关闭成功弹窗后继续操作。

打印窗口另外验证：在普通 Chrome 中点“打印账号”，确认实际打印预览打开，随后取消；A4 PDF 导出不能替代这个检查。`student-accounts.spec.js` 还模拟内置浏览器的 `window.print()` 静默返回，确保页面显示改用 Chrome／Safari 的提示，按钮可重试。

账号批量操作：`node --test tests/unit/admin-accounts.test.js tests/unit/server-security.test.js`，核对新建／重置密码为拼音加三位数字（含前导零）、同拼音新账号不重复、单人／批量重置的会话撤销、未选学生与成果保留、失败整批回滚、并发改密和管理员指定密码的标准输入路径。页面另检查“所有学生”／班级／搜索的全选、半选、取消、确认、手机宽度，以及重置后的旧密码拒绝和首次改密。A4 导出实际 PDF：普通账号每页 10 张，长字段每页 6／4 张，不缺人、不重复、不跨页裁切；账号页验证本地 Maple Mono NL 字体成功加载，目视检查大小写及 `I/l/L/1`、`O/0` 字形。相关课程选项数量只统计 `#courses`，不把学生选择框计入开放课程。

security-version 另有 `node --test tests/unit/server-security.test.js tests/unit/preview-security.test.js`，验证授权记录有界、旧 token 保留、持久登录冷却、限流记录容量、私有文件权限和预览路径隔离。账号专项增加跨来源/重启冷却、老师恢复和真实浏览器 CSP；预览修改连同 `course-loading.spec.js`、`lesson-deployment.spec.js`、`landmark-review.spec.js` 检查正常路由。真实 Nginx 模板检查为 `NGINX_BIN=/实际路径/nginx OPENSSL_BIN=/实际路径/openssl node --test tests/deploy/login-nginx.test.js`，未配置二进制时明确跳过。详见[安全加固方案](../docs/security-version/2026-09-28-安全加固方案与验证.md)。

`test:deploy` 中旧 `buildStatic` 使用独立的公开课程测试目录，验证输出白名单、文件摘要和干净的 Git 版本；不能再把当前账号版仓库作为匿名公开站点来构建。另有真实命令检查，确认当前仓库拒绝 `build:static`；账号版发布清单使用 `build:login`，实际登录与资源权限由账号页面和正式服务验收。

多个工作目录同时验收时，课程检查可通过 `COURSE_TEST_PORT=空闲端口 npx playwright test ...` 选择独立端口，现行缓存、导航、跨窗口和公开边界检查均跟随该配置。账号检查另设 `LOGIN_TEST_PORT`，辅助服务随之偏移。不要结束其他会话占用端口的进程。

Lesson 3–4 现行为无配音课堂配套版，共 25 题；前置场景见[无配音优化与验收](../docs/butcher-version/2026-09-25-0148-v2.0-Lesson3-4无配音优化与验收.md)。`npx playwright test tests/e2e/unit3-4` 检查全声音失败通关、零英语请求、25 张音标词卡、完整原文、柜台正确确认后才交接、旧真实记录迁移、窄屏、缓存与 PNG／A4。`unit3-4-umbrella.spec.js` 另按[已确认分镜](../docs/butcher-version/2026-09-25-1607-v2.2-Lesson3-4雨伞叙事与验收.md)验证三把伞的出现时机、身份不变的交接、快速点击与重演、减少动态效果和缺图／断网恢复；正常动画与减少动态效果分别在实际浏览器检查。历史配音检查已收至 `tests/fixtures/unit3-4-voiced-before/`。共享题目草稿迁移仅接受明确前一版内容，不从历史成绩填答案；需连同 `unit-dedup.spec.js` 和 `l49-v110-defenses.spec.js` 回归。

Lesson 1–2 当前场景样板见[设计与验收](../docs/butcher-version/2026-09-24-0121-v2.0-Lesson1-2场景样板与验收.md)，共 29 道练习。`npx playwright test tests/e2e/unit1-2` 覆盖原有流程与新增 `unit1-2-scene.spec.js`：归还前后的场景状态、未提交不交包、错答不推进、刷新与重练、对白不遮住手机上的人物按钮、旧记录升级及 `/lesson/` 资源路径。`tests/fixtures/unit1-2-scene-before/` 保留真实旧内容与页面行为，只用于升级验证。

[对白与道具优化 v2.1](../docs/butcher-version/2026-09-24-1312-v2.1-Lesson1-2对白与道具优化.md)的布局回归连同 `unit-themes.spec.js` 执行：检查短句、长句、历史翻译、内部重听、人物与手提包的间距及已归还比例。最终落位在反馈动画结束后测量；页面截图仍需目视复看。`assets/unit1-2/handbag.svg` 也用于 Lesson 11–12 的认领小画册，修改图标须复看该处。

[人物与场景优化 v2.1](../docs/butcher-version/2026-09-25-1136-v2.1-Lesson3-4人物与场景优化.md)增加 `unit3-4-scene.spec.js`：检查人物不再过小／悬空、雨伞实际交到客人手边、错答及未提交不交接、刷新与重练、中文展开不裁掉当前句；带加载页的入口还会模拟较慢图片解码，确认刷新后当前句与保留进度一致。截图在 `output/playwright/unit3-4-scene/`；仍须实际目视复核，不能只凭尺寸断言判定美观。

统一标准 v1.29 将功能与视觉验收分开：除题目去重，还要对照相邻单元的场景与任务，复看角色、道具、短／长对白、作答前后和每个结束页。新单元依据自己的教学内容建立页面预期；样板用例通过不代表其他单元已通过。

网页加载与缓存的行为清单单独见[缓存方案 C01–C15](../docs/butcher-version/publish/2026-09-24-2031-v1.0-网页加载缓存设计.md#7-页面行为验收清单)。实现覆盖首访完整图片、重启复访、弱网失败、缓存缺失、更新与旧页并存、子目录隔离及实际证书。缓存专项运行 `npx playwright test tests/e2e/course-loading.spec.js tests/e2e/course-cache-updates.spec.js tests/e2e/course-cache-journeys.spec.js tests/e2e/lesson-deployment.spec.js`；最后一次真实结果见缓存文档，不把单元旧测试当作缓存证明。

先按[统一标准的模式对照](../docs/butcher-version/publish/2026-10-08-1341-v1.29-教学单元设计标准与验收清单.md#先确定本单元采用哪种模式)确定本次范围：两种模式都验证第 8.1 节；配音版追加第 8.2 节，无配音课堂配套版追加第 8.3 节；切换模式或升级内容再加第 8.4 节。无配音版须验证全部声音失败仍可完成、零英语配音请求与零系统朗读，反馈音另在正常环境验证。停用录音的播放项记不适用，历史待听审状态保留，不算通过。

错答反馈统一按[现行设计标准](../docs/butcher-version/publish/2026-10-08-1341-v1.29-教学单元设计标准与验收清单.md)验收。运行 `npx playwright test tests/e2e/retry-feedback.spec.js tests/e2e/l49-focus.spec.js`，覆盖 23 个现行课程入口的短反馈、原题重试、不高亮／朗读答案、灯泡不以解析兜底、真实空格及旧记录衔接，也覆盖 Lesson 49 和 49–50 分拣题从错答到原题重试的手机滚动位置。课程和共享练习改动会自动加入包含两份测试的 `browser-retry-feedback` 检查计划。历史测试中“答错显示正确答案”或“答错直接继续”的预期已经失效；不能为了保留旧断言恢复泄题或跳题。

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

CI 保留完整检查，同分支的新版本会取消过时检查。正式发布只接受目标版本自己的有效结果，并完成下列实际页面和线上检查。

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

Lesson 9–10 当前为[综合挑战无配音版 v2.1](../docs/butcher-version/2026-09-26-1732-v2.1-Lesson9-10综合挑战与验收.md)。运行 `npx playwright test tests/e2e/unit9-10 tests/e2e/units9-12-classroom.spec.js --grep-invert 'Lesson 11'`，本课共 44 项：14 句、33 题（挑战 10 题）、22 张音标词卡、问候分镜、六组观察示范、无声通关、重试不泄题、末题不代答、四种宽度、中文展开不裁切、正确回应不推移按钮、旧链接、真实 PNG 及 A4。挑战的新增 8 项按独立教材题稿逐题作答，核对首次／提示／修正、长选项与五词块、暂停、旧三题升级和离线草稿。打印保留 A 六题／B 十二题；页数检查不能代替目视验收。

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

发音要求统一看[设计标准第 6 节](../docs/butcher-version/publish/2026-10-08-1341-v1.29-教学单元设计标准与验收清单.md#6-声音插图与资源)。素材排查是只读诊断，不替代课程的页面行为测试或人工听审，也不自动改录音、提交或发布。

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
