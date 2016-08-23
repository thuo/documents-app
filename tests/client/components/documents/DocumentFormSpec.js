import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import DocumentForm from 'app/components/documents/DocumentForm';

describe('DocumentForm', () => {
  it('renders the form', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: {},
    };
    const wrapper = shallow(<DocumentForm {...props} />);
    const form = wrapper.find('form');
    expect(form).to.have.length(1);
    form.simulate('submit');
    expect(props.onSubmit.calledOnce).to.be.true;
  });

  it('renders the default title', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: {},
    };
    const wrapper = shallow(<DocumentForm {...props} />);
    const title = wrapper.find('CardTitle');
    expect(title.children().text()).to.equal('Add Document');
  });

  it('renders the specified title', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: {},
      title: 'Document',
    };
    const wrapper = shallow(<DocumentForm {...props} />);
    const title = wrapper.find('CardTitle');
    expect(title.children().text()).to.equal('Document');
  });

  it('renders the title field', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: { title: 'Lorem' },
      errors: { error: 'error' },
    };
    const wrapper = shallow(<DocumentForm {...props} />);
    const title = wrapper.find({ label: 'Title' });
    expect(title).to.have.length(1);
    expect(title.prop('defaultValue')).to.equal(props.values.title);
    expect(title.prop('error')).to.equal(props.errors.title);
    expect(props.onFieldChange.withArgs('title').calledOnce).to.be.true;
  });

  it('renders the content field', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: { content: 'Ipsum' },
      errors: { content: 'error' },
    };
    const wrapper = shallow(<DocumentForm {...props} />);
    const content = wrapper.find({ label: 'Content' });
    expect(content).to.have.length(1);
    expect(content.prop('defaultValue')).to.equal(props.values.content);
    expect(content.prop('error')).to.equal(props.errors.content);
    expect(props.onFieldChange.withArgs('content').calledOnce).to.be.true;
  });

  it('renders the read access field', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: { readAccess: 'public' },
      errors: {},
      canEditAccess: true,
    };
    const wrapper = shallow(<DocumentForm {...props} />);
    const readAccess = wrapper.find('#read-access');
    expect(readAccess).to.have.length(1);
    expect(readAccess.prop('defaultValue')).to.equal(props.values.readAccess);
    expect(props.onFieldChange.withArgs('readAccess').calledOnce).to.be.true;
  });

  it('renders the write access field', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: { writeAccess: 'authenticated' },
      errors: {},
      canEditAccess: true,
    };
    const wrapper = shallow(<DocumentForm {...props} />);
    const writeAccess = wrapper.find('#write-access');
    expect(writeAccess).to.have.length(1);
    expect(writeAccess.prop('defaultValue')).to.equal(props.values.writeAccess);
    expect(props.onFieldChange.withArgs('writeAccess').calledOnce).to.be.true;
  });

  it('renders the save button', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: {},
    };
    const wrapper = shallow(<DocumentForm {...props} />);
    const button = wrapper.find('Button');
    expect(button).to.have.length(1);
    expect(button.children().text()).to.equal('Save');
    button.simulate('click');
    expect(props.onSubmit.calledOnce).to.be.true;
  });

  it('renders the save button with the specified text', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: {},
      buttonText: 'Done',
    };
    const wrapper = shallow(<DocumentForm {...props} />);
    const button = wrapper.find('Button');
    expect(button).to.have.length(1);
    expect(button.children().text()).to.equal('Done');
  });


  it('renders the cancel button', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      onCancel: sinon.spy(),
      values: {},
      errors: {},
    };
    const wrapper = shallow(<DocumentForm {...props} />);
    const cancel = wrapper.find('Button').at(1);
    expect(cancel.children().text()).to.equal('Cancel');
    const preventDefault = sinon.spy();
    cancel.simulate('click', { preventDefault });
    expect(preventDefault.calledOnce).to.be.true;
    expect(props.onCancel.calledOnce).to.be.true;
  });
});
