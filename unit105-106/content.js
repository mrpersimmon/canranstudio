(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit105-106/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页214–217／PDF247–250';
const grammarSource='《同步导学》Grammar纸页182／PDF196；《语法练习册》纸页303–308／PDF317–322';
const rows=[['spell','拼写','/spel/','spell'],['intelligent','聪明的；有智慧的','/ɪnˈtelɪdʒənt/','intelligent'],['mistake','错误','/mɪˈsteɪk/','mistake'],['present','礼物（本课名词）','/ˈprezənt/','present'],['dictionary','词典','/ˈdɪkʃənəri/','dictionary'],['carry','带；搬','/ˈkæri/','carry'],['correct','改正；纠正（本课动词）','/kəˈrekt/','correct'],['keep','保存；保留','/kiːp/','keep'],['at once','立刻；马上','/ət wʌns/','at-once'],['full of','充满……','/fʊl əv/','full-of'],['type','打字','/taɪp/','type'],['again','再一次','/əˈɡen/','again'],['want','想要','/wɒnt/','want'],['tell','告诉','/tel/','tell'],['hope','希望','/həʊp/','hope'],['listen to','听……','/ˈlɪsən tə/','listen'],['describe','描述','/dɪˈskraɪb/','describe'],['move','移动','/muːv/','move'],['try','尝试','/traɪ/','try'],['finish','完成','/ˈfɪnɪʃ/','finish'],['hurt yourself','伤到你自己','/hɜːt jɔːˈself/','hurt'],['slip','滑倒','/slɪp/','slip'],['fall','跌落；摔倒','/fɔːl/','fall'],['miss','错过（本课语境）','/mɪs/','miss'],['break','打破；弄坏','/breɪk/','break'],['drive','驾驶','/draɪv/','drive'],['lose','丢失','/luːz/','lose'],['cut yourself','割到你自己','/kʌt jɔːˈself/','cut']];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit105-106',version:1,contentRevision:'office-infinitive-v1',mode:'classroom',title:'办公室的小礼物',path:'/unit105-106/',start:'learn/words',progress:{learningKey:'canran:unit105-106:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识词语与动作',activities:[['words','办公室小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进办公室',activities:[['text','办公室小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清谁来做',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'传达行动与提醒',activities:[['apply','行动小帮手','give']],required:['apply']},
{id:'l5',title:'完成表达挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'type',storyQuestion:'给Sandra的礼物是什么？',completionTitles:{listen:'办公室词语认清啦！',roles:'办公室故事读懂啦！',grammar:'谁来做说清啦！',apply:'行动与提醒传达啦！',exam:'表达挑战完成！'},reward:{edition:'office-infinitive-v1',title:'动作表达小达人',lesson:'Lesson 105–106',scene:'/assets/unit105-106/keepsake-story-v1.webp',alt:'老板把词典递给Sandra',color:'#6f8b79',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','行动小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={boss:'The boss',bob:'Bob',sandra:'Sandra'};
unit.learning.DIALOGUE=[
['boss','Where’s Sandra, Bob? I want her.','Bob，Sandra在哪儿？我要找她。'],
['bob','Do you want to speak to her?','您要同她谈话吗？'],
['boss','Yes, I do. I want her to come to my office. Tell her to come at once.','是的，我要她到我的办公室来。叫她马上就来。'],
['sandra','Did you want to see me?','您找我吗？'],
['boss','Ah, yes, Sandra. How do you spell ‘intelligent’? Can you tell me?','啊，是的，Sandra。“intelligent”怎样拼写？你能告诉我吗？'],
['sandra','I-N-T-E-L-L-I-G-E-N-T.','I-N-T-E-L-L-I-G-E-N-T。'],
['boss','That’s right. You’ve typed it with only one ‘L’. This letter’s full of mistakes. I want you to type it again.','对的。但你只打了一个“L”。这封信里错误百出。我希望你重打一遍。'],
['sandra','Yes, I’ll do that. I’m sorry about that.','是，我重打一遍。对此我感到很抱歉。'],
['boss','And here’s a little present for you.','这里有一件小礼物送给你。'],
['sandra','What is it?','是什么？'],
['boss','It’s a dictionary. I hope it’ll help you.','是本词典。我希望它能对你有所帮助。']
].map(([who,text,cn],i)=>({id:'u105106-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u105106-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-dictionary','词典词义','哪一个词表示“词典”？',choice(['dictionary','letter','present'],'dictionary',{optionImages:{dictionary:image('dictionary'),letter:image('letter'),present:image('present')}}),'dictionary是词典；present是礼物，不限定哪一种物品。'),
q('v-match','拼写与错误词义','把三个词配好。',match([['spell','拼写'],['mistake','错误'],['present','礼物']]),'本课present是名词礼物。'),
q('v-correct','correct的动词词义','点出表示“改正”的动作。',{type:'locate',fragments:[{value:'Correct'},' the ',{value:'mistake'},'.'],options:['Correct','mistake'],answer:'Correct'},'correct在这里是动作“改正”，mistake是错误。'),
q('v-keep','keep的当前词义','You can keep this book.中的keep表示什么？',choice(['保留这本书','把书打破','把书丢掉'],'保留这本书'),'keep在这里表示保留。'),
q('v-full','full of短语','This letter’s full of mistakes.表示什么？',choice(['这封信里有很多错误','信里一个错误也没有','每个字母都一定错了'],'这封信里有很多错误'),'full of不等于已经逐个核实每个字母都错。'),
q('v-intelligent','intelligent词义','intelligent的词义是哪项？',choice(['聪明的；有智慧的','立刻；马上','保存；保留'],'聪明的；有智慧的'),'词义学习不等于根据一次拼写给某个人下判断。'),
q('v-once','at once词义','Tell her to come at once.中的at once表示什么？',choice(['马上','只来一次','昨天'],'马上'),'at once是立刻，不是只做一次。'),
q('v-actions','carry与correct区分','把动作和意思配好。',match([['carry it','把它带上'],['correct it','把它改正'],['keep it','把它保留']]),'看清动作，三个短语不能互相代替。')
];
unit.questions.roles=[
q('r-sandra','希望谁到办公室','老板希望谁到办公室来？',choice(['Sandra','Bob','没有提到的人'],'Sandra'),'I want her to come中的her指Sandra。'),
q('r-bob','区分传话人与行动人','老板对Bob说Tell her to come at once.，谁传话、谁过来？',choice(['Bob传话，Sandra过来','Sandra传话，Bob过来','两人都只需重打信'],'Bob传话，Sandra过来'),'tell的听话人与come的行动人不同。'),
q('r-spelling','口头拼写与已打文字','Sandra口头拼出intelligent后，老板怎样回应？',choice(['口头拼对了，但先前只打了一个L','口头和打字都完全没有错误','Sandra说不出任何字母'],'口头拼对了，但先前只打了一个L'),'That’s right肯定这次口头拼写；后一句说已打的文字。'),
q('r-again','再做一次的要求','老板希望Sandra接下来做什么？',choice(['把这封信重打一遍','把词典丢掉','把Bob的姓名写在信上'],'把这封信重打一遍'),'type it again中的it指这封信。'),
q('r-promise','答应行动与完成结果','Yes, I’ll do that.说明什么？',choice(['Sandra答应去重打，文中没有展示重打后的信','她已经重打完且完全没有错误','她明确拒绝重打'],'Sandra答应去重打，文中没有展示重打后的信'),'答应去做不等于动作已经完成。'),
q('r-present','教材开场问题','给Sandra的小礼物是什么？',choice(['一本词典','一张车票','一台新打字机'],'一本词典'),'原文结尾明确说It’s a dictionary。'),
q('r-hope','希望与已证实效果','I hope it’ll help you.能确认什么？',choice(['老板希望词典有帮助，效果尚未交代','词典已让所有错误永久消失','Sandra以后一定不会再犯错'],'老板希望词典有帮助，效果尚未交代'),'hope保留希望的含义，不能变成已发生的效果。'),
q('r-boundary','错误不变成人物定性','课文说明信里有错误，能因此断定Sandra永远学不会吗？',choice(['不能，文中没有这样的结论','能，一次打字错误决定所有能力','能，词典就是惩罚证明'],'不能，文中没有这样的结论'),'保留原文事实，不添加对人物的固定能力标签或礼物动机。')
];
unit.questions.grammar=[
g('want-to','want后接不定式','表达“我想再试一次”，选好形式。',fill([blank('I want','again.',['to try','trying','to trying'])],['to try']),'本课want后接to＋动词原形。','to后看动作的原形。',model(['I want to read this book.','想读书的是I自己。'])),
g('actor','区分自己做与希望别人做','A和B分别希望谁读信？',choice(['A是我自己读，B是Anna读','两句都是我自己读','两句都是Anna读'],'A是我自己读，B是Anna读',{context:'A: I want to read the letter.\nB: I want Anna to read the letter.'}),'want to do和want somebody to do，动作执行者不同。','看to前是否明确另一个人。',model(['I want to write. → 我自己写。','I want Ben to write. → 希望Ben写。'])),
g('object','宾格与动作原形','希望他帮我们，补好两处。',fill([blank('I want','',['him','he']),blank('to','us.',['help','helps'])],['him','help']),'want后的人称代词用宾格；to后动作保持原形。','分别看代词位置与to后形式。',model(['She wants me to wait.','me是宾格，wait仍用原形。'])),
g('tell','tell somebody to do','请用词块告诉她读这封信。',bank(['Tell her','to read','the letter','reading'],'Tell her to read the letter',3),'tell＋人＋to do说明告诉谁做什么。','保留行动人和动作。',model(['Tell him to sit down.','不是Tell to him sit down。'])),
g('third','主句变化而不定式不变','她希望我们改正错误，补好两处。',fill([blank('She','us',['wants','want']),blank('to','the mistakes.',['correct','corrects'])],['wants','correct']),'主语she使want变wants；to后correct不跟着加s。','两个动词不处在同一位置。',model(['He wants them to wait.','wants随he变化；wait是原形。'])),
g('what','询问希望我做什么','用词块询问“你想让我做什么？”',bank(['What do you','want me','to do','want I'],'What do you want me to do',3,'?'),'What do you want me to do?问的是希望我做的动作。','me表示行动人。',model(['“What does May want him to do?” — “She wants him to read.”','问与答里的行动人保持一致。'])),
g('dont-want','否定want的形式','她不希望他弄丢它，补好句子。',fill([blank('She','want him',['doesn’t','don’t']),blank('','lose it.',['to','not'])],['doesn’t','to']),'She doesn’t want him to…，doesn’t后want恢复原形。','否定want，后面的to do仍保留。',model(['I don’t want them to wait.','don’t否定want，wait前仍是to。'])),
g('not-to','不定式的否定','按本课not to结构，提醒她不要开门。',bank(['Tell her','not to','open the door','don’t'],'Tell her not to open the door',3),'本课练tell somebody not to do，not放在to前。','要说的是告诉她别做，不是别告诉她。',model(['Tell him not to run.','仍然要告诉他；内容是不要跑。'])),
g('neg-scope','区分不要告诉与告诉不要','A和B的意思有什么区别？',choice(['A要求别传这句话，B要求传达别开窗','两句都表示已经关好窗','两句都表示不要传话'],'A要求别传这句话，B要求传达别开窗',{context:'A: Don’t tell him to open the window.\nB: Tell him not to open the window.'}),'否定tell与否定后面的动作，不能机械互换。','not作用在哪个动作上？',model(['Don’t ask her to wait. → 不要请她等。','Ask her not to wait. → 请她不要等。'])),
g('reflexive','反身代词跟随行动人','May对Ben说Don’t hurt yourself.，转述她正在说的话。',{...fill([blank('She is telling','not to hurt',['him','he']),blank('',' .',['himself','yourself'])],['him','himself']),context:'May is speaking to Ben, a boy. She says: “Don’t hurt yourself.”'},'改用him指Ben时，伤到他自己用himself。','人称改变后，自己也要对应。',model(['“Don’t cut yourself,” he says to Anna.','He is telling her not to cut herself.'])),
g('possessive','物主代词随指代调整','转述老师给两个孩子的指示。',choice(['She wants them to bring their books.','She wants them to bring her books.','She wants they to bring their books.'],'She wants them to bring their books.',{context:'The teacher says to two children: “Bring your books.”\nThe books belong to the children.'}),'your指两个孩子的，转述用their；不是老师的her。','材料说明书属于谁。',model(['“Bring your pen,” May says to Ben.','May wants him to bring his pen.'])),
g('two-to','不定式标记与介词to','两处to分别做什么？',choice(['to come引出动作，to my office表示去向','两处都必须接动词原形','两处都表示已经完成'],'to come引出动作，to my office表示去向',{context:'I want her to come to my office.'}),'to come是不定式；to my office中的to是介词。','不要看到to就认定一定是同一种结构。',model(['I want to speak to her.','to speak引出动作；to her说明对谁说。'])),
g('hope','不同动词不套同一框架','表达“我希望明天去旅行”，选正确形式。',choice(['I hope to travel tomorrow.','I hope me to travel tomorrow.','I hope to travelling tomorrow.'],'I hope to travel tomorrow.'),'可以hope to do；不能把want somebody to do机械套到hope。','动词搭配要分别核对。',model(['She hopes to learn French.','She hopes that Ben will help her.'])),
g('bare','can与want后的形式','比较can与want，选好动作形式。',fill([blank('I can','it.',['spell','to spell']),blank('I want','it.',['to spell','spell'])],['spell','to spell']),'can后用原形不加to；want后本课用to＋原形。','不能把可省to推广到每个动词后。',model(['I can read. / I want to read.','不同位置用不同形式。'])),
g('independent-actor','独立保持行动人与动词形式','希望她帮助他们，补全句子。',fill([blank('We want','',['her','she']),blank('to','them.',['help','helps'])],['her','help']),'her指出行动人；to后help原形。'),
g('independent-not','独立传达不要做的提醒','用给定词块告诉他们不要迟到。',bank(['Tell them','not to','be late','don’t'],'Tell them not to be late',3),'提醒的内容为不要迟到，使用not to be。'),
g('independent-why','独立回答说话的原因','按已给原因，用Because回答。',choice(['Because she doesn’t want him to lose the key.','Because she doesn’t want her to lose the key.','Because he has already lost the key.'],'Because she doesn’t want him to lose the key.',{context:'Anna is speaking to Ben because she does not want Ben to lose the key.\nWhy is she speaking to him?'}),'原因由材料明确给出；没有说钥匙已经丢失。'),
g('independent-correct','独立修正tell结构','按“告诉她保留这本书”，改正整句。',choice(['Tell her to keep this book.','Tell she to keep this book.','Tell her keep this book.'],'Tell her to keep this book.'),'tell后宾格her，动作前保留to。')
];
unit.questions.apply=[
q('a-self','明确自己做动作','你想自己检查这封信，怎样说？',choice(['I want to check this letter.','I want you to check this letter.','I want him to check this letter.'],'I want to check this letter.',{context:'You will check the letter yourself. You are not asking another person to check it.'}),'动作执行者是说话的我。'),
q('a-task','传达指定的动作','Anna的任务卡写着什么？选符合任务的表达。',choice(['I want Anna to correct the letter.','I want Anna to carry the box.','I want Ben to correct the letter.'],'I want Anna to correct the letter.',{context:'Task card\nAnna: correct the letter.\nBen: carry the box.'}),'同时核对人和动作，不只看人物名字。'),
q('a-no','转达不要做的提醒','请用词块把提醒转给Ben。',{...bank(['Tell Ben','not to','open the window','don’t'],'Tell Ben not to open the window',3),context:'The window must stay closed during this activity.\nTell Ben what not to do.'},'仍然要传话，内容是别开窗。'),
q('a-two','保持做什么与不做什么','按美术任务卡补好两句。',{...fill([blank('I want him to paint it',' .',['blue','red']),blank('I don’t want him to paint it',' .',['red','blue'])],['blue','red']),context:'Tom’s task: paint the box blue, not red.'},'肯定与否定里的颜色分别对应材料。'),
q('a-books','保持物品归属','老师让May带她自己的书，选符合意思的句子。',choice(['The teacher wants her to bring her books.','The teacher wants her to bring his books.','The teacher wants she to bring her books.'],'The teacher wants her to bring her books.',{context:'The teacher is a man. He asks May to bring May’s own books.'}),'her指May，书也属于May；没有变成老师的书。'),
q('a-reason','用明确材料回答原因','Anna为什么和Ben谈话？',choice(['Because she doesn’t want him to miss the bus.','Because she wants him to miss the bus.','Because he has already missed the bus.'],'Because she doesn’t want him to miss the bus.',{context:'Anna reminds Ben to leave on time because she does not want him to miss the bus.\nThe bus has not left yet.'}),'不想让他错过，并不等于已经错过。'),
q('a-polite','请求时选择合适语气','向同桌请求帮忙查一个词，哪句更适合礼貌请求？',choice(['Could you help me find this word, please?','I want you to do it at once!','You must never make a mistake!'],'Could you help me find this word, please?',{context:'You need a classmate’s help. You are making a polite request, not giving an order.'}),'I want you to…是本课结构，但日常请求还要看对象和语气。'),
q('a-result','区分答应与已完成','任务记录目前只能写哪项？',choice(['May答应重打；是否完成还不知道','May已经重打完且每个字都正确','May以后永远不会再打错'],'May答应重打；是否完成还不知道',{context:'May says, “I’ll type it again.”\nNo revised letter has been shown yet.'}),'保留尚未发生或尚未展示的结果。')
];
unit.questions.exam=[
q('e-spell','独立核对两次拼写','课文中口头拼写与已打文字有什么区别？',choice(['口头拼对了，已打文字少了一个L','口头拼错了，打字没有错','老板没有谈到字母L'],'口头拼对了，已打文字少了一个L'),'把两次不同的表现分开。'),
q('e-gift','独立核对教材礼物','Sandra收到的礼物是什么？',choice(['a dictionary','a train ticket','a new typewriter'],'a dictionary'),'课文明确给出dictionary。'),
q('e-result','独立保留未知结果','课文结束时能确定哪项？',choice(['Sandra答应重打，老板希望词典有帮助','重打后的信已经检查为零错误','Sandra以后不会再犯错'],'Sandra答应重打，老板希望词典有帮助'),'承诺和希望都不替代已核实结果。'),
q('e-word','独立辨认当前词义','Correct this mistake.中的correct表示什么？',choice(['改正','礼物','立刻'],'改正'),'在这句里correct是动词。'),
q('e-want-to','独立使用want to do','表达我想学英语，补全。',fill([blank('I want','English.',['to learn','learning','to learning'])],['to learn']),'want后接to＋原形。'),
q('e-actor','独立区分动作执行者','这句话希望谁来读？',choice(['Ben','说话的我','没有说明'],'Ben',{context:'I want Ben to read this page.'}),'to前的Ben说明行动人。'),
q('e-object','独立使用宾格与原形','希望他们帮助我，填好两处。',fill([blank('I want','',['them','they']),blank('to','me.',['help','helps'])],['them','help']),'宾格them，原形help。'),
q('e-tell','独立组织肯定指示','告诉他把它带上。',bank(['Tell him','to carry','it','carrying'],'Tell him to carry it',3),'tell＋人＋to do。'),
q('e-third','独立保持主句与不定式形式','他希望她留下，补好两处。',fill([blank('He','her',['wants','want']),blank('to','here.',['stay','stays'])],['wants','stay']),'主句wants；不定式stay。'),
q('e-question','独立询问希望做什么','用词块问你想让我做什么。',bank(['What do you','want me','to do','want I'],'What do you want me to do',3,'?'),'问行动，行动人用me。'),
q('e-negative-want','独立否定want','他不希望她开门，补全。',fill([blank('He','want her',['doesn’t','don’t']),blank('','open the door.',['to','not'])],['doesn’t','to']),'doesn’t后want原形，再接her to open。'),
q('e-not-to','独立使用not to','按本课结构提醒她不要弄丢它。',bank(['Tell her','not to','lose it','don’t'],'Tell her not to lose it',3),'内容是不要丢失，仍然要告诉她。'),
q('e-scope','独立核对否定范围','要求“不要请他等”，应选哪句？',choice(['Don’t ask him to wait.','Ask him not to wait.','Ask him to wait.'],'Don’t ask him to wait.'),'否定ask，不能换成请他不要等。'),
q('e-reflexive','独立调整反身代词','Ben提醒Anna别割到她自己，填好两处。',{...fill([blank('He is telling','not to cut',['her','she']),blank('',' .',['herself','yourself'])],['her','herself']),context:'Ben says to Anna: “Don’t cut yourself.”\nAnna is the person who must be careful.'},'Anna对应her和herself。'),
q('e-possessive','独立保持物品归属','转述老师的指示，书属于两个孩子。',choice(['The teacher wants them to bring their books.','The teacher wants them to bring her books.','The teacher wants they to bring their books.'],'The teacher wants them to bring their books.',{context:'A teacher says to two children: “Bring your books.”\nThese are the children’s own books.'}),'宾格them，所属关系their。'),
q('e-to','独立识别两种to','哪一段里的to是不定式标记？',choice(['to speak','to her'],'to speak',{context:'I want to speak to her.'}),'to speak引出动作，to her中的to是介词。'),
q('e-hope','独立核对hope搭配','表达希望自己学会游泳，选哪句？',choice(['I hope to learn to swim.','I hope me to learn to swim.','I hope to learning to swim.'],'I hope to learn to swim.'),'hope to do；不能机械增加me。'),
q('e-can','独立比较can与want','用同一个动作补好两种结构。',fill([blank('She can','it.',['correct','to correct']),blank('She wants','it.',['to correct','correct'])],['correct','to correct']),'can后原形，wants后to＋原形。'),
q('e-reason','独立回答明确给出的原因','为什么她在提醒Tom？',choice(['Because she doesn’t want him to lose the ticket.','Because he has already lost the ticket.','Because she wants him to lose the ticket.'],'Because she doesn’t want him to lose the ticket.',{context:'May reminds Tom because she does not want him to lose the ticket.\nTom still has the ticket.'}),'材料说票仍在，不能改成已经丢失。'),
q('e-contrast','独立保持肯定与否定内容','按任务卡选择颜色。',{...fill([blank('I want her to use',' .',['green','yellow']),blank('I don’t want her to use',' .',['yellow','green'])],['green','yellow']),context:'Anna’s task: use green, not yellow.'},'做与不做的内容分别保持。'),
q('e-meaning','独立区分想要与已执行','I want him to correct it.是否说明他已改完？',choice(['没有，只说明我希望他去改','说明已经改完而且零错误','说明他拒绝修改'],'没有，只说明我希望他去改'),'愿望不等于执行结果。'),
q('e-polite','独立选择请求语气','请同学帮忙搬一本书，哪句适合礼貌请求？',choice(['Could you carry this book for me, please?','I want you to do it at once!','Don’t ever make a mistake!'],'Could you carry this book for me, please?',{context:'You are asking a classmate for help with one book.'}),'使用当前礼貌请求，不照搬老板发出指示的语气。')
];
unit.learning.REFERENCE=[
'动词不定式常用to＋动词原形。本课先学want to do（想自己做），再学want somebody to do和tell somebody to do（希望／告诉另一个人做）。导学分别称作宾语和宾语补足语；更要先辨清谁执行动作，不能只背术语。',
'want／tell后的人称代词用宾格：me、you、him、her、us、them。主句随主语和时态变化：He wants her to wait；He wanted her to wait。后面to wait不随主句加s或变过去式。名词也能直接作行动人，如I want Anna to read。',
'否定want：I don’t want her to leave；He doesn’t want her to leave。告诉某人不要做：Tell her not to leave。本课练not放to前的教材结构；不据此把其他所有not位置都判为错误。Don’t tell her to leave（不要告诉她离开）和Tell her not to leave（告诉她不要离开）否定的动作不同，不能机械交换。',
'What do you want me to do?问“你想让我做什么？”回答I want you to…时，说话角色交换，me与you也随之变化。转述Don’t hurt yourself给Ben，用him和himself；转给Anna，用her和herself。your books要按物主改成his／her／their books，不能只换句首。',
'课本106课C要求每题写两种结构：She is telling him not to…和She doesn’t want him to…。它们在给定的提醒场景中相关，但“她正在告诉”还报告了说话行动，“她不希望”本身不证明已经说出口，也不能推广成任何语境都完全等义。D的Because回答按题设的理由，不从“说话”本身推测动机。',
'to有不同用途：to come／to speak引出动作；to my office／to her中的to是介词。不能把每个to都当不定式，也不能把不定式可省to泛化到want、tell后；can后则直接用原形，如can spell。',
'导学列出的动词有不同搭配，不能都套同一个模板。hope可以用hope to do或hope＋从句：I hope to travel；I hope it’ll help you。不要照want somebody to do写成hope somebody to do。参考里只保留本课需要的对比，不提前把整张动词表变成必背测验。',
'present在本课是名词“礼物”，correct在106课是动词“改正”，miss在动作图中是“错过”。spell的过去式和过去分词可用spelt，也可用spelled。intelligent有两个相邻的l；Sandra这次口头拼写正确，老板指出的是此前打字少了一个L。',
'I want her在开场语境是“我要找她”，后文才展开希望她过来。I’ll do that是答应重打，不是已经重打完。I hope it’ll help you是希望词典有帮助，课文没有给修改后的信或长期学习结果；不能为礼物另添惩罚、羞辱或奖励动机。',
'I want you to…在老板指示工作的语境中保留原文；对同学提出请求还应考虑语气，可说Could you…please?。一次拼写错误不等于对人的固定能力判断，课程的错答反馈只针对当前任务。'
];
unit.learning.MODEL_TITLE='课本小参考 · 106课框架与K–Z替换';
unit.learning.ACTION_MODELS=[['课本框架','含义'],['I want you / him / her / them to…','我要你／他／她／他们做……'],['Tell him / her / them to…','告诉他／她／他们做……'],['I don’t want you / him / her / them to…','我不要你／他／她／他们做……'],['Tell him / her / them not to…','告诉他／她／他们不要做……']];
unit.learning.MODELS=[['K · carry it','把它带上','carry'],['L · correct it','把它改正','correct'],['M · listen to it','听它','listen'],['N · describe it','描述它','describe'],['O · move it','移动它','move'],['P · try it','试试它','try'],['Q · finish it','完成它','finish'],['R · keep it','保留它','keep'],['S · hurt yourself','伤到你自己','hurt'],['T · slip','滑倒','slip'],['U · fall','跌落；摔倒','fall'],['V · miss it','错过它','miss'],['W · break it','打破它','break'],['X · drive it','驾驶它','drive'],['Y · lose it','丢失它','lose'],['Z · cut yourself','割到你自己','cut']].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 改成want you to句子',instruction:'按例子把祈使句改成带不定式的陈述句，完整保留6题。',examples:['Please repair it. → I want you to repair it.'],items:['Please spell it.','Please telephone him.','Please wear it.','Please ask her.','Please tell them.','Please help us.']},
{title:'B · 写出问句和回答',instruction:'完整保留8题，每题先写What do you want me to do?，再按给出的动作回答。注意问与答交换说话人。',examples:['Type it again! → What do you want me to do? I want you to type it again.'],items:['Carry it!','Correct it!','Listen to it!','Describe it!','Move it!','Try it!','Finish it!','Keep it!']},
{title:'C · 写出两种否定表达',instruction:'完整保留6题。每题按指定人物写is telling…not to…和doesn’t want…to…两句，检查行动人与反身代词。只读、写这些提醒，不要求实际尝试危险动作。',examples:['Don’t type it again! (He/her) → He is telling her not to type it again. He doesn’t want her to type it again.'],items:['Don’t hurt yourself! (She/him)','Don’t slip! (She/him)','Don’t fall! (She/him)','Don’t miss it! (She/them)','Don’t break it! (She/him)','Don’t drive it! (He/her)']},
{title:'D · 用Because回答原因',instruction:'完整保留6题。按课本例子把括号内容放入doesn’t want…to…，说明题设理由。',examples:['Why is he speaking to her? (type it again) → Because he doesn’t want her to type it again.'],items:['Why is she speaking to him? (hurt himself)','Why is she speaking to him? (slip)','Why is she speaking to him? (fall)','Why is she speaking to them? (miss it)','Why is she speaking to him? (break it)','Why is he speaking to her? (drive it)']}
];
core.unit105106=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit105106,excerpts={"u105106-v1-r-sandra":[0,1,2],"u105106-v1-r-bob":[0,1,2],"u105106-v1-r-spelling":[4,5,6],"u105106-v1-r-again":[6,7],"u105106-v1-r-promise":[6,7],"u105106-v1-r-present":[8,9,10],"u105106-v1-r-hope":[8,9,10],"u105106-v1-e-spell":[4,5,6],"u105106-v1-e-result":[6,7,8,9,10]},speakers={"boss":"The boss","bob":"Bob","sandra":"Sandra"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 105',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
