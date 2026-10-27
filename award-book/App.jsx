import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {BookOpening} from './BookOpening';
import awardGif from '../core/award-gif.js';
import cardLayout from '../core/award-card-layout.js';
import collectionView from '../core/award-collection-view.js';
import studentShell from '../server/public/student-shell.js';
import '../core/award-card-layout.css';
import '../assets/awards/typography-45-46.css';
import {ArrowLeft, ArrowRight, List, DownloadSimple, X, Check, ImageBroken} from '@phosphor-icons/react';
import book from '../assets/awards/book-open.webp';
import paper from '../assets/awards/paper.webp';
import corner from '../assets/awards/photo-corner.webp';
import star from '../assets/awards/star-earned.webp';
import emptyStar from '../assets/awards/star-empty.webp';
import logo from '../assets/brand/starflower.png';
const BASE = document.querySelector('meta[name="award-base"]').content;
const CardsContext = createContext([]);
const pictures = [book,paper,corner,star,emptyStar,logo];
const dateLabel = value => value ? new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value)).replaceAll('/','.') : null;
const decoded = new Map();
const STORAGE_KEY = 'canran-award-book-v1:selected';
const MOTION_KEY = 'canran-award-book-v1:motion';
function parseMotion(value){return value==='on'?true:value==='off'?false:null;}
function readMotion(){
  try{const saved=parseMotion(localStorage.getItem(MOTION_KEY));if(saved!==null)return saved;}catch{}
  // Preserve the explicit choice made in an older, still-open preview tab.
  try{
    const legacy=parseMotion(sessionStorage.getItem(MOTION_KEY));
    if(legacy!==null){try{localStorage.setItem(MOTION_KEY,legacy?'on':'off');sessionStorage.removeItem(MOTION_KEY);}catch{}}
    return legacy;
  }catch{return null;}
}
function saveMotion(enabled){
  const value=enabled?'on':'off';
  try{localStorage.setItem(MOTION_KEY,value);sessionStorage.removeItem(MOTION_KEY);}
  catch{try{sessionStorage.setItem(MOTION_KEY,value);}catch{}}
}
function readPosition(cards,owner){try{return Math.max(0,cards.findIndex(c=>c.id===sessionStorage.getItem(STORAGE_KEY+':'+owner)));}catch{return 0;}}
function useMedia(query){const [value,setValue]=useState(()=>matchMedia(query).matches);useEffect(()=>{const m=matchMedia(query),change=()=>setValue(m.matches);m.addEventListener('change',change);return()=>m.removeEventListener('change',change);},[query]);return value;}
const iconProps={size:24,weight:'bold','aria-hidden':true};
function StudentHeader({student}){
  const target=useRef(null);
  useEffect(()=>studentShell.mount(target.current,{base:BASE,student,current:'awards'}),[student]);
  return <div ref={target}/>;
}
function DirectoryThumbnail({card}){
  const [failed,setFailed]=useState(false);
  return <span className="directory-thumb">{failed?<span className="thumbnail-error"><ImageBroken {...iconProps}/><small>图片暂不可用</small></span>:<img src={card.scene} alt="" loading="lazy" onError={()=>setFailed(true)}/>}</span>;
}
function Certificate({card}){
  return <article className="certificate award-card" data-stars={card.stars} data-unit={card.course} style={{...cardLayout.typography(card.title,card.name,card.course),'--accent':card.color,'--paper':`url(${paper})`,'--earned-star':`url(${star})`}} aria-label={`${card.lesson} ${card.title}，${card.name}，${card.stars} 颗星`}>
    <img className="card-scene" src={card.scene} alt={card.alt} draggable="false"/>
    <p className="card-brand">灿然英语工作室</p><h2 className="card-title">{card.title}</h2><p className="card-name">{card.name}</p>
    <div className="card-stars" aria-label={`${card.stars} / 5 颗星`}>{Array.from({length:5},(_,i)=><span className="award-star" data-earned={i<card.stars} style={{'--star-order':i}} key={i}><img src={i<card.stars?star:emptyStar} alt="" draggable="false"/>{i<card.stars&&<span className="star-glint" aria-hidden="true"/>}</span>)}</div>
    <p className="card-caption"><span>{card.lesson}</span>{card.stars===5&&card.date&&<time dateTime={card.date.replaceAll('.','-')}>{card.date}</time>}</p>
    {card.stars===5&&<span className="gold-light-ring" aria-hidden="true"/>}
  </article>;
}
const legacyPapers = (archives = []) => archives.filter(archive=>archive.kind==='legacy-paper');
function HistoricalCertificates({archives=[]}){
  const papers=legacyPapers(archives);
  if(!papers.length)return null;
  return <section className="historical-certificates" id="historicalCertificates" aria-labelledby="historicalCertificateTitle"><h2 id="historicalCertificateTitle">已获得的原证书</h2><p>保留15星体系的原证书，原姓名、内容与领取日期不变。</p><ul>{papers.map(archive=><li key={archive.id}><div><strong>{archive.meta?.lesson||'Lesson '+archive.course.slice(4).replace('-','–')}</strong><span>15星原版通关证书</span><small>{archive.name||'原领证姓名'} · {dateLabel(archive.issuedAt)}</small></div><a className="button" href={BASE+'awards/history/'+encodeURIComponent(archive.id)+'/'}>查看原证书</a></li>)}</ul></section>;
}
function LocalCertificateCopies({copies=[],available=[]}){
  if(!copies.length)return null;
  return <section className="historical-certificates" aria-labelledby="localCertificateTitle"><h2 id="localCertificateTitle">这台设备保留的旧证资料</h2><p>这些资料尚未确认入册。只读查看或下载保留副本，不增加新版星数。</p><ul>{copies.map(copy=><li key={copy.id}><div><strong>{'Lesson '+copy.course.slice(4).replace('-','–')}</strong><span>{copy.kind==='legacy-paper'?'原版证书资料':'五星纪念卡资料'}</span><small>{copy.name||'原领证姓名'} · {dateLabel(copy.issuedAt)}</small>{!available.includes(copy.course)&&<small>本课当前未开放在线查看，资料仍保留在本机，可下载副本请老师协助恢复。</small>}</div><div className="local-certificate-actions">{available.includes(copy.course)&&<a className="button" href={BASE+'awards/local-history/'+copy.course+'/'+copy.kind+'/'+copy.id+'/'}>查看本机原证</a>}<button className="button" onClick={()=>window.CanranLocalCertificates.download(copy)}>下载保留副本</button></div></li>)}</ul></section>;
}
function Corners(){return <span className="photo-corners" aria-hidden="true">{[0,1,2,3].map(i=><img key={i} src={corner} className={`photo-corner corner-${i}`} alt="" draggable="false"/>)}</span>;}
function Leaf({index,side,onOpen,decorative=false,blank=false}){
  const cards=useContext(CardsContext),card=cards[index];
  return <div className={`book-leaf ${side||''} ${!card||blank?'empty-leaf':''}`}>
    {card&&!blank&&<>
      {decorative?<div className="card-holder"><Certificate card={card}/><Corners/></div>:<button className="card-holder" onClick={()=>onOpen(index)} aria-label={`放大 ${card.lesson} ${card.title}`}><Certificate card={card}/><Corners/></button>}
      <span className="leaf-number" aria-hidden="true">{index+1}</span>
    </>}
  </div>;
}
function Modal({children,label,onClose,className=''}){
  const ref=useRef(null);
  useEffect(()=>{const dialog=ref.current,previous=document.activeElement;dialog.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog.close();document.body.style.overflow=old;previous?.focus?.();};},[]);
  return <dialog ref={ref} className={`modal ${className}`} aria-label={label} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal-body">{children}</div></dialog>;
}
function loadPicture(src){if(decoded.has(src))return Promise.resolve();return new Promise((resolve,reject)=>{const img=new Image();img.onload=async()=>{try{await img.decode();decoded.set(src,img);resolve();}catch{reject(new Error('image'));}};img.onerror=()=>reject(new Error('image'));img.src=src;});}
async function prepare(cards,indexes,onProgress=()=>{}){
  let done=0,timer;
  const resources=[...[...new Set([...pictures,...indexes.map(i=>cards[i]?.scene).filter(Boolean)])].map(src=>()=>loadPicture(src)),()=>document.fonts.load('400 24px "Award Book"',cards[0]?.name||'我的纪念册'),()=>document.fonts.load('500 24px "Baloo Book"','Lesson 1–2')];
  if (indexes.some(i=>['unit45-46','unit47-48','unit49-50','unit51-52','unit53-54','unit55-56','unit57-58','unit59-60','unit61-62'].includes(cards[i]?.course))) resources.push(()=>cardLayout.prepareFonts('unit45-46',cards[0]?.name||''));
  try {await Promise.race([Promise.all(resources.map(async run=>{await run();onProgress(++done/resources.length);})),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('timeout')),20000);})]);}finally{clearTimeout(timer);}
}
async function saveCard(card,signal){
  await cardLayout.prepareFonts(card.course,card.name,'Award Book','Baloo Book');
  signal.throwIfAborted();
  const canvas=cardLayout.draw({unitId:card.course,title:card.title,name:card.name,lesson:card.lesson,color:card.color,stars:card.stars,date:card.date,images:{scene:decoded.get(card.scene),paper:decoded.get(paper),earned:decoded.get(star),empty:decoded.get(emptyStar)},roundFont:'Award Book',latinFont:'Baloo Book'});
  const blob=await awardGif.encode(canvas,{...cardLayout.starLayout,stars:card.stars,earnedImage:decoded.get(star),signal});
  signal.throwIfAborted();
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${card.lesson.replace(' ','')}-${card.title}-${card.name}.gif`;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
  return {width:canvas.width,height:canvas.height,bytes:blob.size};
}
function Album({collection}){
  const {student,pending}=collection;
  const {primary:cards,history:historyCards}=collectionView.split(collection.cards);
  const [ready,setReady]=useState(false),[error,setError]=useState(false),[progress,setProgress]=useState(0);
  const [motion,setMotion]=useState(readMotion),[opening,setOpening]=useState(true);
  const [selected,setSelected]=useState(()=>readPosition(cards,student.id)),[turn,setTurn]=useState(null),[directory,setDirectory]=useState(false),[opened,setOpened]=useState(null),[saveState,setSaveState]=useState(''),[saving,setSaving]=useState(false);
  const mobile=useMedia('(max-width: 700px)'),systemReduced=useMedia('(prefers-reduced-motion: reduce)'),reduced=motion===null?systemReduced:!motion,perPage=mobile?1:2;
  const timers=useRef([]),pointer=useRef(null),busy=useRef(false),bookRef=useRef(null),saveJob=useRef(null);
  useEffect(()=>()=>saveJob.current?.abort(),[]);
  const [pageError,setPageError]=useState(''),[preparing,setPreparing]=useState(false);
  const start=Math.floor(selected/perPage)*perPage,canPrev=start>0,canNext=start+perPage<cards.length;
  useEffect(()=>{let active=true;setError(false);setProgress(0);setReady(false);prepare(cards,nearby(start,perPage,cards.length),p=>{if(active)setProgress(p);}).then(()=>{if(active)setReady(true);}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[]);
  useEffect(()=>{try{sessionStorage.setItem(STORAGE_KEY+':'+student.id,cards[selected].id);}catch{}},[selected]);
  useEffect(()=>{const sync=e=>{if(e.key===MOTION_KEY||e.key===null)setMotion(parseMotion(e.newValue));};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
  useEffect(()=>{timers.current.forEach(clearTimeout);setTurn(null);busy.current=false;return()=>timers.current.forEach(clearTimeout);},[mobile,reduced]);
  function toggleMotion(){const enabled=reduced;setMotion(enabled);saveMotion(enabled);}
  async function flip(direction){
    if(!ready||opening||busy.current||directory||opened!==null)return;
    const target=start+direction*perPage;if(target<0||target>=cards.length)return;
    busy.current=true;setPreparing(true);setPageError('');
    try{await prepare(cards,nearby(target,perPage,cards.length));}catch{setPageError('这一页暂时打不开，请重试。');busy.current=false;setPreparing(false);return;}
    setPreparing(false);
    if(reduced){setSelected(target);busy.current=false;return;}setTurn({direction,from:start,to:target});
    timers.current.push(setTimeout(()=>{setSelected(target);setTurn(null);busy.current=false;},580));
  }
  function openCard(index){if(opening||busy.current)return;setSelected(index);setOpened(cards[index]);setSaveState('');}
  async function openHistory(card){
    if(busy.current)return;busy.current=true;setPreparing(true);setPageError('');
    try{await prepare([card],[0]);setOpened({...card,historical:true});setSaveState('');}
    catch{setPageError('这张纪念卡暂时打不开，请重试。');}
    finally{setPreparing(false);busy.current=false;}
  }
  const finishOpening=useCallback((focus=false)=>{setOpening(false);if(focus)bookRef.current?.focus({preventScroll:true});},[]);
  const failOpening=useCallback(()=>{setError(true);setReady(false);},[]);
  function closeCard(){saveJob.current?.abort();setSaving(false);setOpened(null);setSaveState('');}
  async function goTo(index){if(busy.current)return;busy.current=true;setPreparing(true);setPageError('');try{await prepare(cards,nearby(Math.floor(index/perPage)*perPage,perPage,cards.length));timers.current.forEach(clearTimeout);setTurn(null);setSelected(index);setDirectory(false);bookRef.current?.focus({preventScroll:true});}catch{setPageError('这一页暂时打不开，请重试。');}finally{setPreparing(false);busy.current=false;}}
  function swipeStart(e){if(e.target.closest('button')||e.pointerType==='mouse'&&e.clientY<e.currentTarget.getBoundingClientRect().bottom-80)return;pointer.current={x:e.clientX,y:e.clientY};}
  function swipeEnd(e){const p=pointer.current;pointer.current=null;if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.8)flip(dx<0?1:-1);}
  async function download(){
    if(saving)return;const job=new AbortController();saveJob.current=job;setSaving(true);setSaveState('');
    try{await saveCard({...opened},job.signal);setSaveState('动图已生成');}
    catch(error){if(error.name!=='AbortError')setSaveState('暂时没能保存，请再试一次。');}
    finally{if(saveJob.current===job&&!job.signal.aborted)setSaving(false);}
  }
  const displayLeft=turn&&!mobile?(turn.direction>0?turn.from:turn.to):start;
  const displayRight=turn&&!mobile?(turn.direction>0?turn.to+1:turn.from+1):start+1;
  return <CardsContext.Provider value={cards}>
    <StudentHeader student={student}/>
    <main className="album-main">
      <div className="album-heading"><div><h1>我的纪念册</h1><p className="album-collection-count">{cards.length} 个单元的纪念卡{historyCards.length>0&&` · ${historyCards.length} 张历史版本`}</p></div><button className="button directory-button" disabled={!ready||opening} onClick={()=>setDirectory(true)}><List {...iconProps}/>目录</button></div>
      {!ready?<section className="loading-panel" aria-label="准备纪念册"><img src={logo} alt=""/><h2>{error?'暂时打不开纪念册':'正在打开纪念册…'}</h2>{error?<><p>请重试，已获纪念卡会保留。</p><button className="button primary" onClick={()=>window.location.reload()}>再试一次</button></>:<progress value={progress} max="1" aria-label="素材加载进度"/>}</section>:<>
        <div className={`book ${mobile?'is-mobile':''} ${turn?'is-turning':''} ${opening?'is-opening':''}`} ref={bookRef} tabIndex="0" role="group" aria-label="纪念册书页，左右方向键翻页" aria-busy={!!turn||preparing||opening} data-motion={reduced?'reduced':'full'} onKeyDown={e=>{if(e.target===e.currentTarget&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();flip(e.key==='ArrowLeft'?-1:1);}}} onPointerDown={swipeStart} onPointerUp={swipeEnd} onPointerCancel={()=>{pointer.current=null;}} style={{'--book-art':`url(${book})`,'--paper':`url(${paper})`}}>
          <img className="book-art" src={book} alt="" draggable="false"/>
          {mobile?<>
            <div className="mobile-sheet"><Leaf index={start} blank={!!turn} onOpen={openCard}/></div>
            {turn&&<div className={`mobile-turning-leaf ${turn.direction>0?'mobile-forward':'mobile-backward'}`} aria-hidden="true" inert="">
              <div className="leaf-face leaf-front mobile-face"><Leaf decorative index={turn.from}/></div>
              <div className="leaf-face leaf-back mobile-face"><Leaf decorative index={turn.to}/></div>
            </div>}
          </>:<>
            <Leaf index={displayLeft} side="leaf-left" onOpen={openCard}/><Leaf index={displayRight} side="leaf-right" onOpen={openCard}/>
            {turn&&<div className={`turning-leaf ${turn.direction>0?'turn-forward':'turn-backward'}`} aria-hidden="true" inert=""><div className={`leaf-face leaf-front ${turn.direction>0?'paper-right':'paper-left'}`}><Leaf decorative side={turn.direction>0?'leaf-right':'leaf-left'} index={turn.direction>0?turn.from+1:turn.from}/></div><div className={`leaf-face leaf-back ${turn.direction>0?'paper-left':'paper-right'}`}><Leaf decorative side={turn.direction>0?'leaf-left':'leaf-right'} index={turn.direction>0?turn.to:turn.to+1}/></div></div>}
          </>}
          {opening&&<BookOpening mobile={mobile} logo={logo} leftPage={<Leaf decorative index={start} side="opening-left-leaf"/>} rightPage={<Leaf decorative index={mobile?start:start+1} side="opening-right-leaf"/>} onFinish={finishOpening} onError={failOpening}/>}
        </div>
        <div className="pagination"><button className="button" disabled={!canPrev||opening} aria-disabled={!canPrev||!!turn||preparing||opening} onClick={()=>flip(-1)}><ArrowLeft {...iconProps}/>上一页</button><p role="status" aria-live="polite" className="page-count">第 {Math.floor(start/perPage)+1}<span> / {Math.ceil(cards.length/perPage)} 页</span></p><button className="button primary" disabled={!canNext||opening} aria-disabled={!canNext||!!turn||preparing||opening} onClick={()=>flip(1)}>下一页<ArrowRight {...iconProps}/></button></div>
      </>}
      <p className="album-status" role="status">{preparing?'正在准备书页…':pageError|| (pending?'记录待同步，联网后自动更新。':'')}</p>
      <HistoricalCertificates archives={collection.archives}/>
      <LocalCertificateCopies copies={collection.localCertificates} available={collection.availableCourses}/>
    </main>
    {directory&&<Modal label="目录" className="directory-modal" onClose={()=>setDirectory(false)}>
      <div className="modal-heading"><h2>目录</h2><button className="icon-button" aria-label="关闭目录" onClick={()=>setDirectory(false)}><X {...iconProps}/></button></div>
      {historyCards.length>0&&<details className="directory-history">
        <summary>历史版本 · {historyCards.length} 张</summary><p>保留每个版本原有的星星与首次集齐日期。</p>
        <div className="directory-list">{historyCards.map(card=><button className="directory-row" key={card.id} onClick={()=>openHistory(card)}><DirectoryThumbnail card={card}/><span><small>{card.lesson}</small><strong>{card.title}</strong><em>历史版本{card.date&&` · ${card.date}`}</em></span><span className="directory-stars"><img src={star} alt=""/>{card.stars}<span className="sr-only">颗星</span></span><ArrowRight {...iconProps}/></button>)}</div>
      </details>}
      <div className="directory-list directory-current">{cards.map((card,index)=><button className="directory-row" key={card.id} onClick={()=>goTo(index)}><DirectoryThumbnail card={card}/><span><small>{card.lesson}</small><strong>{card.title}</strong></span><span className="directory-stars"><img src={star} alt=""/>{card.stars}<span className="sr-only">颗星</span></span><ArrowRight {...iconProps}/></button>)}</div>
      <p className="album-status" role="status">{preparing?'正在准备书页…':pageError}</p>
      <div className="motion-preference"><span>翻页动画</span><button className="motion-switch" role="switch" aria-label="翻页动画" aria-checked={!reduced} onClick={toggleMotion}>{reduced?'已关闭':'已开启'}</button></div>
    </Modal>}
    {opened!==null&&<Modal label={`${opened.lesson} 纪念卡`} className="card-modal" onClose={closeCard}><div className="modal-heading">{opened.historical&&<p className="history-card-label">历史版本</p>}<button className="icon-button" aria-label="关闭纪念卡" onClick={closeCard}><X {...iconProps}/></button></div><Certificate card={opened}/><div className="modal-actions"><button className="button primary" disabled={saving} onClick={download}><DownloadSimple {...iconProps}/>{saving?'正在保存…':'保存动图'}</button></div><p className="save-state" role="status">{saveState==='动图已生成'&&<Check {...iconProps}/>} {saveState}</p></Modal>}
    <noscript>请允许 JavaScript 以打开纪念册。</noscript>
  </CardsContext.Provider>;
}

function nearby(start,size,count){return Array.from({length:Math.min(count,start+size*2)-Math.max(0,start-size)},(_,i)=>Math.max(0,start-size)+i);}
async function request(endpoint,value){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
    const response=await fetch(BASE+'api/'+endpoint,{cache:'no-store',signal:controller.signal,...(value===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)})});
    const result=await response.json();if(!response.ok)throw Object.assign(Error(result.error),{status:response.status});return result;
  }finally{clearTimeout(timer);}
}
async function collection(){
  let result=await request('awards'),changed=false,pending=0;
  // Only synchronize the authenticated student's queue. Never fabricate a card
  // from browser storage or display another student's cached personal data.
  const epoch=result.systemUpgrade?.epoch;
  const prefix='canran:student:'+result.student.id+':'+(epoch?'epoch:'+epoch+':':'')+'pending:';
  try{for(const key of Object.keys(localStorage).filter(key=>key.startsWith(prefix))){
    const raw=localStorage.getItem(key);
    try{const claim=JSON.parse(raw);if(claim.studentId!==result.student.id||(epoch&&claim.epoch!==epoch))continue;
      let synced;
      try{synced=await request('progress',claim);}catch(error){
        if(error.status!==403)throw error;
        // A device can return after its short-lived course grant expired.
        // Recheck access and generation; never resubmit to another student's
        // account or restore work cleared on another device.
        const renewed=await request('courses/'+encodeURIComponent(claim.course)+'/enter',{});
        if(renewed.student.id!==result.student.id||renewed.progress.generation!==claim.generation)throw error;
        synced=await request('progress',{...claim,grant:renewed.grant});
      }
      if(synced.stale){pending++;continue;}
      if(localStorage.getItem(key)===raw)localStorage.removeItem(key);changed=true;
    }catch{pending++;}
  }}catch{/* Storage unavailable does not prevent reading the server collection. */}
  if(changed)result=await request('awards');
  window.CanranSystemUpgrade?.notice(result,document.body);
  const localCertificates=window.CanranLocalCertificates?await window.CanranLocalCertificates.collect(result):[];
  const originalIds=new Set((result.archives||[]).map(item=>item.id));
  const archivedCards=new Set((result.archives||[]).filter(item=>item.kind==='card').map(item=>JSON.stringify([item.course,item.edition,Date.parse(item.issuedAt)])));
  return {...result,pending,localCertificates:localCertificates.filter(item=>!originalIds.has(item.id)&&!(item.kind==='card'&&archivedCards.has(JSON.stringify([item.course,item.edition,Date.parse(item.issuedAt)])))),cards:result.cards.map(card=>({...card,name:card.name??result.student.name,date:dateLabel(card.firstFullStarAt)}))};
}
export function App(){
  const [data,setData]=useState(null),[error,setError]=useState(null),[revision,setRevision]=useState(0);
  useEffect(()=>{
    let active=true,run=0;
    const refresh=async()=>{const id=++run;setData(null);setError(null);try{const next=await collection();if(active&&id===run)setData(next);}catch(e){if(active&&id===run)setError(e);}finally{if(active&&id===run)document.getElementById('root').style.visibility='';}};
    const hide=()=>{document.getElementById('root').style.visibility='hidden';setData(null);run++;};
    const visibility=()=>{if(document.hidden)hide();else refresh();};
    const resume=e=>{if(e.persisted)refresh();};
    const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('canran-lesson-identity'):null;
    if(channel)channel.onmessage=()=>{hide();refresh();};
    const worker=e=>{if(e.data?.type==='identity:changed'){hide();refresh();}};
    navigator.serviceWorker?.addEventListener('message',worker);
    document.addEventListener('visibilitychange',visibility);window.addEventListener('pageshow',resume);window.addEventListener('pagehide',hide);window.addEventListener('online',refresh);
    refresh();
    return()=>{active=false;run++;channel?.close();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pageshow',resume);window.removeEventListener('pagehide',hide);window.removeEventListener('online',refresh);navigator.serviceWorker?.removeEventListener('message',worker);};
  },[revision]);
  if(!data)return <main className="loading-panel"><img src={logo} alt=""/><h1>{error?error.status===401?'请重新登录':'暂时打不开纪念册':'正在打开纪念册…'}</h1>{error&&<><p>{error.status===401?'登录后查看自己的纪念卡。':'请重试，已获纪念卡会保留。'}</p><a className="button" href={BASE}>{error.status===401?'去登录':'返回课程'}</a>{error.status!==401&&<button className="button primary" onClick={()=>setRevision(v=>v+1)}>再试一次</button>}</>}</main>;
  if(!data.cards.length)return <><StudentHeader student={data.student}/><main className="loading-panel empty-album"><img src={logo} alt=""/><h1>我的纪念册</h1>{!legacyPapers(data.archives).length&&!data.localCertificates?.length&&<p>点亮第一颗星，收藏第一张纪念卡。</p>}{data.pending>0&&<p role="status">记录待同步，联网后自动更新。</p>}<HistoricalCertificates archives={data.archives}/><LocalCertificateCopies copies={data.localCertificates} available={data.availableCourses}/><a className="button primary" href={BASE}>去学习</a></main></>;
  return <Album collection={data} key={data.student.id+':'+revision}/>;
}
