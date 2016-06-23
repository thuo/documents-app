const request = require('supertest');
const app = require('../../server/app');
const usersSeed = require('./helpers/seeds/users');
require('./helpers/database');

describe('Login', () => {
  describe('POST /login', () => {
    it('returns a token', (done) => {
      request(app)
        .post('/api/login')
        .send({
          email: usersSeed[0].email,
          password: 'raboof',
        })
        .expect(200, done);
    });
  });
});
