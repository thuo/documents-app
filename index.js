const app = require('./server/app');
const config = require('./server/config');
const db = require('./server/database')(config.mongodbUri);

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevConfig = require('./webpack.dev.config');

const express = require('express');
const path = require('path');

/* eslint-disable no-console */
db.on('error', (err) => {
  console.error('Database connection failed.');
  console.error(err);
});

db.once('open', () => {
  console.log('Database connection established.');
});

if (config.env.development) {
   // Set up react hot reloading
  const compiler = webpack(webpackDevConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});
