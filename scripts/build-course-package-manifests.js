'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const CHINESE_SHARD_CSS = path.join(
  ROOT,
  'node_modules/@fontsource/zcool-kuaile/400.css'
);
const CHINESE_SHARD_DIRECTORY = path.join(ROOT, 'node_modules/@fontsource/zcool-kuaile/files');
const SHARED_FONT_DIRECTORY = path.join(ROOT, 'assets/fonts/course-package');
const PACKAGE_SCHEMA = 1;
const PACKAGE_REVISION = 'course-package-v1';
const U01_PUBLIC_ROUTE = '/poc/lesson-1-2/';
const RESOURCE_EXTENSION = /\.(?:avif|css|jpe?g|js|json|mp3|png|svg|webp|woff2)$/i;
const ABSOLUTE_RESOURCE = /\/(?:assets|core|poc)\/[A-Za-z0-9._~!$&'()*+,;=:@%/\-]+\.(?:avif|css|jpe?g|json|js|mp3|png|svg|webp|woff2)/gi;
const RESOURCE_SOURCE_ALIASES = Object.freeze([
  [`${U01_PUBLIC_ROUTE}course/`, '/poc/lesson1-2-experience/'],
  [`${U01_PUBLIC_ROUTE}core/`, '/core/'],
  [`${U01_PUBLIC_ROUTE}assets/`, '/assets/'],
  [`${U01_PUBLIC_ROUTE}review-files/`, '/poc/lesson1-2-review/']
]);

const UNITS = [
  {
    unitId: 'NCE-U01',
    pageDirectory: 'poc/lesson1-2-experience',
    scopePath: U01_PUBLIC_ROUTE,
    manifestUrl: `${U01_PUBLIC_ROUTE}course/course-package-manifest.json`,
    unitCatalogUrl: `${U01_PUBLIC_ROUTE}course/course-package/unit-catalog.json`,
    styles: [
      '/poc/lesson-1-2/course/course-fonts.css',
      '/poc/lesson-1-2/course/experience.css',
      '/poc/lesson-1-2/core/candidate-pointing-feedback.css'
    ],
    scripts: [
      '/poc/lesson-1-2/core/learning-store.js',
      '/poc/lesson-1-2/core/learning-ledger.js',
      '/poc/lesson-1-2/core/learning-runtime.js',
      '/poc/lesson-1-2/core/learning-outcome-practice.js',
      '/poc/lesson-1-2/core/learning-microtask-scene.js',
      '/poc/lesson-1-2/course/experience.js'
    ]
  },
  {
    unitId: 'NCE-U02',
    pageDirectory: 'poc/lesson3-4-experience',
    scopePath: '/poc/lesson3-4-experience/',
    styles: [
      '/poc/lesson3-4-experience/course-fonts.css',
      '/poc/story-stage-experience.css',
      '/core/candidate-pointing-feedback.css'
    ],
    scripts: [
      '/core/story-stage-runtime.js',
      '/core/story-stage-scene.js',
      '/poc/lesson3-4-experience/experience.js'
    ]
  },
  {
    unitId: 'NCE-U03',
    pageDirectory: 'poc/lesson5-6-experience',
    scopePath: '/poc/lesson5-6-experience/',
    styles: [
      '/poc/lesson5-6-experience/course-fonts.css',
      '/poc/story-stage-experience.css',
      '/core/candidate-pointing-feedback.css'
    ],
    scripts: [
      '/core/story-stage-runtime.js',
      '/core/story-stage-scene.js',
      '/core/story-stage-boot.js'
    ]
  },
  {
    unitId: 'NCE-U04',
    pageDirectory: 'poc/lesson7-8-experience',
    scopePath: '/poc/lesson7-8-experience/',
    styles: [
      '/poc/lesson7-8-experience/course-fonts.css',
      '/poc/story-stage-experience.css',
      '/core/candidate-pointing-feedback.css'
    ],
    scripts: [
      '/core/story-stage-runtime.js',
      '/core/story-stage-scene.js',
      '/core/story-stage-boot.js'
    ]
  }
];

const BOOTSTRAP_RESOURCES = [
  '/core/course-package-entry.js',
  '/core/course-package-installer.js',
  '/core/course-package-service-worker.js',
  '/poc/lesson1-2-experience/assets/icons/star-fill.svg',
  ...[1, 2, 3, 4].map(
    frame => `/assets/adventure-map/mascot/loader/frame-${frame}-route-page-20260806-01-192.webp`
  )
];

const U01_DYNAMIC_ICONS = [
  'arrow-counterclockwise.svg',
  'arrow-right.svg',
  'gear-fill.svg',
  'heart-fill.svg',
  'play-fill.svg',
  'star-fill.svg'
].map(name => `/poc/lesson-1-2/course/assets/icons/${name}`);

const LATIN_FONT_FACES = [
  ['Baloo 2', 500, 'baloo-2-latin-500.woff2'],
  ['Baloo 2', 700, 'baloo-2-latin-700.woff2'],
  ['Baloo 2', 800, 'baloo-2-latin-800.woff2'],
  ['ZCOOL KuaiLe', 400, 'zcool-kuaile-latin-400.woff2'],
  ['Fredoka', 400, 'fredoka-latin-400.woff2'],
  ['Fredoka', 500, 'fredoka-latin-500.woff2'],
  ['Fredoka', 600, 'fredoka-latin-600.woff2'],
  ['Fredoka', 700, 'fredoka-latin-700.woff2']
];

const LATIN_UNICODE_RANGE = [
  'U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA',
  'U+02DC', 'U+0304', 'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122',
  'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD'
].join(',');

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function writeIfChanged(filePath, content) {
  const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (fs.existsSync(filePath) && fs.readFileSync(filePath).equals(bytes)) return false;
  fs.writeFileSync(filePath, bytes);
  return true;
}

function publicResourceUrl(config, value) {
  if (config.unitId !== 'NCE-U01' || typeof value !== 'string') return value;
  if (value.startsWith('/assets/')) return `${U01_PUBLIC_ROUTE}assets/${value.slice('/assets/'.length)}`;
  if (value.startsWith('/core/')) return `${U01_PUBLIC_ROUTE}core/${value.slice('/core/'.length)}`;
  if (value === '/poc/lesson1-2-experience/') return U01_PUBLIC_ROUTE;
  if (value.startsWith('/poc/lesson1-2-experience/')) {
    return `${U01_PUBLIC_ROUTE}course/${value.slice('/poc/lesson1-2-experience/'.length)}`;
  }
  if (value === '/poc/lesson1-2-review/') return `${U01_PUBLIC_ROUTE}review/`;
  if (value.startsWith('/poc/lesson1-2-review/')) {
    return `${U01_PUBLIC_ROUTE}review-files/${value.slice('/poc/lesson1-2-review/'.length)}`;
  }
  return value;
}

function mapPublicResourceUrls(config, value) {
  if (typeof value === 'string') return publicResourceUrl(config, value);
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(item => mapPublicResourceUrls(config, item));
  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [key, mapPublicResourceUrls(config, nested)])
  );
}

function sourceResourceUrl(resourceUrlValue) {
  for (const [publicPrefix, sourcePrefix] of RESOURCE_SOURCE_ALIASES) {
    if (resourceUrlValue.startsWith(publicPrefix)) {
      return `${sourcePrefix}${resourceUrlValue.slice(publicPrefix.length)}`;
    }
  }
  return resourceUrlValue;
}

function resourcePath(resourceUrl) {
  if (!resourceUrl.startsWith('/') || resourceUrl.includes('..')) {
    throw new Error(`unsafe course-package resource URL: ${resourceUrl}`);
  }
  const sourceUrl = sourceResourceUrl(resourceUrl);
  const filePath = path.resolve(ROOT, `.${decodeURIComponent(sourceUrl)}`);
  if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
    throw new Error(`course-package resource escapes the repository: ${resourceUrl}`);
  }
  return filePath;
}

function resourceUrl(value, baseUrl) {
  if (typeof value !== 'string' || !value || value.startsWith('data:')) return null;
  let parsed;
  try {
    parsed = new URL(value, `https://course-package.invalid${baseUrl}`);
  } catch {
    return null;
  }
  if (parsed.origin !== 'https://course-package.invalid' || !RESOURCE_EXTENSION.test(parsed.pathname)) {
    return null;
  }
  return parsed.pathname;
}

function collectObjectResources(value, resources) {
  if (typeof value === 'string') {
    const url = resourceUrl(value, '/');
    if (url) resources.add(url);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (const item of value) collectObjectResources(item, resources);
    return;
  }
  for (const item of Object.values(value)) collectObjectResources(item, resources);
}

function collectTextResources(text, baseUrl, resources) {
  for (const match of text.matchAll(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/gi)) {
    const url = resourceUrl(match[2].trim(), baseUrl);
    if (url) resources.add(url);
  }
  for (const match of text.matchAll(ABSOLUTE_RESOURCE)) {
    const url = resourceUrl(match[0], baseUrl);
    if (url) resources.add(url);
  }
}

function preferredImageUrl(value) {
  if (typeof value !== 'string' || !/\.(?:jpe?g|png|webp)$/i.test(value)) return value;
  const parsed = resourceUrl(value, '/');
  if (!parsed) return value;
  const avif = parsed.replace(/\.(?:jpe?g|png|webp)$/i, '.avif');
  return fs.existsSync(resourcePath(avif)) ? avif : value;
}

function normalizeUnitImages(value) {
  if (typeof value === 'string') return preferredImageUrl(value);
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(normalizeUnitImages);

  const normalized = Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [key, normalizeUnitImages(nested)])
  );
  if (normalized.assets && typeof normalized.assets === 'object') {
    const preferred = normalized.assets.preferred
      || normalized.assets.avif
      || normalized.assets.webp
      || normalized.assets.png;
    if (preferred) normalized.assets = { preferred: preferredImageUrl(preferred) };
  }
  for (const [primaryKey, fallbackKey] of [
    ['assetSrc', 'assetFallbackSrc'],
    ['imageSrc', 'imageFallbackSrc'],
    ['backgroundWide', 'backgroundWideFallback'],
    ['backgroundPortrait', 'backgroundPortraitFallback']
  ]) {
    if (!normalized[primaryKey] && !normalized[fallbackKey]) continue;
    normalized[primaryKey] = preferredImageUrl(
      normalized[primaryKey] || normalized[fallbackKey]
    );
    delete normalized[fallbackKey];
  }
  return normalized;
}

function chineseCodepoints(text) {
  return [...new Set([...text]
    .map(character => character.codePointAt(0))
    .filter(codepoint => (
      (codepoint >= 0x2e80 && codepoint <= 0x2eff)
      || (codepoint >= 0x2f00 && codepoint <= 0x2fdf)
      || (codepoint >= 0x3000 && codepoint <= 0x303f)
      || (codepoint >= 0x31c0 && codepoint <= 0x31ef)
      || (codepoint >= 0x3400 && codepoint <= 0x4dbf)
      || (codepoint >= 0x4e00 && codepoint <= 0x9fff)
      || (codepoint >= 0xf900 && codepoint <= 0xfaff)
      || (codepoint >= 0xff00 && codepoint <= 0xffef)
    )))]
    .sort((left, right) => left - right);
}

function materializeSharedFonts() {
  const result = [];
  for (const [family, weight, sourceName] of LATIN_FONT_FACES) {
    const sourcePath = path.join(ROOT, 'assets/fonts', sourceName);
    const bytes = fs.readFileSync(sourcePath);
    const digest = sha256(bytes).slice(0, 16);
    const outputName = `${path.basename(sourceName, '.woff2')}-${digest}.woff2`;
    const outputPath = path.join(SHARED_FONT_DIRECTORY, outputName);
    writeIfChanged(outputPath, bytes);
    result.push({
      family,
      weight,
      url: `/assets/fonts/course-package/${outputName}`
    });
  }
  return result;
}

async function materializeDerivedImages() {
  const sourcePath = path.join(
    ROOT,
    'poc/lesson1-2-experience/assets/starlight-station-bg.png'
  );
  const outputPath = path.join(
    ROOT,
    'poc/lesson1-2-experience/assets/starlight-station-bg-package-v1.avif'
  );
  const temporaryPath = `${outputPath}.${process.pid}.tmp`;
  await sharp(sourcePath)
    .avif({ quality: 68, effort: 6, chromaSubsampling: '4:4:4' })
    .toFile(temporaryPath);
  writeIfChanged(outputPath, fs.readFileSync(temporaryPath));
  fs.unlinkSync(temporaryPath);
}

function parseUnicodeRange(value) {
  return value.split(',').map(token => {
    const match = /^U\+([A-F0-9]+)(?:-([A-F0-9]+))?$/i.exec(token.trim());
    if (!match) throw new Error(`invalid font unicode range: ${token}`);
    return [parseInt(match[1], 16), parseInt(match[2] || match[1], 16)];
  });
}

function chineseShardCatalog() {
  const css = fs.readFileSync(CHINESE_SHARD_CSS, 'utf8');
  return [...css.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)].map(match => {
    const body = match[1];
    const fileName = /files\/([^)'"\s]+\.woff2)/.exec(body)?.[1];
    const unicodeRange = /unicode-range:\s*([^;]+);/i.exec(body)?.[1];
    if (!fileName || !unicodeRange) throw new Error('fontsource Chinese shard metadata is incomplete');
    return { fileName, unicodeRange, ranges: parseUnicodeRange(unicodeRange) };
  });
}

function materializeChineseSubset(text) {
  const codepoints = chineseCodepoints(text);
  if (codepoints.length === 0) throw new Error('course unit has no Chinese glyphs to subset');
  const selected = chineseShardCatalog().filter(shard => codepoints.some(
    codepoint => shard.ranges.some(([start, end]) => codepoint >= start && codepoint <= end)
  ));
  const covered = codepoints.filter(codepoint => selected.some(
    shard => shard.ranges.some(([start, end]) => codepoint >= start && codepoint <= end)
  ));
  if (covered.length !== codepoints.length) {
    throw new Error('fontsource Chinese shards do not cover every course glyph');
  }
  return selected.map(shard => {
    const bytes = fs.readFileSync(path.join(CHINESE_SHARD_DIRECTORY, shard.fileName));
    const outputName = `${path.basename(shard.fileName, '.woff2')}-${sha256(bytes).slice(0, 16)}.woff2`;
    writeIfChanged(path.join(SHARED_FONT_DIRECTORY, outputName), bytes);
    return {
      family: 'ZCOOL KuaiLe',
      weight: 400,
      url: `/assets/fonts/course-package/${outputName}`,
      unicodeRange: shard.unicodeRange
    };
  });
}

function fontFace({ family, weight, url, unicodeRange }) {
  return [
    '@font-face {',
    `  font-family: '${family}';`,
    '  font-style: normal;',
    `  font-weight: ${weight};`,
    '  font-display: swap;',
    `  src: url('${url}') format('woff2');`,
    `  unicode-range: ${unicodeRange};`,
    '}',
    ''
  ].join('\n');
}

function materializeCourseFonts(config, latinFaces, chineseSubsets) {
  const css = [
    ...latinFaces.map(face => fontFace({ ...face, unicodeRange: LATIN_UNICODE_RANGE })),
    ...chineseSubsets.map(fontFace)
  ].join('');
  const outputPath = path.join(ROOT, config.pageDirectory, config.fontsFilename || 'course-fonts.css');
  writeIfChanged(outputPath, css);
  return css;
}

function kindFor(resourceUrlValue) {
  const extension = path.extname(resourceUrlValue).slice(1).toLowerCase();
  if (['avif', 'jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension)) return 'image';
  if (extension === 'mp3') return 'audio';
  if (extension === 'woff2') return 'font';
  if (extension === 'css') return 'style';
  if (extension === 'js') return 'script';
  if (extension === 'json') return 'data';
  return 'asset';
}

function manifestEntry(resourceUrlValue) {
  const filePath = resourcePath(resourceUrlValue);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(`course-package resource is missing: ${resourceUrlValue}`);
  }
  const bytes = fs.readFileSync(filePath);
  if (bytes.length === 0) throw new Error(`course-package resource is empty: ${resourceUrlValue}`);
  return {
    url: resourceUrlValue,
    kind: kindFor(resourceUrlValue),
    bytes: bytes.length,
    sha256: sha256(bytes)
  };
}

function replaceManifestHash(htmlPath, digest) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const marker = /data-manifest-sha256="[a-f0-9]{64}"/;
  if (!marker.test(html)) throw new Error(`manifest hash marker is missing: ${htmlPath}`);
  writeIfChanged(htmlPath, html.replace(marker, `data-manifest-sha256="${digest}"`));
}

function buildUnit(config, catalog, latinFaces) {
  const unit = catalog.getTeachingUnit(config.unitId);
  if (!unit) throw new Error(`catalog unit is missing: ${config.unitId}`);
  const catalogErrors = catalog.validate([unit]);
  if (catalogErrors.length > 0) {
    throw new Error(`${config.unitId} catalog is invalid:\n${catalogErrors.join('\n')}`);
  }

  const pageDirectory = path.join(ROOT, config.pageDirectory);
  const htmlPath = path.join(pageDirectory, config.entryFilename || 'index.html');
  const packageUnit = normalizeUnitImages(mapPublicResourceUrls(
    config,
    JSON.parse(JSON.stringify(unit))
  ));
  const unitCatalogPath = path.join(pageDirectory, config.unitCatalogFilename || 'course-package/unit-catalog.json');
  const unitCatalogJson = `${JSON.stringify(packageUnit, null, 2)}\n`;
  writeIfChanged(unitCatalogPath, unitCatalogJson);

  const textInputs = [unitCatalogJson, fs.readFileSync(htmlPath, 'utf8')];
  const fontsFilename = config.fontsFilename || 'course-fonts.css';
  for (const resource of [...config.styles.filter(value => !value.endsWith(`/${fontsFilename}`)), ...config.scripts]) {
    textInputs.push(fs.readFileSync(resourcePath(resource), 'utf8'));
  }
  const unitLatinFaces = latinFaces.map(face => ({
    ...face,
    url: publicResourceUrl(config, face.url)
  }));
  const chineseSubsets = (config.systemChineseFont ? [] : materializeChineseSubset(textInputs.join('\n'))).map(face => ({
    ...face,
    url: publicResourceUrl(config, face.url)
  }));
  const courseFontsCss = materializeCourseFonts(config, unitLatinFaces, chineseSubsets);
  const bootstrapResources = (config.bootstrapResources || BOOTSTRAP_RESOURCES).map(value => publicResourceUrl(config, value));

  const resources = new Set([
    ...bootstrapResources,
    ...config.styles,
    ...config.scripts,
    ...unitLatinFaces.map(face => face.url),
    ...chineseSubsets.map(face => face.url),
    config.unitCatalogUrl || `/${config.pageDirectory}/course-package/unit-catalog.json`
  ]);
  if (config.unitId === 'NCE-U01') {
    for (const icon of config.dynamicIcons || U01_DYNAMIC_ICONS) resources.add(icon);
  }
  collectObjectResources(packageUnit, resources);
  collectTextResources(fs.readFileSync(htmlPath, 'utf8'), config.scopePath, resources);
  const courseFontsUrl = config.styles.find(value => value.endsWith(`/${fontsFilename}`));
  collectTextResources(courseFontsCss, courseFontsUrl, resources);
  for (const resource of [...config.styles, ...config.scripts, ...bootstrapResources]) {
    const filePath = resourcePath(resource);
    if (!/\.(?:css|js)$/i.test(filePath)) continue;
    collectTextResources(fs.readFileSync(filePath, 'utf8'), resource, resources);
  }

  const manifestUrl = config.manifestUrl
    || `/${config.pageDirectory}/course-package-manifest.json`;
  resources.delete(manifestUrl);

  const entries = [...resources]
    .map(value => resourceUrl(value, config.scopePath))
    .filter(Boolean)
    .sort((left, right) => left < right ? -1 : left > right ? 1 : 0)
    .map(manifestEntry);
  const manifest = {
    schema: PACKAGE_SCHEMA,
    packageId: `${config.unitId}@${unit.experienceRevision}-${PACKAGE_REVISION}`,
    unitId: config.unitId,
    revision: unit.experienceRevision,
    scopePath: config.scopePath,
    totalBytes: entries.reduce((total, entry) => total + entry.bytes, 0),
    entries
  };
  const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  const manifestPath = path.join(pageDirectory, config.manifestFilename || 'course-package-manifest.json');
  writeIfChanged(manifestPath, manifestBytes);
  const manifestSha256 = sha256(manifestBytes);
  replaceManifestHash(htmlPath, manifestSha256);
  return {
    unitId: config.unitId,
    revision: unit.experienceRevision,
    entries: entries.length,
    totalBytes: manifest.totalBytes,
    manifestSha256
  };
}

async function buildAll() {
  await materializeDerivedImages();
  const catalog = require(path.join(ROOT, 'core/curriculum-catalog.js'));
  const latinFaces = materializeSharedFonts();
  return UNITS.map(config => buildUnit(config, catalog, latinFaces));
}

if (require.main === module) {
  void buildAll().then(results => {
    for (const result of results) {
      process.stdout.write(
        `${result.unitId} ${result.entries} files ${(result.totalBytes / 1024 / 1024).toFixed(1)} MB ${result.manifestSha256}\n`
      );
    }
  }).catch(error => {
    process.stderr.write(`${error.stack || error}\n`);
    process.exitCode = 1;
  });
}

module.exports = Object.freeze({
  UNITS,
  sha256,
  resourceUrl,
  chineseCodepoints,
  normalizeUnitImages,
  buildUnit,
  materializeSharedFonts,
  buildAll
});
