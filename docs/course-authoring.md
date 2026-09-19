# 课程编写指南

课程内容和配置统一维护在 [course-catalog.js](../core/course-catalog.js)，简称“课程清单”。页面负责显示内容和接收操作，避免同一题目或音频映射在多处重复维护。

## 先把题目写对

每道题写清：要学什么、题目依据、正确答案、为什么、需要什么图片或录音。

- 选项要有明确的判断依据；语法正确但不符合情境，不能解释成“语法错误”。
- 提示只帮助思考；看过材料、播放录音、使用提示和独立答对分别记录。
- 面向小学生，线上优先点选、配对、拼词块；长篇书写和开放表达交给纸笔或课堂。
- 新题不能用旧成绩自动填答案，旧学习记录应保留。
- Lesson 49 的具体内容要求见[教学复核](butcher-version/2026-09-14-0119-v1.10-题目教学正确性要求与复核.md)。

## 新增一课

1. 添加 `lessonN/index.html` 和 `lessonN/audio/`，音频、字体等资源与网站放在一起。
2. 在课程清单的 `COURSES` 中登记 `publishedLesson(...)`；页面通过 `requirePublishedCourse('lessonN').progress` 读取进度配置。
3. 准备地图素材。Lesson 49–60 只有完成地图配置和素材要求后才显示入口；运行时每次显示一张完整状态图。
4. 同步[项目入口](../README.md)和[发布说明](../deploy/README.md)。当前首页只展示图鉴；`npm run sync:home-fallback` 检查首页入口，不再生成手写课程列表。
5. 按[测试说明](../tests/README.md)检查课程、进度恢复、音频和手机布局，再按[发布指南](../deploy/README.md)形成发布版本。

Lesson 61 及以后的课程暂不进入 V1 地图；直达页面需要显示：

```html
<p data-course-map-status="v2">课程现在可以直接学习，对应地图将在 V2 到来。</p>
```

## 素材和共用行为

地图每一阶段都是从同一母版编辑得到的完整图片。母图为 1024 × 1024 RGBA，建筑位置固定；导出 512、768、1024 三档 AVIF/WebP 和 PNG 回退图，纪念物单独保存。详见[地标美术规则](designs/adventure-map/landmark-art-bible-v1.md)。

优先播放 `audio/<slug>.mp3`；失败时由共享播放器尝试浏览器朗读。`slug` 是文本转小写后，把连续非英文字母或数字换成下划线，再去掉首尾下划线。例如 `It's often wet.` 对应 `it_s_often_wet.mp3`。

证书的领取、保存和打印都要重新检查满星条件。字体统一从 `/assets/fonts/` 加载；只有修改字体时才运行 `npm run vendor:fonts`，并保留许可证。
