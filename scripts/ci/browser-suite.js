'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const timings = require('./timings.json');
const ROOT = path.resolve(__dirname, '../..');
const CLI = path.join(ROOT, 'node_modules/@playwright/test/cli.js');
const SUITES = {
  courses: { config: 'playwright.config.js', directory: 'tests/e2e', shards: 8, filters: ['--grep-invert', '@cache-performance'] },
  accounts: { config: 'playwright.login.config.js', directory: 'tests/login', shards: 3, filters: [] }
};

function inventory(report) {
  if (report.errors?.length) throw new Error(report.errors.map(e => e.message || JSON.stringify(e)).join('\n'));
  const files = new Map();
  function visit(suite) {
    for (const spec of suite.specs || []) {
      if (!spec.file || !spec.id) throw new Error('Invalid Playwright inventory');
      const ids = files.get(spec.file) || [];
      for (const test of spec.tests) ids.push(JSON.stringify([spec.id, test.projectName]));
      files.set(spec.file, ids);
    }
    for (const child of suite.suites || []) visit(child);
  }
  for (const suite of report.suites || []) visit(suite);
  const result = [...files].map(([file, ids]) => ({ file, ids })).sort((a, b) => a.file.localeCompare(b.file, 'en'));
  if (!result.length) throw new Error('No tests in Playwright inventory');
  sameTests(result.flatMap(f => f.ids), result.flatMap(f => f.ids));
  return result;
}

function sameTests(expected, actual) {
  const expectedSet = new Set(expected), actualSet = new Set(actual);
  if (!expected.length || expected.length !== expectedSet.size || actual.length !== actualSet.size ||
      expected.length !== actual.length || expected.some(id => !actualSet.has(id))) {
    throw new Error(`Test inventory mismatch: expected ${expected.length}, selected ${actual.length}`);
  }
}

function balance(files, history, count) {
  if (!Number.isInteger(count) || count < 1 || files.length < count) throw new Error('Invalid number of shards');
  const rates = Object.values(history).filter(h => h.tests > 0 && h.seconds > 0).map(h => h.seconds / h.tests).sort((a, b) => a - b);
  const fallback = rates[Math.floor(rates.length / 2)] || 10;
  const weighted = files.map(f => {
    const previous = history[f.file];
    const seconds = previous?.tests > 0 && previous?.seconds > 0
      ? Math.ceil(previous.seconds * f.ids.length / previous.tests)
      : Math.max(30, Math.ceil(f.ids.length * fallback));
    return { ...f, seconds };
  }).sort((a, b) => b.seconds - a.seconds || a.file.localeCompare(b.file, 'en'));
  const groups = Array.from({ length: count }, (_, i) => ({ shard: i + 1, seconds: 0, files: [] }));
  for (const file of weighted) {
    const group = [...groups].sort((a, b) => a.seconds - b.seconds || a.shard - b.shard)[0];
    group.files.push(file);
    group.seconds += file.seconds;
  }
  for (const group of groups) group.files.sort((a, b) => a.file.localeCompare(b.file, 'en'));
  sameTests(files.flatMap(f => f.ids), groups.flatMap(g => g.files.flatMap(f => f.ids)));
  return groups;
}

function definition(suite) {
  if (!Object.hasOwn(SUITES, suite)) throw new Error(`Unknown suite: ${suite}`);
  return SUITES[suite];
}

function args(suite) {
  const def = definition(suite);
  return ['test', '-c', def.config, '--forbid-only', ...def.filters];
}

function list(suite, extra = []) {
  const result = spawnSync(process.execPath, [CLI, ...args(suite), '--list', '--reporter=json', ...extra], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: '', PLAYWRIGHT_JSON_OUTPUT_NAME: '', PLAYWRIGHT_JSON_OUTPUT_DIR: '' }
  });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr || result.stdout || 'Cannot list tests');
  return inventory(JSON.parse(result.stdout));
}

function plan(suite) {
  const def = definition(suite);
  // History estimates duration only. Live discovery alone determines coverage.
  const prefix = def.directory + '/';
  const history = Object.fromEntries(Object.entries(timings[suite]).map(([file, value]) => [file.slice(prefix.length), value]));
  const files = list(suite);
  const groups = balance(files, history, def.shards);
  return { suite, totalTests: files.reduce((n, f) => n + f.ids.length, 0), groups };
}

function saveGroup(suite, group, prefix = '') {
  const dir = path.join(ROOT, 'output/ci', prefix + suite + '-' + group.shard);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'plan.json'), JSON.stringify({ suite, ...group }, null, 2) + '\n');
  const file = path.join(dir, 'files.txt');
  fs.writeFileSync(file, group.files.map(f => f.file).join('\n') + '\n');
  return { dir, file };
}

function verify(suite) {
  const current = plan(suite);
  const selected = [];
  for (const group of current.groups) {
    const { file } = saveGroup(suite, group, 'inventory-');
    const actual = list(suite, ['--test-list', file]).flatMap(f => f.ids);
    sameTests(group.files.flatMap(f => f.ids), actual);
    selected.push(...actual);
  }
  sameTests(current.groups.flatMap(g => g.files.flatMap(f => f.ids)), selected);
  summarize(current);
}

function summarize(current) {
  console.log(JSON.stringify({ suite: current.suite, tests: current.totalTests, groups: current.groups.map(g => ({
    shard: g.shard, files: g.files.length, tests: g.files.reduce((n, f) => n + f.ids.length, 0), estimatedMinutes: +(g.seconds / 60).toFixed(1)
  })) }, null, 2));
}

function run(suite, shard) {
  const current = plan(suite);
  const group = current.groups.find(g => g.shard === Number(shard));
  if (!group) throw new Error(`Invalid shard: ${shard}`);
  const { dir, file } = saveGroup(suite, group);
  const expected = group.files.flatMap(f => f.ids);
  sameTests(expected, list(suite, ['--test-list', file]).flatMap(f => f.ids));
  const reportFile = path.join(dir, 'report.json');
  fs.rmSync(reportFile, { force: true });
  summarize({ ...current, groups: [group] });
  const result = spawnSync(process.execPath, [CLI, ...args(suite), '--test-list', file,
    '--reporter=line,json', '--output', path.join(dir, 'results')], {
    cwd: ROOT, stdio: 'inherit', env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: reportFile }
  });
  if (result.error) throw result.error;
  if (result.status !== 0) return result.status || 1;
  // A zero exit code alone is insufficient: the executed inventory must match.
  const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
  sameTests(expected, inventory(report).flatMap(f => f.ids));
  const counted = ['expected', 'unexpected', 'flaky', 'skipped'].reduce((n, key) => n + report.stats?.[key], 0);
  if (counted !== expected.length || report.stats.unexpected !== 0) throw new Error('Incomplete test execution report');
  return 0;
}

function gate(results) {
  const required = ['foundation', 'courses', 'accounts', 'cache-performance', 'recovery-webkit'];
  return required.every(name => results?.[name]?.result === 'success');
}

if (require.main === module) {
  try {
    const [command, suite, shard] = process.argv.slice(2);
    if (command === 'gate') process.exitCode = gate(JSON.parse(process.env.RESULTS || '{}')) ? 0 : 1;
    else if (command === 'plan') summarize(plan(suite));
    else if (command === 'verify') for (const name of Object.keys(SUITES)) verify(name);
    else if (command === 'run') process.exitCode = run(suite, shard);
    else throw new Error('Usage: browser-suite.js plan <courses|accounts> | verify | run <suite> <shard> | gate');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { inventory, sameTests, balance, gate };
