# Lesson 51 希腊花园素材

正式图片使用 `states/state-0.png` 至 `state-5.png`，每张都是完整地点；成长主题是天气仪、剧场、四季花园、月份日晷和庆典。

[素材清单](states/manifest.json)登记原图和三档网页图片。[four-seasons-guide-compass.png](four-seasons-guide-compass.png)是独立纪念物，不画进最后状态。

[美术规则](../../../docs/designs/adventure-map/landmark-art-bible-v1.md)统一说明画布、透明背景、固定位置、导出与验收；[本课状态联系表](../../../docs/designs/adventure-map/lesson51-state-snapshots-contact-sheet.png)用于逐阶段比较。

旧 `landmark-base.png`、`growth-*.png`、`base.png` 和 `mobile-preview.png` 仅作历史参考，页面不再引用。

本课是画风与品质参考。天气仪从第 1 阶段起连接蓝顶，后续依次增加剧场、四季花园、日晷和庆典；既有结构不能被删除。运行 `npm run art:build-states -- --course lesson51` 只从完整母图导出，不重拼旧图层。历史 growth 联系表同步为正式状态联系表。
