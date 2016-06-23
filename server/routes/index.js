/* eslint-disable global-require, new-cap */

module.exports = (express) => {
  const router = express.Router();

  ['./users'].forEach((module) => {
    require(module)(router);
  });

  return router;
};
