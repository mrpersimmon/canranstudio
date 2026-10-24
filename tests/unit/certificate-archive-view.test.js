'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {createCertificateArchiveView,paperCourses}=require('../../server/certificate-archive-view');
const root=path.resolve(__dirname,'../..');
test('every supported original paper renders through an isolated allowlist without teaching scripts',async()=>{
 const view=createCertificateArchiveView({root,basePath:'/lesson/'});
 for(const course of paperCourses){
  const html=await view.page({id:'review',course,kind:'legacy-paper'});
  assert(html.includes('/lesson/history-certificates.js'));assert(!html.includes('/content.js'));assert(!html.includes('/unit.js'));assert(!html.includes('lesson49-practice.js'));
  assert(await view.resource(course,course+'/legacy-certificate.js'));
  assert.equal(await view.resource(course,course+'/content.js'),null);
  assert.equal(await view.resource(course,'server/store.js'),null);
  assert.equal(await view.resource(course,'../server/store.js'),null);
  assert.equal(await view.resource(course,'/assets/awards/paper.webp'),null);
 }
});
test('archive template metadata is escaped and static fonts/images stay available',async()=>{
 const view=createCertificateArchiveView({root,basePath:'/'});
 const html=await view.page({id:'"><script>bad()</script>',course:'unit37-38',kind:'legacy-paper'});assert(!html.includes('<script>bad()'));
 const definition=await view.resource('unit37-38','archive-definition.js');assert(definition.body.toString().includes('LegacyDefinition'));assert(!definition.body.toString().includes('answer'));
 assert(await view.resource('unit37-38','assets/awards/paper.webp'));assert.equal(await view.resource('unit37-38','assets/unit1-2/scene/man.svg'),null);
});
