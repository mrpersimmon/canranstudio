# Lesson101–102 素材与完整提示词

采用内置 imagegen；本课所有选定插画已保存到本目录。先以已确认的Lesson5–6卡面作为画风参考，再衍生Grandmother与Penny。两人分别为银发、椭圆眼镜与紫披肩，以及栗色短发、青色发夹与芥黄色连衣裙；均为坐姿，Penny手持唯一明信片。

最初卡面把Grandmother画成明显微笑，与本课需要依据原文判断反应的任务不合，未采用。最终改为专注、轻微疑问的表情，不给“高兴／不高兴”结论；课文没有另加自动结论栏。卡面近景与舞台全身图分别构图，全部手、脸、脚和持物保留。源图与WebP四边两像素内不透明像素均为0，实际页面另作四宽检查。

原图目录：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/`。

| 保存文件 | 来源原图 | WebP尺寸 |
| --- | --- | --- |
| `keepsake-story-v1.webp` | `exec-68faf89c-6361-4b20-ae1d-3adffe6e73cd.png` | 1189×1024 |
| `grandmother.webp` | `exec-887e3911-433f-4386-af4c-7c1a39bdbaea.png` | 743×900 |
| `penny.webp` | `exec-17153faa-0416-4328-a4dd-71b896afe242.png` | 751×900 |

只做等比格式转换，保留透明通道，没有裁人物。姓名、星数、日期和称号由账号动态绘制。初稿`exec-05bf19eb-2b50-4b5f-a7ab-a83fd01db05f.png`仅作为人物身份参考保留，不作为最终项目素材。

[原生SVG脚本](../../scripts/art/build-unit101102-assets.js)维护词义符号、背景与消息记录；102课重复的16种物品沿用99–100对应图标并随本课课包准备。Scotland图为带地名的意象，不是精确地图；few／little图不承担精确数量判断。未答应用使用中性记录图，正确检查后才改变记录。

## 初始身份基准提示词

```text
Use case: illustration-story. Create a transparent-background children's English keepsake illustration for Lesson 101 A card from Jimmy. Attached image is a STYLE reference only: match rounded dark brown outlines, warm soft paper texture, gentle colors and large expressive adult faces, but create different people and props. Scene: Grandmother (elderly woman, silver hair in a neat bun, small oval glasses, plum knitted shawl over cream blouse, sage long skirt) seated on the LEFT in a warm rust armchair. Penny, her adult daughter (adult woman, straight dark auburn chin-length bob with a small teal hair clip, mustard pinafore dress over cream blouse) seated on RIGHT in a muted teal armchair. Penny holds and reads ONE small cream postcard at chest level toward Grandmother; Grandma leans attentively toward her with one open hand near her ear. They face one another, gentle attentive expressions, no exaggerated happy/sad/emotional verdict. Medium close scene, faces and complete hands large and clear, card easy to recognize with a tiny stamp and neutral non-legible line marks. No readable words, letters, text, labels, stars, names or dates. No image of Jimmy and no travel destination collage. Faint cozy room background only, subordinate to characters. Preserve transparent margins around all content, no clipped fingers or heads, scene suited to right half of a landscape card. Do not copy the teacher or pupils from the style image.
```

## keepsake-story-v1

```text
Edit this image with identity and style preserved. Grandmother must have an attentive NEUTRAL expression: small closed mouth, slight questioning raised eyebrows, no smile, no anger, no sadness. Penny calmly reading with subtly parted mouth, not laughing. The lesson asks the learner to infer Grandmother's reaction from dialogue, so the art must not give a happiness verdict. Keep grandmother on left, Penny right and the ONE postcard. Remove the foreground table, cup and stacked books. Keep a medium close keepsake composition with faces and full hands clear; no text. Give a generous transparent safety margin around the whole illustration on ALL four edges; no significant detail touches an edge. Warm brown rounded outlines and gentle paper texture unchanged, transparent background.
```

## grandmother

```text
Derive ONE isolated seated full-body sprite of the elderly Grandmother from this image. Preserve identity: silver hair in bun, oval low glasses, plum shawl over cream blouse, sage skirt, brown shoes; seated in the same warm rust armchair, entire chair legs, complete feet and all fingers visible. Face and eyes toward the RIGHT where her daughter is reading. Attentive neutral small closed mouth and slightly questioning eyebrows, NO smile or anger, one hand gently near her ear. Full figure and chair with at least 10 percent transparent safety margin on EVERY side. No postcard, other person, cup, books, tables, background, text, glyphs or facial emotion symbols. Exact warm paper texture and rounded dark brown outline style. True transparent background without a colored halo.
```

## penny

```text
Derive ONE isolated seated full-body sprite of Penny, the adult woman on right in this image. Preserve identity: dark auburn straight bob, teal hairclip, cream collared blouse under mustard pinafore dress, brown shoes. Sit in the muted teal armchair, full chair including all chair legs and both complete feet shown. Turn head and eyes toward the LEFT where her mother is sitting, reading calmly, gently parted mouth not laughing. Hold the ONE small cream postcard with both hands at chest height; a tiny stamp and a few neutral non-legible strokes, no readable text. Keep all fingers, hands, card and feet intact with 10 percent transparent safety margin on EVERY edge. No other person, objects, room, floor patch, symbols or text. Same warm paper texture and rounded brown outlines. True transparent background without a colored halo.
```
