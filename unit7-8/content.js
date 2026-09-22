(function(root){
 'use strict';
 const image=name=>'/assets/unit7-8/'+name+'.svg',recording=name=>'unit7-8/audio/'+name+'.mp3';
 const source='《新概念英语智慧版1》纸页14–17（PDF47–50）';
 const word=(en,cn,ph,file,art,example='')=>({en,cn,ph,audio:recording(file),image:image(art),example,source});
 const WORDS=[
  word('Italian','意大利（人）的','/ɪˈtæljən/','l07-w07','italian'),
  word('keyboard operator','电脑录入员','/ˈkiːbɔːrd ˌɑːpəreɪt̬ɚ/','keyboard-operator','keyboard-operator'),
  word('engineer','工程师','/ˌendʒɪˈnɪr/','l07-w11','engineer'),
  word('policeman','男警察','/pəˈliːsmən/','l08-w01','policeman'),
  word('policewoman','女警察','/pəˈliːsˌwʊmən/','l08-w02','policewoman'),
  word('taxi driver','出租车司机','/ˈtæksi ˌdraɪvɚ/','l08-w03','taxi-driver'),
  word('air hostess','女空乘','/ˈer ˌhoʊstɪs/','l08-w04','air-hostess'),
  word('postman','男邮递员','/ˈpoʊstmən/','l08-w05','postman'),
  word('nurse','护士','/nɝːs/','l08-w06','nurse'),
  word('mechanic','机械师；修理机器的人','/məˈkænɪk/','l08-w07','mechanic'),
  word('hairdresser','理发师','/ˈherˌdresɚ/','l08-w08','hairdresser'),
  word('housewife','家庭主妇','/ˈhaʊswaɪf/','l08-w09','housewife'),
  word('milkman','男送奶员','/ˈmɪlkmən/','l08-w10','milkman'),
  word('I','我；说话的人指自己','/aɪ/','l07-w01-v2','i','I am Robert.'),
  word('am','本课与 I 连用，说明身份或情况','/æm/','l07-w02','am','I am a student.'),
  word('are','本课与 you 连用','/ɑːr/','l07-w03','are','Are you French?'),
  word('name','名字','/neɪm/','l07-w04','name',"My name’s Robert."),
  word('what','什么','/wɑːt/','l07-w05','what',"What’s your job?"),
  word('nationality','国籍','/ˌnæʃənˈælət̬i/','l07-w06','nationality'),
  word('job','工作；职业','/dʒɑːb/','l07-w08','job'),
  word('keyboard','电脑键盘','/ˈkiːbɔːrd/','l07-w09','keyboard'),
  word('operator','操作人员','/ˈɑːpəreɪt̬ɚ/','l07-w10','operator')
 ];
 const PEOPLE={robert:{name:'Robert',image:image('robert')},sophie:{name:'Sophie',image:image('sophie')}};
 const DIALOGUE=[
  ['robert','I am a new student.','我是一名新学生。'],['robert',"My name's Robert.",'我的名字叫罗伯特。'],
  ['sophie','Nice to meet you.','很高兴见到你。'],['sophie',"My name's Sophie.",'我的名字叫索菲娅。'],
  ['robert','Are you French?','你是法国人吗？'],['sophie','Yes, I am.','是的，我是。'],
  ['sophie','Are you French, too?','你也是法国人吗？'],['robert','No, I am not.','不，我不是。'],
  ['sophie','What nationality are you?','你是哪国人？'],['robert',"I'm Italian.",'我是意大利人。'],
  ['robert','Are you a teacher?','你是老师吗？'],['sophie',"No, I'm not.",'不，我不是。'],
  ['robert',"What's your job?",'你是做什么工作的？'],['sophie',"I'm a keyboard operator.",'我是电脑录入员。'],
  ['sophie',"What's your job?",'你是做什么工作的？'],['robert',"I'm an engineer.",'我是工程师。']
 ].map(([person,text,cn],i)=>({id:'L07-D'+String(i+1).padStart(2,'0'),person,who:person==='robert'?'teacher':'student',text,cn,audio:recording('l07-d'+String(i+1).padStart(2,'0')),source:source+'；Lesson7原文'}));
 // Retain recording provenance for review. The classroom page has no narration
 // player and must not consume these mappings or fall back to browser speech.
 const AUDIO=Object.fromEntries(WORDS.map(w=>[w.en,w.audio]));DIALOGUE.forEach(line=>{if(!AUDIO[line.text])AUDIO[line.text]=line.audio;});
 const PHRASES=[
  {en:"My name's Robert.",cn:'介绍自己的名字',image:image('name')},
  {en:'What nationality are you?',cn:'问对方的国籍',image:image('nationality')},
  {en:"What's your job?",cn:'问对方的职业',image:image('job')},
  {en:'Are you a teacher?',cn:'确认对方是不是老师',image:image('are')}
 ];
 const REFERENCE=[
  {en:'My name is Xiaohui. I am Chinese.',cn:'my name 用 is；I 用 am',image:image('name')},
  {en:'My name is Robert. I am a student. I am Italian.',cn:'姓名、学习身份和国籍',image:image('robert')},
  {en:'Sophie is not Italian. She is French.',cn:'Sophie 和这里的 She 都用 is',image:image('sophie')},
  {en:'Mr. Blake is my teacher. He is not French.',cn:'人名与 He 用 is；否定句不改变搭配',image:'/assets/unit5-6/blake.svg'}
 ];REFERENCE.forEach((item,i)=>{AUDIO[item.en]=recording('written-a-'+String(i+1).padStart(2,'0'));});
 const JOBS=[['policeman','he'],['policewoman','she'],['taxi driver','he'],['air hostess','she'],['postman','he'],['nurse','she'],['mechanic','he'],['hairdresser','he'],['housewife','she'],['milkman','he']].map(([job,pronoun],i)=>{
  const w=WORDS.find(w=>w.en===job),en=`I'm ${job==='air hostess'?'an':'a'} ${job}.`;AUDIO[en]=recording('l08-p'+String(i+1).padStart(2,'0'));
  return {job,pronoun,en,cn:w.cn,image:w.image};
 });
 const INTERVIEWS=[{job:'keyboard operator',pronoun:'she',image:image('sophie')},{job:'engineer',pronoun:'he',image:image('robert')},...JOBS].map((item,i)=>{
  const owner=item.pronoun==='he'?'his':'her',article=['engineer','air hostess'].includes(item.job)?'an':'a';
  const en=`What's ${owner} job? Is ${item.pronoun} ${article} ${item.job}? Yes, ${item.pronoun} is.`;
  AUDIO[en]=recording('interview-'+String(i+1).padStart(2,'0'));
  return {...item,en,cn:'图中这位人物用 '+item.pronoun+'；先问职业，再确认',source:source+'；Lesson8 Written B'};
 });
 AUDIO["I'm Italian. I'm a nurse."]=recording('challenge-record');
 const q=(id,target,prompt,options,answer,explanation,hint,basis,addition,extra={})=>({id:'u78-v1-'+id,target,prompt,options:options?.map(o=>o[0]),answer,explanation,hint,source:source+'；'+basis,decision:addition,distractorReasons:options?Object.fromEntries(options.filter(o=>o[0]!==answer)):undefined,...extra});
 const vocabulary=[
  ['meaning','Italian',['意大利（人）的','法国（人）的','德国（人）的','中国（人）的']],
  ['picture','keyboard operator',['keyboard operator','hairdresser','nurse','taxi driver']],
  ['meaning','engineer',['工程师','护士','理发师','男邮递员']],
  ['english','policeman',['policeman','policewoman','postman','milkman']],
  ['picture','policewoman',['policewoman','policeman','nurse','air hostess']],
  ['picture','taxi driver',['taxi driver','mechanic','engineer','postman']],
  ['meaning','air hostess',['女空乘','女警察','护士','家庭主妇']],
  ['english','postman',['postman','milkman','policeman','taxi driver']],
  ['picture','nurse',['nurse','hairdresser','policewoman','keyboard operator']],
  ['meaning','mechanic',['机械师；修理机器的人','工程师','理发师','电脑录入员']],
  ['picture','hairdresser',['hairdresser','nurse','mechanic','air hostess']],
  ['meaning','housewife',['家庭主妇','女空乘','女警察','电脑录入员']],
  ['english','milkman',['milkman','postman','policeman','mechanic']]
 ];
 const englishByMeaning=Object.fromEntries(WORDS.map(w=>[w.cn,w.en]));
 Object.assign(englishByMeaning,{'法国（人）的':'French','德国（人）的':'German','中国（人）的':'Chinese'});
 const questions={
  // Keep the old route for bookmarks, but use new question IDs and completion
  // signatures: a listening result cannot count as a vocabulary answer.
  listen:vocabulary.map(([kind,en,options])=>{
   const word=WORDS.find(w=>w.en===en),answer=kind==='meaning'?word.cn:en;
   const prompt=kind==='meaning'?`${en}\n选出这个词的意思。`:kind==='picture'?'看图，选出对应的职业。':`${word.cn}\n选出对应的英文。`;
   const target=kind==='meaning'?'理解词义':kind==='picture'?'看图认词':'选择英文';
   const choices=options.map(value=>[value,value===answer?'':kind==='meaning'?`${value} 对应 ${englishByMeaning[value]}；${en} 表示${word.cn}。`:`${value} 表示${WORDS.find(w=>w.en===value).cn}；这里要选 ${en}。`]);
   return q('vocab-'+en.replaceAll(' ','-'),target+' '+en,prompt,choices,answer,`${en} 表示${word.cn}。`,'','Lesson7–8 新词',target+'；本轮每个新词只考一次，不整组反向重考',{
    presentation:'vocabulary',...(kind==='picture'?{image:word.image,imageAlt:'职业人物图'}:{})
   });
  }),
  roles:[
   q('story-job','区分学习身份、国籍与职业','Robert 的哪一句话在介绍自己的职业？',[["I'm an engineer.",''],['I am a new student.','student 说明学习身份；Robert 还另说了自己的职业。'],["I'm Italian.",'Italian 说明国籍，不是职业。']],"I'm an engineer.",'engineer 是工程师；学生身份和职业可以同时成立。','找出表示工作名称的那句话。','Lesson7 D01、D10、D16','从同一个人的三个信息中识别职业'),
   q('story-teacher','理解否定回答','Sophie 是老师吗？',[["No, she isn't.",''],['Yes, she is.','Sophie 回答 No, I’m not.，不是老师。'],["No, he isn't.",'这里说的是 Sophie，用 she。']],"No, she isn't.",'她说 No, I’m not.，接着介绍自己是 keyboard operator。','回想 Are you a teacher? 后的回答。','Lesson7 D11–D14','识别否定，并在谈论她时换成 she'),
   q('story-turns','追踪对话双方','两次 “What’s your job?” 都是同一个人在问吗？',[['不同，两人各问一次',''],['是，都是 Robert','第二次由 Sophie 问 Robert。'],['是，都是 Sophie','第一次由 Robert 问 Sophie。']],'不同，两人各问一次','Robert 先问 Sophie，Sophie 再问 Robert。','看两次问句旁边的人名。','Lesson7 D13–D16','同一句话的 you 随对话对象改变')
  ],
  reply:[
   q('reply-nationality','按开放问题回答','What nationality are you?',[["I'm Italian.",''],["I'm an engineer.",'engineer 是职业；nationality 问国籍。'],["My name's Robert.",'这句介绍姓名；nationality 问国籍。']],"I'm Italian.",'nationality 问国籍；Italian 表示意大利（人）的。','想一想 nationality 在问哪一种信息。','Lesson7 D09–D10','区别姓名、国籍和职业，不重做旧选择问句'),
   q('reply-no','从 you 问到 I 答','你扮演 Robert（engineer）。对方问：\nAre you a teacher?',[["No, I'm not.",''],['Yes, I am.','人物卡是 engineer，不是 teacher。'],["No, he isn't.",'对方在问你，回答自己用 I。']],"No, I'm not.",'对方问 you，自己回答用 I；工程师不是这张卡所说的 teacher。','现在是你在回答自己的情况。','明确的角色练习情境','否定事实并转换问答人称')
  ],
  be:[
   q('be-name','区分 my name 与 I','My name ___ Robert. I ___ Italian.',[['is / am',''],['am / am','My name 的主语是 name，用 is。'],['is / is','I 后用 am。'],['am / is','My name 用 is，I 用 am。']],'is / am','My name is…；I am…，不能看到 my 就选 am。','分别找出两个空格前的主语。','Lesson8 Written A1','相邻两句的主语不同，不能整行套同一个词'),
   q('be-negative','姓名与代词的否定和肯定','Sophie ___ not Italian. She ___ French.',[['is / is',''],['am / is','Sophie 用 is，am 与 I 连用。'],['is / am','She 用 is，am 与 I 连用。']],'is / is','Sophie 和后面的 She 都指同一个人，用 is；not 只是说明否定。','两句分别在介绍谁？先找主语，再选与它搭配的 be 动词。','Lesson8 Written A2','核对否定与继续指代，完整A3留在线下和示范')
  ],
  interview:[
   q('ask-his','向别人问他的职业','你和 Sophie 聊天，想问她 Robert 是做什么工作的。',[["What's his job?",''],["What's your job?",'your 会问到 Sophie 本人。'],["What's her job?",'这里想问的是 Robert，用 his。']],"What's his job?",'向 Sophie 问 Robert 的职业，用 What’s his job?。','想问的人是 Robert，不是眼前的 Sophie。','Lesson8 Written B engineer示范；明确人物情境','从直接问你转向向别人问他'),
   q('ask-her','根据 her 对应人称并用 an','人物卡写着“她：air hostess”。\nIs ___ ___ air hostess?',[['she / an',''],['he / an','人物卡说她，用 she。'],['she / a','air 以元音开头，用 an。']],'she / an','Is she an air hostess?；根据人物卡用 she，air 前用 an。','先核对人物，再看空格后 air 的起始音。','Lesson8 Written B4','把新的人物问法与一个已教冠词对比结合，不另刷十次')
  ],
  trans:[
   q('build-direct','完整职业问答','你问对方做什么工作；对方说自己是工程师。',undefined,"What's your job? I'm an engineer.",'直接问对方用 your；对方回答自己用 I’m。','先问对方的职业，再由对方介绍自己的工作。','Lesson7 D15–D16的角色换位','撤去完整英文答案，独立组织两个说话回合',{type:'order',tokens:["What's",'your job?',"I'm",'an engineer.']}),
   q('build-confirm','谈论他并确认职业','这位男士是出租车司机。向旁人确认，再由旁人肯定回答。',undefined,'Is he a taxi driver? Yes, he is.','谈他用 Is he…?；肯定回答为 Yes, he is.。','问题从 Is he 开始，回答从 Yes 开始。','Lesson8 Written B3；人物明确','从问答卡转向独立组织第三人称确认与回答',{type:'order',tokens:['Is','he','a taxi driver?','Yes,','he is.']})
  ],
  exam:[
   q('exam-read','从英文介绍提取国籍和职业',"I'm Italian. I'm a nurse.\n为这位新朋友选一份记录。",[['意大利人；护士',''],['法国人；护士','第一句说 Italian，不是 French。'],['意大利人；工程师','第二句说 nurse，不是 engineer。']],'意大利人；护士','Italian 介绍国籍，nurse 介绍职业；这位新朋友不是课文中的 Robert。','先找国籍词，再找职业词。','新的英文阅读情境','同时核对两项信息，不从已学原文人物套答案'),
   q('exam-address','随说话对象改变问法','She is a mechanic.\n你走到她面前，想确认她的职业。',['Are you a mechanic?','Is she a mechanic?','What nationality are you?'].map((x,i)=>[x,['','这句仍是在向别人问她；现在直接问她，用 you。','nationality 问国籍，不是职业。'][i]]),'Are you a mechanic?','走到她面前直接询问，用 Are you…?；mechanic 不限定性别。','现在是问本人，还是向别人打听？','新情境明确以she介绍一位mechanic','从旁人视角回到直接交谈，改变判断条件'),
   q('exam-intro','整合姓名、职业与缩写','你扮演 Ben，职业是工程师。用缩写介绍名字和职业。',undefined,"My name's Ben. I'm an engineer.",'My name’s 是 My name is；I’m 是 I am。工程师前用 an。','名字在 My name’s 后，职业在 I’m 后。','新角色Ben，不作为课文事实','间隔后仅抽样一次缩写与搭配，不重复整组填空',{type:'order',tokens:['My',"name's",'Ben.',"I'm",'an engineer.']})
  ]
 };
 const stages=[
  {id:'l1',title:'采访前准备',activities:[['words','采访小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'和朋友聊一聊',activities:[['text','朋友小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
  {id:'l3',title:'问答有办法',activities:[['phrases','采访小锦囊','speech'],['reply','问答接力','question'],['be','介绍填一填','cards']],required:['reply','be']},
  {id:'l4',title:'职业采访台',activities:[['models','职业小图册','cards'],['interview','替朋友问一问','people'],['trans','词块拼装台','order']],required:['interview','trans']},
  {id:'l5',title:'采访小达人',activities:[['exam','采访小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
 ];
 const definition={id:'unit7-8',version:1,title:'新朋友采访站',path:'/unit7-8/',start:'learn/words',progress:{learningKey:'canran:unit7-8:learning:v1'},learning:{WORDS,PEOPLE,DIALOGUE,AUDIO,PHRASES,REFERENCE,JOBS,INTERVIEWS,FEEDBACK:root.CanranCore.courseCatalog.requirePublishedCourse('lesson49').learning.FEEDBACK},objects:WORDS,stages,questions};
 root.CanranCore.unit78=definition;if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
