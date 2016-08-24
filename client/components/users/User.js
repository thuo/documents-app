import React, { PropTypes } from 'react';
import Button from 'react-mdl/lib/Button';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import { CardText, Card, CardTitle, CardActions } from 'react-mdl/lib/Card';
import fullName from 'app/utils/fullName';
import { getTextColorClass } from 'react-mdl/lib/utils/palette';

const User = props => (
  <Card shadow={0}>
    <CardTitle>
      {fullName(props.name)}
    </CardTitle>
    <CardActions border style={{ padding: '0' }} />
    <CardText>
      <Grid>
        <Cell col={3}>Username:</Cell>
        <Cell col={9} className={getTextColorClass('black')}>
          <strong>{props.username}</strong>
        </Cell>
      </Grid>
      <Grid>
        <Cell col={3}>Email:</Cell>
        <Cell col={9} className={getTextColorClass('black')}>
          <strong>{props.email}</strong>
        </Cell>
      </Grid>
      <Grid>
        <Cell col={3}>Role:</Cell>
        <Cell col={9} className={getTextColorClass('black')}>
          <strong>{props.role.title || props.role}</strong>
        </Cell>
      </Grid>
    </CardText>
    {(props.canEdit || props.canDelete) &&
      <CardActions border>
        {props.canEdit &&
          <Button colored onClick={props.onEditClick}>Edit</Button>
        }
        {props.canDelete &&
          <Button colored onClick={props.onDeleteClick}>Delete</Button>
        }
      </CardActions>
    }
  </Card>
);

User.propTypes = {
  _id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.object.isRequired,
  role: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default User;
