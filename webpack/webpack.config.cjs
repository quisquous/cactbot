'use strict';

const path = require('path');

module.exports = {
  entry: {
    config: './ui/config/config.js',
    coverage: './util/coverage/coverage.js',
    rdmty: './ui/dps/rdmty/dps.js',
    xephero: './ui/dps/xephero/xephero.js',
    eureka: './ui/eureka/eureka.js',
    fisher: './ui/fisher/fisher.js',
    jobs: './ui/jobs/jobs.js',
    oopsyraidsy: './ui/oopsyraidsy/oopsyraidsy.js',
    pullcounter: './ui/pullcounter/pullcounter.js',
    radar: './ui/radar/radar.js',
    raidboss: './ui/raidboss/raidboss.js',
    raidemulator: './ui/raidboss/raidemulator.js',
    test: './ui/test/test.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        'raidboss_data': {
          test: /[\\/]ui[\\/]raidboss[\\/]data[\\/]/,
          name: 'raidboss_data',
          chunks: 'all',
        },
        'oopsyraidsy_data': {
          test: /[\\/]ui[\\/]oopsyraidsy[\\/]data[\\/]/,
          name: 'oopsyraidsy_data',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  devServer: { writeToDisk: true },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
};
