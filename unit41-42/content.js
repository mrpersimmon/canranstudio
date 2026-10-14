(function(root){
  'use strict';
  const image = name => '/assets/unit41-42/' + name + '.svg';
  const WORDS = [["cheese", "乳酪；干酪", "/tʃiːz/"], ["bread", "面包", "/bred/"], ["soap", "肥皂", "/səʊp/"], ["chocolate", "巧克力", "/ˈtʃɒklət/"], ["sugar", "糖", "/ˈʃʊɡə/"], ["coffee", "咖啡", "/ˈkɒfi/"], ["tea", "茶", "/tiː/"], ["tobacco", "烟草；烟丝", "/təˈbækəʊ/"], ["milk", "牛奶", "/mɪlk/"], ["bird", "鸟", "/bɜːd/"], ["piece", "一块；一片", "/piːs/"], ["loaf", "一条（面包）", "/ləʊf/"], ["bar", "条；块", "/bɑː/"], ["bottle", "瓶；一瓶的量", "/ˈbɒtl/"], ["pound", "磅（重量单位）", "/paʊnd/"], ["half", "一半", "/hɑːf/"], ["quarter", "四分之一", "/ˈkwɔːtə/"], ["tin", "罐；一罐的量", "/tɪn/"], ["some", "一些；本课用于肯定陈述", "/sʌm/"], ["any", "一些；本课用于询问或否定", "/ˈeni/"]].map(([en,cn,ph])=>({en,cn,ph,image:image(en)}));
  const unit = {id:'unit41-42', version:1, contentRevision:'bag-quantities-v1', mode:'classroom', title:'购物袋里的发现', path:'/unit41-42/', start:'learn/words',
    progress:{learningKey:'canran:unit41-42:learning:v1'},
    learning:{WORDS,DIALOGUE:[],FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},objects:WORDS,
    stages:[
      {id:'l1',title:'打开购物袋',activities:[['words','购物袋小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
      {id:'l2',title:'读懂小秘密',activities:[['text','购物袋小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
      {id:'l3',title:'把数量说清楚',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
      {id:'l4',title:'整理储物台',activities:[['apply','购物袋整理员','give']],required:['apply']},
      {id:'l5',title:'购物袋大挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
    ],questions:{listen:[],roles:[],grammar:[],apply:[],exam:[]},
    reward:{edition:'bag-quantities-v1',title:'购物袋小管家',lesson:'Lesson 41–42',scene:'/assets/unit41-42/keepsake-story-v4.webp',alt:'Sam 扶着椅子上的陶橙购物袋，Penny 拿出乳酪，两人看向乳酪，袋里露出面包和牛奶',color:'#617652',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','购物袋整理员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}
  };
  const wordExamples={piece:'a piece of cheese',loaf:'a loaf of bread',bar:'a bar of soap',bottle:'a bottle of milk',pound:'a pound of sugar',half:'half a pound of coffee',quarter:'a quarter of a pound of tea',tin:'a tin of tea'};
  WORDS.forEach(word=>{if(wordExamples[word.en])word.example=wordExamples[word.en];});
  root.CanranCore.unit4142=unit;
  if(root.document?.documentElement.dataset.unit===unit.id)root.CanranCore.learningContext=unit;
})(globalThis);
// Source-checked teaching material. No voice catalog is loaded in this edition.
(function(core){
  'use strict';
  const unit=core.unit4142, image=name=>'/assets/unit41-42/'+name+'.svg';
  const textSource='《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118';
  const grammarSource='《同步导学》Grammar 纸页76／PDF90：there be结构(2)、量词短语；《语法练习册》纸页114–118／PDF128–132';
  unit.learning.DIALOGUE=[
    ['sam','Is that bag heavy, Penny?','那个提包重吗，彭妮？'],
    ['penny','Not very.','不太重。'],
    ['sam','Here!','放这儿！'],
    ['sam','Put it on this chair.','把它放在这把椅子上。'],
    ['sam',"What's in it?",'里面有什么东西？'],
    ['penny','A piece of cheese.','一块乳酪。'],
    ['penny','A loaf of bread.','一条面包。'],
    ['penny','A bar of soap.','一块肥皂。'],
    ['penny','A bar of chocolate.','一块巧克力。'],
    ['penny','A bottle of milk.','一瓶牛奶。'],
    ['penny','A pound of sugar.','一磅糖。'],
    ['penny','Half a pound of coffee.','半磅咖啡。'],
    ['penny','A quarter of a pound of tea.','四分之一磅茶。'],
    ['penny','And a tin of tobacco.','还有一罐烟丝。'],
    ['sam','Is that tin of tobacco for me?','那罐烟丝是给我的吗？'],
    ['penny',"Well, it's certainly not for me!",'哦，当然不会是给我的！']
  ].map(([who,text,cn],i)=>({id:'u4142-d'+(i+1),who,text,cn,source:textSource}));
  const q=(id,target,prompt,input,explanation,hint='')=>({id:'u4142-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
  const choice=(options,answer,extra={})=>({options,answer,...extra});
  const blank=(before,after,options)=>({before,after,options});
  const fill=(blanks,answers,extra={})=>({type:'cloze',blanks,answer:JSON.stringify(answers),...extra});
  const bank=(tokens,answer,slots=tokens.length,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
  const match=(pairs,extra={})=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1))),...extra});
  const pictures=(words)=>Object.fromEntries(words.map(w=>[w,image(w)]));
  const model=(...lines)=>({lines});
  const g=(id,target,prompt,input,rule,demo)=>({...q('g-'+id,target,prompt,input,rule,'先看数量和句子的意思，再选择。'),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
  unit.questions.listen=[
    q('v-cheese','辨认 cheese','图中是什么？',choice(['cheese','bread','soap'],'cheese',{image:image('cheese'),imageAlt:'一块有孔洞的乳酪'}),'cheese 是乳酪。'),
    q('v-soap','区分 soap 与食品','哪一个是肥皂？',choice(['soap','chocolate','sugar'],'soap',{optionImages:pictures(['soap','chocolate','sugar'])}),'soap 是肥皂。'),
    q('v-drinks','理解茶、咖啡、牛奶','给这些词配对。',match([['tea','茶'],['coffee','咖啡'],['milk','牛奶']]),'tea、coffee、milk 分别是茶、咖啡、牛奶。'),
    q('v-bread','辨认 bread','bread 是什么？',choice(['面包','糖','鸟'],'面包',{optionImages:{'面包':image('bread'),'糖':image('sugar'),'鸟':image('bird')}}),'bread 是面包。'),
    q('v-chocolate','根据词义选择 chocolate','选出“巧克力”。',choice(['chocolate','cheese','coffee'],'chocolate',{optionImages:pictures(['chocolate','cheese','coffee'])}),'chocolate 是巧克力。'),
    q('v-sugar','根据图形辨认 sugar','包装上画着糖块，它是什么？',choice(['sugar','soap','tea'],'sugar',{image:image('sugar'),imageAlt:'画有白色糖块的糖袋'}),'sugar 是糖。'),
    q('v-story-words','理解课文物品与 Lesson 42 新词','给词和意思配对。',match([['tobacco','烟草；烟丝'],['bird','鸟'],['tin','罐']]),'tobacco 指内容物，tin 指盛放东西的罐；bird 是鸟。')
  ];
  unit.questions.roles=[
    q('r-heavy','联系问题理解省略回答','Penny 说“Not very.”，她觉得袋子怎样？',choice(['不太重','非常重','里面是空的'],'不太重'),'前一句在问 heavy，Not very. 在这里表示不太重。','先看 Sam 问的是重量还是里面的东西。'),
    q('r-chair','定位课文中的放置地点','点出 Sam 请 Penny 放袋子的地方。',{type:'locate',fragments:['Sam: Put ',{value:'it'},' on ',{value:'this chair'},'.\nSam: What’s in ',{value:'it?' }],options:['it','this chair','it?'],answer:'this chair'},'on this chair 表示在这把椅子上。','找表示地点的词组。'),
    q('r-weights','从原文提取三个重量','按 Penny 的话配对。',match([['sugar','一磅'],['coffee','半磅'],['tea','四分之一磅']],{leftLabel:'物品',rightLabel:'原文中的量'}),'原文分别说 a pound、half a pound、a quarter of a pound。','回看物品前面表示重量的部分。'),
    q('r-bars','读懂相同量词修饰不同物品','哪一张清单与课文一致？',choice(['a bar of soap · a bar of chocolate','a bottle of soap · a bar of chocolate','a bar of soap · a loaf of chocolate'],'a bar of soap · a bar of chocolate'),'课文用 a bar of 表达一块肥皂和一块巧克力。','核对 soap 和 chocolate 前面的词。'),
    q('r-me','按说话者理解 me，不添加未知事实','Penny：Well, it’s certainly not for me!\n她明确说，那罐烟丝不是给谁的？',choice(['Penny','Sam','没有说明'],'Penny',{optionImages:{Penny:image('penny'),Sam:image('sam')}}),'这里是 Penny 在说话，me 指她自己。','先看这句话是谁说的。')
  ];
  unit.questions.grammar=[
    g('is','单数与不可数名词用 is','补全：有一把勺子；有一些牛奶。',fill([blank('There ',' a spoon.', ['is','are']),blank('There ',' some milk.', ['is','are'])],['is','is']),'a spoon 是单数；milk 在这里是不可数名词，两句都用 is。',model(['There is a book.','有一本书。'],['There is some coffee.','有一些咖啡。'])),
    g('bottles','量词复数决定 are','牛奶一样，数的是瓶子。',fill([blank('There ',' two bottles of milk.', ['is','are']),blank('There ',' some milk.', ['is','are'])],['are','is']),'two bottles 是两瓶，用 are；some milk 是一些牛奶，用 is。',model(['There are three cups of tea.','有三杯茶；数的是 cups。'])),
    g('measures','理解量词短语的完整单位','给三种数量表达配对。',match([['a loaf of bread','一条面包'],['a bar of soap','一块肥皂'],['a bottle of milk','一瓶牛奶']],{leftLabel:'数量表达',rightLabel:'意思'}),'量词 + of + 物品，把量说清楚。'),
    g('loaves','量词可以变复数，物质名词不乱加 s','哪一项表示“两条面包”？',choice(['two loaves of bread','two loaf of bread','two loaves of breads'],'two loaves of bread'),'loaf 的复数是 loaves；这里 bread 不加 s。',model(['a bar of soap → three bars of soap','一块肥皂 → 三块肥皂；bar 随数量变化。'],['loaf → loaves','一条 → 多条'])) ,
    g('fraction','组成半磅的完整量词短语','用词块说：半磅咖啡。',bank(['Half','a pound','of coffee','a quarter'], 'Half a pound of coffee',3),'half a pound of… 表示半磅……。',model(['a pound of sugar','一磅糖'],['half a pound of sugar','半磅糖'],['a quarter of a pound of sugar','四分之一磅糖'])),
    g('some-a','肯定句中区分 some 与 a','补全：有一些茶；有一把勺子。',fill([blank('There is ',' tea.', ['some','a','any']),blank('There is ',' spoon.', ['some','a','any'])],['some','a']),'本课肯定陈述用 some tea；一把勺子用 a spoon。',model(['There is some sugar.','有一些糖。'],['There is a tin.','有一个罐。'])),
    g('ask-any','用 any 询问是否有不可数物品','用词块问：那个罐里有茶吗？',bank(['Is there','any tea','in that tin','some tea'],'Is there any tea in that tin',3,'?'),'不知道有没有茶，本课这类问句用 Is there any…?',model(['Is there any milk in that bottle?','那个瓶里有牛奶吗？'])),
    g('negative','否定句中使用 any','补全：桌上没有巧克力。',fill([blank('There isn’t ',' chocolate on the table.', ['any','some','a'])],['any']),'本课否定句用 isn’t any chocolate。'),
    g('ask-a','询问一个可数物品','用词块问：那棵树上有一只鸟吗？',bank(['Is there','a bird','in that tree','any bird'],'Is there a bird in that tree',3,'?'),'询问一只鸟，用 Is there a bird…?'),
    g('one-some','用 one 与 some 衔接回答','补全两句回答。',fill([blank('Is there a spoon? Yes, there is ',' on the plate.', ['one','some']),blank('Is there any bread? Yes, there is ',' on the table.', ['one','some'])],['one','some']),'one 代替一把勺子；some 代替一些面包。',model(['Is there a vase? Yes, there is one.','有一个花瓶吗？有一个。'],['Is there any milk? Yes, there is some.','有牛奶吗？有一些。'])),
    g('first-item','按紧跟 there be 的第一项选择形式','清单调换了顺序，补全句子。',fill([blank('There ',' a bottle of milk and two bars of soap.', ['is','are']),blank('There ',' two bars of soap and a bottle of milk.', ['is','are'])],['is','are']),'本课并列清单按第一项选择：a bottle 用 is，two bars 用 are。',model(['There is a pen and two books.','第一项 a pen 是单数。'],['There are two books and a pen.','第一项 two books 是复数。'])),
    g('independent','撤去示范后独立表达量词复数','用词块说：有三块肥皂。',bank(['There are','three bars','of soap','There is','three soaps'],'There are three bars of soap',3),'三块是 three bars of soap；bars 是复数，用 are。')
  ];
  const grammarHints={"is":"看看后面是一个物品，还是不能直接用数字数的东西。","bottles":"这两句分别在数瓶子，还是在说瓶里的牛奶？","measures":"留意容器和食物的形状。","loaves":"数量是 two，要检查的是量词的单复数。","fraction":"半磅和四分之一磅不同；把重量与物品连起来。","some-a":"一边是一些茶，一边是一件物品。","ask-any":"这句话在问有没有，不是在说已经有了。","negative":"isn’t 表示没有，再检查后面的词。","ask-a":"这次问的是一只鸟。","one-some":"回答中省略的物品，一边是勺子，一边是面包。","first-item":"分别看 be 后面紧接的第一项及其数量。","independent":"数的是肥皂的块数，再检查句首形式。"};
  unit.questions.grammar.forEach(question=>{question.hint=grammarHints[question.id.replace("u4142-v1-g-", "")];});
  // Scene changes are consequences of a checked correct answer, never selection.
  unit.questions.apply=[
    q('a-bread','读懂量词并选择真实物品','Penny 的清单：a loaf of bread\n先把它装进袋子。',choice(['bread','soap','milk'],'bread',{optionImages:pictures(['bread','soap','milk'])}),'一条面包已经放进袋子。','看看 loaf 搭配的物品。'),
    q('a-bottles','按清单核对瓶数','再放入 two bottles of milk。',choice(['一瓶牛奶','两瓶牛奶','三块肥皂'],'两瓶牛奶',{optionImages:{'一瓶牛奶':image('milk'),'两瓶牛奶':image('two-bottles'),'三块肥皂':image('three-bars')}}),'two bottles 是两瓶，牛奶本身不加 s。','先核对 two，再核对瓶里的物品。'),
    q('a-check','按实际清单作否定回答','袋里目前只有一条面包、两瓶牛奶。\nSam：Is there any soap in the bag?',choice(['No, there isn’t.','Yes, there is.','Not very.'],'No, there isn’t.',{reference:'袋里目前只有：一条面包、两瓶牛奶。'}),'当前清单里没有肥皂，所以回答 No, there isn’t.。','只按当前清单回答。'),
    q('a-place-v2','按英文指令把同一瓶牛奶从袋里移到指定位置','Sam：Put a bottle of milk on the table.\n从袋里拿一瓶牛奶，放在哪里？',choice(['桌上','椅子上','袋子里'],'桌上',{display:{title:'帮 Penny 放好一瓶牛奶',material:'Sam: Put a bottle of milk on the table.'},optionImages:{'桌上':image('table'),'椅子上':image('chair'),'袋子里':image('bag')}}),'一瓶移到桌上，袋里还剩一瓶；两瓶牛奶没有变多。','看 on 后面的地点，只移动一瓶。'),
    q('a-note-v2','根据连续整理后的数量和位置组成记录','看整理后的桌面，用词块记下一瓶牛奶的位置。',{...bank(['There is','a bottle','of milk','on the table','in the bag'],'There is a bottle of milk on the table',4),display:{title:'替 Penny 记下桌上的物品',material:'用词块说：桌上有一瓶牛奶。'}},'桌上有一瓶牛奶：There is a bottle of milk on the table.','先看桌面，再核对数量和位置。')
  ];
  unit.questions.exam=[
    q('e-bread','独立辨认 bread','图中是什么？',choice(['bread','cheese','soap'],'bread',{image:image('bread'),imageAlt:'一条面包'}),'bread 是面包。'),
    q('e-words','区分四种常见物品','给词和意思配对。',match([['sugar','糖'],['tea','茶'],['soap','肥皂'],['chocolate','巧克力']]),'留意相近物品词的不同词义。'),
    q('e-reading','综合读取重量感受与地点','Sam：Is that bag heavy, Penny?\nPenny：Not very.\nSam：Put it on this chair.\n哪张记录准确？',choice(['不太重；放到椅子上','非常重；放到椅子上','不太重；放到桌子上'],'不太重；放到椅子上'),'Not very. 回答重量；on this chair 说明地点。'),
    q('e-weights','独立分辨原文咖啡与茶的重量','按原文补全采购记录。',fill([blank('coffee：',' a pound',['half','a quarter of']),blank('tea：',' a pound',['half','a quarter of'])],['half','a quarter of']),'咖啡是 half a pound，茶是 a quarter of a pound。'),
    q('e-speaker','独立确认 me 的所指','Sam：Is that tin of tobacco for me?\n这一句的 me 指谁？',choice(['Sam','Penny','没有说明'],'Sam',{optionImages:{Sam:image('sam'),Penny:image('penny')}}),'Sam 正在说话，me 指 Sam。'),
    q('e-measures','独立选择 loaf 与 piece','补全：一条面包；一块乳酪。',fill([blank('a ',' of bread',['loaf','bottle','tin']),blank('a ',' of cheese',['piece','bottle','tin'])],['loaf','piece']),'本题用 a loaf of bread 和 a piece of cheese。'),
    q('e-plural-v2','独立使用不规则量词复数 loaves 与 are','补全记录：有两条面包。',fill([blank('There ',' two',['are','is']),blank('',' of bread.',['loaves','loaf','breads'])],['are','loaves']),'两条是 two loaves of bread；数的是 loaves，用 are。'),
    q('e-some-a','区分单个物品与不可数的一些','补全：有一把勺子；有一些咖啡。',fill([blank('There is ',' spoon.',['a','some','any']),blank('There is ',' coffee.',['a','some','any'])],['a','some']),'一把勺子是 a spoon；一些咖啡是 some coffee。'),
    q('e-any','独立组织询问不可数物品的句子','用词块问：那个袋子里有糖吗？',bank(['Is there','any sugar','in that bag','some sugar'],'Is there any sugar in that bag',3,'?'),'本课询问是否有糖，用 Is there any sugar…?'),
    q('e-negative-v2','读取新清单的缺失信息后组成否定记录','袋里只有清单上的物品。告诉 Sam：袋里没有茶。',{...bank(['There isn’t','any tea','in the bag','some tea'],'There isn’t any tea in the bag',3),display:{title:'告诉 Sam，袋里没有茶',material:'袋里只有：bread · milk'}},'清单里只有面包和牛奶，因此用 There isn’t any tea in the bag.。'),
    q('e-one-some','用 one 或 some 避免重复名词','补全两句回答。',fill([blank('Is there a passport? Yes, there is ',' on the table.',['one','some']),blank('Is there any chocolate? Yes, there is ',' on the desk.',['one','some'])],['one','some']),'one 代替一个护照；some 代替一些巧克力。'),
    q('e-position','区分内容物与容器的位置','茶在罐里，罐在桌上。补全标签。',fill([blank('The tea is ',' the tin.',['in','on']),blank('The tin is ',' the table.',['in','on'])],['in','on']),'茶在罐里是 in；罐在桌上是 on。'),
    q('e-agreement-v2','独立识别并列清单的单复数关系','补全两张物品清单。',fill([blank('There ',' a loaf of bread and three bars of soap.',['is','are']),blank('There ',' two bottles of milk and a tin of tea.',['is','are'])],['is','are']),'本课并列清单按紧接的第一项选择：a loaf 用 is，two bottles 用 are。'),
    q('e-evidence-v2','根据英文材料综合判断数量与肯否','In the bag: two bottles of milk. No tea.\nSam: Is there any milk in the bag?\n按这张新清单，替 Penny 回答。',choice(['Yes, there is. There are two bottles of milk.','No, there isn’t. There is some tea.','Yes, there is. There is one bottle of milk.'],'Yes, there is. There are two bottles of milk.'),'先读 two bottles of milk，再回答有没有与有多少。')
  ];
  // Keep the current award edition and confirmed stars. Changed questions only
  // inherit exact, reviewed predecessors; the original rounds remain retained.
  unit.taskSessions={apply:'polish-v2',exam:'polish-v2'};
  unit.taskPredecessors=Object.fromEntries(['apply','exam'].map(id=>[id,core.unit4142Previous?.[id]?[{key:'unit4142-'+id+'-practice/v1',questions:core.unit4142Previous[id]}]:[]]));
  // Display-only changes are outside the assessment signature.
  unit.copy={questions:{
    'u4142-v1-a-bread':{title:'帮 Penny 装好第一件物品',material:'Penny 的清单：a loaf of bread'},
    'u4142-v1-a-bottles':{title:'继续装进购物袋',material:'two bottles of milk'},
    'u4142-v1-a-check':{title:'替 Penny 回答',material:'Sam: Is there any soap in the bag?'}
  }};
  for(const items of Object.values(unit.questions))for(const item of items){
    if(item.options)item.distractorReasons=Object.fromEntries(item.options.filter(value=>value!==item.answer).map(value=>[value,'不符合本题明确给出的数量、物品、说话者或句型。'+item.explanation]));
    item.distractorRationale ||= '干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。';
  }
  // Full even-lesson replacement bank remains available without adding answer zones.
  unit.learning.MODELS=[
    ['13 · thirteen','passport','a passport','on that table','桌子上有一个护照吗？','/assets/unit15-16/passport.svg'],
    ['14 · fourteen','milk','any milk','on that table','桌子上有牛奶吗？','/assets/unit41-42/milk.svg'],
    ['15 · fifteen','spoon','a spoon','on that plate','盘子上有一把勺子吗？','/assets/unit21-22/spoon.svg'],
    ['16 · sixteen','tie','a tie','on that chair','椅子上有一条领带吗？','/assets/unit11-12/tie.svg'],
    ['17 · seventeen','bread','any bread','on that table','桌子上有面包吗？','/assets/unit41-42/bread.svg'],
    ['18 · eighteen','hammer','a hammer','on that bookcase','书架上有一把锤子吗？','/assets/unit37-38/hammer.svg'],
    ['19 · nineteen','tea','any tea','on that table','桌子上有茶吗？','/assets/unit41-42/tea.svg'],
    ['20 · twenty','vase','a vase','on that radio','收音机上有一个花瓶吗？','/assets/unit39-40/vase.svg'],
    ['30 · thirty','suit','a suit','in that wardrobe','衣柜里有一套衣服吗？','/assets/unit3-4/suit.svg'],
    ['40 · forty','tobacco','any tobacco','in that tin','罐子里有烟丝吗？','/assets/unit41-42/tobacco.svg'],
    ['50 · fifty','chocolate','any chocolate','on that desk','书桌上有巧克力吗？','/assets/unit41-42/chocolate.svg'],
    ['60 · sixty','cheese','any cheese','on that plate','盘子上有乳酪吗？','/assets/unit41-42/cheese.svg'],
    ['70 · seventy','newspaper','a newspaper','on that television','电视机上有一份报纸吗？','/assets/unit39-40/newspaper.svg'],
    ['80 · eighty','car','a car','on that bridge','桥上有一辆汽车吗？','/assets/unit1-2/car.svg'],
    ['90 · ninety','soap','any soap','on that dressing table','梳妆台上有肥皂吗？','/assets/unit41-42/soap.svg'],
    ['100 · a hundred','bird','a bird','in that tree','树上有一只鸟吗？','/assets/unit41-42/bird.svg']
  ].map(([number,word,noun,place,cn,art])=>({number,word,en:`Is there ${noun} ${place}?`,cn,image:art}));
  unit.learning.WRITING_A=[
    'Is there ___ bread in the kitchen?', 'There’s ___ loaf on the table.', 'There’s ___ coffee on the table, too.',
    'There isn’t ___ chocolate on the table.', 'There’s ___ spoon on that dish.', 'Is there ___ soap on the dressing table?'
  ];
  unit.learning.WRITING_B=['spoon / on the plate','tie / on the chair','milk / on the table','hammer / on the bookcase','tea / on the table','vase / on the radio','suit / in the wardrobe','tobacco / in the tin','chocolate / on the desk','cheese / on the plate'];
})(globalThis.CanranCore);
