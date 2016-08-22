import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ProfileForm from 'app/components/users/ProfileForm';

describe('ProfileForm', () => {
  it('renders the form', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: {},
    };
    const wrapper = shallow(<ProfileForm {...props} />);
    const form = wrapper.find('form');
    expect(form).to.have.length(1);
    form.simulate('submit');
    expect(props.onSubmit.calledOnce).to.be.true;
  });

  it('renders the title', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: {},
    };
    const wrapper = shallow(<ProfileForm {...props} />);
    const title = wrapper.find('CardTitle');
    expect(title.children().text()).to.equal('Edit Profile');
  });

  it('renders the first name field', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: { firstName: 'Foo' },
      errors: { firstName: 'error' },
    };
    const wrapper = shallow(<ProfileForm {...props} />);
    const firstName = wrapper.find({ label: 'First name' });
    expect(firstName).to.have.length(1);
    expect(firstName.prop('defaultValue')).to.equal(props.values.firstName);
    expect(firstName.prop('error')).to.equal(props.errors.firstName);
    expect(props.onFieldChange.withArgs('firstName').calledOnce).to.be.true;
  });

  it('renders the last name field', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: { lastName: 'Bar' },
      errors: { lastName: 'error' },
    };
    const wrapper = shallow(<ProfileForm {...props} />);
    const lastName = wrapper.find({ label: 'Last name' });
    expect(lastName).to.have.length(1);
    expect(lastName.prop('defaultValue')).to.equal(props.values.lastName);
    expect(lastName.prop('error')).to.equal(props.errors.lastName);
    expect(props.onFieldChange.withArgs('lastName').calledOnce).to.be.true;
  });

  it('renders the email field', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: { email: 'email' },
      errors: { email: 'error' },
    };
    const wrapper = shallow(<ProfileForm {...props} />);
    const email = wrapper.find({ label: 'Email' });
    expect(email).to.have.length(1);
    expect(email.prop('defaultValue')).to.equal(props.values.email);
    expect(email.prop('error')).to.equal(props.errors.email);
    expect(props.onFieldChange.withArgs('email').calledOnce).to.be.true;
  });

  it('renders the username field', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: { username: 'username' },
      errors: { username: 'error' },
    };
    const wrapper = shallow(<ProfileForm {...props} />);
    const username = wrapper.find({ label: 'Username' });
    expect(username).to.have.length(1);
    expect(username.prop('defaultValue')).to.equal(props.values.username);
    expect(username.prop('error')).to.equal(props.errors.username);
    expect(props.onFieldChange.withArgs('username').calledOnce).to.be.true;
  });

  it('renders the save button', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: {},
    };
    const wrapper = shallow(<ProfileForm {...props} />);
    const button = wrapper.find('Button');
    expect(button).to.have.length(1);
    expect(button.children().text()).to.equal('Save');
    button.simulate('click');
    expect(props.onSubmit.calledOnce).to.be.true;
  });

  it('renders the cancel button', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      onCancel: sinon.spy(),
      values: {},
      errors: {},
    };
    const wrapper = shallow(<ProfileForm {...props} />);
    const cancel = wrapper.find('Button').at(1);
    expect(cancel.children().text()).to.equal('Cancel');
    const preventDefault = sinon.spy();
    cancel.simulate('click', { preventDefault });
    expect(preventDefault.calledOnce).to.be.true;
    expect(props.onCancel.calledOnce).to.be.true;
  });
});
