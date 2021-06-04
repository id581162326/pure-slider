import {getPlugins, getRules, getConfig} from './base';
import * as webpack from 'webpack';

const devConfig: webpack.Configuration = {
  ...getConfig('dev'),
  plugins: getPlugins('dev'),
  module: {
    rules: getRules('dev')
  }
};

export default devConfig;