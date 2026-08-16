# GLM Coding Plan Max 音频生成权益核验（2026-08-15）

## 核验问题

1. GLM Coding Plan Max 的订阅额度是否包含 GLM-TTS 或 GLM-4-Voice？
2. Coding Plan 与智谱开放平台标准 API 的端点、API Key 和余额是否分离？
3. 如果另行使用标准 API 生成语音，入口和已公开限制是什么？

本文只使用智谱 AI / BigModel 官方页面。套餐、模型和价格可能变化，实施前应重新核验。

## 结论

**GLM Coding Plan Max 本身不能作为 GLM-TTS 或 GLM-4-Voice 的语音生成额度。** Max 可以帮助开发者编写、调试语音生成脚本，但实际生成课程音频要调用智谱开放平台的**标准 API**，并按照标准 API 的资源包或账户余额另行计费。

这一结论只针对**订阅权益和计费来源**，不代表 GLM-TTS 或 GLM-4-Voice 技术上不可用：两个模型均有官方标准 API 使用说明。

官方当前没有逐字写出“Coding Plan Max 明确不支持 GLM-TTS / GLM-4-Voice”这一句话，但给出了足以确定权益边界的两项规则：

- Coding Plan 的完整“可用模型”列表只列出 `GLM-5.3`、`GLM-5-Turbo`、`GLM-4.7`，未列出 `GLM-TTS` 或 `GLM-4-Voice`。
- Coding Plan FAQ 明确规定：在指定工具和产品环境以外调用 API，不可享用 Coding 套餐额度；自建应用、网站、机器人、SaaS 等 API 集成必须使用标准 API，并按对应协议计费。

因此，严谨措辞是：

- **明确不支持**：使用 Coding Plan Max 套餐额度抵扣课程音频生产所需的标准 API 调用。
- **未发现**：官方提供任何把 GLM-TTS 或 GLM-4-Voice 纳入 Max 套餐额度的例外权益。
- **明确支持**：另行开通并付费使用标准 API 后，通过 GLM-TTS 或 GLM-4-Voice 生成音频。

官方依据：

- [GLM Coding Plan 套餐概览](https://docs.bigmodel.cn/cn/coding-plan/overview)
- [GLM Coding Plan 常见问题](https://docs.bigmodel.cn/cn/coding-plan/faq)

## Coding Plan 与标准 API 的分离边界

### 端点：明确分离

| 用途 | 官方端点 | 计费权益 |
| --- | --- | --- |
| Coding Plan 的 OpenAI 兼容接口 | `https://open.bigmodel.cn/api/coding/paas/v4` | Coding Plan 套餐额度 |
| Coding Plan 的 Anthropic 兼容接口 | `https://open.bigmodel.cn/api/anthropic` | Coding Plan 套餐额度 |
| 智谱标准 API | `https://open.bigmodel.cn/api/paas/v4` | 标准 API 资源包或账户余额 |

官方明确要求 Coding Plan 使用专属 Base URL。官网体验中心也不支持使用 Coding Plan 额度。

官方依据：

- [GLM Coding Plan 快速开始](https://docs.bigmodel.cn/cn/coding-plan/quick-start)
- [GLM Coding Plan 常见问题](https://docs.bigmodel.cn/cn/coding-plan/faq)

### 额度与余额：明确分离

- Coding Plan 额度耗尽后，需要等待额度恢复；系统明确不会继续消耗用户的其他资源包或账户余额。
- 在不满足 Coding Plan 使用条件或使用标准 Base URL 时，调用可能使用标准 API 资源包或账户余额，而不是 Coding Plan 额度。
- 因此，拥有 Max 并不等于拥有可用于音频生成的标准 API 余额。

官方依据：

- [GLM Coding Plan 套餐概览](https://docs.bigmodel.cn/cn/coding-plan/overview)
- [GLM Coding Plan 常见问题](https://docs.bigmodel.cn/cn/coding-plan/faq)

### API Key：团队版明确分离，个人版未发现完整说明

- 团队版：官方明确写明“团队套餐 Key 与平台其他 API Key 不通用”。
- 个人版：官方要求从“个人编程套餐 > 套餐概览”新建 API Key，但当前文档**未发现**关于该 Key 能否同时认证标准 API 的明确承诺。
- GLM-TTS 的标准 API 文档要求从开放平台的 API Keys 页面获取 Bearer Key。

基于当前证据，实施时不应假设个人 Coding Plan Key 可以直接调用 GLM-TTS 或 GLM-4-Voice。应按标准 API 文档创建或选用标准 API Key，并为标准 API 单独准备余额或资源包；不要把密钥写入代码仓库。

官方依据：

- [GLM Coding Plan 快速开始](https://docs.bigmodel.cn/cn/coding-plan/quick-start)
- [GLM-TTS 文本转语音 API](https://docs.bigmodel.cn/api-reference/%E6%A8%A1%E5%9E%8B-api/%E6%96%87%E6%9C%AC%E8%BD%AC%E8%AF%AD%E9%9F%B3)

## 可用的标准 API 语音入口

### GLM-TTS：适合把固定课文批量生成音频文件

入口：

- 官方模型页提供体验中心，可先人工试听。
- 标准 API：`POST https://open.bigmodel.cn/api/paas/v4/audio/speech`
- 模型名：`glm-tts`

官方公开限制与能力：

- 输入为文本，输出为音频。
- 单次输入文本最长 `1024` 个字符。
- 系统音色包括 `tongtong`、`chuichui`、`xiaochen`、`jam`、`kazi`、`douji`、`luodo`；也支持已创建的复刻音色。
- 语速范围 `[0.5, 2]`，音量范围 `(0, 10]`。
- 非流式输出支持 WAV 或 PCM；流式输出只支持 PCM，编码可为 Base64 或 Hex。
- 默认包含显式水印和隐式数字水印；只有在账户完成官方去水印操作后，关闭水印才会生效。
- 官方模型页展示的现成音色和示例以中文为主；当前页面**未发现**“通用美式英语口音”或某个美式英语音色的质量承诺。因此，接口可生成音频不等于已经满足本项目的美式发音标准，仍需用实际英文课文盲听验收。

官方依据：

- [GLM-TTS 模型说明与调用示例](https://docs.bigmodel.cn/cn/guide/models/sound-and-video/glm-tts)
- [GLM-TTS 文本转语音 API 参数](https://docs.bigmodel.cn/api-reference/%E6%A8%A1%E5%9E%8B-api/%E6%96%87%E6%9C%AC%E8%BD%AC%E8%AF%AD%E9%9F%B3)

### GLM-4-Voice：适合语音对话，不是 Coding Plan 权益

入口：

- 使用智谱标准 API 的对话补全接口：`POST https://open.bigmodel.cn/api/paas/v4/chat/completions`
- SDK 模型名：`glm-4-voice`
- 返回消息中的 `audio.data` 为 Base64 音频，可解码保存为 WAV。

官方公开限制与能力：

- 输入模态为文本、音频，输出模态为音频。
- 支持中英文语音理解与生成，可按指令调整情感、语调、语速和方言。
- 上下文窗口 `8K`，最大输出 `4K Tokens`。
- 官方标价为 `80 元 / 百万 Tokens`。
- 官方说明没有承诺其英文输出一定达到本项目要求的通用美式口音；是否适合作为 6–8 岁儿童课程音频仍必须实际试听并由美式英语审核者验收。

官方依据：

- [GLM-4-Voice 模型说明、价格与 SDK 示例](https://docs.bigmodel.cn/cn/guide/models/sound-and-video/glm-4-voice)
- [标准 API 对话补全接口](https://docs.bigmodel.cn/api-reference/%E6%A8%A1%E5%9E%8B-api/%E5%AF%B9%E8%AF%9D%E8%A1%A5%E5%85%A8)

## 对 canranstudio 的实际建议

1. 不把现有 Coding Plan Max 预算视为课程音频预算。
2. 如需评测 GLM，先在标准 API 侧设置小额、可封顶的余额或资源包，并创建标准 API Key。
3. 固定课程音频优先评测 GLM-TTS；GLM-4-Voice 更适合后续实时口语互动研究。
4. 用 Lesson 1 的相同英文脚本生成最小试听集，与其他候选供应商盲听比较。
5. 盲听至少检查通用美式口音、单词重音、连读、语速、儿童可懂度、跨句一致性和角色稳定性。
6. 未通过人工美式发音审核的音频不得进入发布语音包。

## 证据状态摘要

| 命题 | 核验状态 |
| --- | --- |
| Max 套餐的可用模型包含 GLM-TTS | **未包含；官方可用模型列表未列出** |
| Max 套餐的可用模型包含 GLM-4-Voice | **未包含；官方可用模型列表未列出** |
| Max 套餐额度可用于自建课程的标准 API 音频调用 | **明确不支持** |
| 标准 API 可以调用 GLM-TTS 生成 WAV / PCM | **明确支持** |
| 标准 API 可以调用 GLM-4-Voice 输出音频 | **明确支持** |
| Coding Plan 额度耗尽后自动扣标准 API 余额 | **明确不会** |
| 团队 Coding Plan Key 与平台其他 API Key 通用 | **明确不通用** |
| 个人 Coding Plan Key 与标准 API Key 通用 | **未发现官方明确说明** |
| GLM-TTS 官方承诺通用美式英语发音质量 | **未发现** |
| GLM-4-Voice 官方承诺通用美式英语发音质量 | **未发现** |
