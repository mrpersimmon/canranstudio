'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
test('historical classroom pages and independent answers retain their recorded Git bytes',()=>{
 const root=path.resolve(__dirname,'../fixtures/classroom-before-fivezones'),manifest=require(path.join(root,'manifest.json'));
 assert.equal(manifest.sourceCommit,'d0a4382f963e36c1abd0f5a5ba9ef79b17794093');
 assert.equal(Object.keys(manifest.files).length,84);
 for(const[name,hash]of Object.entries(manifest.files)){
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex'),hash,name);
 }
});
