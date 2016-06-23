const request = require('supertest');
const app = require('../../server/app');
const usersSeed = require('./helpers/seeds/users');
require('./helpers/database');

describe('Users', () => {
  describe('GET /users', () => {
    it('returns an array of all users', (done) => {
      request(app)
        .get('/api/users')
        .expect(200, done);
    });
  });

  describe('POST /users', () => {
    it('adds a user', (done) => {
      request(app)
        .post('/api/users')
        .send({
          username: 'username',
          email: 'example@example.com',
          password: 'qazwsxedc',
          first_name: 'Foo',
          last_name: 'Bar',
        })
        .expect(201, done);
    });

    it('doesn\'t add a user with a username already in use', (done) => {
      request(app)
        .post('/api/users')
        .send({
          username: usersSeed[0].username,
          email: 'email@example.com',
          password: 'qazwsxedc',
          first_name: 'Foo',
          last_name: 'Bar',
        })
        .expect(409, done);
    });

    it('doesn\'t add a user with an email already in use', (done) => {
      request(app)
        .post('/api/users')
        .send({
          username: 'qwerty',
          email: usersSeed[0].email,
          password: 'qazwsxedc',
          first_name: 'Foo',
          last_name: 'Bar',
        })
        .expect(409, done);
    });

    it('validates request', (done) => {
      request(app)
        .post('/api/users')
        .send({
          username: '$%^&@#',
          email: 'invalid email',
          password: 'qazwsxedc',
          first_name: 'Foo',
          last_name: 'Bar',
        })
        .expect(400, done);
    });
  });

  describe('PUT /users/:id', () => {
    it('updates user details', (done) => {
      /* eslint-disable no-underscore-dangle */
      request(app)
        .put(`/api/users/${usersSeed[0]._id}`)
        .send({
          first_name: 'Antman',
        })
        .expect(200, done);
    });
  });

  describe('DELETE /users/:id', () => {
    it('deletes user', (done) => {
      /* eslint-disable no-underscore-dangle */
      request(app)
        .delete(`/api/users/${usersSeed[0]._id}`)
        .send()
        .expect(200, done);
    });
  });
});
