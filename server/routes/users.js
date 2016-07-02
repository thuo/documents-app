const Users = require('../controllers/users');
const UsersMiddleware = require('../middleware/users');
const methodNotAllowed = require('../helpers/error').callbacks.methodNotAllowed;

module.exports = (router) => {
  router.route('/users')
    .post(Users.create)
    // only admins can view all the users
    .get(UsersMiddleware.requireAdmin, Users.all)
    .all(methodNotAllowed);

  router.route('/users/:userId')
    .get(Users.get)
    .put(UsersMiddleware.requireCurrentUser, Users.update)
    .delete(UsersMiddleware.requireCurrentUser, Users.delete)
    .all(methodNotAllowed);

  router.route('/users/:userId/password')
    // a user can only change their own password
    .put(UsersMiddleware.requireCurrentUser, Users.updatePassword)
    .all(methodNotAllowed);

  router.route('/users/:userId/role')
    // only admins can change a user's role
    .put(UsersMiddleware.requireAdmin, Users.updateRole)
    .all(methodNotAllowed);
};
