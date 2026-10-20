'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
async function mirror(source,target){
 // File symlinks require Windows privileges; a byte-for-byte private copy is
 // equivalent for this frozen fixture. Directory junctions preserve asset URLs.
 if((await fs.stat(source)).isDirectory())await fs.symlink(source,target,process.platform==='win32'?'junction':'dir');
 else await fs.copyFile(source,target,require('node:fs').constants.COPYFILE_EXCL);
}
async function prepare(root,oldRoot){
 await fs.mkdir(oldRoot);
 for(const entry of await fs.readdir(root,{withFileTypes:true})){
  if(['.git','unit49-50'].includes(entry.name))continue;
  if(/^unit\d+-\d+$/.test(entry.name)){await fs.mkdir(path.join(oldRoot,entry.name));for(const name of await fs.readdir(path.join(root,entry.name)))await mirror(path.join(root,entry.name,name),path.join(oldRoot,entry.name,name));}
  else await mirror(path.join(root,entry.name),path.join(oldRoot,entry.name));
 }
 await fs.mkdir(path.join(oldRoot,'unit49-50'));
 for(const name of await fs.readdir(path.join(root,'unit49-50'))){if(['index.html','content.js','unit.js'].includes(name))await fs.copyFile(path.join(root,'tests/fixtures/unit49-50-before-fivezones',name),path.join(oldRoot,'unit49-50',name));else await mirror(path.join(root,'unit49-50',name),path.join(oldRoot,'unit49-50',name));}
 await fs.copyFile(path.join(root,'core/course-catalog.js'),path.join(oldRoot,'unit49-50/legacy-catalog.js'));
 const html=path.join(oldRoot,'unit49-50/index.html');await fs.writeFile(html,(await fs.readFile(html,'utf8')).replaceAll('/tests/fixtures/unit49-50-before-fivezones/','/unit49-50/').replace('/core/course-catalog.js','/unit49-50/legacy-catalog.js'));
}
async function cleanup(temporary,root){
 const target=path.resolve(temporary),parent=path.resolve(os.tmpdir());
 if(!target.toLowerCase().startsWith((parent+path.sep).toLowerCase())||target.toLowerCase().startsWith(path.resolve(root).toLowerCase())||(await fs.lstat(target)).isSymbolicLink())throw Error('Unsafe legacy fixture cleanup target');
 await fs.rm(target,{recursive:true,force:true});
}
module.exports={prepare,cleanup};
