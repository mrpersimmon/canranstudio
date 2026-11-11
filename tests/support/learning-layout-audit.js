'use strict';

// Run in the real page. DOM boxes can be valid while their text paints outside
// them (the four-character role name in a 32px column is one such regression).
function inspectLearningLayout(root){
 const issues=[];
 const shown=el=>el&&el.getClientRects().length&&!el.closest('[hidden]')&&getComputedStyle(el).visibility!=='hidden'&&!el.closest('.is-placed');
 function textBoxes(el){
  const boxes=[],walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){
   if(!node.textContent.trim()||!shown(node.parentElement))continue;
   const range=document.createRange();range.selectNodeContents(node);
   for(const r of range.getClientRects())if(r.width>0&&r.height>0)boxes.push(r);
  }
  return boxes;
 }
 for(const row of root.querySelectorAll('.task-reading-turn')){
  if(!shown(row))continue;const name=row.querySelector('small'),text=row.querySelector('span');if(!name||!text)continue;
  const names=textBoxes(name),lines=textBoxes(text),gap=8;
  if(names.some(a=>lines.some(b=>Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1&&a.right+gap>b.left+1)))issues.push({type:'speaker-overlap',name:name.textContent,text:text.textContent});
 }
 const content=root.querySelector('.practice-content'),options=content?.querySelector('.practice-options');
 for(const meter of root.querySelectorAll('.practice-meter')){
  if(!shown(meter))continue;const b=meter.getBoundingClientRect();
  for(const step of meter.querySelectorAll('.practice-step')){
   if(!shown(step))continue;const r=step.getBoundingClientRect();
   if(r.left<b.left-1||r.right>b.right+1||r.top<b.top-1||r.bottom>b.bottom+1)issues.push({type:'progress-step-outside-meter',meter:b.toJSON(),step:r.toJSON()});
  }
 }
 if(shown(content)&&shown(options)){
  const spare=content.getBoundingClientRect().bottom-options.getBoundingClientRect().bottom;
  for(const material of content.querySelectorAll('.task-reading')){
   if(!shown(material))continue;const clipped=material.scrollHeight-material.clientHeight;
   if(clipped>2&&spare>clipped+8)issues.push({type:'unnecessary-reading-scroll',clipped,spare,text:material.innerText});
  }
 }
 const selectors='.opt-btn,.practice-submit-row>.btn,.completion-stat-label,.completion-stat-value,.station-destination,.practice-answer-note,.cloakroom-actor>span,.classroom-person>span,.application-figure figcaption,.grammar-cast figcaption,.source-speaker,.handoff-label,.practice-content h3';
 for(const el of [...(root.matches(selectors)?[root]:[]),...root.querySelectorAll(selectors)]){
  if(!shown(el))continue;const b=el.getBoundingClientRect();
  const outside=textBoxes(el).filter(r=>r.left<b.left-1||r.right>b.right+1||r.top<b.top-1||r.bottom>b.bottom+1);
  if(outside.length)issues.push({type:'text-outside-own-box',class:el.className,text:el.textContent.trim(),box:b.toJSON(),ink:outside.map(r=>r.toJSON())});
 }
 for(const row of root.querySelectorAll('.practice-submit-row,.practice-finish-actions')){
  if(!shown(row))continue;const controls=[...row.querySelectorAll('button')].filter(shown);
  for(let i=0;i<controls.length;i++)for(let j=i+1;j<controls.length;j++){
   const a=controls[i].getBoundingClientRect(),b=controls[j].getBoundingClientRect();
   if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)issues.push({type:'actions-overlap',texts:[controls[i].textContent,controls[j].textContent]});
  }
  const note=row.closest('.practice-actions')?.querySelector('.practice-answer-note');
  if(shown(note)&&note.getBoundingClientRect().bottom>row.getBoundingClientRect().top+1)issues.push({type:'feedback-over-actions'});
 }
 for(const figure of root.querySelectorAll('.application-figure,.grammar-cast figure')){
  const label=figure.querySelector('figcaption'),pic=figure.querySelector('img');if(!shown(label)||!shown(pic))continue;
  const a=label.getBoundingClientRect(),b=pic.getBoundingClientRect();
  if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)issues.push({type:'caption-over-picture',text:label.textContent});
 }
 for(const intro of root.querySelectorAll('.grammar-intro')){
  const heading=intro.querySelector('.learning-question-heading')||intro.querySelector('h3');if(!shown(heading))continue;
  const letters=textBoxes(heading),pictures=[...intro.querySelectorAll('.application-figure img,.grammar-cast img')].filter(shown).map(im=>im.getBoundingClientRect());
  if(letters.some(a=>pictures.some(b=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)))issues.push({type:'heading-over-picture',text:heading.textContent});
 }
 return issues;
}
module.exports={inspectLearningLayout};
