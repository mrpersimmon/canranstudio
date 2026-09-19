# 暖灯集市旧地图底图

历史素材说明。后续分册页布局见[册页设计](../../superpowers/specs/2026-08-07-single-screen-route-pages-design.md)。

底图为 `assets/adventure-map/atlas/warm-lantern-parchment.jpg`，914 × 1721，约 692 KB。只画纸张、装帧、地形、植物、海岸、罗盘装饰与连续路线；建筑、标题、状态和按钮由页面放置。

`npm run art:build-atlas-background` 从 JPG 生成 512／914 宽的 AVIF/WebP。世界入口按需加载预览，进入城区后才加载底图和当前状态；直接进城区不下载隐藏的世界入口图。

地标统一用完整状态图，当前状态来自真实进度，不使用写死的完成态。原始图片编辑提示和参考说明在[原文备份](../../archive/2026-09-17-docs-before-simplification.zip)中。
