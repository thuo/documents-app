import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AppError from 'app/components/error/AppError';

const authenticate = Component => {
  const Authenticate = props => {
    if (props.user) {
      return (<Component {...props} />);
    }
    return (
      <AppError>
        <Link to={`/login?next=${props.route.path}`}>Log in</Link>{' or '}
        <Link to={`/signup?next=${props.route.path}`}>sign up</Link> to continue
      </AppError>
    );
  };

  Authenticate.propTypes = {
    user: PropTypes.object,
    route: PropTypes.shape({
      path: PropTypes.string,
    }),
  };

  const displayName = Component.displayName || Component.name || 'Component';
  Authenticate.displayName = `Authenticate(${displayName})`;

  const mapStateToProps = state => (
    { user: state.authenticatedUser }
  );

  return connect(
    mapStateToProps
  )(Authenticate);
};

export default authenticate;
