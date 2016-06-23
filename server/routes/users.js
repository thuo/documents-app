const Users = require('../controllers/users');
const UsersMiddleware = require('../middleware/users');
const methodNotAllowed = require('../helpers/error').callbacks.methodNotAllowed;

module.exports = (router) => {
  router.route('/users')
    .post(Users.create)
    .get(Users.all)
    .all(methodNotAllowed);

  router.route('/users/:userId')
    .get(Users.get)
    .put(UsersMiddleware.requireCurrentUser, Users.update)
    .delete(UsersMiddleware.requireCurrentUser, Users.delete)
    .all(methodNotAllowed);
};
