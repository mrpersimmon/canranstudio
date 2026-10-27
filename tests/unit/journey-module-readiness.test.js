'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {recordArtReady,completionCandidates}=require('../../course-journey/module-readiness');
const {takeNewCompletions}=require('../../course-journey/completion-notice');
const pending=['unit1-2','unit3-4'],chapter=['unit1-2','unit3-4','unit5-6'];
const candidates=(readiness,generation,extra={})=>completionCandidates({pending,chapter,modular:true,legacyReady:false,readiness,generation,...extra});

test('失败不消费首次满星；本课重试就绪后才进入庆祝候选，其他课不必等它',()=>{
 const generation={chapter:'opening'},storage=new Map(),memory={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 const before=[{id:'unit1-2',stars:0,maxStars:5},{id:'unit3-4',stars:0,maxStars:5}];
 takeNewCompletions(memory,'student',before);
 const grades=before.map(course=>({...course,stars:5}));
 const fresh=takeNewCompletions(memory,'student',grades);
 assert.deepEqual(fresh,pending);
 let state=recordArtReady(null,generation,generation,'unit1-2',false);
 state=recordArtReady(state,generation,generation,'unit3-4',true);
 assert.deepEqual(candidates(state,generation,{pending:fresh}),['unit3-4']);
 assert.deepEqual(fresh,pending,'筛选就绪项不能删除仍在等重试的首次满星');
 state=recordArtReady(state,generation,generation,'unit1-2',true);
 assert.deepEqual(candidates(state,generation,{pending:fresh.filter(id=>id!=='unit3-4')}),['unit1-2']);
 assert.deepEqual(before.map(c=>c.stars),[0,0]);assert.deepEqual(grades.map(c=>c.stars),[5,5]);
});

test('返回同名章节是新挂载：旧ready和迟到成功/失败回调都不能复用',()=>{
 const old={chapter:'opening'},back={chapter:'opening'};
 const oldReady=recordArtReady(null,old,old,'unit1-2',true);
 assert.deepEqual(candidates(oldReady,back),[]);
 assert.strictEqual(recordArtReady(oldReady,back,old,'unit3-4',true),oldReady,'旧挂载迟到成功无效');
 let current=recordArtReady(oldReady,back,back,'unit3-4',true);
 assert.deepEqual(candidates(current,back),['unit3-4']);
 assert.strictEqual(recordArtReady(current,back,old,'unit3-4',false),current,'旧挂载迟到失败不能撤销新ready');
 current=recordArtReady(current,back,back,'unit1-2',true);
 assert.deepEqual(candidates(current,back),pending);
});

test('当前课重新加载立即撤销ready；重复通知不造成父级重渲染环',()=>{
 const generation={chapter:'opening'};
 const ready=recordArtReady(null,generation,generation,'unit1-2',true);
 assert.strictEqual(recordArtReady(ready,generation,generation,'unit1-2',true),ready);
 const loading=recordArtReady(ready,generation,generation,'unit1-2',false);
 assert.deepEqual(candidates(loading,generation),[]);
 assert.strictEqual(recordArtReady(loading,generation,generation,'unit1-2',false),loading);
});

test('非试点仍沿用整图ready边界，任何模式都不返回本章之外课程',()=>{
 const generation={chapter:'opening'},state=recordArtReady(null,generation,generation,'unit1-2',true);
 assert.deepEqual(candidates(state,generation,{modular:false,legacyReady:false}),[]);
 assert.deepEqual(candidates(state,generation,{modular:false,legacyReady:true}),pending);
 assert.deepEqual(candidates(state,generation,{chapter:['unit5-6']}),[]);
 assert.deepEqual(candidates(state,generation,{modular:false,legacyReady:true,chapter:['unit1-2']}),['unit1-2']);
});
