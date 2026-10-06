(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit3334;
  const { stages, questions, learning: content } = unit;
  const practice = core.lesson49Practice, scene = core.unit3334Scene;
  const $ = selector => document.querySelector(selector);
  const icon = core.lesson49Icons.create;
  const node = (tag, text = '', className = '') => {
    const element = document.createElement(tag); element.textContent = text; element.className = className; return element;
  };
  function button(text, action, className = 'btn btn-green') {
    const element = node('button', text, className); element.type = 'button'; element.addEventListener('click', action); return element;
  }
  function art(name, label = '') {
    if(name==='keepsake')return scene.art();
    const word = unit.objects.find(word => word.en === name);
    const path = content.PEOPLE[name]?.image || word?.image;
    if (!path) return icon(name, label);
    const picture = node('img', '', 'shop-icon'); picture.src = path; picture.alt = label; return picture;
  }
  const surfaces = new Map();
  const activities = stages.flatMap(stage => stage.activities.map(([id, title]) => ({ id, title, chapter: stage.id })));
  const routes = new Set(['cover', ...stages.map(stage => stage.id), ...activities.map(item => 'learn/' + item.id)]);
  let active = '', certificateView;
  for (const stage of stages) {
    const section = node('section', '', 'shop-chapter'); section.id = stage.id;
    const heading = node('header', '', 'chapter-heading'); heading.append(node('h2', stage.title), node('span', '☆☆☆', 'lvl-stars')); section.append(heading);
    const link = node('a', stage.title); link.href = '#' + stage.id; $('.chapter-links').append(link);
    const option = node('option', stage.title); option.value = stage.id; $('.chapter-select select').append(option);
    for (const [id, title, illustration] of stage.activities) {
      const surface = node('section', '', 'shop-stage stage-' + id); surface.id = 'learn/' + id;
      surface.setAttribute('role', 'region'); surface.setAttribute('aria-label', title);
      const header = node('header', '', 'stage-heading');
      header.append(icon(illustration), node('h3', title), button('怎么玩', () => showHelp(id, title), 'workspace-back'));
      surface.append(header); surfaces.set(id, surface); section.append(surface);
    }
    $('#lessonWorkspace').append(section);
  }
  const navigate = id => {
    // Scrolling back to the cover keeps the hash; resume must still reposition.
    if (location.hash === '#' + id) route();
    else location.hash = id;
  };
  function markLocation(id) {
    if (!routes.has(id)) return;
    if (active !== id) { root.dispatchEvent(new Event('lesson49:leave-activity')); active = id; }
    if (id === 'cover') return;
    practice.activity('unitLocation', id);
    const chapter = document.getElementById(id).closest('.shop-chapter');
    document.querySelectorAll('.chapter-links a').forEach(link => {
      if (link.hash === '#' + chapter?.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
    if (chapter) $('.chapter-select select').value = chapter.id;
    $('#startBtn').textContent = '继续冒险';
  }
  function route() {
    let id; try { id = decodeURIComponent(location.hash.slice(1) || 'cover'); } catch { id = 'cover'; }
    if (!routes.has(id)) id = 'cover'; markLocation(id);
    document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  $('#lessonWorkspace').addEventListener('click', event => {
    const surface = event.target.closest('.shop-stage'); if (!surface) return;
    markLocation(surface.id);
    if (location.hash !== '#' + surface.id) history.replaceState(null, '', '#' + surface.id);
  }, true);
  $('.chapter-select select').addEventListener('change', event => navigate(event.target.value));
  const resume = practice.activity('unitLocation');
  if (resume && routes.has(resume) && resume !== 'cover') $('#startBtn').textContent = '继续冒险';
  $('#startBtn').addEventListener('click', () => {
    const saved = practice.activity('unitLocation'); navigate(routes.has(saved) && saved !== 'cover' ? saved : unit.start);
  });
  const help = {
    text: ['点“开始看课文”，用“下一句”展开原文。旧句可以向上查看，中文按句打开。'],
    roles: ['先看完课文，再来找答案。需要回顾时可以回到河畔故事画卷。'],
    words: ['点整张词卡看意思，再点收起。用上一组和下一组翻页。'],
    listen: ['看英文选词义，或根据图片、词义选英文。选好后点“检查答案”。'],
    phrases: ['看看不同表达怎样使用，再到下一站练一练。'],
    observe: ['读清楚英文，分清桥上、桥下与河面。'],
    be: ['读清楚英文要求，再选择图片或合适的表达。'],
    models: ['翻页观察动作，跟老师用 What are they doing? 轮流提问。'],
    trans: ['点词块组成句子，点已选的词块可以撤回。全部用完再检查。'],
    certificate: ['完成五关后领取、保存或打印。证书记录练习完成，不评价自由口语或独立写作。']
  };
  function showHelp(id, title) {
    $('#helpTitle').textContent = title;
    $('#helpBody').replaceChildren(...(help[id] || ['选择后点“检查答案”。答错可以改选；点“下一题”继续。']).map(text => node('p', text)));
    $('#unitHelp').showModal();
  }
  document.querySelectorAll('[data-close]').forEach(control => control.addEventListener('click', () => control.closest('dialog').close()));
  $('#notebookButton').addEventListener('click', () => $('#unitNotebook').showModal());

  const signatures = Object.fromEntries(Object.entries(questions).map(([id, items]) => [id, JSON.stringify([unit.version, items])]));
  signatures.text = JSON.stringify([unit.version, content.DIALOGUE]);
  const saved = practice.activity('unitCompleted');
  const completed = saved && typeof saved === 'object' && !Array.isArray(saved) ? { ...saved } : {};
  const passed = id => practice.sameContentSignature(completed[id], signatures[id]);
  const fullyComplete = () => stages.every(stage => stage.required.every(passed));
  function updateProgress() {
    let total = 0;
    for (const stage of stages) {
      const count = stage.required.filter(passed).length, stars = Math.floor(count / stage.required.length * 3);
      total += stars;
      const label = $('#' + stage.id + ' .lvl-stars'); label.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars); label.setAttribute('aria-label', '本关 ' + stars + ' / 3 颗星');
    }
    $('#starCount').textContent = String(total);
    const next = activities.find(item => stages.find(stage => stage.id === item.chapter).required.includes(item.id) && !passed(item.id));
    certificateView?.update({ complete: fullyComplete(), completedChapters: stages.map(stage => stage.required.every(passed)), next: next ? { title: next.title, go: () => navigate('learn/' + next.id) } : null });
  }
  function complete(id) { completed[id] = signatures[id]; practice.activity('unitCompleted', completed); updateProgress(); }
  function nextStation(id, actions) {
    if (!actions || actions.querySelector('.station-actions')) return;
    const next = activities[activities.findIndex(item => item.id === id) + 1]; if (!next) return;
    const group = node('div', '', 'station-actions'); group.append(button('下一站：' + next.title, () => navigate('learn/' + next.id))); actions.append(group);
  }
  function mountPractice(id, settings = {}) {
    const element = node('div'); element.id = 'unit3334-' + id + '-practice'; surfaces.get(id).append(element);
    const predecessors=unit.activityPredecessors?.[id];
    practice.mount({ element, questions: questions[id], sessionId: unit.taskSessions?.[id] || (predecessors ? 'v2' : 'v' + unit.version),
      inputViews:core.lesson49TaskInputs,
      previousGroups: unit.taskPredecessors?.[id] || predecessors?.map(old=>({key:'unit3334-'+old+'-practice/v1',questions:unit.previousQuestions[old]})),
      completionDetails:id==='listen'?null:scene.result(id), ...settings,
      onComplete: states => { complete(id); const label=element.querySelector('.practice-finish>p');if(label)label.textContent=id==='exam'?'挑战完成！':'这一站完成了！'; nextStation(id, element.querySelector('.practice-finish-actions')); settings.onComplete?.(states); } });
    return element;
  }

  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage');
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文原文'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  const storyScene=scene.mount(stage,log);
  const status = node('p', '', 'dialogue-status'); status.setAttribute('role', 'status');
  const controls = node('div', '', 'stage-ctrl'), tools = node('div', '', 'stage-tools');
  const advance = button('开始看课文', advanceDialogue);
  tools.append(button('从头看', resetDialogue, 'btn btn-yellow')); controls.append(advance, tools);
  const finish = node('div', '', 'practice-finish'), finishActions = node('div', '', 'practice-finish-actions');
  finishActions.setAttribute('role', 'group'); finishActions.setAttribute('aria-label', '完成后的操作');
  finishActions.append(button('再看一遍', resetDialogue, 'btn btn-yellow')); nextStation('text', finishActions);
  finish.append(scene.result('text'),node('p', '课文看完了！'), finishActions); story.append(stage, status, controls, finish);
  const gate = node('div', '', 'activity-actions'); gate.append(button('先看课文', () => navigate('learn/text'))); surfaces.get('roles').append(gate);
  let storyStarted = false, dialogue = { i: -1, viewed: [], done: false };
  function unlockStory() { if (!passed('text') || storyStarted) return; storyStarted = true; gate.remove(); mountPractice('roles'); }
  function saveDialogue() { practice.activity('unitDialogue', { ...dialogue, signature: signatures.text }); }
  function refreshDialogue() {
    advance.textContent = dialogue.i < 0 ? '开始看课文' : dialogue.i === content.DIALOGUE.length - 1 ? '完成课文' : '下一句';
    controls.hidden = dialogue.done; finish.hidden = !dialogue.done;
    status.textContent = dialogue.i < 0 ? '' : `${dialogue.i + 1} / ${content.DIALOGUE.length} 句原文`;
    log.querySelectorAll('.bubble-row').forEach((row, index) => row.classList.toggle('is-current', index === dialogue.i));
    storyScene.showLine(dialogue.i);
  }
  function lead() { const lead = node('div', '', 'story-lead'); lead.append(icon('book'), node('p', '琼斯一家人看到了什么？')); log.replaceChildren(lead); }
  function appendLine(index) {
    const line = content.DIALOGUE[index], row = node('div', '', 'bubble-row ' + line.who), bubble = node('div', '', 'bubble');
    const speech = node('p', '', 'btext'); speech.append(node('span', line.text)); speech.lang = 'en';
    const translation = node('p', line.cn, 'bcn'); translation.hidden = true;
    const translate = button('看中文', () => { translation.hidden = !translation.hidden; translate.textContent = translation.hidden ? '看中文' : '收起中文'; translate.setAttribute('aria-expanded', String(!translation.hidden)); if(!translation.hidden)requestAnimationFrame(()=>{log.scrollTop=Math.max(0,row.offsetTop+row.offsetHeight-log.clientHeight);}); }, 'btn btn-mini btn-yellow'); translate.setAttribute('aria-expanded', 'false');
    const actions = node('div', '', 'bbtns'); actions.append(translate);
    bubble.append(node('div', content.PEOPLE[line.person].name, 'bname'), speech, translation, actions); row.append(bubble); log.append(row);
  }
  function advanceDialogue() {
    if (dialogue.done) return;
    if (dialogue.i === content.DIALOGUE.length - 1) {
      if (!content.DIALOGUE.every((_, index) => dialogue.viewed[index] === true)) return;
      dialogue.done = true; saveDialogue(); complete('text'); unlockStory(); refreshDialogue(); core.lesson49Feedback.play('complete'); return;
    }
    if (dialogue.i < 0) log.replaceChildren(); dialogue.i++; dialogue.viewed[dialogue.i] = true; saveDialogue(); appendLine(dialogue.i); refreshDialogue(); log.scrollTop = log.scrollHeight;
  }
  function resetDialogue() { dialogue = { i: -1, viewed: [], done: false }; saveDialogue(); lead(); refreshDialogue(); }
  const draft = practice.activity('unitDialogue');
  if (draft?.signature === signatures.text && Number.isInteger(draft.i) && draft.i >= 0 && draft.i < content.DIALOGUE.length) {
    const source = draft.viewed;
    const viewed = Array.isArray(source) ? source.slice(0, draft.i + 1) : null;
    if (Array.isArray(viewed)) {
      const gap = content.DIALOGUE.findIndex((_, index) => index <= draft.i && viewed[index] !== true);
      const index = gap < 0 ? draft.i : gap - 1;
      dialogue = { i: index, viewed: viewed.slice(0, index + 1), done: draft.done === true && index === content.DIALOGUE.length - 1 && content.DIALOGUE.every((_, i) => viewed[i] === true) };
      for (let i = 0; i <= index; i++) appendLine(i);
      if (dialogue.done) complete('text');
    }
  }
  if (dialogue.i < 0) lead();
  refreshDialogue(); unlockStory();

  const wordHost = surfaces.get('words'), wordGrid = node('div', '', 'unit-words');
  const wordControls = node('div', '', 'word-controls'), wordProgress = node('span');
  const pageCount = Math.ceil(content.WORDS.length / 6), savedPage = practice.activity('unitWordPage');
  let wordPage = Number.isInteger(savedPage) ? Math.max(0, Math.min(pageCount - 1, savedPage)) : 0;
  const previousWords = button('上一组词卡', () => changeWordPage(-1), 'btn btn-yellow');
  const nextWords = button('下一组词卡', () => wordPage === pageCount - 1 ? navigate('learn/listen') : changeWordPage(1));
  wordProgress.id = 'wordPageProgress'; wordControls.append(previousWords, wordProgress, nextWords); wordHost.append(wordGrid, wordControls);
  function changeWordPage(delta) { wordPage += delta; renderWords(); practice.revealQuestion(wordHost, wordHost.querySelector('h3')); }
  function renderWords() {
    wordGrid.replaceChildren(); practice.activity('unitWordPage', wordPage);
    for (const word of content.WORDS.slice(wordPage * 6, wordPage * 6 + 6)) {
      const picture = node('img'); picture.src = word.image; picture.alt = '';
      const pronunciation = node('small', word.ph, 'word-phonetic'); pronunciation.lang = 'en-GB';
      const meaning = node('span', word.cn, 'word-meaning'); meaning.hidden = true;
      pronunciation.id = 'u3334-' + word.en.replaceAll(' ', '-') + '-phonetic';
      meaning.id = 'u3334-' + word.en.replaceAll(' ', '-') + '-meaning';
      const example = node('small', word.example || '', 'word-example'); example.hidden = !word.example;
      const card = button('', () => {
        const expanded = card.getAttribute('aria-expanded') !== 'true';
        card.setAttribute('aria-expanded', String(expanded)); meaning.hidden = !expanded;
        card.setAttribute('aria-describedby', expanded ? meaning.id : pronunciation.id);
      }, 'opt-btn unit-word');
      card.setAttribute('aria-label', word.en); card.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-describedby', pronunciation.id);
      card.append(picture, node('strong', word.en), pronunciation, meaning, example); wordGrid.append(card);
    }
    previousWords.disabled = wordPage === 0; wordProgress.textContent = `${wordPage + 1} / ${pageCount}`;
    nextWords.setAttribute('aria-label', wordPage === pageCount - 1 ? '下一站：单词寻宝' : '下一组词卡');
    if (wordPage === pageCount - 1) nextWords.replaceChildren(node('span', '下一站：'), node('span', '单词寻宝'));
    else nextWords.textContent = '下一组词卡';
  }
  renderWords();
  mountPractice('listen', { allowHints: false });

  function expressionCard(expression) {
    const picture = node('img'); picture.src = expression.image; picture.alt = '';
    const caption = node('span', expression.cn);
    const card = node('article', '', 'phrase-card reference-card');
    card.append(picture, node('strong', expression.en), caption); return card;
  }
  const phraseGrid=node('div','','phrase-grid');content.PHRASES.forEach(item=>phraseGrid.append(expressionCard(item)));
  const usage=node('details','','offline-task');usage.append(node('summary','从一个，到他们'),
    node('p','Sally is looking at a ship. → They are looking at a ship. 描述现在正在做的事，要有 be 和动作的 -ing 形式。they、the children、the men 等复数主语用 are。'),
    node('p','What are they doing? → They are washing dishes. 问句把 are 放在主语前；They’re = They are。the man and the woman 指两个人，也用 are。'),
    node('p','There are some boats on the river. 是说河上有什么，不是在问这些船正在做什么。It is a fine day today. 里的 it 用来谈天气，不是某个人或物品。'));
  const spelling=node('details','','offline-task');spelling.append(node('summary','给动作加上 -ing'),
    node('p','walk → walking，wash → washing。type → typing，make → making，come → coming，shine → shining，give → giving，shave → shaving：这些词去掉不发音的 e，再加 ing。'),
    node('p','fly → flying，cry → crying：这里保留 y，直接加 ing。不能套用名词复数或动词第三人称单数的 y 变化。更多例外由老师以后介绍。'),
    node('p','walk over the bridge 是从桥上走过；fly over the river 是从河流上空飞过。under the bridge 在桥下，on the river 在河面。look at 表示看。'));
  const phraseActions=node('div','','activity-actions');nextStation('phrases',phraseActions);
  surfaces.get('phrases').append(phraseGrid,usage,spelling,phraseActions);
  const gallery=node('div','','action-pages');surfaces.get('models').append(gallery);
  core.classroomScene.paginate(gallery,{items:content.GALLERY,size:3,key:'unitActionPage',label:'动作',render(item){const card=expressionCard(item);card.prepend(node('small',item.numberLabel,'number-label'));return card;}});
  const example=node('details','','offline-task');example.append(node('summary','先问一问，再描述'),
    node('p','What are the women doing?'),node('p','They are washing dishes. / They’re washing dishes.'),
    node('p','他们、她们、它们在本课都可以用 they，但具体指谁必须看前文。The birds are flying. 里的 they 可以回指鸟。'));
  const note=node('details','','offline-task');note.append(node('summary','和老师一起看'),
    node('p','完整的12组动作都在画册中。跟老师读数字：220,231 到 2,000,000，再用 What are … doing? 轮流问答。'),
    node('p','fine 在本课说天气晴好，天空仍然可以有云。boat 与 ship 按本课小船和大轮船的图景区分，日常使用有重叠。'),
    node('p','词卡采用英式音标，发音由老师示范。人物衣服和发型是画面设计，不是课文事实。shaving、jumping off the wall 只观察图片和描述，不做危险动作。'));
  const modelActions=node('div','','activity-actions');nextStation('models',modelActions);surfaces.get('models').append(example,note,modelActions);
  for (const id of ['observe','be','trans']) mountPractice(id);
  const examResults = node('div', '', 'unit-results');
  mountPractice('exam', { chunkSize: questions.exam.length, finalLabel: '查看本次记录', completionDetails: examResults, onComplete: states => {
    const independent = states.filter(state => state.firstCorrect && !state.hintUsed && !state.ruleUsed && !state.revealed).length;
    const assisted = states.filter(state => state.firstCorrect && (state.hintUsed || state.ruleUsed || state.revealed)).length;
    const corrected = states.filter(state => !state.firstCorrect).length;
    examResults.replaceChildren(scene.result('exam'),node('p', `首次独立答对 ${independent} / ${questions.exam.length}`), node('p', `提示后完成 ${assisted} 题 · 修正后完成 ${corrected} 题`));
    const targets = questions.exam.filter((_, index) => !states[index].firstCorrect || states[index].hintUsed || states[index].ruleUsed || states[index].revealed).map(q => q.target);
    if (targets.length) { const details = node('details'), list = node('ul'); details.append(node('summary', '下次再练')); targets.forEach(target => list.append(node('li', target))); details.append(list); examResults.append(details); }
  } });
  certificateView = core.unitCertificate.mount({
    element: surfaces.get('certificate'), initialName: practice.activity('unitName'), initialIssuedAt: practice.activity('unitClassroomCertificateIssuedAt'), canClaim: fullyComplete,
    onClaim: ({ name, issuedAt }) => { practice.activity('unitName', name); practice.activity('unitClassroomCertificateIssuedAt', issuedAt); },
    design: {
      copy: { title: '细心的河畔发现家', course: '晴天河畔发现之旅 · Lesson 33–34', completion: '完成 Lesson 33–34 课堂配套练习', thanks: '一起过桥，读懂大家的动作，留下河畔的新发现！' },
      characters: ['MrJones', 'MrsJones'], characterLabels: ['琼斯先生', '琼斯太太'], icon: art, defaultName: '细心的河畔发现家', dialogTitle: '河畔发现纪念', fileName: 'Lesson33-34-晴天河畔发现之旅.png',
      badges: stages.map((stage, index) => ({ title: stage.title, icon: { l1: 'cards', l2: 'book', l3: 'question', l4: 'order', l5: 'star' }[stage.id], color: ['#FFF0BC', '#F1E5CF', '#E1EDD5', '#DFEAF1', '#F8DCD4'][index] }))
    }
  });

  const writing=node('details','','offline-task');writing.id='unitWriting';
  writing.append(node('summary','和朋友再试试'),node('p','跟老师读课文，用动作图问 What are they doing?。发音、听辨和口头交流由老师安排；在课堂只用图片或安全的模拟动作。'));
  writing.append(node('h4','Lesson 33–34 · 纸笔小练习'),node('p','A．用动作的 -ing 形式补全句子。'),node('p','例：Take … He is taking his book.'));
  const aList=node('ol','','reference-writing');content.WRITING_A.forEach(([command,subject])=>{const row=node('li');row.append(node('span',command+' … '+subject),node('span','','writing-rule'));aList.append(row);});writing.append(aList);
  const writingB=node('section','','writing-b');
  writingB.append(node('h4','B．提问与回答'),node('p','根据词组，用现在进行时提问并回答。'),node('p','例：the children / looking at the boats on the river'),node('p','What are the children doing? They’re looking at the boats on the river.'));
  const bList=node('ol','','reply-writing');content.WRITING_B.forEach(([person,action])=>{const row=node('li');row.append(node('span',person+' / '+action));for(let line=0;line<2;line++)row.append(node('span','','writing-rule'));bList.append(row);});writingB.append(bList);writing.append(writingB);
  const printActions=node('div','','activity-actions');printActions.append(button('打印练习纸',()=>{document.body.classList.add('print-writing');root.print();},'btn btn-yellow'));writing.append(printActions);surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
  updateProgress(); practice.initializeNotebook();
  root.addEventListener('hashchange', route);
  document.fonts.ready.then(() => {
    const restore=()=>requestAnimationFrame(()=>{route();log.scrollTop=log.scrollHeight;});
    if(!document.documentElement.hasAttribute('data-course-preparing'))return restore();
    const ready=new MutationObserver(()=>{if(!document.documentElement.hasAttribute('data-course-preparing')){ready.disconnect();restore();}});
    ready.observe(document.documentElement,{attributes:true,attributeFilter:['data-course-preparing']});
  });
})(globalThis);
