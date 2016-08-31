import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  NavBar,
  mapStateToProps,
} from 'app/containers/NavBar';

describe('NavBar container', () => {
  describe('NavBar', () => {
    it('renders a header', () => {
      const props = {};
      const wrapper = mount(<NavBar {...props} />);
      expect(wrapper.find('Header')).to.have.length(1);
    });

    it('renders home, login and signup links', () => {
      const props = {};
      const wrapper = mount(<NavBar {...props} />);
      const links = wrapper.find('Link');
      expect(links.at(0).prop('to')).to.equal('/');
      expect(links.at(1).prop('to')).to.equal('/login');
      expect(links.at(2).prop('to')).to.equal('/signup');
    });

    it('renders profile menu', () => {
      const props = {
        user: { _id: '1', name: { first: 'Foo', last: 'Bar' } },
        logOut: sinon.spy(),
        push: sinon.spy(),
      };
      const wrapper = mount(<NavBar {...props} />);
      expect(wrapper.find('Icon').at(1).prop('name')).to.equal('more_vert');
      const links = wrapper.find('Link');
      expect(links.at(0).prop('to')).to.equal('/');
      wrapper.find('MenuItem').at(0).simulate('click');
      expect(props.push.withArgs('/users/1').calledOnce).to.be.true;
      wrapper.find('MenuItem').at(1).simulate('click');
      expect(props.logOut.calledOnce).to.be.true;
      expect(props.push.withArgs('/').calledOnce).to.be.true;
    });
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      const state = {
        authenticatedUser: {
          _id: 1,
          username: 'foo',
        },
        entities: {
          users: {
            1: {
              _id: 1,
              username: 'user',
            },
          },
        },
      };
      const expectedProps = {
        user: state.entities.users[1],
      };
      expect(mapStateToProps(state)).to.eql(expectedProps);
    });
  });
});
