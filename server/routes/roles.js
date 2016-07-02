const Roles = require('../controllers/roles');
const UsersMiddleware = require('../middleware/users');
const methodNotAllowed = require('../helpers/error').callbacks.methodNotAllowed;

module.exports = (router) => {
  router.route('/roles')
    .get(Roles.all)
    .all(methodNotAllowed);

  router.route('/roles/:roleId')
    .get(Roles.get)
    // only admins can update roles
    .put(UsersMiddleware.requireAdmin, Roles.update)
    .all(methodNotAllowed);

  router.route('/roles/:roleId/users')
    // only admins can access users by roles
    .get(UsersMiddleware.requireAdmin, Roles.getUsers)
    .all(methodNotAllowed);
};
