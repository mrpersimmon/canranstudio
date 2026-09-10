'use strict';
const fs=require('node:fs'),path=require('node:path'),unit=require('../content/learning-course.json');
const rows=unit.chapters.map(chapter=>{
 const ids=unit.nodes.filter(n=>n.chapterId===chapter.id).flatMap(n=>n.activityIds),tasks=ids.map(id=>unit.activities[id]);
 const supports=tasks.filter(a=>a.assessment?.phase==='supported'&&a.assessment.grammarSkillId),written=tasks.filter(a=>a.kind==='exercise'&&a.assessment?.grammarSkillId);
 const challengeCount=unit.challenges.filter(c=>unit.nodes.find(n=>n.id===c.unlockNodeId).chapterId===chapter.id).reduce((n,c)=>n+c.questions.length,0);
 return {lessons:chapter.lessonIds,title:chapter.title,supportedGrammar:supports.length,selectedRetrieval:written.filter(a=>a.assessment.phase!=='transfer').length,novelTransfer:written.filter(a=>a.assessment.phase==='transfer').length,delayedRetrieval:written.length?unit.grammar.delayedQuestions.length:0,optionalExercises:challengeCount,skills:[...new Set(written.map(a=>a.assessment.grammarSkillId))],status:written.length?'点选语法试点已接通，尚无学生验证':'语法能力链尚未标注和补齐'};
});
const directory=path.resolve(__dirname,'../docs/designs/no-keyboard-learning');fs.mkdirSync(directory,{recursive:true});
fs.writeFileSync(path.join(directory,'grammar-coverage.json'),JSON.stringify({release:unit.releaseRevision,rows},null,2)+'\n');
const text=['# 第一册语法能力链覆盖表','','由当前 catalog 枚举生成。词义选择、已见原句组词和选做点选的数量，不直接等于语法能力证据；未标注处按缺口处理。Lesson 49–50 是本轮实施的试点，其余章节没有被宣布完成语法重设计。','','| Lesson | 主题 | 有支持的语法任务 | 主线点选检索 | 词库/选项支持的新句 | 延后新句 | 选做点选 | 状态 |','| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |',...rows.map(r=>`| ${r.lessons.join('–')} | ${r.title} | ${r.supportedGrammar} | ${r.selectedRetrieval} | ${r.novelTransfer} | ${r.delayedRetrieval} | ${r.optionalExercises} | ${r.status} |`),'','运行 `npm run report:grammar` 更新本表。'];
fs.writeFileSync(path.join(directory,'grammar-coverage.md'),text.join('\n')+'\n');console.log('Grammar coverage: '+rows.length+' sections; one implemented pilot.');
