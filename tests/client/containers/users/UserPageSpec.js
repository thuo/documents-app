import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  UserPage,
  mapStateToProps,
  __RewireAPI__ as RewireAPI,
} from 'app/containers/users/UserPage';

describe('UserPage container', () => {
  describe('UserPage component', () => {
    const User = () => <div></div>;
    const UserDocumentList = () => <div></div>;
    const EditProfile = () => <div></div>;

    before(() => {
      RewireAPI.__Rewire__('User', User);
      RewireAPI.__Rewire__('UserDocumentList', UserDocumentList);
      RewireAPI.__Rewire__('EditProfile', EditProfile);
    });

    after(() => {
      RewireAPI.__ResetDependency__('User');
      RewireAPI.__ResetDependency__('UserDocumentList');
      RewireAPI.__ResetDependency__('EditProfile');
    });

    it('calls fetchUserIfNeeded', () => {
      const props = {
        fetchUserIfNeeded: sinon.spy(),
        params: { userId: '1' },
      };
      mount(<UserPage {...props} />);
      expect(props.fetchUserIfNeeded.withArgs('1').calledOnce).to.be.true;
    });

    it('renders an error when passed', () => {
      const props = {
        fetchUserIfNeeded: sinon.spy(),
        error: 'Oops!',
        params: { userId: '1' },
      };
      const wrapper = mount(<UserPage {...props} />);
      expect(wrapper.find('AppError')).to.have.length(1);
      expect(wrapper.find('AppError').text()).to.contain(props.error);
    });

    it('renders an spinner when loading', () => {
      const props = {
        fetchUserIfNeeded: sinon.spy(),
        loading: true,
        params: { userId: '1' },
      };
      const wrapper = mount(<UserPage {...props} />);
      expect(wrapper.find('Spinner')).to.have.length(1);
    });

    it('renders the user', () => {
      const props = {
        fetchUserIfNeeded: sinon.spy(),
        user: { _id: '1', name: { first: 'lorem' } },
        params: { userId: '1' },
      };
      const wrapper = mount(<UserPage {...props} />);
      expect(wrapper.find(User)).to.have.length(1);
      expect(wrapper.find(User).prop('_id')).to.equal(props.user._id);
      expect(wrapper.find(User).prop('name')).to.equal(props.user.name);
      wrapper.find(User).prop('onEditClick')();
      expect(wrapper.state('isEditing')).to.be.true;
    });

    it('renders the edit form when editing', () => {
      const props = {
        fetchUserIfNeeded: sinon.spy(),
        user: { _id: '1', name: { first: 'lorem' } },
        params: { userId: '1' },
      };
      const wrapper = mount(<UserPage {...props} />);
      wrapper.setState({ isEditing: true });
      expect(wrapper.find(EditProfile)).to.have.length(1);
      expect(wrapper.find(EditProfile).prop('user')).to.eql(props.user);
      wrapper.find(EditProfile).prop('onCancel')();
      expect(wrapper.state('isEditing')).to.be.false;
      wrapper.setState({ isEditing: true });
      wrapper.find(EditProfile).prop('onEditSuccess')();
      expect(wrapper.state('isEditing')).to.be.false;
    });

    it('renders the users documents', () => {
      const props = {
        fetchUserIfNeeded: sinon.spy(),
        user: { _id: '1', name: { first: 'lorem' } },
        params: { userId: '1' },
      };
      const wrapper = mount(<UserPage {...props} />);
      wrapper.setState({ isEditing: true });
      expect(wrapper.find(UserDocumentList)).to.have.length(1);
      expect(wrapper.find(UserDocumentList).prop('userId')).to.equal('1');
      expect(wrapper.find('h3').text()).to.equal("lorem's Documents");
    });
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      const state = {
        userPage: {
          user: 1,
          error: null,
          loading: false,
        },
        entities: {
          users: {
            1: {
              _id: 1,
              username: 'user',
            },
          },
        },
        authenticatedUser: {
          _id: 1,
        },
      };
      const ownProps = {
        params: { userId: 1 },
      };
      const expectedProps = {
        user: {
          _id: 1,
          username: 'user',
        },
        error: null,
        loading: false,
        isAuthenticatedUser: true,
      };
      expect(mapStateToProps(state, ownProps)).to.eql(expectedProps);
    });
  });
});
