# 纪念卡姓名与展示尺寸页面检查

2026-10-07-1633，codex/award-version，仅本地。

| 命令范围 | 结果 |
| --- | --- |
| COURSE_TEST_PORT=4250 npx --no-install playwright test tests/e2e/unit1-2-certificate.spec.js | 6/6 通过 |
| COURSE_TEST_PORT=4250 npx --no-install playwright test tests/e2e/unit1-2.spec.js tests/e2e/unit1-2-award.spec.js | 5/5 通过 |
| COURSE_TEST_PORT=4250 npx --no-install playwright test tests/e2e/unit1-2-navigation.spec.js | 6/6 通过 |
| LOGIN_TEST_PORT=4251 npx --no-install playwright test --config=playwright.login.config.js tests/login/unit1-2-award.spec.js | 1/1 通过，/lesson/ |
| AWARD_TEST_BASE=/ LOGIN_TEST_PORT=4251 npx --no-install playwright test --config=playwright.login.config.js tests/login/unit1-2-award.spec.js | 1/1 通过，根目录 |

合计 19 项；账号检查包含管理页创建临时学生、登录、获星、跨设备、姓名隔离、长姓名、刷新与重开、四尺寸 PNG 下载和导出失败重试。只通过页面行为与浏览器文件下载检查，不查询数据库或伪造获星状态。

先加入无填名入口检查，旧页面失败（仍有一个输入框），修复后通过。实际手机登录截图又暴露固定顶部留白不足，标题位置检查失败（标题 y=128，顶部栏高 158）；按实际顶部栏高度定位后通过。资产已被 Service Worker 缓存，网络拦截不能制造导出失败，因此改在浏览器 Canvas 导出边界模拟一次失败，不将缓存成功当成功触发故障。

所有网页截图为 Chromium、deviceScaleFactor=1；320/390 视口高 844，768/1280 高 720；长姓名截图高 900。实际卡片上限桌面 720、手机 340。source-current-comparison.png 左为已确认源稿卡片区域缩到 720×383，右为真实账号页面同尺寸卡片；用于核对画风与构图，页面占比以 award-compact-1280.png 完整视口为准。

PNG 保持 1640×880，姓名为临时测试学生。首次日期、五星金边未因显示缩小而改变。静态匿名预览仅显示登录后显示姓名，不能导出。

未测试真实手机或微信分享；未重新验证英语语音质量；未提交、推送或部署。
