'use strict';
// Only the desktop review bench calls this. Each run gets a temporary learner
// and a distinct loopback host, even when other localhost previews are open.
const http=require('node:http'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {randomBytes}=require('node:crypto');
const {createApp}=require('../server/app'),{openStore}=require('../server/store');
const {worlds}=require('../course-journey/route-worlds');
async function createNavigationPreview(root,{noticeDemo=false}={}){
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'canran-review-navigation-'));
 const address=noticeDemo?'127.0.0.3':'127.0.0.2',basePath='/lesson/',listener=http.createServer();
 const demoMaps=[worlds.opening,worlds.outdoors].map(world=>basePath+'assets/course-journey/'+world.file);
 let store,app;
 try{
  await new Promise((resolve,reject)=>{listener.once('error',reject);listener.listen(0,address,resolve);});
  const host=address+':'+listener.address().port,origin='http://'+host;
  store=openStore(dataDir);
  const group=store.createClass('本地导航验收');
  store.updateClass(group.id,group.name,noticeDemo?['unit1-2','unit31-32']:['unit1-2','unit3-4','unit5-6','unit7-8']);
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
   // Slow only this loopback demonstration so the real short-lived notice can be inspected.
   const url=new URL(request.url,origin);
   const terrain=noticeDemo&&demoMaps.includes(url.pathname);
   if(noticeDemo&&(terrain||url.searchParams.get('student-view')==='1'||[basePath+'api/awards',basePath+'api/me'].includes(url.pathname))){
    if(terrain){
     const writeHead=response.writeHead;
     response.writeHead=function(status,headers){return writeHead.call(this,status,{...headers,'Cache-Control':'no-store'});};
    }
    const timer=setTimeout(()=>app.emit('request',request,response),1400);
    response.once('close',()=>clearTimeout(timer));return;
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
