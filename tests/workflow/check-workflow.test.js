'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { runTask, changedFiles, checkDocuments, planChecks } = require('../../scripts/check-workflow');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-check-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'src'));
  fs.mkdirSync(path.join(root, 'test-results'));
  fs.writeFileSync(path.join(root, 'src/app.js'), 'original');
  fs.writeFileSync(path.join(root, 'package-lock.json'), '{}');
  fs.writeFileSync(path.join(root, '.gitignore'), 'test-results/\n.cache/\n');
  execFileSync('git', ['init', '-q', root]);
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
    'commit', '-qm', 'fixture'], { cwd: root });
  return root;
}
const context = { node: 'test', browser: 'test-browser-1' };
test('shared course endings include authenticated navigation checks in both engines',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['core/story-certificate.js','unit1-2/completion.js','server/app.js']){
  const selected=config.select([file]);assert(selected.includes('browser-course-ending'));assert(selected.includes('browser-course-ending-webkit'));
 }
});
test('the isolated review bench has dedicated Node and two-engine checks',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['review-bench/runtime.js','scripts/review-bench.js','playwright.review.config.js','tests/review/bench.spec.js']){
  const plan=config.select([file]);for(const id of ['review-unit','browser-review','browser-review-webkit'])assert(plan.includes(id),file+' '+id);
  assert(!plan.includes('browser-smoke'),file+' should not run unrelated production journeys');
 }
 const tasks=config.tasks(path.resolve(__dirname,'../..'),[]);
 assert(tasks['browser-review'].inputs.includes('review-bench'));
 assert(tasks['browser-review-webkit'].args.includes('--project=webkit'));
});
const task = {
  args: ['-e', "require('node:fs').appendFileSync('test-results/count', 'x')"],
  inputs: ['src', 'package-lock.json', 'tests'],
};
const run = (root, overrides = {}) => runTask({ root, id: 'sample', task, context, log: () => {}, ...overrides });
const count = root => fs.readFileSync(path.join(root, 'test-results/count'), 'utf8').length;

test('unchanged successful inputs reuse evidence without executing the command again', async t => {
  const root = fixture(t);
  assert.equal((await run(root)).cached, false);
  const reused = await run(root);
  assert.equal(reused.cached, true);
  assert.equal(count(root), 1);
  assert.equal(typeof reused.durationMs, 'number');
  fs.writeFileSync(path.join(root, 'notes.md'), 'Unrelated prose');
  assert.equal((await run(root)).cached, true);
});

test('source, added file, deletion, lockfile, test code, command and environment invalidate evidence', async t => {
  const root = fixture(t);
  await run(root);
  for (const mutate of [
    () => fs.writeFileSync(path.join(root, 'src/app.js'), 'changed'),
    () => fs.writeFileSync(path.join(root, 'src/new.js'), 'new'),
    () => fs.unlinkSync(path.join(root, 'src/new.js')),
    () => fs.writeFileSync(path.join(root, 'package-lock.json'), '{"changed":true}'),
    () => { fs.mkdirSync(path.join(root, 'tests')); fs.writeFileSync(path.join(root, 'tests/new.test.js'), 'new assertion'); },
  ]) {
    mutate();
    assert.equal((await run(root)).cached, false);
    assert.equal((await run(root)).cached, true);
  }
  assert.equal((await run(root, { context: { ...context, browser: 'test-browser-2' } })).cached, false);
  assert.equal((await run(root, { task: { ...task, args: [...task.args, 'extra argument'] } })).cached, false);
});

test('force reruns; failed commands remove previous evidence and cannot become cache hits', async t => {
  const root = fixture(t);
  await run(root);
  await run(root, { force: true });
  assert.equal(count(root), 2);
  await assert.rejects(run(root, { force: true, task: { ...task, args: ['-e', 'process.exit(3)'] } }), /failed/);
  assert.equal((await run(root)).cached, false);
});

test('a source change during a successful command invalidates the run', async t => {
  const root = fixture(t);
  await assert.rejects(run(root, { task: { ...task, args: ['-e',
    "require('node:fs').writeFileSync('src/app.js', 'changed during test')"] } }), /changed during/);
  assert.equal((await run(root)).cached, false);
});

test('missing required artifacts force a rerun and missing new outputs fail', async t => {
  const root = fixture(t);
  const withOutput = { ...task, outputs: ['test-results/count'] };
  await run(root, { task: withOutput });
  fs.unlinkSync(path.join(root, 'test-results/count'));
  assert.equal((await run(root, { task: withOutput })).cached, false);
  await assert.rejects(run(root, { task: { ...task, outputs: ['test-results/missing.json'] } }), /output/);
});

test('malformed evidence is ignored; concurrent runs do not share a partial receipt', async t => {
  const root = fixture(t);
  await run(root);
  const dir = path.join(root, '.cache/check-workflow');
  fs.writeFileSync(path.join(dir, 'sample.json'), '{invalid');
  assert.equal((await run(root)).cached, false);
  fs.mkdirSync(path.join(dir, 'sample.lock'));
  await assert.rejects(run(root, { force: true }), /already running/);
});

test('change discovery includes staged, unstaged, deleted and untracked paths', t => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'staged.md'), 'staged');
  execFileSync('git', ['add', 'staged.md'], { cwd: root });
  fs.writeFileSync(path.join(root, 'package-lock.json'), 'changed');
  fs.unlinkSync(path.join(root, 'src/app.js'));
  fs.writeFileSync(path.join(root, 'new file.md'), 'new');
  assert.deepEqual(changedFiles(root, 'HEAD'), ['new file.md', 'package-lock.json', 'src/app.js', 'staged.md']);
  assert.throws(() => changedFiles(root, 'missing-ref'), /./);
});

test('document checks resolve relative links, ignore web and code examples, and reject broken links', t => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'README.md'), '[source](src/app.js) [web](https://example.com)\n```md\n[example](missing)\n```');
  checkDocuments(root, ['README.md']);
  fs.appendFileSync(path.join(root, 'README.md'), '\n[broken](missing.md)');
  assert.throws(() => checkDocuments(root, ['README.md']), /missing.md/);
});

test('a documentation-only plan avoids runtime tests; source changes retain relevant checks', () => {
  const config = require('../../scripts/check-workflow.config');
  assert.deepEqual(planChecks(config, ['docs/note.md']), []);
  assert.ok(planChecks(config, ['core/audio-player.js']).includes('unit'));
  assert.ok(planChecks(config, ['core/audio-player.js']).some(id => id.startsWith('browser')));
  assert.ok(planChecks(config, ['scripts/check-workflow.js']).includes('workflow'));
  assert.ok(planChecks(config, ['some-new-runtime.js']).includes('unit'));
  assert.ok(planChecks(config, ['award-book/App.jsx']).includes('browser-login'));
  assert.ok(config.tasks(process.cwd(), [])['browser-login']?.inputs?.includes('award-book'));
  assert.ok(planChecks(config, ['student-ui/AccountDialog.jsx']).includes('browser-login'));
  assert.ok(planChecks(config, ['student-ui/AccountDialog.jsx']).includes('browser-recovery-webkit'));
  assert.ok(config.tasks(process.cwd(), [])['browser-login']?.inputs?.includes('student-ui'));
  assert.ok(require('../../playwright.recovery.config').testMatch.includes('student-navigation.spec.js'));
  assert.ok(require('../../playwright.recovery.config').testMatch.includes('student-transition.spec.js'));
  assert.ok(require('../../playwright.recovery.config').testMatch.includes('award-gif-edges.spec.js'));
  assert.ok(planChecks(config, ['core/award-gif.js']).includes('browser-award-gif-webkit'));
  assert.ok(planChecks(config, ['core/award-card-layout.js']).includes('browser-award-gif-webkit'));
});

test('shared completion changes always include legacy, paired-unit and authenticated record checks', () => {
  const config = require('../../scripts/check-workflow.config');
  for (const file of [
    'core/lesson49-practice.js', 'core/lesson49-subjects.js',
    'core/lesson49-experience.js', 'core/lesson49-experience.css',
    'unit1-2/completion.js', 'unit1-2/completion.css',
    'tests/support/completion-layout.js'
  ]) {
    const plan = planChecks(config, [file]);
    const definitions = config.tasks(process.cwd(), [file]);
    const commands = plan.flatMap(id => definitions[id].args);
    for (const required of [
      'tests/e2e/l49-v14.spec.js', 'tests/e2e/submission-statistics.spec.js',
      'tests/e2e/unit1-2-completion.spec.js', 'playwright.statistics.config.js'
    ]) assert.ok(commands.includes(required), `${file} must check ${required}`);
    assert.ok(plan.includes('browser-statistics-webkit'), `${file} must preserve records in WebKit`);
  }
});

test('reward ordering and result changes keep the WebKit settlement regression in scope', () => {
  const config = require('../../scripts/check-workflow.config');
  for (const file of ['core/award-reveal.js', 'core/award-reveal.css', 'tests/login/settlement-sequence.spec.js']) {
    assert.ok(planChecks(config, [file]).includes('browser-statistics-webkit'), file);
  }
  const browserConfig = require('../../playwright.statistics.config');
  assert.ok(browserConfig.testMatch.includes('settlement-sequence.spec.js'));
  assert.ok(browserConfig.testMatch.includes('submission-statistics.spec.js'));
});

test('next-station and word art changes retain phone checks in both browser engines',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['unit5-6/current.js','unit5-6/word-cards.css','assets/unit5-6-word-cards/volvo-v1.webp','unit1-2/completion.js','unit143-144/unit.js','core/lesson49-experience.js','tests/login/unit56-word-cards.spec.js']){
  const plan=planChecks(config,[file]);
  for(const name of ['browser-word-cards','browser-word-cards-webkit'])assert.ok(plan.includes(name),`${file} must check ${name}`);
 }
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('unit56-word-cards.spec.js'));
});

test('shared card geometry keeps course, reveal and album ratio regressions in scope',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['core/award-card-layout.js','core/award-card-layout.css','core/story-certificate.js','core/story-certificate.css','core/award-reveal.js','core/award-reveal.css','award-book/Card.jsx','award-book/styles.css']){
  const plan=planChecks(config,[file]);
  for(const name of ['browser-card-aspect','browser-card-aspect-webkit'])assert.ok(plan.includes(name),`${file} must check ${name}`);
 }
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('award-card-aspect.spec.js'));
});

test('single-screen practice checks cover its shared renderer and the three opted-in units',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['core/practice-screen.js','core/practice-screen.css','core/lesson49-practice.js','core/lesson49-task-inputs.css','unit1-2/index.html','unit3-4/unit.css','unit5-6/current.js','tests/login/practice-screen.spec.js']){
  const plan=planChecks(config,[file]);for(const name of ['browser-practice-screen','browser-practice-screen-webkit'])assert.ok(plan.includes(name),`${file} must check ${name}`);
 }
 assert.ok(!planChecks(config,['unit7-8/unit.js']).includes('browser-practice-screen'));
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('practice-screen.spec.js'));
});

test('learning flow polish retains continuity and reduced-motion checks in both engines',()=>{
 const config=require('../../scripts/check-workflow.config');for(const file of ['unit1-2/learning-flow.js','unit1-2/learning-flow.css','unit1-2/index.html','core/practice-screen.js','assets/learning-ui/back.svg']){const plan=planChecks(config,[file]);for(const name of ['browser-learning-flow','browser-learning-flow-webkit'])assert.ok(plan.includes(name),file);}
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('learning-flow.spec.js'));
});

test('update entry and predecessor changes retain choice, real certificate and WebKit checks', () => {
  const config = require('../../scripts/check-workflow.config');
  for (const file of ['core/course-loader.js','server/public/portal.js','server/public/portal.css','tests/login/course-update-choice.spec.js','tests/login/course-update-performance.spec.js','server/app.js','scripts/course-packages.js','tests/fixtures/course-loader-before-update-choice/course-loader.js']) {
    const plan = planChecks(config, [file]), definitions = config.tasks(process.cwd(), [file]);
    const commands = plan.flatMap(id => definitions[id].args);
    for (const required of ['tests/login/course-update-choice.spec.js','tests/login/course-update-performance.spec.js','tests/login/unit37-38-fivezones-upgrade.spec.js','playwright.recovery.config.js']) assert.ok(commands.includes(required), `${file} must check ${required}`);
  }
});

test('expired evidence reruns, while clearing browser reports does not erase unrelated successful checks', async t => {
  const root = fixture(t);
  await run(root);
  const receipt = path.join(root, '.cache/check-workflow/sample.json');
  const saved = JSON.parse(fs.readFileSync(receipt, 'utf8'));
  saved.finishedAt = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
  fs.writeFileSync(receipt, JSON.stringify(saved));
  assert.equal((await run(root)).cached, false);
  assert.equal(count(root), 2);
  fs.rmSync(path.join(root, 'test-results'), { recursive: true });
  assert.equal((await run(root)).cached, true);
});

test('mobile reading, card and record presentation retains both full surface checks',()=>{
 const config=require('../../scripts/check-workflow.config'),root=path.resolve(__dirname,'../..');
 for(const file of ['core/learning-flow.css','core/story-certificate.js','unit3-4/unit.css','unit5-6/word-cards.css','tests/review/mobile-surface-audit.spec.js','tests/review/page-types-audit.spec.js','tests/review/worksheet-panel.spec.js']){
  const plan=planChecks(config,[file]),definitions=config.tasks(root,[file]);
  for(const name of ['browser-mobile-surface','browser-mobile-surface-webkit']){assert.ok(plan.includes(name),file);assert.ok(definitions[name].args.includes('tests/review/mobile-surface-audit.spec.js'));assert.ok(definitions[name].args.includes('tests/review/page-types-audit.spec.js'));assert.ok(definitions[name].args.includes('tests/review/worksheet-panel.spec.js'));}
 }
});

test('shared cover geometry and unit artwork retain both responsive cover checks',()=>{
 const config=require('../../scripts/check-workflow.config'),root=path.resolve(__dirname,'../..');
 for(const file of ['core/learning-flow.css','core/practice-screen.js','unit1-2/scene.css','unit3-4/unit.css','unit3-4/journey-visual.css','unit5-6/current.css','tests/review/cover-layout.spec.js']){
  const plan=planChecks(config,[file]),definitions=config.tasks(root,[file]);
  for(const name of ['browser-cover-layout','browser-cover-layout-webkit']){assert.ok(plan.includes(name),file);assert.ok(definitions[name].args.includes('tests/review/cover-layout.spec.js'));}
 }
});

test('scene prop and route control changes keep both frame-stability checks',()=>{
 const config=require('../../scripts/check-workflow.config'),root=path.resolve(__dirname,'../..');
 for(const file of ['core/learning-flow.css','core/practice-screen.css','core/practice-screen.js','unit1-2/scene.js','unit1-2/scene.css','unit1-2/learning-flow.css','tests/review/scene-exit-stability.spec.js']){
  const plan=planChecks(config,[file]),definitions=config.tasks(root,[file]);
  for(const name of ['browser-scene-exit','browser-scene-exit-webkit']){assert.ok(plan.includes(name),file);assert.ok(definitions[name].args.includes('tests/review/scene-exit-stability.spec.js'));}
 }
});

test('read-only question review checks cover state ownership and both browser engines',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['core/lesson49-practice.js','core/lesson49-task-inputs.js','core/practice-screen.js','unit1-2/unit.js','unit1-2/grammar.js','unit1-2/learning-flow.css','tests/login/lesson-review.spec.js']){
  const plan=planChecks(config,[file]);for(const name of ['browser-lesson-review','browser-lesson-review-webkit'])assert.ok(plan.includes(name),file);
 }
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('lesson-review.spec.js'));
});

test('learning UI and fixed phone preset changes retain required-device checks',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['core/practice-screen.css','unit1-2/learning-flow.js','tests/support/required-phone-devices.json','tests/support/journey-viewports.json','tests/login/practice-screen.spec.js'])assert.ok(planChecks(config,[file]).includes('browser-required-phones'),file);
});

test('learning references keep result isolation and mobile dialog checks',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['unit1-2/grammar.js','unit1-2/learning-flow.js','unit1-2/learning-flow.css','core/practice-screen.js','tests/support/required-phone-devices.json','tests/login/practice-references.spec.js']){
  const plan=planChecks(config,[file]);for(const name of ['browser-practice-references','browser-practice-references-webkit'])assert.ok(plan.includes(name),file);
 }
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('practice-references.spec.js'));
});

test('story presentation changes cover tall desktop and mandatory phone layouts',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['unit1-2/learning-flow.css','unit1-2/unit.js','unit1-2/current.css','unit1-2/scene.css','core/unit-theme.css','core/practice-screen.js','tests/support/required-phone-devices.json','tests/login/story-layout.spec.js']){
  const plan=planChecks(config,[file]);for(const name of ['browser-story-layout','browser-story-layout-webkit'])assert.ok(plan.includes(name),file);
 }
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('story-layout.spec.js'));
});

test('accepted audit changes retain cross-surface contracts and the explicit error wording',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['unit1-2/learning-copy.js','core/lesson49-practice.js','core/award-reveal.js','unit1-2/learning-flow.css','course-journey/model.js','course-journey/App.jsx','award-book/Postoffice.jsx','tests/login/accepted-ux.spec.js']){
  const plan=planChecks(config,[file]);for(const name of ['browser-accepted-ux','browser-accepted-ux-webkit'])assert.ok(plan.includes(name),file);
 }
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('accepted-ux.spec.js'));
});

test('question transitions and result wording retain frame, question-count and stage-navigation checks',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['unit1-2/learning-copy.js','unit1-2/learning-flow.js','unit1-2/learning-flow.css','unit1-2/unit.js','core/lesson49-practice.js','core/practice-screen.js','tests/login/learning-transitions.spec.js','tests/login/learning-polish.spec.js','tests/support/required-phone-devices.json']){
  const plan=planChecks(config,[file]);for(const name of ['browser-learning-transitions','browser-learning-transitions-webkit'])assert.ok(plan.includes(name),file);
 }
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('learning-transitions.spec.js'));
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('learning-polish.spec.js'));
 const tasks=config.tasks(process.cwd(),[]);
 for(const id of ['browser-learning-transitions','browser-learning-transitions-webkit'])assert.ok(tasks[id].args.includes('tests/login/learning-polish.spec.js'));
});

test('course image readiness changes verify the actual page guard and recovery in both engines',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['core/course-loader.js','core/course-cache.js','core/course-worker.js','core/lesson49-practice.js','unit1-2/current.js','scripts/course-packages.js','tests/login/course-picture-guard.spec.js']){
  const plan=planChecks(config,[file]);for(const name of ['browser-picture-guard','browser-picture-guard-webkit'])assert.ok(plan.includes(name),file);
 }
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('course-picture-guard.spec.js'));
});

test('shared learning shell and Lesson3-6 changes keep expansion coverage in both engines',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['core/learning-flow.js','core/learning-flow.css','core/practice-screen.js','unit3-4/learning-flow.css','unit3-4/unit.js','unit5-6/index.html','unit5-6/unit.js','tests/support/unit34-v154.js','tests/login/learning-expansion.spec.js']){
  const plan=planChecks(config,[file]);for(const id of ['browser-learning-expansion','browser-learning-expansion-webkit'])assert.ok(plan.includes(id),file);
 }
 for(const file of ['core/learning-flow.js','core/learning-flow.css']){
  const plan=planChecks(config,[file]);
  for(const id of ['browser-practice-screen','browser-learning-flow','browser-lesson-review','browser-story-layout','browser-learning-transitions','browser-practice-references','browser-required-phones'])assert.ok(plan.includes(id),file+' '+id);
 }
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('learning-expansion.spec.js'));
 const tasks=config.tasks(process.cwd(),[]);
 for(const id of ['browser-learning-expansion','browser-learning-expansion-webkit'])assert.ok(tasks[id].args.includes('tests/login/learning-expansion.spec.js'));
});

test('Lesson3-4 visual assets and composition keep story, question and original-card regressions',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['unit3-4/journey-visual.css','unit3-4/current.js','unit3-4/scene.js','unit3-4/unit.js','assets/unit3-4-journey/visitor-v1.webp','tests/login/unit34-journey-visual.spec.js']){
  const plan=planChecks(config,[file]);for(const name of ['browser-unit34-journey','browser-unit34-journey-webkit'])assert.ok(plan.includes(name),file);
 }
 assert.ok(require('../../playwright.recovery.config').testMatch.includes('unit34-journey-visual.spec.js'));
});

test('learning layout checks include text ink, short material budgets and shared render changes',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['core/learning-flow.js','core/learning-flow.css','core/practice-screen.js','core/lesson49-task-inputs.css','unit3-4/journey-visual.css','tests/support/learning-layout-audit.js','tests/login/learning-layout-audit.spec.js']){
  const plan=planChecks(config,[file]);for(const name of ['browser-learning-layout-audit','browser-learning-layout-audit-webkit'])assert.ok(plan.includes(name),file);
 }
 const tasks=config.tasks(process.cwd(),[]);for(const name of ['browser-learning-layout-audit','browser-learning-layout-audit-webkit'])assert(tasks[name].args.includes('tests/login/practice-screen.spec.js'));
 assert(require('../../playwright.recovery.config').testMatch.includes('learning-layout-audit.spec.js'));
});

test('word meaning, story and progress/material changes retain the focused three-phone regressions',()=>{
 const config=require('../../scripts/check-workflow.config');
 for(const file of ['core/learning-flow.css','core/learning-scenes.js','core/learning-scenes.css','core/practice-screen.js','unit143-144/scene.js','unit143-144/unit.css','assets/unit143-144/woods-world-continuous.svg','review-bench/state-model.js','review-bench/runtime.js','tests/support/learning-layout-audit.js']){
  const plan=planChecks(config,[file]);for(const name of ['browser-layout-refinement','browser-layout-refinement-webkit'])assert.ok(plan.includes(name),file);
 }
 const tasks=config.tasks(process.cwd(),[]);for(const name of ['browser-layout-refinement','browser-layout-refinement-webkit'])assert.ok(tasks[name].args.includes('tests/review/layout-refinement.spec.js'));
});
