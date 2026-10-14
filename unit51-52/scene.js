(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
const image=(name,cls='',alt='',format='svg')=>{const el=node('img',cls);el.src='/assets/unit51-52/'+name+'.'+format;el.alt=alt;return el;};
function world({application=false}={}){
 const element=node('div','climate-world');element.setAttribute('role','group');element.setAttribute('aria-label',application?'旅行明信片桌':'Hans和Dimitri的四季相册');
 for(const [who,label]of [['hans','Hans'],['dimitri','Dimitri']]){const person=node('div','climate-actor dialogue-actor actor-'+who);person.dataset.actor=who;person.append(image(who,'','', 'webp'),node('span','',label));element.append(person);}
 const location=node('p','climate-location',application?'旅行明信片桌':'Dimitri 的四季相册');
 const album=image('album-all','climate-album','相册中的四季图画'),label=node('p','climate-album-label','四季相册');
 element.append(image('table','climate-table'),album,label,location);
 function show(page='all',sent=false){element.dataset.season=page;element.dataset.sent=String(sent);const file=sent?'postcard':page==='all'?'album-all':'album-'+page;if(album.dataset.file!==file){album.src='/assets/unit51-52/'+file+'.svg';album.dataset.file=file;}
 label.textContent=sent?'明信片准备好了':({all:'四季相册',spring:'春 · March–May',summer:'夏 · June–August',autumn:'秋 · September–November',winter:'冬 · December–February'})[page];album.alt=sent?'完成的旅行明信片':'相册页：'+label.textContent;
 }
 show();return {element,show};
}
function storyProps(){const view=world();return{element:view.element,update(i){view.show(i>=10?'winter':i>=8?'autumn':i>=6?'summer':i>=4?'spring':'all');}};}
function create({element}){let view,heading,beat;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('climate-runner');const content=element.querySelector('.practice-content'),intro=node('div','climate-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress);
 if(question.workshop?.model){const demo=node('aside','grammar-model climate-model');demo.setAttribute('role','region');demo.setAttribute('aria-label','短示范');for(const[en,cn]of question.workshop.model.lines){const row=node('div','grammar-model-line'),p=node('p','',en);p.lang='en';row.append(p,node('small','',cn));demo.append(row);}intro.append(demo);}
 intro.append(heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
 view=world({application:true});view.element.classList.add('climate-application');beat=question.id.replace('u5152-v1-a-','');view.element.dataset.task=beat;view.element.dataset.confirmed='false';intro.append(view.element);content.prepend(intro);},
 answer(value){view.element.dataset.confirmed=String(value!==null);view.show(value!==null&&beat==='climate'?'winter':'all',value!==null&&beat==='send');},finish(){},completion(){return null;},heading(){return element.querySelector('.climate-intro .practice-progress')||heading;}
};}
core.unit5152Scene={storyProps,create};
})(globalThis.CanranCore);
