(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
const assets='/assets/unit21-22/';
function storyProps(){
 const element=node('div','desk-world');element.setAttribute('role','group');element.setAttribute('aria-label','男士与简在书桌旁确认和交接书本');
 const cast=node('div','desk-cast'),picture=node('img','cast-image family-image'),labels=node('div','desk-labels');
 for(const[id,name]of [['man','男士'],['jane','简（Jane）']]){const actor=node('div','dialogue-actor '+id);actor.dataset.actor=id;actor.append(node('span','actor-label',name));labels.append(actor);}
 cast.append(picture,labels);element.append(node('p','desk-location','书桌旁'),cast);
 return{element,update(index){const phase=index<2?'ready':index<4?'first':index<6?'red':'received';element.dataset.phase=phase;picture.src=assets+'cast-'+phase+'-v1.webp';picture.alt={ready:'男士和简双手空着，桌上放着两本书',first:'简拿起一本浅色书，红书仍在桌上',red:'简拿着红书向男士确认，浅色书已放回桌上',received:'红书在男士手中，简双手空着，浅色书留在桌上'}[phase];}};
}
function restyle(element){
 // Presentation-only mapping: keep original question signatures and legacy art.
 for(const picture of element.querySelectorAll('.source-speaker img,.handoff-cast img')){
  const name=(picture.getAttribute('src')||'').match(/\/assets\/unit21-22\/(man(?:-waiting)?|jane)\.svg(?:\?.*)?$/)?.[1];
  if(name)picture.src=assets+(name.startsWith('man')?'cast-man-v1.webp':'cast-jane-v1.webp');
 }
}
function create({element}){let status,heading;return{
 present(question,progress){element.classList.add('desk-runner');const content=element.querySelector('.practice-content'),intro=node('div','desk-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','desk-task-status','选好表达，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},
 answer(value){status.textContent=value===null?'选好表达，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.desk-intro .practice-progress')||heading;}
};}
core.unit2122Scene={storyProps,create,restyle};
})(globalThis.CanranCore);
