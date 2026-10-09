# Lesson 1–2 五区整合：本地验收

2026-10-09 · 分支 `codex/debug-grammar-version` · 基线 `da4273e533c8fac1a5a880503a3e52938e620f14` 加当前未提交改动。

只通过页面点击、刷新、真实旧页面升级、临时账号和独立浏览器验证；没有注入答案、完成状态或获星状态。答案预期来自独立题稿。

## 结果

共 **50 个不同页面用例最终通过**，分批执行，有重叠，不把重跑累计为新增用例。

| 批次 | 文件范围 | 实际结果 |
| --- | --- | --- |
| 课程综合 | five-zones（当时 5 项）、completion、grammar-workshop、grammar-guide、grammar-v2、grammar-v3、exam、unit-thirteen-types | 33 通过、1 失败；失败为测试重试操作 |
| 五区与衔接回归 | five-zones（新增首页旧入口，共 6 项）、completion、navigation、certificate | 21 通过、1 失败；同一测试重试操作未完全修正 |
| 错答统计定向重跑 | completion 的「全错后改正仍记五题错误」 | 1 通过 |
| 登录同步 | login/unit1-2-five-zones、login/thirteen-types | 4 通过 |

重试测试修正：填空题保留已选内容，再点同一选项会清空；单选题重试后需要重新选择；词块题先撤回再重拼。定向重跑通过两次错答、刷新恢复、改正、五题各只记一次错误、不重播庆祝和再练清零。

## 验收边界

- 五区 `5／5／12／5／10` 共 37 题；找物旧入口与首页继续学习均可到达合并后的环节。
- 新指代题使用原文手提包；工坊以两组问答配对区分 `it` 与 `I`，无重复的指代选择。
- 旧六区真实记录升级后，原题保留，改写题必须重答。旧完成记录不拼成零错获星轮次；从未提交过的旧草稿可以正常开始获星轮次。
- 每区整轮首次答对获一星，最多五星；错后改正可完成，不自动获星；重练答错不扣已获星。
- 五个结束页使用同一套已认可的插画与三枚 imagegen PNG。320／390／768／1280 宽度三卡齐整；390×500 短屏从插画顶部露出。
- 已获星与完成状态登录同步；首页和另一设备保持一致。刷新不会用服务器旧完成轮次覆盖本机重练草稿。
- 原证书姓名、首次领取日期和实际 PNG／A4 导出保持；无配音完整通关。Lesson 25–26 回归共用题型与登录同步。

修复前页面检查曾发现：六区未合并、旧入口首页显示“开始学习”、账号端按 15 星换算或丢失获星凭据、重练刷新恢复旧结算、短屏插画被固定导航挡住。对应页面检查已转为通过。

## 截图

- [手机问答配对](grammar-pairs-390.png)
- [桌面问答配对](grammar-pairs-1280.png)
- [手机故事结算](story-result-390.png)
- [短屏语法结算](short-grammar-result.png)

## 复验

在独立工作目录选空闲端口运行以下页面检查。首次批次的完整范围以表格为准；不触碰真实学生数据。

```sh
COURSE_TEST_PORT=4270 ./node_modules/.bin/playwright test tests/e2e/unit1-2-five-zones.spec.js tests/e2e/unit1-2-completion.spec.js tests/e2e/unit1-2-navigation.spec.js tests/e2e/unit1-2-certificate.spec.js --reporter=line
./node_modules/.bin/playwright test -c playwright.login.config.js tests/login/unit1-2-five-zones.spec.js tests/login/thirteen-types.spec.js --reporter=line
```

本次是本地 Chromium 与模拟手机尺寸验收，尚非真实手机微信、教师或儿童验收。未提交、未推送、未部署；其他单元的全部页面未逐一回归。
