(function(root){
'use strict';
const base='/assets/unit37-38/',image=n=>base+n+'.svg',source='《新概念英语智慧版1》纸页74–77（PDF107–110）';
const words=[
 ['work','本课：工作','/wɜːk/','work hard'],['hard','本课：努力地','/hɑːd/','working hard'],['make','制作；做','/meɪk/','make a bookcase'],['bookcase','书架；书橱','/ˈbʊkkeɪs/'],['hammer','锤子','/ˈhæmə/'],['paint','上漆；涂','/peɪnt/','paint it pink'],['pink','粉色；粉色的','/pɪŋk/'],['favourite','最喜欢的','/ˈfeɪvərɪt/','her favourite colour'],['homework','家庭作业','/ˈhəʊmwɜːk/','do our homework'],['listen','听','/ˈlɪsən/','listen to the stereo'],['dish','盘子；碟子','/dɪʃ/','wash the dishes']
].map(([en,cn,ph,example])=>({en,cn,ph,example,image:image(en),source,phoneticSource:'教材词表与Cambridge英式读词音标'}));
const lines=[
 ['dan',"You're working hard, George.",'你干得真辛苦，乔治。'],['dan','What are you doing?','你正在干什么？'],['george',"I'm making a bookcase.",'我正在做书架。'],['george','Give me that hammer please, Dan.','请把那把锤子给我，丹。'],['dan','Which hammer?','哪一把锤子？'],['dan','This one?','这一把吗？'],['george','No, not that one.','不，不是那一把。'],['george','The big one.','那把大的。'],['dan','Here you are.','给你。'],['george','Thanks, Dan.','谢谢你，丹。'],['dan','What are you going to do now, George?','你接下来打算干什么，乔治？'],['george',"I'm going to paint it.",'我打算给它上漆。'],['dan','What colour are you going to paint it?','你打算把它涂成什么颜色？'],['george',"I'm going to paint it pink.",'我打算把它涂成粉色。'],['dan','Pink!','粉色！'],['george',"This bookcase isn't for me.",'这个书架不是给我做的。'],['george',"It's for my daughter, Susan.",'它是给我女儿苏珊做的。'],['george',"Pink's her favourite colour.",'粉色是她最喜欢的颜色。']
];
const q=(id,target,prompt,extra,why)=>({id:'u3738-v1-'+id,target,prompt,source,decision:target,hint:'',explanation:'',...extra,distractorRationale:why});
const choice=(id,target,prompt,options,answer,why,extra={})=>q(id,target,prompt,{options,answer,...extra},why);
const match=(id,target,prompt,pairs,why)=>q(id,target,prompt,{type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i)))},why);
const cloze=(id,target,prompt,blanks,answers,why,extra={})=>q(id,target,prompt,{type:'cloze',blanks:blanks.map(([before,after,options])=>({before,after,options})),answer:JSON.stringify(answers),...extra},why);
const order=(id,target,prompt,tokens,why)=>q(id,target,prompt,{type:'order',tokens,answer:tokens.join(' ')},why);
const locate=(id,target,prompt,fragments,answer,why)=>q(id,target,prompt,{type:'locate',fragments,options:fragments.filter(v=>typeof v==='object').map(v=>v.value),answer},why);
const questions={
 listen:[
  match('objects','辨认工具、家具与餐具','把英文和意思配起来。',[['bookcase','书架'],['hammer','锤子'],['dish','盘子']],'三种新词的首次识别，不能只看外形配同一张图。'),
  match('words','区分制作、涂色与作业','再认三个新词。',[['make','制作'],['paint','涂色'],['homework','家庭作业']],'不同词义，后续再在动作与计划里应用。'),
  choice('hard','理解working hard中的副词','You’re working hard, George.\nhard 在这里是什么意思？',['努力地','坚硬的','粉色的'],'努力地','限定working语境，不把努力解释成材料坚硬。'),
  choice('favourite','理解个人最喜欢的颜色','Pink’s her favourite colour.\nfavourite 表示什么？',['最喜欢的','正在涂的','所有人的'],'最喜欢的','不是目前动作，也不把个人偏好扩大为人人如此。')
 ],
 roles:[
  choice('making','分清George当前在做什么','Dan: What are you doing?\nGeorge: I’m making a bookcase.\nGeorge 正在做什么？',['制作书架','给书架涂色','洗盘子'],'制作书架','依据当前回答，不用后文计划代替当前动作。'),
  q('hammer-handoff','读懂原文工具与接收者','帮 Dan 选好工具和接收者。',{type:'handoff',speaker:{name:'George',image:image('george')},request:'Give me that hammer please, Dan.\nNo, not that one. The big one.',objects:[{id:'small',name:'小锤子',image:image('hammer-small')},{id:'big',name:'大锤子',image:image('hammer-big')}],recipients:[{id:'dan',name:'Dan',images:[image('dan-receive')]},{id:'george',name:'George',images:[image('george-receive')]}],answer:JSON.stringify(['big','george']),hint:'先找是谁说了 me，再看他说要哪一把。'},'工具大小和me的说话者必须同时匹配；仅选或答错不交接。'),
  choice('for-susan','根据跨句关系判断书架给谁','George: This bookcase isn’t for me.\nIt’s for my daughter, Susan.\n书架是给谁做的？',['Susan','George','Dan'],'Susan','明确女儿姓名；否定forme不能凭空推出Dan。'),
  locate('it','定位paint it中的it所指物','点出 it 指的东西。',['I’m making ',{value:'a bookcase'},'.\nGive me ',{value:'that hammer'},' please, Dan.\nI’m going to paint it.'],'a bookcase','最近出现的hammer是干扰，须理解制作和涂色的对象。')
 ],
 observe:[
  choice('paint-plan','按完整表达区分计划和正在涂','I’m going to paint this bookcase.\n哪幅画表现了这句话的打算？',['画面一','画面二'],'画面二','同一人、同一家具；一幅刷子接触并有局部涂色，一幅工具准备好但未开刷。',{optionImages:{'画面一':image('paint-now'),'画面二':image('paint-plan')},optionImageAlts:{'画面一':'刷子接触书架，局部出现漆色','画面二':'书架保持木色，刷子与漆罐在旁边准备'}}),
  choice('homework-now','识别正在做作业的表达','Now we’re doing our homework.\n这句话告诉了我们什么？',['现在正在做作业','打算接下来做作业','作业已经全做完'],'现在正在做作业','doing不等于going to do或已完成；不以完成截图误导。'),
  choice('now-plan','now不覆盖going to结构意义','What are you going to do now, George?\nDan 想知道什么？',['George 接下来打算做什么','George 已经做完了什么','George 的名字是什么'],'George 接下来打算做什么','课文真实反例：有now仍询问打算，不让孩子机械匹配词。')
 ],
 be:[
  cloze('be-person','选择I和he所需的be','分别补全两句话。',[['I ',' going to shave.',['am','is','are']],['He ',' working hard.',['is','are','am']]],['am','is'],'两个主语的必要对比，不能只把现成am/is词块当掌握。'),
  cloze('forms','计划后的原形与正在的ing','同一个动作，两种表达。',[['We’re going to ',' the dishes.',['wash','washing','washes']],['Now we’re ',' the dishes.',['washing','wash','washes']]],['wash','washing'],'两个时态结构的真实形式对比，不把going to后再用ing。'),
  cloze('listen-to','保留listen to搭配','补全准备听音响的计划。',[["We’re going to listen ",' the stereo.',['to','at','on']]],['to'],'listen to有介词，不是只认listen图标。'),
  cloze('our','we与our homework一致','一组孩子说自己的计划，选一个合适的词。',[["We’re going to do ",' homework.',['our','my','his']]],['our'],'说话者为复数自己，不把I和we并为同一人称数。')
 ],
 trans:[
  order('plan-question','组织询问打算的问句','你打算做什么？',['What','are','you','going','to','do?'],'组织已学问句，不引入free typing。'),
  order('now-answer','组织正在进行的回答','我现在正在等公共汽车。',['Now','I’m','waiting','for','a','bus.'],'与计划问句不同目标，for保留，不让同一句立即换型重做。')
 ],
 exam:[
  choice('final-bookcase','词汇抽样辨认bookcase','选出图中家具的英文。',['bookcase','hammer','dish'],'bookcase','首次配对后延迟的图片识词，不整组反向翻译。',{image:image('bookcase'),imageAlt:'有多层搁板、用来放书的家具'}),
  choice('final-hammer','理解one回指哪类东西','Dan: Which hammer? This one?\nGeorge: No, not that one. The big one.\nGeorge 要哪一件？',['工具一','工具二'],'工具二','同种工具必要大小对比，不能靠differentcategory猜测。',{optionImages:{'工具一':image('hammer-small'),'工具二':image('hammer-big')},optionImageAlts:{'工具一':'较小的一把锤子','工具二':'较大的一把锤子'}}),
  choice('final-recipient','接收者不能仅由否定推断','George: This bookcase isn’t for me. It’s for my daughter, Susan.\n哪条记录符合原文？',['书架是给 Susan 做的。','书架是给 Dan 做的。','书架是给 George 自己做的。'],'书架是给 Susan 做的。','间隔抽样原文归属；不将notforme自动等同Dan。'),
  choice('final-colour','her回指Susan及个人喜好','George: It’s for my daughter, Susan. Pink’s her favourite colour.\n谁最喜欢粉色？',['Susan','George','Dan'],'Susan','结合两句找her，不能从创作者或性别推断偏好。'),
  choice('final-plan-fact','不把计划当作已涂完','George: I’m going to paint it pink.\n仅凭这句，能确定哪件事？',['George 打算把书架涂成粉色。','书架已经全部涂成粉色。','George 正在洗盘子。'],'George 打算把书架涂成粉色。','真正检验未完成边界，不把动画当教材结果。'),
  cloze('final-hard','语境词义hard','为 George 的工作补上“努力地”。',[["You’re working ",', George.',['hard','pink','favourite']]],['hard'],'语境抽样而非再做整组翻译，hard修饰动作。'),
  choice('final-colour-question','理解询问计划涂成什么颜色','Dan: What colour are you going to paint it?\n哪句直接回答了这个问题？',["I’m going to paint it pink.","I’m making a bookcase.","It’s for my daughter, Susan."],"I’m going to paint it pink.",'三个真实课文回答分别表达颜色计划、当前制作和归属；必须读懂问题目的。'),
  choice('final-plan-question','完整结构比now关键词重要','What are you going to do now?\n该用哪句话直接回答这个问题？',['I’m going to shave.','Now I’m shaving.','It’s pink.'],'I’m going to shave.','打算问句有now，仍用打算回答；过去式等未教内容不入选项。'),
  cloze('final-be','I和they的be形式','分别补全不同人的回答。',[["I ",' washing the dishes.',['am','is','are']],['They ',' doing their homework.',['are','is','am']]],['am','are'],'WrittenA中I和they必要对比。'),
  cloze('final-question-be','you和he问句的be形式','分别补全问句。',[['What ',' you doing?',['are','is','am']],['What ',' he doing?',['is','are','am']]],['are','is'],'WrittenA中you/he确切主语，不以词块暗示。'),
  cloze('final-verb','计划原形与现在ing','同一个动作，补全两种表达。',[["I’m going to ",' this bookcase.',['paint','painting','paints']],["Now I’m ",' this bookcase.',['painting','paint','paints']]],['paint','painting'],'从前面的wash迁移到paint，必要结构对比。'),
  cloze('final-listen','listen to及复数our','补全这组人的计划。',[["We’re going to listen ",' the stereo.',['to','at','on']],["We’re going to do ",' homework.',['our','my','his']]],['to','our'],'两个本课短语间隔抽样，家庭作业无复数s。'),
  cloze('final-shave','去不发音e与直接加ing','补全正在进行的动作。',[["Now I am ",'. (shave)',['shaving','shaveing','shave']],["Now I’m ",' the dishes. (wash)',['washing','washhing','wash']]],['shaving','washing'],'新动作词复用删e边界，wash不双写末尾。'),
  choice('final-contraction','Pink’s是Pink is','Pink’s her favourite colour.\n这句中的 Pink’s 可以展开成什么？',['Pink is','Pink am','Pink are'],'Pink is','依据完整句还原is，不将’s总是解释为物主；干扰限于已教的be形式。'),
  order('final-plan-plural','组织复数的打算回答','我们打算做家庭作业。',['We’re','going','to','do','our','homework.'],'从前置单数现在回答到复数计划组织，有支架不称自由表达。'),
  order('final-now-question-order','组织询问当前动作','你现在正在做什么？',['What','are','you','doing','now?'],'最后组织问句，不能把doing拆成do+ing机械凑词。')
 ]
};
const pairs=[
 ['shave','I am going to shave.','Now I am shaving.','我打算刮脸。','我现在正在刮脸。'],
 ['bus',"I’m going to wait for a bus.","Now I’m waiting for a bus.",'我打算等公共汽车。','我现在正在等公共汽车。'],
 ['homework',"We’re going to do our homework.","Now we’re doing our homework.",'我们打算做家庭作业。','我们现在正在做家庭作业。'],
 ['paint',"I’m going to paint this bookcase.","Now I’m painting this bookcase.",'我打算给这个书架上漆。','我现在正在给这个书架上漆。'],
 ['stereo',"We’re going to listen to the stereo.","Now we’re listening to the stereo.",'我们打算听音响。','我们现在正在听音响。'],
 ['dishes',"I’m going to wash the dishes.","Now I’m washing the dishes.",'我打算洗盘子。','我现在正在洗盘子。']
];
const definition={id:'unit37-38',version:1,mode:'classroom',title:'书架制作小工坊',path:'/unit37-38/',start:'learn/words',progress:{learningKey:'canran:unit37-38:learning:v1'},objects:words,
 stages:[
 {id:'l1',title:'走进小工坊',activities:[['words','工坊小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
 {id:'l2',title:'跟上书架故事',activities:[['text','工坊小剧场','book'],['roles','工坊小侦探','question']],required:['text','roles']},
 {id:'l3',title:'打算与现在',activities:[['models','动作前后画册','cards'],['observe','时间小侦探','question']],required:['observe']},
 {id:'l4',title:'说说下一步',activities:[['phrases','表达小锦囊','book'],['be','表达修理站','question'],['trans','词块拼装台','order']],required:['be','trans']},
 {id:'l5',title:'收好工坊发现',activities:[['exam','小工坊综合挑战','star'],['certificate','我的工坊纪念','star']],required:['exam']}
 ],questions,learning:{WORDS:words,PEOPLE:{george:{name:'George',image:image('george')},dan:{name:'Dan',image:image('dan')}},
 DIALOGUE:lines.map(([person,text,cn],i)=>({who:person==='george'?'teacher':'student',person,text,cn,source,sourceId:'L37-'+(i+1)})),
 PHRASES:[['What are you going to do?','问接下来打算做什么。','plan-icon'],['What are you doing now?','问此刻正在做什么。','now-icon'],["I’m going to paint it.",'am / is / are + going to + 动词原形','paint-plan'],["I’m painting it.",'am / is / are + 动词-ing','paint-now']].map(([en,cn,n])=>({en,cn,image:image(n)})),
 GALLERY:pairs.map(([art,plan,now,planCn,nowCn],i)=>({numberLabel:`${i*2+1}–${i*2+2}`,plan,now,planCn,nowCn,planImage:image(art+'-plan'),nowImage:image(art+'-now')})),
 WRITING_A:['What ___ you doing? We ___ reading.','What ___ they doing? They ___ doing their homework.','What ___ he doing? He ___ working hard.','What ___ you doing? I ___ washing the dishes.'],
 WRITING_B:['shave','wait for a bus','do my homework','listen to the stereo','wash the dishes']
 }};
definition.learning.FEEDBACK=root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK;
root.CanranCore.unit3738=definition;
if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);

// The actual v1 predecessor above remains unchanged for history and certificates.
(function(core){
'use strict';const old=core.unit3738;core.unit3738LegacyDefinition=JSON.parse(JSON.stringify(old));
const source='课本纸74–77／PDF107–110；语法练习册纸100–105／PDF114–119';const grammarSource='同步导学纸67–69／PDF81–83，Grammar纸68／PDF82；'+source;
const unit={id:'unit37-38',version:1,mode:'classroom',contentRevision:'workshop-five-zones-v1',legacyEdition:'unit37-38-completion-v1',title:'书架制作小工坊',path:'/unit37-38/',start:'learn/words',progress:old.progress,learning:old.learning,objects:old.objects,questions:{},
stages:[{id:'l1',title:'走进小工坊',activities:[['words','工坊小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},{id:'l2',title:'跟上书架故事',activities:[['text','工坊小剧场','book'],['roles','工坊小侦探','question']],required:['text','roles']},{id:'l3',title:'读懂打算与用法',activities:[['grammar','语法小工坊','speech']],required:['grammar']},{id:'l4',title:'说说下一步',activities:[['apply','表达练习站','heart']],required:['apply']},{id:'l5',title:'收好工坊发现',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}],
routeAliases:{'learn/phrases':'learn/grammar','learn/observe':'learn/grammar','learn/be':'learn/apply','learn/models':'learn/apply','learn/trans':'learn/apply'},
reward:{edition:'workshop-five-zones-v1',title:'细心工坊发现者',lesson:'Lesson 37–38',scene:'/assets/unit37-38/keepsake-story-v1.webp',alt:'George接到大锤，Dan在旁边，木色书架旁备有粉色油漆',color:'#577B72',zones:[['listen','单词寻宝'],['roles','工坊小侦探'],['grammar','语法小工坊'],['apply','表达练习站'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
const choice=(options,answer,material='')=>({options,answer,material});const blank=(before,after,options)=>({before,after,options});const fill=(blanks,answers,material='')=>({type:'cloze',blanks,answer:JSON.stringify(answers),material});
const q=(id,target,prompt,input,explanation)=>{const{material,...fields}=input;return{id:'u3738-five-'+id,target,prompt,source,...fields,...(material?{display:{title:prompt,material}}:{}),explanation,hint:''};};
const g=(id,target,prompt,input,rule,lines)=>({...q('g-'+id,target,prompt,input,rule),source:grammarSource,workshop:{rule,model:{lines}}});
unit.questions.listen=old.questions.listen;unit.questions.roles=old.questions.roles;
unit.questions.grammar=[
g('plan-form','be going to加原形表达打算','另一个孩子打算明天做一个书架，还没动手。替他说完整。',fill([blank('I ',' going to',['am','is','are']),blank(' ',' a bookcase.',['make','making','makes'])],['am','make']),'I搭配am，going to后用动词原形make；这里表达打算，不表示已经在做。',[['I am going to put it on the floor.','导学原例：我打算把它放在地板上。am going to后接put。']]),
g('arrangement','计划安排也可用于事件','现在八点半，会议按计划九点开始，还未开始。这句话在说什么？',choice(['会议预计按计划在九点开始。','会议现在已经开始。','会议已经结束。'],'会议预计按计划在九点开始。','The meeting is going to begin at nine.\nmeeting：会议；begin：开始'),'be going to可谈按计划将发生的事，不要求主语一定是有意愿的人。',[['We are going to have a lesson at ten.','我们打算十点上课。说话时还没到十点，课也还没开始。']]),
g('prediction','凭眼前迹象作预测','乌云越积越厚，地面仍是干的，还没下雨。说话人根据这些迹象说这句话，意思是？',choice(['看这些迹象，可能很快要下雨。','雨已经下完了。','现在正在下雨。'],'看这些迹象，可能很快要下雨。','It’s going to rain!\nrain：下雨'),'这里是根据现在的迹象预测，不是天气自己的打算，也不是已经发生的事实。',[['The cup is going to fall.','杯子正倾斜在桌边，还没有落下；说话人据此判断它快掉下来了。fall：落下。']]),
g('negative','not放在be后否定打算','另设情境：Dan今天不打算刮脸。补全他的计划。',fill([blank('Dan is ',' going to shave today.',['not','no','is'])],['not']),'否定be going to结构时，在be后加not；不是所有否定句都套同一规则。',[['I am not going to swim.','我不打算游泳。not放在am后面。']]),
g('question','一般问句的be前置和肯定回应','另设情境：Dan已经决定给一张桌子上漆。向别人核实他的计划，并按事实回答。',fill([blank('',' Dan going to paint a table?',['Is','Are','Am']),blank('Yes, ','.',['he is','he isn’t','I am'])],['Is','he is']),'单数Dan用Is放句首提问；回答谈Dan，用he。肯定回应由题目给定的计划决定。',[['Is George going to paint it pink?','导学原例：乔治打算把它刷成粉色吗？将is提到主语George前。']]),
g('for-person','for指出动作的受益对象','这句话中的书架是给谁做的？',choice(['说话人的弟弟。','说话人的爸爸。','说话人自己。'],'说话人的弟弟。','My father is making a bookcase for my brother.\nbrother：这里指弟弟'),'for my brother说明这件事是为弟弟做的；制作人和受益人不同。',[['My mother is cooking supper for me.','导学原例：妈妈正在为我做晚饭。for me说明为谁做。']]),
g('for-meal','for说明用作哪一餐的食物','这句话介绍哪种用餐情况？',choice(['早餐吃鸡蛋。','午餐吃鸡蛋。','早餐后去买鸡蛋。'],'早餐吃鸡蛋。','I have eggs for breakfast.\nbreakfast：早餐'),'for breakfast表示作为早餐食用，不是在给“早餐”这个人做东西。',[['I like some bread and milk for breakfast.','导学原例：我喜欢把面包和牛奶作为早餐。bread：面包；milk：牛奶。']]),
g('for-reason','for说明感谢的原因','这句话为什么感谢对方？',choice(['对方寄来了一封信。','对方要来吃晚饭。','说话人要把信送给对方。'],'对方寄来了一封信。','Thank you for your letter.\nletter：信'),'for your letter说明感谢的原因；your letter指对方的来信。',[['Thank you for helping me with my English.','导学原例：谢谢你帮我学英语。for后说明感谢的事情。']]),
g('for-purpose','for说明目的','孩子回到教室，指着自己的书包说这句话。他来这里是为了什么？',choice(['来取自己的书包。','来制作书包。','来洗书包。'],'来取自己的书包。','I’m here for my schoolbag.\nschoolbag：书包'),'for my schoolbag在这个情境中说明来取书包的目的，不是支持一个书包。',[['Let’s go for a walk.','导学原例：我们去散步吧。for a walk说明活动目的。']]),
g('for-support','for可表示支持赞成','这句话是在表达什么？',choice(['我支持你的计划。','我正在替你制定计划。','我打算取消你的计划。'],'我支持你的计划。','I am for your plan.\nplan：计划'),'be for a plan表示赞成这个计划，不等于自己打算做什么。',[['No one was for my plan during the meeting.','导学原例：会议上没有人支持我的计划。这里for表示赞成；was是例句中的过去形式，本题不考时态变化。']]),
g('fixed','for在固定表达中的用法','想说“例如，我们可以画一个书架”，补全表达。',fill([blank('For ', ', we can draw a bookcase.',['example','homework','colour'])],['example']),'For example是“例如”，用来引出例子；wait for表示等待，两者按完整搭配理解。',[['Who are you waiting for?','导学原例：你在等谁？wait for表示等候。'],['For example, you can draw a picture of a monkey.','导学原例：例如，你可以画一只猴子。monkey：猴子。']]),
...old.questions.observe];
unit.questions.apply=[...old.questions.be,...old.questions.trans,
q('a-for','撤去示范后区分for的对象、用餐和原因','给三句话配上对应的意思。',{type:'match',pairs:[{id:'0',en:'This cake is for Lily.',cn:'这个蛋糕是给莉莉的。'},{id:'1',en:'I have fish for lunch.',cn:'我午餐吃鱼。'},{id:'2',en:'Thank you for your help.',cn:'谢谢你的帮助。'}],answer:JSON.stringify(['0','1','2'])},'for在三句中分别连接受益对象、哪一餐、感谢原因。'),
q('a-support','依据事实回应对计划的支持','Tom支持Dan的计划。Dan问下面的问题，Tom该怎样直接回答？',choice(['Yes, I am.','No, I’m not.','I’m making a bookcase.'],'Yes, I am.','Dan: Are you for my plan?\nTom: ___'),'问的是Tom是否支持计划；Tom用I回应，按题目支持这一事实回答Yes。')];
unit.questions.exam=[...old.questions.exam,
q('e-schedule','独立理解按安排发生的事件','现在七点半，英语课按安排八点开始，还未开始。下面这句话说明什么？',choice(['英语课按安排将在八点开始。','英语课现在已经开始。','英语课已经结束。'],'英语课按安排将在八点开始。','The English lesson is going to begin at eight.\nbegin：开始'),'根据给定的安排和当前时间理解未来事件，不是主语想做某事。'),
q('e-predict','独立根据现有迹象理解预测','盘子已经向架子边缘倾斜，尚未掉下。说话人看见它并这样说，意思是？',choice(['看样子盘子快要掉下来了。','盘子已经掉到地上了。','说话人打算把盘子放回架子。'],'看样子盘子快要掉下来了。','The dish is going to fall.\nfall：掉下'),'这是基于眼前迹象的预测，不是盘子的意愿，也不表示已经掉下。'),
q('e-negative','独立组织否定打算','另一个情境：我不打算给这张桌子上漆。按这个意思组织句子。',{type:'order',tokens:['I','am','not','going','to','paint','this','table.'],answer:'I am not going to paint this table.'},'not在am后，going to后仍用原形paint；题目指定的是另一计划。'),
q('e-question','独立核实计划并按事实否定回答','Lily今天不打算做蛋糕。选出正确的问答。',choice(['Is Lily going to make a cake? — No, she isn’t.','Is Lily going to make a cake? — Yes, she is.','Are Lily going to make a cake? — No, she isn’t.'],'Is Lily going to make a cake? — No, she isn’t.'),'单数Lily的问句用Is；没有这个打算，按事实回答No, she isn’t.。'),
q('e-for-person','独立运用for表示受益对象','爸爸正在为女儿制作书架，补全句子。',fill([blank('The father is making a bookcase ',' his daughter.',['for','under','across'])],['for']),'for his daughter说明书架是为女儿制作的，不是说位置。'),
q('e-for-meal','独立运用for表示用餐','说“我早餐喝牛奶”，补全表达。',fill([blank('I have milk ',' breakfast.',['for','under','from'])],['for']),'for breakfast表示把牛奶作为早餐饮用，不是来自早餐。'),
q('e-for-reason','独立读懂感谢原因','这句为什么感谢对方？',choice(['对方帮助了说话人。','说话人打算让对方吃早餐。','对方支持了一个没有提到的计划。'],'对方帮助了说话人。','Thank you for helping me.\nhelping me：帮助我'),'for helping me给出感谢的原因，不能补写材料没有的计划。'),
q('e-for-mixed','独立区分目的、支持和固定搭配','读完整表达，配上正确的意思。',{type:'match',pairs:[{id:'0',en:'They are going for a walk.',cn:'他们要去散步。'},{id:'1',en:'We are for this plan.',cn:'我们支持这个计划。'},{id:'2',en:'For example, we can draw a cup.',cn:'例如，我们可以画一个杯子。'},{id:'3',en:'Who are they waiting for?',cn:'他们在等谁？'}],answer:JSON.stringify(['0','1','2','3'])},'for的含义随完整表达变化，不能一律译成给某个人。')];
unit.taskSessions=Object.fromEntries(unit.reward.zones.map(z=>[z.id,'five-zones-v1']));const previous={listen:['listen'],roles:['roles'],grammar:['observe'],apply:['be','trans'],exam:['exam']};
unit.taskPredecessors=Object.fromEntries(Object.entries(previous).map(([id,ids])=>[id,ids.map(prior=>({key:'unit3738-'+prior+'-practice/v1',questions:old.questions[prior]}))]));
core.unit3738=unit;if(globalThis.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis.CanranCore);
