(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit133-134/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页270–273／PDF303–306',grammarSource='《同步导学》Grammar纸页222／PDF236；《语法练习册》纸页390–395／PDF404–409';
const rows=[['reporter','记者','/rɪˈpɔːtə/','reporter'],['sensational','爆炸性的；耸人听闻的','/senˈseɪʃənəl/','sensational'],['mink coat','貂皮大衣','/ˈmɪŋk kəʊt/','coat'],['wonder','想知道；感到好奇（本句）','/ˈwʌndə/','wonder'],['retire','退休','/rɪˈtaɪə/','retire'],['film','电影','/fɪlm/','film'],['newspaper','报纸','/ˈnjuːzpeɪpə/','newspaper'],['airport','机场','/ˈeəpɔːt/','airport-icon'],['dress','连衣裙（本课名词）','/dres/','dress'],['another','另一个；再一个','/əˈnʌðə/','another'],['tired','疲倦的','/ˈtaɪəd/','tired'],['for a long time','很长一段时间','/fər ə lɒŋ taɪm/','long-time']];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit133-134',version:1,contentRevision:'news-report-v1',mode:'classroom',title:'机场采访与一份报纸',path:'/unit133-134/',start:'learn/words',progress:{learningKey:'canran:unit133-134:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识采访与读报的词语',activities:[['words','新闻小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'读懂采访与报纸',activities:[['text','采访与读报小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'把别人的话转述清楚',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'核对报道里的信息',activities:[['apply','报道小编辑','give']],required:['apply']},
{id:'l5',title:'完成转述挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'newspaper',storyQuestion:'What reasons did Karen Marsh give for wanting to retire?（Karen Marsh说她为什么想要退休？）',completionTitles:{listen:'新闻词语认清啦！',roles:'采访和报纸读懂啦！',grammar:'转述的方法学会啦！',apply:'报道的信息核对好啦！',exam:'转述挑战完成！'},reward:{edition:'news-report-v1',title:'转述小编辑',lesson:'Lesson 133–134',scene:'/assets/unit133-134/keepsake-story-v1.webp',alt:'Kate与Liz一起读报，报纸刊载Karen Marsh的机场采访',color:'#526b7b',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','报道小编辑'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={reporter:'Reporter',marsh:'Miss Marsh',kate:'Kate',liz:'Liz'};
// Six original turns, split into fourteen complete reading steps.
unit.learning.DIALOGUE=[
['reporter','Have you just made a new film, Miss Marsh?','Marsh小姐，您刚拍完一部新电影吗？',1],
['marsh','Yes, I have.','是的，我刚拍完。',2],
['reporter','Are you going to make another?','您准备再拍一部吗？',3],
['marsh','No, I’m not. I’m going to retire.','不，我不准备再拍了。我准备退休。',4],
['marsh','I feel very tired. I don’t want to make another film for a long time.','我觉得很疲倦。我很长一段时间都不想再拍电影了。',4],
['kate','Let’s buy a newspaper, Liz. Listen to this!','Liz，我们买份报纸吧。听听这一段！',5],
['kate','‘Karen Marsh: Sensational News! By our reporter, Alan Jones.','“Karen Marsh：爆炸性新闻！由本报记者Alan Jones报道。',5],
['kate','Karen Marsh arrived at London Airport today.','Karen Marsh今天到达伦敦机场。',5],
['kate','She was wearing a blue dress and a mink coat.','她穿着一条蓝色连衣裙和一件貂皮大衣。',5],
['kate','She told me she had just made a new film.','她告诉我，她刚拍完一部新电影。',5],
['kate','She said she was not going to make another.','她说她不准备再拍一部。',5],
['kate','She said she was going to retire.','她说她准备退休。',5],
['kate','She told reporters she felt very tired and didn’t want to make another film for a long time.’','她告诉记者，她觉得很疲倦，很长一段时间都不想再拍电影。”',5],
['liz','I wonder why!','我很想知道为什么！',6]
].map(([who,text,cn,sourceTurn],i)=>({id:'u133134-line'+(i+1),who,text,cn,sourceTurn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines}),ctx=(input,context)=>({...input,context});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u133134-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-new','识别课本三个新词','配好三个新闻词语。',match([['reporter','记者'],['sensational','爆炸性的；耸人听闻的'],['mink coat','貂皮大衣']]),'sensational是标题的形容词，不证明每一种猜测都是真的。'),
q('v-wonder','wonder在原句的动词含义','I wonder why! 中wonder表示什么？',choice(['想知道；感到好奇','已经知道全部原因','在奇迹旁边'],'想知道；感到好奇',{context:'Liz reads the report and says, “I wonder why!”'}),'这里是动词“想知道”，不是名词“奇迹”。'),
q('v-paper','词义与物品对应','哪个词表示报纸？',choice(['newspaper','film','mink coat'],'newspaper',{optionImages:{newspaper:image('newspaper'),film:image('film'),'mink coat':image('coat')}}),'newspaper是报纸，film是电影，mink coat是大衣。'),
q('v-retire','retire词义定位','点出表示“退休”的词。',{type:'locate',fragments:['I’m going to ',{value:'retire'},'. I feel ',{value:'tired'},'.'],options:['retire','tired'],answer:'retire'},'retire是退休，tired是疲倦。'),
q('v-another','another保留再一个含义','another指什么？',choice(['另一部电影','另一位记者','已经确定的退休日期'],'另一部电影',{context:'Reporter: Have you just made a new film?\nReporter: Are you going to make another?'}),'another承接前文film。'),
q('v-phrase','时间短语的完整含义','for a long time在这里表示什么？',choice(['很长一段时间','只在此刻的一秒','一个已经给定的日期'],'很长一段时间',{context:'I don’t want to make another film for a long time.'}),'没有给出具体天数，也不等于永远。')
];
unit.questions.roles=[
q('r-film','区分刚完成的电影与下一部','Marsh小姐刚做完什么？',choice(['拍完一部新电影','已经拍完所有未来电影','买完一份报纸'],'拍完一部新电影',{context:'Reporter: Have you just made a new film, Miss Marsh?\nMiss Marsh: Yes, I have.'}),'Yes回应刚拍完新电影，不等于已退休。'),
q('r-plan','计划不等于完成','哪项准确保留她的话？',choice(['她说准备退休，不打算马上再拍一部','她已经办理了退休并离开机场','记者已经宣布她永远不能拍片'],'她说准备退休，不打算马上再拍一部',{context:'No, I’m not. I’m going to retire. I feel very tired. I don’t want to make another film for a long time.'}),'保留计划和时间限度，不补手续或已发生结局。'),
q('r-reason','回答原文开场问题','她给出的理由是什么？',choice(['觉得很疲倦，长时间不想再拍电影','Liz命令她离开','记者说她丢了机票'],'觉得很疲倦，长时间不想再拍电影',{context:'I feel very tired. I don’t want to make another film for a long time.'}),'只用她明确说出的理由，不添加家庭或职业猜测。'),
q('r-reader','分清读报人与报道作者','谁正在把报纸读给Liz听？',choice(['Kate','Alan Jones','Miss Marsh'],'Kate',{context:'Kate: Let’s buy a newspaper, Liz. Listen to this! “Karen Marsh: Sensational News! By our reporter, Alan Jones.”'}),'Kate读的是Alan Jones署名的报道。'),
q('r-me','嵌套引语中的me属于报道作者','报道里“She told me”的me指谁？',choice(['写这篇报道的Alan Jones','读报的Kate','听报的Liz'],'写这篇报道的Alan Jones',{context:'Kate is reading the newspaper aloud: “By our reporter, Alan Jones. ... She told me she had just made a new film.”'}),'me保留报纸作者的视角，不因Kate朗读而变成Kate。'),
q('r-place','保留报道中的到达地点','报道说她到了哪里？',choice(['London Airport','Kate的家','电影院售票处'],'London Airport',{context:'Karen Marsh arrived at London Airport today.'}),'地点是伦敦机场，today按报道时间理解。'),
q('r-clothes','保留两件衣物及颜色','报道描写了什么衣着？',choice(['蓝色连衣裙和貂皮大衣','蓝色大衣和红色裙子','只提到一顶帽子'],'蓝色连衣裙和貂皮大衣',{context:'She was wearing a blue dress and a mink coat.'}),'blue修饰dress，不转移给coat，也不漏掉另一件衣物。'),
q('r-said','转述保留否定与意愿','报纸是否说她想马上再拍一部？',choice(['没有，报道保留不想再拍的意思','有，didn’t表示非常想拍','有，tired表示已订好下一部'],'没有，报道保留不想再拍的意思',{context:'She told reporters she felt very tired and didn’t want to make another film for a long time.'}),'didn’t want是否定意愿。'),
q('r-ending','疑问不等于揭晓隐藏原因','Liz最后一句证明了什么？',choice(['她想知道为什么，原文没有揭晓其他原因','她已经调查出结婚计划','她已经替Marsh作了决定'],'她想知道为什么，原文没有揭晓其他原因',{context:'Liz: I wonder why!'}),'好奇不是已知答案，不从下一课补本课结局。')
];
unit.questions.grammar=[
g('state','按要求转述当时状态','按本题要求回移时态，选择转述。',choice(['He said he was tired.','He said I was tired.','He said he were tired.'],'He said he was tired.',{context:'Ben said, “I am tired.” Later, a reporter retells Ben’s words. Use past-tense backshift for this exercise; I refers to Ben.'}),'I对应Ben，am按本题要求回移为was。','是谁说自己累？',model(['Anna said, “I am busy.” → Anna said she was busy.','先认清说话人，再按任务要求回移。'])),
g('simple','一般现在时与否定回移','按指定回移形式补好两句。',ctx(fill([blank('He said he','coffee.',['wanted','wants']),blank('She said she','tea.',['didn’t want','doesn’t wanted'])],['wanted','didn’t want']),'Ben: “I want coffee.” Anna: “I don’t want tea.” Later reporting: use past-tense backshift and preserve the different meanings.'),'want→wanted；don’t want→didn’t want，didn’t后保留原形。','否定有没有保留下来？',model(['“I like it.” → She said she liked it.','“I don’t like it.” → He said he didn’t like it.'])),
g('progress','现在进行时回移','按要求转述当时正在做的事。',ctx(bank(['She said','she','was reading','is read'],'She said she was reading',3),'Anna said, “I am reading.” Report her ongoing activity at that time, using past-tense backshift.'),'am reading→was reading，保留进行含义。','当时正在做，还是已经完成？',model(['“We are working.” → They said they were working.','保留be与-ing。'])),
g('future','will回移为would','按要求转述将来打算。',ctx(fill([blank('He said he','come.',['would','will would','had'])],['would']),'Ben said, “I will come.” Report his words with backshift. This does not say that his visit has already happened.'),'will→would；would come不是had come。','在说以后，还是已经到达？',model(['“I will help.” → She said she would help.','不把未来变成已发生。'])),
g('perfect','现在完成时回移','按要求转述已完成的事。',ctx(fill([blank('She said she','finished.',['had','has had','was'])],['had']),'Anna said, “I have finished.” Report her words using backshift to past perfect.'),'have finished→had finished。','完成结构需要哪个助动词？',model(['“I have lost my key.” → He said he had lost his key.','have／has加过去分词，回移为had加过去分词。'])),
g('past','一般过去时按要求回移','用过去完成时转述原来的过去动作。',ctx(fill([blank('She said she','Lucy.',['had called','had call','has called'])],['had called']),'Anna said, “I called Lucy.” This exercise specifically asks you to backshift called to past perfect.'),'本题要求called→had called；不称所有语境中保留过去时都错。','had后使用哪种词形？',model(['“I saw Tom.” → He said he had seen Tom.','see—saw—seen。'])),
g('say-tell','said与told的对象结构','按现有句子结构补词。',ctx(fill([blank('He','me he was busy.',['told','said']),blank('He','to me that he was busy.',['said','told'])],['told','said']),'Both sentences report Ben’s words to the same listener. Keep me and to me exactly as printed.'),'转述内容用told me或said to me，不直接said me或told to me。','空后有没有to？',model(['She said she was tired.','She told us she was tired.'])),
g('person','人称依说话人与听话人','从旁观者角度转述。',ctx(fill([blank('Tom told Anna that','liked the book.',['she','he']),blank('Anna told Tom that','had finished it.',['she','he'])],['she','she']),'Tom said to Anna, “You like the book.” Anna said to Tom, “I have finished it.” A different reporter retells both statements with backshift. Tom uses he/him; Anna uses she/her.'),'第一句you和第二句I都指Anna；不能见you就换成me。','I和you分别是谁？',model(['Ben said to Sue, “You are busy.” → Ben told Sue she was busy.','原说话人自己转述时，I仍是I；人称跟着实际对象变化。'])),
g('plural','保留复数与物主关系','按要求保留两人的话。',ctx(fill([blank('They said','wanted',['they','he']),blank('','dinner.',['their','his'])],['they','their']),'Two children said, “We want our dinner.” Someone outside that group reports them with backshift.'),'We→they、our→their，保留群体和归属。','说话的是一个人还是两个人？',model(['“We have finished our work.” → They said they had finished their work.','不是转述者自己的工作。'])),
g('going','保留be going to的计划含义','按原结构回移，保持计划尚未完成。',ctx(bank(['She said','she','was going to','retire','had retired'],'She said she was going to retire',4),'Miss Marsh: “I’m going to retire.” Preserve be going to and use backshift. There is no statement that retirement has already happened.'),'am going to→was going to，不改成had retired。','原话说计划，还是完成结果？',model(['“I’m going to leave.” → He said he was going to leave.','没有说明后来是否成行。'])),
g('time','按日期而非机械替换时间词','选出保留原事件日期的表达。',choice(['on 9 May','on 11 May','on 12 May'],'on 9 May',{context:'On 10 May, Anna said, “I called Lucy yesterday.” On 12 May, Ben reports that conversation. Anna said she had called Lucy ___ . Keep the date of the original call.'}),'原话yesterday指5月9日，不是转述当天的昨天。','原话是在几号说的？',model(['On 3 June: “I arrived yesterday.” → On 5 June: She said she had arrived on 2 June.','时间词变化不能改变事件日期。'])),
g('that','that可保留或省略','哪项说明准确？',choice(['两种都可以，that在这些转述句中可省略','只有没有that的句子正确','that一省略就变成疑问句'],'两种都可以，that在这些转述句中可省略',{context:'He said that he was tired.\nHe said he was tired.\nBoth report the same statement.'}),'本结构中的that通常可省略，不把两种合法形式互判错。','两句的人物和事情变了吗？',model(['She told me that she was busy.','She told me she was busy.'])),
g('valid','回移规则有适用语境','回移是否意味着所有事实现在都相反？',choice(['不是；仍然成立时也可保留现在时，要看语境','是；was就证明现在一定不是','是；所有报道都必须改每一个词'],'不是；仍然成立时也可保留现在时，要看语境',{context:'Anna said, “I live in London.” She still lives there when Ben reports her words. Ben can say she lives in London; a backshifted report can also focus on what she said then.'}),'真实转述可根据仍然成立的事实不回移；回移也不自动否定现在。','她搬家了吗？',model(['“I work here.” may remain true when reported.','按事实和转述角度选时态。'])),
g('reverse','过去完成时不能唯一还原原话','仅凭转述能确定她逐字说过哪句吗？',choice(['不能，两种原话都可能回移到had finished','能，一定只可能是have finished','能，一定只可能是finished'],'不能，两种原话都可能回移到had finished',{context:'Report: She said she had finished.\nPossible original A: “I have finished.”\nPossible original B: “I finished.”\nNo recording or original tense is supplied.'}),'两种时态都可能回移成过去完成；需要原时态或原录音才能限定原句。','两个来源会不会合到同一个形式？',model(['“I have seen it.” / “I saw it.” can both lead to had seen it.','转述不保证能恢复逐字原话。'])),
g('question','导学原例保留间接问句语序','按已给定对象转述这个问题。',ctx(bank(['He asked me','where','I had been','had I been'],'He asked me where I had been',3),'He asked me, “Where have you been?” I am the person he asked. Use backshift and keep the reported question inside the sentence.'),'间接问句用where I had been的陈述语序。','where后仍要直接问句倒装吗？',model(['“Where are you?” → She asked me where I was.','本例you指我。']))
];
unit.questions.apply=[
q('a-source','区分人物原话与作者叙述','编辑摘录里，Karen原话中的“I”指谁？',choice(['Karen Marsh','Alan Jones','Kate'],'Karen Marsh',{context:'Fictional edited excerpt: Alan Jones writes, Karen Marsh said, “I feel very tired.” Kate reads this excerpt aloud to Liz. Interpret I inside Karen’s own quotation.',image:image('source-record'),imageAlt:'摘录关系：Karen Marsh说原话，Alan Jones写摘录，Kate读给Liz听'}),'这里的I属于被直接引用的Karen；与作者叙述中的me不同，不能把所有第一人称都固定交给作者。'),
q('a-person','本人转述保留第一人称','转述自己说过的话，按要求回移时态。',ctx(bank(['I told Sue','I','was','busy','he'],'I told Sue I was busy',4),'Yesterday I said to Sue, “I am busy.” Now I report my own words, using past-tense backshift. Begin with I told Sue.'),'原说话人和转述者是同一个我，因此I仍用I，不为了转述机械换成he。'),
q('a-calendar','转述时间不随朗读日漂移','报道中的today指哪一天？',choice(['10 May','12 May','9 May'],'10 May',{context:'Fictional record: Alan writes on 10 May: “Karen arrived today.” Kate reads the unchanged article on 12 May. Which day does today in the article refer to?',image:image('date-record'),imageAlt:'虚构日期记录：10 May写报道，原句Karen arrived today；12 May读同一篇原文'}),'引用原文保留作者时间，不改成朗读者当天。'),
q('a-negative','转述否定意愿不改变原意','用指定回移形式组句。',ctx(bank(['She said','she','didn’t want','another film','wanted'],'She said she didn’t want another film',4),'Anna said, “I don’t want another film.” Report her words with backshift; do not reverse her preference.'),'didn’t want保留否定。'),
q('a-two','复合信息分别回移','两部分都要保留。',ctx(fill([blank('He said he','read a lot and',['had','was']),blank('he','still reading.',['was','had'])],['had','was']),'Ben said, “I have read a lot, and I am still reading.” Use backshift for both clauses; keep the completed amount and ongoing action.'),'had read保留已读数量，was still reading保留当时仍在读。'),
q('a-past','转述过去动作并保留归属','按要求回移这条记录。',ctx(fill([blank('Anna said','son had',['her','my']),blank('','back.',['come','came'])],['her','come']),'Anna said, “My son came back.” Another reporter retells her words. Use past perfect and preserve whose son he is. Anna uses she/her.'),'my指Anna，转述用her；came回移为had come。'),
q('a-next','根据原话选择恰当下一句','哪句话接得上这个问题？',choice(['He told me he had lost his key.','He told me he will lost my key.','He said me he lost her newspaper.'],'He told me he had lost his key.',{context:'Tom told me, “I have lost my key.” Later a friend asks, “What did Tom tell you?” Reply with backshift and the same owner.'}),'保留told me、Tom的钥匙与完成动作。'),
q('a-quote','避免把转述伪装成唯一原话','编辑能把哪项当作已核实的逐字引语？',choice(['都不能，仅有转述还不足以确定逐字原话','一定是“I have finished.”','一定是“I finished.”'],'都不能，仅有转述还不足以确定逐字原话',{context:'The only note is: Anna said she had finished. There is no original recording and no information about which tense Anna used.'}),'没有原话证据时，不加引号冒充逐字引用。')
];
unit.questions.exam=[
q('e-words','独立识别本课新词','配好三个新闻词语。',match([['reporter','记者'],['sensational','爆炸性的；耸人听闻的'],['mink coat','貂皮大衣']]),'三个词意义不同。'),
q('e-state','独立回移一般现在时','按要求转述状态。',ctx(fill([blank('Anna said she','busy.',['was','were','had'])],['was']),'Anna said, “I am busy.” Another person reports her words with past-tense backshift.'),'am回移为was。'),
q('e-negative','独立回移肯定与否定','保留两人不同的意愿。',ctx(fill([blank('Ben said he','tea.',['wanted','want']),blank('Sue said she','coffee.',['didn’t want','didn’t wanted'])],['wanted','didn’t want']),'Ben: “I want tea.” Sue: “I don’t want coffee.” Use past-tense backshift without changing either preference.'),'didn’t后保留原形。'),
q('e-progress','独立回移进行形式','转述当时正在发生的动作。',ctx(bank(['They said','they','were working','had work'],'They said they were working',3),'Two people said, “We are working.” Someone outside the group reports this with backshift.'),'保留复数和进行意义。'),
q('e-future','独立回移will','保留从过去看将来的意思。',ctx(fill([blank('She said she','help.',['would','had','will would'])],['would']),'Sue said, “I will help.” Use backshift; no later outcome is known.'),'would help不证明已经帮助过。'),
q('e-perfect','独立回移现在完成时','按要求转述已完成的动作。',ctx(fill([blank('He said he','lost his key.',['had','was','has had'])],['had']),'Ben said, “I have lost my key.” Use past-perfect backshift.'),'have lost→had lost。'),
q('e-past','独立回移一般过去时','用指定过去完成时转述。',ctx(fill([blank('She said she had','Tom.',['seen','saw','see'])],['seen']),'Sue said, “I saw Tom.” This exercise asks you to backshift saw to past perfect.'),'had后seen，不用saw。'),
q('e-say-tell','独立使用said与told','按给定的对象结构补词。',ctx(fill([blank('She','us she was ready.',['told','said']),blank('She','to us that she was ready.',['said','told'])],['told','said']),'Both sentences report the same statement. Keep us and to us as printed.'),'told us与said to us。'),
q('e-person','独立确认I与you的实际对象','按人物关系填人称。',ctx(fill([blank('Sue told Ben that','was tired.',['he','she']),blank('I told Ben that','was busy.',['I','he'])],['he','I']),'Sue said to Ben, “You are tired.” I said to Ben, “I am busy.” Now I report both statements with backshift. Sue uses she/her; Ben uses he/him.'),'第一句you指Ben，转述为he；第二句是我转述自己的话，I保持I。'),
q('e-plural','独立保留复数与所属','按要求转述这个小组的话。',ctx(fill([blank('They said','had finished',['they','she']),blank('','work.',['their','her'])],['they','their']),'Two students said, “We have finished our work.” A person outside the group reports this with backshift.'),'we与our都指原小组。'),
q('e-going','独立保留尚未完成的计划','保持原结构并回移时态。',ctx(bank(['He said','he','was going to','leave','had left'],'He said he was going to leave',4),'Ben said, “I’m going to leave.” Preserve be going to. There is no evidence that he left.'),'was going to leave不是had left。'),
q('e-time','独立保留原报道的日期','原文里的today是哪天？',choice(['6 June','8 June','5 June'],'6 June',{context:'Sue writes on 6 June: “Ben arrived today.” Anna reads that same unchanged article on 8 June. Interpret today inside the original article.'}),'原文today以写报道当天为参照。'),
q('e-that','独立判断that的可省略性','哪种判断正确？',choice(['两句都能转述同一个陈述','第二句一定少了必需的that','第一句是疑问句'],'两句都能转述同一个陈述',{context:'She told me that she was ready.\nShe told me she was ready.'}),'本结构的that通常可省略。'),
q('e-valid','独立判断回移的适用范围','材料能推出哪项？',choice(['她仍住那里，转述可按语境保留现在时','只要用了said就证明她搬家了','任何转述都必须改变所有时间词'],'她仍住那里，转述可按语境保留现在时',{context:'Sue said, “I live in York.” She still lives in York when Ben reports the statement.'}),'回移不等于现在事实相反。'),
q('e-reverse','独立辨别反推原话的歧义','仅凭转述可以确定原话时态吗？',choice(['不能，have seen和saw都可能回移成had seen','只能是have seen','只能是saw'],'不能，have seen和saw都可能回移成had seen',{context:'The only record is: Ben said he had seen it. No recording or original tense is available.'}),'多个来源不能判成唯一原句。'),
q('e-question','独立保留间接问句语序','按给定对象和回移要求组句。',ctx(bank(['She asked me','where','I had been','had I been'],'She asked me where I had been',3),'She asked me, “Where have you been?” I am the listener. Report that question with backshift.'),'where后用陈述语序。'),
q('e-source','独立区分报道作者与朗读者','引用中的me指谁？',choice(['Alan Jones','Kate','Liz'],'Alan Jones',{context:'Kate reads Alan Jones’s newspaper report to Liz: “She told me she had just made a new film.” The article is signed by Alan Jones.'}),'me仍是署名作者的视角。'),
q('e-intent','独立保留计划与时间限度','哪项忠实于Marsh的话？',choice(['她准备退休，长时间不想再拍片；没有说已退休或永远不拍','她已经退休并永远不能拍片','她已经同意明天开拍'],'她准备退休，长时间不想再拍片；没有说已退休或永远不拍',{context:'I’m going to retire. I don’t want to make another film for a long time.'}),'不把计划升级为已完成，不把长时间改为永远。'),
q('e-wonder','独立保留好奇与已知事实的区别','哪项最准确？',choice(['Liz想知道为什么，没有给出另一个已证实的原因','Liz已经知道隐情并公布出来','wonder在本句只能是名词奇迹'],'Liz想知道为什么，没有给出另一个已证实的原因',{context:'At the end Liz says, “I wonder why!” No further explanation follows in Lesson 133.'}),'wonder是想知道，不用下一课情节回答本课。')
];
unit.learning.REFERENCE=[
'转述先看谁说、对谁说、由谁转述。I是原说话人，you是原听话人；we与our还要保留群体与归属。原说话人自己转述时，I保持I；没有说明对象时，不机械替换成固定人称。',
'本课按导学练时态回移：一般现在→一般过去；现在进行→过去进行；will→would；现在完成→过去完成；一般过去按指定任务→过去完成。仍要保留否定、进行、完成和将来的意义。',
'said／told后转述陈述内容可用that，也通常可省略。用said that...、said to someone that...、told someone that...；不写said me或told to me。tell a story等固定搭配另有结构，不推广成一切tell都必须带人。',
'didn’t后仍用原形：didn’t want。过去完成时用had加过去分词，如had seen、had come、had made；不随he／she改has。',
'be going to保留原结构：am going to retire→was going to retire。转述计划不证明已退休；will→would也不说明后来已经发生。',
'回移是常见选择，不是所有句子必须改时态的绝对命令。事实仍然成立或仍相关时，可按语境保留现在时；was也不自动证明现在已经不是。指定形式的练习明确任务条件。',
'日期以原话和转述的实际时间为依据。直接读报时，today仍按报道当天理解，不随朗读日或设备日期漂移。改写时间词不能改变事件日期。',
'have finished与finished都可能回移成had finished。只看转述不能唯一还原原话时态；反向练习需给定原时态，否则接受合适的多种表达，不冒称逐字原话。',
'导学原例：“Where have you been these days?” he asked. → He asked me where I had been those days. 此处补足听话人就是me的前提；间接问句用where I had been，不用直接问句倒装。',
'Kate朗读署名Alan Jones的报道；She told me里的me属于报道作者，不因Kate读出而变成Kate。读报者、文章作者、被采访者需要分清。',
'Marsh说觉得疲倦，长时间不想再拍片。for a long time不等于forever。Liz的I wonder why!表达好奇，不证明其他原因，不引入下一课剧情。',
'134A第5题保留Who bought a newspaper?原题。课文写Kate提议购买，随后读报，没有逐字说明谁付钱。课堂可按教材预期回答Kate，同时区分直接陈述与情节推断，不把付款人设成线上唯一事实题。',
'本单元为无配音课堂配套版。阅读和词形选择不替代教师发音、听辨、转述口语和开放书写评价。'
];
unit.learning.MODEL_TITLE='课本小参考 · 134课1–12';
unit.learning.VERB_FORMS=[['原形','say','/seɪ/'],['过去式','said','/sed/'],['过去分词','said','/sed/'],['原形','tell','/tel/'],['过去式','told','/təʊld/'],['过去分词','told','/təʊld/']];
unit.learning.STRUCTURE_MODELS=[['原话形式','指定回移','保留的意思'],['am / is / are; want','was / were; wanted','当时的状态与意愿'],['am / is / are reading','was / were reading','当时正在读'],['will come','would come','从过去看将来'],['have / has finished','had finished','已完成'],['called / saw','had called / had seen','原话之前发生的动作'],['am going to retire','was going to retire','当时的退休计划']];
unit.learning.MODELS=[['1 · I’m tired.','我很累。','tired'],['2 · What did he say? What did he tell you?','他说了什么？他告诉了你什么？','wonder'],['3 · He said (that) he was tired. He told me (that) he was tired.','他说／告诉我，他很累。','reporter'],['4 · I’m reading.','我正在读书。','reading'],['5 · What did she say? What did she tell you?','她说了什么？她告诉了你什么？','wonder'],['6 · She said (that) she was reading. She told me (that) she was reading.','她说／告诉我，她当时在读书。','reading'],['7 · We want our dinner.','我们想吃晚饭。','dinner'],['8 · What did they say? What did they tell you?','他们说了什么？他们告诉了你什么？','wonder'],['9 · They said (that) they wanted their dinner. They told me (that) they wanted their dinner.','他们说／告诉我，他们想吃晚饭。','dinner'],['10 · I’ve finished my homework.','我做完作业了。','finished'],['11 · What did he say? What did he tell you?','他说了什么？他告诉了你什么？','wonder'],['12 · He said (that) he had finished his homework. He told me (that) he had finished his homework.','他说／告诉我，他已经做完作业了。','finished']].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 根据133课回答',answerLines:[1,1,1,2,2,1,1],instruction:'保留原题7题，按课文回答。第4题留两行说明理由。第5题留两行，回答后说明依据是直接陈述还是情节推断，不增加付款细节。其余各留一行。',examples:[],items:['Has Miss Marsh just made a new film?','Who was asking her questions?','What is Miss Marsh going to do?','Why doesn’t Miss Marsh want to make another film?','Who bought a newspaper?','Where did Miss Marsh arrive?','What was Miss Marsh wearing?']},
{title:'B · 用said转述',answerLines:1,instruction:'每题写一句。沿用原例回移时态，保留陈述内容；题中he／she是原说话人，原话第三人称不擅自换成说话人。',examples:['I’m tired. — What did he say? → He said he was tired.'],items:['I’m busy. — What did he say?','She’s cold. — What did he say?','The book’s interesting. — What did she say?','They’re hungry. — What did she say?']},
{title:'C · 用told me转述正在做的事',answerLines:1,instruction:'每题写一句。按原例回移进行时，保留-ing；you在这些问答中是作答者本人，因此回答told me。',examples:['I’m reading. — What did he tell you? → He told me he was reading.'],items:['I’m working. — What did he tell you?','She’s leaving. — What did they tell you?','They’re joking. — What did she tell you?','Tom’s waiting. — What did he tell you?']},
{title:'D · 用told me转述已完成的事',answerLines:1,instruction:'每题写一句。按原例把现在完成时回移为过去完成时；保留人物、事物与代词，不另编身份。',examples:['I’ve finished. — What did he tell you? → He told me he had finished.'],items:['I’ve met him. — What did he tell you?','I’ve lost it. — What did he tell you?','It has stopped. — What did she tell you?','She has arrived. — What did they tell you?']}
];
core.unit133134=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
