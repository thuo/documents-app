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
      return;
    }
    if (!req.body.password) {
      error.send({
        error: 'Password is required',
      }, res, 400);
      return;
    }
    // password needs to be selected when `user.comparePassword()` is going
    // to be used
    User.findOne({ email: req.body.email }, '+password')
      .populate('role', '-_id')
      .exec((err, user) => {
        if (error.mongoose.send(err, res)) return;
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
            // can't send the `user` object directly because it contains
            // the password hash
            _id: user._id,
            email: user.email,
            username: user.username,
            name: user.name,
            role: user.role,
          }),
          config.secretKey
        );
        res.json({ token });
      });
  },
};
