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
