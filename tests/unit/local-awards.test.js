'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const rules=require('../../core/award-rules'),source=fs.readFileSync('core/unit-awards.js','utf8'),key='canran:lesson:unit1-2:learning:v1';
function setup(storage=new Map(),canonical={edition:'test-v1',zones:{},firstFullStarAt:null}){
 const questions=Object.fromEntries(['a','b','c','d','e'].map(id=>[id,[{id,options:['yes','no'],answer:'yes'}]]));
 const unit={id:'unit1-2',version:1,progress:{learningKey:key},reward:{edition:'test-v1',zones:Object.keys(questions).map(id=>({id}))},questions};
 const book=JSON.parse(storage.get(key)||'{"activity":{}}'),listeners=new Map(),flights=[];
 const env={CanranCore:{awardRules:rules},CanranStudentAccess:{preview:false,awards:canonical},structuredClone,Date,failMain:false,CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}}};
 env.localStorage={getItem:k=>storage.get(k)??null,setItem(k,v){if(k===key&&env.failMain)throw Error('Quota');storage.set(k,v);}};
 env.addEventListener=(name,fn)=>{const callbacks=listeners.get(name)||[];callbacks.push(fn);listeners.set(name,callbacks);};env.dispatchEvent=e=>{for(const fn of listeners.get(e.type)||[])fn(e);};
 const practice={activity(id,value){if(arguments.length>1){book.activity[id]=value;try{env.localStorage.setItem(key,JSON.stringify(book));}catch{}}return book.activity[id];}};
 vm.runInNewContext(source,env);const api=env.CanranCore.unitAwards.create({unit,practice,onChange(){},onAward(event){assert.ok(storage.get(key),'proof must be durable before visual reward');flights.push(event);}});
 function earn(id='a',runId='r1',bad=false){const states=[{questionId:id,runId,attempts:bad?2:1,firstCorrect:!bad,checked:true,correct:true,selection:'yes'}];return api.record(id,states,{runId,index:1,roundPolicy:'test-v1',contentSignature:JSON.stringify([1,questions[id]])});}
 const sync=(zones,reviews=[],date=null)=>env.dispatchEvent({type:'lesson-awards:synced',detail:{edition:'test-v1',zones,firstFullStarAt:date,reviews}});
 return{api,earn,sync,env,storage,book,flights,state:()=>JSON.parse(JSON.stringify(api.state()))};
}
test('durable local proof immediately adds a pending star and emits one visual reward',()=>{
 const f=setup();assert.equal(f.earn(),true);assert.equal(f.state().stars,1);assert.equal(f.state().confirmedStars,0);assert.deepEqual(f.state().pendingZones,['a']);assert.equal(f.state().firstFullStarAt,null);assert.equal(f.flights.length,1);
 f.sync({a:{runId:'r1',earnedAt:'2026-11-17T00:00:00Z'}},[{zone:'a',runId:'r1',edition:'test-v1',accepted:true}]);assert.equal(f.state().stars,1);assert.equal(f.state().confirmedStars,1);assert.deepEqual(f.state().pendingZones,[]);assert.equal(f.flights.length,1);
});
test('refresh restores pending local stars without replaying the flight',()=>{
 const first=setup();first.earn();const next=setup(first.storage);assert.equal(next.state().stars,1);assert.deepEqual(next.state().pendingZones,['a']);assert.equal(next.flights.length,0);
});
test('failed local save does not display a star, and a corrected round never earns one',()=>{
 const f=setup();f.env.failMain=true;f.earn();assert.equal(f.state().stars,0);assert.equal(f.flights.length,0);assert.deepEqual(f.state().unsavedZones,['a']);const g=setup();assert.equal(g.earn('a','wrong',true),false);assert.equal(g.state().stars,0);
});
test('a server rejection corrects only the reviewed local claim and preserves its evidence',()=>{
 const f=setup();f.earn();const proof=JSON.stringify(f.book);f.sync({},[{zone:'a',runId:'r1',edition:'test-v1',accepted:false,reason:'version'}]);assert.equal(f.state().stars,0);assert.deepEqual(f.state().rejectedZones,['a']);assert.equal(JSON.stringify(f.book),proof);
 const restored=setup(f.storage);assert.equal(restored.state().stars,0);restored.earn('a','r2');assert.equal(restored.state().stars,1);
 restored.sync({},[{zone:'a',runId:'r1',edition:'test-v1',accepted:false,reason:'version'}]);assert.equal(restored.state().stars,1,'an old response must not roll back the new round');
});
test('acknowledging an older in-flight request does not erase another pending star',()=>{
 const f=setup();f.earn('a','r1');f.earn('b','r2');f.sync({a:{runId:'r1'}},[{zone:'a',runId:'r1',edition:'test-v1',accepted:true}]);assert.equal(f.state().stars,2);assert.equal(f.state().confirmedStars,1);assert.deepEqual(f.state().pendingZones,['b']);assert.equal(f.flights.length,2);
});
test('the fifth local star has no official date until the server confirms it',()=>{
 const f=setup();for(const id of ['a','b','c','d','e'])f.earn(id,'r-'+id);assert.equal(f.state().stars,5);assert.equal(f.state().confirmedStars,0);assert.equal(f.state().firstFullStarAt,null);
 const zones=Object.fromEntries(['a','b','c','d','e'].map(id=>[id,{runId:'r-'+id}])),date='2026-11-17T10:00:00Z';f.sync(zones,[],date);f.sync(zones,[],date);assert.equal(f.state().confirmedStars,5);assert.equal(f.state().firstFullStarAt,date);assert.equal(f.flights.length,5);
});
test('version rejection is processed even when the server now uses a newer award edition',()=>{
 const f=setup();f.earn();f.env.dispatchEvent({type:'lesson-awards:synced',detail:{edition:'new-edition',zones:{},reviews:[{zone:'a',runId:'r1',edition:'test-v1',accepted:false,reason:'version'}]}});assert.equal(f.state().stars,0);assert.deepEqual(f.state().rejectedZones,['a']);
});
