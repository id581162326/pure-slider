import {getPlugins, getRules, getConfig} from './base';

const devConfig = {
  ...getConfig('dev'),
  plugins: getPlugins('dev'),
  module: {
    rules: getRules('dev')
  }
};

export default devConfig;