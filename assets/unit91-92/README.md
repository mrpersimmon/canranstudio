# Lesson 91–92 美术素材

人物与纪念卡使用本次内置 imagegen 生成，不使用 CLI 或外部图片服务。参考认可的 `assets/awards/unit1-2-handbag-closeup.webp` 与 `unit3-4-umbrella.webp` 的圆润棕色轮廓、纸质纹理、色彩和面部画法。WebP 由生成 PNG 转码，保留透明度；未裁切人物。

| 文件 | 身份与用途 |
| --- | --- |
| keepsake-story-v1.webp | 三位邻居在门前谈论未来搬家，封面、结算和纪念卡共用。没有画已搬走、问候已送达或钥匙交接。 |
| catherine.webp | 高发髻、圆眼镜、青绿色外套、黄色肩包，向右交谈。 |
| jenny.webp | 深色齐耳短发、姜黄色开衫、白色领口、深蓝裙子，向左交谈，拿空白便笺。 |
| linda.webp | 栗色卷发、珍珠耳饰、淡紫披肩、酒红裙子，源图向左；课内仅镜像这张无文字的人物图，面向右侧Jenny，姓名正常排字。 |
| street.svg及词义图标 | 延续项目原有SVG符号系统，由 `scripts/art/build-unit9192-assets.js` 可重建。图标不替代材料中的日期、人物事实或答案。 |

## 最终提示词

纪念卡（两张认可图仅作画风参考）：

> Use case: illustration-story, style-transfer. These two reference images are approved style references only. Create a new transparent-background keepsake illustration for a children's English course Lesson 91–92, Poor Ian. Match their rounded thick dark brown outlines, warm flat pastel colors, simple dot eyes, softly textured paper, friendly adult proportions. Medium close-up of THREE distinct adult women chatting facing each other outside an English cottage gate, remembering a kind neighbour who will move TOMORROW (not yet leaving). LEFT Catherine: auburn hair in a high bun, round spectacles, teal coat, small mustard shoulder bag, gesturing toward the other women. CENTER Jenny: straight dark chin-length bob, mustard cardigan with cream collar and navy skirt, holding a small blank folded note and replying to Catherine. RIGHT Linda: wavy chestnut shoulder-length hair, lavender shawl over burgundy dress, looking toward Jenny with a gentle sympathetic expression. All three faces and hands clear, equal importance, not sad caricatures. Soft background vignette of a cottage and leafy gate, a couple of packed boxes behind fence, receding muted colors. No Ian or men in picture; no key exchange, no new owners, no moving truck driving off, no handover of note. No text, lettering, stars, dates, badges, frame, watermarks. Landscape 3:2 illustration with fully transparent outside edges, generous safe space all around, no severed hands or cropped faces, illustration extends from waist level upwards. The event is the three neighbours TALKING about a future move, not acting it out.

三张全身像以本课纪念卡为参考。完整提示词由以下公共前缀、各人描述和公共后缀组成，每人独立调用一次：

> Edit/reference character extraction and outpainting. Create ONE standalone FULL-BODY character asset based on the specified woman in this reference, preserve her EXACT face, hairstyle, clothing identity, palette and thick rounded brown outline illustration style.

- Catherine: LEFT woman Catherine, auburn high bun, round spectacles, teal coat with cream top, small mustard shoulder bag, dark trousers and brown shoes. Three-quarter pose facing RIGHT, looking right and extending one open hand gently to the right.
- Jenny: CENTER woman Jenny, dark brown chin-length bob, mustard cardigan and cream scalloped collar, navy knee-length skirt, dark tights and brown shoes, holding her blank small folded note at waist. Three-quarter pose facing LEFT with head looking left, listening and replying.
- Linda: RIGHT woman Linda, wavy chestnut shoulder-length hair, small pearl earrings, lavender shawl over burgundy knee-length dress, brown shoes. Three-quarter pose facing LEFT, hands gently clasped, looking left sympathetically.

> Fully draw the whole body from hair top to both shoes. True transparent background, NO background scenery, no other people, no floor patch, no text or shadow. Center the figure within a portrait canvas, leave at least 8 percent transparent safe margin on EVERY edge. All hair, hands, fingers, bag and shoes completely inside the canvas. Friendly adult proportions matching reference, flat warm pastel fill with subtle paper texture, not realistic and not a child. Maintain head-to-body ratio about 1:3.5. This is a classroom stage puppet, not a cropped portrait.

实际人物PNG为1024×1536，纪念卡为1536×1024。目视核对身份、手脚、衣服与朝向；浏览器中检查真实显示图片的边缘透明度，四宽逐句核对人物与对白边界。提示词中的尺寸比例与留白是生成要求，验收以实际输出为准。
