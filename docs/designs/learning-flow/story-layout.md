# Lesson1–2 大屏课文舞台比例修复

2026-10-31 · `codex/book-version` · 本地开发，未提交／推送／发布。

## 根因与遗漏

用户在1435×1244的`/unit1-2/#l1`标注课文对话异常。单屏改造让课文舞台`flex:1`且没有最大高度，随剩余视口变高；桌面人物却固定150px。实页测得舞台1002px、对白区约913px，背景`cover`随之过度放大，人物落在巨大舞台的底角，整体比例失衡。

此前流程专项实际覆盖了手机课文、桌面结算和题目，但缺少大屏已读完课文的状态。本次不能以此前“单屏通过”否认这个遗漏。修复前保留[大屏实页](evidence/2026-10-31-story/before-desktop.png)；新测试在原代码准确复现`scene.height=1002`超过560px目标，报告为`output/test-story-layout-before/`。

## 修复

- 保留原男士、女士、手提包与街景素材，将舞台和7／7计数包成同一内容组；内容组在可用区域居中，计数距舞台6px，底部继续／下一站区域保持原位置。
- 舞台最高640px（竖向布局）或560px（宽屏），空间不足时继续缩至实际可用高度；人物按视口适度增长，桌面最高220px、普通手机最高180px，保留320短屏与短横屏的专门尺寸。
- 对话记录仍完整累积、内部滚动，当前末句及展开的中文完整可见。人物全身、手提包局部坐标、原题库与阅读记录不变。
- 新检查暴露原气泡尖角向外伸出约9px，而对白横向内边距只有4px，产生4–5px横滚。横向内边距补至12px后消除溢出，未裁切英文或用`overflow-x:hidden`掩盖问题。首轮证据保留于`output/test-story-layout-chromium/`。

## 验证

新`story-layout.spec.js`以独立账号走开始阅读、七句、末句中文、完成、进入故事练习后返回、刷新恢复；检查舞台上限、人物比例、计数距离、横向溢出和数据一致。测试覆盖1435×1244、1366×768、768×1024、699×900／700×900，以及固定Chrome SE375×667、Pro Max430×932和440×956。原连贯流程继续覆盖320×568与667×375的开始页人物及操作完整性。

最终Chromium相关7项、WebKit相关5项通过：四个新场景两引擎均执行，原连贯流程在Chromium执行3项、WebKit复验实际阅读至授星／下一关的1项。新场景覆盖三种必测手机和大屏，桌面场景另顺序检查平板与699／700断点。23项设备／工作流测试与72课构建通过；新增`browser-story-layout`／`browser-story-layout-webkit`映射，相关样式、阅读逻辑、共享主题或设备清单变更会触发检查。

修复后实页：[1435×1244桌面](evidence/2026-10-31-story/after-desktop.png)；隔离账号截图：[SE](evidence/2026-10-31-story/after-se.png)、[430宽Pro Max](evidence/2026-10-31-story/after-pro-max-430.png)、[440宽Pro Max](evidence/2026-10-31-story/after-pro-max-440.png)。大屏舞台现为560px、人物220px，阅读计数贴近舞台，内容等比且不再无限撑长；三种手机的人物、末句和中文均完整可见。可滚动历史上方露出部分旧句属于阅读位置，当前句不得裁切。

原错误及独立复验报告：`output/test-story-layout-before/`、`output/test-story-layout-chromium/`、`output/test-story-layout-final-chromium/`、`output/test-story-layout-webkit/`。题库Git对象与HEAD保持`8990442d0779bec92f41b002d5ed6e0ca5edb7f8`，未重置原演示账号阅读或成绩。

本地预览为`http://127.0.0.1:4198/unit1-2/#l1`。未跑完整CI或实体手机／微信／夸克、软键盘验收；没有由本次样板推定其他单元通过。未提交、推送或发布。

## 追加：恢复对白容器透明

用户指出对白后出现了整块米白色底板。核对HEAD的`unit1-2/scene.css`，原规则明确为`background:transparent`，且注释要求只给单个气泡底色。新增`learning-flow.css`却以更高优先级写入`#fffdf5e8`，实测为`rgba(255, 253, 245, 0.91)`；这是单屏样式改造引入的视觉回归，不是图片素材变化。

本次只将该滚动容器恢复透明。舞台上限、人物尺寸、12px气泡边距、滚动／中文按钮和底部操作继续沿用刚修好的布局。原人物、场景、课文及学习记录不变。

在已有`story-layout.spec.js`中追加断言：容器底色alpha必须为0、没有背景图片，已呈现的独立气泡仍有底色。原页面先准确失败，首错保留在`output/test-story-transparency-before/`。该断言与原比例、末句、中文、返回、刷新和数据检查一起运行，覆盖开始和完成状态及所有固定设备。

本次Chromium4项、WebKit4项均通过，覆盖桌面1435×1244、SE375×667、Pro Max430×932／440×956，并随桌面用例复验平板和699／700断点；舞台上限、末句与中文、返回与刷新记录等原断言全部保留。72课构建与文档链接检查通过，未跑完整CI或实体手机。

实页确认容器底色为`rgba(0, 0, 0, 0)`、背景图为`none`，大屏舞台仍560px；原环境从气泡间隙完整透出。最终效果：[桌面实页](evidence/2026-10-31-story/transparent-desktop.jpg)、[SE](evidence/2026-10-31-story/transparent-se.png)、[430宽Pro Max](evidence/2026-10-31-story/transparent-pro-max-430.png)、[440宽Pro Max](evidence/2026-10-31-story/transparent-pro-max-440.png)。报告分别位于`output/test-story-transparency-chromium/`与`output/test-story-transparency-webkit/`，上方历史报告和截图未覆盖。未提交、推送或发布。
