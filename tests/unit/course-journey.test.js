'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const model=require('../../course-journey/model');
const all=Array.from({length:72},(_,i)=>({id:`unit${i*2+1}-${i*2+2}`,label:`Lesson ${i*2+1}–${i*2+2}`,title:i===24?'晚餐采购大冒险':'课程 '+i,next:'words'}));
test('journey search covers all 72 pairs and exact lesson numbers without widening authorization',()=>{
  assert.deepEqual(model.filter(all,'Lesson 50','0').map(c=>c.id),['unit49-50']);
  assert.deepEqual(model.filter(all,'144').map(c=>c.id),['unit143-144']);
  assert.deepEqual(model.filter(all,'5').map(c=>c.id),['unit5-6']);
  assert.deepEqual(model.filter(all,'晚餐采购').map(c=>c.id),['unit49-50']);
  assert.deepEqual(model.filter([all[0],all[2]],'50'),[]);
  assert.deepEqual(model.filter(all,'145'),[]);
});
test('chapter membership follows Lesson numbers even for sparse authorization, not list position',()=>{
  assert.equal(model.groups(all).length,8);
  assert.deepEqual(model.groups([all[0],all[15],all[71]]).map(g=>[g.id,g.count]),[['0',1],['1',1],['7',1]]);
  assert.deepEqual(model.filter([all[0],all[15],all[71]],'','7').map(c=>c.id),['unit143-144']);
});
test('stale bookmarks cannot restore unauthorized courses; continuation uses the supplied base and preview',()=>{
  const before=JSON.stringify(all);
  assert.equal(model.restore([all[0]],{selected:'unit143-144',group:'7'}).selected,'unit1-2');
  assert.equal(model.restore([],{selected:'unit1-2'}).selected,null);
  assert.equal(model.href({...all[24],next:'grammar'},'/','class / 1'),'/unit49-50/?preview=class%20%2F%201#learn/grammar');
  assert.equal(model.href(all[71],'/lesson/'),'/lesson/unit143-144/#learn/words');
  assert.equal(JSON.stringify(all),before);
});
test('journey component and art changes keep authenticated browser checks in the selected scope',()=>{
  const {select}=require('../../scripts/check-workflow.config');
  for(const file of ['course-journey/App.jsx','assets/course-journey/opening-mobile.webp','scripts/course-journey-bundle.js','tests/support/journey-viewports.js','tests/support/journey-viewports.json','tests/support/journey-under-landmark.js']){
    assert.ok(select([file]).includes('browser-login'),file);
  }
});
test('全部 72 个单元均有地图，按授权切换 24 个范围并从当前课恢复',()=>{
  assert.deepEqual(model.MAP_COURSES,all.map(course=>course.id));
  assert.equal(new Set(model.MAP_COURSES).size,72);
  assert.equal(model.MAP_CHAPTERS.length,24);
  assert.deepEqual(model.mapChapters([all[5],all[15]]).map(chapter=>chapter.id),['neighborhood','outdoors']);
  assert.equal(model.restore(all,{selected:'unit11-12',chapter:'opening'}).chapter,'neighborhood');
  assert.equal(model.restore([all[0]],{selected:'unit11-12',chapter:'neighborhood'}).chapter,'opening');
  assert.equal(model.restore([all[15]],{chapter:'neighborhood'}).chapter,'outdoors');
  assert.equal(model.chapterFor('unit13-14'),'visits');
  assert.equal(model.chapterFor('unit19-20'),'kindness');
  assert.equal(model.chapterFor('unit25-26'),'home');
  assert.equal(model.chapterFor('unit31-32'),'outdoors');
  assert.equal(model.chapterFor('unit143-144'),'woodland');
  assert.equal(model.restore([all[8]],{selected:'unit17-18',chapter:'opening'}).chapter,'visits');
  assert.equal(model.restore([all[11],all[14]],{selected:'unit29-30',chapter:'kindness'}).chapter,'home');
  assert.deepEqual(model.mapChapters([all[11],all[14]]).map(chapter=>chapter.id),['kindness','home']);
  for(let n=2;n<=144;n+=2)assert.deepEqual(model.filter(all,String(n)).map(course=>course.id),[`unit${n-1}-${n}`]);
});

test('所有已登记地图入口都有真实人物与横竖场景文件，星章不使用独立坐标',()=>{
  const fs=require('node:fs'),path=require('node:path'),art=require('../../course-journey/chapter-layout');
  const root=path.resolve(__dirname,'../..');
  for(const chapter of model.MAP_CHAPTERS){
    for(const composition of ['portrait','landscape']){
      const scene=art.chapters[chapter.id][composition];
      assert.ok(fs.existsSync(path.join(root,'assets/course-journey',scene.file)),scene.file);
      assert.deepEqual(Object.keys(scene.nodes).sort(),[...chapter.courses].sort());
      for(const id of chapter.courses){
        const character=art.characters[id];assert.ok(character,id);
        assert.ok(fs.existsSync(path.join(root,'assets/course-journey',character.file)),id);
        assert.ok(character.width>0&&character.height>0,id);
        assert.ok(character.bounds[0]<character.bounds[2]&&character.bounds[1]<character.bounds[3],id);
        if(Number(id.match(/\d+/)[0])>=31){assert.equal(scene.nodes[id].stars,undefined);assert.equal(scene.nodes[id].medal,undefined);}
      }
    }
  }
});
