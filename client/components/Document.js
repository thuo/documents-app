import React, { PropTypes } from 'react';

const Document = props => (
  <div className="document">
    <h1>{props.title}</h1>
    <p>{props.content}</p>
  </div>
);

Document.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

export default Document;
