(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function storyProps(){
 const element=node('div','desk-world');element.setAttribute('role','group');element.setAttribute('aria-label','史密斯太太的客厅');
 const frame=node('div','living-room-picture'),picture=node('picture'),mobile=node('source'),image=node('img','room-image');
 mobile.media='(max-width:600px)';mobile.srcset='/assets/unit27-28/living-room-mobile-v1.webp';image.src='/assets/unit27-28/living-room-v1.webp';image.alt='门旁的音响上有三本书，窗旁的电视机上有两本杂志，两把扶手椅靠近放着两份报纸的桌子，墙上有两幅画';picture.append(mobile,image);frame.append(picture);element.append(node('p','desk-location','史密斯太太的客厅'),frame);
 const desktop={television:[[80,30,20,32]],magazines:[[84,30,14,7]],table:[[31,58,37,33]],newspapers:[[39,60,24,14]],armchairs:[[1,46,31,43],[68,54,30,42]],stereo:[[21,29,23,25]],books:[[25,29,8,10]],pictures:[[26,11,15,17],[45,15,11,15]]};
 const phone={television:[[76,34,24,24]],magazines:[[82,34,15,4]],table:[[32,60,36,26]],newspapers:[[38,61,25,11]],armchairs:[[1,51,32,33],[67,56,32,34]],stereo:[[20,33,28,20]],books:[[24,33,10,8]],pictures:[[24,16,18,15],[44,19,13,13]]};
 const targets=['room','television','television','magazines','table','newspapers','armchairs','armchairs','stereo','stereo','books','pictures','pictures'];
 let index=-1;function draw(){const target=targets[index]||'room';element.dataset.focus=target;frame.querySelectorAll('.living-room-focus').forEach(e=>e.remove());for(const[x,y,w,h]of(matchMedia('(max-width:600px)').matches?phone:desktop)[target]||[]){const focus=node('span','living-room-focus');focus.setAttribute('aria-hidden','true');Object.assign(focus.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});frame.append(focus);}}
 addEventListener('resize',draw);return{element,update(i){index=i;draw();}};
}
function create({element}){let status,heading;return{
 present(question,progress){element.classList.add('desk-runner');const content=element.querySelector('.practice-content'),intro=node('div','desk-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','desk-task-status','读清情况，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},
 answer(value){status.textContent=value===null?'读清情况，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.desk-intro .practice-progress')||heading;}
};}
core.unit2728Scene={storyProps,restyle(){},create};
})(globalThis.CanranCore);
