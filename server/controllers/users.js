const User = require('../models/user');
const error = require('../helpers/error');

module.exports = {
  create(req, res) {
    const role = 'user';
    User.createWithRole(
      {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        name: {
          first: req.body.first_name,
          last: req.body.last_name,
        },
        role,
      },
      (err, user) => {
        if (error.mongoose.send(err, res)) return;
        res.status(201).json({
          _id: user._id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: { title: role },
        });
      }
    );
  },

  all(req, res) {
    User.findWithRole({}, (err, users) => {
      if (error.mongoose.send(err, res)) return;
      res.json(users);
    });
  },

  get(req, res) {
    User.findByIdWithRole(req.params.userId, (err, user) => {
      if (error.mongoose.send(err, res)) return;
      if (!user) {
        error.callbacks.resourceNotFound(req, res);
        return;
      }
      res.json(user);
    });
  },

  update(req, res) {
    User.findByIdWithRole(req.params.userId, (findError, user) => {
      if (error.mongoose.send(findError, res)) return;
      if (!user) {
        error.callbacks.resourceNotFound(req, res);
        return;
      }
      user.email = req.body.email || user.email;
      user.username = req.body.username || user.username;
      user.name.first = req.body.first_name || user.name.first;
      user.name.last = req.body.last_name || user.name.last;
      user.save((saveError) =>
        error.mongoose.send(saveError, res) || res.json(user)
      );
    });
  },

  delete(req, res) {
    User.removeIfNotLoneAdmin({ _id: req.params.userId }, (err) => {
      if (error.mongoose.send(err, res)) return;
      res.json({
        message: 'User deleted.',
      });
    });
  },

  updateRole(req, res) {
    User.findByIdWithRole(req.params.userId, (findError, user) => {
      if (error.mongoose.send(findError, res)) return;
      if (!user) {
        error.callbacks.resourceNotFound(req, res);
        return;
      }
      user.updateRole(req.body.role, (updateError, savedUser) =>
        error.mongoose.send(updateError, res) || res.json(savedUser)
      );
    });
  },

  updatePassword(req, res) {
    if (!req.body.old_password) {
      error.send({
        error: 'Old password is required',
      }, res, 400);
      return;
    }
    User.findById(req.decoded._id, '+password', (findError, user) => {
      if (error.mongoose.send(findError, res)) return;
      if (!user.comparePassword(req.body.old_password)) {
        error.unauthorized.send('Unauthorized. Incorrect old password', res);
        return;
      }
      user.password = req.body.password;
      user.save((saveError, savedUser) => {
        if (error.mongoose.send(saveError, res)) return;
        savedUser.populate('role', '-_id', (updateError, populatedUser) =>
          error.mongoose.send(updateError, res) || res.json({
          // we're doing this to avoid sending back the password
            _id: populatedUser._id,
            email: populatedUser.email,
            username: populatedUser.username,
            name: populatedUser.name,
            role: populatedUser.role,
          })
        );
      });
    });
  },
};
