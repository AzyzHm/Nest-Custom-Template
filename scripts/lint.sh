#!/usr/bin/env bash
set -euo pipefail

echo "==> Running ESLint"
npm run lint:check

echo "==> Checking Prettier formatting"
npx prettier --check "src/**/*.ts" "test/**/*.ts"

echo "All lint checks passed."
