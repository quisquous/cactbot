'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { mergeWithRules } = require('webpack-merge');

const generateConfig = require(__dirname + '/webpack.config.cjs');
const constants = require(__dirname + '/constants.cjs');

const baseConfig = generateConfig(constants);

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
  module: {
    rules: {
      test: 'match',
      use: 'replace',
    },
  },
})(baseConfig, {
  mode: 'production',
  ...cssMinifyConfigOverride,
});
