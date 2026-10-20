# Lesson141–142素材

6张最终素材均用内置imagegen并请求真实透明背景。主卡参照1–2与139–140的画风，不复用其人物；妈妈、四岁Sally和蓝外套女士身份固定。母女左侧，女士右侧对面；全身图保留全部鞋、手、帽子、座椅。首张greet座椅贴边，用同一工具留出边距后再生成变化。

pair尚无女士；greet无粉盒；compact取出但未扑粉；makeup正在使用；收好后回到greet，最终才用ending体现妈妈的尴尬。没有赠送、丑化人物或额外结局。照片／人物只等比缩放及WebP编码，没有手绘改图。6张边缘alpha检查与实际舞台分别核对。

[原生素材脚本](../../scripts/art/build-unit141142-assets.py)维护通用词义图标和资料图。ugly使用无人物的抽象不规整物品示意，不将具体人物画成丑陋对象；感受图是通用图标。工作图明确已完成／进行中／未执行计划；邀请图Mia→Sam，文字Nunito400轮廓，图形比例与背景伸展分开。

- 最终keepsake-story-v1.webp；原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-a7814028-71c4-4465-a166-a99c21c588f3.png
- 最终greet.webp；原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-2c8f67d9-b658-4545-bb7b-d934c07c0820.png
- 最终pair.webp；原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-5c93f707-e0c7-4f3e-8f02-c3ac0ccadee1.png
- 最终makeup.webp；原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-006a42f8-3001-47aa-baa7-511bed19eec7.png
- 最终ending.webp；原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-d9c93274-58b3-4265-a70f-5effb60f07f5.png
- 最终compact.webp；原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-71418fda-1546-429f-bc96-470e75457a19.png

座椅留白修订前原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-aa76a55b-31ba-48fb-b297-3b3dcc9f6d12.png

## card

完整提示词：

    Use case: illustration-story. Create a new 3:2 landscape transparent children's English lesson card. Input images are STYLE REFERENCES ONLY, not characters: warm rounded dark brown outlines, soft watercolor texture, simple expressive faces, cozy restrained colors. Scene: inside an old-fashioned train compartment. THREE DISTINCT NEW PEOPLE: on the LEFT a mother with short dark wavy bob, muted terracotta cardigan and cream blouse, beside her small FOUR-YEAR-OLD daughter SALLY with dark-brown two short pigtails, a red ribbon, yellow pinafore over white shirt. Sally sits next to the train window and looks curiously to the RIGHT across a clear aisle. On the RIGHT a friendly middle-aged lady with softly curled chestnut hair, blue coat, a large amusing cream hat with soft blue band and one feather. The lady sits on the opposite bench facing Sally, holds ONE opened round powder compact with a small mirror in one hand and a single powder puff near her cheek with the other. ONE brown handbag rests on the lady's lap. Mother and Sally share the left bench, the lady occupies the right bench, all look toward their conversation partners. Medium-close waist-up figures with complete faces, hands, compact, hat and handbag; Sally visibly child-sized, adults matched scale. Faint train window with countryside and simple upholstery behind them. Depict all three respectfully with normal attractive neutral features; no ugly-face caricature, no ridicule, no anger, no text or speech bubbles, no conclusions. Keep all artwork inset with real transparent safe outer margin on every edge. No borders, stars, labels, logos, dates or writing. No cropped hat feather, fingers, compact or face. Soft lower fade permitted below the waist only.

## greet

完整提示词：

    Use case: illustration-story. Create a SQUARE transparent full-body stage illustration derived from the supplied character reference. Preserve exactly the three character designs, colors, line style and child/adult scale: mother short wavy dark bob, terracotta cardigan cream blouse brown skirt; four-year-old Sally two short pigtails red ribbon, yellow pinafore white blouse and white socks; middle-aged lady soft chestnut curls, blue coat, large cream hat blue band and ONE feather. A whole-body seated group in an old train: mother and Sally share a small LEFT bench, Sally toward its inner/right end near a window implied offcanvas; lady on a separate RIGHT single bench facing toward Sally across the aisle. This is BEFORE makeup: the lady warmly GREETS Sally with one hand open near chest, the other hand rests on ONE CLOSED brown handbag on her own lap. No compact or powder puff yet. Sally silently looks curiously at her; mother neutral friendly. Show all three entire bodies, all six shoes, both benches including legs, all hands/fingers, entire hat and feather. Six shoes clearly separate and unobscured, feet need not reach floor for the young child. Not a waist-up portrait. Group fills about 85% of canvas with 6% truly empty transparent margins on every edge. No walls/window/background, no backdrop blobs, text, labels, speech bubbles, stars or caricature. Normal respectful faces, no anger or ugliness. Perspective and eye directions natural. Do not make Sally an adult or adult women into the same person.

## greetMarginRevision

完整提示词：

    Use case: precise-object-edit. Edit this exact square transparent illustration. ONLY zoom the whole unchanged group OUT so that the left edge of the left bench and the right edge of the right bench are FULLY INSIDE the canvas with a clearly empty 7% transparent margin at BOTH SIDES. Preserve complete six shoes, benches and all anatomy; also keep top/bottom transparent margins. Current seats touch/crop at left and right; that must be fixed. Do not change the three character designs, expressions, positions, relative scale, chair details, colors, hands, hat or closed handbag. Keep mother and four-year-old Sally left and greeting lady right. No new objects, no text, no background. Entire furniture and characters smaller together, no clipping, genuinely transparent background.

## pair

完整提示词：

    Use case: precise-object-edit. Make the opening-stage variant of this exact SQUARE transparent illustration. Keep mother and four-year-old Sally and their entire left bench at the EXACT same positions and scale. Remove the entire lady and right bench and handbag, leaving that right area transparent: she has not entered the story yet. Sally looks excited and gestures lightly toward the implied window to her right; mother looks warmly toward her. Do not add any other person or object or compact. Keep their exact clothing, hair, colors, four visible shoes, full bench and hands. Keep all content safely inset from every edge and genuinely transparent background. No window, walls, text or labels. Do not recenter or enlarge the remaining pair.

## makeup

完整提示词：

    Use case: precise-object-edit. Create the makeup-stage variant of this exact SQUARE transparent seated three-person scene. Preserve all three identities, body sizes, positions, benches, safe margins, six shoes, entire hat/feather, clothes/colors. Change only lady's hands: she holds ONE OPEN small ROUND POWDER COMPACT with mirror in one hand and ONE powder puff near her cheek in the other. Her single brown handbag is OPEN on her lap, empty of any second compact. Sally raises one hand to ask a question and looks at the lady curiously, mother watches calmly. Warm respectful friendly faces. Keep full hands and compact unobscured; no adult/child size drift. Fully transparent background, no text, no walls, no objects added elsewhere. Every extremity and bench stays inside canvas.

## ending

完整提示词：

    Use case: precise-object-edit. Create the final-stage variant of this exact SQUARE transparent seated three-person scene. Preserve all three identities, sizes, positions, benches, safe margins, six shoes, full hat and colors. The lady has PUT AWAY her compact: NO compact or powder puff visible anywhere; one CLOSED brown handbag rests on her lap. Both lady's hands relaxed on/near the bag, she smiles kindly toward Sally. Sally looks mildly amused, mother shows modest embarrassment with subtly pink cheeks and a small awkward smile. No exaggerated laughing, pointed mocking, shame, anger, punishment, or ugly-face caricature. Full hands, legs, shoes, benches and feather fully inside canvas. Genuine transparent background, no text, walls or extra objects.

## compact

完整提示词：

    Use case: precise-object-edit. Create the taking-out-compact stage from the exact reference full-body trio. Keep all three people, their locations and head/body scale, benches, all six shoes, entire hat and feather and SAFE transparent margins. Lady at right has opened her single brown handbag on her lap and now holds ONE open small round powder compact with its mirror visible LOW AT HER LAP, just taken out. Both hands near her lap; NO puff near her face and NO applying makeup yet. Sally at left watches curiously with hands on lap; mother calm neutral, NOT embarrassed yet. No second compact or handbag. Keep exact designs, colors and friendly respectful expressions. Transparent background, no walls, window, text or annotations. Preserve all furniture fully inside with at least 5% empty side margins; do not enlarge the group.
