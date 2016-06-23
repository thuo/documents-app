const jwt = require('jsonwebtoken');
const error = require('../helpers/error');
const config = require('../config');

module.exports = {
  parseToken(req, res, next) {
    req.token = req.body.token
      || req.query.token
      || req.headers['x-access-token'];
    if (req.token) {
      jwt.verify(req.token, config.secretKey, (err, decoded) => {
        req.decoded = decoded;
        next();
      });
    } else {
      next();
    }
  },

  authenticate(req, res, next) {
    if (req.decoded) {
      next();
    } else if (req.token) {
      // req.decoded was falsy but req.token was truthy, which means that we
      // were able to get a token from the request but that token was not valid
      // which is why req.decoded was never set.
      error.send({
        error: 'Failed to authenticate token.',
      }, res, 401);
    } else {
      error.send({
        error: 'No token provided.',
      }, res, 401);
    }
  },
};
