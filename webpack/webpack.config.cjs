'use strict';

const path = require('path');

module.exports = {
  entry: {
    'config': {
      import: './ui/config/config.js',
      dependOn: 'raidboss_data',
    },
    'coverage': {
      import: './util/coverage/coverage.js',
      dependOn: ['raidboss_data', 'oopsy_data'],
    },
    'rdmty': './ui/dps/rdmty/dps.js',
    'xephero': './ui/dps/xephero/xephero.js',
    'eureka': './ui/eureka/eureka.js',
    'fisher': './ui/fisher/fisher.js',
    'jobs': './ui/jobs/jobs.js',
    'oopsyraidsy': {
      import: './ui/oopsyraidsy/oopsyraidsy.js',
      dependOn: 'oopsy_data',
    },
    'oopsy_data': './ui/oopsyraidsy/data/manifest.txt',
    'pullcounter': './ui/pullcounter/pullcounter.js',
    'radar': './ui/radar/radar.js',
    'raidboss': {
      import: './ui/raidboss/raidboss.js',
      dependOn: 'raidboss_data',
    },
    'raidboss_data': './ui/raidboss/data/manifest.txt',
    'raidemulator': {
      import: './ui/raidboss/raidemulator.js',
      dependOn: 'raidboss_data',
    },
    'test': './ui/test/test.js',
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
        // TODO: we could also strip comments and blank lines from timelines
        use: ['raw-loader'],
      },
    ],
  },
};
