'use strict';

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { mergeWithRules } = require('webpack-merge');

const generateConfig = require(__dirname + '/webpack.config.cjs');
const constants = require(__dirname + '/constants.cjs');

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
})(baseConfig, {
  mode: 'production',
  ...optimizationOverride,
  ...cssMinifyConfigOverride,
});
