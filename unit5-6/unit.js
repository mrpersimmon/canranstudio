(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit56;
  const { stages, questions, learning: content } = unit;
  const practice = core.lesson49Practice;
  core.unit56History.preserve(practice,unit);
  const runners=new Map();
  const $ = selector => document.querySelector(selector);
  const icon = core.lesson49Icons.create;
  const node = (tag, text = '', className = '') => {
    const element = document.createElement(tag); element.textContent = text; element.className = className; return element;
  };
  function button(text, action, className = 'btn btn-green') {
    const element = node('button', text, className); element.type = 'button'; element.addEventListener('click', action); return element;
  }
  function art(name, label = '') {
    const word = unit.objects.find(word => word.en === name);
    const path = core.unit56Current.image(name) || content.PEOPLE[name]?.image || word?.image;
    if (!path) return icon(name, label);
    const picture = node('img', '', 'shop-icon'); picture.src = path; picture.alt = label; return picture;
  }
  const surfaces = new Map();
  const activities = stages.flatMap(stage => stage.activities.map(([id, title]) => ({ id, title, chapter: stage.id })));
  const canonicalRoute = id=>unit.routeAliases?.[id]||id;
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
      header.append(icon(illustration), node('h3', title));
      surface.append(header); surfaces.set(id, surface); section.append(surface);
    }
    $('#lessonWorkspace').append(section);
  }
  const navigate = id => {
    id=canonicalRoute(id);
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
    id=canonicalRoute(id);if (!routes.has(id)) id = 'cover';if(location.hash!=='#'+id)history.replaceState(null,'','#'+id);markLocation(id);
    document.documentElement.style.scrollPaddingTop=($('#topbar').getBoundingClientRect().height+12)+'px';
    document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  $('#lessonWorkspace').addEventListener('click', event => {
    const surface = event.target.closest('.shop-stage'); if (!surface) return;
    markLocation(surface.id);
    if (location.hash !== '#' + surface.id) history.replaceState(null, '', '#' + surface.id);
  }, true);
  $('.chapter-select select').addEventListener('change', event => navigate(event.target.value));
  const resume = canonicalRoute(practice.activity('unitLocation'));
  if (resume && routes.has(resume) && resume !== 'cover') $('#startBtn').textContent = '继续冒险';
  $('#startBtn').addEventListener('click', () => {
    const saved = canonicalRoute(practice.activity('unitLocation')); navigate(routes.has(saved) && saved !== 'cover' ? saved : unit.start);
  });
  document.querySelectorAll('[data-close]').forEach(control => control.addEventListener('click', () => control.closest('dialog').close()));
  $('#notebookButton').addEventListener('click', () => $('#unitNotebook').showModal());

  const signatures = Object.fromEntries(Object.entries(questions).map(([id, items]) => [id, JSON.stringify([unit.version, items])]));
  signatures.text = JSON.stringify([unit.version, content.DIALOGUE]);
  // This pronunciation-only replacement keeps the same text and questions.
  // Accept only the exact former audio path, not arbitrary older story content.
  const priorPronunciationSignature = JSON.stringify([unit.version, content.DIALOGUE.map(line =>
    line.id === 'L05-D12' && line.audio === 'unit5-6/audio/l05-d12-v2.mp3'
      ? { ...line, audio: 'unit5-6/audio/l05-d12.mp3' } : line)]);
  const sameDialogue = signature => signature === signatures.text || signature === priorPronunciationSignature;
  const saved = practice.activity('unitCompleted');
  const completed = saved && typeof saved === 'object' && !Array.isArray(saved) ? { ...saved } : {};
  if (completed.text === priorPronunciationSignature && completed.text !== signatures.text) {
    completed.text = signatures.text; practice.activity('unitCompleted', completed);
  }
  const passed = id => practice.sameContentSignature(completed[id], signatures[id]);
  let awardState = { stars: 0, zones: {}, firstFullStarAt: null };
  function updateProgress() {
    for (const stage of stages) {
      const zone = unit.reward.zones.find(zone => stage.required.includes(zone.id));
      const earned = Boolean(awardState.zones[zone.id]);
      const label = $('#' + stage.id + ' .lvl-stars'); label.textContent = earned ? '★' : '☆';
      label.setAttribute('aria-label', '本关 ' + (earned ? '1' : '0') + ' / 1 颗星');
    }
    $('#starCount').textContent = String(awardState.stars);
    document.querySelectorAll('.award-round-result[data-perfect="true"]').forEach(result => {
      result.textContent = awardState.pendingZones?.includes(result.dataset.zone) ? '整轮零错！联网同步后点亮星星。' : '这颗星已经点亮。';
    });
    certificateView?.update(awardState);
  }
  function complete(id) { completed[id] = signatures[id]; practice.activity('unitCompleted', completed); updateProgress(); }
  const settlement = core.awardReveal.create({ unit });
  const awards = core.unitAwards.create({ unit, practice, onAward: settlement.earned, onChange: state => { awardState = state; updateProgress(); } });
  function nextStation(id, actions) {
    if (!actions || actions.querySelector('.station-actions')) return;
    const next = activities[activities.findIndex(item => item.id === id) + 1]; if (!next) return;
    const group = node('div', '', 'station-actions'); group.append(button('下一站：' + next.title, () => navigate('learn/' + next.id))); actions.append(group);
  }
  function mountPractice(id, settings = {}) {
    const element = node('div'); element.id = 'unit56-' + id + '-practice'; surfaces.get(id).append(element);
    if(['roles','introduce','cars'].includes(id))settings.sceneView=core.unit56Current.view({element,art,zone:id});
    const predecessors = unit.activityPredecessors[id];
    const runner=practice.mount({ element, questions: questions[id], previousQuestionSets: [unit.voicedQuestions[id]], sessionId: unit.taskSessions?.[id] || (predecessors ? 'v2' : 'v' + unit.version),
      inputViews:core.lesson49TaskInputs, roundPolicy:unit.reward.edition,
      previousGroups: unit.taskPredecessors?.[id] || predecessors?.flatMap(old => [unit.previousQuestions[old], unit.voicedQuestions[old]].map(prior => ({ key: 'unit56-' + old + '-practice/v1', questions: prior }))), ...settings,
      onAnswer:(question,state)=>{if(settings.sceneView?.hasVisibleModel?.()){state.revealed=true;practice.record(question,state);}settings.onAnswer?.(question,state);},
      onComplete: (states,round) => {
        const { perfect, message } = settlement.complete({ id, states, round, awards, element });
        complete(id);nextStation(id,element.querySelector('.practice-finish-actions'));settings.onComplete?.(states);
        const titles={listen:'单词寻宝完成！',roles:'课文理解完成！',introduce:'介绍练习完成！',cars:'汽车问答完成！',exam:'综合挑战完成！'};
        core.unit12Completion.render({finish:element.querySelector('.practice-finish'),activity:id,theme:{title:titles[id]},artwork:core.unit56Current.completion(),details:id==='exam'?settings.completionDetails:null,celebrate:round.userCompleted,awardStatus:message,waitForCelebration:()=>settlement.isPresenting()||(awards.state().pendingZones.includes(id)&&navigator.onLine!==false&&document.getElementById('studentSyncStatus')?.dataset.syncState!=='retry')});
        const result=element.querySelector('.completion-award');result.classList.add('award-round-result');result.dataset.perfect=String(perfect);result.dataset.zone=id;updateProgress();
      } });
    runners.set(id,runner);
    return element;
  }

  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage');
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文对话'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  const props = core.unit56Scene.storyProps(content);
  props.element.append(log);stage.append(props.element);
  const status = node('p', '', 'dialogue-status'); status.setAttribute('role', 'status');
  const controls = node('div', '', 'stage-ctrl'), tools = node('div', '', 'stage-tools');
  const advance = button('开始看课文', advanceDialogue);
  tools.append(button('重新上演', resetDialogue, 'btn btn-yellow')); controls.append(tools, advance);
  const finish = node('div', '', 'practice-finish'), finishActions = node('div', '', 'practice-finish-actions');
  finishActions.setAttribute('role', 'group'); finishActions.setAttribute('aria-label', '完成后的操作');
  finishActions.append(button('再看一遍', resetDialogue, 'btn btn-yellow')); nextStation('text', finishActions);
  finish.append(node('p', '新朋友都认识了！'), core.unit56Scene.classPhoto(), finishActions); story.append(stage, status, controls, finish);
  const gate = node('div', '', 'activity-actions'); gate.append(button('先看故事', () => navigate('learn/text'))); surfaces.get('roles').append(gate);
  let storyStarted = false, dialogue = { i: -1, viewed: [], done: false };
  function unlockStory() { if (!passed('text') || storyStarted) return; storyStarted = true; gate.remove(); mountPractice('roles', { completionDetails: core.unit56Scene.classPhoto() }); }
  function saveDialogue() { practice.activity('unitDialogue', { ...dialogue, signature: signatures.text }); }
  function refreshDialogue() {
    advance.textContent = dialogue.i < 0 ? '开始看课文' : dialogue.i === content.DIALOGUE.length - 1 ? '完成课文' : '下一句';
    props.update(dialogue.i);
    controls.dataset.state = dialogue.i < 0 ? 'ready' : 'reading'; tools.hidden = dialogue.i < 0;
    controls.hidden = dialogue.done; finish.hidden = !dialogue.done;
    status.textContent = dialogue.i < 0 ? '' : `${dialogue.i + 1} / ${content.DIALOGUE.length}`;
    status.setAttribute('aria-label', dialogue.i < 0 ? '尚未开始阅读' : `已读 ${dialogue.i + 1} / ${content.DIALOGUE.length} 句课文`);
    log.querySelectorAll('.bubble-row').forEach((row, index) => row.classList.toggle('is-current', index === dialogue.i));
  }
  function lead() { const lead=node('div','','story-lead');const en=node('p','Is Chang-woo Chinese?','story-question');en.lang='en';lead.append(en,node('p','昌宇是中国人吗？'));log.replaceChildren(lead); }
  function appendLine(index) {
    const line = content.DIALOGUE[index], row = node('div', '', 'bubble-row ' + line.who), bubble = node('div', '', 'bubble');
    const speech = node('p', '', 'btext'); speech.append(node('span', line.text)); speech.lang = 'en';
    const translation = node('p', line.cn, 'bcn'); translation.hidden = true;
    const translate = button('看中文', () => { translation.hidden = !translation.hidden; translate.textContent = translation.hidden ? '看中文' : '收起中文'; translate.setAttribute('aria-expanded', String(!translation.hidden));
      // Expanding the current translation must reveal its button as well; only
      // the transcript scrolls, never the page or the controls below it.
      if (!translation.hidden) {
        const overflow = row.getBoundingClientRect().bottom - log.getBoundingClientRect().bottom + 12;
        if (overflow > 0) log.scrollTop += overflow;
      }
    }, 'btn btn-mini btn-yellow'); translate.setAttribute('aria-expanded', 'false');
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
  if (sameDialogue(draft?.signature) && Number.isInteger(draft.i) && draft.i >= 0 && draft.i < content.DIALOGUE.length) {
    // Old voiced pages already displayed the current line, even if its audio
    // was interrupted. Retain that reading position, not a new listening score.
    const legacy = !Array.isArray(draft.viewed) && Array.isArray(draft.heard);
    const source = legacy ? draft.heard : draft.viewed;
    const viewed = Array.isArray(source) ? source.slice(0, draft.i + 1) : null;
    if (Array.isArray(viewed)) {
      if (legacy) viewed[draft.i] = true;
      const gap = content.DIALOGUE.findIndex((_, index) => index <= draft.i && viewed[index] !== true);
      const index = gap < 0 ? draft.i : gap - 1;
      dialogue = { i: index, viewed: viewed.slice(0, index + 1), done: draft.done === true && index === content.DIALOGUE.length - 1 && content.DIALOGUE.every((_, i) => viewed[i] === true) };
      for (let i = 0; i <= index; i++) appendLine(i);
      if (legacy) saveDialogue();
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
      const picture = node('img'); picture.src = core.unit56Current.image(word.en)||word.image; picture.alt = '';
      const pronunciation = node('small', word.ph, 'word-phonetic'); pronunciation.lang = 'en-US';
      const meaning = node('span', word.cn, 'word-meaning'); meaning.hidden = true;
      const example = node('small', word.example || '', 'word-example'); example.hidden = !word.example;
      const card = button('', () => {
        const expanded = card.getAttribute('aria-expanded') !== 'true';
        card.setAttribute('aria-expanded', String(expanded)); meaning.hidden = !expanded;
      }, 'opt-btn unit-word');
      card.setAttribute('aria-label', word.en); card.setAttribute('aria-expanded', 'false');
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
    const picture = node('img');const person=Object.entries(content.PEOPLE).find(([,value])=>value.image===expression.image),word=content.WORDS.find(value=>value.image===expression.image);picture.src=(person&&core.unit56Current.image(person[0]))||(word&&core.unit56Current.image(word.en))||expression.image;picture.alt='';if(expression.en.startsWith('Alice '))picture.hidden=true;
    const caption = node('span', expression.cn);
    const card = node('article', '', 'phrase-card reference-card');
    card.append(picture, node('strong', expression.en), caption); return card;
  }
  const phraseGrid = node('div', '', 'phrase-grid');
  content.PHRASES.forEach(expression => phraseGrid.append(expressionCard(expression)));
  const reference = node('details', '', 'offline-task'); reference.append(node('summary', '他、她、它怎么接着说'));
  const referenceGrid = node('div', '', 'phrase-grid'); content.REFERENCE.forEach(item => referenceGrid.append(expressionCard(item))); reference.append(referenceGrid);
  reference.append(node('p', '本课用 he 说 Hans，用 she 说 Sophie、Alice；说汽车用 it。her 是“她的”，his 是“他的”，不把汽车当成人。'));
  const articleGuide = node('details', '', 'offline-task'); articleGuide.append(node('summary', 'a、an 放在哪里'));
  articleGuide.append(node('p', 'a French student · an English car。a／an 看紧接着的发音，不只看字母。She is French. 里的 French 直接说明国籍，前面不加 a 或 an。'));
  articleGuide.append(node('p', 'French /frentʃ/ 以辅音 /f/ 开头；English /ˈɪŋɡlɪʃ/ 以元音 /ɪ/ 开头。'));
  const shortForms = node('details', '', 'offline-task'); shortForms.append(node('summary', '一句话变短'));
  for (const [left, right] of [['He is', "He's"], ['She is', "She's"], ['It is', "It's"], ['is not', "isn't"]]) {
    const row = node('p', '', 'contraction-row'); row.append(node('span', left), node('span', '→'), node('span', right)); shortForms.append(row);
  }

  const referenceHost=node('details','','offline-task grammar-reference');referenceHost.append(node('summary','介绍表达参考'),phraseGrid,reference,articleGuide,shortForms);
  mountPractice('introduce');surfaces.get('introduce').append(referenceHost);
  const carGrid=node('div','','phrase-grid car-showroom');content.CARS.forEach((item,i)=>{const card=expressionCard(item);card.prepend(node('span',String(i+8),'reference-number'));carGrid.append(card);});
  const makeGuide = expressionCard({en:'What make is it?',cn:'问汽车品牌',image:'/assets/unit5-6/make.svg'});
  const choices = node('details', '', 'offline-task'); choices.append(node('summary', '换个朋友或汽车问一问'));
  choices.append(node('p','下面依据给定资料回答。两项中有符合事实的一项时，说清是哪一种；两项都不符合时，可以说明实际情况，不被选项限制。原例要求先否定括号内的一项，再说明括号外的正确情况。'));
  for (const item of content.CHOICE_MODELS) {
    const pair=node('div','','model-pair'); pair.append(node('p',item.name+' · '+item.right));
    const grid=node('div','','phrase-grid'); grid.append(expressionCard({en:item.question,cn:'问一问',image:item.image}),expressionCard({en:item.answer,cn:'答一答',image:item.image}));pair.append(grid);choices.append(pair);
  }
  const modelReference=node('details','','offline-task car-reference');modelReference.append(node('summary','汽车与选择问答参考'),node('p','以下国别沿用教材展牌，不用它推断车主国籍或现在的生产地。'),makeGuide,carGrid,choices);mountPractice('cars');surfaces.get('cars').append(modelReference);

  const examResults = node('div', '', 'unit-results');
  mountPractice('exam', { chunkSize: questions.exam.length, finalLabel: '查看本次记录', completionDetails: examResults, onComplete: states => {
    const independent = states.filter(state => state.firstCorrect && !state.hintUsed && !state.ruleUsed && !state.revealed).length;
    const assisted = states.filter(state => state.firstCorrect && (state.hintUsed || state.ruleUsed || state.revealed)).length;
    const corrected = states.filter(state => !state.firstCorrect).length;
    examResults.replaceChildren(node('p', `首次独立答对 ${independent} / ${questions.exam.length}`), node('p', `提示后完成 ${assisted} 题 · 修正后完成 ${corrected} 题`));
    const targets = questions.exam.filter((_, index) => !states[index].firstCorrect || states[index].hintUsed || states[index].ruleUsed || states[index].revealed).map(q => q.target);
    if (targets.length) { const details = node('details'), list = node('ul'); details.append(node('summary', '下次再练')); targets.forEach(target => list.append(node('li', target))); details.append(list); examResults.append(details); }
  } });
  certificateView = core.storyCertificate.mount({element:surfaces.get('certificate'),unit,go:navigate,returnUrl:$('#logo').href,progress:id=>runners.get(id)?.progress(),restart:id=>runners.get(id)?.restart()});
  core.unit56History.show(practice,surfaces.get('certificate'));

  const writing = node('details', '', 'offline-task'); writing.id = 'unitWriting';
  writing.append(node('summary', '和朋友再试试'), node('p', '各选一张课文人物卡，轮流问好、介绍对方，再交换角色。用卡片上明确写出的信息，不猜真实朋友的国籍。'));
  writing.append(node('h3','Lesson 6 · 书面练习'),node('h4','A · Complete these sentences using He, She or It.'),node('p','用He、She或It填空。Stella、Alice是女同学；Spanish是西班牙的。'),node('p','Example: Stella is a student. ___ isn’t German. ___ is Spanish.'),node('p','Stella is a student. She isn’t German. She is Spanish.'));
  const referenceWriting=node('ol','','reference-writing');
  ['Alice is a student. ___ isn’t German. ___ is French.','This is her car. ___ is a French car.','Hans is a student. ___ isn’t French. ___ is German.','This is his car. ___ is a German car.'].forEach(text=>referenceWriting.append(node('li',text)));
  writing.append(referenceWriting,node('h4','B · Write questions and answers using He, She, It, a or an.'),node('p','按给定事实写问句和完整回应。先否定括号内的一项，再说明括号外的正确情况。Naoko、Xiaohui用she；Hans、Chang-woo、Luming用he；汽车用it。'),node('p','Example: This is Miss Sophie Dupont. French/(Swedish)'),node('p','Is she a French student or a Swedish student?'),node('p','She isn’t a Swedish student. She’s a French student.'),node('p','Example: This is a Volvo. Swedish/(French)'),node('p','Is it a Swedish car or a French car?'),node('p','It isn’t a French car. It’s a Swedish car.'));
  const replyWriting=node('ol','','reply-writing');
  content.CHOICE_MODELS.slice(2).forEach(item=>{const row=node('li');row.append(node('span','This is '+(item.pronoun==='it'?'a ':'')+item.name+'. '+item.right+'/('+item.wrong+')'));for(let i=0;i<3;i++)row.append(node('span','','writing-rule'));replyWriting.append(row);});
  writing.append(replyWriting);
  const printActions = node('div', '', 'activity-actions');
  printActions.append(button('打印练习纸', () => { document.body.classList.add('print-writing'); root.print(); }, 'btn btn-yellow'));
  writing.append(printActions); surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint', () => document.body.classList.remove('print-writing'));

  updateProgress(); practice.initializeNotebook();
  root.addEventListener('hashchange', route);
  const revealSavedLine = () => { if (dialogue.i >= 0) log.scrollTop = log.scrollHeight; };
  document.addEventListener(['canran','course-ready'].join(':'),()=>{route();revealSavedLine();},{once:true});
  document.fonts.ready.then(() => requestAnimationFrame(() => { route(); revealSavedLine(); }));
})(globalThis);
