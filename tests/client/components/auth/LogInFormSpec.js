import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import LogInForm from 'app/components/auth/LogInForm';

describe('LogInForm', () => {
  it('renders the form', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: {},
    };
    const wrapper = shallow(<LogInForm {...props} />);
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
    const wrapper = shallow(<LogInForm {...props} />);
    expect(wrapper.find('CardTitle').children().text()).to.equal('Log In');
  });

  it('renders the email field', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: { email: 'email' },
      errors: { email: 'error' },
    };
    const wrapper = shallow(<LogInForm {...props} />);
    const email = wrapper.find({ label: 'Email' });
    expect(email).to.have.length(1);
    expect(email.prop('defaultValue')).to.equal(props.values.email);
    expect(email.prop('error')).to.equal(props.errors.email);
    expect(props.onFieldChange.withArgs('email').calledOnce).to.be.true;
  });

  it('renders the password field', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: { password: 'error' },
    };
    const wrapper = shallow(<LogInForm {...props} />);
    const password = wrapper.find({ label: 'Password' });
    expect(password).to.have.length(1);
    expect(password.prop('error')).to.equal(props.errors.password);
    expect(props.onFieldChange.withArgs('password').calledOnce).to.be.true;
  });

  it('renders the submit button', () => {
    const props = {
      onFieldChange: sinon.spy(),
      onSubmit: sinon.spy(),
      values: {},
      errors: {},
    };
    const wrapper = shallow(<LogInForm {...props} />);
    const button = wrapper.find('Button');
    expect(button).to.have.length(1);
    expect(button.children().text()).to.equal('Log In');
    button.simulate('click');
    expect(props.onSubmit.calledOnce).to.be.true;
  });
});
