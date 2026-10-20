# 剩余82项修复证据索引

[本轮记录](../../2026-10-20-0134-v1.0-Lesson1-144剩余问题修复与验收.md) · [逐课验收](../../2026-10-18-2110-v1.0-Lesson1-144系统性验收.md)。归档截至2026-10-20 01:34:58（北京时间），原始日志／trace在工作区output内保留，未复制账号密码、数据库或密钥。

- [82项关闭映射](findings.json)：保留每项原问题、题号、来源和本轮fix；第一轮46项仍在原报告和原证据目录。
- [实际检查批次](test-summary.json)、[首错分类](first-errors.json)、[本轮源码核对](source-check.json)。
- [原数据保护](preservation-final.json)：72课定义、14条学习／14条奖励、16字体／3461图片／69旧渲染文件不变。
- [正常旧页草稿](history/draft.json)、[真实账号缓存更新](history/cache-upgrade.json)；history目录保存合成测试账号页面截图。
- [性能及目录成本](performance.json)、[20次复访样本](performance/warm-visits.json)。
- [12项题型对应](type-mapping.json)、[原文行号计划](excerpt-plan.json)、[纸页核对](papers.json)、[纸页像素复用依据](paper-pixel-reuse.json)。
- material-gallery含44课320宽总览11张；paper-changes-gallery含最终10份变更25页总览7张。所有最终68页核对依据见修复记录；总览仅为查阅，原PDF保留完整分辨率。

## 答前材料：44课284题

Chromium逐题390宽，WebKit逐题320宽并检查每课代表材料四宽。这里按课提供原文、题号和代表截图；其余原始截图留在output对应批次，不能据代表图宣称全状态视觉确认。

| 单元 | 修复题号 | 证据 |
| --- | --- | --- |
| Lesson7-8 | R2 | [原文／来源行号](materials/unit7-8.json) · [320宽截图](materials/unit7-8-roles-material-320.png) |
| Lesson9-10 | R1、R3 | [原文／来源行号](materials/unit9-10.json) · [320宽截图](materials/unit9-10-roles-material-320.png) |
| Lesson11-12 | R1、R2 | [原文／来源行号](materials/unit11-12.json) · [320宽截图](materials/unit11-12-roles-material-320.png) |
| Lesson15-16 | R1 | [原文／来源行号](materials/unit15-16.json) · [320宽截图](materials/unit15-16-roles-material-320.png) |
| Lesson17-18 | R1、R2 | [原文／来源行号](materials/unit17-18.json) · [320宽截图](materials/unit17-18-roles-material-320.png) |
| Lesson19-20 | R1、R2 | [原文／来源行号](materials/unit19-20.json) · [320宽截图](materials/unit19-20-roles-material-320.png) |
| Lesson21-22 | R2 | [原文／来源行号](materials/unit21-22.json) · [320宽截图](materials/unit21-22-roles-material-320.png) |
| Lesson31-32 | R1 | [原文／来源行号](materials/unit31-32.json) · [320宽截图](materials/unit31-32-roles-material-320.png) |
| Lesson33-34 | E4 | [原文／来源行号](materials/unit33-34.json) · [320宽截图](materials/unit33-34-exam-material-320.png) |
| Lesson35-36 | E1、E7 | [原文／来源行号](materials/unit35-36.json) · [320宽截图](materials/unit35-36-exam-material-320.png) |
| Lesson47-48 | R1、R2、R3、E4 | [原文／来源行号](materials/unit47-48.json) · [320宽截图](materials/unit47-48-exam-material-320.png) |
| Lesson49-50 | R1、R2、R3、R5、E3 | [原文／来源行号](materials/unit49-50.json) · [320宽截图](materials/unit49-50-exam-material-320.png) |
| Lesson51-52 | R1、R2、R4、R5、E4、E5、E6 | [原文／来源行号](materials/unit51-52.json) · [320宽截图](materials/unit51-52-exam-material-320.png) |
| Lesson53-54 | R1、R2、R3、R4、R5、R6、R7 | [原文／来源行号](materials/unit53-54.json) · [320宽截图](materials/unit53-54-roles-material-320.png) |
| Lesson55-56 | R2、R4、R5、R6、R7、R8、E4、E5、E6 | [原文／来源行号](materials/unit55-56.json) · [320宽截图](materials/unit55-56-exam-material-320.png) |
| Lesson57-58 | R1、R2、R3、R4、R5、R6、E4、E6 | [原文／来源行号](materials/unit57-58.json) · [320宽截图](materials/unit57-58-exam-material-320.png) |
| Lesson59-60 | R1、R2、R3、R4、R5、R7、E3 | [原文／来源行号](materials/unit59-60.json) · [320宽截图](materials/unit59-60-exam-material-320.png) |
| Lesson61-62 | R1、R3、R4、R5、R6、R8 | [原文／来源行号](materials/unit61-62.json) · [320宽截图](materials/unit61-62-roles-material-320.png) |
| Lesson63-64 | R1、R2、R4、R5、R6、R7、E5 | [原文／来源行号](materials/unit63-64.json) · [320宽截图](materials/unit63-64-exam-material-320.png) |
| Lesson65-66 | R1、R2、R3、R4、R5、R6、R7、E3 | [原文／来源行号](materials/unit65-66.json) · [320宽截图](materials/unit65-66-exam-material-320.png) |
| Lesson67-68 | R1、R2、R3、R4、R5、R6、R7、E4、E5 | [原文／来源行号](materials/unit67-68.json) · [320宽截图](materials/unit67-68-exam-material-320.png) |
| Lesson69-70 | R1、R2、R3、R4、R5、R6、R8、E6、E27 | [原文／来源行号](materials/unit69-70.json) · [320宽截图](materials/unit69-70-exam-material-320.png) |
| Lesson71-72 | R1、R2、R3、R4、R5、R6、R8、E5、E8 | [原文／来源行号](materials/unit71-72.json) · [320宽截图](materials/unit71-72-exam-material-320.png) |
| Lesson73-74 | R1、R2、R3、R4、R5、R6、R7、R8、E4、E7、E9 | [原文／来源行号](materials/unit73-74.json) · [320宽截图](materials/unit73-74-exam-material-320.png) |
| Lesson75-76 | R1、R2、R3、R4、R6、E4、E7 | [原文／来源行号](materials/unit75-76.json) · [320宽截图](materials/unit75-76-exam-material-320.png) |
| Lesson77-78 | R1、R2、R3、R4、R5、R6、E4 | [原文／来源行号](materials/unit77-78.json) · [320宽截图](materials/unit77-78-exam-material-320.png) |
| Lesson79-80 | R1、R2、R3、R5、R6、R7、E4、E6 | [原文／来源行号](materials/unit79-80.json) · [320宽截图](materials/unit79-80-exam-material-320.png) |
| Lesson81-82 | R1、R2、R3、R4、R5、R6、R7、E5 | [原文／来源行号](materials/unit81-82.json) · [320宽截图](materials/unit81-82-exam-material-320.png) |
| Lesson83-84 | R1、R2、R3、R4、R5、R6、R7、E3 | [原文／来源行号](materials/unit83-84.json) · [320宽截图](materials/unit83-84-exam-material-320.png) |
| Lesson85-86 | R1、R2、R3、R4、R5、R6、R7、E1 | [原文／来源行号](materials/unit85-86.json) · [320宽截图](materials/unit85-86-exam-material-320.png) |
| Lesson87-88 | R1、R2、R3、R4、R5、R7、E3 | [原文／来源行号](materials/unit87-88.json) · [320宽截图](materials/unit87-88-exam-material-320.png) |
| Lesson89-90 | R1、R2、R3、R4、R5、R6、E2 | [原文／来源行号](materials/unit89-90.json) · [320宽截图](materials/unit89-90-exam-material-320.png) |
| Lesson91-92 | R1、R2、R3、R4、R5、R6、R7、E2 | [原文／来源行号](materials/unit91-92.json) · [320宽截图](materials/unit91-92-exam-material-320.png) |
| Lesson93-94 | R1、R2、R3、R4、R5、R6、R7、R8、E1、E2 | [原文／来源行号](materials/unit93-94.json) · [320宽截图](materials/unit93-94-exam-material-320.png) |
| Lesson95-96 | R1、R2、R3、R4、R5、R6、R7、R8、E1 | [原文／来源行号](materials/unit95-96.json) · [320宽截图](materials/unit95-96-exam-material-320.png) |
| Lesson97-98 | R1、R2、R3、R4、R5、R6、R7、R8、E1、E2 | [原文／来源行号](materials/unit97-98.json) · [320宽截图](materials/unit97-98-exam-material-320.png) |
| Lesson99-100 | R1、R2、R3、R4、R6、R7、E1 | [原文／来源行号](materials/unit99-100.json) · [320宽截图](materials/unit99-100-exam-material-320.png) |
| Lesson101-102 | R1、R2、R3、R4、R5、R6、R7、R8、E2 | [原文／来源行号](materials/unit101-102.json) · [320宽截图](materials/unit101-102-exam-material-320.png) |
| Lesson103-104 | R1、R2、R3、R4、R6、R7、R8、E2、E3 | [原文／来源行号](materials/unit103-104.json) · [320宽截图](materials/unit103-104-exam-material-320.png) |
| Lesson105-106 | R1、R2、R3、R4、R5、R6、R7、E1、E3 | [原文／来源行号](materials/unit105-106.json) · [320宽截图](materials/unit105-106-exam-material-320.png) |
| Lesson107-108 | R1、R2、R3、R4、R5、R6、R7、R8、E1 | [原文／来源行号](materials/unit107-108.json) · [320宽截图](materials/unit107-108-exam-material-320.png) |
| Lesson109-110 | R1、R2、R3、R4、R6、R7、E1 | [原文／来源行号](materials/unit109-110.json) · [320宽截图](materials/unit109-110-exam-material-320.png) |
| Lesson111-112 | R1、R2、R3、R4、R5、R6、R7、E1、E2、E24 | [原文／来源行号](materials/unit111-112.json) · [320宽截图](materials/unit111-112-exam-material-320.png) |
| Lesson113-114 | R1、R2、R3、R4、R5、E5 | [原文／来源行号](materials/unit113-114.json) · [320宽截图](materials/unit113-114-exam-material-320.png) |

## 实际练习纸：29份68页

| 单元 | 页数 | 原题项数 | 最终输出 |
| --- | ---: | ---: | --- |
| Lesson47-48 | 2 | 18 | [完整PDF](papers/unit47-48.pdf) |
| Lesson49-50 | 2 | 16 | [完整PDF](papers/unit49-50.pdf) |
| Lesson51-52 | 4 | 17 | [完整PDF](papers/unit51-52.pdf) |
| Lesson53-54 | 3 | 14 | [完整PDF](papers/unit53-54.pdf) |
| Lesson55-56 | 2 | 16 | [完整PDF](papers/unit55-56.pdf) |
| Lesson57-58 | 2 | 7 | [完整PDF](papers/unit57-58.pdf) |
| Lesson59-60 | 2 | 14 | [完整PDF](papers/unit59-60.pdf) |
| Lesson61-62 | 3 | 14 | [完整PDF](papers/unit61-62.pdf) |
| Lesson63-64 | 2 | 15 | [完整PDF](papers/unit63-64.pdf) |
| Lesson65-66 | 2 | 17 | [完整PDF](papers/unit65-66.pdf) |
| Lesson67-68 | 2 | 13 | [完整PDF](papers/unit67-68.pdf) |
| Lesson69-70 | 2 | 14 | [完整PDF](papers/unit69-70.pdf) |
| Lesson71-72 | 2 | 14 | [完整PDF](papers/unit71-72.pdf) |
| Lesson73-74 | 2 | 13 | [完整PDF](papers/unit73-74.pdf) |
| Lesson75-76 | 2 | 17 | [完整PDF](papers/unit75-76.pdf) |
| Lesson77-78 | 2 | 9 | [完整PDF](papers/unit77-78.pdf) |
| Lesson79-80 | 2 | 12 | [完整PDF](papers/unit79-80.pdf) |
| Lesson81-82 | 2 | 18 | [完整PDF](papers/unit81-82.pdf) |
| Lesson83-84 | 2 | 17 | [完整PDF](papers/unit83-84.pdf) |
| Lesson85-86 | 3 | 19 | [完整PDF](papers/unit85-86.pdf) |
| Lesson87-88 | 3 | 16 | [完整PDF](papers/unit87-88.pdf) |
| Lesson89-90 | 2 | 12 | [完整PDF](papers/unit89-90.pdf) |
| Lesson91-92 | 2 | 12 | [完整PDF](papers/unit91-92.pdf) |
| Lesson93-94 | 2 | 10 | [完整PDF](papers/unit93-94.pdf) |
| Lesson97-98 | 2 | 15 | [完整PDF](papers/unit97-98.pdf) |
| Lesson101-102 | 2 | 14 | [完整PDF](papers/unit101-102.pdf) |
| Lesson103-104 | 3 | 18 | [完整PDF](papers/unit103-104.pdf) |
| Lesson105-106 | 4 | 26 | [完整PDF](papers/unit105-106.pdf) |
| Lesson107-108 | 3 | 19 | [完整PDF](papers/unit107-108.pdf) |

[报告筛选与958条证据链接核对](report-verification.json) · [14份文档链接检查](document-check.json) · [桌面报告](report-desktop.png) · [手机报告](report-mobile.png)。

## 适用边界

未完成项仍为教师审阅、儿童试用、实体微信保存、打印机、全课弱网及正式发布；Lesson41–42现行卡稿原审美待确认保留。WebKit仅验证打印媒体和调用／恢复，实际PDF由Chromium生成；目录预备后点课指标不能替代全站首访和冷直链。未提交、未推送、未发布。
