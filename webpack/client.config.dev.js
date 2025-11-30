const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config');
const process = require('process');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @type {webpack.Configuration}
 */
const clientDevConfig = {
  mode: 'development',
  entry: path.join(process.cwd(), 'src', 'index.tsx'),
  target: 'web',
  devtool: 'source-map',
  output: {
    path: path.resolve(process.cwd(), 'dist', 'client'),
    filename: 'main.js',
    clean: false
  },
  devServer: {
    port: 3000,
    hot: true,
    open: true,
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.join(process.cwd(), 'src'),
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.join(process.cwd(), 'tsconfig.app.json'),
            instance: 'client',
            transpileOnly: false
          },
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(process.cwd(), 'src', 'index.html'),
      inject: true,
    }),
    new (require('node-polyfill-webpack-plugin'))()
  ]
};

module.exports = merge(baseConfig, clientDevConfig);