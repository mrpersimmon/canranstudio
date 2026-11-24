'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),sharp=require('sharp');
const flags=['French','German','Japanese','South Korean','Chinese','Swedish','English','American'];
const slug=word=>word.toLowerCase().replaceAll(' ','-');
function artwork(){const scope={CanranCore:{}};vm.runInNewContext(fs.readFileSync('unit5-6/current.js','utf8'),scope);return scope.CanranCore.unit56Current;}

test('all eight flag word fronts omit translated labels, including outlined glyphs',()=>{
 const art=artwork();
 for(const word of flags){
  const source=art.wordArtwork({en:word}).sources[0],svg=fs.readFileSync('.'+source,'utf8');
  assert.doesNotMatch(svg,/\p{Script=Han}|<text\b|aria-label=|<rect[^>]*y="92"/u,word+' front must not disclose its meaning');
  assert.equal(source,'/assets/unit5-6-word-cards/flags/'+slug(word)+'.svg');
  assert.equal(art.image(word),'/assets/unit5-6-current/'+slug(word)+'-v154.svg','exercises retain their labelled source');
  assert.match(fs.readFileSync('.'+art.image(word),'utf8'),/aria-label="[^"]+"/,'original exercise caption stays available');
 }
});

test('word flag derivatives preserve every original flag pixel above the removed caption',async()=>{
 const art=artwork();
 for(const word of flags){
  const crop={left:0,top:0,width:120,height:90};
  const original=await sharp('.'+art.image(word)).extract(crop).ensureAlpha().raw().toBuffer();
  const front=await sharp('.'+art.wordArtwork({en:word}).sources[0]).extract(crop).ensureAlpha().raw().toBuffer();
  assert.deepEqual(front,original,word+' keeps exact colours, geometry, border and shadow');
 }
});
