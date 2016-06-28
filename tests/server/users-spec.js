const request = require('supertest');
const expect = require('chai').expect;
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
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('is only accessible to admins', (done) => {
      request(app)
        .get('/api/users')
        .set('X-Access-Token', tokens.user)
        .expect(403)
        .end((err, res) => {
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
        .expect(201)
        .end((err, res) => {
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
        .expect(409)
        .end((err, res) => {
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
        .expect(409)
        .end((err, res) => {
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
        .expect(400)
        .end((err, res) => {
          expect(res.body.error).to.contain('User validation failed');
          expect(res.body.messages).to.contain.all.keys('email', 'username');
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('returns user', (done) => {
      request(app)
        .get(`/api/users/${users[0]._id}`)
        .expect(200)
        .end((err, res) => {
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
        .expect(400)
        .end((err, res) => {
          expect(res.body.error).to.contain('is not a valid resource id');
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
        .expect(200)
        .end((err, res) => {
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
        .expect(403)
        .end((err, res) => {
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
        .expect(400)
        .end((err, res) => {
          expect(res.body.error).to.equal('Old password is required');
          done();
        });
    });

    it('requires the the new password', (done) => {
      request(app)
        .put(`/api/users/${users[2]._id}/password`)
        .set('X-Access-Token', tokens.user)
        .send({ old_password: 'raboof' })
        .expect(400)
        .end((err, res) => {
          expect(res.body.error).to.contain('User validation failed');
          expect(res.body.messages).to.contain.all.keys('password');
          done();
        });
    });

    it('only allows to change their own passwords', (done) => {
      request(app)
        .put(`/api/users/${users[2]._id}/password`)
        .set('X-Access-Token', tokens.admin)
        .send({ old_password: 'raboof', password: 'drowssap' })
        .expect(403)
        .end((err, res) => {
          expect(res.body.error).to.contain("User id in token doesn't match");
          done();
        });
    });

    it('changes the password', (done) => {
      request(app)
        .put(`/api/users/${users[2]._id}/password`)
        .set('X-Access-Token', tokens.user)
        .send({ old_password: 'raboof', password: 'drowssap' })
        .expect(200)
        .end((err, res) => {
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
        .send()
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.contain('User deleted.');
          done();
        });
    });

    it('restricts user from deleting another user', (done) => {
      request(app)
        .delete(`/api/users/${users[1]._id}`)
        .set('X-Access-Token', tokens.user)
        .send()
        .expect(403)
        .end((err, res) => {
          expect(res.body.error).to.contain("User id in token doesn't match");
          done();
        });
    });
  });
});
