# 🥩 肉店大冒险 · At the Butcher's

新概念英语第一册 **Lesson 49** 儿童互动闯关课件（单文件 HTML，静态且运行时零依赖、零外部图片依赖）。

线上地址：http://59.110.217.36/lesson49/

## 内容结构

- **封面**：卡通肉店 SVG 场景
- **第 1 关 · 单词肉铺**：17 张翻卡（14 词 + 3 短语，音标/词性/中文）+「听音选词」听力游戏
- **第 2 关 · 课文剧场**：11 句课文逐句动画演绎，自动播放 / 角色扮演模式
- **第 3 关 · 句型魔法屋**：Do/Are 分拣机 · give 双宾语变身 · 实话锦囊 · either/too 跷跷板
- **第 4 关 · 三单训练营**：一般现在时第三人称单数，分拣 + 填空 + 选择 + 翻译
- **第 5 关 · 老板考核**：8 题综合测验，星级评定 + 可打印结业证书

## 发音

`audio/` 内置 52 个预录**英式发音（en-GB）** MP3（edge-tts 神经网络语音：Sonia 女声 / Ryan 男声分角色演绎课文），全浏览器可播；缺失时静默回退浏览器 speechSynthesis。音频生命周期行为来自 `/core/audio-player.js`。

文件名规则：`audio/<slug>.mp3`，其中 `slug = text.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')`

## 部署

页面从 `lesson49/index.html` 部署。纯静态文件，任意 Web 服务器指到仓库根目录即可（生产环境部署于 nginx，站点根目录下的 `lesson49/` 子路径）。

## 技术

- 单文件 `index.html`（HTML + CSS + 原生 JS，约 84KB）
- Web Speech API（兜底）、Web Audio 合成音效、Canvas 撒花、localStorage 星星进度（`canran:l49:progress:v2`）
- 移动端自适应（含吸顶导航压缩、`prefers-reduced-motion` 支持）

## 加固与无障碍合同

- 页面运行时保持静态、无 package；固定为 Fontsource 5.3.0 的构建期包通过
  `npm run vendor:fonts` 重新生成已提交的 `assets/fonts/`。该目录包含 WOFF2、`fonts.css`
  和 OFL 许可证副本，页面从同源 `/assets/fonts/` 加载字体。
- 证书的领取、打印和保存处理都会重新检查五关资格。领取界面是原生模态 `<dialog>`；反馈
  状态区使用 `polite`、`atomic` live region。
- 保存证书先生成 Blob，并为每个创建的 object URL 保留一次关闭或创建失败时的 revoke 路径。
