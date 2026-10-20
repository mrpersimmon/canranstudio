# Lesson 45–46 素材依据

独立三人办公室：老板深发宽领马甲；Bob金色侧分发、细领带和绿色马甲；Pamela外翘短发、发箍和紫色圆领上衣。深棕描边和暖纸延续站内画风；衣服结构与角色轮廓区别于邻课。

- 人物以本课已获认可的纪念卡为画风依据，内置 imagegen 生成 Bob、Pamela、老板三套透明动作图；图鉴、舞台、选项、封面与结算画面共享。原有 SVG 地址保留，用视口摆放内嵌 PNG，兼顾浏览器与图片导出；场景、物品仍为原生 SVG。
- 信件为单独道具，老板→Bob→Pamela始终只有一份。人物自身已画双手，旧叠加手层留空，避免重复手；封面及结算的信在桌上，Pamela使用自然站姿。
- 语法示范的鸟、三本书和水杯分别对应可见英文，不用相近图代替目标。
- `keepsake-story-v1.webp`由内置imagegen生成；以认可1–2／3–4／5–6近景卡为画风依据，表现两人一起辨认字迹。初稿多余的手经imagegen编辑移除；之后仅缩小、转换WebP，保留透明度。
- 姓名、星位和日期由账号渲染，插画无文字、星星或完成结果。课程底卡、悬浮卡、书页和GIF共用这一图稿。
- 结算三图标继续使用`assets/unit1-2/completion/`的认可星／勾／叉。

[纪念卡提示词、原图位置与指纹](../../docs/butcher-version/evidence/2026-10-12-1627-unit45-46/manifest.json)；[原课程验收](../../docs/butcher-version/2026-10-12-1627-v1.0-Lesson45-46设计与验收.md)。

用户已认可本课纪念卡，并要求课内及封面人物采用它的风格。本次限 Lesson 45–46：[人物设计与验收](../../docs/butcher-version/2026-10-12-1748-v1.1-Lesson45-46人物风格统一.md)、[生成提示词](../../docs/butcher-version/evidence/2026-10-12-1748-unit45-46-characters/prompts.md)、[素材来源及不变项核对](../../docs/butcher-version/evidence/2026-10-12-1748-unit45-46-characters/manifest.json)。三套 PNG／WebP 原稿保存于该证据目录，避免作为重复课程资源下载。

## 2026-10-17统一标准重构

原47张图和已认可的纪念卡完整保留。本次没有重新生成AI人物；只调整当前舞台的布局、朝向作用范围、唯一信件的父容器和手部前景。前景复用同一源图的手部区域，不另绘手；旧holding-hands.svg和旧URL保持。

[原生脚本](../../scripts/art/build-unit4546-v153.cjs)维护8组双侧参考及put-on-v153.svg；[数字轮廓脚本](../../scripts/art/unit45-46-number-labels.py)从固定本地Nunito400生成thousand-v153.svg和million-v153.svg，共11个新SVG。数字编号与数量分开，戴帽子箭头向头部，桌／高架、箱／墙、书／杂志两边目标均显示。

实际SVG复查发现三份PNG分别被重复嵌入8、3、6次；[原始嵌入审计](../../docs/butcher-version/evidence/2026-10-17-2145-unit45-46/asset-audit.json)只描述未压缩重复数据，不等同网络流量节省或加载耗时原因。后续可评估新资源结构，先保留旧图／旧证；本轮未做全局资源工程。

详见[设计与验收](../../docs/butcher-version/2026-10-17-2145-v2.0-Lesson45-46统一标准重构与验收.md)。原人物、纪念卡与字体认可状态沿用，不把本次软件检查变成新的用户美术确认。
