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

test('historical reward acknowledgement shares the current handler and keepAward opt-out',async()=>{
 // The old answer driver runs against today's reward UI. Adapting its callback
 // must not leave a second handler that closes a card an animation test keeps.
 require('../support/classroom-history').installHistoricalRewardAdapter();
 const current=require('../support/reward-dialog'),historical=require('../fixtures/classroom-before-fivezones/tests/support/reward-dialog');
 assert.equal(historical.handleRewardDialog,current.handleRewardDialog);
 const active=new Set();let registrations=0;
 const page={
  locator:()=>({}),
  async addLocatorHandler(locator){active.add(locator);registrations++;},
  async removeLocatorHandler(locator){assert(active.delete(locator));}
 };
 await current.handleRewardDialog(page);
 await historical.handleRewardDialog(page);
 assert.equal(registrations,1);assert.equal(active.size,1);
 await historical.handleRewardDialog(page,true);
 assert.equal(active.size,0);
 await historical.handleRewardDialog(page);
 await current.handleRewardDialog(page,true);
 assert.equal(registrations,2);assert.equal(active.size,0);
});
