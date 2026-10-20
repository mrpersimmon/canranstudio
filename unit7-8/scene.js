(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function storyProps(){
 const element=node('div','interview-world');element.setAttribute('role','group');element.setAttribute('aria-label','Robert和Sophie的会客角');
 const cast=node('div','interview-cast');
 for(const pose of ['robert','sophie']){const img=node('img','cast-image '+pose);img.src='/assets/unit7-8/cast-'+pose+'-v1.webp';img.alt=pose==='robert'?'Robert面向Sophie，抬手交谈':'Sophie面向Robert，抬手交谈';cast.append(img);}
 for(const [who,name] of [['robert','Robert'],['sophie','Sophie']]){const actor=node('div','dialogue-actor');actor.dataset.actor=who;actor.append(node('span','actor-label',name));cast.append(actor);}
 element.append(node('p','interview-location','会客角'),cast);
 return{element,update(i){const who=core.unit78.learning.DIALOGUE[i]?.person||'robert';cast.dataset.pose=who;for(const img of cast.querySelectorAll('.cast-image'))img.hidden=!img.classList.contains(who);}};
}
function create({element}){let status,heading;return{present(question,progress){element.classList.add('interview-runner');const content=element.querySelector('.practice-content'),intro=node('div','interview-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','interview-task-status','选择合适的问法，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},answer(value){status.textContent=value===null?'选择合适的问法，再检查。':'这一轮问答已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.interview-intro .practice-progress')||heading;}};}
core.unit78Scene={storyProps,create};
})(globalThis.CanranCore);
