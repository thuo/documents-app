import React, { PropTypes } from 'react';
import {
  CardText, Card, CardTitle, CardActions, Button, Textfield, Grid, Cell,
} from 'react-mdl';

const DocumentForm = props => (
  <form onSubmit={props.onSubmit}>
    <Card shadow={0}>
      <CardTitle>{props.title || 'Add document'}</CardTitle>
      <CardText>
        <Grid>
          <Cell col={12}>
            <Textfield
              onChange={props.onFieldChange('title')}
              label="Title"
              floatingLabel
              required
              defaultValue={props.values.title}
              error={props.errors.title}
            />
          </Cell>
          <Cell col={12}>
            <Textfield
              onChange={props.onFieldChange('content')}
              label="Content"
              floatingLabel
              required
              rows={10}
              defaultValue={props.values.content}
              error={props.errors.content}
            />
          </Cell>
        </Grid>
      </CardText>
      <CardActions>
        <Button colored onClick={props.onSubmit}>
          {props.buttonText || 'Save'}
        </Button>
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
  title: PropTypes.string,
  content: PropTypes.string,
});

DocumentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  values: fieldsPropType,
  errors: fieldsPropType,
  title: PropTypes.string,
  buttonText: PropTypes.string,
  onCancel: PropTypes.func,
};

export default DocumentForm;
