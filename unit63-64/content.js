(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit63-64/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页126–129／PDF159–162';
const grammarSource='《同步导学》Grammar纸页114–115／PDF128–129；《语法练习册》纸页180–183／PDF194–197';
const WORDS=[['better','好些的','/ˈbetə/'],['certainly','当然','/ˈsɜːtənli/'],['get up','起床','/ɡet ʌp/'],['yet','还；仍（本课用于否定句）','/jet/'],['rich','油腻的（rich food）','/rɪtʃ/'],['food','食物','/fuːd/'],['remain','保持；继续','/rɪˈmeɪn/'],['play','玩','/pleɪ/'],['match','火柴','/mætʃ/'],['talk','谈话','/tɔːk/'],['library','图书馆','/ˈlaɪbrəri/'],['drive','开车','/draɪv/'],['so','如此地（so quickly）','/səʊ/'],['quickly','快地','/ˈkwɪkli/'],['lean out of','身体探出','/liːn aʊt əv/'],['break','打破','/breɪk/'],['noise','喧闹声','/nɔɪz/'],['mustn’t','不允许；不准','/ˈmʌsnt/'],['for','持续；达（一段时间或距离）','/fə/'],['another','又一；再一','/əˈnʌðə/'],['about','大约','/əˈbaʊt/'],['warm','温暖的','/wɔːm/']].map(([en,cn,ph])=>({en,cn,ph,image:image(en.replaceAll(' ','-').replace('’',''))}));
WORDS[0].image='/assets/unit63-64/bed.webp';
const unit={id:'unit63-64',version:1,contentRevision:'jimmy-better-v1',mode:'classroom',title:'Jimmy 好些了',path:'/unit63-64/',start:'learn/words',progress:{learningKey:'canran:unit63-64:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'看看新变化',activities:[['words','生活小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'医生再来访',activities:[['text','康复小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'把提醒说清楚',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'关心身边的人',activities:[['apply','温柔提醒站','give']],required:['apply']},
{id:'l5',title:'完成关怀挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'jimmy-better-v1',title:'贴心提醒小达人',lesson:'Lesson 63–64',scene:'/assets/unit63-64/keepsake-story-v1.webp',alt:'医生举起两根手指提醒再休息两天，Jimmy微笑，妈妈在旁倾听',color:'#879d7a',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','温柔提醒站'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={doctor:'Doctor',mother:'Mrs. Williams'};
unit.learning.DIALOGUE=[
['doctor','How’s Jimmy today?','Jimmy今天怎么样？'],['mother','Better. Thank you, doctor.','好些了。谢谢您，医生。'],['doctor','Can I see him please, Mrs. Williams?','Williams太太，请问我可以看看他吗？'],['mother','Certainly, doctor. Come upstairs.','当然可以，医生。请上楼。'],
['doctor','You look very well, Jimmy. You are better now, but you mustn’t get up yet. You must stay in bed for another two days.','你看起来好多了，Jimmy。你现在好些了，但还不准起床。你必须再卧床两天。'],
['doctor','The boy mustn’t go to school yet, Mrs. Williams. And he mustn’t eat rich food.','这孩子还不准上学，Williams太太。而且他不准吃油腻的食物。'],['mother','Does he have a temperature, doctor?','医生，他还发烧吗？'],['doctor','No, he doesn’t.','不，他不发烧了。'],['mother','Must he stay in bed?','他必须卧床吗？'],
['doctor','Yes. He must remain in bed for another two days. He can get up for about two hours each day, but you must keep the room warm.','是的。他必须再卧床两天。他每天可以起来大约两小时，但您必须保持房间温暖。'],['doctor','Where’s Mr. Williams this evening?','Williams先生今天晚上在哪里？'],['mother','He’s in bed, doctor. Can you see him please? He has a bad cold, too!','他也躺在床上，医生。请问您能看看他吗？他也得了重感冒！']
].map(([who,text,cn],i)=>({id:'u6364-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u6364-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});const blank=(before,after,options)=>({before,after,options});const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-better','理解better不是完全康复','妈妈说Jimmy is better. 是说什么？',choice(['他比之前好些了。','他比之前更糟了。','他一定可以立即上学。'],'他比之前好些了。'),'better在这里表示身体状况比之前好些。'),
q('v-actions','区分三种生活动作','给动作配好意思。',match([['get up','起床'],['remain in bed','继续卧床'],['talk','谈话']]),'get up与remain in bed描述不同动作。'),
q('v-library','看图识别图书馆','图中这个地方的英文是什么？',choice(['library','bedroom','kitchen'],'library',{image:image('library'),imageAlt:'有书架、书桌和阅读灯的图书馆'}),'library是图书馆。'),
q('v-context','按语境辨认新词','把词组和意思配起来。',match([['rich food','油腻的食物'],['make a noise','弄出喧闹声'],['so quickly','如此快地']]),'so quickly中的so表示如此地，不是所以。'),
q('v-yet','读懂否定句中的yet','You mustn’t get up yet. 这里yet表达什么？',choice(['现在还不行','永远不行','已经做完'],'现在还不行'),'yet配合否定表示现在还不能做。'),
q('v-match','识别火柴词义','“火柴”的英文是哪一个？',choice(['match','mouth','month'],'match',{illustrate:false}),'本课match是火柴。'),
q('v-movement','区分移动与动作词','为三个词配好意思。',match([['drive','开车'],['lean out of','身体探出'],['break','打破']]),'准确读懂动作，才能理解提醒。')
];
unit.questions.roles=[
q('r-better','提取Jimmy现在的变化','这次医生来访时，妈妈怎样描述Jimmy？',choice(['Better.','Very bad.','At school.'],'Better.'),'妈妈说Better。','看妈妈的第一句回答。'),
q('r-upstairs','理解邀请医生上楼','Come upstairs. 是谁对谁说的？',choice(['妈妈对医生','医生对Jimmy','Jimmy对爸爸'],'妈妈对医生'),'妈妈请医生上楼看Jimmy。','把这一句和前一句Can I see him?连起来。'),
q('r-days','提取还需要的时长','医生说for another two days，是让Jimmy怎样休息？',choice(['再卧床两天','只在两点钟卧床','一共只病了两天'],'再卧床两天'),'another表示再；原文没说总共生病几天。','不要把剩余时间当成总病程。'),
q('r-temperature','提取这次是否发烧','妈妈问Does he have a temperature? 医生的回答说明什么？',choice(['Jimmy现在不发烧。','Jimmy仍然发烧。','医生没有回答。'],'Jimmy现在不发烧。'),'No, he doesn’t回答发烧这个问题。','先核对he和前面的问句。'),
q('r-condition','完整理解允许范围与条件','医生后来补充：Jimmy可以起来多久，房间要怎样？',choice(['每天大约两小时，房间保持温暖','每天两天，房间保持寒冷','随时起来，不必管房间'],'每天大约两小时，房间保持温暖'),'about two hours each day和keep the room warm要一起读。','回看医生回答Must he stay in bed?的整段。'),
q('r-rich','定位明确的禁止事项','医生还说Jimmy不准吃什么？',choice(['rich food','所有食物','书里没有提到食物'],'rich food'),'他说mustn’t eat rich food，没有禁止所有食物。','区分一类食物与全部食物。'),
q('r-father','理解结尾新增的信息','故事结尾，谁也卧床了？为什么？',choice(['Mr. Williams也得了重感冒','医生累了要睡觉','Mrs. Williams也牙痛'],'Mr. Williams也得了重感冒'),'妈妈说Mr. Williams has a bad cold, too。','最后的him已经指向另一个人。')
];
unit.questions.grammar=[
g('meaning','mustn’t表示禁止','You mustn’t play with matches. 表达什么？',choice(['不准玩火柴','不必玩火柴，想玩也可以','必须玩火柴'],'不准玩火柴'),'mustn’t表示不允许，不是“不必”。','看清must后面的否定。',model(['You mustn’t make a noise.','不准弄出喧闹声。'])),
g('dont','Don’t后用动词原形','补好“不要打破那个花瓶”。',fill([blank('Don’t ',' that vase.',['break','breaks','breaking'])],['break']),'Don’t后面用动词原形。','先看Don’t后该接哪种动词。',model(['Don’t talk in the library.','Don’t后直接接talk。'])),
g('mustnt','组成完整mustn’t禁令','用You mustn’t说：不准探出窗外。',bank(['You','mustn’t','lean out of the window','to lean out of the window'],'You mustn’t lean out of the window',3),'mustn’t后接动词原形，不加to。','把不允许的动作接在mustn’t后。',model(['You mustn’t drive so quickly.','mustn’t后用drive，不用to drive。'])),
g('be','提醒状态时保留be','补好两种“不要迟到”的说法。',fill([blank('Don’t ',' late.',['be','are']),blank('You mustn’t ',' late.',['be','are'])],['be','be']),'状态词late前保留be；Don’t和mustn’t后都用be原形。','late不是动词，需要be。',model(['Don’t be noisy. / You mustn’t be noisy.','不要吵闹。两种结构里都保留be。'])),
g('both','接受两种合法禁令','Don’t make a noise. / You mustn’t make a noise. 哪种判断正确？',choice(['两句都能表示禁止喧闹','只有第一句可以','只有第二句可以'],'两句都能表示禁止喧闹'),'两种都可表示禁令；mustn’t通常更强调不允许。','不能只因措辞不同就判错。',model(['Don’t open the window. / You mustn’t open the window.','都能阻止开窗；语气要结合情境。'])),
g('positive','区分必须做与不准做','规则：保持房间温暖；不要弄出喧闹声。',fill([blank('You ',' keep the room warm.',['must','mustn’t']),blank('You ',' make a noise.',['mustn’t','must'])],['must','mustn’t']),'must表示必须，mustn’t表示禁止。','一件事要做，另一件事不要做。',model(['You must read this note. You mustn’t break that vase.','必须读便签；不准打破花瓶。'])),
g('for','for表示持续时间','补好“我读书持续两小时”。',fill([blank('I read ',' two hours.',['for','at'])],['for']),'for后面的一段时间说明持续多久。','two hours是一段时间，不是钟点。',model(['We stay here for three days.','我们在这里待三天。'])),
g('duration','在完整句中定位时长','We stay here for a week. 哪部分说持续多久？',{type:'locate',fragments:[{value:'We'},' ',{value:'stay here'},' ',{value:'for a week'},'.'],options:['We','stay here','for a week'],answer:'for a week'},'for a week是持续一周。','找for带出的一段时间。',model(['They talk for an hour.','for an hour说明谈话持续一小时。'])),
g('howlong','用时长回答How long','信息卡：Ben can read for thirty minutes.\nHow long can Ben read?',choice(['For thirty minutes.','In the library.','Ben can.'],'For thirty minutes.'),'How long在这里问时长，不是地点或人物。','找材料里的时间段。',model(['How long can we stay? For two days.','问多久，就答持续多长时间。'])),
g('another','理解another表示再增加','“再待两天”，不是“两点钟待在这里”。',fill([blank('Stay here for ',' two days.',['another','about'])],['another']),'another two days表示再两天；about two days表示大约两天。','再增加与大约不是同一意思。',model(['Read for another ten minutes.','再读十分钟。'])),
g('jimmy-be','改成Jimmy时变化be和have','把I改成Jimmy。',fill([blank('I am better. → Jimmy ',' better.',['is','am']),blank('I have a cold. → Jimmy ',' a cold.',['has','have'])],['is','has']),'Jimmy是第三人称单数：am变is，have变has。','先看主语和动词种类。',model(['I must stay in bed. → Jimmy must stay in bed.','must与后面的stay都不加s。'])),
g('jimmy-do','改成Jimmy时区分肯定与否定','继续把I改成Jimmy。',fill([blank('I often read. → Jimmy often ','.',['reads','read']),blank('I don’t feel ill. → Jimmy ',' feel ill.',['doesn’t','don’t'])],['reads','doesn’t']),'肯定句read变reads；否定用doesn’t，feel保持原形。','否定里的doesn’t已经承担变化。',model(['I listen to the stereo. → Jimmy listens to the stereo.','一般现在时肯定句中，Jimmy后用listens。'])),
g('independent-rule','撤去示范独立组成禁令','用词块说：不要在图书馆讲话。',bank(['Don’t','talk','in the library','talks'],'Don’t talk in the library',3),'Don’t后用talk原形。','说清不要做的动作和地点。'),
g('independent-for','独立区分for时长与距离','补好两句：读二十分钟；走两英里。',fill([blank('Read ',' twenty minutes.',['for','at']),blank('Walk ',' two miles.',['for','at'])],['for','for']),'for可表示持续的时间，也可表示行进的距离。','两英里表示一段距离。')
];
// Distance is a Grammar target; a short model teaches it before the independent final item.
unit.questions.grammar[6].workshop.model.lines.push(['We walk for a mile.','我们走一英里。for也可表示一段距离。']);
unit.questions.apply=[
q('a-library','根据明确规则回应','图书馆规则写着：Don’t make a noise.\n朋友准备大声喊你，哪句提醒合适？',choice(['You mustn’t make a noise here.','You must make a noise here.','You mustn’t read here.'],'You mustn’t make a noise here.'),'把给定规则转成提醒，不扩大成禁止读书。','提醒应针对喧闹这件事。'),
q('a-window','按可见指令行动','提示牌：Keep the window closed. Don’t open it.\n补好提醒，再把牌子挂上。',fill([blank('You mustn’t ',' the window.',['open','close'])],['open']),'提醒是不能开窗；检查正确后才挂上牌子。','根据文字，不根据现实天气猜规则。'),
q('a-vase','在新情境完整表达禁止','桌上写着：Don’t break that vase! 你可以怎样转告？',bank(['You','mustn’t','break that vase','must'],'You mustn’t break that vase',3),'mustn’t准确转达不要打破花瓶。','转告时不能把否定漏掉。'),
q('a-timer','依据时间条理解another','读书计时：已读10分钟，再读5分钟。\nRead for another five minutes. 还要读多久？',choice(['5分钟','10分钟','15分钟'],'5分钟'),'another five minutes是还要再读5分钟，总时长是15分钟。','问剩余时间，不是总时间。'),
q('a-note','转述故事的完整允许条件','妈妈的记录：He can get up for about two hours each day, but you must keep the room warm.\n哪份便签没有漏掉条件？',choice(['每天起来约两小时；房间保暖','可以整天起来；房间保暖','只要房间暖就可以立刻上学'],'每天起来约两小时；房间保暖'),'保留大约、每天、两小时和保暖条件。','读完but后面再选。'),
q('a-scope','不把教材句子当现实求医禁令','64的一句转换例句是Don’t call the doctor! 这句话在本练习中的作用是什么？',choice(['练习否定句，不是生病时不许求助的规则','规定所有人生病都不能找医生','说明63里的医生不再看病'],'练习否定句，不是生病时不许求助的规则'),'教材句型练习不替代家长和医生的指导。','把语言例句与现实行为分开。'),
q('a-numbers','读懂本课三位基数词','把三位数与英文配好。',match([['110','one hundred and ten'],['221','two hundred and twenty-one'],['332','three hundred and thirty-two']]),'这些是数量编号，不是first／second一类序数词。','从百位读到十位、个位。')
];
unit.questions.apply[6].workshop={model:model(['443 — four hundred and forty-three','hundred后不加s；这里使用带and的英式读法。'])};
unit.questions.exam=[
q('e-better','独立理解康复状态','“Jimmy好些了”并不能直接说明什么？',choice(['他已经可以立刻上学','他比之前有所好转','妈妈说他的情况改善了'],'他已经可以立刻上学'),'好些了不等于已经可以上学。'),
q('e-so','独立区分so的语境','Don’t drive so quickly! 这里so是什么意思？',choice(['如此地','所以','因为'],'如此地'),'这里so修饰quickly，表示如此地。'),
q('e-rich','独立理解rich food','课文里的rich food指哪类食物？',choice(['油腻的食物','昂贵的食物','所有食物'],'油腻的食物'),'本课rich food不是所有食物或昂贵食物。'),
q('e-days','独立理解剩余时长','医生让Jimmy继续卧床for another two days。哪句话准确？',choice(['从这次说明起再休息两天','Jimmy总共只生病两天','每天在两点钟休息'],'从这次说明起再休息两天'),'another说明追加的时间，不能推算全部病程。'),
q('e-condition','独立整合原文允许条件','原文中Jimmy每天可以起来多久？同时要怎样？',choice(['大约两小时，保持房间温暖','大约两天，保持房间安静','一整天，保持窗户打开'],'大约两小时，保持房间温暖'),'完整条件来自医生同一段话。'),
q('e-him','独立追踪结尾指代','妈妈最后说Can you see him please? 这里him是谁？',choice(['Mr. Williams','Jimmy','医生'],'Mr. Williams'),'最后谈到卧床的是Mr. Williams。'),
q('e-prohibit','独立区分禁止与不必','You mustn’t lean out of the window. 表示什么？',choice(['不准把身体探出窗外','不必探出去，但想做也可以','必须把身体探出去'],'不准把身体探出窗外'),'mustn’t表示禁止。'),
q('e-dont','独立组装Don’t禁令','说：不要开那扇门。',bank(['Don’t','open','that door','opens'],'Don’t open that door',3),'Don’t后接open原形。'),
q('e-modal','独立检查mustn’t原形','哪句正确表达“Jimmy不准玩火柴”？',choice(['Jimmy mustn’t play with matches.','Jimmy mustn’t plays with matches.','Jimmy mustn’t to play with matches.'],'Jimmy mustn’t play with matches.'),'mustn’t后用play，不加s或to。'),
q('e-be','独立使用状态禁令','补好：不要吵闹。',fill([blank('Don’t ',' noisy.',['be','are']),blank('You mustn’t ',' noisy.',['be','are'])],['be','be']),'两种结构都用be。'),
q('e-positive','独立区分肯定要求与禁止','任务卡：Read this book. Don’t break that vase.\n补好转述。',fill([blank('You ',' read this book.',['must','mustn’t']),blank('You ',' break that vase.',['mustn’t','must'])],['must','mustn’t']),'按材料保留肯定与否定要求。'),
q('e-variants','独立接受两种禁令形式','Don’t talk here. / You mustn’t talk here. 哪种判断正确？',choice(['两句都能要求这里不要讲话','第二句必须加to才能用','第一句必须加You才能用'],'两句都能要求这里不要讲话'),'祈使句可省主语；mustn’t直接接原形。'),
q('e-locate','独立定位持续时间','Ann reads in the library for an hour. 点出持续时间。',{type:'locate',fragments:[{value:'Ann'},' reads ',{value:'in the library'},' ',{value:'for an hour'},'.'],options:['Ann','in the library','for an hour'],answer:'for an hour'},'for an hour表示一小时。'),
q('e-howlong','独立根据材料回答时长','材料：The children can play for twenty minutes.\nHow long can they play?',choice(['For twenty minutes.','In the garden.','The children.'],'For twenty minutes.'),'How long问持续多久。'),
q('e-distance','独立使用for表示距离','他们走了三英里的路：They walk ___ three miles.',fill([blank('They walk ',' three miles.',['for','at'])],['for']),'for可接一段距离。'),
q('e-timer','新材料辨别剩余与总时长','已读20分钟，还要再读10分钟：Read for another ten minutes.\n还要读多久？总共读多久？',choice(['再10分钟；总共30分钟','再30分钟；总共30分钟','再20分钟；总共10分钟'],'再10分钟；总共30分钟'),'another给出追加时间。'),
q('e-jimmy','独立将I改为Jimmy','改写两句。',fill([blank('I am better. → Jimmy ',' better.',['is','am']),blank('I often read in bed. → Jimmy often ',' in bed.',['reads','read'])],['is','reads']),'Jimmy用is，read在肯定句变reads。'),
q('e-jimmy-negative','独立区分否定与情态改写','把I don’t feel ill. / I can get up.改为Jimmy作主语。',choice(['Jimmy doesn’t feel ill. / Jimmy can get up.','Jimmy don’t feel ill. / Jimmy can gets up.','Jimmy doesn’t feels ill. / Jimmy cans get up.'],'Jimmy doesn’t feel ill. / Jimmy can get up.'),'doesn’t后用feel；can和get不因Jimmy而加s。'),
q('e-new-rule','独立迁移给定规则','新规则牌：Keep this room clean. Don’t make a noise.\n选一份准确转述。',choice(['You must keep this room clean. You mustn’t make a noise.','You mustn’t keep this room clean. You must make a noise.','You must keep this room cold. You mustn’t read.'],'You must keep this room clean. You mustn’t make a noise.'),'不漏掉否定，也不增加材料里没有的规则。'),
q('e-words','独立配对剩余关键词','把三个词与意思配好。',match([['certainly','当然'],['remain','保持；继续'],['yet','还；仍']]),'三个词在课文中作用不同。'),
q('e-father','独立解释故事结尾','Mr. Williams为什么也在床上？',choice(['He has a bad cold, too.','He is reading in the library.','He must drive quickly.'],'He has a bad cold, too.'),'妈妈最后说他也得了重感冒。'),
q('e-numbers','独立读懂新的三位基数词','给编号配好英文。',match([['554','five hundred and fifty-four'],['776','seven hundred and seventy-six'],['998','nine hundred and ninety-eight']]),'hundred前已有具体数字时不加s。')
];
unit.learning.MODELS=[['110','take any aspirins','不要服阿司匹林','medicine'],['221','take this medicine','不要服这药','medicine'],['332','call the doctor','不要请医生','doctor'],['443','play with matches','不要玩火柴','match'],['554','talk in the library','不要在图书馆谈话','library'],['665','make a noise','不要弄出喧闹声','noise'],['776','drive so quickly','不要开得这么快','drive'],['887','lean out of the window','不要把身体探出窗外','lean-out-of'],['998','break that vase','不要打破那个花瓶','break']].map(([number,action,cn,art])=>({number,en:'Don’t '+action+'!',result:'You mustn’t '+action+'!',cn,image:art==='doctor'?'/assets/unit63-64/doctor.webp':image(art)}));
unit.learning.REFERENCE=[
 'Don’t＋动词原形表示不要做：Don’t talk here. You mustn’t＋动词原形表示不允许：You mustn’t talk here. 两句都能表示禁令；mustn’t通常更强调禁止，不能把其中一句当成错误英语。',
 'mustn’t不是“不必”。must是必须；mustn’t是不准。不要把“Must…?”的“不必”回答写成mustn’t。',
 '形容词前保留be：Don’t be late. / You mustn’t be late. 主语改成Jimmy，must／mustn’t／can后的动词仍用原形。',
 'for表示一段时间或距离：for two hours（两小时）、for three days（三天）、for a mile（一英里）。How long…?可问持续多久。',
 'another two days是再两天；about two hours是大约两小时；each day是每天。keep the room warm是保持房间温暖。better只说明比之前好些。',
 'I改为Jimmy：am→is，have→has，read→reads，listen→listens；don’t feel→doesn’t feel。情态动词不变：can get、must stay、mustn’t get。',
 '本课编号读法：110 one hundred and ten；221 two hundred and twenty-one；332 three hundred and thirty-two；443 four hundred and forty-three；554 five hundred and fifty-four；665 six hundred and sixty-five；776 seven hundred and seventy-six；887 eight hundred and eighty-seven；998 nine hundred and ninety-eight。都是基数词。'
];
unit.learning.SAFETY='以下保留课本的句型转换例句，不是实际用药或求医指示。生病要告诉家长，并听从医生指导。';
unit.learning.WRITING_A=['I am better now but I mustn’t get up yet.','I have a cold and I must stay in bed.','I can get up for two hours each day.','I often read in bed.','I listen to the stereo, too.','I don’t feel ill now.'];
unit.learning.WRITING_B=unit.learning.MODELS.map(x=>x.en.slice(6,-1));
core.unit6364=unit;if(root.document?.documentElement?.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit6364,excerpts={"u6364-v1-r-better":[0,1],"u6364-v1-r-upstairs":[2,3],"u6364-v1-r-temperature":[6,7],"u6364-v1-r-condition":[8,9],"u6364-v1-r-rich":[4,5],"u6364-v1-r-father":[10,11],"u6364-v1-e-condition":[8,9]},speakers={"doctor":"Doctor","mother":"Mrs. Williams"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 63',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
