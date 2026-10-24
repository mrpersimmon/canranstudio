(function(root){
 'use strict';
 const validDate=value=>typeof value==='string'&&value.length<=50&&Number.isFinite(Date.parse(value));
 const courseOK=course=>/^unit\d+-\d+$/.test(course)&&Number(course.match(/\d+/)[0])>=1&&Number(course.match(/\d+/)[0])<=143&&Number(course.match(/\d+/)[0])%2===1&&Number(course.split('-')[1])===Number(course.match(/\d+/)[0])+1;
 const paperOK=course=>courseOK(course)&&(Number(course.match(/\d+/)[0])<=39||course==='unit49-50');
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
 const historyKey=/^unit(?:\d+)?(?:LegacyProgress|LegacySnapshot|HistoryProgress|HistorySnapshot|V153Progress|V153Snapshot)$/;
 async function collect(access){
  if(!access?.student?.id||!access.systemUpgrade?.epoch)return[];
  const prefix='canran:student:'+access.student.id+':',copies=[],seen=new Set();
  async function keep(item){
   const identity=JSON.stringify([access.student.id,item.course,item.kind,item.edition,item.name,item.issuedAt]);
   if(seen.has(identity))return;seen.add(identity);
   const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(identity));
   copies.push({...item,id:[...new Uint8Array(bytes)].map(byte=>byte.toString(16).padStart(2,'0')).join('')});
  }
  async function receipts(course,snapshot,sourceKey,depth=0){
   if(depth>8||!object(snapshot)||!object(snapshot.activity))return;
   for(const [key,value]of Object.entries(snapshot.activity))if(historyKey.test(key))await receipts(course,value,sourceKey+'.'+key,depth+1);
   const dates=new Set();
   for(const field of ['unitClassroomCertificateIssuedAt','unitCertificateIssuedAt']){
    const issuedAt=snapshot.activity[field];if(!paperOK(course)||!validDate(issuedAt)||dates.has(issuedAt))continue;dates.add(issuedAt);
    await keep({course,kind:'legacy-paper',edition:'legacy-paper:'+(field==='unitClassroomCertificateIssuedAt'?'classroom':'original'),name:typeof snapshot.activity.unitName==='string'?snapshot.activity.unitName:'',issuedAt,meta:{issuedAtField:field},snapshot,sourceKey});
   }
  }
  // These are private read-only preservation copies, never award claims. Do
  // not scan anonymous keys, another student, or the new epoch's live book.
  for(const key of Object.keys(localStorage).filter(key=>key.startsWith(prefix)&&!key.startsWith(prefix+'epoch:'))){
   const suffix=key.slice(prefix.length),match=suffix.match(/^canran:lesson:(unit\d+-\d+):learning:v1(?::awards:(.+))?$/);if(!match||!courseOK(match[1]))continue;
   let value;try{value=JSON.parse(localStorage.getItem(key));}catch{continue;}
   if(!object(value))continue;
   if(!match[2])await receipts(match[1],value,key);
   else if(object(value.zones)&&Object.values(value.zones).filter(zone=>object(zone)&&!zone.pending).length===5&&validDate(value.firstFullStarAt)){
    await keep({course:match[1],kind:'card',edition:match[2],name:access.student.name,issuedAt:value.firstFullStarAt,meta:{},snapshot:value,sourceKey:key});
   }
  }
  return copies;
 }
 function download(copy){
  const url=URL.createObjectURL(new Blob([JSON.stringify({format:'canran-local-certificate-copy-v1',certificate:copy},null,2)+'\n'],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download=copy.course+'-本机原证资料.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 root.CanranLocalCertificates={collect,download};
})(globalThis);
