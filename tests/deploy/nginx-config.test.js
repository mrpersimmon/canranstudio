'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const verifier = require('../../scripts/verify-live');

const config = fs.readFileSync(
  path.resolve(__dirname, '../../deploy/nginx/canranstudio-http.conf'),
  'utf8'
);

const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
const REVIEW_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
const COURSE_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; media-src 'self'; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";

function tokenizeNginx(text) {
  const tokens = [];
  let index = 0;

  while (index < text.length) {
    const character = text[index];
    if (/\s/.test(character)) {
      index += 1;
      continue;
    }
    if (character === '#') {
      while (index < text.length && text[index] !== '\n') index += 1;
      continue;
    }
    if ('{};()'.includes(character)) {
      tokens.push(character);
      index += 1;
      continue;
    }
    if (character === '"' || character === "'") {
      const quote = character;
      let value = '';
      index += 1;
      while (index < text.length && text[index] !== quote) {
        if (text[index] === '\\' && index + 1 < text.length) index += 1;
        value += text[index];
        index += 1;
      }
      assert.notEqual(index, text.length, 'unterminated quoted Nginx argument');
      tokens.push({ value, quoted: true });
      index += 1;
      continue;
    }

    let value = '';
    while (index < text.length && !/\s/.test(text[index]) && !'{};()#'.includes(text[index])) {
      if (text[index] === '\\' && index + 1 < text.length) {
        value += text[index];
        index += 1;
      }
      value += text[index];
      index += 1;
    }
    tokens.push({ value, quoted: false });
  }

  return tokens;
}

function parseNginx(text) {
  const tokens = tokenizeNginx(text);
  let index = 0;

  function parseScope(endToken = null) {
    const nodes = [];
    while (index < tokens.length && tokens[index] !== endToken) {
      const name = tokens[index];
      assert.equal(typeof name, 'object', 'Nginx directive name must be a word');
      index += 1;
      const args = [];
      while (index < tokens.length && tokens[index] !== ';' && tokens[index] !== '{') {
        const token = tokens[index];
        if (typeof token === 'string') {
          assert.ok(token === '(' || token === ')', 'unexpected Nginx delimiter in directive arguments');
          args.push(token);
        } else {
          args.push(token.value);
        }
        index += 1;
      }
      assert.ok(index < tokens.length, `unterminated Nginx directive: ${name.value}`);
      if (tokens[index] === ';') {
        nodes.push({ name: name.value, args, children: null });
        index += 1;
      } else {
        index += 1;
        const children = parseScope('}');
        assert.equal(tokens[index], '}', `unterminated Nginx block: ${name.value}`);
        index += 1;
        nodes.push({ name: name.value, args, children });
      }
    }
    return nodes;
  }

  const nodes = parseScope();
  assert.equal(index, tokens.length, 'unexpected Nginx closing brace');
  return nodes;
}

function direct(nodes, name) {
  return nodes.filter(node => node.name === name);
}

function effectiveHeaderValues(node, headerName, inherited = new Map()) {
  if (!node.children) return [];
  const localHeaders = direct(node.children, 'add_header');
  const effective = localHeaders.length
    ? new Map(localHeaders.map(header => [header.args[0].toLowerCase(), header.args[1]]))
    : inherited;
  const values = [effective.get(headerName.toLowerCase())];
  for (const child of node.children) {
    if (child.children) values.push(...effectiveHeaderValues(child, headerName, effective));
  }
  return values;
}

function sameArgs(left, right) {
  return left.length === right.length && left.every((argument, index) => argument === right[index]);
}

function one(nodes, name, args) {
  const matches = direct(nodes, name).filter(node => sameArgs(node.args, args));
  assert.equal(matches.length, 1, `expected exactly one ${name} ${args.join(' ')}`);
  return matches[0];
}

function leaf(name, args) {
  return { name, args, children: null };
}

function block(name, args) {
  return { name, args, children: [] };
}

function nodeSignature(node) {
  return JSON.stringify([node.children === null ? 'leaf' : 'block', node.name, node.args]);
}

function assertExactChildren(nodes, expected, label) {
  assert.deepEqual(
    nodes.map(nodeSignature).sort(),
    expected.map(nodeSignature).sort(),
    `${label} direct children must match the exact whitelist`
  );
}

function assertNoTransportUpgrade(nodes) {
  for (const node of nodes) {
    assert.notEqual(node.name, 'ssl');
    assert.equal(node.name.startsWith('ssl_'), false);
    if (node.name === 'listen') assert.equal(node.args.includes('443'), false);
    if (node.name === 'add_header') assert.notEqual(node.args[0], 'Strict-Transport-Security');
    if (node.name === 'return' || node.name === 'rewrite') {
      assert.equal(node.args.some(argument => argument.startsWith('https://')), false);
    }
    assert.equal(node.args.some(argument => argument.toLowerCase().includes('upgrade-insecure-requests')), false);
    if (node.children) assertNoTransportUpgrade(node.children);
  }
}

function assertHttpContract(text) {
  const root = parseNginx(text);
  assertExactChildren(root, [block('server', [])], 'root');
  const server = one(root, 'server', []);
  const children = server.children;

  const redirects = [
    ['/home', '/'],
    ['/home/', '/'],
    ['/home/index.html', '/'],
    ['/lesson49', '/lesson49/'],
    ['/lesson50', '/lesson50/'],
    ['/lesson51', '/lesson51/'],
    ['/lesson52', '/lesson52/'],
    ['/lesson53', '/lesson53/'],
    ['/lesson54', '/lesson54/'],
    ['/soundmark', '/soundmark/'],
    ['/poc/landmark-review', '/poc/landmark-review/'],
    ['/poc/keepsake-review', '/poc/keepsake-review/']
  ];
  assertExactChildren(children, [
    leaf('listen', ['80']),
    leaf('listen', ['[::]:80']),
    leaf('server_name', ['59.110.217.36']),
    leaf('root', ['/var/www/canranstudio/current']),
    leaf('index', ['index.html']),
    leaf('charset', ['utf-8']),
    leaf('server_tokens', ['off']),
    leaf('absolute_redirect', ['off']),
    leaf('open_file_cache', ['off']),
    leaf('add_header', ['Content-Security-Policy', CSP, 'always']),
    leaf('add_header', ['X-Content-Type-Options', 'nosniff', 'always']),
    leaf('add_header', ['X-Frame-Options', 'DENY', 'always']),
    leaf('add_header', ['Referrer-Policy', 'strict-origin-when-cross-origin', 'always']),
    leaf('add_header', ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()', 'always']),
    block('if', ['(', '$request_method', '!~', '^', '(', 'GET|HEAD', ')', '$', ')']),
    ...redirects.map(([source]) => block('location', ['=', source])),
    block('location', ['^~', '/poc/landmark-review/']),
    block('location', ['^~', '/poc/keepsake-review/']),
    block('location', ['~', '^/poc/lesson(1-2|3-4|5-6|7-8)-experience/']),
    block('location', ['=', '/core/course-package-service-worker.js']),
    block('location', ['~*', '^/assets/adventure-map/atlas/.*-atlas-[a-z0-9-]+-[0-9]+[.](avif|webp)$']),
    block('location', ['~*', '^/assets/adventure-map/.*/states/.*[.][a-z0-9]+$']),
    block('location', ['~*', '[.](avif|webp|png|jpe?g|svg)$']),
    block('location', ['/']),
    block('location', ['~', '/\\.'])
  ], 'server');

  assert.deepEqual(direct(children, 'listen').map(node => node.args), [['80'], ['[::]:80']]);
  for (const [name, args] of [
    ['server_name', ['59.110.217.36']],
    ['root', ['/var/www/canranstudio/current']],
    ['index', ['index.html']],
    ['charset', ['utf-8']],
    ['server_tokens', ['off']],
    ['absolute_redirect', ['off']],
    ['open_file_cache', ['off']]
  ]) {
    assert.equal(direct(children, name).length, 1, `expected one ${name} directive`);
    one(children, name, args);
  }
  assert.deepEqual(direct(children, 'add_header').map(node => node.args), [
    ['Content-Security-Policy', CSP, 'always'],
    ['X-Content-Type-Options', 'nosniff', 'always'],
    ['X-Frame-Options', 'DENY', 'always'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin', 'always'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()', 'always']
  ]);

  const guard = one(children, 'if', ['(', '$request_method', '!~', '^', '(', 'GET|HEAD', ')', '$', ')']);
  assertExactChildren(guard.children, [leaf('return', ['405'])], 'method guard');
  one(guard.children, 'return', ['405']);

  for (const [source, destination] of redirects) {
    const location = one(children, 'location', ['=', source]);
    assertExactChildren(location.children, [leaf('return', ['308', destination])], `redirect ${source}`);
    one(location.children, 'return', ['308', destination]);
  }

  const landmarkReview = one(children, 'location', ['^~', '/poc/landmark-review/']);
  assertExactChildren(landmarkReview.children, [
    leaf('try_files', ['$uri', '$uri/', '=404']),
    leaf('expires', ['epoch']),
    leaf('add_header', ['Content-Security-Policy', REVIEW_CSP, 'always']),
    leaf('add_header', ['X-Content-Type-Options', 'nosniff', 'always']),
    leaf('add_header', ['X-Frame-Options', 'DENY', 'always']),
    leaf('add_header', ['Referrer-Policy', 'strict-origin-when-cross-origin', 'always']),
    leaf('add_header', ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()', 'always']),
    leaf('add_header', ['X-Robots-Tag', 'noindex, nofollow, noarchive', 'always']),
    block('limit_except', ['GET', 'HEAD'])
  ], 'landmark review');
  const landmarkReviewLimit = one(landmarkReview.children, 'limit_except', ['GET', 'HEAD']);
  assertExactChildren(landmarkReviewLimit.children, [leaf('deny', ['all'])], 'landmark review limit_except');

  const keepsakeReview = one(children, 'location', ['^~', '/poc/keepsake-review/']);
  assertExactChildren(keepsakeReview.children, [
    leaf('try_files', ['$uri', '$uri/', '=404']),
    leaf('expires', ['epoch']),
    leaf('add_header', ['Content-Security-Policy', CSP, 'always']),
    leaf('add_header', ['X-Content-Type-Options', 'nosniff', 'always']),
    leaf('add_header', ['X-Frame-Options', 'DENY', 'always']),
    leaf('add_header', ['Referrer-Policy', 'strict-origin-when-cross-origin', 'always']),
    leaf('add_header', ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()', 'always']),
    leaf('add_header', ['X-Robots-Tag', 'noindex, nofollow, noarchive', 'always']),
    block('limit_except', ['GET', 'HEAD'])
  ], 'keepsake review');
  const keepsakeReviewLimit = one(keepsakeReview.children, 'limit_except', ['GET', 'HEAD']);
  assertExactChildren(keepsakeReviewLimit.children, [leaf('deny', ['all'])], 'keepsake review limit_except');

  const coursePackages = one(children, 'location', [
    '~',
    '^/poc/lesson(1-2|3-4|5-6|7-8)-experience/'
  ]);
  assertExactChildren(coursePackages.children, [
    leaf('try_files', ['$uri', '$uri/', '=404']),
    leaf('expires', ['epoch']),
    leaf('add_header', ['Content-Security-Policy', COURSE_CSP, 'always']),
    leaf('add_header', ['X-Content-Type-Options', 'nosniff', 'always']),
    leaf('add_header', ['X-Frame-Options', 'DENY', 'always']),
    leaf('add_header', ['Referrer-Policy', 'strict-origin-when-cross-origin', 'always']),
    leaf('add_header', ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()', 'always']),
    leaf('add_header', ['X-Robots-Tag', 'noindex, nofollow, noarchive', 'always']),
    block('limit_except', ['GET', 'HEAD'])
  ], 'course-package experiences');
  const coursePackageLimit = one(coursePackages.children, 'limit_except', ['GET', 'HEAD']);
  assertExactChildren(coursePackageLimit.children, [leaf('deny', ['all'])], 'course-package limit_except');

  const coursePackageWorker = one(children, 'location', [
    '=',
    '/core/course-package-service-worker.js'
  ]);
  assertExactChildren(coursePackageWorker.children, [
    leaf('try_files', ['$uri', '=404']),
    leaf('expires', ['epoch']),
    leaf('add_header', ['Content-Security-Policy', CSP, 'always']),
    leaf('add_header', ['X-Content-Type-Options', 'nosniff', 'always']),
    leaf('add_header', ['X-Frame-Options', 'DENY', 'always']),
    leaf('add_header', ['Referrer-Policy', 'strict-origin-when-cross-origin', 'always']),
    leaf('add_header', ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()', 'always']),
    leaf('add_header', ['Service-Worker-Allowed', '/', 'always']),
    block('limit_except', ['GET', 'HEAD'])
  ], 'course-package service worker');
  const coursePackageWorkerLimit = one(coursePackageWorker.children, 'limit_except', ['GET', 'HEAD']);
  assertExactChildren(coursePackageWorkerLimit.children, [leaf('deny', ['all'])], 'course-package worker limit_except');

  const atlasBackgrounds = one(children, 'location', [
    '~*',
    '^/assets/adventure-map/atlas/.*-atlas-[a-z0-9-]+-[0-9]+[.](avif|webp)$'
  ]);
  assertExactChildren(atlasBackgrounds.children, [
    leaf('try_files', ['$uri', '=404']),
    leaf('add_header', ['Content-Security-Policy', CSP, 'always']),
    leaf('add_header', ['X-Content-Type-Options', 'nosniff', 'always']),
    leaf('add_header', ['X-Frame-Options', 'DENY', 'always']),
    leaf('add_header', ['Referrer-Policy', 'strict-origin-when-cross-origin', 'always']),
    leaf('add_header', ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()', 'always']),
    leaf('add_header', ['Cache-Control', 'public, max-age=31536000, immutable', 'always']),
    block('limit_except', ['GET', 'HEAD'])
  ], 'versioned atlas backgrounds');
  const atlasBackgroundLimit = one(atlasBackgrounds.children, 'limit_except', ['GET', 'HEAD']);
  assertExactChildren(atlasBackgroundLimit.children, [leaf('deny', ['all'])], 'atlas background limit_except');

  const stateImages = one(children, 'location', ['~*', '^/assets/adventure-map/.*/states/.*[.][a-z0-9]+$']);
  assertExactChildren(stateImages.children, [
    leaf('try_files', ['$uri', '=404']),
    leaf('add_header', ['Content-Security-Policy', CSP, 'always']),
    leaf('add_header', ['X-Content-Type-Options', 'nosniff', 'always']),
    leaf('add_header', ['X-Frame-Options', 'DENY', 'always']),
    leaf('add_header', ['Referrer-Policy', 'strict-origin-when-cross-origin', 'always']),
    leaf('add_header', ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()', 'always']),
    leaf('add_header', ['Cache-Control', 'public, max-age=31536000, immutable', 'always']),
    block('limit_except', ['GET', 'HEAD'])
  ], 'versioned state images');
  const stateLimit = one(stateImages.children, 'limit_except', ['GET', 'HEAD']);
  assertExactChildren(stateLimit.children, [leaf('deny', ['all'])], 'state image limit_except');

  const images = one(children, 'location', ['~*', '[.](avif|webp|png|jpe?g|svg)$']);
  assertExactChildren(images.children, [
    leaf('try_files', ['$uri', '=404']),
    leaf('expires', ['7d']),
    block('limit_except', ['GET', 'HEAD'])
  ], 'other public images');
  const imageLimit = one(images.children, 'limit_except', ['GET', 'HEAD']);
  assertExactChildren(imageLimit.children, [leaf('deny', ['all'])], 'image limit_except');

  const staticLocation = one(children, 'location', ['/']);
  assertExactChildren(staticLocation.children, [
    leaf('try_files', ['$uri', '$uri/', '=404']),
    leaf('expires', ['epoch']),
    block('limit_except', ['GET', 'HEAD'])
  ], 'static location');
  one(staticLocation.children, 'try_files', ['$uri', '$uri/', '=404']);
  const limitExcept = one(staticLocation.children, 'limit_except', ['GET', 'HEAD']);
  assertExactChildren(limitExcept.children, [leaf('deny', ['all'])], 'limit_except');
  one(limitExcept.children, 'deny', ['all']);

  const dotfiles = one(children, 'location', ['~', '/\\.']);
  assertExactChildren(dotfiles.children, [leaf('deny', ['all'])], 'dotfile location');
  one(dotfiles.children, 'deny', ['all']);
  assertNoTransportUpgrade(root);
}

function fakeString(value) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

const FORGED_DIRECTIVES = [
  'listen 80;',
  'listen [::]:80;',
  'server_name 59.110.217.36;',
  'root /var/www/canranstudio/current;',
  'index index.html;',
  'charset utf-8;',
  'server_tokens off;',
  'absolute_redirect off;',
  `add_header Content-Security-Policy "${CSP}" always;`,
  'add_header X-Content-Type-Options "nosniff" always;',
  'add_header X-Frame-Options "DENY" always;',
  'add_header Referrer-Policy "strict-origin-when-cross-origin" always;',
  'add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;',
  'if ($request_method !~ ^(GET|HEAD)$) { return 405; }',
  'location = /home { return 308 /; }',
  'location = /home/ { return 308 /; }',
  'location = /home/index.html { return 308 /; }',
  'location = /lesson49 { return 308 /lesson49/; }',
  'location = /lesson50 { return 308 /lesson50/; }',
  'location = /lesson51 { return 308 /lesson51/; }',
  'location = /lesson52 { return 308 /lesson52/; }',
  'location = /lesson53 { return 308 /lesson53/; }',
  'location = /lesson54 { return 308 /lesson54/; }',
  'location = /soundmark { return 308 /soundmark/; }',
  'location ~* "^/assets/adventure-map/.*/states/.*[.][a-z0-9]+$" { try_files $uri =404; }',
  'location ~* "[.](avif|webp|png|jpe?g|svg)$" { try_files $uri =404; expires 7d; }',
  'location / { try_files $uri $uri/ =404; expires epoch; limit_except GET HEAD { deny all; } }',
  'location ~ /\\. { deny all; }'
];

const ACTIVE_STRING_FORGERY = `server {
${FORGED_DIRECTIVES.map((directive, index) => `  set $fake_${index} "${fakeString(directive)}";`).join('\n')}
}`;

test('Nginx contract defines the complete structural HTTP policy', () => {
  assertHttpContract(config);
  assert.doesNotMatch(config, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.match(config, /font-src 'self' data:/);
});

test('effective Nginx CSPs preserve the public contract with one review-only fetch exception', () => {
  const root = parseNginx(config);
  const server = one(root, 'server', []);
  const values = [...new Set(effectiveHeaderValues(server, 'Content-Security-Policy'))];

  assert.equal(
    REVIEW_CSP,
    verifier.LANDMARK_REVIEW_HEADER_CONTRACT['content-security-policy']
  );
  assert.deepEqual(values.sort(), [
    verifier.HTTP_HEADER_CONTRACT['content-security-policy'],
    REVIEW_CSP,
    COURSE_CSP
  ].sort());
});

test('Nginx tokenizer keeps comment markers and delimiters inside quoted arguments', () => {
  const parsed = parseNginx('server { set $value "# ; { } \\"quoted\\""; # comment\n }');
  assert.deepEqual(parsed[0].children[0], {
    name: 'set',
    args: ['$value', '# ; { } "quoted"'],
    children: null
  });
});

test('Nginx contract does not accept directives forged only in comments', () => {
  assert.throws(
    () => assertHttpContract('server { # listen 80;\n # if ($request_method !~ ^(GET|HEAD)$) { return 405; }\n }'),
    /exact whitelist/
  );
});

test('Nginx contract does not accept active directive text hidden in set strings', () => {
  assert.throws(() => assertHttpContract(ACTIVE_STRING_FORGERY), /exact whitelist/);
});

test('Nginx contract rejects legal directives that alter error or header semantics', () => {
  const altered = config
    .replace(
      '    server_tokens off;\n',
      '    server_tokens off;\n    error_page 404 405 =200 /index.html;\n'
    )
    .replace(
      '        try_files $uri $uri/ =404;\n',
      '        try_files $uri $uri/ =404;\n        add_header X-Debug forged;\n'
    );

  assert.throws(() => assertHttpContract(altered), /exact whitelist/);
});
