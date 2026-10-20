'use strict';
const fs = require('node:fs');
const path = require('node:path');
const runtimeInputs = ['award-book', 'core', 'assets', 'home', 'index.html', 'unit49-50', 'unit51-52','unit53-54','unit55-56','unit57-58','unit59-60','unit61-62','unit63-64','unit65-66','unit67-68','unit69-70','unit71-72','unit73-74','unit75-76','unit77-78','unit79-80','unit81-82','unit83-84','unit85-86','unit87-88','unit89-90','unit91-92','unit93-94','unit95-96','unit97-98','unit99-100','unit101-102','unit103-104','unit105-106','unit107-108','unit109-110','unit111-112','unit113-114','unit115-116','unit117-118','unit119-120','unit121-122','unit123-124','unit125-126','unit127-128','unit129-130','unit131-132','unit133-134','unit135-136','unit137-138','unit139-140','unit141-142','unit143-144', 'unit1-2', 'unit3-4', 'unit5-6', 'unit7-8', 'unit9-10', 'unit11-12', 'unit13-14', 'unit15-16', 'unit17-18', 'unit19-20', 'unit21-22', 'unit23-24', 'unit25-26', 'unit27-28', 'unit29-30', 'unit31-32', 'unit33-34', 'unit35-36', 'unit37-38', 'unit39-40', 'unit41-42', 'unit43-44', 'unit45-46', 'unit47-48', 'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark', 'scripts', 'tests', 'docs', 'deploy', 'README.md', 'CONTEXT.md', 'outputs', 'package.json', 'package-lock.json', 'playwright.config.js'];
const isDoc = file => /\.md$/i.test(file) || file.startsWith('docs/') || file.startsWith('.superpowers/');
const isWorkflow = file => /^(scripts\/check-workflow(?:\.config)?\.js|scripts\/ci\/|tests\/workflow\/|tests\/deploy\/workflow-contract\.test\.js$|\.github\/|AGENTS\.md|\.gitignore)/.test(file);
const readingBoundaryUnits=['53-54','55-56','57-58','59-60','65-66','67-68','69-70','71-72','73-74','75-76','77-78','79-80','81-82','83-84','85-86','87-88','89-90'];
const readingBoundaryChanged=files=>readingBoundaryUnits.filter(pair=>files.some(file=>file.startsWith('unit'+pair+'/')));
const materialRepairUnits=[7,9,11,15,17,19,21,31,33,35,...Array.from({length:34},(_,i)=>47+i*2)].map(n=>n+'-'+(n+1));
const worksheetRepairUnits=[...Array.from({length:22},(_,i)=>47+i*2),91,93,97,101,103,105,107].map(n=>n+'-'+(n+1));
const changedRepairUnits=(pairs,files)=>pairs.filter(pair=>files.some(file=>!isDoc(file)&&(file.startsWith('unit'+pair+'/')||file.startsWith('assets/unit'+pair+'/'))));
const unitFiles = root => fs.readdirSync(path.join(root, 'tests/unit')).filter(name => name.endsWith('.test.js')).sort().map(name => 'tests/unit/' + name);
function tasks(root, files) {
  const browser = names => ({ args: ['node_modules/@playwright/test/cli.js', 'test', '--reporter=line', ...names], inputs: runtimeInputs, browser: true });
  const changedTests = files.filter(file => /^tests\/e2e\/.*\.spec\.js$/.test(file) && fs.existsSync(path.join(root, file)));
  const readingChanged=readingBoundaryChanged(files),readingFilter=files.includes('tests/e2e/story-reading-boundary.spec.js')||!readingChanged.length?[]:['--grep',readingChanged.map(pair=>'Lesson '+pair+' ').join('|')];
  const materialChanged=changedRepairUnits(materialRepairUnits,files),paperChanged=changedRepairUnits(worksheetRepairUnits,files);
  const materialShared=files.some(file=>/^(core\/lesson49-(?:practice|task-inputs)\.(?:js|css)|tests\/(?:e2e\/reading-materials-acceptance\.spec\.js|support\/reading-materials-acceptance\.json))$/.test(file));
  const paperShared=files.some(file=>/^(unit49-50\/unit\.css|core\/unit-theme\.css|tests\/e2e\/worksheet-acceptance\.spec\.js)$/.test(file));
  return {
    'browser-login': {args:['node_modules/@playwright/test/cli.js','test','-c','playwright.login.config.js'],inputs:[...runtimeInputs,'server','tests/login','playwright.login.config.js'],browser:true},
    'browser-recovery-webkit': {args:['node_modules/@playwright/test/cli.js','test','-c','playwright.recovery.config.js'],inputs:[...runtimeInputs,'server','tests/login','playwright.login.config.js','playwright.recovery.config.js'],browser:'webkit'},
    'browser-statistics-webkit': {args:['node_modules/@playwright/test/cli.js','test','-c','playwright.statistics.config.js','--project=webkit-phone'],inputs:[...runtimeInputs,'server','playwright.login.config.js','playwright.statistics.config.js'],browser:'webkit'},
    workflow: { args: ['--test', 'tests/workflow/check-workflow.test.js', 'tests/workflow/ci.test.js', 'tests/deploy/workflow-contract.test.js'], inputs: ['scripts/check-workflow.js', 'scripts/check-workflow.config.js', 'scripts/ci', 'tests/workflow', 'tests/deploy/workflow-contract.test.js', '.github/workflows', 'package.json', 'package-lock.json'] },
    unit: { args: ['--test', ...unitFiles(root)], inputs: [...runtimeInputs, 'server'] },
    'browser-smoke': browser(['tests/e2e/smoke.spec.js', 'tests/e2e/routes.spec.js']),
    'browser-cache-cold': browser(['tests/e2e/course-cache-cold.spec.js', '--grep', '@cache-performance', '--trace=off']),
    'browser-cache-revisit': browser(['tests/e2e/course-cache-performance.spec.js', '--grep', '@cache-performance']),
    'browser-course-cache': browser(['tests/e2e/course-loading.spec.js', 'tests/e2e/course-image-transitions.spec.js', 'tests/e2e/course-cache-updates.spec.js', 'tests/e2e/course-cache-performance.spec.js', 'tests/e2e/course-cache-journeys.spec.js', 'tests/e2e/lesson-deployment.spec.js', '--grep-invert', '@cache-performance']),
    'browser-full': browser([]),
    'browser-audio': browser(['tests/e2e/audio-lifecycle.spec.js']),
    'browser-pronunciation': browser(['tests/e2e/pronunciation-repairs.spec.js', 'tests/e2e/unit7-8-audio.spec.js', '--grep', '修订录音|loose|新录音|只更换录音|I 词卡']),
    'browser-unit12': browser(['tests/e2e/unit1-2','tests/e2e/unit-thirteen-types.spec.js','tests/e2e/award-reveal.spec.js','tests/e2e/three-unit-awards.spec.js']),
    'browser-unit34': browser(['tests/e2e/unit3-4']),
    'browser-unit56': browser(['tests/e2e/unit5-6']),
    'browser-units1-6-exam': browser(['tests/e2e/unit1-2-exam.spec.js', 'tests/e2e/unit3-4-exam.spec.js', 'tests/e2e/unit5-6-exam.spec.js', 'tests/e2e/units1-6-exam-layout.spec.js', 'tests/e2e/units1-6-exam-upgrade.spec.js', 'tests/e2e/unit-dedup.spec.js']),
    'browser-unit78': browser(['tests/e2e/unit7-8']),
    'browser-units9-12': browser(['tests/e2e/unit9-10', 'tests/e2e/unit11-12', 'tests/e2e/units9-12-classroom.spec.js']),
    'browser-unit1314': browser(['tests/e2e/unit13-14']),
    'browser-unit1516': browser(['tests/e2e/unit15-16']),
    'browser-units17-30-review': browser(['tests/e2e/units17-30']),
    'browser-unit1718': browser(['tests/e2e/unit17-18']),
    'browser-unit1920': browser(['tests/e2e/unit19-20']),
    'browser-unit2122': browser(['tests/e2e/unit21-22']),
    'browser-unit2324': browser(['tests/e2e/unit23-24']),
    'browser-unit2526': browser(['tests/e2e/unit25-26','tests/e2e/unit-thirteen-types.spec.js']),
    'browser-unit2728': browser(['tests/e2e/unit27-28']),
    'browser-unit2930': browser(['tests/e2e/unit29-30']),
    'browser-unit3132': browser(['tests/e2e/unit31-32']),
    'browser-unit3334': browser(['tests/e2e/unit33-34']),
    'browser-unit3536': browser(['tests/e2e/unit35-36']),
    'browser-unit3738': browser(['tests/e2e/unit37-38']),
    'browser-unit3940': browser(['tests/e2e/unit39-40']),
    'browser-unit4142': browser(['tests/e2e/unit41-42']),
    'browser-unit4546': browser(['tests/e2e/unit45-46']),
    'browser-unit4344': browser(['tests/e2e/unit43-44']),
    'browser-unit5758': browser(['tests/e2e/unit57-58.spec.js','tests/e2e/unit57-58-story-layout.spec.js']),
    'browser-unit5960': browser(['tests/e2e/unit59-60.spec.js','tests/e2e/unit59-60-story-layout.spec.js']),
    'browser-unit6162': browser(['tests/e2e/unit61-62.spec.js','tests/e2e/unit61-62-story-layout.spec.js','tests/e2e/unit61-62-keepsake-art.spec.js']),
    'browser-unit6566': browser(['tests/e2e/unit65-66.spec.js','tests/e2e/unit65-66-story-layout.spec.js']),
    'browser-unit7172': browser(['tests/e2e/unit71-72.spec.js','tests/e2e/unit71-72-story-layout.spec.js']),
    'browser-unit7374': browser(['tests/e2e/unit73-74.spec.js','tests/e2e/unit73-74-story-layout.spec.js']),
    'browser-unit7576': browser(['tests/e2e/unit75-76.spec.js','tests/e2e/unit75-76-story-layout.spec.js']),
    'browser-unit8182': browser(['tests/e2e/unit81-82.spec.js','tests/e2e/unit81-82-story-layout.spec.js']),
    'browser-unit8384': browser(['tests/e2e/unit83-84.spec.js','tests/e2e/unit83-84-story-layout.spec.js']),
    'browser-unit8586': browser(['tests/e2e/unit85-86.spec.js','tests/e2e/unit85-86-story-layout.spec.js']),
    'browser-unit8788': browser(['tests/e2e/unit87-88.spec.js','tests/e2e/unit87-88-story-layout.spec.js']),
    'browser-unit143144': browser(['tests/e2e/unit143-144.spec.js','tests/e2e/unit143-144-story-layout.spec.js','tests/e2e/unit143-144-word-layout.spec.js']),
    'browser-unit141142': browser(['tests/e2e/unit141-142.spec.js','tests/e2e/unit141-142-story-layout.spec.js','tests/e2e/unit141-142-word-layout.spec.js']),
    'browser-unit139140': browser(['tests/e2e/unit139-140.spec.js','tests/e2e/unit139-140-story-layout.spec.js','tests/e2e/unit139-140-word-layout.spec.js']),
    'browser-unit137138': browser(['tests/e2e/unit137-138.spec.js','tests/e2e/unit137-138-story-layout.spec.js','tests/e2e/unit137-138-word-layout.spec.js']),
    'browser-unit135136': browser(['tests/e2e/unit135-136.spec.js','tests/e2e/unit135-136-story-layout.spec.js','tests/e2e/unit135-136-word-layout.spec.js']),
    'browser-unit133134': browser(['tests/e2e/unit133-134.spec.js','tests/e2e/unit133-134-story-layout.spec.js','tests/e2e/unit133-134-word-layout.spec.js']),
    'browser-unit131132': browser(['tests/e2e/unit131-132.spec.js','tests/e2e/unit131-132-story-layout.spec.js','tests/e2e/unit131-132-word-layout.spec.js']),
    'browser-unit129130': browser(['tests/e2e/unit129-130.spec.js','tests/e2e/unit129-130-story-layout.spec.js','tests/e2e/unit129-130-word-layout.spec.js']),
    'browser-unit127128': browser(['tests/e2e/unit127-128.spec.js','tests/e2e/unit127-128-story-layout.spec.js','tests/e2e/unit127-128-word-layout.spec.js']),
    'browser-unit125126': browser(['tests/e2e/unit125-126.spec.js','tests/e2e/unit125-126-story-layout.spec.js','tests/e2e/unit125-126-word-layout.spec.js']),
    'browser-unit123124': browser(['tests/e2e/unit123-124.spec.js','tests/e2e/unit123-124-story-layout.spec.js','tests/e2e/unit123-124-word-layout.spec.js']),
    'browser-unit121122': browser(['tests/e2e/unit121-122.spec.js','tests/e2e/unit121-122-story-layout.spec.js','tests/e2e/unit121-122-word-layout.spec.js']),
    'browser-unit119120': browser(['tests/e2e/unit119-120.spec.js','tests/e2e/unit119-120-story-layout.spec.js','tests/e2e/unit119-120-word-layout.spec.js']),
    'browser-unit117118': browser(['tests/e2e/unit117-118.spec.js','tests/e2e/unit117-118-story-layout.spec.js','tests/e2e/unit117-118-word-layout.spec.js']),
    'browser-unit115116': browser(['tests/e2e/unit115-116.spec.js','tests/e2e/unit115-116-story-layout.spec.js','tests/e2e/unit115-116-word-layout.spec.js']),
    'browser-unit113114': browser(['tests/e2e/unit113-114.spec.js','tests/e2e/unit113-114-story-layout.spec.js','tests/e2e/unit113-114-word-layout.spec.js']),
    'browser-unit111112': browser(['tests/e2e/unit111-112.spec.js','tests/e2e/unit111-112-story-layout.spec.js','tests/e2e/unit111-112-word-layout.spec.js']),
    'browser-unit109110': browser(['tests/e2e/unit109-110.spec.js','tests/e2e/unit109-110-story-layout.spec.js']),
    'browser-unit107108': browser(['tests/e2e/unit107-108.spec.js','tests/e2e/unit107-108-story-layout.spec.js']),
    'browser-unit105106': browser(['tests/e2e/unit105-106.spec.js','tests/e2e/unit105-106-story-layout.spec.js']),
    'browser-unit103104': browser(['tests/e2e/unit103-104.spec.js','tests/e2e/unit103-104-story-layout.spec.js']),
    'browser-unit101102': browser(['tests/e2e/unit101-102.spec.js','tests/e2e/unit101-102-story-layout.spec.js']),
    'browser-unit99100': browser(['tests/e2e/unit99-100.spec.js','tests/e2e/unit99-100-story-layout.spec.js']),
    'browser-unit9798': browser(['tests/e2e/unit97-98.spec.js','tests/e2e/unit97-98-story-layout.spec.js']),
    'browser-unit9596': browser(['tests/e2e/unit95-96.spec.js','tests/e2e/unit95-96-story-layout.spec.js']),
    'browser-unit9394': browser(['tests/e2e/unit93-94.spec.js','tests/e2e/unit93-94-story-layout.spec.js']),
    'browser-unit9192': browser(['tests/e2e/unit91-92.spec.js','tests/e2e/unit91-92-story-layout.spec.js']),
    'browser-unit8990': browser(['tests/e2e/unit89-90.spec.js','tests/e2e/unit89-90-story-layout.spec.js']),
    'browser-unit7980': browser(['tests/e2e/unit79-80.spec.js','tests/e2e/unit79-80-story-layout.spec.js']),
    'browser-unit7778': browser(['tests/e2e/unit77-78.spec.js','tests/e2e/unit77-78-story-layout.spec.js']),
    'browser-unit6970': browser(['tests/e2e/unit69-70.spec.js','tests/e2e/unit69-70-story-layout.spec.js']),
    'browser-unit6768': browser(['tests/e2e/unit67-68.spec.js','tests/e2e/unit67-68-story-layout.spec.js']),
    'browser-unit6364': browser(['tests/e2e/unit63-64.spec.js','tests/e2e/unit63-64-story-layout.spec.js']),
    'browser-unit5556': browser(['tests/e2e/unit55-56.spec.js','tests/e2e/unit55-56-story-layout.spec.js']),
    'browser-unit5354': browser(['tests/e2e/unit53-54.spec.js','tests/e2e/unit53-54-story-layout.spec.js']),
    'browser-unit5152': browser(['tests/e2e/unit51-52.spec.js','tests/e2e/unit51-52-story-layout.spec.js']),
    'browser-unit4950': browser(['tests/e2e/unit49-50-current.spec.js','tests/e2e/unit49-50-story-layout.spec.js','tests/e2e/unit49-50-upgrade.spec.js']),
    'browser-unit4748': browser(['tests/e2e/unit47-48']),
    'browser-unit4546': browser(['tests/e2e/unit45-46']),
    'browser-certificates': browser(['tests/e2e/unit49-50-certificate.spec.js', 'tests/e2e/unit35-36.spec.js', '--grep', '证书|领奖|打印|图像加载']),
    'browser-units1-30-tasks': browser(['tests/e2e/units1-30-tasks.spec.js', 'tests/e2e/units1-30-revision.spec.js', 'tests/e2e/units1-30-scene-cues.spec.js', 'tests/e2e/units-room-tasks.spec.js', 'tests/e2e/units1-30-acceptance.spec.js']),
    'browser-retry-feedback': browser(['tests/e2e/retry-feedback.spec.js', 'tests/e2e/l49-focus.spec.js']),
    'browser-common-interactions': browser(['tests/e2e/common-interactions.spec.js', 'tests/e2e/unit-thirteen-types.spec.js']),
    'browser-completion': browser(['tests/e2e/l49-v14.spec.js', 'tests/e2e/submission-statistics.spec.js', 'tests/e2e/unit1-2-completion.spec.js']),
    'browser-state': browser(['tests/e2e/home-progress.spec.js', 'tests/e2e/l49-progress.spec.js']),
    'browser-layout': browser(['tests/e2e/accessibility.spec.js', 'tests/e2e/mobile-release.spec.js']),
    'browser-changed': browser(changedTests.length ? changedTests : ['tests/e2e/smoke.spec.js']),
    'browser-reading-boundary': browser(['tests/e2e/story-reading-boundary.spec.js',...readingFilter]),
    'browser-reading-materials': browser(['tests/e2e/reading-materials-acceptance.spec.js',...(!materialShared&&materialChanged.length?['--grep',materialChanged.map(pair=>'Lesson '+pair+' ').join('|')]:[])]),
    'browser-worksheets': browser(['tests/e2e/worksheet-acceptance.spec.js',...(!paperShared&&paperChanged.length?['--grep',paperChanged.map(pair=>'Lesson '+pair+' ').join('|')]:[])]),
    'browser-wording-repairs': browser(['tests/e2e/lesson-wording-repairs.spec.js']),
    'browser-directory-fonts': {args:['node_modules/@playwright/test/cli.js','test','-c','playwright.login.config.js','tests/login/directory-font-preparation.spec.js'],inputs:[...runtimeInputs,'server','tests/login','playwright.login.config.js'],browser:true},
    'browser-lessons': browser(['tests/e2e/l50-assessment.spec.js', 'tests/e2e/l51-progress.spec.js', 'tests/e2e/l52-progress.spec.js', 'tests/e2e/l53-progress.spec.js', 'tests/e2e/l54-progress.spec.js', 'tests/e2e/soundmark-progress.spec.js']),
  };
}
function select(files) {
  const selected = [];
  if(readingBoundaryChanged(files).length||files.includes('tests/e2e/story-reading-boundary.spec.js'))selected.push('browser-reading-boundary');
  if(changedRepairUnits(materialRepairUnits,files).length||files.some(file=>/^(core\/lesson49-(?:practice|task-inputs)\.(?:js|css)|tests\/(?:e2e\/reading-materials-acceptance\.spec\.js|support\/reading-materials-acceptance\.json))$/.test(file)))selected.push('browser-reading-materials');
  if(changedRepairUnits(worksheetRepairUnits,files).length||files.some(file=>/^(unit49-50\/unit\.css|core\/unit-theme\.css|tests\/e2e\/worksheet-acceptance\.spec\.js)$/.test(file)))selected.push('browser-worksheets');
  if(files.some(file=>/^(unit(?:31-32|79-80)\/grammar\.js|unit61-62\/content\.js|tests\/e2e\/lesson-wording-repairs\.spec\.js)$/.test(file)))selected.push('browser-wording-repairs');
  if(files.some(file=>/^(core\/course-(?:cache|loader)\.js|scripts\/course-packages\.js|server\/(?:app\.js|public\/portal\.js)|tests\/login\/directory-font-preparation\.spec\.js|tests\/unit\/directory-font-package\.test\.js)$/.test(file)))selected.push('browser-directory-fonts');
  if (files.some(file => /^(core\/lesson49-(?:practice|subjects|experience)\.(?:js|css)$|unit1-2\/completion\.(?:js|css)$|tests\/support\/completion-layout\.js$|tests\/e2e\/(?:l49-v14|submission-statistics|unit1-2-completion)\.spec\.js$)/.test(file))) selected.push('browser-completion', 'browser-statistics-webkit');
  if (files.some(file => /^(core\/lesson49-(?:practice|subjects|experience)\.(?:js|css)|unit1-2\/completion\.(?:js|css)|tests\/(?:e2e|login)\/submission-statistics\.spec\.js|tests\/fixtures\/submission-statistics-before\/|playwright\.statistics\.config\.js)/.test(file))) selected.push('browser-statistics-webkit');
  if (files.some(file => /^(core\/course-(?:cache|loader|worker)\.js|scripts\/course-packages\.js|server\/public\/access-(?:client|worker)\.js|tests\/login\/(?:server\.js|helpers\.js|course-loading-recovery\.spec\.js)|tests\/support\/course-response-faults\.js|playwright\.(?:recovery|login)\.config\.js)$/.test(file))) selected.push('browser-recovery-webkit');
  if(files.some(file=>/^(server\/|tests\/login\/|playwright.login.config.js|deploy\/login\/|core\/(?:course-(?:cache|loader|worker)|lesson49-practice)\.js|scripts\/(?:course-packages|public-base-path|build-login)\.js|unit[^/]+\/(?:content|unit)\.js)/.test(file)))selected.push('browser-login');
  if (files.some(isWorkflow)) selected.push('workflow');
  const code = files.filter(file => !isDoc(file) && !isWorkflow(file));
  if (!code.length) return selected;
  selected.push('unit');
  if (code.some(file => /^tests\/e2e\/.*\.spec\.js$/.test(file))) selected.push('browser-changed');
  const runtime = code.filter(file => !file.startsWith('tests/'));
  if (runtime.some(file => /^(core\/(?:lesson49-(?:practice|task-inputs|experience)|unit-theme)\.(?:js|css)|unit[^/]*\/(?:unit|content)\.js)$/.test(file))) selected.push('browser-common-interactions');
  if (runtime.length) selected.push('browser-smoke');
  if (runtime.some(file => /^(core\/course-(?:cache|loader|worker)\.js|scripts\/(?:course-packages|public-base-path|http-header-contract|build-static)\.js|deploy\/nginx\/canranstudio-lesson-location\.conf)$/.test(file))) selected.push('browser-cache-cold', 'browser-cache-revisit', 'browser-course-cache');
  if (runtime.some(file => /audio|feedback|\.mp3$/.test(file))) selected.push('browser-audio');
  if (code.some(file => /^(unit(?:1-2|5-6|7-8|11-12)\/|soundmark\/|core\/audio-player\.js|scripts\/media\/|tests\/fixtures\/pronunciation)/.test(file))) selected.push('browser-pronunciation');
  if (code.some(file => /^(unit1-2\/|assets\/unit1-2\/|tests\/fixtures\/unit1-2-.*-before\/|tests\/support\/unit1-2-flow\.js)/.test(file))) selected.push('browser-unit12');
  if (code.some(file => /^(unit3-4\/|assets\/unit3-4\/|tests\/fixtures\/unit3-4-.*-before\/|tests\/support\/unit3-4-flow\.js)/.test(file))) selected.push('browser-unit34');
  if (code.some(file => /^(unit5-6\/|assets\/unit5-6(?:-current)?\/|tests\/fixtures\/unit5-6-(?:.*-before|before-v154)\/|tests\/support\/(?:unit5-6-flow|unit56-(?:answers|v154))\.js|scripts\/(?:vendor-unit5-6-font\.py|build-unit56-labels\.py))/.test(file))) selected.push('browser-unit56');
  if (code.some(file => /^(unit(?:1-2|3-4|5-6)\/|tests\/fixtures\/unit(?:1-2|3-4|5-6)-short-exam-before\/|tests\/support\/unit(?:s1-6-exam|(?:1-2|3-4|5-6)-flow)\.js)/.test(file))) selected.push('browser-units1-6-exam');
  if (code.some(file => /^(unit7-8\/|assets\/unit7-8\/|tests\/fixtures\/unit7-8-(?:voiced|classroom|exam3)-before\/|tests\/support\/(?:unit7-8-(?:flow|exam)|unit78-(?:fivezones|legacy))\.js|tests\/fixtures\/unit7-8-before-fivezones\/)/.test(file))) selected.push('browser-unit78');
  if (code.some(file => /^(unit(?:9-10|11-12)\/|assets\/unit(?:9-10|11-12)\/|tests\/fixtures\/unit(?:9-10|11-12)-(?:voiced|classroom|short-exam)-before\/|tests\/support\/unit(?:9-10|11-12)-(?:flow|exam)\.js|tests\/support\/unit(?:910|1112)-(?:fivezones|legacy)\.js|tests\/fixtures\/unit(?:9-10|11-12)-before-fivezones\/)/.test(file))) selected.push('browser-units9-12');
  if (code.some(file => /^(unit13-14\/|assets\/unit13-14\/|tests\/support\/(?:unit13-14-(?:flow|exam)|unit1314-(?:fivezones|legacy))\.js|tests\/fixtures\/unit13-14-)/.test(file))) selected.push('browser-unit1314');
  if (code.some(file => /^(unit15-16\/|assets\/unit15-16\/|tests\/support\/(?:unit15-16-(?:flow|exam)|unit1516-(?:fivezones|legacy))\.js|tests\/fixtures\/unit15-16-)/.test(file))) selected.push('browser-unit1516');
  if (code.some(file => /^(core\/classroom-scene\.(?:js|css)|scripts\/art\/(?:build-units17-30-scenes|redraw-classroom-stages)\.py|unit(?:17-18|19-20|21-22|23-24|25-26|27-28|29-30)\/|assets\/unit(?:17-18|19-20|21-22|23-24|25-26|27-28|29-30)\/|tests\/(?:support\/units17-30-exam\.js|fixtures\/unit(?:17-18|19-20|21-22|23-24|25-26|27-28|29-30)-classroom-before\/|e2e\/units17-30))/.test(file))) selected.push('browser-units17-30-review');
  if (code.some(file => /^(unit17-18\/|assets\/unit17-18\/|tests\/support\/(?:unit17-18-flow|unit1718-(?:fivezones|legacy))\.js|tests\/fixtures\/unit17-18-)/.test(file))) selected.push('browser-unit1718');
  if (code.some(file => /^(unit19-20\/|assets\/unit19-20\/|tests\/support\/(?:unit19-20-flow|unit1920-(?:fivezones|legacy))\.js|tests\/fixtures\/unit19-20-)/.test(file))) selected.push('browser-unit1920');
  if (code.some(file => /^(unit21-22\/|assets\/unit21-22\/|core\/lesson49-task-inputs\.(?:js|css)$|tests\/fixtures\/unit21-22-tasks-before\/|tests\/support\/(?:unit21-22-flow|unit2122-(?:fivezones|legacy))\.js|tests\/fixtures\/unit21-22-before-fivezones\/)/.test(file))) selected.push('browser-unit2122');
  if (code.some(file => /^(unit23-24\/|assets\/unit23-24\/|tests\/support\/unit23-24-flow\.js|tests\/support\/(?:unit2324-(?:fivezones|legacy))\.js|tests\/fixtures\/unit23-24-before-fivezones\/)/.test(file))) selected.push('browser-unit2324');
  if (code.some(file => /^(unit25-26\/|assets\/unit25-26\/|tests\/support\/unit25-26-flow\.js|tests\/support\/(?:unit2526-(?:fivezones|legacy))\.js|tests\/fixtures\/unit25-26-before-fivezones\/)/.test(file))) selected.push('browser-unit2526');
  if (code.some(file => /^(unit27-28\/|assets\/unit27-28\/|tests\/support\/unit27-28-flow\.js|tests\/support\/(?:unit2728-(?:fivezones|legacy))\.js|tests\/fixtures\/unit27-28-before-fivezones\/)/.test(file))) selected.push('browser-unit2728');
  if (code.some(file => /^(unit31-32\/|assets\/unit31-32\/|tests\/support\/unit31-32-flow\.js|tests\/support\/(?:unit3132-(?:fivezones|legacy))\.js|tests\/fixtures\/unit31-32-before-fivezones\/)/.test(file))) selected.push('browser-unit3132');
  if (code.some(file => /^(unit33-34\/|assets\/unit33-34\/|tests\/support\/unit33-34-flow\.js|tests\/support\/(?:unit3334-(?:fivezones|legacy))\.js|tests\/fixtures\/unit33-34-before-fivezones\/)/.test(file))) selected.push('browser-unit3334');
  if (code.some(file => /^(unit35-36\/|assets\/unit35-36\/|tests\/support\/unit35-36-flow\.js|tests\/support\/(?:unit3536-(?:fivezones|legacy))\.js|tests\/fixtures\/unit35-36-before-fivezones\/)/.test(file))) selected.push('browser-unit3536');
  if (code.some(file => /^(unit37-38\/|assets\/unit37-38\/|tests\/support\/unit37-38-flow\.js|tests\/support\/(?:unit3738-(?:fivezones|legacy))\.js|tests\/fixtures\/unit37-38-before-fivezones\/)/.test(file))) selected.push('browser-unit3738');
  if (code.some(file => /^(unit39-40\/|assets\/unit39-40\/|tests\/support\/unit39-40-flow\.js|tests\/support\/(?:unit3940-(?:fivezones|legacy))\.js|tests\/fixtures\/unit39-40-before-fivezones\/)/.test(file))) selected.push('browser-unit3940');
  if (code.some(file => /^(unit45-46\/|assets\/unit45-46\/|tests\/support\/unit4546(?:-v153(?:-legacy)?)?\.js|tests\/fixtures\/unit45-46-before-v153\/)/.test(file))) selected.push('browser-unit4546');
  if (code.some(file => /^(unit43-44\/|assets\/unit43-44\/|tests\/support\/unit4344(?:-v153(?:-legacy)?)?\.js|tests\/fixtures\/unit43-44-before-v153\/)/.test(file))) selected.push('browser-unit4344');
  if (code.some(file => /^(unit57-58\/|assets\/unit57-58\/|tests\/support\/unit5758\.js)/.test(file))) selected.push('browser-unit5758');
  if (code.some(file => /^(unit59-60\/|assets\/unit59-60\/|tests\/support\/unit5960\.js)/.test(file))) selected.push('browser-unit5960');
  if (code.some(file => /^(unit61-62\/|assets\/unit61-62\/|tests\/support\/unit6162\.js)/.test(file))) selected.push('browser-unit6162');
  if (code.some(file => /^(unit65-66\/|assets\/unit65-66\/|tests\/support\/unit6566\.js)/.test(file))) selected.push('browser-unit6566');
  if (code.some(file => /^(unit67-68\/|assets\/unit67-68\/|tests\/support\/unit6768\.js)/.test(file))) selected.push('browser-unit6768');
  if (code.some(file => /^(unit71-72\/|assets\/unit71-72\/|tests\/support\/unit7172\.js)/.test(file))) selected.push('browser-unit7172');
  if (code.some(file => /^(unit73-74\/|assets\/unit73-74\/|tests\/support\/unit7374\.js)/.test(file))) selected.push('browser-unit7374');
  if (code.some(file => /^(unit75-76\/|assets\/unit75-76\/|tests\/support\/unit7576\.js)/.test(file))) selected.push('browser-unit7576');
  if (code.some(file => /^(unit77-78\/|assets\/unit77-78\/|tests\/support\/unit7778\.js)/.test(file))) selected.push('browser-unit7778');
  if (code.some(file => /^(unit79-80\/|assets\/unit79-80\/|tests\/support\/unit7980\.js)/.test(file))) selected.push('browser-unit7980');
  if (code.some(file => /^(unit81-82\/|assets\/unit81-82\/|tests\/support\/unit8182\.js)/.test(file))) selected.push('browser-unit8182');
  if (code.some(file => /^(unit83-84\/|assets\/unit83-84\/|tests\/support\/unit8384\.js)/.test(file))) selected.push('browser-unit8384');
  if (code.some(file => /^(unit87-88\/|assets\/unit87-88\/|tests\/support\/unit8788\.js)/.test(file))) selected.push('browser-unit8788');
  if (code.some(file => /^(unit93-94\/|assets\/unit93-94\/|tests\/support\/unit9394\.js)/.test(file))) selected.push('browser-unit9394');
  if (code.some(file => /^(unit95-96\/|assets\/unit95-96\/|tests\/support\/unit9596\.js)/.test(file))) selected.push('browser-unit9596');
  if (code.some(file => /^(unit97-98\/|assets\/unit97-98\/|tests\/support\/unit9798\.js)/.test(file))) selected.push('browser-unit9798');
  if (code.some(file => /^(unit99-100\/|assets\/unit99-100\/|tests\/support\/unit99100\.js)/.test(file))) selected.push('browser-unit99100');
  if (code.some(file => /^(unit101-102\/|assets\/unit101-102\/|tests\/support\/unit101102\.js)/.test(file))) selected.push('browser-unit101102');
  if (code.some(file => /^(unit103-104\/|assets\/unit103-104\/|tests\/support\/unit103104\.js)/.test(file))) selected.push('browser-unit103104');
  if (code.some(file => /^(unit105-106\/|assets\/unit105-106\/|tests\/support\/unit105106\.js)/.test(file))) selected.push('browser-unit105106');
  if (code.some(file => /^(unit107-108\/|assets\/unit107-108\/|tests\/support\/unit107108\.js)/.test(file))) selected.push('browser-unit107108');
  if (code.some(file => /^(unit109-110\/|assets\/unit109-110\/|tests\/support\/unit109110\.js)/.test(file))) selected.push('browser-unit109110');
  if (code.some(file => /^(unit111-112\/|assets\/unit111-112\/|tests\/support\/unit111112\.js)/.test(file))) selected.push('browser-unit111112');
  if (code.some(file => /^(unit113-114\/|assets\/unit113-114\/|tests\/support\/unit113114\.js)/.test(file))) selected.push('browser-unit113114');
  if (code.some(file => /^(unit115-116\/|assets\/unit115-116\/|tests\/support\/unit115116\.js)/.test(file))) selected.push('browser-unit115116');
  if (code.some(file => /^(unit117-118\/|assets\/unit117-118\/|tests\/support\/unit117118\.js)/.test(file))) selected.push('browser-unit117118');
  if (code.some(file => /^(unit119-120\/|assets\/unit119-120\/|tests\/support\/unit119120\.js)/.test(file))) selected.push('browser-unit119120');
  if (code.some(file => /^(unit121-122\/|assets\/unit121-122\/|tests\/support\/unit121122\.js)/.test(file))) selected.push('browser-unit121122');
  if (code.some(file => /^(unit123-124\/|assets\/unit123-124\/|tests\/support\/unit123124\.js)/.test(file))) selected.push('browser-unit123124');
  if (code.some(file => /^(unit125-126\/|assets\/unit125-126\/|tests\/support\/unit125126\.js)/.test(file))) selected.push('browser-unit125126');
  if (code.some(file => /^(unit127-128\/|assets\/unit127-128\/|tests\/support\/unit127128\.js)/.test(file))) selected.push('browser-unit127128');
  if (code.some(file => /^(unit129-130\/|assets\/unit129-130\/|tests\/support\/unit129130\.js)/.test(file))) selected.push('browser-unit129130');
  if (code.some(file => /^(unit131-132\/|assets\/unit131-132\/|tests\/support\/unit131132\.js)/.test(file))) selected.push('browser-unit131132');
  if (code.some(file => /^(unit133-134\/|assets\/unit133-134\/|tests\/support\/unit133134\.js)/.test(file))) selected.push('browser-unit133134');
  if (code.some(file => /^(unit135-136\/|assets\/unit135-136\/|tests\/support\/unit135136\.js)/.test(file))) selected.push('browser-unit135136');
  if (code.some(file => /^(unit137-138\/|assets\/unit137-138\/|tests\/support\/unit137138\.js)/.test(file))) selected.push('browser-unit137138');
  if (code.some(file => /^(unit139-140\/|assets\/unit139-140\/|tests\/support\/unit139140\.js)/.test(file))) selected.push('browser-unit139140');
  if (code.some(file => /^(unit141-142\/|assets\/unit141-142\/|tests\/support\/unit141142\.js)/.test(file))) selected.push('browser-unit141142');
  if (code.some(file => /^(unit143-144\/|assets\/unit143-144\/|tests\/support\/unit143144\.js)/.test(file))) selected.push('browser-unit143144');
  if (code.some(file => /^(unit91-92\/|assets\/unit91-92\/|tests\/support\/unit9192\.js)/.test(file))) selected.push('browser-unit9192');
  if (code.some(file => /^(unit89-90\/|assets\/unit89-90\/|tests\/support\/unit8990\.js)/.test(file))) selected.push('browser-unit8990');
  if (code.some(file => /^(unit85-86\/|assets\/unit85-86\/|tests\/support\/unit8586\.js)/.test(file))) selected.push('browser-unit8586');
  if (code.some(file => /^(unit69-70\/|assets\/unit69-70\/|tests\/support\/unit6970\.js)/.test(file))) selected.push('browser-unit6970');
  if (code.some(file => /^(unit63-64\/|assets\/unit63-64\/|tests\/support\/unit6364\.js)/.test(file))) selected.push('browser-unit6364');
  if (code.some(file => /^(unit55-56\/|assets\/unit55-56\/|tests\/support\/unit5556\.js)/.test(file))) selected.push('browser-unit5556');
  if (code.some(file => /^(unit53-54\/|assets\/unit53-54\/|tests\/support\/unit5354\.js)/.test(file))) selected.push('browser-unit5354');
  if (code.some(file => /^(unit51-52\/|assets\/unit51-52\/|tests\/support\/unit5152\.js)/.test(file))) selected.push('browser-unit5152');
  if (code.some(file => /^(unit49-50\/|assets\/unit49-50\/|tests\/support\/unit4950\.js)/.test(file))) selected.push('browser-unit4950');
  if (code.some(file => /^(unit47-48\/|assets\/unit47-48\/|tests\/support\/unit4748\.js)/.test(file))) selected.push('browser-unit4748');
  if (code.some(file => /^(unit45-46\/|assets\/unit45-46\/|tests\/support\/unit4546\.js)/.test(file))) selected.push('browser-unit4546');
  if (code.some(file => /^(unit41-42\/|assets\/unit41-42\/|tests\/support\/unit4142(?:-v153(?:-legacy)?)?\.js|tests\/fixtures\/unit41-42-before-v153\/)/.test(file))) selected.push('browser-unit4142');
  if (code.some(file => /^unit49-50\/certificate\.(?:js|css)$/.test(file))) selected.push('browser-certificates');
  if (code.some(file => /^(award-book\/|scripts\/award-book-bundle\.js$|core\/(?:award-rules|unit-awards|story-certificate|award-reveal|award-gif|award-card-layout)\.|core\/vendor\/gifenc|assets\/awards\/|tests\/support\/unit1-2-award-flow\.js)/.test(file))) selected.push('browser-unit12', 'browser-login');
  if (code.some(file => /^(unit29-30\/|assets\/unit29-30\/|tests\/support\/unit29-30-flow\.js|tests\/support\/(?:unit2930-(?:fivezones|legacy))\.js|tests\/fixtures\/unit29-30-before-fivezones\/)/.test(file))) selected.push('browser-unit2930');
  if (code.some(file => /^(core\/lesson49-task-inputs\.(?:js|css)$|unit(?:1-2|3-4|5-6|7-8|9-10|11-12|13-14|15-16|17-18|19-20|21-22|23-24|25-26|27-28|29-30)\/(?:content|unit|scene)\.(?:js|css)$|tests\/(?:e2e\/(?:units1-30-|units-room-tasks)|support\/units1-30-|fixtures\/units1-30-tasks-before\/))/.test(file))) selected.push('browser-units1-30-tasks');
  if (code.some(file => /^(unit[^/]*\/|lesson\d+\/|soundmark\/|core\/(?:lesson49-practice|lesson49-subjects|course-catalog)\.js|tests\/(?:e2e\/retry-feedback\.spec\.js|fixtures\/l49-subjects-before-retry\.js))/.test(file))) selected.push('browser-retry-feedback');
  if (runtime.some(file => /^(lesson49\/|core\/)|progress|storage/.test(file))) selected.push('browser-state');
  if (runtime.some(file => /^(lesson5[0-4]\/|soundmark\/)/.test(file))) selected.push('browser-lessons');
  if (runtime.some(file => /\.css$|adventure|landmark|device-profile/.test(file))) selected.push('browser-layout');
  return selected;
}
module.exports = { tasks, select, quick: ['workflow', 'unit'] };
