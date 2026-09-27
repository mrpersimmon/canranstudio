(function(root){
 'use strict';
 const recordingRevisions={'l12-b02':'l12-b02-v2'};
 const image=name=>'/assets/unit11-12/'+name+'.svg',recording=name=>'unit11-12/audio/'+(recordingRevisions[name]||name)+'.mp3';
 const source='《新概念英语智慧版1》纸页22–25（PDF55–58）';
 const oldImage={shirt:'/assets/unit1-2/shirt.svg',suit:'/assets/unit3-4/suit.svg',skirt:'/assets/unit1-2/skirt.svg',son:'/assets/unit3-4/son.svg',daughter:'/assets/unit3-4/daughter.svg',handbag:'/assets/unit1-2/handbag.svg',car:'/assets/unit1-2/car.svg',coat:'/assets/unit1-2/coat.svg',umbrella:'/assets/unit3-4/umbrella.svg',pen:'/assets/unit1-2/pen.svg',dress:'/assets/unit1-2/dress.svg',pencil:'/assets/unit1-2/pencil.svg'};
 const word=(en,cn,ph,file,example='')=>({en,cn,ph,audio:recording(file),image:oldImage[en]||image(en),example,source});
 const WORDS=[
  word('whose','谁的','/huːz/','l11-w01'),word('blue','蓝色的','/bluː/','l11-w02'),word('perhaps','也许；不确定','/pɚˈhæps/','l11-w03'),word('white','白色的','/waɪt/','l11-w04'),word('catch','接住；抓住','/kætʃ/','l11-w05'),
  word('father','父亲','/ˈfɑːðɚ/','l12-w01'),word('mother','母亲','/ˈmʌðɚ/','l12-w02'),word('blouse','女衬衫','/blaʊs/','l12-w03'),word('sister','姐姐；妹妹','/ˈsɪstɚ/','l12-w04'),word('tie','领带','/taɪ/','l12-w05'),word('brother','哥哥；弟弟','/ˈbrʌðɚ/','l12-w06'),word('his','本课表示“他的”','/hɪz/','l12-w07','his shirt'),word('her','本课表示“她的”','/hɝː/','l12-w08','her blouse'),
  word('shirt','衬衫','/ʃɝːt/','review-w01'),word('suit','一套西服','/suːt/','review-w02'),word('skirt','裙子','/skɝːt/','review-w03'),word('son','儿子','/sʌn/','review-w04'),word('daughter','女儿','/ˈdɑːt̬ɚ/','review-w05')
 ];
 const PEOPLE={teacher:{name:'老师',image:image('teacher')},dave:{name:'Dave',image:image('dave')},tim:{name:'Tim',image:image('tim')}};
 const DIALOGUE=[
  ['teacher','Whose shirt is that?','那是谁的衬衫？'],['teacher','Is this your shirt, Dave?','Dave，这是你的衬衫吗？'],['dave','No, sir.','不，先生。'],['dave',"It's not my shirt.",'这不是我的衬衫。'],['dave','This is my shirt.','这才是我的衬衫。'],['dave',"My shirt's blue.",'我的衬衫是蓝色的。'],['teacher',"Is this shirt Tim's?",'这件衬衫是 Tim 的吗？'],['dave','Perhaps it is, sir.','也许是，先生。'],['dave',"Tim's shirt's white.",'Tim 的衬衫是白色的。'],['teacher','Tim!','Tim！'],['tim','Yes, sir?','什么事，先生？'],['teacher','Is this your shirt?','这是你的衬衫吗？'],['tim','Yes, sir.','是的，先生。'],['teacher','Here you are.','给你。'],['teacher','Catch!','接着！'],['tim','Thank you, sir.','谢谢您，先生。']
 ].map(([person,text,cn],i)=>({id:'L11-D'+String(i+1).padStart(2,'0'),person,who:person==='teacher'?'teacher':'student',text,cn,audio:recording('l11-d'+String(i+1).padStart(2,'0')),source:source+'；Lesson11原文'}));
 // Audio mappings are historical provenance; the classroom page does not play them.
 const AUDIO=Object.fromEntries(WORDS.map(w=>[w.en,w.audio]));DIALOGUE.forEach(line=>{AUDIO[line.text]=line.audio;});
 const PHRASES=[
  {en:'Whose shirt is that?',cn:'问那件衬衫是谁的',image:image('whose')},
  {en:'Whose is this shirt?',cn:'也可以这样问这件衬衫的主人',image:oldImage.shirt},
  {en:'Whose is that tie?',cn:'用 that 问那条领带是谁的',image:image('tie')},
  {en:"Tim's shirt's white.",cn:'Tim 的衬衫是白色的',image:image('white-shirt')}
 ];AUDIO[PHRASES[1].en]=recording('phrase-this');AUDIO[PHRASES[2].en]=recording('phrase-that');
 const REFERENCE=[
  {en:'Hans is here. That is his car.',cn:'车主是 Hans（he）',image:oldImage.car},
  {en:'Stella is here. That is her car.',cn:'车主是 Stella（she）',image:oldImage.car},
  {en:'Excuse me, Steven. Is this your umbrella?',cn:'当面对 Steven 确认伞是不是他的',image:oldImage.umbrella},
  {en:'I am an air hostess. My name is Britt.',cn:'Britt 在介绍自己的名字',image:'/assets/unit7-8/air-hostess.svg'},
  {en:'Paul is here, too. That is his coat.',cn:'外套的主人是 Paul（he）',image:oldImage.coat}
 ];REFERENCE.forEach((x,i)=>{AUDIO[x.en]=recording('written-a-'+String(i).padStart(2,'0'));});
 const MODEL_SEEDS=[['handbag','Stella','her'],['car','Paul','his'],['coat','Sophie','her'],['umbrella','Steven','his'],['pen','my son','his'],['dress','my daughter','her'],['suit','my father','his'],['skirt','my mother','her'],['blouse','my sister','her'],['tie','my brother','his'],['pen','Sophie','her'],['pencil','Hans','his']];
 const MODELS=MODEL_SEEDS.map(([object,owner,possessive],i)=>{const en=`Whose is this ${object}? It's ${owner}'s. It's ${possessive} ${object}.`;AUDIO[en]=recording('l12-b'+String(i+1).padStart(2,'0'));return {object,owner,possessive,en,cn:object+' · '+owner,image:oldImage[object]||image(object),source:source+'；Lesson12图示／Written B展开示范'};});
 const MODEL_EXAMPLE={en:"Whose is this shirt? It's Tim's. It's his shirt.",cn:'问主人，再用名字或 his 回答',image:image('white-shirt')};AUDIO[MODEL_EXAMPLE.en]=recording('l12-b00');
 AUDIO["This is my brother's pen. It's his pen."]=recording('challenge-owner');
 const q=(id,target,prompt,options,answer,explanation,hint,basis,decision,extra={})=>({id:'u1112-v1-'+id,target,prompt,options:options?.map(o=>o[0]),answer,explanation,hint,source:source+'；'+basis,decision,distractorReasons:options?Object.fromEntries(options.filter(o=>o[0]!==answer)):undefined,...extra});
 const vocabulary=[
  [
    "meaning",
    "whose",
    "谁的",
    [
      "谁的",
      "谁",
      "什么",
      "怎样"
    ],
    "Whose shirt is that?\nwhose 问的是什么？"
  ],
  [
    "meaning",
    "blue",
    "蓝色的",
    [
      "蓝色的",
      "白色的",
      "红色的",
      "黑色的"
    ]
  ],
  [
    "meaning",
    "perhaps",
    "也许；不确定",
    [
      "也许；不确定",
      "一定是",
      "一定不是",
      "谢谢"
    ],
    "Perhaps it is.\nperhaps 表示什么？"
  ],
  [
    "english",
    "white",
    "白色的",
    [
      "white",
      "blue"
    ]
  ],
  [
    "meaning",
    "catch",
    "接住",
    [
      "接住",
      "再见",
      "谢谢",
      "看见"
    ],
    "Here you are. Catch!\n这里的 Catch! 是让对方做什么？"
  ],
  [
    "english",
    "father",
    "父亲",
    [
      "father",
      "mother",
      "brother",
      "son"
    ]
  ],
  [
    "meaning",
    "mother",
    "母亲",
    [
      "母亲",
      "父亲",
      "姐姐；妹妹",
      "女儿"
    ]
  ],
  [
    "picture",
    "blouse",
    "女衬衫",
    [
      "blouse",
      "skirt",
      "suit",
      "tie"
    ],
    "看图，选出对应的英文。",
    "一件带领子、纽扣和蝴蝶结的女衬衫。"
  ],
  [
    "meaning",
    "sister",
    "姐姐；妹妹",
    [
      "姐姐；妹妹",
      "哥哥；弟弟",
      "母亲",
      "父亲"
    ],
    "My sister is here.\nsister 表示什么亲属关系？"
  ],
  [
    "picture",
    "tie",
    "领带",
    [
      "tie",
      "blouse",
      "skirt",
      "suit"
    ],
    "看图，选出对应的英文。",
    "一条有斜条纹的领带。"
  ],
  [
    "english",
    "brother",
    "哥哥；弟弟",
    [
      "brother",
      "sister",
      "father",
      "mother"
    ]
  ],
  [
    "meaning",
    "his",
    "他的",
    [
      "他的",
      "她的",
      "我的",
      "你的"
    ],
    "his shirt\nhis 在这里表示什么？"
  ],
  [
    "meaning",
    "her",
    "她的",
    [
      "她的",
      "他的",
      "我的",
      "你的"
    ],
    "her blouse\nher 在这里表示什么？"
  ]
];
 const questions={
  // Preserve old bookmarks, but old hearing results cannot answer new tasks.
  listen:vocabulary.map(([kind,en,meaning,options,customPrompt,imageAlt])=>{
   const word=WORDS.find(item=>item.en===en),answer=kind==='meaning'?meaning:en;
   const prompt=customPrompt||(kind==='meaning'?`${en}\n选出这个词的意思。`:`${meaning}\n选出对应的英文。`);
   const target=kind==='meaning'?'理解词义':kind==='picture'?'看图认词':'选择英文';
   const choices=options.map(value=>[value,value===answer?'':kind==='meaning'?`这里的 ${en} 表示“${meaning}”，不是“${value}”。`:`${value} 表示${WORDS.find(item=>item.en===value).cn}；这里要选 ${en}（${meaning}）。`]);
   return q('vocab-'+en,target+' '+en,prompt,choices,answer,`${en} 在这里表示“${meaning}”。`,'','Lesson11–12 新词','每个新词一次；不整组反向重考；图片和语境不能代替英文辨认',{
    presentation:'vocabulary',...(kind==='picture'?{image:word.image,imageAlt}:{})
   });
  }),
  roles:[
   q('story-owner','从原文找到白衬衫的主人','课文里，谁的衬衫是白色的？',[['Tim',''],['Dave','Dave 说自己的衬衫是蓝色的。'],['老师','老师帮忙寻找主人，并没有说衬衫是自己的。']],'Tim','Dave 说 Tim’s shirt’s white.，后来 Tim 也确认衬衫是自己的。','看看 Dave 说白衬衫的那一句。','Lesson11听前问题；L11-D09、D12–D13','完整故事理解：从描述和本人确认找到主人',{optionImages:{Tim:image('tim'),Dave:image('dave'),'老师':image('teacher')}}),
   q('story-it','追踪否定句中的物品','Dave 说 “It’s not my shirt.”，It 指哪件东西？',[['老师手里的白衬衫',''],['Dave 的蓝衬衫','Dave 接着说 This is my shirt.，指自己的蓝衬衫。'],['领带','这一段一直在说衬衫，没有询问领带。']],'老师手里的白衬衫','老师拿着白衬衫问 Dave；Dave 说“它不是我的”，再指给老师看自己的蓝衬衫。','先找老师刚刚拿给 Dave 看的是哪件。','L11-D02–D06及原图','区分眼前待认领物与本人另指的物品，不再只猜人名',{optionImages:{'老师手里的白衬衫':image('white-shirt'),'Dave 的蓝衬衫':image('blue-shirt'),'领带':image('tie')}})
  ],
  owner:[
   q('owner-her','根据物主选择 her','车主：Stella（she）\nThat is ___ car.',[['her',''],['his','物主卡里的 Stella 用 she。'],['your','这句在向别人介绍 Stella 的车，没有直接对车主说话。'],['my','说话人并没有说车属于自己。']],'her','Stella 是车主，人物卡用 she，所以这里用 her car。选 his 或 her 看的是主人，不是物品。','谁拥有车？看物主卡。','Lesson12 Written A1；补充明确物主条件','引入第三人称物主；在已教 my／your／his／her 中区分物主和说话关系'),
   q('owner-your','同一物品在对话中转换视角','伞属于 Dave。Dave 说：“This is my umbrella.”\nTim 当面对 Dave 说：“Yes, it’s ___ umbrella.”',[['your',''],['my','Tim 不是伞的主人，不能说是自己的。'],['his','Tim 正在当面对 Dave 说话，这里称对方为 you。'],['her','对话里没有用 she 指代的物主。']],'your','主人没有变。Dave 说自己的用 my；Tim 当面对 Dave 说“你的”，用 your。','看 Tim 正在对谁说话。','my／your；明确的新对话','只抽样一次复习Lesson3–4，增加说话人切换条件'),
   q('owner-apostrophe','分清所有格与 is 缩写','Tim’s shirt’s white.\n哪一处 ’s 表示“是”（is）？',[["shirt's",''],["Tim's",'Tim’s 在这里表示“Tim 的”，不是 Tim is。']],"shirt's",'这句展开是 Tim’s shirt is white.。Tim’s 表示“Tim 的”；shirt’s = shirt is。','把句子读成“Tim 的衬衫是白色的”。','L11-D09；Notes2；Lesson9–10缩写衔接','同句两个 ’s 功能不同，不能一律解释成“的”或 is')
  ],
  trans:[
   q('build-whose','用 Whose 询问远处物品的主人','远处有一条领带，主人还不知道。\n用 Whose 开头问它是谁的。',undefined,'Whose is that tie?','Whose 问“谁的”；that 指那条领带。','先问“谁的”，再放 is 和远处的物品。','Lesson12标题句型；tie词汇','第一次主动组织所有者问句，加入远近线索',{type:'order',tokens:['Whose','is','that','tie?']}),
   q('build-sister','用关系称谓所有格回答','这件女衬衫属于我的姐姐。\n用 my sister’s 回答它是谁的。',undefined,"It's my sister's.",'my sister’s 表示“我姐姐的”；已经知道在说女衬衫，可以省去后面的 blouse。','这是在回答物品的归属；检查表达“谁的”的形式。','Lesson12 Written B9；Notes2','从姓名所有格进到关系称谓，允许已知物品省略',{type:'order',tokens:["It's",'my',"sister's."]})
  ],
  exam:[
   q('exam-read','从英文介绍提取亲属与其物品',"This is my brother's pen. It's his pen.\n选出对应的认领记录。",[['my brother · pen',''],['my sister · pen','物品是 pen，但句子说的物主是 my brother。'],['my brother · tie','物主是 my brother，但句子里的物品是 pen。']],'my brother · pen','句子说这是“我兄弟的钢笔”，再用 his pen 指同一件物品。','分别找出主人和物品，再看 his 指谁。','新的英文阅读情境；Lesson12词汇和所有格','同时核对主人和物品，不只认一个词'),
   q('exam-perhaps','把不确定信息用于归还决定','Dave 只说：“Perhaps it’s Tim’s.”\n老师接下来应该怎样做？',[['请 Tim 确认',''],['直接认定是 Tim 的','perhaps 表示也许，Dave 没有确认主人。'],['直接认定不是 Tim 的','也许是，不代表一定不是。']],'请 Tim 确认','perhaps 表示“也许”。先问 Tim，得到确认后再归还。','Dave 的这句话有没有完全确定主人？','L11-D07–D13；明确截取到perhaps时刻','根据不确定证据选择下一步，不把猜测当成事实'),
   q('exam-distractor','不把旁边的人当成物主','钢笔属于 Sophie（she）。Paul（he）站在旁边，主人没有变。\nThis is ___ pen.',[['her',''],['his','Paul 只是站在旁边，不是钢笔的主人。'],['my','说话人没有拥有这支钢笔。']],'her','选物主词要找真正的主人 Sophie，不能被旁边的 Paul 干扰。','把“站在旁边的人”和“主人”分清。','Written B11与新场景','增加另一个在场人物干扰，检查是否追踪主人而非最近人名')
  ]
 };
 // Keep the exact three-question manuscript for verified old answers and drafts.
 const previousQuestions={...questions};
 const finalQuestion=(id,...args)=>({...q(id,...args),id:'u1112-final-v2-'+id});
 questions.exam=[...previousQuestions.exam,
  finalQuestion('ask-owner','用 Whose 询问近处物品的主人','手边有一个手提包，主人还不知道。\n哪一句是在问“这是谁的手提包”？',[
   ['Whose is this handbag?',''],['Whose is that handbag?','that 指那一个；题面要问的是手边这一个。'],['Is this your handbag?','这是向某个人确认是不是他的，不是开放地问主人是谁。']
  ],'Whose is this handbag?','Whose 问归属；this 指手边这一个。','留意问的是“谁的”，还是“是不是你的”。','L11首句、Notes1；L12标题','选择询问归属的功能并核对近处条件，不只排序给好的问句'),
  finalQuestion('my-your','同一件物品随说话人改用 my 或 your','蓝衬衫属于 Dave。依次补好对话。\nDave: This is ___ shirt.\n老师当面对 Dave: Yes, it’s ___ shirt.',[
   ['my / your',''],['your / my','Dave 是主人，应先说自己的；老师是在对他说“你的”。'],['my / his','第二句老师当面对 Dave 说话，称对方为 you。']
  ],'my / your','衣服主人没有变；Dave 说 my，老师当面对他说 your。','同一件衣服，谁在对谁说话？','L12 Written A2/A3；L11 D05–D06','与前置伞题间隔复习，补全两个话轮的必要对比'),
  finalQuestion('family-owner','关系称谓的所有格与 his 对应','西服属于我的父亲（he）。\nIt’s my ___. It’s ___ suit.\n依次补好两处。',[
   ["father's / his",''],['father / his','第一句是在说“我父亲的”，需要 father’s。'],["father's / her",'给定物主用 he，第二句对应 his。']
  ],"father's / his",'my father’s 可以省略已知的 suit；his suit 仍在说同一位父亲的西服。','两句都要说同一位主人的物品。','L12 Written B7、亲属词；Notes2','必要对比省略物品的所有格与物品前的物主词；不靠衣服猜 he/she'),
  finalQuestion('expand-is','展开 is 缩写并保留所有格',"Tim's shirt's white.\n把表示 is 的缩写展开，哪句意思不变？",[
   ["Tim's shirt is white.",''],["Tim is shirt's white.",'Tim’s 表示“Tim 的”，不能展开成 Tim is。'],["Tim's shirt white.",'完整句不能漏掉 is。']
  ],"Tim's shirt is white.",'第一处 ’s 表示 Tim 的；第二处 shirt’s 是 shirt is。','找出“谁的衬衫”和“衬衫是什么颜色”。','L11 D09、Notes2；前课is缩写','由指出某一处变为判断整句展开；必要复习，不逐句机械换人名'),
  finalQuestion('confirm-both','区分非物主否认与物主确认','白衬衫已确认属于 Tim。老师分别问 Dave 和 Tim：\nIs this your shirt?\n两人应该怎样回答？',[
   ['Dave: No, sir. / Tim: Yes, sir.',''],['Dave: Yes, sir. / Tim: No, sir.','两个人的回答反了。'],['Dave: Yes, sir. / Tim: Yes, sir.','已知这件衣服属于 Tim，Dave 不能也确认是自己的。']
  ],'Dave: No, sir. / Tim: Yes, sir.','同一件已确认属于 Tim 的衬衫，Dave 否认，Tim 确认。','只按已确认的归属回答，不靠衣服颜色猜。','L11 D02–D04、D12–D13','同一物品的肯定／否定必要对比，与Perhaps的未知状态区分'),
  finalQuestion('build-question','组织 Whose 后紧接物品的问句','远处有一件衬衫，主人还不知道。\n用词块问它是谁的。',undefined,'Whose shirt is that?','Whose shirt 问“谁的衬衫”；is that 接着指远处那件。','这次把“谁的”和物品放在一起。','L11 D01；L12标题对照','前置是 Whose is that tie?，本题组织另一种已教语序；that 已给定，不算独立选择远近',{type:'order',tokens:['Whose','shirt','is','that?']}),
  finalQuestion('return-thanks','按说话角色完成归还与道谢','Tim 已确认白衬衫是自己的。\n老师归还衬衫，Tim 道谢。哪组对白合适？',[
   ['老师：Here you are. / Tim：Thank you, sir.',''],['老师：Thank you, sir. / Tim：Here you are.','交出物品的人和接收后道谢的人对调了。'],['老师：Whose shirt is that? / Tim：No, sir.','这组还在询问并否认，没有完成已确认后的归还与道谢。']
  ],'老师：Here you are. / Tim：Thank you, sir.','老师交出衬衫时说 Here you are；Tim 收到后道谢。','谁交出物品，谁收到物品？','L11 D14–D16、Notes3','将教材最后一段用于交接话轮，区别人物用途；不要求现实中抛接物品')
 ];
 const activityPredecessors={exam:['exam']};
 const stages=[
  {id:'l1',title:'准备找主人',activities:[['words','认领小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'一件白衬衫',activities:[['text','认领小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
  {id:'l3',title:'谁的说清楚',activities:[['phrases','物主小锦囊','speech'],['owner','物主不弄错','question']],required:['owner']},
  {id:'l4',title:'认领有办法',activities:[['models','认领小画册','cards'],['trans','词块拼装台','order']],required:['trans']},
  {id:'l5',title:'归还小能手',activities:[['exam','归还小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
 ];
 const definition={id:'unit11-12',version:1,title:'失物招领小侦探',path:'/unit11-12/',start:'learn/words',progress:{learningKey:'canran:unit11-12:learning:v1'},learning:{WORDS,PEOPLE,DIALOGUE,AUDIO,PHRASES,REFERENCE,MODELS,MODEL_EXAMPLE,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},objects:WORDS,stages,questions,previousQuestions,activityPredecessors};
 root.CanranCore.unit1112=definition;if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
