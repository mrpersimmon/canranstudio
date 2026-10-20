# Lesson 107–108 素材与提示词

后续素材修改按[现行统一标准v1.53](../../docs/butcher-version/publish/2026-10-17-0031-v1.53-教学单元设计标准与验收清单.md)核对；以下保留原稿、生成提示词及当时制作依据。

制作时依据[标准v1.51](../../docs/butcher-version/publish/2026-10-15-0041-v1.51-教学单元设计标准与验收清单.md)。纪念卡及四种完整人物姿态使用内置 imagegen；未使用 CLI。原稿保留在默认生成目录，项目内使用等比 WebP 副本，保留透明通道，不裁切人物。

参照[1–2](../awards/unit1-2-handbag-closeup.webp)、[3–4](../awards/unit3-4-umbrella.webp)、[5–6](../awards/unit5-6-friends.webp)认可画风。店员为黑色短发、珊瑚发夹、米色衬衫、芥黄色背心和灰绿裙；女士为棕红卷发、淡紫衬衫、藏蓝裙及随身棕色肩包。肩包是人物配件，不画成交购物袋或付款。

舞台：店员左、女士右，始终面向对方。前两轮店员持蓝裙；第3–4轮店员持绿裙；第5轮起女士持绿裙，店员重新展示原来的蓝裙。两套衣服始终依附人物持物姿态，不悬置为图标、不在两处复制同一件，也不凭空出现合身的新裙。卡面是比较衣服的中近景，未绘制成功购买的结局、身材评价、姓名、星数或日期。

## 原生图形与语义依据

[生成脚本](../../scripts/art/build-unit107108-assets.py)维护原生SVG词义符号、服装店背景及108课参考示意。沿用既有图形系统；try、task-record、task-checked复用105–106。主要人物由imagegen完成。

- 词义选项dress／shirt／skirt采用完整轮廓；衣服颜色与主要人物持物一致。
- A–C参考高度柱只有S／P／H及未命名学生的相对示意，不给课本编造厘米数；D–F温度计不加课本未提供的数值；G–I人群图只辅助比较。
- J–L箱子不添加课本没有的公斤值。应用题另设独立情境：棕4 kg、蓝6 kg、绿9 kg，三只箱子的外形尺寸相同，各自显示明确重量。不能由箱子画得更大就推断更重。
- 任务记录图在未答时保持中性；正确检查后才更新记录。最高级、价格和日期题所需条件由可见英文材料给出，装饰不代替资料。
- dress-shop.svg为本课独立背景，用于真实缺图故障检查，必须先确认构建后请求实际返回404。

所有5张位图四边两像素alpha>32计数为0。最终场景、卡册、手机及GIF证据见单元设计与验收。

## imagegen完整提示词

### keepsake

最终文件：[keepsake-story-v1.webp](keepsake-story-v1.webp)。

原图：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-043aef02-0085-415d-a13a-bd99c3c446cc.png`。

```text
Use case: illustration-story. Asset: Lesson107–108 keepsake scene for a Chinese children's English course. Three supplied images are STYLE REFERENCES only, not edit targets. Match their warm rounded children's book style, deep brown outlines, soft muted flat colors, clear large faces and complete hands, restrained paper texture. NEW scene: a female shop assistant on LEFT discussing dresses with an adult female customer on RIGHT, facing each other. Assistant identity: neat short straight black bob, small coral hair clip, ivory blouse, muted mustard waistcoat, sage green skirt. Customer identity: auburn short curly hair, lavender blouse, dark navy skirt, small cream earrings. Both are ordinary adult proportions, calm polite expressions. Assistant holds two dresses on hangers in front of her, each hanger clearly in one complete hand: a simple BLUE dress is visibly larger than a similarly styled GREEN dress. Customer gestures towards blue with one complete hand while discussing size. Neither dress is being worn by customer; no completed purchase, no checkout bags, no payment, no celebration of a successful fit. Medium close framing like references, dresses and face-to-face interaction central, subtle pale clothing rack behind fades to genuine transparency. Keep complete hair, faces, fingers, hangers and dresses with at least 5 percent transparent margins. No written sizes, no words, no names, stars, dates, captions or border. Do not exaggerate body size or make anyone look ridiculous. Illustration shows the conversation, not an invented happy ending.
```

### assistant-blue

最终文件：[assistant.webp](assistant.webp)。

原图：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-865e5990-d5ef-4e63-b36c-93277b2c4d6d.png`。

```text
Use case: identity-preserve. Asset: full-body sprite for Lesson107 dress shop dialogue. Supplied image is the identity and style reference. ONLY the female assistant from the reference: short straight black bob, coral hair clip, ivory blouse, mustard waistcoat and sage skirt. Extend to full body and complete brown shoes. Stand on LEFT facing RIGHT. She holds ONLY the BLUE dress on a wooden hanger with her left hand, to the left side of her body and at chest level, the complete blue dress hangs without covering her face and ends above her ankles. The same blue dress as reference, short puff sleeves and waist bow. Her other hand gestures politely toward the customer. NO green dress. Keep dress and person both complete. Neutral attentive conversational expression. Match warm rounded deep-brown outlines, gentle flat color, subtle texture, large expressive face. Genuinely transparent background. Portrait framing with at least 8 percent alpha margins all around; full head, both hands, full garment, both feet and any bag entirely within canvas. Subject about 78 percent canvas height. No background or floor, no text, numbers, stars, captions or extra person. Do not exaggerate body size. All props attached naturally to hands or body, no floating objects.
```

### assistant-green

最终文件：[assistant-green.webp](assistant-green.webp)。

原图：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-d48f0640-6d6c-4df7-8788-ec16ec552b22.png`。

```text
Use case: precise-object-edit. Image1 is EDIT TARGET: the complete assistant holding the blue dress. Image2 is REFERENCE for the smaller green dress only. Change ONLY the held garment to the GREEN dress, matching the green colour, puff sleeves and waist bow from image2. Make its width and length about 22 percent smaller than the blue garment currently held, keeping the hanger at the same hand position, complete hem and both sleeves. Preserve the assistant's exact face, coral hair clip, hair, ivory blouse, mustard waistcoat, sage skirt, hand grip, free hand gesture, legs and shoes, canvas, rightward gaze and full-body size. No blue dress remains. Keep true transparent background, full margins, complete fingertips and feet, no scene, no text or numbers. This pose is the shop assistant offering the green dress to try, without implying a successful fit or a purchase.
```

### lady

最终文件：[lady.webp](lady.webp)。

原图：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-adb52fdb-bd60-4997-9a15-e74f18ef6eeb.png`。

```text
Use case: identity-preserve. Asset: full-body sprite for Lesson107 dress shop dialogue. Supplied image is the identity and style reference. ONLY the adult customer from the reference: auburn curly short hair, lavender blouse, navy skirt, cream earrings and small personal brown shoulder handbag, complete dark shoes. Stand on RIGHT facing LEFT toward the assistant. Her hands are empty, one hand mildly gesturing in conversation, other relaxed. No dresses or shopping bags. Calm thoughtful expression, no broad celebratory grin, no unhappy caricature. Match warm rounded deep-brown outlines, gentle flat color, subtle texture, large expressive face. Genuinely transparent background. Portrait framing with at least 8 percent alpha margins all around; full head, both hands, full garment, both feet and any bag entirely within canvas. Subject about 78 percent canvas height. No background or floor, no text, numbers, stars, captions or extra person. Do not exaggerate body size. All props attached naturally to hands or body, no floating objects.
```

### lady-green

最终文件：[lady-green.webp](lady-green.webp)。

原图：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-f5dd6e46-71a1-4364-9ca9-94512dba692f.png`。

```text
Use case: identity-preserve. Asset: full-body sprite for Lesson107 dress shop dialogue. Supplied image is the identity and style reference. ONLY the adult customer from the reference, preserving exact auburn curly short hair, lavender blouse, navy skirt, cream earrings and personal brown shoulder handbag, with complete dark shoes. Stand on RIGHT facing LEFT. She is examining the small GREEN dress from the reference, holding its wooden hanger near chest height in one hand, the other hand gently supporting its edge. The dress is held in front, not worn, and its whole hem is visible well above her feet. Her existing lavender blouse and navy skirt remain. Calm thoughtful conversational expression. No blue dress and no shopping bags. Match warm rounded deep-brown outlines, gentle flat color, subtle texture, large expressive face. Genuinely transparent background. Portrait framing with at least 8 percent alpha margins all around; full head, both hands, full garment, both feet and any bag entirely within canvas. Subject about 78 percent canvas height. No background or floor, no text, numbers, stars, captions or extra person. Do not exaggerate body size. All props attached naturally to hands or body, no floating objects.
```
