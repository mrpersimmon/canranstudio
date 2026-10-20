(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit77-78/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页158–161／PDF191–194';
const grammarSource='《同步导学》Grammar纸页140／PDF154；《语法练习册》纸页220–224／PDF234–238';
const rows=[
['appointment','约会；预约','/əˈpɔɪntmənt/','appointment'],['urgent','紧急的；急迫的','/ˈɜːdʒənt/','urgent'],['till','直到……为止','/tɪl/','till'],['dentist','牙科医生','/ˈdentɪst/','tooth'],['nurse','护士','/nɜːs/','nurse'],['toothache','牙痛','/ˈtuːθeɪk/','toothache'],
['awful','糟糕的；难受的','/ˈɔːfəl/','awful'],['busy','忙碌的','/ˈbɪzi/','busy'],['wait','等待','/weɪt/','wait'],['moment','片刻；瞬间','/ˈməʊmənt/','moment'],['now','现在','/naʊ/','now'],['earlier','更早一些','/ˈɜːliə/','earlier'],
['a.m.','上午','/ˌeɪ ˈem/','am'],['p.m.','下午','/ˌpiː ˈem/','pm'],["o’clock",'……点钟','/əˈklɒk/','clock'],['half past','……点半','/hɑːf pɑːst/','half'],['a quarter past','……点过一刻','/ə ˈkwɔːtə pɑːst/','quarter-past'],['a quarter to','差一刻到……点','/ə ˈkwɔːtə tə/','quarter-to'],
['April','四月','/ˈeɪprəl/','april'],['Monday','星期一','/ˈmʌndeɪ/','monday'],['buy','买','/baɪ/','buy'],['bought','buy的过去式：买了','/bɔːt/','buy'],['lose','丢失','/luːz/','lose'],['lost','lose的过去式：丢失了','/lɒst/','lose']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:art==='nurse'?'/assets/unit77-78/nurse.webp':image(art)}));
const unit={id:'unit77-78',version:1,contentRevision:'appointment-replies-v1',mode:'classroom',title:'诊所里的预约时间',path:'/unit77-78/',start:'learn/words',progress:{learningKey:'canran:unit77-78:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识诊所词语',activities:[['words','诊所小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进诊所故事',activities:[['text','诊所小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'理解问法与回应',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'核对预约时间',activities:[['apply','时间小帮手','give']],required:['apply']},
{id:'l5',title:'完成诊所挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'appointment-replies-v1',title:'就诊沟通小达人',lesson:'Lesson 77–78',scene:'/assets/unit77-78/keepsake-story-v1.webp',alt:'克罗夫特先生扶着面颊，与拿着预约本的护士交谈',color:'#4f807d',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','时间小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={croft:'Mr. Croft',nurse:'Nurse'};
unit.learning.DIALOGUE=[
['nurse','Good morning, Mr. Croft.','早上好，克罗夫特先生。'],
['croft','Good morning, nurse. I want to see the dentist, please.','早上好，护士。我想见牙科医生。'],
['nurse','Do you have an appointment?','您预约了吗？'],
['croft',"No, I don’t.",'没有。'],
['nurse','Is it urgent?','急吗？'],
['croft','Yes, it is. It’s very urgent. I feel awful. I have a terrible toothache.','是的，很急。我难受极了，牙痛得要命。'],
['nurse','Can you come at 10 a.m. on Monday, April 24th?','您在4月24日星期一上午10点来可以吗？'],
['croft','I must see the dentist now, nurse.','我必须现在见牙科医生，护士。'],
['nurse','The dentist is very busy at the moment. Can you come at 2 p.m.?','牙科医生这会儿很忙。您下午2点来可以吗？'],
['croft','That’s very late. Can the dentist see me now?','那就太晚了。牙科医生现在能给我看一下吗？'],
['nurse','I’m afraid that he can’t, Mr. Croft. Can’t you wait till this afternoon?','恐怕不行，克罗夫特先生。您就不能等到今天下午吗？'],
['croft','I can wait, but my toothache can’t!','我倒是可以等。可是我的牙痛等不了啊！']
].map(([who,text,cn],i)=>({id:'u7778-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>{const {context:material,...view}=input;return{id:'u7778-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-appointment','预约本与预约词义','她在本子上登记预约。哪个词表示“预约”？',choice(['appointment','toothache','moment'],'appointment',{image:image('appointment'),imageAlt:'写有日期和钟点格子的预约本'}),'appointment在这里是预约。'),
q('v-words','区分急迫等待与截止','把词语与意思配好。',match([['urgent','急迫的'],['wait','等待'],['till','直到……为止']]),'urgent表示急迫；wait是等待；till引出时间终点。'),
q('v-tooth','理解牙痛','Mr. Croft has a toothache. 哪里不舒服？',choice(['牙齿','手臂','脚'],'牙齿',{image:image('toothache'),imageAlt:'牙齿旁有表示不适的小线条'}),'toothache是牙痛。'),
q('v-awful','理解feel awful','他说“I feel awful.”，现在感觉怎样？',choice(['很难受','很舒服','只是有点饿'],'很难受'),'feel awful表示感觉很糟。'),
q('v-time','区分上午下午与现在','把时间表达配好。',match([['a.m.','上午'],['p.m.','下午'],['at the moment','此刻；现在']]),'a.m.与p.m.区分上午、下午。'),
q('v-till','理解等待的时间终点','wait till two o’clock指什么？',choice(['等到两点','两点以前就一定离开','每天等两小时'],'等到两点'),'till two o’clock表示等到两点这个时间。'),
q('v-busy','理解职业与忙碌状态','The dentist is busy. 这句话告诉我们什么？',choice(['牙科医生正忙着','护士已经下班','病人已经治好了'],'牙科医生正忙着'),'busy只说明忙碌，不说明另外两件事。')
];
unit.questions.roles=[
q('r-morning','从问候推断时间段','课文发生在一天中的哪个时段？哪句能支持？',choice(['上午；Good morning.','下午；Good afternoon.','夜里；Good night.'],'上午；Good morning.'),'开头两人都说Good morning。'),
q('r-appointment','区分来访需求与预约事实','克罗夫特先生来之前预约了吗？',choice(['没有预约','已经约好上午10点','已经约好下午2点'],'没有预约'),'他回答No, I don’t，后面的时间只是护士提议。'),
q('r-urgent','联系身体感受与急迫需求','他为什么想现在就见牙科医生？',choice(['牙痛得很厉害，感觉很难受','想买一本预约本','只是来向护士问好'],'牙痛得很厉害，感觉很难受'),'terrible toothache和feel awful说明他的感受。'),
q('r-first','完整读取第一次提议','护士第一次提议的时间是？',choice(['4月24日星期一上午10点','4月24日星期一下午2点','4月14日星期一上午10点'],'4月24日星期一上午10点'),'她说at 10 a.m. on Monday, April 24th。'),
q('r-second','理解此刻繁忙与第二次提议','医生现在很忙，护士接着提议他几点来？',choice(['下午2点','上午10点','午夜12点'],'下午2点'),'Can you come at 2 p.m.?是第二次提议。'),
q('r-refusal','理解委婉说明无法立即接诊','“I’m afraid that he can’t.” 中he指谁？不能做什么？',choice(['牙科医生，不能现在接诊他','克罗夫特先生，不能说话','护士，不能看时间'],'牙科医生，不能现在接诊他'),'he承接the dentist；回答的是能否现在接诊。'),
q('r-ending','区分夸张表达与未写出的结局','“I can wait, but my toothache can’t!” 想表达什么？',choice(['牙痛难受，他很想尽快得到帮助','牙齿能自己去找医生','他已经看完牙、不痛了'],'牙痛难受，他很想尽快得到帮助'),'这是夸张表达；课文没有写后续就诊结果。')
];
unit.questions.grammar=[
g('locate','识别缩略式否定疑问开头','哪个部分让问句变成否定的问法？',{type:'locate',fragments:[{value:'Can’t'},' ',{value:'you'},' ',{value:'wait'},' till this afternoon?'],options:['Can’t','you','wait'],answer:'Can’t'},'Can’t包含否定not，位于主语you之前。','找含有否定意思的部分。',model(['Isn’t she a nurse?','Isn’t放在主语she前。'])),
g('contractions','联系完全式与缩略式','把缩略形式与完整形式配好。',match([['isn’t','is not'],['don’t','do not'],['can’t','cannot']]),'not可与前面的动词缩合；cannot通常连写。','观察撇号前后的字母。',model(['doesn’t = does not','意思不变，写法缩短。'])),
g('full','完全式not放在主语之后','按完全式拼出：他不是牙科医生吗？',bank(['Is','he','not','a dentist','isn’t'],'Is he not a dentist',4,'?'),'完全式为Is＋he＋not，not在主语后。','先找提问的Is和主语he。',model(['Is she not a nurse?','完全式：Is＋主语＋not。'])),
g('be','缩略式整体放到句首','她不是护士吗？补全缩略式问句。',fill([blank('','she a nurse?',['Isn’t','Doesn’t','Didn’t'])],['Isn’t']),'这里描述身份，用be；Isn’t整体在主语前。','身份句用is，不用do。',model(['Isn’t he a teacher?','Isn’t＋主语＋身份。'])),
g('can','情态动词的否定问句与原形','拼出：你就不能早点来吗？',bank(['Can’t','you','come','a little earlier','comes'],'Can’t you come a little earlier',4,'?'),'Can’t后接主语与动词原形。','come跟在情态动词之后仍用原形。',model(['Can’t he wait?','Can’t＋主语＋动词原形。'])),
g('does','第三人称单数的do类否定问句','他不是在这里工作吗？',fill([blank('','he work here?',['Doesn’t','Don’t','Isn’t'])],['Doesn’t']),'一般现在时实义动词work，he对应doesn’t。','不是问身份，而是问工作这件事。',model(['Doesn’t she like tea?','he／she后问实义动词，用Doesn’t…＋原形。'])),
g('did','过去否定问句保留原形','她昨天没有打电话吗？',fill([blank('Didn’t she','yesterday?',['call','called','calls'])],['call']),'didn’t已经表示过去，后面用call。','过去信息已经在didn’t里。',model(['Didn’t he visit you?','didn’t之后不用visited。'])),
g('yes-be','肯定事实用Yes与肯定简答','事实：她确实是护士。别人问“Isn’t she a nurse?”，怎样回答？',choice(['Yes, she is.','No, she isn’t.','Yes, she isn’t.'],'Yes, she is.'),'事实是她是护士，所以回答Yes, she is。','先判断“她是护士”这个事实是否成立。',model(['Isn’t he busy? — Yes, he is.','如果他确实很忙，回答Yes。'])),
g('no-be','否定事实用No与否定简答','事实：他是老师，不是牙科医生。“Isn’t he a dentist?”',choice(['No, he isn’t.','Yes, he is.','No, he is.'],'No, he isn’t.'),'他不是牙科医生，回答No, he isn’t。','不要照搬中文“是的，他不是”。',model(['Isn’t she here? — No, she isn’t.','她确实不在这里：No＋否定简答。'])),
g('yes-can','能做到时不随否定问法改变事实','新情境：你能等一会儿。“Can’t you wait?”',choice(['Yes, I can.','No, I can’t.','Yes, I can’t.'],'Yes, I can.'),'能等，回答Yes, I can。','把“能不能等”作为判断依据。',model(['Can’t she swim? — Yes, she can.','她会游泳，所以用Yes。'])),
g('no-can','不能做到时使用No','新情境：你现在不能来。“Can’t you come now?”',choice(['No, I can’t.','Yes, I can.','No, I can.'],'No, I can’t.'),'不能来，回答No, I can’t。','回答要与现在不能来的事实一致。',model(['Can’t he drive? — No, he can’t.','他不会开车，所以用No。'])),
g('yes-do','实义动词肯定简答','事实：你喜欢这本书。“Don’t you like this book?”',choice(['Yes, I do.','No, I don’t.','Yes, I am.'],'Yes, I do.'),'喜欢这本书，用Yes, I do。','问题用do，简答也用do。',model(['Doesn’t she like apples? — Yes, she does.','她喜欢苹果，回答肯定。'])),
g('no-did','过去否定事实的简答','事实：你昨天没有见他。“Didn’t you see him yesterday?”',choice(['No, I didn’t.','Yes, I did.','No, I don’t.'],'No, I didn’t.'),'过去没有见，用No, I didn’t。','时间是昨天，简答要呼应did。',model(['Didn’t she call? — No, she didn’t.','她没有打电话，否定事实用No。'])),
g('surprise','按具体场景区分惊讶赞叹与提醒','按这三个具体场景，把话配给说话的人。',match([['Isn’t he at home?','惊讶地在公园发现原以为在家的人'],['Isn’t it beautiful?','欣赏花园时赞叹它漂亮'],['Didn’t I tell you?','提醒同伴自己已经说过了']]),'否定问句可以表达不同情绪，要看人物和场景。','先读具体场景，再理解这句话的用意。',model(['Aren’t they at school?','原以为他们在学校，看到他们时感到意外。'])),
g('invitation','理解礼貌邀请而非强迫','主人摆好餐具，友好地说“Won’t you come and have lunch with us?”。他在做什么？',choice(['邀请对方一起吃午饭','认为对方不愿来吃午饭','询问对方刚才吃过什么'],'邀请对方一起吃午饭'),'Won’t you…?在这段语境中是友好的邀请。','看主人准备餐具和邀请的语境。',model(['Won’t you sit down?','主人指着座位，是在请对方坐下。'])),
g('request','否定问句不自动等于陈述事实','朋友希望你早来帮忙：“Can’t you come a little earlier?” 他主要想说什么？',choice(['希望你能早点来','已经确定你不能来','让你永远不要来'],'希望你能早点来'),'这里是带期待的请求，不是报告不能来的事实。','先看朋友希望什么。',model(['Can’t you help me?','需要帮助时，这可以是一种请求。'])),
g('independent-yes','撤去示范后按事实作答','新情境：你已经预约了。“Don’t you have an appointment?”',choice(['Yes, I do.','No, I don’t.','Yes, I don’t.'],'Yes, I do.'),'已经预约，回答Yes, I do。'),
g('independent-no','撤去示范后处理不同人称','Tom并不想现在离开。“Doesn’t he want to leave now?”',choice(['No, he doesn’t.','Yes, he does.','No, he isn’t.'],'No, he doesn’t.'),'不想离开，回答No, he doesn’t。')
];
unit.questions.apply=[
q('a-offer','从提议材料核对时间而非确认预约','哪张卡准确记录护士的这次提议？',choice(['10 a.m. · Monday, April 24th','2 p.m. · Monday, April 24th','10 a.m. · Friday, April 24th'],'10 a.m. · Monday, April 24th',{context:'Can you come at 10 a.m. on Monday, April 24th?'}),'材料只是提议时间，还不表示对方已经接受。'),
q('a-afternoon','把下午钟点对应到24小时表示','把“2 p.m.”放到时间牌上。',choice(['14:00','02:00','12:00'],'14:00',{context:'Can you come at 2 p.m.?'}),'2 p.m.是下午两点，即14:00。'),
q('a-prepositions','把不同时间粒度接入介词','按时间种类配好。',match([['at','ten o’clock'],['on','Tuesday'],['in','May']]),'钟点用at，星期用on，月份用in。'),
q('a-month','跨年月份转换有明确日期参照','记录日是2026年1月5日。two months ago是哪一天？',choice(['2025年11月5日','2025年12月5日','2026年3月5日'],'2025年11月5日',{context:'Record date: 5 January 2026. She met him two months ago.'}),'从1月向前两个月跨到上一年11月，日期仍为5日。'),
q('a-half-hour','分钟级相对时间转成准确钟点','现在是11:15。半小时前到达，是几点？',choice(['10:45','10:15','11:45'],'10:45',{context:'It is a quarter past eleven. They arrived half an hour ago.'}),'11:15向前半小时是10:45，也叫a quarter to eleven。'),
q('a-past','今天已发生的动作使用过去式','现在下午。她上午已经给房间通过风。补全记录。',fill([blank('She','the room this morning.',['aired','airs','air'])],['aired']),'是否过去看动作是否发生，不只看是不是今天。'),
q('a-reply','依据行程回应否定问句','新情境：你下午3点前都在学校，不能2点来。护士问“Can’t you come at two?”',choice(['No, I can’t.','Yes, I can.','No, I can.'],'No, I can’t.',{context:'School ends at 3 p.m. You cannot come at 2 p.m.'}),'不能在两点到达，回答No, I can’t。'),
q('a-when','把昨天转成星期回答When','记录中今天是星期日。昨天丢了笔，回答“When did he lose his pen?”',bank(['He','lost','his pen','on Saturday','in Saturday','loses'],'He lost his pen on Saturday',4),'星期日前一天是星期六，星期前用on。')
];
unit.questions.exam=[
q('e-vocabulary','独立复核三个新词','把词语配好。',match([['appointment','预约'],['urgent','急迫的'],['till','直到……为止']]),'三词分别用于预约、急迫程度和时间终点。'),
q('e-feeling','结合身体感受理解词语','“I feel awful. I have a terrible toothache.” 哪条记录准确？',choice(['牙痛很厉害，感觉很难受','牙不痛，只想问路','刚刚已经治好了'],'牙痛很厉害，感觉很难受'),'terrible toothache是严重牙痛，feel awful是很难受。'),
q('e-till','独立理解till的时间边界','“Wait till this afternoon.” 要等到什么时候？',choice(['今天下午','昨天下午','整整一个星期'],'今天下午'),'till后给出等待的终点。'),
q('e-appointment','不把提议当已确认预约','哪条是课文已经说明的事实？',choice(['他原先没有预约，护士提出了时间','他已接受4月24日的预约','医生已给他治好了牙'],'他原先没有预约，护士提出了时间'),'原文没有写他接受预约或已经治疗。'),
q('e-proposal','综合课文钟点与现在状态','护士先提议上午10点，后来提议什么？为什么不能现在接诊？',choice(['下午2点；牙科医生此刻很忙','上午2点；护士已下班','下午10点；病人不想见医生'],'下午2点；牙科医生此刻很忙'),'2 p.m.是下午两点；医生现在很忙。'),
q('e-humour','辨别课文结尾夸张表达','结尾说牙痛“等不了”，是指什么？',choice(['他痛得难受，迫切想得到帮助','牙痛是一位会走路的人','护士已经同意马上接诊'],'他痛得难受，迫切想得到帮助'),'夸张强调他的感受，没有新增接诊承诺。'),
q('e-full','独立使用完全式语序','拼出完全式：她不是护士吗？',bank(['Is','she','not','a nurse','isn’t'],'Is she not a nurse',4,'?'),'完全式not在主语she后。'),
q('e-contracted','独立辨别缩略式语序','哪句是“他们不在这里吗？”的缩略式问句？',choice(['Aren’t they here?','Are not they here?','They aren’t here.'],'Aren’t they here?'),'缩略式Aren’t整体在主语they前。'),
q('e-does','独立选择实义动词助动词','她不喜欢牛奶吗？',fill([blank('','she like milk?',['Doesn’t','Isn’t','Don’t'])],['Doesn’t']),'like是实义动词；she对应Doesn’t。'),
q('e-did','独立处理过去否定问句','他昨天没有丢笔吗？',fill([blank('Didn’t he','his pen yesterday?',['lose','lost','loses'])],['lose']),'didn’t后的动词用原形lose。'),
q('e-can','独立处理情态动词原形','你就不能等到三点吗？',bank(['Can’t','you','wait','till three','waits'],'Can’t you wait till three',4,'?'),'Can’t之后是主语加原形wait。'),
q('e-yes-be','独立肯定事实的简答','Jane确实是牙科医生。“Isn’t she a dentist?”',choice(['Yes, she is.','No, she isn’t.','Yes, she isn’t.'],'Yes, she is.'),'事实肯定，英语用Yes＋肯定简答。'),
q('e-no-can','独立否定能力事实的简答','你现在不能等。“Can’t you wait now?”',choice(['No, I can’t.','Yes, I can.','No, I can.'],'No, I can’t.'),'确实不能等，用No, I can’t。'),
q('e-yes-do','独立肯定拥有事实的简答','你确实有预约。“Don’t you have an appointment?”',choice(['Yes, I do.','No, I don’t.','Yes, I am.'],'Yes, I do.'),'有预约，回答Yes, I do。'),
q('e-no-did','独立过去否定事实的简答','Ben昨天没有来。“Didn’t he come yesterday?”',choice(['No, he didn’t.','Yes, he did.','No, he doesn’t.'],'No, he didn’t.'),'昨天没来，简答用didn’t。'),
q('e-invitation','独立区分邀请与字面否定','主人准备好椅子，友好地说“Won’t you sit down?”。你愿意坐下并表示感谢，该怎样回应？',choice(['Thank you.','Yes, I do.','No, I didn’t.'],'Thank you.'),'这里是在礼貌地邀请坐下。'),
q('e-admiration','识别赞叹语境','大家正在欣赏漂亮花园，笑着说“Isn’t it beautiful?”。表达什么？',choice(['赞叹花园漂亮','断定花园不漂亮','询问几点钟'],'赞叹花园漂亮'),'否定问句在明确语境中可以表示赞叹。'),
q('e-clock','独立使用钟点前at','补全：他在上午9点来了。',fill([blank('He came','9 a.m.',['at','on','in'])],['at']),'钟点前用at。'),
q('e-date','独立使用具体日期前on','在8月2日来。',fill([blank('Come','August 2nd.',['on','at','in'])],['on']),'具体日期前用on。'),
q('e-month-year','独立区分月份与年份表达','把介词放入两条记录。',fill([blank('She came','June.',['in','on','at']),blank('He arrived','2018.',['in','on','at'])],['in','in']),'月份和年份前都用in。'),
q('e-relative-year','独立把相对年份转为具体年份','记录日是2022年。去年刷了这个房间，该怎样回答？',choice(['I painted it in 2021.','I painted it in 2023.','I painted it on 2021.'],'I painted it in 2021.'),'2022年的去年是2021年；年份前用in。'),
q('e-relative-clock','独立半小时转换','记录钟点是上午8点。半小时前见到了他。选准确回答。',choice(['I saw him at half past seven.','I saw him at half past eight.','I saw him on seven thirty.'],'I saw him at half past seven.'),'8点之前半小时是7:30，钟点前用at。'),
q('e-past','独立复核规则与不规则过去式','把动作与过去式配好。',match([['buy','bought'],['lose','lost'],['empty','emptied']]),'不规则形式与y变ied都要结合词形核对。'),
q('e-78','把日常动作改为已发生记录','She listens to the news every day. 改成“昨天听过新闻”。',choice(['She listened to the news yesterday.','She listens to the news yesterday.','She listened to the news every day.'],'She listened to the news yesterday.'),'动词和时间一起改成一次过去事件。'),
q('e-reading','依据日期与钟点核对预约记录','只选材料里“星期一下午”的来访者。',choice(['Ann','Ben','Tom'],'Ann',{context:'Ann: Monday, 2 p.m.\nBen: Tuesday, 2 p.m.\nTom: Monday, 10 a.m.'}),'同时核对星期和上午／下午，不能只看一个线索。'),
q('e-when','独立问答过去事件时间','记录：她在11月见过他。哪组问答准确？',choice(['When did she meet him? — She met him in November.','When did she met him? — She meet him in November.','When does she meet him? — Yes, she did.'],'When did she meet him? — She met him in November.'),'When did＋原形；回答过去式并给出月份。')
];
unit.learning.MODELS=Array.from({length:12},(_,i)=>{const hour=i+1,minute=i*5;return{label:String(i+1),image:image('time-'+String(hour)),en:'at '+hour+':'+String(minute).padStart(2,'0'),result:hour+'点'+(minute?minute+'分':'整')};});
unit.learning.REFERENCE=[
'否定问句完全式：Is she not a nurse?；缩略式：Isn’t she a nurse?。完全式not在主语后，缩略式Isn’t整体在主语前。',
'can类：Can’t you wait?；do类：Don’t you like it?／Doesn’t he work here?；过去：Didn’t she call?。can、do、does、did后接动词原形。',
'按事实回答：Isn’t she a nurse? 她确实是护士→Yes, she is.；她不是护士→No, she isn’t.。不要把中文“是的，她不是”逐词搬进英语。',
'Can’t you wait? 能等→Yes, I can.；不能等→No, I can’t.。问题中含not，不会改变实际事实。',
'否定问句的语气要看上下文：Isn’t it beautiful?可赞叹；Isn’t he at home?可表示惊讶；Can’t you come earlier?可表示请求／建议；Won’t you sit down?可作有礼貌的邀请。',
'也可能表达责备，例如已经约好，仍没完成时说“Didn’t I tell you?”。不能只见否定形式就认定生气。语气和真实交流由课堂继续练习。',
'Couldn’t you wait a little longer?也是带期待的问法。不同主语和动词配用相应简答；本课不因此扩展成完整could或将来时课程。',
'时间：at＋钟点，on＋星期或具体日期，in＋月份或年份。例：at ten on Monday, April 24th。',
'a.m.上午，p.m.下午；half past seven是7:30，a quarter past eleven是11:15，a quarter to eleven是10:45。',
'问过去事件发生时间：When did she meet him? — She met him in November.。先读题目给出的参照，再换算时间；不使用设备日期。'
];
unit.learning.TIME_TABLE=[['ON · 星期',['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']],['IN · 月份',['January','February','March','April','May','June','July','August','September','October','November','December']],['IN · 年份',['2012','2013','2014','2015','2016','2017','2018','2019','2020','2021']],['ON · 日期',['July 1st','Aug. 2nd','Sept. 3rd','4th Oct.','5th Nov.','6th Dec.']]];
unit.learning.WRITING_A=[
'She buys a new car every year. She ______ a new car last year.',
'She airs the room every day. She ______ it this morning.',
'He often loses his pen. He ______ his pen this morning.',
'She always listens to the news. She ______ to the news yesterday.',
'She empties this basket every day. She ______ it yesterday.'
];
unit.learning.WRITING_EXAMPLES=[
'It’s eight o’clock. When did you see him? (half an hour ago) → I saw him at half past seven.',
'It’s Friday. When did she go to London? (the day before yesterday) → She went to London on Wednesday.',
'It’s June. When did Mr. Jones buy that car? (last month) → He bought that car in May.'
];
unit.learning.WRITING_B=[
'It’s 2022. When did you paint this room? (last year)',
'It’s 5th January. When did she meet him? (two months ago)',
'It’s a quarter past eleven. When did they arrive? (half an hour ago)',
'It’s Sunday. When did he lose his pen? (yesterday)'
];
core.unit7778=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit7778,excerpts={"u7778-v1-r-morning":[0,1],"u7778-v1-r-appointment":[2,3],"u7778-v1-r-urgent":[4,5],"u7778-v1-r-first":[6,7],"u7778-v1-r-second":[8,9],"u7778-v1-r-refusal":[8,9,10,11],"u7778-v1-e-appointment":[0,1,2,3,4,5,6,7,8,9,10,11]},speakers={"nurse":"Nurse","croft":"Mr. Croft"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 77',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
