# Lesson 93–94 美术素材

本课大幅插画与人物使用内置 imagegen 生成；小型图标与场景框延续项目原有 SVG 系统，由 `scripts/art/build-unit9394-assets.js` 重建。生成 PNG 转码为 WebP，保留透明度，不裁切人物。

| 文件 | 用途与依据 |
| --- | --- |
| keepsake-story-v1.webp | Nigel查看旅行手记，地球仪、行李和机场衬景；封面、结算、纪念卡共用。没有把纽约／东京的未来行程画成已经完成。 |
| nigel.webp | 飞行员全身像与pilot词卡；以89–90中Nigel的外观为视觉延续依据，改为飞行员服装。本课事实只依据93课，不加入89课看房过程。 |
| wife.webp | 原文未命名的妻子，全身人物用于最后一段；不虚构姓名、职业或不能出门的限制。表情自然，不用悲惨表情替代原文。 |
| airport.svg／home-room.svg | 叙述图册的场景背景；只改变图景，不添加剧情结论条。 |
| 城市与词义SVG | 15座城市与动作／状态的示意符号；城市名称由页面文字给出，装饰地球仪与图标不用于精确地理、数量或日期判题。 |

纪念卡画风对照已确认的Lesson1–2、3–4、5–6；Nigel发型、面部、配色在卡面与全身像保持一致。角色延续是本次美术设计选择，不据同名额外补充教材未写出的情节。

## 最终生成提示词

纪念卡：第一张参考为认可的Lesson1–2画风，第二张为89–90的Nigel形象。

> Use case: illustration-story / style-transfer. Create the new Lesson 93–94 keepsake illustration in the exact rounded dark-brown-outline, warm pastel paper-texture style of approved reference 1. Reference 2 is Nigel's existing identity: preserve his swept dark navy hair, facial proportions, dot eyes and warm complexion, change outfit for this new pilot context. One adult male pilot Nigel, medium close-up from waist upwards, studying an OPEN TRAVEL NOTEBOOK with an abstract simple route drawn as curved lines and dots (no text). He holds the book in one hand and points to it with the other; hands, fingers and face unobscured. Navy civilian pilot jacket, cream shirt, small gold wing pin and shoulder stripes, no branded airline logos, no military weapons. Beside him a small globe and a closed tan flight case; muted airport windows and a stationary passenger aircraft form a softly faded background vignette. His scarf from the old reference is removed in uniform. Express curiosity about travels, not a victory celebration. This represents the pilot and his travel notes; DO NOT depict a dated completed journey to New York or Tokyo. No other people, no text, numbers, city labels, names, stars, frame or watermark. Landscape 3:2 composition, true transparent outside background with soft natural vignette edge, generous safe margin, no clipped face or hands. Keep the face and book large enough for a small course keepsake card.

以下两张人物均以本课新纪念卡为参考，每张独立调用一次。

### Nigel

> Extract and outpaint the SAME pilot Nigel from this reference as a SINGLE full-body classroom stage character on true transparent background. Preserve exactly his dark swept navy hair, warm face, dot eyes, navy civilian pilot jacket, cream shirt, navy tie, gold shoulder stripes and small wing pin. Add complete navy trousers and brown shoes. Stand facing three-quarter RIGHT, looking at the open plain travel notebook in his hands, one hand points at it. Notebook contains only abstract curved lines and dots, no letters/numbers. No background, no globe or suitcase in this separate sprite, no floor shadow. All hair, fingers, coat and BOTH SHOES visible. Leave at least 8 percent fully transparent safe margins on all four sides. Rounded thick dark brown outlines, warm pastel paper texture, adult proportions matching the keepsake, about 1:3.5 head to body, friendly and not photorealistic.

### 妻子

> Create one new FULL-BODY adult woman, Nigel's unnamed wife in Lesson 93, in EXACTLY the same rounded dark-brown-outline, warm pastel paper-texture illustration language as this reference. This reference supplies STYLE ONLY for the woman. Shoulder-length chestnut hair gathered into a single low loose braid over one shoulder, coral cardigan over a cream knee-length dress, brown flat shoes, no apron, no pilot uniform. Standing naturally in three-quarter view facing RIGHT, holding a closed small blue book gently at waist, relaxed neutral expression, not exaggerated sad or crying. The character represents a person at home, not a general statement about women. All hair, hands, cardigan and BOTH SHOES fully inside the image. Portrait canvas with at least 8 percent fully transparent safe margin around all edges. True transparent background, NO interior scenery, no chair, no floor shadow, no text, no labels, no other people.

最终验收以实际页面中的完整人物、音标词卡、同尺寸卡面及导出图为准，不以提示词中的比例或生成成功代替目视检查。
