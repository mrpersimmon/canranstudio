'use strict';

const DEFAULT_PLAYWRIGHT_PORT = 4173;
const configuredPort = process.env.PLAYWRIGHT_PORT;
const PLAYWRIGHT_PORT = configuredPort
  ? Number.parseInt(configuredPort, 10)
  : DEFAULT_PLAYWRIGHT_PORT;

if (
  !Number.isInteger(PLAYWRIGHT_PORT) ||
  PLAYWRIGHT_PORT < 1 ||
  PLAYWRIGHT_PORT > 65535 ||
  (configuredPort && String(PLAYWRIGHT_PORT) !== configuredPort)
) {
  throw new Error(`Invalid PLAYWRIGHT_PORT: ${configuredPort}`);
}

const TEST_ORIGIN = `http://127.0.0.1:${PLAYWRIGHT_PORT}`;

module.exports = { PLAYWRIGHT_PORT, TEST_ORIGIN };
