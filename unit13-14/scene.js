(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function storyProps(){
 const element=node('div','colour-world');element.setAttribute('role','group');element.setAttribute('aria-label','Louise和Anna看新衣');
 const cast=node('div','colour-cast'),location=node('p','colour-location','Anna家');
 const descriptions={arrival:'Louise倾听，Anna面向她发出邀请',dress:'Anna拿出绿色连衣裙，Louise欣赏它',reveal:'Anna展示绿色连衣裙与同色花帽',wear:'Anna戴上绿色花帽并拿着绿色连衣裙，Louise赞赏'};
 for(const pose of Object.keys(descriptions)){const img=node('img','cast-image '+pose);img.src='/assets/unit13-14/cast-'+pose+'-v1.webp';img.alt=descriptions[pose];cast.append(img);}
 for(const [who,name]of [['louise','Louise'],['anna','Anna']]){const actor=node('div','dialogue-actor');actor.dataset.actor=who;actor.append(node('span','actor-label',name));cast.append(actor);}
 element.append(location,cast);
 return{element,update(i){const pose=i<5?'arrival':i<10?'dress':i<12?'reveal':'wear';cast.dataset.pose=pose;location.textContent=i<4?'Anna家':'楼上的房间';for(const img of cast.querySelectorAll('.cast-image'))img.hidden=!img.classList.contains(pose);}};
}
function create({element}){let status,heading;return{present(question,progress){element.classList.add('colour-runner');const content=element.querySelector('.practice-content'),intro=node('div','colour-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);
 // The retained picture question used a separate scene renderer in the old
 // version. Keep its exact question signature while restoring the visible art.
 if(question.id==='u1314-v1-two-colours'){const picture=node('img','task-evidence-image');picture.src='/assets/unit13-14/hat-grey-black.svg';picture.alt='一顶灰色帽子，带黑色帽带';intro.append(picture);}
 status=node('p','colour-task-status','选好表达，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},answer(value){status.textContent=value===null?'选好表达，再检查。':'这句表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.colour-intro .practice-progress')||heading;}};}
core.unit1314Scene={storyProps,create};
})(globalThis.CanranCore);
