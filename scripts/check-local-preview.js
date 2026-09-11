'use strict';

// Check the live preview, not the shell that a service worker can serve offline.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { prepare } = require('./build-learning-path-release');
const unit = require('../content/learning-course.json');
const runtime = require('../core/learning-path-runtime');
const store = require('../core/learning-store');
const placement = require('../core/learning-placement');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function previewPort(value = 42817) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw Error('Preview port must be an integer from 1 to 65535');
  return port;
}

async function checkPreview(port) {
  port = previewPort(port);
  const origin = 'http://127.0.0.1:' + port, prepared = prepare();
  // The reported first placement question, reached through the real runtime.
  const rt = runtime.createRuntime({unit, adapter:store.createMemoryAdapter(), random:()=>2 / 4294967296});
  rt.dispatch({type:'open-placement', id:'friends'});
  rt.dispatch({type:'placement-start'});
  let attempt = rt.snapshot().placementAttempt;
  // Reach the actual recorded listening sentence regardless of sampler order.
  let question;
  for(const id of attempt.questionIds){
    const q=placement.question(unit,id);
    if(q.listenRefs.length){question=q;break;}
    for(const selected of q.answer)rt.dispatch({type:'exercise-select',questionId:q.id,id:selected});
    rt.dispatch({type:'placement-check',attemptId:attempt.id,questionId:q.id});
    rt.dispatch({type:'placement-next',attemptId:attempt.id,questionId:q.id});attempt=rt.snapshot().placementAttempt;
  }
  assert.ok(question,'Placement sample must contain a listening question');
  const result = rt.dispatch({type:'exercise-listen', questionId:question.id, id:question.listenRefs[0]});
  const effect = result.effects.find(effect => effect.type === 'play-audio');
  assert.ok(effect?.src, 'Placement must request a recording');
  const paths = [...new Set(['/', effect.src, ...Object.entries(unit.sources)
    .filter(([ref]) => ref.startsWith('G49-') || ['L01-W05','L16-W03'].includes(ref)).map(([,source]) => source.audioSrc)])];
  for (const path of paths) {
    const response = await fetch(origin + path, {cache:'no-store', signal:AbortSignal.timeout(4000)});
    assert.equal(response.status, 200, path + ' must be available');
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(digest(bytes), digest(prepared.files.get(path === '/' ? 'index.html' : path.slice(1))), path + ' must match the current course');
  }
  const range = await fetch(origin + effect.src, {headers:{Range:'bytes=0-11'}, signal:AbortSignal.timeout(4000)});
  assert.equal(range.status, 206, 'Placement audio must support byte ranges');
  assert.deepEqual(Buffer.from(await range.arrayBuffer()), prepared.files.get(effect.src.slice(1)).subarray(0, 12));
  return {origin, questionId:question.id, audioSrc:effect.src, checkedResources:paths.length, rangeStatus:range.status};
}

if (require.main === module) checkPreview(process.argv[2]).then(result => {
  console.log('Preview ready: ' + JSON.stringify(result));
}).catch(error => {
  console.error('Preview check failed: ' + (error.cause?.code || error.message));
  process.exitCode = 1;
});

module.exports = {previewPort, checkPreview};
