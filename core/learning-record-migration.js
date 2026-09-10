(function attach(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)(root.CanranCore ||= {}).learningRecordMigration=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clone=x=>JSON.parse(JSON.stringify(x));
  function migrate(old,u,at,draft=null){
    const next=clone(old),history=u.keyboardHistory;
    next.schema=u.recordSchema;next.contractVersion=u.contractVersion;
    next.keyboardArchive={at,reason:'无键盘版本升级',record:clone(old),draft:clone(draft)};
    next.legacyCompletedNodes={};
    for(const n of history.nodes)if(n.activityIds.every(id=>old.completed[id])||(old.completedNodeContracts?.[n.id]===1||(old.contractVersion||1)===1)&&history.history.nodes[n.id]?.every(id=>old.completed[id]))next.legacyCompletedNodes[n.id]={at,version:2};
    const unchanged=id=>u.activities[id]&&history.activities[id]&&JSON.stringify(u.activities[id])===JSON.stringify(history.activities[id]);
    next.completed=Object.fromEntries(Object.entries(old.completed).filter(([id])=>unchanged(id)));
    next.results=Object.fromEntries(Object.entries(old.results).filter(([,r])=>unchanged(r.activityId)).map(([id,r])=>[id,{...r,contractVersion:r.contractVersion||old.contractVersion||1}]));
    next.attempts=Object.fromEntries(Object.entries(old.attempts).filter(([id])=>unchanged(id)));
    next.reviewEvents=(old.reviewEvents||[]).filter(e=>unchanged(e.activityId));
    next.completedNodeContracts={};
    next.challenges=Object.fromEntries(Object.entries(old.challenges||{}).map(([id,p])=>[id,{answers:[],legacyCount:p.answers.length,...(p.completedAt?{completedAt:p.completedAt}:{})}]));
    const mappings=new Map(u.keyboardMigration.questions.map(q=>[q.oldId,q.newId]));
    next.retrievalReviews={};
    for(const e of Object.values(old.retrievalReviews||{})){
      const questionId=mappings.get(e.questionId);if(!questionId)continue;
      const copy={...clone(e),questionId};
      for(const k of ['lastQuestionId','lastAnswer','lastAnswerPolicyVersion','lastEvidence','lastReviewedAt','authoredSupport'])delete copy[k];
      next.retrievalReviews[questionId]=copy;
    }
    for(const r of Object.values(old.results)){
      const id=u.keyboardMigration.activities[r.activityId];if(!id)continue;
      next.retrievalReviews[id]={origin:'activity',questionId:id,nextDueDay:r.nextDueDay,intervalStage:r.intervalStage,wrong:r.wrong||0,errors:[]};
    }
    next.placement={attempts:{}};next.interruptedPlacements=[];
    for(const [id,a]of Object.entries(old.placement?.attempts||{})){
      if(a.status==='active')next.interruptedPlacements.push({targetId:id,attemptId:a.id,reason:'版本更新中止',at});
      else next.placement.attempts[id]=clone(a);
    }
    if(old.resetBackup)next.resetBackup={at:old.resetBackup.at,record:migrate(old.resetBackup.record,u,at,null)};
    return next;
  }
  return Object.freeze({migrate});
});
