const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');

const RoleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: [true, 'Role title is required'],
  },
  description: String,
});

RoleSchema.statics.findByTitle = function find(title, callback) {
  this.findOne({ title }, (err, role) => {
    if (!role) {
      callback(err || {
        name: 'CustomError',
        error: `\`${role}\` is not a valid role`,
        status: 400,
      }, null);
      return;
    }
    callback(null, role);
  });
};

const Role = mongoose.model('Role', RoleSchema);

// we want the test database to only contain the testing data so we shouldn't
// initialize roles if we're testing
// TODO: ideally, the test setup should handle this by clearing the database
// before adding the testing data.
if (!config.env.testing) {
  // initialize roles if there are no roles in the database
  Role.find({}, (err, roles) => {
    if (roles && roles.length) return;
    Role.collection.insert([
      { title: 'admin' },
      { title: 'user' },
    ]);
  });
}

module.exports = Role;
