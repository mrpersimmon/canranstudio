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
 const stages=[
  {id:'l1',title:'先认识物品',activities:[['words','寻物小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'帮简找对书',activities:[['text','找书小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
  {id:'l3',title:'看清递给谁',activities:[['phrases','交接小锦囊','speech'],['observe','交接小帮手','question']],required:['observe']},
  {id:'l4',title:'把要求说清楚',activities:[['models','物品对比册','cards'],['be','句子小帮手','cards'],['trans','词块拼装台','order']],required:['be','trans']},
  {id:'l5',title:'完成小委托',activities:[['exam','交接小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
 ];
 const definition={id:'unit21-22',version:1,title:'寻物交接站',path:'/unit21-22/',start:'learn/words',progress:{learningKey:'canran:unit21-22:learning:v1'},objects:WORDS,stages,questions,
  learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,MODELS,MODEL_EXAMPLE,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK}};
 root.CanranCore.unit2122=definition;
 if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
