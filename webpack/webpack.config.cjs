'use strict';

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = function({ cactbotModules, cactbotChunks, cactbotHtmlChunksMap }) {
  const entries = {};
  Object.entries(cactbotModules).forEach(([key, module]) => {
    // TDOO: Remove when everything is TypeScript, convert to:
    // entries[module] = `./${module}.ts`;
    let extension = 'js';
    if ([
      'oopsyraidsyLive',
      'oopsyraidsySummary',
      'radar',
      'raidboss',
      'test',
      'timerbarTest',
    ].includes(key))
      extension = 'ts';
    entries[module] = `./${module}.${extension}`;
  });

  const htmlPluginRules = Object.entries(cactbotHtmlChunksMap).map(([file, config]) => {
    return new HtmlWebpackPlugin({
      template: file,
      filename: file,
      ...config,
    });
  });

  return {
    entry: entries,
    optimization: {
      splitChunks: {
        cacheGroups: {
          'raidboss_data': {
            test: /[\\/]ui[\\/]raidboss[\\/]data[\\/]/,
            name: cactbotChunks.raidbossData,
            chunks: 'all',
          },
          'oopsyraidsy_data': {
            test: /[\\/]ui[\\/]oopsyraidsy[\\/]data[\\/]/,
            name: cactbotChunks.oopsyraidsyData,
            chunks: 'all',
          },
        },
      },
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '../dist'),
    },
    devServer: {
      contentBase: path.join(__dirname, '../dist'),
      writeToDisk: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          // Worker has to go before normal js
          test: /NetworkLogConverterWorker\.(?:c|m)?js$/,
          loader: 'worker-loader',
          options: {
            esModule: true,
            inline: 'fallback',
            worker: {
              type: 'Worker',
              options: {
                type: 'classic',
                name: 'NetworkLogConverterWorker',
              },
            },
          },
          resolve: {
            fullySpecified: false,
          },
        },
        {
          // this will allow importing without extension in js files.
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: { chrome: '75' },
                  },
                ],
              ],
            },
          },
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
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
        {
          test: /data[\\\/]\w*_manifest\.txt$/,
          use: [
            {
              loader: './webpack/loaders/manifest-loader.cjs',
            },
          ],
        },
        {
          test: /data[\\\/](?!\w*_manifest\.txt).*\.txt$/,
          use: [
            {
              loader: 'raw-loader',
            },
            {
              loader: './webpack/loaders/timeline-loader.cjs',
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin({}),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      ...htmlPluginRules,
      new CopyPlugin({
        patterns: [
          {
            // copy sounds and images
            from: 'resources/@(ffxiv|sounds)/**/*',
          },
          {
            // copy more html in raidboss module
            from: 'ui/raidboss/raidboss_*.html',
          },
          {
            // copy images under radar and eureka
            // TODO: directly `import` images into js code
            from: 'ui/@(radar|eureka)/*.png',
          },
          {
            // copy all the skins folder under modules,
            // only raidboss for now though.
            from: 'ui/*/skins/**/*',
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
    stats: {
      children: true,
      errorDetails: true,
    },
  };
};
