import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DocumentList,
  mapStateToProps,
  __RewireAPI__ as DocumentListRewireAPI,
} from 'app/containers/documents/DocumentList';

describe('DocumentList container', () => {
  describe('DocumentList', () => {
    before(() => {
      DocumentListRewireAPI.__Rewire__('DocumentListItem', () => <div></div>);
    });

    after(() => {
      DocumentListRewireAPI.__ResetDependency__('DocumentListItem');
    });

    it('renders documents', () => {
      const fetchDocuments = sinon.spy();
      const pushToHistory = sinon.spy();
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
        <DocumentList
          fetchDocuments={fetchDocuments}
          documents={documents}
          pushToHistory={pushToHistory}
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
      expect(mapStateToProps(state)).to.eql(expectedProps);
    });
  });
});
