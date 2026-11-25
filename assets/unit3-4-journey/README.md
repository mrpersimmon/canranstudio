# Lesson3–4 认领亭视觉固定包 v1

2026-11-01，使用内置 ImageGen。首页认可角色与环境为美术基准，原纪念卡继续保留。此目录只承载课内新素材；主规则见[教学统一标准](../../docs/butcher-version/publish/2026-10-24-2200-v1.55-教学单元设计标准与验收清单.md)。

## 不变量

- 主参考：`assets/course-journey/umbrella-counter-v1.webp`，黄帽、青绿马甲顾客；小胡子、紫红马甲工作人员。圆脸、大头短身、暖棕轮廓与柔和体积。
- 环境参考：`assets/course-journey/modules-v3/opening-world-v1.webp`，紫顶认领亭、奶油暖石、珊瑚拱窗、青绿水面和左上暖光。背景不生成角色、柜台、衣服、雨伞、数字或UI，避免答案泄露。
- 道具仍按原剧情：红色纯色伞→黄色条纹伞→紫色奶油圆点伞；紫伞确认后领回，寄存牌只写5。不可为美术统一改变教学事实。
- 环境是3:2完整画板；人物、柜台、独立道具同坐标叠放。透明图保留原画布与alpha，通过实际可见边界和握点定位，不按文件外框猜接触关系。
- 禁止另画纪念卡、改题库、改学习签名，或将已获日期迁成新日期。角色动作可以变化，身份不能漂移。

## 实际素材与提示词

| 采用WebP | 完整实际提示词、参考、生成原稿与检查 |
| --- | --- |
| `cloakroom-interior-v1.webp` | [environment-receipt.json](environment-receipt.json) |
| `visitor-v1.webp` | [visitor-receipt.json](visitor-receipt.json) |
| `attendant-v1.webp` | [attendant-receipt.json](attendant-receipt.json) |
| `counter-v1.webp` | [counter-receipt.json](counter-receipt.json) |
| `coat-v1.webp` | [coat-receipt.json](coat-receipt.json) |
| `ticket-v1.webp` | [ticket-receipt.json](ticket-receipt.json) |
| `umbrella-purple-v1.webp` | [umbrella-purple-receipt.json](umbrella-purple-receipt.json) |
| `umbrella-red-v1.webp` | [umbrella-red-receipt.json](umbrella-red-receipt.json) |
| `umbrella-yellow-v1.webp` | [umbrella-yellow-receipt.json](umbrella-yellow-receipt.json) |

同名PNG为保留的生成原稿。每个receipt保留实际提示词，不用事后整理的摘要代替。红、黄伞均以紫伞原PNG为编辑目标，保持同画布与伞杆／握柄；alpha掩码不是逐像素一致，实际重合度与一像素边界差已记录。

[manifest.json](manifest.json)固化采用图尺寸、字节数、SHA-256与参考图SHA。内置工具没有暴露固定seed或模型修订号，不承诺再次生成逐像素相同；后续优先复用本包，必要新动作仍附同一角色参考并进行并排验收。

运行时只注册九张明确的WebP，共862980字节。不得在脚本中用以斜线结尾的素材目录前缀引用：课程收集器会将目录内原PNG一起加入下载包。PNG、receipt与未采用稿保留，不作为学生运行依赖。
