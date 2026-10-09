'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {openStore}=require('../../server/store');
const {validClaim}=require('../../core/award-rules');
const {definition}=require('../../server/progress');
const catalog=require('../../server/award-catalog');
test('three confirmed editions have exactly five answer zones and catalog metadata matches the course',()=>{
 for(const [course,versions] of Object.entries(catalog)){
  const unit=definition(path.resolve(__dirname,'../..'),course,'/');assert.equal(Object.keys(unit.questions).length,5);assert.equal(unit.reward.zones.length,5);
  assert.deepEqual(new Set(unit.reward.zones.map(zone=>zone.id)),new Set(Object.keys(unit.questions)));
  const meta=versions[unit.reward.edition];assert.equal(meta.title,unit.reward.title);if(unit.reward.scene)assert.equal('/'+meta.scene,unit.reward.scene);
 }
});
test('zero-error claims require this edition and one real first-correct submission, not merely completion',()=>{
 const unit={version:1,reward:{edition:'first',zones:[{id:'words'}]},questions:{words:[{id:'word-1',options:['book','bag'],answer:'book'}]}};
 const state={runId:'r1',questionId:'word-1',attempts:1,firstCorrect:true,checked:true,correct:true,selection:'book'};
 const claim={edition:'first',roundPolicy:'first',runId:'r1',index:1,states:[state],contentSignature:JSON.stringify([1,unit.questions.words])};
 assert.equal(validClaim(unit,'words',claim),true);
 for(const change of [{attempts:2},{firstCorrect:false},{checked:false},{selection:'bag'},{runId:'old'}])assert.equal(validClaim(unit,'words',{...claim,states:[{...state,...change}]}),false);
 for(const change of [{edition:'old'},{roundPolicy:undefined},{contentSignature:'invalid'},{index:0},{states:[]}])assert.equal(validClaim(unit,'words',{...claim,...change}),false);
});
test('collection retains editions independently, isolates owners, and fixes the first full-star date across replays and resets',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'canran-award-ledger-')),store=openStore(dir);t.after(()=>{store.close();fs.rmSync(dir,{recursive:true,force:true});});
 const group=store.createClass('收藏测试');const [first,second]=store.createStudents([{name:'小雨',pinyin:'xiaoyu'},{name:'小明',pinyin:'xiaoming'}],group.id);
 const reward={edition:'story-card-v1',zones:['listen','roles','manners','workshop','exam'].map(id=>({id}))};
 const claims=reward.zones.map(zone=>[zone.id,{runId:'one'}]);
 store.grantAwards(first.id,'unit1-2',reward,claims.slice(0,1));assert.equal(store.awards(first.id)[0].firstFullStarAt,null);
 const full=store.grantAwards(first.id,'unit1-2',reward,claims);assert.ok(full.firstFullStarAt);
 const replay=store.grantAwards(first.id,'unit1-2',reward,claims.map(([id])=>[id,{runId:'two'}]));assert.equal(replay.firstFullStarAt,full.firstFullStarAt);assert.equal(replay.zones.listen.runId,'one');
 store.resetLearning(first.id,'unit1-2',1);assert.equal(store.awards(first.id)[0].firstFullStarAt,full.firstFullStarAt);
 store.grantAwards(first.id,'unit1-2',{...reward,edition:'story-card-v2'},claims.slice(0,1));
 assert.deepEqual(store.awards(first.id).map(record=>record.edition).sort(),['story-card-v1','story-card-v2']);assert.equal(store.award(first.id,'unit1-2','story-card-v1').firstFullStarAt,full.firstFullStarAt);assert.equal(store.award(first.id,'unit1-2','story-card-v2').firstFullStarAt,null);
 assert.deepEqual(store.awards(second.id),[]);
});
