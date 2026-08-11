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

  function source(sourceId, sourceKind, text, details = {}) {
    return { sourceId, sourceKind, text, required: true, ...details };
  }

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
    lessons,
    landmarkId,
    title,
    status = 'planned',
    contexts,
    targets,
    tasks = [],
    vocabulary = [],
    lessonContent = {},
    microtasksByBeat = {}
  }) {
    const unitId = `FLC-U${String(number).padStart(2, '0')}`;
    const unitTargets = targets.map((definition, index) => target(
      `${unitId}-T${String(index + 1).padStart(2, '0')}`,
      definition.title,
      definition.evidenceModes,
      [...contexts]
    ));
    return {
      unitId,
      districtId: 'first-book-49-60',
      lessonIds: lessons.map(lesson => `lesson${lesson}`),
      landmarkId,
      title,
      status,
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
      lessonContent
    };
  }

  const TEACHING_UNITS = deepFreeze([
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
    const unitIds = new Set();
    const lessonOwners = new Map();
    const targetIds = new Set();
    const taskIds = new Set();
    const microtaskIds = new Set();

    for (const current of units) {
      if (unitIds.has(current.unitId)) errors.push(`${current.unitId} belongs to multiple units`);
      unitIds.add(current.unitId);

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
        if (!Array.isArray(currentTarget.contextIds) || currentTarget.contextIds.length < 2) {
          errors.push(`${currentTarget.targetId} must declare at least two contexts`);
        }
      }

      for (const beat of current.beats || []) {
        const task = beat.task;
        if (!task) {
          if (current.status === 'candidate') {
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

      const authoredMicrotasks = (current.beats || [])
        .flatMap(beat => beat.microtasks || []);
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
        }
      }
      for (const [lessonId, lesson] of Object.entries(current.lessonContent || {})) {
        const sourceIds = new Set(Object.keys(lesson.sources || {}));
        const requiredSourceIds = new Set(lesson.requiredSourceIds || []);
        const lessonTasks = authoredMicrotasks.filter(task => task.lessonId === lessonId);
        const exposed = new Set(lessonTasks.flatMap(task => task.exposureRefs || []));
        const evidenced = new Set(lessonTasks.flatMap(task => task.evidenceRefs || []));

        for (const sourceId of requiredSourceIds) {
          if (!sourceIds.has(sourceId)) {
            errors.push(`${sourceId} required source is missing from ${lessonId}`);
            continue;
          }
          if (!exposed.has(sourceId)) {
            errors.push(`${sourceId} requires exposure coverage in ${lessonId}`);
          }
          if (!evidenced.has(sourceId)) {
            errors.push(`${sourceId} requires evidence coverage in ${lessonId}`);
          }
        }

        for (const task of lessonTasks) {
          for (const sourceId of [...(task.exposureRefs || []), ...(task.evidenceRefs || [])]) {
            if (!sourceIds.has(sourceId)) {
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
    getTeachingUnit,
    getTeachingUnitForLesson,
    listTeachingUnitsForDistrict,
    validate
  });
});
