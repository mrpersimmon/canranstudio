# Lesson1–6 文字重叠与布局扩展审查

2026-11-01 · `codex/book-version` · 本地开发，未提交、推送或发布。

## 实际发现与修正

1. **角色名覆盖正文。** 原生430×932页面测得“工作人员”排版宽52px，姓名列仅32px，加8px间距后仍侵入正文约12px。Lesson3–4两题、Lesson5–6三题的“Mr. Blake”同样受影响，手机／平板／电脑均能复现。旧用例只比姓名元素外框与正文框，看不见文字溢出。现在按当前字体测量同段最长姓名，统一列宽；实际工作人员列宽53px，文字到正文为9px，极长姓名最多占30%并在列内换行。
2. **短材料被不必要地限高。** 320×568只读回看中，材料实际需要116px，却只给100px可见内容；选项下还空着约84.9px。改为优先自然高度，整体空间不足时才局部滚动。修正后材料116／116px完整显示，选项下仍留68.9px，外层不滚、底部操作位置不变。
3. **WebKit长句按钮保留旧的固有高度。** 判分禁用后由宽屏切到窄屏，按钮高度约78.4px，内部四行文字已需83.2px，还未计算上下留白。包span、改display:block和转移padding都未覆盖全部切换路径，已撤回这些产品改动。进一步测量确认，两次动画帧后仍越界，但截图会触发重新计算，把按钮变为99.2px；因此截图看起来完整，不能单独据此认定只是测试误报。最终保留原DOM／样式，按实际行数、行高、内边距和边框设置纯文本选项的最低高度；截图前、帧边界及截图后均不得越界。选项值、可访问名称与判分不变。
4. **窄屏长词块排列挤出最后一项。** Lesson5–6挑战第10题在320px、两个长词块开头的合法顺序下，普通flex排成三行，最后“She”被挤出，原样本曾因随机顺序不同漏过。新增只在确实省高时采用的普通分列，长块跨列、可换行、按钮至少44px；DOM／读取／键盘及保存顺序均不改，没有用dense回填重排。

检查范围扩大到已接入新版学习界面的Lesson1–6，共106题。除上述问题外，还实际检查选项与标签自身边界、图注与图片、题干与人物图、按钮之间、反馈与操作栏、课文完成区、词卡和记录弹层。没有由本轮推定其余69个单元已复查。

## 证据与回归

- 原问题：`output/test-learning-layout-audit-before`，1–2通过，3–4／5–6准确拦截中英文长姓名；原生测量与截图在本页下方。
- 新公共检查器`tests/support/learning-layout-audit.js`使用文本节点逐行Range范围，不把Range当作逐像素轮廓；配合实际截图，检查遮挡／越界、材料空白浪费、按钮相交和图文碰撞。
- `practice-screen.spec.js`把上述检查加入106题、三种必测手机及320压力样本的答前／答后观测；同题反馈位置、图片加载遮罩和触控范围的既有断言保留。
- `learning-layout-audit.spec.js`在三手机上操作三课课文、故事理解、结算、只读回看、记录、词卡展开和刷新；不修改真实用户作答。
- `learning-choice-label.spec.js`独立覆盖长句选中、禁用及四尺寸切换。诊断、失败尝试及padding实验保留在`test-choice-label-before`、`test-choice-label-after`、`test-choice-label-block`、`test-choice-padding-probe`；截图副作用证据在`test-choice-screenshot-effect`，最终行数方案在`test-choice-current-line-sizing`。实验注入及未解决问题的额外DOM／样式均已撤回。
- `learning-bank-layout.spec.js`只控制进入目标题时的一次合法Fisher-Yates随机排列，实际进入题目并完成原练习，不注入题目、答案或成绩；验证两个长词块开头时仍全部可选，原顺序不变。窗口缩放与固定320px手机上下文分别运行，不能把请求320却返回426的模拟状态称为320验收。控件完整性沿用全题检查的1 CSS px边界约定，并检查文字范围与至少44px目标；不使用会受小数像素影响的精确IntersectionObserver比例1代替几何，首次0.999736的报告保留。
- 早期按钮方案还使320px柜台场景多出4px滚动；该方案撤回后，试改的额外间距规则也已撤回。最终原按钮结构和原柜台间距保留，不为修测试累计无效补丁。
- 新审查测试曾误用不同helper的返回值、统一假定词卡按钮名称，以及在WebKit的hash切换完成前读取隐藏题号；按实际API／文案及目标面板就绪条件修正。没有把这些测试错误归为产品故障或放宽检查。

按去重范围，Chromium15项、WebKit11项影响性检查通过。两引擎各完成106题／893组答前答后观测，共1786组，最终文字／控件布局问题为0、课中加载遮罩为0；固定SE375×667、14/15 Pro Max430×932、16 Pro Max440×956及320×568压力样本，另有390×844／768×1024／1366×768题区入口。最后高度算法修改后两个引擎都重跑全部106题、长句按钮与合法词块排列；本轮未改路径的跨页／逐帧用例结果复用，不重复累加次数。

最终证据目录为`test-layout-sizing-final`／`test-layout-sizing-final-webkit`（全题及按钮）、`test-bank-scenarios-final`／`test-bank-scenarios-final-webkit`（窗口／固定320）、`test-learning-layout-audit-final`／`test-learning-layout-audit-webkit-final`（三设备跨页）、`test-learning-layout-audit-second`／`test-learning-layout-complete-webkit`（本轮逐帧稳定性相关通过部分）。每个目录中保留该阶段真实失败，不能把旧目录整批改标通过。

Node设备与工作流29项、72个受保护单元构建通过，`check:plan`已执行。已添加两个引擎的布局审查任务；未执行全量CI、真机、微信／夸克、软键盘或全部旧证迁移／导出。

题稿三个`content.js`的Git对象保持不变：1–2 `8990442d0779bec92f41b002d5ed6e0ca5edb7f8`，3–4 `b26c60e64b115099f9d5d37f83018accbc4e65bb`，5–6 `1ce92fe91298226f0e01c9c1d0aa3e810fc3fdec`。现有插画、纪念卡、学习存储键和奖励条件未改。

## 原生页面对照

| 场景 | 修正前 | 修正后 |
| --- | --- | --- |
| 430px姓名列 | [52px文字挤在32px列中](evidence/layout-audit-20261101/before-roles-430.jpg) | [53px列宽，留9px实际间隔](evidence/layout-audit-20261101/after-roles-430.jpg) |
| 320px阅读空间 | [材料截断而下方留白](evidence/layout-audit-20261101/before-material-320.jpg) | [材料完整且按钮仍在屏内](evidence/layout-audit-20261101/after-material-320.jpg) |

前两项原生对照取自4205→4206，后续按钮／词块修正不改变这两个已验证状态。[最终430px实页](evidence/layout-audit-20261101/final-roles-430.jpg)、[WebKit长句按钮](evidence/layout-audit-20261101/choice-320-webkit.png)和[固定320px手机词块](evidence/layout-audit-20261101/bank-320-webkit.png)补充最终证据。

已打开[4208本地预览](http://127.0.0.1:4208/unit3-4/#learn/roles)，停留在原用户本轮答题的只读回看，没有重练或修改成绩；原生浏览器控制台无error。

现行要求维护在[教学统一标准](../../butcher-version/publish/2026-10-24-2200-v1.55-教学单元设计标准与验收清单.md)第3.1／3.3节，不另立一份共用规范。
