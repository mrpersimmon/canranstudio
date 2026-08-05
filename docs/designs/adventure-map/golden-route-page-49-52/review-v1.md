# Lesson 49-52 黄金册页 · 高保真美术审查 V1

## 审查范围

本轮只审批美术方向，不是上线资产审批，也不包含网页代码。

- `map-composition-review-v1.png`：审查四地标构图、路线、空白铭牌、当前高亮和移动端纵向比例。
- `loader-storyboard-a-plus-v1.png`：审查探险小猫身份、完整姿态一致性、第五城区装扮和动作叙事。

地图审查稿中的建筑由图片模型依据现有正式地标参考重新绘制，只用于构图。生产实现必须回到每课同一高清母版，逐状态编辑并锁定几何；中文标题与进度由 HTML 清晰渲染。加载分镜也不能直接裁成生产动画帧，各姿态需要从同一角色锚点逐一编辑和复核。

## V1 观察点

### 地图构图

- 四个地标按 Lesson 49、50、51、52 从上到下交错排列；
- 紫色石路形成一条连续主线，页面不再依赖旧长底图；
- 四座建筑没有互相覆盖，空白铭牌各自靠近地标；
- Lesson 51 以场景内金色光和路线信标表达“当前闯关”；
- 羊皮纸与皮革边框保留冒险图鉴感。

### A+ 加载角色

- 四格保持同一只橘猫、相同服装与背包；
- 使用完整姿态而非身体零件拼接；
- 动作依次为卷图、展开、罗盘确认和路线点亮；
- 蓝金围巾、橄榄枝、暖灯和罗盘连接第五城区；
- 后续生产帧仍需进一步锁定眼睛、脚底、阴影和地图桌的像素锚点。

## 生成方式

使用内置 ImageGen，参考现有 Lesson 49-52 完成态与 Lesson 51 美术母版生成；没有使用 CLI 或透明背景降级路径。

## 地图构图提示词

```text
Use case: ui-mockup
Asset type: high-fidelity portrait art review for a mobile English-learning adventure map
Input images: Image 1 is the exact Lesson 49 butcher-shop landmark reference; Image 2 is the exact Lesson 50 healthy royal kitchen-castle reference; Image 3 is the exact Lesson 51 Greek four-seasons garden and the art-quality master; Image 4 is the exact Lesson 52 international travel station reference; Image 5 is the overall watercolor style and composition reference.
Primary request: Create one new short vertical atlas route page containing exactly these four distinct landmark worlds, clearly recognizable from their references, connected by one continuous natural winding path in lesson order. This is one route page for Lessons 49-52, not a collage and not a course directory.
Scene/backdrop: aged warm parchment map inside a subtle leather-bound explorer atlas frame; one coherent living landscape that transitions gently from a warm market grove to a vegetable orchard, a Mediterranean coastal garden, and a classic travel-station approach.
Composition/framing: portrait 9:16 mobile map; four large readable landmarks arranged in an alternating zig-zag from top to bottom with generous breathing room and no overlap: butcher shop upper-left, royal healthy kitchen-castle upper-right, Greek four-seasons garden lower-left, international travel station lower-right. A single hand-painted S-shaped stone-and-purple route must visibly touch the entrance of every landmark in order and continue toward an exit at the bottom. The whole page should feel about 1.5-2 phone screens tall.
UI art: under each landmark, include one compact blank cream parchment nameplate with an accent border matching that landmark and five tiny empty circular seal positions. Highlight only the Greek garden as the current quest using subtle warm golden lamps, a small route beacon, and gentle glow integrated into the scene. No large recommendation panel.
Style/medium: premium children's storybook watercolor and gouache, restrained brown ink lines, warm natural light, three-quarter isometric view, dense but orderly botanical detail, cream die-cut outlines around landmark worlds, same polish and detail density as the Greek reference.
Constraints: preserve the four architectural identities and their thematic meaning; keep landmarks upright, consistently scaled, and fully visible; route must connect all four; all plaques must remain blank for later HTML text; no extra landmarks; no humans; no readable text, letters, lesson numbers, logos, watermark, locks, question marks, grey placeholders, floating crowns, floating meat, red boxes, detached decorations, overlapping buildings, cropped buildings, stretched geometry, duplicated landmarks, or UI modal.
```

## A+ 加载角色提示词

```text
Use case: illustration-story
Asset type: A+ whole-pose animation storyboard for a mobile map-loading mascot
Input images: Image 1 is the watercolor-and-gouache quality master; Image 2 is the approved direction for District 5 palette, parchment, route, and detail density.
Primary request: Create a polished 2x2 storyboard contact sheet showing the exact same friendly orange tabby explorer cat in four complete full-body poses for a seamless storybook loading loop. This is an art-production pose sheet, not a comic narrative.
Subject: one small orange tabby cat explorer with a round expressive face, cream muzzle, amber eyes, short purple travel cape, blue-and-gold scarf, and a compact warm-brown backpack. Preserve exactly the same face, markings, body proportions, outfit, backpack, camera angle, scale, lighting, shadow, cream die-cut outline, and foot anchor in all four panels.
Four poses in reading order: panel 1 the cat holds a neatly rolled parchment map and looks focused; panel 2 the cat begins opening the map with both paws; panel 3 the cat has the map fully spread on a small portable map board, one paw holding it flat while a four-seasons compass glints; panel 4 the cat looks up with a satisfied gentle smile as one small golden route beacon appears on the map, ready to loop back to panel 1.
Scene/backdrop: identical simple warm parchment backdrop in all panels, with only a few restrained District 5 props—an olive sprig, tiny market lantern, and blue-gold compass motif—kept in the same positions.
Style/medium: premium children's storybook watercolor and gouache, restrained brown hand-ink lines, warm natural light, subtle paper grain, finely painted fur and fabric, same visual family as the Greek four-seasons garden. Charming hand-painted cel-animation feeling, not flat vector art.
Composition/framing: four equal square panels in a clean 2x2 grid with thin cream gutters; the entire cat and map are fully visible with generous padding; every pose uses the same baseline and camera.
Constraints: each panel must show a complete precomposed character pose; do not depict separated body parts, cutaway limbs, puppet joints, extra cats, duplicated tails, changing facial identity, changing clothes, changing proportions, moving ground shadow, stretched anatomy, photorealism, 3D rendering, flat vector style, readable text, labels, arrows, numbers, logos, watermark, buildings, or busy scenery.
```
