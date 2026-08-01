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

  function isMapImagePath(value) {
    return isRelativePublicPath(value) &&
      value.startsWith('assets/') &&
      /\.(?:avif|png|webp)$/i.test(value);
  }

  function isRegressionTestPath(value) {
    return isRelativePublicPath(value) &&
      /^tests\/e2e\/[a-z0-9][a-z0-9/_-]*\.spec\.js$/.test(value);
  }

  function isPublicRoute(value) {
    return typeof value === 'string' && /^\/[a-z0-9-]+\/$/.test(value);
  }

  const LESSON_STAGE_IDS = ['l1', 'l2', 'l3', 'l4', 'l5'];
  const SOUND_STAGE_IDS = ['vs', 'g1', 'g2', 'g3'];
  const DISTRICTS = deepFreeze([
    { id: 'first-book-1-12', order: 1, title: '晨光原野', lessonStart: 1, lessonEnd: 12, v1Accessible: false },
    { id: 'first-book-13-24', order: 2, title: '回声溪谷', lessonStart: 13, lessonEnd: 24, v1Accessible: false },
    { id: 'first-book-25-36', order: 3, title: '单词花园', lessonStart: 25, lessonEnd: 36, v1Accessible: false },
    { id: 'first-book-37-48', order: 4, title: '故事港湾', lessonStart: 37, lessonEnd: 48, v1Accessible: false },
    { id: 'first-book-49-60', order: 5, title: '暖灯集市', lessonStart: 49, lessonEnd: 60, v1Accessible: true },
    { id: 'first-book-61-72', order: 6, title: '四季丘陵', lessonStart: 61, lessonEnd: 72, v1Accessible: false },
    { id: 'first-book-73-84', order: 7, title: '环球车站', lessonStart: 73, lessonEnd: 84, v1Accessible: false },
    { id: 'first-book-85-96', order: 8, title: '句型山城', lessonStart: 85, lessonEnd: 96, v1Accessible: false },
    { id: 'first-book-97-108', order: 9, title: '阅读森林', lessonStart: 97, lessonEnd: 108, v1Accessible: false },
    { id: 'first-book-109-120', order: 10, title: '表达海湾', lessonStart: 109, lessonEnd: 120, v1Accessible: false },
    { id: 'first-book-121-132', order: 11, title: '写作星原', lessonStart: 121, lessonEnd: 132, v1Accessible: false },
    { id: 'first-book-133-144', order: 12, title: '冠军广场', lessonStart: 133, lessonEnd: 144, v1Accessible: false }
  ]);
  const LAUNCH_DISTRICT = DISTRICTS.find(district => district.v1Accessible);

  function lessonMap({
    souvenir = null,
    declaredStatus = 'drawing',
    baseAsset = null,
    growthAssets = [],
    mobilePreview = null,
    regressionTest = null
  } = {}) {
    return {
      districtId: LAUNCH_DISTRICT.id,
      v1Visible: true,
      declaredStatus,
      baseAsset,
      stages: LESSON_STAGE_IDS.map((progressId, index) => ({
        progressId,
        growthAsset: growthAssets[index] || null
      })),
      souvenir,
      mobilePreview,
      regressionTest
    };
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
    mapPublication = {}
  }) {
    const id = `lesson${lesson}`;
    const progress = {
      key: `canran:l${lesson}:progress:v2`,
      ids: [...LESSON_STAGE_IDS],
      max: 15
    };
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
      map: lessonMap({ souvenir, ...mapPublication })
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
      map: lessonMap()
    };
  }

  const COURSES = deepFreeze([
    publishedLesson({
      lesson: 49,
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
        baseAsset: 'assets/adventure-map/lesson49/base.png',
        growthAssets: LESSON_STAGE_IDS.map((_, index) => (
          `assets/adventure-map/lesson49/growth-${index + 1}.png`
        )),
        mobilePreview: 'assets/adventure-map/lesson49/mobile-preview.png',
        regressionTest: 'tests/e2e/lesson49-map.spec.js'
      }
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
      legacyMode: 'ratings'
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
      legacyMode: 'reset'
    }),
    publishedLesson({
      lesson: 52,
      title: '环球护照之旅 Ⅰ',
      subtitle: 'What Nationality Are They?',
      description: '第一卷·欧美篇：走遍 12 个欧美国家，跟签证官学国家和国籍、听机场广播、玩盖章配对，成为环球小使者！',
      features: ['国家国籍', '机场广播', '盖章配对', '动词小尾巴', '海关考核'],
      art: '/assets/home/lesson52-passport.svg',
      tone: 'blue'
    }),
    plannedLesson(53),
    publishedLesson({
      lesson: 54,
      title: '环球护照之旅 Ⅱ',
      subtitle: 'What Nationality Are They?',
      description: '第二卷·亚非大洋洲篇：再走 12 个国家，练习国籍句型，还有 does 疑问否定小魔法。',
      features: ['国家国籍', '机场广播', '盖章配对', 'does 魔法', '海关考核'],
      art: '/assets/home/lesson54-passport.svg',
      tone: 'green'
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
      map: {
        districtId: null,
        v1Visible: false,
        declaredStatus: 'not-applicable',
        baseAsset: null,
        stages: [],
        souvenir: null,
        mobilePreview: null,
        regressionTest: null
      }
    }
  ]);

  const PUBLISHED_COURSES = deepFreeze(
    COURSES.filter(course => course.courseStatus === 'published')
  );
  const HOME_COURSES = deepFreeze(
    COURSES.filter(course => course.directoryVisible)
  );
  const MAP_COURSES = deepFreeze(
    COURSES.filter(course => course.kind === 'lesson' && course.map.v1Visible)
  );

  function requirePublishedCourse(id) {
    const course = PUBLISHED_COURSES.find(candidate => candidate.id === id);
    if (!course) throw new Error(`published course not found: ${id}`);
    return course;
  }

  function assessLearningLocation(course) {
    if (!course || course.kind !== 'lesson' || course.map?.v1Visible !== true) {
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
    const checklist = {
      coursePage: course.courseStatus === 'published' &&
        isPublicRoute(course.route) && isRelativePublicPath(course.entry),
      prerecordedAudio: course.courseStatus === 'published' &&
        Array.isArray(course.assetDirectories) &&
        course.assetDirectories.some(directory => (
          isRelativePublicPath(directory) && directory.endsWith('/audio')
        )),
      stageMapping: stages.length === 5 && progressIds.length === 5 &&
        stages.every((stage, index) => stage?.progressId === progressIds[index]),
      baseLandmark: isMapImagePath(course.map.baseAsset),
      growthLayers: stages.length === 5 &&
        growthAssets.every(isMapImagePath) &&
        new Set(growthAssets).size === growthAssets.length &&
        !growthAssets.includes(course.map.baseAsset),
      souvenir: isMapImagePath(course.map.souvenir?.asset) &&
        course.map.souvenir.asset !== course.map.baseAsset &&
        !growthAssets.includes(course.map.souvenir.asset),
      mobilePreview: isMapImagePath(course.map.mobilePreview) &&
        course.map.mobilePreview !== course.map.baseAsset &&
        course.map.mobilePreview !== course.map.souvenir?.asset &&
        !growthAssets.includes(course.map.mobilePreview),
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
        const belongsToV1Map = Number.isInteger(course.lesson) && course.lesson >= 49 && course.lesson <= 60;
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
        } else if (
          course.map.districtId !== null ||
          course.map.v1Visible !== false ||
          course.map.declaredStatus !== 'not-applicable'
        ) {
          errors.push(`${id}: lessons outside 49-60 must be excluded from the V1 map`);
        }
      } else if (
        course.map.districtId !== null ||
        course.map.v1Visible !== false ||
        course.map.declaredStatus !== 'not-applicable'
      ) {
        errors.push(`${id}: special course map must be not-applicable`);
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
    DISTRICTS,
    LAUNCH_DISTRICT,
    COURSES,
    PUBLISHED_COURSES,
    HOME_COURSES,
    MAP_COURSES,
    requirePublishedCourse,
    assessLearningLocation,
    validateCatalog,
    assertValidCatalog
  });
});
