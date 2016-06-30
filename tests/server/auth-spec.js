const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../server/app');
const users = require('./helpers/seeds/users');
require('./helpers/database');

describe('Login API endpoint', () => {
  describe('POST /login', () => {
    it('returns a token', (done) => {
      request(app)
        .post('/api/login')
        .send({
          email: users[0].email,
          password: 'raboof',
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('requires email to be provided', (done) => {
      request(app)
        .post('/api/login')
        .send({ password: 'raboof' })
        .expect(400)
        .end((err, res) => {
          expect(res.body.error).to.equal('Email is required');
          done();
        });
    });

    it('requires password to be provided', (done) => {
      request(app)
        .post('/api/login')
        .send({ email: users[0].email })
        .expect(400)
        .end((err, res) => {
          expect(res.body.error).to.equal('Password is required');
          done();
        });
    });

    it('requires email that belongs to existing user', (done) => {
      request(app)
        .post('/api/login')
        .send({ email: 'example@example.com', password: 'raboof' })
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).to.equal("Email doesn't match any user");
          done();
        });
    });

    it('only returns token if the password matches the email', (done) => {
      request(app)
        .post('/api/login')
        .send({
          email: users[0].email,
          password: 'password',
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).to.equal("Email and password don't match");
          done();
        });
    });
  });

  describe('DELETE /login', () => {
    it('is not allowed', (done) => {
      request(app)
        .delete('/api/login')
        .expect(405)
        .end((err, res) => {
          expect(res.body.error)
            .to.contain('Method `DELETE` not allowed on resource');
          done();
        });
    });
  });
});
