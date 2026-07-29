# 🤴 挑食小王子大冒险 · The Picky Prince

新概念英语第一册 **Lesson 50** 儿童互动闯关课件（单文件 HTML，零构建、零外部图片依赖）。
与《🥩 肉店大冒险 · Lesson 49》同系列姊妹篇。

## 课程内容

- **词汇**：tomato / potato / cabbage / lettuce / pea / bean / pear / grape / peach（9 个蔬果名词）
- **语法**：一般现在时（经常的状态 / 习惯的动作 / 客观真理）+ 第三人称单数变化（+s / +es / y→ies / have→has、go→goes、do→does）+ do/does 句式变化（"助动词照妖镜，后面动词现原形"）

## 关卡结构

- **封面**：卡通城堡 + 小王子 SVG 场景
- **第 1 关 · 蔬果图鉴**：9 张翻卡（音标/词性/中文）+「听音摘果」8 轮听力游戏
- **第 2 关 · 王子的餐桌**：投喂分拣（😋 爱吃 / 🤢 不爱吃）练 He/She likes... doesn't like... + 句型三连跟读卡 + 快问快答（含彩蛋题）
- **第 3 关 · 动词变身魔法屋**：三卷概念卷轴 + 6 组三单变身秀 + 10 词魔法锅分拣
- **第 4 关 · 照妖镜挑战**：Do/Does 主语分拣机 + 6 题句子大变身（否定/疑问）
- **第 5 关 · 皇家大考核**：8 题综合测验（选项随机洗牌）+ 星级评定 + Canvas 结业证书（保存 PNG / 打印）

## 发音

`audio/` 内置 100 个预录**英式发音（en-GB）** MP3（edge-tts 神经网络语音 Sonia 女声，语速 -10%），全浏览器可播；缺失时静默回退浏览器 speechSynthesis（自动挑选 en-GB 语音）。

文件名规则：`audio/<slug>.mp3`，其中 `slug = text.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')`

页面初始化不自动朗读（浏览器自动播放策略），首次交互后菜盘/动词出现时自动发音。

## 部署

纯静态文件，任意 Web 服务器指到本目录即可（需能通过 HTTP 访问 `audio/` 子目录；直接双击 file:// 打开时音频自动回退 speechSynthesis）。

## 技术

- 单文件 `index.html`（HTML + CSS + 原生 JS，约 88KB）
- Web Speech API（兜底）、Web Audio 合成音效、Canvas 撒花与证书绘制、localStorage 星星进度（键 `l50-stars-v1`）
- 移动端自适应（390px 无横向溢出、吸顶导航压缩、`prefers-reduced-motion` 支持、翻卡键盘可达）
