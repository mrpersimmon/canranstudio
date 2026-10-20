# Lesson95–96 · 车站里的时间谜题

后续开发以[现行统一标准v1.53](../docs/butcher-version/publish/2026-10-17-0031-v1.53-教学单元设计标准与验收清单.md)为准；下文v1.51是本单元开发时的依据，本轮未重跑或改写其既有验收。

按[统一设计标准v1.51](../docs/butcher-version/publish/2026-10-15-0041-v1.51-教学单元设计标准与验收清单.md)开发的无配音课堂配套单元。教材页码、目标、题稿覆盖、题量与实际验收统一见[设计与验收](../docs/butcher-version/2026-10-15-0120-v1.0-Lesson95-96设计与验收.md)；[素材说明](../assets/unit95-96/README.md)保存来源与完整生成提示词。

核心内容为had better与must、准确钟点和时间表达。`content.js`是本课单一内容定义；`scene.js`维护人物换景与出行记录；`unit.js`复用共用练习、续做、三卡、奖励和打印流程。原文不附加自动理解结论，封面不提前透露误车原因。

独立内容／奖励版本为`station-advice-time-v1`，学习键为`canran:unit95-96:learning:v1`。新班级仍需明确开放本课。课程、场景和账号用例分别为`tests/e2e/unit95-96.spec.js`、`tests/e2e/unit95-96-story-layout.spec.js`、`tests/login/unit95-96.spec.js`，独立审定答案维护在`tests/support/unit9596.js`。

本地开发完成；教师、儿童、真机微信保存与实体打印按验收记录继续核对。尚未提交、推送或发布。
