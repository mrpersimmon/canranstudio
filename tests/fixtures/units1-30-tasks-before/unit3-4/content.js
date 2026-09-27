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
  const listenWords = ['umbrella', 'ticket', 'suit', 'school', 'teacher', 'son', 'daughter'];
  // Frozen task contracts from the last voiced edition; not student activities.
  const previousQuestions = {
    listen: listenWords.map((en, i) => {
      const others = listenWords.filter(word => word !== en);
      return question('listen-' + en, '听辨 ' + en, '听一听，选出单词。', [en, others[i % others.length], others[(i + 2) % others.length], others[(i + 4) % others.length]], en, '再听一次，选出对应的词。', '', { audioText: en, optionImages: pictureOptions });
    }),
    roles: [
      question('story-items', '听懂客人的请求', '故事里的客人要取回什么？', ['外套和雨伞', '书和钢笔', '西服和手表'], '外套和雨伞', '客人说“My coat and my umbrella please.”，要取外套和雨伞。', '回顾客人开头提出的请求。'),
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
    ],
    ask: [
      question('ask-relationship', '询问人物关系', '想问同学“这位是你的老师吗？”，怎样说？', [ask('teacher'), ask('son'), ask('school')], ask('teacher'), 'Is this your teacher? 询问这位与同学是否是师生关系，不是说老师属于谁。', 'teacher 表示老师；这里确认的是人物关系。', { id: 'u34-v3-ask-relationship', image: image('teacher'), imageAlt: '老师在教室里' })
    ],
    reply: [
      replyQuestion('hear-owner', '听懂对方说的 your', '同学正在对你说话。听一听，钢笔是谁的？', ['你的', '同学的'], '你的', '同学说“It’s your pen.”。他对你说话，your 指你的。', '', { audioText: deny('pen') }),
      replyQuestion('switch-speaker', '换说话人后切换 my 与 your', '书是你的。你说“It’s my book.”。换同学对你说：It’s ___ book.', ['my', 'your'], 'your', '书的主人没有变。你说“我的”，同学对你说“你的”，所以他用 your。', '这次是谁在说话？他正在对谁说？', { image: oldImage('book'), imageAlt: '书' }),
      replyQuestion('build-denial', '完整表达否定和已知归属', '外套是同学的。同学问“Is this your coat?”。用词块回答“不是我的，是你的”。', undefined, deny('coat'), '先用 It isn’t my coat. 说明不是自己的，再用 It’s your coat. 说明是对方的。这里已经知道外套属于同学。', 'No. 后先说明“不是我的”，再说明“是你的”。', { type: 'order', tokens: ['No.', "It isn't", 'my coat.', "It's", 'your coat.'] }),
      replyQuestion('unknown-owner', '否定时不添加未知归属', '这把雨伞不是你的，但你不知道是谁的。同学问“Is this your umbrella?”，怎样回答最准确？', ["No, it isn't.", deny('umbrella'), 'Yes, it is.'], "No, it isn't.", '只能确认不是你的，还不知道是谁的。No, it isn’t. 已经准确回答；不能再加 It’s your umbrella. 猜是同学的。', '只说题目已经告诉你的事实。')
    ],
    trans: [
      question('build-not', '拼出否定说明', '用词块说：这不是我的雨伞。', undefined, 'This is not my umbrella.', '在 is 后放 not，my umbrella 表示“我的雨伞”。', '先放 This is，再放 not。', { type: 'order', tokens: ['This', 'is', 'not', 'my', 'umbrella.'] }),
      question('build-your', '用 your 说明对方的', '书是对面同学的。用词块对他说：这是你的书。', undefined, "It's your book.", 'It’s 是 It is 的缩写，your 指听话的同学的。', '先确认书属于说话的人，还是听话的人。', { type: 'order', tokens: ["It's", 'your', 'book.'] })
    ],
    exam: [
      question('exam-school', '从完整问句听出目标', '听一听，正在问什么？', ['school', 'house', 'teacher', 'suit'], 'school', '再听问句，注意 your 后面的词。', '', { audioText: ask('school'), optionImages: pictureOptions }),
      question('exam-repair', '组合道歉与确认', '拿错伞后，你换了一把。向这位男士道歉，再确认新拿来的伞，怎样说？', ['Sorry, sir. Is this your umbrella?', 'Thank you, sir. This is not my umbrella.', 'Number five. Here is my ticket.'], 'Sorry, sir. Is this your umbrella?', '拿错伞先说 Sorry, sir.，再用 Is this your umbrella? 向这位男士确认。', '先表示歉意，再询问对方。', { id: 'u34-v3-exam-repair' }),
      question('exam-evidence', '同时区分已知归属与未知归属', '你说：“Here is my coat. This is not my umbrella.”\n根据这两句话，哪张记录有依据？', ['外套是我的；雨伞主人还不知道', '外套和雨伞都是我的', '外套是我的；雨伞是工作人员的'], '外套是我的；雨伞主人还不知道', 'my coat 表示自己的外套；后一句只说伞不是自己的，没有说明主人，不能猜成工作人员的。', '只记录题目已经告诉你的事实。', { id: 'u34-v3-exam-evidence' })
    ]
  };
  for (const [activity, items] of Object.entries(previousQuestions)) for (const q of items) {
    if (activity === 'roles') q.source = 'Lesson 3 纸页 6–7，原文理解';
    else if (['manners', 'exam'].includes(activity)) q.source += '；另设应用情境，非新增课文事实';
    if (q.options) q.distractorReasons = Object.fromEntries(q.options.filter(value => value !== q.answer).map(value => [value, `不符合本题给定的人物、物品或事实。${q.explanation}`]));
  }

  // Exact predecessor retained only to migrate still-valid answers from the
  // last voiced edition. These tasks are not mounted in the classroom version.
  const classroomQuestion = (id, ...args) => ({ ...question(id, ...args), id: 'u34-classroom-v2-' + id });
  const questions = {
    listen: [
      classroomQuestion('word-umbrella', '辨认 umbrella', '哪一个词对应图中的物品？', ['umbrella', 'ticket', 'suit'], 'umbrella', 'umbrella 是雨伞。', '', { image: image('umbrella'), imageAlt: '雨伞' }),
      classroomQuestion('word-ticket', '理解 ticket 的本课词义', 'Here is my ticket.\n在衣帽寄存处，ticket 是什么？', ['寄存牌', '雨伞', '学校'], '寄存牌', '本课 ticket 是认领寄存物品时出示的牌子。'),
      classroomQuestion('word-suit', '辨认 suit', '哪一个词表示图中的一套衣服？', ['shirt', 'suit', 'skirt'], 'suit', 'suit 表示一套衣服；图中是一套西服。', '', { image: image('suit'), imageAlt: '西服上衣和长裤组成的一套衣服' }),
      classroomQuestion('word-school', '理解 school', 'school 表示什么？', ['学校', '房子', '老师'], '学校', 'school 是学校。'),
      classroomQuestion('word-teacher', '根据词义选择 teacher', '选出表示“老师”的英文。', ['teacher', 'school', 'daughter'], 'teacher', 'teacher 是老师，school 是学校。'),
      classroomQuestion('word-son', '理解 son 的亲子关系', 'son 表示什么？', ['儿子', '女儿', '所有男孩'], '儿子', 'son 是相对于父母来说的儿子，不等于所有男孩。'),
      classroomQuestion('word-daughter', '根据亲子关系选择 daughter', '父母说“女儿”，对应哪个词？', ['son', 'daughter', 'teacher'], 'daughter', 'daughter 是相对于父母来说的女儿。')
    ],
    roles: [
      previousQuestions.roles[2],
      previousQuestions.roles[4],
      classroomQuestion('story-number', '找到原文中的号码', '客人的寄存牌是几号？', ['五号', '三号', '九号'], '五号', '原文 Number five. 表示五号。', '回想 Number 后面的英文。')
    ],
    manners: [
      classroomQuestion('counter-request', '礼貌提出取回请求', '取回你的外套和雨伞，怎样请求？', ['My coat and my umbrella please.', 'Here is my ticket.', 'Sorry, sir.'], 'My coat and my umbrella please.', '用 please 礼貌提出取回物品的请求。', '说清要取回什么，再加上 please。'),
      classroomQuestion('counter-ticket', '出示自己的寄存牌', '你把寄存牌递给工作人员，怎样说？', ['Here is my ticket.', 'This is not my umbrella.', 'Thank you very much.'], 'Here is my ticket.', 'Here is my ticket. 用来出示自己的寄存牌。', 'here is 用来出示东西。'),
      previousQuestions.manners[0],
      previousQuestions.manners[3]
    ],
    reply: [
      ...previousQuestions.reply.slice(1),
      classroomQuestion('read-owner', '读懂对方说的 your', '同学对你说：“No. It isn’t my pen. It’s your pen.”\n钢笔是谁的？', ['你的', '同学的'], '你的', '同学正在对你说话，your 指听话的你。')
    ],
    exam: [
      ...previousQuestions.exam.slice(1),
      { ...previousQuestions.ask[0], id: 'u34-classroom-v2-exam-relationship' }
    ]
  };
  for (const items of Object.values(questions)) for (const q of items) {
    if (!q.distractorReasons && q.options) q.distractorReasons = Object.fromEntries(q.options.filter(value => value !== q.answer).map(value => [value, '与本题的英文、物品或已知人物关系不符。']));
  }

  const priorExam = questions.exam;
  const finalQuestion = (...args) => {
    const item = { ...question(...args), id: 'u34-final-v2-' + args[0], source: source + '；综合复习，另设语境不增加原文事实' };
    if (item.options) item.distractorReasons = Object.fromEntries(item.options.filter(value => value !== item.answer).map(value => [value, item.explanation]));
    return item;
  };
  questions.exam = [...priorExam,
    finalQuestion('request-record', '合并提取取物请求与寄存牌号', '客人：My coat and my umbrella please.\n工作人员：Number five.\n为这位客人选一张认领记录。', ['五号：外套和雨伞', '五号：外套和寄存牌', '三号：外套和雨伞'], '五号：外套和雨伞', 'coat 和 umbrella 是要取回的东西；Number five. 说明寄存牌是五号。ticket 是认领凭据，不是这句话里请求取回的东西。', '分别核对要取回什么，以及寄存牌号码。'),
    finalQuestion('show-ticket', '组织出示自己物品的表达', '出示你自己的寄存牌。用词块说：这是我的寄存牌。', undefined, 'Here is my ticket.', 'Here is my ticket. 用来出示说话人自己的寄存牌。', '先想是谁在出示东西，再安排这句话。', { type: 'order', tokens: ['Here', 'is', 'my', 'ticket.'] }),
    finalQuestion('known-owner', '否定后说明明确知道的归属', '书是对面同学的。他问你：Is this your book?\n用词块说：不是我的，是你的。', undefined, "No. It isn't my book. It's your book.", '已知书属于正在和你说话的同学，所以先否定 my book，再用 your book 说明是对方的；不是从“不属于我”猜出主人。', '先找书的主人，再想现在是谁在回答。', { type: 'order', tokens: ['No.', 'It', "isn't", 'my book.', "It's", 'your book.'] }),
    finalQuestion('speaker', '说话人改变时选择 my 或 your', '你说：Here is my ticket.\n工作人员把寄存牌递回给你，说：Here is ___ ticket.', ['my', 'your'], 'your', '同一张牌仍是你的；换工作人员对你说话，就用 your 表示听话人的。', '物品主人没有变，但现在说话的人是谁？'),
    finalQuestion('confirm', '联系上文理解 it 并按事实确认', "工作人员：Is this your umbrella?\n你：No, it isn't.\n他换了一把：Is this it?\n这次的伞确实是你的。最后一句在问什么？怎样回答？", ['问雨伞；Yes, it is.', '问寄存牌；Yes, it is.', "问雨伞；No, it isn't."], '问雨伞；Yes, it is.', '前文一直在确认雨伞，Is this it? 里的 it 代替 your umbrella。本题已说明新拿来的正是你的，所以回答 Yes, it is.。', '回看前面正在找什么，再核对新拿来的东西。'),
    finalQuestion('shortforms', '理解认领表达中的缩写', "Here's your ticket. It isn't my umbrella. It's your umbrella.\n三个缩写依次展开成什么？", ['Here is / is not / It is', 'Here is / is / It is', 'Here is / is not / This is'], 'Here is / is not / It is', 'Here’s 是 Here is；isn’t 是 is not；It’s 是 It is。展开不能丢掉否定，也不能换掉原来的主语。', '展开后，主语和肯定、否定的意思都应保持不变。')
  ];
  const stages = [
    { id: 'l1', title: '认领前准备', activities: [['words', '认领小图鉴', 'cards'], ['listen', '单词寻宝', 'cards']], required: ['listen'] },
    { id: 'l2', title: '找回我的伞', activities: [['text', '衣帽间小剧场', 'book'], ['roles', '故事小侦探', 'people']], required: ['text', 'roles'] },
    { id: 'l3', title: '办一次认领', activities: [['phrases', '认领小锦囊', 'speech'], ['manners', '认领柜台', 'give']], required: ['manners'] },
    { id: 'l4', title: '换人说一说', activities: [['reply', '你我的接力', 'people']], required: ['reply'] },
    { id: 'l5', title: '认领小达人', activities: [['exam', '认领小挑战', 'star'], ['certificate', '我的单元证书', 'star']], required: ['exam'] }
  ];
  const definition = {
    id: 'unit3-4', version: 1, contentRevision: 'classroom-v2', mode: 'classroom', title: '雨伞认领小帮手', path: '/unit3-4/', start: 'learn/words',
    progress: { learningKey: 'canran:unit3-4:learning:v1' },
    learning: { WORDS, PHRASES, SENTENCE_MODELS, REPLY_MODELS, DIALOGUE, AUDIO, FEEDBACK: root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK }, objects, stages, questions,
    voicedQuestions: previousQuestions, previousQuestions: { ...previousQuestions, exam: priorExam }, activityPredecessors: { exam: ['exam'] }
  };
  root.CanranCore.unit34 = definition;
  if (root.document?.documentElement.dataset.unit === definition.id) root.CanranCore.learningContext = definition;
})(globalThis);
