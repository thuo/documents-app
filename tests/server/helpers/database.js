const seeder = require('./seeder');
const config = require('../../../server/config');
const database = require('../../../server/database');
let db;

before((done) => {
  db = database(config.testingMongodbUri);
  db.once('open', () => {
    seeder.seed(db.db, done);
  });
  db.once('error', done);
});

after((done) => {
  db.db.dropDatabase(done);
});
