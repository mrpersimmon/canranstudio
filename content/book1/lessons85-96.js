'use strict';
// Supplied Book 1 PDF pp.207–230. Original English; authored Chinese and exercises.
module.exports=[
{lesson:85,title:'Paris in the spring',evenTitle:'What have you done?',scene:'paris-spring',label:'春天的巴黎下雨吗',goal:'谈论去过的地方与看过的电影，分清 ever/never',lines:`
george|Hello, Ken.|你好，肯。
ken|Hi, George.|嗨，乔治。
george|Have you just been to the cinema?|你刚去过电影院吗？
ken|Yes, I have.|是的。
george|What's on?|正在放映什么？
ken|Paris in the Spring.|《巴黎之春》。
george|Oh, I've already seen it. I saw it on television last year. It's an old film, but it's very good.|噢，我已经看过了，去年在电视上看的。这是部老电影，但很好。
ken|Paris is a beautiful city.|巴黎是个美丽的城市。
george|I've never been there. Have you ever been there, Ken?|我从没去过那里。肯，你去过吗？
ken|Yes, I have. I was there in April.|去过，我四月在那里。
george|Paris in the spring, eh?|春天的巴黎，是吗？
ken|It was spring, but the weather was awful. It rained all the time.|当时是春天，但天气糟透了，一直在下雨。
george|Just like London!|就像伦敦一样！`,
words:'Paris:巴黎;cinema:电影院;film:电影;beautiful:美丽的;city:城市;never:从未;ever:曾经',evenWords:'',
note:'Have you ever ...? 询问经历，never 表示从未。have been to 表示去过并已回来，there 前不加 to。现在完成时不与 last year 这样的明确过去时间搭配。',
checks:`7|乔治在哪里看过这部电影？|电视上|电影院/飞机上|on television last year.
12|肯在巴黎时天气怎么样？|一直下雨|一直晴天/每天都下雪|It rained all the time.`,
examples:`Have you ever been to Paris?|你去过巴黎吗？|been|went/go|have + 过去分词 been。
I have never been there.|我从未去过那里。|never|ever/always|never 表示从未。
She has just opened the window.|她刚打开了窗户。|has|have/is|she 用 has + 过去分词。
He painted the bookcase last year.|他去年给书柜刷了漆。|painted|has painted/has paint|last year 是明确过去时间。
I have already seen that film.|我已经看过那部电影了。|seen|saw/see|see 的过去分词是 seen。
She opened the window an hour ago.|她一小时前打开了窗户。|opened|has opened/has open|ago 与一般过去时搭配。`},
{lesson:87,title:'A car crash',evenTitle:'Have you ... yet?',scene:'garage-repair',label:'车子修好了吗',goal:'询问是否已经完成，使用不规则过去分词',lines:`
mr-wood|Is my car ready yet?|我的车修好了吗？
attendant|I don't know, sir. What's the number of your car?|先生，我不知道。您的车牌号是多少？
mr-wood|It's LFZ 312G.|是 LFZ 312G。
attendant|When did you bring it to us?|您什么时候把车送来的？
mr-wood|I brought it here three days ago.|我三天前把它送来的。
attendant|Ah yes, I remember now.|啊，是的，我现在想起来了。
mr-wood|Have your mechanics finished yet?|你们的修理工修完了吗？
attendant|No, they're still working on it. Let's go into the garage and have a look at it.|没有，他们还在修。我们进车库看看吧。
attendant|Isn't that your car?|那不是您的车吗？
mr-wood|Well, it was my car.|嗯，那曾经是我的车。
attendant|Didn't you have a crash?|您不是出车祸了吗？
mr-wood|That's right. I drove it into a lamp-post. Can your mechanics repair it?|是的，我把车撞上了路灯柱。你们的修理工能修好吗？
attendant|Well, they're trying to repair it, sir. But to tell you the truth, you need a new car!|先生，他们在尽力修。但说实话，您需要一辆新车了！`,
words:'attendant:服务员;bring:带来;garage:车库;crash:碰撞;lamp-post:路灯柱;repair:修理;try:尝试',evenWords:'',
note:'yet 常用于疑问和否定句句末，still 表示仍然。bring/brought/brought，find/found/found，meet/met/met。问完成用 Have ...?，追问时间用 When did ...?',
checks:`5|车是什么时候送来的？|三天前|三小时前/三周前|three days ago.
13|服务员最终给出的结论是什么？|需要一辆新车|已经修好/只要换灯泡|you need a new car。`,
examples:`Have they finished yet?|他们做完了吗？|finished|finish/finishes|have 后用过去分词。
She has found her pen.|她找到钢笔了。|found|find/finding|find 的过去分词是 found。
I brought it here three days ago.|我三天前把它带到这里。|brought|bring/brings|bring 的过去式是 brought。
When did you meet her?|你什么时候见到她的？|meet|met/meets|did 后用原形。
He has not left yet.|他还没有离开。|left|leave/leaves|has not 后用过去分词 left。
They are still working on the car.|他们仍在修车。|still|yet/already yet|still 放在这里表示仍然。`},
{lesson:89,title:'For sale',evenTitle:'Have you ... yet?',scene:'house-for-sale',label:'这所房子住了多久',goal:'表达延续至今的状态，区分 for 和 since',lines:`
nigel|Good afternoon. I believe that this house is for sale.|下午好，我想这所房子要出售吧。
ian|That's right.|是的。
nigel|May I have a look at it, please?|我可以看看吗？
ian|Yes, of course. Come in.|当然可以，请进。
nigel|How long have you lived here?|您在这里住多久了？
ian|I've lived here for twenty years.|我在这里住了二十年。
nigel|Twenty years! That's a long time.|二十年！时间真长。
ian|Yes, I've been here since 1976.|是的，我从 1976 年起就住在这里。
nigel|Then why do you want to sell it?|那您为什么想卖掉它呢？
ian|Because I've just retired. I want to buy a small house in the country.|因为我刚退休，想在乡下买一所小房子。
nigel|How much does this house cost?|这所房子多少钱？
ian|£68,500.|六万八千五百英镑。
nigel|That's a lot of money!|那可是一大笔钱！
ian|It's worth every penny of it.|它每一分钱都值。
nigel|Well, I like the house, but I can't decide yet. My wife must see it first.|嗯，我喜欢这房子，但还不能决定，我妻子必须先看看。
ian|Women always have the last word.|女人们总是最后说了算。`,
words:'believe:相信;may:可以;how long:多久;since:自从;why:为什么;sell:卖;because:因为;retire:退休;cost:花费;pound:英镑;worth:值得的;penny:便士',evenWords:'',
note:'for + 时长，since + 起点，常与现在完成时表达延续至今。how long 问多久，how much 问价格。原文中的年份和价格是故事背景；结尾是人物的夸张说法。',
checks:`8|Ian 在这所房子里住了多久？|二十年|二年/十二年|for twenty years.
15|Nigel 为什么还不能决定？|妻子需要先看房|没有看到房子/不知道价格|My wife must see it first.`,
examples:`I have lived here for twenty years.|我在这里住了二十年。|for|since/at|for 后接时长。
She has been here since 2010.|她从 2010 年起就在这里。|since|for/on|since 后接时间起点。
How long have you lived here?|你在这里住了多久？|How long|How many/How often|问持续时间用 How long。
He has done his homework.|他已经做完作业了。|done|did/do|do 的过去分词是 done。
Have you read this book yet?|你看过这本书了吗？|read|reading/reads|read 的过去分词拼写不变，读音与过去式相同。
She has spoken to him.|她已经和他说过话了。|spoken|spoke/speak|speak 的过去分词是 spoken。`},
{lesson:91,title:'Poor Ian!',evenTitle:'When will ...?',scene:'moving-neighbour',label:'邻居什么时候搬家',goal:'用 will 说将来的事，分清尚未与已经完成',lines:`
catherine|Has Ian sold his house yet?|伊恩的房子已经卖掉了吗？
jenny|Yes, he has. He sold it last week.|是的，他上周卖掉了。
catherine|Has he moved to his new house yet?|他已经搬进新房了吗？
jenny|No, not yet. He's still here. He's going to move tomorrow.|没有，还没有。他还在这里，准备明天搬。
catherine|When? Tomorrow morning?|什么时候？明天上午？
jenny|No. Tomorrow afternoon. I'll miss him. He has always been a good neighbour.|不是，明天下午。我会想他的，他一直是个好邻居。
linda|He's a very nice person. We'll all miss him.|他人很好，我们都会想他。
catherine|When will the new people move into this house?|新住户什么时候搬进这房子？
jenny|I think that they'll move in the day after tomorrow.|我想他们后天搬进来。
linda|Will you see Ian today, Jenny?|珍妮，你今天会见到伊恩吗？
jenny|Yes, I will.|会的。
linda|Please give him my regards.|请代我问候他。
catherine|Poor Ian! He didn't want to leave this house.|可怜的伊恩，他本来不想离开这房子。
jenny|No, he didn't want to leave, but his wife did!|是的，他不想离开，但他妻子想！`,
words:'still:仍然;move:搬家;miss:想念;neighbour:邻居;person:人;people:人们;poor:可怜的',evenWords:'',
note:'will + 动词原形表示将来，will not 缩写为 won’t。the day after tomorrow 是后天；have sold 已卖掉，haven’t moved 尚未搬家，两件事要分清。',
checks:`6|Ian 什么时候搬家？|明天下午|明天上午/今天下午|Jenny 纠正说 Tomorrow afternoon.
9|新住户什么时候搬来？|后天|明天下午/昨天|the day after tomorrow 是后天。`,
examples:`He will arrive tomorrow morning.|他明天上午会到。|arrive|arrives/arrived|will 后用原形。
She will not believe me.|她不会相信我。|will not|did not/has not|将来的否定用 will not。
When will they move in?|他们什么时候搬进来？|will|did/has|问将来时间用 will。
It will snow tonight.|今晚会下雪。|snow|snows/snowed|will 后用原形 snow。
They have not moved yet.|他们还没有搬家。|yet|ago/last|现在完成时否定句末常用 yet。
We will see him the day after tomorrow.|我们后天会见到他。|will see|saw/have seen|the day after tomorrow 是将来。`},
{lesson:93,title:'Our new neighbour',evenTitle:'When did you / will you go to ...?',scene:'pilot-neighbour',label:'飞行员邻居的行程',goal:'对比过去与未来的出行，表达城市和时间',narrative:true,lines:`
narrator|Nigel is our new next-door neighbour.|奈杰尔是我们新搬来的隔壁邻居。
narrator|He's a pilot.|他是一名飞行员。
narrator|He was in the R.A.F.|他以前在英国皇家空军服役。
narrator|He will fly to New York next month.|他下个月将飞往纽约。
narrator|The month after next he'll fly to Tokyo.|下下个月他将飞往东京。
narrator|At the moment, he's in Madrid.|此刻他在马德里。
narrator|He flew to Spain a week ago.|他一周前飞去了西班牙。
narrator|He'll return to London the week after next.|下下周他将返回伦敦。
narrator|He's only forty-one years old, and he has already been to nearly every country in the world.|他才四十一岁，就已经去过世界上几乎每个国家。
narrator|Nigel is a very lucky man.|奈杰尔是个很幸运的人。
narrator|But his wife isn't very lucky.|但他的妻子不那么幸运。
narrator|She usually stays at home!|她通常待在家里！`,
words:'pilot:飞行员;return:返回;New York:纽约;Tokyo:东京;Madrid:马德里;fly:飞行',evenWords:'Athens:雅典;Berlin:柏林;Mumbai:孟买;Geneva:日内瓦;Moscow:莫斯科;Rome:罗马;Seoul:首尔;Stockholm:斯德哥尔摩;Sydney:悉尼',
note:'flew 是过去式，will fly 表示将来。next month 是下个月，the month after next 是下下个月。',
checks:`6|Nigel 现在在哪里？|马德里|纽约/东京|At the moment, he’s in Madrid.
8|他什么时候返回伦敦？|下下周|下周/昨天|the week after next 是下下周。`,
examples:`He flew to Spain a week ago.|他一周前飞去了西班牙。|flew|fly/flown|过去时间用 flew。
She will fly to Tokyo next month.|她下个月将飞往东京。|fly|flew/flown|will 后用原形。
We will not go to Athens.|我们不会去雅典。|go|went/gone|will not 后用原形。
He will return the week after next.|他下下周将返回。|will return|returned/has returned|the week after next 表示将来。
Did you go to Sydney last year?|你去年去悉尼了吗？|go|went/gone|did 后用原形。
They have already been to nearly every country.|他们已经去过几乎每个国家。|been|went/go|have 后用过去分词 been。`},
{lesson:95,title:'Tickets, please.',evenTitle:"What's the exact time?",scene:'missed-train',label:'为什么错过火车',goal:'理解准确时刻与时间差，用 had better 提建议',lines:`
george|Two return tickets to London, please. What time will the next train leave?|请给我两张到伦敦的往返票。下一班火车几点开？
attendant|At nineteen minutes past eight.|八点十九分。
george|Which platform?|哪个站台？
attendant|Platform Two. Over the bridge.|二号站台，过桥就是。
ken|What time will the next train leave?|下一班火车几点开？
george|At eight nineteen.|八点十九分。
ken|We've got plenty of time.|我们时间很充裕。
george|It's only three minutes to eight.|现在才七点五十七分。
ken|Let's go and have a drink. There's a bar next door to the station.|我们去喝点东西吧，车站隔壁有个酒吧。
george|We had better go back to the station now, Ken.|肯，我们现在最好回车站去。
porter|Tickets, please.|请出示车票。
george|We want to catch the eight nineteen to London.|我们要赶八点十九分开往伦敦的火车。
porter|You've just missed it!|你们刚刚错过了！
george|What! It's only eight fifteen.|什么！现在才八点十五分。
porter|I'm sorry, sir. That clock's ten minutes slow.|对不起，先生，那只钟慢了十分钟。
george|When's the next train?|下一班火车什么时候开？
porter|In five hours' time!|五个小时以后！`,
words:'return:往返的;train:火车;platform:站台;plenty:充足;bar:酒吧;station:车站;porter:乘务员;catch:赶上;miss:错过',evenWords:'',
note:'past 表示过了几点，to 表示差几分到几点。钟慢十分钟，实际时间要加十分钟。had better + 原形表示最好做；in five hours’ time 表示五小时后。',
checks:`8|three minutes to eight 是几点？|七点五十七分|八点三分/八点五十七分|差三分钟到八点，就是 7:57。
15|他们为什么错过火车？|看的钟慢了十分钟|火车提前一小时/买了错误日期的票|那只钟显示 8:15，实际已是 8:25。`,
examples:`We had better go back now.|我们现在最好回去。|go|went/going|had better 后用原形。
The next train will leave in an hour's time.|下一班火车将在一小时后出发。|in|ago/on|in ... time 表示从现在起过多久。
It is three minutes to eight.|现在是七点五十七分。|to|past/after|差三分钟到八点，用 to。
He went to London two days ago.|他两天前去了伦敦。|ago|in/next|ago 表示过去。
They will return in two weeks' time.|他们将在两周后返回。|will return|returned/have returned|in two weeks’ time 是将来时间。
You had better be careful.|你最好小心。|be|are/being|had better 后用原形 be。`}
];
