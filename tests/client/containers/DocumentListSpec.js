import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import mockStore from '../helpers/mockStore';
import {
  DocumentList, mapStateToProps, mapDispatchToProps,
} from 'app/containers/DocumentList';
import * as actions from 'app/actions';

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
        <DocumentList
          fetchDocuments={fetchDocuments}
          documents={documents}
        />
      );
      expect(fetchDocuments.calledOnce).to.be.true;
    });

    it('renders error', () => {
      const fetchDocuments = sinon.spy();
      mount(
        <DocumentList
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
        documents: ['documents'],
        error: {
          error: 'Oops!',
        },
      });
    });

    it('mapStateToProps', () => {
      const props = mapStateToProps(store.getState());
      expect(props).to.eql({
        documents: ['documents'],
        error: 'Oops!',
      });
    });

    it('mapDispatchToProps', () => {
      const props = mapDispatchToProps(store.dispatch);
      sinon.spy(actions, 'fetchDocuments');
      props.fetchDocuments().then(() => {
        expect(actions.fetchDocuments.calledOnce);
      });
    });
  });
});
