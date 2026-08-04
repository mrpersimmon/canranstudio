'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const {
  MAP_COURSES,
  MAP_STATE_VERSION,
  assessLearningLocation
} = require('../core/course-catalog');

const ROOT = path.resolve(__dirname, '..');
const DERIVATIVE_SIZES = [512, 768, 1024];

function selectedCourseIds(argv) {
  const index = argv.indexOf('--course');
  if (index >= 0 && argv[index + 1]) return new Set([argv[index + 1]]);
  if (argv.includes('--all')) return null;
  throw new Error('Usage: node scripts/build-landmark-states.js --course <course-id> | --all');
}

function publicPath(...parts) {
  return parts.join('/');
}

async function assertMaster(pathname) {
  const metadata = await sharp(pathname).metadata();
  if (metadata.width !== 1024 || metadata.height !== 1024 || metadata.hasAlpha !== true) {
    throw new Error(`${pathname}: expected a 1024x1024 image with alpha`);
  }
}

async function writeDerivatives(masterPath, outputDir, stateNumber) {
  const variants = [];
  for (const size of DERIVATIVE_SIZES) {
    const stem = `state-${stateNumber}-${size}`;
    const webpPath = path.join(outputDir, `${stem}.webp`);
    const avifPath = path.join(outputDir, `${stem}.avif`);
    const resized = sharp(masterPath).resize(size, size, {
      fit: 'fill',
      kernel: sharp.kernel.lanczos3
    });
    await Promise.all([
      resized.clone().webp({
        quality: 88,
        alphaQuality: 100,
        smartSubsample: true,
        effort: 6
      }).toFile(webpPath),
      resized.clone().avif({
        quality: 72,
        effort: 7,
        chromaSubsampling: '4:4:4'
      }).toFile(avifPath)
    ]);
    variants.push({
      width: size,
      webp: publicPath(path.relative(ROOT, webpPath)),
      avif: publicPath(path.relative(ROOT, avifPath))
    });
  }
  return {
    png: publicPath(path.relative(ROOT, masterPath)),
    variants
  };
}

async function buildContactSheet(courseId, masters) {
  const tile = 480;
  const gap = 32;
  const columns = 3;
  const rows = Math.ceil(masters.length / columns);
  const width = columns * tile + (columns + 1) * gap;
  const height = rows * tile + (rows + 1) * gap;
  const composites = [];
  for (let index = 0; index < masters.length; index += 1) {
    const input = await sharp(masters[index]).resize(tile, tile, { fit: 'contain' }).png().toBuffer();
    composites.push({
      input,
      left: gap + (index % columns) * (tile + gap),
      top: gap + Math.floor(index / columns) * (tile + gap)
    });
  }
  const target = path.join(
    ROOT,
    'docs/designs/adventure-map',
    `${courseId}-state-snapshots-contact-sheet.png`
  );
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 234, g: 213, b: 161, alpha: 1 }
    }
  }).composite(composites).png({ compressionLevel: 9 }).toFile(target);
  if (courseId === 'lesson51') {
    // Keep the historical review path in sync so it can never surface the
    // rejected loose-layer composition again.
    await fs.copyFile(
      target,
      path.join(ROOT, 'docs/designs/adventure-map/lesson51-growth-contact-sheet.png')
    );
  }
  return publicPath(path.relative(ROOT, target));
}

async function buildCourse(course) {
  const publication = assessLearningLocation(course);
  if (publication.status !== 'published') {
    throw new Error(`${course.id}: only published map courses can build states`);
  }
  const outputDir = path.join(ROOT, 'assets/adventure-map', course.id, 'states');
  await fs.mkdir(outputDir, { recursive: true });
  const states = [];
  const masters = [];
  for (let stateNumber = 0; stateNumber <= course.map.stages.length; stateNumber += 1) {
    const masterPath = path.join(outputDir, `state-${stateNumber}.png`);
    await assertMaster(masterPath);
    masters.push(masterPath);
    states.push({
      stageCount: stateNumber,
      ...(await writeDerivatives(masterPath, outputDir, stateNumber))
    });
  }

  const contactSheet = await buildContactSheet(course.id, masters);
  const manifest = {
    version: 1,
    contentVersion: MAP_STATE_VERSION,
    courseId: course.id,
    sourceMode: 'full-state-snapshots',
    invariant: 'one locked 1024x1024 RGBA mother composition edited progressively; no independently generated states; no runtime layer composition',
    sizes: DERIVATIVE_SIZES,
    states,
    contactSheet
  };
  await fs.writeFile(
    path.join(outputDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );
  return manifest;
}

async function main() {
  const selected = selectedCourseIds(process.argv.slice(2));
  const courses = MAP_COURSES.filter(course => (
    (!selected || selected.has(course.id)) && assessLearningLocation(course).status === 'published'
  ));
  if (selected && courses.length !== selected.size) {
    const found = new Set(courses.map(course => course.id));
    const missing = [...selected].filter(id => !found.has(id));
    throw new Error(`Unknown or unpublished map course: ${missing.join(', ')}`);
  }
  for (const course of courses) {
    const manifest = await buildCourse(course);
    process.stdout.write(`${course.id}: ${manifest.states.length} cumulative states\n`);
  }
}

main().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
