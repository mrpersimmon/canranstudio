'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {compileProfiles}=require('../../scripts/prepare-word-decks'),deck=require('../../core/word-deck');
test('original sentences can highlight reviewed inflections without changing the headword',()=>{
 const unit={id:'unit31-32',learning:{WORDS:[{en:'climb'}],DIALOGUE:[{text:"He's climbing the tree."}]}};
 const entry={kind:'context',reviewNote:'原句中的现在分词对应原动词',source:{path:['learning','DIALOGUE',0,'text'],quote:"He's climbing the tree."},focus:'climbing',focusNote:'保留原词climb，突出原文实际词形climbing'};
 const profile=compileProfiles(unit,{climb:entry}).climb;assert.equal(profile.focus,'climbing');assert.equal(unit.learning.WORDS[0].en,'climb');
 assert.throws(()=>compileProfiles(unit,{climb:{...entry,focus:'jumping'}}),/focus|突出|词形/i);
});
test('split expressions preserve the original sentence and highlight both literal parts',()=>{
 const parts=deck.contextParts('It is not cold at all.',['not','at all']);
 assert.equal(parts.map(x=>x.text).join(''),'It is not cold at all.');assert.deepEqual(parts.filter(x=>x.mark).map(x=>x.text),['not','at all']);
 assert.throws(()=>deck.contextParts('It is cold.','not'),/focus|词形/i);
});
test('words without an appropriate original context use a word-only front, never an invented sentence',()=>{
 const unit={id:'unit111-112',learning:{WORDS:[{en:'important',cn:'重要的'}]}};
 const review={kind:'context',presentation:'word',reviewNote:'原数据仅有词条，保留原词与音标翻卡',source:{path:['learning','WORDS',0,'en'],quote:'important'}};
 assert.deepEqual(compileProfiles(unit,{important:review}),{important:{kind:'context',presentation:'word'}});
 assert.throws(()=>compileProfiles(unit,{important:{...review,source:{...review.source,quote:'an important message'}}}),/source|来源|原词/i);
});
