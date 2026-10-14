(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit85-86/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页174–177／PDF207–210';
const grammarSource='《同步导学》Grammar纸页150／PDF164；《语法练习册》纸页243–247／PDF257–261';
const rows=[
['Paris','巴黎','/ˈpærɪs/','paris'],['cinema','电影院','/ˈsɪnəmə/','cinema'],['film','电影','/fɪlm/','film'],['beautiful','美丽的','/ˈbjuːtɪfəl/','beautiful'],['city','城市','/ˈsɪti/','city'],['never','从来没有','/ˈnevə/','never'],
['ever','曾经','/ˈevə/','ever'],['just','刚刚','/dʒʌst/','just'],['awful','糟糕的','/ˈɔːfəl/','awful'],['all the time','一直','/ɔːl ðə taɪm/','rain'],['April','四月','/ˈeɪprəl/','april'],['spring','春天','/sprɪŋ/','spring'],
['been to','去过，已经回来','/biːn tə/','returned'],['gone to','去了，还没回来','/ɡɒn tə/','away'],['been in','一直待在某地','/biːn ɪn/','stay'],
['aired','使通风：air的过去式／过去分词','/eəd/','air'],['cleaned','清洁：clean的过去式／过去分词','/kliːnd/','clean'],['opened','打开：open的过去式／过去分词','/ˈəʊpənd/','open'],['sharpened','削尖：sharpen的过去式／过去分词','/ˈʃɑːpənd/','sharpen'],['turned on','打开了电器；也用于have turned on','/tɜːnd ɒn/','turn-on'],['listened to','听过；也用于have listened to','/ˈlɪsənd tə/','listen'],
['boiled','煮沸：boil的过去式／过去分词','/bɔɪld/','boil'],['answered','回答：answer的过去式／过去分词','/ˈɑːnsəd/','answer'],['emptied','倒空：empty的过去式／过去分词','/ˈemptid/','empty'],['asked','问：ask的过去式／过去分词','/ɑːskt/','ask'],['typed','打字：type的过去式／过去分词','/taɪpt/','type'],['washed','洗：wash的过去式／过去分词','/wɒʃt/','wash'],['walked','走：walk的过去式／过去分词','/wɔːkt/','walk'],['painted','刷漆：paint的过去式／过去分词','/ˈpeɪntɪd/','paint'],['dusted','掸灰：dust的过去式／过去分词','/ˈdʌstɪd/','dust']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit85-86',version:1,contentRevision:'cinema-paris-experiences-v1',mode:'classroom',title:'电影院外聊巴黎',path:'/unit85-86/',start:'learn/words',progress:{learningKey:'canran:unit85-86:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识电影与旅行',activities:[['words','电影旅行小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'聊聊巴黎的故事',activities:[['text','电影院小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'分清三种去向',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'整理行程和记录',activities:[['apply','行程小帮手','give']],required:['apply']},
{id:'l5',title:'完成见闻挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'cinema-paris-experiences-v1',title:'旅行见闻小达人',lesson:'Lesson 85–86',scene:'/assets/unit85-86/keepsake-story-v1.webp',alt:'电影院外，戴圆眼镜的George与拿票根的Ken聊起巴黎',color:'#8b7697',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','行程小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={george:'George',ken:'Ken'};
unit.learning.DIALOGUE=[
['george','Hello, Ken.','你好，肯。'],['ken','Hi, George.','嗨，乔治。'],
['george','Have you just been to the cinema?','你刚去过电影院吗？'],['ken','Yes, I have.','是的，我刚去过。'],
['george','What’s on?','在放映什么电影？'],['ken','Paris in the Spring.','《巴黎之春》。'],
['george','Oh, I’ve already seen it. I saw it on television last year. It’s an old film, but it’s very good.','噢，我已经看过了。我去年在电视上看的。这是部老电影，不过很好看。'],
['ken','Paris is a beautiful city.','巴黎是一座美丽的城市。'],
['george','I’ve never been there. Have you ever been there, Ken?','我从没去过那里。肯，你去过那里吗？'],
['ken','Yes, I have. I was there in April.','是的，我去过。我四月在那里。'],
['george','Paris in the spring, eh?','春天的巴黎，嗯？'],
['ken','It was spring, but the weather was awful. It rained all the time.','那时是春天，不过天气很糟。一直在下雨。'],
['george','Just like London!','就像伦敦一样！']
].map(([who,text,cn],i)=>({id:'u8586-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u8586-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-cinema','新词看图','“电影院”对应哪张图和英文？',choice(['cinema','city','film'],'cinema',{optionImages:{cinema:image('cinema'),city:image('city'),film:image('film')}}),'cinema是电影院；film是电影。'),
q('v-film','电影语境词义','电影院门口问“What’s on?”，想知道什么？',choice(['正在放映哪部电影','谁打开了门','现在几点了'],'正在放映哪部电影'),'这里问正在放映什么电影。'),
q('v-ever','新词词义配对','把三个词配好。',match([['ever','曾经'],['never','从来没有'],['beautiful','美丽的']]),'ever问曾经，never是否定经历，beautiful是美丽的。'),
q('v-paris','地点和类别','“Paris is a beautiful city.” 中city表示？',choice(['城市','电影','月份'],'城市'),'city是城市；Paris是城市的名字。'),
q('v-weather','糟糕天气的含义','“The weather was awful.” 说那时天气怎样？',choice(['很糟糕','一直晴朗','特别暖和'],'很糟糕'),'awful表示糟糕的。'),
q('v-time','频率词组语境','“It rained all the time.” 表示？',choice(['一直在下雨','从来不下雨','只下了一分钟'],'一直在下雨'),'all the time表示一直。'),
q('v-actions','86动作词义抽样','把三个动作配好。',match([['sharpened a pencil','削过铅笔'],['aired a room','给房间通过风'],['dusted a cupboard','给橱柜掸过灰']]),'这些是规则过去分词，也与各自过去式同形。'),
q('v-ordinal','86序数标注','第11和第15的标签，哪组正确？',choice(['11th / 15th','11st / 15nd','11 / 15'],'11th / 15th'),'第11是eleventh，第15是fifteenth；序数标签不代表发生时间。')
];
unit.questions.roles=[
q('r-film','识别电影名','Ken刚看的电影叫什么？',choice(['Paris in the Spring.','London in the Winter.','A Beautiful Cinema.'],'Paris in the Spring.'),'电影名是Paris in the Spring。'),
q('r-george','区分观影与旅行经历','George去过巴黎吗？',choice(['没有，他只是看过这部电影','去过，他四月在那里','去过，他去年住在那里'],'没有，他只是看过这部电影'),'George说I’ve never been there。'),
q('r-seen','观影渠道和时间','George怎样看过这部电影？',choice(['去年在电视上看过','刚刚在电影院看过','四月在巴黎影院看过'],'去年在电视上看过'),'I saw it on television last year。'),
q('r-month','人物与月份不混淆','谁在四月去过巴黎？',choice(['Ken','George','课文没有提到'],'Ken'),'Ken说I was there in April。'),
q('r-rain','旅行当时天气','Ken那次在巴黎时，天气如何？',choice(['一直下雨，天气很糟','每天晴朗温暖','一直下雪'],'一直下雨，天气很糟'),'It rained all the time。'),
q('r-opinion','不把老等同于不好','George如何评价那部电影？',choice(['虽然老，但很好看','因为老，所以不好看','还没看过，无法评价'],'虽然老，但很好看'),'It’s an old film, but it’s very good。'),
q('r-ending','末句比较的指向','George说“Just like London!”，接着谈的是什么？',choice(['Ken说的那次下雨天气','两座城市的电影院票价','Ken在伦敦住了多久'],'Ken说的那次下雨天气'),'他接着Ken的天气描述作比较；不是说每一天都这样。')
];
unit.questions.grammar=[
g('returned','去过并已回来','“Mia has been to Paris.” 在本课的经历用法里表示？',choice(['她去过巴黎，已经回来','她去了巴黎，还没回来','她从没去过巴黎'],'她去过巴黎，已经回来'),'have been to表示去过某地、现在已回来。','注意是否回来。',model(['Tom has been to the cinema. He is back now.','Tom去过电影院，现在回来了。'])),
g('away','去了尚未回来','Ben不在家，留言“He has gone to the cinema.” 表示？',choice(['他去电影院了，还没回来','他已经从电影院回到家','他从没去过电影院'],'他去电影院了，还没回来'),'have gone to表示去了，还未回来；仅这一句不能确定是否已到达。','现在家里找不到他。',model(['Amy has gone to Paris. She isn’t here.','Amy去巴黎了，还没回来。'])),
g('stay','在某地持续停留','“She has been in Paris for three days.” 说明？',choice(['她已在巴黎待了三天，现在仍在那里','她去过巴黎三次，已经回来','她三天后才去巴黎'],'她已在巴黎待了三天，现在仍在那里'),'have been in配合已持续时长，表示到现在仍待在那里。','三天是已持续的时间。',model(['He has been in London for two weeks.','他在伦敦已待了两周，现在仍在那里。'])),
g('preposition','to和in的不同用途','去过并回来；已待两天仍在那里。各填一处。',fill([blank('I have been','Paris twice.',['to','in']),blank('He has been','Paris for two days.',['in','to'])],['to','in']),'去过某地用been to；仍在某地已待一段时间用been in。','分清次数和持续停留。',model(['She has been to London once.','一次旅行经历'],['She has been in London for a week.','到现在已待了一周'])),
g('times','去过的次数','到目前为止，去过巴黎三次，每次都已回来。',fill([blank('I have','Paris three times.',['been to','gone to','been in'])],['been to']),'three times是去过的次数，配合been to。','这是已返回的经历。',model(['We have been to the cinema twice.','我们去过电影院两次。'])),
g('duration','持续到现在的时长','从四月起一直在巴黎，目前仍在那里。',fill([blank('She has','Paris since April.',['been in','been to','gone to'])],['been in']),'since April说明从四月延续至今，仍待在那里用been in。','这里不数去过几次。',model(['He has been in London for a month.','在伦敦已经待了一个月，现在还在那里。'])),
g('ever','ever询问旅行经历','你曾经去过巴黎吗？',bank(['Have','you','ever','been','to Paris','gone'],'Have you ever been to Paris',5,'?'),'询问到现在有没有去过：Have you ever been to…?','ever放在have与been之间。',model(['Has she ever been to London?','她曾经去过伦敦吗？'])),
g('never','never不叠加not','要说“我从来没去过巴黎”，哪个词多余？',{type:'locate',fragments:['I have ',{value:'not'},' ',{value:'never'},' ',{value:'been'},' to Paris.'],options:['not','never','been'],answer:'not'},'never已经表示从来没有，不再叠加not。','保留一个否定。',model(['She has never been to London.','她从来没去过伦敦。'])),
g('there','地点副词there前不用to','要说“我以前去过那里”，哪个词应去掉？',{type:'locate',fragments:['I have ',{value:'been'},' ',{value:'to'},' ',{value:'there'},' before.'],options:['been','to','there'],answer:'to'},'地点副词there前不加to：have been there。','there本身表示那里。',model(['Have you ever been there?','there前不加to。'])),
g('how-long','问持续多久','她现在仍在巴黎。问她已待多久。',bank(['How long','has','she','been','in Paris','to Paris'],'How long has she been in Paris',5,'?'),'How long问持续时长；仍在巴黎用been in。','问多长时间，不是几次。',model(['How long have you been in London?','你在伦敦待了多久？'])),
g('subject','have与has及简答','两位朋友都有旅行经历。补好问答。',fill([blank('','they been to Paris?',['Have','Has']),blank('Has Ken been there? Yes, he',' .',['has','have'])],['Have','has']),'they用have，he用has，简答呼应相应助动词。','分别看主语。',model(['Has she been to Paris? — Yes, she has.','she用has。'])),
g('when','经历提问后追问过去时间','朋友说去过巴黎。你想知道具体什么时候去的。',choice(['When did you go there?','Have you ever been there?','How long have you been there?'],'When did you go there?'),'先谈经历，再用一般过去时追问那次什么时候去。','问过去那次的时间。',model(['I’ve seen the film. — When did you see it?','看过后，再问那次何时看的。'])),
g('seen','see的过去式与过去分词','我已看过电影；去年看的。补好两句。',fill([blank('I have','the film.',['seen','saw']),blank('I','it last year.',['saw','seen'])],['seen','saw']),'see–saw–seen；have后接seen，明确去年用过去式saw。','不是两处都用同一形式。',model(['He has done it. He did it yesterday.','have后用过去分词；过去时间用过去式。'])),
g('past','did后用动词原形','他上个月去巴黎了吗？',fill([blank('','he',['Did','Has']),blank('','to Paris last month?',['go','went','gone'])],['Did','go']),'一般过去时问句用Did，后面的动作恢复原形go。','不要让助动词和动词一起变过去式。',model(['Did she see it last year?','Did后用see，不用saw。'])),
g('independent-return','撤去示范核对返程','Lily今天去过电影院，现在回家了。',choice(['Lily has been to the cinema.','Lily has gone to the cinema.','Lily has never been to the cinema.'],'Lily has been to the cinema.',{context:'Lily went to the cinema today.\nShe is back home now.'}),'已去过且已回来，用has been to。'),
g('independent-away','撤去示范不推断到达','“Tom has gone to Paris.” 仅这句能确定什么？',choice(['他去巴黎了，还没有回来','他此刻一定已站在巴黎街上','他已从巴黎回到这里'],'他去巴黎了，还没有回来'),'gone to说明去后未回，也可能仍在途中，不能单凭它断定已经到达。'),
g('independent-stay','撤去示范用持续记录','Ben周一到巴黎，一直住在那里，现在周四。',choice(['Ben has been in Paris since Monday.','Ben has been to Paris three times.','Ben has never been in Paris.'],'Ben has been in Paris since Monday.',{context:'Arrived: Monday\nNow: Thursday\nStill staying in Paris.'}),'since Monday标明开始时间；一直停留到现在。'),
g('independent-meanings','三种含义独立对照','把句子与对应情况配好。',match([['She has been to Paris.','去过，已经回来'],['She has gone to Paris.','去了，还没回来'],['She has been in Paris for a week.','已在巴黎待了一周，仍在那里']]),'依据是否返回、是否持续停留区分三种表达。')
];
unit.questions.apply=[
q('a-back','依据返程留言更新行程','Amy已回家。选一句记下她今天的行程。',choice(['She has been to the cinema.','She has gone to the cinema.','She has never been to the cinema.'],'She has been to the cinema.',{context:'Amy’s note\nI went to the cinema today.\nI am back home now.'}),'留言明确已回家，用has been to。'),
q('a-away','根据去向替人留言','Ben不在这里，他去电影院了，还没回来。',bank(['Ben','has','gone','to the cinema','been'],'Ben has gone to the cinema',4),'has gone to表示去后未返回。'),
q('a-stay','持续停留明信片','Mia现在仍在伦敦，已经待了三天。补好明信片。',{...fill([blank('I have been','London',['in','to']),blank('','three days.',['for','since'])],['in','for']),context:'Mia’s postcard\nLondon — arrived three days ago\nI am still here now.'},'been in表示持续停留，for后接三天这段时长。'),
q('a-film','看电影不等于旅行','请按记录回答：“Has Anna been to Paris?”',choice(['No, she hasn’t.','Yes, she has.','Yes, she is.'],'No, she hasn’t.',{context:'Anna has seen a film about Paris.\nShe has never been to Paris.'}),'见过电影画面，不代表去过那个地方。'),
q('a-questions','为三个问题配回应','旅行记录的三个问题，各配一句回答。',match([['Have you ever been to Paris?','Yes, I have.'],['When did you go there?','Last April.'],['How long have you been in London?','For three days.']]),'ever问经历，When did问过去时间，How long问持续多久。'),
q('a-done','86动作已做与未做','房间通风了，鞋子还没清洁。补好记录。',{...fill([blank('I have already','the room.',['aired','air']),blank('I','cleaned my shoes yet.',['haven’t','have'])],['aired','haven’t']),context:'Today’s checklist\nAir the room ✓ done\nClean the shoes ✗ not done'},'have＋过去分词；未做用haven’t…yet。'),
q('a-clock','86先说已做再交代何时','现在15:00。早上9:00已打好信。哪组汇报正确？',choice(['I’ve already typed the letter. I typed it at nine this morning.','I’ve already typed the letter. I have typed it at nine yesterday.','I haven’t typed the letter. I typed it tomorrow.'],'I’ve already typed the letter. I typed it at nine this morning.',{context:'Now: 15:00\nLetter typed: today, 09:00'}),'先说已完成，再用过去时说明今天早上九点的那次动作。'),
q('a-homework','时间词作用对象不机械判断','昨天布置的作业，你现在已做完。补好问答。',{...fill([blank('Have you','yesterday’s homework?',['done','did']),blank('Yes, I have. I','it last night.',['did','done'])],['done','did']),context:'The homework was set yesterday.\nYou finished it last night.'},'yesterday’s修饰homework；问是否做好可用Have…done。last night说明完成的过去时间，用did。')
];
unit.questions.exam=[
q('e-story','完整故事人物事实','哪条记录符合课文？',choice(['Ken去过巴黎，George没去过','George和Ken都从没去过巴黎','George四月去过巴黎，Ken没去过'],'Ken去过巴黎，George没去过'),'Ken有巴黎经历；George说从未去过。'),
q('e-film','电影与经历独立区分','George看过什么？在哪里、何时看的？',choice(['《巴黎之春》，去年在电视上','《巴黎之春》，今天在电影院','《伦敦之春》，四月在巴黎'],'《巴黎之春》，去年在电视上'),'on television last year。'),
q('e-weather','材料天气与城市评价','Ken说巴黎很美，那次的天气却怎样？',choice(['一直下雨','一直下雪','天天晴朗'],'一直下雨'),'It rained all the time。'),
q('e-actions','86过去分词独立识义','配好三项动作记录。',match([['emptied the basket','倒空过篮子'],['answered the telephone','接过电话'],['turned on the television','打开过电视']]),'动作记录要对应正确的物件。'),
q('e-ordinal','序数13独立识别','课本格子标为“第13”，用哪个标签？',choice(['13th','13rd','30th'],'13th'),'第13是thirteenth，缩写13th。'),
q('e-return','依据往返事实判断经历','Leo昨天去看电影，昨晚已回家，现在在家。',choice(['He has been to the cinema.','He has gone to the cinema.','He has never been to the cinema.'],'He has been to the cinema.',{context:'Leo: cinema yesterday → home last night\nNow: at home'}),'已经返回，用has been to概括经历。'),
q('e-gone','去后未回与在途可能','Sue去巴黎了，还没回来。哪句准确？',choice(['Sue has gone to Paris.','Sue has been to Paris and is back here.','Sue has never left home.'],'Sue has gone to Paris.',{context:'Sue left for Paris.\nShe has not come back yet.'}),'gone to说明去了未回，不强加是否到达的事实。'),
q('e-stay','新材料判断持续停留','Tom一周前到伦敦，一直住到现在。',choice(['He has been in London for a week.','He has been to London seven times.','He is going to London next week.'],'He has been in London for a week.',{context:'Arrived in London: one week ago\nStill staying there now.'}),'已在某地持续一周，用has been in。'),
q('e-preposition','地点介词独立两空','第一句谈回来的经历；第二句谈现在仍在那里的时长。',fill([blank('We have been','London once.',['to','in']),blank('She has been','London since Friday.',['in','to'])],['to','in']),'次数经历用to；持续停留用in。'),
q('e-times','次数与持续时长区别','“He has been to Paris twice.” 里的twice表示？',choice(['去过两次','在那里待了两天','两天后才出发'],'去过两次'),'twice是次数，不是持续两天。'),
q('e-duration','for与since的参照不同','到现在一直待在巴黎。填好两种说法。',fill([blank('She has been in Paris','two weeks.',['for','since']),blank('She has been in Paris','Monday.',['since','for'])],['for','since']),'for接一段时间，since接开始时间。'),
q('e-ever','独立提问旅行经历','她曾经去过伦敦吗？',bank(['Has','she','ever','been','to London','Have'],'Has she ever been to London',5,'?'),'Has＋she＋ever＋been to…?。'),
q('e-never','独立纠正双重否定','要说“我们从没去过巴黎”，去掉哪个词？',{type:'locate',fragments:['We have ',{value:'not'},' ',{value:'never'},' ',{value:'been'},' to Paris.'],options:['not','never','been'],answer:'not'},'never自带否定，不叠加not。'),
q('e-there','there前介词独立纠错','“She has been to there before.” 中哪个词多余？',{type:'locate',fragments:['She has ',{value:'been'},' ',{value:'to'},' ',{value:'there'},' before.'],options:['been','to','there'],answer:'to'},'been there不加to。'),
q('e-how-long','独立构造持续时长问句','你现在仍在巴黎。问你已待多久。',bank(['How long','have','you','been','in Paris','to Paris'],'How long have you been in Paris',5,'?'),'How long have you been in…?。'),
q('e-subject','复数主语与has区分','Ken和George都看过电影。补好句子与简答。',fill([blank('Ken and George','seen the film.',['have','has']),blank('Has Ken seen it? Yes, he',' .',['has','have'])],['have','has']),'并列两个人用have；he简答用has。'),
q('e-when','完成时经历后追问过去','你已知道朋友去过巴黎。问那次什么时候去。',choice(['When did you go there?','Have you ever been there?','How long have you been there?'],'When did you go there?'),'具体过去那次的时间用When did…?。'),
q('e-seen','独立选过去分词和过去式','我们已看过电影，上周看的。',fill([blank('We have','the film.',['seen','saw']),blank('We','it last week.',['saw','seen'])],['seen','saw']),'have后用seen；last week那次用saw。'),
q('e-did','过去问句原形独立判断','她去年去过那里吗？',fill([blank('Did she','there last year?',['go','went','gone'])],['go']),'Did后用原形go。'),
q('e-done','86已有结果与当前要求','窗户已经打开。别人说“Open the window!”时，你怎样回应？',choice(['I’ve already opened it.','I haven’t opened it yet.','I opened it tomorrow.'],'I’ve already opened it.'),'已经做了，用I’ve already＋过去分词回应。'),
q('e-time','86明确过去时间','你已洗手。补充说明五分钟前洗的。',fill([blank('I have washed my hands. I','them five minutes ago.',['washed','have washed','washing'])],['washed']),'明确过去五分钟前，用过去式washed。'),
q('e-homework','时间词修饰名词并非时态线索','问“昨天布置的作业，现在做好了吗？”',fill([blank('Have you','yesterday’s homework?',['done','did','do'])],['done']),'yesterday’s修饰作业；Have后仍用过去分词done。'),
q('e-reply','按实际经历作否定简答','“Has Amy ever been to Paris?” 请按记录回答。',choice(['No, she hasn’t.','Yes, she has.','No, she didn’t.'],'No, she hasn’t.',{context:'Amy has visited London.\nShe has never been to Paris.'}),'去过伦敦不能证明去过巴黎；Has问句用hasn’t简答。'),
q('e-meanings','三种意义综合配对','给三条行程记录配上情况。',match([['I have been to the cinema.','我去过电影院，现已回来'],['He has gone to the cinema.','他去电影院了，还没回来'],['We have been in London for two days.','我们已在伦敦待了两天，仍在那里']]),'是否返回与是否持续停留，是这三种表达的核心区别。')
];
const ordinals=['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','13th','14th','15th'];
const actions=['aired the room','cleaned the shoes','opened the window','sharpened the pencil','turned on the television','listened to the radio','boiled an egg','answered the telephone','emptied the basket','asked a question','typed a letter','washed my hands','walked across the park','painted the bookcase','dusted the cupboard'];
unit.learning.MATERIALS=rows.slice(15).map(([en,cn,,art],i)=>({en,cn,art,ordinal:ordinals[i],action:actions[i]}));
unit.learning.REFERENCE=[
'have／has been to：去过某地，已经回来。She has been to Paris twice.（她去过巴黎两次。）一次once，两次twice，三次three times。',
'have／has gone to：去了某地，还没回来。He has gone to the cinema.（他去电影院了。）这句话本身不能确定他已到达，也可能仍在途中。',
'have／has been in：一直待在某地。She has been in Paris for a week.表示她已在巴黎待了一周，现在仍在那里。for接一段时间，since接开始时间，如since April。',
'问经历：Have you ever been to Paris? — Yes, I have.／No, I haven’t.。问已持续多久：How long have you been in Paris?。never本身表示从来没有，不再叠加not。',
'地点副词there前不加to：I’ve never been there.；城市名是名词：I’ve been to Paris.。不要只按主语或一个时间词猜去向，要先看是否回来、是否仍在那里。',
'先谈已做：I’ve already seen the film.；再说过去何时：I saw it last year.。追问那次时间用When did you see it?。see–saw–seen；go–went–gone；do–did–done；be–was／were–been。',
'86课规则动词的过去分词通常与过去式相同，但句子结构不同：I’ve already opened it.／I opened it an hour ago.。明确过去时间的动作用一般过去时。',
'yesterday’s homework指昨天布置的作业，yesterday’s在修饰名词。Have you done yesterday’s homework?仍可询问当前是否完成；I did it last night.说明完成的过去时间。',
'序数：first、second、third、fourth、fifth、sixth、seventh、eighth、ninth、tenth、eleventh、twelfth、thirteenth、fourteenth、fifteenth。课本1st–15th是格子标注，不自动表示动作发生的先后。'
];
unit.learning.WRITING_A_EXAMPLES=['She has already aired the room.','She aired it this morning.'];
unit.learning.WRITING_A=['She ____ just boiled an egg.','She ____ boiled it a minute ago.','She ____ never been to China, but he was there in 1992.','He ____ already painted that bookcase.','He ____ painted it a week ago.','She ____ emptied the basket this morning.','He ____ just dusted the cupboard.'];
unit.learning.WRITING_B_EXAMPLES=['Air the room! (this morning) → I’ve already aired the room. I aired the room this morning.'];
unit.learning.WRITING_B=[['Clean your shoes!','last night'],['Open the window!','an hour ago'],['Sharpen your pencil!','a minute ago'],['Turn on the television!','ten minutes ago'],['Boil the milk!','yesterday morning'],['Empty the basket!','yesterday'],['Ask a question!','two minutes ago'],['Type that letter!','this morning'],['Wash your hands!','five minutes ago'],['Walk across the park!','an hour ago'],['Paint that bookcase!','a year ago'],['Dust the cupboard!','this afternoon']];
core.unit8586=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
