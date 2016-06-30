const Documents = require('../controllers/documents');
const AuthMiddleware = require('../middleware/auth');
const DocumentsMiddleware = require('../middleware/documents');
const methodNotAllowed = require('../helpers/error').callbacks.methodNotAllowed;

module.exports = (router) => {
  router.route('/documents')
    .post(AuthMiddleware.authenticate, Documents.create)
    .get(DocumentsMiddleware.prepareDocumentsQuery, Documents.all)
    .all(methodNotAllowed);

  router.route('/documents/:documentId')
    .get(DocumentsMiddleware.requireReadAccess, Documents.get)
    .put(DocumentsMiddleware.requireWriteAccess, Documents.update)
    .delete(DocumentsMiddleware.requireAdminOrOwner, Documents.delete)
    .all(methodNotAllowed);

  router.route('/documents/:documentId/access')
    .put(DocumentsMiddleware.requireOwner, Documents.updateAccess)
    .all(methodNotAllowed);

  router.route('/users/:userId/documents')
    .get(DocumentsMiddleware.prepareUsersDocumentsQuery, Documents.all)
    .all(methodNotAllowed);
};
