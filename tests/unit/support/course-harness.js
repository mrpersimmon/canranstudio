'use strict';
const assert=require('node:assert/strict');
const runtime=require('../../../core/learning-path-runtime');
const scene=require('../../../core/learning-path-scene');
const store=require('../../../core/learning-store');
const unit=require('../../../core/learning-course-catalog').getCourse();
function setup(options={}) {
  const adapter=options.adapter||store.createMemoryAdapter();
  const rt=runtime.createRuntime({unit,adapter,now:()=>new Date('2026-09-06T12:00:00'),random:()=>.37,...options});
  const view=rt.snapshot;
  const send=event=>{const v=rt.dispatch(event).view;assert.notEqual(v.screen,'blocked',JSON.stringify(event));assert.equal(v.saveState,null);assert.ok(runtime.validRecord(v.record,unit),JSON.stringify(event));assert.doesNotMatch(scene.createRenderer(unit).render(v),/src="(?:undefined)?"/);return v;};
  const hear=()=>{for(let i=0;view().audio?.status==='playing'&&i<25;i++){const a=view().audio;send({type:'audio-ended',requestId:a.requestId,index:a.index});}};
  function step(){const a=unit.activities[view().activityId];if(a.kind==='interactive-story'&&!view().storyRevealed)send({type:'story-start'});hear();
    if(a.kind==='teach')for(const item of a.items){send({type:'word-play',id:item.sourceRef});hear();}
    else if(a.kind==='match')for(const item of a.items){send({type:'match-word',id:item.sourceRef});send({type:'match-image',id:item.entityId});}
    else if(a.resultId){for(const id of a.answer)send({type:'select',id});send({type:'check'});hear();}
    send({type:'continue'});
  }
  function finish(id){send({type:'map'});send({type:'open-node',nodeId:id});let guard=0;while(view().screen==='activity'&&guard++<100)step();assert.equal(view().screen,'celebration',id);}
  function reach(id){for(const node of unit.nodes){send({type:'map'});send({type:'open-node',nodeId:node.id});let guard=0;while(view().screen==='activity'&&guard++<100){if(view().activityId===id)return;step();}}throw Error('Cannot reach '+id);}
  return {adapter,rt,view,send,hear,step,finish,reach};
}
module.exports={setup};
