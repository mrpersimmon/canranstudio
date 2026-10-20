# Lesson127–128素材与生成记录

2026-10-16，内置imagegen生成。遵循统一标准v1.52；画风参考Lesson1–2手提包、3–4雨伞、5–6同学认可卡，仅借鉴风格，不复用角色身份。所有最终WebP来自下列原稿等比例转换，无程序裁切、补画或抠图。原生SVG另由scripts/art/build-unit127128-assets.py维护。

Kate金色卷曲短发、珊瑚色开衫和圆领；Liz深色短发、青绿色衣裙和波浪领。Kate两姿态向右，Liz两姿态向左，邻桌两人没有对白。6张最终图透明边缘、手脚／道具完整性及实际页面分别核对；主卡首次生成没有充分边距，重新生成全幅留边。

| 文件 | 原稿 | 原稿SHA256 |
| --- | --- | --- |
| [keepsake-story-v1.webp](keepsake-story-v1.webp) | `C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-ea3b8b94-b030-4ee7-a760-3fe063266542.png` | `064c06bf64765674ea286d6501dd728c7c85e4c317156566e7d6763079b87755` |
| [kate-ask.webp](kate-ask.webp) | `C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-bd2c2eb0-ba20-4d9e-b0bf-3eb0c0aee9ab.png` | `21ac96bcec64850f848ea204166f0ab5ce9fb469945323d8f266a87bdfbfb324` |
| [kate-look.webp](kate-look.webp) | `C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-c35cfeed-7726-40e3-8b9b-4c1c4a4ab4eb.png` | `87bc2477d53c9b656c8ed9ba2ef4fd5279182ef3a711e10c33f855c7e02c8212` |
| [liz-talk.webp](liz-talk.webp) | `C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-1bfea26e-9668-41f5-9663-deaa2f15ecb0.png` | `c50f99c259b03f25be30d74e360d040b6653f09f78cae781eb91514e658b3d77` |
| [liz-reply.webp](liz-reply.webp) | `C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-6f80f596-a408-47bb-a295-6c2a8839d90d.png` | `a40a80755968683e7f15a006fbe714842710857bea5f48cd362fb35011e4ee15` |
| [cafe-guests.webp](cafe-guests.webp) | `C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-b622c58a-e5bd-44a2-98d4-cb2552548fa1.png` | `2b0511be29af4fce1fc70041e453936b8b16196b7ec831ef8f070fb83335bf33` |

## 初始主卡提示词

```text
Create an original transparent-background keepsake illustration for a children's English reading lesson, Lesson 127 A famous actress. Match the attached three APPROVED STYLE references only: rounded deep warm-brown outlines, simple expressive friendly adult faces, gently textured matte pastel colors, warm paper aesthetic, no realism. Distinct original cast, no copying reference identities. Foreground medium close view: Kate on left is a blonde woman with a smooth curled shoulder-length bob, coral cardigan with cream collar; Liz on right is a woman with a short black softly waved bob, teal blouse with scalloped cream collar. They sit over a small round café table with two cups and a small cream teapot. Kate turns her face toward Liz, one open hand gestures gently toward two distant adult café guests. Liz looks toward Kate and listens, hands visible near cup. Background softly receding at upper center: a woman with chestnut waves wearing muted ochre and a man with swept grey-brown hair wearing plum jacket sit together at a separate table. They are only being observed, no speech, no age numbers, no names, no implied marriage certificates. Foreground hands, faces and cups large and clear. All four people distinguished by hairstyle and clothing, kindly neutral expressions, no caricature of old age. Low-detail café curtains and window, background understated; dominant muted teal and dusty coral. Every contour and all important props contained inside canvas with generous transparent margins, art fades softly at bottom. No text, typography, letters, stars, badges, numbers, card border or title. Landscape 3:2 composition with coherent hand-object contacts. Transparent outside illustration silhouette.
```

原稿：`C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-f0c0f45e-3d4c-43ae-afe3-958d30367988.png`。该稿保留追溯，最终采用下列重构主卡。

## keepsake-story-v1

```text
Edit the attached image. Preserve its exact characters, gestures, four-person café story, foreground two cups and teapot, proportions and warm rounded style. Reduce the entire composition within the canvas so there is a generous 10 percent completely transparent margin on ALL FOUR edges. Make the outside background truly transparent, including at top and sides. No soft brown opaque rectangular backdrop. Retain the receding café background as a contained soft silhouette. Do not crop a head, face, hand, cup or chair edge. No text or stars. Landscape 3:2.
```

## kate-ask

```text
Match the attached original illustration exactly in character identity, rounded warm dark-brown contours, flat soft teal/coral/cream colors and lightly textured paper. True transparent background, no colored box, no floor or background furniture except the described chair. Each item entirely inside the canvas, 12 percent transparent safety margin on ALL sides, full hair, both hands with natural fingers, both shoes and every chair leg visible. No writing, no symbols, no labels, no border. Extract and redraw ONLY Kate, the blonde shoulder-length curled bob woman with coral cardigan and cream rounded collar from the left foreground. Full-body seated on a simple bentwood café chair, modest plum knee-length skirt, dark brown flat shoes on the ground. Chair and legs fully visible. She occupies the left side of a conversation, three-quarter face and gaze facing RIGHT, toward Liz offscreen. Her rightward hand open palm gently asking a question; the other hand relaxed on her own lap. No cup, no table, no other person. Friendly curious expression, not laughing at anybody. Portrait composition.
```

## kate-look

```text
Match the attached original illustration exactly in character identity, rounded warm dark-brown contours, flat soft teal/coral/cream colors and lightly textured paper. True transparent background, no colored box, no floor or background furniture except the described chair. Each item entirely inside the canvas, 12 percent transparent safety margin on ALL sides, full hair, both hands with natural fingers, both shoes and every chair leg visible. No writing, no symbols, no labels, no border. ONLY Kate, the blonde curled bob woman in coral cardigan and cream rounded collar, full body seated on the same bentwood chair with plum knee-length skirt and brown flats. She occupies left side, three-quarter facing RIGHT and looking slightly upper-right as if taking another look at a distant table. One hand raised softly near chin in thought, other on lap. No touching her eyes, no telescope, no text, no table or cup. Both shoes, both hands and all chair legs completely visible. Thoughtful and neutral. Portrait composition.
```

## liz-talk

```text
Match the attached original illustration exactly in character identity, rounded warm dark-brown contours, flat soft teal/coral/cream colors and lightly textured paper. True transparent background, no colored box, no floor or background furniture except the described chair. Each item entirely inside the canvas, 12 percent transparent safety margin on ALL sides, full hair, both hands with natural fingers, both shoes and every chair leg visible. No writing, no symbols, no labels, no border. ONLY Liz, the black softly waved bob woman in teal blouse with scalloped cream collar from right foreground, full body seated on a simple bentwood café chair, dark teal modest knee-length skirt and brown flats. She occupies RIGHT side of conversation, three-quarter face and gaze facing LEFT toward Kate offscreen. One hand open gently toward left as she speaks, other resting on lap. No table, no cup, no other people. Friendly matter-of-fact neutral expression, not mocking. Both hands, shoes and all chair legs visible. Portrait composition.
```

## liz-reply

```text
Match the attached original illustration exactly in character identity, rounded warm dark-brown contours, flat soft teal/coral/cream colors and lightly textured paper. True transparent background, no colored box, no floor or background furniture except the described chair. Each item entirely inside the canvas, 12 percent transparent safety margin on ALL sides, full hair, both hands with natural fingers, both shoes and every chair leg visible. No writing, no symbols, no labels, no border. ONLY Liz, same black softly waved bob, teal blouse scalloped cream collar, dark teal knee-length skirt, brown flats, full body seated on same bentwood café chair. On RIGHT side facing LEFT toward Kate, one hand gently rests at her own upper chest as she talks about herself; other hand on lap. Mildly surprised dignified expression, not angry or ashamed. No table, no cup, no text. Both hands, shoes, entire chair and legs contained in portrait composition.
```

## cafe-guests

```text
Match the attached original illustration exactly in character identity, rounded warm dark-brown contours, flat soft teal/coral/cream colors and lightly textured paper. True transparent background, no colored box, no floor or background furniture except the described chair. Each item entirely inside the canvas, 12 percent transparent safety margin on ALL sides, full hair, both hands with natural fingers, both shoes and every chair leg visible. No writing, no symbols, no labels, no border. ONLY the two small BACKGROUND guests from attached image, at their own small round café table, now drawn full-body as a single separated group. Woman left: chestnut wavy shoulder-length hair, ochre long-sleeve blouse, brown skirt, brown shoes. Man right: grey-brown swept short hair, plum jacket cream shirt, dark trousers brown shoes. They sit on two bentwood chairs facing each other and calmly chat, with two cups and a little plant on table. All four shoes, natural hands, table base and every chair leg visible. Not the blonde coral woman and not the black-bob teal woman. No celebrity symbols, name labels, numbers, age exaggeration or marital symbols. Landscape group with substantial transparent margins.
```

## 图形语义与使用边界

帽图NEW蓝色、OLD棕色叶标、FOUND棕色同标；杯图A3／B4／C5。原生英文数字为Nunito400轮廓，360×270。国旗和职业图标只用于词义，不据此推断真实人物身份；场景茶桌为比例固定的独立物件，背景色块可以伸展。动态姓名、课号、星数与日期不画进素材。
