(function attach(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) (root.CanranCore ||= {}).courseCatalogWire = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // Lossless transport only. The authored catalog remains the sole truth.
  // Repeated strings and subtrees share table entries; data meaning is unchanged.
  function encode(value, {compactStrings=false} = {}) {
    const strings=[], stringIds=new Map(), nodes=[], nodeIds=new Map();
    function stringId(value) {
      if (!stringIds.has(value)) { stringIds.set(value,strings.length); strings.push(value); }
      return stringIds.get(value);
    }
    function visit(value) {
      if (typeof value==='string') return -stringId(value)-1;
      if (value===null || typeof value==='boolean' || typeof value==='number' && Number.isFinite(value)) return [value];
      if (!value || typeof value!=='object') throw Error('Catalog must contain JSON values');
      const node=Array.isArray(value)
        ? [0,...value.map(visit)]
        : [1,...Object.entries(value).flatMap(([key,item])=>[stringId(key),visit(item)])];
      const key=JSON.stringify(node);
      if (!nodeIds.has(key)) { nodeIds.set(key,nodes.length); nodes.push(node); }
      return nodeIds.get(key);
    }
    const root=visit(value);
    if(compactStrings){
      // Short IDs for frequently referenced strings reduce the download while
      // retaining the existing wire format and exact authored object order.
      const counts=strings.map(()=>0);
      for(const node of nodes)for(let i=1;i<node.length;i++){
        const ref=node[i];
        if(node[0]===1&&i%2)counts[ref]++;
        else if(typeof ref==='number'&&ref<0)counts[-ref-1]++;
      }
      const order=counts.map((count,id)=>({count,id})).sort((a,b)=>b.count-a.count||a.id-b.id),ids=[];
      order.forEach((item,id)=>{ids[item.id]=id;});
      const remap=ref=>typeof ref==='number'&&ref<0?-ids[-ref-1]-1:ref;
      return {codec:'course-table-v1',strings:order.map(item=>strings[item.id]),
        nodes:nodes.map(node=>node.map((ref,i)=>!i?ref:node[0]===1&&i%2?ids[ref]:remap(ref))),root:remap(root)};
    }
    return {codec:'course-table-v1',strings,nodes,root};
  }
  function decode(wire) {
    if (wire?.codec!=='course-table-v1' || !Array.isArray(wire.strings) || !wire.strings.every(x=>typeof x==='string') || !Array.isArray(wire.nodes)) throw Error('Invalid course transport');
    const decoded=[], strings=wire.strings;
    function value(ref,limit) {
      if (Array.isArray(ref)) {
        if (ref.length!==1 || !(ref[0]===null || typeof ref[0]==='boolean' || typeof ref[0]==='number' && Number.isFinite(ref[0]))) throw Error('Invalid catalog scalar');
        return ref[0];
      }
      if (!Number.isSafeInteger(ref)) throw Error('Invalid catalog reference');
      if (ref<0) {
        if (-ref>strings.length) throw Error('Missing catalog string');
        return strings[-ref-1];
      }
      if (ref>=limit) throw Error('Forward or missing catalog reference');
      return decoded[ref];
    }
    for (const [index,node] of wire.nodes.entries()) {
      if (!Array.isArray(node) || ![0,1].includes(node[0])) throw Error('Invalid catalog node');
      if (node[0]===0) decoded.push(node.slice(1).map(ref=>value(ref,index)));
      else {
        if (node.length%2!==1) throw Error('Invalid catalog object');
        const object={};
        for (let i=1;i<node.length;i+=2) {
          const keyId=node[i];
          if (!Number.isSafeInteger(keyId) || keyId<0 || keyId>=strings.length || Object.hasOwn(object,strings[keyId])) throw Error('Invalid catalog key');
          // defineProperty preserves ordinary JSON keys without invoking setters.
          Object.defineProperty(object,strings[keyId],{value:value(node[i+1],index),enumerable:true,writable:true,configurable:true});
        }
        decoded.push(object);
      }
    }
    return value(wire.root,decoded.length);
  }
  return Object.freeze({encode,decode});
});
