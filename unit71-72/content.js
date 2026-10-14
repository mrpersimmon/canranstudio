(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit71-72/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页142–145／PDF175–178';
const grammarSource='《同步导学》Grammar纸页129／PDF143；《语法练习册》纸页202–207／PDF216–221';
const actions=[
['air','aired','使通风','/eəd/','air','the room'],['clean','cleaned','清洁','/kliːnd/','clean','the shoes'],['open','opened','打开','/ˈəʊpənd/','open','the box'],['sharpen','sharpened','削尖','/ˈʃɑːpənd/','sharpen','the pencil'],['turn on','turned on','打开开关','/tɜːnd ɒn/','turn-on','the television'],['listen','listened','听','/ˈlɪsənd/','listen','to the radio'],['boil','boiled','煮','/bɔɪld/','boil','an egg'],['arrive','arrived','到达','/əˈraɪvd/','arrive','home'],['play','played','玩','/pleɪd/','play','a game'],['stay','stayed','停留','/steɪd/','stay','in bed'],['shave','shaved','刮脸','/ʃeɪvd/','shave',''],['climb','climbed','攀登','/klaɪmd/','climb','the hill'],['telephone','telephoned','打电话','/ˈtelɪfəʊnd/','telephone','my friend'],['call','called','叫，请来','/kɔːld/','call','the doctor'],['empty','emptied','倒空','/ˈemptid/','empty','the basket']
];
const rows=[
['awful','让人讨厌的；糟糕的','/ˈɔːfəl/','awful'],['telephone','打电话；电话','/ˈtelɪfəʊn/','telephone'],['time','次（数）','/taɪm/','times'],['answer','接（电话）；回答','/ˈɑːnsə/','answer'],['last','前一次的','/lɑːst/','last'],['phone','电话','/fəʊn/','phone'],['again','又一次地','/əˈɡen/','again'],['say','说（过去式 said）','/seɪ/','say'],
...actions.map(([base,past,cn,ph,art])=>[past,cn+'（过去式）',ph,art]),
['study','学习','/ˈstʌdi/','study'],['plan','计划','/plæn/','plan'],['stop','停下','/stɒp/','stop'],['work','工作','/wɜːk/','work'],['enjoy','享受；喜欢','/ɪnˈdʒɔɪ/','enjoy'],
['yesterday','昨天','/ˈjestədeɪ/','yesterday'],['the day before yesterday','前天','/ðə deɪ bɪˈfɔː ˈjestədeɪ/','before-yesterday'],['yesterday morning','昨天上午','/ˈjestədeɪ ˈmɔːnɪŋ/','morning'],['yesterday afternoon','昨天下午','/ˈjestədeɪ ˌɑːftəˈnuːn/','afternoon'],['last night','昨天夜里','/lɑːst naɪt/','night'],['the night before last','前天夜里','/ðə naɪt bɪˈfɔː lɑːst/','before-night']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit71-72',version:1,contentRevision:'phone-yesterday-v1',mode:'classroom',title:'电话里的昨天',path:'/unit71-72/',start:'learn/words',progress:{learningKey:'canran:unit71-72:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'发现电话线索',activities:[['words','电话小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进来电故事',activities:[['text','来电小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'把往事说清楚',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'整理昨日记录',activities:[['apply','往事记录员','give']],required:['apply']},
{id:'l5',title:'完成昨日挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'phone-yesterday-v1',title:'往事小讲述家',lesson:'Lesson 71–72',scene:'/assets/unit71-72/keepsake-story-v1.webp',alt:'Jane倾听Pauline讲述昨天的电话，桌上放着薄荷色电话与记录本',color:'#975169',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','往事记录员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={jane:'Jane',pauline:'Pauline'};
unit.learning.DIALOGUE=[
['jane',"What’s Ron Marston like, Pauline?",'Pauline，Ron Marston是个怎样的人？'],
['pauline','He’s awful! He telephoned me four times yesterday, and three times the day before yesterday.','他讨厌透了！他昨天给我打了4次电话，前天打了3次。'],
['pauline','He telephoned the office yesterday morning and yesterday afternoon. My boss answered the telephone.','他昨天上午和下午把电话打到了办公室，是我的老板接的。'],
['jane','What did your boss say to him?','你的老板对他说了什么？'],
['pauline','He said, “Pauline is typing letters. She can’t speak to you now!”','他说：“Pauline正在打信。她现在不能和你说话！”'],
['pauline','Then I arrived home at six o’clock yesterday evening. He telephoned again. But I didn’t answer the phone!','后来我昨天傍晚六点到家。他又打来了，但我没接！'],
['jane','Did he telephone again last night?','他昨天夜里又打电话了吗？'],
['pauline','Yes, he did. He telephoned at nine o’clock.','是的，他打了。他九点又打电话来了。'],
['jane','What did you say to him?','你对他说了什么？'],
['pauline','I said, “This is Pauline’s mother. Please don’t telephone my daughter again!”','我说：“我是Pauline的母亲。请不要再给我女儿打电话了！”'],
['jane','Did he telephone again?','他又打来了吗？'],
['pauline','No, he didn’t!','没有！']
].map(([who,text,cn],i)=>({id:'u7172-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u7172-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});const blank=(before,after,options)=>({before,after,options});const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-phone','看图识别电话','桌上的物品是什么？',choice(['a phone','a radio','a television'],'a phone',{image:image('phone'),imageAlt:'带听筒和拨号盘的电话'}),'phone是telephone的简短形式。'),
q('v-count','次数表达','给次数找到对应表达。',match([['once','一次'],['twice','两次'],['three times','三次']]),'表示次数时，一次once，两次twice，三次three times。'),
q('v-answer','理解接听与来电的区别','My boss answered the telephone. 老板做了什么？',choice(['接了电话','打出了电话','离开办公室'],'接了电话'),'answer the telephone表示接电话。'),
q('v-time','区分过去的时间短语','把时间表达配好。',match([['yesterday','昨天'],['the day before yesterday','前天'],['the night before last','前天夜里']]),'先看day或night，再看时间先后。'),
q('v-awful','理解awful的评价','He’s awful! 在这段故事里表达什么？',choice(['她觉得他很讨厌','她觉得他很有趣','她在问几点了'],'她觉得他很讨厌'),'awful在这里表达负面评价。'),
q('v-again','理解重复动作','He telephoned again. 中again表示什么？',choice(['又一次','从来没有','第一次且仅一次'],'又一次'),'again说明又做了一次。'),
q('v-empty','看图理解倒空动作','图中的篮子倒空了。选出对应动作。',choice(['emptied the basket','opened the box','boiled an egg'],'emptied the basket',{image:image('empty'),imageAlt:'篮子倾斜，纸团落入废纸篓，篮内已空'}),'emptied是empty的过去式。'),
q('v-say','理解说话动词','What did you say to him? 在问什么？',choice(['你对他说了什么','你在哪里见到他','他叫什么名字'],'你对他说了什么'),'say侧重说的内容。')
];
unit.questions.roles=[
q('r-count','提取两个不同日期的来电次数','昨天和前天，Ron分别打了几次？',choice(['昨天4次，前天3次','昨天3次，前天4次','两天一共4次'],'昨天4次，前天3次'),'four times属于yesterday；three times属于the day before yesterday。'),
q('r-office','理解办公室接听人','办公室的电话是谁接的？',choice(['Pauline’s boss','Pauline’s mother','Jane'],'Pauline’s boss'),'原文说My boss answered the telephone。'),
q('r-typing','理解老板给出的原因','老板说Pauline当时在做什么？',choice(['typing letters','playing a game','sleeping at home'],'typing letters'),'老板说她在打信，不能现在通话。'),
q('r-six','区分六点来电与接听','Pauline六点到家后，Ron又打来。她接了吗？',choice(['没有接','接了，并说自己是母亲','老板在她家接了'],'没有接'),'But I didn’t answer the phone!对应这次来电。'),
q('r-nine','提取夜里的具体时间','Ron昨天夜里几点打来？',choice(['at nine o’clock','at six o’clock','at three o’clock'],'at nine o’clock'),'六点是到家的时间；夜里九点又来电。'),
q('r-who','区分真实接听人与自称身份','九点那次电话，真正说话的是谁？',choice(['Pauline本人','Pauline的母亲','Jane'],'Pauline本人'),'I said说明是Pauline说的；她在电话里自称母亲。'),
q('r-quote','理解转述中的指代','Please don’t telephone my daughter again! 是怎样的一句话？',choice(['Pauline以母亲口吻说，请别再打给女儿','Jane请Ron再打一遍','老板说自己是Pauline的父亲'],'Pauline以母亲口吻说，请别再打给女儿'),'保留原文转述，不把口吻当成真实身份。'),
q('r-end','理解故事最后的否定回答','故事结尾，Ron又打来了吗？',choice(['No, he didn’t.','Yes, he did.','原文没有回答'],'No, he didn’t.'),'最后一句说明没有再打来。')
];
unit.questions.grammar=[
g('finished','过去已发生动作','记录昨天已经完成的事。',fill([blank('She','the room yesterday.',['cleaned','cleans','is cleaning'])],['cleaned']),'发生在过去、已经完成的动作使用过去式。','先看这件事发生在什么时候。',model(['He worked yesterday.','他昨天工作了。'])),
g('past-habit','过去的习惯','他现在不住在这里。说说以前每天做的事。',fill([blank('When he lived here, he','in the garden every day.',['played','plays','is playing'])],['played']),'every day也能描述过去的习惯，要结合过去语境。','when he lived here已经把时间放在过去。',model(['When she was young, she walked to school every day.','她小时候每天步行上学。'])),
g('ed','一般规则加ed','把work放进昨天的记录。',fill([blank('I','at home yesterday.',['worked','workd','work'])],['worked']),'work后直接加-ed，变成worked。','留意有没有漏掉e。',model(['clean → cleaned','多数规则动词加-ed。'])),
g('e','以e结尾只加d','把arrive放进过去的记录。',fill([blank('We','home last night.',['arrived','arriveed','arrive'])],['arrived']),'arrive已有e，只加-d。','不要再写一个e。',model(['telephone → telephoned','词尾已有e。'])),
g('consonant-y','辅音加y改ied','昨天，她倒空了篮子。',fill([blank('She','the basket yesterday.',['emptied','emptyed','empty'])],['emptied']),'empty末尾是辅音字母+y，改y为i再加-ed。','先看y前面是什么字母。',model(['study → studied','辅音字母+y。'])),
g('vowel-y','元音加y保留y','昨天，他们玩了一场游戏。',fill([blank('They','a game yesterday.',['played','plaied','playd'])],['played']),'play中y前是元音字母a，直接加-ed。','不是所有y结尾都变成ied。',model(['stay → stayed','元音字母+y，保留y。'])),
g('double','重读闭音节末尾双写','汽车昨天在这里停下。',fill([blank('The car','here yesterday.',['stopped','stoped','stop'])],['stopped']),'stop是重读闭音节，末尾为一个元音字母+一个辅音字母，双写p再加-ed。','和plan一样，要多写一个末尾辅音。',model(['plan → planned','符合条件时双写末尾辅音字母。'])),
g('no-double','不把双写推广到所有辅音尾','昨天，他打开了盒子。',fill([blank('He','the box yesterday.',['opened','openned','open'])],['opened']),'open重音在第一音节，末尾不按双写规则处理。','不是所有辅音字母结尾都双写。',model(['listen → listened','末音节不重读，不双写。'])),
g('said','区分规则与不规则','补好课文中的say。',fill([blank('He','that yesterday.',['said','sayed','say'])],['said']),'say的过去式是said，不能照规则造出sayed。','本课要单独记住这一组。',model(['do → did','有些动词的过去式需要单独记。'])),
g('negative','did not后用原形','过去的否定句，补好两处。',fill([blank('I','the phone yesterday.',['didn’t answer','didn’t answered','don’t answer']),blank('She didn’t','him last night.',['telephone','telephoned','telephones'])],['didn’t answer','telephone']),'didn’t后面用动词原形，过去信息由did承担。','不需要在同一结构里重复变化动词。',model(['He didn’t open the box.','他没有打开盒子。'])),
g('question','Did加主语加原形','把过去的动作变成问句。',fill([blank('','you clean the room yesterday?',['Did','Do','Were']),blank('Did she','home last night?',['arrive','arrived','arrives'])],['Did','arrive']),'实义动词的一般过去时提问用Did，后面的动词用原形。','不要把was/were直接放在动作原形前。',model(['Did he play a game?','他玩游戏了吗？'])),
g('yes','过去时肯定简答','记录写着：He called the doctor.\nDid he call the doctor?',choice(['Yes, he did.','Yes, he does.','Yes, he was.'],'Yes, he did.'),'Did提问的肯定简答用did。','看提问用的是哪一个词。',model(['Did she work? — Yes, she did.','肯定简答保留did。'])),
g('no','过去时否定简答','记录写着：They didn’t telephone.\nDid they telephone?',choice(['No, they didn’t.','No, they don’t.','No, they weren’t.'],'No, they didn’t.'),'Did提问的否定简答用didn’t。','回答的人称要与问题对应。',model(['Did he work? — No, he didn’t.','否定简答用didn’t。'])),
g('locate','定位didnt后的动作原形','哪个词是didn’t后面的动作原形？',{type:'locate',fragments:['We ',{value:'didn’t'},' ',{value:'telephone'},' him ',{value:'yesterday'},'.'],options:['didn’t','telephone','yesterday'],answer:'telephone'},'telephone是动作原形，didn’t负责过去与否定。','找“做什么”的词。',model(['didn’t clean中的clean不加-ed','过去否定中的动作保留原形。'])),
g('when','When询问过去时间','想知道对方什么时候到家，拼出问句。',bank(['When','did','you','arrive home','arrived home'],'When did you arrive home',4,'?'),'When did you…?询问过去做事的时间。','did后选原形。',model(['When did she call?','她什么时候打电话的？'])),
g('what','What询问过去做的事情','记录：She answered the phone yesterday.\nWhat did she do yesterday?',choice(['She answered the phone.','Yesterday.','At home.'],'She answered the phone.'),'What did…do询问做了什么，回答要给动作。','不是问时间，也不是问地点。',model(['What did he do? — He opened the box.','问题要一个动作。'])),
g('habit-transfer','撤去示范区分习惯和昨天','比较日常习惯与昨天。',fill([blank('She usually','the cups after lunch.',['washes','washed','wash']),blank('Yesterday she','the cups after dinner.',['washed','washes','wash'])],['washes','washed']),'日常习惯用一般现在时；昨天发生的动作用过去时。','分别看每句的时间。'),
g('record-transfer','撤去示范核对过去事实','记录：Tom — stayed at home; no game.\n补好两句。',fill([blank('Tom didn’t','a game.',['play','played','plays']),blank('He','at home.',['stayed','stay','stays'])],['play','stayed']),'否定用didn’t+原形；说明实际做的事使用过去式。','同时核对否定与实际发生的事。')
];
unit.questions.apply=[
q('a-calendar','把完成的动作放进过去记录','昨日活动图：擦鞋。\n补好记录。',fill([blank('They','their shoes yesterday.',['cleaned','clean','are cleaning'])],['cleaned']),'已完成的清洁动作用cleaned。','先核对图片，再看时间。'),
q('a-register','核对来电后才登记','来电记录：yesterday evening · 9 p.m. · answered。\n选出相符记录，再放进记录本。',choice(['I answered the phone at nine yesterday evening.','I didn’t answer the phone yesterday evening.','I answered the phone at six yesterday evening.'],'I answered the phone at nine yesterday evening.'),'核对时间与是否接听，两项都要一致。'),
q('a-i','you提问由自己用I回答','你昨天给Jane打了电话。她问：Did you telephone me yesterday?',choice(['Yes, I did.','Yes, you did.','Yes, I do.'],'Yes, I did.'),'被问到you的人用I回答自己做过的事。','从答话人的视角看。'),
q('a-morning','this morning须结合已结束语境','现在是晚上。今天早晨的电视已经关了。\n记录早晨做过的事。',choice(['I turned on the television this morning.','I am turning on the television now.','I turn on the television every morning.'],'I turned on the television this morning.'),'这次早晨的动作已结束，使用过去式；this morning本身不永远决定时态。'),
q('a-when','过去提问时间','记录上缺少打电话的时间。拼出问句。',bank(['When','did','she','telephone her husband','telephoned her husband'],'When did she telephone her husband',4,'?'),'When问时间；did后telephone用原形。'),
q('a-we','多人回应与事实纠正','你和Sam昨晚没有玩游戏，而是待在家里。\nDid you and Sam play a game?',choice(['No, we didn’t. We stayed at home.','No, they didn’t. They stayed at home.','Yes, we did. We played a game.'],'No, we didn’t. We stayed at home.'),'回答包含自己用we；先否定，再说明实际情况。'),
q('a-relative','用相对时间找到日期','练习月历：今天是周三。记录写着the day before yesterday。应放到哪天？',choice(['Monday','Tuesday','Wednesday'],'Monday'),'以周三为今天，前天是周一。'),
q('a-what','用动作回答What','活动记录：Lucy — listened to the radio — last night。\nWhat did Lucy do last night?',choice(['She listened to the radio.','Last night.','At nine o’clock.'],'She listened to the radio.'),'What询问动作，不能只回答时间。')
];
unit.questions.exam=[
q('e-words','独立理解电话词汇','把词和意思配好。',match([['telephone','打电话'],['answer','接听；回答'],['awful','糟糕的']]),'词义要符合语境。'),
q('e-counts','独立运用次数','选出与“两次”相同的表达。',choice(['twice','three times','once'],'twice'),'两次用twice。'),
q('e-night','独立识别相对时间','the night before last 是什么时候？',choice(['前天夜里','昨天夜里','今天夜里'],'前天夜里'),'last night是昨天夜里，the night before last再向前一天。'),
q('e-action','独立识别动作','图中削过的铅笔对应哪条记录？',choice(['He sharpened the pencil.','He emptied the basket.','He boiled an egg.'],'He sharpened the pencil.',{image:image('sharpen'),imageAlt:'铅笔旁有卷起的木屑，笔尖已经削好'}),'sharpened表示削尖了。'),
q('e-days','综合核对两天的来电','哪条概括符合课文？',choice(['Ron昨天4次、前天3次给Pauline打电话','Ron昨天3次、前天4次给Jane打电话','Ron两天只打过1次'],'Ron昨天4次、前天3次给Pauline打电话'),'两天、次数与接收人要同时核对。'),
q('e-office','综合办公室人物与动作','哪组办公室信息准确？',choice(['老板接听；Pauline正在打信','Jane接听；老板正在睡觉','Pauline的母亲接听；Pauline在家'],'老板接听；Pauline正在打信'),'两条信息都来自办公室段落。'),
q('e-evening','比较两个来电时刻','六点到家后和九点来电时，Pauline的做法有什么不同？',choice(['前一次没接，九点接了','两次都由她的母亲接','前一次接了，九点没接'],'前一次没接，九点接了'),'接听与未接听按故事先后区分。'),
q('e-identity','识别转述与真实身份','This is Pauline’s mother. 在本故事中是谁说的？',choice(['Pauline，用母亲的口吻','Jane，她就是Pauline的母亲','真正的母亲，Pauline不在场'],'Pauline，用母亲的口吻'),'原文I said已经交代了真实说话人。'),
q('e-end','理解最后的didnt','No, he didn’t! 回答的是哪件事？',choice(['Ron后来没有再次打电话','Ron从没打过电话','Pauline从没到过家'],'Ron后来没有再次打电话'),'这是否定最后“又打来了吗”，不是抹去之前来电。'),
q('e-completed','独立表达过去动作','昨天的降雨已经结束。补好记录。',fill([blank('It','yesterday.',['rained','rains','is raining'])],['rained']),'用过去式记录已结束的降雨。'),
q('e-past-habit','独立表达过去习惯','她现在住城里。说说以前住乡下的习惯。',fill([blank('When she lived in the country, she often','to school.',['walked','walks','is walking'])],['walked']),'often也能与过去语境一起使用。'),
q('e-ed','独立形成ed过去式','补好昨晚完成的动作。',fill([blank('We','television last night.',['watched','watchd','watch'])],['watched']),'watch直接加-ed。'),
q('e-final-e','独立形成d过去式','昨天他刮了脸。',fill([blank('He','yesterday.',['shaved','shaveed','shave'])],['shaved']),'shave已有e，只加d。'),
q('e-y','独立区分两种y结尾','补好这两种过去式。',fill([blank('She','English yesterday.',['studied','studyed','study']),blank('We','our lunch yesterday.',['enjoyed','enjoied','enjoy'])],['studied','enjoyed']),'study改y为i；enjoy中y前是元音，不改y。'),
q('e-doubling','独立区分双写与不双写','给两条昨日记录选词。',fill([blank('We','the trip yesterday.',['planned','planed','plan']),blank('She','to the radio last night.',['listened','listenned','listen'])],['planned','listened']),'plan符合双写条件；listen末音节不重读，不双写。'),
q('e-said','独立判断不规则形式','补好昨天说的话。',fill([blank('She','“Hello” yesterday.',['said','sayed','say'])],['said']),'say的过去式是said。'),
q('e-negative','独立形成过去否定','昨天他们没有打开盒子。',fill([blank('They','the box yesterday.',['didn’t open','didn’t opened','don’t open'])],['didn’t open']),'didn’t后用原形open。'),
q('e-question','独立形成过去疑问','补好询问昨天的问句。',fill([blank('','he call the doctor yesterday?',['Did','Does','Was']),blank('Did they','the room yesterday?',['air','aired','airs'])],['Did','air']),'用Did提问，动作保持原形。'),
q('e-yes','独立肯定简答','记录：Tom called the doctor.\nDid Tom call the doctor?',choice(['Yes, he did.','Yes, he was.','Yes, he does.'],'Yes, he did.'),'过去Did问句用did作简答。'),
q('e-no','独立否定简答','记录：Jane didn’t telephone.\nDid Jane telephone?',choice(['No, she didn’t.','No, she doesn’t.','No, she wasn’t.'],'No, she didn’t.'),'过去Did问句用didn’t否定简答。'),
q('e-locate','独立定位助动词后的原形','在这句问话中，哪个词是动作原形？',{type:'locate',fragments:[{value:'Did'},' she ',{value:'empty'},' the basket ',{value:'yesterday'},'?'],options:['Did','empty','yesterday'],answer:'empty'},'empty是动作，Did承担过去提问。'),
q('e-when','独立构建When问句','询问他们什么时候玩游戏。',bank(['When','did','they','play a game','played a game'],'When did they play a game',4,'?'),'询问过去时间用When did…和动作原形。'),
q('e-what','独立区别动作与时间问答','记录：They climbed the hill yesterday afternoon.\nWhat did they do?',choice(['They climbed the hill.','Yesterday afternoon.','At six o’clock.'],'They climbed the hill.'),'What did…do问做了什么。'),
q('e-perspective','独立转换问答视角','你和Jane昨天倒空了篮子。\nDid you and Jane empty the basket?',choice(['Yes, we did.','Yes, they did.','Yes, we do.'],'Yes, we did.'),'包括自己和同伴的回应使用we。'),
q('e-contrast','综合区分习惯与一次过去动作','补全习惯与昨日的对比。',fill([blank('She usually','home at five.',['arrives','arrived','arrive']),blank('Yesterday she','home at six.',['arrived','arrives','arrive'])],['arrives','arrived']),'现在的习惯与昨天一次动作分开表达。'),
q('e-record','综合核对动作否定与时间','记录：last night · no game · stayed at home。哪一句完整符合？',choice(['I didn’t play a game. I stayed at home last night.','I didn’t played a game. I stay at home last night.','I played a game. I stayed at school last night.'],'I didn’t play a game. I stayed at home last night.'),'事实、时态和否定结构都要匹配。')
];
const dates=['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','13th','14th','15th'];
unit.learning.MODELS=actions.map(([base,past,cn,ph,art,object],i)=>({label:dates[i]+' · '+past,image:image(art),en:'When did you '+base+(object?' '+object:'')+'?',result:'I '+past+(object?' '+object:'')+' on the '+dates[i]+'.'}));
unit.learning.TIMES=[['this morning','yesterday morning','the day before yesterday in the morning'],['this afternoon','yesterday afternoon','the day before yesterday in the afternoon'],['this evening','yesterday evening','the day before yesterday in the evening'],['tonight','last night','the night before last']];
unit.learning.REFERENCE=[
'已结束的过去动作：I worked yesterday. 过去的习惯：When I lived there, I walked to school every day. 要看完整时间语境，不能只看often或every day。',
'多数规则动词加-ed：work → worked。词尾已有e只加-d：arrive → arrived。',
'辅音字母+y：study → studied；元音字母+y：play → played，enjoy → enjoyed。',
'重读闭音节结尾，且末尾是一个元音字母+一个辅音字母时，通常双写末尾辅音再加-ed：stop → stopped；plan → planned。open、listen末音节不重读，不双写。',
'本课不规则形式：say → said；do → did。不能写成sayed或doed。',
'过去否定：did not／didn’t + 动词原形。过去疑问：Did + 主语 + 动词原形…? 简答Yes, … did.／No, … didn’t.',
'When did you…?询问时间；What did you do…?询问做了什么。you提问时，回答者按自己／自己与同伴使用I／we。',
'过去的状态仍可用was／were；不能把did当作所有过去句子通用的问句开头。',
'今天早晨的动作若已经结束，可以说I worked this morning；如果还在进行，要按真实语境表达。this morning本身不固定等于过去。',
'规则过去式-ed可读/t/、/d/或/ɪd/，图鉴保留词形和音标，由老师示范；本版不设置听辨题，不据此判定发音达标。',
'一次once，两次twice，三次three times。故事中“This is Pauline’s mother”是Pauline自己的转述，不是实际母亲接听。'
];
unit.learning.WRITING_A=['It is raining now. It ____ yesterday.','It is snowing now. It ____ yesterday.','He is boiling some eggs. He ____ some yesterday.','We are enjoying our lunch. We ____ it yesterday, too.'];
unit.learning.WRITING_B=['they / clean their shoes / yesterday','he / open the box / last night','they / sharpen their pencils / this morning','she / turn on the television / this evening','she / listen to the radio / last night','she / boil an egg / yesterday morning','they / play a game / yesterday afternoon','he / stay in bed / the day before yesterday / in the morning','she / telephone her husband / yesterday evening','she / call the doctor / the night before last'];
core.unit7172=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
