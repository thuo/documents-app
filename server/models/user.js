const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Role = require('./role');
const config = require('../config');

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (value) => /^\S+@\S+\.\S+$/.test(value),
      message: '`{VALUE}` is not a valid email address',
    },
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  username: {
    type: String,
    unique: true,
    validate: {
      validator: (value) => /^\w+$/.test(value),
      message: 'A username can only contain alphanumeric characters ' +
        'or an underscore',
    },
  },
  name: {
    first: String,
    last: String,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'Role is required'],
  },
});

UserSchema.pre('save', function hashPassword(done) {
  if (!this.isModified('password')) {
    done();
    return;
  }
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      done(err);
      return;
    }
    this.password = hash;
    done();
  });
});

UserSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.statics.findWithRole = function findWithRole(match, callback) {
  this.find(match).populate('role', '-_id').exec(callback);
};

UserSchema.statics.findByIdWithRole = function findByIdWithRole(id, callback) {
  this.findById(id).populate('role', '-_id').exec(callback);
};

UserSchema.statics.createWithRole = function createWithRole(user, callback) {
  Role.findByTitle(user.role, (err, role) => {
    if (err) {
      callback(err, null);
      return;
    }
    user.role = role._id;
    this.create(user, callback);
  });
};

UserSchema.statics.findByRole = function findByRole(title, callback) {
  Role.findByTitle(title, (err, role) => {
    if (err) {
      callback(err, null);
      return;
    }
    this.findWithRole({ role: role._id }, callback);
  });
};

UserSchema.methods.updateRole = function updateRole(title, callback) {
  Role.findByTitle(title, (roleError, role) => {
    if (roleError) {
      callback(roleError, null);
      return;
    }
    // ensure we are not trying to downgrade an admin to a normal user
    if (role.title !== 'user' || this.role.title !== 'admin') {
      this.role = role._id;
      this.save((err, savedUser) => {
        if (err) {
          callback(err, null);
          return;
        }
        savedUser.populate({ path: 'role', select: '-_id' }, callback);
      });
      return;
    }

    // if we're downgrading an admin, there has to be at least another admin
    // otherwise we won't allow it
    this.model('User').findByRole('admin', (err, admins) => {
      if (admins && admins.length > 1) {
        // we found other more than 1 admins which means there's another admin
        // other than the one being downgraded; so, we can go ahead and update
        // the role.
        this.role = role._id;
        this.save((saveError, savedUser) => {
          if (saveError) {
            callback(saveError, null);
            return;
          }
          savedUser.populate({ path: 'role', select: '-_id' }, callback);
        });
        return;
      }
      callback(err || {
        name: 'CustomError',
        error: "Unauthorized. Can't remove the only admin",
        status: 403,
      }, null);
    });
  });
};

const User = mongoose.model('User', UserSchema);

// we want the test database to only contain the testing data so we shouldn't
// create the admin user if we're testing.
// TODO: ideally, the test setup should handle this by clearing the database
// before adding the testing data.
if (!config.env.testing) {
  // create the admin user if there are no users in the database
  User.find({}, (userError, users) => {
    if (users && users.length) return;
    User.createWithRole({
      email: config.admin.email,
      password: config.admin.password,
      role: 'admin',
    });
  });
}

module.exports = User;
