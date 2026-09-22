(function (root) {
  'use strict';
  const context = root.CanranCore.learningContext || root.CanranCore.courseCatalog.requirePublishedCourse('lesson49');
  const KEY = context.progress.learningKey;
  const DRAFT_VERSION = 2;
  const wordImages = Object.fromEntries(context.learning.WORDS.map(word => [word.en, word.image]));
  let notebook = { version: 1, groups: {}, records: {}, activity: {} };
  let loadMessage = '';
  const isRecord = value => value && typeof value === 'object' && !Array.isArray(value);
  const newRunId = () => root.crypto?.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.version === 1 && isRecord(saved.groups) && isRecord(saved.records) && isRecord(saved.activity)) notebook = saved;
      else loadMessage = '旧练习草稿无法恢复，可以重新练习；原有星星保留。';
    }
  } catch { loadMessage = '练习记录暂时无法读取，本次可以继续学习。'; }
  function outcome(state) {
    if (!state.correct) return '首次未答对 · 建议再练';
    if (state.revealed) return '看过示范后完成 · 建议换题再练';
    if (state.firstCorrect === false) return '修正后完成';
    return state.ruleUsed ? '查看规则后完成' : state.hintUsed ? '提示后完成' : '未用额外提示答对';
  }
  function renderRecord() {
    const box = document.getElementById('learningRecord');
    if (!box) return;
    box.replaceChildren();
    const records = Object.values(notebook.records).filter(record=>isRecord(record)&&typeof record.attempts==='number'&&typeof record.firstCorrect==='boolean');
    const intro = document.createElement('p');
    intro.textContent = records.length ? '记录的是有选项或词块支持的表现。星星奖励完成活动；这份小记不评价自由口语或独立写作。' : '还没有新的作答记录。原有星星保留，新的任务从本次作答开始记录。';
    box.append(intro);
    const list = document.createElement('ul');
    records.forEach(record => {
      const item = document.createElement('li');
      const rule = typeof record.ruleUsed === 'boolean' ? `，查看规则${record.ruleUsed ? '已用' : '未用'}` : '';
      item.textContent = `${record.target} · ${record.prompt}：${outcome(record)}（首次${record.firstCorrect ? '答对' : '未答对'}，额外提示${record.hintUsed ? '已用' : '未用'}${rule}，提交 ${record.attempts} 次）`;
      list.append(item);
    });
    box.append(list);
  }
  function save() {
    const status = document.getElementById('learningSaveStatus');
    let saved = false;
    try { localStorage.setItem(KEY, JSON.stringify(notebook)); saved = true; } catch {}
    if (status) status.textContent = saved ? '学徒手记已保存在这台设备。' : '这次暂未保存，先别关闭页面。可以继续练习，再点“重试保存”。';
    const retry = document.getElementById('learningSaveRetry');
    if (retry) retry.hidden = saved;
    const warning = document.getElementById('learningSaveWarning');
    if (warning) warning.hidden = saved;
    renderRecord();
    return saved;
  }
  function record(q, state) {
    notebook.records[q.id] = { ...state, target: q.target, prompt: q.prompt };save();
  }
  function activity(key, value) {
    if (arguments.length > 1) { notebook.activity[key] = value; save(); }
    return notebook.activity[key];
  }
  // Hint wording is presentation, not a new assessment. Preserve completion
  // only when every other field (including version, questions and answers) matches.
  function sameContentSignature(saved, current) {
    if (saved === current) return true;
    if (typeof saved !== 'string' || typeof current !== 'string') return false;
    try {
      const withoutHints = signature => JSON.stringify(JSON.parse(signature), (key, value) => key === 'hint' ? undefined : value);
      return withoutHints(saved) === withoutHints(current);
    } catch { return false; }
  }
  // Only a deliberate transition may reposition the page. Selecting, checking,
  // replaying and opening hints must leave the child's controls in place.
  function revealQuestion(element, heading) {
    requestAnimationFrame(() => {
      const target = heading || element.querySelector('h3, .practice-finish > p');
      if (!target?.isConnected) return;
      target.tabIndex = -1;
      // A completion reward may open before this frame; keep its keyboard focus.
      if (!document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])')) target.focus({ preventScroll: true });
      const rect = target.getBoundingClientRect();
      const top = (document.getElementById('topbar')?.getBoundingClientRect().bottom || 0) + 16;
      if (rect.top < top || rect.bottom > root.innerHeight - 16) {
        const progress = target.closest('.practice-content, .role-question')?.querySelector('.practice-progress');
        const progressTop = progress?.getBoundingClientRect().top;
        const start = progress && rect.bottom - progressTop <= root.innerHeight - top - 16 ? progressTop : rect.top;
        root.scrollBy({ top: start - top, behavior: 'instant' });
      }
    });
  }
  function updateProgress(label, solved, currentIndex) {
    const meter = label.querySelector('.practice-meter');
    const completed = solved.filter(Boolean).length;
    meter.setAttribute('aria-valuenow', String(completed));
    meter.setAttribute('aria-valuetext', `已答对 ${completed} / ${solved.length} 题${currentIndex >= 0 ? `，当前第 ${currentIndex + 1} 题` : ''}`);
    [...meter.children].forEach((step, index) => {
      step.classList.toggle('is-complete', solved[index]);
      step.classList.toggle('is-current', index === currentIndex);
      step.title = `第 ${index + 1} 题：${solved[index] ? '已答对' : '未答对'}${index === currentIndex ? '，正在作答' : ''}`;
    });
  }
  function progressLabel(text, solved, currentIndex) {
    const label=document.createElement('p');label.className='practice-progress';
    const copy=document.createElement('span');copy.className='progress-copy';copy.textContent=text;
    const meter=document.createElement('span');meter.className='practice-meter';
    meter.setAttribute('role','progressbar');meter.setAttribute('aria-label','本轮进度');
    meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax',String(solved.length));
    solved.forEach(()=>{const step=document.createElement('span');step.className='practice-step';step.setAttribute('aria-hidden','true');meter.append(step);});
    label.append(copy,meter);updateProgress(label,solved,currentIndex);return label;
  }
  function mount({ element, questions, onComplete = () => {}, onAnswer = () => {}, onProgress = () => {}, playAudio, chunkSize = 0, finalLabel = '完成这一站', sessionId = '', legacySessionIds = [], optionImages = null, allowHints = true, sceneView = null, completionDetails = null, presentation = 'choice' }) {
    const key = sessionId ? element.id+'/'+sessionId : element.id;
    const contentSignature = JSON.stringify([context.version ?? null, questions], (field, value) => field === 'hint' ? undefined : value);
    let group = notebook.groups[key];
    const existing = group;
    const sources=sessionId && legacySessionIds.length ? [...legacySessionIds.map(id=>notebook.groups[element.id+'/'+id]),notebook.groups[element.id]]
      .filter(old=>typeof old?.signature==='string'&&Array.isArray(old.states))
      .map(old=>({...old,ids:old.signature.split('|')})) : [];
    function retainRecoveryDraft(reason){
      notebook.recoveredDrafts=isRecord(notebook.recoveredDrafts)?notebook.recoveredDrafts:{};
      notebook.recoveredDrafts[key]={reason,draft:JSON.parse(JSON.stringify(group))};
    }
    if(isRecord(group)&&group.draftVersion!==undefined&&group.draftVersion!==DRAFT_VERSION){
      retainRecoveryDraft('unsupported-draft-version');
      group=null;
    }
    if(isRecord(group)&&group.contentSignature!==undefined&&group.contentSignature!==contentSignature){
      retainRecoveryDraft('changed-question-content');
      group=null;
    }
    if (!group || group.signature !== questions.map(q => q.id).join('|') || !Number.isInteger(group.index) || group.index < 0 || group.index > questions.length || !Array.isArray(group.states)) {
      group = { index: 0, states: [], signature: questions.map(q => q.id).join('|') };
      if(sessionId && !notebook.groups[key]){
        group.states=questions.map(q=>{
          const old=sources.find(source=>source.ids.includes(q.id));
          // A restarted legacy round owns its blank slots; historical answers must not complete it again.
          return old ? old.states[old.ids.indexOf(q.id)]||null : null;
        });
        const active=sources.find(old=>Number.isInteger(old.index)&&old.ids[old.index]);
        const current=questions.findIndex(q=>q.id===active?.ids[active.index]);
        const unfinished=group.states.findIndex(state=>!state?.checked||!state.correct);
        group.index=current>=0&&unfinished>=0?Math.min(current,unfinished):current>=0?current:unfinished>=0?unfinished:questions.length;
      }
      notebook.groups[key] = group;
    }
    if(group.draftVersion!==DRAFT_VERSION){
      if(existing===group&&legacySessionIds.length){
        const active=sources.find(old=>Number.isInteger(old.index)&&old.index>=0&&old.ids[old.index]);
        const activeEnd=active?questions.reduce((last,q,i)=>active.ids.includes(q.id)?i:last,-1):-1;
        // Old all-word drafts did not record answer ownership. A still-open
        // earlier legacy round proves that later imported rounds are ambiguous.
        const later=activeEnd>=0&&activeEnd<questions.length-1?activeEnd+1:-1;
        const fromHistory=group.states.findIndex(state=>isRecord(state)&&('target' in state||'prompt' in state));
        const cut=[later,fromHistory].filter(index=>index>=0&&group.states.slice(index).some(Boolean)).sort((a,b)=>a-b)[0];
        if(cut!==undefined){
          retainRecoveryDraft('legacy-answers-outside-current-run');
          group.index=Math.min(group.index,cut);
          group.states=group.states.slice(0,cut);
          group.paused=false;
        }
      }
      group.draftVersion=DRAFT_VERSION;
      group.runId=newRunId();
      group.states=group.states.map((state,i)=>isRecord(state)?{...state,runId:group.runId,questionId:questions[i]?.id}:null);
    }
    if(typeof group.runId!=='string'||!group.runId){
      group.runId=newRunId();group.index=0;group.states=[];group.paused=false;
    }
    function emptyState(q){
      return {selection:null,attempts:0,hintUsed:false,checked:false,runId:group.runId,questionId:q.id};
    }
    function usableState(state,q){
      if(!isRecord(state)||state.runId!==group.runId||state.questionId!==q.id||
        !Number.isInteger(state.attempts)||state.attempts<0||typeof state.checked!=='boolean')return false;
      if(q.type==='order'){
        const tokens=state.tokens||[];
        if(!Array.isArray(tokens)||new Set(tokens).size!==tokens.length||
          !tokens.every(i=>Number.isInteger(i)&&i>=0&&i<q.tokens.length)||
          state.selection!==(tokens.map(i=>q.tokens[i]).join(' ')||null))return false;
      }else if(state.selection!==null&&!q.options.includes(state.selection))return false;
      return !state.checked||(state.selection!==null&&state.attempts>0&&typeof state.firstCorrect==='boolean'&&
        typeof state.correct==='boolean'&&state.correct===(state.selection===q.answer));
    }
    function passed(state,q){return usableState(state,q)&&state.checked&&state.correct;}
    function normalizeDraft(){
      for(let i=0;i<Math.min(group.states.length,group.index+1,questions.length);i++){
        if(!usableState(group.states[i],questions[i]))group.states[i]=emptyState(questions[i]);
      }
      const gap=questions.findIndex((q,i)=>i<group.index&&!passed(group.states[i],q));
      if(gap>=0){group.index=gap;group.paused=false;}
      // Future answers never belong to a sequential run. A historical score
      // cannot fill a gap or unlock the completion screen.
      group.states.length=Math.min(group.states.length,group.index+1,questions.length);
    }
    normalizeDraft();
    // Older drafts still pass the ownership/answer validation above; from this
    // revision onward a changed prompt cannot silently re-award completion.
    group.contentSignature=contentSignature;
    save();
    function button(label, action, className = 'btn btn-green') {
      const item = document.createElement('button');
      item.type = 'button'; item.className = className; item.textContent = label;
      item.addEventListener('click', action);
      return item;
    }
    function render() {
      element.replaceChildren();
      element.classList.add('practice-runner');
      element.classList.toggle('role-runner', Boolean(sceneView));
      if(group.index<questions.length)onProgress();
      if (group.paused) {
        const pauseCopy=document.createElement('h3');pauseCopy.textContent=group.paused==='break'?`已完成 ${group.index} / ${questions.length} 题`:`已暂停 · 第 ${group.index+1} / ${questions.length} 题`;
        const pause=document.createElement('div');pause.className='practice-pause';
        pause.append(root.CanranCore.lesson49Icons.create('order'),pauseCopy,button(group.paused==='break'?'继续第二段（5 题）':'继续挑战',()=>{group.paused=false;save();render();revealQuestion(element);}));
        element.append(pause);return;
      }
      if (group.index === questions.length) {
        if(!questions.every((q,i)=>passed(group.states[i],q))){normalizeDraft();save();render();return;}
        const summary = document.createElement('p');
        summary.textContent = sceneView ? '破案完成！' : optionImages ? '寻宝完成！' : chunkSize ? '挑战完成！' : '这一组完成了！';
        sceneView?.finish();
        const finish=document.createElement('div');finish.className='practice-finish';
        const again=button('再练一轮', () => { group.index = 0; group.states = []; group.runId = newRunId(); save(); render();revealQuestion(element,sceneView?.heading()); },'btn btn-mini btn-yellow');
        const stamp=root.CanranCore.lesson49Icons.create(sceneView?'people':'check');stamp.classList.add('finish-icon');
        finish.append(stamp,summary);
        if(completionDetails)finish.append(completionDetails);
        const finishActions=document.createElement('div');finishActions.className='practice-finish-actions';
        finishActions.setAttribute('role','group');finishActions.setAttribute('aria-label','完成后的操作');
        finishActions.append(again);finish.append(finishActions);
        element.append(finish);
        onComplete(group.states); return;
      }
      const q = questions[group.index];
      element.dataset.kind = q.type === 'order' ? 'order' : q.delivery ? 'delivery' : q.audioText ? 'listening' : q.presentation || presentation;
      const images = q.optionImages || optionImages || (q.audioText ? wordImages : null);
      const hintsEnabled = allowHints && !q.audioText && typeof q.hint === 'string' && q.hint.trim().length > 0;
      const content = document.createElement('div'); content.className = 'practice-content';
      const actions = document.createElement('div'); actions.className = 'practice-actions';
      const previous = group.states[group.index];
      const state = usableState(previous,q) ? previous : emptyState(q);
      group.states[group.index] = state;
      const solvedQuestions = () => questions.map((question, index) => passed(group.states[index], question));
      const progress = progressLabel(`第 ${group.index + 1} / ${questions.length} 题`, solvedQuestions(), group.index);
      const prompt = document.createElement('h3'); prompt.textContent = q.prompt; prompt.tabIndex = -1;
      if(element.dataset.kind === 'reply') {
        prompt.replaceChildren();
        q.prompt.split('\n').forEach((line,index) => {
          const row=document.createElement('span');row.className='relay-line';
          row.append(root.CanranCore.lesson49Icons.create(index===0?'lily':'tom'),document.createTextNode(line));
          if(index)prompt.append(document.createTextNode('\n'));
          prompt.append(row);
        });
      }
      const options = document.createElement('div'); options.className = 'practice-options'+(q.delivery?' delivery-options':'');
      if(q.type==='order'){options.classList.add('sentence-options');options.classList.toggle('sentence-long',q.tokens.length>3);}
      if (sceneView) { options.setAttribute('role','group'); options.setAttribute('aria-label','选择回应'); }
      const deliverySlots=new Map();
      const deliverySource=document.createElement('div');deliverySource.className='delivery-source';
      const parcel=document.createElement(q.image?'img':'span');parcel.className='delivery-parcel';
      const deliverySuccess=document.createElement('p');deliverySuccess.className='delivery-success';
      deliverySuccess.hidden=true;
      if(q.image)parcel.src=q.image;else{parcel.append(root.CanranCore.lesson49Icons.create('steak'));parcel.setAttribute('role','img');}
      if(q.delivery){const counter=document.createElement('span');counter.append(root.CanranCore.lesson49Icons.create('butcher'),'柜台');deliverySource.append(counter,parcel);}
      const feedback = document.createElement('div'); feedback.className = 'fb'; feedback.setAttribute('role', 'status'); feedback.setAttribute('aria-live','polite'); feedback.setAttribute('aria-atomic','true');
      const hintCopy = document.createElement('p'); hintCopy.className = 'practice-hint'; hintCopy.hidden = !state.hintUsed; hintCopy.textContent = q.hint || '';
      hintCopy.id=element.id+'-hint';
      const hint = button('给点线索', () => { state.hintUsed = true; hintCopy.hidden = false; hint.setAttribute('aria-expanded','true'); save(); }, 'btn btn-mini btn-yellow');
      hint.setAttribute('aria-controls',hintCopy.id);hint.setAttribute('aria-expanded',String(!hintCopy.hidden));
      hint.classList.add('practice-hint-button');hint.setAttribute('aria-label','给点线索');hint.title='给点线索';
      hint.replaceChildren(root.CanranCore.lesson49Icons.create('hint'));
      let audioReady = !q.audioText || state.checked;
      let audioGeneration = 0;
      function canCheck(){
        return !state.checked&&audioReady&&state.selection!==null&&(q.type!=='order'||state.tokens?.length===q.tokens.length);
      }
      const audioNote = document.createElement('p'); audioNote.className = 'practice-audio-status';
      audioNote.setAttribute('aria-live','polite');
      const replay = button('', () => {
        const token = ++audioGeneration;
        audioReady = false; check.disabled = true; audioNote.textContent = '';
        replay.setAttribute('aria-label','再听一遍');replay.setAttribute('aria-busy','true');
        playAudio(q.audioText, result => {
          if(token !== audioGeneration)return;
          audioReady = result.reason === 'ended';
          replay.setAttribute('aria-busy','false');
          audioNote.textContent = audioReady ? '' : '播放未完成，请重听。';
          check.disabled = !canCheck();
        });
      }, 'btn btn-yellow practice-audio-button');
      replay.setAttribute('aria-label','听一遍');
      replay.append(root.CanranCore.lesson49Icons.create('audio'));
      const modelCopy=document.createElement('p');modelCopy.textContent=q.model||'';modelCopy.hidden=!state.revealed;
      const model=button('看原句',()=>{state.revealed=true;state.hintUsed=true;modelCopy.hidden=false;save();},'btn btn-mini btn-yellow');model.hidden=!q.model;
      const check = button('检查答案', submit);
      const retry = button('再试一次', () => { state.selection = null; state.tokens = []; state.checked = false; save(); render(); });
      const questionIndex = group.index;
      const next = button(group.index===questions.length-1?finalLabel:'下一题', () => {
        if(group.index!==questionIndex||!passed(state,q))return;
        group.states.length=group.index+1;
        group.index++;
        if(chunkSize&&group.index<questions.length&&group.index%chunkSize===0)group.paused='break';
        save(); render();
        if(group.index===questions.length)root.CanranCore.lesson49Feedback.play('complete');
        revealQuestion(element,sceneView?.heading());
      });
      const answerLine = document.createElement('div'); answerLine.className = 'word-answer'; answerLine.setAttribute('role','group'); answerLine.setAttribute('aria-label','已选词块');
      const bank = document.createElement('div'); bank.className = 'wordbank'; bank.setAttribute('role','group'); bank.setAttribute('aria-label','待选词块');
      function wordToken(tokenIndex, placed=false){
        const text=q.tokens[tokenIndex];
        const token=button('',()=>{
          if(state.checked)return;
          if(placed)state.tokens=state.tokens.filter(index=>index!==tokenIndex);
          else if(!state.tokens.includes(tokenIndex))state.tokens.push(tokenIndex);
          updateTokens();save();
          (placed?bank:answerLine).querySelector(`[data-token="${tokenIndex}"]`)?.focus({preventScroll:true});
        },'opt-btn word-token');
        token.dataset.token=tokenIndex;token.setAttribute('aria-label',placed?'撤回 '+text:text);
        const label=document.createElement('span');label.lang='en';label.textContent=text;
        const mark=document.createElement('span');mark.className='word-token-mark';mark.setAttribute('aria-hidden','true');mark.textContent=placed?'×':'+';
        token.append(label,mark);return token;
      }
      function updateTokens() {
        answerLine.replaceChildren();
        state.tokens.forEach(tokenIndex => answerLine.append(wordToken(tokenIndex,true)));
        state.selection = state.tokens.map(i=>q.tokens[i]).join(' ') || null;
        bank.querySelectorAll('button').forEach(b=>{
          const placed=state.tokens.includes(Number(b.dataset.token));
          b.disabled=state.checked||placed;b.classList.toggle('is-placed',placed);b.setAttribute('aria-pressed',String(placed));
        });
        answerLine.querySelectorAll('button').forEach(b=>{b.disabled=state.checked;});
        check.disabled = !canCheck();
      }
      const values = q.type === 'order' ? q.tokens.map((_,i)=>i) : q.options.slice();
      const stableOrder=q.type==='order'&&Array.isArray(state.tokenOrder)&&state.tokenOrder.length===values.length&&
        new Set(state.tokenOrder).size===values.length&&state.tokenOrder.every(i=>Number.isInteger(i)&&i>=0&&i<values.length);
      if(stableOrder)values.splice(0,values.length,...state.tokenOrder);
      else{
        for(let i=values.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[values[i],values[j]]=[values[j],values[i]];}
        if(q.type==='order'){state.tokenOrder=values.slice();save();}
      }
      if(q.type === 'order') {
        state.tokens = state.tokens || [];
        values.forEach(tokenIndex=>bank.append(wordToken(tokenIndex)));
        options.append(answerLine,bank);updateTokens();
      } else values.forEach(value => {
        const option = button(value, () => {
          state.selection = value;
          options.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === option)));
          check.disabled = !canCheck(); save();
        }, 'opt-btn');
        const imageSource = images?.[value];
        if(imageSource){
          const picture=document.createElement('img');picture.src=imageSource;picture.alt='';
          const label=document.createElement('span');label.textContent=value;
          option.replaceChildren(picture,label);option.classList.add('picture-option');
        }
        if(element.dataset.kind==='preferences'){
          option.setAttribute('aria-label',value);option.classList.add('preference-option');option.replaceChildren();
          value.split(' · ').forEach((text,index)=>{
            const line=document.createElement('span');line.className='preference-line';
            line.append(root.CanranCore.lesson49Icons.create(index===0?'bird':'husband'),document.createTextNode(text));option.append(line);
          });
        }
        if(q.delivery){
          option.setAttribute('aria-label',value);
          const actor=document.createElement('span');actor.className='delivery-person';actor.append(root.CanranCore.lesson49Icons.create(value==='Lily'?'lily':'tom'));actor.setAttribute('aria-hidden','true');
          const name=document.createElement('span');name.textContent=value;
          const slot=document.createElement('span');slot.className='delivery-slot';deliverySlots.set(value,slot);
          option.replaceChildren(actor,name,slot);
        }
        option.setAttribute('aria-pressed', String(state.selection === value)); option.disabled = state.checked; options.append(option);
      });
      const morphScene=document.createElement('div');morphScene.className='morph-scene';morphScene.hidden=true;
      morphScene.setAttribute('role','group');morphScene.setAttribute('aria-label','句型变换');
      const morph=button('播放变身魔法',()=>{
        morphScene.hidden=false;morphScene.replaceChildren();
        const before=document.createElement('span');before.className='morph-sentence';before.textContent=q.morph.from;
        const arrow=document.createElement('span');arrow.className='morph-arrow';arrow.textContent=' → ';arrow.setAttribute('aria-hidden','true');
        const after=document.createElement('span');after.className='morph-sentence';
        q.morph.to.split(/(\bto\b)/).forEach(part=>{if(part==='to'){const connector=document.createElement('mark');connector.textContent=part;after.append(connector);}else after.append(document.createTextNode(part));});
        morphScene.append(before,arrow,after);morphScene.classList.remove('show');void morphScene.offsetWidth;morphScene.classList.add('show');
      },'btn btn-yellow');
      function showFeedback() {
        updateProgress(progress, solvedQuestions(), passed(state,q) ? -1 : group.index);
        sceneView?.answer(state.checked && state.correct ? state.selection : null);
        if(q.delivery){
          const delivered=state.checked&&state.correct;
          (delivered?deliverySlots.get(q.delivery):deliverySource).append(parcel);
          const label=delivered?'已送给 '+q.delivery+' 的肉品':'等待交接的肉品';
          if(q.image)parcel.alt=label;else parcel.setAttribute('aria-label',label);
          parcel.classList.toggle('arrived',Boolean(delivered));
          deliverySuccess.hidden=!delivered || !q.successText;
          deliverySuccess.textContent=delivered ? q.successText || '' : '';
        }
        check.disabled = !canCheck();
        check.hidden = state.checked; retry.hidden = !state.checked || state.correct; next.hidden = !state.checked || !state.correct;
        model.hidden=!q.model;model.classList.toggle('is-idle',state.checked);
        hint.disabled=state.checked;hintCopy.hidden=state.checked||!state.hintUsed;
        hint.setAttribute('aria-expanded',String(!hintCopy.hidden));
        morph.hidden = !q.morph || !state.checked || !state.correct;
        feedback.textContent = state.checked ? (state.correct ? '答对了！' : '再看看，试一次。') : '';
        // Feedback never supplies the answer, including after repeated errors
        // or a restored draft. Only the child can solve the current question.
        feedback.className = 'fb ' + (state.checked ? (state.correct ? 'good' : 'bad') : '');
      }
      function submit() {
        if (!canCheck()) return;
        state.correct = state.selection === q.answer;
        if (!state.attempts) state.firstCorrect = state.correct;
        state.attempts++; state.checked = true;
        notebook.records[q.id] = { ...state, target: q.target, prompt: q.prompt };
        options.querySelectorAll('button').forEach(b => { b.disabled = true; });
        showFeedback(); save();
        root.CanranCore.lesson49Feedback.play(state.correct ? 'correct' : 'incorrect');
        onAnswer(q, state);
      }
      content.append(progress,prompt);
      if(q.lesson){const example=document.createElement('details');example.className='practice-example';const title=document.createElement('summary');title.textContent='看例子';const copy=document.createElement('p');copy.textContent=q.lesson;example.append(title,copy);content.append(example);}
      const helpers=document.createElement('div');helpers.className='practice-helpers';
      if(q.model)helpers.append(model);
      if(chunkSize){
        const tools=document.createElement('div');tools.className='practice-session-tools';
        const pause=button('暂停',()=>{group.paused='manual';save();render();revealQuestion(element);},'workspace-back');
        pause.setAttribute('aria-label','暂停，稍后继续');tools.append(pause);element.append(tools);
      }
      if(q.audioText){
        const audioControls=document.createElement('div');audioControls.className='practice-audio-controls';
        audioControls.append(replay);
        if(helpers.childElementCount)audioControls.append(helpers);
        audioControls.append(audioNote);content.append(audioControls);
      }else{
        if(helpers.childElementCount)content.append(helpers);
        if(q.audioText)content.append(audioNote);
      }
      if(q.model)content.append(modelCopy);
      if(q.delivery)content.append(deliverySource);
      else if(q.image){const picture=document.createElement('img');picture.className='practice-scene';picture.src=q.image;picture.alt=q.imageAlt;content.append(picture);}
      content.append(options);
      if(q.delivery)content.append(deliverySuccess);
      if(q.morph){morph.classList.add('practice-morph');content.append(morph,morphScene);}
      const note=document.createElement('div');note.className='practice-answer-note';
      note.setAttribute('role','region');note.setAttribute('aria-label','答题反馈');note.tabIndex=0;
      note.append(feedback);
      if(hintsEnabled)note.append(hintCopy);
      const row=document.createElement('div');row.className='practice-submit-row';row.setAttribute('role','group');row.setAttribute('aria-label','作答操作');
      if(hintsEnabled)row.append(hint);else row.classList.add('without-hint');
      row.append(check,retry,next);actions.append(note,row);
      element.append(content,actions);
      if (sceneView) {
        progress.classList.add('role-progress'); prompt.remove();
        sceneView.present(q, progress);
      }
      showFeedback();
    }
    render();
  }
  function initializeNotebook() {
    const status = document.getElementById('learningSaveStatus');
    if (status) status.textContent = loadMessage;
    document.getElementById('learningSaveRetry')?.addEventListener('click', save);
    renderRecord();
  }
  root.CanranCore = root.CanranCore || {};
  root.CanranCore.lesson49Practice = { mount, activity, record, initializeNotebook, revealQuestion, progressLabel, sameContentSignature };
})(globalThis);
