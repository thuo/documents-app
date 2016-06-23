const request = require('supertest');
const app = require('../../server/app');
require('./helpers/database');

describe('Roles', () => {
  describe('GET /roles', () => {
    it('doesn\'t exist', (done) => {
      request(app)
        .get('/api/roles')
        .expect(404, done);
    });
  });
});
