# 地标验收台：沉浸预览检查

历史检查记录。原结论：通过；本次文档整理未重新执行这些页面测试。

## 当时的结果

当前地点用铭牌暖光和小猫／旗帜标记，未完成建筑保持未点亮。手机单页和电脑双页保留比例；操作栏自动隐藏，触摸、鼠标、键盘或焦点活动可唤回。

修复了三处问题：过大的地标光圈与偏移底圈、原生全屏立即取消时连带关闭沉浸预览、手机小猫旗帜过小。标记宽度由地图的 17% 调到 21%，锚点不变。

## 证据

- [选定画面](docs/designs/adventure-map/golden-route-page-49-52/selection-v5-glowing-plaque-flag.png)
- [手机对比](docs/designs/adventure-map/golden-route-page-49-52/design-qa-comparison-v5-immersive-mobile.png)
- [手机实现](docs/designs/adventure-map/golden-route-page-49-52/implementation-v5-immersive-mobile.png)
- [电脑实现](docs/designs/adventure-map/golden-route-page-49-52/implementation-v5-immersive-desktop.png)
- [实际孩子端](docs/designs/adventure-map/golden-route-page-49-52/implementation-v5-child-map-mobile.png)

场景为 Lesson 51、第 3 阶段、旅程预览。源图 1023 × 1537 等比缩至 562 × 844 后，与 390 × 844 手机截图比较，未拉伸裁切。

原记录：24 项浏览器检查通过，控制台无错误；覆盖进入／退出、F 与 Esc、左右切阶段、自动隐藏、数据隔离和加载。检查尺寸含 390 × 844、466 × 980、1440 × 1000。

仍需确认不同真实浏览器的系统全屏行为；已验证的窗口内沉浸显示作为回退。完整原参数见[原文备份](docs/archive/2026-09-17-docs-before-simplification.zip)。
