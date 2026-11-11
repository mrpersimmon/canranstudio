# Lesson 5–6 词卡与推进按钮检查记录

2026-10-30。基于发布提交`eb96ef1d43ccbe6e0ece40ae48198d082b5fc6fb`的本地修改。只执行影响性检查，未提交／推送／发布。

## 视觉核查

目标是把原剧场与纪念卡的插画语言延续到词卡，不是逐像素复制旧词卡界面。实际打开认可插图、六辆车与太阳的组合图，以及手机／电脑真实页面对照。

| 维度 | 检查与结论 |
| --- | --- |
| 布局 | 手机两列、桌面三列。320／387下24张词卡逐张展开，图、英文、音标、中文、原例句均在卡内；外框高度不变，邻卡不跳。完成按钮四宽实际文字保持单行。 |
| 字体 | 保持原Nunito、寒蝉圆黑与IPA Arial；既有字体和国旗路径检查通过。英文、音标、释义分层，长词和长释义不截断。 |
| 颜色 | 暖奶油纸面、轻柔米棕边框、绿色交互提示，与认可纪念卡一致；原学习主操作绿按钮保留。 |
| 图像 | 新汽车以可见主体核验，不仅看透明文件外框；完整车身／轮胎／后视镜。国旗保持正确，已认可人物复用。Mercedes第三稿过于写实，P2已通过第四稿修正，灯具／轮辐／反光简化。 |
| 文案与操作 | 所有同类推进只显示“下一站”，可访问名称和真实目的地保留；不改变题目、音频、内容版本、授星或历史日期。展开词卡仍能看到原词、音标与准确释义。 |

证据：[认可插图与当前手机同屏对照](evidence/style-comparison.png)、[七张采用插图](evidence/art-review.png)、[旧词卡387](evidence/words-before-387.png)、[新词卡387](evidence/words-after-387.png)、[新词卡320](evidence/words-after-320.png)、[桌面1280](evidence/words-after-1280.png)、[完成页387](evidence/completion-after-387.png)。应用内本地浏览器另手动查看汽车组和人物组，并展开Miss长释义／例句。

## 实际检查

| 范围 | 实际结果 |
| --- | --- |
| Chromium根路径：新词卡／短按钮专项 | 3项通过：真实完成4题后前往剧场及返回、24词两手机宽逐张展开、五宽汽车解码和无溢出、首课／中段／末课末组推进。最后只修改行数测量方式后单独复验完成按钮1项通过。 |
| Chromium登录结算保护 | 1项通过：Lesson3–4在320×568真实完成、统计、跳转、返回刷新、重练及已获星不变。 |
| Chromium静态兼容 | 6项通过：legacy49的320／768／1280结束操作、320全页按钮和末词组；Lesson5–6全24音标翻面／刷新、真实字体及原题目Volvo标牌。末词组断言更新后独立复验1项通过，其他5项复用本次未变代码结果。 |
| WebKit内部前缀`/lesson/` | 新专项3项通过。其中24词与跨课导航2项先通过；行数采样修正后完成按钮1项独立复验通过，保留首错trace。使用浏览器引擎与模拟视口，不等于实体iPhone或安卓。 |
| 检查流程 | `tests/workflow/check-workflow.test.js` 14项通过；新词卡资源、共用推进代码和新专项会加入Chromium／WebKit定向检查。`check:plan`已运行；未执行其建议的全部课程检查。 |
| 构建／资源 | 72个受保护教学单元构建通过；Lesson5–6资源清单包含7张运行WEBP，不包含raw PNG；已登录请求未登记raw返回403。 |

去重计数：Chromium相关10项、WebKit相关3项、Node工作流14项。不同阶段重跑不累加成新覆盖。

主要命令（各服务使用独立端口）：

```powershell
$env:LOGIN_TEST_PORT='4390'; $env:AWARD_TEST_BASE='/'
npx playwright test -c playwright.login.config.js tests/login/unit56-word-cards.spec.js
npx playwright test -c playwright.login.config.js tests/login/submission-statistics.spec.js --grep '登录手机短屏'
$env:LOGIN_TEST_PORT='4391'; $env:AWARD_TEST_BASE='/lesson/'
npx playwright test -c playwright.recovery.config.js tests/login/unit56-word-cards.spec.js
$env:COURSE_TEST_PORT='4392'
npx playwright test tests/e2e/unit5-6-layout.spec.js tests/e2e/unit5-6-v154.spec.js tests/e2e/l49-v14.spec.js tests/e2e/l49-v17-actions.spec.js --grep '24 张词卡|正文字体实际加载|完成页两个操作相邻居中|320 窄屏全页按钮'
node --test tests/workflow/check-workflow.test.js
npm run check:plan
npm run build:login
```

## 首次失败与修正

1. 修复前真实完成页可见文字为“下一站教室小剧场”，新断言精确复现原问题；记录在`output/test-word-cards-before/`。
2. 扩展资源与跨课用例时，错误预期raw为404，实际受保护资源在授权判断返回403；首课已有按钮名“下一组”，用例误用了“下一组词卡”。据真实契约修正，未放宽原图禁止公开、短文案或真实跳转断言。首错在`output/test-word-cards-final-chromium/`；修正后的整文件3项在`output/test-word-cards-verified-chromium/`。
3. 旧版49窄屏用例仍统计可见“听音寻宝”的行数，新界面已不显示目的地。改为断言可见“下一站”一行，同时继续按完整可访问名称定位，原按钮位置／尺寸／证书操作断言保留。初次在`output/test-word-cards-compatibility/`，独立复验在`output/test-word-cards-legacy-final/`。
4. WebKit行数采样把包裹span和实际文字的矩形一起计数；改成只测文本节点的Range，保留严格单行和无溢出要求。初次在`output/test-word-cards-verified-webkit/`；最终两个引擎各自的完成按钮复验在`output/test-word-cards-webkit-next-final/`和`output/test-word-cards-chromium-next-final/`。

以上失败目录与trace保留，不把初次执行写成全绿。

## 验证边界

没有运行全量CI、72课逐题完整作答、所有历史版本迁移、导出GIF或官网验收。原卡及导出逻辑未改。真实Android微信／夸克、iOS和读屏器未实测；`aria-label`保留与键盘样式存在不等于完成读屏器验收。其他单元的词卡素材仍是原版本。
