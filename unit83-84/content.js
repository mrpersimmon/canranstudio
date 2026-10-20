(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit83-84/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页170–173／PDF203–206';
const grammarSource='《同步导学》Grammar纸页146–147／PDF160–161；《语法练习册》纸页236–242／PDF250–256';
const rows=[
['mess','杂乱；凌乱','/mes/','mess'],['pack','打包；收拾行李','/pæk/','pack'],['suitcase','手提箱；行李箱','/ˈsuːtkeɪs/','suitcase'],['leave','离开','/liːv/','leave'],['already','已经','/ɔːlˈredi/','already'],['just','刚刚','/dʒʌst/','just'],
['yet','还；尚（常用于否定和疑问）','/jet/','yet'],['ever','曾经（常用于询问经历）','/ˈevə/','ever'],['never','从来没有','/ˈnevə/','never'],['before','以前','/bɪˈfɔː/','before'],['untidy','不整齐的；凌乱的','/ʌnˈtaɪdi/','mess'],['living room','客厅','/ˈlɪvɪŋ ruːm/','room'],
['fruit','水果','/fruːt/','fruit'],['bananas','香蕉（复数）','/bəˈnɑːnəz/','bananas'],['oranges','橙子（复数）','/ˈɒrɪndʒɪz/','oranges'],['peaches','桃子（复数）','/ˈpiːtʃɪz/','peaches'],['apples','苹果（复数）','/ˈæpəlz/','apples'],['vegetables','蔬菜（复数）','/ˈvedʒtəblz/','vegetables'],
['lettuce','生菜','/ˈletɪs/','lettuce'],['cabbage','卷心菜','/ˈkæbɪdʒ/','cabbage'],['peas','豌豆（复数）','/piːz/','peas'],['beans','豆子（复数）','/biːnz/','beans'],['meat','肉','/miːt/','meat'],['beef','牛肉','/biːf/','beef'],
['lamb','羊羔肉；羔羊','/læm/','lamb'],['steak','牛排','/steɪk/','steak'],['chicken','鸡肉；鸡','/ˈtʃɪkɪn/','chicken'],['milk','牛奶','/mɪlk/','milk'],['tea','茶','/tiː/','tea'],['coffee','咖啡','/ˈkɒfi/','coffee'],
['wine','葡萄酒','/waɪn/','wine'],['beer','啤酒','/bɪə/','beer'],['packed','pack的过去式和过去分词','/pækt/','pack'],['had','have的过去式和过去分词','/hæd/','already'],['lived','live的过去式和过去分词','/lɪvd/','room'],['holiday','假期','/ˈhɒlədeɪ/','suitcase']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit83-84',version:1,contentRevision:'holiday-present-perfect-v1',mode:'classroom',title:'出发前的行李箱',path:'/unit83-84/',start:'learn/words',progress:{learningKey:'canran:unit83-84:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识行前词语',activities:[['words','行前小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'看看谁要去度假',activities:[['text','行李箱小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'发现过去和现在的联系',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'整理行前记录',activities:[['apply','行前小帮手','give']],required:['apply']},
{id:'l5',title:'完成行前挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'holiday-present-perfect-v1',title:'行前表达小达人',lesson:'Lesson 83–84',scene:'/assets/unit83-84/keepsake-story-v1.webp',alt:'Carol把蓝衬衫放进行李箱，Tom和来访的Sam聊假期',color:'#69856a',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','行前小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={carol:'Carol',tom:'Tom',sam:'Sam'};
unit.learning.DIALOGUE=[
['carol','Hello, Sam. Come in.','你好，萨姆。请进。'],
['tom','Hi, Sam. We’re having lunch. Do you want to have lunch with us?','嗨，萨姆。我们正在吃午饭。你愿意和我们一起吃午饭吗？'],
['sam','No, thank you, Tom. I’ve already had lunch. I had lunch at half past twelve.','不，谢谢你，汤姆。我已经吃过午饭了。我十二点半吃的午饭。'],
['carol','Have a cup of coffee then.','那么喝杯咖啡吧。'],
['sam','I’ve just had a cup, thank you. I had one after my lunch.','我刚喝过一杯，谢谢。我吃完午饭后喝了一杯。'],
['tom','Let’s go into the living room, Carol. We can have our coffee there.','卡罗尔，我们到客厅去吧。我们可以在那里喝咖啡。'],
['carol','Excuse the mess, Sam. This room’s very untidy. We’re packing our suitcases. We’re going to leave tomorrow. Tom and I are going to have a holiday.','萨姆，请原谅这里这么乱。这个房间很不整齐。我们正在收拾行李箱。我们打算明天出发。汤姆和我打算去度假。'],
['sam','Aren’t you lucky!','你们真幸运啊！'],
['tom','When are you going to have a holiday, Sam?','萨姆，你打算什么时候去度假？'],
['sam','I don’t know. I’ve already had my holiday this year.','我不知道。我今年已经休过假了。'],
['carol','Where did you go?','你去了哪里？'],
['sam','I stayed at home!','我待在家里了！']
].map(([who,text,cn],i)=>({id:'u8384-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u8384-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-pack','行李核心动作','“收拾行李箱”中的收拾，用哪个词？',choice(['pack','leave','stay'],'pack',{image:image('pack'),imageAlt:'把折好的衣服收进行李箱'}),'pack a suitcase是收拾行李箱。'),
q('v-core','核心物件与状态','配好这三个词。',match([['suitcase','行李箱'],['mess','杂乱'],['leave','离开']]),'suitcase是行李箱；mess是杂乱；leave是离开。'),
q('v-already','完成时间副词','“I’ve already had lunch.” 中already的意思是？',choice(['已经','明天','从来没有'],'已经'),'already表示已经。'),
q('v-just','just的当前语境','“I’ve just had a cup.” 中just表示？',choice(['刚刚','每天','明天'],'刚刚'),'这里just表示刚刚发生。'),
q('v-food','食物词义','把食物配好。',match([['peaches','桃子'],['lettuce','生菜'],['beans','豆子']]),'分清这三种食物。'),
q('v-picture','蔬菜图像辨认','哪张图表示cabbage？',choice(['cabbage','peas','steak'],'cabbage',{optionImages:{cabbage:image('cabbage'),peas:image('peas'),steak:image('steak')}}),'cabbage是卷心菜。'),
q('v-room','场景词义','“This room’s very untidy.” 说房间怎样？',choice(['很凌乱','很安静','很宽敞'],'很凌乱'),'untidy是不整齐的。'),
q('v-number','84大数读法','课本格子标注的18,000应读作？',choice(['eighteen thousand','eighty thousand','eight thousand'],'eighteen thousand',{context:'Number label: 18,000'}),'18,000是eighteen thousand；这是数字标注，不是咖啡的数量。')
];
unit.questions.roles=[
q('r-lunch','读懂婉拒原因','Sam为什么不和Tom一起吃午饭？',choice(['他已经吃过午饭','他不喜欢Tom做的饭','他明天才来'],'他已经吃过午饭'),'I’ve already had lunch。'),
q('r-time','读懂明确过去时间','Sam几点吃的午饭？',choice(['十二点半','十二点','一点半'],'十二点半'),'at half past twelve。'),
q('r-coffee','读懂事件先后','Sam是什么时候喝的咖啡？',choice(['吃完午饭后','吃午饭前','还没喝过'],'吃完午饭后'),'I had one after my lunch。'),
q('r-mess','场景与行动因果','房间为什么很乱？',choice(['Carol和Tom正在收拾行李箱','Sam把咖啡打翻了','他们刚开过聚会'],'Carol和Tom正在收拾行李箱'),'We’re packing our suitcases。'),
q('r-plan','区分已做与计划','课文里，哪件事还只是之后的计划？',choice(['Carol和Tom明天出发','Sam吃午饭','Sam今年休过假'],'Carol和Tom明天出发'),'going to leave tomorrow表示打算明天出发。'),
q('r-lucky','感叹句语用','“Aren’t you lucky!” 在这里表达什么？',choice(['你们真幸运啊','你们一点也不幸运','你们已经回家了'],'你们真幸运啊'),'这是表达羡慕的感叹。'),
q('r-ending','不为结尾编造旅行','Sam今年的假期在哪里度过？',choice(['在家里','在海边','在国外'],'在家里'),'I stayed at home!；课文没有说他去了别的地方。')
];
unit.questions.grammar=[
g('result','过去完成对现在的影响','“I’ve packed my suitcase.” 现在的行李箱怎样？',choice(['已经收拾好，可以带走','还完全没收拾','正在商店出售'],'已经收拾好，可以带走'),'现在完成时可以把过去做的事与现在的结果连起来。','留意现在的结果。',model(['I’ve had lunch.','已吃过午饭，现在不需要再吃。'])),
g('continue','从过去持续至今','“She has lived here for five years.” 表示哪种情况？',choice(['她五年前搬来，现在仍住这里','她五年前已经搬走','她明年才搬来'],'她五年前搬来，现在仍住这里'),'现在完成时也可以表示从过去持续到现在，不一定已经结束。','for five years是持续五年。',model(['I have lived here for three years.','三年前开始住，现在还住这里。'])),
g('auxiliary','have与has主语一致','两个人都已经打包。填好开头。',fill([blank('I','packed my suitcase.',['have','has']),blank('She','packed her suitcase.',['has','have'])],['have','has']),'I／you／we／they用have，he／she／it用has；后面接过去分词。','先看每句主语。',model(['They have packed. / He has packed.','have／has＋过去分词'])),
g('verb','助动词与实义动词区分','“We have had lunch.” 哪个词帮助构成现在完成时？',{type:'locate',fragments:['We ',{value:'have'},' ',{value:'had'},' ',{value:'lunch'},'.'],options:['have','had','lunch'],answer:'have'},'第一个have是助动词；had是have的过去分词，这里表示吃。','哪个词放在过去分词前？',model(['They have packed.','have帮助构成时态，packed说做了什么。'])),
g('regular','规则过去分词','行李已经收好了。',fill([blank('We have','our suitcases.',['packed','pack','packing'])],['packed']),'规则动词pack的过去分词是packed，与它的过去式相同。','have后需要过去分词。',model(['She has cleaned the room.','规则变化：clean → cleaned'])),
g('irregular','不规则过去分词had','她已经吃过午饭。',fill([blank('She has','lunch.',['had','have','has'])],['had']),'have的过去分词是不规则形式had。','has后不能再用has。',model(['I have had a meal.','have → had → had'])),
g('already','already常见位置','我已经收拾好行李箱了。',bank(['I','have','already','packed','my suitcase','packing'],'I have already packed my suitcase',5),'already常放在have／has后、过去分词前。','already表示已经。',model(['She has already had lunch.','has → already → had'])),
g('just','just表达刚刚完成','“He has just had some milk.” 这件事怎样了？',choice(['他刚刚喝过牛奶','他从没喝过牛奶','他计划明天喝牛奶'],'他刚刚喝过牛奶'),'just在这里表示刚刚。','动作离现在很近。',model(['I have just packed.','我刚刚收拾好。'])),
g('negative','现在完成时否定','我还没有吃午饭。补好两个位置。',fill([blank('I','not',['have','am','do']),blank('','lunch yet.',['had','have','having'])],['have','had']),'否定：have／has＋not＋过去分词；haven’t＝have not。','not前用助动词，后面保留过去分词。',model(['She has not had lunch yet.','hasn’t＝has not；yet常放句末。'])),
g('question','现在完成时一般疑问句','她吃过午饭了吗？',bank(['Has','she','had','lunch','yet','Have'],'Has she had lunch yet',5,'?'),'把has放到主语前，保留过去分词had。','她用has。',model(['Have you packed your suitcase yet?','Have／Has＋主语＋过去分词…?'])),
g('yes','肯定简答呼应have','他们确实收拾好了。回答“Have they packed?”',choice(['Yes, they have.','Yes, they did.','Yes, they are.'],'Yes, they have.'),'Have提问，简答用have。','不需要把后面的全部动作重复。',model(['Has she had lunch? — Yes, she has.','has提问，用has回应。'])),
g('no','否定简答呼应has','他还没有吃午饭。回答“Has he had lunch?”',choice(['No, he hasn’t.','No, he didn’t.','No, he isn’t.'],'No, he hasn’t.'),'Has提问，否定简答用hasn’t。','按照事实回答。',model(['Have they packed? — No, they haven’t.','have提问，用haven’t否定。'])),
g('yet','yet用于未完成','她还没有收拾好。补上“还”。',fill([blank('She hasn’t packed her suitcase',' .',['yet','already','never'])],['yet']),'表示“还没有”时，yet常放在否定句句末。','看句末的位置。',model(['I haven’t had breakfast yet.','我还没有吃早饭。'])),
g('any','一般否定句any','我还没有吃任何蔬菜。',fill([blank('I haven’t had','vegetables yet.',['any','a','one'])],['any']),'这类否定句中用any；不是用一个one来代替蔬菜。','这里说任何蔬菜都没吃。',model(['I have had some fruit.','肯定句里常用some。'],['I haven’t had any fruit.','一般否定句里常用any。'])),
g('substitute','one与some替代食物','已吃过一个苹果、喝过一些牛奶。各用一个词代替食物。',fill([blank('An apple? I’ve already had',' .',['one','some']),blank('Milk? I’ve already had',' .',['some','one'])],['one','some']),'one代替一个可数物；some代替这里的一些牛奶。','看原来是一个还是一些。',model(['A peach? I’ve had one.','one代替一个桃子。'],['Tea? I’ve had some.','some代替一些茶。'])),
g('ever','ever询问曾经的经历','你曾经在这儿住过吗？',fill([blank('Have you','lived here?',['ever','never','yet'])],['ever']),'ever可以表示曾经，询问到现在为止的经历。','这是问曾经有没有。',model(['Have you ever visited this town?','你曾经到访过这个镇吗？'])),
g('never','never本身含否定','要说“我从来没住过这里”，哪个词应去掉？',{type:'locate',fragments:['I have ',{value:'not'},' ',{value:'never'},' ',{value:'lived'},' here.'],options:['not','never','lived'],answer:'not'},'never已经表示从来没有，不再叠加not。','只保留一个否定。',model(['I have never lived here.','never本身表示从来没有。'])),
g('before','before与缩略形式','句子“She’s lived here before.”中的She’s是什么？',choice(['She has','She is','She was'],'She has'),'后面是过去分词lived，She’s在这里是She has；before表示以前。','结合后面的动词判断，不能见到’s就认成is。',model(['I’ve lived here before.','I’ve＝I have；before表示以前。'],['She’s packed her bag.','这里She’s＝She has。'])),
g('time','具体过去时间与现在结果','同一次午饭，哪两句搭配正确？',choice(['I’ve had lunch. I had it at twelve.','I’ve had lunch. I have had it at twelve yesterday.','I’m having lunch. I had it tomorrow.'],'I’ve had lunch. I had it at twelve.'),'已吃过着眼现在的结果；说明过去十二点吃的，用一般过去时had。'),
g('contract','独立识别have缩略','“They’ve already packed.”中的They’ve是什么？',choice(['They have','They are','They were'],'They have'),'They’ve＝They have。'),
g('independent-question','撤去示范构造完成时问句','你收拾好行李箱了吗？',bank(['Have','you','packed','your suitcase','yet','Did'],'Have you packed your suitcase yet',5,'?'),'Have提前，packed用过去分词，yet放句末。'),
g('independent-continue','撤去示范识别持续含义','“We have lived here for ten years.” 现在呢？',choice(['我们现在仍住在这里','我们十年前已经搬走','我们还没有搬来'],'我们现在仍住在这里'),'从过去一直持续到现在，是现在完成时的一种含义。')
];
unit.questions.apply=[
q('a-case','根据完成事实汇报当前结果','行李已收好。告诉朋友可以出发了。',choice(['I’ve packed my suitcase.','I haven’t packed my suitcase yet.','I am going to pack tomorrow.'],'I’ve packed my suitcase.',{context:'My checklist\nPack the suitcase ✓ done\nThe suitcase is ready.'}),'已经收拾好，用I’ve packed说明现在的结果。'),
q('a-lunch','依据事实婉拒再次吃东西','你12:30已吃完午饭，现在不需要再吃。',choice(['No, thank you. I’ve already had lunch.','No, thank you. I haven’t had lunch yet.','Yes, I have never had lunch.'],'No, thank you. I’ve already had lunch.',{context:'Lunch finished: 12:30\nNow: 13:00\nFriend: Have lunch with us!'}),'先礼貌谢绝，再用已经吃过说明原因。'),
q('a-milk','把刚刚完成的活动登记在记录上','你刚喝过牛奶。拼好记录。',bank(['I','have','just','had','some milk','have had'],'I have just had some milk',5),'just放在have与had之间，表示刚刚喝过。'),
q('a-contrast','84B双句对比已做与未做','记录：豌豆没吃过，豆子刚吃过。补好两句。',{...fill([blank('I','had any peas.',['haven’t','have']),blank('I’ve just had','beans.',['some','any'])],['haven’t','some']),context:'Peas ✗ not eaten\nBeans ✓ just eaten'},'否定用haven’t…any；肯定用just…some。'),
q('a-one','84A一个可数物替代','你已经吃过一个桃子。礼貌谢绝再来一个。',choice(['No, thanks. I’ve already had one.','No, thanks. I’ve already had some.','No, thanks. I have one tomorrow.'],'No, thanks. I’ve already had one.',{context:'A peach ✓ already eaten\nFriend: Have a peach.'}),'one在这里代替a peach。'),
q('a-check','检查记录后准确回答','朋友问：“Has Ben packed his suitcase yet?”',choice(['No, he hasn’t.','Yes, he has.','No, he didn’t.'],'No, he hasn’t.',{context:'Ben’s checklist\nEat lunch ✓\nPack the suitcase ✗ not done'}),'吃过午饭不等于收拾好行李；Has提问用hasn’t回答。'),
q('a-time','完成情况和过去钟点分别回答','问题与合适的回答配好。',match([['Have you had lunch?','Yes, I have.'],['When did you have lunch?','At half past twelve.'],['Have you packed your suitcase?','No, I haven’t.']]),'Have问完成情况，When did问过去发生的时间。'),
q('a-stay','持续状态的信息核对','Mia五年前搬来，一直住到现在。哪句适合介绍她？',choice(['She has lived here for five years.','She left here five years ago.','She will live here in five years.'],'She has lived here for five years.',{context:'Mia moved here five years ago.\nShe still lives here now.'}),'从过去延续到现在，用has lived…for five years。')
];
unit.questions.exam=[
q('e-words','核心词义独立抽样','配好行前词语。',match([['pack','打包'],['suitcase','行李箱'],['mess','杂乱']]),'pack是动作，suitcase是物品，mess是凌乱状态。'),
q('e-number','84大数迁移','课本数字20,000怎样读？',choice(['twenty thousand','two thousand','twelve thousand'],'twenty thousand'),'20,000读twenty thousand。'),
q('e-story','故事事实和未发生的计划','哪项符合课文？',choice(['Carol和Tom正在收拾行李，打算明天出发','Carol和Tom已经从海边回来了','Sam明天要和他们一起去国外'],'Carol和Tom正在收拾行李，打算明天出发'),'课文只说明明天出发的计划，没有说目的地或Sam同行。'),
q('e-ending','故事结尾独立理解','Sam说自己今年已经休过假。那时他在哪儿？',choice(['在家里','在海边','在餐馆度假'],'在家里'),'I stayed at home!。'),
q('e-meal','故事事件先后与钟点','Sam的哪条记录正确？',choice(['12:30吃午饭，之后喝了一杯咖啡','12:30喝咖啡，之后还没吃午饭','和Tom、Carol一起吃了这次午饭'],'12:30吃午饭，之后喝了一杯咖啡'),'两句过去时交代吃饭时间和喝咖啡的先后。'),
q('e-result','完成时当前结果','“I’ve cleaned my room.” 在这个情境里说明什么？',choice(['房间已打扫好，现在是干净的','房间明天才开始打扫','房间一直没有打扫'],'房间已打扫好，现在是干净的'),'过去打扫的动作与现在干净的结果相连。'),
q('e-continue','持续用法独立理解','“He has lived here for two years.” 指什么？',choice(['他两年前搬来，现在仍住这儿','他两年前已经搬走','他两年以后才搬来'],'他两年前搬来，现在仍住这儿'),'现在完成时也可以表示持续到现在。'),
q('e-form','主语与完成时助动词','他们已经整理好房间。',fill([blank('They','cleaned the room.',['have','has','are'])],['have']),'They后用have，再接过去分词cleaned。'),
q('e-participle','had过去分词','她已经吃过一些水果。',fill([blank('She has','some fruit.',['had','has','having'])],['had']),'have的过去分词是had。'),
q('e-auxiliary','完成时中have作用','“I have had some tea.” 中哪个词帮助构成现在完成时？',{type:'locate',fragments:['I ',{value:'have'},' ',{value:'had'},' some ',{value:'tea'},'.'],options:['have','had','tea'],answer:'have'},'have是助动词，had表示喝过。'),
q('e-negative','完成时否定独立两空','她还没有吃午饭。',fill([blank('She','not',['has','is','does']),blank('','lunch yet.',['had','have','having'])],['has','had']),'has not＋过去分词had。'),
q('e-question','独立构造Has问句','Ben收拾好行李了吗？',bank(['Has','Ben','packed','his suitcase','yet','Have'],'Has Ben packed his suitcase yet',5,'?'),'Ben用Has，后面保留packed。'),
q('e-reply','根据真实完成情况简答','两人已经吃过午饭。回答“Have they had lunch?”',choice(['Yes, they have.','Yes, they did.','Yes, they had.'],'Yes, they have.'),'Have提问，用have简答。'),
q('e-already','already位置迁移','我们已经吃过晚饭了。',bank(['We','have','already','had','dinner','having'],'We have already had dinner',5),'already在have与had之间。'),
q('e-just','just含义迁移','“She has just packed.” 说明她怎样了？',choice(['刚刚收拾好','还没开始收拾','每天都会收拾'],'刚刚收拾好'),'just表示刚刚。'),
q('e-yet','yet句末独立应用','他们还没有吃早饭。',fill([blank('They haven’t had breakfast',' .',['yet','already','never'])],['yet']),'yet表示还，常用于这类否定句末。'),
q('e-ever','ever询问经历','他曾经到访过这个镇吗？',fill([blank('Has he','visited this town?',['ever','never','yet'])],['ever']),'ever用来问曾经的经历。'),
q('e-never','never否定含义独立纠错','要说“她从没住过这里”，哪个词多余？',{type:'locate',fragments:['She has ',{value:'not'},' ',{value:'never'},' ',{value:'lived'},' here.'],options:['not','never','lived'],answer:'not'},'never自身含否定，不再叠加not。'),
q('e-before','before过去经历','“I’ve visited this town before.” 表示什么？',choice(['我以前到访过这个镇','我明天第一次去这个镇','我现在还没出发'],'我以前到访过这个镇'),'before在这里表示以前。'),
q('e-time','现在完成时与一般过去时区别','今天午饭已经吃过；补充说昨天午饭在一点吃的。',fill([blank('I have had lunch today. I','lunch at one yesterday.',['had','have had','having'])],['had']),'明确说yesterday的过去事件用一般过去时。'),
q('e-contract','has缩略不机械等同is','“He’s already had lunch.” 里的He’s是？',choice(['He has','He is','He was'],'He has'),'后面是had，这里是He has的缩略。'),
q('e-any','否定句any','你还没有吃任何水果。',fill([blank('You haven’t had','fruit yet.',['any','one','a'])],['any']),'这类否定句用any。'),
q('e-one','one替代一个可数物','你已经吃过一个橙子。“Have an orange.”',choice(['No, thanks. I’ve already had one.','No, thanks. I’ve already had some.','No, thanks. I haven’t had any.'],'No, thanks. I’ve already had one.'),'one代替an orange。'),
q('e-some','some替代一些不可数物','你已经喝过一些牛奶。“Have some milk.”',choice(['No, thanks. I’ve already had some.','No, thanks. I’ve already had one.','No, thanks. I have milk tomorrow.'],'No, thanks. I’ve already had some.'),'some代替some milk。'),
q('e-transfer','84B新食物双句迁移','按记录写：苹果没吃，橙子刚吃。',{...fill([blank('We','had any apples.',['haven’t','have']),blank('We’ve just had','oranges.',['some','any'])],['haven’t','some']),context:'Apples ✗ not eaten\nOranges ✓ just eaten'},'第一句否定用haven’t…any，第二句肯定用just…some。'),
q('e-regular','规则过去分词独立纠错','她已打好包，哪个词应改成packed？',{type:'locate',fragments:[{value:'She'},' ',{value:'has'},' ',{value:'pack'},' her bag.'],options:['She','has','pack'],answer:'pack'},'has后要用过去分词packed。'),
q('e-check','根据材料否定简答','“Has Amy packed her suitcase yet?”',choice(['No, she hasn’t.','Yes, she has.','No, she didn’t.'],'No, she hasn’t.',{context:'Amy has had lunch.\nShe has not packed her suitcase yet.'}),'吃过饭与收拾好行李是两件事，必须按行李的事实回答。'),
q('e-meaning','两种完成时含义的综合区分','按句子表达的意思配好。',match([['I have packed my suitcase.','过去做好，现在已准备妥当'],['I have lived here for six years.','从过去开始，一直持续到现在'],['I packed my suitcase yesterday.','明确说昨天发生的事']]),'现在完成时不只表达已经结束，也可表达延续至今；明确过去时间用一般过去时。')
];
unit.learning.MATERIALS=rows.slice(12,32).map(([en,cn,,art],i)=>({en,cn,art,number:(i+1)*1000}));
unit.learning.REFERENCE=[
'现在完成时：have／has＋过去分词。I／you／we／they用have，he／she／it用has。规则动词过去分词通常与过去式相同；不规则词需按词学习，如have–had–had、leave–left–left。',
'含义一：过去的事影响现在。I’ve had lunch.表示已吃过午饭，现在不需要再吃。含义二：从过去一直持续到现在。She has lived here for five years.表示住了五年，现在还住这里。不能把“完成时”都理解成动作已经结束。',
'否定：I have not packed.／She has not packed.。缩略have not＝haven’t，has not＝hasn’t。问句Have you packed?／Has she packed?；Yes, I have.／No, she hasn’t.。',
'缩略：I’ve＝I have，they’ve＝they have；She’s packed…里的She’s＝She has。She’s happy里的She’s＝She is；要看上下文，不能把所有’s固定解释成一个词。',
'already已经、just刚刚，常放在have／has与过去分词之间；yet还、尚，常用于否定或疑问句末。ever曾经常用于询问经历；never从来没有，自身含否定；before以前。',
'一般肯定句常用some，否定、疑问句常用any；描述已经吃过一个苹果可用had one，已经喝过一些牛奶可用had some。邀请Have some…中的some另有语用，不把这些规律写成绝对禁令。',
'现在的结果：I’ve already had lunch.；具体过去时间：I had lunch at half past twelve.。同一事件可以换角度表达；明确说yesterday等过去时间用一般过去时，不机械按中文“了”选时态。',
'课本数字栏1,000–20,000用来练习大数读法，不代表插图里有几千份食物。课本保留wine、beer等成人词汇；儿童任务使用食物、牛奶和水。'
];
unit.learning.WRITING_A_EXAMPLES=['Have some coffee. → I’ve already had some.','Have a banana. → I’ve already had one.'];
unit.learning.WRITING_A=['Have some beer.','Have an apple.','Have a peach.','Have some milk.','Have a glass of water.','Have a biscuit.','Have some cheese.'];
unit.learning.WRITING_B_EXAMPLES=['Have you had any vegetables or fruit? (I) → I haven’t had any vegetables. I’ve just had some fruit.'];
unit.learning.WRITING_B=[['Has he had any beans or peas?','He'],['Have they had any tea or coffee?','They'],['Have you had any apples or peaches?','I'],['Have you had any cabbage or lettuce?','I'],['Has she had any beer or wine?','She'],['Has he had any lamb or beef?','He'],['Have they had any tea or milk?','They'],['Has she had any meat or vegetables?','She'],['Have you had any chicken or steak?','I'],['Have they had any bananas or oranges?','They']];
core.unit8384=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit8384,excerpts={"u8384-v1-r-lunch":[1,2],"u8384-v1-r-time":[1,2],"u8384-v1-r-coffee":[3,4],"u8384-v1-r-mess":[5,6],"u8384-v1-r-plan":[5,6],"u8384-v1-r-lucky":[5,6,7],"u8384-v1-r-ending":[8,9,10,11],"u8384-v1-e-story":[0,1,2,3,4,5,6,7,8,9,10,11]},speakers={"carol":"Carol","tom":"Tom","sam":"Sam"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 83',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
