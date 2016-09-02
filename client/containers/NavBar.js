import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import IconButton from 'react-mdl/lib/IconButton';
import Textfield from 'react-mdl/lib/Textfield';
import Header from 'react-mdl/lib/Layout/Header';
import Navigation from 'react-mdl/lib/Layout/Navigation';
import Menu, { MenuItem } from 'react-mdl/lib/Menu';
import Icon from 'react-mdl/lib/Icon';
import { Link } from 'react-router';
import { logOut } from 'app/actions/AuthActions';
import { setDocumentsSearchFilter } from 'app/actions/DocumentActions';

const linkStyle = {
  textDecoration: 'none',
  color: '#fff',
  textTransform: 'none',
};

export class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.renderLinks = this.renderLinks.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(event) {
    const { location, setSearchFilter, push: boundPush } = this.props;
    setSearchFilter(event.target.value);
    if (location !== '/') {
      boundPush('/');
    }
  }

  renderLinks() {
    const { user, logOut: boundLogOut, push: boundPush } = this.props;
    if (user) {
      return (
        <Navigation>
          <div style={{ position: 'relative' }}>
            <IconButton name="more_vert" id="profile-menu" />
            <Menu target="profile-menu" align="right">
              <MenuItem onClick={() => boundPush(`/users/${user._id}`)}>
                My profile
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
    const { push: boundPush, searchFilter } = this.props;
    return (
      <Header
        title={<Link to="/" style={linkStyle}>Documents</Link>}
        className="mdl-shadow--2dp"
        scroll>
        <div
          className="mdl-layout__drawer-button"
          onClick={() => { boundPush('/'); }}>
          <Icon name="description" />
        </div>
        <Textfield
          className="navbar__search"
          onChange={this.handleSearchChange}
          label="Search"
          expandable
          expandableIcon="search"
          inputClassName="navbar__search--input"
          value={searchFilter}
        />
        {this.renderLinks()}
      </Header>
    );
  }
}

NavBar.propTypes = {
  searchFilter: PropTypes.string,
  location: PropTypes.string,
  user: PropTypes.object,
  logOut: PropTypes.func,
  push: PropTypes.func,
  setSearchFilter: PropTypes.func,
};

export const mapStateToProps = (state, ownProps) => {
  const {
    authenticatedUser,
    entities: { users },
    documentList: { searchFilter },
  } = state;
  // The data in state.entities.users will always be fresh unlike
  // state.authenticatedUser which might be stale. However, state.entities.users
  // may not have data for the logged in user in case that user only logged in
  // which doesn't update enitities because it returns only a token.
  const userId = authenticatedUser && authenticatedUser._id;
  return {
    searchFilter,
    user: users[userId] || authenticatedUser,
    location: ownProps.location,
  };
};

export default connect(
  mapStateToProps, {
    logOut,
    push,
    setSearchFilter: setDocumentsSearchFilter,
  }
)(NavBar);
