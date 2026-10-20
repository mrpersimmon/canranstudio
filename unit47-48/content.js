(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit47-48/'+name+'.svg';
const textSource='《新概念英语智慧版1》Lesson47–48，纸页94–97／PDF127–130';
const grammarSource='《同步导学》Grammar纸页86–87／PDF100–101；《语法练习册》纸页131–134／PDF145–148';
const WORDS=[
 ['like','喜欢','/laɪk/','like'],['want','想要','/wɒnt/','want'],['coffee','咖啡','/ˈkɒfi/','coffee'],['cup','杯子','/kʌp/','cup'],['sugar','糖','/ˈʃʊɡə/','sugar'],['milk','牛奶','/mɪlk/','milk'],
 ['fresh','新鲜的','/freʃ/','fresh'],['egg','鸡蛋','/eɡ/','egg'],['butter','黄油','/ˈbʌtə/','butter'],['pure','纯净的','/pjʊə/','pure'],['honey','蜂蜜','/ˈhʌni/','honey'],['ripe','成熟的','/raɪp/','ripe'],
 ['banana','香蕉','/bəˈnɑːnə/','banana'],['jam','果酱','/dʒæm/','jam'],['sweet','甜的','/swiːt/','sweet'],['orange','橙子','/ˈɒrɪndʒ/','orange'],['choice','上等的；精选的','/tʃɔɪs/','choice'],['apple','苹果','/ˈæpəl/','apple'],
 ['biscuit','饼干','/ˈbɪskɪt/','biscuit'],['ice cream','冰淇淋','/ˌaɪs ˈkriːm/','ice-cream'],['black coffee','清咖啡；不加奶的咖啡','/ˌblæk ˈkɒfi/','black-coffee'],['tea','茶','/tiː/','tea'],
 ['Scotch whisky','苏格兰威士忌','/ˌskɒtʃ ˈwɪski/','whisky'],['wine','葡萄酒','/waɪn/','wine'],['beer','啤酒','/bɪə/','beer'],['blackboard','黑板','/ˈblækbɔːd/','blackboard']
].map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit47-48',version:1,contentRevision:'coffee-present-v1',mode:'classroom',title:'一杯咖啡的心意',path:'/unit47-48/',start:'learn/words',
 progress:{learningKey:'canran:unit47-48:learning:v1'},objects:WORDS,
 learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},
 stages:[
  {id:'l1',title:'茶点准备好了',activities:[['words','茶点小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'来喝一杯吧',activities:[['text','茶点小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
  {id:'l3',title:'说说平时的事',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
  {id:'l4',title:'招待新客人',activities:[['apply','茶点小主人','give']],required:['apply']},
  {id:'l5',title:'贴心大挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
 ],questions:{},
 reward:{edition:'coffee-present-v1',title:'贴心小主人',lesson:'Lesson 47–48',scene:'/assets/unit47-48/keepsake-story-v1.webp',alt:'Christine递出一块饼干，Ann端着清咖啡微笑接过，奶壶留在桌上',color:'#936141',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','茶点小主人'],['exam','综合挑战']].map(([id,title])=>({id,title}))}
};
unit.learning.DIALOGUE=[
 ['christine','Do you like coffee, Ann?','你喜欢咖啡吗，安？'],['ann','Yes, I do.','是的，我喜欢。'],
 ['christine','Do you want a cup?','你想要一杯吗？'],['ann','Yes, please, Christine.','好的，请来一杯，克里斯蒂娜。'],
 ['christine','Do you want any sugar?','要放些糖吗？'],['ann','Yes, please.','好的，请放些。'],
 ['christine','Do you want any milk?','要放些牛奶吗？'],['ann','No, thank you. I don’t like milk in my coffee. I like black coffee.','不了，谢谢。我不喜欢咖啡中放牛奶，我喜欢清咖啡。'],
 ['christine','Do you like biscuits?','你喜欢饼干吗？'],['ann','Yes, I do.','是的，我喜欢。'],
 ['christine','Do you want one?','你想要一块吗？'],['ann','Yes, please.','好的，请来一块。']
].map(([who,text,cn],i)=>({id:'u4748-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u4748-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});
const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});
const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
 q('v-food','辨认四种茶点','把茶点与意思连起来。',match([['butter','黄油'],['honey','蜂蜜'],['jam','果酱'],['biscuit','饼干']]),'四种茶点各有自己的名字。'),
 q('v-fresh','fresh的词义','fresh eggs 是什么样的鸡蛋？',choice(['新鲜的','甜的','成熟的'],'新鲜的',{image:image('fresh'),imageAlt:'装在小篮子里的鸡蛋'}),'fresh 表示新鲜的。'),
 q('v-ripe','ripe与sweet的区别','ripe bananas 中，ripe 表示什么？',choice(['成熟的','甜的','纯净的'],'成熟的',{image:image('ripe'),imageAlt:'黄色的成熟香蕉'}),'ripe 表示成熟的，不等于 sweet。'),
 q('v-adjectives','其余修饰词的准确含义','给这些词配上意思。',match([['pure','纯净的'],['sweet','甜的'],['choice','上等的；精选的']]),'这里choice修饰食物，表示精选的，不是让你做选择。'),
 q('v-intent','在明确语境中区分like与want','“我现在想要一杯茶。”用哪个词？',choice(['want','like','type'],'want'),'want 表示想要；like 表示喜欢。'),
 q('v-black','清咖啡不等于不加糖','black coffee 指哪种咖啡？',choice(['不加奶的咖啡','不加糖的咖啡','冰咖啡'],'不加奶的咖啡',{image:image('black-coffee'),imageAlt:'杯中是深色咖啡'}),'black coffee 不加奶；并不因此不能加糖。'),
 q('v-fruit','看图辨认orange','图中是什么？',choice(['orange','apple','banana'],'orange',{image:image('orange'),imageAlt:'一只橙子和一瓣橙子'}),'orange 是橙子。'),
 q('v-board','识别新增物品blackboard','选出 blackboard。',choice(['黑板','杯子','鸡蛋'],'黑板',{optionImages:{'黑板':image('blackboard'),'杯子':image('cup'),'鸡蛋':image('egg')}}),'blackboard 是黑板。')
];
unit.questions.roles=[
 q('r-coffee','理解人物咖啡偏好','Ann 喜欢哪种咖啡？',choice(['black coffee','coffee with milk','她不喜欢咖啡'],'black coffee'),'Ann 说 I like black coffee.。','回想Ann谈到牛奶后的那句话。'),
 q('r-additions','按原文区分糖和奶','Ann 对糖和牛奶分别怎样回答？',fill([blank('Sugar: ','',['Yes, please.','No, thank you.']),blank('Milk: ','',['Yes, please.','No, thank you.'])],['Yes, please.','No, thank you.']),'她要糖，不要在咖啡里加奶。','两次邀请的回答不一样。'),
 q('r-reference','one在上下文里的指代','Christine说 Do you want one?\n这里的one是什么？',choice(['一块饼干','一杯咖啡','一只杯子'],'一块饼干',{optionImages:{'一块饼干':image('biscuit'),'一杯咖啡':image('coffee'),'一只杯子':image('cup')}}),'前面在谈biscuits，one代替a biscuit。','看紧接这一句之前谈的是什么。'),
 q('r-polite','理解提供物品后的礼貌接受','Christine问 Do you want a cup?\nAnn怎样接受？',choice(['Yes, please, Christine.','Yes, I am.','No, thank you.'],'Yes, please, Christine.'),'接受邀请时，Ann说Yes, please。','这次她接受了这杯咖啡。'),
 q('r-scope','不把特定喜好扩大成绝对事实','I don’t like milk in my coffee.\n这句话能说明什么？',choice(['她不喜欢咖啡里加奶','她从来不喝牛奶','她不喜欢任何饮料'],'她不喜欢咖啡里加奶'),'in my coffee限定了这句话，不能扩大到所有牛奶。','注意in my coffee限定了什么。')
];
unit.questions.grammar=[
 g('meaning','一般现在时表达稳定喜好与事实','I like tea. 说的是什么？',choice(['我的喜好','我此刻正在喝茶','我明天一定喝茶'],'我的喜好'),'一般现在时可以说喜好、习惯和事实。','喜欢一种食物，不等于此刻正在吃它。',model(['The sun rises in the east.','太阳从东方升起：这是事实。'],['I drink water every day.','我每天喝水：这是习惯。'])),
 g('time','识别习惯的时间表达','点出“每天”的部分。',{type:'locate',fragments:[{value:'I'},' drink ',{value:'milk'},' ',{value:'every day'},'.'],options:['I','milk','every day'],answer:'every day'},'every day表示每天；often经常，sometimes有时。','找表示时间的词组。',model(['We often read books.','often：经常。'],['We sometimes drink tea.','sometimes：有时。'])),
 g('be','be随主语选择am/is/are','说说我和Ann的身份。',fill([blank('I ',' a student.',['am','is','are']),blank('Ann ',' a guest.',['am','is','are'])],['am','is']),'I用am；Ann是一个人，用is。','先看每句的主语。',model(['We are friends.','我们是朋友。'],['He is a teacher.','他是老师。'])),
 g('be-negative','be否定在be后加not','用词块说：她不是老师。',bank(['She','is','not','a teacher','does'],'She is not a teacher',4),'be句子的否定在be后加not，不加does。','这是“是／不是”的句子。',model(['They are friends. → They are not friends.','are后加not。'])),
 g('be-question','be问句把be提到主语前','用词块问：他们是学生吗？',bank(['Are','they','students','Do'],'Are they students',3,'?'),'Are放在they前；这句不用Do。','先找到表示“是”的词。',model(['She is a teacher. → Is she a teacher?','is到主语前。'])),
 g('base','非第三人称单数用动词原形','说“他们喜欢蜂蜜”。',fill([blank('They ',' honey.',['like','likes','are like'])],['like']),'They后面的实义动词用原形like。','这句用like表达喜欢，不用be。',model(['We want some jam.','We后接原形want。'])),
 g('third','第三人称单数用likes','说“Ann喜欢茶”。',fill([blank('Ann ',' tea.',['like','likes','is like'])],['likes']),'Ann是第三人称单数，肯定句用likes。','把Ann换成she再想一想。',model(['He wants a biscuit.','he后，want变为wants。'])),
 g('dont','普通主语的实义动词否定','说“我不喜欢蜂蜜”。',fill([blank('I ','',['don’t','am not']),blank('',' honey.',['like','likes'])],['don’t','like']),'I don’t like honey.：don’t＋动词原形。','区别“不是”与“不喜欢”。',model(['We don’t want any milk.','we的否定：don’t＋want。'])),
 g('doesnt','第三人称否定后动词回到原形','说“她不想要果酱”。',fill([blank('She ','',['doesn’t','don’t','isn’t']),blank('',' any jam.',['want','wants'])],['doesn’t','want']),'doesn’t已经标明第三人称单数，want回到原形。','助动词变化后，不再给实义动词加s。',model(['He likes eggs. → He doesn’t like eggs.','likes变回like。'])),
 g('do','普通主语的一般疑问句','用词块问：你想要些糖吗？',bank(['Do','you','want','any sugar','Are','wants'],'Do you want any sugar',4,'?'),'Do＋you＋want；want保持原形。','这句问“想要”，不是问“是”。',model(['They like apples. → Do they like apples?','用Do提问，like不变。'])),
 g('does','第三人称一般疑问句与动词还原','补全：Ann喜欢饼干吗？',fill([blank('',' Ann',['Does','Do','Is']),blank('',' biscuits?',['like','likes'])],['Does','like']),'Does Ann like biscuits?：Does在前，like用原形。','不要在Does后再保留likes。',model(['He wants some tea. → Does he want any tea?','Does提问，want用原形。'])),
 g('replies','按事实和回答人称作短答','你喜欢香蕉；Ann不喜欢鸡蛋。由你回答：',fill([blank('Do you like bananas? Yes, I ','.',['do','does','am']),blank('Does Ann like eggs? No, she ','.',['doesn’t','don’t','isn’t'])],['do','doesn’t']),'Do问用do／don’t；Does问用does／doesn’t，并按事实选肯否。','先看问句开头，再看题目给的喜好。',model(['Do they like jam? Yes, they do.','问they，回答they。'])),
 g('independent','撤去示范后独立否定第三人称','把“他喜欢橙子”改成否定句。',bank(['He','doesn’t','like','oranges','likes','don’t'],'He doesn’t like oranges',4),'He doesn’t like oranges.：doesn’t＋like。','确认主语和否定表达。'),
 g('transfer','独立区分be与实义动词','把两句补完整：我们是朋友；我们每天喝茶。',fill([blank('We ',' friends.',['are','do']),blank('We ',' tea every day.',['drink','drinks','are drink'])],['are','drink']),'身份用are，日常动作用drink；不是所有句子都加be。','两句表达的事情不同。')
];
unit.questions.apply=[
 q('a-ask','先问稳定喜好','问问这位新客人喜欢不喜欢茶。',bank(['Do','you','like','tea','Are','likes'],'Do you like tea',4,'?'),'Do you like tea?询问喜好。','问喜欢，不是问这次要不要。'),
 q('a-offer','喜欢不代表本次需要','客人喜欢咖啡，但这次不想喝。\n你指着咖啡问Do you want a cup?，客人怎么回答？',choice(['No, thank you.','Yes, please.','I am a cup.'],'No, thank you.'),'喜欢咖啡，也可以这一次不要。','依据“这次不想喝”，不只看喜欢。'),
 q('a-decline','礼貌拒绝并给出不同需要','客人说：No milk, thank you. I want some tea.\n应该准备哪种饮料？',choice(['tea','milk','coffee'],'tea',{optionImages:{tea:image('tea'),milk:image('milk'),coffee:image('coffee')}}),'按客人本次说出的意愿准备茶。','把拒绝的东西和想要的东西分开。'),
 {...q('a-amount','单数可数one与不可数any','客人喜欢苹果和黄油，但现在都不要。',fill([blank('I like apples, but I don’t want ','.',['one','ones']),blank('I like butter, but I don’t want ','.',['any','one'])],['one','any']),'one可代替一个苹果；butter不可数，这里用any。','苹果能一个个数；黄油这里说的是量。'),workshop:{model:model(['I like eggs, but I don’t want one.','喜欢鸡蛋，但现在不想要一个。'],['I like jam, but I don’t want any.','喜欢果酱，但现在一点也不想要。'])}},
 q('a-biscuit','在当前语境中使用one','客人现在想要一块饼干。\n用词块替他回答。',bank(['Yes, please.','I want','one','any'],'Yes, please. I want one',3),'one在这次对话里代替a biscuit。','前面谈的是一块饼干。'),
 q('a-handoff','根据完整短材料选择茶点组合','I want some tea and one biscuit.\n哪一份是客人要的？',choice(['茶和一块饼干','牛奶和两块饼干','咖啡和一块饼干'],'茶和一块饼干',{optionImages:{'茶和一块饼干':image('tea-biscuit'),'牛奶和两块饼干':image('milk-biscuits'),'咖啡和一块饼干':image('coffee-biscuit')}}),'同时核对饮料种类和饼干数量。','有两个条件，都要满足。')
];
unit.questions.exam=[
 q('e-words','抽样核心修饰词','把词与意思配对。',match([['fresh','新鲜的'],['pure','纯净的'],['ripe','成熟的'],['sweet','甜的']]),'四个词表达不同的特点。'),
 q('e-food','独立看图辨物','图中是什么？',choice(['honey','butter','jam'],'honey',{image:image('honey'),imageAlt:'一罐带木制蜂蜜棒的金色蜂蜜'}),'honey是蜂蜜。'),
 q('e-intent','独立区分喜好与本次需要','I like bananas, but I don’t want one now.\n哪种理解对？',choice(['喜欢香蕉，但现在不要','不喜欢香蕉','现在一定要一根香蕉'],'喜欢香蕉，但现在不要'),'like与want表达的事情不同。'),
 q('e-story','理解清咖啡及原文需求','Ann在课文中想要哪一杯？',choice(['加糖，不加奶','加奶，不加糖','加糖，也加奶'],'加糖，不加奶'),'她接受糖、拒绝奶；black coffee不是无糖的同义词。'),
 q('e-reference','独立判断one指代','Do you like apples? Do you want one?\none代替什么？',choice(['an apple','some butter','a cup'],'an apple'),'根据前文，one代替一个苹果。'),
 q('e-amount','独立区分可数单数与不可数','补全两种“喜欢，但现在不要”。',fill([blank('I like oranges, but I don’t want ','.',['one','ones']),blank('I like honey, but I don’t want ','.',['any','one'])],['one','any']),'一个橙子用one代替；蜂蜜的量用any。'),
 q('e-habit','独立区分习惯与此刻动作','哪一句表示“每天喝牛奶”？',choice(['I drink milk every day.','I am drinking milk now.','I don’t like milk.'],'I drink milk every day.'),'every day配一般现在时描述习惯。'),
 q('e-time','识别经常的频率表达','点出“经常”。',{type:'locate',fragments:[{value:'She'},' ',{value:'often'},' drinks ',{value:'tea'},'.'],options:['She','often','tea'],answer:'often'},'often表示经常。'),
 q('e-be','独立使用be肯定与否定','我是学生；她不是老师。',fill([blank('I ',' a student.',['am','is','are']),blank('She ',' a teacher.',['isn’t','doesn’t','don’t'])],['am','isn’t']),'身份句使用be，否定加not或用缩写。'),
 q('e-be-question','独立构成be问句','用词块问：Ann是客人吗？',bank(['Is','Ann','a guest','Does'],'Is Ann a guest',3,'?'),'Is前置，不加Does。'),
 q('e-third','第三人称单数肯定','说“她喜欢精选苹果”。',fill([blank('She ',' choice apples.',['likes','like','is like'])],['likes']),'she后的肯定谓语是likes。'),
 q('e-plural','复数主语保持动词原形','说“他们想要一些黄油”。',fill([blank('They ',' some butter.',['want','wants','are want'])],['want']),'they后用want。'),
 q('e-negative','独立构成非第三人称否定','用词块说：我们不喜欢果酱。',bank(['We','don’t','like','jam','aren’t','likes'],'We don’t like jam',4),'We don’t like jam.。'),
 q('e-doesnt','第三人称否定与原形','说“他不想要冰淇淋”。',fill([blank('He ','',['doesn’t','don’t','isn’t']),blank('',' any ice cream.',['want','wants'])],['doesn’t','want']),'doesn’t后用want原形。'),
 q('e-do','独立提问普通主语','用词块问：你们喜欢鸡蛋吗？',bank(['Do','you','like','eggs','Are','likes'],'Do you like eggs',4,'?'),'Do you like eggs?。'),
 q('e-does','独立第三人称一般疑问句','补全：Ann想要些蜂蜜吗？',fill([blank('',' Ann',['Does','Do','Is']),blank('',' any honey?',['want','wants'])],['Does','want']),'Does Ann want any honey?。'),
 q('e-replies','独立肯否短答与人称','你和Sam喜欢茶；Christine不喜欢冰淇淋。由你回答：',fill([blank('Do you and Sam like tea? Yes, we ','.',['do','does','are']),blank('Does Christine like ice cream? No, she ','.',['doesn’t','don’t','isn’t'])],['do','doesn’t']),'we用do，she在Does问句里用doesn’t作否定短答。'),
 q('e-polite','在新情境中拒绝提供','你这次不想要饼干。对方问Do you want a biscuit?\n怎样礼貌回答？',choice(['No, thank you.','Yes, please.','You are a biscuit.'],'No, thank you.'),'礼貌拒绝用No, thank you.。'),
 q('e-place','Lesson48书面A方位复习','飞机飞过村庄上空；船从桥下通过。',fill([blank('The aeroplane is flying ',' the village.',['over','under','behind']),blank('The ship is going ',' the bridge.',['under','over','between'])],['over','under']),'over表示在上方越过，under表示在下面。'),
 q('e-order','独立辨认不规则序数词','给序数词配对。',match([['1st','first'],['2nd','second'],['3rd','third'],['12th','twelfth']]),'序数词表示第几，和数量不同。')
];
const ordinals=['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth'];
unit.learning.MODELS=[['fresh eggs','新鲜鸡蛋','fresh'],['butter','黄油','butter'],['pure honey','纯蜂蜜','honey'],['ripe bananas','成熟香蕉','ripe'],['jam','果酱','jam'],['sweet oranges','甜橙','orange'],['ice cream','冰淇淋','ice-cream'],['Scotch whisky','苏格兰威士忌','whisky'],['choice apples','精选苹果','choice'],['wine','葡萄酒','wine'],['biscuits','饼干','biscuit'],['beer','啤酒','beer']].map(([en,cn,art],i)=>({en,cn,image:image(art),number:(i+1)+(['st','nd','rd'][i]||'th')+' · '+ordinals[i]}));
unit.learning.WRITING_A=['The aeroplane is flying ___ the village.','The ship is going ___ the bridge.','The children are swimming ___ the river.','Two cats are running ___ the wall.','The boy is jumping ___ the branch.','The girl is sitting ___ her mother and her father.','The teacher is standing ___ the blackboard.','The blackboard is ___ the teacher.'];
unit.learning.WRITING_B=['honey','bananas','jam','oranges','ice cream','whisky','apples','wine','biscuits','beer'];
unit.source={text:textSource,grammar:grammarSource};
core.unit4748=unit;
if(root.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit4748,excerpts={"u4748-v1-r-coffee":[4,5,6,7],"u4748-v1-r-additions":[4,5,6,7],"u4748-v1-r-reference":[8,9,10,11],"u4748-v1-e-story":[0,1,2,3,4,5,6,7]},speakers={"christine":"Christine","ann":"Ann"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 47',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
