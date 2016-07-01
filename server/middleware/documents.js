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
  next();
}

function parsePublishDateFilters(req, res, next) {
  const createdAtConditions = [];
  const createdBefore = new Date(req.query.published_before);
  if (!isNaN(createdBefore.getTime())) {
    createdAtConditions.push({ createdAt: { $lte: createdBefore } });
  }
  const createdAfter = new Date(req.query.published_after);
  if (!isNaN(createdAfter.getTime())) {
    createdAtConditions.push({ createdAt: { $gte: createdAfter } });
  }
  if (createdAtConditions.length) {
    req.documentsQuery.$and = createdAtConditions;
  }
  next();
}

function parseAccessFilter(req, res, next) {
  if (req.query.read_access) {
    req.documentsQuery['access.read'] = req.query.read_access;
  }
  next();
}

function parseSkipAndLimit(req, res, next) {
  req.query.skip = parseInt(req.query.skip);
  req.query.limit = parseInt(req.query.limit);
  next();
}

function addUserToDocumentsQuery(req, res, next) {
  req.documentsQuery.owner = req.params.userId;
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
const documentsQueryPrep = [
  prepareDocumentsQuery,
  parsePublishDateFilters,
  parseAccessFilter,
  parseSkipAndLimit,
];

module.exports = {
  findDocument,
  prepareDocumentsQuery: documentsQueryPrep,
  prepareUsersDocumentsQuery: [...documentsQueryPrep, addUserToDocumentsQuery],
  requireReadAccess: [findDocument, requireReadAccess],
  requireWriteAccess: [...authenticatedFindDocument, requireWriteAccess],
  requireAdminOrOwner: [...authenticatedFindDocument, requireAdminOrOwner],
  requireOwner: [...authenticatedFindDocument, requireOwner],
};
