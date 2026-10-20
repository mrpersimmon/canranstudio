(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit111-112/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页226–229／PDF259–262',grammarSource='《同步导学》Grammar纸页188／PDF202；《语法练习册》纸页321–327／PDF335–341';
const rows=[['model','型号；式样','/ˈmɒdl/','model'],['afford','付得起（钱）','/əˈfɔːd/','afford'],['deposit','预付定金','/dɪˈpɒzɪt/','deposit'],['instalment','分期付款的一期款项','/ɪnˈstɔːlmənt/','instalment'],['price','价格','/praɪs/','price'],['millionaire','百万富翁','/ˌmɪljəˈneə/','millionaire'],['cost','花费；价钱为','/kɒst/','cost'],['worth','值得；值……钱','/wɜːθ/','worth'],['pound','英镑（本课钱币单位）','/paʊnd/','pound'],['month','月','/mʌnθ/','month'],['year','年','/jɪə/','year'],['television','电视机','/ˈtelɪvɪʒn/','television'],['as…as','和……一样……','/əz … əz/','equal'],['not as…as','不如……那么……','/nɒt əz … əz/','unequal'],['not so…as','不如……那么……','/nɒt səʊ … əz/','unequal'],['expensive','昂贵的','/ɪkˈspensɪv/','expensive'],['cheap','便宜的','/tʃiːp/','cheap'],['difficult','困难的','/ˈdɪfɪkəlt/','difficult'],['interesting','有趣的','/ˈɪntrəstɪŋ/','interesting'],['comfortable','舒适的','/ˈkʌmftəbl/','comfortable'],['important','重要的','/ɪmˈpɔːtnt/','important'],['intelligent','聪明的','/ɪnˈtelɪdʒənt/','intelligent'],['sweet','甜的','/swiːt/','sweet'],['tall','高的','/tɔːl/','tall'],['short','矮的；短的','/ʃɔːt/','short'],['old','年老的；旧的','/əʊld/','old'],['blunt','钝的','/blʌnt/','blunt'],['sharp','锋利的','/ʃɑːp/','sharp'],['clean','干净的','/kliːn/','clean'],['fat','胖的','/fæt/','fat'],['smart','漂亮时髦的（衣着）','/smɑːt/','smart'],['light','轻的（重量）','/laɪt/','light'],['new','新的','/njuː/','new']];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit111-112',version:1,contentRevision:'television-comparison-v1',mode:'classroom',title:'电视机店里的比较',path:'/unit111-112/',start:'learn/words',progress:{learningKey:'canran:unit111-112:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识特点与价格',activities:[['words','电视机店小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进电视机店',activities:[['text','电视机店小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清一样与不同',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'依据资料作比较',activities:[['apply','比较小帮手','give']],required:['apply']},
{id:'l5',title:'完成比较挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'television',storyQuestion:'Frith先生可以分期付款买电视机吗？怎样付款？',completionTitles:{listen:'特点与价格词语认清啦！',roles:'电视机店故事读懂啦！',grammar:'一样与不同说清啦！',apply:'比较资料核对啦！',exam:'比较挑战完成！'},reward:{edition:'television-comparison-v1',title:'比较表达小能手',lesson:'Lesson 111–112',scene:'/assets/unit111-112/keepsake-story-v1.webp',alt:'Frith夫妇与店员讨论电视机',color:'#927c9f',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','比较小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={mr:'Mr. Frith',mrs:'Mrs. Frith',assistant:'Assistant'};
unit.learning.DIALOGUE=[
['mr','I like this television very much. How much does it cost?','我非常喜欢这台电视机。它多少钱？'],
['assistant','It’s the most expensive model in the shop. It costs five hundred pounds.','这是店里最昂贵的型号。它售价五百英镑。'],
['mrs','That’s too expensive for us. We can’t afford all that money.','那对我们来说太贵了。我们付不起那么多钱。'],
['assistant','This model’s less expensive than that one. It’s only three hundred pounds. But, of course, it’s not as good as the expensive one.','这个型号比那个便宜些。它只要三百英镑。不过，它当然没有贵的那种好。'],
['mr','I don’t like this model. The other model’s more expensive, but it’s worth the money.','我不喜欢这个型号。另一个虽然贵些，但它值这么多钱。'],
['mr','Can we buy it on instalments?','我们可以用分期付款的方式购买吗？'],
['assistant','Of course. You can pay a deposit of thirty pounds, and then fourteen pounds a month for three years.','当然可以。您可以先付三十英镑定金，然后每月十四英镑，付三年。'],
['mr','Do you like it, dear?','你喜欢它吗，亲爱的？'],
['mrs','I certainly do, but I don’t like the price. You always want the best, but we can’t afford it. Sometimes you think you’re a millionaire!','我当然喜欢，但我不喜欢这个价钱。你总想要最好的，但我们买不起。有时候你以为自己是百万富翁！'],
['mr','Millionaires don’t buy things on instalments!','百万富翁是不会分期付款买东西的！']
].map(([who,text,cn],i)=>({id:'u111112-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u111112-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-model','model的当前含义','哪个词在本课表示“型号”？',choice(['model','price','deposit'],'model',{optionImages:{model:image('model'),price:image('price'),deposit:image('deposit')}}),'本课model指电视机的型号，不是模特。'),
q('v-money','价格与支付词义','把三个词配好。',match([['afford','付得起'],['price','价格'],['deposit','预付定金']]),'价格、付得起和先付定金分别表达不同概念。'),
q('v-instalment','instalment的含义','buy it on instalments表示怎样买？',choice(['分几期付款购买','完全不用付款','只付定金，余款取消'],'分几期付款购买'),'分期不等于免费，也不等于只付定金。'),
q('v-worth','worth的原文含义','it’s worth the money在这里表达什么？',choice(['它值这个价钱','它一定是最便宜的','已经付清了钱'],'它值这个价钱'),'这是Mr. Frith对价值的评价，不是付款记录。'),
q('v-expensive','比较价格方向','less expensive than that one表示什么？',choice(['比那个便宜些','比那个贵些','两者价格一定相同'],'比那个便宜些'),'expensive的程度较低，表示更便宜些。'),
q('v-difficult','difficult词义','a difficult test中的difficult是什么意思？',choice(['困难的','便宜的','轻的'],'困难的'),'这里描述测试难度，不是价钱或重量。'),
q('v-features','区分不同特点','配好这三个词。',match([['interesting','有趣的'],['comfortable','舒适的'],['important','重要的']]),'有趣、舒适和重要是不同的比较性质。'),
q('v-price','定位价格词','点出表示“价格”的词。',{type:'locate',fragments:['I don’t ',{value:'like'},' the ',{value:'price'},'.'],options:['like','price'],answer:'price'},'price指价格；喜欢物品不等于接受它的价格。')
];
unit.questions.roles=[
q('r-opening','辨认询价人','是谁先问电视机多少钱？',choice(['Mr. Frith','Mrs. Frith','Assistant'],'Mr. Frith'),'开场Mr. Frith问How much does it cost?。'),
q('r-price','核对两个型号的价格','原文中两个型号分别是多少钱？',choice(['较贵的500英镑，另一个300英镑','较贵的300英镑，另一个500英镑','两种都只要30英镑'],'较贵的500英镑，另一个300英镑'),'30英镑是后来提到的定金，不是电视机售价。'),
q('r-likes','区分喜欢物品与接受价格','Mrs. Frith对贵的电视机是什么态度？',choice(['喜欢电视机，但不喜欢价格，认为付不起','完全不喜欢电视机的任何地方','已经同意并付清了钱'],'喜欢电视机，但不喜欢价格，认为付不起'),'I certainly do回应喜欢；but后面说明价格问题。'),
q('r-quality','保留质量评价的说话人','是谁说便宜的型号没有贵的好？',choice(['店员','Mrs. Frith','教材里的独立检测报告'],'店员'),'not as good as属于店员的介绍，不能只由价格推断所有商品质量。'),
q('r-worth','保留值得的观点归属','it’s worth the money是谁的判断？',choice(['Mr. Frith的判断','所有购买者的共同结论','Mrs. Frith已经付款的证明'],'Mr. Frith的判断'),'Mr. Frith喜欢贵的型号，不能代替别人的价值判断。'),
q('r-plan','核对定金与每期款项','按原文填好定金和每月付款数。',fill([blank('Deposit: £','',['30','14','500']),blank('Each month: £','',['14','30','300'])],['30','14']),'先付30英镑，再每月14英镑，持续三年。'),
q('r-opening-answer','回答教材开场问题','按店员的说明，可以怎样分期付款？',choice(['先付30英镑，再每月14英镑，付三年','只付30英镑就结束','每年14英镑，付三个月'],'先付30英镑，再每月14英镑，付三年'),'方案中的先付、每月与年限都要保留；说明方案不代表已经成交。'),
q('r-ending','区分人物说法与未知结局','结尾Millionaires don’t buy things on instalments!能证明什么？',choice(['这是Mr. Frith的说法，不能据此确定所有富翁习惯或购买结果','所有百万富翁都绝不分期付款','夫妇已经买好并带走电视机'],'这是Mr. Frith的说法，不能据此确定所有富翁习惯或购买结果'),'原文没有付款、签约或带走电视机的结局。')
];
unit.questions.grammar=[
g('more-most','区分more与most','分别表达“更贵”和“范围内最贵”。',fill([blank('','expensive than that one',['more','most']),blank('the','expensive model in the shop',['most','more'])],['more','most']),'比较两个对象用more；在给定范围内表达最，用the most。','先看than与in the shop的作用。',model(['more interesting than that story','the most interesting story in this set'])),
g('less-least','区分less与least','分别表达“较不有趣”和“范围内最不有趣”。',fill([blank('','interesting than that book',['less','least']),blank('the','interesting book of these three',['least','less'])],['less','least']),'less降低相对程度；the least表示给定范围内程度最低。','更少的程度与最低的程度分开。',model(['less comfortable than that chair','the least comfortable chair of the three'])),
g('base','比较词后保留形容词原级','用more expensive表达“更昂贵”，选规范形式。',choice(['more expensive','more expensiver','most expensiver'],'more expensive'),'more后保留expensive，不再加比较级词尾。','不要重复标记比较级。',model(['more difficult / the most difficult','前面已有比较标记，形容词保留原形。'])),
g('as-pair','组成as…as结构','两支尺子一样长，用as…as补全。',{...fill([blank('The red ruler is','long',['as','than']),blank('','the blue ruler.',['as','than'])],['as','as']),context:'Red ruler: 15 cm. Blue ruler: 15 cm.\nCompare their lengths.'},'as在两侧，中间用形容词原级。','两次测量的长度怎样？',model(['The two bags each weigh 2 kg.','The blue bag is as heavy as the red one.'])),
g('as-base','as…as中使用原级','按相同重量补好形容词。',{...fill([blank('Box A is as','as Box B.',['heavy','heavier','heaviest'])],['heavy']),context:'Box A weighs 4 kg. Box B weighs 4 kg.'},'as…as中间是heavy，不用heavier或heaviest。','先认清所用比较结构。',model(['This rope is as long as that rope.','as…as保留long原级。'])),
g('not-as','表达一项程度较低','按重量资料，用not as…as拼句。',{...bank(['Box A is','not as heavy as','Box B','heavier than'],'Box A is not as heavy as Box B',3),context:'Box A: 2 kg. Box B: 5 kg.\nCompare weight, using not as…as.'},'A的重量较小，所以A不如B重。','比较的是重的程度，不是外观大小。',model(['This ruler is not as long as that one.','较短的尺子在long这一性质上程度较低。'])),
g('not-so','保留not so…as合法形式','表示“不如那把椅子舒适”，哪些形式在本课都成立？',choice(['not as comfortable as和not so comfortable as都可以','只有not as comfortable as可以','必须写not so comfortable than'],'not as comfortable as和not so comfortable as都可以'),'否定比较可用not as…as或not so…as，后一个连接词仍是as。','导学列出了哪两种否定形式？',model(['not as expensive as / not so expensive as','两种形式均保留，不把合法变体判错。'])),
g('same-property','相同性质不扩大为完全相同','两箱一样重，是否说明质量也一定一样？',choice(['不能，资料只说明重量相同','能，as heavy as表示所有方面相同','能，重量相同就一定同价'],'不能，资料只说明重量相同',{context:'Box A and Box B both weigh 3 kg.\nNo information about quality or price is given.'}),'as…as只比较句子中指定的性质。','材料记录了哪一项？',model(['Two rulers can be equally long but have different colours.','一样长不等于每个特点都相同。'])),
g('short-direction','按形容词含义判断否定方向','A is not as short as B.与哪组长度相符？',choice(['A 20 cm，B 10 cm','A 10 cm，B 20 cm','A 10 cm，B 10 cm'],'A 20 cm，B 10 cm'),'A没有B那么短，按本题精确长度比较，A更长。','这里比较的是short，不是long。',model(['Not as cheap means more expensive in a price comparison.','先读清形容词，再判断方向。'])),
g('relative','不如热不等于冷','25°C的房间A不如30°C的房间B热，能直接说A很冷吗？',choice(['不能，只能确定A相对更凉一些','能，not as hot一定表示很冷','能，两间房间温度相同'],'不能，只能确定A相对更凉一些',{context:'Room A: 25°C. Room B: 30°C.\nCompare only these two recorded temperatures.'}),'相对程度较低，不自动成为相反性质的绝对判断。','更凉与很冷是同一件事吗？',model(['A less expensive model may still cost a lot.','相对便宜不自动等于便宜到付得起。'])),
g('yes','按相同资料作肯定回答','A和B一样重吗？按记录回应。',choice(['Yes, it is.','No, it isn’t.','It is the most expensive.'],'Yes, it is.',{context:'A: 3 kg. B: 3 kg.\nIs A as heavy as B?'}),'相同重量支持Yes, it is。','回应要与材料事实一致。',model(['Both ribbons are 10 cm. Are they equally long?','Yes, they are.'])),
g('no','按不同资料作否定回答','红带子和蓝带子一样长吗？按记录回应。',choice(['No, it isn’t.','Yes, it is.','They cost the same.'],'No, it isn’t.',{context:'Red ribbon: 5 cm. Blue ribbon: 8 cm.\nIs the red ribbon as long as the blue one?'}),'红带子较短，因此否定回答符合记录。','两条带子的长度相等吗？',model(['A weighs 2 kg; B weighs 4 kg. Are they equally heavy?','No, they aren’t.'])),
g('reverse','改写时保留比较对象与方向','A比B贵，换成B作主语，哪句保持原意？',choice(['B is not as expensive as A.','B is more expensive than A.','B is as expensive as A.'],'B is not as expensive as A.',{context:'Model A costs £60. Model B costs £40.'}),'交换主语后要同步改变比较方向。','从B的位置重新看价格关系。',model(['The red ruler is longer than the blue one.','The blue ruler is not as long as the red one.'])),
g('afford','相对便宜与付得起分开','按这道课堂任务的全部条件，能付得起这件物品吗？',choice(['能，20英镑正好覆盖20英镑价格','不能，必须比价格多才算付得起','不能，expensive总表示任何人都买不起'],'能，20英镑正好覆盖20英镑价格',{context:'Classroom task: £20 is available for this item.\nThe item costs £20. There are no other costs in this task.'}),'本题只按明确可用金额与所需金额比较，不从相对贵便宜推断个人承受能力。','资料是否说明了可用于本任务的全部金额？',model(['An item costs £12; the task allows only £10.','In this task, we cannot afford the item.'])),
g('scope','按完整范围判断most与least','按三种型号价格补好两句。',{...fill([blank('B is the','expensive of the three.',['most','least']),blank('C is the','expensive of the three.',['least','most'])],['most','least']),context:'All three models: A £20, B £30, C £10.'},'B在三者中最贵，C最便宜；比较范围不能漏。','先把三个价格放在同一范围核对。',model(['Of three tasks, Mia ranks C hardest and A easiest.','For Mia, C is the most difficult and A the least difficult.'])),
g('ever','保留个人见闻范围','the most interesting book I have ever read比较的是哪些书？',choice(['说话人曾经读过的书','世界上所有书','只要贵就一定包括'],'说话人曾经读过的书'),'I have ever read限定个人经历，不扩大为世界范围。','是谁的阅读经历？',model(['the most comfortable chair I have ever used','范围是说话人用过的椅子。'])),
g('independent-degree','独立核对两个比较方向','按价格记录补全。',{...fill([blank('A is','expensive than B.',['more','less']),blank('A is','expensive than C.',['less','more'])],['more','less']),context:'A costs £50, B costs £30, C costs £70.'},'A比B贵，但比C便宜；每一句分别核对参照对象。'),
g('independent-equal','独立组织相同程度','按Mia的明确评价完成as…as表达。',{...fill([blank('Chair A is as','',['comfortable','more comfortable']),blank('','Chair B.',['as','than'])],['comfortable','as']),context:'Mia says the two chairs are equally comfortable for her.\nReport her comparison.'},'as…as中间用原级；保留这是Mia的评价。'),
g('independent-direction','独立判断否定比较方向','A is not as cold as B.在本题温度比较中意味着什么？',choice(['A比B暖一些，不等于A很热','A比B更冷','A与B一定同温'],'A比B暖一些，不等于A很热',{context:'A and B are two rooms. Compare temperature only.'}),'cold程度较低表示相对更暖；不能增加绝对很热的判断。'),
g('independent-super','独立组织范围内最高级','用给定词块描述蓝色型号。',{...bank(['The blue model is','the most expensive','of the three','more expensive'],'The blue model is the most expensive of the three',3),context:'All three models: blue £500, cream £300, green £400.'},'蓝色型号在给定三个型号里最贵，不扩大范围。')
];
unit.questions.apply=[
q('a-price','按相同价格选择型号','哪一个与红色型号一样贵？',choice(['A · £30','B · £40','C · £60'],'B · £40',{context:'The red model costs £40.\nCompare prices only.',optionImages:{'A · £30':image('model-30'),'B · £40':image('model-40'),'C · £60':image('model-60')}}),'B同为40英镑，价格相同不说明所有特点相同。'),
q('a-weight','按重量选择not as heavy','哪个箱子不如5 kg的目标箱重？',choice(['A · 2 kg','B · 5 kg','C · 8 kg'],'A · 2 kg',{context:'Target box: 5 kg.\nChoose a box that is not as heavy as the target.',optionImages:{'A · 2 kg':image('case-2'),'B · 5 kg':image('case-5'),'C · 8 kg':image('case-8')}}),'2 kg较轻；相同外形不作为重量证据。'),
q('a-quality','不从价格猜质量','只知道两个价格，能确认哪种质量更好吗？',choice(['不能，还需要质量方面的资料','能，贵的一定更好','能，便宜的一定更好'],'不能，还需要质量方面的资料',{context:'Red model: £50. Blue model: £30.\nOnly prices are recorded.'}),'价格比较和质量比较是两种不同判断。'),
q('a-equal','按当前评价比较清晰度','根据记录，哪句准确？',choice(['A is as clear as B.','A is clearer than B.','B is the least clear.'],'A is as clear as B.',{context:'In this demonstration, A and B have the same picture clarity.\nCompare picture clarity only.'}),'资料明确当前演示中的画面清晰度相同。'),
q('a-ask','组织礼貌询价','想询问这个型号的价格，怎样问？',choice(['How much does this model cost?','Have you already paid for it?','Is the shop closed?'],'How much does this model cost?',{context:'You are asking an assistant for the price of this model.'}),'问price用How much does…cost?，不把询价改成付款结果。'),
q('a-plan','核对先付与每期的总量','这道课堂计划一共支付多少？',choice(['£50','£25','£30'],'£50',{context:'Classroom plan: £20 first, then £5 each month for 6 months.\nThere are exactly 6 monthly payments and no other costs in this task.'}),'20＋5×6＝50；不能只加一次每月款项，也不能漏掉先付部分。'),
q('a-range','保持难度评价范围','Mia说C是这三道任务中最难的，哪句保留了范围与观点？',choice(['For Mia, C is the most difficult of these three tasks.','C is the hardest task in the world.','Everyone finds C the easiest.'],'For Mia, C is the most difficult of these three tasks.',{context:'Mia has compared tasks A, B and C only.\nShe finds C harder than both A and B.'}),'个人评价与给定三项范围都要保留。'),
q('a-budget','按明确可用金额判断afford','按课堂任务条件，哪一个在可用金额以内？',choice(['Model A · £40','Model B · £50','两种都超过金额'],'Model A · £40',{context:'£45 is available for this classroom task.\nModel A costs £40. Model B costs £50.\nNo other costs apply in this task.'}),'只依据本题明确金额与成本作比较，不推断真实家庭经济情况。')
];
unit.questions.exam=[
q('e-prices','独立核对两种售价','按课文补好两个价格。',fill([blank('The expensive model: £','',['500','300']),blank('The other model: £','',['300','500'])],['500','300']),'售价500／300与30英镑定金分开。'),
q('e-payments','独立区分定金与月付款','按课文补好付款单位。',fill([blank('Deposit: £','',['30','14']),blank('Each month: £','',['14','30'])],['30','14']),'先付30，再每月14，不能对调。'),
q('e-years','独立核对付款期限','店员说每月付款持续多久？',choice(['三年','三个月','十四年'],'三年'),'for three years是三年，不是三个月或总共三次。'),
q('e-preference','独立区分喜欢与价格','Mrs. Frith说I certainly do, but I don’t like the price.，意思是什么？',choice(['喜欢电视机，但不喜欢价格','不喜欢电视机','已经接受并付清价格'],'喜欢电视机，但不喜欢价格'),'do回应前面的like it，不能忽略but后的价格意见。'),
q('e-view','独立保留价值评价归属','“贵的型号值这个钱”应记作什么？',choice(['Mr. Frith的评价','全体顾客都认同的事实','一次独立质量检测的结论'],'Mr. Frith的评价'),'原文将评价归于Mr. Frith。'),
q('e-millionaires','独立区分人物概括与普遍事实','最后一句应怎样理解？',choice(['Mr. Frith对百万富翁的说法，不作为所有人的消费规律','所有富翁都从不分期，这是教材证明的事实','可以据此认定Frith先生确实是百万富翁'],'Mr. Frith对百万富翁的说法，不作为所有人的消费规律'),'人物说法不能自动成为普遍规律或身份核实。'),
q('e-more-most','独立选择more与most','按要求表达“更难”和“三者中最难”。',fill([blank('','difficult than this task',['more','most']),blank('the','difficult of these three tasks',['most','more'])],['more','most']),'比较级与给定范围内最高级分开。'),
q('e-less-least','独立选择less与least','按要求表达“较不有趣”和“三本中最不有趣”。',fill([blank('','interesting than this book',['less','least']),blank('the','interesting of these three books',['least','less'])],['less','least']),'两种程度都保留，不用more替代less。'),
q('e-as-pair','独立补全相同比较框架','两个箱子同重，用as…as补全。',{...fill([blank('A is','heavy',['as','than']),blank('','B.',['as','than'])],['as','as']),context:'A weighs 2 kg. B weighs 2 kg.'},'两个as之间放形容词原级。'),
q('e-as-base','独立使用原级','选择as…as中的正确词形。',fill([blank('The blue ribbon is as','as the red one.',['long','longer','longest'])],['long']),'这个结构中使用long，不再加比较级词尾。'),
q('e-not-so','独立识别合法否定变体','在“不如那台贵”的比较中，哪项准确？',choice(['not as expensive as和not so expensive as都可用','只有not so expensive than可用','not so…as在任何情况下都错误'],'not as expensive as和not so expensive as都可用'),'两组否定结构均保留，末尾都是as。'),
q('e-property','独立保持比较性质','A is as heavy as B.能说明什么？',choice(['重量相同，不能推出价格或质量相同','两物品在所有方面完全一样','两物品都是最贵的'],'重量相同，不能推出价格或质量相同'),'heavy只比较重量。'),
q('e-short','独立读取short的否定方向','哪项符合A is not as short as B？',choice(['A 15 cm，B 8 cm','A 8 cm，B 15 cm','A 8 cm，B 8 cm'],'A 15 cm，B 8 cm'),'A没有B那么短，因此A更长。'),
q('e-cold','独立避免相对比较推绝对结论','A is not as cold as B.能得出什么？',choice(['A比B暖一些，不能因此认定A很热','A一定很热','A比B更冷'],'A比B暖一些，不能因此认定A很热'),'比较方向取决于cold；相对更暖不等于绝对很热。'),
q('e-yes','独立按相同重量回应','按资料回答：Is A as heavy as B?',choice(['Yes, it is.','No, it isn’t.','It costs £20.'],'Yes, it is.',{context:'A: 2 kg. B: 2 kg.'}),'两项重量相同，肯定回答。'),
q('e-no','独立按不同长度回应','按资料回答：Is A as long as B?',choice(['No, it isn’t.','Yes, it is.','They are equally long.'],'No, it isn’t.',{context:'A: 10 cm. B: 15 cm.'}),'A较短，不与B等长。'),
q('e-reverse','独立保持交换主语后的方向','B比A贵，改用A作主语，哪句保持原意？',choice(['A is not as expensive as B.','A is more expensive than B.','A is as expensive as B.'],'A is not as expensive as B.',{context:'A costs £40. B costs £60.'}),'交换主语时同步核对比较方向。'),
q('e-bank','独立组织less比较','按资料，用less expensive than词块表达。',{...bank(['The blue model is','less expensive than','the red one','the least expensive'],'The blue model is less expensive than the red one',3),context:'Blue model £40; red model £60.\nUse less expensive than.'},'两个对象价格已知，蓝色型号较便宜。'),
q('e-unknown','独立识别范围资料不足','知道A比B贵，就能确定A是三者最贵的吗？',choice(['不能，还不知道C的价格','能，不需要知道C','不能，因为B一定最贵'],'不能，还不知道C的价格',{context:'Model A £50. Model B £30. Model C: price not recorded.'}),'最高级需要核对完整比较范围。'),
q('e-ever','独立保持个人经历范围','the least interesting book I have ever read的范围是什么？',choice(['说话人曾经读过的书','世界所有书','所有人未来会读的书'],'说话人曾经读过的书'),'ever不取消I have read限定的范围。'),
q('e-deposit','独立区分付定金与付全款','只确认能够付定金，能认定全部付款都承担得起吗？',choice(['不能，还要核对后续款项与相应条件','能，定金就是全部价款','能，分期付款就不必付剩余款'],'不能，还要核对后续款项与相应条件',{context:'Only the deposit is confirmed affordable.\nNo information about the later payments is given.'}),'当前一部分付款能力不证明所有后续款项都能承担。'),
q('e-total','独立读取月款与期限','按以下明确计算条件，原文方案的付款合计是多少？',choice(['£534','£500','£44'],'£534',{context:'For this classroom calculation only:\n£30 first, then exactly 36 monthly payments of £14.\nDo not add any other costs.'}),'30＋36×14＝534。这里仅合计给定款项，不能自行把差额命名为某种费用。'),
q('e-rewrite','独立核对112课C改变的条件','C例题把less difficult改成more difficult并加the most，是否保持原句全部含义？',choice(['没有，例题否定并改换了原来的比较，还增加最高级范围','有，只是换一种完全同义的说法','有，less和more本来相同'],'没有，例题否定并改换了原来的比较，还增加最高级范围'),'按例完成新的表达任务，不宣称是保持原意的同义改写。'),
q('e-ending','独立区分询问方案与成交','原文是否确认Frith夫妇已买下电视机？',choice(['没有确认，询问方案不等于已经购买','确认了，定金已经付清','确认了，电视机已搬回家'],'没有确认，询问方案不等于已经购买'),'原文没有交代付款、签约或提货结果。')
];
unit.learning.REFERENCE=[
'本课导学有两条主线：多音节形容词的more／less／most／least，以及as…as、not as／so…as。不是所有多音节词都只有一种比较形式；本课选用expensive、difficult、interesting、comfortable等用法明确的词，不把入门归纳变成所有词的绝对禁令。',
'more expensive than表示比指定对象贵；less expensive than表示比指定对象便宜些。the most／least保留in the shop、of these three等范围。相对便宜仍可能付不起，相对最少或最不也不等于绝对零。',
'as＋形容词原级＋as比较指定性质相同，如as heavy as只说一样重；不意味着颜色、价格、质量都相同。中间不使用heavier或most heavy，第二个连接词不换成than。',
'not as＋原级＋as和not so＋原级＋as都可表达在相应性质上程度较低。选择题不能把另一合法形式判错；需要指定词块时会在题干明确。肯定相同比较按本课用as…as。',
'比较方向取决于形容词：not as long是较短，not as short是较长；not as hot是相对更凉，not as cold是相对更暖。相对更暖并不自动证明很热，较不困难也不等于完全没有困难。',
'同一资料可从不同主语表达：A比B贵，可改成B不如A贵。交换对象必须同步核对方向、否定与所比性质；不能只换人名或只添加not。',
'112课A按范例补入新的比较；原级描述本身没有给出另一对象的实际程度。B按范例设定角色关系，写一个问句、一个简短否定回答和一个完整否定比较；不是由问句自动得知否定事实。C的例题先否定原判断，再反转more／less并扩成most／least，改变了含义和范围，不是同义转换。',
'纸笔练习的policeman／policewoman、boy／girl等角色来自教材。身高、年龄、体重或外貌只在给定角色／资料中练表达，不凭职业猜性别，不要求对真实同学身体、聪明程度或家庭财富作排名。sweet、smart、comfortable、interesting等不能只凭颜色、价格或物品外形作客观结论。',
'cost在本课说物品价钱，price是价格，worth表达值得的评价。afford按给定可用金额和条件理解；只付得起定金不自动说明后续款项都承担得起。pound在本课是英镑，不与重量磅混算。',
'原文是500英镑与300英镑两个型号；店员介绍先付30英镑，再每月14英镑，付三年。课堂算术题若明确36次月付和没有其他项目，可合计534英镑；原文没有解释差额性质，不擅自称某项利息、费率或费用，也不把故事价格当作今天的报价。',
'店员说便宜的型号not as good as贵的，Mr. Frith说贵的worth the money，都保留说话人。价格高低本身不证明质量高低，也不代替他人的偏好。Mrs. Frith喜欢电视机但不接受价格，不添加愤怒、离开或最终同意等情节。',
'Millionaires don’t buy things on instalments是Mr. Frith的台词，不作为所有富翁的真实消费规律。询问分期方案不等于成交、付定金或提货；结尾没有确认购买。'
];
unit.learning.MODEL_TITLE='课本小参考 · 112课a–r比较';
unit.learning.COMPARISON_MODELS=[['表达目标','结构','比较边界'],['更……','more + 原级 + than','核对另一个对象'],['较不……','less + 原级 + than','指定性质程度较低'],['最……','the most + 原级','保留完整范围'],['最不……','the least + 原级','范围内程度最低'],['一样……','as + 原级 + as','只比较指定性质'],['不如……','not as / so + 原级 + as','方向取决于形容词']];
unit.learning.MODELS=[
['a · sweet · as … as','教材相同比较词：甜。不能只由苹果颜色推甜度。','sweet'],
['b · tall · as … as','教材相同比较词：高。按角色资料表达。','tall'],
['c · short · as … as','教材相同比较词：矮／短。先明确所比性质。','short'],
['d · old · as … as','教材相同比较词：年龄。按给定资料表达。','old'],
['e · blunt · as … as','教材相同比较词：钝。对应铅笔尖的描述。','blunt'],
['f · sharp · as … as','教材相同比较词：锋利。只读图／句，不安排刀具操作。','sharp'],
['g · clean · not as … as','教材否定比较词：干净。','clean'],
['h · fat · not as … as','教材角色词，保留学习，不要求给同学作身材评价。','fat'],
['i · smart · not as … as','这里描述衣着漂亮时髦，不是聪明程度。','smart'],
['j · light · not as … as','这里描述重量轻，不是明亮。','light'],
['k · new · not as … as','教材否定比较词：新。','new'],
['l · expensive · not as … as','价格不如另一个高，不能据此推质量。','expensive'],
['m · This test is difficult.','保留原书原级陈述。','difficult'],
['n · This test is more difficult.','比较对象由教材场景理解。','difficult'],
['o · This is the most difficult test I have ever done!','保留说话人做过的测试范围。','difficult'],
['p · This book is interesting.','保留原书原级评价。','interesting'],
['q · This book is less interesting.','有趣程度较低，保留评价语境。','interesting'],
['r · This is the least interesting book I have ever read!','保留说话人读过的书这一范围。','interesting']
].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 按例完成比较句',answerLines:1,instruction:'完整保留4题。按例补比较形式；这是练习给定的新比较关系，不由前半句原级描述自动推出。',examples:['This dress is long, but that one is ________. → This dress is long, but that one is longer.','Tom is intelligent, but Bill is ________. → Tom is intelligent, but Bill is more intelligent.'],items:['This book is cheap, but that one is ________.','This book is expensive, but that one is ________.','This question is easy, but that one is ________.','This question is difficult, but that one is ________.']},
{title:'B · 提问、简答并作否定比较',answerLines:3,instruction:'完整保留6题。每题按例写一个问句、一个简短否定回答和一个完整否定比较句，共三句。按教师设定的教材角色关系完成，不评价真实同学；问句本身不提供否定答案。',examples:['green apple / sweet / red apple','Is the green apple as sweet as the red apple?','No, it isn’t. The green apple isn’t as sweet as the red apple.'],items:['policeman / tall / policewoman','man / short / woman','boy / old / girl','red pencil / blunt / green pencil','blue car / clean / red car','woman / fat / man']},
{title:'C · 否定原判断并改变比较方向',answerLines:3,instruction:'完整保留4题。每题先按主语作否定回应，再反转比较方向并写最高级，共三句；Tom用he，不机械照抄例句的it。例题改变原判断，新增个人见闻范围，不能称同义改写；按教师设定的角色表达。',examples:['This test is less difficult. (ever done) → No, it isn’t. It is more difficult. It’s the most difficult test I’ve ever done.','My book is more interesting than yours. (ever read) → No, it isn’t. It is less interesting. It’s the least interesting book I’ve ever read.'],items:['My radio is less expensive than yours. (ever seen)','Tom is less intelligent than Bill. (person / ever / met)','My book is less interesting than yours. (ever read)','This test is more difficult. (ever done)']}
];
core.unit111112=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit111112,excerpts={"u111112-v1-r-opening":[0,1],"u111112-v1-r-price":[0,1,2,3],"u111112-v1-r-likes":[0,1,2,7,8],"u111112-v1-r-quality":[3],"u111112-v1-r-worth":[4],"u111112-v1-r-plan":[5,6],"u111112-v1-r-opening-answer":[5,6],"u111112-v1-e-prices":[0,1,2,3],"u111112-v1-e-payments":[5,6],"u111112-v1-e-ending":[0,1,2,3,4,5,6,7,8,9]},speakers={"mr":"Mr. Frith","assistant":"Assistant","mrs":"Mrs. Frith"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 111',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
