import React, { PropTypes } from 'react';
import Button from 'react-mdl/lib/Button';
import Textfield from 'react-mdl/lib/Textfield';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import { CardText, Card, CardTitle, CardActions } from 'react-mdl/lib/Card';
import { getTextColorClass } from 'react-mdl/lib/utils/palette';

const DocumentForm = props => (
  <form onSubmit={props.onSubmit}>
    <Card shadow={0}>
      <CardTitle>{props.title || 'Add Document'}</CardTitle>
      <CardActions border style={{ padding: '0' }} />
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
        {props.canEditAccess &&
          <Grid>
            <Cell col={6}>
              <label
                htmlFor="read-access"
                className={getTextColorClass('teal')}>
                Who can read?
              </label>
              <select
                required
                id="read-access"
                onChange={props.onFieldChange('readAccess')}
                defaultValue={props.values.readAccess || 'public'}>
                <option value="public">Public</option>
                <option value="authenticated">Logged In Users</option>
                <option value="private">Only Me</option>
              </select>
            </Cell>
            <Cell col={6}>
              <label
                htmlFor="write-access"
                className={getTextColorClass('teal')}>
                Who can edit?
              </label>
              <select
                required
                id="write-access"
                onChange={props.onFieldChange('writeAccess')}
                defaultValue={props.values.writeAccess || 'private'}>
                <option value="authenticated">Logged In Users</option>
                <option value="private">Only Me</option>
              </select>
            </Cell>
          </Grid>
        }
      </CardText>
      <CardActions border>
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
  canEditAccess: PropTypes.bool,
};

DocumentForm.defaultProps = {
  canEditAccess: true,
};

export default DocumentForm;
