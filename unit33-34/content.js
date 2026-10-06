(function(root){
'use strict';
const base='/assets/unit33-34/',image=name=>base+name+'.svg',source='《新概念英语智慧版1》纸页66–69（PDF99–102）';
const words=[
 ['day','一天；日子','/deɪ/'],['cloud','云','/klaʊd/'],['sky','天空','/skaɪ/'],['sun','太阳','/sʌn/'],['shine','照耀；发光','/ʃaɪn/'],['with','本课：和……在一起','/wɪð/'],['family','家人；家庭','/ˈfæməli/'],['walk','走路；步行','/wɔːk/'],['over','本课：从桥上或河上空经过','/ˈəʊvə/'],['bridge','桥','/brɪdʒ/'],['boat','小船','/bəʊt/'],['river','河流','/ˈrɪvə/'],['ship','轮船；大船','/ʃɪp/'],['aeroplane','飞机','/ˈeərəpleɪn/'],['fly','飞','/flaɪ/'],['sleep','睡觉','/sliːp/'],['shave','刮脸','/ʃeɪv/'],['cry','哭','/kraɪ/'],['wash','洗','/wɒʃ/'],['wait','等；等待','/weɪt/'],['jump','跳','/dʒʌmp/'],['fine','本课：天气晴好','/faɪn/']
].map(([en,cn,ph])=>({en,cn,ph,image:image(en),source,phoneticSource:'教材音标／Cambridge英式读词形式',...(en==='over'?{example:'walk over the bridge'}:{})}));
const text=[
 ['It is a fine day today.','今天天气晴好。'],
 ['There are some clouds in the sky, but the sun is shining.','天空中有几朵云，但阳光灿烂。'],
 ['Mr. Jones is with his family.','琼斯先生和他的家人在一起。'],
 ['They are walking over the bridge.','他们正从桥上走过。'],
 ['There are some boats on the river.','河面上有几艘小船。'],
 ['Mr. Jones and his wife are looking at them.','琼斯先生和他的妻子正在看这些小船。'],
 ['Sally is looking at a big ship.','萨莉正在看一艘大船。'],
 ['The ship is going under the bridge.','那艘大船正在从桥下驶过。'],
 ['Tim is looking at an aeroplane.','蒂姆正在看一架飞机。'],
 ['The aeroplane is flying over the river.','飞机正在从河上空飞过。']
].map(([text,cn],i)=>({id:'D'+String(i+1).padStart(2,'0'),text,cn,who:'narrator',person:'narrator',source}));
const q=(id,target,prompt,extra,why)=>({id:'u3334-v1-'+id,target,prompt,source,decision:target,hint:'',explanation:'',...extra,distractorRationale:why});
const choice=(id,target,prompt,options,answer,why,extra={})=>q(id,target,prompt,{options,answer,...extra},why);
const match=(id,target,prompt,pairs,why)=>q(id,target,prompt,{type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i)))},why);
const cloze=(id,target,prompt,blanks,answers,why,extra={})=>q(id,target,prompt,{type:'cloze',blanks:blanks.map(([before,after,options])=>({before,after,options})),answer:JSON.stringify(answers),...extra},why);
const order=(id,target,prompt,tokens,why)=>q(id,target,prompt,{type:'order',tokens,answer:tokens.join(' ')},why);
const locate=(id,target,prompt,fragments,answer,why)=>q(id,target,prompt,{type:'locate',fragments,options:fragments.filter(v=>typeof v==='object').map(v=>v.value),answer},why);
const scene=(id,prompt,reference,answer)=>q(id,'同时读懂船的种类与位置',prompt,{type:'scene-find',reference,sceneImage:image('find-ships'),mobileScene:image('find-ships-mobile'),sceneDescription:'一座桥横跨河流。第一艘轮船在桥下，第二艘同型轮船在右侧河面，左下有一艘小船。',options:['ship1','ship2','boat'],spots:[{id:'ship1',name:'1号船',bounds:[24,44,32,37],mobileBounds:[14,40,55,31]},{id:'ship2',name:'2号船',bounds:[63,53,32,42],mobileBounds:[41,65,57,33]},{id:'boat',name:'3号船',bounds:[2,73,20,25],mobileBounds:[0,74,35,24]}],answer},'两艘轮船外形相同，必须结合under/on与bridge/river判断；选区中性，不预标答案。');
const questions={
 listen:[
  match('day-words','区分一天、云与天空','把词语与意思配起来。',[['day','一天'],['cloud','云'],['sky','天空']],'不同新词的首次识别，不要求反向再做一组。'),
  match('transport','区分小船、轮船与飞机','为三种交通工具配上意思。',[['boat','小船'],['ship','轮船'],['aeroplane','飞机']],'保留boat与ship的教材区别；不把任何船绝对划入唯一日常用法。'),
  choice('bridge-word','由桥的结构识别bridge','图中是什么？',['bridge','river','sky'],'bridge','图像为桥的结构，河水只是背景，候选都是本课词。',{image:image('bridge'),imageAlt:'一座带拱洞和栏杆的桥'}),
  match('states','识别sleep、cry、wait','给动作配上意思。',[['sleep','睡觉'],['cry','哭'],['wait','等待']],'三种不同动作；哭不等于坏孩子，等待不等于睡觉。'),
  match('actions','识别shave、wash、jump','再认三个动作。',[['shave','刮脸'],['wash','洗'],['jump','跳']],'分别覆盖其余三项新动作，不用换人名增加题数。'),
  choice('with-family','理解with表示陪同','Mr. Jones is with his family.\n这句话告诉我们什么？',['他和家人在一起。','他在寻找家人。','家人离他很远。'],'他和家人在一起。','寻找和距离都不是with的含义；不能只由人物头像推断关系。'),
  choice('shine','理解本课shine的动作义','The sun is shining.\nshining 在这里表示什么？',['发光；照耀','飞翔','行走'],'发光；照耀','以完整句子限制词性和语义，不与sun名词混淆。')
 ],
 roles:[
  choice('they-reference','跨句识别They指琼斯先生与家人','Mr. Jones is with his family.\nThey are walking over the bridge.\nThey 指谁？',['Mr. Jones and his family','the boats','the aeroplane'],'Mr. Jones and his family','须读前句，不把they一律解释为离它最近的任意名词。'),
  locate('them-boats','定位them的先行词','点出第二句 them 所指的完整词组。',['There are ',{value:'some boats'},' on ',{value:'the river'},'.\n',{value:'Mr. Jones and his wife'},' are looking at them.'],'some boats','问词组而非单词；river是地点，夫妻是观看者。'),
  choice('sally-tim','分清不同人物正在看的对象','Sally is looking at a big ship.\nTim is looking at an aeroplane.\n哪一份观察记录符合原文？',['Sally → a big ship; Tim → an aeroplane','Sally → an aeroplane; Tim → a big ship','Sally → a big ship; Tim → a big ship'],'Sally → a big ship; Tim → an aeroplane','两个对象都在材料中，不能只看到某一个关键词便作答。'),
  choice('weather-picture','有云和阳光可以同时成立','There are some clouds in the sky, but the sun is shining.\n哪幅画符合这句话？',['画面一','画面二','画面三'],'画面二','雨夜与阴天分别缺少太阳照耀；正确图须同时含云和阳光。',{optionImages:{'画面一':image('weather-rain'),'画面二':image('weather-fine'),'画面三':image('weather-night')},optionImageAlts:{'画面一':'灰云下正在下雨，太阳不可见','画面二':'几朵白云与发光的太阳','画面三':'夜空里有月亮和星星'}})
 ],
 observe:[
  scene('ship-under','新画面：读英文，选出对应的船。','The ship is going under the bridge.','ship1'),
  cloze('plane-over','看图区分河面与河上空','补全图中的位置。',[['The aeroplane is flying ',' the river.',['over','on','under']]],['over'],'三个介词词性相同，需阅读英文并对照空间。',{image:image('plane-over'),imageAlt:'飞机在河流上空飞行'}),
  choice('walk-over','同一个over在过桥语境中的含义','They are walking over the bridge.\n这句话描述哪一种经过方式？',['从桥上走过','在桥上空飞过','从桥下经过'],'从桥上走过','不能把本课over的两种语境一概教成上空；walk决定行走。')
 ],
 be:[
  cloze('singular-plural','比较一个人和多个人的be形式','为两句话分别选词。',[['The children ',' doing their homework.',['are','is','am']],['The boy ',' doing his homework.',['is','are','am']]],['are','is'],'真正分别选择are与is，而非直接给成块正确句；复习单数用于支持新复数对比。'),
  choice('waiting-reply','复合主语用they回答正在做什么','What are the man and the woman doing?',['They are waiting for a bus.','They are walking over the bridge.','He is waiting for a bus.'],'They are waiting for a bus.','根据站牌与等待姿态判断动作，the man and the woman为两人，不能只答he。',{image:image('waiting'),imageAlt:'一位男士和一位女士并排站在公交站牌旁等待'}),
  cloze('ing-e','比较直接加ing和去不发音e','填入 walk 和 shine 的 -ing 形式。',[['They are ',' over the bridge.',['walking','walk','walkeing']],['The sun is ','.',['shining','shineing','shine']]],['walking','shining'],'前项直接加ing，后项删e；两种条件对比而不是两个同构变词。'),
  cloze('ing-y','fly的进行形式保留y','用 fly 的 -ing 形式填空。',[['The birds are ','.',['flying','fling','fliing']]],['flying'],'y在此不变成i，也不能删掉；不借用复数名词或三单变化规则。')
 ],
 trans:[
  order('plural-question','组织复数现在动作问句','他们正在做什么？',['What','are','they','doing?'],'撤去成句支持，组织are在主语前的问句；不是单数旧题换名词。'),
  order('plural-washing','组织复数动作描述','她们正在洗碗。',['They','are','washing','dishes.'],'用完整主谓结构组织描述；前面只在图册示范，不重复同句练习。')
 ],
 exam:[
  choice('final-weather','天气语境与but的关系','It is a fine day today.\nThere are some clouds in the sky, but the sun is shining.\n哪一句记录符合原文？',['有云，阳光依然灿烂。','晴天，所以一朵云也没有。','有云，所以太阳没有照耀。'],'有云，阳光依然灿烂。','间隔复习：fine与some clouds不矛盾；两项干扰分别抹去云或太阳。'),
  choice('final-family','with与They的跨句关系','Mr. Jones is with his family. They are walking over the bridge.\n谁正在过桥？',['琼斯先生和他的家人','只有琼斯先生','只有琼斯太太'],'琼斯先生和他的家人','间隔复习：全体指代，不能缩成一个人。'),
  locate('final-them','将them指代迁移到新的先行词','新观察记录：点出 them 指的完整词组。',[{value:'The birds'},' are flying over ',{value:'the river'},'.\n',{value:'The children'},' are looking at them.'],'The birds','条件改变：先行词换成birds，观看者换children，不能死记them等于boats。'),
  cloze('final-under-on','区分under桥下与on水面','按原文补全两条观察记录。',[['The ship is going ',' the bridge.',['under','on','over']],['There are some boats ',' the river.',['on','under','in']]],['under','on'],'两句的物体及参照物不同，分别判断；只选一种介词不能过关。'),
  choice('final-over','识别fly over的空间含义','The aeroplane is flying over the river.\n飞机经过哪里？',['河流上空','河面上','桥下面'],'河流上空','与前面walk over的桥面义对照；原文没有说飞机飞到桥下。'),
  order('final-question','独立组织带复数名词的问句','这些男士正在做什么？',['What','are','the','men','doing?'],'主语由they改为复数名词词组，仍需问句倒装；属于组织任务，不声称独立写作。'),
  cloze('final-be','单数与复数动作的一致关系','分别补全两句话。',[['The dogs ',' eating bones.',['are','is','am']],['The dog ',' eating a bone.',['is','are','am']]],['are','is'],'间隔复习：不因dogs与dog的画面相似就忽略数量；真实选择两侧be。'),
  match('final-actions','识别睡觉、哭与洗的词义','把动作与意思配起来。',[['sleep','睡觉'],['cry','哭'],['wash','洗']],'跨组抽样回顾三项新词，不把前面的两个词汇组整套重做。'),
  choice('final-shaving','根据动作与复数主语选择描述','What are the men doing?',['They are shaving.','They are washing dishes.','He is shaving.'],'They are shaving.','成人刮脸图与两人数量必须同时匹配；不要求儿童模仿动作。',{image:image('shaving'),imageAlt:'两位成人男士各自拿着剃须工具刮脸'}),
  cloze('final-spelling-e','将删不发音e规则应用于另一个已示范动词','用 come 和 give 的 -ing 形式填空。',[['He is ','.',['coming','comeing','come']],['He is ',' me some magazines.',['giving','giveing','give']]],['coming','giving'],'教材书面A的词，已在表达参考展示；改变词根核对规则迁移，不引入未知例外。'),
  cloze('final-crying','cry加ing时保留y','用 cry 的 -ing 形式填空。',[['The children are ','.',['crying','criing','cring']]],['crying'],'从fly示范迁移到教材cry，保留y；不能套复数名词y改ies。'),
  choice('final-waiting','把复合主语问答落实到情境','What are the man and the woman doing?',['They are waiting for a bus.','She is waiting for a bus.','They are jumping off the wall.'],'They are waiting for a bus.','间隔复习两人共同动作；不是按性别、衣服颜色猜答案。',{image:image('waiting'),imageAlt:'公交站牌旁站着一位男士和一位女士'}),
  order('final-jumping','组织教材复数动作与off路线','这些孩子正在从矮墙上跳下来。',['The','children','are','jumping','off','the','wall.'],'保留教材off短语与动作结构；图片或课堂模拟不等于要求真实跳墙。')
 ]
};
const gallery=[
 ['220,231','cooking','The men are cooking a meal.','这些男士正在做饭。','the men','cooking a meal'],
 ['331,342','sleeping','They are sleeping.','他们正在睡觉。','they','sleeping'],
 ['442,453','shaving','The men are shaving.','这些男士正在刮脸。','the men','shaving'],
 ['553,564','crying','The children are crying.','这些孩子正在哭。','the children','crying'],
 ['664,675','eating','The dogs are eating bones.','这些狗正在啃骨头。','the dogs','eating bones'],
 ['775,786','typing','The women are typing letters.','这些女士正在打信。','the women','typing letters'],
 ['886,897','doing','The children are doing their homework.','这些孩子正在做作业。','the children','doing their homework'],
 ['997,998','washing','The women are washing dishes.','这些女士正在洗碗。','the women','washing dishes'],
 ['1,000,001','flying','The birds are flying over the river.','这些鸟正在河上空飞过。','the birds','flying over the river'],
 ['1,100,000','walking','They are walking over the bridge.','他们正从桥上走过。','they','walking over the bridge'],
 ['1,500,000','waiting','The man and the woman are waiting for a bus.','这位男士和这位女士正在等公交车。','the man and the woman','waiting for a bus'],
 ['2,000,000','jumping','The children are jumping off the wall.','这些孩子正从墙上跳下来。','the children','jumping off the wall']
];
const definition={id:'unit33-34',version:1,mode:'classroom',title:'晴天河畔发现之旅',path:'/unit33-34/',start:'learn/words',progress:{learningKey:'canran:unit33-34:learning:v1'},objects:words,
 stages:[
 {id:'l1',title:'来到河畔',activities:[['words','河畔小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
 {id:'l2',title:'一家人看风景',activities:[['text','河畔故事画卷','book'],['roles','故事小侦探','question']],required:['text','roles']},
 {id:'l3',title:'桥上桥下找一找',activities:[['phrases','河畔观察锦囊','book'],['observe','桥上桥下找一找','question']],required:['observe']},
 {id:'l4',title:'大家正在做什么',activities:[['models','大家的动作画册','cards'],['be','动作发现站','question'],['trans','词块拼装台','order']],required:['be','trans']},
 {id:'l5',title:'留下河畔发现',activities:[['exam','河畔发现挑战','star'],['certificate','我的河畔纪念','star']],required:['exam']}
 ],questions,learning:{WORDS:words,PEOPLE:{narrator:{name:''},MrJones:{name:'Mr. Jones',image:image('MrJones')},MrsJones:{name:'Mrs. Jones',image:image('MrsJones')},Sally:{name:'Sally',image:image('Sally')},Tim:{name:'Tim',image:image('Tim')}},DIALOGUE:text,
 PHRASES:[
 ['They are walking over the bridge.','从桥上走过。','walking'],['The ship is going under the bridge.','从桥下驶过。','ship-under'],['There are some boats on the river.','小船在河面上。','boats-on'],['The aeroplane is flying over the river.','从河流上空飞过。','plane-over'],['What are they doing?','询问他们正在做什么。','family'],['They’re washing dishes.','They’re = They are','washing']
 ].map(([en,cn,art])=>({en,cn,image:image(art)})),
 GALLERY:gallery.map(([numberLabel,art,en,cn])=>({numberLabel,en,cn,image:image(art)})),
 WRITING_A:[['Type','She is __________ a letter.'],['Make','She is __________ the bed.'],['Come','He is __________.'],['Shine','The sun is __________.'],['Give','He is __________ me some magazines.']],
 WRITING_B:gallery.map(item=>[item[4],item[5]])
 }};
definition.learning.FEEDBACK=root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK;
root.CanranCore.unit3334=definition;
if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
