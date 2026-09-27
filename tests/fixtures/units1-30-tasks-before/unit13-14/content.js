(function (root) {
  'use strict';
  const image = name => '/assets/unit13-14/' + name + '.svg';
  const source = '《新概念英语智慧版1》纸页26–29（PDF59–62）';
  const WORDS = [
    ['colour','颜色','/ˈkʌlɚ/'], ['green','绿色的','/ɡriːn/'], ['come','来','/kʌm/'],
    ['upstairs','往楼上；在楼上','/ʌpˈsterz/'], ['smart','本课：漂亮的；时髦的','/smɑːrt/',"It's very smart."],
    ['hat','帽子','/hæt/'], ['same','相同的','/seɪm/','the same colour'],
    ['lovely','本课：可爱的；漂亮的','/ˈlʌvli/','a lovely hat'], ['case','本课：箱子','/keɪs/'],
    ['carpet','地毯','/ˈkɑːrpət/'], ['dog','狗','/dɑːɡ/'], ['black','黑色的','/blæk/'],
    ['grey','灰色的','/ɡreɪ/'], ['brown','棕色的','/braʊn/'], ['red','红色的','/red/'],
    ['yellow','黄色的','/ˈjeloʊ/'], ['orange','本课：橙色的','/ˈɔːrɪndʒ/','an orange tie'],
    ['blue','蓝色的','/bluː/'], ['white','白色的','/waɪt/'],
    ['dress','连衣裙','/dres/'], ['new','新的','/nuː/']
  ].map(([en,cn,ph,example='']) => ({ en,cn,ph,example,image:image(en),source }));
  const PEOPLE = { louise:{name:'Louise',image:image('louise')}, anna:{name:'Anna',image:image('anna')} };
  const DIALOGUE = [
    ['louise',"What colour's your new dress?",'你的新连衣裙是什么颜色的？'],
    ['anna',"It's green.",'是绿色的。'],
    ['anna','Come upstairs and see it.','到楼上来看看它吧。'],
    ['louise','Thank you.','谢谢你。'],
    ['anna','Look!','看！'],
    ['anna','Here it is!','就是这件！'],
    ['louise',"That's a nice dress.",'那是一件很好看的连衣裙。'],
    ['louise',"It's very smart.",'它很漂亮，很时髦。'],
    ['anna',"My hat's new, too.",'我的帽子也是新的。'],
    ['louise','What colour is it?','它是什么颜色的？'],
    ['anna',"It's the same colour.",'是相同的颜色。'],
    ['anna',"It's green, too.",'也是绿色的。'],
    ['louise','That is a lovely hat!','那真是一顶可爱的帽子！']
  ].map(([person,text,cn],i) => ({id:'L13-D'+String(i+1).padStart(2,'0'),person,who:person==='louise'?'teacher':'student',text,cn,source:source+'；Lesson13原文'}));
  const PHRASES = [
    {en:"What colour's your new dress?",cn:'问对方新连衣裙的颜色',image:image('dress')},
    {en:"It's the same colour.",cn:'颜色相同，要联系前面说的颜色',image:image('same')},
    {en:'Come upstairs and see it.',cn:'邀请对方到楼上来看看',image:image('upstairs')},
    {en:'That is a lovely hat!',cn:'夸赞那顶帽子很可爱、很漂亮',image:image('lovely')}
  ];
  const GALLERY = [
    ['umbrella','black','umbrella-black'],['car','blue','car-blue'],['shirt','white','shirt-white'],
    ['coat','grey','coat-grey'],['case','brown','case'],['carpet','red','carpet'],
    ['blouse','yellow','blouse-yellow'],['tie','orange','tie-orange'],['hat','grey and black','hat-grey-black'],['dog','brown and white','dog']
  ].map(([object,colour,file])=>({en:object+' · '+colour,cn:'',image:image(file),source:source+'；Lesson14图示'}));
  const MODEL_SEEDS = [
    ['Steven','car','blue','his','car-blue'],['Tim','shirt','white','his','shirt-white'],['Sophie','coat','grey','her','coat-grey'],
    ['Mrs. White','carpet','red','her','carpet'],['Dave','tie','orange','his','tie-orange'],['Steven','hat','grey and black','his','hat-grey-black'],
    ['Helen','dog','brown and white','her','dog'],['Hans','pen','green','his','pen-green'],['Luming','suit','grey','his','suit-grey'],
    ['Stella','pencil','blue','her','pencil-blue'],['Xiaohui','handbag','brown','her','handbag-brown'],['Sophie','skirt','yellow','her','skirt-yellow']
  ];
  const MODELS=MODEL_SEEDS.map(([owner,object,colour,possessive,file])=>({owner,object,colour,possessive,
    en:"What colour's "+owner+"'s "+object+'? '+(possessive==='his'?'His':'Her')+' '+object+"'s "+colour+'.',
    cn:'物主卡：'+owner+'（'+(possessive==='his'?'he':'she')+'）',image:image(file),source:source+'；Lesson14 Written B；补充明确物主卡'
  }));
  const MODEL_EXAMPLE={en:"What colour's Steven's umbrella? His umbrella's black.",cn:'物主卡：Steven（he）',image:image('umbrella-black')};
  const REFERENCE=[
    ['Paul','his','car','car-blue'],['Sophie','her','coat','coat-grey'],['Helen','her','dog','dog'],
    ['my father','his','suit','suit-grey'],['my daughter','her','dress','dress']
  ].map(([owner,possessive,object,file])=>({en:'This is '+owner+"'s "+object+'.',cn:'This is '+owner+'. This is '+possessive+' '+object+'.',image:image(file),source:source+'；Lesson14 Written A'}));
  const q = (id,target,prompt,options,answer,explanation,hint,basis,decision,extra={}) => ({
    id:'u1314-v1-'+id,target,prompt,options:options?.map(option=>option[0]),answer,explanation,hint,
    source:source+'；'+basis,decision,distractorReasons:options?Object.fromEntries(options.filter(option=>option[0]!==answer)):undefined,...extra
  });
  const vocabulary = [
    ['meaning','colour','颜色',['颜色','姓名','职业','国籍']],
    ['picture','green','绿色的',['green','blue','white','black'],'看图，选出颜色。','一块绿色布料'],
    ['meaning','come','来',['来','看','谢谢','相同的'],'Come upstairs and see it.\ncome 表示什么？'],
    ['english','upstairs','往楼上',['upstairs','come','same','lovely']],
    ['meaning','smart','漂亮的；时髦的',['漂亮的；时髦的','聪明的','旧的','脏的'],"That's a nice dress. It's very smart.\n这里的 smart 是在怎样夸连衣裙？"],
    ['picture','hat','帽子',['hat','dress','case','carpet'],'看图，选出物品。','一顶有蝴蝶结的帽子'],
    ['meaning','same','相同的',['相同的','新的','可爱的','绿色的'],'the same colour\nsame 表示什么？'],
    ['meaning','lovely','可爱的；漂亮的',['可爱的；漂亮的','新的','相同的','白色的'],'a lovely hat\nlovely 是怎样夸这顶帽子的？'],
    ['picture','case','箱子',['case','dog','hat','carpet'],'看图，选出物品。','一个有提手和搭扣的箱子'],
    ['english','carpet','地毯',['carpet','case','dog','dress']],
    ['picture','dog','狗',['dog','hat','case','dress'],'看图，选出对应的英文。','一只有耳朵、尾巴和四条腿的小狗'],
    ['meaning','black','黑色的',['黑色的','白色的','灰色的','棕色的']],
    ['picture','grey','灰色的',['grey','brown','red','orange'],'看图，选出颜色。','一块灰色布料'],
    ['english','brown','棕色的',['brown','grey','green','orange']],
    ['meaning','red','红色的',['红色的','绿色的','蓝色的','黄色的']],
    ['picture','yellow','黄色的',['yellow','orange','white','brown'],'看图，选出颜色。','一块黄色布料'],
    ['meaning','orange','橙色的',['橙色的','橙子','黄色的','白色的'],'an orange tie\n这里的 orange 表示什么？']
  ];
  const questions = {
    listen:vocabulary.map(([kind,en,meaning,options,customPrompt,imageAlt])=>{
      const answer=kind==='meaning'?meaning:en;
      const prompt=customPrompt||(kind==='meaning'?en+'\n选出这个词的意思。':meaning+'\n选出对应的英文。');
      const choices=options.map(value=>[value,value===answer?'':kind==='meaning'?'这里的 '+en+' 表示“'+meaning+'”，不是“'+value+'”。':value+' 表示'+WORDS.find(word=>word.en===value).cn+'；这里要选 '+en+'（'+meaning+'）。']);
      return q('vocab-'+en,kind==='meaning'?'理解词义 '+en:kind==='picture'?'看图认词 '+en:'选择英文 '+en,prompt,choices,answer,en+' 在这里表示“'+meaning+'”。','','Lesson13–14 新词与颜色词','每个新词一次，换语境而不反向整组重考；颜色用实色图核对',{
        presentation:'vocabulary',...(kind==='picture'?{image:image(en),imageAlt}:{})
      });
    }),
    roles:[
      q('story-hat','从课文找到帽子的颜色','课文里，Anna 的帽子是什么颜色？',[
        ['green',''],['blue','Anna 没有说帽子是蓝色的。'],['white','Anna 没有说帽子是白色的。']
      ],'green',"Anna 说 It's the same colour.，接着说 It's green, too.，帽子和连衣裙一样是绿色的。",'回顾 Anna 回答帽子颜色的两句话。','Lesson13读前问题；D09–D12','从连续原文提取物品信息',{optionImages:{green:image('green'),blue:image('blue'),white:image('white')}}),
      q('story-too','理解 too 在本句承接的内容',"My hat's new, too.\n这句话说帽子和连衣裙哪一点一样？",[
        ['都是新的',''],['都是旧的','new 表示新的，不是旧的。'],['都是白色的','这句话在说新旧，new 不是颜色。']
      ],'都是新的','new 表示新的；这里 too 表示帽子也是新的。帽子的颜色要看后面的句子。','看 too 前面在说哪一个特点。','L13-D01、D09','从具体颜色转到话语承接，不把 too 直接等同为也绿')
    ],
    colours:[
      q('ask-colour','按想知道的信息询问颜色','你已经知道帽子是 Anna 的。\n现在只想知道颜色，直接问 Anna：',[
        ["What colour's your hat?",''],['Whose hat is that?','Whose 问的是谁的；你已经知道主人是 Anna。'],['Is this your hat?','这句话确认归属，没有问帽子的颜色。']
      ],"What colour's your hat?",'What colour 问颜色；直接问 Anna 的帽子，用 your hat。另两句语法也正确，但问的不是颜色。','想知道“什么颜色”，还是“谁的”？','Lesson13–14标题问句；Lesson11–12对照','区分信息需求，不将语法正确的其他问句判成病句'),
      q('read-two','理解一个物品的两种颜色',"Her dog's brown and white.\n这句话描述的是：",[
        ['一只棕白相间的狗',''],['两只不同颜色的狗','dog 是单数；brown and white 描述同一只狗。'],['棕狗旁边有白帽子','white 和 brown 一起描述狗，句子没有提帽子。']
      ],'一只棕白相间的狗',"Her dog's = Her dog is。brown and white 是同一只狗的两种颜色，不是两只狗。",'先找句子说的物品，再看 and 连着哪两个词。','Lesson14图10、Written B7','分清并列颜色与物品数量')
    ],
    trans:[
      q('build-merge','将人物和所属物品合成一句','This is Helen. This is her dog.\n把两句合成一句，说清这是 Helen 的狗。',undefined,"This is Helen's dog.","Helen's 表示 Helen 的；This is Helen's dog. 就是“这是 Helen 的狗”。",'把物主放在 dog 前面。','Lesson14 Written A3','首次组织合句；保留物主关系',{type:'order',tokens:['This','is',"Helen's",'dog.']}),
      q('build-question','询问指定人物物品的颜色',"问 Steven 的帽子是什么颜色。\n用 What colour's 开头。",undefined,"What colour's Steven's hat?","What colour's = What colour is；Steven's 表示 Steven 的。",'先问颜色，再说谁的什么物品。','Lesson14 Written B6','主动组织第三人物品的颜色问句',{type:'order',tokens:['What',"colour's","Steven's",'hat?']}),
      q('build-description','用物主词描述物品的颜色',"物主：Sophie（she）\n物品：coat · grey\n用 Her 和 coat's 写一句介绍。",undefined,"Her coat's grey.","Sophie 的人物卡用 she，所以用 Her；coat's = coat is。这句说她的外套是灰色的。",'先说“她的外套”，再说颜色。','Lesson14 Written B3；补充明确人物卡','将物主、物品与颜色组织为回答',{type:'order',tokens:['Her',"coat's",'grey.']})
    ],
    exam:[
      q('exam-same','把相同颜色的关系用于新场景','My case is yellow. My hat is the same colour.\n选出对应的配色记录。',[
        ['case · yellow / hat · yellow',''],['case · yellow / hat · orange','same colour 表示颜色相同，帽子不能换成橙色。'],['case · orange / hat · yellow','第一句明确箱子是 yellow，不是 orange。']
      ],'case · yellow / hat · yellow','先说箱子是黄色，再说帽子颜色相同，所以两件物品都是黄色的。same 不是固定指绿色。','先找箱子的颜色，再想“相同”指什么。','Lesson13 same colour与新情境','改变所指颜色，检查关系而非背绿色答案'),
      q('exam-owner','同时核对物主和实际颜色','物主：Mrs. White（she）\n物品：carpet · red\n哪张说明卡写对了？',[
        ["Her carpet's red.",''],["His carpet's red.",'物主卡用 she，所以要用 Her，不是 His。'],["Her carpet's white.",'White 是主人的姓，物品卡上地毯的颜色是 red。']
      ],"Her carpet's red.",'Mrs. White 的人物卡用 she，所以用 Her。地毯是红色的；White 是姓氏，不能用它猜物品颜色。','分别核对物主卡和物品卡。','Lesson14 Written B4；补充明确人物卡','加入颜色姓氏干扰，整合物主与描述')
    ]
  };
  const previousQuestions = { exam: questions.exam.slice() };
  const activityPredecessors = { exam: ['exam'] };
  questions.exam.push(
    q('invite-upstairs','读懂邀请去哪里看新裙子',"Anna: Come upstairs and see it.\nLouise 要去哪里看新连衣裙？",[
      ['到楼上看连衣裙',''],['到楼下看连衣裙','upstairs 是往楼上，不是往楼下。'],['留在原地等裙子送来','Anna 邀请 Louise 过去看，不是让她在原地等。']
    ],'到楼上看连衣裙','Come upstairs and see it. 邀请对方到楼上看它；这里 it 指新连衣裙。','留意 upstairs 指向哪里。','Lesson13 D03','从英文邀请决定行动，与单词辨义隔开复习'),
    q('new-too','根据 too 前面的特点判断相同处',"My dress is new. My hat's new, too.\n两件物品哪一点相同？",[
      ['都是新的',''],['都是绿色的','这里只说明 new，没有说明颜色。'],['大小相同','句子没有提到大小。']
    ],'都是新的','这两句说连衣裙是新的，帽子也是新的；too 在这里承接 new，不能推出颜色或大小。','看 too 前面说的是新旧、颜色，还是大小。','Lesson13 D01、D09；另设简短阅读','明确复习 too 的承接；不因两物同场就推断同色'),
    q('ask-direct','组织直接向对方询问颜色的完整问句','直接问对方：你的连衣裙是什么颜色？\n用完整的 is。',undefined,'What colour is your dress?','What colour is 问颜色；当面问对方的连衣裙，用 your dress。','先问颜色，再说对方的什么物品。','Lesson13 D01、Notes1；Lesson14标题','从前置第三人物主缩写问句转为直接提问的完整形式；只检验组织',{type:'order',tokens:['What','colour','is','your','dress?']}),
    q('two-colours','同时核对物主和一件物品的两种颜色','物主：Steven（he）\n看这顶帽子，选出完整的说明。',[
      ["His hat's grey and black.",''],["Her hat's grey and black.",'Steven 的人物卡用 he，应当用 His。'],["His hat's grey.",'帽子有灰色和黑色；只写 grey 没有说全。']
    ],"His hat's grey and black.",'一顶帽子有灰色和黑色；Steven 的人物卡用 he，所以用 His。','分别核对物主和帽子上的颜色。','Lesson14图9、Written B6；明确人物卡','看图选择双色描述，与阅读判断两只狗的干扰区别'),
    q('expand-is','分清所有格和 is 的缩写',"Steven's umbrella's black.\n展开 is，哪句意思不变？",[
      ["Steven's umbrella is black.",''],["Steven is umbrella's black.",'Steven’s 在这里表示 Steven 的，不能展开成 Steven is。'],["Steven's umbrella black.",'颜色前需要 is，不能把它漏掉。']
    ],"Steven's umbrella is black.",'Steven’s 表示 Steven 的；umbrella’s 在这里是 umbrella is。','找“谁的”，再找“是什么颜色”。','Lesson14 Written B例句；Lesson13 Notes1','独立区分两个 ’s 的功能；示范出现不等于检验'),
    q('family-merge','把亲属物主和物品合成一句','This is my father. This is his suit.\n把两句合成一句。',undefined,"This is my father's suit.","my father’s suit 表示我父亲的西服；my 要保留在 father’s 前面。",'说清是“我的父亲”的西服。','Lesson14 Written A4','从人名所有格迁移到含 my 的亲属短语；保留 A 独立作答',{type:'order',tokens:['This','is','my',"father's",'suit.']}),
    q('ask-third','向第三人询问已知物主的物品颜色','外套是 Sophie 的。\n你向 Louise 打听这件外套的颜色，应该怎么问？',[
      ["What colour's Sophie's coat?",''],["What colour's your coat?",'当面对 Louise 说 your coat，问成了 Louise 的外套。'],['Whose coat is that?','这句话问主人是谁；题目已给出主人是 Sophie，现在要问颜色。']
    ],"What colour's Sophie's coat?",'用 Sophie’s coat 指明 Sophie 的外套，再用 What colour’s 问颜色。','现在和谁说话？外套又是谁的？','Lesson14 Written B3；另设明确听话人','听话人与物主分开，改变直接问对方时的判断条件'),
    q('praise-hat','用合适的表达夸赞眼前的帽子','Anna 展示她的新帽子。\nLouise 想夸这顶帽子很漂亮，可以怎么说？',[
      ['That is a lovely hat!',''],["That's a nice dress.",'这句话夸连衣裙，不是眼前的帽子。'],["What colour's your hat?",'这句话在问颜色，没有表达夸赞。']
    ],'That is a lovely hat!','这里 lovely 夸帽子可爱、漂亮；hat 指帽子。','既要说到帽子，也要表达夸赞。','Lesson13 D13','读懂赞美的对象与用途，以本课实际赞美结束')
  );
  const stages = [
    {id:'l1',title:'准备看新衣',activities:[['words','配色小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
    {id:'l2',title:'一件新连衣裙',activities:[['text','新衣小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
    {id:'l3',title:'把颜色问清楚',activities:[['phrases','问色小锦囊','speech'],['colours','颜色说清楚','question']],required:['colours']},
    {id:'l4',title:'写张说明卡',activities:[['models','配色小画册','cards'],['trans','词块拼装台','order']],required:['trans']},
    {id:'l5',title:'配色小达人',activities:[['exam','配色小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
  ];
  const definition = { id:'unit13-14',version:1,title:'新衣配色屋',path:'/unit13-14/',start:'learn/words',
    previousQuestions,activityPredecessors,
    progress:{learningKey:'canran:unit13-14:learning:v1'},objects:WORDS,stages,questions,
    learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,MODELS,MODEL_EXAMPLE,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK}
  };
  root.CanranCore.unit1314 = definition;
  if (root.document?.documentElement.dataset.unit === definition.id) root.CanranCore.learningContext = definition;
})(globalThis);
