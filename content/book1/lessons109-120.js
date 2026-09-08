'use strict';
// Supplied Book 1 PDF pp.255–278. Original English; authored Chinese and exercises.
module.exports=[
{lesson:109,title:'A good idea',evenTitle:'How do they compare?',scene:'coffee-biscuits',label:'多一点还是少一点',goal:'区分 little/few 与 less/fewer，提出礼貌建议',lines:`
charlotte|Shall I make some coffee, Jane?|简，我来煮点咖啡好吗？
jane|That's a good idea, Charlotte.|夏洛特，好主意。
charlotte|It's ready. Do you want any milk?|好了，你要牛奶吗？
jane|Just a little, please.|请加一点点。
charlotte|What about some sugar? Two teaspoonfuls?|加些糖怎么样？两茶匙？
jane|No, less than that. One and a half teaspoonfuls, please. That's enough for me.|不，比那少一点。请加一茶匙半，对我就够了。
jane|That was very nice.|真好喝。
charlotte|Would you like some more?|你还想再来点吗？
jane|Yes, please.|好的，谢谢。
jane|I'd like a cigarette, too. May I have one?|我还想抽支烟，可以给我一支吗？
charlotte|Of course. I think there are a few in that box.|当然，我想那个盒子里有几支。
jane|I'm afraid it's empty.|恐怕是空的。
charlotte|What a pity!|真遗憾！
jane|It doesn't matter.|没关系。
charlotte|Have a biscuit instead. Eat more and smoke less!|那吃块饼干吧。多吃一点，少抽一点！
jane|That's very good advice!|这是很好的建议！`,
words:'idea:主意;a little:一点;teaspoonful:一茶匙的量;less:更少的;a few:几个;pity:遗憾;instead:代替;advice:建议',evenWords:'most:最多的;least:最少的;best:最好的;worse:更坏的;worst:最坏的',
note:'a little/less 修饰不可数名词，a few/fewer 修饰可数复数。good → better → best；bad → worse → worst。',
checks:`6|Jane 要多少糖？|一茶匙半|两茶匙/三茶匙|One and a half teaspoonfuls.
15|Charlotte 最后建议吃什么？|饼干|苹果/面包|Have a biscuit instead.`,
examples:`I have less milk than you.|我的牛奶比你的少。|less|fewer/few|milk 不可数，用 less。
She has fewer books than me.|她的书比我的少。|fewer|less/little|books 可数复数，用 fewer。
There is a little sugar in the bowl.|碗里有一点糖。|a little|a few/many|sugar 不可数。
There are a few biscuits in the box.|盒子里有几块饼干。|a few|a little/much|biscuits 可数复数。
This is the best book I have read.|这是我读过的最好的书。|best|better/good|good 的最高级是 best。
This weather is worse than yesterday's.|这天气比昨天的更糟。|worse|worst/bad|bad 的比较级是 worse。`},
{lesson:111,title:'The most expensive model',evenTitle:'How do they compare?',scene:'television-shop',label:'比较两台电视机',goal:'使用 more/most 和 as ... as 比较物品',lines:`
mr-frith|I like this television very much. How much does it cost?|我很喜欢这台电视，它多少钱？
assistant|It's the most expensive model in the shop. It costs five hundred pounds.|这是店里最贵的型号，要五百英镑。
mrs-frith|That's too expensive for us. We can't afford all that money.|那对我们来说太贵了，我们负担不起那么多钱。
assistant|This model's less expensive than that one. It's only three hundred pounds.|这个型号比那个便宜，只要三百英镑。
assistant|But, of course, it's not as good as the expensive one.|不过，当然它不如贵的那台好。
mr-frith|I don't like this model. The other model's more expensive, but it's worth the money.|我不喜欢这个型号。另一台更贵，但物有所值。
mr-frith|Can we buy it on instalments?|我们可以分期付款买吗？
assistant|Of course. You can pay a deposit of thirty pounds, and then fourteen pounds a month for three years.|当然。先付三十英镑定金，再每月付十四英镑，付三年。
mr-frith|Do you like it, dear?|亲爱的，你喜欢吗？
mrs-frith|I certainly do, but I don't like the price.|我当然喜欢，但不喜欢这价格。
mrs-frith|You always want the best, but we can't afford it. Sometimes you think you're a millionaire!|你总想要最好的，但我们买不起。你有时以为自己是百万富翁！
mr-frith|Millionaires don't buy things on instalments!|百万富翁买东西可不分期付款！`,
words:'model:型号;afford:负担得起;deposit:定金;instalment:分期付款;price:价格;millionaire:百万富翁',evenWords:'',
note:'较长形容词常用 more/most 或 less/least。as + 原级 + as 表示一样，not as ... as 表示不如。',
checks:`5|便宜的型号和贵的相比怎样？|质量不如贵的|质量完全一样/质量更好|not as good as the expensive one.
8|分期需要付多久？|三年|三个月/十四年|for three years.`,
examples:`This model is more expensive than that one.|这个型号比那个更贵。|more expensive|expensiver/most expensive|长形容词比较级用 more。
This is the most difficult test I have done.|这是我做过的最难的测验。|most difficult|more difficult/difficultest|范围内最高程度用 the most。
The green apple is not as sweet as the red one.|青苹果不如红苹果甜。|sweet|sweeter/sweetest|as ... as 中用原级。
This book is less interesting than yours.|这本书不如你的有趣。|less interesting|least interesting/interestingest|less + 形容词表示较不。
It is the least expensive model.|这是最便宜的型号。|least|less/fewer|the least expensive 表示最不昂贵。
My bag is as light as yours.|我的包和你的一样轻。|light|lighter/lightest|as ... as 中用原级。`},
{lesson:113,title:'Small change',evenTitle:"I've got none.",scene:'bus-change',label:'谁带了零钱',goal:'表达没有与也一样，使用 so/neither 倒装回应',lines:`
conductor|Fares, please!|请买票！
man|Trafalgar Square, please.|请到特拉法尔加广场。
conductor|I'm sorry, sir. I can't change a ten-pound note. Haven't you got any small change?|对不起，先生，我找不开十英镑的纸币。您没有零钱吗？
man|I've got no small change, I'm afraid.|恐怕我没有零钱。
conductor|I'll ask some of the passengers.|我来问问其他乘客。
conductor|Have you any small change, sir?|先生，您有零钱吗？
passenger-1|I'm sorry. I've got none.|对不起，我没有。
passenger-2|I haven't got any either.|我也没有。
conductor|Can you change this ten-pound note, madam?|女士，您能找开这张十英镑纸币吗？
passenger-3|I'm afraid I can't.|恐怕不能。
passenger-4|Neither can I.|我也不能。
conductor|I'm very sorry, sir. You must get off the bus. None of our passengers can change this note. They're all millionaires!|非常抱歉，先生，您必须下车。乘客中没人能找开这张纸币，他们都是百万富翁！
two-tramps|Except us.|我们除外。
tramp-1|I've got some small change.|我有些零钱。
tramp-2|So have I.|我也有。`,
words:'conductor:售票员;fare:车费;change:兑换;note:纸币;passenger:乘客;none:没有任何;neither:也不;get off:下车;tramp:流浪者;except:除……以外',evenWords:'',
note:'no 后接名词，none 可独立使用。表示我也一样：肯定用 So + 助动词/be + I；否定用 Neither + 助动词/be + I，助动词与前句匹配。',
checks:`4|男乘客带的是怎样的钱？|十英镑纸币|很多硬币/没有带钱|他没有零钱，但拿着 ten-pound note。
15|最后谁有零钱？|两位流浪者|售票员/前四位乘客|最后两人回答有零钱，第二人说 So have I。`,
examples:`I have got no money.|我没有钱。|no|none/not|no 后直接接名词 money。
I have got none.|我一点也没有。|none|no/any no|none 可独立使用。
I can swim. So can I.|我会游泳。我也会。|So can I|Neither can I/So am I|肯定回应 can 时用 So can I。
I cannot swim. Neither can I.|我不会游泳。我也不会。|Neither|So/Too|否定回应使用 Neither。
I am tired. So am I.|我累了。我也累了。|So am I|Neither am I/So do I|肯定回应 be 动词时用 So am I。
I did not meet him. Neither did I.|我没见过他。我也没见过。|Neither did I|So did I/Neither do I|前句 did not，回应使用 Neither did I。`},
{lesson:115,title:'Knock, knock!',evenTitle:'Every, no, any and some',scene:'garden-lunch',label:'大家究竟在哪里',goal:'区分人、事、地点的不定代词及肯定否定用法',lines:`
helen|Isn't there anyone at home?|家里没有人吗？
jim|I'll knock again, Helen. Everything's very quiet. I'm sure there's no one at home.|海伦，我再敲一次。一切很安静，我肯定家里没人。
helen|But that's impossible. Carol and Tom invited us to lunch. Look through the window.|但那不可能。卡罗尔和汤姆邀请我们来吃午饭。从窗户看看。
helen|Can you see anything?|你看见什么了吗？
jim|Nothing at all.|什么也没有。
helen|Let's try the back door.|我们试试后门吧。
jim|Look! Everyone's in the garden.|看！大家都在花园里。
carol|Hello, Helen. Hello, Jim.|你好，海伦。你好，吉姆。
tom|Everybody wants to have lunch in the garden. It's nice and warm out here.|大家都想在花园吃午饭，这里暖和舒服。
carol|Come and have something to drink.|来喝点东西吧。
jim|Thanks, Carol. May I have a glass of beer please?|谢谢，卡罗尔。我可以喝杯啤酒吗？
carol|Beer? There's none left. You can have some lemonade.|啤酒？一点都没剩下。你可以喝些柠檬水。
jim|Lemonade!|柠檬水！
tom|Don't believe her, Jim. She's only joking. Have some beer!|吉姆，别信她。她只是开玩笑，喝点啤酒吧！`,
words:'anyone:任何人;knock:敲;everything:一切;quiet:安静的;impossible:不可能的;invite:邀请;anything:任何事物;nothing:什么也没有;lemonade:柠檬水;joke:开玩笑',evenWords:'asleep:睡着的;glasses:眼镜',
note:'-one/-body 指人，-thing 指事物，-where 指地点。everyone/everything 作主语通常用单数。否定句用 not ... anything，或肯定结构 + nothing，避免双重否定。',
checks:`7|为什么敲前门没人回应？|大家都在花园|大家都出国了/房子没人住|Everyone’s in the garden.
9|大家想在哪里吃午饭？|花园里|车站/厨房外的街上|have lunch in the garden。`,
examples:`Everyone is in the garden.|大家都在花园里。|is|are/am|everyone 作主语用单数。
I did not see anyone.|我没有看见任何人。|anyone|no one/nobody|已有 did not，用 anyone。
There is nothing in the box.|盒子里什么也没有。|nothing|anything/everyone|nothing 指没有任何东西。
I looked for my pen everywhere.|我到处找钢笔。|everywhere|everyone/everything|everywhere 指每个地方。
She has something to drink.|她有东西可喝。|something|someone/somewhere|something 指某物。
Everything is very quiet.|一切都很安静。|is|are/am|everything 作主语用单数。`},
{lesson:117,title:"Tommy's breakfast",evenTitle:'What were you doing?',scene:'breakfast-coins',label:'早餐时发生了什么',goal:'区分进行中的背景和突然发生的动作',narrative:true,lines:`
narrator|When my husband was going into the dining room this morning, he dropped some coins on the floor.|今天早上丈夫走进餐厅时，把一些硬币掉在了地上。
narrator|There were coins everywhere.|到处都是硬币。
narrator|We looked for them, but we could not find them all.|我们找了，却没能全部找到。
narrator|While we were having breakfast, our little boy, Tommy, found two small coins on the floor.|我们吃早饭时，小儿子汤米在地上找到了两枚小硬币。
narrator|He put them both into his mouth.|他把两枚都放进了嘴里。
narrator|We both tried to get the coins, but it was too late.|我们俩都想拿出来，但已经太晚了。
narrator|Tommy had already swallowed them!|汤米已经把它们吞了下去！
narrator|Later that morning, when I was doing the housework, my husband phoned me from the office.|那天上午晚些时候，我做家务时，丈夫从办公室打来电话。
narrator|'How's Tommy?' he asked.|他问：“汤米怎么样？”
narrator|'I don't know,' I answered, 'Tommy's been to the toilet three times this morning, but I haven't had any change yet!'|我回答：“不知道，汤米今早已经上了三次厕所，但我还没拿到零钱呢！”`,
words:'dining room:餐厅;coin:硬币;mouth:嘴;swallow:吞下;later:后来;toilet:厕所',evenWords:'ring:响铃',
note:'was/were + -ing 交代过去正在做的背景，过去式交代中途发生的动作。while 常连接持续动作。故事用 change 的“零钱”与“变化”双关；吞硬币的动作不能模仿。',
checks:`4|Tommy 发现了几枚硬币？|两枚|三枚/一枚|two small coins.
10|结尾 change 同时关联哪两种意思？|零钱和变化|天气和时间/电话和声音|change 既能表示零钱，也能表示变化，构成双关。`,
examples:`I was reading when the phone rang.|电话响时我正在读书。|was reading|read/am reading|过去正在进行用 was reading。
They were cooking when I arrived.|我到时他们正在做饭。|were|was/are|they 的过去进行时用 were。
She was reading while he was cooking.|他做饭时她在读书。|while|after/before|while 可以连接同时进行的两个动作。
The phone rang when I was washing the dishes.|我洗碗时电话响了。|rang|ring/rung|突然发生的过去动作使用 rang。
What were you doing when he arrived?|他到时你正在做什么？|were|was/are|you 的过去进行时疑问用 were。
I was working in the garden yesterday afternoon.|昨天下午我正在花园干活。|working|work/worked|was 后接 -ing。`},
{lesson:119,title:'A true story',evenTitle:'It had already happened.',scene:'parrot-story',label:'黑暗中是谁在说话',goal:'按先后顺序理解故事，使用过去完成时',narrative:true,lines:`
narrator|Do you like stories? I want to tell you a true story.|你喜欢故事吗？我想给你讲个真实的故事。
narrator|It happened to a friend of mine a year ago.|这发生在我的一位朋友身上，是一年前的事。
narrator|While my friend, George, was reading in bed, two thieves climbed into his kitchen.|我朋友乔治在床上读书时，两个小偷爬进了他的厨房。
narrator|After they had entered the house, they went into the dining room.|他们进屋后，来到了餐厅。
narrator|It was very dark, so they turned on a torch.|里面很黑，所以他们打开手电筒。
narrator|Suddenly, they heard a voice behind them.|突然，他们听见身后有声音。
narrator|'What's up? What's up?' someone called.|有人喊：“怎么了？怎么了？”
narrator|The thieves dropped the torch and ran away as quickly as they could.|小偷扔下手电筒，拼命跑掉了。
narrator|George heard the noise and came downstairs quickly.|乔治听到响声，迅速下楼。
narrator|He turned on the light, but he couldn't see anyone.|他打开灯，却没看到任何人。
narrator|The thieves had already gone.|小偷已经跑了。
narrator|But George's parrot, Henry, was still there.|但乔治的鹦鹉亨利还在那里。
narrator|'What's up, George?' he called.|它叫道：“怎么了，乔治？”
narrator|'Nothing, Henry,' George said and smiled. 'Go back to sleep.'|乔治笑着说：“没什么，亨利。继续睡吧。”`,
words:'story:故事;happen:发生;thief:小偷;enter:进入;dark:黑暗的;torch:手电筒;voice:声音;parrot:鹦鹉',evenWords:'exercise book:练习本',
note:'had + 过去分词表示某个过去时刻之前已经发生。after ... had done 是先完成再发生，before 则从另一方向交代先后。辨别谁说话要综合结尾线索。',
checks:`8|小偷听见声音后做了什么？|丢下手电筒逃跑|继续吃饭/叫醒乔治|dropped the torch and ran away.
13|黑暗中喊话的是谁？|鹦鹉亨利|乔治的邻居/另一个小偷|结尾再次出现同样的话，揭示是 Henry。`,
examples:`The train had already left when I arrived.|我到时火车已经开走了。|had|has/have|比 arrived 更早发生，用 had left。
She went home after she had finished work.|她完成工作后回家了。|had finished|has finished/is finishing|先完成工作，再回家。
He had done his homework before he went to bed.|他睡觉前已经做完作业。|done|did/do|had 后用过去分词 done。
They had sold the car before I asked the price.|我问价格前，他们已经卖掉了车。|sold|sell/selling|had 后用过去分词 sold。
We had had dinner before they arrived.|他们到之前我们已经吃过晚饭。|had had|have had/are having|第一个 had 是助动词，第二个是 have 的过去分词。
She read the book after she had seen the film.|她看过电影后读了那本书。|seen|saw/see|had 后用 see 的过去分词 seen。`}
];
