(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit79-80/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页162–165／PDF195–198';
const grammarSource='《同步导学》Grammar纸页142／PDF156；《语法练习册》纸页225–230／PDF239–244';
const rows=[
['shopping','购物','/ˈʃɒpɪŋ/','shopping'],['list','清单','/lɪst/','list'],['vegetable','蔬菜','/ˈvedʒtəbl/','vegetable'],['need','需要','/niːd/','need'],['hope','希望','/həʊp/','hope'],['thing','东西；事情','/θɪŋ/','thing'],
['money','钱','/ˈmʌni/','money'],['groceries','食品杂货','/ˈɡrəʊsəriz/','groceries'],['fruit','水果','/fruːt/','fruit'],['stationery','文具','/ˈsteɪʃənəri/','stationery'],['newsagent','报刊零售商','/ˈnjuːzeɪdʒənt/','newsagent'],['chemist','药剂师','/ˈkemɪst/','chemist'],
['the grocer’s','食品杂货店','/ðə ˈɡrəʊsəz/','grocer'],['the greengrocer’s','蔬菜水果店','/ðə ˈɡriːnɡrəʊsəz/','greengrocer'],['the butcher’s','肉店','/ðə ˈbʊtʃəz/','butcher'],['the newsagent’s','报刊店','/ðə ˈnjuːzeɪdʒənts/','newsagent'],['the baker’s','面包店','/ðə ˈbeɪkəz/','baker'],['the chemist’s','药店','/ðə ˈkemɪsts/','chemist'],
['much','许多（接不可数名词）','/mʌtʃ/','much'],['many','许多（接可数名词复数）','/ˈmeni/','many'],['a lot of','许多','/ə ˈlɒt əv/','lot'],['some','一些','/sʌm/','some'],['any','一些（常用于疑问或否定）','/ˈeni/','any'],['at all','一点儿（本课用于否定句）','/ət ɔːl/','none'],
['envelopes','信封（复数）','/ˈenvələʊps/','envelopes'],['glue','胶水','/ɡluː/','glue'],['writing paper','信纸','/ˈraɪtɪŋ ˌpeɪpə/','writing-paper'],['medicine','药','/ˈmedsən/','medicine'],['cheese','奶酪','/tʃiːz/','cheese'],['bread','面包','/bred/','bread'],
['butter','黄油','/ˈbʌtə/','butter'],['jam','果酱','/dʒæm/','jam'],['honey','蜂蜜','/ˈhʌni/','honey'],['beans','豆角（复数）','/biːnz/','beans'],['peas','豌豆（复数）','/piːz/','peas'],['cabbages','卷心菜（复数）','/ˈkæbɪdʒɪz/','cabbages']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit79-80',version:1,contentRevision:'shopping-needs-v1',mode:'classroom',title:'一起写购物清单',path:'/unit79-80/',start:'learn/words',progress:{learningKey:'canran:unit79-80:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识清单物品',activities:[['words','购物小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'读懂购物计划',activities:[['text','清单小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清必须与需要',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'帮忙整理清单',activities:[['apply','清单小帮手','give']],required:['apply']},
{id:'l5',title:'完成购物挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'shopping-needs-v1',title:'清单规划小达人',lesson:'Lesson 79–80',scene:'/assets/unit79-80/keepsake-story-v1.webp',alt:'Carol拿着笔和清单，与Tom讨论家里需要什么',color:'#986176',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','清单小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={carol:'Carol',tom:'Tom'};
unit.learning.DIALOGUE=[
['tom','What are you doing, Carol?','卡罗尔，你在做什么？'],
['carol','I’m making a shopping list, Tom.','我在写购物清单，汤姆。'],
['tom','What do we need?','我们需要什么？'],
['carol','We need a lot of things this week.','这个星期我们需要很多东西。'],
['carol','I must go to the grocer’s. We haven’t got much tea or coffee, and we haven’t got any sugar or jam.','我得去食品杂货店。我们的茶和咖啡不多了，糖和果酱一点儿也没有了。'],
['tom','What about vegetables?','蔬菜呢？'],
['carol','I must go to the greengrocer’s. We haven’t got many tomatoes, but we’ve got a lot of potatoes.','我得去蔬菜水果店。我们的番茄不多了，不过土豆还有很多。'],
['carol','I must go to the butcher’s, too. We need some meat. We haven’t got any meat at all.','我还得去肉店。我们需要一些肉。一点儿肉也没有了。'],
['tom','Have we got any beer and wine?','我们还有啤酒和葡萄酒吗？'],
['carol','No, we haven’t. And I’m not going to get any!','没有了。而且我不打算买！'],
['tom','I hope that you’ve got some money.','我希望你还有一些钱。'],
['carol','I haven’t got much.','我的钱不多了。'],
['tom','Well, I haven’t got much either!','唉，我的钱也不多了！']
].map(([who,text,cn],i)=>({id:'u7980-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u7980-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-list','清单图与词义','这张纸用来记下要买的东西。哪个词表示“清单”？',choice(['list','fruit','money'],'list',{image:image('list'),imageAlt:'列着物品符号的纸质清单'}),'list是清单。'),
q('v-actions','三个新词的含义','把词语和意思配好。',match([['shopping','购物'],['need','需要'],['hope','希望']]),'shopping是购物；need是需要；hope是希望。'),
q('v-vegetable','蔬菜与水果区分','哪一种属于vegetables？',choice(['cabbages','bananas','cheese'],'cabbages',{optionImages:{cabbages:image('cabbages'),bananas:image('bananas'),cheese:image('cheese')}}),'cabbages是卷心菜，属于蔬菜。'),
q('v-groups','物品类别词义','按本课词义配好。',match([['groceries','食品杂货'],['fruit','水果'],['stationery','文具']]),'类别词帮助整理清单。'),
q('v-thing','thing在句中的含义','“We need a lot of things.” 中things指什么？',choice(['需要买的东西','去过的地方','过去的时间'],'需要买的东西'),'things在这里指东西。'),
q('v-money','money的语境含义','“I haven’t got much money.” 中money是什么？',choice(['钱','时间','蔬菜'],'钱'),'money是钱。'),
q('v-people','人和商店表达区分','把人或地点与意思配好。',match([['newsagent','报刊零售商'],['chemist','药剂师'],['the baker’s','面包店']]),'newsagent和chemist指人，加the…’s可表示相应商店。')
];
unit.questions.roles=[
q('r-action','当前动作与计划区分','故事开始时，Carol正在做什么？',choice(['写购物清单','已经在肉店买肉','吃晚饭'],'写购物清单'),'I’m making a shopping list。'),
q('r-grocer','不足与没有不混淆','去杂货店前，哪条库存记录符合课文？',choice(['茶、咖啡不多；糖、果酱没有','茶、咖啡完全没有；糖很多','茶很多；果酱很多'],'茶、咖啡不多；糖、果酱没有'),'not much是不多，not any是没有。'),
q('r-vegetable','对比两种蔬菜库存','课文中的番茄和土豆分别怎样？',choice(['番茄不多，土豆很多','番茄很多，土豆没有','两种都完全没有'],'番茄不多，土豆很多'),'not many tomatoes与a lot of potatoes不同。'),
q('r-meat','at all强化否定','“We haven’t got any meat at all.” 表示什么？',choice(['一点儿肉也没有','还有很多肉','肉不多，但确定还有一些'],'一点儿肉也没有'),'not…at all加强“一点儿也没有”。'),
q('r-plan','不把拥有与计划混为一谈','Carol对啤酒和葡萄酒怎么说？',choice(['家里没有，她也不打算买','家里很多，她不必买','家里没有，她马上去买'],'家里没有，她也不打算买'),'没有存货，不代表她一定计划购买。'),
q('r-reference','结尾much的指代和either','结尾Tom说“I haven’t got much either!”。他也不多的是什么？',choice(['钱','土豆','茶'],'钱'),'much承接money，either表示“也”。'),
q('r-boundary','故事证据与未给结局','哪项是课文已经告诉我们的？',choice(['他们在商量购物，钱都不多','他们已经买齐了所有东西','他们两个人一分钱都没有'],'他们在商量购物，钱都不多'),'原文没有写采购完成；不多也不等于一点儿没有。')
];
unit.questions.grammar=[
g('must-meaning','must表示说话人认为有必要','哪个词表示“必须”？',{type:'locate',fragments:['I ',{value:'must'},' ',{value:'go'},' to ',{value:'the grocer’s'},'.'],options:['must','go','the grocer’s'],answer:'must'},'must表示认为有必要做这件事。','找表达必要性的词。',model(['I must finish my homework.','我必须完成作业。'])),
g('must-form','must后原形且三单不加s','她必须去面包店。拼好句子。',bank(['She','must','go','to the baker’s','goes','to go'],'She must go to the baker’s',4),'must后用go，不用goes或to go。','must不因she而改变。',model(['He must buy some bread.','must后接动词原形buy。'])),
g('prohibition','mustn’t表示禁止','告示禁止在这里停车。补全告示。',fill([blank('You','park here.',['mustn’t','needn’t','must'])],['mustn’t']),'mustn’t是不准，不是可以不做。','想一想：这是禁止，还是不强求？',model(['You mustn’t touch this.','这是一条禁令：不准碰。'])),
g('optional','needn’t表示没有必要','已经带了两支笔，老师说不用再带。',fill([blank('You','bring another pen.',['needn’t','mustn’t','must'])],['needn’t']),'不必再带，不代表禁止再带。','不用做与不许做意思不同。',model(['You needn’t come early.','不必早来；不是不准早来。'])),
g('must-question','must提到主语前','我必须今天完成吗？',bank(['Must','I','finish','today','Do'],'Must I finish today',4,'?'),'Must直接放在主语I前，不加Do。','先找表示必须的词。',model(['Must she go now?','Must＋主语＋原形。'])),
g('must-reply','must问句的否定回答','老师说今天不必交，可以明天交。“Must I hand it in today?”',choice(['No, you needn’t.','No, you mustn’t.','Yes, you must.'],'No, you needn’t.'),'不必今天交，回答No, you needn’t。','老师没有禁止今天交。',model(['Must I buy it now? — No, you needn’t.','没有必要时用needn’t回答。'])),
g('contrast','必要不必要与禁止三分','把三条要求配好。',match([['You must go.','必须去'],['You needn’t go.','不必去'],['You mustn’t go.','不准去']]),'must、needn’t、mustn’t表示三种不同要求。','分别考虑必须、可不做、禁止。',model(['You must wait. / You needn’t wait. / You mustn’t wait here.','必须等／不必等／不准在这里等。'])),
g('need-question','情态need疑问句与原形','按Need开头，拼出“我需要等吗？”',bank(['Need','I','wait','to','do'],'Need I wait',3,'?'),'情态need后接原形，不加to或do。','按题目要求以Need开头。',model(['Need he come?','Need＋主语＋原形，常见于疑问句。'])),
g('need-reply','情态need疑问的否定回答','事情已办好，不需要等。“Need I wait?”',choice(['No, you needn’t.','No, you don’t.','No, you aren’t.'],'No, you needn’t.'),'用情态need提问，可用needn’t简答。','让简答呼应提问中的need。',model(['Need she go? — No, she needn’t.','不需要做，用needn’t。'])),
g('need-object','实义need接名词及第三人称','她需要一个信封。',fill([blank('She','an envelope.',['needs','need','needing'])],['needs']),'接物品时need是实义动词，she用needs。','这句说明需要的物品。',model(['He needs a pencil.','he／she＋needs＋物品。'])),
g('need-to','实义need后接to不定式','我们需要买一些面包。',bank(['We','need','to buy','some bread','buying'],'We need to buy some bread',4),'实义need后接to buy表达需要做什么。','need后面是动作。',model(['I need to write a list.','need to＋动词原形。'])),
g('does-need','does后need恢复原形','他需要一些胶水吗？',fill([blank('Does he','any glue?',['need','needs','needed'])],['need']),'Does已承担三单变化，后用need。','前面已经有Does。',model(['Does she need a bag?','Does＋主语＋need。'])),
g('need-negative','实义need否定与to','他不需要去。补好两个位置。',fill([blank('He','need',['doesn’t','don’t','isn’t']),blank('','go.',['to','for','at'])],['doesn’t','to']),'He doesn’t need to go与He needn’t go都表示不必去。','实义动词否定借助doesn’t，动作前保留to。',model(['I don’t need to wait.','don’t need to＋原形。'])),
g('no-to-modal','情态needn’t直接接原形','她不必买面包。',fill([blank('She needn’t','bread.',['buy','to buy','buys'])],['buy']),'needn’t后直接用buy；不加to或s。','注意这是needn’t，不是needs。',model(['He needn’t come.','情态need没有三单s，后面不用to。'])),
g('independent-must','独立根据必须的语境回答','规则要求今天还书。“Must I return the book today?”',choice(['Yes, you must.','No, you needn’t.','Yes, you needn’t.'],'Yes, you must.'),'明确必须今天还，肯定回答Yes, you must。'),
g('independent-need','独立区分实义need结构','找出句子中应改成“to buy”的部分。',{type:'locate',fragments:[{value:'She'},' ',{value:'needs'},' ',{value:'buy'},' some bread.'],options:['She','needs','buy'],answer:'buy'},'She needs to buy some bread：实义needs后接to＋原形。')
];
unit.questions.apply=[
q('a-stock','从真实库存选出要补充的物品','新清单只补买没有的东西。该记下哪一项？',choice(['jam','potatoes','tea'],'jam',{context:'Home stock\njam: none\npotatoes: plenty\ntea: enough'}),'这里没有果酱，应登记jam；还没有实际购买。'),
q('a-quantity','可数与不可数的数量表达','数量记录说“两种都不多”。补好两句。',fill([blank('We haven’t got','tomatoes.',['many','much']),blank('We haven’t got','coffee.',['much','many'])],['many','much']),'tomatoes可数复数用many；coffee不可数用much。'),
q('a-zero','没有与不多不是同义替换','没有糖，要保留“一点儿也没有”的意思。选哪句？',choice(['We haven’t got any sugar.','We haven’t got much sugar.','We have got a lot of sugar.'],'We haven’t got any sugar.',{context:'Sugar: none at all.'}),'not any明确表示没有；not much只说不多。'),
q('a-has','实义have与have got等义转换','保留原意：She doesn’t have any biscuits.',fill([blank('She','got any biscuits.',['hasn’t','haven’t','doesn’t'])],['hasn’t']),'She hasn’t got any biscuits也表示她没有饼干。'),
q('a-shop','按明确目录选购物目的地','清单需要面包。按本课商店目录，登记去哪里。',choice(['the baker’s','the butcher’s','the newsagent’s'],'the baker’s',{context:'Shop guide\nthe baker’s: bread, cakes\nthe butcher’s: meat\nthe newsagent’s: writing paper, magazines',optionImages:{'the baker’s':image('baker'),'the butcher’s':image('butcher'),'the newsagent’s':image('newsagent')}}),'本课目录里，bread在the baker’s。'),
q('a-need','物品需求不等于动作','看材料，把需要的物品说清楚。',choice(['She needs an envelope.','She need an envelope.','She needs to an envelope.'],'She needs an envelope.',{context:'Ann has writing paper. She has no envelope. She wants to send a letter.'}),'需要物品用needs＋名词；这里不加to。'),
q('a-optional','库存足够时不必但不禁止','已经有足够的土豆，清单不用再买。怎么说？',choice(['We needn’t buy potatoes.','We mustn’t buy potatoes.','We must buy potatoes.'],'We needn’t buy potatoes.',{context:'We have got enough potatoes for dinner.'}),'不必再买用needn’t；材料没有禁止购买。'),
q('a-purpose','目的表达to get','按这张新清单拼一句完整的话。',{...bank(['I','must go','to the greengrocer’s','to get','some bananas','getting'],'I must go to the greengrocer’s to get some bananas',5),context:'Need: some bananas. Shop guide: the greengrocer’s.'},'第二个to后面的get说明去那里的目的。')
];
unit.questions.exam=[
q('e-words','独立复核新词','把词语配好。',match([['shopping','购物'],['list','清单'],['money','钱']]),'先分清活动、纸上记录和付款需要的钱。'),
q('e-hope','hope与need语义区别','“I hope that you’ve got some money.” 表达什么？',choice(['希望对方还有钱','确认对方的钱很多','禁止对方花钱'],'希望对方还有钱'),'hope表达希望，不是确认事实。'),
q('e-people','独立区分类别与职业','配好本课三个新词。',match([['stationery','文具'],['newsagent','报刊零售商'],['chemist','药剂师']]),'stationery是物品类别，后两者指人。'),
q('e-story','综合课文库存对比','哪张卡正确记录课文里的蔬菜？',choice(['tomatoes: not many; potatoes: a lot','tomatoes: none; potatoes: none','tomatoes: a lot; potatoes: not many'],'tomatoes: not many; potatoes: a lot'),'番茄不多，土豆很多。'),
q('e-none','独立理解强调否定','Carol为什么要去肉店？',choice(['They haven’t got any meat at all.','They have got a lot of meat.','They haven’t got many potatoes.'],'They haven’t got any meat at all.'),'他们一点儿肉也没有。'),
q('e-ending','结合计划和钱的语境','哪条总结有课文依据？',choice(['Carol不打算买酒；两人的钱都不多','Carol准备买酒；Tom的钱很多','两人已买齐东西；家里一点钱也没有'],'Carol不打算买酒；两人的钱都不多'),'区分购买计划、库存和钱，不补写结局。'),
q('e-must','独立构造must与原形','他必须写一张清单。',bank(['He','must','write','a list','writes','to write'],'He must write a list',4),'must后直接接原形。'),
q('e-prohibition','独立读懂禁令','门上写着“禁止进入”。',fill([blank('You','go in.',['mustn’t','needn’t','must'])],['mustn’t']),'mustn’t表示禁止进入。'),
q('e-optional','独立读懂没有必要','已经有足够的奶酪，不必再买。',fill([blank('You','buy more cheese.',['needn’t','mustn’t','must'])],['needn’t']),'不必不等于禁止。'),
q('e-must-reply','独立回应必须问句','妈妈说明天也可以去。“Must I go today?”',choice(['No, you needn’t.','No, you mustn’t.','Yes, you must.'],'No, you needn’t.'),'明天也可以，今天不是必须。'),
q('e-question','独立must提问语序','我们必须现在离开吗？',bank(['Must','we','leave','now','Do'],'Must we leave now',4,'?'),'Must直接放到we前。'),
q('e-yes','独立肯定必要性','规定现在必须离开。“Must we leave now?”',choice(['Yes, you must.','No, you needn’t.','Yes, you do.'],'Yes, you must.'),'规定明确必须离开，肯定回答用must。'),
q('e-need-question','独立情态need原形','用情态Need开头询问她是否需要来。',fill([blank('Need she','?',['come','to come','comes'])],['come']),'情态need后接原形。'),
q('e-need-no','独立情态need简答','已经准备好，不需要再等。“Need we wait?”',choice(['No, you needn’t.','No, you mustn’t.','No, you aren’t.'],'No, you needn’t.'),'没有必要等待，用needn’t简答。'),
q('e-need-to','独立needs to做事','她需要买一些信封。',bank(['She','needs','to buy','some envelopes','buy','need'],'She needs to buy some envelopes',4),'she的实义needs后接to buy。'),
q('e-does','独立does后原形','他需要一些信纸吗？',fill([blank('Does he','any writing paper?',['need','needs','to need'])],['need']),'does后用need原形。'),
q('e-negative','独立实义need否定与to','我们不需要去。',fill([blank('We','need',['don’t','doesn’t','aren’t']),blank('','go.',['to','for','at'])],['don’t','to']),'We don’t need to go与We needn’t go都表示不必去。'),
q('e-quantity','独立可数与不可数数量','把“不多”的数量词填好。',fill([blank('He hasn’t got','envelopes.',['many','much']),blank('He hasn’t got','money.',['much','many'])],['many','much']),'envelopes可数复数，money不可数。'),
q('e-any','独立保留零库存的意思','材料是“butter: none”。哪句准确保留“没有”？',choice(['We haven’t got any butter.','We haven’t got much butter.','We’ve got a lot of butter.'],'We haven’t got any butter.'),'not any表示完全没有。'),
q('e-shops','独立按教材目录配店铺','按本课商店目录配好。',match([['bread and cakes','the baker’s'],['pears and cabbages','the greengrocer’s'],['beef and chicken','the butcher’s']]),'一组商品对应一类店。'),
q('e-stock','读取两类库存与转折','按新库存选记录。',choice(['We’ve got some glue, but we haven’t got any envelopes.','We haven’t got any glue, but we’ve got some envelopes.','We haven’t got much glue, and we’ve got many envelopes.'],'We’ve got some glue, but we haven’t got any envelopes.',{context:'New stock\nglue: some\nenvelopes: none'}),'有一些胶水，但没有信封。'),
q('e-lot','独立a lot of可用于两类名词','哪句能同时表示两种东西都很多？',choice(['We’ve got a lot of eggs and a lot of milk.','We’ve got much eggs and many milk.','We haven’t got any eggs or milk.'],'We’ve got a lot of eggs and a lot of milk.'),'a lot of既可修饰可数复数，也可修饰不可数名词。'),
q('e-plan','新清单多线索推理','只补买没有的物品。按目录，需要去哪两家？',choice(['the newsagent’s and the grocer’s','the baker’s and the butcher’s','the greengrocer’s and the baker’s'],'the newsagent’s and the grocer’s',{context:'Home: no writing paper; no eggs; enough bread.\nGuide: writing paper — newsagent’s; eggs — grocer’s; bread — baker’s.'}),'核对没有什么和对应店铺，不为足够的面包安排购物。'),
q('e-purpose','独立表达去处与目的','去报刊店买些杂志。拼好完整句子。',bank(['I','must go','to the newsagent’s','to buy','some magazines','buying'],'I must go to the newsagent’s to buy some magazines',5),'to buy说明去报刊店的目的。')
];
unit.learning.SHOPS=[
{name:'the grocer’s',cn:'食品杂货店',art:'grocer',items:[['cheese','奶酪'],['eggs','鸡蛋'],['butter','黄油'],['honey','蜂蜜'],['jam','果酱'],['biscuits','饼干']]},
{name:'the greengrocer’s',cn:'蔬菜水果店',art:'greengrocer',items:[['pears','梨'],['oranges','橙子'],['bananas','香蕉'],['beans','豆角'],['peas','豌豆'],['cabbages','卷心菜']]},
{name:'the butcher’s',cn:'肉店',art:'butcher',items:[['lamb','羔羊肉'],['beef','牛肉'],['steak','牛排'],['mince','肉馅'],['chicken','鸡肉']]},
{name:'the newsagent’s',cn:'报刊店（本课也售文具）',art:'newsagent',items:[['glue','胶水'],['envelopes','信封'],['writing paper','信纸'],['newspapers','报纸'],['magazines','杂志']]},
{name:'the baker’s',cn:'面包店',art:'baker',items:[['bread','面包'],['cakes','蛋糕']]},
{name:'the chemist’s',cn:'药店',art:'chemist',items:[['aspirins','阿司匹林药片'],['medicine','药']]}
];
unit.learning.REFERENCE=[
'must＋动词原形：I must go. / She must go.。提问：Must she go?；肯定简答：Yes, she must.。',
'mustn’t表示禁止：You mustn’t go in.是不准进入；needn’t表示没有必要：You needn’t go.是不必去。',
'问“Must I go now?”，如果不必，答“No, you needn’t.”；不能用mustn’t来表达“不必”。',
'情态need通常用于疑问或否定：Need he come? / He needn’t come.。不加三单s，后接动词原形，不用to。',
'实义need可以接物品：I need a pen. / She needs a pen.；需要做事：I need to buy a pen. / She needs to buy one.。',
'实义need的问句和否定借助do／does：Does he need any paper? / He doesn’t need to go.。does后need恢复原形。',
'many＋可数名词复数：many eggs；much＋不可数名词：much money。a lot of可用于两类：a lot of eggs / a lot of milk。',
'本课中some用于“一些”，any常见于疑问或否定。not any表示没有；not much／many只表示不多，不能当作完全相同的意思。',
'I don’t have any butter.与I haven’t got any butter.意思相同；She doesn’t have any…可写成She hasn’t got any…。',
'to＋原形可说明目的：I must go to the baker’s to get some bread.。第一个to指去处，第二个to说明去做什么。',
'商店名称按本课目录理解；不同地方的店铺也可能售卖相同物品，不用现实购物经验猜本课答案。'
];
unit.learning.WRITING_A=["I don’t have any butter.","You don’t have any envelopes.","We don’t have any milk.","She doesn’t have any biscuits.","They don’t have any stationery."];
unit.learning.WRITING_A_EXAMPLES=['I don’t have any eggs. → I haven’t got many eggs.','He doesn’t have any coffee. → He hasn’t got much coffee.'];
unit.learning.WRITING_B_EXAMPLES=['Have you got any cheese? (grocer’s) → I need a lot of cheese. I haven’t got much. → I must go to the grocer’s to get some cheese.','Has he got any envelopes? (newsagent’s) → He needs a lot of envelopes. He hasn’t got many. → He must go to the newsagent’s to get some envelopes.'];
unit.learning.WRITING_B=['Have they got any bread? (baker’s)','Has she got any eggs? (grocer’s)','Have you got any magazines? (newsagent’s)','Have you got any beef? (butcher’s)','Has he got any butter? (grocer’s)','Have they got any bananas? (greengrocer’s)','Has he got any medicine? (chemist’s)'];
core.unit7980=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
