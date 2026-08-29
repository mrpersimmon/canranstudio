---
status: accepted
partially_superseded_by:
  - ADR-0103
---

# 首次主线抽样单词检索并把完整双通道覆盖留给回访

Lesson 1–2 真人游玩发现，十一件物品在首次主线中各做一次 `audio-form-supported` 与一次 `word-form`，形成二十二次独立单词考察，占三十三份形成性结果约三分之二；每词还经历探索听音和答后反馈，单词题压过了故事与交际。因此首次主线继续让十一词全部获得声音、词形、真实物品和情境接触，但只保存八份代表性 T1 结果：`handbag`、`watch`、`shirt`、`skirt`、`house` 使用 `audio-form-supported`，`pencil`、`coat`、`car` 使用 `word-form`。`pen`、`book`、`dress` 在首课为目标级 `exposure`，未考通道与全部延迟双通道状态进入后续表现驱动回访；同一个词首次主线不连续考两种通道。

二十二个“词 × 通道”长期状态仍用于跨日掌握，不等于必须在当天产生二十二份形成性结果。本决定取代 ADR-0032、ADR-0042、ADR-0079、ADR-0083、ADR-0084 与 ADR-0087 中要求 M01–M06 在首次主线逐批完成全部声音／词形结果的条款；这些 ADR 的声明式答案、证据通道不可互相冒充、原子恢复和真实 `audio/ended` 边界继续有效。
