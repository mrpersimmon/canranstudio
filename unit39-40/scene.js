(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};const assets='/assets/unit39-40/';
function storyProps(){
 const element=node('div','desk-world');element.setAttribute('role','group');element.setAttribute('aria-label','Sam和Penny的房间');
 const scene=node('div','room-scene'),furniture=node('div','room-furniture'),image=node('img','room-image'),names=node('div','workshop-names');names.append(node('span','','Sam'),node('span','','Penny'));furniture.append(image);scene.append(furniture,names);element.append(node('p','desk-location','房间里'),scene);
 const photos={penny:['vase-penny-v1.webp','Sam在左，Penny在右双手拿着完整花瓶，桌子、窗前和架上都未放花瓶'],sam:['vase-sam-v1.webp','Sam双手拿着完整花瓶，Penny双手空着，桌子、窗前和架上都未放花瓶'],shelf:['vase-shelf-v1.webp','花瓶放在右侧架子上，Sam和Penny双手空着，花和花瓶都完整']};
 function update(i){const pose=i>=10?'shelf':i>=4?'sam':'penny';image.src=assets+photos[pose][0];image.alt=photos[pose][1];element.dataset.pose=pose;element.dataset.speaker=i<0?'':core.unit3940.learning.DIALOGUE[i].person;element.dataset.readingLine=String(i+1);element.dataset.vaseOwner=pose;}
 update(-1);return{element,update};
}
function restyle(element){for(const img of element.querySelectorAll('.handoff-cast img,.source-speaker img')){const id=(img.getAttribute('src')||'').match(/\/(sam|penny)(?:-receive)?\.svg(?:\?.*)?$/)?.[1];if(id){img.src=assets+'cast-'+id+'-v1.webp';const host=img.closest('.handoff-person-art');if(host)host.dataset.person=id;}}}
function create({element}){let status,heading;return{present(question,progress){element.classList.add('desk-runner');const content=element.querySelector('.practice-content'),intro=node('div','desk-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','desk-task-status','看清材料，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},answer(value){status.textContent=value===null?'看清材料，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.desk-intro .practice-progress')||heading;}};}
core.unit3940Scene={storyProps,restyle,create};
})(globalThis.CanranCore);
