import { merge } from 'webpack-merge';

import prodConfig from './webpack.prod';

export default merge(prodConfig, {
  devtool: 'inline-source-map',
});
