import { expect } from 'chai';
import sinon from 'sinon';
import { push } from 'react-router-redux';
import mockStore from '../helpers/mockStore';
import mock from '../helpers/mockAgent';
import * as LogIn from 'app/containers/auth/LogIn';
import * as actions from 'app/actions/ActionTypes';

describe('LogIn', () => {
  describe('validate', () => {
    it('validates', () => {
      expect(LogIn.validate({
        email: 'email@example.com',
        password: 'password',
      })).to.eql({});
      expect(LogIn.validate({})).to.eql({
        email: 'Required',
        password: 'Required',
      });
      expect(LogIn.validate({
        email: 'invalid',
        password: 'password',
      })).to.eql({
        email: 'Invalid email',
      });
    });
  });

  describe('submit', () => {
    it('logs in user and redirects to', (done) => {
      const context = {
        props: {
          logIn: sinon.spy(() => Promise.resolve()),
          push: sinon.spy(() => Promise.resolve()),
          location: { query: {
            next: '/documents',
          } },
        },
      };
      const values = {
        email: 'email@example.com',
        password: 'password',
      };
      LogIn.submit(values, context).then(() => {
        expect(context.props.logIn.withArgs(values).calledOnce).to.be.true;
        expect(context.props.push.withArgs(
          context.props.location.query.next
        ).calledOnce).to.be.true;
      }).then(done, done);
    });

    it('calls showSnackbar when there is an error', (done) => {
      const context = {
        props: {
          logIn: sinon.spy(() => Promise.resolve()),
          error: 'error',
        },
        showSnackbar: sinon.spy(),
      };
      const values = {
        email: 'email@example.com',
        password: 'password',
      };
      LogIn.submit(values, context).catch(() => {
        expect(context.props.logIn.withArgs(values).calledOnce).to.be.true;
        expect(
          context.showSnackbar.withArgs(context.props.error).calledOnce
        ).to.be.true;
      }).then(done, done);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      expect(LogIn.mapStateToProps({ loginError: 'error' })).to.eql({
        error: 'error',
      });
    });
  });
});
