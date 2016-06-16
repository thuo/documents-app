const express = require('express');
const app = express();

app.use((req, res) => {
  res.status(418).send('I\'m a teapot');
});

module.exports = app;
