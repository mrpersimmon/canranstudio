(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit65-66/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页130–133／PDF163–166';
const grammarSource='《同步导学》Grammar纸页118–119／PDF132–133；《语法练习册》纸页184–188／PDF198–202';
const WORDS=[['dad','爸爸','/dæd/','father'],['key','钥匙','/kiː/','key'],['baby','婴儿','/ˈbeɪbi/','baby'],['hear','听见','/hɪə/','hear'],['enjoy','玩得愉快；享受','/ɪnˈdʒɔɪ/','enjoy'],['yourself','你自己（一个人）','/jɔːˈself/','self'],['ourselves','我们自己','/aʊəˈselvz/','selves'],['mum','妈妈','/mʌm/','mother'],['myself','我自己','/maɪˈself/','self'],['themselves','他们／她们／它们自己','/ðəmˈselvz/','selves'],['himself','他自己','/hɪmˈself/','self'],['herself','她自己','/hɜːˈself/','self'],['itself','它自己','/ɪtˈself/','cat'],['yourselves','你们自己（多个人）','/jɔːˈselvz/','selves'],['early','早地；早的','/ˈɜːli/','early'],['late','晚地；迟的','/leɪt/','late'],['front door','前门','/frʌnt dɔː/','front-door'],['half past','……点半','/hɑːf pɑːst/','clock-1030'],['a quarter past','……点一刻','/ə ˈkwɔːtə pɑːst/','clock-1115'],['a quarter to','差一刻到……点','/ə ˈkwɔːtə tuː/','clock-1045'],['o’clock','……点钟（整点）','/əˈklɒk/','clock-1000'],['birthday','生日','/ˈbɜːθdeɪ/','birthday'],['year','年','/jɪə/','year'],['old','……岁的；老的','/əʊld/','age'],['first','第一；1st','/fɜːst/','year'],['second','第二；2nd','/ˈsekənd/','year'],['third','第三；3rd','/θɜːd/','year'],['eleventh','第十一；11th','/ɪˈlevənθ/','year'],['twelfth','第十二；12th','/twelfθ/','year'],['sixteenth','第十六；16th','/ˌsɪksˈtiːnθ/','year']].map(([en,cn,ph,art])=>({en,cn,ph,image:['father','mother'].includes(art)?'/assets/unit65-66/'+art+'.webp':image(art)}));
const unit={id:'unit65-66',version:1,contentRevision:'jill-key-v1',mode:'classroom',title:'Jill 的晚间约定',path:'/unit65-66/',start:'learn/words',progress:{learningKey:'canran:unit65-66:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'准备出门啦',activities:[['words','晚间小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'一把钥匙的故事',activities:[['text','门厅小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清自己与时间',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'记好我们的约定',activities:[['apply','约定小助手','give']],required:['apply']},
{id:'l5',title:'一起完成挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'jill-key-v1',title:'约定小达人',lesson:'Lesson 65–66',scene:'/assets/unit65-66/keepsake-story-v1.webp',alt:'爸爸把一枚前门钥匙递给Jill，妈妈在旁微笑，三人相向交谈',color:'#7893ae',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','约定小助手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={father:'Father · Tom',jill:'Jill',mother:'Mother'};
unit.learning.DIALOGUE=[
['father','What are you going to do this evening, Jill?','Jill，你今晚打算做什么？'],['jill','I’m going to meet some friends, Dad.','我打算去见几个朋友，爸爸。'],['father','You mustn’t come home late. You must be home at half past ten.','你不准回家太晚。你必须在十点半到家。'],['jill','I can’t get home so early, Dad!','爸爸，这么早我回不了家！'],['jill','Can I have the key to the front door, please?','请问我能带上前门的钥匙吗？'],['father','No, you can’t.','不，你不能。'],['mother','Jill’s eighteen years old, Tom. She’s not a baby. Give her the key. She always comes home early.','Tom，Jill已经十八岁了。她不是小孩子了。把钥匙给她吧。她总是早早回家的。'],['father','Oh, all right!','噢，好吧！'],['father','Here you are. But you mustn’t come home after a quarter past eleven. Do you hear?','给你。但你不准超过十一点一刻回家。听到了吗？'],['jill','Yes, Dad.','听到了，爸爸。'],['jill','Thanks, Mum.','谢谢，妈妈。'],['mother','That’s all right. Goodbye. Enjoy yourself!','不用谢。再见。玩得愉快！'],['jill','We always enjoy ourselves, Mum. Bye-bye.','妈妈，我们总是玩得很开心。再见。']
].map(([who,text,cn],i)=>({id:'u6566-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u6566-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});const blank=(before,after,options)=>({before,after,options});const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-key','识别故事关键物品','能打开前门的“钥匙”，英文是哪一个？',choice(['key','baby','year'],'key',{image:image('key'),imageAlt:'一枚圆环头的黄铜钥匙'}),'key是钥匙。'),
q('v-family','区分家人和婴儿词义','给三个词配好意思。',match([['dad','爸爸'],['mum','妈妈'],['baby','婴儿']]),'本课dad和mum是家人称呼。'),
q('v-clock','看钟面辨认时间词组','图上是10:30。选出对应的说法。',choice(['half past ten','a quarter past ten','ten o’clock'],'half past ten',{image:image('clock-1030'),imageAlt:'钟面：短针在10与11之间，长针指向6'}),'half past ten是十点半。'),
q('v-early','按语境区分early与late','约定10点见，9:50到了。更适合哪个词？',choice(['early','late','old'],'early'),'比约定时间提前到是early。'),
q('v-enjoy','理解enjoy oneself','Enjoy yourself! 是怎样的祝愿？',choice(['祝你玩得开心','要求你早点睡觉','让你交出钥匙'],'祝你玩得开心'),'enjoy oneself可以表示玩得开心。'),
q('v-hear','中译英区分听见与这里','“听见”的英文是哪一个？',choice(['hear','here','year'],'hear',{illustrate:false}),'hear是听见，here是在这里。'),
q('v-self','区分单复数的自己','按人数配好意思。',match([['myself','我自己'],['ourselves','我们自己'],['yourselves','你们自己']]),'单数self与复数selves需要配合所指的人。')
];
unit.questions.roles=[
q('r-plan','提取原文的计划','Jill今晚打算做什么？',choice(['Meet some friends.','See the doctor.','Go to the library.'],'Meet some friends.'),'她说要去见几个朋友；原文没有说明一定是去派对。','看Jill的第一句回答。'),
q('r-first','辨认最初的钟点要求','爸爸最初要求Jill几点到家？',choice(['10:30','11:15','11:30'],'10:30'),'half past ten是最初要求。','不要把后来商量的时间放到开头。'),
q('r-key','定位请求的具体物品','Jill想带哪把钥匙？',choice(['前门的钥匙','汽车的钥匙','书柜的钥匙'],'前门的钥匙'),'the key to the front door说明钥匙用途。'),
q('r-age','区分人物和年龄','妈妈说Jill多大了？她叫谁Tom？',choice(['Jill 18岁；Tom是爸爸','Jill 8岁；Tom是朋友','Tom 18岁；Jill是妈妈'],'Jill 18岁；Tom是爸爸'),'eighteen years old描述Jill，Tom是妈妈在称呼爸爸。','一句话里有两个人，不要混淆。'),
q('r-reason','整合妈妈的理由','妈妈为什么支持把钥匙给Jill？',choice(['她18岁了，而且一向早回家','她从不回家','爸爸已经睡了'],'她18岁了，而且一向早回家'),'妈妈提到了年龄和以往的习惯。','读完妈妈整段话。'),
q('r-last','理解最终约定与交接','爸爸最后有没有给钥匙？最晚约定到几点？',choice(['给了；不晚于11:15','没给；必须10:30','给了；午夜以后随便回来'],'给了；不晚于11:15'),'Here you are与mustn’t…after a quarter past eleven连起来理解。','留意爸爸改变主意后的那一段。'),
q('r-ourselves','追踪结尾的我们','Jill说We always enjoy ourselves. 这里we指谁？',choice(['Jill和她的朋友们','Jill的爸爸和妈妈','只有Jill一个人'],'Jill和她的朋友们'),'Jill回应与朋友们一起活动时玩得开心。','联系开头她要去见谁。')
];
unit.questions.grammar=[
g('i-we','enjoy搭配I与we','一个人说“我玩得开心”，一群人说“我们玩得开心”。',fill([blank('I enjoy ','.',['myself','ourselves']),blank('We enjoy ','.',['ourselves','myself'])],['myself','ourselves']),'主语I对应myself；we对应ourselves。','先看是在说一个我，还是我们。',model(['They enjoy themselves.','他们玩得开心，they对应themselves。'])),
g('you','根据听话人数选择自己','对一位朋友说，再对两位朋友说。',fill([blank('对一位朋友：Enjoy ','!',['yourself','yourselves']),blank('对两位朋友：Enjoy ','!',['yourselves','yourself'])],['yourself','yourselves']),'you可以是你或你们；自己要按实际人数变化。','题目已经告诉你听话人数。',model(['You are one person: you → yourself.','对一个人说你自己。'],['You are two or more: you → yourselves.','对多个人说你们自己。'])),
g('he-she','把自己与人物对应','Tom用he，Jill用she。补好他们各自玩得开心。',fill([blank('He enjoys ','.',['himself','herself']),blank('She enjoys ','.',['herself','himself'])],['himself','herself']),'himself指他自己；herself指她自己。','不要让自己指成另一人。',model(['I enjoy myself.','myself与句子的I是同一个人。'])),
g('it','it对应itself','The cat is washing ___. 小猫正在洗自己。',fill([blank('The cat is washing ','.',['itself','themselves'])],['itself']),'这里一只猫用it，对应itself。','先看是一只还是一群。',model(['The birds are washing themselves.','这些鸟在洗自己，复数对应themselves。'])),
g('they','在句子中定位指回主语的自己','They are enjoying themselves. 点出“他们自己”。',{type:'locate',fragments:[{value:'They'},' are ',{value:'enjoying'},' ',{value:'themselves'},'.'],options:['They','enjoying','themselves'],answer:'themselves'},'themselves指回前面的They。','找既包含自己又指多人那一部分。',model(['She is looking at herself.','herself指回句首的she。'])),
g('same','区分自己与另一个对象','Jill is looking at herself in the mirror. 她看到的是谁？',choice(['镜子里的Jill自己','镜子里的妈妈','句子没有说明看谁'],'镜子里的Jill自己'),'herself与主语Jill是同一个人。','不要把herself理解成另一位女性。',model(['Tom is looking at Jill.','看的对象是另一个人，用人名；不一定要加self。'])),
g('emphasis','理解亲自强调而非动作对象','They make this card themselves. 强调什么？',choice(['他们亲自做这张卡','卡片自己做自己','他们只把卡送给自己'],'他们亲自做这张卡'),'themselves在这里强调亲自，card才是制作的对象。','看动作已经有了什么对象。',model(['I open the door myself.','我亲自开门；myself强调由我来做。'])),
g('forms','辨认self与selves的完整形式','为主语选好“自己”。',match([['we','ourselves'],['you（多人）','yourselves'],['they','themselves']]),'这些复数形式都以selves结尾。','不要只在self后直接加s。',model(['I → myself; he → himself; she → herself; it → itself.','这些单数形式以self结尾。'])),
g('oclock','整点表达','钟面是2:00。选出整点说法。',choice(['two o’clock','half past two','a quarter to two'],'two o’clock',{image:image('clock-0200'),imageAlt:'两点整：短针指2，长针指12'}),'整点可以用o’clock。','长针在12。',model(['It’s six o’clock.','六点整；没有多出的分钟。'])),
g('past','一刻过后的past','补好1:15的表达。',fill([blank('It’s a quarter ',' one.',['past','to'])],['past']),'past指过了当前整点；1:15是一点过一刻。','先看分钟是在一点之后还是之前。',model(['8:15 — a quarter past eight.','一刻是15分钟。'])),
g('to','差一刻的下一个钟点','按“差一刻到……”拼出2:45。',bank(['It’s','a quarter to','three','two'],'It’s a quarter to three',3),'2:45还差15分钟到3点，to后用下一个钟点。','不是把数字2直接放到to后。',model(['5:45 — a quarter to six.','差一刻到六点。'])),
g('half','认可同一时间的合法读法','half past seven 与 seven thirty，哪种判断正确？',choice(['都表示7:30','只有第一种正确','第二种表示7:13'],'都表示7:30'),'半点也可直接读成几点thirty。','两种说法可以指同一个钟面。',model(['8:20 — twenty past eight / eight twenty.','分钟表达与直接读法都可以。'])),
g('minutes','超过半点后的to换算','6:47距离7点还差13分钟，怎样说？',choice(['thirteen to seven','thirteen past seven','forty-seven to six'],'thirteen to seven'),'to说距离下一个整点还差多少分钟。','题目给出了下一整点与剩余分钟。',model(['4:50 — ten to five / four fifty.','两种都表示4:50。'])),
g('at-in','区分具体钟点与月份','补好见面时间与雨季。',fill([blank('See you ',' ten o’clock.',['at','in']),blank('It rains ',' November.',['in','at'])],['at','in']),'具体钟点用at；月份用in。','一个是几点，一个是月份。',model(['at half past six; in July','具体钟点／月份。'])),
g('on','日期和具体一天用on','补好约会的日子。',fill([blank('Meet me ',' Monday morning.',['on','in']),blank('The party is ',' July 6th.',['on','at'])],['on','on']),'具体某一天的上午、日期都用on；泛指早晨是in the morning。','看是否明确了哪一天。',model(['on Friday; on your birthday; in the morning','星期、生日那天／一般的早晨。'])),
g('from-in','区别来源与地点','补好来自哪里与那里的气候。',fill([blank('I come ',' France.',['from','at']),blank('What’s the climate like ',' your country?',['in','from'])],['from','in']),'come from说来源；in your country说在你的国家。','这题的in不是时间，而是地点。',model(['She comes from China. She lives in London.','来源用from；所在地点用in。'])),
g('years','辨认常见年份读法','给年份配上正确读法。',match([['1949','nineteen forty-nine'],['1902','nineteen oh two'],['2000','two thousand']]),'1949也可读nineteen hundred and forty-nine；1902也可读nineteen hundred and two。','把年份和小时、年龄分开。',model(['1986 — nineteen eighty-six','常见四位年份可以分为前后两组。'],['1905 — nineteen oh five; 3000 — three thousand','零几年的一种读法与整千年读法。'])),
g('three-year','辨认三位年份','旧年表上的年份253可以怎样读？',choice(['two fifty-three','twenty-five three','two five thirty'],'two fifty-three'),'年份253可读two fifty-three，也可读two hundred and fifty-three。','题干是年份，不是几岁。',model(['年份426 — four twenty-six / four hundred and twenty-six','三位年份可先读第一位，再读后两位。'])),
g('independent-self','撤去示范独立应用反身词','Ben对自己和朋友说：We are enjoying ___.',fill([blank('We are enjoying ','.',['ourselves','themselves','myself'])],['ourselves']),'说话人包括自己和朋友，we对应ourselves。','先看是谁在说话。'),
g('independent-time','撤去示范独立读时间','a quarter to four对应哪一个钟点？',choice(['3:45','4:15','4:45'],'3:45'),'差一刻到四点是3:45。','to后是将要到达的钟点。')
];
unit.questions.apply=[
q('a-clock','用可见钟点做约定','便签：Home at 9:30.\n补好回家时间。',fill([blank('Be home at half past ','.',['nine','ten'])],['nine']),'9:30是half past nine。','看清便签上的小时。'),
q('a-key','依照约定检查后交钥匙','新情境：钥匙盒写着Come home at a quarter to ten.\n选好这个钟点，再领取钥匙。',choice(['9:45','10:15','10:45'],'9:45'),'差一刻到十点是9:45；检查正确才取到钥匙。','这份约定与课文的时间不同。'),
q('a-birthday','根据生日卡回答日期','Anna的生日卡：6 July。\nWhen’s Anna’s birthday?',choice(['It’s July 6th.','She’s six years old.','It’s six o’clock.'],'It’s July 6th.'),'日期与年龄、钟点不同。','问哪一天，不是几岁。'),
q('a-age','根据材料回应年龄','Ben的资料卡：Age 12。\nHow old is Ben?',choice(['He’s twelve years old.','It’s December 12th.','It’s twelve o’clock.'],'He’s twelve years old.'),'How old问年龄。','只根据资料卡，不猜外貌。'),
q('a-friends','给多人祝愿','两位朋友一起出发。对他们说“玩得开心”！',bank(['Enjoy','yourselves','yourself'],'Enjoy yourselves',2,'!'),'对两位朋友用yourselves。','看清是在对几个人说话。'),
q('a-when','转述When must的对象和钟点','你和Sam要3:45看牙医。别人问When must you and Sam see the dentist?\n由你来回答。',bank(['We','must see the dentist','at a quarter to four','They'],'We must see the dentist at a quarter to four',3),'从你和Sam的立场回答用We；3:45是a quarter to four。','回答人包含自己和Sam。'),
q('a-plan','区分计划与现在动作','Jill说：I’m going to meet some friends this evening.\n这说明什么？',choice(['她有今晚见朋友的计划','她此刻一定正在和朋友见面','她昨天已经见过朋友'],'她有今晚见朋友的计划'),'be going to在这里表达计划，不证明动作正在发生。','注意this evening与going to。'),
q('a-calendar','用序数识别日期','把日期上的序数标记配好。',match([['1st','first'],['2nd','second'],['3rd','third']]),'日期里的1st、2nd、3rd读作first、second、third。','不要把日期序数当作数量词。')
];
unit.questions.apply[7].workshop={model:model(['4th — fourth; 5th — fifth; 6th — sixth','日期用序数。完整1st–16th可在课本小参考查看。'])};
unit.questions.exam=[
q('e-hear','独立辨认hear','Dad asks, “Do you hear?” 这里hear表示什么？',choice(['听见','这里','年份'],'听见'),'hear在这里是听见。'),
q('e-words','独立辨认家人和物品','把词与意思配好。',match([['key','钥匙'],['baby','婴儿'],['mum','妈妈']]),'按词义区分人物与物品。'),
q('e-plan','独立读取课文计划','课文说Jill今晚要去哪里做什么？',choice(['去见几个朋友，具体地点没说','一定去图书馆看书','一定去参加生日派对'],'去见几个朋友，具体地点没说'),'原文只说meet some friends，没有指定地点或派对。'),
q('e-age','独立定位妈妈的依据','妈妈支持给钥匙时说Jill十八岁了，还说了什么？',choice(['She always comes home early.','She never comes home.','She is a baby.'],'She always comes home early.'),'她强调Jill一向早回家。'),
q('e-final','独立整合最终时间与钥匙','最后的约定是哪一份？',choice(['Jill拿钥匙，不晚于11:15回家','Jill没拿钥匙，10:30回来','Jill拿钥匙，11:45以后回来'],'Jill拿钥匙，不晚于11:15回家'),'最终的a quarter past eleven是11:15。'),
q('e-i-we','独立使用myself与ourselves','分别补好一个人和一群人的自述。',fill([blank('I’m enjoying ','.',['myself','ourselves']),blank('We’re enjoying ','.',['ourselves','myself'])],['myself','ourselves']),'I对应myself，we对应ourselves。'),
q('e-you','独立区分单人与多人you','对一个人和两个人分别说。',fill([blank('对一个人：Enjoy ','!',['yourself','yourselves']),blank('对两个人：Enjoy ','!',['yourselves','yourself'])],['yourself','yourselves']),'反身词按听话人的实际人数选择。'),
q('e-he-she','独立对应he和she','Tom用he，Jill用she，分别描述玩得开心。',fill([blank('Tom enjoys ','.',['himself','herself']),blank('Jill enjoys ','.',['herself','himself'])],['himself','herself']),'人物与反身词同指。'),
q('e-it-they','独立对应it和they','一只猫和几只鸟都在洗自己。',fill([blank('The cat is washing ','.',['itself','themselves']),blank('The birds are washing ','.',['themselves','itself'])],['itself','themselves']),'itself为单数；themselves为复数。'),
q('e-reflexive','独立区分看自己与看别人','Ann is looking at herself. / Ann is looking at Mary. 哪句是看自己？',choice(['第一句','第二句','两句都是'],'第一句'),'herself指回Ann；Mary是另一人。'),
q('e-emphasis','独立定位亲自的强调','We make the birthday card ourselves. 点出强调“亲自”的部分。',{type:'locate',fragments:[{value:'We'},' ',{value:'make the birthday card'},' ',{value:'ourselves'},'.'],options:['We','make the birthday card','ourselves'],answer:'ourselves'},'制作对象是卡片，ourselves强调我们亲自做。'),
q('e-oclock','独立辨认整点','钟面是3:00，哪种说法对应它？',choice(['three o’clock','half past three','a quarter past three'],'three o’clock',{image:image('clock-0300'),imageAlt:'三点整：短针指3，长针指12'}),'长针在12，三点整。'),
q('e-past','独立读一刻过后的钟点','a quarter past two是哪一个钟点？',choice(['2:15','1:45','2:45'],'2:15'),'past two是两点之后。'),
q('e-to','独立组装差一刻表达','按“差一刻到……”拼出1:45。',bank(['It’s','a quarter to','two','one'],'It’s a quarter to two',3),'差一刻到两点是1:45。'),
q('e-equal','独立认可半点两种读法','half past three 与 three thirty，哪句正确？',choice(['两种都是3:30','第一种是3:15','第二种一定错误'],'两种都是3:30'),'两种合法时间读法不能互相当作错项。'),
q('e-minute','独立换算其他分钟','twenty to four是几点？',choice(['3:40','4:20','4:40'],'3:40'),'差20分钟到4点，即3:40。'),
q('e-at-in','独立使用钟点与月份介词','补好两个不同范围的时间。',fill([blank('Meet me ',' two o’clock.',['at','in']),blank('My birthday is ',' July.',['in','at'])],['at','in']),'具体钟点用at，只有月份用in。'),
q('e-day','独立使用具体日子介词','补好确定日子和那天的上午。',fill([blank('Meet me ',' July 8th.',['on','in']),blank('Come ',' Friday morning.',['on','at'])],['on','on']),'日期和具体某一天上午用on。'),
q('e-from','独立区分来源与季节','补好来源与冬季。',fill([blank('I come ',' China.',['from','in']),blank('It is cold ',' winter.',['in','at'])],['from','in']),'来源是from；季节用in。'),
q('e-birthday','独立区分生日和年龄回应','材料：Leo, age 15, birthday 8 March。\nWhen’s Leo’s birthday?',choice(['It’s March 8th.','He’s fifteen years old.','It’s eight o’clock.'],'It’s March 8th.'),'问生日就答日期。'),
q('e-year','独立辨认年份1949','年表写着1949，选出对应读法。',choice(['nineteen forty-nine','nineteen fourteen','ninety forty-nine'],'nineteen forty-nine'),'这是一种合法年份读法。'),
q('e-zero-years','独立辨认零几年和整千年','给年份配好读法。',match([['1902','nineteen oh two'],['2000','two thousand'],['253','two fifty-three']]),'这里都是年份，不是钟点或年龄。'),
q('e-year-variants','独立接受年份合法变体','1902读nineteen oh two或nineteen hundred and two，可以吗？',choice(['两种都可以','只有第一种可以','两种都不可以'],'两种都可以'),'年份有不止一种合法读法。'),
q('e-age-response','独立回答年龄','Mia’s eighteen years old. How old is Mia?',choice(['She’s eighteen.','It’s the eighteenth.','At eighteen o’clock.'],'She’s eighteen.'),'回答年龄可省略years old。'),
q('e-when','独立转述不同人物的约定','Sam和Penny必须1:30见老板。\nWhen must Sam and Penny see the boss?',bank(['They','must see the boss','at half past one','We'],'They must see the boss at half past one',3),'转述Sam和Penny用They。'),
q('e-permission','独立区别许可请求与计划','Can I have the key, please? 在这里是在做什么？',choice(['请求允许拿钥匙','说明钥匙在哪里','叙述昨天拿过钥匙'],'请求允许拿钥匙'),'Can I…?可以礼貌请求许可；不是在询问有无手部能力。'),
q('e-date','独立认出课本日期序数','配好三个日期序数。',match([['11th','eleventh'],['12th','twelfth'],['16th','sixteenth']]),'日期序数与基数词不同。')
];
const times=[['1st','1:00','one o’clock'],['2nd','1:15','a quarter past one'],['3rd','1:30','half past one'],['4th','1:45','a quarter to two'],['5th','2:00','two o’clock'],['6th','2:15','a quarter past two'],['7th','2:30','half past two'],['8th','2:45','a quarter to three'],['9th','3:00','three o’clock'],['10th','3:15','a quarter past three'],['11th','3:30','half past three'],['12th','3:45','a quarter to four']];
unit.learning.MODELS=times.map(([number,time,en])=>({number,en:'It’s '+en+'.',result:time,cn:'同一钟点也可直接读小时和分钟。',image:image('clock-'+time.replace(':','').padStart(4,'0'))}));
unit.learning.ENJOY_MODELS=['Enjoy yourself!','I always enjoy myself.','We’re enjoying ourselves.','They’re enjoying themselves.','He’s enjoying himself.','She’s enjoying herself.'];
unit.learning.REFERENCE=[
 'I→myself；you（一个人）→yourself；he→himself；she→herself；it→itself；we→ourselves；you（多人）→yourselves；they→themselves。先看指谁和人数，不是所有动词后都加self。',
 'Jill looks at herself. 她看的是她自己。Jill looks at Tom. 她看的是别人。I make the card myself. 我亲自做这张卡，myself在这里强调由我做。Enjoy yourself! 祝你玩得开心。',
 '钟点：整点用o’clock；过了整点可说分钟＋past＋当前小时；差几分钟到下一整点用分钟＋to＋下一小时。a quarter=15分钟；half past=半点。8:20可说twenty past eight或eight twenty；6:47可说thirteen to seven或six forty-seven。',
 '年份：1949=nineteen forty-nine／nineteen hundred and forty-nine；1902=nineteen oh two／nineteen hundred and two；2000=two thousand；253=two fifty-three／two hundred and fifty-three。这些是年份，不能照此表达年龄。',
 'at用于钟点，也有at noon、at night；in用于月份、季节，也有in the morning。on用于星期、具体日期、某天的上午或节日当天：on Monday、on July 6th、on Monday morning、on your birthday、on Christmas Day。come from说来源；in your country表示所在国家。',
 'When’s your birthday?问生日哪一天；How old are you?问年龄。日期读序数；年龄用基数。图中的July日历只示范日期，不作为当前年份的星期表。',
 '1st first；2nd second；3rd third；4th fourth；5th fifth；6th sixth；7th seventh；8th eighth；9th ninth；10th tenth；11th eleventh；12th twelfth；13th thirteenth；14th fourteenth；15th fifteenth；16th sixteenth。',
 'When must you come home?由被问的人回答I must come home at…；you and Sam由其中的you回答We…；Sam and Penny由旁人转述They…。must后动词不加s。'
];
unit.learning.WRITING_A=['I am going to see him ___ ten o’clock.','It often rains ___ November.','Where do you come ___? I come ___ France.','I always go to work ___ the morning.','What’s the climate like ___ your country?','It’s cold ___ winter and hot ___ summer.'];
unit.learning.WRITING_B=['When must she go to the library? (1:15)','When must you and Sam see the dentist? (3:45)','When must you type this letter? (2:00)','When must Sam and Penny see the boss? (1:30)','When must George take his medicine? (3:15)','When must Sophie arrive in London? (2:30)','When must I catch the bus? (3:30)','When must you arrive there? (3:00)','When must they come home? (2:15)','When must you meet Sam? (1:45)','When must he telephone you? (2:45)'];
core.unit6566=unit;if(root.document?.documentElement?.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
