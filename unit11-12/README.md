# Lesson 11–12 · 失物招领小侦探

现行本地实现：[审视优化与综合验收 v2.1](../docs/butcher-version/2026-09-26-2113-v2.1-Lesson11-12审视优化与综合验收.md)。共用要求见 [统一设计标准](../docs/butcher-version/publish/2026-09-26-1521-v1.22-教学单元设计标准与验收清单.md)。

18 张音标词卡、16 句完整原文、30 道必做题（含十题综合挑战）、12 组替换参考；课堂模式不播放英语，也没有听完录音的门槛。反馈音可以播放，声音不可用不影响学习。

- `content.js`：教材内容、题目和完成签名，保留前置题与旧三题，新增七道认领综合任务。
- `scene.js`：三人认领舞台、白／蓝衬衫时序和作答证据；猜测不能直接归还。
- `unit.js`：阅读、词卡、档案翻页、真实进度与证书；历史真实记录保留。
- `unit.css`：本课浅蓝教室，人物与道具布局；四选项等宽两行两列，按钮沿用统一操作。

只通过真实页面操作验收。运行 `COURSE_TEST_PORT=4192 npx playwright test tests/e2e/unit11-12 tests/e2e/units9-12-classroom.spec.js --grep-invert 'Lesson 9'`。登录与换设备用临时账号环境，见 `tests/login/unit11-12-upgrade.spec.js` 和 `tests/login/course-integration.spec.js` 的 11–12 用例。

本地页面与正式发布分开。静态预览不包含登录服务；账号版仍由 `server/run.js` 提供登录、班级权限和服务器学习成果。
