'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');
const zlib = require('node:zlib');
const catalog = require('../core/course-catalog');

function resolvePublicPath(root, relative) {
  const target = path.resolve(root, relative);
  const within = path.relative(root, target);
  if (within === '..' || within.startsWith(`..${path.sep}`) || path.isAbsolute(within)) {
    throw new Error(`course catalog path escapes repository: ${relative}`);
  }
  return target;
}

async function requireRegularFile(root, relative, label) {
  let stat;
  try {
    stat = await fs.lstat(resolvePublicPath(root, relative));
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`${label}: missing file ${relative}`);
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw new Error(`${label}: expected regular file ${relative}`);
  }
  return { file: resolvePublicPath(root, relative), stat };
}

async function requireDirectory(root, relative, label) {
  let stat;
  try {
    stat = await fs.lstat(resolvePublicPath(root, relative));
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`${label}: missing directory ${relative}`);
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error(`${label}: expected directory ${relative}`);
  }
}

async function readBytes(file, length, position = 0) {
  const handle = await fs.open(file, 'r');
  try {
    const bytes = Buffer.alloc(length);
    const { bytesRead } = await handle.read(bytes, 0, length, position);
    return bytes.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

const MPEG1_BITRATES = Object.freeze({
  1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0],
  2: [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 0],
  3: [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 0]
});
const MPEG2_BITRATES = Object.freeze({
  1: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
  2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
  3: [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 0]
});

function mp3FrameLength(header) {
  if (header.length < 4 || header[0] !== 0xff || (header[1] & 0xe0) !== 0xe0) return 0;
  const version = (header[1] >> 3) & 0x03;
  const layer = (header[1] >> 1) & 0x03;
  const bitrateIndex = header[2] >> 4;
  const sampleIndex = (header[2] >> 2) & 0x03;
  if (version === 1 || layer === 0 || bitrateIndex === 0 || bitrateIndex === 15 || sampleIndex === 3) {
    return 0;
  }

  const isMpeg1 = version === 3;
  const bitrate = (isMpeg1 ? MPEG1_BITRATES : MPEG2_BITRATES)[layer][bitrateIndex] * 1000;
  const samples = version === 3
    ? [44100, 48000, 32000]
    : version === 2
      ? [22050, 24000, 16000]
      : [11025, 12000, 8000];
  const sampleRate = samples[sampleIndex];
  const padding = (header[2] >> 1) & 0x01;
  if (layer === 3) return Math.floor((12 * bitrate) / sampleRate + padding) * 4;
  const coefficient = layer === 1 && !isMpeg1 ? 72 : 144;
  return Math.floor((coefficient * bitrate) / sampleRate + padding);
}

function syncSafeSize(bytes) {
  if (bytes.length < 4 || bytes.some(byte => (byte & 0x80) !== 0)) return -1;
  return (bytes[0] << 21) | (bytes[1] << 14) | (bytes[2] << 7) | bytes[3];
}

async function hasCompleteMp3Frame(file, stat) {
  const leading = await readBytes(file, 10);
  let frameOffset = 0;
  if (leading.subarray(0, 3).toString('ascii') === 'ID3') {
    if (leading.length < 10 || leading[3] === 0xff || leading[4] === 0xff) return false;
    const tagSize = syncSafeSize([...leading.subarray(6, 10)]);
    if (tagSize < 0) return false;
    frameOffset = 10 + tagSize + ((leading[5] & 0x10) !== 0 ? 10 : 0);
  }
  const frameLength = mp3FrameLength(await readBytes(file, 4, frameOffset));
  return frameLength > 0 && frameOffset + frameLength <= stat.size;
}

async function assertMp3Directory(root, relative, label) {
  const directory = resolvePublicPath(root, relative);
  let count = 0;

  async function visit(current) {
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      const child = path.join(current, entry.name);
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.mp3')) {
        count += 1;
        const stat = await fs.lstat(child);
        if (!stat.isFile() || !await hasCompleteMp3Frame(child, stat)) {
          const publicPath = path.relative(root, child).split(path.sep).join('/');
          throw new Error(`${label}: invalid MP3 file ${publicPath}`);
        }
      }
      if (entry.isDirectory()) await visit(child);
    }
  }

  await visit(directory);
  if (count === 0) {
    throw new Error(`${label}: prerecorded audio directory contains no .mp3 file`);
  }
}

function isCompletePng(bytes) {
  if (bytes.length < 45 || !bytes.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  )) return false;

  let cursor = 8;
  let width = 0;
  let height = 0;
  let sawHeader = false;
  let sawEnd = false;
  const imageData = [];
  while (cursor + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(cursor);
    const type = bytes.subarray(cursor + 4, cursor + 8).toString('ascii');
    const end = cursor + 12 + length;
    if (end > bytes.length || !/^[A-Za-z]{4}$/.test(type)) return false;
    const data = bytes.subarray(cursor + 8, cursor + 8 + length);
    if (!sawHeader) {
      if (type !== 'IHDR' || length !== 13) return false;
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (width === 0 || height === 0) return false;
      sawHeader = true;
    }
    if (type === 'IDAT') imageData.push(data);
    if (type === 'IEND') {
      if (length !== 0 || end !== bytes.length) return false;
      sawEnd = true;
      break;
    }
    cursor = end;
  }
  if (!sawHeader || !sawEnd || imageData.length === 0) return false;
  try {
    return zlib.inflateSync(Buffer.concat(imageData)).length >= height;
  } catch {
    return false;
  }
}

function isCompleteWebp(bytes) {
  if (bytes.length < 20 ||
    bytes.subarray(0, 4).toString('ascii') !== 'RIFF' ||
    bytes.subarray(8, 12).toString('ascii') !== 'WEBP' ||
    bytes.readUInt32LE(4) + 8 !== bytes.length) return false;

  let cursor = 12;
  let sawImage = false;
  while (cursor + 8 <= bytes.length) {
    const type = bytes.subarray(cursor, cursor + 4).toString('ascii');
    const length = bytes.readUInt32LE(cursor + 4);
    const end = cursor + 8 + length + (length % 2);
    if (end > bytes.length) return false;
    if (['VP8 ', 'VP8L', 'ANMF'].includes(type) && length > 0) sawImage = true;
    cursor = end;
  }
  return sawImage && cursor === bytes.length;
}

function isCompleteAvif(bytes) {
  if (bytes.length < 24) return false;
  let cursor = 0;
  let branded = false;
  let hasMeta = false;
  let hasMedia = false;
  while (cursor + 8 <= bytes.length) {
    let size = bytes.readUInt32BE(cursor);
    const type = bytes.subarray(cursor + 4, cursor + 8).toString('ascii');
    let headerSize = 8;
    if (size === 1) {
      if (cursor + 16 > bytes.length) return false;
      const extended = bytes.readBigUInt64BE(cursor + 8);
      if (extended > BigInt(Number.MAX_SAFE_INTEGER)) return false;
      size = Number(extended);
      headerSize = 16;
    } else if (size === 0) {
      size = bytes.length - cursor;
    }
    if (size < headerSize || cursor + size > bytes.length) return false;
    if (type === 'ftyp') {
      for (let offset = cursor + headerSize; offset + 4 <= cursor + size; offset += 4) {
        const brand = bytes.subarray(offset, offset + 4).toString('ascii');
        if (brand === 'avif' || brand === 'avis') branded = true;
      }
    }
    if (type === 'meta') hasMeta = true;
    if (type === 'mdat' && size > headerSize) hasMedia = true;
    cursor += size;
  }
  return cursor === bytes.length && branded && hasMeta && hasMedia;
}

function hasCompleteImage(relative, bytes) {
  if (relative.toLowerCase().endsWith('.png')) {
    return isCompletePng(bytes);
  }
  if (relative.toLowerCase().endsWith('.webp')) {
    return isCompleteWebp(bytes);
  }
  if (relative.toLowerCase().endsWith('.avif')) {
    return isCompleteAvif(bytes);
  }
  return false;
}

async function assertMapImage(root, relative, label) {
  const { file } = await requireRegularFile(root, relative, label);
  if (!hasCompleteImage(relative, await fs.readFile(file))) {
    throw new Error(`${label}: invalid map image ${relative}`);
  }
}

function scanJavaScript(source) {
  let withoutComments = '';
  let executable = '';
  let state = 'code';
  let quote = '';

  for (let index = 0; index < source.length; index += 1) {
    const current = source[index];
    const next = source[index + 1];
    if (state === 'line-comment') {
      const newline = current === '\n' || current === '\r';
      withoutComments += newline ? current : ' ';
      executable += newline ? current : ' ';
      if (newline) state = 'code';
      continue;
    }
    if (state === 'block-comment') {
      if (current === '*' && next === '/') {
        withoutComments += '  ';
        executable += '  ';
        index += 1;
        state = 'code';
      } else {
        const replacement = current === '\n' || current === '\r' ? current : ' ';
        withoutComments += replacement;
        executable += replacement;
      }
      continue;
    }
    if (state === 'string') {
      withoutComments += current;
      executable += current === '\n' || current === '\r' ? current : ' ';
      if (current === '\\' && next !== undefined) {
        withoutComments += next;
        executable += next === '\n' || next === '\r' ? next : ' ';
        index += 1;
      } else if (current === quote) {
        state = 'code';
      }
      continue;
    }
    if (current === '/' && next === '/') {
      withoutComments += '  ';
      executable += '  ';
      index += 1;
      state = 'line-comment';
      continue;
    }
    if (current === '/' && next === '*') {
      withoutComments += '  ';
      executable += '  ';
      index += 1;
      state = 'block-comment';
      continue;
    }
    if (current === "'" || current === '"' || current === '`') {
      quote = current;
      state = 'string';
      withoutComments += current;
      executable += ' ';
      continue;
    }
    withoutComments += current;
    executable += current;
  }
  return { withoutComments, executable };
}

function importsPlaywrightTest(scanned) {
  const pattern = /\bconst\s*\{([^}]*)\}\s*=\s*require\s*\(\s*['"]@playwright\/test['"]\s*\)/g;
  for (const match of scanned.withoutComments.matchAll(pattern)) {
    if (scanned.executable.slice(match.index, match.index + 5) !== 'const') continue;
    const bindings = match[1].split(',').map(binding => binding.trim());
    if (bindings.some(binding => binding === 'test' || /^test\s*:\s*test$/.test(binding))) {
      return true;
    }
  }
  return false;
}

function nextNonWhitespace(source, start) {
  let index = start;
  while (index < source.length && /\s/.test(source[index])) index += 1;
  return index;
}

function hasEnabledTestCall(scanned) {
  for (const match of scanned.executable.matchAll(/\btest\b/g)) {
    let before = match.index - 1;
    while (before >= 0 && /\s/.test(scanned.executable[before])) before -= 1;
    if (before >= 0 && scanned.executable[before] === '.') continue;

    const open = nextNonWhitespace(scanned.executable, match.index + match[0].length);
    if (scanned.executable[open] !== '(') continue;
    const argument = nextNonWhitespace(scanned.withoutComments, open + 1);
    if (!["'", '"', '`'].includes(scanned.withoutComments[argument])) continue;

    let depth = 0;
    let close = -1;
    for (let index = open; index < scanned.executable.length; index += 1) {
      if (scanned.executable[index] === '(') depth += 1;
      if (scanned.executable[index] === ')') {
        depth -= 1;
        if (depth === 0) {
          close = index;
          break;
        }
      }
    }
    if (close < 0) continue;
    const after = nextNonWhitespace(scanned.executable, close + 1);
    if (scanned.executable[after] !== '{') return true;
  }
  return false;
}

async function assertRegressionSpec(root, relative, label) {
  const { file, stat } = await requireRegularFile(root, relative, label);
  if (stat.size > 512 * 1024) {
    throw new Error(`${label}: invalid Playwright regression test ${relative}`);
  }
  const source = await fs.readFile(file, 'utf8');
  try {
    new vm.Script(source, { filename: relative });
  } catch {
    throw new Error(`${label}: invalid Playwright regression test ${relative}`);
  }
  const scanned = scanJavaScript(source);
  const importsPlaywright = importsPlaywrightTest(scanned);
  const declaresEnabledTest = hasEnabledTestCall(scanned);
  if (!importsPlaywright || !declaresEnabledTest) {
    throw new Error(`${label}: invalid Playwright regression test ${relative}`);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function catalogScriptIndex(source) {
  return source.search(/<script\b[^>]*\bsrc\s*=\s*['"]\/core\/course-catalog\.js['"][^>]*>/i);
}

function catalogLookupIndex(source, course) {
  const id = escapeRegExp(course.id);
  return source.search(new RegExp(
    `\\bconst\\s+COURSE_PROGRESS\\s*=\\s*CanranCore\\.courseCatalog` +
    `\\.requirePublishedCourse\\(\\s*['"]${id}['"]\\s*\\)\\.progress`
  ));
}

function hasSameOriginAudioReference(source, course) {
  const tokens = [
    "'audio/", '"audio/', '`audio/',
    `'/${course.id}/audio/`, `"/${course.id}/audio/`, `\`/${course.id}/audio/`
  ];
  return tokens.some(token => source.includes(token)) && source.includes('.mp3');
}

async function assertCoursePageContract(root, course) {
  const source = await fs.readFile(resolvePublicPath(root, course.entry), 'utf8');
  const scriptIndex = catalogScriptIndex(source);
  if (scriptIndex < 0) {
    throw new Error(`${course.id}: course page must load /core/course-catalog.js`);
  }
  const lookupIndex = catalogLookupIndex(source, course);
  if (lookupIndex < 0 || lookupIndex < scriptIndex) {
    throw new Error(`${course.id}: course page must resolve ${course.id} from the shared catalog`);
  }
  if (/['"`](?:canran:[^'"`]*:progress:v\d+|(?:l\d+|phonics-magic)-stars-v\d+)['"`]/.test(source)) {
    throw new Error(`${course.id}: course page must not hard-code progress storage metadata`);
  }
  const requiredProgressFields = ['key', 'ids'];
  if (course.progress.legacyKey) requiredProgressFields.push('legacyKey');
  if (course.progress.legacyMode) requiredProgressFields.push('legacyMode');
  if (!requiredProgressFields.every(field => source.includes(`COURSE_PROGRESS.${field}`)) ||
    !source.includes('CanranCore.storage.loadProgress') ||
    !source.includes('CanranCore.storage.saveProgress')) {
    throw new Error(`${course.id}: course page must use shared progress metadata for storage`);
  }
  if (!hasSameOriginAudioReference(source, course)) {
    throw new Error(`${course.id}: course page must reference same-origin prerecorded audio`);
  }
}

function publishedMapImages(course) {
  return [
    course.map.baseAsset,
    ...course.map.stages.map(stage => stage.growthAsset),
    course.map.souvenir.asset,
    course.map.mobilePreview
  ];
}

async function assertCourseCatalogContract({
  root = path.resolve(__dirname, '..'),
  courses = catalog.COURSES
} = {}) {
  const resolvedRoot = path.resolve(root);
  catalog.assertValidCatalog(courses);

  for (const course of courses.filter(item => item.courseStatus === 'published')) {
    await requireRegularFile(resolvedRoot, course.entry, course.id);
    await assertCoursePageContract(resolvedRoot, course);
    const expectedAudio = `${course.id}/audio`;
    if (!course.assetDirectories.includes(expectedAudio)) {
      throw new Error(`${course.id}: prerecorded audio directory must be ${expectedAudio}`);
    }
    await requireDirectory(resolvedRoot, expectedAudio, course.id);
    await assertMp3Directory(resolvedRoot, expectedAudio, course.id);
    if (course.map.declaredStatus === 'published') {
      for (const relative of publishedMapImages(course)) {
        await assertMapImage(resolvedRoot, relative, course.id);
      }
      await assertRegressionSpec(
        resolvedRoot,
        course.map.regressionTest,
        course.id
      );
    }
  }

  return courses;
}

module.exports = { assertCourseCatalogContract };
