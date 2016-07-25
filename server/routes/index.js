const AuthMiddleware = require('../middleware/auth');
const resourceNotFound = require('../helpers/error').callbacks.resourceNotFound;

/* eslint-disable global-require, new-cap */
module.exports = (express) => {
  const router = express.Router();
  router.use(AuthMiddleware.parseToken);

  ['users', 'auth', 'roles', 'documents'].forEach((module) => {
    require(`./${module}`)(router);
  });

  router.use(resourceNotFound);
  return router;
};
