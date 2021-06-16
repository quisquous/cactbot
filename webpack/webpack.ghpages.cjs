'use strict';

const { merge } = require('webpack-merge');

const prodConfig = require('./webpack.prod.cjs');

module.exports = merge(prodConfig, {
  devtool: 'inline-source-map',
});
