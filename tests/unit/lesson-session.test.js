'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('shared location handles cover, repeated visits and unknown routes; completion preserves the edition signature',()=>{
 const writes=[],events=[],nav=new Map(),link={hash:'#l1',setAttribute:(k,v)=>nav.set(k,v),removeAttribute:k=>nav.delete(k)},select={},start={};
 const env={CanranCore:{},Event,dispatchEvent:e=>events.push(e.type),document:{querySelector:s=>s==='#startBtn'?start:select,querySelectorAll:()=>[link],getElementById:()=>({closest:()=>({id:'l1'})})}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../../core/unit-session'),'utf8'),env);
 const practice={activity:(...p)=>writes.push(p)},session=env.CanranCore.unitSession;let updates=0;
 const loc=session.location(new Set(['cover','learn/text']),practice,()=>updates++);
 loc.mark('cover');loc.mark('unknown');loc.mark('learn/text');loc.mark('learn/text');
 assert.equal(loc.active,'learn/text');assert.equal(events.length,2);assert.deepEqual(writes,[['unitLocation','learn/text'],['unitLocation','learn/text']]);
 assert.equal(select.value,'l1');assert.equal(nav.get('aria-current'),'location');assert.equal(start.textContent,'继续冒险');assert.equal(updates,2);
 const completed={old:'kept'};session.completion(completed,{text:'original'},practice,()=>updates++)('text');
 assert.deepEqual(completed,{old:'kept',text:'original'});assert.equal(writes.at(-1)[1],completed);assert.equal(updates,3);
});
