import React, { PropTypes } from 'react';
import Button from 'react-mdl/lib/Button';
import Icon from 'react-mdl/lib/Icon';
import Menu, { MenuItem } from 'react-mdl/lib/Menu';
import { getTextColorClass } from 'react-mdl/lib/utils/palette';

class SelectField extends React.Component {
  constructor(props) {
    super(props);
    const { value, options } = this.props;
    this.state = {
      value: value in options && value || Object.keys(options)[0],
    };
    this.changeHandlerFactory = this.changeHandlerFactory.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { value, options } = nextProps;
    this.setState({
      value: value in options && value || Object.keys(options)[0],
    });
  }

  changeHandlerFactory(option) {
    return () => {
      const { onChange } = this.props;
      this.setState({
        value: option,
      }, () => {
        typeof onChange === 'function' && onChange({
          preventDefault: () => {},
          target: {
            value: option,
          },
        });
      });
    };
  }

  render() {
    const { className, options, label, valign } = this.props;
    const { value } = this.state;
    const longestLabelLength = Object.keys(options)
      .reduce((longest, current) => {
        const currentLength = options[current].length;
        return currentLength > longest ? currentLength : longest;
      }, 0);
    const id = label ? label.replace(/\W/g, '-') : Math.random().toString(36);
    return (
      <div
        style={{ position: 'relative' }}
        className={`selectfield ${className || ''}`}>
        {label &&
          <label
            className={getTextColorClass('teal')}>
            {label}
          </label>
        }
        <Button
          id={`selectfield-input-${id}`}
          className="selectfield__input"
          style={{ width: `${longestLabelLength + 1}ch` }}
          onClick={e => { e.preventDefault(); }}>
          {options[value]}
          <Icon name="arrow_drop_down" className="arrow" />
        </Button>
        <Menu target={`selectfield-input-${id}`} align="right" valign={valign}>
          {Object.keys(options).map(option =>
            <MenuItem
              key={option}
              onClick={this.changeHandlerFactory(option)}
              className={option === value ? 'selected' : ''}>
              {options[option]}
            </MenuItem>
          )}
        </Menu>
      </div>
    );
  }
}

SelectField.propTypes = {
  className: PropTypes.string,
  valign: PropTypes.string,
  options: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default SelectField;
