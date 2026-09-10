# 探险猫 · 猫猫小镇

`codex/duolingo-version` 是当前 Duolingo 理念重构版的独立开发分支：新概念英语第一册 Lesson 1–144 编排为 72 个教材分区、354 个连续学习关卡，包含 1,573 个学习活动、991 段原文、73 组选做输入挑战（580 题）和跨课复习。

v6.1 加入旧记录兼容与恢复、统一审核答案、输入与地图性能优化，以及 Lesson 49–50 的六个主线语法输入任务和三类延后新句。实施边界、当前验收及全册待补齐项目见 [评审修复记录](docs/designs/review-repair-20260909/README.md)。

设计与实现以 [Duolingo 设计原则](docs/design-principles.md) 为首要依据；课程、题型、界面、交互与动效拿不准时，先查用户参考图或 Duolingo 实际做法。

## 本地运行

需要 Node.js 20 或更新版本。已使用的图片、字体、录音随仓库保存，产品运行不依赖第三方服务；开发验收使用 axe-core 和 Playwright（仅开发依赖）。

```bash
npm ci
npm run build:course
npm test
npm run dev
```

打开 <http://127.0.0.1:42817/>。本地预览与正式发布共用同一个首页生成过程；它只提供当前课程及依赖。修改后重新生成课程包、重启预览并刷新页面。

人工试听或试做时，使用独立于启动命令持续运行的本地预览：

```bash
node scripts/start-local-preview.js 42827
node scripts/check-local-preview.js 42827
```

打开 <http://127.0.0.1:42827/>。启动命令会检查已有服务，避免重复启动或替换其他服务；服务只监听本机。输出包含 PID，日志与启动信息保存在 `test-results/preview-42827.*`。结束人工验收后可对该 PID 发送正常的 TERM 信号。重建课程包后需停止旧预览，再运行启动命令。

健康检查会直接请求首页、跳级听音组句、九条新示范及 this/these 音频，并核对字节指纹和音频 Range 响应。只看到课程页面不代表预览服务在线：服务停止时，缓存仍能显示页面，但尚未下载的音频无法播放。故障复现与恢复记录见 [本地试听恢复](docs/designs/no-keyboard-learning/preview-audio-recovery.md)。

## 维护位置

| 目录 | 职责 |
| --- | --- |
| `content/learning-course.json` | 编译后的唯一运行时 catalog：课文、题目、角色、音频映射、顺序与复习规则 |
| `content/textbook-sources.json` | 第一册原文及对应教材 PDF 页码，用于防止重构时改变教材原句 |
| `content/expansion/` | 原文、中文释义、逐课蓝图与编译来源；前六课保留 fac029f 基线 |
| `content/book1/` | Lesson 51–144 原文、中文注释、教学与挑战蓝图、发音表、美术出处 |
| `content/grammar/`、`content/history/` | 语法试点题目与不可重写的已发布历史评分契约 |
| `core/` | 当前课程校验、路径运行、场景呈现、进度保存与课程包加载 |
| `poc/learning-path/` | 当前 HTML 入口、附加样式、新猫猫素材及生成的课程包 |
| `poc/lesson1-2-experience/` | 当前仍使用的共享页面、样式、猫猫和录音资源 |
| `assets/` | 当前课程所用图片、录音、字体及许可 |
| `docs/` | Duolingo 参考材料、现行设计、页面验收与发布记录 |
| `tests/` | 当前课程、记录兼容、音频控制、包完整性与预览检查 |
| `scripts/`、`deploy/` | 当前课程的打包、预览、单首页发布和部署说明 |

修改 7–50 课时先编辑 `content/expansion/`，51–144 课编辑 `content/book1/`，再运行 `npm run compile:course`，统一生成 catalog；页面只呈现和转发操作。录音生成请求使用冻结的 Kokoro 版本，具体操作与素材来源见第一册实施文档。`poc/learning-path/course-package/unit-catalog.json` 是去重传输格式，由 `core/course-catalog-wire.js` 无损还原，不直接修改。部分资源保留原路径以兼容已发布课程的地址与缓存；这些目录没有另一套可访问的旧课程。V3.6 测试快照仅验证现行产品的旧进度导入契约。

## 验证与发布

```bash
npm run test:media
npm run test:browser-media
npm run test:review-browser
npm run test:browser
npm run verify
node scripts/check-course-storage.js
```

音频检查需要 ffmpeg。以上流程先完整解码录音，再用原生浏览器验证播放、缓存与旧记录，随后检查四种尺寸中的每个活动；最后一个命令重建课程包、运行当前范围测试，并检查与当前代码绑定的浏览器可读性证据，然后生成 `dist/learning-path/`。发布过程要求所有输入与 Git HEAD 一致，因此修改和重新生成后应先提交，再运行完整发布验证；平时可先单独执行 `npm run build:course` 与 `npm test`。

发布包只含一个首页与必要资源。部署步骤见 [部署说明](deploy/README.md)。创建本分支不自动推送或重新部署；线上地址仍为 <https://www.canranstudio.cn/>。

### 浏览器防护网

课程逻辑测试通过，不能代替页面可读性验收。每次修改课程、样式、图片、入口或浏览器测试后，必须重新运行实际浏览器检查。

在 Codex 内置浏览器中运行同一套检查：

```bash
npm run build:course
npm run visual:serve
```

打开该命令输出的本地检查页。页面会用独立的测试记录自动走完课程，在四种屏幕尺寸检查对比度、图片、主题与主要按钮；结果存入 `test-results/readability-proof.json`。无需修改浏览器安全设置。

CI 或已经允许使用 Playwright 的本地环境：

```bash
npx playwright install chromium
npm run test:browser
```

两条路径运行同一个浏览器测试页面。`npm run build` 会拦截缺失、失败、不完整或过期的浏览器证据，CI 也会在每次推送和 PR 重新检查。自动检查后仍需按 [可读性验收规则](docs/designs/readability-guard/README.md) 查看实际页面截图。

## 文档

从 [文档索引](docs/README.md) 开始；[现行课程设计](docs/designs/lesson1-144/README.md) 说明节点与考察方式，[分支整理记录](docs/designs/lesson1-6-path-v4/branch-isolation.md) 说明保留范围和验证结果。当前工作树已移除旧网站、旧课程运行代码及无关文档，原始 Git 历史与其他分支保留。
