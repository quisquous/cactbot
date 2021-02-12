'use strict';

const path = require('path');
const webpack = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
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
  oopsyraidsy: 'ui/oopsyraidsy/oopsyraidsy',
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
      cactbotModules.oopsyraidsy,
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
  return {
    entry: {
      ...(() => {
        const ret = {};
        Object.values(cactbotModules).forEach((_module) => {
          ret[_module] = './' + _module + '.js';
        });
        return ret;
      })(),
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin(),
        new CssMinimizerPlugin({
          parallel: true,
        }),
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
    devtool: argv.mode === 'development' ? 'source-map' : undefined,
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist'),
    },
    devServer: {
      contentBase: './dist',
      inline: false,
      writeToDisk: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '',
              },
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
          ],
        },
        {
          test: /data[\\\/]manifest\.txt$/,
          use: [
            {
              loader: './webpack/loaders/manifest-loader.cjs',
            },
          ],
        },
        {
          test: /data[\\\/](?!manifest\.txt).*\.txt$/,
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
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      ...(() => Object.entries(cactbotHtmlChunksMap).map(([file, config]) => new HtmlWebpackPlugin({
        template: file,
        filename: file,
        ...config,
      })))(),
      new CopyPlugin({
        patterns: [
          // {
          //   from: '@(ui|resources|util)/**/*.css',
          // },
          {
            // copy sounds and images
            from: 'resources/@(ffxiv|sounds)/**/*',
          },
          {
            // copy more html in raidboss module
            from: 'ui/raidboss/raidboss_*.html',
          },
        ],
      }),
    ],
  };
};
