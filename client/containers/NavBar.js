import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Header, Navigation, Menu, MenuItem, Button } from 'react-mdl';
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
    const { user, dispatch } = this.props;
    if (user) {
      return (
        <Navigation>
          <div style={{ position: 'relative' }}>
            <Button id="profile-menu" style={linkStyle}>
              {user.name.first}
            </Button>
            <Menu target="profile-menu" align="right">
              <MenuItem>Profile</MenuItem>
              <MenuItem onClick={() => dispatch(logOut())}>Logout</MenuItem>
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
  dispatch: PropTypes.func,
};

export default connect(
  state => ({ user: state.authenticatedUser })
)(NavBar);
