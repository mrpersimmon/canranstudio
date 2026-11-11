(async function(){
 'use strict';
 const $=id=>document.getElementById(id),model=globalThis.CanranReviewState,key='canran-review-position-v1';
 let catalog,selection,active,pending,request=0,readyTimer,stateTimer,filtered=[];
 let questionPreset = null;
 const note=text=>{$('notice').textContent=text;};
 const defaultNote=$('notice').textContent;
 function settled(){clearTimeout(readyTimer);clearTimeout(stateTimer);$('state-status').textContent='';$('frame-shell').setAttribute('aria-busy','false');if(active)active.inert=false;}
 function error(message){settled();$('loading').hidden=true;$('error').hidden=false;$('error').querySelector('p').textContent=message;}
 $('refresh').onclick=() => location.reload();$('retry').onclick=() => location.reload();
 try{const response=await fetch('/review/catalog.json');if(!response.ok)throw Error();catalog=await response.json();}catch{error('课程目录加载失败。请确认本地验收服务已启动，然后刷新。');return;}
 const all=catalog.courses.flatMap(course=>course.entries.map(entry=>({course,entry})));
 const questionPresets = new Set(all.filter(({entry}) => entry.kind === 'question').flatMap(({entry}) => entry.states));
 function option(value,label){const el=document.createElement('option');el.value=value;el.textContent=label;return el;}
 catalog.courses.forEach(c=>$('unit').append(option(c.id,c.title)));
 catalog.devices.forEach(d=>$('device').append(option(d.id,d.name+' · '+d.width+'×'+d.height)));
 function readLocation(){
  const params=Object.fromEntries(new URLSearchParams(location.search));
  let saved={};
  if(!params.unit&&!params.page){try{saved=JSON.parse(localStorage.getItem(key))||{};}catch{}}
  const input={...saved,...params};
  questionPreset=questionPresets.has(input.preset)?input.preset:null;
  return model.normalize(catalog,input);
 }
 function savedPosition(){return questionPreset ? {...selection,preset:questionPreset} : selection;}
 function persist(mode){const position=savedPosition(),params=new URLSearchParams(position);history[mode==='push'?'pushState':'replaceState'](null,'','?'+params);try{localStorage.setItem(key,JSON.stringify(position));}catch{}}
 function current(){const course=catalog.courses.find(c=>c.id===selection.unit);return {course,entry:course.entries.find(e=>e.id===selection.page)};}
 function supportsPreset(entry){return entry.kind==='question' && entry.states.includes(questionPreset);}
 function visitEntry(course,entry){choose({unit:course.id,page:entry.id,state:supportsPreset(entry)?questionPreset:entry.states[0]},'push');}
 function directory(){
  const searchable=text=>text.toLowerCase().replace(/[–—]/g,'-').replace(/\s/g,'');
  const query=searchable($('search').value);
  filtered=all.filter(({course,entry})=>query?searchable([course.title,entry.section,entry.title,entry.subtitle,entry.type].join(' ')).includes(query):course.id===selection.unit);
  $('entries').replaceChildren();let section='';
  for(const {course,entry}of filtered){const group=(query?course.title+' · ':'')+entry.section;if(group!==section){section=group;const h=document.createElement('h3');h.className='entry-section';h.textContent=section;$('entries').append(h);}
   const button=document.createElement('button');button.className='entry';button.dataset.unit=course.id;button.dataset.page=entry.id;button.setAttribute('aria-current',course.id===selection.unit&&entry.id===selection.page?'page':'false');
   const title=document.createElement('span');title.textContent=entry.title;button.append(title);if(entry.subtitle){const sub=document.createElement('small');sub.textContent=entry.subtitle;button.append(sub);}button.title=[course.title,entry.title,entry.subtitle].filter(Boolean).join(' · ');
   button.onclick=()=>{visitEntry(course,entry);if($('directory-dialog').open)$('directory-dialog').close();};$('entries').append(button);
  }
  $('count').textContent=query?filtered.length+' 项匹配 · 搜索覆盖 Lesson 1–144':filtered.length+' 个页面与状态入口';
  if(!filtered.length){const p=document.createElement('p');p.textContent='没有匹配页面，试试 Lesson、题号或题干中的词。';$('entries').append(p);}
  $('entries').querySelector('[aria-current="page"]')?.scrollIntoView({block:'nearest'});navigation();
 }
 function route(){return $('search').value.trim()?filtered:all;}
 function navigation(){const list=route(),at=list.findIndex(x=>x.course.id===selection.unit&&x.entry.id===selection.page);$('position').textContent=(at>=0?at+1:'—')+' / '+list.length;$('previous').disabled=at<=0;$('next').disabled=!list.length||at===list.length-1;}
 function step(delta){const list=route(),at=list.findIndex(x=>x.course.id===selection.unit&&x.entry.id===selection.page),target=list[at+delta];if(target)visitEntry(target.course,target.entry);}
 function size(){
  if(!selection)return;const d=catalog.devices.find(d=>d.id===selection.device),area=$('preview-area'),fit=$('zoom').value==='fit';
  const scale=fit?Math.max(.1,Math.min(1,(area.clientWidth-44)/d.width,(area.clientHeight-44)/d.height)):1;
  area.classList.toggle('actual',!fit);$('frame-shell').style.width=d.width*scale+'px';$('frame-shell').style.height=d.height*scale+'px';
  for(const frame of $('frame-shell').querySelectorAll('iframe')){frame.style.width=d.width+'px';frame.style.height=d.height+'px';frame.style.transform='scale('+scale+')';}
  $('dimensions').textContent=d.width+' × '+d.height+' · '+Math.round(scale*100)+'%';
 }
 function renderControls(){
  const {course,entry}=current();$('unit').value=course.id;$('current-course').textContent=course.title+' · '+entry.section;$('current-title').textContent=entry.title;
  const group=$('state-buttons'),signature=entry.states.join('|');
  if(group.dataset.options!==signature){
   group.replaceChildren(...entry.states.map(state=>{const button=document.createElement('button');button.type='button';button.dataset.state=state;button.textContent=model.labels[state]||state;return button;}));group.dataset.options=signature;
  }
  const pressed=supportsPreset(entry)?questionPreset:selection.state;
  for(const button of group.children)button.setAttribute('aria-pressed',String(button.dataset.state===pressed));
  const clear=$('clear-preset');
  clear.hidden=entry.kind!=='question'||!questionPreset;
  if(!clear.hidden)clear.title='取消后续题目沿用“'+model.labels[questionPreset]+'”';
  const help=clear.hidden?'':supportsPreset(entry)?'换题时自动沿用“'+model.labels[questionPreset]+'”。':'本题没有“'+model.labels[questionPreset]+'”状态，下一道支持的题会继续沿用。';
  if(help!==group.dataset.presetNote){
   if(help)note(help);
   else if($('notice').textContent===group.dataset.presetNote)note(defaultNote);
   group.dataset.presetNote=help;
  }
  $('device').value=selection.device;$('stars').value=selection.stars;$('stars-control').hidden=!['card','award'].includes(entry.kind);$('stars').options[0].disabled=entry.kind==='award';
 }
 function openFrame(){
  settled();pending?.remove();$('error').hidden=true;$('loading').hidden=false;$('frame-shell').setAttribute('aria-busy','true');if(active)active.inert=true;
  const {entry}=current(),id=String(++request),frame=document.createElement('iframe');frame.className='pending';frame.title='真实课程预览';frame.dataset.request=id;
  frame.dataset.frameId=id;frame.dataset.unit=selection.unit;frame.dataset.page=selection.page;
  const params=new URLSearchParams({...savedPosition(),request:id});frame.src='/lesson/'+selection.unit+'/?'+params+'#'+entry.route;
  $('frame-shell').append(frame);pending=frame;size();
  readyTimer=setTimeout(()=>{error('本页准备时间较长，请重试。原画面已保留。');},60000);
 }
 function syncPosition(position){
  if(!position||position.unit!==selection.unit||!catalog.courses.find(c=>c.id===position.unit)?.entries.some(e=>e.id===position.page))return;
  const next=model.normalize(catalog,{...selection,page:position.page,state:position.state,stars:position.stars}),moved=next.page!==selection.page;
  selection=next;if(active)active.dataset.page=next.page;persist('replace');renderControls();if(moved)directory();
 }
 function choose(next={},mode='replace',followPosition=false){
  const previous=selection;selection=model.normalize(catalog,{...selection,...next});const samePage=previous.unit===selection.unit&&previous.page===selection.page;
  const target=current().entry,fastPage=previous.unit===selection.unit&&['question','result','award'].includes(target.kind);
  persist(mode);renderControls();if(!samePage)directory();
  if((samePage||fastPage)&&active&&!pending&&active.dataset.fastStates==='true'&&active.dataset.unit===selection.unit&&(fastPage||active.dataset.page===selection.page)){
   settled();$('error').hidden=true;$('loading').hidden=true;$('frame-shell').setAttribute('aria-busy','true');active.inert=true;
   const id=String(++request);active.dataset.request=id;active.dataset.page=selection.page;
   stateTimer=setTimeout(()=>{$('state-status').textContent='正在切换…';},150);
   readyTimer=setTimeout(()=>error('状态未能完成切换，请重新打开本页。'),10000);
   active.contentWindow.postMessage({type:'review-apply',frameId:active.dataset.frameId,requestId:id,selection,followPosition,preset:questionPreset},location.origin);
  }else openFrame();
 }
 addEventListener('message',event=>{
  const data=event.data;if(event.origin!==location.origin||!data)return;
  const frame=[pending,active].find(f=>f&&event.source===f.contentWindow&&data.requestId===f.dataset.request);if(!frame||data.requestId!==String(request))return;
  if(data.type==='review-ready'){
   if(frame===pending){active?.remove();active=pending;pending=null;active.classList.remove('pending');}
   syncPosition(data.selection);
   active.dataset.fastStates=String(Boolean(data.fastStates));settled();$('loading').hidden=true;$('error').hidden=true;active.contentWindow.postMessage({type:'review-visible',frameId:active.dataset.frameId,requestId:data.requestId,preset:questionPreset},location.origin);
  }
  if(data.type==='review-position'&&frame===active&&!pending&&$('frame-shell').getAttribute('aria-busy')!=='true')syncPosition(data.selection);
  if(data.type==='review-reload'&&frame===active){syncPosition(data.selection);openFrame();}
  if(data.type==='review-error'&&frame===pending){clearTimeout(readyTimer);error(data.message+'。可重试本页或选择其他页面。');}
  if(data.type==='review-error'&&frame===active)error('预览提示：'+data.message);
  if(data.type==='review-step')step(data.delta);
  if(data.type==='review-navigate'){
   if(data.home){
    $('search').value='';directory();
    if(matchMedia('(max-width:720px)').matches&&!$('directory-dialog').open)$('directory-dialog').showModal();
    $('unit').focus();note('已打开验收台课程目录。正式课程会返回学习旅程首页。');
   }else{choose({unit:data.unit,page:'cover'},'push');note('已回到课程封面，可继续查看全部 72 个单元。');}
  }
 });
 $('unit').onchange=()=>{$('search').value='';choose({unit:$('unit').value,page:'cover'},'push');};
 $('state-buttons').onclick=event=>{
  const button=event.target.closest('button[data-state]');if(!button)return;
  if(current().entry.kind==='question'){
   questionPreset=button.dataset.state;
   note('换题时自动沿用“'+model.labels[questionPreset]+'”。');
  }
  choose({state:button.dataset.state},'replace',true);
 };
 $('clear-preset').onclick=()=>{
  questionPreset=null;persist('replace');renderControls();note('展示状态已恢复跟随作答。');
  const frame=pending||active;
  if(frame)frame.contentWindow.postMessage({type:'review-preset',frameId:frame.dataset.frameId,requestId:frame.dataset.request,preset:null},location.origin);
  $('state-buttons').querySelector('[aria-pressed=true]')?.focus({preventScroll:true});
 };
 $('stars').onchange=()=>choose({stars:Number($('stars').value)},'replace',true);
 $('state-buttons').onkeydown=event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey)return;
  const buttons=[...$('state-buttons').children],index=buttons.indexOf(document.activeElement);if(index<0)return;
  event.preventDefault();event.stopPropagation();
  const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].focus();buttons[next].click();
 };
 $('device').onchange=()=>{selection=model.normalize(catalog,{...selection,device:$('device').value});persist('replace');size();};
 $('zoom').onchange=size;$('search').oninput=directory;
 $('previous').onclick=()=>step(-1);$('next').onclick=()=>step(1);$('reset').onclick=()=>{openFrame();note('本页已重置，演示作答不保存到真实记录。');};$('retry').onclick=openFrame;$('refresh').onclick=()=>location.reload();
 $('copy').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);note('已复制本项链接，打开即可复现所选页面和展示状态。');}catch{$('copy-address').value=location.href;$('copy-dialog').showModal();$('copy-address').select();}};$('close-copy').onclick=()=>$('copy-dialog').close();
 function placeDirectory(){const dialog=$('directory-dialog'),directory=$('directory');if(matchMedia('(max-width:720px)').matches){if(directory.parentElement!==dialog)dialog.append(directory);}else{if(dialog.open)dialog.close();if(directory.parentElement!==document.querySelector('.bench-body'))document.querySelector('.bench-body').prepend(directory);}}
 $('open-directory').onclick=()=>$('directory-dialog').showModal();$('close-directory').onclick=()=>$('directory-dialog').close();addEventListener('resize',placeDirectory);new ResizeObserver(size).observe($('preview-area'));
 addEventListener('popstate',()=>{selection=readLocation();renderControls();directory();openFrame();});
 addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.target.closest('input,textarea,select,[contenteditable=true]')||document.querySelector('dialog[open]'))return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();step(event.key==='ArrowRight'?1:-1);}});
 selection=readLocation();persist('replace');renderControls();directory();placeDirectory();openFrame();
})();
