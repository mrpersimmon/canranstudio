# 上传评审修复 · 当前本地验收

2026-09-09 · `codex/duolingo-version` · `lesson1-144-v6.1`

final result: passed

当前课程为 144 课、72 分区、354 关、1,573 活动。本轮完整页面矩阵及实际浏览器专项均已通过，范围限于本地实现和验证。

- 22 项问题回归通过，覆盖历史判分和题序、迁移备份、损坏恢复、小草稿、跨标签页冲突、语法误因、词汇先修、延后新句及旧节点补做新题。
- 完整单元检查 132/132 通过，无跳过项目；当前启动资源为 74 个、3,462,429 字节。
- 完整页面矩阵 40,960 个状态通过：320×568、420×856、906×801、1440×900 各 10,240 个状态，每种尺寸覆盖全部 1,573 个主线活动及 580 个挑战题，违规数为 0。
- 17 类故障注入 × 4 种尺寸，共 68 次，全部被检出。`npm run verify:visual` 通过，重建后指纹相同。
- 真实首页的草稿刷新、原始记录导出、有效备份恢复，以及断网刷新、新页面和浏览器进程重启通过；23 字符输入没有改写完整进度。
- 六个新主线输入任务与三类次日新句已通过正式组件的浏览器操作。320px 下检查后“继续”按钮仍在 568px 高的视口内，底边为 555px。
- 2,823 份音频解码证明对当前媒体有效；当前包的 31 次原生结束、Range、离线重播和前六课进度保留通过。没有逐段人工试听全部录音。
- 4 倍 CPU 限速下，新、半本及全本记录的输入处理和地图布局均作了同机前后测量。结果是受控浏览器测量，不是真实手机的端到端响应保证。

[完整实施与验证记录](docs/designs/review-repair-20260909/README.md) · [修复前恢复页](docs/designs/review-repair-20260909/evidence/recovery-before-33a82bb-420.png) · [修复后恢复页](docs/designs/review-repair-20260909/evidence/recovery-420.png) · [320px 改错题](docs/designs/review-repair-20260909/evidence/L49-grammar-correct-320.png) · [320px 次日复习](docs/designs/review-repair-20260909/evidence/delayed-review-320.png)

最新正式首页：[手机路线](docs/designs/review-repair-20260909/evidence/map-420.png) · [桌面路线](docs/designs/review-repair-20260909/evidence/map-1440.png)。初始为 2 个分区、6 个节点，目录、展开全部和定位入口都保留。

本轮仍在工作区，保留已有 `6872844` 结算改版提交；未提交、推送或部署本轮修复。正式发布构建被现有“公共输入必须与 HEAD 一致”规则拦截，未绕过。完整数据与指纹见 [验收摘要](docs/designs/review-repair-20260909/evidence/validation-summary.json)。

---

以下是本轮修复前的专项验收历史，数值和预览地址属于当时状态。

# 结算图标与文案 · 本地专项验收

2026-09-09 · codex/duolingo-version

final result: passed

本结果限于本次结算文案与三枚图标。没有提交、推送或发布。

## 已完成

- “完成步骤”改为“完成题目”。
- 完成题目、最佳连对、本次用时分别使用内置 imagegen 生成的金色勾选徽章、蓝色靶心、绿色秒表，绘画质感统一。
- 图标以真实透明 WebP 接入 catalog，原始生成文件与提示词保留；使用独立图片类，避免被单色图标滤镜改变颜色。
- 窄屏长数值适配：20/20 在 320px 屏幕上留出内边框间距；防护网增加内侧留白与彩色图标透明度检查。

## 验证

| 范围 | 结果 |
| --- | --- |
| 结算相关程序检查 | 现有 4 项通过，覆盖计时、后台暂停、重练、独立连对、保存失败与恢复 |
| 课程包 | 构建通过，74 个启动文件、3,260,192 字节；三枚图标共 49,484 字节，按需加载 |
| 实际浏览器 | 正式组件的隔离预览，6 种结算状态 × 4 个尺寸，共 24 个状态通过 |
| 图像与布局 | 真 alpha、资源加载、原始配色、图标居中、数字间距、无溢出与视口内主按钮已检查；已对照小屏和桌面截图 |
| 最窄屏幕长数值 | 20/20 左右边距约 5.64px（含 3px 边框），与图标不重叠 |
| 全课程发布证明 | 本次未重新遍历全部课程；上一版的 40,864 状态通过记录已因代码和素材变化过期，不能沿用为当前发布凭证。发布时仍需按现有防护网重新生成证明 |

[详细修复记录与素材](docs/designs/settlement/metric-icons/README.md) · [24 个状态的几何记录](docs/designs/settlement/metric-icons/layout-checks.json) · [手机截图](docs/designs/settlement/metric-icons/normal-420.jpg) · [桌面截图](docs/designs/settlement/metric-icons/normal-1440.jpg)

[上一轮完整结算验收历史](docs/designs/settlement/metric-icons/previous-settlement-qa.md)包含当时的实际音频操作、全课程矩阵和版本指纹；它是历史证据，不是本次重新执行的检查。

本地课程：<http://127.0.0.1:42862/>。新版结算演示（隔离测试数据）：<http://127.0.0.1:42863/__qa__/frame.html?settlement=normal>。
