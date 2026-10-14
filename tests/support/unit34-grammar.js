'use strict';
// Literal answers from the v3.0 teaching manuscript and the inspected PDF pages.
// These never read the course's answer fields or write learning records.
const GRAMMAR = [
  'This is not my coat.', { fills: ['is not'] }, ['This', 'is', 'not', 'my ticket'],
  { fills: ['am not', 'are not'] },
  { pairs: [['is not', "isn't"], ['It is', "It's"], ['Here is', "Here's"]], leftLabel: '完整形式', rightLabel: '缩写' },
  { fills: ['my', 'your'] }, ['No.', "It isn't", 'my coat.', "It's", 'your coat.'],
  "No, it isn't.", ['This', 'is', 'not', 'my teacher'], { fills: ['am not', 'are not'] }
];
const TRANSFER = [['This', 'is', 'not', 'your school'], { fills: ['am not', 'are not'] }];

async function predecessor(page) {
  const fs = require('node:fs/promises');
  const patterns = [];
  for (const name of ['index.html', 'content.js', 'unit.js']) {
    const pattern = name === 'index.html' ? '**/unit3-4/' : '**/unit3-4/' + name + '*';
    const body = await fs.readFile('tests/fixtures/unit3-4-grammar-before/' + name);
    await page.route(pattern, route => route.fulfill({ body, contentType: name.endsWith('.html') ? 'text/html' : 'text/javascript' }));
    patterns.push(pattern);
  }
  return async () => { for (const pattern of patterns) await page.unroute(pattern); };
}
module.exports = { GRAMMAR, TRANSFER, predecessor };
