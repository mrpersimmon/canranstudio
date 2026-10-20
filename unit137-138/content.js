(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit137-138/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页278–281／PDF311–314',grammarSource='《同步导学》Grammar纸页226／PDF240；《语法练习册》纸页401–406／PDF415–420';
const rows=[['football','足球','/ˈfʊtbɔːl/','football'],['pool','赌注（本课用法）','/puːl/','pool'],['win','赢','/wɪn/','win'],['world','世界','/wɜːld/','world'],['poor','贫穷的','/pɔː/','poor'],['depend','依靠；取决于（常与on连用）','/dɪˈpend/','depend'],['football pools','足球彩票','/ˈfʊtbɔːl puːlz/','pools'],['pleasant','令人愉快的','/ˈplezənt/','pleasant'],['dream','梦；梦想（本课名词）','/driːm/','dream'],['nearly','几乎；差不多','/ˈnɪəli/','nearly'],['spend','花费','/spend/','spend'],['country','乡下（本课用法）','/ˈkʌntri/','country']];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit137-138',version:1,contentRevision:'if-dream-v1',mode:'classroom',title:'美好梦想里的如果',path:'/unit137-138/',start:'learn/words',progress:{learningKey:'canran:unit137-138:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识梦想里的词语',activities:[['words','梦想小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'读懂两人的设想',activities:[['text','客厅里的小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清条件与结果',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'按条件核对计划',activities:[['apply','条件计划站','give']],required:['apply']},
{id:'l5',title:'完成条件句挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'world',storyQuestion:'What would Julie like to do, if she had the money?（如果Julie有那笔钱，她想做什么？）',completionTitles:{listen:'梦想词语认清啦！',roles:'两人的设想读懂啦！',grammar:'条件与结果说清啦！',apply:'条件计划核对好啦！',exam:'条件句挑战完成！'},reward:{edition:'if-dream-v1',title:'条件规划师',lesson:'Lesson 137–138',scene:'/assets/unit137-138/keepsake-story-v1.webp',alt:'Brian与Julie坐在客厅交谈，桌上保留一张表格和一支铅笔',color:'#54735c',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','条件计划站'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={julie:'Julie',brian:'Brian'};
// Nine original speaker turns, complete in fifteen reading steps.
unit.learning.DIALOGUE=[
['julie','Are you doing the football pools, Brian?','Brian，你正在填足球彩票的投注表吗？',1],
['brian','Yes, I’ve nearly finished, Julie.','是的，Julie，我差不多填完了。',2],
['brian','I’m sure we’ll win something this week.','我确信这个星期我们会赢点什么。',2],
['julie','You always say that, but we never win anything!','你总是这么说，可我们从来什么也没赢过！',3],
['julie','What will you do if you win a lot of money?','如果你赢了很多钱，你会做什么？',3],
['brian','If I win a lot of money I’ll buy you a mink coat.','如果我赢了很多钱，我会给你买一件貂皮大衣。',4],
['julie','I don’t want a mink coat! I want to see the world.','我不想要貂皮大衣！我想去见见世面。',5],
['brian','All right. If we win a lot of money we’ll travel round the world and we’ll stay at the best hotels.','好吧。如果我们赢了很多钱，我们就环游世界，并住最好的旅馆。',6],
['brian','Then we’ll return home and buy a big house in the country.','然后我们回家，在乡下买一栋大房子。',6],
['brian','We’ll have a beautiful garden and …','我们会有一个漂亮的花园，还有……',6],
['julie','But if we spend all that money we’ll be poor again.','但是，如果我们把那笔钱全花光，我们又会变穷的。',7],
['julie','What’ll we do then?','到时候我们怎么办呢？',7],
['brian','If we spend all the money we’ll try and win the football pools again.','如果我们花光了所有的钱，我们就再试着赢一次足球彩票。',8],
['julie','It’s a pleasant dream','这是一个美好的梦想，',9],
['julie','but everything depends on ‘if’!','但一切都取决于“如果”！',9]
].map(([who,text,cn,sourceTurn],i)=>({id:'u137138-line'+(i+1),who,text,cn,sourceTurn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines}),ctx=(input,context)=>({...input,context});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u137138-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-core','认识三个新词','配好三个词。',match([['football','足球'],['win','赢'],['world','世界']]),'football是足球；win表示赢；world是世界。'),
q('v-dream','认识梦想与条件的词语','配好三个词。',match([['poor','贫穷的'],['depend','依靠；取决于'],['dream','梦；梦想']]),'本课dream是名词，depend常与on连用。'),
q('v-pools','按本课语境理解词组','football pools在本课指什么？',choice(['足球彩票','游泳池','正在踢的一场足球赛'],'足球彩票',{context:'Julie: “Are you doing the football pools, Brian?” Brian is filling in a form at home.'}),'这里football pools是课本解释的足球彩票，不是泳池或正在踢球。'),
q('v-pleasant','定位pleasant的词义','点出表示“令人愉快的”的词。',{type:'locate',fragments:['It’s a ',{value:'pleasant'},' ',{value:'dream'},'.'],options:['pleasant','dream'],answer:'pleasant'},'pleasant修饰dream，不把形容词当成梦想这个名词。'),
q('v-country','country的当前词义','in the country在这句话中指哪里？',choice(['在乡下','在全世界每个国家','在市中心'],'在乡下',{context:'Brian imagines buying “a big house in the country”.'}),'country也可指国家；此处in the country指乡下。'),
q('v-depend','depend on固定搭配','补好“取决于”。',ctx(fill([blank('Everything depends','“if”.',['on','at','to'])],['on']),'Julie says that the dream rests on a condition.'),'depend on表示取决于、依靠。')
];
unit.questions.roles=[
q('r-action','辨认当前动作','Brian现在正在做什么？',choice(['在填足球彩票的表格','在球场踢球','已经住进最好的旅馆'],'在填足球彩票的表格',{context:'Julie: “Are you doing the football pools, Brian?” Brian: “Yes, I’ve nearly finished, Julie.”'}),'原文交谈时他还在填表，不是在旅行或踢球。'),
q('r-nearly','保留差不多与完成的区别','nearly finished能证明已经全部完成吗？',choice(['不能，他说差不多完成','能，nearly表示全部已经完成','能，已经完成旅行'],'不能，他说差不多完成',{context:'Brian: “I’ve nearly finished, Julie.”'}),'nearly finished表示接近完成，不把nearly删去。'),
q('r-sure','人物确信与结果分开','哪条记录忠实于两人的话？',choice(['Brian确信本周会赢，Julie说以前从没赢过；本周结果未给出','他们本周已经中奖','Julie保证他们这次一定不会赢'],'Brian确信本周会赢，Julie说以前从没赢过；本周结果未给出',{context:'Brian: “I’m sure we’ll win something this week.” Julie: “You always say that, but we never win anything!”'}),'确信是Brian的说法，抱怨是Julie的说法，都不是本周开奖结果。'),
q('r-want','区分两人的愿望','Julie想要什么？',choice(['去见见世面','一件貂皮大衣','替Brian买一件大衣'],'去见见世面',{context:'Brian: “I’ll buy you a mink coat.” Julie: “I don’t want a mink coat! I want to see the world.”'}),'保留Julie自己的选择，不把Brian的建议当成她的愿望。'),
q('r-trip','保留条件内的并列安排','在赢很多钱的设想中，他们会怎样旅行？',choice(['环游世界并住最好的旅馆','已经走遍世界','只住乡下已经买好的房子'],'环游世界并住最好的旅馆',{context:'Brian: “If we win a lot of money we’ll travel round the world and we’ll stay at the best hotels.”'}),'两项安排共同位于设想中，不写成已实现。'),
q('r-home','辨认设想中的先后','设想中，旅行之后Brian还说会做什么？',choice(['回家，在乡下买大房子并有一个漂亮花园','先卖掉已经拥有的大房子','取消所有旅行'],'回家，在乡下买大房子并有一个漂亮花园',{context:'Brian: “Then we’ll return home and buy a big house in the country. We’ll have a beautiful garden and …”'}),'Then连接想象中的后续，没有确认买房或房屋现有产权。'),
q('r-spend','保留花光的条件','Julie在哪个条件下说会再次贫穷？',choice(['如果把那笔钱全花光','只要买一件任何价格的东西','因为现在已经花光了奖金'],'如果把那笔钱全花光',{context:'Julie: “But if we spend all that money we’ll be poor again.”'}),'all that money与if都要保留；不是已经发生的花费记录。'),
q('r-ending','尝试与保证分开','结尾支持哪种理解？',choice(['再次赢只是Brian的设想；Julie提醒一切依赖条件','Brian已经第二次中奖','他们已经旅行、买房并花光奖金'],'再次赢只是Brian的设想；Julie提醒一切依赖条件',{context:'Brian: “If we spend all the money we’ll try and win the football pools again.” Julie: “It’s a pleasant dream but everything depends on ‘if’!”'}),'try不等于成功，原文没有补写中奖或旅行结局。')
];
unit.questions.grammar=[
g('condition','识别条件而非结果','点出说明条件的一段。',{type:'locate',fragments:[{value:'If you finish early'},', ',{value:'we’ll play a game'},'.'],options:['If you finish early','we’ll play a game'],answer:'If you finish early'},'if部分提出条件；另一部分说条件下的安排。','哪一段提出要满足的情况？',model(['If the bell rings, we’ll leave.','先看条件，再看结果。'])),
g('form','未来条件的一般现在形式','补好未来的条件与安排。',ctx(fill([blank('If it','tomorrow,',['rains','will rain']),blank('we','stay at home.',['will','are'])],['rains','will']),'Tomorrow is still in the future. The plan is to stay at home in rainy weather. Use this lesson’s ordinary future conditional pattern.'),'谈未来的普通条件时，if部分用一般现在，安排可用will加原形。','两个部分的作用相同吗？',model(['If it snows, I’ll take the bus.','snows提出未来条件，不是已经下雪。'])),
g('third','一般现在第三人称','补好条件中的动词。',ctx(fill([blank('If Tom','early, we’ll start at ten.',['arrives','arrive','will arrive'])],['arrives']),'Tom’s arrival is not known yet. This is a plan for tomorrow, not a report of a completed arrival.'),'Tom是第三人称单数，此处用arrives。','先看条件部分的主语。',model(['If Anna comes, we’ll open the box.'])),
g('negative','条件否定与结果否定','保留两个不同位置的否定。',ctx(fill([blank('If she','finish the work,',['doesn’t','won’t']),blank('she','go out tomorrow.',['won’t','doesn’t'])],['doesn’t','won’t']),'Fictional plan for tomorrow: unfinished work leads to staying in. Use the ordinary future conditional pattern.'),'条件里的doesn’t和结果里的won’t分别保留。','哪部分说条件，哪部分说将来的安排？',model(['If you don’t hurry, you won’t catch the bus.'])),
g('order','换分句位置但不交换条件与结果','把结果放前面，保留原意。',ctx(bank(['I’ll','call you','if','I','finish early','because'],'I’ll call you if I finish early',5),'Original plan: If I finish early, I’ll call you.'),'分句前后可换，if仍跟着条件；不是把前因后果反过来。','把if连同它的条件一起移动。',model(['If it rains, we’ll stay in.','We’ll stay in if it rains.'])),
g('question','询问条件下的行动','组句询问下雨时对方会做什么。',ctx(bank(['What','will','you','do','if it rains','does'],'What will you do if it rains',5,'?'),'You are asking about the other person’s plan for rainy weather tomorrow.'),'What will you do是问句，if it rains仍是条件。','问句中的will放在哪里？',model(['Where will she go if she has time?'])),
g('can','有条件的许可不等于已做','这句can表达什么？',choice(['满足条件时可以用，不等于一定使用或已经使用','已经使用完了','必须使用，不能不使用'],'满足条件时可以用，不等于一定使用或已经使用',{context:'A teacher gives permission: “If you finish your work, you can use this computer.” No later action is recorded.'}),'can可表达条件满足后的许可或可能，不强改成will保证做。','允许、必须、已经做，是同一件事吗？',model(['If you have a ticket, you can enter.','can enter给出许可，未说已经进去。'])),
g('must','有条件的要求','按明示规则补好要求。',ctx(fill([blank('If you enter this room, you','wear a badge.',['must','can'])],['must']),'Fictional school rule: every person entering this room is required to wear a badge. It is compulsory, not optional permission.'),'must保留必须；can会把要求变成许可。','规则写的是必须还是可以？',model(['If you borrow this key, you must return it.'])),
g('command','条件搭配请求','按提示组织请求。',ctx(bank(['If you see Anna,','please','give','her this note','gives'],'If you see Anna, please give her this note',4),'You are asking Ben to pass the note to Anna if he sees her.'),'主句可以是请求；please后用动词原形，不强加will。','请求的动词用什么形式？',model(['If you finish first, please wait for me.'])),
g('if-meaning','if的如果与是否','分别选择两句if的含义。',ctx(fill([blank('A中的if表示','。',['如果','是否']),blank('B中的if表示','。',['是否','如果'])],['如果','是否']),'A: If Anna comes tomorrow, I’ll call you. B: I wonder if Anna will come tomorrow. A gives a plan; B asks about an unknown answer.'),'条件if与是否if用途不同，不把两个都套进同一规则。','哪句话是在想知道答案？',model(['If it rains, we’ll stay in. → 如果','I don’t know if it will rain. → 是否'])),
g('whether','是否从句可谈未来','这句话能保留will吗？',choice(['能，这里的if表示是否，可以谈未来','不能，所有if后都禁止will','不能，因为明天已经过去'],'能，这里的if表示是否，可以谈未来',{context:'I wonder if Anna will come tomorrow. The speaker is wondering about an unknown answer, not giving a condition for another action.'}),'这里if是是否；will come合法，不能见if就删will。','这里能把if理解成whether吗？',model(['I don’t know if he will return.','他是否会回来，是未知答案。'])),
g('reverse','条件不能随意反推','只知道留下了，能确定一定下雨了吗？',choice(['不能，留下也可能有别的原因','能，if句总能反过来用','能，而且已经知道明天的天气'],'不能，留下也可能有别的原因',{context:'Anna said, “If it rains, I’ll stay at home.” Later, we only learn that she stayed at home. There is no weather record and no statement about other reasons.'}),'If A, B没有自动说只有A才B；结果出现不能单独证明这个条件出现。','记录有没有直接告诉你天气？',model(['If I have time, I’ll read.','这句话没有说阅读只有这一种原因。'])),
g('tags','否定问句按事实回应','分别按给定事实回答。',ctx(fill([blank('A: She doesn’t want the coat, does she? —',', she doesn’t.',['No','Yes']),blank('B: He doesn’t want the book, does he? —',', he does.',['Yes','No'])],['No','Yes']),'A: Julie clearly says she does not want the coat. B: Ben clearly says he does want the book.'),'根据事实成对回答，不能按中文“是的，她不要”逐词套Yes。','先看每个人到底想不想要。',model(['She doesn’t need it, does she?','确实不需要：No, she doesn’t.；需要：Yes, she does.'])),
g('be','条件中的be与主语一致','补好两种主语的条件。',ctx(fill([blank('If I','free tomorrow, I’ll help.',['am','will be']),blank('If they','free tomorrow, they’ll help.',['are','is'])],['am','are']),'Both sentences give ordinary future plans with free time as the condition.'),'一般现在的be仍随主语变化，不把I与they统一成is。','分别检查两个主语。',model(['If she is ready, we’ll begin.']))
];
unit.questions.apply=[
q('a-weather','将实际条件与预定分支对应','根据9点记录，10点计划使用哪里？',choice(['the hall','the garden','the station'],'the hall',{context:'Fictional club plan for 16 October 2026: If it rains at 09:00, we’ll use the hall at 10:00. If it doesn’t rain at 09:00, we’ll use the garden at 10:00. The 09:00 weather record is rain. The 10:00 activity has not started.',image:image('weather-record'),imageAlt:'16 October 2026：09:00记录为雨；10:00活动尚未开始，地点未填'}),'9点条件对应hall这个计划，不证明10点活动已经举行。'),
q('a-permission','核对两个条件是否都成立','现在这条许可条件全部满足了吗？',choice(['还没有，老师尚未检查','已全部满足，只需做完作业','永远不能借书'],'还没有，老师尚未检查',{context:'Fictional class rule: If your work is finished and the teacher has checked it, you can borrow the book. Mia’s work is finished. The teacher has not checked it yet.',image:image('check-record'),imageAlt:'Mia的记录：work finished；teacher check not yet'}),'and连接的两个要求要一起核对；未检查不等于永远不能。'),
q('a-unknown','条件没出现时不擅自补反面结果','这条话能证明她一定不会打电话吗？',choice(['不能，没有说明没空时她会怎么做','能，没空必定不打','能，而且电话已经打完'],'不能，没有说明没空时她会怎么做',{context:'Anna said, “If I have time, I’ll call Ben.” Later she says she has no free time. There is no other statement about calling and no call record.'}),'条件没满足时，原话未规定另一分支；不把if改成only if。'),
q('a-reply','对话中回应尚未发生的条件任务','根据事实选择下一句。',choice(['Not yet. I haven’t seen Anna yet.','Yes. I gave it to her yesterday.','Anna has already read it.'],'Not yet. I haven’t seen Anna yet.',{context:'Ben promised: “If I see Anna, I’ll give her the note.” Since then he has neither seen Anna nor passed the note to anyone. Mia asks, “Have you given Anna the note?”'}),'事实同时说明没见到、没转交，不能只凭承诺认定已完成。'),
q('a-command','从计划材料组织条件请求','组句保留条件和礼貌请求。',ctx(bank(['If you borrow this book,','please','return it','on Friday','returned it'],'If you borrow this book, please return it on Friday',4),'A classroom notice asks borrowers to return this book on Friday. Write the request for a person who borrows it.'),'条件与请求一起保留；不是书已经归还。'),
q('a-whether','是否与如果迁移','这句话是在做哪件事？',choice(['询问Anna明天是否会来','规定Anna来了之后必须做什么','宣布Anna已经来了'],'询问Anna明天是否会来',{context:'Mia asks Ben: “Do you know if Anna will come tomorrow?” The invitation has not been answered.'}),'这里if引出未知答案，不是设定后续行动的条件。'),
q('a-modals','保留许可和义务的差别','按告示分别补好可以与必须。',ctx(fill([blank('If you have a library card, you','borrow two books.',['can','must']),blank('If you borrow a book, you','return it on time.',['must','can'])],['can','must']),'Fictional library notice: a card gives permission to borrow two books; nobody is required to borrow. Returning borrowed books on time is compulsory.'),'借书是许可，归还是要求；不互换can和must。'),
q('a-hypothesis','保留假设链而不伪造结果','为尚未开展的活动选一条准确记录。',choice(['If the weather is fine, we’ll go out; no outing has happened yet.','We went out and the weather was fine.','The weather must be fine because we planned an outing.'],'If the weather is fine, we’ll go out; no outing has happened yet.',{context:'The club is planning tomorrow. It will go out in fine weather. Tomorrow’s weather is still unknown, and the outing has not happened.'}),'计划条件、未知天气和未发生的活动要同时保留。')
];
unit.questions.exam=[
q('e-words','独立识别新词','配好三个词。',match([['poor','贫穷的'],['world','世界'],['depend','依靠；取决于']]),'按当前词义完成配对。'),
q('e-form','独立表达未来条件与安排','补好条件和未来安排。',ctx(fill([blank('If Sue','tomorrow,',['comes','will come']),blank('we','show her the garden.',['will','are'])],['comes','will']),'Sue may visit tomorrow. The plan is to show her the garden in that case. Use the ordinary future conditional pattern.'),'if条件用comes；结果用will show。'),
q('e-negative','独立保留两处否定','补好未完成时的安排。',ctx(fill([blank('If Ben','finish the job,',['doesn’t','won’t']),blank('he','leave early.',['won’t','doesn’t'])],['doesn’t','won’t']),'Ben’s plan for tomorrow says that unfinished work leads to not leaving early. Use an ordinary future conditional.'),'分别核对条件和结果的否定。'),
q('e-order','独立调整分句顺序','将结果放前面，保留原意。',ctx(bank(['We’ll','wait here','if','the bus','is late','because'],'We’ll wait here if the bus is late',5),'Original plan: If the bus is late, we’ll wait here.'),'移动的是分句顺序，不是条件与结果的关系。'),
q('e-question','独立提出条件问句','询问对方错过公交车时会怎么做。',ctx(bank(['What','will','you','do','if you miss the bus','does'],'What will you do if you miss the bus',5,'?'),'You want to know the other person’s future plan in case of missing the bus.'),'保留will问句和if条件。'),
q('e-can','独立区分许可与发生','下列哪条记录准确？',choice(['有票时可以进去，但尚未证明已经进去','有票的人必须立即进去','已确认所有人都进去了'],'有票时可以进去，但尚未证明已经进去',{context:'The notice says, “If you have a ticket, you can enter.” Nothing is recorded about anyone entering.'}),'许可不是义务，也不是行动记录。'),
q('e-must','独立表达要求','按规定补好要求。',ctx(fill([blank('If you use this key, you','return it today.',['must','can'])],['must']),'Fictional rule: returning this key today is compulsory for anyone who uses it.'),'保留必须归还的要求。'),
q('e-command','独立组织条件请求','组句请求对方先到时等一等。',ctx(bank(['If you arrive first,','please','wait','for us','waits'],'If you arrive first, please wait for us',4),'You ask the listener to wait for your group if the listener arrives first.'),'请求使用please和动词原形。'),
q('e-meaning','独立判断if的两种用途','分别判断两句的if。',ctx(fill([blank('A中的if表示','。',['是否','如果']),blank('B中的if表示','。',['如果','是否'])],['是否','如果']),'A: I don’t know if he will return tomorrow. B: If he returns tomorrow, we’ll meet him.'),'A询问未知答案，B设定条件。'),
q('e-whether','独立校对if后的未来形式','同学因为看到if就说will必须删掉，理由成立吗？',choice(['不成立，这里在问是否，will return可以保留','成立，所有if后都禁用will','成立，这句话表示已经回来'],'不成立，这里在问是否，will return可以保留',{context:'Do you know if Anna will return next week? The speaker is asking about an unanswered future question.'}),'if表示是否时可用will return，不把条件句的常用形式推广到所有if。'),
q('e-reverse','独立拒绝从结果反推条件','能仅凭开了窗就确定屋里热吗？',choice(['不能，可能有其他开窗原因','能，条件句永远可以倒过来','能，而且已经知道室温是多少'],'不能，可能有其他开窗原因',{context:'Ben said, “If the room is hot, I’ll open the window.” Later the window is open. There is no temperature record or statement about other reasons.'}),'开窗记录不能单独证明热这个条件。'),
q('e-unknown','独立识别未说明的另一分支','不下雨时，单凭此话能确定去哪儿吗？',choice(['不能，原话只说了下雨时的安排','能，一定去公园','能，一定留在室内'],'不能，原话只说了下雨时的安排',{context:'The only plan is: “If it rains, we’ll visit the museum.” It does not rain. No plan for dry weather is given.'}),'没有写出的分支不从选项或常识中补出。'),
q('e-be','独立选择条件中的be','补好两种主语。',ctx(fill([blank('If I','ready, I’ll call you.',['am','are']),blank('If they','ready, they’ll call you.',['are','is'])],['am','are']),'These are plans for later today. Use ordinary present forms in the condition.'),'I用am，they用are。'),
q('e-tags','独立按事实回应否定问句','按两个人的实际愿望回答。',ctx(fill([blank('A: She doesn’t want tea, does she? —',', she doesn’t.',['No','Yes']),blank('B: He doesn’t want milk, does he? —',', he does.',['Yes','No'])],['No','Yes']),'A: Anna explicitly says she does not want tea. B: Ben explicitly says he does want milk.'),'回答跟事实一致，不跟中文附和词逐字对应。'),
q('e-plan','独立保留原文的条件','哪条笔记没有把设想写成事实？',choice(['Brian说如果赢很多钱，他们会环游世界','他们已经赢很多钱并出发了','Julie已经拿到貂皮大衣'],'Brian说如果赢很多钱，他们会环游世界',{context:'Brian: “If we win a lot of money we’ll travel round the world.” No later result is given.'}),'保留Brian的说法、条件和未来安排。'),
q('e-chain','独立核对设想顺序','按Brian的设想，哪项在旅行之后？',choice(['回家并在乡下买大房子','在家填表之前已经买好房子','先证明本周已经中奖'],'回家并在乡下买大房子',{context:'Brian imagines travelling round the world and staying at the best hotels. He continues: “Then we’ll return home and buy a big house in the country.”'}),'Then表示设想中的后续，不是已完成记录。'),
q('e-try','独立区分尝试与保证','try and win说明什么？',choice(['想再试着赢，不保证一定成功','只要再试一次就保证中奖','说明已经第二次中奖'],'想再试着赢，不保证一定成功',{context:'Brian: “If we spend all the money we’ll try and win the football pools again.”'}),'尝试并不等于赢得结果。'),
q('e-nearly','独立保留完成程度','哪条记录保留了nearly的意思？',choice(['快完成了，仍不能写成已经全部完成','全部完成了，没有剩余','完全没开始'],'快完成了，仍不能写成已经全部完成',{context:'A new fictional task: Mia says, “I’ve nearly finished the drawing.”'}),'nearly不能删去而改成完全完成。')
];
unit.learning.REFERENCE=[
'本课按导学Grammar练“条件＋结果”：谈将来的普通条件时，if部分常用一般现在；主句可表达will安排，也可用can许可／可能、must要求或please请求。138第5／6例与导学must原例不能从课程里漏掉。',
'导学原例I will answer it if the telephone rings，以及If you are ill, you must go to see a doctor保留作语言材料。后一句表达要求，不据此让所有主句都改will。',
'主句在前或if分句在前都可以。If it rains, we’ll stay in与We’ll stay in if it rains保持条件和结果；if前置时通常用逗号分开。改变顺序不是把因果倒过来。',
'条件句提出一种情况下的安排，不证明条件已发生。If it rains, I’ll stay at home没有自动说只有下雨才留下；只知留下不能反推一定下雨，不下雨时也不能擅自补出一定外出。',
'if表示“是否”时用途不同。导学课后题I wonder if you will go to the party tomorrow保留未来形式；不能把“条件里一般不用will”扩大成“任何if后都禁用will”。本课只作必要的两种用途对比，139–140再系统学习间接问句。',
'教材开场What would Julie like to do, if she had the money?完整保留，用来理解假设愿望；不把would／had强改成will／has，也不把全套第二条件句新增为本课必考内容。',
'138C以富有为给定假设，按He can ... if he is rich的原例换主语并保持can；这是书写前提，不等于现实里有钱就自动获得居留、工作或其他资格。英语表达能力／可能与实际规则分开。',
'Brian的确信与Julie的抱怨各有说话人；本周中奖结果没有出现。this week保留人物说话时的参照，不套成设备当前周。nearly finished不是完全完成；travel、酒店、房子和花园都仍在设想中。',
'课文用try and win，表达试着去赢；再次尝试不保证成功。football pools按教材解释为足球彩票，不是游泳池。课程只理解原文，情境迁移使用课堂与日常计划。',
'138A4的事实是Julie不想要大衣，答No, she doesn’t；A7按最后一轮的dream答Yes, it is。不是所有否定问句一律回答No。A3给出his wife，人物关系按这道原题保留，不另编家庭情节。',
'depend on／upon表示取决于或依靠；It depends可以表示看情况。本课everything是单数，使用depends。country在in the country中指乡下；dream在a pleasant dream中是名词，不把某一词义推广到所有用法。',
'练习册把独立事实合成if句时，会把原先已知的事实改成假设前提，不能一概称同义改写；不同题要说明是按指定条件造句。书面B的回答按给定提示，C明确富有这一假设，不能要求孩子凭空推断。'
];
unit.learning.MODEL_TITLE='课本小参考 · 138课1–6';
unit.learning.VERB_FORMS=[['原形','win','/wɪn/'],['过去式','won','/wʌn/'],['过去分词','won','/wʌn/'],['原形','spend','/spend/'],['过去式','spent','/spent/'],['过去分词','spent','/spent/']];
unit.learning.STRUCTURE_MODELS=[['表达任务','条件或含义','对应表达'],['未来安排','If it rains,','we’ll stay in.'],['许可或可能','If you finish,','you can leave.'],['明确要求','If you borrow it,','you must return it.'],['礼貌请求','If you see Ben,','please tell him.'],['询问未知答案','if意为是否','I wonder if she will come.']];
unit.learning.MODELS=[['1 · If you break this window, you’ll have to pay for it!','如果你打破这扇窗户，你就得赔偿！','window'],['2 · If you don’t hurry, we’ll miss the train.','如果你不快点，我们就会误火车。','train'],['3 · If he falls, he’ll hurt himself.','如果他摔下来，他会摔伤自己的。','fall'],['4 · If it rains tomorrow, we won’t go to the seaside.','如果明天下雨，我们就不去海边。','rain'],['5 · If you feel better, you can get up.','如果你感觉好些，你可以起床。','bed'],['6 · If he sells that car, he can buy a new one.','如果他卖掉那辆车，他就可以买一辆新的。','car']].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 根据137课回答',answerLines:1,instruction:'每题一句，按原文回答。保留说话人的条件与设想，不补写中奖或旅行结局；否定问句按事实作答。',examples:[],items:['What is Brian doing?','Has Brian ever won anything on the football pools?','What will Brian buy his wife if he wins a lot of money?','She doesn’t want a mink coat, does she?','What does Julie want instead of a mink coat?','What will Brian do if he spends all the money?','It’s only a dream, isn’t it?','What does it all depend on?']},
{title:'B · 按提示回答条件问句',answerLines:1,instruction:'每题一句，使用if和题后给定的行动，保留主语与否定。问句you指作答者，回答改用I；不能把条件删去写成已发生事实。',examples:['What will you do if you win a lot of money? Stay at the best hotels. → If I win a lot of money, I’ll stay at the best hotels.'],items:['What will he do if he misses the bus? Take a taxi.','What will he do if he doesn’t sell his old car? He won’t buy a new one.','What will you do if they offer you more money? Work less.','What will he do if she doesn’t type the letter? Type it himself.','What will the children do if they come home early? Play in the garden.','What will you do if you are ill tomorrow? I won’t go to work.','What will you do if you go to the party? Enjoy myself.','What will you do if he asks you? Tell him the truth.','What will they do if it rains tomorrow? Stay at home.']},
{title:'C · 用can与富有这一假设造句',answerLines:1,instruction:'每题一句，按原例使用can，并统一补上if ... be rich这一给定假设；be和代词随括号主语改变。练习表达可能，不认定现实资格或事情已发生。',examples:['Stay at the best hotels. (He) → He can stay at the best hotels if he is rich.'],items:['Live abroad. (She)','Travel round the world. (He)','Buy a new house. (He)','Have a long holiday. (They)','Enjoy myself. (I)','Offer your boss a job. (You)','Fly to Tokyo. (He)','Work less. (She)']}
];
core.unit137138=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
