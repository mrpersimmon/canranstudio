# Lesson 105–106 素材与提示词

后续素材修改按[现行统一标准v1.53](../../docs/butcher-version/publish/2026-10-17-0031-v1.53-教学单元设计标准与验收清单.md)核对；以下保留原稿、生成提示词及当时制作依据。

制作时依据[标准v1.51](../../docs/butcher-version/publish/2026-10-15-0041-v1.51-教学单元设计标准与验收清单.md)第4、6节。主要人物和纪念卡均使用内置 imagegen；没有使用 CLI 或第三方学生姓名。原稿保留在默认生成目录，等比 WebP 副本用于本项目，保留 alpha，不裁切人物。

角色基准为本课近景卡：老板秃顶、圆眼镜、棕格外套；Sandra 金色波浪短发、青色开衫和紫裙；Bob 深色短发、藏蓝背心、铁锈色领带。两侧相向。老板先与 Bob 说话，第四轮换为 Sandra；最后明确说出 dictionary 才在舞台显示词典。卡面表现原文的词典交接，不添加重打后的结果、羞辱或成绩。

认可样板为 [1–2](../awards/unit1-2-handbag-closeup.webp)、[3–4](../awards/unit3-4-umbrella.webp)、[5–6](../awards/unit5-6-friends.webp)。原图边缘两像素 alpha>32 的像素数均为0；头发、手、信纸和鞋完整。真实页面、卡册及GIF检查另见单元设计与验收。

## 原生图形

[生成脚本](../../scripts/art/build-unit105106-assets.py)维护词义图标与办公室背景，沿用已有SVG图形系统。dictionary 为青色书，letter 为信纸，present 为通用词义礼物图；通用礼物图不用于课文揭晓前的道具。词卡图辅助理解，不代替题面语义或精确数值条件。correct 用 teh→the 演示订正，intelligent 用灯泡作概念图，不据此评价人物能力。危险动作词只读写，不要求孩子模仿。

动作图复用来源：99–100 的 at-once／hurt／slip／fall；85–86 的 type／listen；71–72 的 again；47–48 的 want；lesson49 的 tell；101–102 的 hope；97–98 的 describe；91–92 的 move；87–88 的 try／finish；95–96 的 miss；63–64 的 break／drive；77–78 的 lose；73–74 的 cut。任务记录图复用103–104。背景 office-room.svg 为本课独立文件，用作真实缺图故障注入。

## imagegen 完整提示词

### boss-dictionary：结尾持词典姿态

最终文件：[boss-dictionary.webp](boss-dictionary.webp)。原图：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-7e9a5e8e-b250-4380-84f6-0c5495b7b6cf.png`。

使用内置 imagegen 编辑老板原图，仅将信纸替换成词典，参考本课近景卡的书。前后两张完整人物图预先加载，第11轮才切换，撤掉了初稿中位于人物之间的独立词典图标；不改变题稿、轮次、星星或奖励版本。

```text
Use case: precise-object-edit. Asset: final dialogue pose for the same Lesson105 office boss. Image 1 is the EDIT TARGET, a full-body boss holding a letter. Image 2 is a REFERENCE ONLY for the teal dictionary. Change ONLY the object held by his left hand in front of his torso: replace the cream letter with the same small closed teal hardback dictionary shown in image 2, gold open-book AB icon and cream page edge. This is the final line revealing a present for Sandra; the boss is holding and presenting the book, not leaving it on the floor. Keep his exact face, balding hairstyle, glasses, smile, outfit, complete feet, proportions, rightward gaze and open right hand, same canvas size and stance as image 1. Preserve clean genuinely transparent background and full-body margins, no crop, no extra person, no scenery, no stars, no caption, no date. All book edges and both hands must be complete. Warm rounded dark-brown outlines exactly match the original.
```

### keepsake

最终文件：[keepsake-story-v1.webp](keepsake-story-v1.webp)。

原图：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-05274f99-ec91-424c-a5ef-78f37959a7d9.png`。

参考为上列三张已确认卡，仅作为画风依据。

```text
Use case: illustration-story. Asset: new Lesson 105–106 keepsake illustration for a Chinese children's English course. The three supplied images are STYLE REFERENCES only, not edit targets. Match their warm children's book style, rounded dark brown outlines, soft flat colors, large expressive faces, restrained paper grain. New scene: an adult office boss on LEFT hands a small closed teal hardback dictionary to adult secretary Sandra on RIGHT, facing each other, clear eye contact and both complete hands interacting with the single book. Boss: balding crown, short dark hair at sides, round glasses, clean shaven, brown checked blazer, cream shirt, muted ochre tie. Sandra: blonde shoulder-length waved bob, teal cardigan over cream blouse, plum skirt. Warm calm professional expressions, no ridicule. Medium close framing, large faces and hands like references, a subtle short desk and pale office window behind, background fades to genuine transparency. The whole vignette including heads, fingers and book has at least 5 percent transparent margins; lower torsos may finish naturally at desk. Closed book has a tiny embossed alphabet icon, NO readable words. No scores, errors, red crosses, stars, names, dates, captions, watermark, or certificate border. No giant background or tiny people. This is a new illustration; do not copy the referenced identities.
```

### boss

最终文件：[boss.webp](boss.webp)。

原图：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-0eb83645-d7ac-4d56-aa85-58b5a894c0f6.png`。

参考为本课 keepsake 原图，保持人物身份。

```text
Use case: identity-preserve. Asset: full-body character sprite for Lesson 105 office dialogue. Reference image is the identity and style anchor. Draw ONLY the office boss from the reference, exactly the same balding head, round dark glasses, clean-shaven face, brown checked blazer, cream shirt and ochre tie. Extend to full body with dark brown trousers and complete shoes. Standing on the LEFT, three-quarter view facing RIGHT toward another speaker outside the image. Calm attentive expression, mouth gently open, one complete hand holding a plain cream letter with a few unreadable lines at chest height, other hand mildly gesturing right. No dictionary yet. Match the reference's warm rounded children's book drawing, thick smooth dark brown outlines, soft flat fills, gentle texture, large face and clear silhouette. Genuinely transparent background, no scenery or floor, no text, no badges, no names, no stars. Full hair, face, all fingers, any held prop and both feet entirely inside canvas, at least 10 percent clear alpha margin on every side. Tall portrait composition; subject occupies about 76 percent of image height. Never cut off feet or hands, never add another character. Preserve specified facing direction.
```

### sandra

最终文件：[sandra.webp](sandra.webp)。

原图：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-c40e8ffb-3606-4d7a-94f4-4441bc011953.png`。

参考为本课 keepsake 原图，保持人物身份。

```text
Use case: identity-preserve. Asset: full-body character sprite for Lesson 105 office dialogue. Reference image is the identity and style anchor. Draw ONLY Sandra from the reference, exactly the same blonde shoulder-length waved bob, face, teal cardigan, cream blouse and plum skirt. Extend to full body with sensible cream shoes. Standing on the RIGHT, three-quarter view facing LEFT toward the boss outside the image. Attentive neutral friendly expression, both complete empty hands gently together at waist, no book or present yet. Match the reference's warm rounded children's book drawing, thick smooth dark brown outlines, soft flat fills, gentle texture, large face and clear silhouette. Genuinely transparent background, no scenery or floor, no text, no badges, no names, no stars. Full hair, face, all fingers, any held prop and both feet entirely inside canvas, at least 10 percent clear alpha margin on every side. Tall portrait composition; subject occupies about 76 percent of image height. Never cut off feet or hands, never add another character. Preserve specified facing direction.
```

### bob

最终文件：[bob.webp](bob.webp)。

原图：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-0c9aa3d1-a0cf-430f-bbfb-f75eb5f6fb57.png`。

参考为本课 keepsake 原图，保持人物身份。

```text
Use case: identity-preserve. Asset: full-body character sprite for Lesson 105 office dialogue. Reference image is the identity and style anchor. Draw ONE new adult male office colleague Bob, distinct from the boss and Sandra but matching the same style. Dark brown neatly combed side-part short hair, no glasses, clean-shaven, navy sleeveless sweater over cream shirt, rust tie, khaki trousers and dark loafers. Standing on the RIGHT, three-quarter view facing LEFT toward the boss outside the image. Attentive conversational expression, one hand raised slightly in a questioning open gesture, other relaxed, both hands complete. No book or present. Match the reference's warm rounded children's book drawing, thick smooth dark brown outlines, soft flat fills, gentle texture, large face and clear silhouette. Genuinely transparent background, no scenery or floor, no text, no badges, no names, no stars. Full hair, face, all fingers, any held prop and both feet entirely inside canvas, at least 10 percent clear alpha margin on every side. Tall portrait composition; subject occupies about 76 percent of image height. Never cut off feet or hands, never add another character. Preserve specified facing direction.
```
