import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import mockStore from '../helpers/mockStore';
import * as DocumentList from 'app/containers/documents/DocumentList';

describe('DocumentList container', () => {
  describe('DocumentList', () => {
    it('renders documents', () => {
      const fetchDocuments = sinon.spy();
      const pushToHistory = sinon.spy();
      const store = mockStore({});
      const documents = [{
        _id: '1',
        title: 'doc',
        content: 'document',
        owner: {
          _id: '1',
          name: {
            first: 'Name',
            last: 'Name',
          },
        },
        access: {},
      }];
      mount(
        <Provider store={store}>
          <DocumentList.DocumentList
            fetchDocuments={fetchDocuments}
            documents={documents}
            pushToHistory={pushToHistory}
          />
        </Provider>
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

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      const state = {
        documentList: {
          documents: [1], error: null, loading: false,
          accessFilter: '', searchFilter: '',
        },
        entities: {
          documents: {
            1: {
              _id: 1,
              title: 'title',
              owner: 1,
            },
          },
          users: {
            1: {
              _id: 1,
              username: 'user',
            },
          },
        },
      };
      const expectedProps = {
        documents: [{
          _id: 1,
          title: 'title',
          owner: {
            _id: 1,
            username: 'user',
          },
        }],
        error: null,
        loading: false,
        accessFilter: '', searchFilter: '',
      };
      expect(DocumentList.mapStateToProps(state)).to.eql(expectedProps);
    });
  });
});
