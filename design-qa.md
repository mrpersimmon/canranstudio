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
