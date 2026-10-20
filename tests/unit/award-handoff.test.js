'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {validClaim}=require('../../core/award-rules');
function fixture(){
 const q={id:'handoff-1',type:'handoff',objects:[{id:'book'},{id:'box'}],recipients:[{id:'jane'},{id:'man'}],answer:'["book","jane"]'};
 const unit={version:1,reward:{edition:'handoff-v1',zones:[{id:'apply'}]},questions:{apply:[q]}};
 const state={questionId:q.id,runId:'round-1',attempts:1,firstCorrect:true,checked:true,correct:true,selection:q.answer,handoff:{object:'book',recipient:'jane'}};
 const claim={edition:'handoff-v1',roundPolicy:'handoff-v1',runId:'round-1',index:1,states:[state],contentSignature:JSON.stringify([1,[q]])};
 return{unit,state,claim};
}
test('handoff awards require a complete matching object and recipient from this round',()=>{
 const{unit,claim}=fixture();assert.equal(validClaim(unit,'apply',claim),true);
 for(const handoff of [undefined,null,[],{}, {object:'book'}, {recipient:'jane'}, {object:'box',recipient:'jane'}, {object:'book',recipient:'man'}, {object:'unknown',recipient:'jane'}, {object:'book',recipient:'unknown'}]){
  const copy=structuredClone(claim);copy.states[0].handoff=handoff;assert.equal(validClaim(unit,'apply',copy),false,JSON.stringify(handoff));
 }
});
test('handoff correctness cannot bypass errors, missing submission, signature or round identity',()=>{
 const{unit,claim}=fixture();for(const change of [{attempts:2},{firstCorrect:false},{checked:false},{correct:false},{selection:'["box","jane"]'},{runId:'old-round'},{questionId:'other-question'}]){
  const copy=structuredClone(claim);Object.assign(copy.states[0],change);assert.equal(validClaim(unit,'apply',copy),false);
 }
 for(const change of [{roundPolicy:'legacy'},{edition:'legacy'},{contentSignature:'invalid'},{index:0}])assert.equal(validClaim(unit,'apply',{...claim,...change}),false);
});
test('undeclared handoff candidates and other unsupported types stay rejected',()=>{
 const{unit,claim}=fixture();for(const change of [{objects:[]},{recipients:[]},{objects:null},{recipients:null},{type:'future-task'}]){
  const copy=structuredClone(unit);Object.assign(copy.questions.apply[0],change);const current={...claim,contentSignature:JSON.stringify([1,copy.questions.apply])};assert.equal(validClaim(copy,'apply',current),false);
 }
});
