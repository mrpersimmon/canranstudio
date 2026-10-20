(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit57-58/'+name+'.svg';
const textSource='《新概念英语智慧版1》Lesson57–58，纸页114–117／PDF147–150';
const grammarSource='《同步导学》Grammar纸页104／PDF118；《语法练习册》纸页159–164／PDF173–178';
const WORDS=[
 ["o’clock",'……点钟（整点）','/əˈklɒk/','clock-8'],['shop','商店','/ʃɒp/','shop'],['moment','片刻；瞬间','/ˈməʊmənt/','moment'],['by car','乘小汽车','/baɪ kɑː/','car'],['on foot','步行','/ɒn fʊt/','foot'],['at the moment','此刻','/ət ðə ˈməʊmənt/','now'],
 ['today','今天','/təˈdeɪ/','today'],['tonight','今晚','/təˈnaɪt/','tonight'],['every day','每天','/ˈevri deɪ/','every-day'],['usually','通常','/ˈjuːʒuəli/','usually'],['living room','客厅','/ˈlɪvɪŋ ruːm/','living-room'],['garden','花园','/ˈɡɑːdn/','garden'],
 ['book','书','/bʊk/','book'],['newspaper','报纸','/ˈnjuːzpeɪpə/','newspaper'],['drink tea','喝茶','/drɪŋk tiː/','tea'],['shave','刮胡子','/ʃeɪv/','shave'],['cook a meal','做饭','/kʊk ə miːl/','cook'],['listen to the stereo','听音响','/ˈlɪsn tə ðə ˈsteriəʊ/','stereo']
].map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit57-58',version:1,contentRevision:'unusual-day-v1',mode:'classroom',title:'今天不一样',path:'/unit57-58/',start:'learn/words',progress:{learningKey:'canran:unit57-58:learning:v1'},objects:WORDS,
 learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},
 stages:[
 {id:'l1',title:'带上观察词袋',activities:[['words','今天小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
 {id:'l2',title:'发现今天的不同',activities:[['text','不一样的小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
 {id:'l3',title:'分清平时与此刻',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
 {id:'l4',title:'记录眼前的事',activities:[['apply','此刻小记者','give']],required:['apply']},
 {id:'l5',title:'不同之处挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
 ],questions:{},reward:{edition:'unusual-day-v1',title:'此刻观察小达人',lesson:'Lesson 57–58',scene:'/assets/unit57-58/keepsake-story-v1.webp',alt:'索耶先生今晚正读着一本有趣的书，平时看的报纸合好放在一旁',color:'#85966f',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','此刻小记者'],['exam','综合挑战']].map(([id,title])=>({id,title}))}
};
unit.learning.DIALOGUE=[
 ['It is eight o’clock. The children go to school by car every day, but today, they are going to school on foot.','现在是八点。孩子们每天乘小汽车去上学，但今天他们正步行去上学。'],
 ['It is ten o’clock. Mrs. Sawyer usually stays at home in the morning, but this morning, she is going to the shops.','现在是十点。索耶夫人上午通常待在家里，但今天上午，她正去商店。'],
 ['It is four o’clock. In the afternoon, Mrs. Sawyer usually drinks tea in the living room. But this afternoon, she is drinking tea in the garden.','现在是四点。下午，索耶夫人通常在客厅喝茶。但今天下午，她正在花园里喝茶。'],
 ['It is six o’clock. In the evening, the children usually do their homework, but this evening, they are not doing their homework. At the moment, they are playing in the garden.','现在是六点。傍晚，孩子们通常做家庭作业，但今天傍晚，他们没有在做家庭作业。此刻，他们正在花园里玩耍。'],
 ['It is nine o’clock. Mr. Sawyer usually reads his newspaper at night. But he’s not reading his newspaper tonight. At the moment, he’s reading an interesting book.','现在是九点。索耶先生夜晚通常读报。但今晚，他没有在读报。此刻，他正在读一本有趣的书。']
].map(([text,cn],i)=>({id:'u5758-d'+(i+1),who:'narrator',text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u5758-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});
const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});
const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
 q('v-clock','理解o’clock表示整点','It is eight ___. 选择表示“点钟”的词。',choice(["o’clock",'shop','moment'],"o’clock",{image:image('clock-8'),imageAlt:'指针指向八点整的钟面'}),'o’clock与数字一起表示整点。'),
 q('v-shop','识别shop商店','哪一个词是“商店”？',choice(['shop','garden','living room'],'shop',{image:image('shop'),imageAlt:'有橱窗和遮阳篷的商店'}),'shop是商店。'),
 q('v-moment','理解at-the-moment语境','At the moment, she is reading. 这里at the moment是什么意思？',choice(['此刻','每天','明年'],'此刻'),'moment是片刻；at the moment在这里表示此刻。'),
 q('v-transport','区分两种出行方式','把出行方式与意思连起来。',match([['by car','乘小汽车'],['on foot','步行']]),'by car与on foot表达不同的出行方式。'),
 q('v-clues','辨认频率与具体时间','把三个表达与意思连起来。',match([['every day','每天'],['usually','通常'],['tonight','今晚']]),'每天、通常和今晚不表示同一种时间信息。'),
 q('v-reading','区分book与newspaper','选出图中的物品。',choice(['book','newspaper','shop'],'book',{image:image('book'),imageAlt:'有书脊和封面的打开的书'}),'book是书，newspaper是报纸。'),
 q('v-places','辨认living-room而非garden','沙发和茶几在室内，这个房间叫什么？',choice(['living room','garden','shop'],'living room',{image:image('living-room'),imageAlt:'客厅里的沙发和茶几'}),'living room是客厅。')
];
unit.questions.roles=[
 q('r-school','对照上学方式与时间','孩子们平时和今天怎样去上学？',match([['every day','by car'],['today','on foot']]),'同样是去上学，今天的方式和平时不同。','核对第一段but前后。'),
 q('r-shops','提取十点的活动','按课文，十点钟索耶夫人正在做什么？',choice(['She is going to the shops.','She is staying at home.','She is doing her homework.'],'She is going to the shops.'),'十点这一段说她今天上午正去商店。','找ten o’clock所在的一段。'),
 q('r-tea','提取今天喝茶的地点','今天下午四点，她在哪里喝茶？',choice(['in the garden','in the living room','at school'],'in the garden'),'今天在花园，平时在客厅。','区分usually与this afternoon。'),
 q('r-play','核对正在做与没有在做','按傍晚六点的原文补全记录。',fill([blank('The children ',' doing their homework.',['aren’t','don’t']),blank('They ',' in the garden.',['are playing','plays'])],['aren’t','are playing']),'孩子们此刻没有在做作业，正在花园里玩。','这两句只说此刻。'),
 q('r-book','提取今晚阅读对象','今晚九点，索耶先生正在读什么？',choice(['an interesting book','his newspaper','a shopping list'],'an interesting book'),'平时看报，今晚看一本有趣的书。','在最后一段找reading后面的物品。'),
 q('r-times','整合时刻人物和事件','把时刻与故事中的事件配好。',match([['eight o’clock','children → school'],['ten o’clock','Mrs. Sawyer → shops'],['nine o’clock','Mr. Sawyer → book']]),'三个时刻分别对应上学、去商店和读书。','按原文的时间顺序核对。'),
 q('r-unknown','不把未说明的原因编成事实','今天孩子们为什么没有乘车？',choice(['不能确定原因，课文没有说','因为汽车坏了','因为爸爸忘了送他们'],'不能确定原因，课文没有说'),'课文只说今天步行，没有说明原因。','找不到依据的信息不能当作原文事实。')
];
unit.questions.grammar=[
 g('meaning','理解习惯而非只识别时间词','She reads every evening. 这句话主要说什么？',choice(['平时反复发生的事','此刻眼前正在进行的动作','已经结束的一次动作'],'平时反复发生的事'),'一般现在时可表达重复发生的习惯。','看它说的是一贯的情况还是这一次。',model(['We walk every day. / We are walking now.','我们每天步行。／我们此刻正在步行。'])),
 g('be','按主语补齐进行时的be','两位小记者正在写记录，补全句子。',fill([blank('I ',' writing now.',['am','is']),blank('We ',' writing now.',['are','is'])],['am','are']),'现在进行时用am/is/are＋动词-ing。','先看动作是谁做的。',model(['She is reading now.','她此刻正在读书。be与主语配合，不能漏掉。'])),
 g('contrast','在同一人物的两种时间里选择形式','她平时喝茶，眼前正在喝水。',fill([blank('She usually ',' tea.',['drinks','is drinking']),blank('Now she ',' water.',['is drinking','drinks'])],['drinks','is drinking']),'习惯用drinks，此刻动作用is drinking。','两句的时间范围不同。',model(['He reads every night, but now he is writing.','他每晚读书，但现在正在写字。'])),
 g('ing','复习进行时所需的ing形式','补好“正在来”和“正在游泳”。',fill([blank('She is ',' now.',['coming','comeing']),blank('They are ','.',['swimming','swiming'])],['coming','swimming']),'come去末尾e加ing；swim双写m再加ing。','先看这两个动词的词尾。',model(['make → making / run → running','末尾不发音e去掉；run这类词双写末尾辅音字母。'])),
 g('negative','表达此刻没有在进行','用词块说：他们现在没有在玩。',bank(['They','are not','playing','now','do not'],'They are not playing now',4),'进行时的否定在be后加not，仍保留-ing。','保留be和动作的-ing形式。',model(['She is not reading now.','她此刻没有在读书。'])),
 g('question','询问此刻正在做的事','问：孩子们现在正在读书吗？',bank(['Are','the children','reading','now','Do'],'Are the children reading now',4,'?'),'现在进行时提问，把are放到主语前。','这里问的是此刻。',model(['Is he cooking now?','他现在正在做饭吗？'])),
 g('two-questions','区分习惯提问与此刻提问','给两位记者的问题选词。',fill([blank('What ',' she usually do?',['does','is']),blank('What ',' she doing now?',['is','does'])],['does','is']),'一般现在时用does…do；现在进行时用is…doing。','不要只看主语相同。',model(['What do they do every day? / What are they doing now?','他们每天做什么？／他们现在正在做什么？'])),
 g('stable','理解稳定居住与暂时居住','My parents are living with me this month. 更接近哪种情况？',choice(['最近暂时住在这里','永远只能住在这里','此刻正在建房子'],'最近暂时住在这里'),'进行时也可表达现阶段的暂时情况，不限于一秒钟的动作。','this month限定了这里讨论的阶段。',model(['My parents live in Shanghai.','这是通常的居住情况。稳定不等于永远不改变。'])),
 g('like','区分喜好和知道两种状态的常见表达','Ann喜欢这本书，也知道作者的名字（the writer’s name）。补全记录。',fill([blank('Ann ',' this book.',['likes','is liking']),blank('She ',' the writer’s name.',['knows','is knowing'])],['likes','knows']),'本课表示喜好的like与表示知道的know通常不用进行时。','“喜欢”说的是状态。',model(['She likes tea.','表示喜好时，通常用一般现在时。'])),
 g('clues','同一语境中区分动作与状态','眼前Lily正在读书，她想要一些茶。',fill([blank('Lily ',' a book now.',['is reading','reads']),blank('She ',' some tea.',['wants','is wanting'])],['is reading','wants']),'读是正在进行的动作，想要是状态；不把同一时间的词都变成-ing。','判断动词表达的是动作还是状态。',model(['We are walking. We like the garden.','正在步行是动作；喜欢花园是状态。'])),
 g('independent-contrast','撤去示范对照平时与今天','Tom通常步行上学，但现在正乘车上学。',fill([blank('Tom usually ',' to school.',['walks','is walking']),blank('Now he ',' to school by car.',['is going','goes'])],['walks','is going']),'前句说明习惯，后句说明眼前的动作。','分别核对两句的时间含义。'),
 g('independent-negative','独立用否定纠正此刻记录','画面记录：爸爸现在正在做饭，没有在读书。哪条说明准确？',choice(['He isn’t reading. He is cooking.','He doesn’t reading. He is cooking.','He isn’t reading. He cooks now.'],'He isn’t reading. He is cooking.'),'否定和肯定都在描述此刻正在进行的动作。','检查be、not与-ing是否完整。'),
 g('independent-context','不把today当作无条件时态开关','I want a book today. 有today就必须改成am wanting吗？',choice(['today不能单独决定时态，要看说的是什么','必须，只要有today就用进行时','必须，所有动词都能直接加ing'],'today不能单独决定时态，要看说的是什么'),'时间表达提供线索，仍须结合动词含义和语境。','这句话的want表示什么？'),
 g('independent-temporary','独立表达现阶段暂时居住','朋友们只在这个月暂住我家。选出突出这段暂住情况的句子。',choice(['They are living with us this month.','They live with us every year.','They are leaving us now.'],'They are living with us this month.'),'现在进行时也能表达这段时间内的暂时情况。','不是每年重复，也不是正在离开。')
];
unit.questions.apply=[
 q('a-time','看钟面回答时间','What’s the time? 看钟面填完整。',fill([blank('It is ',' o’clock.',['ten','eight','twelve'])],['ten']),'钟面是十点整。','长针在12，短针指出几点。'),
 q('a-ask','向观察对象询问当前动作','你看到朋友正在忙，问他：你现在正在做什么？',bank(['What','are','you','doing','now','do'],'What are you doing now',5,'?'),'问此刻动作，用What are you doing…?。','现在进行时里需要be。'),
 q('a-interview','采访同一人的习惯与此刻','Lily平时在家读书。现在她正在花园读书。补好两个问题。',fill([blank('',' Lily usually read at home?',['Does','Is']),blank('',' she reading in the garden now?',['Is','Does'])],['Does','Is']),'读的习惯与眼前正在读，要用不同的提问结构。','注意read和reading。'),
 q('a-reply','按观察事实回应而非套肯定','别人问：Are you cooking now? 你此刻正在读书。怎样回答？',choice(['No, I’m not. I’m reading a book.','Yes, I am. I’m reading a book.','No, I don’t. I read a book.'],'No, I’m not. I’m reading a book.'),'先否定对方的猜测，再说正在做什么。','回答要和问题中的are配合。'),
 q('a-report','组合平时和今晚的活动','给自己写记录：平时晚上做饭，但今晚正在读书。',bank(['I','usually','cook','in the evening','but tonight','I am reading','I reading'],'I usually cook in the evening but tonight I am reading',6),'usually说明习惯；今晚正在读用am reading。','but连接不同的情况。'),
 q('a-shave','将准确时刻和正在做的事结合','记录卡：平时7点刮胡子；现在8点，正在刮胡子。',fill([blank('He usually shaves ',' seven o’clock.',['at','in']),blank('Now he ',' at eight o’clock.',['is shaving','shaves'])],['at','is shaving']),'具体钟点前用at；眼前正在刮胡子用is shaving。','同时检查时间搭配和动作形式。'),
 q('a-number','区分teen与复合序数词','给观察卡编号配上读法。',match([['13th','thirteenth'],['14th','fourteenth'],['21st','twenty-first'],['22nd','twenty-second']]),'13th、14th和21st、22nd的词尾与读法不同。','看整个数字，不只看最后一位。'),
 q('a-caption','综合核对现场时刻人物动作地点','快照：傍晚六点，两个孩子正在花园里玩。哪条英文可以作配文？',choice(['It’s six o’clock. The children are playing in the garden now.','It’s nine o’clock. The children are playing in the garden now.','It’s six o’clock. The children do their homework every day.'],'It’s six o’clock. The children are playing in the garden now.'),'配文要同时符合时刻、人物、此刻动作与地点。','四项信息都要核对。')
];
const demos={time:model(['It is three o’clock.','说几点整，用数字＋o’clock。']),ask:model(['What is she doing now?','她现在正在做什么？']),interview:model(['Do they read every day? / Are they reading now?','每天的习惯／此刻的动作，问题不同。']),reply:model(['Is she cooking? No, she isn’t. She is eating.','按眼前事实先回答，再说明动作。']),report:model(['He usually walks, but today he is going by car.','but把平时和今天的不同情况连接起来。']),shave:model(['She usually eats at noon, but now she is drinking tea.','具体时间与动作一起核对。']),number:model(['11th · eleventh / 12th · twelfth / 20th · twentieth','第十一／第十二／第二十。'])};
for(const item of unit.questions.apply){const demo=demos[item.id.replace('u5758-v1-a-','')];if(demo)item.workshop={model:demo};}
unit.questions.exam=[
 q('e-clock','独立读整点钟面','What’s the time?',choice(["It’s eleven o’clock.","It’s one o’clock.","It’s twelve o’clock."],"It’s eleven o’clock.",{image:image('clock-11'),imageAlt:'长针在12，短针在11的钟面'}),'短针指11、长针指12，是十一点整。'),
 q('e-transport','在完整句中选择出行介词','她通常乘车，但今天正步行。',fill([blank('She usually goes ',' car.',['by','on']),blank('Today she is going ',' foot.',['on','by'])],['by','on']),'by car；on foot。'),
 q('e-moment','在完整句中定位此刻表达','哪部分表示“此刻”？',{type:'locate',fragments:[{value:'At the moment'},', ',{value:'she'},' ',{value:'is reading'},'.'],options:['At the moment','she','is reading'],answer:'At the moment'},'At the moment表示此刻。'),
 q('e-morning','整合上午习惯与今天变化','关于索耶夫人的上午，哪条符合课文？',choice(['平时上午待在家；今天上午去商店','平时上午去商店；今天上午待在家','每天上午都在花园喝茶'],'平时上午待在家；今天上午去商店'),'课文十点这一段把平时和今天作了对比。'),
 q('e-tea','区分地点改变与动作改变','今天下午喝茶这件事，有什么不同？',choice(['习惯在客厅喝茶，今天下午在花园喝茶','习惯喝咖啡，今天下午改喝茶','习惯在学校喝茶，今天下午去商店喝茶'],'习惯在客厅喝茶，今天下午在花园喝茶'),'改变的是地点，不是把喝茶换成喝咖啡。'),
 q('e-night','独立记录今晚夜读','哪句能给课文今晚九点的索耶先生配文？',choice(['He is reading a book.','He reads a newspaper every night.','He is doing his homework.'],'He is reading a book.'),'今晚正在读书，而不是平常的读报。'),
 q('e-order','按课文时间排列主要场景','依次摆好8点、10点、4点、9点的场景词：上学、商店、花园、书。',bank(['school','shops','garden','book'],'school shops garden book',4,''),'依照课文各时段出现的地点或物品排序。'),
 q('e-meaning','独立辨认反复动作含义','They play in the garden every afternoon. 这里说的是：',choice(['经常发生的习惯','只发生在此刻的一次动作','以后永远不能改变的规则'],'经常发生的习惯'),'every afternoon说明反复发生，不是此刻的一次快照。'),
 q('e-be','新人物中独立补齐进行时be','此刻我正在读书，她正在写字。',fill([blank('I ',' reading now.',['am','is']),blank('She ',' writing now.',['is','are'])],['am','is']),'I配am；she配is。'),
 q('e-contrast','在新动作组合中运用两种时态','Lily每天读书，但现在正在写信。',fill([blank('Lily ',' every day.',['reads','is reading']),blank('Now she ',' a letter.',['is writing','writes'])],['reads','is writing']),'重复的习惯用reads，眼前动作用is writing。'),
 q('e-negative','独立构造进行时否定句','用词块说：他们现在没有在看电视。',bank(['They','are not','watching television','now','do not'],'They are not watching television now',4),'be后加not，动词保持-ing。'),
 q('e-question','独立构造进行时一般疑问句','用词块问：她现在正在喝茶吗？',bank(['Is','she','drinking tea','now','Does'],'Is she drinking tea now',4,'?'),'用Is she drinking…?询问此刻动作。'),
 q('e-two-questions','新复数主语中区分两类问句','补全两句：平时做什么？此刻做什么？',fill([blank('What ',' the children do every day?',['do','are']),blank('What ',' they doing now?',['are','do'])],['do','are']),'do…do问习惯；are…doing问此刻动作。'),
 q('e-stable','描述日常稳定的居住情况','父母平常住在北京。选出符合这条日常资料的句子。',choice(['My parents live in Beijing.','My parents are leaving Beijing now.','My parents are visiting Beijing today.'],'My parents live in Beijing.'),'居住资料用一般现在时，不能擅自变成离开或参观。'),
 q('e-temporary','独立描述暂时情况','她只在这周暂住姑妈家。哪句突出暂住？',choice(['She is living with her aunt this week.','She lives with her aunt every year.','She is leaving her aunt now.'],'She is living with her aunt this week.'),'现在进行时可描述这周这段时间的暂时情况。'),
 q('e-like','独立表达喜好与知道的状态','Tom喜欢牛奶，也知道老师的名字。补全记录。',fill([blank('Tom ',' milk.',['likes','is liking']),blank('He ',' his teacher’s name.',['knows','is knowing'])],['likes','knows']),'此处like与know表示状态；用likes和knows。'),
 q('e-want','有now仍根据动词含义选择','我现在想要一些茶。怎样说？',choice(['I want some tea now.','I am wanting some tea now.','I wants some tea now.'],'I want some tea now.'),'表示想要的want通常不用进行时，不能见到now就机械改写。'),
 q('e-time','整点介词与表达综合','每天七点吃早饭。把时间写完整。',fill([blank('We eat breakfast ',' seven.',['at','in']),blank('现在七点整：It is seven ','.',["o’clock",'moment'])],['at',"o’clock"]),'具体钟点用at；seven o’clock表示七点整。'),
 q('e-ordinal','独立识别第58课编号','把编号和读法配好。',match([['11th','eleventh'],['12th','twelfth'],['15th','fifteenth'],['20th','twentieth']]),'11、12、15、20的序数词要完整识别。'),
 q('e-ing','新句中选择正确ing形式','此刻她正在做饭，孩子们正在跑步。',fill([blank('She is ',' a meal.',['making','makeing']),blank('The children are ','.',['running','runing'])],['making','running']),'make去e加ing；run双写n再加ing。'),
 q('e-inference','不把此刻否定泛化到一整天','They are not doing their homework at the moment. 能说明他们今天一直没做作业吗？',choice(['只能确定此刻没做作业，不能断定一整天都没做','能，今天任何时候都没有做','能，他们以后也不会做'],'只能确定此刻没做作业，不能断定一整天都没做'),'原句只给出此刻的情况，不能延伸成整天或将来的事实。'),
 q('e-transfer','综合新记录中的动作地点与两种时态','Anna记录：平时在客厅喝茶；眼前正在花园喝咖啡。哪条同时准确？',choice(['She usually drinks tea in the living room, but now she is drinking coffee in the garden.','She usually is drinking tea in the garden, but now she drinks coffee in the living room.','She usually drinks coffee in the living room, but now she is drinking tea in the garden.'],'She usually drinks tea in the living room, but now she is drinking coffee in the garden.'),'需要同时核对平时／此刻、动作对象、地点和动词形式。')
];
unit.learning.CLOCKS=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'].map((word,i)=>({image:image('clock-'+(i+1)),en:'It is '+word+' o’clock.',number:['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'][i]}));
unit.learning.MODELS=[
 ['13th / 14th','shave','He usually shaves at seven o’clock every day.','But today, he is shaving at eight o’clock.'],
 ['15th / 16th','tea','She usually drinks tea in the morning.','But this morning, she is drinking coffee.'],
 ['17th / 18th','garden','They usually play in the garden in the afternoon.','But this afternoon, they are swimming in the river.'],
 ['19th / 20th','cook','I usually cook a meal in the evening.','But this evening, I am reading a book.'],
 ['21st / 22nd','stereo','We usually watch television at night.','But tonight, we are listening to the stereo.']
].map(([number,art,en,cn])=>({number,image:image(art),en,cn}));
unit.learning.REFERENCE=[
 '一般现在时描述本课的日常习惯；现在进行时用am/is/are＋动词-ing，描述说话时正在发生的动作。She reads every night. / She is reading now.',
 '稳定与暂时：My parents live in Shanghai. 描述通常的居住情况；They are living with me this month. 突出这个月暂住。暂时情况可以持续一段时间，不只是一瞬间。',
 '本课表示喜好、想要、知道的like、want、know通常不用进行时：I like it. / She wants water. / He knows her. 不把这一点推广成所有语境的绝对禁令。',
 'usually、every day等常提示习惯；now、at the moment等常提示此刻。但时间词不是自动选择时态的开关，仍要看动词含义与具体语境。I want a book now.仍用want。',
 '现在进行时否定：She is not reading. 提问：Is she reading? / What is she doing? 一般现在时：Does she read every day? / What does she usually do?',
 'by car（乘车）；on foot（步行）。at eight o’clock表示在八点整；What’s the time? / What time is it?均可问几点。此处it表示时间，不指代某个人。',
 '课文的today、this morning、this afternoon、this evening、tonight分别把今天和通常情况作对比。说“此刻没做”，不能推成“今天没做过”。',
 '1st first，2nd second，3rd third，4th fourth，5th fifth，6th sixth，7th seventh，8th eighth，9th ninth，10th tenth，11th eleventh，12th twelfth，13th thirteenth，14th fourteenth，15th fifteenth，16th sixteenth，17th seventeenth，18th eighteenth，19th nineteenth，20th twentieth，21st twenty-first，22nd twenty-second。'
];
unit.learning.WRITING_A=[
 'She usually drinks tea in the morning, but this morning, she __________ coffee.',
 'They usually play in the garden in the afternoon, but this afternoon, they __________ in the park.',
 'He usually washes the dishes at night, but tonight he __________ clothes.'
];
unit.learning.WRITING_B=[
 'she / morning — drink / tea；this morning — drink / coffee',
 'they / afternoon — play / in the garden；this afternoon — swim / in the river',
 'I / evening — cook / a meal；this evening — read / a book',
 'we / night — watch / television；tonight — listen to / the stereo'
];
core.unit5758=unit;
if(root.document?.documentElement?.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit5758,excerpts={"u5758-v1-r-school":[0],"u5758-v1-r-shops":[1],"u5758-v1-r-tea":[2],"u5758-v1-r-play":[3],"u5758-v1-r-book":[4],"u5758-v1-r-times":[0,1,2,3,4],"u5758-v1-e-morning":[1],"u5758-v1-e-night":[4]},speakers={"narrator":""};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 57',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
