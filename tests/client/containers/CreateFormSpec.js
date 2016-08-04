import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Snackbar } from 'react-mdl';
import createForm from 'app/containers/util/createForm';

describe('createForm higher-order component', () => {
  const Component = () => (<div></div>);
  const submit = sinon.spy();
  const validate = sinon.spy(() => ({}));
  let Form;

  beforeEach(() => {
    Form = createForm(
       submit,
       validate
    )(Component);
  });

  afterEach(() => {
    submit.reset();
    validate.reset();
  });

  it('renders the component and a snackbar', () => {
    const wrapper = mount(<Form />);
    const component = wrapper.find(Component);
    const snackbar = wrapper.find(Snackbar);
    const { onFieldChange, onSubmit, errors, values } = component.props();
    const { active, onTimeout } = snackbar.props();
    expect(onFieldChange).to.be.a('function');
    expect(onSubmit).to.be.a('function');
    expect(errors).to.eql(wrapper.state().errors);
    expect(values).eql(wrapper.state().values);
    expect(onTimeout).to.be.a('function');
    expect(active).to.to.eql(wrapper.state().isSnackbarActive);
  });

  it('creates a field change handle', () => {
    const handleFieldChange = sinon.spy(Form.prototype, 'handleFieldChange');
    const wrapper = mount(<Form />);
    wrapper.find(Component).props().onFieldChange('field');
    expect(handleFieldChange.withArgs('field').calledOnce).to.be.true;
  });

  it('handles field change', () => {
    const wrapper = mount(<Form />);
    const onFieldChange = wrapper.find(Component).props().onFieldChange;
    const handler = onFieldChange('field');
    const event = {
      preventDefault: sinon.spy(),
      target: { value: 'qwerty' },
    };
    handler(event);
    expect(event.preventDefault.calledOnce).to.be.true;
    expect(wrapper.state()).to.have.deep.property('values.field', 'qwerty');
    event.target.value = 'changed';
    handler(event);
    expect(event.preventDefault.calledTwice).to.be.true;
    expect(wrapper.state()).to.have.deep.property('values.field', 'changed');
  });

  it('calls validate after field change', () => {
    const wrapper = mount(<Form />);
    wrapper.find(Component).props().onFieldChange('field')({
      preventDefault: sinon.spy(),
      target: { value: 'zxcvb' },
    });
    expect(validate.secondCall.args[0]).to.have.property('field', 'zxcvb');
  });

  it('calls submit when there are no errors', () => {
    const wrapper = mount(<Form />);
    wrapper.setState({
      values: {
        field1: 'value1',
        field2: 'value2',
      },
      errors: {},
    });
    const component = wrapper.find(Component);
    component.props().onSubmit({
      preventDefault: () => {},
    });
    expect(submit.withArgs({
      field1: 'value1',
      field2: 'value2',
    }).calledOnce).to.be.true;
  });

  it('calls showSnackbar when there are errors', () => {
    const showSnackbar = sinon.spy(Form.prototype, 'showSnackbar');
    const wrapper = mount(<Form />);
    wrapper.setState({
      values: {
        field1: 'value1',
        field2: 'value2',
      },
      errors: {
        field1: 'error1',
        field2: 'error2',
      },
    });
    wrapper.find(Component).props().onSubmit({
      preventDefault: () => {},
    });
    expect(showSnackbar.calledOnce).to.be.true;
  });

  it('handle snackbar timeout', () => {
    const handleTimeout = sinon.spy(Form.prototype, 'handleTimeoutSnackbar');
    const wrapper = mount(<Form />);
    wrapper.find(Snackbar).props().onTimeout();
    expect(handleTimeout.calledOnce).to.be.true;
  });
});
