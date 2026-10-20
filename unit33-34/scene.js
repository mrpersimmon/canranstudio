(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
const assets='/assets/unit33-34/';
function storyProps(){
 const element=node('div','desk-world');element.setAttribute('role','group');element.setAttribute('aria-label','琼斯一家的河畔故事');
 const scene=node('div','room-scene'),furniture=node('div','room-furniture'),picture=node('picture'),mobile=node('source'),image=node('img','room-image');mobile.media='(max-width:600px)';mobile.srcset=assets+'river-story-mobile-v1.webp';image.src=assets+'river-story-v1.webp';image.alt='琼斯一家在桥面上，轮船从桥下通过，两艘小船在河面，飞机在河流上空；天空有白云和阳光';picture.append(mobile,image);furniture.append(picture);scene.append(furniture);element.append(node('p','desk-location','河畔'),scene);
 return{element,update(index){element.dataset.readingLine=String(index+1);}};
}
function restyle(){}
function create({element}){let status,heading;return{
 present(question,progress){element.classList.add('desk-runner');const content=element.querySelector('.practice-content'),intro=node('div','desk-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','desk-task-status','看清材料，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},
 answer(value){status.textContent=value===null?'看清材料，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.desk-intro .practice-progress')||heading;}
};}
core.unit3334Scene={storyProps,restyle,create};
})(globalThis.CanranCore);
