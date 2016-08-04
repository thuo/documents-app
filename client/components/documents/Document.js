import React, { PropTypes } from 'react';
import { CardText, Card, CardTitle, CardActions, Button } from 'react-mdl';

const style = {
  margin: '1em',
  minHeight: 'auto',
};

const Document = props => (
  <Card shadow={0} style={style}>
    <CardTitle>{props.title}</CardTitle>
    <CardText>
      <p>{props.content}</p>
    </CardText>
    <CardActions>
      <Button colored>View</Button>
    </CardActions>
  </Card>
);

Document.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

export default Document;
