(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
const assets='/assets/unit29-30/';
function storyProps(){
 const element=node('div','desk-world');element.setAttribute('role','group');element.setAttribute('aria-label','琼斯太太与艾米在卧室里谈整理任务');element.dataset.taskState='instructions';
 const scene=node('div','room-scene'),furniture=node('div','room-furniture'),picture=node('picture'),mobile=node('source'),room=node('img','room-image');mobile.media='(max-width:600px)';mobile.srcset=assets+'bedroom-stage-mobile.svg';room.src=assets+'bedroom-stage.svg';room.alt='窗户关着，衣服还在未整理的床上，梳妆台有灰尘，地面有纸屑';picture.append(mobile,room);furniture.append(picture);scene.append(furniture);
 const cast=node('div','desk-cast'),portraits={};
 for(const[id,name]of [['Jones','琼斯太太'],['Amy','艾米']]){const actor=node('div','dialogue-actor '+id),image=node('img','cast-image');actor.dataset.actor=id;portraits[id]=image;actor.append(image,node('span','actor-label',name));cast.append(actor);}scene.append(cast);element.append(node('p','desk-location','卧室里'),scene);
 const targets=['door','door','room','question','window','clothes','bed','dresser','floor'];
 let index=-1;const desktop={door:[2,10,12,73],window:[19,8,17,36],clothes:[53,49,7,20],bed:[39,37,32,48],dresser:[19,29,18,54],floor:[62,85,17,12]};const phone={door:[2,6,16,57],window:[21,4,28,29],clothes:[46,57,10,16],bed:[28,46,45,38],dresser:[4,47,24,44],floor:[67,85,24,12]};
 function draw(){const target=targets[index]||'room';element.dataset.focus=target;furniture.querySelectorAll('.room-focus').forEach(e=>e.remove());const pos=(matchMedia('(max-width:600px)').matches?phone:desktop)[target];if(pos){const box=node('span','room-focus');box.setAttribute('aria-hidden','true');const[x,y,w,h]=pos;Object.assign(box.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});furniture.append(box);}}
 addEventListener('resize',draw);return{element,update(i){index=i;portraits.Jones.src=assets+(i>=2&&i!==3?'cast-jones-point-v1.webp':'cast-jones-welcome-v1.webp');portraits.Jones.alt=i>=2&&i!==3?'琼斯太太面向艾米说明任务':'琼斯太太面向艾米';portraits.Amy.src=assets+(i===3?'cast-amy-ask-v1.webp':'cast-amy-v1.webp');portraits.Amy.alt=i===3?'艾米一手握着扫帚，一手向琼斯太太示意提问':'艾米面向琼斯太太，握着一把扫帚';draw();}};
}
function restyle(element){for(const img of element.querySelectorAll('img')){const id=(img.getAttribute('src')||'').match(/\/assets\/unit29-30\/(Jones|Amy)\.svg$/)?.[1];if(id)img.src=assets+(id==='Jones'?'cast-jones-point-v1.webp':'cast-amy-v1.webp');}}
function create({element}){let status,heading;return{
 present(question,progress){element.classList.add('desk-runner');const content=element.querySelector('.practice-content'),intro=node('div','desk-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','desk-task-status','读清任务，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},
 answer(value){status.textContent=value===null?'读清任务，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.desk-intro .practice-progress')||heading;}
};}
core.unit2930Scene={storyProps,restyle,create};
})(globalThis.CanranCore);
