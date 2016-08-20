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
    // Convert a message like "E11000 duplicate key error collection:
    // documents.documents index: title_1 dup key: { : "Title" }" into
    // "The title `Title` is already in use"
    const regex = /(.+)\s+index:.*\W(\w+)_\d+\s+dup key:\s+{\s+:\s+"(.+)"\s+}/;
    const error = err.message.replace(regex, '$3 is already in use');
    const field = err.message.replace(regex, '$2');
    const messages = {
      [field]: error,
    };
    return {
      status: 409,
      body: { error, messages },
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
        error: 'Invalid input',
        messages,
      },
    };
  }
  if (err.name === 'CastError') {
    let error;
    if (err.kind === 'ObjectId') {
      error = 'Not Found';
    } else {
      error = `${err.value} is not a valid ${err.kind}`;
    }
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
      error: 'Method Not Allowed',
    });
  },
  resourceNotFound(req, res) {
    res.status(404).json({
      error: 'Not Found',
    });
  },
};

module.exports = { send, mongoose, callbacks, unauthorized };
