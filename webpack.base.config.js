/* istanbul ignore next */
const path = require('path');
const webpack = require('webpack');
const appPath = path.join(__dirname, 'client');

module.exports = {
  entry: [appPath],
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  resolve: {
    alias: {
      app: appPath,
    },
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: appPath,
      loaders: ['babel'],
    }, {
      test: /\.css$/,
      include: [
        appPath,
        path.join(__dirname, 'node_modules/react-mdl/extra'),
      ],
      loaders: ['style', 'css'],
    }],
  },
};
