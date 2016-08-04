import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { logIn } from 'app/actions/AuthActions';
import LogInForm from 'app/components/auth/LogInForm';
import createForm from 'app/containers/util/createForm';

export const submit = (values, ctx) => new Promise((resolve, reject) => {
  const props = ctx.props;
  props.logIn(values).then(() => {
    const { error, location } = ctx.props;
    if (!error) {
      const nextLocation = location.query.next || '/';
      props.push(nextLocation);
      resolve();
    } else {
      ctx.showSnackbar(error);
      reject(error);
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
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

export const LogIn = createForm(
  submit,
  validate
)(LogInForm);

export const mapStateToProps = state => ({ error: state.loginError });

export const mapDispatchToProps = dispatch => bindActionCreators({
  logIn, push,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogIn);
