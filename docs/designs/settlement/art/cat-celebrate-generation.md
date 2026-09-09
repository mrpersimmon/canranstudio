# 结算页庆祝猫素材生成记录

## 交付物

- 原始透明 PNG：`cat-celebrate-source.png`
- 页面透明 WebP：`../../../../poc/learning-path/assets/settlement/cat-celebrate.webp`
- 生成日期：2026-09-09

## 输入图像的用途

- `poc/learning-path/assets/dark/cat-cutout.png`：角色身份、配色与绘画质感参考。
- `/Users/permission/Downloads/微信图片_20260908153607_49_111.jpg`：只参考结算页中央庆祝角色的情绪与构图；不复制其中的角色、文字、界面或配色。

## 生成方式与来源

- 工具：Codex 内置 `image_gen.imagegen`
- 模式：先基于参考图生成新姿势，再通过同一内置工具执行背景提取。
- 工具未返回可记录的具体模型名称，因此不在此推测模型。
- 首次生成文件：`/Users/permission/.codex/generated_images/01a081e8-a929-75f0-8c25-c9fefff3932f/exec-0c5d3579-84f7-4716-b61c-510c75bb7327.png`
- 首次生成结果因棋盘格被写入 RGB、没有 alpha 通道而淘汰。
- 最终选用的透明源文件：`/Users/permission/.codex/generated_images/01a081e8-a929-75f0-8c25-c9fefff3932f/exec-110e53ef-0ed4-43cd-bab1-3d5c2ea61bdb.png`
- 页面资产仅做格式编码、等比缩放和透明画布留边；没有手工重绘角色。

## 新姿势生成提示词

```text
Use case: illustration-story
Asset type: transparent celebration hero character for a children's English-learning lesson-completion screen
Primary request: Create one new celebratory pose of the exact same gray British Shorthair cat mascot shown in Image 1. Preserve its recognizable identity: round gray-blue head and body, three darker forehead stripes, darker tail rings, pale muzzle, black nose, large friendly eyes, and bright golden-yellow triangular bandana. The cat is smiling joyfully and making a small airborne hop, with both front paws raised in celebration, both rear paws visible below, and the curled tail fully visible.
Input images: Image 1 is the identity and painting-style reference for the cat mascot. Image 2 is only a loose composition/emotion reference for a centered celebratory completion-screen hero; do not copy its owl, colors, text, interface, or layout.
Scene/backdrop: genuinely transparent alpha background; no floor, shadow panel, halo, glow field, scenery, or colored backdrop.
Style/medium: polished Disney-like feature-animation children's illustration, hand-painted digital brush texture, rounded expressive shapes, warm appealing face, clean silhouette, consistent with Image 1.
Composition/framing: one cat only, full body centered in a square 1024×1024 canvas; compact vertical hero silhouette suitable for display at 240×240 desktop and 180×180 mobile; keep every ear, whisker, paw, bandana tip, and tail inside the canvas with about 8% transparent safety padding on all sides. Slight three-quarter view toward the viewer.
Lighting/mood: bright, joyful, encouraging, soft studio-like painted lighting; eyes have small subtle golden star-shaped highlights inside the pupils, while remaining natural and readable.
Color palette: preserve Image 1 gray-blue fur, coral inner ears and paws, pale muzzle, and saturated golden-yellow bandana.
Constraints: actual transparent alpha background; all four paws, full tail, both ears, whiskers, bandana, and entire body must be complete and uncropped; no detached anatomy; no extra limbs; no second character; no props; no text; no letters; no numbers; no interface; no badge; no confetti; no watermark; no brand marks. Do not imitate the green owl in Image 2.
```

## 最终透明背景提取提示词

```text
Use case: background-extraction
Asset type: transparent lesson-completion celebration mascot
Primary request: Convert the visible gray-and-white checkerboard in Image 1 into truly transparent alpha pixels. Keep only the illustrated gray British Shorthair cat with yellow bandana.
Invariants: preserve the cat exactly—same joyful airborne pose, proportions, facial expression, subtle golden star highlights in the eyes, colors, painted texture, complete tail, all four paws, ears, whiskers, and bandana. Do not redraw the cat.
Composition: square canvas, cat centered, every extremity complete, at least 8% transparent padding.
Hard requirements: output file must contain a genuine alpha channel; every background pixel must be transparent; there must be no checkerboard pixels or backdrop remaining.
Avoid: checkerboard, solid background, floor, shadow panel, halo, scenery, text, props, confetti, second character, watermark, brand marks.
```

## 编码与验收

- 原始 PNG：1254 × 1254，RGBA，SHA-256 `2cfc66e0745e5641c6492983c41fd60be348ed238390f753b1522fa7b32522f0`。
- 页面 WebP：1024 × 1024，RGBA，86,160 bytes，SHA-256 `b37dfdb10192cdf25a62eaad693f3dc5192eac7b2a2cebefff18e95b8518d19b`。
- WebP 四角 alpha 均为 0；alpha 范围为 0–255。
- 页面资产的非零 alpha 外接框为 `(82, 96)–(905, 942)`，四边透明留白依次为 82、96、119、82 px，最小留白达到画布的 8%。
- 已在 `#141f23` 页面背景上按 240 × 240 和 180 × 180 两种实际展示尺寸检查：脸部、星光眼睛、黄色围巾、双手举起动作和完整尾巴仍清楚，边缘没有棋盘格或实色底。
