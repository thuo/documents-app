const async = require('async');
const users = require('./seeds/users');
const roles = require('./seeds/roles');

function seed(db, done) {
  async.series([
    (next) => {
      db.collection('roles').insertMany(roles, () => { next(null); });
    },
    (next) => {
      db.collection('users').insertMany(users, () => { next(null); });
    },
    () => { done(); },
  ]);
}

module.exports = { seed };
