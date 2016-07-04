const jwt = require('jsonwebtoken');
const config = require('../../../server/config');

module.exports = {
  generate: (user) => jwt.sign(JSON.stringify(user), config.secretKey),
};
