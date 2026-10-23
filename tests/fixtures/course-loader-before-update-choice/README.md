# 升级提醒前的加载程序

来源为 `259eac2083ef370d6f78ee8dfe1c249ac61e82af:core/course-loader.js`，原始Git字节及SHA-256见 `manifest.json`。

仅由 `tests/login/course-update-choice.spec.js` 在独立测试服务中构造真实前版课包。先通过旧加载程序学习并形成浏览器缓存，再恢复当前加载程序及新版清单，验证无需清缓存即可发现并选择新版。账号、题目、作答和目录仍使用真实应用；不把冻结实现用于当前页面，亦不写入虚假学习成果。
