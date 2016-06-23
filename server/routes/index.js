const AuthMiddleware = require('../middleware/auth');

/* eslint-disable global-require, new-cap */
module.exports = (express) => {
  const router = express.Router();
  router.use(AuthMiddleware.parseToken);

  ['users', 'auth'].forEach((module) => {
    require(`./${module}`)(router);
  });

  return router;
};
