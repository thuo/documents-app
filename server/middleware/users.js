const error = require('../helpers/error');
const AuthMiddleware = require('../middleware/auth');

function requireCurrentUser(req, res, next) {
  if (req.decoded._id !== req.params.userId) {
    error.send({
      error: 'Unauthorized',
    }, res, 403);
    return;
  }
  next();
}

module.exports = {
  requireCurrentUser: [AuthMiddleware.authenticate, requireCurrentUser],
};
