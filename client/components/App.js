import React, { PropTypes } from 'react';
import Layout from 'react-mdl/lib/Layout/Layout';
import Content from 'react-mdl/lib/Layout/Content';
import NavBar from 'app/containers/NavBar';

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
