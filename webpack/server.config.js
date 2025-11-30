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
  entry: path.join(process.cwd(), 'src-node', 'app.ts'),
  output: {
    path: path.resolve(process.cwd(), 'dist', 'server'),
    filename: 'app.js',
  },
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, /^src$/],
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.join(process.cwd(), 'tsconfig.node.json'),
            instance: 'server',
            transpileOnly: false
          },
        }
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};

module.exports = merge(baseConfig, serverConfig);
