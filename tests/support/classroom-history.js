'use strict';
const path=require('node:path'),{spawn}=require('node:child_process');

// Preserve the old task-revision contract on its exact published page source.
// The shared engine/cache are deliberately current, so regressions in handling
// historical data are still visible instead of being frozen out of the test.
function historicalSuite(test){
 const root=path.resolve(__dirname,'../..'),port=Number(process.env.COURSE_TEST_PORT||4173)+43;let child;
 test.use({baseURL:'http://127.0.0.1:'+port});
 test.beforeAll(async()=>{
  child=spawn(process.execPath,[path.join(root,'tests/support/static-server.js')],{cwd:root,env:{...process.env,COURSE_TEST_PORT:String(port),COURSE_CLASSROOM_ARCHIVE:'1'},windowsHide:true,stdio:['ignore','pipe','pipe']});
  await new Promise((resolve,reject)=>{child.stdout.on('data',data=>{if(data.toString().includes('static test server listening'))resolve();});child.once('error',reject);child.once('exit',code=>{if(code)reject(Error('Historical classroom server exited '+code));});});
 });
 test.beforeEach(async({},info)=>{info.annotations.push({type:'historical-source',description:'d0a4382f; current shared engine; current five-zone suites remain separate'});});
 test.afterAll(async()=>{if(child&&!child.killed)await new Promise(resolve=>{child.once('exit',resolve);child.kill();});});
}
module.exports={historicalSuite};
