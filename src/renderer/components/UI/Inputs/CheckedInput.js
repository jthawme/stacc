import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import { TYPES } from '../Common/constants';
import "./CheckedInput.scss";
import GenericInput from './GenericInput';
import Button from '../Button/Button';

class CheckedInput extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    local: PropTypes.bool,
    type: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.string,

    checkedEl: PropTypes.node,
    uncheckedEl: PropTypes.node,

    onChange: PropTypes.func,
  };

  static defaultProps = {
    local: false,
    type: TYPES.NORMAL,
    size: 'medium',
    onUpdate: () => {}
  };

  onChange(evt, onChange) {
    onChange(evt.target.checked);
  }

  getIconButton = (value, onChange) => {
    const { checkedEl, uncheckedEl, size } = this.props;
    if (value) {
      return checkedEl ?
        checkedEl :
        <Button size={size} icon={'checkmark'} el="span"/>
    } else {
      return uncheckedEl ?
        uncheckedEl :
        <Button size={size} outlined icon={'close'} el="span"/>
    }
  }

  render() {
    const { className, label, value, type, onUpdate, name, local } = this.props;

    const cls = classNames(
      'checkedinput'
    );

    return (
      <GenericInput
        className={className}
        label={label}
        type={type}
        name={name}
        onUpdate={onUpdate}
        noLine>
        {
          ({ onChange, onBlur, localValue }) => (
            <>
              { this.getIconButton(local ? localValue : value, onChange) }
              <input
                name={name}
                className={cls}
                type="checkbox"
                onChange={e => this.onChange(e, onChange)}
                onBlur={onBlur}
                value={1}
                checked={local ? localValue : value}/>
            </>
          )
        }
      </GenericInput>
    );
  }
}

export default React.memo(CheckedInput);
