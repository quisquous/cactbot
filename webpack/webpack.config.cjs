'use strict';

const path = require('path');

module.exports = function(env, argv) {
  return {
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
    devtool: argv.mode === 'development' ? 'source-map' : undefined,
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '../dist'),
    },
    devServer: { writeToDisk: true },
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
        },
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
};
