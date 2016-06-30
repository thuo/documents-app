const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../server/app');
const users = require('./helpers/seeds/users');
const token = require('./helpers/token');
require('./helpers/database');

describe('Roles API endpoint', () => {
  const tokens = {};

  before((done) => {
    tokens.admin = token.generate(users[0]);
    tokens.user = token.generate(users[1]);
    done();
  });

  describe('PUT users/:id/role', () => {
    it('only allows admins to assign roles', (done) => {
      request(app)
        .put(`/api/users/${users[1]._id}/role`)
        .set('X-Access-Token', tokens.user)
        .send({ role: 'user' })
        .expect(403)
        .end((err, res) => {
          expect(res.body.error).to.contain('Unauthorized. Requires admin.');
          done();
        });
    });

    it('restricts removal of a lone admin', (done) => {
      request(app)
        .put(`/api/users/${users[0]._id}/role`)
        .set('X-Access-Token', tokens.admin)
        .send({ role: 'user' })
        .expect(403)
        .end((err, res) => {
          expect(res.body.error)
            .to.contain("Unauthorized. Can't remove the only admin");
          done();
        });
    });

    it('only accepts valid roles', (done) => {
      request(app)
        .put(`/api/users/${users[1]._id}/role`)
        .set('X-Access-Token', tokens.admin)
        .send({ role: 'hacker' })
        .expect(400)
        .end((err, res) => {
          expect(res.body.error).to.contain('is not a valid role');
          done();
        });
    });

    it("updates user's role", (done) => {
      request(app)
        .put(`/api/users/${users[1]._id}/role`)
        .set('X-Access-Token', tokens.admin)
        .send({ role: 'admin' })
        .expect(200)
        .end((err, res) => {
          expect(res.body.role.title).to.equal('admin');
          done();
        });
    });
  });
});
