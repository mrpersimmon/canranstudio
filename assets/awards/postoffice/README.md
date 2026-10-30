# 时光邮局采用环境

`scene-v3.png` 原样复用已认可的时光邮局环境，不包含学生姓名、卡片、星数、Lesson或界面控件。正式页面中的原纪念卡由已有共享排版及账号数据呈现。

- 尺寸：1070×1470。
- SHA-256：`841b27fe597fc797a98955d2d3e162d8eb8ada661011f08c89a44659d8fcaa02`。
- 来源：[已认可原型](../../../poc/keepsake-postoffice/public/art/postoffice-scene-v3.png)。文件字节一致。
- 提示词：[初稿](../../../poc/keepsake-postoffice/design/scene-prompt.json)、[文字安全区](../../../poc/keepsake-postoffice/design/scene-v2-prompt.json)、[信封比例](../../../poc/keepsake-postoffice/design/scene-v3-prompt.json)。本次正式接入没有重新生图。
- 运行时：由 `scripts/award-book-bundle.js` 输出带指纹的图片URL；背景与主卡共享同一等比场景。
- 标准：[纪念册统一设计标准](../../../docs/award-version/纪念册统一设计标准.md) M12–M17。

后续替换环境必须重新核验文字安全区、卡位、信封侧角、圆角轮廓和手机组合效果。不要把原纪念卡画进背景，不因新页面不引用就删除旧书、旧证或历史卡片素材。

## 界面标题字库

`postoffice-ui-500.woff2` 是完整 Award Gothic Medium 的界面专用子集，780字符、125444字节，比原4.4MB文件约减少97.2%。逐字核对轮廓、字宽和行度量相同。原姓名／纪念卡完整字库保留不变，原卡导出仍使用原字体。

[来源和输入指纹](ui-font-source.json)记录已有本地源及OFL许可；用[生成脚本](../../../scripts/vendor-postoffice-ui-font.py)配合 `fonttools[woff]==4.66.1` 重建。界面文案或卡名变化后须重新检查覆盖，不能覆盖原完整字库。
