import { mergeWithRules } from 'webpack-merge';

import generateConfig from './webpack.config';
import { cactbotModules, cactbotChunks, cactbotHtmlChunksMap } from './constants';

// Add timerbar_test.html
const cactbotModulesOverride = {
  timerbarTest: 'ui/test/timerbar_test',
  ...cactbotModules,
};

const cactbotHtmlChunksMapOverride = {
  'ui/test/timerbar_test.html': {
    chunks: [
      cactbotModulesOverride.timerbarTest,
    ],
  },
  ...cactbotHtmlChunksMap,
};

const baseConfig = generateConfig({
  cactbotModules: cactbotModulesOverride,
  cactbotChunks: cactbotChunks,
  cactbotHtmlChunksMap: cactbotHtmlChunksMapOverride,
});

const tsConfigOverride = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declaration: true,
            declarationMap: true,
          },
        },
      },
    ],
  },
};

export default mergeWithRules({
  module: {
    rules: {
      test: 'match',
      options: 'replace',
    },
  },
})(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  ...tsConfigOverride,
});
