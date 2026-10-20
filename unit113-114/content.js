(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit113-114/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页230–233／PDF263–266',grammarSource='《同步导学》Grammar纸页190／PDF204；《语法练习册》纸页328–334／PDF342–348';
const rows=[['conductor','售票员','/kənˈdʌktə/','conductor'],['fare','车费；票价','/feə/','fare'],['change','兑换（钱）','/tʃeɪndʒ/','change'],['note','纸币（本课）','/nəʊt/','note'],['passenger','乘客','/ˈpæsɪndʒə/','passenger'],['none','一个也没有；一点也没有','/nʌn/','none'],['neither','也不（本课回应）','/ˈnaɪðə/','neither'],['get off','下车','/ɡet ɒf/','get-off'],['tramp','流浪汉（教材人物称呼）','/træmp/','tramp'],['except','除……外（不包括）','/ɪkˈsept/','except'],['small change','零钱','/smɔːl tʃeɪndʒ/','coins'],['so','也如此（本课回应）','/səʊ/','so'],['too','也（肯定补充）','/tuː/','too'],['either','也（否定补充）','/ˈaɪðə/','either'],['nor','也不（回应）','/nɔː/','neither'],['any','一些；任何（按语境）','/ˈeni/','any'],['no','没有（放在名词前）','/nəʊ/','no'],['some','一些','/sʌm/','some'],['money','钱','/ˈmʌni/','money'],['pound','英镑（本课）','/paʊnd/','pound'],['bus','公共汽车','/bʌs/','bus'],['ticket','车票','/ˈtɪkɪt/','ticket'],['chocolate','巧克力','/ˈtʃɒklət/','chocolate'],['envelope','信封','/ˈenvələʊp/','envelope'],['cake','蛋糕','/keɪk/','cake'],['biscuit','饼干','/ˈbɪskɪt/','biscuit'],['coin','硬币','/kɔɪn/','coin'],['Trafalgar Square','特拉法加广场','/trəˈfælɡə skweə/','square']];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit113-114',version:1,contentRevision:'bus-replies-v1',mode:'classroom',title:'公共汽车上的零钱',path:'/unit113-114/',start:'learn/words',progress:{learningKey:'canran:unit113-114:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识乘车与零钱',activities:[['words','车上小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进零钱故事',activities:[['text','公共汽车小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'学会按事实回应',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'交流与核对情况',activities:[['apply','交流小帮手','give']],required:['apply']},
{id:'l5',title:'完成回应挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'small change',storyQuestion:'谁有零钱？',completionTitles:{listen:'乘车词语认清啦！',roles:'零钱故事读懂啦！',grammar:'也如此与也不说清啦！',apply:'交流情况核对啦！',exam:'回应挑战完成！'},reward:{edition:'bus-replies-v1',title:'回应表达小达人',lesson:'Lesson 113–114',scene:'/assets/unit113-114/keepsake-story-v1.webp',alt:'两位流浪汉告诉售票员自己有零钱',color:'#789b83',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','交流小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={conductor:'Conductor',man:'Man',p1:'1st Passenger',p2:'2nd Passenger',p3:'3rd Passenger',p4:'4th Passenger',tramps:'Two Tramps',t1:'1st Tramp',t2:'2nd Tramp'};
unit.learning.DIALOGUE=[
['conductor','Fares, please!','请买票！'],
['man','Trafalgar Square, please.','请买一张到特拉法加广场的票。'],
['conductor','I’m sorry, sir. I can’t change a ten-pound note. Haven’t you got any small change?','对不起，先生。我换不开十英镑的纸币。您没有零钱吗？'],
['man','I’ve got no small change, I’m afraid.','恐怕我没有零钱。'],
['conductor','I’ll ask some of the passengers.','我来问问几位乘客。'],
['conductor','Have you any small change, sir?','先生，您有零钱吗？'],
['p1','I’m sorry. I’ve got none.','对不起，我没有。'],
['p2','I haven’t got any either.','我也没有。'],
['conductor','Can you change this ten-pound note, madam?','夫人，您能换开这张十英镑的纸币吗？'],
['p3','I’m afraid I can’t.','恐怕我不能。'],
['p4','Neither can I.','我也不能。'],
['conductor','I’m very sorry, sir. You must get off the bus. None of our passengers can change this note. They’re all millionaires!','非常抱歉，先生。您必须下车。我们的乘客中没有人能换开这张纸币。他们都是百万富翁！'],
['tramps','Except us.','我们俩除外。'],
['t1','I’ve got some small change.','我有一些零钱。'],
['t2','So have I.','我也有。']
].map(([who,text,cn],i)=>({id:'u113114-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u113114-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}}),ctx=(input,context)=>({...input,context});
unit.questions.listen=[
q('v-note','note的本课词义','哪个词在本课表示“纸币”？',choice(['note','coin','ticket'],'note',{optionImages:{note:image('note'),coin:image('coin'),ticket:image('ticket')}}),'note在这里是纸币；coin是硬币，ticket是车票。'),
q('v-people','乘车人物与车费','把三个词配好。',match([['conductor','售票员'],['passenger','乘客'],['fare','车费；票价']]),'售票员、乘客与车费是不同概念。'),
q('v-change','change的语境义','Can you change this note?中的change表示什么？',choice(['把这张纸币兑换开','改变乘客姓名','已经买好车票'],'把这张纸币兑换开'),'change在这句中是动词；small change中的change是零钱。'),
q('v-none','none的数量义','I’ve got none.在零钱对话中表示什么？',choice(['一点零钱也没有','有一些零钱','一定足够换开纸币'],'一点零钱也没有'),'none承接前文small change，不是指没有任何财产。'),
q('v-neither','neither回应的意义','Neither can I.在原文表示什么？',choice(['我也不能换开纸币','我也有一些零钱','我已经买好了票'],'我也不能换开纸币'),'承接前一句can’t，表示同样不能。'),
q('v-so','so回应的意义','So have I.在故事末尾表示什么？',choice(['我也有一些零钱','我也没有零钱','我已经把所有零钱给出去了'],'我也有一些零钱'),'这里承接I’ve got some small change。'),
q('v-phrases','数量与上下车词义','配好这三个表达。',match([['small change','零钱'],['get off','下车'],['except','除……外（不包括）']]),'下车指令、零钱和排除关系不能混为同一件事。'),
q('v-except','定位表示排除的词','点出表示“除……外”的词。',{type:'locate',fragments:[{value:'Except'},' ',{value:'us'},'.'],options:['Except','us'],answer:'Except'},'except表示不包括，us指说这句话的两位人物。')
];
unit.questions.roles=[
q('r-destination','辨认原文目的地','男子想买到哪里去的票？',choice(['Trafalgar Square','the airport','the library'],'Trafalgar Square'),'按原文目的地回答，不推定他已经到达。'),
q('r-note','核对纸币与票价','原文的ten-pound说明什么？',choice(['纸币面额是十英镑，车费未给出','车费正好十英镑','零钱总数正好十英镑'],'纸币面额是十英镑，车费未给出'),'纸币面额不等于票价。'),
q('r-first-pair','分清前两位乘客的回应','前两位乘客分别说了什么？',choice(['第一位没有零钱，第二位也没有','两位都已经换开纸币','第二位说自己有零钱'],'第一位没有零钱，第二位也没有'),'I’ve got none与I haven’t got any either都围绕没有零钱。'),
q('r-second-pair','分清后两位乘客的能力回应','Neither can I.是谁说的？承接什么？',choice(['第四位乘客，承接第三位说不能换开纸币','售票员，表示自己已有零钱','第二位流浪汉，表示已经付款'],'第四位乘客，承接第三位说不能换开纸币'),'不遗漏第四位乘客，也不把can换成拥有义have。'),
q('r-tramps','回答教材问题','结尾谁明确说自己有零钱？',choice(['两位流浪汉','第一位和第二位乘客','男子和售票员'],'两位流浪汉'),'第一位说有零钱，第二位用So have I说明也有。'),
q('r-wealth','保留人物概括的归属','They’re all millionaires!应怎样理解？',choice(['售票员当时的说法，不能当作财富调查结果','每位乘客的财富都已核实','没有零钱就一定是百万富翁'],'售票员当时的说法，不能当作财富调查结果'),'不能凭有没有零钱或衣着推断现实人的财富。'),
q('r-enough','有零钱与足够换钞分开','有some small change，能确认足够换开十英镑吗？',choice(['不能，原文没有给两人的零钱总额','能，some固定表示十英镑','能，因为两人已经交出了零钱'],'不能，原文没有给两人的零钱总额'),'有一些不等于满足特定金额，也没有写出交换结果。'),
q('r-ending','区分指令与已发生结果','You must get off the bus.能证明男子已经下车了吗？',choice(['不能，这是售票员的要求，后文未交代实际下车或成交','能，所有指令都已经发生','能，男子已到达目的地'],'不能，这是售票员的要求，后文未交代实际下车或成交'),'保留原文结局边界，不补下车、换钞或买票成功。')
];
unit.questions.grammar=[
g('can','can的肯定与否定附和','两位角色情况相同，补好两个回应。',ctx(fill([blank('So','I.',['can','do']),blank('Neither','I.',['can','do'])],['can','can']),'A can read English, and B can read English too. B uses “So…”.\nC cannot dance, and D cannot dance either. D uses “Neither…”.'),'can表示的能力相同，用So／Neither can＋主语。','沿用前句的能力动词。',model(['May can swim, and so can Kim.','May can’t drive, and neither can Kim.'])),
g('polarity','按事实选择so或neither','按两组明确事实选择回应开头。',ctx(fill([blank('','have I.',['So','Neither']),blank('','have I.',['Neither','So'])],['So','Neither']),'A has got a pencil. B has got one too. B replies first.\nC has not got a ruler. D has not got one either. D replies second.'),'肯定事实同样适用用so；否定事实同样适用用neither。','先核对第二个人是否也有相同情况。',model(['Lee is ready. May is ready too. → So is May.','Lee is not ready. May is not ready either. → Neither is May.'])),
g('be-now','现在be与新主语一致','分别替I和he选好be。',ctx(fill([blank('So','I.',['am','is']),blank('Neither','he.',['is','am'])],['am','is']),'Tom is tired and I am tired too.\nMay is not hungry and Ben is not hungry either; use he for Ben.'),'回应中的be跟新主语一致，不机械复制前句is。','I和he各自配哪种be？',model(['I am ready, and so are they.','He is not ready, and neither are we.'])),
g('be-past','过去be保留时间并匹配主语','按昨天的事实补好回应。',ctx(fill([blank('So','I.',['was','am']),blank('Neither','we.',['were','was'])],['was','were']),'Anna was at the library yesterday, and I was there too.\nBen was not at the park yesterday, and we were not there either.'),'过去用was／were，数与新主语一致。','既看昨天，也看I和we。',model(['May was busy yesterday, and so were her friends.','They weren’t late, and neither was Kim.'])),
g('do-does','一般现在动作与新主语','按相同喜好补好助动词。',ctx(fill([blank('So','I.',['do','does']),blank('So','May.',['does','do'])],['do','does']),'Anna likes apples, and I like apples too.\nI like pears, and May likes pears too.'),'一般现在实义动词用do／does，按新主语选形式。','原句的likes不是回应里直接倒装的词。',model(['We read every day, and so does Tom.','She doesn’t run, and neither do they.'])),
g('did','一般过去动作使用did','按昨天的相同经历补全。',ctx(fill([blank('So','I.',['did','do']),blank('Neither','I.',['did','was'])],['did','did']),'May visited the museum yesterday; I visited it too.\nBen did not call yesterday; I did not call either.'),'过去动作附和用did，不因为主语I就换成do或was。','判断前句是过去动作还是be状态。',model(['Kim went home, and so did Lee.','Kim didn’t go out, and neither did Lee.'])),
g('will','保留将来will','两组计划相同，补好回应。',ctx(fill([blank('So','I.',['will','do']),blank('Neither','I.',['will','did'])],['will','will']),'Anna will come tomorrow, and I will come too.\nBen will not travel next week, and I will not travel either.'),'will／won’t的附和保留will；neither后不再用won’t。','计划指向将来，前句用了哪个情态动词？',model(['They will help, and so will May.','They won’t leave, and neither will Tom.'])),
g('could','过去能力保留could','你扮演B，按明确事实用neither回应。',choice(['Neither could I.','Neither can I.','Neither did I.'],'Neither could I.',{context:'A could not hear the announcement yesterday. B could not hear it either.'}),'这次过去能力回应保留could，不换成现在的can。','原话用了哪个能力动词？',model(['Kim couldn’t open the door, and neither could Lee.','两人都未能打开，保持could。'])),
g('must','must要求的同样适用','你扮演第二人，用so回应。',choice(['So must I.','So do I.','So can I.'],'So must I.',{context:'A must bring a ticket. The same rule applies to B: B must bring one too.'}),'相同要求保留must，不改成能力或一般动作。','要保留要求的含义。',model(['The adults must wait, and so must the children.','两组都受同一要求约束。'])),
g('have-got','have got拥有结构','B也有信封，按本课have got形式用so回应。',choice(['So have I.','So am I.','So did I.'],'So have I.',{context:'A: “I’ve got some envelopes.” B has got some envelopes too.'}),'have got的本课回应使用have；不把拥有与正在做混在一起。','留意I’ve got里的助动词。',model(['May has got a ticket, and so has Tom.','按have got结构回应。'])),
g('perfect','完成时与新主语一致','按两组已完成／未完成事实补全。',ctx(fill([blank('So','May.',['has','have']),blank('Neither','we.',['have','has'])],['has','have']),'Tom has finished the task, and May has finished it too.\nAnna has not read the letter, and we have not read it either.'),'完成时回应保留have／has，并与新主语搭配。','May与we是否使用相同形式？',model(['They have arrived, and so has Kim.','He hasn’t finished, and neither have they.'])),
g('progressive','进行时保留be','按当前正在进行的事实补全。',ctx(fill([blank('So','Ben.',['is','does']),blank('Neither','they.',['are','do'])],['is','are']),'Mia is reading now; Ben is reading too.\nI am not writing now; they are not writing either.'),'进行时用原句的be，不能看到动作就一律选do。','先认清完整动词短语。',model(['I am waiting, and so are they.','She isn’t sleeping, and neither is he.'])),
g('had-action','区分实义had与助动词','按过去活动，用so回应。',choice(['So did I.','So had I.','So have I.'],'So did I.',{context:'A had a swim yesterday. B also had a swim yesterday.\nB is replying about the same past activity.'}),'had a swim中的had是过去活动的实义动词，这里用did。','had后面是名词活动，还是过去分词？',model(['May had lunch at noon, and so did Kim.','过去吃午饭不是过去完成时。'])),
g('order','组织neither倒装','B也不能打开门，用neither词块拼句。',ctx(bank(['Neither','can','I','can’t'],'Neither can I',3),'A: “I can’t open the door.” B cannot open it either.'),'neither＋can＋I；neither已含否定，不再加not。','先放否定附和词，再放动词和新主语。',model(['Neither is May.','Neither＋动词＋主语。'])),
g('single-negative','避免重复否定','两人都不累，B用neither回应，哪句符合本课结构？',choice(['Neither am I.','Neither am I not.','Neither I am.'],'Neither am I.',{context:'A is not tired. B is not tired either.'}),'neither已表达也不，不能在同一回应中再加not。','否定意思是否已经表达？',model(['Neither can Tom.','不能写Neither can’t Tom来表达本课的“也不能”。'])),
g('too-either','区分too与either的补充','按相同事实补好完整句的句末词。',ctx(fill([blank('I am hungry,',' .',['too','either']),blank('I am not tired,',' .',['either','too'])],['too','either']),'A is hungry and B is hungry too; B replies first.\nC is not tired and D is not tired either; D replies second.'),'肯定补充可用too；否定补充用either，完整句保持正常语序。','是肯定的也，还是否定的也？',model(['May can swim, too.','Ben can’t drive, either.'])),
g('no-none','no加名词与none单独使用','明确没有水，补好两种表达。',ctx(fill([blank('There is','water.',['no','none']),blank('There is',' .',['none','no'])],['no','none']),'The bottle is empty. There is no water in it.'),'no放在名词前；none代替已知的数量，也可指不可数的水。','后面是否还接water这个名词？',model(['I’ve got no pens. I’ve got none.','no＋名词；none承接前文。'])),
g('rewrite-past','not any改no保留过去事件','把I didn’t see any buses yesterday.改成no表达。',fill([blank('I','',['saw','see']),blank('','buses yesterday.',['no','any'])],['saw','no']),'去掉didn’t后，实义动词恢复过去式saw；仍表示昨天没看见。','过去时间和否定含义都要留下。',model(['She didn’t buy any books. → She bought no books.','不是把didn’t简单删除后保留buy。'])),
g('none-of','明确集合中的none of','四人都不能打开盒子，填入关系词。',ctx(fill([blank('None','the four people can open the box.',['of','to'])],['of']),'All four people tried. No one in this group could open the box.'),'none of后接已限定的群体；只描述这四个人，不扩大范围。','none与the four people之间需要什么？',model(['None of our three keys can open this door.','保留原来的集合。'])),
g('unknown','先确认自己情况再附和','只知道A喜欢苹果，B的喜好未知，能确定B应说So do I吗？',choice(['不能，还要知道B是否也喜欢','能，前句肯定就必须附和','不能，所有回应都必须用neither'],'不能，还要知道B是否也喜欢',{context:'A likes apples. B’s preference has not been stated.'}),'so／neither报告第二人的真实情况，不是无条件赞同按钮。','第二个人的事实是否已知？',model(['A can swim, but B cannot.','B不能用So can I来报告自己的真实能力。'])),
g('negative-question','否定问句按有无事实回应','按两位角色的事实，选择正确的一对回答。',choice(['A: Yes, I have. B: No, I haven’t.','A: No, I haven’t. B: Yes, I have.','A和B都必须答No，因为问句带Haven’t'],'A: Yes, I have. B: No, I haven’t.',{context:'Question to each person: “Haven’t you got any coins?”\nA has coins. B has no coins.'}),'有就Yes, I have；没有就No, I haven’t，不按中文是／不是逐字套。','先看手里有没有，再看英语回答。',model(['Isn’t it open? It is open. → Yes, it is.','It is closed. → No, it isn’t.'])),
g('nor','保留nor合法附和','表示“我也不会游泳”，下列哪项准确？',choice(['Neither can I和Nor can I都可用','只有Neither can I可用，Nor永远错误','必须写Neither can’t I'],'Neither can I和Nor can I都可用'),'导学列neither／nor；指定neither练习时按任务作答，不把nor本身判错。','区分指定形式与普遍语法限制。',model(['Neither does May. / Nor does May.','两种否定附和形式均可保留。'])),
g('independent-polarity','独立核对两人的事实','按资料选择肯定或否定附和。',ctx(fill([blank('A’s reply:','can I.',['So','Neither']),blank('B’s reply:','can I.',['Neither','So'])],['So','Neither']),'Kim can ride a bike, and A can too.\nLee cannot drive, and B cannot either.'),'先核对新人物的事实，再选so或neither。'),
g('independent-be','独立匹配be与新主语','按资料补好现在与过去的回应。',ctx(fill([blank('So','I.',['am','is']),blank('Neither','they.',['were','was'])],['am','were']),'Mia is ready now; I am ready too.\nBen was not late yesterday; they were not late either.'),'现在I用am，过去复数they用were；时态与新主语分别核对。'),
g('independent-do','独立区分人称与时态','按两个明确事实补好回应。',ctx(fill([blank('So','May.',['does','do']),blank('Neither','I.',['did','do'])],['does','did']),'I read every day; May reads every day too.\nBen did not phone yesterday; I did not phone either.'),'一般现在May用does，过去动作I用did。'),
g('independent-either','独立写出正常语序的否定补充','按资料，用either拼出完整回应。',ctx(bank(['I','can’t swim','either','Neither'],'I can’t swim either',3),'A cannot swim. B cannot swim either.\nB replies with a full sentence ending in either.'),'either放在否定句末，主语仍在can’t之前。')
];
unit.questions.apply=[
q('a-none','按图确认零数量','哪个盒子可以用There are none回应其中的硬币数量？',choice(['A · 0枚','B · 2枚','C · 4枚'],'A · 0枚',{context:'Count only the coins in each open box.',optionImages:{'A · 0枚':image('coins-0'),'B · 2枚':image('coins-2'),'C · 4枚':image('coins-4')}}),'none是零数量，不是少量。'),
q('a-exchange','核对另设兑换资料','哪组硬币总额正好等于这张£10纸币？',choice(['A · 五枚£2','B · 两枚£2','C · 三枚£2'],'A · 五枚£2',{context:'Classroom exchange: one £10 note.\nEvery coin shown is worth £2.\nChoose an equal total, not a fare payment.',optionImages:{'A · 五枚£2':image('exchange-10'),'B · 两枚£2':image('exchange-4'),'C · 三枚£2':image('exchange-6')}}),'五枚2英镑合计10英镑；此处是另设兑换任务，不是原文未给出的车费。'),
q('a-can','按共同能力交流','你扮演B，也能打开这个盒子，怎样用so回应？',choice(['So can I.','Neither can I.','So have I.'],'So can I.',{context:'A: “I can open this box.” B can open the same box too.'}),'按共同能力选择can，不把有物品当作能做事。'),
q('a-different','事实不同时不盲目附和','你扮演B，不会游泳；A说会游泳，哪句报告B的实际情况？',choice(['I can’t swim.','So can I.','Neither can I.'],'I can’t swim.',{context:'A: “I can swim.” B cannot swim.'}),'B与A情况不同，不能用表示同样的so／neither回应。'),
q('a-record','听取两人明确情况后记录','两人的陈述支持哪项记录？',choice(['两人都没有信封','两人都有信封','只有第一人没有信封'],'两人都没有信封',{context:'Anna: “I haven’t got any envelopes.”\nBen: “Neither have I.”'}),'neither have I把否定拥有事实延续到第二人。'),
q('a-except','组织原文排除表达','两位角色说“我们俩除外”，用词块表达。',ctx(bank(['Except','us','we'],'Except us',2),'The two speakers are excluding themselves from the stated group description.'),'except后用宾格us，不把本课短语换成we。'),
q('a-unknown','有零钱但总额未知','记录只有some small change，兑换前还需要核对什么？',choice(['每种面额和数量，才能算总额','直接记录总额必为十英镑','直接记录已换钱成功'],'每种面额和数量，才能算总额',{context:'A person says: “I’ve got some small change.”\nNo denominations or total amount have been recorded.'}),'有一些零钱不提供精确总额，也不是兑换完成的记录。'),
q('a-past','按共同过去经历回应','你扮演B，昨天也在图书馆，用so拼句。',ctx(bank(['So','was','I','am'],'So was I',3),'A: “I was at the library yesterday.” B was there yesterday too.'),'保留昨天的过去be，不换成am。')
];
unit.questions.exam=[
q('e-who','独立回答原文开场问题','谁明确说自己有零钱？',choice(['两位流浪汉','售票员和男子','第一位和第二位乘客'],'两位流浪汉'),'结尾两句分别确认两人有零钱。'),
q('e-none','独立核对none指代','第一位乘客的I’ve got none承接什么？',choice(['small change','所有个人财产','公交车本身'],'small change'),'代替当前问到的零钱，不扩大含义。'),
q('e-fourth','独立辨认说话人与能力回应','Neither can I.是谁的回应？',choice(['第四位乘客','售票员','第二位流浪汉'],'第四位乘客'),'保留八个人物与独立发言，不合并后两位乘客。'),
q('e-claim','独立区分概括与事实','They’re all millionaires!能作为全体乘客财富已核实的证据吗？',choice(['不能，是售票员当时的概括','能，有无零钱足以证明财富','能，原文列出了所有账户'],'不能，是售票员当时的概括'),'不把人物概括当普遍规律或核实结果。'),
q('e-outcome','独立核对故事结局','原文确认了哪一项？',choice(['两人说有零钱，但未写换钞、买票或下车结果','零钱一定够换开十英镑','男子已经被带下车'],'两人说有零钱，但未写换钞、买票或下车结果'),'有零钱与足够、要求与已发生都分别判断。'),
q('e-polarity','独立选择so与neither','按两组事实填回应开头。',ctx(fill([blank('','have I.',['So','Neither']),blank('','have I.',['Neither','So'])],['So','Neither']),'Anna has got a ticket; B has one too and replies first.\nBen has not got a map; C has none and replies second.'),'匹配第二人的肯定／否定事实。'),
q('e-be-now','独立匹配现在be','按新主语填be。',ctx(fill([blank('So','I.',['am','is']),blank('Neither','he.',['is','am'])],['am','is']),'May is hungry and I am hungry too.\nAnna is not tired and Tom is not tired either; use he for Tom.'),'回应里的be由新主语决定。'),
q('e-be-past','独立匹配过去be','按昨天的事实补全。',ctx(fill([blank('So','I.',['was','am']),blank('Neither','they.',['were','was'])],['was','were']),'Kim was at home yesterday; I was too.\nMay was not late yesterday; they were not late either.'),'既保留过去时间，也保留主语的数。'),
q('e-do-does','独立匹配一般现在动作','按事实补全do或does。',ctx(fill([blank('So','May.',['does','do']),blank('Neither','I.',['do','does'])],['does','do']),'I like rice; May likes rice too.\nBen does not like coffee; I do not like it either.'),'新主语May用does，I用do。'),
q('e-had','独立辨认实义had','B昨天也吃过午饭，用so回应哪句符合本课？',choice(['So did I.','So had I.','So have I.'],'So did I.',{context:'A: “I had lunch at noon yesterday.” B had lunch at noon yesterday too.'}),'had lunch是一般过去活动，不是have＋过去分词结构。'),
q('e-modals','独立保留will与could','按两组时间与能力事实补全。',ctx(fill([blank('So','I.',['will','do']),blank('Neither','I.',['could','can'])],['will','could']),'A will help tomorrow, and B will help too; B replies first.\nC could not hear the bell yesterday, and D could not either; D replies second.'),'不能把将来计划和过去能力的动词随意换掉。'),
q('e-must','独立保留同一要求','规则也要求B带票，用so回应。',choice(['So must I.','So can I.','So did I.'],'So must I.',{context:'A must bring a ticket. B must bring a ticket too.'}),'保持must的要求含义。'),
q('e-got','独立使用have got回应','你扮演B，也有零钱，按have got结构回应。',choice(['So have I.','So am I.','So will I.'],'So have I.',{context:'A: “I’ve got some small change.” B has got some small change too.'}),'拥有结构按本课使用have。'),
q('e-perfect','独立匹配完成时与新主语','按已完成／未完成资料补全。',ctx(fill([blank('So','May.',['has','have']),blank('Neither','we.',['have','has'])],['has','have']),'Ben has finished; May has finished too.\nAnna has not seen the film; we have not seen it either.'),'保留完成时，has／have与新主语搭配。'),
q('e-progressive','独立匹配正在进行的动作','按当前事实补全。',ctx(fill([blank('So','Tom.',['is','does']),blank('Neither','they.',['are','do'])],['is','are']),'Mia is writing now; Tom is writing too.\nI am not reading now; they are not reading either.'),'进行时保留be，不把所有动作都交给do。'),
q('e-order','独立组织否定倒装','B也不能开门，用neither拼句。',ctx(bank(['Neither','can','I','can’t'],'Neither can I',3),'A cannot open the door. B cannot open it either.'),'保持Neither＋can＋I，避免重复否定。'),
q('e-endings','独立使用too与either','按相同事实补好句末词。',ctx(fill([blank('I can swim,',' .',['too','either']),blank('I can’t drive,',' .',['either','too'])],['too','either']),'A can swim and B can swim too; B replies first.\nC cannot drive and D cannot drive either; D replies second.'),'肯定补充用too，否定补充用either。'),
q('e-no-none','独立区分no与none','明确没有信封，补全两种说法。',ctx(fill([blank('I’ve got','envelopes.',['no','none']),blank('I’ve got',' .',['none','no'])],['no','none']),'The speaker has zero envelopes.'),'no后面保留名词，none代替前文名词。'),
q('e-rewrite','独立保留改写中的过去式','I didn’t see any cars.改成no表达。',fill([blank('I','',['saw','see']),blank('','cars.',['no','any'])],['saw','no']),'去掉didn’t后仍要用过去式saw，并保留否定数量。'),
q('e-scope','独立保持none of的范围','按完整检查记录，哪句准确？',choice(['None of the four people can change the note.','Nobody anywhere can ever change a note.','All four people can change the note.'],'None of the four people can change the note.',{context:'All four named people have been checked.\nEach is unable to change this note. No other people were checked.'}),'只对已检查的四人作结论，不扩大为任何人。'),
q('e-mass','独立理解none指不可数数量','问还有多少牛奶，事实是一点也没有，可以回答None吗？',choice(['可以，none可承接牛奶的零数量','不可以，none只能用于至少三件物品','不可以，none必定表示有一些'],'可以，none可承接牛奶的零数量',{context:'How much milk is left? The container is empty.'}),'none可以指不可数数量，不设至少三件的门槛。'),
q('e-nor','独立识别nor合法回应','表达“我也不能”，哪项准确？',choice(['Neither can I与Nor can I都可用','Nor can I在所有场合都错误','必须说Neither can’t I'],'Neither can I与Nor can I都可用'),'指定练习形式不等于其他合法形式错误。'),
q('e-unknown','独立识别缺少第二人事实','只知道A喜欢巧克力，不知道B是否喜欢，能直接替B选So do I吗？',choice(['不能，需要B的实际喜好','能，前句肯定就自动选择so','能，所有回应都必须赞同'],'不能，需要B的实际喜好'),'附和表达要有第二人的事实依据。'),
q('e-negative-yes','独立按有物品回答否定问句','A确实有硬币，怎样回答Haven’t you got any coins?',choice(['Yes, I have.','No, I haven’t.','Neither can I.'],'Yes, I have.',{context:'A has three coins and is answering about possession.'}),'有硬币用Yes, I have，不被否定问句误导。'),
q('e-negative-no','独立按无物品回答否定问句','B没有硬币，怎样回答Haven’t you got any coins?',choice(['No, I haven’t.','Yes, I have.','So have I.'],'No, I haven’t.',{context:'B has no coins and is answering about possession.'}),'没有用No, I haven’t，保留拥有结构。'),
q('e-except','独立选择except后的人称形式','两人表达“我们俩除外”，补好原文短语。',fill([blank('Except',' .',['us','we'])],['us']),'except后用宾格us；I作倒装回应的主语与这里的宾语用法不同。')
];
unit.learning.REFERENCE=[
'本课主线是把另一个人的相同情况说简洁：肯定事实用so＋be／助动词／情态动词＋新主语；否定事实用neither或nor＋动词＋新主语。先核对第二人的真实情况，不能只见肯定句就自动赞同，也不能要求孩子假装自己有相同喜好或能力。',
'动词要与前句的时态、结构和新主语一致。现在be用am／is／are，过去用was／were；一般现在实义动作用do／does，过去动作用did；can／could／will／must按原句含义保留。例：He is ready. So am I；I like it. So does May。',
'have got拥有结构与完成时都可能用have／has回应，但含义不同。He has finished与I’ve got some change分别表示完成和拥有；回应的新主语仍决定have还是has。had a swim／had lunch中的had是过去活动，不是过去完成时，按本课用So did I。',
'neither／nor已经包含否定，Neither can I不再加not。完整否定句加either则保留正常语序，如I can’t, either；肯定完整句可在句末加too。否定附和的nor是合法形式，指定neither练习并不表示nor普遍错误。',
'本课练的是换一个人也如此，不把So do I与So I do混成同一种表达。后者在其他语境可用于确认原说法，这里不拿它来报告另一个人的相同情况；不需要扩展成额外语气测验。',
'no直接放在名词前，none单独承接已提到的数量；none of用于已限定的集合。none既可指可数物品，也可指不可数的水、零钱等，不能把群体用法的三者以上说明当成所有none用法的门槛。涉及两项时本课不把none of与neither of设成歧义唯一答案题。',
'I haven’t got any money／I’ve got no money／I’ve got none在已知money语境都表达零数量。改写不删除过去时间：I didn’t see any cars → I saw no cars，去掉didn’t后需恢复saw。不能在本课标准零数量表达中叠用not和no来制造重复否定。',
'none of our passengers只涉及所指乘客群体。否定数量与neither作为“也不”的回应用途分开；这里不以none后动词单复数的合法变体设唯一判错题。原文用can避免了这一形式歧义。',
'Haven’t you got any small change?按实际有无回应：有用Yes, I have；没有用No, I haven’t。原文男子说没有零钱，不说明他没有钱或所有财产。十英镑是纸币面额，课文没有给车费。',
'售票员说乘客都是millionaires是人物概括，不是财富核实。tramp是教材对两个人物的称呼，图片按角色辨认，不凭现实人的衣着推断住处、财富或品格，也不把能否帮忙变成群体评价。',
'末尾两人表示有零钱，没有给出精确总额；有零钱不保证足够换开十英镑。You must get off是要求，不证明男子已下车。原文没有确认换钞、买票、交钱或抵达结果，场景不补写这些结局。',
'114课o–z完整保留；B按例设定无所问物品，C／D由另一个教材角色回应相同情况，而非从一个人的句子推知所有人的事实。A保留否定数量、时态及地点，B每题三句，C／D每题两种回应。课堂先分配角色条件，不要求学生照抄成自己的真实经历。'
];
unit.learning.MODEL_TITLE='课本小参考 · 114课o–z回应';
unit.learning.REPLY_MODELS=[['前句用法','动词选择','回应例子'],['现在be','am / is / are','So am I.'],['过去be','was / were','Neither was I.'],['一般现在动作','do / does','So does May.'],['一般过去动作','did','Neither did I.'],['have got / 完成时','have / has','So have I.'],['情态动词','can / could / will / must','Neither can I.'],['完整否定补充','主语＋否定谓语＋either','I can’t, either.']];
unit.learning.MODELS=[
['o · Have you got any chocolate?','问有没有巧克力。','chocolate'],
['p · I haven’t got any. I’ve got no chocolate. I’ve got none.','三种零数量表达，承接巧克力。','none'],
['q · I haven’t any either. Neither have I.','第二人的同样否定；保留教材英式拥有结构。','neither'],
['r · Have you got any envelopes?','问有没有信封。','envelope'],
['s · I haven’t got any. I’ve got no envelopes. I’ve got none.','信封数量为零的三种表达。','none'],
['t · I haven’t any either. Neither have I.','第二人也没有信封。','neither'],
['u · Have you got any cake?','问有没有蛋糕。','cake'],
['v · I’ve got some.','肯定有一些。','some'],
['w · So have I.','第二人也有一些蛋糕。','so'],
['x · Have you got any biscuits?','问有没有饼干。','biscuit'],
['y · I’ve got some.','肯定有一些。','some'],
['z · So have I.','第二人也有一些饼干。','so']
].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 用no改写',answerLines:1,instruction:'保留4题；否定数量、原时态和地点都不变。去掉didn’t后实义动词要恢复过去式。',examples:['There isn’t any milk in that bottle. → There is no milk in that bottle.'],items:['There aren’t any books on that shelf.','I haven’t got any money.','There isn’t any coffee in this tin.','I didn’t see any cars in the street.']},
{title:'B · 写出三种零数量回答',answerLines:3,instruction:'保留4题，每题按例写三句。角色设定为没有所问物品；问句本身不证明数量为零。原例保留作句式阅读。',examples:['Have you got any beer? → No, I haven’t got any beer. I’ve got no beer. I’ve got none.'],items:['Have you got any milk?','Have you got any envelopes?','Have you got any magazines?','Have you got any bread?']},
{title:'C · 表达“我也不……”',answerLines:2,instruction:'保留6题，每题写neither倒装回应和正常语序的either句，共两句。由另一位情况相同的教材角色回应，先核对时态和动词，不要求自己的事实也相同。',examples:['I’m not tired. → Neither am I. I’m not tired, either.'],items:['I’m not hungry.','I didn’t meet him.','I wasn’t at church yesterday.','I don’t like ice cream.','I can’t swim.','I’m not a doctor.']},
{title:'D · 表达“我也……”',answerLines:2,instruction:'保留6题，每题写so倒装回应和带too的完整句，共两句。另一位角色的事实按练习设定相同，不能只从第一人的话推断。',examples:['I’m tired. → So am I. I’m tired, too.'],items:['I’m hungry.','I met him.','I was at church yesterday.','I like ice cream.','I can swim.','I’m a doctor.']}
];
core.unit113114=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit113114,excerpts={"u113114-v1-r-destination":[0,1],"u113114-v1-r-note":[2,3],"u113114-v1-r-first-pair":[4,5,6,7],"u113114-v1-r-second-pair":[8,9,10],"u113114-v1-r-tramps":[11,12,13,14],"u113114-v1-e-outcome":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]},speakers={"conductor":"Conductor","man":"Man","p1":"1st Passenger","p2":"2nd Passenger","p3":"3rd Passenger","p4":"4th Passenger","tramps":"Two Tramps","t1":"1st Tramp","t2":"2nd Tramp"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 113',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
