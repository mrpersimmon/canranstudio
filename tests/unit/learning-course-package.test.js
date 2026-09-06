'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {sha256}=require('../../scripts/build-learning-course-package');
const {validateManifest}=require('../../core/course-package-installer');
const {getCourse,validateCourse}=require('../../core/learning-course-catalog');
const ROOT=path.resolve(__dirname,'../..');
const PAGE=path.join(ROOT,'poc/learning-path');
const manifestBytes=fs.readFileSync(path.join(PAGE,'course-package-manifest.json'));
const manifest=JSON.parse(manifestBytes);
function local(url){for(const [prefix,target]of [['/poc/lesson-1-2/course/','/poc/lesson1-2-experience/'],['/poc/lesson-1-2/core/','/core/'],['/poc/lesson-1-2/assets/','/assets/']])if(url.startsWith(prefix))return path.join(ROOT,target,url.slice(prefix.length));return path.join(ROOT,url);}

test('continuous course ships matching catalog, HTML digest and bytes for every dependency',()=>{
  const unit=JSON.parse(fs.readFileSync(path.join(PAGE,'course-package/unit-catalog.json')));
  assert.deepEqual(validateCourse(unit),[]);assert.deepEqual(unit.nodes,getCourse().nodes);
  assert.doesNotThrow(()=>validateManifest(manifest,{origin:'https://course.test',scopeUrl:'https://course.test/poc/learning-path/'}));
  const html=fs.readFileSync(path.join(PAGE,'index.html'),'utf8');assert.equal(/data-manifest-sha256="([a-f0-9]{64})"/.exec(html)[1],sha256(manifestBytes));
  let bytes=0;for(const entry of manifest.entries){const content=fs.readFileSync(local(entry.url));bytes+=content.length;assert.equal(content.length,entry.bytes,entry.url);assert.equal(sha256(content),entry.sha256,entry.url);}
  assert.equal(bytes,manifest.totalBytes);assert.ok(bytes<4*1024*1024);
  assert.equal(manifest.unitId,'NCE-STARTER-06');
  assert.ok(manifest.entries.every(e=>!e.url.includes('/slow-')));
  for(const id of new Set(Object.values(unit.sourceActors))){assert.equal(unit.entities[id].characterSpecies,'cat');assert.ok(manifest.entries.some(e=>e.url===unit.entities[id].assetSrc));}
});
