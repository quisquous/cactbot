'use strict';

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { mergeWithRules } = require('webpack-merge');

const generateConfig = require('./webpack.config.cjs');
const constants = require('./constants.cjs');

const baseConfig = generateConfig(constants);

const optimizationOverride = {
  optimization: {
    minimize: true,
    minimizer: [
      // Apply option overrides to Webpack v5's native TerserPlugin
      () => ({
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
};

const cssMinifyConfigOverride = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              // TODO: Migrate to url-loader
              url: false,
            },
          },
        ],
      },
    ],
  },
};

module.exports = mergeWithRules({
  optimization: 'merge',
  module: {
    rules: {
      test: 'match',
      use: 'replace',
    },
  },
  cache: 'replace',
})(baseConfig, {
  mode: 'production',
  cache: {
    type: 'filesystem',
    name: 'cactbot',
  },
  ...optimizationOverride,
  ...cssMinifyConfigOverride,
});
