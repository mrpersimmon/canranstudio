# Lesson 49/50 新学习运行时纵向切片实施计划

> 状态：已批准，实施中
> 产品规格：docs/superpowers/specs/2026-08-10-lesson49-50-learning-runtime-design.md
> 课程语义：docs/designs/four-seasons-city-curriculum-semantics-v1.md
> Lesson 49 关卡蓝图：docs/designs/lesson49-complete-level-blueprint-v1.md
> 范围：四季生活城 U01（Lesson 49 + 50）完整纵向闭环
> 发布：本计划不自动提交、推送、合并或发布；发布需要单独授权

## 1. 目标

用一个可验证的纵向切片证明：

1. Lesson 49/50 共用一个教学单元和一座暖灯风味市集；
2. 五幕学习由共享运行时推进，而不是两份页面各自维护五关；
3. 新课当天只建设地标；
4. 后续目标级回访可以形成跨日、跨情境独立证据；
5. 合格回访产生挑战星，受每日上限和幂等保护；
6. 五个目标全部掌握后地标亮灯落成；
7. 地图、课程和图鉴从同一设备本地真源读取状态；
8. 旧 URL 与旧进度数据保持安全兼容。

完成 U01 后再按同一内容模板迁移 U02–U06；本计划不同时重写全部课程。

## 2. 执行基线

当前规划 worktree 包含大量尚未提交的产品 ADR、美术、地图和 POC 改动，不能直接作为实现与发布基线。

开始编码前必须：

1. 完成本规格和课程语义表的用户审核；
2. 明确需要保留的规划文件并形成一个可追溯提交；
3. 刷新 origin/main；
4. 从明确的已审核提交创建新的 codex/ 前缀隔离 worktree；
5. 在干净 worktree 运行基线验证并记录精确 SHA；
6. 不复制 tmp/pdfs、截图、测试产物或未获批准的美术候选。

若基线验证失败，先区分既有失败、环境阻塞和本计划回归，不在未知基线上继续编码。

本次执行记录：

- 远端基线：`origin/main@14152e84599d90bffbe9d9d23a91a86e4042d0f2`；
- 实施基线：`bf966664a9d24980a6e769f6109715d0386a1759`（在远端基线上增加已提交的纪念章验收台）；
- 隔离分支：`codex/learning-runtime-v2`；
- 运行环境：Node `v20.20.2`、npm `10.8.2`、Playwright `1.62.0`；
- 基线单元测试：94 项通过；部署合同另行记录在最终候选验证中；
- 既有 planning/release worktree 的未提交改动保持原样，未复制 POC、美术候选或测试产物。

## 3. 全局约束

- 静态 HTML、CSS、JavaScript；不引入 React、Remotion、Lottie、GSAP 或服务端运行时。
- V1 无账号、无授权码、无远端学习档案。
- V1 不请求麦克风、不采集儿童声音、不进行自动口语评分。
- 所有业务状态先成功持久化，再播放永久建设、得星、落成或授章反馈。
- 所有生产事件必须带 eventId 并可幂等重放。
- 地标使用完整累计状态图，不在运行时拼接增长装饰。
- 手机竖屏优先，桌面和平板改变取景但不改变课程状态机。
- POC 不读取或写入生产 localStorage，不允许 query 参数伪造生产奖励。
- 每票先写失败测试，再写最小实现；测试只跨模块公开接口，不测试实现细节。
- 任何清理旧页面、旧资产或旧测试的动作都要等替代闭环验证通过。

## 4. 目标架构

| 模块/实现 | 责任 | 外部接口 |
| --- | --- | --- |
| core/curriculum-catalog.js | 教学单元、目标、五幕、情境、证据和资产真源 | getTeachingUnit、getTeachingUnitForLesson、listTeachingUnitsForDistrict、validate |
| core/learning-ledger.js | 档案规范化、证据、调度、星星、地标和纪念章投影 | open、apply、read |
| core/learning-store.js | localStorage 与 in-memory 两个真实 adapter | createLocalStorageAdapter、createMemoryAdapter |
| core/learning-runtime.js | 五幕与微步骤状态机、支架、恢复、效果编排 | create、enter、dispatch、snapshot、destroy |
| core/learning-scene.js | 浏览器 DOM、焦点、触控、音频和运行时效果实现 | 由课程页面初始化，不暴露业务判定 |
| core/learning-scene.css | 单屏课程场景、反馈、结算与响应式 | 无业务状态 |
| lesson49/index.html | U01 前两幕兼容入口薄壳 | 只声明 entryLesson=49 |
| lesson50/index.html | U01 后三幕兼容入口薄壳 | 只声明 entryLesson=50 |
| core/adventure-atlas.js | 读取 ledger 地图投影，渲染一座 U01 地标 | 不写学习证据 |
| poc/learning-runtime-review/ | 无生产存储的状态验收台 | 固定夹具，不可发奖 |

复杂调度留在 learning-ledger 内部；不要为每个内部算法新增公开 seam。只有 localStorage 与 in-memory 的两种真实实现需要 adapter。

## 5. 依赖关系

    TICKET-00 审核与干净基线
       ├── TICKET-01 教学单元目录
       └── TICKET-02 本地学习账本
                 │
    TICKET-01 + TICKET-02
                 └── TICKET-03 五幕运行时
                              ├── TICKET-04 无存储运行时验收台
                              ├── TICKET-05 Lesson 49 前两幕
                              │            └── TICKET-06 Lesson 50 后三幕
                              └── TICKET-07 回访、挑战星与结算

    TICKET-05 + TICKET-06
                 └── TICKET-08 地标七状态与内部地图候选

    TICKET-07 + TICKET-08
                 └── TICKET-09 图鉴资格投影
                              └── TICKET-10 兼容迁移与切换
                                           └── TICKET-11 完整验证与候选交付

TICKET-01 与 TICKET-02 的测试设计可并行，但合并实现时先冻结目录 ID 与档案 schema。TICKET-07 至少依赖 TICKET-01、TICKET-02、TICKET-03 和已冻结的回访情境；TICKET-08 依赖 TICKET-05、TICKET-06；TICKET-09、TICKET-10 不得在回访和地图投影稳定前提前接生产页面。

## 6. 实施票

### TICKET-00：产品审核、基线与安全隔离

目标：确保所有后续代码都基于已审核语义和干净 Git 基线。

工作：

- 审核六单元名称、五个 U01 核心目标、15/30/45 星门槛。
- 审核 Lesson 49/50 五幕动作与“新课不发星”。
- 审核旧进度只作为 priorExposure、不得换算掌握的规则。
- 记录美术仍需单独批准的七状态清单。
- 解决现有重复 ADR 编号，确保每项已接受决策只有一个稳定文件标识。
- 形成已审核规划提交。
- 创建新隔离 worktree 与 codex/ 分支。
- 记录 origin/main SHA、规划 SHA、Node/npm/Playwright 版本和基线测试结果。

验收：

- git status 为空；
- 产品规格和实施计划都能从新 worktree 读取；
- npm run test:unit、相关 E2E 和 npm run test:deploy 在基线有明确结果。

### TICKET-01：教学单元课程目录

目标：让课程系统第一次拥有“一单元包含两个教材课次、一个地标和一组目标”的权威结构。

文件：

- Create: core/curriculum-catalog.js
- Create: tests/unit/curriculum-catalog.test.js
- Modify: core/course-catalog.js
- Modify: docs/designs/adventure-atlas-curriculum-map.md
- Modify: tests/unit/course-catalog.test.js
- Modify: tests/deploy/course-catalog-contract.test.js

先写测试：

- U01 的 lessonIds 固定为 lesson49、lesson50。
- 两个 Lesson 都反查到同一 unitId。
- U01 只有一个 landmarkId、五个核心目标和五幕。
- 每个目标声明 evidenceModes、至少两个 contextId 和阶梯支架。
- husband 不得出现在 food/meat 类别值。
- 一个 Lesson 不能归属两个教学单元。
- 未实现 U02–U06 可以存在为 planned，但不能宣称 published。

实现：

- 把课程语义从两个 HTML 的内联数组抽为可验证数据。
- 保留 COURSES 的公开 Lesson 路由兼容信息。
- 新增 TEACHING_UNITS 或等价只读目录，让地图按单元而不是按 Lesson 投影。
- 把课程地图总表的四季生活城改为六个教学单元，并继续标记其他城区的一课一地标内容为待重编。
- 不在本票改变页面 DOM 或真实进度。

聚焦验证：

    node --test tests/unit/curriculum-catalog.test.js tests/unit/course-catalog.test.js
    node --test tests/deploy/course-catalog-contract.test.js

### TICKET-02：设备本地学习账本

目标：在一个深模块中完成状态规范化、目标证据、调度、星星、地标和纪念章资格投影。

文件：

- Create: core/learning-store.js
- Create: core/learning-ledger.js
- Create: tests/unit/learning-store.test.js
- Create: tests/unit/learning-ledger.test.js

先写测试：

- 空、损坏、旧版本存储规范化为安全默认值。
- localStorage 与 in-memory adapter 通过相同合同测试。
- eventId 重放不重复写入。
- 新课形成性成功不产生独立证据或挑战星。
- independent、supported、failed 三类结果保持区分。
- 同目标同日第二次成功不增加证据或星。
- 两日、两 contextId、无支架成功才投影为 mastered。
- 每日第四个合格目标不发星。
- 日期回拨不重复发星。
- 地标 state-5 与 state-mastered 分开投影。
- 15/30/45 星与 2/4/6 覆盖分别投影三枚阶段章。
- 最终主徽章只检查 30 目标/6 地标落成。
- 存储 commit 失败时返回未持久化，不产生永久效果。

实现：

- schema 使用 revision 与乐观提交，避免同页双击或多标签覆盖。
- clock 与 idFactory 注入。
- 每目标只保留掌握所需证据、调度摘要和有限维护信息，避免无限事件日志撑满 localStorage。
- 派生状态通过 read 投影，不重复存储 mastered、badgeEligible 等多个真源。

聚焦验证：

    node --test tests/unit/learning-store.test.js tests/unit/learning-ledger.test.js

### TICKET-03：共享五幕学习运行时

目标：实现与 DOM 无关、可恢复、音频完成驱动的五幕状态机。

文件：

- Create: core/learning-runtime.js
- Create: tests/unit/learning-runtime.test.js

先写测试：

- lesson49 无进度从 beat-1 开始。
- lesson50 有前两幕检查点时从 beat-3 开始。
- lesson50 无前置进度时必须完成压缩版 beat-1/beat-2 桥接检查。
- 每个桥接微步骤完成后只写形成性 checkpoint；两个关键检查都完成后才到 state-2。
- 桥接不会写 independent evidence、challenge star 或 mastered。
- 只有稳定微步骤才写 checkpoint。
- 音频未返回 completed 前不能自动进入下一句。
- 重播会取消旧音频效果。
- 第一次错误只增加一级支架，不立即暴露答案。
- 示范后生成不同 contextId 的近迁移任务。
- 支架后正确提交 supported。
- 五幕完成只提交 unit-built，不提交 star 或 mastered。
- destroy 后迟到的音频回调不能推进状态。

实现：

- create 接受 unit、ledger、clock 和 effect sink。
- dispatch 输入孩子动作，输出新的运行时快照和有序效果。
- 页面无权提交 star、mastered 或 badge。
- 题目随机化使用注入种子，测试和恢复可确定。

聚焦验证：

    node --test tests/unit/learning-runtime.test.js

### TICKET-04：无存储学习运行时验收台

目标：在动正式课程前，让产品方逐幕检查学习逻辑、文案、错误路径和移动端布局。

文件：

- Create: poc/learning-runtime-review/index.html
- Create: poc/learning-runtime-review/review.js
- Create: poc/learning-runtime-review/review.css
- Create: tests/e2e/learning-runtime-review.spec.js
- Create or modify: tests/deploy/learning-runtime-review-contract.test.js

行为：

- 路径暂定为 /poc/learning-runtime-review/。
- 可切换 beat、microstep、正确、首次错误、局部支架、示范、近迁移、存储失败、减少动态效果。
- 可切换 iPhone 12、华为大屏、常用平板和电脑。
- 可一键进入真正的浏览器全屏查看。
- 使用 in-memory adapter；刷新即重置。
- noindex、首页无入口、不能读写 localStorage、不能调用外部接口。

验收：

- 视觉控件与孩子画面明确分层；
- 孩子全屏模式不出现验收控件；
- query 只能改变夹具，不能改变生产页面。

聚焦验证：

    npx playwright test tests/e2e/learning-runtime-review.spec.js
    node --test tests/deploy/learning-runtime-review-contract.test.js

### TICKET-05：Lesson 49 前两幕

目标：把教材对话、词汇和音频重组为“发现问题 → 听懂线索”。

文件：

- Modify: lesson49/index.html
- Add as needed: lesson49/unit-data.js
- Reuse/modify: lesson49/audio/*.mp3
- Modify: tests/e2e/l49-progress.spec.js
- Create: tests/e2e/unit49-50-learning.spec.js
- Modify: tests/e2e/mobile-release.spec.js

工作：

- 用共享场景薄壳替换旧页面式五关主导航。
- 以 Lesson 49 蓝图冻结的 11 个教材词汇为主线索；额外词汇不阻塞主线，也不先展示卡片墙。
- 以教材 13 个原文话轮为内容真源；当前可复用合并后的 11 个本地 MP3 播放段。
- 按蓝图实现 9 个必做微任务：M01 完成后到 state-1，M09 完成后到 state-2。
- 预取下一句；以 audio completed 驱动，不用固定时长。
- 只让孩子操作当前一步，跨幕等待明确场景动作。
- 完成后写 beat-2 检查点和 state-2 建设。
- 保留旧课堂投屏为独立老师入口，不把投屏五步当孩子五幕。

移除/降级：

- Do/Are 大型分拣、give 双宾语、泛化三单训练不再阻塞主线。
- l1–l5 星槽、15 星总数和单课证书不再代表单元进度。
- 旧页面固定计时自动剧场。

聚焦验证：

    npx playwright test tests/e2e/unit49-50-learning.spec.js tests/e2e/l49-progress.spec.js tests/e2e/mobile-release.spec.js

### TICKET-06：Lesson 50 后三幕

目标：把现有蔬果、偏好和句型题池重组为“教会小猫 → 变化情境 → 建造地标”。

文件：

- Modify: lesson50/index.html
- Add as needed: lesson50/unit-data.js
- Modify: tests/e2e/l50-assessment.spec.js
- Modify: tests/e2e/unit49-50-learning.spec.js

工作：

- husband 的语义类型只由课程目录与内容发布测试保护，不进入孩子端分类任务。
- 用小猫错例承载 `doesn't + 动词原形`、二选一/接受/拒绝意图和第三人称肯定/否定表达；不再出现人物/食物分类。
- 把 TABLE、QAS、MIRROR_Q、QUIZ 中符合 U01 五目标的项目拆为迁移任务池。
- 删除“两个按钮都算正确”的伪证据。
- 错误后走阶梯支架与近迁移，不自动跳题。
- 完成后提交 unit-built，地图达到 state-5 未亮灯状态。
- /lesson50/ 无前置进度时执行压缩版前两幕；真实完成桥接后写 beat-1/beat-2 形成性建设与 state-2，但不写独立证据、挑战星或掌握。

移除/降级：

- “挑食小王子城堡”不再作为独立地标。
- 整套一般现在时规则讲解只保留与偏好任务直接相关部分。
- 旧 l1–l5 星级继续只读兼容，不产生新奖励。

聚焦验证：

    npx playwright test tests/e2e/unit49-50-learning.spec.js tests/e2e/l50-assessment.spec.js

### TICKET-07：目标级回访、挑战星与结算

目标：打通“到期目标 → 故事任务 → 独立证据 → 挑战星 → 统一结算”。

依赖：TICKET-01、TICKET-02、TICKET-03，以及已经冻结的 U01 早餐铺/野餐补给回访情境。

文件：

- Modify: core/learning-ledger.js
- Modify: core/learning-runtime.js
- Modify: core/learning-scene.js
- Create: tests/unit/review-scheduling.test.js
- Create: tests/e2e/unit-review-settlement.spec.js

工作：

- 实现 next learning day、约 3/7/14/30 天种子窗口。
- 一次只选真实到期的 1–3 个目标。
- 使用早餐铺、野餐补给台等变化情境，不重复原题。
- 无到期目标直接进入新冒险，不显示零星结算。
- 逐目标先显示世界结果，再轻量得星。
- 结算第一次点击跳到最终状态，第二次继续。
- 使用注入 clock 在测试中跨学习日；生产界面不暴露改日期控件。

聚焦验证：

    node --test tests/unit/learning-ledger.test.js tests/unit/review-scheduling.test.js
    npx playwright test tests/e2e/unit-review-settlement.spec.js

### TICKET-08：七状态地标、美术门与地图单地标

目标：让暖灯风味市集真实呈现五幕建设、等待回访和最终亮灯，并形成内部地图候选；本票不切换当前生产地图。

依赖：TICKET-05、TICKET-06 的语义与状态已稳定。

美术批准门：

- 使用 ImageGen 从同一批准母版生成/编辑七张完整累计状态。
- 先在 /poc/landmark-review/ 或独立 U01 审图模式检查原图、地图落位、手机和平板。
- 逐张审核锚点、透视、建筑比例、肉铺/果蔬摊/备餐桌语义和灯光时机。
- state-5 必须完整但未亮最终灯；state-mastered 才有建筑灯、铭牌灯和庆典细节。
- 未获用户明确批准前不接入地图。

文件：

- Add after approval: assets/adventure-map/unit49-50/states/*
- Modify: scripts/build-landmark-states.js
- Modify: core/curriculum-catalog.js
- Modify: core/adventure-atlas.js
- Modify: index.html
- Modify: tests/unit/adventure-atlas.test.js
- Create/modify: tests/e2e/unit49-50-map.spec.js
- Modify: tests/e2e/adventure-atlas.spec.js

工作：

- 内部候选地图只渲染一座 U01 地标。
- Lesson 49/50 都聚焦同一 landmarkId。
- 选择响应式派生图，不改变宽高比。
- 小猫站在批准的地标入口锚点，不遮挡铭牌或建筑。
- state-mastered 永久保持，维护失败不降级。
- 当前生产地图继续保留 Lesson 49–54 既有发布面；在 U02、U03 也完成单元迁移前，不发布新旧地标混合态。

聚焦验证：

    node --test tests/unit/adventure-atlas.test.js tests/unit/curriculum-catalog.test.js
    npx playwright test tests/e2e/unit49-50-map.spec.js tests/e2e/adventure-atlas.spec.js tests/e2e/mobile-release.spec.js

### TICKET-09：城区图鉴资格投影

目标：让纪念章页面第一次读取真实学习投影，而不是 query 夹具。

文件：

- Modify or create production keepsake page/module after route decision
- Modify: core/learning-ledger.js
- Modify: core/adventure-atlas.js
- Create: tests/unit/district-rewards.test.js
- Create: tests/e2e/district-keepsakes.spec.js
- Keep: poc/keepsake-review/ as isolated visual workbench

工作：

- 正式页面不接受 state query 改奖励。
- U01 产生的星归入 first-book-49-60。
- U01 有至少一颗挑战星时形成一份地标覆盖。
- 当前只有 U01 实现时，第一阶段章仍必须等待真实 15 星和至少 2 座地标覆盖，因此不可提前取得。
- 把现有 POC 的 6/12、12/12 修正为 2/6、4/6、6/6 与最终 6/6 语义。
- 返回恢复原城区、册页、焦点和滚动位置。

聚焦验证：

    node --test tests/unit/district-rewards.test.js tests/unit/learning-ledger.test.js
    npx playwright test tests/e2e/district-keepsakes.spec.js

### TICKET-10：旧进度迁移、兼容入口与切换

目标：安全替换旧 Lesson 49/50 主体验，不丢数据、不伪造新能力。

文件：

- Modify: core/learning-ledger.js
- Modify: lesson49/index.html
- Modify: lesson50/index.html
- Modify: tests/e2e/routes.spec.js
- Create: tests/e2e/unit49-50-migration.spec.js
- Modify: tests/deploy/public-v1-boundary.test.js

工作：

- 保留并可读旧 l49/l50 评级键。
- 将已有评级规范化为 priorExposure。
- 不自动生成 challenge star、independent evidence 或 mastered。
- 用真实旧数据样例测试空、部分、完成、损坏和存储不可写。
- /lesson49/、/lesson50/、地图返回和老师旧链接继续有效。
- 通过一个静态发布开关完成切换；不开双写，不让旧页和新运行时同时竞争真源。
- 记录回滚条件和回滚后旧数据仍可读取的证明。

聚焦验证：

    npx playwright test tests/e2e/unit49-50-migration.spec.js tests/e2e/routes.spec.js
    node --test tests/deploy/public-v1-boundary.test.js

### TICKET-11：完整验证、真机验收与候选交付

目标：形成可以审计的内部纵向切片候选 SHA，但不自动发布，也不把它误称为生产地图发布候选。

自动验证：

    npm run verify:v1:release

额外重复验证：

    npx playwright test tests/e2e/unit49-50-learning.spec.js tests/e2e/unit-review-settlement.spec.js tests/e2e/unit49-50-map.spec.js tests/e2e/district-keepsakes.spec.js --repeat-each=10

人工验收：

- iPhone 12：单屏课程、无横向滚动、音频与触控。
- 华为 Mate 60 Pro+：安全区、字体、宽高比、返回按钮。
- 常用平板：课程场景、地图、图鉴。
- 电脑：双页地图/图鉴与课程适配。
- 静音、慢网、离线音频、存储不可写、减少动态效果。
- 真机跨两个学习日完成 U01 两个变化情境。

证据：

- 精确候选 SHA；
- 自动测试原始输出；
- 四档截图与真机记录；
- 存储 schema 样例与迁移前后对照；
- 资源体积和首屏请求瀑布；
- 已知限制与回滚说明。

只有用户再次明确授权，才执行提交、推送、合并远端 main 和服务器发布。

## 7. 首屏与性能预算

- 进入地图只加载当前册页底图和当前可见地标状态。
- 进入 U01 只加载当前幕必要图片与首句音频。
- 当前音频播放时预取下一句；当前幕稳定后才空闲预取下一幕。
- 不在首屏下载七张地标原图、全部 Lesson 49/50 图片或完整纪念章 POC。
- 响应式图优先 AVIF/WebP，PNG 保留为回退与美术真源。
- 图片 decode 与音频预取都必须可取消；切换情境后不继续泵出旧队列请求。
- 性能门槛在 TICKET-00 记录基线后固定，不能凭主观“感觉快了”验收。

## 8. 风险与控制

| 风险 | 控制 |
| --- | --- |
| 把旧五关机械重命名为五幕 | 课程目录测试要求一单元五幕；页面不再拥有业务判定 |
| 选择题高估主动调用 | 每目标声明合格 evidenceMode；产出目标使用句子拼装 |
| 同日刷星 | targetId + learningDay + eventId 三重幂等，每日总上限三 |
| 设备时间回拨 | 已见 learningDay 不重复发星；记录 lastObservedDay |
| 音频读不完就跳 | 只接受完成回调；取消迟到回调；E2E 使用不同时长音频 |
| 切题后音频像卡住 | 下一音频预取；加载状态可感知；慢网测试 |
| 旧进度被误当掌握 | priorExposure 与 evidence 分字段，迁移测试禁止换算 |
| 地标提前亮灯 | 七状态资产合同；state-mastered 只来自五目标掌握投影 |
| POC 污染生产 | in-memory adapter、noindex、首页无入口、部署合同禁止存储 |
| 模块变成薄封装 | 测试只通过 curriculum、ledger、runtime 的公开接口；删除重复页面逻辑 |

## 9. 完成定义

只有同时满足以下条件，纵向切片才算完成：

- U01 五个目标、五幕、两个教材入口和一座地标由目录验证；
- 两门旧课件的核心内容已经重组，不存在两套业务真源；
- 新课完成只到 state-5；
- 真实跨日回访可以获得独立证据、挑战星并最终点亮 state-mastered；
- 地图、课程和图鉴刷新后状态一致；
- husband 语义禁区、音频生命周期、支架、幂等和每日上限都有自动回归；
- 七张地标状态经过用户美术批准；
- 四档设备验收通过；
- 精确候选 SHA 的完整门禁通过；
- 候选仍使用隐藏验收入口或内部构建；生产地图切换等待 U02、U03 迁移或另行批准的兼容 ADR；
- 尚未发布，等待用户最终发布授权。

## 10. 关联决策

- [一教学单元一地标](../../adr/0023-one-teaching-unit-per-landmark.md)
- [当天建设、延迟掌握后落成](../../adr/0024-landmarks-build-now-and-complete-after-retention.md)
- [五幕学习骨架](../../adr/0034-all-units-use-a-five-beat-learning-loop.md)
- [真实音频完成驱动剧情](../../adr/0040-narrative-progression-follows-real-audio-completion.md)
- [设备本地稳定检查点](../../adr/0042-v1-resumes-from-device-local-stable-checkpoints.md)
- [阶段章的星数与地标覆盖](../../adr/0049-stage-badges-require-stars-and-landmark-breadth.md)
- [阶段星数按核心目标规模折算](../../adr/0050-stage-star-thresholds-scale-with-district-mastery-evidence.md)
- [课程语义先于纪念章故事和美术](../../adr/0073-keepsake-stories-and-art-start-from-curriculum-semantics.md)
