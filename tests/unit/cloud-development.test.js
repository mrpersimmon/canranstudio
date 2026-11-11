'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {options,browserArgs,REVIEW_FILES}=require('../../scripts/cloud/profile');
test('the ordinary cloud check keeps both engines and all four original test files',()=>{
  const profile=options([],{CLOUD_CHROMIUM_EXECUTABLE_PATH:path.resolve('unrelated-browser')});
  assert.equal(profile.profile,'full');assert.equal(profile.executablePath,null);
  const args=browserArgs(profile);assert(args.includes('--project=chromium'));assert(args.includes('--project=webkit'));
  for(const file of REVIEW_FILES)assert(args.includes(file));
  assert(!args.includes('--grep'));assert(!args.some(x=>x.includes('grep-invert')));
});
test('the constrained cloud profile explicitly selects its executable without claiming WebKit',()=>{
  const executable=path.resolve('installed-chromium');
  const profile=options(['--profile=system-chromium','--browser-only'],{CLOUD_CHROMIUM_EXECUTABLE_PATH:executable});
  assert.equal(profile.executablePath,executable);assert.equal(profile.browserOnly,true);
  assert(browserArgs(profile).includes('--project=chromium'));assert(!browserArgs(profile).includes('--project=webkit'));
  assert.throws(()=>options(['--profile=system-chromium'],{CLOUD_CHROMIUM_EXECUTABLE_PATH:'relative'}),/absolute/);
  assert.throws(()=>options(['--profile=skip']),/Unknown/);assert.throws(()=>options(['--skip-failures']),/Unknown/);
});
test('the WebKit job is an explicit original-suite subset, with no Chromium fallback',()=>{
  const args=browserArgs(options(['--profile=webkit','--browser-only']));
  assert(args.includes('--project=webkit'));assert(!args.includes('--project=chromium'));
  assert.equal(args.filter(x=>x.endsWith('.spec.js')).length,4);
  assert(args.includes('--workers=1'));
});
test('every path omitted from the feature quick gate has its focused cloud workflow',()=>{
  const fs=require('node:fs');
  const quick=fs.readFileSync('.github/workflows/quick.yml','utf8');
  const cloud=fs.readFileSync('.github/workflows/cloud-webkit.yml','utf8');
  const paths=text=>[...text.matchAll(/^      - '([^']+)'/gm)].map(x=>x[1]);
  assert.deepEqual(paths(quick),paths(cloud));
  assert(!paths(quick).includes('package.json'));assert(!paths(quick).includes('core/**'));
  assert.match(cloud,/branches-ignore: \[main, codex\/release-canranstudio\]/);
  assert.match(cloud,/node-version: 24/);assert.match(cloud,/playwright install --with-deps webkit/);
  assert.match(cloud,/--profile=webkit --browser-only/);assert.match(cloud,/playwright\.preview\.config\.js --project=webkit/);
  assert.match(cloud,/if: always\(\)/);assert.doesNotMatch(cloud,/continue-on-error|pull_request_target|secrets\./);
  for(const dependency of [...cloud.matchAll(/uses: ([^\s]+)/g)])assert.match(dependency[1],/@[a-f0-9]{40}$/);
});
