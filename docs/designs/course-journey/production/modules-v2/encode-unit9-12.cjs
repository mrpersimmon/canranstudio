const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../../../../..');
const receiptPath = path.join(__dirname, 'unit9-12-receipts.json');
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
async function describe(file) {
  const data = await fs.readFile(file);
  const { data: raw, info } = await sharp(data).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let min = 255, max = 0, left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const a = raw[(y * info.width + x) * 4 + 3]; min = Math.min(min, a); max = Math.max(max, a);
    if (a > 16) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
  }
  return { bytes: data.length, sha256: sha(data), width: info.width, height: info.height, alphaRange: [min, max], alphaGreaterThan16Bounds: [left, top, right + 1, bottom + 1] };
}
(async () => {
  const receipt = JSON.parse(await fs.readFile(receiptPath, 'utf8'));
  const target = path.join(root, 'assets/course-journey/modules-v2');
  await fs.mkdir(target, { recursive: true });
  for (const record of receipt.records) {
    const png = path.join(target, record.id + '-ground.png');
    const webp = path.join(target, record.id + '-ground.webp');
    await fs.copyFile(record.returnedPath, png);
    await sharp(png).webp({ quality: 88 }).toFile(webp);
    record.output = { png: { path: path.relative(root, png).replaceAll('\\', '/'), ...await describe(png) }, webp: { path: path.relative(root, webp).replaceAll('\\', '/'), ...await describe(webp) } };
    record.references = await Promise.all(record.request.referenced_image_paths.map(async file => ({ path: file, sha256: sha(await fs.readFile(file)) })));
    record.visualReview = 'Both side walls now have open cream-paved bridge passages. Original central architecture, cream courtyard perspective, coral masonry, flowers and upper-left lighting remain recognisable. Central standing region is open. The generated sides deliberately reach canvas edges; bridge extension is horizontally oriented, not a claim of automatic continuity between separately laid-out modules. Alpha and scene integration require normal UI composition checks.';
  }
  await fs.writeFile(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify(receipt.records.map(({id, output})=>({id, output})), null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
