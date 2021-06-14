'use strict';

const { merge } = require('webpack-merge');

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

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'inline-source-map',
});
