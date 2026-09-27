# 中文用户学英语：Duolingo 题型与界面分析

- 主报告：[report.html](report.html)；本地预览 http://127.0.0.1:59042/report.html 。
- 完整操作与分支：[FLOW_AUDIT.md](FLOW_AUDIT.md)；逐步骤清单：[flow-coverage.csv](flow-coverage.csv)。
- 无需听说的题目：[独立章节](report.html#non-audio)。
- 文字版：[REPORT.md](REPORT.md)；逐项证据：[coverage.csv](coverage.csv)。
- 其他语言界面：[参考附录](reference-other-native-languages.html)，不计中文覆盖。
- 离线包：[duolingo-chinese-english-report.zip](duolingo-chinese-english-report.zip)。解压后打开 report.html。

累计 336 张原始操作截图，35 组流程，23 类有连续实测，17 类完成同题错误→恢复→正确→继续（含自动推进）的核心闭环。全条件分支穷举仍未完成。主体以中文母语学习英语为准：26 个条目有中文图证，其中 25 项有完整题页、0 项为宣传局部图、1 项仅见输入入口。另有 12 项待核实中文课程或题图。38 是研究条目数，含情境与输入变体，不是已确认的现行题型总数。所有截图拍摄版本与当前账号体验分开判断。

研究日期：2026-09-27。累计实测336张原始截图，35组流程；17类核心闭环；其中此次Super补充186张原图、19组流程。尚非全题型全分支。已有用户历史图4份，官方渠道中文图7份，其中课程入口单列。没有生成或重绘界面。文件核验见 verification.json，浏览器核验见 sources/chinese-report-browser-check.json。旧版材料保留在 background-english-all-native/ 与旧离线包，旧版不再代表当前中文范围。业务代码、Git提交、推送及官网发布均未执行。
