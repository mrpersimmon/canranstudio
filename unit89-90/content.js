(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit89-90/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页182–185／PDF215–218';
const grammarSource='《同步导学》Grammar纸页156／PDF170；《语法练习册》纸页255–259／PDF269–273';
const rows=[
['believe','相信；认为','/bɪˈliːv/','believe'],['may','可以（用于请求许可）','/meɪ/','door'],['how long','多长时间','/haʊ lɒŋ/','duration'],['since','自从（某个起点）','/sɪns/','start'],['why','为什么','/waɪ/','why'],['sell','卖；出售','/sel/','sale'],
['because','因为','/bɪˈkɒz/','because'],['retire','退休','/rɪˈtaɪə/','retire'],['cost','花费（cost–cost–cost）','/kɒst/','price'],['pound','英镑（£）','/paʊnd/','pound'],['worth','值……钱；值得的','/wɜːθ/','worth'],['penny','便士','/ˈpeni/','penny'],
['for sale','待售；供出售','/fə seɪl/','sale'],['for','（持续）一段时间','/fɔː/','duration'],['decide','决定','/dɪˈsaɪd/','decide'],['country','乡下（本课含义）','/ˈkʌntri/','country'],['lived','live的过去式／过去分词','/lɪvd/','house'],['sold','sell的过去式／过去分词','/səʊld/','sale'],
['read – read – read','原形读/riːd/，两种过去形式读/red/','/riːd/ – /red/ – /red/','book'],['done','do的过去分词','/dʌn/','homework'],['spoken','speak的过去分词','/ˈspəʊkən/','speech'],['swum','swim的过去分词','/swʌm/','swim'],['taken','take的过去分词','/ˈteɪkən/','shoes'],['gone','go的过去分词','/ɡɒn/','door']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit89-90',version:1,contentRevision:'house-duration-since-v1',mode:'classroom',title:'看房时的时间线索',path:'/unit89-90/',start:'learn/words',progress:{learningKey:'canran:unit89-90:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'走近待售小屋',activities:[['words','看房小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'看看房子的故事',activities:[['text','看房小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'住了多久，从何时起',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'整理看房笔记',activities:[['apply','看房笔记小帮手','give']],required:['apply']},
{id:'l5',title:'完成时间挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'house-duration-since-v1',title:'时间线索小达人',lesson:'Lesson 89–90',scene:'/assets/unit89-90/keepsake-story-v1.webp',alt:'Nigel拿着看房笔记，与Ian讨论待售的房子，尚未决定购买',color:'#9a8665',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','看房笔记小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={nigel:'Nigel',ian:'Ian'};
unit.learning.DIALOGUE=[
['nigel','Good afternoon. I believe that this house is for sale.','下午好。我想这房子是要出售的吧。'],
['ian','That’s right.','是的。'],
['nigel','May I have a look at it, please?','我可以看一看吗？'],
['ian','Yes, of course. Come in.','可以，当然可以。请进。'],
['nigel','How long have you lived here?','您在这里住了多长时间了？'],
['ian','I’ve lived here for twenty years.','我在这里已经住了二十年了。'],
['nigel','Twenty years! That’s a long time.','二十年！这时间可不短。'],
['ian','Yes, I’ve been here since 1976.','是的，从1976年起我就住在这里了。'],
['nigel','Then why do you want to sell it?','那么，您为什么想卖掉它呢？'],
['ian','Because I’ve just retired. I want to buy a small house in the country.','因为我刚退休。我想在乡下买一幢小房子。'],
['nigel','How much does this house cost?','这幢房子多少钱？'],
['ian','£68,500.','六万八千五百英镑。'],
['nigel','That’s a lot of money!','这可是一大笔钱！'],
['ian','It’s worth every penny of it.','它确实值这么多钱。'],
['nigel','Well, I like the house, but I can’t decide yet. My wife must see it first.','我喜欢这房子，但现在还不能决定。我妻子必须先来看看。'],
['ian','Women always have the last word.','女人总是最后说了算。','这是Ian的概括，不能代表所有女性。']
].map(([who,text,cn,note],i)=>({id:'u8990-d'+(i+1),who,text,cn,...(note?{note}:{}),source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u8990-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-sale','待售标志与词义','哪一个表示房子正在出售？',choice(['for sale','country','retire'],'for sale',{optionImages:{'for sale':image('sale'),country:image('country'),retire:image('retire')}}),'for sale表示待售。'),
q('v-may','请求许可','“May I have a look?” 是在做什么？',choice(['礼貌请求看一看','告诉对方自己已买下','问对方住了多久'],'礼貌请求看一看'),'may在这里用来请求许可。'),
q('v-actions','词语意义配对','配好三个词的含义。',match([['believe','相信；认为'],['sell','卖；出售'],['retire','退休']]),'不要把sell与buy混淆。'),
q('v-because','为什么与原因','“Why do you want to sell it?” 的回答该说明什么？',choice(['出售的原因','房子的颜色','对方的姓名'],'出售的原因'),'why问原因，because引出原因。'),
q('v-currency','两种货币名称','把名称配好。',match([['pound','英镑'],['penny','便士'],['cost','花费']]),'本课pound是货币英镑。'),
q('v-worth','整句价值表达','“It’s worth every penny.” 在本课表示？',choice(['它值这个价钱','它只卖一便士','它免费赠送'],'它值这个价钱'),'这是Ian对价值的看法，不是把售价改成一便士。'),
q('v-since','按意思定位英语片段','点出表示“自从”的词。',{type:'locate',fragments:['I’ve ',{value:'been'},' here ',{value:'since'},' ',{value:'1976'},'.'],options:['been','since','1976'],answer:'since'},'since引出开始的时间。'),
q('v-long','时间长短含义','“How long have you lived here?” 问什么？',choice(['在这里住了多久','房子要多少钱','房子的颜色是什么'],'在这里住了多久'),'本句how long问居住持续多久。')
];
unit.questions.roles=[
q('r-purpose','看房目的','Nigel来做什么？',choice(['看看待售的房子','给汽车做修理','送一封快递'],'看看待售的房子'),'他请求看一看房子。'),
q('r-years','时长与起点来自同一原文','哪一组都是Ian的原话？',choice(['for twenty years / since 1976','for twelve years / since 1976','for twenty years / since 1996'],'for twenty years / since 1976'),'原文一处说二十年，一处说自1976年起；不按今天重算。'),
q('r-reason','出售原因','Ian为什么想出售房子？',choice(['他刚退休','他已找到Nigel的妻子','房子刚发生碰撞'],'他刚退休'),'Because I’ve just retired。'),
q('r-country','接下来的愿望不等于完成','Ian想买什么样的房子？',choice(['乡下的一幢小房子','城市里的一座大旅馆','修理厂旁的一间办公室'],'乡下的一幢小房子'),'原文说想买，未说已经买了。'),
q('r-price','报价准确','Ian给出的报价是多少？',choice(['£68,500','£6,850','£86,500'],'£68,500'),'保留原文报价，不是现实房价建议。'),
q('r-decision','决定的必要条件','Nigel为什么还不能决定？',choice(['妻子必须先看房','他已经买下房子','Ian已经不卖了'],'妻子必须先看房'),'My wife must see it first。'),
q('r-boundary','区分人物说法与普遍事实','怎样理解最后一句“Women always have the last word”？',choice(['这是Ian的概括，不能代表所有女性','这是对每位女性都成立的规则','这说明Nigel的妻子已经买下房子'],'这是Ian的概括，不能代表所有女性'),'保留人物的话，也要区分观点与事实。')
];
unit.questions.grammar=[
g('duration','for接时长','她在这里住了三年，现在仍在。',fill([blank('She has lived here','three years.',['for','since'])],['for']),'for后接持续多久。','看后面说的是一段，还是起点。',model(['He has lived here since 2021.','2021是起点，用since。'])),
g('start','since接起点','他从2020年起住在这里，现在仍在。',fill([blank('He has lived here','2020.',['since','for'])],['since']),'since后接从何时开始。','年份本身不是一段时长。',model(['She has worked here for four years.','four years是一段时长。'])),
g('timeline','同一持续事件的两种表达','资料写着2018年入住，2024年仍住这里。',fill([blank('I have lived here','six years.',['for','since']),blank('I have lived here','2018.',['since','for'])],['for','since']),'for six years与since 2018表达同一段持续居住。','看清参照年份2024。',model(['Now: 2025. Started: 2020, still here.','for five years / since 2020'])),
g('ago','since接由ago标出的起点','“两年前”是开始时点。补全句子。',fill([blank('She has been here','two years ago.',['since','for'])],['since']),'two years是一段；two years ago表示过去的起点，用since。','不要只看years，要读完后面的词。',model(['for three days / since Monday','一段时间／从星期一起。'])),
g('clause','since接过去发生的事件','他从离校起一直在这里工作。',fill([blank('He has worked here','he left school.',['since','for']),blank('She has lived here since she','to this town.',['came','has come'])],['since','came']),'since可接过去事件，起点事件用一般过去时。','主句持续至今；后面说何时开始。',model(['She has taught here since she moved here.','moved here是过去的起点事件。'])),
g('how-long','询问持续时长','你在这里住了多久？',bank(['How long','have','you','lived','here','When'],'How long have you lived here',5,'?'),'How long＋have／has＋主语＋过去分词。','问持续多久，不是问哪一天。',model(['How long has she worked here?','她在这里工作了多久？'])),
g('subject','不同主语与持续形式','他们仍住这里；她仍在这里工作。',fill([blank('They','lived here for five years.',['have','has']),blank('She','worked here since 2022.',['has','have'])],['have','has']),'they用have；she用has。','先看主语。',model(['I have lived here. He has lived here.','I用have，he用has。'])),
g('state','过去到达与持续状态','她十点到达，现在十一点，且一直没离开。',choice(['She has been here for an hour.','She has come here for an hour.','She will come here in an hour.'],'She has been here for an hour.',{context:'Arrived: 10:00\nNow: 11:00\nShe is still here and has not left.'}),'持续待在这里用has been here，不把到达动作拉长。','分清到达的一刻和之后待着的状态。',model(['He arrived at nine. He is still here at ten.','He has been here for an hour.'])),
g('evidence','持续状态必须有材料依据','记录只说他昨天来了。能确定他一直待到现在吗？',choice(['不能，还需要知道后来有没有离开','能，来了就永远没离开','能，yesterday就表示持续到现在'],'不能，还需要知道后来有没有离开',{context:'He came here yesterday.\nThere is no other information.'}),'过去到来不保证后来一直留在这里。','不要替记录补结局。',model(['She came on Monday and left on Tuesday.','来过，不一定一直待着。'])),
g('negative-duration','否定事件在一段时间内未发生','我们已有三年没见面。',bank(['We','haven’t','seen','each other','for three years','saw'],'We haven’t seen each other for three years',5),'haven’t seen…for说明这段时间内没见过面，不是“看”连续进行了三年。','这段时间里没有发生什么？',model(['I haven’t heard from her for a month.','一个月内没收到她的消息。'])),
g('elapsed','It is…since表达经过时间','现在十一点，他十点离开。补好两处。',fill([blank('It is an hour','he left.',['since','for']),blank('It has been an hour since he',' .',['left','has left'])],['since','left']),'It is／has been＋时长＋since＋过去事件，表示那件事之后经过多久。','离开是起点，不是在这里待着。',model(['It is two days since she left.','她离开已经两天了。'])),
g('read','read同形异音','I have read the book. 这里的read对应哪组音标？',choice(['/red/','/riːd/','/raɪd/'],'/red/'),'read–read–read，原形/riːd/，过去式和过去分词/red/。','have后的词是过去分词。',model(['I read every day. /riːd/','原形说平时阅读。'])),
g('forms','90课过去式与过去分词','他已游过河；昨天游的。',fill([blank('He has','across the river.',['swum','swam']),blank('He','across it yesterday.',['swam','swum'])],['swum','swam']),'swim–swam–swum：have后用swum；过去那次用swam。','两个空的结构不一样。',model(['She has spoken to him. She spoke yesterday.','speak–spoke–spoken。'])),
g('past-negative','90课过去否定的动词原形','“He ate his lunch at one.” 改否定，哪个词要变？',{type:'locate',fragments:['He ',{value:'didn’t'},' ',{value:'ate'},' his lunch ',{value:'at one'},'.'],options:['didn’t','ate','at one'],answer:'ate'},'didn’t后用eat，不用ate。','didn’t后保留动词原形。',model(['She went. → She didn’t go.','过去否定由didn’t承担过去形式。'])),
g('independent-time','撤去示范判断时长与起点','资料中的现在是2026年；他们仍住这里。各补一个词。',fill([blank('They have lived here','ten years.',['for','since']),blank('They have lived here','2016.',['since','for'])],['for','since']),'for时长；since起点。'),
g('independent-question','撤去示范询问持续多久','她在这所学校教了多久？',bank(['How long','has','she','taught','at this school','have'],'How long has she taught at this school',5,'?'),'How long has she taught…?。'),
g('independent-clause','撤去示范用过去事件作起点','自他们还是孩子时，我们就认识他们。',fill([blank('We have known them','they were children.',['since','for'])],['since']),'since they were children把过去状态作为起点。'),
g('independent-dialogue','撤去示范区分完成与具体过去时间','她已做完作业，半小时前做的。补全回答。',fill([blank('Have you done your homework yet? Yes, I',' .',['have','did']),blank('When did you do it? I','it half an hour ago.',['did','have done'])],['have','did']),'完成问句用have回答；过去那次用did。')
];
unit.questions.apply=[
q('a-permission','先请求看房','来到门前，礼貌请求看一看房子。',choice(['May I have a look at it, please?','I have already bought it.','You must sell it to me.'],'May I have a look at it, please?',{context:'You are outside a house for sale.\nYou would like to look inside.'}),'先请求许可，不把愿望说成已购买。'),
q('a-timeline','将日期资料变成两种居住记录','按资料填好居住笔记。',fill([blank('Mia has lived here','four years.',['for','since']),blank('Mia has lived here','2020.',['since','for'])],['for','since']),'2024回看2020，且一直住到现在，是四年。'),
q('a-ask','选择有用的追问','住户说自己一直住在这里。你想了解住了多久。',bank(['How long','have','you','lived','here','How much'],'How long have you lived here',5,'?'),'问居住时长用How long。'),
q('a-reason','根据原因写看房笔记','选择资料支持的出售原因。',choice(['The owner has just retired.','The house has been sold.','The owner has moved in today.'],'The owner has just retired.',{context:'Owner’s note:\nI have just retired.\nI want a smaller home in the country.'}),'退休是出售原因；想换房不说明已经搬走。'),
q('a-visit','持续停留记录','现在十一点，参观者十点到达，一直没有离开。',bank(['They','have','been here','for an hour','come'],'They have been here for an hour',4),'用持续状态been here表达一直待着。'),
q('a-price','把不同问题配上资料','把看房问题配上合适回答。',match([['How long have you lived here?','For six years.'],['Why do you want to sell it?','Because I’ve retired.'],['How much does it cost?','£68,500.']]),'时长、原因与价格是三种不同信息。'),
q('a-two-people','90课B有明确未完成条件','按两人的记录补好回应。',fill([blank('I','my homework last night.',['did','have done']),blank('Tom','done his homework yet.',['hasn’t','didn’t'])],['did','hasn’t']),'第一人交代过去完成的事；第二人有明确尚未完成的记录。'),
q('a-decision','保留尚未决定的状态','Nigel喜欢房子，但妻子还没看。笔记该怎么写？',choice(['He hasn’t decided yet.','He has bought the house.','His wife has already seen it.'],'He hasn’t decided yet.',{context:'Nigel: I like it, but I can’t decide yet.\nMy wife must see it first.'}),'喜欢房子不等于已决定购买。')
];
unit.questions.exam=[
q('e-story','原文时长与起点','哪张笔记符合Ian的原话？',choice(['20 years · since 1976','20 years · since 1996','12 years · since 1976'],'20 years · since 1976'),'保留故事里的原始时间。'),
q('e-reason','原文决定边界','故事结束时，能确认什么？',choice(['Nigel还要先让妻子看房','Nigel已经付款买下','Ian已经搬到乡下'],'Nigel还要先让妻子看房'),'尚未决定；课文未说成交或搬走。'),
q('e-price','原文报价','选出Ian说的房价。',choice(['£68,500','£86,500','£685'],'£68,500'),'原文是六万八千五百英镑。'),
q('e-meaning','词语意义独立配对','配好三个表达。',match([['for sale','待售'],['retire','退休'],['worth every penny','值这个价钱']]),'意义相近的常用表达在不同用途下仍需分清。'),
q('e-permission','新的请求情境','你想看看书店里的这本书，怎样礼貌询问？',choice(['May I have a look at this book, please?','I have bought this book already.','How long have you lived here?'],'May I have a look at this book, please?'),'May I…?礼貌请求许可。'),
q('e-for','新材料一段时间','他一直在这里工作，已两周。',fill([blank('He has worked here','two weeks.',['for','since'])],['for']),'two weeks是时长。'),
q('e-since','新材料过去起点','他们从上个月起就住这里。',fill([blank('They have lived here','last month.',['since','for'])],['since']),'last month是起点。'),
q('e-timeline','按给定年份换算','资料：2022年开始；2025年仍在这里工作。哪组正确？',choice(['for three years / since 2022','for 2022 / since three years','for five years / since 2022'],'for three years / since 2022'),'使用题目中的2025，不用设备的今天。'),
q('e-ago','ago起点不能按时长选','“三天前开始，一直待在这里”。',fill([blank('She has been here','three days ago.',['since','for'])],['since']),'three days ago指开始的时点。'),
q('e-clause','独立使用since过去事件','他从来到这里起就一直教英语。',fill([blank('He has taught English here','he came here.',['since','for']),blank('She has worked here since she','school.',['left','has left'])],['since','left']),'since接起点事件，起点用过去形式。'),
q('e-elapsed','离开后经过多久','他一小时前离开。补好“已经过了一小时”。',fill([blank('It is an hour','he left.',['since','for'])],['since']),'It is…since…说明经过时间。'),
q('e-how-long','独立组织持续时长问句','他在这里住了多久？',bank(['How long','has','he','lived','here','have'],'How long has he lived here',5,'?'),'How long has he lived here?。'),
q('e-subject','主语与形式','分别补全两句。',fill([blank('We','been here since Monday.',['have','has']),blank('She has','here for a year.',['lived','live'])],['have','lived']),'we用have；has后用过去分词lived。'),
q('e-state','到达后持续留在场所','她九点到图书馆，现在十点，并一直没离开。',choice(['She has been in the library for an hour.','She has come to the library for an hour.','She will go to the library in an hour.'],'She has been in the library for an hour.'),'持续位于图书馆用has been in。'),
q('e-evidence','不凭到来记录推断持续','只有“He came here in 2020.”，可以确定什么？',choice(['他在2020年来过这里','他从2020年一直待到现在','他现在一定还在这里'],'他在2020年来过这里'),'没有后续材料就不替人物补持续经历。'),
q('e-negative-duration','一段时间没有发生','我两个月没见她了。',bank(['I','haven’t','seen','her','for two months','saw'],'I haven’t seen her for two months',5),'否定句表示这两个月里没有见过她。'),
q('e-read','同形动词正确音标','I read this book last year. 这里read读哪个音？',choice(['/red/','/riːd/','/rɪd/'],'/red/'),'last year那次用过去式，read读/red/。'),
q('e-forms','90课不规则过去分词','配好原形和过去分词。',match([['do','done'],['speak','spoken'],['swim','swum']]),'区分did／spoke／swam与过去分词。'),
q('e-did','90课过去问句','他今天早晨是坐汽车来的吗？',fill([blank('Did he','by car this morning?',['come','came','comes'])],['come']),'did后用come。'),
q('e-negative','90课过去否定','We swam across the river yesterday. 改否定。',bank(['We','didn’t','swim','across the river','yesterday','swam'],'We didn’t swim across the river yesterday',5),'didn’t后用swim。'),
q('e-when','完成后追问时间','朋友说已经和老师谈过。你想问是哪天谈的。',choice(['When did you speak to her?','How long is this book?','Why is the house for sale?'],'When did you speak to her?'),'问过去那次时间用When did。'),
q('e-two-people','90课B独立按记录比较','第一人昨天看了电影；另一人还没看。补全记录。',fill([blank('I','the film yesterday.',['saw','have seen']),blank('Sam','seen the film yet.',['hasn’t','didn’t'])],['saw','hasn’t']),'过去已做与到现在未做有不同结构。'),
q('e-pair','How long与When各自目的','配好问题与回答。',match([['How long have you lived here?','For five years.'],['When did you read the book?','Last year.'],['Have you done your homework yet?','Yes, I have.']]),'持续多久、过去何时、是否完成不能互相替代。'),
q('e-whole','综合解释时间资料','2025年，Lily仍住在这里；2019年开始。哪句完整正确？',choice(['Lily has lived here for six years, since 2019.','Lily has lived here since six years, for 2019.','Lily will move here in 2019.'],'Lily has lived here for six years, since 2019.'),'时长与起点可一起说明同一段持续居住。')
];
unit.learning.MODELS=[
['Have you read this book yet?','Yes, I have.','When did you read it?','I read it last year.'],
['Have you done your homework yet?','Yes, I have.','When did you do it?','I did it half an hour ago.'],
['Has he gone yet?','Yes, he has.','When did he go?','He went an hour ago.'],
['Has she spoken to him yet?','Yes, she has.','When did she speak to him?','She spoke to him yesterday.']
];
unit.learning.FORMS=[['cut','cut','cut'],['put','put','put'],['read /riːd/','read /red/','read /red/'],['set','set','set'],['shut','shut','shut'],['do','did','done'],['come','came','come'],['give','gave','given'],['swim','swam','swum'],['take','took','taken'],['eat','ate','eaten'],['go','went','gone'],['rise','rose','risen'],['see','saw','seen'],['speak','spoke','spoken']];
unit.learning.REFERENCE=[
'for＋一段时间：for twenty years；since＋起点：since 1976。How long have you lived here?问持续多久，不是问房价。原文时间保留在故事中，不按今天的年份重新计算。',
'since two years ago也是起点：two years ago是“两年前那个时候”；for two years是一段持续时间。必须把短语读完整。',
'since还可接过去事件：He has taught here since he came here.。主句说持续至今，came here是过去的起点；for不能这样接一整句。',
'It is／has been an hour since he left.表示他离开后已经过了一小时；不是说他仍留在这里。',
'到达是一个事件，一直待着是持续状态：He came at nine. He is still here at ten. → He has been here for an hour.。没有“仍在／一直没离开”的材料，不能直接推断持续至今。',
'持续至今可用have／has＋过去分词：I have lived…；She has worked…。have／has后的形式不随主语再加s。',
'否定句也能说明一段时间没有发生某事：I haven’t seen her for a month.。不是把“看”这个动作连续做了一个月。',
'90课回收完成与过去时间：Have you done it yet? — Yes, I have.；When did you do it? — I did it half an hour ago.。did／didn’t后用动词原形。',
'read的三种形式同形异音：原形/riːd/，过去式和过去分词/red/。完整15组动词在课本小参考中；实际发音由教师示范。',
'原文结尾是Ian的个人概括，不是所有女性的规律。Nigel仍未决定是否购买，妻子还需先来看；不能把看房、喜欢房子等同于成交。'
];
unit.learning.WRITING_A_EXAMPLES=['He read this book last week. → Did he read this book last week? → He didn’t read this book last week.'];
unit.learning.WRITING_A=['The sun set at twenty past seven.','He ate his lunch at one o’clock.','They did their homework last night.','He came by car this morning.','The sun rose at half past five.','We swam across the river yesterday.'];
unit.learning.WRITING_B_EXAMPLES=['Did you read this book last week? → Yes, I read this book last week.','What about Penny? → She hasn’t read this book yet.'];
unit.learning.WRITING_B=[['Did you do your homework last night?','What about Tom?'],['Did Mrs. Jones go to the butcher’s this morning?','What about Mrs. Williams?'],['Did you speak to him yesterday?','What about Susan?'],['Did George swim across the river an hour ago?','What about Sam?'],['Did you see that film yesterday?','What about Sam and Penny?'],['Did Tim take off his shoes a minute ago?','What about Frank?']];
core.unit8990=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit8990,excerpts={"u8990-v1-r-purpose":[0,1,2,3],"u8990-v1-r-years":[4,5,6,7],"u8990-v1-r-reason":[8,9],"u8990-v1-r-country":[8,9],"u8990-v1-r-price":[10,11,12,13],"u8990-v1-r-decision":[14,15],"u8990-v1-e-reason":[10,11,12,13,14,15]},speakers={"nigel":"Nigel","ian":"Ian"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 89',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
