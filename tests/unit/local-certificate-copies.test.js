'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
test('local certificate discovery reads only the signed-in old namespace and does not write or upload',async()=>{
 const who='owner-a',course='unit49-50',issuedAt='2026-01-02T16:30:00.000Z',snapshot={activity:{unitName:'原姓名',unitCertificateIssuedAt:issuedAt}};
 const prefix='canran:student:'+who+':',key=prefix+'canran:lesson:'+course+':learning:v1';
 const values={[key]:JSON.stringify(snapshot),['canran:lesson:'+course+':learning:v1']:JSON.stringify(snapshot),['canran:student:owner-b:canran:lesson:'+course+':learning:v1']:JSON.stringify(snapshot),[prefix+'epoch:current:canran:lesson:'+course+':learning:v1']:JSON.stringify(snapshot)};
 const localStorage={...values,getItem:key=>values[key],setItem(){throw Error('Discovery must not write');},removeItem(){throw Error('Discovery must not remove');}};
 const sandbox={localStorage,crypto:crypto.webcrypto,TextEncoder,fetch(){throw Error('Discovery must not upload');}};
 vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../../server/public/local-certificate-copies.js'),'utf8'),sandbox);
 const access={student:{id:who,name:'新账户名'},systemUpgrade:{epoch:'current'}};
 const copies=await sandbox.CanranLocalCertificates.collect(access);assert.equal(copies.length,1);assert.equal(copies[0].name,'原姓名');assert.equal(copies[0].issuedAt,issuedAt);assert.equal(copies[0].sourceKey,key);
 assert.equal(copies[0].id,crypto.createHash('sha256').update(JSON.stringify([who,course,'legacy-paper','legacy-paper:original','原姓名',issuedAt])).digest('hex'));
 assert.deepEqual(JSON.parse(JSON.stringify(copies[0].snapshot)),snapshot);assert.equal((await sandbox.CanranLocalCertificates.collect({...access,systemUpgrade:null})).length,0);
});
