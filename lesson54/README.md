# lesson54 — 环球护照之旅（新概念英语第一册 Lesson 54）

What nationality are they? / Where do they come from? 互动闯关课件

## 玩法
1. 单词签证官：12 组「国家 → 国籍」对卡（含音标、中文），点击听英音 + 听音挑国小游戏
2. 到达大厅广播剧：12 位旅客说「I'm Australian. / I come from Australia.」（含 I/He/She/We/You/They 全部人称），可自动播放全部
3. 护照盖章：国家与国籍点选配对，12 对全部盖满过关
4. 句型魔法屋：第三人称 does/doesn't 疑问句、否定句变身填空（动词脱 s 尾巴）
5. 海关终极考核：8 题测验，过关领「环球小使者」证书（5 关各 ≥1 星解锁打印）

## 工程规范（与仓库其他课件一致）
- 语音：`core/audio-player.js`（预录 `audio/<slug>.mp3` 优先，speechSynthesis 兜底，en-GB 语音）
  - slug 规则：`text.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')`
  - 音频由 edge-tts 生成：en-GB-SoniaNeural / en-GB-RyanNeural
- 进度：`core/storage.js` + `core/progress.js`，键 `canran:l54:progress:v2`，五关 l1~l5，每关 0~3 星
- 测验选项乱序：`core/assessment.js` shuffleOptions
- 字体：自托管 `/assets/fonts/fonts.css`（Fredoka / Baloo 2 / ZCOOL KuaiLe），无外部 CDN

## 部署
静态文件，需与 `/core`、`/assets` 同根部署；路由见 `deploy/nginx/canranstudio-http.conf`。
线上地址：https://www.canranstudio.cn/lesson54/
