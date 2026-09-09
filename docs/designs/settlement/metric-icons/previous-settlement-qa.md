# 结算界面验收 · Duolingo 参考重构

2026-09-09 · codex/duolingo-version · 本地实现

final result: passed

实现、实际页面验收、专项复验和全课程浏览器矩阵已完成，最终版本指纹核验通过。本次未提交、推送或发布。

## 范围与参考

重构普通闯关、重练、今日复习、输入挑战、跳级成功/失败和全册回顾。Lesson 1–144 的 72 分区、354 主线关卡、1,567 活动与 73 组 580 道输入挑战保持原有内容和答案。

主要视觉依据是用户提供的 [Duolingo 结算页原图](../../../../docs/references/duolingo/2026-09-09/settlement/user-reference.jpg)，不是通用仪表盘模板。实现保留同一深色画布、中央角色、简短结果、三张表现卡和底部蓝色主按钮。按既定美术方向使用 imagegen 生成完整灰猫，原图和生成记录见 [素材说明](../../../../docs/designs/settlement/art/cat-celebrate-generation.md)。

有意适配：使用我们的猫猫与 Lesson 标签；卡片展示真实完成步骤/题数、连对或听过词句和本次用时；不引入未实现的经验账本与分享按钮。跳级展示本次测试的答对题数、最佳连对和剩余机会，失败时使用温和招手猫。全册回顾明确展示历史总量，不能冒充本次闯关。

## 原图与实拍共同检查

原图 1260×2720，等比归一为 420×907；正式组件实拍 420×906，滚动位置均为顶部，页面处于完成状态，动画已结束。浏览器保留原生滚动条占位，实际内容宽度为 405px。参考图的手机系统状态栏不属于网页实现。

- 整屏：[原图归一](../../../../docs/designs/settlement/evidence/reference-420.png) 与 [新版 420×906](../../../../docs/designs/settlement/evidence/normal-420-final.png)，在同一轮工具结果中共同打开比较。
- 成绩卡：[参考重点区域](../../../../docs/designs/settlement/evidence/reference-metrics.png) 与 [实现重点区域](../../../../docs/designs/settlement/evidence/implementation-metrics.png)，两者均以 420px 原画幅裁取后 2 倍显示。
- 底部操作：[参考按钮](../../../../docs/designs/settlement/evidence/reference-action.png) 与 [实现按钮](../../../../docs/designs/settlement/evidence/implementation-action.png)，比较触发区、底边厚度、圆角和视觉主次。
- 响应式：[320×568 输入挑战](../../../../docs/designs/settlement/evidence/challenge-320-final.png)、[906×801 复习](../../../../docs/designs/settlement/evidence/review-906-final.png)、[1440×900 桌面](../../../../docs/designs/settlement/evidence/normal-1440-final.png)。
- 状态变化：[420×856 跳级成功](../../../../docs/designs/settlement/evidence/placement-passed-420-final.png)、[420×856 跳级失败](../../../../docs/designs/settlement/evidence/placement-failed-420-final.png)。

核对了角色全身和透明边缘、主题与三卡颜色分工、标题和数字层级、间距、按钮宽度和可读性。截图中的测试时钟仅用于重现布局，不代表真实用户成绩。当前未发现仍需修改的 P0/P1/P2 视觉问题。

实际计算样式确认画布为 `rgb(20,31,35)`；字体沿用课程的 Arial / PingFang SC / system-ui 组合。桌面标题 36px、正文 20px、卡片标签 14px、成绩 30px、主按钮 18px；420px 布局分别收敛到 27px、16px、12px、23px、18px。短标题突出、正文与数字可读的职责一致，未把参考图未知的字体当作已精确复刻。

## 已发现问题与修复

| 级别 | 问题与原因 | 修复及复验 |
| --- | --- | --- |
| P2 | 首轮 H1 被程序聚焦后出现浏览器默认描边，破坏标题层级；旧检查只判定可读性 | 仅去掉非交互标题描边，按钮保留 3px 可见键盘焦点；整屏复拍与 Tab 实测通过 |
| P2 | 底部按钮沿用旧 max-width，未铺满新版内容区；命中检测不会发现宽度不符参考 | 结算专用按钮限制在内容最大宽度内并铺满；320px、420px 和桌面复拍通过 |
| P1 | 新增后台计时事件走整页 render，会替换正在输入的答案框；运行时测试看不到 DOM 和光标 | 已在正式控制器复现，然后改为仅更新时钟状态；挑战和跳级夹具逐次验证输入框节点、焦点和光标保持，四尺寸正式矩阵也将此设为必需项 |
| P2 | 旧进度条故障注入先完成关卡，再查找结算页进度条；新版移除答题栏使脚本前提失效 | 最小页面复核确认结算无进度条、重练答题页有 0/10 进度；将同一故障注入移到答题页，增加状态断言、恢复原属性并提前执行；原有检测规则保留，全矩阵按新指纹重跑 |

详细症状、原因、遗漏机制与防护见 [设计与复发防护](../../../../docs/designs/settlement/README.md)。初版外观保存在 [首次截图](../../../../docs/designs/settlement/evidence/normal-420-v1.png)，不能当作最终版本证据。

## 实际页面交互

从实际首页 http://127.0.0.1:42862/ 进入第 1 关，使用原生音频和实际存储完成。音频结束前继续按钮保持禁用，结束后可推进；刷新后从保存处恢复，完成页仅记录刷新后本次完成的 2 步、1 次连对与 0:34，用时在结果页冻结。[实际恢复后结算](../../../../docs/designs/settlement/evidence/actual-resumed-completion.png)。点击“回到路线”后，第 1 关仍已完成，第 2 关等待主动进入，无自动开课；控制台错误列表为空。

在隔离 QA 页面另验：普通结算从标题按 Tab 到“回到路线”，焦点描边为 3px 蓝色，按回车停在路线；失败结果依次可到达“再试一次”和主按钮；挑战重置仍出现确认，取消可恢复。减少动态效果开启时，角色计算样式 animation-name 为 none；验收后已恢复浏览器尺寸和媒体偏好。

## 检查结果

| 检查 | 当前结果 |
| --- | --- |
| 首轮全量程序套件 | 108 项，105 通过；3 项仍断言旧结算结构，已按新设计更新而未降低原有流程检查 |
| 最终专项复验 | 结算与证明门禁 6/6 通过；遍历全部 354 关的课程总结用例 1/1 通过。未重复运行整套 108 项 |
| 浏览器矩阵 | 最终全量重跑通过：40,864 个页面状态无违规；320×568、420×856、906×801、1440×900 各 10,216 个状态，17 类故障注入全部拦截。未沿用首轮失败结果 |
| 版本指纹 | verify:visual 通过，确认浏览器证明对应当前实现；指纹为 33e9406b2d73e1054a18b9fe5f34d3ea8f7fb9c134ae881dce533248f7e38e8e |
| 新增防护 | 后台计时不替换输入框；结算三卡必须对应当前统计；注入历史总数与答题顶栏必须被拦截 |
| 课程包 | build:course 成功，74 个启动文件、3,258,814 字节 |
| 发布状态 | 未提交、未推送、未部署；本次是本地重构和验收 |

原有对比度、素材透明度与全身、按钮遮挡、滚动条、节点间距、快速点击、保存/恢复、跳级五错和返回边界防护均保留。当前应拦截的故障注入共有 17 类，见 [可读性防护网](../../../../docs/designs/readability-guard/README.md)。自动矩阵使用音频完成适配器，不等于逐条人工试听。

完整失败记录摘要见 [检查脚本前提失效](../../../../docs/designs/settlement/evidence/guard-state-failure.json)，其 40,960 个状态不能作为通过证明。

最终结构化结果见 [验收摘要](../../../../docs/designs/settlement/evidence/verification.json)，包含四尺寸数量、故障拦截、真实页面交互及截图校验值。

本地课程：http://127.0.0.1:42862/ 。隔离结算预览：http://127.0.0.1:42863/__qa__/frame.html?settlement=normal 。此前跳级验收保留在 [历史快照](../../../../docs/designs/settlement/evidence/previous-placement-qa.md)。
