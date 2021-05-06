'use strict';

module.exports = {
  recursive: true,
  colors: true,
  reporter: 'progress',
  exclude: [
    // Run via test_raidboss_data.js.
    'test/helper/*',
  ],
  loader: [
    'ts-node/esm',
  ],
  extension: [
    '.js',
    '.cjs',
    '.mjs',
    '.ts',
    '.d.ts',
  ],
};
