function send(err, res, statusOrPreprocessor) {
  if (!err) return false;
  if (typeof statusOrPreprocessor === 'function') {
    const { status, body } = statusOrPreprocessor(err);
    res.status(status).json(body);
  } else if (typeof statusOrPreprocessor === 'number') {
    res.status(statusOrPreprocessor).json(err);
  } else {
    res.status(500).json(err);
  }
  return true;
}

function preprocessMongooseError(err) {
  if (err.name === 'MongoError' && err.code === 11000) {
    const error = err.message.replace(
      /(.+) index: (.+)_\d+ dup key: { : "(.+)" }/,
      'The $2 `$3` is alreay in use'
    );
    return {
      status: 409,
      body: { error },
    };
  }
  if (err.name === 'ValidationError') {
    const messages = Object.keys(err.errors).reduce(
      (accumulated, key) => {
        accumulated[key] = err.errors[key].message;
        return accumulated;
      },
      {}
    );
    return {
      status: 400,
      body: {
        error: err.message,
        messages,
      },
    };
  }
  if (err.name === 'CastError') {
    const type = err.kind === 'ObjectId' ? 'resource id' : err.kind;
    const error = `\`${err.value}\` is not a valid ${type}`;
    return { status: 400, body: { error } };
  }
  if (err.name === 'CustomError') {
    return { status: err.status, body: { error: err.error } };
  }
  return { status: 500, body: err };
}

const mongoose = { send(err, res) {
  return send(err, res, preprocessMongooseError);
} };

const unauthorized = { send(errorMessage, res) {
  return send({ error: errorMessage }, res, 403);
} };

const callbacks = {
  methodNotAllowed(req, res) {
    res.status(405).json({
      error: `Method \`${req.method}\` not allowed on resource \`${req.originalUrl}\``,
    });
  },
  resourceNotFound(req, res) {
    res.status(404).json({
      error: `Resource \`${req.originalUrl}\` not found`,
    });
  },
};

module.exports = { send, mongoose, callbacks, unauthorized };
