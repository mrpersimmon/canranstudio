'use strict';
const {request}=require('playwright'),fs=require('node:fs/promises'),crypto=require('node:crypto');
const origin='https://preview.canranstudio.cn';
// This opt-in fixture has one destination and one designated test class.
// No production account, credential, grant or learning record is imported.
async function provision(adminFile,proxyURL){
 if(proxyURL&&!/^http:\/\/127\.0\.0\.1:\d+$/.test(proxyURL))throw Error('Expected a loopback preview connection');
 const ctx=()=>request.newContext({baseURL:origin,extraHTTPHeaders:{Origin:origin},timeout:25000,...(proxyURL?{proxy:{server:proxyURL}}:{})});
 const call=async(c,route,body)=>{const r=body===undefined?await c.get('/api/'+route,{maxRedirects:0}):await c.post('/api/'+route,{data:body,maxRedirects:0});if(!r.ok())throw Error(route+' HTTP '+r.status());return r.json();};
 const admin=await ctx();let group,student,loggedIn=false;
 async function close(){
  try{if(student){
    await call(admin,'admin/students',{classId:group.id,id:student.id,name:student.name,active:false});
    const state=await call(admin,'admin/state');if(!state.students.some(s=>s.id===student.id&&!s.active))throw Error('Preview measurement student still active');
    console.log('Preview measurement student disabled');
   }}finally{try{if(loggedIn)await call(admin,'logout',{admin:true});}finally{await admin.dispose();}}
 }
 try{
  const {admin:login}=JSON.parse(await fs.readFile(adminFile,'utf8'));await call(admin,'admin/login',login);loggedIn=true;
  const state=await call(admin,'admin/state'),groups=state.classes.filter(c=>c.name==='手机验收专用'&&c.courses.includes('unit1-2'));
  if(groups.length!==1)throw Error('Expected the isolated phone review class');group=groups[0];
  const name='计时验收 '+crypto.randomBytes(5).toString('hex');
  [student]=(await call(admin,'admin/students',{classId:group.id,students:[{name,pinyin:'jishiyanshou'}]})).students;
  const [card]=(await call(admin,'admin/accounts',{studentIds:[student.id]})).accounts;
  const client=await ctx(),password='Qz!'+crypto.randomBytes(16).toString('hex');
  try{const login=await call(client,'login',{studentNumber:card.studentNumber,password:card.initialPassword});
   if(!login.mustChangePassword)throw Error('Expected a fresh measurement account');
   await call(client,'password',{currentPassword:card.initialPassword,password,confirmPassword:password});await call(client,'logout',{});
  }finally{await client.dispose();}
  return {account:{number:card.studentNumber,password},close};
 }catch(error){await close();throw error;}
}
module.exports={provision,origin};
