# lesson52 — 环球护照之旅 Ⅰ（新概念英语第一册 Lesson 52）

What nationality are they? / Where do they come from? 互动闯关课件 · 欧美篇
与 lesson54（Ⅱ 卷）同一主题上下篇。

## 玩法
1. 单词签证官：12 组「国家 → 国籍」对卡（the U.S.→American … Sweden→Swedish），点击听英音 + 听音挑国小游戏
2. 到达大厅广播剧：12 位欧美旅客说「I'm American. / I come from the U.S.」（I/He/She/We/You/They 全部人称），可自动播放全部
3. 护照盖章：国家与国籍点选配对，12 对全部盖满过关
4. 句型魔法屋：第三人称单数动词小尾巴 come/comes、like/likes 选择填空（课本练习 A 七句）
5. 海关终极考核：8 题测验，五关全部三星（15/15）解锁打印「环球小使者 Ⅰ」证书

## 工程规范（与仓库其他课件一致）
- 语音：`core/audio-player.js`（预录 `audio/<slug>.mp3` 优先，speechSynthesis 兜底，en-GB 语音）
- 进度：`core/storage.js` + `core/progress.js`，键 `canran:l52:progress:v2`，五关 l1~l5，每关 0~3 星
- 证书闸门：`core/certificate-gate.js`（15/15 三星解锁，缺星引导跳转）
- 字体：自托管 `/assets/fonts/fonts.css`，无外部 CDN
- 首页插图：`assets/home/lesson52-passport.svg`

## 部署
静态文件，需与 `/core`、`/assets` 同根部署；路由见 `deploy/nginx/canranstudio-http.conf`。
线上地址：https://www.canranstudio.cn/lesson52/
