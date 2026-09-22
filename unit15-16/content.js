(function (root) {
  'use strict';
  const image = name => '/assets/unit15-16/' + name + '.svg';
  const source = '《新概念英语智慧版1》纸页30–33（PDF63–66）';
  const WORDS = [
    ['customs','本课：海关','/ˈkʌstəmz/','customs officer'],
    ['officer','官员','/ˈɑːfɪsɚ/','customs officer'],
    ['girl','女孩；姑娘','/ɡɝːl/'],
    ['Danish','丹麦的；丹麦人的','/ˈdeɪnɪʃ/'],
    ['friend','朋友','/frend/'],
    ['Norwegian','挪威的；挪威人的','/nɔːrˈwiːdʒən/'],
    ['passport','护照','/ˈpæspɔːrt/'],
    ['brown','棕色的','/braʊn/'],
    ['tourist','旅游者','/ˈtʊrɪst/'],
    ['Russian','俄罗斯的；俄罗斯人的','/ˈrʌʃən/'],
    ['Dutch','荷兰的；荷兰人的','/dʌtʃ/'],
    ['these','这些','/ðiːz/','these cases'],
    ['red','红色的','/red/'],['grey','灰色的','/ɡreɪ/'],['yellow','黄色的','/ˈjeloʊ/'],
    ['black','黑色的','/blæk/'],['orange','本课：橙色的','/ˈɔːrɪndʒ/','orange ties'],
    ['customs officer','海关官员','/ˈkʌstəmz ˌɑːfɪsɚ/'],
    ['we','我们（说话的人和同伴）','/wiː/','We are tourists.'],
    ['our','我们的','/ˈaʊər/','Our cases are brown.'],
    ['they','他们／她们／它们；看语境','/ðeɪ/','Here they are.'],
    ['Swedish','瑞典的；瑞典人的','/ˈswiːdɪʃ/'],
    ['English','英国的；英格兰的','/ˈɪŋɡlɪʃ/'],
    ['American','美国的；美国人的','/əˈmerɪkən/'],
    ['case','本课：箱子','/keɪs/']
  ].map(([en,cn,ph,example=''])=>({en,cn,ph,example,image:image(en==='customs officer'?'officer':en.toLowerCase()),source}));
  const PEOPLE = {officer:{name:'海关官员',image:image('officer')},girls:{name:'姑娘们',image:image('girls')}};
  const DIALOGUE = [
    ['officer','Are you Swedish?','你们是瑞典人吗？'],
    ['girls','No, we are not.','不，我们不是。'],
    ['girls','We are Danish.','我们是丹麦人。'],
    ['officer','Are your friends Danish, too?','你们的朋友也是丹麦人吗？'],
    ['girls',"No, they aren't.",'不，他们不是。'],
    ['girls','They are Norwegian.','他们是挪威人。'],
    ['officer','Your passports, please.','请出示你们的护照。'],
    ['girls','Here they are.','给您。'],
    ['officer','Are these your cases?','这些是你们的箱子吗？'],
    ['girls',"No, they aren't.",'不，它们不是。'],
    ['girls','Our cases are brown.','我们的箱子是棕色的。'],
    ['girls','Here they are.','在这儿呢。'],
    ['officer','Are you tourists?','你们是来旅游的吗？'],
    ['girls','Yes, we are.','是的，我们是。'],
    ['officer','Are your friends tourists, too?','你们的朋友也是来旅游的吗？'],
    ['girls','Yes, they are.','是的，他们是。'],
    ['officer',"That's fine.",'好了。'],
    ['girls','Thank you very much.','非常感谢。']
  ].map(([person,text,cn],i)=>({id:'L15-D'+String(i+1).padStart(2,'0'),person,who:person==='officer'?'teacher':'student',text,cn,source:source+'；Lesson15原文'}));
  const PHRASES = [
    {en:'Are you tourists? → Yes, we are.',cn:'问“你们”，回答的人说“我们”。',image:image('we')},
    {en:'Are your friends tourists? → Yes, they are.',cn:'说朋友们时，用 they。',image:image('friend')},
    {en:'Our cases are brown.',cn:'our 后面接物品：我们的箱子。',image:image('our')},
    {en:'Are these your cases? → Yes, they are.',cn:'这是新的肯定回答示例；这里 they 指这些箱子。',image:image('these')}
  ];
  const GALLERY = [
    ['books','red'],['shirts','white'],['coats','grey'],['tickets','yellow'],['suits','blue'],
    ['hats','black and grey'],['passports','green'],['umbrellas','black'],['handbags','white'],
    ['ties','orange'],['dogs','brown and white'],['pens','blue'],['cars','red'],['dresses','green'],['blouses','yellow']
  ].map(([object,colour])=>({object,colour,en:object+' · '+colour,cn:'',image:image(object),source:source+'；Lesson16图示'}));
  const MODELS=GALLERY.slice(1,13).map(item=>({...item,en:'What colour are your '+item.object+'? Our '+item.object+' are '+item.colour+'.',source:source+'；Lesson16 Written B'}));
  const MODEL_EXAMPLE={en:'What colour are your books? Our books are red.',cn:'问多本书的颜色，用 are。',image:image('books')};
  const NATIONALITIES = ['Russian','English','American','Dutch'].map(name=>({en:'Are you '+name+'? → Yes, we are.',cn:'虚构国籍卡：我们是'+{Russian:'俄罗斯人',English:'英格兰人',American:'美国人',Dutch:'荷兰人'}[name],image:image(name.toLowerCase()),source:source+'；Lesson16国籍图；补充明确身份卡'}));
  const REFERENCE = [
    ['It is ___ English car.','an','English car'],['It is ___ Japanese car.','a','Japanese car'],
    ['It is ___ Italian car.','an','Italian car'],['It is ___ French car.','a','French car'],
    ['It is ___ American car.','an','American car'],['Robert is not ___ teacher.','a','teacher']
  ].map(([prompt,answer,example])=>({prompt,answer,example,en:prompt.replace('___',answer),source:source+'；Lesson16 Written A'}));
  const q = (id,target,prompt,options,answer,explanation,hint,basis,decision,extra={}) => ({
    id:'u1516-v1-'+id,target,prompt,options:options?.map(option=>option[0]),answer,explanation,hint,
    source:source+'；'+basis,decision,distractorReasons:options?Object.fromEntries(options.filter(option=>option[0]!==answer)):undefined,...extra
  });
  const vocabulary = [
    ['meaning','customs','海关',['海关','风俗','朋友','护照'],'customs officer\n这里的 customs 表示什么？'],
    ['meaning','officer','官员',['官员','旅客','朋友','教师'],'customs officer\nofficer 表示什么？'],
    ['meaning','girl','女孩；姑娘',['女孩；姑娘','男孩','朋友','官员']],
    ['meaning','Danish','丹麦的；丹麦人的',['丹麦的；丹麦人的','瑞典的；瑞典人的','挪威的；挪威人的','荷兰的；荷兰人的']],
    ['english','friend','朋友',['friend','girl','officer','tourist']],
    ['meaning','Norwegian','挪威的；挪威人的',['挪威的；挪威人的','丹麦的；丹麦人的','俄罗斯的；俄罗斯人的','荷兰的；荷兰人的']],
    ['picture','passport','护照',['passport','book','ticket','case'],'看图，选出物品。','一本绿色封面、带有地球图案的小册子'],
    ['meaning','tourist','旅游者',['旅游者','官员','女孩；姑娘','朋友']],
    ['meaning','Russian','俄罗斯的；俄罗斯人的',['俄罗斯的；俄罗斯人的','美国的；美国人的','瑞典的；瑞典人的','丹麦的；丹麦人的']],
    ['meaning','Dutch','荷兰的；荷兰人的',['荷兰的；荷兰人的','丹麦的；丹麦人的','挪威的；挪威人的','英格兰的；英格兰人的']],
    ['meaning','these','这些',['这些','这个','我们的','他们'],'Are these your cases?\n这里的 these 表示什么？']
  ];
  const questions = {
    listen:vocabulary.map(([kind,en,meaning,options,customPrompt,imageAlt])=>{
      const answer=kind==='meaning'?meaning:en;
      const prompt=customPrompt||(kind==='meaning'?en+'\n选出这个词的意思。':meaning+'\n选出对应的英文。');
      return q('vocab-'+en,kind==='meaning'?'理解词义 '+en:kind==='picture'?'看图认词 '+en:'选择英文 '+en,prompt,
        options.map(value=>[value,value===answer?'':'本课 '+en+' 表示“'+meaning+'”，此项与语境不符。']),answer,
        en+' 在这里表示“'+meaning+'”。','','Lesson15–16词表','新词各一次；颜色回顾在复数描述中进行',
        {presentation:'vocabulary',...(kind==='picture'?{image:image(en),imageAlt}:{})});
    }),
    roles:[
      q('story-friends','从课文分清姑娘们与朋友的国籍','课文里，姑娘们的朋友是哪国人？',[
        ['Norwegian',''],['Danish','Danish 是姑娘们的国籍，不是她们朋友的。'],['Swedish','姑娘们否认了瑞典人的猜测。']
      ],'Norwegian','朋友是 Norwegian；姑娘们是 Danish。','回看官员提到 friends 后的两句回答。','L15-D04–D06','跨句核对人物，区别单词翻译'),
      q('story-they','联系上下文确定 they 所指的物品','官员说 Your passports, please.\n姑娘们回答 Here they are.\n这里的 they 指什么？',[
        ['护照',''],['姑娘们','这里是在递交官员索要的物品。'],['朋友们','上一句索要的是护照，没有索要朋友。']
      ],'护照','这里 they 指复数的 passports，不是人物。','先看上一句官员要的是什么。','L15-D07–D08','认识 they 也可以指物品'),
      q('story-finish','从原文确认故事的结局','最后，哪句话表明官员检查后说“可以了”？',[
        ["That's fine.",''],['Are you Swedish?','这是询问国籍。'],['Your passports, please.','这是索要护照，还没有表示检查结束。']
      ],"That's fine.",'官员最后说 That’s fine.，表示可以了。','回到故事结尾，看看官员最后说了什么。','Lesson15读前问题；D17','从故事结尾找出检查结果')
    ],
    reply:[
      q('reply-we','从回答者视角选择第一人称复数','官员问两位姑娘：Are you tourists?\n姑娘们一起肯定回答：',[
        ['Yes, we are.',''],['Yes, they are.','问的是姑娘们本人，回答时说我们。'],['Yes, I am.','两位姑娘一起回答，I 只指我一个人。']
      ],'Yes, we are.','姑娘们回答自己两人，用 we。','想想回答的人说的是“我们”，还是另外一些人。','Lesson15 D13–D14','改变问答视角，而不只识别人称词'),
      q('reply-negative','按新情境做第三人称复数否定回答','新情境：两位朋友都不是游客。\n官员问姑娘们：Are your friends tourists?\n姑娘们怎么回答？',[
        ["No, they aren't.",''],["No, we aren't.",'问的是朋友，不是回答的人。'],['Yes, they are.','新情境说明朋友不是游客，应否定回答。']
      ],"No, they aren't.",'说朋友们用 they；他们不是游客，所以用 No, they aren’t.。','分别核对问的是谁，以及事实是“是”还是“不是”。','Lesson15 friends问答；明确新情境','从肯定本人变成否定他人，避免同构换名'),
      q('reply-our','把物主词放到所属物品前','姑娘们介绍她们自己的箱子。\n___ cases are brown.',[
        ['Our',''],['Your','Your 表示你们的，不是我们自己的。'],['We','We 是主语“我们”，不能直接接 cases 表示所属。']
      ],'Our','Our cases 表示我们的箱子。','这里说的是“谁的箱子”，需要表示所属的词。','Lesson15 D11','从主语转换到所属关系')
    ],
    forms:[
      q('plural-friends','给普通规则名词加 s','一位朋友：a friend\n多位朋友的标签应该写：',[
        ['friends',''],['friend','friend 是单数。'],['friendes','friend 的规则复数直接加 s。']
      ],'friends','friend 的复数是 friends。','这里不止一位朋友，留意名词的结尾。','Lesson15 friends；Lesson16复数注释','普通规则复数一次'),
      q('plural-dresses','给 s 结尾的规则名词加 es','图中有两条连衣裙。\n给它们选一个英文标签。',[
        ['dresses',''],['dress','dress 是单数。'],['dresss','dress 以 s 结尾，复数加 es。']
      ],'dresses','dress → dresses，以 s 结尾时加 es。','看看这个词原本的结尾，再想怎样表示多件。','Lesson16图14及复数注释','加入 s 结尾这一新条件',{image:image('dresses'),imageAlt:'两条绿色连衣裙'}),
      q('article-english','按后接词的发音选择 a 或 an','用 a 或 an 填空：\nIt is ___ English car.',[
        ['an',''],['a','紧跟空格的是 English，开头是元音音素。']
      ],'an','English 以元音音素开头，用 an English car。','关注紧接空格的词开头的音，不是后面的 car。','Lesson16 Written A1','只抽样一题；余下完整材料留课堂')
    ],
    trans:[
      q('build-cases','组织复数物品确认问句','问对方：“这些是你们的箱子吗？”',undefined,'Are these your cases?','Are these your cases? 确认这些箱子的主人。','问句先提出疑问，再说这些物品。','Lesson15 D09；Lesson16标题','主动组织复数问句',{type:'order',tokens:['Are','these','your','cases?']}),
      q('build-colour','组织复数物品的颜色问句','问对方：“你们的护照是什么颜色的？”',undefined,'What colour are your passports?','多本护照用 passports，问颜色用 What colour are。','先问颜色，再说谁的什么物品。','Lesson16 Written B6','从确认归属转向询问颜色',{type:'order',tokens:['What','colour','are','your','passports?']}),
      q('build-hats','同时说明物主、复数和两种颜色','介绍：“我们的帽子是黑灰相间的。”',undefined,'Our hats are black and grey.','Our hats 表示我们的帽子；black and grey 描述两种颜色。','先介绍物品，再把两种颜色连起来。','Lesson16 Written B5','组织回答并合并两种颜色',{type:'order',tokens:['Our','hats','are','black','and','grey.']})
    ],
    exam:[
      q('exam-card','从新资料同时核对国籍和身份','读一张新的出行卡：\nOur friends are Russian. They are tourists.\n哪条记录与卡片一致？',[
        ['朋友：Russian；身份：tourists',''],['朋友：Norwegian；身份：tourists','新卡是 Russian，不能照搬原文朋友的国籍。'],['朋友：Russian；身份：officers','新卡说 tourists，不是 officers。']
      ],'朋友：Russian；身份：tourists','两句一起读：朋友是俄罗斯人，身份是游客。','把记录中的国籍和身份分别与卡片核对。','Lesson16 Russian与Lesson15 tourists；新资料','整合两条信息，改变原文人物事实'),
      q('exam-passports','在复数回答中分清人物与物品','两本护照都是这两位姑娘的。\n官员问：Are these your passports?\n姑娘们怎么肯定回答？',[
        ['Yes, they are.',''],['Yes, we are.','问题确认的是护照，不是人物身份。'],['Yes, it is.','两本护照是复数，不能用单数 it is。']
      ],'Yes, they are.','两本护照用 they；肯定简短回答为 Yes, they are.。','先看问题在确认人，还是物品，以及有几件。','Lesson16 Are these your …?；新情境','与前面的 Are you tourists? 对比，不能见到两人就用 we')
    ]
  };
  const stages = [
    {id:'l1',title:'结伴出发',activities:[['words','出行小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
    {id:'l2',title:'护照小故事',activities:[['text','海关小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
    {id:'l3',title:'把我们说清楚',activities:[['phrases','结伴小锦囊','speech'],['reply','我们来回答','question']],required:['reply']},
    {id:'l4',title:'行李成双',activities:[['models','出行小画册','cards'],['forms','单词变一变','cards'],['trans','词块拼装台','order']],required:['forms','trans']},
    {id:'l5',title:'顺利出发',activities:[['exam','出行小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
  ];
  const definition = {id:'unit15-16',version:1,title:'护照小检查站',path:'/unit15-16/',start:'learn/words',
    progress:{learningKey:'canran:unit15-16:learning:v1'},objects:WORDS,stages,questions,
    learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,MODELS,MODEL_EXAMPLE,NATIONALITIES,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requirePublishedCourse('lesson49').learning.FEEDBACK}};
  root.CanranCore.unit1516=definition;
  if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
