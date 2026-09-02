'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets/fonts');
const COPIES = [
  ['@fontsource/baloo-2/files/baloo-2-latin-500-normal.woff2', 'baloo-2-latin-500.woff2'],
  ['@fontsource/baloo-2/files/baloo-2-latin-700-normal.woff2', 'baloo-2-latin-700.woff2'],
  ['@fontsource/baloo-2/files/baloo-2-latin-800-normal.woff2', 'baloo-2-latin-800.woff2'],
  ['@fontsource/zcool-kuaile/files/zcool-kuaile-latin-400-normal.woff2', 'zcool-kuaile-latin-400.woff2'],
  ['@fontsource/zcool-kuaile/files/zcool-kuaile-chinese-simplified-400-normal.woff2', 'zcool-kuaile-chinese-simplified-400.woff2'],
  ['@fontsource/fredoka/files/fredoka-latin-400-normal.woff2', 'fredoka-latin-400.woff2'],
  ['@fontsource/fredoka/files/fredoka-latin-500-normal.woff2', 'fredoka-latin-500.woff2'],
  ['@fontsource/fredoka/files/fredoka-latin-600-normal.woff2', 'fredoka-latin-600.woff2'],
  ['@fontsource/fredoka/files/fredoka-latin-700-normal.woff2', 'fredoka-latin-700.woff2'],
  ['@fontsource/baloo-2/LICENSE', 'LICENSE-Baloo-2.txt'],
  ['@fontsource/zcool-kuaile/LICENSE', 'LICENSE-ZCOOL-KuaiLe.txt'],
  ['@fontsource/fredoka/LICENSE', 'LICENSE-Fredoka.txt']
];

const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const CJK = 'U+2E80-2EFF,U+2F00-2FDF,U+3000-303F,U+31C0-31EF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FFEF';

function face(family, file, weight, range) {
  return [
    '@font-face {',
    `  font-family: '${family}';`,
    '  font-style: normal;',
    `  font-weight: ${weight};`,
    '  font-display: swap;',
    `  src: url('./${file}') format('woff2');`,
    `  unicode-range: ${range};`,
    '}',
    ''
  ].join('\n');
}

async function vendorFonts() {
  await fs.mkdir(OUT, { recursive: true });
  for (const entry of await fs.readdir(OUT, { withFileTypes: true })) {
    if (entry.name === 'course-package' && entry.isDirectory()) continue;
    await fs.rm(path.join(OUT, entry.name), { recursive: true, force: true });
  }
  for (const [modulePath, target] of COPIES) {
    const source = path.join(ROOT, 'node_modules', modulePath);
    await fs.copyFile(source, path.join(OUT, target));
  }
  const css = [
    face('Baloo 2', 'baloo-2-latin-500.woff2', 500, LATIN),
    face('Baloo 2', 'baloo-2-latin-700.woff2', 700, LATIN),
    face('Baloo 2', 'baloo-2-latin-800.woff2', 800, LATIN),
    face('ZCOOL KuaiLe', 'zcool-kuaile-latin-400.woff2', 400, LATIN),
    face('ZCOOL KuaiLe', 'zcool-kuaile-chinese-simplified-400.woff2', 400, CJK),
    face('Fredoka', 'fredoka-latin-400.woff2', 400, LATIN),
    face('Fredoka', 'fredoka-latin-500.woff2', 500, LATIN),
    face('Fredoka', 'fredoka-latin-600.woff2', 600, LATIN),
    face('Fredoka', 'fredoka-latin-700.woff2', 700, LATIN)
  ].join('\n');
  await fs.writeFile(path.join(OUT, 'fonts.css'), css);
}

vendorFonts().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
