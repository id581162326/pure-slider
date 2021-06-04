import {getPlugins, getRules, getConfig} from './base';
import * as webpack from 'webpack';

const demoConfig: webpack.Configuration = {
  ...getConfig('demo'),
  plugins: getPlugins('demo'),
  module: {
    rules: getRules('demo')
  }
};

export default demoConfig;