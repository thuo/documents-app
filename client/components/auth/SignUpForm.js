import React, { PropTypes } from 'react';
import Button from 'react-mdl/lib/Button';
import Textfield from 'react-mdl/lib/Textfield';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import { CardText, Card, CardTitle, CardActions } from 'react-mdl/lib/Card';

const SignUpForm = props => (
  <form onSubmit={props.onSubmit}>
    <Card shadow={0}>
      <CardTitle>Sign Up</CardTitle>
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
          <Cell col={12}>
            <Textfield
              onChange={props.onFieldChange('password')}
              label="Password"
              floatingLabel
              required
              type="password"
              error={props.errors.password}
            />
          </Cell>
          <Cell col={12}>
            <Textfield
              onChange={props.onFieldChange('confirmPassword')}
              label="Confirm password"
              floatingLabel
              required
              type="password"
              error={props.errors.confirmPassword}
            />
          </Cell>
        </Grid>
      </CardText>
      <CardActions>
        <Button colored onClick={props.onSubmit}>Sign Up</Button>
      </CardActions>
    </Card>
  </form>
);

const fieldsPropType = PropTypes.shape({
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  username: PropTypes.string,
  password: PropTypes.string,
  confirmPassword: PropTypes.string,
});

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  values: fieldsPropType,
  errors: fieldsPropType,
};

export default SignUpForm;
