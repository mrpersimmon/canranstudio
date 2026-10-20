# Lesson99–100 素材与提示词

内置 imagegen 生成本课纪念卡及三个角色姿态；参考已确认的 Lesson 1–2、3–4、5–6 卡面，实际调用用3–4作画风参考，再由本课卡面衍生角色。Andy为栗色乱发、苔绿针织背心与赭黄裤，Lucy为深棕卷发、紫色开衫、圆领衬衫与蓝裙。课文没有明确两人关系，不以家庭关系命名人物。

纪念卡表现Lucy联系医生与坐着的Andy，不添加医生到场、检查结果或康复结局。舞台中的电话只在最后转述电话消息时换姿态；人物全身保留，素材和容器都留边。网页、纪念卡、卡册与GIF使用同一身份。

原稿目录：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/`。

| 项目文件 | 原稿 |
| --- | --- |
| `keepsake-story-v1.webp` | `exec-4dfd8b55-a2b9-48d4-b65a-99f486043abc.png` |
| `andy.webp` | `exec-0ee7112a-89a7-4919-9cce-60c142ec0b90.png` |
| `lucy.webp` | `exec-10446779-0449-4e2f-b024-c8d2a4853a52.png` |
| `lucy-phone.webp` | `exec-1b064c40-8e9a-4250-b1a0-eaf658553f6b.png` |

等比转为WebP，保留透明通道，未裁掉人物；四边两像素内不透明像素为0。主图1365×1024，Andy879×900，Lucy两个姿态600×900。原图保留在生成目录，项目使用转换副本。姓名、星数、日期和称号由账号动态排版，不画进插画。

词汇符号、消息记录、楼梯背景由[原生SVG脚本](../../scripts/art/build-unit99100-assets.js)生成，沿用既有圆润图标语言；图标表示词义，不添加课文未给的诊断。未答的传话区使用中性记录图，检查正确后才更新。

完整提示词如下。

## 纪念卡

```text
Create a transparent-background children's English lesson keepsake illustration, landscape 4:3, matching the attached approved artwork's softly textured warm paper colors, rounded deep brown outlines, large expressive faces, gentle simplified anatomy, no harsh shadows. New unique characters for Lesson 99 Ow!: Andy is an adult man with a round face, short tousled dark chestnut hair, moss green knitted sleeveless vest over cream long sleeves, ochre trousers; Lucy is an adult woman with a dark curly bob, lilac cardigan over a cream Peter Pan collar blouse, dusty blue skirt. Story moment in a cozy home at the foot of a staircase: Andy sits on the floor with both legs safely in front, looking uncomfortable but calm toward Lucy. Lucy beside him holds a vintage muted coral telephone receiver to her ear, looking attentively toward Andy; a short coiled cord goes to the phone base on a low side table. Medium close composition with clear faces and complete hands and phone interaction, Andy visibly seated, no standing, no doctor present, no X-ray image, no medical treatment, no bandages, no blood, no diagnosis or recovered ending. Small faint stair rail/background only, subordinate. Keep all significant parts away from edges with generous transparent margin. No text, no letters, no title, no stars, no badge or frame, no sample name or date. This is story art for an educational keepsake. The attached artwork is STYLE ONLY: do not copy its characters, umbrella or costumes.
```

## andy

```text
Derive ONE isolated full-body character sprite of Andy, the man on the LEFT in this attached artwork. Keep exact identity, hairstyle, face, moss cable knit vest, cream sleeves, ochre trousers, brown shoes, warm paper texture and rounded dark brown outlines. He is sitting on the floor with legs extended to the lower right, body and eyes turned toward someone standing on his RIGHT. One hand supporting his weight on the floor, other hand resting on bent knee; slightly uncomfortable calm face. Full body including hair, hands, legs and both complete shoes, 10 percent transparent safety padding on all sides. Transparent background, no room, no floor patch, no telephone, no other people, no text, no marks, no injury symbols, no crop. Do not change seated pose into standing.
```

## lucy

```text
Derive ONE isolated full-body character sprite of Lucy, the woman on the RIGHT in this attached artwork. Keep exact identity, curly dark brown bob, lilac cardigan, cream Peter Pan blouse, dusty blue calf length skirt, simple brown shoes, warm paper texture, rounded dark brown outlines. She stands turned three quarters toward the LEFT, eyes looking down-left at a seated friend, concerned but calm, one open hand reaching gently toward the LEFT at hip height, other relaxed by her side. Full body including hair, fingers and both complete shoes. 10 percent transparent safety padding on every edge. Transparent background, no room, no floor patch, no props or telephone, no other people, no text, no crop.
```

## lucy-phone

```text
Derive ONE isolated full-body character sprite of Lucy from the RIGHT woman in attached artwork. Exact curly dark brown bob, lilac cardigan, cream Peter Pan blouse, dusty blue calf length skirt and brown shoes, matching the attached warm paper texture and rounded deep brown outlines. She stands in three quarter view looking LEFT to a seated friend while holding a muted coral vintage telephone receiver to her right ear; her other hand holds the small matching phone base at waist height, with one short coiled cord connecting receiver to the base, no dangling disconnected cord. Full body including both shoes and all hands/phone; calm attentive expression. 10 percent transparent margin on every edge. Transparent background, no floor, no room, no extra people, no text, no stars, no crop.
```
