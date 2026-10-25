'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {DatabaseSync}=require('node:sqlite');
const {createAuthThrottle}=require('../../server/auth-throttle');

test('denials describe the original deadline and server time without extending the account lock',()=>{
  const db=new DatabaseSync(':memory:');
  try{
    const rate=createAuthThrottle(db),start=1700000000000;
    for(let i=0;i<10;i++){rate.check('192.0.2.1','admin','test-admin',start+i);rate.failed('admin','test-admin',start+i);}
    for(const elapsed of [30000,600000,899000]){
      assert.throws(()=>rate.check('192.0.2.2','admin','test-admin',start+elapsed),error=>{
        assert.equal(error.status,429);assert.equal(error.retryAt,start+900000);assert.equal(error.serverTime,start+elapsed);
        assert.equal(error.retryAfter,Math.ceil((900000-elapsed)/1000));assert.equal(error.scope,'account');
        assert.ok(!error.message.includes('十五分钟'));return true;
      });
    }
    assert.doesNotThrow(()=>rate.check('192.0.2.2','admin','test-admin',start+900000));
  }finally{db.close();}
});

test('source cooldown describes the shared source and keeps its one minute budget',()=>{
  const db=new DatabaseSync(':memory:');
  try{
    const rate=createAuthThrottle(db),start=1700000000000;
    for(let i=0;i<120;i++){rate.check('192.0.2.1','student','test-student',start);rate.clear('student','test-student');}
    assert.throws(()=>rate.check('192.0.2.1','student','other',start+2000),error=>{
      assert.equal(error.scope,'source');assert.equal(error.retryAt,start+60000);assert.equal(error.retryAfter,58);return true;
    });
    assert.doesNotThrow(()=>rate.check('192.0.2.2','student','other',start+2000));
  }finally{db.close();}
});
