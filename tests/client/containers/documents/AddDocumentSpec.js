import { expect } from 'chai';
import sinon from 'sinon';
import * as AddDocument from 'app/containers/documents/AddDocument';

describe('AddDocument', () => {
  describe('validate', () => {
    it('validates', () => {
      expect(AddDocument.validate({
        title: 'title',
        content: 'content',
      })).to.eql({});
      expect(AddDocument.validate({})).to.eql({
        title: 'Required',
        content: 'Required',
      });
    });
  });

  describe('submit', () => {
    it('adds document', (done) => {
      const context = {
        props: {
          addDocument: sinon.spy(() => Promise.resolve()),
          pushToHistory: sinon.spy(() => Promise.resolve()),
          document: 1,
        },
      };
      const values = {
        title: 'title',
        content: 'content',
      };
      AddDocument.submit(values, context).then(() => {
        expect(
          context.props.addDocument.withArgs(values).calledOnce
        ).to.be.true;
        expect(
          context.props.pushToHistory.withArgs('/documents/1').calledOnce
        ).to.be.true;
      }).then(done, done);
    });

    it('calls showSnackbar when there is an error', (done) => {
      const context = {
        props: {
          addDocument: sinon.spy(() => Promise.resolve()),
          error: { error: 'error' },
        },
        showSnackbar: sinon.spy(),
      };
      const values = {
        title: 'title',
        content: 'content',
      };
      AddDocument.submit(values, context).catch(() => {
        expect(
          context.props.addDocument.withArgs(values).calledOnce
        ).to.be.true;
        expect(
          context.showSnackbar.withArgs(context.props.error.error).calledOnce
        ).to.be.true;
      }).then(done, done);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      expect(AddDocument.mapStateToProps({
        addDocument: { error: 'error', loading: false },
      })).to.eql({ error: 'error', loading: false });
    });
  });
});
