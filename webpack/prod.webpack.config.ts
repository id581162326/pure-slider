import {getPlugins, getRules, getConfig} from './base';

const prodConfig = {
  ...getConfig('prod'),
  plugins: getPlugins('prod'),
  module: {
    rules: getRules('prod')
  }
};

export default prodConfig;