'use strict';
// Read the authored reference panels from isolated local course pages. This is
// an authoring command, never part of the production browser bundle.
const fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require('@playwright/test');
const {UNITS}=require('../server/catalog');
async function main(){
  const base=new URL(process.argv.find(x=>x.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4453/');
  if(!['127.0.0.1','localhost'].includes(base.hostname))throw Error('Reference discovery requires an isolated local preview');
  const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:375,height:667}});
  const entries={},errors=[];let cursor=0;
  try{
    await Promise.all(Array.from({length:3},async()=>{
      const page=await context.newPage();
      while(cursor<UNITS.length){
        const id=UNITS[cursor++];
        try{
          await page.goto(new URL(id+'/#cover',base).href);
          await page.locator('#lessonWorkspace .stage-certificate').waitFor({state:'attached',timeout:15000});
          entries[id]=await page.evaluate(()=>[...document.querySelectorAll('.shop-stage:not(.stage-certificate)')].flatMap(surface=>[...surface.querySelectorAll(':scope>details.offline-task,:scope>details.grammar-reference')].map((detail,index)=>({route:surface.id,reference:detail.querySelector('summary').textContent.trim(),referenceIndex:index}))));
        }catch(error){errors.push({id,message:error.message});}
      }
      await page.close();
    }));
  }finally{await context.close();await browser.close();}
  if(errors.length)throw Error(JSON.stringify(errors,null,2));
  const ordered=Object.fromEntries(UNITS.map(id=>[id,entries[id]]));
  await fs.writeFile(path.resolve(__dirname,'../review-bench/references.json'),JSON.stringify(ordered,null,2)+'\n');
  console.log(JSON.stringify({units:UNITS.length,references:Object.values(ordered).reduce((n,items)=>n+items.length,0),empty:UNITS.filter(id=>!ordered[id].length)}));
}
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
