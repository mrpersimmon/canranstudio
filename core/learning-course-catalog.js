/* Authored continuous course. Textbook wording and recordings stay in curriculum-catalog. */
(function attach(root, factory) {
  'use strict';
  const api = factory(typeof module === 'object' && module.exports ? require('./curriculum-catalog') : root.CanranCore.curriculumCatalog);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) (root.CanranCore ||= {}).learningCourseCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (catalog) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const freeze = value => { if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };

  function getCourse() {
    const baseline = clone(catalog.getPathExperience());
    const units = ['NCE-U02', 'NCE-U03'].map(id => catalog.getTeachingUnit(id));
    const course = { ...baseline, unitId: 'NCE-STARTER-06', courseId: 'nce-book1', title: '猫猫小镇', lessonIds: [1, 2, 3, 4, 5, 6],
      experienceRevision: 'lesson1-6-v4.0', recordSchema: 4, compatibleProgressRevisions: [], previousRevisionContracts: {},
      previousActivityContracts: {}, publicationScope: 'local-candidate', chapters: [
        { id: 'found', title: '帮物品找主人', lessonIds: [1, 2] },
        { id: 'umbrella', title: '拿错了，怎么办？', lessonIds: [3, 4] },
        { id: 'friends', title: '认识新朋友', lessonIds: [5] },
        { id: 'describe', title: '说说人和物', lessonIds: [6] }
      ], sourceActors: {}, referenceGroups: [],
      progressImports: [{ storageKey: 'poc:learning-path:NCE-U01:lesson1-2-v3.6', contract: {
        unitId: baseline.unitId, experienceRevision: baseline.experienceRevision, recordSchema: baseline.recordSchema,
        activities: clone(baseline.activities), legacyRolePractice: clone(baseline.legacyRolePractice)
      } }],
      copy: { ...baseline.copy, lessonLabel: '新概念英语 · Lesson 1–6', pathBody: '', ariaProgress: '已保存的学习进度',
        sceneLabel: '猫猫一起学英语', reviewTitle: '今日复习', reviewStart: '开始复习', reviewDone: '复习完成啦',
        reviewBody: '几道题，记得更牢。', reviewEmpty: '学过的内容会在这里再见面', references: '课本回顾', referenceBack: '返回路线',
        completedTitle: '小镇初次探险完成！', nextNode: '下一关', chapterLabel: '主题', listenExample: '听例句',
        legacyMessage: '前两课的学习记录已保留。' }, speakerLabels: { 'L05-D02': '同学们' }
    };
    // The latest two-cat course is an immutable input; existing activity IDs retain their meaning.
    course.nodes.forEach(n => { n.chapterId = 'found'; n.lessonIds = n.id === 'K01' ? [1] : [2]; });
    for (const u of units) {
      Object.assign(course.lessonContent, clone(u.lessonContent));
      for (const lesson of Object.values(u.lessonContent)) Object.assign(course.sources, clone(lesson.sources));
    }
    const s = course.sources, a = course.activities, e = course.entities;
    e['station-keeper'].align = 'left'; e['handbag-owner'].align = 'right';
    const cat = (id, title, image, pronoun, align = 'right') => {
      e[id] = { entityId: id, title, characterSpecies: 'cat', assetSrc: image, deliveryBackground: 'white', pronoun, align };
    };
    const art = id => '/poc/learning-path/assets/cats/' + id + (id === 'hans' ? '-v2.webp' : '-v1.webp');
    for (const name of ['book','chevron-up','chevron-down']) course.icons[name] = '/poc/learning-path/assets/icons/'+name+'.svg';
    cat('mr-blake', 'Mr. Blake', art('mr-blake'), 'he', 'left');
    cat('sophie', 'Sophie', e['handbag-owner'].assetSrc, 'she');
    for (const [id, title, pronoun] of [['hans','Hans','he'], ['naoko','Naoko','she'], ['changwoo','Chang-woo','he'], ['luming','Luming','he'], ['xiaohui','Xiaohui','she']]) cat(id, title, art(id), pronoun);
    cat('cloak-attendant', '服务员猫', e['handbag-owner'].assetSrc, 'she', 'left');
    cat('umbrella-visitor', '顾客猫', art('hans'), 'he');
    for (const u of units) for (const [id, entity] of Object.entries(u.entities)) {
      if (!e[id] && !['character', 'person-card', 'guide'].includes(entity.kind)) {
        e[id] = { entityId: id, title: entity.label, assetSrc: entity.assets.webp || entity.assets.preferred, deliveryBackground: 'white' };
      }
    }
    e.teacher = { ...e['mr-blake'], entityId: 'teacher', title: '老师' };
    e.son = { ...e.hans, entityId: 'son', title: '儿子', relationship: '父母的男孩' };
    e.daughter = { ...e.xiaohui, entityId: 'daughter', title: '女儿', relationship: '父母的女孩' };
    e.cloakroom = { entityId: 'cloakroom', title: '衣帽间', assetSrc: '/poc/learning-path/assets/props/cloakroom-v1.webp', deliveryBackground: 'white' };
    e['school'].title = '学校';
    const originalLine = ref => ({ ref, text: s[ref].text, src: s[ref].audioSrc, speaker: s[ref].speaker || null });
    const textOption = (text, lang = 'en') => {
      const id = 'C06-TEXT:' + text;
      s[id] ||= { sourceId: id, text, sourceKind: 'course-authored', coveragePolicy: 'support' };
      return { id, type: 'text', text, lang };
    };
    const pictures = ids => ids.map(id => ({ id, type: 'image', entityId: id }));
    const base = (id, kind, title, refs = []) => ({ id, kind, title, instruction: '', sourceRefs: refs, noteRefs: [],
      options: [], answer: [], requiredAudio: [], feedbackAudio: [], hints: [], channel: 'meaning', audioType: 'sentence' });
    const assess = (skill, label, cue = 'visible-context', support = 'answer-options', scope = 'assessment') => ({
      skill, label, cue, support, scope, evidenceMode: scope === 'practice' ? 'matched-with-options' : 'selected-in-context',
      boundary: '记录本次任务的理解或组织表现，不等同于无提示口语表达。'
    });
    function choice(id, title, refs, opts, answer, extras = {}) {
      a[id] = { ...base(id, 'choice', title, refs), resultId: id + ':result', targetId: extras.targetId || id,
        options: opts, answer: [answer], assessment: assess('meaning-in-context', '理解表达'),
        hints: ['看看这句话在说谁、说什么。', '可以重听，或再看一下刚才的提示。'], ...extras };
      return id;
    }
    function words(id, title, items, extras = {}) {
      a[id] = { ...base(id, 'teach', title, items.map(item => item.sourceRef)), audioType: 'word', playbackMode: 'manual-cards',
        items, requiredAudio: items.map(item => originalLine(item.sourceRef)), ...extras };
      return id;
    }
    function question(id, title, sourceRef, opts, correct, extras = {}) {
      return choice(id, title, [sourceRef], opts, correct, { channel: 'audio-only', requiredAudio: [originalLine(sourceRef)],
        feedbackAudio: [originalLine(sourceRef)], feedbackPlayback: 'support-only', feedbackText: s[sourceRef].text,
        assessment: assess('listening-meaning', '听懂表达', 'audio-only'), ...extras });
    }
    function order(id, title, sourceRef, chunks, extras = {}) {
      const opts = chunks.map(x => textOption(x));
      a[id] = { ...base(id, 'order', title, [sourceRef]), options: opts, answer: opts.map(x => x.id), resultId: id + ':result',
        targetId: id, hints: ['先说“这”，再说它是不是我的。', s[sourceRef].text],
        feedbackAudio: [originalLine(sourceRef)], feedbackText: s[sourceRef].text,
        assessment: assess('supported-assembly', '词块组句', 'communicative-intent', 'word-bank'), ...extras };
      return id;
    }
    function story(id, title, rows, checks, extras = {}) {
      const beats = [];
      for (const row of rows) {
        const [ref, actorEntityId, visibleActorIds, focusEntityId, noteRef] = row;
        course.sourceActors[ref] = actorEntityId;
        beats.push({ id: id + ':' + ref, kind: 'line', ref, actorEntityId, visibleActorIds, focusEntityId, ...(noteRef ? { noteRef } : {}) });
        for (const q of checks.filter(q => q.after === ref)) {
          a[q.activityId].embeddedIn = id;
          // These answers depend on the unfolding story. Spaced review uses
          // standalone variants with a complete audio cue instead.
          a[q.activityId].reviewEligible = false;
          beats.push({ id: id + ':' + q.activityId, kind: 'checkpoint', activityId: q.activityId,
            visibleActorIds: q.cast || visibleActorIds, focusEntityId: q.focus || focusEntityId });
        }
      }
      a[id] = { ...base(id, 'interactive-story', title, rows.map(r => r[0])), actorEntityIds: [...new Set(rows.flatMap(r => r[2]))],
        focusEntityId: null, beats, ...extras };
      return id;
    }
    function node(id, title, chapterId, lessonIds, ids, extras = {}) {
      course.nodes.push({ id, title, chapterId, lessonIds, icon: 'chat-dots', duration: '约 3–5 分钟', activityIds: ids,
        completionTitle: '又学会了一点！', checkpointIds: [id], ...extras });
      for (const aid of ids) {
        Object.assign(a[aid], { nodeId: id, checkpointId: id });
        for (const beat of a[aid].beats || []) if (beat.kind === 'checkpoint') Object.assign(a[beat.activityId], { nodeId: id, checkpointId: id });
      }
    }

    // An incorrect handover is repaired in the story, with each spoken turn advanced by a click.
    words('C06:cloak-words', '先认三个词', [
      { sourceRef:'L03-W01', entityId:'umbrella-stripe', caption:'雨伞' },
      { sourceRef:'L03-W05', entityId:'ticket-five', caption:'寄存物品的号码牌' },
      { sourceRef:'L03-W10', entityId:'cloakroom', caption:'寄存外套和雨伞的地方' }
    ]);
    choice('C06:umbrella-repair', '顾客希望怎么办？', ['L03-D06'], [textOption('换一把伞','zh'),textOption('直接带走','zh')], textOption('换一把伞','zh').id,
      { hints:['他说这不是自己的伞。','not my umbrella：不是我的伞。'], wrongFeedback:'这把伞不是他的，还要继续找。', targetId:'ownership:negation' });
    choice('C06:umbrella-no', '这次找到对的了吗？', ['L03-D09'], [textOption('还没找到','zh'),textOption('找到了','zh')], textOption('还没找到','zh').id,
      { hints:['注意他说的是 Yes 还是 No。','No, it isn’t. 表示“不是”。'], wrongFeedback:'顾客说 No，还没有找到。', targetId:'short-answer:negative' });
    choice('C06:umbrella-owner', '现在交给谁？', ['L03-D11'], pictures(['cloak-attendant','umbrella-visitor']), 'umbrella-visitor',
      { castChoice:true, storyFact:'umbrella-returned', hints:['谁确认了“是我的”？','顾客说 Yes, it is.，可以交给他了。'], targetId:'ownership:confirmation' });
    const cloakCast = ['cloak-attendant','umbrella-visitor'];
    const cloakActors = ['umbrella-visitor','umbrella-visitor','cloak-attendant','cloak-attendant','cloak-attendant','umbrella-visitor','cloak-attendant','cloak-attendant','umbrella-visitor','cloak-attendant','umbrella-visitor','umbrella-visitor'];
    story('C06:umbrella-story','拿错雨伞了',cloakActors.map((actor,i) => ['L03-D'+String(i+1).padStart(2,'0'),actor,cloakCast,
      i < 4 ? 'ticket-five' : i < 7 ? 'umbrella-dot' : i < 9 ? 'umbrella-stripe' : 'umbrella-star',
      ({4:'L03-N01',6:'L03-N02',9:'L03-N04'})[i]]),[
      {after:'L03-D06',activityId:'C06:umbrella-repair'},
      {after:'L03-D09',activityId:'C06:umbrella-no'},
      {after:'L03-D11',activityId:'C06:umbrella-owner'}
    ],{returnFact:'umbrella-returned',instructionRefs:['L03-I01'],meaningRefs:['L03-Q01']});
    node('C04','雨伞拿错了','umbrella',[3],['C06:cloak-words','C06:umbrella-story'],{completionTitle:'雨伞终于找对了'});

    words('C06:new-places','换个地方问问',[
      {sourceRef:'L04-W01',entityId:'suit'}, {sourceRef:'L04-W02',entityId:'school'}, {sourceRef:'L04-W03',entityId:'teacher'}
    ]);
    words('C06:family','认识家人',[
      {sourceRef:'L04-W04',entityId:'son',caption:'儿子 · 父母的男孩'},
      {sourceRef:'L04-W05',entityId:'daughter',caption:'女儿 · 父母的女孩'}
    ]);
    order('C06:not-mine','告诉她：这不是我的伞','L03-D06',['This','is','not','my','umbrella.'],{focusEntityId:'umbrella-dot'});
    question('C06:whose-suit','他在询问什么？','L04-P11',[textOption('是不是你的西装','zh'),textOption('是不是我的西装','zh')],textOption('是不是你的西装','zh').id,
      {hints:['注意 your。','your 是“你的”。'],targetId:'ownership:your'});
    question('C06:family-meaning','他在问哪位家人？','L04-P15',[textOption('女儿','zh'),textOption('儿子','zh'),textOption('老师','zh')],textOption('女儿','zh').id,
      {hints:['想想 daughter 的意思。','daughter 是女儿。'],targetId:'family:daughter'});
    node('C05','我的，还是你的？','umbrella',[3,4],['C06:new-places','C06:family','C06:not-mine','C06:whose-suit','C06:family-meaning'],{completionTitle:'也会说明“不是我的”了',icon:'bag'});

    question('C06:review-pardon','没听清时，她会说哪句？','L01-D04',[textOption('请再说一遍','zh'),textOption('谢谢你','zh')],textOption('请再说一遍','zh').id,
      {title:'她希望你怎么做？',hints:['想想 Pardon? 的用法。','请对方重复刚才的话。'],targetId:'repair:pardon'});
    question('C06:review-watch','听一听，选出物品','L04-P04',pictures(['watch','shirt','book']), 'watch',
      {hints:['听问句里提到的物品。','watch 是手表。'],targetId:'objects:watch'});
    question('C06:review-no','他确认了吗？','L03-D09',[textOption('没有','zh'),textOption('确认了','zh')],textOption('没有','zh').id,
      {hints:['注意开头的 No。','No, it isn’t. 是否定回答。'],targetId:'short-answer:negative'});
    question('C06:review-school','听一听，选出意思','L04-P12',[textOption('这是你的学校吗？','zh'),textOption('这是你的老师吗？','zh')],textOption('这是你的学校吗？','zh').id,
      {hints:['区分 school 和 teacher。','school 指学校。'],targetId:'places:school'});
    node('R01','把学过的连起来','umbrella',[1,2,3,4],['C06:review-pardon','C06:review-watch','C06:review-no','C06:review-school'],{kind:'review',icon:'arrow-clockwise',duration:'约 3 分钟',completionTitle:'旧知识，换个地方也会用'});

    const classmates = ['sophie','hans','naoko','changwoo','luming','xiaohui'];
    const actors5 = Array.from({length:20},()=> 'mr-blake');
    for (const [i,id] of [[1,'sophie'],[7,'hans'],[10,'naoko'],[13,'changwoo'],[16,'luming'],[19,'xiaohui']]) actors5[i]=id;
    const face5 = i => i < 5 ? 'sophie' : i < 8 ? 'hans' : i < 11 ? 'naoko' : i < 14 ? 'changwoo' : i < 17 ? 'luming' : 'xiaohui';
    // New classmates are greeting Sophie; keep the addressee on stage.
    const row5 = i => ['L05-D'+String(i+1).padStart(2,'0'),actors5[i],[...new Set(['mr-blake','sophie',face5(i)])],null,({0:'L05-N01',2:'L05-N02',7:'L05-N03'})[i]];
    choice('C06:sophie-new','Sophie 是谁？',['L05-D04'],[textOption('新同学','zh'),textOption('老师','zh')],textOption('新同学','zh').id,
      {hints:['听听 student。','a new student 是新同学。'],targetId:'people:student'});
    choice('C06:hans-greeting','Hans 初次见面会说什么？',['L05-D08'],[textOption('Nice to meet you.'),textOption('Sorry, sir.')],textOption('Nice to meet you.').id,
      {hints:['现在要和新朋友打招呼。','Nice to meet you. 是初次见面的问候。'],targetId:'greeting:first-meeting'});
    choice('C06:naoko-nationality','Naoko 来自哪里？',['L05-D10'],[textOption('日本','zh'),textOption('德国','zh')],textOption('日本','zh').id,
      {hints:['老师刚刚说了 Japanese。','Japanese：日本的／日本人。'],targetId:'nationality:japanese'});
    story('C06:friends-first','新同学来了',Array.from({length:11},(_,i)=>row5(i)),[
      {after:'L05-D04',activityId:'C06:sophie-new'},
      {after:'L05-D07',activityId:'C06:hans-greeting'},
      {after:'L05-D10',activityId:'C06:naoko-nationality'}
    ],{instructionRefs:['L05-I01']});
    words('C06:friend-words','记住新朋友',[
      {sourceRef:'L05-W07',entityId:'sophie',caption:'Sophie · 法国人'},
      {sourceRef:'L05-W08',entityId:'hans',caption:'Hans · 德国人'},
      {sourceRef:'L05-W11',entityId:'naoko',caption:'Naoko · 日本人'}
    ]);
    node('C07','新同学来了','friends',[5],['C06:friends-first','C06:friend-words'],{completionTitle:'认识了三位新朋友'});

    choice('C06:changwoo-origin','Chang-woo 是中国人吗？',['L05-D13'],[textOption('不是，他是韩国人','zh'),textOption('是的','zh')],textOption('不是，他是韩国人','zh').id,
      {hints:['老师用了 South Korean。','South Korean 是韩国人。'],targetId:'nationality:south-korean',meaningRefs:['L05-Q01']});
    choice('C06:too','谁也是中国人？',['L05-D16','L05-D19'],pictures(['luming','hans']), 'luming',
      {hints:['留意 Chinese 和 too。','Luming 是中国人，Xiaohui 也是。'],targetId:'meaning:too'});
    story('C06:friends-more','还有谁在班上？',Array.from({length:9},(_,i)=>row5(i+11)),[
      {after:'L05-D13',activityId:'C06:changwoo-origin'},
      {after:'L05-D19',activityId:'C06:too',cast:['luming','xiaohui']}
    ]);
    words('C06:friend-words-more','再记住两个词',[
      {sourceRef:'L05-W12',entityId:'changwoo',caption:'Chang-woo · 韩国人'},
      {sourceRef:'L05-W13',entityId:'luming',caption:'Luming 和 Xiaohui · 中国人'}
    ]);
    question('C06:morning','什么时候这样打招呼？','L05-D01',[textOption('早上见面','zh'),textOption('拿错东西','zh')],textOption('早上见面','zh').id,
      {hints:['morning 表示早晨。','Good morning. 是早上好。'],targetId:'greeting:morning'});
    node('C08','认识更多朋友','friends',[5],['C06:friends-more','C06:friend-words-more','C06:morning'],{completionTitle:'每位新同学都认识了'});

    const cars = [['volvo','瑞典的'],['peugeot','法国的'],['mercedes','德国的'],['toyota','日本的'],['mini','英国的'],['ford','美国的']];
    const carItems = cars.map(([id,country],i)=>({sourceRef:'L06-P'+String(i+1).padStart(2,'0'),entityId:id,caption:country}));
    words('C06:cars-a','这些车来自哪里？',carItems.slice(0,3),{audioType:'sentence',guideRef:textOption('What make is it?').id,guideCaption:'它是什么牌子？'});
    words('C06:cars-b','再看看这三辆',carItems.slice(3),{audioType:'sentence'});
    question('C06:car-listen','听一听，选出名字','L06-W08',[textOption('Toyota'),textOption('Volvo'),textOption('Ford')],textOption('Toyota').id,
      {hints:['重听这个品牌的名字。','Toyota。'],targetId:'make:toyota'});
    choice('C06:make-question','问汽车的品牌，选哪句？',['L06-W01','L06-P01'],[textOption('What make is it?'),textOption('Is this your umbrella?')],textOption('What make is it?').id,
      {focusEntityId:'volvo',hints:['make 在这里是品牌。','What make is it? 问的是什么牌子。'],targetId:'make:question'});
    node('C09','它是什么牌子？','describe',[6],['C06:cars-a','C06:cars-b','C06:car-listen','C06:make-question'],{icon:'house',completionTitle:'听到名字，就知道在说什么'});

    words('C06:pronouns','说人，还是说物？',[
      {sourceRef:'L05-D05',entityId:'sophie',term:'she',caption:'她 · Sophie'},
      {sourceRef:'L05-D07',entityId:'hans',term:'he',caption:'他 · Hans'},
      {sourceRef:'L06-P01',entityId:'volvo',term:'it',caption:'它 · 汽车'}
    ],{audioType:'sentence'});
    for (const [id,title,entity,pronoun,prefix,suffix,ref] of [
      ['she','接着介绍 Naoko','naoko','She','',' is Japanese.','L05-D10'],
      ['he','接着介绍 Luming','luming','He','',' is Chinese.','L05-D16'],
      ['it','接着介绍这辆车','volvo','It','',' is a Volvo.','L06-P01']
    ]) {
      const aid='C06:pronoun-'+id;
      choice(aid,title,[ref],[textOption('He'),textOption('She'),textOption('It')],textOption(pronoun).id,
        {kind:'cloze',focusEntityId:entity,cloze:{prefix,suffix,replyRef:ref,actorId:'mr-blake'},
          hints:['人用 he 或 she，物品可以用 it。',pronoun+' 指代这里的'+(id==='it'?'汽车。':'人物。')],
          feedbackAudio:[originalLine(ref)], feedbackPlayback:'support-only',targetId:'pronoun:'+id,
          assessment:assess('pronoun-reference','代词指代','named-person-or-object','word-options')});
    }
    const negativeRef = textOption('He is not French.').id;
    choice('C06:negative-description','Hans 是德国人，不是法国人',['L05-D07',negativeRef],[
      textOption('not'),textOption('a'),textOption('an')
    ],textOption('not').id,{kind:'cloze',focusEntityId:'hans',cloze:{prefix:'He is ',suffix:' French.',replyRef:negativeRef,actorId:'mr-blake'},
      hints:['“不是”可以用 is not。','把 not 放在 is 后面。'],targetId:'description:negation'});
    const articleGuide = textOption('a French car · an English car').id;
    for (const [id,car,country,article,guide] of [['article-english','mini','English','an',articleGuide],['article-american','ford','American','an',null]]) {
      const ref = textOption('It is an '+country+' car.').id;
      choice('C06:'+id,id==='article-english'?'跟着例子补一句':'再介绍这辆美国车',[ref,'L06-E02'],[textOption('a'),textOption('an')],textOption(article).id,
        {kind:'cloze',focusEntityId:car,guideRef:guide,cloze:{prefix:'It is ',suffix:' '+country+' car.',replyRef:ref,actorId:'mr-blake'},
          hints:['English 和 American 都以元音开头，前面用 an。','an English car；an American car。'],targetId:'article:an-'+country.toLowerCase(),
          assessment:assess('article-in-phrase',guide?'看例子练习':'选择冠词',guide?'visible-example':'named-object','word-options',guide?'practice':'assessment')});
    }
    node('C10','把人和物说清楚','describe',[5,6],['C06:pronouns','C06:pronoun-she','C06:pronoun-he','C06:pronoun-it','C06:negative-description','C06:article-english','C06:article-american'],{completionTitle:'会指代，也会说明“不是”'});

    question('C06:final-ownership','这句话表达了什么？','L03-D06',[textOption('这不是我的伞','zh'),textOption('这是我的伞','zh')],textOption('这不是我的伞','zh').id,
      {hints:['留意 not。','not my umbrella：不是我的伞。'],targetId:'ownership:negation'});
    question('C06:final-greeting','初次见面，他在做什么？','L05-D08',[textOption('打招呼','zh'),textOption('请人重复','zh')],textOption('打招呼','zh').id,
      {hints:['回想认识新同学的故事。','Nice to meet you. 是初次见面的问候。'],targetId:'greeting:first-meeting'});
    question('C06:final-nationality','听一听，选出意思','L06-W04',[textOption('美国的','zh'),textOption('英国的','zh'),textOption('瑞典的','zh')],textOption('美国的','zh').id,
      {hints:['区分 American、English、Swedish。','American 是美国的。'],targetId:'nationality:american'});
    order('C06:final-introduce','介绍 Hans 来自德国','L05-D07',['He','is','German.'],{focusEntityId:'hans',targetId:'pronoun:he'});
    node('R02','小镇综合挑战','describe',[1,2,3,4,5,6],['C06:final-ownership','C06:final-greeting','C06:final-nationality','C06:final-introduce'],{kind:'review',icon:'star-fill',duration:'约 3 分钟',completionTitle:'小镇初次探险完成！'});

    course.checkpointIds = course.nodes.map(n=>n.id);
    course.checkpointActivities = Object.fromEntries(course.nodes.map(n=>[n.id,[...n.activityIds]]));
    course.dialogueRefs = [1,3,5].flatMap(n=>Object.keys(s).filter(ref=>ref.startsWith('L'+String(n).padStart(2,'0')+'-D')));
    course.referenceGroups = Object.entries(course.lessonContent).map(([id,lesson]) => ({
      id, title:'Lesson '+Number(id.replace('lesson','')), sourceRefs:Object.keys(lesson.sources).filter(ref=> /-(D|W|P|N|E)/.test(ref))
    }));
    course.review = { ...course.review, limit: 4, acrossLessons: true };
    course.coverage = { textbookSource: 'curriculum-catalog', duplicateObjects: ['pen','pencil','book','watch','coat','dress','skirt','shirt','car','house'],
      principle: '完整课文逐句进入主线；重复替换例句在课本回顾中保留，主线抽样迁移；提示与回顾不伪造独立掌握。' };
    return freeze(course);
  }

  function validateCourse(course = getCourse()) {
    const errors = [], seen = new Set(), allRefs = new Set();
    const fail = text => errors.push(text);
    if (course.lessonIds.join(',') !== '1,2,3,4,5,6') fail('first six textbook lessons required');
    for (const node of course.nodes) {
      if (seen.has(node.id)) fail('duplicate node '+node.id); seen.add(node.id);
      if (!node.activityIds.length) fail('empty node '+node.id);
      for (const id of node.activityIds) {
        const activity=course.activities[id];
        if (!activity || activity.embeddedIn || activity.nodeId !== node.id) fail('invalid node activity '+id);
      }
    }
    const spoken = [];
    for (const [id,act] of Object.entries(course.activities)) {
      if (id !== act.id || !['choice','teach','match','order','cloze','interactive-story'].includes(act.kind)) fail('unknown activity '+id);
      const refs=[...act.sourceRefs,...(act.noteRefs||[]),...(act.instructionRefs||[]),...(act.meaningRefs||[]),...(act.guideRef?[act.guideRef]:[])];
      for (const ref of refs) { allRefs.add(ref); if (!course.sources[ref]) fail('missing source '+ref); }
      for (const entry of [...act.requiredAudio,...act.feedbackAudio]) if (!course.sources[entry.ref]?.audioSrc) fail('missing audio '+entry.ref);
      if (act.resultId && (!act.assessment || act.kind!=='match' && (!act.answer.length || act.answer.some(x=>!act.options.some(o=>o.id===x))))) fail('invalid answer '+id);
      if (act.options?.some(o=>o.type==='image'&&!course.entities[o.entityId])) fail('missing answer image '+id);
      if (act.kind==='teach' && (act.playbackMode!=='manual-cards'||act.items.some(item=>!course.sources[item.sourceRef]?.audioSrc||!course.entities[item.entityId]))) fail('invalid teaching cards '+id);
      if (act.kind==='interactive-story') {
        const beatIds = new Set();
        for (const beat of act.beats) {
          if (beatIds.has(beat.id)) fail('duplicate story beat '+beat.id); beatIds.add(beat.id);
          if (beat.kind==='line') {
            spoken.push(beat.ref);
            if (!course.sources[beat.ref]?.audioSrc) fail('silent story line '+beat.ref);
            if (course.entities[beat.actorEntityId]?.characterSpecies!=='cat') fail('story actor must be cat '+beat.actorEntityId);
            const expected=course.sourceActors[beat.ref];
            if (expected && expected!==beat.actorEntityId) fail('wrong speaker '+beat.ref);
          } else if (course.activities[beat.activityId]?.embeddedIn!==id) fail('orphan story check '+beat.activityId);
          if (beat.visibleActorIds && (beat.visibleActorIds.length>3 || beat.visibleActorIds.some(x=>!act.actorEntityIds.includes(x)))) fail('invalid visible cast '+beat.id);
        }
      }
    }
    for (const ref of course.dialogueRefs) if (spoken.filter(x=>x===ref).length!==1) fail('original dialogue must occur once '+ref);
    for (const unitId of ['NCE-U01','NCE-U02','NCE-U03']) for (const lesson of Object.values(catalog.getTeachingUnit(unitId).lessonContent)) for (const [ref,source] of Object.entries(lesson.sources)) {
      if (course.sources[ref]?.text!==source.text) fail('textbook text changed '+ref);
    }
    if (!course.nodes.some(n=>n.kind==='review'&&n.lessonIds.length>2)) fail('cross-lesson review required');
    return errors;
  }
  return Object.freeze({getCourse,validateCourse});
});
