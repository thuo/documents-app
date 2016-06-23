const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/* eslint-disable new-cap */
module.exports = [
  {
    _id: mongoose.mongo.ObjectId('5766937b5075ce4d143a9c6c'),
    username: 'foobar',
    email: 'foobar@example.com',
    password: bcrypt.hashSync('raboof', 1),
    __v: 0,
    name: {
      first: 'Example',
      last: 'Test',
    },
  },
  {
    _id: mongoose.mongo.ObjectId('576c0b32a0286bc2e0d16a70'),
    username: 'one',
    email: 'one@example.com',
    password: bcrypt.hashSync('raboof', 1),
    __v: 0,
    name: {
      first: 'Two',
      last: 'Number',
    },
  },
];
