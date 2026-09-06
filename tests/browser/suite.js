(async function () {
  'use strict';
  const config = await (await fetch('/__qa__/config.json')).json();
  const report = {schema:1, fingerprint:config.fingerprint, token:config.token, status:'running', checks:[], mutations:[]};
  const status = document.querySelector('#status'), results = document.querySelector('#results');
  const inspection=new URLSearchParams(location.search).get('inspect'), inspected=new Set();
  const pause = () => new Promise(resolve=>setTimeout(resolve,0));
  const wait = async predicate => {for(let i=0;i<3000;i++){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,5));}throw Error('Fixture did not become ready');};
  let frame;
  async function open(viewport, loader=false) {
    frame?.remove(); frame=document.createElement('iframe');
    frame.width=viewport[0];frame.height=viewport[1];frame.title='实际课程渲染 '+viewport.join(' × ');
    frame.src=loader?'/__qa__/loader.html':'/__qa__/frame.html';document.querySelector('#frames').append(frame);
    await wait(()=>frame.contentWindow?.axe && (loader || frame.contentWindow.fixture?.ready));
    await settle();return frame.contentWindow;
  }
  async function settle(){await pause();await pause();const win=frame.contentWindow;await win.document.fonts.ready;await Promise.all(Array.from(win.document.images).map(img=>img.decode().catch(()=>{})));await Promise.all(win.document.getAnimations().filter(animation=>{const timing=animation.effect?.getTiming();return timing&&timing.iterations!==Infinity&&Number(timing.duration)*timing.iterations<=600;}).map(animation=>animation.finished.catch(()=>{})));}
  function view(){return frame.contentWindow.fixture.runtime.snapshot();}
  function query(action,id){return Array.from(frame.contentDocument.querySelectorAll('button[data-action]')).find(el=>el.dataset.action===action&&(id===undefined||el.dataset.id===id)&&!el.disabled);}
  async function click(action,id){const el=query(action,id);if(!el)throw Error('Missing enabled action '+action+' '+(id||'')+' in '+JSON.stringify({screen:view().screen,activity:view().activityId,storyIndex:view().storyIndex}));const f=frame.contentWindow.fixture,before=f.dispatchCount;el.click();if(!(action.startsWith('journey-')||action==='preview-node')||action==='journey-book'||action==='journey-nav'&&id==='book')await wait(()=>f.dispatchCount>before);await settle();}
  async function hear(){for(let i=0;view().audio?.status==='playing'&&i<30;i++){const f=frame.contentWindow.fixture,before=f.dispatchCount,audio=f.audio.at(-1);audio.finish();await wait(()=>f.dispatchCount>before);await settle();if(view().saveState)break;}}
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
        const f=frame.contentWindow.fixture,before=f.dispatchCount;
        for(const item of a.items) query('word-play',item.sourceRef).click();
        query('word-play',a.items[0].sourceRef).click();
        await wait(()=>f.dispatchCount>=before+a.items.length+1);await settle();
        if(view().audio.sequence[0].ref!==a.items[0].sourceRef||view().wordQueue.length!==a.items.length-1)throw Error('Rapid taps cancelled or duplicated requested words: '+a.id);
        if(frame.contentDocument.querySelectorAll('.lp-vocabulary-card.is-queued').length!==a.items.length-1)throw Error('Queued tap has no visible feedback: '+a.id);
        await check('words-queued-'+a.id,a.id);
        for(let i=0;i<a.items.length;i++){
          const beforeEnd=f.dispatchCount;f.audio.at(-1).finish();await wait(()=>f.dispatchCount>beforeEnd);await settle();
          const count=i+1,shown=frame.contentDocument.querySelector('.lp-word-progress').textContent.trim();
          if(view().heardWords.length!==count||view().record.teachingProgress[a.id].length!==count||shown!==count+' / '+a.items.length)throw Error('Word ending, saved count and visible count differ: '+a.id);
        }
        await check('words-heard-'+a.id,a.id);
      }else if(a.kind==='match'){
        for(const item of a.items){await click('match-word',item.sourceRef);await click('match-image',item.entityId);await hear();}
        await check('matched-'+a.id,a.id);
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
    const before=JSON.stringify(view().record),f=frame.contentWindow.fixture,dispatches=f.dispatchCount;
    const primary=frame.contentDocument.querySelector('.lp-footer .lp-primary');
    if(!primary||primary.disabled||primary.dataset.action!=='map')throw Error('Completion primary must return to the map');
    primary.click();await wait(()=>f.dispatchCount>dispatches);await settle();
    const state=view();
    if(state.screen!=='map'||state.activityId!==null||state.audio!==null||JSON.stringify(state.record)!==before)throw Error('Completion advanced, played audio or changed progress after returning: '+name);
    await check(name);
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
    await settle();await check('completion-restored');
  }
  try {
    for(const viewport of config.viewports){
      await open(viewport,true);await check('loader',null,'dark');
      const win=await open(viewport),unit=win.fixture.unit;
      // Start with the user's exact regression, before broader map checks.
      await click('preview-node','K01');await click('open-node','K01');await click('story-start');await hear();await click('continue');await hear();
      await check('story-two-lines',view().activityId);
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
      const completedBeforeReplay=view().completedCount;
      await click('preview-node','K01');await click('open-node','K01');
      await completeNode(unit,'K01');await check('replay-complete');
      await returnThroughPrimary('replay-return-map');
      if(view().completedCount!==completedBeforeReplay)throw Error('Replay advanced the main path');
      // Time changes only inside the test adapter to exercise due review.
      win.fixture.now='2026-09-09T12:00:00Z';
      await click('journey-nav','review');await check('review-due');
      await click('review');
      for(let guard=0;view().screen==='activity'&&guard<6;guard++){
        const a=unit.activities[view().activityId];await hear();await check('review-'+a.id);
        for(const id of a.answer)await click('select',id);
        await click('check');await hear();await click('continue');await hear();
      }
      await check('review-complete');await returnThroughPrimary('review-return-map');
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
    // Negative controls must fail. This prevents a non-running or overly broad
    // exclusion from silently converting unreadable content into a pass.
    await open(config.viewports[1]);await click('preview-node','K01');await click('open-node','K01');await click('story-start');await hear();await click('continue');await hear();
    const mutations=[
      ['white-on-light','.lp-chat-bubble{background:#eef1e8!important}.lp-chat-bubble p{color:#f1f7f8!important}', 'color-contrast'],
      ['dark-multiply','.lp-story-character>img{mix-blend-mode:multiply!important}', 'darkened-art'],
      ['missing-image','', 'image-loaded'],
      ['opaque-art','', 'teaching-art-cutout'],
      ['theme-discontinuity','body,.lp-shell{background:#dfe6df!important;color:#2c4035!important}', 'screen-canvas']
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
    report.status='passed';
  }catch(error){report.status='failed';report.failure=String(error);}
  results.textContent=JSON.stringify(report,null,2);
  const response=await fetch('/__qa__/result',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(report)});
  if(!response.ok){report.status='failed';report.failure='Evidence was rejected: '+await response.text();}
  status.textContent=report.status==='passed'?'通过 · '+report.checks.length+' 个实际渲染状态':'未通过 · '+report.failure;
  document.body.dataset.result=report.status;
})();
