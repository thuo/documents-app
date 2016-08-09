import React, { PropTypes } from 'react';
import { Snackbar } from 'react-mdl';

const createForm = (submit, validate) => Component => {
  const Form = class extends React.Component {
    constructor(props) {
      super(props);
      const values = this.props.defaultValues || {};
      this.state = {
        values,
        errors: validate(values),
        isSnackbarActive: false,
        snackbarText: '',
      };
      this.handleFieldChange = this.handleFieldChange.bind(this);
      this.validate = this.validate.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.showSnackbar = this.showSnackbar.bind(this);
      this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
      this.hasErrors = this.hasErrors.bind(this);
    }

    handleFieldChange(field) {
      return event => {
        event.preventDefault();
        this.setState({
          values: Object.assign({}, this.state.values, {
            [field]: event.target.value,
          }),
        }, this.validate);
      };
    }

    validate() {
      this.setState({
        errors: validate(this.state.values),
      });
    }

    handleSubmit(event) {
      event.preventDefault();
      if (!this.hasErrors()) {
        submit(this.state.values, this);
      } else {
        this.showSnackbar('There are some errors in the form');
      }
    }

    hasErrors() {
      const { errors } = this.state;
      return Object.keys(errors).some(key => errors[key]);
    }

    showSnackbar(text) {
      this.setState({ isSnackbarActive: true, snackbarText: text });
    }

    handleTimeoutSnackbar() {
      this.setState({ isSnackbarActive: false });
    }

    render() {
      const { values, errors, isSnackbarActive, snackbarText } = this.state;
      return (
        <div>
          <Component
            onFieldChange={this.handleFieldChange}
            onSubmit={this.handleSubmit}
            errors={errors}
            values={values}
            {...this.props}
          />
          <Snackbar
            active={isSnackbarActive}
            onTimeout={this.handleTimeoutSnackbar}>
            {snackbarText}
          </Snackbar>
        </div>
      );
    }
  };
  const displayName = Component.displayName || Component.name || 'Component';
  Form.displayName = `Form(${displayName})`;
  Form.propTypes = {
    defaultValues: PropTypes.object,
  };
  return Form;
};

export default createForm;
