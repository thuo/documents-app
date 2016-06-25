const request = require('supertest');
const app = require('../../server/app');
const users = require('./helpers/seeds/users');
require('./helpers/database');

describe('Login', () => {
  describe('POST /login', () => {
    it('returns a token', (done) => {
      request(app)
        .post('/api/login')
        .send({
          email: users[0].email,
          password: 'raboof',
        })
        .expect(200, done);
    });
  });

  describe('DELETE /login', () => {
    it('is not allowed', (done) => {
      request(app)
        .get('/api/login')
        .expect(405, done);
    });
  });
});
