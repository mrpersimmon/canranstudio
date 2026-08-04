'use strict';

const path = require('node:path');
const sharp = require('sharp');
const { MAP_STATE_VERSION } = require('../core/course-catalog');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(
  ROOT,
  'assets/adventure-map/atlas/warm-lantern-parchment.jpg'
);
const OUTPUT_DIR = path.dirname(SOURCE);
const SOURCE_SIZE = Object.freeze({ width: 914, height: 1721 });
const WIDTHS = Object.freeze([512, 914]);

async function assertSource() {
  const metadata = await sharp(SOURCE).metadata();
  if (metadata.width !== SOURCE_SIZE.width || metadata.height !== SOURCE_SIZE.height) {
    throw new Error(
      `${SOURCE}: expected ${SOURCE_SIZE.width}x${SOURCE_SIZE.height}, ` +
      `received ${metadata.width}x${metadata.height}`
    );
  }
}

async function buildWidth(width) {
  const height = Math.round(width * SOURCE_SIZE.height / SOURCE_SIZE.width);
  const stem = `warm-lantern-parchment-${MAP_STATE_VERSION}-${width}`;
  const resized = sharp(SOURCE).resize(width, height, {
    fit: 'fill',
    kernel: sharp.kernel.lanczos3
  });
  await Promise.all([
    resized.clone().avif({
      quality: 72,
      effort: 8,
      chromaSubsampling: '4:4:4'
    }).toFile(path.join(OUTPUT_DIR, `${stem}.avif`)),
    resized.clone().webp({
      quality: 84,
      smartSubsample: true,
      effort: 6
    }).toFile(path.join(OUTPUT_DIR, `${stem}.webp`))
  ]);
  process.stdout.write(`${stem}: ${width}x${height}\n`);
}

async function main() {
  await assertSource();
  for (const width of WIDTHS) await buildWidth(width);
}

main().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
