# Lesson103–104 素材与完整提示词

采用内置 imagegen，参考已确认Lesson1–2卡面画风，先生成Gary与Richard在考场外交谈的近景，再由同一身份图生成两个全身人物。Gary为浅金卷发、珊瑚格纹衬衫和青色肩包；Richard为深色侧分发、藏蓝背心和灰格长裤。两人相向，保留完整的头、手、书本、纸张与双脚。

所有选定素材已保存到本目录：

| 项目文件 | 来源原图 | 尺寸 |
| --- | --- | --- |
| `keepsake-story-v1.webp` | `exec-b5630baa-1052-48cd-a3c5-85791b5f4ad5.png` | 1536×1024 |
| `gary.webp` | `exec-75ef665b-5236-4ab2-b66d-5a465e561eb6.png` | 600×900 |
| `richard.webp` | `exec-574e85f9-a654-4604-a8b3-1f5eea27b2fc.png` | 600×900 |

原稿目录：`C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/`。仅等比转换WebP，保留透明通道，未裁人物；四边两像素内不透明像素均为0。页面中的纸张没有分数或及格／不及格标记；纪念卡庆祝本单元学习成果，不替故事人物公布成绩。没有画出旁边考生或带三小时时长的时钟，避免封面提前解答课文问题。

[原生SVG脚本](../../scripts/art/build-unit103104-assets.js)维护词义图标、走廊、记录和两个候选箱。30／45 cm箱宽图按同一视图框绘制为80／120单位，比例1:1.5；文字条件独立给出书宽及高度／深度均足够。未答记录图不复制正确候选箱，正确检查后才更新记录。词卡pass／fail图表示词义，不属于故事人物的成绩单。教材E／F车价在参考文字保留，非今天市场价格。

## 纪念卡提示词

```text
Use case: illustration-story. Generate a transparent-background keepsake illustration for children's English Lesson 103 The French test. The attached approved Lesson 1–2 card is a STYLE reference only: rounded dark brown outlines, warm paper textures, soft muted colors, expressive friendly faces, same head/body proportions, not those same characters. New distinct adult male students, medium close composition: Gary on LEFT, sandy blond curly hair, coral checked shirt with rolled sleeves and teal canvas shoulder bag, holds a closed plain workbook in one arm and makes a gentle encouraging open-hand gesture toward Richard. Richard on RIGHT, straight dark side-parted hair, navy knitted vest over a cream collared shirt, holds a plain workbook and a blank ungraded exam paper. They face one another in a school corridor just outside an exam room, talking after a test, Richard mildly thoughtful, Gary supportive, no triumphant celebration and no humiliation. Faint door and hallway only in background. No scores, pass/fail marks, trophies, clock, test answers, third student, or written labels. Only the two characters, hands and books/paper clearly readable as props. No readable text, no symbols or stars, no title, no name or date. Generous transparent safety margin on every edge; faces, hands and key props not clipped. Suitable for right-hand artwork of a landscape educational achievement card.
```

## gary

```text
Create ONE isolated FULL BODY sprite of Gary, the man on the LEFT in the attached image. Preserve his exact sandy blond curly hair, warm face, coral checked rolled-sleeve overshirt, cream undershirt, teal shoulder bag and blue closed workbook; add muted brown trousers and brown shoes to complete his body. Stand on the LEFT of a conversation, body, eyes and open hand facing RIGHT toward his friend. A friendly encouraging speaking expression, not celebrating a result. Warm paper texture, rounded dark brown outlines, same head-to-body style. Hair, every finger, bag, books, BOTH shoes fully inside canvas with 10 percent transparent margin on ALL edges. No background, floor patch, halo, other person, text, stars, marks or scores. True transparent background.
```

## richard

```text
Create ONE isolated FULL BODY sprite of Richard, the man on the RIGHT in the attached image. Preserve exact dark side-parted hair, navy knitted vest over cream collared long sleeves, green closed workbook and plain ungraded white paper. Complete his full body with charcoal lightly checked trousers and brown shoes. Stand on the RIGHT of a conversation, body and eyes turned LEFT toward his friend. Mildly thoughtful expression, one hand near chin, the other holding book and blank paper, no exaggerated distress or celebration. Same warm paper texture, rounded dark brown outlines and proportions. Entire hair, hands, every finger, paper and BOTH shoes with 10 percent transparent margin on EVERY edge. No background, floor patch, halo, third person, readable text, stars, scores, pass/fail marks. True transparent background.
```
