'use strict';
// Supplied Book 1 PDF pp.231–254. Original English; authored Chinese and exercises.
module.exports=[
{lesson:97,title:'A small blue case',evenTitle:'Whose is it? Whose are they?',scene:'blue-suitcase',label:'蓝色箱子属于谁',goal:'描述失物，区分物主代词和 belong to',lines:`
mr-hall|I left a suitcase on the train to London the other day.|前几天我把一个行李箱落在了去伦敦的火车上。
attendant|Can you describe it, sir?|先生，您能描述一下吗？
mr-hall|It's a small blue case and it's got a zip.|那是个蓝色的小箱子，有拉链。
mr-hall|There's a label on the handle with my name and address on it.|提手上有标签，上面有我的姓名和地址。
attendant|Is this case yours?|这个箱子是您的吗？
mr-hall|No, that's not mine.|不，那个不是我的。
attendant|What about this one? This one's got a label.|这个呢？这个有标签。
mr-hall|Let me see it.|让我看看。
attendant|What's your name and address?|您的姓名和地址是什么？
mr-hall|David Hall, 83, Bridge Street.|大卫·霍尔，桥街 83 号。
attendant|That's right. D. N. Hall, 83, Bridge Street.|对，D. N. 霍尔，桥街 83 号。
attendant|Three pounds fifty pence, please.|请付三英镑五十便士。
mr-hall|Here you are.|给您。
attendant|Thank you.|谢谢。
mr-hall|Hey!|嘿！
attendant|What's the matter?|怎么了？
mr-hall|This case doesn't belong to me! You've given me the wrong case!|这个箱子不属于我！您给错箱子了！`,
words:'leave:遗忘;describe:描述;zip:拉链;label:标签;handle:提手;address:地址;pence:便士;belong:属于',evenWords:'',
note:'mine/yours/his/hers/ours/theirs 可以单独表示谁的物品。belong to 后用 me/you/him/her/us/them。my/your 等后面需要名词。',
checks:`4|箱子的标签在哪里？|提手上|箱底/拉链里面|on the handle.
17|霍尔先生最后拿到正确的箱子了吗？|没有|已经拿到/故事没有说明|You’ve given me the wrong case! 明确说给错了。`,
examples:`This case belongs to me.|这个箱子属于我。|me|my/mine|belong to 后用宾格 me。
These books are ours.|这些书是我们的。|ours|our/us|ours 可以独立表示我们的书。
Is this case yours?|这个箱子是你的吗？|yours|your/you|yours 可以单独放在句末。
It does not belong to her.|它不属于她。|her|hers/she|to 后用宾格 her。
Those tickets are theirs.|那些票是他们的。|theirs|their/them|theirs 是名词性物主代词。
This is my suitcase.|这是我的行李箱。|my|mine/me|名词 suitcase 前用 my。`},
{lesson:99,title:'Ow!',evenTitle:'He says that ... She says that ... They say that ...',scene:'slipped-stairs',label:'Andy 怎么摔倒了',goal:'描述过去意外，用 that 从句转述信息',lines:`
andy|Ow!|哎哟！
lucy|What's the matter, Andy?|安迪，怎么了？
andy|I slipped and fell downstairs.|我滑倒了，从楼梯上摔了下来。
lucy|Have you hurt yourself?|你摔伤了吗？
andy|Yes, I have. I think that I've hurt my back.|是的，我想我摔伤了背。
lucy|Try and stand up. Can you stand up? Here. Let me help you.|试着站起来，你能站起来吗？来，让我帮你。
andy|I'm sorry, Lucy. I'm afraid that I can't get up.|对不起，露西。恐怕我站不起来。
lucy|I think that the doctor had better see you. I'll phone Dr. Carter.|我想最好让医生看看你，我给卡特医生打电话。
lucy|The doctor says that he will come at once. I'm sure that you need an X-ray, Andy.|医生说他马上来。安迪，我想你需要拍张 X 光片。`,
words:'ow:哎哟;slip:滑倒;fall:摔倒;downstairs:楼下;hurt:伤害;back:背;stand up:站起来;help:帮助;at once:立刻;sure:确信的;X-ray:X光检查',evenWords:'licence:执照',
note:'I think/say/believe that ... 后接陈述语序。fall 的过去式是 fell，过去分词是 fallen。',
checks:`5|Andy 认为哪里受伤了？|背部|耳朵/牙齿|I think that I’ve hurt my back.
9|医生说什么时候来？|马上|明天/下周|at once 表示立刻。`,
examples:`He says that he feels tired.|他说他觉得累。|feels|feel/feeling|that 从句中 he 后用 feels。
They say that they need some help.|他们说他们需要帮助。|need|needs/needing|they 后用 need。
She thinks that he will come soon.|她认为他很快会来。|will come|will comes/will coming|that 后是完整陈述句，will 后用原形。
I slipped and fell yesterday.|我昨天滑倒并摔了一跤。|fell|fall/fallen|过去的动作使用 fell。
Let me help you.|让我帮助你。|help|to help/helping|let 后接宾语和不带 to 的动词原形。
She says that she has found her pen.|她说她已经找到钢笔了。|has|have/is|she + has + 过去分词。`},
{lesson:101,title:'A card from Jimmy',evenTitle:'He says he ... She says she ... They say they ...',scene:'postcard-jimmy',label:'读读 Jimmy 的明信片',goal:'转述来信，调整人称并保留原来的信息',lines:`
grandmother|Read Jimmy's card to me please, Penny.|彭妮，请把吉米的明信片读给我听。
penny|'I have just arrived in Scotland and I'm staying at a Youth Hostel.'|“我刚到苏格兰，住在一家青年旅舍。”
grandmother|Eh?|什么？
penny|He says he's just arrived in Scotland. He says he's staying at a Youth Hostel.|他说他刚到苏格兰，住在一家青年旅舍。
penny|You know he's a member of the Y.H.A.|您知道，他是青年旅舍协会的会员。
grandmother|The what?|什么协会？
penny|The Y.H.A., Mum. The Youth Hostels Association.|妈妈，Y.H.A.，青年旅舍协会。
grandmother|What else does he say?|他还说了什么？
penny|'I'll write a letter soon. I hope you are all well.'|“我很快会写信，希望你们都好。”
grandmother|What? Speak up, Penny. I'm afraid I can't hear you.|什么？彭妮，大声点，恐怕我听不见。
penny|He says he'll write a letter soon. He hopes we are all well. 'Love, Jimmy.'|他说很快会写信，希望我们都好。“爱你们的，吉米。”
grandmother|Is that all? He doesn't say very much, does he?|就这些吗？他说得不多，对吧？
penny|He can't write very much on a card, Mum.|妈妈，明信片上写不了太多。`,
words:'Scotland:苏格兰;card:明信片;youth:青年;hostel:旅舍;association:协会;soon:不久;write:写',evenWords:'',
note:'转述 He says ... 时，按说话者调整 I → he、we/you 等人称，that 常可省略。主句是现在时 says 时，不必机械把从句改成过去时。',
checks:`4|Jimmy 住在哪里？|青年旅舍|学校宿舍/祖母家|he’s staying at a Youth Hostel.
13|为什么明信片上内容不多？|空间有限|他没有到苏格兰/他不会写字|Penny 解释说在明信片上写不了很多。`,
examples:`He says he has just arrived.|他说他刚到。|has|have/is|转述后主语为 he，用 has。
She says she is staying at a hostel.|她说她住在一家旅舍。|is|am/are|she 对应 is。
He says he will write soon.|他说他很快会写信。|write|writes/wrote|will 后用 write。
They say they have finished.|他们说他们完成了。|have|has/are|they 对应 have。
She says she has shut the door.|她说她已经关门了。|shut|shuts/shutting|shut 的过去分词仍是 shut。
He hopes we are all well.|他希望我们都好。|are|is/am|we 对应 are。`},
{lesson:103,title:'The French test',evenTitle:'Too, very, enough',scene:'french-test',label:'这次考试难不难',goal:'用 too/enough 表达能力与难度，理解 could',lines:`
gary|How was the exam, Richard?|理查德，考试怎么样？
richard|Not too bad. I think I passed in English and Mathematics.|还不太坏，我想英语和数学及格了。
richard|The questions were very easy. How about you, Gary?|题目很容易。加里，你呢？
gary|The English and Maths papers weren't easy enough for me. I hope I haven't failed.|英语和数学卷对我来说不够容易，希望我没有不及格。
richard|I think I failed the French paper.|我想我的法语卷不及格。
richard|I could answer sixteen of the questions. They were very easy.|我能答出十六道题，那些题很容易。
richard|But I couldn't answer the rest. They were too difficult for me.|但其余的我答不出来，对我来说太难了。
gary|French tests are awful, aren't they?|法语考试很糟糕，是不是？
richard|I hate them. I'm sure I've got a low mark.|我讨厌它们，我肯定分数很低。
gary|Oh, cheer up! Perhaps we didn't do too badly.|噢，振作点！也许我们考得没有那么糟。
gary|The guy next to me wrote his name at the top of the paper.|坐在我旁边的人把名字写在试卷顶端。
richard|Yes?|然后呢？
gary|Then he sat there and looked at it for three hours! He didn't write a word!|然后他坐在那里看了整整三个小时，一个字也没写！`,
words:'exam:考试;pass:及格;mathematics:数学;question:问题;easy:容易的;enough:足够;paper:试卷;fail:不及格;answer:回答;mark:分数;rest:其余部分;difficult:困难的;hate:讨厌;low:低的;cheer:鼓励;guy:人;top:顶部',evenWords:'clever:聪明的;stupid:愚蠢的;cheap:便宜的;expensive:昂贵的;fresh:新鲜的;stale:不新鲜的;loud:响亮的;high:高的;hard:硬的;soft:软的;sweet:甜的;sour:酸的',
note:'too + 形容词 + to do 表示太……以至不能；形容词 + enough + to do 表示足够……可以。very 只是程度很。could/couldn’t 表示过去能否做到。',
checks:`7|Richard 能答出全部法语题吗？|不能，只答出十六道|一道也答不出/全部能答|能答十六道，其余太难。
13|考试持续了多久？|三个小时|三十分钟/一个小时|looked at it for three hours 给出了时长。`,
examples:`The bag is too heavy for me to carry.|这个包太重，我提不动。|too|enough/many|too ... to 表示太……而不能。
The question is easy enough for me to answer.|这道题足够容易，我能答。|enough|too/very|enough 放在形容词 easy 后。
I could answer sixteen questions.|我能答出十六道题。|answer|answered/answers|could 后用原形。
The box is light enough to carry.|这个箱子够轻，可以提动。|enough|too/much|形容词后接 enough。
The music was too low for us to hear.|音乐声太低，我们听不见。|too|enough/many|too low to hear 表示太低听不见。
She could not answer the rest.|她答不出其余的题。|answer|answered/answering|could not 后用动词原形。`},
{lesson:105,title:'Full of mistakes',evenTitle:'I want you / him / her / them to ...',scene:'dictionary-present',label:'礼物为什么是词典',goal:'表达希望某人做什么，区分 to do 与 not to do',lines:`
boss|Where's Sandra, Bob? I want her.|鲍勃，桑德拉在哪里？我找她。
bob|Do you want to speak to her?|您要和她讲话吗？
boss|Yes, I do. I want her to come to my office. Tell her to come at once.|是的，让她到我办公室来。告诉她马上来。
sandra|Did you want to see me?|您找我吗？
boss|Ah, yes, Sandra. How do you spell 'intelligent'? Can you tell me?|是的，桑德拉。intelligent 怎么拼？你能告诉我吗？
sandra|I-N-T-E-L-L-I-G-E-N-T.|I-N-T-E-L-L-I-G-E-N-T。
boss|That's right. You've typed it with only one 'L'.|对，但你打的时候只打了一个 L。
boss|This letter's full of mistakes. I want you to type it again.|这封信错误很多，我要你重新打一遍。
sandra|Yes, I'll do that. I'm sorry about that.|好的，我会重打。对此我很抱歉。
boss|And here's a little present for you.|这里还有件小礼物给你。
sandra|What is it?|是什么？
boss|It's a dictionary. I hope it'll help you.|是一本词典，希望能帮到你。`,
words:'spell:拼写;intelligent:聪明的;mistake:错误;present:礼物;dictionary:词典',evenWords:'carry:搬;correct:纠正;keep:保存',
note:'want + 人 + to do 表示希望某人做。tell + 人 + not to do 表示告诉某人不要做，not 放在 to 前。intelligent 中间有两个 l。',
checks:`8|老板希望 Sandra 做什么？|重新打这封信|马上寄信/买一本书|I want you to type it again.
12|老板送的礼物是什么？|词典|照相机/钢笔|It’s a dictionary.`,
examples:`I want you to correct it.|我希望你纠正它。|to correct|correct/correcting|want + 人 + to do。
Tell her to come at once.|告诉她马上来。|her|she/hers|tell 后用宾格 her。
He is telling them not to lose it.|他正告诉他们不要弄丢它。|not to|to not to/no to|否定不定式为 not to do。
I do not want him to miss the train.|我不希望他错过火车。|him|he/his|want 后用宾格 him。
She wants me to help her.|她希望我帮她。|to help|help/helping|want + 宾语 + to do。
Tell them not to break it.|告诉他们不要打破它。|break|breaks/broke|to 后用原形。`},
{lesson:107,title:"It's too small.",evenTitle:'How do they compare?',scene:'dress-comparison',label:'哪条裙子更合适',goal:'用比较级和最高级描述大小、重量与外观',lines:`
assistant|Do you like this dress, madam?|女士，您喜欢这条连衣裙吗？
lady|I like the colour very much. It's a lovely dress, but it's too small for me.|我很喜欢它的颜色。这条裙子很漂亮，但对我来说太小了。
assistant|What about this one? It's a lovely dress. It's very smart.|这条怎么样？很漂亮，也很时髦。
assistant|Short skirts are in fashion now. Would you like to try it?|短裙现在很流行，您想试试吗？
lady|All right.|好的。
lady|I'm afraid this green dress is too small for me as well. It's smaller than the blue one.|恐怕这条绿色裙子对我也太小了，它比蓝色的还小。
lady|I don't like the colour either. It doesn't suit me at all. I think the blue dress is prettier.|我也不喜欢这颜色，它一点都不适合我。我觉得蓝色的更漂亮。
lady|Could you show me another blue dress? I want a dress like that one, but it must be my size.|您能再给我看一条蓝色的裙子吗？我想要那样的，但必须是我的尺码。
assistant|I'm afraid I haven't got a larger dress. This is the largest dress in the shop.|恐怕没有更大的了，这是店里最大的一条。`,
words:'madam:女士;smart:时髦的;as well:也;suit:适合;pretty:漂亮的',evenWords:'',
note:'短形容词比较级常加 -er，最高级加 -est；heavy → heavier/heaviest，hot → hotter/hottest。比较用 than，最高级前常用 the。',
checks:`6|绿色裙子和蓝色裙子比起来怎么样？|更小|更大/一样大|It’s smaller than the blue one.
9|店里还有更大的裙子吗？|没有|有很多/店员还没找|This is the largest dress in the shop.`,
examples:`This dress is smaller than the blue one.|这条裙子比蓝色的更小。|than|then/as|比较级后用 than。
This is the largest dress in the shop.|这是店里最大的裙子。|largest|larger/large|the ... in the shop 用最高级。
The blue suitcase is heavier than the brown one.|蓝色行李箱比棕色的更重。|heavier|heavy/heaviest|两者比较用 heavier。
Yesterday was hotter than today.|昨天比今天更热。|hotter|hotest/hottest|hot 比较级双写 t 再加 er。
This test is easier than that one.|这次测验比那次容易。|easier|easy/easiest|easy 变 y 为 i 加 er。
He is the tallest student in our class.|他是我们班最高的学生。|tallest|taller/tall|班级范围内最高，用 tallest。`}
];
