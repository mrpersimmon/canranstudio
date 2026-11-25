'use strict';
// Exercises the existing controls; this helper never writes a result or progress.
async function choose(room,q){
 if(q.type==='scene-find'){
  await room.locator('.scene-find-canvas').getByRole('button',{name:q.spots.find(s=>s.id===q.answer).name,exact:true}).click();
 }else if(q.type==='handoff'){
  const [object,recipient]=JSON.parse(q.answer);
  await room.locator('.handoff-objects').getByRole('button',{name:q.objects.find(item=>item.id===object).name,exact:true}).click();
  await room.locator('.handoff-people').getByRole('button',{name:q.recipients.find(item=>item.id===recipient).name,exact:true}).click();
 }else if(q.type==='match'){
  const order=JSON.parse(q.answer);
  for(let i=0;i<order.length;i++){await room.locator('.match-column:not(.match-meanings) .opt-btn').nth(i).click();await room.locator('.match-meanings [data-pair="'+order[i]+'"]').click();}
 }else if(q.type==='cloze')for(const [i,value]of JSON.parse(q.answer).entries())await room.locator('.cloze-row').nth(i).getByRole('button',{name:value,exact:true}).click();
 else if(q.tokens){
  let prefix='';const used=new Set();
  while(prefix!==q.answer){const at=q.tokens.findIndex((value,i)=>!used.has(i)&&(q.answer===prefix+value||q.answer.startsWith(prefix+value+' ')));if(at<0)throw Error('Missing token '+q.id);await room.locator('.wordbank').getByRole('button',{name:q.tokens[at],exact:true,disabled:false}).first().click();used.add(at);prefix+=q.tokens[at];if(prefix!==q.answer)prefix+=' ';}
 }else await room.locator('.practice-options').getByRole('button',{name:q.answer,exact:true}).click();
}
module.exports={choose};
