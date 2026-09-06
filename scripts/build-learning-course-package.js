'use strict';
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const catalog = require('../core/learning-course-catalog');
const packages = require('./build-course-package-manifests');
const ROOT = path.resolve(__dirname, '..');
const config = Object.freeze({
  unitId:'NCE-STARTER-06',pageDirectory:'poc/learning-path',scopePath:'/poc/learning-path/',
  entryFilename:'index.html',fontsFilename:'course-fonts.css',systemChineseFont:true,
  unitCatalogFilename:'course-package/unit-catalog.json',manifestFilename:'course-package-manifest.json',
  manifestUrl:'/poc/learning-path/course-package-manifest.json',unitCatalogUrl:'/poc/learning-path/course-package/unit-catalog.json',
  bootstrapResources:['/core/course-package-installer.js','/core/course-package-service-worker.js'],
  dynamicIcons:[],
  styles:['/poc/learning-path/course-fonts.css','/poc/lesson-1-2/course/path.css','/poc/learning-path/course.css'],
  scripts:['/core/learning-store.js','/core/learning-path-runtime.js','/core/learning-path-scene.js','/poc/lesson-1-2/course/path.js']
});
async function build() {
  const unit = catalog.getCourse(), errors = catalog.validateCourse(unit);
  if (errors.length) throw Error(errors.join('\n'));
  // The service worker intentionally ignores query strings for media caching.
  // Address the bootstrap by content so an older active package cannot serve
  // its old startup code before the new manifest has finished installing.
  const entryBytes = fs.readFileSync(path.join(ROOT,'core/course-package-entry.js'));
  const entryUrl = '/poc/learning-path/boot/course-entry-'+packages.sha256(entryBytes).slice(0,12)+'.js';
  fs.mkdirSync(path.dirname(path.join(ROOT,entryUrl)),{recursive:true});
  fs.writeFileSync(path.join(ROOT,entryUrl),entryBytes);
  const htmlPath = path.join(ROOT,config.pageDirectory,config.entryFilename);
  const html = fs.readFileSync(htmlPath,'utf8');
  const updated = html.replace(/(<script src=")(?:\/core\/course-package-entry\.js[^\"]*|\/poc\/learning-path\/boot\/course-entry-[a-f0-9]+\.js)("><\/script>)/, '$1'+entryUrl+'$2');
  if (!updated.includes('src="'+entryUrl+'"')) throw Error('Missing course bootstrap script');
  fs.writeFileSync(htmlPath,updated);
  const assets = path.join(ROOT,config.pageDirectory,'assets');
  fs.mkdirSync(path.join(assets,'icons'),{recursive:true});
  for (const [name,src] of Object.entries(unit.icons)) if (src.startsWith('/poc/learning-path/')) {
    fs.copyFileSync(path.join(ROOT,'node_modules/bootstrap-icons/icons',name+'.svg'),path.join(ROOT,src));
  }
  fs.copyFileSync(path.join(ROOT,'node_modules/bootstrap-icons/LICENSE'),path.join(assets,'icons/LICENSE'));
  const files = new Set(Object.values(unit.entities).map(e=>e.assetSrc).filter(src=>src.startsWith('/poc/learning-path/assets/') && src.endsWith('.webp')));
  for (const src of files) {
    const input = path.join(ROOT,src.replace(/\.webp$/,'.png'));
    if (!fs.existsSync(input)) throw Error('Missing character source '+input);
    await sharp(input).resize({width:640,withoutEnlargement:true}).webp({quality:92,alphaQuality:100,effort:5}).toFile(path.join(ROOT,src));
  }
  return packages.buildUnit({...config,bootstrapResources:[...config.bootstrapResources,entryUrl]},{getTeachingUnit:()=>unit,validate:([value])=>catalog.validateCourse(value)},packages.materializeSharedFonts());
}
if (require.main===module) build().then(result=>process.stdout.write(JSON.stringify(result,null,2)+'\n')).catch(error=>{process.stderr.write(error.stack+'\n');process.exitCode=1;});
module.exports=Object.freeze({config,build});
