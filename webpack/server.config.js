const webpack = require('webpack');
const { merge } = require('webpack-merge');
const process = require('process');
const path = require('path');
const baseConfig = require('./base.config.js');

/**
 * @type {webpack.Configuration}
 */
const serverConfig = {
  target: 'node',
  mode: 'production',
  entry: path.join(process.cwd(), 'src', 'app.ts'),
  output: {
    path: path.resolve(process.cwd(), 'dist', 'server'),
    filename: 'app.js',
  },
};

module.exports = merge(baseConfig, serverConfig);
