# Lesson 1–2：礼貌小帮手

现行设计见[2026-10-18视觉重构与历史成果保护](../docs/butcher-version/2026-10-18-0912-v3.0-Lesson1-2视觉重构与历史成果保护.md)，依据统一标准v1.54。本地未发布。

五区37题：单词寻宝5、故事小侦探5、语法小工坊12、帮忙还手提包5、综合挑战10。七句原文、21张音标词卡、五句礼貌表达、十组物品替换与七句抄写保留；无英语配音。

- 首页、封面、当前完成页复用确认纪念卡插画；`current.js/css`和`typography.css`只负责本课呈现。全身人物及提示词见[素材说明](../assets/unit1-2-current/README.md)。
- `grammar.js/css`与`completion.js/css`仍是其他课程的共享组件，本轮原字节保留。
- `content.js`保留原37题、前驱与轮次；题型覆盖只改编写元信息。示范在本次真实提交时记录，不回写旧答。
- `history.js`保留本机原记录，服务器只同步可验证的完成成果；`legacy-certificate.js`冻结旧证查看、PNG和打印，沿用旧素材、姓名和精确时间。当前奖励版`grammar-five-zones-v1`不变。
- `#learn/phrases`／`#learn/workshop`转语法工坊，`#learn/ask`转单词寻宝。

正常本地账号预览位于`http://127.0.0.1:4295/unit1-2/`，全课程首页在根目录；`/lesson/`只作为兼容挂载测试，不是新的线上入口。验证和未验范围见[证据目录](../docs/butcher-version/evidence/2026-10-18-0912-unit1-2/README.md)。
