import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const authenticate = Component => {
  const Authenticate = props => {
    if (props.user) {
      return (<Component {...props} />);
    }
    return (
      <h2>
        <Link to={`/login?next=${props.route.path}`}>Log in</Link>{' or '}
        <Link to={`/signup?next=${props.route.path}`}>sign up</Link> to continue
      </h2>
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
