/* Opt-in presentation for paired courses. The existing runner owns all answers,
   attempts, hints, rounds and storage; this module only arranges its DOM. */
(function(root){
 'use strict';
 const workspace=document.getElementById('lessonWorkspace');
 const pair=/^unit(\d+)-(\d+)$/.exec(document.documentElement.dataset.unit||''),first=Number(pair?.[1]);
 if(!workspace||!pair||first<1||first>143||first%2!==1||Number(pair[2])!==first+1)return;
 const body=document.body,originalNav=document.querySelector('.chapter-select select'),flow=root.CanranCore.learningFlow;
 const make=(tag,cls,text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
 const toolbar=make('nav','practice-screen-toolbar');toolbar.setAttribute('aria-label','当前练习导航');toolbar.hidden=true;
 const back=make('a','practice-screen-back','←');back.setAttribute('aria-label','我的课程');
 const chapters=make('select','practice-screen-chapters');chapters.setAttribute('aria-label','切换学习关卡');
 const syncBadge=make('span','practice-screen-sync');syncBadge.setAttribute('role','status');syncBadge.hidden=true;
 const more=make('button','practice-screen-more','•••');more.type='button';more.setAttribute('aria-label','更多学习操作');more.setAttribute('aria-haspopup','dialog');
 if(flow){
  const route=make('div','learning-route'),course=make('span','learning-course',flow.lesson);route.append(course);toolbar.append(back,route,syncBadge,more);flow.icon(back,'back');flow.icon(more,'more');
 }else toolbar.append(back,chapters,syncBadge,more);
 const menu=make('dialog','practice-screen-menu');menu.setAttribute('aria-label','学习操作');
 const menuHeading=make('div','practice-screen-menu-heading');menuHeading.append(make('h2','','学习操作'));
 const close=make('button','practice-screen-menu-close','关闭');close.type='button';close.onclick=()=>menu.close();menuHeading.append(close);
 const menuContent=make('div','practice-screen-menu-content');menu.append(menuHeading,menuContent);
 body.prepend(toolbar);body.append(menu);
  flow?.mountNavigation(toolbar);
 let active=null,runner=null,frame=0,previousPadding='',navMarkup='',view='';
 const layouts=new WeakMap();
 const choiceMinimums=new WeakMap();
 function resetChoiceMinimums(content){
  for(const button of content.querySelectorAll('.practice-options>.opt-btn')){
   if(choiceMinimums.has(button))button.style.minHeight=choiceMinimums.get(button);
  }
 }
 function fitChoiceText(content){
  for(const button of content.querySelectorAll('.practice-options>.opt-btn')){
   if(button.childNodes.length!==1||button.firstChild.nodeType!==Node.TEXT_NODE)continue;
   const range=document.createRange();range.selectNodeContents(button);
   const lines=[...range.getClientRects()].filter(r=>r.width>0&&r.height>0).length;if(!lines)continue;
   const s=getComputedStyle(button),number=name=>parseFloat(s[name])||0;
   const needed=lines*(number('lineHeight')||number('fontSize')*1.2)+number('paddingTop')+number('paddingBottom')+number('borderTopWidth')+number('borderBottomWidth');
   if(!choiceMinimums.has(button))choiceMinimums.set(button,button.style.minHeight);
   // Some WebKit grid/button combinations keep a previous intrinsic height
   // after resize. Anchor the minimum to the text's current line layout.
   button.style.minHeight=Math.max(number('minHeight'),needed)+'px';
  }
 }
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(refresh);};
 function size(){
  if(!active)return;
  const viewport=root.visualViewport,height=viewport?.height||root.innerHeight,top=viewport?.offsetTop||0;
  body.style.setProperty('--practice-screen-height',height+'px');body.style.setProperty('--practice-screen-top',top+'px');
  body.toggleAttribute('data-practice-short',height<500);
  flow?.resize(active,view);
  fit();
  body.dataset.practiceViewport=root.innerWidth+'x'+Math.round(height);
 }
 function fit(){
  const content=runner?.querySelector(':scope > .practice-content');if(!content)return;
  const available=flow?Math.max(0,runner.clientHeight-(runner.querySelector(':scope > .practice-actions')?.offsetHeight||0)-6):content.clientHeight;
  const key=content.clientWidth+'x'+available;
  if(layouts.get(content)===key)return;
  layouts.set(content,key);
  content.classList.remove('learning-tight-question');
  const answer=content.querySelector('.translation-answer'),tokens=content.querySelectorAll('.translation-bank .opt-btn');
  if(answer&&tokens.length){
   const sample=answer.querySelector('.opt-btn,.translation-slot'),style=sample&&getComputedStyle(sample);
   if(style){
    const width=sample.getBoundingClientRect().width-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-4;
    const measure=document.createElement('div');Object.assign(measure.style,{position:'absolute',visibility:'hidden',pointerEvents:'none',width:Math.max(1,width)+'px',font:style.font,lineHeight:style.lineHeight,overflowWrap:'anywhere',whiteSpace:'normal',padding:'0',border:'0'});content.append(measure);
    let height=44;for(const token of tokens){measure.textContent=token.getAttribute('aria-label')||token.textContent;height=Math.max(height,Math.ceil(measure.getBoundingClientRect().height+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)+4));}measure.remove();
    // Reserve the tallest possible token before selection, so placing a long
    // phrase never changes the answer rows or moves the check button.
    answer.style.setProperty('--answer-row-height',height+'px');
   }
  }
  const progress=content.querySelector('.practice-progress');
  if(progress&&!progress.querySelector('.practice-screen-title')){const title=make('span','practice-screen-title',active.getAttribute('aria-label'));title.setAttribute('role','heading');title.setAttribute('aria-level','2');progress.prepend(title);}
  const options=content.querySelector('.practice-options:not(.task-input):not(.sentence-options):not(.quest-recipients):not(.quest-object-targets)');
  const autoColumns=options&&!options.querySelector('.picture-option')&&!runner.classList.contains('counter-runner')&&!runner.classList.contains('handbag-runner');
  const materials=[...content.querySelectorAll(flow?'.grammar-model,.practice-context,.task-reference,.task-reading':'.grammar-model,.practice-context,.task-reference')];
  const banks=flow?[...content.querySelectorAll('.wordbank')]:[];
  for(const bank of banks){bank.classList.remove('learning-compact-wordbank');for(const token of bank.children)token.style.removeProperty('--wordbank-columns');}
  resetChoiceMinimums(content);
  if(autoColumns)options.style.removeProperty('grid-template-columns');
  for(const material of materials){material.style.removeProperty('max-height');material.classList.remove('practice-screen-material');material.removeAttribute('tabindex');material.removeAttribute('aria-description');}
  if(flow)flow.sizeQuestion(content,available);
  if(flow)fitChoiceText(content);
  if(autoColumns){
   if(content.scrollHeight>content.clientHeight+2){
    const before=content.scrollHeight;options.style.gridTemplateColumns='repeat(2,minmax(0,1fr))';
    if(flow){resetChoiceMinimums(content);fitChoiceText(content);}
    if(content.scrollHeight>=before){options.style.removeProperty('grid-template-columns');if(flow){resetChoiceMinimums(content);fitChoiceText(content);}}
   }
  }
  // Sentence choices often wrap into two loose rows on a narrow phone.
  // Try equal columns only when they reduce overflow; never shrink tap targets.
  for(const choices of content.querySelectorAll('.cloze-choices')){
   choices.style.removeProperty('display');choices.style.removeProperty('grid-template-columns');
   if(flow&&choices.children.length===3&&content.scrollHeight>content.clientHeight+2){
    const before=content.scrollHeight;choices.style.display='grid';choices.style.gridTemplateColumns='repeat(3,minmax(0,1fr))';
    if(content.scrollHeight>=before){choices.style.removeProperty('display');choices.style.removeProperty('grid-template-columns');}
   }
  }
  // A legal shuffle can put two long tokens first and strand a short token
  // on a third row. Use a normal (not dense) grid only when it saves height;
  // DOM order, saved token order and keyboard order all remain unchanged.
  for(const bank of banks){
   if(content.scrollHeight<=content.clientHeight+2)continue;
   const before=content.scrollHeight,width=bank.clientWidth;
   for(const token of bank.children){const natural=token.getBoundingClientRect().width;token.style.setProperty('--wordbank-columns',String(natural>width*.75?4:natural>width/4?2:1));}
   bank.classList.add('learning-compact-wordbank');
   if(content.scrollHeight>=before){bank.classList.remove('learning-compact-wordbank');for(const token of bank.children)token.style.removeProperty('--wordbank-columns');}
  }
  for(const material of materials){
   const excess=content.scrollHeight-content.clientHeight;
   if(excess>2){
    const minimum=material.classList.contains('task-reading')?96:material.classList.contains('grammar-model')?(flow&&root.innerHeight<=620?48:72):56;
    if(material.offsetHeight>minimum){material.style.maxHeight=Math.max(minimum,material.offsetHeight-excess-2)+'px';material.classList.add('practice-screen-material');material.tabIndex=0;material.setAttribute('aria-description','内容较长，可在此上下滚动查看');}
   }
  }
  if(flow&&content.scrollHeight>content.clientHeight+2)content.classList.add('learning-tight-question');
  content.dataset.screenOverflow=String(content.scrollHeight>content.clientHeight+2);
 }
 function syncNavigation(){
  back.href=document.getElementById('logo')?.href||'/';
  if(originalNav&&navMarkup!==originalNav.innerHTML){navMarkup=originalNav.innerHTML;chapters.replaceChildren(...[...originalNav.options].map(option=>option.cloneNode(true)));if(flow){const cover=make('option','','课程封面');cover.value='cover';chapters.prepend(cover);}}
  if(originalNav)chapters.value=originalNav.value;
  if(flow&&view==='cover')chapters.value='cover';
  const status=document.getElementById('studentSyncStatus'),state=status?.dataset.syncState;
  syncBadge.hidden=!status||state==='synced'||state==='preview';
  syncBadge.textContent=state==='pending'?'同步中':'待同步';syncBadge.title=status?.textContent||'';
 }
 function action(label,run){const b=make('button','practice-screen-menu-action',label);b.type='button';b.onclick=run;menuContent.append(b);}
  function reviewAction(run){menu.setAttribute('data-review-navigation','');menu.close();run();}
 more.onclick=()=>{
  menuContent.replaceChildren();
  const status=document.getElementById('studentSyncStatus');if(status)menuContent.append(make('p','practice-screen-menu-status',flow&&status.dataset.syncState==='synced'?'已同步':status.textContent));
  const count=document.getElementById('starCount');if(count)menuContent.append(make('p','practice-screen-menu-stars','本单元星星 '+count.textContent+' / 5'));
  if(flow){action('课程封面',()=>{menu.close();location.hash='cover';});action('我的纪念卡',()=>{menu.close();location.hash='learn/certificate';});}
  const controller=root.CanranCore.lesson49Practice.controllerFor?.(runner),progress=controller?.progress();
  if(progress?.reviewEnabled){
   if(progress.reviewing)action(progress.completed?'返回本轮结果':'回到当前题',()=>reviewAction(()=>controller.returnCurrent()));
   else if(progress.completed&&!runner.querySelector('.practice-finish')?.inert)action('回看本轮答题',()=>reviewAction(()=>controller.review(0)));
  }
  for(const original of [document.getElementById('notebookButton'),document.querySelector('.student-access-bar button')])if(original){
   action(flow&&original.closest('.student-access-bar')?'学习设置':original.textContent,()=>{menu.close();original.click();});
  }
  for(const reference of active?.querySelectorAll(':scope > details')||[]){
   if(flow?.openReference&&reference.classList.contains('grammar-reference')){
    action(reference.querySelector('summary').textContent,()=>{menu.close();flow.openReference(reference,more);});continue;
   }
   const copy=reference.cloneNode(true);copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));copy.removeAttribute('id');
   // cloneNode preserves the worksheet text, but not its registered print
   // listener. Keep one canonical print action and delegate the menu control.
   if(reference.id==='unitWriting'){
    const originalPrint=reference.querySelector('.activity-actions button'),copyPrint=copy.querySelector('.activity-actions button');
    let printing=false;
    if(originalPrint&&copyPrint)copyPrint.addEventListener('click',()=>{
     if(printing)return;printing=true;
     // Print CSS targets the original worksheet. Expand it for printing only,
     // then restore the learner's original disclosure state on finish/cancel.
     const wasOpen=reference.open;reference.open=true;
     root.addEventListener('afterprint',()=>{reference.open=wasOpen;printing=false;},{once:true});
     originalPrint.click();
    });
   }
   menuContent.append(copy);
  }
  menu.showModal();
 };
 menu.addEventListener('click',event=>{if(event.target===menu){const r=menu.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)menu.close();}});
 document.addEventListener('close',event=>{if(event.target===menu&&menu.hasAttribute('data-review-navigation')){menu.removeAttribute('data-review-navigation');return;}const fromMenu=event.target===menu||event.target.id==='unitNotebook'||event.target.matches?.('.student-settings-dialog');if(active&&fromMenu)requestAnimationFrame(()=>{if(!document.querySelector('dialog[open]'))more.focus({preventScroll:true});});},true);
 chapters.addEventListener('change',()=>{if(flow&&chapters.value==='cover')location.hash='cover';else{originalNav.value=chapters.value;originalNav.dispatchEvent(new Event('change',{bubbles:true}));}schedule();});
 function prepareHints(){
  const hint=runner?.querySelector('.practice-hint'),button=runner?.querySelector('.practice-hint-button');
  if(!hint||!button)return;
  if(button.dataset.screenHint){const expanded=String(!hint.hidden&&!hint.hasAttribute('data-screen-dismissed'));if(button.getAttribute('aria-expanded')!==expanded)button.setAttribute('aria-expanded',expanded);return;}
  button.dataset.screenHint='true';button.addEventListener('click',()=>hint.removeAttribute('data-screen-dismissed'));
  const dismiss=make('button','practice-screen-hint-close','×');dismiss.type='button';dismiss.setAttribute('aria-label','收起线索');
  dismiss.onclick=()=>{hint.setAttribute('data-screen-dismissed','');button.setAttribute('aria-expanded','false');button.focus({preventScroll:true});};hint.append(dismiss);
 }
 function refresh(){
  frame=0;let id;try{id=decodeURIComponent(location.hash.slice(1)||'cover');}catch{id='cover';}
  const target=document.getElementById(id),surface=target?.closest('.shop-stage')||(target?.classList.contains('shop-chapter')?target.querySelector('.shop-stage'):null),candidate=surface?.querySelector('.practice-runner');
  const question=Boolean(candidate?.querySelector(':scope > .practice-content')&&!candidate.querySelector('.practice-finish'));
  const next=flow?(surface||(id==='cover'?document.getElementById('cover'):null)):question?surface:null;
  const nextView=flow?flow.view(next,candidate,question):question?'question':'';
  if(next!==active||nextView!==view){
   const previous=active;flow?.leave?.(active,view);active?.querySelector(':scope > .stage-heading')?.removeAttribute('aria-hidden');active?.classList.remove('practice-screen-stage','learning-surface');runner?.classList.remove('practice-screen-runner');
   active=next;runner=next?candidate:null;view=nextView;body.toggleAttribute('data-practice-screen',question);toolbar.hidden=flow?false:!active;
   if(flow)body.dataset.learningView=view;
   if(active){
    if(!previous)previousPadding=document.documentElement.style.scrollPaddingTop;
    active.classList.toggle('practice-screen-stage',question);if(flow)active.classList.add('learning-surface');active.querySelector(':scope > .stage-heading')?.setAttribute('aria-hidden','true');runner?.classList.toggle('practice-screen-runner',question);document.documentElement.style.scrollPaddingTop='0px';
   }else if(previous){
    menu.close();body.removeAttribute('data-practice-short');document.documentElement.style.scrollPaddingTop=previousPadding;
    requestAnimationFrame(()=>{const target=document.getElementById(id);if(target&&!body.hasAttribute('data-practice-screen')){document.documentElement.style.scrollPaddingTop=(document.getElementById('topbar').getBoundingClientRect().height+12)+'px';target.scrollIntoView({block:'start',behavior:'instant'});}});
   }
  }
  if(active){flow?.prepare(active,runner,view);size();syncNavigation();prepareHints();flow?.present(active,runner,view);}
 }
 root.CanranCore.practiceScreen={
  reveal(element,target){
   refresh();if(!active)return false;
   if(flow&&active.contains(target)){target.tabIndex=-1;if(!document.querySelector('dialog[open]'))target.focus({preventScroll:true});const content=runner?.querySelector('.practice-content');if(content)content.scrollTop=0;else if(view==='words')(active.querySelector('.learning-word-content')||active).scrollTop=0;return true;}
   if(!runner?.contains(target)||runner!==element)return false;
   target.tabIndex=-1;if(!document.querySelector('dialog[open]'))target.focus({preventScroll:true});
   runner.querySelector('.practice-content').scrollTop=0;return true;
  }
 };
 new MutationObserver(schedule).observe(workspace,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','aria-expanded','data-result-motion','inert']});
 root.addEventListener('hashchange',schedule);root.addEventListener('resize',size);
 root.visualViewport?.addEventListener('resize',size);root.visualViewport?.addEventListener('scroll',size);
 root.addEventListener('lesson-sync:status',syncNavigation);
 // The runner emits after the complete new question DOM is ready. Lay it out
 // in that same task, before the browser paints an intermediate natural size.
 root.addEventListener('lesson-practice:navigation',()=>{if(flow){if(frame)cancelAnimationFrame(frame);refresh();}else schedule();});
 workspace.addEventListener('click',schedule);root.addEventListener('pageshow',schedule);
 root.CanranAccessReady?.then(schedule,()=>{});schedule();
 document.fonts?.ready.then(()=>{const content=runner?.querySelector('.practice-content');if(content)layouts.delete(content);schedule();});
})(globalThis);
