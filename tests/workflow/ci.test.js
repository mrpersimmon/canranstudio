'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { inventory, balance, sameTests, gate } = require('../../scripts/ci/browser-suite');
const { select, tasks } = require('../../scripts/check-workflow.config');
const ROOT = path.resolve(__dirname, '../..');

const file = (name, count) => ({ file: name, ids: Array.from({ length: count }, (_, i) => name + ':' + i) });

test('duration balancing keeps every test and whole serial files exactly once', () => {
  const files = ['a', 'b', 'c', 'd', 'e'].map(name => file(name, 2));
  const history = Object.fromEntries(files.map((f, i) => [f.file, { tests: 2, seconds: [90, 80, 30, 20, 10][i] }]));
  const groups = balance(files, history, 2);
  assert.deepEqual(groups.map(g => g.seconds), [120, 110]);
  sameTests(files.flatMap(f => f.ids), groups.flatMap(g => g.files.flatMap(f => f.ids)));
  assert.equal(new Set(groups.flatMap(g => g.files.map(f => f.file))).size, files.length);
  assert.deepEqual(balance([...files].reverse(), history, 2), groups);
});

test('new tests and files join the live plan; deleted history cannot select removed files', () => {
  const groups = balance([file('old', 4), file('new', 2)], {
    old: { tests: 2, seconds: 20 }, removed: { tests: 9, seconds: 900 }
  }, 2);
  assert.equal(groups.flatMap(g => g.files).find(f => f.file === 'old').seconds, 40);
  assert.equal(groups.flatMap(g => g.files).find(f => f.file === 'new').seconds > 0, true);
  assert.equal(groups.flatMap(g => g.files).some(f => f.file === 'removed'), false);
});

test('inventory includes skipped tests, projects and nested suites, and rejects load errors', () => {
  const spec = { file: 'a.spec.js', id: 'id', tests: [{ projectName: 'phone', expectedStatus: 'skipped' }, { projectName: 'desktop' }] };
  const result = inventory({ errors: [], suites: [{ suites: [{ specs: [spec] }] }] });
  assert.equal(result[0].ids.length, 2);
  assert.throws(() => inventory({ errors: [{ message: 'syntax error' }], suites: [] }), /syntax error/);
  assert.throws(() => inventory({ errors: [], suites: [] }), /No tests/);
});

test('omitted, duplicate, unexpected tests and invalid partitions fail closed', () => {
  assert.throws(() => sameTests(['a', 'b'], ['a']), /inventory/);
  assert.throws(() => sameTests(['a'], ['a', 'a']), /inventory/);
  assert.throws(() => sameTests(['a'], ['b']), /inventory/);
  assert.throws(() => balance([file('a', 1)], {}, 2), /shards/);
  assert.throws(() => balance([file('a', 1)], {}, 0), /shards/);
});

test('merge gate requires all named groups; failure, cancellation, skip and missing groups fail', () => {
  const names = ['foundation', 'courses', 'accounts', 'cache-performance', 'recovery-webkit'];
  const good = Object.fromEntries(names.map(n => [n, { result: 'success' }]));
  assert.equal(gate(good), true);
  for (const state of ['failure', 'cancelled', 'skipped', undefined]) {
    assert.equal(gate({ ...good, courses: { result: state } }), false);
  }
  const missing = { ...good }; delete missing.accounts;
  assert.equal(gate(missing), false);
  assert.equal(gate({}), false);
});

test('full CI runs on PRs and protected pushes; feature push has only a distinct quick gate', () => {
  const full = fs.readFileSync(path.join(ROOT, '.github/workflows/verify.yml'), 'utf8');
  const quick = fs.readFileSync(path.join(ROOT, '.github/workflows/quick.yml'), 'utf8');
  assert.match(full, /push:\n    branches: \[main, codex\/release-canranstudio\]/);
  assert.match(full, /\n  pull_request:\n/);
  assert.match(full, /\n  workflow_dispatch:\n/);
  assert.doesNotMatch(full, /paths-ignore:|continue-on-error:|pull_request_target:/);
  assert.match(quick, /branches-ignore: \[main, codex\/release-canranstudio\]/);
  assert.doesNotMatch(quick, /pull_request:|\n  test:|test:e2e|test:login/);
  assert.match(full, /needs: \[foundation, courses, accounts, cache-performance, recovery-webkit\]/);
  assert.match(full, /node scripts\/ci\/browser-suite.js gate/);
  assert.match(full, /node scripts\/ci\/browser-suite.js verify/);
  assert.match(full, /node scripts\/ci\/browser-suite.js run courses/);
  assert.match(full, /node scripts\/ci\/browser-suite.js run accounts/);
  for(const suite of ['courses','accounts']){
    const matrix=full.match(new RegExp('\\n  '+suite+':[\\s\\S]*?shard: \\[([^\\]]+)\\]'));
    assert.ok(matrix,suite+' has a workflow matrix');
    const scheduled=matrix[1].split(',').map(n=>Number(n.trim()));
    const count=require('../../scripts/ci/browser-suite').definition(suite).shards;
    assert.deepEqual(scheduled,Array.from({length:count},(_,i)=>i+1),suite+' schedules every discovered shard exactly once');
  }
});

test('CI preserves isolated performance checks and uploads failure evidence with pinned actions', () => {
  const workflow = fs.readFileSync(path.join(ROOT, '.github/workflows/verify.yml'), 'utf8');
  assert.match(workflow, /course-cache-cold.spec.js --grep @cache-performance --trace=off/);
  assert.match(workflow, /course-cache-performance.spec.js --grep @cache-performance/);
  assert.match(workflow, /actions\/upload-artifact@[a-f0-9]{40}/);
  assert.match(workflow, /retention-days: 7/);
  assert.match(workflow, /base: \['\/', '\/lesson\/'\]/);
  assert.match(workflow, /npm run test:statistics -- --project=webkit-phone/);
});

test('local scoped checks include CI regression tests and invalidate cached plans after timing changes', () => {
  assert.deepEqual(select(['scripts/ci/timings.json']), ['workflow']);
  const workflow = tasks(ROOT, []).workflow;
  assert.ok(workflow.args.includes('tests/workflow/ci.test.js'));
  assert.ok(workflow.args.includes('tests/deploy/workflow-contract.test.js'));
  assert.ok(workflow.inputs.includes('scripts/ci'));
});

test('runner preserves child failures and rejects success with a missing or incomplete report', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-ci-runner-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'scripts/ci'), { recursive: true });
  fs.mkdirSync(path.join(root, 'node_modules/@playwright/test'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'scripts/ci/browser-suite.js'), path.join(root, 'scripts/ci/browser-suite.js'));
  fs.writeFileSync(path.join(root, 'scripts/ci/timings.json'), JSON.stringify({ courses: {}, accounts: {} }));
  // This process fixture exercises the runner protocol, not lesson behavior.
  // Keep enough complete files to exercise every configured course partition.
  const fakeFileCount = require('../../scripts/ci/browser-suite').definition('courses').shards;
  fs.writeFileSync(path.join(root, 'node_modules/@playwright/test/cli.js'), `
    const fs = require('node:fs');
    const args = process.argv.slice(2);
    const select = args.indexOf('--test-list');
    let files = select < 0 ? Array.from({length:${fakeFileCount}}, (_, i) => 'file-' + i + '.spec.js')
      : fs.readFileSync(args[select + 1], 'utf8').trim().split('\\n');
    const listing = args.includes('--list');
    if (!listing && process.env.FAKE_MODE === 'failure') process.exit(7);
    if (!listing && process.env.FAKE_MODE === 'no-report') process.exit(0);
    if (!listing && process.env.FAKE_MODE === 'omitted') files = [];
    const stats = {expected:process.env.FAKE_MODE === 'list-only' ? 0 : files.length, unexpected:0, flaky:0, skipped:0};
    const report = JSON.stringify({errors:[], stats, suites:files.map(file => ({specs:[{file,id:file,tests:[{projectName:''}]}]}))});
    if (listing) console.log(report);
    else fs.writeFileSync(process.env.PLAYWRIGHT_JSON_OUTPUT_FILE, report);
  `);
  for (const [mode, expected] of [['success', 0], ['failure', 7], ['no-report', 1], ['omitted', 1], ['list-only', 1]]) {
    const result = spawnSync(process.execPath, ['scripts/ci/browser-suite.js', 'run', 'courses', '1'], {
      cwd: root, encoding: 'utf8', env: { ...process.env, FAKE_MODE: mode }
    });
    assert.equal(result.status, expected, mode + ': ' + result.stderr);
    assert.ok(fs.existsSync(path.join(root, 'output/ci/courses-1/plan.json')));
  }
});

const originalMirrors = '# Hosted runner defaults\r\n' +
  'http://azure.archive.ubuntu.com/ubuntu/\tpriority:1\r\n' +
  'https://archive.ubuntu.com/ubuntu/\tpriority:2\r\n' +
  'https://security.ubuntu.com/ubuntu/\tpriority:3\r\n';
const originalSources = 'Types: deb\r\nURIs: mirror+file:/etc/apt/apt-mirrors.txt\r\n' +
  'Suites: noble noble-updates noble-backports noble-security\r\n' +
  'Components: main restricted universe multiverse\r\nSigned-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg\r\n';

function mirrorFixture(t) {
  const aptDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-apt-mirrors-'));
  t.after(() => fs.rmSync(aptDirectory, { recursive: true, force: true }));
  fs.mkdirSync(path.join(aptDirectory, 'sources.list.d'));
  const sources = path.join(aptDirectory, 'sources.list.d/ubuntu.sources');
  const mirrors = path.join(aptDirectory, 'apt-mirrors.txt');
  fs.writeFileSync(sources, originalSources);
  fs.writeFileSync(mirrors, originalMirrors);
  const writes = [], logs = [];
  const options = { aptDirectory, platform: 'linux', env: { GITHUB_ACTIONS: 'true', RUNNER_OS: 'Linux' },
    writeFile(file, value) { writes.push(file); fs.writeFileSync(file, value); }, log(message) { logs.push(message); } };
  return { sources, mirrors, writes, logs, options };
}

test('CI mirror preparation changes only known priorities, preserves source bytes and is idempotent', t => {
  // A slow but responsive Azure mirror consumed the job deadline before tests
  // began. Prefer the existing official fallback without changing package trust.
  const { prepare } = require('../../scripts/ci/prepare-ubuntu-mirrors');
  const fixture = mirrorFixture(t);
  assert.equal(prepare(fixture.options).changed, true);
  assert.equal(fs.readFileSync(fixture.mirrors, 'utf8'), '# Hosted runner defaults\r\n' +
    'http://azure.archive.ubuntu.com/ubuntu/\tpriority:3\r\n' +
    'https://archive.ubuntu.com/ubuntu/\tpriority:1\r\n' +
    'https://security.ubuntu.com/ubuntu/\tpriority:2\r\n');
  assert.deepEqual(fs.readFileSync(fixture.sources), Buffer.from(originalSources));
  assert.equal(prepare(fixture.options).changed, false);
  assert.deepEqual(fixture.writes, [fixture.mirrors]);
  assert.ok(fixture.logs.some(message => /applied/.test(message)));
});

test('unknown or missing runner mirror layouts remain unchanged and explain why preparation was not applied', t => {
  const { prepare } = require('../../scripts/ci/prepare-ubuntu-mirrors');
  const fixture = mirrorFixture(t);
  for (const content of [originalMirrors + 'https://example.invalid/ubuntu/\tpriority:1\n',
    originalMirrors.replace('priority:2', 'priority:unknown'),
    originalMirrors.replace('https://security.ubuntu.com/ubuntu/', 'https://archive.ubuntu.com/ubuntu/')]) {
    fs.writeFileSync(fixture.mirrors, content);
    assert.equal(prepare(fixture.options).changed, false);
    assert.equal(fs.readFileSync(fixture.mirrors, 'utf8'), content);
  }
  fs.writeFileSync(fixture.mirrors, originalMirrors);
  for (const content of [originalSources.replace('mirror+file:/etc/apt/apt-mirrors.txt', 'https://archive.ubuntu.com/ubuntu/'),
    originalSources.replace('URIs:', '# URIs:')]) {
    fs.writeFileSync(fixture.sources, content);
    assert.equal(prepare(fixture.options).changed, false);
    assert.equal(fs.readFileSync(fixture.sources, 'utf8'), content);
    assert.equal(fs.readFileSync(fixture.mirrors, 'utf8'), originalMirrors);
  }
  fs.rmSync(fixture.sources);
  assert.equal(prepare(fixture.options).changed, false);
  fs.writeFileSync(fixture.sources, originalSources);
  fs.rmSync(fixture.mirrors);
  assert.equal(prepare(fixture.options).changed, false);
  assert.deepEqual(fixture.writes, []);
  assert.equal(fixture.logs.length, 7);
  assert.ok(fixture.logs.every(message => /not applied/.test(message)));
  assert.deepEqual(fs.readFileSync(fixture.sources), Buffer.from(originalSources));
});

test('mirror preparation leaves non-GitHub Linux environments alone but surfaces permission failures', t => {
  const { prepare } = require('../../scripts/ci/prepare-ubuntu-mirrors');
  const fixture = mirrorFixture(t);
  const forbiddenRead = () => { throw new Error('must not read host files'); };
  for (const patch of [{ platform: 'win32' }, { env: {} }, { env: { GITHUB_ACTIONS: 'true', RUNNER_OS: 'macOS' } }]) {
    assert.equal(prepare({ ...fixture.options, ...patch, readFile: forbiddenRead }).changed, false);
  }
  const denied = Object.assign(new Error('Permission denied'), { code: 'EACCES' });
  assert.throws(() => prepare({ ...fixture.options, readFile() { throw denied; } }), error => error === denied);
  assert.throws(() => prepare({ ...fixture.options, writeFile() { throw denied; } }), error => error === denied);
  assert.deepEqual(fs.readFileSync(fixture.sources), Buffer.from(originalSources));
  assert.equal(fs.readFileSync(fixture.mirrors, 'utf8'), originalMirrors);
  assert.deepEqual(fixture.writes, []);
});

test('all five CI browser jobs prepare mirrors before unchanged installs, deadlines and performance assertions', () => {
  const workflow = fs.readFileSync(path.join(ROOT, '.github/workflows/verify.yml'), 'utf8');
  for (const [job, deadline, browser] of [['foundation', 60, 'chromium'], ['courses', 60, 'chromium'],
    ['accounts', 60, 'chromium'], ['cache-performance', 10, 'chromium'], ['recovery-webkit', 15, 'webkit']]) {
    const block = workflow.match(new RegExp('\\n  ' + job + ':[\\s\\S]*?(?=\\n  [\\w-]+:|$)'))?.[0];
    assert.ok(block, job + ' remains scheduled');
    assert.match(block, new RegExp('timeout-minutes: ' + deadline + '\\b'));
    assert.match(block, new RegExp('run: node scripts/ci/prepare-ubuntu-mirrors\\.js\\r?\\n      - run: npx playwright install --with-deps ' + browser));
    assert.equal((block.match(/prepare-ubuntu-mirrors/g) || []).length, 1);
    assert.doesNotMatch(block, /continue-on-error:|--no-deps|\|\| true/);
  }
  const cold = fs.readFileSync(path.join(ROOT, 'tests/e2e/course-cache-cold.spec.js'), 'utf8');
  const revisit = fs.readFileSync(path.join(ROOT, 'tests/e2e/course-cache-performance.spec.js'), 'utf8');
  assert.match(cold, /expect\(report\.elapsedMs\)\.toBeLessThan\(5000\)/);
  assert.match(revisit, /expect\(\[\.\.\.samples\]\.sort\(\(a, b\) => a - b\)\[18\]\)\.toBeLessThan\(1500\)/);
});
