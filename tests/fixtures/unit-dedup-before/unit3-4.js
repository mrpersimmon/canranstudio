(function (root) {
  'use strict';
  const image = name => '/assets/unit3-4/' + name + '.svg';
  const oldImage = name => '/assets/unit1-2/' + name + '.svg';
  const sharedImage = name => '/assets/lesson49/icons/' + name + '.svg';
  const recording = name => 'unit3-4/audio/' + name + '.mp3';
  const source = '《新概念英语智慧版1》纸页 6–9（PDF 39–42 页）';
  const newObjects = [
    ['umbrella', '雨伞', 'l03-w01', '/ʌmˈbrelə/'],
    ['ticket', '票；本课是寄存牌', 'l03-w05', '/ˈtɪkɪt/'],
    ['cloakroom', '衣帽寄存处', 'l03-w10', '/ˈkloʊkruːm/'],
    ['suit', '一套衣服；图中是西服套装', 'l04-w01', '/suːt/'],
    ['school', '学校', 'l04-w02', '/skuːl/'],
    ['teacher', '老师', 'l04-w03', '/ˈtiːtʃɚ/'],
    ['son', '儿子；相对于父母的关系', 'l04-w04', '/sʌn/'],
    ['daughter', '女儿；相对于父母的关系', 'l04-w05', '/ˈdɑːt̬ɚ/']
  ].map(([en, cn, audio, ph]) => ({ en, cn, ph, image: image(en), audio: recording(audio), source }));
  const reviewObjects = [
    ['pen', '钢笔', '/pen/'], ['pencil', '铅笔', '/ˈpensəl/'], ['book', '书', '/bʊk/'],
    ['watch', '手表', '/wɑːtʃ/'], ['coat', '外套', '/koʊt/'], ['dress', '连衣裙', '/dres/'],
    ['skirt', '裙子', '/skɝːt/'], ['shirt', '衬衫', '/ʃɝːt/'], ['car', '小汽车', '/kɑːr/'], ['house', '房子', '/haʊs/']
  ].map(([en, cn, ph], i) => ({ en, cn, ph, image: oldImage(en), audio: recording('l02-w' + String(i + 1).padStart(2, '0')), source: 'Lesson 4 纸页 8–9，复习替换词' }));
  const expressions = [
    ['please', '请；让请求更礼貌', 'My coat and my umbrella please.', 'speech', 'l03-w02', '/pliːz/'],
    ['here', '这里；本句用于出示东西', 'Here is my ticket.', 'give', 'l03-w03', '/hɪr/'],
    ['my', '我的；指说话人的', 'Here is my ticket.', 'people', 'l03-w04', '/maɪ/'],
    ['number', '号码；本课指寄存牌号', 'Number five.', 'number', 'l03-w06', '/ˈnʌmbɚ/'],
    ['five', '五', 'Number five.', 'five', 'l03-w07', '/faɪv/'],
    ['sorry', '对不起的；本句表示歉意', 'Sorry, sir.', 'heart', 'l03-w08', '/ˈsɔːri/'],
    ['sir', '先生；对男士的礼貌称呼', 'Thank you, sir.', 'people', 'l03-w09', '/sɝː/']
  ].map(([en, cn, example, art, audio, ph]) => ({ en, cn, example, ph, image: ['number', 'five'].includes(art) ? image(art) : sharedImage(art), audio: recording(audio), source }));
  const objects = [...newObjects, ...reviewObjects];
  const WORDS = [...newObjects, ...reviewObjects, ...expressions];
  const DIALOGUE = [
    ['visitor', 'My coat and my umbrella please.', '请把我的外套和雨伞拿给我。'],
    ['visitor', 'Here is my ticket.', '这是我的寄存牌。'],
    ['attendant', 'Thank you, sir.', '谢谢您，先生。'],
    ['attendant', 'Number five.', '五号。'],
    ['attendant', "Here's your umbrella and your coat.", '这是您的雨伞和外套。'],
    ['visitor', 'This is not my umbrella.', '这不是我的雨伞。'],
    ['attendant', 'Sorry, sir.', '对不起，先生。'],
    ['attendant', 'Is this your umbrella?', '这是您的雨伞吗？'],
    ['visitor', "No, it isn't.", '不，不是。'],
    ['attendant', 'Is this it?', '这把是吗？'],
    ['visitor', 'Yes, it is.', '是的，是这把。'],
    ['visitor', 'Thank you very much.', '非常感谢！']
  ].map(([who, text, cn], i) => ({ id: 'L03-D' + String(i + 1).padStart(2, '0'), who, text, cn, audio: recording('l03-d' + String(i + 1).padStart(2, '0')), source: 'Lesson 3 纸页 6（PDF 39）' }));
  const AUDIO = Object.fromEntries(WORDS.map(word => [word.en, word.audio]));
  DIALOGUE.forEach(line => { AUDIO[line.text] = line.audio; });
  const substitutionWords = [...reviewObjects, ...newObjects.slice(3)];
  const ask = word => `Is this your ${word}?`;
  const deny = word => `No. It isn't my ${word}. It's your ${word}.`;
  substitutionWords.forEach((word, i) => { AUDIO[ask(word.en)] = recording('l04-p' + String(i + 1).padStart(2, '0')); });
  for (const word of ['umbrella', ...reviewObjects.map(word => word.en)]) AUDIO[deny(word)] = recording('reply-' + word);
  const SENTENCE_MODELS = substitutionWords.map(word => ({ en: ask(word.en), cn: `这是你的${{ suit: '西服套装', son: '儿子', daughter: '女儿' }[word.en] || word.cn}吗？`, image: word.image }));
  const REPLY_MODELS = ['umbrella', ...reviewObjects.map(word => word.en)].map(en => ({ en: deny(en), cn: '不是我的，是你的。', image: objects.find(word => word.en === en).image }));
  const PHRASES = [
    ['My coat and my umbrella please.', '礼貌地取回物品', image('umbrella')],
    ['Here is my ticket.', '出示自己的寄存牌', image('ticket')],
    ['This is not my umbrella.', '说明这不是自己的雨伞', image('umbrella')],
    ['Sorry, sir.', '向这位男士道歉', sharedImage('heart')],
    ["No, it isn't.", '明确不是时，作否定回答', sharedImage('question')],
    ['Yes, it is.', '确认是时，作肯定回答', sharedImage('check')],
    [deny('umbrella'), '已知是对方的伞：先否定，再说明归属', image('umbrella')]
  ].map(([en, cn, image]) => ({ en, cn, image }));
  const question = (id, target, prompt, options, answer, explanation, hint = '', extra = {}) => ({ id: 'u34-v1-' + id, target, prompt, options, answer, explanation, hint, source, ...extra });
  // New reply tasks own new answer records; unchanged activities keep theirs.
  const replyQuestion = (id, ...args) => ({ ...question('reply-' + id, ...args), id: 'u34-v2-reply-' + id, source: 'Lesson 3–4 的 my／your、肯定与否定问答；另设应用情境，非新增课文事实' });
  const pictureOptions = Object.fromEntries(objects.map(word => [word.en, word.image]));
  const listenWords = ['umbrella', 'ticket', 'coat', 'suit', 'school', 'teacher', 'son', 'daughter', 'pen', 'pencil', 'dress', 'shirt'];
  const questions = {
    listen: listenWords.map((en, i) => {
      const others = listenWords.filter(word => word !== en);
      return question('listen-' + en, '听辨 ' + en, '听一听，选出单词。', [en, others[i % others.length], others[(i + 3) % others.length], others[(i + 6) % others.length]], en, '再听一次，选出对应的词。', '', { audioText: en, optionImages: pictureOptions });
    }),
    roles: [
      question('story-items', '听懂客人的请求', '故事里的客人要取回什么？', ['外套和雨伞', '书和钢笔', '西服和手表'], '外套和雨伞', '客人说“My coat and my umbrella please.”，要取外套和雨伞。', '回想第一句里的 coat 和 umbrella。'),
      question('story-number', '听懂寄存牌号码', '客人的寄存牌是几号？', ['五号', '三号', '九号'], '五号', '工作人员读出“Number five.”，是五号。', '回想 Number 后面的词。'),
      question('story-wrong', '分辨拿错的物品', '客人说哪一件不是自己的？', ['雨伞', '外套', '寄存牌'], '雨伞', '客人说“This is not my umbrella.”，没有说外套拿错了。', '回想 This is not my 后面说了什么。', { optionImages: { '雨伞': image('umbrella'), '外套': oldImage('coat'), '寄存牌': image('ticket') } }),
      question('story-my', '按说话人理解 my', '客人说“Here is my ticket.”，寄存牌是谁的？', ['客人的', '工作人员的'], '客人的', 'my 指说话人自己的；这句话是客人说的。', '先找说这句话的人。', { optionImages: { '客人的': image('visitor'), '工作人员的': image('attendant') } }),
      question('story-it', '联系上文理解 it', '工作人员问“Is this it?”，这里在确认什么？', ['是不是客人的雨伞', '是不是客人的学校', '是不是五号寄存牌'], '是不是客人的雨伞', '前面一直在找客人的雨伞，这里的 it 代替 your umbrella。', '这句话接着哪件物品往下问？'),
      question('story-end', '理解故事结局', '客人最后找回自己的雨伞了吗？', ['找回了', '没有找回'], '找回了', '他回答“Yes, it is.”，接着说“Thank you very much.”。', '留意最后的肯定回答。')
    ],
    manners: [
      question('polite-wrong', '说明物品不是自己的', '工作人员递来的雨伞不是你的。怎样说明？', ['This is not my umbrella.', 'Yes, it is.', 'Here is my ticket.'], 'This is not my umbrella.', 'This is not my umbrella. 表示“这不是我的雨伞”。', '用 not 表示否定，用 my 表示自己的。'),
      question('polite-sorry', '拿错物品后道歉', '你把雨伞拿错给一位男士，怎样道歉？', ['Sorry, sir.', 'Thank you, sir.', 'Number five.'], 'Sorry, sir.', 'Sorry, sir. 是向这位男士表示歉意，sir 是礼貌称呼。', '已经拿错了东西，现在先表示歉意。'),
      question('polite-no', '依据事实否定回答', '别人问“Is this your coat?”，这件外套不是你的。怎样回答？', ["No, it isn't.", 'Yes, it is.', 'Thank you very much.'], "No, it isn't.", '已知不是自己的，用 No, it isn’t. 回答；否定本身不说明外套属于谁。', '题目明确说外套不是你的。'),
      question('polite-yes', '依据事实肯定回答', '别人问“Is this your umbrella?”，这把雨伞确实是你的。怎样回答？', ['Yes, it is.', "No, it isn't.", 'Sorry, sir.'], 'Yes, it is.', '这把雨伞是你的，用 Yes, it is. 确认。', '题目明确说是你的。'),
      question('polite-your', '随说话人区分 my 与 your', '你对同学说“It’s your book.”，书是谁的？', ['同学的', '你自己的'], '同学的', 'your 指听话人的；你正在对同学说“这是你的书”。', '想一想，你正在对谁说“你的”。')
    ],
    ask: substitutionWords.slice(10).map(word => {
      const labels = { suit: '西服套装', school: '学校', teacher: '老师', son: '儿子', daughter: '女儿' };
      const group = ['teacher', 'son', 'daughter'].includes(word.en) ? ['teacher', 'son', 'daughter'] : ['suit', 'school', 'house'];
      return question('ask-' + word.en, '询问' + labels[word.en], `想问对方“这是你的${labels[word.en]}吗？”，怎样说？`, group.map(ask), ask(word.en), `用 Is this your…? 问对方。${labels[word.en]}是 ${word.en}。` + (['teacher', 'son', 'daughter'].includes(word.en) ? '这里说的是人与人的关系。' : ''), '把对应的人或物名称放在 your 后面。', { image: word.image, imageAlt: labels[word.en] });
    }),
    reply: [
      replyQuestion('hear-owner', '听懂对方说的 your', '同学正在对你说话。听一听，钢笔是谁的？', ['你的', '同学的'], '你的', '同学说“It’s your pen.”。他对你说话，your 指你的。', '', { audioText: deny('pen') }),
      replyQuestion('confirm-own', '按真实归属作肯定回答', '手表是你的。同学问“Is this your watch?”，你怎样回答？', ['Yes, it is.', "No, it isn't.", 'Sorry, sir.'], 'Yes, it is.', '已知手表是你的，用 Yes, it is. 确认。不能每次都作否定回答。', '先判断手表是不是你的。', { image: oldImage('watch'), imageAlt: '手表' }),
      replyQuestion('switch-speaker', '换说话人后切换 my 与 your', '书是你的。你说“It’s my book.”。换同学对你说：It’s ___ book.', ['my', 'your'], 'your', '书的主人没有变。你说“我的”，同学对你说“你的”，所以他用 your。', '这次是谁在说话？他正在对谁说？', { image: oldImage('book'), imageAlt: '书' }),
      replyQuestion('build-denial', '完整表达否定和已知归属', '外套是同学的。同学问“Is this your coat?”。用词块回答“不是我的，是你的”。', undefined, deny('coat'), '先用 It isn’t my coat. 说明不是自己的，再用 It’s your coat. 说明是对方的。这里已经知道外套属于同学。', 'No. 后先说明“不是我的”，再说明“是你的”。', { type: 'order', tokens: ['No.', "It isn't", 'my coat.', "It's", 'your coat.'] }),
      replyQuestion('unknown-owner', '否定时不添加未知归属', '这把雨伞不是你的，但你不知道是谁的。同学问“Is this your umbrella?”，怎样回答最准确？', ["No, it isn't.", deny('umbrella'), 'Yes, it is.'], "No, it isn't.", '只能确认不是你的，还不知道是谁的。No, it isn’t. 已经准确回答；不能再加 It’s your umbrella. 猜是同学的。', '只说题目已经告诉你的事实。')
    ],
    trans: [
      question('build-not', '拼出否定说明', '用词块说：这不是我的雨伞。', undefined, 'This is not my umbrella.', '在 is 后放 not，my umbrella 表示“我的雨伞”。', '先放 This is，再放 not。', { type: 'order', tokens: ['This', 'is', 'not', 'my', 'umbrella.'] }),
      question('build-no', '拼出否定回答', '对方问这是不是你的外套，已知不是。用词块回答。', undefined, "No, it isn't.", 'No, it isn’t. 是否定回答，isn’t 是 is not 的缩写。', '先回答 No，再放 it isn’t。', { type: 'order', tokens: ['No,', 'it', "isn't."] }),
      question('build-my', '用 my 说明不是自己的', '用词块说：它不是我的书。', undefined, "It isn't my book.", 'It isn’t my book. 否定“这是我的书”。', 'isn’t 放在 It 后，my 放在 book 前。', { type: 'order', tokens: ['It', "isn't", 'my', 'book.'] }),
      question('build-your', '用 your 说明对方的', '书是对面同学的。用词块对他说：这是你的书。', undefined, "It's your book.", 'It’s 是 It is 的缩写，your 指听话的同学的。', '从 It’s 开始，再说 your book。', { type: 'order', tokens: ["It's", 'your', 'book.'] })
    ],
    exam: [
      question('exam-suit', '听辨新词', '听一听，选出单词。', ['suit', 'coat', 'shirt', 'dress'], 'suit', '再听一次，找出西服套装。', '', { audioText: 'suit', optionImages: pictureOptions }),
      question('exam-sorry', '在新情境道歉', '你不小心拿错了一位男士的寄存牌，怎样道歉？', ['Sorry, sir.', 'Number five.', 'Thank you, sir.'], 'Sorry, sir.', '拿错物品先表示歉意：Sorry, sir.。', '这次需要道歉。'),
      question('exam-no', '真实否定', '朋友问“Is this your pencil?”，已知铅笔不是你的。怎样回答？', ["No, it isn't.", 'Yes, it is.', 'Here is my ticket.'], "No, it isn't.", '不是自己的，就用 No, it isn’t. 作否定回答。', '根据“不是你的”作答。'),
      question('exam-daughter', '询问人物关系', '想问一位家长“这是你的女儿吗？”，怎样说？', [ask('daughter'), ask('son'), ask('teacher')], ask('daughter'), 'daughter 是女儿；问的是她与这位家长的关系。', '女儿是 daughter。', { image: image('daughter'), imageAlt: '家长和女儿' }),
      question('exam-my', 'my 随说话人变化', '同学对你说“This is my book.”，这里的书是谁的？', ['同学的', '你自己的'], '同学的', '这次是同学在说话，my 指同学自己的。', '先找说话的人，再理解 my。'),
      question('exam-school', '从完整问句听出目标', '听一听，正在问什么？', ['school', 'house', 'teacher', 'suit'], 'school', '再听问句，注意 your 后面的词。', '', { audioText: ask('school'), optionImages: pictureOptions }),
      question('exam-build', '在新物品上否定归属', '用词块说：这不是我的西服套装。', undefined, 'This is not my suit.', '保留 This is not my，用 suit 表示西服套装。', 'not 放在 is 后面。', { type: 'order', tokens: ['This', 'is', 'not', 'my', 'suit.'] }),
      question('exam-owner', '不从否定推断所有者', '客人只说“This is not my umbrella.”。能确定这把伞是谁的吗？', ['还不能确定', '一定是工作人员的', '一定是客人的'], '还不能确定', '这句话只说明不是客人的，没有说明是谁的。不能凭“不是我的”猜成“就是你的”。', '他说出了“是谁的”，还是只说“不是谁的”？')
    ]
  };
  for (const [activity, items] of Object.entries(questions)) for (const q of items) {
    if (activity === 'roles') q.source = 'Lesson 3 纸页 6–7，原文理解';
    else if (['manners', 'exam'].includes(activity)) q.source += '；另设应用情境，非新增课文事实';
    if (q.options) q.distractorReasons = Object.fromEntries(q.options.filter(value => value !== q.answer).map(value => [value, `不符合本题给定的人物、物品或事实。${q.explanation}`]));
  }
  const stages = [
    { id: 'l1', title: '认领前准备', activities: [['words', '认领小图鉴', 'cards'], ['listen', '听音寻宝', 'audio']], required: ['listen'] },
    { id: 'l2', title: '找回我的伞', activities: [['text', '衣帽间小剧场', 'book'], ['roles', '故事小侦探', 'people']], required: ['text', 'roles'] },
    { id: 'l3', title: '礼貌认领', activities: [['phrases', '认领小锦囊', 'speech'], ['manners', '回应小帮手', 'heart']], required: ['manners'] },
    { id: 'l4', title: '你我的小工坊', activities: [['ask', '看图问一问', 'question'], ['reply', '你我的接力', 'give'], ['trans', '词块拼装台', 'order']], required: ['ask', 'reply', 'trans'] },
    { id: 'l5', title: '认领小达人', activities: [['exam', '认领小挑战', 'star'], ['certificate', '我的单元证书', 'star']], required: ['exam'] }
  ];
  const definition = {
    id: 'unit3-4', version: 1, title: '雨伞认领小帮手', path: '/unit3-4/', start: 'learn/words',
    progress: { learningKey: 'canran:unit3-4:learning:v1' },
    learning: { WORDS, PHRASES, SENTENCE_MODELS, REPLY_MODELS, DIALOGUE, AUDIO, FEEDBACK: root.CanranCore.courseCatalog.requirePublishedCourse('lesson49').learning.FEEDBACK }, objects, stages, questions
  };
  root.CanranCore.unit34 = definition;
  if (root.document?.documentElement.dataset.unit === definition.id) root.CanranCore.learningContext = definition;
})(globalThis);
