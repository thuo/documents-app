import React, { PropTypes } from 'react';
import { Grid, Cell, Textfield, Button } from 'react-mdl';
import { getTextColorClass } from 'react-mdl/lib/utils/palette';

class DocumentFilter extends React.Component {

  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleAccessChange = this.handleAccessChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleSearchChange(event) {
    this.props.setSearchFilter(event.target.value);
  }

  handleAccessChange(event) {
    this.props.setAccessFilter(event.target.value);
  }

  handleClear(event) {
    event.preventDefault();
    this.props.setAccessFilter('');
    this.props.setSearchFilter('');
  }

  render() {
    const { accessFilter, searchFilter } = this.props;
    return (
      <div className="app-content">
        <Grid >
          <Cell col={6} tablet={12}>
            <Textfield
              onChange={this.handleSearchChange}
              label="Search"
              floatingLabel
              value={searchFilter}
            />
          </Cell>
          <Cell col={4} tablet={12}>
            <div style={{ margin: '6px' }}>
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
          </Cell>
          <Cell col={2} tablet={12}>
            <Button
              raised
              accent
              ripple
              style={{ margin: '8px' }}
              onClick={this.handleClear}>
              Clear Filters
            </Button>
          </Cell>
        </Grid>
      </div>
    );
  }
}

DocumentFilter.propTypes = {
  setAccessFilter: PropTypes.func.isRequired,
  setSearchFilter: PropTypes.func.isRequired,
  accessFilter: PropTypes.string.isRequired,
  searchFilter: PropTypes.string.isRequired,
};

export default DocumentFilter;
