(function(root){
'use strict';
const base='/assets/unit39-40/',image=n=>base+n+'.svg',source='《新概念英语智慧版1》纸页78–81（PDF111–114）';
const words=[
 ['front','前面','/frʌnt/','in front of the window'],['in front of','在……前面','/ɪn ˈfrʌnt əv/','in front of the window'],['careful','小心的；仔细的','/ˈkeəfəl/','Be careful!'],['vase','花瓶','/vɑːz/'],['drop','使掉下；掉下','/drɒp/','Don’t drop it!'],['flower','花','/ˈflaʊə/','Those flowers are lovely.'],['show','给……看','/ʃəʊ/','show it to me'],['send','送给；寄送','/send/','send a letter'],['take','带给；拿走','/teɪk/','take those flowers to her']
].map(([en,cn,ph,example])=>({en,cn,ph,example,image:image(en.replaceAll(' ','-')),source,phoneticSource:'教材英式音标；in front of 为组成词的英式读词音标'}));
const lines=[
 ['sam','What are you going to do with that vase, Penny?','你打算怎么处理那只花瓶，彭妮？'],['penny','I’m going to put it on this table, Sam.','我打算把它放在这张桌子上，萨姆。'],['sam','Don’t do that.','别那么做。'],['sam','Give it to me.','把它给我。'],['penny','What are you going to do with it?','你打算怎么处理它？'],['sam','I’m going to put it here, in front of the window.','我打算把它放在这里，窗户前面。'],['penny','Be careful!','小心！'],['penny','Don’t drop it!','别摔了！'],['penny','Don’t put it there, Sam.','别放在那里，萨姆。'],['penny','Put it here, on this shelf.','把它放在这里，这个架子上。'],['sam','There we are!','放好了！'],['sam','It’s a lovely vase.','这是只漂亮的花瓶。'],['penny','Those flowers are lovely, too.','那些花也很漂亮。']
];
const q=(id,target,prompt,extra,why)=>({id:'u3940-v1-'+id,target,prompt,source,decision:target,hint:'',explanation:'',...extra,distractorRationale:why});
const choice=(id,target,prompt,options,answer,why,extra={})=>q(id,target,prompt,{options,answer,...extra},why);
const match=(id,target,prompt,pairs,why)=>q(id,target,prompt,{type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i)))},why);
const cloze=(id,target,prompt,blanks,answers,why)=>q(id,target,prompt,{type:'cloze',blanks:blanks.map(([before,after,options])=>({before,after,options})),answer:JSON.stringify(answers)},why);
const order=(id,target,prompt,tokens,why)=>q(id,target,prompt,{type:'order',tokens,answer:tokens.join(' ')},why);
const locate=(id,target,prompt,fragments,answer,why)=>q(id,target,prompt,{type:'locate',fragments,options:fragments.filter(v=>typeof v==='object').map(v=>v.value),answer},why);
const questions={
 listen:[
  match('objects','认识花瓶、花与front','把英文和意思配起来。',[['vase','花瓶'],['flower','花'],['front','前面']],'首次覆盖三种新词，不重复反向配对。'),
  match('actions','分清展示、寄送与带给','再认三个动作。',[['show','给……看'],['send','寄送'],['take','带给']],'同课三个不同动作；实际语境后续再用，不把这些词都教成give。'),
  choice('careful','理解提醒Be careful','Be careful!\n这是在提醒对方什么？',['小心一点','快一点','坐下吧'],'小心一点','本课careful是防止意外的提醒，不表示动作快慢。'),
  choice('drop','否定句中drop的词义','Don’t drop it!\ndrop 表示什么？',['掉下','拿稳','摆好'],'掉下','区分动词意思和整句禁止的行为，不能把drop教成拿稳。')
 ],
 roles:[
  choice('penny-plan','区分Penny最初的计划','Penny: I’m going to put it on this table, Sam.\nPenny 最初打算把花瓶放在哪儿？',['桌子上','窗户前面','架子上'],'桌子上','最初计划不等于Sam的新建议或最终位置。'),
  q('vase-handoff','it所指物和me的说话者','选好要递的东西和接收者。',{type:'handoff',speaker:{name:'Sam',image:image('sam')},request:'Sam: What are you going to do with that vase, Penny?\nSam: Give it to me.',objects:[{id:'vase',name:'花瓶',image:image('vase-flowers')},{id:'flowers',name:'花束',image:image('flowers')}],recipients:[{id:'penny',name:'Penny',images:[image('penny-receive')]},{id:'sam',name:'Sam',images:[image('sam-receive')]}],answer:JSON.stringify(['vase','sam']),hint:'先找 it 指什么，再看是谁说 me。'},'物品与说话者两条件；未检查和错答均不交接。'),
  locate('window-plan','定位窗前这一位置短语','点出表示“在窗户前面”的完整词组。',['I’m going to put ',{value:'it'},{value:' here'},', ',{value:'in front of the window'},'.'],'in front of the window','it是物品、here是此处，只有完整介词词组明确窗前。'),
  choice('flowers-too','理解too连接花瓶与花的评价','Sam: It’s a lovely vase.\nPenny: Those flowers are lovely, too.\n除了花瓶，Penny 还说什么很漂亮？',['花','窗户','架子'],'花','too补充另一对象，不让孩子只凭装饰图作答。')
 ],
 observe:[
  choice('warning','提醒不代表事件已经发生','Penny: Be careful! Don’t drop it!\n能从这两句话确定什么？',['Penny 在提醒 Sam 小心。','花瓶已经摔碎了。','Sam 已经把花瓶放到架子上。'],'Penny 在提醒 Sam 小心。','禁止或提醒不等于已经出事故；图不画破碎结果。'),
  choice('not-there','否定位置与肯定位置要合读','Don’t put it there. Put it here, on this shelf.\n按这两句话，应该怎么做？',['换到架子上','仍放在原来那里','把花瓶扔掉'],'换到架子上','要读完整否定与肯定要求，不能从单独否定推断任意地点。'),
  choice('show-meaning','展示不等于交出物品','Show me that picture.\n哪种做法符合这句话？',['把那张画给我看','把那张画寄走','把那张画放进箱子'],'把那张画给我看','以英文动作决定行为；show不是send，也未要求改变归属。')
 ],
 be:[
  cloze('it-them','根据物品单复数选it或them','用代词替换物品。',[['Put on your hat. → I’m going to put ',' on.',['it','them']],['Take off your shoes. → I’m going to take ',' off.',['them','it']]],['it','them'],'hat单数、shoes复数，明确完整先行词。'),
  cloze('to','在物品之后说接收者','换一种说法，意思保持不变。',[['Send George that letter. → Send that letter ',' George.',['to','for','on']]],['to'],'教send物品to人；for不是本题教材等值改写。'),
  cloze('negative','Don’t后的动词原形','提醒别人别这样做。',[["Don’t ",' that.',['do','does','doing']]],['do'],'本课否定祈使句，不能套用三单或ing。'),
  cloze('with','询问怎样处理物品','你打算怎么处理那只花瓶？',[['What are you going to do ',' that vase?',['with','to','on']]],['with'],'do with问处理物品，区别把东西给某人的to。')
 ],
 trans:[
  order('give-it','代词物品在前、to加接收者','把它给我。',['Give','it','to','me.'],'有支架组织give it to me，不教授give me it作为本课模式。'),
  order('turn-them','代词放在turn和off中间','这些灯要关掉：我打算把它们关掉。',['I’m','going','to','turn','them','off.'],'them对应lights，词块组织实际位置，不拆成单个词形机械凑题。')
 ],
 exam:[
  choice('final-vase','重点名词辨认','选出图中物品的英文。',['vase','flower','shelf'],'vase','词义配对后的图片抽样，不重做全词表。',{image:image('vase'),imageAlt:'一只完整的陶瓷容器，有细颈和开口'}),
  q('final-place','根据课文最后的要求确定落点','按 Penny 最后的要求，选出花瓶的落点。',{type:'scene-find',reference:'Don’t put it there, Sam. Put it here, on this shelf.',sceneImage:image('placement-room'),mobileScene:image('placement-room-mobile'),sceneDescription:'房间里的桌子、窗前空位和壁架；都还没有摆上花瓶。',spots:[{id:'table',name:'桌子上',bounds:[4,47,25,45],mobileBounds:[4,52,29,41]},{id:'window',name:'窗户前面',bounds:[36,34,25,58],mobileBounds:[37,43,25,50]},{id:'shelf',name:'架子上',bounds:[69,21,27,40],mobileBounds:[68,20,29,40]}],options:['table','window','shelf'],answer:'shelf'},'场景同等标记，无花瓶提前摆上正确位置；英文on this shelf才给出目标。'),
  choice('final-plan','将窗前计划与最终落点区分','Sam: I’m going to put it here, in front of the window.\n这句话本身说明什么？',['Sam 打算把它放在窗前。','Sam 已经把它放好了。','Penny 把花瓶打碎了。'],'Sam 打算把它放在窗前。','计划并不说明动作已完成，保留in front of的语境复习。'),
  choice('final-care','理解禁止摔落','Don’t drop it!\n这句话要求对方怎么做？',['别让它掉下去','把它扔到地上','已经放好了'],'别让它掉下去','整句禁止意义，不再孤立翻译drop。'),
  cloze('final-negative','否定祈使句动词形式','补全“别把它放在那里”。',[["Don’t ",' it there.',['put','puts','putting']]],['put'],'从do迁到put，必要形式抽样。'),
  cloze('final-with','完整询问打算处理什么','补全 Sam 的问题。',[['What are you going to do ',' that vase?',['with','for','on']]],['with'],'检查教材do with搭配，未把现成整块问句算作该能力。'),
  choice('final-recipient','换说话者后me跟随变化','新的委托——Penny 对 Sam 说：Give it to me.\n这次接收者是谁？',['Penny','Sam'],'Penny','明确新委托；与课文Sam说me不同，不能记住me永远是Sam。'),
  locate('final-person','定位双宾语中的完整接收者','点出要接收书的人。',['Give ',{value:'Mrs. Jones'},' ',{value:'these books'},'.'],'Mrs. Jones','按WrittenA原句找人，不把these books当接收者。'),
  cloze('final-rewrite','物品加to加人保持原意','保持意思不变。',[['Take her those flowers. → Take those flowers ',' her.',['to','with','on']]],['to'],'send规则迁到take；不将her替换成she。'),
  cloze('final-show-send','在真实目的里分清show与send','补全两个人的不同打算。',[['给朋友看一张画：I’m going to ',' it to my friend.',['show','send']],['给外公寄一封信：I’m going to ',' it to my grandfather.',['send','show']]],['show','send'],'明确看与寄的目的，不让give/show都成立；译意用于选择动作。'),
  choice('final-take','take的带给义','Take these flowers to my wife.\n这句话要对方做什么？',['把这些花带给我的妻子','把这些花给我看','把这些花拿回来给我'],'把这些花带给我的妻子','本课take带给的方向；不能凭人物外表猜妻子。'),
  cloze('final-number','it与them分别回指单复数','用代词替换物品。',[['Put on your suit. → I’m going to put ',' on.',['it','them']],['Turn on the taps. → I’m going to turn ',' on.',['them','it']]],['it','them'],'suit和taps是新的数对比，完整先行词与WrittenB一致。'),
  choice('final-position','纠正短语动词的代词位置','指一顶帽子时，哪句话的词序正确？',['Put it on.','Put on it.','Put them on.'],'Put it on.','it必须夹在put和on之间；第三项数不符合一顶。'),
  cloze('final-on-off','开和关、穿和脱的必要对比','按意思补全。',[['打开音响：Turn it ','.',['on','off']],['脱掉帽子：Take it ','.',['off','on']]],['on','off'],'on/off两侧都独立选择，不能只凭给定词块声称已识别方向。'),
  order('final-plan-sentence','组织处理复数物品的打算','我打算把它们给孩子们。',['I’m','going','to','give','them','to','the','children.'],'计划+物品代词+接收者的有支架整合，不等于自由写作。'),
  order('final-question','组织处理物品的计划问句','你打算怎么处理它？',['What','are','you','going','to','do','with','it?'],'在最后组织完整问句，区别前面陈述和祈使，不额外塞未教结构。')
 ]};
// Printed picture labels and complete prompts are retained; full sentences below are authored examples.
const gallery=[
 ['13','thirteen','put it …!','Put it on.','穿上它。','coat'],['14','fourteen','take it …!','Take it off.','脱下它。','hat'],['15','fifteen','turn it …!','Turn it off.','把它关掉。','television'],['16','sixteen','turn it …!','Turn it on.','把它打开。','stereo'],
 ['17','seventeen','to my daughter','I’m going to give this dress to my daughter.','我打算把这件连衣裙给我的女儿。','dress'],['18','eighteen','to my grandmother','I’m going to take these flowers to my grandmother.','我打算把这些花带给我的祖母。','flowers'],['19','nineteen','to my father','I’m going to show this newspaper to my father.','我打算把这份报纸给我的父亲看。','newspaper'],['20','twenty','to my mother','I’m going to show this picture to my mother.','我打算把这张画给我的母亲看。','picture'],['30','thirty','to the children','I’m going to give these ice creams to the children.','我打算把这些冰淇淋给孩子们。','ice-creams'],['40','forty','to my wife','I’m going to take these flowers to my wife.','我打算把这些花带给我的妻子。','flowers'],['50','fifty','to my grandfather','I’m going to send this letter to my grandfather.','我打算把这封信寄给我的祖父。','letter'],['60','sixty','to my sister','I’m going to show these photographs to my sister.','我打算把这些照片给我的姐妹看。','photographs']
].map(([number,numberWord,prompt,en,cn,art])=>({number,numberWord,prompt,en,cn,image:image('gallery-'+number),source}));
const definition={id:'unit39-40',version:1,mode:'classroom',title:'花瓶安放小帮手',path:'/unit39-40/',start:'learn/words',progress:{learningKey:'canran:unit39-40:learning:v1'},objects:words,
 stages:[
 {id:'l1',title:'认识花瓶与新词',activities:[['words','花瓶小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
 {id:'l2',title:'跟着花瓶走',activities:[['text','花瓶小剧场','book'],['roles','摆放小侦探','question']],required:['text','roles']},
 {id:'l3',title:'读懂动作与提醒',activities:[['models','动作与心意画册','cards'],['observe','读懂小叮嘱','question']],required:['observe']},
 {id:'l4',title:'把话说清楚',activities:[['phrases','表达小锦囊','book'],['be','代词接力站','question'],['trans','词块拼装台','order']],required:['be','trans']},
 {id:'l5',title:'完成安放任务',activities:[['exam','花瓶综合挑战','star'],['certificate','我的花瓶纪念','star']],required:['exam']}
 ],questions,learning:{WORDS:words,PEOPLE:{sam:{name:'Sam',image:image('sam')},penny:{name:'Penny',image:image('penny')}},DIALOGUE:lines.map(([person,text,cn],i)=>({who:person==='sam'?'teacher':'student',person,text,cn,source,sourceId:'L39-'+(i+1)})),
 PHRASES:[['What are you going to do with it?','问打算怎样处理它。','vase'],['Don’t drop it!','Don’t + 动词原形：提醒别人不要做。','careful'],['Give it to me.','先说物品，再用 to 说接收者。','give'],['Put it on. / Take them off.','it / them 放在动词和 on / off 中间。','put-take']].map(([en,cn,n])=>({en,cn,image:image(n)})),GALLERY:gallery,
 WRITING_A:['Send George that letter.','Take her those flowers.','Show me that picture.','Give Mrs. Jones these books.','Give the children these ice creams.'],
 WRITING_B:['Put on your hat!','Take off your shoes!','Turn on the taps!','Turn off the light!','Put on your suit!','Take off your hat!','Turn on the lights!','Turn off the television!','Turn off the lights!','Turn on the stereo!']
 }};
definition.learning.FEEDBACK=root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK;
root.CanranCore.unit3940=definition;if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);

// Frozen v1 data above remains the source for history and the original certificate.
(function(core){
'use strict';const old=core.unit3940;core.unit3940LegacyDefinition=JSON.parse(JSON.stringify(old));
const source='课本纸78–81／PDF111–114；语法练习册纸106–113／PDF120–127';const grammarSource='同步导学纸71–73／PDF85–87，Grammar纸72／PDF86；'+source;
const unit={id:'unit39-40',version:1,mode:'classroom',contentRevision:'vase-five-zones-v1',legacyEdition:'unit39-40-completion-v1',title:'花瓶安放小帮手',path:'/unit39-40/',start:'learn/words',progress:old.progress,learning:old.learning,objects:old.objects,questions:{},
stages:[{id:'l1',title:'认识花瓶与新词',activities:[['words','花瓶小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},{id:'l2',title:'跟着花瓶走',activities:[['text','花瓶小剧场','book'],['roles','摆放小侦探','question']],required:['text','roles']},{id:'l3',title:'读懂动作与提醒',activities:[['grammar','语法小工坊','speech']],required:['grammar']},{id:'l4',title:'把打算说清楚',activities:[['apply','表达练习站','heart']],required:['apply']},{id:'l5',title:'收好花瓶故事',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}],
routeAliases:{'learn/phrases':'learn/grammar','learn/observe':'learn/grammar','learn/be':'learn/apply','learn/models':'learn/apply','learn/trans':'learn/apply'},
reward:{edition:'vase-five-zones-v1',title:'细心花瓶小帮手',lesson:'Lesson 39–40',scene:'/assets/unit39-40/keepsake-story-v1.webp',alt:'Sam和Penny欣赏架上的花瓶与鲜花',color:'#8D6B56',zones:[['listen','单词寻宝'],['roles','摆放小侦探'],['grammar','语法小工坊'],['apply','表达练习站'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
const choice=(options,answer,material='')=>({options,answer,material});const blank=(before,after,options)=>({before,after,options});const fill=(blanks,answers,material='')=>({type:'cloze',blanks,answer:JSON.stringify(answers),material});
const q=(id,target,prompt,input,explanation)=>{const{material,...fields}=input;return{id:'u3940-five-'+id,target,prompt,source,...fields,...(material?{display:{title:prompt,material}}:{}),explanation,hint:''};};
const g=(id,target,prompt,input,rule,lines)=>({...q('g-'+id,target,prompt,input,rule),source:grammarSource,workshop:{rule,model:{lines}}});
unit.questions.listen=old.questions.listen;unit.questions.roles=old.questions.roles;
unit.questions.grammar=[
g('negative','否定祈使句用don’t加动词原形','妈妈提醒孩子不要关窗。补全她的话。',fill([blank('Don’t ',' the window.',['close','closes','closing'])],['close']),'Don’t后接动词原形close，表示不要关窗；这句话没有说窗户已经关上。',[['Don’t speak to your mother like that!','导学原例：不要那样对你妈妈说话！Don’t后用原形speak。']]),
g('be','形容词前使用be构成肯否祈使句','要安静，不要吵闹。补全两句提醒。',fill([blank('',' quiet.',['Be','Are','Is']),blank('Don’t ',' noisy.',['be','are','is'])],['Be','be'],'quiet：安静的；noisy：吵闹的'),'形容词前用Be构成祈使句，否定用Don’t be。不是直接把形容词放在Don’t后。',[['Be careful! / Be patient.','课文和导学原例：小心！／耐心点。careful、patient都是形容词，前面用Be。']]),
g('do-not','don’t与do not的否定意义一致','保持意思不变，给告示换一种说法。',choice(['Don’t touch the vase.','Do touch the vase.','Don’t move the vase.'],'Don’t touch the vase.','Do not touch the vase.\ntouch：触碰；move：移动'),'Do not与Don’t都表示不要；完整形式常用于正式文体，但不是只能书面使用。把Do not变成Do就改变了肯否意思。',[['Do not open the door. = Don’t open the door.','这两句都要求不要开门；open：打开。']]),
g('front','区分车外前方与车内前部','两人都在车外的前方，用第一种说法；两人都在车内前排，用第二种。补全位置短语。',fill([blank('车外：He’s sitting ',' the car with the driver.',['in front of','in the front of']),blank('车内：He’s sitting ',' the car with the driver.',['in the front of','in front of'])],['in front of','in the front of'],'driver：司机'),'in front of在这个例子中是车外前方，in the front of是车内前部；不能把两处位置混为一处。',[['in front of the window','课文中的窗前，不是窗户内部。'],['in the front of the car','导学对照中的车内前部；the把这个位置说成车的内部前部。']]),
g('recipient','用物品加to加人保持原意','保持意思不变，换一种说法。',fill([blank('Show me that picture. → Show that picture ',' me.',['to','with','on'])],['to']),'原句的人是me，物品是that picture。先说物品后，用to引出接收展示的人；show仍是给人看。',[['Give me that vase. → Give that vase to me.','课本Written A原例：两句都要求把那只花瓶给我。']]),
g('pronoun','可分短语动词的代词放在中间','这些灯要关掉。用them替换the lights，补全句子。',fill([blank('Turn ','.',['them off','off them','it off'])],['them off']),'本课turn off、put on、take off中，代词it／them在动词和on／off中间。名词可有两种位置；不把此规则推广到所有动词加介词。',[['Take off your hat. / Take your hat off. → Take it off.','名词your hat可放两处；换成代词it后放在take与off之间。']]),
g('tone','结合情境判断祈使句的语气','另设情境：老师轻声微笑，示意孩子把杯子拿稳，再说这句话。这里是在做什么？',choice(['温和地提醒小心。','宣布杯子已经摔碎。','要求把杯子扔掉。'],'温和地提醒小心。','Don’t drop it!'),'根据轻声、表情、手势与上下文理解提醒，不能仅凭Don’t或叹号判断生气或粗鲁。',[['Be careful!','相同形式可用于不同语气。判断时还要听语调、看手势表情和上下文。']]),
...old.questions.observe];
unit.questions.apply=[...old.questions.be,...old.questions.trans,
q('a-writing-intent','分清原意改写与指令转为自己打算','读这组课本B原例。后一句相对前一句，表达意图怎样改变？',choice(['从要求对方穿，改成自己说打算穿。','两句都在命令对方穿。','后一句表示自己已经穿好了。'],'从要求对方穿，改成自己说打算穿。','Put on your coat! → I’m going to put it on.'),'前句是给对方的指令，后句是自己表达打算。与A的双宾语换说法不同，B不是保持同一说话意图的同义转换。')];
unit.questions.exam=[...old.questions.exam,
q('e-be','独立运用don’t be加形容词','提醒别人不要迟到。补全句子。',fill([blank('Don’t ',' late.',['be','are','is'])],['be'],'late：迟到的'),'否定祈使句Don’t后用原形be，再接形容词late。'),
q('e-do-not','独立识别完整否定与缩写','哪句话与Do not open the box.意思相同？',choice(['Don’t open the box.','Do open the box.','Don’t close the box.'],'Don’t open the box.','open：打开；close：关上'),'Do not与Don’t都是否定；换成肯定Do或另一动作close都改变了原意。'),
q('e-front','独立区分车内前部与车外前方','Lily坐在公共汽车内部的最前一排，Tom站在车外的前方。分别补全。',fill([blank('Lily is ',' the bus.',['in the front of','in front of']),blank('Tom is ',' the bus.',['in front of','in the front of'])],['in the front of','in front of']),'本题明确给出内部和外部条件；不是凭人物、车的朝向或背过某个名字选词。'),
q('e-tone','不凭祈使形式或标点猜情绪','只看到这句话，没有听到声音，也不知道当时的表情和情境。能确定说话人生气了吗？',choice(['不能，还需要语气和上下文。','能，只要有叹号就是生气。','能，只要有Don’t就是粗鲁。'],'不能，还需要语气和上下文。','Don’t touch it!\ntouch：触碰'),'句式和叹号不足以确定生气或粗鲁；不要添加材料没有的情绪和剧情。'),
q('e-intention','根据给定目标选择否定指令','窗户现在关着，老师希望它保持关闭。她应怎样直接提醒想开窗的孩子？',choice(['Don’t open the window.','Open the window.','Don’t close the window.'],'Don’t open the window.'),'目标是保持关闭，因此不要打开。完整条件决定要求，不是单看某个动作词。')];
unit.taskSessions=Object.fromEntries(unit.reward.zones.map(z=>[z.id,'five-zones-v1']));const previous={listen:['listen'],roles:['roles'],grammar:['observe'],apply:['be','trans'],exam:['exam']};
unit.taskPredecessors=Object.fromEntries(Object.entries(previous).map(([id,ids])=>[id,ids.map(prior=>({key:'unit3940-'+prior+'-practice/v1',questions:old.questions[prior]}))]));
core.unit3940=unit;if(globalThis.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis.CanranCore);
