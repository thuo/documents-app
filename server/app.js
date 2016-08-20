const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes')(express);
const config = require('./config');

// MongoDB document size limit is 16MB. Same limit will apply to request bodies
app.use(bodyParser.json({ limit: '16mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '16mb' }));

if (!config.env.testing) {
  app.use(morgan('dev'));
}

app.use('/api', router);

module.exports = app;
