const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes')(express);
const resourceNotFound = require('./helpers/error').callbacks.resourceNotFound;
const config = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (!config.env.testing) {
  app.use(morgan('dev'));
}

app.use('/api', router);

app.use(resourceNotFound);

module.exports = app;
