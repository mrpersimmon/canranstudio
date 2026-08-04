# 十二城区图鉴唯一入口与阶段成长揭晓 · 发布 QA

## 范围

本候选把 `/` 收敛为“世界总览 → 暖灯集市 → 地标直达课程”两级图鉴，并为 Lesson 49–54 与音标专项接入同一套首次关卡成长揭晓、完整累计状态地标、永久纪念物、课程返回定位和地图变化汇总。

V1 继续是无需账号的公开静态站点，进度只保存在当前浏览器。授权码、账号、服务端进度和跨设备同步属于 V2，不在本次发布中。

## 可回查视觉证据

- 手机世界总览：`docs/designs/adventure-map/atlas-only-world-overview-phone.png`；
- 平板世界总览：`docs/designs/adventure-map/atlas-only-world-overview-tablet.png`；
- 课程内阶段揭晓：`docs/designs/adventure-map/growth-reveal-contact-sheet.png`；
- 七个已发布地标累计状态：`docs/designs/adventure-map/{lesson49,lesson50,lesson51,lesson52,lesson53,lesson54,soundmark}-state-snapshots-contact-sheet.png`。

七组地标逐一检查了 `state-0`、中期与完成态：固定画布、主体建筑、透视和外轮廓一致，每一阶段只增加对应课程内容，没有洋红背景、错图或未绘制地点占位；纪念物均与最后状态图独立。Lesson 51 的神庙与气象仪锚点另有自动几何相关性检查，历史 `lesson51-growth-contact-sheet.png` 与正式联系表保持逐像素一致，不能再显示被否决的错位样板。

## 自动化门禁

发布候选必须在其精确代码状态运行：

```text
npm run test:unit
npm run test:e2e
npm run test:deploy
npm run build:static
```

门禁覆盖：

- v1→v2 档案迁移不补发历史动画，首次 `0→正数` 只揭晓一次；
- 成绩先保存，揭晓无按钮、0.7 秒防误触、任意位置或键盘关闭、恢复焦点；
- 图片、音效、存储失败与设备旋转不形成学习死路；
- `/` 永远默认世界总览，非法返回参数安全降级；
- 城区只渲染 Lesson 49–54 与音标专项七个完整合同，无 Lesson 55–60 占位；
- 世界入口使用响应式完成态预览；直接进入城区不会下载隐藏入口图，城区底图使用 512/914 AVIF、WebP 与 JPG 回退；
- 带内容版本的地标状态图和地图底图使用一年 immutable 缓存，HTML 不缓存；
- 最近未完成地点推荐、名称牌进度印章、最终纪念物与一次性地图汇总；
- 390×844、768×1024、1024×768 无横向溢出，返回控件满足触控尺寸；
- 所有课程既有进度、题目、音频、证书与直达路由回归；
- Lesson 51 听音下一题在反馈期间预加载下一段录音；课文剧场只在当前录音真实 `ended` 后进入下一句，取消、错误和超时均不授予完成；
- 静态构建包含共享成长运行时和全部发布地标，清单绑定干净 Git 提交；
- 运行时无账号门、Cookie、身份字段、应用服务请求或跨域依赖。

候选的最终通过数量、发布 SHA、静态清单哈希与线上逐文件验证结果由发布执行记录和 `release-manifest.json` 绑定，不在本文硬编码自引用提交号。

## 人工移动设备边界

桌面自动化已覆盖手机和平板视口、横竖屏、减少动态效果、键盘、图片失败、音效失败与存储失败。真实华为 Mate 60 Pro+、微信内置浏览器、iPhone Safari、Android Chromium 与平板触控仍必须按 `docs/mobile-release-smoke-checklist.md` 执行；在没有真实设备操作证据时保持 `HUMAN_REQUIRED`，不得把模拟结果写成真机通过。

用户此前提供的华为 Mate 60 Pro+ 截图用于确认并修复城区左上角返回控件，但不替代本次完整发布后的多平台真机回归。

## 发布判定

只有自动门禁全部为零失败、静态构建绑定候选提交、远端 `main` 指向同一提交、服务器发布清单与本地逐文件哈希一致、线上入口和课程返回闭环可执行时，才可发布。任一真实设备后续发现 P0/P1，应停止扩课并优先回滚或修复。
