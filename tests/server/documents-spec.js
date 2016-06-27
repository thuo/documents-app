const request = require('supertest');
const app = require('../../server/app');
const users = require('./helpers/seeds/users');
const documents = require('./helpers/seeds/documents');
const token = require('./helpers/token');
require('./helpers/database');

describe('Documents', () => {
  const tokens = {};

  before((done) => {
    tokens.admin = token.generate(users[0]);
    tokens.user = token.generate(users[2]);
    done();
  });

  describe('GET /documents', () => {
    it('returns an array of all documents', (done) => {
      request(app)
        .get('/api/documents')
        .expect(200, done);
    });

    it('returns a limited array of documents skipping some', (done) => {
      request(app)
        .get('/api/documents?skip=1&limit=1')
        .expect(200, done);
    });
  });

  describe('GET /users/:userId/documents', () => {
    it('returns an array of all documents owned by a user', (done) => {
      request(app)
        .get(`/api/users/${users[0]._id}/documents`)
        .expect(200, done);
    });
  });

  describe('POST /documents', () => {
    it('creates document', (done) => {
      request(app)
        .post('/api/documents')
        .set('X-Access-Token', tokens.user)
        .send({
          title: 'Another test',
          content: 'This is a test.',
        })
        .expect(201, done);
    });

    it('requires authentication', (done) => {
      request(app)
        .post('/api/documents')
        .send({
          title: 'Test',
          content: 'This is a test.',
        })
        .expect(401, done);
    });

    it('only accepts unique titles', (done) => {
      request(app)
        .post('/api/documents')
        .set('X-Access-Token', tokens.user)
        .send({
          title: documents[0].title,
          content: 'This is a test.',
        })
        .expect(409, done);
    });
  });

  describe('GET /documents/:documentId', () => {
    it('returns public document', (done) => {
      request(app)
        .get(`/api/documents/${documents[0]._id}`)
        .expect(200, done);
    });

    it('requires authentication if required', (done) => {
      request(app)
        .get(`/api/documents/${documents[1]._id}`)
        .expect(403, done);
    });

    it('returns document if authentication is provided', (done) => {
      request(app)
        .get(`/api/documents/${documents[1]._id}`)
        .set('X-Access-Token', tokens.user)
        .expect(200, done);
    });

    it("doesn't return private document to non-owners", (done) => {
      request(app)
        .get(`/api/documents/${documents[2]._id}`)
        .set('X-Access-Token', tokens.admin)
        .expect(403, done);
    });

    it('returns private document to owner', (done) => {
      request(app)
        .get(`/api/documents/${documents[2]._id}`)
        .set('X-Access-Token', tokens.user)
        .expect(200, done);
    });
  });

  describe('PUT /documents/:documentId', () => {
    it('requires authentication if required', (done) => {
      request(app)
        .put(`/api/documents/${documents[0]._id}`)
        .send({ title: 'New title' })
        .expect(401, done);
    });

    it('updates document if authentication is provided', (done) => {
      request(app)
        .put(`/api/documents/${documents[0]._id}`)
        .set('X-Access-Token', tokens.user)
        .send({ title: 'New title' })
        .expect(200, done);
    });

    it("doesn't allow non-owners to update private document", (done) => {
      request(app)
        .put(`/api/documents/${documents[2]._id}`)
        .set('X-Access-Token', tokens.admin)
        .send({ title: 'New title' })
        .expect(403, done);
    });

    it('allows owner to update private document', (done) => {
      request(app)
        .put(`/api/documents/${documents[2]._id}`)
        .set('X-Access-Token', tokens.user)
        .send({ title: 'No title' })
        .expect(200, done);
    });
  });

  describe('PUT /documents/:documentId/access', () => {
    it("doesn't allow non-owners to update document access settings", (done) => {
      request(app)
        .put(`/api/documents/${documents[3]._id}/access`)
        .set('X-Access-Token', token.generate(users[1]))
        .send({ read: 'authenticated', write: 'authenticated' })
        .expect(403, done);
    });

    it('allows owner to delete document access settings', (done) => {
      request(app)
        .put(`/api/documents/${documents[3]._id}/access`)
        .set('X-Access-Token', tokens.user)
        .send({ read: 'authenticated', write: 'authenticated' })
        .expect(200, done);
    });
  });

  describe('DELETE /documents/:documentId', () => {
    it("doesn't allow non-owners to delete document", (done) => {
      request(app)
        .delete(`/api/documents/${documents[3]._id}`)
        .set('X-Access-Token', token.generate(users[1]))
        .expect(403, done);
    });

    it('allows owner to delete document', (done) => {
      request(app)
        .delete(`/api/documents/${documents[3]._id}`)
        .set('X-Access-Token', tokens.user)
        .expect(200, done);
    });
  });
});
