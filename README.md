# 探险猫 · 猫猫小镇

`codex/duolingo-version` 是当前 Duolingo 理念重构版的独立开发分支：新概念英语 Lesson 1–50 编排为 25 个教材分区、129 个连续学习关卡，包含 576 个学习活动、349 段原文、26 组选做输入挑战和跨课复习。

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

## 维护位置

| 目录 | 职责 |
| --- | --- |
| `content/learning-course.json` | 编译后的唯一运行时 catalog：课文、题目、角色、音频映射、顺序与复习规则 |
| `content/textbook-sources.json` | 前 50 课原文的固定核对基准，用于防止重构时改变教材原句 |
| `content/expansion/` | 原文、中文释义、逐课蓝图与编译来源；前六课保留 fac029f 基线 |
| `core/` | 当前课程校验、路径运行、场景呈现、进度保存与课程包加载 |
| `poc/learning-path/` | 当前 HTML 入口、附加样式、新猫猫素材及生成的课程包 |
| `poc/lesson1-2-experience/` | 当前仍使用的共享页面、样式、猫猫和录音资源 |
| `assets/` | 当前课程所用图片、录音、字体及许可 |
| `docs/` | Duolingo 参考材料、现行设计、页面验收与发布记录 |
| `tests/` | 当前课程、记录兼容、音频控制、包完整性与预览检查 |
| `scripts/`、`deploy/` | 当前课程的打包、预览、单首页发布和部署说明 |

修改 7–50 课时先编辑 `content/expansion/` 的原文与教学蓝图，再运行 `npm run compile:course`，统一生成 catalog；页面只呈现和转发操作。录音生成请求使用冻结的 Kokoro 版本，具体操作与素材来源见前 50 课实施文档。`poc/learning-path/course-package/unit-catalog.json` 是自动生成文件，不直接修改。部分资源保留原路径以兼容已发布课程的地址与缓存；这些目录没有另一套可访问的旧课程。V3.6 测试快照仅验证现行产品的旧进度导入契约。

## 验证与发布

```bash
npm run test:media
npm run test:browser-media
npm run test:browser
npm run verify
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

从 [文档索引](docs/README.md) 开始；[现行课程设计](docs/designs/lesson1-50/README.md) 说明节点与考察方式，[分支整理记录](docs/designs/lesson1-6-path-v4/branch-isolation.md) 说明保留范围和验证结果。当前工作树已移除旧网站、旧课程运行代码及无关文档，原始 Git 历史与其他分支保留。
