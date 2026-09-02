'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { buildStatic } = require('../../scripts/build-static');
const { PUBLISHED_COURSES, PRESENTATION_COURSES } = require('../../scripts/course-registry');

const ROOT = path.resolve(__dirname, '../..');
const PUBLIC_INPUTS = [
  'index.html',
  'home/index.html',
  ...PUBLISHED_COURSES.flatMap(course => [
    course.entry,
    ...course.assetDirectories
  ]),
  ...PRESENTATION_COURSES.map(course => course.presentation.entry),
  'core',
  'assets',
  'poc'
];
const VALID_MP3_BYTES = Buffer.alloc(144);
VALID_MP3_BYTES.set([0xff, 0xf3, 0x64, 0xc4]);
const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

function publicHtml(title, body = '') {
  return `<!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body>${body}</body>
    </html>`;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function comparePaths(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

async function listRegularFiles(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => comparePaths(left.name, right.name))) {
    const relative = path.posix.join(prefix, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listRegularFiles(absolute, relative));
    } else if (entry.isFile()) {
      files.push(relative);
    }
  }
  return files;
}

async function expectedPublicFiles(root) {
  const files = [];
  for (const relative of PUBLIC_INPUTS) {
    const source = path.join(root, relative);
    try {
      const stat = await fs.lstat(source);
      if (stat.isDirectory()) {
        files.push(...await listRegularFiles(source, relative));
      } else if (stat.isFile()) {
        files.push(relative);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return files.sort(comparePaths);
}

async function writeSyntheticPublicRoot(root) {
  for (const relative of [
    'index.html',
    'home/index.html',
    'lesson49/index.html',
    'lesson49/present/index.html',
    'lesson49/audio/clip.mp3',
    'lesson50/index.html',
    'lesson50/audio/clip.mp3',
    'lesson51/index.html',
    'lesson51/audio/clip.mp3',
    'lesson52/index.html',
    'lesson52/audio/clip.mp3',
    'lesson53/index.html',
    'lesson53/audio/clip.mp3',
    'lesson54/index.html',
    'lesson54/audio/clip.mp3',
    'soundmark/index.html',
    'soundmark/audio/clip.mp3',
    'lesson51/index.html',
    'lesson51/audio/clip.mp3',
    'core/audio-player.js',
    'core/classroom-presentation.js',
    'core/growth-reveal.js',
    'core/growth-reveal.css',
    'poc/landmark-review/index.html',
    'poc/landmark-review/landmark-review.css',
    'poc/landmark-review/landmark-review.js',
    'poc/keepsake-review/index.html',
    'poc/keepsake-review/keepsake-review.css',
    'poc/keepsake-review/keepsake-review.js',
    'poc/keepsake-review/assets/earned-badge-frame-v2-768.webp'
  ]) {
    const file = path.join(root, relative);
    await fs.mkdir(path.dirname(file), { recursive: true });
    const contents = relative.endsWith('.mp3')
      ? VALID_MP3_BYTES
      : relative === 'index.html'
        ? publicHtml('灿然英语公开课程')
        : relative;
    await fs.writeFile(file, contents);
  }
  for (const course of PUBLISHED_COURSES) {
    await fs.writeFile(path.join(root, course.entry), publicHtml(`${course.id} 公开课程`, `
      ${course.presentation.declaredStatus === 'published'
        ? `<a href="${course.presentation.route}">课堂投屏</a>`
        : ''}
      <script src="/core/course-catalog.js"></script>
      <script>
        const COURSE_PROGRESS = CanranCore.courseCatalog.requirePublishedCourse('${course.id}').progress;
        const loaded = CanranCore.storage.loadProgress({
          storage: localStorage,
          key: COURSE_PROGRESS.key,
          legacyKey: COURSE_PROGRESS.legacyKey,
          ids: COURSE_PROGRESS.ids,
          legacyMode: COURSE_PROGRESS.legacyMode
        });
        const saved = CanranCore.storage.saveProgress({
          storage: localStorage,
          key: COURSE_PROGRESS.key,
          progress: loaded.progress,
          ids: COURSE_PROGRESS.ids
        });
        const recording = 'audio/clip.mp3';
      </script>
    `));
    if (course.map.declaredStatus === 'published') {
      const imageFiles = [
        course.map.baseAsset,
        ...course.map.stages.map(stage => stage.growthAsset),
        course.map.souvenir.asset,
        course.map.mobilePreview
      ];
      for (const relative of imageFiles) {
        const file = path.join(root, relative);
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, ONE_PIXEL_PNG);
      }
      const regression = path.join(root, course.map.regressionTest);
      await fs.mkdir(path.dirname(regression), { recursive: true });
      await fs.writeFile(regression, `
        'use strict';
        const { test, expect } = require('@playwright/test');
        test('published location journey', async () => { expect(true).toBe(true); });
      `);
    }
  }
  for (const course of PRESENTATION_COURSES) {
    const entry = path.join(root, course.presentation.entry);
    await fs.mkdir(path.dirname(entry), { recursive: true });
    const controls = course.presentation.controls.map(control => (
      control === 'exit'
        ? `<a href="${course.route}" data-presentation-control="exit">exit</a>`
        : `<button data-presentation-control="${control}">${control}</button>`
    )).join('\n');
    await fs.writeFile(entry, publicHtml(`${course.id} 课堂投屏`, `
      ${controls}
      <script src="/core/course-catalog.js"></script>
      <script src="/core/audio-player.js"></script>
      <script src="/core/classroom-presentation.js"></script>
      <script>
        const CLASSROOM_COURSE = CanranCore.courseCatalog.requirePublishedCourse('${course.id}');
        CanranCore.classroomPresentation.mount({ course: CLASSROOM_COURSE, audioPlayer: CanranCore.audio.createAudioPlayer() });
      </script>
    `));
    for (const step of course.presentation.steps) {
      const audio = path.join(root, step.audioAsset);
      await fs.mkdir(path.dirname(audio), { recursive: true });
      await fs.writeFile(audio, VALID_MP3_BYTES);
    }
    const regression = path.join(root, course.presentation.regressionTest);
    await fs.mkdir(path.dirname(regression), { recursive: true });
    await fs.writeFile(regression, `
      'use strict';
      const { test, expect } = require('@playwright/test');
      test('classroom presentation journey', async () => { expect(true).toBe(true); });
    `);
  }
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
    'add', '.'], { cwd: root });
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
    'commit', '--quiet', '-m', 'test root'], { cwd: root });
}

test('buildStatic emits only the public route tree plus a hash manifest', async t => {
  const out = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-dist-'));
  t.after(() => fs.rm(out, { recursive: true, force: true }));

  await buildStatic({ root: ROOT, out });

  for (const file of [
    'index.html',
    'home/index.html',
    'lesson49/index.html',
    'lesson49/present/index.html',
    'lesson49/audio/beef.mp3',
    'lesson50/index.html',
    'soundmark/index.html',
    'lesson51/index.html',
    'lesson51/audio/climate.mp3',
    'lesson52/index.html',
    'lesson52/audio/american.mp3',
    'lesson53/index.html',
    'lesson53/audio/mild.mp3',
    'lesson54/index.html',
    'lesson54/audio/australia.mp3',
    'core/audio-player.js',
    'core/classroom-presentation.js',
    'core/certificate-gate.js',
    'core/certificate-gate.css',
    'core/growth-reveal.js',
    'core/growth-reveal.css',
    'poc/landmark-review/index.html',
    'poc/landmark-review/landmark-review.css',
    'poc/landmark-review/landmark-review.js',
    'poc/keepsake-review/index.html',
    'poc/keepsake-review/keepsake-review.css',
    'poc/keepsake-review/keepsake-review.js',
    'poc/keepsake-review/assets/earned-badge-frame-v2-768.webp',
    'assets/adventure-map/lesson49/growth-01-awning.png',
    'assets/adventure-map/lesson50/growth-05-celebration.png',
    'assets/adventure-map/lesson51/growth-05-celebration.png',
    'assets/adventure-map/lesson52/growth-05-celebration.png',
    'assets/adventure-map/lesson53/growth-05-celebration.png',
    'assets/adventure-map/lesson54/growth-05-celebration.png',
    'assets/adventure-map/soundmark/growth-04-star-balcony.png',
    'release-manifest.json'
  ]) {
    assert.equal((await fs.stat(path.join(out, file))).isFile(), true, file);
  }

  await assert.rejects(fs.stat(path.join(out, 'README.md')), { code: 'ENOENT' });
  await assert.rejects(fs.stat(path.join(out, 'docs')), { code: 'ENOENT' });

  const manifest = JSON.parse(await fs.readFile(
    path.join(out, 'release-manifest.json'),
    'utf8'
  ));
  assert.equal(manifest.schema, 1);
  assert.equal(
    manifest.commit,
    execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim()
  );
  assert.match(manifest.files['lesson49/index.html'], /^[a-f0-9]{64}$/);
  assert.match(manifest.files['lesson49/present/index.html'], /^[a-f0-9]{64}$/);
  assert.match(manifest.files['lesson54/index.html'], /^[a-f0-9]{64}$/);
  assert.match(manifest.files['lesson54/audio/australia.mp3'], /^[a-f0-9]{64}$/);
  assert.match(manifest.files['core/certificate-gate.js'], /^[a-f0-9]{64}$/);
  assert.match(manifest.files['core/certificate-gate.css'], /^[a-f0-9]{64}$/);
  assert.match(manifest.files['core/growth-reveal.js'], /^[a-f0-9]{64}$/);
  assert.match(manifest.files['core/growth-reveal.css'], /^[a-f0-9]{64}$/);
  assert.match(
    manifest.files['assets/adventure-map/soundmark/growth-04-star-balcony.png'],
    /^[a-f0-9]{64}$/
  );

  const expected = await expectedPublicFiles(ROOT);
  const actual = (await listRegularFiles(out)).sort(comparePaths);
  assert.deepEqual(actual, [...expected, 'release-manifest.json'].sort(comparePaths));
  assert.deepEqual(Object.keys(manifest.files), expected);
  for (const relative of expected) {
    const source = await fs.readFile(path.join(ROOT, relative));
    const built = await fs.readFile(path.join(out, relative));
    assert.deepEqual(built, source, relative);
    assert.equal(manifest.files[relative], sha256(source), relative);
  }

  const secondOut = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-dist-repeat-'));
  t.after(() => fs.rm(secondOut, { recursive: true, force: true }));
  await buildStatic({ root: ROOT, out: secondOut });
  assert.deepEqual(
    await fs.readFile(path.join(secondOut, 'release-manifest.json')),
    await fs.readFile(path.join(out, 'release-manifest.json'))
  );
});

test('buildStatic rejects an unregistered lesson entry before creating output', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-unregistered-course-'));
  const out = path.join(root, 'dist');
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await writeSyntheticPublicRoot(root);
  await fs.mkdir(path.join(root, 'lesson-draft'), { recursive: true });
  await fs.writeFile(path.join(root, 'lesson-draft', 'index.html'), 'draft');
  execFileSync('git', ['add', 'lesson-draft/index.html'], { cwd: root });
  execFileSync(
    'git',
    ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
      'commit', '--quiet', '-m', 'add unregistered lesson'],
    { cwd: root }
  );

  await assert.rejects(
    buildStatic({ root, out }),
    /unregistered lesson entry: lesson-draft\/index\.html/
  );
  await assert.rejects(fs.stat(out), { code: 'ENOENT' });
});

test('buildStatic rejects a published course without prerecorded audio', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-missing-audio-'));
  const out = path.join(root, 'dist');
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await writeSyntheticPublicRoot(root);
  await fs.rm(path.join(root, 'lesson49/audio'), { recursive: true });
  await fs.mkdir(path.join(root, 'lesson49/audio'));
  await fs.writeFile(path.join(root, 'lesson49/audio/readme.txt'), 'speech synthesis is not publication audio');
  execFileSync('git', ['add', '-A'], { cwd: root });
  execFileSync(
    'git',
    ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
      'commit', '--quiet', '-m', 'remove lesson 49 recording'],
    { cwd: root }
  );

  await assert.rejects(
    buildStatic({ root, out }),
    /lesson49: prerecorded audio directory contains no \.mp3 file/
  );
  await assert.rejects(fs.stat(out), { code: 'ENOENT' });
});

test('buildStatic rejects application services in the public V1 runtime', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-public-service-'));
  const out = path.join(root, 'dist');
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await writeSyntheticPublicRoot(root);
  await fs.appendFile(path.join(root, 'core', 'audio-player.js'), '\nfetch("/api/progress");\n');
  execFileSync('git', ['add', 'core/audio-player.js'], { cwd: root });
  execFileSync(
    'git',
    ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
      'commit', '--quiet', '-m', 'add forbidden runtime service'],
    { cwd: root }
  );

  await assert.rejects(
    buildStatic({ root, out }),
    /core\/audio-player\.js: forbidden application service request/
  );
  await assert.rejects(fs.stat(out), { code: 'ENOENT' });
});

test('buildStatic refuses output paths that could erase its repository', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-build-sandbox-'));
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  const root = path.join(sandbox, 'repo');
  const marker = path.join(sandbox, 'keep-me.txt');
  await fs.mkdir(root);
  await fs.writeFile(marker, 'must survive');

  await assert.rejects(buildStatic({ root, out: sandbox }), /ancestor/);
  assert.equal(await fs.readFile(marker, 'utf8'), 'must survive');
  assert.equal((await fs.stat(root)).isDirectory(), true);
  await assert.rejects(buildStatic({ root, out: root }), /repository root/);
  await assert.rejects(buildStatic({ root, out: path.parse(root).root }), /filesystem root/);
});

test('buildStatic refuses an output alias that resolves to its repository', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-build-alias-'));
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  const root = path.join(sandbox, 'repo');
  const alias = path.join(sandbox, 'alias');
  const marker = path.join(root, 'keep-me.txt');
  await fs.mkdir(root);
  await fs.writeFile(marker, 'must survive');
  await fs.symlink(sandbox, alias);

  await assert.rejects(buildStatic({ root, out: path.join(alias, 'repo') }), /repository root/);
  assert.equal(await fs.readFile(marker, 'utf8'), 'must survive');
  assert.equal((await fs.stat(root)).isDirectory(), true);
});

test('buildStatic rejects symbolic links in allowlisted input directories', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-public-root-'));
  const out = path.join(root, 'dist');
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await writeSyntheticPublicRoot(root);
  await fs.symlink(path.join(os.tmpdir(), 'outside.mp3'), path.join(root, 'core', 'outside-link'));

  await assert.rejects(buildStatic({ root, out }), /symbolic link/);
  await assert.rejects(fs.stat(path.join(out, 'core', 'outside-link')), { code: 'ENOENT' });
});

test('buildStatic rechecks a source file before copying after preflight', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-copy-race-'));
  const root = path.join(sandbox, 'repo');
  const out = path.join(sandbox, 'out');
  const source = path.join(root, 'index.html');
  const secret = path.join(sandbox, 'private.txt');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  await fs.writeFile(secret, 'not public');

  const originalMkdir = fs.mkdir;
  let replaced = false;
  fs.mkdir = async (directory, options) => {
    const result = await originalMkdir(directory, options);
    if (!replaced && path.resolve(directory) === out) {
      replaced = true;
      await fs.rm(source);
      await fs.symlink(secret, source);
    }
    return result;
  };
  try {
    await assert.rejects(buildStatic({ root, out }), /symbolic link/);
  } finally {
    fs.mkdir = originalMkdir;
  }

  assert.equal(replaced, true);
  assert.equal(await fs.readFile(secret, 'utf8'), 'not public');
  await assert.rejects(fs.stat(path.join(out, 'index.html')), { code: 'ENOENT' });
});

test('buildStatic rejects a directory replaced by a link after preflight', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-directory-race-'));
  const root = path.join(sandbox, 'repo');
  const out = path.join(sandbox, 'out');
  const core = path.join(root, 'core');
  const external = path.join(sandbox, 'external-core');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  await fs.mkdir(external);
  await fs.writeFile(path.join(external, 'leaked.js'), 'not public');

  const originalMkdir = fs.mkdir;
  const originalReaddir = fs.readdir;
  const originalOpendir = fs.opendir;
  let outputReady = false;
  let replaced = false;
  const replaceCore = async directory => {
    if (outputReady && !replaced && path.resolve(directory) === core) {
      replaced = true;
      await fs.rm(core, { recursive: true });
      await fs.symlink(external, core);
    }
  };
  fs.mkdir = async (directory, options) => {
    const result = await originalMkdir(directory, options);
    if (path.resolve(directory) === out) outputReady = true;
    return result;
  };
  fs.readdir = async (directory, options) => {
    await replaceCore(directory);
    return originalReaddir(directory, options);
  };
  fs.opendir = async (directory, options) => {
    await replaceCore(directory);
    return originalOpendir(directory, options);
  };
  try {
    await assert.rejects(buildStatic({ root, out }), /symbolic link/);
  } finally {
    fs.mkdir = originalMkdir;
    fs.readdir = originalReaddir;
    fs.opendir = originalOpendir;
  }

  assert.equal(replaced, true);
  await assert.rejects(fs.stat(path.join(out, 'core', 'leaked.js')), { code: 'ENOENT' });
});

test('buildStatic rejects a child path that escapes after directory enumeration', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-child-race-'));
  const root = path.join(sandbox, 'repo');
  const out = path.join(sandbox, 'out');
  const core = path.join(root, 'core');
  const external = path.join(sandbox, 'external-core');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  await fs.mkdir(external);
  await fs.writeFile(path.join(external, 'audio-player.js'), 'not public');

  const originalOpendir = fs.opendir;
  let replaced = false;
  fs.opendir = async (directory, options) => {
    const opened = await originalOpendir(directory, options);
    if (path.resolve(directory) !== core) return opened;
    const originalRead = opened.read.bind(opened);
    opened.read = async () => {
      const entry = await originalRead();
      if (entry && !replaced) {
        replaced = true;
        await fs.rm(core, { recursive: true });
        await fs.symlink(external, core);
      }
      return entry;
    };
    return opened;
  };
  try {
    await assert.rejects(buildStatic({ root, out }), /outside repository/);
  } finally {
    fs.opendir = originalOpendir;
  }

  assert.equal(replaced, true);
  await assert.rejects(fs.stat(path.join(out, 'core', 'audio-player.js')), { code: 'ENOENT' });
});

test('buildStatic rejects non-regular files in allowlisted input directories', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-fifo-root-'));
  const out = path.join(root, 'dist');
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await writeSyntheticPublicRoot(root);
  execFileSync('mkfifo', [path.join(root, 'core', 'unsafe.fifo')]);

  await assert.rejects(buildStatic({ root, out }), /not a regular file/);
  await assert.rejects(fs.stat(path.join(out, 'core', 'unsafe.fifo')), { code: 'ENOENT' });
});

test('buildStatic only clears empty or previously verified build outputs', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-output-ownership-'));
  const root = path.join(sandbox, 'repo');
  const out = path.join(sandbox, 'out');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  await fs.mkdir(out);
  await fs.writeFile(path.join(out, 'keep-me.txt'), 'must survive');

  await assert.rejects(buildStatic({ root, out }), /unowned build output/);
  assert.equal(await fs.readFile(path.join(out, 'keep-me.txt'), 'utf8'), 'must survive');

  await fs.rm(out, { recursive: true });
  await fs.mkdir(out);
  await buildStatic({ root, out });
  const firstManifest = await fs.readFile(path.join(out, 'release-manifest.json'));
  await buildStatic({ root, out });
  assert.deepEqual(await fs.readFile(path.join(out, 'release-manifest.json')), firstManifest);
});

test('buildStatic refuses outputs that overlap public inputs before cleanup', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-output-overlap-'));
  const root = path.join(sandbox, 'repo');
  const index = path.join(root, 'index.html');
  const core = path.join(root, 'core');
  let indexBefore;
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  indexBefore = await fs.readFile(index, 'utf8');

  for (const out of [index, core, path.join(core, 'dist'), path.join(root, 'lesson49')]) {
    await assert.rejects(buildStatic({ root, out }), /overlaps public input/);
  }
  const alias = path.join(sandbox, 'root-alias');
  await fs.symlink(root, alias);
  await assert.rejects(buildStatic({ root, out: path.join(alias, 'core', 'dist') }), /overlaps public input/);
  assert.equal(await fs.readFile(index, 'utf8'), indexBefore);
  assert.equal(await fs.readFile(path.join(core, 'audio-player.js'), 'utf8'), 'core/audio-player.js');

  await buildStatic({ root });
  assert.equal((await fs.stat(path.join(root, 'dist', 'release-manifest.json'))).isFile(), true);
});

test('buildStatic binds a manifest to a clean public Git tree only', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-public-git-'));
  const root = path.join(sandbox, 'repo');
  const out = path.join(sandbox, 'out');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);

  await fs.writeFile(path.join(root, 'index.html'), 'dirty tracked public file');
  await assert.rejects(buildStatic({ root, out }), /public inputs differ from HEAD/);
  await assert.rejects(fs.stat(out), { code: 'ENOENT' });

  execFileSync('git', ['checkout', '--', 'index.html'], { cwd: root });
  await fs.writeFile(path.join(root, 'core', 'untracked.js'), 'dirty untracked public file');
  await assert.rejects(buildStatic({ root, out }), /public inputs differ from HEAD/);
  await assert.rejects(fs.stat(out), { code: 'ENOENT' });

  await fs.rm(path.join(root, 'core', 'untracked.js'));
  await fs.mkdir(path.join(root, 'scripts'), { recursive: true });
  await fs.writeFile(path.join(root, 'scripts', 'local-dev.js'), 'non-public dirty file');
  await buildStatic({ root, out });
  const manifest = JSON.parse(await fs.readFile(path.join(out, 'release-manifest.json')));
  assert.equal(manifest.commit, execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8'
  }).trim());

  await fs.mkdir(path.join(root, 'assets'), { recursive: true });
  await fs.writeFile(path.join(root, 'assets', 'tracked.js'), 'tracked optional public file');
  execFileSync('git', ['add', 'assets'], { cwd: root });
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
    'commit', '--quiet', '-m', 'add optional assets'], { cwd: root });
  await fs.rm(path.join(root, 'assets', 'tracked.js'));
  await assert.rejects(buildStatic({ root, out }), /public inputs differ from HEAD/);
});

test('buildStatic rejects incomplete or expanded old artifact ownership claims', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-old-artifact-'));
  const root = path.join(sandbox, 'repo');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);

  const makeClaim = async (name, manifest, files = []) => {
    const out = path.join(sandbox, name);
    await fs.mkdir(out, { recursive: true });
    for (const [relative, bytes] of files) {
      const file = path.join(out, relative);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, bytes);
    }
    await fs.writeFile(path.join(out, 'release-manifest.json'), JSON.stringify(manifest));
    return out;
  };

  const emptyClaim = await makeClaim('empty-claim', { schema: 1, commit: 'a'.repeat(40), files: {} });
  await assert.rejects(buildStatic({ root, out: emptyClaim }), /unowned build output/);
  assert.equal((await fs.stat(path.join(emptyClaim, 'release-manifest.json'))).isFile(), true);

  const onlyIndex = 'index.html';
  const incompleteClaim = await makeClaim('incomplete-claim', {
    schema: 1,
    commit: 'a'.repeat(40),
    files: { [onlyIndex]: sha256(Buffer.from('index only')) }
  }, [[onlyIndex, 'index only']]);
  await assert.rejects(buildStatic({ root, out: incompleteClaim }), /unowned build output/);

  const illegalKey = 'README.md';
  const illegalClaim = await makeClaim('illegal-claim', {
    schema: 1,
    commit: 'a'.repeat(40),
    files: { [illegalKey]: sha256(Buffer.from('not public')) }
  }, [[illegalKey, 'not public']]);
  await assert.rejects(buildStatic({ root, out: illegalClaim }), /unowned build output/);

  const extraFile = path.join(sandbox, 'extra-file');
  await buildStatic({ root, out: extraFile });
  await fs.writeFile(path.join(extraFile, 'sidecar.txt'), 'must survive');
  await assert.rejects(buildStatic({ root, out: extraFile }), /unowned build output/);
  assert.equal(await fs.readFile(path.join(extraFile, 'sidecar.txt'), 'utf8'), 'must survive');

  const extraDirectory = path.join(sandbox, 'extra-directory');
  await buildStatic({ root, out: extraDirectory });
  await fs.mkdir(path.join(extraDirectory, 'empty-sidecar'));
  await assert.rejects(buildStatic({ root, out: extraDirectory }), /unowned build output/);
  assert.equal((await fs.stat(path.join(extraDirectory, 'empty-sidecar'))).isDirectory(), true);
});

test('buildStatic rejects ignored public files absent from HEAD', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-ignored-public-'));
  const root = path.join(sandbox, 'repo');
  const out = path.join(sandbox, 'out');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  await fs.writeFile(path.join(root, '.gitignore'), 'core/ignored.js\n');
  await fs.writeFile(path.join(root, 'core', 'ignored.js'), 'ignored but public');

  await assert.rejects(buildStatic({ root, out }), /public inputs differ from HEAD/);
  await assert.rejects(fs.stat(out), { code: 'ENOENT' });
});

test('buildStatic rejects outputs overlapping absent optional inputs', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-absent-assets-'));
  const root = path.join(sandbox, 'repo');
  const assets = path.join(root, 'assets');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  await fs.rm(assets, { recursive: true });

  for (const out of [assets, path.join(assets, 'dist')]) {
    await assert.rejects(buildStatic({ root, out }), /overlaps public input/);
    await assert.rejects(fs.stat(assets), { code: 'ENOENT' });
  }
  const alias = path.join(sandbox, 'root-alias');
  await fs.symlink(root, alias);
  await assert.rejects(buildStatic({ root, out: path.join(alias, 'assets', 'dist') }), /overlaps public input/);
  await assert.rejects(fs.stat(assets), { code: 'ENOENT' });
});

test('buildStatic recognizes a valid artifact regardless of directory traversal order', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-ownership-order-'));
  const root = path.join(sandbox, 'repo');
  const out = path.join(sandbox, 'out');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  await fs.mkdir(path.join(root, 'core', 'a'), { recursive: true });
  await fs.writeFile(path.join(root, 'core', 'a', 'z.js'), 'nested public file');
  await fs.writeFile(path.join(root, 'core', 'a-foo.js'), 'sibling public file');
  execFileSync('git', ['add', 'core'], { cwd: root });
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
    'commit', '--quiet', '-m', 'add traversal-order public files'], { cwd: root });

  await buildStatic({ root, out });
  const firstManifest = await fs.readFile(path.join(out, 'release-manifest.json'));
  await buildStatic({ root, out });
  assert.deepEqual(await fs.readFile(path.join(out, 'release-manifest.json')), firstManifest);
});
