'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync, spawn } = require('node:child_process');
const ROOT = path.resolve(__dirname, '..');
const MAX_AGE = 24 * 60 * 60 * 1000;
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function changedFiles(root, base = 'HEAD') {
  const ref = execFileSync('git', ['rev-parse', '--verify', '--end-of-options', base + '^{commit}'], { cwd: root, encoding: 'utf8' }).trim();
  const tracked = execFileSync('git', ['diff', '--name-only', '--no-renames', '-z', ref, '--'], { cwd: root });
  const added = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], { cwd: root });
  return [...new Set(Buffer.concat([tracked, added]).toString().split('\0').filter(Boolean))].sort();
}

function checkDocuments(root, files) {
  for (const name of files.filter(file => /\.md$/i.test(file))) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8').replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
    for (const match of text.matchAll(/!?\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)/g)) {
      const target = match[1].replace(/^<|>$/g, '');
      if (/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(target)) continue;
      const relative = decodeURIComponent(target.split(/[?#]/)[0]).replace(/:\d+$/, '');
      if (relative && !fs.existsSync(path.resolve(path.dirname(file), relative))) {
        throw Error('Broken local link: ' + name + ' -> ' + target);
      }
    }
  }
}

function environment(root, browser = false) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const installed = {};
  for (const name of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) {
    try { installed[name] = JSON.parse(fs.readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8')).version; }
    catch { installed[name] = 'missing'; }
  }
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) =>
    /^(CI|NODE_ENV|NODE_OPTIONS|TZ|LANG|LC_ALL|PLAYWRIGHT_.*|PW_.*)$/.test(key)).sort(([a], [b]) => a.localeCompare(b)));
  let executable = null;
  if (browser) {
    try {
      const playwright = require(require.resolve('playwright-core', { paths: [root] }));
      const file = playwright.chromium.executablePath(), stat = fs.statSync(file);
      executable = { file, bytes: stat.size, modified: stat.mtimeMs,
        revision: digest(fs.readFileSync(path.join(path.dirname(require.resolve('playwright-core/package.json', { paths: [root] })), 'browsers.json'))) };
    } catch { executable = 'missing'; }
  }
  return { node: process.version, platform: process.platform, arch: process.arch, installed, env, executable };
}

function fingerprint(root, task, context) {
  const hash = crypto.createHash('sha256');
  const add = value => hash.update(JSON.stringify(value) + '\n');
  add({ schema: 1, root, args: task.args, outputs: task.outputs || [], context });
  function visit(relative) {
    const file = path.join(root, relative);
    if (!fs.existsSync(file)) { add([relative, 'missing']); return; }
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) throw Error('Cannot cache a symbolic-link input: ' + relative);
    if (stat.isDirectory()) {
      add([relative, 'directory']);
      for (const name of fs.readdirSync(file).sort()) visit(relative + '/' + name);
    } else if (stat.isFile()) add([relative, digest(fs.readFileSync(file))]);
    else throw Error('Unsupported check input: ' + relative);
  }
  for (const name of [...new Set(['scripts/check-workflow.js', 'scripts/check-workflow.config.js', ...task.inputs])].sort()) visit(name);
  return hash.digest('hex');
}

function outputHashes(root, outputs = []) {
  return Object.fromEntries(outputs.map(name => {
    const file = path.join(root, name);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw Error('Required check output is missing: ' + name);
    return [name, digest(fs.readFileSync(file))];
  }));
}

async function runTask({ root, id, task, force = false, context, log = console.log }) {
  if (!/^[a-z0-9-]+$/.test(id)) throw Error('Invalid check name: ' + id);
  const dir = path.join(root, '.cache/check-workflow');
  fs.mkdirSync(dir, { recursive: true });
  const receipt = path.join(dir, id + '.json'), lock = path.join(dir, id + '.lock');
  try { fs.mkdirSync(lock); } catch (error) {
    if (error.code === 'EEXIST') throw Error('Check already running (or interrupted lock needs review): ' + lock);
    throw error;
  }
  let timer, fd;
  try {
    const currentContext = () => context || environment(root, task.browser);
    const key = fingerprint(root, task, currentContext());
    if (!force && task.cache !== false) {
      try {
        const saved = JSON.parse(fs.readFileSync(receipt, 'utf8'));
        const age = Date.now() - Date.parse(saved.finishedAt);
        if (saved.schema === 1 && saved.status === 'passed' && saved.fingerprint === key && age >= 0 && age < MAX_AGE &&
            JSON.stringify(saved.outputs) === JSON.stringify(outputHashes(root, task.outputs))) {
          log('[reuse] ' + id + ': passed ' + saved.finishedAt + ' (' + (saved.durationMs / 1000).toFixed(1) + 's originally)');
          return { ...saved, cached: true };
        }
      } catch { /* An absent, expired or incomplete receipt is never a pass. */ }
    }
    fs.rmSync(receipt, { force: true });
    const started = Date.now(), logfile = path.join(dir, id + '.log');
    log('[run] ' + id + ': ' + task.args.join(' '));
    fd = fs.openSync(logfile, 'w');
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, task.args, { cwd: root, stdio: ['ignore', fd, fd] });
      let interrupted = false;
      const interrupt = signal => { interrupted = true; child.kill(signal); };
      const onInt = () => interrupt('SIGINT'), onTerm = () => interrupt('SIGTERM');
      process.once('SIGINT', onInt); process.once('SIGTERM', onTerm);
      timer = setInterval(() => log('[running] ' + id + ': ' + Math.round((Date.now() - started) / 1000) + 's'), 30000);
      const clean = () => { clearInterval(timer); process.removeListener('SIGINT', onInt); process.removeListener('SIGTERM', onTerm); };
      child.once('error', error => { clean(); reject(error); });
      child.once('exit', (code, signal) => {
        clean();
        if (code === 0 && !interrupted) resolve();
        else reject(Error('Check failed: ' + id + ' (' + (signal || code) + '). See ' + logfile));
      });
    });
    fs.closeSync(fd); fd = undefined;
    if (fingerprint(root, task, currentContext()) !== key) throw Error('Inputs changed during ' + id + '; result cannot be reused.');
    const result = { schema: 1, status: 'passed', fingerprint: key, finishedAt: new Date().toISOString(),
      durationMs: Date.now() - started, outputs: outputHashes(root, task.outputs), args: task.args };
    fs.writeFileSync(receipt + '.tmp', JSON.stringify(result, null, 2) + '\n');
    fs.renameSync(receipt + '.tmp', receipt);
    log('[pass] ' + id + ': ' + (result.durationMs / 1000).toFixed(1) + 's');
    return { ...result, cached: false };
  } finally {
    clearInterval(timer);
    if (fd !== undefined) fs.closeSync(fd);
    fs.rmdirSync(lock);
  }
}

function planChecks(config, files) { return [...new Set(config.select(files))]; }

async function main(argv = process.argv.slice(2)) {
  const mode = argv.shift() || 'commit';
  let base = 'HEAD', force = false, planOnly = false;
  while (argv.length) {
    const arg = argv.shift();
    if (arg === '--base' && argv.length) base = argv.shift();
    else if (arg === '--force') force = true;
    else if (arg === '--plan') planOnly = true;
    else throw Error('Unknown option: ' + arg);
  }
  const config = require('./check-workflow.config');
  const files = mode === 'commit' ? changedFiles(ROOT, base) : [];
  const tasks = config.tasks(ROOT, files);
  const ids = mode === 'commit' ? planChecks(config, files) : mode === 'quick' ? config.quick : [mode];
  if (ids.some(id => !tasks[id])) throw Error('Unknown check: ' + ids.find(id => !tasks[id]));
  console.log('Scope: ' + mode + (mode === 'commit' ? ' against ' + base + ', ' + files.length + ' changed paths' : ''));
  console.log('Checks: ' + (ids.join(', ') || 'diff and local document links only'));
  console.log('This is scoped verification; complete release acceptance is a separate step.');
  if (planOnly) return;
  const start = Date.now();
  if (mode === 'commit') {
    execFileSync('git', ['diff', '--check', base, '--'], { cwd: ROOT, stdio: 'inherit' });
    checkDocuments(ROOT, files);
  }
  const results = [];
  for (const id of ids) results.push({ id, ...await runTask({ root: ROOT, id, task: tasks[id], force }) });
  console.log('Done in ' + ((Date.now() - start) / 1000).toFixed(1) + 's; ' + results.filter(result => result.cached).length + ' checks reused.');
}
module.exports = { changedFiles, checkDocuments, fingerprint, runTask, planChecks, main };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
