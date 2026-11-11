(function(root){
 'use strict';
 if(typeof document==='undefined'||!root.CanranReviewCatalog?.courses.some(course=>location.pathname==='/lesson/'+course.id+'/'))return;
 const params=new URLSearchParams(location.search),frameId=params.get('request'),model=root.CanranReviewState;
 let questionPreset=params.get('preset');
 let requestId=frameId,selection=model.normalize(root.CanranReviewCatalog,{...Object.fromEntries(params),unit:location.pathname.split('/')[2]});
 const course=root.CanranReviewCatalog.courses.find(c=>c.id===selection.unit);
 let entry=course.entries.find(e=>e.id===selection.page);
 function memoryStorage(){const data=new Map();return {get length(){return data.size;},key:i=>[...data.keys()][i]??null,getItem:k=>data.get(String(k))??null,setItem:(k,v)=>data.set(String(k),String(v)),removeItem:k=>data.delete(String(k)),clear:()=>data.clear()};}
 // Each new preview iframe starts a fresh, in-memory student session. Neither storage API touches disk.
 Object.defineProperty(root,'localStorage',{value:memoryStorage(),configurable:false});
 Object.defineProperty(root,'sessionStorage',{value:memoryStorage(),configurable:false});
 const nextReviewCourse=root.CanranReviewCatalog.courses[root.CanranReviewCatalog.courses.indexOf(course)+1];
 root.CanranStudentAccess={student:{id:'review-student',name:'验收同学'},preview:false,nextCourse:nextReviewCourse?{id:nextReviewCourse.id}:null,systemUpgrade:{epoch:'review-only'}};
 root.CanranAccessReady=Promise.resolve(root.CanranStudentAccess);
 const send=(type,extra={})=>root.parent.postMessage({type,requestId,...extra},location.origin);
 let currentUnit,resetAwards,resetCompletion,generation=0,launchListener,applying=true,positionFrame=0,activeReference;
 const practices=new Map();
 function prepareUnit(unit){
  currentUnit=unit;
  const signature=JSON.stringify([unit.version,unit.learning.DIALOGUE]),last=unit.learning.DIALOGUE.length-1;
  const i=entry.kind==='story-line'?entry.index:entry.kind==='story-complete'?last:-1;
  const activity={unitCompleted:{text:signature},unitDialogue:{i,viewed:unit.learning.DIALOGUE.map((_,n)=>n<=i),done:entry.kind==='story-complete',signature},unitWordPage:entry.kind==='words'?entry.index:0};
  localStorage.setItem(unit.progress.learningKey,JSON.stringify({version:1,groups:{},records:{},activity}));
  prepareAwards(unit);
 }
 function prepareAwards(unit){
  const zones={},zoneIds=unit.reward.zones.map(z=>z.id),at='2026-11-02T00:00:00.000Z';
  let earned=[];
  if(entry.kind==='card')earned=zoneIds.slice(0,selection.stars);
  if(entry.kind==='award'){
   earned=zoneIds.filter(id=>id!==entry.activity).slice(0,selection.stars-1);
   if(selection.state==='replay')earned.push(entry.activity);
  }
  earned.forEach(id=>{zones[id]={runId:'review-existing-'+id,earnedAt:at};});
  localStorage.setItem(unit.progress.learningKey+':awards:'+unit.reward.edition,JSON.stringify({edition:unit.reward.edition,zones,firstFullStarAt:earned.length===5?at:null}));
 }
 root.CanranReviewRuntime={prepareUnit,
  registerCompletionReset:reset=>{resetCompletion=reset;},
  referenceOpened:source=>{
   const route=source.closest('.shop-stage')?.id,items=[...source.parentElement.querySelectorAll(':scope>details.offline-task,:scope>details.grammar-reference')];
   activeReference=course.entries.find(item=>item.kind==='reference'&&item.route===route&&item.referenceIndex===items.indexOf(source))?.id;
  },
  registerPractice:(element,reset,read,inherit)=>practices.set(element.id,{element,reset,read,inherit}),registerAwards:reset=>{resetAwards=reset;},
  seedPractice:args=>{const seed=model.seedGroup(args,selection,entry),run=seed.group.runId+'-'+generation;seed.group.runId=run;for(const state of seed.group.states)state.runId=run;for(const state of Object.values(seed.records))state.runId=run;return seed;}
 };
 const twoFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 const visible=el=>!!el&&el.getClientRects().length>0&&!el.hidden;
 function currentRoute(){
  let hash;try{hash=decodeURIComponent(location.hash.slice(1)||'cover');}catch{return null;}
  const target=document.getElementById(hash);return target?.classList.contains('shop-chapter')?target.querySelector('.shop-stage')?.id:hash;
 }
 function locateCurrent(){
  const route=currentRoute(),surface=document.getElementById(route),practice=root.CanranCore.lesson49Practice;
  if(!surface||!practice)return null;
  const candidates=course.entries.filter(item=>item.route===route);
  const position=(item,state,stars=selection.stars)=>item?model.normalize(root.CanranReviewCatalog,{...selection,page:item.id,state,stars}):null;
  const dialog=document.querySelector('dialog[open]');
  if(dialog?.id==='unitNotebook')return position(course.entries.find(e=>e.kind==='record'),'open');
  if(dialog?.classList.contains('practice-screen-menu')){
   const writing=document.getElementById('unitWriting')?.querySelector('summary')?.textContent;
   const writingOpen=[...dialog.querySelectorAll('details[open] summary')].some(s=>s.textContent===writing);
   return position(course.entries.find(e=>e.kind===(writingOpen?'writing':'menu')),'open');
  }
  if(dialog?.id==='learning-reference-sheet'){
   const reference=course.entries.find(e=>e.kind==='reference'&&e.id===activeReference)||course.entries.find(e=>e.kind==='reference'&&e.route===route&&e.reference===dialog.querySelector('h2')?.textContent);
   if(reference)return position(reference,'open');
  }
  const runner=surface.querySelector('.practice-runner'),snapshot=runner&&practices.get(runner.id)?.read?.();
  if(snapshot){
   if(dialog?.classList.contains('award-reveal')){
    const card=dialog.querySelector('.award-card');return position(candidates.find(e=>e.kind==='award'),dialog.dataset.kind==='replay'?'replay':'earned',Number(card?.dataset.stars)||selection.stars);
   }
   if(snapshot.result)return position(candidates.find(e=>e.kind==='result'),snapshot.corrected?'corrected':'perfect');
   const item=candidates.find(e=>e.questionId===snapshot.questionId),state=snapshot.state||{};
   const mode=dialog?.classList.contains('learning-explanation-sheet')?'explanation':dialog?.id==='learning-reference-sheet'&&item?.states.includes('full')?'full':snapshot.review?'review':state.checked?(state.correct?(state.firstCorrect?'correct':'corrected'):'wrong'):state.hintUsed?'hint':state.selection!==null&&state.selection!==undefined||state.tokens?.length||state.pairs?.some(Boolean)||state.fills?.some(Boolean)?'selected':'before';
   return position(item,mode);
  }
  if(route==='learn/words')return position(candidates.find(e=>e.kind==='words'&&e.index===(practice.activity('unitWordPage')||0)),surface.querySelector('.unit-word[aria-expanded=true]')?'expanded':'collapsed');
  if(route==='learn/text'){
   const story=practice.activity('unitDialogue')||{};
   const item=story.done?candidates.find(e=>e.kind==='story-complete'):story.i>=0?candidates.find(e=>e.kind==='story-line'&&e.index===story.i):candidates.find(e=>e.kind==='story-start');
   return position(item,surface.querySelector('.bubble-row:last-child [aria-expanded=true]')?'translated':'english');
  }
  if(route==='learn/certificate')return position(candidates.find(e=>e.kind==='card'),'card',Number(surface.querySelector('.award-card')?.dataset.stars)||0);
  return position(candidates.find(e=>e.kind==='cover'),'view');
 }
 function inheritedOverlay(practice,target,preset,runId){
  const token=generation;
  twoFrames().then(()=>{
   const current=practice.read();
   if(token!==generation||applying||questionPreset!==preset||currentRoute()!==target.route||
      current.review||current.questionId!==target.questionId||current.state?.runId!==runId||document.querySelector('dialog[open]'))return;
   const label=preset==='explanation'?'讲解':practice.element.querySelector('.learning-material-preview')?'查看题目材料':'查看全文';
   clickButton(practice.element,label);schedulePosition();
  }).catch(error=>{if(token===generation)send('review-error',{message:error.message});});
 }
 function enterQuestion(position,carry){
  const target=course.entries.find(item=>item.id===position?.page);
  if(target?.kind!=='question')return position;
  const practice=practices.get(selection.unit.replace('-','')+'-'+target.activity+'-practice');
  const snapshot=practice?.read?.();
  if(!snapshot?.state||snapshot.review||snapshot.questionId!==target.questionId)return position;
  const visit=snapshot.state.runId+'|'+snapshot.questionId;
  if(practice.lastVisit===visit)return position;
  practice.lastVisit=visit;
  // Checking/retrying, closing a sheet or returning from history stays on the
  // same attempt. Only arrival at a new live question consumes the preference.
  if(!carry||!questionPreset||!target.states.includes(questionPreset)||position.state===questionPreset)return position;
  if(!practice.inherit?.(target.questionId,questionPreset))return position;
  if(questionPreset==='explanation'||questionPreset==='full')inheritedOverlay(practice,target,questionPreset,snapshot.state.runId);
  return locateCurrent()||position;
 }
 function followPosition(){
  positionFrame=0;if(applying)return;
  const next=enterQuestion(locateCurrent(),true);if(!next||next.page===selection.page&&next.state===selection.state&&next.stars===selection.stars)return;
  selection=next;entry=course.entries.find(e=>e.id===next.page);send('review-position',{selection});
 }
 function schedulePosition(){if(!applying&&!positionFrame)positionFrame=requestAnimationFrame(followPosition);}
 function clickButton(scope,label){const button=[...scope.querySelectorAll('button')].find(el=>visible(el)&&!el.disabled&&(el.getAttribute('aria-label')===label||el.textContent.trim()===label));if(!button)throw Error('当前页面未找到“'+label+'”');button.click();return button;}
 async function activate(token=generation){
  const ownRequest=requestId;
  await twoFrames();
  if(token!==generation)return;
  try{
   const core=root.CanranCore,runner=entry.activity?document.querySelector('#'+selection.unit.replace('-','')+'-'+entry.activity+'-practice'):null;
   if(entry.kind==='question'&&selection.state==='review')core.lesson49Practice.controllerFor(runner).review(entry.index);
   await twoFrames();
   if(token!==generation)return;
   if(entry.kind==='words'){
    const cards=[...document.querySelectorAll('.unit-words .unit-word')];cards.forEach((card,i)=>{if((card.getAttribute('aria-expanded')==='true')!==(selection.state==='expanded'&&i===0))card.click();});
   }
   if(entry.kind==='story-line'){
    const buttons=[...document.querySelectorAll('.dialogue-log button[aria-expanded]')].filter(visible);if(!buttons.length)throw Error('当前课文未找到中文切换');
    buttons.forEach((button,i)=>{if((button.getAttribute('aria-expanded')==='true')!==(selection.state==='translated'&&i===buttons.length-1))button.click();});
   }
   if(entry.kind==='question'){
    if(selection.state==='hint')clickButton(runner,'给点线索');
    if(selection.state==='explanation')clickButton(runner,'讲解');
    if(selection.state==='full')clickButton(runner,runner.querySelector('.learning-material-preview')?'查看题目材料':'查看全文');
   }
   if(entry.kind==='reference'){
    const scope=document.getElementById(entry.route),references=[...scope.querySelectorAll(':scope>details.offline-task,:scope>details.grammar-reference')];
    const reference=references[entry.referenceIndex]||references.find(el=>el.querySelector('summary')?.textContent.trim()===entry.reference);
    if(!reference)throw Error('未找到参考资料：'+entry.reference);core.learningFlow.openReference(reference,document.querySelector('.learning-more-button'));
   }
   if(entry.kind==='record')document.querySelector('#notebookButton').click();
   if(entry.kind==='menu')clickButton(document,'更多学习操作');
   if(entry.kind==='writing'){
    const original=document.querySelector('#unitWriting');if(!original)throw Error('未找到书面练习');
    clickButton(document,'更多学习操作');
    const title=original.querySelector('summary').textContent;
    const writing=[...document.querySelectorAll('dialog[open] details')].find(el=>el.querySelector('summary')?.textContent===title);
    if(!writing)throw Error('未找到书面练习入口');writing.open=true;writing.scrollIntoView({block:'nearest'});
   }
   if(entry.kind==='card')document.querySelector('.learning-surface')?.scrollTo({top:0});
   await twoFrames();if(token!==generation)return;
   if(entry.kind==='award'){
    // Start the real celebration only after the parent has made this iframe visible.
    const launch=async event=>{if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='review-visible'||event.data.requestId!==ownRequest)return;removeEventListener('message',launch);await twoFrames();if(token!==generation)return;try{
      const finish=[...runner.querySelectorAll('button')].find(el=>visible(el)&&!el.disabled&&/^完成/.test(el.textContent.trim()));
      if(!finish)throw Error('未找到完成按钮');applying=true;finish.click();await twoFrames();if(token===generation)applying=false;
    }catch(error){if(token===generation){applying=false;send('review-error',{message:error.message});}}};launchListener=launch;addEventListener('message',launch);
   }
   enterQuestion(selection,false);
   send('review-ready',{unit:selection.unit,page:entry.id,selection,width:innerWidth,height:innerHeight,fastStates:true});applying=false;
  }catch(error){if(token===generation)send('review-error',{message:error.message});}
 }
 document.addEventListener('canran:course-ready',()=>activate(),{once:true});
 root.addEventListener('message',event=>{
  const data=event.data;
  if(event.source!==parent||event.origin!==location.origin||!data||data.frameId!==frameId||typeof data.requestId!=='string')return;
  if(data.type==='review-preset'||data.type==='review-visible'){
   if(data.requestId===requestId)questionPreset=data.preset||null;
   return;
  }
  if(data.type!=='review-apply')return;
  questionPreset=data.preset||null;
  const live=data.followPosition?(applying?{...selection,page:entry.id}:locateCurrent()):null;
  const next=model.normalize(root.CanranReviewCatalog,live?{...data.selection,unit:live.unit,page:live.page}:data.selection),practice=root.CanranCore.lesson49Practice;
  if(live)entry=course.entries.find(e=>e.id===live.page);
  requestId=data.requestId;generation++;if(launchListener)removeEventListener('message',launchListener);launchListener=null;
  applying=true;
  const target=course.entries.find(item=>item.id===next.page),moving=next.page!==entry.id;
  const canMove=moving&&target&&['question','result','award'].includes(target.kind)&&practices.has(selection.unit.replace('-','')+'-'+target.activity+'-practice');
  const supported=['question','result','award','words','story-line','card'].includes(entry.kind);
  const positioned=currentRoute()===entry.route&&(entry.kind!=='words'||practice.activity('unitWordPage')===entry.index)&&(entry.kind!=='story-line'||practice.activity('unitDialogue')?.i===entry.index);
  if(next.unit!==selection.unit||(!canMove&&(moving||!supported||!positioned))||!resetAwards||!practices.size){send('review-reload',{selection:next});return;}
  // Cancel the old animation/foreground result before replacing isolated demo data.
  root.dispatchEvent(new Event('lesson49:leave-activity'));
  for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  selection=next;entry=target;
  try{
   resetCompletion?.();
   if(moving){history.replaceState(null,'','#'+entry.route);dispatchEvent(new HashChangeEvent('hashchange'));}
   prepareAwards(currentUnit);resetAwards();
   for(const {reset} of practices.values())reset();
   activate(generation);
  }catch(error){send('review-error',{message:error.message});}
 });
 root.addEventListener('lesson-practice:navigation',schedulePosition);
 root.addEventListener('hashchange',schedulePosition);
 document.addEventListener('close',schedulePosition,true);
 for(const type of ['click','input','change','keyup'])document.addEventListener(type,event=>{if(event.isTrusted)schedulePosition();},true);
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');if(!link)return;const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||url.pathname!==location.pathname){event.preventDefault();event.stopPropagation();send('review-navigate',{unit:url.pathname.match(/unit\d+-\d+/)?.[0]||selection.unit,home:link.dataset.courseExit==='home'});}
 },true);
 document.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.target.closest('input,textarea,select,[contenteditable=true]')||document.querySelector('dialog[open]'))return;
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();send('review-step',{delta:event.key==='ArrowRight'?1:-1});}
 });
 root.addEventListener('error',event=>{if(event.error)send('review-error',{message:event.message});});
})(globalThis);
