'use strict';

const fs = require('fs');
const path = require('path');
const { resourceUsage } = require('process');
const { NormalModuleReplacementPlugin } = require('webpack');

// See https://github.com/quisquous/cactbot/pull/2466#issuecomment-782918099
// for more details about how we got here.  Typescript imports should use
// `import x from './foo.js', however foo.js might not exist and might
// really be foo.ts on disk.  WebPack will handle './foo' and even './foo.ts'
// but ts-node can only handle './foo.js'.  This resolving plugin intercepts
// any imports for js files and if the js file doesn't exist on disk,
// tries to use a ts file of the same name.
const replacementPlugin = new NormalModuleReplacementPlugin(
    /\.js$/,
    (resource) => {
      const importPath = resource.request;
      const basePath = resource.context;
      const filename = path.resolve(basePath, importPath);

      // If this is a .js file that exists, return it directly.
      if (fs.existsSync(filename))
        return;

      // Otherwise, attempt to find a .ts file in the same location.
      resource.request = resource.request.replace(/\.js$/, '.ts');
    },
);

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
      raidemulatorWorker: './ui/raidboss/emulator/data/NetworkLogConverterWorker.js',
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
    module: {
      rules: [
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
    plugins: [
      replacementPlugin,
    ],
  };
};
