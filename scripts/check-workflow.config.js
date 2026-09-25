'use strict';
const fs = require('node:fs');
const path = require('node:path');
const runtimeInputs = ['core', 'assets', 'home', 'index.html', 'unit49-50', 'unit1-2', 'unit3-4', 'unit5-6', 'unit7-8', 'unit9-10', 'unit11-12', 'unit13-14', 'unit15-16', 'unit17-18', 'unit19-20', 'unit21-22', 'unit23-24', 'unit25-26', 'unit27-28', 'unit29-30', 'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark', 'scripts', 'tests', 'docs', 'deploy', 'README.md', 'CONTEXT.md', 'outputs', 'package.json', 'package-lock.json', 'playwright.config.js'];
const isDoc = file => /\.md$/i.test(file) || file.startsWith('docs/') || file.startsWith('.superpowers/');
const isWorkflow = file => /^(scripts\/check-workflow(?:\.config)?\.js|tests\/workflow\/|\.github\/|AGENTS\.md|\.gitignore)/.test(file);
const unitFiles = root => fs.readdirSync(path.join(root, 'tests/unit')).filter(name => name.endsWith('.test.js')).sort().map(name => 'tests/unit/' + name);
function tasks(root, files) {
  const browser = names => ({ args: ['node_modules/@playwright/test/cli.js', 'test', '--reporter=line', ...names], inputs: runtimeInputs, browser: true });
  const changedTests = files.filter(file => /^tests\/e2e\/.*\.spec\.js$/.test(file) && fs.existsSync(path.join(root, file)));
  return {
    'browser-login': {args:['node_modules/@playwright/test/cli.js','test','-c','playwright.login.config.js'],inputs:[...runtimeInputs,'server','tests/login','playwright.login.config.js'],browser:true},
    workflow: { args: ['--test', 'tests/workflow/check-workflow.test.js'], inputs: ['scripts/check-workflow.js', 'scripts/check-workflow.config.js', 'tests/workflow', '.github/workflows', 'package.json', 'package-lock.json'] },
    unit: { args: ['--test', ...unitFiles(root)], inputs: runtimeInputs },
    'browser-smoke': browser(['tests/e2e/smoke.spec.js', 'tests/e2e/routes.spec.js']),
    'browser-course-cache': browser(['tests/e2e/course-loading.spec.js', 'tests/e2e/course-image-transitions.spec.js', 'tests/e2e/course-cache-updates.spec.js', 'tests/e2e/course-cache-journeys.spec.js', 'tests/e2e/lesson-deployment.spec.js']),
    'browser-full': browser([]),
    'browser-audio': browser(['tests/e2e/audio-lifecycle.spec.js']),
    'browser-pronunciation': browser(['tests/e2e/pronunciation-repairs.spec.js', 'tests/e2e/unit7-8-audio.spec.js', '--grep', '修订录音|loose|新录音|只更换录音|I 词卡']),
    'browser-unit56': browser(['tests/e2e/unit5-6']),
    'browser-unit78': browser(['tests/e2e/unit7-8']),
    'browser-units9-12': browser(['tests/e2e/unit9-10', 'tests/e2e/unit11-12', 'tests/e2e/units9-12-classroom.spec.js']),
    'browser-unit1314': browser(['tests/e2e/unit13-14']),
    'browser-unit1516': browser(['tests/e2e/unit15-16']),
    'browser-unit1718': browser(['tests/e2e/unit17-18']),
    'browser-unit1920': browser(['tests/e2e/unit19-20']),
    'browser-unit2122': browser(['tests/e2e/unit21-22']),
    'browser-unit2324': browser(['tests/e2e/unit23-24']),
    'browser-unit2526': browser(['tests/e2e/unit25-26']),
    'browser-unit2728': browser(['tests/e2e/unit27-28']),
    'browser-unit2930': browser(['tests/e2e/unit29-30']),
    'browser-retry-feedback': browser(['tests/e2e/retry-feedback.spec.js', 'tests/e2e/l49-focus.spec.js']),
    'browser-state': browser(['tests/e2e/home-progress.spec.js', 'tests/e2e/l49-progress.spec.js']),
    'browser-layout': browser(['tests/e2e/accessibility.spec.js', 'tests/e2e/mobile-release.spec.js']),
    'browser-changed': browser(changedTests.length ? changedTests : ['tests/e2e/smoke.spec.js']),
    'browser-lessons': browser(['tests/e2e/l50-assessment.spec.js', 'tests/e2e/l51-progress.spec.js', 'tests/e2e/l52-progress.spec.js', 'tests/e2e/l53-progress.spec.js', 'tests/e2e/l54-progress.spec.js', 'tests/e2e/soundmark-progress.spec.js']),
  };
}
function select(files) {
  const selected = [];
  if(files.some(file=>/^(server\/|tests\/login\/|playwright.login.config.js|deploy\/login\/|core\/(?:course-(?:cache|loader|worker)|lesson49-practice)\.js|scripts\/(?:course-packages|public-base-path|build-login)\.js|unit[^/]+\/(?:content|unit)\.js)/.test(file)))selected.push('browser-login');
  if (files.some(isWorkflow)) selected.push('workflow');
  const code = files.filter(file => !isDoc(file) && !isWorkflow(file));
  if (!code.length) return selected;
  selected.push('unit');
  if (code.some(file => /^tests\/e2e\/.*\.spec\.js$/.test(file))) selected.push('browser-changed');
  const runtime = code.filter(file => !file.startsWith('tests/'));
  if (runtime.length) selected.push('browser-smoke');
  if (runtime.some(file => /^(core\/course-(?:cache|loader|worker)\.js|scripts\/(?:course-packages|public-base-path|http-header-contract|build-static)\.js|deploy\/nginx\/canranstudio-lesson-location\.conf)$/.test(file))) selected.push('browser-course-cache');
  if (runtime.some(file => /audio|feedback|\.mp3$/.test(file))) selected.push('browser-audio');
  if (code.some(file => /^(unit(?:1-2|5-6|7-8|11-12)\/|soundmark\/|core\/audio-player\.js|scripts\/media\/|tests\/fixtures\/pronunciation)/.test(file))) selected.push('browser-pronunciation');
  if (code.some(file => /^(unit5-6\/|assets\/unit5-6\/|tests\/fixtures\/unit5-6-voiced-before\/|tests\/support\/unit5-6-flow\.js)/.test(file))) selected.push('browser-unit56');
  if (code.some(file => /^(unit7-8\/|tests\/fixtures\/unit7-8-voiced-before\/|tests\/support\/unit7-8-flow\.js)/.test(file))) selected.push('browser-unit78');
  if (code.some(file => /^(unit(?:9-10|11-12)\/|tests\/fixtures\/unit(?:9-10|11-12)-voiced-before\/|tests\/support\/unit(?:9-10|11-12)-flow\.js)/.test(file))) selected.push('browser-units9-12');
  if (code.some(file => /^(unit13-14\/|assets\/unit13-14\/|tests\/support\/unit13-14-flow\.js)/.test(file))) selected.push('browser-unit1314');
  if (code.some(file => /^(unit15-16\/|assets\/unit15-16\/|tests\/support\/unit15-16-flow\.js)/.test(file))) selected.push('browser-unit1516');
  if (code.some(file => /^(unit17-18\/|assets\/unit17-18\/|tests\/support\/unit17-18-flow\.js)/.test(file))) selected.push('browser-unit1718');
  if (code.some(file => /^(unit19-20\/|assets\/unit19-20\/|tests\/support\/unit19-20-flow\.js)/.test(file))) selected.push('browser-unit1920');
  if (code.some(file => /^(unit21-22\/|assets\/unit21-22\/|tests\/support\/unit21-22-flow\.js)/.test(file))) selected.push('browser-unit2122');
  if (code.some(file => /^(unit23-24\/|assets\/unit23-24\/|tests\/support\/unit23-24-flow\.js)/.test(file))) selected.push('browser-unit2324');
  if (code.some(file => /^(unit25-26\/|assets\/unit25-26\/|tests\/support\/unit25-26-flow\.js)/.test(file))) selected.push('browser-unit2526');
  if (code.some(file => /^(unit27-28\/|assets\/unit27-28\/|tests\/support\/unit27-28-flow\.js)/.test(file))) selected.push('browser-unit2728');
  if (code.some(file => /^(unit29-30\/|assets\/unit29-30\/|tests\/support\/unit29-30-flow\.js)/.test(file))) selected.push('browser-unit2930');
  if (code.some(file => /^(unit[^/]*\/|lesson\d+\/|soundmark\/|core\/(?:lesson49-practice|lesson49-subjects|course-catalog)\.js|tests\/(?:e2e\/retry-feedback\.spec\.js|fixtures\/l49-subjects-before-retry\.js))/.test(file))) selected.push('browser-retry-feedback');
  if (runtime.some(file => /^(lesson49\/|core\/)|progress|storage/.test(file))) selected.push('browser-state');
  if (runtime.some(file => /^(lesson5[0-4]\/|soundmark\/)/.test(file))) selected.push('browser-lessons');
  if (runtime.some(file => /\.css$|adventure|landmark|device-profile/.test(file))) selected.push('browser-layout');
  return selected;
}
module.exports = { tasks, select, quick: ['workflow', 'unit'] };
