'use strict';

function normalizeBasePath(value = '/') {
  if (value !== '/' && !/^\/(?:[a-z0-9][a-z0-9-]*\/)+$/.test(value)) {
    throw new Error('base path must be / or a slash-terminated local directory');
  }
  return value;
}

function scopeStorage(source, namespace) {
  return source.replace(/canran:/g, 'canran:' + namespace + ':')
    .replace(/(["'`])((?:l\d+|phonics-magic)-stars-v\d+)(?=["'`])/g, '$1' + namespace + ':$2');
}

function relocateSource(source, relative, basePath = '/') {
  normalizeBasePath(basePath);
  // Scoped infrastructure derives URLs and storage names from its explicit base.
  if (/^core\/course-(?:cache|loader|worker)\.js$/.test(relative)) return source;
  if (basePath === '/' || !/\.(?:html|js|css|json|svg)$/.test(relative)) return source;
  const prefix = basePath.slice(0, -1);
  let result = source
    .replace(/(["'`])\/(?=(?:assets|core|unit\d+-\d+|lesson\d+|soundmark|home|poc)\/|\$\{|[?#])/g, '$1' + basePath)
    .replace(/(\b(?:href|src)\s*=\s*["'])\/(?=["'])/g, '$1' + basePath)
    .replace(/(\blocation\.(?:assign|replace)\(\s*["'])\/(?=["'])/g, '$1' + basePath)
    .replace(/(url\(\s*)\/(?=[a-z])/g, '$1' + basePath);
  if (/\.(?:html|js)$/.test(relative)) {
    // Sharing an origin must not make restarting this version erase another app.
    result = scopeStorage(result, prefix.slice(1).replaceAll('/', ':'));
  }
  if (/\.html$/.test(relative)) {
    result = result.replace(/<head>/i, '<head>\n<script src="' + basePath + 'core/subpath-entry.js"></script>');
  }
  return result;
}

function subpathRuntime(basePath = '/') {
  normalizeBasePath(basePath);
  if (basePath === '/') return {};
  // A previously installed root-scoped worker verifies only its own media.
  // A more-specific, network-only worker keeps this app independent of that cache.
  return {
    'core/subpath-entry.js': `(function () {
  'use strict';
  const api = navigator.serviceWorker;
  const ownUrl = new URL(${JSON.stringify(basePath + 'core/subpath-worker.js')}, location.origin).href;
  if (!api?.controller || api.controller.scriptURL === ownUrl) return;
  const shield = document.createElement('style');
  shield.textContent = 'body{visibility:hidden!important}'; document.head.append(shield);
  const reload = () => { if (api.controller?.scriptURL === ownUrl) location.reload(); };
  api.addEventListener('controllerchange', reload);
  api.register(ownUrl, { scope: ${JSON.stringify(basePath)}, updateViaCache: 'none' }).then(reload).catch(() => {
    api.removeEventListener('controllerchange', reload); shield.remove();
    const showError = () => {
      const note = document.createElement('p'); note.setAttribute('role', 'alert');
      note.textContent = '课程暂时没有准备好，请刷新后再试。'; document.body.prepend(note);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showError, { once: true });
    else showError();
  });
})();\n`,
    'core/subpath-worker.js': `'use strict';\nself.addEventListener('install', event => event.waitUntil(self.skipWaiting()));\nself.addEventListener('activate', event => event.waitUntil(self.clients.claim()));\n// No fetch handler: requests use the network, without the root app's cache.\n`
  };
}

module.exports = { normalizeBasePath, relocateSource, subpathRuntime, scopeStorage };
