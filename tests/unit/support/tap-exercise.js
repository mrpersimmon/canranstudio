'use strict';
const exercises=require('../../../core/learning-exercises');
function answer(h,q,correct=true){
  for(const ref of q.listenRefs){h.send({type:'exercise-listen',id:ref,questionId:q.id});h.hear();}
  let r=h.view().response;
  // Toggle off an existing answer through the public controls.
  if(q.mechanism==='order'||q.mechanism==='multi')for(const id of [...r.selected])h.send({type:'exercise-select',id,questionId:q.id});
  const selected=correct?q.answer:q.mechanism==='order'?[...q.answer].reverse():[q.options.find(o=>!q.answer.includes(o.id)).id];
  for(const [left,right]of exercises.solution(q).pairs){h.send({type:'exercise-select',id:left,questionId:q.id});h.hear();h.send({type:'exercise-select',id:right,questionId:q.id});}
  for(const id of selected){if(!['order','multi'].includes(q.mechanism)&&h.view().response.selected.includes(id))continue;h.send({type:'exercise-select',id,questionId:q.id});}
}
module.exports={answer};
