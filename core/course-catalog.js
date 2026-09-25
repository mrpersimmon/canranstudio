(function attachCourseCatalog(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.courseCatalog = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function courseCatalogFactory() {
  'use strict';

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const nested of Object.values(value)) deepFreeze(nested);
    return Object.freeze(value);
  }

  function isRelativePublicPath(value) {
    return typeof value === 'string' &&
      value.length > 0 &&
      !value.startsWith('/') &&
      !value.includes(':') &&
      !value.includes('\\') &&
      !value.endsWith('/') &&
      value.split('/').every(part => part && part !== '.' && part !== '..') &&
      !/[\0-\x1f\x7f]/.test(value);
  }

  function publicAssetUrl(relative) {
    if (!isRelativePublicPath(relative)) throw new Error('Expected a relative public asset path');
    return `/${relative}`;
  }

  function isMapImagePath(value) {
    return isRelativePublicPath(value) &&
      value.startsWith('assets/') &&
      /\.(?:avif|png|webp)$/i.test(value);
  }

  const MAP_STATE_WIDTHS = [512, 768, 1024];
  const MAP_STATE_VERSION = 'atlas-20260804-01';

  function createLandmarkStateAsset(courseId, stageCount) {
    const directory = `assets/adventure-map/${courseId}/states`;
    return {
      stageCount,
      version: MAP_STATE_VERSION,
      png: `${directory}/state-${stageCount}.png`,
      variants: MAP_STATE_WIDTHS.map(width => ({
        width,
        avif: `${directory}/state-${stageCount}-${width}.avif`,
        webp: `${directory}/state-${stageCount}-${width}.webp`
      }))
    };
  }

  function createLandmarkStateAssets(courseId, stageCount) {
    return Array.from(
      { length: stageCount + 1 },
      (_, index) => createLandmarkStateAsset(courseId, index)
    );
  }

  function landmarkStatePaths(state) {
    return [
      state?.png,
      ...(Array.isArray(state?.variants)
        ? state.variants.flatMap(variant => [variant?.avif, variant?.webp])
        : [])
    ];
  }

  function isLandmarkStateAsset(value, stageCount) {
    if (!value || value.stageCount !== stageCount || value.version !== MAP_STATE_VERSION ||
      !isMapImagePath(value.png)) return false;
    if (!Array.isArray(value.variants) || value.variants.length !== MAP_STATE_WIDTHS.length) return false;
    return value.variants.every((variant, index) => (
      variant?.width === MAP_STATE_WIDTHS[index] &&
      isMapImagePath(variant.avif) &&
      isMapImagePath(variant.webp)
    ));
  }

  function mapStateAssetUrl(path, state) {
    if (!isMapImagePath(path)) throw new Error(`invalid map state path: ${path}`);
    const version = state?.version;
    if (version !== MAP_STATE_VERSION) throw new Error(`invalid map state version: ${version}`);
    return `/${path}?v=${encodeURIComponent(version)}`;
  }

  function isRegressionTestPath(value) {
    return isRelativePublicPath(value) &&
      /^tests\/e2e\/[a-z0-9][a-z0-9/_-]*\.spec\.js$/.test(value);
  }

  function isPublicRoute(value) {
    return typeof value === 'string' && /^\/(?:[a-z0-9-]+\/)+$/.test(value);
  }

  const LESSON_STAGE_IDS = ['l1', 'l2', 'l3', 'l4', 'l5'];
  const SOUND_STAGE_IDS = ['vs', 'g1', 'g2', 'g3'];
  const DISTRICTS = deepFreeze([
    { id: 'first-book-1-12', order: 1, title: '晨光原野', lessonStart: 1, lessonEnd: 12, v1Accessible: false },
    { id: 'first-book-13-24', order: 2, title: '回声溪谷', lessonStart: 13, lessonEnd: 24, v1Accessible: false },
    { id: 'first-book-25-36', order: 3, title: '单词花园', lessonStart: 25, lessonEnd: 36, v1Accessible: false },
    { id: 'first-book-37-48', order: 4, title: '故事港湾', lessonStart: 37, lessonEnd: 48, v1Accessible: false },
    { id: 'first-book-49-60', order: 5, title: '四季生活城', lessonStart: 49, lessonEnd: 60, v1Accessible: true },
    { id: 'first-book-61-72', order: 6, title: '四季丘陵', lessonStart: 61, lessonEnd: 72, v1Accessible: false },
    { id: 'first-book-73-84', order: 7, title: '环球车站', lessonStart: 73, lessonEnd: 84, v1Accessible: false },
    { id: 'first-book-85-96', order: 8, title: '句型山城', lessonStart: 85, lessonEnd: 96, v1Accessible: false },
    { id: 'first-book-97-108', order: 9, title: '阅读森林', lessonStart: 97, lessonEnd: 108, v1Accessible: false },
    { id: 'first-book-109-120', order: 10, title: '表达海湾', lessonStart: 109, lessonEnd: 120, v1Accessible: false },
    { id: 'first-book-121-132', order: 11, title: '写作星原', lessonStart: 121, lessonEnd: 132, v1Accessible: false },
    { id: 'first-book-133-144', order: 12, title: '冠军广场', lessonStart: 133, lessonEnd: 144, v1Accessible: false }
  ]);
  const LAUNCH_DISTRICT = DISTRICTS.find(district => district.v1Accessible);

  function isV1MapLesson(lesson) {
    return Number.isInteger(lesson) && lesson >= 49 && lesson <= 60;
  }

  function createLessonMap(lesson, {
    souvenir = null,
    declaredStatus = 'drawing',
    landmarkMode = 'states',
    baseAsset = null,
    growthAssets = [],
    stageReveals = [],
    mobilePreview = null,
    regressionTest = null
  } = {}) {
    if (!isV1MapLesson(lesson)) {
      return deepFreeze({
        districtId: null,
        v1Visible: false,
        declaredStatus: 'not-applicable',
        landmarkMode: null,
        baseAsset: null,
        stateAssets: [],
        stages: [],
        souvenir: null,
        mobilePreview: null,
        regressionTest: null
      });
    }
    const stages = LESSON_STAGE_IDS.map((progressId, index) => ({
      progressId,
      growthAsset: growthAssets[index] || null,
      revealTitle: stageReveals[index]?.title || null,
      revealCopy: stageReveals[index]?.copy || null,
      soundAsset: stageReveals[index]?.soundAsset || null
    }));
    return deepFreeze({
      districtId: LAUNCH_DISTRICT.id,
      v1Visible: true,
      declaredStatus,
      landmarkMode,
      baseAsset,
      stateAssets: declaredStatus === 'published' && landmarkMode === 'states'
        ? createLandmarkStateAssets(`lesson${lesson}`, stages.length)
        : [],
      stages,
      souvenir,
      mobilePreview,
      regressionTest
    });
  }

  function createSpecialMap({
    souvenir = null,
    declaredStatus = 'drawing',
    landmarkMode = 'states',
    baseAsset = null,
    growthAssets = [],
    stageReveals = [],
    mobilePreview = null,
    regressionTest = null
  } = {}) {
    const stages = SOUND_STAGE_IDS.map((progressId, index) => ({
      progressId,
      growthAsset: growthAssets[index] || null,
      revealTitle: stageReveals[index]?.title || null,
      revealCopy: stageReveals[index]?.copy || null,
      soundAsset: stageReveals[index]?.soundAsset || null
    }));
    return deepFreeze({
      districtId: LAUNCH_DISTRICT.id,
      v1Visible: true,
      declaredStatus,
      landmarkMode,
      baseAsset,
      stateAssets: declaredStatus === 'published' && landmarkMode === 'states'
        ? createLandmarkStateAssets('soundmark', stages.length)
        : [],
      stages,
      souvenir,
      mobilePreview,
      regressionTest
    });
  }

  function publishedLesson({
    lesson,
    title,
    subtitle,
    description,
    features,
    art,
    tone,
    legacyKey,
    legacyMode,
    souvenir = null,
    mapPublication = {},
    learning = null,
  }) {
    const id = `lesson${lesson}`;
    const progress = {
      key: `canran:l${lesson}:progress:v2`,
      ids: [...LESSON_STAGE_IDS],
      max: 15
    };
    if (learning) progress.learningKey = 'canran:l49:learning:v1';
    if (legacyKey) progress.legacyKey = legacyKey;
    if (legacyMode) progress.legacyMode = legacyMode;
    return {
      id,
      kind: 'lesson',
      lesson,
      courseStatus: 'published',
      directoryVisible: true,
      route: `/${id}/`,
      entry: `${id}/index.html`,
      assetDirectories: [`${id}/audio`],
      title,
      subtitle,
      description,
      features,
      art,
      tone,
      progress,
      ...(learning ? { learning } : {}),
      map: createLessonMap(lesson, { souvenir, ...mapPublication }),
    };
  }

  function plannedLesson(lesson, { directoryVisible = true } = {}) {
    return {
      id: `lesson${lesson}`,
      kind: 'lesson',
      lesson,
      courseStatus: 'planned',
      directoryVisible,
      route: null,
      entry: null,
      assetDirectories: [],
      title: '即将开放',
      subtitle: '',
      description: '',
      features: [],
      art: null,
      tone: 'soon',
      progress: null,
      map: createLessonMap(lesson),
    };
  }

  const LESSON49_LEARNING = {
  "FEEDBACK": {
    "correct": { "src": "assets/feedback/duolingo-correct.mp3", "volume": 0.35 },
    "incorrect": { "src": "assets/feedback/duolingo-incorrect.mp3", "volume": 0.35 },
    "complete": { "src": "assets/feedback/duolingo-complete.mp3", "volume": 0.5 }
  },
  "WORKSPACE": [
    {
      "id": "l1",
      "title": "开门准备",
      "icon": "steak",
      "activities": [
        {
          "id": "words",
          "title": "肉店小图鉴",
          "icon": "cards"
        },
        {
          "id": "listen",
          "title": "听音寻宝",
          "icon": "audio"
        }
      ]
    },
    {
      "id": "l2",
      "title": "肉店小剧场",
      "icon": "butcher",
      "activities": [
        {
          "id": "text",
          "title": "老板与客人",
          "icon": "book"
        },
        {
          "id": "roles",
          "title": "故事小侦探",
          "icon": "people"
        }
      ]
    },
    {
      "id": "l3",
      "title": "招呼有妙招",
      "icon": "give",
      "activities": [
        {
          "id": "doare",
          "title": "问话小帮手",
          "icon": "question"
        },
        {
          "id": "give",
          "title": "交接小帮手",
          "icon": "give"
        },
        {
          "id": "pouch",
          "title": "店员小锦囊",
          "icon": "speech"
        },
        {
          "id": "either",
          "title": "心声接力",
          "icon": "people"
        }
      ]
    },
    {
      "id": "l4",
      "title": "店员训练场",
      "icon": "people",
      "activities": [
        {
          "id": "subjects",
          "title": "分拣小能手",
          "icon": "people"
        },
        {
          "id": "fill",
          "title": "动词换装间",
          "icon": "book"
        },
        {
          "id": "choice",
          "title": "句子检查站",
          "icon": "heart"
        },
        {
          "id": "trans",
          "title": "词块拼装台",
          "icon": "cards"
        }
      ]
    },
    {
      "id": "l5",
      "title": "小店我当家",
      "icon": "order",
      "activities": [
        {
          "id": "exam",
          "title": "老板的挑战",
          "icon": "order"
        },
        {
          "id": "certificate",
          "title": "我的学徒证书",
          "icon": "star"
        }
      ]
    }
  ],
  "DOARE": [
    {
      "id": "doare-like",
      "target": "完整问句",
      "prompt": "想知道客人喜不喜欢肉，你会怎样问？",
      "options": [
        "Do you like meat?",
        "Are you like meat?"
      ],
      "answer": "Do you like meat?",
      "explanation": "本句用动词 like 表达喜好，一般现在时问句是 Do you like meat?"
    },
    {
      "id": "doare-teacher",
      "target": "完整问句",
      "prompt": "想知道新朋友是不是老师，你会怎样问？",
      "options": [
        "Are you a teacher?",
        "Do you a teacher?"
      ],
      "answer": "Are you a teacher?",
      "explanation": "本句用 be 连接 you 和 a teacher，问句是 Are you a teacher?"
    },
    {
      "id": "doare-busy",
      "target": "完整问句",
      "prompt": "想知道妈妈现在忙不忙，你会怎样问？",
      "options": [
        "Are you busy?",
        "Do you busy?"
      ],
      "answer": "Are you busy?",
      "explanation": "本句用 be 连接 you 和 busy，问句是 Are you busy?"
    },
    {
      "id": "doare-home",
      "target": "完整问句",
      "prompt": "想知道朋友现在在不在家，你会怎样问？",
      "options": [
        "Are you at home?",
        "Do you at home?"
      ],
      "answer": "Are you at home?",
      "explanation": "本句用 be 表达“在家”，问句是 Are you at home?"
    },
    {
      "id": "doare-want",
      "target": "完整问句",
      "prompt": "想知道顾客要不要牛肉，你会怎样问？",
      "options": [
        "Do you want beef?",
        "Are you want beef?"
      ],
      "answer": "Do you want beef?",
      "explanation": "本句用动词 want 表达需求，一般现在时问句是 Do you want beef?"
    },
    {
      "id": "doare-sleep",
      "target": "完整问句",
      "prompt": "想知道朋友平时睡得好不好，你会怎样问？",
      "options": [
        "Do you sleep well?",
        "Are you sleep well?"
      ],
      "answer": "Do you sleep well?",
      "explanation": "本句用动词 sleep 表达平时睡觉的情况，问句是 Do you sleep well?"
    },
    {
      "id": "doare-bed",
      "target": "完整问句",
      "prompt": "想知道朋友平时整理床铺吗，你会怎样问？",
      "options": [
        "Do you make the bed?",
        "Are you make the bed?"
      ],
      "answer": "Do you make the bed?",
      "explanation": "make the bed 表示整理床铺；本句用动词 make，问句是 Do you make the bed?"
    },
    {
      "id": "doare-coat",
      "target": "完整问句",
      "prompt": "想知道朋友出门时是否穿上外套，你会怎样问？",
      "options": [
        "Do you put on your coat?",
        "Are you put on your coat?"
      ],
      "answer": "Do you put on your coat?",
      "explanation": "put on your coat 表示穿上外套；本句用动词 put，问句是 Do you put on your coat?"
    }
  ],
  "WORDS": [
    {
      "en": "butcher",
      "ph": "/'bʊtʃə(r)/",
      "pos": "n.",
      "cn": "卖肉者，肉店老板",
      "scope": "教材词",
      "alt": "肉店老板",
      "image": "/assets/lesson49/icons/butcher.svg"
    },
    {
      "en": "meat",
      "ph": "/miːt/",
      "pos": "n.",
      "cn": "（食用）肉",
      "scope": "教材词",
      "image": "/assets/lesson49/icons/meat.svg",
      "alt": "（食用）肉"
    },
    {
      "en": "beef",
      "ph": "/biːf/",
      "pos": "n.",
      "cn": "牛肉",
      "scope": "教材词",
      "image": "/assets/lesson49/icons/beef.svg",
      "alt": "牛肉"
    },
    {
      "en": "lamb",
      "ph": "/læm/",
      "pos": "n.",
      "cn": "羔羊肉",
      "scope": "教材词",
      "image": "/assets/lesson49/icons/lamb.svg",
      "alt": "羔羊肉"
    },
    {
      "en": "mutton",
      "ph": "/'mʌtn/",
      "pos": "n.",
      "cn": "羊肉",
      "scope": "补充词",
      "image": "/assets/lesson49/icons/mutton.svg",
      "alt": "羊肉"
    },
    {
      "en": "steak",
      "ph": "/steɪk/",
      "pos": "n.",
      "cn": "牛排",
      "scope": "教材词",
      "image": "/assets/lesson49/icons/steak.svg",
      "alt": "一块牛排"
    },
    {
      "en": "mince",
      "ph": "/mɪns/",
      "pos": "n.",
      "cn": "肉馅",
      "scope": "教材词",
      "image": "/assets/lesson49/icons/mince.svg",
      "alt": "细碎的肉馅"
    },
    {
      "en": "chicken",
      "ph": "/'tʃɪkɪn/",
      "pos": "n.",
      "cn": "鸡肉",
      "scope": "教材词",
      "image": "/assets/lesson49/icons/chicken.svg",
      "alt": "鸡肉",
      "context": "课文中的 a chicken：一只整鸡。"
    },
    {
      "en": "pork",
      "ph": "/pɔːk/",
      "pos": "n.",
      "cn": "猪肉",
      "scope": "补充词",
      "image": "/assets/lesson49/icons/pork.svg",
      "alt": "猪肉"
    },
    {
      "en": "fish",
      "ph": "/fɪʃ/",
      "pos": "n.",
      "cn": "鱼肉",
      "scope": "补充词",
      "image": "/assets/lesson49/icons/fish.svg",
      "alt": "鱼肉"
    },
    {
      "en": "husband",
      "ph": "/'hʌzbənd/",
      "pos": "n.",
      "cn": "丈夫",
      "scope": "教材词",
      "image": "/assets/lesson49/icons/husband.svg",
      "alt": "丈夫"
    },
    {
      "en": "tell",
      "ph": "/tel/",
      "pos": "v.",
      "cn": "告诉",
      "scope": "教材词",
      "image": "/assets/lesson49/icons/tell.svg",
      "alt": "告诉"
    },
    {
      "en": "truth",
      "ph": "/truːθ/",
      "pos": "n.",
      "cn": "实情",
      "scope": "教材词",
      "context": "To tell you the truth… 说出真实的想法：老板也不喜欢鸡肉。",
      "image": "/assets/lesson49/icons/truth.svg",
      "alt": "实情"
    },
    {
      "en": "either",
      "ph": "/'aɪðə(r)/",
      "pos": "adv.",
      "cn": "也（用于否定句）",
      "scope": "教材词",
      "context": "A: I don't like chicken. B: I don't like chicken either. 两个人都不喜欢，B 说“也不”。",
      "image": "/assets/lesson49/icons/either.svg",
      "alt": "也（用于否定句）"
    }
  ],
  "PHRASES": [
    {
      "en": "a piece of steak",
      "ph": "",
      "pos": "短语",
      "cn": "一块牛排",
      "scope": "课文短语",
      "image": "/assets/lesson49/icons/piece.svg",
      "alt": "一块牛排"
    },
    {
      "en": "a pound of mince",
      "ph": "",
      "pos": "短语",
      "cn": "一磅肉馅",
      "scope": "课文短语",
      "image": "/assets/lesson49/icons/pound.svg",
      "alt": "一磅肉馅"
    },
    {
      "en": "mutton hotpot",
      "ph": "",
      "pos": "短语",
      "cn": "羊肉火锅",
      "scope": "补充表达",
      "image": "/assets/lesson49/icons/hotpot.svg",
      "alt": "羊肉火锅"
    }
  ],
  "POSMAP": {
    "n.": "名词",
    "v.": "动词",
    "adv.": "副词",
    "短语": "短语"
  },
  "LISTEN_ROUNDS": [
    [
      {
        "id": "listen-butcher",
        "target": "听辨 butcher",
        "prompt": "听一听，选出单词。",
        "audioText": "butcher",
        "options": [
          "butcher",
          "husband",
          "tell",
          "truth"
        ],
        "answer": "butcher",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "butcher：卖肉者，肉店老板。"
      },
      {
        "id": "listen-meat",
        "target": "听辨 meat",
        "prompt": "听一听，选出单词。",
        "audioText": "meat",
        "options": [
          "meat",
          "mince",
          "steak",
          "chicken"
        ],
        "answer": "meat",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "meat：（食用）肉。"
      },
      {
        "id": "listen-beef",
        "target": "听辨 beef",
        "prompt": "听一听，选出单词。",
        "audioText": "beef",
        "options": [
          "beef",
          "lamb",
          "mince",
          "chicken"
        ],
        "answer": "beef",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "beef：牛肉。"
      },
      {
        "id": "listen-lamb",
        "target": "听辨 lamb",
        "prompt": "听一听，选出单词。",
        "audioText": "lamb",
        "options": [
          "lamb",
          "beef",
          "steak",
          "meat"
        ],
        "answer": "lamb",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "lamb：羔羊肉。"
      },
      {
        "id": "listen-steak",
        "target": "听辨 steak",
        "prompt": "听一听，选出单词。",
        "audioText": "steak",
        "options": [
          "steak",
          "mince",
          "chicken",
          "beef"
        ],
        "answer": "steak",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "steak：牛排。"
      },
      {
        "id": "listen-mince",
        "target": "听辨 mince",
        "prompt": "听一听，选出单词。",
        "audioText": "mince",
        "options": [
          "mince",
          "meat",
          "steak",
          "lamb"
        ],
        "answer": "mince",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "mince：肉馅。"
      }
    ],
    [
      {
        "id": "listen-chicken",
        "target": "听辨 chicken",
        "prompt": "听一听，选出单词。",
        "audioText": "chicken",
        "options": [
          "chicken",
          "lamb",
          "steak",
          "beef"
        ],
        "answer": "chicken",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "chicken：鸡肉。"
      },
      {
        "id": "listen-husband",
        "target": "听辨 husband",
        "prompt": "听一听，选出单词。",
        "audioText": "husband",
        "options": [
          "husband",
          "butcher",
          "truth",
          "either"
        ],
        "answer": "husband",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "husband：丈夫。"
      },
      {
        "id": "listen-tell",
        "target": "听辨 tell",
        "prompt": "听一听，选出单词。",
        "audioText": "tell",
        "options": [
          "tell",
          "truth",
          "either",
          "meat"
        ],
        "answer": "tell",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "tell：告诉。"
      },
      {
        "id": "listen-truth",
        "target": "听辨 truth",
        "prompt": "听一听，选出单词。",
        "audioText": "truth",
        "options": [
          "truth",
          "tell",
          "husband",
          "either"
        ],
        "answer": "truth",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "truth：实情。"
      },
      {
        "id": "listen-either",
        "target": "听辨 either",
        "prompt": "听一听，选出单词。",
        "audioText": "either",
        "options": [
          "either",
          "truth",
          "tell",
          "butcher"
        ],
        "answer": "either",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "either：也（用于否定句）。"
      }
    ],
    [
      {
        "id": "listen-mutton",
        "target": "听辨 mutton",
        "prompt": "听一听，选出单词。",
        "audioText": "mutton",
        "options": [
          "mutton",
          "lamb",
          "mince",
          "meat"
        ],
        "answer": "mutton",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "mutton：羊肉。"
      },
      {
        "id": "listen-pork",
        "target": "听辨 pork",
        "prompt": "听一听，选出单词。",
        "audioText": "pork",
        "options": [
          "pork",
          "beef",
          "fish",
          "lamb"
        ],
        "answer": "pork",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "pork：猪肉。"
      },
      {
        "id": "listen-fish",
        "target": "听辨 fish",
        "prompt": "听一听，选出单词。",
        "audioText": "fish",
        "options": [
          "fish",
          "pork",
          "mince",
          "chicken"
        ],
        "answer": "fish",
        "hint": "先重听；需要时可以回看词卡。这条提示不会显示答案。",
        "explanation": "fish：鱼肉。"
      }
    ]
  ],
  "POUCH": [
    {
      "en": "To tell you the truth",
      "cn": "坦白自己的真实想法",
      "scope": "课文表达",
      "example": "A: Do you like chicken? B: To tell you the truth, I don't like chicken."
    },
    {
      "en": "To be honest",
      "cn": "坦诚地表达意见",
      "scope": "补充表达",
      "example": "To be honest, I like lamb."
    },
    {
      "en": "Well",
      "cn": "留一点思考时间，或委婉开口",
      "scope": "补充表达",
      "example": "A: Beef or lamb? B: Well, beef, please."
    },
    {
      "en": "Yeah",
      "cn": "随和地表示同意",
      "scope": "补充表达",
      "example": "A: Do you like steak? B: Yeah!"
    },
    {
      "en": "That is to say",
      "cn": "进一步解释前面的话",
      "scope": "补充表达",
      "example": "The shop is closed. That is to say, we cannot buy meat here now."
    }
  ],
  "POUCH_TASK": [
    {
      "id": "pouch-truth",
      "target": "表达用途",
      "prompt": "课文中，老板用哪个开头说出自己不喜欢鸡肉？",
      "options": [
        "To tell you the truth",
        "Yeah",
        "That is to say"
      ],
      "answer": "To tell you the truth",
      "explanation": "课文用 To tell you the truth 引出坦白的话。"
    }
  ],
  "ET": [
    {
      "id": "either-meaning-too",
      "target": "也的意思",
      "prompt": "A: I like steak.\nB 的偏好：喜欢牛排。两个人的意思有什么联系？",
      "options": [
        "两个人都喜欢牛排",
        "只有 A 喜欢牛排"
      ],
      "answer": "两个人都喜欢牛排",
      "explanation": "A 喜欢牛排，B 也喜欢牛排。两个人的喜好相同。"
    },
    {
      "id": "either-form-too",
      "target": "too 回应",
      "prompt": "A: I like steak.\nB 也喜欢牛排，怎样接话？",
      "options": [
        "I like steak, too.",
        "I don't like steak either."
      ],
      "answer": "I like steak, too.",
      "explanation": "两个人都喜欢，用 I like steak, too. 表示“我也喜欢”。"
    },
    {
      "id": "either-meaning-either",
      "target": "也不的意思",
      "prompt": "A: I don't like chicken.\nB 的偏好：不喜欢鸡肉。两个人的意思有什么联系？",
      "options": [
        "两个人都不喜欢鸡肉",
        "只有 A 不喜欢鸡肉"
      ],
      "answer": "两个人都不喜欢鸡肉",
      "explanation": "A 不喜欢鸡肉，B 也不喜欢鸡肉。两个人都不喜欢。"
    },
    {
      "id": "either-form-either",
      "target": "either 回应",
      "prompt": "A: I don't like chicken.\nB 也不喜欢鸡肉，怎样接话？",
      "options": [
        "I don't like chicken either.",
        "I like chicken, too."
      ],
      "answer": "I don't like chicken either.",
      "explanation": "先理解两个人都不喜欢，再用否定句加 either 表示“也不”。"
    },
    {
      "id": "either-teachers",
      "target": "身份相同",
      "prompt": "A: I am a teacher.\nB 也是老师，怎样接话？",
      "options": [
        "I am a teacher, too.",
        "I am not a teacher either."
      ],
      "answer": "I am a teacher, too.",
      "explanation": "两个人都是老师，所以 B 肯定地接话：I am a teacher, too."
    },
    {
      "id": "either-home",
      "target": "状态相同",
      "prompt": "A: I am not at home.\nB 也不在家，怎样接话？",
      "options": [
        "I am not at home either.",
        "I am at home, too."
      ],
      "answer": "I am not at home either.",
      "explanation": "A 和 B 都不在家，B 用否定句和 either 表示“也不”。"
    }
  ],
  "GIVE": {
    "give": {
      "a": [
        "Give",
        "me",
        "that piece,",
        "please."
      ],
      "b": [
        "Give",
        "that piece",
        "to",
        "me,",
        "please."
      ]
    },
    "show": {
      "a": [
        "Show",
        "me",
        "your ticket,",
        "please."
      ],
      "b": [
        "Show",
        "your ticket",
        "to",
        "me,",
        "please."
      ]
    },
    "send": {
      "a": [
        "Send",
        "him",
        "a postcard."
      ],
      "b": [
        "Send",
        "a postcard",
        "to",
        "him."
      ]
    },
    "take": {
      "a": [
        "Take",
        "her",
        "some flowers."
      ],
      "b": [
        "Take",
        "some flowers",
        "to",
        "her."
      ]
    }
  },
  "GIVE_TASK": [
    {
      "id": "give-recipient-person",
      "target": "give 接收者",
      "prompt": "Mrs. Bird 说：Give me that piece, please.\n接收者是谁？",
      "options": [
        "Mrs. Bird",
        "the butcher"
      ],
      "optionImages": {
        "Mrs. Bird": "/assets/lesson49/icons/bird.svg",
        "the butcher": "/assets/lesson49/icons/butcher.svg"
      },
      "answer": "Mrs. Bird",
      "explanation": "me 指正在说话的 Mrs. Bird，她是接收者。"
    },
    {
      "id": "give-object",
      "target": "give 物品",
      "prompt": "Give me that piece, please.\n哪部分表示要给的物品？",
      "options": [
        "me",
        "that piece"
      ],
      "answer": "that piece",
      "explanation": "that piece 指柜台上的那块肉，是物品。"
    },
    {
      "id": "give-predict",
      "target": "give 词序预测",
      "prompt": "先放物品 that piece，再放接收者 me。另一种说法会怎样排列？",
      "options": [
        "Give that piece to me, please.",
        "Give to that piece me, please."
      ],
      "answer": "Give that piece to me, please.",
      "explanation": "把物品放在前面，用 to 引出接收者。",
      "morph": {
        "from": "Give me that piece, please.",
        "to": "Give that piece to me, please."
      }
    },
    {
      "id": "give-order",
      "target": "give 词块组织",
      "type": "order",
      "prompt": "撤去示范。用词块组成“请把那块肉给我”。",
      "tokens": [
        "Give",
        "that piece",
        "to",
        "me,",
        "please."
      ],
      "answer": "Give that piece to me, please.",
      "hint": "先放动作，再放物品，to 后面连接接收者。",
      "explanation": "Give that piece to me, please. 物品 that piece 在前，接收者 me 在 to 后。"
    },
    {
      "id": "give-handoff",
      "target": "give 交接意思",
      "prompt": "新订单：Give that piece of steak to Tom, please.\n把牛排交给谁？",
      "options": [
        "Tom",
        "Lily"
      ],
      "answer": "Tom",
      "image": "/assets/lesson49/icons/steak.svg",
      "imageAlt": "待交接的一块牛排",
      "explanation": "这句话请把牛排给 Tom；to Tom 标明接收者。",
      "delivery": "Tom",
      "hint": "找 to 后面的人名。",
      "successText": "牛排交给 Tom 了。"
    },
    {
      "id": "show-order",
      "target": "show 迁移",
      "type": "order",
      "lesson": "show 表示“给……看”。示范：Show me your ticket, please. → Show your ticket to me, please.",
      "prompt": "试着换个人：请把你的票给 Lily 看。用“物品 + to + 接收者”组织词块。",
      "tokens": [
        "Show",
        "your ticket",
        "to",
        "Lily,",
        "please."
      ],
      "answer": "Show your ticket to Lily, please.",
      "hint": "先放 show 和物品，再用 to 引出 Lily。",
      "explanation": "Show your ticket to Lily, please. 这次物品是票，接收者是 Lily。"
    }
  ],
  "DOARE_HELP": [
  "Are you a teacher? 用 be 连接 you 和 a teacher。",
  "Do you like meat? 使用动词 like，一般现在时问句用 do。",
  "Do you live here? 虽然问地点，仍使用动词 live，问句用 do；不能只看问的是身份、状态还是地点。"
],
  "VERB_HELP": [
  "这些题练习一般现在时。在 like、want 等一般动词的肯定句里，第三人称单数主语后用相应词形，例如 My husband likes steak.；I / you / we / they 后用原形。",
  "本组否定句中，doesn’t 后的一般动词用原形：He doesn’t like chicken.",
  "be 的形式另看主语：I am，you / we / they are，he / she / it is。"
],
  "SUBJECTS": {
  "version": "l49-subjects-v1.10-four-categories",
  "prompt": "作主语时，属于哪一类？",
  "categories": [
    "第一人称",
    "第二人称",
    "第三人称单数",
    "第三人称复数"
  ],
  "help": [
    "I / we 是第一人称，分别为单数／复数。",
    "you 是第二人称，可指一人或多人；本题指伯德夫人一人。",
    "本题的 Mrs. Bird 是第三人称单数，Mrs. Bird and her husband 是第三人称复数。",
    "本题 they 明确指夫妇二人；不能把它概括为永远只指多人。"
  ],
  "questions": [
    {
      "id": "S01",
      "subject": "Mrs. Bird",
      "answer": "第三人称单数",
      "explanation": "Mrs. Bird 指一位被谈论的人，作主语时是第三人称单数。",
      "wrong": {
        "第一人称": "Mrs. Bird 是本题谈论的人，不是说话者使用的“我／我们”。",
        "第二人称": "本题用 Mrs. Bird 谈论这位夫人，不是用 you 称呼她。",
        "第三人称复数": "Mrs. Bird 只指一位夫人，数量是单数。"
      },
      "hint": "伯德夫人。",
      "image": "/assets/lesson49/subjects/s01.svg",
      "imageAlt": "圈内是伯德夫人一人",
      "context": ""
    },
    {
      "id": "S02",
      "subject": "Mrs. Bird and her husband",
      "answer": "第三人称复数",
      "explanation": "Mrs. Bird and her husband 指两个人，是第三人称复数。",
      "wrong": {
        "第一人称": "这里的主语是被谈论的夫妇二人，不是说话者说的“我们”。",
        "第二人称": "这里谈论夫妇二人，不是用 you 称呼对方。",
        "第三人称单数": "and 连接伯德夫人与丈夫，两个人是复数。"
      },
      "hint": "伯德夫人和她的丈夫。",
      "image": "/assets/lesson49/subjects/s02.svg",
      "imageAlt": "圈内是伯德夫人和丈夫两人",
      "context": ""
    },
    {
      "id": "S03",
      "subject": "her husband",
      "answer": "第三人称单数",
      "explanation": "her 表示“她的”；整个主语指她的丈夫，是第三人称单数。",
      "wrong": {
        "第一人称": "her husband 指她的丈夫；her 表示“她的”，不表示“我／我们”。",
        "第二人称": "her husband 在这里指被谈论的丈夫，不是对对方说 you。",
        "第三人称复数": "整个短语只指丈夫；不能把表示所属的 her 也算成一个主语成员。"
      },
      "hint": "她的丈夫。",
      "image": "/assets/lesson49/subjects/s03.svg",
      "imageAlt": "圈内只有丈夫，旁边的小图表示伯德夫人",
      "context": ""
    },
    {
      "id": "S04",
      "subject": "the butcher",
      "answer": "第三人称单数",
      "explanation": "the butcher 指这位肉店老板，作主语时是第三人称单数。",
      "wrong": {
        "第一人称": "the butcher 是本题谈论的老板，不是说话者使用的“我／我们”。",
        "第二人称": "the butcher 在这里用作谈论老板的主语，不是称呼对方的 you。",
        "第三人称复数": "the butcher 指这位老板一个人，是单数。"
      },
      "hint": "这位肉店老板。",
      "image": "/assets/lesson49/subjects/s04.svg",
      "imageAlt": "圈内是肉店老板一人",
      "context": ""
    },
    {
      "id": "S05",
      "subject": "I",
      "answer": "第一人称",
      "explanation": "I 指说话的“我”，是第一人称单数。",
      "wrong": {
        "第二人称": "I 是说话的“我”；称呼对方的“你”用 you。",
        "第三人称单数": "I 虽然指一个人，但它是第一人称，不是第三人称。",
        "第三人称复数": "I 指说话的一个人，是第一人称单数，不是第三人称复数。"
      },
      "hint": "我。",
      "image": "/assets/lesson49/subjects/s05.svg",
      "imageAlt": "老板指自己说 I",
      "context": "老板说 I"
    },
    {
      "id": "S06",
      "subject": "you",
      "answer": "第二人称",
      "explanation": "这里 you 指被称呼的伯德夫人，是第二人称单数。",
      "wrong": {
        "第一人称": "you 指正在被称呼的对方；说话者称自己为 I。",
        "第三人称单数": "这里 you 虽然指一位夫人，但人称是第二人称。",
        "第三人称复数": "这里 you 是对一位夫人的称呼，是第二人称单数。"
      },
      "hint": "你。",
      "image": "/assets/lesson49/subjects/s06.svg",
      "imageAlt": "老板对伯德夫人说 you，圈内是夫人",
      "context": "老板对伯德夫人说 you"
    },
    {
      "id": "S07",
      "subject": "this book",
      "answer": "第三人称单数",
      "explanation": "this book 指这一本书，作主语时是第三人称单数。",
      "wrong": {
        "第一人称": "this book 是本题谈论的物品，不是说话的“我／我们”。",
        "第二人称": "this book 指这本书，不是对对方说的 you。",
        "第三人称复数": "this book 指一本书，是单数。"
      },
      "hint": "这本书。",
      "image": "/assets/lesson49/subjects/s07.svg",
      "imageAlt": "圈内是一本书",
      "context": ""
    },
    {
      "id": "S08",
      "subject": "these books",
      "answer": "第三人称复数",
      "explanation": "these books 指这些书，是第三人称复数。",
      "wrong": {
        "第一人称": "these books 指被谈论的书，不是包含说话者的“我们”。",
        "第二人称": "these books 指这些书，不是对对方说的 you。",
        "第三人称单数": "these books 指多本书，是复数。"
      },
      "hint": "这些书。",
      "image": "/assets/lesson49/subjects/s08.svg",
      "imageAlt": "圈内是两本分开的书",
      "context": ""
    },
    {
      "id": "S09",
      "subject": "we",
      "answer": "第一人称",
      "explanation": "这里 we 包括说话的伯德夫人和她的丈夫，是第一人称复数。",
      "wrong": {
        "第二人称": "we 包括说话者自己；you 是对对方的称呼。",
        "第三人称单数": "we 在这里包含说话者和丈夫，是第一人称复数。",
        "第三人称复数": "多人不一定是第三人称；we 包含说话者，是第一人称复数。"
      },
      "hint": "我们。",
      "image": "/assets/lesson49/subjects/s09.svg",
      "imageAlt": "伯德夫人说 we，圈内是夫人与丈夫",
      "context": "伯德夫人说 we"
    },
    {
      "id": "S10",
      "subject": "his dogs",
      "answer": "第三人称复数",
      "explanation": "这里 his dogs 指两只狗，是第三人称复数。",
      "wrong": {
        "第一人称": "his 表示“他的”；整个主语指被谈论的狗，不是“我／我们”。",
        "第二人称": "his dogs 指这些狗，不是对对方说的 you。",
        "第三人称单数": "要看 dogs 所指的狗有几只；这里有两只，不看主人的人数。"
      },
      "hint": "他的狗（不止一只）。",
      "image": "/assets/lesson49/subjects/s10.svg",
      "imageAlt": "圈内有两只狗，圈外小图表示主人",
      "context": ""
    },
    {
      "id": "S11",
      "subject": "his dog",
      "answer": "第三人称单数",
      "explanation": "his 表示“他的”；主语说的是那一只狗，是第三人称单数。",
      "wrong": {
        "第一人称": "his 表示“他的”；整个主语指被谈论的狗，不是“我／我们”。",
        "第二人称": "his dog 指这只狗，不是对对方说的 you。",
        "第三人称复数": "主语只指一只狗，主人不算在这个主语所指的数量中。"
      },
      "hint": "他的狗（这里是一只）。",
      "image": "/assets/lesson49/subjects/s11.svg",
      "imageAlt": "圈内只有一只狗，圈外小图表示主人",
      "context": ""
    },
    {
      "id": "S12",
      "subject": "they",
      "answer": "第三人称复数",
      "explanation": "这里 they 指老板谈论的伯德夫人和她的丈夫，是第三人称复数。",
      "wrong": {
        "第一人称": "这里 they 不包含说话的老板，指的是夫人和丈夫；包含说话者的“我们”用 we。",
        "第二人称": "这里 they 用来谈论夫妇二人，不是用 you 称呼他们。",
        "第三人称单数": "本题明确指夫人和丈夫两个人，因此是复数。"
      },
      "hint": "他们（这里指伯德夫人和她的丈夫）。",
      "image": "/assets/lesson49/subjects/s12.svg",
      "imageAlt": "老板在圈外说 they，圈内是伯德夫人与丈夫",
      "context": "they → Mrs. Bird and her husband"
    }
  ]
},
  "FILL": [
    {
      "id": "fill-aunt",
      "target": "完整句中的主语与词形",
      "prompt": "My aunt ___ fish.",
      "options": [
        "likes",
        "like"
      ],
      "answer": "likes",
      "explanation": "My aunt 可以换成 she，本句用 likes。"
    },
    {
      "id": "fill-parents",
      "target": "完整句中的主语与词形",
      "prompt": "My parents ___ fish.",
      "options": [
        "like",
        "likes"
      ],
      "answer": "like",
      "explanation": "My parents 指父母两人，用 like。"
    },
    {
      "id": "fill-watch",
      "target": "完整句中的主语与词形",
      "prompt": "My dog ___ TV at night.",
      "options": [
        "watches",
        "watch"
      ],
      "answer": "watches",
      "explanation": "watch 变成 watches，增加的是 -es。"
    },
    {
      "id": "fill-go",
      "target": "完整句中的主语与词形",
      "prompt": "The student ___ to school on foot.",
      "options": [
        "goes",
        "go"
      ],
      "answer": "goes",
      "explanation": "go 变成 goes，增加的是 -es。"
    },
    {
      "id": "fill-love",
      "target": "完整句中的主语与词形",
      "prompt": "He ___ his dog very much.",
      "options": [
        "loves",
        "love"
      ],
      "answer": "loves",
      "explanation": "He 是第三人称单数，本句用 loves。"
    },
    {
      "id": "fill-walk",
      "target": "完整句中的主语与词形",
      "prompt": "Jim and Lily ___ to school every day.",
      "options": [
        "walk",
        "walks"
      ],
      "answer": "walk",
      "explanation": "Jim and Lily 是并列主语，用原形 walk。"
    },
    {
      "id": "fill-drink",
      "target": "完整句中的主语与词形",
      "prompt": "They ___ water every day.",
      "options": [
        "drink",
        "drinks"
      ],
      "answer": "drink",
      "explanation": "在这个一般现在时肯定句里，They 后用 drink：They drink water every day."
    }
  ],
  "CHOICE": [
    {
      "id": "negative-like",
      "target": "否定句原形",
      "lesson": "对比：She wants fish. / She doesn't want fish.\n观察两句中表示否定的部分，以及后面动词的形式。",
      "prompt": "他不喜欢鸡肉。哪句符合这个意思？",
      "options": [
        "He doesn't like chicken.",
        "He doesn't likes chicken.",
        "He likes chicken."
      ],
      "answer": "He doesn't like chicken.",
      "explanation": "doesn't 后面的 like 用原形；不能再加 -s。"
    },
    {
      "id": "negative-want",
      "target": "否定句迁移",
      "prompt": "Lucy 不想要牛肉，选出正确句子。",
      "options": [
        "Lucy doesn't want beef.",
        "Lucy doesn't wants beef.",
        "Lucy wants beef."
      ],
      "answer": "Lucy doesn't want beef.",
      "explanation": "Lucy doesn't want beef. doesn't 后面也用 want 的原形。"
    },
    {
      "id": "choice-get",
      "target": "三单词形",
      "prompt": "She ___ up at six in the morning.",
      "options": [
        "get",
        "gets",
        "getting"
      ],
      "answer": "gets",
      "explanation": "She 是第三人称单数，本句用 gets。"
    },
    {
      "id": "choice-work",
      "target": "三单词形",
      "prompt": "Tom is a student. He ___ in the classroom.",
      "options": [
        "work",
        "works",
        "working"
      ],
      "answer": "works",
      "explanation": "He 是第三人称单数，本句用 works。"
    }
  ],
  "TRANS": [
    {
      "id": "trans-peaches",
      "target": "词块组织",
      "type": "order",
      "prompt": "用词块表达：她喜欢桃子。",
      "tokens": [
        "She",
        "likes",
        "peaches."
      ],
      "answer": "She likes peaches.",
      "explanation": "She likes peaches. 主语是 she，用 likes。"
    },
    {
      "id": "trans-car",
      "target": "词块组织",
      "type": "order",
      "prompt": "用词块表达：他想要一辆小汽车。",
      "tokens": [
        "He",
        "wants",
        "a car."
      ],
      "answer": "He wants a car.",
      "explanation": "He wants a car. 主语是 he，用 wants。"
    }
  ],
  "DIALOGUE": [
    {
      "who": "butcher",
      "text": "Do you want any meat today, Mrs. Bird?",
      "cn": "您今天要来点肉吗，伯德夫人？"
    },
    {
      "who": "bird",
      "text": "Yes, please.",
      "cn": "好的，谢谢。"
    },
    {
      "who": "butcher",
      "text": "Do you want beef or lamb?",
      "cn": "您要牛肉还是羔羊肉？"
    },
    {
      "who": "bird",
      "text": "Beef, please.",
      "cn": "请给我牛肉。"
    },
    {
      "who": "butcher",
      "text": "This lamb's very good.",
      "cn": "这羔羊肉很不错。"
    },
    {
      "who": "bird",
      "text": "I like lamb, but my husband doesn't.",
      "cn": "我喜欢羔羊肉，可是我丈夫不喜欢。"
    },
    {
      "who": "butcher",
      "text": "What about some steak? This is a nice piece.",
      "cn": "来点牛排怎么样？这块很好。"
    },
    {
      "who": "bird",
      "text": "Give me that piece, please. And a pound of mince, too.",
      "cn": "请给我那块。再来一磅肉馅。"
    },
    {
      "who": "butcher",
      "text": "Do you want a chicken, Mrs. Bird? They're very nice.",
      "cn": "您要只鸡吗，伯德夫人？鸡很好。"
    },
    {
      "who": "bird",
      "text": "No, thank you. My husband likes steak, but he doesn't like chicken.",
      "cn": "不了，谢谢。我丈夫喜欢牛排，但他不喜欢鸡肉。"
    },
    {
      "who": "butcher",
      "text": "To tell you the truth, Mrs. Bird, I don't like chicken either!",
      "cn": "说实话，伯德夫人，我也不喜欢鸡肉！",
      "punch": true
    }
  ],
  "STORY_LEAD": [
    "丈夫喜欢什么肉？",
    "Mrs. Bird 先选了哪种肉？",
    "老板喜欢鸡肉吗？"
  ],
  "STORY_TASKS": [
    {
      "id": "story-husband-reading",
      "target": "课文信息理解",
      "prompt": "课文中，Mrs. Bird 的丈夫喜欢什么肉？",
      "scene": {
        "replyWho": "bird"
      },
      "optionImages": {
        "steak": "/assets/lesson49/icons/steak.svg",
        "lamb": "/assets/lesson49/icons/lamb.svg",
        "chicken": "/assets/lesson49/icons/chicken.svg"
      },
      "options": [
        "steak",
        "lamb",
        "chicken"
      ],
      "answer": "steak",
      "hint": "找到 Mrs. Bird 说的“My husband likes…”；注意区分她和丈夫的喜好。",
      "explanation": "Mrs. Bird 说丈夫喜欢 steak；他不喜欢 chicken。她自己喜欢 lamb。"
    },
    {
      "id": "story-bird-order",
      "target": "课文回应理解",
      "prompt": "课文中，老板问要牛肉还是羔羊肉时，Mrs. Bird 怎么回答？",
      "options": [
        "Beef, please.",
        "Yes, I do.",
        "Thank you."
      ],
      "answer": "Beef, please.",
      "hint": "老板让她在两种肉里选一种，回答要说出肉的名字。",
      "explanation": "Beef, please. 请给我牛肉。",
      "scene": {
        "who": "butcher",
        "text": "Do you want beef or lamb?",
        "replyWho": "bird"
      }
    },
    {
      "id": "story-butcher-either",
      "target": "课文回应理解",
      "prompt": "课文中，Mrs. Bird 说丈夫不喜欢鸡肉后，老板怎么回应？",
      "options": [
        "To tell you the truth, Mrs. Bird, I don't like chicken either.",
        "Beef, please.",
        "My husband likes steak."
      ],
      "answer": "To tell you the truth, Mrs. Bird, I don't like chicken either.",
      "hint": "回顾老板最后的回应，留意他和丈夫的喜好是否相同。",
      "explanation": "不喜欢鸡肉，再说“我也不喜欢”时，用 either。",
      "scene": {
        "who": "bird",
        "text": "No, thank you. My husband likes steak, but he doesn't like chicken.",
        "replyWho": "butcher"
      }
    },
    {
      "id": "story-lamb-application",
      "target": "新情境回应",
      "prompt": "如果 Mrs. Bird 这次想买羔羊肉，她应该怎么回答？",
      "options": [
        "Lamb, please.",
        "Beef, please.",
        "I don't like chicken either."
      ],
      "answer": "Lamb, please.",
      "hint": "先核对这次要买的肉，再选礼貌的回应。",
      "explanation": "这次想买羔羊肉，所以说 Lamb, please.",
      "scene": {
        "who": "butcher",
        "text": "Do you want beef or lamb?",
        "replyWho": "bird"
      }
    },
    {
      "id": "story-steak-too",
      "target": "新情境回应",
      "prompt": "顾客说“I like steak.”，如果老板也喜欢牛排，他应该怎么回答？",
      "options": [
        "I like steak, too.",
        "I don't like steak either.",
        "Beef, please."
      ],
      "answer": "I like steak, too.",
      "explanation": "两个人都喜欢，所以说 I like steak, too.",
      "scene": {
        "who": "bird",
        "text": "I like steak.",
        "replyWho": "butcher"
      },
      "hint": "先看两人的喜好是否相同，再留意句子是肯定还是否定。"
    }
  ],
  "EXAM": [
    {
      "id": "exam-listen",
      "target": "订单听辨",
      "prompt": "听订单，选出录音里出现的单词。",
      "audioText": "a pound of mince",
      "options": [
        "mince",
        "beef",
        "chicken",
        "lamb"
      ],
      "answer": "mince",
      "explanation": "录音说的是 a pound of mince，听到的名称是 mince，意思是肉馅。"
    },
    {
      "id": "exam-story",
      "presentation": "preferences",
      "target": "家人偏好",
      "prompt": "根据原文，哪张偏好卡同时符合 Mrs. Bird 和她丈夫？",
      "options": [
        "Mrs. Bird: lamb · husband: steak",
        "Mrs. Bird: steak · husband: lamb",
        "Mrs. Bird: chicken · husband: chicken"
      ],
      "answer": "Mrs. Bird: lamb · husband: steak",
      "explanation": "原文明确说 Mrs. Bird 喜欢 lamb，她的丈夫喜欢 steak。"
    },
    {
      "id": "exam-are",
      "presentation": "question",
      "target": "身份问句",
      "prompt": "想知道新顾客是不是学生，怎样问？",
      "options": [
        "Are you a student?",
        "Do you a student?"
      ],
      "answer": "Are you a student?",
      "explanation": "本句用 be 连接 you 和 a student，问句是 Are you a student?"
    },
    {
      "id": "exam-do",
      "presentation": "question",
      "target": "需求问句",
      "prompt": "想知道顾客要不要鸡肉，怎样问？",
      "options": [
        "Do you want chicken?",
        "Are you want chicken?"
      ],
      "answer": "Do you want chicken?",
      "explanation": "want 是一般动词，这组问句用 Do you want…?。"
    },
    {
      "id": "exam-order",
      "target": "give 新物品词序",
      "type": "order",
      "prompt": "新订单：请把牛肉给 Lily。用“物品 + to + 接收者”组织句子。",
      "tokens": [
        "Give",
        "the beef",
        "to",
        "Lily,",
        "please."
      ],
      "answer": "Give the beef to Lily, please.",
      "hint": "先放动作和物品，再用 to 引出 Lily。",
      "explanation": "Give the beef to Lily, please. 牛肉是物品，Lily 是接收者。"
    },
    {
      "id": "exam-handoff",
      "target": "新接收者交接",
      "prompt": "Give that piece to Sam, please.\n这块肉应该交给谁？",
      "options": [
        "Tom",
        "Sam"
      ],
      "answer": "Sam",
      "explanation": "这句话请把这块肉给 Sam；to Sam 标明接收者。",
      "delivery": "Sam",
      "hint": "找 to 后面的人名。",
      "successText": "这块肉交给 Sam 了。"
    },
    {
      "id": "exam-too",
      "presentation": "reply",
      "target": "相同喜好回应",
      "prompt": "A: I like lamb.\nB 也喜欢羔羊肉，怎样回应？",
      "options": [
        "I like lamb, too.",
        "I don't like lamb either."
      ],
      "answer": "I like lamb, too.",
      "explanation": "两个人都喜欢，B 说 I like lamb, too."
    },
    {
      "id": "exam-subject",
      "presentation": "cloze",
      "target": "名词短语主语",
      "prompt": "My parents ___ lamb. 选出正确词形。",
      "options": [
        "want",
        "wants"
      ],
      "answer": "want",
      "explanation": "My parents 指父母两人，本句用 want。"
    },
    {
      "id": "exam-negative",
      "target": "否定句原形迁移",
      "prompt": "Tom 不喜欢牛肉，怎样表达？",
      "options": [
        "Tom doesn't like beef.",
        "Tom doesn't likes beef.",
        "Tom likes beef."
      ],
      "answer": "Tom doesn't like beef.",
      "explanation": "doesn't 后面的 like 用原形。"
    },
    {
      "id": "exam-either",
      "presentation": "reply",
      "target": "相同否定回应",
      "prompt": "A: I don't like lamb.\nB 也不喜欢羔羊肉，怎样回应？",
      "options": [
        "I don't like lamb either.",
        "I like lamb, too."
      ],
      "answer": "I don't like lamb either.",
      "explanation": "A 和 B 都不喜欢，B 用否定句加 either 表示“也不喜欢”。"
    }
  ],
  "AUDIO": {
    "butcher": "lesson49/audio/butcher.mp3",
    "meat": "lesson49/audio/meat.mp3",
    "beef": "lesson49/audio/beef.mp3",
    "lamb": "lesson49/audio/lamb.mp3",
    "mutton": "lesson49/audio/mutton.mp3",
    "steak": "lesson49/audio/steak.mp3",
    "mince": "lesson49/audio/mince.mp3",
    "chicken": "lesson49/audio/chicken.mp3",
    "pork": "lesson49/audio/pork.mp3",
    "fish": "lesson49/audio/fish.mp3",
    "husband": "lesson49/audio/husband.mp3",
    "tell": "lesson49/audio/tell.mp3",
    "truth": "lesson49/audio/truth.mp3",
    "either": "lesson49/audio/either.mp3",
    "a piece of steak": "lesson49/audio/a_piece_of_steak.mp3",
    "a pound of mince": "lesson49/audio/a_pound_of_mince.mp3",
    "mutton hotpot": "lesson49/audio/mutton_hotpot.mp3",
    "To tell you the truth": "lesson49/audio/to_tell_you_the_truth.mp3",
    "To be honest": "lesson49/audio/to_be_honest.mp3",
    "Well": "lesson49/audio/well.mp3",
    "Yeah": "lesson49/audio/yeah.mp3",
    "That is to say": null,
    "Do you want any meat today, Mrs. Bird?": "lesson49/audio/do_you_want_any_meat_today_mrs_bird.mp3",
    "Yes, please.": "lesson49/audio/yes_please.mp3",
    "Do you want beef or lamb?": "lesson49/audio/do_you_want_beef_or_lamb.mp3",
    "Beef, please.": "lesson49/audio/beef_please.mp3",
    "This lamb's very good.": "lesson49/audio/this_lamb_s_very_good.mp3",
    "I like lamb, but my husband doesn't.": "lesson49/audio/i_like_lamb_but_my_husband_doesn_t.mp3",
    "What about some steak? This is a nice piece.": "lesson49/audio/what_about_some_steak_this_is_a_nice_piece.mp3",
    "Give me that piece, please. And a pound of mince, too.": "lesson49/audio/give_me_that_piece_please_and_a_pound_of_mince_too.mp3",
    "Do you want a chicken, Mrs. Bird? They're very nice.": "lesson49/audio/do_you_want_a_chicken_mrs_bird_they_re_very_nice.mp3",
    "No, thank you. My husband likes steak, but he doesn't like chicken.": "lesson49/audio/no_thank_you_my_husband_likes_steak_but_he_doesn_t_like_chicken.mp3",
    "To tell you the truth, Mrs. Bird, I don't like chicken either!": "lesson49/audio/to_tell_you_the_truth_mrs_bird_i_don_t_like_chicken_either.mp3",
    "Give me that piece, please.": "lesson49/audio/give_me_that_piece_please.mp3",
    "Give that piece to me, please.": null,
    "Show me your ticket, please.": "lesson49/audio/show_me_your_ticket_please.mp3",
    "Show your ticket to me, please.": null,
    "Send him a postcard.": "lesson49/audio/send_him_a_postcard.mp3",
    "Send a postcard to him.": null,
    "Take her some flowers.": "lesson49/audio/take_her_some_flowers.mp3",
    "Take some flowers to her.": null,
    "Do you like meat?": null,
    "Are you a teacher?": "lesson49/audio/are_you_a_teacher.mp3",
    "Are you busy?": "lesson49/audio/are_you_busy.mp3",
    "Are you at home?": "lesson49/audio/are_you_at_home.mp3",
    "Do you want beef?": null,
    "Do you sleep well?": "lesson49/audio/do_you_sleep_well.mp3",
    "Do you make the bed?": "lesson49/audio/do_you_make_the_bed.mp3",
    "Do you put on your coat?": "lesson49/audio/do_you_put_on_your_coat.mp3",
    "两个人都喜欢牛排": null,
    "I like steak.": "lesson49/audio/i_like_steak.mp3",
    "I like steak, too.": "lesson49/audio/i_like_steak_too.mp3",
    "两个人都不喜欢鸡肉": null,
    "I don't like chicken either.": null,
    "I am a teacher, too.": null,
    "I am not at home either.": null,
    "likes": null,
    "like": null,
    "watches": null,
    "goes": null,
    "loves": null,
    "walk": null,
    "drink": null,
    "He doesn't like chicken.": null,
    "Lucy doesn't want beef.": null,
    "gets": null,
    "works": null,
    "She likes peaches.": "lesson49/audio/she_likes_peaches.mp3",
    "He wants a car.": "lesson49/audio/he_wants_a_car.mp3",
    "Mrs. Bird: lamb · husband: steak": null,
    "Are you a student?": null,
    "Do you want chicken?": null,
    "Give the beef to Lily, please.": null,
    "Sam": null,
    "I like lamb, too.": null,
    "want": null,
    "Tom doesn't like beef.": null,
    "I don't like lamb either.": null,
    "me": null,
    "that piece": null,
    "Tom": null,
    "Show your ticket to Lily, please.": null,
    "Lamb, please.": "lesson49/audio/lamb_please.mp3",
    "To tell you the truth, Mrs. Bird, I don't like chicken either.": "lesson49/audio/to_tell_you_the_truth_mrs_bird_i_don_t_like_chicken_either.mp3"
  }
};

  const COURSES = deepFreeze([
    publishedLesson({
      lesson: 49,
      learning: LESSON49_LEARNING,
      title: '肉店大冒险',
      subtitle: "At the Butcher's",
      description: '跟着伯德夫人去肉店买肉！17 张单词卡、课文小剧场、句型魔法屋，还有三单训练营等你来闯。',
      features: ['单词卡', '课文剧场', '句型魔法', '三单特训', '结业证书'],
      art: '/assets/home/lesson49-steak.png',
      tone: 'red',
      legacyKey: 'l49-stars-v1',
      legacyMode: 'ratings',
      souvenir: {
        id: 'food-basket',
        title: '食物篮子',
        asset: 'assets/adventure-map/lesson49/food-basket.png'
      },
      mapPublication: {
        declaredStatus: 'published',
        landmarkMode: 'states',
        baseAsset: 'assets/adventure-map/lesson49/landmark-base.png',
        growthAssets: [
          'assets/adventure-map/lesson49/growth-01-awning.png',
          'assets/adventure-map/lesson49/growth-02-display.png',
          'assets/adventure-map/lesson49/growth-03-sign.png',
          'assets/adventure-map/lesson49/growth-04-delivery.png',
          'assets/adventure-map/lesson49/growth-05-celebration.png'
        ],
        stageReveals: [
          { title: '红白遮阳棚', copy: '肉店挂上了红白遮阳棚！' },
          { title: '新鲜展示台', copy: '木台上摆好了新鲜肉品！' },
          { title: '牛排招牌', copy: '门前挂上了会摇摆的牛排招牌！' },
          { title: '送货小车', copy: '送货小车把木箱稳稳送到了门口！' },
          { title: '暖灯庆典开张', copy: '彩旗和暖灯点亮了肉店，食物篮子也收藏进图鉴！' }
        ],
        mobilePreview: 'assets/adventure-map/lesson49/mobile-preview.png',
        regressionTest: 'tests/e2e/lesson49-map.spec.js'
      },
    }),
    publishedLesson({
      lesson: 50,
      title: '挑食小王子大冒险',
      subtitle: 'The Picky Prince',
      description: '认识皇家蔬果、投喂王子公主、学动词变身术，帮挑食小王子学会好好吃饭。',
      features: ['蔬果图鉴', '餐桌作战', '动词变身', '照妖镜', '结业证书'],
      art: '/assets/home/lesson50-crown.png',
      tone: 'purple',
      legacyKey: 'l50-stars-v1',
      legacyMode: 'ratings',
      souvenir: {
        id: 'royal-vegetable-crest',
        title: '皇家蔬菜徽章',
        asset: 'assets/adventure-map/lesson50/royal-vegetable-crest.png'
      },
      mapPublication: {
        declaredStatus: 'published',
        landmarkMode: 'states',
        baseAsset: 'assets/adventure-map/lesson50/landmark-base.png',
        growthAssets: [
          'assets/adventure-map/lesson50/growth-01-garden.png',
          'assets/adventure-map/lesson50/growth-02-banquet.png',
          'assets/adventure-map/lesson50/growth-03-weather-vane.png',
          'assets/adventure-map/lesson50/growth-04-delivery.png',
          'assets/adventure-map/lesson50/growth-05-celebration.png'
        ],
        stageReveals: [
          { title: '皇家蔬菜园', copy: '城堡旁长出了豌豆、卷心菜和番茄！' },
          { title: '健康长餐桌', copy: '宴会桌摆满了彩色蔬菜！' },
          { title: '皇冠风向标', copy: '塔顶装上了闪亮的皇冠风向标！' },
          { title: '蔬菜送货车', copy: '小车把新鲜蔬菜送到了城堡门口！' },
          { title: '王国健康庆典', copy: '紫金彩旗和暖灯点亮城堡，皇家蔬菜徽章也收藏进图鉴！' }
        ],
        mobilePreview: 'assets/adventure-map/lesson50/mobile-preview.png',
        regressionTest: 'tests/e2e/l50-assessment.spec.js'
      }
    }),
    publishedLesson({
      lesson: 51,
      title: '希腊四季之旅',
      subtitle: 'A Pleasant Climate',
      description: '跟着 Dimitri 学天气、季节、月份和频率词，完成五关成为希腊小导游。',
      features: ['听音挑词', '课文剧场', '月份归队', '频率阶梯', '导游证书'],
      art: '/assets/home/lesson51-temple.png',
      tone: 'blue',
      legacyKey: 'l51-stars-v1',
      legacyMode: 'reset',
      souvenir: {
        id: 'four-seasons-guide-compass',
        title: '四季导游罗盘',
        asset: 'assets/adventure-map/lesson51/four-seasons-guide-compass.png'
      },
      mapPublication: {
        declaredStatus: 'published',
        landmarkMode: 'states',
        baseAsset: 'assets/adventure-map/lesson51/landmark-base.png',
        growthAssets: [
          'assets/adventure-map/lesson51/growth-01-weather.png',
          'assets/adventure-map/lesson51/growth-02-theatre.png',
          'assets/adventure-map/lesson51/growth-03-seasons.png',
          'assets/adventure-map/lesson51/growth-04-sundial.png',
          'assets/adventure-map/lesson51/growth-05-celebration.png'
        ],
        stageReveals: [
          { title: '天气观测台', copy: '蓝顶观测台装好了天气仪器！' },
          { title: '露天小剧场', copy: '石阶中央变成了四季小剧场！' },
          { title: '四季花园', copy: '花园里长出了代表四季的植物！' },
          { title: '太阳时钟', copy: '广场中央亮起了一座太阳时钟！' },
          { title: '希腊庆典', copy: '蓝白彩旗和灯火点亮了海湾，四季导游罗盘也收藏进图鉴！' }
        ],
        mobilePreview: 'assets/adventure-map/lesson51/mobile-preview.png',
        regressionTest: 'tests/e2e/lesson51-map.spec.js'
      }
    }),
    publishedLesson({
      lesson: 52,
      title: '环球护照之旅 Ⅰ',
      subtitle: 'What Nationality Are They?',
      description: '第一卷·欧美篇：走遍 12 个欧美国家，跟签证官学国家和国籍、听机场广播、玩盖章配对，成为环球小使者！',
      features: ['国家国籍', '机场广播', '盖章配对', '动词小尾巴', '海关考核'],
      art: '/assets/home/lesson52-passport.svg',
      tone: 'blue',
      souvenir: {
        id: 'globe-compass',
        title: '环球罗盘',
        asset: 'assets/adventure-map/lesson52/globe-compass.png'
      },
      mapPublication: {
        declaredStatus: 'published', landmarkMode: 'states',
        baseAsset: 'assets/adventure-map/lesson52/landmark-base.png',
        growthAssets: [
          'assets/adventure-map/lesson52/growth-01-departures.png',
          'assets/adventure-map/lesson52/growth-02-airplane.png',
          'assets/adventure-map/lesson52/growth-03-passport-stamps.png',
          'assets/adventure-map/lesson52/growth-04-luggage.png',
          'assets/adventure-map/lesson52/growth-05-celebration.png'
        ],
        stageReveals: [
          { title: '彩色出发牌', copy: '车站亮起了彩色出发牌！' },
          { title: '蓝翼小飞机', copy: '蓝色小飞机停靠在环球站旁！' },
          { title: '护照盖章台', copy: '护照盖章台摆好了罗盘和印章！' },
          { title: '旅行行李车', copy: '五彩行李已经整齐装上小车！' },
          { title: '环球出发庆典', copy: '三色旗和暖灯照亮车站，环球罗盘也收藏进图鉴！' }
        ],
        mobilePreview: 'assets/adventure-map/lesson52/mobile-preview.png',
        regressionTest: 'tests/e2e/l52-progress.spec.js'
      }
    }),
    publishedLesson({
      lesson: 53,
      title: '英伦气候小主播',
      subtitle: 'An Interesting Climate',
      description: '跟着汉斯和吉姆聊英国天气：东南西北四种天、春夏秋冬昼夜长短，15 句对白学会用英语聊气候！',
      features: ['气候单词', '对白剧场', '罗盘配对', '缺词魔法', '主播证书'],
      art: '/assets/home/lesson53-climate.svg',
      tone: 'green',
      souvenir: {
        id: 'weather-broadcaster-crest',
        title: '气候主播徽章',
        asset: 'assets/adventure-map/lesson53/weather-broadcaster-crest.png'
      },
      mapPublication: {
        declaredStatus: 'published', landmarkMode: 'states',
        baseAsset: 'assets/adventure-map/lesson53/landmark-base.png',
        growthAssets: [
          'assets/adventure-map/lesson53/growth-01-weather-vane.png',
          'assets/adventure-map/lesson53/growth-02-broadcast.png',
          'assets/adventure-map/lesson53/growth-03-weather-jars.png',
          'assets/adventure-map/lesson53/growth-04-rain-gauge.png',
          'assets/adventure-map/lesson53/growth-05-celebration.png'
        ],
        stageReveals: [
          { title: '四象天气标', copy: '小屋装上了太阳、雨滴、云和风的天气标！' },
          { title: '气候播音台', copy: '老式麦克风准备好播报天气了！' },
          { title: '四季天气瓶', copy: '晴、雨、雪、风被收藏进四只天气瓶！' },
          { title: '雨量观测角', copy: '门边装好了雨量筒和雨伞架！' },
          { title: '气候播报庆典', copy: '绿金彩旗和暖灯点亮小屋，气候主播徽章也收藏进图鉴！' }
        ],
        mobilePreview: 'assets/adventure-map/lesson53/mobile-preview.png',
        regressionTest: 'tests/e2e/l53-progress.spec.js'
      }
    }),
    publishedLesson({
      lesson: 54,
      title: '环球护照之旅 Ⅱ',
      subtitle: 'What Nationality Are They?',
      description: '第二卷·亚非大洋洲篇：再走 12 个国家，练习国籍句型，还有 does 疑问否定小魔法。',
      features: ['国家国籍', '机场广播', '盖章配对', 'does 魔法', '海关考核'],
      art: '/assets/home/lesson54-passport.svg',
      tone: 'green',
      souvenir: {
        id: 'compass-wave-crest',
        title: '远航罗盘徽章',
        asset: 'assets/adventure-map/lesson54/compass-wave-crest.png'
      },
      mapPublication: {
        declaredStatus: 'published', landmarkMode: 'states',
        baseAsset: 'assets/adventure-map/lesson54/landmark-base.png',
        growthAssets: [
          'assets/adventure-map/lesson54/growth-01-globe.png',
          'assets/adventure-map/lesson54/growth-02-boat.png',
          'assets/adventure-map/lesson54/growth-03-passport-stamps.png',
          'assets/adventure-map/lesson54/growth-04-supplies.png',
          'assets/adventure-map/lesson54/growth-05-celebration.png'
        ],
        stageReveals: [
          { title: '东方环球仪', copy: '港站前立起了新的环球仪！' },
          { title: '远航小帆船', copy: '蓝绿色小帆船驶到了拱门旁！' },
          { title: '三色盖章台', copy: '旅行印章、罗盘和印台都准备好了！' },
          { title: '远航补给车', copy: '篮子、行李和地图装满了补给车！' },
          { title: '环球远航庆典', copy: '翠绿彩旗和暖灯照亮港站，远航罗盘徽章也收藏进图鉴！' }
        ],
        mobilePreview: 'assets/adventure-map/lesson54/mobile-preview.png',
        regressionTest: 'tests/e2e/l54-progress.spec.js'
      }
    }),
    plannedLesson(55),
    plannedLesson(56),
    plannedLesson(57, { directoryVisible: false }),
    plannedLesson(58, { directoryVisible: false }),
    plannedLesson(59, { directoryVisible: false }),
    plannedLesson(60, { directoryVisible: false }),
    {
      id: 'soundmark',
      kind: 'special',
      lesson: null,
      courseStatus: 'published',
      directoryVisible: true,
      route: '/soundmark/',
      entry: 'soundmark/index.html',
      assetDirectories: ['soundmark/audio'],
      title: '音标魔法乐园',
      subtitle: 'Phonics Magic · 音标第一课',
      description: '音标是单词的“拼音”！跟着元音精灵学发音、玩音节魔法、上对比擂台，看到生词也能自己试着读。',
      features: ['元音精灵', '音节魔法', '对比擂台', '游戏乐园', '结业证书'],
      art: '/assets/home/soundmark-phonics.png',
      tone: 'orange',
      progress: {
        key: 'canran:soundmark:progress:v2',
        legacyKey: 'phonics-magic-stars-v1',
        ids: [...SOUND_STAGE_IDS],
        legacyMode: 'reset',
        max: 12
      },
      map: createSpecialMap({
        declaredStatus: 'published',
        baseAsset: 'assets/adventure-map/soundmark/landmark-base.png',
        growthAssets: [
          'assets/adventure-map/soundmark/growth-01-vowel-crystals.png',
          'assets/adventure-map/soundmark/growth-02-magic-book.png',
          'assets/adventure-map/soundmark/growth-03-listening-horns.png',
          'assets/adventure-map/soundmark/growth-04-star-balcony.png'
        ],
        stageReveals: [
          { title: '元音水晶环', copy: '五彩发音水晶围着塔门亮起来了！' },
          { title: '音节魔法书', copy: '空白魔法书学会了记录声音波纹！' },
          { title: '双耳听音号', copy: '两只听音号用金色声波连在一起！' },
          { title: '星光旋梯', copy: '塔边长出了星光旋梯，元音星徽也收藏进图鉴！' }
        ],
        souvenir: {
          id: 'vowel-star-badge',
          title: '元音星徽',
          asset: 'assets/adventure-map/soundmark/vowel-star-badge.png'
        },
        mobilePreview: 'assets/adventure-map/soundmark/mobile-preview.png',
        regressionTest: 'tests/e2e/soundmark-progress.spec.js'
      }),
    }
  ]);

  const PUBLISHED_COURSES = deepFreeze(
    COURSES.filter(course => course.courseStatus === 'published')
  );
  const HOME_COURSES = deepFreeze(
    COURSES.filter(course => course.directoryVisible)
  );
  const MAP_COURSES = deepFreeze(
    COURSES.filter(course => course.map.v1Visible)
  );
  function requirePublishedCourse(id) {
    const course = PUBLISHED_COURSES.find(candidate => candidate.id === id);
    if (!course) throw new Error(`published course not found: ${id}`);
    return course;
  }
  // Shared teaching definitions may outlive their public course entry.
  function requireCourseDefinition(id) {
    const course = COURSES.find(candidate => candidate.id === id);
    if (!course) throw new Error(`course definition not found: ${id}`);
    return course;
  }

  function assessLearningLocation(course) {
    if (!course || course.map?.v1Visible !== true) {
      return deepFreeze({
        status: 'not-applicable',
        route: null,
        recommendable: false,
        checklist: null,
        missing: []
      });
    }

    const progressIds = Array.isArray(course.progress?.ids) ? course.progress.ids : [];
    const stages = Array.isArray(course.map.stages) ? course.map.stages : [];
    const growthAssets = stages.map(stage => stage?.growthAsset);
    const stateAssets = Array.isArray(course.map.stateAssets) ? course.map.stateAssets : [];
    const statePaths = stateAssets.flatMap(landmarkStatePaths);
    const checklist = {
      coursePage: course.courseStatus === 'published' &&
        isPublicRoute(course.route) && isRelativePublicPath(course.entry),
      prerecordedAudio: course.courseStatus === 'published' &&
        Array.isArray(course.assetDirectories) &&
        course.assetDirectories.some(directory => (
          isRelativePublicPath(directory) && directory.endsWith('/audio')
        )),
      stageMapping: stages.length === progressIds.length && stages.length > 0 &&
        stages.every((stage, index) => stage?.progressId === progressIds[index]),
      renderingMode: course.map.landmarkMode === 'states',
      authoringSources: isMapImagePath(course.map.baseAsset) &&
        stages.length === progressIds.length &&
        growthAssets.every(isMapImagePath) &&
        new Set(growthAssets).size === growthAssets.length &&
        !growthAssets.includes(course.map.baseAsset),
      stateSnapshots: stateAssets.length === stages.length + 1 &&
        stateAssets.every((state, index) => isLandmarkStateAsset(state, index)) &&
        new Set(statePaths).size === statePaths.length,
      revealCopy: stages.every(stage => (
        typeof stage?.revealTitle === 'string' && stage.revealTitle.trim() &&
        typeof stage?.revealCopy === 'string' && stage.revealCopy.trim()
      )),
      souvenir: isMapImagePath(course.map.souvenir?.asset) &&
        course.map.souvenir.asset !== course.map.baseAsset &&
        !growthAssets.includes(course.map.souvenir.asset) &&
        !statePaths.includes(course.map.souvenir.asset),
      mobilePreview: isMapImagePath(course.map.mobilePreview) &&
        course.map.mobilePreview !== course.map.baseAsset &&
        course.map.mobilePreview !== course.map.souvenir?.asset &&
        !growthAssets.includes(course.map.mobilePreview) &&
        !statePaths.includes(course.map.mobilePreview),
      regressionVerification: isRegressionTestPath(course.map.regressionTest)
    };
    const missing = Object.entries(checklist)
      .filter(([, complete]) => !complete)
      .map(([item]) => item);
    const published = course.map.declaredStatus === 'published' && missing.length === 0;
    return deepFreeze({
      status: published ? 'published' : 'drawing',
      route: published ? course.route : null,
      recommendable: published,
      checklist,
      missing
    });
  }

  function directoryMapStatus(course) {
    if (!course || course.kind !== 'lesson' || !Number.isInteger(course.lesson)) {
      return 'not-applicable';
    }
    if (!isV1MapLesson(course.lesson)) return 'v2';
    return assessLearningLocation(course).status === 'published'
      ? 'published'
      : 'drawing';
  }

  function hasNotApplicableMapContract(map) {
    return map?.districtId === null &&
      map.v1Visible === false &&
      map.declaredStatus === 'not-applicable' &&
      map.landmarkMode === null &&
      map.baseAsset === null &&
      Array.isArray(map.stateAssets) && map.stateAssets.length === 0 &&
      Array.isArray(map.stages) && map.stages.length === 0 &&
      map.souvenir === null &&
      map.mobilePreview === null &&
      map.regressionTest === null;
  }

  function validateCatalog(courses) {
    if (!Array.isArray(courses)) return Object.freeze(['catalog must be an array']);

    const errors = [];
    const districtIds = new Set(DISTRICTS.map(district => district.id));
    const seen = {
      id: new Map(),
      lesson: new Map(),
      route: new Map(),
      entry: new Map(),
      progressKey: new Map()
    };
    function register(field, value, id) {
      if (value === null || value === undefined) return;
      if (seen[field].has(value)) {
        errors.push(`${id}: duplicate ${field === 'progressKey' ? 'progress key' : field} ${value} (already used by ${seen[field].get(value)})`);
      } else {
        seen[field].set(value, id);
      }
    }

    courses.forEach((course, index) => {
      if (!course || typeof course !== 'object' || Array.isArray(course)) {
        errors.push(`course[${index}]: must be an object`);
        return;
      }
      const id = typeof course.id === 'string' && /^[a-z0-9-]+$/.test(course.id)
        ? course.id
        : `course[${index}]`;
      if (id.startsWith('course[')) errors.push(`${id}: invalid id`);
      register('id', course.id, id);

      if (!['lesson', 'special'].includes(course.kind)) {
        errors.push(`${id}: kind must be lesson or special`);
      }
      if (!['published', 'planned'].includes(course.courseStatus)) {
        errors.push(`${id}: courseStatus must be published or planned`);
      }
      if (typeof course.directoryVisible !== 'boolean') {
        errors.push(`${id}: directoryVisible must be boolean`);
      }
      if (typeof course.title !== 'string' || !course.title) errors.push(`${id}: title is required`);
      if (!Array.isArray(course.features)) errors.push(`${id}: features must be an array`);

      if (course.kind === 'lesson') {
        if (!Number.isInteger(course.lesson) || course.lesson < 1 || course.lesson > 144) {
          errors.push(`${id}: lesson must be an integer from 1 through 144`);
        } else {
          register('lesson', course.lesson, id);
        }
      } else if (course.kind === 'special' && course.lesson !== null) {
        errors.push(`${id}: special course lesson must be null`);
      }

      if (course.courseStatus === 'published') {
        if (!isPublicRoute(course.route)) errors.push(`${id}: published course route is invalid`);
        if (!isRelativePublicPath(course.entry)) errors.push(`${id}: published course entry is invalid`);
        if (!Array.isArray(course.assetDirectories) || course.assetDirectories.length === 0 ||
          !course.assetDirectories.every(isRelativePublicPath)) {
          errors.push(`${id}: published course assetDirectories are invalid`);
        }
        if (!course.progress || typeof course.progress !== 'object') {
          errors.push(`${id}: published course progress is required`);
        } else {
          if (typeof course.progress.key !== 'string' || !course.progress.key) {
            errors.push(`${id}: progress key is required`);
          }
          if (!Array.isArray(course.progress.ids) || course.progress.ids.length === 0 ||
            new Set(course.progress.ids).size !== course.progress.ids.length) {
            errors.push(`${id}: progress ids must be a non-empty unique array`);
          }
          if (!Number.isFinite(course.progress.max) || course.progress.max <= 0) {
            errors.push(`${id}: progress max must be positive`);
          }
        }
      } else if (course.courseStatus === 'planned') {
        if (course.route !== null || course.entry !== null) {
          errors.push(`${id}: planned course cannot expose a route or entry`);
        }
        if (!Array.isArray(course.assetDirectories) || course.assetDirectories.length !== 0) {
          errors.push(`${id}: planned course cannot declare public asset directories`);
        }
        if (course.progress !== null) errors.push(`${id}: planned course cannot create progress storage`);
      }

      if (isPublicRoute(course.route)) register('route', course.route, id);
      if (isRelativePublicPath(course.entry)) register('entry', course.entry, id);
      if (typeof course.progress?.key === 'string' && course.progress.key) {
        register('progressKey', course.progress.key, id);
      }

      if (!course.map || typeof course.map !== 'object') {
        errors.push(`${id}: map contract is required`);
        return;
      }
      if (course.kind === 'lesson') {
        const belongsToV1Map = isV1MapLesson(course.lesson);
        if (belongsToV1Map) {
          if (typeof course.map.districtId !== 'string' || !course.map.districtId) {
            errors.push(`${id}: V1 map lesson districtId is required`);
          } else if (!districtIds.has(course.map.districtId)) {
            errors.push(`${id}: unknown V1 map districtId ${course.map.districtId}`);
          } else if (course.map.districtId !== LAUNCH_DISTRICT.id) {
            errors.push(`${id}: Lesson 49-60 must belong to ${LAUNCH_DISTRICT.id}`);
          }
          if (course.map.v1Visible !== true) errors.push(`${id}: Lesson 49-60 must be V1-visible`);
          if (!['drawing', 'published'].includes(course.map.declaredStatus)) {
            errors.push(`${id}: V1 map declaredStatus must be drawing or published`);
          }
          if (course.map.declaredStatus === 'published') {
            const assessment = assessLearningLocation(course);
            if (assessment.status !== 'published') {
              errors.push(`${id}: published map contract missing ${assessment.missing.join(', ')}`);
            }
          }
        } else if (!hasNotApplicableMapContract(course.map)) {
          errors.push(`${id}: lessons outside 49-60 must use a not-applicable map contract`);
        }
      } else if (course.map.v1Visible === true) {
        if (course.map.districtId !== LAUNCH_DISTRICT.id) {
          errors.push(`${id}: special course must belong to ${LAUNCH_DISTRICT.id}`);
        }
        if (course.map.declaredStatus === 'published') {
          const assessment = assessLearningLocation(course);
          if (assessment.status !== 'published') {
            errors.push(`${id}: published map contract missing ${assessment.missing.join(', ')}`);
          }
        }
      } else if (!hasNotApplicableMapContract(course.map)) {
        errors.push(`${id}: special course map must be published or not-applicable`);
      }

    });

    return Object.freeze(errors);
  }

  function assertValidCatalog(courses) {
    const errors = validateCatalog(courses);
    if (errors.length) {
      throw new Error(`course catalog contract failed:\n- ${errors.join('\n- ')}`);
    }
    return courses;
  }

  assertValidCatalog(COURSES);

  return Object.freeze({
    MAP_STATE_VERSION,
    DISTRICTS,
    LAUNCH_DISTRICT,
    COURSES,
    PUBLISHED_COURSES,
    requireCourseDefinition,
    HOME_COURSES,
    MAP_COURSES,
    createLessonMap,
    createSpecialMap,
    mapStateAssetUrl,
    publicAssetUrl,
    requirePublishedCourse,
    assessLearningLocation,
    directoryMapStatus,
    validateCatalog,
    assertValidCatalog
  });
});
