(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit121-122/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页246–249／PDF279–282',grammarSource='《同步导学》Grammar纸页200／PDF214；《语法练习册》纸页355–360／PDF369–374';
const rows=[
['customer','顾客','/ˈkʌstəmə/','customer'],['forget','忘记','/fəˈɡet/','forget'],['manager','经理','/ˈmænɪdʒə/','manager'],['serve','接待；服务','/sɜːv/','serve'],['counter','柜台','/ˈkaʊntə/','counter'],['recognize','认出','/ˈrekəɡnaɪz/','recognize'],
['road','路','/rəʊd/','road'],['dictionary','词典','/ˈdɪkʃənəri/','dictionary'],['expensive','昂贵的','/ɪkˈspensɪv/','expensive'],['hat','帽子','/hæt/','hat'],['gentleman','先生；绅士','/ˈdʒentlmən/','gentleman'],['put on','穿上；戴上','/pʊt ɒn/','put-on'],
['wear','穿着；戴着','/weə/','wear'],['behind','在……后面','/bɪˈhaɪnd/','behind'],['remember','记得；想起','/rɪˈmembə/','remember'],['repair','修理','/rɪˈpeə/','repair'],['carry','携带；搬运','/ˈkæri/','carry'],['basket','篮子','/ˈbɑːskɪt/','basket'],
['man','男人','/mæn/','man'],['woman','女人','/ˈwʊmən/','woman'],['buy','买','/baɪ/','buy'],['half an hour','半小时','/hɑːf ən ˈaʊə/','half-hour'],['straight away','马上；立即','/streɪt əˈweɪ/','straight-away']
];
const castArt={customer:'customer',manager:'manager',gentleman:'customer-hat',man:'customer',woman:'caroline'};
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:castArt[art]?'/assets/unit121-122/'+castArt[art]+'.webp':image(art)}));
const unit={id:'unit121-122',version:1,contentRevision:'hat-recognition-v1',mode:'classroom',title:'书店里的帽子',path:'/unit121-122/',start:'learn/words',progress:{learningKey:'canran:unit121-122:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识书店里的词语',activities:[['words','书店小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'读懂帽子的线索',activities:[['text','书店小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清是哪一个',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'按线索整理记录',activities:[['apply','线索小记录员','give']],required:['apply']},
{id:'l5',title:'完成描述挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'hat',storyQuestion:'Why didn’t Caroline recognize the customer straight away?（为什么Caroline没有马上认出顾客？）',completionTitles:{listen:'书店词语认清啦！',roles:'帽子的线索读懂啦！',grammar:'是哪一个说清啦！',apply:'线索记录整理啦！',exam:'描述挑战完成！'},reward:{edition:'hat-recognition-v1',title:'线索描述小达人',lesson:'Lesson 121–122',scene:'/assets/unit121-122/keepsake-story-v1.webp',alt:'顾客戴上帽子，Caroline认出了他，经理在旁核对',color:'#8d8d72',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','线索小记录员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={customer:'Customer',manager:'Manager',caroline:'Caroline'};
unit.learning.DIALOGUE=[
['customer','I bought two expensive dictionaries here half an hour ago, but I forgot to take them with me.','半小时前我在这里买了两本很贵的词典，但忘了把它们带走。'],
['manager','Who served you, sir?','是谁接待您的，先生？'],
['customer','The lady who is standing behind the counter.','站在柜台后面的那位女士。'],
['manager','Which books did you buy?','您买的是哪几本书？'],
['customer','The books which are on the counter.','就是柜台上的那两本书。'],
['manager','Did you serve this gentleman half an hour ago, Caroline? He says he’s the man who bought these books.','Caroline，半小时前你接待过这位先生吗？他说他就是买这两本书的人。'],
['caroline','I can’t remember. The man who I served was wearing a hat.','我想不起来了。我接待的那个人当时戴着帽子。'],
['manager','Have you got a hat, sir?','先生，您有帽子吗？'],
['customer','Yes, I have.','有，我有帽子。'],
['manager','Would you put it on, please?','请您把它戴上好吗？'],
['customer','All right.','好吧。'],
['manager','Is this the man that you served, Caroline?','Caroline，这就是你接待过的那个人吗？'],
['caroline','Yes. I recognize him now.','是的。我现在认出他了。']
].map(([who,text,cn],i)=>({id:'u121122-line'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines}),ctx=(input,context)=>({...input,context});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u121122-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-counter','识别柜台','哪个词表示柜台？',choice(['counter','dictionary','basket'],'counter',{optionImages:{counter:image('counter'),dictionary:image('dictionary'),basket:image('basket')}}),'counter在本课指商店柜台。'),
q('v-roles','服务情境词义','配好三个词。',match([['customer','顾客'],['manager','经理'],['serve','接待；服务']]),'customer来购物，manager负责管理，serve在本课指接待。'),
q('v-actions','全部新词词义','配好三个词。',match([['forget','忘记'],['recognize','认出'],['road','路']]),'forget与recognize不是同一个动作；road是道路。'),
q('v-expensive','expensive不等于具体价格','two expensive dictionaries明确说明什么？',choice(['两本很贵的词典，具体价格未给','两本免费的词典','两顶很贵的帽子'],'两本很贵的词典，具体价格未给'),'expensive表示贵，不提供可计算的金额。'),
q('v-forgot','forget的过去式','用forget的过去式报告那次忘记。',fill([blank('I','to take them with me.',['forgot','forgotten','forgetted'])],['forgot']),'forget—forgot—forgotten，过去式是forgot。'),
q('v-put','穿戴动作与状态','put on a hat重点表示什么？',choice(['把帽子戴上的动作','已经戴着帽子的状态','把帽子卖给别人'],'把帽子戴上的动作'),'put on强调戴上，wear强调戴着。'),
q('v-half','半小时的长度','half an hour是多长时间？',choice(['30分钟','15分钟','60分钟'],'30分钟'),'半个小时是30分钟；原文没给购买的绝对钟点。'),
q('v-locate','原文词义定位','点出表示“马上”的词组。',{type:'locate',fragments:['Why didn’t Caroline ',{value:'recognize'},' the customer ',{value:'straight away'},'?'],options:['recognize','straight away'],answer:'straight away'},'straight away是马上、立即。')
];
unit.questions.roles=[
q('r-purchase','购买与忘记带走分开','顾客说自己忘了什么？',choice(['把买好的两本词典带走','购买两本词典','付钱买一顶帽子'],'把买好的两本词典带走',{context:'I bought two expensive dictionaries here half an hour ago, but I forgot to take them with me.'}),'买过和带走是不同动作；forgot to take不改成forgot to buy。'),
q('r-server','按身份与位置找接待者','顾客指的是哪位接待者？',choice(['Caroline，那位站在柜台后面的女士','经理本人','未出现的邮递员'],'Caroline，那位站在柜台后面的女士',{context:'Customer: The lady who is standing behind the counter.\nManager: Did you serve this gentleman half an hour ago, Caroline?'}),'结合位置描述和经理对Caroline的问话确认人物。'),
q('r-books','保留物品位置','顾客说词典在哪里？',choice(['在柜台上','在柜台后面的地板上','已经在他手中'],'在柜台上',{context:'Manager: Which books did you buy?\nCustomer: The books which are on the counter.'}),'on是柜台上，behind描述的是女士的位置。'),
q('r-claim','转述者与买书人分开','He says he’s the man…中声称买书的是谁？',choice(['顾客','正在转述的经理','Caroline'],'顾客',{context:'Manager asks Caroline: “Did you serve this gentleman…? He says he’s the man who bought these books.”'}),'经理转述顾客的话，不把经理变成买书人。'),
q('r-hat','回答教材开场问题','为什么Caroline起初没马上认出顾客？',choice(['她记得接待的是戴帽子的人，而眼前顾客尚未戴上帽子','她已经证实顾客从没来过','她说自己不认识任何戴帽子的人'],'她记得接待的是戴帽子的人，而眼前顾客尚未戴上帽子',{context:'Caroline: I can’t remember. The man who I served was wearing a hat.\nManager: Have you got a hat, sir? … Would you put it on, please?'}),'结合记忆中的帽子和请他戴上的请求理解，不推断她的健康或能力。'),
q('r-pronouns','核对them与it','them和it分别指什么？',choice(['them指两本词典，it指帽子','them指经理和Caroline，it指柜台','两个都指顾客'],'them指两本词典，it指帽子',{context:'Customer: I bought two expensive dictionaries… I forgot to take them with me.\nManager: Have you got a hat? … Would you put it on, please?'}),'按各自前文找对象，不把复数与单数合并。'),
q('r-request','请求不等于出售帽子','经理请顾客做什么？',choice(['戴上自己的帽子以便核对身份','再买一顶帽子','把词典送给Caroline'],'戴上自己的帽子以便核对身份',{context:'Have you got a hat, sir?\nYes, I have.\nWould you put it on, please?\nAll right.'}),'这是礼貌请求，帽子是顾客已有的。'),
q('r-recognize','结尾明确发生的变化','结尾Caroline明确说了什么？',choice(['现在认出这位顾客了','词典已经送到顾客家','帽子已经卖完了'],'现在认出这位顾客了',{context:'Is this the man that you served, Caroline?\nYes. I recognize him now.'}),'认出是原文明确结论，其他行动没有写。'),
q('r-boundary','不补书本交接结果','结尾能确认顾客已经拿走词典了吗？',choice(['不能，原文结束于认出顾客','能，认出就等于已经归还并离店','能，帽子能证明词典已装袋'],'不能，原文结束于认出顾客',{context:'Caroline: Yes. I recognize him now.\nThe conversation ends here.'}),'认出、交还、拿走和离店分别需要证据。')
];
unit.questions.grammar=[
g('kind','用从句指明人或物','用关系词补好两句。',ctx(fill([blank('The woman','is reading is May.',['who','whom','which']),blank('The book','is on the desk is mine.',['which','who','whom'])],['who','which']),'May is the woman reading. The book on the desk belongs to the speaker. Use the words offered to identify each one.'),'这里人用who，物用which；它们在从句中做动作或处于所说状态。','先找在说明人还是物。',model(['The boy who is running is Ben.','The bag which is on the chair is mine.'])),
g('that','that可指人或物的本课用法','本课用来辨认对象的两句，哪项判断正确？',choice(['两句都可以，that可用于这两种限定描述','第一句错，that绝不能指人','第二句错，that绝不能指物'],'两句都可以，that可用于这两种限定描述',{context:'The man that is waiting is Ben.\nThe book that is on the desk is mine.'}),'本课限定对象的从句里that可指人或物，不推广到所有带逗号的补充说明。','先看这两句的用途。',model(['The woman that helped me is May.','The bag that I bought is blue.'])),
g('whom','人作宾语的whom形式','按要求用whom合并，保留谁接待谁。',ctx(bank(['He is the man','whom','I served','yesterday','he served me'],'He is the man whom I served yesterday',4),'He is the man. I served him yesterday. Practise the formal object form whom.'),'I是接待者，man是被接待的人；whom替代从句中的him。','动作由谁完成，又落在谁身上？',model(['She is the woman whom Ben invited.','Ben邀请她。'])),
g('object-who','宾语位置也可用who','原文中的who用错了吗？',choice(['没有；这里who作宾语，whom或that也可用','错了，宾语只准用whom','错了，必须在served后再加him'],'没有；这里who作宾语，whom或that也可用',{context:'The man who I served was wearing a hat.'}),'who在这类宾语从句中很常见，原文不是错误示范；不把合法变体设成错项。','原文里谁在served前面？',model(['The woman who I met is May.','The woman whom I met is May.'])),
g('agent','主语关系说明谁做动作','这句话里是谁接待了我？',choice(['the woman所指的女士','说话人I','另一位未出现的人'],'the woman所指的女士',{context:'She is the woman who served me.'}),'who代表woman并作served的主语，me是被接待者。','谁在做served这个动作？',model(['He is the boy who called me.','那个男孩打电话给我。'])),
g('patient','宾语关系说明动作对谁','这句话里是谁接待了谁？',choice(['我接待了那位女士','那位女士接待了我','经理接待了我们两人'],'我接待了那位女士',{context:'She is the woman whom I served.'}),'I做动作，whom代表被接待的woman；与上一句的方向不同。','不要只看句首的She。',model(['He is the boy whom I called.','我打电话给那个男孩。'])),
g('join-subject','合并时不重复从句主语','用who合并两句，保持原意。',ctx(bank(['He is the man','who','came here','last week','he'],'He is the man who came here last week',4),'He is the man. He came here last week. The two uses of he refer to the same person.'),'who已代替第二句的he，不再写who he came。','两个he指向同一个人。',model(['She is the girl. She helped Ben.','She is the girl who helped Ben.'])),
g('join-object','合并时不重复从句宾语','用which合并，保持单数物品和时间。',ctx(bank(['This is the car','which','the mechanic repaired','yesterday','it'],'This is the car which the mechanic repaired yesterday',4),'This is the car. The mechanic repaired it yesterday. It refers to this car.'),'which已指向被修的car，不再在repaired后加it。','改写后哪个词已经代表it？',model(['This is the bag. I bought it yesterday.','This is the bag which I bought yesterday.'])),
g('agreement','从句谓语与所指名词单复数一致','按两组数量补好is或are。',ctx(fill([blank('The man who','waiting is Ben.',['is','are']),blank('The men who','waiting are Ben and Tom.',['are','is'])],['is','are']),'First describe one man, Ben. Then describe two men, Ben and Tom. They are waiting now.'),'who本身不决定单复数，man配is、men配are。','比较man和men。',model(['The book which is on the desk is mine.','The books which are on the desk are mine.'])),
g('tense','合并不改变原有时间与状态','按原句补好从句，保留时间。',ctx(fill([blank('She is the woman who','me yesterday.',['helped','helps']),blank('He is the man who','the road now.',['is repairing','repaired'])],['helped','is repairing']),'She helped me yesterday. He is in the middle of repairing the road now. Use these facts to identify them.'),'关系词不会自动把时态改成过去或现在；保留原来的事件和状态。','两句各自说什么时候？',model(['The woman who called yesterday is May.','The man who is calling now is Ben.'])),
g('preposition','宾语从句保留必要介词','按原来的talk to关系合并，使用whom。',ctx(bank(['The woman','whom','I was talking','to','is May'],'The woman whom I was talking to is May',5),'The woman is May. I was talking to the woman. Keep the meaning and practise whom with to at the end.'),'to仍属于talk to，不能因换了whom而丢掉；本题练句末介词这一种写法。','原句中talking后有什么？',model(['The man whom I was speaking to is Ben.','句末to保留说话对象关系。'])),
g('day','时间名词也可能是动作的宾语','用给出的关系代词补句。',ctx(fill([blank('That is the day','I’ll never forget.',['which','who','whom'])],['which']),'The speaker will always remember that day. Here the day is what the speaker will never forget.'),'the day是forget的对象；不因为day是时间词就忽略它在句中的作用。','forget的对象是什么？',model(['This is the trip which I remember.','记得的是这次旅行。'])),
g('attachment','修饰部分紧跟所说明对象','按材料选择没有改变对象的描述。',choice(['I met the woman who carries a red bag.','I met the bag who carries a red woman.','I met the woman which the red bag carries.'],'I met the woman who carries a red bag.',{context:'May is a woman. She carries a red bag. I met May. The description should identify the woman.'}),'who carries…说明woman；不能把包和人物的关系颠倒。','需要说明的是人还是包？',model(['I saw the man who was holding a book.','从句跟在man后说明是哪位男士。'])),
g('forget','forget to与forget doing的不同事实','按两种事实补好forget后面的形式。',ctx(fill([blank('I forgot','the letter.',['to post','posting']),blank('I’ll never forget','May.',['meeting','to meet'])],['to post','meeting']),'Yesterday I did not post the letter because I forgot the task. I met May last year, and I will always remember that meeting.'),'忘了要做而没做用forget to；记得已经发生的经历用never forget doing。','一件未做，一件已经发生。',model(['I forgot to bring my book.','I’ll never forget visiting that town.'])),
g('put','put on的代词位置','用it替代the hat，排好请求。',ctx(bank(['Please','put','it','on','on it'],'Please put it on',4),'Please put on the hat. Replace the hat with it without changing the request.'),'put on的宾语是代词时放中间；名词可用put on the hat或put the hat on。','it放在put和on的哪里？',model(['Put on your coat. → Put it on.','也可以说Put your coat on.'])),
g('wear','戴上动作与戴着状态','根据两种状态补句。',ctx(fill([blank('Ben is','his hat.',['wearing','putting on']),blank('Tom is','his hat.',['putting on','wearing'])],['wearing','putting on']),'Ben’s hat is already on his head; describe the state. Tom is lifting his hat onto his head; describe the action of putting it there.'),'wearing说戴着的状态，putting on说戴上的过程；不能只凭现在进行形式判断同义。','帽子已经在头上，还是正在戴上？',model(['May is putting on her coat.','Now May is wearing her coat.'])),
g('request','按意图理解Would you…please','这里说话人想请对方做什么？',choice(['把窗户关上','说明昨天关窗的次数','买一扇新窗户'],'把窗户关上',{context:'A visitor feels a cold wind from the open window and politely asks the host: “Would you close the window, please?”'}),'Would you…please在此是礼貌请求，不是询问过去习惯。','结合冷风和说话目的。',model(['Would you open the door, please?','All right.'])),
g('proverb','保留教材谚语的否定范围','这句谚语的通常意思是什么？',choice(['发光的东西并不都是金子','所有发光的东西都不是金子','所有发光的东西必定是金子'],'发光的东西并不都是金子',{context:'All that glitters is not gold.\nRead it as the proverb in the grammar reference.'}),'按谚语习惯理解为“并非全部”，不当成对每个发光物的全称否定。','注意教材译文中“并不都”的范围。',model(['Not all the books are new.','这些书并非全是新的，不等于全是旧的。'])),
g('questions','区分询问动作发出者与对象','补好两种问句，第二句按教材使用whom。',ctx(fill([blank('Who','you yesterday?',['served','did served']),blank('Whom did you','yesterday?',['serve','served'])],['served','serve']),'Ask first about the person who served you, then about the person you served. In the second question, practise the formal object form whom.'),'Who作疑问句主语时直接用served；Whom作宾语的问句用did＋动词原形serve。口语也可问Who did you serve?','两句分别在问谁做动作、动作对谁。',model(['Who called you?','Whom did you call?'])),
g('transfer-join','撤去示范后合并主语从句','用who合并，不重复she。',ctx(bank(['She is the nurse','who','looked after me','she'],'She is the nurse who looked after me',3),'She is the nurse. She looked after me. Both uses of she refer to the same person.'),'who替代第二句的she。'),
g('transfer-number','撤去示范后保持单复数','按物品数量补好两句。',ctx(fill([blank('The book which','on the chair is mine.',['is','are']),blank('The books which','on the table are yours.',['are','is'])],['is','are']),'There is one book on the chair and there are two books on the table.'),'从句谓语分别对应book与books。'),
g('transfer-object','撤去示范后保留动作方向','按两句事实选出正确合并。',choice(['These are the books which I bought yesterday.','These are the books which bought me yesterday.','These are the books which I bought them yesterday.'],'These are the books which I bought yesterday.',{context:'These are the books. I bought them yesterday.'}),'I是购买者，books是所购物，不再重复them。')
];
unit.questions.apply=[
q('a-counter','按位置图识别物品','找出the book which is on the counter。',choice(['A','B','C'],'A',{context:'Look at books A, B and C. Choose the label for the book on the counter.',image:image('book-map'),imageAlt:'书店位置图：A是柜台台面上的绿色书，B是柜台下地板上的蓝色书，C是右侧墙架上的红色书。'}),'A在柜台上，B在下面，C在墙架上。'),
q('a-person','按资料选择问话的下一句','你向同伴指出Ben。选出回答。',choice(['The man who is repairing the road.','The man who is waiting by the door.','The book which is on the counter.'],'The man who is repairing the road.',{context:'Ben and Tom are men. Ben is repairing the road; Tom is waiting by the door.\nYour friend asks: “Which man is Ben?”'}),'根据动作辨认人，不凭职业猜性别。'),
q('a-books','根据记录组织宾语从句','用which把购书记录写成一句。',ctx(bank(['These are the books','which','I bought','yesterday','them'],'These are the books which I bought yesterday',4),'You bought these books yesterday. Identify them now; keep the books plural.'),'保留购买者I和复数books，不重复them。'),
q('a-put','请求中的指代与位置','用it指帽子，补好请求的两处。',ctx(fill([blank('Would you put','',['it','they']),blank('',' , please?',['on','in'])],['it','on']),'A customer has a hat in his hand. The assistant asks him to wear that hat. Replace the hat with it.'),'帽子单数用it，put it on的代词放中间。'),
q('a-service','按服务记录辨认动作对象','按图选择描述Lee的句子。',choice(['Lee is the person whom Pat served.','Lee is the person who served Pat.','Lee is the person whom Mia served.'],'Lee is the person whom Pat served.',{context:'Read the arrows in this service record. Each arrow points from the assistant to the customer. Find the description of Lee.',image:image('service-record'),imageAlt:'服务记录：Pat指向Lee的箭头标served，Mia指向Tom的箭头标served；箭头由接待者指向顾客。'}),'Pat接待Lee，不反转成Lee接待Pat，也不换成Mia。'),
q('a-forget','根据是否发生选择表达','按记录说明Ben忘记做的事。',choice(['He forgot to take the books with him.','He’ll never forget taking the books with him.','He forgot to buy any books.'],'He forgot to take the books with him.',{context:'Ben bought two books yesterday. He left the shop without the books because he forgot to take them. The books stayed in the shop.'}),'购买已发生，忘记带走导致带走未发生。'),
q('a-unique','资料不足时不猜唯一人物','只说the woman who is behind the counter，能选定谁吗？',choice(['不能，两人都符合，还需要额外线索','一定是May','一定是Rose'],'不能，两人都符合，还需要额外线索',{context:'May and Rose are both women. Both are standing behind the same counter. May has a blue bag and Rose has a red bag. No bag colour is mentioned in the description.'}),'语法完整不代表描述足以唯一定位对象。'),
q('a-promise','答应与已经完成分开','只读这两句，能确认帽子已经戴上吗？',choice(['不能，只确认对方答应了请求','能，All right自动表示动作已经完成','能，任何请求都立即实现'],'不能，只确认对方答应了请求',{context:'A: Would you put the hat on, please?\nB: All right.\nNo later action is recorded in this separate practice scene.'}),'答应还不是动作完成记录；本题为另设练习情境。')
];
unit.questions.exam=[
q('e-words','核心词义抽样','配好三个词。',match([['customer','顾客'],['counter','柜台'],['recognize','认出']]),'按本课词义配对。'),
q('e-story','独立核对故事结局','原文结尾明确发生了什么？',choice(['Caroline认出了顾客','经理已经把词典交给顾客','顾客已经离店回家'],'Caroline认出了顾客',{context:'Caroline: Yes. I recognize him now.\nThe conversation ends here.'}),'认出有原文依据，交还和离店没有。'),
q('e-kind','独立区分人和物','按给定词补好两句。',ctx(fill([blank('The boy','is running is Tom.',['who','whom','which']),blank('The bag','is on the chair is mine.',['which','who','whom'])],['who','which']),'Tom is the boy running. The bag on the chair belongs to the speaker.'),'这里who指人作主语，which指物作主语。'),
q('e-that','独立识别that合法范围','在本课限定描述中，哪项判断正确？',choice(['两句都可以，that在这里既可指人也可指物','只能第一句用that','只能第二句用that'],'两句都可以，that在这里既可指人也可指物',{context:'The nurse that helped me is May.\nThe coat that I bought is green.'}),'限定对象的两类从句都可用that。'),
q('e-whom','独立组织whom宾语从句','用whom连接，保留邀请方向。',ctx(bank(['She is the woman','whom','I invited','to the party','she invited me'],'She is the woman whom I invited to the party',4),'She is the woman. I invited her to the party. Practise whom.'),'我邀请她，不反转为她邀请我。'),
q('e-variants','独立保留合法宾语写法','原文The man who I served…里的who还可怎样写？',choice(['可用whom或that；这一宾语关系中也可省略','只能改成which','必须保留who并在served后加him'],'可用whom或that；这一宾语关系中也可省略',{context:'The man who I served was wearing a hat.\nThe man is the person served by the speaker.'}),'本题只理解原文合法变体，省略的系统训练留待后续单元。'),
q('e-direction','独立区分谁看见谁','根据两句描述选择正确对应。',choice(['第一句是男孩看见我；第二句是我看见男孩','两句都是我看见男孩','两句都是男孩看见我'],'第一句是男孩看见我；第二句是我看见男孩',{context:'1. He is the boy who saw me.\n2. He is the boy whom I saw.'}),'主语关系和宾语关系不能因人物相同而混为一谈。'),
q('e-join-subject','独立合并主语从句','用who合并，保持人物和事件。',ctx(bank(['I am the person','who','wrote to you','I'],'I am the person who wrote to you',3),'I am the person. I wrote to you.'),'关系词代替重复的I，wrote to you保持不变。'),
q('e-join-object','独立合并物作宾语','用which合并，不重复it。',ctx(bank(['This is the umbrella','which','I bought','last week','it'],'This is the umbrella which I bought last week',4),'This is the umbrella. I bought it last week.'),'保留购买者、时间和物品，不加多余it。'),
q('e-number','独立保持从句单复数','按一人和两人补好谓语。',ctx(fill([blank('The woman who','waiting is May.',['is','are']),blank('The women who','waiting are May and Rose.',['are','is'])],['is','are']),'First describe May alone. Then describe May and Rose together. Both are waiting now.'),'谓语跟随所指woman／women，不由who固定决定。'),
q('e-tense','独立保留事件时间','按原始记录补好从句。',ctx(fill([blank('The man who','me yesterday is Ben.',['called','calls']),blank('The woman who','now is May.',['is reading','read'])],['called','is reading']),'Ben called the speaker yesterday. May is midway through reading now.'),'关系词不改写时间和实际状态。'),
q('e-preposition','独立保留介词关系','用which连接，保留write with的关系。',ctx(bank(['This is the pencil','which','I was writing','with','it'],'This is the pencil which I was writing with',4),'This is the pencil. I was writing with it. Keep the preposition at the end.'),'with表示使用的工具，连接后不能丢掉。'),
q('e-day','独立按句中作用选择关系词','用给出的关系代词补句。',ctx(fill([blank('That is the day','I remember.',['which','who','whom'])],['which']),'The day is what the speaker remembers.'),'day是remember的对象。'),
q('e-attachment','独立辨认修饰对象','这句话说明的是哪一个对象？',choice(['正在提篮子的那条狗','篮子正在提着的那个人','所有的篮子'],'正在提篮子的那条狗',{context:'The dog which is carrying that basket is mine.'}),'which从句说明dog，保留动作方向。'),
q('e-forget','独立区分忘做与难忘经历','按实际是否发生补句。',ctx(fill([blank('I forgot','my book.',['to bring','bringing']),blank('I’ll never forget','that town.',['visiting','to visit'])],['to bring','visiting']),'Yesterday I did not bring my book because I forgot the task. I visited that town last year, and I will always remember the visit.'),'未做任务与已经发生的经历分开。'),
q('e-put','独立用代词改写穿戴请求','把your coat换成it，保持请求。',ctx(bank(['Please','put','it','on','on it'],'Please put it on',4),'Please put your coat on. Use it instead of your coat.'),'put it on的代词在中间。'),
q('e-wear','独立区分穿戴动作和状态','按帽子的实际位置补句。',ctx(fill([blank('May is','her hat.',['putting on','wearing']),blank('Rose is','her hat.',['wearing','putting on'])],['putting on','wearing']),'May is lifting a hat onto her head; describe that action. Rose’s hat is already on her head; describe the state.'),'不要把wear与put on互当同义。'),
q('e-request','独立选择礼貌请求的回应','你愿意按请求开门，选出下一句。',choice(['All right.','The road is very long.','I bought two books yesterday.'],'All right.',{context:'A friend carrying a box asks: “Would you open the door, please?”\nYou agree to help.'}),'All right在此表示答应，不是已经完成开门。'),
q('e-proverb','独立核对谚语的意义范围','按教材中的谚语含义，哪项正确？',choice(['不能因为发光就认定都是金子','每一种发光物都不可能是金子','发光物全都一定是金子'],'不能因为发光就认定都是金子',{context:'All that glitters is not gold.'}),'谚语的“并非都”不等于“全都不”。'),
q('e-unique','独立识别描述不唯一','the man who is holding a book能唯一选定谁吗？',choice(['不能，两人都符合这一描述','只能是Ben','只能是Tom'],'不能，两人都符合这一描述',{context:'Ben and Tom are men. Ben is holding a green book. Tom is holding a red book. The description does not mention a colour.'}),'需要足以区分两个候选的线索，不从名称或顺序猜。'),
q('e-forms','独立区分forget词形','按句子结构选择正确词形。',fill([blank('Yesterday I','to bring it.',['forgot','forgotten']),blank('I have','the name.',['forgotten','forgot'])],['forgot','forgotten']),'一般过去用forgot，have后用过去分词forgotten。'),
q('e-pronouns','独立核对物品指代','两处it／them分别指什么？',choice(['them指两本词典，it指帽子','them指两位店员，it指词典','them和it都指顾客'],'them指两本词典，it指帽子',{context:'I bought two dictionaries, but forgot to take them with me.\nHave you got a hat? Would you put it on, please?'}),'指代随上下文对象及单复数核对。'),
q('e-questions','独立组织两种人物问句','分别询问谁遇见你、你遇见谁。',ctx(fill([blank('Who','you yesterday?',['met','did met']),blank('Whom did you','yesterday?',['meet','met'])],['met','meet']),'Ask about yesterday. First ask who met the listener; then ask whom the listener met. Practise the formal whom in the second question.'),'主语问句用met；宾语问句did后用原形meet，不重复过去式。')
];
unit.learning.REFERENCE=[
'本课按导学Grammar学习用定语从句辨认人或物。描述通常跟在要说明的名词后：the woman who is standing…、the books which are on…；先读清它在说明谁或什么，不只背“先行词”等名称。',
'本课这些限定描述中，人作从句主语可用who／that，物可用which／that；122课普通狗的例句用which／that。不能据此说that在所有关系从句都能替换who／which，也不扩张为动物在任何语境都禁用who。',
'She is the woman who served me：女士接待我。She is the woman whom I served：我接待女士。关系词究竟代表做动作的人还是被作用的人，要看完整从句；不由主句开头She或He猜方向。',
'人作宾语时，whom是较正式的写法，who与that在本课限定从句也可用；原文The man who I served不是错误。宾语关系词也可以省略，能帮助理解合法变体；本课先掌握who／whom／which／that，省略的系统训练在后续单元。主语关系词不能按同一规则随意省略。',
'合并时去掉被关系词替代的重复成分：the man who came，不写who he came；the book which I bought，不写which I bought it。保留动作执行者、对象、单复数、原来的时间和状态，不因加入关系词把主语和宾语倒置。',
'从句作主语的who／which所指名词决定谓语单复数：the man who is…／the men who are…，the book which is…／the books which are…。先找关系词指向哪个名词，再核对人数或物品数量。',
'I was talking to the woman → the woman whom I was talking to；I was writing with the pencil → the pencil which I was writing with。句末to／with仍表达原有关系，不能丢掉。本课不要求把介词提前；若采用to whom等正式形式，还须另核对该结构，不能写to that。',
'That is the day which I’ll never forget中day是forget的对象，不能只因为day是时间名词就忽略从句缺少的是宾语。导学谚语All that glitters is not gold按“发光的并不都是金子”理解，不教成所有发光物都不是金子。',
'forget to do表示忘了本来要做的事；never forget doing表示不会忘记已经发生的经历。原文顾客已买书，只是忘记带走；不是忘记购买。forget—forgot—forgotten三种词形和对应音标在课本小参考保留。',
'put on强调穿上／戴上的动作，wear强调穿着／戴着的状态。put on的宾语为名词时两种位置都可：put on the hat／put the hat on；若换代词，用put it on，不用put on it。规则只针对这一可分短语动词，不推广到所有含介词的动词。',
'Would you…please在经理的语境中是礼貌请求，All right表示答应。舞台在教材下一幅确认画面才显示帽子已戴好，不把答应自动当完成；结尾只确认Caroline认出顾客，不补交还词典、装袋或离店。',
'半小时前以顾客说话时刻为参照，原文未给具体钟点；two expensive dictionaries说明数量与价格评价，不提供具体金额。He says的主语是顾客，经理只是转述；them指两本词典，it指帽子。',
'122课A两句须确实指同一个人或物才合并。B问动作由谁做，C问动作对谁；确认问句That man／That woman按所指人物核对。me在别人问你时变you，回答回到me／I；第三人的him／her不机械改变。书写中的警察与小偷是另设练习，不能据此补写119课小偷已被抓。',
'描述可能仍不唯一：若两位女士都在柜台后，仅说the woman who is behind the counter还不能选定一人。需要区分两人的额外线索，不能把语法正确等同于资料充分。'
];
unit.learning.MODEL_TITLE='课本小参考 · 122课1–9';
unit.learning.VERB_FORMS=[['原形','forget','/fəˈɡet/'],['过去式','forgot','/fəˈɡɒt/'],['过去分词','forgotten','/fəˈɡɒtn/']];
unit.learning.RELATIVE_MODELS=[['用途','形式','例子'],['人做动作','who / that + 动词','The man who served me is Ben.'],['人是动作对象','who / whom / that + 主语 + 动词','The man whom I served is Ben.'],['物作主语','which / that + 动词','The books which are on the counter are mine.'],['物是动作对象','which / that + 主语 + 动词','The book which I bought is green.'],['保留介词关系','主语 + 动词 + 必要介词','The woman whom I spoke to is May.'],['说明戴上／戴着','put it on / wear it','Put it on. Now you are wearing it.']];
unit.learning.MODELS=[
['1 · Who served you? The man who/that is standing behind the counter.','谁接待了你？站在柜台后面的那位男士。','counter'],
['2 · Who served you? The woman who/that is standing behind the counter.','谁接待了你？站在柜台后面的那位女士。','counter'],
['3 · Who is making all that noise? The men who/that are repairing the road.','谁发出那么大的响声？正在修路的那些男士。','road'],
['4 · I served him yesterday. He is the man who(m)/that I served yesterday.','我昨天接待过他。他就是我昨天接待的男士。','serve'],
['5 · I served her yesterday. She is the woman who(m)/that I served yesterday.','我昨天接待过她。她就是我昨天接待的女士。','serve'],
['6 · I saw them yesterday. They are the men who(m)/that I saw yesterday.','我昨天看见过他们。他们就是我昨天看见的那些男士。','recognize'],
['7 · Which book did you buy? The book which/that is on the counter.','你买了哪本书？柜台上的那一本。','dictionary'],
['8 · Which books did you buy? The books which/that are on the counter.','你买了哪几本书？柜台上的那些书。','two-dictionaries'],
['9 · Which dog is yours? The dog which/that is carrying that basket.','哪条狗是你的？正提着那只篮子的狗。','basket']
].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 用who、whom或which合并',answerLines:2,instruction:'保留8题和3个原例。每对句子中的重复对象指同一人或物；合并保留动作方向、介词、单复数和时间，去掉重复代词。人作宾语时who／whom均合法；按本题指定关系词练习，不将that等合法变体普遍判错。每题一个长句，两行。',examples:['She is the girl. She met me yesterday. → She is the girl who met me yesterday.','This is the book. I bought it yesterday. → This is the book which I bought yesterday.','She is the girl. I met her yesterday. → She is the girl who (or whom) I met yesterday.'],items:['This is the car. The mechanic repaired it yesterday.','He is the man. I invited him to the party.','These are the things. I bought them yesterday.','He is the man. He came here last week.','He is the policeman. He caught the thieves.','She is the nurse. She looked after me.','She is the woman. I met her at the party.','I am the person. I wrote to you.']},
{title:'B · 询问谁做了动作',answerLines:3,instruction:'保留8题。按例写Who问句、That man／That woman确认问句、Yes回应三部分，每题三行。假定双方正在指同一人；me在对方提问时变you，回答时回到me；him／her等第三人称按原对象保留。',examples:['He served me. → Who served you? That man? Yes, he’s the man who served me.'],items:['She met him.','He sat there.','She made it.','He read it.','He shut it.','She took it.','He told me.','She saw me.']},
{title:'C · 询问动作对谁',answerLines:3,instruction:'保留8题。按教材正式形式写Whom did you…?、That man／That woman?、Yes回应三部分，每题三行。原句I是回答者；问句用did＋动词原形，回应从句保留原过去式，不重复him／her。口语Who did you…?也是合法表达。',examples:['I met him yesterday. → Whom did you meet yesterday? That man? Yes, he’s the man whom I met yesterday.'],items:['I saw him.','I telephoned her.','I invited him.','I took him to the cinema.','I found him in the garden.','I drove her to London.','I heard her.','I remembered him.']}
];
core.unit121122=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
