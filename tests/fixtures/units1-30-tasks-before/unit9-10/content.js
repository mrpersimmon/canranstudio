(function(root){
 'use strict';
 const image=name=>'/assets/unit9-10/'+name+'.svg',recording=name=>'unit9-10/audio/'+name+'.mp3';
 const source='《新概念英语智慧版1》纸页18–21（PDF51–54）';
 const word=(en,cn,ph,file,example='')=>({en,cn,ph,audio:recording(file),image:image(en),example,source});
 const WORDS=[
  word('hello','你好；打招呼','/heˈloʊ/','l09-w01'),word('hi','嗨；你好','/haɪ/','l09-w02'),
  word('how','怎样；本课用于问候','/haʊ/','l09-w03','How are you?'),word('today','今天','/təˈdeɪ/','l09-w04'),
  word('well','本课指身体好的','/wel/','l09-w05',"I'm very well."),word('fine','本课指身体好、状态不错','/faɪn/','l09-w06',"I'm fine."),
  word('thanks','谢谢','/θæŋks/','l09-w07'),word('goodbye','再见','/ɡʊdˈbaɪ/','l09-w08'),word('see','见到；看见','/siː/','l09-w09','Nice to see you.'),
  word('fat','胖的','/fæt/','l10-w01'),word('woman','成年女子','/ˈwʊmən/','l10-w02'),word('thin','瘦的','/θɪn/','l10-w03'),
  word('tall','高的；本课形容身高','/tɑːl/','l10-w04'),word('short','矮的；本课形容身高','/ʃɔːrt/','l10-w05'),
  word('dirty','脏的','/ˈdɝːt̬i/','l10-w06'),word('clean','干净的','/kliːn/','l10-w07'),word('hot','热的；觉得热的','/hɑːt/','l10-w08'),
  word('cold','冷的；觉得冷的','/koʊld/','l10-w09'),word('old','年老的；本课形容人','/oʊld/','l10-w10'),word('young','年轻的','/jʌŋ/','l10-w11'),
  word('busy','忙的','/ˈbɪzi/','l10-w12'),word('lazy','懒惰的；不愿付出努力','/ˈleɪzi/','l10-w13')
 ];
 const PEOPLE=Object.fromEntries(['steven','helen','tony','emma'].map(name=>[name,{name:name[0].toUpperCase()+name.slice(1),image:image(name)}]));
 const DIALOGUE=[
  ['steven','Hello, Helen.','你好，海伦。'],['helen','Hi, Steven.','你好，史蒂文。'],
  ['steven','How are you today?','你今天好吗？'],['helen',"I'm very well, thank you.",'我很好，谢谢你。'],
  ['helen','And you?','你好吗？'],['steven',"I'm fine, thanks.",'我很好，谢谢。'],
  ['steven','How is Tony?','托尼好吗？'],['helen',"He's fine, thanks.",'他很好，谢谢。'],
  ['helen',"How's Emma?",'埃玛好吗？'],['steven',"She's very well, too, Helen.",'她也很好，海伦。'],
  ['steven','Goodbye, Helen.','再见，海伦。'],['steven','Nice to see you.','见到你很高兴。'],
  ['helen','Nice to see you, too, Steven.','见到你我也很高兴，史蒂文。'],['helen','Goodbye.','再见。']
 ].map(([person,text,cn],i)=>({id:'L09-D'+String(i+1).padStart(2,'0'),person,who:person==='steven'?'teacher':'student',text,cn,audio:recording('l09-d'+String(i+1).padStart(2,'0')),source:source+'；Lesson9原文'}));
 // Audio mappings are historical provenance; the classroom page does not play them.
 const AUDIO=Object.fromEntries(WORDS.map(w=>[w.en,w.audio]));DIALOGUE.forEach(line=>{AUDIO[line.text]=line.audio;});
 const PHRASES=[
  {en:'How are you today?',cn:'问候眼前的朋友',image:image('hello')},
  {en:"I'm very well, thank you.",cn:'告诉对方自己很好，并道谢',image:image('well')},
  {en:'And you?',cn:'接着问对方：你呢？',image:image('how')},
  {en:'Nice to see you.',cn:'见到你很高兴',image:image('see')}
 ];
 const REFERENCE=[
  {en:"Robert isn't a teacher. He's an engineer.",cn:'Robert → He is → He’s',image:'/assets/unit7-8/robert.svg'},
  {en:"Mr. Blake isn't a student. He's a teacher.",cn:'Mr. Blake → He’s',image:'/assets/unit5-6/blake.svg'},
  {en:"This isn't my umbrella. It's your umbrella.",cn:'this umbrella → It is → It’s',image:'/assets/unit3-4/umbrella.svg'},
  {en:"Sophie isn't a teacher. She's a keyboard operator.",cn:'Sophie → She is → She’s',image:'/assets/unit7-8/sophie.svg'},
  {en:"Steven isn't cold. He's hot.",cn:'第二句才明确说他觉得热',image:image('hot')},
  {en:"Naoko isn't Chinese. She's Japanese.",cn:'Naoko → She’s',image:'/assets/unit5-6/naoko.svg'},
  {en:"This isn't a German car. It's a Swedish car.",cn:'this car → It’s',image:'/assets/unit5-6/volvo.svg'}
 ];REFERENCE.forEach((item,i)=>{AUDIO[item.en]=recording('written-a-'+String(i).padStart(2,'0'));});
 const MODEL_SEEDS=[['that man','fat','he'],['that woman','thin','she'],['that policeman','tall','he'],['that policewoman','short','she'],['that mechanic','dirty','he'],['that nurse','clean','she'],['Steven','hot','he'],['Emma','cold','she'],['that milkman','old','he'],['that air hostess','young','she'],['that hairdresser','busy','he'],['that housewife','lazy','she']];
 const MODELS=MODEL_SEEDS.map(([subject,adjective,pronoun],i)=>{
  const en=`Look at ${subject}! ${pronoun==='he'?"He's":"She's"} very ${adjective}.`;AUDIO[en]=recording('l10-b'+String(i+1).padStart(2,'0'));
  return {subject,adjective,pronoun,en,cn:WORDS.find(w=>w.en===adjective).cn,image:image(adjective),source:source+'；Lesson10图示与Written B改编点读示范'};
 });
 const MODEL_EXAMPLE={en:"Look at Helen. She's very well.",cn:'先指出看谁，再描述她的状态',image:image('helen')};AUDIO[MODEL_EXAMPLE.en]=recording('l10-b00');
 AUDIO['Tony is very well, thanks.']=recording('challenge-tony');
 const q=(id,target,prompt,options,answer,explanation,hint,basis,addition,extra={})=>({id:'u910-v1-'+id,target,prompt,options:options?.map(o=>o[0]),answer,explanation,hint,source:source+'；'+basis,decision:addition,distractorReasons:options?Object.fromEntries(options.filter(o=>o[0]!==answer)):undefined,...extra});
 const vocabulary=[
  [
    "meaning",
    "woman",
    "成年女子",
    [
      "成年女子",
      "母亲",
      "女儿",
      "成年男子"
    ]
  ],
  [
    "meaning",
    "fat",
    "胖的",
    [
      "胖的",
      "瘦的",
      "高的",
      "矮的"
    ]
  ],
  [
    "english",
    "thin",
    "瘦的",
    [
      "thin",
      "fat",
      "tall",
      "short"
    ]
  ],
  [
    "meaning",
    "tall",
    "高的",
    [
      "高的",
      "矮的",
      "年老的",
      "年轻的"
    ],
    "tall（形容身高）\n选出这个词的意思。"
  ],
  [
    "english",
    "short",
    "矮的",
    [
      "short",
      "tall",
      "thin",
      "fat"
    ],
    "形容身高“矮的”\n选出对应的英文。"
  ],
  [
    "picture",
    "dirty",
    "脏的",
    [
      "dirty",
      "clean",
      "hot",
      "cold"
    ],
    "看图，选择描述衣服的词。",
    "人物的衣服上沾有污渍。"
  ],
  [
    "picture",
    "clean",
    "干净的",
    [
      "clean",
      "dirty",
      "old",
      "young"
    ],
    "看图，选择描述衣服的词。",
    "人物穿着没有污渍的干净衣服。"
  ],
  [
    "picture",
    "hot",
    "觉得热的",
    [
      "hot",
      "cold",
      "old",
      "young"
    ],
    "看图，选择人物此时的感受。",
    "太阳下的人物在流汗、扇扇子。"
  ],
  [
    "meaning",
    "cold",
    "冷的；觉得冷的",
    [
      "冷的；觉得冷的",
      "热的；觉得热的",
      "干净的",
      "脏的"
    ]
  ],
  [
    "meaning",
    "old",
    "年老的",
    [
      "年老的",
      "年轻的",
      "高的",
      "矮的"
    ],
    "old（形容人）\n选出这个词的意思。"
  ],
  [
    "english",
    "young",
    "年轻的",
    [
      "young",
      "old",
      "busy",
      "lazy"
    ]
  ],
  [
    "english",
    "busy",
    "忙的",
    [
      "busy",
      "lazy",
      "fine",
      "well"
    ]
  ],
  [
    "meaning",
    "lazy",
    "懒惰的；不愿付出努力",
    [
      "懒惰的；不愿付出努力",
      "忙的",
      "年老的",
      "年轻的"
    ]
  ]
];
 const questions={
  // Preserve old bookmarks, but old hearing results cannot answer new tasks.
  listen:vocabulary.map(([kind,en,meaning,options,customPrompt,imageAlt])=>{
   const word=WORDS.find(item=>item.en===en),answer=kind==='meaning'?meaning:en;
   const prompt=customPrompt||(kind==='meaning'?`${en}\n选出这个词的意思。`:`${meaning}\n选出对应的英文。`);
   const target=kind==='meaning'?'理解词义':kind==='picture'?'看图认词':'选择英文';
   const choices=options.map(value=>[value,value===answer?'':kind==='meaning'?`这里的 ${en} 表示“${meaning}”，不是“${value}”。`:`${value} 表示${WORDS.find(item=>item.en===value).cn}；这里要选 ${en}（${meaning}）。`]);
   return q('vocab-'+en,target+' '+en,prompt,choices,answer,`${en} 在这里表示“${meaning}”。`,'','Lesson10 新词','每个新词一次；不整组反向重考；图片和语境不能代替英文辨认',{
    presentation:'vocabulary',...(kind==='picture'?{image:word.image,imageAlt}:{})
   });
  }),
  roles:[
   q('story-emma','理解对 Emma 的问候','Lesson 9 的对话里，Emma 身体怎么样？',[["She's very well.",''],["She's very cold.",'cold 表示觉得冷；这不是 Lesson9 对话对她身体状况的回答。'],["He's fine.",'Emma 在课文里用 she 指代。']],"She's very well.",'Steven 说 She’s very well, too, Helen.，说 Emma 身体也很好。','回想 How’s Emma? 后的回答。','L09-D09–D10；教材听前问题','依靠课文回答身体状况，不借用Lesson10另一幅图'),
   q('story-and-you','理解省略问句的对象','Helen 说 “And you?”，是在问谁？',[['Steven',''],['Tony','Tony 是稍后才被问到的人。'],['Helen','Helen 正在询问对面的 Steven。']],'Steven','Helen 先说自己很好，再问 Steven 的情况。','看看此时和 Helen 面对面聊天的是谁。','L09-D03–D06','And you? 承接前面的问候，并把问题交还给对方',{optionImages:{Steven:image('steven'),Tony:image('tony'),Helen:image('helen')}}),
   q('story-he','追踪不在场的人物','“He’s fine, thanks.” 里的 He 指谁？',[['Tony',''],['Steven','前一句问的是 How is Tony?。'],['Helen','前一句问的是 Tony；Helen 是回答的人。']],'Tony','Steven 问 Tony 好不好，Helen 用 He 回答 Tony 的情况。','先找这句回答前面的问句。','L09-D07–D08','代词指的是被问到的人，未必是当前说话人',{optionImages:{Tony:image('tony'),Steven:image('steven'),Helen:image('helen')}})
  ],
  reply:[
   q('reply-well','回答身体问候','朋友问：“How are you today?”\n你今天很好，怎么回答？',[["I'm fine, thanks.",''],["My name's Robert.",'这句在介绍名字，没有回应身体问候。'],["I'm Italian.",'这句在介绍国籍，没有回应身体问候。']],"I'm fine, thanks.",'How are you? 问你怎么样；I’m fine, thanks. 回答自己很好并道谢。','这次问的是状态，不是名字或国籍。','L09-D03–D06；Notes1','与前单元身份介绍区分；只保留一次有意义的对照'),
   q('reply-see','回应见面时的友好表达','Steven 说：“Nice to see you.”\n你也很高兴见到他，怎么接话？',[['Nice to see you, too.',''],["I'm fine, thanks.",'这是回应 How are you?，没有表达“我也很高兴见到你”。'],['How is Tony?','这是转问 Tony 的情况，没有接上这句友好表达。']],'Nice to see you, too.','too 在这里表示“也”；回应同样的见面喜悦。','想一想怎样表达“我也一样”。','L09-D12–D13；Notes3','选择回应话语功能，不重复姓名或职业问答')
  ],
  describe:[
   q('describe-he','完整的 He is 缩写','Steven isn’t cold. ___ hot.',[["He's",''],['He','He 只有“他”，这里还需要 is。'],["She's",'课文里的 Steven 用 he 指代。']],"He's",'He’s = He is；既要说清“他”，也不能漏掉 is。','把缩写展开，看看有没有 is。','Lesson10 Written A4','从Lesson7–8的单独be选择进到代词与be完整缩写'),
   q('describe-it','给单个物品换用 It’s','This isn’t my umbrella. ___ your umbrella.',[["It's",''],["He's",'这里继续说的是 umbrella，不是男性人物。'],["She's",'这里继续说的是 umbrella，不是女性人物。']],"It's",'这句继续谈一把伞，用 It’s（It is）；所有者是谁不改变对物品用 it。','空格后还在说伞，不是在说伞的主人。','Lesson10 Written A2','由人转到物，区分物品和所有者'),
   q('describe-now','依据当前画面描述状态','Look at the nurse.（人物卡：she）\n哪一句符合画面？',[["She's busy.",''],["She's lazy.",'她正在处理眼前的护理工作；这幅图没有表现不愿付出努力。'],["He's busy.",'人物卡明确用 she。']],"She's busy.",'图中这位护士正忙着照顾病人，所以说 She’s busy.；职业不能决定一个人现在的状态。','看她正在做什么，不从职业名称猜。','明确的新画面；不是Lesson10 nurse/clean原图','换成同一职业的另一时刻，防止把职业与一个形容词绑定',{image:image('busy-nurse'),imageAlt:'人物卡 she：护士正在为坐着的病人包扎手臂，旁边放着打开的护理用品箱。'})
  ],
  trans:[
   q('build-return','回应后也关心对方','朋友问你好不好。告诉他“很好，谢谢”，再问“你呢？”',undefined,"I'm fine, thanks. And you?",'先回应自己，再用 And you? 把问候交还给对方。','先回答自己的状态并道谢，再把同样的问题问回去。','L09-D04–D06合并改编','撤去完整选项，并增加回问这一回合',{type:'order',tokens:["I'm",'fine,','thanks.','And','you?']}),
   q('build-look','用 Look at 引导观察','请朋友看看 Emma，再说她觉得冷。',undefined,"Look at Emma. She's cold.",'Look at 后接要看的对象；She’s cold. 描述这幅图中她的感受。','先指出看谁，再描述她。','Lesson10 Emma/cold图；Written B8','从选一个词转为组织观察指令与完整描述',{type:'order',tokens:['Look at','Emma.',"She's",'cold.']})
  ],
  exam:[
   q('exam-read','从英文介绍提取人物与身体状况','Tony is very well, thanks.\n选出对应的记录。',[['Tony · fine',''],['Tony · cold','句子说 very well，表示身体很好，没有说觉得冷。'],['Emma · fine','句子说的是 Tony，不是 Emma。']],'Tony · fine','Tony is very well 表示 Tony 身体很好；fine 也可以表示状态不错。','先找人物，再看描述身体状况的词。','新的英文阅读情境','同时核对人物与状态，well与fine同义对应，不照搬上一题选项'),
   q('exam-evidence','否定信息不能任意推出反面','卡片只写着：Steven isn’t cold.\n能确定哪件事？',[['他不觉得冷',''],['他一定觉得热','不冷也可能只是温度合适；句子没有说 hot。'],['他身体不舒服','cold 在这里说冷的感受，不能据此判断身体不好。']],'他不觉得冷','isn’t cold 只说明“不冷”；只有另有 hot 的信息，才能说他觉得热。','只依据这张卡片给出的信息。','Written A4撤去第二句；新判断条件','撤去hot证据，检查是否错误地从否定推出反义状态'),
   q('exam-object','把描述方法用于物品','这把伞沾了泥。请朋友看看它，再用缩写说它是脏的。',undefined,"Look at that umbrella. It's dirty.",'看物品也可以用 Look at；继续说这把伞，用 It’s dirty.。','Look at 后放物品；It’s 后放描述词。','已教Look at、It’s与dirty的新组合','把人物描述迁移到单个物品，只抽样一次',{type:'order',tokens:['Look at','that umbrella.',"It's",'dirty.'],image:image('dirty-umbrella'),imageAlt:'伞面沾有泥点的一把雨伞。'})
  ]
 };
 // Exact predecessors retain checked answers and active drafts after regrouping.
 const previousQuestions={...questions};
 const finalQuestion=(id,...args)=>({...q(id,...args),id:'u910-final-v2-'+id});
 questions.exam=[...previousQuestions.exam,
  finalQuestion('ask-how','区分你与第三人称的问候形式','How ___ you today?\nHow ___ Emma?\n依次补好两句问候。',[
   ['are / is',''],['is / are','you 在这里搭配 are，Emma 是一个人，搭配 is。'],['are / are','第二句问 Emma 一个人的状态，需要 is。']
  ],'are / is','How are you? 问对面的你；How is Emma? 问 Emma。','每句分别在问候谁？','L09-D03、D09；How’s=How is','从完整句意进入两种主语对应的问候形式，必要对比不省略'),
  finalQuestion('return-greeting','听话人用自己作主语回应回问','你今天很好。Helen 说：\nI\'m very well, thank you. And you?\n你怎么回答？',[
   ["I'm fine, thanks.",''],["He's fine, thanks.",'He’s 在说第三人称男性，没有回答 Helen 对你的回问。'],["She's very well, too.",'She’s 在说第三人称女性，没有回答自己的情况。']
  ],"I'm fine, thanks.",'Helen 的 And you? 把同样的问候问回给你；回答自己的情况，用 I’m。','先想清她现在在关心谁，再回应那个人的状态。','L09-D04–D06、Notes2','对前面问候的间隔复习；这次由 And you? 理解回问，不重做整句拼装'),
  finalQuestion('warm-goodbye','表达同样的见面喜悦再道别','Steven 说：Nice to see you.\n你也很高兴见到他，接着向他道别。怎样说？',[
   ['Nice to see you, too. Goodbye.',''],['How are you today? Goodbye.','前半句另起身体问候，没有表达“我也很高兴见到你”。'],['Nice to see you, too. Hello.','Hello 用于见面打招呼，题目此时要道别。']
  ],'Nice to see you, too. Goodbye.','too 表达同样的喜悦；Goodbye 用来道别。','这次要先接住对方的友好表达，再结束交谈。','L09-D11–D14、Notes3','一次任务结合回应与告别；不把其他问候本身判断为不礼貌'),
  finalQuestion('complete-subject','为两个人物和一个物品选完整缩写',"Mr. Blake isn't a student. ___ a teacher.\nSophie isn't a teacher. ___ a keyboard operator.\nThis isn't a German car. ___ a Swedish car.\n依次补好三处。",[
   ["He's / She's / It's",''],['He / She / It','这三句不只需要代词，还需要 is。'],["It's / He's / She's",'人物和物品的指代顺序都不相符。']
  ],"He's / She's / It's",'Mr. Blake 用 He is，Sophie 用 She is，这辆车用 It is；缩写分别为 He’s、She’s、It’s。','先找每句接着说谁或什么，再检查有没有 be。','L10 Written A1、A3、A6','检验三种主语与完整 be 的必要对比，不能只给正确缩写让孩子排序'),
  finalQuestion('observe-work','依据当前动作判断状态','Look at that hairdresser.（人物卡：he）\n哪句话有画面依据？',[
   ["He's busy.",''],["He's lazy.",'画中他正在为顾客理发，没有“不愿付出努力”的证据。'],["He's cold.",'画面表现理发动作，没有提供觉得冷的证据。']
  ],"He's busy.",'画中理发师正在为顾客理发，这个动作支持 busy；不是所有理发师任何时候都忙。','看他手里拿着什么、正在做什么。','L10 图示21、Written B11；现有观察窗插画','把当前动作作为依据；与前面护士新画面形成一次间隔复习',{
   image:image('busy'),imageAlt:'人物卡 he：理发师手持剪刀，正在为面前的顾客理发。'
  }),
  finalQuestion('look-at-person','先引导观察再完整描述人物','请朋友看看 Helen，再说她身体很好。\n用词块说两句话。',undefined,"Look at Helen. She's very well.",'Look at 后接要看的 Helen；接着用 She’s very well. 描述她的状态。','先指出看谁，再完整地说她的状态。','L10 Written B示例；L09身体问候','一次人物描述的间隔复习；Look 和 at 分开，孩子需要安排它们的位置',{
   type:'order',tokens:['Look','at','Helen.',"She's",'very well.']
  }),
  finalQuestion('expand-how','理解疑问与人物描述中的缩写',"How's Emma? She's very well.\n两处缩写展开后分别是什么？",[
   ['How is / She is',''],['How are / She are','本句 How’s 和 She’s 都包含 is，不是 are。'],['How is / He is','She’s 展开仍是 She is，不能换成 He is。']
  ],'How is / She is','在这两句中，How’s 是 How is，She’s 是 She is。','展开后，问的人和回答里的人都不能改变。','L09-D09–D10；锦囊一句话变短','实际选择完整形式，不把缩写仅出现在题面中当作完成')
 ];
 questions.reply=[previousQuestions.reply[0],previousQuestions.trans[0],previousQuestions.reply[1]];
 questions.describe=[...previousQuestions.describe,previousQuestions.trans[1]];
 delete questions.trans;
 const activityPredecessors={reply:['reply','trans'],describe:['describe','trans'],exam:['exam']};
 const stages=[
  {id:'l1',title:'准备打招呼',activities:[['words','问候小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'街角遇见朋友',activities:[['text','街角小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
  {id:'l3',title:'把关心接下去',activities:[['phrases','问候小锦囊','speech'],['reply','问候接力','heart']],required:['reply']},
  {id:'l4',title:'看一看，说一说',activities:[['models','街角观察窗','cards'],['describe','看图说清楚','question']],required:['describe']},
  {id:'l5',title:'暖心小伙伴',activities:[['exam','街角小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
 ];
 const definition={id:'unit9-10',version:1,mode:'classroom',title:'街角问候站',path:'/unit9-10/',start:'learn/words',progress:{learningKey:'canran:unit9-10:learning:v1'},learning:{WORDS,PEOPLE,DIALOGUE,AUDIO,PHRASES,REFERENCE,MODELS,MODEL_EXAMPLE,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},objects:WORDS,stages,questions,previousQuestions,activityPredecessors};
 root.CanranCore.unit910=definition;if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
