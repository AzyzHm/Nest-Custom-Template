const base = require('./jest.base.config');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'e2e',
  testMatch: ['<rootDir>/test/e2e/**/*.e2e-spec.ts'],
};
