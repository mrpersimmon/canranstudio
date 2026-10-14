# Lesson 69–70 插画

使用内置 imagegen 生成透明纪念卡及同身份全身人物。代码只裁空边、加安全留白、等比例缩放及 WebP 编码，保留原始 alpha。生成源保留于本机会话 generated_images；最终文件均在本目录。SVG 教学图示由 scripts/art/build-unit6970-assets.js 生成。

成品：keepsake-story-v1.webp、narrator.webp、wife.webp；completion-scene.svg 内嵌同一纪念卡。纪念卡参考 Lesson 1–2、3–4；全身人物参考本单元纪念卡。

## art_prompt

Create a transparent-background illustration for a children's English lesson commemorative card. The two supplied reference images are STYLE REFERENCES ONLY: match their warm paper-like flat colors, rounded dark brown outlines, charming adult proportions, large expressive faces, subtle grain, close-up two-person interaction. New story: a married couple happily watching a vintage 1995 car race from BEHIND a spectator safety railing, not driving. Waist-up close composition: on left an adult male narrator with short black curly hair, teal-blue casual varsity jacket, mustard scarf, friendly oval face, points toward the race with a COMPLETE hand. On right his wife with chestnut side braid, coral pinafore dress over ivory blouse, joyful alert eyes, lightly holds his other arm while looking toward the race. Both faces large, identities distinct from reference people. In a small unobtrusive background to their right show a red vintage open-wheel race car heading toward a black and cream checkered finish marker, driver in a helmet. The car has one small legible number 15. The couple must not wear racing helmets. Muted blue sky wash, pale sage grandstand hints. Illustration itself only, no card border, no lettering except the car number 15, no stars, no name, no badge. Natural compact silhouette with softly irregular transparent edges, no white rectangular background. Complete visible faces, arms, fingers; no random severed body parts. Landscape 4:3 composition with generous alpha margin. Be as polished as the reference keepsakes.

## narrator_prompt

Use the attached keepsake as the exact character identity and art-style reference. Create one isolated FULL BODY character sprite on true transparent background, no frame no writing no background no extra person. Rounded dark brown outlines, gentle paper grain, charming adult proportions. Head, both complete hands/fingers, full clothing, legs and both shoes must all be visible with generous 8% alpha padding. Standing on level ground with only a very faint small foot shadow. The male narrator only: short black curly hair, teal varsity jacket with ivory sleeves, mustard scarf, dark brown trousers, cream sneakers. Preserve his face/hair/clothing from reference. Three-quarter facing RIGHT, friendly speaking to his wife on the right; one hand gesturing close to his chest, other relaxed. NO pointing off left, NO crop, no railing.

## wife_prompt

Use the attached keepsake as the exact character identity and art-style reference. Create one isolated FULL BODY character sprite on true transparent background, no frame no writing no background no extra person. Rounded dark brown outlines, gentle paper grain, charming adult proportions. Head, both complete hands/fingers, full clothing, legs and both shoes must all be visible with generous 8% alpha padding. Standing on level ground with only a very faint small foot shadow. The wife only: chestnut side braid, coral pinafore dress with buttons over ivory puff-sleeve blouse, brown low shoes. Preserve her face/hair/clothing from reference. Three-quarter facing LEFT, looking kindly toward husband to left, one hand raised with a small reassuring open palm, other at waist. No props, no railing, no crop.

## narrator_cleanup_prompt

Edit this character sprite only: REMOVE ALL the diffuse brown/orange glow/halo surrounding the body, and remove the gray/brown ground shadow. Outside the solid drawn character there must be completely empty transparent pixels, no colored mist, no black or white matte, no vignette. Preserve the exact character, pose, face, clothing, outlines, warm colors and interior paper texture. Keep the entire head, both complete hands, feet and shoes uncut. Keep 8% transparent padding all four edges. This is a transparent cutout game sprite, no background or ambient lighting.

## wife_cleanup_prompt

Edit this character sprite only: REMOVE ALL the diffuse brown/orange glow/halo surrounding the body, and remove the gray/brown ground shadow. Outside the solid drawn character there must be completely empty transparent pixels, no colored mist, no black or white matte, no vignette. Preserve the exact character, pose, face, clothing, outlines, warm colors and interior paper texture. Keep the entire head, both complete hands, feet and shoes uncut. Keep 8% transparent padding all four edges. This is a transparent cutout game sprite, no background or ambient lighting.
