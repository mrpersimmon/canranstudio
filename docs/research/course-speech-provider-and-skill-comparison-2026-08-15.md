# 课程语音生成供应商、ChatGPT Pro 与 speech skill 核验

> 核验日期：2026-08-15
> 课程决定：只提供美式英语课程语音；暂不考虑英式教材原声音轨

## 核验结论

| 方案 | 是否能生成音频 | 当前官方路径 | 对 V1 课程语音包的判断 |
|---|---|---|---|
| OpenAI | 能 | Speech API 把文本生成 MP3、WAV 等文件，可通过指令控制口音、语速、语调和情绪 | 第一候选；有现成官方 `speech` skill，可离线批量制作并固定版本 |
| DeepSeek | 当前官方 API 未发现 | 当前官方模型表只列 `deepseek-v4-flash`、`deepseek-v4-pro` 的文本、推理和工具能力，没有音频输出或 TTS 端点 | 不作为语音供应商；可以辅助检查脚本，但仍要接别家的 TTS |
| 智谱 GLM | 能，但 Coding Plan Max 不含语音额度 | `glm-tts` 通过标准 API 提供 `/audio/speech`，可输出 WAV 并调节语速、音量；`glm-4-voice` 支持中英文语音生成及情感、语调、语速控制 | 第二候选；需另开标准 API 余额或资源包，并与 OpenAI 使用同一组 Lesson 1 盲听样本比较，美式口音教学质量不能只看厂商描述 |
| Kimi | 开源模型能，托管 TTS 未核实 | MoonshotAI 官方开源 `Kimi-Audio` 能生成语音并保存 WAV；本次没有在 Kimi 开放平台官方文档中找到面向产品的托管 TTS 端点 | 暂不作为 V1 主方案；自部署、推理环境和稳定性成本更高，可留作后续研究 |

证据来源：

- OpenAI Speech API 的音频文件、风格控制和内置英语语音说明：[OpenAI Text to speech](https://developers.openai.com/api/docs/guides/text-to-speech)
- DeepSeek 当前官方模型与功能表：[DeepSeek 模型与价格](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)
- 智谱独立 TTS 接口：[GLM-TTS](https://docs.bigmodel.cn/cn/guide/models/sound-and-video/glm-tts)；中英文端到端语音能力：[GLM-4-Voice](https://docs.bigmodel.cn/cn/guide/models/sound-and-video/glm-4-voice)
- 智谱 Coding Plan Max 与标准语音 API 的权益边界：[专项核验](glm-coding-plan-audio-entitlement-2026-08-15.md)
- MoonshotAI 官方开源音频模型及 WAV 生成示例：[Kimi-Audio](https://github.com/MoonshotAI/Kimi-Audio)

“没有发现官方端点”只表示截至核验日的官方公开资料没有给出该能力，不表示供应商永远不会发布；正式制作前仍应重新核对模型、价格、地区可用性和许可。

## ChatGPT Pro 到底提供什么

ChatGPT Pro 支持 ChatGPT Voice；官方文档把它描述为在桌面应用 Chat、Work 和 Codex 中进行实时语音对话。它适合让用户听一句发音、讨论声线和口头校对，但官方文档没有提供把每条回答批量导出为稳定 WAV/MP3 课程资产的流程。[ChatGPT Voice](https://learn.chatgpt.com/docs/features/voice)

因此，Pro 订阅可以“听 ChatGPT 说话”，不能据此视为已获得课程语音包生产接口。官方价格页把 Pro 套餐与 API Key 路径分开列出：API Key 使用独立的平台模型和按量计费。课程文件生成仍需单独的 API 项目、API key 和额度，不能直接使用 Pro 聊天额度。[ChatGPT pricing](https://learn.chatgpt.com/docs/pricing)

## 已找到的官方 speech skill

OpenAI 官方精选 skills 中存在 [`speech`](https://github.com/openai/skills/tree/main/skills/.curated/speech)，当前本机尚未安装。它专门处理单条和批量文本转语音，使用 OpenAI Audio API 和内置语音，支持稳定文件名、MP3/WAV、批量 JSONL、统一指令和结果检查。

安装 skill 本身不会赠送音频额度，也不会绕过认证；真实生成仍要求本机安全设置 `OPENAI_API_KEY`。密钥不得粘贴进聊天、提交到仓库或写入 catalog。

当前精选与已安装 skills 中没有发现同时封装 OpenAI、GLM、DeepSeek 和 Kimi 的供应商无关课程语音 skill。若盲听后决定长期保留多供应商，可以另建一个项目专用 `course-voice-pack` skill，把 catalog Source ID、整单元完整性、生成元数据、响度检查和人工验收统一起来；它应调用各家适配器，而不是把供应商逻辑复制到课程页面。

## 推荐下一步

免费路线已经单独完成核验：[免费美式英语课程语音方案核验](free-american-english-course-tts-options-2026-08-15.md)。先用 Kokoro 与 MeloTTS 在本地零 API 费用生成同一组匿名 Lesson 1 试听样本；只有通过美式英语人工验音和许可复核后，才把胜出者作为发布候选。若本地声线均未达到儿童课程标准，再比较 Google Cloud TTS 免费额度或仍符合资格的 Amazon Polly 免费层。

OpenAI 与 GLM 保留为付费比较组。安装官方 `speech` skill 本身不会获得免费音频额度；只有决定纳入 OpenAI 盲听时，才安全配置带消费上限的独立 API 项目密钥。所有方案都必须从 catalog 导出同一试听集、隐藏供应商名称，并由熟悉美式英语教学的人按准确性、自然度、角色区分、儿童可懂度和跨句一致性验收。
