import React,{useEffect,useMemo,useRef,useState} from 'react';
import {House,BookOpen,User,Key,SignOut,Archive,Envelope,MagnifyingGlass as Search,X,ArrowLeft,ArrowRight,Check,DownloadSimple} from '@phosphor-icons/react';
import collectionView from '../core/award-collection-view.js';
import studentShell from '../server/public/student-shell.js';
import model from './model';
import {CardFrame} from './Card';
import {Modal} from './Dialog';
import {HistoricalCertificates,LocalCertificateCopies,legacyPapers} from './LegacyCollections';
import {prepareCards,saveCard,scene,logo} from './media';

const BASE=document.querySelector('meta[name="award-base"]').content;
const POSITION='canran-award-book-v1:selected:',MEMORIES='canran-award-postoffice-v1:chapters:',MOTION='canran-award-book-v1:motion';
function stored(key){try{return sessionStorage.getItem(key);}catch{return null;}}
function remembered(owner){try{const value=JSON.parse(stored(MEMORIES+owner)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}}
function motionPreference(){try{const value=localStorage.getItem(MOTION)||sessionStorage.getItem(MOTION);return value==='on'?true:value==='off'?false:null;}catch{return null;}}
function useReducedMotion(){const [value,setValue]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)'),change=()=>setValue(query.matches);query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);return value;}

function Header({onAccount}){
 return <header className="student-header"><a className="student-brand" href={BASE} aria-label="灿然英语工作室首页"><img src={logo} alt=""/><span>灿然英语工作室</span></a><nav className="student-nav" aria-label="主导航"><a href={BASE}>我的课程</a><a href={BASE+'awards/'} aria-current="page">我的纪念册</a><button type="button" className="student-account-trigger" onClick={onAccount} aria-haspopup="dialog">我的</button></nav></header>;
}
function MiniCard({card}){return <CardFrame card={card} mini lazy/>;}

export function PostofficeAlbum({collection}){
 const {student}=collection;
 const {primary:cards,history:historyCards}=useMemo(()=>collectionView.split(collection.cards),[collection.cards]);
 const groups=useMemo(()=>model.chapters(cards),[cards]);
 const initial=model.restore(cards,stored(POSITION+student.id));
 const [selectedId,setSelectedId]=useState(initial?.id||null),[ready,setReady]=useState(!initial),[initialError,setInitialError]=useState(false);
 const [memories,setMemories]=useState(()=>remembered(student.id));
 const [panel,setPanel]=useState(null),[query,setQuery]=useState(''),[opened,setOpened]=useState(null),[pending,setPending]=useState(null),[loadError,setLoadError]=useState(null);
 const [saving,setSaving]=useState(false),[saveState,setSaveState]=useState(''),[logoutBusy,setLogoutBusy]=useState(false),[accountError,setAccountError]=useState('');
 const [motion,setMotion]=useState(motionPreference),systemReduced=useReducedMotion(),reduced=motion===null?systemReduced:!motion;
 const request=useRef(0),alive=useRef(true),saveJob=useRef(null),focusJob=useRef(0),searchInput=useRef(null),heroRef=useRef(null),pageRef=useRef(null),backPanel=useRef(null);
 const current=model.restore(cards,selectedId),chapter=model.chapterFor(groups,current);
 const results=useMemo(()=>cards.filter(card=>model.matches(card,query)),[cards,query]);
 const openedChapter=model.chapterFor(groups,opened),previous=model.adjacent(openedChapter,opened,-1),next=model.adjacent(openedChapter,opened,1);
 const personalHistory=opened?historyCards.filter(card=>card.course===opened.course&&card.id!==opened.id):[];
 const archives=collection.archives||[],copies=collection.localCertificates||[];
 const historyCount=historyCards.length+legacyPapers(archives).length+copies.length;

 function cancelSelection(){if(pending?.initialLoad)return;request.current++;setPending(null);setLoadError(null);clearTimeout(focusJob.current);}
 function openPanel(name){cancelSelection();setPanel(name);}
 function openAccount(){openPanel('account');}
 function closePanel(){cancelSelection();if(panel==='card'){saveJob.current?.abort();setSaving(false);setSaveState('');setOpened(null);setPanel(backPanel.current);}else setPanel(null);}
 async function transition(card,{mode='select',initialLoad=false,returnTo=null,focus=false}={}){
  if(!card)return;
  const token=++request.current;clearTimeout(focusJob.current);setLoadError(null);setInitialError(false);setPending({card,mode,returnTo,initialLoad});
  if(document.activeElement===searchInput.current)searchInput.current.blur();
  try{
   const target=model.chapterFor(groups,card);
   await prepareCards(mode==='history'?[card]:target?.cards||[card]);
   if(!alive.current||token!==request.current)return;
   if(mode!=='history'){
    setSelectedId(card.id);setReady(true);
    const group=model.chapterFor(groups,card);
    if(group)setMemories(previous=>({...previous,[group.id]:card.id}));
   }
   setPending(null);
   if(mode==='history'||mode==='open'){
    backPanel.current=returnTo;setOpened({...card,historical:mode==='history'||!card.current});setSaveState('');setPanel('card');
   }else if(!initialLoad){
    setPanel(null);
    if(focus)focusJob.current=setTimeout(()=>{
     if(!alive.current||token!==request.current)return;
     heroRef.current?.focus({preventScroll:true});
     const top=pageRef.current?.getBoundingClientRect().top+window.scrollY;
     const header=document.querySelector('.postoffice > .student-header');
     const reserve=header&&getComputedStyle(header).display!=='none'?header.getBoundingClientRect().height:0;
     if(Number.isFinite(top))window.scrollTo({top:Math.max(0,top-reserve),behavior:reduced?'instant':'smooth'});
    },40);
   }
  }catch{
   if(!alive.current||token!==request.current)return;
   setPending(null);setLoadError({card,mode,returnTo});if(!ready)setInitialError(true);
  }
 }
 useEffect(()=>{
  alive.current=true;if(initial)void transition(initial,{initialLoad:true});
  return()=>{alive.current=false;request.current++;clearTimeout(focusJob.current);saveJob.current?.abort();};
 },[]);
 useEffect(()=>{if(!current)return;try{sessionStorage.setItem(POSITION+student.id,current.id);sessionStorage.setItem(MEMORIES+student.id,JSON.stringify(memories));}catch{}},[current?.id,student.id,memories]);
 useEffect(()=>{const sync=e=>{if(e.key===MOTION||e.key===null)setMotion(motionPreference());};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 function toggleMotion(){const enabled=reduced;setMotion(enabled);try{localStorage.setItem(MOTION,enabled?'on':'off');}catch{try{sessionStorage.setItem(MOTION,enabled?'on':'off');}catch{}}}
 function chooseChapter(group){void transition(model.rememberedCard(group,memories[group.id]),{focus:true});}
 function openCard(){if(!ready||!current)return;cancelSelection();backPanel.current=null;setOpened({...current,historical:!current.current});setSaveState('');setPanel('card');}
 async function download(){
  if(saving||pending||!opened)return;
  const job=new AbortController();saveJob.current=job;setSaving(true);setSaveState('');
  try{await saveCard({...opened},job.signal);if(alive.current&&!job.signal.aborted)setSaveState('动图已生成');}
  catch(error){if(alive.current&&error.name!=='AbortError')setSaveState('暂时没能保存，请再试一次。');}
  finally{if(alive.current&&saveJob.current===job&&!job.signal.aborted)setSaving(false);}
 }
 function feedback(){return pending?<p className="album-status" role="status">正在准备 {pending.card.lesson}…</p>:loadError?<div className="album-status" role="status"><p>这张纪念暂时打不开，已有收藏不会改变。</p><button type="button" className="button" onClick={()=>transition(loadError.card,{mode:loadError.mode,returnTo:loadError.returnTo,focus:loadError.mode==='select'})}>重新加载 {loadError.card.lesson}</button></div>:null;}
 function chapterRows(){return <div className="chapter-list">{groups.map(group=><button type="button" className="chapter-row" key={group.id} aria-pressed={group.id===chapter?.id} onClick={()=>chooseChapter(group)}><Envelope size={25}/><span><small>{group.label}</small><strong>{group.name}</strong><em>已珍藏 {group.cards.length} / {group.slots.length} 张</em></span>{group.id===chapter?.id?<Check size={21}/>:<ArrowRight size={20}/>}</button>)}</div>;}
 function rows(items,historical=false){return <div className={'directory-list '+(historical?'directory-history-list':'directory-current')}>{items.map(card=><button type="button" className="directory-row" key={card.id} onPointerDown={event=>{if(document.activeElement===searchInput.current)event.preventDefault();}} onClick={()=>transition(card,historical?{mode:'history',returnTo:'archive'}:{focus:true})}><span className="directory-thumb"><MiniCard card={card}/></span><span><small>{card.lesson}</small><strong>{card.title}</strong><em>{historical?'历史版本':model.chapterFor(groups,card)?.name||'其他纪念'}{card.date&&` · ${card.date}`}</em></span><span className="directory-stars" aria-label={`${card.stars}颗星`}>{card.stars} / 5</span><ArrowRight size={18}/></button>)}</div>;}

 return <div className="postoffice" data-owner={student.id}>
  <Header onAccount={openAccount}/>
  <div className="postoffice-layout">
   <aside className="postoffice-sidebar" aria-label="章节信箱"><h2>章节信箱</h2><p className="collection-count">已珍藏 {cards.length} 张纪念 · {groups.length} 封信</p>{chapterRows()}{!cards.length&&<p>获得纪念卡后，会自动收进信箱。</p>}<button type="button" className="sidebar-account" onClick={openAccount}><User size={22}/>我的收藏与记录</button></aside>
   <main className="postoffice-main" ref={pageRef}>
    <section className="postoffice-scene" aria-label="纪念册旅程" aria-busy={!!pending} data-ready={ready} data-motion={reduced?'reduced':'full'}>
     <img className="postoffice-scene-art" src={scene} alt="阳光照进小镇邮局，木柜台上放着打开的信封" draggable="false"/>
     <a className="postoffice-mobile-brand" href={BASE} aria-label="灿然英语工作室首页"><img src={logo} alt=""/><span>灿然英语工作室</span></a>
     <header className="postoffice-heading"><div className="postoffice-title"><h1>我的纪念册</h1><button type="button" className="icon-button search-trigger" disabled={!cards.length} aria-label="搜索 Lesson 或纪念卡名称" title="搜索纪念卡" aria-haspopup="dialog" onClick={()=>openPanel('search')}><Search size={23}/></button></div><p>{chapter?`${chapter.name} · ${chapter.label}`:'把旅程中的小小成就，收进信封'}</p></header>
     {current&&ready?<button type="button" className="postoffice-hero-card" ref={heroRef} aria-label={`查看并保存纪念卡：${current.lesson} ${current.title}`} aria-haspopup="dialog" onClick={openCard}><div className="postoffice-card-entry" key={current.id}><CardFrame card={current}/></div></button>:current?<div className="postoffice-loading" role="status"><h2>{initialError?'暂时打不开纪念卡':'正在准备你的纪念卡…'}</h2>{initialError&&<button className="button" onClick={()=>transition(current,{initialLoad:true})}>再试一次</button>}</div>:<div className="postoffice-empty"><h2>第一封纪念，等你来写</h2><p>点亮第一颗星，收藏第一张纪念卡。</p><a className="button primary" href={BASE}>去学习</a></div>}
    </section>
    {chapter&&<section className="postoffice-keepsakes" aria-label="本章的纪念卡"><h2>这一章的三张纪念</h2><div className="postoffice-card-options">{chapter.slots.map(slot=><button type="button" className="postoffice-card-option" key={slot.course} disabled={!slot.card} aria-label={slot.card?`选择 ${slot.card.lesson} ${slot.card.title}`:`${slot.label} 尚未收藏`} aria-pressed={slot.card?.id===current?.id} onClick={()=>transition(slot.card)}><span className="postoffice-thumbnail">{slot.card?<MiniCard card={slot.card}/>:<span className="uncollected"><Envelope size={28}/><span>尚未收藏</span></span>}</span><span className="postoffice-thumbnail-label">{slot.label}</span></button>)}</div>
     {!panel&&feedback()}<button type="button" className="postoffice-chapters-button" onClick={()=>openPanel('chapters')}><BookOpen size={23}/><span>章节信箱</span><small>{groups.length} 封信 · {cards.length} 张纪念</small><ArrowRight size={20}/></button>
    </section>}
    {!!collection.pending&&<p className="album-status" role="status">记录待同步，联网后自动更新。</p>}
   </main>
  </div>
  <nav className="postoffice-bottom-nav" aria-label="底部主导航"><a href={BASE} aria-label="我的课程"><House size={26}/><span>课程</span></a><a href={BASE+'awards/'} aria-label="我的纪念册" aria-current="page" onClick={event=>{event.preventDefault();window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});}}><BookOpen size={26} weight="fill"/><span>纪念册</span></a><button type="button" onClick={openAccount} aria-haspopup="dialog"><User size={26}/><span>我的</span></button></nav>
  {panel==='search'&&<Modal key="search" label="搜索纪念卡" onClose={closePanel} className="postoffice-search-dialog"><form className="postoffice-search" onSubmit={event=>{event.preventDefault();if(results.length===1)transition(results[0],{focus:true});}}><label className="sr-only" htmlFor="awardSearch">搜索 Lesson 或卡名</label><Search size={22}/><input id="awardSearch" ref={searchInput} value={query} maxLength={100} type="search" inputMode="search" autoComplete="off" placeholder="如 Lesson 8、7–12、问候" onChange={event=>{cancelSelection();setQuery(event.target.value);}}/>{query&&<button type="button" onPointerDown={event=>event.preventDefault()} aria-label="清空搜索" onClick={()=>{cancelSelection();setQuery('');searchInput.current?.focus({preventScroll:true});}}><X size={20}/></button>}</form><p className="search-count" role="status">{query?`找到 ${results.length} 张纪念卡`:`全部 ${cards.length} 张纪念卡`}</p>{feedback()}{rows(results)}{!results.length&&<div className="search-empty"><h3>还没找到这张纪念</h3><p>试试Lesson课号或卡名；获得的新纪念卡会自动入册。</p></div>}</Modal>}
  {panel==='chapters'&&<Modal key="chapters" label="章节信箱" onClose={closePanel} className="postoffice-directory-dialog"><p className="collection-count">{groups.length} 封信 · {cards.length} 张纪念</p>{chapterRows()}{feedback()}</Modal>}
  {panel==='card'&&opened&&<Modal key="card" label={`${opened.lesson} 纪念卡`} heading={opened.title} onClose={closePanel} className="postoffice-card-modal" closeLabel="关闭纪念卡"><p className="card-detail-caption">{opened.lesson} · {model.chapterFor(groups,opened)?.name||'历史收藏'}{opened.historical?' · 历史版本':''}</p><CardFrame card={opened}/><p className="card-detail-owner">{opened.name}{opened.date&&` · ${opened.date}`}</p>
   {!opened.historical&&<div className="postoffice-card-pagination"><button type="button" className="icon-button" aria-label="上一张纪念卡" disabled={!previous||saving} onClick={()=>transition(previous,{mode:'open'})}><ArrowLeft size={22}/></button><span>{openedChapter?.cards.findIndex(card=>card.id===opened.id)+1} / {openedChapter?.cards.length}</span><button type="button" className="icon-button" aria-label="下一张纪念卡" disabled={!next||saving} onClick={()=>transition(next,{mode:'open'})}><ArrowRight size={22}/></button></div>}
   {feedback()}<button type="button" className="button primary save-card" disabled={saving||!!pending} onClick={download}><DownloadSimple size={23}/>{saving?'正在保存…':'保存动图'}</button><p className="save-state" role="status">{saveState==='动图已生成'&&<Check size={18}/>} {saveState}</p>
   {!!personalHistory.length&&!opened.historical&&<details className="card-history"><summary>这节课的历史版本 · {personalHistory.length}</summary>{personalHistory.map(card=><button type="button" className="history-card-row" key={card.id} disabled={saving} onClick={()=>transition(card,{mode:'history',returnTo:'archive'})}><span>{card.title}<small>{card.stars} / 5 颗星{card.date&&` · ${card.date}`}</small></span><ArrowRight size={20}/></button>)}</details>}
  </Modal>}
  {panel==='account'&&<Modal key="account" label="我的" onClose={closePanel} className="postoffice-account-dialog"><p className="account-name">{student.name}</p><p className="account-number">{student.studentNumber}</p><a className="account-row" href={BASE+'?account=password'}><Key size={23}/>修改密码<ArrowRight size={20}/></a><button type="button" className="account-row" disabled={logoutBusy} onClick={async()=>{setLogoutBusy(true);setAccountError('');try{await studentShell.signOut(BASE);}catch{setLogoutBusy(false);setAccountError('暂时无法退出，请再试一次。');}}}><SignOut size={23}/>退出登录</button>{accountError&&<p role="alert">{accountError}</p>}<button type="button" className="account-row" onClick={()=>openPanel('archive')}><Archive size={23}/>历史收藏{historyCount>0&&<small>{historyCount} 份</small>}<ArrowRight size={20}/></button><a className="account-row" href={BASE+'?account=history'}><BookOpen size={23}/>本机旧记录<ArrowRight size={20}/></a><div className="motion-preference"><span>界面动效</span><button type="button" className="motion-switch" role="switch" aria-label="界面动效" aria-checked={!reduced} onClick={toggleMotion}>{reduced?'已关闭':'已开启'}</button></div></Modal>}
  {panel==='archive'&&<Modal key="archive" label="历史收藏" onClose={()=>{cancelSelection();setPanel('account');}} className="postoffice-history-dialog">{historyCards.length>0&&<><p className="collection-count">历史版本保留各自原有的星星、姓名和首次集齐日期。</p>{rows(historyCards,true)}</>}{feedback()}<HistoricalCertificates archives={archives}/><LocalCertificateCopies copies={copies} available={collection.availableCourses}/>{!historyCount&&<p className="empty-history">暂无历史版本或旧证资料。已有纪念卡都在章节信箱中。</p>}</Modal>}
 </div>;
}
