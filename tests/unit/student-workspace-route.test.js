'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {destination,plainLink,sameOwner}=require('../../student-ui/workspace-route');
test('soft navigation only claims the two same-origin student pages',()=>{
 for(const base of ['/','/lesson/']){
  assert.deepEqual(destination('https://example.test'+base+'awards/?view=history',base,'https://example.test'),{page:'awards',url:base+'awards/',history:true});
  for(const address of [base+'unit1-2/',base+'admin/',base+'?account=password',base+'?preview=class',base+'awards/history/old/',base+'#card=old','https://other.test'+base])assert.equal(destination(address,base,'https://example.test'),null,address);
 }
});
test('modified, download and new-tab links keep their native browser behavior',()=>{
 const ordinary={button:0},link={hasAttribute:()=>false,target:''};assert.equal(plainLink(ordinary,link),true);
 for(const change of [{button:1},{ctrlKey:true},{metaKey:true},{shiftKey:true},{altKey:true},{defaultPrevented:true}])assert.equal(plainLink({...ordinary,...change},link),false);
 assert.equal(plainLink(ordinary,{...link,target:'_blank'}),false);assert.equal(plainLink(ordinary,{...link,hasAttribute:()=>true}),false);
});
test('retained views never cross a student or upgrade epoch boundary',()=>{
 const a={student:{id:'a'},systemUpgrade:{epoch:3}};assert.equal(sameOwner(a,{...a}),true);assert.equal(sameOwner(a,{...a,student:{id:'b'}}),false);assert.equal(sameOwner(a,{...a,systemUpgrade:{epoch:4}}),false);assert.equal(sameOwner({},{}),false);
});
