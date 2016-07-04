const async = require('async');
const users = require('./seeds/users');
const roles = require('./seeds/roles');
const documents = require('./seeds/documents');

function seed(db, done) {
  async.series([
    (next) => {
      db.collection('roles').insertMany(roles, () => { next(null); });
    },
    (next) => {
      db.collection('users').insertMany(users, () => { next(null); });
    },
    (next) => {
      db.collection('documents').insertMany(documents, () => { next(null); });
    },
    () => { done(); },
  ]);
}

module.exports = { seed };
