(function(core){
  'use strict';
  const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
  const image=(name,cls='',alt='')=>{const el=node('img',cls);el.src='/assets/unit45-46/'+name+'.svg';el.alt=alt;return el;};
  function world(){
    const element=node('div','office-world');element.setAttribute('role','group');element.setAttribute('aria-label','一封信在办公室里的旅程');
    const visual=node('div','office-visual');element.append(visual);
    const actors={},grips={},bodies={},labels={boss:'The boss',bob:'Bob',pamela:'Pamela'};
    for(const who of Object.keys(labels)){
      const actor=node('div','office-actor dialogue-actor actor-'+who);actor.dataset.actor=who;
      actors[who]=image(who,'office-figure');const body=node('div','office-person');bodies[who]=body;const grip=node('div','office-grip');grips[who]=image(who);grip.append(grips[who]);body.append(actors[who],grip);actor.append(body,node('span','office-name',labels[who]));visual.append(actor);
    }
    const label=node('p','office-location'),letter=image('letter','office-letter office-held','老板手里的信'),machine=image('typewriter','office-machine','打字机');
    const desk=node('div','office-desk-unit');desk.append(image('desk','office-desk'),image('tray','office-tray','空文件盘'),machine);visual.append(desk);element.append(label);
    function pose(who,name){if(actors[who].dataset.pose===name)return;actors[who].dataset.pose=name;actors[who].src='/assets/unit45-46/'+name+'.svg';grips[who].src=actors[who].src;}
    function show({room='boss',owner='boss',problem=false}={}){
      element.dataset.room=room;element.dataset.owner=owner;element.dataset.problem=String(problem);if(letter.parentNode!==bodies[owner])bodies[owner].append(letter);for(const[who,body]of Object.entries(bodies))body.dataset.holding=String(who===owner);
      actors.boss.closest('.office-actor').hidden=room!=='boss';actors.pamela.closest('.office-actor').hidden=room!=='pamela';machine.hidden=room!=='pamela';
      label.textContent=room==='boss'?'老板的办公室':'隔壁 · Pamela 的办公室';
      letter.alt=({boss:'老板手里的信',bob:'Bob正在递送的同一封信',pamela:'Pamela接到的同一封信'})[owner];
      pose('boss',owner==='boss'?'boss-read':'boss-point');pose('bob',owner==='bob'?'bob-read':'bob-point');pose('pamela',owner==='pamela'?(problem?'pamela-read':'pamela-hold'):'pamela');
    }
    show();return {element,show};
  }
  function storyProps(){
    const view=world();return {element:view.element,update(index){
      view.element.dataset.beat=index<5?'request':index<6?'take':index<8?'ask':index<12?'handoff':'problem';
      view.show({room:index<6?'boss':'pamela',owner:index<6?'boss':index<9?'bob':'pamela',problem:index>=12});
    }};
  }
  function create({element}){
    let view,heading,beat;
    const states={request:{},person:{owner:'bob'},handoff:{room:'pamela',owner:'bob'},problem:{room:'pamela',owner:'pamela'},help:{room:'pamela',owner:'pamela',problem:true}};
    return {
      present(question,progress){
        element.classList.remove('role-runner');element.classList.add('office-runner');
        const content=element.querySelector('.practice-content'),intro=node('div','office-intro');heading=node('h3','',question.display?.title||question.prompt);heading.tabIndex=-1;intro.append(progress,heading);
        const material=content.querySelector('.practice-context');if(material)intro.append(material);
        view=world();view.element.classList.add('office-application');beat=question.id.match(/-a-(request|person|handoff|problem|help)/)[1];
        view.element.dataset.task=beat;view.element.dataset.confirmed='false';view.show(states[beat]);intro.append(view.element);content.prepend(intro);
      },
      answer(value){
        if(value===null){view.element.dataset.confirmed='false';return;}
        view.element.dataset.confirmed='true';
        const next={request:'request',person:'handoff',handoff:'problem',problem:'help',help:'help'}[beat];view.show(states[next]);
      },
      finish(){},completion(){return null;},heading(){return heading;}
    };
  }
  core.unit4546Scene={storyProps,create};
})(globalThis.CanranCore);
