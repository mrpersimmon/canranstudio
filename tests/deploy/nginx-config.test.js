'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const config = fs.readFileSync(
  path.resolve(__dirname, '../../deploy/nginx/canranstudio-http.conf'),
  'utf8'
);

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

function assertNoTlsOnRedirect(nodes) {
  for (const node of nodes) {
    assert.notEqual(node.name, 'ssl');
    assert.equal(node.name.startsWith('ssl_'), false);
    if (node.name === 'listen') assert.equal(node.args.includes('443'), false);
    if (node.name === 'add_header') assert.notEqual(node.args[0], 'Strict-Transport-Security');
    if (node.children) assertNoTlsOnRedirect(node.children);
  }
}

function assertHttpContract(text) {
  const root = parseNginx(text);
  assertExactChildren(root, [block('server', [])], 'root');
  const server = one(root, 'server', []);
  const children = server.children;

  assertExactChildren(children, [
    leaf('listen', ['80']),
    leaf('listen', ['[::]:80']),
    leaf('server_name', ['59.110.217.36']),
    leaf('server_tokens', ['off']),
    leaf('return', ['301', 'https://www.canranstudio.cn$request_uri'])
  ], 'server');

  assert.deepEqual(direct(children, 'listen').map(node => node.args), [['80'], ['[::]:80']]);
  one(children, 'server_name', ['59.110.217.36']);
  one(children, 'server_tokens', ['off']);
  one(children, 'return', ['301', 'https://www.canranstudio.cn$request_uri']);
  assert.equal(direct(children, 'add_header').length, 0, 'redirect server must not set headers');
  assert.equal(direct(children, 'root').length, 0, 'redirect server must not declare a root');
  assert.equal(direct(children, 'location').length, 0, 'redirect server must not declare locations');
  assertNoTlsOnRedirect(root);
}

function fakeString(value) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

const FORGED_DIRECTIVES = [
  'listen 80;',
  'listen [::]:80;',
  'server_name 59.110.217.36;',
  'server_tokens off;',
  'return 301 https://www.canranstudio.cn$request_uri;'
];

const ACTIVE_STRING_FORGERY = `server {
${FORGED_DIRECTIVES.map((directive, index) => `  set $fake_${index} "${fakeString(directive)}";`).join('\n')}
}`;

test('Nginx contract defines the complete redirect-to-HTTPS policy', () => {
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
    /exact whitelist/
  );
});

test('Nginx contract does not accept active directive text hidden in set strings', () => {
  assert.throws(() => assertHttpContract(ACTIVE_STRING_FORGERY), /exact whitelist/);
});

test('Nginx contract rejects legal directives that alter redirect semantics', () => {
  const altered = config.replace(
    '    server_tokens off;\n',
    '    server_tokens off;\n    add_header X-Debug forged;\n'
  );

  assert.throws(() => assertHttpContract(altered), /exact whitelist/);
});
