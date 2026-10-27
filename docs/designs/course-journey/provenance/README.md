# 原认可稿的来源

- 用户认可日期：2026-10-20。
- 对应最近一组方案中第三张显示的图片；原文件名：`exec-d1c452a1-53e4-4a77-9423-6030cbb499b0.png`。
- 本包中的原图是二进制复制，未缩放、重编码或覆写。
- 工具：内置 `image_gen.imagegen`，背景非透明。历史调用没有公开随机种子或可固定的后端模型版本。
- [generation.json](generation.json)保留原调用 ID、源记录行号、输入图顺序和提示词 SHA-256。

[original-request.txt](original-request.txt)由同一会话中记录的两段模板和一次角色说明替换确定性重建：先重建公共提示词，再拼接该图的旅程地图方向段。没有加入本轮的新风格要求。[original-common.txt](original-common.txt)和[original-direction.txt](original-direction.txt)保存分段结果。未复制与这次生成无关的会话内容、账号凭据或其他个人记录。

原次输入依次为：当前产品截图、星花品牌、首课手提包人物、Duolingo 官方路线示意、纪念碑谷官方画面。历史参考存于 `references/original-context/`；品牌和人物在其他参考目录。历史调用未保存输入图哈希，因此这些是 2026-10-20 可取得的参考副本，不能声称其字节哈希在历史调用时已被记录。

后续任务改用**用户认可图为第一参考**，不再靠第三方产品图重新推断风格。原次图片只用于内部设计追溯，不作为他人品牌或角色素材使用。

官方出处：
- [Duolingo：路线设计说明](https://blog.duolingo.com/new-duolingo-home-screen-design/)
- [Monument Valley 官方画面](https://www.monumentvalleygame.com/mv3)
