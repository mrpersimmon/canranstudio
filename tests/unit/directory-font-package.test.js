'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto'),{createCoursePackages}=require('../../scripts/course-packages');
test('directory preparation caches the same complete fonts without removing course or legacy certificate dependencies',async()=>{
 const root=path.resolve(__dirname,'../..'),base='/lesson/',{index,generated}=await createCoursePackages({root,basePath:base,courseIds:['home','unit1-2','unit49-50']});
 const read=id=>JSON.parse(generated.get(index.courses[id].manifest.slice(base.length)).body),home=read('home'),course=read('unit1-2');
 assert.equal(index.sharedFonts.length,5);assert.equal(course.unusedFontFamilies,undefined);
 for(const font of index.sharedFonts){const bytes=await fs.readFile(path.join(root,font.key.slice(base.length)));assert.equal(font.bytes,bytes.length);assert.equal(font.sha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.deepEqual(home.required.find(item=>item.key===font.key),font);assert.deepEqual(course.required.find(item=>item.key===font.key),font);assert.equal(home.required.filter(item=>item.key===font.key).length,1);}
 for(const name of ['award-round.woff2','zcool-kuaile-chinese-simplified-400.woff2','award-gothic-500.woff2'])assert(course.required.some(item=>item.key.endsWith('/'+name)),name+' must remain available for current and old cards');
 for(const id of ['home','unit1-2','unit49-50']){const descriptor=index.courses[id],body=generated.get(descriptor.manifest.slice(base.length)).body;assert.equal(descriptor.sha256,crypto.createHash('sha256').update(body).digest('hex'));}
});
