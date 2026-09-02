#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');

const unitSpecs = [
  {
    outputDir: path.join(root, 'poc/lesson5-6-experience/assets'),
    background: 'welcome-hall-background-v1.png',
    backgroundBase: 'scene-welcome-hall-v1',
    atlases: [
      {
        file: 'welcome-characters-atlas-v1.png',
        columns: 4,
        rows: 2,
        cells: [
          ['character-mr-blake-v1', 0, 0],
          ['character-sophie-v1', 1, 0],
          ['character-hans-v1', 2, 0],
          ['character-naoko-v1', 3, 0],
          ['character-changwoo-v1', 0, 1],
          ['character-luming-v1', 1, 1],
          ['character-xiaohui-v1', 2, 1]
        ]
      },
      {
        file: 'welcome-cars-atlas-v1.png',
        columns: 3,
        rows: 2,
        cells: [
          ['vehicle-volvo-v1', 0, 0],
          ['vehicle-peugeot-v1', 1, 0],
          ['vehicle-mercedes-v1', 2, 0],
          ['vehicle-toyota-v1', 0, 1],
          ['vehicle-mini-v1', 1, 1],
          ['vehicle-ford-v1', 2, 1]
        ]
      }
    ]
  },
  {
    outputDir: path.join(root, 'poc/lesson7-8-experience/assets'),
    background: 'career-salon-background-v1.png',
    backgroundBase: 'scene-career-salon-v1',
    singles: [
      ['character-robert-source-v1.png', 'character-robert-v1']
    ],
    atlases: [
      {
        file: 'jobs-atlas-v1.png',
        columns: 5,
        rows: 2,
        cells: [
          ['job-policeman-v1', 0, 0],
          ['job-policewoman-v1', 1, 0],
          ['job-taxi-driver-v1', 2, 0],
          ['job-air-hostess-v1', 3, 0],
          ['job-postman-v1', 4, 0],
          ['job-nurse-v1', 0, 1],
          ['job-mechanic-v1', 1, 1],
          ['job-hairdresser-v1', 2, 1],
          ['job-housewife-v1', 3, 1],
          ['job-milkman-v1', 4, 1]
        ]
      }
    ]
  }
];

function looksLikeExterior(red, green, blue) {
  const high = Math.max(red, green, blue);
  const low = Math.min(red, green, blue);
  return high - low < 28 && (red + green + blue) / 3 > 190;
}

async function removeNeutralBackground(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixelCount = info.width * info.height;
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let read = 0;
  let write = 0;

  function enqueue(x, y) {
    if (x < 0 || y < 0 || x >= info.width || y >= info.height) return;
    const pixel = y * info.width + x;
    if (visited[pixel]) return;
    const offset = pixel * info.channels;
    if (!looksLikeExterior(data[offset], data[offset + 1], data[offset + 2])) return;
    visited[pixel] = 1;
    queue[write] = pixel;
    write += 1;
  }

  for (let x = 0; x < info.width; x += 1) {
    enqueue(x, 0);
    enqueue(x, info.height - 1);
  }
  for (let y = 0; y < info.height; y += 1) {
    enqueue(0, y);
    enqueue(info.width - 1, y);
  }
  while (read < write) {
    const pixel = queue[read];
    read += 1;
    data[pixel * info.channels + 3] = 0;
    const x = pixel % info.width;
    const y = Math.floor(pixel / info.width);
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }
  return sharp(data, { raw: info });
}

async function saveCutout(image, outputDir, baseName) {
  const pngPath = path.join(outputDir, `${baseName}.png`);
  await image
    .clone()
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 36, right: 36, bottom: 36, left: 36,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .resize({
      // Sharp normalizes resize before extend, regardless of fluent-call order.
      // Reserve the 36 px safe margin on all four sides so the final canvas is
      // exactly 900 x 900 instead of silently growing to 972 x 972.
      width: 828,
      height: 828,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);
  await Promise.all([
    sharp(pngPath)
      .resize(640, 640, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(path.join(outputDir, `${baseName}.webp`)),
    sharp(pngPath)
      .resize(640, 640, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .avif({ quality: 58, effort: 7 })
      .toFile(path.join(outputDir, `${baseName}.avif`))
  ]);
}

async function extractAtlas(sourceDir, outputDir, spec) {
  const inputPath = path.join(sourceDir, spec.file);
  const metadata = await sharp(inputPath).metadata();
  const cellWidth = Math.floor(metadata.width / spec.columns);
  const cellHeight = Math.floor(metadata.height / spec.rows);
  for (const [baseName, column, row] of spec.cells) {
    const cell = await sharp(inputPath).extract({
      left: column * cellWidth,
      top: row * cellHeight,
      width: cellWidth,
      height: cellHeight
    }).png().toBuffer();
    await saveCutout(await removeNeutralBackground(cell), outputDir, baseName);
  }
}

async function saveBackground(sourceDir, outputDir, fileName, baseName) {
  const input = path.join(sourceDir, fileName);
  const variants = [
    { suffix: 'wide', width: 1920, height: 1200 },
    { suffix: 'portrait', width: 900, height: 1600 }
  ];
  for (const variant of variants) {
    const base = path.join(outputDir, `${baseName}-${variant.suffix}`);
    const normalized = sharp(input).resize({
      width: variant.width,
      height: variant.height,
      fit: 'cover',
      position: 'centre'
    });
    await Promise.all([
      normalized.clone().png({ compressionLevel: 9 }).toFile(`${base}.png`),
      normalized.clone().webp({ quality: 91 }).toFile(`${base}.webp`),
      normalized.clone().avif({ quality: 60, effort: 7 }).toFile(`${base}.avif`)
    ]);
  }
}

for (const spec of unitSpecs) {
  const sourceDir = path.join(spec.outputDir, 'generated-source');
  await fs.mkdir(spec.outputDir, { recursive: true });
  await saveBackground(sourceDir, spec.outputDir, spec.background, spec.backgroundBase);
  for (const atlas of spec.atlases || []) {
    await extractAtlas(sourceDir, spec.outputDir, atlas);
  }
  for (const [fileName, baseName] of spec.singles || []) {
    await saveCutout(
      await removeNeutralBackground(path.join(sourceDir, fileName)),
      spec.outputDir,
      baseName
    );
  }
}

console.log('Lesson 5-8 generated assets extracted with responsive backgrounds and transparent cutouts.');
