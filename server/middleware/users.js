const error = require('../helpers/error');
const AuthMiddleware = require('../middleware/auth');

function requireCurrentUser(req, res, next) {
  if (!req.decoded._id.equals(req.params.userId)) {
    error.unauthorized.send(
      `Unauthorized. User id in token doesn't match \`${req.params.userId}\`.`,
      res
    );
    return;
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.decoded.role || req.decoded.role.title !== 'admin') {
    error.unauthorized.send('Unauthorized. Requires admin.', res);
    return;
  }
  next();
}

module.exports = {
  requireCurrentUser: [AuthMiddleware.authenticate, requireCurrentUser],
  requireAdmin: [AuthMiddleware.authenticate, requireAdmin],
};
