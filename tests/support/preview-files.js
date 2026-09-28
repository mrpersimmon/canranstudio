'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8', '.mp3': 'audio/mpeg',
  '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml'
};
function publicPath(relative) {
  if (relative.split('/').some(part => !part || part.startsWith('.')) || /[\\\0%]/.test(relative)) return false;
  if (!TYPES[path.extname(relative).toLowerCase()]) return false;
  return relative === 'index.html' || relative === 'tests/fixtures/root-media-worker.js'
    || /^(?:assets|core|home|unit\d+-\d+|lesson\d+|soundmark|poc)\//.test(relative);
}
async function readPreviewFile(root, relative) {
  const forbidden = () => Object.assign(Error('Forbidden preview file'), { status: 403 });
  if (!publicPath(relative)) throw forbidden();
  const realRoot = await fs.realpath(root), file = await fs.realpath(path.resolve(root, relative));
  if (!publicPath(path.relative(realRoot, file).split(path.sep).join('/'))) throw forbidden();
  return fs.readFile(file);
}
module.exports = { TYPES, publicPath, readPreviewFile };
