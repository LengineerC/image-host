const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config');
const process = require('process');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @type {webpack.Configuration}
 */
const clientProdConfig = {
  mode: 'production',
  entry: path.join(process.cwd(), 'src', 'index.tsx'),
  target: 'web',
  output: {
    path: path.resolve(process.cwd(), 'dist', 'client'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[name].[hash:8][ext]',
    clean: true,
    publicPath: '/',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new (require('terser-webpack-plugin'))({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
          }
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: 10,
          chunks: 'all',
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
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
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new (require('node-polyfill-webpack-plugin'))()
  ],
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

module.exports = merge(baseConfig, clientProdConfig);

