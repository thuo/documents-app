const Users = require('../controllers/users');
const methodNotAllowed = require('../helpers/error').callbacks.methodNotAllowed;

module.exports = (router) => {
  router.route('/users')
    .post(Users.create)
    .get(Users.all)
    .all(methodNotAllowed);

  router.route('/users/:userId')
    .get(Users.get)
    .put(Users.update)
    .delete(Users.delete)
    .all(methodNotAllowed);
};
