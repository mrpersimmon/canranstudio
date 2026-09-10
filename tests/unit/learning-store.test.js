'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createMemoryAdapter,
  createLocalStorageAdapter
} = require('../../core/learning-store');

function fakeLocalStorage(seed = {}, failure = {}) {
  const data = new Map(Object.entries(seed));
  return {
    getItem(key) {
      if (failure.get) throw new Error('storage read blocked');
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      if (failure.set) throw new Error('storage write blocked');
      if (failure.ignoreSet) return;
      data.set(key, String(value));
    }
  };
}

const adapterFactories = [
  ['memory', () => createMemoryAdapter()],
  ['localStorage', () => createLocalStorageAdapter(fakeLocalStorage())]
];

for (const [adapterName, createStore] of adapterFactories) {
  test(`${adapterName}: a missing record starts at revision zero with no value`, () => {
    const store = createStore();

    assert.deepEqual(store.load('learner'), {
      status: 'ok',
      revision: 0,
      value: null
    });
  });

  test(`${adapterName}: a commit persists the next revision and makes it loadable`, () => {
    const store = createStore();
    const value = { checkpoint: 'discover:complete' };

    assert.deepEqual(store.commit('learner', { expectedRevision: 0, value }), {
      status: 'committed',
      persisted: true,
      revision: 1,
      value
    });
    assert.deepEqual(store.load('learner'), {
      status: 'ok',
      revision: 1,
      value
    });
  });

  test(`${adapterName}: a stale expected revision conflicts without overwriting`, () => {
    const store = createStore();
    const current = { checkpoint: 'understand:complete' };
    store.commit('learner', { expectedRevision: 0, value: current });

    assert.deepEqual(store.commit('learner', {
      expectedRevision: 0,
      value: { checkpoint: 'teach:complete' }
    }), {
      status: 'conflict',
      persisted: false,
      revision: 1,
      value: current
    });
    assert.deepEqual(store.load('learner').value, current);
  });

  test(`${adapterName}: values are isolated from caller and result references`, () => {
    const store = createStore();
    const input = { targets: [{ targetId: 'FLC-U01-T01', days: ['2026-08-10'] }] };
    const committed = store.commit('learner', { expectedRevision: 0, value: input });

    input.targets[0].days.push('caller-mutation');
    committed.value.targets[0].days.push('result-mutation');
    const firstRead = store.load('learner');
    firstRead.value.targets[0].days.push('load-mutation');

    assert.deepEqual(store.load('learner'), {
      status: 'ok',
      revision: 1,
      value: { targets: [{ targetId: 'FLC-U01-T01', days: ['2026-08-10'] }] }
    });
  });
}

test('both adapters report a malformed revision envelope as corrupt', () => {
  const malformed = { revision: 'not-a-number', value: { unsafe: true } };
  const stores = [
    createMemoryAdapter({ learner: malformed }),
    createLocalStorageAdapter(fakeLocalStorage({ learner: JSON.stringify(malformed) }))
  ];

  for (const store of stores) {
    assert.deepEqual(store.load('learner'), {
      status: 'corrupt',
      revision: 0,
      value: null
    });
  }
});

test('expected revision zero safely replaces a corrupt record', () => {
  const malformed = { revision: 'not-a-number', value: { unsafe: true } };
  const stores = [
    createMemoryAdapter({ learner: malformed }),
    createLocalStorageAdapter(fakeLocalStorage({ learner: JSON.stringify(malformed) }))
  ];
  const repaired = { checkpoint: 'discover:complete' };

  for (const store of stores) {
    assert.deepEqual(store.commit('learner', { expectedRevision: 0, value: repaired }), {
      status: 'committed',
      persisted: true,
      revision: 1,
      value: repaired
    });
    assert.deepEqual(store.load('learner'), {
      status: 'ok',
      revision: 1,
      value: repaired
    });
  }
});

test('localStorage read failure is explicit and does not escape', () => {
  const store = createLocalStorageAdapter(fakeLocalStorage({}, { get: true }));

  assert.deepEqual(store.load('learner'), {
    status: 'unavailable',
    revision: 0,
    value: null
  });
});

test('localStorage write failure never reports a permanent effect', () => {
  const current = { checkpoint: 'understand:complete' };
  const storage = fakeLocalStorage({
    learner: JSON.stringify({ revision: 3, value: current })
  }, { set: true });
  const store = createLocalStorageAdapter(storage);

  assert.deepEqual(store.commit('learner', {
    expectedRevision: 3,
    value: { checkpoint: 'teach:complete' }
  }), {
    status: 'unavailable',
    persisted: false,
    revision: 3,
    value: current
  });
  assert.deepEqual(store.load('learner').value, current);
});

test('a silently ignored localStorage write is not reported as committed', () => {
  const current = { checkpoint: 'understand:complete' };
  const storage = fakeLocalStorage({
    learner: JSON.stringify({ revision: 3, value: current })
  }, { ignoreSet: true });
  const store = createLocalStorageAdapter(storage);

  assert.deepEqual(store.commit('learner', {
    expectedRevision: 3,
    value: { checkpoint: 'teach:complete' }
  }), {
    status: 'unavailable',
    persisted: false,
    revision: 3,
    value: current
  });
});

test('localStorage commit stops when the current revision cannot be read', () => {
  const store = createLocalStorageAdapter(fakeLocalStorage({}, { get: true }));

  assert.deepEqual(store.commit('learner', {
    expectedRevision: 0,
    value: { checkpoint: 'discover:complete' }
  }), {
    status: 'unavailable',
    persisted: false,
    revision: 0,
    value: null
  });
});

test('invalid JSON is corrupt and can be repaired from revision zero', () => {
  const store = createLocalStorageAdapter(fakeLocalStorage({ learner: '{broken' }));
  const repaired = { checkpoint: 'discover:complete' };

  assert.deepEqual(store.load('learner'), {
    status: 'corrupt',
    revision: 0,
    value: null
  });
  assert.deepEqual(store.commit('learner', { expectedRevision: 0, value: repaired }), {
    status: 'committed',
    persisted: true,
    revision: 1,
    value: repaired
  });
});

test('large migrated progress keeps exact history and all recovery copies within the storage budget', () => {
  const old = {schema:4, results:Object.fromEntries(Array.from({length:1600}, (_, i) => ['question-'+i, {
    activityId:'activity-'+i, value:'She does not like steak.', at:'2026-09-10T12:00:00.000Z',
    assessment:{skill:'sentence-organization', support:'authored-options', target:'the original classroom target'}
  }]))};
  const raw=JSON.stringify({revision:7,value:old}),data=new Map();
  const storage={getItem:key=>data.get(key)??null,setItem(key,value){
    const size=[...data].filter(([k])=>k!==key).reduce((n,[,v])=>n+v.length,0)+value.length;
    if(size>raw.length*5.5)throw Error('quota');data.set(key,String(value));
  }};
  for(const suffix of ['',':recovery:backup',':recovery:quarantine'])storage.setItem('learner'+suffix,raw);
  const adapter=createLocalStorageAdapter(storage);
  assert.equal(adapter.checkpoint('learner',{expectedRevision:7,migration:true}).status,'ok');
  const value={...structuredClone(old),schema:5,keyboardArchive:{at:'2026-09-10',record:structuredClone(old),draft:{value:'original typed answer'}}};
  assert.equal(adapter.commit('learner',{expectedRevision:7,value}).status,'committed');
  assert.equal(adapter.checkpoint('learner',{expectedRevision:8}).status,'ok');
  assert.equal(adapter.commit('learner',{expectedRevision:8,value}).status,'committed');
  assert.deepEqual(adapter.load('learner').value,value);
  assert.equal(storage.getItem('learner:recovery:migration'),raw);
  assert.equal(storage.getItem('learner:recovery:quarantine'),raw);
  assert.equal(adapter.commit('learner',{expectedRevision:8,value:{}}).status,'conflict');
  adapter.loadDraft('learner');
  assert.equal(adapter.saveDraft('learner',{baseRevision:9,value:{selected:['your']}}).status,'ok');
  assert.deepEqual(adapter.decodeEnvelope(adapter.inspect('learner').backup).value,value);
  adapter.load('learner').value.keyboardArchive.record.results['question-0'].value='changed outside';
  assert.equal(adapter.load('learner').value.keyboardArchive.record.results['question-0'].value,old.results['question-0'].value);
  const bad='{"revision":10,"encoding":"record-table-v1","value":{"codec":"course-table-v1","strings":[],"nodes":[[0,4]],"root":0}}';
  storage.setItem('learner',bad);
  assert.equal(adapter.load('learner').status,'corrupt');assert.equal(adapter.inspect('learner').raw,bad);
  assert.equal(adapter.recover('learner',{expectedRaw:bad,value}).status,'committed');
  assert.deepEqual(adapter.load('learner').value,value);
  assert.equal(storage.getItem('learner:recovery:quarantine'),bad);
  assert.equal(storage.getItem('learner:recovery:migration'),raw);
});
