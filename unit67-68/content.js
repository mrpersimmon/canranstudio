(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit67-68/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页134–137／PDF167–170';
const grammarSource='《同步导学》Grammar纸页122／PDF136；《语法练习册》纸页189–194／PDF203–208';
const WORDS=[
['greengrocer','果蔬零售商','/ˈɡriːnɡrəʊsə/','greengrocer'],['absent','缺席的','/ˈæbsənt/','absent'],['Monday','星期一','/ˈmʌndeɪ/','monday'],['Tuesday','星期二','/ˈtjuːzdeɪ/','tuesday'],['Wednesday','星期三','/ˈwenzdeɪ/','wednesday'],['Thursday','星期四','/ˈθɜːzdeɪ/','thursday'],
['keep','处于某种状态','/kiːp/','keep'],['spend','度过','/spend/','spend'],['weekend','周末','/ˌwiːkˈend/','weekend'],['Friday','星期五','/ˈfraɪdeɪ/','friday'],['Saturday','星期六','/ˈsætədeɪ/','saturday'],['Sunday','星期日','/ˈsʌndeɪ/','sunday'],
['country','乡下（本课）','/ˈkʌntri/','country'],['lucky','幸运的','/ˈlʌki/','lucky'],['church','教堂','/tʃɜːtʃ/','church'],['dairy','乳品店','/ˈdeəri/','dairy'],['baker','面包师傅','/ˈbeɪkə/','baker'],['grocer','食品杂货商','/ˈɡrəʊsə/','grocer'],
['yesterday','昨天','/ˈjestədeɪ/','yesterday'],['last week','上星期','/lɑːst wiːk/','last-week'],['today','今天','/təˈdeɪ/','today'],['was','am／is的过去式','/wɒz/','was'],['were','are的过去式','/wɜː/','were'],['at the butcher’s','在肉店','/ət ðə ˈbʊtʃəz/','butchers'],
['at the greengrocer’s','在果蔬店','/ət ðə ˈɡriːnɡrəʊsəz/','greengrocers'],['at the hairdresser’s','在理发店','/ət ðə ˈheədresəz/','hairdressers'],['at the office','在办公室','/ət ði ˈɒfɪs/','office'],['at home','在家','/ət həʊm/','home'],['where','哪里','/weə/','where'],['when','何时','/wen/','when']
].map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit67-68',version:1,contentRevision:'weekend-chat-v1',mode:'classroom',title:'街角的周末消息',path:'/unit67-68/',start:'learn/words',progress:{learningKey:'canran:unit67-68:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'在街角碰面',activities:[['words','街角小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'听见周末的好消息',activities:[['text','街角小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'把过去说清楚',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'记下哪天在哪里',activities:[['apply','日记小记录员','give']],required:['apply']},
{id:'l5',title:'完成街角挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'weekend-chat-v1',title:'时光小记录员',lesson:'Lesson 67–68',scene:'/assets/unit67-68/keepsake-story-v1.webp',alt:'戴绿框眼镜的Johnson夫人与穿桃色开衫的Williams夫人在商店街相向交谈',color:'#93718e',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','日记小记录员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={johnson:'Mrs. Johnson',williams:'Mrs. Williams'};
unit.learning.DIALOGUE=[
['johnson','Hello. Were you at the butcher’s?','你好。你刚才在肉店吗？'],
['williams','Yes, I was. Were you at the butcher’s, too?','是的，我在肉店。你刚才也在肉店吗？'],
['johnson','No, I wasn’t. I was at the greengrocer’s. How’s Jimmy today?','不，我没在肉店。我在果蔬店。Jimmy今天怎么样？'],
['williams','He’s very well, thank you.','他很好，谢谢你。'],
['johnson','Was he absent from school last week?','他上星期没上学吗？'],
['williams','Yes, he was. He was absent on Monday, Tuesday, Wednesday and Thursday. How are you all keeping?','是的。他星期一、二、三、四没上学。你们身体都好吗？'],
['johnson','Very well, thank you. We’re going to spend three days in the country. We’re going to stay at my mother’s for the weekend.','很好，谢谢。我们打算到乡下度过三天。我们打算在我母亲家过周末。'],
['williams','Friday, Saturday and Sunday in the country! Aren’t you lucky!','星期五、六、日都在乡下！你们真幸运！']
].map(([who,text,cn],i)=>({id:'u6768-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u6768-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});const blank=(before,after,options)=>({before,after,options});const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-shop','识别果蔬店','图里卖水果和蔬菜。这是哪家店？',choice(['the greengrocer’s','the butcher’s','the baker’s'],'the greengrocer’s',{image:image('greengrocers'),imageAlt:'绿色雨篷下摆着胡萝卜、番茄和苹果'}),'the greengrocer’s指果蔬店。'),
q('v-days-first','辨认星期一至三','给星期配好中文。',match([['Monday','星期一'],['Tuesday','星期二'],['Wednesday','星期三']]),'留意Tuesday与Thursday是不同的日子。'),
q('v-absent','理解absent from school','Jimmy was absent from school. 说明什么？',choice(['Jimmy没去上学','Jimmy正在学校里','Jimmy在教书'],'Jimmy没去上学'),'absent from school表示缺课。'),
q('v-days-last','辨认星期四至日','配好这一周后面的四天。',match([['Thursday','星期四'],['Friday','星期五'],['Saturday','星期六'],['Sunday','星期日']]),'星期五、六、日是故事里安排出游的三天。'),
q('v-keep','理解课文keep的语境','How are you all keeping? 是在问什么？',choice(['你们身体都好吗','你们保存了什么','你们要去哪里'],'你们身体都好吗'),'本句询问健康状况，keep不是保存东西。'),
q('v-country','辨认country的本课含义','spend three days in the country 里的country指什么？',choice(['乡下','国家名称','城市中心'],'乡下'),'in the country在本课指在乡下。'),
q('v-spend','理解spend的度过义','We’re going to spend three days there. 这里spend表示什么？',choice(['度过','购买','缺席'],'度过'),'这里spend后面是三天，表示度过这段时间。')
];
unit.questions.roles=[
q('r-shops','追踪两个人刚才的地点','把两位夫人与刚才去过的店配好。',match([['Mrs. Williams','肉店'],['Mrs. Johnson','果蔬店']]),'Williams回答在肉店；Johnson说自己在果蔬店。','回看最前面的三段对白。'),
q('r-today','区分现在健康与过去缺课','Jimmy今天身体怎么样？',choice(['He’s very well.','He’s very ill.','原文没有提到今天'],'He’s very well.'),'He’s very well回答的是今天的情况。'),
q('r-days','提取四天缺课信息','原文明确说Jimmy上周哪几天缺课？',choice(['Monday to Thursday','Friday to Sunday','Monday to Friday'],'Monday to Thursday'),'明确列出星期一至四；没有说明星期五是否缺课。','按原文列出的四个日子判断。'),
q('r-keeping','理解健康问候的回应','How are you all keeping? 后，Johnson夫人怎样回答？',choice(['Very well, thank you.','At the butcher’s.','On Monday.'],'Very well, thank you.'),'健康问候回应身体状况。'),
q('r-plan','区分未来计划与已发生事情','Johnson夫人说要怎样过周末？',choice(['计划去乡下住三天','昨天已从乡下回来了','现在在肉店住三天'],'计划去乡下住三天'),'We’re going to…说的是计划，不能当成已经发生。'),
q('r-mother','根据说话人理解所有格','We’re going to stay at my mother’s. 是到谁的母亲家？',choice(['Mrs. Johnson的母亲家','Mrs. Williams的母亲家','Jimmy的母亲家'],'Mrs. Johnson的母亲家'),'这句话由Johnson夫人说，my指她自己。','先找是谁说了这句话。'),
q('r-lucky','理解惊叹而非否定','Aren’t you lucky! 这里在表达什么？',choice(['你们真幸运','你们一点也不幸运','你们不能出门'],'你们真幸运'),'虽然用了否定问句形式，这里表达的是羡慕和赞叹。')
];
unit.questions.grammar=[
g('past','识别过去状态而不推断现在','I was at home yesterday. 能确定什么？',choice(['我昨天在家','我现在一定不在家','我明天一定在家'],'我昨天在家'),'was在这里说明过去的地点，不自动说明现在在哪里。','只选这句话确实告诉你的事。',model(['She was ill last week.','她上周生病了；单凭这句话不能确定现在是否好了。'])),
g('i-we','区分I与we的过去式','昨天，我在家，我们在学校。补好两句记录。',fill([blank('I ',' at home yesterday.',['was','were']),blank('We ',' at school yesterday.',['were','was'])],['was','were']),'I用was，we用were；不能把所有第一人称都归到was。','先看每句主语。',model(['He was at the office. They were at home.','he用was，they用were。'])),
g('you','you不论一人多人都用were','一人和两人都在昨天到过果蔬店。补好两句。',fill([blank('对Anna：You ',' at the greengrocer’s.',['were','was']),blank('对Anna和Ben：You ',' at the greengrocer’s.',['were','was'])],['were','were']),'you无论指你还是你们，过去式都用were。','英语里的you配同一种be过去式。',model(['Were you at home yesterday?','对一人或多人询问，都用Were you…?'])),
g('names','把名字看成实际人数','补好Tom与两位朋友的记录。',fill([blank('Tom ',' at school on Monday.',['was','were']),blank('Tom and Ann ',' at school on Tuesday.',['were','was'])],['was','were']),'一个人用was，两个人用were。','名字不改变人数。',model(['Mrs. Johnson was at the greengrocer’s.','一个人，可以用she代替，配was。'])),
g('now','区分现在与过去','今天和昨天的天气记录不同，补好句子。',fill([blank('It ',' cold yesterday.',['was','is']),blank('It ',' warm today.',['is','was'])],['was','is']),'yesterday对应过去was，today这句说现在，用is。','先看时间，再选be。',model(['He is well now. He was ill last week.','两句分别明确说明现在与过去。'])),
g('not','识别否定缩写','把否定形式配在一起。',match([['was not','wasn’t'],['were not','weren’t'],['is not','isn’t']]),'过去的否定是在was或were后加not；现在的isn’t不是过去式。','先辨认原形，再看缩写。',model(['I was not late. = I wasn’t late.','was not可以缩写成wasn’t。'])),
g('negative','拼装过去的否定句','他们昨天不在家。',bank(['They','were','not','at home','yesterday','was'],'They were not at home yesterday',5),'not在were后面；完整形式和缩写形式都可以。','先说谁，再说过去不在。',model(['She was not at the office yesterday.','was后面加not。'])),
g('question','把be移到句首提问','Pam昨天在学校吗？',bank(['Was','Pam','at school','yesterday','Is'],'Was Pam at school yesterday',4,'?'),'过去的一般疑问句把Was移到主语前。','问的是昨天。',model(['He was at home. → Was he at home?','提问时was移到主语前。'])),
g('ask-you','提问与回答的主语对应','你昨天在办公室吗？我在。',fill([blank('',' you at the office yesterday?',['Were','Was']),blank('Yes, I ','.',['was','were'])],['Were','was']),'提问you用were；回答换成I，用was。','回答时主语变了。',model(['Was she at school? — Yes, she was.','问she，答she；但问you时要根据回答者换人称。'])),
g('short-yes','按真实材料给肯定回答','Anna的日记：Yesterday — at home. 有人问Anna：Were you at home yesterday? 由Anna回答。',choice(['Yes, I was.','Yes, you were.','Yes, I were.'],'Yes, I was.'),'Anna用I回答自己昨天的情况。','想象你就是回答问题的Anna。',model(['Were they at church? — Yes, they were.','肯定短答保留主语与be过去式。'])),
g('short-no','复数否定短答','你和Tom昨天在家，没有去学校。Were you and Tom at school yesterday? 由你回答。',choice(['No, we weren’t.','No, I wasn’t.','No, we wasn’t.'],'No, we weren’t.'),'回答包含自己和Tom，用we；否定用weren’t。','题目问的是两个人。',model(['Was he at the dairy? — No, he wasn’t.','否定短答用wasn’t或weren’t。'])),
g('he-she','按事实完成第三人称短答','记录：Ben昨天在学校，Anna昨天不在学校。',fill([blank('Was Ben at school? — Yes, he ','.',['was','wasn’t']),blank('Was Anna at school? — No, she ','.',['wasn’t','was'])],['was','wasn’t']),'he和she都配was，否定用wasn’t。','一位到了，一位没到。',model(['Were they at home? — No, they weren’t.','短答的肯否由事实决定。'])),
g('where','根据回答区分问哪里或何时','回答地点用Where提问，回答哪天用When提问。',fill([blank('',' were you yesterday? — At home.',['Where','When']),blank('',' were you at home? — On Sunday.',['When','Where'])],['Where','When']),'Where问地点，When问时间。','先看回答给的是地点还是日子。',model(['Where was she? — At school.','Where问她在哪里。'],['When was she at school? — On Monday.','When问她哪天在那里。'])),
g('when','拼装过去的特殊疑问句','她什么时候在乳品店？',bank(['When','was','she','at the dairy','Where'],'When was she at the dairy',4,'?'),'When在前，接was，再接she。','问的是时间。',model(['Where were they on Friday?','疑问词＋be过去式＋主语。'])),
g('independent','撤去示范比较过去与现在','朋友们昨天在乡下，现在在家。补好记录。',fill([blank('They ',' in the country yesterday.',['were','are','was']),blank('They ',' at home now.',['are','were','is'])],['were','are']),'两句话分别给出时间和地点，过去用were，现在用are。','先看yesterday和now。'),
g('repair','独立定位be过去式错误','两个人昨天都在学校。找出句子里需要修改的词。',{type:'locate',fragments:[{value:'Tom and Ben'},' ',{value:'was'},' ',{value:'at school'},' yesterday.'],options:['Tom and Ben','was','at school'],answer:'was'},'Tom and Ben是两人，was应改成were。','先数主语里有几个人。')
];
unit.questions.apply=[
q('a-place','读日记找地点','日记：Friday · June 6th · the baker’s\nWhere were you on Friday?',choice(['I was at the baker’s.','I was at the dairy.','I was at home.'],'I was at the baker’s.'),'按日记中的地点作答。','这是题目给定的练习日记，不需查日历。'),
q('a-stamp','依日记选日期再盖章','日记：Saturday · July 7th · the dairy\nWhen were you at the dairy?',choice(['On Saturday.','At the dairy.','On Sunday.'],'On Saturday.'),'When问时间；选好并检查正确后盖章。','问哪天，不是问哪家店。'),
q('a-health','区分过去状态与现在状态','健康记录：上周Anna生病；今天她很好。\n补好她的记录。',fill([blank('Anna ',' ill last week.',['was','is']),blank('She ',' well today.',['is','was'])],['was','is']),'两栏明确告诉了过去和现在，不能只凭过去猜今天。'),
q('a-where','依材料追问地点','Ben：I was at the office on Tuesday.\n你已知道是星期二，想问“你在哪里？”。',bank(['Where','were','you','on Tuesday','When'],'Where were you on Tuesday',4,'?'),'Where询问地点。','缺的信息是地点，不是日子。'),
q('a-at-on','把地点和日期接进句子','日记：Monday · September 9th · the grocer’s\n补好过去的记录。',fill([blank('I was ',' the grocer’s',['at','on']),blank('',' Monday.',['on','at'])],['at','on']),'地点用at，具体星期用on。','哪个后面是店铺，哪个后面是星期？'),
q('a-articles','按场所选择习惯表达','日记：妈妈昨天在家，爸爸昨天在办公室。\n补好两个地点。',fill([blank('Mum was at ','.',['home','the home']),blank('Dad was at ','.',['the office','office'])],['home','the office']),'本课在家用at home，在办公室用at the office。','这两种地点的习惯用法不同。'),
q('a-clock','把钟面与过去的时间对齐','日记上的钟是1:40。\n选出与钟面一致的时间。',choice(['twenty to two','twenty past one','forty to two'],'twenty to two',{image:image('clock-0140'),imageAlt:'一点四十分：长针指8，短针在1和2之间靠近2'}),'1:40离2点还有20分钟，也可读one forty。','to后面是下一个整点。'),
q('a-record','整合人称地点与过去时间','你和Ann星期一在教堂。\n用We开头记录这件过去的事。',bank(['We','were','at church','on Monday','was'],'We were at church on Monday',4),'We用were；做礼拜用at church；星期前用on。','这是过去的日记，不是将来的计划。')
];
unit.questions.exam=[
q('e-places','独立区分地点词','把商店和中文配好。',match([['the dairy','乳品店'],['the baker’s','面包店'],['the grocer’s','食品杂货店']]),'baker和grocer指人；这里带’s的形式指相应店铺。'),
q('e-days','独立辨认易混星期','配好星期。',match([['Tuesday','星期二'],['Thursday','星期四'],['Saturday','星期六']]),'不要混淆Tuesday和Thursday。'),
q('e-meaning','独立理解度过周末','spend the weekend in the country 更合适的意思是？',choice(['在乡下度过周末','在城里购买国家','缺席三个星期'],'在乡下度过周末'),'本课country是乡下，spend时间是度过。'),
q('e-shops','独立追踪课文地点','哪一条符合课文开头？',choice(['Williams刚才在肉店，Johnson刚才在果蔬店','Williams刚才在果蔬店，Johnson刚才在肉店','两个人刚才都在肉店'],'Williams刚才在肉店，Johnson刚才在果蔬店'),'两人回答的刚才地点不同。'),
q('e-jimmy','区分课文陈述与额外猜测','关于Jimmy，哪一条有原文依据？',choice(['今天身体很好；上周一至四缺课','上周五肯定也缺课','今天还在生病'],'今天身体很好；上周一至四缺课'),'原文没有交代上周五的情况。'),
q('e-three','整合周末计划三天','Johnson一家计划在乡下度过哪三天？',choice(['Friday, Saturday and Sunday','Monday, Tuesday and Wednesday','Saturday, Sunday and Monday'],'Friday, Saturday and Sunday'),'这是本次三天出游安排；不表示所有周末都包含星期五。'),
q('e-mother','独立识别my mother’s与计划','Johnson夫人说We’re going to stay at my mother’s. 哪种理解正确？',choice(['计划住在Johnson夫人的母亲家','已经住在Williams夫人的母亲家','已经去母亲开的果蔬店工作'],'计划住在Johnson夫人的母亲家'),'my mother’s这里省略house；be going to说计划。'),
q('e-past','避免过去自动推出现在的误解','Tom was at home yesterday. 只根据这句话，能知道他现在在哪里吗？',choice(['不能，只说了昨天在家','能，他现在肯定不在家','能，他现在肯定在家'],'不能，只说了昨天在家'),'过去的地点不自动说明现在的地点。'),
q('e-i-you','独立应用I与you','补好昨天的两条记录。',fill([blank('I ',' at the hairdresser’s yesterday.',['was','were']),blank('You ',' at the office yesterday.',['were','was'])],['was','were']),'I用was，you用were。'),
q('e-number','独立应用单复数','补好两条过去记录。',fill([blank('Mrs. Jones ',' at the grocer’s on Monday.',['was','were']),blank('We ',' at home on Sunday.',['were','was'])],['was','were']),'一个人用was；we用were。'),
q('e-now','独立区分现在与过去','记录：昨天很冷；现在很暖和。',fill([blank('It ',' cold yesterday.',['was','is']),blank('It ',' warm now.',['is','was'])],['was','is']),'两句分别说明过去和现在。'),
q('e-negative','独立表达过去否定','她上周没有缺课。',bank(['She','was','not','absent from school','last week','is'],'She was not absent from school last week',5),'过去的否定是在was后加not。'),
q('e-ask','独立拼装一般疑问句','他们昨天在乡下吗？',bank(['Were','they','in the country','yesterday','Was'],'Were they in the country yesterday',4,'?'),'they配Were，并把Were放在主语前。'),
q('e-yes','独立转换问答人称','你昨天在学校。朋友问你：Were you at school yesterday? 你怎样回答？',choice(['Yes, I was.','Yes, you were.','Yes, I were.'],'Yes, I was.'),'回答自己用I，过去式改用was。'),
q('e-no','独立给出复数否定短答','你和Sam昨天在家。有人问：Were you and Sam at the dairy? 由你来回答。',choice(['No, we weren’t.','No, we wasn’t.','No, they weren’t.'],'No, we weren’t.'),'回答包含自己与Sam，用we weren’t。'),
q('e-repair','独立定位第三人称过去式错误','她昨天没去学校。点出句子里用错的词。',{type:'locate',fragments:[{value:'She'},' ',{value:'weren’t'},' ',{value:'at school'},' yesterday.'],options:['She','weren’t','at school'],answer:'weren’t'},'She用wasn’t，不能用weren’t。'),
q('e-where','根据地点回答提问','答句：He was at the baker’s.\n要问他在哪里，补好开头。',fill([blank('',' was he?',['Where','When'])],['Where']),'Where问地点。'),
q('e-when','根据时间回答提问','答句：She was at the office on Tuesday.\n要问她哪天在办公室，拼好问题。',bank(['When','was','she','at the office','Where'],'When was she at the office',4,'?'),'When问时间，后接was she。'),
q('e-prepositions','独立填写地点与具体星期','补好日记记录。',fill([blank('Ben was ',' the butcher’s',['at','on']),blank('',' Wednesday.',['on','at'])],['at','on']),'at接地点，on接具体星期。'),
q('e-article','独立辨认地点搭配','按本课常用表达，补好“在家”和“在办公室”。',fill([blank('at ', ' / 在家',['home','the home']),blank('at ',' / 在办公室',['the office','office'])],['home','the office']),'在家是at home，在办公室是at the office。'),
q('e-school-church','理解场所的活动用法','Anna星期日去教堂做礼拜，Ben星期一去学校上学。哪组常用表达合适？',choice(['at church / at school','at home / at the dairy','at the office / at the butcher’s'],'at church / at school'),'做礼拜、上学的常用表达不加the；这里不把带the的所有场所用法一概判错。'),
q('e-clock-past','独立读五分钟步进钟面','图上是1:25。哪种表达一致？',choice(['twenty-five past one','twenty-five to one','one fifty-two'],'twenty-five past one',{image:image('clock-0125'),imageAlt:'一点二十五分：长针指5，短针略过1'}),'1:25可读twenty-five past one或one twenty-five。'),
q('e-clock-to','独立读to和直接读法','ten to two与one fifty，哪种判断正确？',choice(['都表示1:50','都表示2:10','一个表示1:50，一个表示2:50'],'都表示1:50'),'距离2点还有10分钟是1:50。'),
q('e-diary','综合材料人称时间地点','日记：你和Ben · yesterday · at the dairy · 1:35。\n哪条记录完整且正确？',choice(['We were at the dairy at one thirty-five yesterday.','We was at the dairy at one thirty-five yesterday.','We are at the baker’s at one fifty-three now.'],'We were at the dairy at one thirty-five yesterday.'),'包括自己和Ben用We were；地点、钟点、过去时间都需符合日记。')
];
unit.learning.CLOCKS=[['0100','one o’clock','one o’clock'],['0105','five past one','one oh five'],['0110','ten past one','one ten'],['0115','a quarter past one','one fifteen'],['0120','twenty past one','one twenty'],['0125','twenty-five past one','one twenty-five'],['0130','half past one','one thirty'],['0135','twenty-five to two','one thirty-five'],['0140','twenty to two','one forty'],['0145','a quarter to two','one forty-five'],['0150','ten to two','one fifty'],['0155','five to two','one fifty-five']].map(([time,en,result],i)=>({number:['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'][i],image:image('clock-'+time),en,result,cn:'1:'+time.slice(2)}));
unit.learning.MODELS=[['Sunday','January 1st','church','church'],['Monday','February 2nd','school','school'],['Tuesday','March 3rd','the office','office'],['Wednesday','April 4th','the butcher’s','butchers'],['Thursday','May 5th','the hairdresser’s','hairdressers'],['Friday','June 6th','the baker’s','bakers'],['Saturday','July 7th','the dairy','dairy'],['Sunday','August 8th','home','home'],['Monday','September 9th','the grocer’s','grocers'],['Tuesday','October 10th','the greengrocer’s','greengrocers']].map(([day,date,place,art],i)=>({number:day+' · '+date,image:image(art),en:'Where were you on '+day+'?',result:'I was at '+place+' on '+day+'.',cn:'When were you at '+place+'? — On '+day+'.'}));
unit.learning.REFERENCE=['过去的状态和地点：I / he / she / it用was；you / we / they用were。we虽然是第一人称，也用were。','否定：was not = wasn’t；were not = weren’t。提问：Was he…? / Were they…?','短答：Were you…? — Yes, I was. / No, I wasn’t.；问你们、由其中一人回答：Yes, we were. / No, we weren’t.','Where问哪里，When问何时：Where were you? / When were you at home?','常见过去时间：yesterday、last week。单凭过去的状态不能推出现在相反。','具体星期和日期用on：on Monday、on July 7th。地点：at home、at school、at church、at the office、at the butcher’s；乡下用in the country。','at the greengrocer’s省略shop；at my mother’s省略house。baker和grocer指人，the baker’s和the grocer’s在本课指店铺。','通常周末指星期六、星期日；课文的三天乡下行程安排在星期五、六、日，不改变weekend的一般意思。'];
unit.learning.WRITING_A=['I was at ___ church on Sunday.','I was at ___ office on Monday.','My son was at ___ school on Tuesday.','My wife was at ___ butcher’s on Wednesday.','She was at ___ grocer’s on Thursday.','My daughter was in ___ country on Friday.','I was at ___ home on Saturday.'];
unit.learning.WRITING_B=['Tom / the hairdresser’s / Thursday','Mrs. Jones / the butcher’s / Wednesday','he / home / Sunday','Penny / the baker’s / Friday','Mrs. Williams / the grocer’s / Monday','Nicola / the office / Tuesday'];
core.unit6768=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
