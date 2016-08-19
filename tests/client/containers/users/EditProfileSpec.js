import { expect } from 'chai';
import sinon from 'sinon';
import {
  validate, submit, mapStateToProps,
} from 'app/containers/users/EditProfile';

describe('EditProfile', () => {
  describe('validate', () => {
    it('validates', () => {
      expect(validate({
        firstName: 'Foo',
        lastName: 'Bar',
        email: 'valid@example.com',
        username: 'valid',
        password: 'password',
        confirmPassword: 'password',
      })).to.eql({});
      expect(validate({})).to.eql({
        email: 'Required',
        firstName: 'Required',
        lastName: 'Required',
        username: 'Required',
      });
      expect(validate({
        firstName: 'Foo',
        lastName: 'Bar',
        email: 'invalid',
        username: '!nv@l1d',
      })).to.eql({
        email: 'Invalid email',
        username: 'Invalid username',
      });
    });
  });

  describe('submit', () => {
    it('updates profile', (done) => {
      const context = {
        props: {
          editUser: sinon.spy(() => Promise.resolve()),
          pushToHistory: sinon.spy(() => Promise.resolve()),
          defaultValues: { _id: 1 },
          onEditSuccess: sinon.spy(),
        },
      };
      const values = {
        username: 'user',
        email: 'user@example.com',
      };
      submit(values, context).then(() => {
        expect(
          context.props.editUser.withArgs(1, values).calledOnce
        ).to.be.true;
        expect(context.props.onEditSuccess.calledOnce).to.be.true;
      }).then(done, done);
    });

    it('calls showSnackbar when there is an error', (done) => {
      const context = {
        props: {
          editUser: sinon.spy(() => Promise.resolve()),
          defaultValues: { _id: 1 },
          error: { error: 'error' },
        },
        showSnackbar: sinon.spy(),
      };
      const values = {
        username: 'user',
        email: 'user@example.com',
      };
      submit(values, context).catch(() => {
        expect(context.showSnackbar.withArgs('error').calledOnce).to.be.true;
      }).then(done, done);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      const state = {
        editProfile: { error: 'error', loading: false },
      };

      const ownProps = {
        user: {
          username: 'user',
          email: 'user@example.com',
          name: { first: 'first', last: 'last' },
        },
      };

      const expectedProps = {
        error: 'error',
        loading: false,
        defaultValues: {
          username: 'user',
          email: 'user@example.com',
          firstName: 'first',
          lastName: 'last',
        },
      };

      expect(mapStateToProps(state, ownProps)).to.eql(expectedProps);
    });
  });
});
