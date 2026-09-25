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
  const stages=[
    {id:'l1',title:'敲开办公室',activities:[['words','职业小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
    {id:'l2',title:'认识新同事',activities:[['text','办公室小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
    {id:'l3',title:'把同事介绍清楚',activities:[['phrases','介绍小锦囊','speech'],['refer','人物接力卡','question']],required:['refer']},
    {id:'l4',title:'职业成双',activities:[['models','职业小画册','cards'],['forms','单词变一变','cards'],['trans','词块拼装台','order']],required:['forms','trans']},
    {id:'l5',title:'小访客出发',activities:[['exam','访客小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
  ];
  const definition={id:'unit17-18',version:1,title:'办公室探访记',path:'/unit17-18/',start:'learn/words',progress:{learningKey:'canran:unit17-18:learning:v1'},objects:WORDS,stages,questions,
    learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,MODELS,MODEL_EXAMPLE,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK}};
  root.CanranCore.unit1718=definition;
  if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
