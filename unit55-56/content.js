(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit55-56/'+name+'.svg';
const textSource='《新概念英语智慧版1》Lesson55–56，纸页110–113／PDF143–146';
const grammarSource='《同步导学》Grammar纸页101／PDF115；《语法练习册》纸页154–158／PDF168–172';
const WORDS=[
 ['live','居住；生活','/lɪv/','live'],['stay','待在；停留','/steɪ/','stay'],['home','家；在家；到家','/həʊm/','home'],['housework','家务','/ˈhaʊswɜːk/','housework'],['lunch','午饭','/lʌntʃ/','lunch'],['afternoon','下午','/ˌɑːftəˈnuːn/','afternoon'],
 ['usually','通常','/ˈjuːʒuəli/','usually'],['together','一起','/təˈɡeðə/','together'],['evening','傍晚；晚上','/ˈiːvnɪŋ/','evening'],['arrive','到达','/əˈraɪv/','arrive'],['night','夜晚','/naɪt/','night'],['morning','早晨','/ˈmɔːnɪŋ/','morning'],
 ['noon','中午','/nuːn/','noon'],['homework','家庭作业','/ˈhəʊmwɜːk/','homework'],['dust','掸去灰尘','/dʌst/','dust'],['make the bed','整理床铺','/meɪk ðə bed/','make-bed'],['shave','刮胡子','/ʃeɪv/','shave'],['listen','听','/ˈlɪsn/','listen'],
 ['clean','打扫；清洁','/kliːn/','clean'],['wash','洗','/wɒʃ/','wash'],['type','打字','/taɪp/','type'],['read','读','/riːd/','read'],['watch','观看','/wɒtʃ/','watch'],['go to bed','去睡觉','/ɡəʊ tə bed/','go-bed']
].map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit55-56',version:1,contentRevision:'sawyer-day-v1',mode:'classroom',title:'索耶家的一天',path:'/unit55-56/',start:'learn/words',progress:{learningKey:'canran:unit55-56:learning:v1'},objects:WORDS,
 learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},
 stages:[
 {id:'l1',title:'带上日常词袋',activities:[['words','日常小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
 {id:'l2',title:'走进索耶家',activities:[['text','一天小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
 {id:'l3',title:'发现动词小变化',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
 {id:'l4',title:'整理一天的安排',activities:[['apply','日程小编','give']],required:['apply']},
 {id:'l5',title:'日常观察挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
 ],questions:{},reward:{edition:'sawyer-day-v1',title:'日常观察小达人',lesson:'Lesson 55–56',scene:'/assets/unit55-56/keepsake-story-v1.webp',alt:'索耶一家在温暖的夜晚读报、陪伴和做家庭作业',color:'#b48352',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','日程小编'],['exam','综合挑战']].map(([id,title])=>({id,title}))}
};
unit.learning.DIALOGUE=[
 ['The Sawyers live at 87 King Street.','索耶一家住在国王街87号。'],
 ['In the morning, Mr. Sawyer goes to work and the children go to school. Their father takes them to school every day.','早晨，索耶先生去上班，孩子们去上学。他们的父亲每天送他们上学。'],
 ['Mrs. Sawyer stays at home every day. She does the housework.','索耶夫人每天待在家里。她做家务。'],
 ['She always eats her lunch at noon.','她总是在中午吃午饭。'],
 ['In the afternoon, she usually sees her friends. They often drink tea together.','下午，她通常去见朋友。他们常常一起喝茶。'],
 ['In the evening, the children come home from school. They arrive home early.','傍晚，孩子们放学回家。他们到家很早。'],
 ['Mr. Sawyer comes home from work. He arrives home late.','索耶先生下班回家。他到家很晚。'],
 ['At night, the children always do their homework. Then they go to bed. Mr. Sawyer usually reads his newspaper, but sometimes he and his wife watch television.','夜晚，孩子们总是做家庭作业，然后去睡觉。索耶先生通常读报，但有时他和妻子一起看电视。']
].map(([text,cn],i)=>({id:'u5556-d'+(i+1),who:'narrator',text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u5556-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});
const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});
const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
 q('v-times','辨认一天的四个时段','把时段与意思连起来。',match([['morning','早晨'],['noon','中午'],['afternoon','下午'],['evening','傍晚']]),'morning、noon、afternoon、evening表示不同的时段。'),
 q('v-chores','区分housework与homework','擦桌子、洗碗属于哪一种？',choice(['housework','homework','lunch'],'housework',{image:image('housework'),imageAlt:'扫帚和清洁用具'}),'housework是家务；homework是家庭作业。'),
 q('v-home','区分居住停留到达','给三个动作配上意思。',match([['live','居住；生活'],['stay','待在；停留'],['arrive','到达']]),'live、stay、arrive说明不同的动作。'),
 q('v-lunch','识别lunch','中午开饭了。选出“午饭”。',choice(['lunch','night','home'],'lunch',{image:image('lunch'),imageAlt:'午餐盘、面包和水杯'}),'lunch是午饭。'),
 q('v-together','理解together','They drink tea together. 表示怎样喝茶？',choice(['一起喝茶','只在夜晚喝茶','各自独自喝茶'],'一起喝茶'),'together表示一起。'),
 q('v-usually','理解usually而不等同always','usually 的意思是什么？',choice(['通常','总是，无一例外','从不'],'通常'),'usually表示通常，不等于always。'),
 q('v-actions','辨认日常动作','把动作与意思连起来。',match([['dust','掸去灰尘'],['shave','刮胡子'],['type','打字'],['wash','洗']]),'注意dust作动词时是掸灰尘。'),
 q('v-bed','理解go to bed','月亮出来了，孩子们去睡觉。选出对应词组。',choice(['go to bed','make the bed','go to school'],'go to bed',{image:image('go-bed'),imageAlt:'床铺旁的月亮'}),'go to bed是去睡觉；make the bed是整理床铺。')
];
unit.questions.roles=[
 q('r-family','识别复数姓氏指一家人','The Sawyers live at 87 King Street. 住在那里的是谁？',choice(['索耶一家','只有索耶先生','只有两个孩子'],'索耶一家'),'the＋姓氏复数表示一家人。','看Sawyers末尾与前面的The。'),
 q('r-morning','提取早晨去向','按课文连出早晨的去向。',match([['Mr. Sawyer','goes to work'],['the children','go to school'],['Mrs. Sawyer','stays at home']]),'这是课文中这家人的日常，不是所有家庭必须这样分工。','回看早晨的两段。'),
 q('r-them','理解代词them的指代','Their father takes them to school. 这里的 them 指谁？',choice(['the children','Mr. and Mrs. Sawyer','Mrs. Sawyer and her friends'],'the children'),'爸爸送孩子们上学，them指孩子们。','谁要去学校？'),
 q('r-noon','提取午餐时段','Mrs. Sawyer什么时候吃午饭？',choice(['at noon','at night','in the morning'],'at noon'),'原文是She always eats her lunch at noon.。','在lunch附近找时间。'),
 q('r-friends','理解下午的活动','她下午通常见朋友。大家常常一起做什么？',choice(['drink tea','do homework','go to school'],'drink tea'),'They often drink tea together.。','回看下午的一段。'),
 q('r-arrival','对比两种到家时间','按课文补全到家记录。',fill([blank('The children arrive home ','.',['early','late']),blank('Mr. Sawyer arrives home ','.',['late','early'])],['early','late']),'孩子们到家早，索耶先生到家晚。','分别核对两段回家的描写。'),
 q('r-order','理解then表示先后','孩子们晚上先做作业，然后做什么？',choice(['go to bed','go to work','drink tea with friends'],'go to bed'),'Then they go to bed.承接做完作业的活动。','看Then后面。'),
 q('r-night','分辨usually与sometimes对应事实','把夜晚的活动与频率对应起来。',match([['Mr. Sawyer reads his newspaper','usually'],['Mr. and Mrs. Sawyer watch television','sometimes'],['the children do their homework','always']]),'三个频率词修饰不同的活动，不能互换事实。','逐句读夜晚一段。')
];
unit.questions.grammar=[
 g('subject','看主语决定第三人称单数形式','补全两条日常记录。',fill([blank('The children ',' at home.',['play','plays']),blank('Mr. Sawyer ',' at home.',['plays','play'])],['play','plays']),'一般现在时：he、she、it或一个人作主语，动词通常要变化。','先看动作是谁做的。',model(['We read. / He reads.','我们读书。／他读书。he是第三人称单数。'])),
 g('s','一般动词加s','用词块说：她每天读书。',bank(['She','reads','every day','read'],'She reads every day',3),'read→reads，一般情况在动词后加s。','动作是她平时做的。',model(['He takes the bus every day.','take→takes；他每天乘公交车。'])),
 g('sh','sh结尾加es','她每天洗碗。补全：',fill([blank('She ',' the dishes every day.',['washes','washs','wash'])],['washes']),'wash以sh结尾，第三人称单数用washes。','留意单词最后两个字母。',model(['He brushes his teeth.','brush→brushes；他刷牙。'])),
 g('ch-x','ch和x结尾加es','补全记录：看电视／修理自行车。',fill([blank('He ',' television.',['watches','watchs']),blank('She ',' bikes.',['fixes','fixs'])],['watches','fixes']),'watch→watches；fix→fixes。','ch、x结尾在这里都加es。',model(['She teaches English.','teach→teaches；她教英语。'])),
 g('s-ending','s结尾加es','miss表示“想念”。他想念朋友，怎样写？',choice(['He misses his friends.','He misss his friends.','He miss his friends.'],'He misses his friends.'),'miss以s结尾，第三人称单数加es。','原词末尾的ss要保留。',model(['She passes the ball.','pass→passes；她传球。'])),
 g('go-do','掌握本课go与do的第三人称形式','补全上班和家务的记录。',fill([blank('He ',' to work.',['goes','gos']),blank('She ',' the housework.',['does','dos'])],['goes','does']),'本课go→goes，do→does。','这两个常见动词的形式要记住。',model(['The bus goes to the station.','go→goes；公交车去车站。'],['Tom does his homework.','do→does；Tom做作业。'])),
 g('consonant-y','辅音字母加y结尾变ies','study表示“学习”。补全：',fill([blank('Anna ',' English every day.',['studies','studys','study'])],['studies']),'study末尾是辅音字母d＋y，变y为i再加es。','看y前面的字母。',model(['He carries a bag.','carry→carries；末尾r是辅音字母。'])),
 g('vowel-y','元音字母加y结尾直接加s','补全“她待在家里，他踢足球”。',fill([blank('She ',' at home.',['stays','staies']),blank('He ',' football.',['plays','plaies'])],['stays','plays']),'stay、play的y前是元音字母a，直接加s。','不能看到y就变ies。',model(['She buys a book.','buy→buys；y前的u是元音字母。'])),
 g('not-third','I-you-we-they不加三单词尾','找出一句正确的日常记录。',choice(['We wash the dishes.','I washes the dishes.','You washes the dishes.'],'We wash the dishes.'),'I、you、we、they后，本课实义动词用原形；它们不是同一种人称。','这里不是he、she或it作主语。',model(['They read every night.','他们每晚读书。read用原形。'])),
 g('family','姓氏复数作主语用原形','The Sawyers表示索耶一家。补全：',fill([blank('The Sawyers ',' in London.',['live','lives'])],['live']),'The Sawyers指一家人，在这里是复数主语。','一家人不等于一个人。',model(['Tom and Anna live here.','两个人作主语，用live。'])),
 g('independent-s','独立使用一般加s规则','用词块记录：她每天吃午饭。',bank(['She','eats','her lunch','every day','eat'],'She eats her lunch every day',4),'she后用eats。','先认主语，再选动词。'),
 g('independent-es','独立选择sh-ch结尾形式','补全两位同学的日常活动。',fill([blank('Anna ',' her hands.',['washes','washs']),blank('Tom ',' television.',['watches','watchs'])],['washes','watches']),'wash和watch的第三人称单数都加es。','观察动词结尾。'),
 g('independent-y','独立区分两种y结尾','try表示“尝试”，play表示“玩”。哪一组变化都正确？',choice(['try → tries；play → plays','try → trys；play → plays','try → tries；play → plaies'],'try → tries；play → plays'),'辅音字母＋y变ies；元音字母＋y加s。','分别看y前面的字母。'),
 g('question','does问句后恢复原形','问“她每天看书吗？”补全：',fill([blank('',' she',['Does','Do']),blank('',' every day?',['read','reads'])],['Does','read']),'Does she read…?中，does已经发生变化，read用原形。','不要同时把两个动词都加s。',model(['Does he work here?','问he时用Does，work用原形。'])),
 g('independent-plural','在同一段中切换单复数主语','夜晚的记录，哪句正确？',choice(['The children do their homework.','The children does their homework.','The children dos their homework.'],'The children do their homework.'),'the children是复数主语，用do。','children表示不止一个孩子。')
];
unit.questions.apply=[
 q('a-time','为日程选择时间介词','给午饭和下午活动补上时间。',fill([blank('We eat lunch ',' noon.',['at','in']),blank('We play ',' the afternoon.',['in','at'])],['at','in']),'at noon；in the afternoon。','noon与morning／afternoon的搭配不同。'),
 q('a-question','询问一个人的日常活动','用词块问：她早晨做什么？',bank(['What','does','she','do','in the morning','doing'],'What does she do in the morning',5,'?'),'What does she do…?第一个does是助动词，后面的do表示做什么。','问她平常的活动。'),
 q('a-plural','询问多个人的活动','两位同学的日程还没填。补全问句：',fill([blank('What ',' they',['do','does']),blank('',' at night?',['do','does'])],['do','do']),'they后用do；后面的动作也用原形do。','这次问的是他们。'),
 q('a-negative','否定日常活动时保持原形','Anna晚间读书，不看电视。补全：',fill([blank('She ','',['doesn’t','don’t']),blank('',' television in the evening.',['watch','watches'])],['doesn’t','watch']),'doesn’t后用动词原形。','否定的是看电视这个活动。'),
 q('a-frequency','将usually用于日常记录','用词块说：他们通常一起喝茶。',bank(['They','usually','drink tea','together','drinks tea'],'They usually drink tea together',4),'usually常放在实义动词前；they后用drink。','先说谁，再写通常做的事。'),
 q('a-home','区分home的方向用法','表达“他们到家很早”，选哪一条？',choice(['They arrive home early.','They arrive to home early.','They arrives home early.'],'They arrive home early.'),'这里home是副词，arrive home不加to。','home前不再加to。'),
 q('a-number','识别复合序数词','给日程卡编号配上读法。',match([['21st','twenty-first'],['22nd','twenty-second'],['23rd','twenty-third'],['24th','twenty-fourth']]),'这组序数词的词尾随最后的first、second、third、fourth变化。','看编号末尾。'),
 q('a-send','综合读取日程而不虚构人物习惯','Tom 的日程：morning — make the bed；evening — sometimes watch television。\n哪条英文记录完全相符？',choice(['Tom makes the bed in the morning. He sometimes watches television in the evening.','Tom makes the bed at night. He always watches television in the morning.','Tom make the bed in the morning. He sometimes watch television in the evening.'],'Tom makes the bed in the morning. He sometimes watches television in the evening.'),'同时检查时段、频率和Tom后面的动词形式。','两项活动都要核对。')
];
const demos={time:model(['in the morning / at night','在早晨／在夜晚；every day前不加in或at。']),question:model(['What does he do at noon?','他中午做什么？两个do分别承担助动词和动作的作用。']),plural:model(['What do you do every day?','你每天做什么？']),negative:model(['He doesn’t read at night.','doesn’t后read用原形。']),frequency:model(['She often reads.','often常放在实义动词reads之前。']),home:model(['We go home.','这里home表示回家，不用to。']),number:model(['1st · first / 2nd · second / 3rd · third / 4th · fourth','第一／第二／第三／第四。'])};
for(const item of unit.questions.apply){const demo=demos[item.id.replace('u5556-v1-a-','')];if(demo)item.workshop={model:demo};}
unit.questions.exam=[
 q('e-live','在新材料中区分live与arrive','Anna住在这里，每晚六点到家。给两句配词。',fill([blank('Anna ',' here.',['lives','arrives']),blank('She ',' home at six.',['arrives','lives'])],['lives','arrives']),'lives说居住，arrives说到达。'),
 q('e-chores','在具体情景中区分家务和作业','给两项任务分类。',match([['wash the dishes','housework'],['finish the maths exercises','homework']]),'洗碗是家务；完成数学练习是家庭作业。'),
 q('e-times','将时段和动作配对阅读','记录卡：午饭在中午，作业在夜晚。哪组对应正确？',choice(['lunch → noon；homework → night','lunch → night；homework → noon','lunch → morning；homework → afternoon'],'lunch → noon；homework → night'),'根据题目给出的记录配对，不猜自己的作息。'),
 q('e-family','综合理解送学者与代词指代','按课文，谁每天送谁去学校？',choice(['Mr. Sawyer送孩子们','孩子们送Mrs. Sawyer','Mrs. Sawyer送朋友们'],'Mr. Sawyer送孩子们'),'Their father takes them to school.。'),
 q('e-order','整合课文傍晚与夜晚的先后','按故事，孩子们的一串活动是哪一组？',choice(['放学回家 → 做作业 → 睡觉','睡觉 → 去上班 → 喝茶','做家务 → 去上班 → 睡觉'],'放学回家 → 做作业 → 睡觉'),'傍晚放学回家，夜晚做作业，然后睡觉。'),
 q('e-facts','核对频率和人物事实','哪份记录同时符合课文两条信息？',choice(['孩子们到家早；父母有时一起看电视','孩子们到家晚；父亲总是看电视','父亲到家早；孩子们通常去上班'],'孩子们到家早；父母有时一起看电视'),'children arrive early；父母sometimes watch television。'),
 q('e-subject','识别三单主语所在的完整句','找到这句话里做动作的人。',{type:'locate',fragments:[{value:'Anna'},' ',{value:'reads'},' ',{value:'every morning'},'.'],options:['Anna','reads','every morning'],answer:'Anna'},'Anna是主语，表示一个人。'),
 q('e-s','迁移一般动词加s规则','用词块写：他每天打开窗户。',bank(['He','opens','the window','every day','open'],'He opens the window every day',4),'he后open加s变opens。'),
 q('e-sh','独立运用sh结尾规则','finish表示“完成”。她做完作业：',fill([blank('She ',' her homework.',['finishes','finishs','finish'])],['finishes']),'finish以sh结尾，加es。'),
 q('e-ch','独立运用ch结尾规则','catch表示“赶上”。他每天赶公交车：',choice(['He catches the bus every day.','He catchs the bus every day.','He catch the bus every day.'],'He catches the bus every day.'),'catch以ch结尾，加es。'),
 q('e-x','迁移x结尾动词','fix表示“修理”。用词块写：爸爸修自行车。',bank(['Dad','fixes','bikes','fixs'],'Dad fixes bikes',3),'Dad指一个人，fix→fixes。'),
 q('e-s-ending','区分正确与错误的s结尾形式','miss表示“想念”。给记录选一个动词。',fill([blank('Tom ',' his sister.',['misses','misss','miss'])],['misses']),'miss→misses，保留原词再加es。'),
 q('e-go-do','在语境中区分go和do变化','补全上学和作业的记录。',fill([blank('Anna ',' to school.',['goes','gos']),blank('She ',' her homework at night.',['does','dos'])],['goes','does']),'go→goes，do→does。'),
 q('e-y','辅音加y的新主语应用','carry表示“携带”。选出正确记录。',choice(['Tom carries a bag.','Tom carrys a bag.','Tom carry a bag.'],'Tom carries a bag.'),'carry末尾r＋y，变y为i再加es。'),
 q('e-vowel','元音加y不可误改ies','stay是待在，play是玩。哪组形式都正确？',choice(['stays / plays','staies / plays','stays / plaies'],'stays / plays'),'两词的y前都是元音字母a，直接加s。'),
 q('e-plural','新姓氏复数不当作单数','The Browns指布朗一家。补全：',fill([blank('The Browns ',' here.',['live','lives']),blank('They ',' to work in the morning.',['go','goes'])],['live','go']),'The Browns与they都表示复数。'),
 q('e-question','问句中does与原形配合','问“Tom每天读报吗？”',fill([blank('',' Tom',['Does','Do']),blank('',' a newspaper every day?',['read','reads'])],['Does','read']),'Does之后用read原形。'),
 q('e-negative','新动作中使用does-not与原形','用词块说：她夜晚不打字。',bank(['She','doesn’t','type','at night','types'],'She doesn’t type at night',4),'doesn’t后type用原形。'),
 q('e-frequency','理解频率不夸大为总是','Anna usually reads at night. 哪份中文记录准确？',choice(['Anna通常在夜晚读书','Anna每个夜晚都一定读书','Anna从不在夜晚读书'],'Anna通常在夜晚读书'),'usually不能被夸大为总是、无一例外。'),
 q('e-home','独立构成come-home','用词块说：他们回家很晚。',bank(['They','come','home','late','to'],'They come home late',4),'come home之间不加to。'),
 q('e-preposition','将时间介词用于新句','完成两条日程。',fill([blank('He shaves ',' the morning.',['in','at']),blank('They read ',' night.',['at','in'])],['in','at']),'in the morning；at night。'),
 q('e-ordinal','迁移三十几的序数词','给编号配上读法。',match([['31st','thirty-first'],['32nd','thirty-second'],['33rd','thirty-third'],['34th','thirty-fourth']]),'三十几的序数词在最后一部分变化。'),
 q('e-transfer','用时段活动频率和三单整合日程','Lily的日程：中午总是吃午饭；下午通常见朋友。\n哪条记录可以交给她？',choice(['She always eats lunch at noon. She usually sees her friends in the afternoon.','She always eat lunch at noon. She usually see her friends in the afternoon.','She sometimes eats lunch at night. She always sees her friends in the morning.'],'She always eats lunch at noon. She usually sees her friends in the afternoon.'),'两条记录的活动、时段、频率和动词形式都需要正确。')
];
unit.learning.MODELS=[
 ['1st · first','dust','What does she do every day?','She dusts the cupboard every day.'],['2nd · second','make-bed','What does she do in the morning?','She makes the bed in the morning.'],['3rd · third','shave','What does he do in the morning?','He shaves in the morning.'],['4th · fourth','listen','What do they do in the evening?','They listen to the stereo in the evening.'],
 ['21st · twenty-first','clean','What does he do every day?','He cleans the blackboard every day.'],['22nd · twenty-second','go-bed','What do they do at night?','They go to bed at night.'],['23rd · twenty-third','wash','What does she do every day?','She washes the dishes every day.'],['24th · twenty-fourth','type','What do they do in the afternoon?','They type letters in the afternoon.'],
 ['31st · thirty-first','milk','What does it do every day?','It drinks milk every day.'],['32nd · thirty-second','watch','What do they do in the evening?','They watch television in the evening.'],['33rd · thirty-third','lunch','What does she do at noon?','She eats her lunch at noon.'],['34th · thirty-fourth','read','What does he do in the evening?','He reads his newspaper in the evening.']
].map(([number,art,en,cn])=>({number,image:image(art),en,cn}));
unit.learning.REFERENCE=[
 '一般现在时说本课的日常和习惯，不是“此刻正在做”。I、you、we、they及复数主语用动词原形；he、she、it和一个人通常用第三人称单数形式。',
 '一般加s：read → reads。sh、ch、x、s结尾加es：wash → washes，watch → watches，fix → fixes，miss → misses。本课go → goes，do → does。',
 '辅音字母＋y：study → studies，carry → carries。元音字母＋y：stay → stays，play → plays。不能见到y就改ies。',
 '问句：What does she do…?／What do they do…? 否定句：She doesn’t read.／They don’t read. 有does或doesn’t时，后面的动词恢复原形。',
 'in the morning／afternoon／evening；at noon／night。every day前不加in或at。go／come／arrive home，这里的home前不加to。',
 'always（总是）、usually（通常）、often（经常）、sometimes（有时）不设死板的百分比；它们在本课例句中放在实义动词之前，句子中也可能有其他合理位置。',
 'The Sawyers表示索耶一家，是复数主语。家务由谁做、几点回家是课文中这一家的故事，不是所有家庭的规定。',
 '1st／2nd／3rd／4th；21st／22nd／23rd／24th；31st／32nd／33rd／34th。复合序数词最后一部分变化；11th、12th、13th是另须记住的词尾。'
];
unit.learning.WRITING_A=['The children go____ to school in the morning.','Their father take____ them to school.','Mrs. Sawyer stay____ at home.','She do____ the housework.','She always eat____ her lunch at noon.'];
unit.learning.WRITING_B=['she / morning — always / make / the bed','he / morning — always / shave','they / evening — sometimes / listen to / the stereo','he / every day — always / clean / the blackboard','they / night — always / go / to bed early','she / every day — usually / wash / the dishes','they / afternoon — usually / type / some letters','it / every day — usually / drink / some milk','they / evening — sometimes / watch / television','she / noon — always / eat / her lunch','he / evening — often / read / his newspaper'];
core.unit5556=unit;
if(root.document?.documentElement?.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
