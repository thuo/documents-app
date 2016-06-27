const Document = require('../models/document');
const AuthMiddleware = require('../middleware/auth');
const error = require('../helpers/error');

function prepareDocumentsQuery(req, res, next) {
  if (req.decoded) {
    req.documentsQuery = {
      $or: [
        { 'access.read': { $ne: 'private' } },
        { owner: req.decoded._id },
      ],
    };
  } else {
    req.documentsQuery = { 'access.read': 'public' };
  }
  req.query.skip = Number(req.query.skip);
  req.query.limit = Number(req.query.limit);
  next();
}

function findDocument(req, res, next) {
  Document.findById(req.params.documentId)
    .deepPopulate('owner.role')
    .exec((err, doc) => {
      if (error.mongoose.send(err, res)) return;
      if (!doc) {
        error.callbacks.resourceNotFound(req, res);
        return;
      }
      req.document = doc;
      next();
    });
}

function requireReadAccess(req, res, next) {
  switch (req.document.access.read) {
    case 'public':
      next();
      break;
    case 'authenticated':
      if (req.decoded) {
        next();
      } else {
        error.unauthorized.send('Unauthorized. Authentication required', res);
      }
      break;
    case 'private':
      if (req.decoded && req.decoded._id.equals(req.document.owner._id)) {
        next();
      } else {
        error.unauthorized.send(
          'Unauthorized. Only document owner can perform this action',
          res
        );
      }
      break;
    default:
      error.unauthorized.send('Unauthorized', res);
  }
}

function requireWriteAccess(req, res, next) {
  switch (req.document.access.write) {
    case 'authenticated':
      next();
      break;
    case 'private':
      if (req.decoded._id.equals(req.document.owner._id)) {
        next();
      } else {
        error.unauthorized.send(
          'Unauthorized. Only document owner can perform this action',
          res
        );
      }
      break;
    default:
      error.unauthorized.send('Unauthorized', res);
  }
}

function requireAdminOrOwner(req, res, next) {
  if (req.decoded._id.equals(req.document.owner._id)
      || req.decoded.role.title === 'admin') {
    next();
    return;
  }
  error.unauthorized.send(
    'Unauthorized. Only the document owner or admin can perform this action',
    res
  );
}

function requireOwner(req, res, next) {
  if (req.decoded._id.equals(req.document.owner._id)) {
    next();
    return;
  }
  error.unauthorized.send(
    'Unauthorized. Only the document owner can perform this action',
    res
  );
}

const authenticatedFindDocument = [AuthMiddleware.authenticate, findDocument];

module.exports = {
  prepareDocumentsQuery,
  findDocument,
  requireReadAccess: [findDocument, requireReadAccess],
  requireWriteAccess: [...authenticatedFindDocument, requireWriteAccess],
  requireAdminOrOwner: [...authenticatedFindDocument, requireAdminOrOwner],
  requireOwner: [...authenticatedFindDocument, requireOwner],
};
