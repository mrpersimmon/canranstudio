/* Throwaway UI experiment: A framed card, B reward drawer, C floating keepsake.
 * No account reads, API requests, localStorage, or real award mutations. */
(() => {
  'use strict';
  if (!['127.0.0.1', 'localhost', '::1', '[::1]'].includes(location.hostname)) {
    document.body.textContent = '此页面仅供本地设计预览。';
    return;
  }
  const $ = selector => document.querySelector(selector);
  const assets = '/assets/awards/';
  const scenes = {
    first: { before:0, after:1, title:'第一颗星，点亮了！', copy:'单词寻宝 · 整轮零错', label:'第一颗星', earned:true, note:'这张纪念卡，开始收藏啦。' },
    earned: { before:2, after:3, title:'又点亮一颗星！', copy:'单词寻宝 · 整轮零错', label:'新获一星', earned:true, note:'' },
    full: { before:4, after:5, title:'五颗星，集齐啦！', copy:'五个挑战，都做到了整轮零错。', label:'首次五星', earned:true, note:'金边和第一次集齐的日子，会一直保留。' },
    upgrade: { before:0, after:0, title:'这一组已完成！', copy:'课程已升级，重新挑战，全对即可点亮星星！', label:'升级后续做', earned:false, note:'旧版纪念卡和学习记录都保留。' },
    retry: { before:2, after:2, title:'这一组已完成！', copy:'再挑战一轮，整轮零错就能点亮星星。', label:'错答后订正', earned:false, note:'这次学会的，已经记下了。' },
    already: { before:3, after:3, title:'这一组已完成！', copy:'这颗星已经点亮，继续下一站吧。', label:'本区已有星', earned:false, note:'' },
    pending: { before:2, after:2, title:'整轮零错！', copy:'学习记录已保留，联网同步后点亮星星。', label:'等待同步', earned:false, note:'现在也可以继续学习。' }
  };
  const variants = { A:'纪念卡登场', B:'底部奖励抽屉', C:'悬浮纪念卡' };
  const url = new URL(location.href);
  let variant = Object.hasOwn(variants,url.searchParams.get('variant')) ? url.searchParams.get('variant') : 'C';
  let scenario = Object.hasOwn(scenes,url.searchParams.get('case')) ? url.searchParams.get('case') : 'earned';
  let generation = 0, ready = false, phase = '准备中';
  const dialog = $('#rewardDialog'), stage = $('#rewardStage'), dock = $('#prototypeDock');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  $('#reduceMotion').checked = url.searchParams.get('motion')==='full'?false:url.searchParams.get('motion')==='reduced'?true:media.matches;
  $('#scenario').value = scenario;
  const node = (tag, cls, text) => { const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el; };
  const img = (src, cls, alt='') => { const el=node('img',cls);el.src=src;el.alt=alt;return el; };

  function stateOutput() {
    const current=scenes[scenario];
    $('#variantLabel').textContent=variant+' '+variants[variant]+(variant==='C'?' · 已选择':'');
    $('#demoState').textContent=`${current.label} · 已确认 ${current.before} → ${current.after} 星 · ${phase} · ${$('#reduceMotion').checked?'减少动态 · ':''}演示姓名与日期，不保存`;
  }
  function persistUrl() {
    const next=new URL(location.href);next.searchParams.set('variant',variant);next.searchParams.set('case',scenario);
    next.searchParams.set('motion',$('#reduceMotion').checked?'reduced':'full');
    history.replaceState(null,'',next);stateOutput();
  }
  function makeCard(count) {
    const wrap=node('div','card-wrap'), paper=node('article','story-award-paper');
    paper.dataset.stars=String(count);paper.setAttribute('aria-label','演示纪念卡：小小同学，礼貌小帮手');
    paper.append(node('p','story-award-brand','灿然英语工作室'),node('h3','story-award-title','礼貌小帮手'),node('p','story-award-name','小小同学'));
    const stars=node('div','story-award-stars');stars.setAttribute('role','group');stars.setAttribute('aria-label',`已获得 ${count} / 5 颗星`);
    for(let i=0;i<5;i++){
      const slot=node('span','award-star'), star=img(assets+(i<count?'star-earned.webp':'star-empty.webp'));
      slot.dataset.earned=String(i<count);slot.style.setProperty('--star-order',i);
      star.dataset.starIndex=String(i);slot.append(star,node('span','star-glint'));
      slot.setAttribute('aria-hidden','true');stars.append(slot);
    }
    paper.append(stars,img(assets+'unit1-2-handbag-closeup.webp','story-award-illustration','男士将手提包交还女士'));
    const foot=node('p','story-award-foot');foot.append(node('span','','Lesson 1–2'));
    const date=node('time','first-full-date','2026.10.10');date.hidden=count!==5;date.setAttribute('aria-label','演示首次满星日期：2026年10月10日');foot.append(date);paper.append(foot);
    const source=node('div','star-source');source.hidden=true;source.setAttribute('aria-hidden','true');source.append(img(assets+'star-earned.webp'));
    const rim=node('span','gold-light-ring');rim.setAttribute('aria-hidden','true');paper.append(rim);
    wrap.append(paper,source);return wrap;
  }
  function makeMessage() {
    const current=scenes[scenario], heading=node('h2','reward-heading',current.title), copy=node('p','reward-copy',current.copy);
    heading.id='rewardTitle';copy.id='rewardCopy';return [heading,copy];
  }
  function makeProgress() {
    const current=scenes[scenario], text=node('p','reward-progress');text.setAttribute('aria-live','polite');
    text.textContent=current.earned?`纪念卡上，已有 ${current.before} 颗星` : current.before===0?'新版纪念卡，等你来点亮':`纪念卡上，已有 ${current.before} 颗星`;
    return text;
  }
  function makeActions() {
    const group=node('div','reward-actions'), primary=node('button','btn btn-green primary-action'), secondary=node('button','btn secondary-action');
    if(scenario==='upgrade'||scenario==='retry') {
      primary.textContent=scenario==='upgrade'?'挑战新版':'再挑战一轮';secondary.textContent='先去下一站';
      primary.addEventListener('click',()=>leave('演示：开始完整的新一轮。正式接入后会回到本答题区第1题。'));
      secondary.addEventListener('click',()=>leave('演示：继续相遇小剧场；当前学习完成记录仍保留。'));
    } else {
      primary.textContent=scenario==='full'?'看看我的纪念卡':'继续冒险';secondary.textContent='留在这一页';
      primary.addEventListener('click',()=>scenario==='full'?showKeepsake():leave('演示：下一站是相遇小剧场。奖励已保留，动画不影响继续。'));
      secondary.addEventListener('click',()=>leave());
    }
    group.append(secondary,primary);return group;
  }
  function panelBase(cls) {
    const panel=node('section','reward-panel '+cls), dismiss=node('button','dismiss','×');
    dismiss.setAttribute('aria-label','关闭奖励弹窗');dismiss.addEventListener('click',()=>leave());panel.append(dismiss);return panel;
  }
  function VariantA() {
    const panel=panelBase('variant-a');panel.append(...makeMessage(),makeCard(scenes[scenario].before),makeProgress(),makeActions());
    if(scenes[scenario].note)panel.append(node('p','award-footnote',scenes[scenario].note));return panel;
  }
  function VariantB() {
    const panel=panelBase('variant-b'), message=node('div','reward-message');
    message.append(...makeMessage(),makeProgress(),makeActions());
    if(scenes[scenario].note)message.append(node('p','award-footnote',scenes[scenario].note));
    panel.append(message,makeCard(scenes[scenario].before));return panel;
  }
  function VariantC() {
    const panel=node('section','reward-panel variant-c');
    panel.append(makeCard(scenes[scenario].before));
    if(scenario==='upgrade'){
      const reminder=node('p','upgrade-reminder');reminder.id='upgradeReminder';
      // Keep the approved sentence intact; only wrap at a natural clause on phones.
      const split=scenes.upgrade.copy.lastIndexOf('，')+1;
      reminder.append(node('span','',scenes.upgrade.copy.slice(0,split)),node('span','',scenes.upgrade.copy.slice(split)));
      panel.append(reminder);
    }
    return panel;
  }
  function stopMotion() {
    generation++;
    dialog.dataset.motion='stopped';
    dialog.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    dialog.querySelectorAll('.travelling-star,.sparkle,.star-trail,.star-bloom').forEach(el=>el.remove());
  }
  function finishVisual() {
    const current=scenes[scenario], card=stage.querySelector('.story-award-paper');if(!card)return;
    card.dataset.stars=String(current.after);
    card.querySelectorAll('[data-star-index]').forEach((star,i)=>{
      star.src=assets+(i<current.after?'star-earned.webp':'star-empty.webp');star.parentElement.dataset.earned=String(i<current.after);
    });
    card.querySelector('.story-award-stars').setAttribute('aria-label',`已获得 ${current.after} / 5 颗星`);
    card.querySelector('.first-full-date').hidden=current.after!==5;
    const progress=stage.querySelector('.reward-progress');
    if(current.earned&&progress){progress.replaceChildren(node('strong','',current.after===5?'五颗星，全部点亮！':`第 ${current.after} 颗星，点亮啦！`));}
    $('#headerCount').textContent=`${current.after} / 5`;
    phase=current.earned?'已点亮':'无新增星';stateOutput();
  }
  async function playMotion() {
    const current=scenes[scenario], token=generation;
    if(!current.earned||$('#reduceMotion').checked){finishVisual();return;}
    const panel=stage.querySelector('.reward-panel');
    phase='卡片登场';stateOutput();
    await panel.animate([{opacity:0,transform:variant==='B'?'translateY(40px)':'translateY(10px) scale(.98)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'}).finished.catch(()=>{});
    if(token!==generation)return;
    const source=panel.querySelector('.star-source');source.hidden=false;
    const origin=source.getBoundingClientRect(), target=panel.querySelector(`[data-star-index="${current.after-1}"]`), dest=target.getBoundingClientRect();
    source.hidden=true;
    const fly=node('span','travelling-star');fly.append(img(assets+'star-earned.webp'),node('span','star-glint'));fly.setAttribute('aria-hidden','true');
    Object.assign(fly.style,{left:origin.x+'px',top:origin.y+'px',width:origin.width+'px',height:origin.height+'px'});dialog.append(fly);
    const dx=dest.x+dest.width/2-(origin.x+origin.width/2), dy=dest.y+dest.height/2-(origin.y+origin.height/2), scale=dest.width/origin.width;
    phase='星星落入卡片';stateOutput();
    const flight=[
      {opacity:0,transform:'translate(0, -15px) scale(.5) rotate(-15deg)'},
      {opacity:1,transform:'translate(0, -10px) scale(1.15) rotate(5deg)',offset:.25},
      {opacity:1,transform:`translate(${dx*.65}px, ${dy*.2-25}px) scale(.95) rotate(-7deg)`,offset:.6},
      {opacity:1,transform:`translate(${dx}px, ${dy}px) scale(${scale}) rotate(0deg)`}
    ];
    // A short, bounded dust trail follows the same arc. No per-frame timers.
    for(let i=0;i<6;i++){
      const trail=node('span','star-trail');trail.setAttribute('aria-hidden','true');
      Object.assign(trail.style,{left:(origin.x+origin.width/2-4)+'px',top:(origin.y+origin.height/2-4)+'px'});dialog.append(trail);
      trail.animate([
        {opacity:0,transform:'translate(0,-10px) scale(.2)'},
        {opacity:.8,transform:'translate(0,-10px) scale(1)',offset:.25},
        {opacity:.65,transform:`translate(${dx*.65+i*2}px,${dy*.2-25+i*2}px) scale(.8)`,offset:.6},
        {opacity:0,transform:`translate(${dx}px,${dy}px) scale(.1)`}
      ],{duration:1060,delay:i*42,easing:'cubic-bezier(.22,.7,.28,1)',fill:'both'}).finished.then(()=>trail.remove()).catch(()=>trail.remove());
    }
    await fly.animate(flight,{duration:1060,easing:'cubic-bezier(.22,.7,.28,1)',fill:'forwards'}).finished.catch(()=>{});
    if(token!==generation)return;
    fly.remove();finishVisual();
    target.parentElement.animate([{transform:'scale(.7)'},{transform:'scale(1.3)',offset:.48},{transform:'scale(1)'}],{duration:540,easing:'ease-out'});
    const bloom=node('span','star-bloom');bloom.setAttribute('aria-hidden','true');
    Object.assign(bloom.style,{left:(dest.x+dest.width/2-45)+'px',top:(dest.y+dest.height/2-45)+'px'});dialog.append(bloom);
    bloom.animate([{opacity:0,transform:'scale(.25)'},{opacity:.9,transform:'scale(.7)',offset:.18},{opacity:0,transform:'scale(1.35)'}],{duration:720,easing:'ease-out'}).finished.then(()=>bloom.remove()).catch(()=>bloom.remove());
    for(let i=0;i<12;i++){
      const spark=node('span','sparkle'), angle=(Math.PI*2*i)/12, reach=i%2?42:62;
      spark.setAttribute('aria-hidden','true');
      Object.assign(spark.style,{left:(dest.x+dest.width/2-5)+'px',top:(dest.y+dest.height/2-5)+'px'});dialog.append(spark);
      spark.animate([{opacity:1,transform:'translate(0,0) scale(.4)'},{opacity:.8,transform:`translate(${Math.cos(angle)*reach*.5}px,${Math.sin(angle)*reach*.5}px) scale(${i%2?.5:1})`,offset:.4},{opacity:0,transform:`translate(${Math.cos(angle)*reach}px,${Math.sin(angle)*reach}px) scale(.1) rotate(30deg)`}],{duration:760+i%3*90,easing:'ease-out'}).finished.then(()=>spark.remove()).catch(()=>spark.remove());
    }
    if(current.after===5)panel.querySelector('.story-award-paper').animate([
      {boxShadow:'inset 0 0 0 0px #f4bd55,0 5px 0 #4a322618'},
      {boxShadow:'inset 0 0 0 6px #f4bd55,inset 0 0 0 8px #b17c29,0 0 30px #f4bd5580'}
    ],{duration:750,easing:'ease-out'});
  }
  function renderHost() {
    const current=scenes[scenario], host=$('#completionHost');host.className='practice-finish';
    const actions=node('div','practice-finish-actions'), again=node('button','btn','再练一轮'), next=node('div','station-actions'), nextButton=node('button','btn btn-green','下一站：相遇小剧场');
    next.append(nextButton);actions.append(again,next);host.replaceChildren(actions);
    window.CanranCore.unit12Completion.render({finish:host,activity:'listen',states:Array.from({length:5},(_,i)=>({firstCorrect:scenario!=='retry'||i!==1})),celebrate:false,awardStatus:current.earned?'整轮零错，这颗星点亮了！':current.copy});
    again.addEventListener('click',()=>{scenario='earned';$('#scenario').value=scenario;persistUrl();renderHost();open();});
    nextButton.addEventListener('click',()=>{$('#previewNotice').textContent='演示：下一站是相遇小剧场。当前演示不进入真实课程。';});
    $('#headerCount').textContent=`${current.after} / 5`;
  }
  function open() {
    if(!ready)return;
    stopMotion();stage.dataset.variant=variant;dialog.dataset.variant=variant;
    stage.replaceChildren(({A:VariantA,B:VariantB,C:VariantC})[variant]());
    const cardOnly=variant==='C';
    dialog.dataset.motion=$('#reduceMotion').checked?'reduced':'full';
    dock.hidden=cardOnly;
    dialog.append(dock);
    if(cardOnly){
      dialog.removeAttribute('aria-labelledby');dialog.removeAttribute('aria-describedby');
      if(scenario==='upgrade')dialog.setAttribute('aria-describedby','upgradeReminder');
      dialog.setAttribute('aria-label','纪念卡；点击任意位置，或按回车、空格、Esc 关闭');
      dialog.setAttribute('tabindex','-1');
    }else{
      dialog.removeAttribute('aria-label');dialog.removeAttribute('tabindex');
      dialog.setAttribute('aria-labelledby','rewardTitle');dialog.setAttribute('aria-describedby','rewardCopy');
    }
    if(!dialog.open)dialog.showModal();
    if(cardOnly)dialog.focus({preventScroll:true});
    stage.scrollTop=0;
    playMotion();
  }
  function leave(message='设计演示 · 不保存学习记录') {
    stopMotion();finishVisual();if(dialog.open)dialog.close();
    document.body.append(dock);dock.hidden=false;$('#previewNotice').textContent=message;$('#showReward').focus({preventScroll:true});
  }
  function showKeepsake() {
    stopMotion();finishVisual();
    $('#rewardTitle').textContent='我的单元纪念卡';$('#rewardCopy').textContent='五颗星和第一次集齐的日子，都在这里。';
    const actions=stage.querySelector('.reward-actions');actions.replaceChildren();
    const done=node('button','btn btn-green primary-action','返回完成页');done.addEventListener('click',()=>leave());actions.append(done);
    phase='查看纪念卡';stateOutput();
  }
  function changeVariant(delta) {
    variant=['A','B','C'][(['A','B','C'].indexOf(variant)+delta+3)%3];persistUrl();open();
  }
  $('#previousVariant').addEventListener('click',()=>changeVariant(-1));$('#nextVariant').addEventListener('click',()=>changeVariant(1));
  $('#scenario').addEventListener('change',event=>{scenario=event.target.value;persistUrl();renderHost();open();});
  $('#replay').addEventListener('click',()=>open());$('#showReward').addEventListener('click',()=>open());
  $('#reduceMotion').addEventListener('change',()=>{persistUrl();if(dialog.open)open();});
  dialog.addEventListener('cancel',event=>{event.preventDefault();leave();});
  dialog.addEventListener('click',event=>{
    if(variant==='C'){event.preventDefault();event.stopPropagation();leave();}
    else if(event.target===stage)leave();
  });
  dialog.addEventListener('keydown',event=>{
    if(variant==='C'&&(event.key==='Enter'||event.key===' ')){
      event.preventDefault();event.stopPropagation();leave();
    }
  });
  document.addEventListener('keydown',event=>{
    if(dialog.open&&variant==='C')return;
    if(event.target.closest('input,textarea,select,[contenteditable]'))return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();changeVariant(event.key==='ArrowLeft'?-1:1);}
  });
  media.addEventListener('change',event=>{$('#reduceMotion').checked=event.matches;if(dialog.open)open();});
  async function init() {
    renderHost();stateOutput();
    // Use existing approved bitmap art. No generated rewards or personal data.
    await Promise.all(['paper.webp','star-earned.webp','star-empty.webp','unit1-2-handbag-closeup.webp'].map(file=>{const image=new Image();image.src=assets+file;return image.decode();}));
    await Promise.all([document.fonts.load('16px "Award Round"'),document.fonts.load('16px "ZCOOL KuaiLe"'),document.fonts.ready]);
    ready=true;$('#showReward').disabled=false;$('#previewNotice').textContent='设计演示 · 使用示例姓名，不保存或修改任何学习记录';persistUrl();open();
  }
  init().catch(()=>{$('#previewNotice').textContent='画面未准备好，请刷新演示页面重试。';});
})();
