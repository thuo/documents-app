const jwt = require('jsonwebtoken');
const User = require('../models/user');
const error = require('../helpers/error');
const config = require('../config');

module.exports = {
  login(req, res) {
    if (!req.body.email) {
      error.send({
        error: 'Email is required',
      }, res, 400);
    }
    if (!req.body.password) {
      error.send({
        error: 'Password is required',
      }, res, 400);
    }
    User.findOne({ email: req.body.email })
      .select('+password')
      .exec((err, user) => {
        if (error.mongoose.send(err)) return;
        if (!user) {
          error.send({
            error: "Email doesn't match any user",
          }, res, 401);
          return;
        }
        if (!user.comparePassword(req.body.password)) {
          error.send({
            error: "Email and password don't match",
          }, res, 401);
          return;
        }
        const token = jwt.sign(
          JSON.stringify({
            _id: user._id,
            email: user.email,
            username: user.username,
            name: user.name,
          }),
          config.secretKey
        );
        res.json({ token });
      });
  },
};
