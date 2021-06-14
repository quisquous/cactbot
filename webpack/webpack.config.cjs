'use strict';

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const cactbotModules = {
  config: 'ui/config/config',
  coverage: 'util/coverage/coverage',
  rdmty: 'ui/dps/rdmty/dps',
  xephero: 'ui/dps/xephero/xephero',
  eureka: 'ui/eureka/eureka',
  fisher: 'ui/fisher/fisher',
  jobs: 'ui/jobs/jobs',
  oopsyraidsyLive: 'ui/oopsyraidsy/oopsy_live',
  oopsyraidsySummary: 'ui/oopsyraidsy/oopsy_summary',
  pullcounter: 'ui/pullcounter/pullcounter',
  radar: 'ui/radar/radar',
  raidboss: 'ui/raidboss/raidboss',
  raidemulator: 'ui/raidboss/raidemulator',
  test: 'ui/test/test',
};

const cactbotChunks = {
  raidbossData: 'ui/common/raidboss_data',
  oopsyraidsyData: 'ui/common/oopsyraidsy_data',
};

const cactbotHtmlChunksMap = {
  'ui/config/config.html': {
    chunks: [
      cactbotChunks.raidbossData,
      cactbotChunks.oopsyraidsyData,
      cactbotModules.config,
    ],
  },
  'util/coverage/coverage.html': {
    chunks: [
      cactbotChunks.raidbossData,
      cactbotChunks.oopsyraidsyData,
      cactbotModules.coverage,
    ],
  },
  'ui/dps/rdmty/dps.html': {
    chunks: [
      cactbotModules.rdmty,
    ],
  },
  'ui/dps/xephero/xephero-cactbot.html': {
    chunks: [
      cactbotModules.xephero,
    ],
  },
  'ui/eureka/eureka.html': {
    chunks: [
      cactbotModules.eureka,
    ],
  },
  'ui/fisher/fisher.html': {
    chunks: [
      cactbotModules.fisher,
    ],
  },
  'ui/jobs/jobs.html': {
    chunks: [
      cactbotModules.jobs,
    ],
  },
  'ui/oopsyraidsy/oopsy_summary.html': {
    chunks: [
      cactbotChunks.oopsyraidsyData,
      cactbotModules.oopsyraidsySummary,
    ],
  },
  'ui/oopsyraidsy/oopsyraidsy.html': {
    chunks: [
      cactbotChunks.oopsyraidsyData,
      cactbotModules.oopsyraidsyLive,
    ],
  },
  'ui/pullcounter/pullcounter.html': {
    chunks: [
      cactbotModules.pullcounter,
    ],
  },
  'ui/radar/radar.html': {
    chunks: [
      cactbotModules.radar,
    ],
  },
  'ui/raidboss/raidboss.html': {
    chunks: [
      cactbotChunks.raidbossData,
      cactbotModules.raidboss,
    ],
  },
  'ui/raidboss/raidemulator.html': {
    chunks: [
      cactbotChunks.raidbossData,
      cactbotModules.raidemulator,
    ],
  },
  'ui/test/test.html': {
    chunks: [
      cactbotModules.test,
    ],
  },
};

module.exports = function(env, argv) {
  const dev = argv.mode === 'development';

  // Add timerbar_test.html
  if (dev) {
    cactbotModules['timerbarTest'] = 'ui/test/timerbar_test';
    cactbotHtmlChunksMap['ui/test/timerbar_test.html'] = {
      chunks: [
        cactbotModules.timerbarTest,
      ],
    };
  }

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
      minimize: true,
      minimizer: [
        // Apply option overrides to Webpack v5's native TerserPlugin
        () => ({
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
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
    devtool: dev ? 'source-map' : undefined,
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
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            compilerOptions: dev ? { declaration: true, declarationMap: true } : {},
          },
        },
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
