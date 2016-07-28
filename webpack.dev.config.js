const webpack = require('webpack');
const config = require('./webpack.base.config');

config.debug = true;
config.devtool = 'eval-source-map';
config.entry.unshift(
  'webpack-hot-middleware/client'
);
config.plugins.push(
  new webpack.HotModuleReplacementPlugin()
);

config.module.loaders[0].loaders.unshift(
  'react-hot'
);

module.exports = config;
