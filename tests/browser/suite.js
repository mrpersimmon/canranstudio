(async function () {
  'use strict';
  const config = await (await fetch('/__qa__/config.json')).json();
  const report = {schema:1, fingerprint:config.fingerprint, token:config.token, status:'running', checks:[], mutations:[]};
  const status = document.querySelector('#status'), results = document.querySelector('#results');
  const inspection=new URLSearchParams(location.search).get('inspect')==='regressions', inspected=new Set();
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
    const check=await auditReadability(frame.contentWindow,{name,expectedTheme:expectedTheme||(view().screen==='map'?'dark':'light')});
    if(activityId)check.activityId=activityId;
    report.checks.push(check);
    if(check.errors.length)throw Error(name+': '+JSON.stringify(check.errors));
    const inspectKey=frame.width+' / '+name;
    if(inspection&&!inspected.has(inspectKey)&&(
      frame.width==='320'&&name==='map-return'&&view().completedCount===5 ||
      frame.width==='420'&&name==='activity-v3:L02-M15:C01' ||
      frame.width==='906'&&name==='blocked'
    )){
      inspected.add(inspectKey);status.textContent='等待目视复核 · '+inspectKey;
      const resume=document.createElement('button');resume.textContent='继续检查';status.after(resume);
      await new Promise(resolve=>resume.addEventListener('click',resolve,{once:true}));resume.remove();
    }
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
        let guard=0;
        while(view().screen==='activity'){
          if(++guard>110)throw Error('Course did not advance: '+node.id);
          let state=view(),a=unit.activities[state.activityId];
          await check('activity-'+a.id,a.id);
          if(a.kind==='interactive-story'){
            if(!state.storyRevealed)await click('story-start');
            await hear();
            await check(state.storyIndex===1?'story-two-lines':'story-line-'+a.id+'-'+state.storyIndex,a.id);
          }else if(a.kind==='teach'){
            for(const item of a.items){await click('word-play',item.sourceRef);await hear();}
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
            await click('check');await hear();await check('correct-'+a.id,a.id);
          }
          await click('continue');await hear();
        }
        await check('celebration');
        await click('map');await check('map-return');
      }
      // Time changes only inside the test adapter to exercise due review.
      win.fixture.now='2026-09-09T12:00:00Z';
      await click('journey-nav','review');await check('review-due');
      await click('review');
      for(let guard=0;view().screen==='activity'&&guard<6;guard++){
        const a=unit.activities[view().activityId];await hear();await check('review-'+a.id);
        for(const id of a.answer)await click('select',id);
        await click('check');await hear();await click('continue');await hear();
      }
      await check('review-complete');await click('map');
      await open(viewport);await check('reload-map');
      await click('preview-node','K01');await click('open-node','K01');await click('story-start');
      frame.contentWindow.fixture.failSave=true;await hear();await click('continue');await check('save-failure');
      frame.contentWindow.fixture.failSave=false;await click('save-retry');
      await click('map');
      frame.contentWindow.fixture.throwNext=true;await click('journey-nav','book');
      await check('blocked',null,'light');
      // Recover through the same visible reload control.
      await click('reload');await check('map-return');
    }
    // Negative controls must fail. This prevents a non-running or overly broad
    // exclusion from silently converting unreadable content into a pass.
    await open(config.viewports[1]);await click('preview-node','K01');await click('open-node','K01');await click('story-start');await hear();await click('continue');await hear();
    const mutations=[
      ['white-on-light','.lp-chat-bubble p{color:#f1f7f8!important}', 'color-contrast'],
      ['dark-multiply','body,.lp-shell{background:#141f23!important}', 'darkened-art'],
      ['missing-image','', 'image-loaded']
    ];
    for(const [name,css,rule] of mutations){
      const doc=frame.contentDocument,style=doc.createElement('style');style.textContent=css;doc.head.append(style);
      const img=doc.querySelector('.lp-story-character>img'),src=img.src;
      if(name==='missing-image')img.src='/__qa__/deliberately-missing.png';
      await settle();
      const result=await auditReadability(frame.contentWindow,{name,expectedTheme:'light'});
      const caught=result.errors.some(e=>e.rule===rule);report.mutations.push({name,caught,errors:result.errors});
      style.remove();img.src=src;await settle();
      if(!caught)throw Error('Negative control escaped: '+name);
    }
    report.status='passed';
  }catch(error){report.status='failed';report.failure=String(error);}
  results.textContent=JSON.stringify(report,null,2);
  const response=await fetch('/__qa__/result',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(report)});
  if(!response.ok){report.status='failed';report.failure='Evidence was rejected: '+await response.text();}
  status.textContent=report.status==='passed'?'通过 · '+report.checks.length+' 个实际渲染状态':'未通过 · '+report.failure;
  document.body.dataset.result=report.status;
})();
