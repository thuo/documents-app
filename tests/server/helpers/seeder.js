const users = require('./seeds/users');

function seed(db, done) {
  const usersCol = db.collection('users');
  usersCol.insertMany(users, done);
}

module.exports = { seed };
