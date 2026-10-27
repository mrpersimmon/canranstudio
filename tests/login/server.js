'use strict';
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { openStore } = require('../../server/store');
const { createApp } = require('../../server/app');
(async () => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-login-test-'));
  const store = openStore(dataDir); store.setAdmin('teacher', 'Test-only-classroom-2026!'); store.close();
  const port = Number(process.env.LOGIN_TEST_PORT || 4181);
  const server = await createApp({ dataDir, origin: 'http://127.0.0.1:' + port, basePath: process.env.AWARD_TEST_BASE || '/lesson/',viewportMetrics:{enabled:process.env.VIEWPORT_TEST_ENABLED==='1',allowLocal:true,buildVersion:'isolated-test-build'} });
  require('../support/course-response-faults').installCourseResponseFaults(server);
  server.listen(port, '127.0.0.1');
  for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(async () => { await fs.rm(dataDir, {recursive:true,force:true}); process.exit(0); }));
})();
