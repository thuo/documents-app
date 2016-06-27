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

    it('requires email to be provided', (done) => {
      request(app)
        .post('/api/login')
        .send({ password: 'raboof' })
        .expect(400, done);
    });

    it('requires password to be provided', (done) => {
      request(app)
        .post('/api/login')
        .send({ email: users[0].email })
        .expect(400, done);
    });

    it('requires email that belongs to existing user', (done) => {
      request(app)
        .post('/api/login')
        .send({ email: 'example@example.com', password: 'raboof' })
        .expect(401, done);
    });

    it('only returns token if the password matches the email', (done) => {
      request(app)
        .post('/api/login')
        .send({
          email: users[0].email,
          password: 'password',
        })
        .expect(401, done);
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
