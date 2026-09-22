(function (root) {
  'use strict';
  const image = name => '/assets/unit5-6/' + name + '.svg';
  const recordingRevisions = { 'l05-w01': 'l05-w01-v2', 'l05-d12': 'l05-d12-v2' };
  const recording = name => 'unit5-6/audio/' + (recordingRevisions[name] || name) + '.mp3';
  const source = '《新概念英语智慧版1》纸页 10–13（PDF 43–46），按原文或题目明示条件';
  const word = (en, cn, ph, audio, art, example = '') => ({ en, cn, ph, audio: recording(audio), image: image(art), example, source });
  const WORDS = [
    word('French','法国（人）的','/frentʃ/','l05-w07','french'),
    word('German','德国（人）的','/ˈdʒɝːmən/','l05-w08','german'),
    word('Japanese','日本（人）的','/ˌdʒæpəˈniːz/','l05-w11','japanese'),
    word('South Korean','韩国（人）的','/ˌsaʊθ kəˈriːən/','l05-w12','south-korean'),
    word('Chinese','中国（人）的','/tʃaɪˈniːz/','l05-w13','chinese'),
    word('Swedish','瑞典（人）的','/ˈswiːdɪʃ/','l06-w02','swedish'),
    word('English','英格兰的；本课介绍汽车品牌','/ˈɪŋɡlɪʃ/','l06-w03','english'),
    word('American','美国（人）的','/əˈmerɪkən/','l06-w04','american'),
    word('student','学生','/ˈstuːdənt/','l05-w06','student'),
    word('Mr.','先生；放在姓氏或姓名前','/ˈmɪstɚ/','l05-w01','blake','Mr. Blake'),
    word('Miss','小姐；本课对 Sophie 的称呼','/mɪs/','l05-w04','sophie','Miss Sophie Dupont'),
    word('morning','早晨','/ˈmɔːrnɪŋ/','l05-w03','morning'),
    word('good','好的；Good morning. 表示早上好','/ɡʊd/','l05-w02','morning'),
    word('new','新的；a new student 是新同学','/nuː/','l05-w05','new'),
    word('nice','美好的；在见面语中表达高兴','/naɪs/','l05-w09','meet'),
    word('meet','结识；见到','/miːt/','l05-w10','meet'),
    word('too','也；前后有相同情况','/tuː/','l05-w14','too'),
    word('make','品牌；本课是名词','/meɪk/','l06-w01','make'),
    word('Volvo','沃尔沃','/ˈvɑːlvoʊ/','l06-w05','volvo'),
    word('Peugeot','标致','/pɜːˈʒoʊ/','l06-w06','peugeot'),
    word('Mercedes','梅赛德斯','/mɚˈseɪdiːz/','l06-w07','mercedes'),
    word('Toyota','丰田','/tɔɪˈjoʊt̬ə/','l06-w08','toyota'),
    word('Ford','福特','/fɔːrd/','l06-w09','ford'),
    word('Mini','迷你','/ˈmɪni/','l06-w10','mini')
  ];
  const PEOPLE = {
    blake:{name:'Mr. Blake',cn:'布莱克老师',image:image('blake')},
    students:{name:'Students',cn:'同学们',image:image('students')},
    sophie:{name:'Sophie',cn:'索菲娅',image:image('sophie')},
    hans:{name:'Hans',cn:'汉斯',image:image('hans')},
    naoko:{name:'Naoko',cn:'直子',image:image('naoko')},
    chang:{name:'Chang-woo',cn:'昌宇',image:image('chang')},
    luming:{name:'Luming',cn:'鲁明',image:image('luming')},
    xiaohui:{name:'Xiaohui',cn:'晓惠',image:image('xiaohui')}
  };
  const DIALOGUE = [
    ['blake','students','Good morning.','早上好。'],
    ['students','students','Good morning, Mr. Blake.','早上好，布莱克老师。'],
    ['blake','sophie','This is Miss Sophie Dupont.','这位是索菲娅·杜邦小姐。'],
    ['blake','sophie','Sophie is a new student.','索菲娅是一位新同学。'],
    ['blake','sophie','She is French.','她是法国人。'],
    ['blake','hans','Sophie, this is Hans.','索菲娅，这位是汉斯。'],
    ['blake','hans','He is German.','他是德国人。'],
    ['hans','hans','Nice to meet you.','很高兴见到你。'],
    ['blake','naoko','And this is Naoko.','这位是直子。'],
    ['blake','naoko',"She's Japanese.",'她是日本人。'],
    ['naoko','naoko','Nice to meet you.','很高兴见到你。'],
    ['blake','chang','And this is Chang-woo.','这位是昌宇。'],
    ['blake','chang',"He's South Korean.",'他是韩国人。'],
    ['chang','chang','Nice to meet you.','很高兴见到你。'],
    ['blake','luming','And this is Luming.','这位是鲁明。'],
    ['blake','luming',"He's Chinese.",'他是中国人。'],
    ['luming','luming','Nice to meet you.','很高兴见到你。'],
    ['blake','xiaohui','And this is Xiaohui.','这位是晓惠。'],
    ['blake','xiaohui',"She's Chinese, too.",'她也是中国人。'],
    ['xiaohui','xiaohui','Nice to meet you.','很高兴见到你。']
  ].map(([person,focus,text,cn],i)=>({id:'L05-D'+String(i+1).padStart(2,'0'), who:person==='blake'?'teacher':'student',person,focus,text,cn,audio:recording('l05-d'+String(i+1).padStart(2,'0')),source:'Lesson 5 纸页 10'}));
  const AUDIO = Object.fromEntries(WORDS.map(w=>[w.en,w.audio]));
  DIALOGUE.forEach(line=>{if(!AUDIO[line.text])AUDIO[line.text]=line.audio;});
  const CARS = [['Volvo','Swedish','沃尔沃 · 瑞典'],['Peugeot','French','标致 · 法国'],['Mercedes','German','梅赛德斯 · 德国'],['Toyota','Japanese','丰田 · 日本'],['Mini','English','迷你 · 英格兰'],['Ford','American','福特 · 美国']].map(([make,nationality,cn],i)=>{
    const en=`It's a ${make}. (${nationality})`; AUDIO[en]=recording('l06-p'+String(i+1).padStart(2,'0'));
    return {en,cn,make,nationality,image:image(make.toLowerCase())};
  });
  const modelRows = [
    ['Sophie','she','French','Swedish','sophie'],['Volvo','it','Swedish','French','volvo'],
    ['Naoko','she','Japanese','German','naoko'],['Peugeot','it','French','German','peugeot'],
    ['Hans','he','German','French','hans'],['Xiaohui','she','Chinese','Japanese','xiaohui'],
    ['Mini','it','English','American','mini'],['Chang-woo','he','South Korean','Japanese','chang'],
    ['Luming','he','Chinese','English','luming'],['Mercedes','it','German','French','mercedes'],
    ['Toyota','it','Japanese','Chinese','toyota'],['Ford','it','American','English','ford']
  ];
  const CHOICE_MODELS = modelRows.map(([name,pronoun,right,wrong,art],i)=>{
    const noun=pronoun==='it'?'car':'student', cap=pronoun[0].toUpperCase()+pronoun.slice(1);
    const phrase=nationality=>(['English','American'].includes(nationality)?'an ':'a ')+nationality+' '+noun;
    const question=`Is ${pronoun} ${phrase(right)} or ${phrase(wrong)}?`;
    const answer=`${cap} isn't ${phrase(wrong)}. ${cap}'s ${phrase(right)}.`;
    AUDIO[question]=recording('model-'+String(i+1).padStart(2,'0')+'-q');AUDIO[answer]=recording('model-'+String(i+1).padStart(2,'0')+'-a');
    return {name,pronoun,right,wrong,image:image(art),question,answer,source:'Lesson 6 Written B：纸页 13'};
  });
  const REFERENCE = [
    {en:"Alice is a student. She isn't German. She is French.",cn:'女同学 Alice：用 she 继续说她',image:image('student'),file:'reference-alice'},
    {en:'This is her car. It is a French car.',cn:'这是她的汽车；说汽车用 it',image:image('peugeot'),file:'reference-her-car'},
    {en:"Hans is a student. He isn't French. He is German.",cn:'Hans：课文用 he 说他',image:image('hans'),file:'reference-hans'},
    {en:'This is his car. It is a German car.',cn:'这是他的汽车；说汽车仍用 it',image:image('mercedes'),file:'reference-his-car'}
  ];
  REFERENCE.forEach(item=>{AUDIO[item.en]=recording(item.file);});
  AUDIO['What make is it?']=recording('what-make');
  AUDIO['This is her car. It is French.']=recording('challenge-car');
  const PHRASES=[
    {en:'Good morning.',cn:'早晨见面，问一声好',image:image('morning')},
    {en:'Nice to meet you.',cn:'初次见面，表达高兴',image:image('meet')},
    {en:'This is Miss Sophie Dupont.',cn:'把一位新朋友介绍给大家',image:image('sophie')},
    {en:"She's Chinese, too.",cn:'她也是中国人：与前面的 Luming 相同',image:image('too')}
  ];
  const question=(id,target,prompt,options,answer,explanation,hint='',extra={})=>({id:'u56-v1-'+id,target,prompt,options,answer,explanation,hint,source,...extra});
  const pictureOptions=Object.fromEntries(WORDS.map(w=>[w.en,w.image]));
  const listenWords=['French','German','Japanese','South Korean','Chinese','Swedish','English','American','student'];
  const questions={
    listen:listenWords.map((en,i)=>{const other=listenWords.filter(v=>v!==en);return question('hear-'+i,'听辨 '+en,'听一听，选出单词。',[en,other[i%8],other[(i+3)%8],other[(i+5)%8]],en,'再听一次，选出对应的词。','',{audioText:en,optionImages:pictureOptions});}),
    roles:[
      question('story-new','找出新同学','故事里，谁是新来的同学？',['Sophie','Mr. Blake','Hans'],'Sophie','老师说“Sophie is a new student.”。','回想 new student 前面的名字。',{optionImages:{Sophie:image('sophie'),'Mr. Blake':image('blake'),Hans:image('hans')}}),
      question('story-chang','核对国籍事实','Chang-woo 是中国人吗？',['不是，他是韩国人','是，他是中国人','不是，他是日本人'],'不是，他是韩国人','老师说“He’s South Korean.”，没有说他是中国人。','回想老师介绍 Chang-woo 的那句话。'),
      question('story-too','结合前文理解 too','老师说“She’s Chinese, too.”。谁和 Xiaohui 一样是中国人？',['Luming','Hans','Naoko'],'Luming','前面刚介绍 Luming：“He’s Chinese.”，too 表示 Xiaohui 也是中国人。','向前回想 Chinese 还介绍了谁。',{optionImages:{Luming:image('luming'),Hans:image('hans'),Naoko:image('naoko')}}),
      question('story-meet','初次见面的回应','Hans 初次见到 Sophie 时说什么？',['Nice to meet you.','Good morning, Mr. Blake.','Pardon?'],'Nice to meet you.','Nice to meet you. 用于初次见面；Hans 这样向 Sophie 问好。','这时是在认识一位新朋友。')
    ],
    refer:[
      question('refer-she','同一人物前后指代','Alice 是一位女同学。\nAlice is a student. ___ isn’t German. ___ is French.\n两处都选哪个词？',['She','He','It'],'She','这里两句都继续说女同学 Alice，用 She；不是在说她的汽车。','先看这两句继续介绍的是谁。'),
      question('refer-he','延续课文中的人物指代','Hans is a student. ___ is German.',['He','She','It'],'He','课文介绍 Hans 用 He is German.，这里仍用 He。','回想课文中老师怎样继续介绍 Hans。'),
      question('refer-it','从所属人物切换到物品','This is her car. ___ is a French car.',['It','She','He'],'It','her car 是“她的汽车”；接着说汽车用 It，不能因为 her 就选 She。','继续介绍的是主人，还是汽车？')
    ],
    articles:[
      question('article-a','辅音开头的名词短语',"She's ___ French student.",['a','an','不填'],'a','a French student 表示一位法国学生；紧接着的 French 以辅音 /f/ 开头。','student 前有 French；先听 French 的开头。'),
      question('article-an','元音开头的名词短语',"It's ___ English car.",['an','a','不填'],'an','an English car；紧接着的 English 以元音 /ɪ/ 开头，不是看后面的 car。','看紧接空格的 English。'),
      question('article-none','国籍形容词直接作表语','She is ___ French.',['不填','a','an'],'不填','She is French. 已经完整。这里 French 是形容词，后面没有 student，不加 a 或 an。','比较 French 与 a French student。')
    ],
    choice:[
      question('choice-student','明确回答选择问句','Naoko is Japanese.\nIs she a Japanese student or a German student?',['She’s a Japanese student.','Yes, she is.','He’s a Japanese student.'],'She’s a Japanese student.','or 给出两种选择，要说明是哪一种；本题说 Naoko 是日本人，用 She。','要说明选 Japanese 还是 German，不能只说 Yes。'),
      question('choice-make','区分汽车品牌与国别','这辆车的标牌是 Volvo。\nWhat make is it?',["It's a Volvo.","It's Swedish.",'He is German.'],"It's a Volvo.",'make 在这里问品牌，用 It’s a Volvo.；Swedish 说明国别，不是品牌名。','先分清是在问品牌，还是国别。',{image:image('volvo'),imageAlt:'标牌为 Volvo 的汽车'})
    ],
    trans:[
      question('build-question','组织选择问句','想问这位女同学是日本学生还是德国学生。用词块问一问。',undefined,'Is she a Japanese student or a German student?','Is 放在句首，用 or 连接两种选择。','从 Is she 开始，中间用 or。',{type:'order',tokens:['Is','she','a Japanese student','or','a German student?']}),
      question('build-correction','否定后说明正确情况','Mini 的介绍写着 English。用词块说明：不是美国品牌汽车，是英格兰品牌汽车。',undefined,"It isn't an American car. It's an English car.",'先否定 American，再说明 English；汽车用 It，American 和 English 前都用 an。','先说 It isn’t，再用 It’s 说明正确情况。',{type:'order',tokens:['It',"isn't",'an American car.',"It's",'an English car.']})
    ],
    exam:[
      question('exam-hear','在完整录音中追踪指代','听一听，法国的是什么？',['汽车','汽车的女主人','两者都是'],'汽车','It 指前面的 car；这两句话没有说明主人的国籍。','',{audioText:'This is her car. It is French.'}),
      question('exam-two','分别记录人物与汽车信息',"Hans is German. This is his car. It's a Japanese car.\n哪份记录符合？",['Hans 是德国人；汽车是日本品牌','Hans 和汽车都是德国的','Hans 是日本人；汽车是德国品牌'],'Hans 是德国人；汽车是日本品牌','German 介绍 Hans，Japanese 介绍他的汽车；两个对象分别记录。','先分清哪句话说人，哪句话说车。'),
      question('exam-intro','组合问候和人物介绍','早晨向班里介绍 Hans。用词块问好，再介绍他是一位德国学生。',undefined,"Good morning. This is Hans. He's a German student.",'先问候，再用 This is 介绍 Hans，最后用 He’s a German student. 继续说他。','问候在前，人物名字在介绍中，He’s 在后。',{type:'order',tokens:['Good morning.','This is','Hans.',"He's",'a German','student.']}),
      question('exam-known','只根据已知英语材料判断','老师只说：“This is a new student.”\n现在可以确定什么？',['这是一位新同学','这是一位法国同学','这是一位德国同学'],'这是一位新同学','new student 说明是新同学；没有介绍国籍，不能猜成 French 或 German。','只记录这句话实际告诉你的信息。')
    ]
  };
  for(const [activity,items] of Object.entries(questions)) for(const q of items){
    q.source+=(activity==='roles'?'；Lesson 5 原文理解':'；改编练习条件，不新增原文事实');
    if(q.options)q.distractorReasons=Object.fromEntries(q.options.filter(o=>o!==q.answer).map(o=>[o,q.explanation]));
  }
  const stages=[
    {id:'l1',title:'见面前准备',activities:[['words','新朋友小图鉴','cards'],['listen','听音寻宝','audio']],required:['listen']},
    {id:'l2',title:'新朋友来了',activities:[['text','教室小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
    {id:'l3',title:'介绍有办法',activities:[['phrases','见面小锦囊','speech'],['refer','他她它接力','people'],['articles','介绍小标签','cards']],required:['refer','articles']},
    {id:'l4',title:'汽车小展台',activities:[['models','汽车小图册','cards'],['choice','问答小帮手','question'],['trans','词块拼装台','order']],required:['choice','trans']},
    {id:'l5',title:'见面小达人',activities:[['exam','见面小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
  ];
  const definition={id:'unit5-6',version:1,title:'新朋友见面会',path:'/unit5-6/',start:'learn/words',progress:{learningKey:'canran:unit5-6:learning:v1'},
    learning:{WORDS,PEOPLE,DIALOGUE,AUDIO,PHRASES,CARS,CHOICE_MODELS,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requirePublishedCourse('lesson49').learning.FEEDBACK},objects:WORDS,stages,questions};
  root.CanranCore.unit56=definition;
  if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
