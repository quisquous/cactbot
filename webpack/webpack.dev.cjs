'use strict';

const { mergeWithRules } = require('webpack-merge');

const generateConfig = require('./webpack.config.cjs');
const constants = require('./constants.cjs');

// Add timerbar_test.html
constants.cactbotModules['timerbarTest'] = 'ui/test/timerbar_test';
constants.cactbotHtmlChunksMap['ui/test/timerbar_test.html'] = {
  chunks: [
    constants.cactbotModules.timerbarTest,
  ],
};

const baseConfig = generateConfig(constants);

const tsConfigOverride = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declaration: true,
            declarationMap: true,
          },
        },
      },
    ],
  },
};

module.exports = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      options: 'replace',
    },
  },
})(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  ...tsConfigOverride,
});
