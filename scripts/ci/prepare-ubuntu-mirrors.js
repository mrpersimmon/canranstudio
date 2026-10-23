'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

// The hosted Ubuntu 24.04 image already trusts these three Ubuntu archives:
// https://raw.githubusercontent.com/actions/runner-images/ubuntu24/20261012.334/images/ubuntu/scripts/build/configure-apt-sources.sh
// APT tries lower priorities first, and falls back when fetching a file fails:
// https://manpages.debian.org/bookworm/apt/apt-transport-mirror.1.en.html
// Our cancelled jobs received Azure packages at about 50 kB/s without a fetch
// error. Prefer the existing HTTPS archives; keep Azure as a fallback. This
// edits no source suites, components, signature settings, dependencies or test
// time budgets. Actual hosted-runner download speed still needs a CI result.
const priorities = new Map([
  ['https://archive.ubuntu.com/ubuntu/', 1],
  ['https://security.ubuntu.com/ubuntu/', 2],
  ['http://azure.archive.ubuntu.com/ubuntu/', 3]
]);

function prepare({ aptDirectory = '/etc/apt', env = process.env, platform = process.platform,
  readFile = fs.readFileSync, writeFile = writeHostedFile, log = console.log } = {}) {
  function unchanged(reason) {
    log('[apt mirrors] not applied: ' + reason + '; normal dependency installation remains enabled.');
    return { changed: false, reason };
  }
  if (env.GITHUB_ACTIONS !== 'true' || env.RUNNER_OS !== 'Linux' || platform !== 'linux') {
    return unchanged('not a GitHub Actions Linux runner');
  }
  const sourcesFile = path.join(aptDirectory, 'sources.list.d/ubuntu.sources');
  const mirrorsFile = path.join(aptDirectory, 'apt-mirrors.txt');
  let sources, mirrors;
  try {
    sources = readFile(sourcesFile, 'utf8');
    mirrors = readFile(mirrorsFile, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return unchanged('expected Ubuntu sources or mirror table is missing');
    throw error;
  }
  if (!/^URIs:[ \t]+mirror\+file:\/etc\/apt\/apt-mirrors\.txt[ \t]*\r?$/m.test(sources)) {
    return unchanged('Ubuntu sources do not use the recognized mirror table');
  }
  const seen = new Set();
  const lines = mirrors.split(/(?<=\n)/);
  const updated = [];
  for (const line of lines) {
    const body = line.replace(/\r?\n$/, '');
    if (!body.trim() || body.trimStart().startsWith('#')) { updated.push(line); continue; }
    const entry = body.match(/^(\S+)[ \t]+priority:(\d+)[ \t]*$/);
    if (!entry || !priorities.has(entry[1]) || seen.has(entry[1])) {
      return unchanged('mirror table layout is unknown');
    }
    seen.add(entry[1]);
    updated.push(line.replace(/priority:\d+/, 'priority:' + priorities.get(entry[1])));
  }
  if (seen.size !== priorities.size) return unchanged('expected official mirror entries are missing');
  const next = updated.join('');
  if (next === mirrors) return unchanged('official archive priorities are already configured');
  writeFile(mirrorsFile, next);
  if (readFile(mirrorsFile, 'utf8') !== next) throw new Error('Ubuntu mirror priority write could not be verified');
  log('[apt mirrors] applied: archive HTTPS first, security HTTPS second, Azure retained as fallback.');
  return { changed: true };
}

function writeHostedFile(file, contents) {
  // The CLI supplies only the fixed /etc/apt path; it accepts no path arguments.
  // Permission or installation failures must fail the CI step, never be hidden.
  execFileSync('sudo', ['-n', 'tee', '--', file], { input: contents, stdio: ['pipe', 'ignore', 'inherit'] });
}

if (require.main === module) {
  try { prepare(); } catch (error) { console.error('[apt mirrors] ' + error.message); process.exitCode = 1; }
}
module.exports = { prepare };
