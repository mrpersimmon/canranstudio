'use strict';

const path = require('node:path');
const sharp = require('sharp');
const {
  GOLDEN_ROUTE_PAGE,
  LANDMARK_REVIEW_ROUTE_PAGES
} = require('../core/adventure-atlas');

const ROOT = path.resolve(__dirname, '..');

async function assertSource(asset, expected) {
  const source = path.join(ROOT, asset.png);
  const metadata = await sharp(source).metadata();
  const actual = {
    width: metadata.width,
    height: metadata.height,
    hasAlpha: metadata.hasAlpha
  };
  if (actual.width !== expected.width || actual.height !== expected.height ||
    Boolean(actual.hasAlpha) !== Boolean(expected.hasAlpha)) {
    throw new Error(`${asset.png}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
  return source;
}

async function writeVariants(source, asset, { heightForWidth, fit = 'inside' }) {
  for (const variant of asset.variants) {
    const height = heightForWidth(variant.width);
    const resized = sharp(source).resize(variant.width, height, {
      fit,
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true
    });
    await Promise.all([
      resized.clone().avif({
        quality: 74,
        effort: 8,
        chromaSubsampling: '4:4:4'
      }).toFile(path.join(ROOT, variant.avif)),
      resized.clone().webp({
        quality: 86,
        smartSubsample: true,
        effort: 6,
        alphaQuality: 100
      }).toFile(path.join(ROOT, variant.webp))
    ]);
    process.stdout.write(`${variant.avif}: ${variant.width}x${height}\n`);
  }
}

async function main() {
  const mascot = GOLDEN_ROUTE_PAGE.mascotAsset;
  const marker = GOLDEN_ROUTE_PAGE.markerAsset;
  const loaderFrames = GOLDEN_ROUTE_PAGE.loaderFrames;
  const backgroundSources = await Promise.all(LANDMARK_REVIEW_ROUTE_PAGES.map(async routePage => ({
    routePage,
    source: await assertSource(routePage.backgroundAsset, {
      width: routePage.canvas.width,
      height: routePage.canvas.height,
      hasAlpha: false
    })
  })));
  const mascotSource = await assertSource(mascot, {
    width: 1254,
    height: 1254,
    hasAlpha: true
  });
  const markerSource = await assertSource(marker, {
    width: 1448,
    height: 1086,
    hasAlpha: true
  });
  const loaderSources = await Promise.all(loaderFrames.map(frame => assertSource(frame, {
    width: 1254,
    height: 1254,
    hasAlpha: true
  })));

  for (const { routePage, source } of backgroundSources) {
    await writeVariants(source, routePage.backgroundAsset, {
      fit: 'fill',
      heightForWidth: width => Math.round(width * routePage.canvas.height /
        routePage.canvas.width)
    });
  }
  await writeVariants(mascotSource, mascot, {
    fit: 'inside',
    heightForWidth: width => width
  });
  await writeVariants(markerSource, marker, {
    fit: 'inside',
    heightForWidth: width => Math.round(width * 1086 / 1448)
  });
  for (let index = 0; index < loaderFrames.length; index += 1) {
    await writeVariants(loaderSources[index], loaderFrames[index], {
      fit: 'inside',
      heightForWidth: width => width
    });
  }
}

main().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
