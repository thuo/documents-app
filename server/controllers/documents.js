const Document = require('../models/document');
const error = require('../helpers/error');

module.exports = {
  create(req, res) {
    Document.create({
      title: req.body.title,
      content: req.body.content,
      owner: req.decoded._id,
      access: {
        read: req.body.read_access || 'public',
        write: req.body.write_access || 'private',
      },
    }, (err, doc) => {
      if (error.mongoose.send(err, res)) return;
      doc.deepPopulate('owner.role', (populateError, populatedDoc) => {
        if (error.mongoose.send(populateError, res)) return;
        res.status(201).json(populatedDoc);
      });
    });
  },

  all(req, res) {
    Document.find(req.documentsQuery)
      .skip(req.query.skip)
      .limit(req.query.limit)
      .sort('-createdAt')
      .deepPopulate('owner.role')
      .exec((err, docs) => {
        if (error.mongoose.send(err, res)) return;
        res.status(200).json(docs);
      });
  },

  get(req, res) {
    res.status(200).json(req.document);
  },

  update(req, res) {
    const doc = req.document;
    doc.title = req.body.title || doc.title;
    doc.content = req.body.content || doc.content;
    doc.save((saveError) =>
      error.mongoose.send(saveError, res) || res.json(doc)
    );
  },

  delete(req, res) {
    Document.findByIdAndRemove(req.document._id, (err) => {
      if (error.mongoose.send(err, res)) return;
      res.json({
        message: 'Document deleted.',
      });
    });
  },

  updateAccess(req, res) {
    const doc = req.document;
    doc.access.read = req.body.read_access || doc.access.read;
    doc.access.write = req.body.write_access || doc.access.write;
    doc.save((saveError) =>
      error.mongoose.send(saveError, res) || res.json(doc)
    );
  },
};
