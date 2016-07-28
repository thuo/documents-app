import React from 'react';
import { Header, Navigation } from 'react-mdl';
import { Link } from 'react-router';

const linkStyle = {
  textDecoration: 'none',
  color: '#fff',
};

const NavBar = () => (
  <Header
    title={<Link to="/" style={linkStyle}>Documents</Link>}
    className="mdl-shadow--2dp"
    scroll
  >
    <Navigation>
      <Link to="/signup">Sign up</Link>
    </Navigation>
  </Header>
);

export default NavBar;
