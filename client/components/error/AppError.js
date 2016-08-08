import React, { PropTypes } from 'react';

const AppError = props => (
  <h2 style={{ textAlign: 'center', margin: '2em auto' }}>
    {props.children}
  </h2>
);

AppError.propTypes = {
  children: PropTypes.node,
};

export default AppError;
