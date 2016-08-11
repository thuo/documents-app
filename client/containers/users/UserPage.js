import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'react-mdl';
import { fetchUserIfNeeded } from 'app/actions/UserActions';
import AppError from 'app/components/error/AppError';
import User from 'app/components/users/User';

export class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      params: { userId },
      fetchUserIfNeeded: fetchUser,
    } = this.props;
    fetchUser(userId);
  }

  render() {
    const { user, error, isAuthenticatedUser } = this.props;
    if (!user) {
      return (<AppError>{error && error.error || <Spinner />}</AppError>);
    }
    return (
      <User
        {...user}
        canEdit={isAuthenticatedUser}
        canDelete={isAuthenticatedUser}
      />
    );
  }
}

UserPage.propTypes = {
  user: PropTypes.object,
  error: PropTypes.shape({
    error: PropTypes.string,
  }),
  fetchUserIfNeeded: PropTypes.func.isRequired,
  params: PropTypes.shape({
    userId: PropTypes.string,
  }),
  route: PropTypes.shape({
    path: PropTypes.string,
  }),
  isAuthenticatedUser: PropTypes.bool,
};

export const mapStateToProps = (state, ownProps) => {
  const { entities, userPage } = state;
  const { params: { userId } } = ownProps;
  const user = entities.users[userId];
  const error = userPage.error;
  const isAuthenticatedUser = state.authenticatedUser &&
    userId === state.authenticatedUser._id;
  return {
    user,
    error,
    isAuthenticatedUser,
  };
};

export default connect(
  mapStateToProps, {
    fetchUserIfNeeded,
  }
)(UserPage);
