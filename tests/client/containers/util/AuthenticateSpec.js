import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Link } from 'react-router';
import {
  authenticate, mapStateToProps,
} from 'app/containers/util/authenticate';


describe('authenticate higher-order component', () => {
  const Component = () => (<div></div>);
  let Authenticated;

  beforeEach(() => {
    Authenticated = authenticate(Component);
  });

  it('renders the component', () => {
    const props = {
      route: { path: '/documents' },
      user: { username: 'user' },
    };
    const wrapper = mount(<Authenticated {...props} />);
    const component = wrapper.find(Component);
    expect(component).to.have.length(1);
  });

  it('renders the login required message', () => {
    const props = {
      route: { path: '/documents' },
      user: null,
    };
    const wrapper = mount(<Authenticated {...props} />);
    const h2 = wrapper.find('h2');
    const link = h2.find(Link);
    expect(h2).to.have.length(1);
    expect(link).to.have.length(2);
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      const state = {
        authenticatedUser: {
          _id: '1',
          username: 'user',
        },
      };
      const expectedProps = {
        user: state.authenticatedUser,
      };
      expect(mapStateToProps(state)).to.eql(expectedProps);
    });
  });
});
