# 🔊 音标魔法乐园 · 英语音标第一课

儿童互动音标课件（单文件 HTML，静态且运行时零依赖、零外部图片依赖）。

线上地址：http://59.110.217.36/soundmark

## 内容结构（闯关路线）

- **第 1 站 · 元音 vs 辅音**：气流比喻讲解 + 三条辨认技巧 + 即时小测验
- **第 2 站 · 6 个元音小精灵**：/ɪ/ /iː/ /ʊ/ /uː/ /æ/ /e/ 贴纸卡（口型 SVG、发音秘诀、对应字母、例词点读）
- **第 3 站 · 音节魔法**：encyclopedia 等 8 个长单词动画切音节，整词慢读配音
- **第 4 站 · 对比擂台**：ship/sheep 等 14 组最小对立对，左右对比点读
- **第 5 站 · 游戏乐园**：听音小侦探 / 左耳右耳 / 拼读小达人，答对撒花集星
- **藏宝图 · 48 音标全家福**：全表点读
- **终点 · 毕业证书**：星星展示 + 名字填写

## 发音

`audio/` 内置 122 个预录**英式发音（en-GB）** MP3（edge-tts 神经网络语音：Sonia 女声，-15% 语速方便跟读），全浏览器可播；缺失时静默回退浏览器 speechSynthesis（en-GB 语音优先）。

文件名规则：`audio/<slug>.mp3`，其中 `slug = text.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')`（与 lesson49 一致）

## 部署

纯静态文件。生产环境部署于 nginx，站点根目录下的 `soundmark/` 子路径。

## 技术

- 单文件 `index.html`（HTML + CSS + 原生 JS，约 52KB）
- Web Audio 无需；`<audio>` 预录播放、Web Speech API（兜底）、Canvas 撒花、localStorage 星星进度（键 `canran:soundmark:progress:v2`）
- 移动端自适应

## 加固与无障碍合同

- 页面运行时保持静态、无 package；固定 Fontsource 5.3.0 构建期包通过
  `npm run vendor:fonts` 重建已提交的 `assets/fonts/`。其下保存 WOFF2、`fonts.css` 和
  OFL 许可证副本，字体只从同源路径请求。
- 证书领取和打印处理都会重新检查资格。证书界面使用原生模态 `<dialog>`，课程反馈与提示
  使用 `polite`、`atomic` live region。
