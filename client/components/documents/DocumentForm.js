import React, { PropTypes } from 'react';
import Button from 'react-mdl/lib/Button';
import Textfield from 'react-mdl/lib/Textfield';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import { CardText, Card, CardTitle, CardActions } from 'react-mdl/lib/Card';
import SelectField from 'app/components/util/SelectField';

const DocumentForm = props => (
  <form onSubmit={props.onSubmit}>
    <Card {...(props.showCardShadow ? { shadow: 0 } : {})}>
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
              <SelectField
                options={{
                  public: 'Public',
                  authenticated: 'Logged In Users',
                  private: 'Only Me',
                }}
                value={props.values.readAccess || 'public'}
                label="Who can read?"
                onChange={props.onFieldChange('readAccess')}
                valign="top"
              />
            </Cell>
            <Cell col={6}>
              <SelectField
                options={{
                  authenticated: 'Logged In Users',
                  private: 'Only Me',
                }}
                value={props.values.writeAccess || 'private'}
                label="Who can edit?"
                onChange={props.onFieldChange('writeAccess')}
                valign="top"
              />
            </Cell>
          </Grid>
        }
      </CardText>
      <CardActions border style={{ position: 'relative' }}>
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
  showCardShadow: true,
};

export default DocumentForm;
