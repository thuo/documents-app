const Roles = require('../controllers/roles');
const UsersMiddleware = require('../middleware/users');
const methodNotAllowed = require('../helpers/error').callbacks.methodNotAllowed;

module.exports = (router) => {
  router.route('/roles')
    .get(Roles.all)
    .all(methodNotAllowed);

  router.route('/roles/:roleId')
    .get(Roles.get)
    .put(UsersMiddleware.requireAdmin, Roles.update)
    .all(methodNotAllowed);

  router.route('/roles/:roleId/users')
    .get(UsersMiddleware.requireAdmin, Roles.getUsers)
    .all(methodNotAllowed);
};
