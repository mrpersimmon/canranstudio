# 雨伞故事的统一手绘素材

2026-09-06，按用户指定的迪士尼绘画风格，用内置 imagegen 生成。旧素材保留供追溯，运行时使用此目录 WebP。图像不是官方迪士尼角色或素材。

|用途|母版|提示词与来源|页面朝向/辨识要求|
|---|---|---|---|
|左侧服务员|attendant-right.png|source/attendant-right.prompt.md|奶油猫、红毛衣，目光/身体/掌心向右|
|右侧顾客|visitor-left.png|visitor-left.prompt.md|棕色条纹猫、蓝帽衫，目光/身体/掌心向左|
|号码牌|ticket-five.png|ticket-five.prompt.md|普通暖黄色领取牌，深棕大号 5|
|星星伞|umbrella-star.png|umbrella-star.prompt.md|蓝布面，4颗浅黄大星星|
|条纹伞|umbrella-stripe.png|umbrella-stripe.prompt.md|红布面，3条奶油宽条纹|
|圆点伞|umbrella-dot.png|source/umbrella-dot.prompt.md|淡紫布面，6个大奶油圆点|

生成工具曾把棋盘格绘入 RGB，不能直接接入。先尝试内置透明修正，再按用户既有授权做技术性背景整理，保留原稿和具体处理记录。主体绘画仍来自 imagegen。服务员图额外清除 65 个主体外白色孤岛，未改主体。

角色保持完整耳朵、尾巴和脚；物品保留至少8%边距，96px下检查数字和花纹；最终 alpha 需同时有透明背景、不透明主体。`manifest.json` 将已验收的运行副本、母版、生成记录和角色朝向绑定。换图后须重新验收并更新记录；图片加载成功不能代替画风、朝向或辨识度判断。
