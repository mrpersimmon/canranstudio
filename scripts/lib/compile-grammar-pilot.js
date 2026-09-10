'use strict';
module.exports=function compileGrammarPilot(unit){
 const design=require('../../content/grammar/lesson49-50');
 const diagnostics=(skill,answers,hint)=>{
  const patterns=skill==='present-third-person-s'?[[/\blikes\b/,'like','missing-s']]:skill==='does-base-verb'?[[/\blike\b/,'likes','double-marking']]:[[/^Does/,'Do','wrong-auxiliary'],[/\bwant\b/,'wants','double-marking']];
  return patterns.map(([pattern,replacement,code])=>({values:answers.filter(x=>pattern.test(x)).map(x=>x.replace(pattern,replacement)),code,feedback:hint})).filter(d=>d.values.length);
 };
 unit.grammar={pilotLessons:[49,50],skills:design.skills,coverageStatus:'pilot',prerequisites:{'subject-pronouns':{lessonIds:[5,6],activityIds:['C06:pronoun-he','C06:pronoun-she']},'present-base-verb':{lessonIds:[47,48]}},activityIds:[]};
 const source=(ref,text)=>{unit.sources[ref]={sourceId:ref,text,lessonId:49,sourceKind:'grammar-example',provenance:'course-authored'};};
 for(const [key,grammarSkillId,phase,taskKind,prompt,prefix,suffix,answers,text,hint] of design.tasks){
  const id='L49:grammar-'+key,ref='G49-'+key,n=unit.nodes.find(n=>n.id===(phase==='transfer'?'L49-REVIEW':'L49-USE'));
  source(ref,text);
  const a={id,nodeId:n.id,checkpointId:n.id,resultId:id+':result',targetId:grammarSkillId,kind:'input',reviewEligible:false,taskKind,title:taskKind==='gap'?'写出正确的词':phase==='correction'?'改正这句话':phase==='transformation'?'换一种说法':'写出这句话',prompt,prefix,suffix,answers,answer:[],options:[],sourceRefs:[ref],instruction:'',requiredAudio:[],feedbackAudio:[],feedbackPlayback:'optional',feedbackText:text,wrongFeedback:hint,hints:[hint,text],channel:'written-retrieval',assessment:{skill:'written-grammar',label:'自主语法表达',grammarSkillId,family:'present-simple',phase,authoredSupport:taskKind==='gap'?'sentence-frame':'none',prerequisites:design.skills.find(s=>s.id===grammarSkillId).prerequisites,misconceptions:design.skills.find(s=>s.id===grammarSkillId).misconceptions,evidenceMode:'written-retrieval',scope:'assessment',boundary:'记录本次无选项表达及实际使用的帮助；不直接推断掌握。'}};
  a.assessment.authoredSupport=taskKind==='gap'?'sentence-frame':phase==='correction'?'error-sentence':phase==='transformation'?'source-sentence':grammarSkillId==='does-question'?'required-structure':'none';
  a.diagnostics=diagnostics(grammarSkillId,answers,hint);
  unit.activities[id]=a;n.activityIds.push(id);unit.checkpointActivities[n.id].push(id);unit.grammar.activityIds.push(id);
 }
 for(const [id,skill]of [['L49:gap-1','present-third-person-s'],['L49:order-2','does-base-verb'],['L49:gap-3','does-question']])unit.activities[id].assessment={...unit.activities[id].assessment,grammarSkillId:skill,family:'present-simple',phase:'supported',authoredSupport:unit.activities[id].kind==='order'?'word-bank':'options'};
 unit.grammar.delayedQuestions=design.delayed.map(([key,grammarSkillId,prompt,answers,hint])=>{
  const ref='G49-delayed-'+key;source(ref,answers[0]);
  return {id:'G49-delayed-'+key,kind:'translation',sourceRef:ref,prompt,answers,actorId:'explorer-cat',hint,grammarSkillId,phase:'delayed-retrieval',authoredSupport:grammarSkillId==='does-question'?'required-structure':'none',diagnostics:diagnostics(grammarSkillId,answers,hint)};
 });
 const challenge=unit.challenges.find(c=>c.id==='CH49-50');
 for(const [index,skill]of [[0,'present-third-person-s'],[1,'does-base-verb'],[2,'does-question']]){
  const q=challenge.questions[index];q.grammarSkillId=skill;q.authoredSupport=q.kind==='gap'?'sentence-frame':'none';q.diagnostics=diagnostics(skill,q.answers,q.hint);
 }
 for(const q of unit.placement.questions.filter(q=>q.id.startsWith('PL-CH49-50-'))){const source=challenge.questions.find(x=>'PL-'+x.id===q.id);if(source?.grammarSkillId)q.grammarSkillId=source.grammarSkillId;}
 for(const a of Object.values(unit.activities)) if(['cloze','order','input'].includes(a.kind) && !a.embeddedIn && !a.conversation && !a.listening && !a.requiredAudio.length)a.feedbackPlayback='optional';
};
