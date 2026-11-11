/* Shared presentation for all paired courses. Course controllers keep ownership
   of questions, dialogue, rounds, learning records and reward sequencing. */
(function(root){
 'use strict';
 const unit=root.CanranCore.learningContext,options=root.CanranCore.learningFlowOptions||{};
 const pair=/^unit(\d+)-(\d+)$/.exec(unit?.id||''),first=Number(pair?.[1]);
 if(!pair||first<1||first>143||first%2!==1||Number(pair[2])!==first+1)return;
 unit.copy=Object.assign({questions:{},recordNames:{}},unit.copy||{},{compact:true,incorrectFeedback:'答错了，再试试。',roundIntro:'本组每题一次答对，可点亮一颗星。',reviewCorrect:'首答正确',reviewCorrected:'订正后答对',recordScope:true,completionStatistics:'questions',correctedCompletion:'已完成！再练一轮全对，可点亮星星。'});
 const body=document.body,media=matchMedia('(prefers-reduced-motion: reduce)'),seen=new WeakSet(),motions=new WeakMap(),logs=new WeakMap();
 const make=cls=>{const el=document.createElement('div');el.className=cls;return el;};
 let currentPanel=null,lastBubble=null,animation=null;
 const milestoneLabels=['词汇','故事','语法','应用','挑战'];
 let milestones,courseLabel,explanation,explanationText,explanationSource;
 let referenceSheet,referenceTitle,referenceContent,referenceSource,referenceFocus;
 let recordSheet,recordBody,recordSummary;
 const nameMeasure=document.createElement('canvas').getContext('2d');
 function prepareReadingColumns(scope){
  for(const material of scope.querySelectorAll('.task-reading')){
   const names=[...material.querySelectorAll('.task-reading-turn>small')];if(!names.length)continue;
   let width=32;
   for(const label of names){
    const style=getComputedStyle(label),text=label.textContent||'',letters=Array.from(text).length;
    if(nameMeasure)nameMeasure.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const measured=nameMeasure?nameMeasure.measureText(text).width:letters*parseFloat(style.fontSize);
    width=Math.max(width,Math.ceil(measured+(parseFloat(style.letterSpacing)||0)*Math.max(0,letters-1)+1));
   }
   // All turns in one passage align. Very long labels wrap within the CSS cap,
   // preserving room for the sentence instead of painting into its column.
   const value=width+'px';if(material.style.getPropertyValue('--reading-speaker-width')!==value)material.style.setProperty('--reading-speaker-width',value);
  }
 }
 function mountNavigation(toolbar){
  courseLabel=toolbar.querySelector('.learning-course');
  milestones=document.createElement('ol');milestones.className='learning-milestones';
  unit.reward.zones.forEach((zone,index)=>{
   const item=document.createElement('li');item.dataset.zone=zone.id;
   const link=document.createElement('a'),stage=unit.stages.find(stage=>stage.required.includes(zone.id));
   const route='learn/'+stage.activities[0][0];link.href='#'+(unit.routeAliases?.[route]||route);link.setAttribute('aria-label',milestoneLabels[index]);
   const point=document.createElement('span');point.className='milestone-point';point.setAttribute('aria-hidden','true');point.textContent=String(index+1);
   const label=document.createElement('span');label.textContent=milestoneLabels[index];link.append(point,label);item.append(link);milestones.append(item);
  });toolbar.after(milestones);
  explanation=document.createElement('dialog');explanation.className='learning-explanation-sheet';explanation.setAttribute('aria-labelledby','learning-explanation-title');
  const heading=document.createElement('h2');heading.id='learning-explanation-title';heading.textContent='这一题的讲解';
  explanationText=document.createElement('p');
  const close=document.createElement('button');close.type='button';close.textContent='知道了';close.className='btn btn-green';close.onclick=()=>explanation.close();
  explanation.append(heading,explanationText,close);body.append(explanation);
  explanation.addEventListener('close',()=>{if(explanationSource?.isConnected)explanationSource.focus({preventScroll:true});});
  explanation.addEventListener('click',event=>{if(event.target===explanation){const box=explanation.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)explanation.close();}});
  referenceSheet=document.createElement('dialog');referenceSheet.id='learning-reference-sheet';referenceSheet.className='learning-reference-sheet';referenceSheet.setAttribute('aria-labelledby','learning-reference-title');
  const referenceHeader=document.createElement('header');referenceHeader.className='learning-reference-header';
  referenceTitle=document.createElement('h2');referenceTitle.id='learning-reference-title';
  const referenceClose=document.createElement('button');referenceClose.type='button';referenceClose.textContent='关闭';referenceClose.setAttribute('aria-label','关闭学习参考');referenceClose.onclick=()=>referenceSheet.close();
  referenceHeader.append(referenceTitle,referenceClose);referenceContent=make('learning-reference-content');referenceSheet.append(referenceHeader,referenceContent);body.append(referenceSheet);
  referenceSheet.addEventListener('close',()=>{if(referenceFocus?.isConnected&&!document.querySelector('dialog[open]'))referenceFocus.focus({preventScroll:true});});
  referenceSheet.addEventListener('click',event=>{if(event.target===referenceSheet){const box=referenceSheet.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)referenceSheet.close();}});
  recordSheet=document.getElementById('unitNotebook');recordSheet.classList.add('learning-record-sheet');
  document.getElementById('notebookButton').textContent='学习记录';
  recordSheet.querySelector('#notebookTitle').textContent='学习记录';
  const warning=document.getElementById('learningSaveWarning');if(warning)warning.textContent=warning.textContent.replaceAll('学习手记','学习记录');
  recordBody=make('learning-record-content');recordSummary=document.createElement('p');recordSummary.className='learning-record-overview';recordBody.append(recordSummary);
  for(const item of [...recordSheet.children])if(!item.classList.contains('unit-dialog-heading'))recordBody.append(item);
  recordSheet.append(recordBody);
  document.getElementById('notebookButton').addEventListener('click',()=>prepareNotebook(document.querySelector('.learning-surface')),true);
  recordSheet.addEventListener('click',event=>{if(event.target===recordSheet){const box=recordSheet.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)recordSheet.close();}});
  new MutationObserver(()=>{if(recordSheet.open)prepareNotebook(document.querySelector('.learning-surface'),false);}).observe(document.getElementById('learningRecord'),{childList:true});
 }
 function prepareNotebook(surface,reset=true){
  if(!recordSheet)return;
  const stage=unit.stages.find(item=>item.id===surface?.closest('.shop-chapter')?.id),active=unit.reward.zones.find(zone=>stage?.required.includes(zone.id))?.id;
  const completed=(root.CanranCore.learningProgress?.()||[]).filter(item=>item.completed).length;
  const overview=`已学 ${completed}/5 关 · 星星 ${document.getElementById('starCount').textContent}/5\n最近作答，区分本轮与此前记录。`;
  if(recordSummary.textContent!==overview)recordSummary.textContent=overview;
  for(const section of [...document.querySelectorAll('#learningRecord > section')]){
   const group=document.createElement('details');group.className='learning-record-group';group.dataset.activity=section.dataset.activity;group.open=section.dataset.activity===active;
   const title=document.createElement('summary'),heading=section.querySelector('h3');title.textContent=heading.textContent;heading.remove();group.append(title,...section.childNodes);section.replaceWith(group);
  }
  if(reset){for(const group of document.querySelectorAll('.learning-record-group'))group.open=group.dataset.activity===active;recordBody.scrollTop=0;}
 }
 function openReference(source,focus){
  // Reference text stays authored in grammar.js. Copy only its reading content;
  // the original details never participates in the fixed learning surface.
  referenceSource=source;referenceFocus=focus;referenceTitle.textContent=source.querySelector('summary').textContent;
  const parts=[...source.children].filter(item=>item.tagName!=='SUMMARY').map(item=>item.cloneNode(true));
  referenceContent.replaceChildren(...parts);
  referenceContent.querySelectorAll('[id]').forEach(item=>item.removeAttribute('id'));
  for(const card of referenceContent.querySelectorAll('.reference-card')){
   const copy=make('learning-reference-copy');
   for(const child of [...card.childNodes])if(!(child.nodeType===1&&['IMG','SVG','PICTURE'].includes(child.tagName)))copy.append(child);
   card.append(copy);card.classList.add('learning-reference-card');
  }
  for(const term of [...referenceContent.querySelectorAll('.grammar-expression-list > dt')]){
   const meaning=term.nextElementSibling,pair=make('learning-reference-entry');term.before(pair);pair.append(term);if(meaning?.tagName==='DD')pair.append(meaning);
   const text=unit.copy.references?.[term.textContent];if(text&&meaning?.tagName==='DD')meaning.textContent=text;
  }
  referenceSheet.showModal();referenceContent.scrollTop=0;
 }
 function updateMilestones(surface){
  if(!milestones)return;
  const states=root.CanranCore.learningProgress?.()||[],count=states.filter(item=>item.completed).length;
  const stage=unit.stages.find(item=>item.id===surface?.closest('.shop-chapter')?.id);
  const selected=states.find(item=>stage?.required.includes(item.id))?.id;
  milestones.setAttribute('aria-label',`学习进度：已学 ${count} / 5 个阶段`);
  const copy=root.CanranCore.learningFlow.lesson+` · 已学 ${count}/5`;if(courseLabel.textContent!==copy)courseLabel.textContent=copy;
  [...milestones.children].forEach((item,index)=>{
   const state=states.find(state=>state.id===item.dataset.zone),done=Boolean(state?.earned),current=item.dataset.zone===selected;
   item.classList.toggle('is-complete',done);item.classList.toggle('is-current',current);
   item.classList.toggle('is-connected',done&&index>0&&Boolean(states[index-1]?.earned));
   item.setAttribute('aria-label',`${milestoneLabels[index]}：${done?'已获星':state?.completed?'已学完，未获星':'未学完，未获星'}${current?'，当前阶段':''}`);
   if(current)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');
   const link=item.querySelector('a');if(current)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');
   const point=item.querySelector('.milestone-point'),symbol=done?'✓':String(index+1);if(point.textContent!==symbol)point.textContent=symbol;
  });
 }
 function groupQuestionMaterials(content){
  if(!options.combineQuestionMaterials||content.querySelector('.learning-material-source'))return;
  const image=content.querySelector('img.practice-scene:not(.practice-options img)'),notes=[...content.querySelectorAll('.practice-context,.task-reference')].filter(e=>!e.closest('.learning-context-source'));
  if(!image||!notes.some(e=>e.textContent.length>120))return;
  const source=document.createElement('details');source.className='learning-material-source';source.hidden=true;
  const summary=document.createElement('summary');summary.textContent='题目材料';source.append(summary);
  const button=document.createElement('button');button.type='button';button.className='learning-material-preview';button.setAttribute('aria-label','查看题目材料');button.setAttribute('aria-haspopup','dialog');
  const thumb=image.cloneNode(false);thumb.className='learning-material-thumb';thumb.alt='';const label=document.createElement('span');label.textContent='查看题目材料';const arrow=document.createElement('span');arrow.textContent='›';arrow.setAttribute('aria-hidden','true');button.append(thumb,label,arrow);
  const heading=content.querySelector('h3');heading.after(button,source);image.classList.add('learning-material-image');source.append(image,...notes);
  for(const note of notes){note.classList.remove('practice-screen-material');note.style.removeProperty('max-height');note.removeAttribute('tabindex');note.removeAttribute('aria-description');}
  // The generic scenario helper describes this same task; its extra tile is
  // redundant when the authored record and text have their own single entry.
  for(const old of content.querySelectorAll('.learning-context-preview,.learning-context-source'))old.hidden=true;
  button.onclick=()=>openReference(source,button);
 }
 function prepareQuestion(runner){
  const content=runner.querySelector('.practice-content');
  for(const scene of content.querySelectorAll('[class$="-application"]')){
   if(scene.closest('.learning-context-source')||scene.querySelector('button,input,select,textarea,a'))continue;
   const source=document.createElement('details');source.className='learning-context-source';source.open=true;
   const summary=document.createElement('summary');summary.hidden=true;summary.textContent=scene.getAttribute('aria-label')||'情境图';source.append(summary);scene.before(source);source.append(scene);
   const button=document.createElement('button');button.type='button';button.className='learning-context-preview';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label','查看情境：'+summary.textContent);
   const image=scene.querySelector('img');if(image){const thumb=image.cloneNode(false);thumb.alt='';button.append(thumb);}
   const copy=make('learning-context-preview-copy'),title=document.createElement('span'),hint=document.createElement('small');title.textContent=summary.textContent;hint.textContent='查看完整情境 ›';copy.append(title,hint);button.append(copy);source.before(button);button.onclick=()=>openReference(source,button);
  }
  groupQuestionMaterials(content);
  const materials=[...content.querySelectorAll('.practice-context,.task-reference')].filter(e=>!e.closest('.learning-material-source'));
  prepareReadingColumns(content);
  if(materials.length||content.querySelector('.learning-material-source')){
   const heading=content.querySelector('h3');let group=content.querySelector('.learning-question-heading');
   if(heading&&!group){group=make('learning-question-heading');heading.before(group);group.append(heading);}
   if(group)for(const material of materials)if(!group.contains(material))group.append(material);
  }
  const full=content.querySelector('.reading-full');
  if(full&&!content.querySelector('.learning-full-story')){
   full.open=false;full.hidden=true;
   const button=document.createElement('button');button.type='button';button.className='btn btn-yellow learning-full-story';button.textContent='查看全文';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','learning-reference-sheet');button.setAttribute('data-practice-review-navigation','');
   button.onclick=()=>openReference(full,button);full.closest('.task-reading').after(button);
  }
  const controller=root.CanranCore.lesson49Practice.controllerFor?.(runner),progress=controller?.progress();
  if(progress?.reviewing&&!content.querySelector('.learning-review-return')){
   const button=document.createElement('button');button.type='button';button.className='learning-review-return';button.textContent=progress.completed?'返回结果':'回到当前题';button.setAttribute('data-practice-review-navigation','');button.onclick=()=>controller.returnCurrent();
   const row=content.querySelector('.practice-progress');row.classList.add('learning-review-progress');row.prepend(button);
  }
  const rule=runner.querySelector('.grammar-rule');if(!rule?.textContent)return;
  const row=runner.querySelector('.practice-submit-row'),hint=row.querySelector('.practice-hint-button');
  let button=row.querySelector('.learning-explanation-button');
  if(!button){
   button=document.createElement('button');button.type='button';button.className='btn btn-yellow learning-explanation-button';button.setAttribute('aria-label','讲解');button.title='讲解';button.append(root.CanranCore.lesson49Icons.create('hint'));
   button.setAttribute('aria-haspopup','dialog');button.setAttribute('data-practice-review-navigation','');
   button.onclick=()=>{if(button.disabled)return;explanationSource=button;explanationText.textContent=rule.textContent;explanation.showModal();};
   const previous=row.querySelector('.practice-previous');if(previous)previous.after(button);else row.prepend(button);
  }
  const ready=!rule.hidden;
  if(button.disabled===ready)button.disabled=!ready;
  if(button.hidden!==Boolean(hint&&!ready))button.hidden=Boolean(hint&&!ready);
  if(hint&&hint.hidden!==ready)hint.hidden=ready;
 }
 body.setAttribute('data-learning-shell','');
 const cover=document.getElementById('cover');
 cover?.querySelector('.unit-cover-art')?.classList.add('current-cover');
 cover?.querySelector('h1')?.parentElement?.classList.add('cover-copy');
 function motion(){
  for(const name of ['localStorage','sessionStorage'])try{const value=root[name].getItem('canran-award-book-v1:motion');if(value==='on'||value==='off')return value==='on';}catch{}
  return !media.matches;
 }
 function enter(panel,animate=true){
  if(!panel||panel===currentPanel)return;
  const previous=currentPanel;currentPanel=panel;animation?.cancel();animation=null;
  if(!previous||!motion()||!animate)return;
  panel.dataset.learningMotion='entering';
  const own=panel.animate([{opacity:.72,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:190,easing:'cubic-bezier(.2,.7,.3,1)'});
  animation=own;motions.set(panel,own);own.finished.catch(()=>{}).finally(()=>{if(motions.get(panel)===own){delete panel.dataset.learningMotion;motions.delete(panel);}if(animation===own)animation=null;});
 }
 function prepare(surface,runner,view){
  for(const reference of document.querySelectorAll('.shop-stage:not(.stage-certificate)>details.offline-task'))reference.classList.add('grammar-reference');
  if(referenceSheet?.open&&!surface.contains(referenceSource))referenceSheet.close();
  updateMilestones(surface);
  if(view==='question')prepareQuestion(runner);
  if(view==='result'){
   const finish=runner.querySelector('.practice-finish'),actions=finish.querySelector('.practice-finish-actions');
   const onward=actions.querySelector('[data-station-next]');
   if(onward){
    const destination=(onward.getAttribute('aria-label')||'').replace(/^下一站：/,'');
    if(/纪念卡/.test(destination)){onward.textContent='查看纪念卡';onward.setAttribute('aria-label','查看纪念卡');delete onward.dataset.stationNext;}
    else if(destination&&!onward.parentElement.querySelector('.station-destination')){const label=document.createElement('p');label.className='station-destination';label.textContent='接下来：'+destination;onward.before(label);}
   }
   let content=finish.querySelector(':scope > .learning-result-content');
   if(!content){content=make('learning-result-content');finish.prepend(content);}
   for(const item of [...finish.children])if(item!==content&&item!==actions)content.append(item);
  }
  if(view==='story'){
   const scene=surface.querySelector(options.storySelector||'.dialogue-stage');
   let content=surface.querySelector(':scope > .learning-story-content');
   if(!content){content=make('learning-story-content');scene.before(content);content.append(scene,surface.querySelector('.dialogue-status'));}
   const log=scene.querySelector('.dialogue-log');
   if(!logs.has(log)){const state={bottom:true,key:'',position:0,restore:true};logs.set(log,state);log.addEventListener('scroll',()=>{if(!surface.classList.contains('learning-surface')||body.dataset.learningView!=='story')return;state.bottom=log.scrollHeight-log.clientHeight-log.scrollTop<4;state.position=log.scrollTop;});}
   options.prepareStory?.(scene);
  }
  if(view==='words'){
   // Restoring completed reading mounts its practice before the word UI.
   // Wait for that UI's normal mount rather than failing the whole course.
   const grid=surface.querySelector('.unit-words'),controls=surface.querySelector('.word-controls');
   if(!grid||!controls)return;
   // Art mapping is outside the content definitions so persisted question and
   // word signatures stay byte-for-byte identical. The loader decodes these
   // declared assets before presenting the newly mounted card.
   for(const card of grid.querySelectorAll('.unit-word')){
    const image=card.querySelector(':scope>img'),target=root.CanranCore.learningWordArtwork?.[card.getAttribute('aria-label')];
    if(image&&target&&image.getAttribute('src')!==target)image.src=target;
    const artKind=root.CanranCore.learningWordPresentation?.[card.getAttribute('aria-label')];
    if(artKind&&card.dataset.wordArt!==artKind)card.dataset.wordArt=artKind;
   }
   if(!surface.querySelector('.learning-word-content')){const content=make('learning-word-content');grid.before(content);content.append(grid);}
   let label=surface.querySelector('.learning-word-destination');
   if(!label){label=document.createElement('p');label.className='learning-word-destination';controls.before(label);}
   const next=controls.lastElementChild.getAttribute('aria-label')||'',text=next.startsWith('下一站：')?'接下来：'+next.slice(4):'';
   if(label.textContent!==text)label.textContent=text;if(label.hidden!==!text)label.hidden=!text;
  }
 }
 function present(surface,runner,view){
  const result=runner?.querySelector('.completion-card');
  if(view==='result'&&(result?.inert||result?.dataset.resultMotion==='pending'))return;
  const panel=view==='question'?runner.querySelector('.practice-content'):view==='result'?runner.querySelector('.learning-result-content'):view==='story'?surface.querySelector('.dialogue-stage'):view==='words'?surface.querySelector('.unit-words'):view==='certificate'?surface.querySelector('.story-award-panel'):view==='cover'?surface.querySelector('.current-cover'):surface.querySelector('.activity-actions');
  // Rebuilding a question is not a new page entrance. Fading the whole paper
  // on every Next made cached pictures look as if they flashed while loading.
  enter(panel,view!=='question');
  if(view==='story'){
   const bubble=surface.querySelector('.bubble-row:last-child');
   if(bubble&&bubble!==lastBubble&&!seen.has(bubble)){seen.add(bubble);if(lastBubble&&motion())bubble.animate([{opacity:.55,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:160,easing:'ease-out'});}
   lastBubble=bubble;
  }
 }
 function stop(){body.toggleAttribute('data-learning-reduced',!motion());if(!motion()){animation?.cancel();animation=null;}}
 media.addEventListener('change',stop);root.addEventListener('canran:keepsake-motion',stop);root.addEventListener('storage',stop);stop();
 root.CanranCore.learningFlow={
  lesson:unit.reward.lesson||('Lesson '+unit.id.replace('unit','').replace('-','–')),
  icon(element,name){const image=document.createElement('img');image.src=name==='back'?'/assets/learning-ui/back.svg':'/assets/learning-ui/more.svg';image.alt='';element.replaceChildren(image);},
  view(surface,runner,question){if(!surface)return '';if(question)return 'question';if(runner?.querySelector('.practice-finish'))return 'result';if(surface.id==='cover')return 'cover';if(surface.classList.contains('stage-text'))return 'story';if(surface.classList.contains('stage-words'))return 'words';if(surface.classList.contains('stage-certificate'))return 'certificate';return 'gate';},
  prepare,present,mountNavigation,openReference,prepareNotebook,
  leave(surface,view){if(view!=='story')return;const log=surface.querySelector('.dialogue-log'),state=logs.get(log);if(!state)return;state.position=log.scrollTop;state.bottom=log.scrollHeight-log.clientHeight-log.scrollTop<4;state.restore=true;},
  resize(surface,view){if(view!=='story')return;options.resizeStory?.(surface.querySelector(options.storySelector||'.dialogue-stage'));const log=surface.querySelector('.dialogue-log'),state=logs.get(log);if(!state)return;const key=[log.clientWidth,log.clientHeight,log.scrollHeight].join(':');if(state.restore||key!==state.key){state.key=key;if(state.bottom)log.scrollTop=log.scrollHeight;else if(state.restore)log.scrollTop=state.position;state.restore=false;}},
  sizeQuestion(content,available){
   // The paper belongs to the stable runner, not to a newly created question.
   // Different task lengths must not resize/recenter that paper on every Next.
   content.parentElement.style.setProperty('--learning-paper-height',available+'px');
   content.style.height=available+'px';
  }
 };
})(globalThis);
