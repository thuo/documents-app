import React, { PropTypes } from 'react';
import {
  CardText, Card, CardTitle, CardActions, Button, Textfield, Grid, Cell,
} from 'react-mdl';

const ProfileForm = props => (
  <form onSubmit={props.onSubmit}>
    <Card shadow={0}>
      <CardTitle>Edit Profile</CardTitle>
      <CardActions border style={{ padding: '0' }} />
      <CardText>
        <Grid>
          <Cell col={6}>
            <Textfield
              onChange={props.onFieldChange('firstName')}
              label="First name"
              floatingLabel
              required
              defaultValue={props.values.firstName}
              error={props.errors.firstName}
            />
          </Cell>
          <Cell col={6}>
            <Textfield
              onChange={props.onFieldChange('lastName')}
              label="Last name"
              floatingLabel
              required
              defaultValue={props.values.lastName}
              error={props.errors.lastName}
            />
          </Cell>
          <Cell col={12}>
            <Textfield
              onChange={props.onFieldChange('email')}
              label="Email"
              floatingLabel
              required
              type="email"
              defaultValue={props.values.email}
              error={props.errors.email}
            />
          </Cell>
          <Cell col={12}>
            <Textfield
              onChange={props.onFieldChange('username')}
              label="Username"
              floatingLabel
              defaultValue={props.values.username}
              error={props.errors.username}
            />
          </Cell>
        </Grid>
      </CardText>
      <CardActions border>
        <Button colored onClick={props.onSubmit}>Save</Button>
        {props.onCancel &&
          <Button
            colored
            onClick={e => {
              e.preventDefault();
              props.onCancel();
            }}>
            Cancel
          </Button>}
      </CardActions>
    </Card>
  </form>
);

const fieldsPropType = PropTypes.shape({
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  username: PropTypes.string,
});

ProfileForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  values: fieldsPropType,
  errors: fieldsPropType,
};

export default ProfileForm;
