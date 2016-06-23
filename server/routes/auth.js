const Auth = require('../controllers/auth');
const methodNotAllowed = require('../helpers/error').callbacks.methodNotAllowed;

module.exports = (router) => {
  router.route('/login')
    .post(Auth.login)
    .all(methodNotAllowed);
};
