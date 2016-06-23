const mongoose = require('mongoose');

module.exports = (uri) => {
  mongoose.connect(uri);
  return mongoose.connection;
};
