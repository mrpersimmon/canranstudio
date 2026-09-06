'use strict';
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const catalog = require('../core/curriculum-catalog');
const packages = require('./build-course-package-manifests');
const ROOT = path.resolve(__dirname, '..');
const config = Object.freeze({
  unitId: 'NCE-U01', pageDirectory: 'poc/lesson1-2-experience', scopePath: '/poc/lesson-1-2/',
  entryFilename: 'path.html', fontsFilename: 'path-fonts.css', systemChineseFont: true,
  unitCatalogFilename: 'course-package/path-unit-catalog.json', manifestFilename: 'path-package-manifest.json',
  manifestUrl: '/poc/lesson-1-2/course/path-package-manifest.json',
  unitCatalogUrl: '/poc/lesson-1-2/course/course-package/path-unit-catalog.json',
  bootstrapResources: ['/core/course-package-entry.js', '/core/course-package-installer.js', '/core/course-package-service-worker.js'],
  dynamicIcons: [],
  styles: ['/poc/lesson-1-2/course/path-fonts.css', '/poc/lesson-1-2/course/path.css'],
  scripts: ['/poc/lesson-1-2/core/learning-store.js', '/poc/lesson-1-2/core/learning-path-runtime.js', '/poc/lesson-1-2/core/learning-path-scene.js', '/poc/lesson-1-2/course/path.js']
});
async function build() {
  const unit = catalog.getPathExperience();
  const errors = catalog.validatePathExperience(unit);
  if (errors.length) throw new Error(errors.join('\n'));
  const assets = path.join(ROOT, config.pageDirectory, 'assets/v3');
  const iconDirectory = path.join(assets, 'icons'); fs.mkdirSync(iconDirectory, { recursive: true });
  for (const icon of Object.keys(unit.icons)) fs.copyFileSync(path.join(ROOT, 'node_modules/bootstrap-icons/icons', `${icon}.svg`), path.join(iconDirectory, `${icon}.svg`));
  fs.copyFileSync(path.join(ROOT, 'node_modules/bootstrap-icons/LICENSE'), path.join(iconDirectory, 'LICENSE'));
  for (const entity of Object.values(unit.entities)) {
    const name = path.basename(entity.assetSrc, '.webp');
    const input = path.join(assets, `${name}.png`);
    if (!fs.existsSync(input)) throw new Error(`Missing original artwork: ${name}.png`);
    const meta = await sharp(input).metadata();
    if (!meta.hasAlpha && entity.deliveryBackground !== 'white') throw new Error(`Artwork requires real alpha: ${name}.png`);
    // Raster content remains unchanged. This is the responsive WebP delivery
    // conversion; source images and their prompts are retained for inspection.
    await sharp(input).resize({ width: entity.characterSpecies ? 640 : 420, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100, effort: 5 }).toFile(path.join(assets, `${name}.webp`));
  }
  return packages.buildUnit(config, { getTeachingUnit: () => unit, validate: ([value]) => catalog.validatePathExperience(value) }, packages.materializeSharedFonts());
}
if (require.main === module) build().then(result => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)).catch(error => { process.stderr.write(`${error.stack}\n`); process.exitCode = 1; });
module.exports = Object.freeze({ config, build });
