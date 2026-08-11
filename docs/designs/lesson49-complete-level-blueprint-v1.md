# Lesson 49 完整关卡蓝图 V1

> 状态：课程范围与任务结构已冻结，交互素材尚未制作
> 教材真源：外研社《新概念英语智慧版 1》，PDF 物理页 131–132、书本页 98–99
> 教材标题：At the butcher's
> 所属单元：FLC-U01「暖灯风味市集」（Lesson 49 + Lesson 50）
> 本课职责：完整教会 Lesson 49 的输入与理解，推进地标 `state-0 → state-2`
> 相关规格：[Lesson 49/50 新学习运行时与纵向切片规格](../superpowers/specs/2026-08-10-lesson49-50-learning-runtime-design.md)

## 1. 为什么重做

当前纵向 POC 只验证了运行时的五幕、错误支架、音频回调、持久化和多端布局，实质上仍是“每幕一道标量选择题”。它不是完整课程，也不能作为 Lesson 49 的内容成品。

Lesson 49 在新体系中只承担前两幕，不等于只做两道题：

- **幕**是课程级成果，决定地标成长；
- **微任务**是孩子真正完成的学习动作；
- 两幕内部共有 9 个必做微任务；
- 只有完成一组有意义的微任务，地标才成长一次。

本蓝图解决三个问题：

1. 完整覆盖教材正文、新词、数量表达和四个 Notes on the text；
2. 用主动提取、证据解释、错误支架和延迟回收形成真实挑战；
3. 冻结内容数据与运行时合同，防止页面脚本再次散落一套课程真源。

## 2. 课程边界

### 2.1 本课必须覆盖

| 类型 | 必学内容 |
| --- | --- |
| 教材问题 | `What does Mr. Bird like?` |
| 对话 | 伯德夫人与肉店老板的 13 个原文话轮；现有网页合并为 11 个播放气泡 |
| 新词 | `butcher, meat, beef, lamb, husband, steak, mince, chicken, tell, truth, either` |
| 数量与指代 | `some steak / a nice piece / that piece / a pound of mince`；`a piece of steak` 只作为规范化派生表达 |
| 选择 | `Do you want beef or lamb?`；理解 `or` 表示二选一，并感知前项升调、末项降调 |
| 接受与拒绝 | `Yes, please.` / `No, thank you.` |
| 偏好与省略 | `I like lamb, but my husband doesn't.`；理解 `doesn't` 代替前文 `like lamb` |
| 话语表达 | `To tell you the truth` = 说实话 |
| 否定中的“也” | `I don't like chicken either.`；与肯定/疑问语境中的 `too` 区分 |
| 最终理解 | Mr. Bird likes steak and does not like chicken |

`husband` 只作为课文中的普通词汇和人物关系出现。**不得设计“husband 属于人物还是肉类”的儿童分类题。** 内容发布校验仍应防止人物词被文案误称为“肉”，但该校验不进入孩子体验。

### 2.2 不进入主闯关

以下是旧页面的扩展内容，不属于 Lesson 49 教材核心，不能阻塞本课完成：

- `mutton / pork / fish`；
- `instant boiled mutton`；
- 与本课情境无关的 Do/Are 大分拣；
- `give/show/send/take` 双宾语转换；
- 脱离本段对话的一般现在时规则大全和第三人称题海；
- 结业证书、同日刷星或额外奖励结算。

这些内容若未来保留，只能放入独立拓展区，且不计本课覆盖率、检查点或掌握证据。

## 3. 教材真源目录

### 3.1 对话与音频

教材原页有 7 个画面、13 个说话轮次。现有网页把原文第 8+9 轮、第 11+12 轮分别合并，因此形成下表 11 个播放气泡。内容覆盖以 13 个原文话轮为权威，播放和恢复可暂时复用 11 段本地 MP3。

现有音频是站内 Edge TTS 合成英式发音，不是出版社原版录音；产品与文档不得将其标注为“教材原声”或“出版社原声”。

| ID | 说话者 | 英文 | 本地 MP3 |
| --- | --- | --- | --- |
| L49-D01 | Butcher | Do you want any meat today, Mrs. Bird? | `lesson49/audio/do_you_want_any_meat_today_mrs_bird.mp3` |
| L49-D02 | Mrs. Bird | Yes, please. | `lesson49/audio/yes_please.mp3` |
| L49-D03 | Butcher | Do you want beef or lamb? | `lesson49/audio/do_you_want_beef_or_lamb.mp3` |
| L49-D04 | Mrs. Bird | Beef, please. | `lesson49/audio/beef_please.mp3` |
| L49-D05 | Butcher | This lamb's very good. | `lesson49/audio/this_lamb_s_very_good.mp3` |
| L49-D06 | Mrs. Bird | I like lamb, but my husband doesn't. | `lesson49/audio/i_like_lamb_but_my_husband_doesn_t.mp3` |
| L49-D07 | Butcher | What about some steak? This is a nice piece. | `lesson49/audio/what_about_some_steak_this_is_a_nice_piece.mp3` |
| L49-D08 | Mrs. Bird | Give me that piece, please. And a pound of mince, too. | `lesson49/audio/give_me_that_piece_please_and_a_pound_of_mince_too.mp3` |
| L49-D09 | Butcher | Do you want a chicken, Mrs. Bird? They're very nice. | `lesson49/audio/do_you_want_a_chicken_mrs_bird_they_re_very_nice.mp3` |
| L49-D10 | Mrs. Bird | No, thank you. My husband likes steak, but he doesn't like chicken. | `lesson49/audio/no_thank_you_my_husband_likes_steak_but_he_doesn_t_like_chicken.mp3` |
| L49-D11 | Butcher | To tell you the truth, Mrs. Bird, I don't like chicken either! | `lesson49/audio/to_tell_you_the_truth_mrs_bird_i_don_t_like_chicken_either.mp3` |

连续短话轮可以在网页中合并为一个音频段，但不可删句、改意或用固定时长跳过未播放完的内容。当前没有完整课文单一连续音轨，也没有 `What does Mr. Bird like?` 的本地题干音频；首次完整听读应由 11 段音频按原文顺序组成序列。

### 3.2 稳定 Source ID

课程目录必须提供以下稳定真源标识：

- 教材问题：`L49-Q01`；
- 对话：`L49-D01` 至 `L49-D11`；
- 新词：`L49-W01` 至 `L49-W11`；
- 数量/指代表达：`L49-P01` 至 `L49-P04`；
- 教材语义重点：`L49-N01` 至 `L49-N04`。

| ID | 内容 | ID | 内容 |
| --- | --- | --- | --- |
| L49-W01 | butcher | L49-W07 | mince |
| L49-W02 | meat | L49-W08 | chicken |
| L49-W03 | beef | L49-W09 | tell |
| L49-W04 | lamb | L49-W10 | truth |
| L49-W05 | husband | L49-W11 | either |
| L49-W06 | steak |  |  |

| ID | 内容 |
| --- | --- |
| L49-P01 | some steak |
| L49-P02 | a nice piece |
| L49-P03 | that piece |
| L49-P04 | a pound of mince |
| L49-N01 | `or` 表示二选一；前项升调、末项降调 |
| L49-N02 | `doesn't` 省略前文相同的动词与宾语 |
| L49-N03 | `to tell you the truth` 表示“说实话” |
| L49-N04 | `either` 用在否定句中表达“也”，并与 `too` 区分 |

每个必学 Source ID 必须被至少一个 required 微任务引用；构建时若有遗漏，目录校验必须失败。

`a piece of steak` 记为派生表达 `L49-X01`，用于帮助孩子把商品与量词组合起来，但不能冒充教材逐字真源。coverage validator 必须区分“看见/听见过”的 `exposureRefs` 与“孩子实际完成过动作”的 `evidenceRefs`，不能因为一个 ID 出现在配置里就判定已经教会。

## 4. 学习目标

完成 Lesson 49 后，孩子应当能够：

1. 听到核心食材和数量线索后，把订单与商品正确匹配；
2. 理解 `Do you want any...?`、`X or Y?`、接受与拒绝的交际意图；
3. 从完整对话中还原伯德夫人购买了什么、没有购买什么；
4. 理解 `doesn't` 的省略关系、`to tell you the truth` 和否定句中的 `either`；
5. 用“听到什么 → 表示什么 → 所以怎样配单”的证据链核对完整订单；
6. 延迟回收教材问题，并回答：`Mr. Bird likes steak.`

完成当天只推进 U01 到 `state-2`，不产生跨日掌握、挑战星或最终亮灯。

## 5. 9 个必做微任务

### 5.1 总览

| ID | 宏观幕 | 微任务 | 核心动作 | 主要覆盖 | 预计时长 |
| --- | --- | --- | --- | --- | ---: |
| L49-M01 | 发现问题 | 标出订单缺口 | 标出“要什么、不要什么、数量多少”并选择先听的线索 | Q01 | 45 秒 |
| L49-M02 | 听懂线索 | 货架唤醒 | 听词并完成角色/商品音图匹配 | W01–W04, W06–W08 | 70 秒 |
| L49-M03 | 听懂线索 | 带问题完整听一遍 | 完整听课文、保存初始猜测 | D01–D11, Q01 | 75 秒 |
| L49-M04 | 听懂线索 | 第一张订单：要什么肉 | 区分询问、二选一、语调和明确选择 | D01–D04, N01 | 60 秒 |
| L49-M05 | 听懂线索 | 喜欢不等于这次购买 | 补全两个人物的 lamb 偏好 | D05–D06, W05, N02 | 50 秒 |
| L49-M06 | 听懂线索 | 数量备货台 | 处理建议、指代和数量 | D07–D08, P01–P04 | 65 秒 |
| L49-M07 | 听懂线索 | 接受还是拒绝 | 移除 chicken，整理人物偏好和话语表达 | D09–D11, W09–W11, N03–N04 | 70 秒 |
| L49-M08 | 听懂线索 | 还原订单证据链 | 修正完整订单、匹配依据并还原交易顺序 | D01–D11 | 90 秒 |
| L49-M09 | 听懂线索 | 教材问题延迟回收 | 无提示回答总问题并拼完整偏好句 | Q01, D05–D11 | 75 秒 |

理想操作时长约 10 分钟；包含场景切换、重播和一次常见错误后，目标总时长为 12–15 分钟。使用较深支架时允许更长，不用倒计时催促孩子。

### 5.2 逐任务交互与证据

#### L49-M01：标出订单缺口

- 场景：一张未完成的肉铺订单，只露出顾客姓名和空的订单区域。
- 动作一：把“要什么、不要什么、数量多少”三张问题卡放到相应空槽，明确订单缺少哪些信息。
- 动作二：选择准备先听哪一类线索，并带着教材问题 `What does Mr. Bird like?` 进入肉铺。
- 性质：问题识别与生成式预测；不形成目标掌握证据。
- 完成并成功持久化后，订单板展开，地标从 `state-0` 成长到 `state-1`。
- 反馈不提前公布课文答案，只确认“我们知道要听什么了”。

#### L49-M02：货架唤醒

- 动作一：听到 `butcher`，点选正在为顾客服务的肉店老板。
- 动作二：听词，把 `meat, beef, lamb, steak, mince, chicken` 放到相应商品图。
- `husband` 在后续对话人物关系中自然出现，不做语义分类。
- 首次无提示音图匹配可形成新课形成性表现，但不形成跨日 independent evidence。

#### L49-M03：带问题完整听一遍

- 先展示教材问题 `What does Mr. Bird like?`，允许孩子保存一个初始猜测。
- 首次完整播放不显示全文；说话人物随音频高亮。
- 只有 `L49-D11` 的真实 `ended` 回调到达后才完成任务。
- 文字降级只在音频失败或孩子主动请求支架时出现。

#### L49-M04：第一张订单——要什么肉

- 分段重听 `L49-D01`–`L49-D04`。
- 孩子要完成两种不同意图：`Do you want any meat? → Yes, please.`；`beef or lamb? → beef`。
- 重播选择问句时用 `beef ↗ / lamb ↘` 的视觉音高轨迹帮助孩子感知选择疑问句语调；V1 不要求或评分孩子模仿发音。
- 正确后 beef 进入订单并保存微任务检查点，不再次触发地标成长。
- 反馈必须指出依据：“听到 `Beef, please.`，所以这次装 beef。”

#### L49-M05：喜欢不等于这次购买

- 分段重听 `L49-D05`–`L49-D06`。
- 孩子补全：Mrs. Bird likes lamb；her husband doesn't like lamb。
- 学习点是偏好对比和省略关系，不是人物分类。
- 第三次支架用另一组食物示范 `I like X, but he doesn't.`，再返回变化题。

#### L49-M06：数量备货台

- 分段重听 `L49-D07`–`L49-D08`。
- 先理解 `What about some steak?` 是老板提出商品建议，再处理 `this nice piece → that piece` 的指代变化。
- 场景至少展示两块可区分的 steak；孩子要根据老板的 `this nice piece` 和顾客随后说的 `that piece` 选中同一块，再加入 `a pound of mince`。
- 只有“商品、指代、数量”全部绑定正确，才提交 FLC-U01-T01 的完整形成性表现；选中 beef 不能冒充数量能力证据。
- 错哪个槽只修哪个槽，不清空已经正确的工作。

#### L49-M07：接受还是拒绝

- 分段重听 `L49-D09`–`L49-D11`。
- 孩子从订单中移除 chicken，并补全：Mr. Bird likes steak；Mr. Bird does not like chicken；the butcher does not like chicken either。
- 同时把 `To tell you the truth` 与“说实话”匹配。
- 通过同情境短对照说明：肯定句可用 `too`，本句是否定句，所以使用 `either`。
- 如果把 chicken 放入订单，反馈只指出与哪一句冲突，不立即亮正确项。

#### L49-M08：还原订单证据链

- 当前订单有三个错误：放入 lamb、放入 chicken、漏掉 mince。
- 孩子先修改订单，再为三项修改匹配依据：`Beef, please.`、`No, thank you.`、`a pound of mince, too.`。
- 随后把完整交易压缩成六个意义片段并排序：询问要肉 → 牛/羊二选一 → 羊肉偏好 → 选牛排 → 加一磅肉馅 → 拒绝鸡肉并说明偏好。
- 通过条件是“订单动作、英语依据和交易顺序一致”；只看讲解或点击“懂了”不能过关。
- 首错只标出第一处依据冲突或顺序断裂，不公布整张正确订单。
- 这是理解阶段的证据整合，不使用“教会小猫”叙事，也不提前占用 Lesson 50 的第三幕。

#### L49-M09：教材问题延迟回收

- 不重播整篇，回答开场问题 `What does Mr. Bird like?`。
- 拼出 `He likes steak, but he doesn't like chicken.`，并从完整订单中指出 Mrs. Bird 最终购买的 beef、steak 和 mince。
- 首次无提示完成记为当日整合表现；使用支架后可推进故事，但标记为 supported。
- 完成后地标从 `state-1` 成长到 `state-2`，进入 Lesson 50 交接营地。
- 更换顾客、商品和目的的真正近迁移，以及完整“教会小猫”，留在 Lesson 50 的第三、第四幕。

## 6. 挑战曲线与学习科学

整课不是“看完课文”，而是依次经历：

1. **预测**：先提出自己的猜想，产生注意目标；
2. **多模态编码**：把声音、图片、商品和场景连接起来；
3. **整体输入**：带着真实问题听完整对话；
4. **分段提取**：从音频中提取选择、数量和偏好；
5. **整合**：把分散线索组成一张真实订单；
6. **证据解释**：把每次订单修改与听到的英语依据连接起来；
7. **结构重建**：恢复完整交易顺序与交际意图；
8. **延迟回收**：在末尾重新回答开场教材问题。

这条链使用主动回忆、生成效应、双重编码、精细化解释和延迟提取。完整的费曼式“教会小猫”和变化情境迁移属于 Lesson 50；艾宾浩斯式间隔回访发生在后续学习日，不在本课内机械重复同一道题。

## 7. 错误支架合同

每个可判定微任务都采用同一条有限支架：

1. **第一次错误**：不排除选项；重播相关音频或指出冲突位置；
2. **第二次错误**：聚焦关键词、图片区域或订单槽，仍不直接给答案；
3. **第三次错误**：用同一语言点的不同商品做一个完整示例；
4. **再挑战**：回到一张等价但轻微变化的题，不能照抄刚才答案；
5. **仍未独立完成**：记录 failed，进入一步引导纠正；孩子亲自完成最后动作后记为 `completed-assisted`，再继续故事并安排更早回访。

支架一旦出现，本轮最多记为 supported。每个微任务开始时重置 supportLevel；变化练习完成后必须回到主线，而不是永久切换整个幕的 context。`all-required` 接受 `completed-independent / completed-supported / completed-assisted`，但不接受裸 `failed`，因此既不会死锁，也不能答错后直接放行。

## 8. 音频合同

- 站内本地 MP3 优先；当前为 Edge TTS 合成音频，不得宣称出版社原声；speechSynthesis 只作失败降级；
- 每个含音频的微任务，只有当前 `activeAudioSequenceId` 的最后一段真实 `ended` 到达且 requestId 未过期，才开放该微任务作答；
- 不使用固定秒数自动切句；
- 当前句播放时预取下一句；
- 手动重播会取消旧请求，不允许叠音；
- stale 的 `ended/failed` 回调不能推进当前任务；
- 加载失败时显示同角色、同内容的文字与图片降级，不惩罚孩子；
- 主动请求全文或关键词属于支架；
- V1 不采集、不上传、不评分儿童语音。

## 9. 地标成长与即时反馈

| 时点 | 世界变化 | 进度语义 |
| --- | --- | --- |
| 进入 Lesson 49 | 肉铺关闭，订单板未展开 | `state-0` |
| 完成 L49-M01 | 三类订单缺口被标出，订单板展开 | `state-1`：发现问题完成 |
| 完成 L49-M09 | 订单被核清，备货台完整，小猫准备去果蔬摊 | `state-2`：听懂线索完成 |

其余微任务使用局部而克制的反馈：订单盖章、货架补齐、线索卡归位、小猫动作和短音效。不能每答一题都播放大型地标动画。

地标成长必须先于进入下一段课程；若持久化失败，页面可以显示即时答对，但不能展示永久成长或完成交接。

## 10. 数据与运行时合同

### 10.1 课程目录

每个 beat 从单个 `task` 扩展为有序的 `microtasks[]`。每个微任务至少声明：

```text
microtaskId
lessonId
kind
required
exposureRefs[]
evidenceRefs[]
contextVariants
stimulus / audioSequenceId
responseKeyByContext
support
formativeBinding?
checkpointAfterSuccess?
```

`responseKeyByContext` 必须是声明式判定，可支持 `single / set / ordered / mapping / composition`；答案与判定不能写在页面脚本中。`exposureRefs` 表示孩子真实看见或听见过，`evidenceRefs` 表示孩子已对该内容完成可验证动作。beat 必须声明 `completionRule: all-required`，并使用三种可完成状态区分独立、支持后和引导后完成。

### 10.2 运行时快照

运行时快照至少增加：

- `microtaskId`；
- `phase: stimulus | response | feedback | transition`；
- `baseContextId`；
- `activeContextId`。

页面只提交 `response/submit { response }`，由运行时读取 authored content 判定。微任务索引由目录推导，不另存第二份真源。

### 10.3 检查点与成长

- ledger 检查点保存 `{ beatId, microtaskId, checkpointId }`；
- 非末微任务成功只保存稳定检查点，不改变 buildStage；
- 完成 L49-M01 才推进 `state-1`；
- 完成 L49-M09 才推进 `state-2` 并发出 Lesson 50 handoff；
- 刷新后从最后一个真实完成的微任务恢复；
- 不允许用 `beat.buildStage` 作为每个子检查点的隐式默认值。

### 10.4 页面职责

正式孩子页面与维护者 POC 都从同一课程目录读取：

- source、任务顺序、选项、音频、支架和判定不复制进页面；
- 通用 `learning-scene` 负责渲染 scene/effect；
- 页面只负责路由、挂载、视觉外壳和输入转发；
- POC 使用专用 memory/localStorage key，不能污染正式学习真源。

## 11. 验收标准

### 11.1 内容覆盖

- 9 个 required `microtaskId` 唯一且顺序稳定；
- `L49-Q01`、`L49-D01`–`D11`、`L49-W01`–`W11`、`L49-P01`–`P04`、`L49-N01`–`N04` 均有真实 `exposureRefs`；要求动作验证的内容还必须有 `evidenceRefs`，不能只靠配置引用通过；
- 页面不存在 `husband` 人物/肉类分类任务；
- 中文释义按交际意图审校；例如 `Yes, please.` 不再写成泛化的“好的，谢谢”，而应表达“是的，请给我一些”；
- `mutton / pork / fish / instant boiled mutton` 和无关 Do/Are 练习不计入主闭环；
- 每个形成性证据的实际动作与 `evidenceMode` 一致。

### 11.2 运行时

- 一次正确只推进一个微任务，不能直接完成整幕；
- 完成 L49-M01 后只到 `state-1`；M02–M08 只保存微任务检查点；M09 后只到 `state-2`；
- 第 5 步后刷新，恢复到第 6 步；
- 错题支架不自动跳题、不亮出答案；
- 支架变化练习完成后回主线；
- 当前 `activeAudioSequenceId` 的最后一段音频 `ended` 前不能作答；
- 裸 `failed` 不能满足 all-required；引导纠正后的 `completed-assisted` 可推进但不形成独立证据；
- stale/cancelled 音频回调不能推进；
- 存储失败不成长、不交接；
- Lesson 49 完成页主动作是继续 Lesson 50，而不是宣称整个 U01 已完成。

### 11.3 多端体验

- iPhone 12、华为大屏、常用平板与电脑双页均可完成全部 9 个微任务；
- 孩子全屏模式无页面级横向滚动；
- 所有主要触控目标不小于 44 CSS px；
- 订单、人物、音频和反馈在缩放后仍保持同一视觉层级；
- reduced-motion 下世界变化直接切换，不丢失完成反馈；
- 无账号、无麦克风、无外部写请求。

## 12. 实施顺序

1. 先把 Source ID、9 个微任务和 coverage validator 写入课程目录，测试先红后绿；
2. 扩展 ledger 的微任务检查点与恢复，禁止子检查点隐式长地标；
3. 扩展 runtime 的任务序列、声明式 response evaluator、有限支架和音频序列门；
4. 建立通用 `learning-scene`，让页面成为薄壳；
5. 把 `/poc/lesson49-experience/` 改为连续完整体验，并覆盖途中刷新、错误支架、音频失败和存储失败；
6. 在 POC 验收内容与多端后，再接 `/lesson49/` 正式入口；
7. Lesson 50 继续完成 U01 的第三至第五幕，不把 Lesson 49 伪装成完整五幕单元。

## 13. 明确不宣称的事项

本蓝图完成后仍不能宣称：

- 正式 Lesson 49 已上线；
- U01 五幕已完成；
- 孩子已经长期掌握；
- 挑战星或纪念章已可发放；
- 现有 POC 的示意美术已达到正式课程画风。

只有代码、内容、美术、全端 E2E、部署合同和人工体验验收都通过后，才能进入发布候选。
