import {getPlugins, getRules, getConfig} from './base';
import * as webpack from 'webpack';

const testConfig: webpack.Configuration = {
  ...getConfig('test'),
  plugins: getPlugins('test'),
  module: {
    rules: getRules('test')
  }
};

export default testConfig;