(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};const assets='/assets/unit37-38/';
function storyProps(){
 const element=node('div','desk-world');element.setAttribute('role','group');element.setAttribute('aria-label','George和Dan的小工坊');
 const scene=node('div','room-scene'),furniture=node('div','room-furniture'),image=node('img','room-image'),names=node('div','workshop-names');names.append(node('span','','George'),node('span','','Dan'));furniture.append(image);scene.append(furniture,names);element.append(node('p','desk-location','小工坊'),scene);
 const photos={ready:['workshop-ready-v1.webp','George在左、Dan在右，两把大小不同的锤子都在桌上，书架保持木色'],small:['workshop-small-v1.webp','Dan拿着小锤询问，George没有接过，大锤仍在桌上'],delivered:['workshop-delivered-v1.webp','George已拿到大锤，Dan双手空着，小锤留在桌上，书架仍未涂色'],plan:['workshop-plan-v1.webp','George拿着大锤，桌上仅小锤，旁边漆罐显示粉色，书架仍是木色']};
 function update(i){const pose=i===5||i===6?'small':i>=13?'plan':i>=8?'delivered':'ready';image.src=assets+photos[pose][0];image.alt=photos[pose][1];element.dataset.pose=pose;element.dataset.speaker=i<0?'':core.unit3738.learning.DIALOGUE[i].person;element.dataset.readingLine=String(i+1);element.dataset.smallOwner=pose==='small'?'dan':'bench';element.dataset.bigOwner=i>=8?'george':'bench';element.dataset.bookcase='unpainted';}
 update(-1);return{element,update};
}
function restyle(element){for(const img of element.querySelectorAll('.handoff-cast img,.source-speaker img')){const id=(img.getAttribute('src')||'').match(/\/(george|dan)(?:-receive)?\.svg(?:\?.*)?$/)?.[1];if(id)img.src=assets+'cast-'+id+'-v1.webp';}}
function create({element}){let status,heading;return{present(question,progress){element.classList.add('desk-runner');const content=element.querySelector('.practice-content'),intro=node('div','desk-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','desk-task-status','看清材料，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},answer(value){status.textContent=value===null?'看清材料，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.desk-intro .practice-progress')||heading;}};}
core.unit3738Scene={storyProps,restyle,create};
})(globalThis.CanranCore);
