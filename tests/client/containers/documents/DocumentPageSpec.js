import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DocumentPage,
  mapStateToProps,
  __RewireAPI__ as RewireAPI,
} from 'app/containers/documents/DocumentPage';

describe('DocumentPage container', () => {
  describe('DocumentPage', () => {
    const Document = () => <div></div>;

    before(() => {
      RewireAPI.__Rewire__('Document', Document);
    });

    after(() => {
      RewireAPI.__ResetDependency__('Document');
    });

    it('calls fetchDocumentIfNeeded', () => {
      const props = {
        fetchDocumentIfNeeded: sinon.spy(),
        params: { documentId: '1' },
      };
      mount(<DocumentPage {...props} />);
      expect(props.fetchDocumentIfNeeded.withArgs('1').calledOnce).to.be.true;
    });

    it('renders an error when passed', () => {
      const props = {
        fetchDocumentIfNeeded: sinon.spy(),
        error: 'Oops!',
        params: { documentId: '1' },
      };
      const wrapper = mount(<DocumentPage {...props} />);
      expect(wrapper.find('AppError')).to.have.length(1);
      expect(wrapper.find('AppError').text()).to.contain(props.error);
    });

    it('renders an spinner when loading', () => {
      const props = {
        fetchDocumentIfNeeded: sinon.spy(),
        loading: true,
        params: { documentId: '1' },
      };
      const wrapper = mount(<DocumentPage {...props} />);
      expect(wrapper.find('Spinner')).to.have.length(1);
    });

    it('renders the document', () => {
      const props = {
        fetchDocumentIfNeeded: sinon.spy(),
        pushToHistory: sinon.spy(),
        doc: { _id: '1', title: 'lorem' },
        params: { documentId: '1' },
      };
      const wrapper = mount(<DocumentPage {...props} />);
      expect(wrapper.find(Document)).to.have.length(1);
      expect(
        wrapper.find(Document).prop('doc')
      ).to.eql(props.doc);
      wrapper.find(Document).prop('onDeleteSuccess')();
      expect(
        props.pushToHistory.withArgs('/').calledOnce
      ).to.be.true;
    });
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      const state = {
        documentPage: {
          document: 1,
          error: null,
          loading: false,
        },
        entities: {
          documents: {
            1: {
              _id: 1,
              title: 'title',
              owner: 1,
            },
            2: {
              _id: 2,
              title: 'lorem',
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
      const ownProps = {
        params: { documentId: 1 },
      };
      const expectedProps = {
        doc: {
          _id: 1,
          title: 'title',
          owner: {
            _id: 1,
            username: 'user',
          },
        },
        error: null,
        loading: false,
      };
      expect(mapStateToProps(state, ownProps)).to.eql(expectedProps);
    });
  });
});
