import React, { PropTypes } from 'react';
import SelectField from 'app/components/util/SelectField';

class DocumentListHeading extends React.Component {

  constructor(props) {
    super(props);
    this.handleAccessChange = this.handleAccessChange.bind(this);
  }

  handleAccessChange(event) {
    this.props.setAccessFilter(event.target.value);
  }

  render() {
    const { accessFilter } = this.props;
    return (
      <div className="app-content doclist__heading">
        <h5 style={{ display: 'inline-block', float: 'left' }} >
          All documents
        </h5>
        <div style={{ display: 'inline-block', float: 'right' }}>
          <SelectField
            options={{
              '': 'Any',
              public: 'Public',
              authenticated: 'Logged In Users',
              private: 'Only Me',
            }}
            value={accessFilter}
            label="Access"
            onChange={this.handleAccessChange}
          />
        </div>
      </div>
    );
  }
}

DocumentListHeading.propTypes = {
  setAccessFilter: PropTypes.func.isRequired,
  accessFilter: PropTypes.string.isRequired,
};

export default DocumentListHeading;
