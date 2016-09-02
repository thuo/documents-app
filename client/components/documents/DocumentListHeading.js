import React, { PropTypes } from 'react';
import { getTextColorClass } from 'react-mdl/lib/utils/palette';

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
          <label htmlFor="access" className={getTextColorClass('teal')}>
            Access
          </label>
          <select
            required
            style={{ width: '100%' }}
            onChange={this.handleAccessChange}
            value={accessFilter}
            id="access">
            <option value="">Any</option>
            <option value="public">Public</option>
            <option value="authenticated">Logged In Users</option>
            <option value="private">Only Me</option>
          </select>
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
