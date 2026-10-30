import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import {House,BookOpen,User,ArrowClockwise,X} from '@phosphor-icons/react';
import {App as Journey} from '../course-journey/App';
import {PostofficeAlbum} from '../award-book/Postoffice';
import {loadCollection} from '../award-book/App';
import {AccountDialog} from './AccountDialog';
import routes from './workspace-route';
import '../award-book/styles.css';
import '../award-book/effects.css';
import './workspace.css';

const title=page=>page==='awards'?'纪念册':'课程';
export function Workspace({who,base,waiting,onRefresh,resolveWho,onPageActive,onSessionError,openLegacy,openProfile}){
 const initial=useRef(routes.destination(location.href,base,location.origin)||{page:'courses',url:base}),sequence=useRef(0);
 const [shown,setShown]=useState(()=>initial.current.page==='courses'?{id:0,page:'courses',url:base,who}:null),[candidate,setCandidate]=useState(null),[leaving,setLeaving]=useState(null);
 const shownRef=useRef(shown),candidateRef=useRef(null),pendingRef=useRef(null),alive=useRef(true),nodes=useRef(new Map()),root=useRef(null),timer=useRef(),hintTimer=useRef(),readyTimer=useRef();
 const [phase,setPhase]=useState('idle'),[pending,setPending]=useState(null),[error,setError]=useState(null),[hint,setHint]=useState(false),[announcement,setAnnouncement]=useState('');
 const [account,setAccount]=useState(openLegacy?'legacy':openProfile?'profile':null),[historyRequest,setHistoryRequest]=useState(0),[suspended,setSuspended]=useState(false);
 const positions=useRef(),positionKey='canran:workspace:v1:'+who.student.id+':'+(who.systemUpgrade?.epoch||'original');
 if(!positions.current){try{positions.current=JSON.parse(sessionStorage.getItem(positionKey)||'{}');}catch{}if(!positions.current||typeof positions.current!=='object')positions.current={};}
 if(!positions.current.courses)try{const previous=JSON.parse(sessionStorage.getItem('canran:journey:v1:'+who.student.id)||'null');if(previous)positions.current.courses={scroll:Number(previous.scroll)||0,sidebar:0};}catch{}
 const latest=useRef({});
 function savePosition(){
  const current=shownRef.current;if(!current)return;
  const node=nodes.current.get(current.id),sidebar=node?.querySelector('.journey-sidebar,.postoffice-sidebar');
  positions.current[current.page]={scroll:window.scrollY,sidebar:sidebar?.scrollTop||0};
  try{sessionStorage.setItem(positionKey,JSON.stringify(positions.current));}catch{}
  window.dispatchEvent(new Event('canran:save-journey'));
 }
 function cancel(){
  sequence.current++;clearTimeout(timer.current);clearTimeout(hintTimer.current);clearTimeout(readyTimer.current);
  candidateRef.current=null;pendingRef.current=null;setCandidate(null);setLeaving(null);setPending(null);setError(null);setHint(false);setPhase('idle');
 }
 function fail(id,reason){
  if(!alive.current||id!==sequence.current)return;
  clearTimeout(hintTimer.current);clearTimeout(readyTimer.current);
  if(reason?.status===401){cancel();setShown(null);shownRef.current=null;onSessionError(reason);return;}
  candidateRef.current=null;setCandidate(null);setHint(false);setError(reason||Error('prepare'));setPhase('idle');
 }
 async function navigate(route,{pop=false,initialLoad=false}={}){
  const previous=shownRef.current,wasPending=!!pendingRef.current;setAccount(null);cancel();
  if(previous?.page===route.page){
   if(route.history)setHistoryRequest(v=>v+1);
   if(pop||location.pathname!==route.url)history.replaceState({...history.state,studentWorkspace:true},'',route.url);
   if(!wasPending&&!route.history&&!pop){window.dispatchEvent(new Event('canran:show-courses'));window.scrollTo({top:0,behavior:'instant'});}
   return;
  }
  savePosition();const id=++sequence.current,request={...route,id,pop,initialLoad};pendingRef.current=request;setPending(request);setPhase('preparing');
  hintTimer.current=setTimeout(()=>{if(sequence.current===id)setHint(true);},160);
  readyTimer.current=setTimeout(()=>fail(id,Error('timeout')),80000);
  try{
   const data=route.page==='awards'?await loadCollection():initialLoad?who:await resolveWho();
   if(!alive.current||id!==sequence.current)return;
   if(!routes.sameOwner(who,data)||data.mustChangePassword){cancel();setShown(null);shownRef.current=null;onRefresh();return;}
   const next={...request,...(route.page==='awards'?{collection:data}:{who:data})};candidateRef.current=next;setCandidate(next);
  }catch(reason){fail(id,reason);}
 }
 function prepared(id){
  const next=candidateRef.current;if(!next||id!==sequence.current||next.id!==id||!alive.current)return;
  savePosition();const previous=shownRef.current,rect=previous&&nodes.current.get(previous.id)?.getBoundingClientRect();
  clearTimeout(hintTimer.current);clearTimeout(readyTimer.current);setHint(false);setError(null);
  if(!next.initialLoad&&!next.pop)history.pushState({...history.state,studentWorkspace:true},'',next.url);
  else history.replaceState({...history.state,studentWorkspace:true},'',next.url);
  shownRef.current=next;candidateRef.current=null;pendingRef.current=null;
  const animate=previous&&rect&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  setShown(next);setCandidate(null);setPending(null);setLeaving(animate?{...previous,rect:{top:rect.top,left:rect.left,width:rect.width}}:null);
  setPhase(animate?'positioning':'restore');if(next.history)setHistoryRequest(v=>v+1);
  document.title=next.page==='awards'?'我的纪念册 · 灿然英语工作室':'灿然英语工作室';setAnnouncement('我的'+title(next.page)+'已打开');
 }
 shownRef.current=shown;latest.current={navigate,cancel,savePosition};
 useEffect(()=>{if(shown)onPageActive?.(shown.page,shown.who||who);},[shown?.id]);
 useLayoutEffect(()=>{if(initial.current.page==='courses'&&positions.current.courses)window.scrollTo({top:Number(positions.current.courses.scroll)||0,behavior:'instant'});},[]);
 useLayoutEffect(()=>{
  if(!shown||!['positioning','restore'].includes(phase))return;
  const position=positions.current[shown.page]||{scroll:0,sidebar:0},node=nodes.current.get(shown.id);
  window.scrollTo({top:Number(position.scroll)||0,behavior:'instant'});
  const sidebar=node?.querySelector('.journey-sidebar,.postoffice-sidebar');if(sidebar)sidebar.scrollTop=Number(position.sidebar)||0;
  // Position and measure the incoming view before starting its CSS animation.
  // A fixed 240ms cleanup can beat WebKit's first painted frame under load.
  const frame=requestAnimationFrame(()=>{if(phase==='restore'){setLeaving(null);setPhase('idle');}else setPhase('entering');});
  return()=>cancelAnimationFrame(frame);
 },[shown?.id,phase]);
 useEffect(()=>{
  if(phase!=='entering')return;
  // animationend owns normal cleanup; this only recovers if the browser
  // cancels the animation (for example, reduced-motion changes mid-flight).
  timer.current=setTimeout(()=>{setLeaving(null);setPhase('idle');},1000);
  return()=>clearTimeout(timer.current);
 },[phase,shown?.id]);
 useLayoutEffect(()=>{
  const header=document.getElementById('siteHeader');
  for(const link of header.querySelectorAll('.student-nav>a')){
   const route=routes.destination(link.href,base,location.origin);if(!route)continue;
   if(route.page===shown?.page)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
   if(route.page===pending?.page&&!error)link.setAttribute('aria-busy','true');else link.removeAttribute('aria-busy');
  }
 },[shown?.page,pending?.page,error,base]);
 useEffect(()=>{
  alive.current=true;const oldRestoration=history.scrollRestoration;history.scrollRestoration='manual';
  const click=event=>{const link=event.target.closest?.('a[href]');if(!link||!routes.plainLink(event,link))return;const route=routes.destination(link.href,base,location.origin);if(!route)return;event.preventDefault();latest.current.navigate(route);};
  const pop=()=>{const route=routes.destination(location.href,base,location.origin);if(route)latest.current.navigate(route,{pop:true});else location.reload();};
  const account=()=>setAccount('profile');
  let hidden=false;
  const visibility=()=>{if(document.hidden){hidden=true;latest.current.savePosition();latest.current.cancel();setSuspended(true);setShown(null);shownRef.current=null;setAccount(null);}else if(hidden){hidden=false;onRefresh();}};
  document.addEventListener('click',click);window.addEventListener('popstate',pop);window.addEventListener('canran:open-account',account);window.addEventListener('pagehide',savePosition);document.addEventListener('visibilitychange',visibility);
  if(initial.current.page==='awards')void navigate(initial.current,{initialLoad:true});
  return()=>{alive.current=false;sequence.current++;clearTimeout(timer.current);clearTimeout(hintTimer.current);clearTimeout(readyTimer.current);document.removeEventListener('click',click);window.removeEventListener('popstate',pop);window.removeEventListener('canran:open-account',account);window.removeEventListener('pagehide',savePosition);document.removeEventListener('visibilitychange',visibility);history.scrollRestoration=oldRestoration;};
 },[]);
 const layers=[leaving,shown,candidate].filter(Boolean);
 return <div ref={root} className="student-workspace" data-student-workspace data-page={shown?.page||'loading'} data-transition={phase} style={{visibility:suspended?'hidden':undefined}}>
  {!shown&&<section className="workspace-loading" role="status"><h1>{error?'暂时无法打开'+title(pending?.page):'正在打开'+title(pending?.page||initial.current.page)+'…'}</h1></section>}
  {layers.map(layer=>{const stage=layer===candidate,old=layer===leaving,active=layer===shown;return <div key={layer.id} ref={node=>{if(node)nodes.current.set(layer.id,node);else nodes.current.delete(layer.id);}} className="student-page" data-page={layer.page} data-phase={stage?'preparing':old?'leaving':['entering','positioning'].includes(phase)?phase:'idle'} inert={!active} aria-hidden={!active||undefined} onAnimationEnd={event=>{if(active&&layer.id===shownRef.current?.id&&event.target===event.currentTarget&&event.animationName==='student-page-in'){setLeaving(null);setPhase('idle');}}} style={old?{top:layer.rect.top,left:layer.rect.left,width:layer.rect.width}:undefined}>
   {layer.page==='courses'?<Journey who={layer.who} base={base} waiting={waiting} onRefresh={onRefresh} embedded active={active} onReady={()=>prepared(layer.id)}/>:<PostofficeAlbum collection={layer.collection} embedded active={active} onReady={()=>prepared(layer.id)} onPrepareError={reason=>fail(layer.id,reason)} onAccount={()=>setAccount('profile')} historyRequest={active?historyRequest:0}/>}
  </div>;})}
  <nav className="student-bottom-nav journey-bottom-nav" data-student-bottom-nav aria-label="底部主导航">
   <a href={base} aria-label="我的课程" aria-current={shown?.page==='courses'?'page':undefined} aria-busy={pending?.page==='courses'&&!error||undefined}><House size={26} weight={shown?.page==='courses'?'fill':'regular'}/><span>课程</span></a>
   <a href={base+'awards/'} aria-label="我的纪念册" aria-current={shown?.page==='awards'?'page':undefined} aria-busy={pending?.page==='awards'&&!error||undefined}><BookOpen size={26} weight={shown?.page==='awards'?'fill':'regular'}/><span>纪念册</span></a>
   <button type="button" onClick={()=>setAccount('profile')} aria-haspopup="dialog"><User size={26}/><span>我的</span></button>
  </nav>
  {(hint||error)&&pending&&<div className="student-navigation-status" role="status">{error?<><span>暂时无法打开{title(pending.page)}，请重试。</span><button type="button" onClick={()=>navigate(pending)}><ArrowClockwise size={18}/>重试切换</button></>:<span>正在打开{title(pending.page)}…</span>}{shown&&<button type="button" className="navigation-cancel" aria-label="取消切换" onClick={cancel}><X size={18}/></button>}</div>}
  <span className="journey-sr" aria-live="polite" aria-atomic="true">{announcement}</span>
  {account&&<AccountDialog student={(shown?.collection||shown?.who||who).student} base={base} view={account} onViewChange={setAccount} onClose={()=>setAccount(null)} onHistory={()=>{setAccount(null);navigate({page:'awards',url:base+'awards/',history:true});}}/>}
 </div>;
}
