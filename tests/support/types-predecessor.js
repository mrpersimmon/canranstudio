'use strict';
const fs=require('node:fs/promises');
// Test-local responses preserve the preview server's private-file boundary.
async function installPredecessor(page,pair){
 const prefix=`/tests/fixtures/unit${pair}-types-before/`;
 const files=Object.fromEntries(await Promise.all(['index.html','content.js','unit.js','scene.js'].map(async name=>[name,await fs.readFile('.'+prefix+name)])));
 await page.route('**'+prefix+'*',route=>{
  const name=new URL(route.request().url()).pathname.slice(prefix.length)||'index.html';
  return files[name]?route.fulfill({body:files[name],contentType:name.endsWith('.html')?'text/html':'text/javascript'}):route.continue();
 });
}
module.exports={installPredecessor};
