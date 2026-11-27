'use strict';
// Only the desktop review bench calls this. Each run gets a temporary learner
// and a distinct loopback host, even when other localhost previews are open.
const http=require('node:http'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {randomBytes}=require('node:crypto');
const {createApp}=require('../server/app'),{openStore}=require('../server/store');
async function createNavigationPreview(root){
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'canran-review-navigation-'));
 const address='127.0.0.2',basePath='/lesson/',listener=http.createServer();
 let store,app;
 try{
  await new Promise((resolve,reject)=>{listener.once('error',reject);listener.listen(0,address,resolve);});
  const host=address+':'+listener.address().port,origin='http://'+host;
  store=openStore(dataDir);
  const group=store.createClass('本地导航验收');
  store.updateClass(group.id,group.name,['unit1-2','unit3-4','unit5-6','unit7-8']);
  const [student]=store.createStudents([{name:'验收同学',pinyin:'yanshoutongxue'}],group.id);
  store.changePassword(student.id,randomBytes(24).toString('hex'));
  app=await createApp({root,dataDir,origin,basePath,cacheJourneyBundle:false});
  listener.on('request',(request,response)=>{
   if(request.headers.host!==host)return response.writeHead(403).end();
   if(request.url==='/'&&request.method==='GET'){
    const token=store.session('student',student.id,Date.now(),Date.now()+3600000);
    return response.writeHead(303,{Location:basePath,'Cache-Control':'no-store','Referrer-Policy':'no-referrer',
     'Set-Cookie':'canran_student='+token+'; Path='+basePath+'; HttpOnly; SameSite=Strict; Max-Age=3600'}).end();
   }
   app.emit('request',request,response);
  });
  return {
   redirect(response){response.writeHead(303,{Location:origin+'/','Cache-Control':'no-store'}).end();},
   close(){listener.close();listener.closeAllConnections();app.emit('close');store.close();return fs.rm(dataDir,{recursive:true,force:true});}
  };
 }catch(error){
  listener.close();app?.emit('close');store?.close();await fs.rm(dataDir,{recursive:true,force:true});throw error;
 }
}
module.exports={createNavigationPreview};
