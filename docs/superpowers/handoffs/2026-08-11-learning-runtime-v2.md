# Learning Runtime V2 分支交接

> 分支：`codex/learning-runtime-v2`
> 性质：可继续开发的内部 checkpoint，不是发布候选
> 产品规格：[`2026-08-10-lesson49-50-learning-runtime-design.md`](../specs/2026-08-10-lesson49-50-learning-runtime-design.md)
> 实施计划：[`2026-08-10-lesson49-50-learning-runtime.md`](../plans/2026-08-10-lesson49-50-learning-runtime.md)
> Lesson 49 最新蓝图：[`lesson49-complete-level-blueprint-v1.md`](../../designs/lesson49-complete-level-blueprint-v1.md)

## 已实现

- TICKET-01～04 的基础纵向切片：教学单元目录、本地 store、learning ledger、五幕 runtime 与内部运行时验收台。
- `core/course-catalog.js` 已能把 Lesson 49–60 映射到六个 teachingUnitId。
- `/poc/learning-runtime-review/` 可审查幕、状态、微步骤、音频降级、减少动态效果与四档设备。
- `/poc/lesson49-experience/` 提供两幕连续流程的运行时证明、专用本地存储和中断恢复。
- `husband` 仅作为课文家庭关系词；儿童“人物还是肉类”分类题已从目录、POC 与计划中移除。内容目录仍保留不可误归为 food/meat 的隐形校验。
- 相关 ADR、课程语义、产品规格、实施计划、单元/部署/E2E 测试均在本分支。

## 明确未实现

- 最新 Lesson 49 蓝图的 9 个 `microtasks[]` 尚未编码；当前目录仍是每幕一个 `task`。
- 31 个 Lesson 49 Source ID、`exposureRefs/evidenceRefs` 与 coverage validator 尚未进入课程目录。
- ledger/runtime 尚无微任务级 checkpoint、声明式复合 response evaluator 和 9 步恢复。
- 当前 Lesson 49 POC 仍是两题运行时证明，不能当作完整课程验收。
- 正式 `/lesson49/`、`/lesson50/` 尚未切换到新运行时；TICKET-05～11 未完成。
- 回访到期资格、正式挑战星、纪念章投影、七状态 U01 地标、生产地图迁移和发布均未完成。

## 下一步

按 TDD 从课程目录开始：

1. 在 `tests/unit/curriculum-catalog.test.js` 增加 9 个微任务、Source ID 全覆盖、`husband` 不进入儿童分类任务的失败测试；
2. 将 U01 前两幕从单个 `task` 扩为有序 `microtasks[]`；
3. 实现 ledger 微任务 checkpoint 与恢复；
4. 实现 runtime 序列、复合判定、逐任务音频门与有限支架；
5. 再把 `/poc/lesson49-experience/` 改造成 9 步连续体验；
6. POC 内容与四档设备验收后，才接正式 Lesson 49/50 页面。

第一条聚焦命令：

```bash
node --test tests/unit/curriculum-catalog.test.js
```

## 换机拉取

```bash
git fetch origin codex/learning-runtime-v2
git switch --track origin/codex/learning-runtime-v2
npm ci
npm test
```

教材 PDF 是本机外部来源，不随 Git 提交；Lesson 49 所需原文、13 个话轮、11 个教材词汇、现有 11 段本地音频映射和内容禁区均已冻结在蓝图中。

## 已知边界

- `CONTEXT.md` 仍包含当前生产地图的旧“一课一地标/四地标册页”语言；本分支的教学粒度以 ADR-0023、课程语义表和产品规格为准。路线册页在六单元地图中的最终数量仍是开放设计，不能在续作中擅自决定。
- `learning-ledger` 中正式到期回访与挑战星资格仍属于 TICKET-07；现有 POC 结果不能接生产奖励。
- localStorage revision 提交是当前单设备基础实现，跨标签原子协调仍需在生产接入前完成或明确降级边界。
- 当前两个 POC 都是未公开内部入口，不得加入首页导航，也不得宣传为已上线课程。
