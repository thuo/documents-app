import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { logIn } from 'app/actions/AuthActions';
import LogInForm from 'app/components/auth/LogInForm';
import createForm from 'app/containers/util/createForm';

export function submit(values) {
  return new Promise((resolve, reject) => {
    const props = this.props;
    props.logIn(values).then(() => {
      const { error, location } = this.props;
      if (!error) {
        const nextLocation = location.query.next || '/';
        props.push(nextLocation);
        resolve();
      } else {
        this.showSnackbar(error.error);
        reject(error);
      }
    });
  });
}

export const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Invalid email';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

export const LogIn = createForm(
  submit,
  validate
)(LogInForm);

export const mapStateToProps = state => state.logIn;

export default connect(
  mapStateToProps, {
    logIn, push,
  }
)(LogIn);
