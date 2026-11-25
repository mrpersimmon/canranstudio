'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const {UNITS}=require('../../server/catalog');
const scope={CanranCore:{},URL};
vm.runInNewContext(fs.readFileSync('core/story-certificate.js','utf8'),scope);

test('course ending resolves all 72 paired units and keeps the final unit terminal',()=>{
  for(const [index,id] of UNITS.entries()){
    const result=scope.CanranCore.storyCertificate.courseDestinations(id,`https://example.test/lesson/${id}/`,'https://example.test/lesson/');
    assert.equal(result.home,'https://example.test/lesson/');
    assert.equal(result.next,UNITS[index+1]?`https://example.test/lesson/${UNITS[index+1]}/`:null);
  }
});
test('course ending respects the account next-course permission and the preview context',()=>{
  const links=scope.CanranCore.storyCertificate.courseDestinations;
  const current='https://example.test/unit3-4/?preview=class-preview#learn/certificate';
  assert.equal(links('unit3-4',current,'https://example.test/',{nextCourse:null}).next,null);
  const result=links('unit3-4',current,'https://example.test/',{nextCourse:{id:'unit5-6'}});
  assert.equal(result.home,'https://example.test/?preview=class-preview');
  assert.equal(result.next,'https://example.test/unit5-6/?preview=class-preview');
  assert.equal(links('unit3-4',current,'https://example.test/',{nextCourse:{id:'unit7-8'}}).next,null);
});
