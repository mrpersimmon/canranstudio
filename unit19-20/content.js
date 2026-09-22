(function(root){
 'use strict';
 const image=name=>'/assets/unit19-20/'+name+'.svg';
 const source='《新概念英语智慧版1》纸页38–41（PDF71–74）';
 const WORDS=[
  ['tired','累的；疲倦的','/taɪrd/'],['thirsty','口渴的','/ˈθɝːsti/'],['children','孩子们（child 的复数）','/ˈtʃɪldrən/'],['boy','男孩','/bɔɪ/'],['mum','妈妈','/mʌm/'],['ice cream','冰淇淋','/ˈaɪs ˌkriːm/'],
  ['matter','事情；本句问“怎么了？”','/ˈmæt̬ɚ/',"What's the matter?"],['sit down','坐下','/sɪt daʊn/'],['right','本句：好的；可以的','/raɪt/','all right'],['child','孩子（一个）','/tʃaɪld/'],['all right','好；没事','/ˌɑːl ˈraɪt/','Are you all right now?'],
  ['big','大的','/bɪɡ/'],['small','小的','/smɑːl/'],['open','开着的','/ˈoʊpən/'],['shut','关着的','/ʃʌt/'],['light','轻的（重量）','/laɪt/'],['heavy','重的','/ˈhevi/'],['long','长的','/lɑːŋ/'],['shoe','鞋子（一只）','/ʃuː/'],['grandfather','祖父；外祖父','/ˈɡrænfɑːðɚ/'],['grandmother','祖母；外祖母','/ˈɡrænmʌðɚ/'],
  ['clean','干净的','/kliːn/'],['dirty','脏的','/ˈdɝːt̬i/'],['hot','热的','/hɑːt/'],['cold','冷的','/koʊld/'],['fat','胖的','/fæt/'],['thin','瘦的','/θɪn/'],['old','年老的；旧的（看语境）','/oʊld/'],['young','年轻的','/jʌŋ/'],['new','新的','/nuː/'],['short','矮的；短的（看语境）','/ʃɔːrt/'],['tall','高的','/tɑːl/'],['them','他们／她们／它们','/ðem/','Look at them!'],['nice','本句：好吃的','/naɪs/','These ice creams are nice.']
 ].map(([en,cn,ph,example=''])=>({en,cn,ph,example,image:image(en.replaceAll(' ','-')),source}));
 const PEOPLE={mother:{name:'妈妈',image:image('mother')},girl:{name:'女孩',image:image('girl')},boy:{name:'男孩',image:image('boy')},children:{name:'孩子们',image:image('children')}};
 const DIALOGUE=[
  ['mother',"What's the matter, children?",'怎么啦，孩子们？'],['girl',"We're tired ...",'我们累了……'],['boy','... and thirsty, Mum.','……口也渴了，妈妈。'],
  ['mother','Sit down here.','坐在这儿吧。'],['mother','Are you all right now?','你们现在好些了吗？'],['boy',"No, we aren't.",'不，还没有。'],
  ['mother',"Look! There's an ice cream man.",'瞧！有个卖冰淇淋的。'],['mother','Two ice creams please.','请拿两份冰淇淋。'],['mother','Here you are, children.','拿着，孩子们。'],
  ['children','Thanks, Mum.','谢谢，妈妈。'],['girl','These ice creams are nice.','这些冰淇淋真好吃。'],['mother','Are you all right now?','你们现在好了吗？'],['children','Yes, we are, thank you!','是的，现在好了，谢谢你！']
 ].map(([person,text,cn],i)=>({id:'L19-D'+String(i+1).padStart(2,'0'),person,who:person==='mother'?'teacher':'student',text,cn,source:source+'；Lesson19原文'}));
 const PHRASES=[
  {en:"What's the matter?",cn:'关心对方：怎么了？',image:image('matter')},
  {en:'Sit down here.',cn:'邀请对方：坐在这里吧。',image:image('sit-down')},
  {en:'Are you all right now?',cn:'你们现在好些了吗？',image:image('all-right')},
  {en:'Look at them!',cn:'看看他们／她们／它们！具体指谁，要看前文。',image:image('them')}
 ];
 const GALLERY=[
  ['clean','干净的孩子们','clean-children'],['dirty','脏了的孩子们','dirty-children'],['hot','感到热的邮递员们','hot-postmen'],['cold','感到冷的孩子们','cold-children'],
  ['fat','胖的理发师们','fat-hairdressers'],['thin','瘦的理发师们','thin-hairdressers'],['big','大的鞋子','big-shoes'],['small','小的鞋子','small-shoes'],
  ['open','开着的店铺','open-shops'],['shut','关着的店铺','shut-shops'],['light','轻的箱子','light-cases'],['heavy','重的箱子','heavy-cases'],
  ['old','年老的人','old-people'],['young','年轻的人','young-people'],['old','旧的帽子','old-hats'],['new','新的帽子','new-hats'],
  ['short','矮的警察们','short-policemen'],['tall','高的警察们','tall-policemen'],['short','短的裤子','short-trousers'],['long','长的裤子','long-trousers']
 ].map(([adjective,cn,picture])=>({en:`They're ${adjective}.`,cn,image:image(picture),source:source+'；Lesson20图示'}));
 const model=(subject,wrong,right,picture)=>({subject,wrong,right,en:`Are ${subject} ${wrong} or ${right}? They're not ${wrong}. They're ${right}.`,cn:'',image:image(picture),source:source+'；Lesson20 Written B'});
 const MODEL_EXAMPLE=model('his shoes','dirty','clean','clean-shoes');
 const MODELS=[
  ['the children','tired','thirsty','thirsty-children'],['the postmen','cold','hot','hot-postmen'],['the hairdressers','thin','fat','fat-hairdressers'],['the shoes','small','big','big-shoes'],['the shops','shut','open','open-shops'],['his cases','heavy','light','light-cases'],['grandmother and grandfather','young','old','old-people'],['their hats','old','new','new-hats'],['the policemen','short','tall','tall-policemen'],['his trousers','short','long','long-trousers']
 ].map(row=>model(...row));
 const REFERENCE=[
  ['Those children ___ tired.','are'],['Their mother ___ tired, too.','is'],['That ice cream man ___ very busy.','is'],['His ice creams ___ very nice.','are'],["What's the matter, children? We ___ thirsty.",'are'],["What's the matter, Tim? I ___ tired.",'am']
 ].map(([prompt,answer])=>({prompt,answer,en:prompt.replace('___',answer),source:source+'；Lesson20 Written A'}));
 const q=(id,target,prompt,options,answer,explanation,hint,basis,decision,extra={})=>({id:'u1920-v1-'+id,target,prompt,options:options?.map(o=>o[0]),answer,explanation,hint,source:source+'；'+basis,decision,distractorReasons:options?Object.fromEntries(options.filter(o=>o[0]!==answer)):undefined,...extra});
 const vocab=(id,prompt,answer,wrong,basis,extra={})=>q('vocab-'+id,'理解 '+id+' 的本课含义',prompt,[[answer,''],...wrong],answer,'这里表示“'+answer+'”。','',basis,'新词或必要语境各一次，不整组重复翻译',{presentation:'vocabulary',...extra});
 const questions={
  listen:[
   vocab('tired','tired\n选出这个词的意思。','累的；疲倦的',[['口渴的','口渴是 thirsty，不是 tired。'],['年轻的','年轻是 young，描述年龄。'],['忙碌的','忙碌是 busy，不等于感到累。']],'Lesson19词表'),
   vocab('thirsty','thirsty\n选出这个词的意思。','口渴的',[['饥饿的','饥饿是 hungry，口渴是 thirsty。'],['累的','累是 tired。'],['冷的','冷是 cold。']],'Lesson19词表'),
   vocab('children','children\n选出这个词的意思。','孩子们',[['一个孩子','一个孩子是 child；children 是复数。'],['妈妈','妈妈是 mum。'],['老师们','老师们是 teachers。']],'Lesson19词表'),
   vocab('boy','boy\n选出这个词的意思。','男孩',[['女孩','女孩是 girl。'],['成年男子','成年男子是 man。'],['祖父','祖父或外祖父是 grandfather。']],'Lesson19词表'),
   vocab('mum','mum\n选出这个词的意思。','妈妈',[['爸爸','爸爸是 dad。'],['祖母','祖母或外祖母是 grandmother。'],['女孩','女孩是 girl。']],'Lesson19词表'),
   vocab('ice cream','看看图，选出英文。','ice cream',[['shoe','shoe 是鞋子，不是冰淇淋。'],['book','book 是书，不是冰淇淋。'],['passport','passport 是护照，不是冰淇淋。']],'Lesson19词表',{image:image('ice-cream'),imageAlt:'一份粉色球形甜点装在蛋卷里'}),
   vocab('matter',"What's the matter?\n这句话在问什么？",'怎么了？',[['你是谁？','你是谁用 Who are you? 来问。'],['你几岁？','年龄用 How old ...? 来问。'],['你的东西在哪？','这句话没有询问物品位置。']],'Lesson19 D01与注释'),
   vocab('sit down','sit down\n选出这个短语的意思。','坐下',[['站起来','站起来是 stand up。'],['看一看','看一看是 look。'],['再见','再见是 goodbye。']],'Lesson19词表'),
   vocab('right','Are you all right now?\n妈妈在问什么？','你们现在好些了吗？',[['你们的答案正确吗？','这里 all right 问身体状态，不问答案对错。'],['你们在右边吗？','这里的 right 不指右边。'],['你们是谁？','本句不是问身份。']],'Lesson19 D05 / D12'),
   vocab('big / small','big / small\n这两个词分别表示什么？','大的 / 小的',[['高的 / 矮的','身高高矮是 tall / short，不是大小。'],['长的 / 短的','长度长短是 long / short。'],['重的 / 轻的','重量轻重不是体积大小。']],'Lesson20词表'),
   vocab('open / shut','开着的 / 关着的\n选出对应的英文。','open / shut',[['shut / open','两个意思的顺序反了。'],['old / new','old / new 是旧的 / 新的。'],['hot / cold','hot / cold 是热的 / 冷的。']],'Lesson20词表'),
   vocab('light / heavy','箱子的重量：light / heavy\n分别表示什么？','轻的 / 重的',[['浅色的 / 深色的','light 在这里指重量，不是颜色；heavy 不表示深色。'],['小的 / 大的','大小不能直接决定轻重。'],['新的 / 旧的','新旧是 new / old。']],'Lesson20图11–12'),
   vocab('long','长的（描述裤子长度）\n选出对应的英文。','long',[['tall','tall 描述身高等竖直高度，不用于本句裤子的长度。'],['new','new 表示新的。'],['old','old 描述物品时表示旧的。']],'Lesson20词表'),
   vocab('shoe','shoe\n选出这个词的意思。','鞋子',[['裤子','裤子是 trousers。'],['帽子','帽子是 hat。'],['外套','外套是 coat。']],'Lesson20词表'),
   vocab('grandfather / grandmother','grandfather / grandmother\n分别表示哪两位亲人？','祖父或外祖父 / 祖母或外祖母',[['爸爸 / 妈妈','这是父母，不是上一辈的祖辈。'],['哥哥 / 姐姐','这是兄弟姐妹，不是祖辈。'],['叔叔 / 阿姨','这是其他长辈，不是祖父母或外祖父母。']],'Lesson20词表')
  ],
  roles:[
   q('story-thanks','从完整故事找出道谢原因','课文中，孩子们为什么向妈妈道谢？',[
    ['妈妈给了他们冰淇淋。',''],['妈妈给他们买了鞋。','课文没有买鞋这件事。'],['妈妈把帽子递给他们。','课文递给孩子们的是冰淇淋，不是帽子。']
   ],'妈妈给了他们冰淇淋。','妈妈买了冰淇淋并递给孩子们，他们说 Thanks, Mum.。','找到 Thanks, Mum. 前面发生了什么。','Lesson19读前问题与D08–D10','跨句找到原因'),
   q('story-first','区分两次同样问句的不同语境','孩子们刚坐下时，妈妈第一次问：\nAre you all right now?\n男孩怎么回答？',[
    ["No, we aren't.",''],['Yes, we are, thank you!','这是吃了冰淇淋后，第二次被问时的回答。'],['Thanks, Mum.','这是妈妈递来冰淇淋时孩子们的道谢。']
   ],"No, we aren't.",'第一次询问时，男孩说 No, we aren’t.。','只回看 Sit down here. 后面紧接的问答。','Lesson19 D04–D06','相同问句定位先后，不靠句形猜'),
   q('story-nice','在食物语境理解 nice','These ice creams are nice.\n这里的 nice 表示什么？',[
    ['好吃的',''],['友好的','形容人友好时可以用 nice；这里在说冰淇淋的味道。'],['漂亮的','这句是在夸冰淇淋好吃，不是在谈外观。']
   ],'好吃的','孩子在夸冰淇淋好吃。','看被形容的是人、外观，还是正在吃的食物。','Lesson19 D11','词义取决于搭配对象')
  ],
  observe:[
   q('old-context','区分 old 形容人和物品','Look at these hats. They’re old.\n这里的 old 表示什么？',[
    ['旧的',''],['年老的','这里形容帽子，不是人的年龄。'],['年轻的','年轻是 young，且这里说的是帽子。']
   ],'旧的','old 形容这些帽子，意思是旧的。','先找出这句话在描述什么。','Lesson20图13与15','同词的不同语境'),
   q('short-context','区分短和矮','Look at their trousers. They’re short.\n这里的 short 表示什么？',[
    ['短的',''],['矮的','这里描述裤子的长度，不是人的身高。'],['小的','小的是 small，short 在这里是长度短。']
   ],'短的','short 形容裤子时表示短。','看这句描述的是衣物长度，还是人的身高。','Lesson20图17与19','区分长度与高度'),
   q('them-context','理解 Look at them 的宾语指代','Look at these shoes. Look at them!\nthem 指什么？',[
    ['这些鞋子',''],['妈妈','前一句说的是 shoes，没有提到妈妈。'],['孩子们','前一句说的是 shoes，不是 children。']
   ],'这些鞋子','them 指前一句的 these shoes。','回看前一句请我们看的是什么。','Lesson20标题与图7–8','复数宾语回指')
  ],
  be:[
   q('be-subject','按实际主语选择 are 与 is','Those children ___ tired.\nTheir mother ___ tired, too.\n两个空依次填什么？',[
    ['are / is',''],['is / are','children 是复数，mother 是一个人，不能颠倒。'],['are / are','their 说明谁的妈妈；主语中心 mother 仍是单数。']
   ],'are / is','children 用 are；their mother 指一个妈妈，用 is。','每句说的是几个孩子，还是几位妈妈？','Lesson20 Written A1–A2','不按所属词 their 误判复数'),
   q('be-adjective','复数物品配 they，形容词不加 s','两只鞋子很干净，哪句话写对了？',[
    ["They're clean.",''],["They're cleans.",'clean 是形容词，不随复数主语加 s。'],["It's clean.",'两只鞋子在这里用 They，不是单数 It。']
   ],"They're clean.",'They 指两只鞋子；形容词 clean 保持原形。','先检查说的是一只还是两只，再看看描述状态的词有没有变化。','Lesson20 Written B例题','对比上一课名词复数，明确形容词不变')
  ],
  trans:[
   q('build-sit','组织祈使句','邀请孩子们：“坐在这里吧。”',undefined,'Sit down here.','Sit down here. 表示坐在这里。','先说动作，再说在哪里。','Lesson19 D04','祈使句，不加多余主语',{type:'order',tokens:['Sit','down','here.']}),
   q('build-care','组织关心状态的一般疑问句','问孩子们：“你们现在好些了吗？”',undefined,'Are you all right now?','Are you all right now? 用来询问当前状态。','先用疑问开头，再说你们、状态和现在。','Lesson19 D05 / D12','关心人的一般疑问句',{type:'order',tokens:['Are','you','all right','now?']}),
   q('build-clean','用缩写后的 not 否定再明确实际状态','描述鞋子：“它们不脏。它们很干净。”',undefined,"They're not dirty. They're clean.",'在 They’re 后加 not 表示否定，再说实际状态。','先说不是哪种状态，再说实际是哪种状态；留意句号。','Lesson20 Written B例题','缩写后否定，与已有 They aren’t 形式对应',{type:'order',tokens:["They're",'not','dirty.',"They're",'clean.']})
  ],
  exam:[
   q('exam-children','根据新资料同时记录肯定和否定状态','新来的孩子们说：\nWe’re tired. We aren’t thirsty.\n哪条记录符合他们说的话？',[
    ['累了；不渴',''],['累了；口渴','忽略了第二句的否定，不能照搬课文原情节。'],['不累；口渴','两句的肯定和否定都颠倒了。']
   ],'累了；不渴','第一句说累，第二句明确说不渴。','两句分开看，留意哪里有表示否定的部分。','Lesson19结构；新情境','改变原故事状态以检验理解'),
   q('exam-shoes','只记录英文已说明的两个属性','新资料：\nThese shoes are big. They aren’t new.\n哪条记录符合这两句话？',[
    ['大；不是新的',''],['小；不是新的','第一句是 big，不是 small。'],['大；很干净','原文没有说是否干净，不能添加未说明的信息。']
   ],'大；不是新的','两句话只说明鞋子大、不是新的。','分别核对大小和新旧，不添加没有说过的特点。','Lesson20结构；新资料','同一物品多属性，限制无根据推断')
  ]
 };
 const stages=[
  {id:'l1',title:'公园歇一歇',activities:[['words','公园小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'跟着故事走',activities:[['text','公园小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
  {id:'l3',title:'仔细看一看',activities:[['phrases','关心小锦囊','speech'],['observe','词义观察员','question']],required:['observe']},
  {id:'l4',title:'把状态说清楚',activities:[['models','对比小画册','cards'],['be','句子小帮手','cards'],['trans','词块拼装台','order']],required:['be','trans']},
  {id:'l5',title:'再出发',activities:[['exam','公园小挑战','star'],['certificate','我的单元证书','star']],required:['exam']}
 ];
 const definition={id:'unit19-20',version:1,title:'冰淇淋休息站',path:'/unit19-20/',start:'learn/words',progress:{learningKey:'canran:unit19-20:learning:v1'},objects:WORDS,stages,questions,
  learning:{WORDS,PEOPLE,DIALOGUE,PHRASES,GALLERY,MODELS,MODEL_EXAMPLE,REFERENCE,FEEDBACK:root.CanranCore.courseCatalog.requirePublishedCourse('lesson49').learning.FEEDBACK}};
 root.CanranCore.unit1920=definition;
 if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);
