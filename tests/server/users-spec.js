const request = require('supertest');
const app = require('../../server/app');
const usersSeed = require('./helpers/seeds/users');
const config = require('../../server/config');
const jwt = require('jsonwebtoken');
require('./helpers/database');


describe('Users', () => {
  let token;

  before((done) => {
    token = jwt.sign(JSON.stringify({
      _id: usersSeed[0]._id,
      email: usersSeed[0].email,
      username: usersSeed[0].username,
      name: usersSeed[0].name,
    }), config.secretKey);
    done();
  });

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

    it('rejects usernames already in use', (done) => {
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

    it('rejects emails already in use', (done) => {
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
    it('updates user details', (done) => {
      request(app)
        .get(`/api/users/${usersSeed[0]._id}`)
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
        .put(`/api/users/${usersSeed[0]._id}`)
        .set('X-Access-Token', token)
        .send({
          first_name: 'Antman',
        })
        .expect(200, done);
    });

    it('restricts user from updating another user', (done) => {
      request(app)
        .put(`/api/users/${usersSeed[1]._id}`)
        .set('X-Access-Token', token)
        .send({
          first_name: 'Antman',
        })
        .expect(403, done);
    });
  });

  describe('DELETE /users/:id', () => {
    it('deletes user', (done) => {
      request(app)
        .delete(`/api/users/${usersSeed[0]._id}`)
        .set('X-Access-Token', token)
        .send()
        .expect(200, done);
    });

    it('restricts user from deleting another user', (done) => {
      request(app)
        .delete(`/api/users/${usersSeed[1]._id}`)
        .set('X-Access-Token', token)
        .send()
        .expect(403, done);
    });
  });
});
