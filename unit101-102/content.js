(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit101-102/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页206–209／PDF239–242';
const grammarSource='《同步导学》Grammar纸页174／PDF188及练习175／189；《语法练习册》纸页290–295／PDF304–309';
const rows=[['Scotland','苏格兰','/ˈskɒtlənd/','scotland'],['card','明信片（本课词义）','/kɑːd/','card'],['youth','青年','/juːθ/','youth'],['hostel','招待所；旅馆','/ˈhɒstəl/','hostel'],['association','协会','/əˌsəʊsiˈeɪʃən/','association'],['soon','不久','/suːn/','soon'],['write','写','/raɪt/','write'],['wrote','write的过去式','/rəʊt/','write'],['written','write的过去分词','/ˈrɪtən/','write'],['Youth Hostel','青年招待所','/juːθ ˈhɒstəl/','hostel'],['Y.H.A.','青年招待所协会的缩写','/waɪ eɪtʃ eɪ/','association'],['member','成员','/ˈmembə/','member'],['speak up','大声一点说','/spiːk ʌp/','speak-up'],['letter','信','/ˈletə/','letter'],['hear','听见','/hɪə/','hear'],['hope','希望','/həʊp/','hope'],['well','身体好的（本课词义）','/wel/','well'],['stay','暂住；停留','/steɪ/','hostel'],['arrive','到达','/əˈraɪv/','arrive'],['else','其他；另外','/els/','else'],['never','从不','/ˈnevə/','never'],['hardly','几乎不','/ˈhɑːdli/','hardly'],['few','很少；几乎没有（可数）','/fjuː/','few'],['a few','有几个（可数）','/ə fjuː/','few'],['little','很少；几乎没有（不可数）','/ˈlɪtəl/','little'],['a little','有一点（不可数）','/ə ˈlɪtəl/','little'],['unhappy','不高兴的','/ʌnˈhæpi/','unhappy'],['impossible','不可能的','/ɪmˈpɒsəbəl/','impossible']];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit101-102',version:1,contentRevision:'postcard-tags-v1',mode:'classroom',title:'来自Jimmy的明信片',path:'/unit101-102/',start:'learn/words',progress:{learningKey:'canran:unit101-102:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识明信片词语',activities:[['words','明信片小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'一起读明信片',activities:[['text','明信片小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'转述与核对',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'传递准确消息',activities:[['apply','消息小帮手','give']],required:['apply']},
{id:'l5',title:'完成消息挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'card',storyQuestion:'收到Jimmy的明信片，Grandmother是否显得高兴？为什么？',completionTitles:{listen:'明信片词语认清啦！',roles:'明信片故事读懂啦！',grammar:'转述与核对练好啦！',apply:'消息核对完成啦！',exam:'消息挑战完成！'},reward:{edition:'postcard-tags-v1',title:'消息核对小达人',lesson:'Lesson 101–102',scene:'/assets/unit101-102/keepsake-story-v1.webp',alt:'Penny为Grandmother读Jimmy的明信片',color:'#788e69',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','消息小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={grandmother:'Grandmother',penny:'Penny'};
unit.learning.DIALOGUE=[
['grandmother','Read Jimmy’s card to me please, Penny.','Penny，请把Jimmy的明信片念给我听听。'],
['penny','‘I have just arrived in Scotland and I’m staying at a Youth Hostel.’','“我刚到苏格兰，我现在住在一家青年招待所。”'],
['grandmother','Eh?','什么？'],
['penny','He says he’s just arrived in Scotland. He says he’s staying at a Youth Hostel. You know he’s a member of the Y.H.A.','他说他刚到苏格兰。他说他现在住在一家青年招待所。您知道，他是Y.H.A.的一个成员。'],
['grandmother','The what?','什么？'],
['penny','The Y.H.A., Mum. The Youth Hostels Association.','Y.H.A.，妈妈。青年招待所协会。'],
['grandmother','What else does he say?','他还说了些什么？'],
['penny','‘I’ll write a letter soon. I hope you are all well.’','“我很快会写信的。祝你们大家身体都好。”'],
['grandmother','What? Speak up, Penny. I’m afraid I can’t hear you.','什么？Penny，大声一点。我可听不见你念的。'],
['penny','He says he’ll write a letter soon. He hopes we are all well. ‘Love, Jimmy.’','他说他很快会写信的。他祝我们大家身体都好。“爱你们的Jimmy。”'],
['grandmother','Is that all? He doesn’t say very much, does he?','就这些吗？他没写多少，是吗？'],
['penny','He can’t write very much on a card, Mum.','在明信片上他写不了很多，妈妈。']
].map(([who,text,cn],i)=>({id:'u101102-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u101102-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-card','明信片词义','哪一个词表示本课的“明信片”？',choice(['card','letter','hostel'],'card',{optionImages:{card:image('card'),letter:image('letter'),hostel:image('hostel')}}),'本课card指明信片，letter是信，hostel是旅馆。'),
q('v-words','旅途与组织词义','把三个词配好。',match([['youth','青年'],['association','协会'],['member','成员']]),'Youth Hostels Association是课文中的组织名称。'),
q('v-place','Scotland地点词','Scotland在本课指什么？',choice(['苏格兰','明信片','协会'],'苏格兰'),'按课文地名理解，不把它当作旅馆的名字。'),
q('v-soon','soon的词义定位','点出表示“不久”的词。',{type:'locate',fragments:['I’ll ',{value:'write'},' a letter ',{value:'soon'},'.'],options:['write','soon'],answer:'soon'},'soon表示不久，没有给出具体日期。'),
q('v-speak','speak up的含义','Grandmother说Speak up, Penny.，是在请求什么？',choice(['请Penny说大声一点','请Penny站到楼上','请Penny停止阅读'],'请Penny说大声一点'),'结合她说听不见，不逐词把up译成上楼。'),
q('v-write','write的变化','配好动词形式。',match([['write','原形'],['wrote','过去式'],['written','过去分词']]),'write—wrote—written。'),
q('v-well','well在问候中的意义','I hope you are all well.中的well表示？',choice(['身体好','一口水井','写得很长'],'身体好'),'本课用于问候健康状况。'),
q('v-hardly','否定意义的词语','He can hardly hear.表示什么？',choice(['他几乎听不见','他听得非常清楚','他听得很努力'],'他几乎听不见'),'hardly不是hard的同义词；它含有否定意味。')
];
unit.questions.roles=[
q('r-roles','原作者与朗读者分开','谁写了明信片，谁在朗读？',choice(['Jimmy写，Penny读','Penny写，Jimmy读','Grandmother写，Penny读'],'Jimmy写，Penny读'),'引号里的I属于Jimmy，不是正在朗读的Penny。'),
q('r-place','到达地与住宿地','明信片说Jimmy在哪里暂住？',choice(['苏格兰的一家青年招待所','Grandmother的家','Penny的花园'],'苏格兰的一家青年招待所'),'Scotland是到达地，Youth Hostel是暂住的地方。'),
q('r-association','缩写全称','课文怎样解释Y.H.A.？',choice(['The Youth Hostels Association.','The Young Holiday Airport.','Your Home Address.'],'The Youth Hostels Association.'),'保留课文组织全称，不把历史课文说明当作今天的入住规定。'),
q('r-hope','收信群体的指代','Penny说He hopes we are all well.，we指谁？',choice(['Penny和Grandmother等收信的一方','只有Jimmy本人','旅馆里的所有工作人员'],'Penny和Grandmother等收信的一方'),'Jimmy原话的you是收信人，Penny转述时把自己包括在we中。'),
q('r-hear','请求大声说的原文理由','Grandmother明确说为什么要大声一点？',choice(['她听不见Penny念的内容','她不认识所有字母','她要求Jimmy立即回家'],'她听不见Penny念的内容'),'原文说can’t hear；不能据此补写医学诊断或生气原因。'),
q('r-future','将来承诺与结果','明信片里关于写信的消息是什么？',choice(['Jimmy说不久会写信','Jimmy已经寄来一封长信','Jimmy明确说永远不写信'],'Jimmy说不久会写信'),'没有后续信件到达的情节。'),
q('r-reaction','用原话支持有限的情绪推断','哪种判断最有Grandmother结尾的话作依据？',choice(['她似乎觉得写得太少：问“就这些吗”','她明确说非常满意，而且没有疑问','她明确说不喜欢Jimmy'],'她似乎觉得写得太少：问“就这些吗”'),'教材问是否显得高兴；结尾可推断不太满意字数，不扩大为不喜欢Jimmy。'),
q('r-card','结尾解释的范围','Penny怎样解释写得不多？',choice(['明信片上写不了很多','Jimmy根本不会写字','Jimmy讨厌自己的家人'],'明信片上写不了很多'),'on a card限定载体，不把写不了很多推成不会写字。')
];
unit.questions.grammar=[
g('quote','区分原话与转述','引号中的I是谁？',choice(['写明信片的Jimmy','正在读的Penny','正在听的Grandmother'],'写明信片的Jimmy',{context:'Jimmy’s card: “I have just arrived in Scotland.”\nPenny is reading the exact words aloud.'}),'直接引用保留原说话人的视角；朗读者不自动变成I。','谁写下了这句话？',model(['Anna’s note: “I am tired.”','Ben朗读原话时，I仍指Anna。'])),
g('person','转述中的人称和反身形式','别人转述Ann现在的话，补好两处。',{...fill([blank('Ann says she','enjoying',['is','am']),blank('',' .',['herself','myself'])],['is','herself']),context:'Ann says: “I am enjoying myself.”\nYou are reporting Ann’s words.'},'I改为she时，am改为is，myself也相应改成herself。','检查两个指代是否仍指同一个人。',model(['Tom says he is enjoying himself.','人称、be与反身形式一起核对。'])),
g('recipients','收信人包括转述者时用we','Penny向Grandmother转述问候。',{...fill([blank('He hopes','are all well.',['we','they','he'])],['we']),context:'Jimmy writes to Penny and Grandmother: “I hope you are all well.”\nPenny is one of the recipients and is speaking to Grandmother.'},'you是收信的一方；Penny把自己包含进去，所以说we。','转述者是否也属于收信人？',model(['Leo writes to May and Ben: “I hope you are well.”','May对Ben说：He hopes we are well.'])),
g('tense','现在转述按原消息保留时间','现在转述两条不同时间的消息。',{...fill([blank('She says she','yesterday.',['arrived','arrives']),blank('She says she','tomorrow.',['will leave','left'])],['arrived','will leave']),context:'Today is Tuesday. Anna says: “I arrived on Monday. I will leave on Wednesday.”'},'says不要求所有从句现在时，也不自动把将来改成过去。','先找两件事各在什么时候。',model(['He says he is staying here now.','正在暂住、过去到达和将来离开要分别保留。'])),
g('change','区分忠实转述与更新完成状态','A仍在进行，B已经做完；分别填。',{...fill([blank('A: She says she','the door.',['is shutting','has shut']),blank('B: She says she','the door.',['has shut','is shutting'])],['is shutting','has shut']),context:'A: Anna is shutting the door now. It is not shut yet.\nB: Later, the door is shut. Anna has finished.'},'正在关门和已经关好是不同状态；必须有新的完成条件才更新时态。','看是否已经完成，不能只看says。',model(['He is drinking his milk. → He says he is drinking his milk.','后来喝完：He says he has drunk his milk.（状态已改变）'])),
g('that','that在本课常可省略','哪一组转述都可表达同一条消息？',choice(['He says he is tired. / He says that he is tired.','He says is tired. / He says that tired.','He says he tired. / He say is tired.'],'He says he is tired. / He says that he is tired.'),'常见转述陈述句中that可省略，但主语和谓语不能随意删掉。','省略的是连接词，还是句子必要成分？',model(['She hopes we are well. / She hopes that we are well.','这里保留或省略that都可以。'])),
g('be','be反意问句的极性和代词','按本课常见核对句式补好问尾。',fill([blank('This card is small,','?',['isn’t it','is it']),blank('These cards aren’t blank,','?',['are they','aren’t they'])],['isn’t it','are they']),'常见核对型：前肯后否，前否后肯；this card用it，cards用they。','先找be，再看肯否与单复数。',model(['The letter is long, isn’t it?','The letters aren’t long, are they?'])),
g('do','实义动词的do与does','补全一般现在时的核对问句。',fill([blank('Penny reads the card,','?',['doesn’t she','isn’t she']),blank('They don’t live here,','?',['do they','does they'])],['doesn’t she','do they']),'没有be或其他助动词时，按一般现在时和主语使用do／does。','不要把所有问尾都写成is。',model(['Ben writes letters, doesn’t he?','We don’t write often, do we?'])),
g('past','一般过去时的did','按常见反意问句补全。',fill([blank('She wrote yesterday,','?',['didn’t she','doesn’t she','wasn’t she'])],['didn’t she']),'wrote是实义动词过去式，问尾用did。','先辨认陈述部分的时态。',model(['They arrived last night, didn’t they?','问尾的助动词与过去事件相配。'])),
g('perfect','完成时用have或has核对','补好完成时问尾。',fill([blank('He has arrived,','?',['hasn’t he','doesn’t he']),blank('They haven’t finished,','?',['have they','haven’t they'])],['hasn’t he','have they']),'完成时已有have／has，问尾保留相应助动词。','找已有的助动词，不看最后一个词。',model(['She has written, hasn’t she?','We haven’t left, have we?'])),
g('modal','情态动词与将来问尾','根据句中已有的can或will补全。',fill([blank('Penny can hear,','?',['can’t she','doesn’t she']),blank('Jimmy won’t leave today,','?',['will he','won’t he'])],['can’t she','will he']),'用原句对应的情态或将来助动词，肯否相反。','won’t展开是什么？',model(['He can help, can’t he?','She won’t forget, will she?'])),
g('there','there be的问尾保留there','补全这个存在句的核对问尾。',fill([blank('There is a card on the table,','?',['isn’t there','isn’t it','doesn’t it'])],['isn’t there']),'there be结构的问尾仍用there。','句子不是This card is…结构。',model(['There are two letters, aren’t there?','不要只按letters把there换成they。'])),
g('negative-words','never与hardly的否定意义','句子没有not，仍要判断意义。',fill([blank('She is never late,','?',['is she','isn’t she']),blank('He can hardly hear,','?',['can he','can’t he'])],['is she','can he']),'never和hardly含否定意义，常见反意问尾用肯定形式。','没有not不一定是肯定意义。',model(['They never write, do they?','She hardly speaks, does she?'])),
g('few','few与a few的意义对比','按“几乎没有”和“有几个”核对。',fill([blank('Few students know this,','?',['do they','don’t they']),blank('A few students know this,','?',['don’t they','do they'])],['do they','don’t they']),'few偏否定；a few表示有几个，按肯定处理。','注意冠词a是否出现。',model(['Few people came, did they?','A few people came, didn’t they?'])),
g('little','little与a little的意义对比','按水量表达补好问尾。',fill([blank('There is little water,','?',['is there','isn’t there']),blank('There is a little water,','?',['isn’t there','is there'])],['is there','isn’t there']),'这里little表示水很少，含否定意味；a little表示还有一点。','little在这里说数量，不是大小。',model(['There is little time, is there?','There is a little time, isn’t there?'])),
g('prefix','否定词缀不等于否定句式','unhappy和impossible后如何核对？',fill([blank('He is unhappy,','?',['isn’t he','is he']),blank('It is impossible,','?',['isn’t it','is it'])],['isn’t he','isn’t it']),'un-／im-改变形容词意义，但is unhappy仍是肯定句式，问尾用否定。','不要把un-当作句中的not。',model(['He is unfriendly, isn’t he?','这与He isn’t friendly, is he?的结构不同。'])),
g('reply-yes','否定陈述问句按肯定事实回应','事实上Lily会游泳，请回答。',choice(['Yes, she can.','No, she can’t.','Yes, she can’t.'],'Yes, she can.',{context:'Lily can swim.\nBen asks: “Lily can’t swim, can she?”'}),'事实是会，就用Yes, she can；不是机械同意前面的否定。','先回答“她到底会不会”。',model(['Tom is here. “Tom isn’t here, is he?” → Yes, he is.','按事实回应。'])),
g('reply-no','否定陈述问句按否定事实回应','事实上Lily不会游泳，请回答。',choice(['No, she can’t.','Yes, she can.','No, she can.'],'No, she can’t.',{context:'Lily cannot swim.\nBen asks: “Lily can’t swim, can she?”'}),'事实是不会，就用No, she can’t；英语回答与事实一致。','和上一种事实相反，答案也要改变。',model(['Tom is not here. “Tom isn’t here, is he?” → No, he isn’t.','不按中文“是的，他不在”逐字选Yes。'])),
g('intonation','按明确意图选择常见语调','第一句不确定在求证，第二句很确定在求认同。常见语调怎样配？',choice(['第一句升调，第二句降调','第一句降调，第二句升调','两句都是升调'],'第一句升调，第二句降调',{context:'A: Ben is not sure. “It is open, isn’t it?”\nB: May can see it is open and expects agreement. “It is open, isn’t it?”'}),'不确定时常用升调，期待确认时常用降调；降调不等于对方禁止回答。','先看说话人是否确定。',model(['不确定班车是否到：It’s here, isn’t it? ↗','看见班车并征求认同：It’s here, isn’t it? ↘'])),
g('independent-report','独立组织转述的人称与内容','请代Ann向别人转述，不加that。',{...bank(['Ann says','she has written','her letter','I have written'],'Ann says she has written her letter',3),context:'Ann says: “I have written my letter.”\nYou are reporting her words to someone else.'},'人称与物主变化，完成意义保留；不加that仍可成句。'),
g('independent-tag','独立区分否定词和否定词缀','补好两个核对问尾。',fill([blank('They never phone,','?',['do they','don’t they']),blank('She is unhappy,','?',['isn’t she','is she'])],['do they','isn’t she']),'never含句子否定意味；unhappy不把is改成否定句式。'),
g('independent-reply','独立按事实回应否定陈述','她确实收到了信，怎样回答？',choice(['Yes, she has.','No, she hasn’t.','Yes, she hasn’t.'],'Yes, she has.',{context:'Anna has received the letter.\n“Anna hasn’t received it, has she?”'}),'已收到的事实用Yes, she has表达。'),
g('independent-change','独立区分状态更新与转述','现在门还没关好，哪句忠实转述？',choice(['She says she is shutting the door.','She says she has shut the door.','She says she will never shut the door.'],'She says she is shutting the door.',{context:'Anna says now: “I am shutting the door.”\nThe door is not shut yet.'}),'没有完成依据，不能改成has shut。')
];
unit.questions.apply=[
q('a-read','在新消息中保留原作者','你朗读Ben的卡片。引号里的I指谁？',choice(['Ben','你自己','所有听众'],'Ben',{context:'A card from Ben: “I am staying in Rome.”\nYou are reading his exact words aloud.'}),'直接引用的I由原作者决定。'),
q('a-hear','针对听不清作出回应','对方已经说明听不清，哪句回应最合适？',choice(['Of course. I’ll speak up.','You must leave the room.','I’ve already sent another card.'],'Of course. I’ll speak up.',{context:'Grandmother: “I’m afraid I can’t hear you.”\nPenny wants to make her reading easier to hear.'}),'回应听不清的实际需求，不擅自增加故事行动。'),
q('a-recipient','从组外转述收信群体','你不在收信人中，转述Jimmy对Penny和Grandmother的问候。',{...fill([blank('Jimmy hopes','are all well.',['they','we','he'])],['they']),context:'Recipients: Penny and Grandmother.\nJimmy writes to them: “I hope you are all well.”\nYou are an outsider reporting the message.'},'组外转述用they；不能照抄Penny的we。'),
q('a-fact-yes','用事实纠正否定猜测','Ben其实已经写好了，请回应。',choice(['Yes, he has.','No, he hasn’t.','Yes, he hasn’t.'],'Yes, he has.',{context:'Ben has written the letter.\nMay: “Ben hasn’t written it, has he?”'}),'事实为已写好，用Yes。'),
q('a-fact-no','保持否定事实回应','这一次Ben还没写好，请回应。',choice(['No, he hasn’t.','Yes, he has.','No, he has.'],'No, he hasn’t.',{context:'Ben has not written the letter yet.\nMay: “Ben hasn’t written it, has he?”'}),'同一问句，不同事实，回应相反。'),
q('a-update','有新完成证据才能更新消息','后来她写完了；记录这个新状态。',{...bank(['She says','she has written','the card','she is writing'],'She says she has written the card',3),context:'At 10:00, May was writing a card.\nAt 10:20, she has finished and says: “I have written the card.”'},'因为完成状态明确改变，才使用has written。'),
q('a-check','用反意问句核对新的资料','补好存在句问尾。',{...fill([blank('There are two cards in the box,','?',['aren’t there','aren’t they','isn’t there'])],['aren’t there']),context:'You see two cards in the box and want the listener to confirm.'},'there are对应aren’t there；不因cards复数改成they。'),
q('a-tone','降调期待认同也允许回应','May看见门开着，用降调问。哪项理解合适？',choice(['她期待认同，对方仍可回应','降调表示禁止任何回答','一定表示她生气了'],'她期待认同，对方仍可回应',{context:'May can see the door is open. She expects agreement.\n“The door is open, isn’t it?” ↘'}),'语调结合说话意图；不能从问尾本身推出生气。')
];
unit.questions.exam=[
q('e-author','独立分清朗读者与作者','Penny读“I have just arrived…”时，谁刚到了苏格兰？',choice(['Jimmy','Penny','Grandmother'],'Jimmy'),'引号保留原作者视角。'),
q('e-ending','独立限制原文结尾推断','哪项符合结尾的证据？',choice(['Grandmother似乎觉得字数少，Penny说明明信片写不了很多','Jimmy后来已经寄来了长信','Grandmother明确说不喜欢Jimmy'],'Grandmother似乎觉得字数少，Penny说明明信片写不了很多'),'保留有限推断，不补未知结局。'),
q('e-person','独立转述反身指代','你转述两位男孩现在的话。',{...fill([blank('The boys say they','enjoying',['are','is']),blank('',' .',['themselves','ourselves'])],['are','themselves']),context:'The boys say: “We are enjoying ourselves.”\nYou are not one of the boys.'},'主语复数，人称与反身形式一起变化。'),
q('e-we','独立辨认组内转述','May是收信人之一，她向Ben转述。',{...fill([blank('She hopes','are well.',['we','they'])],['we']),context:'Anna writes to May and Ben: “I hope you are well.”\nMay is speaking to Ben.'},'May包含自己，用we。'),
q('e-they','独立辨认组外转述','Leo不是收信人，他向别人转述这条问候。',{...fill([blank('Anna hopes','are well.',['they','we'])],['they']),context:'Anna writes to May and Ben: “I hope you are well.”\nLeo is not a recipient.'},'同样原话，转述者的群体关系改变，代词随之改变。'),
q('e-time','独立保持过去与将来消息','今天周三，保留她两句话的时间。',{...fill([blank('She says she','on Tuesday.',['arrived','arrives']),blank('She says she','on Thursday.',['will leave','left'])],['arrived','will leave']),context:'Wednesday: May says, “I arrived yesterday. I will leave tomorrow.”'},'现在转述不把两个事件变成同一时态。'),
q('e-ongoing','独立保留进行状态','他仍在读，还没读完。怎样准确转述？',choice(['He says he is reading the magazine.','He says he has read the magazine.','He says he never reads.'],'He says he is reading the magazine.',{context:'Ben says now: “I am reading the magazine.”\nHe has not finished it.'}),'转述本身不产生完成事实。'),
q('e-complete','独立表达明确更新的完成状态','她后来已经穿好外套，转述新消息。',{...fill([blank('She says she','her coat.',['has put on','is putting on','will put on'])],['has put on']),context:'Earlier May was putting on her coat.\nNow she has finished and says, “I have put on my coat.”'},'按新的完成状态更新，不能称为完全同义改写。'),
q('e-that','独立判断that省略','哪项是完整、可用的转述？',choice(['She says she needs a haircut.','She says needs a haircut.','She says she need haircut.'],'She says she needs a haircut.'),'省去that后，仍需主语和匹配的谓语。'),
q('e-be','独立核对be及单复数','补好常见反意问尾。',fill([blank('This hostel is quiet,','?',['isn’t it','doesn’t it']),blank('These rooms aren’t empty,','?',['are they','aren’t they'])],['isn’t it','are they']),'单数this hostel用it，复数rooms用they；极性相反。'),
q('e-do','独立选择do与does','补好核对问尾。',fill([blank('Anna writes often,','?',['doesn’t she','isn’t she']),blank('They don’t need a map,','?',['do they','does they'])],['doesn’t she','do they']),'一般现在时实义动词选择do／does。'),
q('e-past','独立选择过去时问尾','按过去的动作补好问句。',fill([blank('They left yesterday,','?',['didn’t they','don’t they','weren’t they'])],['didn’t they']),'left是过去动作，不用现在时do或be。'),
q('e-perfect','独立选择完成时问尾','补好两句。',fill([blank('She has arrived,','?',['hasn’t she','doesn’t she']),blank('We haven’t finished,','?',['have we','haven’t we'])],['hasn’t she','have we']),'跟随完成时助动词has／have。'),
q('e-modal','独立选择情态与将来问尾','补好两句。',fill([blank('He can hear you,','?',['can’t he','doesn’t he']),blank('They won’t leave soon,','?',['will they','won’t they'])],['can’t he','will they']),'can和will分别与前句保持一致。'),
q('e-there','独立构造there be问尾','用词块完成问尾。',{...bank(['isn’t','there','it'],'isn’t there',2,'?'),context:'There is a letter for you, ___?'},'there be核对时仍用there。'),
q('e-negative','独立判断never和hardly','补好含否定意义词的问句。',fill([blank('He never phones,','?',['does he','doesn’t he']),blank('They can hardly see it,','?',['can they','can’t they'])],['does he','can they']),'never和hardly使常见问尾使用肯定形式。'),
q('e-few','独立对比few与a few','两句的a不同，问尾怎样填？',fill([blank('Few people remember,','?',['do they','don’t they']),blank('A few people remember,','?',['don’t they','do they'])],['do they','don’t they']),'few与a few在这里否定意味不同。'),
q('e-little','独立对比little与a little','按数量意义补全。',fill([blank('There is little milk,','?',['is there','isn’t there']),blank('There is a little milk,','?',['isn’t there','is there'])],['is there','isn’t there']),'little数量少偏否定，a little表示有一点。'),
q('e-prefix','独立判断un与im词缀','补好常见反意问尾。',fill([blank('She is unfriendly,','?',['isn’t she','is she']),blank('That is impossible,','?',['isn’t it','is it'])],['isn’t she','isn’t it']),'词缀的否定含义不等于isn’t句式。'),
q('e-yes','独立用肯定事实回应','他事实上听得见，怎样回应？',choice(['Yes, he can.','No, he can’t.','Yes, he can’t.'],'Yes, he can.',{context:'Leo can hear clearly.\n“Leo can’t hear, can he?”'}),'按会／能的事实用Yes。'),
q('e-no','独立用否定事实回应','他事实上听不见，怎样回应？',choice(['No, he can’t.','Yes, he can.','No, he can.'],'No, he can’t.',{context:'Leo cannot hear the speaker.\n“Leo can’t hear, can he?”'}),'按不能的事实用No，不按中文逐词翻译。'),
q('e-rise','独立选择求证时的常见语调','Ben不确定是否营业，真心求证。通常怎样读问尾？',choice(['升调 ↗','降调 ↘','只能用平调 →'],'升调 ↗',{context:'Ben is unsure whether the shop is open.\n“It’s open, isn’t it?”'}),'不确定而求证时常用升调；这是意图匹配，不是录音听辨。'),
q('e-fall','独立理解降调的确认意图','May看见明信片，期待同伴认同。哪项理解合适？',choice(['常用降调期待确认，仍可以回应','降调等于不准回答','降调一定说明生气'],'常用降调期待确认，仍可以回应',{context:'May sees the postcard and expects agreement.\n“It’s a postcard, isn’t it?” ↘'}),'语气结合已知情境，不作绝对禁令。'),
q('e-future','独立保留soon和未来边界','只读到I’ll write soon，能确认什么？',choice(['他说不久会写，没有给出具体日期或已寄出的结果','信已经寄到','一定是明天上午八点写'],'他说不久会写，没有给出具体日期或已寄出的结果'),'soon不是精确日期，will不是已完成。'),
q('e-organize','独立组织不带that的转述','你不属于这两位旅客，转述他们的话。',{...bank(['They say','they must wait for','a bus','we must wait for'],'They say they must wait for a bus',3),context:'Two travellers say: “We must wait for a bus.”\nYou are reporting their words.'},'保留must wait for的意思，we按说话群体转成they。')
];
unit.learning.REFERENCE=[
'本课Grammar同时学习直接／间接引语和反意疑问句。直接引用保留原话与原说话人视角；Penny读Jimmy写的“I…”时，I仍指Jimmy。转述不直接复制引号中的人称，要核对谁写、谁收、谁在转述。',
'现在转述保留事件本身的时间：He says he has just arrived／is staying／will write。I→he／she、my→his／her并非固定机械规则；自己转述自己的话时I可以不变，收信群体包括转述者时you可转成we，组外则可用they。反身形式也要对应，如myself→herself。',
'课本102课常省略that，但保留that的表达也可以正确；不能把省略that当作所有陈述转述的硬性要求。本课指定“不加that”的词块任务只是在练指定形式。',
'102课A原示例是He is drinking his milk. → He says he has drunk his milk. 它同时把“正在喝”变成“已经喝完”，不是单纯转述的必然变化。练习纸保留原例；按示例练完成表达时，先设定后来已做完。若要保持正在进行的原意，应说He says he is drinking his milk。',
'本课练常见核对型反意疑问句：前肯后否，前否后肯；问尾沿用合适的be、助动词或情态动词，并配合主语和时态。实义动词一般现在时用do／does，过去时用did；完成时用have／has。there be问尾仍用there。',
'never、hardly和表示“几乎没有”的few／little含否定意味，常见问尾用肯定；a few／a little表示有几个／有一点，按肯定处理。little表示大小时不能照搬数量规则。unhappy、unfriendly、impossible的词缀不把肯定句式变成否定句式：He is unhappy, isn’t he?',
'回应按事实：他能听见，问He can’t hear, can he?，答Yes, he can.；他不能听见，答No, he can’t. 不按中文“是的，他不能”机械选择Yes。',
'常见语调与意图：不确定、想求证时常用升调↗；比较确定、期待认同时常用降调↘。降调不等于禁止对方回应。线上题只依据明确的文字情境匹配意图；真实听辨、模仿和自然语气由教师在课堂带练，无配音页面不宣称测过发音能力。',
'同极性问尾等其他用法也存在，本课按教材学习常见的反意核对型，不把本课模式宣布为所有英语问尾的唯一形式。原课文中Grandmother似乎觉得字数太少，是依据她结尾的话作有限推断，不扩展为讨厌Jimmy或医学结论。',
'Y.H.A.按课文全称The Youth Hostels Association理解。教材关于青年旅馆会员制的历史说明不作为今天所有旅馆的入住规定；本课不办理会员或作旅行预订。soon表示不久，不等于固定明天；最后没有后来收到长信的情节。'
];
unit.learning.MODEL_TITLE='课本小参考 · 102课框架与16组替换';
unit.learning.REPORTING_MODELS=[['开头','主语','内容框架'],['He says / thinks / believes / knows / hopes','he','is… / feels… / has (got)…'],['He is afraid / sorry / sure','he','needs… / wants…'],['He says / She says / They say','he / she / they','can… / must… / will…']];
unit.learning.MODELS=[['tired','is / feels','疲倦的','tired'],['thirsty','are / feel','口渴的','thirsty'],['cold','is / feels','冷的','cold'],['ill','is / feels','生病的','ill'],['a cold','has (got)','感冒','a-cold'],['a headache','has (got)','头痛','headache'],['an earache','has (got)','耳痛','earache'],['a toothache','have (got)','牙痛','toothache'],['a haircut','needs / wants','理发','haircut'],['a licence','needs / wants','执照','licence'],['an X-ray','needs / wants','X光检查','x-ray'],['some money','need / want','一些钱','money'],['wait','can / must / will','等候','wait'],['catch','can / must / will','赶上','catch'],['repair','can / must / will','修理','repair'],['sell','can / must / will','卖','sell']].map(([en,frame,cn,art])=>({en,cn:frame+' · '+cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 按给定完成情境改写',instruction:'保留课本5题及原例。原例同时改变动作状态，不是纯转述规则。课堂先设定“后来该动作已完成”，再按例子说新消息；也可另写一句保留正在进行原意的转述来比较。',examples:['课本原例：He is drinking his milk. → He says he has drunk his milk.','保留正在进行原意：He says he is drinking his milk.','本组约定：各题动作后来已经完成。第5题由观察者转述日出已经发生，用He says the sun…开头，不让太阳充当说话人。'],items:['She is shutting the door.','He is putting on his coat.','He is reading his magazine.','They are speaking to the boss.','The sun is rising.']},
{title:'B · 从词组表组织九句话',instruction:'保留课本完整词组库和9句书写要求。选择意义与语法都合适的搭配，不是每个左栏动词都能与每个右栏词组任意组合。示例已经使用ill；其余9项各写一句。',examples:['He says he feels ill.'],columns:[['开头','动词词组','内容词组'],['He says he','has got / feels / will sell / needs / must wait for','cold / a bus / a haircut / tired / a cold / thirsty / an X-ray / an earache / his house / ill']],items:['cold','a bus','a haircut','tired','a cold','thirsty','an X-ray','an earache','his house']}
];
core.unit101102=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit101102,excerpts={"u101102-v1-r-roles":[0,1],"u101102-v1-r-place":[0,1,2,3],"u101102-v1-r-association":[3,4,5],"u101102-v1-r-hope":[6,7,8,9],"u101102-v1-r-hear":[7,8],"u101102-v1-r-future":[6,7,8,9],"u101102-v1-r-reaction":[10,11],"u101102-v1-r-card":[10,11],"u101102-v1-e-ending":[10,11]},speakers={"grandmother":"Grandmother","penny":"Penny"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 101',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
