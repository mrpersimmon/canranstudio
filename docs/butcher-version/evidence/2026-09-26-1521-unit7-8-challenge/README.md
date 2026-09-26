# Lesson 7–8 十题综合挑战的本地证据

2026-09-26。分支 `codex/butcher-version`；本目录不证明提交、推送或发布。题稿、原因与范围以[实施记录](../../2026-09-26-1521-v2.1-Lesson7-8综合挑战与验收.md)为准。

- `01`：用户实际缓存预览，旧三题完成后从第 4／10 题继续。
- `02`：Lesson 7–8 全组 37 项页面检查；`03` 是其中 8 项在六词块布局修正后的重跑，不相加。
- `04`：首次缓存接管与登录／旧公开页面迁移，9 项。
- `05`：选定缓存更新和加载路径，7 项，不代表缓存全套或真机验收。
- `06`–`10`：320 与桌面词块、his／her、缩写及 390 完成页。区域截图顶部可能被固定导航遮住，只用来复看题目区域；完整顶栏／进度另看 `01` 与行为断言。
- `11`：最终元信息保存规则下的 12 项账号回归。
- `12`：旧完成用户点击证书继续按钮后到第 4 题。
- `13`：旧三题升级换设备、主动重开清空成绩及姓名，各连续 3 次通过。只是在有过间歇失败的路径做有界复查，不宣称任意设备或网络都已经验证。
- `red-*`：本轮修改前或中间发现的失败，保留追溯；不使用带身份请求的原始追踪包作为公开证据。

复查命令（在独立工作树执行；临时虚构账号，不读写真实学生数据库）：

```sh
COURSE_TEST_PORT=4192 npx playwright test tests/e2e/unit7-8
npx playwright test -c playwright.login.config.js tests/login/portal-worker.spec.js tests/login/root-mount.spec.js tests/login/recovery.spec.js --grep '首次缓存|旧公开缓存|根目录真实登录|新版首页更新|课程直链'
npx playwright test -c playwright.login.config.js tests/login/course-integration.spec.js tests/login/unit9-10-upgrade.spec.js tests/login/unit11-12-upgrade.spec.js tests/login/unit7-8-exam-upgrade.spec.js tests/login/access.spec.js --grep '7–8|旧服务器|成绩|证书|成果|重开'
npx playwright test -c playwright.login.config.js tests/login/access.spec.js tests/login/unit7-8-exam-upgrade.spec.js --grep '完整无配音课程成果|7–8三题旧服务器' --repeat-each=3
```

真实移动设备、教师／儿童对题干负担的接受度和正式发布验收仍未完成。
