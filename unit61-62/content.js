(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit61-62/'+name+'.svg';
const textSource='《新概念英语智慧版1》Lesson61–62，纸页122–125／PDF155–158';
const grammarSource='《同步导学》Grammar纸页111／PDF125；《语法练习册》纸页172–178／PDF186–192';
const WORDS=[
 ['feel','感觉','/fiːl/'],['look','看起来','/lʊk/'],['must','必须','/mʌst/'],['call','叫；请','/kɔːl/'],['doctor','医生','/ˈdɒktə/'],['telephone','电话','/ˈtelɪfəʊn/'],
 ['remember','记得','/rɪˈmembə/'],['mouth','嘴','/maʊθ/'],['tongue','舌头','/tʌŋ/'],['bad','严重的；坏的','/bæd/'],['cold','感冒','/kəʊld/'],['news','消息','/njuːz/'],
 ['headache','头痛','/ˈhedeɪk/'],['aspirin','阿司匹林','/ˈæsprɪn/'],['earache','耳痛','/ˈɪəreɪk/'],['toothache','牙痛','/ˈtuːθeɪk/'],['dentist','牙医','/ˈdentɪst/'],['stomach ache','胃痛','/ˈstʌmək eɪk/'],
 ['medicine','药','/ˈmedsən/'],['temperature','体温；本课has a temperature指发烧','/ˈtemprətʃə/'],['flu','流感','/fluː/'],['measles','麻疹','/ˈmiːzəlz/'],['mumps','腮腺炎','/mʌmps/'],['ill','生病的','/ɪl/'],['because','因为','/bɪˈkɒz/'],['so','所以','/səʊ/']
].map(([en,cn,ph])=>({en,cn,ph,image:image(en.replaceAll(' ','-'))}));
const unit={id:'unit61-62',version:1,contentRevision:'jimmy-doctor-v1',mode:'classroom',title:'给 Jimmy 请医生',path:'/unit61-62/',start:'learn/words',progress:{learningKey:'canran:unit61-62:learning:v1'},objects:WORDS,
 learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
 {id:'l1',title:'哪里不舒服',activities:[['words','身体小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
 {id:'l2',title:'医生来家里',activities:[['text','家访小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
 {id:'l3',title:'说清情况和原因',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
 {id:'l4',title:'帮忙传个话',activities:[['apply','问诊小帮手','give']],required:['apply']},
 {id:'l5',title:'完成家访挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
 ],questions:{},reward:{edition:'jimmy-doctor-v1',title:'细心传话小达人',lesson:'Lesson 61–62',scene:'/assets/unit61-62/keepsake-story-v2.webp',alt:'医生在家中检查Jimmy的嘴，妈妈陪在床边',color:'#7b9c8e',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','问诊小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={father:'Mr. Williams',mother:'Mrs. Williams',doctor:'Doctor'};
unit.learning.DIALOGUE=[
 ['father','Where’s Jimmy?','Jimmy在哪儿？'],['mother','He’s in bed.','他躺在床上。'],['father','What’s the matter with him?','他怎么了？'],['mother','He feels ill.','他觉得不舒服。'],['father','He looks ill.','他看起来病了。'],['mother','We must call the doctor.','我们必须请医生来。'],['father','Yes, we must.','是的，我们必须请医生。'],['father','Can you remember the doctor’s telephone number?','你还记得医生的电话号码吗？'],['mother','Yes. It’s 09754.','记得，是09754。'],
 ['doctor','Open your mouth, Jimmy. Show me your tongue. Say, ‘Ah’.','张开嘴，Jimmy。让我看看你的舌头。说“啊”。'],['father','What’s the matter with him, doctor?','医生，他怎么了？'],['doctor','He has a bad cold, Mr. Williams, so he must stay in bed for a week.','他得了重感冒，Williams先生，所以他必须卧床一周。'],['mother','That’s good news for Jimmy.','这对Jimmy来说可是个好消息。'],['doctor','Good news? Why?','好消息？为什么？'],['father','Because he doesn’t like school!','因为他不喜欢上学！']
].map(([who,text,cn],i)=>({id:'u6162-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u6162-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});
const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});
const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
 q('v-doctor','识别医生','选出图中人物的英文。',choice(['doctor','teacher','shop assistant'],'doctor',{image:image('doctor'),imageAlt:'戴听诊器的医生'}),'doctor是医生。'),
 q('v-feel','区分感觉与看起来','把两句话配好意思。',match([['He feels ill.','他觉得不舒服。'],['He looks ill.','他看起来病了。']]),'feel说自己的感觉；look说看起来怎样。'),
 q('v-remember','理解remember','Can you remember the number? 是问你能不能做什么？',choice(['记起号码','写大号码','更换号码'],'记起号码'),'remember是记得。'),
 q('v-body','区分嘴与舌头','医生说到的身体部位，配一配。',match([['mouth','嘴'],['tongue','舌头']]),'mouth是嘴，tongue是舌头。'),
 q('v-cold','按语境理解bad cold','He has a bad cold. 这里cold指什么？',choice(['感冒','寒冷的天气','冷饮'],'感冒'),'have a cold表示感冒。'),
 q('v-news','理解news','That’s good news. 是在说什么？',choice(['那是个好消息。','那是个新号码。','那是一份药。'],'那是个好消息。'),'news是消息。'),
 q('v-ache','辨认不同部位的疼痛词','为三个词配好意思。',match([['headache','头痛'],['earache','耳痛'],['toothache','牙痛']]),'head、ear、tooth分别提示头、耳、牙。'),
 q('v-illness','区分三种疾病名称','把疾病名称与中文配好。',match([['flu','流感'],['measles','麻疹'],['mumps','腮腺炎']]),'这三个名称表示不同疾病，不能互换。')
];
unit.questions.roles=[
 q('r-where','原文定位Jimmy的位置','爸爸问Where’s Jimmy?，妈妈怎么回答？',choice(['He’s in bed.','He’s at school.','He’s in the garden.'],'He’s in bed.'),'妈妈说他躺在床上。','找妈妈的第一句回答。'),
 q('r-him','追踪原文him的指代','What’s the matter with him? 这里him指谁？',choice(['Jimmy','Mr. Williams','医生'],'Jimmy'),'父母在谈Jimmy。','看前面在问谁在哪里。'),
 q('r-phone','准确读取电话含首位0','妈妈记得的医生号码是哪一个？',choice(['09754','09745','9754'],'09754'),'原文是09754，开头的0也要保留。','逐位核对，不把号码当作普通数字。'),
 q('r-check','提取医生检查动作','医生先请Jimmy做什么？',choice(['张开嘴，让他看看舌头','站起来走一圈','写出自己的名字'],'张开嘴，让他看看舌头'),'医生说Open your mouth…Show me your tongue。','回看医生到家后的第一段话。'),
 q('r-cold','不混淆61的病情','Lesson 61里，医生说Jimmy得了什么病？',choice(['a bad cold','measles','a toothache'],'a bad cold'),'61的原文说重感冒。','依据这段故事，不套用其他例句。'),
 q('r-week','提取本次医嘱时长','故事中的医生让Jimmy卧床多久？',choice(['for a week','for a day','for a month'],'for a week'),'这是故事中医生对Jimmy的指示：一周。','看stay in bed后面的时间。'),
 q('r-view','区分消息的视角','妈妈说That’s good news for Jimmy. 是说谁觉得这是好消息？',choice(['Jimmy','医生','所有生病的人'],'Jimmy'),'for Jimmy限定了这句话的视角。','good news后面还有for谁？'),
 q('r-reason','理解结尾的真实原因','爸爸为什么说这是Jimmy的好消息？',choice(['Because he doesn’t like school.','Because he likes medicine.','Because he is already well.'],'Because he doesn’t like school.'),'原文的结尾是Jimmy不喜欢上学。','依据爸爸最后一句，不猜生病的好处。')
];
unit.questions.grammar=[
 g('meaning','have表示患病','He has a cold. 这里has表示什么？',choice(['患有','吃掉','拿着'],'患有'),'have／has和疾病名称搭配，可以表示患病。','看have后面是哪类词。',model(['I have a headache.','我头痛。这里have不是“吃”。'])),
 g('article','cold和headache前的a','补好两种不舒服的说法。',fill([blank('She has ',' cold.',['a','an']),blank('I have ',' headache.',['a','an'])],['a','a']),'a cold和a headache中的a不能在这些说法里省去。','根据后面的第一个音选择。',model(['He has a sore throat.','他嗓子痛。这个说法里用a。'])),
 g('optional','接受toothache的冠词变体','表达“我牙痛”，哪种说法可以？',choice(['I have toothache. 和 I have a toothache. 都可以','只有I have a toothache.可以','只有I have toothache.可以'],'I have toothache. 和 I have a toothache. 都可以'),'toothache前可以加a，也可以不加；不要把其中一种判错。','不同疾病名的搭配不完全相同。',model(['I have stomach ache. / I have a stomach ache.','两种都可以表示胃痛。'])),
 g('no-a','疾病名不用一律加a','哪一组都符合本课的疾病说法？',choice(['have flu / have measles / have mumps','have a flu / have a measles / have a mumps','have an flu / have an measles / have an mumps'],'have flu / have measles / have mumps'),'课文用have flu、have measles、have mumps；也可以用the flu／the measles／the mumps。','不要给所有疾病名称统一加a。',model(['He has flu. / He has the flu.','flu前不加a；the flu也是正确用法。'])),
 g('does','does后面have还原','把陈述改成问题。',fill([blank('She ',' a headache.',['has','have']),blank('Does she ',' a headache?',['have','has'])],['has','have']),'第三人称陈述用has；does后用have原形。','问句已经有does。',model(['He has a cold. → Does he have a cold?','has遇到does，后面回到have。'])),
 g('negative','does提问与否定回答','George没有头痛。补好这段问答。',fill([blank('Does George ',' a headache?',['have','has']),blank('No, he ','.',['doesn’t','isn’t'])],['have','doesn’t']),'Does…have…?的否定短答用doesn’t。','不要把have的问答换成be。',model(['Does Jane have a cold? No, she doesn’t.','问句用does，短答与它配合。'])),
 g('why','because回答直接原因','Why is Ben at home? 材料说他生病了，选原因。',choice(['Because he is ill.','Yes, he is.','He is at home.'],'Because he is ill.'),'why问原因，because后说出原因。','回答为什么，不能只重复在哪里。',model(['Why do you like this book? Because it is interesting.','为什么喜欢？因为有趣。'])),
 g('reason-part','从because句中定位原因','I stay at home because I feel ill. 哪一部分是原因？',{type:'locate',fragments:[{value:'I stay at home'},' because ',{value:'I feel ill'},'.'],options:['I stay at home','I feel ill'],answer:'I feel ill'},'because后面的I feel ill说明原因。','把事情和为什么发生分开。',model(['I eat because I am hungry.','做的事：吃；原因：饿。'])),
 g('join','用because连接结果和原因','用词块说：她待在家，因为她病了。',bank(['She stays at home','because','she is ill','so'],'She stays at home because she is ill',3),'先说事情，because后补原因。','因为后面要接完整原因。',model(['He goes to bed early because he is tired.','他早睡，因为他累了。'])),
 g('so','区分because原因与so结果','“他病了”是原因，“他待在家”是结果。',fill([blank('He stays at home ',' he is ill.',['because','so']),blank('He is ill, ',' he stays at home.',['so','because'])],['because','so']),'because引出原因，so引出结果；这里不用because和so双重连接同一句。','顺着箭头想：生病→待在家。',model(['It is late, so I go home. / I go home because it is late.','晚了→回家。同一关系可以换顺序表达。'])),
 g('must','must后保持动词原形','按故事里的指示补句：他必须卧床。',choice(['He must stay in bed.','He must stays in bed.','He must to stay in bed.'],'He must stay in bed.'),'must后接动词原形，没有to，也不加s。','must不随he变成musts。',model(['She must call the doctor.','主语是she，must后也用call。'])),
 g('he','将I改为He时区分动词','把“我”改成“他”。',fill([blank('I am not well. → He ',' not well.',['is','am']),blank('I feel ill. → He ',' ill.',['feels','feel'])],['is','feels']),'I am变He is；I feel变He feels。','先分清be和实义动词。',model(['I have a cold. → He has a cold.','换成he时，have要变has。'])),
 g('independent-articles','独立辨认带a的疾病表达','哪一组可以直接完成“I have…”？',choice(['a cold / a headache','cold / a headache','a cold / headache'],'a cold / a headache'),'a cold和a headache是本课固定搭配。','这两种疾病名都要留a。'),
 g('independent-variant','独立接受flu的合法变体','下面两句话能表达他患流感吗？\nHe has flu. / He has the flu.',choice(['两句都可以','只有第一句可以','只有第二句可以'],'两句都可以'),'flu和the flu都可用；不能把the一概判错。','想一想图鉴和刚才的短示范。'),
 g('independent-reason','撤去示范独立说明原因','已知Sam很累，所以早睡。用because说一句。',bank(['Sam goes to bed early','because','he is tired','so'],'Sam goes to bed early because he is tired',3),'because后给出早睡的原因。','结果和原因不要放反。'),
 g('independent-does','独立用does提问与否定','Jane没有感冒。补好问答。',fill([blank('',' Jane have a cold?',['Does','Is']),blank('No, she doesn’t ',' a cold.',['have','has'])],['Does','have']),'Does…have…?与doesn’t have配套。','does／doesn’t之后用原形。')
];
unit.questions.apply=[
 q('a-call','准确转达课文电话','电话便签：09754。帮妈妈选对号码，再联系医生。',choice(['09754','09745','9754'],'09754'),'按便签逐位核对，保留开头的0。','这只是课文里的电话便签。'),
 q('a-report','按给定信息回答病情','新信息卡：George — an earache。有人问：What’s the matter with George?',choice(['He has an earache.','He has a headache.','He is a doctor.'],'He has an earache.'),'依据提供的情况传话，不凭图片诊断。','核对信息卡上的疾病词。'),
 q('a-cause','根据材料说明未到校原因','留言：Lily is ill. She is at home.\nWhy is Lily at home?',bank(['Because','she is ill','she is at school'],'Because she is ill',2),'材料已经说明原因是她生病了。','为什么在家？回到留言找原因。'),
 q('a-instruction','忠实转述故事医生的话','故事里的医生说：He must stay in bed for a week. 帮爸爸转述。',fill([blank('Jimmy must ',' in bed',['stay','stays']),blank(' for ','.',['a week','a month'])],['stay','a week']),'准确转述动词和时间；这不是对所有感冒的通用指示。','两个空都依据医生原话。'),
 q('a-context','不同课的Jimmy不混成一次诊断','61：Jimmy has a bad cold.\n62的一组例句：Jimmy has measles.\n两条信息应怎样记录？',choice(['分别属于故事与另一组例句','Jimmy在故事里同时得了两种病','医生先说错了，后来改成麻疹'],'分别属于故事与另一组例句'),'62是独立替换情境，不是61诊断的后续。','教材例句不一定延续同一个故事。'),
 q('a-dentist','依照教材配句辨认职业','62的配句：He has a toothache. So he must see a dentist.\n这句提到哪种职业？',choice(['牙医','教师','售货员'],'牙医'),'dentist是牙医；题目考读懂词语，不作医疗判断。','在第二句找职业名称。'),
 q('a-temperature','理解has a temperature的语境','便签写着：Sam has a temperature.\n本课这句话表示什么？',choice(['Sam发烧了。','Sam没有体温。','Sam买了温度计。'],'Sam发烧了。'),'have a temperature在这里表示发烧。','短语含义不能逐词硬译。'),
 q('a-ordinal','读懂本课复合序数词','为书页上的编号配好英文。',match([['52nd','fifty-second'],['63rd','sixty-third'],['107th','one hundred and seventh']]),'复合序数词通常变化最后一部分；107结尾是seventh。','看最后一部分，而不是只看数字个数。')
];
unit.questions.apply[7].workshop={model:model(['41st — forty-first / 118th — one hundred and eighteenth','看最后一部分：first、eighteenth。'])};
unit.questions.exam=[
 q('e-feel','独立区分感觉与样子','“他自己觉得不舒服”是哪一句？',choice(['He feels ill.','He looks ill.','He remembers it.'],'He feels ill.'),'feel描述自己的感觉。'),
 q('e-parts','独立定位身体部位','Open your mouth. Show me your tongue. 第二句让看哪一部分？',choice(['舌头','嘴唇','耳朵'],'舌头'),'tongue是舌头。'),
 q('e-call','整合请医生与记号码','父母决定请医生后，爸爸询问妈妈什么？',choice(['能否记得医生的电话号码','Jimmy的学校名字','药品的价格'],'能否记得医生的电话号码'),'爸爸问Can you remember…?。'),
 q('e-news','独立理解news不可数','哪句在说“那是个好消息”？',choice(['That is good news.','Those are a good news.','That is a good new.'],'That is good news.'),'news在这里不可数，不用a，也不是new的复数。'),
 q('e-facts','综合读取原文事实','哪份记录与61的医生原话一致？',choice(['a bad cold · stay in bed for a week','measles · stay in bed for a week','a bad cold · stay in bed for a month'],'a bad cold · stay in bed for a week'),'诊断和时长都来自61原文。'),
 q('e-ending','解释故事结尾而不捏造康复','Jimmy为什么觉得卧床是好消息？',choice(['He doesn’t like school.','He is already well.','He likes taking medicine.'],'He doesn’t like school.'),'这是原文的幽默结尾，不表示已经康复。'),
 q('e-have','独立使用患病的have','用词块说：她头痛。',bank(['She','has','a headache','is'],'She has a headache',3),'用has表示患病。'),
 q('e-a','独立选择冠词','我感冒了，George耳痛。',fill([blank('I have ',' cold.',['a','an']),blank('George has ',' earache.',['an','a'])],['a','an']),'a cold；earache以元音音素开头，用an。'),
 q('e-variant','接受stomach ache的合法变体','I have stomach ache. / I have a stomach ache. 应怎样判断？',choice(['两句都可以','第一句一定错','第二句一定错'],'两句都可以'),'stomach ache可以带a或不带。'),
 q('e-flu','独立区分a与the的疾病用法','哪一组说法都正确？',choice(['has flu / has the flu','has a flu / has flu','has an flu / has the flu'],'has flu / has the flu'),'flu和the flu可用，不用a flu表示本课这种患病说法。'),
 q('e-does','独立组成疾病疑问句','用词块问：她牙痛吗？',bank(['Does','she','have','a toothache','has'],'Does she have a toothache',4,'?'),'Does后用have。'),
 q('e-no','依据新信息否定回答','信息：Tom没有感冒。\nDoes Tom have a cold?',choice(['No, he doesn’t.','No, he isn’t.','Yes, he does.'],'No, he doesn’t.'),'Does提问，用doesn’t作否定短答。'),
 q('e-he','独立将I改为He','把第一人称改为第三人称。',fill([blank('I am not well. → He ',' not well.',['is','am']),blank('I do not like doctors. → He ',' like doctors.',['does not','do not'])],['is','does not']),'he用is，实义动词否定用does not。'),
 q('e-why','新语境独立回答why','材料：They are hungry. They want lunch.\nWhy do they want lunch?',choice(['Because they are hungry.','Yes, they do.','They want lunch.'],'Because they are hungry.'),'why要回答原因。'),
 q('e-reason','独立从完整句定位原因','He goes home because it is late. 点出原因部分。',{type:'locate',fragments:[{value:'He goes home'},' because ',{value:'it is late'},'.'],options:['He goes home','it is late'],answer:'it is late'},'because后的it is late是原因。'),
 q('e-so','独立辨别原因与结果顺序','外面冷，所以她关窗。',fill([blank('It is cold, ',' she closes the window.',['so','because']),blank('She closes the window ',' it is cold.',['because','so'])],['so','because']),'so带出结果，because带出原因。'),
 q('e-illness','疾病词与职业词准确配义','为三个词配好中文。',match([['stomach ache','胃痛'],['mumps','腮腺炎'],['dentist','牙医']]),'疾病和职业不能混淆。'),
 q('e-must','独立运用must原形','用词块说：我们必须请医生。',bank(['We','must','call the doctor','to call the doctor'],'We must call the doctor',3),'must后接call原形。'),
 q('e-modal','He改写时must不加s','I must see a doctor. 把I改成He。',choice(['He must see a doctor.','He must sees a doctor.','He musts see a doctor.'],'He must see a doctor.'),'must和后面的动词都不因he而加s。'),
 q('e-temperature','独立理解体温短语','Sam has a temperature. 这句话没有告诉我们什么？',choice(['具体多少度','Sam有发烧的情况','生病的人叫Sam'],'具体多少度'),'短语表示发烧，但没有具体体温数字。'),
 q('e-scope','区分原文与替换例句','有人说“61的医生诊断Jimmy得了麻疹”。根据两课，应怎样核对？',choice(['61说重感冒；麻疹出现在62另一组例句','这句话正确，两课讲同一次诊断','两课都没出现Jimmy'],'61说重感冒；麻疹出现在62另一组例句'),'不能把两个教学情境合成一次诊断。'),
 q('e-because','独立写出新原因关系','已知Ann累了，所以她早睡。用词块说明原因。',bank(['Ann goes to bed early','because','she is tired','so'],'Ann goes to bed early because she is tired',3),'because连接结果与直接原因。'),
 q('e-ordinals','独立辨认新复合序数词','给书页编号配好英文。',match([['74th','seventy-fourth'],['96th','ninety-sixth'],['118th','one hundred and eighteenth']]),'复合序数词在最后部分体现顺序。')
];
unit.learning.MODELS=[
 ['41st','She has a headache.','So she must take an aspirin.','她头痛。课本配句提到服阿司匹林。','headache'],['52nd','George has an earache.','So he must see a doctor.','George耳痛。配句说他必须去看医生。','earache'],['63rd','He has a toothache.','So he must see a dentist.','他牙痛。配句说他必须去看牙医。','toothache'],['74th','Jane has a stomach ache.','So she must take some medicine.','Jane胃痛。课本配句提到服药。','stomach-ache'],['85th','Sam has a temperature.','So he must go to bed.','Sam发烧。配句说他必须上床。','temperature'],['96th','Dave has flu.','So he must stay in bed.','Dave患流感。配句说他必须卧床。','flu'],['107th','Jimmy has measles.','So we must call the doctor.','这一组例句中的Jimmy患麻疹。配句说我们必须请医生。','measles'],['118th','Susan has mumps.','So we must call the doctor.','Susan患腮腺炎。配句说我们必须请医生。','mumps']
].map(([number,en,result,cn,art])=>({number,en,result,cn,image:image(art)}));
unit.learning.REFERENCE=[
 'have可以表示患病：I have a cold. / He has a cold. 提问：Does he have a cold? 否定：He doesn’t have a cold. does／doesn’t后接have原形。have got也可表达患病，如He has got a cold；本单元练习主线沿用课本have。',
 'a cold、a headache、a sore throat中的a不能在这些表达里省去。toothache、stomach ache、backache可以带a或不带；an earache也可以说earache。不是所有疾病前都统一加a。',
 '课本用have flu／measles／mumps，不加a；have the flu／the measles／the mumps也合法。本课不把合法变体作错项。',
 'Why…?问原因。because后给出原因：He stays at home because he is ill. so后说结果：He is ill, so he stays at home. 本课练习中不用because和so双重连接同一句。',
 'must后用动词原形：He must stay in bed. 主语换成he，must和stay都不加s，也不加to。mustn’t是禁止，不是“不必”；本课不练这一类否定短答。',
 'feel说自己的感觉，look说看起来怎样。news是不可数名词：That is good news. 不是a news。',
 '61的Jimmy患重感冒，62的Jimmy患麻疹是独立配句。for a week仅转述故事里的医生指示，不是所有感冒的处理方法。',
 '序数词：41st forty-first，52nd fifty-second，63rd sixty-third，74th seventy-fourth，85th eighty-fifth，96th ninety-sixth，107th one hundred and seventh，118th one hundred and eighteenth。'
];
unit.learning.SAFETY='这些是课本中的语言例句，不是用药建议。生病要告诉家长，由医生决定治疗；不要自行按例句用药。';
unit.learning.WRITING_A=['I have a cold.','I can’t go to work.','I am not well.','I feel ill.','I must see a doctor.','I do not like doctors.'];
unit.learning.WRITING_B=[
 'Elizabeth / (an earache) / a headache / take an aspirin',
 'George / (a headache) / an earache / see a doctor',
 'Jim / (a stomach ache) / a toothache / see a dentist',
 'Jane / (a toothache) / a stomach ache / take some medicine',
 'Sam / (a stomach ache) / a temperature / go to bed',
 'Dave / (a headache) / flu / stay in bed',
 'Jimmy / (a headache) / measles / (we…) call the doctor',
 'Susan / (an earache) / mumps / (we…) call the doctor'
];
core.unit6162=unit;if(root.document?.documentElement?.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
