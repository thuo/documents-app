import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DocumentList as UserDocumentList,
  mapStateToProps,
  __RewireAPI__ as RewireAPI,
} from 'app/containers/users/UserDocumentList';

describe('UserDocumentList container', () => {
  describe('UserDocumentList', () => {
    const DocumentListItem = () => <div></div>;

    before(() => {
      RewireAPI.__Rewire__('DocumentListItem', DocumentListItem);
    });

    after(() => {
      RewireAPI.__ResetDependency__('DocumentListItem');
    });

    it('calls fetchUsersDocuments', () => {
      const props = {
        fetchUsersDocuments: sinon.spy(),
        error: 'Oops!',
        userId: '1',
      };
      mount(<UserDocumentList {...props} />);
      expect(props.fetchUsersDocuments.withArgs('1').calledOnce).to.be.true;
    });

    it('renders an error when passed', () => {
      const props = {
        fetchUsersDocuments: sinon.spy(),
        error: 'Oops!',
      };
      const wrapper = mount(<UserDocumentList {...props} />);
      expect(wrapper.find('AppError')).to.have.length(1);
      expect(wrapper.find('AppError').text()).to.contain(props.error);
    });

    it('renders an spinner when loading', () => {
      const props = {
        fetchUsersDocuments: sinon.spy(),
        loading: true,
      };
      const wrapper = mount(<UserDocumentList {...props} />);
      expect(wrapper.find('Spinner')).to.have.length(1);
    });

    it('renders the documents', () => {
      const props = {
        fetchUsersDocuments: sinon.spy(),
        documents: [
          { _id: '1', title: 'lorem' },
        ],
        pushHistory: sinon.spy(),
      };
      const wrapper = mount(<UserDocumentList {...props} />);
      expect(wrapper.find(DocumentListItem)).to.have.length(1);
      expect(
        wrapper.find(DocumentListItem).prop('doc')
      ).to.eql(props.documents[0]);
      wrapper.find(DocumentListItem).prop('onDocumentClick')('1');
      expect(
        props.pushHistory.withArgs('/documents/1').calledOnce
      ).to.be.true;
    });
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      const state = {
        documentsByUser: { 1: {
          documents: [1],
          error: null,
          loading: false,
        } },
        entities: {
          documents: {
            1: {
              _id: 1,
              title: 'title',
              owner: 1,
              access: { read: 'public' },
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
      const ownProps = {
        userId: 1,
      };
      const expectedProps = {
        documents: [{
          _id: 1,
          title: 'title',
          owner: {
            _id: 1,
            username: 'user',
          },
          access: { read: 'public' },
        }],
        error: null,
        loading: false,
      };
      expect(mapStateToProps(state, ownProps)).to.eql(expectedProps);
    });
  });
});
