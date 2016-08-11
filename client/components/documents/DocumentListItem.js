import React, { PropTypes } from 'react';
import {
  CardText, Card, CardTitle, CardMenu, Menu, MenuItem, IconButton,
} from 'react-mdl';
import { Link } from 'react-router';
import dateTimeLocaleString from 'app/utils/dateTimeLocaleString';
import fullName from 'app/utils/fullName';

const style = {
  margin: '0.75em',
  minHeight: 'auto',
  overflow: 'visible',
  position: 'relative',
};

const trim = (string, maxLength) => {
  if (string.length > maxLength) {
    return `${string.slice(0, maxLength)}...`;
  }
  return string;
};

const Document = props => (
  <Card shadow={0} style={style}>
    <CardTitle style={{ marginRight: '3em' }}>
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
    <CardText
      className="pointer"
      title="Click to view entire document"
      style={{ position: 'relative' }}
      onClick={e => {
        e.preventDefault();
        props.onDocumentClick(props._id);
      }}>
      <p>{trim(props.content, 200)}</p>
    </CardText>
    <CardMenu>
      <IconButton name="more_vert" id={`documents-${props._id}`} />
      <Menu
        target={`documents-${props._id}`}
        align="right">
        <MenuItem
          onClick={() => { props.onDocumentClick(props._id); }}>
          View
        </MenuItem>
        {props.canEdit &&
          <MenuItem onClick={props.onEditClick}>Edit</MenuItem>
        }
        {props.canDelete &&
          <MenuItem onClick={props.onDeleteClick}>Delete</MenuItem>
        }
      </Menu>
    </CardMenu>
  </Card>
);

Document.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default Document;
