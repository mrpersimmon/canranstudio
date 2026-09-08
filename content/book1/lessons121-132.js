'use strict';
// Supplied Book 1 PDF pp.279–302. Original English; authored Chinese and exercises.
module.exports=[
{lesson:121,title:'The man in a hat',evenTitle:'Who (whom), which and that',scene:'man-in-hat',label:'戴上帽子就认出来了',goal:'用定语从句准确说明是哪一个人或物',focusAlternatives:{0:['that'],4:['that']},translationAlternatives:{1:['This is the book that I bought yesterday.','This is the book I bought yesterday.'],3:['He is the man that came here last week.'],5:['These are the things that I bought.','These are the things I bought.']},lines:`
customer|I bought two expensive dictionaries here half an hour ago, but I forgot to take them with me.|半小时前我在这里买了两本很贵的词典，但忘了带走。
manager|Who served you, sir?|先生，谁接待的您？
customer|The lady who is standing behind the counter.|站在柜台后面的那位女士。
manager|Which books did you buy?|您买的是哪几本书？
customer|The books which are on the counter.|柜台上的那些书。
manager|Did you serve this gentleman half an hour ago, Caroline? He says he's the man who bought these books.|卡罗琳，你半小时前接待过这位先生吗？他说这些书是他买的。
caroline|I can't remember. The man who I served was wearing a hat.|我不记得了。我接待的那个人戴着帽子。
manager|Have you got a hat, sir?|先生，您有帽子吗？
customer|Yes, I have.|有。
manager|Would you put it on, please?|请您戴上好吗？
customer|All right.|好的。
manager|Is this the man that you served, Caroline?|卡罗琳，这是你接待的那个人吗？
caroline|Yes. I recognize him now.|是的，我现在认出他了。`,
words:'customer:顾客;forget:忘记;manager:经理;serve:接待;counter:柜台;recognize:认出',evenWords:'road:道路',
note:'who/that 可指人，which/that 可指物；从句紧跟要说明的名词。关系词作主语不能随意省略，作宾语常可省略。',
checks:`7|Caroline 为什么没立刻认出顾客？|他之前戴着帽子|他从没来过/她没见过那些书|The man who I served was wearing a hat.
13|顾客怎样让她认出了自己？|戴上帽子|换了一本书/拿出车票|经理让他戴帽子后，Caroline 认出了他。`,
examples:`She is the woman who served me.|她就是接待我的那位女士。|who|which/where|关系词作主语，指人用 who 或 that。
This is the book which I bought yesterday.|这就是我昨天买的书。|bought|buy/buys|yesterday 用过去式 bought。
The man who is standing there is my teacher.|站在那里的男人是我的老师。|is standing|are standing/stand|the man 是单数，从句用 is standing。
He is the man who came here last week.|他就是上周来这里的那个人。|came|come/comes|last week 用 came。
This is the car which broke down.|这就是抛锚的那辆车。|which|who/where|关系词作主语，指物用 which 或 that。
These are the things which I bought.|这些就是我买的东西。|are|is/am|these 是复数。`},
{lesson:123,title:'A trip to Australia',evenTitle:'(Who) / (whom), (which) and (that)',scene:'australia-photo',label:'照片里的那个人是谁',goal:'理解省略关系词的从句，描述照片与旅行经历',translationAlternatives:{1:['These are the people whom I met during the trip.','These are the people who I met during the trip.','These are the people that I met during the trip.'],3:['This is the book which I told you about.','This is the book that I told you about.']},lines:`
mike|Look, Scott. This is a photograph I took during my trip to Australia.|看，斯科特。这是我去澳大利亚旅行时拍的照片。
scott|Let me see it, Mike.|迈克，让我看看。
scott|This is a good photograph. Who are these people?|照片很好，这些人是谁？
mike|They're people I met during the trip.|他们是我在旅途中认识的人。
mike|That's the ship we travelled on.|那是我们乘坐的船。
scott|What a beautiful ship!|多漂亮的船啊！
scott|Who's this?|这是谁？
mike|That's the man I told you about. Remember?|那就是我告诉过你的那个人，记得吗？
scott|Ah yes. The one who offered you a job in Australia.|噢，对。给你提供澳大利亚工作的那个人。
mike|That's right.|对。
scott|Who's this?|这是谁？
mike|Guess!|猜猜！
scott|It's not you, is it?|这不是你吧？
mike|That's right.|正是我。
mike|I grew a beard during the trip, but I shaved it off when I came home.|旅行时我留了胡子，但回家后刮掉了。
scott|Why did you shave it off?|为什么刮掉？
mike|My wife didn't like it!|我妻子不喜欢！`,
words:'during:在……期间;trip:旅行;travel:旅行;offer:提供;job:工作;guess:猜;grow:生长;beard:胡子',evenWords:'kitten:小猫',
note:'关系词作宾语时可省略：the photograph I took。介词不要漏：the ship we travelled on。主语关系词不可直接省略，但 who is standing 可以整体简化为 standing。',
checks:`9|照片中那个人给 Mike 提供了什么？|澳大利亚的一份工作|一本词典/一顶帽子|offered you a job in Australia.
17|Mike 为什么刮掉胡子？|妻子不喜欢|照片丢了/船长要求|My wife didn’t like it.`,
examples:`That is the ship we travelled on.|那就是我们乘坐的船。|on|at/to|travel on a ship 的 on 保留在从句末尾。
These are the people I met during the trip.|这些是我旅途中认识的人。|met|meet/meets|过去见过用 met。
This is the photograph I took yesterday.|这是我昨天拍的照片。|took|take/taken|take a photograph 的过去式是 took。
This is the book I told you about.|这就是我和你说过的那本书。|about|at/in|tell someone about something，about 不能漏。
I grew a beard during the trip.|我在旅途中留了胡子。|grew|grow/grown|grow 的过去式是 grew。
The woman standing there is my teacher.|站在那里的女士是我的老师。|standing|stand/stood|standing there 可作为修饰语说明是哪位女士。`},
{lesson:125,title:'Tea for two',evenTitle:'Have to and do not need to',scene:'rainy-garden-tea',label:'突然下雨的好消息',goal:'区分必须、过去不得不和没有必要',lines:`
susan|Can't you come in and have tea now, Peter?|彼得，你现在不能进来喝茶吗？
peter|Not yet. I must water the garden first.|还不行，我必须先给花园浇水。
susan|Do you have to water it now?|你现在非浇不可吗？
peter|I'm afraid I must. Look at it! It's terribly dry.|恐怕是的。看看花园，太干了。
susan|What a nuisance!|真麻烦！
peter|Last summer it was very dry, too. Don't you remember? I had to water it every day.|去年夏天也很干，你不记得了吗？我每天都得浇水。
susan|Well, I'll have tea by myself.|那我自己喝茶了。
susan|That was quick! Have you finished already?|真快！你已经浇完了？
peter|Yes. Look out of the window.|是的，看看窗外。
susan|It's raining! That means you don't need to water the garden.|下雨了！那就是说你不必给花园浇水了。
peter|That was a pleasant surprise. It means I can have tea, instead.|真是个惊喜。这表示我可以来喝茶了。`,
words:'water:浇水;terribly:非常;dry:干燥的;nuisance:麻烦事;mean:意味着;surprise:惊喜',evenWords:'immediately:立即',
note:'have to 表示不得不；过去用 had to，将来用 will have to。don’t need to / don’t have to 表示没必要，不等于 mustn’t 的禁止。by myself 表示独自。',
checks:`6|Peter 去年夏天多久浇一次水？|每天|每周一次/每月一次|I had to water it every day.
10|为什么现在不用浇水了？|下雨了|花园消失了/他不喜欢花|It’s raining.`,
examples:`You do not need to water the garden.|你不必给花园浇水。|need|needs/needed|do not 后用原形 need。
She has to leave immediately.|她必须马上离开。|has|have/having|she 后用 has to。
I had to take a taxi yesterday.|我昨天不得不乘出租车。|had|have/has|过去不得不用 had to。
We will have to get up early tomorrow.|我们明天将不得不早起。|have|has/had|will 后用 have。
Do you have to leave now?|你现在必须离开吗？|have|has/had|Do you 后用原形 have。
I will have tea by myself.|我将独自喝茶。|myself|me/my|by myself 表示独自。`},
{lesson:127,title:'A famous actress',evenTitle:"He can't be ... He must be ...",scene:'actress-recognition',label:'你确定认对人了吗',goal:'区分有把握的推测与事实，使用 must/can’t be',lines:`
kate|Can you recognize that woman, Liz?|莉兹，你认得那个女人吗？
liz|I think I can, Kate. It must be Karen Marsh, the actress.|凯特，我想认得。她准是女演员卡伦·马什。
kate|I thought so. Who's that beside her?|我也这样想。她旁边那个人是谁？
liz|That must be Conrad Reeves.|那准是康拉德·里夫斯。
kate|Conrad Reeves, the actor? It can't be. Let me have another look.|男演员康拉德·里夫斯？不可能，让我再看看。
kate|I think you're right! Isn't he her third husband?|我想你说得对！他不是她的第三任丈夫吗？
liz|No. He must be her fourth or fifth.|不是，他肯定是她的第四任或第五任。
kate|Doesn't Karen Marsh look old!|卡伦·马什看起来真老啊！
liz|She does, doesn't she! I read she's twenty-nine, but she must be at least forty.|是啊！我读到她二十九岁，但她准有至少四十岁。
kate|I'm sure she is.|我也确信。
liz|She was a famous actress when I was still at school.|我还在上学时，她就已经是著名女演员了。
kate|That was a long time ago, wasn't it?|那是很久以前了，对吧？
liz|Not that long ago! I'm not more than twenty-nine myself.|没那么久！我自己还不超过二十九岁呢。`,
words:'famous:著名的;actress:女演员;actor:男演员;read:从阅读中得知;at least:至少',evenWords:'',
note:'must be 在此表示推测“一定是”，can’t be 表示“不可能是”。人物关于身份和年龄的猜测不等于已证实事实。',
checks:`2|Liz 对演员身份是怎样表达的？|作出有把握的推测|展示身份证证明/完全没有猜测|must be 表示有把握的推测。
13|我们能据此确定 Karen 的真实年龄吗？|不能，故事里是报道和猜测|能，确定二十九/能，确定四十|对话没有独立确认真实年龄。`,
examples:`His bag is here. He must be nearby.|他的包在这里，他一定在附近。|must|mustn't/has to be|这里用 must be 表达推测。
This cannot be my key. Mine is blue.|这不可能是我的钥匙，我的是蓝色的。|cannot|must/mustn't|cannot be 表示不可能是。
She must be sleeping now.|她现在一定在睡觉。|be sleeping|sleeping/is sleeping|推测正在进行，用 must be + -ing。
It cannot be Monday. Today is Tuesday.|不可能是星期一，今天是星期二。|cannot|must/has to|明确线索排除可能，用 cannot。
He must be at least forty.|他一定至少四十岁。|at least|at most/less than|at least 表示至少。
They must be waiting outside.|他们一定正在外面等。|be waiting|are waiting/waiting|must be + -ing 表示对正在发生的事的推测。`},
{lesson:129,title:'Seventy miles an hour',evenTitle:"He can't have been ... He must have been ...",scene:'speed-warning',label:'为什么被警察叫停',goal:'区分过去的义务与对过去的推测',lines:`
ann|Look, Gary! That policeman's waving to you. He wants you to stop.|看，加里！那位警察在向你挥手，他要你停车。
policeman|Where do you think you are? On a race track?|你以为这是哪里？赛车道吗？
policeman|You must have been driving at seventy miles an hour.|你刚才一定开到了每小时七十英里。
gary|I can't have been.|不可能吧。
policeman|I was doing eighty when I overtook you.|我超过你时，时速是八十英里。
policeman|Didn't you see the speed limit?|你没看到限速标志吗？
gary|I'm afraid I didn't, officer. I must have been dreaming.|警官，恐怕没看见。我当时一定在走神。
ann|He wasn't dreaming, officer. I was telling him to drive slowly.|警官，他不是在做梦，我当时正告诉他慢点开。
gary|That's why I didn't see the sign.|这就是我没看到标志的原因。
policeman|Let me see your driving licence.|让我看看你的驾驶执照。
policeman|I won't charge you this time. But you'd better not do it again!|这次我不处罚你，但你最好别再这样！
gary|Thank you. I'll certainly be more careful.|谢谢，我一定会更小心。
ann|I told you to drive slowly, Gary.|加里，我告诉过你慢点开。
gary|You always tell me to drive slowly, darling.|亲爱的，你总叫我慢点开。
ann|Well, next time you'd better take my advice!|那下次你最好听我的建议！`,
words:'wave:挥手;track:跑道;mile:英里;overtake:超过;speed limit:限速;dream:做梦;sign:标志;driving licence:驾驶执照;charge:处罚;darling:亲爱的',evenWords:'',
note:'must have been 是对过去的推测；had to 表示过去不得不做，含义不同。can’t have been 表示推断过去不可能。had better not + 原形表示最好不要。',
checks:`6|警察指出 Gary 忽略了什么？|限速标志|车票/天气预报|Didn’t you see the speed limit?
15|Ann 最后建议 Gary 怎么做？|听取她的建议|开得更快/换一条赛车道|take my advice。`,
examples:`He did not hear the phone. He must have been sleeping.|他没听到电话，他当时一定在睡觉。|must have been|must be/has to be|对过去正在做什么的推测用 must have been。
I lost my key, so I had to wait.|我丢了钥匙，所以不得不等待。|had to|must have been/must be|过去实际不得不做，用 had to。
She cannot have been at home yesterday.|她昨天不可能在家。|have been|be/has been|对过去的否定推测用 cannot have been。
You had better not drive so quickly.|你最好不要开这么快。|not drive|not to drive/don't drive|had better not 后直接用原形。
They must have been tired after the trip.|他们旅行后一定很累。|have been|has been/be to|对过去状态的推测用 have been。
He forgot his case, so he had to return home.|他忘了箱子，所以不得不回家。|had to|must have/must be|表示过去不得不回去，用 had to。`},
{lesson:131,title:"Don't be so sure!",evenTitle:'He may be ... He may have been ...',scene:'holiday-maybe',label:'这次真的能去度假吗',goal:'表达不确定的计划与过去可能发生的情况',lines:`
martin|Where are you going to spend your holidays this year, Gary?|加里，你今年准备到哪里度假？
gary|We may go abroad. I'm not sure. My wife wants to go to Egypt. I'd like to go there, too. We can't make up our minds.|我们可能出国，还不确定。我妻子想去埃及，我也想去，我们还拿不定主意。
martin|Will you travel by sea or by air?|你们乘船还是坐飞机？
gary|We may travel by sea.|可能乘船。
martin|It's cheaper, isn't it?|那更便宜，是不是？
gary|It may be cheaper, but it takes a long time.|可能更便宜，但花的时间长。
martin|I'm sure you'll enjoy yourselves.|我相信你们会玩得开心。
gary|Don't be so sure. We might not go anywhere.|别那么肯定，我们也许哪儿都不去。
gary|My wife always worries too much. Who's going to look after the dog? Who's going to look after the house? Who's going to look after the garden?|我妻子总担心得太多。谁照看狗？谁照看房子？谁照看花园？
gary|We have this problem every year. In the end, we stay at home and look after everything!|每年我们都有这个问题，最后就留在家里照看一切！`,
words:'Egypt:埃及;abroad:国外;worry:担心',evenWords:'',
note:'may/might 表示可能，语气弱于 must 的有把握推断；may have been 指过去可能。make up one’s mind 表示拿定主意，look after 表示照顾。',
checks:`4|他们确定要乘船了吗？|还没有，只是可能|已经确定/已经到港口|may travel 表示可能，不是已确定。
10|他们往年最后通常怎么做？|留在家里照看一切|每次都去埃及/让朋友看花园|In the end, we stay at home ...`,
examples:`We may go abroad this year.|我们今年可能出国。|may|mustn't/did|may 表示不确定的可能。
He may have been busy yesterday.|他昨天可能很忙。|have been|be/has been|对过去的可能推测用 may have been。
She may be reading now.|她现在可能正在读书。|be reading|is reading/reading|may be + -ing 描述可能正在进行。
They might not go anywhere.|他们可能哪儿也不去。|might not|must to/did not to|might not 表示可能不。
We cannot make up our minds.|我们拿不定主意。|minds|mindful/minding|make up our minds 是拿定主意。
Who will look after the garden?|谁将照看花园？|after|for/at|look after 表示照看。`}
];
