(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit73-74/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页150–153／PDF183–186';
const grammarSource='《同步导学》Grammar纸页132–133／PDF146–147；《语法练习册》纸页208–213／PDF222–227';
const rows=[
['week','周','/wiːk/','week'],['London','伦敦','/ˈlʌndən/','london'],['suddenly','突然地','/ˈsʌdənli/','suddenly'],['bus stop','公共汽车站','/ˈbʌs stɒp/','bus-stop'],['smile','微笑','/smaɪl/','smile'],['pleasantly','友好地；愉快地','/ˈplezəntli/','smile'],['understand','懂；明白','/ˌʌndəˈstænd/','understand'],['speak','讲；说','/spiːk/','speak'],['hand','手','/hænd/','hand'],['pocket','衣袋','/ˈpɒkɪt/','pocket'],['phrasebook','短语手册；常用语手册','/ˈfreɪzbʊk/','phrasebook'],['phrase','短语','/freɪz/','phrase'],['slowly','缓慢地','/ˈsləʊli/','slowly'],['hurriedly','匆忙地','/ˈhʌrɪdli/','hurriedly'],['cut','割；切（过去式也为cut）','/kʌt/','cut'],['thirstily','口渴地','/ˈθɜːstɪli/','drink'],['go','去；走（过去式went）','/ɡəʊ/','go'],['greet','问候；打招呼','/ɡriːt/','greet'],
['tourist','游客；旅行者','/ˈtʊərɪst/','tourist'],['lose','迷失；丢失','/luːz/','lost'],['lost','lose的过去式','/lɒst/','lost'],['saw','see的过去式：看见','/sɔː/','see'],['spoke','speak的过去式','/spəʊk/','speak'],['understood','understand的过去式','/ˌʌndəˈstʊd/','understand'],['put','放（过去式也为put）','/pʊt/','put'],['took','take的过去式：拿；取','/tʊk/','take'],['found','find的过去式：找到','/faʊnd/','find'],['read','读（这里是过去式）','/red/','read'],['gave','give的过去式：给','/ɡeɪv/','give'],['drank','drink的过去式：喝','/dræŋk/','drink'],['ate','eat的过去式：吃','/et/','eat'],['met','meet的过去式：遇见','/met/','greet'],['swam','swim的过去式：游泳','/swæm/','swim'],
['quickly','迅速地','/ˈkwɪkli/','quickly'],['carefully','仔细地；小心地','/ˈkeəfəli/','carefully'],['warmly','热情地','/ˈwɔːmli/','greet'],['hard','努力地；费力地','/hɑːd/','work'],['fast','快；快速地','/fɑːst/','quickly'],['late','迟；晚','/leɪt/','late'],['well','好地（描述动作）','/wel/','swim'],['enjoyed ourselves','我们玩得很开心','/ɪnˈdʒɔɪd aʊəˈselvz/','enjoy'],['the way to','去……的路','/ðə weɪ tuː/','way']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit73-74',version:1,contentRevision:'street-phrasebook-v1',mode:'classroom',title:'街角的短语手册',path:'/unit73-74/',start:'learn/words',progress:{learningKey:'canran:unit73-74:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识街角线索',activities:[['words','街角小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进问路故事',activities:[['text','街角小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'把事情讲生动',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'翻开旅行手记',activities:[['apply','旅行记录员','give']],required:['apply']},
{id:'l5',title:'完成街角挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'street-phrasebook-v1',title:'旅行小讲述家',lesson:'Lesson 73–74',scene:'/assets/unit73-74/keepsake-story-v1.webp',alt:'游客翻开短语手册，Mills夫人在车站旁认真倾听',color:'#456d83',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','旅行记录员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={narrator:'故事',mills:'Mrs. Mills',thought:'Mrs. Mills · 心里想',tourist:'The tourist'};
unit.learning.DIALOGUE=[
['narrator','Last week Mrs. Mills went to London.','上星期Mills夫人去了伦敦。'],
['narrator','She does not know London very well, and she lost her way.','她对伦敦不很熟悉，因此迷了路。'],
['narrator','Suddenly, she saw a man near a bus stop.','突然，她在公共汽车站附近看到一个男人。'],
['thought','“I can ask him the way,” she said to herself.','“我可以向他问路，”她心中暗想。'],
['mills','“Excuse me,” she said.','“打扰一下，”她说。'],
['mills','“Can you tell me the way to King Street, please?”','“请问，您能告诉我去国王街怎么走吗？”'],
['narrator','The man smiled pleasantly.','那个人友好地笑了笑。'],
['narrator','He did not understand English!','他不懂英语！'],
['narrator','He spoke German.','他讲德语。'],
['narrator','He was a tourist.','他是个旅行者。'],
['narrator','Then he put his hand into his pocket, and took out a phrasebook.','然后，他把手伸进衣袋，拿出一本常用语手册。'],
['narrator','He opened the book and found a phrase.','他翻开书，找到一条短语。'],
['narrator','He read the phrase slowly.','他慢慢地读着这条短语。'],
['tourist','“I am sorry,” he said. “I do not speak English.”','“很抱歉，”他说，“我不会讲英语。”']
].map(([who,text,cn],i)=>({id:'u7374-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u7374-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-stop','看图识别车站','这是什么地方？',choice(['a bus stop','a school','a kitchen'],'a bus stop',{image:image('bus-stop'),imageAlt:'公共汽车图案的站牌与候车长椅'}),'bus stop是公共汽车站。'),
q('v-objects','区分手、衣袋和手册','把物品和意思配好。',match([['hand','手'],['pocket','衣袋'],['phrasebook','常用语手册']]),'三件事物在取书的动作中各有作用。'),
q('v-suddenly','理解suddenly','Suddenly, she saw a man. 中suddenly表示什么？',choice(['突然地','每周一次','很晚才'],'突然地'),'suddenly说明事情突然发生。'),
q('v-manners','区分怎样做的词','把做事的方式配好。',match([['slowly','缓慢地'],['hurriedly','匆忙地'],['pleasantly','友好地']]),'这些词说明动作怎样发生。'),
q('v-understand','区分懂和说','He did not understand English. 这句话说什么？',choice(['他听不懂英语','他不喜欢伦敦','他从未看见车站'],'他听不懂英语'),'understand表示懂、明白。'),
q('v-thirst','理解口渴地喝','He drank the water thirstily. 他怎样喝水？',choice(['口渴地喝','仔细地看','匆忙地挥手'],'口渴地喝'),'thirstily来自thirsty，说明喝水时很渴。'),
q('v-phrase','区别短语与手册','一本phrasebook里可以找到很多什么？',choice(['phrases','pockets','bus stops'],'phrases'),'phrase是短语，phrasebook是收录常用表达的手册。'),
q('v-greet','理解问候动作','She greeted me warmly. 她做了什么？',choice(['热情地向我问好','突然关上门','慢慢地喝水'],'热情地向我问好'),'greet表示向人问候。')
];
unit.questions.roles=[
q('r-place','提取故事时间和地点','Mrs. Mills什么时候去了哪里？',choice(['上星期去了伦敦','昨天去了德国','上星期去了学校'],'上星期去了伦敦'),'故事开头给出last week和London。'),
q('r-lost','理解迷路的原因','她为什么迷了路？',choice(['她不熟悉伦敦','她丢了短语手册','游客告诉她错误的路'],'她不熟悉伦敦'),'does not know London very well说明她不熟悉这座城市。'),
q('r-stop','提取相遇的位置','她在哪里看到那个男人？',choice(['near a bus stop','in a classroom','at her home'],'near a bus stop'),'原文明确说在车站附近。'),
q('r-thought','区分心里想与说出口','“I can ask him the way.” 是谁心里想的话？',choice(['Mrs. Mills','那位游客','公交车司机'],'Mrs. Mills'),'she said to herself指她心中暗想。'),
q('r-destination','理解问路目的地','她想问去哪里怎么走？',choice(['King Street','London Airport','the tourist’s home'],'King Street'),'她问the way to King Street。'),
q('r-language','区分语言与国籍','根据原文，关于游客能确定什么？',choice(['他讲德语','他一定是德国人','他住在国王街'],'他讲德语'),'原文只交代语言和游客身份，没有说明国籍。'),
q('r-sequence','核对短语手册来处和顺序','他找到短语之前，先做了什么？',choice(['从自己的衣袋拿出手册并翻开','从Mrs. Mills手中借来地图','把手册交给司机'],'从自己的衣袋拿出手册并翻开'),'put his hand into his pocket、took out、opened交代顺序。'),
q('r-ending','理解手册用途与结尾','他用手册读出的意思是什么？',choice(['抱歉，我不会说英语','请往左转，就到国王街了','我能带你去国王街'],'抱歉，我不会说英语'),'故事没有给出路线或最后是否到达。')
];
unit.questions.grammar=[
g('how','副词说明动作怎样发生','哪个词告诉我们她怎样微笑？',{type:'locate',fragments:[{value:'She'},' ',{value:'smiled'},' ',{value:'pleasantly'},'.'],options:['She','smiled','pleasantly'],answer:'pleasantly'},'pleasantly说明微笑的方式。','找回答“怎样”的词。',model(['He walked slowly.','slowly说明他走得怎样。'])),
g('adj-adv','形容词描述事物副词描述动作','一辆慢车；车慢慢地行驶。',fill([blank('It was a','bus.',['slow','slowly']),blank('The bus went','.',['slowly','slow'])],['slow','slowly']),'slow描述车，slowly描述行驶这个动作。','分别看空格在描述车还是动作。',model(['a quick answer / answer quickly','一个很快的回答／迅速作答。'])),
g('ly','正确构成carefully','选出“小心地拿着杯子”。',choice(['She held the cup carefully.','She held the cup careful.','She held the cup carefuly.'],'She held the cup carefully.'),'careful加-ly成为carefully，保留原词末尾的l。','先保留careful，再接ly。',model(['warm → warmly','warm加-ly。'])),
g('ily','辅音加y构成方式副词','thirsty变成“口渴地”。',fill([blank('He drank the water','.',['thirstily','thirstyly','thirsty'])],['thirstily']),'辅音字母+y结尾常改y为i，再加-ly。','比较happy这组变化。',model(['happy → happily','把y改为i，再接ly。'])),
g('same','hard与fast的方式副词同形','努力工作；跑得快。',fill([blank('They worked very','.',['hard','hardly']),blank('He ran very','.',['fast','fastly'])],['hard','fast']),'hard和fast可直接作副词；hardly是“几乎不”，不是“努力地”。','不是所有方式词都加ly。',model(['a late bus / arrive late','有些形容词和副词形式相同。'])),
g('late','late表示晚','原计划六点到家，结果八点才到。选出“到晚了”。',choice(['We arrived home late.','We arrived home lately.','We arrived home slowly.'],'We arrived home late.'),'late表示迟、晚；lately表示近来，不等于晚到。','这里说的是比预定时间晚。',model(['The bus went fast.','fast作副词时不加ly。'])),
g('well','good与well的用途','一位好游泳者；他游得好。',fill([blank('He was a','swimmer.',['good','well']),blank('He swam very','.',['well','good'])],['good','well']),'good描述游泳者；描述游得怎样用well。','先看是在说人还是动作。',model(['She is a good singer. She sings well.','good描述人；well说明唱得怎样。'])),
g('past-set','不规则过去式不靠加ed','把三组动作的现在与过去配好。',match([['go','went'],['see','saw'],['lose','lost']]),'这些过去式需结合动作记忆，不能直接加-ed。','在本课故事开头找这些动作。',model(['take → took','不规则过去式单独记。'])),
g('speak-understand','不规则形式spoke和understood','记录昨天的谈话。',fill([blank('He','German yesterday.',['spoke','speaked','speak']),blank('She','his words.',['understood','understanded','understand'])],['spoke','understood']),'speak→spoke；understand→understood。','过去发生的动作不一定加ed。',model(['see → saw','词形会发生变化。'])),
g('take-find','按先后使用took与found','取出手册，再找到短语。',fill([blank('He','out a phrasebook.',['took','taked','take']),blank('He','a phrase.',['found','finded','find'])],['took','found']),'take→took；find→found，动作按先后发生。','先拿出来，再找到。',model(['go → went','不能照搬规则过去式。'])),
g('give-drink-eat','区分gave drank ate','给过去的动作找到原形。',match([['gave','give'],['drank','drink'],['ate','eat']]),'gave是给，drank是喝，ate是吃。','不能只看字形，要一起看动作意义。',model(['meet → met','动作意义不变，形式变化。'])),
g('unchanged','cut和put过去式不变','昨天切了蛋糕，把它放在盘子上。',fill([blank('She','the cake yesterday.',['cut','cutted']),blank('She','it on a plate.',['put','putted'])],['cut','put']),'cut和put的过去式与原形相同。','没有-ed也可以表示过去。',model(['hit → hit','有些动词的过去式不变。'])),
g('read','read拼写相同但读音不同','在“He read the phrase yesterday.”中，read表示什么？',choice(['已经读过；过去式读/red/','正在读；读/riːd/','将要读；必须加-ed'],'已经读过；过去式读/red/'),'read原形/riːd/，过去式/red/；拼写不变，读音不同。','先看yesterday，再核对音标。',model(['put → put','拼写是否改变，不能单独决定时间。'])),
g('negative','didnt后用原形而肯定句用过去式','旅行记录：没坐公交车，步行去的。',fill([blank('We didn’t','by bus.',['go','went']),blank('We','there.',['walked','walk'])],['go','walked']),'didn’t后使用原形；实际发生的动作用过去式。','过去信息在did中已有表达。',model(['He didn’t take a bus. He took a taxi.','否定与肯定的动词形式不同。'])),
g('quote','区分人物原话与叙述','哪一部分是游客说出的原话？',{type:'locate',fragments:[{value:'“I am sorry,”'},' ',{value:'he said'},'.'],options:['“I am sorry,”','he said'],answer:'“I am sorry,”'},'引号内是原话，he said交代谁说的。','找引号里面的内容。',model(['“Hello,” she said.','“Hello”是原话，she said是叙述。'])),
g('speaker','直接引语中的I指说话人','游客说：“I do not speak English.”\n这里的I指谁？',choice(['游客自己','Mrs. Mills','讲故事的人'],'游客自己'),'直接引语中的I跟随说话人。','先确定谁在说话。',model(['“I am ready,” Mary said.','这句I指Mary。'])),
g('keep-words','直接引语保留原话','Mills夫人的原话是“I am lost.”。哪条记录完整保留原话？',choice(['“I am lost,” Mrs. Mills said.','“She is lost,” Mrs. Mills said.','I am lost, Mrs. Mills said.'],'“I am lost,” Mrs. Mills said.'),'直接引语保留I并加引号，不擅自改成She。','同时检查原话和引号。',model(['“I am tired,” Tom said.','记录谁说了什么，不改原话的人称。'])),
g('order','过去动作加方式词的组句','游客慢慢读了短语。',bank(['He','read','the phrase','slowly','slow'],'He read the phrase slowly',4),'宾语the phrase接在read后，slowly说明方式。','先说做了什么，再说明怎样做。',model(['She greeted me warmly.','动作、对象、方式。'])),
g('transfer-manner','撤去示范独立组合动作与方式','记录：yesterday · swim · 做得好。',choice(['He swam well yesterday.','He swim good yesterday.','He swammed well yesterday.'],'He swam well yesterday.'),'swim过去式swam，方式副词well。'),
g('transfer-quote','撤去示范核对引语与人物','Mary昨天说：“I can help.” 哪条记录准确？',choice(['“I can help,” Mary said.','“She can help,” Mary said.','“I can help,” Tom said.'],'“I can help,” Mary said.'),'说话人和原话都要保留。')
];
unit.questions.apply=[
q('a-note','用方式副词完成旅行记录','旅行记录：bus · yesterday afternoon · slow。\n把行车方式写清楚。',fill([blank('The bus went','yesterday afternoon.',['slowly','slow','slowlyly'])],['slowly']),'slowly说明行驶方式。','不是给bus挑形容词。'),
q('a-phrasebook','核对表达后才翻开手册','手册任务：说明“抱歉，我不会说英语”。\n选对表达，再翻开这一页。',choice(['I am sorry. I do not speak English.','Can you tell me the way to King Street?','Thank you. I know London very well.'],'I am sorry. I do not speak English.'),'表达应与想说的意思一致，不能只因出现English就乱选。'),
q('a-request','礼貌提出问路请求','你想向路人询问去国王街的路。选一句。',choice(['Can you tell me the way to King Street, please?','I can ask him the way.','He was a tourist.'],'Can you tell me the way to King Street, please?'),'请求直接对路人说；心中暗想不能替代请求。'),
q('a-choice','根据事实回应过去的选择疑问','你的记录：昨天喝的是水，没有喝茶。\nDid you drink water or tea?',choice(['I drank water. I didn’t drink tea.','Yes, I did.','I drink water. I didn’t drank tea.'],'I drank water. I didn’t drink tea.'),'先明确选择，再用didn’t+原形说明没做什么。'),
q('a-greeting','用过去动作加方式写记录','昨天你遇到了Jane，并热情地向她问好。拼出问候记录。',bank(['I','greeted','her','warmly','warm'],'I greeted her warmly',4),'warmly说明greeted的方式。'),
q('a-pocket','用动作顺序核对物品','资料：He put his hand into his pocket. Then he took out a phrasebook.\n哪条记录相符？',choice(['先伸手进衣袋，再取出手册','先读手册，再把手册交给Mrs. Mills','先打开地图，再给游客指路'],'先伸手进衣袋，再取出手册'),'只记录资料已提供的动作，不添结果。'),
q('a-quote','从新说话人视角记录原话','你听见Tom说：“I lost my way.”\n选出没有改动他原话的记录。',choice(['“I lost my way,” Tom said.','“You lost your way,” Tom said.','“I lost my way,” Mary said.'],'“I lost my way,” Tom said.'),'引号内保留Tom的I和my，同时写对说话人。'),
q('a-safe','根据74课场景理解方式与结果','材料：He shaved hurriedly and cut himself badly.\n哪条概括符合材料？',choice(['他匆忙刮脸，割伤得很厉害','他很仔细地刮脸，完全没有受伤','他只剪了一张纸'],'他匆忙刮脸，割伤得很厉害'),'hurriedly和badly分别补充两个动作。')
];
unit.questions.exam=[
q('e-words','独立理解街角词汇','把词语配好。',match([['pocket','衣袋'],['greet','问候'],['suddenly','突然地']]),'按词义配对。'),
q('e-book','独立区分手册与短语','游客要找一句可用的表达。他可以翻开什么？',choice(['a phrasebook','a bus stop','a pocket'],'a phrasebook'),'手册收录可用的短语。'),
q('e-manner','独立理解方式词','She smiled pleasantly. 说明她怎样微笑？',choice(['友好地','匆忙地','迟迟才'],'友好地'),'pleasantly描述微笑的方式。'),
q('e-trip','综合提取旅行信息','哪条旅行记录符合课文？',choice(['Mrs. Mills · London · last week','Mrs. Mills · Germany · yesterday','the tourist · King Street · last night'],'Mrs. Mills · London · last week'),'人物、地点和时间都要核对。'),
q('e-cause','综合理解迷路因果','She does not know London very well, and she lost her way. 两部分是什么关系？',choice(['不熟悉伦敦，所以迷路','她迷路，所以开始讲德语','她不熟悉游客，所以丢了书'],'不熟悉伦敦，所以迷路'),'这里and连接原因与结果。'),
q('e-limit','不从语言推断国籍','原文说He spoke German. 能确定哪件事？',choice(['他讲德语，国籍未说明','他一定住在德国','他一定熟悉伦敦'],'他讲德语，国籍未说明'),'语言信息不能替代国籍或居住地。'),
q('e-order','综合核对取书顺序','哪一组动作顺序符合故事？',choice(['取出手册 → 翻开 → 找到短语 → 慢慢读','慢慢读 → 拿出地图 → 翻开 → 指路','Mrs. Mills给书 → 读完 → 带她到国王街'],'取出手册 → 翻开 → 找到短语 → 慢慢读'),'故事只讲到游客读出说明，不包含成功指路。'),
q('e-thought','区分思想与对话','“I can ask him the way,” she said to herself.\n这是谁的想法？',choice(['Mrs. Mills的想法','游客对司机的请求','司机的原话'],'Mrs. Mills的想法'),'she说的是Mrs. Mills，to herself说明自言自语／心中暗想。'),
q('e-ending','不为课文添加结局','读完课文，能确定哪一项？',choice(['游客说明自己不会英语；是否到国王街未交代','游客带Mrs. Mills到了国王街','Mrs. Mills已经乘车回家'],'游客说明自己不会英语；是否到国王街未交代'),'按原文的结束位置作判断。'),
q('e-locate','独立识别说明动作的词','哪个词说明他怎样读？',{type:'locate',fragments:['He ',{value:'read'},' the ',{value:'phrase'},' ',{value:'slowly'},'.'],options:['read','phrase','slowly'],answer:'slowly'},'slowly说明read的方式。'),
q('e-adj-adv','独立区分事物特征与动作方式','一位细心的女孩；她细心地工作。',fill([blank('She was a','girl.',['careful','carefully']),blank('She worked','.',['carefully','careful'])],['careful','carefully']),'形容词描述人，副词补充动作。'),
q('e-ily','独立构成y结尾副词','她开心地微笑。',fill([blank('She smiled','.',['happily','happyly','happy'])],['happily']),'happy变happily。'),
q('e-hard','独立理解hard','“他们工作很努力”应怎样表达？',choice(['They worked very hard.','They worked very hardly.','They worked very harded.'],'They worked very hard.'),'hard可直接作副词，hardly不是努力地。'),
q('e-fast','独立使用fast','这辆车开得快。',fill([blank('The car went very','.',['fast','fastly','fasted'])],['fast']),'fast既可作形容词也可作副词。'),
q('e-late','独立使用late','本该七点到，八点才到。',fill([blank('They arrived','.',['late','lately','laterly'])],['late']),'late表示迟到、晚到。'),
q('e-well','独立区分good与well','她是一名好游泳者，昨天游得很好。',fill([blank('She is a','swimmer.',['good','well']),blank('She swam very','yesterday.',['well','good'])],['good','well']),'人或事物好用good；动作完成得好用well。'),
q('e-past','独立识别不规则过去式','给原形找过去式。',match([['go','went'],['see','saw'],['lose','lost']]),'这些过去式不是在原形后加-ed。'),
q('e-understand','独立构成过去否定','昨天他没听懂这句话。',fill([blank('He didn’t','the phrase yesterday.',['understand','understood','understands'])],['understand']),'didn’t后使用原形。'),
q('e-spoke','独立形成spoke','昨天她讲了英语。',fill([blank('She','English yesterday.',['spoke','speaked','speak'])],['spoke']),'speak的过去式是spoke。'),
q('e-take-give','独立核对两个不同过去动作','昨天他拿了本书，送给我一支笔。',fill([blank('He','a book yesterday.',['took','taked','take']),blank('He','me a pen.',['gave','gived','give'])],['took','gave']),'take→took，give→gave。'),
q('e-eat-drink','独立区分吃与喝的过去式','她昨天吃了蛋糕，喝了水。',fill([blank('She','a cake yesterday.',['ate','eated','eat']),blank('She','some water.',['drank','drinked','drink'])],['ate','drank']),'eat→ate，drink→drank。'),
q('e-read','独立理解read的过去式','He read the book last night. 这里read怎样理解？',choice(['过去读过，拼写不变，读/red/','现在正在读，读/riːd/','过去式必须写readed'],'过去读过，拼写不变，读/red/'),'read的过去式拼写相同、读音不同。'),
q('e-unchanged','独立识别不变的过去式','给这些动词找过去式。',match([['cut','cut'],['put','put'],['read','read']]),'三词拼写不变；read读音变化。'),
q('e-contrast','独立构成过去肯否对比','记录：Ann没有去；Tom去了伦敦。',fill([blank('Ann didn’t','to London.',['go','went']),blank('Tom','there.',['went','go'])],['go','went']),'didn’t后原形，肯定过去用went。'),
q('e-quotation','独立判断直接引语','Mary说出的原话是“I am ready.”。哪条记录正确？',choice(['“I am ready,” Mary said.','“She is ready,” Mary said.','I am ready, Mary said.'],'“I am ready,” Mary said.'),'保留原话和引号，不擅自改人称。'),
q('e-pronoun','独立判断引语中的I','“I do not speak English,” the tourist said. I指谁？',choice(['游客','Mrs. Mills','所有人'],'游客'),'原话中的I指正在说这句话的人。'),
q('e-build','独立组装过去动作和方式','他慢慢地打开了书。',bank(['He','opened','the book','slowly','slow'],'He opened the book slowly',4),'动词后接宾语，slowly说明方式。'),
q('e-summary','综合过去事件与方式','旅行手记：yesterday · met Jane · 热情地问候她。哪句准确？',choice(['I met Jane yesterday and greeted her warmly.','I meet Jane yesterday and greeted her warm.','I met Jane tomorrow and greeted him warmly.'],'I met Jane yesterday and greeted her warmly.'),'时间、过去动作、her指代和warmly方式都须一致。')
];
unit.learning.MODELS=[
['101','shave','He shaved hurriedly this morning and cut himself badly.','他今天早晨匆忙刮脸，把自己割伤得很厉害。'],
['102','eat','He took a cake and ate it quickly.','他拿了一块蛋糕，很快地吃掉了。'],
['103','give','I gave him a glass of water and he drank it thirstily.','我给了他一杯水，他口渴地喝了。'],
['104','greet','I met her in the street the day before yesterday and she greeted me warmly.','前天我在街上遇见她，她热情地向我问好。'],
['105','bus','The bus went slowly yesterday afternoon and we arrived home late.','昨天下午公交车开得慢，我们很晚才到家。'],
['106','work','They worked very hard this morning.','他们今天早晨工作很努力。'],
['107','enjoy','We enjoyed ourselves very much last night.','我们昨天夜里玩得很开心。'],
['108','swim','He swam very well this afternoon.','他今天下午游得很好。']
].map(([label,art,en,result])=>({label,image:image(art),en,result}));
unit.learning.REFERENCE=[
'方式副词说清动作怎样发生：smiled pleasantly、read slowly。形容词描述人／物：a slow bus；副词描述动作：the bus went slowly。',
'许多形容词加-ly：quick→quickly、warm→warmly、careful→carefully。辅音字母+y通常改-ily：happy→happily、thirsty→thirstily。不是所有y结尾一律套这个规则。',
'hard、fast、late可直接作副词；hardly是“几乎不”，lately是“近来”。描述动作做得好使用well：a good swimmer / swim well。well还可作“身体好”的形容词，不能把它当作所有good的替代。',
'本课重点不规则形式：go→went、lose→lost、see→saw、speak→spoke、understand→understood、take→took、find→found、give→gave、drink→drank、eat→ate、meet→met、swim→swam。',
'put→put、cut→cut的拼写和读音不变。read→read拼写相同，原形/riːd/，过去式/red/。可以跟老师比较两种读音。',
'不规则动词在did not／didn’t后也用原形：He didn’t go. 肯定过去句使用went：He went home.',
'直接引语：把人物原话放进引号，并说明谁说的。“I am sorry,” he said. 引号内I指说话人；he said不属于他说出的原话。',
'said to herself是心中暗想／自言自语。本课的I can ask him the way不是游客说的，也不是她已经问出口的句子。',
'故事叙述过去发生的事，也可说明仍然存在的情况：She does not know London very well. does not know说的是仍不了解伦敦；lost说的是上周迷路。'
];
unit.learning.EXTRA_PAST=[['come','came'],['become','became'],['run','ran'],['sit','sat'],['build','built'],['lend','lent'],['send','sent'],['spend','spent'],['burn','burnt'],['learn','learnt / learned'],['mean','meant'],['buy','bought'],['bring','brought'],['think','thought'],['fight','fought'],['catch','caught'],['teach','taught'],['keep','kept'],['sleep','slept'],['sweep','swept'],['leave','left'],['say','said'],['spell','spelt'],['smell','smelt / smelled'],['hold','held'],['feel','felt'],['stand','stood'],['get','got'],['have / has','had'],['sell','sold'],['tell','told'],['hear','heard'],['make','made'],['pay','paid'],['lay','laid'],['shine','shone / shined'],['win','won'],['sing','sang'],['ring','rang'],['begin','began'],['sink','sank'],['draw','drew'],['know','knew'],['throw','threw'],['fly','flew'],['drive','drove'],['rise','rose'],['ride','rode'],['write','wrote'],['fall','fell'],['freeze','froze'],['break','broke'],['wake','woke'],['choose','chose'],['let','let'],['hit','hit'],['cost','cost'],['hurt','hurt'],['be (am / is / are)','was / were'],['do','did'],['can','could'],['may','might'],['shall','should'],['will','would']];
unit.learning.WRITING_A=['He read the phrase ____ . (slow)','He worked ____ . (lazy)','He cut himself ____ . (bad)','He worked ____ . (careful)','The door opened ____ . (sudden)'];
unit.learning.WRITING_TABLE=[['主语',['He','She','We','The bus']],['动作',['does not know','read','smiled','went','shaved','drank','greeted','worked','enjoyed ourselves']],['对象',['a glass of water','the phrase','me','London']],['程度与方式',['very hard','hurriedly','slowly','very well','thirstily','warmly','pleasantly','very much']]];
core.unit7374=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit7374,excerpts={"u7374-v1-r-place":[0],"u7374-v1-r-lost":[0,1],"u7374-v1-r-stop":[1,2],"u7374-v1-r-thought":[0,1,2,3],"u7374-v1-r-destination":[4,5],"u7374-v1-r-language":[6,7,8,9],"u7374-v1-r-sequence":[10,11,12],"u7374-v1-r-ending":[10,11,12,13],"u7374-v1-e-trip":[0,1,2,3,4,5],"u7374-v1-e-order":[6,7,8,9,10,11,12,13],"u7374-v1-e-ending":[0,1,2,3,4,5,6,7,8,9,10,11,12,13]},speakers={"narrator":"","thought":"Mrs. Mills · 心里想","mills":"Mrs. Mills","tourist":"The tourist"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 73',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
