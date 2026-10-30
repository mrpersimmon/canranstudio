import React,{useEffect,useState} from 'react';
import {PostofficeAlbum} from './Postoffice';
import {logo} from './media';
const BASE=document.querySelector('meta[name="award-base"]').content;
const dateLabel = value => value ? new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value)).replaceAll('/','.') : null;
async function request(endpoint,value){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
    const response=await fetch(BASE+'api/'+endpoint,{cache:'no-store',signal:controller.signal,...(value===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)})});
    const result=await response.json();if(!response.ok)throw Object.assign(Error(result.error),{status:response.status});return result;
  }finally{clearTimeout(timer);}
}
export async function loadCollection(){
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
    const refresh=async()=>{const id=++run;setData(null);setError(null);try{const next=await loadCollection();if(active&&id===run)setData(next);}catch(e){if(active&&id===run)setError(e);}finally{if(active&&id===run)document.getElementById('root').style.visibility='';}};
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
  return <PostofficeAlbum collection={data} key={data.student.id+':'+revision}/>;
}
