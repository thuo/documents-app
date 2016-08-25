import { connect } from 'react-redux';
import humps from 'humps';
import omit from 'lodash/omit';
import { editUser } from 'app/actions/UserActions';
import ProfileForm from 'app/components/users/ProfileForm';
import createForm from 'app/containers/util/createForm';

export function submit(values) {
  return new Promise((resolve, reject) => {
    const { defaultValues, editUser: boundEditUser } = this.props;
    boundEditUser(defaultValues._id, humps.decamelizeKeys(values)).then(() => {
      const { error, onEditSuccess } = this.props;
      if (!error) {
        // since on edit success is optional check if it is provided and it is a
        // function before calling it
        typeof onEditSuccess === 'function' && onEditSuccess();
        resolve();
      } else {
        this.showSnackbar(error.error);
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
  if (!(values.lastName && values.firstName.trim())) {
    errors.lastName = 'Required';
  }
  return errors;
};

export const EditProfile = createForm(
  submit,
  validate
)(ProfileForm);

export const mapStateToProps = (state, ownProps) => {
  const { error, loading } = state.editProfile;
  const { user } = ownProps;
  const defaultValues = Object.assign(omit(user, 'name'), {
    firstName: user.name.first,
    lastName: user.name.last,
  });
  return {
    error,
    loading,
    defaultValues,
  };
};

export default connect(
  mapStateToProps, {
    editUser,
  }
)(EditProfile);
