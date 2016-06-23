const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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

module.exports = mongoose.model('User', UserSchema);
