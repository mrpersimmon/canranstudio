# 正式发布核对摘要

[发布记录](../../2026-10-21-0147-v1.0-Lesson1-144正式发布与数据保护.md)区分已部署版本、数据保护、隔离功能检查、线上匿名访问检查和未覆盖事项。

- `release-verification.json`：实际运行版本、切换时间、关键表计数与一致性、备份位置、历史成果及课包验证。
- `package-summary.json`：固定上传包的提交号、文件数及 SHA-256。
- `public-after.json`：93 项正式站 HTTP 检查，包括全部课程入口、受保护 API、入口字节及旧练习站保持不变。
- `live-browser-summary.json`：正式站手机尺寸登录页面和未登录末课访问限制。
- `stage-continuation-summary.json`：新浏览器会话中精确原日期、五星及末课检查。
- `stage-first-course-mobile.png`、`stage-new-keepsake.png`、`stage-cross-device-album.png`、`stage-last-course-mobile.png`：仅含隔离测试账号的页面。
- `live-student-entry-mobile.png`、`live-admin-entry-mobile.png`：无个人数据的正式登录入口。

首次准备和完整目录失败保留在本机原日志中；上述摘要不代表所有隔离测试命令通过。正式网站真实账号登录尚待独立网站凭据，真机检查另行执行。
