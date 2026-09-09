(async function () {
  const f=window.fixture,unit=f.unit,view=()=>f.runtime.snapshot();
  const scenario=new URLSearchParams(location.search).get('settlement');
  const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
  async function wait(predicate){for(let n=0;n<2000;n++){if(predicate())return;await tick();}throw Error('Settlement preview timeout');}
  async function click(action,id){
    const el=[...document.querySelectorAll('button[data-action]')].find(el=>el.dataset.action===action&&(id===undefined||el.dataset.id===id)&&!el.disabled);
    if(!el)throw Error('Missing preview action '+action+' '+id);
    const before=f.dispatchCount;el.click();
    if(!['preview-node','journey-nav'].includes(action))await wait(()=>f.dispatchCount>before);
    await tick();await tick();
  }
  async function hear(){for(let n=0;view().audio?.status==='playing'&&n<40;n++){const count=f.dispatchCount;f.audio.at(-1).finish();await wait(()=>f.dispatchCount>count);await tick();}}
  async function step(){
    const a=unit.activities[view().activityId];
    f.now=new Date(new Date(f.now).getTime()+9000).toISOString();
    if(a.kind==='interactive-story'&&!view().storyRevealed)await click('story-start');
    await hear();
    if(a.kind==='teach')for(const item of a.items){await click('word-play',item.sourceRef);await hear();}
    else if(a.kind==='match')for(const item of a.items){await click('match-word',item.sourceRef);await click('match-image',item.entityId);}
    else if(a.resultId){for(const id of a.answer)await click('select',id);await click('check');await hear();}
    await click('continue');
  }
  async function finish(id){await click('preview-node',id);await click('open-node',id);while(view().screen==='activity')await step();}
  async function write(value,placement=false){
    const input=document.querySelector(placement?'[data-placement-input]':'[data-challenge-input]');
    input.focus();input.value=value;input.dispatchEvent(new InputEvent('input',{bubbles:true,data:value}));await tick();await tick();
    input.setSelectionRange(1,1);
    const before=f.completedDispatches['session-visibility']||0;
    document.dispatchEvent(new Event('visibilitychange'));
    await wait(()=>(f.completedDispatches['session-visibility']||0)>before);
    if(document.activeElement!==input || !input.isConnected || input.selectionStart!==1)throw Error('Visibility change replaced the active answer input');
  }
  try {
    if(scenario.startsWith('placement')){
      await click('open-placement','umbrella');await click('placement-start');
      while(view().screen==='placement'){
        const a=view().placementAttempt,q=unit.placement.questions.find(q=>q.id===a.questionIds[a.cursor]);
        await write(scenario==='placement-fail'?'wrong':q.answers[0],true);await click('placement-check');
        if(view().screen==='placement')await click('placement-next');
      }
    } else {
      await finish('K01');
      if(scenario==='repeat'){await click('map');await finish('K01');}
      else if(scenario==='review'){
        await click('map');f.now='2026-09-09T12:00:00Z';await click('journey-nav','review');await click('review');
        while(view().screen==='activity')await step();
      } else if(scenario==='challenge'){
        for(const n of ['K03','K04']){await click('map');await finish(n);}
        await click('open-challenge','CH12');await click('challenge-start');
        for(const q of unit.challenges.find(c=>c.id==='CH12').questions){
          f.now=new Date(new Date(f.now).getTime()+21000).toISOString();
          await write(q.answers[0]);await click('challenge-check');await click('challenge-next');
        }
      }
    }
    await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));
    document.body.dataset.settlementReady=scenario;
  }catch(error){f.errors.push(String(error));document.body.dataset.settlementError=String(error);}
})();
