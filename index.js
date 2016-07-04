const app = require('./server/app');
const config = require('./server/config');
const db = require('./server/database')(config.mongodbUri);

/* eslint-disable no-console */
db.on('error', (err) => {
  console.error('Database connection failed.');
  console.error(err);
});

db.once('open', () => {
  console.log('Database connection established.');
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});
