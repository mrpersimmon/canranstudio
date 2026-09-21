'use strict';
const fs = require('node:fs');
const path = require('node:path');
const runtimeInputs = ['core', 'assets', 'home', 'index.html', 'unit49-50', 'unit1-2', 'unit3-4', 'unit5-6', 'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark', 'scripts', 'tests', 'docs', 'deploy', 'README.md', 'CONTEXT.md', 'outputs', 'package.json', 'package-lock.json', 'playwright.config.js'];
const isDoc = file => /\.md$/i.test(file) || file.startsWith('docs/') || file.startsWith('.superpowers/');
const isWorkflow = file => /^(scripts\/check-workflow(?:\.config)?\.js|tests\/workflow\/|\.github\/|AGENTS\.md|\.gitignore)/.test(file);
const unitFiles = root => fs.readdirSync(path.join(root, 'tests/unit')).filter(name => name.endsWith('.test.js')).sort().map(name => 'tests/unit/' + name);
function tasks(root, files) {
  const browser = names => ({ args: ['node_modules/@playwright/test/cli.js', 'test', '--reporter=line', ...names], inputs: runtimeInputs, browser: true });
  const changedTests = files.filter(file => /^tests\/e2e\/.*\.spec\.js$/.test(file) && fs.existsSync(path.join(root, file)));
  return {
    workflow: { args: ['--test', 'tests/workflow/check-workflow.test.js'], inputs: ['scripts/check-workflow.js', 'scripts/check-workflow.config.js', 'tests/workflow', '.github/workflows', 'package.json', 'package-lock.json'] },
    unit: { args: ['--test', ...unitFiles(root)], inputs: runtimeInputs },
    'browser-smoke': browser(['tests/e2e/smoke.spec.js', 'tests/e2e/routes.spec.js']),
    'browser-full': browser([]),
    'browser-audio': browser(['tests/e2e/audio-lifecycle.spec.js']),
    'browser-state': browser(['tests/e2e/home-progress.spec.js', 'tests/e2e/l49-progress.spec.js']),
    'browser-layout': browser(['tests/e2e/accessibility.spec.js', 'tests/e2e/mobile-release.spec.js']),
    'browser-changed': browser(changedTests.length ? changedTests : ['tests/e2e/smoke.spec.js']),
    'browser-lessons': browser(['tests/e2e/l50-assessment.spec.js', 'tests/e2e/l51-progress.spec.js', 'tests/e2e/l52-progress.spec.js', 'tests/e2e/l53-progress.spec.js', 'tests/e2e/l54-progress.spec.js', 'tests/e2e/soundmark-progress.spec.js']),
  };
}
function select(files) {
  const selected = [];
  if (files.some(isWorkflow)) selected.push('workflow');
  const code = files.filter(file => !isDoc(file) && !isWorkflow(file));
  if (!code.length) return selected;
  selected.push('unit');
  if (code.some(file => /^tests\/e2e\/.*\.spec\.js$/.test(file))) selected.push('browser-changed');
  const runtime = code.filter(file => !file.startsWith('tests/'));
  if (runtime.length) selected.push('browser-smoke');
  if (runtime.some(file => /audio|feedback|\.mp3$/.test(file))) selected.push('browser-audio');
  if (runtime.some(file => /^(lesson49\/|core\/)|progress|storage/.test(file))) selected.push('browser-state');
  if (runtime.some(file => /^(lesson5[0-4]\/|soundmark\/)/.test(file))) selected.push('browser-lessons');
  if (runtime.some(file => /\.css$|adventure|landmark|device-profile/.test(file))) selected.push('browser-layout');
  return selected;
}
module.exports = { tasks, select, quick: ['workflow', 'unit'] };
