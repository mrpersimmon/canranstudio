(function (root) {
  'use strict';
  const image = name => '/assets/unit1-2/' + (['man', 'woman'].includes(name) ? 'scene/' : '') + name + '.svg';
  const sharedImage = name => '/assets/lesson49/icons/' + name + '.svg';
  const recording = name => 'unit1-2/audio/' + name + '.mp3';
  const source = '《新概念英语智慧版1》纸页 2–5（PDF 35–38 页）';
  const objects = [
    ['handbag', '手提包', 'l01-w07', '/ˈhændbæɡ/'], ['pen', '钢笔', 'l02-w01', '/pen/'],
    ['pencil', '铅笔', 'l02-w02', '/ˈpensəl/'], ['book', '书', 'l02-w03', '/bʊk/'],
    ['watch', '手表', 'l02-w04', '/wɑːtʃ/'], ['coat', '外套', 'l02-w05', '/koʊt/'],
    ['dress', '连衣裙', 'l02-w06', '/dres/'], ['skirt', '裙子', 'l02-w07', '/skɝːt/'],
    ['shirt', '衬衫', 'l02-w08', '/ʃɝːt/'], ['car', '小汽车', 'l02-w09', '/kɑːr/'],
    ['house', '房子', 'l02-w10', '/haʊs/']
  ].map(([en, cn, audio, ph]) => ({ en, cn, ph, image: image(en), audio: recording(audio), source }));
  // US dictionary forms match this pack's accent target. Pronunciation sources
  // and contextual/weak-form limits are documented with the unit acceptance.
  // Function words keep their meaning in this lesson; pictures are memory cues,
  // not a claim that a word has only one referent or grammatical use.
  const expressions = [
    ['excuse', '原谅；本句用于礼貌招呼', 'Excuse me!', 'speech', 'l01-w01-v2', '/ɪkˈskjuːz/'],
    ['me', '我（宾格）', 'Excuse me!', 'people', 'l01-w02', '/miː/'],
    ['yes', '是的；Yes? 在本句中是“什么事？”', 'Yes? / Yes, it is.', 'check', 'l01-w03', '/jes/'],
    ['is', 'be 的一种形式；本句搭配 this / it', 'Is this your handbag?', 'question', 'l01-w04', '/ɪz/'],
    ['this', '这；本句指眼前的手提包', 'Is this your handbag?', 'give', 'l01-w05', '/ðɪs/'],
    ['your', '你的；也可表示“你们的”', 'Is this your handbag?', 'people', 'l01-w06', '/jʊr/'],
    ['pardon', '请再说一遍', 'Pardon?', 'audio', 'l01-w08', '/ˈpɑːrdən/'],
    ['it', '它；本句指手提包', 'Yes, it is.', 'speech', 'l01-w09', '/ɪt/'],
    ['thank you', '谢谢你（们）', 'Thank you very much.', 'heart', 'l01-w10', '/ˈθæŋk ˌjuː/'],
    ['very much', '非常地', 'Thank you very much.', 'heart', 'l01-w11', '/ˈveri mʌtʃ/']
  ].map(([en, cn, example, art, audio, ph]) => ({ en, cn, ph, example, image: sharedImage(art), audio: recording(audio), source }));
  const DIALOGUE = [
    ['man', 'Excuse me!', '劳驾！（引起注意）'],
    ['woman', 'Yes?', '什么事？'],
    ['man', 'Is this your handbag?', '这是你的手提包吗？'],
    ['woman', 'Pardon?', '对不起，请再说一遍。'],
    ['man', 'Is this your handbag?', '这是你的手提包吗？'],
    ['woman', 'Yes, it is.', '是的，是我的。'],
    ['woman', 'Thank you very much.', '非常感谢！']
  ].map(([who, text, cn], index) => ({ id: 'L01-D0' + (index + 1), who, text, cn, audio: recording('l01-d0' + (index + 1)), source }));
  const WORDS = [...objects, ...expressions];
  const AUDIO = Object.fromEntries(WORDS.map(word => [word.en, word.audio]));
  DIALOGUE.forEach(line => { AUDIO[line.text] ||= line.audio; });
  for (const word of ['watch', 'coat', 'car', 'house']) AUDIO[`Is this your ${word}?`] = recording('nce-u01-c-q-' + word);
  for (const word of ['pen', 'pencil', 'book', 'dress', 'skirt', 'shirt']) AUDIO[`Is this your ${word}?`] = recording('q-' + word);
  const SENTENCE_MODELS = objects.slice(1).map(word => ({ en: `Is this your ${word.en}?`, cn: `这是你的${word.cn}吗？`, image: word.image, audio: AUDIO[`Is this your ${word.en}?`] }));
  const PHRASES = [
    ['Excuse me!', '想引起别人注意', 'speech'], ['Yes?', '别人招呼你，回应“什么事？”', 'question'],
    ['Pardon?', '没听清，请对方再说一遍', 'audio'], ['Yes, it is.', '确认对方询问的物品是你的', 'check'],
    ['Thank you very much.', '得到帮助，向对方致谢', 'heart']
  ].map(([en, cn, art]) => ({ en, cn, image: sharedImage(art), audio: AUDIO[en] }));
  const question = (id, target, prompt, options, answer, explanation, hint, extra = {}) => ({
    id: 'u12-v1-' + id, target, prompt, options, answer, explanation, hint, source, ...extra
  });
  const revised = (...args) => ({ ...question(...args), id: 'u12-v2-' + args[0] });
  const sceneQuestion = (...args) => ({ ...question(...args), id: 'u12-scene-v1-' + args[0] });
  const ask = word => `Is this your ${word}?`;
  const pictureOptions = Object.fromEntries(objects.map(word => [word.en, word.image]));
  const questions = {
    roles: [
      question('story-your', '理解问句中的 your', '男士问“Is this your handbag?”，这里的 your 指谁？', ['对面的女士', '说话的男士'], '对面的女士', '男士在问对面的女士：“这是你的手提包吗？”your 在这句话中指女士的。', 'your 表示“你的”，看说话的人正在问谁。'),
      sceneQuestion('story-it', '区分物品指代与人物', '女士说“Yes, it is.”，it 指什么？', ['手提包', '男士', '女士'], '手提包', 'it 指男士刚刚询问的手提包。', '回看上一句，正在确认哪件事物。', { optionImages: { '手提包': image('handbag'), '男士': image('man'), '女士': image('woman') } })
    ],
    listen: objects.map((word, index) => {
      const nearby = objects.slice(1);
      const distractors = nearby.filter(item => item.en !== word.en);
      const choices = [word.en, ...Array.from({ length: 3 }, (_, n) => distractors[(index + n * 3) % distractors.length].en)];
      return question('listen-' + word.en, '听辨 ' + word.en, '听一听，选出单词。', choices, word.en, '再听一次，找出对应物品。', '', { audioText: word.en, optionImages: pictureOptions });
    }),
    manners: [
      sceneQuestion('attention', '在相遇时礼貌引起注意', '帮男士叫住她。', ['Excuse me!', 'Pardon?', 'Thank you very much.'], 'Excuse me!', '用 Excuse me! 引起注意。', '两个人还没开始说话。', { scene: { beat: 'attention', step: '叫住她', before: [], after: [['man', 'Excuse me!'], ['woman', 'Yes?']] } }),
      sceneQuestion('repeat', '根据请求重复接续话轮', '她没听清，男士接下来怎么说？', ['Is this your handbag?', 'Yes, it is.', 'Thank you very much.'], 'Is this your handbag?', 'Pardon? 请对方再说一遍。', '想想 Pardon? 是请谁重复哪句话。', { scene: { beat: 'repeat', step: '再问一次', before: [['man', 'Is this your handbag?'], ['woman', 'Pardon?']], after: [['man', 'Is this your handbag?']] } }),
      sceneQuestion('return', '根据原文确认接收者并交还物品', '确认好了，把手提包交给谁？', ['男士', '女士'], '女士', '女士回答 Yes, it is.，确认手提包是她的。', '看是谁回答了刚才的归属问句。', { optionImages: { '男士': image('man'), '女士': image('woman') }, scene: { beat: 'return', step: '把包送回', before: [['man', 'Is this your handbag?'], ['woman', 'Yes, it is.']], after: [] } }),
      sceneQuestion('thanks', '从接受帮助推进到组织感谢', '包回来了，帮女士说声谢谢。', undefined, 'Thank you very much.', '感谢帮助自己的人。', '先表达感谢，再表达感谢的程度。', { type: 'order', tokens: ['Thank', 'you', 'very', 'much.'], scene: { beat: 'thanks', step: '说声谢谢', before: [], after: [['woman', 'Thank you very much.']] } })
    ],
    ask: [
      sceneQuestion('find-watch', '从完整问句定位物品', '男士问的是哪件物品？', ['手表', '书', '手提包'], '手表', 'watch 表示手表。', '留意问句最后的物品名。', { optionImages: { '手表': image('watch'), '书': image('book'), '手提包': image('handbag') }, scene: { beat: 'find', step: '找出物品', before: [['man', 'Is this your watch?']], after: [] } })
    ],
    trans: [
      question('build-pen', '拼出归属问句', '用词块问：这是你的钢笔吗？', undefined, 'Is this your pen?', '问句是 Is this your pen?，Is 放在开头。', '这句话是在提问，还是在说明一件事？', { type: 'order', tokens: ['Is', 'this', 'your', 'pen?'] }),
      question('build-yes', '拼出肯定回答', '这确实是你的钢笔。用词块回答。', undefined, 'Yes, it is.', '用 Yes, it is. 作肯定回答，it 指刚才说的钢笔。', '先想清楚要肯定还是否定，再检查回应是否完整。', { type: 'order', tokens: ['Yes,', 'it', 'is.'] })
    ],
    exam: [
      revised('exam-attention', '按话轮区分回应招呼和确认', '男士：Excuse me!\n女士：___\n男士：Is this your handbag?\n女士先怎样回应招呼？', ['Yes?', 'Yes, it is.', 'Thank you very much.'], 'Yes?', '这时还没有问物品归属。Yes? 回应招呼；Yes, it is. 才用于肯定确认。', '男士刚刚叫住她，还没问手提包。'),
      revised('exam-confirm-thank', '组合确认与感谢', '同学把书送回来，问“Is this your book?”。书确实是你的。你先确认，再感谢，怎样说？', ['Yes, it is. Thank you very much.', 'Yes? Pardon?', 'Is this your book? Thank you very much.'], 'Yes, it is. Thank you very much.', '先用 Yes, it is. 确认书是自己的，再用 Thank you very much. 感谢同学。', '你是回答的人：先确认，再道谢。')
    ]
  };
  const stages = [
    // Chapter IDs remain stable when the recommended learning order changes.
    { id: 'l2', title: '身边的小物品', activities: [['words', '物品小图鉴', 'cards'], ['listen', '听音寻宝', 'audio']], required: ['listen'] },
    { id: 'l1', title: '手提包的故事', activities: [['text', '相遇小剧场', 'book'], ['roles', '故事小侦探', 'people']], required: ['text', 'roles'] },
    { id: 'l3', title: '开口有礼貌', activities: [['phrases', '问句小锦囊', 'speech'], ['manners', '帮忙还手提包', 'give']], required: ['manners'] },
    { id: 'l4', title: '问句小工坊', activities: [['ask', '找对物品', 'question'], ['trans', '词块拼装台', 'order']], required: ['ask', 'trans'] },
    { id: 'l5', title: '小帮手出发', activities: [['exam', '礼貌小挑战', 'star'], ['certificate', '我的单元证书', 'star']], required: ['exam'] }
  ];
  const expressionMeanings = {
    'Excuse me!': '礼貌引起注意', 'Pardon?': '请求重复刚才的话',
    'Yes, it is.': '肯定确认对方问的物品归属', 'Thank you very much.': '表达感谢'
  };
  for (const [activity, items] of Object.entries(questions)) for (const q of items) {
    // Author-facing review notes stay out of the child's controls and hints.
    q.source = ['ask', 'listen'].includes(activity)
      ? (q.id.endsWith('handbag') ? 'Lesson 1 纸页 2–3（PDF 35–36）' : 'Lesson 2 纸页 4–5（PDF 37–38）')
      : activity === 'roles' ? 'Lesson 1 纸页 2–3（PDF 35–36），原文理解'
      : source + '；使用本课表达另设练习情境';
    if (!q.options) continue;
    q.distractorReasons = Object.fromEntries(q.options.filter(value => value !== q.answer).map(value => {
      const word = objects.find(word => value === word.en || value === ask(word.en));
      const reason = word ? `这个选项表示${word.cn}，不是本题给出的物品。`
        : expressionMeanings[value] ? `这句话用于${expressionMeanings[value]}。${q.explanation}`
        : q.explanation;
      return [value, reason];
    }));
  }
  const previousQuestions = { exam: questions.exam };
  const finalQuestion = (...args) => {
    const item = { ...question(...args), id: 'u12-final-v2-' + args[0], source: source + '；综合复习，另设语境不增加原文事实' };
    if (item.options) item.distractorReasons = Object.fromEntries(item.options.filter(value => value !== item.answer).map(value => [value, item.explanation]));
    return item;
  };
  questions.exam = [...previousQuestions.exam,
    finalQuestion('reference', '同时分清听话人与所谈物品', '男士：Is this your handbag?\n女士：Yes, it is.\n这两句里的 your 和 it 分别指什么？', ['your 指女士的；it 指手提包', 'your 指男士的；it 指手提包', 'your 指女士的；it 指女士'], 'your 指女士的；it 指手提包', '男士向女士询问，所以 your 表示女士的；回答中的 it 指正在确认的手提包。', '分别找出男士在问谁，以及两人在说哪件东西。'),
    finalQuestion('repeat', '选择请求重复的表达', '没听清同学刚说的话，想请他再说一遍。怎样说？', ['Pardon?', 'Excuse me!', 'Thank you very much.'], 'Pardon?', '本题需要请对方重复刚才的话，用 Pardon?。Excuse me! 在本课用于引起注意；Thank you very much. 表示感谢。', '对话已经开始；现在需要对方做什么？'),
    finalQuestion('attention', '在新情境中礼貌引起注意', '同学正要走开，你想叫住他问一件事。先说什么？', ['Excuse me!', 'Pardon?', 'Yes, it is.'], 'Excuse me!', '这时尚未开始问答，先用 Excuse me! 引起注意。Pardon? 请人重复；Yes, it is. 是确认回答。', '两个人还没有开始对话。'),
    finalQuestion('object', '从完整问句辨认易混物品', 'Is this your pencil?\n问的是哪件物品？', ['铅笔', '钢笔', '书'], '铅笔', 'pencil 是铅笔，pen 是钢笔；问句正在确认铅笔的归属。', '注意问句最后的物品名。', { optionImages: { '铅笔': image('pencil'), '钢笔': image('pen'), '书': image('book') } }),
    finalQuestion('ask', '在新物品情境中组织归属问句', '用词块问同学：这是你的外套吗？', undefined, 'Is this your coat?', '用 Is this your…? 询问眼前物品是否是对方的；coat 表示外套。', '先区分提问和回答，再找出物品词。', { type: 'order', tokens: ['Is', 'this', 'your', 'coat?'] }),
    finalQuestion('hear-question', '从整句录音找到询问对象', '听问句，选出正在询问的物品。', ['房子', '小汽车', '外套'], '房子', '录音是 Is this your house?，house 表示房子。本题只辨认问到什么，没有说明房子的主人。', '', { audioText: ask('house'), optionImages: { '房子': image('house'), '小汽车': image('car'), '外套': image('coat') } })
  ];
  const definition = {
    id: 'unit1-2', version: 1, experienceVersion: 'scene-1', title: '礼貌小帮手', path: '/unit1-2/', start: 'learn/words',
    progress: { learningKey: 'canran:unit1-2:learning:v1' },
    learning: { WORDS, PHRASES, SENTENCE_MODELS, DIALOGUE, AUDIO, FEEDBACK: root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK }, objects, stages, questions, previousQuestions, activityPredecessors: { exam: ['exam'] }
  };
  root.CanranCore.unit12 = definition;
  // The navigation can read unit metadata without activating its storage context.
  if (root.document?.documentElement.dataset.unit === definition.id) root.CanranCore.learningContext = definition;
})(globalThis);

// Task edition v4: exact prior rounds are evidence for unchanged questions only.
(function(core){
 const unit=core.unit12;
 const revised={"roles":[unit.questions["roles"][0],
unit.questions["roles"][1],
{
  "id": "u12-tasks-v4-thanks-degree",
  "target": "识别感谢语的程度词组",
  "prompt": "点出让“谢谢”更强烈的词组。",
  "decision": "此前只展示和拼装此句；现在区分感谢动作、对象与程度。",
  "hint": "把整句话分成道谢的话和加强语气的话。",
  "source": "Lesson 1 原文 Thank you very much.",
  "type": "locate",
  "fragments": [
    {
      "value": "Thank"
    },
    " ",
    {
      "value": "you"
    },
    " ",
    {
      "value": "very much"
    },
    "."
  ],
  "options": [
    "Thank",
    "you",
    "very much"
  ],
  "answer": "very much",
  "distractorReasons": {
    "Thank": "这个片段不表达题目要求的信息；需结合完整句子判断。",
    "you": "这个片段不表达题目要求的信息；需结合完整句子判断。"
  },
  "distractorRationale": "Thank 表达道谢；you 是感谢的对象；very much 加强程度。区别所问的信息，而不是只认谢谢的翻译。"
}],
"exam":[{
  "id": "u12-tasks-v4-exam-attention",
  "target": "区别回应招呼与确认物品归属",
  "prompt": "接好女士的两次回应。",
  "decision": "女士已认出自己的手提包；两次回应各自选择，不按一组套话排除。",
  "hint": "第一句是在叫住她，第二句是在确认物品。",
  "source": "Lesson 1 招呼与确认手提包归属的原文对比",
  "type": "cloze",
  "reference": "手提包确实是这位女士的。",
  "blanks": [
    {
      "before": "男士：Excuse me!\n女士：",
      "after": "",
      "options": [
        "Yes?",
        "Yes, it is.",
        "Pardon?"
      ]
    },
    {
      "before": "男士：Is this your handbag?\n女士：",
      "after": "",
      "options": [
        "Yes, it is.",
        "Yes?",
        "Excuse me!"
      ]
    }
  ],
  "answer": "[\"Yes?\",\"Yes, it is.\"]",
  "distractorReasons": {
    "Yes?": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "Yes, it is.": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "Pardon?": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。",
    "Excuse me!": "须根据该空所在句子的主语、位置或交际目的选择，不能从另一句照搬。"
  },
  "distractorRationale": "Yes? 回应招呼；Yes, it is. 确认归属。Pardon? 需要没听清的语境；Excuse me! 用来引起注意。两空各自选择。"
},
unit.questions["exam"][1],
unit.questions["exam"][2],
unit.questions["exam"][3],
unit.questions["exam"][4],
unit.questions["exam"][5],
unit.questions["exam"][6],
unit.questions["exam"][7]]};
 unit.taskPredecessors ||= {}; unit.taskSessions ||= {};
 for(const [id,items] of Object.entries(revised)){
  const priorKey='unit12-'+id+'-practice/'+(unit.taskSessions[id]||(unit.taskPredecessors[id]?'v3':unit.activityPredecessors?.[id]?'v2':'v'+unit.version));
  const sources=[{key:priorKey,questions:unit.questions[id]},...(unit.taskPredecessors[id]||[]),...(unit.activityPredecessors?.[id]||[]).map(old=>({key:'unit12-'+old+'-practice/v1',questions:unit.previousQuestions[old]}))];
  unit.taskPredecessors[id]=sources; unit.taskSessions[id]='tasks-v4'; unit.questions[id]=items;
 }
})(globalThis.CanranCore);

// Text-only task edition. Keep exact predecessors for current-round migration.
(function(core){
 'use strict';
 const unit=core.unit12,old=unit.questions,all=Object.values(old).flat(),find=id=>all.find(q=>q.id===id);
 const image=name=>'/assets/unit1-2/'+name+'.svg';
 const make=(code,type,target,prompt,extra)=>({id:'u12-types-v1-'+code,type,target,prompt,hint:'',source:'Lesson 1–2；2026-10-06 十三项题型试排 '+code,...extra});
 const choice=(code,target,prompt,options,answer,extra={})=>make(code,'choice',target,prompt,{options,answer,...extra});
 const revised={
  listen:[
   make('t01','match','区分三种衣物','给衣服配对。',{pairs:[{id:'coat',en:'coat',cn:'外套'},{id:'dress',en:'dress',cn:'连衣裙'},{id:'skirt',en:'skirt',cn:'半身裙'}],answer:'["coat","dress","skirt"]'}),
   choice('t02','识别钢笔','看看图，选出英文。',['pen','pencil','book'],'pen',{image:image('pen'),imageAlt:'有金属笔尖的钢笔'}),
   choice('t03','理解 house','“房子”是哪一个词？',['house','car','shirt'],'house'),
   choice('b01','区分铅笔和钢笔','“铅笔”是哪一个词？',['pencil','pen','book'],'pencil')
  ],
  roles:[
   make('t05','wordbank','读懂归属问句','用中文词块说出这句话的意思。',{reading:'Is this your handbag?',language:'zh-CN',tokens:['你的','这是','吗？','手提包','我的','铅笔'],slots:4,answer:'这是 你的 手提包 吗？'}),
   choice('t06','理解重复问话的原因','男士为什么又问了一次？',['女士请他重复。','又发现了另一个手提包。','女士说手提包不是自己的。'],'女士请他重复。',{reading:unit.learning.DIALOGUE.map(line=>[line.who==='man'?'男士':'女士',line.text]),readingLabel:'手提包的故事'}),
   find('u12-tasks-v4-thanks-degree'),find('u12-v1-story-your')
  ],
  manners:[
   make('t04','cloze','补全礼貌招呼','男士想礼貌地引起女士注意。',{blanks:[{before:'Excuse ',after:'!',options:['me','it','your']}],answer:'["me"]'}),
   choice('t10','回应招呼','朋友叫住你，该怎样回应？',['Yes?','Yes, it is.','Thank you very much.'],'Yes?',{reading:'Excuse me!'}),
   choice('t13','作为女士确认归属','你是女士，手提包确实是你的。怎样回答？',['Yes, it is.','Yes?','Pardon?'],'Yes, it is.',{scene:{beat:'confirm',step:'认回手提包',before:[['man','Is this your handbag?']],after:[['woman','Yes, it is.']]}}),
   find('u12-scene-v1-return'),
   make('b04','wordbank','组织完整感谢','包回来了，帮女士说声谢谢。',{language:'en',tokens:['Thank','you','very much'],slots:3,suffix:'.',answer:'Thank you very much',scene:{beat:'thanks',step:'说声谢谢',before:[],after:[['woman','Thank you very much.']]}})
  ],
  ask:[
   choice('t09','根据手表图片补词','看看图，补全问句。',['watch','book','handbag'],'watch',{reading:'Is this your ___?',image:image('watch'),imageAlt:'一块手表'}),
   choice('t11','理解对话中的 it','这里的 it 指什么？',['衬衫','男士','女士'],'衬衫',{reading:[['男士','Is this your shirt?'],['女士','Yes, it is.']]})
  ],
  trans:[
   make('t08','write','在句式支持下拼写 book','这是你的书吗？补上缺少的英文单词。',{before:'Is this your ',after:'?',answer:'book'}),
   make('t12','wordbank','组织小汽车归属问句','这是你的小汽车吗？',{tokens:['car','your','Is','this'],slots:4,suffix:'?',answer:'Is this your car'})
  ],
  exam:[...old.exam.slice(0,7),choice('c08','读懂不同物品的归属问句','读一读，问的是哪件物品？',['房子','小汽车','外套'],'房子',{reading:'Is this your house?',optionImages:{'房子':image('house'),'小汽车':image('car'),'外套':image('coat')}})]
 };
 const predecessors=Object.entries(old).flatMap(([id,items])=>[{key:'unit12-'+id+'-practice/'+(unit.taskSessions?.[id]||(unit.activityPredecessors?.[id]?'v2':'v'+unit.version)),questions:items},...(unit.taskPredecessors?.[id]||[])]);
 for(const[id,items]of Object.entries(revised)){unit.taskPredecessors[id]=predecessors;unit.taskSessions[id]='types-v1';unit.questions[id]=items;}
 unit.experienceVersion='classroom-types-1';unit.teachingMode='classroom';
 unit.typeCoverage={adopted:['E01','E04','E05','E07','E09','E10','E11','E12','E21','E23','S01','S02','A02'],actual:['E01','E04','E05','E07','E09','E12','E21','E23','S01','S02','A02'],adaptations:{E10:'T09 只识别图片中的物品，归为 E21。',E11:'T11 是短对话指代理解，归为 S01。'}};
 unit.stages[0].activities[1]=['listen','单词寻宝','cards'];unit.stages[2].title='礼貌小帮手';unit.stages[3].activities[1][1]='句子小工坊';
 // Original dialogue metadata remains identical for verified cross-device progress.
 // Classroom mode never loads its historical recording references.
 unit.learning.AUDIO={};
 for(const list of [unit.learning.WORDS,unit.learning.PHRASES,unit.learning.SENTENCE_MODELS])for(const item of list)delete item.audio;
})(globalThis.CanranCore);

// Current click-only edition. Preserve exact v1 questions as migration sources.
(function(core){
 'use strict';
 const unit=core.unit12;
  const old=unit.questions,revised={
   trans:old.trans.map((q,i)=>i?q:{id:'u12-clicks-v1-book',type:'cloze',target:'在问句中选择 book',prompt:'补全句子',reference:'这是你的书吗？',hint:'',source:'Lesson 1–2；2026-10-06 共性交互修订',blanks:[{before:'Is this your ',after:'?',options:['book','car','watch']}],answer:'["book"]'}),
   exam:old.exam.map((q,i)=>i!==1?q:{id:'u12-clicks-v1-confirm-thank',type:'choice',target:'确认物品归属并感谢',prompt:'先确认，再道谢',display:{title:'先确认，再道谢',material:'同学把你的书递给你'},reading:[['同学','Is this your book?']],hint:'',source:'Lesson 1–2；2026-10-06 共性交互修订',options:['Yes, it is. Thank you very much.','Yes, it is. Excuse me!','Pardon? Thank you very much.'],answer:'Yes, it is. Thank you very much.'})
  };
  for(const[id,items]of Object.entries(revised)){
   unit.taskPredecessors[id]=[{key:'unit12-'+id+'-practice/'+unit.taskSessions[id],questions:old[id]},...unit.taskPredecessors[id]];
   unit.taskSessions[id]='clicks-v1';unit.questions[id]=items;
  }
  for(const key of ['adopted','actual'])unit.typeCoverage[key]=unit.typeCoverage[key].filter(id=>id!=='E07');
  unit.typeCoverage.adaptations.E07='键盘拼写已移除；点击补全归入 E09，不计为 E07。';
  unit.experienceVersion='classroom-clicks-1';
})(globalThis.CanranCore);

// Grammar edition: demonstrate, distinguish, build, then transfer to a new item.
// New question identities never inherit the answers of the questions they replace.
(function (core) {
  'use strict';
  const unit = core.unit12;
  const source = '智慧版1 纸页2–5；同步导学纸页1–4；语法练习册纸页2–4。原文为边界，示范与迁移情境另设。';
  const make = (id, type, target, prompt, extra) => ({
    id: 'u12-grammar-v2-' + id, type, target, prompt, display: { title: prompt },
    hint: '', source, ...extra
  });
  const intention = make('intention', 'choice', '从归属问句理解提问意图', '男士想确认什么？', {
    reading: [['男士', 'Is this your handbag?']],
    options: ['这是不是女士的手提包。', '这是不是男士的手提包。', '女士想不想买手提包。'],
    answer: '这是不是女士的手提包。',
    distractorReasons: { '这是不是男士的手提包。': '说话人向对方问 your，不是在问自己的物品。', '女士想不想买手提包。': '原句询问物品归属，没有询问购买意愿。' }
  });
  const distinguish = make('statement-question', 'choice', '区别陈述物品归属与询问归属', '想确认书的主人，选哪一句？', {
    options: ['This is your book.', 'Is this your book?'], answer: 'Is this your book?',
    distractorReasons: { 'This is your book.': '这是陈述归属；本题需要向对方询问。' }
  });
  const build = make('build-car', 'wordbank', '在新物品上组织 is 开头的归属问句', '用词块问：这是你的小汽车吗？', {
    tokens: ['this', 'your car', 'Is'], slots: 3, suffix: '?', answer: 'Is this your car',
    decision: '保留 your car 意义块，集中练习 Is 与 this 的顺序，不要求键盘拼写。'
  });
  const reference = make('meaning-reference', 'cloze', '分开理解 your 的词义与 it 的物品指代', '选出词义和它指的物品', {
    reading: [['男士', 'Is this your handbag?'], ['女士', 'Yes, it is.']],
    blanks: [
      { before: '这里的 your 表示：', after: '', options: ['你的', '我的', '她的'] },
      { before: '回答中的 it 指：', after: '', options: ['手提包', '男士', '女士'] }
    ],
    answer: '["你的","手提包"]',
    distractorRationale: 'your 的词义是“你的”；听话人是女士不使它变成“她的”。it 接着指前一句问到的手提包，不指说话人。'
  });
  const transfer = make('build-coat', 'wordbank', '独立把 this is 陈述句改为一般疑问句', '把这句话变成问句', {
    reading: 'This is your coat.', tokens: ['your coat', 'this', 'Is'], slots: 3, suffix: '?', answer: 'Is this your coat',
    decision: '只提供原陈述句，不给变换后的问句模板；在综合练习再次提取 is 前移的规则。'
  });
  const old = unit.questions;
  const revised = {
    roles: old.roles.map((q, i) => i === 3 ? intention : q),
    trans: [distinguish, build],
    exam: old.exam.map((q, i) => i === 2 ? reference : i === 6 ? transfer : q)
  };
  for (const [id, items] of Object.entries(revised)) {
    unit.taskPredecessors[id] = [
      { key: 'unit12-' + id + '-practice/' + unit.taskSessions[id], questions: old[id] },
      ...unit.taskPredecessors[id]
    ];
    unit.taskSessions[id] = 'grammar-v2';
    unit.questions[id] = items;
  }
  unit.experienceVersion = 'classroom-grammar-2';
})(globalThis.CanranCore);

// Study-guide Grammar edition: asking, transforming, and both short replies.
(function (core) {
  'use strict';
  const unit = core.unit12, old = unit.questions;
  const make = (id, type, target, prompt, extra) => ({
    id: 'u12-grammar-v3-' + id, type, target, prompt, display: { title: prompt }, hint: '',
    source: '同步导学 Grammar 纸页3–4／PDF17–18：含 be 的一般疑问句及肯定、否定回答。物品与角色另设，不作课文事实。',
    ...extra
  });
  const positive = make('reply-yes', 'cloze', '物品属于回答者时补全肯定回答', '这支钢笔确实是你的，补全回答。', {
    reading: 'Is this your pen?',
    blanks: [{ before: 'Yes, ', after: '.', options: ['it is', "it isn't", 'this your'] }],
    answer: '["it is"]',
    distractorRationale: 'isn’t 与给定归属事实冲突；this your 缺少 be 动词，也不是本课示范的简短回答。'
  });
  const negative = make('reply-no', 'choice', '物品不属于回答者时选择否定回答', '这只手提包不是你的，怎样回答？', {
    reading: 'Is this your handbag?', options: ["No, it isn't.", 'Yes, it is.', 'No, it is.'], answer: "No, it isn't.",
    distractorReasons: { 'Yes, it is.': '肯定回答与已知归属事实相反。', 'No, it is.': 'No 与 it is 的肯定意义冲突。' }
  });
  const transfer = make('new-owner-no', 'choice', '在新的归属情境中独立运用否定回答', '告诉同学，这不是你的手表', {
    display: { title: '告诉同学，这不是你的手表', material: '同学捡到一块手表，手表不是你的。' },
    reading: [['同学', 'Is this your watch?']],
    options: ["No, it isn't.", 'Yes, it is.', 'Yes?'], answer: "No, it isn't.",
    distractorReasons: { 'Yes, it is.': '与手表不属于自己的条件冲突。', 'Yes?': '这是回应招呼，不是回答物品归属。' }
  });
  const revised = {
    trans: [...old.trans, positive, negative],
    exam: old.exam.map((question, index) => index === 1 ? transfer : question)
  };
  for (const [id, items] of Object.entries(revised)) {
    unit.taskPredecessors[id] = [
      { key: 'unit12-' + id + '-practice/' + unit.taskSessions[id], questions: old[id] },
      ...unit.taskPredecessors[id]
    ];
    unit.taskSessions[id] = 'grammar-v3'; unit.questions[id] = items;
  }
  unit.experienceVersion = 'classroom-grammar-3';
})(globalThis.CanranCore);

// Exercise-led Grammar: scope follows the study guide; every altered task has
// a fresh identity. Earlier editions above are exact migration predecessors.
(function (core) {
  'use strict';
  const unit = core.unit12;
  const source = '同步导学 Grammar 纸页3–4／PDF17–18：一般疑问句；am/is/are 与主语的位置；肯定、否定回答。提问对象的转换单独交代，不把 I→you 当作变句规则。例题为另设情境。';
  const task = (id, type, target, title, extra) => ({
    id: 'u12-grammar-v4-' + id, type, target, prompt: title, display: { title }, source, ...extra
  });
  const model = (title, lines) => ({ title, lines });
  const trans = [
    task('ask-or-tell', 'choice', '区分陈述和询问', '想确认书的主人，选哪一句？', {
      options: ['This is your book.', 'Is this your book?'], answer: 'Is this your book?',
      hint: '留意这两句中 is 和 this 的位置，以及句末的标点。',
      workshop: { phase: '问一问', model: model('告诉别人，还是问一问？', [['This is your pen.', '这是你的钢笔。'], ['Is this your pen?', '这是你的钢笔吗？']]), rule: '陈述是告诉别人；询问是在等对方回答。' },
      distractorReasons: { 'This is your book.': '陈述句已经作出判断，本题需要询问归属。' }
    }),
    task('yes-no-purpose', 'choice', '理解一般疑问句确认一件事是否成立', '这句话想确认什么？', {
      reading: 'Is this your pencil?', options: ['这是不是你的铅笔。', '你的铅笔在哪里。', '你有几支铅笔。'], answer: '这是不是你的铅笔。',
      hint: '一般疑问句可以用 Yes 或 No 回答。地点和数量需要别的信息。',
      workshop: { phase: '问一问', rule: '一般疑问句：确认一件事是不是这样，可以用 Yes 或 No 回答。' },
      distractorReasons: { '你的铅笔在哪里。': '本句不询问地点。', '你有几支铅笔。': '本句不询问数量。' }
    }),
    task('move-is', 'wordbank', '把 is 移到主语前形成问句', '用词块问：这是你的小汽车吗？', {
      tokens: ['this', 'your car', 'Is'], slots: 3, suffix: '?', answer: 'Is this your car',
      hint: '含 is 的这类句子变成问句时，把 is 放到主语前。',
      workshop: { phase: '变问句', model: model('先看 is 的位置', [['He is a worker.', '他是一名工人。'], ['Is he a worker?', '他是一名工人吗？']]), rule: '这类问句把 is 放到主语前；句首大写，句末用问号。' }
    }),
    task('move-are', 'cloze', 'you 搭配 are 并前移提问', '把“你是学生”变成问句', {
      reading: 'You are a student.', display: { title: '把“你是学生”变成问句', material: 'student：学生' },
      blanks: [{ before: '', after: ' you a student?', options: ['Are', 'Is', 'Am'] }], answer: '["Are"]',
      hint: 'you 和 are 搭配。变问句后，这个搭配仍然保留。',
      workshop: { phase: '变问句', model: model('are 也来到前面', [['You are ready.', '你准备好了。'], ['Are you ready?', '你准备好了吗？']]), rule: 'you 搭配 are；提问时，are 放在 you 前面。' },
      distractorRationale: '这句的主语是 you，不能搭配 is 或 am。'
    }),
    task('ask-about-self', 'wordbank', '询问自己时保留 I 并使用 am', '问自己：我是学生吗？', {
      display: { title: '问自己：我是学生吗？', material: '角色猜谜：你正在猜自己的身份。student：学生' },
      tokens: ['I', 'a student', 'Am'], slots: 3, suffix: '?', answer: 'Am I a student',
      hint: '问自己的身份，I 仍表示“我”；I 和 am 搭配。',
      workshop: { phase: '变问句', model: model('问的是自己', [['I am ready.', '我准备好了。'], ['Am I ready?', '我准备好了吗？']]), rule: '问自己仍用 I：am 放到 I 前面，不需要改成 you。' }
    }),
    task('change-addressee', 'choice', '根据说话者和询问对象选择 I 或 you', '男士直接问女士，选哪一句？', {
      reading: [['女士', 'I am a student.']], display: { title: '男士直接问女士，选哪一句？', material: '角色练习。student：学生' },
      options: ['Are you a student?', 'Am I a student?', 'Is she a student?'], answer: 'Are you a student?',
      hint: '说 I 的人是女士；现在换男士直接问她。想清楚“我”和“你”各指谁。',
      workshop: { phase: '变问句', speakers: true, model: model('换了说话人', [['I（我） · you（你）', 'I 指说话人自己；you 指正在交谈的对方。']]), rule: '换人说话时，要重新判断“我”和“你”；I 不是一变问句就改成 you。' },
      distractorReasons: { 'Am I a student?': '男士这样问的是自己，本题要问女士。', 'Is she a student?': '这句话在向另一个人询问“她”，不是直接问女士。' }
    }),
    task('affirmative-replies', 'cloze', '根据回答对象补全肯定回答', '这支钢笔确实是你的，补全回答', {
      reading: 'Is this your pen?', blanks: [{ before: 'Yes, ', after: '.', options: ['it is', "it isn't", 'I am'] }], answer: '["it is"]',
      hint: '先判断问的是物品还是“你”，再判断事实是不是这样。',
      workshop: { phase: '答一答', model: model('问你本人时，怎样回答？', [['Are you ready?', '你准备好了吗？'], ['Yes, I am.', '我准备好了。回答时 I 指自己。']]), rule: '问物品，用 it 回应；问你本人，回答时用 I。' },
      distractorRationale: 'it isn’t 与事实相反；I am 回答的是人，不是钢笔。'
    }),
    task('negative-reply', 'choice', '按归属事实作否定回答', '这只手提包不是你的，怎样回答？', {
      reading: 'Is this your handbag?', options: ["No, it isn't.", 'Yes, it is.', 'No, it is.'], answer: "No, it isn't.",
      hint: '不是自己的物品，要选否定回答；No 后面的句子也要表达否定。',
      workshop: { phase: '答一答', model: model('不是自己的物品', [['Is this your book? → No, it isn’t.', '书不是你的：不，不是。']]), rule: '不是这样，用 No 和否定形式回答：No, it isn’t.' },
      distractorReasons: { 'Yes, it is.': '与明确给定的归属事实相反。', 'No, it is.': 'No 后面仍是肯定陈述。' }
    }),
    task('reference-it', 'choice', '在简短回答中识别 it 的所指', '回答中的 it 指什么？', {
      reading: [['男士', 'Is this your watch?'], ['女士', 'Yes, it is.']],
      options: ['手表', '男士', '女士'], answer: '手表',
      optionImages: { '手表': '/assets/unit1-2/watch.svg', '男士': '/assets/unit1-2/scene/man.svg', '女士': '/assets/unit1-2/scene/woman.svg' },
      hint: '回到上一句，找出两个人正在确认哪件物品。',
      workshop: { phase: '答一答' }, distractorReasons: { '男士': 'it 不指提问的人。', '女士': 'it 不指回答的人。' }
    }),
    task('expand-isnt', 'cloze', '识别否定缩写 isn’t 与 is not', '把 isn’t 展开，意思不变', {
      reading: "No, it isn't.", blanks: [{ before: 'No, it ', after: '.', options: ['is not', 'is', 'are not'] }], answer: '["is not"]',
      hint: 'isn’t 由 is 和表示否定的 not 缩写而来。',
      workshop: { phase: '答一答', model: model('两个词可以缩在一起', [['is not → isn’t', '意思相同，都表示否定。']]), rule: 'isn’t = is not。省略了一个字母，用撇号标记。' },
      distractorRationale: 'is 丢失否定意思；it 不搭配 are。'
    }),
    task('independent-ask-ready', 'wordbank', '在新语境中独立组织 are 问句', '问同学：你准备好了吗？', {
      display: { title: '问同学：你准备好了吗？', material: '游戏要开始了。ready：准备好的' },
      tokens: ['ready', 'you', 'Are'], slots: 3, suffix: '?', answer: 'Are you ready',
      hint: '问的是对方。确定主语，再想它与哪一个 be 动词搭配。', workshop: { phase: '自己试试', independent: true }
    }),
    task('independent-answer-self', 'cloze', '从提问者的 you 转为回答者的 I', '你准备好了，回答同学', {
      display: { title: '你准备好了，回答同学', material: '同学问你是否准备好开始游戏。' },
      reading: 'Are you ready?', blanks: [{ before: 'Yes, I ', after: '.', options: ['am', 'are', 'is'] }], answer: '["am"]',
      hint: '现在换你回答。I 指自己，要用和 I 搭配的形式。', workshop: { phase: '自己试试', independent: true },
      distractorRationale: '换回答者后主语是 I，需要 am；不能照抄问句中的 are。'
    })
  ];
  const exam = [...unit.questions.exam,
    task('exam-self-guess', 'wordbank', '在新的角色猜谜中独立构成 Am I 问句', '问自己：我准备好了吗？', {
      display: { title: '问自己：我准备好了吗？', material: '出发前，先问问自己。ready：准备好的' },
      tokens: ['ready', 'Am', 'I'], slots: 3, suffix: '?', answer: 'Am I ready',
      hint: '正在问自己，不是问对方；先确定“我”该怎样说。'
    }),
    task('exam-person-exchange', 'cloze', '综合运用 Are you 提问与 I am 回答', '完成角色猜谜的一问一答', {
      display: { title: '完成角色猜谜的一问一答', material: '你扮演学生。同学问你，你作肯定回答。student：学生' },
      blanks: [{ before: '同学：', after: ' you a student?', options: ['Are', 'Am', 'Is'] }, { before: '你：Yes, I ', after: '.', options: ['am', 'are', 'is'] }],
      answer: '["Are","am"]', hint: '两个人轮流说话。分别看 you 和 I 各自与哪个形式搭配。',
      distractorRationale: 'you 与 are、I 与 am 搭配；轮流问答时不能机械复制前一个人的形式。'
    })
  ];
  for (const [id, items] of Object.entries({ trans, exam })) {
    unit.taskPredecessors[id] = [{ key: 'unit12-' + id + '-practice/' + unit.taskSessions[id], questions: unit.questions[id] }, ...unit.taskPredecessors[id]];
    unit.taskSessions[id] = 'grammar-v4'; unit.questions[id] = items;
  }
  unit.stages.find(stage => stage.id === 'l3').title = '语法小工坊';
  unit.stages.find(stage => stage.id === 'l3').activities = [['trans', '语法小工坊', 'order']];
  unit.stages.find(stage => stage.id === 'l3').required = ['trans'];
  unit.stages.find(stage => stage.id === 'l4').title = '街角小帮手';
  unit.stages.find(stage => stage.id === 'l4').activities = [['ask', '找对物品', 'question'], ['manners', '帮忙还手提包', 'give']];
  unit.stages.find(stage => stage.id === 'l4').required = ['ask', 'manners'];
  unit.experienceVersion = 'classroom-grammar-4';
})(globalThis.CanranCore);
