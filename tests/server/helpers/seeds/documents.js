const mongoose = require('mongoose');
const users = require('./users');

/* eslint-disable new-cap */
module.exports = [
  {
    _id: mongoose.mongo.ObjectId('576fbef00d0186116ecad619'),
    title: 'Lorem ipsum',
    content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    owner: users[0]._id,
    access: {
      read: 'public',
      write: 'authenticated',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  },
  {
    _id: mongoose.mongo.ObjectId('576fbc37f701ef236db36674'),
    title: 'Etiam rhoncus',
    content: 'Maecenas tempus, tellus eget condimentum rhoncus.',
    owner: users[0]._id,
    access: {
      read: 'authenticated',
      write: 'private',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  },
  {
    _id: mongoose.mongo.ObjectId('576faced67ea660d6ab2642b'),
    title: 'Nam pretium turpis et arcu',
    content: 'Duis arcu tortor, suscipit eget, imperdiet nec.',
    owner: users[2]._id,
    access: {
      read: 'private',
      write: 'private',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  },
  {
    _id: mongoose.mongo.ObjectId('576fae284a4a982e6a352f11'),
    title: 'In hac',
    content: 'In hac habitasse platea dictumst.',
    owner: users[2]._id,
    access: {
      read: 'public',
      write: 'private',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  },
  {
    _id: mongoose.mongo.ObjectId('57751fd9dbc59f1c0d04599f'),
    title: 'Fusce convallis',
    content: 'Fusce convallis metus id felis luctus adipiscing.',
    owner: users[2]._id,
    access: {
      read: 'public',
      write: 'private',
    },
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    updatedAt: new Date(),
    __v: 0,
  },
  {
    _id: mongoose.mongo.ObjectId('577521f9dbc59f1c0d0459a0'),
    title: 'Sed augue ipsum',
    content: 'Sed augue ipsum, egestas nec, vestibulum et.',
    owner: users[2]._id,
    access: {
      read: 'public',
      write: 'private',
    },
    createdAt: new Date(Date.now() - 18000000), // 5 hours ago
    updatedAt: new Date(),
    __v: 0,
  },
];
