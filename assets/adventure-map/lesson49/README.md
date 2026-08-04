# Lesson 49 landmark assets

Lesson 49「肉店大冒险」使用固定 `1024 × 1024` 透明画布的“底图 + 独立成长层”合同。

运行时顺序：

1. `landmark-base.png` — 未开始的暖灯肉店；
2. `growth-01-awning.png` — 红白遮阳棚；
3. `growth-02-display.png` — 户外食材陈列；
4. `growth-03-sign.png` — 肉店招牌；
5. `growth-04-delivery.png` — 配送木车；
6. `growth-05-celebration.png` — 暖灯庆祝装饰。

`food-basket.png` 是五关完成后获得的永久纪念物，未烘焙进第五层。`mobile-preview.png` 仅为完整状态预览，不参与阶段渲染。

`base.png` 与 `growth-1.png` 至 `growth-5.png` 是旧版累计快照，保留用于历史对照；共享课程目录不再引用它们。

这组六张分层图来自用户已经认可的原始候选素材。发布审计确认：文件均为 RGBA、四角透明、主体锚点一致，且在地图手机缩略尺寸下仍能辨认；课程目录、地图和成长揭晓共用同一组文件，避免完成后出现两套不同地标。
