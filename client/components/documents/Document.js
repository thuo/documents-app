import React, { PropTypes } from 'react';
import { CardText, Card, CardTitle, CardActions, Button } from 'react-mdl';
import DocumentInfo from './DocumentInfo';

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
    <CardActions border style={{ padding: '0' }} />
    <CardText>
      <DocumentInfo {...props} />
    </CardText>
    {(props.canEdit || props.canDelete) &&
      <CardActions>
        {props.canEdit &&
          <Button colored onClick={props.onEditClick}>Edit</Button>
        }
        {props.canDelete &&
          <Button colored onClick={props.onDeleteClick}>Delete</Button>
        }
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
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default Document;
