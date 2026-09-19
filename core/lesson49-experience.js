(function (root) {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const levels = root.CanranCore.courseCatalog.requirePublishedCourse('lesson49').learning.WORKSPACE;
  const activities = levels.flatMap(level => level.activities.map(activity => ({ ...activity, level: level.id })));
  const learning = root.CanranCore.lesson49Practice;
  const icon = root.CanranCore.lesson49Icons.create;
  history.scrollRestoration = 'manual';
  const depot = document.createElement('div');
  depot.hidden = true; depot.id = 'activityDepot'; document.body.append(depot);
  function group(...selectors) {
    const node = document.createElement('div');
    selectors.forEach(selector => { const child = $(selector); if (child) node.append(child); });
    return node;
  }
  function button(label, action, className = 'workspace-back') {
    const node = document.createElement('button'); node.type = 'button'; node.className = className;
    node.textContent = label; node.addEventListener('click', action); return node;
  }
  const surfaces = {
    words: group('#cardGrid'), listen: $('#listenGame'),
    text: group('#stage', '.stage-ctrl', '#l2done'), roles: group('#roleBar', '#rolePractice'),
    doare: $('#t3a'), give: $('#t3b'), pouch: $('#t3c'), either: $('#t3d'),
    subjects: $('#subjectPractice').closest('.panel'), fill: $('#fillList').closest('.panel'),
    choice: $('#choiceList').closest('.panel'), trans: $('#transList').closest('.panel'),
    exam: group('#quizStartBox', '#quizBox', '#quizResult'), certificate: group('#certArea', '#l49CertificateGate')
  };
  const help = {};
  help.listen = group('#listenRecord');
  for (const [id, selector] of Object.entries({doare:'#doarePractice',give:'#givePractice',pouch:'#pouchPractice',either:'#eitherPractice',fill:'#fillList',choice:'#choiceList',trans:'#transList'})) {
    const practice = $(selector), surface = surfaces[id], reference = document.createElement('div');
    const pouches = id === 'pouch' ? $('#pouchGrid') : null;
    practice.remove(); pouches?.remove();
    while (surface.firstChild) reference.append(surface.firstChild);
    if (pouches) surface.append(pouches);
    surface.append(practice); help[id] = reference;
  }
  const lesson = root.CanranCore.courseCatalog.requirePublishedCourse('lesson49').learning;
  for (const [id, copies] of Object.entries({subjects:lesson.SUBJECTS.help,doare:lesson.DOARE_HELP,
      fill:lesson.VERB_HELP,choice:lesson.VERB_HELP,trans:lesson.VERB_HELP})) {
    help[id] = document.createElement('div');
    copies.forEach(copy => { const p = document.createElement('p'); p.textContent = copy; help[id].append(p); });
  }
  const instructions = {
    words:'点词卡，听发音、翻面看意思。看完三组，再去听音寻宝。',
    text:'点句子可以重听，上滑对话区可以回看。每句听完，点“下一句”。',
    roles:'听完课文，找出故事里的答案，再试试新的情境。点英文可重听，选好后检查，答对再继续。',
    exam:'用学过的本领挑战 10 道题，两段各 5 题。可以暂停后回来。',
    certificate:'五关各集齐三颗星，就能领取、保存或打印自己的学徒证书。'
  };
  for (const [id, copy] of Object.entries(instructions)) {
    help[id] = document.createElement('p'); help[id].textContent = copy;
  }
  Object.values(help).forEach(node => depot.append(node));

  const workspace = document.createElement('main'); workspace.id = 'lessonWorkspace';
  const home = $('#cover'); home.after(workspace);
  const nav = document.createElement('nav'); nav.id = 'chapterNav'; nav.setAttribute('aria-label','学习关卡');
  const navLinks = document.createElement('div'); navLinks.className = 'chapter-links';
  const selectLabel = document.createElement('label'); selectLabel.className = 'chapter-select'; selectLabel.textContent = '所在关卡';
  const select = document.createElement('select'); select.id = 'chapterSelect'; select.setAttribute('aria-label','选择关卡');
  select.addEventListener('change', () => navigate(select.value)); selectLabel.append(select);
  nav.append(navLinks,selectLabel); $('#topbar').append(nav);
  const stages = {}, onward = {};
  let activeId = null;
  const oldLevels = [...document.querySelectorAll('section.lvl')];
  oldLevels.forEach(node => node.id = 'source-' + node.id);
  levels.forEach((level, index) => {
    const section = document.createElement('section'); section.id = level.id; section.className = 'shop-chapter';
    const header = document.createElement('header'); header.className = 'chapter-heading';
    const number = document.createElement('span'); number.className = 'chapter-number'; number.textContent = String(index + 1).padStart(2,'0'); number.setAttribute('aria-hidden','true');
    const title = document.createElement('h2'); title.id = level.id + '-title'; title.tabIndex = -1; title.textContent = level.title;
    header.append(number,title,$('#st-' + level.id)); section.append(header);
    const link = document.createElement('a'); link.href = '#' + level.id; link.textContent = level.title;
    link.addEventListener('click', event => { event.preventDefault(); navigate(level.id); }); navLinks.append(link);
    const option = document.createElement('option'); option.value = level.id; option.textContent = level.title; select.append(option);
    level.activities.forEach(activity => {
      const stage = document.createElement('section'); stage.id = 'learn/' + activity.id; stage.className = 'shop-stage stage-' + activity.id;
      stage.dataset.activity = activity.id; stage.setAttribute('aria-labelledby','title-' + activity.id);
      const heading = document.createElement('header'); heading.className = 'stage-heading';
      const name = document.createElement('h3'); name.id = 'title-' + activity.id; name.tabIndex = -1; name.textContent = activity.title;
      heading.append(icon(activity.icon),name,button('怎么玩', () => openHelp(activity.id)));
      const surface = surfaces[activity.id]; surface.classList.add('activity-surface','on');
      surface.querySelectorAll(':scope > h3, :scope > .panel > h3').forEach(node => node.remove());
      stage.append(heading,surface); stages[activity.id] = stage;
      const next = activities[activities.findIndex(item => item.id === activity.id) + 1];
      if (next && activity.id !== 'words') {
        const footer = document.createElement('footer'); footer.className = 'station-actions'; footer.hidden = true;
        footer.append(button('下一站：' + next.title, () => navigate('learn/' + next.id), 'btn btn-green'));
        stage.append(footer); onward[activity.id] = footer;
      }
      section.append(stage);
    });
    workspace.append(section);
  });
  // Retain nonvisual result nodes used by the existing progress renderer.
  depot.append(group('#l4result'));
  oldLevels.forEach(node => node.remove());
  $('#sectionDots')?.remove(); $('#coursenav')?.remove(); $('#cnToast')?.remove();

  const wordCards = [...$('#cardGrid').children], pageSize = 6;
  let wordPage = Number(learning.activity('wordPage')) || 0;
  // Migrate the four-card draft to the group containing the same first word.
  if (learning.activity('wordPageSize') !== pageSize) wordPage = Math.floor(wordPage * 4 / pageSize);
  const wordPages = Math.ceil(wordCards.length / pageSize);
  wordPage = Math.max(0,Math.min(wordPages - 1,wordPage));
  const wordControls = document.createElement('div'); wordControls.className = 'word-controls';
  const wordPrevious = button('上一组词卡', () => { wordPage--; showWordPage(); },'btn btn-mini btn-yellow');
  const wordProgress = document.createElement('span'); wordProgress.id = 'wordPageProgress'; wordProgress.setAttribute('aria-live','polite');
  const wordNext = button('下一组词卡', () => {
    if (wordPage === wordPages - 1) { navigate('learn/listen'); $('#lgStartBtn').click(); }
    else { wordPage++; showWordPage(); }
  },'btn btn-green');
  wordControls.append(wordPrevious,wordProgress,wordNext); surfaces.words.append(wordControls);
  function showWordPage() {
    wordCards.forEach((card,index) => card.hidden = Math.floor(index / pageSize) !== wordPage);
    wordProgress.textContent = (wordPage + 1) + ' / ' + wordPages;
    wordPrevious.disabled = wordPage === 0;
    if(wordPage===wordPages-1){
      const prefix=document.createElement('span');prefix.textContent='下一站：';
      const destination=document.createElement('span');destination.textContent='听音寻宝';
      wordNext.replaceChildren(prefix,destination);wordNext.setAttribute('aria-label','下一站：听音寻宝');
    }else{wordNext.textContent='下一组词卡';wordNext.removeAttribute('aria-label');}
    learning.activity('wordPageSize',pageSize); learning.activity('wordPage',wordPage);
  }
  showWordPage();

  // Keep one action cluster per completed activity, including the two custom flows.
  function finishArea(summary) {
    const finish=document.createElement('div');finish.className='practice-finish';finish.hidden=true;
    const stamp=icon('check');stamp.classList.add('finish-icon');
    const actions=document.createElement('div');actions.className='practice-finish-actions';
    actions.setAttribute('role','group');actions.setAttribute('aria-label','完成后的操作');
    finish.append(stamp,summary,actions);
    return {finish,actions};
  }
  const dialogueControls=$('.stage-ctrl'),dialogueNext=$('#nextBtn');
  const textFinish=finishArea($('#l2done'));surfaces.text.append(textFinish.finish);

  const notes = document.createElement('dialog'); notes.id = 'notesDialog'; notes.setAttribute('aria-label','学徒手记');
  const notebook = $('#learningNotebook'); notebook.open = true; notebook.querySelector('summary').textContent = '本次记录';
  notes.append(button('关闭', () => notes.close(),'btn btn-mini btn-yellow'),notebook); document.body.append(notes);
  $('#topbar .wrap').append(button('学徒手记', () => notes.showModal()));
  const helpDialog = document.createElement('dialog'); helpDialog.id = 'activityHelpDialog'; helpDialog.setAttribute('aria-labelledby','helpTitle');
  const helpTitle = document.createElement('h2'); helpTitle.id = 'helpTitle';
  const helpBody = document.createElement('div');
  helpDialog.append(button('关闭', () => helpDialog.close(),'btn btn-mini btn-yellow'),helpTitle,helpBody); document.body.append(helpDialog);
  function openHelp(id) {
    if (id === 'subjects') root.CanranCore.lesson49Subjects.markRuleUsed();
    while (helpBody.firstChild) depot.append(helpBody.firstChild);
    helpTitle.textContent = activities.find(item => item.id === id).title + ' · 怎么玩';
    helpBody.append(help[id]); helpDialog.showModal();
  }
  helpDialog.addEventListener('close', () => { while (helpBody.firstChild) depot.append(helpBody.firstChild); });
  for (const reference of Object.values(help)) {
    reference.querySelectorAll('h3').forEach(node => node.remove());
    reference.querySelectorAll('h4,.rulecard').forEach(node => {
      if (node.firstChild?.nodeType === Node.TEXT_NODE) node.firstChild.textContent = node.firstChild.textContent.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u,'');
    });
  }
  function updateOnward() {
    const hide=(node,value)=>{if(node.hidden!==value)node.hidden=value;};
    const sessionTools=surfaces.exam.querySelector('.practice-session-tools');
    const examHeading=stages.exam.querySelector('.stage-heading');
    if(sessionTools){
      examHeading.querySelector('.practice-session-tools')?.remove();
      examHeading.insertBefore(sessionTools,examHeading.lastElementChild);
    }
    const pauseTools=examHeading.querySelector('.practice-session-tools');
    if(pauseTools)hide(pauseTools,!surfaces.exam.querySelector('.practice-content'));
    const textDone=learning.activity('dialogueDraft')?.done===true;
    hide(textFinish.finish,!textDone);hide(dialogueControls,textDone);
    const dialogueDestination=textDone?textFinish.actions:dialogueControls;
    if(dialogueNext.parentElement!==dialogueDestination)dialogueDestination.append(dialogueNext);
    for (const [id, footer] of Object.entries(onward)) {
      const complete = id === 'text' ? textDone
        : id === 'roles' ? !$('#rolePractice').hidden && !!$('#rolePractice .practice-finish')
        : !!surfaces[id].querySelector('.practice-finish');
      const actions=complete ? surfaces[id].querySelector('.practice-finish-actions') : null;
      const destination=actions || stages[id];
      if(footer.parentElement !== destination){
        if(actions)actions.append(footer);else destination.append(footer);
      }
      if (footer.hidden === complete) footer.hidden = !complete;
    }

  }
  new MutationObserver(updateOnward).observe(workspace,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class']});
  updateOnward();
  function activate(id) {
    if (activeId === id) return;
    if (activeId && activeId !== id) root.dispatchEvent(new CustomEvent('lesson49:leave-activity'));
    activeId = id;
    if (id) { learning.activity('workspaceRoute','learn/' + id); $('#startBtn').textContent = '继续上次'; }
  }
  // Stop the previous activity before the new click starts its pronunciation.
  function eventStage(event) {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    return target?.closest('.shop-stage');
  }
  workspace.addEventListener('click', event => {
    const stage = eventStage(event); if (stage && stage.dataset.activity !== activeId) activate(stage.dataset.activity);
  },true);
  workspace.addEventListener('focusin', event => {
    const stage = eventStage(event); if (stage && stage.dataset.activity !== activeId) activate(stage.dataset.activity);
  });
  function markChapter(id) {
    for (const link of navLinks.children) {
      if (link.hash === '#' + id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
    }
    select.value = id;
  }
  function show(route, smooth = false) {
    const activity = activities.find(item => route === 'learn/' + item.id);
    const level = levels.find(item => item.id === route);
    const target = activity ? stages[activity.id] : level ? document.getElementById(level.id) : home;
    activate(activity?.id || null); markChapter(activity?.level || level?.id || levels[0].id);
    target.scrollIntoView({block:'start',behavior:smooth && !root.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant'});
    (target.querySelector('h2,h3') || target.querySelector('h1'))?.focus({preventScroll:true});
  }
  function navigate(route) { history.pushState(null,'','#' + route); show(route,true); }
  let scrollFrame = null;
  root.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      const line = $('#topbar').getBoundingClientRect().bottom + 80;
      const current = levels.filter(level => document.getElementById(level.id).getBoundingClientRect().top < line).at(-1);
      markChapter(current?.id || levels[0].id);
    });
  },{passive:true});
  root.addEventListener('hashchange', () => show(location.hash.slice(1)));
  root.addEventListener('popstate', () => show(location.hash.slice(1)));
  document.body.classList.add('lesson-workspace');
  $('#logo').replaceChildren(icon('back'),'我的课程');
  $('#logo').setAttribute('aria-label','我的课程');
  home.querySelector('.en-title').textContent = "At the Butcher's";
  home.querySelector('.sub').textContent = '新概念英语 · Lesson 49';
  home.querySelector('.cover-txt > p').textContent = '认识肉店里的新朋友，集齐 15 颗星，成为肉店小学徒。';
  $('#startBtn').textContent = learning.activity('workspaceRoute') ? '继续上次' : '开始冒险';
  $('#startBtn').addEventListener('click', () => navigate(learning.activity('workspaceRoute') || 'learn/words'));
  $('#starCountWrap').firstChild.textContent = ''; $('#starCountWrap').prepend(icon('star'));
  document.querySelectorAll('.spk').forEach(node => { node.replaceChildren(icon('audio')); if (!node.hasAttribute('aria-label')) node.setAttribute('aria-label','听发音'); });
  for (const [selector,name,label] of [['#certSave','cards','保存图片'],['#certPrint','book','打印'],['#certBtn','star','领取证书']]) $(selector).replaceChildren(icon(name),label);
  $('#certModal .cert-ribbon').replaceChildren(icon('star'));
  $('#quizStartBox .big-emoji').replaceChildren(icon('butcher','肉店老板'));
  for (const [id,kind,label] of [['#charButcher','butcher','BUTCHER 老板'],['#charBird','bird','MRS. BIRD']]) {
    const tag = $(id + ' .name-tag'); tag.textContent = label;
    $(id).replaceChildren(icon(kind),tag);
  }
  $('#topbar').append($('#speechNotice'));
  $('#l49CertificateGate [data-certificate-icon]').replaceChildren(icon('star'));
  root.CanranCore.lesson49Experience = { navigate };
  // Fonts and restored draft heights settle before resolving a bookmarked stage.
  document.fonts.ready.then(() => { if (location.hash) show(location.hash.slice(1)); else markChapter(levels[0].id); });
})(globalThis);
