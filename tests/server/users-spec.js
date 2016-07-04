const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../server/app');
const users = require('./helpers/seeds/users');
const token = require('./helpers/token');
require('./helpers/database');

describe('Users API endpoints', () => {
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
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('is only accessible to admins', (done) => {
      request(app)
        .get('/api/users')
        .set('X-Access-Token', tokens.user)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.contain('Unauthorized. Requires admin.');
          done();
        });
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
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.username).to.equal('username');
          expect(res.body.email).to.equal('example@example.com');
          expect(res.body.name.first).to.equal('Foo');
          expect(res.body.name.last).to.equal('Bar');
          done();
        });
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
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.error).to.contain('already in use');
          done();
        });
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
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.error).to.contain('already in use');
          done();
        });
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
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.contain('User validation failed');
          expect(res.body.messages).to.contain.all.keys('email', 'username');
          expect(res.body.messages.email).to
            .contain('not a valid email address');
          expect(res.body.messages.username).to
            .contain('A username can only contain alphanumeric characters ' +
               'or an underscore');
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('returns user', (done) => {
      request(app)
        .get(`/api/users/${users[0]._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(users[0]._id.toString());
          expect(res.body.username).to.equal(users[0].username);
          expect(res.body.email).to.equal(users[0].email);
          expect(res.body.name.first).to.equal(users[0].name.first);
          expect(res.body.name.last).to.equal(users[0].name.last);
          done();
        });
    });

    it('only accepts valid user ids', (done) => {
      request(app)
        .get('/api/users/1')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.contain('is not a valid resource id');
          done();
        });
    });

    it('returns an error for non-existent users', (done) => {
      request(app)
        .get('/api/users/576fbef00d0186116ecad619')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to
            .contain('576fbef00d0186116ecad619` not found');
          done();
        });
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
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(users[0]._id.toString());
          expect(res.body.name.first).to.equal('Antman');
          done();
        });
    });

    it('restricts user from updating another user', (done) => {
      request(app)
        .put(`/api/users/${users[1]._id}`)
        .set('X-Access-Token', tokens.admin)
        .send({
          first_name: 'Antman',
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.contain('Unauthorized');
          done();
        });
    });
  });

  describe('PUT users/:id/password', () => {
    it('requires the old password', (done) => {
      request(app)
        .put(`/api/users/${users[2]._id}/password`)
        .set('X-Access-Token', tokens.user)
        .send({ password: 'drowssap' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Old password is required');
          done();
        });
    });

    it('requires the the new password', (done) => {
      request(app)
        .put(`/api/users/${users[2]._id}/password`)
        .set('X-Access-Token', tokens.user)
        .send({ old_password: 'raboof' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.contain('User validation failed');
          expect(res.body.messages).to.contain.all.keys('password');
          done();
        });
    });

    it('only allows users to change their own passwords', (done) => {
      request(app)
        .put(`/api/users/${users[2]._id}/password`)
        .set('X-Access-Token', tokens.admin)
        .send({ old_password: 'raboof', password: 'drowssap' })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.contain("User id in token doesn't match");
          done();
        });
    });

    it('requires the correct old password', (done) => {
      request(app)
        .put(`/api/users/${users[2]._id}/password`)
        .set('X-Access-Token', tokens.user)
        .send({ old_password: 'password', password: 'drowssap' })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.contain('Incorrect old password');
          done();
        });
    });

    it('changes the password', (done) => {
      request(app)
        .put(`/api/users/${users[2]._id}/password`)
        .set('X-Access-Token', tokens.user)
        .send({ old_password: 'raboof', password: 'drowssap' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(users[2]._id.toString());
          done();
        });
    });
  });

  describe('DELETE /users/:id', () => {
    it('deletes user', (done) => {
      request(app)
        .delete(`/api/users/${users[0]._id}`)
        .set('X-Access-Token', tokens.admin)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.contain('User deleted.');
          done();
        });
    });

    it('restricts user from deleting another user', (done) => {
      request(app)
        .delete(`/api/users/${users[1]._id}`)
        .set('X-Access-Token', tokens.user)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.contain("User id in token doesn't match");
          done();
        });
    });

    it("doesn't allow deletion of a lone admin", (done) => {
      request(app)
        .delete(`/api/users/${users[1]._id}`)
        .set('X-Access-Token', token.generate(users[1]))
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.contain("Can't delete the only admin");
          done();
        });
    });
  });
});
