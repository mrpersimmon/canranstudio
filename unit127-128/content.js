(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit127-128/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页258–261／PDF291–294',grammarSource='《同步导学》Grammar纸页210／PDF224；《语法练习册》纸页372–378／PDF386–392';
const rows=[
['famous','著名的','/ˈfeɪməs/','famous'],['actress','女演员','/ˈæktrəs/','actress'],['actor','男演员；演员','/ˈæktə/','actor'],['read','通过阅读得知；读','/riːd/','read'],['at least','至少；不低于','/ət ˈliːst/','at-least'],['recognize','认出','/ˈrekəɡnaɪz/','recognize'],
['beside','在……旁边','/bɪˈsaɪd/','beside'],['husband','丈夫','/ˈhʌzbənd/','husband'],['another look','再看一看','/əˈnʌðə lʊk/','look'],['sure','确信的','/ʃʊə/','sure'],['tired','疲倦的','/taɪəd/','tired'],['sleeping','正在睡觉','/ˈsliːpɪŋ/','sleeping'],
['Danish','丹麦的；丹麦人','/ˈdeɪnɪʃ/','danish'],['Swedish','瑞典的；瑞典人','/ˈswiːdɪʃ/','swedish'],['dentist','牙医','/ˈdentɪst/','dentist'],['engineer','工程师','/ˌendʒɪˈnɪə/','engineer'],['probably','很可能；大概','/ˈprɒbəbli/','probably'],['not more than','不超过','/nɒt mɔː ðən/','at-most']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit127-128',version:1,contentRevision:'cafe-deduction-v1',mode:'classroom',title:'咖啡馆里的辨认',path:'/unit127-128/',start:'learn/words',progress:{learningKey:'canran:unit127-128:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识辨认与推测的词语',activities:[['words','咖啡馆小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'读懂两人的交谈',activities:[['text','咖啡馆小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'练习有依据的推测',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'把线索说清楚',activities:[['apply','线索小记录员','give']],required:['apply']},
{id:'l5',title:'完成推理挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'recognize',storyQuestion:'Who is only twenty-nine, and why is it so unclear?（谁只有29岁？为什么这件事如此模糊不清？）',completionTitles:{listen:'辨认词语认清啦！',roles:'两人的交谈读懂啦！',grammar:'推测的表达学会啦！',apply:'线索记录清楚啦！',exam:'推理挑战完成！'},reward:{edition:'cafe-deduction-v1',title:'细心推理员',lesson:'Lesson 127–128',scene:'/assets/unit127-128/keepsake-story-v1.webp',alt:'Kate与Liz在咖啡馆交谈，望向邻桌的两位客人',color:'#739b99',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','线索小记录员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={kate:'Kate',liz:'Liz'};
unit.learning.DIALOGUE=[
['kate','Can you recognize that woman, Liz?','Liz，你能认出那个女人吗？'],
['liz','I think I can, Kate. It must be Karen Marsh, the actress.','Kate，我想我认得出。那一定是女演员Karen Marsh。'],
['kate','I thought so. Who’s that beside her?','我也这样想。她旁边的那个人是谁？'],
['liz','That must be Conrad Reeves.','那一定是Conrad Reeves。'],
['kate','Conrad Reeves, the actor? It can’t be. Let me have another look. I think you’re right! Isn’t he her third husband?','男演员Conrad Reeves？不可能。让我再看看。我想你是对的！他不是她的第三任丈夫吗？'],
['liz','No. He must be her fourth or fifth.','不。他一定是她的第四任或第五任丈夫。'],
['kate','Doesn’t Karen Marsh look old!','Karen Marsh看上去可够老的！'],
['liz','She does, doesn’t she! I read she’s twenty-nine, but she must be at least forty.','是的，谁说不是呢！我读到她29岁，但她一定至少40岁了。'],
['kate','I’m sure she is.','我确信她是。'],
['liz','She was a famous actress when I was still at school.','我还在上学时，她就是一位著名的女演员了。'],
['kate','That was a long time ago, wasn’t it?','那是很久以前的事了，不是吗？'],
['liz','Not that long ago! I’m not more than twenty-nine myself.','没那么久！我自己也不超过29岁。']
].map(([who,text,cn],i)=>({id:'u127128-line'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines}),ctx=(input,context)=>({...input,context});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u127128-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-stage','识别课本新词','配好三个词。',match([['famous','著名的'],['actress','女演员'],['actor','男演员；演员']]),'课文用actress称Karen、actor称Conrad；actor也可泛指演员，不能推广为演员都必须是男性。'),
q('v-read','通过阅读得知','I read about it in a book. 中read表示什么？',choice(['通过阅读得知','当面认出一个人','在旁边站着'],'通过阅读得知'),'read可以表示阅读或通过阅读得知，不等于亲眼核实了内容。'),
q('v-position','位置与辨认词义','配好三个表达。',match([['recognize','认出'],['beside','在……旁边'],['another look','再看一看']]),'认出、位置和再看一次是不同的信息。'),
q('v-min','at least包含边界','at least four至少包含哪个数量？',choice(['4或更多','只能是3','只能恰好是4'],'4或更多'),'at least包括给定的最低数量，也允许更多。'),
q('v-max','not more than包含上限','not more than four表示什么？',choice(['不超过4，包括4','必须大于4','只能小于4，不包括4'],'不超过4，包括4'),'not more than不是严格小于；边界4也包含在内。'),
q('v-pair','确信与可能的词义','配好三个词。',match([['sure','确信的'],['probably','很可能；大概'],['tired','疲倦的']]),'sure表达说话人的确信，不能自动证明判断已经核实。'),
q('v-locate','at least词组定位','点出表示“至少”的词组。',{type:'locate',fragments:['There are ',{value:'at least'},' ',{value:'four'},' cups.'],options:['at least','four'],answer:'at least'},'at least是完整词组，four是数量。')
];
unit.questions.roles=[
q('r-woman','身份判断的说话人','是谁认为那位女士是Karen Marsh？',choice(['Liz','Karen Marsh','Conrad Reeves'],'Liz',{context:'Kate: Can you recognize that woman, Liz?\nLiz: I think I can, Kate. It must be Karen Marsh, the actress.'}),'这是Liz的辨认；原文没有让Karen自己确认身份。'),
q('r-that','that与beside的指代','Who’s that beside her? 中that指谁？',choice(['那位女士旁边的人','Kate手里的书','Liz自己的年龄'],'那位女士旁边的人',{context:'Liz: It must be Karen Marsh, the actress.\nKate: I thought so. Who’s that beside her?'}),'that在这里指人，her承接那位女士。'),
q('r-change','判断可以修正','Kate再看后怎样回应？',choice(['她从不相信改为认为Liz说得对','她始终说那人绝不可能是Conrad','Conrad自己报出了名字'],'她从不相信改为认为Liz说得对',{context:'Conrad Reeves, the actor? It can’t be. Let me have another look. I think you’re right!'}),'按照说话顺序理解变化，不把最初的can’t当最终判断。'),
q('r-husband','保留否定回应与不确定范围','Liz的回应能确定是第四任还是第五任吗？',choice(['不能，她否定第三任并推测第四任或第五任','能，原文只确认第四任','能，原文只确认第五任'],'不能，她否定第三任并推测第四任或第五任',{context:'Kate: Isn’t he her third husband?\nLiz: No. He must be her fourth or fifth.'}),'or保留两个可能；不能把人物推测升级成婚姻事实。'),
q('r-report','阅读所得与推测分开','哪项准确区分了两个年龄说法？',choice(['29是Liz读到的说法，至少40是她的推测','两个数字都由Karen当面确认','29是Kate的准确出生年份'],'29是Liz读到的说法，至少40是她的推测',{context:'Liz: I read she’s twenty-nine, but she must be at least forty.'}),'read给出信息来源，must表达Liz很确信的推测；均不等于出生记录。'),
q('r-look','评价归属','Doesn’t Karen Marsh look old! 表达谁的评价？',choice(['Kate对外表的感叹','作者证明所有女演员都很老','Karen公布自己的准确年龄'],'Kate对外表的感叹',{context:'Kate looks at the woman and exclaims: “Doesn’t Karen Marsh look old!”'}),'本句按感叹读；评价属于Kate，不当作年龄证明或普遍事实。'),
q('r-school','过去时间关系','Liz说自己上学时，Karen是什么情况？',choice(['已经是一位著名女演员','刚出生','正在和Liz同班上课'],'已经是一位著名女演员',{context:'Liz: She was a famous actress when I was still at school.'}),'when给出两个过去情况的时间关系，没有给出年份或学龄。'),
q('r-long','that的程度用法','Not that long ago! 中that是什么意思？',choice(['那么，用来限定“久”的程度','那个男人的姓名','准确的二十年前'],'那么，用来限定“久”的程度',{context:'Kate: That was a long time ago, wasn’t it?\nLiz: Not that long ago!'}),'that在Not that long ago里表示“那么”，不是确切年数。'),
q('r-self','myself的身份与数量范围','Liz最后声称什么？',choice(['她自己的年龄不超过29岁','Karen的真实年龄恰好29岁','Kate一定已经40岁'],'她自己的年龄不超过29岁',{context:'Liz: I’m not more than twenty-nine myself.'}),'myself强调Liz自己；不超过包括29，不擅自改成不到29。'),
q('r-opening','回应教材开场问题且保留未核实状态','关于“谁只有29岁”，哪项忠实于课文？',choice(['Liz读到Karen是29岁，自己也声称不超过29岁；真实年龄未核实','课文提供了两人的出生证明','两人都被证明恰好40岁'],'Liz读到Karen是29岁，自己也声称不超过29岁；真实年龄未核实',{context:'Liz: I read she’s twenty-nine, but she must be at least forty.\nLiz: I’m not more than twenty-nine myself.'}),'保留读到的说法、推测与自述，不强行得出一个已证实的年龄。')
];
unit.questions.grammar=[
g('polarity','肯定和否定推断','按两位说话人的判断补句。',ctx(fill([blank('May: It','be mine.',['must','can’t']),blank('Ben: It','be mine.',['can’t','must'])],['must','can’t']),'May recognizes her unique key mark and feels sure the key is hers. Ben knows his key is still in his pocket and feels sure this other key is not his.'),'很确信是，用must；很确信不可能是，用can’t。两者是说话人的判断。','两个人分别确信什么？',model(['This must be my bag. I recognize the label.','This can’t be my bag. Mine is at home.'])),
g('be','情态动词后be不变形','补好身份和状态推测。',ctx(fill([blank('She must','an actress.',['be','is','to be']),blank('They can’t','tired.',['be','are','to be'])],['be','be']),'The speaker strongly believes she is an actress and strongly rejects the idea that the group is tired. Complete the given deductions.'),'must／can’t后用be原形，不随主语变is或are，也不加to。','情态动词后用什么形式？',model(['He must be a teacher.','They can’t be late.'])),
g('verb','推测也可接实义动词','用must推测她知道答案。',ctx(bank(['She','must','know','the answer','knows','to know'],'She must know the answer',4),'She wrote this quiz and remembers every question. The speaker feels sure she knows the answer. Use must.'),'接know等实义动词时不额外加be，情态动词后的know不加s。','know前需要be吗？',model(['He must live nearby.','不写must lives或must be live。'])),
g('cant-verb','否定推测的实义动词形式','用can’t推测这个价钱不对。',ctx(fill([blank('It can’t','two hundred pounds.',['cost','costs','be cost'])],['cost']),'The speaker has a receipt for ten pounds and strongly doubts a claim of two hundred pounds for the same book.'),'can’t后直接接cost原形，不写costs或be cost。','cost是动作词还是be后的形容词？',model(['They can’t know the secret.','can’t后也可直接接实义动词。'])),
g('ongoing','推测正在进行的动作','按正在发生的情况组句。',ctx(bank(['He','must','be','sleeping','sleeps'],'He must be sleeping',4),'You hear Ben snoring now and infer that he is asleep. Use must and the -ing form.'),'现在正在做的推测用must be + 动词-ing，不省be。','-ing前还缺哪一个词？',model(['She must be reading now.','They can’t be watching television now.'])),
g('two-uses','must的必要与推测','两句must分别表示什么？',choice(['A是要求，B是推测','A与B都只能是要求','A与B都说明事情已经完成'],'A是要求，B是推测',{context:'A: The rule says, “You must be here by six.”\nB: After a long walk, I say, “You must be tired.”'}),'时间短语本身不能决定含义；看是在提出要求还是根据信息推断。','哪句在定规则，哪句在作判断？',model(['You must wait here.（要求）','You must know her.（推测）'])),
g('negative','否定推测与禁止不混淆','按规定与判断补句。',ctx(fill([blank('Visitors','touch the painting.',['mustn’t','can’t be']),blank('This','John’s coat.',['can’t be','mustn’t touch'])],['mustn’t','can’t be']),'In this gallery, touching the painting is forbidden. Separately, John’s only coat is small, but this coat is much larger; the speaker rejects the idea that it is his.'),'mustn’t在规则里表达禁止；本课否定身份推测用can’t be，不机械给must加not。','这里是在禁止动作还是排除身份？',model(['You mustn’t open the box.（禁止）','It can’t be my box.（否定推测）'])),
g('ability','can’t的能力与推测','can’t在两句里意思相同吗？',choice(['不同，A说不会打字，B说不可能是本人','相同，都只说没有能力','相同，都禁止别人打字'],'不同，A说不会打字，B说不可能是本人',{context:'A: I never learned to type. I can’t type.\nB: John is in another city. That man can’t be John.'}),'can’t type可表达能力不足；can’t be John在该情境是身份推测。','看它是在说技能还是辨认身份。',model(['I can’t swim.（能力）','It can’t be cold there.（推测）'])),
g('rewrite-a','按语境改写必要性','用has to改写这条要求。',ctx(bank(['He','has to','be here','at six o’clock','is probably'],'He has to be here at six o’clock',4),'The meeting rule requires Ben to be here at six. In “He must be here at six o’clock”, must expresses that requirement. Use has to.'),'这里保留必要性用has to；不能单凭六点就判断must的用途。','题目提供的是会议要求。',model(['He must leave by seven. → He has to leave by seven.','此处已知是在要求离开时间。'])),
g('rewrite-think','按128A目标表达推测','用I think he is probably…改写。',ctx(bank(['I think','he is','probably','busy','has to'],'I think he is probably busy',4),'The speaker infers that Ben is busy from the pile of work on his desk. Rewrite “He must be busy” in the Lesson 128A form.'),'教材用probably释义推测；这不是把“一定”和“大概”的确信程度规定成完全相等。','保留推测用途，按指定开头组织。',model(['She must be tired. → I think she is probably tired.','这里练表达推测，不把它改成必须疲倦。'])),
g('reply','按128B给出完整反驳','按例补齐反驳中的两种推测。',ctx(fill([blank('I don’t think so. She','be Italian.',['can’t','must']),blank('She','be Greek.',['must','can’t'])],['can’t','must']),'Practice premise: the speaker rejects Italian and feels sure Greek is right. Complete the reply to “I think she’s Italian.” This premise is supplied, not guessed from appearance.'),'先否定原判断，再表达给定的肯定推测；不是只否定Italian就自动证明Greek。','第二个判断有独立给定的前提。',model(['I don’t think so. He can’t be French. He must be Spanish.','练习前提已给出对Spanish的确信。'])),
g('plural','复数主语与原形','保留复数身份推测。',ctx(fill([blank('They must','Australian.',['be','are']),blank('They can’t','Canadian.',['be','is'])],['be','be']),'The speaker is sure the two visitors are Australian and rejects Canadian. Keep they as the subject in both sentences.'),'they后仍是must be／can’t be，不写must are。','be受前面的情态动词控制。',model(['We must be early.','They can’t be late.'])),
g('article','身份名词的冠词','补好两种职业表达。',ctx(fill([blank('She must be','engineer.',['an','a']),blank('He must be','dentist.',['a','an'])],['an','a']),'The occupations in these practice deductions are given: engineer and dentist. Choose the article from the initial sound.'),'engineer以元音音素开头，用an；dentist用a。不是根据职业猜性别。','看后面单词开头的发音。',model(['He must be an actor.','She must be a doctor.'])),
g('limits','数量上下限包含端点','两个表达包含相等的数量吗？',choice(['都包含4，但一个允许更多、一个允许更少','都不包含4','两个都只能恰好4'],'都包含4，但一个允许更多、一个允许更少',{context:'A: at least four cups\nB: not more than four cups'}),'at least four是4或更多；not more than four是4或更少。','“至少”和“不超过”各指哪一边？',model(['at least six：6或更多','not more than six：6或更少'])),
g('read-form','read词形与读音','按明确的过去和完成语境补词。',ctx(fill([blank('Yesterday, I','the notice.',['read','readed']),blank('I have already','the notice.',['read','readed'])],['read','read']),'Both sentences refer to reading the notice before now: one says yesterday, and one says have already.'),'read原形/riːd/；过去式与过去分词仍拼read，读/red/。此处只检验词形，发音由课堂听说核对。','三个词形的拼写是否一样？',model(['Every day I read. /riːd/','Yesterday I read. /red/'])),
g('negative-question','否定问句按事实回应','回答Isn’t he your teacher?。',ctx(fill([blank('Scene A:',' , he is.',['Yes','No']),blank('Scene B:',' , he isn’t.',['No','Yes'])],['Yes','No']),'Scene A: he is your teacher. Scene B: he is not your teacher. Both speakers ask, “Isn’t he your teacher?” Answer each according to the stated fact.'),'确实是用Yes, he is；不是用No, he isn’t。英语Yes／No按事实回应，不照中文“是／不是”逐词反转。','先确定每个场景是否真的是老师。',model(['Isn’t she your sister? Yes, she is.（确实是）','Isn’t she your sister? No, she isn’t.（不是）'])),
g('evidence','排除一种不自动证明另一种','只知道不是新帽子，能断言一定是我的旧帽子吗？',choice(['不能，还需要归属或其他线索','能，所有旧帽子都属于我','能，不是新的一定只有一个答案'],'不能，还需要归属或其他线索',{context:'The hat is not new. Nothing is known about its owner or which old hat it is.'}),'否定一个选项不自动证明指定的另一个；教材成对例句练句型，现实推断仍需依据。','还缺哪个事实？',model(['This can’t be Ann’s bag.','单凭这一句不能推出它一定是Ben的。'])),
g('stance','确信不是已证实','must be能保证判断永远正确吗？',choice(['不能，它表达说话人很确信的推断','能，使用must就等于核实过全部证据','能，别人的新线索都不必看'],'不能，它表达说话人很确信的推断',{context:'A speaker has some clues and says, “That must be Leo.” No one has checked the person’s name yet.'}),'推断可以有很高把握，仍可能因新线索修正；像Kate再看后会改变判断。','说话人的确信和核实是同一件事吗？',model(['I think it must be here.','新的信息可能改变这个判断。']))
];
unit.questions.apply=[
q('a-hat','结合颜色与独有标记辨认物品','这顶棕帽子应怎样描述？',choice(['It can’t be my new hat. It must be my old one.','It must be my new hat. It can’t be my old one.','All brown hats must be mine.'],'It can’t be my new hat. It must be my old one.',{context:'In this pretend lost-property record, you own two hats. Your new hat is blue. Your old hat is brown with your unique leaf mark. The found hat is brown with that same leaf mark.',image:image('hat-record'),imageAlt:'物品记录：NEW是蓝帽；OLD是有叶子标记的棕帽；FOUND也是同样标记的棕帽'}),'综合颜色、归属和独有标记判断，不能只看棕色就认定归你。'),
q('a-date','依给定日期完成成对推断','根据日期记录补两句。',ctx(fill([blank('It can’t be the','today.',['20th','21st']),blank('It must be the',' .',['21st','20th'])],['20th','21st']),'This story takes place in April. Yesterday was April 20. Read the record; today is the next day, not the date on your device.'),'依据故事中的昨天20日推到今天21日，不读取设备日期。'),
q('a-job','职业判断依据文字记录','按给定记录选择完整回应。',choice(['She can’t be a dentist. She must be an engineer.','She can’t be an engineer. She must be a dentist.','Her clothes prove her job.'],'She can’t be a dentist. She must be an engineer.',{context:'A verified staff record says: “Rosa designs bridges. Job: engineer.” The same record says she is not a dentist. Use the lesson’s paired deduction form.'}),'职业线索来自文字记录，冠词按发音选择；不凭衣服或性别猜。'),
q('a-action','正在进行的动作推测','按此刻的线索组句。',ctx(bank(['They','must','be','watching television','watch'],'They must be watching television',4),'You hear the television commentary from the next room and see both guests facing the screen through the open doorway. You infer what they are doing now. Use must be + -ing.'),'must be watching表达此刻正在做的推测，不改成一般习惯。'),
q('a-time','同一钟点下的不同说话目的','哪句是在推测地点？',choice(['B: He must be at the café at three.','A: He must be at the café at three.','两句都只能表示命令'],'B: He must be at the café at three.',{context:'A: A manager sets a rule: Ben is required to be at the café at three.\nB: It is three now. Ben’s message says he has arrived at the café, so Liz infers his location. Both use “He must be at the café at three.”'}),'同一句式和钟点也可能有不同用途；说话目的与事实前提决定这里的意义。'),
q('a-boundary','数量图与至少的边界','哪份记录符合at least four cups？',choice(['B和C','只有C','只有A'],'B和C',{context:'Each cup symbol stands for one cup. Record A has 3 cups, B has 4, C has 5. Choose every record that fits “at least four cups”.',image:image('cup-record'),imageAlt:'记录A有3个杯子符号，B有4个，C有5个'}),'至少4包括恰好4与更多的5，不包括3。'),
q('a-reply','保留复数与当前动作','按给定判断补完整回应。',ctx(fill([blank('I don’t think so. They can’t be',' .',['listening to the radio','watching television']),blank('They must be',' .',['watching television','listening to the radio'])],['listening to the radio','watching television']),'A: I think they’re listening to the radio.\nB’s premise: the radio is off; B sees the two people facing a television that is on and feels sure they are watching it. Give B’s reply.'),'保留they和正在做的含义，两个判断分别有材料支持。'),
q('a-reconsider','新线索到来时修正推测','看到新证据后，哪句回应合适？',choice(['Let me have another look. I think you’re right!','I used must, so I can never be wrong.','His appearance proves his age.'],'Let me have another look. I think you’re right!',{context:'At first you think the visitor is Ben. Your friend shows a name badge reading “Leo”; after another look, you agree that the visitor is Leo.'}),'新线索支持修正判断，像课文中再看一眼后的回应。')
];
unit.questions.exam=[
q('e-words','独立识别新词','配好三个新词。',match([['famous','著名的'],['read','通过阅读得知；读'],['at least','至少；不低于']]),'区分知名程度、信息来源和数量下限。'),
q('e-story','独立区分读到与推测','哪项忠实保留信息来源？',choice(['Liz读到29岁，又推测至少40岁','Karen本人确认至少40岁','Liz拿到了Karen的出生记录'],'Liz读到29岁，又推测至少40岁',{context:'Liz: I read she’s twenty-nine, but she must be at least forty.'}),'这是阅读所得与人物推测，不是身份核验。'),
q('e-polarity','独立作肯定与否定推断','补好两项有依据的推测。',ctx(fill([blank('This','be my notebook.',['must','can’t']),blank('That','be my notebook.',['can’t','must'])],['must','can’t']),'The first notebook has your unique name-and-star label, so you are sure it is yours. The other notebook belongs to a different named student; you are sure it is not yours.'),'分别按明确的归属线索表达确信和排除。'),
q('e-be','独立用be原形','完成推测句。',ctx(fill([blank('They must','at the station.',['be','are']),blank('She can’t','late.',['be','is'])],['be','be']),'The speaker is sure the group is at the station and sure she is not late. Keep the given subjects.'),'情态动词后保持be原形。'),
q('e-verb','独立推测实义动词','用must表达她一定知道路线。',ctx(bank(['She','must','know','the way','knows'],'She must know the way',4),'She designed this route and travels along it daily. You feel sure she knows the way. Use must.'),'must后接know，不加be或s。'),
q('e-cant-verb','独立否定实义动词推测','补好价格推测。',ctx(fill([blank('That pen can’t','a hundred pounds.',['cost','costs','be cost'])],['cost']),'A reliable receipt for this pen says five pounds. You strongly reject the claim that its price is a hundred pounds.'),'can’t cost的动词保持原形。'),
q('e-progress','独立推测正在进行的动作','用can’t表达此刻不可能在阅读。',ctx(bank(['He','can’t','be','reading','reads'],'He can’t be reading',4),'Ben is asleep now, with his eyes shut and a closed book beside him. Use can’t with the -ing form to reject the idea that he is reading now.'),'can’t be reading保留正在进行的含义。'),
q('e-must-meaning','独立区分相同形式的两种用途','哪项解释符合场景？',choice(['A是要求，B是推测','A与B都是已经完成的动作','A与B都只表示能力'],'A是要求，B是推测',{context:'A: The coach sets the rule, “You must be here at nine.”\nB: After hearing you have worked all day, I say, “You must be tired.”'}),'相同must在不同语境中承担不同意思。'),
q('e-negative-meaning','独立区分禁止和否定推测','完成两句不同用途的表达。',ctx(fill([blank('You','open this display.',['mustn’t','must']),blank('It','be Mary’s coat.',['can’t','mustn’t'])],['mustn’t','can’t']),'The museum rule forbids opening the display. In a separate situation, Mary’s coat is at her home, so the speaker rejects the idea that this coat is hers.'),'禁止用mustn’t；本课否定归属推测用can’t。'),
q('e-ability','独立区分能力与推测','哪句话是在谈不会游泳？',choice(['I can’t swim.','It can’t be my bag.','He must be at home.'],'I can’t swim.',{context:'One speaker never learned to swim. Another is rejecting a bag’s ownership. A third is inferring a location.'}),'can’t的含义要结合后面的表达与场景。'),
q('e-a-obligation','独立完成128A必要性改写','保留要求，使用has to。',ctx(bank(['He','has to','be at the office','early tomorrow','is probably'],'He has to be at the office early tomorrow',4),'The employer requires him at the office early tomorrow. Rewrite “He must be at the office early tomorrow” using has to.'),'这里明确是要求，不是推测他的去向。'),
q('e-a-deduction','独立完成128A推测改写','按指定形式表达同一种推测用途。',ctx(bank(['I think','he is','probably','an engineer','has to'],'I think he is probably an engineer',4),'The speaker infers his job and says, “He must be an engineer.” Use the Lesson 128A opening “I think he is probably…”.'),'按教材形式说明推测，不声称probably与must确信程度完全相同。'),
q('e-b-reply','独立完成128B反驳','补好两句推测。',ctx(fill([blank('I don’t think so. He','be English.',['can’t','must']),blank('He','be American.',['must','can’t'])],['can’t','must']),'Practice premise: the speaker rejects English and feels sure American is right. Reply to “I think he’s English.” These judgments are supplied for the exercise, not based on appearance.'),'否定和肯定推测都保留给定前提。'),
q('e-plural','独立保留复数对象','按两人的身份完成推测。',ctx(fill([blank('They can’t','Canadian.',['be','are']),blank('They must','Australian.',['be','is'])],['be','be']),'In this practice, the speaker rejects Canadian and feels sure both visitors are Australian.'),'they不改变情态动词后be的形式。'),
q('e-article','独立使用职业冠词','补好冠词。',ctx(fill([blank('He must be','actor.',['an','a']),blank('She must be','doctor.',['a','an'])],['an','a']),'The intended jobs are explicitly given: actor and doctor. Choose articles by the initial sounds.'),'actor前用an，doctor前用a。'),
q('e-lower','独立解释至少的边界','at least seven允许哪些数量？',choice(['7或更多','只允许大于7','只允许小于7'],'7或更多'),'至少包括给定下限7。'),
q('e-upper','独立解释不超过的边界','not more than seven允许7吗？',choice(['允许，也允许更少','不允许，只能少于7','只允许超过7'],'允许，也允许更少'),'不超过包括相等的7。'),
q('e-read','独立使用read过去词形','完成两个明确已发生的阅读句。',ctx(fill([blank('Last night I','that story.',['read','readed']),blank('She has already','the letter.',['read','readed'])],['read','read']),'One reading happened last night; the other has already happened. Use the past form and the past participle.'),'两个形式都拼read，读/red/；不写readed。'),
q('e-yes-no','独立按事实回答否定问句','按场景回答Isn’t she your sister?。',ctx(fill([blank('A:',' , she is.',['Yes','No']),blank('B:',' , she isn’t.',['No','Yes'])],['Yes','No']),'Scene A: the woman is your sister. Scene B: the woman is not your sister. Both questions are “Isn’t she your sister?”'),'Yes／No跟实际是否是妹妹或姐姐一致。'),
q('e-evidence','独立检查推理缺口','知道不是红伞，就能认定是我的黄伞吗？',choice(['不能，还缺颜色和归属依据','能，不是红色只能是黄色','能，所有黄伞都属于我'],'不能，还缺颜色和归属依据',{context:'Someone says, “This can’t be the red umbrella.” No other colour or ownership information is available.'}),'排除红色不自动确定黄色，更不证明归属。'),
q('e-stance','独立保留人物判断边界','哪项说法准确？',choice(['说话人很确信，但身份仍可能需要核实','must让身份变成不可能出错的事实','使用can’t以后就不能改变想法'],'说话人很确信，但身份仍可能需要核实',{context:'A person recognizes a coat and says, “That must be Leo.” The person’s name has not been checked.'}),'线索支持确信的推断，但不等于核验结果。'),
q('e-current','独立用现在动作回应','依据此刻材料选择回复。',choice(['They can’t be reading. They must be playing.','They can’t be playing. They must be reading.','They must plays every day.'],'They can’t be reading. They must be playing.',{context:'You can see both children running with a ball now. Their books are closed on the shelf. Use the lesson’s paired form to infer what they are doing now.'}),'保留复数they与现在正在进行的动作，不改成日常频率。')
];
unit.learning.REFERENCE=[
'must表示有较高把握的肯定推测，can’t表示很确信不可能。两者都说明说话人的判断，不保证事实已经核实；新线索可以使人改变看法。',
'must／can’t后接动词原形：must be、can’t be、must know、can’t cost；不随he／she加s，不加to。并非所有推测都要有be，know、live等可以直接接在后面。',
'推测正在进行的动作，用must be／can’t be + 动词-ing，例如must be sleeping。保留be，不改成must sleeps。过去事件的must have been／done是后续课目标，本单元不把它加成新关卡。',
'must在125–126课常表达必须，本课还表达一定是。He must be here at six可能是在规定到场时间，也可能是在根据线索推测六点的位置；先读情境，不靠at six或tomorrow单个词判定。',
'mustn’t在本单元的规则场景里是禁止；否定推断按教材用can’t。can’t也可表达能力不足，如can’t type，不能把所有can’t都解释成同一种推测。',
'128A保留has to与I think he is probably…两类改写目标。probably用于教材的推测释义，不规定它与must在确信程度上完全一样；原句缺少上下文时，课堂先明确采用“要求”还是“推测”的情境。',
'128B按给定替换词写I don’t think so.、can’t…、must…三句。替换词是这道句型练习提供的前提；不是只否定一个职业、国籍或年龄，就自动证明另一个。',
'本课的职业或国籍判断以文字资料、给定练习前提为依据，不凭衣服、面孔或性别推断。actor在课文指男演员，也可泛指演员；actress明确指女演员。',
'at least表示至少，包括最低数；not more than表示不超过，包括上限。at least forty不是恰好40，not more than twenty-nine也不等于严格小于29。',
'read的原形/riːd/，过去式和过去分词拼写仍为read，读/red/。词卡展示原形音标；课文I read she’s twenty-nine按过去读到的语境理解。无配音版本不以选择题冒充发音或听力验收。',
'Isn’t he…?等否定问句仍按事实回答：是用Yes, he is；不是用No, he isn’t。Doesn’t Karen Marsh look old!在这段课文是感叹；语气不能仅由否定形式决定。',
'课文中的年龄、婚姻顺序和外表评论是Kate与Liz的说法。保留原文和人物归属，不验证或夸大她们的猜测；没有出生年份、当前日期或当年学龄，不能计算真实年龄。',
'not that long ago里的that是“那么”，不是一个具体时间；beside her指在那位女士旁边，myself则强调说话人Liz自己。'
];
unit.learning.MODEL_TITLE='课本小参考 · 128课1–8';
unit.learning.VERB_FORMS=[['原形','read','/riːd/'],['过去式','read','/red/'],['过去分词','read','/red/']];
unit.learning.STRUCTURE_MODELS=[['用途','形式','例子'],['肯定推测','must + 动词原形','She must know him.'],['否定推测','can’t + 动词原形','It can’t cost that much.'],['身份或状态','must be / can’t be','He must be tired.'],['正在进行的动作','must be / can’t be + 动词-ing','They must be sleeping.'],['要求或必要','must / have to','He has to be here by six.'],['禁止','mustn’t + 动词原形','You mustn’t open it.']];
unit.learning.MODELS=[
['1 · He can’t be ill. He must be tired.','他不可能病了。他一定是累了。','tired'],
['2 · It can’t be my new hat. It must be my old one.','它不可能是我的新帽子。它一定是我的旧帽子。','hat'],
['3 · She can’t be Danish. She must be Swedish.','她不可能是丹麦人。她一定是瑞典人。','swedish'],
['4 · He can’t be a dentist. He must be a doctor.','他不可能是牙医。他一定是医生。','dentist'],
['5 · She can’t be forty. She must be fifty.','她不可能40岁。她一定50岁了。','age'],
['6 · It can’t be the 20th. It must be the 21st.','不可能是20日。一定是21日。','date'],
['7 · He can’t be the youngest. He must be the oldest.','他不可能是最年轻的。他一定是最年长的。','group'],
['8 · He can’t be reading. He must be sleeping.','他不可能在读书。他一定在睡觉。','sleeping']
].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 区分要求与推测后改写',answerLines:1,instruction:'每题一句，用has to或I think he is probably…改写，保留原编号。按本页练习情境：1、3、6是到场或行程要求，2、4、5、7是人物推测；这些意图由练习给定，不能仅凭钟点、tomorrow或next week判定。probably是教材释义形式，不表示把握程度完全相等。',examples:['He must be home before six o’clock. → He has to be home before six o’clock.','He must be tired. → I think he is probably tired.'],items:['He must be here at six o’clock.','He must be busy.','He must be at the office early tomorrow.','He must be sleeping.','He must be French.','He must be in France next week.','He must be an engineer.']},
{title:'B · 按给定前提作三句回应',answerLines:3,instruction:'每题三句，依次写I don’t think so.、can’t…、must…，每句一行。括号是练习给定的新判断前提，保留单复数、冠词、数量范围和正在做的形式；不凭外貌推测职业、国籍或年龄，也不把否定一种说法当成另一种说法的充分证据。',examples:['I think she’s Danish. (Swedish) → I don’t think so. She can’t be Danish. She must be Swedish.'],items:['I think she’s Italian. (Greek)','I think he’s English. (American)','I think they’re Canadian. (Australian)','I think he’s a mechanic. (engineer)','I think he’s a bus conductor. (bus driver)','I think he’s a sales rep. (the boss)','I think he’s twenty-four. (thirty)','I think they’re five. (seven)','I think he’s seventy-six. (over eighty)','I think she’s fifty-five. (under fifty)','I think it’s the 21st today. (20th)','I think it’s Tuesday today. (Wednesday)','I think it’s the 2nd today. (3rd)','I think it’s cheap. (expensive)','I think it’s easy. (difficult)','I think she’s old. (young)','I think they’re early. (late)','I think he’s reading. (sleeping)','I think they’re listening to the radio. (watching television)','I think she’s retiring. (looking for a new job)']}
];
core.unit127128=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
