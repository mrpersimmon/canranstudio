# 修复证据索引

[修复记录](../../2026-10-19-1222-v1.0-剧情提示图内字体与历史成果修复.md)；[初次问题](initial-findings.json)与[逐课修复状态](resolution-index.json)分开保留。

- [范围清单](scope.json)：17课剧情、26课字体、179幅图。
- [字体验证](fonts-verification.json)与[幂等结果](font-tool-idempotence.json)；font-gallery目录包含15张完整总览，fonts目录为26课现行页面。
- [原数据保护](preservation-final.json)：原14条学习、14条奖励和72课定义一致。
- [检查摘要](test-summary.json)：首错、复验与重叠覆盖分开记录。
- [旧证原版PNG](unit49-50/original.png)／[恢复后PNG](unit49-50/preserved.png)、[旧版PDF](unit49-50/original.pdf)／[恢复后PDF](unit49-50/preserved.pdf)、[纸面图](unit49-50/printed.png)。
- [旧证日期和像素结果](unit49-50/preservation.json)、[打印文字结果](legacy-print-verification.json)、[打印像素结果](legacy-print-pixels.json)。
- story目录含17课修复后画面，unit3-4目录含实际进度及新一轮截图。

仅包含隔离验收证据和摘要，不包含账号密码、数据库、密钥原文。127浏览器用例、11工作流用例通过；12项最后布局复验不重复计入。教师、儿童、真机、实体打印与发布仍待验。

最终文件检查见[源码与报告核对](final-source-check.json)、[仅格式调整证明](formatting-verification.json)、[报告画面](report-final.png)。此前[941个证据HTTP核对](report-validation-http.json)通过；后台常驻预览启动后续被自动审批拒绝，当前交付以本地报告为准。
