'use strict';
const { isIP } = require('node:net');

function normalizedIP(value) {
  if (typeof value !== 'string' || value.includes('%')) return null;
  const family = isIP(value);
  if (family === 4) return value;
  if (family !== 6) return null;
  const normalized = new URL('http://[' + value + ']/').hostname.slice(1, -1);
  const mapped = normalized.match(/^::ffff:([a-f0-9]+):([a-f0-9]+)$/);
  if (!mapped) return normalized;
  const high = parseInt(mapped[1], 16), low = parseInt(mapped[2], 16);
  return [high >>> 8, high & 255, low >>> 8, low & 255].join('.');
}

function clientAddress(request, trustProxy) {
  const peer = normalizedIP(request.socket.remoteAddress);
  // Direct previews and untrusted peers cannot choose their own limit bucket.
  if (trustProxy !== 'loopback' || !['127.0.0.1', '::1'].includes(peer)) return peer;
  const supplied = request.rawHeaders.filter((_, i) => i % 2 === 0 && request.rawHeaders[i].toLowerCase() === 'x-forwarded-for');
  const forwarded = request.headers['x-forwarded-for'];
  const address = typeof forwarded === 'string' && normalizedIP(forwarded.trim());
  // The trusted proxy must OVERWRITE this header with one address, not append.
  if (supplied.length !== 1 || !address) throw Object.assign(new Error('请求来源不正确'), { status: 400 });
  return address;
}
module.exports = { clientAddress };
