(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
const assets='/assets/unit35-36/';
function storyProps(){
 const element=node('div','desk-world');element.setAttribute('role','group');element.setAttribute('aria-label','三张村庄照片');
 const scene=node('div','room-scene'),furniture=node('div','room-furniture'),image=node('img','room-image');
 const photographs=[['photo-village-v1.webp','村庄在两座小山之间的谷地，房屋建在河边陆地上'],['photo-river-v1.webp','夫妻在照片左侧沿河岸走，男孩在水中横渡河流'],['photo-school-v1.webp','学校在左、公园在右，一些孩子走出校舍，其中一些走进公园']];
 furniture.append(image);scene.append(furniture);const label=node('p','desk-location');element.append(label,scene);
 function update(index){const photo=index<4?0:index<9?1:2;image.src=assets+photographs[photo][0];image.alt=photographs[photo][1];label.textContent='照片 '+(photo+1)+' / 3';element.dataset.readingLine=String(index+1);element.dataset.photo=String(photo+1);}
 update(-1);return{element,update};
}
function restyle(){}
function create({element}){let status,heading;return{
 present(question,progress){element.classList.add('desk-runner');const content=element.querySelector('.practice-content'),intro=node('div','desk-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','desk-task-status','看清材料，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},
 answer(value){status.textContent=value===null?'看清材料，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.desk-intro .practice-progress')||heading;}
};}
core.unit3536Scene={storyProps,restyle,create};
})(globalThis.CanranCore);
