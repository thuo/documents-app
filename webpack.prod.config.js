const webpack = require('webpack');
const config = require('./webpack.base.config');

config.devtool = 'cheap-source-map';
config.plugins.push(
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      warnings: false,
    },
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  })
);

module.exports = config;
