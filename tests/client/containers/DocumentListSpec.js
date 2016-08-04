import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import mockStore from '../helpers/mockStore';
import * as DocumentList from 'app/containers/DocumentList';
import * as actions from 'app/actions/DocumentActions';

describe('DocumentList container', () => {
  describe('DocumentList', () => {
    it('renders documents', () => {
      const fetchDocuments = sinon.spy();
      const documents = [{
        _id: 1,
        title: 'doc',
        content: 'document',
      }];
      mount(
        <DocumentList.DocumentList
          fetchDocuments={fetchDocuments}
          documents={documents}
        />
      );
      expect(fetchDocuments.calledOnce).to.be.true;
    });

    it('renders error', () => {
      const fetchDocuments = sinon.spy();
      mount(
        <DocumentList.DocumentList
          fetchDocuments={fetchDocuments}
          error="Oops!"
        />
      );
      expect(fetchDocuments.calledOnce).to.be.true;
    });
  });

  describe('mapStateToProps and mapDispatchToProps', () => {
    let store;
    beforeEach(() => {
      store = mockStore({
        documents: {
          list: ['documents'],
          error: 'Oops!',
        },
      });
    });

    it('mapStateToProps', () => {
      const props = DocumentList.mapStateToProps(store.getState());
      expect(props).to.eql({
        documents: ['documents'],
        error: 'Oops!',
      });
    });

    it('mapDispatchToProps', () => {
      const props = DocumentList.mapDispatchToProps(store.dispatch);
      sinon.spy(actions, 'fetchDocuments');
      props.fetchDocuments().then(() => {
        expect(actions.fetchDocuments.calledOnce);
      });
    });
  });
});
