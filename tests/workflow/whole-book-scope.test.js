'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {execFileSync}=require('node:child_process');

test('scoped checks keep default and explicit course lists in forked workers',t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'canran-scope-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const probe=path.join(dir,'scope.cjs'),preload=require.resolve('../support/whole-book-scope');
  const keys=['SAMPLE_UNITS','ROLLOUT_UNITS','WORD_DECK_UNITS','WHOLE_BOOK_UNITS','STORY_UNITS'];
  fs.writeFileSync(probe,`
    const read=()=>({scopes:${JSON.stringify(keys)}.map(key=>process.env[key]),translation:process.env.STORY_TRANSLATION_CHECK,
      flag:process.argv.some(arg=>arg.startsWith('--course-scope='))});
    if(process.send)process.send(read());
    else require('node:child_process').fork(__filename,[]).on('message',result=>console.log(JSON.stringify([read(),result])));
  `);
  const env={...process.env};
  delete env.CANRAN_TEST_COURSE_SCOPE;
  const run=(args,extra={})=>JSON.parse(execFileSync(process.execPath,['--require',preload,probe,...args],{env:{...env,...extra},encoding:'utf8',stdio:['ignore','pipe','pipe']}));
  const defaultScope=Array.from({length:60},(_,i)=>'unit'+(25+2*i)+'-'+(26+2*i)).join(',');
  const early='unit1-2,unit5-6';
  for(const [result,wanted] of [[run([]),defaultScope],[run(['--course-scope='+early]),early],[run(['--course-scope='+early],{CANRAN_TEST_COURSE_SCOPE:'unit25-26'}),early]]){
    const expected={scopes:keys.map(()=>wanted),translation:'1',flag:false};
    assert.deepEqual(result,[expected,expected]);
  }
  assert.throws(()=>run(['--course-scope=']),/Invalid course check scope/);
});
