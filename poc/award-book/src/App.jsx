import React, {useEffect, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, List, MagnifyingGlass, DownloadSimple, X, Check} from '@phosphor-icons/react';
import book from './assets/book-open.webp';
import paper from './assets/paper.webp';
import corner from './assets/photo-corner.webp';
import star from './assets/star-earned.webp';
import emptyStar from './assets/star-empty.webp';
import logo from './assets/starflower.png';
import handbag from './assets/unit1-2.webp';
import umbrella from './assets/unit3-4.webp';
import friends from './assets/unit5-6.webp';

const cards = [
  {id:'unit1-2',lesson:'Lesson 1–2',title:'礼貌小帮手',story:'手提包的故事',name:'小雨',stars:5,date:'2026.10.07',color:'#08779c',scene:handbag,alt:'戴眼镜的男士把红色手提包交还给戴草帽的女士'},
  {id:'unit3-4',lesson:'Lesson 3–4',title:'认领小达人',story:'雨伞认领小帮手',name:'小雨',stars:5,date:'2026.10.08',color:'#74376f',scene:umbrella,alt:'戴帽子的客人拿着紫色雨伞，柜台后的店员微笑着把物品交给他'},
  {id:'unit5-6',lesson:'Lesson 5–6',title:'新朋友小使者',story:'新朋友见面会',name:'小雨',stars:3,date:null,color:'#49785c',scene:friends,alt:'布莱克先生和苏菲、汉斯在教室里见面，汉斯挥手打招呼'}
];
const pictures = [...new Set([book,paper,corner,star,emptyStar,logo,...cards.map(card=>card.scene)])];
const decoded = new Map();
const STORAGE_KEY = 'canran-award-book-demo-v1:selected';
const MOTION_KEY = 'canran-award-book-demo-v1:motion';
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
function readPosition(){try{return Math.max(0,cards.findIndex(c=>c.id===sessionStorage.getItem(STORAGE_KEY)));}catch{return 0;}}
function useMedia(query){const [value,setValue]=useState(()=>matchMedia(query).matches);useEffect(()=>{const m=matchMedia(query),change=()=>setValue(m.matches);m.addEventListener('change',change);return()=>m.removeEventListener('change',change);},[query]);return value;}
const iconProps={size:24,weight:'bold','aria-hidden':true};
function Certificate({card}){
  return <article className="certificate" data-stars={card.stars} data-unit={card.id} style={{'--accent':card.color,'--paper':`url(${paper})`}} aria-label={`${card.lesson} ${card.title}，${card.name}，${card.stars} 颗星`}>
    <img className="card-scene" src={card.scene} alt={card.alt} draggable="false"/>
    <p className="card-brand">灿然英语工作室</p><h2 className="card-title">{card.title}</h2><p className="card-name">{card.name}</p>
    <div className="card-stars" aria-label={`${card.stars} / 5 颗星`}>{Array.from({length:5},(_,i)=><img key={i} src={i<card.stars?star:emptyStar} alt="" draggable="false"/>)}</div>
    <p className="card-caption"><span>{card.lesson}</span>{card.stars===5&&card.date&&<time dateTime={card.date.replaceAll('.','-')}>{card.date}</time>}</p>
  </article>;
}
function Corners(){return <span className="photo-corners" aria-hidden="true">{[0,1,2,3].map(i=><img key={i} src={corner} className={`photo-corner corner-${i}`} alt="" draggable="false"/>)}</span>;}
function Leaf({index,side,onOpen,decorative=false,blank=false}){
  const card=cards[index];
  return <div className={`book-leaf ${side||''} ${!card||blank?'empty-leaf':''}`}>
    {card&&!blank&&<>
      {decorative?<div className="card-holder"><Certificate card={card}/><Corners/></div>:<button className="card-holder" onClick={()=>onOpen(index)} aria-label={`放大 ${card.lesson} ${card.title}`}><Certificate card={card}/><Corners/></button>}
      {decorative?<span className="button leaf-zoom"><MagnifyingGlass {...iconProps}/>放大查看</span>:<button className="button leaf-zoom" onClick={()=>onOpen(index)} aria-label={`放大查看 ${card.lesson}`}><MagnifyingGlass {...iconProps}/>放大查看</button>}
      <span className="leaf-number" aria-hidden="true">{index+1}</span>
    </>}
  </div>;
}
function Modal({children,label,onClose,className=''}){
  const ref=useRef(null);
  useEffect(()=>{const dialog=ref.current,previous=document.activeElement;dialog.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog.close();document.body.style.overflow=old;previous?.focus?.();};},[]);
  return <dialog ref={ref} className={`modal ${className}`} aria-label={label} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal-body">{children}</div></dialog>;
}
function loadPicture(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=async()=>{try{await img.decode();decoded.set(src,img);resolve();}catch{reject(new Error('image'));}};img.onerror=()=>reject(new Error('image'));img.src=src;});}
async function prepare(onProgress){
  let done=0,timer;
  const resources=[...pictures.map(src=>()=>loadPicture(src)),()=>document.fonts.load('400 24px "Award Book"','小雨的纪念册'),()=>document.fonts.load('500 24px "Baloo Book"','Lesson 1–2')];
  try {await Promise.race([Promise.all(resources.map(async run=>{await run();onProgress(++done/resources.length);})),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('timeout')),20000);})]);}finally{clearTimeout(timer);}
}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
async function saveCard(card){
  const canvas=document.createElement('canvas');canvas.width=1640;canvas.height=880;const ctx=canvas.getContext('2d');
  roundRect(ctx,8,8,1624,864,30);ctx.fillStyle='#fffcf5';ctx.fill();ctx.save();ctx.clip();ctx.fillStyle=ctx.createPattern(decoded.get(paper),'repeat');ctx.fillRect(0,0,1640,880);
  const scene=decoded.get(card.scene),scale=Math.min(965/scene.naturalWidth,815/scene.naturalHeight);ctx.drawImage(scene,1624-scene.naturalWidth*scale,841-scene.naturalHeight*scale,scene.naturalWidth*scale,scene.naturalHeight*scale);ctx.restore();
  ctx.strokeStyle='#503829';ctx.lineWidth=4;ctx.stroke();
  if(card.stars===5){roundRect(ctx,16,16,1608,848,26);ctx.strokeStyle='#f6c85c';ctx.lineWidth=10;ctx.stroke();roundRect(ctx,24,24,1592,832,20);ctx.strokeStyle='#97672a';ctx.lineWidth=2;ctx.stroke();}
  function text(value,x,y,size,color,max=685,family='Award Book',stroke=0){ctx.textBaseline='middle';do{ctx.font=`400 ${size--}px "${family}", sans-serif`;}while(ctx.measureText(value).width>max&&size>14);ctx.fillStyle=color;if(stroke){ctx.strokeStyle=color;ctx.lineWidth=stroke;ctx.lineJoin='round';ctx.strokeText(value,x,y);}ctx.fillText(value,x,y);}
  text('灿然英语工作室',94,126,35,'#4d3325');text(card.title,94,288,122,card.color,715,'Award Book',2.6);text(card.name,94,464,162,'#4d3325',560,'Award Book',3);
  for(let i=0;i<5;i++)ctx.drawImage(decoded.get(i<card.stars?star:emptyStar),85+i*123,582,104,104);
  text(card.lesson+(card.stars===5&&card.date?'  ·  '+card.date:''),94,798,34,'#735841',800,'Baloo Book');
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('export')),'image/png'));
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${card.lesson.replace(' ','')}-${card.title}-${card.name}.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
  return {width:canvas.width,height:canvas.height,bytes:blob.size};
}
export function App(){
  const [ready,setReady]=useState(false),[error,setError]=useState(false),[progress,setProgress]=useState(0);
  const [motion,setMotion]=useState(readMotion);
  const [selected,setSelected]=useState(readPosition),[turn,setTurn]=useState(null),[directory,setDirectory]=useState(false),[opened,setOpened]=useState(null),[saveState,setSaveState]=useState(''),[saving,setSaving]=useState(false);
  const mobile=useMedia('(max-width: 700px)'),systemReduced=useMedia('(prefers-reduced-motion: reduce)'),reduced=motion===null?systemReduced:!motion,perPage=mobile?1:2;
  const timers=useRef([]),pointer=useRef(null),busy=useRef(false),bookRef=useRef(null);
  const start=Math.floor(selected/perPage)*perPage,canPrev=start>0,canNext=start+perPage<cards.length;
  useEffect(()=>{let active=true;setError(false);setProgress(0);setReady(false);prepare(p=>{if(active)setProgress(p);}).then(()=>{if(active)setReady(true);}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[]);
  useEffect(()=>{try{sessionStorage.setItem(STORAGE_KEY,cards[selected].id);}catch{}},[selected]);
  useEffect(()=>{const sync=e=>{if(e.key===MOTION_KEY||e.key===null)setMotion(parseMotion(e.newValue));};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
  useEffect(()=>{timers.current.forEach(clearTimeout);setTurn(null);busy.current=false;return()=>timers.current.forEach(clearTimeout);},[mobile,reduced]);
  function toggleMotion(){const enabled=reduced;setMotion(enabled);saveMotion(enabled);}
  function flip(direction){
    if(!ready||busy.current||directory||opened!==null)return;
    const target=start+direction*perPage;if(target<0||target>=cards.length)return;
    if(reduced){setSelected(target);return;}
    busy.current=true;setTurn({direction,from:start,to:target});
    timers.current.push(setTimeout(()=>{setSelected(target);setTurn(null);busy.current=false;},580));
  }
  function openCard(index){if(busy.current)return;setSelected(index);setOpened(index);setSaveState('');}
  function closeCard(){setOpened(null);setSaveState('');}
  function goTo(index){timers.current.forEach(clearTimeout);busy.current=false;setTurn(null);setSelected(index);setDirectory(false);bookRef.current?.focus({preventScroll:true});}
  function swipeStart(e){if(e.target.closest('button')||e.pointerType==='mouse'&&e.clientY<e.currentTarget.getBoundingClientRect().bottom-80)return;pointer.current={x:e.clientX,y:e.clientY};}
  function swipeEnd(e){const p=pointer.current;pointer.current=null;if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.8)flip(dx<0?1:-1);}
  async function download(){if(saving)return;setSaving(true);setSaveState('');try{await saveCard({...cards[opened]});setSaveState('已生成纪念卡');}catch{setSaveState('暂时没能保存，请再试一次。');}finally{setSaving(false);}}
  const displayLeft=turn&&!mobile?(turn.direction>0?turn.from:turn.to):start;
  const displayRight=turn&&!mobile?(turn.direction>0?turn.to+1:turn.from+1):start+1;
  return <>
    <header className="site-header"><a className="brand" href="https://www.canranstudio.cn/" aria-label="灿然英语工作室首页"><img src={logo} alt=""/><span>灿然英语工作室</span></a><nav aria-label="主导航"><a href="https://www.canranstudio.cn/">我的课程</a><span className="current" aria-current="page">我的纪念册</span><span className="student">小雨</span></nav></header>
    <main className="album-main">
      <div className="album-heading"><h1>小雨的纪念册</h1><button className="button directory-button" disabled={!ready} onClick={()=>setDirectory(true)}><List {...iconProps}/>目录</button></div>
      {!ready?<section className="loading-panel" aria-label="准备纪念册"><img src={logo} alt=""/><h2>{error?'纪念册还没准备好':'正在打开纪念册…'}</h2>{error?<><p>请检查网络后再试一次。</p><button className="button primary" onClick={()=>window.location.reload()}>再试一次</button></>:<progress value={progress} max="1" aria-label="素材加载进度"/>}</section>:<>
        <div className={`book ${mobile?'is-mobile':''} ${turn?'is-turning':''}`} ref={bookRef} tabIndex="0" role="group" aria-label="纪念册书页，左右方向键翻页" aria-busy={!!turn} data-motion={reduced?'reduced':'full'} onKeyDown={e=>{if(e.target===e.currentTarget&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();flip(e.key==='ArrowLeft'?-1:1);}}} onPointerDown={swipeStart} onPointerUp={swipeEnd} onPointerCancel={()=>{pointer.current=null;}} style={{'--book-art':`url(${book})`,'--paper':`url(${paper})`}}>
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
        </div>
        <div className="pagination"><button className="button" disabled={!canPrev} aria-disabled={!canPrev||!!turn} onClick={()=>flip(-1)}><ArrowLeft {...iconProps}/>上一页</button><p role="status" aria-live="polite" className="page-count">{mobile?start+1:`${start+1}${start+1<cards.length?'–'+Math.min(start+2,cards.length):''}`}<span> / {cards.length}</span></p><button className="button primary" disabled={!canNext} aria-disabled={!canNext||!!turn} onClick={()=>flip(1)}>下一页<ArrowRight {...iconProps}/></button></div>
      </>}
      <p className="demo-note">效果预览 · 示例姓名与获星记录</p>
    </main>
    {directory&&<Modal label="纪念册目录" className="directory-modal" onClose={()=>setDirectory(false)}><div className="modal-heading"><h2>纪念册目录</h2><button className="icon-button" aria-label="关闭目录" onClick={()=>setDirectory(false)}><X {...iconProps}/></button></div><div className="directory-list">{cards.map((card,index)=><button className="directory-row" key={card.id} onClick={()=>goTo(index)}><img src={card.scene} alt=""/><span><small>{card.lesson}</small><strong>{card.title}</strong><em>{card.story}</em></span><span className="directory-stars"><img src={star} alt=""/>{card.stars}<span className="sr-only">颗星</span></span><ArrowRight {...iconProps}/></button>)}</div><div className="motion-preference"><span>翻页动画</span><button className="motion-switch" role="switch" aria-label="翻页动画" aria-checked={!reduced} onClick={toggleMotion}>{reduced?'关闭':'开启'}</button></div></Modal>}
    {opened!==null&&<Modal label={`${cards[opened].lesson} 纪念卡`} className="card-modal" onClose={closeCard}><div className="modal-heading"><h2>{cards[opened].lesson}</h2><button className="icon-button" aria-label="关闭纪念卡" onClick={closeCard}><X {...iconProps}/></button></div><Certificate card={cards[opened]}/><div className="modal-actions"><button className="button" onClick={closeCard}>返回纪念册</button><button className="button primary" disabled={saving} onClick={download}><DownloadSimple {...iconProps}/>{saving?'正在保存…':'保存纪念卡'}</button></div><p className="save-state" role="status">{saveState==='已生成纪念卡'&&<Check {...iconProps}/>} {saveState}</p></Modal>}
    <noscript>请允许 JavaScript 以打开纪念册。</noscript>
  </>;
}
