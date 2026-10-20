(function(root){
 'use strict';
 const image=name=>'/assets/unit23-24/'+name.replaceAll(' ','-')+'.svg';
 const source='《新概念英语智慧版1》纸页46–49（PDF79–82）';
 const WORDS=[
  ['on','本课：在……上面','/ɑːn/','on the shelf'],['shelf','架子；搁板','/ʃelf/'],['desk','书桌；课桌','/desk/'],['table','桌子','/ˈteɪbəl/'],['plate','盘子','/pleɪt/'],['cupboard','橱柜','/ˈkʌbɚd/'],
  ['cigarette','香烟','/ˈsɪɡəret/'],['television','电视机','/ˈteləvɪʒən/'],['floor','本课：地板','/flɔːr/','on the floor'],['dressing table','梳妆台','/ˈdresɪŋ ˌteɪbəl/'],['magazine','杂志','/ˌmæɡəˈziːn/'],['bed','床','/bed/'],
  ['newspaper','报纸','/ˈnuːzˌpeɪpɚ/'],['stereo','立体声音响','/ˈsterioʊ/'],['some','一些；若干','/sʌm/','some glasses'],['glass','本课：玻璃杯','/ɡlæs/'],['glasses','本课：多个玻璃杯','/ˈɡlæsɪz/'],['one','代替前面的一件物品','/wʌn/','Which one?'],
  ['ones','代替前面的多件物品','/wʌnz/','Which ones?'],['these','这些（近处）','/ðiːz/','These glasses?'],['those','那些（较远处）','/ðoʊz/','No, not those.'],['give','给；递给','/ɡɪv/','Give me some glasses.'],['me','我（作接收者）','/miː/'],['him','他（作接收者）','/hɪm/'],
  ['her','本课：她（作接收者）','/hɝː/','Give her some plates.'],['us','我们（作接收者）','/ʌs/'],['them','他们／她们／它们','/ðem/'],['pen','钢笔','/pen/'],['tie','领带','/taɪ/'],['chair','椅子','/tʃer/']
 ].map(([en,cn,ph,example=''])=>({en,cn,ph,example,image:image(en),source}));
 const PEOPLE={man:{name:'男士',image:image('man')},jane:{name:'简（Jane）',image:image('jane')}};
 const DIALOGUE=[
  ['man','Give me some glasses please, Jane.','请拿给我一些玻璃杯，简。'],['jane','Which glasses?','哪些玻璃杯？'],['jane','These glasses?','这些玻璃杯吗？'],['man','No, not those. The ones on the shelf.','不，不是那些。架子上的那些。'],
  ['jane','These?','这些吗？'],['man','Yes, please.','是的，请给我。'],['jane','Here you are.','给你。'],['man','Thanks.','谢谢。']
 ].map(([person,text,cn],i)=>({id:'L23-D'+String(i+1).padStart(2,'0'),person,who:person==='man'?'teacher':'student',text,cn,source:source+'；Lesson23原文'}));
 const PHRASES=[
  ['Give me a glass, please.','请给我一个玻璃杯。','glass'],['Give me some glasses, please.','请给我一些玻璃杯。','glasses'],['Which one?','哪一个？','one'],['Which ones?','哪些？','ones'],['These glasses?','这些玻璃杯吗？','these'],['No, not those.','不，不是那些。','those']
 ].map(([en,cn,picture])=>({en,cn,image:image(picture),source:source+'；Lesson23与前课单复数对照'}));
 const PLACES=[
  ['pens','desk','钢笔在书桌上','1117'],['ties','chair','领带在椅子上','1218'],['spoons','table','勺子在桌子上','1319'],['plates','cupboard','盘子在橱柜上','1420'],['cigarettes','television','香烟在电视机上','1521'],
  ['boxes','floor','盒子在地板上','1622'],['bottles','dressing table','瓶子在梳妆台上','1723'],['books','shelf','书在架子上','1824'],['magazines','bed','杂志在床上','1925'],['newspapers','stereo','报纸在音响上','2000']
 ];
 const GALLERY=PLACES.map(([subject,place,cn,number])=>({en:`${subject} / on the ${place}`,cn,image:image(subject+'-'+place),source:source+'；Lesson24图'+number}));
 const model=(subject,place)=>({subject,place,en:`Give me some ${subject} please.\nWhich ones? These?\nNo, not those. The ones on the ${place}.`,cn:'',image:image(subject+'-'+place),source:source+'；Lesson24 Written B'});
 const MODEL_EXAMPLE=model('glasses','shelf');
 const MODELS=PLACES.map(([subject,place])=>model(subject,place));
 const REFERENCE=[
  ['Give Jane this watch. Give ___ this one, too.','her'],['Give the children these ice creams. Give ___ these, too.','them'],['Give Tom this book. Give ___ this one, too.','him'],
  ['That is my passport. Give ___ my passport please.','me'],['That is my coat. Give ___ my coat please.','me'],['Those are our umbrellas. Give ___ our umbrellas please.','us']
 ].map(([prompt,answer])=>({prompt,answer,en:prompt.replace('___',answer),source:source+'；Lesson24 Written A'}));
 const q=(id,target,prompt,options,answer,explanation,hint,basis,decision,extra={})=>({id:'u2324-v1-'+id,target,prompt,options:options?.map(o=>o[0]),answer,explanation,hint,source:source+'；'+basis,decision,distractorReasons:options?Object.fromEntries(options.filter(o=>o[0]!==answer)):undefined,...extra});
 const vocab=(id,prompt,answer,wrong,basis,extra={})=>q('vocab-'+id,'理解 '+id+' 的本课含义',prompt,[[answer,''],...wrong],answer,'这里表示“'+answer+'”。','',basis,'新词或必要语境各一次，不整组重复翻译',{presentation:'vocabulary',...extra});
 const questions={
  listen:[
   vocab('on','on the shelf\non 在这里表示什么？','在……上面',[['在……里面','本课 on 指在表面上，不是容器内部。'],['在……下面','不是低于搁板的位置。'],['在……旁边','不是只在旁边。']],'Lesson23词表与D04'),
   vocab('shelf','shelf\n选出这个词的意思。','架子；搁板',[['书','book 是书，shelf 是放东西的搁板。'],['盘子','plate 是盘子。'],['椅子','chair 是椅子。']],'Lesson23词表'),
   vocab('desk','desk\n选出这个词的意思。','书桌；课桌',[['床','bed 是床。'],['盘子','plate 是盘子。'],['椅子','chair 是椅子。']],'Lesson24词表'),
   vocab('table','桌子\n选出对应的英文。','table',[['bed','bed 是床。'],['shelf','shelf 是搁板。'],['plate','plate 是盘子。']],'Lesson24词表'),
   vocab('plate','看看图，选出英文。','plate',[['cup','cup 是杯子，不是扁平的盘子。'],['spoon','spoon 是勺子。'],['bottle','bottle 是瓶子。']],'Lesson24词表',{image:image('plate'),imageAlt:'一个圆形的浅口餐盘'}),
   vocab('cupboard','cupboard\n选出这个词的意思。','橱柜',[['梳妆台','梳妆台是 dressing table。'],['地板','地板是 floor。'],['床','床是 bed。']],'Lesson24词表'),
   vocab('cigarette','cigarette\n选出这个词的意思。','香烟',[['粉笔','chalk 是粉笔，不是 cigarette。'],['钢笔','pen 是钢笔。'],['勺子','spoon 是勺子。']],'Lesson24词表'),
   vocab('television','电视机\n选出对应的英文。','television',[['stereo','stereo 是立体声音响。'],['cupboard','cupboard 是橱柜。'],['newspaper','newspaper 是报纸。']],'Lesson24词表'),
   vocab('floor','on the floor\nfloor 在这里表示什么？','地板',[['书架','本句 floor 不是 shelf。'],['桌面','桌面不等于地板。'],['屋顶','本句 floor 不是屋顶。']],'Lesson24词表与图1622'),
   vocab('dressing table','看看图，选出英文。','dressing table',[['shelf','图中有梳妆镜和台面，不是单独的搁板。'],['bed','bed 是床。'],['cupboard','图中是带镜子的梳妆台，不是餐具橱柜。']],'Lesson24词表',{image:image('dressing table'),imageAlt:'一张配有梳妆镜和抽屉的台子'}),
   vocab('magazine','magazine\n选出这个词的意思。','杂志',[['报纸','报纸是 newspaper。'],['电视机','电视机是 television。'],['盘子','盘子是 plate。']],'Lesson24词表'),
   vocab('bed','看看图，选出英文。','bed',[['chair','chair 是椅子。'],['desk','desk 是书桌。'],['cupboard','cupboard 是橱柜。']],'Lesson24词表',{image:image('bed'),imageAlt:'有床头、床垫、枕头和被子的床'}),
   vocab('newspaper','报纸\n选出对应的英文。','newspaper',[['magazine','magazine 是杂志。'],['television','television 是电视机。'],['plate','plate 是盘子。']],'Lesson24词表'),
   vocab('stereo','stereo\n本课说的是哪种物品？','立体声音响',[['电视机','电视机是 television。'],['台灯','不是发光的灯。'],['书桌','书桌是 desk。']],'Lesson24词表'),
   vocab('some','some glasses\n这里表示多少？','一些玻璃杯，没说具体几只。',[['只有一个玻璃杯。','glasses 是复数。'],['正好两个玻璃杯。','some 没有指定两个。'],['一副眼镜。','本课 glasses 指喝水用的玻璃杯。']],'Lesson23 D01与Lesson24标题')
  ],
  roles:[
   q('story-place','从原文位置限定选出一组杯子','课文中，男士想要哪些杯子？',[
    ['The ones on the shelf.',''],['The ones on the table.','男士说 shelf，不是 table。'],['The ones on the floor.','男士没有要地板上的杯子。']
   ],'The ones on the shelf.','男士明确说 The ones on the shelf.。','回看男士补充杯子位置的那一段。','Lesson23读前问题与D04','从原文确定位置，不看封面猜',{optionImages:{'The ones on the shelf.':image('glasses-shelf'),'The ones on the table.':image('glasses-table'),'The ones on the floor.':image('glasses-floor')}}),
   q('story-ones','根据前文确定复数代词指向','男士说：The ones on the shelf.\n这里的 ones 代替什么？',[
    ['前面说到的那些玻璃杯',''],['数字一','此处 ones 代替复数名词，不是报数。'],['放东西的那个架子','shelf 说明位置，ones 代替要拿的物品。']
   ],'前面说到的那些玻璃杯','ones 代替前文的 glasses。','先回看男士最开始要什么，再看位置说明。','Lesson23注释3与D01、D04','跨句回指，不把复数代词译为数字')
  ],
  observe:[
   q('request-plural','数量改变时同步改变限定词与名词','原来要一本书，现在要几本。\n哪句话符合新要求？',[
    ['Give me some books, please.',''],['Give me some book, please.','本课若干本书用复数 books。'],['Give me a book, please.','a book 仍是一本，没有改为几本。']
   ],'Give me some books, please.','some books 表示一些书。','看看要的是一件还是多件，再一起检查物品前后的词。','Lesson23 D01；新物品数量变化','较V15词义识别，新增整个请求的数一致'),
   q('these-perspective','从说话者手边的多件物品确认','你指着自己手边的两本书问“这些吗？”\n应该说什么？',[
    ['These?',''],['Those?','这里是说话者手边的这两本，不是较远的那些。'],['This one?','这里确认两本，不是一本。']
   ],'These?','These 用于说话者近处的多件物品。','同时留意说话的人在哪里，以及指着几件物品。','Lesson23 D03、D05；新情境','同时判断参照位置与数量')
  ],
  be:[
   q('on-contact','根据表面接触关系理解位置限定','The books on the desk.\n应该拿哪一组书？',[
    ['甲组',''],['乙组','书在抽屉里，不在书桌台面上。'],['丙组','书放在独立的墙上搁板上，虽然画得比桌子高，也不是在桌面上。']
   ],'甲组','on the desk 在这里是放在书桌台面上。','看书由哪个表面承托，不要只比较画面高低。','Lesson24位置结构；新配图','从词义应用到有干扰的空间关系',{optionImages:{'甲组':image('books-on-desk'),'乙组':image('books-in-desk'),'丙组':image('books-above-desk')},optionImageAlts:{'甲组':'三本书叠放在书桌台面上','乙组':'三本书放在书桌打开的抽屉里','丙组':'三本书放在书桌上方的独立墙上搁板上'}}),
   q('recipient-us','为已明确的接收者选择宾格形式','两位同学请简把雨伞递回给自己，一起说：\nThose are our umbrellas.\nGive ___ our umbrellas please.\n空格填什么？',[
    ['us',''],['we','we 作主语，不能放在这里作接收者。'],['our','our 说明所属，后面需要名词，不是这里的接收者形式。']
   ],'us','两位同学共同说话，也明确请求把雨伞递回给自己，Give 后用宾格 us；不只凭物品归属推断给谁。','先分清谁在说话，再区分给谁和谁的。','Lesson24 Written A6；补明递回场景','隔开后的单题人称复习，完整六题不强制重复')
  ],
  trans:[
   q('build-request','组织带复数物品的请求','请给我们一些盒子。',undefined,'Give us some boxes, please.','Give 后说明接收者与物品，some 后的 boxes 是复数。','先说动作和给谁，再说要什么。','Lesson24标题与图1622','撤去完整句支架，合并接收者与复数物品',{type:'order',tokens:['Give','us','some','boxes,','please.']}),
   q('build-confirm','组织复数询问和确认','哪些？这些吗？',undefined,'Which ones? These?','先问哪些，再用 These? 确认近处的这些。','分成询问和确认两个问句，留意问号。','Lesson24 Written B例题','从前课单数问法推进到复数',{type:'order',tokens:['Which','ones?','These?']}),
   q('build-location','否定当前一组并用位置限定','不，不是那些。桌子上的那些。',undefined,'No, not those. The ones on the table.','先否定 those，再用位置说明要哪一些。','先完成否定，再把指代和位置连起来。','Lesson23 D04与Lesson24位置结构','用位置而非前课形容词限定',{type:'order',tokens:['No,','not','those.','The','ones','on','the','table.']})
  ],
  exam:[
   q('exam-request','综合接收者与物品及位置','简是女士，这里的 her 指简。\nGive her some magazines, please.\nThe ones on the bed.\n应该怎样做？',[
    ['把床上的几本杂志递给简。',''],['把床上的几本杂志递给说话的人。','her 在题中指简，不是说话者。'],['把架子上的几本杂志递给简。','on the bed 指床上，不是架子上。']
   ],'把床上的几本杂志递给简。','接收者是简，物品是杂志，位置是床上。','分别核对给谁、什么物品、在哪儿。','Lesson23–24结构；新委托','把三个英文条件合并，少量抽样综合'),
   q('exam-changed','按同一说话者更正后的要求行动','杯子分别放在架子上和桌子上。\n男士先说：The ones on the shelf.\n接着更正：No, the ones on the table.\n最后应该拿哪些？',[
    ['桌子上的那些杯子',''],['架子上的那些杯子','这是先前的要求，后来已改为 table。'],['两处的杯子全部拿来','更正选择了 table，没有要求全部。']
   ],'桌子上的那些杯子','最后的更正指定了 table。','按先后顺序读，两次要求是否一样？','Lesson23否定与位置结构；更正情境','新增时间顺序条件，不照抄故事或上一单元澄清题')
  ]
 };
 const previousQuestions={exam:questions.exam.slice()};
 const activityPredecessors={exam:['exam']};
 // Coverage-driven additions; keep the two prior questions unchanged for migration.
 questions.exam.push(
  q("final-v2-some","some不规定确切数量","Give me some glasses.\n男士说明了什么？",[["要多个玻璃杯，没说具体几只。", ""], ["一定要两只玻璃杯。", "some 不等于 two。"], ["要一副眼镜。", "本课的 glasses 是玻璃杯。"]],"要多个玻璃杯，没说具体几只。","本题核对：some不规定确切数量。","数量词没有给出具体数字。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查some不规定确切数量",{}),
  q("final-v2-ones","ones替代复数名词","Give me some newspapers.\nThe ones on the stereo.\nones 指什么？",[["newspapers", ""], ["stereo", "音响说明位置，不是要拿的物品。"], ["一个物品", "这里 ones 代替的是复数。"]],"newspapers","本题核对：ones替代复数名词。","先找请求里的物品名。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查ones替代复数名词",{}),
  q("final-v2-perspective","同时判断近远和单复数","你站在门边，指着远处架上的三本书确认：",[["Those books?", ""], ["This book?", "数量和距离都不符。"], ["These books?", "These 通常表示说话者近处这些。"]],"Those books?","本题核对：同时判断近远和单复数。","从你所站的位置判断远近，再看数量。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查同时判断近远和单复数",{}),
  q("final-v2-on","on表示表面承托","The books on the desk.\n哪组符合这句？",[["甲组", ""], ["乙组", "书在抽屉里，不在桌面。"], ["丙组", "独立搁板在桌子上方，不等于桌面。"]],"甲组","本题核对：on表示表面承托。","看书由哪个表面承托。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查on表示表面承托",{"optionImages": {"甲组": "/assets/unit23-24/books-on-desk.svg", "乙组": "/assets/unit23-24/books-in-desk.svg", "丙组": "/assets/unit23-24/books-above-desk.svg"}, "optionImageAlts": {"甲组": "三本书在桌面上", "乙组": "三本书在抽屉里", "丙组": "三本书在独立墙上搁板上"}}),
  q("final-v2-recipient","接收者不必等于物主","这是 Tom 的书，但 Tom 请你交给 Jane（女士）。\nGive ___ Tom’s books, please.",[["her", ""], ["him", "这次指定接收者是 Jane，不是物主 Tom。"], ["his", "his 表示所属，不能放在此处作接收者。"]],"her","本题核对：接收者不必等于物主。","分别确认东西是谁的、现在要交给谁。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查接收者不必等于物主",{}),
  q("final-v2-our-us","our与us不同位置","两位同学请你把他们的盒子递回，一起说：\nThose are ___ boxes. Give ___ those boxes, please.",[["our · us", ""], ["us · our", "所属和接收者的词形反了。"], ["their · them", "两位同学在说自己，不是转述其他人。"]],"our · us","本题核对：our与us不同位置。","先看谁的盒子，再看给谁。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查our与us不同位置",{}),
  q("final-v2-build","独立组织多件请求","请给他一些盘子。",undefined,"Give him some plates, please.","本题核对：独立组织多件请求。","接收者在动作后，some 后面检查物品数量。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查独立组织多件请求",{"type": "order", "tokens": ["Give", "him", "some", "plates,", "please."]}),
  q("final-v2-location-clue","位置比物品种类更具体","A：pens on the desk\nB：pens on the table\n客人说：The ones on the desk.\n拿哪一组？",[["A", ""], ["B", "table 不是本题指定的 desk。"], ["A 和 B 都拿", "只指定一处的物品。"]],"A","本题核对：位置比物品种类更具体。","两组物品一样，要核对后面的地点。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查位置比物品种类更具体",{}),
 );
 const stages=[
  {id:'l1',title:'先认识房间',activities:[['words','房间小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'帮简找杯子',activities:[['text','找杯子小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
  {id:'l3',title:'认清一件和一些',activities:[['phrases','寻物小锦囊','speech'],['observe','数量小帮手','question']],required:['observe']},
  {id:'l4',title:'说清在何处',activities:[['models','房间位置册','cards'],['be','位置小帮手','cards'],['trans','词块拼装台','order']],required:['be','trans']},
  {id:'l5',title:'完成寻物任务',activities:[['exam','寻物小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
 ];
 const definition={id:'unit23-24',version:1,title:'房间寻物队',path:'/unit23-24/',start:'learn/words',progress:{learningKey:'canran:unit23-24:learning:v1'},objects:WORDS,stages,questions,previousQuestions,activityPredecessors,
  learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,MODELS,MODEL_EXAMPLE,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK}};
 root.CanranCore.unit2324=definition;
 if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);

// Task edition v4: exact prior rounds are evidence for unchanged questions only.
(function(core){
 const unit=core.unit2324;
 const revised={"listen":[unit.questions["listen"][0],
unit.questions["listen"][1],
unit.questions["listen"][2],
unit.questions["listen"][3],
{
  "id": "u2324-tasks-v4-objects",
  "target": "区分餐具与两类读物",
  "prompt": "给物品词配对。",
  "decision": "其余位置、some 的数量边界与易混家具仍保留独立题。",
  "hint": "",
  "source": "Lesson 23–24 plate、magazine、newspaper 词表",
  "type": "match",
  "pairs": [
    {
      "id": "1",
      "en": "plate",
      "cn": "盘子"
    },
    {
      "id": "2",
      "en": "magazine",
      "cn": "杂志"
    },
    {
      "id": "3",
      "en": "newspaper",
      "cn": "报纸"
    }
  ],
  "answer": "[\"1\",\"2\",\"3\"]",
  "distractorRationale": "盘子与两类读物分别识别，其他位置、家具和数量词练习保留。"
},
unit.questions["listen"][5],
unit.questions["listen"][6],
unit.questions["listen"][7],
unit.questions["listen"][8],
unit.questions["listen"][9],
unit.questions["listen"][11],
unit.questions["listen"][13],
unit.questions["listen"][14]],
"roles":[{
  "id": "u2324-tasks-v4-story-place",
  "target": "原文中找到位置限制",
  "prompt": "点出说明杯子位置的词组。",
  "decision": "问位置词组，不能只选择玻璃杯名称或 ones。",
  "hint": "物品后面的短语在缩小寻找范围。",
  "source": "Lesson 23 原文 The ones on the shelf.",
  "type": "locate",
  "fragments": [
    {
      "value": "The ones"
    },
    " ",
    {
      "value": "on the shelf"
    },
    "."
  ],
  "options": [
    "The ones",
    "on the shelf"
  ],
  "answer": "on the shelf",
  "distractorReasons": {
    "The ones": "这个片段不表达题目要求的信息；需结合完整句子判断。"
  },
  "distractorRationale": "on the shelf 给出地点；The ones 只指所选的一组，不包含摆放位置。"
},
unit.questions["roles"][1]],
"exam":[unit.questions["exam"][0],
unit.questions["exam"][1],
unit.questions["exam"][2],
unit.questions["exam"][3],
unit.questions["exam"][4],
unit.questions["exam"][5],
unit.questions["exam"][6],
{
  "id": "u2324-tasks-v4-exam-our-us",
  "target": "区分物主 our 与接收者 us",
  "prompt": "两位同学一起把盒子认回来。",
  "decision": "同一群体、两个句法位置；不能整组选一个包办答案。",
  "hint": "一个空在名词前说明归属，另一个空在 Give 后说明给谁。",
  "source": "Lesson 24 our 与 us 替换；用已学 boxes 构造认领交接",
  "type": "cloze",
  "reference": "盒子属于说话的这两位同学。",
  "blanks": [
    {
      "before": "Those are ",
      "after": " boxes.",
      "options": [
        "our",
        "us",
        "their"
      ]
    },
    {
      "before": "Give ",
      "after": " those boxes, please.",
      "options": [
        "us",
        "our",
        "them"
      ]
    }
  ],
  "answer": "[\"our\",\"us\"]",
  "distractorReasons": {
    "our": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "us": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "their": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "them": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。"
  },
  "distractorRationale": "our 作名词前的物主限定，us 作 Give 的接收者；互换会错用形式。their/them 指向说话人以外的群体，与给定归属不符。"
},
unit.questions["exam"][8],
{
  "id": "u2324-tasks-v4-exam-which-number",
  "target": "复数选择问句与归属问句区别",
  "prompt": "桌上有两组盘子。Jane 只说：Give me some plates.\n下一句怎样确认她要哪一组？",
  "decision": "替换重复 on the desk 抽查，补齐最终挑战中复数 Which ones 的独立判断。",
  "hint": "问要哪一组，既要看问什么，也要看物品是一件还是多件。",
  "source": "Lesson 23 Which ones?；复用 Lesson 24 plates 构造澄清需求",
  "options": [
    "Which ones?",
    "Which one?",
    "Whose plates?"
  ],
  "answer": "Which ones?",
  "distractorReasons": {
    "Which one?": "只问单数的一件，与 plates 不一致。",
    "Whose plates?": "问主人，没有确认选择哪组。"
  },
  "distractorRationale": "Which ones? 确认复数选择；Which one? 数量不符；Whose plates? 问主人。替换重复桌面位置题，新增实际澄清判断。"
}]};
 unit.taskPredecessors ||= {}; unit.taskSessions ||= {};
 for(const [id,items] of Object.entries(revised)){
  const priorKey='unit2324-'+id+'-practice/'+(unit.taskSessions[id]||(unit.taskPredecessors[id]?'v3':unit.activityPredecessors?.[id]?'v2':'v'+unit.version));
  const sources=[{key:priorKey,questions:unit.questions[id]},...(unit.taskPredecessors[id]||[]),...(unit.activityPredecessors?.[id]||[]).map(old=>({key:'unit2324-'+old+'-practice/v1',questions:unit.previousQuestions[old]}))];
  unit.taskPredecessors[id]=sources; unit.taskSessions[id]='tasks-v4'; unit.questions[id]=items;
 }
})(globalThis.CanranCore);
// Five-zone edition. Preserve the exact predecessor above for historical records.
(function(core){
'use strict';
const old=core.unit2324;core.unit2324LegacyDefinition=JSON.parse(JSON.stringify(old));
const source='课本纸46–49／PDF79–82；语法练习册纸60–66／PDF74–80';
const grammarSource='同步导学纸43–44／PDF57–58，Grammar纸44／PDF58；'+source;
const unit={id:'unit23-24',version:1,mode:'classroom',contentRevision:'glasses-five-zones-v1',legacyEdition:'unit23-24-completion-v1',title:'房间寻物队',path:'/unit23-24/',start:'learn/words',progress:old.progress,learning:{...old.learning},objects:old.objects,questions:{},
stages:[{id:'l1',title:'认识房间物品',activities:[['words','寻物小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},{id:'l2',title:'帮简找对杯子',activities:[['text','找杯子小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},{id:'l3',title:'看清物品位置',activities:[['grammar','语法小工坊','speech']],required:['grammar']},{id:'l4',title:'说清哪一些',activities:[['apply','寻物小帮手','heart']],required:['apply']},{id:'l5',title:'完成寻物委托',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}],
routeAliases:{'learn/phrases':'learn/grammar','learn/observe':'learn/apply','learn/be':'learn/grammar','learn/models':'learn/apply','learn/trans':'learn/apply'},
reward:{edition:'glasses-five-zones-v1',title:'细心寻物小达人',lesson:'Lesson 23–24',scene:'/assets/unit23-24/keepsake-story-v1.webp',alt:'男士双手托着刚接过的一组玻璃杯，简双手空着，两人相视微笑',color:'#34675B',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','寻物小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
const choice=(options,answer,material='')=>({options,answer,material});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers,material='')=>({type:'cloze',blanks,answer:JSON.stringify(answers),material});
const words=(tokens,slots,answer,material='')=>({type:'wordbank',language:'en',tokens,slots,answer,material});
const q=(id,target,prompt,input,explanation)=>{const{material,...fields}=input;return{id:'u2324-five-'+id,target,prompt,source,...fields,...(material?{display:{title:prompt,material}}:{}),explanation,hint:''};};
const g=(id,target,prompt,input,rule,demo)=>({...q('g-'+id,target,prompt,input,rule),source:grammarSource,workshop:{rule,...(demo?{model:{lines:demo}}:{})}});
unit.questions.listen=old.questions.listen;unit.questions.roles=old.questions.roles;
unit.questions.grammar=[
g('surface','理解on表示接触表面','几本书平放在桌面上，空格选什么？',choice(['on','in','under'],'on','The books are ___ the table.\nin：在里面；under：在下面。'),'书由桌面承托，用on。不是只要在图上画得较高就用on。',[['The glasses are on the shelf.','玻璃杯放在搁板表面上，杯底与搁板相接。']]),
g('wall','把on扩展到竖直表面','画挂在墙面上，补好句子。',fill([blank('The picture is ',' the wall.',['on','in','under'])],['on'],'picture：画；wall：墙。画贴靠着竖直墙面。'),'on也能表示在竖直表面上；不是只能用来描述桌面、地板。',[['The drawing is on the blackboard.','画画在黑板表面上。drawing：画；blackboard：黑板。']]),
g('which-place','用介词短语缩小选择范围','按位置说明要哪一组玻璃杯。',words(['The','ones','on','the shelf.','in'],4,'The ones on the shelf.','要的是架子表面上的那组玻璃杯。'),'The ones代替那组玻璃杯，on the shelf进一步说明位置。',[['Which books? The ones on the desk.','先指出要选的一组，再用位置帮助寻找。']]),
g('some','不把some限死在复数名词前','分别请求一些盘子和一些水。',fill([blank('Give me ',' plates, please.',['some','a']),blank('Give us ',' water, please.',['some','a'])],['some','some'],'water：水，不用复数词尾-s表示这里的一些水。'),'some可搭配可数名词复数，也可搭配不可数名词；它本身没有指定正好几个。',[['some glasses / some water','一些玻璃杯／一些水。两种说法都可以。']]),
g('one-ones','根据被替代物品数量选择one或ones','两份请求分别要一支笔和一些笔。',fill([blank('Which ','?',['one','ones']),blank('Which ','?',['one','ones'])],['one','ones'],'第一句：Give me a pen.\n第二句：Give me some pens.'),'one代替一件可数物品，ones代替多件。它们不是在读数字。',[['a glass → Which one?','一个玻璃杯，用one。'],['some glasses → Which ones?','多个玻璃杯，用ones。']]),
g('plural-sentence','整句变复数时同时改名词与be','把一本书改成几本书，补好完整句子。',fill([blank('The ',' on the shelf',['books','book']),blank(' ',' new.',['are','is'])],['books','are'],'原句：The book on the shelf is new.\nnew：新的。新句仍说架子上的书是新的。'),'book变books，is变are；位置短语on the shelf和形容词new不因书变多而加-s。',[['The box on the floor is big.','一个盒子用box和is。'],['The boxes on the floor are big.','多个盒子用boxes和are，big不变。']]),
g('receivers','按明确接收者选择宾格','第一份给Tim，第二份给两个孩子。',fill([blank('Give ',' this shirt.',['him','he','his']),blank('Give ',' these books.',['them','they','their'])],['him','them'],'Tim是男孩，接收衬衫；两个孩子接收书。'),'Give后说明接收者，Tim用him，两个孩子用them；不根据衣物或名字猜性别。',[['Jane is a woman. Give her this watch.','Jane是女士；把表给她，用her。']]),
...old.questions.be
];
unit.questions.apply=[...old.questions.observe,...old.questions.trans,
q('a-meaning','同时理解否定和位置限定','用中文词块说出这份要求。',{type:'wordbank',language:'zh-CN',reading:'No, not those. The ones on the shelf.',tokens:['不，','不是那些。','架子上的那些。','就是那些。','桌子里的那些。'],slots:3,answer:'不， 不是那些。 架子上的那些。'},'先否定刚指的那组，再明确要架子上的那组。')];
unit.questions.exam=[...old.questions.exam];
// Replace the repeated desk image task with a new vertical-surface transfer.
unit.questions.exam[5]=q('e-blackboard','独立把on用于新的竖直表面','黑板上画着两颗星，补好句子。',fill([blank('The stars are ',' the blackboard.',['on','in','under'])],['on'],'stars：星星；blackboard：黑板。星星画在黑板表面上。'),'画在黑板表面上也用on，不仅水平承托表面才用on。');
unit.questions.exam.push(
q('e-plural','独立把带位置的整句变为复数','改成几只盒子，保持位置和大小不变。',fill([blank('The ',' on the floor',['boxes','box']),blank(' ',' small.',['are','is'])],['boxes','are'],'原句：The box on the floor is small.'),'复数boxes配are，on the floor和small保持不变。'),
q('e-one-ones','独立按名词数量替换','两份请求分别是一本杂志和一些报纸。',fill([blank('The new ','.',['one','ones']),blank('The new ','.',['one','ones'])],['one','ones'],'第一份：a magazine。第二份：some newspapers。两份都要新的。'),'一本杂志用one，一些报纸用ones。'),
q('e-water','some既不指定数目也不限于可数名词','Give us some water, please. 这句话的意思是什么？',choice(['请给我们一些水。','请给我们正好两杯水。','句子错了，some后只能用复数名词。'],'请给我们一些水。','water：水。'),'some water表示一些水，没有指定杯数；some也可用于不可数名词。'),
q('e-clarify','发现位置条件还不足以唯一确定一组','架子上并排放着两组玻璃杯，桌上也有一组。',choice(['继续确认架子上的哪一组。','取架子上任意一组。','取桌上的那一组。'],'继续确认架子上的哪一组。','对方说：The ones on the shelf.\n你需要选出对方要的那一组。'),'位置已经排除了桌上的一组，但架子上还有两组，需要继续确认，不能替对方随意决定。'),
q('e-negation','不从否定某位置自动推断另一个位置','只听见 No, not those on the table. 能确定要哪组吗？',choice(['还不能，要继续询问。','一定是架子上的。','一定是地板上的。'],'还不能，要继续询问。','房间里有桌上、架子上和地板上的三组盒子。\n这句话只说不要桌上的那组。'),'否定桌上这一组不等于肯定架子上的一组；还可能要其他位置的盒子。')
);
unit.taskSessions=Object.fromEntries(unit.reward.zones.map(z=>[z.id,'five-zones-v1']));
const previous={listen:['listen'],roles:['roles'],grammar:['be'],apply:['observe','trans'],exam:['exam']};
unit.taskPredecessors=Object.fromEntries(Object.entries(previous).map(([id,priorIds])=>[id,priorIds.flatMap(prior=>[{key:'unit2324-'+prior+'-practice/'+(old.taskSessions?.[prior]||(old.taskPredecessors?.[prior]?'v3':old.activityPredecessors?.[prior]?'v2':'v'+old.version)),questions:old.questions[prior]},...(old.taskPredecessors?.[prior]||[])])]));
core.unit2324=unit;if(globalThis.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis.CanranCore);

