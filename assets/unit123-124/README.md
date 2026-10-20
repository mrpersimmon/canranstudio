# Lesson 123–124 视觉素材

采用内置imagegen生成主卡、四张全身人物姿态与三张旅行照片。主卡和现场人物保留透明alpha；照片是完整不透明矩形，不能统一套用透明人物的边缘指标。原稿保留，网页WebP只等比缩小，不裁人脸、帽子、手或脚。画风对照Lesson1–2、3–4、5–6认可卡。

Mike以深色卷发、圆眼镜、浅绿色格衬衣、米色裤辨认，现场无胡子；照片中的同一Mike保留卷发、眼镜与衣服而增加络腮胡子。Scott为金色侧分发、无眼镜、砖红开衫与深蓝裤。现场两人相向，Mike介绍与触下巴、Scott倾听与好奇四种姿态按原文切换。妻子只在原文中被提及，不补表情、动作或台词；工作机会不画成接受或入职。

场景每次只显示一张照片：旅客合影、轮船、提过的男士、留胡子的Mike。照片区域明确标为“照片”，与现场人物分开，不把过去外貌画到当前Mike身上；没有自动剧情摘要。照片中的旅客数量是插画呈现，题目不据此推断Mike遇见的总人数或同行名单。

不透明胡子照片初稿把棋盘格画入背景，已用内置imagegen补成完整蓝天；男士照片初稿帽顶贴边，已重新构图留足空间。初稿只保留为来源，不进入网页。检查照片不只看hasAlpha或能解码，还目视确认无棋盘格、无误裁。

原生SVG用于物品图标、轮船照片、课堂照片记录、两船明信片及背景。判断图声明360×270固有尺寸，英文和数字由本地Nunito真实400字重转轮廓。记录是另设材料：A=Maya/Monday，B=Leo/Monday，C=Maya/Tuesday；另一张图恰好两条船，不画额外远景小船。地名词卡的明信片仅作旅行符号，不充当澳大利亚地图或具体地点证据。

| 网页素材 | 原稿绝对路径 |
| --- | --- |
| keepsake-story-v1.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-1bf5eb13-8698-4d7c-854c-7e237f1aa110.png |
| mike.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-2ea8f0ca-acdb-4185-8967-126e3006160e.png |
| scott.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-000366b9-1612-441e-a2f6-2136650860f7.png |
| mike-chin.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-d043284e-8c5b-41d3-a0e5-7214bea3b195.png |
| scott-surprised.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-89e0a5ad-ac61-4d09-b9be-0a9ba7446b5b.png |
| trip-people.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-4cda9a1d-531b-4208-bd65-a1532d3925e5.png |
| beard-photo.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-8455a431-1df2-468b-918c-18697e1b1ed4.png |
| job-man.webp | C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-f40a070d-a35e-4ebb-88bc-4a26c7967d27.png |

未采用初稿：beard-photo为C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-e525b89d-1954-45f8-816a-1a3f6b31efe8.png；job-man为C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-0396d7d8-6330-41ef-aa10-e24ec990e1a5.png。

## 完整生成提示词

### keepsake-story-v1

Use case: illustration-story. Create a NEW keepsake illustration for New Concept English Lessons123–124, A trip to Australia. The attached handbag image is ONLY a style reference: warm matte paper texture, rounded deep brown outlines, simple expressive friendly faces and restrained soft colours. NEW identities: MIKE is an adult with thick short dark curly hair, round thin dark spectacles, a clean-shaven face, a sage-green checked shirt with rolled sleeves; SCOTT is an adult with sandy-blond straight side-parted hair, no glasses or facial hair, a rust-orange cardigan over an ivory shirt. Mike at LEFT shows Scott at RIGHT a LARGE clear paper photograph at chest height. The photograph contains the same Mike with identical dark curls and round glasses, but with a full dark beard, against a quiet ship-deck hint. Current Mike is unmistakably CLEAN SHAVEN. Mike holds the photograph by its outer edges, hands and fingers complete; Scott looks at the bearded portrait with mild amused surprise, one relaxed hand near the photograph, not grabbing or taking it away. The photograph should be large enough for the beard to be recognizable at keepsake-card size. Medium-close 3:2 composition, faces and the photograph dominate; subtle home reading corner and a small stack of unlabelled photos behind. True transparent alpha outside softly bounded vignette. Generous safe margins, no cropped hair, faces, fingers or photograph. Warm ivory, sage, sea-blue and muted rust. No wife, razor, shaving action, angry or ridiculing expression, job acceptance, plane, flag or named landmark. No text, names, numbers, speech bubbles, badges, stars or border.

### mike

Use case: identity-preserve. Preserve the specified person's exact identity, proportions, warm matte paper texture and rounded dark brown outline from the supplied travel-photo illustration. True transparent alpha, generous clear margins. No letters, names, numbers, badges, stars or decorative frame. ONE full-body current Mike on portrait 2:3 canvas. Thick dark curly hair, round spectacles, CLEAN-SHAVEN face, sage-green checked shirt over an ivory undershirt, tan trousers, dark brown shoes. Face three-quarter RIGHT with open eyes and a calm friendly expression. One empty hand makes a gentle pointing/open-palm gesture upward toward a photo display off-canvas to the right; other hand relaxed at waist. No paper, photo, camera or other prop in his hands. No furniture, other people, background or ground shadow. Complete hair, fingers and both shoes inside canvas.

### scott

Use case: identity-preserve. Preserve the specified person's exact identity, proportions, warm matte paper texture and rounded dark brown outline from the supplied travel-photo illustration. True transparent alpha, generous clear margins. No letters, names, numbers, badges, stars or decorative frame. ONE full-body Scott on portrait 2:3 canvas. Sandy-blond straight side-parted hair, no glasses and no beard, rust cardigan, ivory shirt, navy trousers, brown shoes. Faces three-quarter LEFT with open attentive eyes and a neutral curious expression, one empty hand slightly lifted at waist, other down. Looks slightly up toward a photo display off-canvas to the left. No photo, other person, furniture, background or ground shadow. Complete hair, hands and shoes inside canvas.

### trip-people

Use case: illustration-story. Use supplied reference ONLY for the same warm matte, rounded brown-outline illustration style. A landscape 3:2 travel photograph of THREE anonymous adult travellers standing by a ship's railing. A woman with short dark straight hair and cream sunhat, a clean-shaven red-haired man with a blue polo, and a grey-haired woman with a muted lavender jacket. Do NOT depict Mike or Scott: no dark curly hair with round glasses, no blond rust-cardigan man. Natural friendly group, everyone fully within frame at medium-close waist-up, faces and hands complete, calm sea behind, simple friendly art. No named landmarks, letters, labels, numbers, paper border, outside hands, badges, stars or job offer/acceptance. No implying these are all the people Mike met. Rectangular illustrated photograph.

### beard-photo

Use case: identity-preserve. Preserve the specified person's exact identity, proportions, warm matte paper texture and rounded dark brown outline from the supplied travel-photo illustration. True transparent alpha, generous clear margins. No letters, names, numbers, badges, stars or decorative frame. A landscape 3:2 illustrated travel photograph, without a paper border and WITHOUT any hands holding it. Mike during the earlier trip: same thick dark curly hair, same round spectacles, sage-green checked shirt, now a substantial full dark BEARD covering jaw and chin, not merely a moustache. Medium-close head and shoulders, friendly relaxed expression. Soft sea and a ship railing in the background. The person is exactly Mike shown in the reference's held photograph. Fill the rectangular image with this portrait, all hair and beard safely inside. No other people, no razor, no job scene.

### job-man

Use case: illustration-story. Same warm matte paper and rounded dark brown-outline storybook style as supplied reference. ONE anonymous adult man in an illustrated landscape 3:2 travel photograph: older slender man with silver straight hair, a tan panama hat, oval spectacles, clean-shaven face with NO beard, olive jacket and pale yellow shirt. Clearly different from Mike and Scott. Medium-close head and shoulders at a ship railing, soft sea background. Friendly neutral expression, no profession-specific tools, business contract, cash, handshake or employment-success imagery. Full hat, face and any hands safely inside. No paper border, outside hand, lettering, names, numbers, badges or stars. This is simply a portrait of the man Mike mentioned; the dialogue supplies the job-offer information.

### mike-chin

Use case: identity-preserve. Preserve this exact full-body Mike, curly hair, round glasses, CLEAN-SHAVEN face, sage checked shirt, tan trousers, brown shoes and warm matte brown-outline style. Change only pose: still facing RIGHT, one empty hand gently touches his clean-shaven chin while explaining his past beard, other hand relaxed at waist. Open eyes and a calm friendly expression. No beard now, no razor, no shaving action, no photo, no other person or furniture. Full hair, all fingers and both shoes inside portrait 2:3 with generous margins. True transparent alpha, no ground shadow, text, letters, numbers or frame.

### scott-surprised

Use case: identity-preserve. Preserve exactly this full-body Scott identity, hair, rust cardigan, ivory shirt, navy trousers, shoes and style. Facing LEFT and slightly up, show mild interested surprise at a photograph: eyebrows slightly raised, small open mouth, one empty hand raised low near chest, other down. Not frightened, mocking, pointing aggressively or laughing at someone's appearance. No prop, photo, other person or background. Keep full hair, hands, legs and both shoes within generous margins, portrait 2:3. True transparent alpha, no ground shadow, text, numbers, stars or frame.

### beard-photo-final

Use case: precise-object-edit. This is a rectangular illustrated photograph. Preserve exactly the bearded Mike portrait: curly dark hair, round spectacles, full beard, sage checked shirt, warm matte texture and rounded brown outlines. REMOVE ALL checkerboard pixels and the simulated transparency pattern. Replace every checkerboard area with continuous light blue sky and soft clouds that join the sea/sky scene already present. The background must fully cover the entire rectangular 3:2 image edge to edge, completely OPAQUE, no alpha, no checkerboard, no blank margin or border. Keep all hair and beard safely inside the image with small sky space above his hair. No extra person, outside hand, lettering, numbers, paper frame, badge or stars.

### job-man-final

Use case: identity-preserve. Keep this same clean-shaven older man, panama hat, oval spectacles, silver side hair, olive jacket, pale yellow shirt and warm matte illustration style. Recompose a little farther back so his ENTIRE tan hat including the top crown has clear blue sky above it, at least 6 percent of image height. No part of hat or head touches any edge. Keep a medium-close portrait, full face and shoulders, soft sea and ship railing background. OPAQUE full rectangular landscape3:2 image, sky and sea extend to every edge. No transparency, checkerboard, paper border, text, numbers, badges, job contract or outside hands. Do not add a beard or change identity.
