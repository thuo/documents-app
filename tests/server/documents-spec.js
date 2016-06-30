const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../server/app');
const users = require('./helpers/seeds/users');
const documents = require('./helpers/seeds/documents');
const token = require('./helpers/token');
require('./helpers/database');

describe('Documents API endpoints', () => {
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
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.every((doc) =>
            doc.access.read === 'public'
          )).to.be.true;
          done();
        });
    });

    it('returns a limited array of documents skipping some', (done) => {
      request(app)
        .get('/api/documents?skip=1&limit=1')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.lengthOf(1);
          expect(res.body.every((doc) =>
            doc.access.read === 'public'
          )).to.be.true;
          done();
        });
    });
  });

  describe('GET /users/:userId/documents', () => {
    it('returns an array of all documents owned by a user', (done) => {
      request(app)
        .get(`/api/users/${users[0]._id}/documents`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.every((doc) =>
            doc.access.read === 'public'
            && doc.owner._id === users[0]._id.toString()
          )).to.be.true;
          done();
        });
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
        .expect(201)
        .end((err, res) => {
          expect(res.body.title).to.equal('Another test');
          expect(res.body.content).to.equal('This is a test.');
          expect(res.body.owner._id).to.equal(users[2]._id.toString());
          expect(new Date(res.body.createdAt).getTime()).to.not.be.NaN;
          done();
        });
    });

    it('requires authentication', (done) => {
      request(app)
        .post('/api/documents')
        .send({
          title: 'Test',
          content: 'This is a test.',
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).to.equal('No token provided.');
          done();
        });
    });

    it('only accepts unique titles', (done) => {
      request(app)
        .post('/api/documents')
        .set('X-Access-Token', tokens.user)
        .send({
          title: documents[0].title,
          content: 'This is a test.',
        })
        .expect(409)
        .end((err, res) => {
          expect(res.body.error).to
            .contain(`The title \`${documents[0].title}\` is already in use`);
          done();
        });
    });
  });

  describe('GET /documents/:documentId', () => {
    it('returns public document', (done) => {
      request(app)
        .get(`/api/documents/${documents[0]._id}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body._id).to.equal(documents[0]._id.toString());
          expect(res.body.access.read).to.equal('public');
          done();
        });
    });

    it('requires authentication if required', (done) => {
      request(app)
        .get(`/api/documents/${documents[1]._id}`)
        .expect(403)
        .end((err, res) => {
          expect(res.body.error).to.contain('Unauthorized');
          done();
        });
    });

    it('returns document if authentication is provided', (done) => {
      request(app)
        .get(`/api/documents/${documents[1]._id}`)
        .set('X-Access-Token', tokens.user)
        .expect(200)
        .end((err, res) => {
          expect(res.body._id).to.equal(documents[1]._id.toString());
          expect(res.body.access.read).to.match(/^(private)|(authenticated)$/);
          done();
        });
    });

    it("doesn't return private document to non-owners", (done) => {
      request(app)
        .get(`/api/documents/${documents[2]._id}`)
        .set('X-Access-Token', tokens.admin)
        .expect(403)
        .end((err, res) => {
          expect(res.body.error).to.contain('Unauthorized');
          done();
        });
    });

    it('returns private document to owner', (done) => {
      request(app)
        .get(`/api/documents/${documents[2]._id}`)
        .set('X-Access-Token', tokens.user)
        .expect(200)
        .end((err, res) => {
          expect(res.body._id).to.equal(documents[2]._id.toString());
          expect(res.body.access.read).to.equal('private');
          done();
        });
    });
  });

  describe('PUT /documents/:documentId', () => {
    it('requires authentication if required', (done) => {
      request(app)
        .put(`/api/documents/${documents[0]._id}`)
        .send({ title: 'New title' })
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).to.contain('No token provided.');
          done();
        });
    });

    it('updates document if authentication is provided', (done) => {
      request(app)
        .put(`/api/documents/${documents[0]._id}`)
        .set('X-Access-Token', tokens.user)
        .send({ title: 'New title' })
        .expect(200)
        .end((err, res) => {
          expect(res.body._id).to.equal(documents[0]._id.toString());
          expect(res.body.title).to.equal('New title');
          done();
        });
    });

    it("doesn't allow non-owners to update private document", (done) => {
      request(app)
        .put(`/api/documents/${documents[2]._id}`)
        .set('X-Access-Token', tokens.admin)
        .send({ title: 'New title' })
        .expect(403)
        .end((err, res) => {
          expect(res.body.error).to.contain('Unauthorized');
          done();
        });
    });

    it('allows owner to update private document', (done) => {
      request(app)
        .put(`/api/documents/${documents[2]._id}`)
        .set('X-Access-Token', tokens.user)
        .send({ title: 'No title' })
        .expect(200)
        .end((err, res) => {
          expect(res.body._id).to.equal(documents[2]._id.toString());
          expect(res.body.title).to.equal('No title');
          done();
        });
    });
  });

  describe('PUT /documents/:documentId/access', () => {
    it("doesn't allow non-owners to update document access", (done) => {
      request(app)
        .put(`/api/documents/${documents[3]._id}/access`)
        .set('X-Access-Token', token.generate(users[1]))
        .send({ read_access: 'authenticated', write_access: 'authenticated' })
        .expect(403)
        .end((err, res) => {
          expect(res.body.error).to.contain('Unauthorized');
          done();
        });
    });

    it('allows owner to delete document access settings', (done) => {
      request(app)
        .put(`/api/documents/${documents[3]._id}/access`)
        .set('X-Access-Token', tokens.user)
        .send({ read_access: 'authenticated', write_access: 'authenticated' })
        .expect(200)
        .end((err, res) => {
          expect(res.body._id).to.equal(documents[3]._id.toString());
          expect(res.body.access.read).to.equal('authenticated');
          expect(res.body.access.write).to.equal('authenticated');
          done();
        });
    });
  });

  describe('DELETE /documents/:documentId', () => {
    it("doesn't allow non-owners to delete document", (done) => {
      request(app)
        .delete(`/api/documents/${documents[3]._id}`)
        .set('X-Access-Token', token.generate(users[1]))
        .expect(403)
        .end((err, res) => {
          expect(res.body.error).to.contain('Unauthorized');
          done();
        });
    });

    it('allows owner to delete document', (done) => {
      request(app)
        .delete(`/api/documents/${documents[3]._id}`)
        .set('X-Access-Token', tokens.user)
        .expect(200)
        .end((err, res) => {
          expect(res.body.message).to.equal('Document deleted.');
          done();
        });
    });
  });
});
