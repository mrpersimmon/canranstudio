(function(root){
 'use strict';
 const image=name=>'/assets/unit21-22/'+name+'.svg';
 const source='《新概念英语智慧版1》纸页42–45（PDF75–78）';
 const WORDS=[
  ['give','给；递给','/ɡɪv/','Give me a book, please.'],['one','本句代指一本书','/wʌn/','This one?'],['which','哪一个；哪一些','/wɪtʃ/','Which book?'],['book','书','/bʊk/'],['red','红色的','/red/'],['blue','蓝色的','/bluː/'],
  ['empty','空的','/ˈempti/'],['full','满的','/fʊl/'],['large','大的','/lɑːrdʒ/'],['little','本课：小的','/ˈlɪt̬əl/','a little box'],['sharp','锋利的；尖的','/ʃɑːrp/','a sharp knife'],['blunt','钝的','/blʌnt/'],
  ['big','大的','/bɪɡ/'],['small','小的','/smɑːl/'],['box','盒子；箱子','/bɑːks/'],['glass','本课：玻璃杯','/ɡlæs/'],['cup','杯子','/kʌp/'],['bottle','瓶子','/ˈbɑːt̬əl/'],
  ['tin','本课：罐头盒','/tɪn/'],['knife','刀子','/naɪf/'],['fork','叉子','/fɔːrk/'],['spoon','勺子','/spuːn/'],['me','我（作接收者）','/miː/','Give me a book.'],['him','他（作接收者）','/hɪm/','Give him a book.'],
  ['her','她；她的（看句子）','/hɝː/','Give her a book. / her book'],['us','我们（作接收者）','/ʌs/','Give us a book.'],['them','他们／她们／它们','/ðem/','Give them a book.'],['his','他的','/hɪz/','his book'],['our','我们的','/aʊr/','our pens'],['their','他们／她们／它们的','/ðer/','their books'],
  ['dirty','脏的','/ˈdɝːt̬i/'],['clean','干净的','/kliːn/'],['new','新的','/nuː/'],['old','本课：旧的','/oʊld/','an old tin'],['this','这个','/ðɪs/'],['that','那个','/ðæt/']
 ].map(([en,cn,ph,example=''])=>({en,cn,ph,example,image:image(en),source}));
 const PEOPLE={man:{name:'男士',image:image('man')},jane:{name:'简（Jane）',image:image('jane')}};
 const DIALOGUE=[
  ['man','Give me a book please, Jane.','请拿本书给我，简。'],['jane','Which book?','哪一本？'],['jane','This one?','这本吗？'],['man','No, not that one. The red one.','不，不是那本。红色的那本。'],
  ['jane','This one?','这本吗？'],['man','Yes, please.','是的，请给我。'],['jane','Here you are.','给你。'],['man','Thank you.','谢谢你。']
 ].map(([person,text,cn],i)=>({id:'L21-D'+String(i+1).padStart(2,'0'),person,who:person==='man'?'teacher':'student',text,cn,source:source+'；Lesson21原文'}));
 const PHRASES=[
  ['me','请给我一本书。'],['him','请给他一本书。'],['her','请给她一本书。'],['us','请给我们一本书。'],['them','请给他们一本书。']
 ].map(([person,cn])=>({en:`Give ${person} a book, please.`,cn,image:image(person),source:source+'；Lesson22标题'}));
 const GALLERY=[
  ['a dirty cup','脏的杯子','dirty-cup'],['a clean cup','干净的杯子','clean-cup'],['an empty glass','空的玻璃杯','empty-glass'],['a full glass','满的玻璃杯','full-glass'],
  ['a large bottle','大的瓶子','large-bottle'],['a small bottle','小的瓶子','small-bottle'],['a big box','大的盒子','big-box'],['a little box','小的盒子','little-box'],
  ['a new tin','新的罐头盒','new-tin'],['an old tin','旧的罐头盒','old-tin'],['a sharp knife','锋利的刀','sharp-knife'],['a blunt knife','钝的刀','blunt-knife'],
  ['a new spoon','新的勺子','new-spoon'],['an old spoon','旧的勺子','old-spoon'],['a large fork','大的叉子','large-fork'],['a small fork','小的叉子','small-fork']
 ].map(([en,cn,picture],i)=>({en,cn,image:image(picture),source:source+'；Lesson22图'+(1001+i)}));
 const model=(subject,wrong,right,picture)=>({subject,wrong,right,en:`Give me a ${subject}, please.\nWhich one? This ${wrong} one?\nNo, not this ${wrong} one. That ${right} one.\nHere you are.\nThank you.`,cn:'',image:image(picture),source:source+'；Lesson22 Written B'});
 const MODEL_EXAMPLE=model('book','blue','red','red-book');
 const MODELS=[['cup','dirty','clean','clean-cup'],['glass','empty','full','full-glass'],['bottle','large','small','small-bottle'],['box','big','little','little-box'],['tin','new','old','old-tin'],['knife','sharp','blunt','blunt-knife'],['spoon','new','old','old-spoon'],['fork','large','small','small-fork']].map(row=>model(...row));
 const REFERENCE=[
  ["Is this Nicola's coat? No, it's not. ___ coat is grey.",'Her'],["Are these your pens? No, they're not. ___ pens are blue.",'Our'],["Is this Mr. Jackson's hat? No, it's not. ___ hat is black.",'His'],
  ["Are these the children's books? No, they're not. ___ books are red.",'Their'],["Is this Helen's dog? No, it's not. ___ dog is brown and white.",'Her'],["Is this your father's tie? No, it's not. ___ tie is orange.",'His']
 ].map(([prompt,answer])=>({prompt,answer,en:prompt.replace('___',answer),source:source+'；Lesson22 Written A'}));
 const q=(id,target,prompt,options,answer,explanation,hint,basis,decision,extra={})=>({id:'u2122-v1-'+id,target,prompt,options:options?.map(o=>o[0]),answer,explanation,hint,source:source+'；'+basis,decision,distractorReasons:options?Object.fromEntries(options.filter(o=>o[0]!==answer)):undefined,...extra});
 const vocab=(id,prompt,answer,wrong,basis,extra={})=>q('vocab-'+id,'理解 '+id+' 的本课含义',prompt,[[answer,''],...wrong],answer,'这里表示“'+answer+'”。','',basis,'新词或必要语境各一次，不整组重复翻译',{presentation:'vocabulary',...extra});
 const questions={
  listen:[
   vocab('give','Give me a book, please.\ngive 在这句话里表示什么？','给；递给',[['寻找','寻找不是这句 give 的意思。'],['看','看是 look，不是递给。'],['阅读','本句是请人递书，不是请人读书。']],'Lesson21词表与D01'),
   vocab('one','Jane 拿着书问：This one?\n这里的 this one 指什么？','这一本书',[['数字一','这里 one 代替 book，不是在数数。'],['这位女士','上文在选书，不是在选人。'],['这支钢笔','上文说的是书，不是钢笔。']],'Lesson21注释3'),
   vocab('which','Which book?\n这句话在问什么？','哪一本书？',[['谁的书？','谁的用 whose，本句确认哪一本。'],['有几本书？','本句不问数量。'],['书是什么颜色？','本句先问哪本，不限定只能用颜色说明。']],'Lesson21词表与D02'),
   vocab('empty / full','empty / full\n描述杯子时，分别表示什么？','空的 / 满的',[['满的 / 空的','顺序相反。'],['大的 / 小的','空满不等于大小。'],['新的 / 旧的','新旧不等于是否装满。']],'Lesson22词表与图1003–1004'),
   vocab('large / little','large / little\n描述物品大小时，分别表示什么？','大的 / 小的',[['高的 / 矮的','这里说体积，不是身高。'],['轻的 / 重的','大小不等于重量。'],['新的 / 旧的','large / little 不说明新旧。']],'Lesson22词表与图1005–1008'),
   vocab('sharp / blunt','sharp / blunt\n描述刀刃时，分别表示什么？','锋利的 / 钝的',[['长的 / 短的','刀刃锋利程度不由长度决定。'],['新的 / 旧的','新旧不直接决定锋利程度。'],['大的 / 小的','大小不等于锋利程度。']],'Lesson22词表与图1011–1012'),
   vocab('box','box\n选出这个词的意思。','盒子；箱子',[['瓶子','瓶子是 bottle。'],['书','书是 book。'],['杯子','杯子是 cup。']],'Lesson22词表'),
   vocab('glass','看看图，选出英文。','glass',[['bottle','bottle 有瓶颈，不是这里的玻璃杯。'],['box','box 是盒子。'],['spoon','spoon 是勺子。']],'Lesson22词表',{image:image('glass'),imageAlt:'一个透明的直筒饮水容器，没有瓶颈'}),
   vocab('cup','cup\n选出这个词的意思。','杯子',[['帽子','帽子是 cap 或 hat，不是 cup。'],['罐头盒','罐头盒是 tin。'],['书','书是 book。']],'Lesson22词表'),
   vocab('bottle','瓶子\n选出对应的英文。','bottle',[['box','box 是盒子。'],['book','book 是书。'],['fork','fork 是叉子。']],'Lesson22词表'),
   vocab('tin','a tin\n说的是哪种容器？','罐头盒',[['玻璃杯','玻璃杯是 glass。'],['纸盒','本课 tin 是金属食品容器，不是纸盒。'],['瓶子','瓶子是 bottle。']],'Lesson22词表与图1009–1010'),
   vocab('knife','看看图，选出英文。','knife',[['fork','fork 有叉齿，不是刀刃。'],['spoon','spoon 有凹面勺头。'],['pen','pen 是笔。']],'Lesson22词表',{image:image('knife'),imageAlt:'一件有刀柄和刀刃的餐具'}),
   vocab('fork','叉子\n选出对应的英文。','fork',[['knife','knife 是刀子。'],['spoon','spoon 是勺子。'],['cup','cup 是杯子。']],'Lesson22词表'),
   vocab('spoon','spoon\n选出这个词的意思。','勺子',[['叉子','叉子是 fork。'],['刀子','刀子是 knife。'],['瓶子','瓶子是 bottle。']],'Lesson22词表')
  ],
  roles:[
   q('story-book','根据完整故事选择指定书本','课文中，男士想要哪一本书？',[
    ['The red one.',''],['The blue one.','男士明确说 The red one.，蓝书不是目标。'],['The green one.','课文没有要求绿书。']
   ],'The red one.','男士说 The red one.。','回到男士说明要求的那一段。','Lesson21读前问题与D04','根据课文而非生活常识选书',{optionImages:{'The red one.':image('red-book'),'The blue one.':image('blue-book'),'The green one.':image('green-book')}}),
   q('story-twice','理解两次确认与不同回答','简两次问 This one?\n男士的回答说明了什么？',[
    ['第一次没有选对，第二次选对了。',''],['两次都选对了。','第一次男士说 No, not that one.。'],['两次都没有选对。','第二次男士回答 Yes, please.。']
   ],'第一次没有选对，第二次选对了。','男士第一次否定，第二次肯定。','分别找出两次 This one? 后面的回答。','Lesson21 D03–D06','相同问句按前后情境判断')
  ],
  observe:[
   q('receive-us','理解 us 包含说话者','几位同学站在一起，其中一位说：\nGive us a book, please.\n接收者是谁？',[
    ['说话的人和他的同伴',''],['只有说话的人','us 不是单独的 me。'],['只有他的同伴','us 包含说话的人，不仅是其他人。']
   ],'说话的人和他的同伴','us 表示我们，包含说话者。','先找出表示接收者的词，再想它与 me 有什么不同。','Lesson22标题 Give us','包含说话者的接收群体'),
   q('receive-her','换接收者时使用合适的人称形式','原来要递给男孩，现在改为递给简（女士）。\n哪句话表达新要求？',[
    ['Give her a cup, please.',''],['Give him a cup, please.','him 仍指男性接收者，没有改变为简。'],['Give she a cup, please.','Give 后表达女性接收者用 her，不用主格 she。']
   ],'Give her a cup, please.','简是女士，作接收者用 her。','接收者换成了谁？再看这个位置需要哪种词形。','Lesson22标题 Give him/her','人称改变与宾语形式一起检查'),
   q('receive-them','从前一句找到 them 的具体指向','These are the children.\nGive them a box, please.\n应该怎样做？',[
    ['把盒子递给孩子们。',''],['把盒子递给说话的人。','them 指前一句的 children，不是 me。'],['把书递给孩子们。','接收者对了，但 box 不是书。']
   ],'把盒子递给孩子们。','them 指前一句的 children，box 是盒子。','先找 them 前面提到谁，再核对要递什么。','Lesson22标题 Give them；新情境','跨句回指与物品信息合并')
  ],
  be:[
   q('owner-our','物主词随说话视角改变','两位同学一起回答：\n“Are these your pens?”\n“No, they’re not. ___ pens are blue.”\n空格填什么？',[
    ['Our',''],['Their','他们自己回答，应表示我们的，不是别人的。'],['His','His 表示他的，不符合两个人说我们的。']
   ],'Our','两人一起说自己的笔，用 Our pens。','是谁在回答？他们说的是自己共同的物品吗？','Lesson22 Written A2','your 可单可复，此处明确共同回答'),
   q('article-empty','冠词由紧随词的起始音决定','Give me ___ empty glass, please.\n空格填什么？',[
    ['an',''],['a','紧随词 empty 以元音开头，不能只看后面的 glass。'],['are','这里需要冠词，不是 be 动词。']
   ],'an','empty 以元音开头，所以用 an empty glass。','看空格后面紧挨着的词，想想它的起始音。','Lesson22 empty；已学a/an规则','形容词插入后的冠词搭配')
  ],
  trans:[
   q('build-give','组织接收者和带属性的物品','请给她一个干净的杯子。',undefined,'Give her a clean cup, please.','Give 后先说接收者，再说物品。','先说动作，再说给谁和什么物品。','Lesson21祈使句与Lesson22标题','祈使句含接收者与属性',{type:'order',tokens:['Give','her','a','clean cup,','please.']}),
   q('build-which','组织省略名词的确认问句','哪一个？这个蓝色的吗？',undefined,'Which one? This blue one?','one 在这里代替前面提到的一件物品。','分成两个问句，留意问号的位置。','Lesson22 Written B例题','Which one 与属性确认，不机械重写名词',{type:'order',tokens:['Which','one?','This','blue','one?']}),
   q('build-correct','先否定当前选项，再说明另一件','不，不是这个空的。那个满的。',undefined,'No, not this empty one. That full one.','先否定 this empty one，再选 that full one。','先把不要的这一件说完，再说明要的那一件；留意句号。','Lesson22 Written B2','this与that分属两件，不照抄课文not that',{type:'order',tokens:['No,','not','this','empty','one.','That','full','one.']})
  ],
  exam:[
   q('exam-delivery','合并接收者、种类与属性','新的小委托：\nGive me a bottle, please.\nWhich one? The small one.\n应该怎样做？',[
    ['把小瓶子递给说话的人。',''],['把大瓶子递给说话的人。','接收者正确，但 small 不是大。'],['把小瓶子递给其他孩子。','me 是说话的人，不是其他孩子。']
   ],'把小瓶子递给说话的人。','me 指说话的人；bottle 是瓶子；small 说明要小的。','分别核对给谁、什么物品、哪种样子。','Lesson21–22结构；新委托','综合三个条件，不能按单个词行动'),
   q('exam-clarify','条件不足时继续确认','两只杯子的资料：\nA: large, empty\nB: large, full\n客人说：The large one.\n现在能确定要哪只吗？',[
    ['还要确认要空的还是满的。',''],['A，空的那只。','两只都是大的，客人没有说要空的。'],['B，满的那只。','两只都是大的，客人没有说要满的。']
   ],'还要确认要空的还是满的。','两个都符合 large，还需要另一个条件。','现有要求能不能只选出一件？','Lesson22 Which one结构；新资料','信息不足时澄清，不任意猜唯一答案')
  ]
 };
 const previousQuestions={exam:questions.exam.slice()};
 const activityPredecessors={exam:['exam']};
 // Coverage-driven additions; keep the two prior questions unchanged for migration.
 questions.exam.push(
  q("final-v2-one","one回指单数物品","Give me a spoon.\nWhich one?\n这里 one 代替什么？",[["spoon", ""], ["book", "这次请求的是 spoon，不要套用课文物品。"], ["Jane", "正在挑物品，没有挑人物。"]],"spoon","本题核对：one回指单数物品。","回看这次请求要什么。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查one回指单数物品",{}),
  q("final-v2-which","确认物品而非所有者","桌上有两个盒子。对方只说：Give me a box.\n你想确认哪一个，应问：",[["Which box?", ""], ["Whose box is it?", "这是问是谁的，不是选哪一个。"], ["What is your job?", "这是问职业。"]],"Which box?","本题核对：确认物品而非所有者。","确认选择和询问归属是两件事。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查确认物品而非所有者",{}),
  q("final-v2-him","明确男性接收者用宾格","Tom 是男孩。请把一把小叉子递给他：\nGive ___ a small fork, please.",[["him", ""], ["he", "Give 后这里需要接收者形式。"], ["his", "his 表示他的，不是这里的接收者。"]],"him","本题核对：明确男性接收者用宾格。","先确定给谁，再想这个位置的词形。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查明确男性接收者用宾格",{}),
  q("final-v2-her","her的宾语与物主用法","Give her a book. / her book\n两处 her 的作用依次是什么？",[["接收者“她” · “她的”", ""], ["“她的” · 接收者“她”", "两处作用颠倒。"], ["两处都表示“她的”", "第一处在 Give 后作接收者。"]],"接收者“她” · “她的”","本题核对：her的宾语与物主用法。","看后面是否直接带着物品名。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查her的宾语与物主用法",{}),
  q("final-v2-owners","根据说话者判断物主词","两位孩子说：Our books are blue.\n你把这条信息转告 Jane：___ books are blue.",[["Their", ""], ["Our", "现在是你介绍其他孩子，不包含你。"], ["His", "介绍的是两位孩子，不是一个男孩。"]],"Their","本题核对：根据说话者判断物主词。","换了说话的人，物品主人有没有改变？","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查根据说话者判断物主词",{}),
  q("final-v2-article","an由紧随词首音决定","选择写对的一组：",[["an empty glass · a full glass", ""], ["a empty glass · a full glass", "empty 起始为元音音素。"], ["an empty glass · an full glass", "full 起始为辅音音素。"]],"an empty glass · a full glass","本题核对：an由紧随词首音决定。","每处都看冠词后紧接的词。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查an由紧随词首音决定",{}),
  q("final-v2-give-us","独立组织带属性的请求","请给我们一个小盒子。",undefined,"Give us a little box, please.","本题核对：独立组织带属性的请求。","动作后先说接收者，再说哪件物品。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查独立组织带属性的请求",{"type": "order", "tokens": ["Give", "us", "a", "little box,", "please."]}),
  q("final-v2-correction","否定当前物品并选择另一件","Jane 举着大瓶子。你要旁边的小瓶子，应该说：",[["No, not this large one. That small one.", ""], ["Yes, please.", "这是接受当前的大瓶子。"], ["No, not this small one. That large one.", "把要的和不要的反了。"]],"No, not this large one. That small one.","本题核对：否定当前物品并选择另一件。","先核对当前拿着的，再核对希望换成的。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查否定当前物品并选择另一件",{}),
 );
 // Preserve the exact previous activity for valid, unchanged answers only.
 const taskPredecessors={listen:[{key:'unit2122-listen-practice/v1',questions:questions.listen.slice()}]};
 const match=(id,prompt,pairs)=>({id:'u2122-v3-'+id,type:'match',target:'辨认 '+pairs.map(row=>row[1]).join('、')+' 的词义',prompt,pairs:pairs.map(([id,en,cn])=>({id,en,cn})),answer:JSON.stringify(pairs.map(row=>row[0])),hint:'',source:source+'；Lesson22词表',decision:'三对词义辨认，替换三道孤立单选；不代表独立回忆'});
 const oldVocabulary=questions.listen;
 questions.listen=[...oldVocabulary.slice(0,6),
  match('containers','给容器配对',[['box','box','盒子；箱子'],['bottle','bottle','瓶子'],['tin','tin','罐头盒']]),
  oldVocabulary[7],oldVocabulary[8],
  match('utensils','给餐具配对',[['knife','knife','刀子'],['fork','fork','叉子'],['spoon','spoon','勺子']])];
 taskPredecessors.roles=[{key:'unit2122-roles-practice/v1',questions:questions.roles.slice()}];
 taskPredecessors.exam=[{key:'unit2122-exam-practice/v2',questions:questions.exam.slice()},{key:'unit2122-exam-practice/v1',questions:previousQuestions.exam}];
 const locate=(id,target,prompt,fragments,answer,speaker)=>({id:'u2122-v3-'+id,type:'locate',target,prompt,fragments,options:fragments.filter(p=>typeof p!=='string').map(p=>p.value),answer,speaker,hint:'',source:source+'；Lesson21原文／Lesson22 one 的替换语境',decision:'从可读原句定位含义；不按图片或中文直接选物'});
 questions.roles[0]=locate('story-book','在原文找到男士指定的物品','男士要哪一本？点出原文中的词组。',[{value:'No'},', ',{value:'not that one'},'. ',{value:'The red one'},'.'],'The red one',{...PEOPLE.man,image:image('man-waiting')});
 questions.exam[2]=locate('one-reference','one 回指前句中的物品','one 指哪种物品？点出前一句中的词。',[{value:'Give'},' ',{value:'me'},' a ',{value:'spoon'},'.\nWhich one?'],'spoon');
 taskPredecessors.observe=[{key:'unit2122-observe-practice/v1',questions:questions.observe.slice()}];
 const recipient=(id,name,images)=>({id,name,images});
 const jane=recipient('jane',PEOPLE.jane.name,[PEOPLE.jane.image]),man=recipient('man',PEOPLE.man.name,[image('man-waiting')]);
 const parcel=(id,name)=>({id,name,image:image(id)});
 const handoff=(id,target,request,objects,recipients,answer,speaker)=>({id:'u2122-v3-'+id,type:'handoff',target,prompt:'读一读，完成交接。',request,objects,recipients,answer:JSON.stringify(answer),speaker,hint:'先找出接收者，再核对物品和样子。',source:source+'；Lesson22 Give与接收者的迁移情境',decision:'同时理解物品与指代；选好后检查，答对才交接'});
 questions.observe[2]=handoff('receive-them','理解 them 指向前句中的两个人','This is Jane. This is the man.\nGive them a box, please.',[parcel('book','书'),parcel('box','盒子'),parcel('cup','杯子')],[jane,recipient('both','简和男士',[PEOPLE.jane.image,image('man-waiting')]),man],['box','both']);
 questions.exam[0]=handoff('delivery','合并接收者、种类与属性','Give me a bottle, please.\nThe small one.',[parcel('large-bottle','大瓶子'),parcel('small-fork','小叉子'),parcel('small-bottle','小瓶子')],[man,jane],['small-bottle','jane'],PEOPLE.jane);
 const stages=[
  {id:'l1',title:'先认识物品',activities:[['words','寻物小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'帮简找对书',activities:[['text','找书小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
  {id:'l3',title:'看清递给谁',activities:[['phrases','交接小锦囊','speech'],['observe','交接小帮手','question']],required:['observe']},
  {id:'l4',title:'把要求说清楚',activities:[['models','物品对比册','cards'],['be','句子小帮手','cards'],['trans','词块拼装台','order']],required:['be','trans']},
  {id:'l5',title:'完成小委托',activities:[['exam','交接小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
 ];
 const definition={id:'unit21-22',version:1,title:'寻物交接站',path:'/unit21-22/',start:'learn/words',progress:{learningKey:'canran:unit21-22:learning:v1'},objects:WORDS,stages,questions,previousQuestions,activityPredecessors,taskPredecessors,
  learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,MODELS,MODEL_EXAMPLE,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK}};
 root.CanranCore.unit2122=definition;
 if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);

// Five-zone edition. The unchanged predecessor remains the migration source.
(function(core){
'use strict';
const old=core.unit2122;core.unit2122LegacyDefinition=JSON.parse(JSON.stringify(old));
const source='课本纸42–45／PDF75–78；语法练习册纸55–59／PDF69–73';
const grammarSource='同步导学纸41–42／PDF55–56，Grammar纸42／PDF56；'+source;
const unit={id:'unit21-22',version:1,mode:'classroom',contentRevision:'books-five-zones-v1',legacyEdition:'unit21-22-completion-v1',title:'寻物交接站',path:'/unit21-22/',start:'learn/words',progress:old.progress,learning:{...old.learning},objects:old.objects,questions:{},
stages:[{id:'l1',title:'先认识物品',activities:[['words','寻物小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},{id:'l2',title:'帮简找对书',activities:[['text','找书小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},{id:'l3',title:'看清递给谁',activities:[['grammar','语法小工坊','speech']],required:['grammar']},{id:'l4',title:'把要求说清楚',activities:[['apply','交接小帮手','heart']],required:['apply']},{id:'l5',title:'完成小委托',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}],
routeAliases:{'learn/phrases':'learn/grammar','learn/observe':'learn/apply','learn/be':'learn/grammar','learn/models':'learn/apply','learn/trans':'learn/apply'},
reward:{edition:'books-five-zones-v1',title:'细心交接小达人',lesson:'Lesson 21–22',scene:'/assets/unit21-22/keepsake-story-v1.webp',alt:'男士拿着刚接过的红书，简双手空着，两人相视微笑',color:'#735789',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','交接小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
const choice=(options,answer,material='')=>({options,answer,material});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers,material='')=>({type:'cloze',blanks,answer:JSON.stringify(answers),material});
const words=(tokens,slots,answer,material='')=>({type:'wordbank',language:'en',tokens,slots,answer,material});
const q=(id,target,prompt,input,explanation)=>{const{material,...fields}=input;return{id:'u2122-five-'+id,target,prompt,source,...fields,...(material?{display:{title:prompt,material}}:{}),explanation,hint:''};};
const g=(id,target,prompt,input,rule,demo)=>({...q('g-'+id,target,prompt,input,rule),source:grammarSource,workshop:{rule,...(demo?{model:{lines:demo}}:{})}});
unit.learning.WORDS=unit.objects;
unit.questions.listen=old.questions.listen;unit.questions.roles=old.questions.roles;
unit.questions.grammar=[
g('me','分清I作主语与me作接收者','Ben想请Jane把书递给自己，空格选什么？',choice(['me','I','my'],'me','Ben说：Give ___ a book, please.\nBen是说这句话的人。'),'这里“我”是接收者，用me。I用来作主语，my后面接名词表示“我的”。',[['I am Anna. Give me a cup, please.','I说明谁在说话；me表示请把杯子递给我。']]),
g('him-her','根据明确的人物选择him与her','分别把物品递给Ben和Anna。',fill([blank('Give ',' a box, please.',['him','he','his']),blank('Give ',' a cup, please.',['her','she','his'])],['him','her'],'第一句：Ben是男士，接收盒子。\n第二句：Anna是女士，接收杯子。'),'本题明确Ben为男士、Anna为女士，作接收者分别用him、her；不能从职业猜人称。',[['He is Tom. Give him a book.','把书递给他，he变成him。'],['She is Jane. Give her a book.','把书递给她，she变成her。']]),
g('us-them','区分包含说话者和其他接收群体','按每句说话人的情况补好请求。',fill([blank('Give ',' a book, please.',['us','them','we']),blank('Give ',' a box, please.',['them','us','they'])],['us','them'],'第一句：我和Ben共同要一本书，我向Jane提出请求。\n第二句：我请Jane把盒子给另外两位孩子，接收者不包含我。'),'us是“我们”，包含说话者；them在这里指另外两位孩子。二者都可在Give后作接收者。',[['We are here. Give us a cup.','我们自己提出请求，用us。'],['They are here. Give them a cup.','说的是前面提到的其他人，用them。']]),
g('you-it','认识you与it的宾格同形','按括号里的所指对象补好句子。',fill([blank('I see ','.',['you','your']),blank('Look at ','.',['it','its'])],['you','it'],'第一句：我看见你。see：看见。\n第二句：看看它，it指刚提到的一本书。'),'you和it作宾语时仍是you、it；your和its表示所属，后面通常还要接物品名。',[['You are here. I see you.','同一个you既可作主语，也可作宾语。'],['It is a book. Look at it.','同一个it指这本书，Look at是“看看”。']]),
g('give-order','组织Give加接收者和物品','按“Give＋人＋物”的顺序，请把书递给她。',words(['Give','her','the book,','please.','she'],4,'Give her the book, please.'),'这里按指定顺序先说接收者her，再说the book。Give the book to her.也是合法表达，本题练另一种顺序。',[['Give him the cup, please.','先说递给谁，再说递什么。']]),
g('which-question','在明确范围里用which询问选择','眼前有红、蓝两本书，用Which开头问对方想要哪本。',words(['Which','book','do','you','want?','Whose'],5,'Which book do you want?','want：想要。这里只问选哪本，不询问主人是谁。'),'Which book do you want?询问限定范围里的选择；which可和单数或复数名词一起使用。',[['Which cup do you want? The full one.','眼前有两只杯子，询问想要哪一只。']]),
g('one-ones','按代替对象的数量选择one与ones','不重复物品名称，补好这两份回答。',fill([blank('The red ','.',['one','ones']),blank('The blue ','.',['one','ones'])],['one','ones'],'第一份请求：Give me a book. 要一本红书。\n第二份请求：Give us two cups. 要两只蓝杯子。'),'one替代一个可数物品，ones替代多个；不是看颜色词决定数量。',[['Which shirt? The new one.','用one代替一件shirt。'],['Which shirts? The new ones.','用ones代替多件shirts。']]),
g('receiver-owner','分清接收者him与物主his','Ben接收自己的书，把句子补完整。',fill([blank('Give ','',['him','he','his']),blank('',' book, please.',['his','him','he'])],['him','his'],'Ben是男士；这本书属于Ben。两个空共同组成一句话。'),'Give him his book, please.第一个词him说给谁，第二个his说明书是谁的。',[['Give her her cup, please.','第一个her指接收者她，第二个her表示她的。']]),
...old.questions.be
];
unit.questions.apply=[...old.questions.observe,...old.questions.trans,
q('a-which-plural','撤去示范组织复数选择问句','眼前有几只杯子，请问对方想要哪几只。',words(['Which','cups','do','you','want?','cup'],5,'Which cups do you want?','用Which开头；want表示想要。'),'想选择几只杯子，用复数cups；问句是Which cups do you want?。')];
unit.questions.exam=[...old.questions.exam,
q('e-first-person','独立区分I与me','Anna正在介绍自己并向Jane请求一只杯子。',fill([blank('',' am Anna.',['I','me','my']),blank('Give ',' a cup, please.',['me','I','my'])],['I','me']),'自我介绍用I作主语；请求递给自己用me作接收者。'),
q('e-groups','独立核对us与them的范围','两份委托分别交给谁？补好英文。',fill([blank('Give ',' two books, please.',['us','them','we']),blank('Give ',' a bottle, please.',['them','us','they'])],['us','them'],'第一句由Jane代表自己和男士提出请求，书给他们两人。\n第二句由Jane提出请求，瓶子给另外两位孩子。'),'第一句包含说话的Jane，用us；第二句说另外两位孩子，用them。'),
q('e-same-forms','独立使用you与it作宾语','补好两条简短的话。',fill([blank('I see ','.',['you','your']),blank('Look at ','.',['it','its'])],['you','it'],'第一句说“我看见你”，see表示看见。\n第二句说“看看它”，所指是一只刚提到的杯子。'),'you与it作宾语仍用原形，不能换成表示所属的your或its。'),
q('e-one-ones','独立根据新的数量使用one与ones','两份清单分别要一只盒子和两把勺子，补好回复。',fill([blank('The small ','.',['one','ones']),blank('The new ','.',['one','ones'])],['one','ones'],'第一份：一只小盒子。第二份：两把新勺子。'),'一只盒子用one；两把勺子用ones。'),
q('e-which-plural','独立组织which复数问句','书架上有几本书，问对方想要哪几本。',words(['Which','books','do','you','want?','book','Whose'],5,'Which books do you want?','want：想要。这里只询问选择。'),'问哪几本书，用Which books do you want?，不是询问归属。'),
q('e-object-owner','独立区分them与their','两位孩子接收自己的书，把一句话补完整。',fill([blank('Give ','',['them','they','their']),blank('',' books, please.',['their','them','they'])],['them','their'],'这两位孩子是接收者，书也属于这两位孩子。'),'them说明递给谁；their books说明他们的书。两个词承担不同作用。')];
unit.taskSessions=Object.fromEntries(unit.reward.zones.map(z=>[z.id,'five-zones-v1']));
const previous={listen:['listen'],roles:['roles'],grammar:['be'],apply:['observe','trans'],exam:['exam']};
unit.taskPredecessors=Object.fromEntries(Object.entries(previous).map(([id,priorIds])=>[id,priorIds.flatMap(prior=>[{key:'unit2122-'+prior+'-practice/'+(old.taskSessions?.[prior]||(old.taskPredecessors?.[prior]?'v3':old.activityPredecessors?.[prior]?'v2':'v'+old.version)),questions:old.questions[prior]},...(old.taskPredecessors?.[prior]||[])])]));
core.unit2122=unit;if(globalThis.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis.CanranCore);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit2122,excerpts={"u2122-v1-story-twice":[0,1,2,3,4,5,6,7]},speakers={"man":"男士","jane":"简（Jane）"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 21',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
