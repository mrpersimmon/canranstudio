'use strict';
const fs = require('node:fs/promises');
// Real prior screens create their own storage through normal child actions.
async function install(page, version) {
  const folder = version === 1 ? 'unit1-2-grammar-before' : `unit1-2-grammar-v${version}-before`;
  const patterns = [];
  for (const name of ['content.js', 'unit.js', 'grammar.js', 'grammar.css']) {
    const source = name === 'content.js' ? folder : name === 'grammar.js' && version === 2 ? folder : 'unit1-2-grammar-v3-before';
    const pattern = `**/unit1-2/${name}*`; patterns.push(pattern);
    const body = await fs.readFile(`tests/fixtures/${source}/${name}`);
    await page.route(pattern, route => route.fulfill({ body, contentType: name.endsWith('.css') ? 'text/css' : 'text/javascript' }));
  }
  return async () => { for (const pattern of patterns) await page.unroute(pattern); };
}
const base = {
  listen: [{pairs:[['coat','外套'],['dress','连衣裙'],['skirt','半身裙']]},'pen','house','pencil'],
  roles: [['这是','你的','手提包','吗？'],'女士请他重复。','very much','这是不是女士的手提包。'],
  manners: [{fills:['me']},'Yes?','Yes, it is.','女士',['Thank','you','very much']],
  ask: ['watch','衬衫'],
  trans: ['Is this your book?',['Is','this','your car'],{fills:['it is']},"No, it isn't."],
  exam: [{fills:['Yes?','Yes, it is.']},"No, it isn't.",{fills:['你的','手提包']},'Pardon?','Excuse me!','铅笔',['Is','this','your coat'],'房子']
};
function answers(version) {
  const data = JSON.parse(JSON.stringify(base));
  if (version < 3) { data.trans = data.trans.slice(0, 2); data.exam[1] = 'Yes, it is. Thank you very much.'; }
  if (version === 1) {
    data.roles[3] = '对面的女士'; data.trans = [{fills:['book']},['Is','this','your','car']];
    data.exam[2] = 'your 指女士的；it 指手提包'; data.exam[6] = ['Is','this','your','coat?'];
  }
  return data;
}
module.exports = { install, answers };
