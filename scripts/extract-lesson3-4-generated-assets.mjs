import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const sourceDir = path.join(root, 'poc/lesson3-4-experience/assets/generated-source');
const outputDir = path.join(root, 'poc/lesson3-4-experience/assets');

const storyAtlas = path.join(sourceDir, 'lesson3-story-props-atlas-v1.png');
const transferAtlas = path.join(sourceDir, 'lesson4-transfer-atlas-v1.png');

const storyCells = [
  ['item-umbrella-star-v1', 0, 0],
  ['item-umbrella-stripe-v1', 1, 0],
  ['item-umbrella-dot-v1', 0, 1],
  ['item-ticket-five-v1', 1, 1]
];

const transferCells = [
  ['item-suit-v1', 0, 0],
  ['scene-school-v1', 1, 0],
  ['character-teacher-card-v1', 2, 0],
  ['character-son-card-v1', 0, 1],
  ['character-daughter-card-v1', 1, 1]
];

function isExteriorBackground(red, green, blue) {
  const high = Math.max(red, green, blue);
  const low = Math.min(red, green, blue);
  return high - low < 18 && (red + green + blue) / 3 > 202;
}

async function removeConnectedBrightBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let read = 0;
  let write = 0;

  function enqueue(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixelIndex = y * width + x;
    if (visited[pixelIndex]) return;
    const offset = pixelIndex * channels;
    if (!isExteriorBackground(data[offset], data[offset + 1], data[offset + 2])) return;
    visited[pixelIndex] = 1;
    queue[write] = pixelIndex;
    write += 1;
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  while (read < write) {
    const pixelIndex = queue[read];
    read += 1;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const offset = pixelIndex * channels;
    data[offset + 3] = 0;
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  // Checkerboard pockets can be enclosed by a silhouette (for example, between
  // a jacket sleeve and torso), so they never connect to the outer flood fill.
  // Remove the same neutral-bright pixels globally after the conservative pass.
  // Warm cream fabric is preserved because it has a wider RGB spread.
  for (let pixelIndex = 0; pixelIndex < width * height; pixelIndex += 1) {
    const offset = pixelIndex * channels;
    if (isExteriorBackground(data[offset], data[offset + 1], data[offset + 2])) {
      data[offset + 3] = 0;
    }
  }

  return sharp(data, { raw: info });
}

async function removeConnectedDarkBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let read = 0;
  let write = 0;

  function isDarkOrTransparent(offset) {
    return data[offset + 3] === 0
      || Math.max(data[offset], data[offset + 1], data[offset + 2]) < 34;
  }

  function enqueue(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixelIndex = y * width + x;
    if (visited[pixelIndex]) return;
    const offset = pixelIndex * channels;
    if (!isDarkOrTransparent(offset)) return;
    visited[pixelIndex] = 1;
    queue[write] = pixelIndex;
    write += 1;
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }
  while (read < write) {
    const pixelIndex = queue[read];
    read += 1;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    data[pixelIndex * channels + 3] = 0;
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  // The generated story atlas contains two large opaque black rectangles around
  // the number tag. They are enclosed by antialiased colour fringes, so an edge
  // flood cannot reach them. Remove only very large dark connected components;
  // small dark details such as the numeral and object shadows remain intact.
  visited.fill(0);
  const largeComponentThreshold = width * height * 0.05;
  function isOpaqueDark(pixelIndex) {
    const offset = pixelIndex * channels;
    return data[offset + 3] > 128
      && Math.max(data[offset], data[offset + 1], data[offset + 2]) < 40;
  }
  for (let start = 0; start < width * height; start += 1) {
    if (visited[start] || !isOpaqueDark(start)) continue;
    read = 0;
    write = 0;
    queue[write] = start;
    write += 1;
    visited[start] = 1;
    while (read < write) {
      const pixelIndex = queue[read];
      read += 1;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      for (const [nextX, nextY] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
        const next = nextY * width + nextX;
        if (visited[next] || !isOpaqueDark(next)) continue;
        visited[next] = 1;
        queue[write] = next;
        write += 1;
      }
    }
    if (write > largeComponentThreshold) {
      for (let index = 0; index < write; index += 1) {
        data[queue[index] * channels + 3] = 0;
      }
    }
  }
  return sharp(data, { raw: info });
}

async function saveDerivatives(image, baseName) {
  const pngPath = path.join(outputDir, `${baseName}.png`);
  await image
    .clone()
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 44,
      right: 44,
      bottom: 44,
      left: 44,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .resize({
      width: 900,
      height: 900,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);

  await Promise.all([
    sharp(pngPath)
      .resize(640, 640, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(path.join(outputDir, `${baseName}.webp`)),
    sharp(pngPath)
      .resize(640, 640, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .avif({ quality: 58, effort: 7 })
      .toFile(path.join(outputDir, `${baseName}.avif`))
  ]);
}

async function extractAtlas(inputPath, cells, columns, rows, backgroundKind) {
  const metadata = await sharp(inputPath).metadata();
  const cellWidth = Math.floor(metadata.width / columns);
  const cellHeight = Math.floor(metadata.height / rows);

  for (const [baseName, column, row] of cells) {
    const cellBuffer = await sharp(inputPath).extract({
      left: column * cellWidth,
      top: row * cellHeight,
      width: cellWidth,
      height: cellHeight
    }).png().toBuffer();
    const image = backgroundKind === 'bright'
      ? await removeConnectedBrightBackground(cellBuffer)
      : backgroundKind === 'dark'
        ? await removeConnectedDarkBackground(cellBuffer)
        : sharp(cellBuffer).ensureAlpha();
    await saveDerivatives(image, baseName);
  }
}

await fs.mkdir(outputDir, { recursive: true });
await extractAtlas(storyAtlas, storyCells, 2, 2, 'dark');
await extractAtlas(transferAtlas, transferCells, 3, 2, 'bright');

console.log(`Lesson 3–4 generated assets written to ${outputDir}`);
