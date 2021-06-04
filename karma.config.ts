import {Config} from 'karma';
import webpackConfig from './webpack/test.webpack.config';

const karmaConfig: (config: Config) => void = (config) => {
  config.set({
    singleRun: false,
    autoWatch: true,
    coverageReporter: {
      dir: 'tmp/coverage/',
      reporters: [
        {
          type: 'html',
          subdir: 'report-html'
        }
      ],
      instrumenterOptions: {
        istanbul: {noCompact: true}
      }
    },
    files: ['src/**/*.test.ts'],
    browsers: ['Chrome'],
    frameworks: ['chai', 'jasmine'],
    reporters: ['mocha', 'coverage'],
    preprocessors: {'src/**/*.test.ts': ['webpack', 'sourcemap']},
    plugins: [
      'karma-jasmine', 'karma-mocha',
      'karma-chai', 'karma-coverage',
      'karma-webpack', 'karma-chrome-launcher',
      'karma-phantomjs-launcher', 'karma-mocha-reporter',
      'karma-sourcemap-loader', 'karma-typescript'
    ],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  });
};

export default karmaConfig;