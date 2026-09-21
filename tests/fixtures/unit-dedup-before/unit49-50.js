(function (root) {
  'use strict';
  const base = root.CanranCore.courseCatalog.requirePublishedCourse('lesson49').learning;
  const foods = [
    ['tomato','西红柿',"/təˈmɑːtəʊ/"], ['potato','土豆',"/pəˈteɪtəʊ/"],
    ['cabbage','卷心菜',"/ˈkæbɪdʒ/"], ['lettuce','莴苣',"/ˈletɪs/"],
    ['pea','豌豆','/piː/'], ['bean','豆角','/biːn/'], ['pear','梨','/peə/'],
    ['grape','葡萄','/ɡreɪp/'], ['peach','桃','/piːtʃ/']
  ].map(([en,cn,ph]) => ({en,cn,ph,image:'/assets/unit49-50/'+en+'.svg',alt:cn}));
  const learning = {...base, WORDS:[...base.WORDS,...foods], AUDIO:{...base.AUDIO}};
  foods.forEach(word => { learning.AUDIO[word.en]='lesson50/audio/'+word.en+'.mp3'; });
  const take = (list, ids) => ids.map(id => ({...list.find(q => q.id === id),source:'Lesson 49 现行审定题稿'}));
  const question = (id,target,prompt,options,answer,explanation,extra={}) => ({id:'u4950-'+id,target,prompt,options,answer,explanation,source:'Lesson 50 纸页 100–101，情境化改编',...extra});
  const pools = [base.WORDS.slice(0,10).map(w=>w.en),['husband','butcher','tell','truth','either'],foods.map(w=>w.en)];
  const listening = learning.WORDS.map(word => {
    const pool=pools.find(items=>items.includes(word.en));
    const start=pool.indexOf(word.en);
    const options=Array.from({length:4},(_,i)=>pool[(start+i)%pool.length]);
    return question('listen-'+word.en,'听辨单词','听一听，选出单词。',options,word.en,'再听一次，分辨单词的声音。',{audioText:word.en,source:foods.includes(word)?'Lesson 50 新词':'Lesson 49 现行词表'});
  });
  const questions = {
    listen:listening,
    roles:base.STORY_TASKS,
    doare:[...take(base.DOARE,['doare-like','doare-teacher','doare-want']),
      question('does-penny','第三人称单数问喜好','想知道 Penny 是否喜欢西红柿，怎样问？',['Does Penny like tomatoes?','Do Penny like tomatoes?','Does Penny likes tomatoes?'],'Does Penny like tomatoes?','Penny 是第三人称单数。一般动词 like 的问句用 Does，like 保持原形。'),
      question('do-peas','向对方问喜好','想问对面的客人喜欢豌豆吗，怎样问？',['Do you like peas?','Does you like peas?','Are you like peas?'],'Do you like peas?','you 作主语，这个一般动词问句用 Do you like…?。'),
      question('does-want','第三人称单数问需求','想知道她这次想不想要桃子，怎样问？',['Does she want peaches?','Does she wants peaches?','Are she want peaches?'],'Does she want peaches?','问这次的需求用 want；Does 后的 want 用原形。')],
    give:take(base.GIVE_TASK,['give-recipient-person','give-object','give-predict','give-order']),
    needs:[
      question('penny-tomatoes','喜好与本次需求','Penny 喜欢西红柿，但这次不想买。哪句话符合？',["She likes tomatoes, but she doesn't want any.",'She likes tomatoes, and she wants some.',"She doesn't like tomatoes."],"She likes tomatoes, but she doesn't want any.",'喜欢不等于这次想要。她喜欢西红柿，但这次不想要。',{image:foods[0].image,imageAlt:'西红柿',hint:'前半句说喜欢；but 后面说这次不想要。'}),
      question('potatoes-now','用 I 表达喜好与需求','你喜欢土豆，但这次不想要。怎样告诉店主？',["I like potatoes, but I don't want any.","I don't like potatoes.",'I like potatoes, and I want some.'],"I like potatoes, but I don't want any.",'I like 表示喜欢；I don’t want any 表示这次不想要。',{image:foods[1].image,imageAlt:'土豆'}),
      question('sam-cabbage','does 的简短回答','Sam 喜欢卷心菜。别人问“Does Sam like cabbage?”，你怎么回答？',['Yes, he does.','Yes, he do.',"No, he doesn't."],'Yes, he does.','Sam 喜欢卷心菜，所以肯定回答 Yes, he does.。',{image:foods[2].image,imageAlt:'卷心菜'}),
      question('want-grapes','按实际需求回答','你这次不想要葡萄。店主问“Do you want any grapes?”，你怎么回答？',["No, I don't.",'Yes, I do.',"No, I doesn't."],"No, I don't.",'对 Do you want…? 回答这次不想要，用 No, I don’t.。',{image:foods[7].image,imageAlt:'葡萄'})],
    pouch:base.POUCH_TASK,
    either:take(base.ET,['either-form-too','either-form-either','either-home']),
    fill:take(base.FILL,['fill-aunt','fill-parents','fill-watch','fill-go']),
    choice:[
      question('negative-do','一般动词的否定','He likes coffee, but I ___.',["don't","doesn't","am not"],"don't",'I 不喜欢咖啡：I don’t（like coffee）。一般动词的这个否定句用 don’t。'),
      question('negative-does','一般动词的否定','She likes tea, but he ___.',["doesn't","don't","isn't"],"doesn't",'he 不喜欢茶：he doesn’t（like tea）。这里用 doesn’t。'),
      question('negative-is','be 的否定','He is eating some bread, but she ___.',["isn't","doesn't","aren't"],"isn't",'she isn’t（eating any bread）。沿用前句 is 的结构，不改成 doesn’t。'),
      question('negative-can','can 的否定','She can type very well, but he ___.',["can't","doesn't","isn't"],"can't",'前句说能打字，否定能力用 can’t。'),
      question('negative-are','be 的否定','They are working hard, but we ___.',["aren't","isn't","don't"],"aren't",'we aren’t（working hard）。we 对应 are，否定用 aren’t。'),
      question('negative-am','be 的否定','He is reading a magazine, but I ___.',['am not',"isn't","don't"],'am not','I am not（reading a magazine）。I 对应 am，否定用 am not。')],
    trans:[base.TRANS[0],
      question('order-negative','否定句中的一般动词','用词块表达：她这次不想要西红柿。',undefined,"She doesn't want any tomatoes.",'doesn’t 后用 want 原形。',{type:'order',tokens:['She',"doesn't",'want','any tomatoes.']}),
      question('order-does','一般动词问句','用词块问：他喜欢葡萄吗？',undefined,'Does he like grapes?','Does 在开头，like 保持原形。',{type:'order',tokens:['Does','he','like','grapes?']})],
    exam:[...take(base.EXAM,['exam-listen','exam-story','exam-order','exam-either']),
      question('exam-fruit','蔬果听辨','听一听，选出单词。',['pear','peach','grape','tomato'],'pear','再听一次，分辨梨和其他蔬果的读音。',{audioText:'pear'}),
      question('exam-want','喜好和需求迁移','Tom 喜欢豆角，但这次不想要。哪句话符合？',["Tom likes beans, but he doesn't want any.",'Tom likes beans, and he wants some.',"Tom doesn't like beans."],"Tom likes beans, but he doesn't want any.",'喜欢豆角与这次不想要豆角可以同时成立。'),
      question('exam-does','问喜好迁移','想知道她喜欢桃子吗，怎样问？',['Does she like peaches?','Does she likes peaches?','Are she like peaches?'],'Does she like peaches?','Does 后用 like 原形。'),
      question('exam-be','be 结构迁移','He is eating, but I ___.',['am not',"don't","isn't"],'am not','I am not eating，省略重复的 eating 后是 I am not。'),
      question('exam-plural','复数主语词形','My parents ___ potatoes.',['like','likes'],'like','My parents 指父母两人，一般现在时肯定句用 like。',{presentation:'cloze'}),
      question('exam-order-negative','否定句词块迁移','用词块表达：他这次不想要豌豆。',undefined,"He doesn't want any peas.",'He doesn’t want any peas. doesn’t 后用 want。',{type:'order',tokens:['He',"doesn't",'want','any peas.']})]
  };
  const stages = [
    {id:'l1',title:'采购准备',activities:[['words','采购小图鉴','cards'],['listen','听音寻宝','audio']]},
    {id:'l2',title:'肉店小剧场',activities:[['text','老板与客人','book'],['roles','故事小侦探','people']]},
    {id:'l3',title:'帮忙买晚餐',activities:[['doare','问话小帮手','question'],['give','交接小帮手','give'],['needs','餐桌小任务','heart'],['pouch','表达小锦囊','speech'],['either','心声接力','people']]},
    {id:'l4',title:'表达训练场',activities:[['subjects','分拣小能手','people'],['fill','动词换装间','order'],['choice','句子检查站','check'],['trans','词块拼装台','cards']]},
    {id:'l5',title:'晚餐准备好了',activities:[['exam','采购小挑战','star'],['certificate','我的单元证书','star']]}
  ];
  root.CanranCore.learningContext={id:'unit49-50',progress:{learningKey:'canran:unit49-50:learning:v1'},learning};
  root.CanranCore.unit4950={learning,foods,stages,questions};
})(globalThis);
