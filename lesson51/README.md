# lesson51 — 希腊四季之旅（新概念英语第一册 Lesson 51）

A pleasant climate 宜人的气候 · 互动闯关课件

## 玩法
1. 单词行囊：26 张单词卡（天气/季节/月份），点击听英音 + 听音挑词小游戏
2. 课文剧场：Hans 与 Dimitri 对话分幕播放，英音男声/女声双角色，可自动播放全场
3. 月份归队：把 12 个月份点选送回四个季节家
4. 频率阶梯：always / often / sometimes 频率副词句型
5. 导游考核：8 题小测验，过关领星星证书

## 语音方案（任意浏览器可听）
- 优先播放 `audio/<slug>.mp3` 预录音频（edge-tts 英音：Hans=RyanNeural 男声，Dimitri=SoniaNeural 女声；课文剧场 16 句使用 `-25%` 儿童友好语速）
- 失败时静默回退到浏览器 speechSynthesis（优先 en-GB 语音）
- slug 规则：`text.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')`

## 部署
静态文件，nginx 指向本目录即可；线上地址：http://59.110.217.36/lesson51/
