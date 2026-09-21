(function (root) {
  'use strict';
  const image = name => '/assets/unit1-2/' + name + '.svg';
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
    ['excuse', '原谅；本句用于礼貌招呼', 'Excuse me!', 'speech', 'l01-w01', '/ɪkˈskjuːz/'],
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
  const ask = word => `Is this your ${word}?`;
  const pictureOptions = Object.fromEntries(objects.map(word => [word.en, word.image]));
  const questions = {
    roles: [
      question('story-owner', '听懂手提包的归属', '故事里的手提包是谁的？', ['女士', '男士'], '女士', '男士询问后，女士回答“Yes, it is.”，确认手提包是她的。', '回想是谁回答了“Yes, it is.”。', { optionImages: { '女士': image('woman'), '男士': image('man') } }),
      question('story-your', '理解问句中的 your', '男士问“Is this your handbag?”，这里的 your 指谁？', ['对面的女士', '说话的男士'], '对面的女士', '男士在问对面的女士：“这是你的手提包吗？”your 在这句话中指女士的。', 'your 表示“你的”，看说话的人正在问谁。'),
      question('story-pardon', '理解请求重复', '女士说“Pardon?”，希望男士做什么？', ['再说一遍', '把包留下', '说谢谢'], '再说一遍', 'Pardon? 在这里是“请再说一遍”，不是拒绝手提包。', '留意她说完后，男士又说了什么。'),
      question('story-thanks', '理解致谢对象', '女士最后是在感谢谁？', ['男士', '她自己'], '男士', '男士帮她找回手提包，女士向男士道谢。', '是谁把手提包交回来的？', { optionImages: { '男士': image('man'), '她自己': image('woman') } })
    ],
    listen: objects.map((word, index) => {
      const nearby = objects.slice(1);
      const distractors = nearby.filter(item => item.en !== word.en);
      const choices = [word.en, ...Array.from({ length: 3 }, (_, n) => distractors[(index + n * 3) % distractors.length].en)];
      return question('listen-' + word.en, '听辨 ' + word.en, '听一听，选出单词。', choices, word.en, '再听一次，找出对应物品。', '', { audioText: word.en, optionImages: pictureOptions });
    }),
    manners: [
      question('polite-attention', '礼貌引起注意', '想叫住一位路人，先说什么？', ['Excuse me!', 'Pardon?', 'Thank you very much.'], 'Excuse me!', 'Excuse me! 可以礼貌地引起对方注意。', '你还没有和对方说话，先礼貌地打个招呼。'),
      question('polite-repeat', '请对方重复', '同学说得太轻，你没听清。怎样请他再说一遍？', ['Pardon?', 'Yes, it is.', 'Thank you very much.'], 'Pardon?', '没听清时用 Pardon? 请求重复。', '不是表示同意，而是请他重复刚才的话。'),
      question('polite-confirm', '肯定确认归属', '同学问“Is this your book?”，这本书确实是你的。怎样回答？', ['Yes, it is.', 'Pardon?', 'Excuse me!'], 'Yes, it is.', '对方问“这是你的书吗？”，你用 Yes, it is. 确认。', '书是你的，先肯定回答。'),
      question('polite-thanks', '得到帮助后致谢', '路人把你的手表还给你，你想感谢他。怎样说？', ['Thank you very much.', 'Pardon?', 'Is this your watch?'], 'Thank you very much.', '得到帮助后可以说 Thank you very much.。', '手表已经还给你了，现在表达感谢。')
    ],
    ask: objects.slice(1).map((word, index, list) => question(
      'ask-' + word.en, '用物品替换问句：' + word.en,
      '想问对方“这是你的' + word.cn + '吗？”，怎样说？',
      [ask(word.en), ask(list[(index + 1) % list.length].en), ask(list[(index + 3) % list.length].en)],
      ask(word.en), '用 Is this your…? 询问归属，' + word.cn + '是 ' + word.en + '。',
      '保留 Is this your，把物品名称放在后面。', { image: word.image, imageAlt: word.cn }
    )),
    trans: [
      question('build-pen', '拼出归属问句', '用词块问：这是你的钢笔吗？', undefined, 'Is this your pen?', '问句是 Is this your pen?，Is 放在开头。', '从 Is 开始，再说 this 和 your。', { type: 'order', tokens: ['Is', 'this', 'your', 'pen?'] }),
      question('build-yes', '拼出肯定回答', '这确实是你的钢笔。用词块回答。', undefined, 'Yes, it is.', '用 Yes, it is. 作肯定回答，it 指刚才说的钢笔。', '先说 Yes，再用 it is 回答。', { type: 'order', tokens: ['Yes,', 'it', 'is.'] }),
      question('build-thanks', '拼出感谢表达', '用词块说：非常感谢！', undefined, 'Thank you very much.', 'Thank you 表示谢谢，very much 加强感谢。', '先说 Thank you，再加 very much。', { type: 'order', tokens: ['Thank', 'you', 'very', 'much.'] })
    ],
    exam: [
      question('exam-pencil', '听辨物品', '听一听，选出单词。', ['pencil', 'pen', 'book', 'watch'], 'pencil', '再听一次，分辨铅笔和其他物品。', '', { audioText: 'pencil', optionImages: pictureOptions }),
      question('exam-pardon', '把请求重复用在新情境', '朋友的话被车声盖住了，你没听清。怎样说？', ['Pardon?', 'Yes, it is.', 'Thank you very much.'], 'Pardon?', 'Pardon? 请对方把刚才的话重复一遍。', '你想听清刚才那句话。', { source: source + '；另设情境' }),
      question('exam-dress', '在新物品上询问归属', '想问对方“这是你的连衣裙吗？”，怎样说？', [ask('dress'), ask('skirt'), ask('shirt')], ask('dress'), '连衣裙是 dress，问句是 Is this your dress?。', '连衣裙上下连在一起，区别于裙子 skirt。', { image: image('dress'), imageAlt: '连衣裙' }),
      question('exam-yes', '根据事实肯定回应', '朋友问“Is this your coat?”，外套确实是你的。怎样确认？', ['Yes, it is.', 'Pardon?', 'Excuse me!'], 'Yes, it is.', '外套是你的，用 Yes, it is. 确认。', '对方没有要求你重复，是在问物品的归属。'),
      question('exam-your', '在新情境理解 your', '你问对面的同学“Is this your watch?”，这里的 your 指谁？', ['对面的同学', '你自己'], '对面的同学', '你在问同学“这是你的手表吗？”，your 指同学的。', 'your 表示“你的”，看你在问谁。', { source: source + '；另设情境' }),
      question('exam-car', '从完整问句听出物品', '听一听，正在问哪件东西？', ['car', 'house', 'coat', 'watch'], 'car', '再听一次，注意句子末尾的物品名。', '', { audioText: ask('car'), optionImages: pictureOptions }),
      question('exam-house', '拼出新的归属问句', '用词块问：这是你的房子吗？', undefined, ask('house'), 'Is this your house? 用 house 替换物品名称。', 'Is this your 后面放 house。', { type: 'order', tokens: ['Is', 'this', 'your', 'house?'] }),
      question('exam-thanks', '把感谢用到新情境', '朋友帮你找到了书，你想认真地感谢他。怎样说？', ['Thank you very much.', 'Pardon?', 'Is this your book?'], 'Thank you very much.', '找到书后向帮助你的人说 Thank you very much.。', '书已经找到了，现在要表达感谢。', { source: source + '；另设情境' })
    ]
  };
  const stages = [
    // Chapter IDs remain stable when the recommended learning order changes.
    { id: 'l2', title: '身边的小物品', activities: [['words', '物品小图鉴', 'cards'], ['listen', '听音寻宝', 'audio']], required: ['listen'] },
    { id: 'l1', title: '手提包的故事', activities: [['text', '相遇小剧场', 'book'], ['roles', '故事小侦探', 'people']], required: ['text', 'roles'] },
    { id: 'l3', title: '开口有礼貌', activities: [['phrases', '礼貌小锦囊', 'speech'], ['manners', '回应小帮手', 'heart']], required: ['manners'] },
    { id: 'l4', title: '问句小工坊', activities: [['ask', '看图问一问', 'question'], ['trans', '词块拼装台', 'order']], required: ['ask', 'trans'] },
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
  const definition = {
    id: 'unit1-2', version: 1, title: '礼貌小帮手', path: '/unit1-2/', start: 'learn/words',
    progress: { learningKey: 'canran:unit1-2:learning:v1' },
    learning: { WORDS, PHRASES, SENTENCE_MODELS, DIALOGUE, AUDIO, FEEDBACK: root.CanranCore.courseCatalog.requirePublishedCourse('lesson49').learning.FEEDBACK }, objects, stages, questions
  };
  root.CanranCore.unit12 = definition;
  // The navigation can read unit metadata without activating its storage context.
  if (root.document?.documentElement.dataset.unit === definition.id) root.CanranCore.learningContext = definition;
})(globalThis);
