'use strict';
const fs=require('node:fs/promises'),path=require('node:path');
const {relocateSource}=require('../../scripts/public-base-path');
async function legacy(page){
 const handlers=[];
 for(const name of ['index.html','content.js','previous-questions.js','unit.js','unit.css','scene.js','grammar.js']){
  const pattern=name==='index.html'?/\/unit41-42\/(?:index\.html)?(?:\?.*)?$/:new RegExp('/unit41-42/'+name.replace('.','\\.')+'(?:\\?.*)?$');
  const handler=async route=>{let body=await fs.readFile(path.join(__dirname,'../fixtures/unit41-42-before-v153',name),'utf8');if(new URL(route.request().url()).pathname.startsWith('/lesson/'))body=relocateSource(body,'unit41-42/'+name,'/lesson/');await route.fulfill({body,contentType:name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript'});};
  await page.route(pattern,handler);handlers.push([pattern,handler]);
 }
 return async()=>{for(const [pattern,handler]of handlers)await page.unroute(pattern,handler);};
}
function historicalSuite(test){
 const {spawn}=require('node:child_process');
 const root=path.resolve(__dirname,'../..'),port=Number(process.env.COURSE_TEST_PORT||4173)+30;
 let child;
 test.use({baseURL:'http://127.0.0.1:'+port});
 test.beforeAll(async()=>{
  child=spawn(process.execPath,[path.join(root,'tests/support/static-server.js')],{cwd:root,env:{...process.env,COURSE_TEST_PORT:String(port),COURSE_UNIT4142_V153_LEGACY:'1'},windowsHide:true,stdio:['ignore','pipe','pipe']});
  await new Promise((resolve,reject)=>{child.stdout.on('data',data=>{if(data.toString().includes('static test server listening'))resolve();});child.once('error',reject);child.once('exit',code=>{if(code)reject(new Error('Historical server exited '+code));});});
 });
 test.afterAll(async()=>{if(child&&!child.killed)await new Promise(resolve=>{child.once('exit',resolve);child.kill();});});
}
module.exports={legacy,historicalSuite};
