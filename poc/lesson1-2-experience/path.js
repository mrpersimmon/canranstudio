(function boot(global) {
  'use strict';
  const root = global.document.querySelector('[data-learning-path]');
  const core = global.CanranCore;
  if (!root || !core?.curriculumCatalog) return;
  const unit = core.curriculumCatalog.getTeachingUnit(root.dataset.unitId || 'NCE-U01');
  if (unit?.runtimeProfile !== 'learning-path-v3') throw new Error('V3 catalog required');
  let storage;
  try { storage = global.localStorage; } catch { storage = { getItem() { throw new Error('storage unavailable'); } }; }
  const runtime = core.learningPathRuntime.createRuntime({ unit, deferRead:true, adapter: core.learningStore.createLocalStorageAdapter(storage) });
  const renderer = core.learningPathScene.createRenderer(unit);
  let media = null, mediaToken = 0, feedbackMedia = null, lastView = null, work = Promise.resolve();
  let journeyUI = { tab: 'path', selectedNodeId: null };
  let modalReturnFocus;
  function revealCurrentNode(view) {
    const next=view.nodes.find(node=>node.available&&!(node.passed||node.done));
    const element=next&&root.querySelector(`[data-journey-current],.lp-node[data-id="${next.id}"]`);
    if(!element)return;
    const bounds=element.getBoundingClientRect(),nav=root.querySelector('.journey-nav')?.getBoundingClientRect();
    const bottom=nav&&nav.top>0?nav.top:global.innerHeight;
    // Directory and reset notices can move even the first node below a fixed
    // navigation bar. Visibility is geometry, not a completed-count threshold.
    if(view.completedCount>0||bounds.bottom>bottom-16||bounds.top<60)element.scrollIntoView({block:'center',behavior:'instant'});
  }
  function stop() { mediaToken++; if (media) { media.pause(); media.removeAttribute('src'); media.load(); media = null; } }
  // Reconcile a stable activity in place: selecting a word or receiving an
  // audio event must not recreate its controls and restart unrelated images.
  function reconcile(current, next) {
    if(current.nodeType!==next.nodeType || current.nodeName!==next.nodeName){current.replaceWith(next);return;}
    if(current.nodeType===3){if(current.nodeValue!==next.nodeValue)current.nodeValue=next.nodeValue;return;}
    if(current.nodeType!==1)return;
    for(const attr of [...current.attributes])if(!next.hasAttribute(attr.name))current.removeAttribute(attr.name);
    for(const attr of [...next.attributes])if(current.getAttribute(attr.name)!==attr.value)current.setAttribute(attr.name,attr.value);
    const key=node=>node.nodeType===1?(node.id || (node.dataset.action ? node.dataset.action+':'+(node.dataset.id || '') : null)):null;
    let index=0;
    for(const child of [...next.childNodes]){
      let old=current.childNodes[index],wanted=key(child);
      if(wanted && key(old || {})!==wanted){const match=[...current.childNodes].slice(index).find(node=>key(node)===wanted);if(match){current.insertBefore(match,old || null);old=match;}else {current.insertBefore(child,old || null);index++;continue;}}
      if(old)reconcile(old,child);else current.append(child);
      index++;
    }
    while(current.childNodes.length>index)current.lastChild.remove();
  }
  function render(view) {
    const active = global.document.activeElement;
    const action = active?.dataset?.action, id = active?.dataset?.id;
    const previousModal = root.querySelector('[aria-modal="true"]');
    const focusFeedback = active?.matches('.lp-feedback');
    const changed = view.screen !== lastView?.screen || (view.storyActivityId || view.activityId) !== (lastView?.storyActivityId || lastView?.activityId) || view.challengeIndex !== lastView?.challengeIndex || view.placementIndex !== lastView?.placementIndex || view.placementId !== lastView?.placementId;
    const turnChanged = view.storyIndex !== lastView?.storyIndex;
    const previousHistory = root.querySelector('.lp-story-transcript');
    const historyScroll = previousHistory?.scrollTop || 0;
    const historyAtBottom = previousHistory && previousHistory.scrollHeight - historyScroll - previousHistory.clientHeight < 8;
    const html=renderer.render({ ...view, journeyUI });
    if(!changed && root.firstElementChild && ['activity','challenge','placement'].includes(view.screen) && !previousModal && !view.saveState){
      const template=global.document.createElement('template');template.innerHTML=html;
      if(root.firstElementChild)reconcile(root.firstElementChild,template.content.firstElementChild);else root.innerHTML=html;
    }else root.innerHTML=html;
    if (unit.journey) {
      global.document.documentElement.classList.toggle('journey-theme', view.screen === 'map');
      global.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#141f23');
    }
    const modal = root.querySelector('[aria-modal="true"]');
    if (modal) {
      if (!previousModal && action && !modalReturnFocus) modalReturnFocus = {action,id};
      for (const child of (root.querySelector('.lp-shell') || root).children) if (!child.contains(modal)) child.inert = true;
      modal.querySelector('button')?.focus();
    } else if (changed) {
      global.scrollTo({ top: 0, behavior: 'instant' });
      root.querySelector('[data-lesson-title]')?.focus({ preventScroll: true });
      if(view.screen==='map')revealCurrentNode(view);
    } else if (previousModal && modalReturnFocus) {
      const trigger = [...root.querySelectorAll('[data-action]')].find(el => el.dataset.action === modalReturnFocus.action && el.dataset.id === modalReturnFocus.id);
      trigger?.focus({preventScroll:true});
      trigger?.scrollIntoView({block:'center',behavior:'instant'});
      modalReturnFocus = null;
    } else if (action) {
      [...root.querySelectorAll('[data-action]')].find(el => el.dataset.action === action && el.dataset.id === id)?.focus({ preventScroll: true });
    }
    const history = root.querySelector('.lp-story-transcript');
    if (history) history.scrollTop = turnChanged || changed || historyAtBottom ? history.scrollHeight : historyScroll;
    if (turnChanged && !changed) {
      global.scrollTo({ top: 0, behavior: 'instant' });
      root.querySelector('[data-lesson-title]')?.focus({ preventScroll: true });
    }
    const feedback = root.querySelector('.lp-feedback');
    const feedbackShown = feedback && (changed || view.feedback !== lastView?.feedback);
    if (feedback && (feedbackShown || focusFeedback)) feedback.focus({ preventScroll: true });
    // Keep the explanation visible when submitting an answer adds content below
    // the choices. The sticky action bar must not cover the reason to retry.
    if (feedbackShown && !feedback.closest('.lp-footer')) feedback.scrollIntoView({ block: 'center', behavior: 'instant' });
    const activeLine = root.querySelector('.lp-chat-row[aria-current="true"]');
    const currentRef = view.audio?.sequence[view.audio.index]?.ref;
    const previousRef = lastView?.audio?.sequence[lastView.audio.index]?.ref;
    if (activeLine && view.audio?.status === 'playing' && currentRef !== previousRef) {
      const bounds = activeLine.getBoundingClientRect();
      const footerHeight = root.querySelector('.lp-footer')?.getBoundingClientRect().height || 0;
      if (bounds.top < 75 || bounds.bottom > global.innerHeight - footerHeight - 16) activeLine.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
    lastView = view;
  }
  function playEffect(effect) {
    if (effect.type === 'play-feedback') {
      feedbackMedia?.pause();
      const audio=new global.Audio(effect.src);feedbackMedia=audio;audio.volume=effect.volume;
      audio.addEventListener('ended',()=>{if(feedbackMedia===audio)feedbackMedia=null;},{once:true});
      // Optional feedback is a separate channel: failure never blocks answering
      // or reports a failed lesson recording, and ended never earns listening.
      try { Promise.resolve(audio.play()).catch(()=>{}); } catch {}
      return;
    }
    if (effect.type === 'export-record') {
      const url=URL.createObjectURL(new Blob([effect.content],{type:'application/json'}));
      const link=global.document.createElement('a');link.href=url;link.download='canran-learning-record.json';link.click();global.setTimeout(()=>URL.revokeObjectURL(url),1000);return;
    }
    if (effect.type === 'stop-audio') { stop(); return; }
    if (effect.type === 'pause-audio') { media?.pause(); return; }
    if (effect.type === 'resume-audio') {
      const token = mediaToken;
      if (media) Promise.resolve(media.play()).catch(error => { if (token === mediaToken) send({ ...effect, type: 'audio-error', blocked: error.name === 'NotAllowedError' }); });
      return;
    }
    if (effect.type !== 'play-audio') return;
    stop();
    const token = mediaToken;
    const audio = new global.Audio(effect.src); media = audio;
    const event = type => ({ type, requestId: effect.requestId, index: effect.index });
    audio.preload = 'auto';
    // Play the original recording at its native speed.
    audio.defaultPlaybackRate = 1;
    audio.playbackRate = 1;
    audio.addEventListener('ended', () => { if (token === mediaToken) send(event('audio-ended')); }, { once: true });
    audio.addEventListener('error', () => { if (token === mediaToken) send({ ...event('audio-error'), blocked: false }); }, { once: true });
    Promise.resolve(audio.play()).catch(error => { if (token === mediaToken) send({ ...event('audio-error'), blocked: error.name === 'NotAllowedError' }); });
  }
  function send(event) {
    if (event.type === 'map') journeyUI = { tab: 'path', selectedNodeId: null };
    if (['open-node', 'references', 'review', 'open-challenge','open-placement','reset-confirm'].includes(event.type)) journeyUI.selectedNodeId = null;
    const run = () => {
      const result = runtime.dispatch(event,{light:true});
      // Clock-only updates preserve focus and the one-shot celebration.
      if(event.type==='session-visibility'&&!result.view.saveState)lastView=result.view;
      else render(result.view);
      result.effects.forEach(playEffect);
    };
    // Serialize callbacks and clicks, then use the same lock across tabs before
    // the store's revision check and verified write.
    work = work.then(() => global.navigator.locks?.request ? global.navigator.locks.request(runtime.storageKey, run) : run()).catch(error => {
      global.console.error('Learning path action failed', error);
      stop();
      // Error recovery is a screen transition too; release the map theme.
      render({ screen: 'blocked' });
    });
    return work;
  }
  root.addEventListener('click', event => {
    const lessonLink=event.target.closest('.journey-lesson-index a[href^="#chapter-"]');
    if (lessonLink && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      // Collapse the directory before native fragment navigation measures the
      // destination. The section's scroll margin keeps its jump button clear
      // of the sticky statistics and Lesson banner.
      event.preventDefault();
      journeyUI.selectedNodeId=null;
      render(runtime.snapshot());
      const heading=global.document.getElementById(lessonLink.hash.slice(1))?.querySelector('h1');
      if (heading) {heading.tabIndex=-1;heading.focus({preventScroll:true});heading.closest('.journey-chapter').scrollIntoView({block:'start',behavior:'instant'});}
      return;
    }
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled) return;
    if (button.dataset.action === 'reset-request') modalReturnFocus = {action:button.dataset.action,id:button.dataset.id};
    if (unit.journey && (button.dataset.action.startsWith('journey-') || button.dataset.action === 'preview-node')) {
      const action = button.dataset.action, id = button.dataset.id;
      const motion = global.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
      if ((action === 'journey-nav' && id === 'book') || action === 'journey-book') {
        send({ type: 'references' }).then(() => { if (action === 'journey-book') send({ type: 'reference-section', id: 'lesson'+id }); });
        return;
      }
      if (action === 'journey-locate') {
        journeyUI.selectedNodeId=null;render(runtime.snapshot());
        root.querySelector('[data-journey-current]')?.scrollIntoView({ block: 'center', behavior: motion });
        root.querySelector('[data-journey-current]')?.focus({ preventScroll: true });
        return;
      }
      if (action === 'journey-greet') {
        const companion = button.closest('.journey-companion');
        if (companion.classList.contains('is-waving')) return;
        companion.classList.add('is-waving');
        companion.querySelector('.journey-greeting').hidden = false;
        global.setTimeout(() => { companion.classList.remove('is-waving'); companion.querySelector('.journey-greeting').hidden = true; }, 1700);
        return;
      }
      const previousId = journeyUI.selectedNodeId;
      if (action === 'journey-nav') journeyUI = { tab: id, selectedNodeId: null };
      if (action === 'preview-node') journeyUI.selectedNodeId = previousId === id ? null : id;
      if (action === 'journey-close') journeyUI.selectedNodeId = null;
      render(runtime.snapshot());
      if (action === 'journey-nav') {
        global.scrollTo({ top: 0, behavior: 'instant' });
        root.querySelector('[data-lesson-title]')?.focus({ preventScroll: true });
        if(id==='path')revealCurrentNode(lastView);
      }
      if (journeyUI.selectedNodeId) root.querySelector('.journey-preview')?.scrollIntoView({ block: 'nearest', behavior: motion });
      if (action === 'journey-close') root.querySelector(`.journey-node[data-id="${previousId}"]`)?.focus({ preventScroll: true });
      return;
    }
    const exercise=root.querySelector('[data-exercise-id]');
    const attempt=lastView?.placementAttempt;
    send({type:button.dataset.action,id:button.dataset.id,nodeId:button.dataset.id,scope:button.dataset.scope||button.dataset.id,questionId:exercise?.dataset.exerciseId,attemptId:attempt?.id});
  });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && runtime.snapshot().resetRequest) { send({type:'reset-cancel'}); return; }
    if (event.key === 'Escape' && journeyUI.selectedNodeId) {
      const id = journeyUI.selectedNodeId;
      journeyUI.selectedNodeId = null;
      render(runtime.snapshot());
      root.querySelector(`.journey-node[data-id="${id}"]`)?.focus({ preventScroll: true });
      return;
    }
    const modal = root.querySelector('[aria-modal="true"]');
    if (!modal || event.key !== 'Tab') return;
    const buttons = [...modal.querySelectorAll('button:not(:disabled),a[href]')];
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && global.document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && global.document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  global.addEventListener('pagehide', () => {stop();feedbackMedia?.pause();feedbackMedia=null;});
  // A smaller viewport can wrap earlier lines and displace the current turn.
  // Keep the latest story context visible after a resize or orientation change.
  global.addEventListener('resize', () => {
    const history = root.querySelector('.lp-story-transcript');
    if (history) history.scrollTop = history.scrollHeight;
  });
  global.document.addEventListener('visibilitychange', () => {
    send({ type: 'session-visibility', hidden: global.document.hidden });
    if (global.document.hidden && lastView?.audio?.status === 'playing') send({ type: 'pause' });
  });
  // Loading can migrate a historical record. Use the same cross-tab lock as
  // every later commit before the first record is read or written.
  send({type:'reload'});
})(globalThis);
