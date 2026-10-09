# 本轮页面检查记录

全部为本地页面行为检查，未执行提交、推送、发布或线上验收。测试账号只在临时 SQLite 数据目录创建；不接触生产学生。

## 获星、卡片、旧入口与共用重试

```sh
COURSE_TEST_PORT=4250 npx --no-install playwright test tests/e2e/unit1-2-award.spec.js tests/e2e/unit1-2-certificate.spec.js tests/e2e/unit1-2-navigation.spec.js tests/e2e/retry-feedback.spec.js --reporter=line --output=tmp/award-final-pages
```

首轮 45 通过、1 失败。失败是共用重试用例仍定位已合并的 `.stage-trans`；更新为从第一道手表题进入工坊拼句题后，单独复跑该用例通过（1/1）。这是修复旧测试导航，不放宽提示不得给出完整答案的断言。新获星、四种宽度、下载失败恢复、日期、新版与旧版隔离、旧入口迁移在首轮均通过。

旧问句位置迁移另先完成红灯复现：旧真实访问记录从首页错误地退回图鉴。修复统一路由别名后，此用例在最终批次通过。

## 账号与相邻课程

```sh
LOGIN_TEST_PORT=4251 npx --no-install playwright test --config=playwright.login.config.js tests/login/unit1-2-award.spec.js tests/login/course-integration.spec.js tests/login/settings.spec.js --reporter=line --output=tmp/award-final-login
```

相邻单元无配音通关／旧证书同步、词卡离线翻页、16 单元设置等 6 项通过。新账号测试首次运行遇到测试输入与首访 Worker 激活重载竞争，另一次在“重开本课”的真实 reload 完成前发起了下一次导航。按实际页面生命周期补齐等待后，新账号用例在 `/lesson/` 复跑通过（1/1，13.8 秒）；没有关闭 Worker、绕过登录或改松生产权限。

```sh
LOGIN_TEST_PORT=4251 AWARD_TEST_BASE=/ npx --no-install playwright test --config=playwright.login.config.js tests/login/unit1-2-award.spec.js --reporter=line --output=tmp/award-final-root
```

根路径账号用例通过（1/1，12.0 秒）：断网完整达标但先不获星，联网后获星；真实账号名、换浏览器、首次日期、隔日、重开、其他学生 0 星；图片加载与页面无脚本异常。

## 原 Lesson 1–2 流程

本轮前段运行 `unit1-2.spec.js`、`unit1-2-scene.spec.js`、`unit1-2-navigation.spec.js`、`unit1-2-layout.spec.js` 共 22 项通过，包括 22 题完整流程、七句原文、场景／旧题稿升级、词卡、导航及布局。本段与上文导航用例有交叉，不把次数累加为独立覆盖数。

最终复跑 `unit1-2.spec.js --grep "22 题"` 通过（1/1，5.7 秒），使用最终字体重新生成四星棕框、无日期的实际 PNG。

## 验证边界

获得星星与账号流程测试中的英语音频使用完成事件替身，不代表英语语音质量或安卓微信播放验收。保存 PNG 为浏览器真实下载，星星由真实页面作答产生；没有调用隐藏接口直接赋予五星。手机为 Chromium 尺寸模拟；真机、教师／儿童试用与正式发布验收未做。

## 最终视觉与路径补查

最后一轮发现五字姓名的 PNG 靠近人物衣服，收窄姓名区域后，四种宽度＋22 题完整流程复跑 5/5 通过（11.0 秒），最终截图和四星／五星下载图已替换为本轮证据。

子路径防逃逸检查改为读取实际测试端口，并保持只判断 HTTP 网络请求、不把本地 blob 图片算作网络逃逸。最终 `unit1-2-navigation.spec.js unit1-2-scene.spec.js --grep '正确路径|不逃逸'` 三项复核通过（3/3，6.7 秒）；不把先前硬编码 4173 端口的断言当作当前端口的有效证明。
