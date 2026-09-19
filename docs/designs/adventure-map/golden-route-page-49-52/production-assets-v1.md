# 黄金册页生产素材 V1

历史记录：2026-08-06 接入生产，构图依据为[V4 参考图](map-composition-review-v4-balanced-top.png)。后续小猫／旗帜标记修订见[页面检查记录](../../../../design-qa.md)。

## 文件放在哪里

| 素材 | 路径（相对项目根目录） | 原图／网页宽度 |
| --- | --- | --- |
| 空底图 | `assets/adventure-map/route-pages/district5-page1/background-master.png` | 940 × 1672／512、768、940 |
| 路线小猫 | `assets/adventure-map/mascot/explorer-cat-walking.png` | 1254 × 1254／128、192、256 |
| 当时脚底标记 | `assets/adventure-map/mascot/current-route-marker.png` | 1448 × 1086／64、96、128 |
| 加载姿态 1–4 | `assets/adventure-map/mascot/loader/frame-1.png` 至 `frame-4.png` | 1254 × 1254／128、192、256 |

运行 `npm run art:build-route-page`，从无损原图生成 AVIF/WebP。

底图只画环境与路线，地标使用课程状态图，标题和进度由网页显示。小猫与加载帧保留完整角色，每帧从前一帧局部编辑，锁定身份、画布、比例、光线和脚底位置。

原始空底图、小猫、标记和四帧的完整生成提示保存在[原文备份](../../../archive/2026-09-17-docs-before-simplification.zip)中的本文件，复现时使用原提示及对应参考图。
