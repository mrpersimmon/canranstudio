# Lesson 11–12 本地审视与实施证据

2026-09-26。分支 `codex/butcher-version`，独立目录 `/Users/permission/.codex/worktrees/butcher-version/canranstudio.cn`。方案及教材目标见[审视优化 v2.1](../../2026-09-26-2113-v2.1-Lesson11-12审视优化与综合验收.md)。本轮没有提交、推送或发布。

## 实看五步

| 步骤 | 审视依据 | 结果 |
| --- | --- | --- |
| 认领小图鉴 | [01-words.jpg](01-words.jpg) | 保留图文、音标、翻页；自动页面验证补足其余两组 |
| 认领小剧场 | [上半段](02-story.jpg)、[人物与操作](02-story-lower.jpg) | 三人、白蓝衬衫有区别；保留分镜；补修刷新路由与浏览器滚动恢复的竞争 |
| 物主不弄错 | [原布局](03-owner.jpg)、[新布局](06-owner-after.jpg) | 四个选项从三加一改为等宽两行两列；灯泡仍在检查左边 |
| 认领小画册 | [04-records.jpg](04-records.jpg) | 十二份可翻页档案保留，不强制重复作答；纸笔 A 四题／B 十二题保留 |
| 归还小挑战 | [原三题](05-exam.jpg)、[新十题](07-exam-after.jpg)、[第 4 题刷新续答](08-new-task.jpg) | 真实补齐认领表达链；总量 23→30；没有添加英语配音依赖 |

图像是实际浏览器视口。自动截图中部分长页面可受固定导航遮挡，不将截图外的区域视为通过；完整可操作性由真实滚动和逐题操作验证。手机检查采用 Chromium 视口模拟，不能替代真机／微信。教材纸页已在本轮目视核对；同画风参照沿用统一标准与 v2.0 的并排审视记录，不把图片好看等同于学会。

## 本轮验证结果

仅以页面实际作答、刷新、重开、下载和新设备登录检验产品结果；预期取自教材和独立题稿，不读取运行时答案，也不直接植入完成记录。账号、班级使用临时测试环境。

| 范围 | 结果与日志 |
| --- | --- |
| 十题开发前 | [01-red-exam.log](01-red-exam.log)：预期十题，旧版只有三题，真实失败 |
| 首条十题流程 | [02-exam.log](02-exam.log)：1 项通过，所有声音失败仍能作答，错答／提示／重练记录正确 |
| 四选项修复前 | [03-red-layout.log](03-red-layout.log)：第三项仍在第一行，真实排布失败 |
| 四宽度专项 | [04-layout.log](04-layout.log)：4 项通过，320／390／768／1280 的长选项、词块、按钮稳定及结束操作 |
| 首轮完整检查 | [05-courses.log](05-courses.log)：41 通过、1 失败（刷新对白离开视口）；[06-login.log](06-login.log)：2 通过、1 失败（新设备仅 12 星） |
| 对应排查 | [07-sync-recheck.log](07-sync-recheck.log)：再次复现成绩缺失；[08-reading-recheck.log](08-reading-recheck.log)：单次通过，表明滚动问题与时序有关，不用单次绿灯覆盖原失败 |
| 刷新修复 | [09-reading-stability.log](09-reading-stability.log)：连续 5 轮通过，每轮覆盖四种宽度 |
| 中文分段上传修复前 | [10-red-utf8.log](10-red-utf8.log)：浏览器原始上传内容不变，拆开当前完成签名中的一个汉字后，新设备仅 12 星，稳定失败 |
| 最终课程回归 | [11-courses-final.log](11-courses-final.log)：**42 项通过**，全课 30 题、16 句、18 卡、12 档案、重试不泄题、末题不代答、暂停、旧记录、断网、四宽度、PNG 与单页 A4 |
| 最终账号与升级 | [12-login-final.log](12-login-final.log)：**3 项通过**，新账号全课，以及两种旧三题版本从旧服务器迁移到新服务器和新设备，12→15 星，姓名／原领证日期保留 |
| 共享接收修复的边界回归 | [13-account-boundaries.log](13-account-boundaries.log)：**8 项通过**，登录入口、课程权限、管理员建班、学生首次登录与改密、中文姓名、跨设备成果及重置边界 |
| 分段防御再确认 | [14-utf8-final.log](14-utf8-final.log)：1 项通过，并确认分段代理实际执行；属于上述账号升级用例的复验，不重复计数 |

最终合计 **53 个不同页面场景通过**（42＋3＋8）。`03-layout-invocation.log`、`03-layout-readiness.log` 是测试筛选与等待条件的调试记录，不是产品失败；`10-utf8-legacy-boundary.log` 是只拆到历史签名的一次对照通过，不能证明当前完成签名正确。

## 复验命令

```sh
COURSE_TEST_PORT=4192 npx playwright test tests/e2e/unit11-12 tests/e2e/units9-12-classroom.spec.js --grep-invert 'Lesson 9'
npx playwright test -c playwright.login.config.js tests/login/course-integration.spec.js tests/login/unit11-12-upgrade.spec.js --grep '11–12'
npx playwright test -c playwright.login.config.js tests/login/access.spec.js tests/login/student-accounts.spec.js --grep '未登录先看到|学号密码进入|管理员可以创建|已完成活动跨设备同步|完整无配音课程成果|手机核对多音字|重名学生独立|脚本不可用时'
```

三题历史页冻结在 `tests/fixtures/unit11-12-short-exam-before/`，不会发布。新增题的自动图像在 `output/playwright/unit11-12-exam/`；已目视四选项、长对白、320 宽词块和完成页。记录修复只改变请求收集方式：按字节限长，再一次性解码；身份、权限与完成证明校验未放宽。

## 状态与界限

- 本地方案、代码、教材核对、真实页面检查、当前预览已完成。
- 预览地址：[Lesson 11–12](http://127.0.0.1:4190/lesson/unit11-12/#learn/exam)。该静态预览仍不需要账号；账号功能在临时服务器另行实测。内置浏览器新缓存已显示十题和新四选项；内置浏览器另以键盘实际完成前三题，并刷新确认第 4 题仍为空白；完整行为验收以上述 Chromium 页面记录为准。
- 没有修改或清理线上班级、学生或学习记录；没有提交、推送、部署。
- 尚未覆盖真实安卓微信、iPhone Safari、读屏，以及教师和儿童实际试用；没有据此声称听力、自由表达或所有词项独立掌握。
