'use strict';
const path=require('node:path'),fs=require('node:fs/promises');
const {createCoursePackages}=require('./course-packages'),{UNITS}=require('../server/catalog');
async function build(){
 const root=path.resolve(__dirname,'..'),out=path.join(root,'dist-login');
 const {generated,index}=await createCoursePackages({root,basePath:'/lesson/',courseIds:UNITS,isolatedDefinitions:true});
 await fs.mkdir(out,{recursive:true});
 // Review-only manifest, never a public static-site build. The access server
 // alone serves the package bytes after checking the authenticated identity.
 await fs.writeFile(path.join(out,'publication.json'),JSON.stringify({access:'class-v1',courses:index.courses,resourceFiles:generated.size},null,2)+'\n');
 console.log('16 个受保护教学单元已校验；dist-login/publication.json 仅用于发布核对。运行 server/run.js 提供课程。');
}
build().catch(error=>{console.error(error.message);process.exitCode=1;});
