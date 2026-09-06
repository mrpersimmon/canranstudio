# Hans 左向对话姿势

## 用途

雨伞故事右侧顾客角色。Hans 站在画面右侧，身体、视线和手势都朝向左侧服务员。

## 生成来源

- 工具：Codex 内置 `imagegen`
- 角色母版：`../dark/hans-v2-cutout.png`
- 角色母版 SHA-256：`16ba10c055f79862a4b8b80ec0678155e45cabc96bd699a34e2a689e378f8c40`
- 首次生成：`/Users/permission/.codex/generated_images/01a07648-5fe1-7bd1-b101-f1b9439ae247/exec-ae7789fe-ae76-40a7-b284-158d684befe9.png`
- 透明背景修正生成：`/Users/permission/.codex/generated_images/01a07648-5fe1-7bd1-b101-f1b9439ae247/exec-1a98754e-2123-4293-ac89-0670e29b4cff.png`
- 仓库内原始生成稿：`source/visitor-left-imagegen-rgb.png`
- 原始生成稿 SHA-256：`6bf4ac6fb453769e59ee3cc2b93a9a81d5fe210f308b0d261ab9d0ef89a83bb7`
- 最终透明 PNG SHA-256：`dfec6d6f5b48c2550f82c1722816389e3364d016049e9dbf236c7906226860e4`
- 640×960 WebP SHA-256：`1c39206ff9ad53423fc469e8e01acae026e513aff3cf55ef455730e13a7a8fb6`

两次内置 imagegen 输出均为画有浅色棋盘格的 RGB PNG，没有真实 alpha。按照项目已获授权的生成后去白底流程，仅删除与画布边缘连通的浅色背景，保留角色内部像素并导出透明 PNG/WebP；这一步没有重绘角色。

## 首次提示词

```text
Use case: identity-preserve
Asset type: full-body character cutout for the right side of a children's English interactive story
Input image: Image 1 is the identity and costume reference for Hans
Primary request: Redraw Hans as the same brown striped anthropomorphic cat customer, turning his body, head, gaze, ears, and conversational gesture toward screen-left so he is naturally speaking to a service clerk standing to his left.
Subject identity invariants: Preserve the same warm brown-and-golden striped fur pattern, brown eyes, rounded child-friendly facial proportions, blue hooded sweatshirt with drawstrings and front pocket, dark navy loose trousers, and blue backpack. Keep the same age, body proportions, recognizable face, palette, and polished character identity.
Pose and expression: Three-quarter profile facing screen-left. Both eyes clearly look left toward the unseen other character. Friendly, slightly questioning expression with a soft closed or lightly open smile. One arm extends naturally toward screen-left with a relaxed open palm as a conversational gesture; the other hand rests near the backpack strap or torso. He must not wave at the camera. He holds no prop.
Style/medium: classic Disney-inspired two-dimensional hand-drawn feature animation character art; warm expressive linework, clean readable silhouette, subtle cel shading, soft painted texture, polished children's educational app asset; consistent with the supplied reference.
Composition/framing: portrait 2:3 canvas, complete full body centered, ears, both hands, tail, backpack, both legs, and both feet fully visible with generous transparent padding. Subject fills about 85% of the canvas height. Keep the left-facing open hand inside the canvas.
Scene/backdrop: genuinely transparent background with a clean alpha channel.
Constraints: transparent RGBA output; clean anti-aliased edges; no white matte or halo; no cast shadow, floor, stage, scenery, speech bubble, text, label, watermark, checkerboard pattern, extra character, umbrella, number tag, bag in hand, or other prop.
Avoid: front-facing presentation pose, waving, looking at viewer, body facing right, cropped ears/tail/feet, duplicated limbs or fingers, missing backpack, opaque background.
```

## 透明背景修正提示词

```text
Use case: background-extraction
Asset type: transparent full-body character cutout for a children's English interactive story
Input images: Image 1 is the exact edit target and approved pose; Image 2 is the Hans identity reference.
Primary request: Remove only the pale checkerboard background from Image 1 and replace it with a genuinely transparent alpha channel.
Preserve exactly: Hans's left-facing three-quarter pose, gaze toward screen-left, open left palm conversational gesture, friendly slightly questioning expression, brown striped fur, brown eyes, blue hoodie, navy trousers, blue backpack, complete ears, hands, tail, legs, and feet. Keep the same drawing, proportions, colors, crop, canvas size, and composition.
Output: transparent RGBA PNG, portrait 1024 by 1536, clean anti-aliased silhouette and fine whisker/fur edges.
Constraints: no background pixels of any color; no checkerboard pattern; no white or gray matte; no halo; no floor or cast shadow; no restyling; no pose change; no added or removed objects; no text; no watermark.
```

## 验收

- PNG：1024×1536 RGBA，alpha 范围 0–255。
- WebP：640×960 RGBA，alpha 范围 0–255；透明度与 PNG 缩放结果一致。
- 画布四边透明；非透明主体包围盒为 `(63, 74, 973, 1473)`，主体高度占画布 91.08%。
- 完整显示耳朵、双手、尾巴、背包、双腿和双脚。
- 身体、双眼和张开的手掌朝画面左侧；没有道具，没有面对镜头挥手。
- 已分别在 `#141f23` 深色背景与浅色背景合成目检，轮廓清楚，未发现棋盘格残留。
