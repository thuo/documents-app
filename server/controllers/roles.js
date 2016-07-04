const Role = require('../models/role');
const User = require('../models/user');
const error = require('../helpers/error');

module.exports = {
  all(req, res) {
    Role.find({}, (err, roles) => {
      if (error.mongoose.send(err, res)) return;
      res.json(roles);
    });
  },

  getUsers(req, res) {
    User.findByRoleId(req.params.roleId, (err, users) => {
      if (error.mongoose.send(err, res)) return;
      res.json(users);
    });
  },

  get(req, res) {
    Role.findById(req.params.roleId, (err, role) => {
      if (error.mongoose.send(err, res)) return;
      if (!role) {
        error.callbacks.resourceNotFound(req, res);
        return;
      }
      res.json(role);
    });
  },

  update(req, res) {
    Role.findById(req.params.roleId, (err, role) => {
      if (error.mongoose.send(err, res)) return;
      if (!role) {
        error.callbacks.resourceNotFound(req, res);
        return;
      }
      role.description = req.body.description || role.description;
      role.save((saveError) => {
        if (error.mongoose.send(saveError, res)) return;
        res.json(role);
      });
    });
  },
};
