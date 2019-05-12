import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import BtnIcon from '../../Common/Btn/BtnIcon';

// CSS, Requires
import "./OptionNumber.scss";

class OptionNumber extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    min: 0,
    max: 999999
  };

  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  onChange = e => {
    this.changeValue(e.target.value);
  }

  changeValue(val) {
    const { onChange, name, prefix, min, max } = this.props;

    onChange(
      name,
      this.clamp(this.stripPrefix(val, prefix), min, max)
    );
  }

  addPrefix(val, prefix) {
    if (!prefix) {
      return val;
    }

    return `${prefix}${val}`;
  }

  stripPrefix(val, prefix) {
    if (!prefix) {
      return parseInt(val, 10);
    }

    return parseInt(val.substring(prefix.length, val.length), 10);
  }

  modValue(val) {
    this.changeValue(this.addPrefix(this.props.value + val, this.props.prefix));
  }

  render() {
    const { className, min, max, value, prefix, disabled } = this.props;

    const cls = classNames(
      className,
      'optionnumber'
    );

    return (
      <div className={cls}>
        <input
          className="optionnumber__input"
          type="text"
          onChange={this.onChange}
          min={ min }
          max={ max }
          value={ this.addPrefix(value, prefix) }/>

        <BtnIcon
          disabled={disabled}
          icon="remove"
          size="medium"
          className="optionnumber__btn"
          onClick={e => this.modValue(-1)}/>

        <BtnIcon
          disabled={disabled}
          icon="add"
          size="medium"
          className="optionnumber__btn"
          onClick={e => this.modValue(1)}/>
      </div>
    );
  }
}

export default OptionNumber;
