# 课堂投屏合同

课堂投屏是公开课程的教师操作形态，不是教师账号或设备学习档案。`core/course-catalog.js` 的 `presentation` 字段是唯一可用性声明；只有 `PRESENTATION_COURSES` 中的课程可对外显示投屏入口。

Learning Runtime V2 将“可用性”与“课程内容”分开：`core/course-catalog.js` 只声明投屏状态、路由与共享能力；`core/curriculum-catalog.js` 才拥有课程专属教师步骤、教材语言、角色提示和音频引用。Lesson 49 当前把完整教师步骤放在旧 course catalog 的做法属于 V1 遗留合同，不能复制到 Lesson 1–2 或后续 V2 教学单元。共享投屏渲染器只消费 catalog，也不得访问或写入孩子的主线、回访、结果、掌握和设备档案。

一门课程标记为 `published` 前必须同时具备：

- 独立静态投屏页与原课程的明确进入、退出链接；
- 全屏、播放或重播、提示、上一步、下一步和退出控制；
- 完整课堂步骤及每步对应的同源预录 MP3；
- 不加载 `storage.js`、`device-profile.js`，不访问浏览器存储、服务 API 或分析接口；
- 键盘、焦点、44×44 触控目标、减少动态效果与受限音频回归；
- `tests/e2e/` 下由目录声明的真实浏览器测试。

Lesson 49 的首个实现位于 `/lesson49/present/`。V1 课程可以继续维护现有静态合同；V2 课程复用 `core/classroom-presentation.js` 时，课程专属步骤与录音映射必须来自 curriculum catalog，不得在投屏页面或 course catalog 再写一份，也不复制设备进度逻辑。

候选提交前运行：

```bash
npm run test:unit
npx playwright test tests/e2e/classroom-presentation.spec.js tests/e2e/routes.spec.js
```

候选提交后在干净 worktree 或候选 SHA 上运行完整发布测试和静态构建。
