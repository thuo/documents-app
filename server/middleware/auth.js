const jwt = require('jsonwebtoken');
const error = require('../helpers/error');
const config = require('../config');
const User = require('../models/user');

module.exports = {
  parseToken(req, res, next) {
    req.token = req.body.token
      || req.query.token
      || req.headers['x-access-token'];
    if (req.token) {
      jwt.verify(req.token, config.secretKey, (err, decoded) => {
        // the user in the token may have been deleted or their role updated;
        // by fetching the user from the database again we ensure their
        // authority is current and not as was when the token was issued.
        User.findByIdWithRole(decoded._id, (userError, user) => {
          if (error.mongoose.send(userError, res)) return;
          req.decoded = user;
          next();
        });
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
