'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const config = fs.readFileSync(
  path.resolve(__dirname, '../../deploy/nginx/canranstudio-http.conf'),
  'utf8'
);

const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";

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

function sameArgs(left, right) {
  return left.length === right.length && left.every((argument, index) => argument === right[index]);
}

function one(nodes, name, args) {
  const matches = direct(nodes, name).filter(node => sameArgs(node.args, args));
  assert.equal(matches.length, 1, `expected exactly one ${name} ${args.join(' ')}`);
  return matches[0];
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
  const server = one(root, 'server', []);
  assert.equal(root.length, 1, 'only one server block is allowed');
  const children = server.children;

  assert.deepEqual(direct(children, 'listen').map(node => node.args), [['80'], ['[::]:80']]);
  for (const [name, args] of [
    ['server_name', ['59.110.217.36']],
    ['root', ['/var/www/canranstudio/current']],
    ['index', ['index.html']],
    ['charset', ['utf-8']],
    ['server_tokens', ['off']]
  ]) {
    assert.equal(direct(children, name).length, 1, `expected one ${name} directive`);
    one(children, name, args);
  }
  assert.deepEqual(direct(children, 'add_header').map(node => node.args), [
    ['Content-Security-Policy', CSP, 'always'],
    ['X-Content-Type-Options', 'nosniff', 'always'],
    ['X-Frame-Options', 'DENY', 'always'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin', 'always'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()', 'always'],
    ['Cache-Control', 'no-cache', 'always']
  ]);

  const guard = one(children, 'if', ['(', '$request_method', '!~', '^', '(', 'GET|HEAD', ')', '$', ')']);
  assert.equal(direct(children, 'if').length, 1, 'only the method guard is allowed');
  one(guard.children, 'return', ['405']);
  assert.equal(guard.children.length, 1, 'method guard must only return 405');

  for (const [source, destination] of [
    ['/home', '/'],
    ['/home/', '/'],
    ['/home/index.html', '/'],
    ['/lesson49', '/lesson49/'],
    ['/lesson50', '/lesson50/'],
    ['/soundmark', '/soundmark/']
  ]) {
    const location = one(children, 'location', ['=', source]);
    one(location.children, 'return', ['308', destination]);
    assert.equal(location.children.length, 1, `redirect ${source} must only return 308`);
  }
  assert.equal(direct(children, 'location').length, 8, 'expected six redirects and two content locations');

  const staticLocation = one(children, 'location', ['/']);
  assert.equal(direct(staticLocation.children, 'try_files').length, 1, 'expected one static fallback');
  assert.equal(direct(staticLocation.children, 'limit_except').length, 1, 'expected one method depth guard');
  one(staticLocation.children, 'try_files', ['$uri', '$uri/', '=404']);
  const limitExcept = one(staticLocation.children, 'limit_except', ['GET', 'HEAD']);
  one(limitExcept.children, 'deny', ['all']);
  assert.equal(limitExcept.children.length, 1, 'limit_except must only deny');

  const dotfiles = one(children, 'location', ['~', '/\\.']);
  one(dotfiles.children, 'deny', ['all']);
  assert.equal(dotfiles.children.length, 1, 'dotfile rule must only deny');
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
  `add_header Content-Security-Policy "${CSP}" always;`,
  'add_header X-Content-Type-Options "nosniff" always;',
  'add_header X-Frame-Options "DENY" always;',
  'add_header Referrer-Policy "strict-origin-when-cross-origin" always;',
  'add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;',
  'add_header Cache-Control "no-cache" always;',
  'if ($request_method !~ ^(GET|HEAD)$) { return 405; }',
  'location = /home { return 308 /; }',
  'location = /home/ { return 308 /; }',
  'location = /home/index.html { return 308 /; }',
  'location = /lesson49 { return 308 /lesson49/; }',
  'location = /lesson50 { return 308 /lesson50/; }',
  'location = /soundmark { return 308 /soundmark/; }',
  'location / { try_files $uri $uri/ =404; limit_except GET HEAD { deny all; } }',
  'location ~ /\\. { deny all; }'
];

const ACTIVE_STRING_FORGERY = `server {
${FORGED_DIRECTIVES.map((directive, index) => `  set $fake_${index} "${fakeString(directive)}";`).join('\n')}
}`;

test('Nginx contract defines the complete structural HTTP policy', () => {
  assertHttpContract(config);
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
    /Expected values to be strictly deep-equal/
  );
});

test('Nginx contract does not accept active directive text hidden in set strings', () => {
  assert.throws(() => assertHttpContract(ACTIVE_STRING_FORGERY), /Expected values to be strictly deep-equal/);
});
