# Lesson135–136素材

与已认可的1–2／3–4／5–6画风对照。Karen与Reporter承接133–134身份；饭店中的Karen改穿蓝裙和奶油开衫。Carlos新设黑发、胡须、矩形墨镜、象牙外套，不沿用127的Conrad身份。Kate／Liz保留形象，换新报道照片及交流姿态。

最终6张内置imagegen图：主卡加5张正方形全身组图。主卡是介绍场景，不画婚礼或退休结果。记者笔记本一册、读报一份；Carlos只在介绍时出现且没有配台词。所有prompt均transparent_background=true，原稿保留；转换只等比缩放／WebP编码，不裁剪或手工修图。

主卡最初Carlos手部跨入淡出，修到腰部完整；下一稿背景贴边，alpha边缘计数4020，重新收进留白后最终为0。完整人物图与主卡分别目视，不能仅以alpha指标代替人物、物品和实际尺寸检查。read源图右腿间极低透明度颜色经RGBA检查alpha最高4／255、无alpha>32红点，仍需看实际舞台。

[原生脚本](../../scripts/art/build-unit135136-assets.py)维护词义图标、背景和360×270教学资料图。周表三行等权，不突出正确周；介绍图区分介绍人／被介绍人／听者。图内文字为本地Nunito400轮廓；背景适配不拉伸判断图。

- 最终hotel-ask.webp：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-0ae9d55d-7694-4445-8556-26b7b5684c7f.png
- 最终keepsake-story-v1.webp：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-81022ee7-8149-46f2-8641-165a863fa336.png
- 最终hotel-reply.webp：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-c58e8292-2023-42a6-bcd8-789c67bccd18.png
- 最终hotel-introduce.webp：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-7e02c88c-f469-44ba-aed0-236b37b447b9.png
- 最终read.webp：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-5bd208bc-e8bd-4caa-abf8-d6650c7e5cbb.png
- 最终discuss.webp：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-ffc1bede-d7eb-4784-97cf-4a3509be14ed.png

## card

原稿：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-2bf13eee-73a1-424a-9fb6-b78c7869a9ee.png

参考：assets/unit133-134/interview.webp；assets/awards/unit5-6-friends.webp

完整提示词：

    Create a NEW horizontal 3:2 transparent storybook keepsake illustration for Lesson135, a polite introduction at a London hotel. Preserve the exact Karen Marsh and reporter adult identities from FIRST reference: reporter with short dark brown hair, small round glasses, ochre jacket and cream shirt; Karen with chestnut wavy shoulder-length hair and pearl earrings. Karen now wears the same BLUE dress indoors with a small cream cardigan, no fur coat or handbag needed in this scene. Introduce a NEW man Carlos, clearly NOT the reporter and NOT a grey-haired man: neat black hair, small black moustache, BLACK RECTANGULAR SUNGLASSES, ivory jacket over a dark sage shirt, dark trousers. Friendly adult cartoon, not exaggerated celebrity caricature. Medium close-up of three people: reporter on LEFT facing right with ONE notebook and pencil; Karen at CENTER turns and extends a relaxed open palm toward Carlos on RIGHT as she introduces him; Carlos faces slightly left politely smiling and listening, hands relaxed, no speech, no controlling gesture. Show all three faces clearly, complete connected hands with no cropped fingers; make the introduction the key action, not a wedding. A soft small hotel lounge vignette with curved doorway and muted lilac armchair stays secondary behind the faces. Same approved rounded warm-brown outlines, soft colors, gentle paper texture and proportions as SECOND reference. No words, letters, labels, names, stars, rings, wedding clothes, wedding ceremony, retirement sign, title, dialogue bubble or frame. Transparent safety margin around all hair, faces, shoulders and hands; intentional soft waist fade at bottom only.

## hotel-ask

原稿：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-0ae9d55d-7694-4445-8556-26b7b5684c7f.png

参考：assets/unit133-134/interview.webp；assets/awards/unit5-6-friends.webp

完整提示词：

    Create a SQUARE transparent FULL-BODY stage group of exactly TWO adult cartoon people, retaining their exact identities and warm brown outline storybook style from FIRST reference. Reporter on LEFT at about25 percent of canvas width: short dark brown hair, round glasses, ochre jacket, cream shirt, dark green trousers, brown shoes; holds ONE notebook and pencil naturally in front, faces RIGHT asking a question. Karen Marsh on RIGHT at75 percent: chestnut wavy shoulder-length hair, pearl earrings, BLUE knee-length dress, small cream cardigan and brown shoes; no fur coat, no handbag. She faces LEFT listening with a mildly thoughtful, undecided expression. Match SECOND reference's friendly adult proportions, rounded outlines, soft colors and subtle paper texture. Whole bodies standing on the same baseline. All hair, fingers, legs and shoes fully visible. Keep the figures large and readable within a SQUARE composition with6 percent transparent safety margin on ALL sides. No Carlos yet, no other people, scenery, furniture, floor, labels, letters, speech bubbles, decorative halo, checkerboard or frame. True transparent background.

## card-final

原稿：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-194d7d8d-b2f6-45b5-8483-8a3a00b8c614.png

参考：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-2bf13eee-73a1-424a-9fb6-b78c7869a9ee.png

完整提示词：

    Make a small precise correction to this illustration, preserve all three identities, faces, composition, clothes, introduction gesture and hotel vignette. Carlos on the RIGHT currently has his hanging left hand fading out at the bottom. Move that hand UP to rest openly against his lower chest/waist ABOVE the bottom fade, with every finger and the complete wrist clearly visible and naturally connected to his arm. His other hand may remain in his pocket. Keep all hands of the reporter and Karen unchanged and complete. Carlos's mouth is a small closed friendly smile because he is listening. Do not add words, rings, extra people, speech bubbles, stars or frames. Maintain true transparent margins, the horizontal3:2 shape and intentional waist-level fade that does NOT cross any visible hand.

## hotel-reply

原稿：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-c58e8292-2023-42a6-bcd8-789c67bccd18.png

参考：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-0ae9d55d-7694-4445-8556-26b7b5684c7f.png

完整提示词：

    Edit this SQUARE transparent full-body pair to the answer pose. Same reporter LEFT and Karen RIGHT, exactly same identities, scale, clothes and shoes. Reporter closes his mouth and listens facing right with notebook and pencil. Karen faces left, opens her mouth a little and lowers her chin hand into a small open-palm uncertain gesture at waist height; her other hand relaxed at side. She is unsure about retiring, not angry or leaving. Every finger and both complete feet visible; same6 percent transparent safety margins. No Carlos yet, no scenery, props besides the notebook/pencil, floor, halo, text, speech bubbles, wedding or frame.

## hotel-introduce

原稿：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-7e02c88c-f469-44ba-aed0-236b37b447b9.png

参考：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-2bf13eee-73a1-424a-9fb6-b78c7869a9ee.png；C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-0ae9d55d-7694-4445-8556-26b7b5684c7f.png

完整提示词：

    Create a SQUARE transparent FULL-BODY group of the THREE adults in first reference, in the full-body style and scale of second reference. Reporter LEFT around20 percent canvas x, Karen CENTER50 percent, Carlos RIGHT80 percent. Same hair, faces, clothes: ochre-jacket round-glasses reporter with notebook/pencil; chestnut wavy hair pearl-earring Karen in blue knee-length dress cream cardigan brown shoes; Carlos black swept hair, small black moustache, black rectangular sunglasses, ivory jacket dark sage shirt dark brown trousers brown shoes. All three entire figures on SAME ground baseline, every hair, hand, leg, shoe visible within6 percent clear transparent margins. Karen speaks politely, open palm gesturing toward Carlos while looking between reporter and Carlos. Reporter faces right listening. Carlos faces left with a closed friendly smile, listening silently, hands relaxed at waist fully visible. No handshake or rings, wedding clothes, extra people, text, speech bubbles, furniture, background, floor or halo. Friendly adult storybook rounded warm-brown outlines and soft colors. Keep figures large, similar adult scale, not tiny distant people.

## read

原稿：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-5bd208bc-e8bd-4caa-abf8-d6650c7e5cbb.png

参考：C:/Users/duanxiaodong/Documents/ChatGPT/canranstudio/assets/unit133-134/read.webp；C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-2bf13eee-73a1-424a-9fb6-b78c7869a9ee.png

完整提示词：

    Create a SQUARE transparent FULL-BODY group of just Kate and Liz from the FIRST reference. Preserve identities, clothes, warm rounded storybook style: Kate LEFT blonde wavy shoulder hair coral jacket cream collar brown skirt, Liz RIGHT dark rounded bob teal blouse scalloped cream collar teal skirt. Kate holds ONE open newspaper with BOTH hands and reads it aloud, Liz looks toward Kate and paper listening. Change the small newspaper picture to Karen and Carlos from SECOND reference together in a hotel introduction: blue dress cream cardigan and black-haired sunglasses man ivory jacket. Only a small simple illustration, neutral lines for article, NO letters, dates or numbers. No reporter physically with Kate and Liz, no extra bodies, scenery, ground, table, speech bubbles or labels. Full bodies and all hands/feet visible. Square composition,6 percent clear transparent margin, figures large and equal adult scale; no clipping or checkerboard.

## discuss

原稿：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-ffc1bede-d7eb-4784-97cf-4a3509be14ed.png

参考：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-5bd208bc-e8bd-4caa-abf8-d6650c7e5cbb.png

完整提示词：

    Edit this SQUARE transparent full-body pair into the discussion pose. Keep exact Kate LEFT blonde coral and Liz RIGHT dark bob teal identities, clothing, scale, all feet and hands complete. Kate still holds the SAME one newspaper in both hands, now looking toward Liz with a small attentive smile. Liz turns her head slightly left toward Kate, one hand raised with an open palm near her own chest in a conversational gesture, other hand relaxed at her side. Both are interested in the news, not mocking anyone and not celebrating a wedding. Preserve the small photo of Karen in blue/cream and Carlos in sunglasses/ivory on the paper. No readable words. Remove any stray colored pixels or marks outside the figures, especially in the transparent gap between Liz鈥檚 legs; leave those gaps genuinely transparent. All four edges have6 percent clear margin, do not crop hair, fingers or shoes. No floor, background, halo, extra people, speech bubbles, frames or stars. Same warm brown rounded storybook style.

## card-border-final

原稿：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-81022ee7-8149-46f2-8641-165a863fa336.png

参考：C:\Users\duanxiaodong\.codex\generated_images\01a13a06-86fc-7732-8d58-ede86462cfa9\exec-194d7d8d-b2f6-45b5-8483-8a3a00b8c614.png

完整提示词：

    Correct ONLY the outer composition and transparency of this keepsake illustration. Preserve these exact three adult identities, all faces, colors, the introduction gesture, notebook, and Carlos's COMPLETE hand at his waist. Put the entire group and its small hotel vignette INSIDE the central84 percent width and central84 percent height of the canvas, with a completely EMPTY TRANSPARENT outer border of at least8 percent on ALL four sides. The hotel's wall, arch, chair, floor tint and soft glow must fade to full transparency well BEFORE the outer border, never touch the canvas edges. No rectangular opaque backdrop and no haze at the edges. Main people remain medium close-up and faces readable; their visible hands must remain fully intact, no fade over fingers. Keep intentional lower-waist fade inside the vignette. Horizontal3:2. NO new text, labels, frames, stars, rings, wedding objects, speech bubbles, people or shadows outside the central vignette. Background must be truly transparent, not black, white or a checkerboard.
