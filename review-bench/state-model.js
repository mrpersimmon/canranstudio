(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CanranReviewState=api;})(globalThis,function(){
 'use strict';
 const labels={view:'查看页面',collapsed:'收起词义',english:'英文对白',before:'未作答',selected:'已选未检查',correct:'答对',wrong:'答错',corrected:'订正完成',review:'只读回看',hint:'线索',explanation:'讲解',full:'完整材料',expanded:'展开词义',translated:'显示中文',perfect:'全对结算',earned:'新得星',replay:'重看纪念',open:'打开',card:'纪念卡'};
 const types={choice:'选择',match:'配对',cloze:'填空',wordbank:'词块组句',order:'词块排序',locate:'指认',handoff:'交接',write:'拼写','scene-find':'场景指认'};
 const rotate=items=>items.length>1?[...items.slice(1),items[0]]:items.slice();
 function tokensFor(q){
  const count=q.type==='order'?q.tokens.length:q.slots;
  function find(chosen){const value=chosen.map(i=>q.tokens[i]).join(' ');if(chosen.length===count)return value===q.answer?chosen:null;
   for(let i=0;i<q.tokens.length;i++){if(chosen.includes(i))continue;const next=[...chosen,i],text=next.map(n=>q.tokens[n]).join(' ');if(q.answer===text||q.answer.startsWith(text+' ')){const result=find(next);if(result)return result;}}return null;}
  const result=find([]);if(!result)throw Error('无法准备词块示例：'+q.id);return result;
 }
 function questionState(q,runId,mode='before'){
  const state={questionId:q.id,runId,selection:null,attempts:0,checked:false,hintUsed:false};
  if(q.options)state.optionOrder=rotate(q.options);
  if(q.tokens)state.tokenOrder=rotate(q.tokens.map((_,i)=>i));
  if(q.pairs)state.matchOrder=rotate(q.pairs.map(p=>p.id));
  if(mode==='before'||mode==='hint'||mode==='full')return state;
  const wrong=mode==='wrong';
  if(q.type==='order'||q.type==='wordbank'){
   state.tokens=tokensFor(q);
   if(wrong){let other=null;for(let i=0;i<state.tokens.length&&!other;i++)for(let j=0;j<q.tokens.length;j++){
    const attempt=state.tokens.slice();if(attempt.includes(j)){const at=attempt.indexOf(j);[attempt[i],attempt[at]]=[attempt[at],attempt[i]];}else attempt[i]=j;
    if(attempt.map(n=>q.tokens[n]).join(' ')!==q.answer){other=attempt;break;}
   }if(!other)throw Error('没有可用的错答示例：'+q.id);state.tokens=other;}
   state.selection=state.tokens.map(i=>q.tokens[i]).join(' ');
  }else if(q.type==='match'){
   state.pairs=JSON.parse(q.answer);if(wrong)[state.pairs[0],state.pairs[1]]=[state.pairs[1],state.pairs[0]];state.selection=JSON.stringify(state.pairs);
  }else if(q.type==='cloze'){
   state.fills=JSON.parse(q.answer);if(wrong){const i=q.blanks.findIndex((b,n)=>b.options.some(v=>v!==state.fills[n]));if(i<0)throw Error('没有填空错答示例：'+q.id);state.fills[i]=q.blanks[i].options.find(v=>v!==state.fills[i]);}state.selection=JSON.stringify(state.fills);
  }else if(q.type==='handoff'){
   const pair=JSON.parse(q.answer);if(wrong){const object=q.objects.find(x=>x.id!==pair[0]);if(object)pair[0]=object.id;else pair[1]=q.recipients.find(x=>x.id!==pair[1]).id;}state.handoff={object:pair[0],recipient:pair[1]};state.selection=JSON.stringify(pair);
  }else if(q.type==='write'){state.draftValue=wrong?'example':q.answer;state.selection=state.draftValue.trim().toLowerCase();}
  else state.selection=wrong?q.options.find(value=>value!==q.answer):q.answer;
  if(mode!=='selected'){state.checked=true;state.correct=!wrong;state.firstCorrect=mode!=='corrected'&&!wrong;state.attempts=mode==='corrected'?2:1;}
  return state;
 }
 function entriesFor(unit){
  const entries=[],add=(id,kind,section,title,route,rest={})=>entries.push({id,kind,section,title,route,states:['view'],...rest});
  add('cover','cover','开始','课程封面','cover');
  for(const stage of unit.stages)for(const [activity,title]of stage.activities){
   const route='learn/'+activity;
   if(activity==='words'){
    const words=unit.learning.WORDS;for(let i=0;i<Math.ceil(words.length/6);i++)add('words-'+i,'words',stage.title,`词卡 · 第 ${i+1} 组`,route,{index:i,subtitle:words.slice(i*6,i*6+6).map(w=>w.en).join(' · '),states:['collapsed','expanded']});
   }else if(activity==='text'){
    add('story-start','story-start',stage.title,'剧场 · 开始阅读',route);
    unit.learning.DIALOGUE.forEach((line,i)=>add('story-'+i,'story-line',stage.title,`课文 · 第 ${i+1} 句`,route,{index:i,subtitle:line.text,states:['english','translated']}));
    add('story-complete','story-complete',stage.title,'剧场 · 阅读完成',route);
   }else if(unit.questions[activity]){
    unit.questions[activity].forEach((q,index)=>{
     const copy=unit.copy?.questions?.[q.id]||{},states=['before','selected','correct','wrong','corrected','review'];
     if(activity!=='listen'&&q.hint&&copy.hint!==false)states.push('hint');if(q.workshop?.rule)states.push('explanation');if(copy.readingExcerpt||(unit.id==='unit143-144'&&q.image&&q.display?.material?.length>120))states.push('full');
     add('q:'+q.id,'question',stage.title,`${title} · 第 ${index+1} 题`,route,{activity,index,questionId:q.id,subtitle:copy.title||q.display?.title||q.prompt,type:types[q.type]||'选择',states});
    });
    add('result:'+activity,'result',stage.title,title+' · 结算',route,{activity,states:['perfect','corrected']});
    add('award:'+activity,'award',stage.title,title+' · 得星纪念',route,{activity,states:['earned','replay']});
   }else if(activity==='certificate'){
    add('card','card',stage.title,'我的纪念卡',route,{states:['card']});add('writing','writing','资料与弹层','书面练习',route,{states:['open']});
   }
  }
  const refs={
   'unit1-2':[['manners','礼貌用语'],['manners','换个物品问一问']],
   'unit3-4':[['reply','认领表达参考']],
   'unit5-6':[['text','班级合影'],['introduce','介绍表达参考'],['cars','汽车与选择问答参考']]
  };
  const references=unit.reviewReferences||(refs[unit.id]||[]).map(([activity,reference],referenceIndex)=>({route:'learn/'+activity,reference,referenceIndex}));
  references.forEach(({route,reference,referenceIndex},i)=>add('reference-'+i,'reference','资料与弹层',reference,route,{reference,referenceIndex,activity:route.replace('learn/',''),states:['open']}));
  add('records','record','资料与弹层','学习记录','learn/listen',{states:['open']});add('menu','menu','资料与弹层','更多学习操作','learn/listen',{states:['open']});
  return entries;
 }
 function normalize(catalog,input={}){
  const course=catalog.courses.find(c=>c.id===input.unit)||catalog.courses.find(c=>c.id==='unit3-4')||catalog.courses[0];
  const entry=course.entries.find(e=>e.id===input.page)||course.entries[0];
  const state=entry.states.includes(input.state)?input.state:entry.states[0];
  const device=catalog.devices.find(d=>d.id===input.device)||catalog.devices[0];
  const stars=Number.isInteger(Number(input.stars))&&input.stars!==null&&input.stars!==''?Math.max(entry.kind==='award'?1:0,Math.min(5,Number(input.stars))):entry.kind==='award'?1:5;
  return {unit:course.id,page:entry.id,state,device:device.id,stars};
 }
 function seedGroup({unit,questions,key,draftVersion,contentSignature,roundPolicy},selection,entry){
  const activity=Object.keys(unit.questions).find(id=>unit.questions[id]===questions)||Object.keys(unit.questions).find(id=>unit.questions[id][0]?.id===questions[0]?.id);
  const runId='review-'+unit.id+'-'+activity,recordMode=entry.kind==='record',target=activity===entry.activity;
  const group={index:0,states:[],signature:questions.map(q=>q.id).join('|'),draftVersion,contentSignature,roundPolicy,runId};
  if(recordMode){group.index=questions.length;group.states=questions.map((q,i)=>questionState(q,runId,i===0?'corrected':'correct'));}
  else if(target&&['question','result','award'].includes(entry.kind)){
   const completed=entry.kind==='result'||selection.state==='review';
   group.index=completed?questions.length:entry.kind==='award'?questions.length-1:entry.index;
   group.states=questions.slice(0,Math.min(questions.length,group.index+1)).map((q,i)=>{
    if(entry.kind==='result')return questionState(q,runId,selection.state==='corrected'&&i===0?'corrected':'correct');
    if(completed||entry.kind==='award'||i<group.index)return questionState(q,runId,'correct');
    return questionState(q,runId,selection.state==='explanation'?'correct':selection.state);
   });
  }
  const records={};group.states.forEach((s,i)=>{if(s.attempts)records[questions[i].id]={...s,target:questions[i].target,prompt:questions[i].prompt};});
  return {group,records};
 }
 return {labels,types,questionState,entriesFor,normalize,seedGroup};
});
