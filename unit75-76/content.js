(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit75-76/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页154–157／PDF187–190';
const grammarSource='《同步导学》Grammar纸页137／PDF151；《语法练习册》纸页214–219／PDF228–233';
const rows=[
['ago','以前','/əˈɡəʊ/','ago'],['buy','买','/baɪ/','buy'],['pair','双；对','/peə/','pair'],['fashion','流行式样','/ˈfæʃən/','fashion'],['uncomfortable','不舒服的','/ʌnˈkʌmftəbəl/','uncomfortable'],['wear','穿；戴','/weə/','wear'],
['bought','buy的过去式：买了','/bɔːt/','buy'],['wore','wear的过去式：穿着','/wɔː/','wear'],['size','尺码；大小','/saɪz/','size'],['black','黑色的','/blæk/','pair'],['in fashion','流行；时髦','/ɪn ˈfæʃən/','fashion'],['this week','本周','/ðɪs wiːk/','week'],
['last week','上周','/lɑːst wiːk/','week'],['last month','上个月','/lɑːst mʌnθ/','month'],['last year','去年','/lɑːst jɪə/','year'],['yesterday','昨天','/ˈjestədeɪ/','day'],['yesterday evening','昨天傍晚；昨天晚上','/ˈjestədeɪ ˈiːvnɪŋ/','evening'],['the day before yesterday','前天','/ðə deɪ bɪˈfɔː ˈjestədeɪ/','day'],
['the week before last','上上周','/ðə wiːk bɪˈfɔː lɑːst/','week'],['the month before last','上上个月','/ðə mʌnθ bɪˈfɔː lɑːst/','month'],['the year before last','前年','/ðə jɪə bɪˈfɔː lɑːst/','year'],['a minute ago','一分钟以前','/ə ˈmɪnɪt əˈɡəʊ/','clock'],['an hour ago','一小时以前','/ən ˈaʊə əˈɡəʊ/','clock'],['two days ago','两天以前','/tuː deɪz əˈɡəʊ/','ago'],
['three weeks ago','三周以前','/θriː wiːks əˈɡəʊ/','ago'],['in 2010','在2010年','/ɪn ˌtwenti ˈten/','year'],['When did …?','什么时候做了……？','/wen dɪd/','clock'],['comfortable','舒服的','/ˈkʌmftəbəl/','comfortable'],['a pair of shoes','一双鞋','/ə peə əv ʃuːz/','pair'],['shop assistant','售货员','/ˈʃɒp əˌsɪstənt/','assistant']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:art==='assistant'?'/assets/unit75-76/assistant.webp':image(art)}));
const unit={id:'unit75-76',version:1,contentRevision:'shoe-time-v1',mode:'classroom',title:'鞋店里的时间线索',path:'/unit75-76/',start:'learn/words',progress:{learningKey:'canran:unit75-76:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识鞋店线索',activities:[['words','鞋店小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进鞋店故事',activities:[['text','鞋店小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清过去时间',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'整理事件记录',activities:[['apply','时间记录员','give']],required:['apply']},
{id:'l5',title:'完成鞋店挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'shoe-time-v1',title:'时间线索小达人',lesson:'Lesson 75–76',scene:'/assets/unit75-76/keepsake-story-v1.webp',alt:'女士拿着自己的黑色样鞋，比较售货员展示的紫色鞋',color:'#805266',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','时间记录员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={lady:'Lady',assistant:'Shop assistant'};
unit.learning.DIALOGUE=[
['lady','Do you have any shoes like these?','像这样的鞋子你们有吗？'],
['assistant','What size?','什么尺码的？'],
['lady','Size five.','5号的。'],
['assistant','What colour?','什么颜色的？'],
['lady','Black.','黑色的。'],
['assistant',"I’m sorry. We don’t have any.",'对不起，我们没有。'],
['lady','But my sister bought this pair last month.','但是，我姐姐上个月买了这样的一双。'],
['assistant','Did she buy them here?','她是在这里买的吗？'],
['lady','No, she bought them in the U.S.','不，她是在美国买的。'],
['assistant',"We had some shoes like those a month ago, but we don’t have any now.",'一个月前我们有这样的鞋，但是现在没有了。'],
['lady','Can you get a pair for me, please?','您能为我找一双吗？'],
['assistant',"I’m afraid that I can’t. They were in fashion last year and the year before last. But they’re not in fashion this year.",'恐怕不行。这鞋在去年和前年时兴，而今年已不流行了。'],
['assistant','These shoes are in fashion now.','现在流行的是这种鞋子。'],
['lady','They look very uncomfortable.','这种鞋子看上去很不舒服。'],
['assistant','They are very uncomfortable. But women always wear uncomfortable shoes!','它们的确很不舒服。可是女人们总是穿不舒服的鞋子！']
].map(([who,text,cn],i)=>({id:'u7576-d'+(i+1),who,text,cn,source:textSource,...(i===14?{note:'这是售货员的说法，不能代表每个人的穿鞋选择。'}:{})}));
const q=(id,target,prompt,input,explanation,hint='')=>{
 const {context:material,...view}=input;
 return {id:'u7576-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};
};
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-pair','看图识别一双鞋','图中有多少鞋？',choice(['a pair of shoes','one shoe','three pairs of shoes'],'a pair of shoes',{image:image('pair'),imageAlt:'两只成对的黑色鞋'}),'pair表示一双或一对。'),
q('v-actions','辨别买穿与时间词','把词语和意思配好。',match([['buy','买'],['wear','穿；戴'],['ago','以前']]),'买是buy；穿戴是wear；ago表示以前。'),
q('v-fashion','理解in fashion','These shoes are in fashion. 是说鞋子怎样？',choice(['现在流行','一定很舒服','一定很便宜'],'现在流行'),'流行、舒服和价格是不同的事情。'),
q('v-uncomfortable','理解不舒服的感受','The shoes are uncomfortable. 她穿着感觉怎样？',choice(['不舒服','很舒适','看不见鞋子'],'不舒服'),'uncomfortable表示不舒服。'),
q('v-forms','联系新动词与过去式','把动作和它的过去式配好。',match([['buy','bought'],['wear','wore'],['have','had']]),'不规则过去式结合词义记忆。'),
q('v-size','辨别尺码提问','售货员问“What size?”，她应该回答什么？',choice(['Size five.','Black.','Last month.'],'Size five.'),'What size询问尺码。'),
q('v-ago','区分一段时间以前','a month ago表示什么？',choice(['一个月以前','在未来一个月内','每个月都这样'],'一个月以前'),'ago放在时间长度后，指从当时的现在向过去看。')
];
unit.questions.roles=[
q('r-request','合并鞋码与颜色两条信息','女士要找怎样的鞋？',choice(['黑色，5号','紫色，5号','黑色，6号'],'黑色，5号'),'她依次回答Size five和Black。'),
q('r-buyer','区分购买者与谈话者','谁上个月买了那双鞋？在哪里？',choice(['女士的姐姐，在美国','女士本人，在这家店','售货员，在美国'],'女士的姐姐，在美国'),'my sister是姐姐；in the U.S.是美国。'),
q('r-stock','理解过去与现在的库存','店里类似的鞋，过去和现在有什么变化？',choice(['一个月前有，现在没有','从来没有过','现在刚刚到货'],'一个月前有，现在没有'),'had some与don’t have any now形成对比。'),
q('r-time','理解去年前年与今年的对比','女士带来的这种样式，什么时候流行？',choice(['去年和前年','今年和明年','只有今年'],'去年和前年'),'last year and the year before last；今年不流行。'),
q('r-refusal','理解委婉拒绝','“I’m afraid that I can’t.” 在这里是什么意思？',choice(['恐怕不能帮她找到这一双','售货员害怕那位女士','店里现在有很多这种鞋'],'恐怕不能帮她找到这一双'),'I’m afraid…在这里用于委婉说明坏消息。'),
q('r-comfort','区分外观评价与明确回答','售货员承认他推荐的时尚鞋有什么问题？',choice(['穿着不舒服','不是一双鞋','从未流行过'],'穿着不舒服'),'They are very uncomfortable确认了不舒服。'),
q('r-view','区分角色说法与普遍事实','结尾售货员说女人总穿不舒服的鞋。我们能确定什么？',choice(['这是他的说法，不能代表每个人','所有女性都喜欢不舒服的鞋','女士已经买下推荐的鞋'],'这是他的说法，不能代表每个人'),'课文没有证明每个人都如此，也没有写购买成功。')
];
unit.questions.grammar=[
g('locate','找出完整过去时间短语','哪一组词说明购买发生在什么时候？',{type:'locate',fragments:[{value:'My sister'},' ',{value:'bought this pair'},' ',{value:'last month'},'.'],options:['My sister','bought this pair','last month'],answer:'last month'},'last month说明上个月。','找回答“什么时候”的部分。',model(['He called me last night.','last night说明昨晚。'])),
g('last','理解last加时间名词','把时间短语配好。',match([['last week','上周'],['last month','上个月'],['last year','去年']]),'last和week、month、year连用，指前一个相应时段。','留意周、月、年的不同。',model(['last night → 昨晚','last放在时间名词前。'])),
g('yesterday','yesterday和一天中的时段','“昨天晚上”怎样说？',choice(['yesterday evening','evening yesterday ago','last yesterday'],'yesterday evening'),'yesterday可放在morning、afternoon、evening前。','按“哪一天＋哪段时间”的顺序。',model(['yesterday morning','昨天早晨。'])),
g('ago-order','时间长度在ago之前','她两周前买了这些鞋。',bank(['She','bought','these shoes','two weeks','ago','last'],'She bought these shoes two weeks ago',5),'时间长度two weeks放在ago前。','把“两周”和“以前”按顺序放好。',model(['three days ago','三天以前：长度在前，ago在后。'])),
g('duration','时间长度的单复数与冠词','一分钟前；两分钟前。',fill([blank('a','ago',['minute','minutes']),blank('two','ago',['minutes','minute'])],['minute','minutes']),'a后用单数；two后用复数。','先看前面表示一个还是多个。',model(['an hour ago / five hours ago','一小时以前／五小时以前。'])),
g('clock','按明确钟点向过去推算','记录时间是下午4点。an hour ago是几点？',choice(['下午3点','下午5点','下午4点'],'下午3点'),'从下午4点向过去退一小时，是下午3点。','ago指以前，要往过去看。',model(['现在10点，two hours ago是8点。','以题目给出的时间为起点。'])),
g('year','in加明确的过去年份','记录发生在2010年的购买。',fill([blank('She bought the shoes','2010.',['in','ago','last'])],['in']),'明确年份前用in。','2010是年份，不是时间长度。',model(['We first met in 2008.','in＋明确的过去年份。'])),
g('before-day','分清前天与昨天','故事中今天是周三。the day before yesterday是哪天？',choice(['周一','周二','周四'],'周一'),'前天是今天之前两天。','先退到昨天，再退一天。',model(['今天周五，yesterday是周四。','the day before yesterday再往前一天。'])),
g('before-year','理解before last系列','故事中的今年是2026年。前年是哪一年？',choice(['2024年','2025年','2027年'],'2024年'),'the year before last是去年之前的一年。','先找去年，再往前一年。',model(['本月五月，the month before last是三月。','不是上个月，而是再前一个月。'])),
g('completed-week','this week配合已发生语境','现在是周五。Tom周一已经问过那个问题。',fill([blank('Tom','the question on Monday this week.',['asked','asks','ask'])],['asked']),'本周可以包含已经完成的动作。','看“已经问过”和具体的周一。',model(['It is Friday. I watched TV on Tuesday this week.','本周仍未结束，但周二的动作已发生。'])),
g('week-boundary','不靠this week单独判定过去','现在周一，活动还没开始，计划本周五举行。this week能证明活动已经发生吗？',choice(['不能，还要看事情是否发生','能，this week一律表示过去','能，只要出现week就是过去'],'不能，还要看事情是否发生'),'this week只确定本周，不能单独证明动作已完成。','同时看计划、已经和具体时间。',model(['this week表示本周。','已经做了与尚未开始，需要看上下文。'])),
g('when-question','When did后动词原形','问：你什么时候买了这双鞋？',fill([blank('When','you buy these shoes?',['did','do']),blank('When did you','these shoes?',['buy','bought'])],['did','buy']),'过去问句用When did＋主语＋原形。','过去的信息已由did表达。',model(['When did you meet her?','did后用meet，不用met。'])),
g('when-answer','When问句要回答时间','A: When did you wear them?\nB想说：昨天。',choice(['I wore them yesterday.','Yes, I did.','I wear them tomorrow.'],'I wore them yesterday.'),'When问什么时候，回答用过去动作和时间。','只说Yes不能回答什么时候。',model(['When did you arrive? — I arrived last night.','回答既说动作，也交代时间。'])),
g('habit-past','从日常动作改为昨天的事件','把“她每天去镇上”改成“昨天去了镇上”。',fill([blank('She','to town yesterday.',['went','goes']),blank('She went to town','.',['yesterday','every day'])],['went','yesterday']),'动词与时间都要随过去事件改变。','不要只改动词而留下every day。',model(['He swims every day. → He swam yesterday.','习惯和一次过去事件不同。'])),
g('independent-time','无示范核对相对时间','故事中今天是周四。她周二去过商店。选准确记录。',choice(['She went to the shop two days ago.','She went to the shop yesterday.','She goes to the shop tomorrow.'],'She went to the shop two days ago.'),'以故事中的周四计算，周二是两天前。'),
g('independent-when','无示范组合过去问答','记录：买鞋发生在去年。哪组问答完整准确？',choice(['When did you buy them? — I bought them last year.','When did you bought them? — I buy them last year.','When do you buy them? — Yes, I did.'],'When did you buy them? — I bought them last year.'),'did后用buy，回答用bought并说明去年。')
];
unit.questions.apply=[
q('a-calendar','从固定月份记录提取时间','故事中现在是五月，购物记录写着三月。什么时候买的？',choice(['the month before last','last month','next month'],'the month before last',{context:'Shopping record: March. Now: May.'}),'五月的上上个月是三月。'),
q('a-stock','核对过去与现在库存后更新牌子','该给这款黑鞋放哪张当前库存牌？',choice(['None now.','Some now.','Never had any.'],'None now.',{context:'We had some black shoes a month ago. We don’t have any now.'}),'现在没有，不表示过去从未有过。'),
q('a-year','用明确年份回答事件时间','记录显示在2014年开店。补全回答。',fill([blank('We opened the shop','2014.',['in','ago','last'])],['in']),'明确的年份前用in。'),
q('a-morning','区分已发生的今天与正在发生','现在是下午。上午10点洗过手。怎样记下来？',choice(['I washed my hands at ten this morning.','I wash my hands tomorrow.','I am washing my hands now.'],'I washed my hands at ten this morning.'),'今天也可以有已经完成的过去动作。'),
q('a-question','按材料组装When did问句','想知道对方什么时候看了那张照片。',bank(['When','did','you','look at','that photograph','looked at'],'When did you look at that photograph',5,'?'),'用When询问过去动作发生的时间。'),
q('a-week','将完整材料转成过去记录','现在周日晚上。本周每天都已经看过电视。选准确记录。',choice(['I watched television every day this week.','I watch television tomorrow.','I didn’t watch television this week.'],'I watched television every day this week.'),'every day this week在这里描述已经完成的观看。'),
q('a-two-events','结合时间和动作核对记录','周三整理记录：周一买鞋，周二穿鞋。哪条准确？',choice(['I bought them two days ago and wore them yesterday.','I wore them two days ago and bought them yesterday.','I buy them tomorrow and wear them now.'],'I bought them two days ago and wore them yesterday.'),'两个过去动作和各自时间必须对应。')
];
unit.questions.exam=[
q('e-words','独立区分核心词义','把词语配好。',match([['pair','双；对'],['fashion','流行式样'],['ago','以前']]),'核心词义各不相同。'),
q('e-wear','在语境中区分买与穿','昨天已经付钱买回了鞋，今天穿着它。哪个词表示“穿着”？',choice(['wear','buy','pair'],'wear'),'wear表示穿戴；buy表示买。'),
q('e-comfort','不把流行等同于舒服','These shoes are in fashion, but uncomfortable. 是什么意思？',choice(['它们流行，但不舒服','它们流行，所以一定舒服','它们不流行，也没有尺码'],'它们流行，但不舒服'),'but表示这里的转折。'),
q('e-facts','合并故事中的人物时地信息','哪条购买记录符合课文？',choice(['Sister · in the U.S. · last month','Lady · in this shop · yesterday','Shop assistant · in London · this year'],'Sister · in the U.S. · last month'),'姐姐上月在美国买了那双鞋。'),
q('e-timeline','区分过去库存与过去流行时间','一个月前，店里有什么？',choice(['类似女士样鞋的鞋','女士已经付过的钱','课文明确说只有紫色鞋'],'类似女士样鞋的鞋'),'库存时间是a month ago，流行时间是去年和前年。'),
q('e-which','理解these的现场指代','售货员说“These shoes are in fashion now.” 指什么？',choice(['他正在推荐的另一种鞋','女士姐姐去年穿的所有鞋','店里已经没有的黑色样式'],'他正在推荐的另一种鞋'),'末段介绍的是当时推荐的时尚鞋。'),
q('e-boundary','区分原文结尾与猜测','课文结尾可以确认什么？',choice(['推荐的鞋不舒服；没有交代买没买','女士买下了推荐的鞋','所有女性都喜欢不舒服的鞋'],'推荐的鞋不舒服；没有交代买没买'),'不能把人物概括当普遍事实，也不能添加购买结局。'),
q('e-last','独立使用last时间短语','记录“上周问过一个问题”。',fill([blank('I asked a question','week.',['last','ago','in'])],['last']),'last week是上周。'),
q('e-evening','独立理解昨天的时段','昨晚八点发生的事，可以用哪个短语？',choice(['yesterday evening','tomorrow morning','every afternoon'],'yesterday evening'),'yesterday evening指昨天晚上。'),
q('e-before','独立比较上周与上上周','上上周、上上个月、前年，配好它们。',match([['the week before last','上上周'],['the month before last','上上个月'],['the year before last','前年']]),'before last指前一个对应时段再往前。'),
q('e-ago','独立构成时间长度加ago','把“两天以前”填好。',fill([blank('two','ago',['days','day']),blank('two days','',['ago','last'])],['days','ago']),'数词two后复数days，ago放后面。'),
q('e-hours','固定钟点下理解ago','记录时间是上午11点。three hours ago是几点？',choice(['上午8点','下午2点','上午10点'],'上午8点'),'向过去退三个小时。'),
q('e-year','独立使用过去年份','他在2012年买了那辆车。',fill([blank('He bought the car','2012.',['in','ago','on'])],['in']),'年份前用in。'),
q('e-before-day','独立定位前天','故事中今天是周六。the day before yesterday是哪天？',choice(['周四','周五','周日'],'周四'),'前天是两天以前。'),
q('e-this-week','依语境判断本周已完成的事','今天周五，周二打过那些信。补全记录。',fill([blank('She','those letters on Tuesday this week.',['typed','types','type'])],['typed']),'this week中已经发生的动作可以用过去式。'),
q('e-future-week','辨别同一短语下尚未发生的事','今天周一，说好本周五再去商店。哪项判断成立？',choice(['this week不代表已经去过','this week证明已经去过','一出现week就必须用过去式'],'this week不代表已经去过'),'是否发生取决于具体语境。'),
q('e-when','独立组装When did问句','问：你什么时候穿了它们？',bank(['When','did','you','wear','them','wore'],'When did you wear them',5,'?'),'did后使用原形wear。'),
q('e-answer','独立回答When发生时间','When did you buy that pair? 已知：上个月买的。',choice(['I bought it last month.','Yes, I did.','I buy it tomorrow.'],'I bought it last month.'),'回答给出过去动作及时间；that pair可用it指代。'),
q('e-negative','区分didnt与肯定过去动作','昨天没买鞋；买了一顶帽子。',fill([blank('I didn’t','shoes yesterday.',['buy','bought']),blank('I','a hat.',['bought','buy'])],['buy','bought']),'didn’t后原形；肯定过去句使用bought。'),
q('e-habit','独立将习惯改为昨天的动作','把“他们每天喝牛奶”改成“他们昨天喝了牛奶”。',choice(['They drank some milk yesterday.','They drink some milk yesterday.','They drank some milk every day.'],'They drank some milk yesterday.'),'动词和时间一起改变。'),
q('e-record','从固定日期材料核对相对时间','记录日是周五。材料中谁是两天前去过店里的人？',choice(['Ann','Ben','Tom'],'Ann',{context:'Ann went on Wednesday. Ben went on Thursday. Tom went on Monday.'}),'周三距离记录日周五两天。'),
q('e-76','迁移76课动作与When问答','记录：她三天前擦了柜子。哪条问答正确？',choice(['When did she dust the cupboard? — She dusted it three days ago.','When did she dusted the cupboard? — She dust it three days ago.','When does she dust the cupboard? — Yes, she did.'],'When did she dust the cupboard? — She dusted it three days ago.'),'过去问句did＋原形；回答过去式＋时间。'),
q('e-summary','独立合并过去与现在的记录','店员写下：去年有这种鞋，现在没有。选准确记录。',choice(['We had these shoes last year, but we don’t have any now.','We have these shoes last year, but we had some now.','We never had these shoes, and we have some now.'],'We had these shoes last year, but we don’t have any now.'),'过去had、现在don’t have，信息与时间一致。')
];
unit.learning.MODELS=[
['109','photo','looked at a photograph','看了一张照片'],['110','jump','jumped off the wall','从墙上跳下'],['111','park','walked across the park','走过公园'],['112','wash','washed his hands','洗了手'],['113','office','worked in an office','在办公室工作'],['114','question','asked a question','问了一个问题'],['115','type','typed those letters','打了那些信'],['116','tv','watched television','看了电视'],['117','talk','talked to the salesman','和售货员交谈了'],['118','thanks','thanked her father','向她父亲道了谢'],['119','dust','dusted the cupboard','擦了柜子'],['120','paint','painted that bookcase','给那个书架刷了漆'],['121','bus-stop','waited at the bus stop','在公交车站等过'],['122','car','wanted a car like that one','想要一辆像那样的汽车'],['123','greet','greeted her','向她问了好']
].map(([label,art,en,result])=>({label,image:image(art),en,result}));
unit.learning.REFERENCE=[
'last＋时间名词：last week、last month、last year、last night。它们前面通常不另加in或on。',
'时间长度＋ago：a minute ago、an hour ago、two days ago。ago在后面，表示从说话时向过去看，不是将来。',
'in＋过去某年：in 2010。月份和年份不能一律按30天、365天计算。',
'yesterday、yesterday morning／afternoon／evening；the day before yesterday是前天，the night before last是前天夜里。',
'before last系列：the week before last上上周；the month before last上上个月；the year before last前年。',
'When did you buy them? — I bought them last month. 问句did后用原形，回答用过去式并交代时间。',
'句子要同时看时间和事情是否发生。this week本周、this morning今天早晨，既可能包含已经发生的动作，也可能谈尚未发生的事，不能只认关键词。',
'过去事实与现在状态可以在同一句中对比：We had some a month ago, but we don’t have any now.',
'本课不规则形式：buy→bought、wear→wore、have→had；复习meet→met、drink→drank、swim→swam、take→took、cut→cut。'
];
unit.learning.TIME_TABLE=[['本期',['this week','this month','this year']],['上一期',['last week','last month','last year']],['再前一期',['the week before last','the month before last','the year before last']],['一个时段以前',['a minute ago','an hour ago','a day ago','a week ago','a month ago','a year ago']],['多个时段以前',['two minutes ago','five hours ago','three days ago','two weeks ago','four months ago','six years ago']]];
unit.learning.WRITING_A=['She meets her friends every day.','They drink some milk every day.','He swims in the river every day.','She takes him to school every day.','He cuts himself every morning.'];
unit.learning.WRITING_B=['walk across the park / last week','wash your hands / a minute ago','work in an office / the year before last','ask a question / five minutes ago','type those letters / a month ago','watch television / every day this week','talk to the shop assistant / last month','thank your father / an hour ago','dust the cupboard / three days ago','paint that bookcase / the year before last','want a car like that one / a year ago','greet her / a minute ago'];
core.unit7576=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit7576,excerpts={"u7576-v1-r-request":[0,1,2,3,4,5],"u7576-v1-r-buyer":[6,7,8],"u7576-v1-r-stock":[6,7,8,9],"u7576-v1-r-time":[9,10,11],"u7576-v1-r-comfort":[12,13,14],"u7576-v1-e-facts":[6,7,8,9],"u7576-v1-e-boundary":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]},speakers={"lady":"Lady","assistant":"Shop assistant"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 75',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
