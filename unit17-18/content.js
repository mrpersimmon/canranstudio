(function (root) {
  'use strict';
  const image=name=>'/assets/unit17-18/'+name+'.svg';
  const source='《新概念英语智慧版1》纸页34–37（PDF67–70）';
  const WORDS=[
    ['employee','雇员；员工','/ɪmˈplɔɪiː/'],['hard-working','勤奋的','/ˌhɑːrdˈwɝːkɪŋ/'],
    ['sales rep','销售代表；推销员','/ˈseɪlz ˌrep/'],['man','成年男子；男人','/mæn/'],
    ['office','办公室','/ˈɑːfɪs/'],['assistant','助手','/əˈsɪstənt/'],
    ['office assistant','办公室助手','/ˈɑːfɪs əˈsɪstənt/'],['woman','成年女子；女人','/ˈwʊmən/'],
    ['men','man 的复数：男人们','/men/'],['women','woman 的复数：女人们','/ˈwɪmɪn/'],
    ['those','那些','/ðoʊz/','Those women'],['their','他们的／她们的／它们的','/ðer/','their jobs'],
    ['these','这些','/ðiːz/','These women'],['busy','忙碌的','/ˈbɪzi/'],['lazy','懒惰的；不愿付出努力','/ˈleɪzi/'],
    ['job','工作；职业','/dʒɑːb/'],['keyboard operator','电脑录入员','/ˈkiːbɔːrd ˌɑːpəreɪt̬ɚ/'],
    ['mechanic','机械师；修理机器的人','/məˈkænɪk/'],['engineer','工程师','/ˌendʒɪˈnɪr/'],
    ['hairdresser','理发师','/ˈherˌdresɚ/'],['teacher','教师','/ˈtiːtʃɚ/'],['customs officer','海关官员','/ˈkʌstəmz ˌɑːfɪsɚ/'],
    ['taxi driver','出租车司机','/ˈtæksi ˌdraɪvɚ/'],['nurse','护士','/nɝːs/'],['air hostess','女空乘','/ˈer ˌhoʊstɪs/'],
    ['housewife','家庭主妇','/ˈhaʊswaɪf/'],['milkman','男送奶员','/ˈmɪlkmən/'],['postman','男邮递员','/ˈpoʊstmən/'],
    ['policeman','男警察','/pəˈliːsmən/'],['policewoman','女警察','/pəˈliːsˌwʊmən/']
  ].map(([en,cn,ph,example=''])=>({en,cn,ph,example,image:image(en.replaceAll(' ','-')),source}));
  const PEOPLE={jackson:{name:'Mr. Jackson',image:image('jackson')},richards:{name:'Mr. Richards',image:image('richards')}};
  const DIALOGUE=[
    ['jackson','Come and meet our employees, Mr. Richards.','来见见我们的雇员吧，理查兹先生。'],
    ['richards','Thank you, Mr. Jackson.','谢谢您，杰克逊先生。'],
    ['jackson','This is Nicola Grey, and this is Claire Taylor.','这位是尼古拉·格雷，这位是克莱尔·泰勒。'],
    ['richards','How do you do?','你们好！'],
    ['richards','Those women are very hard-working.','那些女士很勤奋。'],
    ['richards','What are their jobs?','她们是做什么工作的？'],
    ['jackson',"They're keyboard operators.",'她们是电脑录入员。'],
    ['jackson','This is Michael Baker, and this is Jeremy Short.','这位是迈克尔·贝克，这位是杰里米·肖特。'],
    ['richards','How do you do?','你们好！'],
    ['richards',"They aren't very busy!",'他们不很忙！'],
    ['richards','What are their jobs?','他们是做什么工作的？'],
    ['jackson',"They're sales reps.",'他们是推销员。'],
    ['jackson',"They're very lazy.",'他们很懒。'],
    ['richards','Who is this young man?','这位年轻人是谁？'],
    ['jackson','This is Jim.','这位是吉姆。'],
    ['jackson',"He's our office assistant.",'他是我们办公室的助手。']
  ].map(([person,text,cn],i)=>({id:'L17-D'+String(i+1).padStart(2,'0'),person,who:person==='jackson'?'teacher':'student',text,cn,source:source+'；Lesson17原文'}));
  const PHRASES=[
    {en:'Come and meet our employees.',cn:'邀请对方认识同事。',image:image('employee')},
    {en:'How do you do?',cn:'初次正式见面的问候，通常也用这句话回应。',image:image('jackson')},
    {en:'What are their jobs?',cn:'问他们／她们的职业。',image:image('job')},
    {en:'Who is this young man?',cn:'问这位年轻人是谁。',image:image('man')}
  ];
  const GALLERY=[
    ['sales rep','sales reps'],['keyboard operator','keyboard operators'],['mechanic','mechanics'],['engineer','engineers'],
    ['hairdresser','hairdressers'],['teacher','teachers'],['customs officer','customs officers'],['taxi driver','taxi drivers'],
    ['nurse','nurses'],['air hostess','air hostesses'],['housewife','housewives'],['milkman','milkmen'],['postman','postmen'],['policeman','policemen'],['policewoman','policewomen']
  ].map(([single,plural])=>({single,plural,en:plural,cn:WORDS.find(w=>w.en===single).cn,image:image(plural.replaceAll(' ','-')),source:source+'；Lesson18图示'}));
  const model=(wrong,right)=>({wrong,right,en:`What are their jobs? Are they ${wrong} or ${right}? They aren't ${wrong}. They're ${right}.`,cn:'',image:image(right.replaceAll(' ','-')),source:source+'；Lesson18 Written B'});
  const MODEL_EXAMPLE=model('mechanics','sales reps');
  const MODELS=[['keyboard operators','air hostesses'],['postmen','policemen'],['policewomen','nurses'],['customs officers','hairdressers'],['hairdressers','teachers'],['engineers','taxi drivers'],['policewomen','keyboard operators'],['milkmen','engineers'],['policemen','milkmen'],['nurses','housewives']].map(pair=>model(...pair));
  const REFERENCE=[
    ['That man is tall. ___ is a policeman.','He'],['Those girls are busy. ___ are keyboard operators.','They'],
    ['Our names are Britt and Inge. ___ are Swedish.','We'],['Look at our office assistant. ___ is very hard-working.','He'],
    ['Look at Nicola. ___ is very pretty.','She'],['Michael Baker and Jeremy Short are employees. ___ are sales reps.','They']
  ].map(([prompt,answer])=>({prompt,answer,en:prompt.replace('___',answer),source:source+'；Lesson18 Written A'}));
  const q=(id,target,prompt,options,answer,explanation,hint,basis,decision,extra={})=>({
    id:'u1718-v1-'+id,target,prompt,options:options?.map(o=>o[0]),answer,explanation,hint,source:source+'；'+basis,decision,
    distractorReasons:options?Object.fromEntries(options.filter(o=>o[0]!==answer)):undefined,...extra
  });
  const vocabulary=[
    ['employee','雇员；员工',['雇员；员工','老板','游客','朋友'],'employee\n选出这个词的意思。'],
    ['hard-working','勤奋的',['勤奋的','忙碌的','懒惰的','年轻的'],'Those women are very hard-working.\nhard-working 表示什么？'],
    ['sales rep','销售代表；推销员',['销售代表；推销员','电脑录入员','工程师','办公室助手'],'sales rep\n选出这个词的意思。'],
    ['man','成年男子；男人',['成年男子；男人','成年女子；女人','男孩','女孩'],'man\n选出这个词的意思。'],
    ['office','办公室',['办公室','教室','学校','海关'],'office\n选出这个词的意思。'],
    ['assistant','assistant',['assistant','employee','officer','friend'],'助手\n选出对应的英文。'],
    ['those','那些',['那些','这些','她们的','她们'],'Those women are very hard-working.\nthose 表示什么？'],
    ['their','她们的',['她们的','她们','我们的','你们的'],'Those women are very hard-working.\nWhat are their jobs?\n这里的 their 表示什么？']
  ];
  const vocabularyReasons={
    employee:{'老板':'老板是管理或经营的人；employee 强调受雇工作的员工。','游客':'游客对应 tourist，employee 是雇员。','朋友':'朋友对应 friend，不表示受雇身份。'},
    'hard-working':{'忙碌的':'busy 是忙碌；hard-working 强调努力勤奋，两者不同。','懒惰的':'lazy 表示不愿付出努力，与勤奋相反。','年轻的':'young 描述年龄，不描述工作态度。'},
    'sales rep':{'电脑录入员':'电脑录入员对应 keyboard operator。','工程师':'工程师对应 engineer。','办公室助手':'办公室助手对应 office assistant。'},
    man:{'成年女子；女人':'成年女子对应 woman。','男孩':'男孩对应 boy；man 在这里指成年男子。','女孩':'女孩对应 girl。'},
    office:{'教室':'教室对应 classroom；office 指办公室。','学校':'学校对应 school；office 指办公室。','海关':'海关对应 customs；office 本身没有海关的含义。'},
    assistant:{employee:'employee 强调受雇身份，不是助手这个职业称呼。',officer:'officer 在本课系列表示官员，不是助手。',friend:'friend 表示朋友，不是助手。'},
    those:{'这些':'这些对应 these；those 是那些。','她们的':'这是所属关系，those 表示指示。','她们':'她们对应 they；those women 是那些女士。'},
    their:{'她们':'本句需要说明谁的工作，their 表示所属，不是主语 they。','我们的':'我们的对应 our；本句在问前面的 women。','你们的':'你们的对应 your；本句在问前面的 women。'}
  };
  const questions={
    listen:vocabulary.map(([en,answer,options,prompt])=>q('vocab-'+en,'理解并使用 '+en,prompt,options.map(value=>[value,value===answer?'':vocabularyReasons[en][value]]),answer,
      en==='assistant'?'assistant 表示助手。':en+' 在这句里表示“'+answer+'”。','','Lesson17词表与正文','新词各一次，不整组重考旧职业词',{presentation:'vocabulary'})),
    roles:[
      q('story-jobs','从课文找出两位同事的职业','课文中，Michael Baker 和 Jeremy Short 是做什么工作的？',[
        ['sales reps',''],['keyboard operators','电脑录入员是 Nicola 和 Claire。'],['office assistants','课文的办公室助手是 Jim。']
      ],'sales reps','课文介绍他们是 sales reps。','找到介绍 Michael 和 Jeremy 后的问答。','Lesson17读前问题与D08–D12','跨句找工作信息'),
      q('story-their','根据前文确定问的是谁的工作','课文第一次问 What are their jobs?\n是在问谁的工作？',[
        ['Nicola Grey 和 Claire Taylor',''],['Michael Baker 和 Jeremy Short','这是第二次相同问句所指的人。'],['Mr. Jackson 和 Mr. Richards','他们是谈论同事的两位说话者。']
      ],'Nicola Grey 和 Claire Taylor','第一次问句接在介绍 Nicola 和 Claire、评价 Those women 后。','回看第一次提问前介绍了谁。','Lesson17 D03–D07','两次相同问句有不同指向'),
      q('story-busy','准确理解不很忙，不推断性格','只看 They aren’t very busy!\n这句话表达了什么？',[
        ['他们不很忙',''],['他们很懒','不很忙不等于懒惰，lazy 是后一句另作的评价。'],['他们不是推销员','这句话没有否定职业。']
      ],'他们不很忙','not very busy 表示不很忙，不能仅据此判断懒惰。','只判断这句话说了什么，不添加后面的话。','Lesson17 D10','限制推断，区别状态与评价')
    ],
    refer:[
      q('refer-who','区别问身份与问职业','想认识眼前这位年轻人，问“他是谁”，该说哪句？',[
        ['Who is this young man?',''],["What's his job?",'这是问职业，不是问他是谁。'],['How do you do?','这是初次见面的问候。']
      ],'Who is this young man?','Who 问人是谁；What’s his job? 问职业。','想想这次要了解的是身份、职业，还是打招呼。','Lesson17 D14','比较不同提问目的'),
      q('refer-jim','用课文身份确定代词，不按职业猜性别','这里的 office assistant 指课文中的 Jim。\nLook at our office assistant. ___ is very hard-working.',[
        ['He',''],['She','课文用 young man 和 He’s 介绍 Jim。'],['We','这里描述 Jim，不包括说话者。'],['They','本句只说课文里的 Jim 一人，并使用 is。']
      ],'He','课文用 young man 和 He’s 介绍 Jim，因此本句用 He。','回看故事末尾是怎样介绍 Jim 的。','Lesson18 Written A4；Lesson17 D14–D16','有明确文本身份，不按职业或名字猜'),
      q('refer-we','从说话者视角使用第一人称复数','Our names are Britt and Inge.\n___ are Swedish.',[
        ['We',''],['They','这两个人在说自己的名字和国籍。'],['He','Britt 和 Inge 是两个人，且说的是自己。'],['She','单数 She 不能指这两位说话者。']
      ],'We','两个人说自己的名字，再说自己的国籍，用 We。','第一句的 Our 表示谁的？第二句仍是这两人在自我介绍。','Lesson18 Written A3','从所属词理解说话视角')
    ],
    forms:[
      q('plural-people','识别两个人称名词的不规则复数','man 和 woman 都变成复数，哪组正确？',[
        ['men / women',''],['mans / womans','这两个词不是直接加 s。'],['men / womans','woman 的复数也有内部变化。']
      ],'men / women','man → men；woman → women。','这两个常用词变复数时，词内的字母会变化。','Lesson18复数注释','两词配对，避免同构连考'),
      q('plural-police','把 woman 的复数变化用于复合词','一位女警察：a policewoman\n两位女警察的英文标签是：',[
        ['policewomen',''],['policewomans','woman 在这个复合词中也要变成 women。'],['policeswoman','变化的是 woman 部分，不是 police 部分。']
      ],'policewomen','policewoman → policewomen。','把词拆成 police 和 woman，想想哪一部分表示人。','Lesson18图15','不规则变化迁移到复合词',{image:image('policewomen'),imageAlt:'两位穿警服的人物'}),
      q('plural-housewives','识别 housewife 的特定复数变化','一位家庭主妇：a housewife\n多位家庭主妇的英文标签是：',[
        ['housewives',''],['housewifes','这个词的 wife 部分变为 wives。'],['housewife','这是单数。']
      ],'housewives','housewife → housewives。这个词把 fe 改为 ves，并非所有 f/fe 结尾的词都这样。','留意这个词结尾的 fe：它属于需要变化的一类。','Lesson18图11与注释','新增 fe 词的特例，不重复规则加 s')
    ],
    trans:[
      q('build-jobs','组织复数职业特殊疑问句','问：“他们的工作是什么？”',undefined,'What are their jobs?','问他们的职业：What are their jobs?。','先问什么，再接“他们的工作”。','Lesson17 D06/D11','特殊疑问',{type:'order',tokens:['What','are','their','jobs?']}),
      q('build-choice','组织复数职业选择疑问句','问：“他们是工程师，还是出租车司机？”',undefined,'Are they engineers or taxi drivers?','用 or 连接两个职业选项。','先提出疑问，再把两种职业用“还是”连接。','Lesson18 Written B6','选择疑问，不同于上一题',{type:'order',tokens:['Are','they','engineers','or','taxi drivers?']}),
      q('build-correct','用否定和肯定纠正职业猜测','纠正猜测：“她们不是护士。她们是家庭主妇。”',undefined,"They aren't nurses. They're housewives.",'先否定 nurses，再介绍真实职业 housewives。','先说不是哪种职业，再说实际是哪种。','Lesson18 Written B10','否定加肯定，信息纠正',{type:'order',tokens:['They',"aren't",'nurses.',"They're",'housewives.']})
    ],
    exam:[
      q('exam-introduce','把同事的自我介绍转述给别人','两位同事说：We are keyboard operators.\n你向另一位访客介绍这两位同事，应该说：',[
        ['They are keyboard operators.',''],['We are keyboard operators.','你正在介绍另外两人，不是在介绍自己。'],['Their are keyboard operators.','Their 表示所属，不能作这里的主语。']
      ],'They are keyboard operators.','向别人介绍这两位同事，用 They。','站在介绍者的角度，想想说的是自己一组人还是另外的人。','Lesson17介绍雇员；新情境','延迟迁移，改变说话视角'),
      q('exam-record','从两句新资料匹配人物和职业','新资料：These women are nurses.\nThose men are engineers.\n哪条记录正确？',[
        ['women · nurses / men · engineers',''],['women · engineers / men · nurses','把两组人的职业交换了。'],['women · nurses / men · nurses','第二句说 men 是 engineers，不是 nurses。']
      ],'women · nurses / men · engineers','women 对应 nurses，men 对应 engineers。','把记录中的两组人分别与原句核对。','Lesson18职业与复数；新资料','同时处理两组新信息')
    ]
  };
  const previousQuestions={exam:questions.exam.slice()};
 const activityPredecessors={exam:['exam']};
 // Coverage-driven additions; keep the two prior questions unchanged for migration.
 questions.exam.push(
  q("final-v2-greet","初次见面回应","第一次见面的访客说：How do you do?\n你怎样回应？",[["How do you do?", ""], ["I am tired.", "这是身体状态，不是此处的正式问候。"], ["They are nurses.", "这是职业介绍，没有回应问候。"]],"How do you do?","本题核对：初次见面回应。","先判断是在问候，还是询问状态。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查初次见面回应",{}),
  q("final-v2-identity","区分身份与职业问题","主人回答：This is Jim.\n哪一个问题能接上这个回答？",[["Who is this young man?", ""], ["What are their jobs?", "问多人的职业，不问眼前人的身份。"], ["How do you do?", "这是问候，不询问身份。"]],"Who is this young man?","本题核对：区分身份与职业问题。","看看想补充的是姓名身份，还是职业。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查区分身份与职业问题",{}),
  q("final-v2-pronouns","人物与物主词","Jim 是一位年轻男士。\n___ is an office assistant.\n___ job is in this office.",[["He · His", ""], ["His · He", "主语和物主词的位置反了。"], ["They · Their", "这里介绍一个明确的人。"]],"He · His","本题核对：人物与物主词。","第一空代替人，第二空说明谁的工作。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查人物与物主词",{}),
  q("final-v2-plural-people","man和woman的不规则复数","两张名牌原来写 men 和 women。\n现在每组只介绍一人，名牌应改成哪组？",[["a man · a woman", ""], ["a men · a woman", "介绍一人不能保留复数 men。"], ["a man · a women", "介绍一人不能保留复数 women。"]],"a man · a woman","本题核对：man和woman的不规则复数。","每张名牌只表示一个人，要还原为单数。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查man和woman的不规则复数",{}),
  q("final-v2-plural-job","复合职业名词和fe变化","两位女警察、两位家庭主妇：\n哪组英文标签都正确？",[["policewomen · housewives", ""], ["policewomans · housewives", "woman 的变化在这个复合词里仍保留。"], ["policewomen · housewifes", "housewife 的复数是 housewives。"]],"policewomen · housewives","本题核对：复合职业名词和fe变化。","分别回想复合词和 fe 结尾这个词的变化。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查复合职业名词和fe变化",{}),
  q("final-v2-job-choice","选择问句与否定纠正","两位新同事的资料：engineers。\n访客问：Are they mechanics or engineers?\n怎样回答？",[["They aren't mechanics. They're engineers.", ""], ["They're mechanics.", "与资料的职业不符。"], ["Yes, they are.", "这句没有说明选择了哪种职业。"]],"They aren't mechanics. They're engineers.","本题核对：选择问句与否定纠正。","这次是在两种职业中选择，先排除猜错的。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查选择问句与否定纠正",{}),
  q("final-v2-ask-jobs","组织复数否定介绍","整理访客笔记：那些男士不很忙。",undefined,"Those men aren't very busy.","本题核对：复数主语与否定介绍。","先说明是哪几个人，再描述他们的状态。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查复数主语与否定介绍",{"type": "order", "tokens": ["Those", "men", "aren't", "very", "busy."]}),
  q("final-v2-evidence","区分不忙与懒惰","另一组同事的记录只有：They are hard-working.\n哪些信息能确定？",[["他们很勤奋，是否忙碌还不知道。", ""], ["他们一定很忙。", "勤奋不等于此刻一定忙碌。"], ["他们都是推销员。", "这句没有说明职业。"]],"他们很勤奋，是否忙碌还不知道。","本题核对：区分不忙与懒惰。","只保留这句话真的说出的信息。","综合迁移；对应本课原文、注释与偶数课练习","撤去完整答案支架，独立检查区分不忙与懒惰",{}),
 );
 const stages=[
    {id:'l1',title:'敲开办公室',activities:[['words','职业小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
    {id:'l2',title:'认识新同事',activities:[['text','办公室小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
    {id:'l3',title:'把同事介绍清楚',activities:[['phrases','介绍小锦囊','speech'],['refer','人物接力卡','question']],required:['refer']},
    {id:'l4',title:'职业成双',activities:[['models','职业小画册','cards'],['forms','单词变一变','cards'],['trans','词块拼装台','order']],required:['forms','trans']},
    {id:'l5',title:'小访客出发',activities:[['exam','访客小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
  ];
  const definition={id:'unit17-18',version:1,title:'办公室探访记',path:'/unit17-18/',start:'learn/words',progress:{learningKey:'canran:unit17-18:learning:v1'},objects:WORDS,stages,questions,previousQuestions,activityPredecessors,
    learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,MODELS,MODEL_EXAMPLE,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK}};
  root.CanranCore.unit1718=definition;
  if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);

// Task edition v4: exact prior rounds are evidence for unchanged questions only.
(function(core){
 const unit=core.unit1718;
 const revised={"forms":[{
  "id": "u1718-tasks-v4-plural-labels",
  "target": "辨认不规则人物复数",
  "prompt": "给单数标签找到复数伙伴。",
  "decision": "合并机械形式选择；最终挑战仍独立抽查，配对不算稳定掌握。",
  "hint": "",
  "source": "Lesson 17–18 人物与职业名词复数，含 Lesson 18 新词 housewives",
  "type": "match",
  "pairs": [
    {
      "id": "1",
      "en": "man",
      "cn": "men"
    },
    {
      "id": "2",
      "en": "woman",
      "cn": "women"
    },
    {
      "id": "3",
      "en": "policewoman",
      "cn": "policewomen"
    },
    {
      "id": "4",
      "en": "housewife",
      "cn": "housewives"
    }
  ],
  "answer": "[\"1\",\"2\",\"3\",\"4\"]",
  "leftLabel": "单数",
  "rightLabel": "复数",
  "instruction": "点一个单数词，再点它的复数。",
  "distractorRationale": "四对分别为 man/men、woman/women、policewoman/policewomen、housewife/housewives；配对侧重认形，综合挑战另保留独立形式选择，不能宣称学会所有不规则复数。"
}],
"roles":[unit.questions["roles"][0],
unit.questions["roles"][1],
{
  "id": "u1718-tasks-v4-story-busy",
  "target": "抓住否定范围",
  "prompt": "点出表示“不很忙”的完整词组。",
  "decision": "原文只否定很忙，不能推出很懒；语义边界在挑战另测。",
  "hint": "要保留否定的部分，也要保留程度。",
  "source": "Lesson 17 原文 They aren’t very busy!",
  "type": "locate",
  "fragments": [
    {
      "value": "They"
    },
    " ",
    {
      "value": "aren't very busy"
    },
    "!"
  ],
  "options": [
    "They",
    "aren't very busy"
  ],
  "answer": "aren't very busy",
  "distractorReasons": {
    "They": "这个片段不表达题目要求的信息；需结合完整句子判断。"
  },
  "distractorRationale": "They 只指人物；aren’t very busy 才含否定和程度。不能从不很忙推出懒惰，也不把 aren’t 等同从不。"
}],
"exam":[unit.questions["exam"][0],
unit.questions["exam"][1],
unit.questions["exam"][2],
unit.questions["exam"][3],
unit.questions["exam"][4],
unit.questions["exam"][5],
unit.questions["exam"][6],
unit.questions["exam"][7],
unit.questions["exam"][8],
unit.questions["exam"][9],
{
  "id": "u1718-tasks-v4-exam-names",
  "target": "回答复数姓名询问",
  "prompt": "两位同事的名牌：Britt / Inge\n访客：What are your names?\n两位同事一起怎样回答？",
  "decision": "Lesson18已有姓名介绍；补名字与国籍、职业的信息类别区别。",
  "hint": "访客要登记的是名字这一项资料。",
  "source": "Lesson 18 Written A 的 Britt/Inge 与 Our names are…；新情境复数姓名询问",
  "options": [
    "Our names are Britt and Inge.",
    "We're Swedish.",
    "We're nurses."
  ],
  "answer": "Our names are Britt and Inge.",
  "distractorReasons": {
    "We're Swedish.": "这是国籍，没有回答名字。",
    "We're nurses.": "这是职业，没有回答名字。"
  },
  "distractorRationale": "Our names are… 回答姓名；We’re Swedish. 回答国籍，We’re nurses. 回答职业。不同信息类别，不能只因整句语法通顺就选。"
}]};
 unit.taskPredecessors ||= {}; unit.taskSessions ||= {};
 for(const [id,items] of Object.entries(revised)){
  const priorKey='unit1718-'+id+'-practice/'+(unit.taskSessions[id]||(unit.taskPredecessors[id]?'v3':unit.activityPredecessors?.[id]?'v2':'v'+unit.version));
  const sources=[{key:priorKey,questions:unit.questions[id]},...(unit.taskPredecessors[id]||[]),...(unit.activityPredecessors?.[id]||[]).map(old=>({key:'unit1718-'+old+'-practice/v1',questions:unit.previousQuestions[old]}))];
  unit.taskPredecessors[id]=sources; unit.taskSessions[id]='tasks-v4'; unit.questions[id]=items;
 }
})(globalThis.CanranCore);

// Five-zone edition; the unchanged predecessor above remains a migration source.
(function(core){
'use strict';
const old=core.unit1718;core.unit1718LegacyDefinition=JSON.parse(JSON.stringify(old));
const source='课本纸34–37／PDF67–70；练习册纸44–49／PDF58–63';
const grammarSource='同步导学Grammar纸34–35／PDF48–49；'+source;
const unit={id:'unit17-18',version:1,mode:'classroom',contentRevision:'office-five-zones-v1',legacyEdition:'unit17-18-completion-v1',title:'办公室探访记',path:'/unit17-18/',start:'learn/words',progress:old.progress,learning:{...old.learning},objects:old.objects,questions:{},
stages:[{id:'l1',title:'敲开办公室',activities:[['words','职业小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},{id:'l2',title:'认识新同事',activities:[['text','办公室小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},{id:'l3',title:'身份与复数',activities:[['grammar','语法小工坊','speech']],required:['grammar']},{id:'l4',title:'介绍新同事',activities:[['apply','访客小帮手','heart']],required:['apply']},{id:'l5',title:'小小介绍员',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}],
routeAliases:{'learn/phrases':'learn/grammar','learn/refer':'learn/apply','learn/forms':'learn/grammar','learn/models':'learn/apply','learn/trans':'learn/apply'},
reward:{edition:'office-five-zones-v1',title:'同事介绍小达人',lesson:'Lesson 17–18',scene:'/assets/unit17-18/keepsake-story-v1.webp',alt:'Jackson向Richards介绍Jim，Jim抱着蓝灰色文件夹微笑',color:'#586988',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','访客小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
const choice=(options,answer,material='')=>({options,answer,material});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers,material='')=>({type:'cloze',blanks,answer:JSON.stringify(answers),material});
const words=(tokens,slots,answer,material='')=>({type:'wordbank',language:'en',tokens,slots,answer,material});
const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1))),leftLabel:'单数',rightLabel:'复数',instruction:'点一个单数词，再点它的复数。'});
const q=(id,target,prompt,input,explanation)=>{const{material,...fields}=input;return{id:'u1718-five-'+id,target,prompt,source,...fields,...(material?{display:{title:prompt,material}}:{}),explanation,hint:''};};
const g=(id,target,prompt,input,rule,demo)=>({...q('g-'+id,target,prompt,input,rule),source:grammarSource,workshop:{rule,...(demo?{model:{lines:demo}}:{})}});
unit.learning.WORDS=unit.objects;
unit.questions.listen=old.questions.listen;
unit.questions.roles=[...old.questions.roles,
q('r-opinion','区分人物评价与普遍事实','这句评价是谁对谁说的？',choice(['Jackson评价Michael和Jeremy','课文说所有销售代表都懒惰','Richards评价Nicola和Claire'],'Jackson评价Michael和Jeremy',"Jackson介绍Michael和Jeremy后说：They're very lazy."),'这是Jackson对指定两个人的评价，不能推广到职业或性别，也不能只从不很忙推出懒惰。')];
unit.questions.grammar=[
g('who-answer','用姓名或关系回应身份询问','想知道这位女士是谁，选合适的回应。',choice(['She is Anna.','She is a nurse.','She is busy.'],'She is Anna.','访客正在核对姓名。Who is this woman?\n资料：姓名Anna；职业nurse。'),'这里Who问的是身份，按任务用姓名回答。职业和当前状态是不同信息。',[['Who is this man? He is Ben.','问眼前的人是谁，用姓名介绍。'],['What is his job? He is a teacher.','job明确询问职业。']]),
g('job-answer','区分职业与身份回答','现在访客只登记职业，选合适的回应。',choice(["They're engineers.",'They are Tom and Jack.','They are my friends.'],"They're engineers.",'What are their jobs?\n资料：Tom和Jack；职业engineers；是我的朋友。'),'What are their jobs?明确问职业；what还可以问别的信息，不能把所有what问句都解释成问职业。',[['Who are these women? They are my sisters.','说明人物关系。'],["What are their jobs? They're nurses.",'说明职业。']]),
g('who-be','按所问对象的单复数选be','一位男士和两位女士，分别怎样问是谁？',fill([blank('Who ',' this man?',['is','are']),blank('Who ',' those women?',['is','are'])],['is','are']),'Who is this man?问一位；Who are those women?问多位。不要把who一律搭配is。',[['Who is she? Who are they?','be跟所问的对象保持一致。']]),
old.questions.forms[0],
g('irregular','认识四组新的不规则复数','把单数和复数连起来。',match([['child','children'],['foot','feet'],['tooth','teeth'],['mouse','mice']]),'child、foot、tooth、mouse分别变为children、feet、teeth、mice，不直接加s。',[['man → men; woman → women','有些名词的复数要记住特殊词形。']]),
g('compound','按真正词形区别Englishman和German','资料明确有两位英国男子和两位德国人，补好名词。',fill([blank('two ','',['Englishmen','Englishmans']),blank('two ','',['Germans','Germen'])],['Englishmen','Germans'],'Englishman：英国男子；German：德国人（本题作名词）。'),'Englishman的man变men；German不是man构成的复合词，复数是Germans。不能见到字母man就套同一变化。',[['policeman → policemen; postman → postmen','这些职业词中的man随复数变化。']]),
g('same-form','认识单复数同形名词','为两只绵羊和三只鹿填写标签。',fill([blank('two ','',['sheep','sheeps']),blank('three ','',['deer','deers'])],['sheep','deer'],'sheep：绵羊；deer：鹿。'),'sheep和deer的单复数形式相同；数量要结合two、three等信息判断。',[['one fish; two fish','fish也常用相同形式表示一条或多条鱼。']]),
g('fish-number','同形名词依数量使用be','分别说一条鱼和三条鱼，补好be。',fill([blank('This fish ',' small.',['is','are']),blank('These three fish ',' small.',['is','are'])],['is','are'],'fish：鱼；small：小的。'),'fish词形相同，this一条配is，these three三条配are。',[['This sheep is small. These sheep are small.','同形名词仍有单数和复数意义。']]),
g('groups','people与police按当前含义用复数','people指人们，police指警察群体，选好be。',fill([blank('These people ',' visitors.',['are','is']),blank('The police ',' here.',['are','is'])],['are','are'],'visitors：访客；here：在这里。'),'people表示人们、police表示警察群体时搭配复数；不要把这一规则推广到所有集合名词。',[['The cattle are in the field.','cattle指牛群，作复数；field：田野。']]),
g('one-person','用正确的单个人物表达','登记一位访客和一名警察，补好单数表达。',fill([blank('one ','',['person','people']),blank('a ','',['police officer','police'])],['person','police officer'],'本题每项都只有一人。'),'一个人可说one person；一名警察用a police officer。people表示民族时另有可数用法，这里说的是单个人。',[['one child; two children','明确说一个人时，要用相应的单数表达。']]),
g('cattle-count','表达一头牛的数量','想用cattle这个词记录一头牛，哪种表达正确？',choice(['one head of cattle','one cattle','one cattles'],'one head of cattle','cattle指牛；head在这里是计数单位。'),'用cattle计数可说one head of cattle；不把cattle直接变成a cattle。',[['one person; a police officer','群体词与单个成员的表达可能不同。']]),
g('national-group','国民总称作复数','补好这句欢迎名单。',fill([blank('The Chinese ',' here.',['are','is'])],['are'],'名单用The Chinese指这次到访的中国人群体。'),'the加这里的国民总称指一群人，搭配复数；不能因此对一个民族作性格概括。',[['The Japanese are here.','这里The Japanese指到访的日本人群体。']]),
g('singular-s','不凭词尾s判断单复数','news指消息，maths指数学，补好be。',fill([blank('The news ',' good.',['is','are']),blank('Maths ',' interesting.',['is','are'])],['is','is'],'good：好的；interesting：有趣的。'),'news和表示学科的maths虽然以s结尾，这里仍用单数is。',[['Physics is interesting.','physics表示物理学科，也用单数。']]),
g('title','把一本书的名称看作一个整体','这是一部书的书名，怎样介绍？',choice(['School Friends is a book.','School Friends are a book.','School Friends am a book.'],'School Friends is a book.','书名：School Friends；这里只介绍这一本书。'),'书名中的Friends是复数形式，整个书名指一部作品时按单数处理。',[['The United States is a country.','United States在这里是一个国家的专名，按单数处理。']]),
g('plural-only','眼镜与裤子使用复数形式','按给定含义补好句子。',fill([blank('These glasses ',' new.',['are','is']),blank('These trousers ',' long.',['are','is'])],['are','are'],'glasses：眼镜；trousers：裤子；new：新的；long：长的。'),'glasses表示眼镜、trousers表示裤子时使用复数，不能把它们直接当a glass或a trouser。',[['These shorts are blue.','shorts表示短裤，使用复数；不是按裤子件数直接改词形。']]),
g('pair','区分pair与glasses作为主语','仍说这一副眼镜，补好两句。',fill([blank('This pair of glasses ',' new.',['is','are']),blank('These glasses ',' new.',['is','are'])],['is','are']),'This pair以单数pair为中心，用is；These glasses用are。两句可以描述同一副眼镜。',[['A pair of trousers is on the chair.','pair：一条／一副；on the chair：在椅子上。']]),
g('clothes','clothes不等于所有东西都有两部分','想说这些衣服很干净，选合适的句子。',choice(['These clothes are clean.','This clothes is clean.','These clothes is clean.'],'These clothes are clean.','clothes：衣服；clean：干净的。'),'clothes表示衣服，按复数使用；衣服不一定由两个部分组成，不能由这个词判断每件衣服的结构。',[['My clothes are blue.','衣服用clothes，不说a clothes。']]),
g('meaning','按特定复数词义组织句子','货物已经备齐，选出合适的记录。',choice(['The goods are ready.','The goods is ready.','A goods is ready.'],'The goods are ready.','goods：货物；ready：准备好的。'),'goods表示货物并按复数使用，不说a goods；词形与当前含义一起核对。',[['water：水；coastal waters：沿海水域','有些复数形式表达特定含义，不能只理解成多件物品。']]),
g('they-their','区分主语they与物主their','介绍两位同事以及他们的办公室。',fill([blank('',' are employees.',['They','Their']),blank('',' office is here.',['They','Their'])],['They','Their'],'两位同事一起使用这间办公室。'),'They说明他们是谁；Their office说明他们的办公室。一个办公室不代表只有一位物主。',[['We are teachers. Our office is here.','We是主语，Our后面接名词。']]),
g('whole-plural','按新的复数对象改写整句','现在改为远处两位女士，按原句信息拼好介绍。',words(['Those','women','are','nurses.','a','is'],4,'Those women are nurses.','原句：That woman is a nurse.\n新情境：远处两位女士都是护士。'),'That变Those，woman变women，is变are；复数nurses前去掉a。',[['This man is a teacher. → These men are teachers.','人物、指示词、be、职业和冠词一起核对。']])
];
unit.questions.apply=[...old.questions.refer,...old.questions.trans];
unit.questions.exam=[...old.questions.exam,
q('e-body-one','独立使用children和feet','按数量填写儿童与脚的复数标签。',fill([blank('three ','',['children','childs','child']),blank('two ','',['feet','foots','foot'])],['children','feet'],'child：孩子；foot：脚。'),'child变children，foot变feet。'),
q('e-body-two','独立使用teeth和mice','按数量填写牙齿与老鼠的复数标签。',fill([blank('two ','',['teeth','tooths','tooth']),blank('three ','',['mice','mouses','mouse'])],['teeth','mice'],'tooth：牙齿；mouse：老鼠。'),'tooth变teeth，mouse变mice。'),
q('e-compound','独立区别复合词与普通名词','这些名词各指两个人，选正确的标签组。',choice(['Englishmen / Germans','Englishmans / Germen','Englishmen / Germen'],'Englishmen / Germans','Englishman：英国男子；German：德国人。'),'Englishman的复数是Englishmen，German的复数是Germans。'),
q('e-same','独立保留单复数同形','动物园有五只鹿和两只绵羊，补好标签。',fill([blank('five ','',['deer','deers']),blank('two ','',['sheep','sheeps'])],['deer','sheep']),'deer与sheep的复数不加s。'),
q('e-fish','从数量而非fish词形判断be','按这两条记录补好句子。',fill([blank('The fish in Box A ',' small.',['is','are']),blank('The fish in Box B ',' small.',['is','are'])],['is','are'],'Box A：一条鱼；Box B：四条鱼。small：小的。'),'A的一条鱼配is，B的四条鱼配are；fish本身没有显示数量。'),
q('e-groups','独立判断群体词的be','cattle指牛群，police指警察群体，补好be。',fill([blank('The cattle ',' in the field.',['is','are']),blank('The police ',' at the gate.',['is','are'])],['are','are'],'field：田野；at the gate：在门口。'),'本题两种群体词都按复数使用。'),
q('e-person','按单个人与多人选person和people','访客人数写得很清楚，补好记录。',fill([blank('one ','',['person','people']),blank('four ','',['people','peoples'])],['person','people'],'这里统计的是四个个人，不是民族或文化群体。'),'一人用person；这里多个人用people，不加s。'),
q('e-nation','独立判断国民总称','名单用The Japanese指这次到访的日本人群体，补好be。',fill([blank('The Japanese ',' in the office.',['is','are'])],['are']),'国民总称在这里指一群人，用are。'),
q('e-singular','不把s结尾的消息与专名当复数','按词的实际含义补好be。',fill([blank('This news ',' important.',['is','are']),blank('The United Nations ',' an organization.',['is','are'])],['is','is'],'news：消息；important：重要的；United Nations：联合国，指一个组织。'),'news与这里表示一个组织的United Nations都用单数is。'),
q('e-pair','依中心词选择is或are','一副眼镜和两副眼镜，分别补好句子。',fill([blank('This pair of glasses ',' blue.',['is','are']),blank('These two pairs of glasses ',' blue.',['is','are'])],['is','are'],'glasses指眼镜，pair指一副。'),'中心词是pair或pairs：一副配is，两副配are。'),
q('e-clothes','独立使用clothes的复数结构','清单说这些衣服是新的，哪句正确？',choice(['These clothes are new.','This clothes is new.','These clothes is new.'],'These clothes are new.','clothes：衣服；new：新的。'),'clothes表示衣服时按复数使用。'),
q('e-meaning','独立识别复数词的语境意义','沿海介绍写着coastal waters，这里的waters表示什么？',choice(['水域','几杯饮用水','几件货物'],'水域','coastal表示沿海的；这是一份沿海地理介绍。'),'waters在这个地理语境中表示水域。'),
q('e-who-plural','独立构成复数身份问句','访客想知道远处两位女士是谁，拼好问题。',words(['Who','are','those','women?','What','is'],4,'Who are those women?','这里只问人物身份，随后会另外询问职业。'),'问身份用Who；those women是复数，搭配are。')
];
unit.taskSessions=Object.fromEntries(unit.reward.zones.map(z=>[z.id,'five-zones-v1']));
const previous={listen:['listen'],roles:['roles'],grammar:['forms'],apply:['refer','trans'],exam:['exam']};
unit.taskPredecessors=Object.fromEntries(Object.entries(previous).map(([id,priorIds])=>[id,priorIds.flatMap(prior=>[{key:'unit1718-'+prior+'-practice/'+(old.taskSessions?.[prior]||(old.taskPredecessors?.[prior]?'v3':old.activityPredecessors?.[prior]?'v2':'v'+old.version)),questions:old.questions[prior]},...(old.taskPredecessors?.[prior]||[])]) ]));
core.unit1718=unit;if(globalThis.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis.CanranCore);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit1718,excerpts={"u1718-v1-story-jobs":[7,8,9,10,11],"u1718-v1-story-their":[2,3,4,5,6]},speakers={"jackson":"Mr. Jackson","richards":"Mr. Richards"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 17',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
