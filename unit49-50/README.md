# Lesson 49–50 · 旧证与当前纪念卡

当前课程沿用[单元设计](../docs/butcher-version/2026-10-13-0130-v2.0-Lesson49-50设计与验收.md)和[统一标准v1.54](../docs/butcher-version/publish/2026-10-18-0843-v1.54-教学单元设计标准与验收清单.md)。2026-10-19的[修复记录](../docs/butcher-version/2026-10-19-1222-v1.0-剧情提示图内字体与历史成果修复.md)恢复已领取15星旧证的原卡面、查看、保存PNG和打印入口；新版五颗星纪念卡继续独立运行。

`legacy.js`读取原姓名和ISO领取时间；`legacy-certificate.js`与`legacy-certificate.css`独立渲染旧证，不复用新版DOM ID或主题。旧日期统一按Asia/Shanghai显示；查看及新版获星不回写原记录，没有有效领取时间不补造。原`certificate.js`和证书必要资产保留用于历史及前版对照。

`tests/login/unit49-50-legacy-certificate.spec.js`真实旧站领取后同库升级，比较PNG像素、原纸字体、姓名与ISO；Chromium实际PDF渲染相同，WebKit检查打印入口与结束恢复。另一时区日期、新版获星后原快照及跨设备均验证；`UNIT49_BROWSER=webkit`切换引擎。

本课答前材料及当前练习纸空白仍见[全量验收未达标清单](../docs/butcher-version/2026-10-18-2110-v1.0-Lesson1-144系统性验收.md)，不因旧证修复而标为课程全部达标。未提交、未推送、未发布。
