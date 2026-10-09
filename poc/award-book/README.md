# 书本式纪念册交互样板

本地入口：http://127.0.0.1:4264/ 。仅绑定本机地址。

三张已确认主题的纪念卡，示例姓名“小雨”。这里没有登录或真实收藏接口。页面的“我的课程”链接指向正式网站；纪念册本身始终是独立样板。

## 使用

```sh
npm install --prefer-offline --no-audit --no-fund
npm run build
npm run preview
```

默认端口 4264，可用 `PORT=其他端口 npm run preview`。开发修改用 `npm run dev -- --port 4263`。

- 前后按钮、键盘左右键、页脚横拖；手机自动单页。
- 目录直达，点卡放大，PNG 保存。
- 目录可开关翻页动画，未选择时跟随系统减少动态效果。明确选择后在本机同一网站长期保留并同步其它标签页；阅读位置仍只保存在当前会话。
- 先加载完整图片/字体，再显示书页，出错可重试。

## 验证与资源

[完整实现与服务器负担评估](../../docs/award-version/2026-10-09-1020-v0.17-书本式纪念册样板与服务器负担评估.md) · [视觉检查](design-qa.md) · [实际笔记本截图](../../docs/award-version/evidence/2026-10-09-1020-v0.17-award-book/laptop.jpg)。

[v0.18 翻页颜色连续性](../../docs/award-version/2026-10-09-1045-v0.18-纪念册翻页颜色连续性修复.md)。改动动效后，通过已绑定的 CUA 页面运行 `tests/turn-colors.browser.mjs` 导出的 `checkTurnColors(tab, 1)` / `checkTurnColors(tab, -1)`；需先在目录开启翻页动画并位于可翻动的页码。返回的 `passed` 必须为真，并人工检查中间帧。该检查不会修改页面内部状态、暂停动画或访问学生数据。

[v0.19 开关持久保存](../../docs/award-version/2026-10-09-1110-v0.19-翻页动画偏好持久保存.md)：用 `tests/motion-preference.browser.mjs` 的 `checkReopenedMotion(sourceTab, createIndependentTab, enabled)` 分别检查开启与关闭在新标签页的表现，返回 `passed` 必须为真。开启后同时检查真实翻页；颜色检查还要求采到不同旋转状态。

所有测试是实际页面行为或对应的 HTTP 资源观测；没有单元测试代替界面验收。没有接入生产服务器、学生数据或现有课程路由。

`src/assets/` 是实际网页压缩资源。`../award-book-assets/` 保存 imagegen 输出和提示词。已有纸纹、星星、手提包、品牌标志与字体来自项目资源。

演示字体子集仅覆盖当前文案与示例姓名；新增文字后用 `scripts/subset-font.py` 重新生成（需要 fonttools[woff]）。正式接入真实学生时不能照搬此子集，必须覆盖完整姓名并纳入资源预算。字体及图标许可保留在 `src/assets/LICENSE-*`。

## 性能记录

`node scripts/measure-assets.mjs` 对当前预览的构建资源作 HTTP 读取预算，结果写入 `/private/tmp/award-book-http-budget.json`。这不是生产压测。

设置 `PREVIEW_REQUEST_LOG=/private/tmp/某文件.ndjson` 启动预览可记录本地请求路径和响应体字节数。仅用于验证，不记录账号、Cookie 或姓名。

`PREVIEW_FAIL_ASSET=book-open PORT=4266 npm run preview` 是本地缺图验收方式：书图返回 503，页面必须不显示证书。重启同一测试端口且移除该环境变量，点击页面“再试一次”应恢复。正式演示不要设置这个变量。

本目录随奖励功能一起提交评审，仍为独立样板；不随课程构建自动发布。后续账号接口、历史版收藏、生产缓存接入和手机真机验收另行实施，提交和发布状态以对应 PR 为准。
