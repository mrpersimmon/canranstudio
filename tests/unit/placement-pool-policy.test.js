'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const unit=require('../../content/learning-course.json');
const placement=require('../../core/learning-placement'),answers=require('../../core/learning-challenges');
const {setup}=require('./support/course-harness'),{answer}=require('./support/tap-exercise');
const ci=id=>unit.chapters.findIndex(c=>c.id===id);
const key=q=>answers.normalize(unit.sources[q.sourceRef].text);
const distinct=qs=>new Set(qs.map(key));
function small(count){return {...unit,placement:{...unit.placement,questions:unit.placement.questions.filter(q=>q.chapterId==='found').slice(0,count)}};}

test('new placement uses only skipped courses when they supply 20 distinct questions',()=>{
  const qs=placement.sample(unit,unit.chapters[20].id,unit.chapters[60].id,481).map(id=>placement.question(unit,id));
  assert.equal(qs.length,20);assert.ok(qs.every(q=>ci(q.chapterId)>=20&&ci(q.chapterId)<60));
  assert.ok(qs.some(q=>ci(q.chapterId)===59));assert.ok(new Set(qs.map(q=>q.chapterId)).size>=14);
});
test('short skipped pools are exhausted before earlier courses, nearest earlier first',()=>{
  const from=12,target=13,skipped=distinct(unit.placement.questions.filter(q=>ci(q.chapterId)>=from&&ci(q.chapterId)<target));
  const qs=placement.sample(unit,unit.chapters[from].id,unit.chapters[target].id,37).map(id=>placement.question(unit,id));
  assert.equal(qs.length,20);assert.equal(distinct(qs).size,20);
  for(const text of skipped)assert.ok(distinct(qs).has(text),'missing skipped source '+text);
  const earlier=qs.filter(q=>ci(q.chapterId)<from),oldest=Math.min(...earlier.map(q=>ci(q.chapterId)));
  for(const q of unit.placement.questions.filter(q=>ci(q.chapterId)>oldest&&ci(q.chapterId)<from))assert.ok(distinct(qs).has(key(q)),'skipped a closer prerequisite');
});
test('every course range respects skipped-first, source deduplication, bounds and target size',()=>{
  const groups=unit.chapters.map(c=>unit.placement.questions.filter(q=>q.chapterId===c.id));
  let ranges=0;
  for(let from=0;from<groups.length-1;from++)for(let target=from+1;target<groups.length;target++){
    const qs=placement.sample(unit,unit.chapters[from].id,unit.chapters[target].id,37).map(id=>placement.question(unit,id));
    const skipped=distinct(groups.slice(from,target).flat()),all=distinct(groups.slice(0,target).flat());
    assert.equal(qs.length,Math.min(20,all.size));assert.equal(distinct(qs).size,qs.length);
    assert.ok(qs.every(q=>ci(q.chapterId)<target));
    assert.equal(qs.filter(q=>ci(q.chapterId)>=from).length,Math.min(20,skipped.size));ranges++;
  }
  assert.equal(ranges,2556);
});
test('reduced banks use their real count, proportional chances and manual terminal feedback',()=>{
  for(const count of [1,4,5,6,19])for(const pass of [true,false]){
    const u=small(count),h=setup({unit:u});h.send({type:'open-placement',id:'umbrella'});
    const limit=Math.floor(count/5)+1;
    const html=require('../../core/learning-path-scene').createRenderer(u).render(h.view());
    assert.match(html,new RegExp('抽取 '+count+' 题'));assert.match(html,new RegExp('共 '+limit+' 次'));
    h.send({type:'placement-start'});assert.equal(h.view().placementAttempt.questionIds.length,count);
    const wrong=pass?limit-1:limit;
    for(let i=0;i<(pass?count:limit);i++){
      const a=h.view().placementAttempt,q=placement.question(u,a.questionIds[a.cursor]);answer(h,q,i>=wrong);
      h.send({type:'placement-check',attemptId:a.id,questionId:q.id});
      if(h.view().placementAttempt.status==='active')h.send({type:'placement-next',attemptId:a.id,questionId:q.id});
    }
    assert.equal(h.view().screen,'placement');assert.equal(h.view().placementAttempt.status,pass?'passed':'failed');
    assert.equal(h.view().placementPlan.maxMistakes,limit);
    const restored=setup({unit:u,adapter:h.adapter});restored.send({type:'open-placement',id:'umbrella'});restored.send({type:'placement-start'});
    assert.equal(restored.view().feedback,h.view().feedback);
    const a=restored.view().placementAttempt;restored.send({type:'placement-next',attemptId:a.id,questionId:a.questionIds[a.cursor]});
    assert.equal(restored.view().screen,'placement-result');
    const result=require('../../core/learning-path-scene').createRenderer(u).render(restored.view());
    assert.match(result,/剩余机会/);assert.match(result,/chances-heart\.webp/);assert.doesNotMatch(result,/本次用时/);
  }
});
test('an empty bank has an explicit unavailable invitation and cannot award a pass',()=>{
  const u=small(0),h=setup({unit:u});h.send({type:'open-placement',id:'umbrella'});
  const html=require('../../core/learning-path-scene').createRenderer(u).render(h.view());
  assert.match(html,/暂时没有可用的测试题/);assert.doesNotMatch(html,/data-action="placement-start"/);
  h.send({type:'placement-start'});assert.equal(h.view().placementAttempt,null);
});
test('stored v3 orders without the new policy keep their original sample and can resume',()=>{
  const legacy={...unit,placement:{...unit.placement}};delete legacy.placement.samplingPolicy;
  const h=setup({unit:legacy});h.send({type:'open-placement',id:'friends'});h.send({type:'placement-start'});
  const a=h.view().placementAttempt,q=placement.question(legacy,a.questionIds[0]);answer(h,q);h.send({type:'placement-check',attemptId:a.id,questionId:q.id});
  const restored=setup({adapter:h.adapter});assert.equal(restored.view().screen,'map');
  restored.send({type:'open-placement',id:'friends'});restored.send({type:'placement-start'});
  assert.deepEqual(restored.view().placementAttempt.questionIds,a.questionIds);assert.equal(restored.view().feedback,'correct');
  assert.deepEqual(placement.sample(legacy,'found','friends',2),['PL12-8:tap','PL12-11:tap','PL-CH34-4:tap','PL12-2:tap','PL12-3:tap','PL12-1:tap','PL12-5:tap','PL12-13:tap','PL12-10:tap','PL12-7:tap','PL-CH34-1:tap','PL-CH34-5:tap','PL12-9:tap','PL12-0:tap','PL12-19:tap','PL12-14:tap','PL12-16:tap','PL12-15:tap','PL-CH34-2:tap','PL-CH34-3:tap']);
});
