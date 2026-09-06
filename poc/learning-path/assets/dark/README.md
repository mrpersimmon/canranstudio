# 深色页面透明素材

2026-09-06。沿用已确认、通过 imagegen 生成的猫猫和物品原图。本次用户明确授权本地去白底；原始 PNG 及生成记录均保留，没有重新绘制角色。

生成方式与美术方向见 [项目设计原则](../../../../docs/design-principles.md)。后续新增角色、物品、场景和装饰仍使用 imagegen、迪士尼绘画风格。

## 来源与导出

- 店员、顾客、探险猫、汽车：`poc/lesson1-2-experience/assets/v3/`，同目录保留生成提示词。
- 六位新同学与老师：`poc/learning-path/assets/cats/`，保留原有 `.prompt.md`。
- 寄存处：`poc/learning-path/assets/props/cloakroom-v1.png` 及同名生成记录。
- [导出清单](export-manifest.json) 逐项记录原图与成品哈希、尺寸、透明范围、保留的内部像素数量。
- [处理脚本](../../../../scripts/prepare-dark-art.py) 只删除边缘连通白底及目视确认的寄存处空隙，修正边缘白色混入。白色毛发、眼睛、衣服与原画核心像素保留。

PNG 是原尺寸无损透明母版；网页 WebP 使用质量 92 的颜色压缩和无损透明通道，完整画布等比缩小。导出时验证 alpha 通道逐像素一致，保留课程包小于 4 MiB 的原有检查。

## 验收

在 #141f23 上检查全部 11 张网页素材：完整主体、浅色毛发、脚掌和尾巴、寄存处衣架间隙、轮廓及无矩形白底。证据见 [深色底素材总览](../../../../docs/designs/unified-dark/qa/cutouts-contact.jpg)。课程实际显示还要通过浏览器矩阵、故障注入和同尺寸截图对照；仅有透明通道不等于视觉验收完成。
