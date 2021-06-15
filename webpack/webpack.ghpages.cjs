'use strict';

const { merge } = require('webpack-merge');

const ProdConfig = require('./webpack.prod.cjs');

module.exports = merge(ProdConfig, {
  devtool: 'inline-source-map',
});
