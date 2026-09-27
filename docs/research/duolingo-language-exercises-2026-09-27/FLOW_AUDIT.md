# 中文英语题目：完整操作截图清单

## 4.0 逐步操作截图：从作答到错题重练

**累计 336 张原始操作截图，整理为 35 组流程，涉及 23 个题型/输入变体；其中 17 类跑通“错误→恢复→正确→继续”的核心闭环（包含自动推进）。所有条件分支均穷举的题型仍为 0，不能把核心闭环称为全覆盖。**

实测范围：2026-09-27，桌面Chrome，中文→英语。A为免费访客基础入门课，B为访客发音专项；C为用户自行登录Super后的Taxi Ride故事重读，D为第21部分单元复习，E为学习法国文化电台复习。视口1200×1189，具体产品构建号未取得。登录后的三条流程都已完成并返回入口；没有升级或购买Max。

**直接看此次Super新增：**[故事阅读与各插题 F17–F22](#live-F17) · [中译英词块全过程 F26](#live-F26) · [键入错误与容错 F27/F29](#live-F27) · [缺词/整句切换 F28](#live-F28) · [电台四种任务 F31–F35](#live-F31)。新增186张原图、19组流程；已有访客流程继续保留。

按图序阅读每一步的**操作 → 实际结果 → 原图**。原图保留完整视口，点击可放大；红心弹层、重练过场、结算与可滚动回顾页分别注明。步骤编号是当前流程内的顺序；原图编号是整场采集索引，所以不必连续。跨到课末重练前确实完成了其他题，不能理解成答错后立即回原题。

**按实际判分单位分开阅读**：普通翻译草稿提交后锁定，后段原题重现；配对错误闪红后原位恢复；故事/电台选择常把错误候选禁用，允许当场选另一项；故事重组则逐片段接受正确前缀。电台完成任务后自动继续节目。它们不能共用一张“答错后重试”的示意图。

故事阅读的S01/S02可用可见文字完成，单列在无需听说组；整个故事仍有S05听音重组，S04短语补全的声音依赖待核。听力入口、录音界面与跳过已有操作图，但没有保存音轨、听验质量或验证成功朗读。Max、移动端、未出现题型与异常分支仍留缺口。

[逐步骤覆盖表](flow-coverage.csv) · [结构化流程证据](live-flow-evidence.json) · [全部分支核对表](flow-data.json)

以下先分开展示无需听说、听力和共用回顾，再列出每一种研究条目的未完成操作。


<a id="live-F01"></a>
### F01 · 看图选词：同题答错到课末答对

**题干：**哪个是“茶”呢？
蓝色只表示选择；提交才判分。答错后选项锁定，继续进入下一题；本课后段同题以错题重练重现，答对后再推进。

**连续性与缺口：**17与120之间实际完成了其他题，明确作为课内间隔，不伪装成紧接下一步。未穷举所有错误选项、快捷键和外部异常。

**1. 进入“哪个是茶”** — 三张图卡尚未选中；检查为灰色，红心为5。

![F01 步骤1：三张图卡尚未选中；检查为灰色，红心为5。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/010.png)

**2. 点击 coffee** — coffee 变蓝；检查变绿；尚未判定正确与否。

![F01 步骤2：coffee 变蓝；检查变绿；尚未判定正确与否。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/011.png)

**3. 改点 tea** — tea 变蓝，coffee 恢复；维持单选。

![F01 步骤3：tea 变蓝，coffee 恢复；维持单选。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/012.png)

**4. 再次点击已选 tea** — tea 仍选中；重复点击未回到空答案。

![F01 步骤4：tea 仍选中；重复点击未回到空答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/013.png)

**5. 改点 sugar，准备提交** — sugar 变蓝；这是错误草稿，还没有判错。

![F01 步骤5：sugar 变蓝；这是错误草稿，还没有判错。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/014.png)

**6. 点击检查** — 红心5变4；首次错误说明弹层遮住题目，底部已出现红色答案反馈。

![F01 步骤6：红心5变4；首次错误说明弹层遮住题目，底部已出现红色答案反馈。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/015.png)

**7. 关闭红心说明中的继续** — 显示“正确答案：tea”；选项已锁定，底部红色继续。

![F01 步骤7：显示“正确答案：tea”；选项已锁定，底部红色继续。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/016.png)

**8. 点击错误反馈的继续** — 进入下一道文字选词题“茶”；不是在原看图题内编辑。

![F01 步骤8：进入下一道文字选词题“茶”；不是在原看图题内编辑。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/017.png)

**9. 完成中间题目后继续** — 出现“复习一下之前你不太熟练的部分”过场；不是一道新题。

![F01 步骤9：出现“复习一下之前你不太熟练的部分”过场；不是一道新题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/120.png)

**10. 点击复习过场的继续** — 同一“哪个是茶”与原三个选项重现，带错题重练标签。

![F01 步骤10：同一“哪个是茶”与原三个选项重现，带错题重练标签。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/121.png)

**11. 在重练题中点击 tea** — 重新选择，未沿用第一次的错误答案。

![F01 步骤11：重新选择，未沿用第一次的错误答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/122.png)

**12. 点击检查** — 同题答对，tea变绿，显示绿色继续。

![F01 步骤12：同题答对，tea变绿，显示绿色继续。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/123.png)

**13. 点击继续** — 原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。

![F01 步骤13：原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/124.png)


<a id="live-F02"></a>
### F02 · 中文词义选英文：改选、错误与重练

**题干：**茶 → coffee / hot / tea
没有图片可供直接匹配；需要把中文词义连到英语词形。错误反馈给出tea，之后在课末重练同题。

**连续性与缺口：**24到124之间是其他题目。E23是本轮新发现的中文词义选英文，不冒充E02英文定义选择。

**1. 点击错误反馈的继续** — 进入下一道文字选词题“茶”；不是在原看图题内编辑。

![F02 步骤1：进入下一道文字选词题“茶”；不是在原看图题内编辑。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/017.png)

**2. 文字选词题中点击 coffee** — coffee 变蓝；检查可用。

![F02 步骤2：coffee 变蓝；检查可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/020.png)

**3. 改选 tea** — 选中状态从 coffee 转移到 tea。

![F02 步骤3：选中状态从 coffee 转移到 tea。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/021.png)

**4. 改选 hot，准备提交** — hot 为当前蓝色选项；尚未判错。

![F02 步骤4：hot 为当前蓝色选项；尚未判错。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/022.png)

**5. 点击检查** — 显示正确答案 tea，原选项锁定；红心4变3。

![F02 步骤5：显示正确答案 tea，原选项锁定；红心4变3。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/023.png)

**6. 点击继续** — 切换到新的看图题“哪个是咖啡”。

![F02 步骤6：切换到新的看图题“哪个是咖啡”。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/024.png)

**7. 点击继续** — 原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。

![F02 步骤7：原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/124.png)

**8. 点击 tea** — 重练题的正确选项变蓝，等待提交。

![F02 步骤8：重练题的正确选项变蓝，等待提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/125.png)

**9. 点击检查** — 同题绿色反馈，标记连对3题。

![F02 步骤9：同题绿色反馈，标记连对3题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/126.png)

**10. 点击继续** — 显示鼓励过场“你的辛勤付出得到了回报！”；本帧不是welcome题。

![F02 步骤10：显示鼓励过场“你的辛勤付出得到了回报！”；本帧不是welcome题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/127.png)


<a id="live-F03"></a>
### F03 · 英译中词块：撤回、清空、答错与重练

**题干：**welcome → 热茶 / 欢迎
答案区词块可撤回；清空后检查禁用；提交后锁定。课末重练改变了词库位置，原题正确重答。

**连续性与缺口：**首次悬停截图只显示操作引导；真实词义浮层见F04。重练前经过其他题。

**1. 点击继续** — 进入英译中词块题 welcome；首次提示可悬停查看词义。

![F03 步骤1：进入英译中词块题 welcome；首次提示可悬停查看词义。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/038.png)

**2. 悬停 welcome** — 本帧仍显示首次操作引导；不能把它当成词典释义已展开。

![F03 步骤2：本帧仍显示首次操作引导；不能把它当成词典释义已展开。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/040.png)

**3. 点击热茶** — 热茶进入答案区；词库原位变灰；检查启用。

![F03 步骤3：热茶进入答案区；词库原位变灰；检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/041.png)

**4. 点击答案区的热茶** — 词块撤回；答案清空，检查重新变灰。

![F03 步骤4：词块撤回；答案清空，检查重新变灰。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/042.png)

**5. 点击欢迎** — 欢迎进入答案区，热茶仍可选；尚未提交。

![F03 步骤5：欢迎进入答案区，热茶仍可选；尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/043.png)

**6. 撤回欢迎，再点热茶** — 再次形成错误草稿；实际提交前的答案为热茶。

![F03 步骤6：再次形成错误草稿；实际提交前的答案为热茶。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/044.png)

**7. 点击检查** — 红色反馈给出欢迎；词块均锁定；红心3变2。

![F03 步骤7：红色反馈给出欢迎；词块均锁定；红心3变2。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/045.png)

**8. 点击继续** — 进入新的文字选择题“欢迎”；不是在原词块题内重答。

![F03 步骤8：进入新的文字选择题“欢迎”；不是在原词块题内重答。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/046.png)

**9. 再点击继续** — welcome 英译中题重现；词库顺序与首次不同，带错题重练标签。

![F03 步骤9：welcome 英译中题重现；词库顺序与首次不同，带错题重练标签。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/128.png)

**10. 点击欢迎** — 正确词块进入答案区。

![F03 步骤10：正确词块进入答案区。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/129.png)

**11. 点击检查** — 同题出现绿色正确反馈，连对4题。

![F03 步骤11：同题出现绿色正确反馈，连对4题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/130.png)

**12. 点击继续** — 原对话 Coffee or tea? 及两项原选项重现，带错题重练。

![F03 步骤12：原对话 Coffee or tea? 及两项原选项重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/131.png)


<a id="live-F04"></a>
### F04 · 多词词块：部分答案、查词与改顺序

**题干：**Tea, please. → 茶 / 谢谢
部分答案就能提交。撤回前面的词，再从词库点回，可改变排列顺序。词义提示在题面内出现。

**连续性与缺口：**“谢谢 茶”只保存为未提交草稿；没有实测该词序的判分，不能称为已被系统判错。

**1. 进入 Tea, please. 翻译题** — 词库为谢谢、牛奶、茶；答案为空。

![F04 步骤1：词库为谢谢、牛奶、茶；答案为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/050.png)

**2. 悬停 please** — 实际展开词义提示：谢谢、感谢、多谢。

![F04 步骤2：实际展开词义提示：谢谢、感谢、多谢。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/051.png)

**3. 先点击谢谢** — 只有一个词块也能启用检查；非完整答案仍可提交。

![F04 步骤3：只有一个词块也能启用检查；非完整答案仍可提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/052.png)

**4. 再点击茶** — 形成“谢谢 茶”的未提交草稿；未验证这个词序会被怎样判分。

![F04 步骤4：形成“谢谢 茶”的未提交草稿；未验证这个词序会被怎样判分。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/053.png)

**5. 点击答案区的谢谢** — 前面的词块撤回，茶留在答案区并前移。

![F04 步骤5：前面的词块撤回，茶留在答案区并前移。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/054.png)

**6. 再次点击词库谢谢** — 它追加到答案末尾，组成“茶 谢谢”。

![F04 步骤6：它追加到答案末尾，组成“茶 谢谢”。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/055.png)

**7. 点击检查** — 绿色正确反馈出现；全部词块锁定。

![F04 步骤7：绿色正确反馈出现；全部词块锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/056.png)

**8. 点击继续** — 进入新题 I'd like coffee.。

![F04 步骤8：进入新题 I'd like coffee.。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/057.png)


<a id="live-F05"></a>
### F05 · 完成对话：错误意思反馈与同题重练

**题干：**Coffee or tea? → Coffee, please. / Welcome.
选择符合话轮的回应，系统错误与正确反馈均给中文意思；看见会话角色不等于自由对话生成。

**连续性与缺口：**65到131之间经过其他题。字幕材料完整可读，播放为可选辅助；本分支归无必需听说。

**1. 进入完成对话 Coffee or tea?** — 两个选项 Coffee, please. 和 Welcome.；检查禁用。

![F05 步骤1：两个选项 Coffee, please. 和 Welcome.；检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/060.png)

**2. 点击 Welcome.** — 蓝色选中；检查启用；角色空白气泡未直接填入答案。

![F05 步骤2：蓝色选中；检查启用；角色空白气泡未直接填入答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/061.png)

**3. 改选 Coffee, please.** — 蓝色选择转移，尚未判分。

![F05 步骤3：蓝色选择转移，尚未判分。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/062.png)

**4. 改回 Welcome.** — 保留错误回答作为提交前证据。

![F05 步骤4：保留错误回答作为提交前证据。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/063.png)

**5. 点击检查** — 红心2变1；同时显示正确英文 Coffee, please. 与中文“咖啡，谢谢。”。

![F05 步骤5：红心2变1；同时显示正确英文 Coffee, please. 与中文“咖啡，谢谢。”。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/064.png)

**6. 点击继续** — 进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。

![F05 步骤6：进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/065.png)

**7. 点击继续** — 原对话 Coffee or tea? 及两项原选项重现，带错题重练。

![F05 步骤7：原对话 Coffee or tea? 及两项原选项重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/131.png)

**8. 点击 Coffee, please.** — 正确回答变蓝，等待提交。

![F05 步骤8：正确回答变蓝，等待提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/132.png)

**9. 点击检查** — 绿色反馈，同时给中文意思，连对5题。

![F05 步骤9：绿色反馈，同时给中文意思，连对5题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/133.png)

**10. 点击继续** — 之前被普通跳过的 coffee 翻译题重现，带错题重练。

![F05 步骤10：之前被普通跳过的 coffee 翻译题重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/134.png)


<a id="live-F06"></a>
### F06 · 听力词块与键盘：两份草稿、清空、错误与补心

**题干：**音频目标由错误反馈确认是 tea
两种输入方式各保留草稿。提交Tea, please.被判错，正确答案为tea；用满全部候选词块并不等于正确。红心归零时本次入门课提供一次免费补心。

**连续性与缺口：**本轮没有保存原音轨，播放按钮点击不证明听验完成。未取得此题答对及同题重练；随后临时跳过听力使本课未重现该听写。不能外推所有账号都有免费补心。

**1. 点击继续** — 进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。

![F06 步骤1：进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/065.png)

**2. 点击普通播放** — 保留点击后的播放控件画面；没有保存音轨，不能证明声音正常或播放持续时间。

![F06 步骤2：保留点击后的播放控件画面；没有保存音轨，不能证明声音正常或播放持续时间。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/070.png)

**3. 点击乌龟慢速播放** — 保留慢速入口点击后的画面；音频速度与声音质量未另行听验。

![F06 步骤3：保留慢速入口点击后的画面；音频速度与声音质量未另行听验。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/071.png)

**4. 点击词块 please** — please 进入答案区，检查启用。

![F06 步骤4：please 进入答案区，检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/072.png)

**5. 点击使用键盘** — 标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。

![F06 步骤5：标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/073.png)

**6. 键入 coffee** — 输入框出现草稿；检查启用。

![F06 步骤6：输入框出现草稿；检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/074.png)

**7. 清空输入框** — 显示占位文字，检查再次禁用。

![F06 步骤7：显示占位文字，检查再次禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/075.png)

**8. 键入 Tea, please.** — 形成新的未提交草稿；此时尚无正确判断。

![F06 步骤8：形成新的未提交草稿；此时尚无正确判断。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/076.png)

**9. 切回使用词库** — 先前的 please 词块草稿恢复；两个输入模式各有草稿。

![F06 步骤9：先前的 please 词块草稿恢复；两个输入模式各有草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/077.png)

**10. 撤回 please** — 词块答案清空，检查禁用。

![F06 步骤10：词块答案清空，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/078.png)

**11. 按顺序点 tea、please** — 两个词块进入答案区；不代表必须使用全部词块。

![F06 步骤11：两个词块进入答案区；不代表必须使用全部词块。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/079.png)

**12. 切回键盘** — Tea, please. 文本草稿仍保留。

![F06 步骤12：Tea, please. 文本草稿仍保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/080.png)

**13. 提交 Tea, please.** — 实际判错，正确答案为 tea；红心归零，弹出本次入门课的免费补心提示。

![F06 步骤13：实际判错，正确答案为 tea；红心归零，弹出本次入门课的免费补心提示。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/081.png)

**14. 点击免费重新注入** — 红心恢复为5；仍停在错误反馈页，原文本锁定，显示英文 tea 与中文茶。

![F06 步骤14：红心恢复为5；仍停在错误反馈页，原文本锁定，显示英文 tea 与中文茶。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/082.png)

**15. 点击继续** — 进入新的对话 Tea or coffee?；听写不能原位编辑。

![F06 步骤15：进入新的对话 Tea or coffee?；听写不能原位编辑。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/083.png)


<a id="live-F07"></a>
### F07 · 中英配对：瞬时错误、原位重试与全部完成

**题干：**茶/欢迎/咖啡/热 ↔ tea/welcome/coffee/hot
第二侧点击立即判定；错配短暂变红且扣心，恢复后可留在本题重试；配对正确后词条禁用，全部完成自动给绿色继续。

**连续性与缺口：**已验证左右两侧都能先选；未逐项穷举所有排列、重复点击和退出恢复。错误/正确瞬间与稳定状态是不同原始截图。

**1. 进入中英配对** — 左列茶、欢迎、咖啡、热；右列 hot、coffee、tea、welcome；检查禁用。

![F07 步骤1：左列茶、欢迎、咖啡、热；右列 hot、coffee、tea、welcome；检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/090.png)

**2. 先点击左列茶** — 单边蓝色选中，尚未判分。

![F07 步骤2：单边蓝色选中，尚未判分。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/091.png)

**3. 改点同列欢迎** — 选中项从茶转到欢迎；同列操作不会组成一对。

![F07 步骤3：选中项从茶转到欢迎；同列操作不会组成一对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/092.png)

**4. 点击不匹配的右列 tea，立即截图** — 欢迎与tea瞬间变红；红心5变4；无底部整题错误栏。

![F07 步骤4：欢迎与tea瞬间变红；红心5变4；无底部整题错误栏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/093.png)

**5. 等错误高亮自然结束** — 两项恢复白色，仍留在本题，可重新选择；检查依旧禁用。

![F07 步骤5：两项恢复白色，仍留在本题，可重新选择；检查依旧禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/094.png)

**6. 重新点欢迎，再点 welcome，立即截图** — 正确的两项瞬间变绿。

![F07 步骤6：正确的两项瞬间变绿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/095.png)

**7. 等正确高亮自然结束** — 已配对的欢迎与welcome变浅并禁用；其他项保持可操作。

![F07 步骤7：已配对的欢迎与welcome变浅并禁用；其他项保持可操作。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/096.png)

**8. 从右列 tea 开始下一对** — 右列也可先选，显示蓝色选中态。

![F07 步骤8：右列也可先选，显示蓝色选中态。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/097.png)

**9. 再点左列茶** — 第二对变浅并锁定。

![F07 步骤9：第二对变浅并锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/098.png)

**10. 点击咖啡与 coffee** — 第三对完成，仅热与hot尚未配对。

![F07 步骤10：第三对完成，仅热与hot尚未配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/099.png)

**11. 点击热与 hot** — 全部完成后自动给出绿色反馈与继续；没有按检查。

![F07 步骤11：全部完成后自动给出绿色反馈与继续；没有按检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/100.png)

**12. 点击继续** — 进入另一道键入听力题；这是后继题，不是刚才的配对重试。

![F07 步骤12：进入另一道键入听力题；这是后继题，不是刚才的配对重试。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/101.png)


<a id="live-F08"></a>
### F08 · 看图选择的直接正确路径

**题干：**哪个是“咖啡”呢？
初始、选中、提交成功和实际下一题均已拍到。

**连续性与缺口：**这是一道独立的咖啡题，不与茶题拼成同一条连续流程。

**1. 点击继续** — 切换到新的看图题“哪个是咖啡”。

![F08 步骤1：切换到新的看图题“哪个是咖啡”。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/024.png)

**2. 咖啡看图题点击 coffee** — coffee 蓝色选中，检查可用。

![F08 步骤2：coffee 蓝色选中，检查可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/030.png)

**3. 点击检查** — coffee 变绿，底部显示“棒棒哒！”；红心仍为3。

![F08 步骤3：coffee 变绿，底部显示“棒棒哒！”；红心仍为3。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/031.png)

**4. 点击继续** — 进入中文“咖啡”的文字选词题；不是词块题。

![F08 步骤4：进入中文“咖啡”的文字选词题；不是词块题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/032.png)


<a id="live-F09"></a>
### F09 · 保留选择的退出取消路径

**题干：**咖啡 → welcome / hot / coffee
退出入口先确认；点继续努力返回后，原选项保留。

**连续性与缺口：**只实测取消退出；最终退出并重进的恢复规则尚未验证。

**1. 点击继续** — 进入中文“咖啡”的文字选词题；不是词块题。

![F09 步骤1：进入中文“咖啡”的文字选词题；不是词块题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/032.png)

**2. 文字选词题点击 coffee** — 蓝色选中 coffee，尚未提交。

![F09 步骤2：蓝色选中 coffee，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/034.png)

**3. 点击左上角退出** — 弹出“现在离开的话，你的进度就没了”；提供继续努力与退出。

![F09 步骤3：弹出“现在离开的话，你的进度就没了”；提供继续努力与退出。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/035.png)

**4. 点击继续努力** — 返回原题，coffee 的选择仍保留。

![F09 步骤4：返回原题，coffee 的选择仍保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/036.png)

**5. 点击检查** — coffee 变绿，显示你太棒了和连对2题。

![F09 步骤5：coffee 变绿，显示你太棒了和连对2题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/037.png)

**6. 点击继续** — 进入英译中词块题 welcome；首次提示可悬停查看词义。

![F09 步骤6：进入英译中词块题 welcome；首次提示可悬停查看词义。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/038.png)


<a id="live-F10"></a>
### F10 · 临时不做听力

**题干：**第二道听写；音频内容未转录
黄色状态告知听力跳过且15分钟后恢复；本次红心不变，继续转到文字题。

**连续性与缺口：**这是另一道题。15分钟是屏幕提示，不代表已经等待并验证自动恢复。

**1. 点击继续** — 进入另一道键入听力题；这是后继题，不是刚才的配对重试。

![F10 步骤1：进入另一道键入听力题；这是后继题，不是刚才的配对重试。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/101.png)

**2. 点击现在不做听力题** — 黄色反馈“听力题已跳过，将在15分钟后恢复”；红心保持4。

![F10 步骤2：黄色反馈“听力题已跳过，将在15分钟后恢复”；红心保持4。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/110.png)

**3. 点击继续** — 进入文本翻译 coffee，答案为空。

![F10 步骤3：进入文本翻译 coffee，答案为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/111.png)


<a id="live-F11"></a>
### F11 · 普通跳过与课末重练

**题干：**coffee → 的 / 咖啡
普通跳过直接展示正确答案，本次不扣心；仍在课末标为错题重练，答对后进入结算。

**连续性与缺口：**这是独立的coffee题；本次事实不能概括所有课程的跳过计分规则。

**1. 点击继续** — 进入文本翻译 coffee，答案为空。

![F11 步骤1：进入文本翻译 coffee，答案为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/111.png)

**2. 点击普通翻译题的跳过** — 红色区域给出正确答案咖啡；本次红心仍为4。

![F11 步骤2：红色区域给出正确答案咖啡；本次红心仍为4。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/112.png)

**3. 点击继续** — 进入新的完成对话题。

![F11 步骤3：进入新的完成对话题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/113.png)

**4. 点击继续** — 之前被普通跳过的 coffee 翻译题重现，带错题重练。

![F11 步骤4：之前被普通跳过的 coffee 翻译题重现，带错题重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/134.png)

**5. 点击咖啡** — 形成重练答案。

![F11 步骤5：形成重练答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/135.png)

**6. 点击检查** — 绿色正确反馈，进度条到末尾。

![F11 步骤6：绿色正确反馈，进度条到末尾。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/136.png)

**7. 点击继续** — 实际进入单元结算：12经验、74%；这是本次人为测试，不代表真实学习水平。

![F11 步骤7：实际进入单元结算：12经验、74%；这是本次人为测试，不代表真实学习水平。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/137.png)


<a id="live-F12"></a>
### F12 · 结算与答案回顾

**题干：**同一节课首次错误和重练分开保留
结算与回顾是学习记录层，不新增为语言题型；首次sugar错误与之后tea正确记录并存。

**连续性与缺口：**这是人为答错和跳过的研究采集。74%不能当作学习成效或正常用户水平；回顾弹层图是当前视口。

**1. 点击继续** — 实际进入单元结算：12经验、74%；这是本次人为测试，不代表真实学习水平。

![F12 步骤1：实际进入单元结算：12经验、74%；这是本次人为测试，不代表真实学习水平。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/137.png)

**2. 点击回顾本单元** — 打开成绩单弹层，以红绿小卡分别保留首次与重练记录；这是当前视口，底部可滚动。

![F12 步骤2：打开成绩单弹层，以红绿小卡分别保留首次与重练记录；这是当前视口，底部可滚动。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/138.png)

**3. 点击第一次“哪个是茶”的红色记录** — 显示你的答案sugar、正确答案tea；没有被重练后的正确记录覆盖。

![F12 步骤3：显示你的答案sugar、正确答案tea；没有被重练后的正确记录覆盖。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/139.png)


<a id="live-F13"></a>
### F13 · 近音听辨：改选、正确、错误与后续呈现

**题干：**你听到了什么？dock/deck 与 got/get
保持第一段实际课序，列出多个音频实例。错误时选项仍为蓝色草稿样式，底部红色建议多听，并未直给正确词；后续同组选项再次出现。

**连续性与缺口：**不是把所有 got/get 画面当成同一道题：音轨未保存，相同选项可能对应不同声音。218到251之间完成了声音同异、朗读和配对，因此不计严格同音同题核心闭环。难度评价与报错入口未提交。

**1. 打开中文发音页** — 免费访客可见英语发音入口、元音/辅音词卡；这里只截当前视口，不是完整发音表。

![F13 步骤1：免费访客可见英语发音入口、元音/辅音词卡；这里只截当前视口，不是完整发音表。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/200.png)

**2. 点击开始进入专项** — 出现你听到了什么、dock/deck 两选项、大播放按钮；检查禁用，题页顶部没有红心显示。

![F13 步骤2：出现你听到了什么、dock/deck 两选项、大播放按钮；检查禁用，题页顶部没有红心显示。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/201.png)

**3. 点击 dock** — dock 变蓝；这张即时帧的检查仍灰色，不能拿它证明已完成按钮过渡。

![F13 步骤3：dock 变蓝；这张即时帧的检查仍灰色，不能拿它证明已完成按钮过渡。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/202.png)

**4. 改点 deck** — 选择转移到 deck；此时检查为绿色。

![F13 步骤4：选择转移到 deck；此时检查为绿色。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/203.png)

**5. 改回 dock，点击检查** — 本题实际正确，dock 与底部反馈变绿；提供太简单、太难、报错。

![F13 步骤5：本题实际正确，dock 与底部反馈变绿；提供太简单、太难、报错。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/204.png)

**6. 点击继续** — 新题选项为 got/get；不能把相同标题当成同一条音频。

![F13 步骤6：新题选项为 got/get；不能把相同标题当成同一条音频。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/205.png)

**7. 点击 got** — got 蓝色选中，检查可用。

![F13 步骤7：got 蓝色选中，检查可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/206.png)

**8. 点击检查** — 本题实际正确，绿色反馈及连对2题。

![F13 步骤8：本题实际正确，绿色反馈及连对2题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/207.png)

**9. 点击继续** — 另一题为 deck/dock，选项顺序改变；答案尚空。

![F13 步骤9：另一题为 deck/dock，选项顺序改变；答案尚空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/208.png)

**10. 点击 dock** — 右侧 dock 变蓝。

![F13 步骤10：右侧 dock 变蓝。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/209.png)

**11. 点击检查** — 本题实际正确；不能因选项排列变化推断音频相同。

![F13 步骤11：本题实际正确；不能因选项排列变化推断音频相同。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/210.png)

**12. 点击继续** — 又出现 got/get 选项，属于课序中的另一次呈现。

![F13 步骤12：又出现 got/get 选项，属于课序中的另一次呈现。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/211.png)

**13. 点击 get** — 右侧 get 变蓝，尚未提交。

![F13 步骤13：右侧 get 变蓝，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/212.png)

**14. 点击检查** — 此题 get 被判正确，绿色反馈。

![F13 步骤14：此题 get 被判正确，绿色反馈。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/213.png)

**15. 点击继续** — 下一道仍为 got/get；只凭文字不能知道其音频与上一题是否相同。

![F13 步骤15：下一道仍为 got/get；只凭文字不能知道其音频与上一题是否相同。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/214.png)

**16. 点击 get** — get 变蓝，等待提交。

![F13 步骤16：get 变蓝，等待提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/215.png)

**17. 点击检查** — 此次 get 被判错，红色提示还不太准确，再多听几次吧；选项锁定，未列出正确词。

![F13 步骤17：此次 get 被判错，红色提示还不太准确，再多听几次吧；选项锁定，未列出正确词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/216.png)

**18. 在错误反馈页点击播放** — 仍显示错误反馈，播放入口可点击；原音轨与播放质量没有保存验证。

![F13 步骤18：仍显示错误反馈，播放入口可点击；原音轨与播放质量没有保存验证。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/217.png)

**19. 点击继续** — 进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。

![F13 步骤19：进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/218.png)

**20. 点击继续** — 回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。

![F13 步骤20：回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/251.png)

**21. 选择 got** — 此轮 got 为提交草稿。

![F13 步骤21：此轮 got 为提交草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/252.png)

**22. 点击检查** — got 实际被判正确；只确认此次结果，不凭文字相同断言是原音轨重练。

![F13 步骤22：got 实际被判正确；只确认此次结果，不凭文字相同断言是原音轨重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/253.png)

**23. 点击继续** — 再次进入声音同异题；作答前英语词形隐藏。

![F13 步骤23：再次进入声音同异题；作答前英语词形隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/254.png)


<a id="live-F14"></a>
### F14 · 声音同异：隐藏词形、揭晓、错误、跳过与后续呈现

**题干：**同一个词 / 两个不同的词
作答前只有两个音频入口，提交后才出现英语词形与音标。错误为红色；跳过为黄色，即使出现鼓励文案也不能记作正确回答。

**连续性与缺口：**此组包含 deck/dock、get/get、deck/deck、got/get 等明确分开的实例；235到254之间有其他题。后段再现 got/get，但音轨身份未核实，未计同音同题核心闭环。

**1. 点击继续** — 进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。

![F14 步骤1：进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/218.png)

**2. 选择同一个词** — 第一项蓝色选中，检查启用。

![F14 步骤2：第一项蓝色选中，检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/219.png)

**3. 改选两个不同的词** — 蓝色选择转移，单词仍隐藏。

![F14 步骤3：蓝色选择转移，单词仍隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/220.png)

**4. 点击检查** — 实际正确；播放位置显示 deck 与 dock，底部补出单词及音标。

![F14 步骤4：实际正确；播放位置显示 deck 与 dock，底部补出单词及音标。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/221.png)

**5. 点击继续** — 进入下一道声音同异题，两词再次隐藏。

![F14 步骤5：进入下一道声音同异题，两词再次隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/222.png)

**6. 点击上方音频入口** — 保留点击后按钮画面；没有据此宣称声音正常。

![F14 步骤6：保留点击后按钮画面；没有据此宣称声音正常。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/223.png)

**7. 点击下方音频入口** — 两个声音可以分别触发；这不是语音输入。

![F14 步骤7：两个声音可以分别触发；这不是语音输入。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/224.png)

**8. 选择同一个词** — 形成未提交选择。

![F14 步骤8：形成未提交选择。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/225.png)

**9. 点击检查** — 实际正确；两个位置显示 get，底部为 get 及音标。

![F14 步骤9：实际正确；两个位置显示 get，底部为 get 及音标。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/226.png)

**10. 点击继续** — 下一道声音同异题初始态。

![F14 步骤10：下一道声音同异题初始态。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/227.png)

**11. 选择同一个词** — 选择变蓝，尚未揭晓词形。

![F14 步骤11：选择变蓝，尚未揭晓词形。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/228.png)

**12. 点击检查** — 实际正确；两个位置都是 deck，底部出现对应音标。

![F14 步骤12：实际正确；两个位置都是 deck，底部出现对应音标。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/229.png)

**13. 点击继续** — 再一道声音同异题初始态。

![F14 步骤13：再一道声音同异题初始态。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/230.png)

**14. 选择同一个词** — 作答草稿为同一个词。

![F14 步骤14：作答草稿为同一个词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/231.png)

**15. 点击检查** — 实际判错；揭晓 got 与 get 及两者音标，红色反馈；选项锁定。

![F14 步骤15：实际判错；揭晓 got 与 get 及两者音标，红色反馈；选项锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/232.png)

**16. 点击继续** — 转到另一道声音同异题，不是在原题原位修改。

![F14 步骤16：转到另一道声音同异题，不是在原题原位修改。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/233.png)

**17. 未选答案，点击跳过** — 底部是黄色反馈和继续，显示 get/get 及音标；尽管文案为看，多练几次真的有用吧，不能把跳过算正确作答。

![F14 步骤17：底部是黄色反馈和继续，显示 get/get 及音标；尽管文案为看，多练几次真的有用吧，不能把跳过算正确作答。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/234.png)

**18. 点击继续** — 进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。

![F14 步骤18：进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/235.png)

**19. 点击继续** — 再次进入声音同异题；作答前英语词形隐藏。

![F14 步骤19：再次进入声音同异题；作答前英语词形隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/254.png)

**20. 选择两个不同的词** — 保留作答草稿，准备检查。

![F14 步骤20：保留作答草稿，准备检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/255.png)

**21. 点击检查** — 实际正确，显示 got/get 与音标；对应词对与之前错误实例一致，但没有核对原音轨一致性。

![F14 步骤21：实际正确，显示 got/get 与音标；对应词对与之前错误实例一致，但没有核对原音轨一致性。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/256.png)

**22. 点击继续** — 发音专项实际进入单元完成页；本次研究采集显示11经验、83%，不代表听说能力或正常学习成效。

![F14 步骤22：发音专项实际进入单元完成页；本次研究采集显示11经验、83%，不代表听说能力或正常学习成效。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/257.png)


<a id="live-F15"></a>
### F15 · 朗读：启动、未通过提示与不做口语

**题干：**朗读下面的句子：got
记录完整题页、开始后的波形、停止后瞬时黄色未通过提示及跳过到配对题。跳过出现发音好棒哦的文字，但它不证明成功朗读。

**连续性与缺口：**没有可核对的口述音轨；本轮没有说出英语并验证识别正确。未通过原因不明，不能定性为发音错误；浏览器原生授权流程、重录成功等仍缺证据。

**1. 点击继续** — 进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。

![F15 步骤1：进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/235.png)

**2. 点击并开始录音** — 录音条变为波形界面，示范播放禁用；未提供可核对的口述音轨，波形不证明录音或识别质量。

![F15 步骤2：录音条变为波形界面，示范播放禁用；未提供可核对的口述音轨，波形不证明录音或识别质量。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/236.png)

**3. 等待后点击录音条停止** — 捕获黄色瞬时提示：呃～听起来不太对哦，再试一次吧；随后重新出现录音入口。未判断原因是无声、设备还是发音。

![F15 步骤3：捕获黄色瞬时提示：呃～听起来不太对哦，再试一次吧；随后重新出现录音入口。未判断原因是无声、设备还是发音。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/237.png)

**4. 点击现在不做口语题** — 出现黄色跳过状态，录音入口禁用，文案却是发音好棒哦；此操作没有成功朗读，不能解释成识别正确。

![F15 步骤4：出现黄色跳过状态，录音入口禁用，文案却是发音好棒哦；此操作没有成功朗读，不能解释成识别正确。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/238.png)

**5. 点击继续** — 进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。

![F15 步骤5：进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/239.png)


<a id="live-F16"></a>
### F16 · 声音配对书面词：错误恢复、左右先选与全部完成

**题干：**四个英语声音 ↔ deck / got / dock / get
错误对瞬时变红、原位恢复；成功对变浅锁定。右列也能先选，全部配完自动出现绿色继续；点击继续后的新题已拍到。

**连续性与缺口：**本次实测同一配对题的错误到全部正确；声音质量没有听验，首次选择借助试错完成，不算英语听力表现。尚未测全部排列、快捷键和退出。

**1. 点击继续** — 进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。

![F16 步骤1：进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/239.png)

**2. 点击第1个声音** — 音频卡出现蓝色高亮，还未形成配对。

![F16 步骤2：音频卡出现蓝色高亮，还未形成配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/240.png)

**3. 点击 deck，立即截图** — 第1声音与 deck 短暂标红；错误局限于当前一对，题页未显示红心。

![F16 步骤3：第1声音与 deck 短暂标红；错误局限于当前一对，题页未显示红心。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/241.png)

**4. 等错误反馈自然结束** — 仍在原题；错误对恢复可选，可以重新配对。

![F16 步骤4：仍在原题；错误对恢复可选，可以重新配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/242.png)

**5. 重选第1声音与 got** — 这对短暂变绿，实际配对正确。

![F16 步骤5：这对短暂变绿，实际配对正确。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/243.png)

**6. 等正确反馈自然结束** — 第1声音和 got 变浅并禁用，其他项目仍可操作。

![F16 步骤6：第1声音和 got 变浅并禁用，其他项目仍可操作。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/244.png)

**7. 从右列 deck 开始** — 右列也能先选，文字出现蓝色高亮。

![F16 步骤7：右列也能先选，文字出现蓝色高亮。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/245.png)

**8. 再点第2声音** — 当前这一对标红；已完成的 got 对仍保留。

![F16 步骤8：当前这一对标红；已完成的 got 对仍保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/246.png)

**9. 重新选第2声音，再点 dock** — 这一对变绿，后续锁定。

![F16 步骤9：这一对变绿，后续锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/247.png)

**10. 点第3声音，再点 deck** — 第三声音与 deck 不匹配，再次短暂标红。

![F16 步骤10：第三声音与 deck 不匹配，再次短暂标红。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/248.png)

**11. 重选第3声音，再点 get** — 该对变绿，前三对已完成。

![F16 步骤11：该对变绿，前三对已完成。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/249.png)

**12. 点第4声音，再点 deck** — 所有项目禁用，自动出现绿色正确与继续；没有点击检查。

![F16 步骤12：所有项目禁用，自动出现绿色正确与继续；没有点击检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/250.png)

**13. 点击继续** — 回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。

![F16 步骤13：回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/251.png)


<a id="live-F17"></a>
### F17 · 故事的完整阅读路径与结算

**题干：**Taxi Ride / 乘坐出租车
按实际阅读次序保留封面、每段新台词、悬停中文提示和结算。中间四种题目与结尾配对分别展开于F18–F22；这里的图号间隔是实际插题。

**连续性与缺口：**整篇重读含“重组听到的句子”，不能把整节故事当作无听力课。结算前没有开放写作；这仅适用于本次Taxi Ride重读。音轨未保存或听验。

**1. 打开练习基地** — 中文英语账号的练习基地出现单元复习、口语、听力、错题本、单词和小故事入口；页面为当前视口。

![F17 步骤1：中文英语账号的练习基地出现单元复习、口语、听力、错题本、单词和小故事入口；页面为当前视口。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/300.png)

**2. 打开小故事** — 书架与推荐故事乘坐出租车出现；本次选择这篇重读，不代表全部故事目录。

![F17 步骤2：书架与推荐故事乘坐出租车出现；本次选择这篇重读，不代表全部故事目录。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/301.png)

**3. 进入乘坐出租车** — Taxi Ride 封面与继续按钮；顶部为无限红心标志。

![F17 步骤3：Taxi Ride 封面与继续按钮；顶部为无限红心标志。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/302.png)

**4. 点击继续** — 出现 Bea 坐出租车、看手机地图的英文叙述；每段旁有播放入口。

![F17 步骤4：出现 Bea 坐出租车、看手机地图的英文叙述；每段旁有播放入口。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/303.png)

**5. 悬停 the map** — 题面原位出现中文提示“地图”，保留英文上下文。

![F17 步骤5：题面原位出现中文提示“地图”，保留英文上下文。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/304.png)

**6. 点击继续** — 新增 Bea 的指路：Turn left at the end of the street, please.

![F17 步骤6：新增 Bea 的指路：Turn left at the end of the street, please.](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/305.png)

**7. 点击继续** — 司机回答 I don't need to turn for three more miles.

![F17 步骤7：司机回答 I don't need to turn for three more miles.](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/306.png)

**8. 点击继续** — 出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。

![F17 步骤8：出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/307.png)

**9. 点击继续** — 原题收起，新增 The directions on my phone say that road is faster…；已实际推进。

![F17 步骤9：原题收起，新增 The directions on my phone say that road is faster…；已实际推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/312.png)

**10. 点击继续** — 新增司机说他认识本城所有道路的英文台词。

![F17 步骤10：新增司机说他认识本城所有道路的英文台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/319.png)

**11. 点击继续** — 新增 Bea 说手机认识每个城市所有道路的台词。

![F17 步骤11：新增 Bea 说手机认识每个城市所有道路的台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/320.png)

**12. 点击继续** — 司机强调是自己在开车，手机没有开车。

![F17 步骤12：司机强调是自己在开车，手机没有开车。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/321.png)

**13. 点击继续** — Bea 回应 But I'm paying for the ride, right?

![F17 步骤13：Bea 回应 But I'm paying for the ride, right?](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/322.png)

**14. 点击继续** — 司机答应 OK, OK.；上道题已经推进。

![F17 步骤14：司机答应 OK, OK.；上道题已经推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/325.png)

**15. 点击继续** — 叙述司机左转并停车。

![F17 步骤15：叙述司机左转并停车。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/326.png)

**16. 点击继续** — 司机询问 Are you going swimming?，为后续选择提供情境。

![F17 步骤16：司机询问 Are you going swimming?，为后续选择提供情境。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/327.png)

**17. 点击继续** — 司机说道路止于河边，已推进到后文。

![F17 步骤17：司机说道路止于河边，已推进到后文。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/332.png)

**18. 点击继续** — 新增 Oops.。

![F17 步骤18：新增 Oops.。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/333.png)

**19. 点击继续** — 新增 I'm so sorry.，重组题已推进。

![F17 步骤19：新增 I'm so sorry.，重组题已推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/341.png)

**20. 点击继续** — 司机问 Do you want to use my directions?

![F17 步骤20：司机问 Do you want to use my directions?](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/342.png)

**21. 点击继续** — Bea 答 Yes, please.，情节结束。

![F17 步骤21：Bea 答 Yes, please.，情节结束。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/343.png)

**22. 点击继续** — 实际进入“小故事练习完成啦！”结算，20经验、29%；这是有意试错的采集结果，不代表学习能力。

![F17 步骤22：实际进入“小故事练习完成啦！”结算，20经验、29%；这是有意试错的采集结果，不代表学习能力。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/357.png)

**23. 点击继续** — 返回故事书架；本次完整重读未出现开放写作，不据此推断其他故事或等级没有写作。

![F17 步骤23：返回故事书架；本次完整重读未出现开放写作，不据此推断其他故事或等级没有写作。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/358.png)


<a id="live-F18"></a>
### F18 · 故事理解：两个错误选项、原位答对与继续

**题干：**司机刚说的是……；另列Bea意图及结尾总结
中文问题和选项核对英语上下文；点击即判分，错误项先红后灰，仍能选其余项。第一道题两次答错后原位答对并继续；后两题明确为独立实例。

**连续性与缺口：**本轮三道题分别检查字面意义、话语意图和情节总结。未测试同题重新进入、快捷键、所有故事或开放写作。

**1. 点击继续** — 出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。

![F18 步骤1：出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/307.png)

**2. 选择他想先跑步至少三英里** — 立即标红并出现叉号，无需点击检查。

![F18 步骤2：立即标红并出现叉号，无需点击检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/308.png)

**3. 等错误反馈稳定** — 错误项变灰并禁用，另外两项仍可选；继续仍禁用。

![F18 步骤3：错误项变灰并禁用，另外两项仍可选；继续仍禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/309.png)

**4. 选择他现在时速三英里** — 第二个错误项立即标红，第一项保持灰色。

![F18 步骤4：第二个错误项立即标红，第一项保持灰色。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/310.png)

**5. 选择他在三英里后才需要转弯** — 正确项变绿，继续启用；此帧是即时结果，底部反馈动画尚未完整出现。

![F18 步骤5：正确项变绿，继续启用；此帧是即时结果，底部反馈动画尚未完整出现。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/311.png)

**6. 点击继续** — 原题收起，新增 The directions on my phone say that road is faster…；已实际推进。

![F18 步骤6：原题收起，新增 The directions on my phone say that road is faster…；已实际推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/312.png)

**7. 点击继续** — 另一道题问“Bea的话是什么意思？”，候选为退钱、按她说的路线、做兼职司机。

![F18 步骤7：另一道题问“Bea的话是什么意思？”，候选为退钱、按她说的路线、做兼职司机。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/323.png)

**8. 选择希望司机按她说的路线走** — 立即绿色正确反馈；这是语用理解的独立题，不与第307图拼成同一题。

![F18 步骤8：立即绿色正确反馈；这是语用理解的独立题，不与第307图拼成同一题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/324.png)

**9. 点击继续** — 司机答应 OK, OK.；上道题已经推进。

![F18 步骤9：司机答应 OK, OK.；上道题已经推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/325.png)

**10. 点击继续** — 结尾理解题“糟了！Bea发现原来……”；三个中文选项。

![F18 步骤10：结尾理解题“糟了！Bea发现原来……”；三个中文选项。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/344.png)

**11. 选择她的手机导航不可靠** — 立即绿色正确；这是结尾总结题的独立实例。

![F18 步骤11：立即绿色正确；这是结尾总结题的独立实例。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/345.png)

**12. 点击继续** — 出现五组中英词语配对；保留上文，继续禁用。

![F18 步骤12：出现五组中英词语配对；保留上文，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/346.png)


<a id="live-F19"></a>
### F19 · 故事词义：点选英语片段、错误禁用与退出取消

**题干：**导航指示 → The directions
中文意义对应原句中的英语片段。road错误后变灰，The directions正确后可继续；取消退出保留已答对状态。

**连续性与缺口：**错误候选不可原位再选，但正确路径仍在同一题页。只取消退出，没有确认丢弃，也未验证重进。

**1. 点击继续** — 出现“哪一个选项的意思是导航指示？”；原句被拆成可选英语片段，继续禁用。

![F19 步骤1：出现“哪一个选项的意思是导航指示？”；原句被拆成可选英语片段，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/313.png)

**2. 点击 road** — 该片段立即标红，未获得继续资格。

![F19 步骤2：该片段立即标红，未获得继续资格。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/314.png)

**3. 等错误反馈稳定** — road 变灰禁用，其余片段可选；没有重新打开整道题。

![F19 步骤3：road 变灰禁用，其余片段可选；没有重新打开整道题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/315.png)

**4. 点击 The directions** — 正确片段变绿，所有片段锁定，继续可用。

![F19 步骤4：正确片段变绿，所有片段锁定，继续可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/316.png)

**5. 点击左上角退出** — 出现“现在离开的话，你的进度就没了”，提供继续努力与退出。

![F19 步骤5：出现“现在离开的话，你的进度就没了”，提供继续努力与退出。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/317.png)

**6. 点击继续努力** — 弹层关闭，原正确片段仍保留，未清空答案。

![F19 步骤6：弹层关闭，原正确片段仍保留，未清空答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/318.png)

**7. 点击继续** — 新增司机说他认识本城所有道路的英文台词。

![F19 步骤7：新增司机说他认识本城所有道路的英文台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/319.png)


<a id="live-F20"></a>
### F20 · 故事补全短语：错误候选排除与整句揭晓

**题干：**No, ____ . Why?
选择错误短语时只标红该项，稳定后禁用；正确选择把缺失片段补入对话，继续后出现河边情节。

**连续性与缺口：**本题有回放且作答前缺失片段隐藏；没有保存音轨，无法完全确定文本推理与听音的各自贡献，单独置于听说相关/依赖待核，不算严格无听力。

**1. 点击继续** — “选择短语”：No, ____ . Why?，旁有回放，三个英语短语候选；作答前缺失片段不可见。

![F20 步骤1：“选择短语”：No, ____ . Why?，旁有回放，三个英语短语候选；作答前缺失片段不可见。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/328.png)

**2. 选择 I'm good at stopping** — 片段立即标红；不需要检查按钮。

![F20 步骤2：片段立即标红；不需要检查按钮。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/329.png)

**3. 等错误反馈稳定** — 错误候选变灰，空位仍在，其他候选可选。

![F20 步骤3：错误候选变灰，空位仍在，其他候选可选。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/330.png)

**4. 选择 I'm going shopping** — 候选变绿，整句补全 No, I'm going shopping. Why?；继续启用。

![F20 步骤4：候选变绿，整句补全 No, I'm going shopping. Why?；继续启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/331.png)

**5. 点击继续** — 司机说道路止于河边，已推进到后文。

![F20 步骤5：司机说道路止于河边，已推进到后文。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/332.png)


<a id="live-F21"></a>
### F21 · 故事听音重组：逐片段判定、保留前缀、自动完成

**题干：**I think my directions are wrong.
第一个位置错点are wrong，不插入答案；正确前缀出现后再次错点，前缀保留。依次补齐后自动给绿色继续。

**连续性与缺口：**与整句词块提交不同：没有检查按钮，每次点击都即时验证当前位置；未采集声音或验证重播，试错结果不是听力表现。

**1. 点击继续** — “重组听到的句子”：气泡文字隐藏，三个片段 are wrong / directions / I think my；继续禁用。

![F21 步骤1：“重组听到的句子”：气泡文字隐藏，三个片段 are wrong / directions / I think my；继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/334.png)

**2. 先点 are wrong** — 错误片段标红，但没有插入答案区。

![F21 步骤2：错误片段标红，但没有插入答案区。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/335.png)

**3. 等错误反馈结束** — are wrong 恢复可选；与故事词义选择的错误项永久变灰不同。

![F21 步骤3：are wrong 恢复可选；与故事词义选择的错误项永久变灰不同。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/336.png)

**4. 点 I think my** — 接受正确前缀并在气泡中显示，对应按钮禁用；其余片段仍可选。

![F21 步骤4：接受正确前缀并在气泡中显示，对应按钮禁用；其余片段仍可选。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/337.png)

**5. 第二个位置再点 are wrong** — 当前片段标红，已经接受的 I think my 保留。

![F21 步骤5：当前片段标红，已经接受的 I think my 保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/338.png)

**6. 点 directions** — 气泡增加 directions，已用片段禁用，只剩 are wrong 可用。

![F21 步骤6：气泡增加 directions，已用片段禁用，只剩 are wrong 可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/339.png)

**7. 点 are wrong** — 整句 I think my directions are wrong. 出现，自动绿色反馈与继续；每个片段即时判定。

![F21 步骤7：整句 I think my directions are wrong. 出现，自动绿色反馈与继续；每个片段即时判定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/340.png)

**8. 点击继续** — 新增 I'm so sorry.，重组题已推进。

![F21 步骤8：新增 I'm so sorry.，重组题已推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/341.png)


<a id="live-F22"></a>
### F22 · 故事末尾词汇配对：错配恢复到返回书架

**题干：**五对中英词语与短语
错误对原位恢复；成功对变浅锁定；右列也可先选，五对完成自动出现继续，再到故事结算和书架。

**连续性与缺口：**这是E01在故事中的五对变体；不新增“故事配对”题型。本页无限红心，与访客扣心分开记录。

**1. 点击继续** — 出现五组中英词语配对；保留上文，继续禁用。

![F22 步骤1：出现五组中英词语配对；保留上文，继续禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/346.png)

**2. 先点中文我** — 单侧蓝色高亮，还未形成一对。

![F22 步骤2：单侧蓝色高亮，还未形成一对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/347.png)

**3. 再点 She** — 我与 She 短暂标红；本页无限红心标志不变。

![F22 步骤3：我与 She 短暂标红；本页无限红心标志不变。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/348.png)

**4. 等错配反馈结束** — 错配恢复可选，正确任务仍在同一页。

![F22 步骤4：错配恢复可选，正确任务仍在同一页。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/349.png)

**5. 重选我和 I** — 这对变绿。

![F22 步骤5：这对变绿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/350.png)

**6. 等正确反馈结束** — 正确项变浅禁用，剩余四对仍可操作。

![F22 步骤6：正确项变浅禁用，剩余四对仍可操作。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/351.png)

**7. 从右侧 on her phone 开始** — 右列也能先选，蓝色高亮。

![F22 步骤7：右列也能先选，蓝色高亮。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/352.png)

**8. 再点在她手机上** — 第二对变绿。

![F22 步骤8：第二对变绿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/353.png)

**9. 配对你打算去…吗与 Are you going** — 第三对正确；截图仍含上一对颜色过渡。

![F22 步骤9：第三对正确；截图仍含上一对颜色过渡。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/354.png)

**10. 配对她与 She** — 第四对正确；已完成项保留。

![F22 步骤10：第四对正确；已完成项保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/355.png)

**11. 配对所有的路与 all the roads** — 全部变浅禁用，自动绿色反馈与继续，没有点击检查。

![F22 步骤11：全部变浅禁用，自动绿色反馈与继续，没有点击检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/356.png)

**12. 点击继续** — 实际进入“小故事练习完成啦！”结算，20经验、29%；这是有意试错的采集结果，不代表学习能力。

![F22 步骤12：实际进入“小故事练习完成啦！”结算，20经验、29%；这是有意试错的采集结果，不代表学习能力。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/357.png)

**13. 点击继续** — 返回故事书架；本次完整重读未出现开放写作，不据此推断其他故事或等级没有写作。

![F22 步骤13：返回故事书架；本次完整重读未出现开放写作，不据此推断其他故事或等级没有写作。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/358.png)


<a id="live-F23"></a>
### F23 · Super复习听写：词块错误提交与另一题跳过

**题干：**in the same place；另一音频未转录
本轮补到词库模式实际提交错误，反馈给出英语及中文意义。后续另一道听写选择暂不做听力，出现15分钟说明。

**连续性与缺口：**两道不同音频明确分开；跳过后最初听写没有重现，故无原音轨正确重练闭环。音质未听验，不能推断定时恢复已验证。

**1. 进入第21部分复习** — 说明这10道练习好久没见，邀请重练；Super 角色画面，属于单元引导。

![F23 步骤1：说明这10道练习好久没见，邀请重练；Super 角色画面，属于单元引导。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/400.png)

**2. 开始复习** — 选择听到的内容；普通/慢速播放、英语词块、使用键盘与现在不做听力题；检查禁用。

![F23 步骤2：选择听到的内容；普通/慢速播放、英语词块、使用键盘与现在不做听力题；检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/401.png)

**3. 选择 how are you** — 形成词块草稿、检查可用；即时帧含词块移动动画，不作为稳定排列图。

![F23 步骤3：形成词块草稿、检查可用；即时帧含词块移动动画，不作为稳定排列图。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/402.png)

**4. 点击检查** — 红色纠错给出 in the same place 及中文在同样的地方；词块草稿保留并锁定。音轨未听验。

![F23 步骤4：红色纠错给出 in the same place 及中文在同样的地方；词块草稿保留并锁定。音轨未听验。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/403.png)

**5. 点击继续** — 英译中 She has worked as a server for five years.，空答案及中文词库。

![F23 步骤5：英译中 She has worked as a server for five years.，空答案及中文词库。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/404.png)

**6. 点击继续** — 进入另一道词块听写；不是第401图的同一音频题。

![F23 步骤6：进入另一道词块听写；不是第401图的同一音频题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/415.png)

**7. 点击现在不做听力题** — 黄色提示“听力题已跳过，将在15分钟后恢复”；没有实际等待验证定时恢复。

![F23 步骤7：黄色提示“听力题已跳过，将在15分钟后恢复”；没有实际等待验证定时恢复。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/416.png)

**8. 点击继续** — 中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。

![F23 步骤8：中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/417.png)


<a id="live-F24"></a>
### F24 · 较长英译中：逐词构造、判分与下一题

**题干：**She has worked…；I have loved…
中文词块组织英语现在完成时句意；两题都走到绿色正确及实际下一题。

**连续性与缺口：**两句为独立实例。405–409是词块移动中的即时帧，410是稳定结果；不把动画中途位置作为排版缺陷。没有对这两句提交错误。

**1. 点击继续** — 英译中 She has worked as a server for five years.，空答案及中文词库。

![F24 步骤1：英译中 She has worked as a server for five years.，空答案及中文词库。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/404.png)

**2. 选择她** — 即时动画帧，词块正在移动；后续第410图保留稳定完整答案。

![F24 步骤2：即时动画帧，词块正在移动；后续第410图保留稳定完整答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/405.png)

**3. 继续选择当** — 增加中文词块，仍为移动中的即时画面。

![F24 步骤3：增加中文词块，仍为移动中的即时画面。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/406.png)

**4. 继续选择服务员** — 草稿继续增加；不把动画中途的词块位置当作最终布局。

![F24 步骤4：草稿继续增加；不把动画中途的词块位置当作最终布局。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/407.png)

**5. 继续选择五年** — 继续构造中文译文，尚未判分。

![F24 步骤5：继续构造中文译文，尚未判分。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/408.png)

**6. 继续选择了** — 全部中文词块已点击，截图仍含动画过渡。

![F24 步骤6：全部中文词块已点击，截图仍含动画过渡。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/409.png)

**7. 点击检查** — 她 当 服务员 五年 了 被接受，绿色反馈，答案稳定保留。

![F24 步骤7：她 当 服务员 五年 了 被接受，绿色反馈，答案稳定保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/410.png)

**8. 点击继续** — 先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。

![F24 步骤8：先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/411.png)

**9. 点击继续** — 先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。

![F24 步骤9：先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/438.png)

**10. 选择我爱你** — 答案区出现第一个中文短语块。

![F24 步骤10：答案区出现第一个中文短语块。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/439.png)

**11. 选择很长** — 增加时长修饰语。

![F24 步骤11：增加时长修饰语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/440.png)

**12. 选择时间** — 继续组合中文意义。

![F24 步骤12：继续组合中文意义。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/441.png)

**13. 选择了** — 得到 我爱你 很长 时间 了。

![F24 步骤13：得到 我爱你 很长 时间 了。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/442.png)

**14. 点击检查** — 中文译文被接受，绿色反馈。

![F24 步骤14：中文译文被接受，绿色反馈。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/443.png)

**15. 点击继续** — 中译英“他们在英国待了三年了。”，本次先显示词库。

![F24 步骤15：中译英“他们在英国待了三年了。”，本次先显示词库。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/444.png)


<a id="live-F25"></a>
### F25 · 先听后答：选择、改选、正确与推进

**题干：**他们在… → 看John的护照
中文解释作为候选，蓝色草稿可改选；检查后第二项被接受，继续进入下一道听写。

**连续性与缺口：**只取得正确分支；第一次选项没有提交，不能称为已答错。未听验音轨，也未测试慢速、原题重练或退出。

**1. 点击继续** — 先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。

![F25 步骤1：先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/411.png)

**2. 选择帮John找工作** — 第一项蓝色选中，检查启用。

![F25 步骤2：第一项蓝色选中，检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/412.png)

**3. 改选看John的护照** — 蓝色选择转移，旧项解除，尚未提交。

![F25 步骤3：蓝色选择转移，旧项解除，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/413.png)

**4. 点击检查** — 第二项被判正确，绿色反馈；本题没有采到错误分支，未听验原音轨。

![F25 步骤4：第二项被判正确，绿色反馈；本题没有采到错误分支，未听验原音轨。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/414.png)

**5. 点击继续** — 进入另一道词块听写；不是第401图的同一音频题。

![F25 步骤5：进入另一道词块听写；不是第401图的同一音频题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/415.png)


<a id="live-F26"></a>
### F26 · 中译英词块：查词、两种草稿、撤回、漏词与同题重练

**题干：**她跟她的男朋友一起去过巴黎。
先验证词库与键盘分别保留草稿，再撤回中间词和清空；漏to提交后突出正确介词。隔着其他题，原中文题干重现，补to后正确并推进。

**连续性与缺口：**438到465之间实际做了其他题；未看见额外错题过场。键盘模式只编辑未判分，不把此题当作E06的正确键入证据；未逐个穷举干扰项和所有词序。

**1. 点击继续** — 中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。

![F26 步骤1：中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/417.png)

**2. 悬停去过** — 出现 has been to / been / have been to 的英语提示。

![F26 步骤2：出现 has been to / been / have been to 的英语提示。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/418.png)

**3. 选择 She** — 第一个词块进入答案区，词库留下灰色占位，检查启用。

![F26 步骤3：第一个词块进入答案区，词库留下灰色占位，检查启用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/419.png)

**4. 选择 has** — 形成 She has；已等词块移动结束。

![F26 步骤4：形成 She has；已等词块移动结束。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/420.png)

**5. 选择 been** — 形成 She has been 的部分答案。

![F26 步骤5：形成 She has been 的部分答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/421.png)

**6. 切换使用键盘** — 输入框首次为空，词块草稿没有自动转换为文本。

![F26 步骤6：输入框首次为空，词块草稿没有自动转换为文本。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/422.png)

**7. 键入 She have** — 形成文字草稿，检查可用。

![F26 步骤7：形成文字草稿，检查可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/423.png)

**8. 删除末尾字符并改为 She has** — 键盘草稿可编辑；这里只改末尾，没有验证中间字符选区。

![F26 步骤8：键盘草稿可编辑；这里只改末尾，没有验证中间字符选区。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/424.png)

**9. 清空输入框** — 检查重新禁用。

![F26 步骤9：检查重新禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/425.png)

**10. 切回使用词库** — 原 She has been 草稿保留，词库候选位置改变；两种模式各保留自己的草稿。

![F26 步骤10：原 She has been 草稿保留，词库候选位置改变；两种模式各保留自己的草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/426.png)

**11. 撤回中间的 has** — 答案剩 She been，后面的 been 前移。

![F26 步骤11：答案剩 She been，后面的 been 前移。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/427.png)

**12. 撤回 She** — 答案剩 been。

![F26 步骤12：答案剩 been。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/428.png)

**13. 撤回 been** — 答案清空，检查禁用。

![F26 步骤13：答案清空，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/429.png)

**14. 重新选择 She** — 开始构造漏词错误答案。

![F26 步骤14：开始构造漏词错误答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/430.png)

**15. 选择 has** — 部分答案 She has。

![F26 步骤15：部分答案 She has。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/431.png)

**16. 选择 been** — 部分答案 She has been。

![F26 步骤16：部分答案 She has been。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/432.png)

**17. 直接选择 Paris** — 刻意漏掉介词 to；仍可继续编辑。

![F26 步骤17：刻意漏掉介词 to；仍可继续编辑。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/433.png)

**18. 选择 with** — 增加后续片段，尚未提交。

![F26 步骤18：增加后续片段，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/434.png)

**19. 选择 her** — 继续构造错误草稿。

![F26 步骤19：继续构造错误草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/435.png)

**20. 选择 boyfriend** — 完整草稿 She has been Paris with her boyfriend，缺少 to。

![F26 步骤20：完整草稿 She has been Paris with her boyfriend，缺少 to。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/436.png)

**21. 点击检查** — 红色纠错给出 She has been to Paris with her boyfriend.，to 被突出；原漏词答案保留并锁定。

![F26 步骤21：红色纠错给出 She has been to Paris with her boyfriend.，to 被突出；原漏词答案保留并锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/437.png)

**22. 点击继续** — 先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。

![F26 步骤22：先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/438.png)

**23. 点击继续** — 巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。

![F26 步骤23：巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/465.png)

**24. 切换使用词库** — 重练的词库为空、候选位置改变，先前错误草稿未沿用。

![F26 步骤24：重练的词库为空、候选位置改变，先前错误草稿未沿用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/466.png)

**25. 选择 She** — 开始正确重答。

![F26 步骤25：开始正确重答。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/467.png)

**26. 选择 has** — 正确草稿 She has。

![F26 步骤26：正确草稿 She has。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/468.png)

**27. 选择 been** — 正确草稿 She has been。

![F26 步骤27：正确草稿 She has been。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/469.png)

**28. 选择 to** — 补上首次漏掉的介词。

![F26 步骤28：补上首次漏掉的介词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/470.png)

**29. 选择 Paris** — 形成 She has been to Paris。

![F26 步骤29：形成 She has been to Paris。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/471.png)

**30. 选择 with** — 增加后续片段。

![F26 步骤30：增加后续片段。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/472.png)

**31. 选择 her** — 继续补全译文。

![F26 步骤31：继续补全译文。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/473.png)

**32. 选择 boyfriend** — 正确译文完整，尚未提交。

![F26 步骤32：正确译文完整，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/474.png)

**33. 点击检查** — 绿色正确反馈；同一道巴黎题完成从漏词到正确的重练。

![F26 步骤33：绿色正确反馈；同一道巴黎题完成从漏词到正确的重练。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/475.png)

**34. 点击继续** — 英国三年原题再次出现，词库空白。

![F26 步骤34：英国三年原题再次出现，词库空白。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/476.png)


<a id="live-F27"></a>
### F27 · 整句键入：数字意义错误、退出取消与同题修正

**题干：**他们在英国待了三年了。
十年误写被拒绝，three突出；取消退出后原错误草稿保留。后段原题重现，键入three years后正确并继续。

**连续性与缺口：**449为弹层淡出帧，450才显示稳定提交结果。只测试取消退出；未验证中间选区、所有可接受译法或移动端键盘。

**1. 点击继续** — 中译英“他们在英国待了三年了。”，本次先显示词库。

![F27 步骤1：中译英“他们在英国待了三年了。”，本次先显示词库。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/444.png)

**2. 切换使用键盘** — 空英语输入框，检查禁用。

![F27 步骤2：空英语输入框，检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/445.png)

**3. 输入 They have stayed** — 部分文字即可启用检查。

![F27 步骤3：部分文字即可启用检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/446.png)

**4. 输入 They have stayed in the UK for ten years.** — 故意把三年写为 ten years；未提交。

![F27 步骤4：故意把三年写为 ten years；未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/447.png)

**5. 点击退出入口** — 出现进度丢失确认，提供继续努力与退出。

![F27 步骤5：出现进度丢失确认，提供继续努力与退出。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/448.png)

**6. 点击继续努力** — 捕获弹层淡出中的一帧；不能据本帧宣称弹层已经完全消失。后续提交保留同一草稿。

![F27 步骤6：捕获弹层淡出中的一帧；不能据本帧宣称弹层已经完全消失。后续提交保留同一草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/449.png)

**7. 点击检查** — 红色正确答案使用 three years，three 被突出；原 ten years 草稿保留，确认取消退出未丢失输入。

![F27 步骤7：红色正确答案使用 three years，three 被突出；原 ten years 草稿保留，确认取消退出未丢失输入。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/450.png)

**8. 点击继续** — 输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。

![F27 步骤8：输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/451.png)

**9. 点击继续** — 英国三年原题再次出现，词库空白。

![F27 步骤9：英国三年原题再次出现，词库空白。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/476.png)

**10. 切换使用键盘** — 重练输入框为空。

![F27 步骤10：重练输入框为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/477.png)

**11. 输入 They have stayed in the UK for three years.** — 将首次 ten 改为符合中文意义的 three。

![F27 步骤11：将首次 ten 改为符合中文意义的 three。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/478.png)

**12. 点击检查** — 绿色正确，原题纠错完成。

![F27 步骤12：绿色正确，原题纠错完成。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/479.png)

**13. 点击继续** — 妈妈题再次出现，缺词空位为空。

![F27 步骤13：妈妈题再次出现，缺词空位为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/480.png)


<a id="live-F28"></a>
### F28 · 缺词与整句难度切换：独立草稿、错误与原题重练

**题干：**Mom has always been ____ beautiful.
加大难度切换成整句译文，减少难度回到空位，两种输入分别保留草稿。cold被判错，后段同题补so被接受并实际进入结算。

**连续性与缺口：**整句模式仅输入部分草稿，没有提交；不能称为整句译文通过。每字母阈值只检查s，未穷举所有长度、输入法和替代词。

**1. 点击继续** — 输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。

![F28 步骤1：输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/451.png)

**2. 点击加大难度** — 变为用英语写出这句话，整句输入框为空；出现减少难度。

![F28 步骤2：变为用英语写出这句话，整句输入框为空；出现减少难度。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/452.png)

**3. 输入 Mom has always** — 形成整句模式的部分草稿。

![F28 步骤3：形成整句模式的部分草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/453.png)

**4. 点击减少难度** — 回到缺词模式，空位仍空；整句草稿没有复制入空位。

![F28 步骤4：回到缺词模式，空位仍空；整句草稿没有复制入空位。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/454.png)

**5. 输入 s** — 单个字母即可启用检查。

![F28 步骤5：单个字母即可启用检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/455.png)

**6. 继续输入 o** — 空位内容变成 so，尚未提交。

![F28 步骤6：空位内容变成 so，尚未提交。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/456.png)

**7. 清空空位** — 检查禁用。

![F28 步骤7：检查禁用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/457.png)

**8. 再次加大难度** — 原整句草稿 Mom has always 保留。

![F28 步骤8：原整句草稿 Mom has always 保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/458.png)

**9. 再次减少难度** — 空位仍保持先前清空后的状态；两种难度分别保留草稿。

![F28 步骤9：空位仍保持先前清空后的状态；两种难度分别保留草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/459.png)

**10. 在空位输入 cold** — 准备故意错误答案。

![F28 步骤10：准备故意错误答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/460.png)

**11. 点击检查** — 红色反馈给出 Mom has always been so beautiful.；错误 cold 保留并锁定。

![F28 步骤11：红色反馈给出 Mom has always been so beautiful.；错误 cold 保留并锁定。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/461.png)

**12. 点击继续** — 另一题“他一直都想要做一个医生。”；显示键盘输入模式。

![F28 步骤12：另一题“他一直都想要做一个医生。”；显示键盘输入模式。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/462.png)

**13. 点击继续** — 妈妈题再次出现，缺词空位为空。

![F28 步骤13：妈妈题再次出现，缺词空位为空。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/480.png)

**14. 输入 so** — 形成正确缺词草稿。

![F28 步骤14：形成正确缺词草稿。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/481.png)

**15. 点击检查** — 绿色正确；空位锁定，继续可用。

![F28 步骤15：绿色正确；空位锁定，继续可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/482.png)

**16. 点击继续** — 进入单元结算，20经验、64%；时长提示含拍摄等待，不代表正常用时或学习效果。

![F28 步骤16：进入单元结算，20经验、64%；时长提示含拍摄等待，不代表正常用时或学习效果。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/483.png)


<a id="live-F29"></a>
### F29 · 整句翻译的拼写容错实例

**题干：**he has always wanted to be a docter
绿色反馈仍显示“有错别字哦”，并给doctor正确写法；说明这个实例区分语义通过和拼写提醒。

**连续性与缺口：**大小写、句末标点、docter拼写差异同时存在，只证明该组合被接受，不能分离推断每个规则或全局容错阈值。

**1. 点击继续** — 另一题“他一直都想要做一个医生。”；显示键盘输入模式。

![F29 步骤1：另一题“他一直都想要做一个医生。”；显示键盘输入模式。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/462.png)

**2. 输入 he has always wanted to be a docter** — 故意保留 docter 拼写差异、小写开头且不加句号。

![F29 步骤2：故意保留 docter 拼写差异、小写开头且不加句号。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/463.png)

**3. 点击检查** — 绿色通过并提示“有错别字哦！”；显示 doctor 的正确写法。只证明本句组合条件被接受，不能推断所有拼写/大小写/标点均容错。

![F29 步骤3：绿色通过并提示“有错别字哦！”；显示 doctor 的正确写法。只证明本句组合条件被接受，不能推断所有拼写/大小写/标点均容错。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/464.png)

**4. 点击继续** — 巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。

![F29 步骤4：巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/465.png)


<a id="live-F30"></a>
### F30 · Super复习结算：首次错误与重做记录同时保留

**题干：**20经验、64%，以及巴黎题的两次答案
成绩单按发生顺序同时保存原红色错误卡与后续绿色正确卡，点击分别显示答案；关闭后继续回练习基地。

**连续性与缺口：**有意错答、跳过和截图等待影响分数与时长。绿色卡也出现于跳过的听力，不能据卡片颜色推断完成听写。

**1. 点击继续** — 进入单元结算，20经验、64%；时长提示含拍摄等待，不代表正常用时或学习效果。

![F30 步骤1：进入单元结算，20经验、64%；时长提示含拍摄等待，不代表正常用时或学习效果。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/483.png)

**2. 打开回顾本单元** — 成绩单同时保留原错答与重做正确；跳过的听力卡也呈绿勾，不能把该标记解释为成功听写。

![F30 步骤2：成绩单同时保留原错答与重做正确；跳过的听力卡也呈绿勾，不能把该标记解释为成功听写。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/484.png)

**3. 点击首次巴黎题红色卡片** — 弹层分别给出你的漏词答案和含 to 的正确答案。

![F30 步骤3：弹层分别给出你的漏词答案和含 to 的正确答案。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/485.png)

**4. 点击重做巴黎题绿色卡片** — 展示重做后的答案；首次红色记录仍在，没有被覆盖。

![F30 步骤4：展示重做后的答案；首次红色记录仍在，没有被覆盖。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/486.png)

**5. 关闭成绩单** — 返回结算页面，继续可用。

![F30 步骤5：返回结算页面，继续可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/487.png)

**6. 点击继续** — 实际回到练习基地，已完成单元复习。

![F30 步骤6：实际回到练习基地，已完成单元复习。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/488.png)


<a id="live-F31"></a>
### F31 · 电台听音配中文：错误恢复、揭晓拼写与自动播放

**题干：**四个声音 ↔ 年 / 学校 / 图片 / 法语
演播室画面保持，问题固定在底部。正确配对后才揭晓英文拼写；错误只闪红当前对，恢复后可再配。四对完成自动继续节目。

**连续性与缺口：**以试错采集交互，没有音轨听验。无限红心只证实当前Super会话；不是R02只对Super开放的证明。未测试重复同卡、退出和键盘数字快捷键。

**1. 在学习路径找到电台节点** — 耳机图标位于已解锁路径；本帧尚无节点弹层，不当作题面。

![F31 步骤1：耳机图标位于已解锁路径；本帧尚无节点弹层，不当作题面。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/500.png)

**2. 点击电台节点** — “学习法国文化”弹层显示开始复习+15经验；通过真实入口进入。

![F31 步骤2：“学习法国文化”弹层显示开始复习+15经验；通过真实入口进入。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/501.png)

**3. 进入并等待首个任务** — 莉莉演播室上方为进度和无限红心；下方选择配对，四个声音与年、学校、图片、法语。

![F31 步骤3：莉莉演播室上方为进度和无限红心；下方选择配对，四个声音与年、学校、图片、法语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/502.png)

**4. 点第1个声音** — 左侧音频蓝色选中，尚未配对。

![F31 步骤4：左侧音频蓝色选中，尚未配对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/503.png)

**5. 点击年** — 配对正确变绿，声音卡揭示英语拼写 year。

![F31 步骤5：配对正确变绿，声音卡揭示英语拼写 year。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/504.png)

**6. 等正确反馈稳定** — year/年变浅禁用，其他三对仍可选。

![F31 步骤6：year/年变浅禁用，其他三对仍可选。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/505.png)

**7. 点第2个声音** — 蓝色选中，本次没有听验原音轨。

![F31 步骤7：蓝色选中，本次没有听验原音轨。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/506.png)

**8. 点击图片** — 错误对立即红色，已完成 year 保留。

![F31 步骤8：错误对立即红色，已完成 year 保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/507.png)

**9. 等错误反馈稳定** — 错误对恢复可选；仍在同一题，不用重新进入。

![F31 步骤9：错误对恢复可选；仍在同一题，不用重新进入。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/508.png)

**10. 从右侧学校开始** — 中文选项蓝色高亮，证实可从右列开始。

![F31 步骤10：中文选项蓝色高亮，证实可从右列开始。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/509.png)

**11. 再点第2个声音** — 该配对也错误，学校与声音2标红。

![F31 步骤11：该配对也错误，学校与声音2标红。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/510.png)

**12. 重选第2个声音与法语** — 绿色正确，并揭示 French。

![F31 步骤12：绿色正确，并揭示 French。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/511.png)

**13. 等正确反馈稳定** — 两对变浅锁定，仍有两对未完成。

![F31 步骤13：两对变浅锁定，仍有两对未完成。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/512.png)

**14. 配对声音3与学校** — 第三次错配，仍只影响当前一对。

![F31 步骤14：第三次错配，仍只影响当前一对。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/513.png)

**15. 重选声音3与图片** — 正确并揭示 pictures。

![F31 步骤15：正确并揭示 pictures。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/514.png)

**16. 点剩余声音4** — 单边蓝色高亮，之前配对保留。

![F31 步骤16：单边蓝色高亮，之前配对保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/515.png)

**17. 再点学校** — 最后一对正确并揭示 school，进度开始推进；没有检查或继续按钮。

![F31 步骤17：最后一对正确并揭示 school，进度开始推进；没有检查或继续按钮。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/516.png)

**18. 等待自动推进** — 配对区域消失，恢复角色对话播放，底部回退5秒/暂停/前进控件；本帧前进为灰色。

![F31 步骤18：配对区域消失，恢复角色对话播放，底部回退5秒/暂停/前进控件；本帧前进为灰色。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/517.png)


<a id="live-F32"></a>
### F32 · 电台判断：错误揭晓英文、原位纠正与自动推进

**题干：**她去年在学校学习了西班牙语。
先只有中文陈述与音频；选勾错误后揭晓英语，错误项禁用。改点叉正确后自动继续播放。

**连续性与缺口：**一个判断题包含完整错误到正确分支；未保存声音。正确的叉号与表示错误的红色反馈不是同一含义。

**1. 等待下一问题出现** — “她去年在学校学习了西班牙语。”；音频波形与勾/叉二选一，作答前英文句子隐藏。

![F32 步骤1：“她去年在学校学习了西班牙语。”；音频波形与勾/叉二选一，作答前英文句子隐藏。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/518.png)

**2. 点勾表示正确** — 立即标红，揭示 I learned French at school last year.，帮助比对 French 与西班牙语。

![F32 步骤2：立即标红，揭示 I learned French at school last year.，帮助比对 French 与西班牙语。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/519.png)

**3. 等错误反馈稳定** — 勾选项变灰禁用；叉仍可点，英文句子保留。

![F32 步骤3：勾选项变灰禁用；叉仍可点，英文句子保留。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/520.png)

**4. 点叉表示不正确** — 绿色正确，进度推进；不需要再点检查。

![F32 步骤4：绿色正确，进度推进；不需要再点检查。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/521.png)

**5. 等待自动推进** — 问题收起，恢复角色对话与播放控件。

![F32 步骤5：问题收起，恢复角色对话与播放控件。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/522.png)

**6. 下一道题已出现** — 选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。

![F32 步骤6：选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/523.png)


<a id="live-F33"></a>
### F33 · 电台选两个词：每词即时判定、少一个与全部完成

**题干：**class / favorite / boring
boring点后即错并禁用，class点后即对但仍停留；favorite正确后才自动推进。这里是累计找对两个词，不是提交一个两项选择集合。

**连续性与缺口：**错误候选被禁用、达到两词后自动推进，本实例没有第三项可再加选；未验证别的候选数量、重播音轨和退出。

**1. 下一道题已出现** — 选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。

![F33 步骤1：选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/523.png)

**2. 点 boring** — 该词立即变红；不是先选满两项再统一判分。

![F33 步骤2：该词立即变红；不是先选满两项再统一判分。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/524.png)

**3. 等错误反馈稳定** — boring 变灰禁用，其余两个词仍可点。

![F33 步骤3：boring 变灰禁用，其余两个词仍可点。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/525.png)

**4. 点 class** — 第一个正确词即时变绿，尚未完成两词要求。

![F33 步骤4：第一个正确词即时变绿，尚未完成两词要求。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/526.png)

**5. 保持一个正确词状态** — class 保持绿色锁定，favorite 仍可点，未自动进入下一段。

![F33 步骤5：class 保持绿色锁定，favorite 仍可点，未自动进入下一段。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/527.png)

**6. 点 favorite** — 两词都绿，任务达到要求数量后自动推进。

![F33 步骤6：两词都绿，任务达到要求数量后自动推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/528.png)

**7. 等待下一问题** — “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。

![F33 步骤7：“她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/529.png)


<a id="live-F34"></a>
### F34 · 电台中文内容理解：错误候选禁用与原位答对

**题干：**她喜欢学习 → 关于新地方 / 关于旧地方
以中文候选核对节目内容；选择即判分，错项变灰，正确后自动进入收尾并结算。与普通先听后答的检查按钮不同。

**连续性与缺口：**这是电台中的内容选择变体，并非图像选择R04；本屏没有完整台词，不能因为候选是中文就归无听力题。

**1. 等待下一问题** — “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。

![F34 步骤1：“她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/529.png)

**2. 点关于旧地方** — 即时标红。

![F34 步骤2：即时标红。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/530.png)

**3. 等错误反馈稳定** — 错误候选变灰禁用，另一选项可点。

![F34 步骤3：错误候选变灰禁用，另一选项可点。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/531.png)

**4. 点关于新地方** — 绿色正确，进度推进。

![F34 步骤4：绿色正确，进度推进。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/532.png)

**5. 等待自动推进** — 问题收起并继续播放，进度到末端；尚非结算画面。

![F34 步骤5：问题收起并继续播放，进度到末端；尚非结算画面。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/533.png)

**6. 等待电台结束** — 实际结算显示30经验、0%，并提供查看文本；本次每类任务都有试错，数值不能当作学习成效。

![F34 步骤6：实际结算显示30经验、0%，并提供查看文本；本次每类任务都有试错，数值不能当作学习成效。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/534.png)


<a id="live-F35"></a>
### F35 · 电台结算与中英全文回顾

**题干：**学习法国文化；莉莉遇见陌生人
电台完成后提供查看文本，按角色保留中文串场与英文来宾台词；关闭后继续返回路径。

**连续性与缺口：**回顾文本是完成后才打开的证据。没有拍到成功暂停/回退，不能把播放控件可见写成操作已完成。30经验与0%只属于这次试错采集。

**1. 等待电台结束** — 实际结算显示30经验、0%，并提供查看文本；本次每类任务都有试错，数值不能当作学习成效。

![F35 步骤1：实际结算显示30经验、0%，并提供查看文本；本次每类任务都有试错，数值不能当作学习成效。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/534.png)

**2. 点击查看文本** — 整段复习文本可见；莉莉串场为中文，来宾台词为英文。属于课后全文回顾，不应倒推作答前已有全文。

![F35 步骤2：整段复习文本可见；莉莉串场为中文，来宾台词为英文。属于课后全文回顾，不应倒推作答前已有全文。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/535.png)

**3. 关闭文本弹层** — 返回结算，继续可用。

![F35 步骤3：返回结算，继续可用。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/536.png)

**4. 点击继续** — 返回中文英语学习路径，电台复习完成。

![F35 步骤4：返回中文英语学习路径，电台复习完成。](/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/assets/flows/537.png)

## 各题型操作分支覆盖表


<a id="flow-E01"></a>
### E01 · 中英词语配对

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #090 左列茶、欢迎、咖啡、热；右列 hot、coffee、tea、welcome；检查禁用。；#346 出现五组中英词语配对；保留上文，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #090 左列茶、欢迎、咖啡、热；右列 hot、coffee、tea、welcome；检查禁用。；#346 出现五组中英词语配对；保留上文，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点左侧或右侧的一张卡 | 已采集本次实例 | #091 单边蓝色选中，尚未判分。；#097 右列也可先选，显示蓝色选中态。；#347 单侧蓝色高亮，还未形成一对。；#352 右列也能先选，蓝色高亮。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点同一卡或同列另一卡 | 部分已采集 | #091 单边蓝色选中，尚未判分。；#092 选中项从茶转到欢迎；同列操作不会组成一对。 只验证同列换选；再次点击同一卡未测试。 |
| 5 | 选一个不匹配的另一侧项目 | 已采集本次实例 | #093 欢迎与tea瞬间变红；红心5变4；无底部整题错误栏。；#094 两项恢复白色，仍留在本题，可重新选择；检查依旧禁用。；#348 我与 She 短暂标红；本页无限红心标志不变。；#349 错配恢复可选，正确任务仍在同一页。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 错误后再选一对正确项目 | 已采集本次实例 | #094 两项恢复白色，仍留在本题，可重新选择；检查依旧禁用。；#095 正确的两项瞬间变绿。；#349 错配恢复可选，正确任务仍在同一页。；#350 这对变绿。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 配对正确，但不完成全部 | 已采集本次实例 | #095 正确的两项瞬间变绿。；#096 已配对的欢迎与welcome变浅并禁用；其他项保持可操作。；#350 这对变绿。；#351 正确项变浅禁用，剩余四对仍可操作。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 完成所有剩余配对 | 已采集本次实例 | #099 第三对完成，仅热与hot尚未配对。；#100 全部完成后自动给出绿色反馈与继续；没有按检查。；#356 全部变浅禁用，自动绿色反馈与继续，没有点击检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 点击推进入口 | 已采集本次实例 | #101 进入另一道键入听力题；这是后继题，不是刚才的配对重试。；#357 实际进入“小故事练习完成啦！”结算，20经验、29%；这是有意试错的采集结果，不代表学习能力。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 已配对状态是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-E02"></a>
### E02 · 英语语境词义—英文定义选择

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 选择一项但暂不提交 | 待实测；适用性也待核 | 选择前后边框、颜色、指示符和主按钮变化。 尚无对应中文连续操作证据。 |
| 4 | 换选另一项，再尝试取消当前选择 | 待实测；适用性也待核 | 旧选择是否解除、是否能回到空答案。 尚无对应中文连续操作证据。 |
| 5 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 7 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E03"></a>
### E03 · Flashcards：主动说出英语词

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 开始录音 | 待实测；适用性也待核 | 入口、权限提示、录音中反馈；没有授权时在提示处停止。 尚无对应中文连续操作证据。 |
| 4 | 测试未收到声音的结果（获得许可后） | 待实测；适用性也待核 | 是否有超时、无声音提示和恢复入口；与答错区分。 尚无对应中文连续操作证据。 |
| 5 | 说出给定或自行组织的英语 | 待实测；适用性也待核 | 录音中、处理等待、识别完成状态；需要音频证据核对识别内容。 尚无对应中文连续操作证据。 |
| 6 | 说错或识别不成功后恢复 | 待实测；适用性也待核 | 错误/识别失败文案、重录、转键入或跳过的实际入口。 尚无对应中文连续操作证据。 |
| 7 | 通过提供的入口重试 | 待实测；适用性也待核 | 重录是否覆盖旧答案；再次识别后的结果。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E04"></a>
### E04 · 英译中：用中文词块表达英语意义

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #038 进入英译中词块题 welcome；首次提示可悬停查看词义。；#050 词库为谢谢、牛奶、茶；答案为空。；#404 英译中 She has worked as a server for five years.，空答案及中文词库。；#438 先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #042 词块撤回；答案清空，检查重新变灰。；#050 词库为谢谢、牛奶、茶；答案为空。；#404 英译中 She has worked as a server for five years.，空答案及中文词库。；#438 先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 选择第一个词块 | 已采集本次实例 | #041 热茶进入答案区；词库原位变灰；检查启用。；#052 只有一个词块也能启用检查；非完整答案仍可提交。；#439 答案区出现第一个中文短语块。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 继续选词，形成部分答案 | 已采集本次实例 | #053 形成“谢谢 茶”的未提交草稿；未验证这个词序会被怎样判分。；#440 增加时长修饰语。；#441 继续组合中文意义。；#442 得到 我爱你 很长 时间 了。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 移除中间或最后一个已选词，再选回来 | 已采集本次实例 | #054 前面的词块撤回，茶留在答案区并前移。；#055 它追加到答案末尾，组成“茶 谢谢”。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 撤回所有词块 | 已采集本次实例 | #041 热茶进入答案区；词库原位变灰；检查启用。；#042 词块撤回；答案清空，检查重新变灰。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 构造错误词序，并在提交前修改 | 已采集本次实例 | #053 形成“谢谢 茶”的未提交草稿；未验证这个词序会被怎样判分。；#054 前面的词块撤回，茶留在答案区并前移。；#055 它追加到答案末尾，组成“茶 谢谢”。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 有意给出错误答案并提交 | 已采集本次实例 | #044 再次形成错误草稿；实际提交前的答案为热茶。；#045 红色反馈给出欢迎；词块均锁定；红心3变2。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #045 红色反馈给出欢迎；词块均锁定；红心3变2。；#046 进入新的文字选择题“欢迎”；不是在原词块题内重答。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #128 welcome 英译中题重现；词库顺序与首次不同，带错题重练标签。；#129 正确词块进入答案区。；#130 同题出现绿色正确反馈，连对4题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #056 绿色正确反馈出现；全部词块锁定。；#130 同题出现绿色正确反馈，连对4题。；#410 她 当 服务员 五年 了 被接受，绿色反馈，答案稳定保留。；#443 中文译文被接受，绿色反馈。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 点击正确反馈后的推进入口 | 已采集本次实例 | #057 进入新题 I'd like coffee.。；#131 原对话 Coffee or tea? 及两项原选项重现，带错题重练。；#411 先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。；#444 中译英“他们在英国待了三年了。”，本次先显示词库。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 13 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |
| 14 | 检查键盘或可选播放入口（若存在） | 部分已采集 | #051 实际展开词义提示：谢谢、感谢、多谢。 只验证 please 的悬停提示；本题键盘切换和播放未测试。 |

<a id="flow-E05"></a>
### E05 · 中译英：用英语词块组织译文

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #417 中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #417 中译英“她跟她的男朋友一起去过巴黎。”，英语词库，检查禁用。；#429 答案清空，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 悬停中文词查看英语提示 | 已采集本次实例 | #418 出现 has been to / been / have been to 的英语提示。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 选择第一个词块 | 已采集本次实例 | #419 第一个词块进入答案区，词库留下灰色占位，检查启用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 继续选词，形成部分答案 | 已采集本次实例 | #420 形成 She has；已等词块移动结束。；#421 形成 She has been 的部分答案。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 移除中间或最后一个已选词，再选回来 | 已采集本次实例 | #426 原 She has been 草稿保留，词库候选位置改变；两种模式各保留自己的草稿。；#427 答案剩 She been，后面的 been 前移。；#428 答案剩 been。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 撤回所有词块 | 已采集本次实例 | #429 答案清空，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 构造错误词序，并在提交前修改 | 部分已采集 | #426 原 She has been 草稿保留，词库候选位置改变；两种模式各保留自己的草稿。；#427 答案剩 She been，后面的 been 前移。；#428 答案剩 been。；#429 答案清空，检查禁用。；#430 开始构造漏词错误答案。；#431 部分答案 She has。；#432 部分答案 She has been。 已移除中间词、清空后重新排列；没有拖拽交换或全部排列测试。 |
| 9 | 有意给出错误答案并提交 | 已采集本次实例 | #436 完整草稿 She has been Paris with her boyfriend，缺少 to。；#437 红色纠错给出 She has been to Paris with her boyfriend.，to 被突出；原漏词答案保留并锁定。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #437 红色纠错给出 She has been to Paris with her boyfriend.，to 被突出；原漏词答案保留并锁定。；#438 先进入另一道英译中 I have loved you for a long time.，并未立刻重做巴黎题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #465 巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。；#466 重练的词库为空、候选位置改变，先前错误草稿未沿用。；#467 开始正确重答。；#474 正确译文完整，尚未提交。；#475 绿色正确反馈；同一道巴黎题完成从漏词到正确的重练。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #475 绿色正确反馈；同一道巴黎题完成从漏词到正确的重练。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 13 | 点击正确反馈后的推进入口 | 已采集本次实例 | #476 英国三年原题再次出现，词库空白。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 14 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |
| 15 | 检查键盘或可选播放入口（若存在） | 部分已采集 | #422 输入框首次为空，词块草稿没有自动转换为文本。；#423 形成文字草稿，检查可用。；#424 键盘草稿可编辑；这里只改末尾，没有验证中间字符选区。；#425 检查重新禁用。；#426 原 She has been 草稿保留，词库候选位置改变；两种模式各保留自己的草稿。 已测词库和键盘独立草稿；没有在本题键盘模式提交答案。 |

<a id="flow-E06"></a>
### E06 · 中译英：键入完整英语句子

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #445 空英语输入框，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #445 空英语输入框，检查禁用。；#477 重练输入框为空。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击输入框 | 部分已采集 | #445 空英语输入框，检查禁用。；#446 部分文字即可启用检查。 桌面文本框可输入；移动端软键盘未采集。 |
| 4 | 输入部分答案 | 已采集本次实例 | #446 部分文字即可启用检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 定位中间字符并修改，再清空 | 部分已采集 | #446 部分文字即可启用检查。；#447 故意把三年写为 ten years；未提交。 本题从部分文本改写整句；中间字符选区与清空见另一巴黎实例，未在本题完整重测。 |
| 6 | 输入拼写/空格/大小写差异并按需提交 | 部分已采集 | #463 故意保留 docter 拼写差异、小写开头且不加句号。；#464 绿色通过并提示“有错别字哦！”；显示 doctor 的正确写法。只证明本句组合条件被接受，不能推断所有拼写/大小写/标点均容错。 只核实docter、小写开头、无句号这一组合被接受；未分别穷举规则。 |
| 7 | 有意给出错误答案并提交 | 已采集本次实例 | #447 故意把三年写为 ten years；未提交。；#450 红色正确答案使用 three years，three 被突出；原 ten years 草稿保留，确认取消退出未丢失输入。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #450 红色正确答案使用 three years，three 被突出；原 ten years 草稿保留，确认取消退出未丢失输入。；#451 输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #476 英国三年原题再次出现，词库空白。；#477 重练输入框为空。；#478 将首次 ten 改为符合中文意义的 three。；#479 绿色正确，原题纠错完成。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #479 绿色正确，原题纠错完成。；#464 绿色通过并提示“有错别字哦！”；显示 doctor 的正确写法。只证明本句组合条件被接受，不能推断所有拼写/大小写/标点均容错。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 点击正确反馈后的推进入口 | 已采集本次实例 | #480 妈妈题再次出现，缺词空位为空。；#465 巴黎原题再次出现，键盘输入为空；本次没有观察到额外“错题重练”过场。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 打开退出入口，再取消退出 | 部分已采集 | #447 故意把三年写为 ten years；未提交。；#448 出现进度丢失确认，提供继续努力与退出。；#449 捕获弹层淡出中的一帧；不能据本帧宣称弹层已经完全消失。后续提交保留同一草稿。；#450 红色正确答案使用 three years，three 被突出；原 ten years 草稿保留，确认取消退出未丢失输入。 取消后可提交原草稿；449为淡出动画帧，未确认退出重进。 |

<a id="flow-E07"></a>
### E07 · 完成翻译：缺词与整句难度切换

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #451 输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #451 输入所缺单词：“妈妈一直都这么漂亮。”，Mom has always been ____ beautiful.；加大难度与禁用检查。；#457 检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击输入框 | 部分已采集 | #455 单个字母即可启用检查。 桌面短空位可输入；移动端软键盘未采集。 |
| 4 | 加大难度、减少难度，分别输入再切回 | 已采集本次实例 | #452 变为用英语写出这句话，整句输入框为空；出现减少难度。；#453 形成整句模式的部分草稿。；#454 回到缺词模式，空位仍空；整句草稿没有复制入空位。；#458 原整句草稿 Mom has always 保留。；#459 空位仍保持先前清空后的状态；两种难度分别保留草稿。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 输入部分答案 | 已采集本次实例 | #455 单个字母即可启用检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 定位中间字符并修改，再清空 | 部分已采集 | #455 单个字母即可启用检查。；#456 空位内容变成 so，尚未提交。；#457 检查禁用。 已追加末尾字符并清空；中间字符选区未测。 |
| 7 | 输入拼写/空格/大小写差异并按需提交 | 待实测；适用性也待核 | 分别记录被接受、容错提示或判错；不能从一个例子概括全部容错。 尚无对应中文连续操作证据。 |
| 8 | 有意给出错误答案并提交 | 已采集本次实例 | #460 准备故意错误答案。；#461 红色反馈给出 Mom has always been so beautiful.；错误 cold 保留并锁定。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #461 红色反馈给出 Mom has always been so beautiful.；错误 cold 保留并锁定。；#462 另一题“他一直都想要做一个医生。”；显示键盘输入模式。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #480 妈妈题再次出现，缺词空位为空。；#481 形成正确缺词草稿。；#482 绿色正确；空位锁定，继续可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #482 绿色正确；空位锁定，继续可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 点击正确反馈后的推进入口 | 已采集本次实例 | #483 进入单元结算，20经验、64%；时长提示含拍摄等待，不代表正常用时或学习效果。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 13 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E08"></a>
### E08 · 翻译题中的英语语音输入入口

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 开始录音 | 待实测；适用性也待核 | 入口、权限提示、录音中反馈；没有授权时在提示处停止。 尚无对应中文连续操作证据。 |
| 4 | 测试未收到声音的结果（获得许可后） | 待实测；适用性也待核 | 是否有超时、无声音提示和恢复入口；与答错区分。 尚无对应中文连续操作证据。 |
| 5 | 说出给定或自行组织的英语 | 待实测；适用性也待核 | 录音中、处理等待、识别完成状态；需要音频证据核对识别内容。 尚无对应中文连续操作证据。 |
| 6 | 说错或识别不成功后恢复 | 待实测；适用性也待核 | 错误/识别失败文案、重录、转键入或跳过的实际入口。 尚无对应中文连续操作证据。 |
| 7 | 通过提供的入口重试 | 待实测；适用性也待核 | 重录是否覆盖旧答案；再次识别后的结果。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E09"></a>
### E09 · 英语选词填空与中文意义反馈

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 选择一项但暂不提交 | 待实测；适用性也待核 | 选择前后边框、颜色、指示符和主按钮变化。 尚无对应中文连续操作证据。 |
| 4 | 换选另一项，再尝试取消当前选择 | 待实测；适用性也待核 | 旧选择是否解除、是否能回到空答案。 尚无对应中文连续操作证据。 |
| 5 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 7 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E10"></a>
### E10 · 英语图境辅助选词填空

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 选择一项但暂不提交 | 待实测；适用性也待核 | 选择前后边框、颜色、指示符和主按钮变化。 尚无对应中文连续操作证据。 |
| 4 | 换选另一项，再尝试取消当前选择 | 待实测；适用性也待核 | 旧选择是否解除、是否能回到空答案。 尚无对应中文连续操作证据。 |
| 5 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 7 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E11"></a>
### E11 · 英语段落阅读理解选择

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 选择一项但暂不提交 | 待实测；适用性也待核 | 选择前后边框、颜色、指示符和主按钮变化。 尚无对应中文连续操作证据。 |
| 4 | 换选另一项，再尝试取消当前选择 | 待实测；适用性也待核 | 旧选择是否解除、是否能回到空答案。 尚无对应中文连续操作证据。 |
| 5 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 7 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E12"></a>
### E12 · 阅读英语对话，选择合适的下一句

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #060 两个选项 Coffee, please. 和 Welcome.；检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #060 两个选项 Coffee, please. 和 Welcome.；检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 选择一项但暂不提交 | 已采集本次实例 | #061 蓝色选中；检查启用；角色空白气泡未直接填入答案。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 换选另一项，再尝试取消当前选择 | 部分已采集 | #062 蓝色选择转移，尚未判分。；#063 保留错误回答作为提交前证据。 已验证改选；未验证取消同一选项。 |
| 5 | 有意给出错误答案并提交 | 已采集本次实例 | #063 保留错误回答作为提交前证据。；#064 红心2变1；同时显示正确英文 Coffee, please. 与中文“咖啡，谢谢。”。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #064 红心2变1；同时显示正确英文 Coffee, please. 与中文“咖啡，谢谢。”。；#065 进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #131 原对话 Coffee or tea? 及两项原选项重现，带错题重练。；#132 正确回答变蓝，等待提交。；#133 绿色反馈，同时给中文意思，连对5题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #133 绿色反馈，同时给中文意思，连对5题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 点击正确反馈后的推进入口 | 已采集本次实例 | #134 之前被普通跳过的 coffee 翻译题重现，带错题重练。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E13"></a>
### E13 · 听英语，用英语词块拼出内容

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #065 进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 播放、重播与慢速播放（按实际入口） | 部分已采集 | #070 保留点击后的播放控件画面；没有保存音轨，不能证明声音正常或播放持续时间。；#071 保留慢速入口点击后的画面；音频速度与声音质量未另行听验。 只记录按钮操作；没有音轨证据，未听验声音质量与速度。 |
| 3 | 保持空答案，检查提交入口 | 已采集本次实例 | #065 进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。；#078 词块答案清空，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 选择第一个词块 | 已采集本次实例 | #072 please 进入答案区，检查启用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 继续选词，形成部分答案 | 已采集本次实例 | #079 两个词块进入答案区；不代表必须使用全部词块。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 移除中间或最后一个已选词，再选回来 | 部分已采集 | #077 先前的 please 词块草稿恢复；两个输入模式各有草稿。；#078 词块答案清空，检查禁用。 验证撤回一个词；多词中间位置移除待补。 |
| 7 | 撤回所有词块 | 已采集本次实例 | #078 词块答案清空，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 构造错误词序，并在提交前修改 | 待实测；适用性也待核 | 是否只能逐个撤回、能否直接换位置；只记录实际支持的方式。 尚无对应中文连续操作证据。 |
| 9 | 有意给出错误答案并提交 | 已采集本次实例 | #402 形成词块草稿、检查可用；即时帧含词块移动动画，不作为稳定排列图。；#403 红色纠错给出 in the same place 及中文在同样的地方；词块草稿保留并锁定。音轨未听验。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #403 红色纠错给出 in the same place 及中文在同样的地方；词块草稿保留并锁定。音轨未听验。；#404 英译中 She has worked as a server for five years.，空答案及中文词库。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 12 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 13 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 14 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |
| 15 | 检查键盘或可选播放入口（若存在） | 已采集本次实例 | #072 please 进入答案区，检查启用。；#073 标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。；#077 先前的 please 词块草稿恢复；两个输入模式各有草稿。；#080 Tea, please. 文本草稿仍保留。 仅支持本次实例，其他条件仍受整体边界限制。 |

<a id="flow-E14"></a>
### E14 · 听英语内容，选择对应中文解释

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #411 先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #411 先听后答：“他们在…”；三个中文解释，普通/慢速回放，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 首次播放音频，再重播 | 待实测；适用性也待核 | 播放中和停止后的按钮状态；声音另行听验，截图不能证明声音正常。 尚无对应中文连续操作证据。 |
| 4 | 操作慢速播放（若存在） | 待实测；适用性也待核 | 切换控件与播放状态；无入口则标不适用。 尚无对应中文连续操作证据。 |
| 5 | 选择答案，再改选 | 已采集本次实例 | #412 第一项蓝色选中，检查启用。；#413 蓝色选择转移，旧项解除，尚未提交。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 打开不做听力/跳过入口（若存在） | 待实测；适用性也待核 | 真实提示、替代题或跳题结果，是否影响本课后续听力。 尚无对应中文连续操作证据。 |
| 7 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 8 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 9 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 10 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #414 第二项被判正确，绿色反馈；本题没有采到错误分支，未听验原音轨。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 点击正确反馈后的推进入口 | 已采集本次实例 | #415 进入另一道词块听写；不是第401图的同一音频题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E15"></a>
### E15 · 英语朗读：录音、未通过提示与跳过

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #235 进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #235 进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 开始录音 | 部分已采集 | #236 录音条变为波形界面，示范播放禁用；未提供可核对的口述音轨，波形不证明录音或识别质量。 仅见波形界面；原生授权与实际收音情况未核。 |
| 4 | 测试未收到声音的结果（获得许可后） | 部分已采集 | #237 捕获黄色瞬时提示：呃～听起来不太对哦，再试一次吧；随后重新出现录音入口。未判断原因是无声、设备还是发音。 停止后出现未通过提示；没有音轨，不能判定原因是无声还是发音。 |
| 5 | 说出给定或自行组织的英语 | 待实测；适用性也待核 | 录音中、处理等待、识别完成状态；需要音频证据核对识别内容。 尚无对应中文连续操作证据。 |
| 6 | 说错或识别不成功后恢复 | 部分已采集 | #237 捕获黄色瞬时提示：呃～听起来不太对哦，再试一次吧；随后重新出现录音入口。未判断原因是无声、设备还是发音。；#238 出现黄色跳过状态，录音入口禁用，文案却是发音好棒哦；此操作没有成功朗读，不能解释成识别正确。 未通过提示与跳过已实测；没有重录成功。 |
| 7 | 通过提供的入口重试 | 待实测；适用性也待核 | 重录是否覆盖旧答案；再次识别后的结果。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E16"></a>
### E16 · 理解英语问题并说出正确回应

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 开始录音 | 待实测；适用性也待核 | 入口、权限提示、录音中反馈；没有授权时在提示处停止。 尚无对应中文连续操作证据。 |
| 4 | 测试未收到声音的结果（获得许可后） | 待实测；适用性也待核 | 是否有超时、无声音提示和恢复入口；与答错区分。 尚无对应中文连续操作证据。 |
| 5 | 说出给定或自行组织的英语 | 待实测；适用性也待核 | 录音中、处理等待、识别完成状态；需要音频证据核对识别内容。 尚无对应中文连续操作证据。 |
| 6 | 说错或识别不成功后恢复 | 待实测；适用性也待核 | 错误/识别失败文案、重录、转键入或跳过的实际入口。 尚无对应中文连续操作证据。 |
| 7 | 通过提供的入口重试 | 待实测；适用性也待核 | 重录是否覆盖旧答案；再次识别后的结果。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E17"></a>
### E17 · 英语近音词二选一听辨

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #201 出现你听到了什么、dock/deck 两选项、大播放按钮；检查禁用，题页顶部没有红心显示。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #201 出现你听到了什么、dock/deck 两选项、大播放按钮；检查禁用，题页顶部没有红心显示。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 首次播放音频，再重播 | 部分已采集 | #217 仍显示错误反馈，播放入口可点击；原音轨与播放质量没有保存验证。 只验证错误反馈页仍可点播放；未听验。 |
| 4 | 操作慢速播放（若存在） | 待实测；适用性也待核 | 切换控件与播放状态；无入口则标不适用。 尚无对应中文连续操作证据。 |
| 5 | 选择答案，再改选 | 已采集本次实例 | #202 dock 变蓝；这张即时帧的检查仍灰色，不能拿它证明已完成按钮过渡。；#203 选择转移到 deck；此时检查为绿色。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 打开不做听力/跳过入口（若存在） | 待实测；适用性也待核 | 真实提示、替代题或跳题结果，是否影响本课后续听力。 尚无对应中文连续操作证据。 |
| 7 | 有意给出错误答案并提交 | 已采集本次实例 | #215 get 变蓝，等待提交。；#216 此次 get 被判错，红色提示还不太准确，再多听几次吧；选项锁定，未列出正确词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #217 仍显示错误反馈，播放入口可点击；原音轨与播放质量没有保存验证。；#218 进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 继续本课，检查原题何时再次出现 | 部分已采集 | #251 回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。；#252 此轮 got 为提交草稿。；#253 got 实际被判正确；只确认此次结果，不凭文字相同断言是原音轨重练。 课末同组选项再现；没有音轨身份核验，不证明同音同题重练。 |
| 10 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #204 本题实际正确，dock 与底部反馈变绿；提供太简单、太难、报错。；#253 got 实际被判正确；只确认此次结果，不凭文字相同断言是原音轨重练。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 点击正确反馈后的推进入口 | 已采集本次实例 | #205 新题选项为 got/get；不能把相同标题当成同一条音频。；#254 再次进入声音同异题；作答前英语词形隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E18"></a>
### E18 · 听两个英语声音，判断词语相同或不同

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #218 进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #218 进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 首次播放音频，再重播 | 部分已采集 | #223 保留点击后按钮画面；没有据此宣称声音正常。；#224 两个声音可以分别触发；这不是语音输入。 两入口均可点击；音轨质量未核。 |
| 4 | 操作慢速播放（若存在） | 待实测；适用性也待核 | 切换控件与播放状态；无入口则标不适用。 尚无对应中文连续操作证据。 |
| 5 | 选择答案，再改选 | 已采集本次实例 | #219 第一项蓝色选中，检查启用。；#220 蓝色选择转移，单词仍隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 打开不做听力/跳过入口（若存在） | 已采集本次实例 | #233 转到另一道声音同异题，不是在原题原位修改。；#234 底部是黄色反馈和继续，显示 get/get 及音标；尽管文案为看，多练几次真的有用吧，不能把跳过算正确作答。；#235 进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 有意给出错误答案并提交 | 已采集本次实例 | #231 作答草稿为同一个词。；#232 实际判错；揭晓 got 与 get 及两者音标，红色反馈；选项锁定。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #232 实际判错；揭晓 got 与 get 及两者音标，红色反馈；选项锁定。；#233 转到另一道声音同异题，不是在原题原位修改。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 继续本课，检查原题何时再次出现 | 部分已采集 | #254 再次进入声音同异题；作答前英语词形隐藏。；#255 保留作答草稿，准备检查。；#256 实际正确，显示 got/get 与音标；对应词对与之前错误实例一致，但没有核对原音轨一致性。 同一词对再现；没有音轨身份核验，不证明同音同题重练。 |
| 10 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #221 实际正确；播放位置显示 deck 与 dock，底部补出单词及音标。；#226 实际正确；两个位置显示 get，底部为 get 及音标。；#256 实际正确，显示 got/get 与音标；对应词对与之前错误实例一致，但没有核对原音轨一致性。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 点击正确反馈后的推进入口 | 已采集本次实例 | #222 进入下一道声音同异题，两词再次隐藏。；#257 发音专项实际进入单元完成页；本次研究采集显示11经验、83%，不代表听说能力或正常学习成效。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 12 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E19"></a>
### E19 · 听英语声音，配对英语书面词

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #239 进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 播放、重播与慢速播放（按实际入口） | 部分已采集 | #240 音频卡出现蓝色高亮，还未形成配对。 实际点击播放；无音轨听验，未见慢速入口但未据此排除其他版本。 |
| 3 | 保持空答案，检查提交入口 | 已采集本次实例 | #239 进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点左侧或右侧的一张卡 | 已采集本次实例 | #240 音频卡出现蓝色高亮，还未形成配对。；#245 右列也能先选，文字出现蓝色高亮。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 点同一卡或同列另一卡 | 待实测；适用性也待核 | 取消/换选规则，以及高亮如何改变。 尚无对应中文连续操作证据。 |
| 6 | 选一个不匹配的另一侧项目 | 已采集本次实例 | #241 第1声音与 deck 短暂标红；错误局限于当前一对，题页未显示红心。；#242 仍在原题；错误对恢复可选，可以重新配对。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 错误后再选一对正确项目 | 已采集本次实例 | #242 仍在原题；错误对恢复可选，可以重新配对。；#243 这对短暂变绿，实际配对正确。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 配对正确，但不完成全部 | 已采集本次实例 | #243 这对短暂变绿，实际配对正确。；#244 第1声音和 got 变浅并禁用，其他项目仍可操作。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 完成所有剩余配对 | 已采集本次实例 | #249 该对变绿，前三对已完成。；#250 所有项目禁用，自动出现绿色正确与继续；没有点击检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 点击推进入口 | 已采集本次实例 | #251 回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 已配对状态是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-E20"></a>
### E20 · 听英语，配对中文词义

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 播放、重播与慢速播放（按实际入口） | 待实测；适用性也待核 | 控件操作截图与声音证据分开记录，截图不能证明声音正常。 尚无对应中文连续操作证据。 |
| 3 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 4 | 点左侧或右侧的一张卡 | 待实测；适用性也待核 | 单边选中态；是否允许两种起始方向。 尚无对应中文连续操作证据。 |
| 5 | 点同一卡或同列另一卡 | 待实测；适用性也待核 | 取消/换选规则，以及高亮如何改变。 尚无对应中文连续操作证据。 |
| 6 | 选一个不匹配的另一侧项目 | 待实测；适用性也待核 | 错误刚出现的反馈、反馈稳定后状态；是否扣资源、是否自动解除选择。 尚无对应中文连续操作证据。 |
| 7 | 错误后再选一对正确项目 | 待实测；适用性也待核 | 哪些项目仍可操作，是否保留上次选择。 尚无对应中文连续操作证据。 |
| 8 | 配对正确，但不完成全部 | 待实测；适用性也待核 | 正确颜色、禁用/消失、后续可选项目。 尚无对应中文连续操作证据。 |
| 9 | 完成所有剩余配对 | 待实测；适用性也待核 | 是否自动判分、是否还有检查按钮、完成反馈与推进入口。 尚无对应中文连续操作证据。 |
| 10 | 点击推进入口 | 待实测；适用性也待核 | 实际下一题或结算画面。 尚无对应中文连续操作证据。 |
| 11 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 已配对状态是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-E21"></a>
### E21 · 按中文意义，看图选择英语词

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #010 三张图卡尚未选中；检查为灰色，红心为5。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #010 三张图卡尚未选中；检查为灰色，红心为5。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 选择一项但暂不提交 | 已采集本次实例 | #011 coffee 变蓝；检查变绿；尚未判定正确与否。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 换选另一项，再尝试取消当前选择 | 已采集本次实例 | #012 tea 变蓝，coffee 恢复；维持单选。；#013 tea 仍选中；重复点击未回到空答案。；#014 sugar 变蓝；这是错误草稿，还没有判错。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 有意给出错误答案并提交 | 已采集本次实例 | #014 sugar 变蓝；这是错误草稿，还没有判错。；#015 红心5变4；首次错误说明弹层遮住题目，底部已出现红色答案反馈。；#016 显示“正确答案：tea”；选项已锁定，底部红色继续。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #016 显示“正确答案：tea”；选项已锁定，底部红色继续。；#017 进入下一道文字选词题“茶”；不是在原看图题内编辑。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #120 出现“复习一下之前你不太熟练的部分”过场；不是一道新题。；#121 同一“哪个是茶”与原三个选项重现，带错题重练标签。；#122 重新选择，未沿用第一次的错误答案。；#123 同题答对，tea变绿，显示绿色继续。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #123 同题答对，tea变绿，显示绿色继续。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 点击正确反馈后的推进入口 | 已采集本次实例 | #124 原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E22"></a>
### E22 · 听英语，键入英语词句

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #073 标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 播放、重播与慢速播放（按实际入口） | 部分已采集 | #070 保留点击后的播放控件画面；没有保存音轨，不能证明声音正常或播放持续时间。；#071 保留慢速入口点击后的画面；音频速度与声音质量未另行听验。 与词库同题的播放按钮已点击；没有音轨证据。 |
| 3 | 保持空答案，检查提交入口 | 已采集本次实例 | #073 标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。；#075 显示占位文字，检查再次禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击输入框 | 部分已采集 | #073 标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。；#074 输入框出现草稿；检查启用。 桌面输入可用；未采移动端软键盘、光标特写。 |
| 5 | 输入部分答案 | 部分已采集 | #074 输入框出现草稿；检查启用。 输入 coffee 后检查可用；逐字符阈值未穷举。 |
| 6 | 定位中间字符并修改，再清空 | 部分已采集 | #074 输入框出现草稿；检查启用。；#075 显示占位文字，检查再次禁用。；#076 形成新的未提交草稿；此时尚无正确判断。 已验证整框清空和重填；中间字符选区修改未测试。 |
| 7 | 输入拼写/空格/大小写差异并按需提交 | 待实测；适用性也待核 | 分别记录被接受、容错提示或判错；不能从一个例子概括全部容错。 尚无对应中文连续操作证据。 |
| 8 | 有意给出错误答案并提交 | 已采集本次实例 | #080 Tea, please. 文本草稿仍保留。；#081 实际判错，正确答案为 tea；红心归零，弹出本次入门课的免费补心提示。；#082 红心恢复为5；仍停在错误反馈页，原文本锁定，显示英文 tea 与中文茶。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #082 红心恢复为5；仍停在错误反馈页，原文本锁定，显示英文 tea 与中文茶。；#083 进入新的对话 Tea or coffee?；听写不能原位编辑。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 11 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 12 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 13 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-E23"></a>
### E23 · 按中文词义，选择对应英语词

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #017 进入下一道文字选词题“茶”；不是在原看图题内编辑。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #017 进入下一道文字选词题“茶”；不是在原看图题内编辑。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 选择一项但暂不提交 | 已采集本次实例 | #020 coffee 变蓝；检查可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 换选另一项，再尝试取消当前选择 | 部分已采集 | #021 选中状态从 coffee 转移到 tea。；#022 hot 为当前蓝色选项；尚未判错。 已验证改选；未验证再次点击同一文字选项能否取消。 |
| 5 | 有意给出错误答案并提交 | 已采集本次实例 | #022 hot 为当前蓝色选项；尚未判错。；#023 显示正确答案 tea，原选项锁定；红心4变3。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 已采集本次实例 | #023 显示正确答案 tea，原选项锁定；红心4变3。；#024 切换到新的看图题“哪个是咖啡”。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 继续本课，检查原题何时再次出现 | 已采集本次实例 | #124 原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。；#125 重练题的正确选项变蓝，等待提交。；#126 同题绿色反馈，标记连对3题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 提交正确答案，或完成自动判分操作 | 已采集本次实例 | #126 同题绿色反馈，标记连对3题。；#037 coffee 变绿，显示你太棒了和连对2题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 点击正确反馈后的推进入口 | 已采集本次实例 | #127 显示鼓励过场“你的辛勤付出得到了回报！”；本帧不是welcome题。；#038 进入英译中词块题 welcome；首次提示可悬停查看词义。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 打开退出入口，再取消退出 | 已采集本次实例 | #034 蓝色选中 coffee，尚未提交。；#035 弹出“现在离开的话，你的进度就没了”；提供继续努力与退出。；#036 返回原题，coffee 的选择仍保留。 仅支持本次实例，其他条件仍受整体边界限制。 |

<a id="flow-S01"></a>
### S01 · 故事阅读理解：字面意义、意图与总结

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #307 出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #307 出现“等等！司机刚说的是……”和三个中文选项；上下文可读，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击一个候选，观察是否立即判分 | 已采集本次实例 | #308 立即标红并出现叉号，无需点击检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击错误候选 | 已采集本次实例 | #308 立即标红并出现叉号，无需点击检查。；#310 第二个错误项立即标红，第一项保持灰色。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 等待错误反馈稳定 | 已采集本次实例 | #309 错误项变灰并禁用，另外两项仍可选；继续仍禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在同题选择另一个候选 | 已采集本次实例 | #310 第二个错误项立即标红，第一项保持灰色。；#311 正确项变绿，继续启用；此帧是即时结果，底部反馈动画尚未完整出现。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选择正确项 | 已采集本次实例 | #311 正确项变绿，继续启用；此帧是即时结果，底部反馈动画尚未完整出现。；#324 立即绿色正确反馈；这是语用理解的独立题，不与第307图拼成同一题。；#345 立即绿色正确；这是结尾总结题的独立实例。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 按实际方式推进 | 已采集本次实例 | #312 原题收起，新增 The directions on my phone say that road is faster…；已实际推进。；#325 司机答应 OK, OK.；上道题已经推进。；#346 出现五组中英词语配对；保留上文，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 打开退出并取消 | 待实测；适用性也待核 | 确认信息、恢复后当前选择是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-S02"></a>
### S02 · 故事词义定位：按中文意义点英语片段

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #313 出现“哪一个选项的意思是导航指示？”；原句被拆成可选英语片段，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #313 出现“哪一个选项的意思是导航指示？”；原句被拆成可选英语片段，继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击一个候选，观察是否立即判分 | 已采集本次实例 | #314 该片段立即标红，未获得继续资格。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击错误候选 | 已采集本次实例 | #314 该片段立即标红，未获得继续资格。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 等待错误反馈稳定 | 已采集本次实例 | #315 road 变灰禁用，其余片段可选；没有重新打开整道题。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在同题选择另一个候选 | 已采集本次实例 | #316 正确片段变绿，所有片段锁定，继续可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选择正确项 | 已采集本次实例 | #316 正确片段变绿，所有片段锁定，继续可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 按实际方式推进 | 已采集本次实例 | #319 新增司机说他认识本城所有道路的英文台词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 打开退出并取消 | 已采集本次实例 | #317 出现“现在离开的话，你的进度就没了”，提供继续努力与退出。；#318 弹层关闭，原正确片段仍保留，未清空答案。 仅支持本次实例，其他条件仍受整体边界限制。 |

<a id="flow-S03"></a>
### S03 · 故事末尾开放写作

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 阅读情境与问题，查看提示（若存在） | 待实测；适用性也待核 | 完整上下文、作答限制和提示开启/关闭状态。 尚无对应中文连续操作证据。 |
| 4 | 输入部分回答，修改后提交 | 待实测；适用性也待核 | 文本编辑、长度要求、发送/检查按钮的变化。 尚无对应中文连续操作证据。 |
| 5 | 提交不满足任务的回答（若允许） | 待实测；适用性也待核 | 是否给语义建议、要求补写、拒收或判错；不强套单选题红绿反馈。 尚无对应中文连续操作证据。 |
| 6 | 根据反馈修改并再次提交（若提供） | 待实测；适用性也待核 | 反馈与原文如何对应、是否保留旧答案、修改后的结果。 尚无对应中文连续操作证据。 |
| 7 | 完成任务并继续 | 待实测；适用性也待核 | 评价或总结、是否能回看、实际下一页。 尚无对应中文连续操作证据。 |
| 8 | 退出并重进（若可安全恢复） | 待实测；适用性也待核 | 草稿与对话是否保留、丢弃确认。 尚无对应中文连续操作证据。 |

<a id="flow-S04"></a>
### S04 · 故事短语补全：带回放的缺句选择

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #328 “选择短语”：No, ____ . Why?，旁有回放，三个英语短语候选；作答前缺失片段不可见。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #328 “选择短语”：No, ____ . Why?，旁有回放，三个英语短语候选；作答前缺失片段不可见。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击一个候选，观察是否立即判分 | 已采集本次实例 | #329 片段立即标红；不需要检查按钮。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击错误候选 | 已采集本次实例 | #329 片段立即标红；不需要检查按钮。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 等待错误反馈稳定 | 已采集本次实例 | #330 错误候选变灰，空位仍在，其他候选可选。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在同题选择另一个候选 | 已采集本次实例 | #331 候选变绿，整句补全 No, I'm going shopping. Why?；继续启用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选择正确项 | 已采集本次实例 | #331 候选变绿，整句补全 No, I'm going shopping. Why?；继续启用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 按实际方式推进 | 已采集本次实例 | #332 司机说道路止于河边，已推进到后文。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 打开退出并取消 | 待实测；适用性也待核 | 确认信息、恢复后当前选择是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-S05"></a>
### S05 · 故事听音重组：逐片段接受正确前缀

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #334 “重组听到的句子”：气泡文字隐藏，三个片段 are wrong / directions / I think my；继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #334 “重组听到的句子”：气泡文字隐藏，三个片段 are wrong / directions / I think my；继续禁用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点错误位置的片段 | 已采集本次实例 | #335 错误片段标红，但没有插入答案区。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 等待错误反馈结束 | 已采集本次实例 | #336 are wrong 恢复可选；与故事词义选择的错误项永久变灰不同。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 选择正确前缀 | 已采集本次实例 | #337 接受正确前缀并在气泡中显示，对应按钮禁用；其余片段仍可选。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 已有前缀后选择错误片段 | 已采集本次实例 | #338 当前片段标红，已经接受的 I think my 保留。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 继续选正确片段 | 已采集本次实例 | #339 气泡增加 directions，已用片段禁用，只剩 are wrong 可用。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 补全最后片段 | 已采集本次实例 | #340 整句 I think my directions are wrong. 出现，自动绿色反馈与继续；每个片段即时判定。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 点击继续 | 已采集本次实例 | #341 新增 I'm so sorry.，重组题已推进。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 重播音频 | 待实测；适用性也待核 | 画面与声音质量分开核对。 尚无对应中文连续操作证据。 |
| 11 | 打开退出并取消 | 待实测；适用性也待核 | 正确前缀是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-R01"></a>
### R01 · Radio：找出听到的两个英语单词

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #523 选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #523 选择你听到的2个单词：class/favorite/boring。此前尝试暂停时题目已经覆盖控件，点击未成功；此图不是暂停成功证据。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击错误词 | 已采集本次实例 | #524 该词立即变红；不是先选满两项再统一判分。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 等待错误状态稳定 | 已采集本次实例 | #525 boring 变灰禁用，其余两个词仍可点。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 找到一个正确词 | 已采集本次实例 | #526 第一个正确词即时变绿，尚未完成两词要求。；#527 class 保持绿色锁定，favorite 仍可点，未自动进入下一段。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 完成要求的两个词 | 已采集本次实例 | #527 class 保持绿色锁定，favorite 仍可点，未自动进入下一段。；#528 两词都绿，任务达到要求数量后自动推进。；#529 “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选齐目标词 | 已采集本次实例 | #528 两词都绿，任务达到要求数量后自动推进。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 等待实际下一段 | 已采集本次实例 | #529 “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 重播问题音频 | 待实测；适用性也待核 | 按钮变化与听验分别记录。 尚无对应中文连续操作证据。 |
| 10 | 退出后取消 | 待实测；适用性也待核 | 已完成词是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-R02"></a>
### R02 · Radio：英语声音配中文释义

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #502 莉莉演播室上方为进度和无限红心；下方选择配对，四个声音与年、学校、图片、法语。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 播放、重播与慢速播放（按实际入口） | 部分已采集 | #503 左侧音频蓝色选中，尚未配对。 只操作声音按钮，未保存音轨或听验；没有慢速操作证据。 |
| 3 | 保持空答案，检查提交入口 | 已采集本次实例 | #502 莉莉演播室上方为进度和无限红心；下方选择配对，四个声音与年、学校、图片、法语。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点左侧或右侧的一张卡 | 已采集本次实例 | #503 左侧音频蓝色选中，尚未配对。；#509 中文选项蓝色高亮，证实可从右列开始。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 点同一卡或同列另一卡 | 待实测；适用性也待核 | 取消/换选规则，以及高亮如何改变。 尚无对应中文连续操作证据。 |
| 6 | 选一个不匹配的另一侧项目 | 已采集本次实例 | #507 错误对立即红色，已完成 year 保留。；#508 错误对恢复可选；仍在同一题，不用重新进入。；#510 该配对也错误，学校与声音2标红。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 错误后再选一对正确项目 | 已采集本次实例 | #508 错误对恢复可选；仍在同一题，不用重新进入。；#511 绿色正确，并揭示 French。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 配对正确，但不完成全部 | 已采集本次实例 | #504 配对正确变绿，声音卡揭示英语拼写 year。；#505 year/年变浅禁用，其他三对仍可选。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 完成所有剩余配对 | 已采集本次实例 | #514 正确并揭示 pictures。；#515 单边蓝色高亮，之前配对保留。；#516 最后一对正确并揭示 school，进度开始推进；没有检查或继续按钮。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 10 | 点击推进入口 | 已采集本次实例 | #517 配对区域消失，恢复角色对话播放，底部回退5秒/暂停/前进控件；本帧前进为灰色。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 11 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 已配对状态是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-R03"></a>
### R03 · Radio：判断中文陈述与英语内容是否一致

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #518 “她去年在学校学习了西班牙语。”；音频波形与勾/叉二选一，作答前英文句子隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #518 “她去年在学校学习了西班牙语。”；音频波形与勾/叉二选一，作答前英文句子隐藏。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击一个候选，观察是否立即判分 | 已采集本次实例 | #519 立即标红，揭示 I learned French at school last year.，帮助比对 French 与西班牙语。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击错误候选 | 已采集本次实例 | #519 立即标红，揭示 I learned French at school last year.，帮助比对 French 与西班牙语。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 等待错误反馈稳定 | 已采集本次实例 | #520 勾选项变灰禁用；叉仍可点，英文句子保留。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在同题选择另一个候选 | 已采集本次实例 | #521 绿色正确，进度推进；不需要再点检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选择正确项 | 已采集本次实例 | #521 绿色正确，进度推进；不需要再点检查。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 按实际方式推进 | 已采集本次实例 | #522 问题收起，恢复角色对话与播放控件。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 打开退出并取消 | 待实测；适用性也待核 | 确认信息、恢复后当前选择是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-R04"></a>
### R04 · Radio 听音选择图片

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 首次播放音频，再重播 | 待实测；适用性也待核 | 播放中和停止后的按钮状态；声音另行听验，截图不能证明声音正常。 尚无对应中文连续操作证据。 |
| 4 | 操作慢速播放（若存在） | 待实测；适用性也待核 | 切换控件与播放状态；无入口则标不适用。 尚无对应中文连续操作证据。 |
| 5 | 选择答案，再改选 | 待实测；适用性也待核 | 单选/多选规则、要求数量与主按钮是否可用。 尚无对应中文连续操作证据。 |
| 6 | 打开不做听力/跳过入口（若存在） | 待实测；适用性也待核 | 真实提示、替代题或跳题结果，是否影响本课后续听力。 尚无对应中文连续操作证据。 |
| 7 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 8 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 9 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 10 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 11 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 12 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-R05"></a>
### R05 · Radio：中文选项核对节目内容

已取得操作原图，未穷举所有条件分支；具体缺项见下表。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 已采集本次实例 | #529 “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 2 | 保持空答案，检查提交入口 | 已采集本次实例 | #529 “她喜欢学习”，候选“关于新地方/关于旧地方”；本屏不展示完整英语台词。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 3 | 点击一个候选，观察是否立即判分 | 已采集本次实例 | #530 即时标红。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 4 | 点击错误候选 | 已采集本次实例 | #530 即时标红。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 5 | 等待错误反馈稳定 | 已采集本次实例 | #531 错误候选变灰禁用，另一选项可点。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 6 | 在同题选择另一个候选 | 已采集本次实例 | #532 绿色正确，进度推进。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 7 | 选择正确项 | 已采集本次实例 | #532 绿色正确，进度推进。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 8 | 按实际方式推进 | 已采集本次实例 | #533 问题收起并继续播放，进度到末端；尚非结算画面。；#534 实际结算显示30经验、0%，并提供查看文本；本次每类任务都有试错，数值不能当作学习成效。 仅支持本次实例，其他条件仍受整体边界限制。 |
| 9 | 打开退出并取消 | 待实测；适用性也待核 | 确认信息、恢复后当前选择是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-A01"></a>
### A01 · Adventures 场景探索/点物/读标牌

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 点击可走区域，再点不可交互区域 | 待实测；适用性也待核 | 移动/无反应反馈与边界；不能把无语言判分的走动算答对。 尚无对应中文连续操作证据。 |
| 3 | 点击物体或标牌 | 待实测；适用性也待核 | 高亮、文字提示、关闭与重开。 尚无对应中文连续操作证据。 |
| 4 | 触发角色对话，再返回场景 | 待实测；适用性也待核 | 场景与对话切换、目标是否更新；回应判分另见 A02。 尚无对应中文连续操作证据。 |
| 5 | 退出并返回场景（若提供） | 待实测；适用性也待核 | 位置、目标与已触发事件是否保留。 尚无对应中文连续操作证据。 |

<a id="flow-A02"></a>
### A02 · Adventures 英语回应选择

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 选择一项但暂不提交 | 待实测；适用性也待核 | 选择前后边框、颜色、指示符和主按钮变化。 尚无对应中文连续操作证据。 |
| 4 | 换选另一项，再尝试取消当前选择 | 待实测；适用性也待核 | 旧选择是否解除、是否能回到空答案。 尚无对应中文连续操作证据。 |
| 5 | 有意给出错误答案并提交 | 待实测；适用性也待核 | 记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。 尚无对应中文连续操作证据。 |
| 6 | 在错误反馈中尝试编辑，再使用可见推进入口 | 待实测；适用性也待核 | 是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。 尚无对应中文连续操作证据。 |
| 7 | 继续本课，检查原题何时再次出现 | 待实测；适用性也待核 | 保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。 尚无对应中文连续操作证据。 |
| 8 | 提交正确答案，或完成自动判分操作 | 待实测；适用性也待核 | 正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。 尚无对应中文连续操作证据。 |
| 9 | 点击正确反馈后的推进入口 | 待实测；适用性也待核 | 截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。 尚无对应中文连续操作证据。 |
| 10 | 打开退出入口，再取消退出 | 待实测；适用性也待核 | 退出提示、取消后答案是否保留；没有确认框也需记录实际去向。 尚无对应中文连续操作证据。 |

<a id="flow-M01"></a>
### M01 · Roleplay 英语多轮文字情境聊天（中文覆盖待核）

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 保持空答案，检查提交入口 | 待实测；适用性也待核 | 按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。 尚无对应中文连续操作证据。 |
| 3 | 阅读情境与问题，查看提示（若存在） | 待实测；适用性也待核 | 完整上下文、作答限制和提示开启/关闭状态。 尚无对应中文连续操作证据。 |
| 4 | 输入部分回答，修改后提交 | 待实测；适用性也待核 | 文本编辑、长度要求、发送/检查按钮的变化。 尚无对应中文连续操作证据。 |
| 5 | 提交不满足任务的回答（若允许） | 待实测；适用性也待核 | 是否给语义建议、要求补写、拒收或判错；不强套单选题红绿反馈。 尚无对应中文连续操作证据。 |
| 6 | 根据反馈修改并再次提交（若提供） | 待实测；适用性也待核 | 反馈与原文如何对应、是否保留旧答案、修改后的结果。 尚无对应中文连续操作证据。 |
| 7 | 完成任务并继续 | 待实测；适用性也待核 | 评价或总结、是否能回看、实际下一页。 尚无对应中文连续操作证据。 |
| 8 | 退出并重进（若可安全恢复） | 待实测；适用性也待核 | 草稿与对话是否保留、丢弃确认。 尚无对应中文连续操作证据。 |

<a id="flow-M02"></a>
### M02 · Video Call with Lily 英语自由对话

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 进入通话前说明，再启动 | 待实测；适用性也待核 | 情境、目标、权限、连接中与接通画面。 尚无对应中文连续操作证据。 |
| 3 | 完成一轮听与说 | 待实测；适用性也待核 | 角色发言、用户轮次、字幕/提示、等待识别状态。 尚无对应中文连续操作证据。 |
| 4 | 请求重复或未能回答时继续 | 待实测；适用性也待核 | 如何澄清、提示或追问；不假定存在固定判错。 尚无对应中文连续操作证据。 |
| 5 | 处理中断或未识别情况 | 待实测；适用性也待核 | 重连/重录/退出的实际入口；真实故障无法安全复现时记录缺口。 尚无对应中文连续操作证据。 |
| 6 | 结束通话并查看结果 | 待实测；适用性也待核 | 总结、转录、建议、下一步及回看入口。 尚无对应中文连续操作证据。 |

<a id="flow-M03"></a>
### M03 · Video Call with Falstaff 英语引导对话

本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。

| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |
| --- | --- | --- | --- |
| 1 | 进入题目，暂不作答 | 待实测；适用性也待核 | 完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。 尚无对应中文连续操作证据。 |
| 2 | 进入通话前说明，再启动 | 待实测；适用性也待核 | 情境、目标、权限、连接中与接通画面。 尚无对应中文连续操作证据。 |
| 3 | 完成一轮听与说 | 待实测；适用性也待核 | 角色发言、用户轮次、字幕/提示、等待识别状态。 尚无对应中文连续操作证据。 |
| 4 | 请求重复或未能回答时继续 | 待实测；适用性也待核 | 如何澄清、提示或追问；不假定存在固定判错。 尚无对应中文连续操作证据。 |
| 5 | 处理中断或未识别情况 | 待实测；适用性也待核 | 重连/重录/退出的实际入口；真实故障无法安全复现时记录缺口。 尚无对应中文连续操作证据。 |
| 6 | 结束通话并查看结果 | 待实测；适用性也待核 | 总结、转录、建议、下一步及回看入口。 尚无对应中文连续操作证据。 |
