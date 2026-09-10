'use strict';

// A manual-review preview must survive the shell command that starts it.
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { previewPort, checkPreview } = require('./check-local-preview');
const root = path.resolve(__dirname, '..');

async function startPreview(port) {
  port = previewPort(port);
  try {
    const result = await checkPreview(port);
    console.log('Preview already running: ' + result.origin);
    return;
  } catch (error) {
    // Never replace another listener or conceal a stale/invalid course package.
    if (error.cause?.code !== 'ECONNREFUSED') throw error;
  }
  const directory = path.join(root, 'test-results');
  fs.mkdirSync(directory, {recursive:true});
  const logPath = path.join(directory, 'preview-' + port + '.log');
  const fd = fs.openSync(logPath, 'a', 0o600);
  let child;
  try {
    child = spawn(process.execPath, [path.join(__dirname, 'serve-learning-path.js')], {
      cwd:root, env:{...process.env, PORT:String(port)}, detached:true, stdio:['ignore',fd,fd]
    });
  } finally { fs.closeSync(fd); }
  await new Promise((resolve, reject) => {child.once('spawn', resolve); child.once('error', reject);});
  child.unref();
  try {
    let lastError;
    for (let attempt = 0; attempt < 15; attempt++) {
      try {
        const result = await checkPreview(port);
        if (child.exitCode !== null || child.signalCode !== null) throw Error('The new preview process exited before becoming ready');
        fs.writeFileSync(path.join(directory, 'preview-' + port + '.json'), JSON.stringify({
          pid:child.pid, origin:result.origin, root, logPath, startedAt:new Date().toISOString()
        }, null, 2) + '\n');
        console.log('Preview running: ' + result.origin + ' (PID ' + child.pid + ')');
        console.log('Verified ' + result.checkedResources + ' resources and audio Range 206. Log: ' + logPath);
        return;
      } catch (error) {
        lastError = error;
        if (child.exitCode !== null) break;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    throw lastError;
  } catch (error) {
    child.kill('SIGTERM');
    throw Error('Preview did not become ready; see ' + logPath + ': ' + (error.cause?.code || error.message));
  }
}

if (require.main === module) startPreview(process.argv[2]).catch(error => {
  console.error(error.message); process.exitCode = 1;
});
module.exports = {startPreview};
