import {getPlugins, getRules, getConfig} from './base';
import * as webpack from 'webpack';

const prodConfig: webpack.Configuration = {
  ...getConfig('prod'),
  plugins: getPlugins('prod'),
  module: {
    rules: getRules('prod')
  }
};

export default prodConfig;