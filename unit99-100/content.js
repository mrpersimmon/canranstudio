(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit99-100/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页202–205／PDF235–238';
const grammarSource='《同步导学》Grammar纸页171–172／PDF185–186；《语法练习册》纸页285–289／PDF299–303';
const rows=[
['ow','哎哟！','/aʊ/','ow'],['slip','滑倒','/slɪp/','slip'],['fall','落下；跌倒','/fɔːl/','fall'],['downstairs','往楼下','/ˌdaʊnˈsteəz/','downstairs'],['hurt','伤；伤害；疼痛','/hɜːt/','hurt'],['back','背（本课词义）','/bæk/','back'],
['stand up','站起来','/stænd ʌp/','stand-up'],['help','帮助','/help/','help'],['at once','立即','/ət wʌns/','at-once'],['sure','确信的','/ʃʊə/','sure'],['X-ray','X光检查','/ˈeks reɪ/','x-ray'],['licence','执照','/ˈlaɪsəns/','licence'],
['fell','fall的过去式','/fel/','fall'],['fallen','fall的过去分词','/ˈfɔːlən/','fall'],['tired','疲倦的','/ˈtaɪəd/','tired'],['thirsty','口渴的','/ˈθɜːsti/','thirsty'],['cold','冷的','/kəʊld/','cold'],['ill','生病的','/ɪl/','ill'],
['a cold','感冒','/ə kəʊld/','a-cold'],['a headache','头痛','/ə ˈhedeɪk/','headache'],['an earache','耳痛','/ən ˈɪəreɪk/','earache'],['a toothache','牙痛','/ə ˈtuːθeɪk/','toothache'],['a haircut','理发','/ə ˈheəkʌt/','haircut'],['some money','一些钱','/səm ˈmʌni/','money'],
['wait','等候','/weɪt/','wait'],['catch','赶上；抓住','/kætʃ/','catch'],['repair','修理','/rɪˈpeə/','repair'],['sell','卖','/sel/','sell'],['say','说','/seɪ/','say'],['think','认为；想','/θɪŋk/','think'],
['believe','相信','/bɪˈliːv/','believe'],['know','知道','/nəʊ/','know'],['understand','理解','/ˌʌndəˈstænd/','understand'],['afraid','担心的；I’m afraid也可委婉传达坏消息','/əˈfreɪd/','afraid'],['sorry','遗憾的；抱歉的','/ˈsɒri/','sorry']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit99-100',version:1,contentRevision:'clear-message-v1',mode:'classroom',title:'把话传清楚',path:'/unit99-100/',start:'learn/words',progress:{learningKey:'canran:unit99-100:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认清动作与感受',activities:[['words','转述小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进课文故事',activities:[['text','家中小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'接好一句话',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'传达人物的话',activities:[['apply','传话小帮手','give']],required:['apply']},
{id:'l5',title:'完成转述挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'help',storyQuestion:'Andy需要去看医生吗？',completionTitles:{listen:'动作与感受认清啦！',roles:'Andy的故事读懂啦！',grammar:'两句话接好啦！',apply:'人物的话传清楚啦！',exam:'转述挑战完成！'},reward:{edition:'clear-message-v1',title:'转述表达小达人',lesson:'Lesson 99–100',scene:'/assets/unit99-100/keepsake-story-v1.webp',alt:'Andy坐在楼梯旁，Lucy用电话联系医生',color:'#927eaa',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','传话小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={andy:'Andy',lucy:'Lucy'};
unit.learning.DIALOGUE=[
['andy','Ow!','啊哟！'],
['lucy','What’s the matter, Andy?','怎么了，Andy？'],
['andy','I slipped and fell downstairs.','我滑了一跤，从楼梯上摔下来了。'],
['lucy','Have you hurt yourself?','你摔伤了没有？'],
['andy','Yes, I have. I think that I’ve hurt my back.','是啊，摔伤了。我想我把背摔坏了。'],
['lucy','Try and stand up. Can you stand up? Here. Let me help you.','试着站起来。你能站起来吗？来，让我帮助你。'],
['andy','I’m sorry, Lucy. I’m afraid that I can’t get up.','对不起，Lucy。恐怕我站不起来。'],
['lucy','I think that the doctor had better see you. I’ll phone Dr. Carter.','我想最好请医生来给你看一下。我去给卡特医生打电话。'],
['lucy','The doctor says that he will come at once. I’m sure that you need an X-ray, Andy.','医生说他马上就来。Andy，我看你需要做一次X光检查。']
].map(([who,text,cn],i)=>({id:'u99100-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u99100-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-slip','slip的词义','哪一个词表示“滑倒”？',choice(['slip','help','sell'],'slip',{optionImages:{slip:image('slip'),help:image('help'),sell:image('sell')}}),'slip表示滑倒；本课故事里说slipped。'),
q('v-actions','动作与部位词义','把三个词配好。',match([['downstairs','往楼下'],['back','背'],['help','帮助']]),'这里back是身体部位，downstairs表示往楼下。'),
q('v-fall','fall的过去式','I slipped and fell downstairs.里的fell是什么？',choice(['fall的过去式','feel的原形','将要跌倒的标记'],'fall的过去式'),'fall—fell—fallen；hurt的三种形式相同。'),
q('v-hurt','定位hurt的词义','点出表示“伤到”的词。',{type:'locate',fragments:['I’ve ',{value:'hurt'},' my ',{value:'back'},'.'],options:['hurt','back'],answer:'hurt'},'hurt是伤到，back是背。'),
q('v-once','at once的含义','He will come at once.里的at once表示？',choice(['立即','一次又一次','很久以后'],'立即'),'at once在这里表示立即。'),
q('v-sure','sure表达人的确信','I’m sure that he can help.表达说话人什么态度？',choice(['说话人很确信','说话人明确否认','说话人正在问时间'],'说话人很确信'),'确信是说话人的态度，并不自动等于事情已经发生。'),
q('v-needs','100课事物名称','配好这三个表达。',match([['licence','执照'],['X-ray','X光检查'],['a haircut','理发']]),'a licence，an X-ray，a haircut。'),
q('v-cold','cold与a cold意义不同','She feels cold. / She has a cold.分别表示什么？',choice(['她觉得冷／她感冒了','她感冒了／她觉得冷','两句都只表示天气冷'],'她觉得冷／她感冒了'),'cold作形容词与a cold作名词短语意义不同。')
];
unit.questions.roles=[
q('r-event','原文发生的事','Andy说发生了什么？',choice(['他滑了一跤，从楼梯上摔下来','他下楼接到了医生','他在花园修理汽车'],'他滑了一跤，从楼梯上摔下来'),'保留Andy的原话，不另编事故原因。'),
q('r-back','人物对受伤部位的判断','Andy认为自己伤到了哪里？',choice(['背','牙齿','耳朵'],'背'),'I think保留他的判断语气，不改成医生已经确诊。'),
q('r-cannot','人物的能力陈述','Lucy问能不能起来，Andy怎样回应？',choice(['I’m afraid that I can’t get up.','I can get up at once.','I’ve already gone upstairs.'],'I’m afraid that I can’t get up.'),'这是Andy说自己不能起来，不是说害怕Lucy。'),
q('r-call','联系对象','Lucy打算给谁打电话？',choice(['Dr. Carter','Andy的老师','出租车司机'],'Dr. Carter'),'原文明确写Dr. Carter；没有说明Lucy与Andy的家庭关系。'),
q('r-he','转述中he的指代','The doctor says that he will come at once.里的he指谁？',choice(['医生','Andy','Lucy'],'医生'),'主句指明医生说话，从句he仍指医生。'),
q('r-opinion','人物态度与已验证事实','“需要X光检查”是谁在课文里表达的看法？',choice(['Lucy','已经到场检查的医生','讲述者提供的检查结果'],'Lucy'),'Lucy说I’m sure；课文没有描写医生到场或检查结果。'),
q('r-question','回答教材开场问题','根据Lucy转述的安排，Andy需要动身去找医生吗？',choice(['不用，医生说会马上过来','需要，原文说他已经出门','不用，因为原文说他没有受伤'],'不用，医生说会马上过来'),'这是课文中的安排；不改写成不需要医生，也不补写医生已到。')
];
unit.questions.grammar=[
g('link','用that接上陈述内容','用that把两部分接起来。',{...fill([blank('She says','she feels ill.',['that','to','than'])],['that']),context:'She says: “I feel ill.”'},'that引出她说的内容；这里按要求保留that。','先找“说的内容”从哪里开始。',model(['He says that he feels tired.','前半句交代谁说，后半句说内容。'])),
g('person','转述时人称与动词一致','你现在向别人转述Anna的话，补好两处。',{...fill([blank('Anna says that','',['she','I']),blank('','cold.',['feels','feel'])],['she','feels']),context:'Anna says: “I feel cold.”\nYou are reporting Anna’s words to someone else.'},'原话的I是Anna，转述用she；动词相应变为feels。','谁觉得冷？',model(['Ben: “I am ready.” → Ben says that he is ready.','人称换了，be也跟着主语变化。'])),
g('plural','复数说话人与从句主语','两位男孩说口渴，你向别人转述。',{...fill([blank('The boys','that they',['say','says']),blank('','thirsty.',['are','is'])],['say','are']),context:'The boys say: “We are thirsty.”\nYou are not one of the boys.'},'boys是复数，主句say；他们在从句中用they are。','主句和从句各找自己的主语。',model(['The girls say that they are ready.','复数主语不套he says的s。'])),
g('attitude','afraid表达委婉的坏消息','Tom遗憾地说赶不上车，应选哪个意思？',choice(['恐怕赶不上，并非说害怕火车','他保证一定能赶上','他正在问火车的颜色'],'恐怕赶不上，并非说害怕火车',{context:'Tom looks at the time: “I’m afraid that I can’t catch the train.”'}),'be afraid that在这里委婉表达不好的情况；不只等于害怕。','结合整句话的消息。',model(['I’m sorry that I’m late.','sorry表达歉意；sure表达确信，afraid可委婉传达坏消息。'])),
g('present-past','现在主句保留过去事件','她现在说的是昨天发生的事。',{...fill([blank('She says that her mother','back yesterday.',['came','comes','will come'])],['came']),context:'Today is Tuesday. Her mother returned on Monday.\nShe is telling us about it now.'},'主句says是现在时，不要求从句也用现在时；昨天的回来用came。','先定位回来的时间。',model(['He says that he lost his pen yesterday.','现在转述，也可以说过去发生的事。'])),
g('present-perfect','现在转述保留完成意义','她刚找到钢笔，现在转述这条消息。',{...fill([blank('She says that she','her pen.',['has found','finds','will find'])],['has found']),context:'She says: “I have found my pen.”'},'原话表示已找到、现在有结果，转述保留现在完成时。','找到的结果现在已经有了。',model(['He says that he has finished his homework.','不要看到says就把从句改成一般现在时。'])),
g('present-continuous','现在转述保留正在进行','男孩们此刻正在洗盘子，拼好转述。',{...bank(['They say','that','they are washing','the dishes','they washed'],'They say that they are washing the dishes',4),context:'The boys say: “We are washing the dishes now.”'},'says／say后可以保留正在发生的动作。','先看动作是不是正在进行。',model(['She says that she is reading a book.','is reading说明她此刻正在读。'])),
g('present-future','现在转述保留将来','医生刚在电话里说会来，Lucy现在转述。',{...fill([blank('The doctor says that he','at once.',['will come','came','has come'])],['will come']),context:'Dr. Carter says on the phone: “I will come at once.”'},'will come仍是将来的安排，不表示已经来了。','区分要来和已经来。',model(['Ben says that he will phone us tonight.','现在转述计划，will不自动变成would。'])),
g('modal','现在转述保留can并用原形','修理工现在说可以修车，你向别人转述。',{...fill([blank('He says that he','',['can','is']),blank('','the car.',['repair','repairs'])],['can','repair']),context:'The mechanic says: “I can repair the car.”'},'现在转述能力保留can；can后用动词原形。','can后面怎样接动词？',model(['She believes that she can swim across the river.','believe也能接that从句。'])),
g('past-simple','过去转述采用一般过去时','回述昨晚的话，按过去叙述补全。',{...fill([blank('Tom said that he','hungry.',['was','is','will be'])],['was']),context:'Last night Tom said: “I am hungry.”\nHe ate dinner afterwards. He is not hungry now. You are recalling last night.'},'回看当时的状态，am后移为was；不把当时饥饿说成现在仍饥饿。','说话和转述不在同一时间。',model(['Yesterday Anna said: “I am tired.” → Anna said that she was tired.','这里回述当时的状态。'])),
g('past-continuous','过去转述采用过去进行时','回述昨天三点正在发生的事。',{...fill([blank('He said that he','his bike at that moment.',['was repairing','is repairing','will repair'])],['was repairing']),context:'At 3 p.m. yesterday, Ben said: “I am repairing my bike.”\nThe repair finished yesterday. You are recalling that moment.'},'当时正在修车，用was repairing；不改成现在正在修。','关注“当时正在”。',model(['She said that she was reading at that moment.','am／is reading后移为was reading。'])),
g('past-future','过去转述中的would','现在回述周一的计划，使用过去叙述。',{...fill([blank('She said that she','on Tuesday.',['would leave','will leave','leaves'])],['would leave']),context:'On Monday, May said: “I will leave on Tuesday.”\nIt is Wednesday now. Report her Monday plan.'},'过去所说的将来，will后移为would；不据计划断言已离开。','相对哪一天的将来？',model(['He said that he would phone on Friday.','would表达从过去看将来的安排。'])),
g('past-perfect','过去转述中的过去完成时','按后移规则回述当时已经完成的事。',{...fill([blank('She said that she','the letter.',['had written','has written','will write'])],['had written']),context:'At noon yesterday, she said: “I have written the letter.”\nNow recall what was already complete at that past moment.'},'写完先于过去的说话时刻；have written后移为had written。','先写好，再说已经写好。',model(['He said that he had finished the work.','过去说话之前已完成：had＋过去分词。'])),
g('truth','客观事实可保留现在时','用一般现在时转述仍然成立的客观事实。',{...fill([blank('The teacher said that the earth','round the sun.',['goes','go','going'])],['goes']),context:'The teacher spoke yesterday. The fact is still true.'},'主句said在过去，仍成立的客观事实可以保留现在时；earth是单数。','不是把地球公转限定到昨天。',model(['The teacher said that the sun rises in the east.','从句表述仍成立的事实。'])),
g('still','仍然成立的信息不强制后移','Ben仍住在伦敦。转述昨天的话，哪些表达可以？',choice(['lives和lived都可以，侧重点不同','只有lived，lives一定错误','只有will live'],'lives和lived都可以，侧重点不同',{context:'Yesterday Ben said: “I live in London.”\nHe still lives there now.\nBen said that he ___ in London.'}),'可用lived采用过去叙述，也可用lives强调现在仍真；不把一种合法形式判错。','转述时信息还成立吗？',model(['She said that she works in a bank.（现在仍然如此）','She said that she worked in a bank.（采用过去叙述）'])),
g('habit','旧习惯不是永恒事实','这项旧习惯已经停止，回述过去的话。',{...fill([blank('He said that he','to work.',['walked','walks','will walk'])],['walked']),context:'In 2020, he said: “I walk to work every day.”\nHe retired in 2021 and no longer goes to work.'},'习惯性动作也受时间限制；不能因every day就强制用现在时。','这项习惯现在还在继续吗？',model(['She said that she took the bus every day.','描述过去已结束的习惯，可以用过去时。'])),
g('independent-past','独立转述过去正在发生的事','回述过去那一刻，补好转述。',{...fill([blank('Lily said that she','dinner at that moment.',['was cooking','is cooking','will cook'])],['was cooking']),context:'At 6 p.m. yesterday, Lily said: “I am cooking dinner.”\nDinner finished yesterday.'},'过去那一刻正在做饭，用was cooking。'),
g('independent-present','独立保持现在转述的人称与完成意义','你现在向别人转述Ben的话。',{...fill([blank('Ben says that','',['he','I']),blank('','his homework.',['has finished','have finished'])],['he','has finished']),context:'Ben says: “I have finished my homework.”'},'I指Ben，转述用he；has finished保留已完成的意思。'),
g('independent-truth','独立表达客观事实','用现在时表达这条仍成立的科学事实。',{...fill([blank('The teacher said that the earth','round the sun.',['moves','move','moving'])],['moves']),context:'The teacher spoke last week. We are reporting a fact that is still true.'},'这里按指定现在时表达，earth后用moves。'),
g('independent-negative','独立转述否定陈述','拼成她现在转述的话。',{...bank(['She says','that','she doesn’t','speak English','doesn’t she'],'She says that she doesn’t speak English',4),context:'Anna says: “I don’t speak English.”\nYou are reporting Anna’s words to someone else.'},'that后用陈述语序；否定意义与原话一致。')
];
unit.questions.apply=[
q('a-phone','从信息来源辨认指代','你替Lucy记录电话内容，谁会马上来？',choice(['Dr. Carter','Andy','Lucy'],'Dr. Carter',{context:'Lucy: “The doctor says that he will come at once.”'}),'he指说话的医生；不是Andy会出门。'),
q('a-person','转述时保留物主关系','你向同伴转述Mia的话，选择准确的一句。',choice(['Mia says that she has lost her pen.','Mia says that I have lost my pen.','Mia says that she has found her pen.'],'Mia says that she has lost her pen.',{context:'Mia tells you now: “I have lost my pen.”\nYou are reporting Mia’s words to a friend.'}),'谁丢的、谁的笔和丢失状态都不能改变。'),
q('a-group','转述群体并保持否定','你不在说话的两位男孩中，转述他们的话。',{...bank(['The boys say','that','they don’t need','any money','we need'],'The boys say that they don’t need any money',4),context:'The boys say: “We don’t need any money.”\nYou are not one of the boys.'},'we指男孩们，转述为they；保留不需要的意思。'),
q('a-need','need与want不能随意替换','哪句保留她说的“需要执照”？',choice(['She says that she needs a licence.','She says that she wants a licence.','She says that she has a licence.'],'She says that she needs a licence.',{context:'Eva says now: “I need a licence.”'}),'need表达需要；want表达想要，has表示拥有，不随意替换。'),
q('a-negative','保持陈述语序与否定能力','修理工说不能修，怎样记录？',{...bank(['He says','that','he can’t','repair the car','can he'],'He says that he can’t repair the car',4),context:'The mechanic says: “I can’t repair the car.”'},'that后的内容是陈述句，保留can’t。'),
q('a-time','固定转述时点并保留计划含义','周三回述周一的计划，按过去叙述补全。',{...fill([blank('Ben said that he','on Tuesday.',['would phone','will phone','phones'])],['would phone']),context:'Monday: Ben said, “I will phone on Tuesday.”\nWednesday: You are reporting his Monday plan.\nWe do not know whether he phoned.'},'would phone是当时的计划，不自动证明电话已打出。'),
q('a-belief','保留人物判断的来源','哪条记录准确保留了Lucy的看法？',choice(['Lucy is sure that Andy needs an X-ray.','The doctor has already confirmed Andy’s injury.','Andy has already had an X-ray.'],'Lucy is sure that Andy needs an X-ray.',{context:'Lucy says to Andy: “I’m sure that you need an X-ray.”\nThe story gives no examination result.'}),'把you换成Andy，并保留Lucy的确信；不升级成医生诊断。'),
q('a-unknown','将来承诺不等于已经实现','只有这条消息，能确认什么？',choice(['医生说会来，尚不能确认已经到达','医生已经完成检查','Andy已经康复'],'医生说会来，尚不能确认已经到达',{context:'The doctor says that he will come at once.\nThere is no later update.'}),'忠实传话也要保留事情尚未发生或尚未证实的边界。')
];
unit.questions.exam=[
q('e-story','独立辨认原文安排','课文中医生说会做什么？',choice(['马上过来','请Andy立即开车去医院','已做完检查'],'马上过来'),'will come不表示已经来了。'),
q('e-source','独立区分看法与诊断','Lucy说I’m sure that you need an X-ray.能据此确认什么？',choice(['Lucy确信需要检查，原文未给诊断结果','医生已确认骨折','Andy已做完检查'],'Lucy确信需要检查，原文未给诊断结果'),'人物态度与已验证事实分开。'),
q('e-person','独立转述单数人称','你向别人转述Tom现在的话。',{...fill([blank('Tom says that','',['he','I']),blank('','cold.',['feels','feel'])],['he','feels']),context:'Tom says: “I feel cold.”'},'I指Tom，转述用he feels。'),
q('e-plural','独立转述复数人称','你不属于这群人，补好转述。',{...fill([blank('They','that they',['say','says']),blank('','thirsty.',['are','is'])],['say','are']),context:'Two visitors say: “We are thirsty.”'},'复数主语用say和are。'),
q('e-negative','独立保持否定与语序','把她的话拼成转述。',{...bank(['She says','that','she doesn’t','remember him','does she'],'She says that she doesn’t remember him',4),context:'May says: “I don’t remember him.”'},'不把陈述改成问句，也不丢掉否定。'),
q('e-possessive','独立保持物主指代','哪句话准确转述Ben现在的话？',choice(['Ben says that he has found his watch.','Ben says that I have found my watch.','Ben says that he has lost his watch.'],'Ben says that he has found his watch.',{context:'Ben says: “I have found my watch.”\nYou are reporting this to someone else.'}),'人称和物主同步改变，已经找到的意思不变。'),
q('e-present-past','独立在现在转述过去事件','现在转述昨天发生的事。',{...fill([blank('She says that she','the letter yesterday.',['posted','posts','will post'])],['posted']),context:'Today is Friday. She posted the letter on Thursday and tells us about it now.'},'主句says不要求从句也用现在时。'),
q('e-present-perfect','独立保持现在完成意义','现在转述他已经完成的事。',{...fill([blank('He says that he','the car.',['has repaired','repairs','will repair'])],['has repaired']),context:'He says: “I have repaired the car.”'},'保留已修好的结果。'),
q('e-present-continuous','独立保持正在进行意义','现在转述她正在做的事。',{...fill([blank('She says that she','a letter.',['is writing','wrote','will write'])],['is writing']),context:'She says now: “I am writing a letter.”'},'原话现在正在进行，保留is writing。'),
q('e-present-future','独立保持现在转述中的将来','今天是周二，现在转述计划。',{...fill([blank('They say that they','on Wednesday.',['will leave','left','have left'])],['will leave']),context:'It is Tuesday. They say: “We will leave on Wednesday.”'},'现在转述尚未发生的安排，保留will。'),
q('e-modal','独立保持must与动词原形','现在转述她说必须赶车。',{...fill([blank('She says that she','',['must','is']),blank('','the train.',['catch','catches'])],['must','catch']),context:'She says: “I must catch the train.”'},'现在转述保留must；must后接原形。'),
q('e-afraid','独立理解委婉的坏消息','在这个语境，I’m afraid主要起什么作用？',choice(['委婉告知不好的消息','保证一定能帮上忙','询问对方是不是害怕'],'委婉告知不好的消息',{context:'Ben cannot repair the car. He says: “I’m afraid that I can’t help.”'}),'这里不是说他一定感到恐惧。'),
q('e-past-simple','独立回述过去状态','按过去叙述回述当时的感受。',{...fill([blank('May said that she','thirsty.',['was','is','will be'])],['was']),context:'Yesterday May said: “I am thirsty.”\nShe drank water afterwards. She is not thirsty now. We are recalling yesterday.'},'回述当时状态用was。'),
q('e-past-continuous','独立回述过去正在进行','按过去叙述补好消息。',{...fill([blank('They said that they','the dishes at that moment.',['were washing','are washing','will wash'])],['were washing']),context:'At 8 p.m. yesterday they said: “We are washing the dishes.”\nThey finished yesterday.'},'复数they的过去进行时是were washing。'),
q('e-past-future','独立表达过去所说的将来','周五回述周二的计划，按过去叙述填空。',{...fill([blank('Eva said that she','on Thursday.',['would return','will return','returns'])],['would return']),context:'Tuesday: Eva said, “I will return on Thursday.”\nNow it is Friday. We are reporting that plan, not its outcome.'},'would return表达当时的未来，不证明计划已实现。'),
q('e-past-perfect','独立表达过去说话前已经完成','按后移规则回述消息。',{...fill([blank('Ben said that he','the door.',['had painted','has painted','will paint'])],['had painted']),context:'At noon yesterday, Ben said: “I have painted the door.”\nReport what was complete before that past moment.'},'过去说话前已完成，has painted后移为had painted。'),
q('e-truth','独立保持客观事实','用一般现在时表达仍成立的事实。',{...fill([blank('The teacher said that the sun','in the east.',['rises','rise','rising'])],['rises']),context:'The teacher spoke last month. This is still a fact.'},'said不妨碍从句用现在时描述客观事实。'),
q('e-still','独立判断合法的时态选择','她仍然在银行工作，哪些转述可以？',choice(['works和worked都可以','works一定错误','只能用will work'],'works和worked都可以',{context:'Yesterday Anna said: “I work in a bank.”\nShe still works there now.\nAnna said that she ___ in a bank.'}),'worked采用过去叙述，works强调现在仍然如此。'),
q('e-habit','独立区分旧习惯与事实','旧习惯已结束，按过去叙述转述。',{...fill([blank('He said that he','the bus every day.',['took','takes','will take'])],['took']),context:'In 2019 he said: “I take the bus every day.”\nHe stopped doing this in 2020.'},'every day不自动要求现在时，要看习惯属于何时。'),
q('e-need','独立保持需要的含义','哪一项保留这条消息中的“需要”？',choice(['She says that she needs some money.','She says that she has some money.','She says that she wants some money.'],'She says that she needs some money.',{context:'She says: “I need some money.”'}),'需要、想要与已经拥有不同；转述保留原话含义。'),
q('e-that','独立连接that从句','用that接好他说的话。',{...fill([blank('He says','he has a toothache.',['that','to','than'])],['that']),context:'He says: “I have a toothache.”'},'本题按指定结构使用that；日常许多转述中也可省略that。'),
q('e-unknown','独立保留未知结局','读到医生会马上来的消息后，能补出什么结局？',choice(['不能补出，原文没有后续到场或检查结果','Andy已痊愈','医生已拍好X光片'],'不能补出，原文没有后续到场或检查结果'),'只传达已有信息，不把将来安排写成完成结果。')
];
unit.learning.REFERENCE=[
'本课《同步导学》Grammar主线是宾语从句及主从句时态关系。that把“谁说／想／知道”等与内容连接起来；that后的陈述按主语＋谓语排列。say、think、believe、hope、know、understand、suppose等都可接这类内容。be sure／afraid／sorry后也可以接that从句。',
'转述先看谁说、对谁说、转述者是谁。Anna说I feel cold，别人转述为Anna says that she feels cold。I并非永远换成he；my／your／we也要按真实人物关系判断。两位男孩说We are thirsty，旁人转述为They say that they are thirsty。',
'主句是一般现在时，从句按事情本身选择时态：He says that he feels tired／is working／has finished／came yesterday／will come tomorrow。主句says不意味着从句只能现在时，也不要求自动后移。',
'回述过去的话时通常采用时态后移：am／is→was；are→were；am／is doing→was doing；are doing→were doing；will→would；have／has done→had done。本课用明确的过去情境学习这四种形式，不要求把未学的间接问句和命令一起背完。',
'客观事实仍然成立时可以保留一般现在时，如The teacher said that the earth goes round the sun。过去说过、现在仍然成立的信息，也可以保留现在时；采用过去叙述同样可以。不能把said后用现在时一律判错。',
'导学把习惯性动作也列入不受主句时态影响的一类，实际还要看习惯是否仍成立。He said that he walked to work every day可以讲过去已结束的习惯。every day不是现在时开关。来源核实和采用边界见本单元设计与验收记录。',
'I’m sure表达说话人的确信；I think表达判断；I’m afraid that在本课委婉传达不好的情况，不能全部翻成害怕。说某人需要X光检查，不等于医生已经诊断或检查完毕。',
'Lesson 100的参考框架保留is／feels／has (got)／needs／wants／can／must／will，以及16组替换词。need与want不同，needs不等于has；情态动词后用原形。课本A、B完整保留在练习纸，课堂继续书写和口头替换。',
'按课本本课示范使用that；常见转述陈述句中的that也可省略，不能把没有that的合法英语一概判错。直接引用用引号，转述内容通常不用引号。',
'课文完整保留Lucy的Try and stand up和Andy的can’t get up作为人物对白。课程只阅读和理解故事，不安排孩子模仿跌倒、起身或作出医疗判断。角色关系没有明确交代，不把Lucy自动称为妻子；医生是否到场、检查结果如何，原文都没有说明。'
];
unit.learning.MODEL_TITLE='课本小参考 · 转述框架与16组替换';
unit.learning.REPORTING_MODELS=[['开头','连接','内容框架'],['He says / thinks / believes / knows / understands','that he','is… / feels… / has (got)…'],['He is afraid / sorry / sure','that he','needs… / wants…'],['He says / She says / They say','that he / she / they','can… / must… / will…']];
unit.learning.MODELS=[['tired','is / feels'],['thirsty','are / feel'],['cold','is / feels'],['ill','is / feels'],['a cold','has (got)'],['a headache','has (got)'],['an earache','has (got)'],['a toothache','have (got)'],['a haircut','needs / wants'],['licence','needs / wants a'],['X-ray','needs / wants an'],['some money','need / want'],['wait','can / must / will'],['catch','can / must / will'],['repair','can / must / will'],['sell','can / must / will']].map(([en,frame])=>{const w=WORDS.find(w=>w.en===en);return{en,cn:frame+' · '+w.cn,image:w.image};});
unit.learning.WRITING=[
{title:'A · 用says或say改写',instruction:'保留课本5题。按例子添加相应的主句，保留原句含义；主句现在时不自动后移时态。',examples:['He is drinking his milk. → He says that he is drinking his milk.'],items:['She has found her pen.','They must remain here.','He remembers you.','She doesn’t speak English.','They’re washing the dishes.']},
{title:'B · 根据线索用间接引语回答',instruction:'保留课本10题。先分清he、she、they，再用says／say＋that作答。注意feel、have (got)、want、need各自的意义；不是根据症状作诊断。',examples:['What’s the matter with him? (feel/tired) → He says that he feels tired.','What do they want? (some/money) → They say that they want some money.'],items:['What’s the matter with him? (feel/ill)','What’s the matter with her? (have got/a headache)','What does he want? (a haircut)','What’s the matter with them? (are/thirsty)','What’s the matter with them? (have/a toothache)','What does she need? (a licence)','What does he want? (an X-ray)','What’s the matter with her? (is/cold)','What’s the matter with him? (have got/a cold)','What’s the matter with him? (have/an earache)']}
];
core.unit99100=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit99100,excerpts={"u99100-v1-r-event":[0,1,2],"u99100-v1-r-back":[3,4],"u99100-v1-r-cannot":[5,6],"u99100-v1-r-call":[7,8],"u99100-v1-r-opinion":[7,8],"u99100-v1-r-question":[7,8],"u99100-v1-e-story":[7,8]},speakers={"andy":"Andy","lucy":"Lucy"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 99',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
