(function(root){
'use strict';
const core=root.CanranCore, image=name=>'/assets/unit91-92/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页186–189／PDF219–222';
const grammarSource='《同步导学》Grammar纸页160–161／PDF174–175；《语法练习册》纸页260–265／PDF274–279';
const rows=[
['still','还；仍旧','/stɪl/','still'],['move','搬家','/muːv/','move'],['miss','想念；思念','/mɪs/','miss'],['neighbour','邻居','/ˈneɪbə/','neighbour'],['person','人；一个人','/ˈpɜːsən/','person'],['people','人们','/ˈpiːpəl/','people'],
['poor','可怜的（本课含义）','/pɔː/','miss'],['tomorrow','明天','/təˈmɒrəʊ/','calendar'],['the day after tomorrow','后天','/ðə deɪ ˈɑːftə təˈmɒrəʊ/','calendar'],['tonight','今晚','/təˈnaɪt/','night'],['regards','问候；致意','/rɪˈɡɑːdz/','regards'],['will','将；会','/wɪl/','future'],
['rain','下雨','/reɪn/','rain'],['snow','下雪','/snəʊ/','snow'],['leave','离开','/liːv/','leave'],['get up','起床','/ɡet ʌp/','bed'],['arrive','到达','/əˈraɪv/','arrive'],['finish work','结束工作','/ˈfɪnɪʃ wɜːk/','work'],
['have a holiday','度假','/hæv ə ˈhɒlədeɪ/','holiday'],['drive home','开车回家','/draɪv həʊm/','car'],['have a haircut','理发','/hæv ə ˈheəkʌt/','haircut'],['telephone me','给我打电话','/ˈtelɪfəʊn miː/','phone'],['have a shave','刮胡子','/hæv ə ʃeɪv/','shave'],['pack his bags','整理他的行李','/pæk hɪz bæɡz/','bags'],
['sweep the floor','扫地','/swiːp ðə flɔː/','broom'],['paint this room','粉刷这个房间','/peɪnt ðɪs ruːm/','paint'],['repair my car','修理我的汽车','/rɪˈpeə maɪ kɑː/','repair'],['make an appointment','预约','/meɪk ən əˈpɔɪntmənt/','calendar'],['shall','将；会（本课用于I／we）','/ʃæl/','future'],['soon','不久；很快','/suːn/','clock']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit91-92',version:1,contentRevision:'neighbours-future-v1',mode:'classroom',title:'邻居们的明日约定',path:'/unit91-92/',start:'learn/words',progress:{learningKey:'canran:unit91-92:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'街角的邻居们',activities:[['words','邻里小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'聊聊搬家的消息',activities:[['text','邻里小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说说明天会怎样',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'整理邻里的约定',activities:[['apply','约定小帮手','give']],required:['apply']},
{id:'l5',title:'完成明日挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'neighbour',storyQuestion:'谁想离开这幢房子？',completionTitles:{listen:'邻里词语认清啦！',roles:'搬家消息读懂啦！',grammar:'将来的话会说啦！',apply:'邻里约定整理好啦！',exam:'明日挑战完成！'},reward:{edition:'neighbours-future-v1',title:'明日约定小达人',lesson:'Lesson 91–92',scene:'/assets/unit91-92/keepsake-story-v1.webp',alt:'Catherine、Jenny和Linda在屋外谈论Ian明天的搬家安排与问候',color:'#6a8e89',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','约定小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={catherine:'Catherine',jenny:'Jenny',linda:'Linda'};
unit.learning.DIALOGUE=[
['catherine','Has Ian sold his house yet?','Ian已经把房子卖掉了吗？'],
['jenny','Yes, he has. He sold it last week.','是的，卖掉了。他上星期卖的。'],
['catherine','Has he moved to his new house yet?','他已经搬进新房子了吗？'],
['jenny','No, not yet. He’s still here. He’s going to move tomorrow.','还没有。他仍在这里。他打算明天搬家。'],
['catherine','When? Tomorrow morning?','什么时候？明天上午吗？'],
['jenny','No. Tomorrow afternoon. I’ll miss him. He has always been a good neighbour.','不，明天下午。我会想念他的。他一直是个好邻居。'],
['linda','He’s a very nice person. We’ll all miss him.','他是个很好的人。我们都会想念他。'],
['catherine','When will the new people move into this house?','新住户什么时候搬进这幢房子呢？'],
['jenny','I think that they’ll move in the day after tomorrow.','我想他们会在后天搬进来。'],
['linda','Will you see Ian today, Jenny?','Jenny，你今天会见到Ian吗？'],
['jenny','Yes, I will.','是的，我会见到他。'],
['linda','Please give him my regards.','请代我问候他。'],
['catherine','Poor Ian! He didn’t want to leave this house.','可怜的Ian！他本来不想离开这幢房子。'],
['jenny','No, he didn’t want to leave, but his wife did!','是啊，他不想离开，可是他妻子想离开！']
].map(([who,text,cn],i)=>({id:'u9192-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u9192-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-move','搬家动作','哪一个词表示“搬家”？',choice(['move','rain','shave'],'move',{optionImages:{move:image('move'),rain:image('rain'),shave:image('shave')}}),'move在本课是搬家。'),
q('v-still','still表示状态仍在继续','“He’s still here.” 告诉我们什么？',choice(['他仍然在这里','他已经搬走','他从没来过这里'],'他仍然在这里'),'still表示仍旧。'),
q('v-people','人与邻里的词义','把词语与含义配好。',match([['person','一个人'],['people','人们'],['neighbour','邻居']]),'person指人；people在这里表示复数的人们。'),
q('v-miss','miss在语境中的意思','点出表示“想念”的词。',{type:'locate',fragments:['We’ll ',{value:'all'},' ',{value:'miss'},' ',{value:'him'},'.'],options:['all','miss','him'],answer:'miss'},'miss him表示想念他。'),
q('v-poor','poor的语境含义','邻居说“Poor Ian!”是在表达什么？',choice(['对Ian的不舍与同情','Ian一定没有钱','Ian是新来的住户'],'对Ian的不舍与同情'),'poor在本课是可怜的，不能推断经济状况。'),
q('v-time','未来时间词义','配好三个时间表达。',match([['tomorrow','明天'],['the day after tomorrow','后天'],['tonight','今晚']]),'今天、明天、后天以说话当天为参照。'),
q('v-regards','代为问候','“Please give him my regards.” 是请求什么？',choice(['请代我问候他','请把我的房子送给他','请告诉他已经搬完了'],'请代我问候他'),'regards在这里表示问候。'),
q('v-actions','92课动作词组','把三项准备工作配好。',match([['pack his bags','整理他的行李'],['sweep the floor','扫地'],['make an appointment','预约']]),'这些短语描述不同动作，不能互换。')
];
unit.questions.roles=[
q('r-sale','出售已经发生','Ian什么时候卖掉了房子？',choice(['上星期','明天下午','还没有卖掉'],'上星期'),'He sold it last week。'),
q('r-move','出售不等于搬走','谈话发生时，Ian在哪里？',choice(['仍在这里，尚未搬走','已经住进新房','已经搬到新住户家'],'仍在这里，尚未搬走'),'No, not yet. He’s still here。'),
q('r-time','纠正上午下午','Ian打算什么时候搬家？',choice(['明天下午','明天上午','今天晚上'],'明天下午'),'Jenny纠正了Catherine猜的上午。'),
q('r-new','推测不当作既成事实','Jenny怎样说新住户的入住时间？',choice(['她认为他们后天会搬进来','他们昨天已经搬进来','他们一定永远不搬来'],'她认为他们后天会搬进来'),'I think表示她的判断，并非入住已经发生。'),
q('r-regards','说话人与传话人','是谁请谁代为问候Ian？',choice(['Linda请Jenny代为问候','Jenny请Ian问候Linda','Catherine请新住户问候Ian'],'Linda请Jenny代为问候'),'Linda问Jenny今天是否见Ian，再请她传达问候。'),
q('r-neighbour','评价的原文依据','邻居怎样评价Ian？',choice(['他一直是好邻居，大家会想念他','大家都不认识他','大家都不想再见他'],'他一直是好邻居，大家会想念他'),'good neighbour和nice person支持这个答案。'),
q('r-wife','did省略的内容','结尾“but his wife did”指妻子怎样？',choice(['妻子想离开这幢房子','妻子已经问候Linda','妻子不想离开'],'妻子想离开这幢房子'),'did代替前文want to leave。'),
q('r-no','否定事实与中文回应','Jenny说“No, he didn’t want to leave”是？',choice(['同意Ian不想离开','说Ian很想离开','说Ian从未住过这里'],'同意Ian不想离开'),'英语No与didn’t保持否定事实，中文可译为“是啊，他不想离开”。')
];
unit.questions.grammar=[
g('base','will后接动词原形','明天她会打电话。补好动词。',fill([blank('She will','me tomorrow.',['telephone','telephones','telephoned'])],['telephone']),'will后的动词用原形，主语是she也不加s。','先找will后面的动词。',model(['He will arrive on Friday.','will后用arrive。'])),
g('state','将来状态保留be','明天他会很忙；下周他们会有空。',fill([blank('He will','busy tomorrow.',['be','is']),blank('They will','free next week.',['be','are'])],['be','be']),'busy和free前需要be，will后用原形be。','形容词前还需要什么？',model(['I will be at home tonight.','在家这个状态用will be。'])),
g('short','肯定缩写与否定缩写','把长写和缩写配好。',match([['I will','I’ll'],['they will','they’ll'],['will not','won’t']]),'will常缩成’ll；will not缩成won’t。','注意否定缩写的拼法。',model(['We will help. → We’ll help.','will可以缩写，意思不变。'])),
g('negative','will否定句','已确认他明天不来。补好否定句。',fill([blank('He','come tomorrow.',['won’t','doesn’t will','isn’t will'])],['won’t']),'will not／won’t后接动词原形。','will自己变否定，不再加does。',model(['She will not leave today.','not放在will后面。'])),
g('question','will一般疑问句','你明天会见她吗？',bank(['Will','you','see','her','tomorrow','Do'],'Will you see her tomorrow',5,'?'),'Will放在主语前，后面的动词仍用原形。','想想Will的位置。',model(['Will he arrive tonight?','Will＋主语＋动词原形。'])),
g('answers','按明确安排回答will问句','Lily说会来；Tom说不会来。补全简答。',fill([blank('Will Lily come? — Yes, she',' .',['will','is']),blank('Will Tom come? — No, he',' .',['won’t','doesn’t'])],['will','won’t']),'简答沿用will／won’t，肯定简答不缩成she’ll。','回应要和安排一致。',model(['Will they help? — Yes, they will.','问句与简答都保留will。'])),
g('when','When询问将来时间','他什么时候结束工作？',bank(['When','will','he','finish work','Where'],'When will he finish work',4,'?'),'When询问什么时候，Will放在主语前。','不是询问地点。',model(['When will she leave? — Tomorrow.','When问时间。'])),
g('calendar','后天有固定参照','资料中的今天是星期一。从现在起两天后是？',choice(['星期三','星期二','星期日'],'星期三',{context:'Today: Monday\nin two days’ time = two days from now'}),'后天是今天之后两天。','以资料中的今天为准。',model(['Today: Thursday → tomorrow: Friday','相对时间跟随说话当天。'])),
g('plan','going to表示已有打算','他们已经打算周末搬家。补全句子。',fill([blank('They','going to move this weekend.',['are','is']),blank('She is going to','her bags.',['pack','packs'])],['are','pack']),'am／is／are going to后接动词原形，表示打算。','be随主语变化，to后的动词用原形。',model(['I am going to visit Jenny.','已有打算，可以用be going to。'])),
g('prediction','going to也表示有依据的预测','乌云密布，大家判断要下雨。“It’s going to rain.”表示？',choice(['根据眼前迹象预测要下雨','雨已经下完','人们计划制造一场雨'],'根据眼前迹象预测要下雨'),'going to不仅能说计划，也能表示根据迹象作出的预测。','天空的变化是判断依据。',model(['Look at the bag! It is going to fall.','根据眼前情况作出预测。'])),
g('arrangement','be to表示安排','公告写着“The team is to meet at nine.”是什么意思？',choice(['队伍按安排九点集合','队伍九点已经散会','队伍正在九点这个地方'],'队伍按安排九点集合'),'be to＋动词原形可表示计划或正式安排。','公告在说明安排。',model(['The visitors are to arrive at ten.','按安排，来访者十点到。'])),
g('immediate','be about to表示马上要','“The film is about to start.” 电影处于什么状态？',choice(['马上就要开始','已经播放完毕','只计划在明年拍摄'],'马上就要开始'),'be about to表示即将、马上发生。','注意是开始前的哪一刻。',model(['The train is about to leave.','列车马上要出发。'])),
g('shall','认识I与we的shall表达','“We shall return tomorrow.”里shall后应当用？',choice(['return原形','returns三单','returned过去式'],'return原形'),'本课I／we可用shall表达将来；日常也常用will。','shall和will后都接什么形式？',model(['I shall see you again.','I／we也可用shall，不代表不能用will。'])),
g('exist','there will be将来存在','明天会有一场演出。',fill([blank('There will','a show tomorrow.',['be','have'])],['be']),'there be表示有、存在；将来形式是there will be。','不要把存在句换成拥有。',model(['There will be two meetings next week.','will后用be，单复数都一样。'])),
g('independent-state','独立表达将来状态','明天她会在家，但不会有空。',fill([blank('She will','at home tomorrow.',['be','is']),blank('She','be free.',['won’t','doesn’t'])],['be','won’t']),'will be说状态；won’t be否定状态。'),
g('independent-time','独立询问时间与回答','资料：Ben明天晚上到达。你需要问到达时间。',choice(['When will Ben arrive? — Tomorrow evening.','Where will Ben arrive? — Tomorrow evening.','When did Ben arrive? — Yesterday.'],'When will Ben arrive? — Tomorrow evening.'),'When问时间；尚未发生的到达用will。'),
g('independent-plan','独立区分完成与打算','只知道她打算明天整理行李，现在能确定什么？',choice(['有明天整理的打算，不能说已经整理好','她已经整理好行李','她不可能改变打算'],'有明天整理的打算，不能说已经整理好',{context:'She is going to pack her bags tomorrow.\nNo completed packing is recorded.'}),'打算不等于动作已经完成，也不保证未来一定不变。'),
g('independent-rewrite','92课过去与未来的形式','资料明确说昨天做了、明天也会做。补好两处。',fill([blank('He','up late yesterday.',['got','get']),blank('He will','up late tomorrow, too.',['get','got'])],['got','get']),'昨天那次用got；will后回到get。明天的预测来自明确资料，不能只凭昨天推断。')
];
unit.questions.apply=[
q('a-message','完整保留代为问候的对象','Linda请Jenny代她问候Ian。该记哪一条？',choice(['Linda → Jenny → Ian','Ian → Linda → Jenny','Jenny → Ian → Linda'],'Linda → Jenny → Ian',{context:'Linda: Please give Ian my regards.\nJenny will see Ian today.'}),'请求来自Linda，传话人Jenny，接收者Ian。'),
q('a-calendar','按固定日期整理搬家日程','这个练习的谈话日在6月10日。Ian明天下午搬家，应记在？',choice(['6月11日下午','6月11日上午','6月12日下午'],'6月11日下午',{context:'Conversation day: 10 June\nIan: tomorrow afternoon\nNew people: probably the day after tomorrow'}),'以题面指定日期计算，不取设备今天。'),
q('a-reply','根据明确承诺回应','Jenny确认今天会见Ian。替她回答。',choice(['Yes, I will.','Yes, I’ll.','Yes, I did.'],'Yes, I will.',{context:'Will you see Ian today?\nJenny: I will see him today.'}),'肯定简答保留will，不用孤立的I’ll。'),
q('a-help','回应眼前需要的帮助','朋友刚说箱子太重。你愿意帮忙，选下一句。',choice(['I’ll help you.','I helped you yesterday.','I won’t see you again.'],'I’ll help you.',{context:'This box is too heavy.\nYou decide to help now.'}),'I’ll help you可作当下提出的帮助；选中后还需检查。'),
q('a-plan','记录计划而不是完成','选择笔记中能准确保留意思的一句。',choice(['They are going to pack tomorrow.','They have already packed.','They packed yesterday.'],'They are going to pack tomorrow.',{context:'Plan: pack tomorrow\nPacking is not finished now.'}),'计划栏不能写成已完成。'),
q('a-ask','在新任务中组织When问句','问修理员：你什么时候修我的汽车？',bank(['When','will','you','repair','my car','did'],'When will you repair my car',5,'?'),'When will you repair my car?问将来时间。'),
q('a-notice','识别正式安排与马上发生','将每条信息放到对应说明。',match([['The team is to meet at nine.','按正式安排集合'],['The bus is about to leave.','马上就要出发'],['I am going to paint this room.','打算粉刷房间']]),'不同结构的重点不同，不把about to理解为遥远的计划。'),
q('a-boundary','保留预测的不确定性','新住户信息怎样记录才准确？',choice(['Jenny认为他们后天会来，尚未入住','新住户已经入住','新住户的名字和职业已确定'],'Jenny认为他们后天会来，尚未入住',{context:'Jenny: I think that they’ll move in the day after tomorrow.'}),'原文给出判断和时间，没有姓名、职业或已入住的事实。')
];
unit.questions.exam=[
q('e-story','综合辨别已经与尚未','哪一条符合本课谈话时的情况？',choice(['房子已售，Ian尚未搬走','房子未售，Ian已搬走','新住户昨天已经入住'],'房子已售，Ian尚未搬走'),'两个事件不能混为一谈。'),
q('e-speaker','综合核对人物意愿','结尾说谁想离开这幢房子？',choice(['Ian的妻子','Ian自己','Linda'],'Ian的妻子'),'his wife did中的did替代want to leave。'),
q('e-words','语境词义迁移','朋友将搬走，你说“I’ll miss you.”表示？',choice(['我会想念你','我会错过你的火车','我会卖掉你的房子'],'我会想念你'),'miss在此是想念。'),
q('e-person','一个人与人们的表达','补全两个意思明确的句子。',fill([blank('She is a kind',' .',['person','people']),blank('These','are our neighbours.',['people','person'])],['person','people']),'a kind person是一个人；these people是这些人。'),
q('e-base','将来动作形式迁移','我们明天会粉刷房间。',fill([blank('We will','this room tomorrow.',['paint','painted','painting'])],['paint']),'will后接原形paint。'),
q('e-be','将来状态形式迁移','他下周会在上海。',fill([blank('He will','in Shanghai next week.',['be','is','was'])],['be']),'will后接be表示将来状态。'),
q('e-negative','将来否定动作','安排明确：她今晚不打电话。补全句子。',fill([blank('She','telephone tonight.',['won’t','didn’t','doesn’t will'])],['won’t']),'won’t＋原形。'),
q('e-question','独立组织will问句','他们明天会到吗？',bank(['Will','they','arrive','tomorrow','Do'],'Will they arrive tomorrow',4,'?'),'Will＋主语＋原形。'),
q('e-short-answer','按否定安排简答','他们明确说下周不来。回答Will they come next week?',choice(['No, they won’t.','No, they don’t.','Yes, they will.'],'No, they won’t.'),'事实为不来，沿用won’t。'),
q('e-when','独立组织When问句','她什么时候打电话给你？',bank(['When','will','she','telephone','you','Where'],'When will she telephone you',5,'?'),'When问将来时间。'),
q('e-contractions','92课A缩写迁移','把缩写和完整形式配好。',match([['he’ll','he will'],['it’ll','it will'],['won’t','will not']]),'缩写不改变时间与肯否。'),
q('e-timeline','明天后天的独立定位','练习中今天是星期五；后天晚上对应？',choice(['星期日晚上','星期六晚上','星期四晚上'],'星期日晚上',{context:'Today: Friday'}),'后天是今天之后两天。'),
q('e-night','92课night时间表达','the night after next在本课时间表中对应？',choice(['后天夜里','明天上午','昨天夜里'],'后天夜里'),'时间表中tonight、tomorrow night、the night after next依次对应今晚、明晚、后晚。'),
q('e-going','已有打算的结构迁移','她早已打算去度假。',fill([blank('She','going to have a holiday.',['is','are']),blank('They are going to','home.',['drive','drove'])],['is','drive']),'be随主语变化，going to后用原形。'),
q('e-evidence','根据迹象预测','杯子已滑到桌边。“It is going to fall.”表达？',choice(['根据眼前迹象预测快掉下去','杯子计划自己走路','杯子已经被修好了'],'根据眼前迹象预测快掉下去'),'going to也能说明有迹象支持的预测。'),
q('e-to','正式安排迁移','公告“The visitors are to arrive at ten.”说明？',choice(['按安排来访者十点到达','来访者十点已经离开','来访者十点总是睡觉'],'按安排来访者十点到达'),'be to在此说明安排。'),
q('e-about','即将发生的迁移','车门正在关，车马上出发。哪句表达“即将出发”？',choice(['The bus is about to leave.','The bus left yesterday.','The bus will be repaired next year.'],'The bus is about to leave.'),'about to突出马上。'),
q('e-shall','shall用法边界','关于“I shall return”与“I will return”，哪项正确？',choice(['这里两种都可表达我将回来','I后永远不能用will','shall后必须用returned'],'这里两种都可表达我将回来'),'不能把I／we可用shall教成必须用shall。'),
q('e-there','将来存在句迁移','明天会有两场活动。',fill([blank('There will','two activities tomorrow.',['be','have','are'])],['be']),'There will be不随后面的数量改成are。'),
q('e-transform','92课B同时保留过去事实和未来预测','资料明确：昨天下雪，预报明天也下雪。',fill([blank('It','yesterday.',['snowed','snow']),blank('It will','tomorrow, too.',['snow','snowed'])],['snowed','snow']),'过去用snowed，will后用snow；预测有题面依据。'),
q('e-no-inference','不能从昨天推定明天','只知道昨天她扫过地，能确定明天她也会扫吗？',choice(['不能，需要明天安排或其他依据','能，昨天做过明天必做','能，过去式自动表示将来'],'不能，需要明天安排或其他依据',{context:'She swept the floor yesterday.\nNo plan for tomorrow is given.'}),'92课B给定明天也做的练习情境，现实中不能据昨天直接推定明天。'),
q('e-help','新情境主动帮助','朋友说忘带笔，你当下决定借他一支。回应？',choice(['I’ll lend you a pen.','I borrowed your pen last year.','I won’t help you.'],'I’ll lend you a pen.'),'I’ll可以表达当下愿意提供帮助。'),
q('e-did','结尾省略的迁移','Tom didn’t want to leave, but Anna did. 哪句正确？',choice(['Anna想离开','Anna已经离开三天','Tom和Anna都不想离开'],'Anna想离开'),'did承接want to leave，不证明动作已完成。'),
q('e-whole','综合解释计划与时间','今天6月20日；Mia打算后天下午整理行李，尚未整理。正确笔记是？',choice(['Mia plans to pack on 22 June in the afternoon.','Mia has already packed on 20 June.','Mia plans to pack on 21 June in the morning.'],'Mia plans to pack on 22 June in the afternoon.'),'固定日期、下午与未完成的计划三项都要保留。')
];
unit.learning.REFERENCE=[
'将来可以说尚未发生的动作或状态：will／shall＋动词原形。I／we可用shall，日常也常用will；不能说I后只能用shall。',
'She will arrive.／She will be busy. 动作直接接原形，状态需要be。否定will not＝won’t；Will you come? — Yes, I will.／No, I won’t. 肯定简答不用孤立的I’ll。',
'When will he leave?问时间；Where will he go?问地点。今天、明天和后天按说话当天计算，题目中的日期和钟点由资料明确给出。this morning可能已过去，也可能尚未到来，要看当前时间。',
'常见将来时间：tomorrow明天，the day after tomorrow后天，next week下周，in two days’ time从现在起两天后，from now on从现在起，in the future将来。this month只是本月，不单凭这个词就判断时态，要看事情是否已经发生。',
'be going to＋原形：已有打算，如I am going to pack；也可根据眼前迹象预测，如Look at the clouds. It is going to rain. 不能把going to一律说成计划。',
'be to＋原形可表示正式安排：The team is to meet at nine.；be about to＋原形强调马上：The train is about to leave. 本课不将about to与遥远的将来日期拼接。',
'There will be a show. 表示将有演出，不是There will have。新增情境先看英文资料，再判断时间与状态。',
'92课A练缩写；B在练习约定下补充“明天也会如此”。昨天做过并不自动证明明天会做，本课线上题会明确给出明天的安排或预测。',
'Ian已卖房，却尚未搬走；Jenny认为新住户后天会来，未说已入住。Linda请Jenny代为问候，不等于问候已传达。',
'No, he didn’t want to leave是在认同否定事实；but his wife did省略want to leave。poor在本课是可怜的，不说明贫穷。person与people按本课“一个人／人们”学习，不泛化为所有含义。'
];
unit.learning.MODEL_TITLE='课本小参考 · 时间表与16组动作';
unit.learning.TIMES=[['TODAY','TOMORROW','THE DAY AFTER TOMORROW'],['this morning','tomorrow morning','the day after tomorrow in the morning'],['this afternoon','tomorrow afternoon','the day after tomorrow in the afternoon'],['this evening','tomorrow evening','the day after tomorrow in the evening'],['tonight','tomorrow night','the night after next']];
unit.learning.MODELS=rows.slice(12,28).map(([en,cn,,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 将will改成缩写',instruction:'保留课本4题。只改变长写／缩写，不改变句子的意思。',examples:['It will rain tomorrow. → It’ll rain tomorrow.'],items:['He will arrive tomorrow morning.','She will come this evening.','It will snow tonight.','He will not believe me.']},
{title:'B · 确认昨天的事，再补充明天的预测',instruction:'保留课本8题。本练习约定明天也会发生；这不是从昨天推断明天一定相同。',examples:['It rained yesterday. → Yes, and it will rain tomorrow, too.'],items:['It snowed yesterday.','He got up late yesterday.','He arrived late yesterday.','He finished work late yesterday.','She drove to London yesterday.','She telephoned him yesterday.','He had a shave yesterday.','She swept the floor yesterday.']}
];
core.unit9192=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit9192,excerpts={"u9192-v1-r-sale":[0,1],"u9192-v1-r-move":[2,3],"u9192-v1-r-time":[2,3,4,5],"u9192-v1-r-new":[7,8],"u9192-v1-r-regards":[9,10,11],"u9192-v1-r-neighbour":[5,6],"u9192-v1-r-wife":[12,13],"u9192-v1-e-speaker":[12,13]},speakers={"catherine":"Catherine","jenny":"Jenny","linda":"Linda"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 91',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
