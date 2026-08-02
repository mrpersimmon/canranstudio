# Lesson 53 · 英伦气候小主播

新概念英语第一册 Lesson 53《An interesting climate》互动课件。

## 玩法

跟着汉斯和吉姆的对话，走遍英国的东南西北、看遍春夏秋冬：

1. **单词气象台**：17 个气候单词卡（mild / north / season / rise / set / conversation…），外加「听音挑词」小游戏
2. **伦敦小剧场**：四幕对白气泡，可逐句点读，也可一键自动播放整出剧
3. **风向罗盘**：8 组配对（北→cold、东→windy、西→wet、南→warm，春夏秋冬→昼夜长短）
4. **句型魔法屋**：7 句课文原句缺词补齐（North / West / long / early / late / subject）
5. **气候终极考核**：8 道选择题（含 2 道听音题）

每关最高 3 星，共 15 星；五关全部满星后可打印「气候小主播」证书。

## 技术

- 单文件页面 `index.html`，共享模块见 `/core/`（storage / progress / assessment / audio-player / certificate-gate）
- 进度存储键：`canran:l53:progress:v2`（v2 ratings schema）
- 音频：`audio/*.mp3`（edge-tts 英音 Sonia / Ryan / Thomas；单词 -15% 语速，句子 -5%）
- 文件名规则：文本小写后非字母数字替换为 `_`，如 `It's often wet in the West.` → `it_s_often_wet_in_the_west.mp3`
