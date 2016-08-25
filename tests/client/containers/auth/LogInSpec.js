import { expect } from 'chai';
import sinon from 'sinon';
import * as LogIn from 'app/containers/auth/LogIn';

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
      LogIn.submit.call(context, values).then(() => {
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
          error: { error: 'error' },
        },
        showSnackbar: sinon.spy(),
      };
      const values = {
        email: 'email@example.com',
        password: 'password',
      };
      LogIn.submit.call(context, values).catch(() => {
        expect(context.props.logIn.withArgs(values).calledOnce).to.be.true;
        expect(
          context.showSnackbar.withArgs(context.props.error.error).calledOnce
        ).to.be.true;
      }).then(done, done);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state to props', () => {
      expect(LogIn.mapStateToProps({ logIn: { error: 'error' } })).to.eql({
        error: 'error',
      });
    });
  });
});
