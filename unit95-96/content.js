(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit95-96/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页194–197／PDF227–230';
const grammarSource='《同步导学》Grammar纸页166／PDF180；《语法练习册》纸页272–277／PDF286–291';
const rows=[
['return','往返的（本课词义）','/rɪˈtɜːn/','tickets'],['train','火车','/treɪn/','train'],['platform','站台','/ˈplætfɔːm/','platform'],['plenty','大量；充足','/ˈplenti/','plenty'],['bar','酒吧','/bɑː/','bar'],['station','车站；火车站','/ˈsteɪʃən/','station'],
['porter','乘务员（本课车站语境）','/ˈpɔːtə/','porter'],['catch','赶上','/kætʃ/','catch'],['caught','catch的过去式及过去分词','/kɔːt/','catch'],['miss','错过','/mɪs/','miss'],['ticket','票；车票','/ˈtɪkɪt/','tickets'],['attendant','服务员；本课指售票员','/əˈtendənt/','attendant'],
['bridge','桥；天桥','/brɪdʒ/','bridge'],['slow','慢的；钟表走慢的','/sləʊ/','slow'],['fast','快的；钟表走快的','/fɑːst/','fast'],['exact','准确的','/ɪɡˈzækt/','clock'],['minute','分钟','/ˈmɪnɪt/','clock'],['hour','小时','/ˈaʊə/','clock'],
['ago','以前','/əˈɡəʊ/','ago'],['had better','最好（做某事）','/hæd ˈbetə/','advice'],['in … time','在……之后','/ɪn … taɪm/','future'],
['Athens','雅典','/ˈæθɪnz/','athens'],['Beijing','北京','/ˌbeɪˈdʒɪŋ/','beijing'],['Berlin','柏林','/bɜːˈlɪn/','berlin'],['Mumbai','孟买','/mʊmˈbaɪ/','mumbai'],['Geneva','日内瓦','/dʒɪˈniːvə/','geneva'],['London','伦敦','/ˈlʌndən/','london'],['Madrid','马德里','/məˈdrɪd/','madrid'],['Moscow','莫斯科','/ˈmɒskəʊ/','moscow'],['New York','纽约','/ˌnjuː ˈjɔːk/','new-york'],['Paris','巴黎','/ˈpærɪs/','paris'],['Rome','罗马','/rəʊm/','rome'],['Seoul','首尔','/səʊl/','seoul'],['Stockholm','斯德哥尔摩','/ˈstɒkhəʊm/','stockholm'],['Sydney','悉尼','/ˈsɪdni/','sydney'],['Tokyo','东京','/ˈtəʊkiəʊ/','tokyo']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:['porter','attendant'].includes(art)?'/assets/unit95-96/'+art+'.webp':image(art)}));
const unit={id:'unit95-96',version:1,contentRevision:'station-advice-time-v1',mode:'classroom',title:'车站里的时间谜题',path:'/unit95-96/',start:'learn/words',progress:{learningKey:'canran:unit95-96:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认清车站词语',activities:[['words','车站小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'读懂车站故事',activities:[['text','车站小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清建议与时间',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'一起核对出行安排',activities:[['apply','出行小帮手','give']],required:['apply']},
{id:'l5',title:'完成车站挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'train',storyQuestion:'为什么George和Ken误了火车？',completionTitles:{listen:'车站词语认清啦！',roles:'误车的原因读懂啦！',grammar:'建议和时间说清啦！',apply:'出行记录核对好啦！',exam:'车站挑战完成！'},reward:{edition:'station-advice-time-v1',title:'车站时间小达人',lesson:'Lesson 95–96',scene:'/assets/unit95-96/keepsake-story-v1.webp',alt:'George拿着两张车票，与Ken一起听车站乘务员解释',color:'#648d83',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','出行小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={george:'George',ken:'Ken',attendant:'售票员',porter:'乘务员'};
unit.learning.DIALOGUE=[
['george','Two return tickets to London, please. What time will the next train leave?','请买两张去伦敦的往返票。下一班火车什么时候开？'],
['attendant','At nineteen minutes past eight.','八点十九分。'],
['george','Which platform?','在哪个站台？'],
['attendant','Platform Two. Over the bridge.','二号站台。过天桥。'],
['ken','What time will the next train leave?','下一班火车什么时候开？'],
['george','At eight nineteen.','八点十九分。'],
['ken','We’ve got plenty of time.','我们的时间还很宽裕。'],
['george','It’s only three minutes to eight.','现在才七点五十七分。'],
['ken','Let’s go and have a drink. There’s a bar next door to the station.','我们去喝点东西吧。车站旁有一家酒吧。'],
['george','We had better go back to the station now, Ken.','Ken，我们现在最好回车站去。'],
['porter','Tickets, please.','请出示车票。'],
['george','We want to catch the eight nineteen to London.','我们想赶上八点十九分去伦敦的火车。'],
['porter','You’ve just missed it!','你们刚好错过了那班车！'],
['george','What! It’s only eight fifteen.','什么！现在才八点十五分。'],
['porter','I’m sorry, sir. That clock’s ten minutes slow.','对不起，先生。那个钟慢了十分钟。'],
['george','When’s the next train?','下一班车是什么时候？'],
['porter','In five hours’ time!','五小时以后！']
].map(([who,text,cn],i)=>({id:'u9596-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u9596-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-return','return的本课词义','return tickets表示哪种车票？',choice(['往返票','仅去程的票','已经退掉的票'],'往返票',{image:image('tickets'),imageAlt:'两张带往返箭头的车票'}),'本课return修饰tickets，表示往返；不同于上一课动词“返回”。'),
q('v-station','车站物品与地点','把车站词语配好。',match([['train','火车'],['platform','站台'],['station','车站']]),'站台在车站里，train是交通工具。'),
q('v-porter','本课工作人员','看图，哪个词表示本课的“乘务员”？',choice(['porter','bridge','ticket'],'porter',{optionImages:{porter:'/assets/unit95-96/porter.webp',bridge:image('bridge'),ticket:image('tickets')}}),'本课porter是查验车票的车站工作人员。'),
q('v-catch','赶上与错过的区别','配好动作及形式。',match([['catch','赶上'],['caught','catch的过去式及过去分词'],['miss','错过']]),'本课catch与miss谈是否赶上火车。'),
q('v-plenty','plenty of的意义','点出表示“充足的”两个词。',{type:'locate',fragments:['We’ve got ',{value:'plenty of'},' ',{value:'time'},'.'],options:['plenty of','time'],answer:'plenty of'},'plenty of time表示时间充足；这仍是人物当时的判断。'),
q('v-neighbour','next door to的位置','next door to the station表示？',choice(['在车站旁边','在火车里面','在桥的下面'],'在车站旁边'),'根据整个短语理解位置，不能擅自改为站台内。'),
q('v-clock','钟表快慢词义','配好词义。',match([['slow','慢的'],['fast','快的'],['exact','准确的']]),'钟表快慢描述读数与实际时间的差异，不是列车速度。'),
q('v-cities','96课城市名称','配好三座城市。',match([['Geneva','日内瓦'],['Stockholm','斯德哥尔摩'],['Sydney','悉尼']]),'城市名称和旅行方向、时间需要分别核对。')
];
unit.questions.roles=[
q('r-tickets','购票数量与目的地','George要买什么？',choice(['两张去伦敦的往返票','一张去伦敦的单程票','两张去北京的票'],'两张去伦敦的往返票'),'保留Two、return和London三个条件。'),
q('r-leave','两种钟点表达指向同一时间','售票员说的发车时间是？',choice(['8:19','8:09','8:15'],'8:19'),'nineteen minutes past eight与eight nineteen都表示8:19。'),
q('r-route','站台及路线','原文怎样说明站台位置？',choice(['二号站台，过天桥','一号站台，不用过桥','三号站台，在酒吧里'],'二号站台，过天桥'),'不把站台编号、路线与发车时间混为一谈。'),
q('r-belief','人物判断与实际状态','谁先说“We’ve got plenty of time”？',choice(['Ken','George','售票员'],'Ken'),'Ken说时间充足；人物说法还须结合后面的事实。'),
q('r-place','酒吧位置与计划','Ken提议去哪里喝点东西？',choice(['车站旁的酒吧','火车里的餐车','已经抵达的伦敦旅馆'],'车站旁的酒吧'),'原文保留成人情境，不推断喝了哪一种饮品。'),
q('r-advice','had better的原文用途','George说“We had better go back…”是在做什么？',choice(['建议现在回车站','叙述昨天已经回去了','宣布下一班车已经到了'],'建议现在回车站'),'had better这里针对现在的建议，不是过去时叙事。'),
q('r-why','钟面与实际时间不同','为什么George看见8:15仍错过了8:19的车？',choice(['那个钟慢了十分钟','售票员说车要八点五分开','原文说他们买错了票'],'那个钟慢了十分钟'),'钟面落后实际时间，不能把George的读数直接当准确时间。'),
q('r-next','候车时长与故事边界','结尾明确告诉我们什么？',choice(['下一班车要五小时后才开','他们已经坐上下一班车','他们已经到达伦敦'],'下一班车要五小时后才开'),'不补写他们最终是否等车、上车或到达。')
];
unit.questions.grammar=[
g('base','had better接动词原形','用had better建议现在出发。',fill([blank('We had better','now.',['leave','to leave','left'])],['leave']),'had better后接原形，不加to。','看动词形式。',model(['You had better take a coat.','最好带件外套。'])),
g('negative','had better not的顺序','建议不要在这里等。',bank(['You','had better','not','wait here','don’t'],'You had better not wait here',4),'否定建议用had better not＋原形。','not放在better之后。',model(['We had better not miss the bus.','我们最好别错过公交车。'])),
g('time','had better指现在或将来','“You had better leave now.”说的是？',choice(['现在最好出发','昨天已经出发','从前每次都出发'],'现在最好出发'),'had better里的had不把建议变成过去的事。','根据now和整句含义判断。',model(['She had better call tomorrow.','建议明天打电话。'])),
g('short','缩略形式d代表had','把I had better缩略成哪一种？',choice(['I’d better','I’ll better','I’ve better'],'I’d better'),'这里’d是had，不是will或have。','保留better前的固定表达。',model(['We had better go. → We’d better go.','完整式和缩略式表达同一建议。'])),
g('subject','had better不随人称改变','给她一个建议：她最好早点回家。',fill([blank('She','go home early.',['had better','has better'])],['had better']),'换成she仍用had better。','不要套用has的三单变化。',model(['They had better wait. / He had better wait.','人称改变，had better不变。'])),
g('must','must表达必须遵守的要求','通知写“You must show your ticket.”是什么意思？',choice(['必须出示车票','不必出示车票','最好明天才买票'],'必须出示车票',{context:'Station rule: You must show your ticket.'}),'本句must表达必须遵守的要求。','先看通知中的要求。',model(['Class rule: You must be on time.','明确的课堂要求。'])),
g('rewrite','改写不等于语气完全相同','must改成had better，怎样理解变化？',choice(['从必须改为具体建议，不能说意思完全不变','任何场景中两者完全一样','had better只能表示昨天'],'从必须改为具体建议，不能说意思完全不变',{context:'We must go back. → We had better go back.'}),'保留动作，但必要性与说话意图改变。had better也可能带警告意味，不是一律轻松的建议。','比较“必须”和“最好”。',model(['You must stay here. / You had better stay here.','同一个动作，表达的要求不同。'])),
g('warning','具体建议与可能后果','车快开了，朋友说“You’d better hurry.”在提醒什么？',choice(['现在最好快一点，否则可能错过车','以后每天都必须跑步','昨天已经跑过了'],'现在最好快一点，否则可能错过车',{context:'The train leaves in three minutes.\nYou’d better hurry.'}),'had better可以带有不照做就可能出问题的提醒。','只判断这次出行的语境。',model(['It may rain. You’d better take an umbrella.','针对这次情境的建议。'])),
g('past','past表示过了几点','补出8:19的表达。',fill([blank('nineteen minutes','eight',['past','to'])],['past']),'past说某小时已经过了几分钟。','是八点以后，还是还没到八点？',model(['6:12 → twelve minutes past six','六点过十二分。'])),
g('to','to指向下一小时','7:57还差三分钟到哪一点？',choice(['eight','seven','nine'],'eight',{image:image('time-0757'),imageAlt:'钟面：分针指向57分钟，时针接近8'}),'three minutes to eight说差三分到八点。','to后面是将到的小时。',model(['4:50 → ten minutes to five','差十分到五点。'])),
g('slow','慢钟读数与实际时间','钟显示9:10，已知慢五分钟；实际是？',choice(['9:15','9:05','9:10'],'9:15',{context:'Clock shows: 9:10\nThe clock is five minutes slow.'}),'慢钟落后，实际时间比显示值晚五分钟。','先分清显示时间和实际时间。',model(['Shows 7:00; two minutes slow.','The exact time is 7:02.'])),
g('possessive','单复数时间所有格','一小时后、两小时后，按课本time结构填空。',fill([blank('in','time',["an hour’s","an hours’"]),blank('in','time',["two hours’","two hour’s"])],["an hour’s","two hours’"]),'一小时用hour’s；两个小时是hours’，撇号位置不同。','先看单数还是复数。',model(['in a day’s time / in three days’ time','按day的单复数放撇号。'])),
g('ago','ago与in的事件方向','资料说明已经做过和接下来要做，配好表达。',match([['two days ago','两天以前'],['in two days’ time','两天以后'],['at two o’clock','在两点钟']]),'ago在时长之后；未来时点可用in＋时长，at引出钟点。','先分时长与钟点。',model(['I left an hour ago. / I’ll return in an hour.','已离开与将返回分别说。'])),
g('future','96课未来回应换回动词原形','第二人的计划已明确，补全缩略式回应。',fill([blank('She’ll','to London in a week’s time.',['go','went'])],['go']),'will／’ll后用原形。不能从别人过去去过，推断第二人的计划。','计划在将来。',model(['Tom flew yesterday. Mia plans to fly tomorrow.','She’ll fly tomorrow.'])),
g('independent-negative','独立组织否定建议','用had better建议不要在这里停留。',bank(['We','had better','not','stay here','to'],'We had better not stay here',4),'We had better not stay here.是否定建议。'),
g('independent-rule','独立区分要求与建议','按两条通知的含义配好。',match([['You must bring your ticket.','必须带票'],['You had better take a coat.','最好带件外套'],['You had better not wait here.','最好不要在这里等']]),'形式相近，具体要求与建议的意义不同。'),
g('independent-ago','独立处理过去与将来','昨天已经出发；明天才返回。',fill([blank('He','yesterday.',['left','will leave']),blank('He’ll','tomorrow.',['return','returned'])],['left','return']),'依据明确事件时间用过去式或will＋原形。'),
g('independent-question','独立提问下一班发车时间','下一班火车什么时候开？',bank(['When','will','the next train','leave','did'],'When will the next train leave',4,'?'),'When will the next train leave?问未来发车时间。')
];
unit.questions.apply=[
q('a-tickets','按两条条件选择车票','根据旅客请求，选对车票。',choice(['Two return tickets to London','One return ticket to London','Two single tickets to London'],'Two return tickets to London',{context:'Two people will go to London and come back.\nThey each need a return ticket.'}),'同时核对人数、目的地与往返。'),
q('a-slow','显示时间不能直接决定赶车','钟面10:20，慢十分钟；下一班10:40开。还剩多久？',choice(['10 minutes','20 minutes','30 minutes'],'10 minutes',{context:'Clock shows: 10:20\nThe clock is ten minutes slow.\nNext train leaves: 10:40 (exact time)'}),'实际10:30，所以距10:40还有十分钟。'),
q('a-platform','从路线材料选下一句','乘客问Which platform?，按通知回答。',choice(['Platform Three. Over the bridge.','At ten forty.','Three tickets, please.'],'Platform Three. Over the bridge.',{context:'London train\nPlatform Three\nGo over the bridge.'}),'问站台，回答站台和路线，不答钟点或票数。'),
q('a-advice','针对后果给具体建议','雨快来了；用had better提醒同伴带伞。',bank(['You','had better','take','an umbrella','to'],'You had better take an umbrella',4),'根据已给语境形成建议，不把它当车站规定。'),
q('a-wait','用否定建议回应情境','这里太吵，朋友想找安静地方等。用had better回应。',choice(['We had better not wait here.','We had better waiting here.','We have better wait here.'],'We had better not wait here.',{context:'It is very noisy here.\nWe want a quiet place to wait.'}),'not在better后，wait用原形。'),
q('a-calendar','月份按日历而非固定天数','故事今天是2026年11月15日，计划两个月后的同日去Rome。是哪一天？',choice(['2027年1月15日','2026年12月15日','2026年9月15日'],'2027年1月15日',{context:'Today: 15 November 2026\nPlan: Rome, in two months’ time, on the same day of the month.'}),'跨年按月历顺序，不把两个月一律当六十天。'),
q('a-reply','96课回应按新主语与计划','别人上月去了Sydney；你的计划如下，用I’ll回答。',choice(['I’ll go to Sydney in a month’s time.','I went to Sydney a month ago.','She’ll go to Sydney in a month’s time.'],'I’ll go to Sydney in a month’s time.',{context:'Friend: I went to Sydney a month ago. What about you?\nYour plan: Sydney, in a month’s time.'}),'新计划和主语都给明；过去经历不能替第二人作计划。'),
q('a-fast','快钟的时间修正','腕表显示14:20，快五分钟。准确时间是什么？',choice(['14:15','14:25','14:20'],'14:15',{context:'Watch shows: 14:20\nThe watch is five minutes fast.'}),'快表超前，准确时间比读数早五分钟。')
];
unit.questions.exam=[
q('e-story','原文证据与结局','哪一项得到课文支持？',choice(['钟慢了十分钟，他们错过了原定的火车','两人已经乘下一班车到伦敦','乘务员把发车时间改了'],'钟慢了十分钟，他们错过了原定的火车'),'不额外补写列车改时或成功到达。'),
q('e-words','车站语境词义迁移','配好含义。',match([['a return ticket','一张往返票'],['catch the train','赶上火车'],['miss the train','错过火车']]),'return ticket不是退票。'),
q('e-bridge','原文路线词义定位','点出表示“过桥”的短语。',{type:'locate',fragments:[{value:'Platform Two'},'. ',{value:'Over the bridge'},'.'],options:['Platform Two','Over the bridge'],answer:'Over the bridge'},'Over the bridge给路线，Platform Two给站台编号。'),
q('e-base','独立建议的动词形式','建议他现在打电话：He’d better…',fill([blank('He’d better','now.',['call','calls','to call'])],['call']),'had better后用原形。'),
q('e-negative','独立否定建议','建议她不要把包留在这里。',bank(['She','had better','not','leave','her bag here','to'],'She had better not leave her bag here',5),'not放在better后，leave仍为原形。'),
q('e-had','had不是过去事件标记','“We’d better go tomorrow.”说明什么？',choice(['建议明天去','昨天去了','明天一定已经去过'],'建议明天去'),'’d better是had better，仍能说将来的建议。'),
q('e-subject','人称不改变had better','补全给他们的建议。',fill([blank('They','be careful.',['had better','have better'])],['had better']),'无论主语单复数都使用had better。'),
q('e-must','必须遵守的规定','规则写Visitors must show a ticket.是什么意思？',choice(['访客必须出示票','访客不必出示票','访客最好昨天买票'],'访客必须出示票'),'本句must表达要求。'),
q('e-meaning','改写的交际意义','把You must wait.改成You had better wait.，哪项准确？',choice(['等待的动作保留，但变成建议表达','意思和语气在所有情境都完全相同','变成已经等过的过去事实'],'等待的动作保留，但变成建议表达'),'96课A训练结构变化，不宣称完全同义。'),
q('e-specific','had better的后果提醒','“The last bus leaves soon. You’d better leave now.”是在？',choice(['针对这次赶车给建议，晚走可能赶不上','制定所有人每天出门的固定规则','报告他昨天已经坐过公交车'],'针对这次赶车给建议，晚走可能赶不上'),'读具体情境，不给情态表达排绝对强弱等级。'),
q('e-clock','从清楚钟面读具体分钟','图中的钟显示几点？',choice(['10:17','10:07','11:17'],'10:17',{image:image('time-1017'),imageAlt:'钟面，分针指向17分钟，时针在10和11之间'}),'分针17分，时针刚过10。'),
q('e-to','差几分到下一小时','five minutes to six对应？',choice(['5:55','6:05','6:55'],'5:55'),'差五分到六点，小时仍为五点。'),
q('e-slow','跨小时慢钟修正','钟显示7:55，慢十分钟，准确时间是？',choice(['8:05','7:45','7:55'],'8:05',{context:'Clock shows: 7:55\nThe clock is ten minutes slow.'}),'实际比显示晚十分钟，并跨过八点整。'),
q('e-fast','快表读数与准确时间','表显示11:03，快三分钟；准确时间是？',choice(['11:00','11:06','11:03'],'11:00',{context:'Watch shows: 11:03\nThe watch is three minutes fast.'}),'快表显示超前，准确时间应减三分钟。'),
q('e-duration','准确时间到发车的时长','上午准确时间9:45，列车9:50开。补全回应。',choice(['In five minutes’ time.','Five minutes ago.','In fifty minutes’ time.'],'In five minutes’ time.',{context:'Exact time now: 9:45 a.m.\nNext train leaves: 9:50 a.m.'}),'注意说时长以后，不把9:50当五十分钟。'),
q('e-possessive','单复数时间表达','按time结构填好一周后与两周后。',fill([blank('in','time',["a week’s","a weeks’"]),blank('in','time',["two weeks’","two week’s"])],["a week’s","two weeks’"]),'单数加’s；以s结尾的复数只加撇号。'),
q('e-ago','过去经历与未来安排','资料分别给出已做和计划；补全动词。',fill([blank('She','to Paris two days ago.',['flew','will fly']),blank('She’ll','to Rome in two days’ time.',['fly','flew'])],['flew','fly']),'ago对应给定过去经历，明确将来计划用’ll＋原形。'),
q('e-question','独立按目标提问','问下一班车什么时候开。',bank(['What time','will','the next train','leave','did'],'What time will the next train leave',4,'?'),'What time will…与When will…都可问发车时间；按给定词块组织。'),
q('e-plenty','plenty of后可接可数或不可数名词','补好两个充足的量。',fill([blank('plenty','time',['of','to']),blank('plenty of','for everyone',['tickets','ticket'])],['of','tickets']),'plenty of可接time等不可数名词或tickets等可数复数。'),
q('e-calendar','跨年月份不按固定天数','今天为2026年12月10日，一个月后的同日是？',choice(['2027年1月10日','2026年11月10日','2027年2月10日'],'2027年1月10日',{context:'Today: 10 December 2026\nPlan: in a month’s time, on the same day of the month.'}),'按日历取下一月同日，原参照固定。'),
q('e-96b','96课第二人称转复数回应','Tom和Mary已经去了；你和Jean明确下月去London。以We’ll回应。',choice(['We’ll go to London in a month’s time.','They went to London a month ago.','We’ll went to London in a month’s time.'],'We’ll go to London in a month’s time.',{context:'Your plan with Jean: London, in a month’s time.'}),'新主语是We，will后用go。'),
q('e-boundary','12小时读数不提供上午下午','原文只说“eight fifteen”，仅凭这句能确定上午还是下午吗？',choice(['不能，还需要上午或下午的依据','能，所有eight都是上午','能，所有火车只在下午开'],'不能，还需要上午或下午的依据'),'十二小时钟面本身不含上午／下午；另设材料要明示，不替原文添加。')
];
unit.learning.REFERENCE=[
'had better＋动词原形给具体情境的建议，常含不照做可能产生问题的意味；它可以很郑重，不把它简单教成永远比must轻。had保持不变，谈现在或将来：She had better go now.／We’d better leave tomorrow.',
'否定建议用had better not＋原形：You’d better not wait here. 这里’d是had；不用has better，也不在better后加to。',
'must在本课表达必须做的事，had better表达具体建议。96课A按教材改写结构，动作保留但表达的要求发生变化，不能一概称完全同义。判断选择时题面会说明要表达建议还是要求；不把另一种在别的语境可用的句子说成普遍语法错误。',
'past是某点过了几分钟，to是还差几分钟到下一小时：8:19＝nineteen minutes past eight；7:57＝three minutes to eight。数字读法eight nineteen也成立。十二小时的读数本身不说明上午下午。',
'先分清钟面显示与准确时间：慢钟落后，要把落后的分钟加回；快表超前，要减去超前的分钟。再用准确时间核对发车时间。原文8:15、慢10分钟，可推出实际8:25；课文未明说上午或下午，也未说明最后是否上车。',
'ago放时长之后说过去；in＋时长说从给定参照起多久以后。使用time时：in a minute’s time／in two minutes’ time；in an hour’s time／in two hours’ time。省略time的in two hours也正确，不把教材指定练法变成唯一合法表达。',
'When did…?问过去经历，When will…?／What time will…?问未来安排；did和will后用原形。96课B按给定提示改变回应主语和时间，不能从第一人过去做过推断第二人一定计划去做。',
'plenty of既可接time等不可数名词，也可接tickets等可数复数。return ticket的return表示往返，与上一课动词return的词义分开。原文bar为成人场景；课堂发音、书写和真实交流由教师组织。'
];
unit.learning.MODEL_TITLE='课本小参考 · 钟面、时间与15座城市';
unit.learning.TIMES=[['过去','将来'],['a minute / two minutes ago','in a minute’s / two minutes’ time'],['an hour / two hours ago','in an hour’s / two hours’ time'],['a day / two days ago','in a day’s / two days’ time'],['a week / two weeks ago','in a week’s / two weeks’ time'],['a month / two months ago','in a month’s / two months’ time'],['a year / two years ago','in a year’s / two years’ time']];
unit.learning.CLOCKS=Array.from({length:12},(_,i)=>({ordinal:i+1,image:'/assets/unit95-96/textbook-clock-'+String(i+1).padStart(2,'0')+'.webp'}));
unit.learning.MODELS=['Athens','Beijing','Berlin','Mumbai','Geneva','London','Madrid','Moscow','New York','Paris','Rome','Seoul','Stockholm','Sydney','Tokyo'].map(en=>{const w=WORDS.find(w=>w.en===en);return{en,cn:w.cn,image:w.image};});
unit.learning.WRITING=[
{title:'A · 用had better改写',instruction:'保留课本6题。按例子练建议的结构；must到had better会改变必要性与语气，不称意思完全相同。',examples:['We must go back to the station. → We had better go back to the station.'],items:['I must stay here.','We must wait for him.','You must call a doctor.','They must go home.','She must hurry.','You must be careful.']},
{title:'B · 按给定计划用’ll回应',instruction:'保留课本4题与3组示例。括号给第二人的将来计划；保持目的地，核对回应主语、动词原形和时间所有格。',examples:['I went to Beijing a year ago. What about you? / a year’s time → I’ll go to Beijing in a year’s time.','Tom flew to Stockholm two weeks ago. What about Pamela? / two weeks’ time → She’ll fly to Stockholm in two weeks’ time.','Dave and Alan returned to Tokyo two days ago. What about you and Jean? / two days’ time → We’ll return to Tokyo in two days’ time.'],items:['I went to Sydney a month ago. What about you? (a month’s time)','A train left for Geneva an hour ago. What about the next one? (an hour’s time)','Carol flew to Beijing two days ago. What about you? (two days’ time)','Tom and Mary went to London an hour ago. What about you and Jean? (an hour’s time)']}
];
core.unit9596=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit9596,excerpts={"u9596-v1-r-tickets":[0,1],"u9596-v1-r-leave":[0,1],"u9596-v1-r-route":[2,3],"u9596-v1-r-belief":[4,5,6,7],"u9596-v1-r-place":[6,7,8],"u9596-v1-r-advice":[8,9],"u9596-v1-r-why":[10,11,12,13,14],"u9596-v1-r-next":[12,13,14,15,16],"u9596-v1-e-story":[10,11,12,13,14,15,16]},speakers={"george":"George","attendant":"售票员","ken":"Ken","porter":"乘务员"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 95',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
