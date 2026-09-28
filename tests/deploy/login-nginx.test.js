'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const https = require('node:https');
const net = require('node:net');
const { spawn, execFileSync } = require('node:child_process');

// Requires a local Nginx binary; no production certificates, privileged ports,
// configuration directories or services are touched.
test('login Nginx rejects unknown HTTP hosts/TLS SNI and preserves canonical proxy/redirects', { skip: !process.env.NGINX_BIN, timeout: 30000 }, async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-nginx-test-'));
  let nginx, backend;
  t.after(async () => {
    if (nginx && nginx.exitCode === null) { nginx.kill('SIGTERM'); await new Promise(resolve => nginx.once('exit', resolve)); }
    if (backend?.listening) await new Promise(resolve => backend.close(resolve));
    await fs.rm(dir, { recursive: true, force: true });
  });
  async function freePort() {
    const server = net.createServer(); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port; await new Promise(resolve => server.close(resolve)); return port;
  }
  const plainPort = await freePort(), tlsPort = await freePort();
  backend = http.createServer((req, res) => res.end(JSON.stringify({ host: req.headers.host, forwarded: req.headers['x-forwarded-for'] })));
  await new Promise(resolve => backend.listen(0, '127.0.0.1', resolve));
  const openssl = process.env.OPENSSL_BIN || 'openssl';
  execFileSync(openssl, ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1', '-subj', '/CN=www.canranstudio.cn', '-keyout', path.join(dir, 'key.pem'), '-out', path.join(dir, 'cert.pem')], { stdio: 'pipe' });
  // Public RFC 7919 parameters also work with the server's OpenSSL 1.1.1,
  // whose genpkey CLI does not support the newer group:ffdhe2048 option.
  await fs.copyFile(path.join(__dirname, '../fixtures/nginx-ffdhe2048.pem'), path.join(dir, 'dh.pem'));
  await fs.writeFile(path.join(dir, 'ssl.conf'), 'ssl_protocols TLSv1.2 TLSv1.3;\n');
  const root = path.resolve(__dirname, '../..');
  let site = await fs.readFile(path.join(root, 'deploy/login/site.conf'), 'utf8');
  site = site.replace(/listen 80/g, 'listen 127.0.0.1:' + plainPort).replace(/listen \[::\]:80/g, 'listen [::1]:' + plainPort)
    .replace(/listen 443/g, 'listen 127.0.0.1:' + tlsPort).replace(/listen \[::\]:443/g, 'listen [::1]:' + tlsPort)
    .replaceAll('/etc/letsencrypt/live/canranstudio.cn/fullchain.pem', path.join(dir, 'cert.pem'))
    .replaceAll('/etc/letsencrypt/live/canranstudio.cn/privkey.pem', path.join(dir, 'key.pem'))
    .replaceAll('/etc/letsencrypt/options-ssl-nginx.conf', path.join(dir, 'ssl.conf'))
    .replaceAll('/etc/letsencrypt/ssl-dhparams.pem', path.join(dir, 'dh.pem'))
    .replaceAll('/etc/nginx/snippets/canranstudio-login-location.conf', path.join(dir, 'location.conf'));
  let location = await fs.readFile(path.join(root, 'deploy/login/nginx.conf'), 'utf8');
  location = location.replace('127.0.0.1:4182', '127.0.0.1:' + backend.address().port)
    .replaceAll('/var/www/canranstudio-exercise/current/', dir + '/exercise/');
  await fs.writeFile(path.join(dir, 'location.conf'), location);
  await fs.writeFile(path.join(dir, 'nginx.conf'), `pid ${dir}/nginx.pid;\nerror_log ${dir}/error.log;\nevents {}\nhttp { access_log off; client_body_temp_path ${dir}/body; proxy_temp_path ${dir}/proxy; ${site} }\n`);
  const args = ['-p', dir + '/', '-c', path.join(dir, 'nginx.conf')];
  execFileSync(process.env.NGINX_BIN, [...args, '-t'], { stdio: 'pipe' });
  nginx = spawn(process.env.NGINX_BIN, [...args, '-g', 'daemon off;'], { stdio: 'ignore' });
  const request = (secure, host, servername = 'www.canranstudio.cn', extra = {}) => new Promise((resolve, reject) => {
    const req = (secure ? https : http).request({ hostname: '127.0.0.1', port: secure ? tlsPort : plainPort, path: '/health', servername, rejectUnauthorized: false, headers: { Host: host, ...extra } }, res => {
      let body = ''; res.on('data', bytes => body += bytes); res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }); req.setTimeout(3000, () => req.destroy(Error('Local request timeout'))); req.on('error', reject); req.end();
  });
  let ready;
  for (let i = 0; i < 50; i++) {
    try { ready = await request(false, 'www.canranstudio.cn'); break; }
    catch { if (nginx.exitCode !== null) throw Error(await fs.readFile(path.join(dir, 'error.log'), 'utf8')); await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  assert.equal(ready?.status, 301); assert.equal(ready.headers.location, 'https://www.canranstudio.cn/health');
  assert.equal(ready.headers.server, 'nginx');
  const canonical = await request(true, 'www.canranstudio.cn', 'www.canranstudio.cn', { 'X-Forwarded-For': '198.51.100.1' });
  assert.equal(canonical.status, 200); assert.equal(canonical.headers.server, 'nginx');
  assert.deepEqual(JSON.parse(canonical.body), { host: 'www.canranstudio.cn', forwarded: '127.0.0.1' });
  const apex = await request(true, 'canranstudio.cn', 'canranstudio.cn');
  assert.equal(apex.status, 308); assert.equal(apex.headers.location, 'https://www.canranstudio.cn/health');
  for (const host of ['unrelated.invalid', '59.110.217.36', '59.110.217.36.nip.io', 'www.canranstudio.cn.unrelated.invalid']) {
    await assert.rejects(request(false, host));
    await assert.rejects(request(true, host)); // Valid SNI, hostile HTTP Host.
    await assert.rejects(request(true, 'www.canranstudio.cn', host)); // Unknown SNI, valid Host.
  }
});
