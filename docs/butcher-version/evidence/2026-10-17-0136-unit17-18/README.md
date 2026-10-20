# Lesson17–18 五星重构证据

对应[设计与验收](../../2026-10-17-0136-v3.0-Lesson17-18五星重构与验收.md)，分支`codex/release-canranstudio`。本地开发与实际验证完成；未提交、未推送、未发布，教师／儿童／真机微信／实体打印仍待验。

- [验证与复验范围](verification.json)：163项独立测试条件，初始失败、修订和复用分别记录。`reports/`保留12份运行报告，重复运行不累加。
- [来源与课包核对](source-and-package-checks.json)：原29题、16句、30词卡、56份旧素材、新图alpha／尺寸、字体源摘要、脚本与文档检查、两路径72单元构建。
- [改动摘要](changes.json)：与本轮操作前工作树比较；不把此前其他课程的未提交工作计成本轮改动。
- [预览数据保护](preview-data-check.json)：原数据库和密钥沿用，其他课程的6条进度记录不变；仅保留汇总，不含学生标识、口令或作答内容。[当前预览](preview.png)显示新纪念卡，0星不发奖。
- [练习纸](worksheet.pdf)及[旧证书样例](legacy-certificate.pdf)：三页和一页，逐页渲染在同目录PNG；示例姓名为测试账号。
- [前版证书PNG](original-certificate.png)与[升级后证书PNG](retained-old-certificate.png)：原姓名、日期、1440×1100尺寸、原配色及版式对照。
- `story-*`、`grammar-*-unanswered.png`、`completion-*`记录代表场景、未答材料及修订后的完成画面；`one-star-*`、`five-star-mobile.png`、`long-name-mobile.png`记录卡面、导出帧及姓名适配。
- [插画溢出定位](overflow-diagnosis.json)、[短屏滚动定位](short-scroll-diagnosis.json)和[许可证空白初检](whitespace-check-initial.json)保留发现依据。所有实际变更、原断言与复验边界见设计记录。

教材扫描原件与中间页图仍在用户原路径及本机`tmp/unit17-18-refactor/sources/`；本目录不复制整本教材。六个新素材使用内置ImageGen，完整提示词及最终文件见[素材记录](../../../../scripts/art/unit17-18-prompts.json)。
