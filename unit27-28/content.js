(function(root){
 'use strict';
 const image=name=>'/assets/unit27-28/'+name.replaceAll(' ','-').replaceAll('.','')+'.svg';
 const source='《新概念英语智慧版1》纸页54–57（PDF87–90）';
 const WORDS=[
  ['living room','客厅','/ˈlɪvɪŋ ˌruːm/'],['near','靠近','/nɪr/','near the window'],['window','窗户','/ˈwɪndoʊ/'],['armchair','扶手椅','/ˈɑːrmtʃer/'],['door','门','/dɔːr/'],['picture','图画','/ˈpɪktʃɚ/'],
  ['wall','墙','/wɑːl/'],['trousers','长裤（复数形式）','/ˈtraʊzɚz/'],['television','电视机','/ˈteləvɪʒən/'],['stereo','立体声音响','/ˈsterioʊ/'],['magazines','杂志（复数）','/ˌmæɡəˈziːnz/'],['newspapers','报纸（复数）','/ˈnuːzˌpeɪpɚz/'],
  ['books','书（复数）','/bʊks/'],['armchairs','扶手椅（复数）','/ˈɑːrmtʃerz/'],['pictures','图画（复数）','/ˈpɪktʃɚz/'],['some','本课：一些','/sʌm/','some books'],['any','本课：用于问有没有或说没有','/ˈeni/','Are there any books?'],['there','本句用来介绍“有”','/ðer/','There are some books.'],
  ['they','本课：它们','/ðeɪ/','They are near the table.'],['are','本句和 there 一起表示“有”','/ɑːr/','There are some pictures.'],['knife','刀','/naɪf/'],['knives','刀（复数）','/naɪvz/'],['policeman','男警察','/pəˈliːsmən/'],['policemen','男警察（复数）','/pəˈliːsmən/'],
  ['housewife','家庭主妇','/ˈhaʊswaɪf/'],['housewives','家庭主妇（复数）','/ˈhaʊswaɪvz/'],['man','男人','/mæn/'],['men','男人（复数）','/men/'],['keyboard operator','电脑录入员','/ˈkiːbɔːrd ˌɑːpəreɪt̬ɚ/'],['office','办公室','/ˈɑːfɪs/']
 ].map(([en,cn,ph,example=''])=>({en,cn,ph,example,image:image(en),source}));
 const PEOPLE={Mrs:{name:'史密斯太太',image:image('Mrs.')}};
 const DIALOGUE=[
  ["Mrs. Smith's living room is large.",'史密斯太太的客厅很大。'],['There is a television in the room.','客厅里有台电视机。'],['The television is near the window.','电视机靠近窗户。'],['There are some magazines on the television.','电视机上有一些杂志。'],['There is a table in the room.','客厅里有张桌子。'],['There are some newspapers on the table.','桌子上有一些报纸。'],['There are some armchairs in the room.','客厅里有几把扶手椅。'],['The armchairs are near the table.','扶手椅靠近桌子。'],['There is a stereo in the room.','客厅里有台立体声音响。'],['The stereo is near the door.','音响靠近门。'],['There are some books on the stereo.','音响上有一些书。'],['There are some pictures in the room.','客厅里有几幅画。'],['The pictures are on the wall.','画挂在墙上。']
 ].map(([text,cn],i)=>({id:'L27-N'+String(i+1).padStart(2,'0'),person:'narrator',who:'narration',text,cn,source:source+'；Lesson27原文'}));
 const PHRASES=[
  ['There is a television in the room.','介绍一台电视机。','television'],['There are some armchairs in the room.','介绍一些扶手椅。','armchairs'],['The armchairs are near the table.','接着说这些扶手椅的位置。','armchairs-table'],['Where are they?','它们在哪里？','they'],["They're near the table.",'They are 可以缩写为 They’re。','armchairs-table'],['a knife → some knives\na policeman → some policemen','看看这些名词怎样变为复数。','knives']
 ].map(([en,cn,picture])=>({en,cn,image:image(picture),source:source+'；原文与句型支架'}));
 const GALLERY=[
  ['cigarettes-dressing-table','There are some cigarettes on the dressing table.\nThey are near that box.','香烟在梳妆台上，靠近那个盒子。','1120'],
  ['plates-cooker','There are some plates on the cooker.\nThey are clean.','盘子在炉灶上，是干净的。','2230'],
  ['trousers-bed','There are some trousers on the bed.\nThey are near that shirt.','长裤在床上，靠近那件衬衫。','3340'],
  ['bottles-refrigerator','There are some bottles in the refrigerator.\nThey are empty.','瓶子在冰箱里，是空的。','4450'],
  ['shoes-floor','There are some shoes on the floor.\nThey\'re near the bed.','鞋子在地板上，靠近床。','5560'],
  ['knives-table','There are some knives on the table.\nThey\'re in that box.','刀在桌上那个盒子里面。','6670'],
  ['forks-shelf','There are some forks on the shelf.\nThey\'re near those spoons.','叉子在架子上，靠近那些勺子。','7780'],
  ['bottles-cupboard','There are some bottles on the cupboard.\nThey\'re near those tins.','瓶子在橱柜上，靠近那些罐头。','8890'],
  ['tickets-shelf','There are some tickets on the shelf.\nThey\'re in that handbag.','票在架子上那个手提包里面。','9999'],
  ['glasses-television','There are some glasses on the television.\nThey\'re near those bottles.','玻璃杯在电视机上，靠近那些瓶子。','10001']
 ].map(([picture,en,cn,number])=>({en,cn,image:image(picture),source:source+'；Lesson28图'+number}));
 const model=(asked,place,actual,location,picture)=>({asked,place,actual,location,prompt:`(${asked}) / ${place} / ${actual} / ${location}`,en:`Are there any ${asked} ${place}?\nNo, there aren't any ${asked} ${place}.\nThere are some ${actual}.\nWhere are they?\nThey're ${location}.`,cn:'另设练习场景',image:image(picture),source:source+'；Lesson28 Written B'});
 const MODEL_EXAMPLE=model('books','on the dressing table','cigarettes','near that box','cigarettes-dressing-table');
 const MODELS=[
  ['books','in the room','magazines','on the television','magazines-television'],['ties','on the floor','shoes','near the bed','shoes-floor'],['glasses','on the cupboard','bottles','near those tins','bottles-cupboard'],['newspapers','on the shelf','tickets','in that handbag','tickets-shelf'],['forks','on the table','knives','in that box','knives-table'],['cups','on the stereo','glasses','near those bottles','glasses-stereo'],['cups','in the kitchen','plates','on the cooker','plates-cooker'],['glasses','in the kitchen','bottles','in the refrigerator','bottles-refrigerator'],['books','in the room','pictures','on the wall','pictures-wall'],['chairs','in the room','armchairs','near the table','armchairs-table']
 ].map(args=>model(...args));
 const REFERENCE=[
  ['There is a pencil on the desk.','There are some pencils on the desk.'],['There is a knife near that tin.','There are some knives near that tin.'],['There is a policeman in the kitchen.','There are some policemen in the kitchen.'],['There is a newspaper in the living room.','There are some newspapers in the living room.'],['There is a keyboard operator in the office.','There are some keyboard operators in the office.']
 ].map(([prompt,en])=>({prompt,en,source:source+'；Lesson28 Written A'}));
 const q=(id,target,prompt,options,answer,explanation,hint,basis,decision,extra={})=>({id:'u2728-v1-'+id,target,prompt,options:options?.map(o=>o[0]),answer,explanation,hint,source:source+'；'+basis,decision,distractorReasons:options?Object.fromEntries(options.filter(o=>o[0]!==answer)):undefined,...extra});
 const vocab=(id,prompt,answer,wrong,extra={})=>q('vocab-'+id,'理解 '+id+' 的本课含义',prompt,[[answer,''],...wrong],answer,'这道题认读的是 '+id+'。','','Lesson27–28词表','八个新词各一次；旧词不再整轮必做',{presentation:'vocabulary',...extra});
 const questions={
  listen:[
   vocab('living room','living room\n选出这个词组的意思。','客厅',[['厨房','kitchen是厨房。'],['卧室','bedroom是卧室。'],['办公室','office是办公室。']]),
   vocab('near','near the window\nnear 在这里表示什么？','靠近',[['在……里面','in才是里面。'],['在……上面','on表示在表面上。'],['远离','与靠近的意思不同。']]),
   vocab('window','看看图，选出英文。','window',[['door','门有出入开口，不是这里的窗框。'],['wall','wall指墙。'],['picture','这是带窗格的窗户，不是画。']],{image:image('window'),imageAlt:'带窗格、窗台和把手的窗户'}),
   vocab('armchair','armchair\n选出这个词的意思。','扶手椅',[['桌子','table是桌子。'],['床','bed是床。'],['橱柜','cupboard是橱柜。']]),
   vocab('door','看看图，选出英文。','door',[['window','这是门而不是窗户。'],['wall','wall指墙。'],['table','table是桌子。']],{image:image('door'),imageAlt:'一扇带门框和门把手的门'}),
   vocab('picture','picture\n本课指什么？','图画',[['报纸','newspaper是报纸。'],['杂志','magazine是杂志。'],['窗户','window是窗户。']]),
   vocab('wall','on the wall\nwall 是什么？','墙',[['地板','floor是地板。'],['桌子','table是桌子。'],['架子','shelf是架子。']]),
   vocab('trousers','trousers\n选出这个词的意思。','长裤',[['衬衫','shirt是衬衫。'],['鞋子','shoes是鞋子。'],['领带','tie是领带。']])
  ],
  roles:[
   q('story-books','找出原文中书的位置','课文中，书在哪里？',[["On the stereo.",''],['On the television.','电视机上是杂志。'],['On the table.','桌上是报纸。']],"On the stereo.",'原文说书在音响上。','回看介绍音响的几句话。','Lesson27 N09–N11与读前问题','从原文获取书的位置，图片区不代答'),
   q('story-near','区分被介绍物品和相邻参照物','课文中，扶手椅靠近什么？',[['the table',''],['the window','靠近窗户的是电视机。'],['the door','靠近门的是音响。']],'the table','The armchairs are near the table.','回看介绍扶手椅的那两句。','Lesson27 N07–N08','从表面位置推进到邻近关系，辨别同文中不同参照物')
  ],
  observe:[
   q('plural-existence','让存在句与复数名词搭配','There ___ some armchairs in the room.\n空格填什么？',[['are',''],['is','本课armchairs是复数，搭配are。'],['am','am不用于这个存在句。']],'are','本课 There are 搭配复数名词 armchairs。','先看看空格后面的物品名称是什么形式。','Lesson27 N07与注释1','在前单元There is基础上处理复数，不重练单数整套'),
   q('irregular','辨认两种已示范的不规则复数','knife 和 policeman 变成复数，分别是哪一组？',[['knives · policemen',''],['knifes · policemen','knife的复数是knives。'],['knives · policemans','policeman的复数是policemen。']],'knives · policemen','knife → knives；policeman → policemen。','回看介绍小锦囊里的词形对照。','Lesson28 Written A2–3','将两种易错变化合为一题；不机械换五个主语')
  ],
  be:[
   q('ask-existence','区分问有没有与问位置','想知道房间里有没有图画，应该怎么问？',[['Are there any pictures in the room?',''],['Where are the pictures?','这在询问图画在哪里。'],['There are some pictures in the room.','这是介绍，不是提问。']],'Are there any pictures in the room?','用 Are there any…? 询问有没有。','先分清要问有没有，还是要问在哪里。','Lesson28 Written B9','从陈述推进到提问用途，对比两个已教问题'),
   q('they-reference','找到复数代词回指的物品',"There are some tickets on the shelf.\nThey're in that handbag.\n这里的 They 指什么？",[['tickets',''],['the shelf','这里不是用They指单个架子。'],['that handbag','这里不是用They指单个手提包。']],'tickets','They 指前句介绍的那些票。','回看正在介绍的物品，而不是它们所在的容器。','Lesson28图9999','用复数代词接续物品，并理解容器在架子上的嵌套关系')
  ],
  trans:[
   q('build-existence','独立组织复数存在句','墙上有一些图画。',undefined,'There are some pictures on the wall.','There are 介绍这些图画，on the wall 说明位置。','先介绍有什么，再接上位置。','Lesson27 N12–N13','撤去句框，独立组织陈述',{type:'order',tokens:['There','are','some','pictures','on','the','wall.']}),
   q('build-question','独立组织询问有无的句子','另一个房间：\n问一问：房间里有没有书？',undefined,'Are there any books in the room?','询问有无时，本课用 Are there any…?。','问句要从提问的部分开始，留意句尾问号。','Lesson28 Written B1','由用途选择推进到问句词序；不是Lesson27现场',{type:'order',tokens:['Are','there','any','books','in','the','room?']}),
   q('build-negative','回应同一问题并组织否定句','这个房间里没有书。\n回答刚才的问题：不，房间里没有书。',undefined,"No, there aren't any books in the room.",'否定回答用 there aren’t any…。','先作否定回答，再说清没有什么、在哪里。','Lesson28 Written B1','承接上一问题，新增否定结构而非换名词',{type:'order',tokens:['No,','there',"aren't",'any','books','in','the','room.']})
  ],
  exam:[
   q('exam-picture','同时理解表面位置和邻近参照物',"There are some forks on the shelf.\nThey're near those spoons.\n哪幅图符合介绍？",[['甲图',''],['乙图','叉子与勺子相邻，但在桌上。'],['丙图','叉子在架上，但勺子放在另一个远处架子上。']],'甲图','叉子在架上，靠近那些勺子。','分开核对放在哪个表面，以及靠近什么。','Lesson28图7780综合抽样','将on与near两个关系合并；同等图片描述',{optionImages:{'甲图':image('forks-shelf'),'乙图':image('forks-table'),'丙图':image('forks-far-spoons')},optionImageAlts:{'甲图':'叉子和勺子相邻放在同一架子上','乙图':'叉子和勺子相邻放在桌子上','丙图':'叉子在左边架子上，勺子在远处的另一个架子上'}}),
   q('exam-boundary','理解否定存在句的范围',"There aren't any cups on the table.\n只根据这句话，能确定什么？",[['桌上没有杯子。',''],['房间里没有杯子。','只说桌上没有，不能扩大到整个房间。'],['桌上什么也没有。','只排除杯子，不排除别的物品。']],'桌上没有杯子。','否定的对象是杯子，范围是桌上。','分别找出被否定的物品和句子说明的位置。','Lesson28 Written B的否定句改编','从前单元肯定边界推进到否定的对象与范围')
  ]
 };
 const stages=[
  {id:'l1',title:'先认识客厅',activities:[['words','客厅小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'走进史密斯家',activities:[['text','客厅小导览','book'],['roles','课文小侦探','people']],required:['text','roles']},
  {id:'l3',title:'发现更多物品',activities:[['phrases','介绍小锦囊','speech'],['observe','复数发现站','question']],required:['observe']},
  {id:'l4',title:'问问在哪里',activities:[['models','客厅陈列册','cards'],['be','位置问答站','cards'],['trans','词块拼装台','order']],required:['be','trans']},
  {id:'l5',title:'我的客厅导览',activities:[['exam','客厅小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
 ];
 const definition={id:'unit27-28',version:1,title:'客厅发现之旅',path:'/unit27-28/',start:'learn/words',progress:{learningKey:'canran:unit27-28:learning:v1'},objects:WORDS,stages,questions,
  learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,MODELS,MODEL_EXAMPLE,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK}};
 root.CanranCore.unit2728=definition;
 if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
