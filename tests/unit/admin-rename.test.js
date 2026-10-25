'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const {DatabaseSync}=require('node:sqlite');
const {openStore}=require('../../server/store');

test('explicit admin rename retains password bytes, students, certificates and dates, revoking only admin sessions',()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'canran-admin-rename-'));
  const store=openStore(directory),db=new DatabaseSync(path.join(directory,'learning.sqlite'));
  try{
    store.setAdmin('original-admin','Test-only-unchanged-password');
    const group=store.createClass('改名保护班'),[student]=store.createStudents([{name:'小禾',pinyin:'xiaohe'}],group.id);
    const value={stars:15,certificate:{name:'小禾',issuedAt:'2026-01-02T03:04:05.000Z'}};
    store.saveProgress(student.id,'unit1-2',3,value);
    db.prepare('INSERT INTO unit_awards VALUES (?,?,?,?)').run(student.id,'unit1-2','retained-edition',JSON.stringify({firstFullStarAt:'2026-01-02T03:04:05.000Z'}));
    const adminSession=store.session('admin','original-admin',Date.now()),studentSession=store.session('student',student.id,Date.now());
    const read=table=>JSON.stringify(db.prepare('SELECT * FROM '+table).all());
    const before=Object.fromEntries(['students','progress','unit_awards','classes'].map(table=>[table,read(table)]));
    const passwordHash=db.prepare('SELECT password FROM admin').get().password;
    fs.writeFileSync(path.join(directory,'admin-first-login.txt'),'管理员账号：original-admin\n管理员密码：Test-only-unchanged-password\n',{mode:0o600});
    const run=(from,to)=>spawnSync(process.execPath,['server/manage.js','rename-admin',from,to],{encoding:'utf8',env:{...process.env,LESSON_DATA_DIR:directory}});
    const result=run('original-admin','new-owner');assert.equal(result.status,0,result.stderr);
    assert.equal(store.adminUsername(),'new-owner');assert.equal(store.adminLogin('new-owner','Test-only-unchanged-password'),'new-owner');
    assert.equal(store.adminLogin('original-admin','Test-only-unchanged-password'),null);
    assert.equal(db.prepare('SELECT password FROM admin').get().password,passwordHash);
    assert.equal(store.lookupSession(adminSession,'admin',Date.now()),undefined);assert.ok(store.lookupSession(studentSession,'student',Date.now()));
    for(const table of Object.keys(before))assert.equal(read(table),before[table],table);
    assert.equal(fs.readFileSync(path.join(directory,'admin-first-login.txt'),'utf8'),'管理员账号：new-owner\n管理员密码：Test-only-unchanged-password\n');
    assert.ok(!result.stdout.includes('Test-only-unchanged-password'));
    assert.notEqual(run('original-admin','another-owner').status,0);
    assert.notEqual(run('new-owner','bad name').status,0);assert.equal(store.adminUsername(),'new-owner');
  }finally{db.close();store.close();fs.rmSync(directory,{recursive:true,force:true});}
});
