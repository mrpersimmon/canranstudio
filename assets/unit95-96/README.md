# Lesson95–96 图像与来源

本课使用内置 imagegen 生成纪念卡和四位全身人物，按认可的Lesson1–2、3–4卡面确定画风；George／Ken以85–86形象为视觉连续性参考，不以同名或视觉复用推断两课发生在同一天。售票员的女性形象是美术设定，课文未给性别，不设置凭职业猜性别的题目。

生成原稿保存在`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/`。项目中仅等比转换WebP，保留透明度与完整边缘：

| 项目文件 | 原稿 |
| --- | --- |
| `keepsake-story-v1.webp` | `exec-309e8014-3652-42cc-bcc3-35d218eb87ef.png` |
| `george.webp` | `exec-d8fe013e-415b-4b80-8c40-25c558902c49.png` |
| `ken.webp` | `exec-69692d00-4697-4910-bb03-9d99b2149ea1.png` |
| `porter.webp` | `exec-503e3002-eb51-4bb9-9473-34cab7f7d8f3.png` |
| `attendant.webp` | `exec-37c0941f-0d65-4cd8-b930-a9f61a66f85f.png` |

SVG图标、精确钟面和车站背景延续项目原生矢量素材系统，生成器为`scripts/art/build-unit9596-assets.js`；15座城市图标复用93–94，不把地标示意图当作精确位置证据。评分钟面的时间在独立题稿中明确，不能用生成器数据自证。

`textbook-clock-01.webp`至`textbook-clock-12.webp`是用户提供《外研社新概念英语智慧版1》纸页196／PDF229的12幅钟面片段，保留教材次序与原始指针，不猜补模糊分钟刻度。它们属于可选教材参考，课堂读图由教师核对；评分题另用已审定的7:57、10:17等明确钟面。原PDF与完整页不复制进课程。

## 纪念卡最终提示词

```text
Use case: illustration-story. Asset type: new English lesson 95–96 keepsake illustration. References 1 and 2 define George and Ken character identity; references 3 and 4 define approved soft rounded dark-brown outline style and warm paper-friendly palette. Create a new coherent medium close-up at an old-fashioned railway station: George (wavy blond hair, round glasses, blue coat, mustard scarf) on the left holds TWO small plain return tickets toward a railway porter on the right. Ken (brown short swept hair, teal checked jacket, cream shirt) beside George attentively looks at the porter. Porter is a distinct older adult man, silver side hair, small grey moustache, navy peaked railway cap and navy uniform with brass buttons, carrying a small clipboard, gesturing kindly as he explains. Friendly slightly puzzled attentive expressions, not celebrating successful boarding. Faces, hands, tickets and interaction are clear and fully formed. A subtle railway platform canopy, bridge silhouette and quiet rail carriage shape recede behind them. No readable text, no clock face or numerical time, no badges with letters, no stars, no names, no date, no frame. Warm cream, muted teal, blue and amber, soft minimal shading, rounded proportions, consistent illustration style with the references. Landscape 3:2 framing. Genuine transparent outer background with gentle vignette edge, preserve all faces hands and main props, generous safe margins. This is an illustration only, not a finished certificate.
```

## 人物最终提示词

### George

```text
Use case: identity-preserve. Asset type: full-body character cutout for Lesson 95–96. Use the reference illustration for exactly matching rounded head/body proportions, dark-brown outlines, soft warm muted colors and face style. One character only, upright natural stance, full hair hat fingers shoes visible with wide transparent margins. No floor, background, shadow rectangle, typography or decorative objects. Genuine transparent alpha. George from the left of the reference: wavy blond hair, round glasses, blue coat, mustard scarf, brown trousers and shoes, canvas shoulder bag. Facing RIGHT with eyes toward the conversation partner. Holds two small plain return tickets together in an extended rightward hand, asking a question. Calm inquisitive expression. Preserve facial identity.
```

### Ken

```text
Use case: identity-preserve. Asset type: full-body character cutout for Lesson 95–96. Use the reference illustration for exactly matching rounded head/body proportions, dark-brown outlines, soft warm muted colors and face style. One character only, upright natural stance, full hair hat fingers shoes visible with wide transparent margins. No floor, background, shadow rectangle, typography or decorative objects. Genuine transparent alpha. Ken from the middle of the reference: swept brown short hair, teal checked jacket, cream collared shirt, tan trousers, brown shoes. Facing LEFT, looking toward George. One hand gestures gently while talking, other rests at his side. Both hands empty. Curious conversational expression. Preserve facial identity.
```

### Porter

```text
Use case: identity-preserve. Asset type: full-body character cutout for Lesson 95–96. Use the reference illustration for exactly matching rounded head/body proportions, dark-brown outlines, soft warm muted colors and face style. One character only, upright natural stance, full hair hat fingers shoes visible with wide transparent margins. No floor, background, shadow rectangle, typography or decorative objects. Genuine transparent alpha. The railway porter from the right of the reference: older man, silver side hair, small grey moustache, navy peaked railway cap with round plain brass badge, navy uniform brass buttons, dark trousers and dark shoes. Facing LEFT toward George. One hand gestures in explanation and other carries the plain clipboard. Preserve facial identity. Do not add ticket punch or written badges.
```

### Attendant

```text
Use case: identity-preserve. Asset type: full-body character cutout for Lesson 95–96. Use the reference illustration for exactly matching rounded head/body proportions, dark-brown outlines, soft warm muted colors and face style. One character only, upright natural stance, full hair hat fingers shoes visible with wide transparent margins. No floor, background, shadow rectangle, typography or decorative objects. Genuine transparent alpha. A distinct railway ticket attendant, younger adult woman with dark straight bob tucked behind ears, burgundy railway waistcoat over cream blouse, burgundy small cap, dark skirt and sensible shoes. Facing LEFT toward George. Holds one open hand in a direction-giving gesture, other at waist, no tickets. Friendly composed expression. Same illustration style as reference porter but clearly distinct face and clothes. Do not add written badges.
```
