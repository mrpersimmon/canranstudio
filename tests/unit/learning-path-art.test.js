'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const {getCourse,validateCourse}=require('../../core/learning-course-catalog');
const approved=require('../../poc/learning-path/assets/story-v2/manifest.json');
test('suit and school keep their reviewed imagegen originals, prompts and runtime bindings',()=>{
  const c=getCourse(),manifest=require('../../poc/learning-path/assets/vocabulary-v2/manifest.json');
  assert.equal(manifest.generator,'imagegen');
  assert.deepEqual(manifest.assets.map(art=>art.entityId).sort(),['school','suit']);
  for(const art of manifest.assets){
    assert.equal(c.entities[art.entityId].assetSrc,art.assetSrc,'Do not restore the older unreviewed illustration');
    assert.equal(c.entities[art.entityId].deliveryBackground,'transparent');
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,art.assetSrc))).digest('hex'),art.sha256,'Image replacement needs a new visual review');
    assert.ok(fs.statSync(path.join(root,art.masterPath)).size>0);
    assert.ok(fs.statSync(path.join(root,art.originalPath)).size>0);
    assert.match(fs.readFileSync(path.join(root,art.promptPath),'utf8'),/imagegen|image_gen/i);
  }
});
test('umbrella scene uses the reviewed imagegen set, with inward facing cats and distinct patterned props',()=>{
  const c=getCourse();assert.equal(approved.generator,'imagegen');
  assert.equal(approved.assets.length,6);
  for(const art of approved.assets){
    const entity=c.entities[art.entityId];assert.equal(entity.assetSrc,art.assetSrc);
    assert.equal(entity.deliveryBackground,'transparent');
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,art.assetSrc))).digest('hex'),art.sha256,'Art changed: repeat image and scene acceptance');
    assert.ok(fs.statSync(path.join(root,art.masterPath)).size>0);
    assert.match(fs.readFileSync(path.join(root,art.promptPath),'utf8'),/imagegen|image_gen/i);
    if(art.facing)assert.equal(entity.facing,art.facing);
  }
  assert.equal(c.entities['cloak-attendant'].align,'left');assert.equal(c.entities['cloak-attendant'].facing,'right');
  assert.equal(c.entities['umbrella-visitor'].align,'right');assert.equal(c.entities['umbrella-visitor'].facing,'left');
  const wrong=structuredClone(c);wrong.entities['cloak-attendant'].facing='left';
  assert.ok(validateCourse(wrong).some(e=>e.includes('face the other speaker')));
  assert.equal(new Set(['umbrella-star','umbrella-stripe','umbrella-dot'].map(id=>c.entities[id].assetSrc)).size,3);
});
