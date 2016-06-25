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
    User.remove({ _id: req.params.userId }, (err) => {
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
};
