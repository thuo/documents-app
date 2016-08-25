import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { signUp, logIn } from 'app/actions/AuthActions';
import SignUpForm from 'app/components/auth/SignUpForm';
import createForm from 'app/containers/util/createForm';
import humps from 'humps';

export function submit(values) {
  return new Promise((resolve, reject) => {
    const props = this.props;
    props.signUp(humps.decamelizeKeys(values)).then(() => {
      const { error, location } = this.props;
      if (!error) {
        const { email, password } = values;
        props.logIn({ email, password }).then(() => {
          const nextLocation = location.query.next || '/';
          props.push(nextLocation);
          resolve();
        });
      } else {
        this.showSnackbar(error.error);
        this.setState({
          errors: Object.assign({}, this.state.errors, error.messages),
        });
        reject(error.error);
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
  if (!values.username) {
    errors.username = 'Required';
  } else if (!/^\w+$/.test(values.username)) {
    errors.username = 'Invalid username';
  }
  if (!(values.firstName && values.firstName.trim())) {
    errors.firstName = 'Required';
  }
  if (!(values.lastName && values.lastName.trim())) {
    errors.lastName = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
};

export const SignUp = createForm(
  submit,
  validate
)(SignUpForm);

export const mapStateToProps = state => state.signUp;

export default connect(
  mapStateToProps, {
    signUp, logIn, push,
  }
)(SignUp);
