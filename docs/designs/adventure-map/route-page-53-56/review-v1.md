# 第五城区第二册页 Lesson 53–56 · 美术审查 V1

## 审查边界

本轮只把“气候家庭街”加入内部地标验收台，不进入孩子看到的正式图鉴。Lesson 53、54 已有完整课程与地标状态，因此显示为可审查地标；Lesson 55、56 尚未制作课程，只保留自然地形，不出现编号、锁、卡片或占位。

## 设计计划

- **单一任务：** 承接 Lesson 49–52 黄金册页，并为 Lesson 53–56 提供一张短纵向、四落点、路线连续的独立册页。
- **色彩：** 羊皮纸琥珀 `#c99b52`、风向苔绿 `#4e5b2c`、雨水蓝灰 `#5c7e7a`、旅途青绿 `#2c7c74`、暖灯金 `#d99b2b`、路线灰紫 `#7b648b`。
- **字体：** 中文标题继续使用 ZCOOL KuaiLe；课程编号与进度使用 Fredoka；说明文字使用 Baloo 2。验收稿不在底图中烘焙任何文字。
- **布局：** 四个落点按左、右、左、右排列；紫色石路从顶部中央进入、依次触及四个落点、从底部中央离开。
- **识别特征：** 风向绿篱、雨水沟、季节花木和家庭菜园沿路线逐段变化，让“气候家庭街”区别于第一页的风味旷野，同时保持同一图鉴材质。

```text
顶部接驳
   ┌──────────────┐
   │ L53 左侧      │
   │        L54 右侧│
   │ L55 左侧自然地 │
   │        L56 右侧自然地│
   └──────────────┘
底部接驳
```
## 自检结论

最初方案若只复制第一页的稀疏荒野，会成为通用模板，无法表达课程主题。因此本稿保留同一皮革框、羊皮纸和紫色路线，只把一个有理由的大胆元素放在环境里：一条真实跨过路线的浅雨水沟。其余装饰保持克制，四块地标安全区仍然清楚、自然且没有占位感。

## 生产候选

- ImageGen 原始输出：`/Users/sunnywinter/.codex/generated_images/019fbc71-4582-7bd0-b601-ad7557fe6608/exec-c439903d-45bd-4f4a-86f8-0930c5df47c6.png`
- 项目审查母版：`assets/adventure-map/route-pages/district5-page2/background-review-v1.png`（940×1672）
- 生成方式：内置 ImageGen；原始结果为 941×1672，仅居中裁去 1 像素宽度，没有拉伸或重绘。

## 最终提示词

```text
Use case: illustration-story
Asset type: production-ready background master for the second portrait route page of a children's English adventure atlas.

Input image roles:
- Image 1 is the approved Lesson 49–52 empty route-page background and is the authoritative reference for leather frame, parchment material, watercolor/gouache rendering, route width, warm lighting, edge treatment, and visual density. Do not copy its terrain arrangement.
- Image 2 is the complete Lesson 53 weather-broadcast cottage, used ONLY to reserve a correctly sized unobstructed placement clearing. Do not paint the building or any of its props into the background.
- Image 3 is the complete Lesson 54 international travel harbor, used ONLY to reserve a correctly sized unobstructed placement clearing. Do not paint the building, water platform, boat, globe, or props into the background.

Primary request:
Create a new bespoke route-page background named “Climate Family Street” for Lessons 53–56. It must feel like the immediate next bound page after Image 1, in the same fifth district, while having its own climate-and-daily-life terrain story.

Scene and visual signature:
A warm lantern-lit parchment landscape gradually shifts from a breezy English garden near the top, through a restrained blue-green rainwater channel and travel-garden zone in the upper middle, into a quiet family orchard and daily-life garden toward the bottom. Express weather through windswept hedges, rain-darkened stones, tiny drainage runnels, seasonal flowers and changing foliage—not through literal weather icons, text, signs or buildings.

Composition:
- Exact tall portrait composition matching a 940 × 1672 canvas ratio, with the same leather-bound frame and safe inner parchment margin as Image 1.
- One continuous violet stone route enters at the exact horizontal center of the top edge and exits at the exact horizontal center of the bottom edge, so adjacent pages join naturally.
- The route curves toward four alternating landmark clearings in strict lesson order: left Lesson 53, right Lesson 54, left future Lesson 55, right future Lesson 56.
- The route must visibly touch the approach edge of all four clearings without crossing under future building footprints.
- Clearings must remain natural terrain, not circles, pads, frames, numbered zones, locks or placeholders.
- Keep the upper half balanced after the two large published landmarks are overlaid and leave plaque space below them.

Absolute constraints:
No buildings, houses, cottages, stations, domes, ports, boats, clocks, weather instruments, plaques, badges, progress circles, cat, characters, people, animals, text, letters, numbers, logos, watermark, lock, UI, empty cards or visible placeholders. Do not stretch, crop, simplify or redesign the leather frame. Do not create disconnected route branches, dead ends, abrupt route-width changes, or a route hidden by dense vegetation.
```
