import React, { PropTypes } from 'react';
import { CardText, Card, CardTitle, CardActions, Button } from 'react-mdl';
import { Link } from 'react-router';
import dateTimeLocaleString from 'app/utils/dateTimeLocaleString';
import fullName from 'app/utils/fullName';

const style = {
  margin: '0.75em',
  minHeight: 'auto',
  overflow: 'visible',
};

const Document = props => (
  <Card shadow={0} style={style}>
    <CardTitle>
      {props.title}
    </CardTitle>
    <CardText>
      By{' '}
      <strong>
        <Link to={`/users/${props.owner._id}`}>
          {`${fullName(props.owner.name)}`}
        </Link>
      </strong>{' '}
      at
      <strong>{` ${dateTimeLocaleString(props.createdAt)} `}</strong>
    </CardText>
    {(props.canEdit || props.canDelete) &&
      <CardActions border>
        {props.canEdit &&
          <Button colored onClick={props.onEditClick}>Edit</Button>}
        {props.canDelete &&
          <Button colored>Delete</Button>}
      </CardActions>
    }
    <CardActions border style={{ padding: '0' }} />
    <CardText
      className="mdl-card--border"
      style={{ position: 'relative' }}>
      <p>{props.content}</p>
    </CardText>
  </Card>
);

Document.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  createdAt: PropTypes.string,
  owner: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.object,
  }),
  onEditClick: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default Document;
