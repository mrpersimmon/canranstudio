(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit4142;
  const { stages, questions, learning: content } = unit;
  const practice = core.lesson49Practice;
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
    const path = ['sam', 'penny', 'bag'].includes(name) ? '/assets/unit41-42/' + name + '.svg' : word?.image;
    if (!path) return icon(name, label);
    const picture = node('img', '', 'shop-icon'); picture.src = path; picture.alt = label; return picture;
  }
  const surfaces = new Map(), runners = new Map();
  const activities = stages.flatMap(stage => stage.activities.map(([id, title]) => ({ id, title, chapter: stage.id })));
  const routes = new Set(['cover', ...stages.map(stage => stage.id), ...activities.map(item => 'learn/' + item.id)]);
  let active = '', certificateView;
  for (const stage of stages) {
    const section = node('section', '', 'shop-chapter'); section.id = stage.id;
    const heading = node('header', '', 'chapter-heading'); heading.append(node('h2', stage.title), node('span', '☆', 'lvl-stars')); section.append(heading);
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
  const aliases = { 'learn/phrases': 'learn/grammar' };
  const normalizeRoute = id => aliases[id] || id;
  const navigate = id => {
    id = normalizeRoute(id);
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
    id = normalizeRoute(id);
    if (!routes.has(id)) id = 'cover';
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    markLocation(id);
    document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  $('#lessonWorkspace').addEventListener('click', event => {
    const surface = event.target.closest('.shop-stage'); if (!surface) return;
    markLocation(surface.id);
    if (location.hash !== '#' + surface.id) history.replaceState(null, '', '#' + surface.id);
  }, true);
  $('.chapter-select select').addEventListener('change', event => navigate(event.target.value));
  const resume = normalizeRoute(practice.activity('unitLocation'));
  if (resume) practice.activity('unitLocation', resume);
  if (resume && routes.has(resume) && resume !== 'cover') $('#startBtn').textContent = '继续冒险';
  $('#startBtn').addEventListener('click', () => {
    const saved = normalizeRoute(practice.activity('unitLocation')); navigate(routes.has(saved) && saved !== 'cover' ? saved : unit.start);
  });
  document.querySelectorAll('[data-close]').forEach(control => control.addEventListener('click', () => control.closest('dialog').close()));
  $('#notebookButton').addEventListener('click', () => $('#unitNotebook').showModal());

  const signatures = Object.fromEntries(Object.entries(questions).map(([id, items]) => [id, JSON.stringify([unit.version, items])]));
  signatures.text = JSON.stringify([unit.version, content.DIALOGUE]);
  const saved = practice.activity('unitCompleted');
  const completed = saved && typeof saved === 'object' && !Array.isArray(saved) ? { ...saved } : {};
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
  function completionArt() {
    const scene = node('div', '', 'completion-art'); scene.setAttribute('aria-hidden', 'true');
    scene.append(node('span', '', 'completion-halo'), node('span', '', 'completion-ground'));
    const sam = art('sam'), penny = art('penny'), bag = art('bag');
    sam.className = 'completion-man'; penny.className = 'completion-attendant'; bag.className = 'completion-object';
    scene.append(sam, penny, bag); return scene;
  }
  const completionTitles = {listen:'单词寻宝完成！',roles:'故事读懂啦！',grammar:'数量说清楚啦！',apply:'购物袋整理好啦！',exam:'综合挑战完成！'};
  function mountPractice(id, settings = {}) {
    const element = node('div'); element.id = 'unit4142-' + id + '-practice'; surfaces.get(id).append(element);
    if (id === 'apply') {
      settings.sceneView = core.unit4142Scene.create({ element });
      settings.completionDetails = settings.sceneView.completion();
    }
    if (id === 'grammar') settings.sceneView = core.unit12Grammar.create({ element, art });
    const runner = practice.mount({element,questions:questions[id],sessionId:'v1',inputViews:core.lesson49TaskInputs,roundPolicy:unit.reward.edition,...settings,
      onComplete: (states,round) => {
        const { perfect, message } = settlement.complete({ id, states, round, awards, element });
        complete(id);
        nextStation(id, element.querySelector('.practice-finish-actions'));
        settings.onComplete?.(states);
        core.unit12Completion.render({ finish: element.querySelector('.practice-finish'), activity: id, states,
          theme: { title: completionTitles[id] }, artwork: completionArt(), details: id === 'exam' ? settings.completionDetails : null,
          celebrate: round.userCompleted, awardStatus: message,
          waitForCelebration: () => settlement.isPresenting() || (awards.state().pendingZones.includes(id) && navigator.onLine !== false && document.getElementById('studentSyncStatus')?.dataset.syncState !== 'retry') });
        const result = element.querySelector('.completion-award'); result.classList.add('award-round-result');
        result.dataset.perfect = String(perfect); result.dataset.zone = id;
        updateProgress(); } });
    runners.set(id, runner);
    return element;
  }

  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage');
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文对话'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  const props = core.unit4142Scene.storyProps();
  stage.append(props.element, log);
  const status = node('p', '', 'dialogue-status'); status.setAttribute('role', 'status');
  const controls = node('div', '', 'stage-ctrl'), tools = node('div', '', 'stage-tools');
  const advance = button('开始看课文', advanceDialogue);
  tools.append(button('重新上演', resetDialogue, 'btn btn-yellow')); controls.append(tools, advance);
  const finish = node('div', '', 'practice-finish'), finishActions = node('div', '', 'practice-finish-actions');
  finishActions.setAttribute('role', 'group'); finishActions.setAttribute('aria-label', '完成后的操作');
  finishActions.append(button('再看一遍', resetDialogue, 'btn btn-yellow')); nextStation('text', finishActions);
  finish.append(node('p', '故事看完了！'), finishActions); story.append(stage, status, controls, finish);
  const gate = node('div', '', 'activity-actions'); gate.append(button('先看故事', () => navigate('learn/text'))); surfaces.get('roles').append(gate);
  let storyStarted = false, dialogue = { i: -1, viewed: [], done: false };
  function unlockStory() { if (!passed('text') || storyStarted) return; storyStarted = true; gate.remove(); mountPractice('roles'); }
  function saveDialogue() { practice.activity('unitDialogue', { ...dialogue, signature: signatures.text }); }
  function refreshDialogue() {
    advance.textContent = dialogue.i < 0 ? '开始看课文' : dialogue.i === content.DIALOGUE.length - 1 ? '完成课文' : '下一句';
    props.update(dialogue.i);
    controls.dataset.state = dialogue.i < 0 ? 'ready' : 'reading'; tools.hidden = dialogue.i < 0;
    controls.hidden = dialogue.done; finish.hidden = !dialogue.done;
    status.textContent = dialogue.i < 0 ? '' : `${dialogue.i + 1} / ${content.DIALOGUE.length}`;
    status.setAttribute('aria-label', dialogue.i < 0 ? '尚未开始阅读' : `已读 ${dialogue.i + 1} / ${content.DIALOGUE.length} 句课文`);
    log.querySelectorAll('.bubble-row').forEach((row, index) => row.classList.toggle('is-current', index === dialogue.i));
    stage.querySelectorAll('.dialogue-actor').forEach(person => person.classList.toggle('is-current', person.dataset.actor === content.DIALOGUE[dialogue.i]?.who));
  }
  function lead() { const lead = node('div', '', 'story-lead'); lead.append(art('bag'), node('p', 'Penny 的袋子里有什么？')); log.replaceChildren(lead); }
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
    bubble.append(node('div', line.who === 'sam' ? 'Sam' : 'Penny', 'bname'), speech, translation, actions); row.append(bubble); log.append(row);
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
    const viewed=Array.isArray(draft.viewed)?draft.viewed.slice(0,draft.i+1):[];
    const gap=content.DIALOGUE.findIndex((_,index)=>index<=draft.i&&viewed[index]!==true);
    const i=gap<0?draft.i:gap-1;
    dialogue={i,viewed:viewed.slice(0,i+1),done:draft.done===true&&i===content.DIALOGUE.length-1};
    for(let index=0;index<=i;index++)appendLine(index);
    if(dialogue.done)complete('text');
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

  mountPractice('grammar'); mountPractice('apply');
  mountPractice('exam');
  certificateView=core.storyCertificate.mount({element:surfaces.get('certificate'),unit,go:navigate,returnUrl:$('#logo').href,
    progress:id=>runners.get(id)?.progress() || {started:false,completed:false},
    restart:id=>runners.get(id)?.restart()});

  const models=node('details','','offline-task');models.append(node('summary','换个物品问一问'));
  const modelGrid=node('div','','reference-grid');
  for(const item of content.MODELS){
    const card=node('article','','reference-card'),picture=node('img');picture.src=item.image;picture.alt='';
    const en=node('p',item.en);en.lang='en';card.append(node('small',item.number),picture,en,node('span',item.cn));modelGrid.append(card);
  }
  models.append(modelGrid);surfaces.get('grammar').append(models);
  const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'));
  writing.append(node('h4','A · 用 a、some 或 any 填空'));
  const a=node('ol');content.WRITING_A.forEach(text=>a.append(node('li',text)));writing.append(a);
  writing.append(node('h4','B · 按物品和位置问答'),node('p','例：Is there a passport here? Yes, there is. There’s one on the table.'),node('p','例：Is there any bread here? Yes, there is. There’s some on the table.'));
  const b=node('ol');content.WRITING_B.forEach(text=>b.append(node('li',text+' → ______________________________')));writing.append(b);
  const printActions=node('div','','activity-actions');printActions.append(button('打印练习纸',()=>{document.body.classList.add('print-writing');root.print();},'btn btn-yellow'));
  writing.append(printActions);surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));

  updateProgress(); practice.initializeNotebook();
  root.addEventListener('hashchange', route);
  const revealSavedLine = () => { if (dialogue.i >= 0) log.scrollTop = log.scrollHeight; };
  // Cached entry keeps the body hidden until images decode. Font readiness alone
  // can occur while the transcript has no layout and cannot restore scroll.
  // This is the loader's document event, not a canran storage key. Keep its
  // name intact when the /lesson/ publisher prefixes persistent storage keys.
  const readyEvent = ['canran', 'course-ready'].join(':');
  document.addEventListener(readyEvent, revealSavedLine, { once: true });
  document.fonts.ready.then(() => requestAnimationFrame(() => { route(); revealSavedLine(); }));
})(globalThis);
