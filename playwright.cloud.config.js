'use strict';
const path = require('node:path');
const base = require('./playwright.review.config');
const executablePath = process.env.CLOUD_CHROMIUM_EXECUTABLE_PATH;
if (executablePath && !path.isAbsolute(executablePath)) throw Error('CLOUD_CHROMIUM_EXECUTABLE_PATH must be absolute.');
module.exports = {
  ...base,
  projects:base.projects.map(project=>project.name === 'chromium' && executablePath
    ? {...project,use:{...project.use,launchOptions:{...project.use?.launchOptions,executablePath}}}
    : project)
};
