# Lesson139–140素材

4张最终内置imagegen图，均请求真实透明背景；与已认可1–2画风及137–138的统一轮廓／质感对照，使用新人物。Graham：秃顶棕侧发、小胡须、蓝条纹背心与酒红领带；John：深发、绿色工作帽、方眼镜与赭色外套。

主卡中近景与talk／answer／explain全身图保留电话两端各自的位置。左侧蓝电话、书桌和一张纸；右侧绿听筒、线路设备及一个工具箱，各自连线，不接成同室共享桌面。舞台姓名不预写单位或身份结论。人物全身、手、双脚、听筒和家具完整。

初稿工具箱遮住John右鞋；imagegen修正为较小箱子放在线路柱边，才生成其他姿态。最终4图透明2px边缘alpha>32均0，身体／物品和实际舞台另目视。格式转换只等比缩放／WebP编码，不手工改图或裁人物。

[原生脚本](../../scripts/art/build-unit139140-assets.py)绘制词图和两张360×270资料图。身份图两人均Alex Lee、engineer，Card A为Green Engineering，Card B为River Telephones；时间图18:00是到达计划，工作结束用问号。资料图不高亮正确选项，Nunito400转轮廓，背景伸展独立于图形。

- 最终keepsake-story-v1.webp；原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-c2812d06-ddb6-418a-a049-8496098afef3.png
- 最终talk.webp；原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-bfde917b-0fa5-4382-a5fa-750087e8a3fd.png
- 最终answer.webp；原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-55a65871-60a6-448f-a445-afa9ac493255.png
- 最终explain.webp；原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-88093f40-153f-476b-bc8c-f72817166119.png

工具箱修订前原稿：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-65c107c8-ff00-4d16-84b9-bc985c0db0ad.png

## card

参考：assets/awards/unit1-2-handbag-closeup.webp；assets/unit137-138/keepsake-story-v1.webp（仅画风）

完整提示词：

    Use case: illustration-story. Create a NEW landscape 3:2 transparent children's English lesson card illustration. The supplied references are STYLE ONLY: warm rounded dark-brown outlines, simple expressive faces, soft watercolor texture, cozy restrained colors. New distinct characters in a TELEPHONE CONVERSATION, in TWO SEPARATE PLACES shown as a clear split vignette with an airy gap/division in the middle. LEFT: Graham Turner, stocky middle-aged man with bald crown and short brown hair at sides, small tapered brown moustache, no glasses, cream collared shirt, slate-blue pinstriped waistcoat and burgundy tie; seated at his office desk. He holds a blue corded telephone receiver to his ear and gestures with his other hand, curious friendly expression; one blue telephone base sits on his own desk, with one paper. RIGHT: John Smith, younger slim adult with short dark hair under a muted teal work cap, rectangular glasses, no moustache, ochre work jacket and dark trousers. He holds a dark-green telephone test handset at his ear beside a wooden telephone pole and simple small line service box outdoors; a closed toolbox visible near his waist. Separate office wall hint behind Graham and pale sky/greenery behind John. Do NOT place them at a shared table or in one room, do not connect phone cables physically across the central division. Both figures medium-close waist-up, same adult head scale, large clear faces, complete hands and receivers inside canvas. Phones and line equipment are key. No readable text, labels, speech bubbles, thought bubbles, company logos, clocks, awards, stars or dates. All artwork including background safely inset from all four canvas edges, true transparent 5% outer margin, soft fade only beneath furniture/waist not through any hand, receiver, face or cable endpoint. Preserve warm kind style without turning the men into previous reference characters.

## talk

参考：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-c2812d06-ddb6-418a-a049-8496098afef3.png

完整提示词：

    Use case: identity-preserve. Expand this exact new pair into a SQUARE fully transparent FULL-BODY group for a children's English story stage. Same warm brown outlines and soft painted colors, same faces, hair, moustache, glasses, clothes and telephone colors. Two separate phone-call settings: Graham Turner LEFT, seated on his brown office chair at a compact desk with his blue phone base and exactly one paper; John Smith RIGHT, standing outside beside a short wooden telephone service post with its green box, holding the green handset and with one closed toolbox on the ground. Graham has bald crown/brown side hair, brown moustache, cream shirt, blue pinstriped vest, burgundy tie, brown trousers and brown shoes. John has teal work cap, rectangular glasses, no moustache, ochre jacket, dark blue trousers and brown work boots. Use an open central gap so desk belongs ONLY to Graham and post belongs ONLY to John, do not create a shared room. All bodies, hair, hands, receiver cords, BOTH feet, chair/desk legs, post and toolbox fully inside the canvas with 7% clear margin all around; no edge fades through objects. Head sizes consistent between adult figures. Graham is speaking with free hand gently gesturing; John listens with closed mouth and a mildly questioning expression, holding receiver at ear. Both angled toward the center but speaking by telephone at separate locations. NO room, sky, floor or other background pixels; only the two figures and their separate props on transparent background. No text, name labels, arrows, speech bubbles, clocks or extra people. Keep one handset per man, two separate cords to each man's own base/box, no cable running across the middle.

## talk_fix

参考：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-65c107c8-ff00-4d16-84b9-bc985c0db0ad.png

完整提示词：

    Edit this exact transparent group image. Change ONLY the toolbox placement/size and the foot it currently obscures. John on the right must have BOTH entire brown boots visible with their complete toes and soles. Make the single toolbox smaller, about one boot-width, and place it beside the far right side of the wooden post, safely inside a clear transparent margin, not in front of either foot. If necessary shift John and the post slightly left to create that safe space; retain same adult scale. Keep Graham, desk, office chair, paper, blue phone, John's face, cap, glasses, jacket, posture and green handset, the separate two cords and all other details unchanged. Full bodies and all furniture wholly within the square image, true transparent background. Do not add another toolbox, duplicate feet, labels or ground background.

## answer

参考：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-bfde917b-0fa5-4382-a5fa-750087e8a3fd.png

完整提示词：

    Use case: identity-preserve. Edit pose only in this exact transparent square full-body split telephone scene. Preserve Graham at left seated behind his own desk, blue phone/base and one paper; John at right standing beside his own post and green line box, small single toolbox far right. Keep exact faces, hairstyles, glasses, moustache, clothes, adult proportions, relative positions, complete chairs/desk legs and fully visible BOTH boots for each person. Preserve two separate phone receivers and cords to their own base/box; NEVER put the toolbox in front of any foot. Transparent background with safe margins on every edge, no labels, no text, no extra objects or people, no body cropping. John now speaks into his green receiver, mouth gently open, his free hand open at waist level. Graham listens with mouth closed and his free hand resting on his desk near the paper. Calm slightly puzzled conversation, not anger. No pointing at the service box yet.

## explain

参考：C:/Users/duanxiaodong/.codex/generated_images/01a13a06-86fc-7732-8d58-ede86462cfa9/exec-bfde917b-0fa5-4382-a5fa-750087e8a3fd.png

完整提示词：

    Use case: identity-preserve. Edit pose only in this exact transparent square full-body split telephone scene. Preserve Graham at left seated behind his own desk, blue phone/base and one paper; John at right standing beside his own post and green line box, small single toolbox far right. Keep exact faces, hairstyles, glasses, moustache, clothes, adult proportions, relative positions, complete chairs/desk legs and fully visible BOTH boots for each person. Preserve two separate phone receivers and cords to their own base/box; NEVER put the toolbox in front of any foot. Transparent background with safe margins on every edge, no labels, no text, no extra objects or people, no body cropping. John speaks calmly into the receiver and gestures with his FREE hand toward the green line-service box beside him, without disconnecting the receiver or blocking his face. Graham listens with a mildly attentive surprised expression, mouth closed, free hand near the paper. Preserve every foot and prop, no big reaction or invented celebration.
