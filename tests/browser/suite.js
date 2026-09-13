(async function () {
  'use strict';
  const shard = new URLSearchParams(location.search).get('shard');
  const config = await (await fetch('/__qa__/config.json'+(shard===null?'':'?shard='+encodeURIComponent(shard)))).json();
  const report = {schema:1, fingerprint:config.fingerprint, token:config.token, shard:config.shard, status:'running', checks:[], mutations:[]};
  const status = document.querySelector('#status'), results = document.querySelector('#results');
  const inspection=new URLSearchParams(location.search).get('inspect'), inspected=new Set();
  const postCoursePreflight=window.__postCoursePreflight;
  const pause = () => new Promise(resolve=>setTimeout(resolve,0));
  const wait = async predicate => {for(let i=0;i<3000;i++){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,5));}throw Error('Fixture did not become ready');};
  let frame;
  async function open(viewport, loader=false) {
    frame?.remove(); frame=document.createElement('iframe');
    frame.width=viewport[0];frame.height=viewport[1];frame.title='实际课程渲染 '+viewport.join(' × ');
    frame.src=loader?'/__qa__/loader.html':'/__qa__/frame.html';document.querySelector('#frames').append(frame);
    await wait(()=>frame.contentWindow?.axe && (loader || frame.contentWindow.fixture?.ready));
    await settle();
    const win=frame.contentWindow;
    if(win.innerWidth-win.document.documentElement.clientWidth<1)throw Error('Reserved scrollbar fixture is inactive; do not hide Chromium scrollbars');
    return win;
  }
  // Layout assertions wait for the student-facing preparation screen to finish.
  // Cold image readiness itself is tested at DOM insertion in test:loading.
  // playing can replace the waiting controls; collect images after that render.
  async function settle(){await pause();await pause();const win=frame.contentWindow;await wait(()=>!win.document.querySelector('.lp-preparation')&&win.fixture?.runtime.snapshot().audio?.status!=='loading');await win.document.fonts.ready;await Promise.all(Array.from(win.document.images).map(img=>img.decode().catch(()=>{})));await Promise.all(win.document.getAnimations().filter(animation=>{const timing=animation.effect?.getTiming();return timing&&timing.iterations!==Infinity&&Number(timing.duration)*timing.iterations<=600;}).map(animation=>animation.finished.catch(()=>{})));}
  async function reloadFrame() {
    const previous=frame.contentWindow.fixture,key=previous.runtime.storageKey;
    const saved=previous.adapter.load(key);
    // Reboot the actual page/controller, retaining only the test storage and clock.
    window.fixtureReloadSeed={records:{[key]:{revision:saved.revision,value:saved.value}},key,draft:previous.adapter.loadDraft(key).value,now:previous.now};
    frame.contentWindow.location.reload();
    await wait(()=>frame.contentWindow?.fixture && frame.contentWindow.fixture!==previous && frame.contentWindow.fixture.ready);
    await settle();
  }
  function view(){return frame.contentWindow.fixture.runtime.snapshot();}
  async function progressNegativeControl(){
    // A progress bar belongs to an active lesson. Run this before the full
    // course walk, so an invalid fixture fails early instead of at settlement.
    const bar=frame.contentDocument.querySelector('.lp-header [role="progressbar"]');
    if(view().screen!=='activity'||!bar)throw Error('Progress negative control requires an active lesson with its progress bar');
    const maximum=bar.getAttribute('aria-valuemax'),value=bar.getAttribute('aria-valuenow');
    try{
      bar.setAttribute('aria-valuemax','11');bar.setAttribute('aria-valuenow','1');
      const result=await auditReadability(frame.contentWindow,{name:'route-progress-in-lesson',expectedTheme:'dark'});
      const caught=result.errors.some(e=>e.rule==='session-progress-scope');
      report.mutations.push({name:'route-progress-in-lesson',caught,errors:result.errors});
      if(!caught)throw Error('Negative control escaped: route-progress-in-lesson');
    }finally{bar.setAttribute('aria-valuemax',maximum);bar.setAttribute('aria-valuenow',value);}
  }
  function query(action,id){return Array.from(frame.contentDocument.querySelectorAll('button[data-action]')).find(el=>el.dataset.action===action&&(id===undefined||el.dataset.id===id)&&!el.disabled);}
  async function settleScroll() {
    const win=frame.contentWindow;let previous=NaN,stable=0;
    // Native smooth scrolling is not returned by document.getAnimations().
    // Inspect the settled position, then run the unchanged hit/occlusion tests.
    for(let i=0;i<150;i++){
      await new Promise(resolve=>win.requestAnimationFrame(resolve));
      const current=win.scrollY;stable=Math.abs(current-previous)<.1?stable+1:0;previous=current;
      if(stable>=5)return;
    }
    throw Error('Journey scrolling did not settle');
  }
  async function click(action,id){
    if(['preview-node','open-placement'].includes(action)&&!query(action,id)){const chapter=action==='open-placement'?id:frame.contentWindow.fixture.unit.nodes.find(n=>n.id===id)?.chapterId;const link=frame.contentDocument.querySelector('a[href="#chapter-'+chapter+'"]');if(link){link.click();await settle();}}
    const el=query(action,id);
    if(!el)throw Error('Missing enabled action '+action+' '+(id||'')+' in '+JSON.stringify({screen:view().screen,activity:view().activityId,storyIndex:view().storyIndex}));
    const f=frame.contentWindow.fixture;
    const eventType=action==='journey-book'?'reference-section':action==='journey-nav'&&id==='book'?'references'
      :action.startsWith('journey-')||action==='preview-node'?null:action;
    const before=f.completedDispatches[eventType]||0;
    el.click();
    // A click can queue input/draft actions before its requested transition.
    // Start waiting for rendered assets only after that exact action finishes.
    if(eventType)await wait(()=>(f.completedDispatches[eventType]||0)>before);
    await settle();
    if(['preview-node','journey-locate'].includes(action))await settleScroll();
  }
  async function hear(){await settle();for(let i=0;view().audio?.status==='playing'&&i<30;i++){const f=frame.contentWindow.fixture,before=f.completedDispatches['audio-ended']||0,audio=f.audio.at(-1);audio.finish();await wait(()=>(f.completedDispatches['audio-ended']||0)>before);await settle();if(view().saveState)break;}}
  async function check(name,activityId,expectedTheme){
    status.textContent='正在检查 '+frame.width+' × '+frame.height+' · '+name;
    if(['map','map-return','reload-map'].includes(name)&&view().screen!=='map')throw Error('Expected map at '+name);
    if(['references','celebration','review-complete'].includes(name)&&view().screen!==name)throw Error('Wrong screen at '+name);
    if(name==='save-failure'&&!frame.contentDocument.querySelector('[role="alertdialog"]'))throw Error('Save failure dialog did not appear');
    if(name==='blocked'&&!frame.contentDocument.querySelector('.lp-blocked'))throw Error('Blocked screen did not appear');
    const check=await auditReadability(frame.contentWindow,{name,expectedTheme:expectedTheme||'dark'});
    if(activityId)check.activityId=activityId;
    report.checks.push(check);
    if(check.errors.length)throw Error(name+': '+JSON.stringify(check.errors));
    const inspectKey=frame.width+' / '+name;
    if(!inspected.has(inspectKey)&&(inspection==='regressions'&&(
      frame.width==='320'&&name==='map-return'&&view().completedCount===5 ||
      frame.width==='420'&&['story-two-lines','activity-v3.6:story:owner','correct-v3.5:complete-coat','words-queued-v3.1:words:clothes','words-heard-v3.1:words:clothes','activity-C06:umbrella-story','map-current-3','node-preview-C04'].includes(name) ||
      frame.width==='420'&&name==='assembled-v3:L02-M15:C01' ||
      frame.width==='906'&&name==='blocked'
    ) || inspection==='completion'&&(
      frame.width==='320'&&name==='celebration'&&view().completedCount===1 ||
      frame.width==='420'&&['activity-C06:new-places','words-heard-C06:new-places','completion-return-R01','replay-complete','replay-return-map'].includes(name) ||
      frame.width==='420'&&name==='celebration'&&view().completedCount===6
    ))){
      inspected.add(inspectKey);status.textContent='等待目视复核 · '+inspectKey;
      const resume=document.createElement('button');resume.textContent='继续检查';status.after(resume);
      await new Promise(resolve=>resume.addEventListener('click',resolve,{once:true}));resume.remove();
    }
  }
  async function completeNode(unit,nodeId,extraStates=new Set()) {
    let guard=0;
    while(view().screen==='activity'){
      if(++guard>110)throw Error('Course did not advance: '+nodeId);
      let state=view(),a=unit.activities[state.activityId];
      await check('activity-'+a.id,a.id);
      if(a.kind==='interactive-story'){
        if(!state.storyRevealed)await click('story-start');
        await hear();
        await check(state.storyIndex===1?'story-two-lines':'story-line-'+a.id+'-'+state.storyIndex,a.id);
      }else if(a.kind==='teach'){
        // Exercise a real burst through the production controller, without
        // waiting for any media ending or render between clicks.
        // Preparation/playing notifications are not completed word taps.
        const f=frame.contentWindow.fixture,before=f.completedDispatches['word-play']||0;
        for(const item of a.items) query('word-play',item.sourceRef).click();
        query('word-play',a.items[0].sourceRef).click();
        await wait(()=>(f.completedDispatches['word-play']||0)>=before+a.items.length+1);await settle();
        if(view().audio.sequence[0].ref!==a.items[0].sourceRef||view().wordQueue.length!==a.items.length-1)throw Error('Rapid taps cancelled or duplicated requested words: '+a.id);
        if(frame.contentDocument.querySelectorAll('.lp-vocabulary-card.is-queued').length!==a.items.length-1)throw Error('Queued tap has no visible feedback: '+a.id);
        await check('words-queued-'+a.id,a.id);
        for(let i=0;i<a.items.length;i++){
          const beforeEnd=f.completedDispatches['audio-ended']||0;f.audio.at(-1).finish();await wait(()=>(f.completedDispatches['audio-ended']||0)>beforeEnd);await settle();
          const count=i+1,shown=frame.contentDocument.querySelector('.lp-word-progress').textContent.trim();
          if(view().heardWords.length!==count||view().record.teachingProgress[a.id].length!==count||shown!==count+' / '+a.items.length)throw Error('Word ending, saved count and visible count differ: '+a.id);
        }
        await check('words-heard-'+a.id,a.id);
      }else if(a.kind==='match'){
        for(const item of a.items){await click('match-word',item.sourceRef);await click('match-image',item.entityId);await hear();}
        await check('matched-'+a.id,a.id);
      }else if(a.kind==='exercise'){
        await tapAnswer(a,true);await check('tap-selected-'+a.id,a.id);
        if(!extraStates.has(a.mechanism)){
          await tapAnswer(a,false);await click('check');await check('tap-wrong-'+a.id,a.id);await click('retry');
          await check('tap-hint-'+a.id,a.id);await tapAnswer(a,true);extraStates.add(a.mechanism);
        }
        await click('check');await check('tap-correct-'+a.id,a.id);
      }else if(a.resultId){
        await hear();
        const kind=a.castChoice?'cast':a.kind;
        if(!extraStates.has(kind)){
          const wrong=a.options.find(o=>!a.answer.includes(o.id));
          if(wrong && a.answer.length===1){
            await click('select',wrong.id);await check('selected-'+kind,a.id);
            await click('check');await hear();await check('wrong-'+kind,a.id);
            await click('retry');await hear();
          }
          if(query('hint')){await click('hint');await check('hint-'+kind,a.id);}
          extraStates.add(kind);
        }
        for(const id of a.answer)if(!view().selected.includes(id))await click('select',id);
        if(a.kind==='order')await check('assembled-'+a.id,a.id);
        await click('check');await hear();await check('correct-'+a.id,a.id);
      }
      await click('continue');await hear();
    }
  }
  async function returnThroughPrimary(name) {
    const before=JSON.stringify(view().record),f=frame.contentWindow.fixture,dispatches=f.completedDispatches.map||0;
    const primary=frame.contentDocument.querySelector('.lp-footer .lp-primary');
    if(!primary||primary.disabled||primary.dataset.action!=='map')throw Error('Completion primary must return to the map');
    primary.click();await wait(()=>(f.completedDispatches.map||0)>dispatches);await settle();
    const state=view();
    if(state.screen!=='map'||state.activityId!==null||state.audio!==null||JSON.stringify(state.record)!==before)throw Error('Completion advanced, played audio or changed progress after returning: '+name);
    await check(name);
    if(name==='completion-return-L61-STORY')await stickyTitleNegativeControls();
  }
  async function stickyTitleNegativeControls(){
    const win=frame.contentWindow,doc=win.document,title=doc.querySelector('h1[data-lesson-title]');
    for(const name of ['low-contrast-sticky-title','covered-sticky-title']){
      const fault=doc.createElement('style');
      if(name==='low-contrast-sticky-title')fault.textContent='.journey-chapter-banner [data-lesson-title]{color:#ff9600!important}';
      else{
        fault.textContent='.journey-chapter-banner:after{content:"";position:absolute;inset:35px 30px 0 12px;background:#141f23;z-index:20}';
      }
      doc.body.append(fault);await settle();
      const result=await auditReadability(win,{name,expectedTheme:'dark'});
      const caught=result.errors.some(e=>e.rule==='covered-journey-title'||['color-contrast','contrast-unresolved'].includes(e.rule)&&e.target?.some(t=>t.includes('data-lesson-title')));
      fault.remove();await settle();
      report.mutations.push({name,caught,viewport:[win.innerWidth,win.innerHeight]});
      if(!caught)throw Error('Sticky title negative control escaped: '+name);
    }
    await check('sticky-title-restored');
  }
  async function completionNegativeControls() {
    if(report.mutations.some(m=>m.name==='completion-skips-map'))return;
    const primary=frame.contentDocument.querySelector('.lp-footer .lp-primary');
    for(const [name,rule] of [['completion-skips-map','completion-primary-action'],['completion-button-offscreen','completion-action-offscreen']]){
      const action=primary.dataset.action,style=primary.getAttribute('style');
      try{
        if(name==='completion-skips-map')primary.dataset.action='continue-course';
        else primary.style.transform='translateY(200vh)';
        // The production button transitions its transform for 120 ms. Wait for
        // that real animation; an immediate rectangle still describes its start.
        await settle();
        const rect=primary.getBoundingClientRect();
        const injected={action:primary.dataset.action,top:rect.top,bottom:rect.bottom,viewportHeight:frame.contentWindow.innerHeight};
        if(name==='completion-button-offscreen'&&rect.top<frame.contentWindow.innerHeight)throw Error('Offscreen fault did not reach its target position');
        const result=await auditReadability(frame.contentWindow,{name,expectedTheme:'dark'});
        const caught=result.errors.some(error=>error.rule===rule);
        report.mutations.push({name,caught,injected,errors:result.errors});
        if(!caught)throw Error('Negative control escaped: '+name);
      }finally{
        primary.dataset.action=action;
        if(style===null)primary.removeAttribute('style');else primary.setAttribute('style',style);
      }
    }
    const metric=frame.contentDocument.querySelector('[data-settlement-value]'),value=metric.textContent;
    try {
      metric.textContent='999';
      const result=await auditReadability(frame.contentWindow,{name:'settlement-historical-total',expectedTheme:'dark'});
      const caught=result.errors.some(e=>e.rule==='settlement-session-values');
      report.mutations.push({name:'settlement-historical-total',caught});
      if(!caught)throw Error('Historical totals escaped settlement guard');
    } finally {metric.textContent=value;}
    const header=frame.contentDocument.createElement('header');header.className='lp-header';
    try {
      frame.contentDocument.querySelector('.lp-shell').prepend(header);
      const result=await auditReadability(frame.contentWindow,{name:'settlement-lesson-header',expectedTheme:'dark'});
      const caught=result.errors.some(e=>e.rule==='settlement-structure');
      report.mutations.push({name:'settlement-lesson-header',caught});
      if(!caught)throw Error('Lesson header escaped settlement guard');
    } finally {header.remove();}
    await settle();await check('completion-restored');
  }
  function currentQuestion(){const v=view(),u=frame.contentWindow.fixture.unit;return v.screen==='activity'?u.activities[v.activityId]:v.screen==='placement'?u.placement.questions.find(q=>q.id===v.placementAttempt.questionIds[v.placementAttempt.cursor]):v.reviewQuestion||u.challenges.find(c=>c.id===v.challengeId).questions[v.challengeIndex];}
  async function tapAnswer(q,correct=true){
    if(q.mechanism!=='pairs')for(const ref of q.listenRefs){await click('exercise-listen',ref);await hear();}
    if(['order','multi'].includes(q.mechanism))for(const id of [...view().response.selected])await click('exercise-select',id);
    if(q.mechanism==='pairs'){
      for(const [i,p]of q.pairs.entries()){await click('exercise-select',p.id);await hear();await click('exercise-select',correct?p.answer:q.pairs[(i+1)%q.pairs.length].answer);}
    }else{
      const wrong=q.options.find(o=>!q.answer.includes(o.id));
      const selected=correct?q.answer:q.mechanism==='order'?[...q.answer].reverse():q.mechanism==='repair'?[wrong.id,q.answer[1]]:q.mechanism==='mission'?q.answer.map((id,i)=>q.options.find(o=>o.stage===i&&o.id!==id).id):q.mechanism==='multi'?[...q.answer.slice(1),wrong.id]:[wrong.id];
      for(const id of selected)if(['order','multi'].includes(q.mechanism)||!view().response.selected.includes(id))await click('exercise-select',id);
    }
  }
  async function writeAnswer(value){
    const q=currentQuestion();await tapAnswer(q,value!=='wrong answer');
    if(!report.checks.some(c=>c.name==='settlement-visibility-selection'&&c.viewport[0]===Number(frame.width))){
      const win=frame.contentWindow,button=query('exercise-select');button.focus();
      const before=win.fixture.completedDispatches['session-visibility']||0,response=JSON.stringify(view().response);
      win.document.dispatchEvent(new win.Event('visibilitychange'));
      await wait(()=>(win.fixture.completedDispatches['session-visibility']||0)>before);
      if(!button.isConnected||win.document.activeElement!==button||JSON.stringify(view().response)!==response)throw Error('Visibility update replaced the selection or focus');
      await check('settlement-visibility-selection');
    }
  }
  async function placementTests(viewport) {
    await open(viewport);
    const main=JSON.stringify(view().record.completed);
    frame.contentDocument.querySelector('.journey-lesson-index summary').click();
    frame.contentDocument.querySelector('a[href="#chapter-umbrella"]').click();
    await settle();await settleScroll();await check('placement-directory-arrival');
    if(frame.contentDocument.querySelector('.journey-lesson-index').open)throw Error('Directory stayed open after choosing a Lesson');
    const banner=frame.contentDocument.querySelector('#chapter-umbrella .journey-chapter-banner').getBoundingClientRect();
    const entry=frame.contentDocument.querySelector('[data-action="open-placement"][data-id="umbrella"]').getBoundingClientRect();
    if(entry.top<banner.bottom+5 || entry.bottom>frame.contentWindow.innerHeight-80)throw Error('Directory jump hides placement entry behind navigation');
    await click('preview-node','C04');await check('placement-preview');
    await click('open-placement','umbrella');await check('placement-intro');
    const heart=frame.contentDocument.querySelector('.lp-placement-hearts .is-full');
    heart.className='is-empty';
    const heartAudit=await auditReadability(frame.contentWindow,{name:'placement-heart-mismatch',expectedTheme:'dark'});
    const heartCaught=heartAudit.errors.some(e=>e.rule==='placement-hearts');
    report.mutations.push({name:'placement-heart-mismatch',caught:heartCaught,errors:heartAudit.errors});
    heart.className='is-full';
    if(!heartCaught)throw Error('Negative control escaped: placement-heart-mismatch');
    await click('placement-start');await check('placement-empty');
    const forbidden=frame.contentDocument.createElement('textarea');frame.contentDocument.querySelector('.lp-lesson').append(forbidden);
    const keyboardAudit=await auditReadability(frame.contentWindow,{name:'keyboard-answer-regression',expectedTheme:'dark'});
    const keyboardCaught=keyboardAudit.errors.some(e=>e.rule==='keyboard-answer');forbidden.remove();
    report.mutations.push({name:'keyboard-answer-regression',caught:keyboardCaught});if(!keyboardCaught)throw Error('Keyboard-answer negative control escaped');

    const questionTitle=frame.contentDocument.querySelector('[data-lesson-title]'), originalTitle=questionTitle.textContent;
    questionTitle.textContent='错误的题型提示';
    const typeAudit=await auditReadability(frame.contentWindow,{name:'placement-answer-type-mismatch',expectedTheme:'dark'});
    const typeCaught=typeAudit.errors.some(e=>e.rule==='placement-answer-type');
    report.mutations.push({name:'placement-answer-type-mismatch',caught:typeCaught,errors:typeAudit.errors});
    questionTitle.textContent=originalTitle;
    if(!typeCaught)throw Error('Negative control escaped: placement-answer-type-mismatch');
    const write=async value=>tapAnswer(currentQuestion(),value!=='wrong answer');
    const answer=()=>true;
    const win=frame.contentWindow;
    if(frame.contentDocument.querySelector('input,textarea,[contenteditable="true"]'))throw Error('Placement must not have a text answer');
    await write('wrong answer');
    frame.contentWindow.fixture.failSave=true;await click('placement-check');await check('placement-save-failure');
    if(view().placementAttempt.responses.length)throw Error('Unsaved answer consumed a heart');
    frame.contentWindow.fixture.failSave=false;await click('save-retry');await check('placement-wrong');
    if(view().placementAttempt.responses.filter(r=>!r.correct).length!==1)throw Error('Wrong answer did not consume exactly one heart');
    const saved=JSON.stringify(view().placementAttempt);
    await reloadFrame();await click('open-placement','umbrella');await click('placement-start');await check('placement-restored');
    if(JSON.stringify(view().placementAttempt)!==saved||view().feedback!=='incorrect')throw Error('Reload reset placement feedback or questions');
    await click('placement-next');await click('exercise-select',currentQuestion().options[0].id);const draft=JSON.stringify(view().response);
    await reloadFrame();await click('open-placement','umbrella');await click('placement-start');await check('placement-draft-restored');
    if(JSON.stringify(view().response)!==draft)throw Error('Placement draft disappeared');
    frame.contentWindow.fixture.randomState=1;
    while(view().screen==='placement') {
      await write(answer());await check('placement-filled');
      const stable=JSON.stringify({order:view().exerciseOptionOrder,heard:view().heardRefs});
      await click('placement-check');
      if(JSON.stringify({order:view().exerciseOptionOrder,heard:view().heardRefs})!==stable)throw Error('Grading reinitialized option order or listening evidence');
      await check('placement-options-stable');
      if(view().feedback){await check(view().placementAttempt.feedbackPending?'placement-final-correct':'placement-correct');await click('placement-next');}
    }
    await check('placement-passed');
    if(view().placementAttempt.status!=='passed'||view().passedCount!==3||JSON.stringify(view().record.completed)!==main)throw Error('Placement fabricated progress or failed to unlock target');
    await click('map');await check('placement-map');
    await click('preview-node','K03');await check('placement-skipped-preview');await click('journey-close');
    await click('open-placement','friends');await click('placement-start');
    for(let i=0;i<5;i++){
      await write('wrong answer');
      const button=query('placement-check'),f=frame.contentWindow.fixture,before=f.completedDispatches['placement-check']||0;
      button.click();button.click();
      await wait(()=>(f.completedDispatches['placement-check']||0)>=before+2);await settle();
      if(view().placementAttempt.responses.filter(r=>!r.correct).length!==i+1)throw Error('Double click lost two hearts');
      await check(i<4?'placement-wrong':'placement-final-wrong');await click('placement-next');
    }
    await check('placement-failed');
    if(view().placementAttempt.status!=='failed'||view().passedCount!==3)throw Error('Fifth wrong answer unlocked target');
    await click('placement-retry');await check('placement-retry-intro');await click('placement-start');await check('placement-retry');
    if(view().placementAttempt.responses.length)throw Error('Explicit retry did not reset the attempt');
    await click('map');await click('open-placement','lesson-143-144');await check('placement-wide-intro');await click('placement-start');
    while(view().screen==='placement'){
      await write(answer());await check('placement-wide-question');
      await click('placement-check');if(view().feedback)await click('placement-next');
    }
    await check('placement-wide-passed');await click('map');await check('placement-wide-map');
  }
  async function optionalChallenges(unit) {
    const main=JSON.stringify({completed:view().record.completed,results:view().record.results});
    for(const challenge of unit.challenges){
      await click('journey-nav','review');await check('challenge-menu');
      await click('open-challenge',challenge.id);await check('challenge-intro-'+challenge.id);
      await click('challenge-start');
      for(const [index,q] of challenge.questions.entries()){
        await check('challenge-empty-'+q.id,q.id);
        if(index===0){
          if(frame.contentDocument.querySelector('input,textarea,[contenteditable="true"]'))throw Error('Challenge has a keyboard answer');
          await writeAnswer('wrong answer');await click('challenge-check');
          await check('challenge-wrong-'+challenge.id);
          await click('challenge-retry');
          if(!view().challengeHintUsed || !frame.contentDocument.querySelector('.lp-hint'))throw Error('Correction did not expose the learning hint');
          await check('challenge-hint-'+challenge.id);
        }
        await writeAnswer(true);await check('challenge-filled-'+q.id,q.id);
        if(index===1){
          const savedResponse=JSON.stringify(view().response);
          await wait(()=>JSON.stringify(frame.contentWindow.fixture.adapter.loadDraft(frame.contentWindow.fixture.runtime.storageKey).value?.value)===savedResponse);
          await click('map');await reloadFrame();await click('journey-nav','review');
          await click('open-challenge',challenge.id);await click('challenge-start');
          if(JSON.stringify(view().response)!==savedResponse)throw Error('Draft disappeared after reload');
          await check('challenge-draft-restored-'+challenge.id);
          for(const ref of q.listenRefs){await click('exercise-listen',ref);await hear();}
        }
        await click('challenge-check');await check('challenge-correct-'+q.id,q.id);
        await click('challenge-next');
      }
      await check('challenge-complete-'+challenge.id);
      if(view().record.challenges[challenge.id].answers[0].evidence!=='supported')throw Error('A corrected answer was awarded independent evidence');
      await returnThroughPrimary('challenge-return-'+challenge.id);
      await click('preview-node',challenge.unlockNodeId);await check('challenge-node-preview-'+challenge.id);
      await click('open-challenge',challenge.id);await check('challenge-finished-intro-'+challenge.id);
      const saved=JSON.stringify(view().record);
      await click('reset-request',challenge.id);await check('reset-confirm-single-'+challenge.id);
      await click('reset-confirm');await check('reset-single-'+challenge.id);
      if(view().record.challenges[challenge.id])throw Error('Individual challenge did not reset');
      await click('reset-undo');
      if(JSON.stringify(view().record)!==saved)throw Error('Individual reset undo changed another record');
    }
    if(JSON.stringify({completed:view().record.completed,results:view().record.results})!==main)throw Error('An optional challenge changed the main route');
    await click('journey-nav','progress');
    const before=JSON.stringify(view().record);
    await click('reset-request','challenges');await check('reset-confirm-challenges');
    await click('reset-cancel');await check('reset-cancelled');
    if(frame.contentDocument.activeElement!==query('reset-request','challenges'))throw Error('Reset cancellation lost the original button focus');
    if(JSON.stringify(view().record)!==before)throw Error('Cancel reset modified the record');
    await click('reset-request','challenges');await click('reset-confirm');await check('reset-challenges-saved');
    if(view().completedCount!==unit.checkpointIds.length||Object.keys(view().record.challenges).length)throw Error('Challenge reset affected the main route');
    await click('reset-undo');await check('reset-undo');
    if(JSON.stringify(view().record)!==before)throw Error('Undo did not restore the record');
    await click('journey-nav','progress');await click('reset-request','course');await check('reset-confirm-course');
    frame.contentWindow.fixture.failSave=true;await click('reset-confirm');await check('reset-failed');
    if(view().completedCount!==unit.checkpointIds.length)throw Error('Failed reset reported success');
    frame.contentWindow.fixture.failSave=false;await click('save-retry');await check('reset-course-saved');
    if(view().completedCount!==0||view().nodes[1].available)throw Error('Full reset did not return to the first node');
    await reloadFrame();await check('reset-reload');
    if(view().completedCount!==0)throw Error('Old progress came back after a reset');
    await click('reset-undo');await check('reset-undo-restored');
  }
  async function postCourse(viewport,unit){
      const completedBeforeReplay=view().completedCount;
      await click('preview-node','K01');await click('open-node','K01');
      await completeNode(unit,'K01');await check('replay-complete');
      await returnThroughPrimary('replay-return-map');
      if(view().completedCount!==completedBeforeReplay)throw Error('Replay advanced the main path');
      // Time changes only inside the test adapter to exercise due review.
      frame.contentWindow.fixture.now='2026-09-09T12:00:00Z';
      await click('journey-nav','review');await check('review-due');
      await click('review');
      for(let guard=0;view().screen==='activity'&&guard<6;guard++){
        const a=unit.activities[view().activityId];await hear();await check('review-'+a.id);
        if(a.kind==='match'){
          for(const item of a.items){await click('match-word',item.sourceRef);await click('match-image',item.entityId);await hear();}
        }else{
          if(a.kind==='exercise')await tapAnswer(a,true);
          else for(const id of a.answer)await click('select',id);
          await click('check');await hear();
        }
        await click('continue');await hear();
      }
      await check('review-complete');await returnThroughPrimary('review-return-map');
      await optionalChallenges(unit);
      await open(viewport);await check('reload-map');
      await click('preview-node','K01');await click('open-node','K01');await click('story-start');
      frame.contentWindow.fixture.failSave=true;await hear();await click('continue');await check('save-failure');
      frame.contentWindow.fixture.failSave=false;await click('save-retry');
      await click('map');
      frame.contentWindow.fixture.throwNext=true;await click('journey-nav','book');
      await check('blocked',null,'dark');
      // Recover through the same visible reload control.
      await click('reload');await check('map-return');
  }
  try {
    for(const viewport of config.viewports){
      if(postCoursePreflight){
        const win=await open(viewport),f=win.fixture,key=f.runtime.storageKey;
        if(!win.CanranCore.learningPathRuntime.validRecord(postCoursePreflight.value,f.unit))throw Error('Invalid preflight record');
        const saved=f.adapter.commit(key,{expectedRevision:f.adapter.load(key).revision,value:postCoursePreflight.value});
        if(saved.status!=='committed')throw Error('Preflight seed failed');
        await reloadFrame();await postCourse(viewport,frame.contentWindow.fixture.unit);continue;
      }
      await placementTests(viewport);
      await open(viewport,true);await check('loader',null,'dark');
      const win=await open(viewport),unit=win.fixture.unit;
      // Start with the user's exact regression, before broader map checks.
      await click('preview-node','K01');await click('open-node','K01');await click('story-start');await hear();await click('continue');await hear();
      await check('story-two-lines',view().activityId);
      await progressNegativeControl();
      await click('map');
      await check('map');
      await click('journey-nav','review');await check('review-empty');
      await click('journey-nav','progress');await check('progress-empty');
      await click('journey-nav','book');await check('references');
      for(const group of unit.referenceGroups){await click('reference-section',group.id);await check('reference-'+group.id);}
      await click('map');await check('map-return');
      const extraStates=new Set();
      for(const node of unit.nodes){
        await click('preview-node',node.id);await check('node-preview-'+node.id);
        await click('open-node',node.id);
        await completeNode(unit,node.id,extraStates);
        await check('celebration');await completionNegativeControls();
        await returnThroughPrimary('completion-return-'+node.id);await check('map-return');await check('map-current-'+view().completedCount);
      }
      await postCourse(viewport,unit);
    }
    if(!postCoursePreflight){
    // Negative controls must fail. This prevents a non-running or overly broad
    // exclusion from silently converting unreadable content into a pass.
    await open(config.viewports[1]||config.viewports[0]);await click('preview-node','K01');await click('open-node','K01');await click('story-start');await hear();await click('continue');await hear();
    const mutations=[
      ['white-on-light','.lp-chat-bubble{background:#eef1e8!important}.lp-chat-bubble p{color:#f1f7f8!important}', 'color-contrast'],
      ['dark-multiply','.lp-story-character>img{mix-blend-mode:multiply!important}', 'darkened-art'],
      ['missing-image','', 'image-loaded'],
      ['opaque-art','', 'teaching-art-cutout'],
      ['theme-discontinuity','body,.lp-shell{background:#dfe6df!important;color:#2c4035!important}', 'screen-canvas'],
      ['scrollbar-width-overflow','body{min-width:'+frame.contentWindow.innerWidth+'px!important}', 'horizontal-overflow']
    ];
    for(const [name,css,rule] of mutations){
      const doc=frame.contentDocument,style=doc.createElement('style');style.textContent=css;doc.head.append(style);
      const img=doc.querySelector('.lp-story-character>img'),src=img.src;
      if(name==='missing-image')img.src='/__qa__/deliberately-missing.png';
      if(name==='opaque-art')img.src='/__qa__/opaque-character.png';
      await settle();
      const result=await auditReadability(frame.contentWindow,{name,expectedTheme:'dark'});
      const caught=result.errors.some(e=>e.rule===rule);report.mutations.push({name,caught,errors:result.errors});
      style.remove();img.src=src;await settle();
      if(!caught)throw Error('Negative control escaped: '+name);
    }
    await click('map');
    const spacingStyle=frame.contentDocument.createElement('style');
    spacingStyle.textContent='.journey-step.has-companion{height:264px!important}.journey-step.is-current{margin-top:62px!important}';
    frame.contentDocument.head.append(spacingStyle);await settle();
    const spacingResult=await auditReadability(frame.contentWindow,{name:'uneven-node-spacing',expectedTheme:'dark'});
    const spacingCaught=spacingResult.errors.some(e=>e.rule==='journey-node-spacing');
    report.mutations.push({name:'uneven-node-spacing',caught:spacingCaught,errors:spacingResult.errors});
    spacingStyle.remove();
    if(!spacingCaught)throw Error('Negative control escaped: uneven-node-spacing');
    const doc=frame.contentDocument,arrow=doc.querySelector('.journey-locate img');
    arrow.style.transform='translateX(-5px)';await settle();
    const arrowResult=await auditReadability(frame.contentWindow,{name:'off-center-arrow',expectedTheme:'dark'});
    const arrowCaught=arrowResult.errors.some(e=>e.rule==='icon-not-centered');
    report.mutations.push({name:'off-center-arrow',caught:arrowCaught,errors:arrowResult.errors});
    arrow.style.transform='';
    if(!arrowCaught)throw Error('Negative control escaped: off-center-arrow');
    }
    report.status=postCoursePreflight?'preflight-passed':'passed';
  }catch(error){report.status='failed';report.failure=String(error);}
  results.textContent=JSON.stringify(report,null,2);
  // A scoped preflight never posts or creates a release readability proof.
  if(postCoursePreflight){window.__postCourseReport=report;status.textContent=report.status+' · '+(report.failure||report.checks.length+' states');document.body.dataset.result=report.status;return;}
  const response=await fetch('/__qa__/result',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(report)});
  if(!response.ok){report.status='failed';report.failure='Evidence was rejected: '+await response.text();}
  status.textContent=report.status==='passed'?'通过 · '+report.checks.length+' 个实际渲染状态':'未通过 · '+report.failure;
  document.body.dataset.result=report.status;
})();
