import React, { PropTypes } from 'react';
import Button from 'react-mdl/lib/Button';
import Textfield from 'react-mdl/lib/Textfield';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import { CardText, Card, CardTitle, CardActions } from 'react-mdl/lib/Card';

const LogInForm = props => (
  <form onSubmit={props.onSubmit}>
    <Card shadow={0}>
      <CardTitle>Log In</CardTitle>
      <CardText>
        <Grid>
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
              onChange={props.onFieldChange('password')}
              label="Password"
              floatingLabel
              required
              type="password"
              error={props.errors.password}
            />
          </Cell>
        </Grid>
      </CardText>
      <CardActions>
        <Button colored onClick={props.onSubmit}>Log In</Button>
      </CardActions>
    </Card>
  </form>
);

const fieldsPropType = PropTypes.shape({
  email: PropTypes.string,
  password: PropTypes.string,
});

LogInForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  values: fieldsPropType,
  errors: fieldsPropType,
};

export default LogInForm;
