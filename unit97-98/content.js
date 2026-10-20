(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit97-98/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页198–201／PDF231–234';
const grammarSource='《同步导学》Grammar纸页168–169／PDF182–183；《语法练习册》纸页278–284／PDF292–298';
const rows=[
['leave','遗留（本课词义）','/liːv/','left-case'],['left','leave的过去式及过去分词','/left/','left-case'],['describe','描述','/dɪˈskraɪb/','describe'],['zip','拉链','/zɪp/','zip'],['label','标签','/ˈleɪbəl/','label'],['handle','提手；把手','/ˈhændəl/','handle'],
['address','地址','/əˈdres/','address'],['pence','便士（penny的复数形式）','/pens/','pence'],['belong','属于','/bɪˈlɒŋ/','belong'],['suitcase','手提箱','/ˈsuːtkeɪs/','blue-case'],['case','箱子','/keɪs/','blue-case'],['the other day','几天前','/ði ˈʌðə deɪ/','calendar'],
['belong to','属于……','/bɪˈlɒŋ tə/','belong'],['mine','我的（独立使用）','/maɪn/','mine'],['yours','你的；你们的（独立使用）','/jɔːz/','yours'],['his','他的','/hɪz/','his'],['hers','她的（独立使用）','/hɜːz/','hers'],['ours','我们的（独立使用）','/ˈaʊəz/','ours'],
['theirs','他们的（独立使用）','/ðeəz/','theirs'],['whose','谁的','/huːz/','whose'],['keys','钥匙（复数）','/kiːz/','keys'],['letter','信','/ˈletə/','letter'],['clothes','衣服（复数）','/kləʊðz/','clothes'],['passport','护照','/ˈpɑːspɔːt/','passport'],
['tickets','票（复数）','/ˈtɪkɪts/','tickets'],['watch','手表','/wɒtʃ/','watch'],['flowers','花（复数）','/ˈflaʊəz/','flowers'],['boat','小船','/bəʊt/','boat'],['phrasebook','短语手册','/ˈfreɪzbʊk/','phrasebook'],['hammers','锤子（复数）','/ˈhæməz/','hammers'],['car','汽车','/kɑː/','car'],['pens','钢笔（复数）','/penz/','pens']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit97-98',version:1,contentRevision:'case-possession-v1',mode:'classroom',title:'蓝色箱子的归属',path:'/unit97-98/',start:'learn/words',progress:{learningKey:'canran:unit97-98:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认清箱包线索',activities:[['words','认领小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进失物招领',activities:[['text','失物招领小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清物品归属',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'核对认领资料',activities:[['apply','认领小帮手','give']],required:['apply']},
{id:'l5',title:'完成归属挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'suitcase',storyQuestion:'Mr. Hall有没有要回自己的箱子？',completionTitles:{listen:'箱包词语认清啦！',roles:'认领故事读懂啦！',grammar:'物品归属说清啦！',apply:'认领资料核对好啦！',exam:'归属挑战完成！'},reward:{edition:'case-possession-v1',title:'归属表达小达人',lesson:'Lesson 97–98',scene:'/assets/unit97-98/keepsake-story-v1.webp',alt:'Mr. Hall与失物招领处服务员一起查看蓝色箱子把手上的标签',color:'#648c9b',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','认领小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={hall:'Mr. Hall',attendant:'服务员'};
unit.learning.DIALOGUE=[
['hall','I left a suitcase on the train to London the other day.','几天前我把一只手提箱遗留在开往伦敦的火车上了。'],
['attendant','Can you describe it, sir?','先生，您能描述一下它吗？'],
['hall','It’s a small blue case and it’s got a zip. There’s a label on the handle with my name and address on it.','它是一只蓝色的小箱子，有拉链。把手上有个标签，写着我的姓名和地址。'],
['attendant','Is this case yours?','这只箱子是您的吗？'],
['hall','No, that’s not mine.','不，那不是我的。'],
['attendant','What about this one? This one’s got a label.','这只怎么样？这只有个标签。'],
['hall','Let me see it.','让我看看。'],
['attendant','What’s your name and address?','您的姓名和地址是什么？'],
['hall','David Hall, 83, Bridge Street.','David Hall，大桥街83号。'],
['attendant','That’s right. D. N. Hall, 83, Bridge Street.','那就对了。D. N. Hall，大桥街83号。'],
['attendant','Three pounds fifty pence, please.','请付三英镑五十便士。'],
['hall','Here you are.','给您。'],
['attendant','Thank you.','谢谢。'],
['hall','Hey!','嗨！'],
['attendant','What’s the matter?','怎么回事？'],
['hall','This case doesn’t belong to me! You’ve given me the wrong case!','这只箱子不属于我！您给错箱子了！']
].map(([who,text,cn],i)=>({id:'u9798-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u9798-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-zip','箱子部件词义','哪一个词表示“拉链”？',choice(['zip','label','handle'],'zip',{optionImages:{zip:image('zip'),label:image('label'),handle:image('handle')}}),'zip是拉链，label是标签，handle是把手。'),
q('v-parts','部件与资料的区别','把三个词配好。',match([['label','标签'],['handle','把手'],['address','地址']]),'标签是载体，地址是上面的资料；不能混淆。'),
q('v-left','leave在本课表示遗留','I left a suitcase on the train.里的left表示？',choice(['把箱子遗留在火车上','箱子在我的左边','火车已经返回车站'],'把箱子遗留在火车上'),'left是leave的过去式，在这里表示遗留。'),
q('v-describe','describe表示描述','点出表示“描述”的词。',{type:'locate',fragments:['Can you ',{value:'describe'},' ',{value:'it'},', sir?'],options:['describe','it'],answer:'describe'},'describe是描述，it指前面说的箱子。'),
q('v-belong','belong to的归属含义','This case doesn’t belong to me.说明什么？',choice(['这箱子不是我的','这箱子一定是你的','这箱子是所有人的'],'这箱子不是我的'),'否定一个人拥有，不能推出另一个人的归属。'),
q('v-money','pence与英镑便士表达','three pounds fifty pence对应哪一项？',choice(['£3.50','£350','£0.35'],'£3.50'),'这是原文中的金额表达，不是今天的收费标准。'),
q('v-objects','98课物品名称','配好98课物品。',match([['keys','钥匙'],['passport','护照'],['phrasebook','短语手册']]),'物品单复数和具体词义分别核对。'),
q('v-whose','whose询问归属','Whose is it?在问什么？',choice(['它是谁的','它是什么颜色','它在哪里'],'它是谁的'),'Whose问物品归谁，不问颜色或地点。')
];
unit.questions.roles=[
q('r-left','遗留地点与时间','Mr. Hall说把箱子忘在哪里？',choice(['几天前，开往伦敦的火车上','今天，伦敦的一家商店里','昨天，家里的书桌上'],'几天前，开往伦敦的火车上'),'the other day是几天前，没有精确到固定日期。'),
q('r-description','描述中的必要特征','哪项完整符合他的描述？',choice(['小蓝箱，有拉链，把手上有标签','大红箱，没有拉链','小蓝箱，明确说没有标签'],'小蓝箱，有拉链，把手上有标签'),'尺寸、颜色、拉链与标签位置都要保留。'),
q('r-first','第一次认领的否定','第一次被问Is this case yours?时，他怎样回答？',choice(['No, that’s not mine.','Yes, that is mine.','I don’t have any case.'],'No, that’s not mine.'),'不把一次否定扩展成他没有箱子。'),
q('r-label','标签记录的内容','他描述标签上有什么？',choice(['他的姓名和地址','下一班火车时间','箱子的价格和重量'],'他的姓名和地址'),'原文没有提到标签上的价格或重量。'),
q('r-name','本人陈述与标签读法分开','他自己报出的姓名和地址是哪一项？',choice(['David Hall · 83, Bridge Street','D. N. Hall · 38, Bridge Street','David Hill · 83, Park Street'],'David Hall · 83, Bridge Street'),'本人说David Hall；服务员后面读出D. N. Hall。保留差别，不猜中间字母代表什么。'),
q('r-fee','原文收费表达','服务员请他付多少钱？',choice(['Three pounds fifty pence.','Fifty pounds three pence.','Three pence.'],'Three pounds fifty pence.'),'按原文核对金额，不从收费推断已经归还正确物品。'),
q('r-ending','结尾归属与未知主人','结尾Mr. Hall明确说了什么？',choice(['拿到的箱子不属于他，服务员给错了','他已经拿回自己原来的箱子','箱子一定属于服务员'],'拿到的箱子不属于他，服务员给错了'),'不知道真正主人是谁；不能擅自补出后来找回的结局。'),
q('r-question','教材开场问题的回答','根据课文结尾，他有没有要回自己的箱子？',choice(['没有，结尾他说给错了箱子','有，标签上有姓氏就能证明','课文明确说他同时拿回两只箱子'],'没有，结尾他说给错了箱子'),'读到结尾再判断；标签线索不是唯一的所有权证明。')
];
unit.questions.grammar=[
g('single','单数名词所有格','按’s形式补全“Tom的箱子”。',fill([blank('This is','case.',['Tom’s','Toms','Tom'])],['Tom’s']),'单数人名后加’s表示所属关系。','先找谁拥有箱子。',model(['This is Jane’s bag.','Jane是名字，’s表示“……的”。'])),
g('plural','以s结尾的复数所有格','两位男孩共有一个房间，选对写法。',choice(['the boys’ room','the boy’s room','the boys room'],'the boys’ room',{context:'Two boys share one room.'}),'boys是两位男孩；以s结尾的复数后加撇号。','主人是一个还是多个？',model(['one girl’s coat / two girls’ coats','先看主人的人数，再放撇号。'])),
g('irregular','不以s结尾的复数所有格','孩子们的玩具，用哪一个？',fill([blank('the','toys',['children’s','childrens’','children'])],['children’s']),'children已经是复数，不以s结尾，后面加’s。','不要把children再加复数s。',model(['the men’s shoes','men是man的复数，所有格为men’s。'])),
g('boss','以s结尾的单数普通名词','一位老板的办公室，按本课’s写法填空。',fill([blank('the','office',['boss’s','bosses’','bosses'])],['boss’s']),'boss是单数，即使末尾有s，也按本课写法加’s。','先分清单数boss与复数bosses。',model(['the actress’s bag','这个单数名词也可以用’s写法。'])),
g('shared','共同拥有与各自拥有','第一句共用一个包；第二句两人各有一把锤子。',fill([blank('This is','bag.',['Tom and Anna’s','Tom’s and Anna’s']),blank('These are','hammers.',['Tom’s and Anna’s','Tom and Anna’s'])],['Tom and Anna’s','Tom’s and Anna’s']),'共同拥有在最后一个名字后加’s；各自拥有时分别加。','注意shared与one each。',model(['Ben and May share a boat: Ben and May’s boat.','They each own a car: Ben’s and May’s cars.'])),
g('duration','时间所有格与复合修饰语','两天假期，按给定两种结构补全。',fill([blank('a','holiday',['two-day','two-days']),blank('two','holiday',['days’','day’s'])],['two-day','days’']),'a two-day holiday与two days’ holiday结构不同；前者day在复合修饰语中不加复数s。','先看是否有连字符。',model(['a three-hour journey / three hours’ journey','结构不同，表达的时长可相同。'])),
g('city','城市也可以用’s','the city’s parks表示什么？',choice(['这座城市的公园','只能是一个人的公园','这是句子，city’s一定表示city is'],'这座城市的公园'),'不能把“有生命多用’s”变成“无生命绝不能用’s”。','看’s后面是不是名词。',model(['the country’s history','国家等名词也能表示这种所属关系。'])),
g('omission','已知名词与店铺名词省略','We bought bread at the baker’s.里的the baker’s指？',choice(['面包店','面包师的一只箱子','某个人昨天做的动作'],'面包店'),'谈商店等场所时可省略shop等已知名词。','结合买面包的地点。',model(['This coat is Lily’s.','已知在说coat时，可以省去重复的coat。'])),
g('of-part','用of表达部分与整体','用of结构组织“这本书的背面”。',bank(['the back','of','the book','to'],'the back of the book',3,''),'本题指定of结构，不能由此断言book’s back在所有语境都不成立。','从部分到整体。',model(['the handle of the case','先说把手，再说是哪只箱子的。'])),
g('of-person','of结构也可涉及人','a photograph of my sister通常说明照片里是谁？',choice(['我姐姐或妹妹','一定是照片的所有者本人','原句没有任何人物信息'],'我姐姐或妹妹'),'这里of引出被拍摄的人；不由此证明谁拥有照片。','被拍到的人与拥有照片的人可能不同。',model(['a picture of the teacher','说明画面中的人，不等于说明画归谁。'])),
g('double-noun','of加名词所有格','按双重所有格表达“我父亲的一个朋友”。',fill([blank('a friend of','',['my father’s','my father is','my fathers'])],['my father’s']),'双重所有格结构可以是of＋名词’s，表达相关人物中的一位。','这里按指定结构选形式。',model(['two books of Mary’s','Mary拥有的书中的两本。'])),
g('double-pronoun','of加独立所有格代词','按of＋所有格代词表达“我的一个朋友”。',fill([blank('a friend of','',['mine','my','I'])],['mine']),'of后在这个结构中用mine，不用my或I。','这里没有名词接在my后面。',model(['a cousin of hers','hers独立使用。'])),
g('apostrophe','区分所有格与is或has的缩略','把三种’s的意思配好。',match([['It’s blue.','it is'],['It’s got a zip.','it has'],['Hall’s case','霍尔的箱子']]),'同样的’s可能是is、has的缩写，也可能表示所有格，要看结构。','不要只看撇号就判断。',model(['She’s a teacher. → She is a teacher.','Kate’s book → Kate的书。'])),
g('my-mine','名词前与独立使用的物主形式','你介绍自己的箱子；两种表达分别填什么？',fill([blank('This is','case.',['my','mine']),blank('This case is',' .',['mine','my'])],['my','mine']),'my后接名词；mine已包含“我的东西”的意义。','空格后还有没有名词？',model(['This is her bag. / This bag is hers.','her与hers的使用位置不同。'])),
g('belong','belong to后用宾格，问句看物品单复数','一个箱子归他；几把钥匙归他们。',fill([blank('Does this case belong to','?',['him','his']),blank('Do these keys','to them?',['belong','belongs'])],['him','belong']),'belong to后用him；do／does后用动词原形。是否用do取决于物品主语。','把主人和物品分开看。',model(['It belongs to her. / Does it belong to her?','her是宾格；does后belong不加s。'])),
g('whose','Whose问句的单复数','一个手表与一组钥匙，分别补好问句。',fill([blank('Whose','this watch?',['is','are']),blank('Whose','these keys?',['are','is'])],['is','are']),'be由物品的单复数决定，不由主人有几人决定。','watch单数，keys复数。',model(['Whose is this boat? / Whose are these tickets?','根据物品选择is或are。'])),
g('independent-plural','独立选择规则与不规则复数所有格','几位学生的书；几个孩子的包。',fill([blank('the','books',['students’','student’s']),blank('the','bags',['children’s','childrens’'])],['students’','children’s']),'students以s结尾；children是不规则复数。'),
g('independent-shared','独立核对共同拥有','资料明确两人共用同一辆车，选择符合意思的写法。',choice(['Mia and Leo’s car','Mia’s and Leo’s cars','Mia’s cars and Leo'],'Mia and Leo’s car',{context:'Mia and Leo own one car together.'}),'只在最后名字后加’s，表达共同拥有的这辆车。'),
g('independent-double','独立组织双重所有格','用给定词块说“Ben的两本书”。',bank(['two books','of','Ben’s','Ben is'],'two books of Ben’s',3,''),'of后为Ben’s，不把它拆成Ben is。'),
g('independent-perspective','独立根据对话群体回应','Ann和Ben共有这辆车。Ann问不属于他们一组的服务员；请作为服务员回答。',choice(['Yes, it’s yours.','Yes, it’s ours.','Yes, it’s mine.'],'Yes, it’s yours.',{context:'Owners: Ann and Ben\nAnn asks an attendant: Is this our car?\nThe attendant is not one of the owners.'}),'服务员不属于Ann的“我们”，所以说你们的yours；若Ben回答则可以用ours。')
];
// The shared/separate contrast supplies facts as material before either blank.
unit.questions.grammar.find(x=>x.id==='u9798-v1-g-shared').display={title:'第一句共用一个包；第二句两人各有一把锤子。',material:'Tom and Anna share one bag.\nTom owns one hammer. Anna owns another hammer.'};
unit.questions.apply=[
q('a-features','依据完整特征筛选候选箱','哪只箱子符合失物描述？',choice(['A · 小蓝箱，有拉链，把手有标签','B · 小蓝箱，有拉链，没有标签','C · 大棕箱，有标签'],'A · 小蓝箱，有拉链，把手有标签',{context:'Wanted: a small blue case\nIt has a zip and a label on the handle.',optionImages:{'A · 小蓝箱，有拉链，把手有标签':image('blue-case'),'B · 小蓝箱，有拉链，没有标签':image('no-label-case'),'C · 大棕箱，有标签':image('brown-case')}}),'外观相符只是候选，还要继续核对归属。'),
q('a-speaker','回应人从your转为mine','你扮演Ben。钥匙是你的，怎样回答Ann？',choice(['Yes, they’re mine. They belong to me.','Yes, they’re yours. They belong to you.','Yes, it is mine.'],'Yes, they’re mine. They belong to me.',{context:'You are Ben. These keys belong to you.\nAnn asks you: Are these your keys?'}),'Ann问你的物品，Ben回答我的；keys复数用they。'),
q('a-label','核对标签不能忽略地址差异','姓名相同但资料如下，下一步怎样做？',choice(['地址不同，应继续核对','姓名一样就立即确认所有人','可以直接改写标签地址'],'地址不同，应继续核对',{context:'Claimant: Mia Green, 12 Oak Street\nLabel: Mia Green, 12 Park Street'}),'按给出的资料比较，不要求填写真实地址，也不能擅自改记录。'),
q('a-joint','根据共同拥有写登记','Eva和Tom共同拥有这只船，按’s写登记。',choice(['Eva and Tom’s boat','Eva’s and Tom’s boats','Evas and Toms boat'],'Eva and Tom’s boat',{context:'Eva and Tom share one boat.'}),'共享一只船，在最后一个名字后加’s。'),
q('a-group','同组成员回应our','你扮演Ann，同组Ben问这是不是你们共有的车。',choice(['Yes, it’s ours. It belongs to us.','Yes, it’s yours. It belongs only to you.','Yes, it’s theirs.'],'Yes, it’s ours. It belongs to us.',{context:'You are Ann. You and Ben own this car together.\nBen asks you: Is this our car?'}),'双方都在同一所有者群体中，用ours／us。'),
q('a-negative','否定归属而不虚构主人','你知道箱子不是你的，但还不知道主人是谁。怎样说？',bank(['This case','doesn’t','belong','to me','to you'],'This case doesn’t belong to me',4),'只说明不属于我，不擅自说一定属于你。'),
q('a-of','根据位置描述查找标签','标签在哪里？用of结构回应。',bank(['on the handle','of','the blue case','in'],'on the handle of the blue case',3,'',{context:'The label is attached to the blue case’s handle.'}),'用of保留把手与蓝箱子的关系。'),
q('a-double','按已有所有者资料表达其中一个','这些书都是Ella的。指其中一本，按of结构填空。',fill([blank('This is a book of',' .',['Ella’s','Ella is','Ellas'])],['Ella’s']),'a book of Ella’s表示Ella所拥有的书中的一本。')
];
unit.questions.apply.find(x=>x.id==='u9798-v1-a-of').display={title:'标签在哪里？用of结构回应。',material:'The label is attached to the blue case’s handle.'};
unit.questions.apply.find(x=>x.id==='u9798-v1-a-double').display={title:'这些书都是Ella的。指其中一本，按of结构填空。',material:'Ella owns all the books on this shelf.\nPoint to one of them.'};
unit.questions.exam=[
q('e-ending','原文结尾的证据边界','哪一项符合课文结尾？',choice(['Mr. Hall说拿到的箱子不属于他','他最终取回原箱并开心离开','服务员说那箱子属于自己'],'Mr. Hall说拿到的箱子不属于他'),'保持结尾，不补出最后找回或真正主人的身份。'),
q('e-label','人物陈述不自动等于已验证事实','服务员读了标签，是否能据此忽略结尾的话？',choice(['不能，结尾仍明确说给错了箱子','能，只要有标签就永远不会错','能，付款等于所有权已经证明'],'不能，结尾仍明确说给错了箱子'),'区分角色的判断与全文事实。'),
q('e-contraction','独立区分is与has缩略','按原句结构补出完整形式。',fill([blank('It’s a small case. → It','a small case.',['is','has']),blank('It’s got a zip. → It','got a zip.',['has','is'])],['is','has']),'’s要结合后面的结构来判断。'),
q('e-single','独立表达单数名词所有格','按’s写法填“我哥哥的书”。',fill([blank('my','book',['brother’s','brothers','brother'])],['brother’s']),'单数brother后加’s。'),
q('e-plural','独立判断规则复数所有格','三位女孩的包，选对形式。',choice(['the girls’ bags','the girl’s bags','the girls bags'],'the girls’ bags'),'主人已明确为三人，girls复数以s结尾。'),
q('e-irregular','独立判断不规则复数所有格','这些是几位男士的鞋。',fill([blank('These are the','shoes.',['men’s','mens’','mens'])],['men’s']),'men本身已是复数，所有格为men’s。'),
q('e-boss','独立区分单数s与复数s','一位老板的帽子，按本课’s写法选。',choice(['the boss’s hat','the bosses’ hats','the bosses hat'],'the boss’s hat'),'不要把boss结尾的s当成复数标记。'),
q('e-joint','独立表达同一物品共有','Leo和May共有这一个房间。',choice(['Leo and May’s room','Leo’s and May’s rooms','Leo’s room and May'],'Leo and May’s room',{context:'Leo and May share one room.'}),'共同拥有只在最后名字后标’s。'),
q('e-separate','独立表达各自拥有','Ada和Ben各有一顶帽子。',choice(['Ada’s and Ben’s hats','Ada and Ben’s hat','Adas and Bens hats'],'Ada’s and Ben’s hats',{context:'Ada owns one hat. Ben owns another hat.'}),'各自拥有需要分别表达两人的所属关系。'),
q('e-time','独立区分时间所有格与复合结构','按所给结构表达五分钟步行路程。',fill([blank('a','walk',['five-minute','five-minutes']),blank('five','walk',['minutes’','minute’s'])],['five-minute','minutes’']),'连字符复合修饰语与时间所有格的形式不同。'),
q('e-city','无生命名词不是’s禁区','this city’s history怎样理解？',choice(['这座城市的历史','一定错误，城市没有生命','城市正在做某事'],'这座城市的历史'),'城市等名词也能用’s表示关系。'),
q('e-omission','已知名词可以省略','有人问这是谁的外套，回答It’s Rosa’s.意思是？',choice(['是Rosa的外套','Rosa就是这件外套','Rosa有几件外套已被说明'],'是Rosa的外套'),'省略已知coat，不说明她共有几件。'),
q('e-of','独立组织of部分关系','用of词块说“这个房间的门”。',bank(['the door','of','the room','to'],'the door of the room',3,''),'指定of结构表达部分与整体。'),
q('e-photo','照片内容不等于所有权','a photo of Tom只凭这段话能确认什么？',choice(['照片拍的是Tom，不能据此确认谁拥有它','照片一定属于Tom','Tom一定亲自拍了照片'],'照片拍的是Tom，不能据此确认谁拥有它'),'of表示的关系要结合名词，不把照片内容等同于归属。'),
q('e-double-noun','独立使用of加名词所有格','按双重所有格说“我姐姐的一个朋友”。',fill([blank('a friend of','',['my sister’s','my sister is','my sisters'])],['my sister’s']),'of后用名词所有格，不能把’s当is。'),
q('e-double-pronoun','独立使用of加所有格代词','她的一个朋友，按给定结构填。',fill([blank('a friend of','',['hers','her','she'])],['hers']),'这里用可独立使用的hers。'),
q('e-forms','独立根据名词是否出现选形式','这张桌子是我们的，完整说法和省略说法怎样填？',fill([blank('This is','table.',['our','ours']),blank('This table is',' .',['ours','our'])],['our','ours']),'our后有名词；ours独立使用。'),
q('e-his-hers','独立辨认两种不同形式','按给定说法补全，不根据物品猜主人。',fill([blank('The coat belongs to him. It is',' .',['his','him']),blank('The flowers belong to her. They are',' .',['hers','her'])],['his','hers']),'him对应his，her在句末用hers。'),
q('e-theirs','独立表达他们的归属','票属于Tom和Jill，两个人都不在本次对话中。',choice(['They’re theirs. They belong to them.','They’re ours. They belong to us.','It is mine.'],'They’re theirs. They belong to them.',{context:'Owners: Tom and Jill\nThey are not the speaker or the listener.\nThe objects are tickets.'}),'物品用they，所有者用theirs／them。'),
q('e-belong','独立构造单复数belong问句','一个手表与几支钢笔分别提问。',fill([blank('Does this watch','to her?',['belong','belongs']),blank('Do these pens belong to','?',['them','theirs'])],['belong','them']),'does后用原形；to后用宾格。'),
q('e-whose','独立询问复数物品归属','这些钥匙是谁的？',bank(['Whose','are','these keys','is'],'Whose are these keys',3,'?'),'钥匙为复数，用are；不按主人有几人决定。'),
q('e-mine','你作为物主回应别人的your','你扮演Sam，表是你的。Lily问Is this your watch?，怎样回应？',choice(['Yes, it’s mine. It belongs to me.','Yes, it’s yours. It belongs to you.','Yes, they’re mine.'],'Yes, it’s mine. It belongs to me.'),'说话人改变，your转成mine；一个watch用it。'),
q('e-ours','同一主人群体中的回应','你和同伴共有这些钥匙，同伴问Are these our keys?，你说？',choice(['Yes, they’re ours.','Yes, they’re yours and not mine.','Yes, it’s hers.'],'Yes, they’re ours.'),'双方同在拥有者群体，ours包括自己和同伴。'),
q('e-unknown','否定归属不自动确定他人','只知道这箱子不是Hall的，能确定是服务员的吗？',choice(['不能，还没有真正主人的信息','能，不属于Hall就必定属于服务员','能，箱子颜色已经证明主人'],'不能，还没有真正主人的信息'),'必须有额外归属依据。')
];
unit.learning.REFERENCE=[
'本课Grammar学习三种表达关系的方式：’s所有格、of结构和of＋名词所有格／所有格代词。先明确人物、物品与关系，再选择结构；不能只背撇号的位置。',
'单数人名或普通名词常加’s；以s结尾的复数只加撇号，如boys’；不以s结尾的复数加’s，如children’s、men’s。boss是单数，按本课写法用boss’s。像James、Dickens这样的专名，James’s／James’等写法随规范而异，不把其中一种一概判错。',
'共同拥有同一物品：Tom and Anna’s bag；各自拥有：Tom’s and Anna’s bags。物品是否共有必须由材料说明，不能仅从两个名字猜测。',
'时间、距离、金额、国家与城市等也能用’s／s’，如a day’s journey、two pounds’ worth、the city’s parks。不能教成“无生命名词绝不能用’s”。a two-day holiday与two days’ holiday形式不同；连字符结构中的day不加复数s。',
'已知在说哪件东西时可省略名词：This coat is Lily’s. 店铺、住所等语境中也常省略：at the baker’s（面包店），at Mary’s（Mary家）。不把所有省略都理解成店铺。',
'of可以表达部分、整体或其他关系：the handle of the case、a photograph of my sister。后者说明被拍摄的人，不自动说明照片是谁的。也不把of限制为只能涉及没有生命的东西。',
'双重所有格：a friend of my father’s、a friend of mine。它可以表达相关的人或物中的一个；教材的这类结构作为可用模式学习，不把“名词前有a／this等就必须使用双重所有格”当绝对规则。a photograph of my sister同样是正确表达。',
'my／your／her／our／their通常放在名词前；mine／yours／hers／ours／theirs可以独立使用。his两种位置形式相同。belong to后用me／you／him／her／us／them；Is it yours?与Does it belong to you?可表达同一归属询问。',
'Whose is it?／Whose are they?按物品单复数选择。对话中的my／your随说话人变化；our／ours要先确定“我们”包括谁。98课B按示例肯定回应；涉及our时，先与老师约定双方是否同属拥有者群体。',
'’s不能只看符号：It’s a case中的’s是is；It’s got a zip中的’s是has；Hall’s case中的’s表示所有格。the other day只说几天前，不给出确定日期。',
'本人的David Hall与服务员读出的D. N. Hall按原文分别保留，不猜N的展开。地址与金额是教材中的资料，不作为当前收费或真实个人地址收集任务。结尾说给错了箱子，不补写真正主人或后来找回。'
];
unit.learning.MODEL_TITLE='课本小参考 · 归属问句与12种物品';
unit.learning.OWNERSHIP_MODELS=[['belong to问法','be问法'],['Does this belong to me?','Is this mine?'],['Does this belong to you?','Is this yours?'],['Does this belong to him?','Is this his?'],['Does this belong to her?','Is this hers?'],['Do these belong to us?','Are these ours?'],['Do these belong to you?','Are these yours?'],['Do these belong to them?','Are these theirs?']];
unit.learning.MODELS=['keys','letter','clothes','passport','tickets','watch','flowers','boat','phrasebook','hammers','car','pens'].map(en=>{const w=WORDS.find(w=>w.en===en);return{en,cn:w.cn,image:w.image};});
unit.learning.WRITING=[
{title:'A · 选用合适的所有格代词',instruction:'保留课本6题。根据前句主人和后句物品选择完整表达，不把主人数量与物品数量混在一起。',examples:['This dress belongs to my sister. It is hers.'],items:['These things belong to my husband. They ________.','This coat belongs to me. It ________.','These shoes belong to my wife. They ________.','These books belong to my brother and me. They ________.','These pens belong to Tom and Jill. The pens ________.','This suitcase belongs to you. It ________.']},
{title:'B · 用两种方式肯定回应',instruction:'保留课本9题。按例子用be＋所有格代词和belong to＋宾格回答。第8题的our要先约定答话人是否也属于这个群体；不同对话视角可以有不同合理答案。',examples:['Are these your keys? → Yes, they’re mine. They belong to me.','Is this John’s letter? → Yes, it’s his. It belongs to him.','Are these my clothes? → Yes, they’re yours. They belong to you.'],items:['Is this Jane’s passport?','Are these their tickets?','Is this your watch?','Are these her flowers?','Is this my boat?','Is this Jim’s phrasebook?','Are these hammers Frank’s and Gary’s?','Is this our car?','Are these the children’s pens?']}
];
core.unit9798=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit9798,excerpts={"u9798-v1-r-left":[0],"u9798-v1-r-description":[1,2],"u9798-v1-r-first":[3,4],"u9798-v1-r-label":[1,2],"u9798-v1-r-name":[7,8,9],"u9798-v1-r-fee":[10,11,12],"u9798-v1-r-ending":[13,14,15],"u9798-v1-r-question":[13,14,15],"u9798-v1-e-ending":[13,14,15],"u9798-v1-e-label":[7,8,9,10,11,12,13,14,15]},speakers={"hall":"Mr. Hall","attendant":"服务员"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 97',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
