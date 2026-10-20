(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit69-70/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页138–141／PDF171–174';
const grammarSource='《同步导学》Grammar纸页125／PDF139；《语法练习册》纸页195–198／PDF209–212';
const months=[['January','一月','/ˈdʒænjuəri/','Jan.'],['February','二月','/ˈfebruəri/','Feb.'],['March','三月','/mɑːtʃ/','Mar.'],['April','四月','/ˈeɪprəl/','Apr.'],['May','五月','/meɪ/','May'],['June','六月','/dʒuːn/','Jun.'],['July','七月','/dʒuˈlaɪ/','Jul.'],['August','八月','/ˈɔːɡəst/','Aug.'],['September','九月','/sepˈtembə/','Sept.'],['October','十月','/ɒkˈtəʊbə/','Oct.'],['November','十一月','/nəʊˈvembə/','Nov.'],['December','十二月','/dɪˈsembə/','Dec.']];
const rows=[
['year','年','/jɪə/','year'],['race','比赛','/reɪs/','race'],['town','城镇','/taʊn/','town'],['crowd','人群','/kraʊd/','crowd'],['stand','站立','/stænd/','stand'],['exciting','使人激动的','/ɪkˈsaɪtɪŋ/','exciting'],['just','正好，恰好','/dʒʌst/','just'],['finish','结尾，结束','/ˈfɪnɪʃ/','finish'],['winner','获胜者','/ˈwɪnə/','winner'],['behind','在……之后','/bɪˈhaɪnd/','behind'],['way','路途','/weɪ/','way'],['stationer','文具商','/ˈsteɪʃənə/','stationer'],['Denmark','丹麦','/ˈdenmɑːk/','denmark'],
...months.map(([en,cn,ph])=>[en,cn,ph,en.toLowerCase()]),
['Australia','澳大利亚','/ɒˈstreɪliə/','australia'],['Austria','奥地利','/ˈɒstriə/','austria'],['Canada','加拿大','/ˈkænədə/','canada'],['China','中国','/ˈtʃaɪnə/','china'],['Finland','芬兰','/ˈfɪnlənd/','finland'],['India','印度','/ˈɪndiə/','india'],['Poland','波兰','/ˈpəʊlənd/','poland'],['Turkey','土耳其','/ˈtɜːki/','turkey'],['Japan','日本','/dʒəˈpæn/','japan'],['Nigeria','尼日利亚','/naɪˈdʒɪəriə/','nigeria'],
['hundreds of','数以百计的','/ˈhʌndrədz əv/','hundreds'],['on the way home','在回家的路上','/ɒn ðə weɪ həʊm/','way'],['morning','早晨，上午','/ˈmɔːnɪŋ/','morning'],['afternoon','下午','/ˌɑːftəˈnuːn/','afternoon'],['evening','傍晚，晚上','/ˈiːvnɪŋ/','evening'],['night','夜晚','/naɪt/','night'],['noon','正午','/nuːn/','noon']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit69-70',version:1,contentRevision:'race-album-v1',mode:'classroom',title:'赛车日的时光相册',path:'/unit69-70/',start:'learn/words',progress:{learningKey:'canran:unit69-70:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'走进赛车场',activities:[['words','赛车小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'翻开观赛相册',activities:[['text','赛车日小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'把时间说准确',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'整理观赛记录',activities:[['apply','时间小记录员','give']],required:['apply']},
{id:'l5',title:'完成赛车挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'race-album-v1',title:'赛事小记录员',lesson:'Lesson 69–70',scene:'/assets/unit69-70/keepsake-story-v1.webp',alt:'穿湖蓝外套的叙述者与珊瑚背带裙的妻子在栏杆后观看15号赛车冲线',color:'#4b7484',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','时间小记录员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={narrator:'我 · 叙述者',wife:'我的妻子'};
unit.learning.DIALOGUE=[
['narrator','There is a car race near our town every year. In 1995, there was a very big race.','我们镇子附近每年都有一场汽车比赛。1995年举行了一次盛大的比赛。'],
['narrator','There were hundreds of people there. My wife and I were at the race. Our friends Julie and Jack were there, too. You can see us in the crowd. We are standing on the left.','那里有数以百计的人。我和妻子、朋友Julie和Jack都在赛场。你能在人群中看见我们，我们站在左边。'],
['narrator','There were twenty cars in the race. There were English cars, French cars, German cars, Italian cars, American cars and Japanese cars.','20辆汽车参加了比赛，有英国、法国、德国、意大利、美国和日本的汽车。'],
['narrator','It was an exciting finish. The winner was Billy Stewart. He was in car number fifteen. Five other cars were just behind him.','结尾激动人心。获胜者是Billy Stewart，他驾驶15号车，另外5辆车紧随其后。'],
['narrator','On the way home, my wife said to me, “Don’t drive so quickly! You’re not Billy Stewart!”','回家途中，妻子对我说：“别开这么快！你可不是Billy Stewart！”']
].map(([who,text,cn],i)=>({id:'u6970-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u6970-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});const blank=(before,after,options=['at','on','in'])=>({before,after,options});const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-race','从图识别比赛','图中正在进行什么？',choice(['a car race','a birthday party','a school lesson'],'a car race',{image:image('race'),imageAlt:'两辆参赛汽车'}),'race在这里指比赛。'),
q('v-nouns','区分人群与获胜者','把三个词和意思配好。',match([['crowd','人群'],['winner','获胜者'],['town','城镇']]),'人群、获胜者和城镇各不相同。'),
q('v-finish','在语境中理解finish','an exciting finish 指什么？',choice(['激动人心的结尾','安静的开始','一位司机'],'激动人心的结尾'),'finish在这里是名词，表示比赛结尾。'),
q('v-behind','根据行进方向理解behind','两车向右行驶，蓝车在红车后面。选出完整描述。',choice(['The blue car is behind the red car.','The red car is behind the blue car.','The blue car is in front of the red car.'],'The blue car is behind the red car.',{image:image('behind'),imageAlt:'箭头向右，蓝车在左，红车在右'}),'behind表示后面。'),
q('v-just','理解just在原文中的作用','Five other cars were just behind him. 中just表示什么？',choice(['正好，紧紧地','昨天','从来没有'],'正好，紧紧地'),'just behind him表示就在他后面。'),
q('v-months','区分相近的月份拼写','把三个容易看混的月份配好。',match([['January','一月'],['June','六月'],['July','七月']]),'January是一月，June六月，July七月。'),
q('v-flag','识别丹麦国旗与名称','这面红底白色十字国旗属于哪里？',choice(['Denmark','Finland','Japan'],'Denmark',{image:image('denmark'),imageAlt:'红底，白色北欧十字的国旗'}),'Denmark是丹麦。'),
q('v-way','理解回家途中的短语','on the way home 表示什么？',choice(['在回家的路上','已经坐在家里','在学校里'],'在回家的路上'),'这里home前不加to。')
];
unit.questions.roles=[
q('r-when','区分惯常赛事与某次回忆','这篇故事回忆哪一年的大赛？',choice(['1995','每一年都同一场','今天'],'1995'),'every year说习惯；In 1995引出某次比赛。'),
q('r-people','核对观赛人物','哪些人一起到了赛场？',choice(['叙述者、妻子、Julie和Jack','只有Billy和叙述者','只有妻子和Julie'],'叙述者、妻子、Julie和Jack'),'朋友Julie和Jack也去了。'),
q('r-left','在图文中定位left','相册里，叙述者一行站在人群哪边？',choice(['on the left','on the right','in car fifteen'],'on the left'),'We are standing on the left描述照片中的位置。'),
q('r-count','区分参赛车数与车号','这场比赛共有多少辆参赛车？',choice(['twenty','fifteen','five'],'twenty'),'20是总车数；15是获胜车号。'),
q('r-origins','提取多国参赛信息','原文是否只提到英国汽车？',choice(['不是，还提到法国、德国等国家的汽车','是，全部都是英国汽车','没有提到英国汽车'],'不是，还提到法国、德国等国家的汽车'),'原文列出六个国家的汽车。'),
q('r-winner','对应获胜者与车号','哪一组获胜信息正确？',choice(['Billy Stewart · car 15','Jack · car 20','叙述者 · car 5'],'Billy Stewart · car 15'),'获胜的是Billy Stewart，驾驶15号车。'),
q('r-follow','区分紧随车数与总车数','Five other cars were just behind him. 能说明什么？',choice(['另外5辆车紧随Billy之后','比赛总共只有5辆车','Billy驾驶5号车'],'另外5辆车紧随Billy之后'),'five修饰紧随的其他汽车，不是车号。'),
q('r-reminder','理解妻子的回家提醒','妻子说You’re not Billy Stewart!，想提醒丈夫什么？',choice(['别把回家当比赛，别开太快','丈夫就是比赛冠军','再买一辆赛车'],'别把回家当比赛，别开太快'),'提醒发生在回家途中。')
];
unit.questions.grammar=[
g('clock','钟点用at','补好记录中的钟点。',fill([blank('The race starts','three o’clock.')],['at']),'明确钟点前通常用at。','看这里表示几时。',model(['We meet at eight o’clock.','我们八点见。'])),
g('meals','noon与用餐时间','补好两个时间短语。',fill([blank('We meet','noon.'),blank('We talk','lunchtime.')],['at','at']),'at noon、at lunchtime是常用表达。','这里不是某个月或某一天。',model(['We talk at breakfast.','我们早餐时聊天。'])),
g('day','星期与具体日期用on','补好星期与日期。',fill([blank('The race is','Sunday.'),blank('We meet','March 23rd.')],['on','on']),'具体哪一天前用on。','两处都能落到某一天。',model(['She was here on Monday.','她星期一在这里。'])),
g('morning','一般上午与特定上午','比较这两个上午。',fill([blank('I work','the morning.'),blank('I was there','Tuesday morning.')],['in','on']),'一般时段用in；指定某一天的时段用on。','留意有没有指定星期。',model(['in the afternoon / on Friday afternoon','一般下午／星期五下午'])),
g('season','季节与年份用in','补好季节和年份。',fill([blank('The race is','spring.'),blank('It was exciting','1995.')],['in','in']),'季节、年份前通常用in。','比一天更长的时间范围。',model(['We were there in winter, in 2004.','我们2004年冬天在那里。'])),
g('month-century','月份与世纪用in','补好月份和世纪。',fill([blank('We meet','August.'),blank('That race was','the twentieth century.')],['in','in']),'月份、世纪前通常用in。','century表示世纪。',model(['in April / in the twenty-first century','在四月／在二十一世纪'])),
g('age','年龄的at表达','表示“在七岁时”。',fill([blank('She was at school','the age of seven.')],['at']),'at the age of…表示在某年龄时。','把the age of看成完整表达。',model(['at the age of ten','在十岁时'])),
g('holiday-period','一段假期用in','补好这两段假期。',fill([blank('We meet','Easter week.'),blank('We travel','the holidays.')],['in','in']),'week与holidays在这里表示一段时间，用in。','留意这里不是节日当天。',model(['in the summer holidays','在暑假期间'])),
g('night','night惯用表达','补好夜晚与正午。',fill([blank('It is dark','night.'),blank('We eat','noon.')],['at','at']),'at night与at noon按常用搭配记。','不要把所有一天中的时段都机械配in。',model(['at night: 在夜晚','in the evening: 在傍晚、晚上'])),
g('abbrev','辨认月份缩写','给月份缩写找到全名。',match([['Feb.','February'],['Sept.','September'],['Nov.','November']]),'本书使用这些缩写；全名首字母也大写。','比较缩写开头的字母。',model(['Oct. → October','十月'])),
g('capital','月份首字母大写','按常规书写（首字母大写，其余小写）补好月份。',fill([blank('The race is in','.', ['September','september','SEPTEMBER'])],['September']),'常规句子中的月份名称首字母大写。','这里不是全大写标题。',model(['It is June.','月份首字母用大写。'])),
g('ordinal','日期序数词','6月23日，补全日期。',fill([blank('June','',['23rd','23th','23nd'])],['23rd']),'23用twenty-third，写作23rd。','3对应third，13是thirteenth。',model(['May 21st → May the twenty-first','5月21日'])),
g('date-read','日期的两种读法','October 1st 可以怎样读？',choice(['October the first / the first of October','October one / one of October','October the third / the third of October'],'October the first / the first of October'),'读日期时使用序数词，可先月后日或先日后月。','first表示一日。',model(['June 2nd → June the second / the second of June','同一天有两种读法。'])),
g('date-order','识别两种年月日顺序','January 17th, 2012 和 17th January 2012 有什么关系？',choice(['同一个日期，两种顺序','前者是一月，后者是七月','前者是17年，后者是2012年'],'同一个日期，两种顺序'),'月份名称清楚，两种顺序都可表示2012年1月17日。','先分别找到月份、日、年。',model(['March 4th, 2010 = 4th March 2010','两种顺序表示同一天。'])),
g('date-bank','在完整句子中写日期','拼出：我们6月23日在这里。',bank(['We','were','here','on','June 23rd','in'],'We were here on June 23rd',5),'具体日期前用on，月份大写。','先找主语，再找地点和时间。',model(['They were there on May 2nd.','他们5月2日在那里。'])),
g('zero','last与this前不加介词','补好完整时间表达。',fill([blank('We were there','last year.',['不填','at','in']),blank('We meet','this Friday.',['不填','on','in'])],['不填','不填']),'last year、this Friday直接作时间状语，不再加介词。','注意整个短语以last或this开头。',model(['She was here yesterday.','yesterday前不加时间介词。'])),
g('locate','在句中定位时间介词','哪个词连接了年份2004？',{type:'locate',fragments:['We ',{value:'were'},' ',{value:'at'},' the race ',{value:'in'},' 2004.'],options:['were','at','in'],answer:'in'},'in 2004中的in表示年份前的时间介词。','找紧挨年份前面的词。',model(['on Monday中的on连接星期','同一个介词也可能表示地点。'])),
g('festival','节日期间与具体节日','比较圣诞期间与圣诞节当天。',fill([blank('We meet','Christmas.'),blank('We meet','Christmas Day.')],['at','on']),'at Christmas指圣诞期间；on Christmas Day指当天。','Day使它明确成某一天。',model(['at the Spring Festival / on New Year’s Day','春节期间／元旦当天'])),
g('transfer','撤去示范组合时间地点','补好一次访问记录。',fill([blank('We were','the stationer’s in July.'),blank('They were in Denmark','July.')],['at','in']),'商店地点与月份分别用at和in。','先分清空后是地点还是时间。'),
g('schedule','撤去示范读取日期资料','赛票：Date — May 25th；Time — 4 p.m.\n问“在哪一天”，应怎样回答？',choice(['On May 25th.','At four o’clock.','In May only.'],'On May 25th.'),'具体日期回答是哪一天，钟点回答几点。','题目要哪一天，不是几点。')
];
unit.questions.apply=[
q('a-record','依据资料记录时间地点','参观记录：Ben + Amy · Denmark · October\n补成一句完整的话。',fill([blank('They were','Denmark in October.'),blank('They were in Denmark','October.')],['in','in']),'国家与月份前这里都用in。','同一介词可承担不同作用。'),
q('a-stamp','核对票根后完成记录','票根：April 24th · 3 p.m.\n选对记录，再给票根盖章。',choice(['on April 24th at three o’clock','in April 24th on three o’clock','at April 24th in three o’clock'],'on April 24th at three o’clock'),'日期用on，钟点用at。','把日期和钟点分别核对。'),
q('a-we','说话人自己与同伴用we','你和Penny在七月去了Australia。\nWhere were you and Penny in July?',choice(['We were in Australia.','They were in Australia.','We were in Austria.'],'We were in Australia.'),'回答包含自己的you and Penny时用we。','回答中要包括你自己。'),
q('a-they','第三方人物用they','Sam和Penny周一在文具店。\nWhere were Sam and Penny on Monday?',choice(['They were at the stationer’s.','We were at the stationer’s.','They were in Denmark.'],'They were at the stationer’s.'),'谈第三方Sam与Penny时用they。'),
q('a-when','据日期提出When问句','你知道他们在丹麦，想问“哪个月”。拼出问句。',bank(['When','were','they','in Denmark','Where'],'When were they in Denmark',4,'?'),'When询问时间。','地点已经知道了。'),
q('a-repair','否定错误记录并说明实际地点','记录：Tom and Sue — park，not race。\nWere Tom and Sue at the race?',choice(['No, they weren’t. They were at the park.','Yes, they were. They were at the race.','No, we weren’t. We were at the park.'],'No, they weren’t. They were at the park.'),'先否定，再说明材料中的实际地点。'),
q('a-specific','识别具体某天的上午','相册标签：Sunday morning。应选哪一个？',choice(['on Sunday morning','in Sunday morning','at Sunday morning'],'on Sunday morning'),'这是星期日的上午，用on。'),
q('a-date-order','从资料选择完整年月日','资料：Year 2017 · Month 6 · Day 26\n哪张日期标签正确？',choice(['26th June 2017','June 27th, 2017','26th July 2017'],'26th June 2017'),'June是六月，26th是二十六日。')
];
unit.questions.exam=[
q('e-nouns','独立辨认赛场词义','把三个词配好。',match([['race','比赛'],['crowd','人群'],['winner','获胜者']]),'按词义对应。'),
q('e-hundreds','不确定数量与确数','hundreds of people 与 five hundred people 的区别是？',choice(['前者数以百计；后者500人','两者都恰好100人','前者500人；后者不确定'],'前者数以百计；后者500人'),'确数five hundred不加s与of。'),
q('e-stationer','识别文具商和文具店','图里卖笔和本子。这是哪家店？',choice(['the stationer’s','the butcher’s','the dairy'],'the stationer’s',{image:image('stationers'),imageAlt:'店内摆着铅笔、钢笔与本子'}),'stationer是文具商，the stationer’s是文具店。'),
q('e-months','独立辨认后半年月份','给月份配中文。',match([['August','八月'],['October','十月'],['December','十二月']]),'这些是不同的月份。'),
q('e-year','综合区分习惯与过去','课文every year和In 1995分别说明什么？',choice(['每年有比赛；故事回忆1995年那次','故事中比赛持续了1995年','1995是冠军车号'],'每年有比赛；故事回忆1995年那次'),'习惯与某次过去事件分开。'),
q('e-numbers','综合数字角色','把故事中的数字与含义配好。',match([['20','参赛车总数'],['15','冠军车号'],['5','紧随冠军的其他汽车数']]),'三个数字不能互换。'),
q('e-photo','回忆与照片中的现在进行时','We are standing on the left. 在故事中说明什么？',choice(['照片中我们站在左边','比赛一定在今天举行','Billy正在家里'],'照片中我们站在左边'),'描述相册画面不改变1995的回忆时间。'),
q('e-winner','独立区分叙述者与冠军','妻子说You’re not Billy Stewart!，you指谁？',choice(['她的丈夫，即叙述者','Billy Stewart','Jack'],'她的丈夫，即叙述者'),'她是在对丈夫说话。'),
q('e-finish','理解结尾与位置','It was an exciting finish. 指什么？',choice(['比赛结尾激动人心','比赛从来没有结束','参赛车全在家里'],'比赛结尾激动人心'),'exciting形容比赛结尾。'),
q('e-clock','独立运用钟点','补好比赛时间。',fill([blank('The race starts','half past two.')],['at']),'钟点前用at。'),
q('e-season-year','独立运用季节与年份','补好回忆的时间。',fill([blank('We were there','summer.'),blank('It was a big race','2004.')],['in','in']),'季节和年份用in。'),
q('e-century','独立运用世纪','补好世纪表达。',fill([blank('The 1995 race was','the twentieth century.')],['in']),'表示世纪用in。'),
q('e-age','独立运用年龄表达','补好年龄。',fill([blank('He was at school','the age of six.')],['at']),'at the age of six表示六岁时。'),
q('e-meal','独立运用用餐时间','补好时间短语。',fill([blank('We talk','breakfast.')],['at']),'用餐时间前用at。'),
q('e-day','独立运用星期与日期','补好这两天。',fill([blank('They were there','Thursday.'),blank('We were there','February 22nd.')],['on','on']),'星期与具体日期用on。'),
q('e-morning','区分普通时段与特定时段','补好两个时段。',fill([blank('I study','the afternoon.'),blank('We met','Friday afternoon.')],['in','on']),'指定星期的下午用on。'),
q('e-night','独立辨认night','补好晚上表达。',fill([blank('We were at home','night.')],['at']),'at night是惯用表达。'),
q('e-abbrev','独立辨认月份缩写','Mar.、Apr.、Nov.依次是什么月份？',choice(['March · April · November','May · August · November','March · April · December'],'March · April · November'),'按月份名称识别缩写。'),
q('e-ordinal','日期序数变体','补好日期。',fill([blank('January','',['21st','21th','21nd']),blank('February','',['22nd','22th','22rd'])],['21st','22nd']),'21st和22nd分别对应二十一日与二十二日。'),
q('e-reading','独立读日期','April 24th 的正确读法是哪组？',choice(['April the twenty-fourth / the twenty-fourth of April','April the twenty-first / the twenty-first of April','April twenty / twenty of April'],'April the twenty-fourth / the twenty-fourth of April'),'日期用序数词。'),
q('e-same-date','独立确认年月日顺序','哪组表示同一天？',choice(['May 25th, 2020 = 25th May 2020','May 25th, 2020 = 25th June 2020','May 25th, 2020 = 24th May 2020'],'May 25th, 2020 = 25th May 2020'),'日月顺序可以变化，但日、月、年都要相同。'),
q('e-zero','独立运用零介词','补好时间表达。',fill([blank('They were in Canada','last September.',['不填','on','in'])],['不填']),'last September前不再加时间介词。'),
q('e-holiday','独立区分节日与当天','补好两个时间。',fill([blank('We meet','Christmas.'),blank('We meet','Christmas Day.')],['at','on']),'圣诞期间用at，特定当天用on。'),
q('e-period','独立运用一段假期','补好时间范围。',fill([blank('We meet','Easter week.'),blank('We travel','the holidays.')],['in','in']),'week和holidays在这里表示一段时间，用in。'),
q('e-we','综合时间地点与视角','你和Sam的记录：school · February 22nd。哪句符合？',choice(['We were at school on February 22nd.','They were at school in February 22nd.','We were in Canada on February 22nd.'],'We were at school on February 22nd.'),'包括自己用we；学校活动地点at school，日期on。'),
q('e-they','综合第三方与国家月份','记录：Sam and Penny · Austria · August。拼好句子。',bank(['They','were','in Austria','in August','We','on August'],'They were in Austria in August',4),'第三方用they，国家与月份前均用in。'),
q('e-safety','把提醒放回场景','故事末尾，妻子在回家途中会说哪句？',choice(['Don’t drive so quickly!','Drive faster than Billy!','You are Billy Stewart!'],'Don’t drive so quickly!'),'不要把公共道路当赛道。'),
q('e-integrate','综合日期地点与钟点资料','记录：Ann and Jack · the office · March 23rd · 4 p.m.\n哪句完整符合？',choice(['They were at the office on March 23rd at four o’clock.','We were at the office in March 23rd on four o’clock.','They were in Denmark on March 23rd at four o’clock.'],'They were at the office on March 23rd at four o’clock.'),'同时核对人物、地点、日期和钟点。')
];
unit.learning.MONTHS=months.map(([en,cn,ph,short])=>({en,cn,ph,short,image:image(en.toLowerCase())}));
unit.learning.MODELS=[
...['Monday|the stationer’s|stationers','Tuesday|the greengrocer’s|greengrocers','Wednesday|the hairdresser’s|hairdressers','Thursday|the butcher’s|butchers','Friday|the grocer’s|grocers','Saturday|the dairy|dairy'].map(x=>{const[t,p,art]=x.split('|');return{en:'When were they at '+p.replace(/^the /,'the ')+'?',result:'They were there on '+t+'.',cn:'星期与商店',label:t+' · '+p,image:image(art)};}),
...['January 21st|church|church','February 22nd|school|school','March 23rd|home|home','April 24th|the baker’s|bakers','May 25th|the hairdresser’s|hairdressers','June 26th|the butcher’s|butchers'].map(x=>{const[t,p,art]=x.split('|');return{en:'Where were they on '+t+'?',result:'They were at '+p+' on '+t+'.',cn:'具体日期与地点',label:t+' · '+p,image:image(art)};}),
...['July|Australia','August|Austria','September|Canada','October|China','November|Denmark','December|Finland','1996|India','2004|Poland','2015|Turkey','2017|Japan','2020|Nigeria'].map(x=>{const[t,p]=x.split('|');return{en:'Where were they in '+t+'?',result:'They were in '+p+' in '+t+'.',cn:'月份／年份与国家',label:t+' · '+p,image:image(p.toLowerCase())};})
];
unit.learning.REFERENCE=[
'at：at three o’clock；at lunchtime；at noon；at night；at the age of seven。',
'on：on Monday；on June 23rd；on Friday morning。具体某一天的时段也用on。',
'in：in the morning／afternoon／evening；in July；in summer；in 1995；in the twentieth century；in Easter week；in the holidays。',
'节日期间与具体当天：at Christmas；on Christmas Day。',
'last year、this Friday、yesterday等完整时间短语前，不再加at／on／in。',
'月份首字母大写。本表沿用导学的月份缩写；其他通行缩写和标点形式不作为错题。',
'January 17th, 2012 与 17th January 2012表示同一天。读作January the seventeenth, twenty twelve，或the seventeenth of January, twenty twelve。two thousand and twelve也是可用年份读法。',
'时间on／in不代替地点at／in。at the stationer’s（在文具店），in Denmark（在丹麦）。',
'You and Penny问到包括你自己，回答用we；Sam and Penny是第三方，回答用they。',
'hundreds of people：数以百计；five hundred people：500人。确数后hundred不加s，也不加of。'
];
unit.learning.WRITING_A=['We were ____ the stationer’s ____ Monday.','We were there ____ four o’clock.','They were ____ Australia ____ September.','They were there ____ spring.','____ November 25th, they were ____ Canada.','They were there ____ 2020.'];
unit.learning.WRITING_B=['you and Susan / the office / March 23rd','Sam and Penny / India / 2021','you and Penny / the baker’s / Saturday','Sam and Penny / Canada / 2019','you and Penny / Austria / August','Sam and Penny / home / May 25th','you and Penny / Finland / December','you and Sam / school / February 22nd'];
core.unit6970=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit6970,excerpts={"u6970-v1-r-when":[0],"u6970-v1-r-people":[1],"u6970-v1-r-left":[1],"u6970-v1-r-count":[2],"u6970-v1-r-origins":[2],"u6970-v1-r-winner":[3],"u6970-v1-r-reminder":[3,4],"u6970-v1-e-numbers":[0,2,3],"u6970-v1-e-safety":[4]},speakers={"narrator":""};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 69',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
