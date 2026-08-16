# 免费美式英语课程语音方案核验

> 核验日期：2026-08-15
>
> 使用场景：canranstudio 面向 6–8 岁儿童的离线课程语音包
>
> 目标：通用美式英语，可冻结为 WAV/MP3，支持后续真人老师整包替换

## 先说结论

有免费方案，但“免费”至少有三种不同含义，不能混为一谈：

1. **本地零 API 费用**：Kokoro、MeloTTS、Piper 下载后可在本机生成 WAV，不按字符付费，但仍有本地计算、工程维护、人工验音和许可证审查成本。
2. **云服务免费额度**：Google Cloud TTS、Amazon Polly、Azure Speech 都有或曾有免费额度，但要受账户资格、月度上限和随时可能变化的价格约束；其中 Google 还明确要求启用结算，超额自动收费。
3. **免费且可正式发布**：不仅要能生成文件，还要有覆盖声线、模型和输出用途的许可依据。当前一手资料下，Google Cloud TTS 和 Amazon Polly 对生成音频的应用/媒体使用或存储复用写得最清楚；Azure 免费层不能据此用于正式商业发布。三个本地开源候选都能试听，但没有任何一个官方明确写出“生成音频归用户所有并可商业再分发”的完整承诺句。

因此当前建议分两步：

- **零成本试听**：用 Kokoro 和 MeloTTS 从 catalog 导出同一组 Lesson 1 台词，在本机生成 WAV，执行已经确定的三层验收。
- **正式发布**：若本地声线胜出，先完成一次许可复核或取得维护者书面澄清；若希望用一手条款更清楚的零账单路径，可在免费额度内试 Google Cloud TTS 或符合资格的 Amazon Polly，并设置严格用量控制。

本文是工程和采购证据整理，不替代法律意见。课程文本本身、教材摘录及真人录音仍须另行确认权利。

## 总览

| 方案 | 是否可零 API 费用 | 明确美式声线 | 能否冻结文件 | 内部试听 | 正式发布判断 |
|---|---:|---|---|---|---|
| Kokoro 82M | 是，本地运行 | 是，`lang_code='a'` | 是，官方例程写 24 kHz WAV | 推荐 | **有条件候选**：代码和权重为 Apache-2.0，项目明确提到 production 部署；但原生声线输出许可的官方 issue 仍未答复 |
| MeloTTS | 是，本地运行 | 是，`EN-US` | 是，官方例程写 WAV | 推荐 | **有条件候选**：库和模型页标 MIT，README 明确允许商业及非商业使用；但 English 权重训练数据/声线来源未披露，且仍有未答复的依赖许可疑问 |
| Piper | 是，本地运行 | 是，多组 `en_US` | 是，输出 WAV | 可作基准 | **谨慎候选**：当前引擎 GPL-3.0，各声线许可不同；只考虑权利链较清楚的 `en_US-ljspeech-high`，明确排除 `lessac` 及衍生声线 |
| macOS `say` / 系统声线 | 是 | 是，系统支持 `en-US` | `say` 可导出音频，系统 API 可取音频缓冲 | 仅限个人非商用草稿 | **不得用于课程发布**：当前 macOS 许可把系统声线限制为个人非商用，并禁止公开、非营利或商业场景中的录制、发布和再分发 |
| 浏览器 `speechSynthesis` | 通常不单独收费 | 取决于设备/浏览器 | **否**，标准 API 只有播放控制，没有音频文件输出接口 | 只适合临时播放验证 | **不适合**：声线随设备变化，无法冻结，许可继承底层系统或远端供应商 |
| `edge-tts` | 无 API key | 有 `en-US-*` | 是，可写 MP3 | 不建议进入工程流程 | **不得作为发布依据**：它是第三方客户端调用 Edge 消费者在线服务；项目维护者称其面向个人使用且不保证稳定，代码 GPL 不等于微软声线输出获准商用 |
| Google Cloud TTS 免费用量 | 额度内账单可为 0 | 是，明确 `en-US` | 是，官方示例写 MP3 | 推荐比较 | **可作为发布候选**：官方允许在应用或媒体中使用生成的音频；必须启用结算，超额会自动收费 |
| Amazon Polly 免费层/积分 | 视账户资格和期限 | 是，明确 `en-US` | 是，MP3/PCM 等 | 推荐比较 | **可作为发布候选**：服务条款将输出列为客户内容，FAQ 明确生成语音可存储和复用；免费资格不是永久承诺 |
| Azure Speech F0 | 每月 50 万字符 | 是，明确 `en-US` | 是，支持音频文件 | 仅限供应商试听 | **F0 不用于发布**：微软产品条款只向付费层客户授予预置神经声线音频的使用权，包括商业用途 |

`en-US` 或产品名中的 “American” 只说明供应商的地区标签，不证明它已经达到儿童课程所需的通用美式口音、自然重音和教学可懂度。任何候选都必须通过 Q68-A 的人工美式英语审核。

## 1. Kokoro：最值得先试听的本地候选

Kokoro 是 82M 参数的本地开放权重 TTS。官方仓库和模型页均标记 Apache-2.0；项目明确说 Apache 许可权重可用于从个人项目到 production 的部署。官方示例使用 `lang_code='a'` 表示 American English，并把结果写成 24 kHz WAV。[Kokoro 官方仓库](https://github.com/hexgrad/kokoro)；[Kokoro-82M 官方模型页](https://huggingface.co/hexgrad/Kokoro-82M)

工程负担为中等：需要 Python、PyTorch、`soundfile`，英语超出词表时还依赖 `espeak-ng`；Apple Silicon 可选择 MPS 加速，但 82M 规模也适合先在本机做小批量试听。没有供应商 API 费用，下载模型后可以离线生成。

许可边界仍不能写成“完全无风险”：官方仓库有一个仍处于开放状态的 issue，专门询问原生 voice pack 生成音频是否只受 Apache-2.0 约束，尚无维护者答复。[Kokoro 输出许可问题](https://github.com/hexgrad/kokoro/issues/219) 因此可以确认的是代码和权重的许可及 production 部署表述，不能据此虚构项目已经单独承诺所有生成音频可商业再分发。

判断：

- 内部试听：推荐，优先从官方美式声线中选 2–3 条进行盲听。
- 正式发布：有条件候选；发布前保存具体模型 revision、voice 文件名及 SHA-256、Apache 许可证快照，并完成输出用途复核。
- 儿童体验：声线多、成本低，但声线数量不等于教学质量；必须逐条检查元音、重音、弱读、语速和跨句一致性。

## 2. MeloTTS：商用表述最直接的本地候选

MeloTTS 官方仓库采用 MIT 许可证，README 明确称该库可用于商业和非商业用途；官方 `MeloTTS-English` 模型页也标记 MIT。其示例明确提供 `EN-US` speaker，写出 `en-us.wav`，并说明 CPU 足以实时推理。[MeloTTS 官方仓库](https://github.com/myshell-ai/MeloTTS)；[MeloTTS-English 官方模型页](https://huggingface.co/myshell-ai/MeloTTS-English)；[官方安装与 WAV 示例](https://github.com/myshell-ai/MeloTTS/blob/main/docs/install.md)

应使用有明确 `EN-US` 配置的 `MeloTTS-English`，不要因为新版名字看起来更新就自行把 `MeloTTS-English-v3` 的 `EN-Newest` 推断成通用美式。原始 English checkpoint 的配置明确列出 `EN-US`、`EN-BR`、`EN_INDIA`、`EN-AU` 和默认声线。[MeloTTS-English 配置](https://huggingface.co/myshell-ai/MeloTTS-English/blob/main/config.json)

许可仍有两个未闭合点：官方资料没有披露 English checkpoint 的训练数据和声线来源，也没有单独声明生成音频的所有权/再分发权；此外项目承认实现参考 Bert-VITS2，而仓库中关于 MIT 与上游 AGPL 关系的 issue 仍未获得维护者结论。[MeloTTS 许可 issue](https://github.com/myshell-ai/MeloTTS/issues/43) 这并不等于已经确认违规，但正式发布前不能忽略。

判断：

- 内部试听：推荐，与 Kokoro 使用完全相同的 catalog 台词比较。
- 正式发布：有条件候选；三个本地方案中，项目自身的“允许商业使用”表述最直接，但仍需补齐训练数据/输出用途确认。
- 工程负担：中等；CPU 可用、GPU 可选，正式生产应锁定 Python 环境、模型 revision 和生成参数。

## 3. Piper：轻量，但声线许可必须逐个审计

Piper 当前维护版是本地快速 TTS 引擎，使用 GPL-3.0，声音模型以 ONNX 文件运行，并支持 `en_US`。[Piper 当前官方仓库](https://github.com/OHF-Voice/piper1-gpl) 官方声音文档明确要求逐个查看 `MODEL_CARD`，因为不同声线可能带有限制；同一文档还将 Piper 描述为面向个人使用和 TTS 研究，因而不能只看到引擎开源就推定全部声线可商用。[Piper 声线说明](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/VOICES.md)

若只做试听，优先选择 `en_US-ljspeech-high`：模型卡明确说明它是单人美式女声、从头训练，训练数据为 public domain。[Piper `ljspeech-high` 模型卡](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/high/MODEL_CARD)

明确不要把常见的 `en_US-lessac-*` 用于商业课程。它的模型卡指向 Blizzard 2013 Lessac 数据，而原始许可只允许研究，并明确排除商业语音合成产品或服务。[Piper `lessac-medium` 模型卡](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/lessac/medium/MODEL_CARD)；[Blizzard 2013 Lessac 原始许可](https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html)

判断：

- 内部试听：可用，`ljspeech-high` 适合作为轻量基准。
- 正式发布：谨慎；只发布冻结后的 WAV，不把 Piper 运行时放进儿童端，并在使用任何声线前保存该声线的模型卡和数据许可。
- 引擎 GPL 与声线/数据许可是两条不同的链路；引擎代码可用不等于某个声音模型或其输出自动获得商业发布权。

## 4. macOS `say`：技术上免费，许可上不可发布

Apple 的系统语音支持 `en-US`；官方开发文档说明 `en-US` 声线以北美口音朗读，`AVSpeechSynthesizer` 还能把生成语音交给音频缓冲以便存储或处理。[Apple 声线 locale 说明](https://developer.apple.com/documentation/avfaudio/avspeechsynthesisvoice/language)；[Apple 生成音频缓冲接口](https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/write%28_%3Atobuffercallback%3A%29) macOS 也允许用户下载更多系统声线。[Apple 系统声线设置](https://support.apple.com/guide/mac-help/mchlp2290/mac)

但当前 macOS Tahoe 软件许可第 2.F 节把 System Voices 的使用限制为运行 Apple 软件时的个人、非商业项目，并明确禁止在盈利、非营利、公开分享或商业情境中录制、发布或再分发这些声线。[macOS Tahoe 软件许可](https://www.apple.com/legal/sla/docs/macOSTahoe.pdf)

所以 `say` 只适合个人电脑上的临时非商用草稿，不应成为 canranstudio 的内部资产流水线，更不能把其输出提交到仓库或发布给儿童。技术上能导出文件不等于获得了发布许可。

## 5. 浏览器 `speechSynthesis` 与 `edge-tts`：可播放不等于可冻结、可发布

Web Speech API 的 `getVoices()` 返回当前设备可用的声线；同一个网页在不同系统和浏览器上可能拿到不同本地或远端声线。[Web Speech API 规范](https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi)；[MDN `getVoices()`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices) 标准接口提供 `speak`、暂停、恢复、取消和事件，没有返回 PCM/MP3/WAV 的文件接口。因此它适合验证“点击播放—等待 `ended`—解锁下一步”的体验，不适合构建唯一、可复现的课程语音包。

其许可还取决于实际底层声线：Safari/macOS 可能落到受 Apple 系统声线条款约束的声音；远端声线则受浏览器供应商条款约束。页面设置 `lang='en-US'` 也不能保证所有设备出现同一位讲述者。

`edge-tts` 则是第三方项目，它无需 API key 即可通过 Python 调用 Microsoft Edge 的消费者在线语音服务并写 MP3；这不是微软提供的正式生产 API。[`edge-tts` 官方项目仓库](https://github.com/rany2/edge-tts) 项目维护者本人说明该库面向个人使用、没有可用性或速率保证，可能随时失效，并不建议商业依赖。[项目维护者的许可与稳定性说明](https://github.com/rany2/edge-tts/discussions/261)

`edge-tts` 的 GPL-3.0 只处理客户端代码版权，不能替微软授予在线声线输出权。微软产品条款反而明确把预置神经 TTS 输出的使用权授予限定在付费层客户。[Microsoft Azure 产品条款：TTS](https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzureServices/OL/)

## 6. 云服务免费层：零账单不等于永久免费

### Google Cloud TTS

当前官方价格页列出多种每月免费用量：Chirp 3 HD 为 100 万字符，WaveNet/Standard 为 400 万字符，Studio/Neural2 为 100 万字符。必须启用结算，超过免费用量会自动收费。[Google Cloud TTS 价格](https://cloud.google.com/text-to-speech/pricing)

Google 的技术文档提供明确 `en-US` 声线并把结果写为 MP3；配额文档还明确允许在遵守 Google Cloud 条款和适用法律的前提下，将生成的音频文件用于应用或媒体。[生成 MP3 示例](https://docs.cloud.google.com/text-to-speech/docs/create-audio)；[音频文件使用说明](https://docs.cloud.google.com/text-to-speech/quotas)

判断：在免费用量内，账单可以为 0，且有成为正式发布方案的一手依据；但需要云账户和结算方式。应只做离线批量生成，设置预算告警与 API 配额，批次完成后关闭 API，并冻结最终文件，不让儿童端实时调用。

### Amazon Polly

Amazon Polly 当前价格页仍列出按账户/期限适用的免费层和新客户积分：例如传统免费层中的 Standard 每月 500 万字符、Neural 每月 100 万字符，期限为首次请求后的 12 个月；2025-07-15 后的新客户方案还涉及最高 200 美元积分和 6 个月免费计划。实际资格必须以注册账户页面为准。[Amazon Polly 价格与免费层](https://aws.amazon.com/polly/pricing/)

Polly 提供多组 `en-US` 声线，并能输出 MP3、OGG 或 PCM。[Amazon Polly 美式声线](https://docs.aws.amazon.com/polly/latest/dg/available-voices.html) 更关键的是，AWS FAQ 明确称生成语音没有存储和复用限制，服务条款也把 AI 服务输出列为客户内容。[Amazon Polly FAQ](https://aws.amazon.com/polly/faqs/)；[AWS 服务条款第 50 节](https://aws.amazon.com/service-terms/)

判断：若账户仍符合免费资格，它是零账单且可冻结发布的有力候选；但它不是永久免费的本地能力，账户到期或超额会产生费用。

### Azure Speech F0

Azure Speech F0 当前给预置 Neural TTS 每月 50 万字符免费额度，也提供多组 `en-US` 神经声线和音频文件输出。[Azure Speech 定价](https://azure.microsoft.com/en-us/pricing/details/speech/)；[Azure Speech 声线列表](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support)

但微软产品条款写明：预置神经声线音频的使用权，包括商业用途，只授予付费层 TTS 客户。[Microsoft Azure 产品条款：TTS](https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzureServices/OL/) 因而不能把 F0 生成的文件当作免费正式课程资产。F0 最多用于不提交、不分发的供应商试听；若声线胜出，应切换到付费层后重新生成正式文件，而不是复用 F0 文件。

## 7. 面向 Lesson 1 的零成本验证方案

第一轮无需购买任何 API：

1. 只从 catalog 按 Source ID 导出 Lesson 1 的试听清单，不在生成脚本中复制课程正文。
2. 本地生成三组匿名 WAV：Kokoro 两个美式声线、MeloTTS `EN-US`，Piper `en_US-ljspeech-high` 只作轻量基准。
3. 文件名只使用匿名供应商编号，避免品牌偏见。
4. 按 Q68-A 验收：课程编辑核对教材/角色/Source ID；美式英语审核者检查音素、重音、弱读、连读、语速和儿童可懂度；系统检查文件完整性、格式、响度、噪声和 catalog 映射。
5. 若没有本地声线达到教学标准，再用 Google Cloud TTS 或符合资格的 Amazon Polly 免费额度生成同一批盲听样本。

只有通过三层验收的文件才能进入正式候选。选择本地开源方案时，还要增加许可门禁；选择云免费层时，还要增加额度与结算门禁。

## 8. 正式语音包必须保存的证据

无论最终账单是否为 0，每次生成都应保存：

- catalog Source ID、角色、文本哈希，而不是在页面脚本中保存另一份课程文本；
- 引擎/供应商、模型 revision 或快照、声线 ID、速度和全部生成参数；
- 本地模型、voice pack、最终 WAV/MP3 的 SHA-256；
- 生成当日的代码许可证、模型卡、训练数据许可或供应商输出条款快照；
- 人工美式英语审核人、审核日期和逐条结果；
- 技术 QA 结果，以及被替换/撤回文件的追踪关系。

儿童运行时只消费已经冻结和审核的音频资产，不在设备或浏览器中临时合成。这样既保证 `ended` 门禁可靠，也避免不同设备发出不同声线，并保留将整包替换为真人老师录音的能力。
