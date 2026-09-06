# 服务员猫右向姿势

- 生成方式：内置 `imagegen`
- 用例：`identity-preserve`
- 身份参考：`../../dark/customer-cutout.png`
- 原始生成文件：`attendant-right-imagegen-original.png`
- 透明切图：使用仓库既有、已获授权的白底连通域清理流程；未重绘角色像素。

## 最终提示词

Create a production PNG character cutout based on the reference cat. Keep the same cream fur, huge blue eyes, pink nose and inner ears, red crewneck sweater, dark navy cuffed trousers, bare paws, curved tail, childlike proportions, and polished classic Disney-style 2D hand-drawn animation look.

Pose: full body in a clear three-quarter view facing canvas RIGHT. The face and eyes look right toward an unseen customer. One hand rests near the chest; the other arm extends toward the right with an open palm in a friendly questioning gesture. Warm, helpful expression. No object.

Canvas: portrait 1024 x 1536. The complete cat occupies about 85% of the height. Every ear, whisker, finger, tail, foot, and garment edge remains inside the frame with a clean margin.

OUTPUT AS A REAL TRANSPARENT PNG CUTOUT. The background alpha must be 0 everywhere outside the character. The character must be opaque. Do not draw any background pixels. Do not draw a checkerboard. Do not draw white, black, gray, beige, or colored backdrop. Do not draw glow, vignette, halo, aura, mist, ground, shadow, pedestal, scene, border, text, logo, watermark, umbrella, ticket, or number tag. Exactly one cat and nothing else.

## 透明度处置记录

内置生成输出把棋盘格烘焙进 RGB，不能直接作为透明素材。先通过 imagegen 进行了三次针对性透明背景修正；仍未得到可用的真实透明输出。最终仅移除与画布边缘相连的近白棋盘格，并生成真实 alpha；角色内部像素保持不变。

深色背景复核时又发现角色主体之外存在 65 个独立的近白小连通块，共 154 像素，最大单块 12 像素。二次技术清理仅将这些与主体完全断开的近白小块设为透明；完整角色主体以及与主体相连的奶油毛色、轮廓和胡须均未改动。随后重新导出 PNG 与 WebP。
