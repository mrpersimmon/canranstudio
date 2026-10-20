(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit59-60/'+name+'.svg';
const textSource='《新概念英语智慧版1》Lesson59–60，纸页118–121／PDF151–154';
const grammarSource='《同步导学》Grammar纸页108／PDF122；《语法练习册》纸页166–171／PDF180–185';
const foods=[
 ['cheese','奶酪','/tʃiːz/'],['butter','黄油','/ˈbʌtə/'],['eggs','鸡蛋','/eɡz/'],['jam','果酱','/dʒæm/'],['honey','蜂蜜','/ˈhʌni/'],['bread','面包','/bred/'],
 ['biscuits','饼干','/ˈbɪskɪts/'],['potatoes','土豆','/pəˈteɪtəʊz/'],['tomatoes','西红柿','/təˈmɑːtəʊz/'],['peas','豌豆','/piːz/'],['beans','豆角','/biːnz/'],['cabbages','卷心菜','/ˈkæbɪdʒɪz/'],
 ['lettuces','生菜','/ˈletɪsɪz/'],['bananas','香蕉','/bəˈnɑːnəz/'],['grapes','葡萄','/ɡreɪps/'],['peaches','桃子','/ˈpiːtʃɪz/'],['steak','牛排','/steɪk/'],['mince','肉馅','/mɪns/'],
 ['chicken','鸡肉','/ˈtʃɪkɪn/'],['whisky','威士忌酒','/ˈwɪski/'],['beer','啤酒','/bɪə/'],['wine','葡萄酒','/waɪn/'],['tobacco','烟草','/təˈbækəʊ/'],['soap','肥皂','/səʊp/']
];
const WORDS=[
 ['envelope','信封','/ˈenvələʊp/','envelope'],['writing paper','信纸','/ˈraɪtɪŋ ˌpeɪpə/','writing-paper'],['shop assistant','售货员','/ˈʃɒp əˌsɪstənt/','shop-assistant'],['size','尺寸；大小','/saɪz/','size'],['pad','信笺簿','/pæd/','pad'],['glue','胶水','/ɡluː/','glue'],['chalk','粉笔','/tʃɔːk/','chalk'],['change','零钱；找回的钱','/tʃeɪndʒ/','change'],['large','大的','/lɑːdʒ/','large'],['small','小的','/smɔːl/','small'],...foods.map(([en,cn,ph])=>[en,cn,ph,en])
].map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit59-60',version:1,contentRevision:'stationery-change-v1',mode:'classroom',title:'别忘了找零',path:'/unit59-60/',start:'learn/words',progress:{learningKey:'canran:unit59-60:learning:v1'},objects:WORDS,
 learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
 {id:'l1',title:'逛逛文具店',activities:[['words','购物小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
 {id:'l2',title:'这位客人买什么',activities:[['text','文具店小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
 {id:'l3',title:'说清有和没有',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
 {id:'l4',title:'接待一位新客人',activities:[['apply','柜台小帮手','give']],required:['apply']},
 {id:'l5',title:'完成采购挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
 ],questions:{},reward:{edition:'stationery-change-v1',title:'细心购物小达人',lesson:'Lesson 59–60',scene:'/assets/unit59-60/keepsake-story-v1.webp',alt:'文具店售货员把零钱递给女士，柜台上有信封、信笺簿和胶水',color:'#739e9c',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','柜台小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.DIALOGUE=[
 ['lady','I want some envelopes, please.','请给我拿几个信封。'],
 ['assistant','Do you want the large size or the small size?','您要大号的还是小号的？'],
 ['lady','The large size, please.','请拿大号的。'],
 ['lady','Do you have any writing paper?','您有信纸吗？'],
 ['assistant','Yes, we do.','有。'],
 ['assistant','I don’t have any small pads. I only have large ones. Do you want a pad?','我没有小本的信笺簿，只有大本的。您要一本吗？'],
 ['lady','Yes, please.','好，请拿一本。'],
 ['lady','And I want some glue.','我还要些胶水。'],
 ['assistant','A bottle of glue.','一瓶胶水。'],
 ['lady','And I want a large box of chalk, too.','我还要一大盒粉笔。'],
 ['assistant','I only have small boxes. Do you want one?','我只有小盒的。您要一盒吗？'],
 ['lady','No, thank you.','不了，谢谢。'],
 ['assistant','Is that all?','就要这些吗？'],
 ['lady','That’s all, thank you.','就这些，谢谢。'],
 ['assistant','What else do you want?','您还要什么吗？'],
 ['lady','I want my change.','我要找的零钱。']
].map(([who,text,cn],i)=>({id:'u5960-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u5960-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});
const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});
const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
 q('v-envelope','识别信封','选出图中物品的英文。',choice(['envelope','glue','chalk'],'envelope',{image:image('envelope'),imageAlt:'装信的信封'}),'envelope是信封。'),
 q('v-paper','区分信纸与信笺簿','把两种文具和意思连起来。',match([['writing paper','信纸'],['pad','信笺簿']]),'writing paper是信纸，pad是成册的信笺簿。'),
 q('v-size','理解size指尺寸','The large size, please. 这里size说的是什么？',choice(['尺寸大小','价格高低','物品颜色'],'尺寸大小'),'size在这里指大小。'),
 q('v-glue','识别胶水','哪一个词是图中的“胶水”？',choice(['glue','chalk','change'],'glue',{image:image('glue'),imageAlt:'一瓶带涂胶嘴的胶水'}),'glue是胶水。'),
 q('v-chalk','识别粉笔','在黑板上写字，用哪一种？',choice(['chalk','envelope','writing paper'],'chalk',{image:image('chalk'),imageAlt:'一盒白粉笔'}),'chalk是粉笔。'),
 q('v-change','按购物语境理解change','付完钱后，I want my change. 是在要什么？',choice(['找回的零钱','更换衣服','另一个尺寸'],'找回的零钱'),'这里change是找给顾客的零钱。'),
 q('v-assistant','识别售货员身份','在柜台为顾客拿商品的人，叫什么？',choice(['shop assistant','teacher','doctor'],'shop assistant',{image:image('shop-assistant'),imageAlt:'身穿围裙的售货员'}),'shop assistant是售货员。'),
 q('v-food','区分相近蔬菜词义','为蔬菜词配好意思。',match([['peas','豌豆'],['beans','豆角'],['lettuces','生菜']]),'三种蔬菜分别是peas、beans和lettuces。')
];
unit.questions.roles=[
 q('r-size','提取信封大小','这位女士要哪种信封？',choice(['the large size','the small size','两种都要'],'the large size'),'她明确选择大号信封。','找她对第一个问题的回答。'),
 q('r-pads','区分有信纸与缺少小本','售货员有没有信纸？',choice(['有，但信笺簿只有大本的','没有任何信纸','有，而且只有小本的'],'有，但信笺簿只有大本的'),'他说有信纸，接着说明没有小本的信笺簿。','不能把缺一种大小当成全部缺货。'),
 q('r-ones','理解ones的复数指代','I only have large ones. 这里ones代替什么？',choice(['pads','bottles','coins'],'pads'),'ones代替前面提到的pads。','看前一句里的复数物品。'),
 q('r-glue','提取胶水的量词','售货员拿了多少胶水？',choice(['a bottle of glue','a box of glue','a pad of glue'],'a bottle of glue'),'他说A bottle of glue。','找glue前面的包装词。'),
 q('r-chalk','区分想买与最终接受','女士买粉笔了吗？',choice(['没有，她没有接受小盒粉笔','买了大盒粉笔','买了小盒粉笔'],'没有，她没有接受小盒粉笔'),'她想要大盒，但拒绝了店里仅有的小盒。','区分想要什么和后来答应了什么。'),
 q('r-all','理解结束购物的应答','Is that all? 后，女士怎样表示不再买别的？',choice(['That’s all, thank you.','The large size, please.','Yes, we do.'],'That’s all, thank you.'),'That’s all在这里表示就这些商品。','核对这一句的前后对话。'),
 q('r-change','理解结尾误会而不虚构金额','最后，女士还在等什么？',choice(['售货员找给她的零钱','一大盒粉笔','更多信封'],'售货员找给她的零钱'),'结尾要的是零钱；原文没有说具体金额。','change要放回结账语境。')
];
unit.questions.grammar=[
 g('meaning','have表达拥有','I have a pad. 这里have表示什么？',choice(['拥有','正在吃','正在写'],'拥有'),'have在这里表示拥有。','看have后面是什么。',model(['They have a shop.','他们有一家商店。'])),
 g('positive','按主语选择have或has','我有信纸，她有信封。',fill([blank('I ',' some writing paper.',['have','has']),blank('She ',' some envelopes.',['has','have'])],['have','has']),'I用have，she用has。','先确认每句的主语。',model(['We have a car. / He has a bike.','我们有汽车。／他有自行车。'])),
 g('negative','构造have的否定','用词块说：我没有胶水。',bank(['I','don’t','have','any glue','am not'],'I don’t have any glue',4),'表示没有，用don’t have。','have在这里不是be动词。',model(['I don’t have any paper.','我没有纸。'])),
 g('question','构造have的一般疑问','用词块问：你有信封吗？',bank(['Do','you','have','any envelopes','Are'],'Do you have any envelopes',4,'?'),'用Do you have…?询问有没有。','按问题的动词选择开头。',model(['Do they have any paper?','他们有纸吗？'])),
 g('short','肯定简短回答与提问配合','Do you have any glue? 你手里有胶水，怎样简短回答？',choice(['Yes, I do.','Yes, I am.','Yes, I have any.'],'Yes, I do.'),'Do开头的提问，用do作简短回答。','不要换成be动词。',model(['Do they have any pads? Yes, they do.','他们有信笺簿吗？是的，有。'])),
 g('they','否定简短回答与人称配合','Do they have any chalk? 已知他们没有。',choice(['No, they don’t.','No, we don’t.','No, they aren’t.'],'No, they don’t.'),'谈论他们，用they；Do提问的否定短答用don’t。','既要核对回答的人称，也要核对动词。',model(['Do you have any pens? No, I don’t.','你有钢笔吗？不，我没有。'])),
 g('some','本课库存肯否句中的some与any','库存：有信封，没有粉笔。',fill([blank('We have ',' envelopes.',['some','a']),blank('We don’t have ',' chalk.',['any','a'])],['some','any']),'本课肯定句常用some，否定句常用any。','信封是复数，粉笔在这里不直接加a。',model(['I have some cups. I don’t have any water.','我有一些杯子，没有水。'])),
 g('count','区分可数复数与信纸的物质名词','两种纸制品，选对词尾。',fill([blank('I have some ','.',['envelopes','envelope']),blank('I don’t have any ','.',['writing paper','writing papers'])],['envelopes','writing paper']),'信封可逐个数；本课writing paper作不可数名词。','能否直接一个、两个地数这个名词？',model(['some apples / some milk','一些苹果／一些牛奶。这里milk不加复数s。'])),
 g('own','表示拥有时不用进行时','我现在有一本书。选一句。',choice(['I have a book now.','I am having a book now.','I has a book now.'],'I have a book now.'),'have表示拥有时，不因now改成进行时。','先判断“有”是不是一个正在发生的动作。',model(['She has a car.','她有一辆汽车：描述拥有。'])),
 g('action','不把拥有的规则扩大到吃喝','眼前她正在吃午饭，怎样说？',choice(['She is having lunch now.','She having lunch now.','She have lunch now.'],'She is having lunch now.'),'have表示吃饭这类动作时，可以用进行时。','这里have的意思已经不是拥有。',model(['I am having a drink.','我正在喝饮料。这里having表示喝的动作。'])),
 g('independent-negative','撤去示范独立表达没有','用词块说：我们没有信封。',bank(['We','don’t','have','any envelopes','aren’t'],'We don’t have any envelopes',4),'没有用don’t have；不把have替换成be。','检查句子里是否保留了have。'),
 g('independent-question','独立完成提问及否定短答','他们没有肥皂，补好问答。',fill([blank('',' they have any soap?',['Do','Are']),blank('No, they ','.',['don’t','aren’t'])],['Do','don’t']),'Do they have…?用No, they don’t.回答。','问句和回答要配套。'),
 g('independent-count','独立识别复数词尾与不可数','袋中有西红柿，盒中有肉馅。',fill([blank('We have some ','.',['tomatoes','tomatos']),blank('We have some ','.',['mince','minces'])],['tomatoes','mince']),'tomato的复数是tomatoes；本课mince作不可数名词。','不是所有食物都加s。'),
 g('independent-context','独立区分拥有与吃喝动作','Ben有一辆车，此刻正喝茶。哪组记录正确？',choice(['He has a car. He is having tea now.','He is having a car. He has tea now.','He have a car. He having tea now.'],'He has a car. He is having tea now.'),'拥有用has；这里喝茶的动作可用is having。','分别判断两个have的含义。')
];
unit.questions.apply=[
 q('a-size','按新顾客明确需求选货','换个情境：客人说“I want a small envelope.” 帮他选。',choice(['small envelope','large envelope','writing pad'],'small envelope',{optionImages:{'small envelope':image('small'),'large envelope':image('large'),'writing pad':image('pad')}}),'按客人的small选择小信封。','只选信封，并核对大小。'),
 q('a-stock','库存不足时准确说明替代品','小本信笺簿售罄，大本有货。客人问：Do you have any small pads?',choice(['No, I don’t. I only have large ones.','Yes, I do. I only have large ones.','No, I don’t have any pads.'],'No, I don’t. I only have large ones.'),'小本没有，但不能说所有本子都没有。','缺的是哪种大小？'),
 q('a-we','把you-and-Penny换成we','你和Penny有土豆，没有豆角。回答：Do you and Penny have any beans?',fill([blank('',' don’t have any beans, but we have some potatoes.',['We','They']),blank('We have some ','.',['potatoes','potatos'])],['We','potatoes']),'你在代表自己和Penny说话，要用we。','回答里包括说话的你。'),
 q('a-they','替别人说明库存','Sam和Penny有香蕉，没有葡萄。回答：Do Sam and Penny have any grapes?',bank(['They','don’t have','any grapes','but they have','some bananas','We'],'They don’t have any grapes but they have some bananas',5),'谈论Sam和Penny，用they说明没有和有。','说话人不包含在Sam和Penny中。'),
 q('a-pack','按物品与包装共同备货','采购单：a bottle of glue。选好后检查，帮客人装袋。',choice(['a bottle of glue','a box of chalk','a pad of paper'],'a bottle of glue',{optionImages:{'a bottle of glue':image('glue'),'a box of chalk':image('chalk'),'a pad of paper':image('pad')}}),'商品和包装都要符合采购单。','核对of前后两部分。'),
 q('a-decline','礼貌拒绝不合需求的替代品','你需要大盒粉笔。店员说只有小盒：Do you want one? 你决定不买。',choice(['No, thank you.','Yes, please.','Yes, I do have chalk.'],'No, thank you.'),'不接受替代品时说No, thank you。','这里问要不要，不是有没有。'),
 q('a-time','在开店时刻读取整点','店门口的钟显示几点？',choice(['It’s ten o’clock.','It’s two o’clock.','It’s twelve o’clock.'],'It’s ten o’clock.'),'短针指10，长针指12，是十点整。','分清长针和短针。'),
 q('a-change','付钱后清楚请求找零','买好东西并付过钱，店员忘了找零。用词块提醒他。',bank(['My change','please','My size'],'My change please',2),'My change, please.可以礼貌提醒店员找零。','change在这里是什么？')
];
unit.questions.apply[2].workshop={model:model(['Do you and Tom have any milk? We don’t have any milk, but we have some juice.','你和Tom一起回答，用we；先说缺什么，再说有什么。'])};
unit.questions.apply[3].workshop={model:model(['Do Ann and Ben have any glue? They don’t have any glue, but they have some paper.','谈论另外两个人，用they。'])};
unit.questions.exam=[
 q('e-envelope','新语境区分信封与信纸','信已经写好，要把它装起来寄走。需要什么？',choice(['an envelope','a bottle of glue','a box of chalk'],'an envelope'),'信封用来装信。'),
 q('e-materials','定位物质名词glue','在这张清单中，哪个词表示胶水？',{type:'locate',fragments:[{value:'envelopes'},', ',{value:'writing paper'},', ',{value:'glue'}],options:['envelopes','writing paper','glue'],answer:'glue'},'glue是胶水。'),
 q('e-story','整合原文明确接受的商品','哪份记录符合女士在课文里接受的商品？',choice(['大号信封、大本信笺簿、一瓶胶水','小号信封、大本信笺簿、一瓶胶水','大号信封、小本信笺簿、一大盒粉笔'],'大号信封、大本信笺簿、一瓶胶水'),'她选择大号信封，接受大本信笺簿，并要了胶水。'),
 q('e-chalk','区分缺货与拒绝的因果','为什么不能说她买了小盒粉笔？',choice(['店员提出小盒，但她说No, thank you.','店员有大盒，所以她买了大盒','她从来没有问过粉笔'],'店员提出小盒，但她说No, thank you.'),'愿望、店里有货和最终接受是三件事。'),
 q('e-change','不从change虚构金额','I want my change. 能知道应找多少钱吗？',choice(['不能，原文没有给出金额','应找一英镑','应找十英镑'],'不能，原文没有给出金额'),'原文只说要找零，没有金额。'),
 q('e-have','独立表达拥有','小明有一个信封，代他用I说。',choice(['I have an envelope.','I am an envelope.','I having an envelope.'],'I have an envelope.'),'用have表达拥有，an用于envelope前。'),
 q('e-has','独立选择have和has','他们有铅笔，她有本子。',fill([blank('They ',' some pencils.',['have','has']),blank('She ',' a pad.',['has','have'])],['have','has']),'they用have；she用has。'),
 q('e-negative','独立构造新的库存否定','用词块说：我没有肥皂。',bank(['I','don’t have','any soap','am not'],'I don’t have any soap',3),'don’t have表示没有。'),
 q('e-question','独立构造拥有的疑问句','用词块问：他们有胶水吗？',bank(['Do','they','have','any glue','Are'],'Do they have any glue',4,'?'),'Do they have…?询问他们有没有。'),
 q('e-reply','独立选择正负短答','客人问你和同伴有没有信纸。你们有信纸，但没有粉笔。',fill([blank('Do you have any paper? Yes, we ','.',['do','are']),blank('Do you have any chalk? No, we ','.',['don’t','aren’t'])],['do','don’t']),'根据事实回答，do与don’t和提问配合。'),
 q('e-some','独立在库存句使用some与any','有黄油，没有果酱。',fill([blank('I have ',' butter.',['some','a']),blank('I don’t have ',' jam.',['any','a'])],['some','any']),'本课物质名词前可用some或any，不直接加a。'),
 q('e-count','新材料可数与不可数','补好这份库存。',fill([blank('We have some ','.',['grapes','grape']),blank('We have some ','.',['writing paper','writing papers'])],['grapes','writing paper']),'grape用复数；本课writing paper不加s。'),
 q('e-plural','独立拼认复数词尾','有桃子，没有土豆。',fill([blank('I have some ','.',['peaches','peachs']),blank('I don’t have any ','.',['potatoes','potatos'])],['peaches','potatoes']),'peach和potato在这里分别变成peaches和potatoes。'),
 q('e-state','独立识别拥有不使用进行时','眼前Lily有一辆自行车。怎样准确描述“拥有”？',choice(['Lily has a bike.','Lily is having a bike.','Lily have a bike.'],'Lily has a bike.'),'拥有用has，不用is having。'),
 q('e-action','独立识别have作吃喝动作','孩子们此刻正在吃早饭。',choice(['They are having breakfast now.','They having breakfast now.','They has breakfast now.'],'They are having breakfast now.'),'表示吃早饭时可用are having。'),
 q('e-we','独立切换共同回答视角','你和Sam没有面包，但有饼干。回答：Do you and Sam have any bread?',choice(['We don’t have any bread, but we have some biscuits.','They don’t have any bread, but they have some biscuits.','We have some bread, but we don’t have any biscuits.'],'We don’t have any bread, but we have some biscuits.'),'你代表自己和Sam，用we，并核对库存。'),
 q('e-they','独立切换谈论别人视角','孩子们没有黄油，但有鸡蛋。补好回答。',fill([blank('',' don’t have any butter, but they have some eggs.',['They','We']),blank('They have some ','.',['eggs','egg'])],['They','eggs']),'谈论孩子们用they，egg要用复数。'),
 q('e-ones','区分one与ones的指代数量','不要重复同一个物品词，补全两句。',fill([blank('There are large pads and small ','.',['ones','one']),blank('Here is a small box. Do you want ','?',['one','ones'])],['ones','one']),'复数pads用ones，单数a box用one。'),
 q('e-measure','独立选择两种包装量词','一瓶胶水、一盒粉笔。',match([['a bottle of','glue'],['a box of','chalk']]),'glue用bottle，chalk用box，与本课包装一致。'),
 q('e-time','独立读取不同整点','What’s the time?',choice(['It’s three o’clock.','It’s nine o’clock.','It’s twelve o’clock.'],'It’s three o’clock.',{image:image('clock-3'),imageAlt:'短针指3，长针指12的钟面'}),'短针指3，表示三点整。'),
 q('e-ordinal','识别本课新增的复合序数词','把货架编号和读法连起来。',match([['23rd','twenty-third'],['24th','twenty-fourth'],['30th','thirtieth'],['36th','thirty-sixth']]),'23rd和24th读法不同，30th是thirtieth。'),
 q('e-stock','独立处理想要与库存不一致','客人要大信封。你只有小信封。哪句既如实说明，又让他自己决定？',choice(['I only have small envelopes. Do you want some?','You want small envelopes.','I have large envelopes. Here you are.'],'I only have small envelopes. Do you want some?'),'说明真实库存，再询问，不擅自替顾客决定。'),
 q('e-transfer','综合没有和有的转折说明','新库存：没有蜂蜜，有果酱。用词块回答Do you have any honey?',bank(['I','don’t have','any honey','but I have','some jam','any jam'],'I don’t have any honey but I have some jam',5),'先说明没有蜂蜜，再说明有果酱。')
];
unit.learning.CLOCKS=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'].map((word,i)=>({image:image('clock-'+(i+1)),en:'It is '+word+' o’clock.',number:['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'][i]}));
const ordinal=['13th','14th','15th','16th','17th','18th','19th','20th','21st','22nd','23rd','24th','25th','26th','27th','28th','29th','30th','31st','32nd','33rd','34th','35th','36th'];
unit.learning.MODELS=foods.map(([en,cn],i)=>({number:ordinal[i],image:image(en),en:'Do you have any '+en+'?',cn}));
unit.learning.REFERENCE=[
 '本课have表示拥有／具有：I have a pad. / She has a pad. 否定：I don’t have any paper. 提问：Do you have any paper? 回答：Yes, I do. / No, I don’t.',
 'have表示拥有时不用进行时：I have a bike now. have表示吃、喝等动作时可以用进行时：I am having lunch now. 不把“有”的限制推广到所有have。',
 'some常用于本课的肯定句，any常用于本课的疑问句和否定句。这不是所有英语语境的绝对规定：希望得到肯定回答或提供东西时，问句也可用some，如Do you want some tea?',
 'envelopes、pads、boxes、eggs、potatoes等是可数复数；本课writing paper、glue、chalk、cheese、butter、jam、honey、bread、mince、soap作不可数名词，不直接加s。steak和chicken在本课食物语境按课本物质用法；不据此否认其他语境的可数用法。',
 'a bottle of glue（一瓶胶水）、a box of chalk（一盒粉笔）、a pad of paper（一本信笺簿）。包装词可以计数，后面的物质名词保持原形。',
 'one代替前面说过的单数可数物品；ones代替复数。large ones指large pads；Do you want one?里的one指a small box of chalk。',
 '回答Do you and Penny…?时，说话者在其中，用we；回答Do Sam and Penny…?时，谈论另外两人，用they。but连接“没有某物，但有另一物”的转折。',
 'Is that all?在购物时询问是否就这些；What else do you want?询问还要什么；change在这里是找回的钱，不是换货。原文不提供商品价格或找零金额。',
 '整点：What’s the time? / It’s three o’clock. 复合序数词：21st twenty-first，22nd twenty-second，23rd twenty-third，24th twenty-fourth；30th thirtieth，31st thirty-first，32nd thirty-second，33rd thirty-third，34th thirty-fourth，35th thirty-fifth，36th thirty-sixth。'
];
unit.learning.WRITING_A=[
 'I don’t have any grape, but I have some peach.',
 'I don’t have any tomato, but I have some potato.',
 'I don’t have any mince, but I have some steak.',
 'I don’t have any glue, but I have some ink.',
 'I don’t have any envelope, but I have some writing paper.'
];
unit.learning.WRITING_B=[
 'Do you have any honey? / jam',
 'Do you and Penny have any beans? / potatoes',
 'Do Penny and Sam have any wine? / beer',
 'Do you and Sam have any bread? / biscuits',
 'Do Sam and Penny have any grapes? / bananas',
 'Do you have any mince? / steak',
 'Do the children have any butter? / eggs',
 'Do you have any lettuces? / cabbages',
 'Do you and Penny have any beans? / peas'
];
core.unit5960=unit;if(root.document?.documentElement?.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit5960,excerpts={"u5960-v1-r-size":[0,1,2],"u5960-v1-r-pads":[3,4,5,6],"u5960-v1-r-ones":[3,4,5,6],"u5960-v1-r-glue":[7,8],"u5960-v1-r-chalk":[9,10,11],"u5960-v1-r-change":[12,13,14,15],"u5960-v1-e-story":[0,1,2,3,4,5,6,7,8,9,10,11]},speakers={"lady":"Lady","assistant":"Assistant"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 59',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
