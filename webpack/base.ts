import path from 'path';
import webpack from 'webpack';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserJSPlugin from 'terser-webpack-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHardDiskPlugin from 'html-webpack-harddisk-plugin';

type BuildType = 'dev' | 'prod' | 'demo' | 'test';

const getTypeDependingPlugins: (buildType: BuildType) => webpack.WebpackPluginInstance[] = (buildType) => {
  switch (buildType) {
    case 'dev': {
      return ([
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
          template: './demo/page/index.html',
          filename: 'index.html',
          inject: 'body',
        })
      ]);
    }

    case 'demo': {
      return ([
        new HtmlWebpackPlugin({
          template: './demo/page/index.html',
          filename: 'index.html',
          inject: 'body',
          alwaysWriteToDisk: true
        }),
        new HtmlWebpackHardDiskPlugin(),
        new MiniCssExtractPlugin({filename: 'css/[name].css'})
      ]);
    }

    case 'prod': {
      return ([new MiniCssExtractPlugin({filename: 'css/[name].css'})]);
    }

    case 'test': {
      return ([]);
    }
  }
};

const getTypeDependingConfigProps: (buildType: BuildType) => webpack.Configuration = (buildType) => {
  switch (buildType) {
    case 'dev': {
      return ({
        mode: 'development',
        entry: './demo/page/index.ts',
        output: {
          publicPath: '',
          filename: 'index.js',
          path: path.resolve(__dirname, '..', 'dev')
        },
        devtool: 'source-map',
        devServer: {
          hot: true,
          contentBase: path.resolve('..', 'dev'),
          port: 8080,
          inline: true,
          clientLogLevel: 'silent'
        }
      });
    }

    case 'demo': {
      return ({
        mode: 'production',
        entry: './demo/page/index.ts',
        output: {
          publicPath: './',
          filename: 'index.js',
          path: path.resolve(__dirname, '..', 'demo')
        },
        optimization: {
          minimize: true,
          minimizer: [new TerserJSPlugin({extractComments: false}), new CssMinimizerWebpackPlugin()]
        }
      });
    }

    case 'prod': {
      return ({
        mode: 'production',
        entry: './plugin/slider/index.ts',
        output: {
          publicPath: '',
          filename: 'index.js',
          path: path.resolve(__dirname, '..', 'dist')
        },
        optimization: {
          minimize: true,
          minimizer: [new TerserJSPlugin({extractComments: false}), new CssMinimizerWebpackPlugin()]
        }
      });
    }

    case 'test': {
      return ({
        mode: 'development',
        devtool: 'inline-source-map'
      });
    }
  }
};

export const getPlugins: (buildType: BuildType) => webpack.WebpackPluginInstance[] = (buildType) =>
  ([new CleanWebpackPlugin(), ...getTypeDependingPlugins(buildType)]);

export const getRules: (type: BuildType) => webpack.RuleSetRule[] = (buildType) => ([
  {
    test: /\.html$/i,
    use: 'html-loader',
    exclude: /node_modules/
  },
  {
    test: /\.js$/,
    use: 'babel-loader',
    exclude: /node_modules/
  },
  {
    test: /\.ts$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    use: [
      ...(buildType === 'prod' || buildType === 'demo' ? [{
        loader: MiniCssExtractPlugin.loader
      }] : ['style-loader']),
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              ['postcss-preset-env', {
                stage: 3,
                features: {
                  'nesting-rules': true,
                  'not-pseudo-class': true
                },
                ...((buildType === 'prod' || buildType === 'demo') ? {
                  browsers: 'last 2 versions'
                } : {})
              }]
            ]
          }
        }
      }]
  }
]);

export const getConfig: (buildType: BuildType) => webpack.Configuration = (buildType) => ({
  ...getTypeDependingConfigProps(buildType),
  context: path.resolve(__dirname, '..', 'src'),
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.ts', '.js'],
    alias: {
      'test': path.resolve(__dirname, '..', 'src/test'),
      'helpers': path.resolve(__dirname, '..', 'src/helpers'),
      'model': path.resolve(__dirname, '..', 'src/plugin/model'),
      'observer': path.resolve(__dirname, '..', 'src/plugin/observer'),
      'view-components': path.resolve(__dirname, '..', 'src/plugin/view-components'),
      'view-managers': path.resolve(__dirname, '..', 'src/plugin/view-managers'),
      'view': path.resolve(__dirname, '..', 'src/plugin/view')
    }
  }
});