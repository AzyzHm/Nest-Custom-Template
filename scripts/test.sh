#!/usr/bin/env bash
set -euo pipefail

echo "==> Running unit tests"
npm run test:unit:cov

echo "==> Running integration tests"
npm run test:integration

echo "==> Running e2e tests"
npm run test:e2e

echo "All test suites passed."
