import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import {
  createDocumentView,
  mapStateToProps,
  __RewireAPI__ as RewireAPI,
} from 'app/containers/util/createDocumentView';

describe('createDocumentView higher-order component', () => {
  const EditDocument = () => <div></div>;
  const Component = () => <div></div>;
  let DocumentView;

  before(() => {
    RewireAPI.__Rewire__('EditDocument', EditDocument);
    RewireAPI.__Rewire__('Button', props =>
      <button id={props.id} onClick={props.onClick}></button>
    );
  });

  after(() => {
    RewireAPI.__ResetDependency__('EditDocument');
    RewireAPI.__ResetDependency__('Button');
  });

  beforeEach(() => {
    DocumentView = createDocumentView(Component);
  });

  it('renders the component and the delete dialog', () => {
    const props = {
      doc: { _id: '1' },
      canEdit: true,
      canDelete: true,
      canEditAccess: true,
    };
    const wrapper = mount(<DocumentView {...props} />);
    const component = wrapper.find(Component);
    expect(component).to.have.length(1);
    expect(component.prop('_id')).to.equal('1');
    const dialog = wrapper.find('Dialog');
    expect(dialog).to.have.length(1);
    expect(dialog.prop('open')).to.equal(wrapper.state('openDeleteDialog'));
  });

  it('handles editing', () => {
    const props = {
      doc: { _id: '1' },
      canEdit: true,
      canDelete: true,
      canEditAccess: true,
    };
    const wrapper = mount(<DocumentView {...props} />);
    const component = wrapper.find(Component);
    component.prop('onEditClick')();
    expect(wrapper.state('isEditing')).to.be.true;
    let editDocument = wrapper.find(EditDocument);
    expect(editDocument).to.have.length(1);
    expect(editDocument.prop('document')).to.eql(props.doc);
    editDocument.prop('onEditSuccess')();
    expect(wrapper.state('isEditing')).to.be.false;

    // edit again to test when editing is canceled
    component.prop('onEditClick')();
    expect(wrapper.state('isEditing')).to.be.true;
    editDocument = wrapper.find(EditDocument);
    editDocument.prop('onCancel')();
    expect(wrapper.state('isEditing')).to.be.false;
  });

  it('handle deletion', () => {
    const props = {
      doc: { _id: '1' },
      canEdit: true,
      canDelete: true,
      canEditAccess: true,
      deleteDocument: sinon.spy(() => Promise.resolve()),
    };
    const wrapper = mount(<DocumentView {...props} />);
    const component = wrapper.find(Component);
    component.prop('onDeleteClick')();
    expect(wrapper.state('openDeleteDialog')).to.be.true;
    expect(wrapper.find('Dialog').prop('open')).to.be.true;
    wrapper.find('#btn-cancel').simulate('click');
    expect(wrapper.state('openDeleteDialog')).to.be.false;

    // open the dialog agian to test when delete is clicked
    component.prop('onDeleteClick')();
    expect(wrapper.state('openDeleteDialog')).to.be.true;
    expect(wrapper.find('Dialog').prop('open')).to.be.true;
    wrapper.find('#btn-delete').simulate('click');
    expect(props.deleteDocument.withArgs('1').calledOnce).to.be.true;
  });

  describe('mapStateToProps', () => {
    it('handles the document owner', () => {
      const state = {
        authenticatedUser: { _id: '1' },
      };
      const ownProps = {
        doc: { owner: { _id: '1' }, access: { write: 'private' } },
      };
      const expectedProps = {
        doc: ownProps.doc,
        canEdit: true,
        canDelete: true,
        canEditAccess: true,
      };
      expect(mapStateToProps(state, ownProps)).to.eql(expectedProps);
    });

    it('handles a logged in non-owner', () => {
      const state = {
        authenticatedUser: { _id: '2', role: { title: 'user' } },
      };
      const ownProps = {
        doc: { owner: { _id: '1' }, access: { write: 'authenticated' } },
      };
      const expectedProps = {
        doc: ownProps.doc,
        canEdit: true,
        canDelete: false,
        canEditAccess: false,
      };
      expect(mapStateToProps(state, ownProps)).to.eql(expectedProps);
    });

    it('handles an admin', () => {
      const state = {
        authenticatedUser: { _id: '2', role: { title: 'admin' } },
      };
      const ownProps = {
        doc: { owner: { _id: '1' }, access: { write: 'private' } },
      };
      const expectedProps = {
        doc: ownProps.doc,
        canEdit: false,
        canDelete: true,
        canEditAccess: false,
      };
      expect(mapStateToProps(state, ownProps)).to.eql(expectedProps);
    });
  });
});
