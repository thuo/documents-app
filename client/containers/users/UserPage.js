import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'react-mdl';
import { fetchUserIfNeeded } from 'app/actions/UserActions';
import AppError from 'app/components/error/AppError';
import User from 'app/components/users/User';
import EditProfile from './EditProfile';
import UserDocumentList from './UserDocumentList';

export class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
    this.handleEditStart = this.handleEditStart.bind(this);
    this.handleEditStop = this.handleEditStop.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
  }

  componentDidMount() {
    const {
      params: { userId },
      fetchUserIfNeeded: fetchUser,
    } = this.props;
    fetchUser(userId);
  }

  handleEditStart() {
    this.setState({
      isEditing: true,
    });
  }

  handleEditStop() {
    this.setState({
      isEditing: false,
    });
  }

  renderProfile() {
    const { user, isAuthenticatedUser } = this.props;
    const { isEditing } = this.state;
    if (isEditing) {
      return (
        <EditProfile
          user={user}
          onCancel={this.handleEditStop}
          onEditSuccess={this.handleEditStop}
        />
      );
    }
    return (
      <User
        {...user}
        canEdit={isAuthenticatedUser}
        canDelete={false}
        onEditClick={this.handleEditStart}
      />
    );
  }

  render() {
    const { user, error, loading, isAuthenticatedUser } = this.props;
    if (error || loading || !user) {
      return (<AppError>{error || <Spinner />}</AppError>);
    }
    return (
      <div>
        {this.renderProfile()}
        <h3 style={{ textAlign: 'center', marginTop: '2em' }}>
          {isAuthenticatedUser ? 'My' : `${user.name.first}'s`} Documents
        </h3>
        <UserDocumentList userId={user._id} />
      </div>
    );
  }
}

UserPage.propTypes = {
  user: PropTypes.object,
  error: PropTypes.string,
  loading: PropTypes.bool,
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
  const isAuthenticatedUser = state.authenticatedUser &&
    userId === state.authenticatedUser._id;
  const { loading } = userPage;
  const error = userPage.error && userPage.error.error;
  return {
    user,
    error,
    loading,
    isAuthenticatedUser,
  };
};

export default connect(
  mapStateToProps, {
    fetchUserIfNeeded,
  }
)(UserPage);
