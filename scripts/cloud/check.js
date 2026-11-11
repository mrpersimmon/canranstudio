'use strict';
// A bounded cloud-onboarding check, not the complete commit or release gate.
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync, execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const output = path.join(root, 'output/cloud-development');
const checks = [
  ['foundation', ['--test',
    'tests/unit/review-bench.test.js',
    'tests/unit/learning-rollout.test.js',
    'tests/unit/word-art-approval.test.js',
    'tests/unit/course-ending.test.js',
    'tests/workflow/check-workflow.test.js',
    'tests/workflow/ci.test.js',
    'tests/deploy/workflow-contract.test.js']],
  ['build', ['scripts/build-login.js']],
  ['review', ['node_modules/@playwright/test/cli.js', 'test', '-c', 'playwright.review.config.js',
    'tests/review/layout-refinement.spec.js',
    'tests/review/state-switch.spec.js',
    'tests/review/course-ending.spec.js',
    'tests/review/word-art.spec.js',
    '--project=chromium', '--project=webkit', '--workers=1',
    '--output=output/cloud-development/browser']]
];
if (Number(process.versions.node.split('.')[0]) < 24) throw Error('Node.js 24 or newer is required.');
fs.mkdirSync(output, {recursive:true});
const report = {
  scope:'Cloud development onboarding only; not full CI or production acceptance',
  baseCommit:execFileSync('git', ['rev-parse', 'HEAD'], {cwd:root, encoding:'utf8'}).trim(),
  workingTreeDirty:Boolean(execFileSync('git', ['status', '--porcelain', '--untracked-files=normal'], {cwd:root, encoding:'utf8'}).trim()),
  node:process.version, platform:process.platform, startedAt:new Date().toISOString(), checks:[]
};
let failed = false;
for (const [name, args] of checks) {
  console.log('\n[cloud-check] ' + name);
  const started = Date.now();
  const result = spawnSync(process.execPath, args, {cwd:root, stdio:'inherit', env:process.env});
  const entry = {name, args, status:result.status === 0 ? 'passed' : 'failed', durationMs:Date.now()-started};
  if (result.error) entry.error = result.error.message;
  if (result.signal) entry.signal = result.signal;
  report.checks.push(entry);
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify(report, null, 2) + '\n');
  if (entry.status === 'failed') { failed = true; break; }
}
console.log('\n[cloud-check] ' + (failed ? 'FAILED' : 'PASS') + '; scope and evidence: output/cloud-development/checks.json');
process.exitCode = failed ? 1 : 0;
