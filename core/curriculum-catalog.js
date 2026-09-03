(function attachCurriculumCatalog(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.curriculumCatalog = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function curriculumCatalogFactory() {
  'use strict';

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const nested of Object.values(value)) deepFreeze(nested);
    return Object.freeze(value);
  }

  const SUPPORT_LADDER = ['reobserve', 'partial-cue', 'model', 'near-transfer'];
  const BEATS = [
    { beatId: 'discover', title: '发现问题', buildStage: 1 },
    { beatId: 'understand', title: '听懂线索', buildStage: 2 },
    { beatId: 'teach', title: '教会小猫', buildStage: 3 },
    { beatId: 'transfer', title: '换个情境使用', buildStage: 4 },
    { beatId: 'build', title: '建造地标', buildStage: 5 }
  ];
  const COURSE_VOICE_BASELINES = deepFreeze({
    'nce-youth-v1': {
      baselineId: 'nce-youth-v1',
      locale: 'en-US',
      accentTarget: 'General American English',
      youthMaleVoiceId: 'am_michael',
      youthFemaleVoiceId: 'af_heart',
      standaloneWordVoiceId: 'af_heart',
      deviationPolicy: 'explicit-course-exception'
    }
  });

  function getCourseVoiceBaseline(baselineId) {
    return COURSE_VOICE_BASELINES[baselineId] || null;
  }

  function source(sourceId, sourceKind, text, details = {}) {
    return { sourceId, sourceKind, text, required: true, ...details };
  }

  function nceSource(sourceId, sourceKind, text, sourceRole, coveragePolicy, details = {}) {
    return { sourceId, sourceKind, text, sourceRole, coveragePolicy, ...details };
  }

  const LESSON1_DIALOGUE_TEXT = [
    'Excuse me!',
    'Yes?',
    'Is this your handbag?',
    'Pardon?',
    'Is this your handbag?',
    'Yes, it is.',
    'Thank you very much.'
  ];
  const LESSON1_DIALOGUE_SPEAKERS = ['man', 'woman', 'man', 'woman', 'man', 'woman', 'woman'];
  const LESSON1_DIALOGUE_POLICIES = ['evidence', 'exposure', 'evidence', 'evidence', 'exposure', 'evidence', 'evidence'];
  const LESSON1_UTTERANCE_EMBEDDED_REFS = {
    'L01-D01': ['L01-W01', 'L01-W02'],
    'L01-D02': ['L01-W03'],
    'L01-D03': ['L01-W04', 'L01-W05', 'L01-W06', 'L01-W07'],
    'L01-D04': ['L01-W08'],
    'L01-D05': ['L01-W04', 'L01-W05', 'L01-W06', 'L01-W07'],
    'L01-D06': ['L01-W03', 'L01-W09', 'L01-W04'],
    'L01-D07': ['L01-W10', 'L01-W11']
  };
  const LESSON1_TRANSLATIONS = [
    '对不起！',
    '什么事？',
    '这是您的手提包吗？',
    '对不起，请再说一遍。',
    '这是您的手提包吗？',
    '是的，是我的。',
    '非常感谢！'
  ];
  const LESSON1_VOCABULARY = [
    ['excuse', '原谅'],
    ['me', '我（宾格）'],
    ['yes', '是的'],
    ['is', 'be 动词现在时第三人称单数'],
    ['this', '这'],
    ['your', '你的，你们的'],
    ['handbag', '（女用）手提包'],
    ['pardon', '原谅，请再说一遍'],
    ['it', '它'],
    ['thank you', '感谢你（们）'],
    ['very much', '非常地']
  ];
  const LESSON2_VOCABULARY = [
    ['pen', '钢笔'],
    ['pencil', '铅笔'],
    ['book', '书'],
    ['watch', '手表'],
    ['coat', '上衣，外衣'],
    ['dress', '连衣裙'],
    ['skirt', '裙子'],
    ['shirt', '衬衣'],
    ['car', '小汽车'],
    ['house', '房子']
  ];

  const LESSON1_SOURCES = {
    'L01-I01': nceSource(
      'L01-I01',
      'textbook-instruction',
      'Listen then answer this question.',
      'context',
      'exposure',
      { translation: '听录音，然后回答问题。' }
    ),
    'L01-Q01': nceSource(
      'L01-Q01',
      'textbook-question',
      'Whose handbag is it?',
      'context',
      'exposure',
      { translation: '这是谁的手袋？' }
    ),
    ...Object.fromEntries(LESSON1_DIALOGUE_TEXT.map((text, index) => {
      const sourceId = `L01-D${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(
        sourceId,
        'dialogue',
        text,
        sourceId === 'L01-D05'
          ? 'target'
          : (LESSON1_DIALOGUE_POLICIES[index] === 'evidence' ? 'target' : 'support'),
        LESSON1_DIALOGUE_POLICIES[index],
        {
          speaker: LESSON1_DIALOGUE_SPEAKERS[index],
          embeddedSourceRefs: LESSON1_UTTERANCE_EMBEDDED_REFS[sourceId],
          audioSrc: `/poc/lesson1-2-experience/audio/${sourceId.toLowerCase()}.mp3`,
          voiceId: LESSON1_DIALOGUE_SPEAKERS[index] === 'man' ? 'am_michael' : 'af_heart',
          audioRenderMode: 'natural-utterance',
          audioReviewStatus: 'unreviewed-candidate'
        }
      )];
    })),
    ...Object.fromEntries(LESSON1_VOCABULARY.map(([text, translation], index) => {
      const sourceId = `L01-W${String(index + 1).padStart(2, '0')}`;
      const isHandbag = text === 'handbag';
      return [sourceId, nceSource(
        sourceId,
        'vocabulary',
        text,
        isHandbag ? 'target' : 'support',
        isHandbag ? 'evidence' : 'exposure',
        {
          translation,
          audioSrc: `/poc/lesson1-2-experience/audio/${sourceId.toLowerCase()}.mp3`,
          voiceId: 'af_heart',
          audioRenderMode: 'context-cropped-lexeme-v1',
          audioReviewStatus: 'unreviewed-candidate'
        }
      )];
    })),
    'L01-N01': nceSource(
      'L01-N01',
      'textbook-note',
      'Excuse me. 用于与陌生人搭话、打断说话或从别人身边挤过。',
      'support',
      'exposure',
      { linkedSourceRefs: ['L01-D01'] }
    ),
    'L01-N02': nceSource(
      'L01-N02',
      'textbook-note',
      'Pardon? 是 I beg your pardon? 的省略，请对方把刚才的话重复一遍。',
      'support',
      'exposure',
      { linkedSourceRefs: ['L01-D04', 'L01-D05'] }
    ),
    ...Object.fromEntries(LESSON1_TRANSLATIONS.map((text, index) => {
      const sourceId = `L01-Z${String(index + 1).padStart(2, '0')}`;
      const linkedSourceId = `L01-D${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(
        sourceId,
        'reference-translation',
        text,
        'context',
        'optional',
        { linkedSourceId }
      )];
    }))
  };

  const NCE_ACCEPTED_CLOTHING_AUDIO_HASHES = {
    'L02-W05': '78aaeced5faf1da980fa52bffecaa54a6f903c8da5d5ceb37a1a199ebfe5d36a',
    'L02-W06': '0b97030065844fb780e7d1a25e0a190da9aefe554fd020f18efd6f4a007793bf',
    'L02-W07': '152519e2a59eaa4d3f4918c994be85d005c92c974bc1e638daf44f916e902534',
    'L02-W08': '189312ec8ff5c13cdfeff053e72559d2e1a4137950eaad5549a3ecab6a2137e2'
  };

  const LESSON2_SOURCES = {
    'L02-I01': nceSource(
      'L02-I01',
      'textbook-instruction',
      'Look, listen and repeat.',
      'context',
      'exposure',
      { translation: '看图听录音，然后练习。' }
    ),
    ...Object.fromEntries(LESSON2_VOCABULARY.map(([text, translation], index) => {
      const sourceId = `L02-W${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(
        sourceId,
        'substitution-item',
        text,
        'target',
        'evidence',
        {
          translation,
          audioSrc: `/poc/lesson1-2-experience/audio/${sourceId.toLowerCase()}.mp3`,
          illustrationOrder: index + 1,
          voiceId: 'af_heart',
          audioRenderMode: 'context-cropped-lexeme-v1',
          audioReviewStatus: NCE_ACCEPTED_CLOTHING_AUDIO_HASHES[sourceId]
            ? 'human-listening-accepted'
            : 'unreviewed-candidate',
          ...(NCE_ACCEPTED_CLOTHING_AUDIO_HASHES[sourceId]
            ? { acceptedAudioSha256: NCE_ACCEPTED_CLOTHING_AUDIO_HASHES[sourceId] }
            : {})
        }
      )];
    })),
    'L02-E01': {
      sourceId: 'L02-E01',
      sourceKind: 'exercise-mechanism',
      text: 'Copy these sentences.',
      sourceRole: 'context',
      coveragePolicy: 'optional',
      reusedSourceRefs: Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`),
      extensionModes: ['paper-handwriting', 'tablet-handwriting'],
      requiredForUnitCompletion: false,
      producesLearningEvidence: false,
      decisionRef: 'ADR-0098'
    }
  };

  const LESSON1_CONTENT = {
    lessonId: 'lesson1',
    textbookTitle: 'Excuse me!',
    textbookSource: '外研社《新概念英语智慧版 1》物理页 35–36，书本页 2–3',
    requiredSourceIds: Object.keys(LESSON1_SOURCES).filter(sourceId => (
      ['exposure', 'evidence'].includes(LESSON1_SOURCES[sourceId].coveragePolicy)
    )),
    sources: LESSON1_SOURCES,
    audioSequences: {}
  };

  const LESSON2_CONTENT = {
    lessonId: 'lesson2',
    textbookTitle: 'Is this your ...?',
    textbookSource: '外研社《新概念英语智慧版 1》物理页 37–38，书本页 4–5',
    requiredSourceIds: Object.keys(LESSON2_SOURCES).filter(sourceId => (
      ['exposure', 'evidence'].includes(LESSON2_SOURCES[sourceId].coveragePolicy)
    )),
    sources: LESSON2_SOURCES,
    audioSequences: {}
  };

  const LESSON3_DIALOGUE_TEXT = [
    'My coat and my umbrella please.',
    'Here is my ticket.',
    'Thank you, sir.',
    'Number five.',
    "Here's your umbrella and your coat.",
    'This is not my umbrella.',
    'Sorry, sir.',
    'Is this your umbrella?',
    "No, it isn't.",
    'Is this it?',
    'Yes, it is.',
    'Thank you very much.'
  ];
  const LESSON3_DIALOGUE_FIGURE_GROUPS = [1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7, 7];
  const LESSON3_DIALOGUE_SPEAKER_ROLES = [
    'visitor', 'visitor',
    'cloakroom-attendant', 'cloakroom-attendant', 'cloakroom-attendant',
    'visitor',
    'cloakroom-attendant', 'cloakroom-attendant',
    'visitor',
    'cloakroom-attendant',
    'visitor', 'visitor'
  ];
  const NCE_U02_AUDIO_BASE_PATH = '/poc/lesson3-4-experience/audio';
  const NCE_U02_AUDIO_PACK_ID = 'nce-u02-kokoro-candidate-v1';
  const NCE_U02_CANONICAL_AUDIO_SET_SHA256 =
    'c5738057a5857bb8c44a6d7b4bbeffbaa411683942ba10ae6bf7f31984da580f';
  const NCE_U02_AUDIO_REVIEW_STATUS = 'unreviewed-candidate';
  const NCE_U02_DIALOGUE_VOICE_BY_ROLE = {
    visitor: { speaker: 'man', voiceId: 'am_michael' },
    'cloakroom-attendant': { speaker: 'woman', voiceId: 'af_heart' }
  };
  const LESSON3_DIALOGUE_POLICIES = [
    ['target', 'evidence'],
    ['target', 'evidence'],
    ['support', 'exposure'],
    ['support', 'exposure'],
    ['target', 'exposure'],
    ['target', 'evidence'],
    ['target', 'evidence'],
    ['target', 'evidence'],
    ['target', 'evidence'],
    ['target', 'evidence'],
    ['target', 'evidence'],
    ['target', 'evidence']
  ];
  const LESSON3_REFERENCE_TRANSLATIONS = [
    '请把我的大衣和伞拿给我。',
    '这是我（寄存东西）的牌子。',
    '谢谢，先生。',
    '是5号。',
    '这是您的伞和大衣。',
    '这不是我的伞。',
    '对不起，先生。',
    '这把伞是您的吗？',
    '不，不是！',
    '这把是吗？',
    '是，是这把。',
    '非常感谢。'
  ];
  const LESSON3_VOCABULARY = [
    ['umbrella', '伞'],
    ['please', '请'],
    ['here', '这里'],
    ['my', '我的'],
    ['ticket', '票'],
    ['number', '号码'],
    ['five', '五'],
    ['sorry', '对不起'],
    ['sir', '先生'],
    ['cloakroom', '衣帽存放处']
  ];
  const LESSON4_PRACTICE_NOUNS = [
    'pen', 'pencil', 'book', 'watch', 'coat',
    'dress', 'skirt', 'shirt', 'car', 'house',
    'suit', 'school', 'teacher', 'son', 'daughter'
  ];
  const LESSON4_VOCABULARY = [
    ['suit', '一套衣服'],
    ['school', '学校'],
    ['teacher', '老师'],
    ['son', '儿子'],
    ['daughter', '女儿']
  ];
  const NCE_U02_FIRST_SESSION_PROMPT_EVIDENCE_SOURCE_REFS = [
    'L04-P04', 'L04-P11', 'L04-P15'
  ];
  const NCE_U02_FIRST_SESSION_LEXICAL_EVIDENCE_SOURCE_REFS = [
    'L03-W01', 'L03-W10', 'L04-W01', 'L04-W05'
  ];

  function nceU02AudioDetails(sourceId, voiceId, audioRenderMode, details = {}) {
    return {
      audioSrc: `${NCE_U02_AUDIO_BASE_PATH}/${sourceId.toLowerCase()}.mp3`,
      voiceId,
      audioRenderMode,
      audioReviewStatus: NCE_U02_AUDIO_REVIEW_STATUS,
      ...details
    };
  }

  const LESSON3_SOURCES = {
    'L03-I01': nceSource(
      'L03-I01',
      'textbook-instruction',
      'Listen then answer this question.',
      'context',
      'exposure',
      { translation: '听录音，然后回答问题。' }
    ),
    'L03-Q01': nceSource(
      'L03-Q01',
      'textbook-question',
      'Does the man get his umbrella back?',
      'context',
      'exposure',
      { translation: '这位男士拿回他的雨伞了吗？' }
    ),
    ...Object.fromEntries(LESSON3_DIALOGUE_TEXT.map((text, index) => {
      const sourceId = `L03-D${String(index + 1).padStart(2, '0')}`;
      const [sourceRole, coveragePolicy] = LESSON3_DIALOGUE_POLICIES[index];
      const speakerRole = LESSON3_DIALOGUE_SPEAKER_ROLES[index];
      const voice = NCE_U02_DIALOGUE_VOICE_BY_ROLE[speakerRole];
      return [sourceId, nceSource(
        sourceId,
        'dialogue',
        text,
        sourceRole,
        coveragePolicy,
        {
          figureGroup: LESSON3_DIALOGUE_FIGURE_GROUPS[index],
          ...nceU02AudioDetails(sourceId, voice.voiceId, 'natural-utterance', {
            speaker: voice.speaker,
            speakerRole
          })
        }
      )];
    })),
    ...Object.fromEntries(LESSON3_VOCABULARY.map(([text, translation], index) => {
      const sourceId = `L03-W${String(index + 1).padStart(2, '0')}`;
      const producesFirstSessionEvidence = (
        NCE_U02_FIRST_SESSION_LEXICAL_EVIDENCE_SOURCE_REFS.includes(sourceId)
      );
      return [sourceId, nceSource(
        sourceId,
        'vocabulary',
        text,
        producesFirstSessionEvidence ? 'target' : (text === 'ticket' ? 'target' : 'support'),
        producesFirstSessionEvidence ? 'evidence' : 'exposure',
        {
          translation,
          vocabularyOrder: index + 1,
          ...nceU02AudioDetails(sourceId, 'af_heart', 'context-cropped-lexeme-v1')
        }
      )];
    })),
    'L03-N01': nceSource(
      'L03-N01',
      'textbook-note',
      "Here's = Here is.",
      'support',
      'exposure',
      { linkedSourceRefs: ['L03-D02', 'L03-D05'] }
    ),
    'L03-N02': nceSource(
      'L03-N02',
      'textbook-note',
      "Sorry = I'm sorry.",
      'support',
      'exposure',
      { linkedSourceRefs: ['L03-D07'] }
    ),
    'L03-N03': nceSource(
      'L03-N03',
      'textbook-note',
      'sir 是对男性的尊称。',
      'support',
      'exposure',
      { linkedSourceRefs: ['L03-D03', 'L03-D07'] }
    ),
    'L03-N04': nceSource(
      'L03-N04',
      'textbook-note',
      'Is this it? 中的 it 指代前文提到的物品。',
      'support',
      'exposure',
      { linkedSourceRefs: ['L03-D10', 'L03-D11'] }
    ),
    ...Object.fromEntries(LESSON3_REFERENCE_TRANSLATIONS.map((text, index) => {
      const sourceId = `L03-Z${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(
        sourceId,
        'reference-translation',
        text,
        'context',
        'optional',
        { linkedSourceId: `L03-D${String(index + 1).padStart(2, '0')}` }
      )];
    }))
  };

  const LESSON4_SOURCES = {
    'L04-I01': nceSource(
      'L04-I01',
      'textbook-instruction',
      'Look, listen and repeat.',
      'context',
      'exposure',
      { translation: '看图、听音并跟读。' }
    ),
    ...Object.fromEntries(LESSON4_PRACTICE_NOUNS.map((noun, index) => {
      const sourceId = `L04-P${String(index + 1).padStart(2, '0')}`;
      const vocabularySourceRef = index < 10
        ? `L02-W${String(index + 1).padStart(2, '0')}`
        : `L04-W${String(index - 9).padStart(2, '0')}`;
      const producesFirstSessionEvidence = (
        NCE_U02_FIRST_SESSION_PROMPT_EVIDENCE_SOURCE_REFS.includes(sourceId)
      );
      return [sourceId, nceSource(
        sourceId,
        'substitution-prompt',
        `Is this your ${noun}?`,
        producesFirstSessionEvidence ? 'target' : 'support',
        producesFirstSessionEvidence ? 'evidence' : 'exposure',
        {
          promptOrder: index + 1,
          vocabularySourceRef,
          ...nceU02AudioDetails(sourceId, 'am_michael', 'natural-utterance')
        }
      )];
    })),
    ...Object.fromEntries(LESSON4_VOCABULARY.map(([text, translation], index) => {
      const sourceId = `L04-W${String(index + 1).padStart(2, '0')}`;
      const producesFirstSessionEvidence = (
        NCE_U02_FIRST_SESSION_LEXICAL_EVIDENCE_SOURCE_REFS.includes(sourceId)
      );
      return [sourceId, nceSource(
        sourceId,
        'vocabulary',
        text,
        producesFirstSessionEvidence ? 'target' : 'support',
        producesFirstSessionEvidence ? 'evidence' : 'exposure',
        {
          translation,
          vocabularyOrder: index + 1,
          ...nceU02AudioDetails(sourceId, 'af_heart', 'context-cropped-lexeme-v1')
        }
      )];
    })),
    'L04-E01': nceSource(
      'L04-E01',
      'exercise-mechanism',
      'Copy these sentences.',
      'context',
      'optional',
      {
        reusedSourceRefs: ['L03-D06', 'L03-D07', 'L03-D08', 'L03-D09'],
        extensionModes: ['paper-handwriting', 'tablet-handwriting'],
        requiredForUnitCompletion: false,
        producesLearningEvidence: false,
        decisionRef: 'ADR-0098'
      }
    ),
    'L04-E02': nceSource(
      'L04-E02',
      'exercise-mechanism',
      'Answer these questions.',
      'context',
      'optional',
      {
        reusedSourceRefs: Array.from({ length: 10 }, (_, index) => (
          `L04-P${String(index + 1).padStart(2, '0')}`
        )),
        extensionModes: ['paper-handwriting', 'tablet-handwriting'],
        requiredForUnitCompletion: false,
        producesLearningEvidence: false,
        decisionRef: 'ADR-0098'
      }
    )
  };

  const LESSON3_CONTENT = {
    lessonId: 'lesson3',
    textbookTitle: 'Sorry, sir.',
    sourceRegisterRef: 'BOOK1-2022-07',
    textbookSource: '外研社《新概念英语智慧版 1》PDF 页 39–40，教材页 6–7',
    requiredSourceIds: Object.keys(LESSON3_SOURCES).filter(sourceId => (
      ['exposure', 'evidence'].includes(LESSON3_SOURCES[sourceId].coveragePolicy)
    )),
    sources: LESSON3_SOURCES
  };

  const LESSON4_CONTENT = {
    lessonId: 'lesson4',
    textbookTitle: 'Is this your ...?',
    sourceRegisterRef: 'BOOK1-2022-07',
    textbookSource: '外研社《新概念英语智慧版 1》PDF 页 41–42，教材页 8–9',
    requiredSourceIds: Object.keys(LESSON4_SOURCES).filter(sourceId => (
      ['exposure', 'evidence'].includes(LESSON4_SOURCES[sourceId].coveragePolicy)
    )),
    sources: LESSON4_SOURCES
  };

  const NCE_U03_AUDIO_BASE_PATH = '/poc/lesson5-6-experience/audio';
  const NCE_U04_AUDIO_BASE_PATH = '/poc/lesson7-8-experience/audio';
  const NCE_U03_AUDIO_PACK_ID = 'nce-u03-kokoro-candidate-v1';
  const NCE_U04_AUDIO_PACK_ID = 'nce-u04-kokoro-candidate-v1';
  const NCE_U03_CANONICAL_AUDIO_SET_SHA256 =
    'bbd582afcfd7ce6646bc923a790071ff0c48e88d1608e4d70b5723027ada6ad2';
  const NCE_U04_CANONICAL_AUDIO_SET_SHA256 =
    '72bbe2fbdb64fcc477d96d1785c142400db4c9be9ef469f0dc53aed5077c44ea';
  const NCE_EARLY_BOOK_AUDIO_REVIEW_STATUS = 'unreviewed-candidate';

  function nceEarlyBookAudioDetails(basePath, sourceId, voiceId, audioRenderMode, details = {}) {
    return {
      audioSrc: `${basePath}/${sourceId.toLowerCase()}.mp3`,
      voiceId,
      audioRenderMode,
      audioReviewStatus: NCE_EARLY_BOOK_AUDIO_REVIEW_STATUS,
      ...details
    };
  }

  const LESSON5_DIALOGUE = [
    ['Good morning.', 'teacher', 'man'],
    ['Good morning, Mr. Blake.', 'student-group', 'woman'],
    ['This is Miss Sophie Dupont.', 'teacher', 'man'],
    ['Sophie is a new student.', 'teacher', 'man'],
    ['She is French.', 'teacher', 'man'],
    ['Sophie, this is Hans.', 'teacher', 'man'],
    ['He is German.', 'teacher', 'man'],
    ['Nice to meet you.', 'student-group', 'man'],
    ['And this is Naoko.', 'teacher', 'man'],
    ["She's Japanese.", 'teacher', 'man'],
    ['Nice to meet you.', 'student-group', 'woman'],
    ['And this is Chang-woo.', 'teacher', 'man'],
    ["He's South Korean.", 'teacher', 'man'],
    ['Nice to meet you.', 'student-group', 'man'],
    ['And this is Luming.', 'teacher', 'man'],
    ["He's Chinese.", 'teacher', 'man'],
    ['Nice to meet you.', 'student-group', 'man'],
    ['And this is Xiaohui.', 'teacher', 'man'],
    ["She's Chinese, too.", 'teacher', 'man'],
    ['Nice to meet you.', 'student-group', 'woman']
  ];
  const LESSON5_VOCABULARY = [
    ['Mr.', '先生'], ['good', '好的'], ['morning', '早晨'], ['Miss', '小姐'],
    ['new', '新的'], ['student', '学生'], ['French', '法国（人）的'],
    ['German', '德国（人）的'], ['nice', '美好的'], ['meet', '遇见'],
    ['Japanese', '日本（人）的'], ['South Korean', '韩国（人）的'],
    ['Chinese', '中国（人）的'], ['too', '也']
  ];
  const LESSON5_TRANSLATIONS = [
    '早上好。', '早上好，布莱克先生。', '这位是索菲娅·杜邦小姐。',
    '索菲娅是一名新生。', '她是法国人。', '索菲娅，这位是汉斯。',
    '他是德国人。', '很高兴见到你。', '这位是直子。', '她是日本人。',
    '很高兴见到你。', '这位是昌宇。', '他是韩国人。', '很高兴见到你。',
    '这位是鲁明。', '他是中国人。', '很高兴见到你。', '这位是晓惠。',
    '她也是中国人。', '很高兴见到你。'
  ];
  const LESSON6_PROMPTS = [
    ['Volvo', 'Swedish'], ['Peugeot', 'French'], ['Mercedes', 'German'],
    ['Toyota', 'Japanese'], ['Mini', 'English'], ['Ford', 'American']
  ];
  const LESSON6_VOCABULARY = [
    ['make', '（产品的）牌子'], ['Swedish', '瑞典的'], ['English', '英国的'],
    ['American', '美国的'], ['Volvo', '沃尔沃'], ['Peugeot', '标致'],
    ['Mercedes', '梅赛德斯'], ['Toyota', '丰田'], ['Ford', '福特'], ['Mini', '迷你']
  ];

  const LESSON5_SOURCES = {
    'L05-I01': nceSource('L05-I01', 'textbook-instruction', 'Listen then answer this question.', 'context', 'exposure', { translation: '听录音，然后回答问题。' }),
    'L05-Q01': nceSource('L05-Q01', 'textbook-question', 'Is Chang-woo Chinese?', 'context', 'exposure', { translation: '昌宇是中国人吗？' }),
    ...Object.fromEntries(LESSON5_DIALOGUE.map(([text, speakerRole, speaker], index) => {
      const sourceId = `L05-D${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(sourceId, 'dialogue', text, 'target', 'evidence', {
        figureGroup: Math.min(7, Math.floor(index / 3) + 1),
        ...nceEarlyBookAudioDetails(
          NCE_U03_AUDIO_BASE_PATH,
          sourceId,
          speaker === 'man' ? 'am_michael' : 'af_heart',
          'natural-utterance',
          { speaker, speakerRole }
        )
      })];
    })),
    ...Object.fromEntries(LESSON5_VOCABULARY.map(([text, translation], index) => {
      const sourceId = `L05-W${String(index + 1).padStart(2, '0')}`;
      const evidence = ['student', 'French', 'German', 'Japanese', 'South Korean', 'Chinese'].includes(text);
      return [sourceId, nceSource(sourceId, 'vocabulary', text, evidence ? 'target' : 'support', evidence ? 'evidence' : 'exposure', {
        translation,
        vocabularyOrder: index + 1,
        ...nceEarlyBookAudioDetails(NCE_U03_AUDIO_BASE_PATH, sourceId, 'af_heart', 'context-cropped-lexeme-v1')
      })];
    })),
    'L05-N01': nceSource('L05-N01', 'textbook-note', 'Good morning. 是英语中常见的问候用语。', 'support', 'exposure', { linkedSourceRefs: ['L05-D01', 'L05-D02'] }),
    'L05-N02': nceSource('L05-N02', 'textbook-note', 'This is ... 用来把某人介绍给他人。', 'support', 'exposure', { linkedSourceRefs: ['L05-D03', 'L05-D06'] }),
    'L05-N03': nceSource('L05-N03', 'textbook-note', 'Nice to meet you. 用于初次见面等非正式场合。', 'support', 'exposure', { linkedSourceRefs: ['L05-D08', 'L05-D11', 'L05-D14', 'L05-D17', 'L05-D20'] }),
    ...Object.fromEntries(LESSON5_TRANSLATIONS.map((text, index) => {
      const sourceId = `L05-Z${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(sourceId, 'reference-translation', text, 'context', 'optional', { linkedSourceId: `L05-D${String(index + 1).padStart(2, '0')}` })];
    }))
  };

  const LESSON6_SOURCES = {
    'L06-I01': nceSource('L06-I01', 'textbook-instruction', 'Look, listen and repeat.', 'context', 'exposure', { translation: '看图听录音，然后练习。' }),
    ...Object.fromEntries(LESSON6_PROMPTS.map(([make, nationality], index) => {
      const sourceId = `L06-P${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(sourceId, 'substitution-prompt', `It's a ${make}. (${nationality})`, 'target', 'evidence', {
        make,
        nationality,
        illustrationOrder: index + 1,
        ...nceEarlyBookAudioDetails(NCE_U03_AUDIO_BASE_PATH, sourceId, 'am_michael', 'natural-utterance')
      })];
    })),
    ...Object.fromEntries(LESSON6_VOCABULARY.map(([text, translation], index) => {
      const sourceId = `L06-W${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(sourceId, 'vocabulary', text, index < 4 ? 'target' : 'support', index < 4 ? 'evidence' : 'exposure', {
        translation,
        vocabularyOrder: index + 1,
        ...nceEarlyBookAudioDetails(NCE_U03_AUDIO_BASE_PATH, sourceId, 'af_heart', 'context-cropped-lexeme-v1')
      })];
    })),
    'L06-E01': nceSource('L06-E01', 'exercise-mechanism', 'Complete these sentences using He, She or It.', 'context', 'optional', { requiredForUnitCompletion: false, producesLearningEvidence: false, decisionRef: 'ADR-0098' }),
    'L06-E02': nceSource('L06-E02', 'exercise-mechanism', 'Write questions and answers using He, She, It, a or an.', 'context', 'optional', { requiredForUnitCompletion: false, producesLearningEvidence: false, decisionRef: 'ADR-0098' })
  };

  const LESSON7_DIALOGUE = [
    ['I am a new student.', 'robert', 'man'], ["My name's Robert.", 'robert', 'man'],
    ['Nice to meet you.', 'sophie', 'woman'], ["My name's Sophie.", 'sophie', 'woman'],
    ['Are you French?', 'robert', 'man'], ['Yes, I am.', 'sophie', 'woman'],
    ['Are you French, too?', 'sophie', 'woman'], ['No, I am not.', 'robert', 'man'],
    ['What nationality are you?', 'sophie', 'woman'], ["I'm Italian.", 'robert', 'man'],
    ['Are you a teacher?', 'robert', 'man'], ["No, I'm not.", 'sophie', 'woman'],
    ["What's your job?", 'robert', 'man'], ["I'm a keyboard operator.", 'sophie', 'woman'],
    ["What's your job?", 'sophie', 'woman'], ["I'm an engineer.", 'robert', 'man']
  ];
  const LESSON7_VOCABULARY = [
    ['I', '我'], ['am', 'be 动词现在时第一人称单数'], ['are', 'be 动词现在时复数'],
    ['name', '名字'], ['what', '什么'], ['nationality', '国籍'],
    ['Italian', '意大利（人）的'], ['job', '工作'], ['keyboard', '电脑键盘'],
    ['operator', '操作人员'], ['engineer', '工程师']
  ];
  const LESSON7_TRANSLATIONS = [
    '我是一名新生。', '我的名字叫罗伯特。', '很高兴见到你。', '我的名字叫索菲娅。',
    '你是法国人吗？', '是的，我是。', '你也是法国人吗？', '不，我不是。',
    '你是哪国人？', '我是意大利人。', '你是教师吗？', '不，我不是。',
    '你是做什么工作的？', '我是电脑录入员。', '你是做什么工作的？', '我是工程师。'
  ];
  const LESSON8_JOBS = [
    ['policeman', '警察'], ['policewoman', '女警察'], ['taxi driver', '出租汽车司机'],
    ['air hostess', '空中小姐'], ['postman', '邮递员'], ['nurse', '护士'],
    ['mechanic', '机械师'], ['hairdresser', '理发师'], ['housewife', '家庭妇女'],
    ['milkman', '送牛奶的人']
  ];

  const LESSON7_SOURCES = {
    'L07-I01': nceSource('L07-I01', 'textbook-instruction', 'Listen then answer this question.', 'context', 'exposure', { translation: '听录音，然后回答问题。' }),
    'L07-Q01': nceSource('L07-Q01', 'textbook-question', "What is Robert's job?", 'context', 'exposure', { translation: '罗伯特是做什么工作的？' }),
    ...Object.fromEntries(LESSON7_DIALOGUE.map(([text, speakerRole, speaker], index) => {
      const sourceId = `L07-D${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(sourceId, 'dialogue', text, 'target', 'evidence', {
        figureGroup: Math.min(7, Math.floor(index / 2) + 1),
        ...nceEarlyBookAudioDetails(
          NCE_U04_AUDIO_BASE_PATH,
          sourceId,
          speaker === 'man' ? 'am_michael' : 'af_heart',
          'natural-utterance',
          { speaker, speakerRole }
        )
      })];
    })),
    ...Object.fromEntries(LESSON7_VOCABULARY.map(([text, translation], index) => {
      const sourceId = `L07-W${String(index + 1).padStart(2, '0')}`;
      const evidence = ['nationality', 'Italian', 'job', 'operator', 'engineer'].includes(text);
      return [sourceId, nceSource(sourceId, 'vocabulary', text, evidence ? 'target' : 'support', evidence ? 'evidence' : 'exposure', {
        translation,
        vocabularyOrder: index + 1,
        ...nceEarlyBookAudioDetails(NCE_U04_AUDIO_BASE_PATH, sourceId, 'af_heart', 'context-cropped-lexeme-v1')
      })];
    })),
    'L07-N01': nceSource('L07-N01', 'textbook-note', "My name's = My name is.", 'support', 'exposure', { linkedSourceRefs: ['L07-D02', 'L07-D04'] }),
    'L07-N02': nceSource('L07-N02', 'textbook-note', "I'm = I am.", 'support', 'exposure', { linkedSourceRefs: ['L07-D10', 'L07-D14', 'L07-D16'] }),
    'L07-N03': nceSource('L07-N03', 'textbook-note', "What's your job? 中 What's = What is.", 'support', 'exposure', { linkedSourceRefs: ['L07-D13', 'L07-D15'] }),
    'L07-N04': nceSource('L07-N04', 'textbook-note', 'What nationality are you? 用来询问对方国籍。', 'support', 'exposure', { linkedSourceRefs: ['L07-D09'] }),
    ...Object.fromEntries(LESSON7_TRANSLATIONS.map((text, index) => {
      const sourceId = `L07-Z${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(sourceId, 'reference-translation', text, 'context', 'optional', { linkedSourceId: `L07-D${String(index + 1).padStart(2, '0')}` })];
    }))
  };

  const LESSON8_SOURCES = {
    'L08-I01': nceSource('L08-I01', 'textbook-instruction', 'Look, listen and repeat.', 'context', 'exposure', { translation: '看图听录音，然后练习。' }),
    ...Object.fromEntries(LESSON8_JOBS.map(([job], index) => {
      const sourceId = `L08-P${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(sourceId, 'substitution-prompt', `I'm ${['engineer', 'air hostess'].includes(job) ? 'an' : 'a'} ${job}.`, 'target', 'evidence', {
        job,
        illustrationOrder: index + 1,
        ...nceEarlyBookAudioDetails(
          NCE_U04_AUDIO_BASE_PATH,
          sourceId,
          index % 2 === 0 ? 'am_michael' : 'af_heart',
          'natural-utterance',
          { speaker: index % 2 === 0 ? 'man' : 'woman' }
        )
      })];
    })),
    ...Object.fromEntries(LESSON8_JOBS.map(([text, translation], index) => {
      const sourceId = `L08-W${String(index + 1).padStart(2, '0')}`;
      return [sourceId, nceSource(sourceId, 'vocabulary', text, index < 5 ? 'target' : 'support', index < 5 ? 'evidence' : 'exposure', {
        translation,
        vocabularyOrder: index + 1,
        ...nceEarlyBookAudioDetails(NCE_U04_AUDIO_BASE_PATH, sourceId, 'af_heart', 'context-cropped-lexeme-v1')
      })];
    })),
    'L08-E01': nceSource('L08-E01', 'exercise-mechanism', 'Complete these sentences using am or is.', 'context', 'optional', { requiredForUnitCompletion: false, producesLearningEvidence: false, decisionRef: 'ADR-0098' }),
    'L08-E02': nceSource('L08-E02', 'exercise-mechanism', 'Write questions and answers using his, her, he, she, a or an.', 'context', 'optional', { requiredForUnitCompletion: false, producesLearningEvidence: false, decisionRef: 'ADR-0098' })
  };

  const LESSON5_CONTENT = {
    lessonId: 'lesson5', textbookTitle: 'Nice to meet you.', sourceRegisterRef: 'BOOK1-2022-07',
    textbookSource: '外研社《新概念英语智慧版 1》PDF 页 43–44，教材页 10–11',
    requiredSourceIds: Object.keys(LESSON5_SOURCES).filter(sourceId => ['exposure', 'evidence'].includes(LESSON5_SOURCES[sourceId].coveragePolicy)),
    sources: LESSON5_SOURCES
  };
  const LESSON6_CONTENT = {
    lessonId: 'lesson6', textbookTitle: 'What make is it?', sourceRegisterRef: 'BOOK1-2022-07',
    textbookSource: '外研社《新概念英语智慧版 1》PDF 页 45–46，教材页 12–13',
    requiredSourceIds: Object.keys(LESSON6_SOURCES).filter(sourceId => ['exposure', 'evidence'].includes(LESSON6_SOURCES[sourceId].coveragePolicy)),
    sources: LESSON6_SOURCES
  };
  const LESSON7_CONTENT = {
    lessonId: 'lesson7', textbookTitle: 'Are you a teacher?', sourceRegisterRef: 'BOOK1-2022-07',
    textbookSource: '外研社《新概念英语智慧版 1》PDF 页 47–48，教材页 14–15',
    requiredSourceIds: Object.keys(LESSON7_SOURCES).filter(sourceId => ['exposure', 'evidence'].includes(LESSON7_SOURCES[sourceId].coveragePolicy)),
    sources: LESSON7_SOURCES
  };
  const LESSON8_CONTENT = {
    lessonId: 'lesson8', textbookTitle: "What's your job?", sourceRegisterRef: 'BOOK1-2022-07',
    textbookSource: '外研社《新概念英语智慧版 1》PDF 页 49–50，教材页 16–17',
    requiredSourceIds: Object.keys(LESSON8_SOURCES).filter(sourceId => ['exposure', 'evidence'].includes(LESSON8_SOURCES[sourceId].coveragePolicy)),
    sources: LESSON8_SOURCES
  };

  const NCE_AUTHORED_CONTENT = {
    'NCE-U01-C-Q-WATCH': {
      contentId: 'NCE-U01-C-Q-WATCH',
      kind: 'derived-expression',
      text: 'Is this your watch?',
      sourceRefs: ['L01-D03', 'L02-W04'],
      audioSrc: '/poc/lesson1-2-experience/audio/nce-u01-c-q-watch.mp3'
    },
    'NCE-U01-C-Q-COAT': {
      contentId: 'NCE-U01-C-Q-COAT',
      kind: 'derived-expression',
      text: 'Is this your coat?',
      sourceRefs: ['L01-D03', 'L02-W05'],
      audioSrc: '/poc/lesson1-2-experience/audio/nce-u01-c-q-coat.mp3'
    },
    'NCE-U01-C-Q-CAR': {
      contentId: 'NCE-U01-C-Q-CAR',
      kind: 'derived-expression',
      text: 'Is this your car?',
      sourceRefs: ['L01-D03', 'L02-W09'],
      audioSrc: '/poc/lesson1-2-experience/audio/nce-u01-c-q-car.mp3'
    },
    'NCE-U01-C-Q-HOUSE': {
      contentId: 'NCE-U01-C-Q-HOUSE',
      kind: 'derived-expression',
      text: 'Is this your house?',
      sourceRefs: ['L01-D03', 'L02-W10'],
      audioSrc: '/poc/lesson1-2-experience/audio/nce-u01-c-q-house.mp3'
    },
    'NCE-U01-C-BLOCK-IS-THIS-YOUR': {
      contentId: 'NCE-U01-C-BLOCK-IS-THIS-YOUR',
      kind: 'language-block',
      text: 'Is this your',
      sourceRefs: ['L01-D03']
    },
    'NCE-U01-C-S-HANDBAG': {
      contentId: 'NCE-U01-C-S-HANDBAG',
      kind: 'derived-expression',
      text: 'This is your handbag.',
      sourceRefs: ['L01-D03']
    },
    'NCE-U01-C-A-WRONG-THIS': {
      contentId: 'NCE-U01-C-A-WRONG-THIS',
      kind: 'diagnostic-expression',
      text: 'Yes, this is.',
      sourceRefs: ['L01-D06']
    },
    'NCE-U01-C-BLOCK-THIS': {
      contentId: 'NCE-U01-C-BLOCK-THIS',
      kind: 'language-block',
      text: 'this',
      sourceRefs: ['L01-D03']
    },
    'NCE-U01-C-BLOCK-IS': {
      contentId: 'NCE-U01-C-BLOCK-IS',
      kind: 'language-block',
      text: 'is',
      sourceRefs: ['L01-D03']
    },
    'NCE-U01-C-BLOCK-IS-CAPITAL': {
      contentId: 'NCE-U01-C-BLOCK-IS-CAPITAL',
      kind: 'language-block',
      text: 'Is',
      sourceRefs: ['L01-D03']
    },
    'NCE-U01-C-BLOCK-YOUR': {
      contentId: 'NCE-U01-C-BLOCK-YOUR',
      kind: 'language-block',
      text: 'your',
      sourceRefs: ['L01-D03', 'L01-W06']
    },
    'NCE-U01-C-BLOCK-HANDBAG': {
      contentId: 'NCE-U01-C-BLOCK-HANDBAG',
      kind: 'language-block',
      text: 'handbag',
      sourceRefs: ['L01-D03', 'L01-W07']
    },
    'NCE-U01-C-PUNCT-PERIOD': {
      contentId: 'NCE-U01-C-PUNCT-PERIOD',
      kind: 'punctuation-block',
      text: '.',
      sourceRefs: ['L01-D03']
    },
    'NCE-U01-C-PUNCT-QUESTION': {
      contentId: 'NCE-U01-C-PUNCT-QUESTION',
      kind: 'punctuation-block',
      text: '?',
      sourceRefs: ['L01-D03']
    }
  };

  const NCE_MAN_CHARACTER = {
    entityKind: 'character',
    voiceRole: 'man',
    dialogueSide: 'left',
    assetSrc: '/poc/lesson1-2-experience/assets/character-adult-man-cutout-v1.avif',
    assetFallbackSrc: '/poc/lesson1-2-experience/assets/character-adult-man-cutout-v1.webp'
  };
  const NCE_WOMAN_CHARACTER = {
    entityKind: 'character',
    voiceRole: 'woman',
    dialogueSide: 'right',
    assetSrc: '/poc/lesson1-2-experience/assets/character-adult-woman-cutout-v1.avif',
    assetFallbackSrc: '/poc/lesson1-2-experience/assets/character-adult-woman-cutout-v1.webp'
  };
  const NCE_EXPLORER_CAT_CHARACTER = {
    entityKind: 'character',
    characterIdentityId: 'explorer-cat',
    assetSrc: '/assets/adventure-map/mascot/loader/frame-1-route-page-20260806-01-256.webp'
  };
  const LOST_HANDBAG_CAST = ['station-keeper', 'handbag-owner'];

  function nceIllustratedItem(entityId, title, visualType, sourceRef, assetBasename) {
    return {
      entityId,
      title,
      visualType,
      sourceRef,
      assetSrc: `/poc/lesson1-2-experience/assets/${assetBasename}.avif`,
      assetFallbackSrc: `/poc/lesson1-2-experience/assets/${assetBasename}.webp`
    };
  }

  const NCE_ENTITIES = {
    'station-keeper': {
      entityId: 'station-keeper', title: '招领员', visualType: 'keeper',
      activeInExperienceRevision: true, ...NCE_MAN_CHARACTER
    },
    'handbag-owner': {
      entityId: 'handbag-owner', title: '女顾客', visualType: 'visitor',
      activeInExperienceRevision: true, ...NCE_WOMAN_CHARACTER
    },
    'first-claimant': {
      entityId: 'first-claimant', title: '第一位认领者', visualType: 'visitor-one',
      activeInExperienceRevision: false, ...NCE_WOMAN_CHARACTER
    },
    'second-returner': {
      entityId: 'second-returner', title: '第二位归还者', visualType: 'visitor-two',
      activeInExperienceRevision: false, ...NCE_MAN_CHARACTER
    },
    'coat-owner': {
      entityId: 'coat-owner', title: '外套主人', visualType: 'coat-owner',
      activeInExperienceRevision: false, ...NCE_WOMAN_CHARACTER
    },
    'third-claimant': {
      entityId: 'third-claimant', title: '第三位认领者', visualType: 'visitor-three',
      activeInExperienceRevision: false, ...NCE_WOMAN_CHARACTER
    },
    child: {
      entityId: 'child', title: '探险小猫', visualType: 'cat-child',
      migrationAliasFor: 'explorer-cat', activeInExperienceRevision: false,
      ...NCE_EXPLORER_CAT_CHARACTER
    },
    'cat-guide': {
      entityId: 'cat-guide', title: '探险小猫', visualType: 'cat-guide',
      migrationAliasFor: 'explorer-cat', activeInExperienceRevision: false,
      ...NCE_EXPLORER_CAT_CHARACTER
    },
    'explorer-cat': {
      entityId: 'explorer-cat', title: '探险小猫', visualType: 'explorer-cat',
      activeInExperienceRevision: true, ...NCE_EXPLORER_CAT_CHARACTER
    },
    handbag: nceIllustratedItem('handbag', '手提包', 'handbag', 'L01-W07', 'handbag-prop-v1'),
    pen: nceIllustratedItem('pen', '钢笔', 'pen', 'L02-W01', 'item-pen-v1'),
    pencil: nceIllustratedItem('pencil', '铅笔', 'pencil', 'L02-W02', 'item-pencil-v1'),
    book: nceIllustratedItem('book', '书', 'book', 'L02-W03', 'item-book-v1'),
    watch: nceIllustratedItem('watch', '手表', 'watch', 'L02-W04', 'item-watch-v1'),
    coat: nceIllustratedItem('coat', '外套', 'coat', 'L02-W05', 'item-coat-v1'),
    dress: nceIllustratedItem('dress', '连衣裙', 'dress', 'L02-W06', 'item-dress-v1'),
    skirt: nceIllustratedItem('skirt', '短裙', 'skirt', 'L02-W07', 'item-skirt-v1'),
    shirt: nceIllustratedItem('shirt', '衬衫', 'shirt', 'L02-W08', 'item-shirt-v1'),
    car: nceIllustratedItem('car', '小汽车', 'neighborhood-scene-car', 'L02-W09', 'scene-car-v2'),
    house: nceIllustratedItem('house', '房子', 'neighborhood-scene-house', 'L02-W10', 'scene-house-v2'),
    'case-stamp': {
      entityId: 'case-stamp', title: '结案章', visualType: 'stamp', symbol: '🔖', activeInExperienceRevision: false
    },
    'case-file': {
      entityId: 'case-file', title: '案件档案', visualType: 'case-file', symbol: '🗂️', activeInExperienceRevision: false
    },
    'station-power': {
      entityId: 'station-power', title: '星灯总闸', visualType: 'station-power', symbol: '🌠', activeInExperienceRevision: false
    },
    'opening-lever': {
      entityId: 'opening-lever', title: '开张拉杆', visualType: 'lever', symbol: '⚙️', activeInExperienceRevision: false
    }
  };

  function nceTargetResult({ resultId, targetNumber, stepId, sourceRef, channel, evidenceMode, variantId }) {
    return {
      resultId,
      targetId: `NCE-U01-T${String(targetNumber).padStart(2, '0')}`,
      stepId,
      sourceRef,
      channel,
      evidenceMode,
      variantId: variantId || sourceRef || stepId,
      resultKind: 'formative'
    };
  }

  function t1Result(microtaskId, stepId, sourceRef, channel) {
    return nceTargetResult({
      resultId: `NCE-U01-T01:${sourceRef}:${channel}`,
      targetNumber: 1,
      stepId,
      sourceRef,
      channel,
      evidenceMode: channel === 'audio-form-supported'
        ? 'audio-form-object-match'
        : 'word-form-object-match'
    });
  }

  function nceMicrotask({
    microtaskId,
    lessonId,
    title,
    stepLabel,
    sceneMode,
    prompt,
    completedFeedback,
    nextCue,
    exposureRefs,
    evidenceRefs,
    targetResults = [],
    steps,
    growthBoundary = 'none',
    requiredFactIds = [],
    checkpointFacts = [],
    characterEntityIds = [],
    sceneEntityIds = [],
    estimatedSeconds = 60,
    taskGroup
  }) {
    const normalizedSteps = steps.map(step => {
      const submissionMode = step.submissionMode
        || (step.answerRule ? 'formal' : 'free');
      return {
        submissionMode,
        affectsAdventureHearts: submissionMode === 'formal',
        ...step
      };
    });
    return {
      microtaskId,
      lessonId,
      kind: 'authored-story-task',
      required: true,
      exposureRefs,
      evidenceRefs,
      targetResults,
      steps: normalizedSteps,
      estimatedSeconds,
      presentation: {
        title,
        stepLabel,
        sceneMode,
        prompt,
        completedFeedback,
        nextCue,
        ...(taskGroup ? { taskGroup } : {}),
        ...(characterEntityIds.length ? { characterEntityIds } : {}),
        ...(sceneEntityIds.length ? { sceneEntityIds } : {})
      },
      persistence: {
        atomic: true,
        resumePolicy: 'restart-microtask',
        requiredFactIds,
        checkpointFacts
      },
      checkpointAfterSuccess: {
        checkpointId: `${microtaskId}:complete`,
        ...(growthBoundary === 'unit-built' ? { buildStage: 5 } : {})
      },
      growthBoundary
    };
  }

  const AUDIO_ENDED_GATE = 'active-request-ended';
  const AUDIO_SUPPORT = [
    '再听一次，先不着急选。',
    '看看每件物品的样子，再仔细想一想。',
    '小猫陪你再看一遍，最后由你自己选。'
  ];
  const ACTION_SUPPORT = [
    '看看物品和人物，想想应该交给谁。',
    '跟着刚才的对话，再找一次正确的人。',
    '小猫陪你再看一遍，然后由你自己完成。'
  ];
  const OWNER_SUPPORT = [
    '回想一下，最后是谁说“对，是我的”。',
    '看看两个人，谁确认了这是自己的手提包？',
    '小猫陪你再看一遍对话，最后由你自己找到主人。'
  ];
  const EXPRESSION_SUPPORT = [
    '看看现在发生了什么，再想想该说哪句。',
    '想一想：现在是叫住别人、请人再说，还是表示感谢？',
    '小猫陪你换个情境想一想，然后由你自己选。'
  ];
  const WORD_FORM_SUPPORT = [
    '再看一遍这个英文单词的样子。',
    '慢慢看开头、中间和结尾，再选一次。',
    '小猫陪你再看一次，然后由你自己选。'
  ];
  const SENTENCE_SUPPORT = [
    '先想想这句话要问什么。',
    '先放问句开头，再放物品的单词。',
    '小猫陪你再排一次，然后由你自己完成。'
  ];

  const LESSON1_MICROTASKS = [
    nceMicrotask({
      microtaskId: 'L01-M01',
      lessonId: 'lesson1',
      title: '门铃响了',
      stepLabel: '第一案 · 1 / 5',
      sceneMode: 'handbag-arrival',
      characterEntityIds: [...LOST_HANDBAG_CAST],
      sceneEntityIds: ['handbag'],
      prompt: '听听这只手提包是谁的',
      completedFeedback: '你找到了手提包的主人，也把声音和物品连起来了。',
      nextCue: { entityId: 'case-stamp', label: '回看线索' },
      exposureRefs: [
        'L01-I01', 'L01-Q01',
        ...Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`),
        ...Array.from({ length: 11 }, (_, index) => `L01-W${String(index + 1).padStart(2, '0')}`)
      ],
      evidenceRefs: ['L01-D03', 'L01-D05', 'L01-D06', 'L01-W07'],
      targetResults: [
        nceTargetResult({
          resultId: 'NCE-U01-T04:L01-M01:owner',
          targetNumber: 4,
          stepId: 'L01-M01:S02',
          sourceRef: 'L01-D06',
          channel: 'meaning',
          evidenceMode: 'owner-identification',
          variantId: 'handbag-owner'
        }),
        t1Result('L01-M01', 'L01-M01:S03', 'L01-W07', 'audio-form-supported')
      ],
      steps: [
        {
          stepId: 'L01-M01:S01',
          kind: 'audio-sequence',
          prompt: '客人进门了，听听他们说什么',
          audioSourceRefs: Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`),
          gate: AUDIO_ENDED_GATE,
          textVisibility: 'visible-during-listen'
        },
        {
          stepId: 'L01-M01:S02',
          kind: 'select-entity',
          prompt: '这是谁的手提包？找到它的主人',
          optionEntityIds: ['station-keeper', 'handbag-owner'],
          answerRule: { type: 'select-one', acceptedEntityIds: ['handbag-owner'] },
          support: [...OWNER_SUPPORT]
        },
        {
          stepId: 'L01-M01:S03',
          kind: 'match-entity',
          prompt: '听声音，找物品',
          challengeSourceRefs: ['L01-W07'],
          optionEntityIds: ['handbag', 'book', 'pen'],
          answerRule: { type: 'match-entity', pairs: { 'L01-W07': 'handbag' } },
          gate: AUDIO_ENDED_GATE,
          support: [...AUDIO_SUPPORT]
        }
      ],
      requiredFactIds: ['owner-chosen', 'handbag-audio-matched'],
      checkpointFacts: ['handbag-owner-identified', 'case-clue-owner']
    }),
    nceMicrotask({
      microtaskId: 'L01-M02',
      lessonId: 'lesson1',
      title: '礼貌问一问',
      stepLabel: '第一案 · 2 / 5',
      sceneMode: 'attention-replay',
      characterEntityIds: [...LOST_HANDBAG_CAST],
      sceneEntityIds: ['handbag'],
      prompt: '先叫住她，再询问',
      completedFeedback: '你礼貌地叫住了她，也问清了手提包。',
      nextCue: { entityId: 'case-stamp', label: '回声线索' },
      exposureRefs: ['L01-D01', 'L01-D02', 'L01-D03', 'L01-N01'],
      evidenceRefs: ['L01-D01', 'L01-D03'],
      targetResults: [
        nceTargetResult({
          resultId: 'NCE-U01-T02:L01-M02:attention', targetNumber: 2,
          stepId: 'L01-M02:S01', sourceRef: 'L01-D01', channel: 'meaning',
          evidenceMode: 'polite-attention-choice', variantId: 'station-keeper'
        }),
        nceTargetResult({
          resultId: 'NCE-U01-T04:L01-M02:question', targetNumber: 4,
          stepId: 'L01-M02:S03', sourceRef: 'L01-D03', channel: 'meaning',
          evidenceMode: 'ownership-exchange', variantId: 'handbag-question'
        })
      ],
      steps: [
        {
          stepId: 'L01-M02:S01', kind: 'select-one', prompt: '礼貌叫住她，应该怎么说？',
          optionSourceRefs: ['L01-D01', 'L01-D04', 'L01-D07'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D01' },
          feedbackAudioSourceRef: 'L01-D01', gate: AUDIO_ENDED_GATE,
          support: [...EXPRESSION_SUPPORT]
        },
        {
          stepId: 'L01-M02:S02', kind: 'audio-sequence', prompt: '听她回应',
          audioSourceRefs: ['L01-D02'], gate: AUDIO_ENDED_GATE
        },
        {
          stepId: 'L01-M02:S03', kind: 'select-one', prompt: '想问手提包是不是她的，应该怎么说？',
          optionSourceRefs: ['L01-D03', 'L01-D01', 'L01-D07'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D03' },
          support: [...EXPRESSION_SUPPORT]
        },
        {
          stepId: 'L01-M02:S04', kind: 'audio-sequence', prompt: '听听他怎么问',
          audioSourceRefs: ['L01-D03'], gate: AUDIO_ENDED_GATE
        }
      ],
      requiredFactIds: ['attention-expression', 'yes-response-heard', 'ownership-question', 'question-audio-ended'],
      checkpointFacts: ['case-clue-attention', 'note-excuse-me-enacted']
    }),
    nceMicrotask({
      microtaskId: 'L01-M03',
      lessonId: 'lesson1',
      title: '没懂就请再说',
      stepLabel: '第一案 · 3 / 5',
      sceneMode: 'repair-and-return',
      characterEntityIds: [...LOST_HANDBAG_CAST],
      sceneEntityIds: ['handbag'],
      prompt: '替她请求再说一遍',
      completedFeedback: '你帮她修好了对话，手提包终于回到主人手里。',
      nextCue: { entityId: 'case-stamp', label: '感谢线索' },
      exposureRefs: ['L01-D04', 'L01-D05', 'L01-D06', 'L01-N02'],
      evidenceRefs: ['L01-D04', 'L01-D05', 'L01-D06'],
      targetResults: [
        nceTargetResult({
          resultId: 'NCE-U01-T03:L01-M03:repair', targetNumber: 3,
          stepId: 'L01-M03:S01', sourceRef: 'L01-D04', channel: 'meaning',
          evidenceMode: 'communication-repair-choice', variantId: 'handbag-owner'
        })
      ],
      steps: [
        {
          stepId: 'L01-M03:S01', kind: 'select-one', prompt: '她没听清，应该怎么说？',
          optionSourceRefs: ['L01-D04', 'L01-D01', 'L01-D07'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D04' },
          support: [...EXPRESSION_SUPPORT]
        },
        {
          stepId: 'L01-M03:S02', kind: 'audio-sequence', prompt: '听听他们怎么继续说',
          audioSourceRefs: ['L01-D04', 'L01-D05', 'L01-D06'], gate: AUDIO_ENDED_GATE
        },
        {
          stepId: 'L01-M03:S03', kind: 'perform-action', prompt: '把手提包交给她',
          submissionMode: 'story', affectsAdventureHearts: false,
          entityIds: ['handbag'], targetEntityIds: ['handbag-owner'],
          answerRule: { type: 'perform-action', action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner' }
        }
      ],
      requiredFactIds: ['repair-expression', 'repair-dialogue-ended', 'handbag-return-action'],
      checkpointFacts: ['case-clue-repair', 'handbag-with-owner', 'note-pardon-enacted']
    })
  ];

  const LESSON2_MICROTASKS = [
    nceMicrotask({
      microtaskId: 'L02-M01',
      lessonId: 'lesson2',
      title: '随身物品上架',
      stepLabel: '整理室 · 1 / 7',
      sceneMode: 'pocket-shelf',
      prompt: '打开布袋，听音上架',
      completedFeedback: '四件随身物品都认识了，手表也听音找对了。',
      nextCue: { entityId: 'case-stamp', label: '打开旧标签柜' },
      exposureRefs: ['L02-I01', 'L02-W01', 'L02-W02', 'L02-W03', 'L02-W04'],
      evidenceRefs: ['L02-W04'],
      targetResults: [
        t1Result('L02-M01', 'L02-M01:S02', 'L02-W04', 'audio-form-supported')
      ],
      steps: [
        {
          stepId: 'L02-M01:S01', kind: 'explore-batch', prompt: '布袋里是什么？打开看看',
          sourceRefs: ['L02-W01', 'L02-W02', 'L02-W03', 'L02-W04'],
          entityIds: ['pen', 'pencil', 'book', 'watch'],
          gate: AUDIO_ENDED_GATE,
          revealPolicy: 'word-form-after-ended'
        },
        {
          stepId: 'L02-M01:S02', kind: 'match-entity-batch', prompt: '听声音，找物品',
          challengeSourceRefs: ['L02-W04'],
          optionEntityIds: ['pen', 'pencil', 'book', 'watch'],
          answerRule: {
            type: 'match-entity',
            pairs: { 'L02-W01': 'pen', 'L02-W02': 'pencil', 'L02-W03': 'book', 'L02-W04': 'watch' }
          },
          gate: AUDIO_ENDED_GATE,
          support: [...AUDIO_SUPPORT]
        }
      ],
      requiredFactIds: ['pocket-items-explored', 'watch-audio-cell-complete', 'pocket-items-shelved'],
      checkpointFacts: ['pocket-shelf-ready']
    }),
    nceMicrotask({
      microtaskId: 'L02-M02',
      lessonId: 'lesson2',
      title: '标签认领',
      stepLabel: '整理室 · 2 / 7',
      sceneMode: 'pocket-labels-and-watch',
      prompt: '认一张标签，再归还手表',
      completedFeedback: '铅笔标签登记好了，第一位认领者拿回了手表。',
      nextCue: { entityId: 'case-stamp', label: '查看衣架线索' },
      exposureRefs: ['L01-W07', 'L02-W01', 'L02-W02', 'L02-W03', 'L02-W04', 'L01-D01', 'L01-D02', 'L01-D03', 'L01-D06', 'L01-D07'],
      evidenceRefs: ['L02-W02', 'L01-D01', 'L01-D03', 'L01-D06'],
      targetResults: [
        t1Result('L02-M02', 'L02-M02:S01', 'L02-W02', 'word-form'),
        nceTargetResult({
          resultId: 'NCE-U01-T02:L02-M02:attention', targetNumber: 2,
          stepId: 'L02-M02:S02', sourceRef: 'L01-D01', channel: 'meaning',
          evidenceMode: 'polite-attention-choice', variantId: 'first-claimant'
        }),
        nceTargetResult({
          resultId: 'NCE-U01-T04:L02-M02:watch', targetNumber: 4,
          stepId: 'L02-M02:S04', sourceRef: 'L02-W04', channel: 'meaning',
          evidenceMode: 'ownership-exchange', variantId: 'watch'
        })
      ],
      steps: [
        {
          stepId: 'L02-M02:S01', kind: 'match-entity-batch', challengeMode: 'word-form',
          prompt: '看单词，找到对应的物品',
          challengeSourceRefs: ['L02-W02'],
          optionEntityIds: ['handbag', 'watch', 'pencil', 'book', 'pen'],
          answerRule: {
            type: 'match-entity',
            pairs: {
              'L01-W07': 'handbag', 'L02-W01': 'pen', 'L02-W02': 'pencil',
              'L02-W03': 'book', 'L02-W04': 'watch'
            }
          },
          feedbackGate: AUDIO_ENDED_GATE,
          support: [...WORD_FORM_SUPPORT]
        },
        {
          stepId: 'L02-M02:S02', kind: 'select-one', prompt: '想礼貌叫住她，应该怎么说？',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          optionSourceRefs: ['L01-D01', 'L01-D07'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D01' },
          feedbackAudioSourceRef: 'L01-D01', gate: AUDIO_ENDED_GATE,
          support: [...EXPRESSION_SUPPORT]
        },
        {
          stepId: 'L02-M02:S03', kind: 'audio-sequence', prompt: '听对方回应',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          audioSourceRefs: ['L01-D02'], gate: AUDIO_ENDED_GATE
        },
        {
          stepId: 'L02-M02:S04', kind: 'place-in-slot', prompt: '想问手表是不是她的，把 watch 放进问句',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          slotId: 'ownership-item', optionEntityIds: ['watch', 'book', 'pen', 'pencil'],
          expressionContentRef: 'NCE-U01-C-Q-WATCH',
          answerRule: { type: 'place-in-slot', slotId: 'ownership-item', entityId: 'watch' },
          feedbackAudioContentRef: 'NCE-U01-C-Q-WATCH', gate: AUDIO_ENDED_GATE,
          support: [...SENTENCE_SUPPORT]
        },
        {
          stepId: 'L02-M02:S05', kind: 'audio-sequence', prompt: '听听她怎么回答',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          audioSourceRefs: ['L01-D06'], gate: AUDIO_ENDED_GATE
        },
        {
          stepId: 'L02-M02:S06', kind: 'perform-action', prompt: '把手表交给她',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          entityIds: ['watch'], targetEntityIds: ['first-claimant'],
          answerRule: { type: 'perform-action', action: 'give', entityId: 'watch', targetEntityId: 'first-claimant' }
        },
        {
          stepId: 'L02-M02:S07', kind: 'audio-sequence', prompt: '听听她拿回手表后怎么说',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          audioSourceRefs: ['L01-D07'], gate: AUDIO_ENDED_GATE
        }
      ],
      requiredFactIds: ['pencil-word-form-cell', 'watch-attention', 'watch-question-ended', 'watch-confirmed', 'watch-returned', 'watch-thanks-ended'],
      checkpointFacts: ['claim-record-1', 'watch-with-first-claimant']
    }),
    nceMicrotask({
      microtaskId: 'L02-M03',
      lessonId: 'lesson2',
      title: '衣帽架归位',
      stepLabel: '整理室 · 3 / 7',
      sceneMode: 'moving-wardrobe',
      prompt: '拉开衣罩，听音归位',
      completedFeedback: '四件衣物都认识了，也分清了 shirt 和 skirt。',
      nextCue: { entityId: 'case-stamp', label: '打开衣签登记册' },
      exposureRefs: ['L02-W05', 'L02-W06', 'L02-W07', 'L02-W08'],
      evidenceRefs: ['L02-W08', 'L02-W07'],
      targetResults: [
        t1Result('L02-M03', 'L02-M03:S02', 'L02-W08', 'audio-form-supported'),
        t1Result('L02-M03', 'L02-M03:S02', 'L02-W07', 'audio-form-supported')
      ],
      steps: [
        {
          stepId: 'L02-M03:S01', kind: 'explore-batch', prompt: '衣罩里是什么？拉开看看',
          sourceRefs: ['L02-W05', 'L02-W06', 'L02-W07', 'L02-W08'],
          entityIds: ['coat', 'dress', 'skirt', 'shirt'], gate: AUDIO_ENDED_GATE,
          revealPolicy: 'word-form-after-ended'
        },
        {
          stepId: 'L02-M03:S02', kind: 'match-entity-batch', prompt: '听声音，找衣物',
          challengeSourceRefs: ['L02-W08', 'L02-W07'],
          optionEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
          answerRule: {
            type: 'match-entity',
            pairs: { 'L02-W05': 'coat', 'L02-W06': 'dress', 'L02-W07': 'skirt', 'L02-W08': 'shirt' }
          },
          gate: AUDIO_ENDED_GATE,
          support: [...AUDIO_SUPPORT]
        }
      ],
      requiredFactIds: ['clothes-explored', 'shirt-skirt-audio-cells', 'wardrobe-ordered'],
      checkpointFacts: ['wardrobe-ready']
    }),
    nceMicrotask({
      microtaskId: 'L02-M04',
      lessonId: 'lesson2',
      title: '衣签归位',
      stepLabel: '整理室 · 4 / 7',
      sceneMode: 'clothing-labels-and-coat',
      prompt: '认一张衣签，再归还外套',
      completedFeedback: '外套衣签登记好了，主人也拿回了自己的外套。',
      nextCue: { entityId: 'case-stamp', label: '查看街区影像' },
      exposureRefs: ['L02-W05', 'L02-W06', 'L02-W07', 'L02-W08', 'L01-D06', 'L01-D07'],
      evidenceRefs: ['L02-W05', 'L01-D06', 'L01-D07'],
      targetResults: [
        t1Result('L02-M04', 'L02-M04:S01', 'L02-W05', 'word-form'),
        nceTargetResult({
          resultId: 'NCE-U01-T04:L02-M04:coat', targetNumber: 4,
          stepId: 'L02-M04:S03', sourceRef: 'L01-D06', channel: 'meaning',
          evidenceMode: 'ownership-exchange', variantId: 'coat'
        }),
        nceTargetResult({
          resultId: 'NCE-U01-T05:L02-M04:thanks', targetNumber: 5,
          stepId: 'L02-M04:S05', sourceRef: 'L01-D07', channel: 'meaning',
          evidenceMode: 'thanks-in-context', variantId: 'coat-owner'
        })
      ],
      steps: [
        {
          stepId: 'L02-M04:S01', kind: 'match-entity-batch', challengeMode: 'word-form',
          prompt: '看单词，找到对应的衣物',
          challengeSourceRefs: ['L02-W05'],
          optionEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
          answerRule: {
            type: 'match-entity',
            pairs: { 'L02-W05': 'coat', 'L02-W06': 'dress', 'L02-W07': 'skirt', 'L02-W08': 'shirt' }
          },
          feedbackGate: AUDIO_ENDED_GATE,
          support: [...WORD_FORM_SUPPORT]
        },
        {
          stepId: 'L02-M04:S02', kind: 'audio-sequence', prompt: '听归还者询问',
          characterEntityIds: ['second-returner', 'coat-owner'],
          audioContentRefs: ['NCE-U01-C-Q-COAT'], gate: AUDIO_ENDED_GATE
        },
        {
          stepId: 'L02-M04:S03', kind: 'select-one', prompt: '她认出了自己的外套，应该怎么回答？',
          characterEntityIds: ['second-returner', 'coat-owner'],
          optionSourceRefs: ['L01-D06', 'L01-D02'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D06' },
          feedbackAudioSourceRef: 'L01-D06', gate: AUDIO_ENDED_GATE,
          support: [...EXPRESSION_SUPPORT]
        },
        {
          stepId: 'L02-M04:S04', kind: 'perform-action', prompt: '把外套交给她',
          characterEntityIds: ['second-returner', 'coat-owner'],
          entityIds: ['coat'], targetEntityIds: ['coat-owner'],
          answerRule: { type: 'perform-action', action: 'give', entityId: 'coat', targetEntityId: 'coat-owner' }
        },
        {
          stepId: 'L02-M04:S05', kind: 'select-one', prompt: '她收到外套，应该怎么说？',
          characterEntityIds: ['second-returner', 'coat-owner'],
          optionSourceRefs: ['L01-D07', 'L01-D04'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D07' },
          feedbackAudioSourceRef: 'L01-D07', gate: AUDIO_ENDED_GATE,
          support: [...EXPRESSION_SUPPORT]
        }
      ],
      requiredFactIds: ['coat-word-form-cell', 'coat-question-ended', 'coat-confirmed', 'coat-returned', 'coat-thanks'],
      checkpointFacts: ['claim-record-2', 'coat-with-owner']
    }),
    nceMicrotask({
      microtaskId: 'L02-M07',
      lessonId: 'lesson2',
      title: '三案合闸',
      stepLabel: '整理室 · 7 / 7',
      sceneMode: 'station-opening',
      characterEntityIds: ['first-claimant', 'coat-owner', 'third-claimant'],
      prompt: '三份记录已经就位，亲手开张',
      completedFeedback: '星灯失物招领站正式开张！今天的建筑已经保存。',
      nextCue: { entityId: 'opening-lever', label: '查看今日建设' },
      exposureRefs: [],
      evidenceRefs: [],
      steps: [
        {
          stepId: 'L02-M07:S02', kind: 'perform-action', prompt: '拉下开张拉杆',
          preconditionFactIds: ['claim-record-1', 'claim-record-2', 'claim-record-3'],
          entityIds: ['opening-lever'], targetEntityIds: ['station-power'],
          answerRule: { type: 'perform-action', action: 'pull', entityId: 'opening-lever', targetEntityId: 'station-power' }
        }
      ],
      growthBoundary: 'unit-built',
      requiredFactIds: ['opening-lever-pulled'],
      checkpointFacts: ['lesson2-complete', 'unit-built-same-day', 'landmark-state-5', 'reviews-scheduled']
    })
  ];

  const LESSON1_V2_MICROTASKS = [
    ...LESSON1_MICROTASKS.slice(0, 3),
    nceMicrotask({
      microtaskId: 'L01-M05', lessonId: 'lesson1', title: '四幕对话拼图',
      stepLabel: '第一案 · 4 / 5', sceneMode: 'dialogue-picture-sequence',
      characterEntityIds: [...LOST_HANDBAG_CAST], sceneEntityIds: ['handbag'],
      prompt: '把四幅图排成一段完整的招领故事',
      completedFeedback: '你看懂了整段对话为什么一步一步发生。',
      nextCue: { entityId: 'case-stamp', label: '完成案件归档' },
      exposureRefs: Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`),
      evidenceRefs: ['L01-Q01', 'L01-D01', 'L01-D03', 'L01-D04', 'L01-D06', 'L01-D07'],
      targetResults: [nceTargetResult({
        resultId: 'NCE-U01-T04:L01-M05:dialogue-order', targetNumber: 4,
        stepId: 'L01-M05:S01', sourceRef: 'L01-Q01', channel: 'meaning',
        evidenceMode: 'ownership-exchange', variantId: 'four-scene-dialogue-order'
      })],
      steps: [{
        stepId: 'L01-M05:S01', kind: 'ordered-sequence', submissionMode: 'formal',
        prompt: '先发生什么？依次点四幅画面，还原完整对话',
        characterEntityIds: [...LOST_HANDBAG_CAST],
        sequencePanels: [
          {
            panelId: 'attention', title: '礼貌叫住', visualMoment: 'attention', cueSymbol: '!',
            characterEntityIds: [...LOST_HANDBAG_CAST], propEntityIds: ['handbag'],
            sourceRefs: ['L01-D01', 'L01-D02']
          },
          {
            panelId: 'ownership', title: '询问归属', visualMoment: 'ownership', cueSymbol: '?',
            characterEntityIds: [...LOST_HANDBAG_CAST], propEntityIds: ['handbag'],
            sourceRefs: ['L01-D03']
          },
          {
            panelId: 'repair', title: '请求重复', visualMoment: 'repair', cueSymbol: '…?',
            characterEntityIds: [...LOST_HANDBAG_CAST], propEntityIds: ['handbag'],
            sourceRefs: ['L01-D04', 'L01-D05']
          },
          {
            panelId: 'confirm-thanks', title: '确认并感谢', visualMoment: 'confirm-thanks', cueSymbol: '★',
            characterEntityIds: [...LOST_HANDBAG_CAST], propEntityIds: ['handbag'],
            sourceRefs: ['L01-D06', 'L01-D07']
          }
        ],
        answerRule: {
          type: 'ordered-sequence',
          acceptedOrder: ['attention', 'ownership', 'repair', 'confirm-thanks']
        },
        support: [
          '故事还没有接上：先看谁还没注意、谁又没听清。',
          '先找“Excuse me!”那幅，再找“Pardon?”那幅。',
          '小猫换成借书情境示范四步，最后仍由你排好手提包故事。'
        ]
      }],
      requiredFactIds: ['dialogue-sequence-complete'],
      checkpointFacts: ['case-clue-dialogue-order']
    }),
    nceMicrotask({
      microtaskId: 'L01-M06', lessonId: 'lesson1', title: '星灯案件归档',
      stepLabel: '第一案 · 5 / 5', sceneMode: 'chapter-archive',
      prompt: '案件事实已经自动归档，亲手盖一次结案章',
      completedFeedback: '案件章和工作灯亮起，整理室入口已经保存。',
      nextCue: { entityId: 'opening-lever', label: '进入星灯语法实验室' },
      exposureRefs: ['L01-Q01'], evidenceRefs: [],
      steps: [{
        stepId: 'L01-M06:S01', kind: 'perform-action', submissionMode: 'story',
        affectsAdventureHearts: false, prompt: '亲手盖下结案章',
        preconditionFactIds: [
          'case-clue-owner', 'case-clue-attention', 'case-clue-repair',
          'case-clue-dialogue-order'
        ],
        entityIds: ['case-stamp'], targetEntityIds: ['case-file'],
        answerRule: {
          type: 'all-of',
          rules: [{ type: 'perform-action', action: 'stamp', entityId: 'case-stamp', targetEntityId: 'case-file' }]
        }
      }],
      growthBoundary: 'chapter-interior', requiredFactIds: ['case-stamped'],
      checkpointFacts: ['lesson1-complete', 'work-lamp-on', 'story-book-open', 'sorting-room-open']
    })
  ];

  const LESSON2_V2_MICROTASKS = [
    nceMicrotask({
      microtaskId: 'L02-M01', lessonId: 'lesson2', title: '句子变问句',
      stepLabel: '语法实验室 · 1 / 3', sceneMode: 'grammar-statement-question',
      taskGroup: 'starlight-grammar-lab', prompt: '移动 is，看看一句话怎样变成问句',
      completedFeedback: 'is 走到句首，句号也变成了问号。',
      nextCue: { entityId: 'case-stamp', label: '追踪 it 指向谁' },
      exposureRefs: ['L01-D03', 'L01-W04', 'L01-W05', 'L01-W06', 'L01-W07'], evidenceRefs: [],
      steps: [
        {
          stepId: 'L02-M01:S01', kind: 'grammar-compare', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '先比较这两句有什么不同',
          statementContentRef: 'NCE-U01-C-S-HANDBAG', questionSourceRef: 'L01-D03',
          teachingTerms: [
            { term: 'be 动词', copy: '这里的 is 是 be 动词。' },
            { term: '一般疑问句', copy: '把 is 放到前面，就能问“是不是”。' }
          ]
        },
        {
          stepId: 'L02-M01:S02', kind: 'ordered-blocks', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '把 is 移到最前面，再换上问号',
          blockContentRefs: [
            'NCE-U01-C-BLOCK-THIS', 'NCE-U01-C-BLOCK-IS',
            'NCE-U01-C-BLOCK-YOUR', 'NCE-U01-C-BLOCK-HANDBAG',
            'NCE-U01-C-PUNCT-QUESTION'
          ],
          answerRule: {
            type: 'ordered-blocks',
            acceptedOrder: [
              'NCE-U01-C-BLOCK-IS', 'NCE-U01-C-BLOCK-THIS',
              'NCE-U01-C-BLOCK-YOUR', 'NCE-U01-C-BLOCK-HANDBAG',
              'NCE-U01-C-PUNCT-QUESTION'
            ]
          }
        }
      ],
      requiredFactIds: ['statement-question-compared', 'is-moved-to-question-front'],
      checkpointFacts: ['grammar-question-shape-seen']
    }),
    nceMicrotask({
      microtaskId: 'L02-M02', lessonId: 'lesson2', title: 'it 指向谁',
      stepLabel: '语法实验室 · 2 / 3', sceneMode: 'grammar-it-reference',
      taskGroup: 'starlight-grammar-lab', prompt: '把回答里的 it 连回正在说的物品',
      completedFeedback: 'it 可以接住前面已经说过的那件物品。',
      nextCue: { entityId: 'case-stamp', label: '换一件物品试试' },
      exposureRefs: ['L01-D03', 'L01-D06', 'L01-W09'], evidenceRefs: [],
      steps: [
        {
          stepId: 'L02-M02:S01', kind: 'audio-sequence', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '听问句和肯定简短回答',
          audioSourceRefs: ['L01-D03', 'L01-D06'], gate: AUDIO_ENDED_GATE,
          textVisibility: 'always-visible'
        },
        {
          stepId: 'L02-M02:S02', kind: 'connect-reference', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: 'Yes, it is. 里面的 it 指的是谁？',
          sourceRef: 'L01-W09', answerSourceRef: 'L01-D06', emphasisText: 'it',
          optionEntityIds: ['handbag', 'station-keeper', 'handbag-owner'],
          answerRule: { type: 'connect-reference', sourceRef: 'L01-W09', entityId: 'handbag' },
          teachingTerms: [{ term: '代词 it', copy: 'it 在这里代替前面说过的 handbag。' }]
        }
      ],
      requiredFactIds: ['short-answer-heard', 'it-reference-connected'],
      checkpointFacts: ['grammar-it-reference-seen']
    }),
    nceMicrotask({
      microtaskId: 'L02-M03', lessonId: 'lesson2', title: '换物品也会问',
      stepLabel: '语法实验室 · 3 / 3', sceneMode: 'grammar-transfer-console',
      taskGroup: 'starlight-grammar-lab', characterEntityIds: [...LOST_HANDBAG_CAST],
      sceneEntityIds: ['watch'], prompt: '换成 watch，组装问句并找出不对的回答',
      completedFeedback: '物品变了，问句骨架和 it 的关系仍然不变。',
      nextCue: { entityId: 'case-stamp', label: '打开随身物品袋' },
      exposureRefs: ['L01-D03', 'L01-D06', 'L01-W06', 'L01-W09', 'L02-W04'],
      evidenceRefs: ['L01-D03', 'L01-D06', 'L02-W04'],
      targetResults: [
        nceTargetResult({
          resultId: 'NCE-U01-T04:L02-M03:watch-question', targetNumber: 4,
          stepId: 'L02-M03:S01', sourceRef: 'L02-W04', channel: 'meaning',
          evidenceMode: 'ownership-exchange', variantId: 'grammar-watch-question'
        }),
        nceTargetResult({
          resultId: 'NCE-U01-T04:L02-M03:it-error', targetNumber: 4,
          stepId: 'L02-M03:S02', sourceRef: 'L01-D06', channel: 'relation',
          evidenceMode: 'ownership-exchange', variantId: 'grammar-it-error'
        })
      ],
      steps: [
        {
          stepId: 'L02-M03:S01', kind: 'ordered-blocks', submissionMode: 'formal',
          prompt: '用四块词语问“这是你的手表吗？”',
          blockContentRefs: [
            'NCE-U01-C-BLOCK-IS', 'NCE-U01-C-BLOCK-THIS',
            'NCE-U01-C-BLOCK-YOUR'
          ],
          blockSourceRefs: ['L02-W04'],
          answerRule: {
            type: 'ordered-blocks',
            acceptedOrder: [
              'NCE-U01-C-BLOCK-IS', 'NCE-U01-C-BLOCK-THIS',
              'NCE-U01-C-BLOCK-YOUR', 'L02-W04'
            ]
          },
          feedbackAudioContentRef: 'NCE-U01-C-Q-WATCH', gate: AUDIO_ENDED_GATE,
          teachingTerms: [{ term: 'your', copy: 'your 在这里就是“你的”。' }],
          support: [...SENTENCE_SUPPORT]
        },
        {
          stepId: 'L02-M03:S02', kind: 'detect-error', submissionMode: 'formal',
          prompt: '哪句回答正确接住了 watch？',
          optionSourceRefs: ['L01-D06', 'L01-D02', 'L01-D04'],
          diagnosticContentRef: 'NCE-U01-C-A-WRONG-THIS',
          answerRule: { type: 'detect-error', acceptedSourceRef: 'L01-D06' },
          feedbackAudioSourceRef: 'L01-D06', gate: AUDIO_ENDED_GATE,
          support: [
            '回答没有接住刚才的 watch，再看看代替物品的词。',
            '肯定简短回答要用 it，不是 this。',
            '小猫换成 book 示范一次，最后由你找出 watch 的正确回答。'
          ]
        }
      ],
      requiredFactIds: ['watch-question-built', 'it-error-detected'],
      checkpointFacts: ['grammar-lab-complete']
    }),

    nceMicrotask({
      microtaskId: 'L02-M04', lessonId: 'lesson2', title: '旅行袋上架',
      stepLabel: '随身物品 · 1 / 2', sceneMode: 'pocket-shelf',
      prompt: '一次打开旅行袋，按顺序认识四件物品',
      completedFeedback: '四件随身物品都上架了，你还从声音找到了 watch。',
      nextCue: { entityId: 'case-stamp', label: '处理手表案件' },
      exposureRefs: ['L02-I01', 'L02-W01', 'L02-W02', 'L02-W03', 'L02-W04'],
      evidenceRefs: ['L02-W04'],
      targetResults: [t1Result('L02-M04', 'L02-M04:S02', 'L02-W04', 'audio-form-supported')],
      steps: [
        {
          stepId: 'L02-M04:S01', kind: 'explore-batch', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '打开旅行袋，依次看、听四件物品',
          sourceRefs: ['L02-W01', 'L02-W02', 'L02-W03', 'L02-W04'],
          entityIds: ['pen', 'pencil', 'book', 'watch'], gate: AUDIO_ENDED_GATE,
          revealPolicy: 'word-form-with-audio'
        },
        {
          stepId: 'L02-M04:S02', kind: 'match-entity-batch', submissionMode: 'formal',
          prompt: '听到 watch，把它放到发光托盘', challengeSourceRefs: ['L02-W04'],
          optionEntityIds: ['pen', 'pencil', 'book', 'watch'],
          answerRule: {
            type: 'match-entity',
            pairs: { 'L02-W01': 'pen', 'L02-W02': 'pencil', 'L02-W03': 'book', 'L02-W04': 'watch' }
          },
          gate: AUDIO_ENDED_GATE, support: [...AUDIO_SUPPORT]
        }
      ],
      requiredFactIds: ['pocket-items-explored', 'watch-audio-cell-complete'],
      checkpointFacts: ['pocket-shelf-ready']
    }),
    nceMicrotask({
      microtaskId: 'L02-M05', lessonId: 'lesson2', title: '手表认领',
      stepLabel: '随身物品 · 2 / 2', sceneMode: 'pocket-labels-and-watch',
      characterEntityIds: ['station-keeper', 'first-claimant'], sceneEntityIds: ['watch'],
      prompt: '认出 pencil，再用新句型处理手表案件',
      completedFeedback: '铅笔标签登记好了，手表也只交还了一次。',
      nextCue: { entityId: 'case-stamp', label: '打开衣柜' },
      exposureRefs: [
        'L02-W01', 'L02-W02', 'L02-W03', 'L02-W04',
        'L01-D01', 'L01-D02', 'L01-D06', 'L01-D07'
      ],
      evidenceRefs: ['L02-W02', 'L02-W04', 'L01-D06'],
      targetResults: [
        t1Result('L02-M05', 'L02-M05:S01', 'L02-W02', 'word-form'),
        nceTargetResult({
          resultId: 'NCE-U01-T04:L02-M05:watch', targetNumber: 4,
          stepId: 'L02-M05:S03', sourceRef: 'L02-W04', channel: 'meaning',
          evidenceMode: 'ownership-exchange', variantId: 'watch-claim'
        })
      ],
      steps: [
        {
          stepId: 'L02-M05:S01', kind: 'match-entity-batch', submissionMode: 'formal',
          challengeMode: 'word-form', prompt: '看 pencil，找到对应的物品',
          challengeSourceRefs: ['L02-W02'], optionEntityIds: ['watch', 'pencil', 'book', 'pen'],
          answerRule: {
            type: 'match-entity',
            pairs: { 'L02-W01': 'pen', 'L02-W02': 'pencil', 'L02-W03': 'book', 'L02-W04': 'watch' }
          },
          feedbackGate: AUDIO_ENDED_GATE, support: [...WORD_FORM_SUPPORT]
        },
        {
          stepId: 'L02-M05:S02', kind: 'audio-sequence', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '招领员先礼貌叫住她',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          audioSourceRefs: ['L01-D01', 'L01-D02'], gate: AUDIO_ENDED_GATE,
          textVisibility: 'always-visible'
        },
        {
          stepId: 'L02-M05:S03', kind: 'ordered-blocks', submissionMode: 'formal',
          prompt: '把 watch 放进已经会用的归属问句',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          blockContentRefs: ['NCE-U01-C-BLOCK-IS-THIS-YOUR'], blockSourceRefs: ['L02-W04'],
          answerRule: {
            type: 'ordered-blocks',
            acceptedOrder: ['NCE-U01-C-BLOCK-IS-THIS-YOUR', 'L02-W04']
          },
          feedbackAudioContentRef: 'NCE-U01-C-Q-WATCH', gate: AUDIO_ENDED_GATE,
          support: [...SENTENCE_SUPPORT]
        },
        {
          stepId: 'L02-M05:S04', kind: 'audio-sequence', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '听她确认这是自己的手表',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          audioSourceRefs: ['L01-D06'], gate: AUDIO_ENDED_GATE, textVisibility: 'always-visible'
        },
        {
          stepId: 'L02-M05:S05', kind: 'perform-action', submissionMode: 'story',
          affectsAdventureHearts: false, prompt: '把手表交给她',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          entityIds: ['watch'], targetEntityIds: ['first-claimant'],
          answerRule: { type: 'perform-action', action: 'give', entityId: 'watch', targetEntityId: 'first-claimant' }
        },
        {
          stepId: 'L02-M05:S06', kind: 'audio-sequence', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '听她拿回手表后的感谢',
          characterEntityIds: ['station-keeper', 'first-claimant'],
          audioSourceRefs: ['L01-D07'], gate: AUDIO_ENDED_GATE, textVisibility: 'always-visible'
        }
      ],
      requiredFactIds: ['pencil-word-form-cell', 'watch-question-built', 'watch-returned'],
      checkpointFacts: ['claim-record-1', 'watch-with-first-claimant']
    }),
    nceMicrotask({
      microtaskId: 'L02-M06', lessonId: 'lesson2', title: '衣柜听音归位',
      stepLabel: '衣物案件 · 1 / 2', sceneMode: 'moving-wardrobe',
      prompt: '一次打开衣柜，认识四件衣物',
      completedFeedback: '四件衣物都认识了，你也听清了 shirt 和 skirt。',
      nextCue: { entityId: 'case-stamp', label: '迎接外套主人' },
      exposureRefs: ['L02-W05', 'L02-W06', 'L02-W07', 'L02-W08'],
      evidenceRefs: ['L02-W08', 'L02-W07'],
      targetResults: [
        t1Result('L02-M06', 'L02-M06:S02', 'L02-W08', 'audio-form-supported'),
        t1Result('L02-M06', 'L02-M06:S02', 'L02-W07', 'audio-form-supported')
      ],
      steps: [
        {
          stepId: 'L02-M06:S01', kind: 'explore-batch', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '拉开衣柜，依次看、听四件衣物',
          sourceRefs: ['L02-W05', 'L02-W06', 'L02-W07', 'L02-W08'],
          entityIds: ['coat', 'dress', 'skirt', 'shirt'], gate: AUDIO_ENDED_GATE,
          revealPolicy: 'word-form-with-audio'
        },
        {
          stepId: 'L02-M06:S02', kind: 'match-entity-batch', submissionMode: 'formal',
          formalSubmissionCount: 2, prompt: '听声音，把 shirt 和 skirt 挂回正确位置',
          challengeSourceRefs: ['L02-W08', 'L02-W07'],
          optionEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
          answerRule: {
            type: 'match-entity',
            pairs: { 'L02-W05': 'coat', 'L02-W06': 'dress', 'L02-W07': 'skirt', 'L02-W08': 'shirt' }
          },
          gate: AUDIO_ENDED_GATE, support: [...AUDIO_SUPPORT]
        }
      ],
      requiredFactIds: ['clothes-explored', 'shirt-skirt-audio-cells'],
      checkpointFacts: ['wardrobe-ready']
    }),
    nceMicrotask({
      microtaskId: 'L02-M07', lessonId: 'lesson2', title: '外套主人来了',
      stepLabel: '衣物案件 · 2 / 2', sceneMode: 'clothing-labels-and-coat',
      characterEntityIds: ['second-returner', 'coat-owner'], sceneEntityIds: ['coat'],
      prompt: '先看主人进入案件，再找出并归还 coat',
      completedFeedback: '外套主人拿回了 coat，也亲口说了感谢。',
      nextCue: { entityId: 'case-stamp', label: '查看小镇影像窗' },
      exposureRefs: ['L02-W05', 'L02-W06', 'L02-W07', 'L02-W08', 'L01-D06', 'L01-D07'],
      evidenceRefs: ['L02-W05', 'L01-D07'],
      targetResults: [
        t1Result('L02-M07', 'L02-M07:S02', 'L02-W05', 'word-form'),
        nceTargetResult({
          resultId: 'NCE-U01-T05:L02-M07:thanks', targetNumber: 5,
          stepId: 'L02-M07:S06', sourceRef: 'L01-D07', channel: 'meaning',
          evidenceMode: 'thanks-in-context', variantId: 'coat-owner'
        })
      ],
      steps: [
        {
          stepId: 'L02-M07:S01', kind: 'story-arrival', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '外套主人走进小站，指向柜台上的外套',
          characterEntityIds: ['second-returner', 'coat-owner'], entityIds: ['coat']
        },
        {
          stepId: 'L02-M07:S02', kind: 'match-entity-batch', submissionMode: 'formal',
          challengeMode: 'word-form', prompt: '看 coat，找到她指着的衣物',
          characterEntityIds: ['second-returner', 'coat-owner'], challengeSourceRefs: ['L02-W05'],
          optionEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
          answerRule: {
            type: 'match-entity',
            pairs: { 'L02-W05': 'coat', 'L02-W06': 'dress', 'L02-W07': 'skirt', 'L02-W08': 'shirt' }
          },
          feedbackGate: AUDIO_ENDED_GATE, support: [...WORD_FORM_SUPPORT]
        },
        {
          stepId: 'L02-M07:S03', kind: 'audio-sequence', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '听归还者询问，再听主人确认',
          characterEntityIds: ['second-returner', 'coat-owner'],
          audioContentRefs: ['NCE-U01-C-Q-COAT'], audioSourceRefs: ['L01-D06'],
          gate: AUDIO_ENDED_GATE, textVisibility: 'always-visible'
        },
        {
          stepId: 'L02-M07:S04', kind: 'perform-action', submissionMode: 'story',
          affectsAdventureHearts: false, prompt: '把外套交给主人',
          characterEntityIds: ['second-returner', 'coat-owner'],
          entityIds: ['coat'], targetEntityIds: ['coat-owner'],
          answerRule: { type: 'perform-action', action: 'give', entityId: 'coat', targetEntityId: 'coat-owner' }
        },
        {
          stepId: 'L02-M07:S06', kind: 'select-one', submissionMode: 'formal',
          prompt: '她收到外套后，应该怎么说？',
          characterEntityIds: ['second-returner', 'coat-owner'],
          optionSourceRefs: ['L01-D07', 'L01-D04', 'L01-D01', 'L01-D02'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D07' },
          feedbackAudioSourceRef: 'L01-D07', gate: AUDIO_ENDED_GATE,
          support: [...EXPRESSION_SUPPORT]
        }
      ],
      requiredFactIds: ['coat-owner-arrived', 'coat-word-form-cell', 'coat-returned', 'coat-thanks'],
      checkpointFacts: ['claim-record-2', 'coat-with-owner']
    }),
    nceMicrotask({
      microtaskId: 'L02-M08', lessonId: 'lesson2', title: '小镇影像窗',
      stepLabel: '街区影像 · 1 / 2', sceneMode: 'neighborhood-windows',
      prompt: '打开 car、house 星窗，再礼貌叫住认领者',
      completedFeedback: '你看清了 car 和 house，也从声音找到了 house。',
      nextCue: { entityId: 'case-stamp', label: '核对汽车影像' },
      exposureRefs: ['L02-W09', 'L02-W10', 'L01-D01', 'L01-D02'],
      evidenceRefs: ['L02-W10', 'L01-D01'],
      targetResults: [
        t1Result('L02-M08', 'L02-M08:S02', 'L02-W10', 'audio-form-supported'),
        nceTargetResult({
          resultId: 'NCE-U01-T02:L02-M08:attention', targetNumber: 2,
          stepId: 'L02-M08:S03', sourceRef: 'L01-D01', channel: 'meaning',
          evidenceMode: 'polite-attention-choice', variantId: 'third-claimant'
        })
      ],
      steps: [
        {
          stepId: 'L02-M08:S01', kind: 'explore-batch', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '依次打开 car 和 house 星窗',
          sourceRefs: ['L02-W09', 'L02-W10'], entityIds: ['car', 'house'],
          gate: AUDIO_ENDED_GATE, revealPolicy: 'projection-with-word-form'
        },
        {
          stepId: 'L02-M08:S02', kind: 'match-entity-batch', submissionMode: 'formal',
          prompt: '听到 house，选择对应的星窗画面', challengeSourceRefs: ['L02-W10'],
          optionEntityIds: ['car', 'house'],
          answerRule: { type: 'match-entity', pairs: { 'L02-W09': 'car', 'L02-W10': 'house' } },
          gate: AUDIO_ENDED_GATE, support: [...AUDIO_SUPPORT]
        },
        {
          stepId: 'L02-M08:S03', kind: 'select-one', submissionMode: 'formal',
          prompt: '认领者正要走开，礼貌叫住她应该怎么说？',
          characterEntityIds: ['station-keeper', 'third-claimant'],
          optionSourceRefs: ['L01-D01', 'L01-D04', 'L01-D07', 'L01-D02'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D01' },
          feedbackAudioSourceRef: 'L01-D01', gate: AUDIO_ENDED_GATE,
          support: [...EXPRESSION_SUPPORT]
        },
        {
          stepId: 'L02-M08:S04', kind: 'audio-sequence', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '听她停下来回应',
          characterEntityIds: ['station-keeper', 'third-claimant'],
          audioSourceRefs: ['L01-D02'], gate: AUDIO_ENDED_GATE, textVisibility: 'always-visible'
        }
      ],
      requiredFactIds: ['neighborhood-scenes-explored', 'house-audio-cell', 'picture-attention'],
      checkpointFacts: ['neighborhood-window-ready']
    }),
    nceMicrotask({
      microtaskId: 'L02-M09', lessonId: 'lesson2', title: '汽车影像核对',
      stepLabel: '街区影像 · 2 / 2', sceneMode: 'neighborhood-picture-claim',
      characterEntityIds: ['station-keeper', 'third-claimant'],
      prompt: '认出 car，组装归属问句并完成核对',
      completedFeedback: '你认出了 car，也问清楚这辆车是不是她的。第三张核对记录已经保存。',
      nextCue: { entityId: 'opening-lever', label: '启动开张装置' },
      exposureRefs: ['L02-W09', 'L02-W10', 'L01-D03', 'L01-D06'],
      evidenceRefs: ['L02-W09', 'L01-D03', 'L01-D06'],
      targetResults: [
        t1Result('L02-M09', 'L02-M09:S01', 'L02-W09', 'word-form'),
        nceTargetResult({
          resultId: 'NCE-U01-T04:L02-M09:picture-question', targetNumber: 4,
          stepId: 'L02-M09:S03', sourceRef: 'L02-W09', channel: 'meaning',
          evidenceMode: 'ownership-exchange', variantId: 'car-picture-question'
        })
      ],
      steps: [
        {
          stepId: 'L02-M09:S01', kind: 'match-entity-batch', submissionMode: 'formal',
          challengeMode: 'word-form', prompt: '看 car，选择对应的星窗画面',
          challengeSourceRefs: ['L02-W09'], optionEntityIds: ['car', 'house'],
          answerRule: { type: 'match-entity', pairs: { 'L02-W09': 'car', 'L02-W10': 'house' } },
          feedbackGate: AUDIO_ENDED_GATE, support: [...WORD_FORM_SUPPORT]
        },
        {
          stepId: 'L02-M09:S02', kind: 'audio-sequence', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '招领员先叫住她，听她回应',
          characterEntityIds: ['station-keeper', 'third-claimant'],
          audioSourceRefs: ['L01-D01', 'L01-D02'], gate: AUDIO_ENDED_GATE,
          textVisibility: 'always-visible'
        },
        {
          stepId: 'L02-M09:S03', kind: 'ordered-blocks', submissionMode: 'formal',
          prompt: '用大词块组装“这是你的车吗？”',
          characterEntityIds: ['station-keeper', 'third-claimant'],
          blockContentRefs: ['NCE-U01-C-BLOCK-IS-THIS-YOUR'], blockSourceRefs: ['L02-W09'],
          answerRule: {
            type: 'ordered-blocks',
            acceptedOrder: ['NCE-U01-C-BLOCK-IS-THIS-YOUR', 'L02-W09']
          },
          feedbackAudioContentRef: 'NCE-U01-C-Q-CAR', gate: AUDIO_ENDED_GATE,
          support: [...SENTENCE_SUPPORT]
        },
        {
          stepId: 'L02-M09:S04', kind: 'audio-sequence', submissionMode: 'free',
          affectsAdventureHearts: false, prompt: '听她确认这是自己的汽车',
          characterEntityIds: ['station-keeper', 'third-claimant'],
          audioSourceRefs: ['L01-D06'], gate: AUDIO_ENDED_GATE, textVisibility: 'always-visible'
        }
      ],
      requiredFactIds: ['car-word-form-cell', 'car-question-built', 'car-picture-confirmed'],
      checkpointFacts: ['claim-record-3', 'three-claim-records-ready']
    }),
    nceMicrotask({
      microtaskId: 'L02-M10', lessonId: 'lesson2', title: '三批案件合闸',
      stepLabel: '开张时刻 · 10 / 10', sceneMode: 'station-opening',
      characterEntityIds: ['first-claimant', 'coat-owner', 'third-claimant'],
      prompt: '三批案件已经自动呈现，亲手启动一次开张装置',
      completedFeedback: '星灯失物招领站正式开张，今天的建设已经保存。',
      nextCue: { entityId: 'opening-lever', label: '查看今日建设' },
      exposureRefs: [], evidenceRefs: [],
      steps: [{
        stepId: 'L02-M10:S01', kind: 'perform-action', submissionMode: 'story',
        affectsAdventureHearts: false, prompt: '按下星灯开张装置',
        preconditionFactIds: ['claim-record-1', 'claim-record-2', 'claim-record-3'],
        entityIds: ['opening-lever'], targetEntityIds: ['station-power'],
        answerRule: {
          type: 'all-of',
          rules: [{ type: 'perform-action', action: 'pull', entityId: 'opening-lever', targetEntityId: 'station-power' }]
        }
      }],
      growthBoundary: 'unit-built', requiredFactIds: ['opening-lever-pulled'],
      checkpointFacts: ['lesson2-complete', 'unit-built-same-day', 'landmark-state-5', 'reviews-scheduled']
    })
  ];

  const NCE_U01_V2_REVISION = 'lesson1-2-v2.6';
  const NCE_U01_DIALOGUE_TURN_HINTS = [
    { turnRef: 'L01-D01', intent: '礼貌叫住对方', openingChunk: 'Excuse...' },
    { turnRef: 'L01-D02', intent: '回应对方，表示我在听', openingChunk: 'Yes...' },
    { turnRef: 'L01-D03', intent: '询问手提包是不是她的', openingChunk: 'Is this...' },
    { turnRef: 'L01-D04', intent: '没听清，请对方再说一遍', openingChunk: 'Pardon...' },
    { turnRef: 'L01-D05', intent: '把归属问题再问一遍', openingChunk: 'Is this...' },
    { turnRef: 'L01-D06', intent: '确认手提包是自己的', openingChunk: 'Yes, it...' },
    { turnRef: 'L01-D07', intent: '拿回手提包后礼貌道谢', openingChunk: 'Thank you...' }
  ];
  const NCE_U01_V2_SHUFFLE_PROTOCOL = {
    hash: 'fnv1a32-v1',
    prng: 'mulberry32-v1',
    permutation: 'fisher-yates-v1',
    seedDomain: [
      'experienceRevision', 'unitAttemptId', 'microtaskId',
      'attemptRevision', 'channel', 'challengeRef'
    ]
  };
  const NCE_U01_V2_REVIEW_CONTEXTS = {
    'review-schoolbag-check': {
      contextId: 'review-schoolbag-check', title: '晨光书包核对',
      changeType: 'changed-object-position', entityIds: ['handbag', 'pen', 'pencil', 'book', 'watch'],
      backdropAssetSrc: '/poc/lesson1-2-experience/assets/starlight-station-stage-bg-v1.webp',
      backdropPosition: 'center'
    },
    'review-morning-coatroom': {
      contextId: 'review-morning-coatroom', title: '清晨衣帽间',
      changeType: 'changed-room', entityIds: ['coat', 'dress', 'skirt', 'shirt'],
      backdropAssetSrc: '/poc/lesson1-2-experience/assets/starlight-station-stage-bg-v1.webp',
      backdropPosition: '67% center'
    },
    'review-neighbourhood-route': {
      contextId: 'review-neighbourhood-route', title: '白天街区回家路',
      changeType: 'changed-street-scene', entityIds: ['car', 'house'],
      backdropAssetSrc: '/poc/lesson1-2-experience/assets/scene-house-v2.webp',
      backdropPosition: 'center 58%'
    },
    'review-help-desk-exchange': {
      contextId: 'review-help-desk-exchange', title: '另一张服务台',
      changeType: 'changed-person-and-object', entityIds: ['station-keeper', 'handbag-owner'],
      backdropAssetSrc: '/poc/lesson1-2-experience/assets/starlight-station-stage-bg-v1.webp',
      backdropPosition: '24% center'
    }
  };

  const NCE_U01_V2_AUTHORED_CONTENT = {
    ...NCE_AUTHORED_CONTENT,
    'NCE-U01-C-BLOCK-WATCH': {
      contentId: 'NCE-U01-C-BLOCK-WATCH', kind: 'language-block', text: 'watch', sourceRefs: ['L02-W04']
    },
    'NCE-U01-C-KNOWLEDGE-QUESTION': {
      contentId: 'NCE-U01-C-KNOWLEDGE-QUESTION', kind: 'knowledge-card',
      title: '原来这是一个“是不是”的问句',
      text: 'Is this your ...? 用来问“这是你的……吗？”',
      sourceRefs: ['L01-D03', 'L02-W04']
    },
    'NCE-U01-C-KNOWLEDGE-IT': {
      contentId: 'NCE-U01-C-KNOWLEDGE-IT', kind: 'knowledge-card-detail',
      title: '想多看一点',
      text: 'is 是 be 动词；问句把 is 放在前面。Yes, it is. 里的 it 指刚才那件东西。',
      sourceRefs: ['L01-D03', 'L01-D06', 'L01-W04', 'L01-W09']
    },
    'NCE-U01-C-RECAP-OWNER': {
      contentId: 'NCE-U01-C-RECAP-OWNER', kind: 'practice-prompt',
      text: '手提包最后回到了谁手里？', sourceRefs: ['L01-D06']
    },
    'NCE-U01-C-RECAP-REPAIR': {
      contentId: 'NCE-U01-C-RECAP-REPAIR', kind: 'practice-prompt',
      text: '没有听清对方的话，应该怎么说？', sourceRefs: ['L01-D04']
    },
    'NCE-U01-C-RECAP-ROUTE': {
      contentId: 'NCE-U01-C-RECAP-ROUTE', kind: 'practice-prompt',
      text: '新路线的终点是一座房子，要挂哪张英文牌？', sourceRefs: ['L02-W10']
    }
  };

  const NCE_WORD_ENTITY_BY_SOURCE = {
    'L01-W07': 'handbag',
    'L02-W01': 'pen', 'L02-W02': 'pencil', 'L02-W03': 'book', 'L02-W04': 'watch',
    'L02-W05': 'coat', 'L02-W06': 'dress', 'L02-W07': 'skirt', 'L02-W08': 'shirt',
    'L02-W09': 'car', 'L02-W10': 'house'
  };

  function nceSourceItem(sourceRef) {
    return LESSON1_SOURCES[sourceRef] || LESSON2_SOURCES[sourceRef];
  }

  function nceContentItem(contentRef) {
    return NCE_U01_V2_AUTHORED_CONTENT[contentRef];
  }

  function nceV2AudioSequence(sequenceId, refs, referenceKind = 'source') {
    return {
      sequenceId,
      gate: AUDIO_ENDED_GATE,
      failurePolicy: 'fail-closed',
      automaticRetryDelaysMs: [250, 750],
      maxPlaybackAttempts: 3,
      segments: refs.map((ref, index) => {
        const item = referenceKind === 'content' ? nceContentItem(ref) : nceSourceItem(ref);
        return {
          segmentId: `${sequenceId}:A${String(index + 1).padStart(2, '0')}`,
          ...(referenceKind === 'content' ? { contentRef: ref } : { sourceRef: ref }),
          text: item?.text,
          audioSrc: item?.audioSrc
        };
      })
    };
  }

  function nceV2SupportLayers(challengeRef, supportKind) {
    const copyByKind = {
      owner: [
        '再看看。',
        '回想“对，是我的”是谁说的。',
        '小猫换一件已学过的物品，示范怎样找到说“是我的”的人。'
      ],
      expression: [
        '再看看。',
        '聚焦眼前的交际目的，再听关键一句。',
        '小猫换一组人物和物品，示范同一个交际目的。'
      ],
      audio: [
        '再看看。',
        '把目标声音和最容易混淆的物品对比一下。',
        '小猫用另一个已学词示范听音找物。'
      ],
      form: [
        '再看看。',
        '留意开头、结尾和单词长度，再选一次。',
        '小猫用另一个词静默示范看词形找物。'
      ],
      structure: [
        '问句从 Is 开始，问号放最后。',
        '先找出 Is 和问号，中间的单词由你继续排列。',
        '小猫换成 book 示范：Is this your book?'
      ]
    };
    return ['reobserve', 'partial-cue', 'model'].map((level, index) => ({
      level,
      contentId: `NCE-U01-C-SUPPORT-${challengeRef.replace(/[:]/g, '-')}-${level.toUpperCase()}`,
      copy: copyByKind[supportKind][index]
    }));
  }

  function nceV2Result({
    resultId,
    microtaskId,
    challengeOrdinal,
    stepId,
    targetNumber,
    sourceRef,
    relatedSourceRefs = [],
    contentRef,
    channel,
    contextId,
    reviewContextId,
    evidenceMode,
    variantId
  }) {
    const challengeRef = `${microtaskId}:C${String(challengeOrdinal).padStart(2, '0')}`;
    return {
      resultId,
      reviewCellId: resultId,
      challengeRef,
      targetId: `NCE-U01-T${String(targetNumber).padStart(2, '0')}`,
      stepId,
      sourceRef,
      ...(relatedSourceRefs.length ? { relatedSourceRefs } : {}),
      ...(contentRef ? { contentRef } : {}),
      channel,
      contextId,
      reviewContextId,
      evidenceMode,
      variantId,
      resultKind: 'formative'
    };
  }

  const NCE_U01_INTERACTION_CONTRACTS = [
    ['L01-M08:C01', 'scene-identify', ['L01-D06'], { targetId: 'handbag-owner' }],
    ['L01-M08:C02', 'scene-identify', ['L01-W07'], { targetId: 'handbag' }],
    ['L01-M09:C01', 'utterance-select', ['L01-D01'], { targetId: 'station-keeper:attention-turn' }],
    ['L01-M10:C01', 'relation-reconstruct', ['L01-D03', 'L01-W07'], {
      relationSlotIds: [
        'ownership-question:opening', 'ownership-question:handbag',
        'ownership-question:punctuation'
      ]
    }],
    ['L01-M10:C02', 'utterance-select', ['L01-D04'], { targetId: 'handbag-owner:repair-turn' }],
    ['L01-M11:C01', 'label-connect', ['L01-W07'], { targetId: 'handbag:english-label' }],
    ['L01-M11:C02', 'utterance-select', ['L01-D07'], { targetId: 'handbag-owner:thanks-turn' }],
    ['L02-M11:C01', 'object-place', ['L02-W01'], { targetId: 'personal-items-tray:pen' }],
    ['L02-M11:C02', 'object-place', ['L02-W02'], { targetId: 'personal-items-tray:pencil' }],
    ['L02-M12:C01', 'scene-identify', ['L02-W03'], { targetId: 'book' }],
    ['L02-M12:C02', 'scene-identify', ['L02-W04'], { targetId: 'watch' }],
    ['L02-M13:C01', 'label-connect', ['L02-W01'], { targetId: 'pen:english-label' }],
    ['L02-M13:C02', 'label-connect', ['L02-W02'], { targetId: 'pencil:english-label' }],
    ['L02-M14:C01', 'object-place', ['L02-W03'], { targetId: 'personal-items-label-book:book' }],
    ['L02-M14:C02', 'object-place', ['L02-W04'], { targetId: 'personal-items-label-book:watch' }],
    ['L02-M15:C01', 'relation-reconstruct', ['L01-D03', 'L02-W04'], {
      relationSlotIds: [
        'ownership-question:is', 'ownership-question:this',
        'ownership-question:your', 'ownership-question:watch',
        'ownership-question:punctuation'
      ]
    }],
    ['L02-M15:C02', 'relation-reconstruct', ['L01-D06', 'L01-W09', 'L02-W04'], {
      relationSlotIds: ['owner-answer:it-pronoun', 'owner-answer:watch-referent']
    }],
    ['L02-M16:C01', 'object-place', ['L02-W05'], { targetId: 'coatroom-rack:coat' }],
    ['L02-M16:C02', 'object-place', ['L02-W06'], { targetId: 'coatroom-rack:dress' }],
    ['L02-M17:C01', 'scene-identify', ['L02-W07'], { targetId: 'skirt' }],
    ['L02-M17:C02', 'scene-identify', ['L02-W08'], { targetId: 'shirt' }],
    ['L02-M18:C01', 'label-connect', ['L02-W05'], { targetId: 'coat:english-label' }],
    ['L02-M18:C02', 'label-connect', ['L02-W06'], { targetId: 'dress:english-label' }],
    ['L02-M19:C01', 'object-place', ['L02-W07'], { targetId: 'coatroom-word-slots:skirt' }],
    ['L02-M19:C02', 'object-place', ['L02-W08'], { targetId: 'coatroom-word-slots:shirt' }],
    ['L02-M20:C01', 'scene-identify', ['L02-W09'], { targetId: 'car' }],
    ['L02-M20:C02', 'scene-identify', ['L02-W10'], { targetId: 'house' }],
    ['L02-M21:C01', 'label-connect', ['L02-W09'], { targetId: 'car:english-label' }],
    ['L02-M21:C02', 'label-connect', ['L02-W10'], { targetId: 'house:english-label' }]
  ].map(([challengeRef, interactionPattern, sourceRefs, relation]) => ({
    challengeRef,
    interactionPattern,
    interactionSemantics: { sourceRefs, ...relation }
  }));
  const NCE_U01_INTERACTION_CONTRACT_BY_CHALLENGE = new Map(
    NCE_U01_INTERACTION_CONTRACTS.map(contract => [contract.challengeRef, contract])
  );

  function nceV2InteractionContract(challengeRef) {
    const contract = NCE_U01_INTERACTION_CONTRACT_BY_CHALLENGE.get(challengeRef);
    if (!contract) return {};
    return {
      interactionPattern: contract.interactionPattern,
      interactionSemantics: {
        sourceRefs: [...contract.interactionSemantics.sourceRefs],
        ...(contract.interactionSemantics.targetId
          ? { targetId: contract.interactionSemantics.targetId }
          : {}),
        ...(contract.interactionSemantics.relationSlotIds
          ? { relationSlotIds: [...contract.interactionSemantics.relationSlotIds] }
          : {})
      }
    };
  }

  function nceV2Challenge(result, {
    candidateEntityIds,
    candidateSourceRefs,
    candidateContentRefs,
    candidateSetPolicy,
    answerRule,
    supportKind,
    audioSequence,
    feedbackAudioSequence,
    targetText,
    intentionalPreSubmitSupport = [],
    boundaryContentRefs = [],
    shuffleConstraint
  }) {
    const supportLayers = nceV2SupportLayers(result.challengeRef, supportKind);
    const feedbackTarget = targetText || nceSourceItem(result.sourceRef)?.text || '这一步';
    const interactionContract = nceV2InteractionContract(result.challengeRef);
    return {
      challengeRef: result.challengeRef,
      resultId: result.resultId,
      reviewCellId: result.reviewCellId,
      ...interactionContract,
      sourceRef: result.sourceRef,
      channel: result.channel,
      contextId: result.contextId,
      answerFairness: {
        targetEvidenceChannel: result.channel,
        targetEvidenceSourceRefs: [
          ...(interactionContract.interactionSemantics?.sourceRefs || [])
        ],
        intentionalPreSubmitSupport: intentionalPreSubmitSupport.map(item => ({ ...item }))
      },
      targetText: feedbackTarget,
      correctFeedback: {
        contentId: `NCE-U01-C-FEEDBACK-${result.challengeRef.replace(/[:]/g, '-')}-CORRECT`,
        copy: feedbackTarget
      },
      incorrectFeedback: {
        contentId: `NCE-U01-C-FEEDBACK-${result.challengeRef.replace(/[:]/g, '-')}-WRONG`,
        copy: '这个选择没有解决眼前的问题，看看人物或物品发生了什么。'
      },
      ...(candidateEntityIds ? { candidateEntityIds: [...candidateEntityIds] } : {}),
      ...(candidateSourceRefs ? { candidateSourceRefs: [...candidateSourceRefs] } : {}),
      ...(candidateContentRefs ? { candidateContentRefs: [...candidateContentRefs] } : {}),
      ...(candidateSetPolicy ? { candidateSetPolicy } : {}),
      answerRule,
      supportLayers,
      support: supportLayers.map(layer => layer.copy),
      ...(boundaryContentRefs.length ? { boundaryContentRefs: [...boundaryContentRefs] } : {}),
      ...(shuffleConstraint ? { shuffleConstraint } : {}),
      ...(audioSequence ? { audioSequence } : {}),
      ...(feedbackAudioSequence ? { feedbackAudioSequence } : {})
    };
  }

  const NCE_U01_DIALOGUE_PARTICIPANTS = ['station-keeper', 'handbag-owner'];

  function nceV2PresentationMoment(microtaskId, [
    momentId,
    enterWhen,
    participantEntityIds,
    focusEntityIds,
    visibleLanguageRefs,
    endStateName,
    primaryMotionKind,
    presentationOptions = {}
  ]) {
    const { demonstration, advancePolicy } = presentationOptions;
    const stateId = `${microtaskId}:${momentId}:end`;
    const entityStates = focusEntityIds.map(entityId => ({
      entityId,
      state: endStateName
    }));
    return {
      momentId,
      enterWhen,
      participantEntityIds: [...participantEntityIds],
      focusEntityIds: [...focusEntityIds],
      visibleLanguageRefs: [...visibleLanguageRefs],
      endState: {
        stateId,
        entityStates
      },
      primaryMotion: {
        kind: primaryMotionKind,
        entityIds: [...focusEntityIds]
      },
      reducedMotionEndState: {
        stateId,
        transition: 'immediate',
        entityStates: entityStates.map(state => ({ ...state }))
      },
      ...(advancePolicy ? { advancePolicy } : {}),
      ...(demonstration ? {
        demonstration: {
          ...demonstration,
          sourceRefs: [...demonstration.sourceRefs],
          relationSlotIds: [...demonstration.relationSlotIds]
        }
      } : {})
    };
  }

  const NCE_U01_HANDBAG_PATTERN_DEMONSTRATION = {
    demonstrationId: 'handbag-pattern-demo',
    kind: 'changed-example-model',
    interactionPattern: 'relation-reconstruct',
    sourceRefs: ['L01-D03', 'L01-W07'],
    modelEntityId: 'handbag',
    relationSlotIds: [
      'ownership-question:opening', 'ownership-question:handbag',
      'ownership-question:punctuation'
    ],
    submissionMode: 'instructional-only',
    producesResult: false,
    affectsAdventureHearts: false,
    producesLearningEvidence: false,
    countsTowardProgress: false
  };

  const NCE_U01_PRESENTATION_MOMENT_SPECS = {
    'L01-M07': [
      ['story-briefing', { kind: 'microtask-start' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag'], ['L01-I01'], 'story-briefing-visible', 'focus-shift'],
      ['seven-line-listen', { kind: 'step-active', stepId: 'L01-M07:S01' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['station-keeper', 'handbag-owner', 'handbag'], ['L01-D01', 'L01-D02', 'L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07'], 'current-speaker-and-line-visible', 'line-follow'],
      ['listen-complete', { kind: 'microtask-complete' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag-owner', 'handbag'], ['L01-D01', 'L01-D02', 'L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07'], 'first-listen-complete', 'focus-shift', { advancePolicy: 'explicit-child-continue' }]
    ],
    'L01-M08': [
      ['owner-recall', { kind: 'challenge-active', challengeRef: 'L01-M08:C01' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag'], ['L01-Q01'], 'owner-choice-active', 'focus-shift'],
      ['handbag-audio-find', { kind: 'challenge-active', challengeRef: 'L01-M08:C02' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag', 'book', 'watch'], ['L01-W07'], 'handbag-audio-choice-active', 'focus-shift'],
      ['pending-return', { kind: 'microtask-complete' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag'], ['L01-W07'], 'handbag-awaiting-return', 'settle-item']
    ],
    'L01-M09': [
      ['attention-intent', { kind: 'challenge-active', challengeRef: 'L01-M09:C01' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag-owner'], ['L01-D01'], 'attention-choice-active', 'speaker-shift'],
      ['call-and-reply', { kind: 'challenge-completed', challengeRef: 'L01-M09:C01' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['station-keeper', 'handbag-owner'], ['L01-D01', 'L01-D02'], 'owner-turned-and-replied', 'speaker-shift']
    ],
    'L01-M10': [
      ['counter-to-tracks', { kind: 'microtask-start' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag'], ['L01-D03'], 'counter-tracks-open', 'counter-transform'],
      ['handbag-question-build', { kind: 'challenge-active', challengeRef: 'L01-M10:C01' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag'], ['NCE-U01-C-BLOCK-IS-THIS-YOUR', 'NCE-U01-C-BLOCK-HANDBAG', 'NCE-U01-C-PUNCT-QUESTION'], 'handbag-question-tracks-active', 'focus-shift'],
      ['repair-choice', { kind: 'challenge-active', challengeRef: 'L01-M10:C02' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag-owner'], ['L01-D04'], 'repair-choice-active', 'speaker-shift'],
      ['question-replay', { kind: 'challenge-completed', challengeRef: 'L01-M10:C02' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['station-keeper', 'handbag-owner', 'handbag'], ['L01-D04', 'L01-D05'], 'question-replayed-after-repair', 'speaker-shift']
    ],
    'L01-M11': [
      ['owner-confirm', { kind: 'step-active', stepId: 'L01-M11:S01' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag-owner', 'handbag'], ['L01-D06'], 'owner-confirmation-playing', 'speaker-shift'],
      ['handbag-return-label', { kind: 'challenge-active', challengeRef: 'L01-M11:C01' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag'], ['L01-W07'], 'handbag-return-label-active', 'focus-shift'],
      ['thanks-choice', { kind: 'challenge-active', challengeRef: 'L01-M11:C02' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag-owner'], ['L01-D07'], 'thanks-choice-active', 'focus-shift'],
      ['single-handoff', { kind: 'step-completed', stepId: 'L01-M11:S03' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag', 'handbag-owner'], ['L01-D07'], 'handbag-with-owner-after-thanks', 'single-handoff', { advancePolicy: 'explicit-child-continue' }]
    ],
    'L01-M12': [
      ['full-role-enactment', { kind: 'step-active', stepId: 'L01-M12:S01' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['station-keeper', 'handbag-owner', 'handbag'], ['L01-D01', 'L01-D02', 'L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07'], 'full-role-enactment-active', 'speaker-shift']
    ],
    'L02-M11': [
      ['tray-intro', { kind: 'microtask-start' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-I01'], 'personal-items-tray-open', 'focus-shift'],
      ['pen-audio-find', { kind: 'challenge-active', challengeRef: 'L02-M11:C01' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-W01'], 'pen-audio-choice-active', 'focus-shift'],
      ['pen-settle', { kind: 'challenge-completed', challengeRef: 'L02-M11:C01' }, [], ['pen'], ['L02-W01'], 'pen-on-tray', 'settle-item'],
      ['pencil-audio-find', { kind: 'challenge-active', challengeRef: 'L02-M11:C02' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-W02'], 'pencil-audio-choice-active', 'focus-shift'],
      ['pencil-settle', { kind: 'challenge-completed', challengeRef: 'L02-M11:C02' }, [], ['pen', 'pencil'], ['L02-W01', 'L02-W02'], 'pen-and-pencil-on-tray', 'settle-item']
    ],
    'L02-M12': [
      ['book-audio-find', { kind: 'challenge-active', challengeRef: 'L02-M12:C01' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-W03'], 'book-audio-choice-active', 'focus-shift'],
      ['book-settle', { kind: 'challenge-completed', challengeRef: 'L02-M12:C01' }, [], ['book'], ['L02-W03'], 'book-on-tray', 'settle-item'],
      ['watch-audio-find', { kind: 'challenge-active', challengeRef: 'L02-M12:C02' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-W04'], 'watch-audio-choice-active', 'focus-shift'],
      ['watch-settle', { kind: 'challenge-completed', challengeRef: 'L02-M12:C02' }, [], ['watch'], ['L02-W04'], 'watch-on-tray', 'settle-item'],
      ['tray-complete', { kind: 'microtask-complete' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-W01', 'L02-W02', 'L02-W03', 'L02-W04'], 'personal-items-tray-complete', 'focus-shift']
    ],
    'L02-M13': [
      ['pen-word-label', { kind: 'challenge-active', challengeRef: 'L02-M13:C01' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-W01'], 'pen-label-choice-active', 'focus-shift'],
      ['pen-pronunciation', { kind: 'challenge-completed', challengeRef: 'L02-M13:C01' }, [], ['pen'], ['L02-W01'], 'pen-labelled-and-pronounced', 'settle-item'],
      ['pencil-word-label', { kind: 'challenge-active', challengeRef: 'L02-M13:C02' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-W02'], 'pencil-label-choice-active', 'focus-shift'],
      ['pencil-pronunciation', { kind: 'challenge-completed', challengeRef: 'L02-M13:C02' }, [], ['pencil'], ['L02-W02'], 'pencil-labelled-and-pronounced', 'settle-item']
    ],
    'L02-M14': [
      ['book-word-label', { kind: 'challenge-active', challengeRef: 'L02-M14:C01' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-W03'], 'book-label-choice-active', 'focus-shift'],
      ['book-pronunciation', { kind: 'challenge-completed', challengeRef: 'L02-M14:C01' }, [], ['book'], ['L02-W03'], 'book-labelled-and-pronounced', 'settle-item'],
      ['watch-word-label', { kind: 'challenge-active', challengeRef: 'L02-M14:C02' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-W04'], 'watch-label-choice-active', 'focus-shift'],
      ['watch-pronunciation', { kind: 'challenge-completed', challengeRef: 'L02-M14:C02' }, [], ['watch'], ['L02-W04'], 'watch-labelled-and-pronounced', 'settle-item'],
      ['checklist-complete', { kind: 'microtask-complete' }, [], ['pen', 'pencil', 'book', 'watch'], ['L02-W01', 'L02-W02', 'L02-W03', 'L02-W04'], 'personal-items-checklist-complete', 'focus-shift']
    ],
    'L02-M15': [
      ['story-to-lab', { kind: 'microtask-start' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['watch'], ['L01-D03'], 'counter-watch-lab-open', 'counter-transform'],
      ['handbag-pattern-demo', { kind: 'microtask-start' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['handbag'], ['NCE-U01-C-BLOCK-IS-THIS-YOUR', 'NCE-U01-C-BLOCK-HANDBAG', 'NCE-U01-C-PUNCT-QUESTION'], 'handbag-question-pattern-modelled', 'relation-link', { demonstration: NCE_U01_HANDBAG_PATTERN_DEMONSTRATION }],
      ['watch-question-build', { kind: 'challenge-active', challengeRef: 'L02-M15:C01' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['watch'], ['NCE-U01-C-BLOCK-IS-CAPITAL', 'NCE-U01-C-BLOCK-THIS', 'NCE-U01-C-BLOCK-YOUR', 'NCE-U01-C-BLOCK-WATCH', 'NCE-U01-C-PUNCT-QUESTION'], 'watch-question-tracks-active', 'focus-shift'],
      ['question-playback', { kind: 'challenge-completed', challengeRef: 'L02-M15:C01' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['watch'], ['NCE-U01-C-Q-WATCH'], 'watch-question-playing', 'focus-shift'],
      ['it-reference', { kind: 'challenge-active', challengeRef: 'L02-M15:C02' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['watch', 'handbag', 'book'], ['L01-D06'], 'it-linked-to-watch', 'relation-link'],
      ['knowledge-layer', { kind: 'microtask-complete' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['watch'], ['NCE-U01-C-KNOWLEDGE-QUESTION', 'NCE-U01-C-KNOWLEDGE-IT'], 'watch-knowledge-layer-open', 'focus-shift']
    ],
    'L02-M16': [
      ['rack-intro', { kind: 'microtask-start' }, [], ['coat', 'dress', 'skirt', 'shirt'], ['L02-I01'], 'coatroom-rack-open', 'focus-shift'],
      ['coat-audio-find', { kind: 'challenge-active', challengeRef: 'L02-M16:C01' }, [], ['coat', 'dress', 'skirt', 'shirt'], ['L02-W05'], 'coat-audio-choice-active', 'focus-shift'],
      ['coat-hang', { kind: 'challenge-completed', challengeRef: 'L02-M16:C01' }, [], ['coat'], ['L02-W05'], 'coat-on-rack', 'settle-item'],
      ['dress-audio-find', { kind: 'challenge-active', challengeRef: 'L02-M16:C02' }, [], ['coat', 'dress', 'skirt', 'shirt'], ['L02-W06'], 'dress-audio-choice-active', 'focus-shift'],
      ['dress-hang', { kind: 'challenge-completed', challengeRef: 'L02-M16:C02' }, [], ['coat', 'dress'], ['L02-W05', 'L02-W06'], 'coat-and-dress-on-rack', 'settle-item']
    ],
    'L02-M17': [
      ['skirt-audio-find', { kind: 'challenge-active', challengeRef: 'L02-M17:C01' }, [], ['coat', 'dress', 'skirt', 'shirt'], ['L02-W07'], 'skirt-audio-choice-active', 'focus-shift'],
      ['skirt-hang', { kind: 'challenge-completed', challengeRef: 'L02-M17:C01' }, [], ['skirt'], ['L02-W07'], 'skirt-on-rack', 'settle-item'],
      ['shirt-audio-find', { kind: 'challenge-active', challengeRef: 'L02-M17:C02' }, [], ['coat', 'dress', 'skirt', 'shirt'], ['L02-W08'], 'shirt-audio-choice-active', 'focus-shift'],
      ['shirt-hang', { kind: 'challenge-completed', challengeRef: 'L02-M17:C02' }, [], ['shirt'], ['L02-W08'], 'shirt-on-rack', 'settle-item'],
      ['rack-unlabelled', { kind: 'microtask-complete' }, [], ['coat', 'dress', 'skirt', 'shirt'], ['L02-W05', 'L02-W06', 'L02-W07', 'L02-W08'], 'unlabelled-rack-ready', 'counter-transform']
    ],
    'L02-M18': [
      ['coat-word-label', { kind: 'challenge-active', challengeRef: 'L02-M18:C01' }, [], ['coat', 'dress', 'skirt', 'shirt'], ['L02-W05'], 'coat-label-choice-active', 'focus-shift'],
      ['coat-pronunciation', { kind: 'challenge-completed', challengeRef: 'L02-M18:C01' }, [], ['coat'], ['L02-W05'], 'coat-labelled-and-pronounced', 'settle-item'],
      ['dress-word-label', { kind: 'challenge-active', challengeRef: 'L02-M18:C02' }, [], ['coat', 'dress', 'skirt', 'shirt'], ['L02-W06'], 'dress-label-choice-active', 'focus-shift'],
      ['dress-pronunciation', { kind: 'challenge-completed', challengeRef: 'L02-M18:C02' }, [], ['dress'], ['L02-W06'], 'dress-labelled-and-pronounced', 'settle-item']
    ],
    'L02-M19': [
      ['skirt-word-label', { kind: 'challenge-active', challengeRef: 'L02-M19:C01' }, [], ['coat', 'dress', 'skirt', 'shirt'], ['L02-W07'], 'skirt-label-choice-active', 'focus-shift'],
      ['skirt-pronunciation', { kind: 'challenge-completed', challengeRef: 'L02-M19:C01' }, [], ['skirt'], ['L02-W07'], 'skirt-labelled-and-pronounced', 'settle-item'],
      ['shirt-word-label', { kind: 'challenge-active', challengeRef: 'L02-M19:C02' }, [], ['coat', 'dress', 'skirt', 'shirt'], ['L02-W08'], 'shirt-label-choice-active', 'focus-shift'],
      ['shirt-pronunciation', { kind: 'challenge-completed', challengeRef: 'L02-M19:C02' }, [], ['shirt'], ['L02-W08'], 'shirt-labelled-and-pronounced', 'settle-item'],
      ['coat-return-dialogue', { kind: 'step-active', stepId: 'L02-M19:S02' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['coat', 'handbag-owner'], ['NCE-U01-C-Q-COAT', 'L01-D06'], 'coat-return-dialogue-active', 'speaker-shift'],
      ['coat-handoff', { kind: 'step-completed', stepId: 'L02-M19:S03' }, NCE_U01_DIALOGUE_PARTICIPANTS, ['coat', 'handbag-owner'], ['L01-D07'], 'coat-returned-once', 'single-handoff']
    ],
    'L02-M20': [
      ['car-street-find', { kind: 'challenge-active', challengeRef: 'L02-M20:C01' }, [], ['car', 'house'], ['L02-W09'], 'car-scene-choice-active', 'focus-shift'],
      ['car-scene-confirmed', { kind: 'challenge-completed', challengeRef: 'L02-M20:C01' }, [], ['car'], ['L02-W09'], 'car-scene-confirmed', 'settle-item'],
      ['house-street-find', { kind: 'challenge-active', challengeRef: 'L02-M20:C02' }, [], ['car', 'house'], ['L02-W10'], 'house-scene-choice-active', 'focus-shift'],
      ['house-scene-confirmed', { kind: 'challenge-completed', challengeRef: 'L02-M20:C02' }, [], ['house'], ['L02-W10'], 'house-scene-confirmed', 'settle-item']
    ],
    'L02-M21': [
      ['car-word-label', { kind: 'challenge-active', challengeRef: 'L02-M21:C01' }, ['handbag-owner'], ['car', 'house'], ['L02-W09'], 'car-label-choice-active', 'focus-shift'],
      ['car-pronunciation', { kind: 'challenge-completed', challengeRef: 'L02-M21:C01' }, ['handbag-owner'], ['car'], ['L02-W09'], 'car-label-pronounced', 'settle-item'],
      ['owner-boards-car', { kind: 'step-completed', stepId: 'L02-M21:S01' }, ['handbag-owner'], ['handbag-owner', 'car'], ['L02-W09'], 'owner-boarded-car', 'owner-boards-car'],
      ['house-word-label', { kind: 'challenge-active', challengeRef: 'L02-M21:C02' }, ['handbag-owner'], ['car', 'house'], ['L02-W10'], 'house-label-choice-active', 'focus-shift'],
      ['house-pronunciation', { kind: 'challenge-completed', challengeRef: 'L02-M21:C02' }, ['handbag-owner'], ['house'], ['L02-W10'], 'house-label-pronounced', 'settle-item'],
      ['car-arrives-home', { kind: 'step-completed', stepId: 'L02-M21:S02' }, ['handbag-owner'], ['handbag-owner', 'car', 'house'], ['L02-W09', 'L02-W10'], 'owner-arrived-home', 'car-arrives-home'],
      ['save-readback', { kind: 'phase', phase: 'unit-verifying' }, ['handbag-owner'], ['handbag-owner', 'house'], ['L02-W09', 'L02-W10'], 'owner-home-arrival-verified', 'save-readback']
    ]
  };

  function nceV2PresentationMoments(microtaskId) {
    return (NCE_U01_PRESENTATION_MOMENT_SPECS[microtaskId] || [])
      .map(spec => nceV2PresentationMoment(microtaskId, spec));
  }

  function nceV2PropSurface(sceneMode) {
    if (sceneMode.startsWith('coatroom')) return 'coat-rack';
    if (sceneMode.startsWith('homeward')) return 'story-counter';
    if (sceneMode.startsWith('personal-items')) return 'workbench-surface';
    return 'counter-surface';
  }

  function nceV2Task({
    microtaskId,
    lessonId,
    title,
    stepLabel,
    sceneMode,
    prompt,
    completedFeedback,
    nextCue,
    estimatedSeconds,
    exposureRefs,
    evidenceRefs,
    sourceContacts,
    targetResults = [],
    steps,
    characterEntityIds = [],
    sceneEntityIds = [],
    checkpointFacts = [],
    requiredFactIds = [],
    restStop,
    storyAction,
    skipPolicy,
    growthBoundary = 'none',
    knowledgeCardRefs = [],
    candidateLabels = {}
  }) {
    const normalizedSceneMode = [
      'watch-question-and-it'
    ].includes(sceneMode)
      ? 'grammar-lab'
      : (sceneMode.startsWith('personal-items') || sceneMode.startsWith('coatroom')
        ? 'object-workbench'
        : (sceneMode.startsWith('homeward')
          ? 'story-journey'
          : 'dialogue-stage'));
    const authoredTask = nceMicrotask({
      microtaskId, lessonId, title, stepLabel, sceneMode: normalizedSceneMode, prompt,
      completedFeedback, nextCue, estimatedSeconds, exposureRefs, evidenceRefs,
      targetResults, steps, characterEntityIds, sceneEntityIds,
      checkpointFacts, requiredFactIds, growthBoundary
    });
    return {
      ...authoredTask,
      experienceRevision: NCE_U01_V2_REVISION,
      navigationTitle: title,
      contentId: `NCE-U01-C-STAGE-${microtaskId}`,
      presentation: {
        ...authoredTask.presentation,
        characterEntityIds: [...characterEntityIds],
        sceneEntityIds: [...sceneEntityIds],
        sceneVariant: sceneMode,
        visualMoment: sceneMode,
        propSurface: nceV2PropSurface(sceneMode),
        ...(Object.keys(candidateLabels).length
          ? { candidateLabels: { ...candidateLabels } }
          : {}),
        moments: nceV2PresentationMoments(microtaskId),
        viewportPolicy: 'single-viewport-responsive',
        scrollPolicy: {
          horizontal: 'forbidden',
          nestedCard: 'forbidden',
          vertical: 'viewport-fallback-only'
        }
      },
      sourceContacts,
      ...(restStop ? { restStop, restStopId: restStop.restStopId } : {}),
      ...(storyAction ? { storyAction } : {}),
      ...(skipPolicy ? { skipPolicy: { ...skipPolicy } } : {}),
      ...(knowledgeCardRefs.length ? { knowledgeCardRefs } : {})
    };
  }

  function nceV2WordTask({
    microtaskId,
    lessonId,
    title,
    stepLabel,
    sceneMode,
    prompt,
    completedFeedback,
    nextCue,
    estimatedSeconds,
    sourceRefs,
    channel,
    contextId,
    reviewContextId,
    candidateEntityIds,
    candidateSetPolicy,
    characterEntityIds,
    sceneEntityIds,
    checkpointFacts,
    extraExposureRefs = [],
    extraSourceContacts = []
  }) {
    const stepId = `${microtaskId}:S01`;
    const results = sourceRefs.map((sourceRef, index) => nceV2Result({
      resultId: `NCE-U01-T01:${sourceRef}:${channel}`,
      microtaskId,
      challengeOrdinal: index + 1,
      stepId,
      targetNumber: 1,
      sourceRef,
      channel,
      contextId,
      reviewContextId,
      evidenceMode: channel === 'audio-form-supported'
        ? 'audio-form-object-match'
        : 'word-form-object-match',
      variantId: sourceRef
    }));
    const challenges = results.map(result => nceV2Challenge(result, {
      candidateEntityIds,
      ...(candidateSetPolicy ? { candidateSetPolicy } : {}),
      answerRule: {
        type: 'match-entity',
        acceptedSourceRef: result.sourceRef,
        acceptedEntityId: NCE_WORD_ENTITY_BY_SOURCE[result.sourceRef]
      },
      supportKind: channel === 'audio-form-supported' ? 'audio' : 'form',
      ...(channel === 'audio-form-supported'
        ? {
            audioSequence: nceV2AudioSequence(`${result.challengeRef}:prompt`, [result.sourceRef]),
            intentionalPreSubmitSupport: [{
              sourceRef: result.sourceRef,
              surface: 'audio-word-plaque'
            }]
          }
        : {
            feedbackAudioSequence: nceV2AudioSequence(`${result.challengeRef}:feedback`, [result.sourceRef]),
            intentionalPreSubmitSupport: [{
              sourceRef: result.sourceRef,
              surface: 'english-word-plaque'
            }]
          })
    }));
    return nceV2Task({
      microtaskId, lessonId, title, stepLabel, sceneMode, prompt,
      completedFeedback, nextCue, estimatedSeconds,
      exposureRefs: [...new Set([...sourceRefs, ...extraExposureRefs])],
      evidenceRefs: [...sourceRefs],
      sourceContacts: [
        ...sourceRefs.map(sourceRef => ({ sourceRef, contactMode: 'explicit-word-object' })),
        ...extraSourceContacts
      ],
      targetResults: results,
      steps: [{
        stepId,
        contentId: `NCE-U01-C-PROMPT-${microtaskId}-S01`,
        kind: 'match-entity-batch',
        submissionMode: 'formal',
        affectsAdventureHearts: true,
        prompt,
        channel,
        candidatePresentation: 'neutral-before-submit',
        textVisibility: 'always-visible',
        preSubmitAudioPolicy: channel === 'word-form' ? 'none' : 'required-ended',
        audioResponsePresentation: channel === 'audio-form-supported'
          ? 'shared-locked-until-ended'
          : 'shared-optional-replay',
        challengeSourceRefs: [...sourceRefs],
        optionEntityIds: [...candidateEntityIds],
        answerRule: {
          type: 'match-entity',
          pairs: Object.fromEntries(sourceRefs.map(sourceRef => (
            [sourceRef, NCE_WORD_ENTITY_BY_SOURCE[sourceRef]]
          )))
        },
        challenges
      }],
      characterEntityIds, sceneEntityIds, checkpointFacts,
      requiredFactIds: results.map(result => `${result.resultId}:recorded`)
    });
  }

  function nceV2SequentialWordTask({ stepPrompts, ...wordTaskArgs }) {
    const task = nceV2WordTask({
      ...wordTaskArgs,
      prompt: stepPrompts[0]
    });
    const templateStep = task.steps[0];
    const steps = templateStep.challenges.map((challenge, index) => {
      const ordinal = String(index + 1).padStart(2, '0');
      const stepId = `${wordTaskArgs.microtaskId}:S${ordinal}`;
      return {
        ...templateStep,
        stepId,
        contentId: `NCE-U01-C-PROMPT-${wordTaskArgs.microtaskId}-S${ordinal}`,
        prompt: stepPrompts[index],
        challengeSourceRefs: [challenge.sourceRef],
        answerRule: {
          type: 'match-entity',
          pairs: {
            [challenge.sourceRef]: challenge.answerRule.acceptedEntityId
          }
        },
        challenges: [challenge]
      };
    });
    const stepByChallengeRef = new Map(steps.map(step => (
      [step.challenges[0].challengeRef, step.stepId]
    )));
    return {
      ...task,
      targetResults: task.targetResults.map(result => ({
        ...result,
        stepId: stepByChallengeRef.get(result.challengeRef)
      })),
      steps
    };
  }

  const lesson1FirstListenContacts = [
    { sourceRef: 'L01-I01', contactMode: 'explicit-display' },
    ...Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`).flatMap(sourceRef => [
      { sourceRef, contactMode: 'audio-text', utteranceSourceRef: sourceRef },
      ...LESSON1_UTTERANCE_EMBEDDED_REFS[sourceRef].map(embeddedSourceRef => ({
        sourceRef: embeddedSourceRef,
        contactMode: 'utterance-embedded',
        utteranceSourceRef: sourceRef
      }))
    ])
  ];

  const l01m08Owner = nceV2Result({
    resultId: 'NCE-U01-T04:L01-M08:owner', microtaskId: 'L01-M08', challengeOrdinal: 1,
    stepId: 'L01-M08:S01', targetNumber: 4, sourceRef: 'L01-D06', relatedSourceRefs: ['L01-Q01'],
    channel: 'meaning', contextId: 'handbag-counter', reviewContextId: 'review-help-desk-exchange',
    evidenceMode: 'owner-identification', variantId: 'handbag-owner'
  });
  const l01m08HandbagAudio = nceV2Result({
    resultId: 'NCE-U01-T01:L01-W07:audio-form-supported',
    microtaskId: 'L01-M08', challengeOrdinal: 2, stepId: 'L01-M08:S02',
    targetNumber: 1, sourceRef: 'L01-W07', channel: 'audio-form-supported',
    contextId: 'handbag-counter', reviewContextId: 'review-schoolbag-check',
    evidenceMode: 'audio-form-object-match', variantId: 'L01-W07'
  });
  const l01m11HandbagForm = nceV2Result({
    resultId: 'NCE-U01-T01:L01-W07:word-form',
    microtaskId: 'L01-M11', challengeOrdinal: 1, stepId: 'L01-M11:S02',
    targetNumber: 1, sourceRef: 'L01-W07', channel: 'word-form',
    contextId: 'handbag-counter', reviewContextId: 'review-schoolbag-check',
    evidenceMode: 'word-form-object-match', variantId: 'L01-W07'
  });
  const l01m09Attention = nceV2Result({
    resultId: 'NCE-U01-T02:L01-M09:attention',
    microtaskId: 'L01-M09', challengeOrdinal: 1, stepId: 'L01-M09:S01',
    targetNumber: 2, sourceRef: 'L01-D01', relatedSourceRefs: ['L01-N01'],
    channel: 'meaning', contextId: 'handbag-counter', reviewContextId: 'review-help-desk-exchange',
    evidenceMode: 'polite-attention-choice', variantId: 'station-keeper'
  });
  const l01m10Question = nceV2Result({
    resultId: 'NCE-U01-T04:L01-M10:handbag-question',
    microtaskId: 'L01-M10', challengeOrdinal: 1, stepId: 'L01-M10:S01',
    targetNumber: 4, sourceRef: 'L01-D03',
    contentRef: 'NCE-U01-C-BLOCK-IS-THIS-YOUR',
    relatedSourceRefs: ['L01-W07'], channel: 'assembly', contextId: 'handbag-counter',
    reviewContextId: 'review-help-desk-exchange', evidenceMode: 'ownership-exchange',
    variantId: 'handbag-question'
  });
  const l01m10Repair = nceV2Result({
    resultId: 'NCE-U01-T03:L01-M10:repair',
    microtaskId: 'L01-M10', challengeOrdinal: 2, stepId: 'L01-M10:S02',
    targetNumber: 3, sourceRef: 'L01-D04', relatedSourceRefs: ['L01-N02'],
    channel: 'meaning', contextId: 'handbag-counter', reviewContextId: 'review-help-desk-exchange',
    evidenceMode: 'communication-repair-choice', variantId: 'handbag-repair'
  });
  const l01m11Thanks = nceV2Result({
    resultId: 'NCE-U01-T05:L01-M11:thanks',
    microtaskId: 'L01-M11', challengeOrdinal: 2, stepId: 'L01-M11:S04',
    targetNumber: 5, sourceRef: 'L01-D07', channel: 'meaning',
    contextId: 'handbag-counter', reviewContextId: 'review-help-desk-exchange',
    evidenceMode: 'thanks-in-context', variantId: 'handbag-return'
  });

  const LESSON1_V2_COMPLETE_MICROTASKS = [
    nceV2Task({
      microtaskId: 'L01-M07', lessonId: 'lesson1', title: '听听是谁丢了手提包',
      stepLabel: '手提包归还 · 1 / 5', sceneMode: 'text-supported-first-listen',
      prompt: '先听完七句话，再找手提包的主人',
      completedFeedback: '七句话都听完了，现在去找真正的主人。',
      nextCue: { entityId: 'handbag', label: '找到主人' }, estimatedSeconds: 90,
      exposureRefs: [...new Set(lesson1FirstListenContacts.map(contact => contact.sourceRef))],
      evidenceRefs: [], sourceContacts: lesson1FirstListenContacts,
      steps: [{
        stepId: 'L01-M07:S01', contentId: 'NCE-U01-C-PROMPT-L01-M07-S01',
        kind: 'audio-sequence', submissionMode: 'free', affectsAdventureHearts: false,
        prompt: '客人进门了，边看七句话边听他们说什么',
        textbookInstructionSourceRef: 'L01-I01',
        audioSourceRefs: Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`),
        audioSequence: nceV2AudioSequence('L01-M07:S01:dialogue',
          Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`)),
        audioResponsePresentation: 'independent-listen',
        gate: AUDIO_ENDED_GATE, textVisibility: 'always-visible',
        currentSegmentHighlight: true
      }],
      characterEntityIds: LOST_HANDBAG_CAST, sceneEntityIds: ['handbag'],
      requiredFactIds: ['lesson1-dialogue-ended'],
      checkpointFacts: ['lesson1-dialogue-first-listen-complete']
    }),
    nceV2Task({
      microtaskId: 'L01-M08', lessonId: 'lesson1', title: '柜台边的新线索',
      stepLabel: '手提包归还 · 2 / 5', sceneMode: 'handbag-owner-and-audio',
      prompt: '听完问题，点一下应该回应的人物。',
      completedFeedback: '主人找到了，手提包已经放到待归还的位置。',
      nextCue: { entityId: 'handbag', label: '礼貌叫住她' }, estimatedSeconds: 65,
      exposureRefs: ['L01-Q01', 'L01-D06', 'L01-W07'],
      evidenceRefs: ['L01-D06', 'L01-W07'],
      sourceContacts: [
        { sourceRef: 'L01-Q01', contactMode: 'explicit-display' },
        { sourceRef: 'L01-D06', contactMode: 'retrieval-cue' },
        { sourceRef: 'L01-W07', contactMode: 'explicit-word-object' }
      ],
      targetResults: [l01m08Owner, l01m08HandbagAudio],
      steps: [
        {
          stepId: 'L01-M08:S01', contentId: 'NCE-U01-C-PROMPT-L01-M08-S01',
          kind: 'select-entity', submissionMode: 'formal', affectsAdventureHearts: true,
          prompt: 'Whose handbag is it?', promptSourceRef: 'L01-Q01',
          actionInstruction: '听完问题，点一下应该回应的人物。',
          candidatePresentation: 'neutral-before-submit',
          optionEntityIds: ['station-keeper', 'handbag-owner'],
          answerRule: { type: 'select-one', acceptedEntityIds: ['handbag-owner'] },
          challenges: [nceV2Challenge(l01m08Owner, {
            candidateEntityIds: ['station-keeper', 'handbag-owner'],
            candidateSetPolicy: 'authentic-story-participants',
            answerRule: { type: 'select-one', acceptedEntityId: 'handbag-owner' },
            supportKind: 'owner',
            intentionalPreSubmitSupport: [{
              sourceRef: 'L01-Q01',
              surface: 'english-question'
            }]
          })]
        },
        {
          stepId: 'L01-M08:S02', contentId: 'NCE-U01-C-PROMPT-L01-M08-S02',
          kind: 'match-entity-batch', submissionMode: 'formal', affectsAdventureHearts: true,
          prompt: '听一听，点中声音说的物品。', channel: 'audio-form-supported',
          candidatePresentation: 'neutral-before-submit',
          textVisibility: 'always-visible', preSubmitAudioPolicy: 'required-ended',
          audioResponsePresentation: 'shared-locked-until-ended',
          challengeSourceRefs: ['L01-W07'], optionEntityIds: ['handbag', 'book', 'watch'],
          answerRule: { type: 'match-entity', pairs: { 'L01-W07': 'handbag' } },
          challenges: [nceV2Challenge(l01m08HandbagAudio, {
            candidateEntityIds: ['handbag', 'book', 'watch'],
            answerRule: { type: 'match-entity', acceptedSourceRef: 'L01-W07', acceptedEntityId: 'handbag' },
            supportKind: 'audio',
            audioSequence: nceV2AudioSequence('L01-M08:C02:prompt', ['L01-W07']),
            intentionalPreSubmitSupport: [{
              sourceRef: 'L01-W07',
              surface: 'audio-word-plaque'
            }]
          })]
        }
      ],
      candidateLabels: {
        'station-keeper': '招领员',
        'handbag-owner': '女顾客'
      },
      characterEntityIds: LOST_HANDBAG_CAST, sceneEntityIds: ['handbag'],
      requiredFactIds: [`${l01m08Owner.resultId}:recorded`, `${l01m08HandbagAudio.resultId}:recorded`],
      checkpointFacts: ['handbag-owner-identified', 'handbag-awaiting-return']
    }),
    nceV2Task({
      microtaskId: 'L01-M09', lessonId: 'lesson1', title: '礼貌地叫住她',
      stepLabel: '手提包归还 · 3 / 5', sceneMode: 'polite-attention-exchange',
      prompt: '替招领员礼貌叫住手提包主人',
      completedFeedback: '她停下来了，也回应了招领员。',
      nextCue: { entityId: 'handbag', label: '问清归属' }, estimatedSeconds: 45,
      exposureRefs: ['L01-D01', 'L01-D02', 'L01-N01'],
      evidenceRefs: ['L01-D01'],
      sourceContacts: [
        { sourceRef: 'L01-N01', contactMode: 'contextualized-note', utteranceSourceRef: 'L01-D01' },
        { sourceRef: 'L01-D01', contactMode: 'textbook-turn-choice' },
        { sourceRef: 'L01-D02', contactMode: 'automatic-response' }
      ],
      targetResults: [l01m09Attention],
      steps: [
        {
          stepId: 'L01-M09:S01', contentId: 'NCE-U01-C-PROMPT-L01-M09-S01',
          kind: 'select-one', submissionMode: 'formal', affectsAdventureHearts: true,
          prompt: '礼貌叫住她，应该怎么说？',
          optionSourceRefs: ['L01-D01', 'L01-D04', 'L01-D07'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D01' },
          challenges: [nceV2Challenge(l01m09Attention, {
            candidateSourceRefs: ['L01-D01', 'L01-D04', 'L01-D07'],
            answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D01' }, supportKind: 'expression',
            feedbackAudioSequence: nceV2AudioSequence('L01-M09:C01:feedback', ['L01-D01', 'L01-D02'])
          })]
        }
      ],
      characterEntityIds: LOST_HANDBAG_CAST, sceneEntityIds: ['handbag'],
      requiredFactIds: [`${l01m09Attention.resultId}:recorded`],
      checkpointFacts: ['station-keeper-got-attention']
    }),
    nceV2Task({
      microtaskId: 'L01-M10', lessonId: 'lesson1', title: '把问题问清楚',
      stepLabel: '手提包归还 · 4 / 5', sceneMode: 'ownership-question-and-repair',
      prompt: '组织归属问句，再帮没听清的她请求重说',
      completedFeedback: '归属问句问清楚了，交流也顺利修复。',
      nextCue: { entityId: 'handbag', label: '归还手提包' }, estimatedSeconds: 85,
      exposureRefs: ['L01-D03', 'L01-D04', 'L01-D05', 'L01-N02', 'L01-W07'],
      evidenceRefs: ['L01-D03', 'L01-D04'],
      sourceContacts: [
        { sourceRef: 'L01-D03', contactMode: 'language-chunk-assembly' },
        { sourceRef: 'L01-D04', contactMode: 'textbook-turn-choice' },
        { sourceRef: 'L01-N02', contactMode: 'contextualized-note', utteranceSourceRef: 'L01-D04' },
        { sourceRef: 'L01-D05', contactMode: 'automatic-repeated-turn' },
        { sourceRef: 'L01-W07', contactMode: 'utterance-embedded', utteranceSourceRef: 'L01-D03' }
      ],
      targetResults: [l01m10Question, l01m10Repair],
      steps: [
        {
          stepId: 'L01-M10:S01', contentId: 'NCE-U01-C-PROMPT-L01-M10-S01',
          kind: 'ordered-blocks', submissionMode: 'formal', affectsAdventureHearts: true,
          prompt: '礼貌确认，这是不是对方正在找的物品。',
          blockContentRefs: ['NCE-U01-C-BLOCK-IS-THIS-YOUR', 'NCE-U01-C-BLOCK-HANDBAG', 'NCE-U01-C-PUNCT-QUESTION'],
          answerRule: { type: 'ordered-blocks', acceptedOrder: ['NCE-U01-C-BLOCK-IS-THIS-YOUR', 'NCE-U01-C-BLOCK-HANDBAG', 'NCE-U01-C-PUNCT-QUESTION'] },
          challenges: [nceV2Challenge(l01m10Question, {
            candidateContentRefs: ['NCE-U01-C-BLOCK-IS-THIS-YOUR', 'NCE-U01-C-BLOCK-HANDBAG', 'NCE-U01-C-PUNCT-QUESTION'],
            answerRule: { type: 'ordered-blocks', acceptedOrder: ['NCE-U01-C-BLOCK-IS-THIS-YOUR', 'NCE-U01-C-BLOCK-HANDBAG', 'NCE-U01-C-PUNCT-QUESTION'] },
            supportKind: 'structure', feedbackAudioSequence: nceV2AudioSequence('L01-M10:C01:feedback', ['L01-D03'])
          })]
        },
        {
          stepId: 'L01-M10:S02', contentId: 'NCE-U01-C-PROMPT-L01-M10-S02',
          kind: 'select-one', submissionMode: 'formal', affectsAdventureHearts: true,
          prompt: '她没听清，应该怎么说？',
          optionSourceRefs: ['L01-D04', 'L01-D01', 'L01-D07'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D04' },
          challenges: [nceV2Challenge(l01m10Repair, {
            candidateSourceRefs: ['L01-D04', 'L01-D01', 'L01-D07'],
            answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D04' }, supportKind: 'expression',
            feedbackAudioSequence: nceV2AudioSequence('L01-M10:C02:feedback', ['L01-D04', 'L01-D05'])
          })]
        }
      ],
      characterEntityIds: LOST_HANDBAG_CAST, sceneEntityIds: ['handbag'],
      requiredFactIds: [`${l01m10Question.resultId}:recorded`, `${l01m10Repair.resultId}:recorded`],
      checkpointFacts: ['handbag-question-asked', 'repair-expression-used']
    }),
    nceV2Task({
      microtaskId: 'L01-M11', lessonId: 'lesson1', title: '核对物品挂牌',
      stepLabel: '手提包归还 · 5 / 5', sceneMode: 'single-handbag-return',
      prompt: '听她确认，归还一次手提包，再替她道谢',
      completedFeedback: '手提包已经真正回到主人手里，Lesson 1 保存完成。',
      nextCue: { entityId: 'pen', label: '继续核对随身物品' }, estimatedSeconds: 85,
      exposureRefs: ['L01-D06', 'L01-W07', 'L01-D07'], evidenceRefs: ['L01-W07', 'L01-D07'],
      sourceContacts: [
        { sourceRef: 'L01-D06', contactMode: 'automatic-confirmation' },
        { sourceRef: 'L01-W07', contactMode: 'explicit-word-object' },
        { sourceRef: 'L01-D07', contactMode: 'textbook-turn-choice' }
      ],
      targetResults: [l01m11HandbagForm, l01m11Thanks],
      steps: [
        {
          stepId: 'L01-M11:S01', contentId: 'NCE-U01-C-PROMPT-L01-M11-S01',
          kind: 'audio-sequence', submissionMode: 'free', affectsAdventureHearts: false,
          prompt: '听她确认这是自己的手提包', audioSourceRefs: ['L01-D06'],
          audioSequence: nceV2AudioSequence('L01-M11:S01:confirm', ['L01-D06']),
          audioResponsePresentation: 'independent-listen',
          gate: AUDIO_ENDED_GATE, textVisibility: 'always-visible'
        },
        {
          stepId: 'L01-M11:S02', contentId: 'NCE-U01-C-PROMPT-L01-M11-S02',
          kind: 'select-one', submissionMode: 'formal', affectsAdventureHearts: true,
          prompt: '看一看场景中的物品，选择对应的英文名称。',
          optionSourceRefs: ['L01-W07', 'L01-W01', 'L01-W08'],
          optionPresentation: 'word-labels',
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-W07' },
          challenges: [nceV2Challenge(l01m11HandbagForm, {
            candidateSourceRefs: ['L01-W07', 'L01-W01', 'L01-W08'],
            answerRule: { type: 'select-one', acceptedSourceRef: 'L01-W07' },
            supportKind: 'form',
            feedbackAudioSequence: nceV2AudioSequence('L01-M11:C01:feedback', ['L01-W07']),
            intentionalPreSubmitSupport: [{
              sourceRef: 'L01-W07',
              surface: 'english-word-plaque'
            }]
          })]
        },
        {
          stepId: 'L01-M11:S04', contentId: 'NCE-U01-C-PROMPT-L01-M11-S04',
          kind: 'select-one', submissionMode: 'formal', affectsAdventureHearts: true,
          prompt: '她拿回手提包后，应该说什么？',
          optionSourceRefs: ['L01-D07', 'L01-D04', 'L01-D01'],
          answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D07' },
          challenges: [nceV2Challenge(l01m11Thanks, {
            candidateSourceRefs: ['L01-D07', 'L01-D04', 'L01-D01'],
            answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D07' }, supportKind: 'expression',
            feedbackAudioSequence: nceV2AudioSequence('L01-M11:C02:feedback', ['L01-D07'])
          })]
        },
        {
          stepId: 'L01-M11:S03', contentId: 'NCE-U01-C-PROMPT-L01-M11-S03',
          kind: 'perform-action', submissionMode: 'story', affectsAdventureHearts: false,
          prompt: '点击手提包主人，把手提包交给她', entityIds: ['handbag'], targetEntityIds: ['handbag-owner'],
          actionInstruction: '点击手提包主人，把手提包交给她',
          storesFactId: 'handbag-return-action',
          answerRule: { type: 'perform-action', action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner' },
          feedbackAudioSourceRef: 'L01-D07',
          feedbackAudioSequence: nceV2AudioSequence('L01-M11:S03:thanks', ['L01-D07'])
        }
      ],
      characterEntityIds: LOST_HANDBAG_CAST, sceneEntityIds: ['handbag'],
      requiredFactIds: [
        `${l01m11HandbagForm.resultId}:recorded`,
        'handbag-return-action',
        `${l01m11Thanks.resultId}:recorded`
      ],
      checkpointFacts: ['handbag-with-owner', 'lesson1-complete'],
      storyAction: { actionId: 'handbag-return', action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner', maxOccurrences: 1 }
    }),
    nceV2Task({
      microtaskId: 'L01-M12', lessonId: 'lesson1', title: '角色扮演',
      stepLabel: 'Lesson 1 · 完整角色演练', sceneMode: 'full-role-enactment',
      prompt: '选择想扮演的角色，完整演完七句',
      completedFeedback: '两个角色都完整演过了，Lesson 1 已保存。',
      nextCue: { entityId: 'pen', label: '继续核对随身物品' }, estimatedSeconds: 210,
      exposureRefs: Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`),
      evidenceRefs: [],
      sourceContacts: Array.from({ length: 7 }, (_, index) => ({
        sourceRef: `L01-D0${index + 1}`, contactMode: 'full-role-enactment'
      })),
      targetResults: [],
      steps: [{
        stepId: 'L01-M12:S01', contentId: 'NCE-U01-C-PROMPT-L01-M12-S01',
        kind: 'role-enactment', submissionMode: 'required-practice', affectsAdventureHearts: false,
        prompt: '先选角色；轮到你时先回想，再揭晓并听原声',
        practice: {
          practiceId: 'L01-M12:role-enactment', kind: 'role-enactment',
          sceneMode: 'dialogue-stage', sceneVariant: 'full-role-enactment',
          propSurface: 'counter-surface',
          castOrder: ['station-keeper', 'handbag-owner'], propEntityIds: ['handbag'],
          kicker: '',
          title: '选择你想扮演的角色',
          intro: '',
          roleSelectionLabel: '',
          completedRoleLabel: '已完成', skippedRoleLabel: '已跳过',
          currentRoleLabel: '你正在扮演',
          currentSpeakerLabel: '现在轮到',
          revealLabel: '揭晓并播放我的台词',
          hintLabel: '提示', nextHintLabel: '再提示',
          hintIntentLabel: '这句要表达', hintOpeningLabel: '英文开头',
          turnHints: NCE_U01_DIALOGUE_TURN_HINTS.map(hint => ({ ...hint })),
          audioRetryLabel: '再听一次', audioRetryCopy: '这句原声还没有播放成功，请再听一次。',
          roundSaveRetryLabel: '重新保存这个角色',
          roundSaveRetryCopy: '这个角色还没有保存好，不用重演七句。',
          roundSkipSaveRetryLabel: '重新保存这个角色',
          roundSkipSaveRetryCopy: '这个角色还没有保存好。',
          allCompleteTitle: '两个角色都完整演过了',
          allCompleteCopy: '',
          manualEntryLabel: '进入无字逐句回演',
          continueCourseLabel: '稍后练习，继续课程',
          returnLearningLabel: '返回继续学习',
          rounds: [
            {
              roundId: 'keeper-round', roleEntityId: 'station-keeper', partnerEntityId: 'handbag-owner',
              title: '你来当招领员', roleBadge: '招领员',
              instruction: '主人台词保持可见并自动播放；招领员台词先由你回想。',
              dialogueTurnRefs: ['L01-D01', 'L01-D02', 'L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07'],
              hiddenTurnRefs: ['L01-D01', 'L01-D03', 'L01-D05'],
              partnerTurnRefs: ['L01-D02', 'L01-D04', 'L01-D06', 'L01-D07']
            },
            {
              roundId: 'owner-round', roleEntityId: 'handbag-owner', partnerEntityId: 'station-keeper',
              title: '你来当女顾客', roleBadge: '女顾客',
              instruction: '招领员台词保持可见并自动播放；主人台词先由你回想。',
              dialogueTurnRefs: ['L01-D01', 'L01-D02', 'L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07'],
              hiddenTurnRefs: ['L01-D02', 'L01-D04', 'L01-D06', 'L01-D07'],
              partnerTurnRefs: ['L01-D01', 'L01-D03', 'L01-D05']
            }
          ]
        }
      }],
      characterEntityIds: LOST_HANDBAG_CAST, sceneEntityIds: ['handbag'],
      requiredFactIds: [], checkpointFacts: ['lesson1-full-role-enactment-complete'],
      skipPolicy: {
        kind: 'role-round-child-confirmed',
        preservesPartialProgress: true,
        countsAsResolved: true,
        producesLearningEvidence: false,
        unlocksOutcomePractice: false
      },
      restStop: { restStopId: 'lesson1-chapter-stop', type: 'chapter', nextMicrotaskId: 'L02-M11' }
    })
  ];

  const l02m15Question = nceV2Result({
    resultId: 'NCE-U01-T04:L02-M15:watch-question', microtaskId: 'L02-M15', challengeOrdinal: 1,
    stepId: 'L02-M15:S01', targetNumber: 4, sourceRef: 'L02-W04',
    relatedSourceRefs: ['L01-D03'], contentRef: 'NCE-U01-C-Q-WATCH', channel: 'assembly',
    contextId: 'personal-items-tray', reviewContextId: 'review-help-desk-exchange',
    evidenceMode: 'ownership-exchange', variantId: 'watch-question'
  });
  const l02m15It = nceV2Result({
    resultId: 'NCE-U01-T04:L02-M15:it-reference', microtaskId: 'L02-M15', challengeOrdinal: 2,
    stepId: 'L02-M15:S03', targetNumber: 4, sourceRef: 'L01-D06',
    relatedSourceRefs: ['L02-W04'], channel: 'reference', contextId: 'personal-items-tray',
    reviewContextId: 'review-help-desk-exchange', evidenceMode: 'ownership-exchange', variantId: 'watch'
  });

  const LESSON2_V2_COMPLETE_MICROTASKS = [
    nceV2WordTask({
      microtaskId: 'L02-M11', lessonId: 'lesson2', title: '清点包里的文具',
      stepLabel: '随身物品 · 1 / 5', sceneMode: 'personal-items-audio-tray',
      prompt: '听声音，点击对应的物品',
      completedFeedback: '两件文具已经放上核对托盘。',
      nextCue: { entityId: 'book', label: '继续核对' }, estimatedSeconds: 70,
      sourceRefs: ['L02-W01', 'L02-W02'], channel: 'audio-form-supported',
      contextId: 'personal-items-tray', reviewContextId: 'review-schoolbag-check',
      candidateEntityIds: ['pen', 'pencil', 'book', 'watch'],
      characterEntityIds: [], sceneEntityIds: ['pen', 'pencil', 'book', 'watch'],
      checkpointFacts: ['pen-pencil-on-tray'], extraExposureRefs: ['L02-I01'],
      extraSourceContacts: [{ sourceRef: 'L02-I01', contactMode: 'explicit-display' }]
    }),
    nceV2WordTask({
      microtaskId: 'L02-M12', lessonId: 'lesson2', title: '继续清点随身物品',
      stepLabel: '随身物品 · 2 / 5', sceneMode: 'personal-items-audio-tray',
      prompt: '听声音，点击对应的物品',
      completedFeedback: '四件随身物品核对完毕，英文标签册打开了。',
      nextCue: { entityId: 'pen', label: '打开标签册' }, estimatedSeconds: 70,
      sourceRefs: ['L02-W03', 'L02-W04'], channel: 'audio-form-supported',
      contextId: 'personal-items-tray', reviewContextId: 'review-schoolbag-check',
      candidateEntityIds: ['pen', 'pencil', 'book', 'watch'],
      characterEntityIds: [], sceneEntityIds: ['pen', 'pencil', 'book', 'watch'],
      checkpointFacts: ['personal-items-tray-complete', 'personal-items-label-book-open']
    }),
    nceV2WordTask({
      microtaskId: 'L02-M13', lessonId: 'lesson2', title: '给文具贴上英文名',
      stepLabel: '随身物品 · 3 / 5', sceneMode: 'personal-items-word-labels',
      prompt: '看英文，点击对应的物品',
      completedFeedback: '两张英文标签已经归位。',
      nextCue: { entityId: 'book', label: '继续贴标签' }, estimatedSeconds: 70,
      sourceRefs: ['L02-W01', 'L02-W02'], channel: 'word-form',
      contextId: 'personal-items-tray', reviewContextId: 'review-schoolbag-check',
      candidateEntityIds: ['pen', 'pencil', 'book', 'watch'],
      characterEntityIds: [], sceneEntityIds: ['pen', 'pencil', 'book', 'watch'],
      checkpointFacts: ['pen-pencil-labels-restored']
    }),
    nceV2WordTask({
      microtaskId: 'L02-M14', lessonId: 'lesson2', title: '给随身物品贴英文名',
      stepLabel: '随身物品 · 4 / 5', sceneMode: 'personal-items-word-labels',
      prompt: '看英文，点击对应的物品',
      completedFeedback: '随身物品清单完整了，可以用 watch 试试问句。',
      nextCue: { entityId: 'watch', label: '试试问句' }, estimatedSeconds: 70,
      sourceRefs: ['L02-W03', 'L02-W04'], channel: 'word-form',
      contextId: 'personal-items-tray', reviewContextId: 'review-schoolbag-check',
      candidateEntityIds: ['pen', 'pencil', 'book', 'watch'],
      characterEntityIds: [], sceneEntityIds: ['pen', 'pencil', 'book', 'watch'],
      checkpointFacts: ['personal-items-labels-complete']
    }),
    nceV2Task({
      microtaskId: 'L02-M15', lessonId: 'lesson2', title: '换件物品问一问',
      stepLabel: '随身物品 · 5 / 5', sceneMode: 'watch-question-and-it',
      prompt: '用 watch 换一个归属问句，再找出 it 指的东西',
      completedFeedback: '你发现了问句规律，也知道 it 指刚才的手表。',
      nextCue: { entityId: 'coat', label: '去衣帽间' }, estimatedSeconds: 90,
      exposureRefs: ['L02-W04', 'L01-D03', 'L01-D06'],
      evidenceRefs: ['L02-W04', 'L01-D06'],
      sourceContacts: [
        { sourceRef: 'L02-W04', contactMode: 'language-chunk-assembly' },
        { sourceRef: 'L01-D03', contactMode: 'pattern-transfer' },
        { sourceRef: 'L01-D06', contactMode: 'reference-interpretation' }
      ],
      targetResults: [l02m15Question, l02m15It],
      steps: [
        {
          stepId: 'L02-M15:S01', contentId: 'NCE-U01-C-PROMPT-L02-M15-S01',
          kind: 'ordered-blocks', submissionMode: 'formal', affectsAdventureHearts: true,
          prompt: '礼貌确认，这是不是对方正在找的物品。',
          blockContentRefs: ['NCE-U01-C-BLOCK-IS-CAPITAL', 'NCE-U01-C-BLOCK-THIS', 'NCE-U01-C-BLOCK-YOUR', 'NCE-U01-C-BLOCK-WATCH', 'NCE-U01-C-PUNCT-QUESTION'],
          answerRule: { type: 'ordered-blocks', acceptedOrder: ['NCE-U01-C-BLOCK-IS-CAPITAL', 'NCE-U01-C-BLOCK-THIS', 'NCE-U01-C-BLOCK-YOUR', 'NCE-U01-C-BLOCK-WATCH', 'NCE-U01-C-PUNCT-QUESTION'] },
          shuffleConstraint: 'not-accepted-order',
          allowReset: true,
          rescueModel: { text: 'Is this your book?', entityId: 'book' },
          challenges: [nceV2Challenge(l02m15Question, {
            candidateContentRefs: ['NCE-U01-C-BLOCK-IS-CAPITAL', 'NCE-U01-C-BLOCK-THIS', 'NCE-U01-C-BLOCK-YOUR', 'NCE-U01-C-BLOCK-WATCH', 'NCE-U01-C-PUNCT-QUESTION'],
            answerRule: { type: 'ordered-blocks', acceptedOrder: ['NCE-U01-C-BLOCK-IS-CAPITAL', 'NCE-U01-C-BLOCK-THIS', 'NCE-U01-C-BLOCK-YOUR', 'NCE-U01-C-BLOCK-WATCH', 'NCE-U01-C-PUNCT-QUESTION'] },
            supportKind: 'structure',
            boundaryContentRefs: ['NCE-U01-C-BLOCK-IS-CAPITAL', 'NCE-U01-C-PUNCT-QUESTION'],
            shuffleConstraint: 'not-accepted-order',
            feedbackAudioSequence: nceV2AudioSequence('L02-M15:C01:feedback', ['NCE-U01-C-Q-WATCH'], 'content')
          })]
        },
        {
          stepId: 'L02-M15:S03', contentId: 'NCE-U01-C-PROMPT-L02-M15-S03',
          kind: 'connect-reference', submissionMode: 'formal', affectsAdventureHearts: true,
          prompt: 'Yes, it is. 里的 it 指的是哪一件东西？',
          sourceRef: 'L01-D06', optionEntityIds: ['watch', 'handbag', 'book'],
          candidatePresentation: 'neutral-before-submit',
          textVisibility: 'always-visible', preSubmitAudioPolicy: 'required-ended',
          audioResponsePresentation: 'shared-locked-until-ended',
          audioSequence: nceV2AudioSequence('L02-M15:C02:prompt', ['L01-D06']),
          answerRule: { type: 'connect-reference', sourceRef: 'L01-W09', entityId: 'watch' },
          challenges: [nceV2Challenge(l02m15It, {
            candidateEntityIds: ['watch', 'handbag', 'book'],
            answerRule: { type: 'connect-reference', sourceRef: 'L01-W09', entityId: 'watch' },
            supportKind: 'structure',
            audioSequence: nceV2AudioSequence('L02-M15:C02:prompt', ['L01-D06'])
          })]
        }
      ],
      characterEntityIds: LOST_HANDBAG_CAST, sceneEntityIds: ['watch', 'handbag', 'book'],
      requiredFactIds: [`${l02m15Question.resultId}:recorded`, `${l02m15It.resultId}:recorded`],
      checkpointFacts: ['watch-question-understood', 'lesson2-midpoint-reached'],
      restStop: { restStopId: 'lesson2-midpoint-rest-stop', type: 'section', nextMicrotaskId: 'L02-M16' },
      knowledgeCardRefs: ['NCE-U01-C-KNOWLEDGE-QUESTION', 'NCE-U01-C-KNOWLEDGE-IT']
    }),
    nceV2WordTask({
      microtaskId: 'L02-M16', lessonId: 'lesson2', title: '帮她寻找衣物',
      stepLabel: '衣帽间 · 1 / 4', sceneMode: 'coatroom-audio-rack',
      prompt: '听声音，点击对应的衣物',
      completedFeedback: '两件衣物已经找到位置。',
      nextCue: { entityId: 'skirt', label: '继续整理' }, estimatedSeconds: 70,
      sourceRefs: ['L02-W05', 'L02-W06'], channel: 'audio-form-supported',
      contextId: 'coatroom-rack', reviewContextId: 'review-morning-coatroom',
      candidateEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
      characterEntityIds: [], sceneEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
      checkpointFacts: ['coat-dress-on-rack']
    }),
    nceV2WordTask({
      microtaskId: 'L02-M17', lessonId: 'lesson2', title: '找齐衣帽间的衣物',
      stepLabel: '衣帽间 · 2 / 4', sceneMode: 'coatroom-audio-rack',
      prompt: '听声音，点击对应的衣物',
      completedFeedback: '分类架展开了，旧英文挂牌也脱落了。',
      nextCue: { entityId: 'coat', label: '重新挂牌' }, estimatedSeconds: 70,
      sourceRefs: ['L02-W07', 'L02-W08'], channel: 'audio-form-supported',
      contextId: 'coatroom-rack', reviewContextId: 'review-morning-coatroom',
      candidateEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
      characterEntityIds: [], sceneEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
      checkpointFacts: ['clothes-on-rack', 'coatroom-labels-open']
    }),
    nceV2WordTask({
      microtaskId: 'L02-M18', lessonId: 'lesson2', title: '给衣物贴上英文名',
      stepLabel: '衣帽间 · 3 / 4', sceneMode: 'coatroom-word-labels',
      prompt: '看英文，点击对应的衣物',
      completedFeedback: '两块衣签已经挂稳。',
      nextCue: { entityId: 'skirt', label: '完成挂牌' }, estimatedSeconds: 75,
      sourceRefs: ['L02-W05', 'L02-W06'], channel: 'word-form',
      contextId: 'coatroom-rack', reviewContextId: 'review-morning-coatroom',
      candidateEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
      characterEntityIds: [], sceneEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
      checkpointFacts: ['coat-dress-labels-restored']
    }),
    {
      ...nceV2WordTask({
        microtaskId: 'L02-M19', lessonId: 'lesson2', title: '把外套还给她',
        stepLabel: '衣帽间 · 4 / 4', sceneMode: 'coatroom-word-labels-and-return',
        prompt: '看英文，点击对应的衣物',
        completedFeedback: '衣帽间整理好了，外套也真正回到主人手里。',
        nextCue: { entityId: 'car', label: '陪她找到回家的车' }, estimatedSeconds: 80,
        sourceRefs: ['L02-W07', 'L02-W08'], channel: 'word-form',
        contextId: 'coatroom-rack', reviewContextId: 'review-morning-coatroom',
        candidateEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
        characterEntityIds: LOST_HANDBAG_CAST, sceneEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
        checkpointFacts: ['coatroom-labels-complete', 'coat-with-owner'],
        extraExposureRefs: ['L01-D06', 'L01-D07'],
        extraSourceContacts: [
          { sourceRef: 'L01-D06', contactMode: 'near-transfer-confirmation' },
          { sourceRef: 'L01-D07', contactMode: 'near-transfer-thanks' }
        ]
      }),
      steps: [
        ...nceV2WordTask({
          microtaskId: 'L02-M19', lessonId: 'lesson2', title: '把外套还给她',
          stepLabel: '衣帽间 · 4 / 4', sceneMode: 'coatroom-word-labels-and-return',
          prompt: '看英文，点击对应的衣物',
          completedFeedback: '衣帽间整理好了，外套也真正回到主人手里。',
          nextCue: { entityId: 'car', label: '陪她找到回家的车' }, estimatedSeconds: 80,
          sourceRefs: ['L02-W07', 'L02-W08'], channel: 'word-form',
          contextId: 'coatroom-rack', reviewContextId: 'review-morning-coatroom',
          candidateEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
          characterEntityIds: LOST_HANDBAG_CAST, sceneEntityIds: ['coat', 'dress', 'skirt', 'shirt'],
          checkpointFacts: ['coatroom-labels-complete', 'coat-with-owner']
        }).steps,
        {
          stepId: 'L02-M19:S02', contentId: 'NCE-U01-C-PROMPT-L02-M19-S02',
          kind: 'audio-sequence', submissionMode: 'free', affectsAdventureHearts: false,
          prompt: '听招领员确认外套，再听她回应',
          audioContentRefs: ['NCE-U01-C-Q-COAT'], audioSourceRefs: ['L01-D06'],
          audioSequence: {
            ...nceV2AudioSequence('L02-M19:S02:coat-dialogue', ['NCE-U01-C-Q-COAT'], 'content'),
            segments: [
              ...nceV2AudioSequence('L02-M19:S02:coat-question', ['NCE-U01-C-Q-COAT'], 'content').segments,
              ...nceV2AudioSequence('L02-M19:S02:coat-answer', ['L01-D06']).segments
            ]
          },
          audioResponsePresentation: 'independent-listen',
          gate: AUDIO_ENDED_GATE, textVisibility: 'always-visible'
        },
        {
          stepId: 'L02-M19:S03', contentId: 'NCE-U01-C-PROMPT-L02-M19-S03',
          kind: 'perform-action', submissionMode: 'story', affectsAdventureHearts: false,
          prompt: '点击外套主人，把外套交给她', entityIds: ['coat'], targetEntityIds: ['handbag-owner'],
          actionInstruction: '点击外套主人，把外套交给她',
          storesFactId: 'coat-return-action',
          answerRule: { type: 'perform-action', action: 'give', entityId: 'coat', targetEntityId: 'handbag-owner' },
          feedbackAudioSourceRef: 'L01-D07',
          feedbackAudioSequence: nceV2AudioSequence('L02-M19:S03:thanks', ['L01-D07'])
        }
      ],
      persistence: {
        atomic: true,
        resumePolicy: 'restart-microtask',
        requiredFactIds: [
          'NCE-U01-T01:L02-W07:word-form:recorded',
          'NCE-U01-T01:L02-W08:word-form:recorded',
          'coat-return-action'
        ],
        checkpointFacts: ['coatroom-labels-complete', 'coat-with-owner']
      },
      storyAction: { actionId: 'coat-return', action: 'give', entityId: 'coat', targetEntityId: 'handbag-owner', maxOccurrences: 1 }
    },
    nceV2WordTask({
      microtaskId: 'L02-M20', lessonId: 'lesson2', title: '回家路上的两个线索',
      stepLabel: '陪她回家 · 1 / 2', sceneMode: 'homeward-scene-identify',
      prompt: '听一听，点中声音说的是哪一个。',
      completedFeedback: '汽车和家都找到了，陪她走完回家路。',
      nextCue: { entityId: 'car', label: '陪她回家' }, estimatedSeconds: 65,
      sourceRefs: ['L02-W09', 'L02-W10'], channel: 'audio-form-supported',
      contextId: 'neighbourhood-route', reviewContextId: 'review-neighbourhood-route',
      candidateEntityIds: ['car', 'house'],
      candidateSetPolicy: 'authentic-scene-pair',
      characterEntityIds: [], sceneEntityIds: ['car', 'house'],
      checkpointFacts: ['homeward-scenes-identified']
    }),
    {
      ...nceV2SequentialWordTask({
        microtaskId: 'L02-M21', lessonId: 'lesson2', title: '送她平安到家',
        stepLabel: '陪她回家 · 2 / 2', sceneMode: 'homeward-label-journey',
        stepPrompts: ['看英文，选择对应的场景', '看英文，选择对应的场景'],
        completedFeedback: '她已经平安到家，正在核对全部学习记录。',
        nextCue: { entityId: 'house', label: '保存并核对' }, estimatedSeconds: 90,
        sourceRefs: ['L02-W09', 'L02-W10'], channel: 'word-form',
        contextId: 'neighbourhood-route', reviewContextId: 'review-neighbourhood-route',
        candidateEntityIds: ['car', 'house'],
        candidateSetPolicy: 'authentic-scene-pair',
        characterEntityIds: ['handbag-owner'], sceneEntityIds: ['car', 'house'],
        checkpointFacts: ['homeward-labels-complete', 'owner-home-arrival', 'lesson2-complete', 'unit-results-ready']
      }),
      growthBoundary: 'unit-verifying',
      persistence: {
        atomic: true,
        resumePolicy: 'restart-microtask',
        requiredFactIds: [
          'NCE-U01-T01:L02-W09:word-form:recorded',
          'NCE-U01-T01:L02-W10:word-form:recorded'
        ],
        checkpointFacts: [
          'homeward-labels-complete', 'owner-home-arrival', 'lesson2-complete', 'unit-results-ready'
        ]
      }
    }
  ];

  const LESSON1_2_MICROTASKS_BY_BEAT = {
    discover: LESSON1_V2_COMPLETE_MICROTASKS,
    understand: LESSON2_V2_COMPLETE_MICROTASKS.slice(0, 5),
    teach: LESSON2_V2_COMPLETE_MICROTASKS.slice(5, 7),
    transfer: LESSON2_V2_COMPLETE_MICROTASKS.slice(7, 10),
    build: LESSON2_V2_COMPLETE_MICROTASKS.slice(10)
  };

  const LESSON49_SOURCES = {
    'L49-Q01': source('L49-Q01', 'textbook-question', 'What does Mr. Bird like?'),
    'L49-D01': source('L49-D01', 'dialogue', 'Do you want any meat today, Mrs. Bird?', {
      speaker: 'Butcher',
      audioSrc: '/lesson49/audio/do_you_want_any_meat_today_mrs_bird.mp3'
    }),
    'L49-D02': source('L49-D02', 'dialogue', 'Yes, please.', {
      speaker: 'Mrs. Bird',
      audioSrc: '/lesson49/audio/yes_please.mp3'
    }),
    'L49-D03': source('L49-D03', 'dialogue', 'Do you want beef or lamb?', {
      speaker: 'Butcher',
      audioSrc: '/lesson49/audio/do_you_want_beef_or_lamb.mp3'
    }),
    'L49-D04': source('L49-D04', 'dialogue', 'Beef, please.', {
      speaker: 'Mrs. Bird',
      audioSrc: '/lesson49/audio/beef_please.mp3'
    }),
    'L49-D05': source('L49-D05', 'dialogue', "This lamb's very good.", {
      speaker: 'Butcher',
      audioSrc: '/lesson49/audio/this_lamb_s_very_good.mp3'
    }),
    'L49-D06': source('L49-D06', 'dialogue', "I like lamb, but my husband doesn't.", {
      speaker: 'Mrs. Bird',
      audioSrc: '/lesson49/audio/i_like_lamb_but_my_husband_doesn_t.mp3'
    }),
    'L49-D07': source('L49-D07', 'dialogue', 'What about some steak? This is a nice piece.', {
      speaker: 'Butcher',
      audioSrc: '/lesson49/audio/what_about_some_steak_this_is_a_nice_piece.mp3'
    }),
    'L49-D08': source('L49-D08', 'dialogue', 'Give me that piece, please. And a pound of mince, too.', {
      speaker: 'Mrs. Bird',
      audioSrc: '/lesson49/audio/give_me_that_piece_please_and_a_pound_of_mince_too.mp3'
    }),
    'L49-D09': source('L49-D09', 'dialogue', "Do you want a chicken, Mrs. Bird? They're very nice.", {
      speaker: 'Butcher',
      audioSrc: '/lesson49/audio/do_you_want_a_chicken_mrs_bird_they_re_very_nice.mp3'
    }),
    'L49-D10': source('L49-D10', 'dialogue', "No, thank you. My husband likes steak, but he doesn't like chicken.", {
      speaker: 'Mrs. Bird',
      audioSrc: '/lesson49/audio/no_thank_you_my_husband_likes_steak_but_he_doesn_t_like_chicken.mp3'
    }),
    'L49-D11': source('L49-D11', 'dialogue', "To tell you the truth, Mrs. Bird, I don't like chicken either!", {
      speaker: 'Butcher',
      audioSrc: '/lesson49/audio/to_tell_you_the_truth_mrs_bird_i_don_t_like_chicken_either.mp3'
    }),
    'L49-W01': source('L49-W01', 'vocabulary', 'butcher', {
      semanticType: 'human-role', audioSrc: '/lesson49/audio/butcher.mp3'
    }),
    'L49-W02': source('L49-W02', 'vocabulary', 'meat', {
      semanticType: 'food-category', audioSrc: '/lesson49/audio/meat.mp3'
    }),
    'L49-W03': source('L49-W03', 'vocabulary', 'beef', {
      semanticType: 'meat', audioSrc: '/lesson49/audio/beef.mp3'
    }),
    'L49-W04': source('L49-W04', 'vocabulary', 'lamb', {
      semanticType: 'meat', audioSrc: '/lesson49/audio/lamb.mp3'
    }),
    'L49-W05': source('L49-W05', 'vocabulary', 'husband', {
      semanticType: 'human-relationship', audioSrc: '/lesson49/audio/husband.mp3'
    }),
    'L49-W06': source('L49-W06', 'vocabulary', 'steak', {
      semanticType: 'meat', audioSrc: '/lesson49/audio/steak.mp3'
    }),
    'L49-W07': source('L49-W07', 'vocabulary', 'mince', {
      semanticType: 'meat', audioSrc: '/lesson49/audio/mince.mp3'
    }),
    'L49-W08': source('L49-W08', 'vocabulary', 'chicken', {
      semanticType: 'meat', audioSrc: '/lesson49/audio/chicken.mp3'
    }),
    'L49-W09': source('L49-W09', 'vocabulary', 'tell', {
      semanticType: 'discourse-word', audioSrc: '/lesson49/audio/tell.mp3'
    }),
    'L49-W10': source('L49-W10', 'vocabulary', 'truth', {
      semanticType: 'discourse-word', audioSrc: '/lesson49/audio/truth.mp3'
    }),
    'L49-W11': source('L49-W11', 'vocabulary', 'either', {
      semanticType: 'discourse-word', audioSrc: '/lesson49/audio/either.mp3'
    }),
    'L49-P01': source('L49-P01', 'quantity-reference', 'some steak'),
    'L49-P02': source('L49-P02', 'quantity-reference', 'a nice piece'),
    'L49-P03': source('L49-P03', 'quantity-reference', 'that piece'),
    'L49-P04': source('L49-P04', 'quantity-reference', 'a pound of mince'),
    'L49-N01': source('L49-N01', 'textbook-note', 'or marks a choice; the first option rises and the last falls'),
    'L49-N02': source('L49-N02', 'textbook-note', "doesn't replaces the repeated verb and object"),
    'L49-N03': source('L49-N03', 'textbook-note', 'to tell you the truth means speaking honestly'),
    'L49-N04': source('L49-N04', 'textbook-note', 'either expresses also in a negative statement and contrasts with too'),
    'L49-X01': source('L49-X01', 'derived-expression', 'a piece of steak', { required: false })
  };

  function audioSequence(sequenceId, sourceRefs) {
    return {
      audioSequenceId: sequenceId,
      lines: sourceRefs.map(sourceRef => ({
        sourceRef,
        text: LESSON49_SOURCES[sourceRef].text,
        ...(LESSON49_SOURCES[sourceRef].speaker
          ? { speaker: LESSON49_SOURCES[sourceRef].speaker }
          : {}),
        src: LESSON49_SOURCES[sourceRef].audioSrc
      }))
    };
  }

  const LESSON49_AUDIO_SEQUENCES = {
    'L49-A-WAKE-SHELF': audioSequence('L49-A-WAKE-SHELF', [
      'L49-W01', 'L49-W02', 'L49-W03', 'L49-W04', 'L49-W06', 'L49-W07', 'L49-W08'
    ]),
    'L49-A-FULL-DIALOGUE': audioSequence('L49-A-FULL-DIALOGUE', [
      'L49-D01', 'L49-D02', 'L49-D03', 'L49-D04', 'L49-D05', 'L49-D06',
      'L49-D07', 'L49-D08', 'L49-D09', 'L49-D10', 'L49-D11'
    ]),
    'L49-A-FIRST-ORDER': audioSequence('L49-A-FIRST-ORDER', [
      'L49-D01', 'L49-D02', 'L49-D03', 'L49-D04'
    ]),
    'L49-A-LAMB-PREFERENCE': audioSequence('L49-A-LAMB-PREFERENCE', ['L49-D05', 'L49-D06']),
    'L49-A-QUANTITY-BENCH': audioSequence('L49-A-QUANTITY-BENCH', ['L49-D07', 'L49-D08']),
    'L49-A-ACCEPT-REFUSE': audioSequence('L49-A-ACCEPT-REFUSE', ['L49-D09', 'L49-D10', 'L49-D11'])
  };

  const LESSON49_CONTENT = {
    lessonId: 'lesson49',
    textbookTitle: "At the butcher's",
    textbookSource: '外研社《新概念英语智慧版 1》物理页 131–132，书本页 98–99',
    experience: {
      documentTitle: 'Lesson 49 · 暖灯风味市集冒险',
      lessonLabel: 'LESSON 49',
      headerTitle: '肉铺订单大冒险',
      arrival: {
        kicker: '四季生活城 · 暖灯风味市集',
        title: '一张没核清的肉铺订单',
        copy: '带着教材问题走进肉铺，完成九个真实学习动作。订单板只会在整幕完成后成长。',
        promises: ['找出订单缺口', '听懂 11 段对话', '还原订单证据链'],
        actionLabel: '开始冒险'
      },
      completion: {
        kicker: 'Lesson 49 前两幕完成',
        title: '订单已经核清',
        copy: '暖灯风味市集已建设到 state-2。下一段冒险在 Lesson 50 继续，不代表整个 U01 已完成。',
        primaryActionLabel: '继续 Lesson 50',
        primaryActionHref: '/lesson50/',
        mapActionLabel: '回到四季生活城',
        replayActionLabel: '重新体验'
      },
      stageAlts: [
        '尚未展开订单板的暖灯风味市集',
        '订单板已经展开的暖灯风味市集',
        '订单核清、备货台完整的暖灯风味市集'
      ]
    },
    requiredSourceIds: Object.keys(LESSON49_SOURCES)
      .filter(sourceId => LESSON49_SOURCES[sourceId].required),
    sources: LESSON49_SOURCES,
    audioSequences: LESSON49_AUDIO_SEQUENCES
  };

  function single(valueOrValues) {
    return Array.isArray(valueOrValues)
      ? { type: 'single', acceptedValues: valueOrValues }
      : { type: 'single', value: valueOrValues };
  }

  function set(values) {
    return { type: 'set', values };
  }

  function ordered(values) {
    return { type: 'ordered', values };
  }

  function mapping(entries) {
    return { type: 'mapping', entries };
  }

  function composition(fields) {
    return { type: 'composition', fields };
  }

  function lesson49Microtask({
    number,
    kind,
    exposureRefs,
    evidenceRefs,
    responseKeyByContext,
    audioSequenceId,
    buildStage,
    formativeBinding
  }) {
    const microtaskId = `L49-M${String(number).padStart(2, '0')}`;
    return {
      microtaskId,
      lessonId: 'lesson49',
      kind,
      required: true,
      exposureRefs,
      evidenceRefs,
      contextVariants: {
        'breakfast-stall': { contextId: 'breakfast-stall' },
        'picnic-supply': { contextId: 'picnic-supply' }
      },
      ...(audioSequenceId ? { audioSequenceId } : {}),
      responseKeyByContext,
      ...(formativeBinding ? { formativeBinding } : {}),
      support: {
        ladder: [...SUPPORT_LADDER],
        nearTransferContextId: 'picnic-supply'
      },
      checkpointAfterSuccess: {
        checkpointId: `${microtaskId}:complete`,
        ...(buildStage === undefined ? {} : { buildStage })
      }
    };
  }

  const LESSON49_MICROTASKS = [
    lesson49Microtask({
      number: 1,
      kind: 'composition',
      exposureRefs: ['L49-Q01'],
      evidenceRefs: ['L49-Q01'],
      responseKeyByContext: {
        'breakfast-stall': composition({
          missingInformation: set(['wanted', 'unwanted', 'quantity']),
          firstClue: single('preference')
        }),
        'picnic-supply': composition({
          missingInformation: set(['item', 'avoid', 'quantity']),
          firstClue: single('quantity')
        })
      },
      buildStage: 1
    }),
    lesson49Microtask({
      number: 2,
      kind: 'mapping',
      exposureRefs: ['L49-W01', 'L49-W02', 'L49-W03', 'L49-W04', 'L49-W06', 'L49-W07', 'L49-W08'],
      evidenceRefs: ['L49-W01', 'L49-W02', 'L49-W03', 'L49-W04', 'L49-W06', 'L49-W07', 'L49-W08'],
      audioSequenceId: 'L49-A-WAKE-SHELF',
      responseKeyByContext: {
        'breakfast-stall': mapping({
          worker: 'butcher', category: 'meat', beefTray: 'beef', lambTray: 'lamb',
          steakTray: 'steak', minceTray: 'mince', chickenTray: 'chicken'
        }),
        'picnic-supply': mapping({
          worker: 'vendor', category: 'food', beefTray: 'beef', lambTray: 'lamb',
          steakTray: 'steak', minceTray: 'mince', chickenTray: 'chicken'
        })
      }
    }),
    lesson49Microtask({
      number: 3,
      kind: 'single',
      exposureRefs: ['L49-Q01', ...Array.from({ length: 11 }, (_, index) => `L49-D${String(index + 1).padStart(2, '0')}`)],
      evidenceRefs: ['L49-Q01'],
      audioSequenceId: 'L49-A-FULL-DIALOGUE',
      responseKeyByContext: {
        'breakfast-stall': single(['beef', 'steak', 'chicken', 'not-sure']),
        'picnic-supply': single(['bread', 'fruit', 'juice', 'not-sure'])
      }
    }),
    lesson49Microtask({
      number: 4,
      kind: 'composition',
      exposureRefs: ['L49-D01', 'L49-D02', 'L49-D03', 'L49-D04', 'L49-N01'],
      evidenceRefs: ['L49-D01', 'L49-D02', 'L49-D03', 'L49-D04', 'L49-N01'],
      audioSequenceId: 'L49-A-FIRST-ORDER',
      responseKeyByContext: {
        'breakfast-stall': composition({
          acceptsMeat: single('yes-please'),
          selectedItem: single('beef'),
          pitchPath: ordered(['beef-rise', 'lamb-fall'])
        }),
        'picnic-supply': composition({
          acceptsFood: single('yes-please'),
          selectedItem: single('bread'),
          pitchPath: ordered(['bread-rise', 'fruit-fall'])
        })
      }
    }),
    lesson49Microtask({
      number: 5,
      kind: 'mapping',
      exposureRefs: ['L49-D05', 'L49-D06', 'L49-W05', 'L49-N02'],
      evidenceRefs: ['L49-D05', 'L49-D06', 'L49-W05', 'L49-N02'],
      audioSequenceId: 'L49-A-LAMB-PREFERENCE',
      responseKeyByContext: {
        'breakfast-stall': mapping({
          'mrs-bird': 'likes-lamb',
          'mr-bird': 'does-not-like-lamb'
        }),
        'picnic-supply': mapping({
          mia: 'likes-apples',
          ben: 'does-not-like-apples'
        })
      }
    }),
    lesson49Microtask({
      number: 6,
      kind: 'composition',
      exposureRefs: ['L49-D07', 'L49-D08', 'L49-W06', 'L49-W07', 'L49-P01', 'L49-P02', 'L49-P03', 'L49-P04', 'L49-X01'],
      evidenceRefs: ['L49-D07', 'L49-D08', 'L49-W06', 'L49-W07', 'L49-P01', 'L49-P02', 'L49-P03', 'L49-P04'],
      audioSequenceId: 'L49-A-QUANTITY-BENCH',
      formativeBinding: {
        targetId: 'FLC-U01-T01',
        evidenceMode: 'audio-image-quantity-match'
      },
      responseKeyByContext: {
        'breakfast-stall': composition({
          suggestedItem: single('steak'),
          referencedPiece: single('striped-piece'),
          quantityItem: single('one-pound-mince')
        }),
        'picnic-supply': composition({
          suggestedItem: single('sandwich'),
          referencedPiece: single('round-sandwich'),
          quantityItem: single('two-bottles-water')
        })
      }
    }),
    lesson49Microtask({
      number: 7,
      kind: 'composition',
      exposureRefs: ['L49-D09', 'L49-D10', 'L49-D11', 'L49-W08', 'L49-W09', 'L49-W10', 'L49-W11', 'L49-N03', 'L49-N04'],
      evidenceRefs: ['L49-D09', 'L49-D10', 'L49-D11', 'L49-W08', 'L49-W09', 'L49-W10', 'L49-W11', 'L49-N03', 'L49-N04'],
      audioSequenceId: 'L49-A-ACCEPT-REFUSE',
      responseKeyByContext: {
        'breakfast-stall': composition({
          orderAction: single('remove-chicken'),
          birdPreference: mapping({ likes: 'steak', dislikes: 'chicken' }),
          butcherPreference: single('does-not-like-chicken-either'),
          truthPhrase: single('speaking-honestly'),
          negativeAlso: single('either')
        }),
        'picnic-supply': composition({
          orderAction: single('remove-milk'),
          guestPreference: mapping({ likes: 'juice', dislikes: 'milk' }),
          vendorPreference: single('does-not-like-milk-either'),
          truthPhrase: single('speaking-honestly'),
          negativeAlso: single('either')
        })
      }
    }),
    lesson49Microtask({
      number: 8,
      kind: 'composition',
      exposureRefs: Array.from({ length: 11 }, (_, index) => `L49-D${String(index + 1).padStart(2, '0')}`),
      evidenceRefs: Array.from({ length: 11 }, (_, index) => `L49-D${String(index + 1).padStart(2, '0')}`),
      responseKeyByContext: {
        'breakfast-stall': composition({
          finalOrder: set(['beef', 'steak', 'mince']),
          evidence: mapping({
            replaceLamb: 'beef-please',
            removeChicken: 'no-thank-you',
            addMince: 'pound-of-mince'
          }),
          transaction: ordered(['ask-meat', 'choose-beef-or-lamb', 'compare-lamb-preference', 'choose-steak', 'add-mince', 'refuse-chicken'])
        }),
        'picnic-supply': composition({
          finalOrder: set(['bread', 'fruit', 'water']),
          evidence: mapping({
            replaceCake: 'bread-please',
            removeMilk: 'no-thank-you',
            addWater: 'two-bottles-water'
          }),
          transaction: ordered(['ask-food', 'choose-bread-or-cake', 'compare-fruit-preference', 'choose-fruit', 'add-water', 'refuse-milk'])
        })
      }
    }),
    lesson49Microtask({
      number: 9,
      kind: 'composition',
      exposureRefs: ['L49-Q01', 'L49-D05', 'L49-D06', 'L49-D07', 'L49-D08', 'L49-D09', 'L49-D10', 'L49-D11'],
      evidenceRefs: ['L49-Q01', 'L49-D05', 'L49-D06', 'L49-D07', 'L49-D08', 'L49-D09', 'L49-D10', 'L49-D11'],
      responseKeyByContext: {
        'breakfast-stall': composition({
          textbookAnswer: single('steak'),
          preferenceSentence: ordered(['he', 'likes', 'steak', 'but', 'he', 'does-not', 'like', 'chicken']),
          purchasedItems: set(['beef', 'steak', 'mince'])
        }),
        'picnic-supply': composition({
          finalAnswer: single('juice'),
          preferenceSentence: ordered(['she', 'likes', 'juice', 'but', 'she', 'does-not', 'like', 'milk']),
          purchasedItems: set(['bread', 'fruit', 'water'])
        })
      },
      buildStage: 2
    })
  ];

  function option(id, title, subtitle = '') {
    return { id, title, ...(subtitle ? { subtitle } : {}) };
  }

  function responseField(fieldId, kind, label, options, details = {}) {
    return { fieldId, kind, label, options, ...details };
  }

  function childContext({
    eyebrow,
    title,
    copy,
    submitLabel,
    support,
    assistedPrompt,
    responseFields,
    sceneItems = []
  }) {
    return {
      eyebrow,
      title,
      copy,
      submitLabel,
      support,
      assistedPrompt,
      responseFields,
      sceneItems
    };
  }

  function shelfFields({ workerId, workerTitle, categoryId, categoryTitle }) {
    return [
      responseField('worker', 'single', '谁在为顾客服务？', [
        option(workerId, workerTitle), option('customer', '正在买东西的顾客'), option('driver', '送货司机')
      ]),
      responseField('category', 'single', '整座货架属于哪一类？', [
        option(categoryId, categoryTitle), option('drink', '饮料'), option('tool', '工具')
      ]),
      responseField('beefTray', 'single', 'beef 放在哪个托盘？', [option('beef', '牛肉托盘'), option('lamb', '羊肉托盘')]),
      responseField('lambTray', 'single', 'lamb 放在哪个托盘？', [option('lamb', '羊肉托盘'), option('beef', '牛肉托盘')]),
      responseField('steakTray', 'single', 'steak 放在哪个托盘？', [option('steak', '牛排托盘'), option('mince', '肉馅托盘')]),
      responseField('minceTray', 'single', 'mince 放在哪个托盘？', [option('mince', '肉馅托盘'), option('steak', '牛排托盘')]),
      responseField('chickenTray', 'single', 'chicken 放在哪个托盘？', [option('chicken', '整鸡托盘'), option('beef', '牛肉托盘')])
    ];
  }

  const LESSON49_PRESENTATIONS = {
    'L49-M01': {
      title: '标出订单缺口',
      stepLabel: '1 / 9 · 发现问题',
      completedFeedback: '我们知道要听什么了，先不公布答案。',
      growth: {
        title: '订单板展开了！',
        copy: '三类缺口已经标清，肉铺从 state-0 成长到 state-1。'
      },
      contexts: {
        'breakfast-stall': childContext({
          eyebrow: '肉铺门前 · 未完成订单',
          title: '这张订单还缺哪些信息？',
          copy: '先把“要什么、不要什么、数量多少”三张问题卡放好，再选一类最值得先听的线索。',
          submitLabel: '带着问题进肉铺',
          support: [
            '重新观察：空订单要让备货员知道买什么、避开什么、准备多少。',
            '聚焦空槽：商品、拒绝和数量缺一项都不能核单。',
            '小猫示范：另一张早餐单也先圈出要、不要和数量，再决定先听偏好。'
          ],
          assistedPrompt: '跟着三枚空槽逐项放卡，再亲自选择第一条线索。',
          responseFields: [
            responseField('missingInformation', 'set', '订单必须补齐哪三类信息？', [
              option('wanted', '要什么'), option('unwanted', '不要什么'),
              option('quantity', '数量多少'), option('shop', '商店在哪儿')
            ]),
            responseField('firstClue', 'single', '准备先听哪一类线索？', [
              option('preference', '喜欢或不喜欢'), option('weather', '今天的天气'), option('colour', '包装颜色')
            ])
          ],
          sceneItems: ['Mrs. Bird', '空订单板', 'What does Mr. Bird like?']
        }),
        'picnic-supply': childContext({
          eyebrow: '野餐补给台 · 变化便签',
          title: '换一张订单，还缺哪些信息？',
          copy: '人物和地点都换了，仍要找出商品、避开项和数量，再决定先核对什么。',
          submitLabel: '完成变化便签',
          support: [
            '重新观察：野餐便签也要能直接指导备货。',
            '聚焦三个空槽：拿什么、不拿什么、拿多少。',
            '小猫示范：先看数量会不会让准备的人犹豫。'
          ],
          assistedPrompt: '按空槽顺序完成三类信息，再亲自点选先查数量。',
          responseFields: [
            responseField('missingInformation', 'set', '便签必须补齐哪三类信息？', [
              option('item', '拿什么'), option('avoid', '避开什么'),
              option('quantity', '数量多少'), option('place', '野餐地点')
            ]),
            responseField('firstClue', 'single', '先核对哪条线索？', [
              option('quantity', '准备几份'), option('colour', '篮子颜色'), option('story', '谁讲故事')
            ])
          ]
        })
      }
    },
    'L49-M02': {
      title: '唤醒肉铺货架',
      stepLabel: '2 / 9 · 听懂线索',
      completedFeedback: '声音、人物和商品已经一一连上。',
      contexts: {
        'breakfast-stall': childContext({
          eyebrow: '肉铺货架 · 音图匹配',
          title: '听词，把货架唤醒',
          copy: '先听完整组词，再把人物、品类和商品放回正确位置。',
          submitLabel: '核对整座货架',
          support: [
            '重新听当前词，先分清人物声音和商品声音。',
            '聚焦词尾和图片轮廓，一次只修一个托盘。',
            '小猫示范另一组货架如何用声音找到图片，再回到这组。'
          ],
          assistedPrompt: '按正在播放的词逐个点选，保留已经放对的托盘。',
          responseFields: shelfFields({
            workerId: 'butcher', workerTitle: '肉店老板', categoryId: 'meat', categoryTitle: '肉类商品'
          }),
          sceneItems: ['肉店老板', 'beef', 'lamb', 'steak', 'mince', 'chicken']
        }),
        'picnic-supply': childContext({
          eyebrow: '野餐补给架 · 变化货架',
          title: '换个摊位，重新听和摆',
          copy: '人物角色变成摊主，但六个教材商品词仍要靠声音放回正确托盘。',
          submitLabel: '核对变化货架',
          support: [
            '重新听：先找正在服务顾客的人。',
            '商品托盘仍保留自己的英文标签。',
            '小猫示范用一个词的首音定位，再让你完成其余托盘。'
          ],
          assistedPrompt: '跟随逐词高亮完成最后一项匹配。',
          responseFields: shelfFields({
            workerId: 'vendor', workerTitle: '补给摊主', categoryId: 'food', categoryTitle: '食物'
          })
        })
      }
    },
    'L49-M03': {
      title: '带着问题听完整对话',
      stepLabel: '3 / 9 · 听懂线索',
      completedFeedback: '初始猜想已保存，后面要用对话证据核对。',
      contexts: {
        'breakfast-stall': childContext({
          eyebrow: '完整对话 · 第一次听',
          title: 'What does Mr. Bird like?',
          copy: '先不看全文。听完 D01–D11，再保存此刻的猜想；猜想不会按对错计分。',
          submitLabel: '保存我的猜想',
          support: ['再听完整对话，注意 Mr. Bird 出现的句子。', '聚焦后半段的 likes 和 does not like。', '小猫示范怎样先记关键词、暂不急着确定答案。'],
          assistedPrompt: '选出你现在最接近的猜想，后面再用证据修正。',
          responseFields: [responseField('response', 'single', '你现在猜 Mr. Bird 喜欢什么？', [
            option('beef', 'beef'), option('steak', 'steak'), option('chicken', 'chicken'), option('not-sure', '还不确定')
          ])],
          sceneItems: ['Butcher', 'Mrs. Bird', '11 段站内合成英音']
        }),
        'picnic-supply': childContext({
          eyebrow: '变化对话 · 先做预测',
          title: '新客人可能喜欢什么？',
          copy: '只保存一个可修改的预测，不把猜中当作掌握证据。',
          submitLabel: '保存变化猜想',
          support: ['再听人物说到偏好的位置。', '注意 likes 后面的商品词。', '小猫示范先留下不确定也可以。'],
          assistedPrompt: '亲自保存一个猜想或选择“还不确定”。',
          responseFields: [responseField('response', 'single', '你现在的猜想是？', [
            option('bread', 'bread'), option('fruit', 'fruit'), option('juice', 'juice'), option('not-sure', '还不确定')
          ])]
        })
      }
    },
    'L49-M04': {
      title: '第一张订单：要什么肉',
      stepLabel: '4 / 9 · 听懂线索',
      completedFeedback: '听到 “Beef, please.”，所以这次装 beef。',
      contexts: {
        'breakfast-stall': childContext({
          eyebrow: 'D01–D04 · 询问与选择',
          title: '先接受询问，再做二选一',
          copy: '把 Yes, please.、beef 和 beef ↗ / lamb ↘ 三条线索一起放进订单。',
          submitLabel: '装入第一项商品',
          support: ['重听 D01–D04，不要只看商品图片。', '注意回答重复了 or 两边的哪一个词。', '小猫用 tea ↗ / juice ↘ 示范选择问句，再让你回到 beef / lamb。'],
          assistedPrompt: '跟随问句、回答、语调三格逐项完成。',
          responseFields: [
            responseField('acceptsMeat', 'single', '对 “any meat” 的回应是？', [option('yes-please', 'Yes, please.'), option('no-thank-you', 'No, thank you.')]),
            responseField('selectedItem', 'single', 'beef or lamb 最后选了？', [option('beef', 'beef'), option('lamb', 'lamb'), option('chicken', 'chicken')]),
            responseField('pitchPath', 'ordered', '按听到的语调顺序排列', [option('beef-rise', 'beef ↗'), option('lamb-fall', 'lamb ↘')])
          ]
        }),
        'picnic-supply': childContext({
          eyebrow: '变化问句 · bread or fruit',
          title: '换商品，再判断一次',
          copy: '仍要同时判断接受、选择和前升后降的语调。',
          submitLabel: '完成变化选择',
          support: ['重听完整问答。', '回答会重复真正选中的商品。', '先标前项上扬、末项下降，再选商品。'],
          assistedPrompt: '按三格提示完成变化问答。',
          responseFields: [
            responseField('acceptsFood', 'single', '客人接受食物询问吗？', [option('yes-please', 'Yes, please.'), option('no-thank-you', 'No, thank you.')]),
            responseField('selectedItem', 'single', 'bread or fruit 最后选了？', [option('bread', 'bread'), option('fruit', 'fruit')]),
            responseField('pitchPath', 'ordered', '排列语调轨迹', [option('bread-rise', 'bread ↗'), option('fruit-fall', 'fruit ↘')])
          ]
        })
      }
    },
    'L49-M05': {
      title: '喜欢不等于这次购买',
      stepLabel: '5 / 9 · 听懂线索',
      completedFeedback: "Mrs. Bird 喜欢 lamb；her husband doesn't like lamb。",
      contexts: {
        'breakfast-stall': childContext({
          eyebrow: 'D05–D06 · 人物偏好',
          title: '两个人对 lamb 的想法不同',
          copy: "把 likes lamb 和 doesn't like lamb 分别放到人物旁。这里理解的是关系与省略，不是人物分类。",
          submitLabel: '核对两个人的偏好',
          support: ['重听 but 前后是谁的想法。', "doesn't 代替前面重复的 like lamb。", "小猫用 I like apples, but he doesn't. 示范省略，再回到课文。"],
          assistedPrompt: '跟着人物头像完成最后一条偏好。',
          responseFields: [
            responseField('mrs-bird', 'single', 'Mrs. Bird', [option('likes-lamb', 'likes lamb'), option('does-not-like-lamb', "doesn't like lamb")]),
            responseField('mr-bird', 'single', 'her husband', [option('likes-lamb', 'likes lamb'), option('does-not-like-lamb', "doesn't like lamb")])
          ]
        }),
        'picnic-supply': childContext({
          eyebrow: '变化偏好 · Mia 与 Ben',
          title: '换人物，省略关系还成立吗？',
          copy: "Mia likes apples, but Ben doesn't. 把完整意义放回两个人旁边。",
          submitLabel: '完成变化偏好',
          support: ['先找 but 前的人物。', "doesn't 仍替代 like apples。", '把完整意思说出来，再选择。'],
          assistedPrompt: '跟随人物顺序完成最后一项。',
          responseFields: [
            responseField('mia', 'single', 'Mia', [option('likes-apples', 'likes apples'), option('does-not-like-apples', "doesn't like apples")]),
            responseField('ben', 'single', 'Ben', [option('likes-apples', 'likes apples'), option('does-not-like-apples', "doesn't like apples")])
          ]
        })
      }
    },
    'L49-M06': {
      title: '数量备货台',
      stepLabel: '6 / 9 · 听懂线索',
      completedFeedback: '商品、同一块 steak 的指代和一磅 mince 已全部绑定。',
      contexts: {
        'breakfast-stall': childContext({
          eyebrow: 'D07–D08 · 商品、指代与数量',
          title: '哪一块？还要多少？',
          copy: '辨认老板建议的 steak，把 this nice piece 和 that piece 指向同一块，再加入 a pound of mince。',
          submitLabel: '核对备货台',
          support: ['重听 D07–D08，只修出现冲突的槽。', '先找 What about 后的商品，再找 this / that 指向。', '小猫用两只不同面包示范同一件物品的 this → that，再回到两块 steak。'],
          assistedPrompt: '按商品、同一块、数量三格完成最后纠正。',
          responseFields: [
            responseField('suggestedItem', 'single', '老板建议什么？', [option('steak', 'some steak'), option('beef', 'some beef'), option('chicken', 'a chicken')]),
            responseField('referencedPiece', 'single', '顾客选中哪一块？', [option('striped-piece', '带条纹的那块 steak'), option('round-piece', '圆形的另一块 steak')]),
            responseField('quantityItem', 'single', '还要加入什么？', [option('one-pound-mince', 'a pound of mince'), option('two-pounds-mince', 'two pounds of mince'), option('one-chicken', 'a chicken')])
          ],
          sceneItems: ['两块可区分的 steak', '一磅秤', 'mince 托盘']
        }),
        'picnic-supply': childContext({
          eyebrow: '变化备货台 · 野餐补给',
          title: '换商品，重新绑定三条线索',
          copy: '找出建议的 sandwich、同一只圆形三明治，再加入两瓶水。',
          submitLabel: '完成变化备货',
          support: ['重听变化句，只修错槽。', 'this 与 that 仍指向同一件商品。', '先确认商品，再确认数量。'],
          assistedPrompt: '跟随三个高亮槽完成最后动作。',
          responseFields: [
            responseField('suggestedItem', 'single', '摊主建议什么？', [option('sandwich', 'sandwich'), option('cake', 'cake')]),
            responseField('referencedPiece', 'single', '客人选中哪一只？', [option('round-sandwich', '圆形三明治'), option('square-sandwich', '方形三明治')]),
            responseField('quantityItem', 'single', '还要加入什么？', [option('two-bottles-water', 'two bottles of water'), option('one-bottle-water', 'one bottle of water')])
          ]
        })
      }
    },
    'L49-M07': {
      title: '接受还是拒绝',
      stepLabel: '7 / 9 · 听懂线索',
      completedFeedback: 'chicken 已移出订单，人物偏好、说实话和否定中的 either 已对齐。',
      contexts: {
        'breakfast-stall': childContext({
          eyebrow: 'D09–D11 · 拒绝与真实偏好',
          title: '为什么 chicken 不能进订单？',
          copy: '先执行拒绝，再补全 Mr. Bird、肉店老板和 To tell you the truth / either 的意思。',
          submitLabel: '核对拒绝证据',
          support: ['重听 No, thank you. 后面的三句话。', '否定句中的“也”使用 either，不是 too。', '小猫用 I do not like milk either. 示范，再回到 chicken。'],
          assistedPrompt: '按订单动作、两个人偏好、话语表达逐项纠正。',
          responseFields: [
            responseField('orderAction', 'single', 'chicken 应该怎样处理？', [option('remove-chicken', '移出订单'), option('add-chicken', '加入订单')]),
            responseField('birdPreference', 'mapping', 'Mr. Bird 的偏好', [], { rows: [
              { mappingKey: 'likes', label: 'likes', options: [option('steak', 'steak'), option('chicken', 'chicken')] },
              { mappingKey: 'dislikes', label: 'does not like', options: [option('chicken', 'chicken'), option('steak', 'steak')] }
            ] }),
            responseField('butcherPreference', 'single', '肉店老板呢？', [option('does-not-like-chicken-either', "doesn't like chicken either"), option('likes-chicken-too', 'likes chicken too')]),
            responseField('truthPhrase', 'single', 'To tell you the truth', [option('speaking-honestly', '说实话'), option('changing-topic', '换个话题')]),
            responseField('negativeAlso', 'single', '否定句中的“也”', [option('either', 'either'), option('too', 'too')])
          ]
        }),
        'picnic-supply': childContext({
          eyebrow: '变化拒绝 · milk',
          title: '换成 milk，再判断一次',
          copy: '移除 milk，并重新组织客人与摊主的否定偏好。',
          submitLabel: '完成变化拒绝',
          support: ['先听 No, thank you.。', 'likes 和 dislikes 要分别放对。', '否定中的“也”仍用 either。'],
          assistedPrompt: '跟随五格提示完成最后纠正。',
          responseFields: [
            responseField('orderAction', 'single', 'milk 应该怎样处理？', [option('remove-milk', '移出订单'), option('add-milk', '加入订单')]),
            responseField('guestPreference', 'mapping', '客人的偏好', [], { rows: [
              { mappingKey: 'likes', label: 'likes', options: [option('juice', 'juice'), option('milk', 'milk')] },
              { mappingKey: 'dislikes', label: 'does not like', options: [option('milk', 'milk'), option('juice', 'juice')] }
            ] }),
            responseField('vendorPreference', 'single', '摊主呢？', [option('does-not-like-milk-either', "doesn't like milk either"), option('likes-milk-too', 'likes milk too')]),
            responseField('truthPhrase', 'single', 'To tell you the truth', [option('speaking-honestly', '说实话'), option('changing-topic', '换个话题')]),
            responseField('negativeAlso', 'single', '否定句中的“也”', [option('either', 'either'), option('too', 'too')])
          ]
        })
      }
    },
    'L49-M08': {
      title: '还原订单证据链',
      stepLabel: '8 / 9 · 听懂线索',
      completedFeedback: '订单动作、英语依据和六段交易顺序已经一致。',
      contexts: {
        'breakfast-stall': childContext({
          eyebrow: '完整订单 · 三处错误',
          title: '改订单，还要说明为什么',
          copy: '移除 lamb 和 chicken、补上 mince，再给三次修改配英语依据，最后还原六段交易。',
          submitLabel: '核对完整证据链',
          support: ['只标出第一处冲突，不清空已完成部分。', '先让订单与三句原话一致，再检查顺序。', '小猫示范另一张订单如何“动作 → 依据 → 顺序”核对。'],
          assistedPrompt: '跟随第一处冲突完成最后修改，再亲自提交整条证据链。',
          responseFields: [
            responseField('finalOrder', 'set', 'Mrs. Bird 最终购买什么？', [option('beef', 'beef'), option('steak', 'steak'), option('mince', 'mince'), option('lamb', 'lamb'), option('chicken', 'chicken')]),
            responseField('evidence', 'mapping', '把修改和原话配对', [], { rows: [
              { mappingKey: 'replaceLamb', label: '把 lamb 换成 beef', options: [option('beef-please', 'Beef, please.'), option('no-thank-you', 'No, thank you.')] },
              { mappingKey: 'removeChicken', label: '移除 chicken', options: [option('no-thank-you', 'No, thank you.'), option('beef-please', 'Beef, please.')] },
              { mappingKey: 'addMince', label: '补上 mince', options: [option('pound-of-mince', 'a pound of mince, too'), option('nice-piece', 'a nice piece')] }
            ] }),
            responseField('transaction', 'ordered', '按交易发生顺序排列', [
              option('ask-meat', '询问要肉'), option('choose-beef-or-lamb', '牛/羊二选一'),
              option('compare-lamb-preference', '说明 lamb 偏好'), option('choose-steak', '选 steak'),
              option('add-mince', '加一磅 mince'), option('refuse-chicken', '拒绝 chicken 并说明偏好')
            ])
          ]
        }),
        'picnic-supply': childContext({
          eyebrow: '变化订单 · 三处错误',
          title: '换成野餐单，证据链还连得上吗？',
          copy: '修成 bread、fruit、water，并给三次修改配依据和交易顺序。',
          submitLabel: '完成变化证据链',
          support: ['只修第一处冲突。', '先核订单，再配依据。', '最后检查六段顺序有没有跳步。'],
          assistedPrompt: '跟随冲突标记完成最后一处，再提交整条链。',
          responseFields: [
            responseField('finalOrder', 'set', '最终野餐订单', [option('bread', 'bread'), option('fruit', 'fruit'), option('water', 'water'), option('cake', 'cake'), option('milk', 'milk')]),
            responseField('evidence', 'mapping', '把修改和依据配对', [], { rows: [
              { mappingKey: 'replaceCake', label: 'cake 换成 bread', options: [option('bread-please', 'Bread, please.'), option('no-thank-you', 'No, thank you.')] },
              { mappingKey: 'removeMilk', label: '移除 milk', options: [option('no-thank-you', 'No, thank you.'), option('bread-please', 'Bread, please.')] },
              { mappingKey: 'addWater', label: '补上 water', options: [option('two-bottles-water', 'two bottles of water'), option('one-cake', 'one cake')] }
            ] }),
            responseField('transaction', 'ordered', '排列变化交易', [
              option('ask-food', '询问食物'), option('choose-bread-or-cake', 'bread/cake 二选一'),
              option('compare-fruit-preference', '说明 fruit 偏好'), option('choose-fruit', '选择 fruit'),
              option('add-water', '加入 water'), option('refuse-milk', '拒绝 milk')
            ])
          ]
        })
      }
    },
    'L49-M09': {
      title: '教材问题延迟回收',
      stepLabel: '9 / 9 · 听懂线索',
      completedFeedback: "Mr. Bird likes steak, but he doesn't like chicken. Lesson 49 的订单已核清。",
      growth: {
        title: '备货台完整了！',
        copy: '整幕九个微任务已完成，市集从 state-1 成长到 state-2，下一站是 Lesson 50。'
      },
      contexts: {
        'breakfast-stall': childContext({
          eyebrow: '回到开场问题 · 不重播全文',
          title: 'What does Mr. Bird like?',
          copy: '先独立回答，再拼出完整偏好句，并从订单指出 Mrs. Bird 真正购买的三项。',
          submitLabel: '交出最终核单',
          support: ['回想后半段出现 likes steak 的句子。', '完整句还要保留 but 和 does not like chicken。', '小猫用另一个人的偏好句示范结构，再让你回到 Mr. Bird。'],
          assistedPrompt: '跟随句子槽完成最后一个词，再亲自选择三项订单。',
          responseFields: [
            responseField('textbookAnswer', 'single', 'Mr. Bird likes…', [option('steak', 'steak'), option('chicken', 'chicken'), option('lamb', 'lamb')]),
            responseField('preferenceSentence', 'ordered', '拼出完整偏好句', [
              option('he', 'He'), option('likes', 'likes'), option('steak', 'steak'), option('but', 'but'),
              option('does-not', "doesn't"), option('like', 'like'), option('chicken', 'chicken')
            ], { repeatableOptionIds: ['he'] }),
            responseField('purchasedItems', 'set', 'Mrs. Bird 最终买了', [option('beef', 'beef'), option('steak', 'steak'), option('mince', 'mince'), option('lamb', 'lamb'), option('chicken', 'chicken')])
          ]
        }),
        'picnic-supply': childContext({
          eyebrow: '变化回收 · 新人物',
          title: '新客人喜欢什么？',
          copy: '独立回答并拼完整偏好句，再核对三项野餐订单。',
          submitLabel: '完成变化核单',
          support: ['回想 likes 后的商品。', 'but 后保留否定偏好。', '按主语、likes、but、does not like 的骨架重组。'],
          assistedPrompt: '跟随句槽完成最后动作，再提交。',
          responseFields: [
            responseField('finalAnswer', 'single', '新客人 likes…', [option('juice', 'juice'), option('milk', 'milk'), option('bread', 'bread')]),
            responseField('preferenceSentence', 'ordered', '拼出完整偏好句', [
              option('she', 'She'), option('likes', 'likes'), option('juice', 'juice'), option('but', 'but'),
              option('does-not', "doesn't"), option('like', 'like'), option('milk', 'milk')
            ], { repeatableOptionIds: ['she'] }),
            responseField('purchasedItems', 'set', '最终野餐订单', [option('bread', 'bread'), option('fruit', 'fruit'), option('water', 'water'), option('cake', 'cake'), option('milk', 'milk')])
          ]
        })
      }
    }
  };

  const LESSON49_AUTHORED_MICROTASKS = LESSON49_MICROTASKS.map(task => {
    const authored = LESSON49_PRESENTATIONS[task.microtaskId];
    return {
      ...task,
      presentation: {
        title: authored.title,
        stepLabel: authored.stepLabel,
        completedFeedback: authored.completedFeedback,
        ...(authored.growth ? { growth: authored.growth } : {})
      },
      contextVariants: Object.fromEntries(
        Object.entries(task.contextVariants).map(([contextId, context]) => [
          contextId,
          { ...context, ...authored.contexts[contextId] }
        ])
      )
    };
  });

  function target(targetId, title, evidenceModes, contextIds) {
    return {
      targetId,
      title,
      evidenceModes,
      contextIds,
      supportLadder: [...SUPPORT_LADDER]
    };
  }

  function unit({
    number,
    unitId: authoredUnitId,
    districtId = 'first-book-49-60',
    lessons,
    landmarkId,
    title,
    status = 'planned',
    publicationScope = 'course-catalog',
    runtimeProfile = 'five-beat-v1',
    voiceBaselineId = 'nce-youth-v1',
    contexts,
    targets,
    tasks = [],
    vocabulary = [],
    lessonContent = {},
    microtasksByBeat = {},
    retiredMicrotaskResumeTargets = {},
    authoredContent = {},
    entities = {},
    experience = null,
    experienceRevision,
    shuffleProtocol,
    reviewContexts,
    firstSessionRetrievalPolicy,
    finalizationProtocol,
    audioReviewContract
  }) {
    const unitId = authoredUnitId || `FLC-U${String(number).padStart(2, '0')}`;
    const unitTargets = targets.map((definition, index) => target(
      `${unitId}-T${String(index + 1).padStart(2, '0')}`,
      definition.title,
      definition.evidenceModes,
      [...contexts]
    ));
    return {
      unitId,
      districtId,
      lessonIds: lessons.map(lesson => `lesson${lesson}`),
      landmarkId,
      title,
      status,
      publicationScope,
      runtimeProfile,
      voiceBaselineId,
      beats: BEATS.map((beat, beatIndex) => {
        const authored = tasks[beatIndex];
        const authoredMicrotasks = microtasksByBeat[beat.beatId] || [];
        if (!authored) {
          return {
            ...beat,
            ...(authoredMicrotasks.length > 0
              ? { completionRule: 'all-required', microtasks: authoredMicrotasks }
              : {})
          };
        }
        return {
          ...beat,
          ...(authoredMicrotasks.length > 0
            ? { completionRule: 'all-required', microtasks: authoredMicrotasks }
            : {}),
          task: {
            taskId: `${unitId}:${beat.beatId}:task`,
            contextId: authored.contextId,
            answerKeyByContext: { ...authored.answerKeyByContext },
            ...(authored.presentation
              ? { presentation: authored.presentation }
              : {}),
            ...(authored.formativeBinding
              ? { formativeBinding: { ...authored.formativeBinding } }
              : {})
          }
        };
      }),
      targets: unitTargets,
      vocabulary,
      lessonContent,
      retiredMicrotaskResumeTargets,
      authoredContent,
      entities,
      ...(experienceRevision ? { experienceRevision } : {}),
      ...(shuffleProtocol ? { shuffleProtocol } : {}),
      ...(reviewContexts ? { reviewContexts } : {}),
      ...(firstSessionRetrievalPolicy ? { firstSessionRetrievalPolicy } : {}),
      ...(finalizationProtocol ? { finalizationProtocol } : {}),
      ...(audioReviewContract ? { audioReviewContract } : {}),
      ...(experience ? { experience } : {})
    };
  }

  function sourceIdRange(prefix, first, last) {
    return Array.from({ length: last - first + 1 }, (_, index) => (
      `${prefix}${String(first + index).padStart(2, '0')}`
    ));
  }

  function storyAnswerFairness(targetEvidenceChannel, targetEvidenceSourceRefs, options = {}) {
    return {
      targetEvidenceChannel,
      targetEvidenceSourceRefs: [...targetEvidenceSourceRefs],
      intentionalPreSubmitSupport: (options.intentionalPreSubmitSupport || [])
        .map(support => ({ ...support })),
      ...(options.candidateLabelVisibility
        ? { candidateLabelVisibility: options.candidateLabelVisibility }
        : {}),
      ...(options.candidateLanguageBoundary
        ? { candidateLanguageBoundary: options.candidateLanguageBoundary }
        : {})
    };
  }

  function curriculumAcceptedUnit({
    unitId,
    districtId,
    lessons,
    unitLabel,
    targets,
    lessonContent,
    sourceTargetCoverage,
    firstSessionEvidencePlan,
    voiceBaselineId,
    audioReviewContract,
    curriculumContract
  }) {
    return {
      unitId,
      districtId,
      lessonIds: lessons.map(lesson => `lesson${lesson}`),
      unitLabel,
      status: 'curriculum-accepted',
      publicationScope: 'catalog-only',
      runtimeProfile: 'not-authored',
      beats: [],
      targets,
      lessonContent,
      sourceTargetCoverage,
      ...(firstSessionEvidencePlan ? { firstSessionEvidencePlan } : {}),
      ...(voiceBaselineId ? { voiceBaselineId } : {}),
      ...(audioReviewContract ? { audioReviewContract } : {}),
      curriculumContract,
      authoredContent: {},
      entities: {},
      vocabulary: []
    };
  }

  function curriculumAuthoredUnit({
    unitId,
    districtId,
    lessons,
    unitLabel,
    title,
    contexts,
    targets,
    lessonContent,
    sourceTargetCoverage,
    firstSessionEvidencePlan,
    voiceBaselineId,
    audioReviewContract,
    curriculumContract,
    authoredContent,
    entities,
    experience,
    experienceRevision
  }) {
    return {
      unitId,
      districtId,
      lessonIds: lessons.map(lesson => `lesson${lesson}`),
      unitLabel,
      title,
      status: 'candidate',
      publicationScope: 'local-poc',
      runtimeProfile: 'story-stage-v1',
      experienceRevision,
      beats: [],
      targets: targets.map(item => ({ ...item, contextIds: [...contexts] })),
      lessonContent,
      sourceTargetCoverage,
      firstSessionEvidencePlan,
      voiceBaselineId,
      audioReviewContract,
      curriculumContract,
      authoredContent,
      entities,
      experience,
      vocabulary: []
    };
  }

  const NCE_U02_TARGETS = [
    {
      targetId: 'NCE-U02-T01',
      tier: 'core',
      title: '听懂衣帽间取物从请求、交票、报号、拿错到找回的因果与顺序，并判断最终结果',
      evidenceModes: ['dialogue-sequence-comprehension'],
      structureRefs: [],
      primarySourceRefs: [
        'L03-Q01', ...sourceIdRange('L03-D', 1, 12),
        'L03-W05', 'L03-W06', 'L03-W07', 'L03-W10'
      ],
      inheritedSourceRefs: [],
      firstSessionBoundary: '一次整段理解证据，不把 12 句拆成 12 道题'
    },
    {
      targetId: 'NCE-U02-T02',
      tier: 'core',
      title: '用归属问句询问，并按真实关系作肯定或否定短答',
      evidenceModes: ['ownership-polarity-exchange'],
      structureRefs: ['GS-OWNERSHIP-QUESTION-SG', 'GS-BE-SHORT-ANSWER-SG'],
      primarySourceRefs: [
        'L03-D08', 'L03-D09', 'L03-D11', ...sourceIdRange('L04-P', 1, 15)
      ],
      inheritedSourceRefs: [],
      firstSessionBoundary: '少量代表变体形成证据，其余完整接触或回访'
    },
    {
      targetId: 'NCE-U02-T03',
      tier: 'core',
      title: '用 my/your 和肯定／否定陈述表达归属对比',
      evidenceModes: ['possessor-relation-contrast'],
      structureRefs: ['GS-POSSESSIVE-DETERMINER', 'GS-BE-NEGATIVE-SG'],
      primarySourceRefs: ['L03-D06', 'L03-D09', 'L03-W04', 'L04-E01', 'L04-E02'],
      inheritedSourceRefs: [],
      firstSessionBoundary: '功能词在完整关系中取证，不做孤立词义卡'
    },
    {
      targetId: 'NCE-U02-T04',
      tier: 'support-communication',
      title: "在取物和交还时使用礼貌请求及 Here is/Here's ... 完成递交",
      evidenceModes: ['request-and-handover-use'],
      structureRefs: ['GS-REQUEST-HANDOVER', 'GS-HERE-PRESENTATION'],
      primarySourceRefs: [
        'L03-D01', 'L03-D02', 'L03-D05', 'L03-W02', 'L03-W03', 'L03-N01'
      ],
      inheritedSourceRefs: [],
      firstSessionBoundary: '以完整表达和动作关系取证，不单独扩成训练章节'
    },
    {
      targetId: 'NCE-U02-T05',
      tier: 'core',
      title: '判断 it 回指当前已提及物品，并在省略名词后继续理解问答',
      evidenceModes: ['anaphora-resolution'],
      structureRefs: ['GS-PRONOUN-IT-REFERENCE'],
      primarySourceRefs: ['L03-D10', 'L03-D11', 'L03-N04'],
      inheritedSourceRefs: ['L01-W09'],
      firstSessionBoundary: '至少一个变化物品的关系证据；不考术语'
    },
    {
      targetId: 'NCE-U02-T06',
      tier: 'support-communication',
      title: '在拿错物品时恰当使用道歉、称谓和感谢',
      evidenceModes: ['social-repair-and-thanks'],
      structureRefs: ['GS-POLITE-REPAIR'],
      primarySourceRefs: [
        'L03-D03', 'L03-D07', 'L03-D12', 'L03-W08', 'L03-W09', 'L03-N02', 'L03-N03'
      ],
      inheritedSourceRefs: [],
      firstSessionBoundary: '在交际用途里取证，不做 sorry/sir 图片题或独立章节'
    },
    {
      targetId: 'NCE-U02-T07',
      tier: 'lexical-sample',
      title: '将本单元新增用品、场所、号码和人物关系词连接到意义，并辨别复现词',
      evidenceModes: ['lexical-form-meaning-association'],
      structureRefs: [],
      primarySourceRefs: [
        'L03-W01', 'L03-W05', 'L03-W06', 'L03-W07', 'L03-W10',
        ...sourceIdRange('L04-W', 1, 5),
        ...sourceIdRange('L04-P', 1, 15)
      ],
      inheritedSourceRefs: [],
      firstSessionBoundary: '首课只抽五个语义代表；其余完整接触后按表现回访'
    }
  ];

  const NCE_U02_SOURCE_TARGET_COVERAGE = [
    {
      sourceRefs: ['L03-I01', 'L03-Q01'],
      coverage: { 'NCE-U02-T01': 'eligible-evidence' },
      prohibitedInference: '不得据此声称已教授 does'
    },
    {
      sourceRefs: sourceIdRange('L03-D', 1, 2),
      coverage: { 'NCE-U02-T01': 'support', 'NCE-U02-T04': 'eligible-evidence' },
      prohibitedInference: '不得据此声称每句话都必须单独做题'
    },
    {
      sourceRefs: sourceIdRange('L03-D', 3, 5),
      coverage: {
        'NCE-U02-T01': 'eligible-evidence',
        'NCE-U02-T04': 'eligible-evidence',
        'NCE-U02-T06': 'support',
        'NCE-U02-T07': 'support'
      },
      prohibitedInference: '不得据此声称记住 5 号即理解完整情节'
    },
    {
      sourceRefs: sourceIdRange('L03-D', 6, 7),
      coverage: {
        'NCE-U02-T01': 'eligible-evidence',
        'NCE-U02-T03': 'eligible-evidence',
        'NCE-U02-T06': 'eligible-evidence'
      },
      prohibitedInference: '不得据此声称一次否认即掌握所有否定'
    },
    {
      sourceRefs: sourceIdRange('L03-D', 8, 9),
      coverage: {
        'NCE-U02-T01': 'support',
        'NCE-U02-T02': 'eligible-evidence',
        'NCE-U02-T03': 'eligible-evidence'
      },
      prohibitedInference: '不得据此声称点击 No 即掌握归属对比'
    },
    {
      sourceRefs: sourceIdRange('L03-D', 10, 12),
      coverage: {
        'NCE-U02-T01': 'eligible-evidence',
        'NCE-U02-T02': 'eligible-evidence',
        'NCE-U02-T05': 'eligible-evidence',
        'NCE-U02-T06': 'eligible-evidence'
      },
      prohibitedInference: '不得据此声称背诵 it 术语即理解指代'
    },
    {
      sourceRefs: sourceIdRange('L03-W', 1, 10),
      coverage: {
        'NCE-U02-T01': 'support',
        'NCE-U02-T03': 'support',
        'NCE-U02-T04': 'support',
        'NCE-U02-T06': 'support',
        'NCE-U02-T07': 'eligible-evidence'
      },
      prohibitedInference: '不得据此声称 10 词都要当天双通道正式考察'
    },
    {
      sourceRefs: sourceIdRange('L03-N', 1, 4),
      coverage: {
        'NCE-U02-T04': 'support',
        'NCE-U02-T05': 'support',
        'NCE-U02-T06': 'support'
      },
      prohibitedInference: '不得据此把 Notes 变成术语考试'
    },
    {
      sourceRefs: sourceIdRange('L03-Z', 1, 12),
      coverage: {},
      prohibitedInference: '不得据此声称查看中文等于听懂英语'
    },
    {
      sourceRefs: ['L04-I01'],
      coverage: {},
      prohibitedInference: '教材活动指令本身不形成独立 Target'
    },
    {
      sourceRefs: sourceIdRange('L04-P', 1, 10),
      coverage: {
        'NCE-U02-T02': 'eligible-evidence',
        'NCE-U02-T03': 'eligible-evidence',
        'NCE-U02-T07': 'eligible-evidence'
      },
      prohibitedInference: '不得为复现词创建新的词汇 Source ID'
    },
    {
      sourceRefs: [
        ...sourceIdRange('L04-P', 11, 15),
        ...sourceIdRange('L04-W', 1, 5)
      ],
      coverage: {
        'NCE-U02-T02': 'eligible-evidence',
        'NCE-U02-T03': 'support',
        'NCE-U02-T07': 'eligible-evidence'
      },
      prohibitedInference: '不得据此复制 U01 全量双通道方案'
    },
    {
      sourceRefs: ['L04-E01', 'L04-E02'],
      coverage: {
        'NCE-U02-T02': 'optional',
        'NCE-U02-T03': 'optional',
        'NCE-U02-T06': 'optional'
      },
      prohibitedInference: '不得据此声称已完成书写、拼写或手机输入能力'
    }
  ];

  const NCE_U02_FIRST_SESSION_EVIDENCE_PLAN = {
    policyId: 'first-session-representative-retrieval-v1',
    frozenOn: '2026-08-31',
    sourceContactPolicy: 'all-required-sources-before-unit-completion',
    promptEvidenceSourceRefs: NCE_U02_FIRST_SESSION_PROMPT_EVIDENCE_SOURCE_REFS,
    lexicalEvidenceSourceRefs: NCE_U02_FIRST_SESSION_LEXICAL_EVIDENCE_SOURCE_REFS,
    remainingPromptPolicy: 'exposure-then-performance-driven-review',
    remainingVocabularyPolicy: 'exposure-then-performance-driven-review',
    evidenceSlots: [
      {
        slotId: 'NCE-U02-E01',
        targetBindings: [
          {
            targetId: 'NCE-U02-T01',
            evidenceMode: 'dialogue-sequence-comprehension'
          }
        ],
        sourceRefs: ['L03-Q01', ...sourceIdRange('L03-D', 1, 12)],
        retrievalOpportunityQuota: 1,
        boundary: '整段只形成一次结果，不按十二句话拆题'
      },
      {
        slotId: 'NCE-U02-E02',
        targetBindings: [
          {
            targetId: 'NCE-U02-T02',
            evidenceMode: 'ownership-polarity-exchange'
          },
          {
            targetId: 'NCE-U02-T03',
            evidenceMode: 'possessor-relation-contrast'
          }
        ],
        sourceRefs: [
          'L03-D06', ...sourceIdRange('L03-D', 8, 11),
          ...NCE_U02_FIRST_SESSION_PROMPT_EVIDENCE_SOURCE_REFS
        ],
        retrievalOpportunityQuota: 2,
        requirements: [
          'one-positive-relation',
          'one-negative-relation',
          'my-and-your-both-observed'
        ]
      },
      {
        slotId: 'NCE-U02-E03',
        targetBindings: [
          {
            targetId: 'NCE-U02-T04',
            evidenceMode: 'request-and-handover-use'
          },
          {
            targetId: 'NCE-U02-T06',
            evidenceMode: 'social-repair-and-thanks'
          }
        ],
        sourceRefs: [
          'L03-D01', 'L03-D02', 'L03-D03', 'L03-D05', 'L03-D07', 'L03-D12'
        ],
        retrievalOpportunityQuota: 1,
        boundary: '请求、递交、道歉和感谢只在一条完整交际链中取证'
      },
      {
        slotId: 'NCE-U02-E04',
        targetBindings: [
          {
            targetId: 'NCE-U02-T05',
            evidenceMode: 'anaphora-resolution'
          }
        ],
        sourceRefs: ['L03-D10', 'L03-D11', 'L03-N04'],
        retrievalOpportunityQuota: 1,
        requiresAuthoredTransfer: true,
        boundary: '必须换一个物品关系后判断 it，不考术语或原句背诵'
      },
      {
        slotId: 'NCE-U02-E05',
        targetBindings: [
          {
            targetId: 'NCE-U02-T07',
            evidenceMode: 'lexical-form-meaning-association'
          }
        ],
        sourceRefs: NCE_U02_FIRST_SESSION_LEXICAL_EVIDENCE_SOURCE_REFS,
        retrievalOpportunityQuota: 4,
        boundary: '只抽取物品、场所、新用品和人物关系各一个代表词；明确指路的号码牌动作只作接触'
      }
    ]
  };

  const NCE_U02_EXPERIENCE_REVISION = 'lesson3-4-v2';
  const NCE_U02_LEGACY_ASSET_BASE = '/poc/lesson1-2-experience/assets';
  const NCE_U02_ASSET_BASE = '/poc/lesson3-4-experience/assets';

  function nceU02Asset(baseName, assetBase = NCE_U02_ASSET_BASE) {
    return {
      png: `${assetBase}/${baseName}.png`,
      webp: `${assetBase}/${baseName}.webp`,
      avif: `${assetBase}/${baseName}.avif`
    };
  }

  const NCE_U02_ENTITIES = {
    'explorer-cat': {
      entityId: 'explorer-cat',
      kind: 'guide',
      label: '探险小猫',
      assets: {
        preferred: '/assets/adventure-map/mascot/loader/frame-2-route-page-20260806-01-192.webp'
      }
    },
    visitor: {
      entityId: 'visitor',
      kind: 'character',
      label: '来客',
      roleId: 'visitor',
      assets: nceU02Asset('character-adult-man-cutout-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    attendant: {
      entityId: 'attendant',
      kind: 'character',
      label: '衣帽间服务员',
      roleId: 'cloakroom-attendant',
      assets: nceU02Asset('character-adult-woman-cutout-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    'ticket-five': {
      entityId: 'ticket-five', kind: 'prop', label: '5 号牌',
      sourceRef: 'L03-W05', assets: nceU02Asset('item-ticket-five-v1')
    },
    'umbrella-star': {
      entityId: 'umbrella-star', kind: 'prop', label: '星星雨伞',
      sourceRef: 'L03-W01', assets: nceU02Asset('item-umbrella-star-v1')
    },
    'umbrella-stripe': {
      entityId: 'umbrella-stripe', kind: 'prop', label: '条纹雨伞',
      sourceRef: 'L03-W01', assets: nceU02Asset('item-umbrella-stripe-v1')
    },
    'umbrella-dot': {
      entityId: 'umbrella-dot', kind: 'prop', label: '圆点雨伞',
      sourceRef: 'L03-W01', assets: nceU02Asset('item-umbrella-dot-v1')
    },
    pen: {
      entityId: 'pen', kind: 'item', label: '钢笔', sourceRef: 'L04-P01',
      assets: nceU02Asset('item-pen-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    pencil: {
      entityId: 'pencil', kind: 'item', label: '铅笔', sourceRef: 'L04-P02',
      assets: nceU02Asset('item-pencil-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    book: {
      entityId: 'book', kind: 'item', label: '书', sourceRef: 'L04-P03',
      assets: nceU02Asset('item-book-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    watch: {
      entityId: 'watch', kind: 'item', label: '手表', sourceRef: 'L04-P04',
      assets: nceU02Asset('item-watch-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    coat: {
      entityId: 'coat', kind: 'item', label: '外套', sourceRef: 'L04-P05',
      assets: nceU02Asset('item-coat-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    dress: {
      entityId: 'dress', kind: 'item', label: '连衣裙', sourceRef: 'L04-P06',
      assets: nceU02Asset('item-dress-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    skirt: {
      entityId: 'skirt', kind: 'item', label: '裙子', sourceRef: 'L04-P07',
      assets: nceU02Asset('item-skirt-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    shirt: {
      entityId: 'shirt', kind: 'item', label: '衬衫', sourceRef: 'L04-P08',
      assets: nceU02Asset('item-shirt-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    car: {
      entityId: 'car', kind: 'item', label: '汽车', sourceRef: 'L04-P09',
      assets: nceU02Asset('scene-car-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    house: {
      entityId: 'house', kind: 'item', label: '房子', sourceRef: 'L04-P10',
      assets: nceU02Asset('scene-house-v1', NCE_U02_LEGACY_ASSET_BASE)
    },
    suit: {
      entityId: 'suit', kind: 'item', label: '西装', sourceRef: 'L04-P11',
      assets: nceU02Asset('item-suit-v1')
    },
    school: {
      entityId: 'school', kind: 'item', label: '学校', sourceRef: 'L04-P12',
      assets: nceU02Asset('scene-school-v1')
    },
    teacher: {
      entityId: 'teacher', kind: 'person-card', label: '老师', sourceRef: 'L04-P13',
      assets: nceU02Asset('character-teacher-card-v1')
    },
    son: {
      entityId: 'son', kind: 'person-card', label: '儿子', sourceRef: 'L04-P14',
      assets: nceU02Asset('character-son-card-v1')
    },
    daughter: {
      entityId: 'daughter', kind: 'person-card', label: '女儿', sourceRef: 'L04-P15',
      assets: nceU02Asset('character-daughter-card-v1')
    }
  };

  const NCE_U02_AUTHORED_CONTENT = {
    'NCE-U02-C-AUDIO-FAILURE': {
      kind: 'recovery',
      title: '这句英语还没有播放成功',
      copy: '英文会留在原位。点“再听一次”，听完后才能继续。',
      actionLabel: '再听一次'
    },
    'NCE-U02-C-SAVE-FAILURE': {
      kind: 'recovery',
      title: '进度还没有保存好',
      copy: '不用重答，留在这里再保存一次。',
      actionLabel: '重新保存'
    },
    'NCE-U02-C-COMPLETION': {
      kind: 'completion',
      kicker: 'Lesson 3–4 完成',
      sceneTitle: '故事顺利结束',
      sceneInstruction: '两把雨伞都回到了正确的位置',
      title: '来客拿回了自己的雨伞',
      copy: '今天的故事已经完成。下一次见到新物品，还可以继续问 Is this your ...?',
      restartLabel: '重新体验',
      leaveLabel: '继续',
      leaveHref: '/'
    }
  };

  const EARLY_BOOK_STORY_STAGE_UI_COPY = {
    progress: {
      openLabel: '打开阶段地图',
      currentPrefix: '打开阶段地图，当前第',
      currentMiddle: '阶段，共',
      currentSuffix: '阶段'
    },
    settings: {
      visibleLabel: '设置', ariaLabel: '打开设置', heartsLabel: '冒险心',
      title: '学习设置', copy: '重新开始会清除本单元的本地进度。',
      restartLabel: '重新开始', returnLabel: '返回学习'
    },
    stageMap: {
      title: '选择学习阶段', closeLabel: '关闭',
      copy: '已完成阶段可回演，跳过的角色阶段可补做。',
      completed: '已完成 · 回演', skipped: '已跳过 · 补做',
      current: '正在学习', locked: '尚未到达',
      stagePrefix: '第', stageMiddle: '阶段：', statusSeparator: '，'
    },
    candidates: {
      neutralAriaPrefix: '候选人物 ', neutralVisiblePrefix: '候选 ', selectPrefix: '选择'
    },
    hearts: { remainingPrefix: '还剩 ', remainingSuffix: ' 颗冒险心' },
    audio: {
      retryLabel: '再听一次', playQuestionLabel: '播放问句', playLineLabel: '播放这一句',
      playGroupLabel: '播放这一组', playingCopy: '正在播放英文……'
    },
    task: {
      lockedStoryCopy: '声音会按故事顺序播放。听完整段后，问题才会出现。',
      lockedQuestionCopy: '先听清问句，再选择。', selectScenePersonCopy: '点击场景中的人物',
      stepPrefix: '第 ', stepMiddle: ' 步 / 共 ', stepSuffix: ' 步',
      groupPrefix: '第 ', groupMiddle: ' 组 / 共 ', groupSuffix: ' 组',
      groupListenPrefix: '先听完这一组的 ', groupListenSuffix: ' 句话。',
      sampledQuestion: '刚才问到的是哪一件？',
      albumCopy: '每张图只要点一次。声音播完，号码牌就会留下一个小印记。',
      albumPlayPrefix: '播放', albumPlaySuffix: '问句', heardLabel: '已听', listenLabel: '点我听',
      segmentPrefix: '第 ', segmentMiddle: ' 段 · '
    },
    role: {
      choosePrefix: '我来演', assignedPrefix: '这次你演', assignedSuffix: '。',
      startLabel: '开始演完整段', skipLabel: '跳过这个角色',
      linePrefix: '第 ', lineMiddle: ' 句 / 共 ', lineSuffix: ' 句',
      childSpeakerLabel: '轮到你', hiddenLineCopy: '先想一想，这个角色会怎么说？',
      revealLabel: '揭晓并播放', partnerSpeakingCopy: '对方正在说……'
    },
    rescue: { actionLabel: '听小猫示范' },
    stageSession: {
      replayKicker: '单阶段回演', makeupKicker: '正式补做',
      replayCompleteTitle: '这一段回演完了', makeupCompleteTitle: '这个角色已经补做',
      replayCompleteCopy: '主线进度没有改变。',
      makeupCompleteCopy: '“已跳过”已经替换为“已完成”。',
      returnLabel: '返回主线', exitLabel: '退出',
      replayBanner: '单阶段回演 · 不改主线进度',
      makeupBanner: '正式补做 · 完成后替换跳过记录'
    },
    completion: {
      skippedTitle: '主线故事走完了',
      skippedCopy: '角色扮演按你的选择标记为已跳过。可以打开阶段地图补做，不会伪装成已经完成。',
      reviewLabel: '次日复习'
    },
    saveFailureCopy: '进度暂时没有保存好。'
  };

  const NCE_U02_EXPERIENCE = {
    schemaVersion: 1,
    documentTitle: 'Lesson 3–4 · 5号牌与两把雨伞',
    unitTitle: '5号牌与两把雨伞',
    stageCount: 10,
    storageKey: `poc:learning-experience:NCE-U02:${NCE_U02_EXPERIENCE_REVISION}`,
    navigation: {
      mode: 'compact-progress-stage-map',
      completedStageAction: 'replay',
      skippedStageAction: 'make-up',
      futureStageAction: 'locked'
    },
    stageTransition: {
      mode: 'story-consequence-auto',
      showCompletionInterstitial: false
    },
    uiCopy: EARLY_BOOK_STORY_STAGE_UI_COPY,
    adventureHearts: {
      maximum: 3,
      rescuePartnerEntityId: 'explorer-cat',
      rescueResult: 'assisted'
    },
    rescueExample: {
      entityId: 'explorer-cat',
      audioRefs: ['L04-P01'],
      title: '探险小猫换个例子',
      copy: '先听小猫用另一件物品示范。听完后三颗冒险心会补满，这一小题从头再来。'
    },
    completionLedgers: {
      journey: 'completed-or-truthfully-skipped',
      firstSession: 'independent-supported-or-assisted-evidence',
      longTermMastery: 'cross-day-review-only'
    },
    reviewRun: {
      href: '/poc/lesson3-4-review/',
      returnHref: '/poc/lesson3-4-experience/',
      availability: { mode: 'next-local-calendar-day' },
      itemRange: [2, 4],
      durationSecondsRange: [45, 90],
      heartPool: 'isolated-three-hearts',
      zeroAction: 'restart-entire-review-run',
      copy: {
        documentTitle: '5号牌与两把雨伞 · 次日复习',
        entryKicker: 'Lesson 3–4 · 次日复习',
        entryTitle: '再访星灯衣帽间',
        entryBody: '用三条新线索，看看昨天的英语还能不能自己找回来。',
        startLabel: '开始复习',
        unavailableTitle: '先完成昨天的故事',
        unavailableBody: '课程主线走完后，次日复习才会单独开放。',
        returnLabel: '回到课程',
        listenLabel: '播放英文',
        retryLabel: '再听一次',
        playingCopy: '正在播放英文……',
        audioFailureCopy: '声音没有播放成功，题目还没有开始。',
        question: '刚才听到的是哪一个？',
        rescueLabel: '听小猫换例示范',
        rescueFeedback: '探险心用完了，小猫来换例示范。',
        retryFeedback: '再听一遍，答案还留在这里。',
        correctFeedback: '找到了。',
        heartAriaPrefix: '还剩',
        heartAriaSuffix: '颗复习冒险心',
        completeTitle: '今天的线索找回来了',
        completeBody: '这次复习已经单独记录，不会改写昨天的课程冒险心。',
        restartLabel: '再复习一次'
      },
      items: [
        { reviewId: 'NCE-U02-R01', sourceRef: 'L04-P02', prompt: '选择刚才问到的物品。', entityIds: ['pen', 'pencil', 'book'], acceptedEntityId: 'pencil' },
        { reviewId: 'NCE-U02-R02', sourceRef: 'L03-D08', prompt: '故事里的回答是哪一句？', options: [{ optionId: 'yes', label: 'Yes, it is.' }, { optionId: 'no', label: "No, it isn't." }], acceptedOptionId: 'no' },
        { reviewId: 'NCE-U02-R03', sourceRef: 'L04-P14', prompt: '选择刚才问到的人物。', entityIds: ['teacher', 'son', 'daughter'], acceptedEntityId: 'son' }
      ]
    },
    scene: {
      sceneId: 'starlight-cloakroom',
      backgroundWide: `${NCE_U02_LEGACY_ASSET_BASE}/starlight-station-bg-v2-wide.avif`,
      backgroundWideFallback: `${NCE_U02_LEGACY_ASSET_BASE}/starlight-station-bg-v2-wide.webp`,
      backgroundPortrait: `${NCE_U02_LEGACY_ASSET_BASE}/starlight-station-bg-v2-portrait.avif`,
      backgroundPortraitFallback: `${NCE_U02_LEGACY_ASSET_BASE}/starlight-station-bg-v2-portrait.webp`,
      visitorEntityId: 'visitor',
      attendantEntityId: 'attendant',
      actorEntityIds: ['visitor', 'attendant'],
      completionPropEntityIds: ['umbrella-star', 'ticket-five'],
      progressPropEntityId: 'ticket-five'
    },
    roles: {
      visitor: { entityId: 'visitor', label: '来客' },
      'cloakroom-attendant': { entityId: 'attendant', label: '衣帽间服务员' }
    },
    support: {
      firstWrong: '再听一次刚才的声音线索。',
      secondWrong: '看清现在柜台上的人或物，再判断它们的关系。'
    },
    completionContentRef: 'NCE-U02-C-COMPLETION',
    audioFailureContentRef: 'NCE-U02-C-AUDIO-FAILURE',
    saveFailureContentRef: 'NCE-U02-C-SAVE-FAILURE',
    stages: [
      {
        stageId: 'NCE-U02-S01', microtaskId: 'NCE-U02-S01', lessonId: 'lesson3',
        kind: 'listen', title: '走进衣帽间',
        instruction: '点亮声音牌，听听这里叫什么',
        prompt: '这里是客人寄放外套和雨伞的地方。',
        actionLabel: '听 cloakroom', audioRefs: ['L03-W10'],
        propEntityIds: [],
        exposureRefs: ['L03-I01', 'L03-W10'], evidenceRefs: ['L03-W10']
      },
      {
        stageId: 'NCE-U02-S02', microtaskId: 'NCE-U02-S02', lessonId: 'lesson3',
        kind: 'dialogue-comprehension', title: '听完整故事',
        instruction: '听完 12 句话，再回答一个问题',
        prompt: '最后，来客拿回了自己的雨伞吗？',
        startLabel: '开始听完整对话',
        audioRefs: sourceIdRange('L03-D', 1, 12),
        options: [
          { optionId: 'returned', label: '拿回了' },
          { optionId: 'not-returned', label: '还没有' }
        ],
        answerRule: { type: 'select-one', acceptedOptionId: 'returned' },
        affectsAdventureHearts: true,
        answerFairness: storyAnswerFairness(
          'discourse-understanding',
          ['L03-Q01', ...sourceIdRange('L03-D', 1, 12)]
        ),
        successAudioRefs: ['L03-D12'],
        exposureRefs: ['L03-Q01', ...sourceIdRange('L03-D', 1, 12)],
        evidenceRefs: ['L03-D01', 'L03-D02', ...sourceIdRange('L03-D', 6, 12)]
      },
      {
        stageId: 'NCE-U02-S03', microtaskId: 'NCE-U02-S03', lessonId: 'lesson3',
        kind: 'entity-action', title: '递交号码牌',
        instruction: '直接点击服务员，号码牌会自动交到她手里',
        prompt: '谁能根据号码帮来客找回东西？',
        entityIds: ['visitor', 'attendant'],
        answerRule: { type: 'select-one', acceptedEntityId: 'attendant' },
        answerFairness: storyAnswerFairness('guided-story-action', [], {
          intentionalPreSubmitSupport: [
            { surface: 'direct-story-instruction', entityId: 'attendant' }
          ]
        }),
        successAudioRefs: sourceIdRange('L03-D', 1, 5),
        propEntityIds: ['ticket-five'],
        exposureRefs: [
          ...sourceIdRange('L03-D', 1, 5),
          'L03-W02', 'L03-W03', 'L03-W04', 'L03-W05', 'L03-W06', 'L03-W07', 'L03-W09'
        ],
        evidenceRefs: []
      },
      {
        stageId: 'NCE-U02-S04', microtaskId: 'NCE-U02-S04', lessonId: 'lesson3',
        kind: 'ownership-choice', title: '第一把雨伞',
        instruction: '听来客怎么判断是不是自己的',
        prompt: '服务员第一次递来的雨伞，和来客的是同一把吗？',
        propEntityIds: ['umbrella-stripe'],
        options: [
          { optionId: 'mine', label: '是他的' },
          { optionId: 'not-mine', label: '不是他的' }
        ],
        answerRule: { type: 'select-one', acceptedOptionId: 'not-mine' },
        affectsAdventureHearts: true,
        answerFairness: storyAnswerFairness(
          'discourse-understanding', ['L03-D06', 'L03-D07']
        ),
        successAudioRefs: ['L03-D06', 'L03-D07'],
        exposureRefs: [
          'L03-D06', 'L03-D07', 'L03-W01', 'L03-W08',
          'L03-N01', 'L03-N02', 'L03-N03', 'L03-N04'
        ],
        evidenceRefs: ['L03-D06', 'L03-D07', 'L03-W01']
      },
      {
        stageId: 'NCE-U02-S05', microtaskId: 'NCE-U02-S05', lessonId: 'lesson3',
        kind: 'sequence-choice', title: '再找一把',
        affectsAdventureHearts: true,
        instruction: '在同一页连续判断两把雨伞',
        rounds: [
          {
            roundId: 'first-umbrella', propEntityId: 'umbrella-stripe',
            prompt: 'Is this your umbrella?', promptAudioRefs: ['L03-D08'],
            options: [
              { optionId: 'yes', label: 'Yes, it is.' },
              { optionId: 'no', label: "No, it isn't." }
            ],
            answerRule: { type: 'select-one', acceptedOptionId: 'no' },
            answerFairness: storyAnswerFairness(
              'communication-structure', ['L03-D08', 'L03-D09']
            ),
            successAudioRefs: ['L03-D09']
          },
          {
            roundId: 'second-umbrella', propEntityId: 'umbrella-star',
            prompt: 'Is this it?', promptAudioRefs: ['L03-D10'],
            options: [
              { optionId: 'yes', label: 'Yes, it is.' },
              { optionId: 'no', label: "No, it isn't." }
            ],
            answerRule: { type: 'select-one', acceptedOptionId: 'yes' },
            answerFairness: storyAnswerFairness(
              'communication-structure', ['L03-D10', 'L03-D11']
            ),
            successAudioRefs: ['L03-D11', 'L03-D12']
          }
        ],
        exposureRefs: sourceIdRange('L03-D', 8, 12),
        evidenceRefs: sourceIdRange('L03-D', 8, 12)
      },
      {
        stageId: 'NCE-U02-S06', microtaskId: 'NCE-U02-S06', lessonId: 'lesson3',
        kind: 'role-enactment', title: '角色扮演',
        instruction: '选一个角色，从头演到尾',
        prompt: '对方的台词会自动播放。轮到你时，再揭晓自己的台词。',
        roleMode: 'choose-first', roles: ['visitor', 'cloakroom-attendant'],
        dialogueRefs: sourceIdRange('L03-D', 1, 12), skippableRoleRound: true,
        exposureRefs: sourceIdRange('L03-D', 1, 12), evidenceRefs: []
      },
      {
        stageId: 'NCE-U02-S07', microtaskId: 'NCE-U02-S07', lessonId: 'lesson4',
        kind: 'sampled-prompt-groups', title: '换物问一问',
        affectsAdventureHearts: true,
        instruction: '每组先听五句话，再找出刚才听到的物品',
        groups: [
          { groupId: 'desk-things', label: '第1组', sourceRefs: sourceIdRange('L04-P', 1, 5), entityIds: ['pen', 'pencil', 'book', 'watch', 'coat'], retrievalSourceRef: 'L04-P03', acceptedEntityId: 'book' },
          { groupId: 'places-and-clothes', label: '第2组', sourceRefs: sourceIdRange('L04-P', 6, 10), entityIds: ['dress', 'skirt', 'shirt', 'car', 'house'], retrievalSourceRef: 'L04-P08', acceptedEntityId: 'shirt' },
          { groupId: 'people-and-new-things', label: '第3组', sourceRefs: sourceIdRange('L04-P', 11, 15), entityIds: ['suit', 'school', 'teacher', 'son', 'daughter'], retrievalSourceRef: 'L04-P12', acceptedEntityId: 'school' }
        ],
        exposureRefs: ['L04-I01', ...sourceIdRange('L04-P', 1, 15), ...sourceIdRange('L04-W', 1, 5)],
        evidenceRefs: ['L04-P03', 'L04-P08', 'L04-P12']
      },
      {
        stageId: 'NCE-U02-S08', microtaskId: 'NCE-U02-S08', lessonId: 'lesson4',
        kind: 'sequence-choice', title: '肯定与否定',
        affectsAdventureHearts: true,
        instruction: '先回答，再找出 it 指的是谁',
        rounds: [
          {
            roundId: 'watch-positive', propEntityId: 'watch', prompt: 'Is this your watch?',
            promptAudioRefs: ['L04-P04'],
            options: [{ optionId: 'yes', label: 'Yes, it is.' }, { optionId: 'no', label: "No, it isn't." }],
            answerRule: { type: 'select-one', acceptedOptionId: 'yes' },
            successAudioRefs: ['L03-D11'],
            answerFairness: storyAnswerFairness('structure-use', ['L04-P04'])
          },
          {
            roundId: 'suit-negative', propEntityId: 'suit', prompt: 'Is this your suit?',
            promptAudioRefs: ['L04-P11'],
            options: [{ optionId: 'yes', label: 'Yes, it is.' }, { optionId: 'no', label: "No, it isn't." }],
            answerRule: { type: 'select-one', acceptedOptionId: 'no' },
            successAudioRefs: ['L03-D09'],
            answerFairness: storyAnswerFairness('structure-use', ['L04-P11'])
          },
          {
            roundId: 'it-transfer', propEntityId: 'coat', prompt: '服务员举起了新物品。这里的 it 指哪一件？',
            promptAudioRefs: ['L03-D10'], entityIds: ['watch', 'suit', 'coat'],
            answerRule: { type: 'select-one', acceptedEntityId: 'coat' }, successAudioRefs: ['L03-D11'],
            answerFairness: storyAnswerFairness(
              'discourse-understanding', ['L03-D10', 'L03-D11']
            )
          }
        ],
        exposureRefs: ['L04-P04', 'L04-P11', 'L04-W01', 'L03-D10', 'L03-D11'],
        evidenceRefs: ['L04-P04', 'L04-P11', 'L04-W01']
      },
      {
        stageId: 'NCE-U02-S09', microtaskId: 'NCE-U02-S09', lessonId: 'lesson4',
        kind: 'entity-action', title: '人物关系',
        affectsAdventureHearts: true,
        instruction: '听问句，找到对应的人物',
        prompt: '听清人物关系，再从三个人里选择。',
        promptAudioRefs: ['L04-P15'], entityIds: ['teacher', 'son', 'daughter'],
        hideEntityLabelsUntilCorrect: true,
        answerRule: { type: 'select-one', acceptedEntityId: 'daughter' },
        answerFairness: storyAnswerFairness('audio-form', ['L04-P15'], {
          candidateLabelVisibility: 'after-correct'
        }),
        successAudioRefs: ['L04-W05'],
        exposureRefs: ['L04-P15', 'L04-W05'], evidenceRefs: ['L04-P15', 'L04-W05']
      },
      {
        stageId: 'NCE-U02-S10', microtaskId: 'NCE-U02-S10', lessonId: 'lesson3',
        kind: 'role-enactment', title: '换个角色',
        instruction: '这次演刚才没演的角色',
        prompt: '系统已经把另一个角色留给你。完成后，今天的故事就演完了。',
        roleMode: 'unplayed-role', roles: ['visitor', 'cloakroom-attendant'],
        dialogueRefs: sourceIdRange('L03-D', 1, 12), skippableRoleRound: true,
        exposureRefs: sourceIdRange('L03-D', 1, 12), evidenceRefs: []
      }
    ]
  };

  const NCE_U03_TARGETS = [
    {
      targetId: 'NCE-U03-T01', tier: 'core',
      title: '听懂迎新介绍的顺序、人物与国籍，并回答教材总问题',
      evidenceModes: ['dialogue-comprehension'], structureRefs: [],
      primarySourceRefs: ['L05-Q01', ...sourceIdRange('L05-D', 1, 20)], inheritedSourceRefs: [],
      firstSessionBoundary: '整段理解只形成一次结果，不把二十句拆成二十道题'
    },
    {
      targetId: 'NCE-U03-T02', tier: 'core',
      title: '用 This is ... 介绍他人，并用 Nice to meet you. 完成初次见面',
      evidenceModes: ['introduction-and-greeting'], structureRefs: ['GS-THIS-IS-INTRODUCTION'],
      primarySourceRefs: ['L05-D03', 'L05-D06', 'L05-D08', 'L05-D09', 'L05-D11', 'L05-D12', 'L05-D14', 'L05-D15', 'L05-D17', 'L05-D18', 'L05-D20'],
      inheritedSourceRefs: [], firstSessionBoundary: '在迎新关系中取证，不做脱离人物的短语卡'
    },
    {
      targetId: 'NCE-U03-T03', tier: 'core',
      title: '按人物或物品选择 He、She、It，并保持 be 动词一致',
      evidenceModes: ['pronoun-reference-choice'], structureRefs: ['GS-SUBJECT-PRONOUN-SG', 'GS-BE-AFFIRMATIVE-SG'],
      primarySourceRefs: ['L05-D05', 'L05-D07', 'L05-D10', 'L05-D13', 'L05-D16', 'L05-D19', ...sourceIdRange('L06-P', 1, 6)],
      inheritedSourceRefs: [], firstSessionBoundary: '只在清楚的指代关系中判断，不考术语名称'
    },
    {
      targetId: 'NCE-U03-T04', tier: 'core',
      title: '连接人物、国籍、汽车牌子与国家属性',
      evidenceModes: ['profile-nationality-and-make-match'], structureRefs: ['GS-BE-AFFIRMATIVE-SG'],
      primarySourceRefs: ['L05-D05', 'L05-D07', 'L05-D10', 'L05-D13', 'L05-D16', 'L05-D19', ...sourceIdRange('L06-P', 1, 6), ...sourceIdRange('L06-W', 1, 10)],
      inheritedSourceRefs: [], firstSessionBoundary: '先完整接触，再抽人物与汽车各三个代表形成证据'
    },
    {
      targetId: 'NCE-U03-T05', tier: 'core',
      title: '在人物和汽车之间迁移肯定陈述，并区分人称与物称',
      evidenceModes: ['person-object-transfer'], structureRefs: ['GS-SUBJECT-PRONOUN-SG'],
      primarySourceRefs: [...sourceIdRange('L06-P', 1, 6), 'L06-E01', 'L06-E02'],
      inheritedSourceRefs: [], firstSessionBoundary: '页面只做口头和选择迁移，书写保持可选且不阻断'
    },
    {
      targetId: 'NCE-U03-T06', tier: 'lexical-sample',
      title: '将迎新词、国籍词和汽车牌子连接到人物或图像',
      evidenceModes: ['lexical-form-meaning-association'], structureRefs: [],
      primarySourceRefs: [...sourceIdRange('L05-W', 1, 14), ...sourceIdRange('L06-W', 1, 10)],
      inheritedSourceRefs: [], firstSessionBoundary: '不连续安排孤立词题；词汇跟随人物、汽车和完整句出现'
    }
  ];

  const NCE_U04_TARGETS = [
    {
      targetId: 'NCE-U04-T01', tier: 'core',
      title: '听懂 Robert 与 Sophie 从姓名、国籍到职业的完整对话，并回答教材总问题',
      evidenceModes: ['dialogue-comprehension'], structureRefs: [],
      primarySourceRefs: ['L07-Q01', ...sourceIdRange('L07-D', 1, 16)], inheritedSourceRefs: [],
      firstSessionBoundary: '完整对话只形成一次理解结果，不逐句设题'
    },
    {
      targetId: 'NCE-U04-T02', tier: 'core',
      title: '用 I am ... 和 My name is ... 介绍自己',
      evidenceModes: ['self-introduction'], structureRefs: ['GS-I-AM', 'GS-MY-NAME-IS'],
      primarySourceRefs: ['L07-D01', 'L07-D02', 'L07-D03', 'L07-D04', 'L07-N01', 'L07-N02'],
      inheritedSourceRefs: ['L05-D08'], firstSessionBoundary: '在两人见面场景中取证，不做机械缩写辨认'
    },
    {
      targetId: 'NCE-U04-T03', tier: 'core',
      title: '询问和回答国籍，区分 Yes, I am. 与 No, I am not.',
      evidenceModes: ['nationality-question-answer'], structureRefs: ['GS-BE-QUESTION-YOU', 'GS-BE-SHORT-ANSWER-I'],
      primarySourceRefs: [...sourceIdRange('L07-D', 5, 10), 'L07-N04'], inheritedSourceRefs: [],
      firstSessionBoundary: '至少观察一肯定一否定，再完成一次 What nationality 迁移'
    },
    {
      targetId: 'NCE-U04-T04', tier: 'core',
      title: "用 What's your job? 询问职业，并用 I'm a/an ... 回答",
      evidenceModes: ['job-question-answer'], structureRefs: ['GS-WHATS-YOUR-JOB', 'GS-I-AM-A-JOB'],
      primarySourceRefs: [...sourceIdRange('L07-D', 11, 16), 'L07-N03', ...sourceIdRange('L08-P', 1, 10)], inheritedSourceRefs: [],
      firstSessionBoundary: '职业词必须留在问答或人物图像中，不连续做十道词卡'
    },
    {
      targetId: 'NCE-U04-T05', tier: 'core',
      title: '按人物性别与关系使用 he、she、his、her',
      evidenceModes: ['third-person-job-reference'], structureRefs: ['GS-SUBJECT-PRONOUN-SG', 'GS-POSSESSIVE-DETERMINER'],
      primarySourceRefs: ['L08-E02', ...sourceIdRange('L08-P', 1, 10)], inheritedSourceRefs: ['L05-D05', 'L05-D07'],
      firstSessionBoundary: '用新职业图作口头迁移；书面造句保持非阻断扩展'
    },
    {
      targetId: 'NCE-U04-T06', tier: 'lexical-sample',
      title: '将十种职业词连接到清楚、可辨认的人物图像',
      evidenceModes: ['audio-form-job-match', 'word-form-job-match'], structureRefs: [],
      primarySourceRefs: [...sourceIdRange('L08-W', 1, 10), ...sourceIdRange('L08-P', 1, 10)], inheritedSourceRefs: [],
      firstSessionBoundary: '十词全部接触，只抽三项听辨与四项迁移形成当天证据'
    }
  ];

  function earlyBookCoverage(unitId, rows) {
    return rows.map(row => ({ ...row, prohibitedInference: row.prohibitedInference || '不得把一次点击等同于长期掌握' }));
  }

  const NCE_U03_SOURCE_TARGET_COVERAGE = earlyBookCoverage('NCE-U03', [
    { sourceRefs: ['L05-I01', 'L05-Q01'], coverage: { 'NCE-U03-T01': 'eligible-evidence' }, prohibitedInference: '教材问题只检查整段理解，不直接显示答案' },
    { sourceRefs: sourceIdRange('L05-D', 1, 5), coverage: { 'NCE-U03-T01': 'eligible-evidence', 'NCE-U03-T02': 'support', 'NCE-U03-T03': 'support' } },
    { sourceRefs: sourceIdRange('L05-D', 6, 20), coverage: { 'NCE-U03-T01': 'eligible-evidence', 'NCE-U03-T02': 'eligible-evidence', 'NCE-U03-T03': 'eligible-evidence', 'NCE-U03-T04': 'eligible-evidence' } },
    { sourceRefs: sourceIdRange('L05-W', 1, 14), coverage: { 'NCE-U03-T02': 'support', 'NCE-U03-T04': 'support', 'NCE-U03-T06': 'eligible-evidence' } },
    { sourceRefs: sourceIdRange('L05-N', 1, 3), coverage: { 'NCE-U03-T02': 'support', 'NCE-U03-T03': 'support' }, prohibitedInference: 'Notes 不转成术语考试' },
    { sourceRefs: sourceIdRange('L05-Z', 1, 20), coverage: {}, prohibitedInference: '查看参考译文不等于听懂英语' },
    { sourceRefs: ['L06-I01'], coverage: {}, prohibitedInference: '活动指令不形成独立学习结果' },
    { sourceRefs: sourceIdRange('L06-P', 1, 6), coverage: { 'NCE-U03-T03': 'eligible-evidence', 'NCE-U03-T04': 'eligible-evidence', 'NCE-U03-T05': 'eligible-evidence' } },
    { sourceRefs: sourceIdRange('L06-W', 1, 10), coverage: { 'NCE-U03-T04': 'support', 'NCE-U03-T06': 'eligible-evidence' } },
    { sourceRefs: ['L06-E01', 'L06-E02'], coverage: { 'NCE-U03-T05': 'optional' }, prohibitedInference: '未完成书写不阻断网站单元完成' }
  ]);

  const NCE_U04_SOURCE_TARGET_COVERAGE = earlyBookCoverage('NCE-U04', [
    { sourceRefs: ['L07-I01', 'L07-Q01'], coverage: { 'NCE-U04-T01': 'eligible-evidence' }, prohibitedInference: '教材问题只检查整段理解，不直接显示答案' },
    { sourceRefs: sourceIdRange('L07-D', 1, 4), coverage: { 'NCE-U04-T01': 'eligible-evidence', 'NCE-U04-T02': 'eligible-evidence' } },
    { sourceRefs: sourceIdRange('L07-D', 5, 10), coverage: { 'NCE-U04-T01': 'eligible-evidence', 'NCE-U04-T03': 'eligible-evidence' } },
    { sourceRefs: sourceIdRange('L07-D', 11, 16), coverage: { 'NCE-U04-T01': 'eligible-evidence', 'NCE-U04-T04': 'eligible-evidence' } },
    { sourceRefs: sourceIdRange('L07-W', 1, 11), coverage: { 'NCE-U04-T02': 'support', 'NCE-U04-T03': 'support', 'NCE-U04-T04': 'support' } },
    { sourceRefs: sourceIdRange('L07-N', 1, 4), coverage: { 'NCE-U04-T02': 'support', 'NCE-U04-T03': 'support', 'NCE-U04-T04': 'support' }, prohibitedInference: 'Notes 不转成术语考试' },
    { sourceRefs: sourceIdRange('L07-Z', 1, 16), coverage: {}, prohibitedInference: '查看参考译文不等于听懂英语' },
    { sourceRefs: ['L08-I01'], coverage: {}, prohibitedInference: '活动指令不形成独立学习结果' },
    { sourceRefs: sourceIdRange('L08-P', 1, 10), coverage: { 'NCE-U04-T04': 'eligible-evidence', 'NCE-U04-T05': 'eligible-evidence', 'NCE-U04-T06': 'eligible-evidence' } },
    { sourceRefs: sourceIdRange('L08-W', 1, 10), coverage: { 'NCE-U04-T06': 'eligible-evidence' } },
    { sourceRefs: ['L08-E01', 'L08-E02'], coverage: { 'NCE-U04-T02': 'optional', 'NCE-U04-T05': 'optional' }, prohibitedInference: '未完成书写不阻断网站单元完成' }
  ]);

  function earlyBookEvidencePlan(unitId, slots) {
    const selectedByUnit = {
      'NCE-U03': {
        promptEvidenceSourceRefs: sourceIdRange('L06-P', 1, 6),
        lexicalEvidenceSourceRefs: [
          'L05-W06', 'L05-W07', 'L05-W08', 'L05-W11', 'L05-W12', 'L05-W13',
          ...sourceIdRange('L06-W', 1, 4)
        ]
      },
      'NCE-U04': {
        promptEvidenceSourceRefs: sourceIdRange('L08-P', 1, 10),
        lexicalEvidenceSourceRefs: [
          'L07-W06', 'L07-W07', 'L07-W08', 'L07-W10', 'L07-W11',
          ...sourceIdRange('L08-W', 1, 5)
        ]
      }
    };
    const selected = selectedByUnit[unitId] || {
      promptEvidenceSourceRefs: [], lexicalEvidenceSourceRefs: []
    };
    const selectedRefs = [
      ...selected.promptEvidenceSourceRefs,
      ...selected.lexicalEvidenceSourceRefs
    ];
    return {
      policyId: 'first-session-representative-retrieval-v1', frozenOn: '2026-08-31',
      sourceContactPolicy: 'all-required-sources-before-unit-completion',
      remainingPromptPolicy: 'exposure-then-performance-driven-review',
      remainingVocabularyPolicy: 'exposure-then-performance-driven-review',
      ...selected,
      evidenceSlots: slots.map((slot, index) => ({
        slotId: `${unitId}-E${String(index + 1).padStart(2, '0')}`,
        ...slot,
        ...(index === slots.length - 1
          ? { sourceRefs: [...new Set([...(slot.sourceRefs || []), ...selectedRefs])] }
          : {})
      }))
    };
  }

  const NCE_U03_FIRST_SESSION_EVIDENCE_PLAN = earlyBookEvidencePlan('NCE-U03', [
    { targetBindings: [{ targetId: 'NCE-U03-T01', evidenceMode: 'dialogue-comprehension' }], sourceRefs: ['L05-Q01', ...sourceIdRange('L05-D', 1, 20)], retrievalOpportunityQuota: 1 },
    { targetBindings: [{ targetId: 'NCE-U03-T02', evidenceMode: 'introduction-and-greeting' }], sourceRefs: ['L05-D03', 'L05-D08'], retrievalOpportunityQuota: 1 },
    { targetBindings: [{ targetId: 'NCE-U03-T03', evidenceMode: 'pronoun-reference-choice' }], sourceRefs: ['L05-D05', 'L05-D07', 'L06-P05'], retrievalOpportunityQuota: 3 },
    { targetBindings: [{ targetId: 'NCE-U03-T04', evidenceMode: 'profile-nationality-and-make-match' }], sourceRefs: ['L05-D10', 'L05-D13', 'L05-D16', 'L06-P01', 'L06-P02', 'L06-P05'], retrievalOpportunityQuota: 6 },
    { targetBindings: [{ targetId: 'NCE-U03-T05', evidenceMode: 'person-object-transfer' }, { targetId: 'NCE-U03-T06', evidenceMode: 'lexical-form-meaning-association' }], sourceRefs: ['L06-P01', 'L06-P02', 'L06-P05'], retrievalOpportunityQuota: 3 }
  ]);

  const NCE_U04_FIRST_SESSION_EVIDENCE_PLAN = earlyBookEvidencePlan('NCE-U04', [
    { targetBindings: [{ targetId: 'NCE-U04-T01', evidenceMode: 'dialogue-comprehension' }], sourceRefs: ['L07-Q01', ...sourceIdRange('L07-D', 1, 16)], retrievalOpportunityQuota: 1 },
    { targetBindings: [{ targetId: 'NCE-U04-T02', evidenceMode: 'self-introduction' }], sourceRefs: ['L07-D01', 'L07-D02', 'L07-D04'], retrievalOpportunityQuota: 1 },
    { targetBindings: [{ targetId: 'NCE-U04-T03', evidenceMode: 'nationality-question-answer' }], sourceRefs: sourceIdRange('L07-D', 5, 10), retrievalOpportunityQuota: 3 },
    { targetBindings: [{ targetId: 'NCE-U04-T04', evidenceMode: 'job-question-answer' }, { targetId: 'NCE-U04-T05', evidenceMode: 'third-person-job-reference' }], sourceRefs: ['L07-D13', 'L07-D14', 'L07-D15', 'L07-D16', 'L08-P06', 'L08-P07'], retrievalOpportunityQuota: 4 },
    { targetBindings: [{ targetId: 'NCE-U04-T06', evidenceMode: 'audio-form-job-match' }], sourceRefs: ['L08-P01', 'L08-P06', 'L08-P10'], retrievalOpportunityQuota: 3 }
  ]);

  function earlyBookAsset(basePath, baseName) {
    return {
      png: `${basePath}/${baseName}.png`,
      webp: `${basePath}/${baseName}.webp`,
      avif: `${basePath}/${baseName}.avif`
    };
  }

  const NCE_U03_ASSET_BASE = '/poc/lesson5-6-experience/assets';
  const NCE_U04_ASSET_BASE = '/poc/lesson7-8-experience/assets';
  const NCE_U03_ENTITIES = Object.fromEntries([
    ['mr-blake', 'character', '布莱克先生', 'character-mr-blake-v1'],
    ['sophie', 'character', 'Sophie', 'character-sophie-v1'],
    ['hans', 'person-card', 'Hans', 'character-hans-v1'],
    ['naoko', 'person-card', 'Naoko', 'character-naoko-v1'],
    ['changwoo', 'person-card', 'Chang-woo', 'character-changwoo-v1'],
    ['luming', 'person-card', 'Luming', 'character-luming-v1'],
    ['xiaohui', 'person-card', 'Xiaohui', 'character-xiaohui-v1'],
    ['volvo', 'vehicle', 'Volvo', 'vehicle-volvo-v1'],
    ['peugeot', 'vehicle', 'Peugeot', 'vehicle-peugeot-v1'],
    ['mercedes', 'vehicle', 'Mercedes', 'vehicle-mercedes-v1'],
    ['toyota', 'vehicle', 'Toyota', 'vehicle-toyota-v1'],
    ['mini', 'vehicle', 'Mini', 'vehicle-mini-v1'],
    ['ford', 'vehicle', 'Ford', 'vehicle-ford-v1']
  ].map(([entityId, kind, label, baseName]) => [entityId, { entityId, kind, label, assets: earlyBookAsset(NCE_U03_ASSET_BASE, baseName) }]));

  const NCE_U04_ENTITIES = {
    robert: { entityId: 'robert', kind: 'character', label: 'Robert', assets: earlyBookAsset(NCE_U04_ASSET_BASE, 'character-robert-v1') },
    sophie: { entityId: 'sophie', kind: 'character', label: 'Sophie', assets: earlyBookAsset(NCE_U03_ASSET_BASE, 'character-sophie-v1') },
    ...Object.fromEntries(LESSON8_JOBS.map(([job, translation], index) => {
      const entityId = job.replaceAll(' ', '-');
      return [entityId, { entityId, kind: 'job-card', label: translation, englishLabel: job, sourceRef: `L08-P${String(index + 1).padStart(2, '0')}`, assets: earlyBookAsset(NCE_U04_ASSET_BASE, `job-${entityId}-v1`) }];
    }))
  };

  function earlyBookCompletion(unitLabel, sceneTitle, sceneInstruction, title, copy) {
    return {
      kind: 'completion', kicker: `${unitLabel} 完成`, sceneTitle, sceneInstruction,
      title, copy, restartLabel: '重新体验', leaveLabel: '继续', leaveHref: '/'
    };
  }

  const NCE_U03_AUTHORED_CONTENT = {
    'NCE-U03-C-COMPLETION': earlyBookCompletion('Lesson 5–6', '迎新名牌全部点亮', '人物、国籍和汽车牌子都已归位', 'Sophie 完成了第一天的介绍', '你听懂了迎新对话，也能在人和汽车之间选择 He、She、It。'),
    'NCE-U03-C-AUDIO-FAILURE': { kind: 'recovery', title: '这句英语还没有播放成功', copy: '英文会留在原位。点“再听一次”，听完后才能继续。', actionLabel: '再听一次' },
    'NCE-U03-C-SAVE-FAILURE': { kind: 'recovery', title: '进度还没有保存好', copy: '不用重答，留在这里再保存一次。', actionLabel: '重新保存' }
  };
  const NCE_U04_AUTHORED_CONTENT = {
    'NCE-U04-C-COMPLETION': earlyBookCompletion('Lesson 7–8', '职业茶会顺利结束', '姓名、国籍和职业都已说清楚', 'Robert 和 Sophie 记住了彼此', '你听懂了完整对话，也能用 his、her 和职业问句继续认识新朋友。'),
    'NCE-U04-C-AUDIO-FAILURE': { kind: 'recovery', title: '这句英语还没有播放成功', copy: '英文会留在原位。点“再听一次”，听完后才能继续。', actionLabel: '再听一次' },
    'NCE-U04-C-SAVE-FAILURE': { kind: 'recovery', title: '进度还没有保存好', copy: '不用重答，留在这里再保存一次。', actionLabel: '重新保存' }
  };

  const NCE_U03_EXPERIENCE_REVISION = 'lesson5-6-v1';
  const NCE_U04_EXPERIENCE_REVISION = 'lesson7-8-v1';
  const NCE_U03_EXPERIENCE = {
    schemaVersion: 2, documentTitle: 'Lesson 5–6 · 星光迎新厅', unitTitle: '星光迎新厅', stageCount: 10,
    storageKey: `poc:learning-experience:NCE-U03:${NCE_U03_EXPERIENCE_REVISION}`,
    uiCopy: EARLY_BOOK_STORY_STAGE_UI_COPY,
    themeId: 'welcome-gallery',
    scene: {
      backgroundWide: `${NCE_U03_ASSET_BASE}/scene-welcome-hall-v1-wide.avif`,
      backgroundWideFallback: `${NCE_U03_ASSET_BASE}/scene-welcome-hall-v1-wide.webp`,
      backgroundPortrait: `${NCE_U03_ASSET_BASE}/scene-welcome-hall-v1-portrait.avif`,
      backgroundPortraitFallback: `${NCE_U03_ASSET_BASE}/scene-welcome-hall-v1-portrait.webp`,
      actorEntityIds: ['mr-blake', 'sophie'], contactSurfaceY: { wide: 75, portrait: 73 }
    },
    roles: {
      teacher: { entityId: 'mr-blake', label: '布莱克先生' },
      'student-group': { entityId: 'sophie', label: '新生代表' }
    },
    support: { firstWrong: '先看人物或汽车，再回想刚才听到的句子。', secondWrong: '只判断当前关系，不用把整句都背出来。' },
    completionContentRef: 'NCE-U03-C-COMPLETION',
    stages: [
      { stageId: 'NCE-U03-S01', microtaskId: 'NCE-U03-S01', lessonId: 'lesson5', kind: 'dialogue-comprehension', title: '迎新介绍开始了', instruction: '先听完整段，再回答教材问题', prompt: 'Chang-woo 来自哪个国家？', startLabel: '开始听迎新对话', audioRefs: sourceIdRange('L05-D', 1, 20), options: [{ optionId: 'south-korean', label: 'South Korean' }, { optionId: 'chinese', label: 'Chinese' }, { optionId: 'japanese', label: 'Japanese' }], answerRule: { acceptedOptionId: 'south-korean' }, answerFairness: storyAnswerFairness('discourse-understanding', ['L05-Q01', ...sourceIdRange('L05-D', 1, 20)]), successAudioRefs: ['L05-D13'], exposureRefs: ['L05-I01', 'L05-Q01', ...sourceIdRange('L05-D', 1, 20)], evidenceRefs: ['L05-Q01', ...sourceIdRange('L05-D', 1, 20)] },
      { stageId: 'NCE-U03-S02', microtaskId: 'NCE-U03-S02', lessonId: 'lesson5', kind: 'entity-action', title: '新生站到了大家面前', instruction: '听完介绍，再点击对应人物', prompt: '布莱克先生刚介绍的是谁？', promptAudioRefs: sourceIdRange('L05-D', 3, 5), entityIds: ['mr-blake', 'sophie'], answerRule: { acceptedEntityId: 'sophie' }, answerFairness: storyAnswerFairness('discourse-understanding', sourceIdRange('L05-D', 3, 5)), successAudioRefs: ['L05-D05'], exposureRefs: sourceIdRange('L05-D', 3, 5), evidenceRefs: ['L05-D03', 'L05-D04', 'L05-D05'] },
      { stageId: 'NCE-U03-S03', microtaskId: 'NCE-U03-S03', lessonId: 'lesson5', kind: 'choice', title: '第一次见面怎么说', instruction: '选一句真正适合初次见面的英语', prompt: 'Sophie 刚认识 Hans，哪句话最合适？', options: [{ optionId: 'meet', label: 'Nice to meet you.' }, { optionId: 'morning', label: 'Good morning.' }, { optionId: 'make', label: 'What make is it?' }], answerRule: { acceptedOptionId: 'meet' }, answerFairness: storyAnswerFairness('communication-structure', ['L05-D06', 'L05-D08']), successAudioRefs: ['L05-D08'], exposureRefs: ['L05-D06', 'L05-D07', 'L05-D08', 'L05-N01', 'L05-N02', 'L05-N03'], evidenceRefs: ['L05-D06', 'L05-D08'] },
      { stageId: 'NCE-U03-S04', microtaskId: 'NCE-U03-S04', lessonId: 'lesson5', kind: 'sequence-choice', title: '人和物品用不同的词', instruction: '同一页完成 Sophie 和汽车两次判断', rounds: [
        { roundId: 'sophie-pronoun', propEntityId: 'sophie', prompt: 'Sophie is a new student. ___ is French.', options: [{ optionId: 'she', label: 'She' }, { optionId: 'he', label: 'He' }, { optionId: 'it', label: 'It' }], answerRule: { acceptedOptionId: 'she' }, answerFairness: storyAnswerFairness('structure-use', ['L05-D05']), successAudioRefs: ['L05-D05'] },
        { roundId: 'mini-pronoun', propEntityId: 'mini', prompt: 'This is a Mini. ___ is English.', options: [{ optionId: 'it', label: 'It' }, { optionId: 'she', label: 'She' }, { optionId: 'he', label: 'He' }], answerRule: { acceptedOptionId: 'it' }, answerFairness: storyAnswerFairness('structure-use', ['L06-P05']), successAudioRefs: ['L06-P05'] }
      ], exposureRefs: ['L05-D04', 'L05-D05', 'L06-P05', 'L06-E01'], evidenceRefs: ['L05-D05', 'L06-P05'] },
      { stageId: 'NCE-U03-S05', microtaskId: 'NCE-U03-S05', lessonId: 'lesson5', kind: 'prompt-album', title: '五张星座名牌', instruction: '点开每名同学，听清对应国籍', groups: [{ groupId: 'classmates', label: '迎新同学', sourceRefs: ['L05-D07', 'L05-D10', 'L05-D13', 'L05-D16', 'L05-D19'], entityIds: ['hans', 'naoko', 'changwoo', 'luming', 'xiaohui'] }], exposureRefs: [...sourceIdRange('L05-W', 1, 14), ...sourceIdRange('L05-N', 1, 3), 'L05-D07', 'L05-D10', 'L05-D13', 'L05-D16', 'L05-D19'], evidenceRefs: ['L05-W06', 'L05-W07', 'L05-W08', 'L05-W11', 'L05-W12', 'L05-W13'] },
      { stageId: 'NCE-U03-S06', microtaskId: 'NCE-U03-S06', lessonId: 'lesson5', kind: 'role-enactment', title: '轮到你主持迎新', instruction: '选布莱克先生或新生代表，把整段对话演一遍', prompt: '对方台词会自动播放。轮到你时先自己说，再揭晓英文。', roleMode: 'choose-first', roles: ['teacher', 'student-group'], dialogueRefs: sourceIdRange('L05-D', 1, 20), exposureRefs: sourceIdRange('L05-D', 1, 20), evidenceRefs: [] },
      { stageId: 'NCE-U03-S07', microtaskId: 'NCE-U03-S07', lessonId: 'lesson6', kind: 'prompt-album', title: '汽车展台亮起来了', instruction: '六辆车都点一次，听完整句', groups: [{ groupId: 'car-makes', label: '六辆汽车', sourceRefs: sourceIdRange('L06-P', 1, 6), entityIds: ['volvo', 'peugeot', 'mercedes', 'toyota', 'mini', 'ford'] }], exposureRefs: ['L06-I01', ...sourceIdRange('L06-P', 1, 6), ...sourceIdRange('L06-W', 1, 10)], evidenceRefs: [...sourceIdRange('L06-P', 1, 6), ...sourceIdRange('L06-W', 1, 4)] },
      { stageId: 'NCE-U03-S08', microtaskId: 'NCE-U03-S08', lessonId: 'lesson6', kind: 'sequence-choice', title: '看牌子找到汽车', instruction: '三个名字，分别找到对应车辆', rounds: [
        { roundId: 'find-volvo', prompt: '哪一辆是 Volvo？', entityIds: ['volvo', 'peugeot', 'mercedes'], hideEntityLabelsUntilCorrect: true, answerRule: { acceptedEntityId: 'volvo' }, answerFairness: storyAnswerFairness('word-form', ['L06-P01'], { candidateLabelVisibility: 'after-correct' }), successAudioRefs: ['L06-P01'] },
        { roundId: 'find-peugeot', prompt: '哪一辆是 Peugeot？', entityIds: ['ford', 'peugeot', 'toyota'], hideEntityLabelsUntilCorrect: true, answerRule: { acceptedEntityId: 'peugeot' }, answerFairness: storyAnswerFairness('word-form', ['L06-P02'], { candidateLabelVisibility: 'after-correct' }), successAudioRefs: ['L06-P02'] },
        { roundId: 'find-mini', prompt: '哪一辆是 Mini？', entityIds: ['mini', 'mercedes', 'volvo'], hideEntityLabelsUntilCorrect: true, answerRule: { acceptedEntityId: 'mini' }, answerFairness: storyAnswerFairness('word-form', ['L06-P05'], { candidateLabelVisibility: 'after-correct' }), successAudioRefs: ['L06-P05'] }
      ], exposureRefs: ['L06-P01', 'L06-P02', 'L06-P05'], evidenceRefs: ['L06-P01', 'L06-P02', 'L06-P05'] },
      { stageId: 'NCE-U03-S09', microtaskId: 'NCE-U03-S09', lessonId: 'lesson6', kind: 'sequence-choice', title: '牌子和国家连在一起', instruction: '看汽车，再选择正确的国家属性', rounds: [
        { roundId: 'volvo-country', propEntityId: 'volvo', prompt: '这辆 Volvo 是……', options: [{ optionId: 'swedish', label: 'Swedish' }, { optionId: 'french', label: 'French' }, { optionId: 'german', label: 'German' }], answerRule: { acceptedOptionId: 'swedish' }, answerFairness: storyAnswerFairness('vocabulary-transfer', ['L06-P01']), successAudioRefs: ['L06-P01'] },
        { roundId: 'peugeot-country', propEntityId: 'peugeot', prompt: '这辆 Peugeot 是……', options: [{ optionId: 'american', label: 'American' }, { optionId: 'french', label: 'French' }, { optionId: 'japanese', label: 'Japanese' }], answerRule: { acceptedOptionId: 'french' }, answerFairness: storyAnswerFairness('vocabulary-transfer', ['L06-P02']), successAudioRefs: ['L06-P02'] },
        { roundId: 'mini-country', propEntityId: 'mini', prompt: '这辆 Mini 是……', options: [{ optionId: 'english', label: 'English' }, { optionId: 'swedish', label: 'Swedish' }, { optionId: 'american', label: 'American' }], answerRule: { acceptedOptionId: 'english' }, answerFairness: storyAnswerFairness('vocabulary-transfer', ['L06-P05']), successAudioRefs: ['L06-P05'] }
      ], exposureRefs: ['L06-P01', 'L06-P02', 'L06-P05', 'L06-W02', 'L06-W03', 'L06-W04'], evidenceRefs: ['L06-P01', 'L06-P02', 'L06-P05'] },
      { stageId: 'NCE-U03-S10', microtaskId: 'NCE-U03-S10', lessonId: 'lesson6', kind: 'sequence-choice', title: '把介绍带到新对象上', instruction: '人物和汽车混在一起，仍要选对主语', rounds: [
        { roundId: 'naoko-transfer', propEntityId: 'naoko', prompt: 'This is Naoko. ___ Japanese.', options: [{ optionId: 'she-is', label: 'She is' }, { optionId: 'he-is', label: 'He is' }, { optionId: 'it-is', label: 'It is' }], answerRule: { acceptedOptionId: 'she-is' }, answerFairness: storyAnswerFairness('structure-use', ['L05-D10']), successAudioRefs: ['L05-D10'] },
        { roundId: 'hans-transfer', propEntityId: 'hans', prompt: 'This is Hans. ___ German.', options: [{ optionId: 'he-is', label: 'He is' }, { optionId: 'she-is', label: 'She is' }, { optionId: 'it-is', label: 'It is' }], answerRule: { acceptedOptionId: 'he-is' }, answerFairness: storyAnswerFairness('structure-use', ['L05-D07']), successAudioRefs: ['L05-D07'] },
        { roundId: 'ford-transfer', propEntityId: 'ford', prompt: 'This is a Ford. ___ American.', options: [{ optionId: 'it-is', label: 'It is' }, { optionId: 'he-is', label: 'He is' }, { optionId: 'she-is', label: 'She is' }], answerRule: { acceptedOptionId: 'it-is' }, answerFairness: storyAnswerFairness('structure-use', ['L06-P06']), successAudioRefs: ['L06-P06'] }
      ], exposureRefs: ['L05-D07', 'L05-D10', 'L06-P06', 'L06-E02'], evidenceRefs: ['L05-D07', 'L05-D10', 'L06-P06'] }
    ]
  };

  const NCE_U04_EXPERIENCE = {
    schemaVersion: 2, documentTitle: 'Lesson 7–8 · 午夜职业茶会', unitTitle: '午夜职业茶会', stageCount: 10,
    storageKey: `poc:learning-experience:NCE-U04:${NCE_U04_EXPERIENCE_REVISION}`,
    uiCopy: EARLY_BOOK_STORY_STAGE_UI_COPY,
    themeId: 'career-salon',
    scene: {
      backgroundWide: `${NCE_U04_ASSET_BASE}/scene-career-salon-v1-wide.avif`,
      backgroundWideFallback: `${NCE_U04_ASSET_BASE}/scene-career-salon-v1-wide.webp`,
      backgroundPortrait: `${NCE_U04_ASSET_BASE}/scene-career-salon-v1-portrait.avif`,
      backgroundPortraitFallback: `${NCE_U04_ASSET_BASE}/scene-career-salon-v1-portrait.webp`,
      actorEntityIds: ['robert', 'sophie'], contactSurfaceY: { wide: 71, portrait: 69 }
    },
    roles: { robert: { entityId: 'robert', label: 'Robert' }, sophie: { entityId: 'sophie', label: 'Sophie' } },
    support: { firstWrong: '先看当前人物，再听清问题是在问国籍还是职业。', secondWrong: '把 who、nationality、job 分开判断，不要一次猜完整句。' },
    completionContentRef: 'NCE-U04-C-COMPLETION',
    stages: [
      { stageId: 'NCE-U04-S01', microtaskId: 'NCE-U04-S01', lessonId: 'lesson7', kind: 'dialogue-comprehension', title: '两位新同学开始聊天', instruction: '听完完整对话，再回答教材问题', prompt: 'Robert 是做什么工作的？', startLabel: '开始听完整对话', audioRefs: sourceIdRange('L07-D', 1, 16), options: [{ optionId: 'engineer', label: 'engineer' }, { optionId: 'operator', label: 'keyboard operator' }, { optionId: 'teacher', label: 'teacher' }], answerRule: { acceptedOptionId: 'engineer' }, answerFairness: storyAnswerFairness('discourse-understanding', ['L07-Q01', ...sourceIdRange('L07-D', 1, 16)]), successAudioRefs: ['L07-D16'], exposureRefs: ['L07-I01', 'L07-Q01', ...sourceIdRange('L07-D', 1, 16)], evidenceRefs: ['L07-Q01', ...sourceIdRange('L07-D', 1, 16)] },
      { stageId: 'NCE-U04-S02', microtaskId: 'NCE-U04-S02', lessonId: 'lesson7', kind: 'choice', title: '先把名字告诉对方', instruction: '选择 Robert 真正用过的自我介绍', prompt: '哪句话是在介绍自己的名字？', options: [{ optionId: 'name', label: "My name's Robert." }, { optionId: 'french', label: 'I am French.' }, { optionId: 'job', label: "What's your job?" }], answerRule: { acceptedOptionId: 'name' }, answerFairness: storyAnswerFairness('communication-structure', ['L07-D01', 'L07-D02', 'L07-D04']), successAudioRefs: ['L07-D02'], exposureRefs: ['L07-D01', 'L07-D02', 'L07-D03', 'L07-D04', 'L07-N01', 'L07-N02'], evidenceRefs: ['L07-D01', 'L07-D02', 'L07-D04'] },
      { stageId: 'NCE-U04-S03', microtaskId: 'NCE-U04-S03', lessonId: 'lesson7', kind: 'sequence-choice', title: '同一个问题会有两种回答', instruction: '先回答 Sophie，再回答 Robert', rounds: [
        { roundId: 'sophie-french', propEntityId: 'sophie', prompt: 'Are you French?', options: [{ optionId: 'yes', label: 'Yes, I am.' }, { optionId: 'no', label: 'No, I am not.' }], answerRule: { acceptedOptionId: 'yes' }, answerFairness: storyAnswerFairness('structure-use', ['L07-D05', 'L07-D06']), successAudioRefs: ['L07-D06'] },
        { roundId: 'robert-french', propEntityId: 'robert', prompt: 'Are you French, too?', options: [{ optionId: 'no', label: 'No, I am not.' }, { optionId: 'yes', label: 'Yes, I am.' }], answerRule: { acceptedOptionId: 'no' }, answerFairness: storyAnswerFairness('structure-use', ['L07-D07', 'L07-D08']), successAudioRefs: ['L07-D08'] }
      ], exposureRefs: sourceIdRange('L07-D', 5, 8), evidenceRefs: sourceIdRange('L07-D', 5, 8) },
      { stageId: 'NCE-U04-S04', microtaskId: 'NCE-U04-S04', lessonId: 'lesson7', kind: 'choice', title: '还想知道对方来自哪里', instruction: '选择真正询问国籍的问题', prompt: '哪一句是在问国籍？', options: [{ optionId: 'nationality', label: 'What nationality are you?' }, { optionId: 'job', label: "What's your job?" }, { optionId: 'teacher', label: 'Are you a teacher?' }], answerRule: { acceptedOptionId: 'nationality' }, answerFairness: storyAnswerFairness('communication-structure', ['L07-D09', 'L07-D10']), successAudioRefs: ['L07-D09', 'L07-D10'], exposureRefs: ['L07-D09', 'L07-D10', 'L07-N04'], evidenceRefs: ['L07-D09', 'L07-D10'] },
      { stageId: 'NCE-U04-S05', microtaskId: 'NCE-U04-S05', lessonId: 'lesson7', kind: 'entity-action', title: '职业问题指向了谁', instruction: '听职业问答，再点击对应人物', prompt: '谁是 keyboard operator？', promptAudioRefs: ['L07-D13', 'L07-D14'], entityIds: ['robert', 'sophie'], answerRule: { acceptedEntityId: 'sophie' }, answerFairness: storyAnswerFairness('discourse-understanding', ['L07-D13', 'L07-D14']), successAudioRefs: ['L07-D14'], exposureRefs: ['L07-D11', 'L07-D12', 'L07-D13', 'L07-D14', 'L07-D15', 'L07-D16', 'L07-N03'], evidenceRefs: ['L07-D13', 'L07-D14', 'L07-D15', 'L07-D16'] },
      { stageId: 'NCE-U04-S06', microtaskId: 'NCE-U04-S06', lessonId: 'lesson7', kind: 'role-enactment', title: '轮到你参加茶会', instruction: '选 Robert 或 Sophie，把整段对话演一遍', prompt: '对方台词会自动播放。轮到你时先自己说，再揭晓英文。', roleMode: 'choose-first', roles: ['robert', 'sophie'], dialogueRefs: sourceIdRange('L07-D', 1, 16), exposureRefs: [...sourceIdRange('L07-D', 1, 16), ...sourceIdRange('L07-W', 1, 11), ...sourceIdRange('L07-N', 1, 4)], evidenceRefs: ['L07-W06', 'L07-W07', 'L07-W08', 'L07-W10', 'L07-W11'] },
      { stageId: 'NCE-U04-S07', microtaskId: 'NCE-U04-S07', lessonId: 'lesson8', kind: 'prompt-album', title: '十枚职业徽章', instruction: '分两组点亮，每个职业都听一遍', groups: [
        { groupId: 'city-jobs', label: '城市工作', sourceRefs: sourceIdRange('L08-P', 1, 5), entityIds: ['policeman', 'policewoman', 'taxi-driver', 'air-hostess', 'postman'] },
        { groupId: 'care-jobs', label: '生活工作', sourceRefs: sourceIdRange('L08-P', 6, 10), entityIds: ['nurse', 'mechanic', 'hairdresser', 'housewife', 'milkman'] }
      ], exposureRefs: ['L08-I01', ...sourceIdRange('L08-P', 1, 10), ...sourceIdRange('L08-W', 1, 10)], evidenceRefs: [...sourceIdRange('L08-P', 1, 10), ...sourceIdRange('L08-W', 1, 5)] },
      { stageId: 'NCE-U04-S08', microtaskId: 'NCE-U04-S08', lessonId: 'lesson8', kind: 'sequence-choice', title: '只听声音找到职业', instruction: '每一轮先听，再选图', rounds: [
        { roundId: 'hear-policeman', prompt: '刚才说的是哪一种职业？', promptAudioRefs: ['L08-P01'], entityIds: ['policeman', 'taxi-driver', 'postman'], hideEntityLabelsUntilCorrect: true, answerRule: { acceptedEntityId: 'policeman' }, answerFairness: storyAnswerFairness('audio-form', ['L08-P01'], { candidateLabelVisibility: 'after-correct' }) },
        { roundId: 'hear-nurse', prompt: '刚才说的是哪一种职业？', promptAudioRefs: ['L08-P06'], entityIds: ['hairdresser', 'nurse', 'policewoman'], hideEntityLabelsUntilCorrect: true, answerRule: { acceptedEntityId: 'nurse' }, answerFairness: storyAnswerFairness('audio-form', ['L08-P06'], { candidateLabelVisibility: 'after-correct' }) },
        { roundId: 'hear-milkman', prompt: '刚才说的是哪一种职业？', promptAudioRefs: ['L08-P10'], entityIds: ['mechanic', 'milkman', 'postman'], hideEntityLabelsUntilCorrect: true, answerRule: { acceptedEntityId: 'milkman' }, answerFairness: storyAnswerFairness('audio-form', ['L08-P10'], { candidateLabelVisibility: 'after-correct' }) }
      ], exposureRefs: ['L08-P01', 'L08-P06', 'L08-P10'], evidenceRefs: ['L08-P01', 'L08-P06', 'L08-P10'] },
      { stageId: 'NCE-U04-S09', microtaskId: 'NCE-U04-S09', lessonId: 'lesson8', kind: 'sequence-choice', title: 'his 和 her 跟着人物变化', instruction: '看人物，选择正确的职业问题', rounds: [
        { roundId: 'her-job', propEntityId: 'policewoman', prompt: '询问她的工作，哪一句正确？', options: [{ optionId: 'her', label: "What's her job?" }, { optionId: 'his', label: "What's his job?" }, { optionId: 'your', label: "What's your job?" }], answerRule: { acceptedOptionId: 'her' }, answerFairness: storyAnswerFairness('structure-use', ['L08-P02']), successAudioRefs: ['L08-P02'] },
        { roundId: 'his-job', propEntityId: 'mechanic', prompt: '询问他的工作，哪一句正确？', options: [{ optionId: 'his', label: "What's his job?" }, { optionId: 'her', label: "What's her job?" }, { optionId: 'your', label: "What's your job?" }], answerRule: { acceptedOptionId: 'his' }, answerFairness: storyAnswerFairness('structure-use', ['L08-P07']), successAudioRefs: ['L08-P07'] }
      ], exposureRefs: ['L08-P02', 'L08-P07', 'L08-E02'], evidenceRefs: ['L08-P02', 'L08-P07'] },
      { stageId: 'NCE-U04-S10', microtaskId: 'NCE-U04-S10', lessonId: 'lesson8', kind: 'sequence-choice', title: '把问题带到新职业上', instruction: '四张职业图，分别选择正确的问题', rounds: [
        { roundId: 'nurse-wh', propEntityId: 'nurse', prompt: '想知道她的职业，应该问……', options: [{ optionId: 'her', label: "What's her job?" }, { optionId: 'his', label: "What's his job?" }], answerRule: { acceptedOptionId: 'her' }, answerFairness: storyAnswerFairness('structure-use', ['L08-P06']), successAudioRefs: ['L08-P06'] },
        { roundId: 'mechanic-wh', propEntityId: 'mechanic', prompt: '想知道他的职业，应该问……', options: [{ optionId: 'his', label: "What's his job?" }, { optionId: 'her', label: "What's her job?" }], answerRule: { acceptedOptionId: 'his' }, answerFairness: storyAnswerFairness('structure-use', ['L08-P07']), successAudioRefs: ['L08-P07'] },
        { roundId: 'air-hostess-polar', propEntityId: 'air-hostess', prompt: '想确认她是不是空中小姐，应该问……', options: [{ optionId: 'she', label: 'Is she an air hostess?' }, { optionId: 'he', label: 'Is he an air hostess?' }], answerRule: { acceptedOptionId: 'she' }, answerFairness: storyAnswerFairness('structure-use', ['L08-P04']), successAudioRefs: ['L08-P04'] },
        { roundId: 'postman-polar', propEntityId: 'postman', prompt: '想确认他是不是邮递员，应该问……', options: [{ optionId: 'he', label: 'Is he a postman?' }, { optionId: 'she', label: 'Is she a postman?' }], answerRule: { acceptedOptionId: 'he' }, answerFairness: storyAnswerFairness('structure-use', ['L08-P05']), successAudioRefs: ['L08-P05'] }
      ], exposureRefs: ['L08-P04', 'L08-P05', 'L08-P06', 'L08-P07', 'L08-E01', 'L08-E02'], evidenceRefs: ['L08-P04', 'L08-P05', 'L08-P06', 'L08-P07'] }
    ]
  };

  function earlyBookAudioReviewContract(packId, audioBasePath, canonicalSha256, expectedAudioSourceCount) {
    return {
      packId,
      manifestPath: `${audioBasePath}/manifest.json`,
      canonicalAudioSetSha256: canonicalSha256,
      voiceBaselineId: 'nce-youth-v1',
      dialogueRenderMode: 'natural-utterance',
      standaloneWordRenderMode: 'context-cropped-lexeme-v1',
      decodedOnsetLimitMs: 150,
      publicationGate: 'human-language-review-per-file',
      nonAcceptedStatus: NCE_EARLY_BOOK_AUDIO_REVIEW_STATUS,
      expectedAudioSourceCount
    };
  }

  function earlyBookCurriculumContract({
    unitId,
    lessons,
    pdfPages,
    textbookPages,
    launchPackRef,
    audioPackId
  }) {
    const lessonPageMap = Object.fromEntries(lessons.map((lesson, index) => [
      `lesson${lesson}`,
      {
        pdfPages: pdfPages.slice(index * 2, index * 2 + 2),
        textbookPages: textbookPages.slice(index * 2, index * 2 + 2)
      }
    ]));
    return {
      acceptedOn: '2026-08-31',
      acceptedDecisionRefs: [`${unitId}-DIRECT-BUILD-APPROVAL-2026-08-31`],
      launchPackRef,
      grammarSpineRef: 'docs/designs/new-concept-english-book1-grammar-spine-v1.md',
      sourceRegister: {
        sourceRegisterId: 'BOOK1-2022-07',
        title: '外研社《新概念英语智慧版 1：英语初阶 First Things First》',
        edition: '2022 年 7 月第 1 版第 1 次印刷',
        isbn: '978-7-5213-3670-2',
        snapshotSha256: 'a54740bdce7423b98ea30334dca9043603ef5533f85e64f86f5af6d31d93be9f',
        totalPdfPages: 330,
        lessonPageMap
      },
      writingPolicy: 'optional-nonblocking',
      audioAuditStatus: 'candidate-generated-awaiting-human-review',
      audioSourceAudit: {
        checkedOn: '2026-08-31',
        result: 'no-auditable-official-audio',
        checkedSurfaces: [
          'controlled-pdf-embedded-files',
          `controlled-pdf-page-annotations-${pdfPages[0]}-${pdfPages.at(-1)}`,
          'repository-audio-assets',
          'local-download-audio-assets'
        ],
        officialAccessModel: 'book-specific-activation-in-fltrp-u-learning-app',
        officialReferenceId: 'FLTRP-2023-JCJYJXZY-P58'
      },
      audioCandidatePack: {
        packId: audioPackId,
        generationBasis: 'nce-u01-kokoro-candidate-v3',
        status: 'local-poc-candidate-unreviewed',
        disclosure: 'ai-generated-not-official-textbook-audio'
      },
      speakerMappingStatus: 'frozen-course-role-mapping',
      speakerMappingBasis: 'textbook-dialogue-semantics-and-figure-sequence',
      storyDesignStatus: 'authored-local-candidate',
      pageImplementationStatus: 'authored-local-candidate',
      publicationAllowed: false
    };
  }

  const TEACHING_UNITS = deepFreeze([
    unit({
      unitId: 'NCE-U01',
      districtId: 'first-book-1-12',
      lessons: [1, 2],
      landmarkId: 'starlight-lost-and-found',
      title: '星灯失物招领站',
      status: 'candidate',
      publicationScope: 'local-poc',
      runtimeProfile: 'microtask-v2',
      experienceRevision: NCE_U01_V2_REVISION,
      shuffleProtocol: NCE_U01_V2_SHUFFLE_PROTOCOL,
      reviewContexts: NCE_U01_V2_REVIEW_CONTEXTS,
      firstSessionRetrievalPolicy: {
        policyId: 'first-session-full-dual-channel',
        channels: ['audio-form-supported', 'word-form'],
        interleaveRequirement: 'story-state-change-and-independent-reshuffle'
      },
      finalizationProtocol: {
        protocolId: 'lesson1-2-v2-four-step-build',
        pendingCommitScope: 'experience-revision',
        steps: [
          'commit-final-microtask-and-lesson2',
          'readback-seventeen-microtasks-twenty-nine-cells-sources-and-facts',
          'commit-idempotent-unit-built',
          'readback-build-stage-five-before-landmark-animation'
        ]
      },
      audioReviewContract: {
        voiceBaselineId: 'nce-youth-v1',
        standaloneWordRenderMode: 'context-cropped-lexeme-v1',
        decodedOnsetLimitMs: 150,
        publicationGate: 'human-language-review-per-file',
        acceptedAudioSha256BySourceRef: NCE_ACCEPTED_CLOTHING_AUDIO_HASHES,
        nonAcceptedStatus: 'unreviewed-candidate'
      },
      contexts: [
        'lost-and-found-station', 'neighbourhood-return-desk',
        'handbag-counter', 'personal-items-tray', 'coatroom-rack', 'neighbourhood-route',
        ...Object.keys(NCE_U01_V2_REVIEW_CONTEXTS)
      ],
      targets: [
        { title: '把物品声音和英文词形连到正确物品', evidenceModes: ['audio-form-object-match', 'word-form-object-match'] },
        { title: '在需要引起注意时使用 Excuse me.', evidenceModes: ['polite-attention-choice'] },
        { title: '在没有听清时使用 Pardon?', evidenceModes: ['communication-repair-choice'] },
        { title: '询问并确认物品归属', evidenceModes: ['ownership-exchange', 'owner-identification'] },
        { title: '在收到物品后礼貌致谢', evidenceModes: ['thanks-in-context'] }
      ],
      lessonContent: {
        lesson1: LESSON1_CONTENT,
        lesson2: LESSON2_CONTENT
      },
      authoredContent: NCE_U01_V2_AUTHORED_CONTENT,
      entities: NCE_ENTITIES,
      experience: {
        documentTitle: 'Lesson 1–2 · 星灯失物招领站',
        lessonLabel: 'NEW CONCEPT ENGLISH · LESSON 1–2',
        progressDenominator: 17,
        sceneFrames: {
          selectionPolicy: 'responsive-picture',
          actorSlots: { 'station-keeper': 'left', 'handbag-owner': 'right' },
          masters: {
            portrait: {
              frameId: 'starlight-station-portrait-v2', aspectRatio: '9:19.5',
              media: '(max-aspect-ratio: 4/5)',
              assetSrc: '/poc/lesson1-2-experience/assets/starlight-station-bg-v2-portrait.avif',
              assetFallbackSrc: '/poc/lesson1-2-experience/assets/starlight-station-bg-v2-portrait.webp',
              actorLayout: {
                targetHeightPercent: 38,
                allowedHeightPercentRange: [34, 42],
                groundYPercent: 76
              },
              surfaceAnchors: {
                'counter-surface': { xPercent: 50, yPercent: 65, align: 'center-bottom', allowedXPercentRange: [46, 54], allowedYPercentRange: [63, 67], contactBaselinePercent: 65, entityScalePercentRange: [18, 24] },
                'workbench-surface': { xPercent: 50, yPercent: 65, align: 'center-bottom', allowedXPercentRange: [46, 54], allowedYPercentRange: [63, 67], contactBaselinePercent: 65, entityScalePercentRange: [18, 24] },
                'coat-rack': { xPercent: 50, yPercent: 65, align: 'center-bottom', allowedXPercentRange: [46, 54], allowedYPercentRange: [63, 67], contactBaselinePercent: 65, entityScalePercentRange: [18, 24] },
                'story-counter': { xPercent: 50, yPercent: 65, align: 'center-bottom', allowedXPercentRange: [46, 54], allowedYPercentRange: [63, 67], contactBaselinePercent: 65, entityScalePercentRange: [18, 24] }
              },
              embeddedEntityIds: []
            },
            wide: {
              frameId: 'starlight-station-wide-v2', aspectRatio: '16:10',
              media: '(min-aspect-ratio: 4/5)',
              assetSrc: '/poc/lesson1-2-experience/assets/starlight-station-bg-v2-wide.avif',
              assetFallbackSrc: '/poc/lesson1-2-experience/assets/starlight-station-bg-v2-wide.webp',
              actorLayout: {
                targetHeightPercent: 70,
                allowedHeightPercentRange: [65, 75],
                groundYPercent: 100
              },
              surfaceAnchors: {
                'counter-surface': { xPercent: 50, yPercent: 75, align: 'center-bottom', allowedXPercentRange: [47, 53], allowedYPercentRange: [73, 77], contactBaselinePercent: 75, entityScalePercentRange: [4, 7] },
                'workbench-surface': { xPercent: 50, yPercent: 75, align: 'center-bottom', allowedXPercentRange: [47, 53], allowedYPercentRange: [73, 77], contactBaselinePercent: 75, entityScalePercentRange: [4, 7] },
                'coat-rack': { xPercent: 50, yPercent: 75, align: 'center-bottom', allowedXPercentRange: [47, 53], allowedYPercentRange: [73, 77], contactBaselinePercent: 75, entityScalePercentRange: [4, 7] },
                'story-counter': { xPercent: 50, yPercent: 89, align: 'center-bottom', allowedXPercentRange: [47, 53], allowedYPercentRange: [87, 91], contactBaselinePercent: 89, entityScalePercentRange: [4, 7] }
              },
              embeddedEntityIds: []
            }
          }
        },
        viewportPolicy: 'single-viewport-responsive',
        scrollPolicy: {
          horizontal: 'forbidden', nestedCard: 'forbidden', vertical: 'viewport-fallback-only'
        },
        stagePreviewEnabled: true,
        audioPolicy: {
          backgroundMusic: 'none',
          ambientLoop: 'none',
          correctFeedbackOrder: 'visual-then-target-language',
          continueWithoutSound: false,
          nonLanguageMuteSupported: true
        },
        stageNavigation: {
          titleSource: 'microtask.navigationTitle',
          reachedPolicy: 'completed-plus-current',
          completedStageMode: 'sandbox-practice',
          skippedStageMode: 'formal-completion',
          futureStageMode: 'visible-disabled',
          openLabel: '选择已到达的阶段',
          practiceLabel: '回看',
          skippedLabel: '已跳过',
          completeSkippedLabel: '完成角色扮演',
          currentLabel: '继续学习',
          lockedLabel: '未到达'
        },
        stageTitleStyle: {
          maximumChineseCharacters: 6,
          form: 'noun-or-action-phrase',
          detailsBelongInTaskPrompt: true
        },
        uiCopy: {
          fallbackEntityTitle: '目标位置',
          feedback: {
            supportFallback: '再看一看场景里的线索。',
            rescueFallback: '小猫换一个例子示范，这一步仍由你完成。',
            assistedCorrect: '你用上了好办法，继续前进。',
            saveFailed: '这一步还没有保存，请再试一次。',
            labels: {
              support: '星灯提示', partner: '小猫来帮忙',
              danger: '保存提醒'
            }
          },
          hearts: { label: '冒险心', ariaPrefix: '冒险心：' },
          dialogue: {
            speakerFallback: '说话人', regionLabel: '课文听读', replayAriaLabel: '从第一句重新听课文',
            replayLabel: '重新播放', playLabel: '播放课文', playingPrefix: '正在听',
            listenHint: '', followCurrentLabel: '回到当前句',
            completedHint: '',
            continueLabel: '继续'
          },
          presentation: { continueLabel: '继续' },
          feedbackAudio: {
            followupFallback: '接着听', wordFormCorrect: '找对了，听听这个词',
            audioFormCorrect: '找对了，听下一个声音', selectCorrect: '答对啦，听听这句话',
            orderedCorrect: '问句排好了，听听整句', genericCorrect: '答对了，接着听',
            autoContinue: ''
          },
          languageAudio: {
            regionLabel: '英文听读', replayLabel: '重新播放英文', playLabel: '播放英文',
            playingHint: '正在播放', listenHint: ''
          },
          interaction: {
            exploreHint: '找到发光的物品，点它听声音', soundQuestion: '',
            grammarTitle: '星灯语法实验室', grammarSubtitle: '观察句子机关',
            statementLabel: '告诉别人', questionLabel: '问一问', grammarContinue: '我看出变化了',
            referenceThread: 'it 指向哪一个？', sequenceTrackLabel: '已经排列的故事顺序',
            sequenceInstruction: '按故事发生顺序，依次点四幅图', listenOnlyPrefix: '只听',
            sequencePositionPrefix: '第', sequencePositionSuffix: '幅', addNext: '放到下一格',
            continueCase: '继续案件', selectItem: '选物品', selectTarget: '选位置',
            selectMatchingItem: '',
            selectRecipient: '点击主人，把物品交给她',
            selectItemThenPerson: '点击场景中的主人',
            selectPersonNext: '点击场景中的人物', selectPerson: '点击场景中的人物',
            selectExpression: '选合适的英语',
            completeQuestionLabel: '完整问句', putObjectPrompt: '点一个物品放进来',
            orderedBlocksPrefix: '按顺序点', orderedBlocksSuffix: '块词语',
            reorderLabel: '重排',
            actionLabels: {
              give: '交给对方', 'give-selected': '交给对方', receive: '接过来',
              stamp: '盖下印章', pull: '拉下拉杆', default: '完成'
            }
          },
          navigation: {
            stageAriaPrefix: '阶段', stageAriaSeparator: '：', settingsLabel: '课程设置',
            heading: '阶段导航', previewNoSave: '回看不保存学习进度', jumpLabel: '跳转到阶段',
            closeMapLabel: '关闭阶段地图',
            chooseStageTitle: '选择学习阶段', chooseStageCopy: '回看已到达的阶段',
            exitPreviewTitle: '退出阶段回看', exitPreviewCopy: '',
            restartTitle: '重新开始本单元', restartCopy: '',
            dialogKicker: '', dialogTitle: '要重新开始吗？',
            dialogCopy: '已经保存的学习进度会清除，并回到本单元起点。',
            cancelRestart: '继续学习', confirmRestart: '确认重新开始',
            previewProgressLabel: '回看阶段位置', dayProgressLabel: '当日学习进度',
            previewBadge: '退出回看 · 不保存', resumeActionLabel: '继续今天的案件'
          },
          scene: { charactersLabel: '故事人物', itemsLabel: '故事物品', portraitHint: '竖屏体验更好' },
          knowledge: {
            label: '星灯知识卡', collapseLabel: '收起', continueLabel: '收好知识卡'
          },
          roleSkip: {
            actionLabel: '跳过这个角色',
            dialogTitle: '跳过这个角色？',
            dialogCopy: '',
            cancelLabel: '继续扮演',
            confirmLabel: '跳过这个角色',
            saveFailed: '没有保存成功',
            retryLabel: '再试一次'
          },
          outcomePractice: {
            regionLabel: '完成后的可选练习', hiddenTurnLabel: '轮到你说',
            revealHint: '先试着说，再揭晓', playLineLabel: '听这一句',
            playingLabel: '正在播放', roleLabel: '这轮你来当',
            itemPrefix: '第', itemSeparator: ' / ', itemSuffix: '题',
            audioRetryCopy: '声音刚才没有播放成功，英语仍留在这里。',
            audioRetryLabel: '再听一次'
          },
          preview: {
            companionChapterLabel: '探险小猫和你一起庆祝案件归档',
            companionCompleteLabel: '探险小猫和你一起庆祝小站开张',
            kicker: '', completeKicker: '',
            replayCompleteTitle: '阶段回看完成',
            replayCompleteCopy: '',
            returnLearningLabel: '返回继续学习', chooseAnotherStageLabel: '选择其他阶段',
            returnLocationPrefix: '回到：',
            chapterCopy: '',
            defaultRestingCopy: '进度已经保存。下次会从下一阶段继续。',
            completeCopy: '',
            exitLabel: '退出回看', isolatedLabel: '单阶段回看',
            noProgressTitle: '', returnCopy: '',
            dayBuildLabel: '', savedTitle: '进度已保存',
            reviewGrowthCopy: ''
          }
        },
        adventureHearts: {
          initial: 3, maximum: 3, visibility: 'formal-challenges-only',
          wrongDelta: -1, childCorrectDelta: 1,
          zeroAction: 'model-changed-example-then-restart-current-microtask',
          rescueCopy: '小猫换一个例子示范，这一小段再从头来一次。'
        },
        reviewRun: {
          itemRange: [2, 4], durationSecondsRange: [45, 90],
          href: '/poc/lesson1-2-review/',
          deferLabel: '稍后再来', heartPool: 'isolated-three-hearts',
          zeroAction: 'restart-entire-review-run',
          assistedOutcome: 'review-assisted-practice',
          copy: {
            entryKicker: '次日复习',
            entryTitle: '找回昨日线索',
            entryBody: '',
            startLabel: '开始复习',
            emptyKicker: '',
            emptyTitle: '今天没有复习任务',
            emptyBody: '先完成课程，新的复习会在之后出现。',
            returnLabel: '回到课程',
            activeKicker: '次日复习',
            progressSeparator: ' / ',
            itemCountSuffix: '条线索',
            durationPrefix: '约',
            completedKicker: '',
            completedTitle: '复习完成',
            completedBody: '进度已保存。',
            deferredKicker: '',
            deferredTitle: '稍后继续',
            deferredBody: '',
            rescueTitle: '小猫换个场景示范',
            rescueBody: '看完变化例子，三颗冒险心会补满，这一轮从第一条线索重新开始。',
            retryAudioLabel: '再听一次'
          }
        },
        arrival: {
          kicker: '晨光原野 · 第一座小站',
          title: '一只手提包在等主人',
          copy: '和探险小猫一起听、找、归还，把失物招领站慢慢点亮。',
          actionLabel: '推开小站的门'
        },
        briefing: {
          kicker: '开门前 · 先看看发生了什么',
          title: '小站收到一只没人认领的手提包',
          copy: '一位先生和一位女士来到窗口。先听他们怎么说，再帮手提包找到主人。',
          imageSrc: '/poc/lesson1-2-experience/assets/premise-handbag-arrival-v1.avif',
          imageFallbackSrc: '/poc/lesson1-2-experience/assets/premise-handbag-arrival-v1.jpg',
          imageAlt: '探险小猫指着柜台上的手提包，一位先生和一位女士正准备交谈。',
          actionLabel: '去听他们说话'
        },
        restStops: {
          'lesson1-chapter-stop': {
            restStopId: 'lesson1-chapter-stop', outcomeNodeId: 'L01-RS01', type: 'chapter',
            sceneMode: 'outcome-rest',
            kicker: '进度已保存',
            title: '手提包已经回到主人手中',
            copy: '',
            restingCopy: '下次从随身物品核对继续。',
            continueLabel: '继续核对物品', restLabel: '回地图休息'
          },
          'lesson2-midpoint-rest-stop': {
            restStopId: 'lesson2-midpoint-rest-stop', outcomeNodeId: 'L02-RS01', type: 'section',
            sceneMode: 'outcome-rest',
            kicker: '进度已保存',
            title: '随身物品和问句已经核对完',
            copy: '',
            restingCopy: '下次从衣帽间的 coat 和 dress 继续。',
            continueLabel: '继续去衣帽间', restLabel: '先休息'
          }
        },
        outcomePractices: [
          {
            practiceId: 'L01-RS01:manual-dialogue',
            kind: 'manual-dialogue',
            sceneMode: 'dialogue-stage',
            sceneVariant: 'full-role-enactment',
            propSurface: 'counter-surface',
            availableAt: { outcomeNodeId: 'L01-RS01', status: 'rest-stop', buildStage: 0 },
            unlockAfterStageId: 'L01-M12',
            countsTowardProgress: false,
            producesLearningEvidence: false,
            affectsAdventureHearts: false,
            entryKicker: '可选 · 不计进度',
            entryLabel: '无字逐句回演',
            entryHint: '',
            entryActionLabel: '开始回演',
            kicker: '无字逐句回演',
            intro: '先自己说，再揭晓并听原声。',
            revealLabel: '揭晓并播放这一句',
            hintLabel: '提示',
            nextHintLabel: '再提示',
            hintIntentLabel: '这句要表达',
            hintOpeningLabel: '英文开头',
            audioRetryLabel: '再听一次',
            audioRetryCopy: '这句原声还没有播放成功，请再听一次。',
            currentSpeakerLabel: '现在轮到',
            hiddenTurnLabel: '先自己说一说',
            restartLabel: '从头逐句回演',
            returnMainlineLabel: '继续主线',
            exitLabel: '退出回演',
            finishedTitle: '七句话都回演完了',
            finishedCopy: '完整课文已经展开。可以点任意一句重听，也可以从头再来。',
            castOrder: ['station-keeper', 'handbag-owner'],
            propEntityIds: ['handbag'],
            dialogueTurnRefs: ['L01-D01', 'L01-D02', 'L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07'],
            turnSpeakerEntityIds: [
              'station-keeper', 'handbag-owner', 'station-keeper', 'handbag-owner',
              'station-keeper', 'handbag-owner', 'handbag-owner'
            ],
            turnHints: NCE_U01_DIALOGUE_TURN_HINTS.map(hint => ({ ...hint }))
          },
          {
            practiceId: 'NCE-U01-OUTCOME:case-recap',
            kind: 'case-recap',
            diagnosticKind: 'same-day-practice',
            availableAt: { outcomeNodeId: 'NCE-U01-OUTCOME', status: 'unit-built', buildStage: 5 },
            entryKicker: '可选 · 3题',
            entryLabel: '案件复盘',
            entryHint: '',
            entryActionLabel: '开始复盘',
            kicker: '',
            intro: '',
            nextLabel: '下一条线索',
            finishLabel: '收好复盘',
            exitLabel: '返回成果页',
            wrongCopy: '再看看题目和场景，换一个答案试试。',
            correctCopy: '',
            finishedTitle: '复盘完成',
            finishedCopy: '',
            returnLabel: '回到成果页',
            items: [
              {
                itemId: 'recap-story-owner',
                practiceTarget: 'discourse-understanding',
                promptRef: 'NCE-U01-C-RECAP-OWNER',
                contextRef: 'review-help-desk-exchange',
                sceneEntityIds: ['handbag', 'station-keeper', 'handbag-owner'],
                correctAudioRef: 'L01-D06',
                options: [
                  { optionId: 'owner-woman', entityId: 'handbag-owner', label: '女顾客' },
                  { optionId: 'owner-keeper', entityId: 'station-keeper' },
                  { optionId: 'owner-cat', entityId: 'explorer-cat' }
                ],
                answerRule: { type: 'select-one', acceptedEntityId: 'handbag-owner' },
                answerFairness: {
                  targetEvidenceChannel: 'discourse-understanding',
                  targetEvidenceSourceRefs: ['L01-D06'],
                  intentionalPreSubmitSupport: [],
                  candidateLabelVisibility: 'neutral-role-labels'
                }
              },
              {
                itemId: 'recap-polite-repair',
                practiceTarget: 'communication-structure',
                promptRef: 'NCE-U01-C-RECAP-REPAIR',
                contextRef: 'review-help-desk-exchange',
                sceneEntityIds: ['station-keeper', 'handbag-owner'],
                correctAudioRef: 'L01-D04',
                options: [
                  { optionId: 'repair-pardon', sourceRef: 'L01-D04' },
                  { optionId: 'repair-excuse', sourceRef: 'L01-D01' },
                  { optionId: 'repair-thanks', sourceRef: 'L01-D07' }
                ],
                answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D04' },
                answerFairness: {
                  targetEvidenceChannel: 'communication-structure',
                  targetEvidenceSourceRefs: ['L01-D04'],
                  intentionalPreSubmitSupport: [],
                  candidateLanguageBoundary: 'source-text-only'
                }
              },
              {
                itemId: 'recap-new-route',
                practiceTarget: 'vocabulary-transfer',
                promptRef: 'NCE-U01-C-RECAP-ROUTE',
                contextRef: 'review-neighbourhood-route',
                sceneEntityIds: ['car', 'house'],
                correctAudioRef: 'L02-W10',
                options: [
                  { optionId: 'route-house', sourceRef: 'L02-W10' },
                  { optionId: 'route-car', sourceRef: 'L02-W09' },
                  { optionId: 'route-watch', sourceRef: 'L02-W04' }
                ],
                answerRule: { type: 'select-one', acceptedSourceRef: 'L02-W10' },
                answerFairness: {
                  targetEvidenceChannel: 'vocabulary-transfer',
                  targetEvidenceSourceRefs: ['L02-W10'],
                  intentionalPreSubmitSupport: [],
                  candidateLanguageBoundary: 'source-text-only'
                }
              }
            ]
          }
        ],
        audioFailure: {
          contentId: 'NCE-U01-C-AUDIO-FAILURE',
          title: '这句英语还没有播放成功',
          copy: '英文会一直留在屏幕上。请点“再听一次”，听完后才能继续。',
          retryLabel: '再听一次',
          retryingTitle: '正在重新连接声音',
          retryingCopy: '',
          leaveWarning: '现在离开，会从这一小段开头重新开始。'
        },
        saveFailure: {
          contentId: 'NCE-U01-C-SAVE-FAILURE',
          title: '学习结果还没有保存好',
          copy: '不用重新答题，请留在这里重试保存。',
          retryLabel: '重新保存',
          savingTitle: '正在保存这一小段',
          savingCopy: '',
          volatileWarning: '现在离开会重做这一小段。'
        },
        completion: {
          outcomeNodeId: 'NCE-U01-OUTCOME',
          sceneMode: 'outcome-rest',
          kicker: '',
          title: '她已经坐车平安到家',
          copy: '',
          replayLabel: '回看任意已到达阶段',
          leaveLabel: '回到课程地图',
          leaveHref: '/'
        }
      },
      retiredMicrotaskResumeTargets: {},
      microtasksByBeat: LESSON1_2_MICROTASKS_BY_BEAT
    }),
    curriculumAuthoredUnit({
      unitId: 'NCE-U02',
      districtId: 'first-book-1-12',
      lessons: [3, 4],
      unitLabel: 'Lesson 3–4',
      title: '5号牌与两把雨伞',
      contexts: ['cloakroom-story', 'counter-transfer'],
      targets: NCE_U02_TARGETS,
      lessonContent: {
        lesson3: LESSON3_CONTENT,
        lesson4: LESSON4_CONTENT
      },
      sourceTargetCoverage: NCE_U02_SOURCE_TARGET_COVERAGE,
      firstSessionEvidencePlan: NCE_U02_FIRST_SESSION_EVIDENCE_PLAN,
      experienceRevision: NCE_U02_EXPERIENCE_REVISION,
      authoredContent: NCE_U02_AUTHORED_CONTENT,
      entities: NCE_U02_ENTITIES,
      experience: NCE_U02_EXPERIENCE,
      voiceBaselineId: 'nce-youth-v1',
      audioReviewContract: {
        packId: NCE_U02_AUDIO_PACK_ID,
        manifestPath: `${NCE_U02_AUDIO_BASE_PATH}/manifest.json`,
        canonicalAudioSetSha256: NCE_U02_CANONICAL_AUDIO_SET_SHA256,
        voiceBaselineId: 'nce-youth-v1',
        dialogueRenderMode: 'natural-utterance',
        standaloneWordRenderMode: 'context-cropped-lexeme-v1',
        decodedOnsetLimitMs: 150,
        publicationGate: 'human-language-review-per-file',
        nonAcceptedStatus: NCE_U02_AUDIO_REVIEW_STATUS,
        expectedAudioSourceCount: 42
      },
      curriculumContract: {
        acceptedOn: '2026-08-30',
        acceptedDecisionRefs: ['PA-01-A', 'PA-02-A', 'PA-03-A', 'PA-04-A'],
        launchPackRef: 'docs/designs/lesson3-4-teaching-unit-launch-pack-v1.md',
        grammarSpineRef: 'docs/designs/new-concept-english-book1-grammar-spine-v1.md',
        sourceRegister: {
          sourceRegisterId: 'BOOK1-2022-07',
          title: '外研社《新概念英语智慧版 1：英语初阶 First Things First》',
          edition: '2022 年 7 月第 1 版第 1 次印刷',
          isbn: '978-7-5213-3670-2',
          snapshotSha256: 'a54740bdce7423b98ea30334dca9043603ef5533f85e64f86f5af6d31d93be9f',
          totalPdfPages: 330,
          lessonPageMap: {
            lesson3: { pdfPages: [39, 40], textbookPages: [6, 7] },
            lesson4: { pdfPages: [41, 42], textbookPages: [8, 9] }
          }
        },
        writingPolicy: 'optional-nonblocking',
        audioAuditStatus: 'candidate-generated-awaiting-human-review',
        audioSourceAudit: {
          checkedOn: '2026-08-31',
          result: 'no-auditable-official-audio',
          checkedSurfaces: [
            'controlled-pdf-embedded-files',
            'controlled-pdf-page-annotations-39-42',
            'repository-audio-assets',
            'local-download-audio-assets'
          ],
          officialAccessModel: 'book-specific-activation-in-fltrp-u-learning-app',
          officialReferenceId: 'FLTRP-2023-JCJYJXZY-P58'
        },
        audioCandidatePack: {
          packId: NCE_U02_AUDIO_PACK_ID,
          generationBasis: 'nce-u01-kokoro-candidate-v3',
          status: 'local-poc-candidate-unreviewed',
          disclosure: 'ai-generated-not-official-textbook-audio'
        },
        speakerMappingStatus: 'frozen-course-role-mapping',
        speakerMappingBasis: 'textbook-dialogue-semantics-and-figure-sequence',
        storyDesignStatus: 'authored-local-candidate',
        pageImplementationStatus: 'authored-local-candidate',
        publicationAllowed: false
      }
    }),
    curriculumAuthoredUnit({
      unitId: 'NCE-U03',
      districtId: 'first-book-1-12',
      lessons: [5, 6],
      unitLabel: 'Lesson 5–6',
      title: '星光迎新厅',
      contexts: ['welcome-gallery', 'car-maker-gallery'],
      targets: NCE_U03_TARGETS,
      lessonContent: { lesson5: LESSON5_CONTENT, lesson6: LESSON6_CONTENT },
      sourceTargetCoverage: NCE_U03_SOURCE_TARGET_COVERAGE,
      firstSessionEvidencePlan: NCE_U03_FIRST_SESSION_EVIDENCE_PLAN,
      experienceRevision: NCE_U03_EXPERIENCE_REVISION,
      authoredContent: NCE_U03_AUTHORED_CONTENT,
      entities: NCE_U03_ENTITIES,
      experience: NCE_U03_EXPERIENCE,
      voiceBaselineId: 'nce-youth-v1',
      audioReviewContract: earlyBookAudioReviewContract(
        NCE_U03_AUDIO_PACK_ID,
        NCE_U03_AUDIO_BASE_PATH,
        NCE_U03_CANONICAL_AUDIO_SET_SHA256,
        50
      ),
      curriculumContract: earlyBookCurriculumContract({
        unitId: 'NCE-U03', lessons: [5, 6], pdfPages: [43, 44, 45, 46],
        textbookPages: [10, 11, 12, 13],
        launchPackRef: 'docs/designs/lesson5-6-teaching-unit-launch-pack-v1.md',
        audioPackId: NCE_U03_AUDIO_PACK_ID
      })
    }),
    curriculumAuthoredUnit({
      unitId: 'NCE-U04',
      districtId: 'first-book-1-12',
      lessons: [7, 8],
      unitLabel: 'Lesson 7–8',
      title: '午夜职业茶会',
      contexts: ['career-salon', 'job-badge-gallery'],
      targets: NCE_U04_TARGETS,
      lessonContent: { lesson7: LESSON7_CONTENT, lesson8: LESSON8_CONTENT },
      sourceTargetCoverage: NCE_U04_SOURCE_TARGET_COVERAGE,
      firstSessionEvidencePlan: NCE_U04_FIRST_SESSION_EVIDENCE_PLAN,
      experienceRevision: NCE_U04_EXPERIENCE_REVISION,
      authoredContent: NCE_U04_AUTHORED_CONTENT,
      entities: NCE_U04_ENTITIES,
      experience: NCE_U04_EXPERIENCE,
      voiceBaselineId: 'nce-youth-v1',
      audioReviewContract: earlyBookAudioReviewContract(
        NCE_U04_AUDIO_PACK_ID,
        NCE_U04_AUDIO_BASE_PATH,
        NCE_U04_CANONICAL_AUDIO_SET_SHA256,
        47
      ),
      curriculumContract: earlyBookCurriculumContract({
        unitId: 'NCE-U04', lessons: [7, 8], pdfPages: [47, 48, 49, 50],
        textbookPages: [14, 15, 16, 17],
        launchPackRef: 'docs/designs/lesson7-8-teaching-unit-launch-pack-v1.md',
        audioPackId: NCE_U04_AUDIO_PACK_ID
      })
    }),
    unit({
      number: 1,
      lessons: [49, 50],
      landmarkId: 'warm-lantern-market',
      title: '暖灯风味市集',
      status: 'candidate',
      contexts: ['breakfast-stall', 'picnic-supply'],
      targets: [
        { title: '听懂食材和数量线索', evidenceModes: ['audio-image-quantity-match'] },
        { title: '组织一般询问与接受或拒绝', evidenceModes: ['sentence-ordering'] },
        { title: '组织二选一询问与明确选择', evidenceModes: ['choice-sentence-build'] },
        { title: '表达自己的喜欢与不需要', evidenceModes: ['first-person-preference-build'] },
        { title: '表达第三人称偏好', evidenceModes: ['third-person-preference-build'] }
      ],
      tasks: [
        {
          contextId: 'breakfast-stall',
          answerKeyByContext: { 'breakfast-stall': 'quantity', 'picnic-supply': 'quantity' },
          presentation: {
            stepLabel: '第一幕 · 发现问题',
            growth: {
              title: '遮阳棚装好了！',
              copy: '订单终于能看清了，肉铺门前多了一顶红白遮阳棚。'
            },
            contexts: {
              'breakfast-stall': {
                eyebrow: '肉铺订单 · 第一封委托',
                title: '订单还缺哪条线索？',
                copy: 'Mrs. Bird 和 beef 已经写清楚了。找出还不能开始备货的那一项。',
                hint: '看完订单，再选择缺少的线索',
                order: ['Mrs. Bird', 'beef', '?'],
                options: [
                  { id: 'person', title: '谁', subtitle: '是哪位客人？' },
                  { id: 'item', title: '什么', subtitle: '需要哪种食材？' },
                  { id: 'quantity', title: '多少', subtitle: '需要几份或几磅？' }
                ],
                support: [
                  '重新观察：姓名和 beef 卡是不是已经在订单上了？',
                  '小线索：剩下没写清的是数字或份量。',
                  '小猫示范：先圈出“谁”和“什么”，最后检查还有哪一格空着。'
                ],
                modelSteps: [
                  '圈出已经写清楚的客人',
                  '圈出已经写清楚的商品',
                  '寻找仍会让备货员犹豫的空白'
                ]
              },
              'picnic-supply': {
                eyebrow: '野餐便签 · 换个地点',
                title: '这张便签还缺什么？',
                copy: 'Mia 和 picnic basket 已经写清楚了。重新找出不能开始准备的那一项。',
                hint: '规则不变，在新便签里再判断一次',
                order: ['Mia', 'picnic basket', '?'],
                options: [
                  { id: 'place', title: '哪里', subtitle: '在哪儿野餐？' },
                  { id: 'quantity', title: '多少', subtitle: '需要准备几份？' },
                  { id: 'guest', title: '谁来', subtitle: '还有哪些客人？' }
                ],
                support: [
                  '重新观察：人物和要准备的篮子都已经写出来了。',
                  '小线索：备货员还不知道要准备几份。',
                  '小猫示范：先找已有信息，再找决定备货数量的空白。'
                ],
                modelSteps: [
                  '确认人物已经出现',
                  '确认要准备的商品已经出现',
                  '寻找没有写出的份数'
                ]
              }
            }
          }
        },
        {
          contextId: 'breakfast-stall',
          answerKeyByContext: { 'breakfast-stall': 'beef', 'picnic-supply': 'beef' },
          presentation: {
            stepLabel: '第二幕 · 听懂线索',
            growth: {
              title: '新鲜展示台摆好了！',
              copy: '你听懂了客人的选择，第一批商品已经摆上展示台。'
            },
            audio: {
              audioId: 'u01-beef-choice',
              fallbackText: 'Do you want beef or lamb? — Beef, please.',
              lines: [
                {
                  text: 'Do you want beef or lamb?',
                  src: '/lesson49/audio/do_you_want_beef_or_lamb.mp3'
                },
                {
                  text: 'Beef, please.',
                  src: '/lesson49/audio/beef_please.mp3'
                }
              ]
            },
            contexts: {
              'breakfast-stall': {
                eyebrow: '肉铺柜台 · 听完整段',
                title: '伯德夫人最后选了什么？',
                copy: '先听完问句和回答，再把正确的商品卡放进订单。',
                hint: '声音结束后，再选择听到的商品',
                order: ['beef', 'or', 'lamb'],
                options: [
                  { id: 'lamb', title: 'lamb', subtitle: '羊肉' },
                  { id: 'beef', title: 'beef', subtitle: '牛肉' },
                  { id: 'chicken', title: 'chicken', subtitle: '鸡肉' }
                ],
                support: [
                  '重新听一次：注意回答里的最后两个词。',
                  '小线索：她在 beef 和 lamb 之间做了选择。',
                  '小猫示范：先抓住 or 两边的选项，再听回答重复了哪一个。'
                ],
                modelSteps: [
                  '先听出 or 两边的两个选项',
                  '再听回答重复了哪个单词',
                  '只根据声音选择，不看按钮位置'
                ]
              },
              'picnic-supply': {
                eyebrow: '野餐补给 · 新订单',
                title: '新客人最后选了什么？',
                copy: '地点和用途都换了。重新听完整段，只根据声音线索选择商品。',
                hint: '重新播放，再完成这张野餐订单',
                order: ['picnic', 'choice', '?'],
                options: [
                  { id: 'bread', title: 'bread', subtitle: '面包' },
                  { id: 'fruit', title: 'fruit', subtitle: '水果' },
                  { id: 'beef', title: 'beef', subtitle: '牛肉' }
                ],
                support: [
                  '重新听一次：不要沿用上一张订单的按钮位置。',
                  '小线索：回答里清楚重复了一个食材单词。',
                  '小猫示范：先听选择范围，再用回答里的重复词作决定。'
                ],
                modelSteps: [
                  '听清可选商品',
                  '抓住回答里的重复词',
                  '到新订单里重新做选择'
                ]
              }
            }
          },
          formativeBinding: {
            targetId: 'FLC-U01-T01',
            evidenceMode: 'audio-image-quantity-match'
          }
        },
        {
          contextId: 'breakfast-stall',
          answerKeyByContext: { 'breakfast-stall': 'like', 'picnic-supply': 'want' }
        },
        {
          contextId: 'breakfast-stall',
          answerKeyByContext: { 'breakfast-stall': 'mia', 'picnic-supply': 'ben' }
        },
        {
          contextId: 'breakfast-stall',
          answerKeyByContext: { 'breakfast-stall': 'ready', 'picnic-supply': 'ready' }
        }
      ],
      vocabulary: [
        { term: 'husband', semanticType: 'human' },
        { term: 'beef', semanticType: 'meat' },
        { term: 'steak', semanticType: 'meat' },
        { term: 'mince', semanticType: 'meat' }
      ],
      lessonContent: { lesson49: LESSON49_CONTENT },
      microtasksByBeat: {
        discover: [LESSON49_AUTHORED_MICROTASKS[0]],
        understand: LESSON49_AUTHORED_MICROTASKS.slice(1)
      }
    }),
    unit({
      number: 2,
      lessons: [51, 52],
      landmarkId: 'four-seasons-travel-harbour',
      title: '四季旅行问询港',
      contexts: ['exchange-student-desk', 'travel-postcard-desk'],
      targets: [
        { title: '建立国家与国籍的意义配对', evidenceModes: ['profile-map-match'] },
        { title: '组织来源问答', evidenceModes: ['sentence-build'] },
        { title: '组织国籍问答', evidenceModes: ['sentence-build'] },
        { title: '按季节组织月份', evidenceModes: ['sequence-match'] },
        { title: '描述气候规律', evidenceModes: ['climate-statement-build'] }
      ]
    }),
    unit({
      number: 3,
      lessons: [53, 54],
      landmarkId: 'global-weather-station',
      title: '环球气候播报站',
      contexts: ['island-weather-desk', 'travel-reporter-desk'],
      targets: [
        { title: '描述方位与天气', evidenceModes: ['audio-map-placement'] },
        { title: '表达季节偏好', evidenceModes: ['reason-sentence-build'] },
        { title: '描述昼夜长短', evidenceModes: ['comparison-build'] },
        { title: '描述日出日落早晚', evidenceModes: ['sentence-build'] },
        { title: '采访来客来源与国籍', evidenceModes: ['interview-sequence'] }
      ]
    }),
    unit({
      number: 4,
      lessons: [55, 56],
      landmarkId: 'sawyer-family-time-house',
      title: '索耶家庭时光屋',
      contexts: ['neighbour-family-day', 'market-worker-day'],
      targets: [
        { title: '听懂日常活动', evidenceModes: ['audio-activity-match'] },
        { title: '按时间段组织活动', evidenceModes: ['schedule-ordering'] },
        { title: '表达活动频率', evidenceModes: ['frequency-statement-build'] },
        { title: '组织第三人称日常行为', evidenceModes: ['predicate-build'] },
        { title: '组织日常行为问答', evidenceModes: ['question-answer-build'] }
      ]
    }),
    unit({
      number: 5,
      lessons: [57, 58],
      landmarkId: 'today-change-clocktower',
      title: '今日变化钟楼',
      contexts: ['festival-day', 'rainy-plan-change'],
      targets: [
        { title: '听辨并表达整点时间', evidenceModes: ['audio-clock-sentence-match'] },
        { title: '判断平常与此刻的时间视角', evidenceModes: ['timeline-classification'] },
        { title: '组织平常活动', evidenceModes: ['present-simple-build'] },
        { title: '组织此刻动作', evidenceModes: ['present-continuous-build'] },
        { title: '对照平常与今天', evidenceModes: ['contrast-task'] }
      ]
    }),
    unit({
      number: 6,
      lessons: [59, 60],
      landmarkId: 'corner-supply-store',
      title: '街角生活补给铺',
      contexts: ['grocery-supply', 'classroom-materials'],
      targets: [
        { title: '听懂文具与生活用品库存', evidenceModes: ['audio-inventory-match'] },
        { title: '完成连续采购', evidenceModes: ['dialogue-ordering'] },
        { title: '询问并回应库存', evidenceModes: ['inventory-question-answer'] },
        { title: '按尺寸提供替代品', evidenceModes: ['substitution-task'] },
        { title: '处理商品数量表达', evidenceModes: ['quantity-expression-build'] }
      ]
    })
  ]);

  function getTeachingUnit(unitId) {
    return TEACHING_UNITS.find(unit => unit.unitId === unitId) || null;
  }

  function getTeachingUnitForLesson(lessonId) {
    return TEACHING_UNITS.find(unit => unit.lessonIds.includes(lessonId)) || null;
  }

  function listTeachingUnitsForDistrict(districtId) {
    return TEACHING_UNITS.filter(unit => unit.districtId === districtId);
  }

  function validate(units = TEACHING_UNITS) {
    const errors = [];
    const allowedStatuses = new Set(['planned', 'candidate', 'curriculum-accepted']);
    const allowedPublicationScopes = new Set(['course-catalog', 'local-poc', 'catalog-only']);
    const allowedRuntimeProfiles = new Set([
      'five-beat-v1', 'microtask-v2', 'story-stage-v1', 'not-authored'
    ]);
    const curriculumTargetTiers = new Set(['core', 'support-communication', 'lexical-sample']);
    const curriculumCoverageModes = new Set(['eligible-evidence', 'support', 'optional']);
    const pendingAudioAuditStatuses = new Set([
      'not-audited',
      'blocked-authorized-source-unavailable',
      'candidate-generated-awaiting-human-review'
    ]);
    const unitIds = new Set();
    const lessonOwners = new Map();
    const targetIds = new Set();
    const taskIds = new Set();
    const microtaskIds = new Set();
    const microtaskStepIds = new Set();
    const targetResultIds = new Set();
    const variantCellIds = new Set();
    const reviewCellIds = new Set();
    const challengeRefs = new Set();

    for (const current of units) {
      if (unitIds.has(current.unitId)) errors.push(`${current.unitId} belongs to multiple units`);
      unitIds.add(current.unitId);

      const isCurriculumAccepted = current.status === 'curriculum-accepted';
      const isAuthoredStoryStage = (
        typeof current.experienceRevision === 'string'
        && current.experience
        && current.curriculumContract
      );
      const isCurriculumGoverned = isCurriculumAccepted || isAuthoredStoryStage;
      if (!allowedStatuses.has(current.status)) {
        errors.push(`${current.unitId} has unknown status ${current.status}`);
      }
      if (!allowedPublicationScopes.has(current.publicationScope)) {
        errors.push(`${current.unitId} has unknown publication scope ${current.publicationScope}`);
      }
      if (!allowedRuntimeProfiles.has(current.runtimeProfile)) {
        errors.push(`${current.unitId} has unknown runtime profile ${current.runtimeProfile}`);
      }

      if (isAuthoredStoryStage) {
        const declaredSpeakerRoles = new Set([
          ...Object.keys(current.experience?.roles || {}),
          ...(current.experience?.stages || []).flatMap(stage => stage.roles || [])
        ]);
        if (
          current.status !== 'candidate'
          || current.publicationScope !== 'local-poc'
          || current.runtimeProfile !== 'story-stage-v1'
        ) {
          errors.push(`${current.unitId} authored experience must remain a story-stage local candidate`);
        }
        if ((current.beats || []).length !== 0) {
          errors.push(`${current.unitId} story-stage runtime cannot declare legacy beats`);
        }
        if (
          current.curriculumContract?.publicationAllowed !== false
          || current.curriculumContract?.storyDesignStatus !== 'authored-local-candidate'
          || current.curriculumContract?.pageImplementationStatus !== 'authored-local-candidate'
          || current.curriculumContract?.audioAuditStatus !== 'candidate-generated-awaiting-human-review'
        ) {
          errors.push(`${current.unitId} authored experience must preserve its unpublished local gate`);
        }
        if (
          current.curriculumContract?.audioSourceAudit?.result !== 'no-auditable-official-audio'
          || current.curriculumContract?.audioSourceAudit?.officialAccessModel
            !== 'book-specific-activation-in-fltrp-u-learning-app'
        ) {
          errors.push(`${current.unitId} authored experience must preserve its official-audio source audit`);
        }
        if (
          current.experience?.stageCount !== 10
          || current.experience?.stages?.length !== 10
          || current.experience?.storageKey !== `poc:learning-experience:${current.unitId}:${current.experienceRevision}`
        ) {
          errors.push(`${current.unitId} authored experience must preserve its ten-stage contract`);
        }
        const stageIds = current.experience?.stages?.map(stage => stage.stageId) || [];
        if (new Set(stageIds).size !== stageIds.length) {
          errors.push(`${current.unitId} authored experience stage IDs must be unique`);
        }
        const review = current.audioReviewContract;
        const baseline = getCourseVoiceBaseline(current.voiceBaselineId);
        if (
          !baseline
          || review?.voiceBaselineId !== current.voiceBaselineId
          || review?.dialogueRenderMode !== 'natural-utterance'
          || review?.standaloneWordRenderMode !== 'context-cropped-lexeme-v1'
          || review?.decodedOnsetLimitMs !== 150
          || review?.publicationGate !== 'human-language-review-per-file'
          || review?.nonAcceptedStatus !== 'unreviewed-candidate'
          || !/^[a-f0-9]{64}$/.test(review?.canonicalAudioSetSha256 || '')
          || !Number.isInteger(review?.expectedAudioSourceCount)
          || review.expectedAudioSourceCount <= 0
        ) {
          errors.push(`${current.unitId} authored experience must preserve the inherited voice review contract`);
        }
        const candidateAudioKinds = new Set(['dialogue', 'vocabulary', 'substitution-prompt']);
        const candidateSources = Object.values(current.lessonContent || {})
          .flatMap(lesson => Object.values(lesson.sources || {}))
          .filter(sourceItem => candidateAudioKinds.has(sourceItem.sourceKind));
        if (candidateSources.length !== review?.expectedAudioSourceCount) {
          errors.push(`${current.unitId} audio candidate source count must match its review contract`);
        }
        const audioBasePath = review?.manifestPath?.replace(/\/manifest\.json$/, '');
        for (const sourceItem of candidateSources) {
          const expectedVoice = sourceItem.sourceKind === 'dialogue'
            ? (sourceItem.speaker === 'man' ? baseline?.youthMaleVoiceId : baseline?.youthFemaleVoiceId)
            : sourceItem.sourceKind === 'vocabulary'
              ? baseline?.standaloneWordVoiceId
              : sourceItem.speaker === 'woman'
                ? baseline?.youthFemaleVoiceId
                : baseline?.youthMaleVoiceId;
          const expectedMode = sourceItem.sourceKind === 'vocabulary'
            ? review?.standaloneWordRenderMode
            : review?.dialogueRenderMode;
          if (
            sourceItem.audioSrc !== `${audioBasePath}/${sourceItem.sourceId.toLowerCase()}.mp3`
            || sourceItem.voiceId !== expectedVoice
            || sourceItem.audioRenderMode !== expectedMode
            || sourceItem.audioReviewStatus !== review?.nonAcceptedStatus
          ) {
            errors.push(`${sourceItem.sourceId} must preserve the inherited candidate audio mapping`);
          }
          if (sourceItem.sourceKind === 'dialogue'
            && !declaredSpeakerRoles.has(sourceItem.speakerRole)) {
            errors.push(`${sourceItem.sourceId} must declare a frozen course speaker role`);
          }
          if (Object.hasOwn(sourceItem, 'audioSequence')) {
            errors.push(`${sourceItem.sourceId} cannot declare audioSequence`);
          }
        }
      }

      if (isCurriculumAccepted) {
        const hasAudioCandidate = (
          current.curriculumContract?.audioAuditStatus
          === 'candidate-generated-awaiting-human-review'
        );
        if (current.publicationScope !== 'catalog-only') {
          errors.push(`${current.unitId} curriculum-accepted unit must remain catalog-only`);
        }
        if (current.runtimeProfile !== 'not-authored') {
          errors.push(`${current.unitId} curriculum-accepted unit must remain not-authored`);
        }
        if ((current.beats || []).length > 0) {
          errors.push(`${current.unitId} curriculum-accepted unit cannot declare runtime beats`);
        }
        if (current.landmarkId || current.title || current.experience) {
          errors.push(`${current.unitId} curriculum-accepted unit cannot declare story or page design`);
        }
        if (Object.keys(current.authoredContent || {}).length > 0
          || Object.keys(current.entities || {}).length > 0
          || (current.vocabulary || []).length > 0) {
          errors.push(`${current.unitId} curriculum-accepted unit cannot declare authored runtime content`);
        }
        const forbiddenRuntimeKeys = new Set(['audioSequence', 'audioSequences']);
        if (!hasAudioCandidate) {
          for (const key of ['audioSrc', 'speaker', 'speakerRole', 'voiceId', 'voiceBaselineId']) {
            forbiddenRuntimeKeys.add(key);
          }
        }
        function findForbiddenRuntimeKey(value, path = current.unitId) {
          if (!value || typeof value !== 'object') return;
          for (const [key, nested] of Object.entries(value)) {
            if (forbiddenRuntimeKeys.has(key)) {
              errors.push(`${current.unitId} curriculum-accepted unit cannot declare ${key} at ${path}`);
            }
            findForbiddenRuntimeKey(nested, `${path}.${key}`);
          }
        }
        findForbiddenRuntimeKey(current);
        if (
          current.curriculumContract?.publicationAllowed !== false
          || !pendingAudioAuditStatuses.has(current.curriculumContract?.audioAuditStatus)
          || current.curriculumContract?.speakerMappingStatus !== (
            hasAudioCandidate ? 'frozen-course-role-mapping' : 'not-frozen'
          )
          || current.curriculumContract?.storyDesignStatus !== 'not-authored'
          || current.curriculumContract?.pageImplementationStatus !== 'not-authored'
        ) {
          errors.push(`${current.unitId} curriculum contract must preserve its unimplemented gate`);
        }
        if (['blocked-authorized-source-unavailable', 'candidate-generated-awaiting-human-review']
          .includes(current.curriculumContract?.audioAuditStatus)) {
          const sourceAudit = current.curriculumContract.audioSourceAudit;
          if (
            sourceAudit?.result !== 'no-auditable-official-audio'
            || !Array.isArray(sourceAudit?.checkedSurfaces)
            || sourceAudit.checkedSurfaces.length === 0
            || sourceAudit?.officialAccessModel !== 'book-specific-activation-in-fltrp-u-learning-app'
            || sourceAudit?.officialReferenceId !== 'FLTRP-2023-JCJYJXZY-P58'
          ) {
            errors.push(`${current.unitId} blocked audio audit must preserve its source check evidence`);
          }
        } else if (current.curriculumContract?.audioSourceAudit) {
          errors.push(`${current.unitId} official audio source audit evidence requires an audited status`);
        }
        if (hasAudioCandidate) {
          const baseline = getCourseVoiceBaseline(current.voiceBaselineId);
          const review = current.audioReviewContract;
          const candidatePack = current.curriculumContract?.audioCandidatePack;
          if (!baseline) {
            errors.push(`${current.unitId} audio candidate references unknown voice baseline ${current.voiceBaselineId}`);
          }
          if (
            review?.voiceBaselineId !== current.voiceBaselineId
            || review?.dialogueRenderMode !== 'natural-utterance'
            || review?.standaloneWordRenderMode !== 'context-cropped-lexeme-v1'
            || review?.decodedOnsetLimitMs !== 150
            || review?.publicationGate !== 'human-language-review-per-file'
            || review?.nonAcceptedStatus !== 'unreviewed-candidate'
            || !/^[a-f0-9]{64}$/.test(review?.canonicalAudioSetSha256 || '')
            || !Number.isInteger(review?.expectedAudioSourceCount)
            || review.expectedAudioSourceCount <= 0
          ) {
            errors.push(`${current.unitId} audio candidate must preserve the inherited voice review contract`);
          }
          if (
            candidatePack?.packId !== review?.packId
            || candidatePack?.generationBasis !== 'nce-u01-kokoro-candidate-v3'
            || candidatePack?.status !== 'local-poc-candidate-unreviewed'
            || candidatePack?.disclosure !== 'ai-generated-not-official-textbook-audio'
          ) {
            errors.push(`${current.unitId} audio candidate must preserve pack identity and disclosure`);
          }
          if (current.curriculumContract?.speakerMappingBasis
            !== 'textbook-dialogue-semantics-and-figure-sequence') {
            errors.push(`${current.unitId} audio candidate must preserve its speaker mapping basis`);
          }

          const audioSourceKinds = new Set(['dialogue', 'vocabulary', 'substitution-prompt']);
          const allSources = Object.values(current.lessonContent || {})
            .flatMap(lesson => Object.values(lesson.sources || {}));
          const candidateSources = allSources.filter(sourceItem => (
            audioSourceKinds.has(sourceItem.sourceKind)
          ));
          if (candidateSources.length !== review?.expectedAudioSourceCount) {
            errors.push(`${current.unitId} audio candidate source count must match its review contract`);
          }
          const audioBasePath = review?.manifestPath?.replace(/\/manifest\.json$/, '');
          for (const sourceItem of allSources) {
            const ownsCandidateAudio = audioSourceKinds.has(sourceItem.sourceKind);
            const audioKeys = [
              'audioSrc', 'voiceId', 'audioRenderMode', 'audioReviewStatus'
            ];
            if (!ownsCandidateAudio) {
              if (audioKeys.some(key => Object.hasOwn(sourceItem, key))) {
                errors.push(`${sourceItem.sourceId} cannot own candidate audio in source kind ${sourceItem.sourceKind}`);
              }
              continue;
            }
            const expectedPath = `${audioBasePath}/${sourceItem.sourceId.toLowerCase()}.mp3`;
            const isStandaloneWord = sourceItem.sourceKind === 'vocabulary';
            const expectedMode = isStandaloneWord
              ? review.standaloneWordRenderMode
              : review.dialogueRenderMode;
            let expectedVoiceId = baseline?.youthMaleVoiceId;
            if (isStandaloneWord) expectedVoiceId = baseline?.standaloneWordVoiceId;
            if (sourceItem.sourceKind === 'substitution-prompt' && sourceItem.speaker === 'woman') {
              expectedVoiceId = baseline?.youthFemaleVoiceId;
            }
            if (sourceItem.sourceKind === 'dialogue') {
              expectedVoiceId = sourceItem.speaker === 'man'
                ? baseline?.youthMaleVoiceId
                : sourceItem.speaker === 'woman'
                  ? baseline?.youthFemaleVoiceId
                  : undefined;
              if (!new Set([
                ...Object.keys(current.experience?.roles || {}),
                ...(current.experience?.stages || []).flatMap(stage => stage.roles || [])
              ]).has(sourceItem.speakerRole)) {
                errors.push(`${sourceItem.sourceId} must declare a frozen course speaker role`);
              }
            }
            if (
              sourceItem.audioSrc !== expectedPath
              || sourceItem.voiceId !== expectedVoiceId
              || sourceItem.audioRenderMode !== expectedMode
              || sourceItem.audioReviewStatus !== review.nonAcceptedStatus
            ) {
              errors.push(`${sourceItem.sourceId} must preserve the inherited candidate audio mapping`);
            }
          }
        } else if (current.audioReviewContract || current.curriculumContract?.audioCandidatePack) {
          errors.push(`${current.unitId} candidate audio metadata requires its candidate audit status`);
        }
      } else if (!getCourseVoiceBaseline(current.voiceBaselineId)) {
        errors.push(`${current.unitId} references unknown voice baseline ${current.voiceBaselineId}`);
      }

      for (const lessonId of current.lessonIds || []) {
        if (lessonOwners.has(lessonId)) {
          errors.push(`${lessonId} belongs to multiple units: ${lessonOwners.get(lessonId)} and ${current.unitId}`);
        } else {
          lessonOwners.set(lessonId, current.unitId);
        }
      }

      for (const currentTarget of current.targets || []) {
        if (targetIds.has(currentTarget.targetId)) errors.push(`${currentTarget.targetId} is duplicated`);
        targetIds.add(currentTarget.targetId);
        if (!Array.isArray(currentTarget.evidenceModes) || currentTarget.evidenceModes.length === 0) {
          errors.push(`${currentTarget.targetId} must declare evidence modes`);
        }
        if (isCurriculumGoverned) {
          if (!curriculumTargetTiers.has(currentTarget.tier)) {
            errors.push(`${currentTarget.targetId} must declare an accepted curriculum tier`);
          }
          if (!Array.isArray(currentTarget.structureRefs)) {
            errors.push(`${currentTarget.targetId} must declare structureRefs`);
          }
          if (!Array.isArray(currentTarget.primarySourceRefs)
            || currentTarget.primarySourceRefs.length === 0) {
            errors.push(`${currentTarget.targetId} must declare primary source refs`);
          }
          if (!Array.isArray(currentTarget.inheritedSourceRefs)) {
            errors.push(`${currentTarget.targetId} must declare inherited source refs`);
          }
          if (typeof currentTarget.firstSessionBoundary !== 'string'
            || currentTarget.firstSessionBoundary.length === 0) {
            errors.push(`${currentTarget.targetId} must declare its first-session boundary`);
          }
          if (isCurriculumAccepted && Object.prototype.hasOwnProperty.call(currentTarget, 'contextIds')) {
            errors.push(`${currentTarget.targetId} cannot declare runtime contexts before design`);
          }
          if (isAuthoredStoryStage
            && (!Array.isArray(currentTarget.contextIds) || currentTarget.contextIds.length < 2)) {
            errors.push(`${currentTarget.targetId} must declare at least two authored contexts`);
          }
        } else if (!Array.isArray(currentTarget.contextIds) || currentTarget.contextIds.length < 2) {
          errors.push(`${currentTarget.targetId} must declare at least two contexts`);
        }
      }

      for (const beat of current.beats || []) {
        const task = beat.task;
        if (!task) {
          const ownsMicrotaskFlow = current.runtimeProfile === 'microtask-v2'
            && Array.isArray(beat.microtasks)
            && beat.microtasks.length > 0;
          if (current.status === 'candidate' && !ownsMicrotaskFlow) {
            errors.push(`${beat.beatId} must declare an authored task for candidate unit ${current.unitId}`);
          }
          continue;
        }
        if (typeof task.taskId !== 'string' || task.taskId.length === 0) {
          errors.push(`${beat.beatId} authored task must declare taskId`);
        } else if (taskIds.has(task.taskId)) {
          errors.push(`${task.taskId} is duplicated`);
        } else {
          taskIds.add(task.taskId);
        }

        const contextIds = [...new Set((current.targets || []).flatMap(item => item.contextIds || []))];
        if (!contextIds.includes(task.contextId)) {
          errors.push(`${beat.beatId} authored task context ${task.contextId} is outside ${current.unitId}`);
        }
        for (const contextId of contextIds) {
          const answerId = task.answerKeyByContext?.[contextId];
          if (typeof answerId !== 'string' || answerId.length === 0) {
            errors.push(`${beat.beatId} authored task answer key must cover ${contextId}`);
          }
        }

        if (task.formativeBinding) {
          const boundTarget = (current.targets || []).find(
            item => item.targetId === task.formativeBinding.targetId
          );
          if (!boundTarget) {
            errors.push(`${beat.beatId} formative binding must reference a target in ${current.unitId}`);
            continue;
          }
          if (!boundTarget.evidenceModes.includes(task.formativeBinding.evidenceMode)) {
            errors.push(`${beat.beatId} formative binding evidence mode is outside ${boundTarget.targetId}`);
          }
        }
      }

      const authoredMicrotasks = [
        ...(current.beats || []).flatMap(beat => beat.microtasks || []),
        ...(current.runtimeProfile === 'story-stage-v1'
          ? (current.experience?.stages || [])
          : [])
      ];
      const microtaskOrder = new Map(authoredMicrotasks
        .map((microtask, index) => [microtask.microtaskId, index]));
      for (const [retiredId, resumeTargetId] of Object.entries(
        current.retiredMicrotaskResumeTargets || {}
      )) {
        if (microtaskOrder.has(retiredId)) {
          errors.push(`retired microtask ${retiredId} is still active`);
        }
        if (!microtaskOrder.has(resumeTargetId)) {
          errors.push(`retired microtask ${retiredId} references unknown resume target ${resumeTargetId}`);
        }
      }
      const checkpointFactOwner = new Map();
      authoredMicrotasks.forEach((microtask, index) => {
        for (const factId of microtask.persistence?.checkpointFacts || []) {
          if (!checkpointFactOwner.has(factId)) checkpointFactOwner.set(factId, index);
        }
      });
      const sourceEntries = Object.values(current.lessonContent || {})
        .flatMap(lesson => Object.entries(lesson.sources || {}));
      const knownSourceIds = new Set(sourceEntries.map(([sourceId]) => sourceId));
      const knownSourceById = new Map(sourceEntries);
      const knownContentIds = new Set(Object.keys(current.authoredContent || {}));
      const knownEntityIds = new Set(Object.keys(current.entities || {}));
      const knownReviewContextIds = new Set(Object.keys(current.reviewContexts || {}));
      const answerFairnessChannels = new Set([
        'audio-form', 'word-form', 'structure-use', 'communication-structure',
        'discourse-understanding', 'vocabulary-transfer', 'guided-story-action'
      ]);
      const answerFairnessSupportSurfaces = new Set([
        'english-question', 'audio-word-plaque', 'english-word-plaque',
        'direct-story-instruction'
      ]);
      const answerFairnessCandidateLanguageBoundaries = new Set([
        'source-text-only'
      ]);

      function copyContainsAnswer(copy, answer) {
        const visible = String(copy || '').trim().toLowerCase();
        const candidate = String(answer || '').trim().toLowerCase();
        if (!visible || !candidate) return false;
        if (/\p{Script=Han}/u.test(candidate)) return visible.includes(candidate);
        const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, 'iu')
          .test(visible);
      }

      function validateAnswerFairness(subject, {
        subjectId,
        parentStage = subject,
        expectedChannel = null,
        extraVisibleCopies = []
      }) {
        const fairness = subject.answerFairness;
        if (!fairness || typeof fairness !== 'object') {
          errors.push(`${subjectId} answer fairness must be declared`);
          return;
        }
        if (!answerFairnessChannels.has(fairness.targetEvidenceChannel)) {
          errors.push(`${subjectId} answer fairness has invalid target evidence channel ${fairness.targetEvidenceChannel}`);
        }
        if (expectedChannel && fairness.targetEvidenceChannel !== expectedChannel) {
          errors.push(`${subjectId} answer fairness target evidence channel must match ${expectedChannel}`);
        }
        const guided = fairness.targetEvidenceChannel === 'guided-story-action';
        if (!Array.isArray(fairness.targetEvidenceSourceRefs)) {
          errors.push(`${subjectId} answer fairness must declare target evidence sources`);
        } else if (!guided && fairness.targetEvidenceSourceRefs.length === 0) {
          errors.push(`${subjectId} answer fairness must declare at least one target evidence source`);
        } else if (guided && fairness.targetEvidenceSourceRefs.length > 0) {
          errors.push(`${subjectId} guided story action cannot declare target evidence sources`);
        }
        for (const sourceRef of fairness.targetEvidenceSourceRefs || []) {
          if (!knownSourceIds.has(sourceRef)) {
            errors.push(`${subjectId} answer fairness references unknown source ${sourceRef}`);
          }
        }
        if (!Array.isArray(fairness.intentionalPreSubmitSupport)) {
          errors.push(`${subjectId} answer fairness must declare intentional pre-submit support`);
        }
        for (const support of fairness.intentionalPreSubmitSupport || []) {
          if (!answerFairnessSupportSurfaces.has(support?.surface)) {
            errors.push(`${subjectId} answer fairness uses invalid support surface ${support?.surface}`);
          }
          if (support?.sourceRef && !knownSourceIds.has(support.sourceRef)) {
            errors.push(`${subjectId} answer fairness references unknown source ${support.sourceRef}`);
          }
          if (support?.entityId && !knownEntityIds.has(support.entityId)) {
            errors.push(`${subjectId} answer fairness references unknown entity ${support.entityId}`);
          }
        }
        if (guided) {
          if (!(fairness.intentionalPreSubmitSupport || []).some(support => (
            support?.surface === 'direct-story-instruction'
          ))) {
            errors.push(`${subjectId} guided story action must declare direct-story-instruction support`);
          }
          if ((parentStage.evidenceRefs || []).length > 0) {
            errors.push(`${subjectId} guided story action cannot produce learning evidence`);
          }
          return;
        }

        const labelsHidden = subject.hideEntityLabelsUntilCorrect === true;
        if (labelsHidden && fairness.candidateLabelVisibility !== 'after-correct') {
          errors.push(`${subjectId} hidden candidate labels must remain hidden until after correct`);
        }
        const sourceOptions = (subject.options || [])
          .filter(option => option.sourceRef)
          .map(option => knownSourceById.get(option.sourceRef))
          .filter(Boolean);
        if (
          fairness.candidateLanguageBoundary
          && !answerFairnessCandidateLanguageBoundaries.has(
            fairness.candidateLanguageBoundary
          )
        ) {
          errors.push(`${subjectId} answer fairness has invalid candidate language boundary ${fairness.candidateLanguageBoundary}`);
        }
        if (
          sourceOptions.some(option => option.translation)
          && fairness.candidateLanguageBoundary !== 'source-text-only'
        ) {
          errors.push(`${subjectId} translated source candidates must declare a source-text-only language boundary`);
        }

        const visibleCopies = [
          parentStage.title,
          parentStage.instruction,
          subject.title,
          subject.instruction,
          subject.prompt,
          ...extraVisibleCopies
        ].filter(Boolean);
        const answerCue = /正确答案|答案(?:就)?是|应该选|应当选|选择正确的|选中正确的/;
        const acceptedOption = (subject.options || []).find(option => (
          option.optionId === subject.answerRule?.acceptedOptionId
        ));
        if (acceptedOption?.label && visibleCopies.some(copy => (
          answerCue.test(String(copy)) && copyContainsAnswer(copy, acceptedOption.label)
        ))) {
          errors.push(`${subjectId} answer leakage exposes accepted option ${acceptedOption.label}`);
        }

        const acceptedEntityId = subject.answerRule?.acceptedEntityId;
        if (acceptedEntityId && !labelsHidden) {
          const acceptedEntity = current.entities?.[acceptedEntityId] || {};
          const entityOption = (subject.options || []).find(option => (
            option.entityId === acceptedEntityId
          ));
          const candidateLabels = [...new Set([
            entityOption?.label,
            acceptedEntity.title,
            acceptedEntity.label
          ].filter(Boolean))];
          const ownershipQuestion = visibleCopies.some(copy => /谁|哪位|归属|回到谁/.test(copy));
          if (candidateLabels.some(label => visibleCopies.some(copy => (
            (answerCue.test(String(copy)) && copyContainsAnswer(copy, label))
              || (ownershipQuestion && /主人|归属者/.test(label))
          )))) {
            errors.push(`${subjectId} answer leakage exposes accepted entity ${acceptedEntityId}`);
          }
        }

        const acceptedSource = knownSourceById.get(subject.answerRule?.acceptedSourceRef);
        if (acceptedSource?.text && visibleCopies.some(copy => (
          copyContainsAnswer(copy, acceptedSource.text)
        ))) {
          errors.push(`${subjectId} answer leakage exposes accepted source ${acceptedSource.sourceId}`);
        }
      }

      if (isAuthoredStoryStage) {
        for (const stage of current.experience?.stages || []) {
          const answerSubjects = stage.rounds?.length ? stage.rounds : [stage];
          for (const subject of answerSubjects) {
            if (!subject.answerRule) continue;
            validateAnswerFairness(subject, {
              subjectId: subject.roundId || subject.stageId,
              parentStage: stage
            });
          }
        }
      }
      if (isCurriculumGoverned) {
        const localTargetIds = new Set((current.targets || []).map(targetItem => targetItem.targetId));
        const coverageSourceIds = new Set();

        for (const targetItem of current.targets || []) {
          const localRefs = targetItem.primarySourceRefs || [];
          if (new Set(localRefs).size !== localRefs.length) {
            errors.push(`${targetItem.targetId} has duplicated primary source refs`);
          }
          for (const sourceRef of localRefs) {
            if (!knownSourceIds.has(sourceRef)) {
              errors.push(`${targetItem.targetId} references unknown primary source ${sourceRef}`);
            }
          }
          for (const sourceRef of targetItem.inheritedSourceRefs || []) {
            if (!/^L\d{2}-[A-Z]\d{2}$/.test(sourceRef)) {
              errors.push(`${targetItem.targetId} has invalid inherited source ref ${sourceRef}`);
            }
            if (knownSourceIds.has(sourceRef)) {
              errors.push(`${targetItem.targetId} must keep local source ${sourceRef} in primarySourceRefs`);
            }
          }
          for (const structureRef of targetItem.structureRefs || []) {
            if (!/^GS-[A-Z0-9-]+$/.test(structureRef)) {
              errors.push(`${targetItem.targetId} has invalid structure ref ${structureRef}`);
            }
          }
        }

        if (!Array.isArray(current.sourceTargetCoverage)
          || current.sourceTargetCoverage.length === 0) {
          errors.push(`${current.unitId} curriculum-accepted unit must declare source-target coverage`);
        }
        for (const [rowIndex, row] of (current.sourceTargetCoverage || []).entries()) {
          if (!Array.isArray(row.sourceRefs) || row.sourceRefs.length === 0) {
            errors.push(`${current.unitId} coverage row ${rowIndex + 1} must declare sourceRefs`);
            continue;
          }
          if (typeof row.prohibitedInference !== 'string' || row.prohibitedInference.length === 0) {
            errors.push(`${current.unitId} coverage row ${rowIndex + 1} must declare prohibitedInference`);
          }
          for (const sourceRef of row.sourceRefs) {
            if (!knownSourceIds.has(sourceRef)) {
              errors.push(`${current.unitId} coverage row references unknown source ${sourceRef}`);
              continue;
            }
            if (coverageSourceIds.has(sourceRef)) {
              errors.push(`${current.unitId} coverage matrix repeats source ${sourceRef}`);
            }
            coverageSourceIds.add(sourceRef);
            const sourceItem = knownSourceById.get(sourceRef);
            for (const mode of Object.values(row.coverage || {})) {
              if (sourceItem.coveragePolicy === 'optional' && mode !== 'optional') {
                errors.push(`${sourceRef} optional source cannot carry ${mode} coverage`);
              }
              if (sourceItem.coveragePolicy !== 'optional' && mode === 'optional') {
                errors.push(`${sourceRef} required source cannot carry optional coverage`);
              }
            }
          }
          for (const [targetId, mode] of Object.entries(row.coverage || {})) {
            if (!localTargetIds.has(targetId)) {
              errors.push(`${current.unitId} coverage row references unknown target ${targetId}`);
            }
            if (!curriculumCoverageModes.has(mode)) {
              errors.push(`${current.unitId} coverage row has invalid mode ${mode}`);
            }
          }
        }
        for (const sourceId of knownSourceIds) {
          if (!coverageSourceIds.has(sourceId)) {
            errors.push(`${current.unitId} coverage matrix omits source ${sourceId}`);
          }
        }

        const evidencePlan = current.firstSessionEvidencePlan;
        if (evidencePlan) {
          const planForbiddenField = /^(?:answerKey|answerId|options|contextIds|challengeRef|taskId|microtaskId)$/;
          const planSourceRefs = new Set();
          const selectedPromptRefs = evidencePlan.promptEvidenceSourceRefs || [];
          const selectedLexicalRefs = evidencePlan.lexicalEvidenceSourceRefs || [];
          const selectedEvidenceRefs = new Set([...selectedPromptRefs, ...selectedLexicalRefs]);
          const selectedPromptRefSet = new Set(selectedPromptRefs);
          const selectedLexicalRefSet = new Set(selectedLexicalRefs);

          function findForbiddenPlanField(value, path = `${current.unitId}.firstSessionEvidencePlan`) {
            if (!value || typeof value !== 'object') return;
            for (const [key, nested] of Object.entries(value)) {
              if (planForbiddenField.test(key)) {
                errors.push(`${current.unitId} evidence plan cannot author runtime field ${key} at ${path}`);
              }
              findForbiddenPlanField(nested, `${path}.${key}`);
            }
          }
          findForbiddenPlanField(evidencePlan);

          if (evidencePlan.policyId !== 'first-session-representative-retrieval-v1') {
            errors.push(`${current.unitId} evidence plan must use the representative retrieval policy`);
          }
          if (new Set(selectedPromptRefs).size !== selectedPromptRefs.length
            || new Set(selectedLexicalRefs).size !== selectedLexicalRefs.length) {
            errors.push(`${current.unitId} evidence plan has duplicate selected source refs`);
          }
          for (const sourceRef of selectedPromptRefs) {
            const sourceItem = knownSourceById.get(sourceRef);
            if (!sourceItem || sourceItem.sourceKind !== 'substitution-prompt') {
              errors.push(`${current.unitId} evidence plan prompt ref ${sourceRef} is not a local prompt`);
            }
          }
          for (const sourceRef of selectedLexicalRefs) {
            const sourceItem = knownSourceById.get(sourceRef);
            if (!sourceItem || sourceItem.sourceKind !== 'vocabulary') {
              errors.push(`${current.unitId} evidence plan lexical ref ${sourceRef} is not local vocabulary`);
            }
          }
          for (const sourceRef of selectedEvidenceRefs) {
            const sourceItem = knownSourceById.get(sourceRef);
            if (sourceItem
              && (sourceItem.sourceRole !== 'target' || sourceItem.coveragePolicy !== 'evidence')) {
              errors.push(`${sourceRef} selected first-session evidence must be target/evidence`);
            }
          }
          for (const [sourceRef, sourceItem] of sourceEntries) {
            if (sourceItem.sourceKind === 'substitution-prompt'
              && (sourceItem.coveragePolicy === 'evidence') !== selectedPromptRefSet.has(sourceRef)) {
              errors.push(`${sourceRef} prompt evidence policy must match the representative plan`);
            }
            if (sourceItem.sourceKind === 'vocabulary'
              && (sourceItem.coveragePolicy === 'evidence') !== selectedLexicalRefSet.has(sourceRef)) {
              errors.push(`${sourceRef} vocabulary evidence policy must match the representative plan`);
            }
          }

          const evidenceSlotIds = new Set();
          for (const slot of evidencePlan.evidenceSlots || []) {
            if (!slot.slotId || evidenceSlotIds.has(slot.slotId)) {
              errors.push(`${current.unitId} evidence plan slots must have unique IDs`);
            }
            evidenceSlotIds.add(slot.slotId);
            if (!Number.isInteger(slot.retrievalOpportunityQuota)
              || slot.retrievalOpportunityQuota < 1) {
              errors.push(`${slot.slotId || current.unitId} must declare a positive retrieval opportunity quota`);
            }
            for (const sourceRef of slot.sourceRefs || []) {
              if (!knownSourceIds.has(sourceRef)) {
                errors.push(`${slot.slotId || current.unitId} references unknown evidence source ${sourceRef}`);
              }
              planSourceRefs.add(sourceRef);
            }
            for (const binding of slot.targetBindings || []) {
              const targetItem = (current.targets || []).find(item => item.targetId === binding.targetId);
              if (!targetItem) {
                errors.push(`${slot.slotId || current.unitId} references unknown evidence target ${binding.targetId}`);
              } else if (!targetItem.evidenceModes.includes(binding.evidenceMode)) {
                errors.push(`${slot.slotId || current.unitId} evidence mode is outside ${binding.targetId}`);
              }
            }
          }
          for (const sourceRef of selectedEvidenceRefs) {
            if (!planSourceRefs.has(sourceRef)) {
              errors.push(`${sourceRef} selected first-session evidence is not assigned to a slot`);
            }
          }
        }
      }
      if (current.experienceRevision === NCE_U01_V2_REVISION) {
        if (
          current.experience?.stageTitleStyle?.maximumChineseCharacters !== 6
          || current.experience?.stageTitleStyle?.form !== 'noun-or-action-phrase'
          || current.experience?.stageTitleStyle?.detailsBelongInTaskPrompt !== true
        ) {
          errors.push('lesson1-2-v2 must declare the concise child stage title style');
        }
        if (current.experience?.uiCopy?.knowledge?.collapseLabel !== '收起') {
          errors.push('lesson1-2-v2 knowledge card must use the direct 收起 action');
        }
        const outcomePractices = current.experience?.outcomePractices;
        const forbiddenPracticeField = /^(?:resultId|reviewCellId|challengeRef|targetResults|evidenceMode|adventureHearts|landmarkId|nextDueDay|mastery|checkpointFacts|microtaskId|storyFacts|progress)$/;
        const practiceIds = new Set();
        function validatePracticeShape(value, practiceId, path = practiceId) {
          if (!value || typeof value !== 'object') return;
          for (const [field, child] of Object.entries(value)) {
            if (forbiddenPracticeField.test(field)) {
              errors.push(`${practiceId} uses forbidden mainline field ${field} at ${path}`);
            }
            validatePracticeShape(child, practiceId, `${path}.${field}`);
          }
        }

        if (!Array.isArray(outcomePractices) || outcomePractices.length !== 2) {
          errors.push('lesson1-2-v2 must declare exactly two optional outcome practices');
        } else {
          for (const practice of outcomePractices) {
            if (!practice?.practiceId || practiceIds.has(practice.practiceId)) {
              errors.push(`${practice?.practiceId || 'outcome practice'} must have one unique practiceId`);
              continue;
            }
            practiceIds.add(practice.practiceId);
            validatePracticeShape(practice, practice.practiceId);
            if (practice.kind === 'manual-dialogue') {
              const originRest = Object.values(current.experience?.restStops || {}).find(restStop => (
                restStop.outcomeNodeId === practice.availableAt?.outcomeNodeId
              ));
              if (
                !originRest
                || practice.availableAt?.status !== 'rest-stop'
                || practice.availableAt?.buildStage !== 0
              ) {
                errors.push(`${practice.practiceId} references unknown outcome node ${practice.availableAt?.outcomeNodeId}`);
              }
              if (practice.unlockAfterStageId !== 'L01-M12') {
                errors.push(`${practice.practiceId} must unlock only after L01-M12`);
              }
              if (
                practice.sceneMode !== 'dialogue-stage'
                || practice.sceneVariant !== 'full-role-enactment'
                || practice.propSurface !== 'counter-surface'
              ) {
                errors.push(`${practice.practiceId} must preserve the fixed handbag counter scene`);
              }
              if (typeof practice.returnMainlineLabel !== 'string' || !practice.returnMainlineLabel) {
                errors.push(`${practice.practiceId} manual-dialogue must return directly to the saved mainline`);
              }
              if (
                practice.countsTowardProgress !== false
                || practice.producesLearningEvidence !== false
                || practice.affectsAdventureHearts !== false
              ) {
                errors.push(`${practice.practiceId} must remain no-progress, no-evidence, and no-hearts`);
              }
              const dialogueTurnRefs = practice.dialogueTurnRefs || [];
              if (
                dialogueTurnRefs.length !== 7
                || dialogueTurnRefs.some((sourceRef, index) => sourceRef !== `L01-D0${index + 1}`)
              ) {
                errors.push(`${practice.practiceId} must keep the complete ordered seven-line dialogue`);
              }
              for (const sourceRef of dialogueTurnRefs) {
                if (!knownSourceIds.has(sourceRef)) {
                  errors.push(`${practice.practiceId} references unknown dialogue turn ${sourceRef}`);
                }
              }
              for (const entityId of [...(practice.castOrder || []), ...(practice.propEntityIds || [])]) {
                if (!knownEntityIds.has(entityId)) {
                  errors.push(`${practice.practiceId} references unknown entity ${entityId}`);
                }
              }
              if (!Array.isArray(practice.turnHints) || practice.turnHints.length !== 7) {
                errors.push(`${practice.practiceId} must author one two-level hint for every dialogue turn`);
              } else {
                for (const hint of practice.turnHints) {
                  if (!dialogueTurnRefs.includes(hint.turnRef)
                    || typeof hint.intent !== 'string' || !hint.intent
                    || typeof hint.openingChunk !== 'string' || !hint.openingChunk) {
                    errors.push(`${practice.practiceId} has an incomplete two-level hint for ${hint.turnRef}`);
                  }
                }
              }
            } else if (practice.kind === 'case-recap') {
              if (
                practice.availableAt?.status !== 'unit-built'
                || practice.availableAt?.buildStage !== 5
                || practice.availableAt?.outcomeNodeId !== current.experience?.completion?.outcomeNodeId
              ) {
                errors.push(`${practice.practiceId} must be available only after unit-built`);
              }
              if (practice.diagnosticKind !== 'same-day-practice') {
                errors.push(`${practice.practiceId} may only use same-day-practice diagnostics`);
              }
              if (!Array.isArray(practice.items) || practice.items.length !== 3) {
                errors.push(`${practice.practiceId} must declare exactly three recap items`);
                continue;
              }
              const requiredPracticeTargets = new Set([
                'discourse-understanding', 'communication-structure', 'vocabulary-transfer'
              ]);
              const actualPracticeTargets = practice.items.map(item => item.practiceTarget);
              for (const practiceTarget of requiredPracticeTargets) {
                if (actualPracticeTargets.filter(value => value === practiceTarget).length !== 1) {
                  errors.push(`${practice.practiceId} must declare exactly one ${practiceTarget} item`);
                }
              }
              for (const item of practice.items) {
                if (!knownContentIds.has(item.promptRef)) {
                  errors.push(`${item.itemId} references unknown prompt ${item.promptRef}`);
                } else if (current.authoredContent?.[item.promptRef]?.kind !== 'practice-prompt') {
                  errors.push(`${item.itemId} prompt ${item.promptRef} must be practice-prompt content`);
                }
                if (!knownSourceIds.has(item.correctAudioRef)) {
                  errors.push(`${item.itemId} references unknown correct audio ${item.correctAudioRef}`);
                }
                if (!knownReviewContextIds.has(item.contextRef)) {
                  errors.push(`${item.itemId} references unknown context ${item.contextRef}`);
                }
                for (const entityId of item.sceneEntityIds || []) {
                  if (!knownEntityIds.has(entityId)) {
                    errors.push(`${item.itemId} references unknown scene entity ${entityId}`);
                  }
                }
                const optionIds = new Set();
                for (const option of item.options || []) {
                  if (!option?.optionId || optionIds.has(option.optionId)) {
                    errors.push(`${item.itemId} has a missing or duplicate optionId ${option?.optionId}`);
                  }
                  optionIds.add(option?.optionId);
                  if (option.entityId && !knownEntityIds.has(option.entityId)) {
                    errors.push(`${item.itemId} references unknown option entity ${option.entityId}`);
                  }
                  if (option.sourceRef && !knownSourceIds.has(option.sourceRef)) {
                    errors.push(`${item.itemId} references unknown option source ${option.sourceRef}`);
                  }
                }
                if (item.answerRule?.type !== 'select-one') {
                  errors.push(`${item.itemId} must use the shared select-one answer rule`);
                } else if (item.answerRule.acceptedEntityId) {
                  if (!(item.options || []).some(option => (
                    option.entityId === item.answerRule.acceptedEntityId
                  ))) {
                    errors.push(`${item.itemId} accepted entity ${item.answerRule.acceptedEntityId} is not a candidate`);
                  }
                } else if (item.answerRule.acceptedSourceRef) {
                  if (!(item.options || []).some(option => (
                    option.sourceRef === item.answerRule.acceptedSourceRef
                  ))) {
                    errors.push(`${item.itemId} accepted source ${item.answerRule.acceptedSourceRef} is not a candidate`);
                  }
                } else {
                  errors.push(`${item.itemId} must declare one accepted entity or source`);
                }
                validateAnswerFairness(item, {
                  subjectId: item.itemId,
                  expectedChannel: item.practiceTarget,
                  extraVisibleCopies: [
                    current.authoredContent?.[item.promptRef]?.text,
                    practice.entryLabel,
                    practice.entryHint,
                    practice.kicker,
                    practice.intro
                  ]
                });
              }
            } else {
              errors.push(`${practice.practiceId} uses unknown outcome practice kind ${practice.kind}`);
            }
          }
        }
      }
      const declarativeRuleTypes = new Set([
        'select-one', 'match-entity', 'place-in-slot',
        'ordered-blocks', 'ordered-sequence', 'connect-reference',
        'detect-error', 'perform-action', 'all-of'
      ]);
      const presentationEnterConditionKinds = new Set([
        'microtask-start', 'step-active', 'step-completed', 'challenge-active',
        'phase', 'challenge-completed', 'microtask-complete'
      ]);
      const presentationLifecyclePhases = new Set([
        'awaiting-response', 'audio-playing', 'audio-retry', 'audio-blocked', 'audio-failed',
        'answered-awaiting-save', 'persistence-retry', 'unit-verifying',
        'rescue-model', 'completed'
      ]);
      const presentationAdvancePolicies = new Set([
        'auto-after-motion', 'explicit-child-continue'
      ]);
      const candidateSetPolicies = new Set([
        'full-diagnostic', 'authentic-story-participants', 'authentic-scene-pair'
      ]);
      const nceV2PropSurfaces = new Set([
        'counter-surface', 'workbench-surface', 'coat-rack', 'story-counter'
      ]);
      const sharedListenAnswerStepIds = new Set([
        'L01-M08:S02',
        'L02-M11:S01', 'L02-M12:S01', 'L02-M15:S03',
        'L02-M16:S01', 'L02-M17:S01', 'L02-M20:S01'
      ]);
      const independentListenStepIds = new Set([
        'L01-M07:S01', 'L01-M11:S01', 'L02-M19:S02'
      ]);
      for (const beat of current.beats || []) {
        const beatMicrotasks = beat.microtasks || [];
        if (beatMicrotasks.length > 0 && beat.completionRule !== 'all-required') {
          errors.push(`${beat.beatId} microtasks must use all-required completion`);
        }
        for (const [microtaskIndex, microtask] of beatMicrotasks.entries()) {
          if (microtaskIds.has(microtask.microtaskId)) {
            errors.push(`${microtask.microtaskId} is duplicated`);
          } else {
            microtaskIds.add(microtask.microtaskId);
          }
          if (!current.lessonIds.includes(microtask.lessonId)) {
            errors.push(`${microtask.microtaskId} lesson is outside ${current.unitId}`);
          }
          for (const contact of microtask.sourceContacts || []) {
            if (!knownSourceIds.has(contact.sourceRef)) {
              errors.push(`${microtask.microtaskId} source contact references unknown source ${contact.sourceRef}`);
            }
            if (
              contact.contactMode === 'utterance-embedded'
              && !current.lessonContent?.lesson1?.sources?.[contact.utteranceSourceRef]
                ?.embeddedSourceRefs?.includes(contact.sourceRef)
            ) {
              errors.push(`${microtask.microtaskId} source contact ${contact.sourceRef} is not embedded by ${contact.utteranceSourceRef}`);
            }
          }
          for (const entityId of microtask.presentation?.characterEntityIds || []) {
            if (!knownEntityIds.has(entityId)) {
              errors.push(`${microtask.microtaskId} references unknown character ${entityId}`);
            }
          }
          if (
            current.experienceRevision === NCE_U01_V2_REVISION
            && (microtask.presentation?.sceneEntityIds || []).length > 0
            && !nceV2PropSurfaces.has(microtask.presentation?.propSurface)
          ) {
            errors.push(`${microtask.microtaskId} must declare one physical prop surface`);
          }
          for (const knowledgeCardRef of microtask.knowledgeCardRefs || []) {
            const knowledgeCard = current.authoredContent?.[knowledgeCardRef];
            if (!knowledgeCard) {
              errors.push(`${microtask.microtaskId} references unknown knowledge card ${knowledgeCardRef}`);
            } else if (
              !['knowledge-card', 'knowledge-card-detail'].includes(knowledgeCard.kind)
              || typeof knowledgeCard.title !== 'string'
              || typeof knowledgeCard.text !== 'string'
            ) {
              errors.push(`${microtask.microtaskId} knowledge card ${knowledgeCardRef} is not fully authored`);
            }
          }
          for (const contextId of Object.keys(microtask.contextVariants || {})) {
            const responseKey = microtask.responseKeyByContext?.[contextId];
            if (!responseKey || !['single', 'set', 'ordered', 'mapping', 'composition'].includes(responseKey.type)) {
              errors.push(`${microtask.microtaskId} response must cover ${contextId}`);
            }
          }
          if (microtask.audioSequenceId) {
            const audioSequences = current.lessonContent?.[microtask.lessonId]?.audioSequences;
            if (!audioSequences?.[microtask.audioSequenceId]) {
              errors.push(`${microtask.microtaskId} audio sequence is not authored`);
            }
          }
          const checkpointStage = microtask.checkpointAfterSuccess?.buildStage;
          if (
            checkpointStage !== undefined
            && (microtaskIndex !== beatMicrotasks.length - 1 || checkpointStage !== beat.buildStage)
          ) {
            errors.push(`${microtask.microtaskId} buildStage can advance only after the whole beat`);
          }
          if (microtask.formativeBinding) {
            const boundTarget = (current.targets || []).find(target => (
              target.targetId === microtask.formativeBinding.targetId
            ));
            if (
              !boundTarget
              || !boundTarget.evidenceModes.includes(microtask.formativeBinding.evidenceMode)
            ) {
              errors.push(`${microtask.microtaskId} formative binding is outside its target contract`);
            }
          }
          if (current.runtimeProfile === 'microtask-v2') {
            if (
              microtask.persistence?.atomic !== true
              || microtask.persistence?.resumePolicy !== 'restart-microtask'
            ) {
              errors.push(`${microtask.microtaskId} must declare one atomic restartable persistence boundary`);
            }
            if (!Array.isArray(microtask.steps) || microtask.steps.length === 0) {
              errors.push(`${microtask.microtaskId} must author at least one runtime step`);
            }
            if (current.experienceRevision === NCE_U01_V2_REVISION) {
              const allowedSceneModes = new Set([
                'dialogue-stage', 'object-workbench', 'grammar-lab',
                'story-journey', 'outcome-rest'
              ]);
              const restStopId = microtask.restStopId || microtask.restStop?.restStopId;
              if (restStopId) {
                const restStop = current.experience?.restStops?.[restStopId];
                if (!restStop) {
                  errors.push(`${microtask.microtaskId} references unknown rest stop ${restStopId}`);
                } else if (typeof restStop.restingCopy !== 'string' || restStop.restingCopy.length === 0) {
                  errors.push(`${restStopId} must author restingCopy in the catalog`);
                }
              }
              if (!allowedSceneModes.has(microtask.presentation?.sceneMode)) {
                errors.push(`${microtask.microtaskId} must use a frozen V2 sceneMode`);
              }
              if (!microtask.presentation?.sceneVariant) {
                errors.push(`${microtask.microtaskId} must declare sceneVariant`);
              }
              if (
                microtask.presentation?.viewportPolicy !== 'single-viewport-responsive'
                || microtask.presentation?.scrollPolicy?.horizontal !== 'forbidden'
                || microtask.presentation?.scrollPolicy?.nestedCard !== 'forbidden'
              ) {
                errors.push(`${microtask.microtaskId} must declare the V2 viewport and scroll policy`);
              }
              if (microtask.skipPolicy) {
                if (
                  microtask.microtaskId !== 'L01-M12'
                  || microtask.skipPolicy.kind !== 'role-round-child-confirmed'
                  || microtask.skipPolicy.preservesPartialProgress !== true
                  || microtask.skipPolicy.countsAsResolved !== true
                  || microtask.skipPolicy.producesLearningEvidence !== false
                  || microtask.skipPolicy.unlocksOutcomePractice !== false
                  || (microtask.targetResults || []).length !== 0
                ) {
                  errors.push(`${microtask.microtaskId} must preserve the truthful no-evidence skip contract`);
                }
              } else if (microtask.microtaskId === 'L01-M12') {
                errors.push('L01-M12 must declare the role-round child-confirmed skip contract');
              }

              const moments = microtask.presentation?.moments;
              if (!Array.isArray(moments) || moments.length === 0) {
                errors.push(`${microtask.microtaskId} must author at least one presentation moment`);
              } else {
                const localPresentationStepIds = new Set((microtask.steps || [])
                  .map(step => step.stepId));
                const localPresentationChallengeRefs = new Set((microtask.steps || [])
                  .flatMap(step => [
                    ...(typeof step.challengeRef === 'string' ? [step.challengeRef] : []),
                    ...(step.challenges || []).map(challenge => challenge.challengeRef)
                  ]));
                const localPresentationEntityIds = new Set([
                  ...(microtask.presentation?.characterEntityIds || []),
                  ...(microtask.presentation?.sceneEntityIds || []),
                  ...(microtask.steps || []).flatMap(step => [
                    ...(step.characterEntityIds || []),
                    ...(step.sceneEntityIds || []),
                    ...(step.optionEntityIds || []),
                    ...(step.entityIds || []),
                    ...(step.targetEntityIds || []),
                    ...(step.challenges || []).flatMap(challenge => (
                      challenge.candidateEntityIds || []
                    ))
                  ])
                ]);
                const localMomentIds = new Set();

                for (const moment of moments) {
                  const momentId = moment?.momentId;
                  if (typeof momentId !== 'string' || momentId.length === 0) {
                    errors.push(`${microtask.microtaskId} presentation moment must declare momentId`);
                    continue;
                  }
                  if (localMomentIds.has(momentId)) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} is duplicated`);
                  } else {
                    localMomentIds.add(momentId);
                  }

                  for (const entityId of moment.participantEntityIds || []) {
                    if (!knownEntityIds.has(entityId) || !localPresentationEntityIds.has(entityId)) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} references unknown participant entity ${entityId}`);
                    }
                  }
                  if (!Array.isArray(moment.participantEntityIds)) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} must declare participantEntityIds`);
                  }
                  for (const entityId of moment.focusEntityIds || []) {
                    if (!knownEntityIds.has(entityId) || !localPresentationEntityIds.has(entityId)) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} references unknown focus entity ${entityId}`);
                    }
                  }
                  if (!Array.isArray(moment.focusEntityIds) || moment.focusEntityIds.length === 0) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} must declare focusEntityIds`);
                  }
                  for (const languageRef of moment.visibleLanguageRefs || []) {
                    if (!knownSourceIds.has(languageRef) && !knownContentIds.has(languageRef)) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} references unknown visible language ${languageRef}`);
                    }
                  }
                  if (!Array.isArray(moment.visibleLanguageRefs) || moment.visibleLanguageRefs.length === 0) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} must declare visibleLanguageRefs`);
                  }
                  if (
                    moment.advancePolicy !== undefined
                    && !presentationAdvancePolicies.has(moment.advancePolicy)
                  ) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} uses invalid presentation advance policy ${moment.advancePolicy}`);
                  }

                  if (typeof moment.endState?.stateId !== 'string' || moment.endState.stateId.length === 0) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} must declare endState`);
                  }
                  if (!Array.isArray(moment.endState?.entityStates)) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} end state must declare entityStates`);
                  }
                  for (const entityState of moment.endState?.entityStates || []) {
                    if (!knownEntityIds.has(entityState.entityId) || !localPresentationEntityIds.has(entityState.entityId)) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} end state references unknown entity ${entityState.entityId}`);
                    }
                    if (typeof entityState.state !== 'string' || entityState.state.length === 0) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} end state must name every entity state`);
                    }
                  }

                  if (typeof moment.primaryMotion?.kind !== 'string' || moment.primaryMotion.kind.length === 0) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} must declare primaryMotion`);
                  }
                  if (!Array.isArray(moment.primaryMotion?.entityIds)) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} primary motion must declare entityIds`);
                  }
                  for (const entityId of moment.primaryMotion?.entityIds || []) {
                    if (!knownEntityIds.has(entityId) || !localPresentationEntityIds.has(entityId)) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} primary motion references unknown entity ${entityId}`);
                    }
                  }

                  if (moment.reducedMotionEndState?.stateId !== moment.endState?.stateId) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} reduced motion must preserve end state`);
                  }
                  if (!Array.isArray(moment.reducedMotionEndState?.entityStates)) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} reduced motion must declare entityStates`);
                  }
                  for (const entityState of moment.reducedMotionEndState?.entityStates || []) {
                    if (!knownEntityIds.has(entityState.entityId) || !localPresentationEntityIds.has(entityState.entityId)) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} reduced motion end state references unknown entity ${entityState.entityId}`);
                    }
                  }

                  if (moment.demonstration) {
                    const demonstration = moment.demonstration;
                    if (demonstration.demonstrationId !== momentId) {
                      errors.push(`${momentId} demonstrationId must match its presentation moment`);
                    }
                    if (
                      demonstration.kind !== 'changed-example-model'
                      || demonstration.interactionPattern !== 'relation-reconstruct'
                      || demonstration.submissionMode !== 'instructional-only'
                    ) {
                      errors.push(`${momentId} must declare the changed-example relation demonstration`);
                    }
                    if (!Array.isArray(demonstration.sourceRefs) || demonstration.sourceRefs.length === 0) {
                      errors.push(`${momentId} demonstration must declare sourceRefs`);
                    }
                    for (const sourceRef of demonstration.sourceRefs || []) {
                      if (!knownSourceIds.has(sourceRef)) {
                        errors.push(`${momentId} demonstration references unknown source ${sourceRef}`);
                      }
                    }
                    if (
                      !knownEntityIds.has(demonstration.modelEntityId)
                      || !localPresentationEntityIds.has(demonstration.modelEntityId)
                    ) {
                      errors.push(`${momentId} demonstration references unknown model entity ${demonstration.modelEntityId}`);
                    }
                    if (
                      !Array.isArray(demonstration.relationSlotIds)
                      || demonstration.relationSlotIds.length === 0
                    ) {
                      errors.push(`${momentId} demonstration must declare relationSlotIds`);
                    }
                    if (demonstration.producesResult !== false) {
                      errors.push(`${momentId} must not produce a result`);
                    }
                    if (demonstration.affectsAdventureHearts !== false) {
                      errors.push(`${momentId} must not affect adventure hearts`);
                    }
                    if (demonstration.producesLearningEvidence !== false) {
                      errors.push(`${momentId} must not produce learning evidence`);
                    }
                    if (demonstration.countsTowardProgress !== false) {
                      errors.push(`${momentId} must not count toward progress`);
                    }
                    if (['challengeRef', 'resultId', 'reviewCellId', 'evidenceMode'].some(key => (
                      Object.prototype.hasOwnProperty.call(demonstration, key)
                    ))) {
                      errors.push(`${momentId} cannot declare mainline result or challenge identities`);
                    }
                  }

                  const enterWhen = moment.enterWhen || {};
                  if (!presentationEnterConditionKinds.has(enterWhen.kind)) {
                    errors.push(`${microtask.microtaskId} presentation moment ${momentId} uses invalid presentation enter condition ${enterWhen.kind}`);
                    continue;
                  }
                  const selectorKeys = ['stepId', 'challengeRef', 'phase']
                    .filter(key => Object.prototype.hasOwnProperty.call(enterWhen, key));
                  if (['microtask-start', 'microtask-complete'].includes(enterWhen.kind)) {
                    if (selectorKeys.length > 0) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} ${enterWhen.kind} condition cannot declare selectors`);
                    }
                  } else if (['step-active', 'step-completed'].includes(enterWhen.kind)) {
                    if (selectorKeys.length !== 1 || selectorKeys[0] !== 'stepId') {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} ${enterWhen.kind} condition must declare only stepId`);
                    } else if (!localPresentationStepIds.has(enterWhen.stepId)) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} references unknown step ${enterWhen.stepId}`);
                    }
                  } else if (['challenge-active', 'challenge-completed'].includes(enterWhen.kind)) {
                    if (selectorKeys.length !== 1 || selectorKeys[0] !== 'challengeRef') {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} ${enterWhen.kind} condition must declare only challengeRef`);
                    } else if (!localPresentationChallengeRefs.has(enterWhen.challengeRef)) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} references unknown challenge ${enterWhen.challengeRef}`);
                    }
                  } else if (enterWhen.kind === 'phase') {
                    if (selectorKeys.length !== 1 || selectorKeys[0] !== 'phase') {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} phase condition must declare only phase`);
                    } else if (!presentationLifecyclePhases.has(enterWhen.phase)) {
                      errors.push(`${microtask.microtaskId} presentation moment ${momentId} references invalid lifecycle phase ${enterWhen.phase}`);
                    }
                  }
                }
                if (microtask.microtaskId === 'L02-M15') {
                  const handbagDemoMoments = moments.filter(moment => (
                    moment.momentId === 'handbag-pattern-demo'
                  ));
                  if (handbagDemoMoments.length !== 1 || !handbagDemoMoments[0].demonstration) {
                    errors.push('L02-M15 must author one handbag-pattern-demo demonstration');
                  } else if (
                    JSON.stringify(handbagDemoMoments[0].demonstration)
                    !== JSON.stringify(NCE_U01_HANDBAG_PATTERN_DEMONSTRATION)
                  ) {
                    errors.push('handbag-pattern-demo must preserve its isolated demonstration contract');
                  }
                }
              }
            }
            if (
              microtask.growthBoundary === 'unit-built'
              && microtask !== authoredMicrotasks[authoredMicrotasks.length - 1]
            ) {
              errors.push(`${microtask.microtaskId} unit growth is reserved for the final microtask`);
            }
            if (
              microtask.growthBoundary !== 'unit-built'
              && microtask.checkpointAfterSuccess?.buildStage !== undefined
            ) {
              errors.push(`${microtask.microtaskId} cannot grow a landmark before the unit boundary`);
            }

            const localStepIds = new Set((microtask.steps || []).map(step => step.stepId));
            const localStoredFactIds = new Set((microtask.steps || [])
              .map(step => step.storesFactId)
              .filter(Boolean));
            for (const step of microtask.steps || []) {
              if (typeof step.stepId !== 'string' || step.stepId.length === 0) {
                errors.push(`${microtask.microtaskId} runtime step must declare stepId`);
              } else if (microtaskStepIds.has(step.stepId)) {
                errors.push(`${step.stepId} is duplicated`);
              } else {
                microtaskStepIds.add(step.stepId);
              }
              if (
                current.experienceRevision === NCE_U01_V2_REVISION
                && sharedListenAnswerStepIds.has(step.stepId)
                && step.audioResponsePresentation !== 'shared-locked-until-ended'
              ) {
                errors.push(`${step.stepId} must declare shared-locked-until-ended`);
              }
              if (
                current.experienceRevision === NCE_U01_V2_REVISION
                && independentListenStepIds.has(step.stepId)
                && step.audioResponsePresentation !== 'independent-listen'
              ) {
                errors.push(`${step.stepId} must remain an independent listening scene`);
              }
              const formalEntityChallenges = (step.challenges || []).filter(challenge => (
                step.submissionMode === 'formal'
                && Array.isArray(challenge.candidateEntityIds)
                && challenge.candidateEntityIds.length > 1
              ));
              if (
                current.experienceRevision === NCE_U01_V2_REVISION
                && formalEntityChallenges.length > 0
              ) {
                if (step.candidatePresentation !== 'neutral-before-submit') {
                  errors.push(`${step.stepId} must declare neutral-before-submit`);
                }
                for (const challenge of formalEntityChallenges) {
                  const activeMoment = (microtask.presentation?.moments || []).find(moment => (
                    moment.enterWhen?.kind === 'challenge-active'
                    && moment.enterWhen.challengeRef === challenge.challengeRef
                  ));
                  if (!activeMoment) continue;
                  const focusedCandidateCount = challenge.candidateEntityIds.filter(entityId => (
                    activeMoment.focusEntityIds?.includes(entityId)
                  )).length;
                  if (
                    focusedCandidateCount > 0
                    && focusedCandidateCount < challenge.candidateEntityIds.length
                  ) {
                    errors.push(`${challenge.challengeRef} must not focus only part of its answer candidates`);
                  }
                }
              }
              if (step.answerRule && !declarativeRuleTypes.has(step.answerRule.type)) {
                errors.push(`${step.stepId} must use a declarative answer rule`);
              }
              if (current.experienceRevision === NCE_U01_V2_REVISION
                && step.stepId === 'L02-M15:S01') {
                const expectedWordOrder = [
                  'NCE-U01-C-BLOCK-IS-CAPITAL', 'NCE-U01-C-BLOCK-THIS',
                  'NCE-U01-C-BLOCK-YOUR', 'NCE-U01-C-BLOCK-WATCH',
                  'NCE-U01-C-PUNCT-QUESTION'
                ];
                const challenge = step.challenges?.[0];
                if (
                  JSON.stringify(step.blockContentRefs) !== JSON.stringify(expectedWordOrder)
                  || JSON.stringify(step.answerRule?.acceptedOrder) !== JSON.stringify(expectedWordOrder)
                  || JSON.stringify(challenge?.candidateContentRefs) !== JSON.stringify(expectedWordOrder)
                  || JSON.stringify(challenge?.answerRule?.acceptedOrder) !== JSON.stringify(expectedWordOrder)
                  || step.shuffleConstraint !== 'not-accepted-order'
                  || challenge?.shuffleConstraint !== 'not-accepted-order'
                  || step.allowReset !== true
                ) {
                  errors.push('L02-M15:S01 must keep five selectable word-level tokens with truthful shuffle and reset');
                }
              }
              if (
                Array.isArray(step.optionSourceRefs)
                && step.answerRule?.acceptedSourceRef
              ) {
                const acceptedText = knownSourceById.get(
                  step.answerRule.acceptedSourceRef
                )?.text;
                if (acceptedText) {
                  const escapedAcceptedText = acceptedText
                    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                  const acceptedTextPattern = new RegExp(
                    `(^|[^a-z])${escapedAcceptedText}([^a-z]|$)`,
                    'i'
                  );
                  const visibleCopy = [
                    ['step prompt', step.prompt],
                    ['step action instruction', step.actionInstruction],
                    ['microtask prompt', microtask.prompt],
                    ['navigation title', microtask.navigationTitle],
                    ['presentation title', microtask.presentation?.title],
                    ['presentation prompt', microtask.presentation?.prompt]
                  ];
                  for (const [surface, copy] of visibleCopy) {
                    if (!acceptedTextPattern.test(copy || '')) continue;
                    errors.push(
                      `${step.stepId} visible ${surface} must not disclose accepted English option ${acceptedText}`
                    );
                  }
                }
              }
              if (step.kind === 'role-enactment') {
                const practice = step.practice;
                const expectedDialogueRefs = Array.from(
                  { length: 7 }, (_, index) => `L01-D0${index + 1}`
                );
                if (
                  microtask.microtaskId !== 'L01-M12'
                  || step.submissionMode !== 'required-practice'
                  || step.affectsAdventureHearts !== false
                  || practice?.kind !== 'role-enactment'
                  || practice?.practiceId !== 'L01-M12:role-enactment'
                ) {
                  errors.push(`${step.stepId} must preserve the required Lesson 1 role-enactment contract`);
                }
                if (
                  !Array.isArray(practice?.castOrder)
                  || JSON.stringify(practice.castOrder)
                    !== JSON.stringify(['station-keeper', 'handbag-owner'])
                  || JSON.stringify(practice?.propEntityIds)
                    !== JSON.stringify(['handbag'])
                ) {
                  errors.push(`${step.stepId} must keep the fixed two-person cast and handbag on the counter`);
                }
                if (!Array.isArray(practice?.rounds) || practice.rounds.length !== 2) {
                  errors.push(`${step.stepId} must declare exactly two full role rounds`);
                } else {
                  const roundIds = new Set();
                  for (const round of practice.rounds) {
                    roundIds.add(round.roundId);
                    if (JSON.stringify(round.dialogueTurnRefs) !== JSON.stringify(expectedDialogueRefs)) {
                      errors.push(`${round.roundId} must run the complete ordered seven-line dialogue`);
                    }
                    const hidden = new Set(round.hiddenTurnRefs || []);
                    const partner = new Set(round.partnerTurnRefs || []);
                    if (
                      hidden.size + partner.size !== 7
                      || expectedDialogueRefs.some(sourceRef => (
                        hidden.has(sourceRef) === partner.has(sourceRef)
                      ))
                    ) {
                      errors.push(`${round.roundId} must partition all seven turns between child and partner`);
                    }
                    for (const sourceRef of hidden) {
                      if (knownSourceById.get(sourceRef)?.speaker
                        !== current.entities?.[round.roleEntityId]?.voiceRole) {
                        errors.push(`${round.roundId} hidden turn ${sourceRef} speaker does not match its child role`);
                      }
                    }
                    for (const sourceRef of partner) {
                      if (knownSourceById.get(sourceRef)?.speaker
                        !== current.entities?.[round.partnerEntityId]?.voiceRole) {
                        errors.push(`${round.roundId} partner turn ${sourceRef} speaker does not match its partner role`);
                      }
                    }
                  }
                  if (!roundIds.has('keeper-round') || !roundIds.has('owner-round')) {
                    errors.push(`${step.stepId} must include keeper-round and owner-round`);
                  }
                }
              }
              for (const challenge of step.challenges || []) {
                if (!/^L(?:01|02)-M\d{2}:C\d{2}$/.test(challenge.challengeRef || '')) {
                  errors.push(`${step.stepId} challenge must declare a stable challengeRef`);
                } else if (challengeRefs.has(challenge.challengeRef)) {
                  errors.push(`${challenge.challengeRef} is duplicated`);
                } else {
                  challengeRefs.add(challenge.challengeRef);
                }
                if (!challenge.answerRule || !declarativeRuleTypes.has(challenge.answerRule.type)) {
                  errors.push(`${challenge.challengeRef || step.stepId} must use a declarative answer rule`);
                }
                if (!Array.isArray(challenge.supportLayers) || challenge.supportLayers.length !== 3) {
                  errors.push(`${challenge.challengeRef || step.stepId} must declare three support layers`);
                }
                if (!challenge.correctFeedback?.copy || !challenge.incorrectFeedback?.copy) {
                  errors.push(`${challenge.challengeRef || step.stepId} must declare correct and incorrect feedback copy`);
                }
                for (const sourceRef of challenge.candidateSourceRefs || []) {
                  if (!knownSourceIds.has(sourceRef)) {
                    errors.push(`${challenge.challengeRef} references unknown source ${sourceRef}`);
                  }
                }
                for (const contentRef of challenge.candidateContentRefs || []) {
                  if (!knownContentIds.has(contentRef)) {
                    errors.push(`${challenge.challengeRef} references unknown authored content ${contentRef}`);
                  }
                }
                for (const entityId of challenge.candidateEntityIds || []) {
                  if (!knownEntityIds.has(entityId)) {
                    errors.push(`${challenge.challengeRef} references unknown entity ${entityId}`);
                  }
                }
                const candidateCount = (
                  challenge.candidateEntityIds
                  || challenge.candidateSourceRefs
                  || challenge.candidateContentRefs
                  || []
                ).length;
                const candidateSetPolicy = challenge.candidateSetPolicy || 'full-diagnostic';
                if (!candidateSetPolicies.has(candidateSetPolicy)) {
                  errors.push(`${challenge.challengeRef || step.stepId} uses unknown candidate set policy ${candidateSetPolicy}`);
                } else if (candidateSetPolicy === 'authentic-story-participants') {
                  const authenticCandidates = challenge.candidateEntityIds || [];
                  if (
                    challenge.interactionPattern !== 'scene-identify'
                    || step.kind !== 'select-entity'
                    || candidateCount !== 2
                    || authenticCandidates.some(entityId => (
                      current.entities?.[entityId]?.entityKind !== 'character'
                    ))
                  ) {
                    errors.push(`${challenge.challengeRef || step.stepId} authentic story participants must be exactly two character candidates in a scene-identify step`);
                  }
                } else if (candidateSetPolicy === 'authentic-scene-pair') {
                  const authenticCandidates = challenge.candidateEntityIds || [];
                  if (
                    !['scene-identify', 'label-connect'].includes(challenge.interactionPattern)
                    || !['match-entity', 'match-entity-batch'].includes(step.kind)
                    || candidateCount !== 2
                    || authenticCandidates.some(entityId => (
                      current.entities?.[entityId]?.entityKind === 'character'
                    ))
                  ) {
                    errors.push(`${challenge.challengeRef || step.stepId} authentic scene pair must be exactly two non-character candidates`);
                  }
                } else if (candidateCount < 3) {
                  errors.push(`${challenge.challengeRef || step.stepId} must keep a full diagnostic candidate set`);
                }
              }
              if (
                step.answerRule?.type === 'ordered-blocks'
                && step.answerRule.acceptedByEntityId
                && !localStoredFactIds.has(step.selectedEntityFactId)
              ) {
                errors.push(`${step.stepId} must bind its branch to a stored child choice`);
              }
              for (const factId of step.preconditionFactIds || []) {
                const ownerIndex = checkpointFactOwner.get(factId);
                const currentIndex = microtaskOrder.get(microtask.microtaskId);
                if (ownerIndex === undefined || ownerIndex >= currentIndex) {
                  errors.push(`${step.stepId} references unknown earlier checkpoint fact ${factId}`);
                }
              }
              const stepSourceRefs = [
                ...(step.audioSourceRefs || []),
                ...(step.challengeSourceRefs || []),
                ...(step.sourceRefs || []),
                ...(step.blockSourceRefs || []),
                ...(step.optionSourceRefs || []),
                ...(step.questionSourceRef ? [step.questionSourceRef] : []),
                ...(step.answerSourceRef ? [step.answerSourceRef] : []),
                ...(step.sourceRef ? [step.sourceRef] : []),
                ...(step.feedbackAudioSourceRef ? [step.feedbackAudioSourceRef] : [])
              ];
              for (const sourceRef of stepSourceRefs) {
                if (!knownSourceIds.has(sourceRef)) {
                  errors.push(`${step.stepId} references unknown source ${sourceRef}`);
                }
              }
              const stepContentRefs = [
                ...(step.audioContentRefs || []),
                ...(step.blockContentRefs || []),
                ...(step.statementContentRef ? [step.statementContentRef] : []),
                ...(step.diagnosticContentRef ? [step.diagnosticContentRef] : []),
                ...(step.expressionContentRef ? [step.expressionContentRef] : []),
                ...(step.feedbackAudioContentRef ? [step.feedbackAudioContentRef] : []),
                ...Object.values(step.feedbackAudioContentByEntityId || {})
              ];
              for (const contentRef of stepContentRefs) {
                if (!knownContentIds.has(contentRef)) {
                  errors.push(`${step.stepId} references unknown authored content ${contentRef}`);
                }
              }
              const stepEntityRefs = [
                ...(step.entityIds || []),
                ...(step.sceneEntityIds || []),
                ...(step.optionEntityIds || []),
                ...(step.branchEntityIds || []),
                ...(step.targetEntityIds || [])
              ];
              for (const entityId of stepEntityRefs) {
                if (!knownEntityIds.has(entityId)) {
                  errors.push(`${step.stepId} references unknown entity ${entityId}`);
                }
              }
              for (const entityId of step.characterEntityIds || []) {
                if (!knownEntityIds.has(entityId)) {
                  errors.push(`${step.stepId} references unknown character ${entityId}`);
                }
              }
            }

            for (const result of microtask.targetResults || []) {
              if (targetResultIds.has(result.resultId)) {
                errors.push(`${result.resultId} is duplicated`);
              } else {
                targetResultIds.add(result.resultId);
              }
              const cellId = `${result.targetId}:${result.variantId}:${result.channel}`;
              if (variantCellIds.has(cellId)) {
                errors.push(`${result.variantId}:${result.channel} is duplicated`);
              } else {
                variantCellIds.add(cellId);
              }
              const boundTarget = (current.targets || []).find(target => target.targetId === result.targetId);
              if (!boundTarget) {
                errors.push(`${microtask.microtaskId} target result references unknown target ${result.targetId}`);
                continue;
              }
              if (!knownSourceIds.has(result.sourceRef)) {
                errors.push(`${microtask.microtaskId} target result references unknown source ${result.sourceRef}`);
              }
              for (const sourceRef of result.relatedSourceRefs || []) {
                if (!knownSourceIds.has(sourceRef)) {
                  errors.push(`${microtask.microtaskId} target result references unknown related source ${sourceRef}`);
                }
              }
              if (result.contentRef && !knownContentIds.has(result.contentRef)) {
                errors.push(`${microtask.microtaskId} target result references unknown authored content ${result.contentRef}`);
              }
              if (!localStepIds.has(result.stepId)) {
                errors.push(`${microtask.microtaskId} target result references unknown step ${result.stepId}`);
              }
              if (!boundTarget.evidenceModes.includes(result.evidenceMode)) {
                errors.push(`${microtask.microtaskId} target result evidence mode is outside ${result.targetId}`);
              }
              if (current.experienceRevision === NCE_U01_V2_REVISION) {
                if (result.reviewCellId !== result.resultId) {
                  errors.push(`${result.resultId} reviewCellId must equal resultId`);
                } else if (reviewCellIds.has(result.reviewCellId)) {
                  errors.push(`${result.reviewCellId} review cell is duplicated`);
                } else {
                  reviewCellIds.add(result.reviewCellId);
                }
                if (!/^L(?:01|02)-M\d{2}:C\d{2}$/.test(result.challengeRef || '')) {
                  errors.push(`${result.resultId} must bind a stable challengeRef`);
                }
                if (!boundTarget.contextIds.includes(result.contextId)) {
                  errors.push(`${result.resultId} context ${result.contextId} is outside ${result.targetId}`);
                }
                if (!knownReviewContextIds.has(result.reviewContextId)) {
                  errors.push(`${result.resultId} references unknown review context ${result.reviewContextId}`);
                }
              }
            }
          }
        }
      }
      if (current.experienceRevision === NCE_U01_V2_REVISION) {
        const v2Results = authoredMicrotasks.flatMap(microtask => microtask.targetResults || []);
        const v2Challenges = authoredMicrotasks.flatMap(microtask => microtask.steps || [])
          .flatMap(step => step.challenges || []);
        const resultByChallenge = new Map(v2Results.map(result => [result.challengeRef, result]));
        const challengeByRef = new Map(v2Challenges.map(challenge => [challenge.challengeRef, challenge]));
        const interactionPatterns = new Set([
          'scene-identify', 'object-place', 'label-connect',
          'utterance-select', 'relation-reconstruct'
        ]);
        const intentionalSupportSurfaces = new Set([
          'english-question', 'audio-word-plaque', 'english-word-plaque'
        ]);
        if (authoredMicrotasks.length !== 17) {
          errors.push(`${current.unitId} ${NCE_U01_V2_REVISION} must declare exactly 17 microtasks`);
        }
        if (v2Results.length !== 29 || v2Challenges.length !== 29) {
          errors.push(`${current.unitId} ${NCE_U01_V2_REVISION} must declare exactly 29 results and challenges`);
        }
        let previousInteractionPattern = null;
        let consecutiveInteractionPatternCount = 0;
        for (const challenge of v2Challenges) {
          const expectedContract = NCE_U01_INTERACTION_CONTRACT_BY_CHALLENGE
            .get(challenge.challengeRef);
          if (typeof challenge.interactionPattern !== 'string') {
            errors.push(`${challenge.challengeRef} must declare one interactionPattern`);
          } else if (!interactionPatterns.has(challenge.interactionPattern)) {
            errors.push(`${challenge.challengeRef} uses invalid interactionPattern ${challenge.interactionPattern}`);
          } else {
            consecutiveInteractionPatternCount = challenge.interactionPattern === previousInteractionPattern
              ? consecutiveInteractionPatternCount + 1
              : 1;
            previousInteractionPattern = challenge.interactionPattern;
            if (consecutiveInteractionPatternCount > 2) {
              errors.push(`${challenge.interactionPattern} cannot repeat more than twice across microtasks`);
            }
          }

          const semantics = challenge.interactionSemantics;
          if (!Array.isArray(semantics?.sourceRefs) || semantics.sourceRefs.length === 0) {
            errors.push(`${challenge.challengeRef} interaction semantics must declare sourceRefs`);
          }
          for (const sourceRef of semantics?.sourceRefs || []) {
            if (!knownSourceIds.has(sourceRef)) {
              errors.push(`${challenge.challengeRef} references unknown interaction source ${sourceRef}`);
            }
          }
          if (
            challenge.interactionPattern === 'relation-reconstruct'
            && (!Array.isArray(semantics?.relationSlotIds) || semantics.relationSlotIds.length === 0)
          ) {
            errors.push(`${challenge.challengeRef} relation-reconstruct must declare relationSlotIds`);
          }
          if (
            challenge.interactionPattern
            && challenge.interactionPattern !== 'relation-reconstruct'
            && (typeof semantics?.targetId !== 'string' || semantics.targetId.length === 0)
          ) {
            errors.push(`${challenge.challengeRef} ${challenge.interactionPattern} must declare targetId`);
          }
          if (expectedContract) {
            if (challenge.interactionPattern !== expectedContract.interactionPattern) {
              errors.push(`${challenge.challengeRef} must preserve interactionPattern ${expectedContract.interactionPattern}`);
            }
            if (JSON.stringify(semantics) !== JSON.stringify(expectedContract.interactionSemantics)) {
              errors.push(`${challenge.challengeRef} must preserve its interaction semantics`);
            }
          }

          const answerFairness = challenge.answerFairness;
          const result = resultByChallenge.get(challenge.challengeRef);
          if (typeof answerFairness?.targetEvidenceChannel !== 'string'
            || answerFairness.targetEvidenceChannel.length === 0) {
            errors.push(`${challenge.challengeRef} answer fairness must declare its target evidence channel`);
          } else if (
            result
            && answerFairness.targetEvidenceChannel !== result.channel
          ) {
            errors.push(`${challenge.challengeRef} answer fairness target evidence channel must match its result`);
          }
          if (!Array.isArray(answerFairness?.targetEvidenceSourceRefs)
            || answerFairness.targetEvidenceSourceRefs.length === 0) {
            errors.push(`${challenge.challengeRef} answer fairness must declare target evidence sources`);
          }
          for (const sourceRef of answerFairness?.targetEvidenceSourceRefs || []) {
            if (!knownSourceIds.has(sourceRef)) {
              errors.push(`${challenge.challengeRef} answer fairness references unknown source ${sourceRef}`);
            }
          }
          if (
            Array.isArray(answerFairness?.targetEvidenceSourceRefs)
            && Array.isArray(semantics?.sourceRefs)
            && JSON.stringify(answerFairness.targetEvidenceSourceRefs)
              !== JSON.stringify(semantics.sourceRefs)
          ) {
            errors.push(`${challenge.challengeRef} answer fairness must preserve its interaction evidence sources`);
          }
          if (!Array.isArray(answerFairness?.intentionalPreSubmitSupport)) {
            errors.push(`${challenge.challengeRef} answer fairness must declare intentional pre-submit support`);
          }
          for (const support of answerFairness?.intentionalPreSubmitSupport || []) {
            if (!knownSourceIds.has(support?.sourceRef)) {
              errors.push(`${challenge.challengeRef} answer fairness references unknown source ${support?.sourceRef}`);
            }
            if (!intentionalSupportSurfaces.has(support?.surface)) {
              errors.push(`${challenge.challengeRef} uses invalid intentional support surface ${support?.surface}`);
            }
          }
        }
        for (const result of v2Results) {
          const challenge = challengeByRef.get(result.challengeRef);
          if (!challenge || challenge.resultId !== result.resultId || challenge.reviewCellId !== result.reviewCellId) {
            errors.push(`${result.resultId} must bind one matching challenge ${result.challengeRef}`);
          }
        }
        for (const challenge of v2Challenges) {
          if (!resultByChallenge.has(challenge.challengeRef)) {
            errors.push(`${challenge.challengeRef} must bind one target result`);
          }
        }
      }
      const unitSourceEntries = Object.entries(current.lessonContent || {})
        .flatMap(([lessonId, lesson]) => Object.entries(lesson.sources || {})
          .map(([sourceId, item]) => [sourceId, { lessonId, item }]));
      const unitSourceIds = new Set(unitSourceEntries.map(([sourceId]) => sourceId));
      const sourceOwners = unitSourceEntries.reduce((groups, entry) => {
        const sourceId = entry[0];
        groups[sourceId] = groups[sourceId] || [];
        groups[sourceId].push(entry);
        return groups;
      }, {});
      for (const [sourceId, owners] of Object.entries(sourceOwners)) {
        if (owners.length > 1) errors.push(`${sourceId} is duplicated inside ${current.unitId}`);
      }

      for (const [lessonId, lesson] of Object.entries(current.lessonContent || {})) {
        const sourceIds = new Set(Object.keys(lesson.sources || {}));
        const requiredSourceIds = new Set(lesson.requiredSourceIds || []);
        const requiresRuntimeCoverage = current.runtimeProfile !== 'not-authored';
        const lessonTasks = authoredMicrotasks.filter(task => task.lessonId === lessonId);
        const exposed = new Set(authoredMicrotasks.flatMap(task => task.exposureRefs || []));
        const evidenced = new Set(authoredMicrotasks.flatMap(task => task.evidenceRefs || []));

        for (const sourceId of requiredSourceIds) {
          if (!sourceIds.has(sourceId)) {
            errors.push(`${sourceId} required source is missing from ${lessonId}`);
            continue;
          }
          const item = lesson.sources[sourceId];
          if (['optional', 'omitted'].includes(item.coveragePolicy)) {
            errors.push(`${sourceId} optional or omitted source cannot be required in ${lessonId}`);
          }
          if (!item.coveragePolicy) {
            if (requiresRuntimeCoverage && !exposed.has(sourceId)) {
              errors.push(`${sourceId} requires exposure coverage in ${lessonId}`);
            }
            if (requiresRuntimeCoverage && !evidenced.has(sourceId)) {
              errors.push(`${sourceId} requires evidence coverage in ${lessonId}`);
            }
          }
        }

        for (const [sourceId, item] of Object.entries(lesson.sources || {})) {
          if (!item.coveragePolicy) continue;
          if (!['target', 'support', 'context'].includes(item.sourceRole)) {
            errors.push(`${sourceId} must declare target, support, or context source role`);
          }
          if (!['evidence', 'exposure', 'optional', 'omitted'].includes(item.coveragePolicy)) {
            errors.push(`${sourceId} has an invalid coverage policy`);
            continue;
          }
          if (item.coveragePolicy === 'evidence' || item.coveragePolicy === 'exposure') {
            if (!requiredSourceIds.has(sourceId)) {
              errors.push(`${sourceId} must be listed as required in ${lessonId}`);
            }
            if (requiresRuntimeCoverage && !exposed.has(sourceId)) {
              errors.push(`${sourceId} requires exposure coverage in ${lessonId}`);
            }
          }
          if (item.coveragePolicy === 'evidence' && requiresRuntimeCoverage && !evidenced.has(sourceId)) {
            errors.push(`${sourceId} requires evidence coverage in ${lessonId}`);
          }
          if (item.coveragePolicy === 'omitted') {
            if (typeof item.omissionReason !== 'string' || item.omissionReason.length === 0) {
              errors.push(`${sourceId} omitted source must declare a reason`);
            }
            if (exposed.has(sourceId) || evidenced.has(sourceId)) {
              errors.push(`${sourceId} omitted source cannot appear in runtime coverage`);
            }
          }
        }

        for (const task of lessonTasks) {
          for (const sourceId of [...(task.exposureRefs || []), ...(task.evidenceRefs || [])]) {
            if (!unitSourceIds.has(sourceId)) {
              errors.push(`${task.microtaskId} references unknown source ${sourceId}`);
            }
          }
          if (task.kind === 'classification') {
            const classificationText = JSON.stringify({
              values: task.classificationValues,
              contexts: task.contextVariants
            }).toLowerCase();
            if (task.exposureRefs?.includes('L49-W05') || classificationText.includes('husband')) {
              errors.push('husband cannot appear in a child classification task');
            }
          }
        }
      }

      for (const item of current.vocabulary || []) {
        if (item.term?.toLowerCase() === 'husband' && item.semanticType !== 'human') {
          errors.push('husband is a human/family relationship and cannot be classified as food or meat');
        }
      }
    }

    return errors;
  }

  return deepFreeze({
    TEACHING_UNITS,
    COURSE_VOICE_BASELINES,
    getCourseVoiceBaseline,
    getTeachingUnit,
    getTeachingUnitForLesson,
    listTeachingUnitsForDistrict,
    validate
  });
});
