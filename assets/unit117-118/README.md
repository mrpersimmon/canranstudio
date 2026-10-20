# Lesson 117–118 视觉素材

使用内置imagegen生成主卡与七张全身人物姿态，原稿保留，等比缩小为透明WebP，不裁人物。以Lesson1–2、3–4、5–6认可卡为风格标准，本课为新家庭，不因Father、Mother或Tommy的名字复用其他故事人物。父亲深色短发与小胡子、藏蓝开衫；母亲金色卷发、青绿色裙与浅黄围裙；Tommy橙色背心与青绿色短裤，身体高度按孩子身份显示。

主卡凝练早餐与落币情节，不作为各时点人物站位或硬币总数的证据。全身角色不把硬币靠近嘴；原文吞咽段落完整阅读，画面只保留母亲关切与空手孩子，不演示吞咽、倒提、取物操作或编造恢复结果。后段父母分别在家中／办公室打电话。硬币按叙述时序显示，面额与落币总量不从插画推算。

本课原生SVG词义符号、时间图、道具和背景由scripts/art/build-unit117118-assets.py维护。重建使用与本项目字体脚本相同的fontTools环境。图内英文及数字由本地assets/awards/fonts/award-nunito.woff2的真实400字重转换成SVG轮廓，沿用该字体许可证，无额外网络字体请求；无文字意义的勾号保留符号图形。时间图为另设课堂事实：阅读18:00–18:20，电话18:10；做饭18:00–18:20，洗碗18:05–18:15，观察18:10。矩形端点按时刻对齐，不用圆头线段外溢的长度代表范围；图形与题面、独立答案及实际未答页面分别核对。

| 网页素材 | 原稿绝对路径 |
| --- | --- |
| keepsake-story-v1.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-645eee82-f95a-45d0-b4aa-2b34b200a9a2.png |
| father.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-6f2f5255-8852-4e67-8d7b-7b4ff1d35ee8.png |
| mother.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-4e70800e-4852-4108-a359-c153b08476f8.png |
| tommy.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-3176f8e1-a522-4383-9ef6-0cb4291e3856.png |
| mother-breakfast.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-a963e79e-d606-4740-a1f1-1bdb6e45a6d6.png |
| mother-concerned.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-9471c53c-bcd2-4261-be01-d2ff7aa9022c.png |
| mother-phone.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-d8b3aafc-f65e-4b82-bb1d-5c21607ad533.png |
| father-phone.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-566745e6-3ec8-443e-8b2e-04ba004bfbf5.png |

## 完整生成提示词

### keepsake-story-v1

Use case: illustration-story. Generate a NEW story keepsake illustration for New Concept English Lessons 117–118, Tommy's breakfast. Reference image is ONLY for the approved art style: warm matte paper texture, rounded deep brown outlines, friendly simple rounded faces and restrained soft colours. This is a NEW family, not the reference characters. Father: adult, short neatly side-parted dark black-brown hair, small tidy moustache, navy cardigan, ivory shirt, mustard narrow tie. Mother: adult, golden wavy chin-length hair, teal-green dress with an ivory Peter Pan collar and a pale yellow apron. Tommy: small young boy, sandy straight hair, cream short-sleeved shirt under an orange knitted vest, muted teal shorts. Main event: Father has accidentally dropped some loose coins as he enters the dining room before breakfast. Show a medium-close family composition, father at left looking down with a mildly startled expression and an empty open hand; three small unlabelled gold coins visibly FALL downward below his hand toward the lower foreground, not toward any mouth. Mother at right notices with gentle concern and keeps one hand near Tommy's shoulder; Tommy stands safely beside her with EMPTY hands down and a closed mouth, looking toward the floor. Do not imply a recovered coin, medical treatment, recovery, or the end of the story. A small blurred breakfast table with cups and toast behind the family and a doorway suggest the dining room, background subordinate. Large clear faces and hands, coherent adult/child height difference, wide 3:2 composition, generous safe margins, intentional medium-close lower framing, no cropped faces/fingers or coins. True transparent alpha outside a softly bounded vignette. Colours: warm cream, muted teal, ochre, navy. No child putting objects near the face, no swallowing action, no choking, no upside-down child, no distressed medical imagery. No text, lettering, numbers, names, dates, star badges, borders or captions.

### father

Use case: identity-preserve. Use the attached breakfast-family illustration solely to preserve the specified person's identity, clothes, proportions and warm matte rounded brown-outline style. Create ONE independent full-body character sprite on true transparent alpha, portrait 2:3 with ample transparent margins. No furniture, room, other people, coins, text, letters, stars, numbers, border or background shadow. All hair, fingers, legs, shoes and any requested prop fully visible. The adult father: short side-parted dark hair, small tidy moustache, navy cardigan, ivory shirt, mustard tie, brown trousers and brown shoes. Turn three-quarter LEFT with eyes gently lowered, mildly surprised closed-mouth expression, one EMPTY hand open low at waist and other at side. Preserve recognizable face. No coin baked into the sprite.

### mother

Use case: identity-preserve. Use the attached breakfast-family illustration solely to preserve the specified person's identity, clothes, proportions and warm matte rounded brown-outline style. Create ONE independent full-body character sprite on true transparent alpha, portrait 2:3 with ample transparent margins. No furniture, room, other people, coins, text, letters, stars, numbers, border or background shadow. All hair, fingers, legs, shoes and any requested prop fully visible. The adult mother: golden wavy bob, teal dress, ivory rounded collar, pale yellow apron, calf-length skirt, brown low shoes. Three-quarter RIGHT, listening with a thoughtful neutral closed-mouth expression, one empty hand relaxed near waist, other down. Not smiling widely or celebrating.

### tommy

Use case: identity-preserve. Use the attached breakfast-family illustration solely to preserve the specified person's identity, clothes, proportions and warm matte rounded brown-outline style. Create ONE independent full-body character sprite on true transparent alpha, portrait 2:3 with ample transparent margins. No furniture, room, other people, coins, text, letters, stars, numbers, border or background shadow. All hair, fingers, legs, shoes and any requested prop fully visible. Tommy, the small young boy: sandy straight hair, cream short-sleeved shirt, orange knit vest, muted teal shorts, cream socks and brown shoes. Three-quarter LEFT, hands EMPTY and down at his sides. Quiet neutral curious expression, mouth closed. Child proportions clearly different from adult. No food or object near his face.

### mother-breakfast

Use case: identity-preserve. Use the attached breakfast-family illustration solely to preserve the specified person's identity, clothes, proportions and warm matte rounded brown-outline style. Create ONE independent full-body character sprite on true transparent alpha, portrait 2:3 with ample transparent margins. No furniture, room, other people, coins, text, letters, stars, numbers, border or background shadow. All hair, fingers, legs, shoes and any requested prop fully visible. The adult mother in the same teal dress, ivory rounded collar, yellow apron and brown shoes, three-quarter RIGHT. She holds a small plate with one piece of toast at waist height, her other hand gently holds the plate edge. Calm neutral face, mouth closed. No action of eating or swallowing. Plate fully visible.

### mother-concerned

Use case: identity-preserve. Edit this single full-body sprite to the following new pose; preserve exactly its identity, hairstyle, clothes, colours, body proportions and rounded warm brown-outline style. Keep the mother facing RIGHT. One empty hand rests near her chest, the other is open low toward the child off-canvas at right. Quiet concerned eyebrows, mouth closed, not smiling. No medical procedure, no hand near another person's mouth, no other person. Keep full yellow apron, teal dress and complete shoes. True transparent alpha background, portrait 2:3, generous clear margins all around. No text, numbers, stars, frame, background, floor shadow or clipping. All hair, hands, props, fingers, feet must stay fully inside the canvas.

### mother-phone

Use case: identity-preserve. Edit this single full-body sprite to the following new pose; preserve exactly its identity, hairstyle, clothes, colours, body proportions and rounded warm brown-outline style. Keep the mother facing RIGHT. She holds a vintage teal telephone receiver to one ear; the other hand holds a small feather duster down at her side, indicating paused housework. A short curved receiver cord may end behind her waist; no phone base or furniture. Thoughtful concerned neutral face, mouth closed, no cheerful resolution. Complete fingers, receiver, duster, dress and shoes all within canvas. True transparent alpha background, portrait 2:3, generous clear margins all around. No text, numbers, stars, frame, background, floor shadow or clipping. All hair, hands, props, fingers, feet must stay fully inside the canvas.

### father-phone

Use case: identity-preserve. Edit this single full-body sprite to the following new pose; preserve exactly its identity, hairstyle, clothes, colours, body proportions and rounded warm brown-outline style. Keep the father facing LEFT. Hold a vintage navy telephone receiver to one ear and his other empty hand relaxed at waist. Thoughtful concerned neutral face, mouth closed. A short curved receiver cord may end behind his waist. No phone base, desk, coins, medical items or other people. Full cardigan, trousers and both shoes fully shown. True transparent alpha background, portrait 2:3, generous clear margins all around. No text, numbers, stars, frame, background, floor shadow or clipping. All hair, hands, props, fingers, feet must stay fully inside the canvas.
