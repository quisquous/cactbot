import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { mergeWithRules } from 'webpack-merge';

import generateConfig from './webpack.config';
import * as constants from './constants';

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

export default mergeWithRules({
  optimization: 'merge',
  module: {
    rules: {
      test: 'match',
      use: 'replace',
    },
  },
  cache: 'replace',
})(baseConfig, {
  mode: 'production',
  cache: {
    type: 'filesystem',
    name: 'cactbot',
  },
  ...optimizationOverride,
  ...cssMinifyConfigOverride,
});
