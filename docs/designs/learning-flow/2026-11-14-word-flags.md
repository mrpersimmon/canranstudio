# Lesson5–6国旗词卡不提前显示释义

2026-11-14，按用户反馈修正全部8张国旗词卡：French、German、Japanese、South Korean、Chinese、Swedish、English、American。

## 原因与修正

词卡适配器复用了练习中的带标签国旗SVG。国家中文名称已转为图片中的路径轮廓，并非页面上的词义文字，因此收起词义后仍能看到中文答案。

`scripts/prepare-word-flags.js`从原SVG生成词卡专用图，只移除底部中文铭牌及文字轮廓，收紧图的外围空白；原旗面、颜色、比例、图案、边框和阴影完整保留。`unit5-6/current.js`仅在`wordArtwork`中引用专用图，`image`等题内图接口继续使用原图。采用清单与`learning-artwork.js`同步到新素材，保留原图路径、SHA和页面证据。

词卡正面呈现国旗、英文和音标，点击后显示原中文释义，再点收起。现行先插画后语境、每6张连续分页、孤立卡片靠左的规则保持。没有修改词库、题目、答案、评分、学习记录或原纪念卡。

## 统一规则

- 词卡正面图片不能提前嵌入中文释义，检查范围包括铭牌、文字轮廓、替代文字和图片实际内容，不能只搜DOM文字或SVG的`text`标签。
- 准确事实图从原图派生，不重新猜画旗面。词卡图与题内／参考图分开，后者有教学用途的标签继续保留。
- 每张事实图均检查内容准确、释义按需出现、展开／收起无跳位；真实手机尺寸检查完整词名、音标、图案及翻组入口。

## 验证

修复前`word-flags.test.js`明确失败于French正面含中文；日志保留在`output/word-flags/before.log`。修复后8张图的旗面区域逐像素一致，原练习图映射保持，原内容／原卡基线和素材打包检查通过。相关Node与检查范围规则共49项通过，日志为`output/word-flags/contracts.log`。

`word-flags.spec.js`在Chromium和WebKit各验证iPhone SE375×667、iPhone14/15 Pro Max430×932、iPhone16 Pro Max440×956，共6项通过。覆盖两页8张国旗、图片实际内容、展开后的原释义、收起、翻页、卡片／按钮位置与可达性。日志和完整截图在`output/word-flags/phones/`及`phones.log`；三档Chromium证据收录于[证据目录](evidence/2026-11-14-word-flags/)。

另复验`sample-words.spec.js`的Lesson5–6完整4页24词，两引擎2项通过，覆盖所有原词、音标、释义、例句、图片就绪、展开布局、连续翻页、练习入口与学习状态不变，日志为`output/word-flags/unit-regression.log`。本次合计8项浏览器检查；文档链接、语法与差异空白检查通过。`check:plan`已记录当前工作区的累计待检查范围，没有把此前未提交改动的全量计划当成本次全量通过。

本次只运行影响范围检查，不是全站CI。实体手机、微信／夸克尚未实测。未提交、推送或发布。

[本地验收台 · Lesson5–6国旗词卡](http://127.0.0.1:4401/?unit=unit5-6&page=words-0&state=collapsed&device=chrome-iphone-se)
