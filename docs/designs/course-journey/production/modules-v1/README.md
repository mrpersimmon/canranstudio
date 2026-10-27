# Lesson 1–12 独立场景美术包 modules-v1

本包用于首页 Lesson 1–12 的六个独立场景样板。保留原人物，在新地面模块内校准接触关系；外围海水底图只负责环境氛围。Lesson 13–144 暂不替换。实现与验收见[独立场景样板设计记录](../../2026-10-23-Lesson1-12独立场景样板.md)。

## 实际交付与生成记录

已依据真实 request、receipt 和磁盘文件核实：**10 次内置 image_gen 调用，采用 7 个资产，保留 3 个首稿。** 不是 7 次调用，也不是 7 张页面完成截图。

| 采用资产 | 内容 | 实际调用 | 实际请求 |
| --- | --- | ---: | --- |
| unit1-2-ground | 礼貌归还手包的小花园露台 | 2 | [首稿](unit1-2-request.json)、[接地与留白改稿](unit1-2-request-v2.json) |
| unit3-4-ground | 失物招领小亭地面，中央供原柜台组合使用 | 1 | [请求](unit3-4-request.json) |
| unit5-6-ground | 朋友见面会的小学堂庭院 | 2 | [首稿](unit5-6-request-v1.json)、[留白改稿](unit5-6-request-v2.json) |
| unit7-8-ground | 新朋友采访站的花架谈话露台 | 1 | [请求](unit7-8-request-v1.json) |
| unit9-10-ground | 街角问候的珊瑚拱廊露台 | 2 | [首稿](unit9-10-request.json)、[留白改稿](unit9-10-request-v2.json) |
| unit11-12-ground | 校园失物招领室外庭院 | 1 | [请求](unit11-12-request.json) |
| ambient-water-v1 | 中央留空的海水氛围底图 | 1 | [请求](ambient-water-v1-request.json) |

六块地面均为真实 1536 × 1024 原始 PNG，实测 alpha 范围 0–254。底图为 1024 × 1536，不透明。每项另有同尺寸 WebP；原 PNG 按字节保留。1–2 和 3–4 为 lossless WebP，5–8 为 quality 92、alphaQuality 100，9–12 和底图按其 receipt 记录编码。这里只做格式编码，不裁切、去背、涂画、重采样或把人物烧入地面。

三份保留首稿：

- [1–2 首稿](unit1-2-ground-first-generation.png)：站立地面结束过高，改浅前墙后采用第二稿。
- [5–6 首稿](variants/unit5-6-ground-v1.png)：请求增加透明边距，采用第二稿，边距仍有偏差。
- [9–10 首稿](unit9-10-ground-first-generation.png)：请求增加透明边距，采用第二稿，边距仍有偏差。

## 参考角色与复用人物

环境风格参考是原 opening-mobile-v2 和 neighborhood-mobile-v1：奶油石材、珊瑚墙体、青绿植物、左上暖光、柔和体积和略俯视的绘本游戏场景。

人物参考只用于身份、配色、比例和鞋底接触关系，**禁止生成到新地面中**。运行时继续原样使用：

| Lesson | 原人物 |
| --- | --- |
| 1–2 | handbag-couple.webp |
| 3–4 | umbrella-counter-v1.webp（含人物与柜台） |
| 5–6 | friends-trio-v1.webp |
| 7–8 | interview-couple-v1.webp |
| 9–10 | greeting-neighbors-v1.webp |
| 11–12 | shirt-return-v1.webp |

5–6 首次请求还引用 interview-couple-v1 作为配色/比例辅助。7–8 引用了已生成的 5–6 第二稿作为相邻地面风格参考。三次改稿均引用相应首稿作为编辑目标。完整路径与请求正文按实际调用保留，不能事后重写成未调用过的理想提示词。

## 构图偏差与使用边界

提示词要求至少 8%（部分请求 9%–10%）透明安全边，但六张采用地面均未完全满足所有方向，**不得宣称该项已达标**。真实 alpha 边界见各 receipt；界面容器必须增加外围空间，保留完整平台和人物，不能用裁图隐藏偏差。

地面的安全站立区是资产视觉复核建议，不等于页面验收。大部分建议鞋底 y=.72；1–2、3–4 建议 y=.71。人物脚、柜台腿和平台地面必须在最终组合中逐项复核。新美术本身不证明响应式、点击、选中、星章或真实接地已通过。

## 冻结与只读校验

[verify-manifest.cjs](verify-manifest.cjs) 内嵌 SHA-256 Manifest，冻结 42 个真实文件：14 个采用 PNG/WebP、10 个请求、7 个 receipt、3 个保留首稿和 8 个原始参考 WebP。脚本只读取仓库文件，比对字节数与 SHA；不写文件、不重算并保存基准、不访问历史机器上的生成目录。

在仓库根目录运行：

```text
node docs/designs/course-journey/production/modules-v1/verify-manifest.cjs
```

运行代码、人物坐标、布局文件、可继续补充的设计文档与验收截图不在本美术冻结范围。若以后更换图片或提示词，应新建版本包，不修改此包的历史生成记录。验证通过仅代表冻结文件一致，不代表页面或设备体验通过。

页面验证、手机与平板/电脑截图、交互回归、最终预览地址由主任务在设计记录中补充。发布状态也由主任务单列。

