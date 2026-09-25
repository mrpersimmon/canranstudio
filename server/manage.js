'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {openStore}=require('./store');
async function main(){
 const [command,argument]=process.argv.slice(2),directory=path.resolve(process.env.LESSON_DATA_DIR||'.data/lesson-access');
 if(command==='bootstrap'||command==='reset-admin'){
  const store=openStore(directory);
  try{
   if(command==='bootstrap'&&store.hasAdmin())throw Error('管理员已存在。明确恢复账号时使用 reset-admin。');
   const username='admin',password=crypto.randomBytes(24).toString('base64url');store.setAdmin(username,password);
   const file=path.join(directory,'admin-first-login.txt');await fs.writeFile(file,'管理员账号：'+username+'\n管理员密码：'+password+'\n',{mode:0o600});await fs.chmod(file,0o600);console.log('登录信息已写入受保护的本地文件：'+file);
  }finally{store.close();}return;
 }
 if(command==='backup'){
  if(!argument)throw Error('用法：node server/manage.js backup <新备份目录>');
  const target=path.resolve(argument);await fs.mkdir(target,{mode:0o700});const store=openStore(directory);
  try{await store.backup(path.join(target,'learning.sqlite'));await fs.copyFile(path.join(directory,'card-key'),path.join(target,'card-key'));await fs.chmod(path.join(target,'card-key'),0o600);await fs.writeFile(path.join(target,'backup.json'),JSON.stringify({format:1,createdAt:new Date().toISOString()}),{mode:0o600});console.log('已备份数据库和历史兼容密钥：'+target);}finally{store.close();}return;
 }
 if(command==='restore'){
  if(!argument)throw Error('用法：停服务后 node server/manage.js restore <备份目录>；目标数据目录必须为空');
  const source=path.resolve(argument),meta=JSON.parse(await fs.readFile(path.join(source,'backup.json'),'utf8'));if(meta.format!==1)throw Error('不支持的备份格式');
  if((await fs.readdir(directory).catch(e=>{if(e.code==='ENOENT')return [];throw e;})).length)throw Error('恢复目标必须为空，请使用新的 LESSON_DATA_DIR；不覆盖已有学生记录。');
  await fs.mkdir(directory,{recursive:true,mode:0o700});for(const file of ['learning.sqlite','card-key']){await fs.copyFile(path.join(source,file),path.join(directory,file));await fs.chmod(path.join(directory,file),0o600);}const store=openStore(directory);store.checkIntegrity();store.close();console.log('恢复完成；启动服务后复查班级、学习卡和学习成果。');return;
 }
 throw Error('命令：bootstrap | reset-admin | backup <新目录> | restore <备份目录>');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
