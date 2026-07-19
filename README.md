# 🥩 肉店大冒险 · At the Butcher's

新概念英语第一册 **Lesson 49** 儿童互动闯关课件（单文件 HTML，零构建、零外部图片依赖）。

线上地址：http://59.110.217.36/lesson49

## 内容结构

- **封面**：卡通肉店 SVG 场景
- **第 1 关 · 单词肉铺**：17 张翻卡（14 词 + 3 短语，音标/词性/中文）+「听音挑肉」听力游戏
- **第 2 关 · 课文剧场**：11 句课文逐句动画演绎，自动播放 / 角色扮演模式
- **第 3 关 · 句型魔法屋**：Do/Are 分拣机 · give 双宾语变身 · 实话锦囊 · either/too 跷跷板
- **第 4 关 · 三单训练营**：一般现在时第三人称单数，分拣 + 填空 + 选择 + 翻译
- **第 5 关 · 老板考核**：8 题综合测验，星级评定 + 可打印结业证书

## 发音

`audio/` 内置 52 个预录**英式发音（en-GB）** MP3（edge-tts 神经网络语音：Sonia 女声 / Ryan 男声分角色演绎课文），全浏览器可播；缺失时静默回退浏览器 speechSynthesis。

文件名规则：`audio/<slug>.mp3`，其中 `slug = text.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')`

## 部署

纯静态文件，任意 Web 服务器指到本目录即可（生产环境部署于 nginx，站点根目录下的 `lesson49/` 子路径）。

## 技术

- 单文件 `index.html`（HTML + CSS + 原生 JS，约 84KB）
- Web Speech API（兜底）、Web Audio 合成音效、Canvas 撒花、localStorage 星星进度
- 移动端自适应（含吸顶导航压缩、`prefers-reduced-motion` 支持）
