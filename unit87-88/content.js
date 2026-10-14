(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit87-88/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页178–181／PDF211–214';
const grammarSource='《同步导学》Grammar纸页152／PDF166；《语法练习册》纸页248–252／PDF262–266';
const rows=[
['attendant','接待员','/əˈtendənt/','clipboard'],['bring','带来；送来','/brɪŋ/','bring'],['garage','修理厂；车库','/ˈɡærɑːʒ/','garage'],['crash','碰撞','/kræʃ/','crash'],['lamp-post','路灯柱','/ˈlæmp pəʊst/','lamp-post'],['repair','修理','/rɪˈpeə/','repair'],
['try','努力；设法','/traɪ/','try'],['brought','bring的过去式／过去分词','/brɔːt/','bring'],['mechanic','机械师；修理工','/məˈkænɪk/','repair'],['ready','准备好的','/ˈredi/','ready'],['yet','还；已经（用于本课疑问句、否定句）','/jet/','yet'],['still','仍然','/stɪl/','still'],
['finish','完成','/ˈfɪnɪʃ/','finish'],['truth','实情；真相','/truːθ/','truth'],['bought','buy的过去式／过去分词','/bɔːt/','buy'],['found','find的过去式／过去分词','/faʊnd/','find'],['got','get的过去式／过去分词','/ɡɒt/','get'],['had','have的过去式／过去分词','/hæd/','breakfast'],
['heard','hear的过去式／过去分词','/hɜːd/','news'],['left','leave的过去式／过去分词','/left/','leave'],['lost','lose的过去式／过去分词','/lɒst/','lost'],['made','make的过去式／过去分词','/meɪd/','bed'],['met','meet的过去式／过去分词','/met/','meet'],['sent','send的过去式／过去分词','/sent/','letter'],
['swept','sweep的过去式／过去分词','/swept/','sweep'],['told','tell的过去式／过去分词','/təʊld/','truth']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:en==='attendant'?'/assets/unit87-88/attendant-card.webp':image(art)}));
const unit={id:'unit87-88',version:1,contentRevision:'garage-progress-past-v1',mode:'classroom',title:'修理厂里的进度单',path:'/unit87-88/',start:'learn/words',progress:{learningKey:'canran:unit87-88:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'走进修理厂',activities:[['words','修理厂小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'看看Wood的车',activities:[['text','修理厂小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'已经做了，何时做的',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'整理完成进度',activities:[['apply','维修记录小帮手','give']],required:['apply']},
{id:'l5',title:'完成进度挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},reward:{edition:'garage-progress-past-v1',title:'进度记录小达人',lesson:'Lesson 87–88',scene:'/assets/unit87-88/keepsake-story-v1.webp',alt:'修理厂里，Wood与接待员查看进度单和仍有凹痕的汽车',color:'#578987',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','维修记录小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={wood:'Mr. Wood',attendant:'接待员'};
unit.learning.DIALOGUE=[
['wood','Is my car ready yet?','我的车修好了吗？'],
['attendant','I don’t know, sir. What’s the number of your car?','我不知道，先生。您的车牌号码是多少？'],
['wood','It’s LFZ 312 G.','是LFZ 312 G。'],
['attendant','When did you bring it to us?','您什么时候把车送来的？'],
['wood','I brought it here three days ago.','我三天前把它送到这里的。'],
['attendant','Ah yes, I remember now.','啊，对了，我现在想起来了。'],
['wood','Have your mechanics finished yet?','你们的修理工修好了吗？'],
['attendant','No, they’re still working on it. Let’s go into the garage and have a look at it.','没有，他们还在修。我们到车库里看看吧。'],
['attendant','Isn’t that your car?','那不是您的车吗？'],
['wood','Well, it was my car.','嗯，它以前是我的车。'],
['attendant','Didn’t you have a crash?','您不是撞车了吗？'],
['wood','That’s right. I drove it into a lamp-post. Can your mechanics repair it?','是的。我把车撞到路灯柱上了。你们的修理工能修好它吗？'],
['attendant','Well, they’re trying to repair it, sir. But to tell you the truth, you need a new car!','嗯，他们正设法修呢，先生。不过说实话，您需要一辆新车了！']
].map(([who,text,cn],i)=>({id:'u8788-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u8788-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-garage','新词看图','“修理厂”对应哪张图和英文？',choice(['garage','lamp-post','repair'],'garage',{optionImages:{garage:image('garage'),'lamp-post':image('lamp-post'),repair:image('repair')}}),'garage在本课指修理厂。'),
q('v-attendant','角色词义','attendant在这段故事中是谁？',choice(['接待员','车主','医生'],'接待员'),'接待员询问车牌和送修时间。'),
q('v-actions','新词动作配对','把三个动作配好。',match([['bring','带来'],['repair','修理'],['try','设法']]),'bring是带来，repair是修理，try在这里是设法。'),
q('v-crash','碰撞词义','“have a crash”在本课表示？',choice(['发生碰撞','买了一辆车','给车加油'],'发生碰撞'),'have a crash是发生碰撞。'),
q('v-lamp','撞到的物体','选出路灯柱。',choice(['lamp-post','garage','car'],'lamp-post',{optionImages:{'lamp-post':image('lamp-post'),garage:image('garage'),car:image('car')}}),'lamp-post是路灯柱。'),
q('v-still','仍在进行的含义','“They’re still working on it.” 表示？',choice(['他们仍在修理','他们已经离开了','他们从没动过它'],'他们仍在修理'),'still表示仍然。'),
q('v-ready','完成情况问句','“Is my car ready yet?” 想知道什么？',choice(['车现在修好没有','车三天前多少钱','车牌写在哪里'],'车现在修好没有'),'ready yet在本情境中询问目前是否修好。'),
q('v-truth','表达真实情况','“to tell you the truth”表示？',choice(['说实话','等一会儿','忘掉这件事'],'说实话'),'to tell you the truth是说实话。')
];
unit.questions.roles=[
q('r-plate','核对车牌','Wood的车牌是什么？',choice(['LFZ 312 G','LFZ 321 G','LZF 312 G'],'LFZ 312 G'),'Wood说It’s LFZ 312 G。'),
q('r-when','送修时间','Wood什么时候把车送来的？',choice(['三天前','刚刚','三周前'],'三天前'),'I brought it here three days ago。'),
q('r-status','当前维修状态','接待员说，修理工现在在做什么？',choice(['仍在修这辆车','已经交还修好的车','正在替Wood买新车'],'仍在修这辆车'),'They’re still working on it。'),
q('r-where','原文转场','接待员接下来带Wood去哪里看车？',choice(['车库里','电影院里','Wood家里'],'车库里'),'Let’s go into the garage。'),
q('r-crash','事故对象','Wood的车撞到了什么？',choice(['路灯柱','另一辆车','修理厂大门'],'路灯柱'),'I drove it into a lamp-post。'),
q('r-try','尝试不等于完成','结尾的“trying to repair it”能说明什么？',choice(['正在设法修，未说明已修好','车已经修好','车已经换成新的了'],'正在设法修，未说明已修好'),'trying to repair不是已经修好的结果。'),
q('r-ending','不虚构故事结局','接待员说Wood需要新车。课文说他已经买了吗？',choice(['没有，课文没有说买了新车','买了，接待员已交给他','买了，就在三天前'],'没有，课文没有说买了新车'),'表达建议不代表购买已经发生。')
];
unit.questions.grammar=[
g('result','当前结果与过去事实','“I have lost my key. I can’t open the door.” 重点是什么？',choice(['钥匙现在找不到，开不了门','过去某一天几点丢的','说明明天会丢钥匙'],'钥匙现在找不到，开不了门'),'现在完成时可把过去发生的事与现在的结果联系起来。','看后一句现在的情况。',model(['She has found her pen. She can write now.','她已找到钢笔，现在能写了。'])),
g('form','过去分词与过去式','已经送来；昨天送来的。各填一处。',fill([blank('I have','the car here.',['brought','bring']),blank('I','it here yesterday.',['brought','have brought'])],['brought','brought']),'have后接过去分词；明确说昨天那次用一般过去时。bring的两种过去形式都为brought。','先看结构，再看事件时间。',model(['She has seen the film. She saw it last week.','have后seen；上周那次用saw。'])),
g('subject','have与has及简答','修理工们已经完成了。补全问答。',fill([blank('','the mechanics finished yet?',['Have','Has']),blank('Yes, they',' .',['have','has'])],['Have','have']),'the mechanics指多个人，用have，简答也用have。','先数主语是几个人。',model(['Has the boss left yet? — Yes, he has.','the boss对应he，用has。'])),
g('not-yet','尚未完成的否定','车还没修好。拼好句子。',bank(['They','haven’t','repaired','the car','yet','have'],'They haven’t repaired the car yet',5),'haven’t＋过去分词＋yet，表示到现在还没完成。','保留一个否定。',model(['She hasn’t found her pen yet.','她还没找到钢笔。'])),
g('still','完成与仍在进行','进度单写着“仍在修理”。该怎样回答？',choice(['No, they haven’t. They’re still working on it.','Yes, they have. It is ready.','They finished it yesterday.'],'No, they haven’t. They’re still working on it.',{context:'Have they finished yet?\nStatus: still working on the car.'}),'still working明确说明正在做；不能把开始做了当成已经完成。','按进度单当前状态回答。',model(['Have you washed the dishes? — No, I haven’t. I’m still washing them.','还在洗，因此尚未完成。'])),
g('when','追问完成的过去时间','朋友说已经见过Mrs. Jones。你想问那次何时见的。',choice(['When did you meet her?','Have you met her yet?','Where does she live?'],'When did you meet her?'),'完成时先问有没有做；追问过去那次何时用When did＋原形。','这次问具体过去时间。',model(['I have found my pen. — When did you find it?','已找到，再问那次什么时候找到。'])),
g('did','Did后用原形','他上周买了房子吗？',fill([blank('','he',['Did','Has']),blank('','a house last week?',['buy','bought'])],['Did','buy']),'一般过去时问句Did后用动词原形buy。','Did已经承担过去时变化。',model(['Did she meet him yesterday?','Did后用meet，不用met。'])),
g('negative','过去否定句原形','要说“他昨天没有离开”，哪个词需要换成原形？',{type:'locate',fragments:['He ',{value:'didn’t'},' ',{value:'left'},' ',{value:'yesterday'},'.'],options:['didn’t','left','yesterday'],answer:'left'},'didn’t后用leave，不用left。','寻找动作词。',model(['She didn’t find her pen.','didn’t后用find。'])),
g('irregular','88课不规则变化','给原形配上过去式／过去分词。',match([['buy','bought'],['send','sent'],['sweep','swept']]),'这些动词的过去式和过去分词同形，但不是加ed。','每一对都配完再提交。',model(['meet → met → met','见面：两种过去形式相同。'])),
g('past-time','明确过去时间','现在是下午三点。说今天早上七点半吃的早饭。',fill([blank('I','breakfast at half past seven this morning.',['had','have had','having'])],['had']),'明确指过去早上七点半那次，用一般过去时。','题目已给出现在是下午。',model(['It is afternoon now. She left at nine this morning.','现在是下午，回顾早上九点离开。'])),
g('duration','过去持续到现在','从十年前起一直住在这里，现在仍住这里。',choice(['He has lived here for ten years.','He lived here ten years ago and moved away.','He will live here next year.'],'He has lived here for ten years.'),'现在完成时也表示过去开始、持续至今；并非动作都已结束。','现在还在住。',model(['She has worked here for two years. She still works here.','她已在这里工作两年，现在仍在。'])),
g('closed-duration','for不机械决定时态','她在伦敦住过三年，去年已搬走。',fill([blank('She','in London for three years. She moved away last year.',['lived','has lived'])],['lived']),'明确已经结束的过去经历，用一般过去时；for也能用于这种句子。','三年那段生活已经结束。',model(['He worked there for two years. Then he left.','做过两年后来离开，是过去已结束的一段。'])),
g('since','since从句过去起点','从去年搬来起一直住在这里。',fill([blank('He has lived here since he','here last year.',['moved','has moved','moves'])],['moved']),'主句说持续至今；since后的起点事件用一般过去时。','搬来是已发生的起点。',model(['She has worked here since she left school.','一直工作到现在；离校是过去的起点。'])),
g('just','刚刚与明确过去的片刻','按本课英式表达补好两句。',fill([blank('She has just','the bed.',['made','make']),blank('She','it just now.',['made','has made'])],['made','made']),'has just＋过去分词；just now在本题指刚才那个过去时点。','先看has后需要什么，再看just now。',model(['He has just sent it. He sent it just now.','先说刚寄好，再把事情放在刚才。'])),
g('independent-result','撤去示范判断当前结果','窗户现在干净了。选出表达已完成的句子。',choice(['I have cleaned the window.','I will clean the window tomorrow.','I am still cleaning the window.'],'I have cleaned the window.',{context:'Cleaning: finished\nThe window is clean now.'}),'已完成且有当前结果，用have cleaned。'),
g('independent-status','撤去示范按状态回答','回答“Has Tom sent the letter yet?”',choice(['No, he hasn’t.','Yes, he has.','No, he didn’t.'],'No, he hasn’t.',{context:'The letter is on Tom’s desk.\nHe has not sent it.'}),'尚未寄出，Has问句用No, he hasn’t。'),
g('independent-question','撤去示范过去时间问句','你什么时候听到这个消息的？',bank(['When','did','you','hear','the news','heard'],'When did you hear the news',5,'?'),'When did＋you＋hear；Did后用原形。'),
g('independent-duration','撤去示范区分已结束和仍持续','第一人仍住这里；第二人已搬走。各填一处。',fill([blank('Amy','here for five years. She still lives here.',['has lived','lived']),blank('Ben','there for five years. He moved away in 2020.',['lived','has lived'])],['has lived','lived']),'持续至今与过去已结束的一段要分开判断，不能只看for。')
];
unit.questions.apply=[
q('a-working','按状态登记维修进度','给这辆车登记当前进度。',choice(['Not finished yet.','Finished yesterday.','Ready to collect.'],'Not finished yet.',{context:'Car A · Repair record\nThe mechanic is still repairing the car.'}),'明确仍在修理，登记尚未完成。'),
q('a-finished','按记录写已完成','Car B已修好。替接待员拼好留言。',bank(['We','have','repaired','your car','haven’t'],'We have repaired your car',4),'进度明确已修好，用have repaired。'),
q('a-when','将过去时间归入送修事件','今天星期四；送修单写着星期一。补全对话。',fill([blank('When did you','it here?',['bring','brought']),blank('I','it here three days ago.',['brought','bring'])],['bring','brought']),'周四回顾周一是三天前；did后原形bring，答句过去式brought。'),
q('a-no-proof','开始时间不能冒充完成证据','只知道九点开始修。现在能填“已修好”吗？',choice(['不能，还需要知道当前进度','能，开始了就算完成','能，开始时间写得很清楚'],'不能，还需要知道当前进度',{context:'Car C · Repair record\nStarted: 09:00\nCurrent status: not recorded'}),'开始时间本身不证明已经完成，也不证明还没完成。'),
q('a-followup','完成后追问时间配对','把每个问题配上合适回答。',match([['Have you met Mrs. Jones yet?','Yes, I have.'],['When did you meet her?','Two weeks ago.'],['Has the boss left yet?','No, he hasn’t.']]),'有没有完成与具体何时是两种不同问题。'),
q('a-breakfast','两种时态各司其职','现在下午两点。给早饭记录补两处。',fill([blank('I have','breakfast.',['had','have']),blank('I','it at half past seven this morning.',['had','have had'])],['had','had']),'have had说吃过；过去七点半那次用had。'),
q('a-news','按记录写过去的否定','记录说她昨天没听到消息，今天才听到。',bank(['She','didn’t','hear','the news','yesterday','heard'],'She didn’t hear the news yesterday',5),'didn’t＋hear；这里否定的是昨天那次。'),
q('a-duration','从进度资料判断持续工作','Sam从2020年开始在这家修理厂工作，现在仍在。',choice(['Sam has worked here since 2020.','Sam worked here and left in 2020.','Sam will start here next year.'],'Sam has worked here since 2020.'),'过去开始持续至今，用has worked与since起点。')
];
unit.questions.exam=[
q('e-plate','原文车牌与送修时间','哪张送修记录符合Wood的原话？',choice(['LFZ 312 G · three days ago','LFZ 321 G · three days ago','LFZ 312 G · three weeks ago'],'LFZ 312 G · three days ago'),'车牌与送修时间两项都要吻合。'),
q('e-accident','原文事故对象','Wood把车撞到了哪里？',choice(['路灯柱上','另一辆车上','修理厂门上'],'路灯柱上'),'原文说into a lamp-post。'),
q('e-ending','原文结局不添加事实','课文结束时，能确认哪项？',choice(['修理工还在尝试修理','Wood已买好新车','车已完全修好'],'修理工还在尝试修理'),'原文未交代修好或购买新车。'),
q('e-result','新材料当前结果','书包现在找到了。哪句与记录一致？',choice(['I have found my bag.','I have lost my bag.','I will find my bag tomorrow.'],'I have found my bag.',{context:'Bag: found\nIt is beside me now.'}),'已找到且现在就在身边。'),
q('e-forms','过去式与过去分词独立两空','到现在见过他；上周见的。',fill([blank('We have','him.',['met','meet']),blank('We','him last week.',['met','have met'])],['met','met']),'meet–met–met，两处同形但时态结构不同。'),
q('e-subject','不同主语完成时问答','补好她的问句和他们的简答。',fill([blank('','she finished yet?',['Has','Have']),blank('Have they left? Yes, they',' .',['have','has'])],['Has','have']),'she用has，they用have。'),
q('e-status','依据实际状态回答','“Have they repaired the bike yet?”',choice(['No, they haven’t.','Yes, they have.','No, they didn’t.'],'No, they haven’t.',{context:'Bike: not ready\nThey are still repairing it.'}),'仍在修且没准备好，完成时否定简答。'),
q('e-negative','尚未完成独立拼句','我们还没有发出这封信。',bank(['We','haven’t','sent','the letter','yet','send'],'We haven’t sent the letter yet',5),'haven’t＋sent＋yet。'),
q('e-still','开始不证明结果','工单只有“十分钟前开始”。哪项判断可靠？',choice(['还不能确定是否修好','一定已经修好','一定还没修好'],'还不能确定是否修好',{context:'Started ten minutes ago.\nCompletion status: unknown.'}),'缺少完成状态，不能由开始时间推断。'),
q('e-when','问那次何时的独立辨别','朋友说已经找到了钥匙。你想知道找到的时间。',choice(['When did you find it?','Have you found it yet?','What colour is it?'],'When did you find it?'),'When did追问过去那次时间。'),
q('e-did','过去问句原形独立运用','他昨天得到电视机了吗？',fill([blank('Did he','a television yesterday?',['get','got','gets'])],['get']),'did后用get。'),
q('e-past-negative','独立定位过去否定错误','要说“我昨天没扫地”，哪个词要换成原形？',{type:'locate',fragments:['I ',{value:'didn’t'},' ',{value:'swept'},' the floor ',{value:'yesterday'},'.'],options:['didn’t','swept','yesterday'],answer:'swept'},'didn’t后用sweep。'),
q('e-question','独立拼过去时间问句','老板什么时候离开的？',bank(['When','did','the boss','leave','left'],'When did the boss leave',4,'?'),'When did the boss leave?。'),
q('e-irregular','88课不规则形式抽样','配好三组原形与过去式／过去分词。',match([['hear','heard'],['lose','lost'],['tell','told']]),'hear–heard，lose–lost，tell–told。'),
q('e-past-time','已经发生的具体过去时间','两分钟前她找到了钢笔。',fill([blank('She','her pen two minutes ago.',['found','has found','find'])],['found']),'明确过去两分钟前的事实，用found。'),
q('e-breakfast','have实义动词与助动词','“Have you had breakfast yet?” 中had表示？',choice(['吃早饭这一动作','拥有一个叫breakfast的东西','将来才打算吃'],'吃早饭这一动作'),'第一个Have构成完成时，had是have breakfast的过去分词。'),
q('e-duration','新材料持续到现在','Lily两年前开始在这里工作，现在仍在。',choice(['She has worked here for two years.','She worked here and left two years ago.','She will work here in two years.'],'She has worked here for two years.'),'持续至今，用has worked。'),
q('e-closed','for与已结束过去经历','Ben曾在那里住两年，去年搬走了。',fill([blank('Ben','there for two years. He moved away last year.',['lived','has lived'])],['lived']),'生活那一段已经结束，用lived。'),
q('e-since','since过去起点独立两空','从离校起一直在这里工作，现在仍在。',fill([blank('She','worked here since she left school.',['has','have']),blank('He has worked here since he','school.',['left','has left'])],['has','left']),'持续主句has worked，起点事件left school。'),
q('e-just-now','just now过去时点','按本课表达：他刚才把信寄了。',fill([blank('He','the letter just now.',['sent','has sent','send'])],['sent']),'本题just now指刚才那个过去时点，用sent。'),
q('e-lost','过去事实不等于无现在影响','“I lost my key yesterday. I still can’t find it.” 能成立吗？',choice(['能：过去丢的，现在仍没找到','不能：过去时表示现在一定找到了','不能：yesterday只能配完成时'],'能：过去丢的，现在仍没找到'),'一般过去时把丢钥匙放在昨天，并不保证现实影响已消失。'),
q('e-meet','88问答从完成转向具体时间','补全两周前见面这件事。',fill([blank('Have you met Mrs. Jones yet? Yes, I',' .',['have','did']),blank('When did you meet her? I','her two weeks ago.',['met','have met'])],['have','met']),'先完成时简答，再一般过去时交代具体时间。'),
q('e-news','保留已结束时间的否定','“She heard the news yesterday.” 改成否定。',choice(['She didn’t hear the news yesterday.','She hasn’t heard the news yesterday.','She didn’t heard the news yesterday.'],'She didn’t hear the news yesterday.'),'过去否定didn’t后恢复原形hear。'),
q('e-finished','两种问法配合不同回答','给问题配回答。',match([['Has she made the bed yet?','Yes, she has.'],['When did she make it?','At eight this morning.'],['Have you swept the floor yet?','No, I haven’t.']]),'完成问句与过去时间问句各有对应回答。'),
q('e-now-past','完整表达完成后说明过去时间','现在下午三点。地已扫好，早上九点扫的。',choice(['I’ve swept the floor. I swept it at nine this morning.','I haven’t swept the floor yet. I’ll do it tomorrow.','I’ve swept the floor at nine this morning.'],'I’ve swept the floor. I swept it at nine this morning.'),'先说已扫好，再用过去时说明早上那次。')
];
unit.learning.MODELS=[
['Have you met Mrs. Jones yet?','Yes, I have.','When did you meet her?','I met her two weeks ago.'],
['Has the boss left yet?','Yes, he has.','When did he leave?','He left ten minutes ago.'],
['Have you had breakfast yet?','Yes, we have.','When did you have it?','We had it at half past seven.'],
['Has she found her pen yet?','Yes, she has.','When did she find it?','She found it an hour ago.']
];
unit.learning.FORMS=[['buy','bought','bought'],['find','found','found'],['get','got','got'],['have','had','had'],['hear','heard','heard'],['leave','left','left'],['lose','lost','lost'],['make','made','made'],['meet','met','met'],['send','sent','sent'],['sweep','swept','swept'],['tell','told','told']];
unit.learning.REFERENCE=[
'现在完成时：have／has＋过去分词。I have found my pen.说已经找到，联系现在的情况；一般过去时：I found it an hour ago.把找到这件事放在过去的具体时间。',
'问完成：Have you met her yet? — Yes, I have.／No, I haven’t.。问过去那次：When did you meet her? — I met her two weeks ago.。has用于he／she／it或单个人，have用于I／you／we／they等。',
'过去问句与否定句：Did he buy a house?／He didn’t buy a house.。did／didn’t后用原形，不重复变过去式；肯定句用He bought a house.。',
'尚未完成：They haven’t finished yet.；仍在做：They’re still working on it.。try to repair是设法修，不保证已修好。开始时间不等于完成状态。',
'现在完成时也能表示从过去持续到现在：He has lived here for ten years.（仍住这里）；He lived there for ten years and then moved away.说过去已结束的一段。for本身不决定时态。',
'since可接过去的起点事件：She has worked here since she left school.。主句持续至今，left school是已发生的起点。for接一段时长，since接起点。',
'本课英式用法：I have just sent it.；I sent it just now.。already、yet等要结合句意，不机械背一个词只能配一种时态。this morning也要知道说话时点；本课回顾早晨的题目明确现在是下午。',
'一般过去时不保证事情对现在没有影响：I lost my key yesterday. I still can’t find it.是成立的。时态说明说话者怎样叙述，不替代真实事件的结果。',
'Have you had breakfast yet?中第一个Have构成完成时，had表示吃早饭。have–had–had；bring–brought–brought；drive–drove–driven。88课其余12组动词在课本小参考中。'
];
unit.learning.WRITING_A_EXAMPLES=['He bought a house last year. → Did he buy a house last year? → He didn’t buy a house last year.'];
unit.learning.WRITING_A=['He found his pen a minute ago.','He got a new television last week.','We heard the news on the radio.','They left this morning.','He lost his umbrella yesterday.','I swept the floor this morning.'];
unit.learning.WRITING_B_EXAMPLES=['they / buy a new house / two weeks ago → Have they bought a new house yet? → Yes, they have already bought a new house. → When did they buy a new house? → They bought a new house two weeks ago.'];
unit.learning.WRITING_B=[['he / meet Mrs. Jones','two weeks ago'],['the boss / leave','ten minutes ago'],['he / have breakfast','at half past seven'],['she / find her pen','an hour ago'],['he / get a television','two weeks ago'],['she / hear the news','yesterday'],['she / make the bed','this morning'],['he / send the letter','the day before yesterday'],['she / sweep the floor','yesterday morning'],['she / tell him the truth','last night']];
core.unit8788=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
