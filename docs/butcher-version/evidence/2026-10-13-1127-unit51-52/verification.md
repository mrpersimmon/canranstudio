# Lesson 51–52 · 本地验收记录

2026-10-13 · `codex/debug-grammar-v2` · 基于 `5596cb5` 的工作区。未提交、未推送、未部署；CI未运行。

## 实际执行

答案由审定题稿独立写入 `tests/support/unit5152.js`，不读取程序的判题字段。全部产品验证通过实际页面完成，账号用例使用临时班级和虚构学生，不改线上数据。

| 范围 | 实际结果 | 输出目录 |
|---|---|---|
| 56题、42词卡、12段课文、12组替换材料、错答／续做、四种宽度及短屏 | 首批15／15通过 | `output/unit5152-pages` |
| 全部词卡在320／390／768／1280宽度下可读，含长国名和音标 | 4／4通过；首次检查脚本误测隐藏例句，修正为可见文字后通过，未改产品回避断言 | `output/unit5152-words` |
| Chromium完整账号，`/lesson/`测试路径 | 6／6通过 | `output/unit5152-login-chromium` |
| WebKit完整账号，根路径，iPhone尺寸模拟 | 6／6通过 | `output/unit5152-login-webkit` |
| 相邻47–48与49–50完整五区流程回归 | 2／2通过，共113道题；仅这两个筛选场景，不代表整份历史套件 | `output/unit5152-neighbor-regression` |

共33项执行通过（包含两种浏览器对同6个账号场景的分别执行）。命令如下：

```sh
COURSE_TEST_PORT=4340 npx playwright test tests/e2e/unit51-52.spec.js tests/e2e/unit51-52-story-layout.spec.js --grep-invert '长国名' --output=output/unit5152-pages --reporter=list
COURSE_TEST_PORT=4340 npx playwright test tests/e2e/unit51-52.spec.js --grep '长国名' --output=output/unit5152-words --reporter=list
LOGIN_TEST_PORT=4343 npx playwright test -c playwright.login.config.js tests/login/unit51-52.spec.js --output=output/unit5152-login-chromium --reporter=list
AWARD_TEST_BASE=/ UNIT51_BROWSER=webkit LOGIN_TEST_PORT=4343 npx playwright test -c playwright.login.config.js tests/login/unit51-52.spec.js --output=output/unit5152-login-webkit --reporter=list
COURSE_TEST_PORT=4340 npx playwright test tests/e2e/unit47-48.spec.js tests/e2e/unit49-50-current.spec.js --grep '五区五星' --output=output/unit5152-neighbor-regression --reporter=list
```

首批命令执行时长词卡四例尚未添加，因此当时未传`--grep-invert`；以上补上该筛选用于精确复现原范围。

## 直接观察到的结果

- 五区8／6／12／8／22题，完整完成可获五颗星；错两次后订正统计保留错误，本轮不发新星，完整重练零错可得星。示范、提示与独立完成分开记入学习手记。
- 37个教材新词与5个复习词组成42张词卡；完整12轮对白保留中文，12组国家／国籍参考和20th–31st、书面7＋10题可查看。无英语录音／系统朗读，反馈音失败仍可完成。
- 最后目视发现中等宽度封面标题把“片”挤成一行，已按“希腊四季／明信片”分组换行；重新由课程目录进入最新资源，在四种宽度实际复查无孤字、无横向溢出。封面样式检查在上述33项之后进行，未改题目和奖励。
- 320／390／768／1280宽度逐句阅读、展开中文，长句在场景内滚动；人物全身相向，相册按季节切换，按钮位置稳定。完成页三卡并排、按钮可见；320×568和390×500短屏分别检查。
- 真实账号完成五区，奖励浮层先展示、统计动画随后；没有观测到缺图或加载层遮住浮层。五星与首次日期跨设备一致。新班级独立授权，未开放班级直链不可进入；教师预览不能保存个人成果，换学生不串卡。
- 缺少插图时留在加载页，恢复后完整进入；返回目录再次进入复用已缓存素材，本次观察到资源下载请求为0，词卡停留组数保留。断网可续做已进入的题目；重新进入需联网核验，恢复后不丢本轮和旧星。
- 一星、五星分别真实下载GIF并解码：984×528、60帧循环，星光区域帧间变化、标题区域稳定。纪念册、放大与320宽长姓名均检查。
- 新卡与Lesson1–2／3–4／5–6采用同姓名小禾、同一星、同尺寸截图对照；已目视复核人物互动、暖纸底、文字与插画分区。新单元视觉仍等待用户确认。

## 边界与不适用

- 新建`unit51-52`，没有旧配对单元记录需要迁移；历史单课Lesson51／52仍下架，不导入其进度，不伪造迁移已通过。
- WebKit离线导航如由浏览器内核直接拒绝，则单独记录引擎边界并验证联网后恢复，不宣称离线导航页通过。此次完整账号用例终态均通过。
- 未改通用缓存协议；本次实测新课缺图恢复与重访，不宣称缓存设计C01–C15全部重跑。
- 未执行教师审阅、儿童课堂试用、Android微信真机或实际手机GIF保存；也未执行线上发布验收。未把测试通过等同于这些验收。
- 本地预览沿用独立账号库`.data/unit4950-preview-20261013`，为本地测试班单独开放新课，原有学习记录保留。生产班级不会因此自动开放。

[查看实际画面](index.html) · [返回设计](../../2026-10-13-1127-v1.0-Lesson51-52设计与验收.md)
