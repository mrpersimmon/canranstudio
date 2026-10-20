# Lesson 121–122 视觉素材

使用内置imagegen生成主卡、六张独立人物姿态及两组三人场景，保留透明原稿，等比缩小为WebP，不裁切人物。画风对照Lesson1–2、3–4、5–6认可卡。顾客为灰色鬓发、秃顶、小胡子、紫红套装与绿领结；经理为黑色短发、方框眼镜、青蓝套装与黄领带；Caroline为棕色侧辫、蓝衬衣与酒红长裙。与上一单元George及叙述者身份无关联。

帽子只随原文与课本插画切换：起初未戴，Yes, I have到All right期间拿在手中，下一幅经理核对身份时才戴在头上；同一帽子不在手中和头上重复。Caroline直到最后明确认出才改微笑。两本词典一直在柜台上，无交接、装袋或离店结局。卡面采用最终认出时刻的中近景，三个角色、完整帽子与两本词典均清楚。

原生SVG用于物品、开放式柜台、背景、书本位置图和服务记录图；图内英文字与数字用本地Nunito真实400字重轮廓。教学图均声明360×270固有宽高，与viewBox相同。A在柜台上、B在柜台下、C在另一墙架上；服务记录为Pat→Lee、Mia→Tom，箭头由接待者指向顾客，两张图均是另设材料，不冒充课本具体人物事实。半小时用标注30 min的半圆面积示意，不画会被误认作具体钟点的指针。

| 素材 | 原稿绝对路径 |
| --- | --- |
| keepsake-story-v1.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-bc86fbd1-081c-4635-8a37-b4de359f4083.png |
| customer.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-fc3e72ac-1485-47e1-847f-b5a33176ccb5.png |
| manager.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-5136393a-98a3-42d2-ac8d-cc9db565750f.png |
| caroline.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-612b3eee-3bc2-4adb-80af-2171c6ca527d.png |
| customer-holding.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-35763a8f-cf46-4431-93de-93535be09e1d.png |
| customer-hat.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-d3a47c3f-124a-40f1-8d0c-307e1b8998be.png |
| caroline-recognize.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-db86e1cd-e40c-4f73-ba24-461d81e0e0f6.png |

## 完整生成提示词

### keepsake-story-v1

Use case: illustration-story. NEW keepsake illustration for New Concept English Lessons 121–122, The man in a hat. Attached handbag image is a STYLE reference only: rounded deep brown outlines, friendly simple faces, matte paper texture, soft warm colors. New identities: CUSTOMER is a stocky middle-aged gentleman, balding crown with grey hair at temples, tidy dark moustache, dark plum suit, cream shirt and sage-green bow tie. He wears a tan felt trilby hat with dark brown band. CAROLINE is an adult bookshop assistant with chestnut hair in a loose side braid, a sky-blue blouse with cream collar and burgundy skirt. MANAGER is a slim young adult with straight short black hair, square dark spectacles, a muted petrol-teal jacket, cream shirt and ochre tie. Scene is the final recognition: customer at LEFT has put on his hat, touching brim with his fingers; Caroline at RIGHT looks directly at his face with a gentle recognition smile and a small open-hand gesture; manager slightly behind between them observes calmly. Exactly TWO thick dictionaries lie together on the small counter at lower center, one muted green cover and one muted terracotta cover, no lettering. No book is held or handed over, no money transaction, no leaving scene. Medium-close 3:2 composition, large readable faces, hands and hat; all visible fingertips and entire hat safely inside the canvas, intentional torso framing; softly blurred book shelves behind, subordinate. True transparent alpha beyond a soft vignette edge. Warm ivory, muted teal and burgundy with tan accent. No text, names, numbers, labels, stars, badges, speech balloons or border. The picture must depict recognition only, not an invented return of the dictionaries.

### customer

Use case: identity-preserve. Preserve exactly the specified character from the attached bookshop illustration, its clothes, face, warm matte texture and rounded dark brown outlines. Create ONE independent FULL-BODY sprite, from complete hair to both shoes, on true transparent alpha. Portrait 2:3, generous safe margins, no cropping of any hand, finger, foot or prop. No room, counter, books, other person, text, numbers, border, floor shadow or badge. Customer: stocky middle-aged gentleman with bald crown and grey hair at temples, dark moustache, plum jacket and waistcoat, cream shirt, sage-green bow tie, plum trousers and brown shoes. He is NOT wearing or holding any hat in this initial pose; head is visibly bald on top. Faces RIGHT three-quarter, calm questioning expression with open eyes and closed mouth, both empty hands relaxed near waist.

### manager

Use case: identity-preserve. Preserve exactly the specified character from the attached bookshop illustration, its clothes, face, warm matte texture and rounded dark brown outlines. Create ONE independent FULL-BODY sprite, from complete hair to both shoes, on true transparent alpha. Portrait 2:3, generous safe margins, no cropping of any hand, finger, foot or prop. No room, counter, books, other person, text, numbers, border, floor shadow or badge. Manager: slender younger adult with short straight black hair, square dark spectacles, petrol-teal suit jacket and trousers, cream shirt, ochre tie, brown shoes. Faces RIGHT three-quarter, attentive polite neutral expression, one empty palm open low near waist while asking a question; other hand down. Hands must not extend far beyond body width. No bag or hat.

### caroline

Use case: identity-preserve. Preserve exactly the specified character from the attached bookshop illustration, its clothes, face, warm matte texture and rounded dark brown outlines. Create ONE independent FULL-BODY sprite, from complete hair to both shoes, on true transparent alpha. Portrait 2:3, generous safe margins, no cropping of any hand, finger, foot or prop. No room, counter, books, other person, text, numbers, border, floor shadow or badge. Caroline: adult woman with chestnut loose side braid, sky-blue blouse, cream rounded collar, burgundy calf-length skirt, brown low shoes. Faces LEFT three-quarter, thoughtful uncertain eyebrows, closed mouth, NOT a smile of recognition yet. One empty hand thoughtfully raised near chest, the other rests low at waist. All skirt and shoes fully visible.

### customer-holding

Use case: identity-preserve. Edit the attached single character into a new pose for the SAME bookshop story. Warm matte paper style and rounded deep brown outline. True transparent alpha, no room, table, floor shadow, lettering, numbers, stars, frame or other people. Portrait 2:3 with generous transparent margins. Preserve this exact stocky Customer with grey temple hair, bald crown, dark moustache, plum suit and sage bow tie. Full-body facing RIGHT, open eyes, calm neutral face. He now holds one TAN FELT TRILBY with a DARK BROWN BAND low in front of his waist with both hands. The hat is NOT on his head; bald crown fully visible. Complete hands and hat, whole trousers and both brown shoes inside safe margins.

### customer-hat

Use case: identity-preserve. Edit the attached single character into a new pose for the SAME bookshop story. Warm matte paper style and rounded deep brown outline. True transparent alpha, no room, table, floor shadow, lettering, numbers, stars, frame or other people. Portrait 2:3 with generous transparent margins. Preserve this exact Customer identity, body and clothes. Full-body facing RIGHT. He now WEARS one tan felt trilby with dark brown band on his head, the same kind shown in the bookshop keepsake. One hand lightly touches the brim without hiding the face, other hand relaxed empty at side. Mild friendly expression and open eyes. Full hat top, fingers, both legs and brown shoes safely inside canvas. No second hat in his hand.

### caroline-recognize

Use case: identity-preserve. Edit the attached single character into a new pose for the SAME bookshop story. Warm matte paper style and rounded deep brown outline. True transparent alpha, no room, table, floor shadow, lettering, numbers, stars, frame or other people. Portrait 2:3 with generous transparent margins. Preserve exactly Caroline's identity, side braid, blue blouse, cream collar, burgundy calf-length skirt and brown low shoes. Full-body facing LEFT. Change expression from uncertain to a gentle recognition smile with open eyes looking toward the customer off-canvas at left. Her near hand makes a small open-palm gesture at chest height; other empty hand at waist. Do NOT hold or offer any books. Complete fingers, skirt and shoes fully visible.



## 三人场景的手机复核修订

初稿将三张独立人物排在同一行时，手机中的人物较小；两本词典与柜台分开定位也出现悬空。现前段柜台与两本词典使用同一SVG坐标系，书本底部与台面顶端相接；末两轮改用完整三人场景，保持人物较大、脚和手完整，词典自然接触台面。询问身份时Caroline仍思索，最后确认才微笑，不提前改变人物判断。原初稿截图保存在验收证据中。

- recognition-trio.webp：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-77e2de80-5e21-4cdb-892f-234b9bce77a2.png
- question-trio.webp：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-a52c4598-7e6b-4f1e-bab9-924e5d079757.png

### recognition-trio

Use case: identity-preserve. Preserve the EXACT three bookshop characters in the supplied reference: stocky balding grey-templed moustached Customer in plum suit and green bow tie; slim black-haired square-glasses Manager in petrol-teal suit and ochre tie; chestnut side-braid Caroline in sky-blue blouse, cream collar, burgundy calf-length skirt. Create a NEW full-body scene sprite on TRUE transparent alpha, landscape 3:2. The three people stand at the same floor level, close together but NOT overlapping faces or hands: Customer LEFT, manager CENTER, Caroline RIGHT. Customer wears the single tan trilby hat and lightly touches brim with one hand, looking RIGHT. Manager faces RIGHT toward Caroline with a low open palm. Caroline faces LEFT and has a gentle recognition smile and open hand at chest height. All full heads, complete hat, fingertips, full legs and shoes must be entirely visible. Use narrow stance, use nearly the full canvas height with safe 4 percent margins, and keep minimal empty space between people so faces remain readable when scaled to a 290-pixel-wide mobile scene. Include one slender open-frame shop counter in front of Caroline only, tabletop below the hands with legs apart so her shoes are visible. EXACTLY TWO dictionaries, green and muted terracotta, are stacked ON the counter with the bottom book physically touching the tabletop, to her LEFT away from her hands. No floating books, no book handover, no other hats. No background room, shelf, ground shadow, text, names, speech bubbles, number, star, frame or badge. Warm matte texture and rounded brown outlines exactly like reference.

### question-trio

Use case: identity-preserve. Make ONE minimal story-state edit to this full-body bookshop trio. Preserve EXACTLY the three identities, their positions, proportions, complete bodies and shoes, customer wearing the single tan hat, manager asking toward the right, Caroline on right, counter, exactly two dictionaries resting on the tabletop, colors and composition. Change ONLY Caroline's facial expression and near hand: she is still considering the manager's identity question, with mildly uncertain raised eyebrows, OPEN eyes looking left and a CLOSED neutral mouth, not smiling or already recognizing. Bring her raised hand gently toward her chin without hiding her face. Other hand stays on counter edge. Do not change the customer or manager, do not move any books, do not add people or hats. Keep true transparent alpha and original safe margins, full-body landscape 3:2, no text, numbers, badges, stars, border or room background.
