(function(root){
  'use strict';
  const core=root.CanranCore, image=name=>'/assets/unit43-44/'+name+'.svg';
  const textSource='《新概念英语智慧版1》Lesson 43–44，纸页86–89／PDF119–122';
  const grammarSource='《同步导学》Grammar纸页79／PDF93；《语法练习册》纸页119–124／PDF133–138';
  const WORDS=[
    ['kettle','水壶','/ˈketl/','kettle'],['teapot','茶壶','/ˈtiːpɒt/','teapot'],['behind','在……后面','/bɪˈhaɪnd/','behind'],
    ['of course','当然','/əv ˈkɔːs/','of-course'],['now','现在；此刻','/naʊ/','now'],['find','找到','/faɪnd/','find'],
    ['boil','沸腾；烧开','/bɔɪl/','boil'],['make the tea','沏茶','/meɪk ðə tiː/','make-tea'],['hurry up','快点','/ˈhʌri ʌp/','hurry'],
    ['in front of','在……前面','/ɪn ˈfrʌnt əv/','in-front'],['water','水','/ˈwɔːtə/','water'],['tea','茶；茶叶','/tiː/','tea'],
    ['cup','杯子','/kʌp/','cup'],['cupboard','橱柜','/ˈkʌbəd/','cupboard'],['see','看见','/siː/','see'],
    ['can','能；会','/kæn/','can'],['some','一些','/sʌm/','some'],['any','一些；本课用于普通询问或否定','/ˈeni/','any']
  ].map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
  const unit={id:'unit43-44',version:1,contentRevision:'tea-can-v1',mode:'classroom',title:'茶具躲猫猫',path:'/unit43-44/',start:'learn/words',
    progress:{learningKey:'canran:unit43-44:learning:v1'},objects:WORDS,
    learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},
    stages:[
      {id:'l1',title:'认识茶桌',activities:[['words','茶具小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
      {id:'l2',title:'茶具藏在哪',activities:[['text','茶桌小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
      {id:'l3',title:'我会这样说',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
      {id:'l4',title:'一起找茶具',activities:[['apply','茶桌小帮手','give']],required:['apply']},
      {id:'l5',title:'茶桌大挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
    ],questions:{},
    reward:{edition:'tea-can-v1',title:'茶桌小帮手',lesson:'Lesson 43–44',scene:'/assets/unit43-44/keepsake-story-v1.webp',alt:'Penny 指出圆茶壶后面的茶叶，Sam 露出发现的笑容，旁边是水壶和两只杯子',color:'#4e797b',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','茶桌小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}
  };
  unit.learning.DIALOGUE=[
    ['penny','Can you make the tea, Sam?','你会沏茶吗，萨姆？'],
    ['sam','Yes, of course I can, Penny.','会的，我当然会，彭妮。'],
    ['sam','Is there any water in this kettle?','这水壶里有水吗？'],
    ['penny','Yes, there is.','有水。'],
    ['sam',"Where’s the tea?",'茶叶在哪儿？'],
    ['penny',"It’s over there, behind the teapot.",'就在那儿，茶壶后面。'],
    ['penny','Can you see it?','你看见了吗？'],
    ['sam',"I can see the teapot, but I can’t see the tea.",'茶壶我看见了，但茶叶没看见。'],
    ['penny',"There it is! It’s in front of you!",'那不是吗！就在你眼前。'],
    ['sam','Ah yes, I can see it now.','噢，是啊，我现在看到了。'],
    ['sam','Where are the cups?','茶杯在哪儿呢？'],
    ['penny','There are some in the cupboard.','橱柜里有几只。'],
    ['penny','Can you find them?','你找得到吗？'],
    ['sam','Yes. Here they are.','找得到。就在这儿呢。'],
    ['penny',"Hurry up, Sam! The kettle’s boiling!",'快，萨姆！水开了！']
  ].map(([who,text,cn],i)=>({id:'u4344-d'+(i+1),who,text,cn,source:textSource}));
  const q=(id,target,prompt,input,explanation,hint='')=>({id:'u4344-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
  const choice=(options,answer,extra={})=>({options,answer,...extra});
  const blank=(before,after,options)=>({before,after,options});
  const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});
  const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
  const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});
  const pictures=words=>Object.fromEntries(words.map(w=>[w,image(w)]));
  const model=(...lines)=>({lines});
  const g=(id,target,prompt,input,rule,hint,demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
  unit.questions.listen=[
    q('v-kettle','区分烧水的水壶与泡茶的茶壶','图中是什么？',choice(['kettle','teapot','cup'],'kettle',{image:image('kettle'),imageAlt:'带拱形提手的烧水壶'}),'kettle 是烧水的水壶。'),
    q('v-teapot','从英文找到茶壶','选出 teapot。',choice(['茶壶','水壶','杯子'],'茶壶',{optionImages:{'茶壶':image('teapot'),'水壶':image('kettle'),'杯子':image('cup')}}),'teapot 是沏茶、盛茶的茶壶。'),
    q('v-behind','区分前后方位','“在……后面”怎么说？',choice(['behind','in front of','in'],'behind'),'behind 表示在……后面。'),
    q('v-actions','理解找到、看见和沸腾','给词和意思配对。',match([['find','找到'],['see','看见'],['boil','沸腾；烧开']]),'find 是找到，see 是看见，boil 是沸腾或烧开。'),
    q('v-now','理解时间词now','now 是什么意思？',choice(['现在','当然','快点'],'现在'),'now 表示现在、此刻。'),
    q('v-cupboard','区分杯子与橱柜','选出 cupboard。',choice(['橱柜','杯子','茶叶'],'橱柜',{optionImages:{'橱柜':image('cupboard'),'杯子':image('cup'),'茶叶':image('tea')}}),'cupboard 是放物品的橱柜。'),
    q('v-phrases','理解本课三个完整表达','把表达与意思连起来。',match([['of course','当然'],['make the tea','沏茶'],['hurry up','快点']]),'短语要放在一起理解。')
  ];
  unit.questions.roles=[
    q('r-place','从完整原文定位茶叶的参照物','点出 Penny 说茶叶在哪里的词组。',{type:'locate',fragments:['Penny: It’s ',{value:'over there'},', ',{value:'behind the teapot'},'.\nSam: Where are ',{value:'the cups'},'?'],options:['over there','behind the teapot','the cups'],answer:'behind the teapot'},'茶叶在茶壶后面。','找说出“哪个物品后面”的词组。'),
    q('r-pronouns','根据前文理解some和them','Sam：Where are the cups?\nPenny：There are some in the cupboard. Can you find them?\nsome 和 them 在这里都指什么？',choice(['cups','tea','kettles'],'cups',{optionImages:pictures(['cups','tea','kettles'])}),'some 指一些杯子，them 也指前面说的杯子。','回看 Sam 正在找什么。'),
    q('r-see','不把没看见误判成不存在','Sam 说：I can’t see the tea.\n这句话只告诉我们什么？',choice(['他没有看见茶叶','厨房里没有茶叶','他不喜欢茶叶'],'他没有看见茶叶'),'没看见不等于没有；Penny 已经告诉他茶叶的位置。','区分“看见”与“有没有”。'),
    q('r-hurry','根据原文因果理解催促','Penny 为什么说 Hurry up, Sam!？',choice(['水壶里的水开了','杯子打碎了','他们要出门了'],'水壶里的水开了'),'后一句 The kettle’s boiling! 说明水开了。','看催促后紧接的一句话。'),
    q('r-evidence','根据明确细节作有限推断','哪条线索最能说明 Sam 平时不常沏茶？',choice(['他不断问茶叶和杯子在哪儿','他完全不会沏茶','他不喜欢喝茶'],'他不断问茶叶和杯子在哪儿'),'他不熟悉物品位置；原文没有说他完全不会沏茶或不喜欢茶。','用课文中真正发生的事情作依据。')
  ];
  unit.questions.grammar=[
    g('ability','理解can的能力意义','Penny can make the tea.\n这里的 can 表示什么？',choice(['会；能够','正在','必须'],'会；能够'),'这里 can 表示能力。','想想这句在说本领还是正在发生的动作。',model(['I can read this book.','我能读这本书。'])),
    g('person','can没有人称和数的变化','两个人都能找到杯子，补全句子。',fill([blank('I ',' find the cups.',['can','cans']),blank('He ',' find the cups.',['can','cans'])],['can','can']),'主语换成 he，can 也不加 s。','变的是说的人；检查 can 是否需要变化。',model(['Penny can open the door.','Penny 能开门。'],['They can open the door.','他们能开门；can 没变。'])),
    g('verb','can后接动词原形','Sam 会沏茶，补全句子。',fill([blank('Sam can ',' the tea.',['make','makes','making'])],['make']),'can 后面接 make，不用 makes 或 making。','留意动作前面已经有 can。',model(['He can see the kettle.','can 后用 see。'])),
    g('negative','can的否定缩写','说“我找不到茶叶”。',fill([blank('I ',' find the tea.',['can’t','don’t','am not'])],['can’t']),'表示“不能”时用 can’t，后面的 find 仍用原形。','这是 can 的否定，不是 be 的否定。',model(['I cannot see the cup. → I can’t see the cup.','cannot 可以缩写为 can’t。'])),
    g('question','can前置构成问句','用词块问：Penny 能找到杯子吗？',bank(['Can','Penny','find','the cups','Does','finds'],'Can Penny find the cups',4,'?'),'把 can 放到主语前面提问，不再加 do 或 does。','先找提问的 can，再放人和动作。',model(['You can see it. → Can you see it?','can 到句首，see 不变。'])),
    g('reply','根据能力事实作can肯否短答','你会沏茶，但现在看不见杯子。补全回答。',fill([blank('Can you make the tea? Yes, I ','.',['can','can’t','am']),blank('Can you see the cups? No, I ','.',['can','can’t','am not'])],['can','can’t']),'Can you…? 用 Yes, I can. 或 No, I can’t. 回答。','两句要分别按题目给的事实回答。'),
    g('some','区分肯定some与否定any','看得见一些杯子，看不见玻璃杯。',fill([blank('I can see ',' cups.',['some','any']),blank('I can’t see ',' glasses.',['some','any'])],['some','any']),'本课肯定陈述用 some；否定句用 any。','先找 can 或 can’t，再看句子的意思。',model(['I can see some spoons.','我能看见一些勺子。'],['I can’t see any bread.','我看不见面包。'])),
    g('there','不可数与可数复数的there be提问','问有没有水、有没有杯子。',fill([blank('',' there any water in the kettle?',['Is','Are']),blank('',' there any cups in the cupboard?',['Is','Are'])],['Is','Are']),'water 是不可数名词用 Is；cups 是复数用 Are。','看问的是水，还是一只只杯子。',model(['Is there any milk?','有牛奶吗？'],['Are there any books?','有书吗？'])),
    g('es','以s/x/ch/sh等结尾的名词复数','补全：一些盒子；一些盘子。',fill([blank('some ',' (box)',['boxes','boxs']),blank('some ',' (dish)',['dishes','dishs'])],['boxes','dishes']),'box → boxes；dish → dishes。','对照示范里的词尾，再看 box 和 dish。',model(['a bus → two buses','bus 变复数加 es。'])),
    g('ves','本课f/fe变ves的复数','补全：一些刀；一些架子。',fill([blank('some ',' (knife)',['knives','knifes']),blank('some ',' (shelf)',['shelves','shelfs'])],['knives','shelves']),'本课 knife 和 shelf 的复数分别是 knives、shelves。','留意词尾的 f 或 fe；别把这条规则推广到所有单词。',model(['a loaf → two loaves','本课这类词的复数把 f／fe 换成 ves。'],['wife → wives','wife 的复数是 wives。'])),
    g('there-reply','区分can回答与there be回答','柜里有两只杯子。\nAre there any cups in the cupboard?',choice(['Yes, there are.','Yes, I can.','Yes, there is.'],'Yes, there are.'),'问有没有杯子，用 there are 回答；can 问能力。','看句首是 Are there 还是 Can you。'),
    g('independent','撤去示范后独立组织can否定句','用词块说：我看不见茶叶。',bank(['I','can’t','see','the tea','don’t','sees'],'I can’t see the tea',4),'I can’t see the tea. 表示我看不见茶叶。','检查否定形式和动作形式。')
  ];
  unit.questions.apply=[
    q('a-ready','在新情境中回应能力提问','你会沏茶，替自己回答。',choice(['Yes, I can.','Yes, there is.','Yes, I am.'],'Yes, I can.',{display:{title:'你会沏茶，怎样回答 Penny？',material:'Penny: Can you make the tea?'}}),'Can you…? 的肯定回答是 Yes, I can.。','这次问的是你会不会。'),
    q('a-find','按英文线索定位茶叶','先找茶叶。',choice(['茶壶后面','橱柜里面','水壶里面'],'茶壶后面',{display:{title:'帮 Sam 找茶叶',material:'Penny: The tea is behind the teapot.'},optionImages:{'茶壶后面':image('behind'),'橱柜里面':image('cupboard'),'水壶里面':image('water')}}),'茶叶就在茶壶后面。','看 behind 后面的参照物。'),
    q('a-cups','按新情境中的实际库存回答','柜里有两只杯子，替 Penny 回答。',choice(['Yes, there are.','No, there aren’t.','Yes, I can.'],'Yes, there are.',{display:{title:'柜里有两只杯子，怎样回答？',material:'Sam: Are there any cups in the cupboard?'},reference:'橱柜里有两只杯子。'}),'两只杯子在柜里，回答 Yes, there are.。','按柜子里的物品回答“有没有”。'),
    q('a-place','按指令移动同一组杯子并明确参照物','把杯子放在哪里？',choice(['水壶前面','茶壶后面','橱柜里面'],'水壶前面',{display:{title:'把两只杯子摆好',material:'Penny: Put the cups in front of the kettle.'},optionImages:{'水壶前面':image('cups-front'),'茶壶后面':image('cups-behind'),'橱柜里面':image('cupboard')}}),'两只杯子从柜里移到水壶前面，柜里不再有这两只杯子。','看 in front of 后面跟的是哪个物品。'),
    q('a-note','根据连续操作的结果记录真实位置','用词块说：杯子在水壶前面。',bank(['The cups','are','in front of','the kettle','is','behind'],'The cups are in front of the kettle',4),'复数 cups 用 are；位置是 in front of the kettle。','先看刚刚摆好的位置，再选表示前后的词。')
  ];
  unit.questions.exam=[
    q('e-kettle','独立区分两种壶','选出 kettle。',choice(['水壶','茶壶','杯子'],'水壶',{optionImages:{'水壶':image('kettle'),'茶壶':image('teapot'),'杯子':image('cup')}}),'kettle 是水壶。'),
    q('e-words','独立理解全部动作时间回应词','把词和意思配对。',match([['of course','当然'],['now','现在'],['find','找到'],['boil','沸腾；烧开']]),'按各词在本课的意思配对。'),
    q('e-place','英语阅读确认位置和指代','Penny: The tea is behind the teapot. Can you see it?\nit 指什么？',choice(['茶叶','茶壶','水壶'],'茶叶'),'这里 it 指正在寻找的茶叶。'),
    q('e-some','从课文前后句理解some','Sam: Where are the cups?\nPenny: There are some in the cupboard.\n哪条记录正确？',choice(['橱柜里有一些杯子','橱柜里有一些茶叶','杯子在橱柜前面'],'橱柜里有一些杯子'),'some 代替 some cups；in 表示在里面。'),
    q('e-inference','区分原文事实与推断过度','Sam 问了水、茶叶和杯子，又说自己会沏茶。\n哪种判断最符合课文？',choice(['他会沏茶，但不熟悉物品位置','他完全不会沏茶','厨房里没有茶叶和杯子'],'他会沏茶，但不熟悉物品位置'),'反复找物说明不熟悉位置，不能推成完全不会。'),
    q('e-can','独立同时判断can不变形与动词原形','补全：他会沏茶。',fill([blank('He ','',['can','cans','is']),blank('',' the tea.',['make','makes','making'])],['can','make']),'He can make the tea. 中 can 和 make 都不加 s。'),
    q('e-negative','独立构成can否定句','补全：Sam 找不到杯子。',fill([blank('Sam ',' find the cups.',['can’t','doesn’t','isn’t'])],['can’t']),'本题表达不能找到，用 can’t find。'),
    q('e-question','独立构成can一般疑问句','用词块问：Sam 能看见茶壶吗？',bank(['Can','Sam','see','the teapot','Does','sees'],'Can Sam see the teapot',4,'?'),'Can 放到主语 Sam 前，动词用 see。'),
    q('e-reply','按明确的看见事实回应can','你看得见茶壶，但看不见茶叶。\nPenny: Can you see the tea?',choice(['No, I can’t.','Yes, I can.','No, there isn’t.'],'No, I can’t.'),'询问你能否看见，按事实回答 No, I can’t.。'),
    q('e-there','独立区分物质名词与可数复数','补全两个问句。',fill([blank('',' there any coffee on the table?',['Is','Are']),blank('',' there any teapots in the cupboard?',['Is','Are'])],['Is','Are']),'coffee 是不可数名词；teapots 是复数。'),
    q('e-some-any','独立选择肯定some与否定any','补全：看见一些勺子，但看不见刀。',fill([blank('I can see ',' spoons,',['some','any']),blank('but I can’t see ',' knives.',['some','any'])],['some','any']),'本课肯定用 some，否定用 any。'),
    q('e-plurals','独立检查-es与-ves的必要对比','补全：一些盘子；一些架子。',fill([blank('some ',' (dish)',['dishes','dishs']),blank('some ',' (shelf)',['shelves','shelfs'])],['dishes','shelves']),'dish 加 es；shelf 把 f 换成 ves。'),
    q('e-irregular','独立检查Lesson44的wife和loaf复数','补全：他们的妻子们；一些条形面包。',fill([blank('their ',' (wife)',['wives','wifes']),blank('some ',' of bread (loaf)',['loaves','loafs'])],['wives','loaves']),'wife → wives；loaf → loaves。'),
    q('e-position','看清图片的参照物后表达前后关系','看图补全：杯子的位置。',{...fill([blank('The cups are ',' the kettle.',['in front of','behind','in'])],['in front of']),image:image('cups-front'),imageAlt:'两只杯子在水壶的前面，杯子遮住水壶底部'} ,'参照物是水壶，杯子在它前面。'),
    q('e-evidence','综合区分存在与看见并使用复数肯否回答','Penny: There are some cups in the cupboard.\nSam: I can’t see them.\nAre there any cups in the cupboard?',choice(['Yes, there are. Sam can’t see them.','No, there aren’t. Sam can’t see them.','Yes, there is. Sam can see them.'],'Yes, there are. Sam can’t see them.'),'杯子确实在柜里；Sam 没看见并不代表没有。')
  ];
  for(const items of Object.values(unit.questions))for(const item of items){
    item.distractorRationale='干扰项对应词义、参照物、看见与存在、人称变化、can后动词形式或单复数的具体混淆。';
  }
  unit.learning.MODELS=[
    ['70 · seventy','bread','Is there any bread on the table?','桌上有面包吗？','/assets/unit41-42/bread.svg'],
    ['80 · eighty','hammers','Are there any hammers behind that box?','那个盒子后面有锤子吗？','/assets/unit37-38/hammer.svg'],
    ['90 · ninety','milk','Is there any milk in front of the door?','门前有牛奶吗？','/assets/unit41-42/milk.svg'],
    ['100 · a hundred','soap','Is there any soap on the cupboard?','橱柜上有肥皂吗？','/assets/unit41-42/soap.svg'],
    ['200 · two hundred','newspapers','Are there any newspapers behind that vase?','那个花瓶后面有报纸吗？','/assets/unit39-40/newspaper.svg'],
    ['300 · three hundred','water','Is there any water in those glasses?','那些玻璃杯里有水吗？',image('water')],
    ['400 · four hundred','tea','Is there any tea in those cups?','那些杯子里有茶吗？',image('make-tea')],
    ['500 · five hundred','cups','Are there any cups in front of that kettle?','那个水壶前面有杯子吗？',image('cups-front')],
    ['600 · six hundred','chocolate','Is there any chocolate behind that book?','那本书后面有巧克力吗？','/assets/unit41-42/chocolate.svg'],
    ['700 · seven hundred','teapots','Are there any teapots in the cupboard?','橱柜里有茶壶吗？',image('teapot')],
    ['800 · eight hundred','cars','Are there any cars in front of that building?','那栋楼前有汽车吗？','/assets/unit1-2/car.svg'],
    ['900 · nine hundred','coffee','Is there any coffee on the table?','桌上有咖啡吗？','/assets/unit41-42/coffee.svg']
  ].map(([number,word,en,cn,art])=>({number,word,en,cn,image:art}));
  unit.learning.PLURALS=[['glass','glasses'],['book','books'],['housewife','housewives'],['knife','knives'],['box','boxes'],['loaf','loaves'],['shelf','shelves'],['wife','wives'],['dish','dishes'],['bus','buses']];
  unit.learning.WRITING_A=[
    'I can see some spoons, but I can’t see any ___ (knife).',
    'I can see some hammers, but I can’t see any ___ (box).',
    'I can see some coffee, but I can’t see any ___ (loaf) of bread.',
    'I can see some cupboards, but I can’t see any ___ (shelf).',
    'I can see Mr. Jones and Mr. Brown, but I can’t see their ___ (wife).',
    'I can see some cups, but I can’t see any ___ (dish).',
    'I can see some cars, but I can’t see any ___ (bus).'
  ];
  unit.learning.WRITING_B=['milk / in front of the door','soap / on the cupboard','newspapers / behind that vase','water / in those glasses','tea / in those cups','cups / in front of that kettle','chocolate / behind that book','teapots / in that cupboard','cars / in front of that building','coffee / on the table'];
  core.unit4344=unit;
  if(root.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// Preserve the established five-star award and retain reviewed v1 questions.
(function(core){
'use strict';const unit=core.unit4344,old=JSON.parse(JSON.stringify(unit));core.unit4344BeforeV153=old;
unit.contentRevision='tea-teaching-v153';
unit.sources={text:'课本纸86–89／PDF119–122',guide:'同步导学纸77–80／PDF91–94，Grammar纸79／PDF93',workbook:'语法练习册纸119–125／PDF133–139'};
unit.objects=old.objects.map(w=>({...w,cn:w.en==='any'?'一些':w.cn}));unit.learning.WORDS=unit.objects;
const material=(title,material)=>({title,material});
function revise(group,id,changes){const i=unit.questions[group].findIndex(q=>q.id===id);if(i<0)throw Error(id);unit.questions[group][i]={...unit.questions[group][i],...changes,id:id+'-v153'};}
revise('roles','u4344-v1-r-hurry',{display:material('Penny为什么催促Sam？','Penny: Hurry up, Sam! The kettle’s boiling!')});
revise('roles','u4344-v1-r-evidence',{display:material('哪条线索最能说明Sam不常沏茶？','Sam: Where’s the tea?\nSam: Where are the cups?\nSam: Yes, of course I can, Penny.'),explanation:'反复询问常用物品的位置，是本故事支持“不常沏茶”的线索；不能据此说他不会沏茶，也不能用来判断所有不熟悉厨房的人。'});
revise('grammar','u4344-v1-g-reply',{workshop:{rule:'Can you…?按照给出的能力或看见事实，用Yes, I can.或No, I can’t.回答。',model:{lines:[['Can you open the door?','能够开门：Yes, I can.；不能开门：No, I can’t.。不能只从问句猜有无能力。']]}}});
revise('grammar','u4344-v1-g-there-reply',{prompt:'柜里有两只杯子，没有盘子。补全符合事实的回答。',type:'cloze',options:undefined,blanks:[{before:'Are there any cups? Yes, there ',after:'.',options:['are','is','aren’t']},{before:'Are there any dishes? No, there ',after:'.',options:['aren’t','isn’t','are']}],answer:JSON.stringify(['are','aren’t']),explanation:'cups和dishes均为复数；杯子有、盘子无，分别回答there are和there aren’t。',workshop:{rule:'复数物品用Are there…?，回答有无要看事实。',model:{lines:[['Are there any books here?','有书：Yes, there are.；没有书：No, there aren’t.。这里问存在，不是问能力。']]}}});
revise('grammar','u4344-v1-g-independent',{target:'撤去示范，组合can肯否和but的事实对比',prompt:'你能看见水壶，但看不见茶叶。把后半句接完整。',tokens:['but','I','can’t','see the tea','can','don’t'],slots:4,answer:'but I can’t see the tea',display:material('按事实接上后半句。','你能看见水壶，但看不见茶叶。\nI can see the kettle, …'),explanation:'but连接这里相反的看见事实；后半句用I can’t see the tea。',workshop:{rule:'but把能够看见与不能看见的两种事实连起来。'}});
const q=(id,target,prompt,input,explanation)=>({id:'u4344-v153-'+id,target,prompt,source:unit.sources.workbook,...input,explanation,hint:'',distractorRationale:'由已给出的能力事实、问的人和动词形式区分，不能只凭问句猜答案。'});
unit.questions.grammar.push({...q('g-who','从能力事实回答谁能做某事','Sam会沏茶，Tim不会。回答Penny的问题。',{options:['Sam can make the tea.','Tim can make the tea.','Sam can makes the tea.'],answer:'Sam can make the tea.',display:material('谁会沏茶？','Sam can make the tea. Tim can’t.\nPenny: Who can make the tea?')},'问Who时回答能完成动作的人；Sam后面的can和make都不加s。'),workshop:{rule:'Who can…?问谁有这个能力，回答要有题目给出的依据。',model:{lines:[['Who can open the door? — Penny can open the door.','已知Penny能开门。Who问谁；can后仍用open。']]}}});
unit.questions.exam.push(q('e-who','撤去示范，根据能力差异回答Who并保持动词原形','读两个人的话，替他们回答。',{options:['Penny can make the tea.','Sam can make the tea.','Penny can makes the tea.'],answer:'Penny can make the tea.',display:material('Who can make the tea?','另一次练习：\nPenny: I can make the tea.\nSam: I can’t make the tea, but I can make the coffee.')},'这次练习里Penny会沏茶，Sam会冲咖啡；按本题材料作答，不沿用原文中Sam的回答。'));
unit.taskSessions={};unit.taskPredecessors={};for(const id of ['roles','grammar','exam']){unit.taskSessions[id]='v153';unit.taskPredecessors[id]=[{key:'unit4344-'+id+'-practice/v1',questions:old.questions[id]}];}
core.unit4344=unit;if(globalThis.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis.CanranCore);
