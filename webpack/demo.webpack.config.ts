import {getPlugins, getRules, getConfig} from './base';

const demoConfig = {
  ...getConfig('demo'),
  plugins: getPlugins('demo'),
  module: {
    rules: getRules('demo')
  }
};

export default demoConfig;