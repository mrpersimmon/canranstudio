# Lesson 1–2 当前人物

`man-v154.webp`、`woman-v154.webp`由内置imagegen按已确认的`assets/awards/unit1-2-handbag-closeup.webp`分别生成全身透明人物，男士向右、女士向左。生成后以Sharp等比缩到高768并编码WebP，保留alpha；未手工重绘或去底。完整提示词与处理记录见[v154-generation.json](v154-generation.json)。

旧`man.svg`、`woman.svg`继续服务历史证书和历史测试，不能覆盖。封面、首页、当前纪念卡复用原确认近景插画，完成区也复用该图。课堂物品图仍为可编辑SVG，人物身份与手提包归还时序在页面中核对。

新增人物单独放在此目录，由Lesson1–2显式引用。`assets/unit1-2/`是多个课程共享结算组件的动态素材来源；往该旧目录加资源会让其他课包一起增大，因此保留原目录边界。
