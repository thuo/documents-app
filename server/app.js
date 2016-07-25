const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes')(express);
const config = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (!config.env.testing) {
  app.use(morgan('dev'));
}

app.use('/api', router);

module.exports = app;
