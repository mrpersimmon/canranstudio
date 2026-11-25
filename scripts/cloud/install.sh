#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

node -e 'if (Number(process.versions.node.split(".")[0]) < 24) { console.error("canranstudio requires Node.js 24 or newer. Select Node.js 24 in the cloud environment, then rerun setup."); process.exit(1); }'
export npm_config_cache="${npm_config_cache:-$PWD/output/cloud-cache/npm}"
npm ci --no-audit --no-fund
case "${CLOUD_BROWSER_PROFILE:-full}" in
  full) npx playwright install --with-deps chromium webkit ;;
  webkit) npx playwright install --with-deps webkit ;;
  system-chromium) node scripts/cloud/verify-browser.js ;;
  *) printf '%s\n' 'Unknown CLOUD_BROWSER_PROFILE. Use full, webkit, or system-chromium.' >&2; exit 1 ;;
esac
printf '%s\n' 'Dependencies ready. Start the isolated review bench with bash scripts/cloud/start.sh.'
