(function(root){
 'use strict';
 const image=name=>'/assets/unit25-26/'+name.replaceAll(' ','-').replaceAll('.','')+'.svg';
 const source='《新概念英语智慧版1》纸页50–53（PDF83–86）';
 const WORDS=[
  ['Mrs.','本课称呼：太太','/ˈmɪsɪz/','Mrs. Smith'],['kitchen','厨房','/ˈkɪtʃən/'],['refrigerator','冰箱','/rɪˈfrɪdʒəreɪt̬ɚ/'],['electric','用电的','/ɪˈlektrɪk/','electric cooker'],['cooker','炉灶；炊具','/ˈkʊkɚ/'],['electric cooker','电炉','/ɪˈlektrɪk ˈkʊkɚ/'],
  ['right','本课：右边','/raɪt/','on the right'],['left','本课：左边','/left/','on the left'],['middle','中间','/ˈmɪdəl/','in the middle'],['of','本课：……的','/ɑːv/','the middle of the room'],['room','房间','/ruːm/'],['where','在哪里','/wer/','Where is it?'],
  ['in','在……里面','/ɪn/','in the cupboard'],['there','本句用来介绍“有”','/ðer/','There is a cup.'],['a','一个（不特指）','/eɪ/','a cooker'],['an','一个（不特指）','/æn/','an electric cooker'],['the','指明确的人或物','/ðiː/','The cup is clean.'],['on','本课：在……上面','/ɑːn/','on the table'],
  ['cup','杯子','/kʌp/'],['box','盒子','/bɑːks/'],['glass','玻璃杯','/ɡlæs/'],['knife','刀','/naɪf/'],['fork','叉子','/fɔːrk/'],['tin','罐头；罐子','/tɪn/'],
  ['bottle','瓶子','/ˈbɑːt̬əl/'],['pencil','铅笔','/ˈpensəl/'],['spoon','勺子','/spuːn/'],['table','桌子','/ˈteɪbəl/'],['empty','空的','/ˈempti/'],['full','满的','/fʊl/'],
  ['clean','干净的','/kliːn/'],['dirty','脏的','/ˈdɝːt̬i/'],['large','大的','/lɑːrdʒ/'],['sharp','锋利的','/ʃɑːrp/'],['blunt','钝的','/blʌnt/'],['small','小的','/smɑːl/']
 ].map(([en,cn,ph,example=''])=>({en,cn,ph,example,image:image(en),source}));
 const PEOPLE={Mrs:{name:'史密斯太太',image:image('Mrs.')}};
 // Lesson 25 is a narration, not an exchange between invented speakers.
 const DIALOGUE=[
  ["Mrs. Smith's kitchen is small.",'史密斯太太的厨房很小。'],['There is a refrigerator in the kitchen.','厨房里有一台冰箱。'],['The refrigerator is white.','冰箱是白色的。'],['It is on the right.','它在右边。'],
  ['There is an electric cooker in the kitchen.','厨房里有一台电炉。'],['The cooker is blue.','电炉是蓝色的。'],['It is on the left.','它在左边。'],['There is a table in the middle of the room.','房间的中间有一张桌子。'],
  ['There is a bottle on the table.','桌子上有一个瓶子。'],['The bottle is empty.','瓶子是空的。'],['There is a cup on the table, too.','桌子上还有一个杯子。'],['The cup is clean.','杯子很干净。']
 ].map(([text,cn],i)=>({id:'L25-N'+String(i+1).padStart(2,'0'),person:'narrator',who:'narration',text,cn,source:source+'；Lesson25原文'}));
 const PHRASES=[
  ['There is a refrigerator in the kitchen.','介绍厨房里有一台冰箱。','refrigerator'],["There's a refrigerator in the kitchen.",'There is 可以缩写为 There’s。','refrigerator'],['The refrigerator is white.','接着说同一台冰箱。','refrigerator'],['It is on the right.','It 也指这台冰箱。','right'],['Where is it?','它在哪里？','where'],['It is in the cupboard.','它在橱柜里面。','in']
 ].map(([en,cn,picture])=>({en,cn,image:image(picture),source:source+'；原文与句型支架'}));
 const PLACES=[
  ['cup','on','table','clean','干净的杯子在桌上','3000'],['box','on','floor','large','大盒子在地板上','4000'],['glass','in','cupboard','empty','空玻璃杯在橱柜里','5000'],['knife','on','plate','sharp','锋利的刀在盘子上','6000'],
  ['fork','on','tin','dirty','脏叉子在罐头上','7000'],['bottle','in','refrigerator','full','满瓶子在冰箱里','8000'],['pencil','on','desk','blunt','钝铅笔在书桌上','9000'],['spoon','in','cup','small','小勺子在杯子里','10000']
 ];
 const GALLERY=PLACES.map(([subject,prep,place,adjective,cn,number])=>({en:`There is a ${subject} ${prep} the ${place}.\nThe ${subject} is ${adjective}.`,cn,image:image(subject+'-'+place),source:source+'；Lesson26图'+number}));
 const model=(subject,prep,place,adjective)=>({subject,prep,place,adjective,en:`There's a ${subject} ${prep} the ${place}.\nThe ${subject} is ${adjective}.`,cn:'',image:image(subject+'-'+place),source:source+'；Lesson26 Written B'});
 const MODEL_EXAMPLE=model('refrigerator','in','kitchen','white');
 // Written B has seven groups; the spoon belongs only to the picture practice.
 const MODELS=PLACES.slice(0,7).map(([s,p,l,a])=>model(s,p,l,a));
 const REFERENCE=[
  ['Give me ___ glass. Which glass? ___ empty one.',['a','The']],['Give me some cups. Which cups? ___ cups on the table.',['The']],
  ['Is there ___ book on ___ table? Yes, there is. Is ___ book red?',['a','the','the']],['Is there ___ knife in that box? Yes, there is. Is ___ knife sharp?',['a','the']]
 ].map(([prompt,answers])=>{let i=0;return{prompt,answers,en:prompt.replace(/___/g,()=>answers[i++]),source:source+'；Lesson26 Written A'};});
 const q=(id,target,prompt,options,answer,explanation,hint,basis,decision,extra={})=>({id:'u2526-v1-'+id,target,prompt,options:options?.map(o=>o[0]),answer,explanation,hint,source:source+'；'+basis,decision,distractorReasons:options?Object.fromEntries(options.filter(o=>o[0]!==answer)):undefined,...extra});
 const vocab=(id,prompt,answer,wrong,basis,extra={})=>q('vocab-'+id,'理解 '+id+' 的本课含义',prompt,[[answer,''],...wrong],answer,'这里表示“'+answer+'”。','',basis,'新词各一次，必要的语境帮助确定词义',{presentation:'vocabulary',...extra});
 const questions={
  listen:[
   vocab('Mrs','Mrs. Smith\n这里的 Mrs. 怎么称呼？','太太',[['先生','本课 Mr. 才是先生。'],['小姐','Mrs. 不是本课 Miss 的称呼。'],['妈妈','Mrs. 是称呼，不表示亲子关系。']],'Lesson25词表'),
   vocab('kitchen','kitchen\n选出这个词的意思。','厨房',[['卧室','卧室是 bedroom。'],['客厅','客厅是 living room。'],['浴室','浴室是 bathroom。']],'Lesson25词表'),
   vocab('refrigerator','看看图，选出英文。','refrigerator',[['cooker','图中是有冷藏隔层的冰箱，不是炉灶。'],['cupboard','图中有冷藏标志，不是普通橱柜。'],['stereo','stereo 是音响。']],'Lesson25词表',{image:image('refrigerator'),imageAlt:'一台有雪花冷藏标志和上下隔层的冰箱'}),
   vocab('right','on the right\nright 在这里表示什么？','右边',[['左边','left 才是左边。'],['中间','middle 是中间。'],['里面','in 表示在里面。']],'Lesson25 N04'),
   vocab('electric','electric cooker\nelectric 说明什么？','用电的',[['蓝色的','blue 是蓝色的。'],['小的','small 是小的。'],['干净的','clean 是干净的。']],'Lesson25词表与N05'),
   vocab('left','on the left\nleft 在这里表示什么？','左边',[['右边','right 是右边。'],['中间','middle 是中间。'],['里面','in 表示在里面。']],'Lesson25 N07'),
   vocab('cooker','cooker\n本课说的是哪一种？','炉灶；炊具',[['厨师','cook 可以指厨师，cooker 在这里是器具。'],['冰箱','refrigerator 是冰箱。'],['杯子','cup 是杯子。']],'Lesson25词表与注释3'),
   vocab('middle','in the middle\nmiddle 在这里表示什么？','中间',[['左边','left 是左边。'],['右边','right 是右边。'],['上面','on 表示在表面上。']],'Lesson25词表与N08'),
   vocab('of','the middle of the room\nof 在这里表示什么？','……的',[['在里面','整个 in 短语才能说明在里面，of 在此连接所属范围。'],['在上面','不是表面位置。'],['在哪里','where 才是问在哪里。']],'Lesson25词表与N08'),
   vocab('room','room\n选出这个词的意思。','房间',[['橱柜','cupboard 是橱柜。'],['桌子','table 是桌子。'],['冰箱','refrigerator 是冰箱。']],'Lesson25词表'),
   vocab('where','Where is it?\n这句话在问什么？','它在哪里？',[['它是什么颜色？','颜色需要问 colour。'],['它是谁？','不是在问人物身份。'],['它是什么物品？','不是在问物品名称。']],'Lesson26标题与词表'),
   vocab('in','in the cupboard\nin 在这里表示什么？','在……里面',[['在……上面','on 才是本课表面的位置。'],['在……左边','on the left 是在左边。'],['在……右边','on the right 是在右边。']],'Lesson26词表与图5000')
  ],
  roles:[
   q('story-colour','从原文提取电炉的颜色','课文中，电炉是什么颜色？',[
    ['blue',''],['white','白色说的是冰箱。'],['red','原文没有说电炉是红色的。']
   ],'blue','原文说 The cooker is blue.。','回看介绍电炉的几句话。','Lesson25读前问题与N06','读原文获取事实，题面不画出答案'),
   q('story-it','找到原文It回指的物品','课文说：It is on the right.\n这里的 It 指什么？',[
    ['refrigerator',''],['cooker','电炉在另一段介绍，位置是左边。'],['table','桌子在房间中间。']
   ],'refrigerator','这句紧接着介绍冰箱，It 指这台冰箱。','回看这句话前面正在介绍哪件物品。','Lesson25 N02–N04','跨句回指，区别上一题颜色事实')
  ],
  observe:[
   q('introduce','理解存在句的表达作用','There is a refrigerator in the kitchen.\n这句话在做什么？',[
    ['介绍厨房里有一台冰箱。',''],['询问冰箱在哪里。','句子不是问句。'],['请人搬走冰箱。','没有发出搬走的请求。']
   ],'介绍厨房里有一台冰箱。','There is 用来介绍这里有某个物品。','看看这句话是在介绍、提问，还是发出请求。','Lesson25 N02与注释1','从单词理解推进到整句功能'),
   q('articles','根据紧随词发音和同一指向选择冠词','先介绍一台电炉，再说同一台：\nThere is ___ electric cooker in the kitchen.\n___ cooker is blue.\n依次填什么？',[
    ['an · The',''],['a · The','electric 开头是元音音素，用 an。'],['an · A','第二句已明确指前面同一台电炉。']
   ],'an · The','an electric cooker；接着说同一台，用 The cooker。','第一空留意紧随词的发音；第二空想想是否仍在说同一台。','Lesson25 N05–N06与注释1','合并发音条件与明确回指，不按字母死记')
  ],
  be:[
   q('location','根据容器内部位置回答Where问题','Where is the glass?\n看图选择回答。',[
    ['It is in the cupboard.',''],['It is on the cupboard.','图中玻璃杯在柜子内部，不在顶上。'],['It is on the table.','图中没有桌子。']
   ],'It is in the cupboard.','玻璃杯放在柜内，用 in the cupboard。','看看物品是在容器里面，还是放在它的表面。','Lesson26图5000与标题','将in应用于完整位置问答',{image:image('glass-cupboard'),imageAlt:'空玻璃杯放在敞开的橱柜里面'}),
   q('refer-it','用It继续描述同一件物品','There is a bottle in the refrigerator.\n接着说同一个瓶子：\n___ is full.\n空格填什么？',[
    ['It',''],['There','There is full 不能接着描述这个瓶子。'],['They','这里是一个瓶子，不是多个。']
   ],'It','It 回指前面介绍的瓶子。','已经知道是哪件物品；想想怎样代替这一个物品的名字。','Lesson25 It回指与Lesson26图8000','区分介绍存在与接续描述')
  ],
  trans:[
   q('build-existence','组织存在句与表面位置','桌子上有一个杯子。',undefined,'There is a cup on the table.','There is 介绍物品，on the table 说明位置。','先介绍有什么，再说明它在哪里。','Lesson26图3000','撤去整句支架，组织完整式',{type:'order',tokens:['There','is','a','cup','on','the','table.']}),
   q('build-contraction','用缩写形式介绍内部位置',"用 There's 开头介绍：\n冰箱里有一个瓶子。",undefined,"There's a bottle in the refrigerator.",'There is 可以缩写为 There’s；in 表示在冰箱里面。','把介绍物品和说明位置两部分连起来。','Lesson26 Written B6与例题缩写形式','由完整式转为缩写式，位置改为内部',{type:'order',tokens:["There's",'a','bottle','in','the','refrigerator.']}),
   q('build-where','组织询问位置的句子','它在哪里？',undefined,'Where is it?','用 Where is it? 询问它的位置。','先放询问位置的词，再留意问号。','Lesson26标题','不同句型的自主拼装，不重复存在句',{type:'order',tokens:['Where','is','it?']})
  ],
  exam:[
   q('exam-picture','同时满足位置和状态两个信息','There is a glass in the cupboard.\nThe glass is empty.\n哪幅图符合这段介绍？',[
    ['甲图',''],['乙图','位置符合，但玻璃杯是满的。'],['丙图','杯子是空的，但放在橱柜顶上。']
   ],'甲图','空玻璃杯在橱柜里面，两个条件都符合。','分开检查物品在哪里，以及它是什么状态。','Lesson26图5000综合抽样','合并两个条件，不新增一整轮题',{optionImages:{'甲图':image('glass-cupboard'),'乙图':image('full-glass-cupboard'),'丙图':image('glass-on-cupboard')},optionImageAlts:{'甲图':'空玻璃杯在橱柜里面','乙图':'装满液体的玻璃杯在橱柜里面','丙图':'空玻璃杯放在橱柜顶面上'}}),
   q('exam-boundary','区分存在信息与没有表达的限制','There is a cup on the table.\n只根据这句话，哪一项能确定？',[
    ['桌上有杯子。',''],['桌上没有别的东西。','没有说 only，不能推出没有其他东西。'],['杯子很干净。','这句话没提杯子的状态。']
   ],'桌上有杯子。','它说明桌上有杯子，没有说明其他东西或杯子的状态。','只保留这句话明确说出的信息，不额外猜测。','Lesson25–26存在句；信息边界','理解有不等于只有，避免过度推断')
  ]
 };
 const previousQuestions={exam:questions.exam.slice()};
 const activityPredecessors={exam:['exam']};
 // Coverage-driven additions; keep the two prior questions unchanged for migration.
 questions.exam.push(
  q("final-v2-room","提取厨房里三个位置","根据课文，电炉、冰箱、桌子分别在哪里？",[["左边 · 右边 · 中间", ""], ["右边 · 左边 · 中间", "电炉与冰箱的位置反了。"], ["左边 · 中间 · 右边", "冰箱与桌子的位置反了。"]],"左边 · 右边 · 中间","本题核对：提取厨房里三个位置。","按题目物品顺序回看原文，不按提及先后排。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查提取厨房里三个位置",{}),
  q("final-v2-states","区分两个物品状态","课文的桌子上，什么是 empty，什么是 clean？",[["bottle · cup", ""], ["cup · bottle", "瓶子空，杯子干净，不能交换。"], ["table · bottle", "课文不是说桌子空。"]],"bottle · cup","本题核对：区分两个物品状态。","每个形容词前面正在介绍什么？","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查区分两个物品状态",{}),
  q("final-v2-it","区分存在介绍和接续指代","There is an electric cooker in the room.\n___ is blue.\n继续介绍同一台电炉，应填：",[["It", ""], ["There", "There is blue 不能这样接着描述。"], ["They", "是一台电炉，不是多个。"]],"It","本题核对：区分存在介绍和接续指代。","这句是在引入新物品，还是说刚才那一台？","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查区分存在介绍和接续指代",{}),
  q("final-v2-articles","首次引入与明确回指","There is ___ electric cooker.\n___ cooker is blue.",[["an · The", ""], ["a · The", "electric 开头是元音音素。"], ["an · A", "第二句明确说同一台，用 The。"]],"an · The","本题核对：首次引入与明确回指。","第一处看发音，第二处看是否同一个物品。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查首次引入与明确回指",{}),
  q("final-v2-where","自主询问单件物品位置","想知道那个瓶子在哪儿，把问句拼出来。",undefined,"Where is the bottle?","本题核对：自主询问单件物品位置。","先放询问位置的词，瓶子只有一个。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查自主询问单件物品位置",{"type": "order", "tokens": ["Where", "is", "the", "bottle?"]}),
  q("final-v2-inside","区分on与in完整位置描述","看图选择完整介绍。",[["There is a bottle in the refrigerator.", ""], ["There is a bottle on the refrigerator.", "瓶子在内部，不在顶面。"], ["There are some bottles in the refrigerator.", "图中只有一个瓶子。"]],"There is a bottle in the refrigerator.","本题核对：区分on与in完整位置描述。","同时看里面还是表面，以及数量。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查区分on与in完整位置描述",{"image": "/assets/unit25-26/bottle-refrigerator.svg", "imageAlt": "一个满瓶子在敞开的冰箱里"}),
  q("final-v2-contraction","There is缩写并接续描述","只把 There is 缩写，其他内容保持不变：\nThere is a clean cup on the table.\n哪句正确？",[["There's a clean cup on the table.", ""], ["They're a clean cup on the table.", "They are 不是 There is。"], ["It's a clean cup on the table.", "没有保持原句介绍“有”的结构。"]],"There's a clean cup on the table.","本题核对：There is缩写并接续描述。","只缩写 There is，不换掉句子的作用。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查There is缩写并接续描述",{}),
 );
 const stages=[
  {id:'l1',title:'先认识厨房',activities:[['words','厨房小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'走进史密斯家',activities:[['text','厨房小导览','book'],['roles','课文小侦探','people']],required:['text','roles']},
  {id:'l3',title:'介绍新发现',activities:[['phrases','介绍小锦囊','speech'],['observe','发现小帮手','question']],required:['observe']},
  {id:'l4',title:'说清物品位置',activities:[['models','厨房陈列册','cards'],['be','位置小帮手','cards'],['trans','词块拼装台','order']],required:['be','trans']},
  {id:'l5',title:'我的厨房导览',activities:[['exam','厨房小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
 ];
 const definition={id:'unit25-26',version:1,title:'厨房探访记',path:'/unit25-26/',start:'learn/words',progress:{learningKey:'canran:unit25-26:learning:v1'},objects:WORDS,stages,questions,previousQuestions,activityPredecessors,
  learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,MODELS,MODEL_EXAMPLE,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK}};
 root.CanranCore.unit2526=definition;
 if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);

// Task edition v4: exact prior rounds are evidence for unchanged questions only.
(function(core){
 const unit=core.unit2526;
 const revised={"listen":[unit.questions["listen"][0],
unit.questions["listen"][1],
unit.questions["listen"][2],
{
  "id": "u2526-tasks-v4-positions",
  "target": "识别三个完整位置短语",
  "prompt": "给位置词组配对。",
  "decision": "按房间正面观察，不把人物左右视角混用；保留 in/on 的关系辨别。",
  "hint": "",
  "source": "Lesson 25 on the left/right 与 in the middle 词组",
  "type": "match",
  "pairs": [
    {
      "id": "1",
      "en": "on the left",
      "cn": "在左边"
    },
    {
      "id": "2",
      "en": "on the right",
      "cn": "在右边"
    },
    {
      "id": "3",
      "en": "in the middle",
      "cn": "在中间"
    }
  ],
  "answer": "[\"1\",\"2\",\"3\"]",
  "distractorRationale": "三个位置词组保持介词与冠词完整，判断以面对房间的观看方向为准，不混入人物的左右视角。"
},
unit.questions["listen"][4],
unit.questions["listen"][6],
unit.questions["listen"][8],
unit.questions["listen"][9],
unit.questions["listen"][10],
unit.questions["listen"][11]],
"observe":[unit.questions["observe"][0],
{
  "id": "u2526-tasks-v4-introduce-articles",
  "target": "首提的 an 与再指的 The",
  "prompt": "先介绍一台电炉，再说同一台。",
  "decision": "第二句同一物品，保留不定冠词按紧随音素判断的实际选择。",
  "hint": "先分清是不是第一次说到它，再看紧跟冠词的词。",
  "source": "Lesson 25 电炉的首次介绍与再次指称",
  "type": "cloze",
  "reference": "",
  "blanks": [
    {
      "before": "There is ",
      "after": " electric cooker in the kitchen.",
      "options": [
        "an",
        "a",
        "the"
      ]
    },
    {
      "before": "",
      "after": " cooker is blue.",
      "options": [
        "The",
        "A",
        "An"
      ]
    }
  ],
  "answer": "[\"an\",\"The\"]",
  "distractorReasons": {
    "an": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "a": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "the": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "The": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "A": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "An": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。"
  },
  "distractorRationale": "初次介绍一个 electric cooker 用 an，electric 为元音音素开头；第二句同一台用 The。a 忽略发音，A/An 再引入不确定对象，the 不符合指定的首提情境。"
}],
"roles":[{
  "id": "u2526-tasks-v4-story-find",
  "target": "依据英文在房间中找到物品",
  "prompt": "读介绍，在房间里点出对应的物品。",
  "decision": "在原有房间中识别物体、属性与位置，移动端独立构图；固定房间位置不是正确答案高亮。",
  "hint": "先按你面对房间的方向找位置，再核对颜色。",
  "source": "Lesson 25 冰箱在右侧且为白色；把原文信息用于同一厨房",
  "type": "scene-find",
  "reference": "It is on the right. It is white.",
  "sceneImage": "/assets/unit25-26/scene.svg",
  "mobileScene": "/assets/unit25-26/task-room-mobile.svg",
  "sceneDescription": "从画面正面看：电炉、桌子与冰箱",
  "spots": [
    {
      "id": "cooker",
      "name": "电炉",
      "bounds": [
        8,
        57,
        17,
        31
      ],
      "mobileBounds": [
        2,
        44,
        28,
        39
      ]
    },
    {
      "id": "table",
      "name": "桌子",
      "bounds": [
        36,
        57,
        29,
        34
      ],
      "mobileBounds": [
        33,
        52,
        40,
        43
      ]
    },
    {
      "id": "fridge",
      "name": "冰箱",
      "bounds": [
        78,
        44,
        15,
        43
      ],
      "mobileBounds": [
        75,
        28,
        24,
        55
      ]
    }
  ],
  "options": [
    "cooker",
    "table",
    "fridge"
  ],
  "answer": "fridge",
  "distractorRationale": "电炉在左且蓝，桌子在中间，只有右侧白色冰箱满足两条线索。所有热点样式相同；不能先高亮冰箱。"
},
unit.questions["roles"][1]]};
 unit.taskPredecessors ||= {}; unit.taskSessions ||= {};
 for(const [id,items] of Object.entries(revised)){
  const priorKey='unit2526-'+id+'-practice/'+(unit.taskSessions[id]||(unit.taskPredecessors[id]?'v3':unit.activityPredecessors?.[id]?'v2':'v'+unit.version));
  const sources=[{key:priorKey,questions:unit.questions[id]},...(unit.taskPredecessors[id]||[]),...(unit.activityPredecessors?.[id]||[]).map(old=>({key:'unit2526-'+old+'-practice/v1',questions:unit.previousQuestions[old]}))];
  unit.taskPredecessors[id]=sources; unit.taskSessions[id]='tasks-v4'; unit.questions[id]=items;
 }
})(globalThis.CanranCore);

// Thirteen text-supported exercise families, using the reviewed lesson draft.
(function(core){
 'use strict';
 const unit=core.unit2526,old=unit.questions,all=Object.values(old).flat(),find=id=>all.find(q=>q.id===id),image=name=>'/assets/unit25-26/'+name+'.svg';
 const make=(code,type,target,prompt,extra)=>({id:'u2526-types-v1-'+code,type,target,prompt,hint:'',source:'Lesson 25–26；2026-10-06 十三项题型试排 '+code,...extra});
 const choice=(code,target,prompt,options,answer,extra={})=>make(code,'choice',target,prompt,{options,answer,...extra});
 const articles=code=>make(code,'cloze','区别首次介绍与明确回指','先介绍一台电炉，再说同一台。',{blanks:[{before:'There is ',after:' electric cooker.',options:['an','a']},{before:'',after:' cooker is blue.',options:['The','A']}],answer:'["an","The"]'});
 const revised={
  listen:[find('u2526-tasks-v4-positions'),choice('t02','识别冰箱','看看图，选出英文。',['refrigerator','cooker','cupboard'],'refrigerator',{image:image('refrigerator'),imageAlt:'有上下隔层和冷藏标志的冰箱'}),choice('t03','理解 kitchen','“厨房”是哪一个词？',['kitchen','room','cupboard'],'kitchen'),...['Mrs','electric','cooker','room'].map(id=>find('u2526-v1-vocab-'+id))],
  roles:[
   make('t05','locate','理解 of the room 的修饰关系','点出表示“房间的”的部分。',{fragments:['There is ',{value:'a table'},' ',{value:'in the middle'},' ',{value:'of the room'},'.'],options:['a table','in the middle','of the room'],answer:'of the room'}),
   choice('t06','整合跨句颜色和位置','电炉是什么颜色？在厨房哪一边？',['蓝色 · 左边','蓝色 · 右边','白色 · 左边'],'蓝色 · 左边',{reading:'There is an electric cooker in the kitchen.\nThe cooker is blue.\nIt is on the left.'}),find('u2526-v1-story-it')
  ],
  observe:[
   make('t04','wordbank','读懂存在与位置','用中文词块说出这句话的意思。',{reading:'There is a bottle on the table.',language:'zh-CN',tokens:['一个瓶子','有','桌子上','桌子里','没有','一个杯子'],slots:3,suffix:'。',answer:'桌子上 有 一个瓶子'}),find('u2526-tasks-v4-introduce-articles')
  ],
  be:[
   make('t08','cloze','结合图片判断内部位置','看看图，补上位置词。',{image:image('spoon-fork-position'),imageAlt:'左图：勺子在杯子里面；右图：叉子放在罐子上面。',blanks:[{before:'There is a spoon ',after:' the cup.',options:['in','on']}],answer:'["in"]'}),
   make('t09','write','在句式支持下拼写 clean','这个杯子是干净的。补上缺少的英文单词。',{before:'The cup is ',after:'.',answer:'clean'}),
   choice('t10','选择回答位置的句子','Where is the glass?',['It is in the cupboard.','It is empty.','It is a glass.'],'It is in the cupboard.',{reading:'The glass is empty.\nIt is in the cupboard.'})
  ],
  trans:[make('t12','wordbank','用缩写介绍表面位置',"用 There's 开头说：罐子上有一把叉子。",{tokens:["There's",'a','fork','on','the','tin'],slots:6,suffix:'.',answer:"There's a fork on the tin"})],
  errands:[
   choice('t11','整合六轮故事中的物品条件与位置','接下来怎么做，才符合甲的要求？',['继续递原来的杯子。','换成橱柜里干净的杯子。','换成橱柜顶上干净的杯子。'],'换成橱柜里干净的杯子。',{readingLabel:'找杯子的小故事',reading:[['甲','Give me a cup, please.'],['乙','This one?'],['甲','No, not that one. The clean one.'],['乙','Where is it?'],['甲','It is in the cupboard.'],['乙','Here you are.']]}),
   choice('t13','通过提问取得缺少的位置信息','朋友想要勺子，你还不知道它在哪儿。先问什么？',['Where is it?','What colour is it?','Is it clean?'],'Where is it?',{scene:{kind:'inquiry',before:'Give me a spoon, please.',after:'It is in the cup.',image:image('spoon-cup')}})
  ],
  exam:old.exam.map((q,i)=>i===5?articles('c06'):i===7?choice('c08','区分内部与表面位置','看图选择完整介绍。',['There is a bottle in the refrigerator.','There is a bottle on the refrigerator.','There is a bottle in the cupboard.'],'There is a bottle in the refrigerator.',{image:image('bottle-refrigerator'),imageAlt:'一个满瓶子在敞开的冰箱里'}):q)
 };
 const predecessors=Object.entries(old).flatMap(([id,items])=>[{key:'unit2526-'+id+'-practice/'+(unit.taskSessions?.[id]||(unit.activityPredecessors?.[id]?'v2':'v'+unit.version)),questions:items},...(unit.taskPredecessors?.[id]||[])]);
 for(const[id,items]of Object.entries(revised)){unit.taskPredecessors[id]=predecessors;unit.taskSessions[id]='types-v1';unit.questions[id]=items;}
 unit.stages[3].activities.push(['errands','厨房小任务','people']);unit.stages[3].required.push('errands');
 unit.typeCoverage={adopted:['E01','E04','E05','E07','E09','E10','E11','E12','E21','E23','S01','S02','A02'],actual:['E01','E04','E05','E07','E09','E10','E11','E12','E21','E23','S01','S02','A02']};
 unit.experienceVersion='classroom-types-1';
})(globalThis.CanranCore);
