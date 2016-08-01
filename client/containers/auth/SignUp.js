import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { signUp, logIn } from 'app/actions/AuthActions';
import SignUpForm from 'app/components/auth/SignUpForm';
import createForm from 'app/containers/util/createForm';

export const submit = (values, ctx) => new Promise((resolve, reject) => {
  const props = ctx.props;
  props.signUp(values).then(() => {
    const { error } = ctx.props;
    if (!error) {
      const { email, password } = values;
      props.logIn({ email, password }).then(() => {
        props.push('/');
        resolve();
      });
    } else {
      ctx.showSnackbar(error.error);
      reject(error.error);
    }
  });
});

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
  if (!(values.lastName && values.firstName.trim())) {
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

export const mapStateToProps = state => ({ error: state.signUpError });

export const mapDispatchToProps = dispatch => bindActionCreators({
  signUp, logIn, push,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
