#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

node -e 'if (Number(process.versions.node.split(".")[0]) < 24) { console.error("canranstudio requires Node.js 24 or newer. Select Node.js 24 in the cloud environment, then rerun setup."); process.exit(1); }'
npm ci --no-audit --no-fund
npx playwright install --with-deps chromium webkit
printf '%s\n' 'Dependencies ready. Start the isolated review bench with bash scripts/cloud/start.sh.'
