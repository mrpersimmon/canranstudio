(function(root){
 'use strict';
 const image=name=>'/assets/unit29-30/'+name.replaceAll(' ','-').replaceAll('.','')+'.svg';
 const source='《新概念英语智慧版1》纸页58–61（PDF91–94）';
 const WORDS=[
  ['shut','关上','/ʃʌt/','shut the door'],['bedroom','卧室','/ˈbedruːm/'],['untidy','不整齐的','/ʌnˈtaɪdi/'],['must','本课：必须；应该','/mʌst/','What must I do?'],['open','打开','/ˈoʊpən/','open the window'],['air','本课：使……通风','/er/','air the room'],
  ['put','放置','/pʊt/','put these clothes in the wardrobe'],['clothes','衣服（复数形式）','/kloʊðz/'],['wardrobe','衣柜','/ˈwɔːrdroʊb/'],['dust','本课：掸掉灰尘','/dʌst/','dust the dressing table'],['sweep','扫','/swiːp/','sweep the floor'],['empty','本课：倒空；使……变空','/ˈempti/','empty the cup'],
  ['read','本课：读','/riːd/','read this book'],['sharpen','削尖；使锋利','/ˈʃɑːrpən/','sharpen these pencils'],['put on','穿上；戴上','/pʊt ˈɑːn/','put on your shirt'],['take off','本课：脱下；摘下','/teɪk ˈɑːf/','take off your shirt'],['turn on','开启（电器、水龙头等）','/tɝːn ˈɑːn/','turn on the lamp'],['turn off','关闭（电器、水龙头等）','/tɝːn ˈɑːf/','turn off the lamp'],
  ['come in','进来','/kʌm ˈɪn/'],['make the bed','整理床铺','/meɪk ðə ˈbed/'],['then','然后；接着','/ðen/'],['clean','本课：清洁','/kliːn/','clean the window'],['window','窗户','/ˈwɪndoʊ/'],['door','门','/dɔːr/'],
  ['bed','床','/bed/'],['floor','地板','/flɔːr/'],['dressing table','梳妆台','/ˈdresɪŋ ˌteɪbəl/'],['lamp','灯','/læmp/'],['tap','水龙头','/tæp/'],['book','书','/bʊk/']
 ].map(([en,cn,ph,example=''])=>({en,cn,ph,example,image:image(en),source}));
 const PEOPLE={Jones:{name:'琼斯太太',image:image('Jones')},Amy:{name:'艾米',image:image('Amy')}};
 const DIALOGUE=[
  ['Jones','Come in, Amy.','进来，艾米。'],['Jones','Shut the door, please.','请把门关上。'],['Jones',"This bedroom's very untidy.",'这间卧室很不整齐。'],['Amy','What must I do, Mrs. Jones?','我应该做些什么呢，琼斯太太？'],['Jones','Open the window and air the room.','打开窗户，给房间通通风。'],['Jones','Then put these clothes in the wardrobe.','然后把这些衣服放进衣柜里。'],['Jones','Then make the bed.','接着整理床铺。'],['Jones','Dust the dressing table.','掸掉梳妆台上的灰尘。'],['Jones','Then sweep the floor.','然后扫地。']
 ].map(([person,text,cn],i)=>({id:'L29-D'+String(i+1).padStart(2,'0'),person,who:person==='Amy'?'student':'teacher',text,cn,source:source+'；Lesson29原文'}));
 const PHRASES=[
  ['Come in, Amy.','邀请艾米进来。','come in'],['Shut the door, please.','请对方把门关上。','shut'],['What must I do?','问自己应该做什么。','must'],['Put these clothes in the wardrobe.','把这些衣服放进衣柜里。','put'],['Make the bed.','整理床铺，不是制造一张床。','make the bed'],['Then sweep the floor.','then 把接下来的动作连起来。','sweep']
 ].map(([en,cn,picture])=>({en,cn,image:image(picture),source:source+'；课文表达支架'}));
 // Each numbered picture stays in its textbook action group. Paired verbs are alternatives.
 const pictureGroups=[
  ['打开与关上',['Open your','Shut your'],[['handbag','手提包'],['desk','课桌'],['suitcase','手提箱'],['book','书']]],
  ['穿上与脱下',['Put on your','Take off your'],[['shirt','衬衫'],['watch','手表'],['shoes','鞋子'],['tie','领带'],['blouse','女式衬衫'],['suit','套装']]],
  ['开启与关闭',['Turn on the','Turn off the'],[['stereo','音响'],['television','电视机'],['lamp','灯'],['tap','水龙头'],['cooker','炉灶']]],
  ['扫一扫',['Sweep the'],[['floor','地板'],['kitchen','厨房'],['living room','客厅'],['bedroom','卧室']]],
  ['清洁物品',['Clean the'],[['car','汽车'],['cupboard','橱柜'],['refrigerator','冰箱'],['cooker','炉灶']]],
  ['掸去灰尘',['Dust the'],[['cupboard','橱柜'],['dressing table','梳妆台'],['shelves','架子（复数）']]],
  ['倒空容器',['Empty the'],[['cup','杯子'],['box','盒子'],['bottle','瓶子'],['suitcase','手提箱']]],
  ['读一读',['Read this'],[['book','书'],['magazine','杂志'],['newspaper','报纸']]],
  ['削尖或磨利',['Sharpen these'],[['pencils','铅笔（复数）'],['knives','刀（复数）']]]
 ];
 let number=0;
 const GALLERY=pictureGroups.map(([title,verbs,items])=>({title,items:items.map(([noun,cn])=>({number:++number,en:verbs.map(v=>v+' '+noun+'.').join('\n'),cn,image:image(noun),source:source+'；Lesson30图'+number}))}));
 const REFERENCE=[['The window isn’t clean.','Clean it!'],['The door isn’t shut.','Shut it!'],['The wardrobe isn’t open.','Open it!']].map(([prompt,en])=>({prompt,en,source:source+'；Lesson30 Written A'}));
 const WRITING_VERBS=['Shut the','Open the','Put on your','Take off your','Turn on the','Turn off the','Sweep the','Clean the','Dust the','Empty the','Read this','Sharpen these'];
 const WRITING_NOUNS=['stereo','tap','blackboard','cup','window','cupboard','magazine','knives','shirt','door','floor','shoes'];
 const MODELS=['Open the window!','Put on your shirt!','Take off your shoes!','Turn on the stereo!','Turn off the tap!','Sweep the floor!','Clean the blackboard!','Dust the cupboard!','Empty the cup!','Read this magazine!','Sharpen these knives!'];
 const q=(id,target,prompt,options,answer,explanation,hint,basis,decision,extra={})=>({id:'u2930-v1-'+id,target,prompt,options:options?.map(o=>o[0]),answer,explanation,hint,source:source+'；'+basis,decision,distractorReasons:options?Object.fromEntries(options.filter(o=>o[0]!==answer)):undefined,...extra});
 const vocab=(id,prompt,answer,wrong,extra={})=>q('vocab-'+id,'理解 '+id+' 的本课含义',prompt,[[answer,''],...wrong],answer,'本题理解 '+id+' 的本课含义。','','Lesson29–30词表','新词仅一次辨义；成对动作留到情境练习',{presentation:'vocabulary',...extra});
 const questions={
  listen:[
   vocab('bedroom','bedroom\n选出这个词的意思。','卧室',[['厨房','kitchen是厨房。'],['客厅','living room是客厅。'],['办公室','office是办公室。']]),
   vocab('untidy',"This bedroom’s very untidy.\nuntidy 在这里表示什么？",'不整齐的',[['干净的','clean是干净的。'],['大的','large是大的。'],['空的','empty作形容词是空的。']]),
   vocab('clothes','看看图，选出英文。','clothes',[['books','这里画的是衣服。'],['bottles','bottles是瓶子。'],['magazines','magazines是杂志。']],{image:image('clothes'),imageAlt:'一件衬衫和一条长裤'}),
   vocab('wardrobe','wardrobe\n选出这个词的意思。','衣柜',[['梳妆台','dressing table是梳妆台。'],['窗户','window是窗户。'],['地板','floor是地板。']]),
   vocab('air','air the room\n这里的 air 要做什么？','让房间通风',[['把房间扫干净','扫用sweep。'],['把门关上','关门用shut the door。'],['整理床铺','整理床铺用make the bed。']]),
   vocab('dust','dust the dressing table\n这里的 dust 要做什么？','掸去灰尘',[['打开','open是打开。'],['倒空','empty是倒空。'],['阅读','read是阅读。']]),
   vocab('sweep','“扫地”中的“扫”用哪个词？','sweep',[['read','read是读。'],['shut','shut是关上。'],['put','put是放置。']]),
   vocab('empty','Empty the cup.\n这里的 Empty 要做什么？','把杯子倒空',[['把杯子装满','与倒空相反。'],['把杯子擦干净','clean表示清洁。'],['把杯子放进衣柜','put表示放置。']]),
   vocab('read','Read this book.\n这里要做什么？','读这本书',[['关上这本书','shut是关上。'],['打开这本书','open是打开。'],['拿走这本书','本句不是拿走。']]),
   vocab('sharpen','Sharpen these pencils.\n这里要做什么？','削尖这些铅笔',[['把铅笔收起来','不是收纳。'],['把铅笔擦干净','clean是清洁。'],['数一数铅笔','不是计数。']])
  ],
  roles:[
   q('story-floor','依据课文找出清扫地面的方式','琼斯太太让艾米怎样清理地板？',[['Sweep the floor.',''],['Dust the dressing table.','这是清理梳妆台。'],['Air the room.','这是给房间通风。']],'Sweep the floor.','原文最后说 Then sweep the floor.','回看最后一句，找清理地板的动作。','Lesson29读前问题与D09','从识词推进到原文证据'),
   q('story-sequence','按原文确认任务先后','课文中，整理好床铺之后，紧接着做什么？',[['Dust the dressing table.',''],['Put these clothes in the wardrobe.','这件事在整理床铺之前。'],['Shut the door.','关门在前面。']],'Dust the dressing table.','整理床铺之后掸梳妆台灰尘。','回看 make the bed 后面紧接的那句话。','Lesson29 D06–D09','同篇获取顺序而非重复问物品位置')
  ],
  observe:[
   q('must-purpose','理解任务问句的用途','What must I do?\n艾米想问什么？',[['我应该做什么？',''],['我的东西在哪里？','这是问位置。'],['我是什么职业？','这是问职业。']],'我应该做什么？','这里询问自己应该做的任务。','先看这句话要问位置、职业，还是行动。','Lesson29 D04与注释2','识别新问句的交际目的'),
   q('base-verb','祈使句用动作原形','请对方打开窗户：\n___ the window, please.',[['Open',''],['Opens','本课指令直接用动词原形。'],['Opening','本课指令不是-ing形式。']],'Open','祈使句通常省略you，用动词原形。','回看课文里动作指令怎样开头。','Lesson29注释1','只抽一题动词形式，不逐动作重复填空'),
   q('bedroom-is','按语境区分缩写与所有格',"This bedroom’s very untidy.\n这里 bedroom’s 中的 ’s 代表什么？",[['is',''],['“卧室的”','后面在说明卧室的状态，不是某个物品属于卧室。'],['are','bedroom在这里是单数。']],'is','This bedroom is very untidy.','看后面是在介绍谁的物品，还是说明这间房的状态。','Lesson29 D03','与前单元Mrs. Smith’s的所有格做有意义对照')
  ],
  be:[
   q('switch-on','按动作对象选电器开启表达','要把灯打开，让它亮起来，选哪一句？',[['Turn on the lamp.',''],['Open the lamp.','不是打开灯的外壳。'],['Turn off the lamp.','这是关灯。']],'Turn on the lamp.','开启灯用turn on。','注意操作的是开关，还要看希望灯亮还是灭。','Lesson30图13','区分open与turn on，不把中文打开机械直译'),
   q('take-off','区分穿戴动作的相反方向','要脱下衬衫，选哪一句？',[['Take off your shirt.',''],['Put on your shirt.','这是穿上衬衫。'],['Clean your shirt.','这是清洁衬衫。']],'Take off your shirt.','take off在这里表示脱下。','看看是把衣服穿到身上，还是从身上脱下。','Lesson30图5','与开关对比不同，新增穿戴的方向'),
   q('put-place','区分放置与穿戴','Put these clothes in the wardrobe.\n要把衣服怎样处理？',[['放进衣柜。',''],['穿到身上。','穿上是put on，不是put…in…。'],['从身上脱下。','脱下是take off。']],'放进衣柜。','put…in…说明放到哪里。','留意动作后有没有交代要放到的地方。','Lesson29 D06与Lesson30词表','把put与put on作语境比较，不能只看首词')
  ],
  trans:[
   q('build-task','独立组织任务问句','我应该做什么？',undefined,'What must I do?','What must I do? 询问应该做什么。','先放疑问词，再想想谁要做事。','Lesson29 D04去掉称呼','从理解用途推进到独立词序',{type:'order',tokens:['What','must','I','do?']}),
   q('build-bed','用顺序词和固定短语给指令','接着整理床铺。',undefined,'Then make the bed.','make the bed是整理床铺。','先交代接下来，再接动作和对象。','Lesson29 D07','固定搭配加顺序，不是问句换名词',{type:'order',tokens:['Then','make','the','bed.']}),
   q('build-two-actions','用and组织两个动作','打开窗户，给房间通风。',undefined,'Open the window and air the room.','and连接两个动作。','两个动作各自带着对象，中间用连接词。','Lesson29 D05','从单一指令推进到两个动作的连接',{type:'order',tokens:['Open','the','window','and','air','the','room.']})
  ],
  exam:[
   q('exam-picture','结合两个不同对象理解指令','Turn off the lamp.\nThen open the book.\n做完后是哪幅图？',[['甲图',''],['乙图','书打开了，但灯还亮着。'],['丙图','灯关了，但书仍合着。']],'甲图','灯灭了，书打开了。','分别核对两个对象最后的状态。','Lesson30图4与13组合迁移','换到操作后的状态图，同时处理turn off与open',{optionImages:{'甲图':image('lamp-off-book-open'),'乙图':image('lamp-on-book-open'),'丙图':image('lamp-off-book-shut')},optionImageAlts:{'甲图':'灯没有发光，书摊开着','乙图':'灯有光芒，书摊开着','丙图':'灯没有发光，书合着'}}),
   q('exam-repair','从状态描述转成合适的动作指令','The window isn’t clean.\n要解决这个问题，选哪一句？',[['Clean it!',''],['Open it!','打开窗户不能表示把它清洁干净。'],['Shut it!','关上窗户不能表示清洁。']],'Clean it!','it指窗户，clean在指令中是清洁。','先看窗户存在什么问题，再找能解决它的动作。','Lesson30 Written A1','将不是干净的状态转成动作，并迁移it指代')
  ]
 };
 const stages=[
  {id:'l1',title:'认识整理动作',activities:[['words','整理小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'艾米的整理任务',activities:[['text','房间小剧场','book'],['roles','课文小侦探','people']],required:['text','roles']},
  {id:'l3',title:'读懂任务指令',activities:[['phrases','行动小锦囊','speech'],['observe','指令发现站','question']],required:['observe']},
  {id:'l4',title:'把动作说清楚',activities:[['models','动作百宝箱','cards'],['be','动作选择站','cards'],['trans','词块拼装台','order']],required:['be','trans']},
  {id:'l5',title:'我的整理行动',activities:[['exam','整理小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
 ];
 const definition={id:'unit29-30',version:1,title:'房间整理行动',path:'/unit29-30/',start:'learn/words',progress:{learningKey:'canran:unit29-30:learning:v1'},objects:WORDS,stages,questions,
  learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,REFERENCE,WRITING_VERBS,WRITING_NOUNS,MODELS,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK}};
 root.CanranCore.unit2930=definition;
 if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
