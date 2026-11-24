'use strict';
// Bootstrap only an EMPTY independent data directory. Never copy production
// students, credentials, progress, awards or the certificate compatibility key.
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {openStore}=require('../server/store'),{UNITS}=require('../server/catalog');
async function main(){
 const directory=process.argv[2];if(!directory||!path.isAbsolute(directory))throw Error('请指定独立测试数据目录的绝对路径');
 const target=path.resolve(directory);if((await fs.readdir(target).catch(e=>{if(e.code==='ENOENT')return [];throw e;})).length)throw Error('测试初始化只接受空目录，不覆盖任何现有账号或记录');
 await fs.mkdir(target,{recursive:true,mode:0o700});
 const store=openStore(target),adminPassword=crypto.randomBytes(24).toString('base64url'),studentPassword=crypto.randomBytes(15).toString('base64url');
 try{
  store.setAdmin('review-admin',adminPassword);const group=store.createClass('手机验收专用');store.updateClass(group.id,group.name,UNITS);
  const [student]=store.createStudents([{name:'验收同学',pinyin:'yanshoutongxue'}],group.id);store.changePassword(student.id,studentPassword);
  await fs.writeFile(path.join(target,'review-credentials.json'),JSON.stringify({purpose:'独立测试账号，不用于官网',student:{number:student.studentNumber,password:studentPassword},admin:{username:'review-admin',password:adminPassword}},null,2)+'\n',{mode:0o600,flag:'wx'});
  await fs.writeFile(path.join(target,'mobile-review.json'),JSON.stringify({schema:1,purpose:'isolated-mobile-review',createdAt:new Date().toISOString(),units:UNITS.length})+'\n',{mode:0o600,flag:'wx'});
  console.log('独立测试账号已创建；登录信息保存在测试数据目录的 review-credentials.json 中。');
 }finally{store.close();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
