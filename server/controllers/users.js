const User = require('../models/user');
const error = require('../helpers/error');

module.exports = {
  create(req, res) {
    User.create(
      {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        name: {
          first: req.body.first_name,
          last: req.body.last_name,
        },
      },
      (err, user) => {
        if (error.mongoose.send(err, res)) return;
        res.status(201).json(user);
      }
    );
  },

  all(req, res) {
    User.find({}, (err, users) => {
      if (error.mongoose.send(err, res)) return;
      res.json(users);
    });
  },

  get(req, res) {
    User.findById(req.params.userId, (err, user) => {
      if (error.mongoose.send(err, res)) return;
      if (!user) {
        error.callbacks.resourceNotFound(req, res);
        return;
      }
      res.json(user);
    });
  },

  update(req, res) {
    User.findById(req.params.userId, (findError, user) => {
      if (error.mongoose.send(findError, res)) return;
      if (!user) {
        error.callbacks.resourceNotFound(req, res);
        return;
      }
      user.email = req.body.email || user.email;
      user.username = req.body.username || user.username;
      user.name.first = req.body.first_name || user.name.first;
      user.name.last = req.body.last_name || user.name.last;
      user.save((saveError, savedUser) =>
        error.mongoose.send(saveError, res) || res.json(savedUser)
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
};
