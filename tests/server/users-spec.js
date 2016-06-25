const request = require('supertest');
const app = require('../../server/app');
const users = require('./helpers/seeds/users');
const token = require('./helpers/token');
require('./helpers/database');

describe('Users', () => {
  const tokens = {};

  before((done) => {
    tokens.admin = token.generate(users[0]);
    tokens.user = token.generate(users[2]);
    done();
  });

  describe('GET /users', () => {
    it('returns an array of all users', (done) => {
      request(app)
        .get('/api/users')
        .set('X-Access-Token', tokens.admin)
        .expect(200, done);
    });

    it('is only accessible to admins', (done) => {
      request(app)
        .get('/api/users')
        .set('X-Access-Token', tokens.user)
        .expect(403, done);
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

    it('rejects usernames already in use', (done) => {
      request(app)
        .post('/api/users')
        .send({
          username: users[0].username,
          email: 'email@example.com',
          password: 'qazwsxedc',
          first_name: 'Foo',
          last_name: 'Bar',
        })
        .expect(409, done);
    });

    it('rejects emails already in use', (done) => {
      request(app)
        .post('/api/users')
        .send({
          username: 'qwerty',
          email: users[0].email,
          password: 'qazwsxedc',
          first_name: 'Foo',
          last_name: 'Bar',
        })
        .expect(409, done);
    });

    it('only accepts valid emails and usernames', (done) => {
      request(app)
        .post('/api/users')
        .send({
          username: '!@#$%^&*',
          email: '!@#$%^&*',
          password: 'qazwsxedc',
          first_name: 'Foo',
          last_name: 'Bar',
        })
        .expect(400, done);
    });
  });

  describe('GET /users/:id', () => {
    it('returns user', (done) => {
      request(app)
        .get(`/api/users/${users[0]._id}`)
        .expect(200, done);
    });

    it('only accepts valid user ids', (done) => {
      request(app)
        .get('/api/users/1')
        .expect(400, done);
    });
  });

  describe('PUT /users/:id', () => {
    it('updates user details', (done) => {
      request(app)
        .put(`/api/users/${users[0]._id}`)
        .set('X-Access-Token', tokens.admin)
        .send({
          first_name: 'Antman',
        })
        .expect(200, done);
    });

    it('restricts user from updating another user', (done) => {
      request(app)
        .put(`/api/users/${users[1]._id}`)
        .set('X-Access-Token', tokens.admin)
        .send({
          first_name: 'Antman',
        })
        .expect(403, done);
    });
  });

  describe('DELETE /users/:id', () => {
    it('deletes user', (done) => {
      request(app)
        .delete(`/api/users/${users[0]._id}`)
        .set('X-Access-Token', tokens.admin)
        .send()
        .expect(200, done);
    });

    it('restricts user from deleting another user', (done) => {
      request(app)
        .delete(`/api/users/${users[1]._id}`)
        .set('X-Access-Token', tokens.user)
        .send()
        .expect(403, done);
    });
  });
});
