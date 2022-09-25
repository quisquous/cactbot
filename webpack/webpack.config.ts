import path from 'path';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// copy-webpack-plugin has changed to a newer export syntax that current eslint
// version doesn't support
// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import isCI from 'is-ci';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration as WebpackConfiguration, WebpackPluginInstance } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

export default (
  { cactbotModules, cactbotChunks, cactbotHtmlChunksMap }: {
    cactbotModules: { [module: string]: string };
    cactbotChunks: { [module: string]: string };
    cactbotHtmlChunksMap: { [html: string]: HtmlWebpackPlugin.Options };
  },
): Configuration => {
  const entries: { [module: string]: string } = {};
  Object.entries(cactbotModules).forEach(([key, module]) => {
    // TODO: Remove when everything is TypeScript, convert to:
    // entries[module] = `./${module}.ts`;
    let extension = 'js';
    if (
      [
        'config',
        'coverage',
        'eureka',
        'jobs',
        'oopsyraidsyLive',
        'oopsyraidsySummary',
        'oopsyraidsyViewer',
        'pullcounter',
        'radar',
        'raidboss',
        'raidemulator',
        'test',
        'timerbarTest',
        'splitter',
      ].includes(key)
    )
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

  const plugins: WebpackPluginInstance[] = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    ...htmlPluginRules,
    new CopyPlugin({
      // All of these patterns should be served individually from the static
      // directory below.
      patterns: [
        {
          // copy sounds and images
          from: 'resources/@(ffxiv|sounds)/**/*',
        },
        {
          // copy all the skins folder under modules,
          // only raidboss for now though.
          from: 'ui/*/skins/**/*',
          noErrorOnMissing: true,
        },
      ],
    }),
  ];

  if (!isCI)
    plugins.unshift(new ForkTsCheckerWebpackPlugin());

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
      assetModuleFilename: '[file][query]',
    },
    devServer: {
      static: [
        path.join(__dirname, '../dist/resources/ffxiv'),
        path.join(__dirname, '../dist/resources/sounds'),
        path.join(__dirname, '../dist/ui/raidboss/skins/'),
      ],
      devMiddleware: {
        writeToDisk: true,
      },
      allowedHosts: 'all',
      client: {
        webSocketURL: {
          hostname: 'localhost',
        },
      },
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          // this will allow importing without extension in js files.
          // Use babel to transform TypeScript files, but babel has no
          // type checking, so we need ForkTsCheckerWebpackPlugin.
          test: /\.(m?j|t)s$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: { chrome: '75' },
                  },
                ],
                [
                  '@babel/preset-typescript',
                ],
              ],
            },
          },
          resolve: {
            fullySpecified: false,
          },
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
          test: /\.(png|jpe?g)/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 50 * 1024, // 50 KiB
            },
          },
        },
        {
          test: /data[\\\/]\w*_manifest\.txt$/,
          use: [
            {
              loader: './webpack/loaders/manifest-loader.ts',
            },
          ],
        },
        {
          test: /data[\\\/](?!\w*_manifest\.txt).*\.txt$/,
          use: [
            {
              loader: 'raw-loader',
            },
          ],
        },
      ],
    },
    plugins: plugins,
    stats: {
      children: true,
      errorDetails: true,
    },
  };
};
