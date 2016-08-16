import { expect } from 'chai';
import sinon from 'sinon';
import * as SignUp from 'app/containers/auth/SignUp';
import { decamelizeKeys } from 'humps';

describe('SignUp', () => {
  describe('validate', () => {
    it('validates', () => {
      expect(SignUp.validate({
        firstName: 'Foo',
        lastName: 'Bar',
        email: 'valid@example.com',
        username: 'valid',
        password: 'password',
        confirmPassword: 'password',
      })).to.eql({});
      expect(SignUp.validate({})).to.eql({
        email: 'Required',
        firstName: 'Required',
        lastName: 'Required',
        username: 'Required',
        password: 'Required',
      });
      expect(SignUp.validate({
        firstName: 'Foo',
        lastName: 'Bar',
        email: 'invalid',
        username: '!nv@l1d',
        password: 'password',
        confirmPassword: 'pass',
      })).to.eql({
        email: 'Invalid email',
        username: 'Invalid username',
        confirmPassword: 'Passwords do not match',
      });
    });
  });

  describe('submit', () => {
    it('signs up a user and log the user in', (done) => {
      const context = {
        props: {
          signUp: sinon.spy(() => Promise.resolve()),
          logIn: sinon.spy(() => Promise.resolve()),
          push: sinon.spy(() => Promise.resolve()),
          location: { query: {
            next: '/documents',
          } },
        },
      };
      const values = {
        firstName: 'Foo',
        lastName: 'Bar',
        email: 'valid@example.com',
        username: 'valid',
        password: 'password',
        confirmPassword: 'password',
      };
      SignUp.submit(values, context).then(() => {
        expect(
          context.props.signUp.withArgs(decamelizeKeys(values)).calledOnce
        ).to.be.true;
        expect(context.props.logIn.withArgs({
          email: values.email,
          password: values.password,
        }).calledOnce).to.be.true;
        expect(context.props.push.withArgs(
          context.props.location.query.next
        ).calledOnce).to.be.true;
      }).then(done, done);
    });

    it('calls showSnackbar when there is an error', (done) => {
      const context = {
        props: {
          signUp: sinon.spy(() => Promise.resolve()),
          error: { error: 'error' },
        },
        showSnackbar: sinon.spy(),
      };
      const values = {};
      SignUp.submit(values, context).catch(() => {
        expect(context.props.signUp.withArgs(values).calledOnce).to.be.true;
        expect(
          context.showSnackbar.withArgs(context.props.error.error).calledOnce
        ).to.be.true;
      }).then(done, done);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      expect(SignUp.mapStateToProps({ signUp: { error: 'error' } })).to.eql({
        error: 'error',
      });
    });
  });
});
