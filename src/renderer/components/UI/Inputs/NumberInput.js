import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import GenericInput from './GenericInput';
import Button from '../Button/Button';

// CSS, Requires
import { TYPES } from '../Common/constants';
import "./GenericInput.scss";
import "./NumberInput.scss";

class NumberInput extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    local: PropTypes.bool,
    type: PropTypes.string,

    onChange: PropTypes.func,
  };

  static defaultProps = {
    local: false,
    type: TYPES.NORMAL,
    onUpdate: () => {},

    min: 0,
    max: 1000000,
    step: 1
  };

  clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  onChange(evt, onChange) {
    onChange(
      this.clamp(parseInt(evt.target.value), this.props.min, this.props.max)
    );
  }

  mod(val, localValue, onChange) {
    let _val = this.props.local ? localValue + val : this.props.value + val;
    onChange(
      this.clamp(_val, this.props.min, this.props.max)
    );
  }

  render() {
    const { className, label, placeholder, value, local, type, onUpdate, min, max, step, width } = this.props;

    const cls = classNames(
      'ui-input__input'
    );

    return (
      <GenericInput
        className={className}
        local={local}
        label={label}
        type={type}
        onUpdate={onUpdate}
        value={value}
        noLine>
        {
          ({ onChange, onBlur, localValue }) => {
            let _val = local ? localValue : value
            let inputStyle = {
              width: width ? width : `${String(_val).length * 10}px`
            };

            return (
              <div className={'ui-number-input__content'}>
                <Button
                  onClick={e => this.mod(step * -1, localValue, onChange)}
                  rounded
                  type="minimal"
                  icon="remove"/>
                <input
                  style={inputStyle}
                  className={cls}
                  min={min}
                  max={max}
                  step={step}
                  type="number"
                  placeholder={placeholder}
                  onChange={e => this.onChange(e, onChange)}
                  onBlur={onBlur}
                  value={_val}/>
                <Button
                  onClick={e => this.mod(step, localValue, onChange)}
                  rounded
                  type="minimal"
                  icon="add"/>
              </div>
            )
          }
        }
      </GenericInput>
    );
  }
}

export default React.memo(NumberInput);
