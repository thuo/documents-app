const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = (uri) => {
  mongoose.connect(uri);
  return mongoose.connection;
};
