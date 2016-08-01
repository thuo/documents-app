import React, { PropTypes } from 'react';
import { Layout, Content } from 'react-mdl';
import NavBar from './NavBar';

const App = props => (
  <Layout fixedHeader>
    <NavBar />
    <Content component="main" className="app-container">
      {props.children}
    </Content>
  </Layout>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
