# 编号课程上新

`core/course-catalog.js` 是课程目录、首页入口、进度合同和 V1 地图归属的唯一课程清单。不要再向 `index.html` 添加一份手写课程链接。

新增一门已上线编号课时：

1. 添加 `lessonN/index.html` 和 `lessonN/audio/` 下的同源预录音频。
2. 在 `core/course-catalog.js` 的 `COURSES` 中增加一条 `publishedLesson(...)`；首页目录和静态构建会从这里自动取得课程。随后运行 `npm run sync:home-fallback`，更新由共享目录生成的无脚本课程入口；发布检查会拒绝手写或过期的副本。
3. 课程页继续通过 `requirePublishedCourse('lessonN').progress` 读取共享进度合同。
4. Lesson 49–60 只有满足完整地图发布合同后才会成为可点击学习地点；未完成美术合同的地点在地图中完全不渲染。
   地标必须声明 `states` 模式：每个阶段是一张从同一母版逐步编辑的完整累计快照，页面始终只显示当前状态的一张图。禁止恢复 `base + growth layers` 运行时组合，也禁止为六个阶段分别独立生成建筑。

   所有正式地图母图保持 `1024 × 1024` RGBA、固定画布、固定建筑锚点，并生成 512/768/1024 三档 AVIF、WebP 与 PNG 回退；纪念物不得烘焙进最后阶段。
5. Lesson 61 及以后不会进入 V1 世界总览、首发城区或地图推荐。它的直达页必须包含一条真实可见的说明：

   ```html
   <p data-course-map-status="v2">课程现在可以直接学习，对应地图将在 V2 到来。</p>
   ```

6. 按现有静态发布流程同步 `README.md`、`deploy/README.md` 和 Nginx 的精确路由；这些是发布信息，不是第二份首页课程清单。

形成候选提交前运行：

```bash
npm run test:unit
npm run test:e2e -- tests/e2e/home-progress.spec.js
```

提交候选版本后，在没有额外公共文件修改的干净 worktree 或候选 SHA 上运行：

```bash
npm run test:deploy
npm run build:static
```

静态发布检查会拒绝缺少课程页、预录音频、共享进度接线或 V2 地图说明声明的未来课程；浏览器回归还会逐页确认这条说明经过实际样式计算后确实可见。
