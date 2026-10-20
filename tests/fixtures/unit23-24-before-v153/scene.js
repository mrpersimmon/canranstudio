(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
const assets='/assets/unit23-24/';
function storyProps(){
 const element=node('div','desk-world');element.setAttribute('role','group');element.setAttribute('aria-label','男士和简在房间里确认并交接玻璃杯');
 const scene=node('div','room-scene'),furniture=node('div','room-furniture');
 // A single shelf set leaves the surface at line five. The table set stays.
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 400 400');svg.setAttribute('role','img');svg.setAttribute('aria-label','桌面和搁板上的两组玻璃杯');
 const cups=(x,y,cls)=>`<g class="${cls}" transform="translate(${x} ${y})">${[0,40,80].map(dx=>`<g transform="translate(${dx} 0)"><path d="M0 0H30L27 42H3Z" fill="#D8EFE9"/><ellipse cx="15" cy="0" rx="15" ry="4" fill="#F5FFFA"/><path d="M8 9V30" stroke="#FFF" stroke-width="4"/></g>`).join('')}<path d="M-10 42H120L116 52H-6Z" fill="#FFF2D7"/></g>`;
 svg.innerHTML=`<g stroke="#603F2E" stroke-width="3" stroke-linejoin="round"><path d="M144 276V366M258 276V366" stroke-width="7"/><rect x="130" y="264" width="142" height="12" rx="4" fill="#CBAF82"/><path d="M142 120H267V130H142Z" fill="#CBAF82"/><path d="M154 130V150L177 130M254 130V150L231 130" fill="#CBAF82"/><g transform="translate(152 225) scale(.75)">${cups(0,0,'table-set')}</g><g transform="translate(157 81) scale(.75)">${cups(0,0,'shelf-set')}</g></g>`;
 furniture.append(svg);scene.append(furniture);
 const cast=node('div','desk-cast'),pictures={};
 for(const[id,name]of [['man','男士'],['jane','简（Jane）']]){const actor=node('div','dialogue-actor '+id),picture=node('img','cast-image');actor.dataset.actor=id;pictures[id]=picture;actor.append(picture,node('span','actor-label',name));cast.append(actor);}
 scene.append(cast);element.append(node('p','desk-location','房间里'),scene);
 return{element,update(index){const phase=index<2?'ready':index<3?'table':index<4?'shelf':index<6?'holding':'received';element.dataset.phase=phase;
  const shelf=svg.querySelector('.shelf-set');shelf.style.display=index<4?'':'none';
  svg.querySelector('.table-set').classList.toggle('is-focus',index===2);shelf.classList.toggle('is-focus',index===3);
  svg.setAttribute('aria-label',index<4?'桌面和墙上搁板上各放着一组玻璃杯':'桌面上的一组玻璃杯仍在，搁板上的那组已经取走');
  for(const id of ['man','jane']){const holding=id==='jane'?index>=4&&index<6:index>=6;pictures[id].src=assets+'cast-'+id+(holding?'-tray':'')+'-v1.webp';pictures[id].alt=(id==='man'?'男士':'简')+(holding?'双手托着刚从搁板取下的一组玻璃杯':'双手空着，面向对方');pictures[id].dataset.holding=String(holding);}
 }};
}
function restyle(element){for(const picture of element.querySelectorAll('.source-speaker img')){const name=(picture.getAttribute('src')||'').match(/\/assets\/unit23-24\/(man|jane)\.svg(?:\?.*)?$/)?.[1];if(name)picture.src=assets+'cast-'+name+'-v1.webp';}}
function create({element}){let status,heading;return{
 present(question,progress){element.classList.add('desk-runner');const content=element.querySelector('.practice-content'),intro=node('div','desk-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','desk-task-status','读清要求，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},
 answer(value){status.textContent=value===null?'读清要求，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.desk-intro .practice-progress')||heading;}
};}
core.unit2324Scene={storyProps,create,restyle};
})(globalThis.CanranCore);
