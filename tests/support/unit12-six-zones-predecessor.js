'use strict';
const fs = require('node:fs/promises');
async function install(page) {
  const routes = [];
  const files = ['index.html', 'content.js', 'unit.js', 'grammar.js', 'grammar.css', 'completion.js', 'completion.css', 'lesson49-practice.js'];
  for (const name of files) {
    const pattern = name === 'index.html' ? '**/unit1-2/' : `**/${name === 'lesson49-practice.js' ? 'core' : 'unit1-2'}/${name}*`;
    const body = await fs.readFile('tests/fixtures/unit1-2-six-zones-before/' + name);
    await page.route(pattern, route => route.fulfill({ body, contentType: name.endsWith('.html') ? 'text/html' : name.endsWith('.css') ? 'text/css' : 'text/javascript' }));
    routes.push(pattern);
  }
  return async () => { for (const pattern of routes) await page.unroute(pattern); };
}
// Independent old manuscript. Historical pages, never storage injection, create records.
function answers() {
  const old = structuredClone(require('./thirteen-types-flow').ANSWERS['1-2']);
  old.listen = old.listen.slice(0, 4); old.roles = old.roles.slice(0, 4);
  old.trans[8] = '手表'; old.ask = ['watch', '衬衫'];
  return old;
}
module.exports = { install, answers };
