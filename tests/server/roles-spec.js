const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../server/app');
const Role = require('../../server/models/role');
const users = require('./helpers/seeds/users');
const roles = require('./helpers/seeds/roles');
const token = require('./helpers/token');
require('./helpers/database');

describe('Roles', () => {
  describe('Model', () => {
    it('only accepts unique titles', (done) => {
      Role.create({ title: roles[0].title }, (err, role) => {
        expect(err).to.exist;
        expect(err.name).to.equal('MongoError');
        expect(err.message).to.contain('duplicate key');
        expect(role).to.not.exist;
        done();
      });
    });
  });

  describe('API endpoints', () => {
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
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body.error).to.contain('Unauthorized. Requires admin.');
            done();
          });
      });

      it('restricts removal of a lone admin', (done) => {
        request(app)
          .put(`/api/users/${users[0]._id}/role`)
          .set('X-Access-Token', tokens.admin)
          .send({ role: 'user' })
          .end((err, res) => {
            expect(res.status).to.equal(403);
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
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.contain('is not a valid role');
            done();
          });
      });

      it("updates user's role", (done) => {
        request(app)
          .put(`/api/users/${users[1]._id}/role`)
          .set('X-Access-Token', tokens.admin)
          .send({ role: 'admin' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.role.title).to.equal('admin');
            done();
          });
      });
    });

    describe('GET roles', () => {
      it('returns an array of all roles', (done) => {
        request(app)
          .get('/api/roles')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.every((role) => role.title)).to.be.true;
            done();
          });
      });
    });

    describe('GET roles/:id', () => {
      it('returns a role', (done) => {
        request(app)
          .get(`/api/roles/${roles[0]._id}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body._id).to.equal(roles[0]._id.toString());
            expect(res.body.title).to.equal(roles[0].title);
            done();
          });
      });

      it("returns error if the role doesn't exist", (done) => {
        request(app)
          .get(`/api/roles/${users[0]._id}`)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.contain('not found');
            done();
          });
      });
    });

    describe('PUT roles/:id', () => {
      it('updates a role', (done) => {
        request(app)
          .put(`/api/roles/${roles[0]._id}`)
          .set('X-Access-Token', tokens.admin)
          .send({ description: 'Administrator' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body._id).to.equal(roles[0]._id.toString());
            expect(res.body.title).to.equal(roles[0].title);
            expect(res.body.description).to.equal('Administrator');
            done();
          });
      });

      it('only allows admins to update role', (done) => {
        request(app)
          .put(`/api/roles/${roles[0]._id}`)
          .set('X-Access-Token', token.generate(users[2]))
          .send({ description: 'Administrator' })
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body.error).to.contain('Requires admin');
            done();
          });
      });

      it('returns an error for non-existent roles', (done) => {
        request(app)
          .put('/api/roles/576fbef00d0186116ecad619')
          .set('X-Access-Token', tokens.admin)
          .send({ description: 'Administrator' })
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to
              .contain('576fbef00d0186116ecad619` not found');
            done();
          });
      });
    });

    describe('GET roles/:id/users', () => {
      it('returns all users with a certain role', (done) => {
        request(app)
          .get(`/api/roles/${roles[0]._id}/users`)
          .set('X-Access-Token', tokens.admin)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.every(
              (user) => user.role.title === roles[0].title)
            ).to.be.true;
            done();
          });
      });

      it('only accessible to admins', (done) => {
        request(app)
          .get(`/api/roles/${roles[0]._id}/users`)
          .set('X-Access-Token', token.generate(users[2]))
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body.error).to.contain('Requires admin');
            done();
          });
      });
    });
  });
});
