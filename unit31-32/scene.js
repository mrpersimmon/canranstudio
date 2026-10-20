(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
const assets='/assets/unit31-32/';
function storyProps(){
 const element=node('div','desk-world');element.setAttribute('role','group');element.setAttribute('aria-label','琼与杰克观察花园');
 const scene=node('div','room-scene'),furniture=node('div','room-furniture'),room=node('img','room-image');room.src=assets+'garden-story-v1.webp';room.alt='萨莉坐在树下，蒂姆握着树干攀爬，狗在猫后面向右跑过草地';furniture.append(room);scene.append(furniture);
 const cast=node('div','desk-cast');for(const[id,name,file]of [['Jean','琼','cast-jean-v1.webp'],['Jack','杰克','cast-jack-v1.webp']]){const actor=node('div','dialogue-actor '+id),img=node('img','cast-image');actor.dataset.actor=id;img.src=assets+file;img.alt=id==='Jean'?'琼面向杰克提问':'杰克面向琼回应';actor.append(img,node('span','actor-label',name));cast.append(actor);}scene.append(cast);element.append(node('p','desk-location','花园里'),scene);
 return{element,update(index){element.dataset.speaker=index<0?'':core.unit3132.learning.DIALOGUE[index].person;}};
}
function restyle(element){for(const img of element.querySelectorAll('img')){const id=(img.getAttribute('src')||'').match(/\/assets\/unit31-32\/(Jean|Jack)\.svg$/)?.[1];if(id)img.src=assets+(id==='Jean'?'cast-jean-v1.webp':'cast-jack-v1.webp');}}
function create({element}){let status,heading;return{
 present(question,progress){element.classList.add('desk-runner');const content=element.querySelector('.practice-content'),intro=node('div','desk-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','desk-task-status','看清材料，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},
 answer(value){status.textContent=value===null?'看清材料，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.desk-intro .practice-progress')||heading;}
};}
core.unit3132Scene={storyProps,restyle,create};
})(globalThis.CanranCore);
