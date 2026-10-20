(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit93-94/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页190–193／PDF223–226';
const grammarSource='《同步导学》Grammar纸页163–164／PDF177–178；《语法练习册》纸页266–271／PDF280–285';
const rows=[
['pilot','飞行员','/ˈpaɪlət/','pilot'],['return','返回','/rɪˈtɜːn/','return'],['fly','飞行（原形）','/flaɪ/','plane'],['flew','fly的过去式','/fluː/','plane'],['flown','fly的过去分词','/fləʊn/','plane'],['next-door neighbour','隔壁邻居','/ˌnekst dɔː ˈneɪbə/','neighbour'],
['New York','纽约','/ˌnjuː ˈjɔːk/','new-york'],['Tokyo','东京','/ˈtəʊkiəʊ/','tokyo'],['Madrid','马德里','/məˈdrɪd/','madrid'],['nearly','几乎；差不多','/ˈnɪəli/','globe'],['lucky','幸运的','/ˈlʌki/','lucky'],['at the moment','此刻；现在','/ət ðə ˈməʊmənt/','clock'],
['Athens','雅典','/ˈæθɪnz/','athens'],['Beijing','北京','/ˌbeɪˈdʒɪŋ/','beijing'],['Berlin','柏林','/bɜːˈlɪn/','berlin'],['Mumbai','孟买','/mʊmˈbaɪ/','mumbai'],['Geneva','日内瓦','/dʒɪˈniːvə/','geneva'],['London','伦敦','/ˈlʌndən/','london'],
['Moscow','莫斯科','/ˈmɒskəʊ/','moscow'],['Paris','巴黎','/ˈpærɪs/','paris'],['Rome','罗马','/rəʊm/','rome'],['Seoul','首尔','/səʊl/','seoul'],['Stockholm','斯德哥尔摩','/ˈstɒkhəʊm/','stockholm'],['Sydney','悉尼','/ˈsɪdni/','sydney'],
['arrive','到达','/əˈraɪv/','arrive'],['leave','离开','/liːv/','leave'],['borrow','借入','/ˈbɒrəʊ/','book'],['keep','保留；继续持有','/kiːp/','book'],['buy','购买','/baɪ/','bag'],['join','加入','/dʒɔɪn/','club'],
['begin','开始','/bɪˈɡɪn/','film'],['finish','结束；完成','/ˈfɪnɪʃ/','film'],['the week after next','下下周','/ðə wiːk ˈɑːftə nekst/','calendar'],['the month after next','下下个月','/ðə mʌnθ ˈɑːftə nekst/','calendar'],['the year after next','后年','/ðə jɪə ˈɑːftə nekst/','calendar'],['the R.A.F.','英国皇家空军','/ði ˌɑːr eɪ ˈef/','wings']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:art==='pilot'?'/assets/unit93-94/nigel.webp':image(art)}));
const unit={id:'unit93-94',version:1,contentRevision:'pilot-events-states-v1',mode:'classroom',title:'新邻居的飞行手记',path:'/unit93-94/',start:'learn/words',progress:{learningKey:'canran:unit93-94:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识飞行员与城市',activities:[['words','飞行小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'翻开新邻居的故事',activities:[['text','飞行故事图册','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'一刻发生，多久持续',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'整理旅行记录',activities:[['apply','行程小帮手','give']],required:['apply']},
{id:'l5',title:'完成飞行挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'pilot',storyQuestion:'为什么说Nigel很幸运？',completionTitles:{listen:'飞行词语认清啦！',roles:'新邻居的故事读懂啦！',grammar:'动作和状态分清啦！',apply:'旅行记录整理好啦！',exam:'飞行挑战完成！'},reward:{edition:'pilot-events-states-v1',title:'飞行手记小达人',lesson:'Lesson 93–94',scene:'/assets/unit93-94/keepsake-story-v1.webp',alt:'飞行员Nigel在机场窗边查看旅行手记，旁边放着地球仪与行李',color:'#668ca8',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','行程小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={narrator:'旁白'};
unit.learning.DIALOGUE=[
['Nigel is our new next-door neighbour. He’s a pilot.','Nigel是我们新搬来的隔壁邻居。他是一名飞行员。'],
['He was in the R.A.F.','他曾在英国皇家空军任职。'],
['He will fly to New York next month.','下个月他将飞往纽约。'],
['The month after next he’ll fly to Tokyo.','下下个月他将飞往东京。'],
['At the moment, he’s in Madrid. He flew to Spain a week ago.','现在他在马德里。他是一星期以前飞往西班牙的。'],
['He’ll return to London the week after next.','下下个星期他将返回伦敦。'],
['He’s only forty-one years old, and he has already been to nearly every country in the world.','他只有四十一岁，却已经去过世界上几乎每一个国家。'],
['Nigel is a very lucky man. But his wife isn’t very lucky. She usually stays at home!','Nigel是个很幸运的人。不过他妻子不太幸运。她通常待在家里！']
].map(([text,cn],i)=>({id:'u9394-d'+(i+1),who:'narrator',text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u9394-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-pilot','职业与语境','哪一个词表示“飞行员”？',choice(['pilot','neighbour','country'],'pilot',{optionImages:{pilot:'/assets/unit93-94/nigel.webp',neighbour:image('neighbour'),country:image('globe')}}),'pilot是飞行员。'),
q('v-return','return表示返回','点出表示“返回”的词。',{type:'locate',fragments:['He’ll ',{value:'return'},' ',{value:'to'},' ',{value:'London'},'.'],options:['return','to','London'],answer:'return'},'return表示返回。'),
q('v-fly','飞行的三种动词形式','把形式与用途配好。',match([['fly','原形'],['flew','过去式'],['flown','过去分词']]),'fly–flew–flown的拼写和发音不同。'),
q('v-story-cities','原文城市的名称','配好三座城市。',match([['New York','纽约'],['Tokyo','东京'],['Madrid','马德里']]),'Madrid是城市，Spain是国家，不能互换名称。'),
q('v-cities','94课城市名称','配好三座城市的中英文。',match([['Athens','雅典'],['Geneva','日内瓦'],['Stockholm','斯德哥尔摩']]),'城市名称作为专有名词，大写开头。'),
q('v-nearly','nearly限制范围','nearly every country表示？',choice(['几乎每一个国家','毫无例外的每一个国家','一个国家也没有'],'几乎每一个国家'),'nearly不能省成every，不能把“几乎”当“全部”。'),
q('v-neighbour','隔壁的含义','next-door neighbour是哪一种邻居？',choice(['住在隔壁的邻居','正在飞行的每一位乘客','住在世界另一端的人'],'住在隔壁的邻居'),'next-door在这里说明住在隔壁。'),
q('v-time','现在与以后的时间','配好时间表达。',match([['at the moment','现在'],['the week after next','下下周'],['the year after next','后年']]),'相对时间以说话时给定的参照为准。')
];
unit.questions.roles=[
q('r-job','现在职业与过去经历','哪一组符合原文？',choice(['现在是飞行员，曾在英国皇家空军任职','现在是医生，从未飞行','仍在英国皇家空军是原文明说的事实'],'现在是飞行员，曾在英国皇家空军任职'),'is说明现在职业，was说明过去经历；不额外断定现在是否仍在空军。'),
q('r-now','当前地点与过去国家','故事中的现在，他在哪里？',choice(['Madrid','New York','Tokyo'],'Madrid'),'At the moment, he’s in Madrid。'),
q('r-next','下一月的目的地','下个月他将飞往哪里？',choice(['New York','Tokyo','London'],'New York'),'New York对应next month。'),
q('r-after','下下个月的目的地','他什么时候将飞往Tokyo？',choice(['the month after next','next month','a week ago'],'the month after next'),'下一月与下下个月不是同一个时间。'),
q('r-return','返回的地点和时间','哪一组是他的返回安排？',choice(['London · the week after next','Madrid · yesterday','New York · next week'],'London · the week after next'),'原文是返回伦敦，时间为下下周。'),
q('r-past','过去已经发生的旅行','他一星期前飞往哪个国家？',choice(['Spain','Japan','France'],'Spain'),'He flew to Spain a week ago。'),
q('r-lucky','年龄与旅行经历','作者为什么说Nigel幸运？',choice(['只有四十一岁，已去过几乎每个国家','四十一岁时已去过每个国家且没有例外','他从来不用工作'],'只有四十一岁，已去过几乎每个国家'),'保留forty-one和nearly；原文没有说不用工作。'),
q('r-wife','通常与总是的区别','原文对妻子的生活只明确说了什么？',choice(['她通常待在家里','她永远不能旅行','她正在和Nigel一起去东京'],'她通常待在家里'),'usually不是always；“幸运”是叙述者的评价，不能据此推断妻子的意愿或所有人的幸福。')
];
unit.questions.grammar=[
g('event','区分发生时刻与持续状态','哪句只说“到达的那一刻”？',choice(['He arrived at nine.','He has been here for an hour.','He is still here.'],'He arrived at nine.'),'arrive描述到达；be here描述在这里的状态。','是何时发生，还是持续多久？',model(['She bought the book yesterday.','bought说买到这件事。'])),
g('perfect','非延续动作也能用现在完成时','他刚刚回来了。补全句子。',fill([blank('He has just',' .',['returned','return'])],['returned']),'has returned可表示已经返回；不能说非延续性动词一律不能用于完成时。','have／has后用过去分词。',model(['The train has arrived.','说明到达已经发生。'])),
g('arrive','到达与持续在场','九点到，十点仍在，期间没离开。选持续状态。',choice(['She has been here for an hour.','She has arrived here for an hour.','She will arrive in an hour.'],'She has been here for an hour.',{context:'Arrived: 9:00\nNow: 10:00\nStill here; she has not left.'}),'单次到达不能持续一小时；持续在这里用has been here。','资料是否说明一直没离开？',model(['He came at eight and is still here at ten.','He has been here for two hours.'])),
g('leave','离开与持续不在','她两天前离开，至今没回来。',fill([blank('She has','away for two days.',['been','left'])],['been']),'单次离开用left；持续不在用has been away。','说明持续状态，还是离开的那一刻？',model(['He left yesterday and has not returned.','He has been away since yesterday.'])),
g('buy','购买与持续拥有','两年前买的书，一直拥有到现在。',fill([blank('I have','this book for two years.',['had','bought'])],['had']),'bought是买到；持续拥有用have had。','have后面的had是have的过去分词。',model(['She bought it in 2020 and still owns it.','She has had it since 2020.'])),
g('borrow','借入与仍然持有','星期一借来，星期三仍没归还。',fill([blank('He has','the book for two days.',['kept','borrowed'])],['kept']),'借入是一个事件；一直保留借来的书用has kept。','看书是否仍在他手上。',model(['I borrowed it yesterday and still have it.','I have kept it since yesterday.'])),
g('begin','开始与仍在进行','电影八点开始，八点二十仍在播放。',fill([blank('The film has been','for twenty minutes.',['on','over'])],['on']),'begin／start说开始；持续放映用be on。','电影还在放，还是结束了？',model(['The show began at six and is still running.','The show has been on since six.'])),
g('finish','结束与结束后的状态','电影十点结束，现在十点半。',fill([blank('The film has been','for half an hour.',['over','on'])],['over']),'finish说结束事件；结束后的状态是be over。','不要把结束后的时间算成播放时长。',model(['The show finished at nine. Now it is ten.','The show has been over for an hour.'])),
g('join','加入与持续成员身份','她2020年入队，现在仍是队员。哪句表达持续的成员身份？',choice(['She has been a member of the team since 2020.','She has joined the team since 2020.','She will join the team in 2020.'],'She has been a member of the team since 2020.'),'一次加入用join；持续成员身份可用be a member of／be in。','现在还属于这个团队吗？',model(['He joined the club in 2021 and is still a member.','He has been in the club since 2021.'])),
g('move','搬入与持续居住','2019年搬来，一直住到现在。',fill([blank('They have','here since 2019.',['lived','moved'])],['lived']),'move to说搬入；一直居住用live in／live here。','动作之后的状态是否持续？',model(['She moved to London in 2022 and still lives there.','She has lived in London since 2022.'])),
g('open','打开与保持打开','门九点打开，一直开到十点。',fill([blank('We have','the door open for an hour.',['kept','opened'])],['kept']),'open说打开；keep it open说保持打开。','材料明确说中间没有关门。',model(['The window opened at eight and stayed open.','We have kept it open since eight.'])),
g('ill','生病事件与持续病情','她病了两天；他感冒三天了，现在都未好。',fill([blank('She has','ill for two days.',['been','fallen']),blank('He has','a cold for three days.',['had','caught'])],['been','had']),'fall ill／catch a cold说开始生病，be ill／have a cold说持续状态。','这里问的是持续多久。',model(['He fell ill on Monday and is still ill.','He has been ill since Monday.'])),
g('up','起床与起床后的状态','六点起床，七点仍醒着、没有再睡。',fill([blank('He has been','for an hour.',['up','get up'])],['up']),'get up是起床动作，be up是起床后的状态。','been后面需要状态表达。',model(['She got up at five and stayed up.','She has been up since five.'])),
g('negative','否定句可表达一段时间没发生','“He hasn’t come here for two weeks.”是什么意思？',choice(['这两周里他没有来过这里','他在这里连续待了两周','come绝不能与for出现在同一句'],'这两周里他没有来过这里'),'否定完成时可说一段时间内某动作没发生，不能照搬肯定句的限制。','hasn’t是否定哪件事？',model(['I haven’t bought a book for a month.','一个月内没买书，不是买书动作持续一个月。'])),
g('evidence','持续状态需要明确证据','只知道他九点到过这里，能确定一直待到现在吗？',choice(['不能，还需知道他后来是否离开','能，到达就表示永远留下','能，看到九点就能确定'],'不能，还需知道他后来是否离开',{context:'He arrived here at nine.\nNo information about what happened afterwards.'}),'到达这个事实本身不能证明一直在场。','不要给材料补结局。',model(['She came at nine and left at ten.','来过不等于一直在这里。'])),
g('when','过去与未来的When问句','一人昨年去了，另一人明年才去。补好问句。',fill([blank('When','you go there last year?',['did','will']),blank('When','she go there next year?',['will','did'])],['did','will']),'过去发生用When did；将来安排用When will，后面都用原形。','先看事情发生在什么时候。',model(['When did he leave? / When will he return?','分别问过去离开和将来返回。'])),
g('calendar','跨年月份的相对时间','资料中的本月是2026年11月，下下个月是？',choice(['2027年1月','2026年12月','2026年9月'],'2027年1月',{context:'This month: November 2026'}),'next month是12月，the month after next是次年1月；月份不按固定30天换算。','先找下个月，再向后一个月。',model(['This month: March. Next month: April.','The month after next: May.'])),
g('direction','目的地、出发地与所在位置','各按中文含义补词：飞往东京，从罗马到达。',fill([blank('fly','Tokyo',['to','from']),blank('arrive','Rome',['from','to'])],['to','from']),'to引出目的地，from引出来源；be in表示所在城市。','不要把出发地写成目的地。',model(['She will fly to Paris. She is from London.','to说去哪里，from说来自哪里。'])),
g('independent-perfect','独立判断事件已完成','选择正确表达“飞机刚到”的句子。',choice(['The plane has just arrived.','The plane has just arrive.','The plane has been arrived for two hours.'],'The plane has just arrived.'),'非延续动作可以用完成时表示已完成。'),
g('independent-state','独立表达持续拥有','手机2022年买的，现在仍归她，一直未转让。',fill([blank('She has','the phone since 2022.',['had','bought'])],['had']),'一直拥有用has had，不把单次购买拉长。'),
g('independent-question','94课独立组织将来提问','你什么时候返回伦敦？',bank(['When','will','you','return','to London','did'],'When will you return to London',5,'?'),'When will you return to London?问将来返回时间。'),
g('independent-contrast','独立区分时点与持续','书在星期一借入，至今一直未还。补全两种表达。',fill([blank('I','the book on Monday.',['borrowed','kept']),blank('I have','it since Monday.',['kept','borrowed'])],['borrowed','kept']),'借入事件与之后持续持有是两件相关但不同的事。')
];
unit.questions.apply=[
q('a-itinerary','按事件时间整理行程','把飞行手记中的记录配好。',match([['A week ago','Flew to Spain'],['At the moment','In Madrid'],['Next month','Will fly to New York']]),'三条来自不同时间，不能把未来计划写成已完成。'),
q('a-calendar','跨年月份与行程','资料说2026年12月的下下个月飞东京，应记在哪一月？',choice(['2027年2月','2027年1月','2026年10月'],'2027年2月',{context:'This month: December 2026\nTokyo: the month after next'}),'以资料给定的月份为准，跨年仍按月份先后。'),
q('a-return','询问返回时间','向飞行员问：你什么时候返回伦敦？',bank(['When','will','you','return','to London','from'],'When will you return to London',5,'?'),'When问时间，return to London表示返回伦敦。'),
q('a-book','把借书事件写成持续记录','今天星期三，Mia星期一借书后一直未还。记哪句？',choice(['Mia has kept the book for two days.','Mia will borrow the book next week.','Mia returned the book on Monday.'],'Mia has kept the book for two days.',{context:'Today: Wednesday\nMia borrowed the book on Monday.\nShe has not returned it and still has it.'}),'明确仍持有，才可写持续两天。'),
q('a-club','持续身份的完整结构','记录明确一直是会员。补全状态。',fill([blank('He has','a member of the club since 2019.',['been','joined'])],['been']),'has been a member表示持续成员身份。'),
q('a-companion','Who询问同行者','你想问谁陪Tom去，选对回应。',choice(['Lily will go with him.','Next Friday.','To Rome.'],'Lily will go with him.',{context:'Tom and Lily will fly to Rome next Friday.\nWho will go with Tom?'}),'Who问人，不能用时间或地点作答。'),
q('a-correction','94课B否定并更正目的地','实际计划去伦敦，不去东京。回答同伴的问题。',choice(['No, I won’t fly to Tokyo. I’ll fly to London.','Yes, I will fly to Tokyo.','No, I didn’t fly to London.'],'No, I won’t fly to Tokyo. I’ll fly to London.',{context:'Plan: London next week, not Tokyo.\nWill you fly to Tokyo next week?'}),'否定猜测并给出正确目的地，时间仍是将来。'),
q('a-proof','按完整经历核对持续状态','这台相机能写成“拥有到现在”吗？',choice(['不能，她后来已卖掉相机','能，买过就一直属于她','能，看到for就可以写has had'],'不能，她后来已卖掉相机',{context:'She bought the camera in 2020.\nShe sold it in 2021.\nNow: 2026.'}),'知道后续已经转让，就不能把拥有状态延长到现在。')
];
unit.questions.exam=[
q('e-now','当前地点与过去去向','哪条符合课文？',choice(['现在在Madrid，一星期前飞往Spain','现在在Tokyo，昨天飞往London','下个月去过New York了'],'现在在Madrid，一星期前飞往Spain'),'城市、国家与时间都要准确。'),
q('e-route','核对未来两段行程','配对原文的时间与地点。',match([['next month','New York'],['the month after next','Tokyo'],['the week after next','London']]),'去纽约、去东京和返回伦敦的时间不同。'),
q('e-nearly','保留范围限定','哪句准确转述Nigel的经历？',choice(['他去过世界上几乎每个国家','他去过所有国家，绝无例外','他还没有去过其他国家'],'他去过世界上几乎每个国家'),'不能把几乎说成全部，也不能说没有旅行经历。'),
q('e-fly','过去式与过去分词','昨天飞过；以前也有飞行经历。补好形式。',fill([blank('He','to Rome yesterday.',['flew','flown']),blank('He has','there before.',['flown','flew'])],['flew','flown']),'fly–flew–flown；明确过去时间与has后形式不同。'),
q('e-cities','城市词义合理抽样','配好这些城市名。',match([['Mumbai','孟买'],['Seoul','首尔'],['Sydney','悉尼']]),'完整城市表可在课本小参考中查看。'),
q('e-direction','来源与所在位置','他从Madrid来，现在在London。',fill([blank('He arrived','Madrid.',['from','to']),blank('He is','London now.',['in','to'])],['from','in']),'from说来源，in说所在城市。'),
q('e-rewrite','94课A改写过去与未来','依练习要求，将“去年去过”改为“明年将去”。补好动词。',fill([blank('She','to Paris last year.',['went','go']),blank('She will','to Paris next year.',['go','went'])],['went','go']),'这是变换时间的练习，不能说两句话描述同一件已发生的事。'),
q('e-year','后年跨年定位','资料中的今年为2024年，the year after next是哪一年？',choice(['2026年','2025年','2022年'],'2026年',{context:'This year: 2024'}),'后年是本年之后第二年，不取设备当前年份。'),
q('e-past-question','过去旅行独立提问','你去年什么时候飞往罗马？',bank(['When','did','you','fly','to Rome','last year','flew'],'When did you fly to Rome last year',6,'?'),'did后用fly原形。'),
q('e-future-question','将来旅行独立提问','他们什么时候返回悉尼？',bank(['When','will','they','return','to Sydney','returned'],'When will they return to Sydney',5,'?'),'When will问将来时间。'),
q('e-arrive','新情境持续在场','她八点来到图书馆，十点仍在，期间未离开。',choice(['She has been in the library for two hours.','She has arrived in the library for two hours.','She will arrive in two hours.'],'She has been in the library for two hours.'),'持续待在图书馆用has been in。'),
q('e-completed','非延续动作的完成时','刚买好一本书。哪句能正确表达购买已完成？',choice(['I have just bought a book.','I have just buy a book.','buy不能用于现在完成时'],'I have just bought a book.'),'完成时可以说一次购买已经发生。'),
q('e-own','独立表达持续拥有','2021年买的自行车，一直拥有到现在。',fill([blank('He has','the bike since 2021.',['had','bought'])],['had']),'表达持续拥有用has had。'),
q('e-keep','独立表达持续借用','书借来三个星期，一直没还。',fill([blank('She has','the book for three weeks.',['kept','borrowed'])],['kept']),'本题强调已经持续持有多久，用has kept。'),
q('e-away','独立表达持续离开','他们星期一起一直不在，还没回来。',fill([blank('They have','away since Monday.',['been','left'])],['been']),'持续不在用have been away。'),
q('e-film','播放中与结束后的对照','电影A仍在播放；电影B半小时前结束。',fill([blank('Film A has been','for twenty minutes.',['on','over']),blank('Film B has been','for half an hour.',['over','on'])],['on','over']),'on与over代表不同状态，不能混算持续时间。'),
q('e-member','独立表达持续成员身份','Ben于2018年入队，一直未退队。哪句说持续身份？',choice(['Ben has been a member of the team since 2018.','Ben will join the team in 2018.','Ben has left the team.'],'Ben has been a member of the team since 2018.'),'加入之后一直是成员，需要be a member of表达状态。'),
q('e-live','独立表达持续居住','2017年搬到伦敦，一直住到现在。',fill([blank('She has','in London since 2017.',['lived','moved'])],['lived']),'持续居住用has lived。'),
q('e-open','独立表达持续开放','窗户七点打开，一直没关。',fill([blank('We have','the window open since seven.',['kept','opened'])],['kept']),'keep the window open表达保持打开。'),
q('e-health','持续病情的两种表达','现在仍没好：病了两天，感冒三天。',fill([blank('She has','ill for two days.',['been','fallen']),blank('He has','a cold for three days.',['had','caught'])],['been','had']),'用be ill／have a cold说明持续状态。'),
q('e-up','独立表达起床后的状态','她七点起床，一直没再睡，现在九点。',fill([blank('She has been','for two hours.',['up','got up'])],['up']),'be up表示起床后的状态。'),
q('e-negative','否定完成时的一段时间','“I haven’t bought a book for a month.”说明？',choice(['这一个月没有买过书','一本书买了整整一个月','这句话因为有buy所以一定错误'],'这一个月没有买过书'),'一段时间内动作未发生可以用否定完成时表达。'),
q('e-evidence','后续事件限制持续推断','他八点离开，九点回来，现在十点。能说一直离开了两小时吗？',choice(['不能，九点已经回来了','能，只看八点离开就够了','能，任何left都换成been away'],'不能，九点已经回来了',{context:'Left: 8:00\nReturned: 9:00\nNow: 10:00'}),'必须核对持续状态是否中断。'),
q('e-94b','94课B保留from并更正来源','Tom下个月从Madrid来，不是Moscow。完整回应是？',choice(['No, he won’t arrive from Moscow. He’ll arrive from Madrid.','No, he won’t arrive to Moscow. He’ll arrive to Madrid.','Yes, he will arrive from Moscow.'],'No, he won’t arrive from Moscow. He’ll arrive from Madrid.'),'arrive from引出来源，不能改成目的地。'),
q('e-companion','同行者与时间地点分开','资料说Sam与Beth周五去Paris。问谁与Sam同行。',choice(['Beth.','On Friday.','Paris.'],'Beth.',{context:'Sam and Beth will go to Paris on Friday.\nWho will go with Sam?'}),'Who问人，不选时间或城市。'),
q('e-whole','综合核对已持续状态与未来安排','今天星期三，她周一返回且一直在家；明天才飞巴黎。正确记录是？',choice(['She has been at home for two days. She will fly to Paris tomorrow.','She has returned for two days. She flew to Paris yesterday.','She is in Paris now and has not returned.'],'She has been at home for two days. She will fly to Paris tomorrow.',''),'持续在家与未来航程分别表达，不把返回动作拉长。')
];
unit.learning.REFERENCE=[
'本课按“发生的动作”和“动作之后持续的状态”理解非延续性动词，不以背术语代替表达。He arrived at nine.说到达；He has been here for an hour.说持续在场。',
'非延续性动词可以用于现在完成时表示事情已完成：He has just returned.／I have bought a book. 本课限制的是把单次动作当作持续状态，而不是禁用整个词或整个时态。',
'说某状态一直持续到现在，资料要支持它未中断：来了之后没离开、借来的书还在手中、入队后仍是成员。材料缺少后续，不能自动改写成持续至今。',
'否定完成时可表示一段时间没有发生某事：He hasn’t come here for two weeks. 不能把肯定句中的单次动作限制机械套到否定句。',
'for接时长，since接起点。一般过去时说明过去某次事件；现在完成时可说明与现在相关的完成或持续状态。这里讨论的是单次事件，反复发生的动作要按具体语境另行分析。',
'When did you go…?／When will you go…?分别问过去与将来，did／will后都用原形。What问做什么，Who问谁，When问何时，不互换回答类别。',
'fly to Tokyo：飞往东京；arrive from Madrid：从马德里来；be in London：在伦敦。return已含返回的意思，通常不另加back重复表达。',
'next week／month／year是下一周／月／年，the week／month／year after next是下下周／月／后年。this week是否该用过去或将来，要看具体事件，不凭词面决定。月份与年份按日历顺序，不按固定天数折算。',
'94课A按例子改变事件时间和动词形式，不是同义转换；B给定不同目的地或出发地，先否定猜测再说明真正安排。练习册“以前做过，所以这次不做”须有明确的否定安排，不能从过去经历自行推断。',
'nearly every country不等于every country；usually不等于always。“幸运”是作者对旅行经历的评价，不能据此推断妻子的心情、意愿，也不能推广为所有人的幸福标准。'
];
unit.learning.STATE_MODELS=[
['arrive／come','be here','到达后一直在这里'],['leave','be away','离开后一直未返回'],['borrow','keep','借入后一直未归还'],['buy','have','买到后一直拥有'],['begin／start','be on','开始后仍在进行'],['finish','be over','结束后经过的时间'],['join','be in／be a member of','加入后仍是成员'],['move to','live in','搬入后持续居住'],['open something','keep something open','打开后一直未关闭'],['fall ill','be ill','开始生病后仍未好'],['catch a cold','have a cold','感冒状态持续'],['get up','be up','起床后保持醒着'],['die','be dead','死亡事件与其后的状态；由教师结合语境说明']
];
unit.learning.MODEL_TITLE='课本小参考 · 时间表与15座城市';
unit.learning.TIMES=[['过去','本期','下一期','下下期'],['last week','this week','next week','the week after next'],['last month','this month','next month','the month after next'],['last year','this year','next year','the year after next']];
unit.learning.MODELS=['Athens','Beijing','Berlin','Mumbai','Geneva','London','Madrid','Moscow','New York','Paris','Rome','Seoul','Stockholm','Sydney','Tokyo'].map(en=>{const word=WORDS.find(w=>w.en===en);return{en,cn:word.cn,image:word.image};});
unit.learning.WRITING=[
{title:'A · 用will改写为将来的事',instruction:'保留课本5题。按例子把过去时间改为对应的将来时间，动词也要改变；改写后不再是同一件过去的事。',examples:['He went to Beijing last year. → He will go to Beijing next year.'],items:['He went to New York last week.','She went to Sydney last month.','I went to Paris the year before last.','We went to Stockholm last year.','They went to Geneva the week before last.']},
{title:'B · 否定猜测，再说正确安排',instruction:'保留课本5题。括号给出真正的地点；保持主语、时间与to／from／in关系。',examples:['Will you go to Athens next week? (Beijing) → No, I won’t go to Athens next week. I’ll go to Beijing.'],items:['Will Helen return to Geneva next year? (Mumbai)','Will you fly to London tomorrow? (Geneva)','Will you and Tom go to Madrid next year? (London)','Will Tom arrive from Moscow next month? (Madrid)','Will Carol and Helen stay in New York next month? (Moscow)']}
];
core.unit9394=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit9394,excerpts={"u9394-v1-r-job":[0,1],"u9394-v1-r-now":[4],"u9394-v1-r-next":[2],"u9394-v1-r-after":[2,3],"u9394-v1-r-return":[5],"u9394-v1-r-past":[4],"u9394-v1-r-lucky":[6,7],"u9394-v1-r-wife":[6,7],"u9394-v1-e-now":[0,1,2,3,4,5,6,7],"u9394-v1-e-route":[2,3,4,5]},speakers={"narrator":""};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 93',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
