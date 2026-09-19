# 旧地图界面检查（历史）

2026-09-19 用户要求把当前分支的复杂地图导航改成与 Lesson 49–50 一致的课程入口。
这里保存替换前的界面专属检查：城区、翻页、水彩地标、地图成长动画位置。
它们不再代表现行导航要求，也不在默认浏览器测试目录内。

入口可达、星星保留、旧返回地址、键盘、触屏与异常存储覆盖迁入现行的
`butcher-navigation.spec.js`、`adventure-atlas.spec.js`、`home-progress.spec.js`、
`lesson49-map.spec.js`、`device-profile.spec.js`、`routes.spec.js`。
Lesson 50 的独立移动端故事检查仍保留在 `mobile-release.spec.js`。
课程内部成长逻辑和相关检查未移除。
