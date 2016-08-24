import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Button from 'react-mdl/lib/Button';
import Header from 'react-mdl/lib/Layout/Header';
import Navigation from 'react-mdl/lib/Layout/Navigation';
import Menu, { MenuItem } from 'react-mdl/lib/Menu';
import { Link } from 'react-router';
import { logOut } from 'app/actions/AuthActions';

const linkStyle = {
  textDecoration: 'none',
  color: '#fff',
  textTransform: 'none',
};

export class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.renderLinks = this.renderLinks.bind(this);
  }

  renderLinks() {
    const { user, logOut: boundLogOut, push: boundPush } = this.props;
    if (user) {
      return (
        <Navigation>
          <div style={{ position: 'relative' }}>
            <Button id="profile-menu" style={linkStyle}>
              {user.name.first}
            </Button>
            <Menu target="profile-menu" align="right">
              <MenuItem onClick={() => boundPush(`/users/${user._id}`)}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { boundLogOut(); boundPush('/'); }}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Navigation>
      );
    }
    return (
      <Navigation>
        <Link to="/login">Log in</Link>
        <Link to="/signup">Sign up</Link>
      </Navigation>
    );
  }

  render() {
    return (
      <Header
        title={<Link to="/" style={linkStyle}>Documents</Link>}
        className="mdl-shadow--2dp"
        scroll>
        {this.renderLinks()}
      </Header>
    );
  }
}

NavBar.propTypes = {
  user: PropTypes.object,
  logOut: PropTypes.func,
  push: PropTypes.func,
};

export const mapStateToProps = state => {
  const { entities: { users }, authenticatedUser } = state;
  // The data in state.entities.users will always be fresh unlike
  // state.authenticatedUser which might be stale. However, state.entities.users
  // may not have data for the logged in user in case that user only logged in
  // which doesn't update enitities because it returns only a token.
  const userId = authenticatedUser && authenticatedUser._id;
  return {
    user: users[userId] || authenticatedUser,
  };
};

export default connect(
  mapStateToProps, {
    logOut,
    push,
  }
)(NavBar);
