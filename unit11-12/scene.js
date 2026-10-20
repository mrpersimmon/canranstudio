(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function storyProps(){
 const element=node('div','claim-world');element.setAttribute('role','group');element.setAttribute('aria-label','老师、Dave和Tim的教室');
 const cast=node('div','claim-cast');
 const descriptions={asking:'老师拿着白衬衫询问，Dave和Tim看向老师',blue:'老师拿白衬衫，Dave展示蓝衬衫，Tim倾听',catch:'老师抛出白衬衫，Tim伸手准备接住，Dave拿着蓝衬衫',returned:'Tim拿着白衬衫向老师道谢，Dave拿着蓝衬衫'};
 for(const pose of Object.keys(descriptions)){const img=node('img','cast-image '+pose);img.src='/assets/unit11-12/cast-'+pose+'-v1.webp';img.alt=descriptions[pose];cast.append(img);}
 for(const [who,name] of [['teacher','老师'],['dave','Dave'],['tim','Tim']]){const actor=node('div','dialogue-actor');actor.dataset.actor=who;actor.append(node('span','actor-label',name));cast.append(actor);}
 element.append(node('p','claim-location','教室'),cast);
 return{element,update(i){const pose=i<4?'asking':i<14?'blue':i===14?'catch':'returned';cast.dataset.pose=pose;for(const img of cast.querySelectorAll('.cast-image'))img.hidden=!img.classList.contains(pose);}};
}
function create({element}){let status,heading;return{present(question,progress){element.classList.add('claim-runner');const content=element.querySelector('.practice-content'),intro=node('div','claim-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','claim-task-status','选好表达，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},answer(value){status.textContent=value===null?'选好表达，再检查。':'这句表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.claim-intro .practice-progress')||heading;}};}
core.unit1112Scene={storyProps,create};
})(globalThis.CanranCore);
