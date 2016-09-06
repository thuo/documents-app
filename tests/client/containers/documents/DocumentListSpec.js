import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DocumentList,
  mapStateToProps,
  __RewireAPI__ as RewireAPI,
} from 'app/containers/documents/DocumentList';

describe('DocumentList container', () => {
  describe('DocumentList', () => {
    const DocumentListItem = () => <div></div>;

    before(() => {
      RewireAPI.__Rewire__('DocumentListItem', DocumentListItem);
    });

    after(() => {
      RewireAPI.__ResetDependency__('DocumentListItem');
    });

    it('calls fetchDocuments', () => {
      const props = {
        fetchDocuments: sinon.spy(),
        error: 'Oops!',
      };
      mount(<DocumentList {...props} />);
      expect(props.fetchDocuments.calledOnce).to.be.true;
    });

    it('renders an error when passed', () => {
      const props = {
        fetchDocuments: sinon.spy(),
        error: 'Oops!',
      };
      const wrapper = mount(<DocumentList {...props} />);
      expect(wrapper.find('AppError')).to.have.length(1);
      expect(wrapper.find('AppError').text()).to.contain(props.error);
    });

    it('renders an spinner when loading', () => {
      const props = {
        fetchDocuments: sinon.spy(),
        loading: true,
      };
      const wrapper = mount(<DocumentList {...props} />);
      expect(wrapper.find('Spinner')).to.have.length(1);
    });

    it('renders heading', () => {
      const props = {
        fetchDocuments: sinon.spy(),
        documents: [
          { _id: '1', title: 'lorem' },
        ],
        accessFilter: 'public',
        searchFilter: 'lorem',
        setDocumentsSearchFilter: sinon.spy(),
        setDocumentsAccessFilter: sinon.spy(),
      };
      const wrapper = mount(<DocumentList {...props} />);
      const heading = wrapper.find('DocumentListHeading');
      expect(heading).to.have.length(1);
      expect(heading.prop('accessFilter')).to.equal(props.accessFilter);
      heading.prop('setAccessFilter')('');
      expect(
        props.setDocumentsAccessFilter.withArgs('').calledOnce
      ).to.be.true;
    });

    it('renders the documents', () => {
      const props = {
        fetchDocuments: sinon.spy(),
        documents: [
          { _id: '1', title: 'lorem' },
        ],
        accessFilter: 'public',
        searchFilter: 'lorem',
        setDocumentsSearchFilter: sinon.spy(),
        setDocumentsAccessFilter: sinon.spy(),
        pushToHistory: sinon.spy(),
      };
      const wrapper = mount(<DocumentList {...props} />);
      expect(wrapper.find(DocumentListItem)).to.have.length(1);
      expect(
        wrapper.find(DocumentListItem).prop('doc')
      ).to.eql(props.documents[0]);
      wrapper.find(DocumentListItem).prop('onDocumentClick')('1');
      expect(
        props.pushToHistory.withArgs('/documents/1').calledOnce
      ).to.be.true;
    });

    it('renders a FAB button', () => {
      const props = {
        fetchDocuments: sinon.spy(),
        documents: [
          { _id: '1', title: 'lorem' },
        ],
        accessFilter: 'public',
        searchFilter: 'lorem',
        setDocumentsSearchFilter: sinon.spy(),
        setDocumentsAccessFilter: sinon.spy(),
        pushToHistory: sinon.spy(),
      };
      const wrapper = mount(<DocumentList {...props} />);
      expect(wrapper.find('FABButton')).to.have.length(1);
      wrapper.find('FABButton').simulate('click');
      expect(
        props.pushToHistory.withArgs('/documents/add').calledOnce
      ).to.be.true;
    });
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      const state = {
        documentList: {
          documents: [1, 2],
          error: null,
          loading: false,
          accessFilter: '',
          searchFilter: 'title',
        },
        entities: {
          documents: {
            1: {
              _id: 1,
              title: 'title',
              owner: 1,
              access: { read: 'public' },
            },
            2: {
              _id: 2,
              title: 'lorem',
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
      const expectedProps = {
        documents: [{
          _id: 1,
          title: 'title',
          access: { read: 'public' },
          owner: {
            _id: 1,
            username: 'user',
          },
        }],
        error: null,
        loading: false,
        accessFilter: '',
      };
      expect(mapStateToProps(state)).to.eql(expectedProps);
    });
  });
});
