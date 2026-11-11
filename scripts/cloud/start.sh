#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

# This preview uses synthetic data and never opens the account database.
export REVIEW_PORT="${REVIEW_PORT:-4401}"
exec node scripts/review-bench.js
