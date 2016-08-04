import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Link } from 'react-router';
import mockStore from '../helpers/mockStore';
import authenticate from 'app/containers/util/authenticate';


describe('createForm higher-order component', () => {
  const Component = () => (<div></div>);
  let Authenticated;

  beforeEach(() => {
    Authenticated = authenticate(Component);
  });

  it('renders the component', () => {
    const props = {
      route: { path: '/documents' },
      store: mockStore({
        authenticatedUser: { username: 'user' },
      }),
    };
    const wrapper = mount(<Authenticated {...props} />);
    const component = wrapper.find(Component);
    expect(component).to.have.length(1);
  });

  it('renders the login required message', () => {
    const props = {
      route: { path: '/documents' },
      store: mockStore({}),
    };
    const wrapper = mount(<Authenticated {...props} />);
    const component = wrapper.find('h2');
    const link = component.find(Link);
    expect(component).to.have.length(1);
    expect(link).to.have.length(2);
  });
});
