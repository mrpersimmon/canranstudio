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
    vocabulary = []
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
        if (!authored) return { ...beat };
        return {
          ...beat,
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
      vocabulary
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
      ]
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
