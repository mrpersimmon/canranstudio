(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function storyProps(){
 const element=node('div','greeting-world');element.setAttribute('role','group');element.setAttribute('aria-label','Steven和Helen的街角');
 const cast=node('div','greeting-cast');
 for(const pose of ['talk','wave']){const img=node('img','cast-image '+pose);img.src='/assets/unit9-10/cast-'+pose+'-v1.webp';img.alt=pose==='talk'?'Steven面向Helen伸手交谈，Helen倾听':'Steven和Helen面向彼此挥手';cast.append(img);}
 for(const [who,name] of [['steven','Steven'],['helen','Helen']]){const actor=node('div','dialogue-actor');actor.dataset.actor=who;actor.append(node('span','actor-label',name));cast.append(actor);}
 element.append(node('p','greeting-location','街角'),cast);
 return{element,update(i){const who=i<2||i>=10?'wave':'talk';cast.dataset.pose=who;for(const img of cast.querySelectorAll('.cast-image'))img.hidden=!img.classList.contains(who);}};
}
function create({element}){let status,heading;return{present(question,progress){element.classList.add('greeting-runner');const content=element.querySelector('.practice-content'),intro=node('div','greeting-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','greeting-task-status','选好表达，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},answer(value){status.textContent=value===null?'选好表达，再检查。':'这句表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.greeting-intro .practice-progress')||heading;}};}
core.unit910Scene={storyProps,create};
})(globalThis.CanranCore);
