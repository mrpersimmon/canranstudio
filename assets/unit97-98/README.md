# Lesson97–98 素材与提示词

本课使用内置 imagegen。先对照已确认的Lesson1–2、3–4纪念卡确定圆润棕色描边与暖纸风格，生成本课双人近景，再以该图生成两个完整人物。人物是本课独立设计，不把同职业、同名或衣着相似视为跨课同一身份的证据。

原稿位于`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/`：

| 项目文件 | 原稿 |
| --- | --- |
| `keepsake-story-v1.webp` | `exec-212b7443-1f6b-478c-816e-096465da5b8d.png` |
| `hall.webp` | `exec-e87f5743-e7f1-44ba-b1f6-bc1b18eccc93.png` |
| `attendant.webp` | `exec-133850c3-985b-4af8-983f-55ec3b8d024c.png` |

项目副本仅等比缩放、转换WebP并保留透明度，不裁人物。姓名、星数、日期仍由账号生成。卡面为一起核对箱子标签的时刻，不庆祝找回，不写死教材姓名地址或答案。两位全身人物空手，舞台箱子为唯一独立道具节点。

箱包、12类物品、代词图示、背景由`scripts/art/build-unit9798-assets.js`延续项目原生SVG语言生成。小蓝箱、无标签蓝箱和大棕箱的颜色、大小、拉链与标签差异按题稿分别绘制；第一次出示的棕箱是视觉改编，不作为原文颜色事实出题。最终打开的箱子只展示中性的折叠布料，不据衣物风格猜主人性别。舞台标签以正常文字显示，只在服务员读出后出现。

## 纪念卡最终提示词

```text
Use case: illustration-story. Asset type: Lesson 97–98 keepsake illustration for an elementary English learning website. Use the two reference images ONLY as the approved visual style: rounded expressive faces, thick warm dark-brown outlines, gentle shading, warm cream and muted colors. Create two distinct new adult characters at a railway lost-property counter. Left, Mr. Hall: neatly side-parted black hair with a small angular forelock, clean-shaven, no hat or glasses, rust-red knitted waistcoat over a cream shirt, forest-green tie; an attentive slightly puzzled expression. Right, attendant: a broad round face, rectangular glasses, short grey side hair, a small thin brown moustache, dark teal service cap with a plain round brass pin and matching short service jacket. Both are looking closely at a SMALL BLUE SUITCASE resting on the counter between them, with a visible ZIP along its edge, a curved HANDLE and a small cream LABEL tied to that handle. Mr. Hall gestures toward the label with an open hand; attendant leans slightly toward it and indicates the handle. Hands and the luggage remain clearly visible, coherent, fully formed. Friendly careful checking, no celebratory handover, no claim that it is the correct case, no case opening. The label is blank. Background shelves of lost umbrellas and plain bags are soft, sparse and secondary. Medium close-up, landscape 3:2, subject fills most of frame with safe margins. No written words, letters, address, name, stars, dates, watermark, border or finished certificate design. Genuine transparent outer background with gentle vignette edge. Keep the case visibly small relative to the adults; all faces and interacting hands intact.
```

## 人物最终提示词

### Mr. Hall

```text
Use case: identity-preserve. Asset type: full-body character cutout for the same Lesson 97–98. Match the reference illustration exactly in facial style, rounded body proportions, warm dark-brown outlines, subtle shading and character identity. One person only, upright and balanced, entirely visible from hair/hat to fingertips and shoes, wide clear safe margins. Genuine transparent background. No background glow, floor, rectangle, text, labels, luggage, extra objects or other people. Empty hands. Mr. Hall, the man on the LEFT of the reference: dark side-parted hair with a small angular forelock, clean-shaven, no glasses or hat, rust-red knitted waistcoat, cream shirt with sleeves to wrists, forest-green tie, slate-grey trousers and brown shoes. Face and torso turned toward RIGHT, looking at the other speaker. One hand naturally open to the right as he describes something, the other near his side. Attentive, slightly questioning expression, not celebrating.
```

### Attendant

```text
Use case: identity-preserve. Asset type: full-body character cutout for the same Lesson 97–98. Match the reference illustration exactly in facial style, rounded body proportions, warm dark-brown outlines, subtle shading and character identity. One person only, upright and balanced, entirely visible from hair/hat to fingertips and shoes, wide clear safe margins. Genuine transparent background. No background glow, floor, rectangle, text, labels, luggage, extra objects or other people. Empty hands. The attendant, the man on the RIGHT of the reference: broad round face, rectangular dark glasses, short grey side hair, small neat brown moustache, dark teal service cap with round blank brass pin, dark teal service jacket, cream shirt, dark tie, charcoal trousers and black shoes. Face and torso turned toward LEFT, looking at Mr. Hall. One empty hand offers a polite open gesture to the left, the other relaxed near his side. Preserve the reference face and clothing. Calm attentive expression.
```
