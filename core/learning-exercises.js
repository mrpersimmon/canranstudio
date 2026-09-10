(function attach(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)(root.CanranCore ||= {}).learningExercises=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const empty=()=>({selected:[],pairs:[],anchor:null});
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const mechanisms=['choice','cloze','order','multi','pairs','repair','mission'];
  function valid(q,r){
    if(!q||!Array.isArray(q.options)||!Array.isArray(q.answer)||!r||!Array.isArray(r.selected)||!Array.isArray(r.pairs)||r.selected.length>q.options.length||r.pairs.length>(q.pairs?.length||0))return false;
    const ids=q.options.map(o=>o.id);
    const selected=r.selected.map(id=>q.options.find(o=>o.id===id));
    if(q.mechanism==='pairs'){if(r.selected.length)return false;}
    else if(r.pairs.length||r.anchor!==null||r.selected.length>q.answer.length)return false;
    if(q.mechanism==='repair'&&selected.some((o,i)=>o?.group!==(i===0?'word':'replacement')))return false;
    if(q.mechanism==='mission'&&selected.some((o,i)=>o?.stage!==i))return false;
    return new Set(r.selected).size===r.selected.length && r.selected.every(id=>ids.includes(id))
      && (r.anchor===null||q.pairs?.some(p=>p.id===r.anchor))
      && r.pairs.every(p=>Array.isArray(p)&&p.length===2&&q.pairs?.some(x=>x.id===p[0])&&ids.includes(p[1]))
      && new Set(r.pairs.map(p=>p[0])).size===r.pairs.length&&new Set(r.pairs.map(p=>p[1])).size===r.pairs.length;
  }
  function reduce(q,response,id){
    const r=valid(q,response)?JSON.parse(JSON.stringify(response)):empty();
    if(q.mechanism==='pairs'&&q.pairs.some(p=>p.id===id)){
      r.anchor=id;return r;
    }
    const o=q.options.find(o=>o.id===id);if(!o)return r;
    if(q.mechanism==='pairs'){
      if(r.anchor){r.pairs=r.pairs.filter(p=>p[0]!==r.anchor&&p[1]!==id);r.pairs.push([r.anchor,id]);r.anchor=null;}
    }else if(q.mechanism==='repair'){
      if(o.group==='word')r.selected=r.selected[0]===id?[]:[id];
      else if(r.selected[0])r.selected=[r.selected[0],id];
    }else if(q.mechanism==='mission'){
      const stage=o.stage;
      if(stage<=r.selected.length){r.selected=r.selected.slice(0,stage);r.selected.push(id);}
    }else if(['multi','order'].includes(q.mechanism)){
      if(r.selected.includes(id))r.selected=r.selected.filter(x=>x!==id);
      else if(r.selected.length<q.answer.length)r.selected.push(id);
    }else r.selected=r.selected[0]===id?[]:[id];
    return r;
  }
  function ready(q,r,heard=[]){
    return Array.isArray(heard)&&valid(q,r)&& (q.mechanism==='pairs'?r.pairs.length===q.pairs.length:r.selected.length===q.answer.length)
      && (q.listenRefs||[]).every(ref=>heard.includes(ref));
  }
  function accepts(q,r){
    if(!valid(q,r))return false;
    if(q.mechanism==='pairs')return r.pairs.length===q.pairs.length&&q.pairs.every(p=>r.pairs.some(x=>x[0]===p.id&&x[1]===p.answer));
    if(q.mechanism==='multi')return same([...r.selected].sort(),[...q.answer].sort());
    if(q.mechanism==='order'){
      const text=ids=>ids.map(id=>q.options.find(o=>o.id===id)?.text);
      return [q.answer,...(q.acceptedOrders||[])].some(ids=>same(text(ids),text(r.selected)));
    }
    return same(r.selected,q.answer);
  }
  function solution(q){return {...empty(),selected:[...q.answer],pairs:(q.pairs||[]).map(p=>[p.id,p.answer])};}
  function validate(q,unit){
    const errors=[];
    if(q.kind!=='exercise'||!mechanisms.includes(q.mechanism)||!q.title||!q.prompt||!q.assessment?.support||!q.targetId)errors.push('invalid exercise '+q.id);
    if(!Array.isArray(q.options)||q.options.length<2||new Set(q.options.map(o=>o?.id)).size!==q.options.length||q.options.some(o=>!o||typeof o.id!=='string'||!o.text&&!o.entityId))return [...errors,'invalid exercise options '+q.id];
    if(!Array.isArray(q.answer)||!valid(q,solution(q))||!accepts(q,solution(q))||q.mechanism!=='pairs'&&!q.answer.length)errors.push('invalid exercise answer '+q.id);
    if(!(q.sourceRefs||[q.sourceRef]).every(ref=>unit.sources[ref])||!(q.listenRefs||[]).every(ref=>unit.sources[ref]?.audioSrc))errors.push('invalid exercise source '+q.id);
    if(q.mechanism==='order'&&(q.acceptedOrders||[]).some(ids=>!valid(q,{...empty(),selected:ids})||ids.length!==q.answer.length))errors.push('invalid alternate order '+q.id);
    if(q.options.some(o=>o.entityId&&!unit.entities[o.entityId]))errors.push('invalid exercise image '+q.id);
    if(!q.distractorRationale||!q.prerequisiteRefs?.length)errors.push('missing authored exercise rationale '+q.id);
    return errors;
  }
  return Object.freeze({empty,valid,reduce,ready,accepts,solution,validate,mechanisms});
});
