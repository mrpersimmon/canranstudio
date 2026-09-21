# 怎样检查修改

需要 Node.js 20 或更新版本。首次检查前，在项目根目录运行：

```bash
npm ci
npx playwright install chromium
```

浏览器测试会自己启动本地网站。运行前停止占用 4173 端口的预览服务。

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

Lesson 1–2 的检查用 `npx playwright test tests/e2e/unit1-2`：覆盖教材七句、全部 27 题、词卡、38 个真实录音、重试、刷新、窄屏、证书与导航隔离。课件功能只走浏览器行为；语音合成质量、教师内容验收与儿童试用另行记录。证书共享修改时，连同 `unit49-50-certificate.spec.js` 回归；导航与子目录修改时，连同 `butcher-navigation.spec.js` 和 `lesson-deployment.spec.js` 回归。

Lesson 3–4 的检查用 `npx playwright test tests/e2e/unit3-4`：覆盖 12 句课文、全部 27 题的真实流程、63 个录音原生结束、失败重试与历史点读、词卡音标、暂停与刷新、窄屏、证书及练习纸。`unit3-4-reply.spec.js` 另验接力四题的不同判断、旧十题不代答新题、保留其他活动记录；旧版本通过页面作答建立进度。预期来自教材和独立题稿；导航改动连同原两单元入口检查。听音回调观察不替换真实播放器，下载 PNG 与打印 PDF 仍需目视复看。

Lesson 5–6 的检查用 `npx playwright test tests/e2e/unit5-6`：从独立题稿验证 20 句原文、27 题、24 张配套音标词卡、80 段录音真实结束、历史点读与失败恢复、错答和提示记录、四种宽度、键盘、证书图片与 A4 练习纸、首页独立继续和 `/lesson/` 路径。导航改动同时回归 `butcher-navigation.spec.js`、`unit1-2-navigation.spec.js` 和 `lesson-deployment.spec.js`。不把原生播放成功当成人工发音验收。

重复题整改用 `npx playwright test tests/e2e/unit-dedup.spec.js`：覆盖三单元新题、基础拼句到完整接力的顺序、综合挑战、分拣只回练错题，以及真实旧题稿升级后不代答、未改活动保留。历史题稿放在 `tests/fixtures/unit-dedup-before/`，只用于隔离的浏览器升级检查；课件从当前内容加载。完整流程分别验证 27、27、73 题，并回归 `l49-v110.spec.js`、`l49-v110-defenses.spec.js`，确保 Lesson 49 单课的十二题与原回练规则不被组合单元修改。题目必要性仍需按统一标准人工审稿，不能靠程序数题代替。

其中 `unit1-2-navigation.spec.js` 检查新学习先图鉴、旧章节地址与独立继续；`unit1-2-vocabulary-standard.spec.js` 逐卡检查 21 条按词典核对的音标、翻面与窄屏，`unit1-2.spec.js` 验证听辨后进入课文、理解和后续练习以及证书徽章顺序。词典标注检查不等于人工发音听审。

修改封面继续、章节定位或路由时，另运行 `npx playwright test tests/e2e/unit-resume-scroll.spec.js`：覆盖两单元在根路径和 `/lesson/` 的桌面、手机、手动滚回封面、连续继续、键盘、浏览器返回和未提交选择恢复，并对照 Lesson 49。必须检查目标标题进入可视区域，不能仅以地址正确判断跳转成功。

两单元的主题或容器修改，另运行 `npx playwright test tests/e2e/unit-themes.spec.js`：检查冷暖区分、选项平等、文字对比、旧作答恢复，以及 320 / 1100 像素下的人物位置、对白和翻页操作。保存图片的主题还由两单元证书流程与页面配色交叉核对。运行通过后，仍需对照设计稿目视检查真实页面和下载图片。

组合单元的领奖、长名字、手机布局、真实图片下载、图片失败重试与 A4 单页打印用 `unit49-50-certificate.spec.js`，和 `unit49-50.spec.js` 一起运行。准备记录来自完整页面作答，不伪造通关状态。

`/lesson/` 发布路径用 `lesson-deployment.spec.js`：检查导航与资源路径、原课程进度隔离、完整单元、证书、旧官网缓存下的录音，以及手机布局。

题目进度检查用 `l49-v115-progress.spec.js`：覆盖 Lesson 49 和合并单元的答对即时填绿、末题、错答、回练、重练、刷新、暂停和 320 像素窄屏。去重改变题量或分段时也必须运行：单课仍为十二题分拣、十题分段挑战；组合单元是十一题分拣、五题连续挑战，不能共用旧题量。它也会随 `test:l49:behavior` 执行。

## 怎样判断完成

命令结束且没有失败项，只说明对应自动检查通过。还需在真实页面检查题目意思、反馈、重听、重练、刷新恢复和小屏布局；真机结果填入[真机检查表](../docs/mobile-release-smoke-checklist.md)。

发布后用同一发布包运行 `npm run verify:live`，确认线上文件一致，详见[发布指南](../deploy/README.md)。

旧数据规则：Lesson 49、50 保留并限制有效星级；音标旧版只存总分，无法还原各关成绩，首次迁移到 v2 时归零。任何迁移都不能伪造新题的作答记录。
