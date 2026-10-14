# Lesson 71–72 插画与图标

纪念卡、封面和课程内人物由 imagegen 生成，沿用已认可的 Lesson 1–2 / 3–4 暖色圆润描边风格。左侧 Jane（姜黄色开衫、赤褐色发髻）面向右侧；右侧 Pauline（蓝绿色上衣、紫红色裙子、黑色短发）面向左侧。两人是当前正在交谈的成年朋友，故事中的老板和母亲称谓不新增为场内角色。

透明原始文件保留在本地 generated_images；网页 WebP 只缩放、编码，保持透明。`completion-scene.svg` 内嵌同一插画。小图标与环境是可维护的原生 SVG，构建入口 `scripts/art/build-unit7172-assets.js`。

## 纪念卡生成提示与原图

Use case: illustration-story. Create a NEW transparent-background illustration for a children's English lesson commemorative card. Both supplied images are STYLE REFERENCES ONLY: match their warm flat colors, rounded dark brown outlines, large charming adult faces, subtle paper grain and polished close two-person interaction. New story Lesson 71–72: two adult female friends Jane and Pauline discussing yesterday's repeated phone calls. Pauline on RIGHT: neat black chin-length bob with small side part, teal blouse with cream rounded collar, plum pleated skirt. Jane on LEFT: auburn curly high bun, small gold earrings, mustard cardigan over ivory blouse, dark sage wide-leg trousers. Distinct silhouettes, recognizable adults with kind expressive faces. Close waist-up composition: Pauline explains with one COMPLETE open hand near a muted mint-green old rotary telephone resting on a small table; Jane faces her attentively with one COMPLETE hand gently touching a small paper call-record notebook. Both look at each other, not at viewer. Relaxed relieved smiles after the story, no laughing at a person, no cartoon villain, no actual mother, no third character. Telephone receiver must rest on base, no one currently making a call. Tiny softly recessed office/home window and a small wall clock in background, props subordinate to large faces and hands. Color palette warm ivory, muted plum, sage/mint, mustard; dark brown outlines. No printed words, letters, UI, stars, name, card border or baked date. No numbers on notebook needed, only simple short lines. Natural irregular transparent silhouette, no rectangular backdrop, no glow/halo or matte. Landscape 4:3 composition with generous empty alpha margin. Preserve full visible head/hair/hands and all phone parts. Be as polished and friendly as approved keepsakes.

原图目录 `/Users/permission/.codex/generated_images/01a0899f-0489-71c3-b2fa-d22e3b2f1bda/`：
- 纪念卡：`exec-6bc39cfd-b46c-473d-a149-df070ae3bb4f.png` → `keepsake-story-v1.webp`。
- Jane：`exec-eec67714-2cdf-4953-9adc-7b5ec98dc442.png` → `jane.webp`。
- Pauline：`exec-bdbc3b3f-8457-4c1c-9224-76ad9f51e979.png` → `pauline.webp`。

## 人物生成提示

jane

Use case: illustration-story. Attached keepsake is the EXACT character identity and art-style reference. Create one isolated FULL BODY adult character sprite with genuine transparent background. Jane on the LEFT only: auburn curly high bun, small gold earrings, mustard cardigan over ivory blouse, dark sage high-waisted wide-leg trousers, brown low shoes. Stand in three-quarter view facing RIGHT toward Pauline. Interested friendly listening expression, one hand lightly raised near chest, other hand holding a small closed ivory notebook at waist. Both complete hands visible. Match the reference rounded dark brown outlines, soft matte warm colors, subtle paper grain, friendly proportions. Entire head and hair, complete fingers, clothing, both legs, both shoes all visible, generous 8 percent empty alpha margin. Level standing pose, no ground shadow. No extra person, no backdrop, no floor, no writing, no glow, no brown mist or white/black matte around silhouette. Keep face hairstyle clothing identity from reference. Do not crop.

pauline

Use case: illustration-story. Attached keepsake is the EXACT character identity and art-style reference. Create one isolated FULL BODY adult character sprite with genuine transparent background. Pauline on the RIGHT only: neat black chin-length bob with side part, teal blouse with cream rounded collar and cream buttons, plum pleated below-knee skirt, cream socks and dark brown low shoes. Stand in three-quarter view facing LEFT toward Jane. Expressive gently concerned storytelling face, one complete hand gestures open near waist, other relaxed. No phone in hands. Match the reference rounded dark brown outlines, soft matte warm colors, subtle paper grain, friendly proportions. Entire head and hair, complete fingers, clothing, both legs, both shoes all visible, generous 8 percent empty alpha margin. Level standing pose, no ground shadow. No extra person, no backdrop, no floor, no writing, no glow, no brown mist or white/black matte around silhouette. Keep face hairstyle clothing identity from reference. Do not crop.

## 验收

人物完整、彼此相向；对白保持在场景内。纪念卡不把姓名、日期、星星烧进图片；这些内容用寒蝉圆黑体与 Nunito 分区排版。电话听筒停在底座上，场景是回忆与讲述，不暗示正在通话。
