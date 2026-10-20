(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit81-82/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页166–169／PDF199–202';
const grammarSource='《同步导学》Grammar纸页144／PDF158；《语法练习册》纸页231–235／PDF245–249';
const rows=[
['bath','洗澡','/bɑːθ/','bath'],['nearly','几乎；将近','/ˈnɪəli/','nearly'],['ready','准备好的；完成的','/ˈredi/','ready'],['dinner','正餐；本故事指晚餐','/ˈdɪnə/','dinner'],['restaurant','饭馆；餐馆','/ˈrestrɒnt/','restaurant'],['roast','烤的','/rəʊst/','roast'],
['breakfast','早饭','/ˈbrekfəst/','breakfast'],['haircut','理发','/ˈheəkʌt/','haircut'],['party','聚会','/ˈpɑːti/','party'],['holiday','假日；假期','/ˈhɒlədeɪ/','holiday'],['upstairs','在楼上；向楼上','/ˌʌpˈsteəz/','upstairs'],['together','一起','/təˈɡeðə/','together'],
['have breakfast','吃早饭','/hæv ˈbrekfəst/','breakfast'],['have lunch','吃午饭','/hæv lʌntʃ/','lunch'],['have tea','喝茶；吃茶点','/hæv tiː/','tea'],['have dinner','吃正餐；本课为吃晚饭','/hæv ˈdɪnə/','dinner'],['have a meal','吃一顿饭','/hæv ə miːl/','meal'],['have a swim','游泳','/hæv ə swɪm/','swim'],
['have a bath','洗澡','/hæv ə bɑːθ/','bath'],['have a haircut','理发','/hæv ə ˈheəkʌt/','haircut'],['have a lesson','上课','/hæv ə ˈlesən/','lesson'],['have a party','举行聚会','/hæv ə ˈpɑːti/','party'],['have a holiday','度假','/hæv ə ˈhɒlədeɪ/','holiday'],['have a good time','玩得开心','/hæv ə ɡʊd taɪm/','good-time'],
['roast beef','烤牛肉','/rəʊst biːf/','roast'],['potatoes','土豆（复数）','/pəˈteɪtəʊz/','potatoes'],['had','have的过去式','/hæd/','past'],['having','have的现在分词','/ˈhævɪŋ/','now'],['again','再一次','/əˈɡen/','again'],['tonight','今晚','/təˈnaɪt/','tonight']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit81-82',version:1,contentRevision:'dinner-activities-v1',mode:'classroom',title:'晚餐前的小意外',path:'/unit81-82/',start:'learn/words',progress:{learningKey:'canran:unit81-82:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识生活活动',activities:[['words','生活小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'发现晚餐的小意外',activities:[['text','晚餐小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'发现have的用法',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'说说生活安排',activities:[['apply','生活安排员','give']],required:['apply']},
{id:'l5',title:'完成生活挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'dinner-activities-v1',title:'生活表达小达人',lesson:'Lesson 81–82',scene:'/assets/unit81-82/keepsake-story-v1.webp',alt:'Carol端着烤牛肉和土豆，Tom与来访的Sam聊起午餐',color:'#b57856',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','生活安排员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={carol:'Carol',tom:'Tom',sam:'Sam'};
unit.learning.DIALOGUE=[
['sam','Hi, Carol! Where’s Tom?','嗨，卡罗尔！汤姆在哪儿？'],
['carol','He’s upstairs. He’s having a bath.','他在楼上。他正在洗澡。'],
['carol','Tom!','汤姆！'],
['tom','Yes?','什么事？'],
['carol','Sam’s here.','萨姆来了。'],
['tom','I’m nearly ready.','我马上就好。'],
['tom','Hello, Sam. Have a cigarette.','你好，萨姆。请抽烟。'],
['sam','No, thanks, Tom.','不，谢谢，汤姆。'],
['tom','Have a glass of whisky then.','那么，来一杯威士忌吧。'],
['sam','OK. Thanks.','好的，谢谢。'],
['tom','Is dinner ready, Carol?','卡罗尔，饭好了吗？'],
['carol','It’s nearly ready. We can have dinner at seven o’clock.','马上就好。我们七点可以吃晚饭。'],
['tom','Sam and I had lunch together today. We went to a restaurant.','萨姆和我今天一起吃了午饭。我们去了一家餐馆。'],
['carol','What did you have?','你们吃了什么？'],
['tom','We had roast beef and potatoes.','我们吃了烤牛肉和土豆。'],
['carol','Oh!','噢！'],
['tom','What’s the matter, Carol?','怎么了，卡罗尔？'],
['carol','Well, you’re going to have roast beef and potatoes again tonight!','唉，你们今晚又要吃烤牛肉和土豆了！']
].map(([who,text,cn],i)=>({id:'u8182-d'+(i+1),who,text,cn,source:textSource,...(i===6?{note:'这是课文中的成人情境。小朋友不吸烟、不饮酒。'}:{})}));
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u8182-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-roast','烤的与食物名称','roast beef中的roast是什么意思？',choice(['烤的','生的','冰冷的'],'烤的',{image:image('roast'),imageAlt:'烤牛肉切片'}),'roast在这里形容烤制的食物。'),
q('v-meals','三餐词义','把餐名和意思配好。',match([['breakfast','早饭'],['lunch','午饭'],['dinner','本故事中的晚饭']]),'dinner指正餐，在这个故事里是晚餐。'),
q('v-nearly','将近与已经区别','“It’s nearly ready.”表示饭怎样了？',choice(['快好了','已经吃完了','完全没开始做'],'快好了'),'nearly ready是快准备好了，还不等于已经好了。'),
q('v-haircut','辨认活动图','哪张图表示have a haircut？',choice(['haircut','swim','bath'],'haircut',{optionImages:{haircut:image('haircut'),swim:image('swim'),bath:image('bath')}}),'have a haircut表示理发。'),
q('v-places','地点与活动词义','配好这三个词。',match([['restaurant','餐馆'],['party','聚会'],['holiday','假期']]),'restaurant是地点，party和holiday表示生活中的活动或时段。'),
q('v-ready','ready语境词义','客人要出发了，说“I’m ready.”。意思是？',choice(['我准备好了','我正在楼上','我玩得开心'],'我准备好了'),'ready是准备好的。'),
q('v-actions','have活动搭配','把表达和意思配好。',match([['have a lesson','上课'],['have a good time','玩得开心'],['have a bath','洗澡']]),'have要和后面的活动一起理解。')
];
unit.questions.roles=[
q('r-visitor','辨认来访者','课文中，谁来到Carol和Tom家？',choice(['Sam','Tom','Carol'],'Sam'),'Carol说Sam’s here。'),
q('r-now','地点与正在发生的活动','故事开始时Tom在哪里，在做什么？',choice(['楼上，正在洗澡','餐馆，正在吃晚饭','楼下，正在上课'],'楼上，正在洗澡'),'He’s upstairs. He’s having a bath.。'),
q('r-refusal','礼貌回应的含义','Sam第一次说“No, thanks, Tom.”，是在做什么？',choice(['礼貌地谢绝提议','答应接受提议','询问Tom在哪里'],'礼貌地谢绝提议'),'No, thanks是礼貌谢绝。'),
q('r-time','计划晚饭时间','Carol说几点可以吃晚饭？',choice(['七点','六点','八点'],'七点'),'We can have dinner at seven o’clock。'),
q('r-past','午饭人物与地点','Tom和Sam今天在哪里一起吃了午饭？',choice(['在餐馆','在学校','在Carol家的浴室'],'在餐馆'),'We went to a restaurant。'),
q('r-ending','结尾意外的原因','Carol为什么感到失望？',choice(['她准备的晚饭和他们午饭吃的一样','Sam说不来吃饭了','Tom说他不喜欢土豆'],'她准备的晚饭和他们午饭吃的一样'),'午饭吃过烤牛肉和土豆，今晚又准备吃同样的菜。'),
q('r-boundary','分清事实与未来安排','故事结束时，哪项已经发生？',choice(['Tom和Sam吃过午饭','三人已经吃完晚饭','Carol已经另做了一份晚饭'],'Tom和Sam吃过午饭'),'going to have是后面的安排，不是已经吃完。')
];
unit.questions.grammar=[
g('eat','have可表示吃','句中哪个词表示“吃”？',{type:'locate',fragments:['I ',{value:'have'},' ',{value:'bread'},' for ',{value:'breakfast'},'.'],options:['have','bread','breakfast'],answer:'have'},'have bread在这里是吃面包，不是拥有面包。','结合后面的食物理解。',model(['They have rice for lunch.','have在这里表示吃。'])),
g('drink','have可表示喝且时态一致','换一个动词，保留原意：I had a glass of milk.',fill([blank('I','a glass of milk.',['drank','ate','drink'])],['drank']),'had milk表示喝了牛奶，换成过去式drank。','既要看喝的东西，也要看过去的时间。',model(['She had some water. → She drank some water.','两句都说过去喝了水。'])),
g('activities','have体验活动的意义','把活动配好。',match([['have a swim','游泳'],['have a lesson','上课'],['have a good time','玩得开心']]),'have和活动词组合，不能逐字都译成“拥有”。','把have和后面的词连起来看。',model(['have a holiday','度假；这里have表示经历活动。'])),
g('habit','习惯时态第三人称','她每天七点吃早饭。',fill([blank('She','breakfast at seven every day.',['has','have','having'])],['has']),'习惯用一般现在时；She用has。','留意主语和every day。',model(['He has lunch at twelve every day.','he／she＋has表示日常活动。'])),
g('now','进行时having拼写','看，孩子们正在吃午饭。',fill([blank('They are','lunch now.',['having','haveing','have'])],['having']),'have去掉末尾e再加ing：having。','are后说明正在发生的活动。',model(['I am having a bath.','活动义的have可以用于进行时。'])),
g('not-now','活动进行时否定','她现在没在吃饭。填好两个位置。',fill([blank('She','not',['is','does','did']),blank('','a meal now.',['having','have','had'])],['is','having']),'正在发生的活动用be＋having；否定把not放在be后。','这句说现在，不是每天。',model(['They are not having tea now.','not放在are后，having不变。'])),
g('past','have过去式had','他们昨天举办了聚会。',fill([blank('They','a party yesterday.',['had','have','having'])],['had']),'已经发生的活动用had。','聚会已经在昨天发生了。',model(['I had a haircut last week.','have的过去式是had。'])),
g('did','过去问句did后原形','你昨天游泳了吗？',bank(['Did','you','have','a swim','yesterday','had'],'Did you have a swim yesterday',5,'?'),'Did已经表示过去，后面用have。','找出表示过去的助动词。',model(['Did she have a lesson yesterday?','Did＋主语＋have。'])),
g('negative','过去否定didn’t后原形','找出应改成have的词。',{type:'locate',fragments:[{value:'We'},' ',{value:'didn’t'},' ',{value:'had'},' dinner at home yesterday.'],options:['We','didn’t','had'],answer:'had'},'didn’t后用have，不再用had。','句中已有didn’t。',model(['He didn’t have breakfast at home.','否定：didn’t＋have。'])),
g('reply','过去简答呼应did','你昨天确实上课了。“Did you have a lesson yesterday?”',choice(['Yes, I did.','Yes, I had.','Yes, I am.'],'Yes, I did.'),'Did提问，肯定简答用did。','简答呼应提问里的助动词。',model(['Did she have a bath? — No, she didn’t.','did问句用did／didn’t简答。'])),
g('do','现在习惯问句do','你们每周五上课吗？',bank(['Do','you','have','lessons','on Friday','Are'],'Do you have lessons on Friday',5,'?'),'表示活动的have，习惯问句借助Do。','这是每周的活动，不是此刻。',model(['Do they have tea at four?','Do＋主语＋have。'],['Does he have tea at four?','he／she提问用Does，后面仍用have。'])),
g('does','第三人称习惯否定','他周日不上课。',fill([blank('He','not',['does','do','is']),blank('','lessons on Sunday.',['have','has','having'])],['does','have']),'He用does；后面的has恢复为have。','前面变化了，后面的动词用原形。',model(['She doesn’t have lunch at home.','doesn’t＋have。'])),
g('plan','将来安排going to have','他们计划明天度假。',fill([blank('They','going to',['are','is','did']),blank('','a holiday tomorrow.',['have','had','having'])],['are','have']),'are going to后面接have原形。','明天的计划还没有发生。',model(['I am going to have a swim tomorrow.','be going to＋have。'])),
g('must','must后have原形','他们必须先吃一顿饭。',bank(['They','must','have','a meal','has','having'],'They must have a meal',4),'must后直接用have原形。','must后接什么形式？',model(['He must have a rest.','must＋have＋活动。'])),
g('no-got','活动have不用have got替换','表示“她正在吃午饭”的是哪句？',choice(['She is having lunch.','She has got lunch.','She is have lunch.'],'She is having lunch.'),'have got表示拥有，不能代替这里的正在吃饭。'),
g('articles','餐名与活动名词冠词','一处不填词，一处填a。补好句子。',fill([blank('We have','breakfast at seven.',['不填词','a']),blank('We have','lesson at nine.',['a','不填词'])],['不填词','a']),'通常说have breakfast；说一次课用have a lesson。'),
g('independent-now','撤去示范构造现在进行时问句','询问他们现在是否正在吃午饭。',bank(['Are','they','having','lunch','now','Do'],'Are they having lunch now',5,'?'),'询问正在发生的活动，把are放到主语前，保留having。'),
g('independent-past','撤去示范构造过去问句','询问她今天已吃完的午餐吃了什么。',bank(['What','did','she','have','for lunch','had'],'What did she have for lunch',5,'?'),'午餐已发生，即使是today也用did；后用have。')
];
unit.questions.apply=[
q('a-timeline','根据活动已经结束表达过去','日程已勾选完成。该怎样汇报？',choice(['I had a lesson at nine.','I am having a lesson now.','I am going to have a lesson tomorrow.'],'I had a lesson at nine.',{context:'Now: 11:00 a.m.\n9:00–10:00 a.m. — an English lesson ✓ finished'}),'课已经结束，使用had。'),
q('a-now','根据进行中事件选动作','现在10:00，游泳还没结束。',choice(['He is having a swim.','He had a haircut.','He has got a swim.'],'He is having a swim.',{context:'Leo’s day\n9:45–10:15 — a swim\nNow: 10:00'}),'10点处在游泳的时间里，动作正在进行。'),
q('a-plan','读安排后登记下一项活动','现在18:00，19:00的活动还没开始。选对应表达。',choice(['We’re going to have dinner.','We had dinner.','We’re having dinner now.'],'We’re going to have dinner.',{context:'Now: 6:00 p.m.\nPlan: dinner at 7:00 p.m.\nDinner has not started.'}),'这是尚未开始的晚饭安排。'),
q('a-report','把吃和喝合成have表达','你早饭吃了面包、喝了牛奶。把这件事合成一句。',bank(['I','had','bread and milk','for breakfast','have'],'I had bread and milk for breakfast',4),'had可以把已经吃的和喝的合在一句里。','两样都是今天早饭已经吃喝过的。'),
q('a-correct','纠正过去活动误记','记录写了两项；实际只做了第一项。补好回复。',{...fill([blank('I','a haircut,',['had','have','having']),blank('but I didn’t','a swim.',['have','had','having'])],['had','have']),context:'Yesterday\na haircut ✓\na swim ✗'},'肯定过去活动用had；didn’t后用have。'),
q('a-question','根据问题提供对应信息','朋友问：“Where did you have lunch?” 该选哪条回答？',choice(['At a restaurant.','At twelve o’clock.','Some rice.'],'At a restaurant.',{context:'Lunch note\nPlace: a restaurant\nTime: twelve o’clock\nFood: rice'}),'Where问地点，不能用钟点或食物回答。'),
q('a-enjoy','同义改写保留原意','“We had a good time.” 换个说法，意思不变。',choice(['We enjoyed ourselves.','We had a clock.','We went home early.'],'We enjoyed ourselves.'),'have a good time与enjoy oneself都可表示玩得开心。'),
q('a-routine','现在习惯的问答配对','按问题的意思配好回答。',match([['What do you have for breakfast?','Bread and milk.'],['When do you have breakfast?','At seven.'],['Do you have breakfast at home?','Yes, I do.']]),'What问吃什么，When问时间，Do引出的问句可用yes或no回答。')
];
unit.questions.exam=[
q('e-words','核心词义独立抽样','配好词义。',match([['nearly','将近'],['ready','准备好的'],['restaurant','餐馆']]),'辨认程度、状态和地点。'),
q('e-activity','活动与名词语义','哪句表示“我们度过了一个假期”？',choice(['We had a holiday.','We had a haircut.','We had breakfast.'],'We had a holiday.'),'have a holiday是度假。'),
q('e-story','课文人物和午餐','哪两个人今天一起在餐馆吃了午饭？',choice(['Tom and Sam','Tom and Carol','Carol and Sam'],'Tom and Sam'),'Tom说Sam and I had lunch together today。'),
q('e-ending','课文结尾原因','“again tonight”为什么让Carol失望？',choice(['午饭和准备的晚饭都是烤牛肉和土豆','饭已经凉了','他们已经吃过两次晚饭'],'午饭和准备的晚饭都是烤牛肉和土豆'),'again是又一次；晚饭还是之后的安排。'),
q('e-time','课文计划与事实区分','哪项符合课文？',choice(['七点可以吃晚饭，谈话时还快好了','七点已经吃完晚饭','Tom独自在家吃过午饭'],'七点可以吃晚饭，谈话时还快好了'),'nearly ready说明马上就好。'),
q('e-meaning','活动have和拥有have的区别','“She is having tea.” 里的have表达什么？',choice(['喝茶或吃茶点的活动','拥有一个茶杯','把茶送给别人'],'喝茶或吃茶点的活动'),'这里have表示正在进行的活动。'),
q('e-habit','独立第三人称习惯','Ben每天在家吃午饭。',fill([blank('Ben','lunch at home every day.',['has','have','having'])],['has']),'Ben用has。'),
q('e-now','独立having形式','听课已经开始，仍在进行。补全说明。',fill([blank('We are','an English lesson now.',['having','haveing','had'])],['having']),'正在上课用are having，去e加ing。'),
q('e-not-now','独立进行时否定','他们现在没有游泳。',fill([blank('They','not',['are','do','did']),blank('','a swim now.',['having','have','had'])],['are','having']),'are not having是否定进行时。'),
q('e-past','独立过去活动','她昨天下午理了发。',fill([blank('She','a haircut yesterday afternoon.',['had','has','having'])],['had']),'昨天完成的活动用had。'),
q('e-did','独立过去问句','他们昨晚举行聚会了吗？',bank(['Did','they','have','a party','last night','had'],'Did they have a party last night',5,'?'),'Did后用have。'),
q('e-negative','独立过去否定纠错','找出应改成have的词。',{type:'locate',fragments:[{value:'He'},' ',{value:'didn’t'},' ',{value:'had'},' tea yesterday.'],options:['He','didn’t','had'],answer:'had'},'didn’t之后用原形have。'),
q('e-reply','独立过去否定回答','你昨天没有游泳。“Did you have a swim yesterday?”',choice(['No, I didn’t.','No, I hadn’t.','No, I’m not.'],'No, I didn’t.'),'Did提问，用didn’t作否定简答。'),
q('e-do','独立三单习惯问句','他每周日上课吗？',bank(['Does','he','have','lessons','on Sunday','has'],'Does he have lessons on Sunday',5,'?'),'he用Does提问，后面的动词用have原形。'),
q('e-does','独立三单否定','Lily周一不在家吃饭。',fill([blank('Lily','not',['does','do','is']),blank('','dinner at home on Monday.',['have','has','having'])],['does','have']),'Lily用does，后面恢复have。'),
q('e-plan','独立未来安排','我们打算明天办聚会。',bank(['We','are going to','have','a party','tomorrow','had'],'We are going to have a party tomorrow',5),'are going to后接原形have。'),
q('e-must','独立must后原形','他必须先吃早饭。',fill([blank('He must','breakfast first.',['have','has','having'])],['have']),'must后用have原形。'),
q('e-got','不把拥有形式替换活动','要说“他们正在上课”，选哪句？',choice(['They are having a lesson.','They have got a lesson.','They are have a lesson.'],'They are having a lesson.'),'have got不能替换正在进行的上课活动。'),
q('e-articles','独立餐名与可数活动','补好两个习惯表达。',fill([blank('I have','lunch at twelve.',['不填词','a']),blank('I have','bath at eight.',['a','不填词'])],['不填词','a']),'have lunch一般不加a，have a bath带a。'),
q('e-rewrite','82A同义动词与时态','把have换成对应意思的动词，保持过去时。',match([['I had some milk.','I drank some milk.'],['They had a meal.','They ate a meal.'],['You had a good time.','You enjoyed yourself.']]),'分别是喝、吃、玩得开心；改写保留原来的时间。'),
q('e-eating','82A进行时同义改写','改写时保留“正在”：They are having their lunch.',fill([blank('They','their lunch.',['are eating','ate','eat'])],['are eating']),'正在吃的动作，换动词后仍用进行时。'),
q('e-offer','82A祈使句同义表达','“Have a biscuit.” 中Have可换成哪个词？',choice(['Eat','Ate','Drank'],'Eat'),'请吃一块饼干，用原形Eat。'),
q('e-timeline','按事件而非today机械猜时态','现在15:00，这节课今天14:00已结束。选一句。',choice(['We had a lesson today.','We are having a lesson now.','We’re going to have that lesson tomorrow.'],'We had a lesson today.',{context:'Today’s lesson: 13:00–14:00, finished.\nNow: 15:00.'}),'today可以说已经结束的活动；这里用had。'),
q('e-new-story','新日程肯否迁移','昨天只吃了午饭，没有吃晚饭。补全记录。',fill([blank('We','lunch,',['had','have','having']),blank('but we didn’t','dinner.',['have','had','having'])],['had','have']),'肯定用had，didn’t后用have。'),
q('e-question','问已发生活动的内容','询问她昨天吃了什么晚饭。',bank(['What','did','she','have','for dinner yesterday','had'],'What did she have for dinner yesterday',5,'?'),'What did…have问过去吃了什么。'),
q('e-where','材料中区分地点与时间','“Where are they having a lesson?”',choice(['In the classroom.','At ten o’clock.','An English lesson.'],'In the classroom.',{context:'They are having an English lesson in the classroom. It started at ten o’clock.'}),'Where询问地点。')
];
unit.learning.ACTIVITIES=[['breakfast','breakfast','早饭'],['lunch','lunch','午饭'],['tea','tea','茶／茶点'],['dinner','dinner','晚饭'],['a meal','meal','一顿饭'],['a swim','swim','游泳'],['a bath','bath','洗澡'],['a haircut','haircut','理发'],['a lesson','lesson','上课'],['a party','party','聚会'],['a holiday','holiday','假期'],['a good time','good-time','开心的时光']];
unit.learning.REFERENCE=[
'have＋食物或饮料，可以表示吃或喝：have bread／have milk；have＋活动可表示体验：have a swim／have a lesson／have a good time。结合整个词组理解。',
'表示活动时have是实义动词。每天的习惯：I have lunch at home. / She has lunch at home.；提问Do you have…? / Does she have…?；否定don’t／doesn’t have…。',
'活动可以正在进行：They are having lunch.；have去e加ing成为having。否定They are not having lunch.；问句Are they having lunch?。',
'过去：We had a lesson.；提问Did you have a lesson?；否定We didn’t have a lesson.。did／didn’t后用have；简答Yes, we did. / No, we didn’t.。',
'计划：We are going to have dinner.；必须：We must have a meal.。going to和must后用原形have。',
'have got通常表示拥有，不代替本课have dinner／have a bath等活动表达。不能因为have有“拥有”的用法，就说所有have都不能用进行时。',
'通常说have breakfast／lunch／dinner，不加a；说have a meal／a bath／a lesson等，用a。tea也可指茶点，不把所有have tea都限定成某个时刻。',
'改写保留时间与含义：had milk → drank milk；had a meal → ate a meal；are having lunch → are eating lunch；had a good time → enjoyed oneself。代词随主语变化。',
'课本A中的had a holiday → went for a holiday沿用课本例题；在线活动理解以have a holiday为主。材料说“打算”或“快好了”，不当作已经完成。'
];
unit.learning.WRITING_A_EXAMPLES=['I had a cup of coffee. → I drank a cup of coffee.'];
unit.learning.WRITING_A=[['They had a meal at a restaurant.','They ___ a meal at a restaurant.'],['We had a holiday last month.','We ___ a holiday last month.'],['Have a biscuit.','___ a biscuit.'],['You had a good time.','You ___.'],['They are having their lunch.','They ___ their lunch.'],['I had a glass of milk.','I ___ a glass of milk.']];
unit.learning.WRITING_A_BANK=['drank','enjoyed yourself','are eating','went for','ate','eat'];
unit.learning.WRITING_B_EXAMPLES=['What is he going to do? (a glass of whisky) → He’s going to have a glass of whisky.（保留课本中的成人例句。）'];
unit.learning.WRITING_B=[['What are they going to do?','breakfast'],['What are they doing?','lunch'],['What must they do?','tea'],['What did they do?','dinner'],['What must they do?','a meal'],['What is he going to do?','a swim'],['What is he doing?','a bath'],['What did he do?','a haircut'],['What are they doing?','a lesson'],['What did they do?','a party'],['What must they do?','a holiday'],['What are they going to do?','a good time']];
core.unit8182=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit8182,excerpts={"u8182-v1-r-visitor":[0,1,2,3,4],"u8182-v1-r-now":[0,1],"u8182-v1-r-refusal":[6,7],"u8182-v1-r-time":[10,11],"u8182-v1-r-past":[12,13,14],"u8182-v1-r-ending":[12,13,14,15,16,17],"u8182-v1-r-boundary":[10,11,12,13,14,15,16,17],"u8182-v1-e-time":[10,11,12,13,14,15,16,17]},speakers={"sam":"Sam","carol":"Carol","tom":"Tom"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 81',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
