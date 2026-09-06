# 探险猫 · 猫猫小镇

`codex/duolingo-version` 是当前 Duolingo 理念重构版的独立开发分支：新概念英语 Lesson 1–6 编排为 11 个连续学习节点，包含完整猫猫角色、互动故事、逐词学习、场景考察与跨课复习。

## 本地运行

需要 Node.js 20 或更新版本。已使用的图片、字体、录音随仓库保存，运行与构建无需额外第三方依赖。

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
| `content/learning-course.json` | 课程内容唯一编写入口：课文、题目、角色、音频映射、顺序与复习规则 |
| `content/textbook-sources.json` | 前六课原文的固定核对基准，用于防止重构时改变教材原句 |
| `core/` | 当前课程校验、路径运行、场景呈现、进度保存与课程包加载 |
| `poc/learning-path/` | 当前 HTML 入口、附加样式、新猫猫素材及生成的课程包 |
| `poc/lesson1-2-experience/` | 当前仍使用的共享页面、样式、猫猫和录音资源 |
| `assets/` | 当前课程所用图片、录音、字体及许可 |
| `docs/` | Duolingo 参考材料、现行设计、页面验收与发布记录 |
| `tests/` | 当前课程、记录兼容、音频控制、包完整性与预览检查 |
| `scripts/`、`deploy/` | 当前课程的打包、预览、单首页发布和部署说明 |

课文只在 catalog 中编写，页面负责呈现和转发操作。`poc/learning-path/course-package/unit-catalog.json` 是自动生成文件，不直接修改。部分资源保留原路径以兼容已发布课程的地址与缓存；这些目录没有另一套可访问的旧课程。V3.6 测试快照仅验证现行产品的旧进度导入契约。

## 验证与发布

```bash
npm run verify
```

该命令重建课程包、运行当前范围测试，并生成 `dist/learning-path/`。发布过程要求所有输入与 Git HEAD 一致，因此修改和重新生成后应先提交，再运行完整发布验证；平时可先单独执行 `npm run build:course` 与 `npm test`。

发布包只含一个首页与必要资源。部署步骤见 [部署说明](deploy/README.md)。创建本分支不自动推送或重新部署；线上地址仍为 <https://www.canranstudio.cn/>。

## 文档

从 [文档索引](docs/README.md) 开始；[现行课程设计](docs/designs/lesson1-6-path-v4/implementation.md) 说明节点与考察方式，[分支整理记录](docs/designs/lesson1-6-path-v4/branch-isolation.md) 说明保留范围和验证结果。当前工作树已移除旧网站、旧课程运行代码及无关文档，原始 Git 历史与其他分支保留。
